'use strict';

stareal
    .controller("AllCommentController", function ($scope, $stateParams, $api, $state,$lazyLoader) {
        $scope.reviews = new $lazyLoader("app/comment/goodComments",{good_id:$stateParams.good_id},true);
    });