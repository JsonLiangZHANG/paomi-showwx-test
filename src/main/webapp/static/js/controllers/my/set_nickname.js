'use strict';

stareal
    .controller("SetNicknameController", function ($scope, $api, $alert, $state) {
        $scope.save = function () {
            if($scope.nickname==undefined||$scope.nickname==null||$scope.nickname==''){
                $alert.show("昵称不能为空")
                return false
            }
            if($scope.nickname.length>6){
                $alert.show("昵称最多6个字符")
                return false
            }
            $api.get("app/login/userinfo/update", {
                nickname: $scope.nickname
            }, true)
                .then(function (ret) {
                    $alert.show("修改昵称成功")
                    $state.go("my.account_settings")
                }, function (err) {
                    $alert.show(err);
                });
        }
    });