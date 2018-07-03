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
                $scope.GetCheck();
            })
        //连续签到可获得贝里
        $scope.GetCheck = function () {
            $api.get("app/member/checkin/thismonth",{},true)
                .then(function (ret) {
                    $scope.Sameday = ret.data
                    $scope.days = $scope.Sameday.length //当月共签到天数
                    $scope.Isday = [];  //需不需给默认值
                    for(var i =0;i<$scope.days;i++){
                        $scope.Isday.push($scope.Sameday[i].date.substring(6,8))
                    }
                    //日历函数
                    var d_Date = new Date();
                    var d_y = d_Date.getFullYear();
                    var d_m = d_Date.getMonth()+1;
                    var d_d = d_Date.getDate();
                    if(Number($scope.Isday[0])<Number(d_d)||$scope.Isday[0]==undefined){//和当天比较
                        $scope.showRIlInfo = true;   //没签到
                       // localStorageService.set("sign-state","1")
                        $scope.sign_state=1
                       // $scope.qianSign();
                    }else{
                        $scope.showRIlInfo = false;  //已签到
                        $scope.sign_state=2
                        //localStorageService.set("sign-state","2")
                    }


                })
        }
        $api.post("app/member/checkin/getCheckTips",{},true)
            .then(function (ret) {
                $scope.daybeily = ret.data;
            })
       // $scope.sign_state = localStorageService.get("sign-state")
        console.log('----------------')
        console.log($scope.sign_state);
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