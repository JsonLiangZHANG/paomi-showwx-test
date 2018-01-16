'use strict';

stareal
    .controller("MyController", function ($scope, $api, localStorageService) {
        $scope.mypage = 4;
        $scope.bellyremain;
        // $scope.user = localStorageService.get("user");
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $scope.user = ret.data;
            });
        //获取我的贝里余额
        $api.get("app/belly/getL3ft",{},true)
            .then(function (ret) {
                $scope.bellyremain = ret.data.l3ft;
                localStorageService.set("beili",$scope.bellyremain)
            })
        //连续签到可获得贝里
        $api.post("app/member/checkin/getCheckTips",{},true)
            .then(function (ret) {
                $scope.daybeily = ret.data;
            })
        $scope.sign_state = localStorageService.get("sign-state")
        //获取会员信息
        $api.get("app/member/index/retrieve",{},true)
            .then(function (ret) {
                $scope.level_name = ret.data.level_name
                $scope.member = ret.data.level;
                if($scope.member==1){
                    $scope.grade = '普通会员';
                    $scope.icon_member = 'vip_ordinary';
                }
                if($scope.member==2){
                    $scope.grade = '白银会员';
                    $scope.icon_member = 'vip_silver';
                }
                if($scope.member==3){
                    $scope.grade = '黄金会员'
                    $scope.icon_member = 'vip_gold';
                }
                if($scope.member==4){
                    $scope.grade = '铂金会员';
                    $scope.icon_member = 'vip_platinum';
                }
                if($scope.member==5){
                    $scope.grade = '钻石会员';
                    $scope.icon_member = 'vip_diamond';
                }
            })
        $scope.sign = function (bellyremain,todaybeily) {  //签到向下传播
            $scope.$broadcast('to-child');
            $scope.bellyremain = parseInt(bellyremain)+parseInt(todaybeily);
            localStorageService.set("beili",$scope.bellyremain);
            $scope.sign_state = 2;
        }
    });