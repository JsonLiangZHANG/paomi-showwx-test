'use strict';

stareal
    .controller("PreciousController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,$lazyLoader) {
        $scope.kind = $stateParams.kind;

        $scope.treasures = new $lazyLoader("app/treasure/list/my",{status:$scope.kind},true);

        // //过滤进度/最新
        $scope.filter = function (sort) {
            $scope.kind = sort;
            $state.go('my.precious',{kind:$scope.kind});
        }
        $scope.isActive = function (s) {
            return s== $scope.kind;
        }

        //获取我的夺宝记录
        // var refresh = function (data) {
        //     $api.get("app/treasure/list/my",{status:data},true)
        //         .then(function (ret) {
        //             console.log(ret)
        //             $scope.treasures = ret.data;
        //         })
        // }
        // refresh()//初始化
        // //过滤正则进行中/已揭晓
        // $scope.filter = function (sort,a) {
        //     $scope.a = a;
        //     refresh(sort)
        // }
        // //添加active
        // $scope.isActive = function (s) {
        //     return s== $scope.a;
        // }



        /*跳转夺宝详情*/
        $scope.GoAward = function (id) {
            $state.go("main.award",{award_id:id})
        }
    });