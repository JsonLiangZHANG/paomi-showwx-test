'use strict';

stareal
    .controller("CommentController", function ($scope, $stateParams, $api, $state,$lazyLoader,$rootScope,localStorageService) {
        $scope.comments = new $lazyLoader("app/comment/retrieve", {},true)
    });