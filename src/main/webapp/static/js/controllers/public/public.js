'use strict';

stareal
    .controller("PublicController", function ($rootScope,$scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval) {
        //演出状态按钮
        $rootScope.btnSetColor = function (statu) {
            if(statu=='预售中'){
                $rootScope.defstyle = {
                    "color": "#4899FE",
                    "border":"1px solid #4899FE"
                }
                $rootScope.btn = '预售中'
            }
            if(statu=='售票中'){
                $rootScope.defstyle = {
                    "color": "#FF5000",
                    "border":"1px solid #FF5000"
                }
                $rootScope.btn = '售票中'
            }
            if(statu=='扫尾票'){
                $rootScope.defstyle = {
                    "color": "#FF2450",
                    "border":"1px solid #FF2450"
                }
                $rootScope.btn = '扫尾票'
            }
            if(statu=='即将开票'){
                $rootScope.defstyle = {
                    "color": "#3D50F0",
                    "border":"1px solid #3D50F0"
                }
                $rootScope.btn = '预定中'
            }
            if(statu=='演出结束'){
                $rootScope.defstyle = {
                    "color": "#6B6B6B",
                    "border":"1px solid #6B6B6B"
                }
                $rootScope.btn = '已结束'
            }
            if(statu=='已售罄'){
                $rootScope.defstyle = {
                    "color": "#6B6B6B",
                    "border":"1px solid #6B6B6B"
                }
                $rootScope.btn = '已售罄'
            }
            return $rootScope.defstyle;
        }
        //演出状态文字
        $rootScope.btnText = function (statu) {
            if(statu=='预售中'){
                $rootScope.btn = '预售中'
            }
            if(statu=='售票中'){
                $rootScope.btn = '售票中'
            }
            if(statu=='扫尾票'){
                $rootScope.btn = '扫尾票'
            }
            if(statu=='即将开票'){
                $rootScope.btn = '预定中'
            }
            if(statu=='演出结束'){
                $rootScope.btn = '已结束'
            }
            if(statu=='已售罄'){
                $rootScope.btn = '已售罄'
            }
            return $rootScope.btn;
        }
        //订单状态文字
        $scope.statusText = function (status) {
            if(status=='待付款'){
                $scope.text = '待支付';
            }
            if(status=='待发货'){
                $scope.text = '待发货';
            }
            if(status=='待收货'){
                $scope.text = '待收货';
            }
            if(status=='已完成'){
                $scope.text = '已完成';
            }
            if(status=='已取消'){
                $scope.text = '已取消';
            }
            return $scope.text;
        }
        //衍生品 订单状态文字
        $scope.statusText0 = function (status) {
            if(status=='待支付'){
                $scope.text = '待支付';
            }
            if(status=='待发货'){
                $scope.text = '待发货';
            }
            if(status=='待收货'){
                $scope.text = '待收货';
            }
            if(status=='已完成'){
                $scope.text = '已完成';
            }
            if(status=='已取消'){
                $scope.text = '已取消';
            }
            return $scope.text;
        }
        //发表时间转换
        $scope.getDateTimeStamp = function(dateStr){
            if(dateStr!=undefined){
                return Date.parse(dateStr.replace(/-/gi,"/"));
            }
        }
        $scope.getDateDiff = function(dateTimeStamp){
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if(diffValue < 0){return;}
            var monthC =diffValue/month;
            var weekC =diffValue/(7*day);
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;
            var result;
            if(monthC>=1){
                result="发表于" + parseInt(monthC) + "月前";
            }
            else if(weekC>=1){
                result="发表于" + parseInt(weekC) + "周前";
            }
            else if(dayC>=1){
                result="发表于"+ parseInt(dayC) +"天前";
            }
            else if(hourC>=1){
                result="发表于"+ parseInt(hourC) +"小时前";
            }
            else if(minC>=1){
                result="发表于"+ parseInt(minC) +"分钟前";
            }else
                result="发表于"+"刚刚";
            return result;
        }
        //获取用户相关信息
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $rootScope.user = ret.data;
            });
        // $rootScope.user = localStorageService.get("user");
        //设置评论星星
        $scope.setPost = function (status) {
            var IntStatus = parseInt(status);
            if(IntStatus==1||IntStatus==2){
                $scope.defstyle = {
                    "background-position": "0 -1.6rem" //一颗心
                }
            }
            if(IntStatus==3||IntStatus==4){
                $scope.defstyle = {
                    "background-position": "0 -1.2rem" //二颗心
                }
            }
            if(IntStatus==5||IntStatus==6){
                $scope.defstyle = {
                    "background-position": "0 -0.8rem" //三颗心
                }
            }
            if(IntStatus==7||IntStatus==8){
                $scope.defstyle = {
                    "background-position": "0 -0.4rem" //四颗心
                }
            }
            if(IntStatus==9||IntStatus==10){
                $scope.defstyle = {
                    "background-position": "0 0" //五颗心
                }
            }
            return $scope.defstyle;
        }
        //点赞
        $scope.IsPraise = function (commentid,Index,num,from,event){
            if (!localStorageService.get('token')) {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        // "appid=wxd39f7e740343d507&" +
                        // "redirect_uri=http%3A%2F%2Fwww.mydeershow.com%2Foauth%2Findex" +
                        "appid=wxda73ac8ac7af1261&" +
                        "redirect_uri=http%3A%2F%2Fm.mydeershow.com%2Foauth%2Findex" +
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
                return false;
            }
            event.stopPropagation()//阻止冒泡
            $api.post("app/comment/praise", {comment_id:commentid}, true)
                .then(function (ret) {
                    if(from=='detail'){//详情页
                        $scope.reviews[Index].is_praise = !$scope.reviews[Index].is_praise;
                        $scope.reviews[Index].like = parseInt(ret.praise)+num;
                    }
                    if(from=='all'){//全部评论
                        $scope.reviews.items[Index].is_praise = !$scope.reviews.items[Index].is_praise;
                        $scope.reviews.items[Index].like = parseInt(ret.praise)+num;
                    }
                    if(from=='allreplay'){//全部回复
                        $scope.comment.is_praise = !$scope.comment.is_praise;
                        $scope.comment.like = parseInt(ret.praise)+num;
                    }
                    if(from=='commennt'){//我的评论
                        $scope.comments.items[Index].is_praise = !$scope.comments.items[Index].is_praise;
                        $scope.comments.items[Index].like = parseInt(ret.praise)+num;
                    }
                },function (err) {
                    $alert.show(err)
                })
        }
        //消息状态
        $scope.notify_show = false;
        if(localStorageService.get('token')){
            $api.get("app/notify/getUnreadNums",{},true)
                .then(function (ret) {
                    $scope.notify = ret.data;
                    $scope.notify_show=true;
                },function (err) {
                    $alert.show(err)
                })
        }
    });
