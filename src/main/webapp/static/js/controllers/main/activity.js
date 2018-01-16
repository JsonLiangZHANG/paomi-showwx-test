'use strict';

stareal
    .controller("ActivityController", function ($scope,$interval,localStorageService, $api,$stateParams,$state,$alert) {
        $scope.invite_code = $stateParams.id;

        $scope.paracont = "获取验证码";
        $scope.telphone_no = "";
        $scope.accessToken = "";
        $scope.code = "";
        var second = 60;
        var timerHandler = undefined;
        var myreg = /^1[3|4|5|7|8]\d{9}$/;
        $scope.init = true;  //初始化
        $scope.succeed = false; //成功
        $scope.nothing = false //失败
        $scope.sendCode = function () {
            if (!myreg.test($scope.telphone_no)) {
                $alert.show('请输入有效的手机号码！');
                return false;
            }
            // 演出分类
            $api.get("app/login/code/retrieve", {mobile: $scope.telphone_no, type: "0"})
                .then(function (ret) {
                    if (ret.retCode == "0") {
                        alert("验证码已发送!");
                        localStorageService.set('code_token', ret.accessToken);
                    } else {
                        alert("验证码发送失败，请稍后重试!");
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
                    $scope.paracont = "重发验证码";
                } else {
                    $scope.paracont = second + "秒后可重发";
                    second--;
                }
            }, 1000, 100)
        };

        $scope.login = function () {
            if (!myreg.test($scope.telphone_no)) {
                $alert.show('请输入有效的手机号码！');
                return false;
            }
            if (!localStorageService.get('code_token')) {
                alert("请先获取验证码！");
            }

            var _params = {
                mobile: $scope.telphone_no,
                code: $scope.code,
                accessTokenCode: localStorageService.get('code_token'),
                invite_code:$scope.invite_code,
                source:'wx'
            };

            $api.post("app/share/login", _params)
                .then(function (ret) {
                    if(ret.retCode==0){
                        $scope.init = false;  //初始化
                        $scope.succeed = true; //成功
                        $scope.nothing = false //失败
                    }
                }, function (err) {
                    $alert.show(err)
                    if(err=='该手机号已注册'){ //失败
                        $scope.init = false;  //初始化
                        $scope.succeed = false; //成功
                        $scope.nothing = true //失败
                    }
                });
        }

        // 近期演出
        $api.get("app/main/latest/good")
            .then(function (ret) {
                $scope.latest = ret.data;
                // 调整近期演出,活动,尾票下所有图片比例
                $scope.$on('latestFinishRender', function () {
                    $scope.lst = {'height': angular.element('#lu img:first').width() * 10 / 7 + 'px'};
                });
            });

        //点击弹出二维码
        $scope.mask = false;
        var mo=function(e){e.preventDefault();};
        $scope.showMask = function () {
            $scope.mask = true;
            $('.activity .mask .maskbg').css('top',($(window).height()-$('.activity .mask .maskbg').height()/100*$(window).height())/2)
            document.body.style.overflow='hidden';
            document.addEventListener("touchmove",mo,false);//禁止页面滑动
        }
        $scope.cencel = function () {
            $scope.mask = false;
            document.body.style.overflow='';//出现滚动条
            document.removeEventListener("touchmove",mo,false);
        }

        $api.get("app/login/userinfo/retrieve",{}, true)
            .then(function (ret) {
                $scope.person = ret.data;
                $scope.headimgurl = ret.data.headimgurl;
            });
    });