'use strict';

stareal
    .controller("ProductRefundController", function ($scope, $stateParams, $api, $state, $alert, localStorageService,$interval,$window) {
        $scope.orderId = $stateParams.id;
        $scope.refundReason='';
        $api.get("app/product/order/detail",{orderId:$scope.orderId},true)
            .then(function (ret) {
                $scope.good = ret.orderDetail;
                console.log($scope.good);
                $scope.param = {};
            })
        // 弹窗开始
        var timer = null;
        $scope.result = function (time) {
            $scope.create_time = time*1000;
            var expiredTime =  $scope.create_time+15*60*1000;//过期时间戳
            var nowDate =  Date.parse(new Date());//现在时间戳
            $scope.date = expiredTime-nowDate;
            timer = $interval(updateTime,1000)
            updateTime()
            function updateTime(){
                $scope.date -= 1000;
                if($scope.date<=0){
                    $interval.cancel(timer);
                    $alert.show('商品已过期');
                    $scope.close();
                    $scope.good.state = '已取消'
                }
            }
            //校验通过
            var h = document.body.scrollHeight;
            $(".mask").css({"height":h,"display":"block"}
            );
            $(".mask .alert_box").css({"display":"block"});
        };
        //关闭弹窗
        $scope.close = function () {
            $(".mask").fadeOut();
            $interval.cancel(timer);
        };
        // 选择退款原因
        $scope.change = function($event,value){
            var imgs = document.getElementsByClassName("img");
            for(var i = 0;i<imgs.length;i++){
                $(imgs[i]).attr("src","static/img/Group 5.png");
            }
            $($event.target).attr("src","static/img/order_complete.png");
            $scope.refundReason = $($event.target).prev()[0].innerText;
        }
        $scope.alertsure = function(){
            $(".mask").fadeOut();
            $interval.cancel(timer);
        }
    });