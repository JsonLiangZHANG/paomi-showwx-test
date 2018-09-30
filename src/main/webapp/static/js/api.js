'use strict';

stareal.config(function ($httpProvider, localStorageServiceProvider) {

    // 跨域
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.headers.common['source']='mobile';  //增加访问识别标识
    // $httpProvider.defaults.headers.post ={'source':'mobile'};  //增加访问识别标识
    // 新增表头
    //$httpProvider.defaults.headers.common['Api-Invoker'] = stareal_wx

    localStorageServiceProvider
        .setPrefix('StarealWebApp')
        .setStorageType('sessionStorage');

}).factory('$api', function ($q, $http, localStorageService) {
    //var host_prefix = "http://api.mldfzj.com/mobile/";
   // var host_prefix = "https://api.mydeershow.com/mobile/";
    // var host_prefix = "http://api.sat-show.com/mobile/";
    //var host_prefix = " http://api.owe108.com.cn/mobile/";
    // var host_prefix = "http://api.xiuhelive.com/mobile/";
    //var host_prefix = "http://10.1.100.151:80/mobile/";
    var host_prefix = "http://api.fjzscb1997.com/mobile/";
    var service = {
        get: function (url, params, needToken) {
            return handleRepData('get', url, params, needToken);
        },
        post: function (url, params, needToken) {
            return handleRepData('post', url, params, needToken);
        }
    }
    function handleRepData(method, url, data, needToken) {
        var params = data || {};
        params.source = 'mobile';//标识
        if (needToken|| params.accessToken===undefined) {
            params.accessToken = localStorageService.get('token');
        }
        url = host_prefix + url;
        var promise;
        var defer = $q.defer();
        switch (method) {
            case 'get':
                promise = $http({method: 'GET', url: url, params: params});
                break;
            case 'post':
                promise = $http({method: 'POST', url: url, params: params});
        }

        promise.then(function (rep) {
            if (rep.data.retCode == 0) {
                defer.resolve(rep.data);
            } else {
                defer.reject(rep.data.message);
            }
        }, function () {
            defer.reject('invoke error');
        });

        return defer.promise;
    }

    return service;
}).factory('$lazyLoader', function ($api, $alert, $rootScope) {

    var LazyLoader = function (url, params, needToken, callback) {
        this.url = url;
        this.params = params || {};
        this.needToken = needToken;

        this.items = [];
        this.busy = false;
        this.end = false;
        this.nodata = false;

        this.params.pageNum = 0;
        this.params.pageSize = 10;

        // 兼容以下情況,草。
        this.params.page_num = 0;
        this.params.page_size = 12;

        this.callback = callback;
    };

    LazyLoader.prototype.nextPage = function () {

        if (this.busy) return;
        this.busy = true;

        this.params.pageNum += 1;
        this.params.page_num += 1;

        $api.get(this.url, this.params, this.needToken)
            .then(function (ret) {
               // console.log(ret)
                var items = ret.data;
                for (var i = 0; i < items.length; i++) {
                    this.items.push(items[i]);
                }

                if (ret.total_page == 0) {
                    this.nodata = true;
                    return;
                }

                if (this.callback) {
                    var that = this;
                    this.callback.apply(null, [that]);
                }

                if (this.params.pageNum == ret.total_page) {
                    this.end = true;
                    return;
                }
                this.busy = false;
            }.bind(this));
    };

    return LazyLoader;
})