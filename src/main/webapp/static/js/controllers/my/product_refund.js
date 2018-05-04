'use strict';

stareal
    .controller("ProductRefundController", function ($scope, $stateParams, $api, $state, $alert, localStorageService,$interval,$window,FileUploader) {
        $scope.orderId = $stateParams.id;
        $scope.refundReason='';
        $scope.pay_type='';
        $api.get("app/product/order/detail",{orderId:$scope.orderId},true)
            .then(function (ret) {
                $scope.good = ret.orderDetail;
                $scope.pay_type=ret.orderDetail.pay_type;
                console.log($scope.pay_type);
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
        //退款
        $scope.submit = function () {
            if($scope.refundReason==""){
                $alert.show('退款理由不能为空！');
                return false;
            }
            var _param={
                reason:$scope.refundReason,
                remark:$("#remark").val(),
                orderId:$scope.orderId,
                tradeType:5,
                payType:''
            }
            if($scope.pay_type==1){ //微信
                _param.payType=9;
            }else if(($scope.pay_type==2)){ //支付宝
                _param.payType=8;
            }
            $api.get("app/pay/gateway/refund",_param, true)
                .then(function (ret) {
                    console.log(ret);

                    if(ret.data.return_code=="10000"||ret.data.return_code=="SUCCESS"){
                        $alert.show(ret.data.return_msg);
                        $state.go('my.product_order', {id:$scope.orderId});
                    }else{
                        $alert.show(ret.data.return_msg);
                    }
                }, function (err) {
                    $alert.show(err);
                })
        }
        //退货
        //上传图片
        var token = localStorageService.get('token')
        // var url = 'https://api.mydeershow.com/mobile/app/upload/image?accessToken='+token;//正式
        var url = 'http://192.168.1.4/mobile/app/upload/image?accessToken='+token;//测试
        var uploader = $scope.uploader = new FileUploader({
            url:url,
            alias:'image',
            queueLimit:6
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        })
        var img_str = ''
        $scope.submit0 = function () {
            if (!localStorageService.get('token')) {
                $scope.$broadcast('to-child');
                return false;
            }
            if($scope.refundReason==""){
                $alert.show('退款理由不能为空！');
                return false;
            }
            if(uploader.queue.length!=0){//选择了图片
                //上传
                uploader.uploadAll()
                //上传每一个
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    if(img_str==''||undefined){
                        img_str = response.url
                    }else{
                        img_str = img_str+','+response.url;
                    }
                    console.log(img_str);
                };
                //上传总进度
                uploader.onProgressAll = function(progress) {
                    if(progress!=100){
                        angular.element(".img_load_mask").show();
                    }
                    if(progress==100){
                        angular.element(".img_load_mask").hide();
                    }
                };
                //全部上传成功
                uploader.onCompleteAll = function() {
                    console.log("图片上传成功 ");
                    uploader.clearQueue();//清除上传的张数
                    var _param={
                        refund_reason:$scope.refundReason,
                        refund_remark:$("#remark").val(),
                        refund_url:img_str,
                        order_id:$scope.orderId,
                        // tradeType:5,
                        // payType:''
                    }
                    $api.get("app/product/order/returnProduct",_param, true)
                        .then(function (ret) {
                            console.log(ret);
                            $alert.show('订单退货申请成功！')
                            $state.go('my.product_order', {id:$scope.orderId});
                        }, function (err) {
                            $alert.show(err);
                        })
                };
            }else{//没有选择图片
                  $alert.show("请选择凭证!");

            }

        }

    });