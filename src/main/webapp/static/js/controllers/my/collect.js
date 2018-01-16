'use strict';

stareal
    .controller("CollectController", function ($scope, $lazyLoader, $api, $state,$alert) {
        $scope.goods = new $lazyLoader("app/favor/list",{},true);
    });