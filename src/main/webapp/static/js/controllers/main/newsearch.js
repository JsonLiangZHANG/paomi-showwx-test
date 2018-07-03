'use strict';

stareal
    .controller("NewsSearchController", function ($scope, $api, $stateParams, $timeout, $lazyLoader,localStorageService) {
        // 展现热词
        $scope.hwf = true;
        // // 加载热词
        // $api.get("app/search/hot/retrieve")
        //     .then(function (ret) {
        //         $scope.hots = ret.data;
        //     });
        //历史搜索
        $scope.history_list =new Array(8);
        $scope.history_list = JSON.parse(localStorageService.get("newlist"));
        if($scope.history_list){
            $scope.history = $scope.history_list;
        }else{
            $scope.history = [];
        }
        // console.log($scope.history)
        // $scope.history_list;
        //搜索方法
        var search = function(keyword){
            $timeout(function () {
                $scope.hwf = false;
                $scope.hwe = false;
                $scope.goods = new $lazyLoader("app/news/list", {
                    keyword: keyword
                });
            }, 0);
        };
        //点击热词搜索
        $scope.hws = function(keyword){
            $scope.keyword = keyword;
            search(keyword);
            console.log(keyword)
            $scope.history.unshift({"word":keyword});
            localStorageService.set("newlist",JSON.stringify($scope.history));
        };
        $scope.history_list = JSON.parse(localStorageService.get("newlist"));
        //回车搜索
        var searchBtn = document.getElementById("searchBtn");
        searchBtn.onsearch = function(){
            var keyword = this.value;
            search(keyword);
            $scope.history.unshift({"word":keyword});
            localStorageService.set("newlist",JSON.stringify($scope.history));
        };
        //输入没有内容
        searchBtn.oninput = function () {
            if(this.value.length<1){
                $scope.hwe = true;
                $scope.hwf = true;
                $scope.goods.nodata = false;
                $scope.history_list = JSON.parse(localStorageService.get("newlist"));
            }
        }
        $scope.dele = function (id) {
            $scope.history_list.splice(id,1 );
            localStorageService.set("newlist",JSON.stringify($scope.history_list));
        }
        // localStorageService.remove("list")
    });