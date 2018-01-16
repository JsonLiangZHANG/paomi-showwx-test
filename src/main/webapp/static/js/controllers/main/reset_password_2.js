'use strict';

stareal
    .controller("ResetPasswordController2", function ($scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval) {
        $scope.password = "";
        $scope.password2 = "";
        $scope.login = {
                save:function () {
                    if(!localStorageService.get("rese_tel")||!localStorageService.get("rese_code")||!localStorageService.get('code_token')){
                        $alert.show("请填写正确的手机号或验证码");
                        return false;
                    }
                    if($scope.password==null&&$scope.password==''&&$scope.password==undefined){
                        $alert.show("密码不能为空");
                        return false;
                    }
                    if($scope.password.length<6){
                        $alert.show("请设置大于6位数密码")
                        return false;
                    }
                    if($scope.password.length>18){
                        $alert.show("请设置小于18位数密码")
                        return false;
                    }
                    if($scope.password!==$scope.password2){
                        $alert.show("两次输入的密码不一致");
                        return false;
                    }
                    var regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
                    if (!regExp.test($scope.password)){
                        $alert.show("请设置6~18位字母和数字组合的密码")
                        return false;
                    }
                    var _params = {
                        mobile: localStorageService.get("rese_tel"),
                        code: localStorageService.get("rese_code"),
                        password:$scope.password,
                        smsToken: localStorageService.get('code_token')
                    };
                    $api.post("app/login/user/forget",_params)
                        .then(function (ret) {
                            $alert.show("修改成功");
                            $state.go('main.login',{good_id:''})
                        },function (err) {
                            $alert.show(err)
                        })
                }
        }
    });