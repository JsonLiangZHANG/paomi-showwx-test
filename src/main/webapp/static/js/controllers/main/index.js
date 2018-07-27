'use strict';

stareal
    .controller("IndexController", function ($scope, $api, $alert, $document, localStorageService, $state,$timeout,$compile) {
        $scope.mypage = 1;
        $scope.my_sing = 1;//我的页面隐藏gif图
       $api.get("app/news/list",{},true) //本地最近五条信息
            .then(function (ret) {
                $scope.datasetData = ret.data.slice(0,5);
                console.log($scope.datasetData)
                $timeout(function(){
                    var className = $(".slideUl");
                    var i = 0,sh;
                    var liLength = className.children("li").length;
                    var liHeight = className.children("li").height() + parseInt(className.children("li").css('border-bottom-width'));
                    var html = className.html() + className.html()
                    var $html = $compile(html)($scope);
                    className.append($html);
                    sh = setInterval(slide,4000);
                    function slide(){
                        if (parseInt(className.css("margin-top")) > (-liLength *  liHeight)) {
                            i++;
                            className.animate({
                                marginTop : -liHeight * i + "px"
                            },"slow");
                        } else {
                            i = 0;
                            className.css("margin-top","0px");
                        }
                    }
                },0)
            },function (err) {
                $alert.show(err)
            })
        // return url 回挑
        // return url 回挑
        var rs = localStorageService.get('rs');
       var token=localStorageService.get('token');
        var isbind = localStorageService.get('isbind');
        var openID = localStorageService.get('openid');
        if(isbind!=1){
         //   rs=rs+JSON.stringify({token:localStorageService.get('token')});
            localStorageService.set('token',null);
        }
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                $scope.user = ret.data;

                if(rs){
                    // if($scope.user.type!=1){
                    //     localStorageService.set('token',null);
                    // }
                    console.log("222");
                    if(isbind!=1&&openID!=''){
                        location.href = "#/main/bindregister/"+token;
                        // return;
                    }else if(isbind==1){
                        console.log('33');
                        localStorageService.remove('rs');
                        //  console.log(rs);
                        var _state = rs.substring(0, rs.indexOf('-'));
                        var _param = rs.substring(rs.indexOf('-') + 1, rs.length);
                        console.log(_param);
                        if (_param!=''&&_param!=undefined&&_param!=null) {
                            $state.go(_state, eval('(' + _param + ')'));
                            // return;
                        }else{
                            localStorageService.remove('rs');
                            $state.go(_state,{},true);
                        }
                    }else if(isbind!=1&&openID==''){
                        console.log('33');
                        localStorageService.remove('rs');
                        //  console.log(rs);
                        var _state = rs.substring(0, rs.indexOf('-'));
                        var _param = rs.substring(rs.indexOf('-') + 1, rs.length);
                        console.log(_param);
                        if (_param!=''&&_param!=undefined&&_param!=null) {
                            $state.go(_state, eval('(' + _param + ')'));
                            // return;
                        }else{
                            localStorageService.remove('rs');
                            $state.go(_state,{},true);
                        }

                    }

                }
            });

        // if(iband==='0'){
        //     if (rs) {
        //         localStorageService.remove('rs');
        //         console.log(rs);
        //         var _state = rs.substring(0, rs.indexOf('-'));
        //         var _param = rs.substring(rs.indexOf('-') + 1, rs.length);
        //         $state.go('main.speedlogin', eval('(' + _param + ')'));
        //         return;
        //     }else{
        //         $state.go('main.speedlogin');
        //     }
        //    // $state.go('main.login',{},true);
        // }else{
        //     if (rs) {
        //         localStorageService.remove('rs');
        //         console.log(rs);
        //         var _state = rs.substring(0, rs.indexOf('-'));
        //         var _param = rs.substring(rs.indexOf('-') + 1, rs.length);
        //
        //         $state.go(_state, eval('(' + _param + ')'));
        //         return;
        //     }
        // }


        //首页轮播
        $api.get("app/main/ad/retrieve",{})
            .then(function (ret) {
                $scope.advs = ret.data; //首页轮播
                console.log($scope.advs);
                //修改比例29/50
                angular.element('#carousel-demo').height($document.width()/2.08);
            })
        //列表
        $api.get("app/main/latest/good",{})
            .then(function (ret) {
                $scope.latest = ret.data  //列表
            })
        //导航分类
        // $timeout(function () {
        //     var swiper = new Swiper('.nav', {
        //         slidesPerView: 4,
        //         slidesPerGroup : 4,
        //         spaceBetween:0,
        //         pagination: '.swiper-pagination',//分页容器
        //         observer:true//修改swiper自己或子元素时，自动初始化swiper
        //     })
        // },0)
        //活动推荐
        // $timeout(function () {
        //     var swiper = new Swiper('.activity', {
        //         effect: 'coverflow',  //切换效果
        //         centeredSlides: true,  //显示居中状态
        //         slidesPerView: 'auto',  //显示的多少个
        //         loop : true,  //循环
        //         coverflow: {
        //             rotate: 50,//slide做3d旋转时Y轴的旋转角度。默认50。
        //             stretch: 50,//每个slide之间的拉伸值，越大slide靠得越紧。 默认0。
        //             depth:0,  //slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
        //             modifier: 1,//depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。默认1。
        //             slideShadows : false //开启slide阴影。默认 true。
        //         }
        //     });
        // },0)
        //列表
        //     var swiper = new Swiper('.Repertoire_container', {
        //         slidesPerView: 'auto',
        //         spaceBetween:0,
        //          pagination: '.Repertoire-pagination',//分页容器
        //         // prevButton:'.swiper-button-prev',
        //         // nextButton:'.swiper-button-next',
        //         observer:true,//修改swiper自己或子元素时，自动初始化swiper
        //
        //     })
        //     $timeout(function () {
        //         /**增加class */
        //         // swiper.prevButton.addClass("swiper-button-disabled");
        //         // /**移除class */
        //         // swiper.nextButton.removeClass("swiper-button-disabled");
        //         swiper.setWrapperTransition(0);
        //         /**设置位移0 显示第一页 */
        //         swiper.setWrapperTranslate(0);
        //       //console.log(swiper.realIndex);
        //       // $(".Repertoire-wrapper").css('transform','translate3d(0px, 0px, 0px)');
        //    },500)
        //点击跳转
       /* var _wrapper = document.getElementById("swiper-wrapper");
        _wrapper.addEventListener("click",function (e) {
            switch (e.target.id){
                case "activity-item-1":
                    $scope.$apply(function () {
                                $alert.show("活动暂未开启")
                            })
                    break;
                case "activity-item-2":
                    window.location.href='#/main/privilege'
                    break;
                case "activity-item-3":
                    window.location.href='#/my/share'
                    break;
            }
        },false)*/

       //微信分享http://192.168.1.4:9090/oauth/getSignature
        $api.get("app/share/getSignature",{url: window.location.href.split('#')[0]})
            .then(function (ret) {

                if (ret) {
                    console.log(ret);
                   var data=ret.data;
                    console.log('-------------------------------');
                    console.log(data);
                    console.log(data.appid);
                    console.log(data.timestamp);
                    console.log(data.nonceStr);
                    console.log(data.signature);

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
                    wx.ready(function(res){
                        //分享到朋友圈
                        console.log(res);
                        wx.onMenuShareTimeline({
                            title: '上海修合文化传播有限公司', // 分享标题
                            desc: '修合文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.xiuhelive.com/static/img/download2.png', // 分享图标
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
                            title: '上海修合文化传播有限公司', // 分享标题
                            desc: '修合文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.xiuhelive.com/static/img/download2.png', // 分享图标
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
                            title: '上海修合文化传播有限公司', // 分享标题
                            desc: '修合文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.xiuhelive.com/static/img/download2.png', // 分享图标
                            success: function () {
// 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareQZone({
                            title: '上海修合文化传播有限公司', // 分享标题
                            desc: '修合文化,精彩无限', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://www.xiuhelive.com/static/img/download2.png', // 分享图标
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
                        alert("微信分享接口配置失败");
                    });
                }
            })


    });