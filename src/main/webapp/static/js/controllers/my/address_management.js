'use strict';

stareal
    .controller("AddressManagementController", function ($scope, $api, $alert) {
        $scope.GetAddress =function(){
            $api.get("app/address/retrieve", {}, true)
            .then(function (ret) {
                $scope.addresses = ret.data;
                console.log(ret)
            });}
        $scope.GetAddress()
        //地址管理中设置默认地址
        $scope.setDefault =  function (id) {
            $scope.id = id;
            $api.post("app/address/isdefault",{
                id:$scope.id,
            },true)
                .then(function (ret) {
                    $scope.GetAddress()
                })
        }
        //删除地址
        $scope.deleteAddress = function (id) {
            if (confirm("想清楚哟")){
                $api.post("app/address/delete", {id: id}, true)
                    .then(function (ret) {
                        $alert.show("删除成功");
                        setTimeout(function () {
                            $scope.GetAddress()
                        },300)
                    },function (err) {
                        $alert.show(err)
                    })
            }
            else {
                $alert.show("嘿嘿！不删啦")
            }
        }
    });