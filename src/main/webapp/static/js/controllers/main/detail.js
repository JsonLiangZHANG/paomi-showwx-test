'use strict';

stareal
    .controller("DetailController", function ($scope,$timeout, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        $scope.current =$stateParams.good_id;
        $api.get("app/detail/good/retrieve", {id: $stateParams.good_id},true)
            .then(function (ret) {
                var good = ret.data;
                console.log(good)
                localStorageService.set("goodDetail",good)
                good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                $scope.good = good;
                $scope.title = $scope.good.title;
                $scope.site_title = $scope.good.site_title;
                $scope.thumb = $scope.good.thumb;
                $scope.seat = good.seat_thumb;  //座位图
                $scope.favor = $scope.good.favor;//收藏\
                $scope.star = $scope.good.star;
                $scope.is_coupon = $scope.good.is_coupon;//是否可以使用优惠券
                if($scope.star){
                    $scope.star = good.star.split('.')
                }
                if (good.state == '售票中') {
                    $scope.shop_bg = '';
                    $scope.gbn = '立即购票';
                    $scope.gf = 1;
                }
                if (good.state == '预售中') {
                    $scope.shop_bg = '';
                    $scope.gbn = '立即购票';
                    $scope.gf = 1;
                }
                if (good.state == '扫尾票') {
                    $scope.shop_bg = '';
                    $scope.gbn = '立即购票';
                    $scope.gf = 1;
                }
                if (good.state == '即将开票') {
                    $scope.good.sold = 0;
                    if(good.appRegistered==1){
                        $scope.gbn = '已预订';
                        $scope.shop_bg = 'subscribe';
                        return false;
                    }
                    $scope.shop_bg = 'subscribe';
                    $scope.gbn = '立即预定';
                    $scope.gf = 2;
                }

                if (good.state == '演出结束') {
                    $scope.shop_bg = 'disable';
                    $scope.gbn = good.state;
                    $scope.gf = 0;
                }

            });
        //巡演开始
        $api.get("app/detail/good/tour", {id: $stateParams.good_id},true)
            .then(function (ret) {
                if(ret.data.length>0){
                    $scope.tours = ret.data;
                    $timeout(function () {
                        var swiper = new Swiper('.swiper-container', {
                            slidesPerView: 'auto',
                            spaceBetween:0,
                            observer:true//修改swiper自己或子元素时，自动初始化swiper
                        })
                        var winW = document.documentElement.clientWidth; //可视区宽度
                        var $slide = angular.element(".swiper-container").find(".swiper-slide")
                        var $sildeActive = angular.element(".swiper-container").find(".swiper-slide.active")
                        var _index = $sildeActive.index()//当前索引
                        var oNav = document.getElementById("swiper-wrapper");
                        var _length = $slide.length;//长度
                        var w1 = 0;//itme总长度
                        var tourTop = parseInt($(".tour").css('padding-left'))+parseInt($(".tour").css('padding-right'))
                        $slide.each(function () {
                            w1+=$(this).outerWidth(true)
                        })
                        var maxLeft = w1-winW+tourTop
                        var w2 = $sildeActive.offset().left-($sildeActive.width())*3
                        if(_index<=3){
                            oNav.style.transform = "translate3d(0px, 0px, 0px)";
                            return false;
                        }
                        if(_index>3&&_index<_length-1-3){
                            //改变位置
                            oNav.style.transform = "translate3d(-"+w2+"px, 0px, 0px)";
                        }
                        if(_index>=_length-1-3){
                            oNav.style.transform = "translate3d(-"+maxLeft+"px, 0px, 0px)";
                            return false;
                        }
                    },0)
                }
            })
        //当前加active
        $scope.isActive = function (s) {
            return $scope.current ==s
        }
        //预约
        var alertHe =  angular.element('.alert_box').outerHeight();
        $scope.show = false;
        $scope.go = function (gf,e) {
            if ($scope.gf == 1) {
                localStorageService.set('title',$scope.title);
                localStorageService.set('site_title',$scope.site_title);
                localStorageService.set('thumb',$scope.thumb);
                localStorageService.set('is_coupon',$scope.is_coupon);
                $state.go('main.ticket', {good_id: $stateParams.good_id});
            }
            if($scope.gf == 2){
                if (!localStorageService.get('token')) {
                    // $state.go("main.login",{})
                    // return false;
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        // 正式地址
                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                            // "appid=wxd39f7e740343d507&" +
                            // "redirect_uri=http%3A%2F%2Fm.stareal.cn%2Foauth%2Findex" +
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
                }
                var bodyH = angular.element('body').height();
                angular.element('.mask').css({
                    'display':'block',
                    'height':bodyH
                })
                angular.element('.alert_box').css({
                    'display':'block',
                    'bottom':-alertHe
                });
                angular.element('.alert_box').animate({bottom:'0px'},200);
                e.stopPropagation();
            }
        }
        //关闭弹窗
        angular.element('.alert_box').click(function (e) {
            e.stopPropagation();
        })
        $scope.close = function () {
            angular.element('.alert_box').animate({bottom:-alertHe},200);
            angular.element('.mask').fadeOut()
        }
        angular.element('html,body').click(function () {
            $scope.close()
        })
        //获取头像
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $scope.user = ret.data;
            })
        //获取评论
        $scope.GetCooments = function () {
            $api.get("app/comment/goodComments",{
                good_id:$stateParams.good_id,
                pageNum:1,
                pageSize:3},true)
                .then(function (ret) {
                    $scope.totalRe = ret.total_row;
                    $scope.reviews = ret.data;
                })
        }
        $scope.GetCooments()
        //跳转写评论
        $scope.write = function () {
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
                return false;
            }
            $state.go('main.write_reviews',{good_id:$scope.current});
        }
        //收藏
        $scope.collect = function (GoodId) {
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
    });