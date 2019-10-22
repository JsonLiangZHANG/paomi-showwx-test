'use strict';

stareal
    .controller("NewsListController", function ($scope, $api, $stateParams, $state, $lazyLoader,$timeout) {
        $scope.mypage = 2;
        $scope.listpage= 3;
        $scope.kind = "";
        $scope.sort ='hot';
        $scope.direct = "desc";
        $scope.isHot = ($scope.sort == 'hot');
        $scope.sf = false;
        $scope.toggle = function () {
            $scope.sf = !$scope.sf;
        }

        // // 加载导航栏
        // $api.get("app/main/category/retrieve")
        //     .then(function (ret) {
        //         var nav  = ret.data;
        //         $scope.navs = nav;
        //         $timeout(function () {
        //             var swiper = new Swiper('.swiper-container', {
        //                 slidesPerView: 'auto',
        //                 spaceBetween:0,
        //                 observer:true//修改swiper自己或子元素时，自动初始化swiper
        //             })
        //         },0)
        //     });

        // 加载对应演出种类的内容
        $scope.goods = new $lazyLoader("app/news/list", {
            kind: ($scope.kind == 'all'?'':$scope.kind),
            sort: $scope.sort,
            direct: $scope.direct
        });

        var refresh = function(){
            $state.go('main.newslist',{kind:$scope.kind,sort:$scope.sort,direct:$scope.direct});
        };
        // //衍生品
        // var product=function(){
        //     $state.go('main.product',{});
        // }

        // // 点击导航栏
        // $scope.switch = function(kind){
        //     console.log($stateParams);
        //     $scope.kind = kind;
        //     refresh();
        // };
        // $scope.sw = function(){
        //     console.log(this);
        //     product();
        //     //alert("正在开发.....");
        // };
        // 热度/时间排序过滤
        $scope.filter = function (sort,direct) {
            $scope.sort = sort;
            $scope.direct = direct;
            $scope.isHot = ($scope.sort == 'hot');
            refresh();
        }
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
                            link: 'https://m.mydeershow.com/ticketPage', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                            link: 'https://m.mydeershow.com/ticketPage', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                            link: 'https://m.mydeershow.com/ticketPage', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                            link: 'https://m.mydeershow.com/ticketPage', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
        // // 调整当前Nav的位置
        // $scope.$on('navFinishRender', function () {
        //     var index = ($stateParams.kind != 'all' ? parseInt($stateParams.kind) + 1 : 0);
        //     var winW = document.documentElement.clientWidth;
        //     var oNav = document.getElementById("swiper-wrapper");
        //     if (index>=5){
        //         for (var j=0; j<index;j++){
        //             oNav.style.transform = "translate3d(-8.2666rem, 0px, 0px)";
        //         }
        //     }
        // });
    });