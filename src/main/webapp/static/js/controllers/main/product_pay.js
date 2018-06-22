'use strict';

stareal
    .controller("ProductPayController", function ($scope, $stateParams, $api, $state, $alert, localStorageService) {
        //获取本地存储
        $scope.productcart = localStorageService.get('productcart');//商品信息
        $scope.total = localStorageService.get('productTotalPrice');//总价
        // $scope.productcartOrderDtopostFee=localStorageService.get('productcartOrderDtopostFee');//订单信息
        // $scope.productcartOrderDtopayFee=localStorageService.get('productcartOrderDtopayFee');//订单信息
        $scope.productitemsArray= localStorageService.get('productitemsArray');//确认订单信息
        console.log( $scope.productcart);
        $scope.param = {};
        $scope.productIdArr=[];
        $scope.param.deliverType = 1;
        $scope.param.addressId = '';
        $scope.param.couponId = '';
        $scope.param.beily = ''

        $scope.csl = "0张优惠券可用";
        $scope.copon_price = "0.0";
        $scope.deliver_price = "0.0元";
        $scope.total_price = "0.0元";
        $scope.beily_price = '0.0元';
        //获取我的贝里余额
        $api.get("app/belly/getL3ft", {}, true)
            .then(function (ret) {
                $scope.deduction_max = ret.data.l3ft;
                $scope.MaxBelly = function (belly) {
                    if(belly>$scope.deduction_max){
                        $scope.param.beily = $scope.deduction_max;
                        $alert.show('最多可使用'+$scope.deduction_max)
                    }
                }
            })

        /**
         *  返显地址
         *  选择地址后,跳转回本页面
         */
        var selectedAddressId = localStorageService.get('productPayId_address_id');
        if (selectedAddressId) {
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
            $scope.param.deliverType = deliverType;
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
                    total: $scope.total
                });
            }else{
                $alert.show("此项目不能使用优惠券")
            }
        };
        // 计算价格
        var calculate = function ( addressId) {
            // var _params = {num: num, price: price, deliverType: deliverType,good_id:$scope.order_id };
            // if (deliverType == 1) {
            //     _params.addressId = addressId;
            // }
            /*  if (couponId) {
                  _params.couponId = couponId;
              }*/
            /* if (belly) {
                 _params.belly = belly
             }*/
            $api.post("app/product/order/balance", {items:JSON.stringify($scope.productitemsArray),addressId:addressId}, true)
                .then(function (ret) {
                    //var productcartOrderDto= new Object();
                    // console.log(ret);
                    var orderDto=ret.data.orderDto
                    $scope.flagaddress=orderDto.flag;
                    var  productcartOrderDtopostFee=orderDto.postFee;
                    var  productcartOrderDtopayFee=orderDto.payFee;
                    $scope.productcartOrderDtopostFee=productcartOrderDtopostFee;//订单信息
                    $scope.productcartOrderDtopayFee=productcartOrderDtopayFee;//订单信息
                    // localStorageService.set('productcartOrderDtopostFee',productcartOrderDtopostFee);
                    //  localStorageService.set('productcartOrderDtopayFee',productcartOrderDtopayFee);
                    if($scope.flagaddress=='0'){
                        $alert.show('超出配送范围内，请重新选择地址!');
                        return false;
                    }
                }, function (err) {
                    $alert.show(err)

                })
        };


        // 监听取票方式/地址/优惠券的变化,实时计算价格
        $scope.$watch('param', function (a, b) {
            calculate($scope.param.addressId);
        }, true);


        var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        /**
         * 下单
         */
        for(var i=0;i< $scope.productitemsArray.length;i++){
            $scope.productIdArr[i]=$scope.productitemsArray[i].productId;
        }
        $scope.myreg = /^1[3|4|5|7|8]\d{9}$/;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge != "undefined") {
            $scope.showPay = true;
            $scope.payType = 0
        } else {
            $scope.payType = 4
        }
        $scope.live_mobile = localStorageService.get("telphone_no");
        //支付前校验信息
        var _params = {
            addressId:"",
            memo : $("#message_leave").val(),
            items:JSON.stringify( $scope.productitemsArray),
            products: $scope.productIdArr.join(",")
        };
        $scope.verify = function () {
            console.log($scope.param.addressId);
            // 校验
            // 快递
            // 快递
            if($scope.flagaddress=='0'){
                $alert.show('超出配送范围内，请重新选择地址!');
                return false;
            }
            if (!$scope.param.addressId) {
                    $alert.show('请添加收货地址!');
                    return;
                }
            _params.addressId=$scope.param.addressId;
                // _params.deliverType = 1;
                // _params.addressId = $scope.param.addressId;

            // 校验
            // 现场取票
            // if ($scope.param.deliverType == 2) {
            //     if (!$scope.live_name || !$scope.live_mobile) {
            //         $alert.show('请填写取票信息!');
            //         return;
            //     }
            //     if (!myreg.test($scope.live_mobile)) {
            //         $alert.show('请输入有效的手机号码！');
            //         return false;
            //     }
            //     _params.liveName = $scope.live_name;
            //     _params.liveMobile = $scope.live_mobile;
            //     _params.deliverType = 2;
            // }
            //校验通过
            var h = document.body.scrollHeight;
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
        $scope.pay = function () {

            // // 优惠券
            // if ($scope.param.couponId) {
            //     _params.couponId = $scope.param.couponId;
            // }
            // // 贝里
            // if ($scope.param.beily) {
            //     _params.belly = $scope.param.beily;
            // }
            //支付宝
            if ($scope.payType == 4) {
                //生成订单
                $api.post("app/product/order/create", _params, true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId
                        $api.post("app/pay/gateway/create", {//支付订单
                            orderId: $scope.orderId,
                            tradeType: 4,
                            payType: 4
                        }, true)
                            .then(function (ret) {
                                document.forms['alipaysubmit'].action = ret.data.action;
                                document.forms['alipaysubmit'].biz_content.value = ret.data.biz_content;
                                document.forms['alipaysubmit'].submit();
                            }, function (err) {
                                $alert.show(err);
                              //  $state.go("my.orders", {})
                            })
                    }, function (err) {
                        $alert.show(err)
                        //$state.go("my.orders", {})
                    })
            }
            //微信支付
            if ($scope.payType == 0) {
                //生成订单
                $api.post("app/product/order/create", _params, true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId
                        $api.post("app/pay/gateway/create", {//支付订单
                            orderId: $scope.orderId,
                            tradeType:4,
                            payType: 0,
                            openid: localStorageService.get('openid')
                        }, true)
                            .then(function (ret) {
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
                                                alert("支付成功!");
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
                               // $state.go("my.orders", {})
                            })
                    }, function (err) {
                        $alert.show(err)
                      //  $state.go("my.orders", {})
                    })
            }
        }
    });