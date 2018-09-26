'use strict';

stareal
    .controller("ResetPasswordController1", function ($scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval) {
        $scope.telphone_no = "";
        $scope.accessToken = "";
        $scope.password = "";
        $scope.password2 = "";
        $scope.paracont = "获取验证码";
        $scope.code = "";
        $scope.sendCodeStatus=false;
        $scope.login = {
            sendCode:function () {
                var second = 60;
                var timerHandler = undefined;
                if (!this.validatemobile($scope.telphone_no)) {
                    return;
                }
                if($scope.sendCodeStatus){
                    return;
                }
                // 验证码
                $api.get("app/login/code/retrieve", {mobile:$scope.telphone_no, type: "0"})
                    .then(function (ret) {
                        if (ret.retCode == "0") {
                            $alert.show("验证码已发送!");
                            localStorageService.set('code_token', ret.accessToken);
                            timerHandler = $interval(function () {
                                if (second <= 0) {
                                    $interval.cancel(timerHandler);
                                    timerHandler = undefined;
                                    second = 60;
                                    $scope.paracont = "重发";
                                    $scope.sendCodeStatus=false;
                                } else {
                                    $scope.sendCodeStatus=true;
                                    $scope.paracont = second + "秒";
                                    second--;

                                }
                            }, 1000, 100)
                            $scope.accessToken = ret.accessToken;
                        } else {
                            $alert.show("验证码发送失败，请稍后重试!");
                        }
                    },function(err){
                        $alert.show(err);
                    });

                // if (timerHandler) {
                //     return;
                // }

            },
            next:function (){
                if (!this.validatemobile($scope.telphone_no)) {
                    return;
                }
                if (!localStorageService.get('code_token')) {
                    $alert.show("请先获取验证码！");
                    return false;
                }
                if (!$scope.code) {
                    $alert.show("验证码不能为空！");
                    return false;
                }
                localStorageService.set("rese_tel",$scope.telphone_no)
                localStorageService.set("rese_code",$scope.code)
                $api.get("app/login/code/retrieve", {mobile:$scope.telphone_no, type: "1", code:$scope.code, smsAccessToken:$scope.accessToken})
                    .then(function (ret) {
                        if (ret.retCode == "0") {
                            $state.go('main.reset_password_2',{});
                        } else {
                            $alert.show("验证码错误");
                        }
                    },function (err) {
                        $alert.show(err)
                    });
            },
            validatemobile:function (mobile) {
                if(!mobile){
                    $alert.show("请输入手机号")
                    return false
                }
                if (mobile.toString().length == 0) {
                    $alert.show('请输入手机号码！');
                    return false;
                }
                if (mobile.toString().length != 11) {
                    $alert.show('请输入11位手机号码！');
                    return false;
                }
                var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
                if (!myreg.test(mobile)) {
                    $alert.show('请输入有效的手机号码！');
                    return false;
                }
                return true;
            }
        }
    });