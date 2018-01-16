'use strict';

stareal
    .controller("CouponController", function ($scope, $stateParams, $lazyLoader, $api, $alert, $state) {
        $scope.status =$stateParams.status;
        $scope.coupons = new $lazyLoader("app/coupon/list/retrieve", {status:$scope.status}, true);
        //过滤未使用/已过期
        $scope.filter = function (sort) {
            $scope.status = sort;
            $state.go('my.coupon',{status:$scope.status});
        }
        $scope.isActive = function (s) {
            return s== $scope.status;
        }
        $scope.addCoupon = function () {
            $api.get("app/coupon/create", {couponNo: $scope.couponNo}, true)
                .then(function (ret) {
                    $scope.couponNo = '';
                    $state.go("my.coupon", {status:''});
                    $alert.show("添加成功")
                }, function (err) {
                    $alert.show(err);
                    $scope.couponNo = '';
                });
        }
    });