'use strict';

stareal
    .controller("SigncController", function ($rootScope,$scope, $api, $stateParams, $alert, $document, localStorageService, $state, $interval,$timeout) {
        $scope.showInfo = true;
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var ua = window.navigator.userAgent.toLowerCase();
        $timeout(function () {
            if(isAndroid&&ua.match(/MicroMessenger/i) == 'micromessenger'){
                $(".home-sign").text("签到")
            }
        },0)
        console.log(isAndroid)
        //签到
        var mo=function(e){e.preventDefault();};
        $scope.sign = function () {
            if (!localStorageService.get('token')) {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxd39f7e740343d507&" +
                        "redirect_uri=http%3A%2F%2Fm.stareal.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state=" ;
                    return false;
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
                    return false;
                }
            }
            $api.get("app/member/checkin/create",{},true)
                .then(function (ret) {
                    $scope.GetCheck();
                    var h = document.body.scrollHeight;
                    $(".sign_mask").height(h);
                    $(".sign_box").css({"display":"block"});
                    document.body.style.overflow='hidden';
                    document.addEventListener("touchmove",mo,false);//禁止页面滑动
                },function (err) {
                    $alert.show(err)
                })
        }
        $scope.$on('to-child', function() {
            $scope.sign()		 //子级能得到值
        });
        //关闭
        $scope.close = function () {
            $(".sign_mask").height(0);
            $(".sign_box").css({"display":"none"});
            document.body.style.overflow='';
            document.removeEventListener("touchmove",mo,false);
        }
        //当月签到的情况
        $scope.GetCheck = function () {
            $api.get("app/member/checkin/thismonth",{},true)
                .then(function (ret) {
                    $scope.Sameday = ret.data
                    $scope.days = $scope.Sameday.length //当月共签到天数
                    $scope.Isday = [];  //需不需给默认值
                    for(var i =0;i<$scope.days;i++){
                        $scope.Isday.push($scope.Sameday[i].date.substring(6,8))
                    }

                    //日历函数
                    var d_Date = new Date();
                    var d_y = d_Date.getFullYear();
                    var d_m = d_Date.getMonth()+1;
                    var d_d = d_Date.getDate();
                    if(Number($scope.Isday[0])<Number(d_d)||$scope.Isday[0]==undefined){//和当天比较
                        $scope.showInfo = true;   //没签到
                        localStorageService.set("sign-state","1")
                    }else{
                        $scope.showInfo = false;  //已签到
                        localStorageService.set("sign-state","2")
                    }
                    var a = new Array("日", "一", "二", "三", "四", "五", "六");
                    var week = d_Date.getDay();
                    $scope.weekday = "星期"+ a[week];
                    var fDrawCal = function (y,m) {
                        var temp_d  = new Date(y,m-1,1);//2016,12,28
                        var first_d = temp_d.getDay(); //返回本月1号是星期几
                        temp_d  = new Date(y, m, 0);
                        var all_d   = temp_d.getDate();//返回本月共有多少天,同时避免复杂的判断润年不润年
                        var html,i_d;
                        html="<table><tr>"
                        html+="<td class='td_xq'>日</td>";
                        html+="<td class='td_xq'>一</td>";
                        html+="<td class='td_xq'>二</td>";
                        html+="<td class='td_xq'>三</td>";
                        html+="<td class='td_xq'>四</td>";
                        html+="<td class='td_xq'>五</td>";
                        html+="<td class='td_xq'>六</td></tr>";
                        html+="<tr>";
                        for(var i=1;i<=42;i++){
                            if(first_d<i&&i<=(all_d+first_d)){
                                i_d=i-first_d;//显示出几号
                                for(var j = 0; j<$scope.Isday.length;j++){
                                    if(Number(i_d)==Number($scope.Isday[j])){
                                        html+="<td class='td_hao active1'";//签到后
                                    }
                                }
                                html+="<td class='td_hao'";
                                if (y==d_y&&m==d_m&&d_d==i_d){//日历中为当天
                                    if($scope.showInfo){
                                        html+=" id='now'>"+i_d+"</td>";
                                    }else{
                                        html+=" id='now1'>"+i_d+"</td>";
                                    }
                                }else{
                                    html+=">"+i_d+"</td>";
                                }
                            }else{
                                html+="<td>&nbsp;</td>";
                            }
                            if(i%7==0&&i<42){
                                html+="</tr><tr>";
                            }
                        }
                        html+="</tr></table>";
                        document.getElementById("scs_rl").innerHTML=html;
                    }
                    fDrawCal(d_y,d_m);

                })
        }
        $scope.GetCheck()
    });
