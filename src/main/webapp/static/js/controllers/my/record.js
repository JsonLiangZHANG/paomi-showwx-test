'use strict';

stareal
    .controller("RecordController", function ($scope, $api,$state,$lazyLoader,localStorageService) {
        $scope.beily = localStorageService.get("beili")
        $scope.records = new $lazyLoader("app/belly/getDetails",{},true);
    });