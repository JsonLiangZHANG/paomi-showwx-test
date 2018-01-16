'use strict';

stareal
    .controller("TreasureController", function ($scope, $api, $alert, $document,$stateParams, localStorageService, $state,$lazyLoader,$timeout) {

        $scope.datasetData = [
            {option : "这个是第一条数据这个是第一条数据这个是第一条数据"},
            {option : "这个是第二条数据这个是第二条数据这个是第二条数据"},
            {option : "这个是第三条数据这个是第三条数据这个是第三条数据"},
            {option : "这个是第四条数据这个是第四条数据这个是第四条数据"},
            {option : "这个是第五条数据这个是第五条数据这个是第五条数据"},
            {option : "这个是第六条数据这个是第六条数据这个是第六条数据"}
        ]

        $scope.kind = $stateParams.kind;

        $scope.treasures = new $lazyLoader("app/treasure/list/retrieve",{sort:$scope.kind});
        // //过滤进度/最新
        $scope.filter = function (sort) {
            $scope.kind = sort;
            $state.go('main.treasure',{kind:$scope.kind});
        }
        $scope.isActive = function (s) {
            return s== $scope.kind;
        }
        /*即将开奖*/
        $api.get("app/treasure/list/latest")
            .then(function (ret) {
                $scope.latests = ret.data;
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        spaceBetween:0,
                        observer:true//修改swiper自己或子元素时，自动初始化swiper
                    })
                },0)
            })
    });