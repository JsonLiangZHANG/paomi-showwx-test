'use strict';

stareal
    .controller("RechargeController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert, localStorageService) {
        $scope.telphone_no = localStorageService.get("telphone_no");
        $scope.a = 10;
        $scope.price = 5;//初始化价格
        $scope.filter = function (price,a) {
            $scope.a = a;
            $scope.price  = price;//转换为元
        }
        /*失去焦点计算钱*/
        $scope.blurPrice = function (price) {
                if(price==undefined){
                    console.log(798)
                    $scope.price  = 0;
                    $scope.Iptprice = 0;
                    return false;
                }
                if(price<5){
                    $alert.show('最少5元')
                    $scope.price  = 5;
                    $scope.Iptprice = 5;
                    return false;
                }
                if(price>50){
                    $alert.show('最多50元')
                    $scope.price  = 50;
                    $scope.Iptprice = 50;
                    return false;
                }
            $scope.price  = price;//转换为元
        }
        $scope.isActive = function (s) {
            return s== $scope.a;
        }
        //支付弹窗
        $scope.verify = function () {
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
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge != "undefined") {
            $scope.showPay = true;
            $scope.payType = 0
        }else{
            $scope.showPay = false;
            $scope.payType = 4
        }
        /*确认付款*/
        $scope.pay = function () {
            //支付宝
            if($scope.payType==4){
                //生成订单
                $api.post("app/belly/order/create",{total:$scope.price},true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId;
                        var _params = {orderId:$scope.orderId,tradeType:2}
                        _params.payType = 4;
                        //支付订单
                        $api.post("app/pay/gateway/create",_params,true)
                            .then(function (ret) {
                                document.forms['alipaysubmit'].action = ret.data.action;
                                document.forms['alipaysubmit'].biz_content.value = ret.data.biz_content;
                                document.forms['alipaysubmit'].submit();
                                //$state.go("main.rechargeresult",{})
                            },function (err) {
                                $alert.show(err)
                            })
                    },function (err) {
                        $alert.show(err)
                    })
            }
            //微信支付
            if($scope.payType==0){
                //生成订单
                $api.post("app/belly/order/create",{total:$scope.price},true)
                    .then(function (ret) {
                        $scope.orderId = ret.data.orderId;
                        //支付订单
                        $api.post("app/pay/gateway/create",{
                            orderId: $scope.orderId,
                            tradeType: 2,
                            payType: 0,
                            openid: localStorageService.get('openid')
                        },true)
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
                            })
                    },function (err) {
                        $alert.show(err)
                    })
            }
        }
    });