'use strict';

stareal
    .controller("RegisterController", function ($scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval) {
        $scope.telphone_no = "";
        $scope.accessToken = "";
        $scope.paracont = "获取验证码";
        // $scope.code = "";
        $scope.sendCodeStatus=false;
        $scope.login = {
            sendCode:function (telphone_no) {
                var second = 60;
                var timerHandler = undefined;
                if (!this.validatemobile(telphone_no)) {
                    return;
                }
                if($scope.sendCodeStatus){
                    return;
                }
                // 演出分类
                $api.get("app/login/code/retrieve", {mobile:telphone_no, type: "0"})
                    .then(function (ret) {
                        if (ret.retCode == "0") {
                            $alert.show("验证码已发送!");
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
                            localStorageService.set('code_token', ret.accessToken);
                            // console.log(localStorageService.get('code_token'))
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
            login:function (telphone_no,code,pass){
                if (!this.validatemobile(telphone_no)) {
                    return;
                }
                if (!this.validatepass(pass)) {
                    return;
                }
                if (!localStorageService.get('code_token')) {
                        $alert.show("请先获取验证码！");
                        return false;
                }
                var _params = {
                    mobile:telphone_no,
                    code:code,
                    password:pass,
                    accessToken: localStorageService.get('code_token')
                };
                $api.post("app/login/user/create", _params)
                    .then(function (ret) {
                        $state.go("main.login/",{})
                    }, function (err) {
                        $alert.show(err);
                    });
            },
            validatemobile:function (mobile) {
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
            },
            validatepass:function (pass) {
                if (pass.toString().length<6) {
                    $alert.show('请设置大于6位数密码！');
                    return false;
                }
                if (pass.toString().length>18) {
                    $alert.show('请设置小于18位数密码！');
                    return false;
                }
                return true;
            }
        }
    });