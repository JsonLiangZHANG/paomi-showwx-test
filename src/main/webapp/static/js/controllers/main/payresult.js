'use strict';

stareal
    .controller("PayresultController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        $scope.periodId = localStorageService.get('periodId')//期号
        $scope.title= localStorageService.get('title')//标题
        $scope.thumb = localStorageService.get('thumb')//缩略图
        $scope.num = localStorageService.get('num')//数量
        //获取我的贝里余额
        $api.get("app/belly/getL3ft",{},true)
            .then(function (ret) {
                $scope.bellyremain = ret.data.l3ft;
            })
    });