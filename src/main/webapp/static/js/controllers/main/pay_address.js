'use strict';

stareal
    .controller("PayAddressController", function ($scope, $stateParams, $api, $state, localStorageService) {

        $scope.order_id = $stateParams.order_id;
        $scope.src = $stateParams.src;
        $api.get("app/address/retrieve", {}, true)
            .then(function (ret) {
                $scope.addresses = ret.data;
            });

        $scope.select = function (addressId) {
            localStorageService.set($scope.order_id + '_address_id', addressId);
            if($scope.src==1){
                $state.go('main.pay', {order_id: $scope.order_id, _: '_'});
            }
            if($scope.src==2){
                $state.go('main.paying', {});
            }
            if($scope.src==3){//购物车 支付 衍生品
                $state.go('main.productpay', { _: '_'});
            }
            if($scope.src==4){//立即支付  衍生 品
                $state.go('main.productspay',{order_id: $scope.order_id, _: '_'});
            }
            if($scope.src==5){//在线选座
                $state.go('main.xuanpay',{order_id: $scope.order_id, _: '_'});
            }
        }
    });