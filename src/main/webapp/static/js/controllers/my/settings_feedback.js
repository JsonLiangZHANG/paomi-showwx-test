/**
 * Created by jaylee on 16/7/27.
 */
'use strict';

stareal
    .controller("SettingsFeedbackController", function ($scope, $api, $alert, $state, localStorageService) {
        $scope.telphone_no = localStorageService.get("telphone_no");
        $scope.save = function () {
            if (!$scope.remark) {
                $alert.show('请输入反馈内容!');
                return;
            }
            $api.get("app/feedback/create", {
                remark: $scope.remark
            }, true)
                .then(function (ret) {
                    $alert.show("您的意见是我们前进的动力!", function () {
                        $state.go("my.index", {});
                    }, true);
                }, function (err) {
                    $alert.show(err);
                });
        }
    });