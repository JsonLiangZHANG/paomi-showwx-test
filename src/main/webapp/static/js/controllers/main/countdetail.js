'use strict';

stareal
    .controller("CounDetailController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        $scope.a_value = localStorageService.get('a_value')
        $scope.b_value = localStorageService.get('b_value')
        $scope.prize_no = localStorageService.get('prize_no')
    });