'use strict';
stareal
    .controller("ProductCarController", function ($rootScope,$scope,$http,$compile,$interval,$stateParams,$location,$anchorScroll,$api, $sce, base64, $state, $alert, localStorageService,FileUploader) {
        $scope.selectAll=true;//全选默认为true
        $scope.cartList=[];//定义一个全局数组
        $scope.cartListLength=0;//购物车数量
        $scope.getCartList=function(){
            $api.post("app/cart/list", {}, true)
                .then(function (ret) {
                    $scope.cartList=ret.data;
                    // console.log($scope.cartList);
                    if($scope.cartList.length==0){
                        $scope.cartListLength=0;
                        $scope.selectAll=false;//全选默认为true
                    }else{
                        $scope.cartListLength=$scope.cartList.length;
                        $scope.selectAll=true;//全选默认为true
                    }

                }, function (err) {
                    $alert.show(err)

                })
        }
        $scope.changeShow=function(index){
            console.log(index);
            angular.element('.show_'+index).css("display","none");
            angular.element('.hide_'+index).css("display","block");
        }
        $scope.changeHide=function(index){
            angular.element('.show_'+index).css("display","block");
            angular.element('.hide_'+index).css("display","none");
        }

        $scope.getCartList();
        $scope.completecarRepeat=function(){//单个删除
            console.log( angular.element(".session-box"));
            $(".session-box").slide2del({
                sItemClass: ".session-box",
                sDelBtnClass: ".del-btn",
                delHandler: function (target) {
                    var text = target.find('.session-content').attr('data-id');
                    $api.post("app/cart/delete", {ids:text}, true)
                        .then(function (ret) {
                            $scope.getCartList();
                        }, function (err) {
                            $alert.show(err)

                        })

                     // target.remove();

                },
                itemClickHandler: function (target) {
                    // console.log("你点击了选项：" + target.text());
                }
            });
        }

        $scope.max = 6;
        $scope.num = 1;
        $scope.isActive=true;
        $scope.subNum = function (id) {
            // console.log(id);

            var num=parseInt($('#'+id).val());
            if ( num == 1) {
                $alert.show("至少购买1件!")
                return;
            }

            $scope.cartList[id].quantity= num - 1;
            // calTotal();
            $scope.changeSum(id);

        };

        $scope.addNum = function (id) {
            // console.log(id);

            var num=parseInt($('#'+id).val());
            // console.log(num);
            if (num == $scope.max) {
                $alert.show("最多只能购买"+$scope.max+"件!")
                return;
            }
            $scope.cartList[id].quantity= num + 1;
            $scope.changeSum(id);
        };
        //删除商品
        // $scope.deleteProduct= function (ids){ //单个删除
        //
        // }
        $scope.deleteProducts= function (){ //批量删除
            var productdeletCart=[];//选删除的商品
            for(var i=0;i<$scope.cartList.length;i++){
                if($scope.cartList[i].selected==true){
                    productdeletCart.push($scope.cartList[i].id);
                }
            }
            if(productdeletCart==[]){
                $alert.show("请选择删除的商品！");
                return;
            }
            var ids=productdeletCart.join('#');
            $api.post("app/cart/delete", {ids:ids}, true)
                .then(function (ret) {
                    $scope.getCartList();
                }, function (err) {
                    $alert.show(err)

                })
        }
        $scope.changeSum=function(id){
            $scope.cartList[id].count= $scope.cartList[id].quantity * $scope.cartList[id].goodPrice;
        }
        //全选按钮check的点击事件
        $scope.selectAllClick= function (sa) {
            // console.log(sa)
            if(sa==false){
                $scope.selectAll=true;
            }else {
                $scope.selectAll=false;
            }
            // if(sa){
            for(var i=0;i<$scope.cartList.length;i++){
                $scope.cartList[i].selected= $scope.selectAll;
            }
            // }

        }
        //单个数据的check事件
        $scope.echoChange=function(id,ch,se){
            $scope.cartList[id].selected=!ch;
            //当所有都选中时，全选也要被勾选
            var cc=0;//计算当前数组中checked为真的数目
            for(var i=0;i<$scope.cartList.length;i++){
//  if($scope.cartList[i].checked==true){
//   cc++;
//  }
                $scope.cartList[i].selected?cc++:cc;
            }
            $scope.selectAll=(cc==$scope.cartList.length);//当为真的数目=数组长度时，证明全部勾选
//  console.log($scope.selectAll);
        }
        //监控数据
        $scope.$watch('cartList',function(newValue,oldValue,scope){
            $scope.sumTotal=0; //总计
            $scope.jishuqi=0; //计数器
            for(var i in newValue) {
                var sumN = newValue[i].quantity * newValue[i].goodPrice; //计算出新的结果
                $scope.cartList[i].sum = sumN.toFixed(2); //保留两位小数并且把它赋值给元数据;
                if (newValue[i].selected) {
                    $scope.sumTotal +=sumN;
                    $scope.jishuqi++;
                    // console.log($scope.sumTotal);
                    // console.log($scope.jishuqi);
                }
            }
            $scope.sumTotal=$scope.sumTotal.toFixed(2);
        },true);

        //    结算main.productcar
        $scope.Settlement=function(){
            // console.log($scope.cartList);
            var productCart=[];//选购买的商品
            var itemsArray=[];//选购商品信息
            for(var i=0;i<$scope.cartList.length;i++){
                if($scope.cartList[i].selected==true){
                    productCart.push($scope.cartList[i]);
                    var entity = new Object();
                    var productId = $scope.cartList[i].goodId;
                    var pcount =$scope.cartList[i].quantity;
                    var speciArray = new Array();
                    $.each($scope.cartList[i].specificationValues,function(index ,data){
                        var speciEntity = new Object();
                        speciEntity.spvId =data.id;
                        speciArray.push(speciEntity);
                    })
                    entity.productId = productId;
                    entity.pcount = pcount;
                    if(speciArray.length>0){
                        entity.speci = JSON.stringify(speciArray);
                    }
                    itemsArray.push(entity);
                }
            }
            localStorageService.set('productitemsArray',itemsArray);
            localStorageService.set('productcart',productCart);
            localStorageService.set('productTotalPrice',$scope.sumTotal);
            $state.go('main.productpay',{},{reload:true});
            // $api.post("app/product/order/balance", {items:JSON.stringify(itemsArray)}, true)
            //     .then(function (ret) {
            //         //var productcartOrderDto= new Object();
            //         // console.log(ret);
            //         var orderDto=ret.data.orderDto
            //         var  productcartOrderDtopostFee=orderDto.postFee;
            //         var  productcartOrderDtopayFee=orderDto.payFee;
            //         localStorageService.set('productcartOrderDtopostFee',productcartOrderDtopostFee);
            //         localStorageService.set('productcartOrderDtopayFee',productcartOrderDtopayFee);
            //         localStorageService.set('productitemsArray',itemsArray);
            //         localStorageService.set('productcart',productCart);
            //         localStorageService.set('productTotalPrice',$scope.sumTotal);
            //         $state.go('main.productpay',{},{reload:true});
            //     }, function (err) {
            //         $alert.show(err)
            //
            //     })
            //  console.log(itemsArray);
            //  console.log("----------11444----------");
            // console.log(productCart);

        }
    });