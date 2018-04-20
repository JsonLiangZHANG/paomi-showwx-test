'use strict';

stareal
    .controller("ListController", function ($scope, $api, $stateParams, $state, $lazyLoader,$timeout) {
        $scope.mypage = 2;
        $scope.listpage= 1;
        $scope.kind = $stateParams.kind;
        $scope.sort = $stateParams.sort;
        $scope.direct = $stateParams.direct;
        $scope.isHot = ($scope.sort == 'hot');
        $scope.sf = false;
        $scope.toggle = function () {
            $scope.sf = !$scope.sf;
        }

        // 加载导航栏
        $api.get("app/main/category/retrieve")
            .then(function (ret) {
                var nav  = ret.data;
                $scope.navs = nav;
                $timeout(function () {
                    var swiper = new Swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        spaceBetween:0,
                        observer:true//修改swiper自己或子元素时，自动初始化swiper
                    })
                },0)
            });

        // 加载对应演出种类的内容
        $scope.goods = new $lazyLoader("app/search/list/index", {
            kind: ($scope.kind == 'all'?'':$scope.kind),
            sort: $scope.sort,
            direct: $scope.direct
        });

        var refresh = function(){
            $state.go('main.list',{kind:$scope.kind,sort:$scope.sort,direct:$scope.direct});
        };


        // 点击导航栏
        $scope.switch = function(kind){
            console.log($stateParams);
            $scope.kind = kind;
            refresh();
        };

        // 热度/时间排序过滤
        $scope.filter = function (sort,direct) {
            $scope.sort = sort;
            $scope.direct = direct;
            $scope.isHot = ($scope.sort == 'hot');
            refresh();
        }

        // 调整当前Nav的位置
        $scope.$on('navFinishRender', function () {
            var index = ($stateParams.kind != 'all' ? parseInt($stateParams.kind) + 1 : 0);
            var winW = document.documentElement.clientWidth;
            var oNav = document.getElementById("swiper-wrapper");
            if (index>=5){
                for (var j=0; j<index;j++){
                    oNav.style.transform = "translate3d(-8.2666rem, 0px, 0px)";
                }
            }
        });
    });