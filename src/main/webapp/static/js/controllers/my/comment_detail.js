'use strict';

stareal
    .controller("CommentDetailController", function ($rootScope,$scope,$http, $stateParams,$location,$timeout,$api, $sce, base64, $state, localStorageService,$alert) {
        $scope.comment_id=$stateParams.comment_id;
        //获取头像
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $scope.user = ret.data;
            })
        //获取当前评论下得所有回复
            $api.get("app/reply/retrieve", {comment_id: $scope.comment_id,pageNum:1,pageSize:10}, true)
                .then(function (ret) {
                    console.log(ret)
                    $scope.comment = ret.comment;
                    var items = ret.data;
                    for (var i = 0; i < items.length; i++) {
                        $scope.replies.push(items[i]);
                    }
                    $scope.total_row = ret.total_row;
                    $scope.page_num = ret.page_num;
                    $scope.page_size = ret.page_size;
                    $scope.good_id = ret.comment.good_id;
                    //获取商品详情
                    $api.get("app/detail/good/retrieve", {id: $scope.good_id})
                        .then(function (ret) {
                            console.log(ret)
                            var good = ret.data;
                            good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                            $scope.good = good;
                        });
                },function (err) {
                    $alert.show(err)
                })
        $scope.replies = [];
        $scope.busy = true;
        $scope.page_show = true;
        $scope.toggle = function (e) {
            e.stopPropagation()//阻止冒泡
            $scope.busy = true;
            $scope.page_num = $scope.page_num + 1;
            $api.get("app/reply/retrieve", {comment_id: $scope.comment_id,pageNum:$scope.page_num,pageSize:10},true)
                .then(function (ret) {
                    var items = ret.data;
                    for (var i = 0; i < items.length; i++) {
                        $scope.replies.push(items[i]);
                    }
                    $scope.total_row = ret.total_row;
                    $scope.page_num = ret.page_num;
                    $scope.page_size = ret.page_size;
                    if ($scope.total_row - $scope.page_num * $scope.page_size < 0)
                        $scope.page_show = false;
                    $scope.busy = false;
                });
        };
        $scope.placeholder = '我也来说一句...';
        $scope.s = 0;
        //点击别人设置
        $scope.Reply = function (name,ToId,e) {
            e.stopPropagation()//阻止冒泡
            localStorageService.set("ToId",ToId);
            localStorageService.set("name",name);
            $scope.placeholder ='回复'+ name;
            $scope.s = 1;
        }
        //重置
        angular.element("body").click(function (e) {
            if(e.target.id!='publish'&&e.target.id!='reply_inp'){
                $scope.$apply(function () {
                    $scope.placeholder = '我也来说一句...';
                    $scope.s = 0;
                    console.log(798)
                })
            }else{
                e.stopPropagation()//阻止冒泡
            }
        })
        $scope.submitReply = function (id,e) {
            console.log($scope.s)
            if (!localStorageService.get('token')) {
                // $state.go("main.login",{})
                // return false;
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxd39f7e740343d507&" +
                        "redirect_uri=http%3A%2F%2Fm.stareal.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" ;

                    // //测试redirect_uri
                    // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                    //     "appid=wxd39f7e740343d507&" +
                    //     "redirect_uri=http%3A%2F%2Ft.stareal.cn%2Foauth%2Findex" +
                    //     "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);
                } else {
                    // location.href = "https://open.weixin.qq.com/connect/qrconnect?" +
                    //     "appid=wx05c47c7db58b03aa&" +
                    //     "redirect_uri=http%3A%2F%2Fwww.stareal.cn%2Fwx%2Foauth%2Fweixin" +
                    //     "&response_type=code&scope=snsapi_login&state=" + encodeURIComponent(rs) + "#wechat_redirect";
                    location.href = "#/main/login/";
                }
            }
            e.stopPropagation()//阻止冒泡
            if(!$scope.ReplyFormText){
                $alert.show("请输入回复内容")
                return false;
            }
            $scope.user = localStorageService.get("user");

            $scope.content = $scope.ReplyFormText;
            if($scope.s == 0){//新增回复
                $api.post("app/reply/create",{comment_id:id,content:$scope.content},true)
                    .then(function (ret) {
                        $scope.placeholder = '我也来说一句...';
                        $scope.ReplyFormText='';
                        var news={};
                        news.content=$scope.content;
                        news.from_name=$rootScope.user.nickname;
                        news.comment_id = $scope.comment.id;
                        $scope.comment.reply++;
                        $scope.replies.unshift(news);
                    },function (err) {
                        $alert.show(err)
                    })
            }
            if($scope.s == 1){//回复别人
                $scope.ToId = localStorageService.get("ToId")//回复人ID
                $scope.to_name = localStorageService.get("name");//回复人姓名
                $api.post("app/reply/create",{comment_id:id,to_id:$scope.ToId,content:$scope.content},true)
                    .then(function (ret) {
                        $scope.s = 0;
                        $scope.placeholder = '我也来说一句...';
                        $scope.ReplyFormText='';
                        var news={};
                        news.content=$scope.content;
                        news.from_name=$rootScope.user.nickname;
                        news.comment_id = $scope.comment.id;
                        news.to_name = $scope.to_name;
                        news.to_id = $scope.ToId;
                        $scope.comment.reply++;
                        $scope.replies.unshift(news);
                    },function (err) {
                        $alert.show(err)
                    })
            }
        }
    });