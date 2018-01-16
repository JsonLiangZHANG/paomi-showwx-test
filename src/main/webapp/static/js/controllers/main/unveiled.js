'use strict';

stareal
    .controller("UnveiledController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,$lazyLoader) {
        //获取往期揭晓
        // $api.get("app/treasure/list/past")
        //         .then(function (ret) {
        //             $scope.unveils = ret.data;
        //         })
        $scope.unveils = new $lazyLoader("app/treasure/list/past",{},true);
    });