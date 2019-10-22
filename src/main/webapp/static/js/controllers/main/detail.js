'use strict';

stareal
    .controller("DetailController", function ($rootScope,$scope,$http,$compile,$interval,$stateParams,$location,$anchorScroll,$api, $sce, base64, $state, $alert, localStorageService,FileUploader) {
        $scope.current = $stateParams.good_id;
        // console.log($location.search())
        // console.log($state)
        $scope.backTime=3
        $scope.user =localStorageService.get("user"); //存储用户信息
        $scope.sharUrl='https://m.blackwan.cn/?#/'; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致'
        $scope.gbn = '立即购票';
        $scope.searchQuery=$location.search();
        $scope.islogIn=false
        if($scope.searchQuery.token!=undefined&&$scope.searchQuery.token!=null&&$scope.searchQuery.token!=''){ //获取免登录接口 app/login/user/freepass
            localStorageService.set('myseershowToken',$scope.searchQuery.token)
            $api.get("app/login/user/freepass", {token: $scope.searchQuery.token}, true)
                .then(function (ret) {
                    localStorageService.set('token',ret.accessToken);
                    localStorageService.set('login_token',ret.accessToken);
                   // console.log(ret.data)
                    $api.get("app/login/userinfo/retrieve", null, true)
                        .then(function (ret) {
                            $scope.user = ret.data;
                            localStorageService.set('user',$scope.user);
                        });
                },function(err){
                    $scope.islogIn=true

                })
        }
        $scope.getGoodDetail=function(){
            $api.get("app/detail/good/retrieve", {id: $stateParams.good_id}, true)
                .then(function (ret) {
                    var good = ret.data;
                    // console.log(good)
                    localStorageService.set("goodDetail"+$stateParams.good_id, good);
                    localStorageService.set('mygoodDEtail'+$stateParams.good_id,good);
                    good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                    good.notice=$sce.trustAsHtml(good.notice);
                    $scope.good = good;
                    $scope.localGood=good;
                    $scope.title = $scope.good.title;
                    $scope.site_title = $scope.good.site_title;
                    $scope.thumb = $scope.good.thumb;
                    $scope.seat = good.seat_thumb;  //座位图
                    $scope.favor = $scope.good.favor;//收藏\
                    $scope.star = $scope.good.star;
                    $scope.goodType=$scope.good.good_type;
                    localStorageService.set('GoodmapId',$scope.good.site_id);
                    $scope.is_coupon = $scope.good.is_coupon;//是否可以使用优惠券
                    if ($scope.star) {
                        $scope.star = good.star.split('.')
                    }
                    if (good.state == '售票中') {
                        $scope.shop_bg = '';
                        $scope.gbn = '立即购票';
                        $scope.isdisabled = true;
                        $scope.gf = 1;
                    }
                    if (good.state == '预售中') {
                        $scope.shop_bg = 'disable';
                        $scope.gbn = '即将开票';
                        $scope.gf = 2;
                    }
                    if (good.state == '扫尾票') {
                        $scope.shop_bg = '';
                        $scope.gbn = '立即购票';
                        $scope.gf = 1;
                    }
                    if (good.state == '即将开票') {
                        $scope.good.sold = 0;
                        if (good.appRegistered == 1) {
                            $scope.gbn = '即将开票';
                            $scope.shop_bg = 'disable';
                            return false;
                        }
                        $scope.shop_bg = 'disable';
                        $scope.gbn = '即将开票';
                        $scope.gf = 2;
                    }
                    if (good.state == '已售罄') {
                        $scope.shop_bg = 'disable';
                        $scope.gbn = good.state;
                        $scope.gf = 0;
                    }

                    if (good.state == '演出结束') {
                        $scope.shop_bg = 'disable';
                        $scope.gbn = good.state;
                        $scope.gf = 0;
                    }

                        $scope.getTicket(good.id)






                });
        }
        if(localStorageService.get('mygoodDEtail'+$stateParams.good_id)!=undefined&&localStorageService.get('mygoodDEtail'+$stateParams.good_id)!=null&&localStorageService.get('mygoodDEtail'+$stateParams.good_id)!=''){
            var good=localStorageService.get('mygoodDEtail'+$stateParams.good_id);
            good.detail = $sce.trustAsHtml(base64.decode(good.detail));
            good.notice=$sce.trustAsHtml(good.notice);
            $scope.localGood = good;
            $scope.getGoodDetail();
        }else{
            $scope.getGoodDetail();
        }

        //当前加active
        $scope.isActive = function (s) {
            return $scope.current == s
        }
        //预约
        var alertHe = angular.element('.alert_box').outerHeight();
        $scope.show = false;

        var alertBox1 = angular.element('.tic .alertBox').outerHeight();
        var alertBox2 = angular.element('.good_conten .l_con').outerHeight();
        $scope.go = function (gf, e) {
            var alertTic = angular.element('body').height();
            if (!localStorageService.get('token')) {
                // $state.go("main.login",{})
                // return false;
                var  rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxc2377a19f91b4c20&" +
                        "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(rs) ;
                } else {
                    location.href = "#/main/login/"+encodeURIComponent(rs);
               }
                return false;
            }
            if ($scope.gf == 1) {
                localStorageService.set('title', $scope.title);
                //   console.log($scope.title);
                localStorageService.set('site_title', $scope.site_title);
                localStorageService.set('thumb', $scope.thumb);
                localStorageService.set('is_coupon', $scope.is_coupon);
                // $state.go('main.ticket', {good_id: $stateParams.good_id});
                if ( $scope.goodType==0) {
                    //     console.log("11");
                    angular.element('.tic').css({
                        'display': 'block',
                        'height': alertTic
                    });

                    angular.element('.tic .alertBox').css({
                        'display': 'block',
                        'bottom': -alertBox1
                    });
                    angular.element('.tic .alertBox').animate({bottom: '0px'}, 200);

                }
                if ( $scope.goodType==1) {
                    //  console.log("12");
                    angular.element('.xuanzuo_content').css({
                        'display': 'block',
                        'height': alertTic
                    });

                    angular.element('.xuanzuo_content .good_conten').css({
                        'display': 'block',
                        'bottom': -alertBox2
                    });
                    angular.element('.xuanzuo_content .good_conten').animate({bottom: '0px'}, 200);

                }
            }
            if ($scope.gf == 2) {
                return false;
                // var bodyH = angular.element('body').height();
                // angular.element('.mask').css({
                //     'display': 'block',
                //     'height': bodyH
                // })
                // angular.element('.alert_box').css({
                //     'display': 'block',
                //     'bottom': -alertHe
                // });
                // angular.element('.alert_box').animate({bottom: '0px'}, 200);
                // e.stopPropagation();
            }

        }



        //到货提醒弹窗
        $scope.telphone_no = localStorageService.get("telphone_no");
        var alertHe =  angular.element('.mask1 .alert_box1').outerHeight();
        $scope.pop = function (e) {
            if (!localStorageService.get('token')) {
                var  rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxc2377a19f91b4c20&" +
                        "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(rs) ;
                } else {
                    location.href = "#/main/login/"+encodeURIComponent(rs);
               }
                return false;
            }
            var bodyH = angular.element('body').height();
            angular.element('.mask1').css({
                'display':'block',
                'height':bodyH
            })
            angular.element('.mask1 .alert_box1').css({
                'display':'block',
                'bottom':-alertHe
            });
            angular.element('.mask1 .alert_box1').animate({bottom:'0px'},200);
        }
        //关闭弹窗

        angular.element('.mask1 .alert_box1').click(function (e) {
            e.stopPropagation();
        })
        angular.element('.mask1').click(function () {
            $scope.arriveClose();
        })

        angular.element('.tic .alertBox ').click(function (e) {
            e.stopPropagation();
        })
        // angular.element('.tic').click(function () {
        //     $scope.close0();
        // })



        //关闭
        $scope.arriveClose = function () {
            angular.element('.mask1 .alert_box1').animate({bottom:-alertHe},200);
            angular.element('.mask1').fadeOut()
        }
        $scope.ticClose = function () {
            //   console.log("11");
            angular.element('.tic .alertBox').animate({bottom:-alertBox1},200);
            angular.element('.tic').fadeOut();
        }
        $scope.Xuanclose=function(){
            angular.element('.xuanzuo_content .good_conten').animate({bottom:-alertBox1},200);
            angular.element('.xuanzuo_content').fadeOut();
        }
        //提交预约
        $scope.submitPop = function (){
            var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
            if (!myreg.test($scope.telphone_no)) {
                $alert.show('请输入有效的手机号码！');
                return false;
            }
            $api.post("app/register/oos/create",{ticket_id:$scope.ticketId,mobile: $scope.telphone_no},true)
                .then(function (ret) {
                    $alert.show("登记成功！")
                    $scope.close();
                },function (err) {
                    $alert.show(err);
                    $scope.close();
                })




        }

        //弹窗购票结束



        //关闭弹窗
        angular.element('.alert_box').click(function (e) {
            e.stopPropagation();
        })
        $scope.close = function () {
            angular.element('.alert_box').animate({bottom:-alertHe},200);
            angular.element('.mask').fadeOut()
        }
        //获取评论
        $scope.GetCooments = function () {
            $api.get("app/comment/goodComments",{
                good_id:$stateParams.good_id,
                pageNum:1,
                pageSize:3},true)
                .then(function (ret) {
                    localStorageService.set('goodDetailcom',ret);
                    $scope.totalRe = ret.total_row;
                    $scope.reviews = ret.data;
                })
        }
        if(localStorageService.get('goodDetailcom')==undefined||localStorageService.get('goodDetailcom')==null){
            $scope.GetCooments();
        }else{
            $scope.GetCooments();
            // var data= localStorageService.get('goodDetailcom');
            // $scope.totalRe =data.total_row;
            // $scope.reviews = data.data;

        }

        //跳转写评论
        $scope.write = function () {
            if (!localStorageService.get('token')) {
                var  rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxc2377a19f91b4c20&" +
                        "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(rs) ;
                } else {
                    location.href = "#/main/login/"+encodeURIComponent(rs);
               }
                return false;
            }
            $state.go('main.write_reviews',{good_id:$scope.current});
        }
        //收藏
        $scope.collect = function (GoodId) {
            if (!localStorageService.get('token')) {
                var  rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    // 正式地址
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        "appid=wxc2377a19f91b4c20&" +
                        "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                        "&response_type=code&scope=snsapi_userinfo&state="+encodeURIComponent(rs) ;
                } else {
                    location.href = "#/main/login/"+encodeURIComponent(rs);
               }
                return false;
            }
            $api.post("app/favor/create",{good_id:GoodId},true)
                .then(function (ret) {
                    if($scope.favor==0){
                        $scope.favor=1;
                        $alert.show("收藏成功")
                    }else{
                        $scope.favor=0;
                        $alert.show("取消收藏")
                    }
                })
        }
        //立即预定
        $scope.telphone_no = localStorageService.get("telphone_no");
        $scope.subscribe = function () {
            var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
            if (!myreg.test($scope.telphone_no)) {
                $alert.show('请输入有效的手机号码！');
                return false;
            }
            $api.post("app/register/appointment/create",{good_id: $stateParams.good_id,mobile: $scope.telphone_no},true)
                .then(function (ret) {
                    $alert.show("预约成功");
                    $scope.good.appRegistered=1
                    $scope.gbn = '已预订';
                    $scope.shop_bg = 'subscribe';
                    $scope.close();
                },function (err) {
                    $alert.show(err);
                    $scope.close();
                })
        }
        //查看座位图
        $scope.lookSeat = function () {
            if($scope.seat){
                var h = document.body.scrollHeight;
                $(".seat_mask").height(h);
                $(".seat_mask").fadeIn();
                var imgW = $(".seat_box img").height() //图片高度
                $(".seat_box").height(imgW)
            }else{
                $alert.show("暂无座位图")
            }
        }
        //关闭座位图
        $scope.closeSeat =  function () {
            $(".seat_mask").fadeOut()
        }
        $scope.stopPropagation = function (event) {
            event.stopPropagation()//阻止冒泡
        }
        //分享
        //微信分享http://192.168.1.4:9090/oauth/getSignature
        $api.get("app/share/getSignature", {url: window.location.href.split('#')[0]})
            .then(function (ret) {
                if (ret) {
                    var data = ret.data;
                    wx.config({
                        debug: false,
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            // 'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });
                    wx.ready(function () {
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: '灰姑娘Cinderella', // 分享标题
                            desc: '三地巡演', // 分享描述
                            link: 'https://m.blackwan.cn/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'https://image.mydeershow.com/20191022154847.png', // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                //alert('你好');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('你好....');
                            }
                        });
                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title: '灰姑娘Cinderella', // 分享标题
                            desc: '三地巡演', // 分享描述
                            link: 'https://m.blackwan.cn/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'https://image.mydeershow.com/20191022154847.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
// 用户确认分享后执行的回调函数
                                // alert('你好....');
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQQ({
                            title: '灰姑娘Cinderella', // 分享标题
                            desc: '三地巡演', // 分享描述
                            link: 'https://m.blackwan.cn/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'https://image.mydeershow.com/20191022154847.png', // 分享图标
                            success: function () {
// 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '灰姑娘Cinderella', // 分享标题
                            desc: '三地巡演', // 分享描述
                            link: 'https://m.blackwan.cn/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'https://image.mydeershow.com/20191022154847.png', // 分享图标
                            success: function () {
// 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                    });
                    wx.error(function (res) {
                        //console.log(res);
                        //alert("微信分享接口配置失败");
                    });
                }
            })

        //购票

        $scope.dayList=[];//可以购票的时间
        // $scope.timesList=[];//场次
        $scope.priceList=[];//票价
        $scope.FIRSTdate="";//哪一天有演出
        $scope.telphone_no = $rootScope.tel;
        //获取门票
        $scope.getTicket=function(id) {
            $api.get("app/detail/ticket/retrieve", {id: id})
                .then(function (ret) {
                    // console.log(ret)
                    $scope.remark = ret.remark;
                    $scope.plans = ret.data;
                    if($scope.plans ==undefined||$scope.plans ==null||$scope.plans ==''||$scope.plans .length==0){
                        $scope.shop_bg = 'disable';
                        $scope.gbn = '暂无售票';
                        $scope.gf = 0;
                    }
                    $scope.paras = {};
                    $scope.max = $scope.plans[0].max_num;
                    $scope.eventId = $scope.plans[0].eventId;
                    //  console.log($scope.plans);
                    // $scope.specialHtml = $sce.trustAsHtml('<iframe id="iframe-projects"  src="http://app.mydeershow.com/index/event/16" frameborder="0" width="100%" height="700";style="display: inline;overflow: hidden;"scrolling="no"></iframe>');
                    //获取演出时间表
                    $scope.FIRSTdate = $scope.plans[0].name.split("#")[0];
                    for (var i = 0; i < $scope.plans.length; i++) {
                        var dayobj = new Object();
                        var data = $scope.plans[i].name.split("#")[0];
                        dayobj.id = $scope.plans[i].id;
                        dayobj.datet = data;
                        // dayobj.datetime = new Date(data.split("-")[0],data.split("-")[1], data.split("-")[2]);
                        dayobj.datetime = new Date(data);
                        dayobj.day = data.split("-")[2];
                        dayobj.description = $scope.plans[i].name.split("#")[1];
                        dayobj.eventId = $scope.plans[i].eventId;
                        // dayobj.times = options[i].times;
                        $scope.dayList[i] = dayobj;
                        $scope.plans[i].day = data.split("-")[2];
                    }
                    // console.log($scope.dayList);
                    // console.log( $scope.plans );
                    // 获取第一个可以选择的场次
                    var getAvailablePlanIndex = function () {
                        return 0;
                    };

                    // 获取第一个可以选择的价位
                    var getAvailableCatIndex = function () {
                        var _index = [null, null];
                        catsLoop:
                            for (var _i = 0; _i < $scope.cats.length; _i++) {
                                var _gory = $scope.cats[_i].children;
                                for (var _j = 0; _j < _gory.length; _j++) {
                                    if (_gory[_j].status) {
                                        _index = [_i, _j];
                                        break catsLoop;
                                    }
                                }
                            }
                        // console.log(_index);
                        return _index;
                    };

                    // 获取第一个可以选择的价格
                    var getAvailablePriceIndex = function () {
                        var _index = null;
                        for (var _i = 0; _i < $scope.prices.length; _i++) {
                            if ($scope.prices[_i].status) {
                                _index = _i;
                                break;
                            }
                        }
                        return _index;
                    };

                    // 更改场次
                    var switchPlan = function (index, eventId) {
                        if (true) {
                            $('div.c-event-item[data-event-index="' + index + '"]').addClass('active').siblings().removeClass('active');
                            localStorageService.set('date', $scope.plans[index].name)  //会报错  做一个判断
                            localStorageService.set('timeId', $scope.plans[index].id)  //会报错  做一个判断
                            localStorageService.set('timeIndex', index)  //会报错  做一个判断
                            var Check = function () {   //导航切换
                                if (angular.element('.positioncontent').length > 0) {
                                    // console.log(angular.element('.positioncontent').length);
                                    var wst = angular.element(window).scrollTop();
                                    if (wst >= angular.element('.positioncontent').offset().top + 20) {
                                        angular.element("#productDetail_content").fadeIn(500);
                                    } else {
                                        angular.element('#productDetail_content').fadeOut(500);
                                    }
                                } else {
                                    return;
                                }
                            }

                            angular.element(window).on("scroll", Check);
                            // console.log("---hjjhh----");
                            // console.log(index);
                            $scope.paras.planIndex = index;
                            $scope.cats = $scope.plans[index].children;
                            $scope.max = $scope.plans[index].max_num;
                            localStorageService.set('timeIndex', index)  //会报错  做一个判断
                            localStorageService.set('date', $scope.plans[index].name)  //会报错  做一个判断
                            localStorageService.set('timeId', $scope.plans[index].id)  //会报错  做一个判断
                            $scope.time = $scope.plans[index].name.replace(/#/g, "");
                            // 联动切换价位
                            var _index = getAvailableCatIndex();
                            $scope.prices = [];
                            // console.log($scope.cats);
                            // console.log(_index);
                            switchCat(_index[0], _index[1], true);
                            // $scope.$apply(function(){
                            //
                            // });
                            //http://app.mydeershow.com/index/GetEvent/27?UserId=3f34&AppId=FEQWEe
                            $scope.selectseats = function () {
                                $scope.eventShowId = eventId;
                                if (!localStorageService.get('token')) {
                                    // $state.go("main.login",{})
                                    // return false;
                                    var rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                                    var ua = window.navigator.userAgent.toLowerCase();
                                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                                        // 正式地址
                                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                                            "appid=wxc2377a19f91b4c20&" +
                                            "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                                            "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);
                                    } else {
                                        location.href = "#/main/login/" + encodeURIComponent(rs);
                                    }
                                    return false;
                                }
                                // console.log($scope.eventShowId);
                                localStorageService.set('good_title', $scope.title);
                                localStorageService.set('good_titlemax', $scope.max);
                                localStorageService.set("get_ticket_type", $scope.good.get_ticket_type);
                                //  $state.go("main.seat",{event_id:$scope.eventShowId,good_id:$stateParams.good_id});
                                $state.go("main.svgseat", {
                                    event_id: $scope.eventShowId,
                                    good_id: $stateParams.good_id
                                });
                            }

                        }
                    };
                    // 更改价位
                    var switchCat = function (index1, index2, choosable) {
                        if (choosable == '') {
                            // $scope.pop()
                            $alert.show('该价位票已售罄！');
                        }

                        if (choosable) {
                            $scope.paras.catIndex1 = index1;
                            $scope.paras.catIndex2 = index2;
                            localStorageService.set('cat', $scope.plans[$scope.paras.planIndex].children[index1].children[index2].name)  //会报错
                            // 没有可选择的价位
                            if (index1 == null) {
                                $scope.prices = [];
                            } else {
                                $scope.prices = $scope.plans[$scope.paras.planIndex].children[index1].children[index2].children;
                            }
                            //  console.log( $scope.prices );
                            // 联动切换价格
                            var _index = getAvailablePriceIndex();
                            switchPrice(_index, true)
                        } else {
                            $scope.price2 = $scope.plans[$scope.paras.planIndex].children[index1].children[index2].name;
                            $scope.ticketId = $scope.plans[$scope.paras.planIndex].children[index1].children[index2].id;
                        }
                    };

                    // 更改价格
                    var switchPrice = function (index, choosable) {

                        if (choosable) {
                            $scope.paras.priceIndex = index;
                        }
                        var _po = $scope.prices[$scope.paras.priceIndex];
                        localStorageService.set('_po', _po);
                        //   console.log(_po);
                    };

                    // ****************************************  加载计算张数部分  ****************************************
                    $scope.num = 1;

                    $scope.subNum = function () {
                        if ($scope.num == 1) {
                            $scope.defstylenum1 = {
                                "color": "#ccc"
                            }
                            $scope.defstylenum = {
                                "color": "#000"
                            }
                            return;
                        }
                        $scope.num = $scope.num - 1;
                        calTotal();
                    };

                    $scope.addNum = function () {
                        if ($scope.num == $scope.max) {
                            $scope.defstylenum = {
                                "color": "#ccc"
                            }
                            $alert.show("最多只能购买" + $scope.max + "张!")
                            return;
                        } else {
                            $scope.defstylenum = {
                                "color": "#000"
                            }
                            $scope.defstylenum1 = {
                                "color": "#000"
                            }
                        }
                        $scope.num = $scope.num + 1;
                        calTotal();
                    };

                    $scope.$watch("paras", function (newValue) {
                        // 张数还原到1
                        $scope.num = 1;
                        calTotal();
                    }, true);

                    var calTotal = function () {
                        var _po = $scope.prices[$scope.paras.priceIndex];
                        var _price = (_po ? _po.price : 0);
                        $scope.unit_price = _price;
                        $scope.total = _price * $scope.num;
                        $scope.totalPrice = $scope.total;
                    }
                    var createOrder = function (gf) {
                        if (!localStorageService.get('token')) {
                            // $state.go("main.login",{})
                            // return false;
                            var rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                            var ua = window.navigator.userAgent.toLowerCase();
                            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                                // 正式地址
                                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                                    "appid=wxc2377a19f91b4c20&" +
                                    "redirect_uri=https%3A%2F%2Fm.blackwan.cn%2Foauth%2Findex" +
                                    "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);
                            } else {
                                location.href = "#/main/login/" + encodeURIComponent(rs);
                            }
                            return false;
                        }
                        if ($scope.paras.priceIndex == null) {
                            $alert.show("请选择座位!")
                        }

                        var _po = $scope.prices[$scope.paras.priceIndex];
                        if (_po == undefined || _po == null) {
                            $alert.show("请选择座位!");
                            return;
                        }
                        var _sku = _po.num;
                        if (_sku < $scope.num) {
                            $alert.show("库存不足!")
                            return false
                        }
                        if (gf == 1) {
                            localStorageService.set('max', $scope.max)
                            localStorageService.set('unit_price', $scope.unit_price);
                            localStorageService.set('title', $scope.title);
                            localStorageService.set('site_title', $scope.site_title);
                            localStorageService.set('thumb', $scope.thumb);
                            localStorageService.set('seat', _po.name);
                            localStorageService.set('price', _po.price);
                            localStorageService.set('ticketId', _po.id);
                            localStorageService.set('total', $scope.total);
                            localStorageService.set('num', $scope.num);
                            localStorageService.set("get_ticket_type", $scope.good.get_ticket_type);
                            $state.go('main.pay',{order_id:$stateParams.good_id})
                           // var href = '?#/main/pay?order_id=' + $stateParams.good_id
                           // location.href = href;
                        }
                        if ($scope.gf == 2) {
                            if (!localStorageService.get('token')) {
                                var rs = "main.detail-" + JSON.stringify({good_id: $stateParams.good_id});
                                location.href = "#/main/login/" + encodeURIComponent(rs);
                                return false;
                            }
                        }
                        if (gf == 0) {//预约登记
                            $alert.show("暂未开票！");
                            return false
                        }
                        if (gf == 3) {
                            $alert.show("演出结束");
                            return false
                        }
                        if (gf == 4) {
                            $alert.show("您已预约！")
                            return false;
                        }
                    }
                    $scope.switchPlan = switchPlan;
                    $scope.switchCat = switchCat;
                    $scope.switchPrice = switchPrice;
                    $scope.createOrder = createOrder;
                    switchPlan(0, $scope.eventId);
                    eCalendar($scope.dayList, '#calendar');
                    $scope.completeplansRepeat = function () {
                        if ($scope.plans.length > 3) {
                            var swiper = new Swiper('.detailepertoire_container', {
                                slidesPerView: 'auto',
                                spaceBetween: 0,
                                pagination: '.detailepertoire-pagination',//分页容器
                                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                                observeParents: true//修改swiper的父元素时，自动初始化swiper
                            })
                        }
                    }


                }, function (err) {
                    var createOrder = function (gf) {
                        // if (!localStorageService.get('token')) {
                        //     $scope.$broadcast('to-child');
                        //     return;
                        // }
                        // if(gf==4){
                        //     $alert.show("您已预约！");
                        //     return false;
                        // }
                        // //预约登记
                        // var height = $(window).height();
                        // $(".subscribe").css("height", height);
                        // $(".subscribe").fadeIn();
                        $alert.show("系统繁忙，请稍后重试！");
                    }
                    $scope.createOrder = createOrder;
                    $alert.show(err)
                    $scope.shop_bg = 'disable';
                    $scope.gbn = '暂无售票';
                    $scope.gf = 0;

                });
        }
        //生成日历
        var eCalendar = function (options, object) {
            // Initializing global variables
            var adDay = new Date( $scope.FIRSTdate).getDate();
            var adMonth = new Date( $scope.FIRSTdate).getMonth();
            var adYear = new Date( $scope.FIRSTdate).getFullYear();
            var dDay = adDay;
            var dMonth = adMonth;
            var dYear = adYear;
            var instance = object;
            var defaults = {
                weekDays: ['日', '一', '二', '三', '四', '五', '六'],
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                textArrows: {previous: '<', next: '>'},
                eventTitle: 'Eventos',
                url: '',
                events: options
            };
            function lpad(value, length, pad) {
                if (typeof pad == 'undefined') {
                    pad = '0';
                }
                var p;
                for (var i = 0; i < length; i++) {
                    p += pad;
                }
                return (p + value).slice(-length);
            }

            var mouseOver = function () {
                $(this).addClass('c-nav-btn-over');
            };
            var mouseLeave = function () {
                $(this).removeClass('c-nav-btn-over');
            };
            var mouseOverEvent = function () {
                // console.log("------------------------555");
                // $('div.c-event[data-event-day="' + indexNum + '"]').addClass('c-event-over0').siblings().removeClass('c-event-over0');
                $(this).addClass('c-event-over0').siblings().removeClass('c-event-over0');
                var d = $(this).attr('data-event-day');
                var eventDAYiD= $(this).attr('data-event-eventid');
                // console.log($('div.c-event-item[data-event-day="' + d + '"]'));
                $scope.prices = [];
                // console.log($scope.cats);
                if(d>=10){

                    $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                    $('div.c-event-item[data-event-day="' + d  + '"]').addClass('c-event-over1');
                    $($('div.c-event-item[data-event-day="' + d  + '"]')[0]).addClass('active');
                    // console.log( $($('div.c-event-item[data-event-day="' + d  + '"]')[0]).index());
                    var ind= $($('div.c-event-item[data-event-day="' + d  + '"]')[0]).index();
                    // console.log(eventDAYiD);
                    $scope.$apply(function(){
                        //   console.log(ind);
                        $scope.switchPlan(ind,eventDAYiD);
                    });
                    // console.log(ind);
                }else{
                    $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                    $('div.c-event-item[data-event-day="0' + d  + '"]').addClass('c-event-over1');
                    $($('div.c-event-item[data-event-day="0' + d  + '"]')[0]).addClass('active');
                    var ind= $($('div.c-event-item[data-event-day="0' + d  + '"]')[0]).index();
                    // console.log(eventDAYiD);
                    //  console.log(ind);
                    $scope.$apply(function(){
                        $scope.switchPlan(ind,eventDAYiD);
                    });
                    // console.log(ind);
                }

                //$('div.c-event-item')
                // $scope.switchPlan(0);
            };
            //初始化 日期选择


            var nextMonth = function () {
                if (dMonth < 11) {
                    dMonth++;
                } else {
                    dMonth = 0;
                    dYear++;
                }
                print();
                var eventDAYiD= $($('div.c-event[data-event-day="' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                if($scope.dshow>=10){
                    // console.log("hbjhjbhjhj");

                    // console.log( $($('div.c-event-item[data-event-day="' + d  + '"]')[0]).index());
                    var ind= $($('div.c-event-item[data-event-day="' + $scope.dshow  + '"]')[0]).index();
                    // var eventDAYiD= $($('div.c-event[data-event-day="' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                    // // console.log(ind);
                    // console.log(eventDAYiD);
                    // console.log(ind);
                    if(ind!=-1){
                        $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                        $('div.c-event-item[data-event-day="' + $scope.dshow  + '"]').addClass('c-event-over1');
                        $($('div.c-event-item[data-event-day="' + $scope.dshow  + '"]')[0]).addClass('active');
                        $scope.$apply(function(){
                            $scope.switchPlan(ind,eventDAYiD);
                        });
                    }

                }else{
                    // console.log("hbjhjbhjhj*********");

                    var ind= $($('div.c-event-item[data-event-day="0' + $scope.dshow + '"]')[0]).index();
                    // var eventDAYiD= $($('div.c-event[data-event-day="0' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                    // // console.log(ind);
                    // console.log(eventDAYiD);
                    // console.log(ind);
                    if(ind!=-1){
                        $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                        $('div.c-event-item[data-event-day="0' +$scope.dshow + '"]').addClass('c-event-over1');
                        $($('div.c-event-item[data-event-day="0' + $scope.dshow+ '"]')[0]).addClass('active');
                        $scope.$apply(function(){
                            $scope.switchPlan(ind,eventDAYiD);
                        });
                    }
                }

            };
            var previousMonth = function () {
                if (dMonth > 0) {
                    dMonth--;
                } else {
                    dMonth = 11;
                    dYear--;
                }
                print();
                var eventDAYiD= $($('div.c-event[data-event-day="' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                if($scope.dshow>=10){
                    // console.log("hbjhjbhjhj");

                    // console.log( $($('div.c-event-item[data-event-day="' + d  + '"]')[0]).index());
                    var ind= $($('div.c-event-item[data-event-day="' + $scope.dshow + '"]')[0]).index();
                    // var eventDAYiD= $($('div.c-event-item[data-event-day="' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                    // // console.log(ind);
                    //console.log(eventDAYiD);
                    //console.log(ind);
                    if(ind!=-1){
                        $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                        $('div.c-event-item[data-event-day="' + $scope.dshow  + '"]').addClass('c-event-over1');
                        $($('div.c-event-item[data-event-day="' + $scope.dshow  + '"]')[0]).addClass('active');
                        $scope.$apply(function(){
                            $scope.switchPlan(ind,eventDAYiD);
                        });

                    }
                }else{
                    // console.log("hbjhjbhjhj*********");

                    var ind= $($('div.c-event-item[data-event-day="0' +  $scope.dshow  + '"]')[0]).index();
                    // var eventDAYiD= $($('div.c-event-item[data-event-day="0' + $scope.dshow + '"]')[0]).attr('data-event-eventid');
                    // // console.log(ind);
                    //console.log(eventDAYiD);
                    //  console.log(ind);
                    if(ind!=-1){
                        $('div.c-event-item').removeClass('c-event-over1').removeClass('active');
                        $('div.c-event-item[data-event-day="0' +$scope.dshow + '"]').addClass('c-event-over1');
                        $($('div.c-event-item[data-event-day="0' + $scope.dshow+ '"]')[0]).addClass('active');
                        $scope.$apply(function(){
                            $scope.switchPlan(ind,eventDAYiD);
                        });
                    }
                }
            };

            function loadEvents() {
                if (typeof defaults.url != 'undefined' && defaults.url != '') {
                    $.ajax({
                        url: defaults.url,
                        async: false,
                        success: function (result) {
                            defaults.events = result;
                        }
                    });
                }
            }

            function print() {
                loadEvents();
                var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
                var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
                var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

                var cBody = $('<div/>').addClass('c-grid');
                var cEvents = $('<div/>').addClass('c-event-grid');
                var cEventsBody = $('<div/>').addClass('c-event-body');
                // cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(defaults.eventTitle));
                cEvents.append(cEventsBody);
                var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
                var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
                var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
                cPrevious.html(defaults.textArrows.previous);
                cMonth.html(defaults.months[dMonth] + ' ' + dYear);
                cNext.html(defaults.textArrows.next);

                cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
                cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

                cBody.append(cPrevious);
                cBody.append(cMonth);
                cBody.append(cNext);
                for (var i = 0; i < defaults.weekDays.length; i++) {
                    var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                    cWeekDay.html(defaults.weekDays[i]);
                    cBody.append(cWeekDay);
                }
                var day = 1;
                var dayOfNextMonth = 1;
                for (var i = 0; i < 42; i++) {
                    var cDay = $('<div/>');
                    if (i < dWeekDayOfMonthStart) {
                        cDay.addClass('c-day-previous-month c-pad-top');
                        cDay.html(dLastDayOfPreviousMonth++);
                    } else if (day <= dLastDayOfMonth) {
                        cDay.addClass('c-day c-pad-top');
                        if (day == dDay && adMonth == dMonth && adYear == dYear) {//当天之后的正常
                            cDay.addClass('c-today');
                        }
                        for (var j = 0; j < defaults.events.length; j++) {
                            var d = defaults.events[j].datetime;
                            var dayd=d.getDate();
                            if (d.getDate() == day && (d.getMonth()) == dMonth && d.getFullYear() == dYear) {//有演出的日期，加事件
                                cDay.addClass('c-event').attr('data-event-day', d.getDate()).attr('data-event-eventid', defaults.events[j].eventId);;
                                cDay.on("click",mouseOverEvent);
                            }
                        }

                        cDay.html(day++);
                    }

                    else {
                        cDay.addClass('c-day-next-month c-pad-top');
                        cDay.html(dayOfNextMonth++);
                    }
                    cBody.append(cDay);
                }

                $(instance).addClass('calendar');
                $(instance).html(cBody);
                if($('div.c-event').length>0){
                    /// console.log($($('div.c-event')[0]));
                    $($('div.c-event')[0]).addClass('c-event-over0');
                    var d = $($('div.c-event')[0]).attr('data-event-day');
                    //   console.log(d);
                    if(d>=10){
                        $scope.dshow=d;
                    }else{
                        $scope.dshow="0"+d;
                    }
                    // console.log("----***s")
                    // console.log($scope.dshow);
                }
            }

            return print();
        }



    })





