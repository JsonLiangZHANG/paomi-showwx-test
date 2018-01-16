'use strict';

stareal
    .controller("PartakeController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,$lazyLoader) {
        $scope.partakes = new $lazyLoader("app/treasure/list/details",{periodId:$stateParams.award_id});
    });