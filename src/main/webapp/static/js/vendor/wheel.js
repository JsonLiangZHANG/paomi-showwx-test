//对元素监听鼠标滚轮滚动事件，当向上滚动时，执行calllback(1),否则执行callback(-1)
(function($) {
    $.fn.onmousewheel = function(callback) {
        var element = $(this);
        if (/firefox/.test(navigator.userAgent.toLowerCase())) {
            element.on("DOMMouseScroll", function(e) {
                var num = getWheelValue(e);
                callback(num);
            });
        } else {
            element.on("mousewheel", function(e) {
                var num = getWheelValue(e);
                callback(num);
            });
        }
        function getWheelValue(e) {
            e.preventDefault();
            var event = e.originalEvent;
            if (/firefox/.test(navigator.userAgent.toLowerCase())) {
                return -event.detail / 3;
            } else {
                return event.wheelDelta / 120;
            }
        }
    }
}
)(jQuery);