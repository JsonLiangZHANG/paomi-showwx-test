'use strict';

stareal
    .controller("GoodDetaController", function ($scope,$interval,$document, $stateParams, $api, $sce, base64, $state, $alert,localStorageService,$timeout) {
        var good = localStorageService.get("goodDetail"+$stateParams.id);
        $scope.sharUrl='https://m.blackwan.cn/?#/'; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致'
        console.log(good);
        good.detail = $sce.trustAsHtml(base64.decode(good.detail));
        $scope.good = good;
        $timeout(function () {
            var dataDpr = $("html").data("dpr");
            var $Img = $(".good_Detail").find("p").find("img");
            var img_w = $Img.width();
            var img_h = $Img.height();
            if(dataDpr==1){
                $(".good_Detail").css({"font-size":14})
                $(".good_Detail").find("p").find("span").css({"font-size":14})
                // $Img.width(img_w*1)
                // $Img.height(img_h*1)
            }
            if(dataDpr==2){
                $(".good_Detail").css({"font-size":14})
                $(".good_Detail").find("p").find("span").css({"font-size":14})
                // $Img.width(img_w*2)
                // $Img.height(img_h*2)
            }
            if(dataDpr==3){
                $(".good_Detail").css({"font-size":14})
                $(".good_Detail").find("p").find("span").css({"font-size":14})
                // $Img.width(img_w*3)
                // $Img.height(img_h*3)
            }
        },0)
        $api.get("app/detail/good/retrieve", {id: $stateParams.id}, true)
            .then(function (ret) {
                var gooddetail=ret.data;
                $scope.gooddetailm=gooddetail;
            })
        //分享
        //微信分享http://192.168.1.4:9090/oauth/getSignature
        $api.get("app/share/getSignature",{url: 'https://m.blackwan.cn/'})
            .then(function (ret) {

                if (ret) {
                    //     console.log(ret);
                    var data=ret.data;
                    // console.log('-------------------------------');
                    // console.log(data);
                    // console.log(data.appid);
                    // console.log(data.timestamp);
                    // console.log(data.nonceStr);
                    // console.log(data.signature);

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
                    wx.ready(function(){
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
                    wx.error(function(res){
                        //console.log(res);
                        //alert("微信分享接口配置失败");
                    });
                }
            })
    });