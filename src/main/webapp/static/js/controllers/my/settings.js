'use strict';

stareal
    .controller("SettingController", function ($scope, $api,$lazyLoader,localStorageService) {
       $scope.logout = function () {
           localStorageService.set('token',null);
           localStorageService.set('isbind','0');
           // var url = window.location.href;
           // var hash = url.substring(0,url.indexOf('#')+2)
           window.location.href='#/main/login/'
       }
    });