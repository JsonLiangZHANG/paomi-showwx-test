'use strict';

stareal
    .controller("CustomerManageController", function ($scope,$document, $stateParams, $lazyLoader, $api, $alert, $state) {
        $scope.mypage = 7;
        $scope.GetCard =function(){
            $api.get("app/card/retrieve", {}, true)
                .then(function (ret) {
                    $scope.cards = ret.data;
                });
        }
        $scope.GetCard()
        $scope.alertmodel = function (ID) {
          //  console.log(ID);
            var height = $(window).height();
            $("."+ID).css("height", height);
            $("."+ID).fadeIn();
        }
        //删除地址
        $scope.deleteAddress = function (id) {
            $api.post("app/card/delete", {id: id}, true)
                .then(function (ret) {
                    $alert.show("删除成功");
                    $("."+id).fadeOut();
                    setTimeout(function () {
                        $scope.GetCard();
                    },300)
                },function (err) {
                    $alert.show(err)
                })
        }
        // $scope.CertificateType={'台胞证':{},'港澳通行证':{},'护照':{},'身份证':{}};
        //$scope.CertificateTypes={'身份证':{value:1},'护照':{value:2},'港澳通行证':{value:3},'台胞证':{value:4}};
        $scope.text=function(type){
            if(type==1){
                return '身份证';
            }else if(type==2){
                return '护照';
            }else if(type==3){
                return '港澳通行证';
            }else if(type==4){
                return '台胞证';
            }
        }

    });