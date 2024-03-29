'use strict';

stareal
    .controller("ProductSpayController", function ($scope, $stateParams, $api, $state, $alert, localStorageService) {
        //获取本地存储
        $scope.order_id = $stateParams.order_id;
        $scope.productspay = localStorageService.get('productspeedPays');//商品信息
        $scope.productspeeditemsArray=localStorageService.get('productspeeditemsArray');//slu信息
        $scope.productspeedPaysSku =localStorageService.get('skuParr');//商品sku

        // console.log($scope.sumTotal);
        // console.log($scope.productspay.sum);
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

        $scope.max = 6;
        $scope.isActive=true;
        $scope.subNum = function () {
            var num=parseInt($('#num').val());
            if ( $scope.productspay.num == 1) {
                return;
            }

            $scope.productspay.num= $scope.productspay.num - 1;
            // calTotal();
            $scope.param.num=  $scope.productspay.num;
            $scope.productspeeditemsArray[0].pcount=  $scope.productspay.num;
            //  $scope.changeSum();

        };

        $scope.addNum = function () {

            var num=parseInt($('#num').val());
            // if (num == $scope.max) {
            //     $alert.show("最多只能购买"+$scope.max+"个")
            //     return;
            // }
            $scope.productspay.num=  $scope.productspay.num + 1;
            $scope.param.num=  $scope.productspay.num;
            $scope.productspeeditemsArray[0].pcount=  $scope.productspay.num;
            // $scope.changeSum();
        };
        $scope.changeSum=function(){
            $scope.productspay.sum=   $scope.productspay.num* $scope.productspay.price;
        }
        // 计算价格
        var calculate = function (num, price, deliverType, couponId, addressId,belly) {
            var _params = {num: num, price: price, deliverType: deliverType};
            if (deliverType == 1) {
                _params.addressId = addressId;
            }
            if (couponId) {
                _params.couponId = couponId;
            }
            if (belly) {
                _params.belly = belly
            }
            $api.post("app/product/order/balance", {items:JSON.stringify($scope.productspeeditemsArray),addressId:addressId}, true)
                .then(function (ret) {
                    //var productcartOrderDto= new Object();
                    // console.log(ret);
                    var orderDto=ret.data.orderDto
                    $scope.flagaddress=orderDto.flag;
                    $scope.productspay.payFee=orderDto.payFee;
                    $scope.productspay.postFee=orderDto.postFee;
                    $scope.sumTotal =$scope.productspay.payFee;//总价
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
            if($scope.param.addressId!='') {
                calculate($scope.param.num, $scope.param.price, $scope.param.deliverType, $scope.param.couponId, $scope.param.addressId, $scope.param.beily);
            } else{
                $scope.productspay.postFee =0; //快递费
                $scope.sumTotal =$scope.productspay.num* $scope.productspay.price;//总价
                //  $alert.show('请填写收货地址!');
            }
        }, true);
        //监控数据
        // $scope.$watch('productspay',function(newValue,oldValue,scope){
        //     $scope.sumTotal=0; //总计
        //     var sumN = newValue.num * newValue.price; //计算出新的结果
        //     $scope.productspay.sum = sumN.toFixed(2); //保留两位小数并且把它赋值给元数据;
        //     $scope.sumTotal += sumN+ $scope.productspay.postFee;
        //     console.log( $scope.sumTotal);
        // },true);

        /**
         *  返显地址
         *  选择地址后,跳转回本页面
         */
        var selectedAddressId = localStorageService.get($scope.order_id + '_address_id');
        if ($stateParams._ && selectedAddressId) {
            $scope.param.addressId = selectedAddressId;
            console.log( $scope.param.addressId);

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
        var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        /**
         * 下单
         */

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
            items:JSON.stringify( $scope.productspeeditemsArray),
            products: $scope.productspay.id
        };
        $scope.verify = function () {
            console.log($scope.param.addressId);
            // 校验
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
                                $state.go("my.productorders", {});
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
                                                $state.go("my.productorders", {});
                                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                                alert("您已取消支付,订单将在15分钟后取消!");
                                                $state.go("my.productorders", {});
                                            } else {
                                                alert("支付失败: [" + res.err_code + "] " + res.err_desc);
                                                $state.go("my.productorders", {});
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