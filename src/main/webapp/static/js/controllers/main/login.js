'use strict';

stareal
    .controller("LoginController", function ($scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval,$rootScope) {
        $scope.cdState = true;  //切换状态
        $scope.telphone_no = "";
        $scope.accessToken = "";
        $scope.paracont = "获取验证码";
        $scope.code = "";
        $scope.sendCodeStatus=false;
        $scope.goBack = function() {
            $rootScope.back()//直接使用

        },
        $scope.login = {
            cd:function () {
                $scope.cdState  = !$scope.cdState
            },
            sendCode:function (telphone_no) {
                var second = 60;
                var timerHandler = undefined;
                if (!this.validatemobile(telphone_no)) {
                    return;
                }
                if($scope.sendCodeStatus){
                    return;
                }
                // 验证码
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
                        } else {
                            $alert.show("验证码发送失败，请稍后重试!");
                        }
                    });
                //
                // if (timerHandler) {
                //     return;
                // }

            },
            login:function (telphone_no,code,state){
                if (!this.validatemobile(telphone_no)) {
                    return;
                }
                if(state==1){//验证码登录
                    if (!localStorageService.get('code_token')) {
                        $alert.show("请先获取验证码！");
                        return false;
                    }
                    console.log(code+'n')
                    var _params = {
                        mobile:telphone_no,
                        code:code,
                        accessToken: localStorageService.get('code_token')
                    };
                }
                if(state==2){//密码登录
                    var _params = {
                        mobile:telphone_no,
                        password:code
                    };
                }
                $api.post("app/login/user/retrieve", _params)
                    .then(function (ret) {
                        localStorageService.set("telphone_no",telphone_no);
                        localStorageService.set("user",ret); //存储用户信息
                        $scope.accessToken = ret.accessToken;
                        localStorageService.set('login_token', ret.accessToken);
                        location.href = "oauth/web?accessToken=" + ret.accessToken + "&state="+encodeURIComponent($stateParams.good_id);
                    }, function (err) {
                        $alert.show(err);
                    });
            },
            speadlogin:function (telphone_no,code,state){
                if (!this.validatemobile(telphone_no)) {
                    return;
                }
                if(state==1){//验证码登录
                    if (!localStorageService.get('code_token')) {
                        $alert.show("请先获取验证码！");
                        return false;
                    }
                    console.log(code+'n')
                    var _params = {
                        mobile:telphone_no,
                        code:code,
                        openId:localStorageService.get('openid'),
                        accessToken: localStorageService.get('code_token')
                    };
                }

                $api.post("app/login/user/retrieve", _params)
                    .then(function (ret) {
                        localStorageService.set("telphone_no",telphone_no);
                        localStorageService.set("user",ret); //存储用户信息
                        $scope.accessToken = ret.accessToken;
                        localStorageService.set('login_token', ret.accessToken);
                        location.href = "oauth/web?accessToken=" + ret.accessToken + "&state="+encodeURIComponent($stateParams.good_id);
                    }, function (err) {
                        $alert.show(err);
                    });
            },
            validatemobile:function (mobile) {
                if(!mobile){
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