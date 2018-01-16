'use strict';

var stareal = angular
    .module('stareal', [
        'oc.lazyLoad',
        'ui.router',
        'LocalStorageModule',
        'ab-base64',
        'starealAlert',
        'infinite-scroll',//依赖angular-touch
        'angular-carousel',
        'angularFileUpload'
    ])
