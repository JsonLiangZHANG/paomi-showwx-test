'use strict';

stareal
    .controller("PayController", function ($scope, $stateParams, $api,$location, $state, $alert, localStorageService) {
        //获取本地存储
        $scope.title = localStorageService.get('title');//演出标题
        $scope.site_title = localStorageService.get('site_title');//演出地址
        $scope.thumb = localStorageService.get('thumb');//演出图片
        $scope.total = localStorageService.get('total')//总价
        $scope.num = localStorageService.get('num')//数量
       // console.log(11)
        $scope.cat = localStorageService.get('cat')//票面价格
        $scope.date = localStorageService.get('date').replace(/#/g," ")//时间日期
        $scope.seat = localStorageService.get('seat')//座位
        $scope.ticketId =localStorageService.get('ticketId')//演出id
        $scope.price = localStorageService.get('price');//单价
        $scope.is_coupon =localStorageService.get('is_coupon')
        $scope.searchQuery=$location.search();
        $scope.order_id = $scope.searchQuery.order_id;
        $scope.param = {};
        $scope.param.deliverType = 1;
        $scope.param.addressId = '';
        $scope.param.couponId = '';
        $scope.param.beily = ''

        $scope.csl = "0张优惠券可用";
        $scope.copon_price = "0.0";
        $scope.deliver_price = "0.0元";
        $scope.total_price = "0.0元";
        $scope.beily_price = '0.0元';
        $scope.get_ticket_type= localStorageService.get("get_ticket_type");
        if($scope.get_ticket_type!=null&&$scope.get_ticket_type!=undefined&&$scope.get_ticket_type!='') {
            var getTicketType = $scope.get_ticket_type;
            $scope.param.deliverType = getTicketType[0];
            for (var i = 0; i < getTicketType.length; i++) {
                if (getTicketType[i] == 1) {
                    $scope.getTicketType0 = true;
                }
                if (getTicketType[i] == 2) {
                    $scope.getTicketType1 = true;
                }
                if (getTicketType[i] == 3) {
                    $scope.getTicketType2 = true;
                }
            }
        }else{
            $scope.getTicketType0 = true;
            $scope.getTicketType1 = true;
        }
        $scope.GetCard =function(){
            $api.get("app/card/retrieve", {}, true)
                .then(function (ret) {
                    var data=ret.data;
                    for(var i=0;i<data.length;i++){
                        data.selectStatus=false;
                    }
                    $scope.cards = data;
                });
        }
        $scope.GetCard();
        //获取我的贝里余额
        if(localStorageService.get('MYbeilys')==undefined||localStorageService.get('MYbeilys')==null){
            $api.get("app/belly/getL3ft", {}, true)
                .then(function (ret) {
                    $scope.deduction_max = ret.data.l3ft;
                    localStorageService.set('MYbeilys',$scope.deduction_max);
                    $scope.MaxBelly = function (belly) {
                        if(belly>$scope.deduction_max){
                            $scope.param.beily = $scope.deduction_max;
                            $alert.show('最多可使用'+$scope.deduction_max)
                        }
                    }
                })
        }else{
            $scope.deduction_max= localStorageService.get('MYbeilys');
            $scope.MaxBelly = function (belly) {
                if(belly>$scope.deduction_max){
                    $scope.param.beily = $scope.deduction_max;
                    $alert.show('最多可使用'+$scope.deduction_max)
                }
            }
        }


        /**
         *  返显地址
         *  选择地址后,跳转回本页面
         */
        var selectedAddressId = localStorageService.get($scope.order_id + '_address_id');
        if ($stateParams._ && selectedAddressId) {
            $scope.param.addressId = selectedAddressId;

            $api.get("app/address/getbyid", {id: selectedAddressId}, true)
                .then(function (ret) {
                    $scope.address = ret.data;
                });
        }
        else {
            $api.get("app/address/getDefault", {}, true)
                .then(function (ret) {
                    $scope.address = ret.data;
                    var _addressId = ret.data.id;
                    if (_addressId) {
                        $scope.param.addressId = _addressId;
                    }
                });
        }
        // 切换取票方式
        $scope.cd = function (deliverType) {
            if(!$scope.getTicketType0){
                if(deliverType==1){
                    $alert.show('该演出暂不支持快递配送!');
                    return false;
                }
                $scope.param.deliverType = deliverType;
            } else if(!$scope.getTicketType1){
                if(deliverType==2){
                    $alert.show('该演出暂不支持现场取票!');
                    return false;
                }
                $scope.param.deliverType = deliverType;
            }else{
                $scope.param.deliverType = deliverType;
            }
        };
        /**
         *  返显优惠券
         *  选择优惠券后,跳转回本页面
         */
        if($scope.is_coupon==1){
            var selectedCouponId = localStorageService.get($scope.order_id + '_coupon_id');
            if ($stateParams._ && selectedCouponId) {
                $scope.param.couponId = selectedCouponId;
                var selectedCouponName = localStorageService.get($scope.order_id + '_coupon_name');
                $scope.csl = selectedCouponName;
                // $scope.copon_price = selectedCouponName;
            }
            else {
                // 检测可用优惠券
                $api.get("app/detail/coupon/retrieve", {id: $scope.order_id, total: $scope.total}, true)
                    .then(function (ret) {
                        $scope.coupons = ret.data;
                        $scope.csl = ret.data.length + "张优惠券可用";
                    });
            }
        }else{
            $scope.csl ='此项目不可使用优惠券'
        }


        // 跳转到选择优惠券页面
        $scope.cc = function () {
            if($scope.is_coupon==1){
                $state.go('main.pay_coupon', {
                    order_id: $scope.order_id,
                    good_id: $scope.order_id,
                    total: $scope.total,
                    xuanzuo:0
                });
            }else{
                $alert.show("此项目不能使用优惠券")
            }
        };
        //计算价格
        var calculate = function (num, price, deliverType, couponId, addressId, belly) {
            var _params = {num: num, price: price, deliverType: deliverType,good_id:$scope.order_id};
            if (deliverType == 1) {
                _params.addressId = addressId;
            }
            if (couponId) {
                _params.couponId = couponId;
            }
            if (belly) {
                _params.belly = belly
            }
            //$scope.beily_price = localStorageService.get('belly')

            $api.get("app/order/index/calculate", _params, true)
                .then(function (ret) {
                    $scope.beily_price = ret.data.belly_value / 100//贝里值
                    $scope.copon_price = ret.data.coupon_value;//优惠值
                    if(ret.data.express_value==1001){
                        $scope.deliver_price=0;
                        $scope.deliver_priceType=1001;
                        $scope.total_price =  $scope.total;//总价
                        $alert.show('超出配送范围内，请重新选择地址!');
                        //  return;
                    }else{
                        $scope.deliver_priceType =1;
                        $scope.total_price = ret.data.actually_paid;//总价
                        $scope.deliver_price = ret.data.express_value; //快递费
                    }
                });
        };


        // 监听取票方式/地址/优惠券的变化,贝里，实时计算价格
        $scope.$watch('param', function (a, b) {
            if($scope.param.addressId!='') {
                calculate($scope.num, $scope.price, $scope.param.deliverType, $scope.param.couponId, $scope.param.addressId, $scope.param.beily);
            }else{
                $scope.deliver_price =0; //快递费
                $scope.total_price = $scope.total;//总价
                $scope.beily_price = 0//贝里值
                // $alert.show('请填写收货地址!');
            }
        }, true);


        var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge != "undefined") {
            $scope.showPay = true;
            $scope.payType = 0
        } else {
            $scope.payType = 4
        }
        $scope.live_mobile = localStorageService.get("telphone_no");
        //支付前校验信息
        var _params = {ticketId: $scope.ticketId, ticketNum: $scope.num,good_id:$scope.order_id};
        $scope.verify = function () {
           // console.log(798);
            $scope.selectPaypeopleIArrd=[]// 购票人id
            var data=$scope.cards;
            var length=data.length;
            //console.log(data);
            for(var i=0;i<length;i++ ) {
                if(data[i].selectStatus) {
                    $scope.selectPaypeopleIArrd.push(data[i].id);
                }
            }
            // console.log($scope.selectPaypeopleIArrd);
            // console.log($scope.num)
            if($scope.selectPaypeopleIArrd.length!=$scope.num){
                $alert.show('该演出一张票对应一个实名证件号');
                return;
            }
            _params.card_id=$scope.selectPaypeopleIArrd.join(',');
            // 校验
            if( $scope.deliver_priceType==1001){
                $alert.show('超出配送范围内，请重新选择地址!');
                return false;
            }
            // 快递
            if ($scope.param.deliverType == 1) {
                if (!$scope.param.addressId) {
                    $alert.show('请添加收货地址!');
                    return;
                }
                _params.deliverType = 1;
                _params.addressId = $scope.param.addressId;
            }
            // 校验
            // 现场取票
            if ($scope.param.deliverType == 2) {
                if (!$scope.live_name || !$scope.live_mobile) {
                    $alert.show('请填写取票信息!');
                    return;
                }
                if (!myreg.test($scope.live_mobile)) {
                    $alert.show('请输入有效的手机号码！');
                    return false;
                }
                _params.liveName = $scope.live_name;
                _params.liveMobile = $scope.live_mobile;
                _params.deliverType = 2;
            }
            // if($scope.payType==0){
            //     $alert.show('暂不支持微信付款，请在手机浏览器打开！');
            //     return;
            // }
            //校验通过
            var h = $(window).height();
            $(".mask_pay").css({"height":h,"display":"block"}
            );
            $(".pay_box").css({"display":"block"});
        }
        //关闭
        $scope.close = function () {
            $(".mask_pay").fadeOut()
        }
        //冒泡
        $scope.bubble = function ($event){
            $event.stopPropagation()
        }
        $scope.pay = function (type) {
            // 优惠券
            if ($scope.param.couponId) {
                _params.couponId = $scope.param.couponId;
            }
            // 贝里
            if ($scope.param.beily) {
                _params.belly = $scope.param.beily;
            }
            _params.good_id=$scope.order_id;
            //支付宝
            if(type==0){
                //生成订单
                $api.post("app/order/index/create", _params, true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId
                        $api.post("app/pay/gateway/create", {//支付订单
                            orderId: $scope.orderId,
                            tradeType: 0,
                            payType: 4
                        }, true)
                            .then(function (ret) {
                                console.log(ret);
                                document.forms['alipaysubmit'].action = ret.data.action;
                                document.forms['alipaysubmit'].biz_content.value = ret.data.biz_content;
                                document.forms['alipaysubmit'].submit();
                            }, function (err) {
                                $alert.show(err);
                                $state.go("my.orders", {})
                            })
                    }, function (err) {
                        $alert.show(err)
                        $state.go("my.orders", {})
                    })
            }else if(type==1){ //微信h5支付
            //     document.forms['alipaysubmit'].action = data.mweb_url
            // document.forms['alipaysubmit'].submit()
                //生成订单
                $api.post("app/order/index/createorder", _params, true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId
                        $api.post("app/pay/gateway/create", {//支付订单
                            orderId: $scope.orderId,
                            tradeType: 0,
                            payType: 22
                        }, true)
                            .then(function (ret) {
                                console.log(ret);
                                document.forms['alipaysubmit'].action = ret.data.mweb_url
                              //  document.forms['alipaysubmit'].submit();
                            }, function (err) {
                                $alert.show(err);
                                $state.go("my.orders", {})
                            })
                    }, function (err) {
                        $alert.show(err)
                        $state.go("my.orders", {})
                    })
        }
            // if ($scope.payType == 4) {
            //
            // }
            //微信支付
            else if (type==2) {
                //生成订单
                $api.post("app/order/index/create", _params, true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId
                        $api.post("app/pay/gateway/create", {//支付订单
                            orderId: $scope.orderId,
                            tradeType: 0,
                            payType: 0,
                            openid: localStorageService.get('openid')
                        }, true)
                            .then(function (ret) {
                                $(".mask_pay").fadeOut();
                                function onBridgeReady() {
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest',
                                        {
                                            "appId": ret.data.appId,                  //公众号名称，由商户传入wxd39f7e740343d507
                                            "timeStamp": ret.data.timeStamp,          //时间戳，自1970年以来的秒数
                                            "nonceStr": ret.data.nonceStr,            //随机串
                                            "package": ret.data.package,
                                            "signType": ret.data.signType,            //微信签名方式：
                                            "paySign": ret.data.paySign                  //微信签名
                                        }, function (res) {
                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                                //$(".mask_pay").fadeOut();
                                                alert("支付成功!");
                                                $state.go("my.orders", {})
                                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                                alert("您已取消支付,订单将在15分钟后取消!");
                                                $state.go("my.orders", {});
                                            } else {
                                                alert("支付失败: [" + res.err_code + "] " + res.err_desc);
                                                $state.go("my.orders", {});
                                            }
                                        }
                                    );
                                }

                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                } else {
                                    onBridgeReady();
                                }
                            }, function (err) {
                                $alert.show(err);
                                $state.go("my.orders", {})
                            })
                    }, function (err) {
                        $alert.show(err)
                        $state.go("my.orders", {})
                    })
            }
        }


    //    购票人信息
        $scope.text=function(type){
            if(type==1){
                return '身份证';
            }else if(type==2){
                return '护照';
            }else if(type==3){
                return '港澳通行证';
            }else if(type==4){
                return '台胞证';
            }
        }
        $scope.selectNum=0;

        $scope.selctChange=function(id,status){
            var data=$scope.cards;
            for(var i=0;i<data.length;i++ ){
                if(data[i].id==id){
                    if(status){
                        $scope.cards[i].selectStatus=false;
                    }else{
                        $scope.cards[i].selectStatus=true;
                    }
                }
            }
        }
    });