'use strict';

stareal
    .controller("beiliController", function ($scope, $api,$state,localStorageService) {
        //获取我的贝里
        $api.get("app/belly/retrieve",{},true)
            .then(function (ret) {
                console.log(ret)
                $scope.data = ret.data;
                $scope.bellyremain = $scope.data.l3ft;
                $scope.isCheck = $scope.data.check_flag;//是否签到过
                $scope.isComment  = $scope.data.comment_flag;//是否评论过
                $scope.invitation_num = $scope.data.invitation_num//邀请朋友注册的次数

                if($scope.isCheck){
                    $scope.gbs = {color:'#999 '} //领取过
                    $scope.gbn = '已完成'
                }else{
                    // $scope.gbs = {background:'#ed3b3b '} //为完成
                    $scope.gbn = '去完成';
                    $scope.GoIndex = function () {
                        $state.go('my.index', {});
                    }
                }

                if($scope.isComment){
                    $scope.gbs1 = {color:'#999 '} //领取过
                    $scope.gbn1 = '已完成'
                }else{
                    $scope.GoComment = function () {
                        $state.go('main.list', {kind:'',sort:'hot',direct:'desc'});
                    }
                    $scope.gbs1 = {color:'#B0272B '} //领取过
                    $scope.gbn1 = '去完成'
                }
                if($scope.invitation_num > 0){
                    $scope.gbs2 = {color:'#999 '} //领取过
                    $scope.gbn2 = '已完成'
                }else{
                    $scope.GoShare = function () {
                        $state.go('my.share', {});
                    }
                    $scope.gbs2 = {color:'#B0272B '} //领取过
                    $scope.gbn2= '去完成'
                }

            })
    });