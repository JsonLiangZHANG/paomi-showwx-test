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
                    $scope.gbs = {background:'#999 '} //领取过
                    $scope.gbn = '已完成'
                }else{
                    // $scope.gbs = {background:'#ed3b3b '} //为完成
                    $scope.gbn = '去完成';
                    $scope.GoIndex = function () {
                        $state.go('my.index', {});
                    }
                }

                if($scope.isComment){
                    $scope.gbs1 = {background:'#999 '} //领取过
                    $scope.gbn1 = '已完成'
                }else{
                    $scope.GoComment = function () {
                        $state.go('main.list', {kind:'0',sort:'hot',direct:'desc'});
                    }
                    // $scope.gbs1 = {background:'#ed3b3b '} //领取过
                    $scope.gbn1 = '去完成'
                }

            })
    });