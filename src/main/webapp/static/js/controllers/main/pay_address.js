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
        }
    });