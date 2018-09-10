'use strict';

stareal.filter("buildDate", function () {
    return function (input, location) {
        if (location == 'before') {
            return input.substring(0, input.indexOf('#')).slice(5).replace('-','月')+'日';

        }

        if (location == 'after') {
            return input.substring(input.indexOf('#') + 1);
        }

        return input;
    }
}).filter("split",function () {
    return function (str) {

        return str.split(';')[0]

    }
})
    .filter("substitute",function () {
        return function (str) {
            return str.substr (3)
        }
    })
    .filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }])
    .filter("split1",function () {
        return function (str) {
            if(str!=''&&str!=undefined){
                return str.split(',')[0]
            }


        }
    })