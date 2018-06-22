'use strict';

stareal
    .controller("GoodDetaController", function ($scope,$interval,$document, $stateParams, $api, $sce, base64, $state, $alert,localStorageService,$timeout) {
        var good = localStorageService.get("goodDetail");
        good.detail = $sce.trustAsHtml(base64.decode(good.detail));
        $scope.good = good;
        $timeout(function () {
            var dataDpr = $("html").data("dpr");
            var $Img = $(".good_Detail").find("p").find("img");
            var img_w = $Img.width();
            var img_h = $Img.height();
            if(dataDpr==1){
                $(".good_Detail").css({"font-size":28})
                $(".good_Detail").find("p").find("span").css({"font-size":14})
                // $Img.width(img_w*1)
                // $Img.height(img_h*1)
            }
            if(dataDpr==2){
                $(".good_Detail").css({"font-size":42})
                $(".good_Detail").find("p").find("span").css({"font-size":28})
                // $Img.width(img_w*2)
                // $Img.height(img_h*2)
            }
            if(dataDpr==3){
                $(".good_Detail").css({"font-size":56})
                $(".good_Detail").find("p").find("span").css({"font-size":42})
                // $Img.width(img_w*3)
                // $Img.height(img_h*3)
            }
        },0)
    });