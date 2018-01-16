'use strict';

/**
 *  fuck.!!!
 *
 */
angular.module('starealAlert', [])
    .directive('starealAlert', starealAlertDirective)
    .provider('$alert', starealAlertProvider);

starealAlertDirective.$inject = ['$alert'];
function starealAlertDirective($alert) {
    return {
        restrict: 'E',
        template: '<div ng-show="starealAlert.msg" style="text-align:center;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999999;">' +
        '             <div class="bg"></div>' +
        '             <div class="alert" style="display:table;margin:0 auto;background: rgba(34,34,34,0.80);padding:0.26666rem;border-radius:0.10666rem;min-width:6.68rem">' +
        '               <div></div>' +
        '               <span style="color:#fff;" class="f16">{{starealAlert.msg}}</span>' +
        '             </div>' +
        '          </div>',
        link: function (scope, element, attrs) {
            scope.starealAlert = $alert;
            if (scope.starealAlert.type == undefined) {
                scope.starealAlert.type = "alert";
            }
        }
    };
}

function starealAlertProvider() {
    var self = this;

    self.timeout = 2000;
    self.setDefaultTimeout = function (defaultTimeout) {
        self.timeout = defaultTimeout;
    };

    self.$get = ['$timeout', function ($timeout) {
        var cancelTimeout = null;

        return {
            msg: null,
            show: show,
            clear: clear
        };

        function show(msg, callback, sf) {
            var that = this;
            this.msg = msg;
            this.type = 'alert';

            if (sf) {
                this.type = 'right';
            }

            if (cancelTimeout) {
                $timeout.cancel(cancelTimeout);
            }
            cancelTimeout = $timeout(function () {
                that.clear();

                if (callback) {
                    callback.apply(null, []);
                }
            }, self.timeout);
        }

        function clear() {
            this.msg = null;
        }
    }];
}