'use strict';

stareal
    .controller("PrivilegeController", function ($scope, $api, $stateParams, $state, $lazyLoader) {
        $scope.goods = new $lazyLoader("app/list/discount",{direct:'desc'});
    });