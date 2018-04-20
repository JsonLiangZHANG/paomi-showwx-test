'use strict';

stareal
    .controller("ProductsOrdersController", function ($scope, $lazyLoader, $api, $state,$alert,$stateParams,$timeout,$interval,$window,localStorageService) {
        $scope.status = $stateParams.status;
        $scope.order_status=$stateParams.order_status;
        $scope.payment_status=$stateParams.payment_status;
        $scope.shipping_status=$stateParams.shipping_status;

        $scope.orders = new $lazyLoader("app/product/order/list", {status:$scope.status,order_status:$scope.order_status,payment_status:$scope.payment_status,shipping_status:$scope.shipping_status}, true);
        //取消订单
        $scope.cancelOrder = function (order_id,order) {
            if($scope.orders.items.indexOf(order)!=-1){
                var index = $scope.orders.items.indexOf(order);
                $api.post("app/product/order/cancel", {orderId:order_id}, true)
                    .then(function (ret) {
                      $scope.orders.items[index].status='已取消'
                        $alert.show('取消成功')
                    }, function (err) {
                        $alert.show(err)
                    });
            }
        };
        //删除订单
        $scope.deleteOrder = function (order_id,order) {
            if($scope.orders.items.indexOf(order)!=-1){
                var index = $scope.orders.items.indexOf(order);
                $api.post("app/product/order/delete",{orderId:order_id},true)
                    .then(function (ret) {
                        $scope.orders.items.splice(index,1)
                        $alert.show('删除成功')
                    },function (err) {
                        $alert.show(err)
                    })
            }
        }
        //确认收货
        $scope.donelOrder = function (order_id,order) {
            if($scope.orders.items.indexOf(order)!=-1){
                var index = $scope.orders.items.indexOf(order);
                $api.post("app/product/order/done", {orderId:order_id}, true)
                    .then(function (ret) {
                        $scope.orders.items[index].status='已完成'
                    }, function (err) {
                        $alert.show(err)
                    });
            }
        };
        // 开始弹窗
        var timer=null;
        $scope.verify = function (order_id,time,order) {
            //校验通过
            $scope.orderId = order_id;
            $scope.created = Date.parse(new Date(time.replace(/-/gi,'/')))//兼容ios问题
            var expiredTime =  $scope.created+15*60*1000;//过期时间戳
            var nowDate =  Date.parse(new Date());//现在时间戳
            $scope.date = expiredTime-nowDate;
            timer = $interval(updateTime,1000)
            updateTime()
            function updateTime() {
                $scope.date -= 1000;
                if($scope.date<=0){
                    $interval.cancel(timer);
                    $alert.show('商品已过期');
                    $scope.close();
                    $window.location.reload();
                  //  $scope.cancelOrder(order_id,order);

                }
            }
            var h = document.body.scrollHeight;
            $(".mask_pay").css({"height":h,"display":"block"}
            );
            $(".pay_box").css({"display":"block"});
        }
        $scope.close = function () {
            $(".mask_pay").fadeOut();
            $interval.cancel(timer);//关闭定时器
           // $window.location.reload();
        }
        //冒泡
        $scope.bubble = function ($event){
            $event.stopPropagation()
        }

        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge != "undefined") {
            $scope.showPay = true;
            $scope.payType = 0
        } else {
            $scope.payType = 4
        }
        //支付订单
        $scope.pay = function () {
            console.log($scope.orderId)
            ///支付宝
            if($scope.payType==4){
                //支付
                $api.post("app/pay/gateway/create", {
                    orderId: $scope.orderId,
                    tradeType: 0,
                    payType: 4
                }, true)
                    .then(function (ret) {
                        document.forms['alipaysubmit'].action = ret.data.action;
                        document.forms['alipaysubmit'].biz_content.value = ret.data.biz_content;
                        document.forms['alipaysubmit'].submit();
                    }, function (err) {
                        $alert.show(err);
                        $state.go("my.orders", {})
                    })
            }
            //微信支付
            if($scope.payType==0){
                $api.post("app/pay/gateway/create",{
                    orderId: $scope.orderId,
                    tradeType: 0,
                    payType: 0,
                    openid: localStorageService.get('openid')
                },true)
                    .then(function (ret) {
                        function onBridgeReady() {
                            $(".mask_pay").fadeOut();
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
                                        // $(".mask_pay").fadeOut();
                                        alert("支付成功!");
                                        // $scope.showpay = false;
                                        $state.reload('my.orders');
                                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                        alert("您已取消支付,订单将在15分钟后取消!");
                                        $state.go("my.orders", {});
                                    } else {
                                        console.log(res.err_code);
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
                    },function (err) {
                        $alert.show(err)
                    })
            }
        }
    });