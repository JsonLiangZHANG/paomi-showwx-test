'use strict';

stareal
    .controller("PayCouponController", function ($scope, $stateParams, $api, $state, localStorageService) {
        $scope.order_id = $stateParams.order_id;
        $scope.selected = localStorageService.get($scope.order_id + '_coupon_id');
        $scope.xuanzuo=$stateParams.xuanzuo;

        $api.get("app/detail/coupon/retrieve", {id: $stateParams.good_id, total: $stateParams.total}, true)
            .then(function (ret) {
                $scope.coupons = ret.data;
            });

        $scope.select = function (couponId, ratio1, ratio2, type) {
            if($scope.xuanzuo==1){
                localStorageService.set($scope.order_id + '_coupon_id', couponId);
                localStorageService.set($scope.order_id + '_coupon_name', (type == '折扣' ? ratio1 + '折' : ratio2 + '元'));
                $state.go('main.xuan_pay', {order_id: $scope.order_id, _: '_'});
            }else{
                localStorageService.set($scope.order_id + '_coupon_id', couponId);
                localStorageService.set($scope.order_id + '_coupon_name', (type == '折扣' ? ratio1 + '折' : ratio2 + '元'));
                $state.go('main.pay', {order_id: $scope.order_id, _: '_'});
            }

        }
    });