'use strict';

stareal
    .controller("MessageSystemController", function ($scope, $api,$state,localStorageService,$lazyLoader) {
        $scope.goods = new $lazyLoader("app/notify/retrieve", {kind:3},true);
        //设为已读
        $scope.goComment = function (id,state,notify_id,index,type) {
            if(type=='order'){
                $state.go('my.order',{id:id})
            }
            if(type=='good'){
                $state.go('main.detail',{id:id})
            }
            if(state=='未读'){
                $api.get("app/notify/setRead",{notify_id:notify_id},true)
                    .then(function (ret) {
                        $scope.goods.items[index].state='已读';
                    })
            }
        }
    });