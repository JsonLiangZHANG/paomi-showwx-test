'use strict';

stareal
    .controller("CustomerManageEditController", function ($scope,$document, $stateParams, $lazyLoader, $api, $alert, $state) {
        $scope.mypage = 7;
        $scope.GetCard =function(){
            $api.get("app/card/retrieve", {}, true)
                .then(function (ret) {
                    $scope.cards = ret.data;
                });
        }
        $scope.GetCard()

        function isCardNo(card) {
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证
            var reg=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;//身份证
            // var reg = /^[0-9a-zA-Z]+$/;
            if(reg.test(card) === false) { //身份证
                $alert.show("请输入有效的,合法的身份证号！");
                return false;
            }

            return true;
        }
        function isCardTai(card){  //台胞证
            var reg=/^([0-9]{8}|[0-9]{10})$/ ; //台胞证
            //var reg = /^[0-9a-zA-Z]+$/;
            if(reg.test(card) === false) {
                $alert.show("请输入有效的,合法的台胞证号！");
                return false;
            }

            return true;
        }
        function isCardHONG(card){  //护照 /^[a-zA-Z]{5,17}$/;
            // var re2 = /^[a-zA-Z0-9]{5,17}|[a-zA-Z]{5,17}$/
            // var reg=/^([0-9]{8}|[0-9]{10})$/ ; //港澳回乡证
            var reg = /^[a-zA-Z0-9]{5,17}|[a-zA-Z]{5,17}$/;
            if(reg.test(card) === false) {
                $alert.show("请输入有效的,合法的护照证号！");
                return false;
            }

            return true;
        }
        function isCardHONG2(card){  //港澳通行证证
            // var reg=/^([0-9]{8}|[0-9]{10})$/ ; //港澳回乡证
            var reg = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; //港澳通行证证
            if(reg.test(card) === false) {
                $alert.show("请输入有效的,合法的港澳通行证号！");
                return false;
            }

            return true;
        }
        //添加地址清空数据
        $scope.add = function () {
            $scope.name = '';
            $scope.Certificatetype='';
            $scope.Certificate_type='';
            $scope.Certificate_no='';
        }
        //保存
        $scope.save = function () {

            if (!$scope.name) {
                $alert.show("姓名不能为空!");
                return false;
            }
            if($scope.name.length<2){
                $alert.show("姓名不能少于2个字符！");
                return;
            }
            if (!$scope.Certificate_type) {
                $alert.show("请选择证件类型!");
                return false;
            }
            if (!$scope.Certificate_no) {
                $alert.show("证件号不能为空!");
                return false;
            }
            if($scope.Certificate_type=='身份证'){
                $scope.Certificatetype=1;
                if(!isCardNo($scope.Certificate_no)){
                    return;
                }
            }else if($scope.Certificate_type=='护照'){
                $scope.Certificatetype=2;
                if(!isCardHONG($scope.Certificate_no)){
                    return;
                }
            }else if($scope.Certificate_type=='港澳通行证'){
                $scope.Certificatetype=3;
                if(!isCardHONG2($scope.Certificate_no)){
                    return;
                }
            }else if($scope.Certificate_type=='台胞证'){
                $scope.Certificatetype=4;
                if(!isCardTai($scope.Certificate_no)){
                    return;
                }
            }
           // $("#mask-add").fadeOut();
            console.log($scope.Certificate_type);
            //新增地址  name姓名 idcard身份证号码 type类型 1身份证 2.护照 3.港澳通行证 4.台胞证
            $api.post("app/card/create", {
                name: $scope.name,
                type: $scope.Certificatetype,
                idcard: $scope.Certificate_no,

            }, true)
                .then(function (ret) {
                   $state.go('my.customerManage',{},true)
                }, function (err) {
                    $alert.show(err);
                });

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