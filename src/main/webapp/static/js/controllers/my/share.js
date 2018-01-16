'use strict';

stareal
    .controller("ShareController", function ($scope, $api,$state) {
            //生成分享链接
        $scope.share = function () {
            $api.post("app/share/create",{},true)
                .then(function (ret) {
                    $scope.qrCode = ret.data
                })
        }
    });