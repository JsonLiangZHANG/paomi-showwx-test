'use strict';

stareal
    .controller("LogisticsController", function ($scope, $api,$stateParams,$alert) {
        $scope.orderId = $stateParams.order_id;
        $api.get("app/order/shunfeng/retrieve",{orderId:$scope.orderId},true)
            .then(function (ret) {
                $scope.express = ret.data;
                $scope.invoice = ret.invoice
                $scope.show = false;
            },function (err) {
                $scope.invoice ='-----------'
                $alert.show(err)
                $scope.show = true;
            })
    });