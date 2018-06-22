'use strict';

stareal
    .controller("MenberController", function ($scope, $api,$alert) {
        //我的会员
        //获取会员信息
        $scope.GetMember = function () {
            $api.get("app/member/index/retrieve",{},true)
                .then(function (ret) {
                    console.log(ret)
                    $scope.member = ret.data;
                    $scope.level = $scope.member.level;
                    $scope.isCoupon = $scope.member.coupon_flag;//是否可以领取会员专属优惠券
                    $scope.value = $scope.member.value;
                    if($scope.level==1){
                        $scope.Grade = '普通'
                        $scope.UpGrade = '白银';
                        $scope.bar = $scope.value/1000*100;
                        $scope.barcolor = {background:'#FB5E83 '};
                        $scope.bar_icon = "vip_ordinary";
                    }
                    if($scope.level==2){
                        $scope.Grade = '白银'
                        $scope.UpGrade = '黄金';
                        $scope.bar = ($scope.value-1001)/2000*100;
                        $scope.barcolor = {background:'#FB5E83 '}
                        $scope.bar_icon = "vip_silver";
                    }
                    if($scope.level==3){
                        $scope.Grade = '黄金'
                        $scope.UpGrade = '铂金';
                        $scope.bar = ($scope.value-3001)/3000*100;
                        $scope.barcolor = {background:'#FFEB3B '}
                        $scope.bar_icon = "vip_gold";
                    }
                    if($scope.level==4){
                        $scope.Grade = '铂金'
                        $scope.UpGrade = '钻石';
                        $scope.bar = ($scope.value-6001)/9000*100;
                        $scope.barcolor = {background:'#B7EDDF '}
                        $scope.bar_icon = "vip_platinum";
                    }
                    if($scope.level==5){
                        $scope.Grade = '钻石'
                        $scope.UpGrade = '钻石';
                        $scope.maxlevele = true;
                        $scope.bar = 100;
                        $scope.barcolor = {background:'#CCD7FA '}
                        $scope.bar_icon = "vip_diamond";
                    }
                    if($scope.isCoupon){
                        // $scope.gbs = {background:'#ed3b3b '} //领取过
                        $scope.gbn = '可领取'
                    }else{
                        $scope.gbs = {background:'#cfcfcf '} //领取过
                        $scope.gbn = '已领取'
                    }
                })
        }
        $scope.GetMember()
        //领取优惠券
        $scope.GetCoupon = function () {
            $api.get("app/member/coupon/retrieve",{},true)
                .then(function (ret) {
                    $scope.GetMember()
                    $alert.show('已领取')
                },function (err) {
                    $alert.show(err)
                })
        }
    });