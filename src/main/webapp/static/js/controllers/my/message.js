'use strict';

stareal
    .controller("MessageController", function ($scope, $api, $stateParams, $state, $lazyLoader,$alert) {
        $scope.mypage = 3;
        $api.get("app/notify/getUnreadNums",{},true)
            .then(function (ret) {
                $scope.notify = ret.data;
            },function (err) {
                $alert.show(err)
            })
    });