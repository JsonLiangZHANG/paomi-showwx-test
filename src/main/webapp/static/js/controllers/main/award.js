'use strict';

stareal
    .controller("AwardController", function ($scope,$interval,$document, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        //获取夺宝详情
        $scope.award_id = $stateParams.award_id;
        $api.get("app/treasure/detail/retrieve",{periodId:$stateParams.award_id})
            .then(function (ret) {
                $scope.award = ret.data;
                $scope.title = $scope.award.title; //标题
                $scope.thumb = $scope.award.thumb//缩略图
                $scope.state = $scope.award.state//状态
                $scope.unit = $scope.award.unit*100 //1元等于100贝里
                $scope.l3ft = $scope.award.l3ft;//剩余
                localStorageService.set('a_value',$scope.award.a_value)
                localStorageService.set('b_value',$scope.award.b_value)
                localStorageService.set('prize_no',$scope.award.prize_no)
                $scope.pic = $scope.award.pic.split(";")
                angular.element('#carousel-demo').height($document.width() * 26 / 50)
                if($scope.state=='已结束'){
                    $scope.Btn = '已结束';
                    $scope.gbs = {background: '#999999'};
                }
                if($scope.state=='等待开奖'){
                    $scope.Btn = '已售罄';
                    $scope.gbs = {background: '#999999'};
                    var updateTime =function (){
                        var endTime = $scope.award.finish_time.replace(/-/gi,'/')
                        $scope.finish_time = Date.parse(new Date(endTime))//结束时间
                        $scope.nowTime = Date.parse(new Date())//当前时间
                        $scope.time_difference =($scope.finish_time-$scope.nowTime)/1000;//时差
                        if($scope.time_difference>0){
                            $scope.iDay = parseInt($scope.time_difference/86400);//算出每天
                            $scope.time_difference%=86400;
                            $scope.iHours = parseInt($scope.time_difference/3600)+$scope.iDay*24;//算出小时
                            $scope.time_difference%=3600;
                            $scope.iMin = parseInt($scope.time_difference/60);//算出分钟
                            $scope.time_difference%=60;
                            $scope.iSec=$scope.time_difference;   //算出秒
                            $scope.time=setDigit($scope.iHours,2)+'时'+setDigit($scope.iMin,2)+'分'+setDigit($scope.iSec,2)+'秒'
                        }else{
                            $interval.cancel(timer);
                            //window.location.reload()//刷新
                            $scope.time = '等待开奖'
                        }
                    }
                    var setDigit = function (num,n){      //在时，分，秒前面补0
                        var str = ''+num;
                        while(str.length<n){
                            str = '0'+str;
                        }
                        return str;
                    }
                    updateTime()
                    var timer = $interval(updateTime,1000)
                }
                if($scope.state=='正在进行'){
                    if($scope.l3ft==0){
                        $scope.Btn = '已售罄';
                        $scope.gbs = {background: '#999999'};
                        var updateTime =function (){
                            var endTime = $scope.award.finish_time.replace(/-/gi,'/')
                            $scope.finish_time = Date.parse(new Date(endTime))//结束时间
                            $scope.nowTime = Date.parse(new Date())//当前时间
                            $scope.time_difference =($scope.finish_time-$scope.nowTime)/1000;//时差
                            if($scope.time_difference>0){
                                $scope.iDay = parseInt($scope.time_difference/86400);//算出每天
                                $scope.time_difference%=86400;
                                $scope.iHours = parseInt($scope.time_difference/3600)+$scope.iDay*24;//算出小时
                                $scope.time_difference%=3600;
                                $scope.iMin = parseInt($scope.time_difference/60);//算出分钟
                                $scope.time_difference%=60;
                                $scope.iSec=$scope.time_difference;   //算出秒
                                $scope.time=setDigit($scope.iHours,2)+':'+setDigit($scope.iMin,2)+':'+setDigit($scope.iSec,2)+':'
                            }else{
                                $interval.cancel(timer);
                                window.location.reload()//刷新
                                $scope.time = '已揭晓'
                            }
                        }
                        var setDigit = function (num,n){      //在时，分，秒前面补0
                            var str = ''+num;
                            while(str.length<n){
                                str = '0'+str;
                            }
                            return str;
                        }
                        updateTime()
                        var timer = $interval(updateTime,1000)
                        return false;
                    }
                    $scope.Btn = '立即购买';
                    var alertHe =  angular.element('.pay').outerHeight();
                    var bodyH = angular.element('body').height();
                    angular.element('.award_btn a').click(function (e) {
                        if (!localStorageService.get('token')) {
                            // $state.go("main.login",{})
                            //return;
                            var ua = window.navigator.userAgent.toLowerCase();
                            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                                // 正式地址
                                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                                    "appid=wxd39f7e740343d507&" +
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
                        }
                        angular.element('.shadow').css({
                            'display':'block',
                            'height':bodyH
                        })
                        angular.element('.pay').css({
                            'display':'block',
                            'bottom':-alertHe
                        });
                        angular.element('.pay').animate({bottom:'0px'},200);
                        e.stopPropagation();
                    })
                    //关闭弹窗
                    angular.element('.pay').click(function (e) {
                        e.stopPropagation();
                    })
                    $scope.close = function () {
                        angular.element('.pay').animate({bottom:-alertHe},200);
                        angular.element('.shadow').fadeOut()
                    }
                    angular.element('html,body').click(function () {
                        $scope.close()
                    })
                    /*计算价格*/
                    $scope.filter = function (num) {
                        $scope.num  = num;
                        $scope.price = parseInt($scope.num)*$scope.unit;
                    }
                    //初始化
                    $scope.num = 1;
                    $scope.price = parseInt($scope.num)*$scope.unit;
                    $scope.subNum = function () {
                        if ($scope.num == 1) {
                            return;
                        }
                        $scope.num = parseInt($scope.num) - 1;
                        $scope.price = parseInt($scope.num)*$scope.unit;
                    };
                    $scope.addNum = function () {
                        if($scope.num>=50){
                            $alert.show("最多只能购买50")
                            $scope.num = 50;
                            $scope.price = parseInt($scope.num)*$scope.unit;
                            return false;
                        }
                        if($scope.num>=$scope.l3ft){
                            $alert.show("最多只能购买"+$scope.l3ft)
                            $scope.num = $scope.l3ft;
                            return false;
                        }
                        $scope.num = parseInt($scope.num) + 1;
                        $scope.price = parseInt($scope.num)*$scope.unit;
                    };
                    /*跳转支付页*/
                    $scope.goPaying = function (num) {
                        //存储数据
                        localStorageService.set('periodId',$stateParams.award_id)  //期号
                        localStorageService.set('title',$scope.title) //标题
                        localStorageService.set('thumb',$scope.thumb) //缩略图
                        localStorageService.set('num',num ) //缩略图
                        if($scope.bellyremain<=num*100){
                            $alert.show("您的余额不足")
                            return false
                        }else{
                            $state.go("main.paying",{})
                        }
                    }
                    var updateTime =function (){
                        var endTime = $scope.award.finish_time.replace(/-/gi,'/')
                        $scope.finish_time = Date.parse(new Date(endTime))//结束时间
                        $scope.nowTime = Date.parse(new Date())//当前时间
                        $scope.time_difference =($scope.finish_time-$scope.nowTime)/1000;//时差
                        if($scope.time_difference>0){
                            $scope.iDay = parseInt($scope.time_difference/86400);//算出每天
                            $scope.time_difference%=86400;
                            $scope.iHours = parseInt($scope.time_difference/3600)+$scope.iDay*24;//算出小时
                            $scope.time_difference%=3600;
                            $scope.iMin = parseInt($scope.time_difference/60);//算出分钟
                            $scope.time_difference%=60;
                            $scope.iSec=$scope.time_difference;   //算出秒
                            $scope.time=setDigit($scope.iHours,2)+':'+setDigit($scope.iMin,2)+':'+setDigit($scope.iSec,2)
                        }else{
                            $interval.cancel(timer);
                            $scope.time = '已揭晓'
                        }
                    }
                    var setDigit = function (num,n){      //在时，分，秒前面补0
                        var str = ''+num;
                        while(str.length<n){
                            str = '0'+str;
                        }
                        return str;
                    }
                    updateTime()
                    var timer = $interval(updateTime,1000)
                }
            })
        /*获取贝里余额*/
        $api.get("app/belly/getL3ft",{},true)
            .then(function (ret) {
               $scope.bellyremain = ret.data.l3ft;
            })
        //获取往期揭晓
        $api.get("app/treasure/list/past")
            .then(function (ret) {
                $scope.unveils = ret.data;
            })
        //获取本期参与
        $api.get("app/treasure/list/details",{periodId:$stateParams.award_id})
            .then(function (ret) {
                $scope.partakes = ret.data;
            })

        /*获取演出简介*/
        $api.get("app/treasure/detail/retrieve",{periodId:$stateParams.award_id},true)
            .then(function (ret) {
                var good = ret.data;
                localStorageService.set("detail",good)
                good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                $scope.good = good;
            })
    });