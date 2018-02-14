'use strict';

var loadLazyjs = function (js) {
    return {
        loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'stareal',
                files: js
            })
        }
    }
};

stareal.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('?');

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });


    $urlRouterProvider.otherwise('/main/index');

    $stateProvider
        .state('main', {
            url: '/main',
            template: '<div ui-view ></div>'
        })
        .state('main.index', {
            url: '/index',
            templateUrl: 'static/partials/main/index.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/index.js',
                'static/js/controllers/public/public.js',
                'static/js/controllers/public/sign.js',
                'static/css/public.css',
                'static/css/main.css',
                'static/css/newstyle.css'
            ])
        })
        //精彩回顾
        .state('main.special', {
            url: '/special',
            templateUrl: 'static/partials/main/special.html',
            resolve: loadLazyjs([
                'static/css/special.css',
            ])
        })
        //专题
        .state('main.topic', {
            url: '/topic',
            templateUrl: 'static/partials/main/topic.html',
            resolve: loadLazyjs([
                'static/css/special.css',
            ])
        })
        //专题
        .state('main.product', {
            url: '/product',
            templateUrl: 'static/partials/main/product.html',
            resolve: loadLazyjs([
                'static/css/public.css',
                'static/css/list.css',
                'static/css/special.css'
            ])
        })
        .state('main.list', {
            url: '/list/:kind/:sort/:direct/:keyword',
            templateUrl: 'static/partials/main/list.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/list.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/list.css',
                'static/css/special.css'
            ])
        })
        .state('main.search', {
            url: '/search',
            templateUrl: 'static/partials/main/search.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/search.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/main.css'
            ])
        })
        .state('main.detail', {
            url: '/detail/good/:good_id',
            templateUrl: 'static/partials/main/detail.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/detail.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/detail.css'
            ])
        })
        .state('main.gooddetail', {
            url: '/gooddetail',
            templateUrl: 'static/partials/main/gooddetail.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/gooddetail.js',
                'static/css/public.css'
            ])
        })
        .state('main.ticket', {
            url: '/detail/ticket/:good_id',
            templateUrl: 'static/partials/main/ticket.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/ticket.js',
                'static/css/public.css',
                'static/css/ticket.css'
            ])
        })
        .state('main.pay', {
            url: '/pay/:order_id?_',
            templateUrl: 'static/partials/main/pay.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/pay.js',
                'static/css/public.css',
                'static/css/ticket.css'
            ])
        })
        .state('main.pay_address', {
            url: '/pay/address/:order_id/:src/',
            templateUrl: 'static/partials/main/pay_address.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/pay_address.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.pay_coupon', {
            url: '/pay/coupon/:order_id/:good_id/:total',
            templateUrl: 'static/partials/main/pay_coupon.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/pay_coupon.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.login', {
            url: '/login/:good_id',
            templateUrl: 'static/partials/main/login.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/login.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.user_register', {
            url: '/user/register',
            templateUrl: 'static/partials/main/user_register.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/user_register.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.reset_password_1', {
            url: '/reset/password/1',
            templateUrl: 'static/partials/main/reset_password_1.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/reset_password_1.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.reset_password_2', {
            url: '/reset/password/2',
            templateUrl: 'static/partials/main/reset_password_2.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/reset_password_2.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.register', {
            url: '/register',
            templateUrl: 'static/partials/main/register.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/register.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.treasure', {
            url: '/treasure/:kind',
            templateUrl: 'static/partials/main/treasure.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/treasure.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.award', {
            url: '/award/:award_id',
            templateUrl: 'static/partials/main/award.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/award.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.unveiled', {
            url: '/unveiled',
            templateUrl: 'static/partials/main/unveiled.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/unveiled.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.partake', {
        url: '/partake/:award_id',
        templateUrl: 'static/partials/main/partake.html',
        resolve: loadLazyjs([
                'static/js/controllers/main/partake.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.recharge', {
            url: '/recharge',
            templateUrl: 'static/partials/main/recharge.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/recharge.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.paying', {
            url: '/paying',
            templateUrl: 'static/partials/main/paying.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/paying.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.payresult', {
            url: '/payresult',
            templateUrl: 'static/partials/main/payresult.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/payresult.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.activity', {
            url: '/activity/:id',
            templateUrl: 'static/partials/main/activity.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/activity.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('main.countdetail', {
            url: '/countdetail',
            templateUrl: 'static/partials/main/countdetail.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/countdetail.js',
                'static/css/public.css',
                'static/css/treasure.css'
            ])
        })
        .state('main.privilege', {
            url: '/privilege',
            templateUrl: 'static/partials/main/privilege.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/privilege.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
            ])
        })
        .state('main.allcomments',{
            url: '/allcomments/good/:good_id',
            templateUrl: 'static/partials/main/allcomments.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/allcomments.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/detail.css'
            ])
        })
        .state('main.allreply',{
            url: '/allreply/good/:comment_id',
            templateUrl: 'static/partials/main/allreply.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/allreply.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/detail.css'
            ])
        })
        .state('main.write_reviews', {
            url: '/write_reviews/good/:good_id',
            templateUrl: 'static/partials/main/write_reviews.html',
            resolve: loadLazyjs([
                'static/js/controllers/main/write_reviews.js',
                'static/css/public.css',
                'static/css/detail.css'
            ])
        })
        // *******************************************  大家好,我是分割线  *******************************************
        .state('my', {
            url: '/my',
            template: '<div ui-view ></div>'
        })
        .state('my.index', {
            url: '/index',
            templateUrl: 'static/partials/my/index.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/index.js',
                'static/js/controllers/public/public.js',
                'static/js/controllers/public/sign.js',
                'static/css/public.css',
                'static/css/my.css',
            ])
        })
        .state('my.logistics_information', {
            url: '/logistics/information/:order_id',
            templateUrl: 'static/partials/my/logistics_information.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/logistics_information.js',
                'static/css/public.css',
                'static/css/my.css',
            ])
        })
        .state('my.orders', {
            url: '/orders/:status',
            templateUrl: 'static/partials/my/orders.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/orders.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.order', {
            url: '/order/:id',
            templateUrl: 'static/partials/my/order.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/order.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.coupon', {
            url: '/coupon/:status',
            templateUrl: 'static/partials/my/coupon.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/coupon.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.address_management', {
            url: '/address/management',
            templateUrl: 'static/partials/my/address_management.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/address_management.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.phone_binding', {
            url: '/phone_binding',
            templateUrl: 'static/partials/my/phone_binding.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/phone_binding.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.modify_binding', {
            url: '/modify_binding',
            templateUrl: 'static/partials/my/modify_binding.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/modify_binding.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.verify_phone', {
            url: '/verify_phone',
            templateUrl: 'static/partials/my/verify_phone.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/verify_phone.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.verify_original_phone', {
            url: '/verify_original_phone',
            templateUrl: 'static/partials/my/verify_original_phone.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/verify_original_phone.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.reset_password', {
            url: '/reset_password',
            templateUrl: 'static/partials/my/reset_password.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/reset_password.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.edit_address', {
            url: '/edit/address/:id',
            templateUrl: 'static/partials/my/edit_address.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/edit_address.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.message', {
            url: '/message',
            templateUrl: 'static/partials/my/message.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/message.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.message_praise', {
            url: '/message/praise',
            templateUrl: 'static/partials/my/message_praise.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/message_praise.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.message_reply', {
            url: '/message/reply',
            templateUrl: 'static/partials/my/message_reply.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/message_reply.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.message_system', {
            url: '/message/system',
            templateUrl: 'static/partials/my/message_system.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/message_system.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.message_system_detail', {
            url: '/message_system_detail',
            templateUrl: 'static/partials/my/message_system_detail.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/message_system_detail.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.settings_index', {
            url: '/settings',
            templateUrl: 'static/partials/my/settings.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/settings.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.settings_feedback', {
            url: '/settings/feedback',
            templateUrl: 'static/partials/my/settings_feedback.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/settings_feedback.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.about_stars', {
            url: '/about_stars',
            templateUrl: 'static/partials/my/about_stars.html',
            resolve: loadLazyjs([
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.settings_problems', {
            url: '/settings/problems',
            templateUrl: 'static/partials/my/settings_problems.html',
            resolve: loadLazyjs([
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.account_settings', {
            url: '/account_settings',
            templateUrl: 'static/partials/my/account_settings.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/account_settings.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.set_nickname', {
            url: '/set_nickname',
            templateUrl: 'static/partials/my/set_nickname.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/set_nickname.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.precious', {
            url: '/precious/:kind',
            templateUrl: 'static/partials/my/precious.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/precious.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.member', {
            url: '/member',
            templateUrl: 'static/partials/my/member.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/member.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.beili', {
            url: '/beili',
            templateUrl: 'static/partials/my/beili.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/beili.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.rank', {
            url: '/rank',
            templateUrl: 'static/partials/my/rank.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/rank.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.share', {
            url: '/share',
            templateUrl: 'static/partials/my/share.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/share.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.record', {
            url: '/record',
            templateUrl: 'static/partials/my/record.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/record.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.collect', {
            url: '/collect',
            templateUrl: 'static/partials/my/collect.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/collect.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.comment', {
            url: '/comment',
            templateUrl: 'static/partials/my/comment.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/comment.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
        .state('my.comment_detail', {
            url: '/comment/detail/:comment_id',
            templateUrl: 'static/partials/my/comment_detail.html',
            resolve: loadLazyjs([
                'static/js/controllers/my/comment_detail.js',
                'static/js/controllers/public/public.js',
                'static/css/public.css',
                'static/css/my.css'
            ])
        })
}])
    .run(['$rootScope', '$state', 'localStorageService', function ($rootScope, $state, localStorageService) {
        $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
            window.scrollTo(0,0);
            $rootScope.currentDate = new Date() //底部菜单时间
            var stateName = toState.name;
            //拦截以下路由,身份验证
            if (stateName == 'main.ticket' || stateName == 'main.pay' || stateName.indexOf('my') == 0) {
                if (!localStorageService.get('token')) {
                    evt.preventDefault();

                    var rs = "";
                    if (stateName == 'main.ticket') {
                        rs = "main.detail-" + JSON.stringify({good_id: toParams.good_id});
                    }

                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        // 正式地址
                        // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        //     "appid=wxd39f7e740343d507&" +
                        //     "redirect_uri=http%3A%2F%2Fm.stareal.cn%2Foauth%2Findex" +
                        //     "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                            "appid=wxda73ac8ac7af1261&" +
                            "redirect_uri=http%3A%2F%2Fm.mydeershow.com%2Foauth%2Findex" +
                            "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);

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
                        location.href = "#/main/login/"+encodeURIComponent(rs);
                    }


                }
            }
        },
            $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
                // to be used for back button //won't work when page is reloaded.
                console.log(fromState);
                console.log("成功");
                console.log( fromState.name);
                console.log("----------------");
                $rootScope.previousState_name = fromState.name;
                $rootScope.previousState_params = fromParams;
            }),
            $rootScope.back = function() {//实现返回的函数
                console.log("555")
                console.log($rootScope.previousState_name);
                console.log($rootScope.previousState_params);
                if($rootScope.previousState_name){
                    $state.go($rootScope.previousState_name,$rootScope.previousState_params,{reload:true});
                }else{
                    $state.go('main.index');
                   // $state.go($rootScope.previousState_name,$rootScope.previousState_params,{reload:true});
                }
               // $state.go($rootScope.previousState_name,$rootScope.previousState_params,{reload:true});
                //     console.log($rootScope);
                //     console.log($location);
                //      var href=$location.absUrl();
                //     var theRequest = new Object();
                //     if ( href.indexOf("&") != -1) {
                //         var str =  href.substr(1);
                //         var strs = str.split("&");
                //         for(var i = 0; i < strs.length; i ++) {
                //             theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                //         }
                //     }
                //      console.log(theRequest);
                //     var http=href.split("/main")[0];    // "123"
                //     var params=$rootScope.previousState_params;
                //     console.log(http);
                //    // console.log(theRequest.app);
                //
                //     if(theRequest){
                //         if(theRequest.app){
                //             console.log("22222");
                //             location.href = http+"/main/detail/good/"+params.good_id;
                //         }else{
                //             window.history.go(-1);
                //         }
                //     }else{
                //         window.history.go(-1);
                //     }
                //
            }
        );
    }])