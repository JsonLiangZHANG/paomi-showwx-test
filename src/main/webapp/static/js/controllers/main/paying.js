'use strict';

stareal
    .controller("PayingController", function ($scope, $stateParams, $api, $sce, base64, $state, $alert,localStorageService) {
        $scope.periodId = localStorageService.get('periodId')//期号
        $scope.title= localStorageService.get('title')//标题
        $scope.thumb = localStorageService.get('thumb')//缩略图
        $scope.num = localStorageService.get('num')//数量

        var selectedAddressId = localStorageService.get($scope.periodId + '_address_id');
        if (selectedAddressId) {  //点击进去设置
            $scope.addressId = selectedAddressId;
            $api.get("app/address/getbyid", {id: selectedAddressId}, true)
                .then(function (ret) {
                    $scope.address = ret.data;
                });
        }
        else {
            $api.get("app/address/getDefault", {}, true)//没有点击进去默认地址
                .then(function (ret) {
                    $scope.address = ret.data;
                    var _addressId = ret.data.id;
                    if (_addressId) {
                        $scope.addressId = _addressId;
                    }
                });
        }


        //跳转支付成功页
        $scope.goPayresult = function () {
            if($scope.addressId){
                var Tips = confirm("确定购买吗？")
                if(Tips){
                    $api.post("app/treasure/order/create",{periodId:$scope.periodId,num:$scope.num,addressId:$scope.addressId},true)
                        .then(function (ret) {
                            $state.go("main.payresult",{})
                        },function (err) {
                            $alert.show(err)
                        })
                }else{
                    $state.go("main.paying",{})
                }
            }else{
                $alert.show("请添加地址")
            }
        }
    });