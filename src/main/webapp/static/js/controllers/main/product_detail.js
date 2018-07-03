'use strict';

stareal
    .controller("ProductDetailController", function ($scope,$timeout, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        $scope.deliverIndeType=2;
        $scope.current = $stateParams.good_id;
        $scope.deliverType = 1;
        $scope.productSkus='';
        $scope.priceTotal='';
        $scope.skuTrue=true;
        $scope.imgIngdex=-1;
        $scope.productGood='';
        localStorageService.set("img_temp", "");
        $scope.GetGood = function () {
            console.log("hjhhhhj");
            //app/product/detail
            $api.get("app/product/detail", {id:$stateParams.good_id}, true)
                .then(function (ret) {
                    console.log("---------------------");
                    console.log(ret);
                    var good = ret.data;
                    console.log(good);
                    good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                    $scope.good = good;
                    $scope.productGood=good;
                    $scope.skuTrue=$scope.good.is_unified_spec;
                    $scope.priceTotal=good.price;
                    $scope.price=good.price;

                }, function (err) {
                    $alert.show(err)

                });
        };

        //获取商品sku
        $scope.GetGoodSku = function () {
            $api.post("app/product/getsku", {
                id:$stateParams.good_id
                // id:'20'
            }, true)
                .then(function (ret) {
                    console.log(ret);
                    var productSKU=ret.data;
                    $scope.productSkus=productSKU;
                }, function (err) {
                    $alert.show(err)

                })

        }
        //获取图片列表
        $scope.GetGoodPic = function () {
            $api.post("app/product/image", {
                id:$stateParams.good_id
                // id:'20'
            }, true)
                .then(function (ret) {
                    console.log(ret);
                    $scope.productPic=ret.data;
                }, function (err) {
                    $alert.show(err)

                })

        }
        //获取购物车数量
        $scope.GetGoodCarCount = function () {
            $api.post("app/product/cartcount", {
            }, true)
                .then(function (ret) {
                    console.log(ret);
                    $scope.cartcount=ret.cartcount;
                }, function (err) {
                    $alert.show(err)
                })
        }

        $scope.GetGood();
        $scope.GetGoodPic();
        $scope.GetGoodSku();
        if(!localStorageService.get('token')){
            $scope.carNum=false;
        }else{
            $scope.carNum=true;
            $scope.GetGoodCarCount();
        }
        //项目评分星星
        //购物车
        $scope.max = 6;
        $scope.num = 1;
        $scope.buy=false;
        $scope.isActive=true;
        $scope.skUarr=new Array();
        $scope.skUnamearr=new Array();
        $scope.skUcararr=new Array();
        $scope.skuParr=new Array();
        //选择商品的sku
        $scope.swithSku=function(parindex,index,id){
            // console.log(parent);
            //console.log(parindex);
            //console.log(index);
            // $scope.index=inde
            angular.element("#productSkuValue_"+id).addClass("active").siblings().removeClass("active");
            //console.log(angular.element("#productSkuValue_"+id).parent().attr("data-id"));
            //console.log($scope.productSkus.length);
            var entity = new Object();
            var entityname=new Object();
            entity.sfId = angular.element("#productSkuValue_"+id).parent().attr("data-id");
            entity.spvId = id;
            entityname.sfId=angular.element("#productSkuValue_"+id).parent().attr("data-id");
            entityname.spvId=id;
            entityname.spvnName=angular.element("#productSkuValue_"+id).html();
            $scope.skuParr[parindex]=entityname;
            $scope.skUcararr[parindex]=entity;
            if($scope.skUarr[parindex]!=id){
                $scope.skUarr[parindex]=id;
                $scope.skUnamearr[parindex]=entityname.spvnName;
                //localStorageService.set('skUarr', $scope.skUarr);
                if($scope.skUarr.length==$scope.productSkus.length){
                    var spid= $scope.skUarr.join(',');
                    console.log(spid);
                    $scope.skuName= $scope.skUnamearr.join('/');
                    $scope.skuStock(spid);

                }
            }

        }
        //请求库存 (根据sku)
        $scope.skuStock=function(spid){
            $api.post("app/product/stocks", {
                id:$stateParams.good_id,
                spid:spid

            }, true)
                .then(function (ret) {
                    $scope.good.price=ret.price;
                    $scope.good.stock=ret.stock;
                    $scope.price=ret.price;
                    $scope.priceTotal=$scope.num*ret.price;
                }, function (err) {
                    $alert.show(err)

                })
        }
        // $scope.skus=[{name:'颜色',id:"0"},{name:'大小',id:"1"}];
        $scope.addcar=function(){
            if(!localStorageService.get('token')){
                var  rs = "main.productdetail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断是否是微信浏览器
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wx7b0222c401e61396&" +
                        "redirect_uri=http%3A%2F%2Fm.amazingmusicals.com%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

                } else {
                    location.href = "#/main/login/"+ encodeURIComponent(rs);
                }

                return;
            }
            $scope.buy=false;
            angular.element('#product_mask').fadeIn();
            angular.element('#product_mask .alert_box').css('display','block');
        }
        $scope.close = function () {
            // angular.element('.alert_box').animate({bottom:-alertHe},200);
            angular.element('#product_mask').fadeOut();
        }
        $scope.subNum = function () {
            if ($scope.num == 1) {
                $alert.show("至少购买"+$scope.num+"件");
                return;
            }
            $scope.num = $scope.num - 1;
            $scope.changeTotal( $scope.num);
        };

        $scope.addNum = function () {
            if ($scope.num == $scope.max) {
                $alert.show("最多只能购买"+$scope.max+"件");
                return;
            }
            else if( $scope.num>=$scope.good.stock){
                $alert.show("该商品库存不足！");
                return;
            }
            $scope.num = $scope.num + 1;
            $scope.changeTotal( $scope.num);
        };
        //计算小计
        $scope.changeTotal=function(num){
            $scope.priceTotal=num* $scope.price;
        }
        //查看购物车
        $scope.goCar=function(){
            if(!localStorageService.get('token')){
                var  rs = "main.productdetail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断是否是微信浏览器
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wx7b0222c401e61396&" +
                        "redirect_uri=http%3A%2F%2Fm.amazingmusicals.com%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

                } else {
                    location.href = "#/main/login/"+ encodeURIComponent(rs);
                }

                return;
            }
            $state.go('main.productcar');
        }
        $scope.Productspay=function(){
            if(!localStorageService.get('token')){
                var  rs = "main.productdetail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断是否是微信浏览器
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wx7b0222c401e61396&" +
                        "redirect_uri=http%3A%2F%2Fm.amazingmusicals.com%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

                } else {
                    location.href = "#/main/login/"+ encodeURIComponent(rs);
                }

                return;
            }
            $scope.buy=true;
            angular.element('#product_mask').fadeIn();
            angular.element('#product_mask .alert_box').css('display','block');
        }
        $scope.productCarAdd = function(){//购物车加一个
            if(!$scope.skuTrue){
                if($scope.skUarr.length !=$scope.productSkus.length){
                    $alert.show("请选择商品规格");
                    return;
                }
            }
            var speciStr = JSON.stringify($scope.skUcararr);
            console.log("-----------------------------");
            console.log(speciStr);
            $api.get("app/cart/add",{
                id: $stateParams.good_id,
                speci: speciStr,
                quantity: $scope.num
                // price: $scope.price

            }, true)
                .then(function (ret) {
                    $scope.cartcount++;
                    $alert.show("添加购物车"+ret.message);
                    angular.element('#product_mask').fadeOut();
                }, function (err) {
                    $alert.show(err)

                })
        }
        $scope.productSpeedpay=function(){//立即购买
            if(!localStorageService.get('token')){
                var  rs = "main.productdetail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断是否是微信浏览器
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wx7b0222c401e61396&" +
                        "redirect_uri=http%3A%2F%2Fm.amazingmusicals.com%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

                } else {
                    location.href = "#/main/login/"+ encodeURIComponent(rs);
                }

                return;
            }else {
                if (!$scope.skuTrue) {
                    if ($scope.skUarr.length != $scope.productSkus.length) {
                        $alert.show("请选择商品规格");
                        return;
                    }
                }
                // console.log("2222222222222");
                var productspeedPays = new Object();
                // productspeedPays={id:0,imgURL:'http://image.mydeershow.com/0.jpg',name:'商品科技经济困境很好看经济环境',price:10,sku:'红色  M  2份',num:5,sum:50,checked:false};//选购买的商品
                productspeedPays.id = $stateParams.good_id;
                productspeedPays.imgURL= $scope.productGood.image;
                productspeedPays.name=$scope.productGood.name;
                productspeedPays.num=$scope.num;
                productspeedPays.sum=$scope.priceTotal;
                productspeedPays.price=$scope.price;
                productspeedPays.good_name=$scope.productGood.good_name;
                productspeedPays.sku='';
                for(var i=0;i<$scope.skuParr.length;i++){
                    productspeedPays.sku+=$scope.skuParr[i].spvnName;
                    // console.log($scope.skuParr[i]);
                }
                //获取快递费
                var itemsArray=[];//选购商品信息
                var entity = new Object();
                var productId = $stateParams.good_id;
                var pcount =$scope.num;
                var speciArray = new Array();
                $.each($scope.skuParr,function(index ,data){
                    var speciEntity = new Object();
                    speciEntity.spvId =data.spvId;
                    speciArray.push(speciEntity);
                })
                entity.productId = productId;
                entity.pcount = pcount;
                if(speciArray.length>0){
                    entity.speci = JSON.stringify(speciArray);
                }
                itemsArray.push(entity);
                // console.log(productspeedPays);
                localStorageService.set('productspeedPays', productspeedPays);
                localStorageService.set('productspeeditemsArray',itemsArray);
                localStorageService.set('skuParr',$scope.skuParr);
                $state.go('main.productspay',{order_id:$stateParams.good_id},{reload:true});
                // $api.post("app/product/order/balance", {items:JSON.stringify(itemsArray)}, true)
                //     .then(function (ret) {
                //         //var productcartOrderDto= new Object();
                //         // console.log(ret);
                //         var orderDto=ret.data.orderDto;
                //         // console.log("很久很久很久机会");
                //         // console.log(orderDto);
                //         // console.log($scope.skuParr);
                //         // console.log(productspeedPays);
                //         productspeedPays.payFee=orderDto.payFee;
                //         productspeedPays.postFee=orderDto.postFee;
                //         localStorageService.set('productspeedPays', productspeedPays);
                //         localStorageService.set('productspeeditemsArray',itemsArray);
                //         localStorageService.set('skuParr',$scope.skuParr);
                //         $state.go('main.productspay',{order_id:$stateParams.good_id},{reload:true});
                //     }, function (err) {
                //         $alert.show(err)
                //
                //     })
            }
        }
        // $scope.productSpeedpay=function(){//立即购买
        //     console.log("2222222222222");
        //     var productspeedPays={id:0,imgURL:'http://image.mydeershow.com/0.jpg',name:'商品科技经济困境很好看经济环境',price:10,sku:'红色  M  2份',count:5,sum:50,checked:false};//选购买的商品
        //     var sku_length=angular.element("#mask1 .sku_ul li");
        //     var sku_slected=angular.element("#mask1 .sku_ul li span.active");
        //     if(sku_slected && sku_slected.length==sku_length.length){
        //         localStorageService.set('productspeedPays',productspeedPays);
        //         localStorageService.set('productspeedPaysTotalPrice',productspeedPays);
        //         $state.go('main.productspay');
        //     }else{
        //         $alert.show("请选择sku信息");
        //     }
        //
        // }
        //分享
        //微信分享http://192.168.1.4:9090/oauth/getSignature
        $api.get("app/share/getSignature",{url: window.location.href.split('#')[0]})
            .then(function (ret) {

                if (ret) {
                    console.log(ret);
                    var data=ret.data;
                    console.log('-------------------------------');
                    console.log(data);
                    console.log(data.appid);
                    console.log(data.timestamp);
                    console.log(data.nonceStr);
                    console.log(data.signature);

                    wx.config({
                        debug: false,
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            // 'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });
                    wx.ready(function(){
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: '上海魅鲸文化传播有限公司', // 分享标题
                            desc: '魅鲸文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.amazingmusicals.com/static/img/download2.png', // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                //alert('你好');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('你好....');
                            }
                        });
                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title: '上海魅鲸文化传播有限公司', // 分享标题
                            desc: '魅鲸文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.amazingmusicals.com/static/img/download2.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
// 用户确认分享后执行的回调函数
                                // alert('你好....');
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '上海魅鲸文化传播有限公司', // 分享标题
                            desc: '魅鲸文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.amazingmusicals.com/static/img/download2.png', // 分享图标
                            success: function () {
// 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '上海魅鲸文化传播有限公司', // 分享标题
                            desc: '魅鲸文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.amazingmusicals.com/static/img/download2.png', // 分享图标
                            success: function () {
// 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                    });
                    wx.error(function(res){
                        //console.log(res);
                        //alert("微信分享接口配置失败");
                    });
                }
            })
    });