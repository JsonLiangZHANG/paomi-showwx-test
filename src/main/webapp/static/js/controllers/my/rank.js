'use strict';

stareal
    .controller("RankController", function ($scope, $api,$lazyLoader,localStorageService) {
        $scope.beili = localStorageService.get("beili",$scope.bellyremain)
        $scope.ranks = new $lazyLoader("app/belly/getRank",{},true);
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $scope.user = ret.data;
            })
        $api.get("app/belly/getMyRank",{},true)
            .then(function (ret) {
                $scope.pl = ret.data.rank;
            },function (err) {
                $alert.show(err)
            })
    });