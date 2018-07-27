'use strict';

stareal
    .controller("BindRegisterController", function ($scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval) {
        $scope.telphone_no = "";
        $scope.accessToken = $stateParams.good_id;
        $scope.password = "";
        // $scope.password2 = "";
        //console.log($stateParams.good_id);
        $scope.paracont = "获取验证码";
        $scope.code = "";
        $scope.$watch('code',function (newValue, oldValue) {
            console.log($scope.code);
            if( $scope.code!=''&&$scope.code!=null){
                $scope.isActive =  true;
            }else{
                $scope.isActive =  false;
            }
        });
        $scope.login = {
            sendCode:function () {
                var second = 60;
                var timerHandler = undefined;
                if (!this.validatemobile($scope.telphone_no)) {
                    return;
                }
                // 验证码
                $api.get("app/login/code/retrieve", {mobile:$scope.telphone_no, type: "0"})
                    .then(function (ret) {
                        if (ret.retCode == "0") {
                            $alert.show("验证码已发送!");
                            localStorageService.set('code_token', ret.accessToken);
                        } else {
                            $alert.show("验证码发送失败，请稍后重试!");
                        }
                    });

                if (timerHandler) {
                    return;
                }
                timerHandler = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timerHandler);
                        timerHandler = undefined;
                        second = 60;
                        $scope.paracont = "重发";
                    } else {
                        $scope.paracont = second + "秒";
                        second--;

                    }
                }, 1000, 100)
            },
            login:function (){
                console.log(localStorageService.get('code_token'))
                if (!this.validatemobile($scope.telphone_no)) {
                    return;
                }
                if (!localStorageService.get('code_token')) {
                    $alert.show("请先获取验证码！");
                    return false;
                }
                if (!$scope.code) {
                    $alert.show("验证码不能为空");
                    return false;
                }
                if($scope.password==null&&$scope.password==''&&$scope.password==undefined){
                    $alert.show("密码不能为空");
                    return false;
                }
                if($scope.password.length<=6){
                    $alert.show("请设置大于6位数密码")
                    return false;
                }
                if($scope.password.length>=18){
                    $alert.show("请设置小于于18位数密码")
                    return false;
                }
                // if($scope.password!==$scope.password2){
                //     $alert.show("两次输入的密码不一样");
                //     return false;
                // }
                var _params = {
                    mobile:$scope.telphone_no,
                    code:$scope.code,
                    password:$scope.password,
                    smsToken:localStorageService.get('code_token'),
                    accessToken: $scope.accessToken,
                    openid:localStorageService.get('openid'),
                    plat: 'wx'
                };

                $api.post("app/login/user/bind", _params)
                    .then(function (ret) {
                        $alert.show("绑定成功")
                        // localStorageService.set('isbind','1');
                        //   $state.go('main.login',{},true);
                        $api.post("app/login/user/retrieve",{
                            mobile:$scope.telphone_no,
                            password:$scope.password
                        })
                            .then(function (ret) {
                                localStorageService.set("telphone_no",$scope.telphone_no);
                                localStorageService.set("user",ret); //存储用户信息
                                $scope.accessToken = ret.accessToken;
                                localStorageService.set('login_token', ret.accessToken);
                                localStorageService.set("isbind",'1');
                                $state.go('main.index',{},true);
                                //location.href = "oauth/web?accessToken=" + ret.accessToken + "&state="+encodeURIComponent($stateParams.good_id);
                            }, function (err) {
                                $alert.show(err);
                            });
                    }, function (err) {
                        $alert.show(err);
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