'use strict';

stareal
    .directive('accessCertification', function (localStorageService) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                // localStorageService.set('token', attrs.token);
                localStorageService.set('openid', attrs.openid);
                localStorageService.set('isbind', attrs.isbind);
                if(attrs.token != undefined && attrs.token !=null && attrs.token != ''){
                    localStorageService.set('token', attrs.token);
                }
                if (attrs.rs) {
                    localStorageService.set('rs', attrs.rs);
                }

            }
        }
    })
    .directive('onFinishRenderFilters', ['$timeout', function ($timeout) {//ng-repeat
        return {
            restrict: 'A',
            link: function(scope,element,attr) {
                if (scope.$last === true) {
                    var finishFunc=scope.$parent[attr.onFinishRenderFilters];
                    if(finishFunc)
                    {
                        finishFunc();
                    }
                }
            }
        };
    }])
    .directive('goBack', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', goBack);

                function goBack() {
                    history.back();
                    // scope.$apply();
                }
            }
        }
    })
    .directive('onListFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onListFinishRender);
                    });
                }
            }
        }
    })
    .directive('onFinish', function ($timeout) {  //检查Dom渲染玩
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }})
    .directive('thumbSize', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var _width = element.width();
                element.height((_width - 2) * 10 / 7);
            }
        }
    })//一元夺宝倒计时
    .directive('orderTime', function ($interval,$timeout) {
        return {
            restrict: 'EA',
            scope:{
                orderTimeSer:'=',
            },
            template:'{{time}}',
            link:function (scope,element,attrs){
                var endTime = scope.orderTimeSer.replace(/-/gi,'/')
                function updateTime(){
                    scope.finish_time = Date.parse(new Date(endTime))//结束时间
                    scope.nowTime = Date.parse(new Date())//当前时间
                    scope.time_difference =(scope.finish_time-scope.nowTime)/1000;//时差
                    if(scope.time_difference>0){
                        scope.iDay = parseInt(scope.time_difference/86400);//算出每天
                        scope.time_difference%=86400;
                        scope.iHours = parseInt(scope.time_difference/3600)+scope.iDay*24;//算出小时
                        scope.time_difference%=3600;
                        scope.iMin = parseInt(scope.time_difference/60);//算出分钟
                        scope.time_difference%=60;
                        scope.iSec=scope.time_difference;   //算出秒
                        scope.time=setDigit(scope.iHours,2)+':'+setDigit(scope.iMin,2)+':'+setDigit(scope.iSec,2)
                    }else {
                        $interval.cancel(timer);
                        scope.time = '等待开奖'
                    }
                }
                function setDigit(num,n){      //在时，分，秒前面补0
                    var str = ''+num;
                    while(str.length<n){
                        str = '0'+str;
                    }
                    return str;
                }
                updateTime()
                var timer = $interval(updateTime,1000)
            }
        }
    })//没有图像的时候默认一个图像
    .directive('errSrc', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src == ''||attrs.src==null||attrs.src==undefined){
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    })
    .directive("slideFollow",function($timeout){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                id : "@",
                datasetData : "="
            },
            template : "<li ng-repeat = 'data in datasetData'><p><span>2017.02.23</span><span>{{data.option}}</span></p></li>",
            link : function(scope,elem,attrs) {
                $timeout(function(){
                    var className = $("." + $(elem).parent()[0].className);
                    var i = 0,sh;
                    var liLength = className.children("li").length;
                    var liHeight = className.children("li").height() + parseInt(className.children("li").css('border-bottom-width'));
                    className.html(className.html() + className.html());
// 开启定时器
                    sh = setInterval(slide,4000);
                    function slide(){
                        if (parseInt(className.css("margin-top")) > (-liLength * liHeight)) {
                            i++;
                            className.animate({
                                marginTop : -liHeight * i + "px"
                            },"slow");
                        } else {
                            i = 0;
                            className.css("margin-top","0px");
                        }
                    }
// 清除定时器
                    className.hover(function(){
                        clearInterval(sh);
                    },function(){
                        clearInterval(sh);
                        sh = setInterval(slide,4000);
                    })
                },0)
            }
        }
    })
    .directive('imgView', function () {
        return {
            restrict: 'EA',
            scope:{
                imgArr:'='
            },
            link: function (scope, element, attrs) {
                /*
                 * ImageView v1.0.0
                 * --基于zepto.js的大图查看
                 * --调用方法 ImageView(index,imgDada)
                 * --index 图片默认值显示索引,Number  --imgData 图片url数组,Array
                 * */
                var ImageView=(function(window,$){
                    var _this=$("#slideView"),_ImgData=[],_index=0,_length=0,
                        _start=[],_org=[],_orgTime=null,
                        _lastTapDate=null,
                        _zoom=1,_zoomXY=[0,0],_transX=null,
                        _advancedSupport = false,
                        _doubleDistOrg=1,_doubleZoomOrg=1,isDoubleZoom = false,
                        isSlide=true,isDrag=false,timer=null,
                        winW=window.innerWidth,winH=window.innerHeight;
                    /**
                     * 事件对象 event
                     */
                    var Event={
                        touchstart:function(e){
                            e.preventDefault();
                            if (_advancedSupport && e.touches && e.touches.length >= 2) {
                                var img = getImg();
                                $(img).css({"-webkit-transitionDuration": "0ms","transitionDuration": "0ms"});
                                _doubleZoomOrg = _zoom;
                                _doubleDistOrg = getDist(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
                                isDoubleZoom = true;
                                return

                            }
                            e = e.touches ? e.touches[0] : e;
                            isDoubleZoom = false;
                            _start = [e.pageX, e.pageY];
                            _org = [e.pageX, e.pageY];
                            _orgTime = Date.now();
                            _transX = -_index * winW;
                            if(_zoom!=1){
                                _zoomXY = _zoomXY || [0, 0];
                                var _orgZoomXY = [_zoomXY[0], _zoomXY[1]];
                                var img = getImg();
                                img&&($(img).css({"-webkit-transitionDuration": "0ms","transitionDuration": "0ms"}));
                                isDrag = true
                            }else{
                                _this.find(".pv-inner").css({"-webkit-transitionDuration":"0ms","transitionDuration":"0ms"});
                                isSlide = true
                            }
                        },
                        touchmove:function(e){
                            e.preventDefault();
                            if (_advancedSupport && e.touches && e.touches.length >= 2) {

                                var newDist = getDist(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
                                _zoom = (newDist/_doubleDistOrg) * _doubleZoomOrg

                                var img = getImg();
                                $(img).css({"-webkit-transitionDuration": "0ms","transitionDuration": "0ms"});
                                if (_zoom < 1) {
                                    _zoom = 1;
                                    _zoomXY = [0, 0];
                                    $(img).css({"-webkit-transitionDuration": "200ms","transitionDuration": "200ms"})

                                } else if (_zoom >getScale(img) * 2){
                                    _zoom = getScale(img) * 2;
                                }

                                $(img).css({"-webkit-transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] + "px," + _zoomXY[1] + "px)","transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] + "px," + _zoomXY[1] + "px)"});
                                return
                            }
                            if (isDoubleZoom){
                                return;
                            }
                            e = e.touches ? e.touches[0] : e;
                            if (_zoom != 1) {
                                var deltaX = (e.pageX - _start[0]) / _zoom;
                                var deltaY = (e.pageY - _start[1]) / _zoom;
                                _start = [e.pageX, e.pageY];

                                var img = getImg();
                                var newWidth = img.clientWidth *_zoom,
                                    newHeight = img.clientHeight * _zoom;
                                var borderX = (newWidth - winW) / 2 / _zoom,
                                    borderY = (newHeight - winH) / 2 / _zoom;
                                (borderX >= 0)&&(_zoomXY[0] < -borderX || _zoomXY[0] > borderX)&&(deltaX /= 3);
                                (borderY > 0)&&(_zoomXY[1] < -borderY || _zoomXY[1] > borderY)&&(deltaY /= 3);
                                _zoomXY[0] += deltaX;
                                _zoomXY[1] += deltaY;

                                (_length == 1 && newWidth < winW||newWidth < winW)&&(_zoomXY[0] = 0);
                                (_length == 1 && newHeight < winH||newHeight < winH)&&(_zoomXY[1] = 0);

                                $(img).css({"-webkit-transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] +
                                "px," + _zoomXY[1] + "px)","transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] +
                                "px," + _zoomXY[1] + "px)"})
                            }else{
                                if (!isSlide) return;
                                var deltaX = e.pageX - _start[0];
                                (_transX > 0 || _transX < -winW * (_length - 1))&&(deltaX /= 4);
                                _transX = -_index * winW + deltaX;
                                _this.find(".pv-inner").css({"-webkit-transform":"translate(" + _transX + "px,0px) translateZ(0)"});

                            }
                        },
                        touchend:function(e){
                            if (isDoubleZoom) {
                                return;
                            }
                            if (_zoom != 1) {
                                if (!isDrag){return;}
                                var img = getImg();
                                var newWidth = img.clientWidth *_zoom,
                                    newHeight = img.clientHeight * _zoom;
                                var borderX = (newWidth - winW) / 2 / _zoom,
                                    borderY = (newHeight - winH) / 2 / _zoom;

                                if (_length > 1 && borderX >= 0) {
                                    var updateDelta = 0;
                                    var switchDelta = winW / 6;
                                    if (_zoomXY[0] < -borderX - switchDelta / _zoom && _index < _length - 1){
                                        updateDelta = 1;
                                    }else if (_zoomXY[0] > borderX + switchDelta / _zoom && _index > 0){
                                        updateDelta = -1;
                                    }
                                    if (updateDelta != 0) {
                                        scaleDown(img);
                                        changeIndex(_index + updateDelta);
                                        return
                                    }
                                }
                                var delta = Date.now() - _orgTime;
                                if (delta < 300) {
                                    (delta <= 10)&&(delta = 10);
                                    var deltaDis = Math.pow(180 / delta, 2);
                                    _zoomXY[0] += (_zoomXY[0] - _orgZoomXY[0]) * deltaDis;
                                    _zoomXY[1] += (_zoomXY[1] - _orgZoomXY[1]) * deltaDis;
                                    $(img).css({"-webkit-transition": "400ms cubic-bezier(0.08,0.65,0.79,1)","transition": "400ms cubic-bezier(0.08,0.65,0.79,1)"})
                                } else{
                                    $(img).css({"-webkit-transition": "200ms linear","transition": "200ms linear"});
                                }

                                if (borderX >= 0){
                                    if (_zoomXY[0] < -borderX){
                                        _zoomXY[0] = -borderX;
                                    }else if (_zoomXY[0] > borderX){
                                        _zoomXY[0] = borderX;
                                    }
                                }

                                if (borderY > 0){
                                    if (_zoomXY[1] < -borderY){
                                        _zoomXY[1] = -borderY;
                                    }else if (_zoomXY[1] >borderY){
                                        _zoomXY[1] = borderY;
                                    }
                                }

                                if (Math.abs(_zoomXY[0]) < 10) {
                                    $(img).css({"-webkit-transform": "scale(" + _zoom + ") translate(0px," + _zoomXY[1] + "px)","transform": "scale(" + _zoom + ") translate(0px," + _zoomXY[1] + "px)"});
                                    return
                                } else{
                                    $(img).css({"-webkit-transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] + "px," + _zoomXY[1] + "px)","transform": "scale(" + _zoom + ") translate(" + _zoomXY[0] + "px," + _zoomXY[1] + "px)"});
                                }
                                isDrag = false

                            }else{
                                if (!isSlide){ return;}
                                var deltaX = _transX - -_index * winW;
                                var updateDelta = 0;
                                if (deltaX > 50){
                                    updateDelta = -1;
                                }else if(deltaX < -50){
                                    updateDelta = 1;
                                }
                                _index=_index+updateDelta;
                                changeIndex(_index);
                                isSlide =false
                            }

                        },
                        click:function(e){
                            _zoom=1;
                            _zoomXY=[0,0];
                            _this.css("opacity","0").css("display","none");
                            timer=setTimeout(function(){
                                _this.css({"display":""}).html("");
                                unbind();
                            },150)
                        },
                        dobelTap:function(e){
                            clearTimeout(timer);
                            var now = new Date;
                            if (now - _lastTapDate < 500){
                                return;
                            }
                            _lastTapDate = now;
                            var img = getImg();
                            if (!img){
                                return;
                            }

                            if (_zoom != 1){
                                scaleDown(img);
                            }else{
                                scaleUp(img);
                            }
                        },
                        setView:function(e){
                            setTimeout(function(){
                                winW=window.innerWidth;
                                winH=window.innerHeight;

                                //alert(winW)
                                //alert(winH)
                                _this.width(window.innerWidth).height(window.innerHeight);
                                translate((-_index*window.innerWidth),0,0,$(".pv-inner")[0]);
                                scaleDown(getImg())
                            },200)
//          winW=window.innerWidth;
//          winH=window.innerHeight;
//
//          alert(winW)
//          alert(winH)
//          _this.width(window.innerWidth).height(window.innerHeight);
//          translate((-_index*window.innerWidth),0,0,$(".pv-inner")[0]);
//          scaleDown(getImg())
                        }

                    };
                    var handleEvent=function(e){
                        switch (e.type){
                            case "touchstart":
                                Event.touchstart(e);
                                break;
                            case "touchmove":
                                Event.touchmove(e);
                                break;
                            case "touchcancel":
                            case "touchend":
                                Event.touchend(e);
                                break;
                            case "orientationchange":
                            case "resize":
                                Event.setView(e);
                                break
                        }
                    };


                    /**
                     * 绑定事件
                     */
                    var bind=function(){

                        _this.on("singleTap",function(e){
                            e.preventDefault();
                            var now = new Date;
                            if (now - _lastTapDate < 500){
                                return;
                            }
                            _lastTapDate = now;
                            Event.click(e);
                            return false;
                        }).on("doubleTap", function(e) {
                            e.preventDefault();
                            Event.dobelTap(e);
                            return false;
                        });
                        _this.on("touchstart touchmove touchend touchcancel", function(e) {
                            handleEvent(e);

                        });
                        Event.setView();

                        "onorientationchange" in window ? window.addEventListener("orientationchange",Event.setView,false) : window.addEventListener("resize",Event.setView,false);

                    };

                    /**
                     * 解除事件
                     */
                    var unbind= function() {
                        _this.off();
                        "onorientationchange" in window ? window.removeEventListener("orientationchange",Event.setView, false) : window.removeEventListener("resize",Event.setView, false)
                    };
                    var getDist= function(x1, y1, x2, y2) {

                        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 2)
                    }
                    /**
                     * 图片缩放
                     */
                    var getScale=function(img) {
                        var h = img.naturalHeight, w = img.naturalWidth,
                            Scale=w*h/(img.clientHeight*img.clientWidth);
                        return Scale;
                    };
                    var scaleUp=function(img) {
                        var scale = getScale(img);
                        if (scale > 1)
                            $(img).css({"-webkit-transform": "scale(" + scale + ")","transform": "scale(" + scale + ")","-webkit-transition": "200ms","transition": "200ms"});
                        _zoom = scale;
                    };
                    var scaleDown=function(img) {
                        _zoom = 1;
                        _zoomXY = [0, 0];
                        _doubleDistOrg = 1;
                        _doubleZoomOrg = 1;
                        $(img).css({"-webkit-transform": "scale(1)","transform": "scale(1)","-webkit-transition": "200ms","transition": "200ms"});
                    };


                    /**
                     * 滑动效果
                     * dist
                     */
                    var translate = function( distX,distY,speed,ele) {
                        if( !!ele ){ ele=ele.style; }else{ return; }
                        ele.webkitTransitionDuration =  ele.MozTransitionDuration = ele.msTransitionDuration = ele.OTransitionDuration = ele.transitionDuration =  speed + 'ms';
                        ele.webkitTransform = 'translate(' + distX + 'px,'+distY+'px)' + 'translateZ(0)';
                        ele.msTransform = ele.MozTransform = ele.OTransform = 'translateX(' + distX + 'px) translateY(' + distY + 'px)';
                    };

                    /**
                     * 更改索引值 _index
                     */
                    var changeIndex=function(index,force){
                        if (index < 0){
                            index = 0;
                        }else if(index >= _length){
                            index =_length - 1;
                        }

                        _index = index;
                        translate((-_index*window.innerWidth),0,force? "0" : "200" ,$(".pv-inner")[0]);
                        $("#J_index").html(_index+1+"/"+_length);
                        imgLoad();
                    }


                    /**
                     * 图片获取
                     */
                    var getImg=function(index) {
                        var img = _this.find("li").eq(index || _index).find("img");
                        if (img.size() == 1){
                            return img[0];
                        }else{
                            return null
                        }
                    }

                    /**
                     * 图片加载
                     */
                    var imgLoad=function(){
                        if($(".pv-img").eq(_index).find("img")[0]){
                            $("#J_loading").css("display","");
                            return;
                        }else{
                            $("#J_loading").css("display","block");
                            var tempImg=new Image(),w,h,set;
                            tempImg.src=_ImgData[_index];
                            $(".pv-img").eq(_index)[0].appendChild(tempImg);
                            tempImg.onload=function(){
                                $("#J_loading").css("display","");
                            }
                        }


                    };


                    /**
                     * 创建大图查看Dome结构
                     */
                    var Create=function(){
                        _this.append("<ul class='pv-inner'></ul>").append("<p class='counts'><span class='value' id='J_index'>"+(_index+1)+"/"+_length+"</span></p>").append("<span class='ui-loading' id='J_loading' ><i class='t1'></i><i class='t2'></i><i class='t3'></i></span>")
                        for(var i=0;i<_length;i++){
                            $(".pv-inner").append("<li class='pv-img'></li>")
                        }
                        imgLoad();

                    };


                    /**
                     * 大图查看初始化
                     */
                    var init=function(){
                        !!_this[0]||$("body").append("<div class='slide-view' id='slideView'></div>");
                        // console.log(_this[0])
                        _this=$("#slideView");
                        // console.log(_this)
                        ($.os.iphone || $.os.android && parseFloat($.os.version) >= 4)&&(_advancedSupport = true);
                    }();

                    /**
                     * 大图查看返回接口函数
                     * ImageView(index,data)
                     * index 初始索引值 nubmer
                     * data 图片数组 array
                     */
                    var ImageView=function(index,data){
                        _ImgData=data;
                        _index=index;
                        _length=data.length;

                        //创建dom结构
                        Create();
                        //dom结构显示
                        _this.css("display","block").css("opacity","1");
                        //绑定事件
                        bind();
                    }
                    return ImageView;
                })(window,Zepto);
                element.on("click",function (e) {
                    e.stopPropagation();
                    var _index = $(this).index();//当前索引
                    var obj = $(this).parent().children().find("img");
                    var imgArr = [];
                    $.each(obj,function (key,vaule) {
                        imgArr.push(vaule.src)
                    })
                    ImageView(_index,imgArr);
                })
            }
        }
    })
    .directive('menu', function () {//底部菜单
        return {
            restrict: 'E',
            templateUrl: 'static/partials/public/menu.html'
        };
    })
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                // var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.readAsDataURL(params.file);
                reader.onload=function(e){
                    // var result=document.getElementById("result");
                    //显示文件
                    element.html('<img src="' + this.result +'" alt="" />');
                }

                // function onLoadFile(event) {
                //     var img = new Image();
                //     img.onload = onLoadImage;
                //     img.src = event.target.result;
                // }
                //
                // function onLoadImage() {
                //     // var width = params.width || this.width / this.height * params.height;
                //     // var height = params.height || this.height / this.width * params.width;
                //     // canvas.attr({ width: 120, height: 120 });
                //     canvas[0].getContext('2d').drawImage(this, 0, 0, 120, 120);
                // }
            }
        };
    }])
    .directive('sign', function () {//底部菜单
        return {
            restrict: 'E',
            templateUrl: 'static/partials/public/sign.html'
        };
    })//签到
    .directive("imgUpload",function($alert,localStorageService,$http,$api){
        return{
            //通过设置项来定义
            restrict: 'AE',
            scope: false,
            replace: true,
            link: function(scope, ele, attrs) {
                ele.bind('change', function() {
                    scope.file = ele[0].files;
                    scope.fileName = scope.file[0].name;
                    // var postfix = scope.fileName.substring(scope.fileName.lastIndexOf(".")+1).toLowerCase();
                    // if(postfix!="jpg" && postfix!="png"){
                    //     $alert.show("图片仅支持png、jpg类型的文件");
                    //     scope.fileName = "";
                    //     scope.file = null;
                    //     scope.$apply();
                    //     return false;
                    // }
                    scope.$apply();
                    scope.reader = new FileReader();    //创建一个FileReader接口
                    if (scope.file) {
                        $alert.show("图片上传中..");
                        //获取图片（预览图片）
                        scope.reader.readAsDataURL(scope.file[0]);    //FileReader的方法，把图片转成base64
                        scope.reader.onload = function(ev) {
                            scope.$apply(function(){
                                scope.thumb = {
                                    imgSrc : ev.target.result       //接收base64，scope.thumb.imgSrc为图片。
                                };
                            });
                        };
                        var token = localStorageService.get('token')
                         var url = 'http://api.fjzscb1997.com/mobile/app/upload/image?accessToken='+token; //正式
                       // var url = 'http://t.stareal.cn:8080/api/app/upload/image?accessToken='+token;//测试
                        var fd = new FormData();
                        fd.append('image', scope.file[0]);
                        $http.post(url, fd, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).success(function (data) {
                            if(data.retCode=='0'){
                                $api.post("app/login/userinfo/update",{
                                    headimgurl:data.url
                                },true)
                                    .then(function (ret) {
                                            $alert.show("修改成功")

                                    },function (err) {
                                        $alert.show(err)
                                    })
                            }else{
                                $alert.show(data.message);
                            }

                        })
                    }else{
                        alert('上传图片不能为空!');
                    }
                });
            }
        };
    })
    .directive('changeState', function ($window,$alert,$interval) {//监听订单支付超时状态
        return {
            restrict: 'EA',
            scope:{
                orderState:'=',
                createTime:'='
            },
            // template:'{{time}}',
            link: function (scope,element,attrs) {
                if(scope.orderState=='待付款'){
                    scope.create_time = Date.parse(new Date(scope.createTime.replace(/-/gi,'/')))//兼容ios问题
                    var expiredTime =  scope.create_time+15*60*1000;//过期时间戳
                    var nowDate =  Date.parse(new Date());//现在时间戳
                    scope.date = expiredTime-nowDate;
                    var updateTime =function () {
                        scope.date -= 1000;
                        scope.time = scope.date;
                        if(scope.date<=0){
                            scope.orderState = '已取消';
                            $interval.cancel(timer);
                        }
                    }
                    var timer = $interval(updateTime,1000)
                    updateTime()
                }
            }
        }
    })//时间到改状态
    .directive('changeState1', function ($window,$alert,$interval) {//监听订单支付超时状态
        return {
            restrict: 'EA',
            scope:{
                orderState:'=',
                createTime:'='
            },
            template:"<sapn>剩余时间</sapn><span style='color: red;'>{{time|date:'mm分ss秒'}}</span>",
            link: function (scope,element,attrs) {
                if(scope.orderState=='待付款'){
                    // console.log(index)
                    scope.create_time = Date.parse(new Date(scope.createTime.replace(/-/gi,'/')))//兼容ios问题
                    var expiredTime =  scope.create_time+15*60*1000;//过期时间戳
                    var nowDate =  Date.parse(new Date());//现在时间戳
                    scope.date = expiredTime-nowDate;
                    var updateTime =function () {
                        scope.date -= 1000;
                        scope.time = scope.date;
                        if(scope.date<=0){
                            scope.orderState = '已取消';
                            $interval.cancel(timer);
                        }
                    }
                    var timer = $interval(updateTime,1000)
                    updateTime()
                }
            }
        }
    })//时间到改状态
//衍生品
    .directive('changeProductState', function ($window,$alert,$interval) {//监听订单支付超时状态
        return {
            restrict: 'EA',
            scope:{
                orderState:'=',
                createTime:'='
            },
            // template:'{{time}}',
            link: function (scope,element,attrs) {
                if(scope.orderState=='待支付'){
                    scope.create_time = Date.parse(new Date(scope.createTime.replace(/-/gi,'/')))//兼容ios问题
                    var expiredTime =  scope.create_time+15*60*1000;//过期时间戳
                    var nowDate =  Date.parse(new Date());//现在时间戳
                    scope.date = expiredTime-nowDate;
                    var updateTime =function () {
                        scope.date -= 1000;
                        scope.time = scope.date;
                        if(scope.date<=0){
                            scope.orderState = '已取消';
                            $interval.cancel(timer);
                        }
                    }
                    var timer = $interval(updateTime,1000)
                    updateTime()
                }
            }
        }
    })//时间到改状态
    .directive('changeProductState1', function ($window,$alert,$interval) {//监听订单支付超时状态
        return {
            restrict: 'EA',
            scope:{
                orderState:'=',
                createTime:'='
            },
            template:"<sapn>剩余时间:</sapn><span style='color: red;'>{{time|date:'mm分ss秒'}}</span>",
            link: function (scope,element,attrs) {
                if(scope.orderState=='待支付'){
                    // console.log(index)
                    scope.create_time = Date.parse(new Date(scope.createTime.replace(/-/gi,'/')))//兼容ios问题
                    var expiredTime =  scope.create_time+15*60*1000;//过期时间戳
                    var nowDate =  Date.parse(new Date());//现在时间戳
                    scope.date = expiredTime-nowDate;
                    var updateTime =function () {
                        scope.date -= 1000;
                        scope.time = scope.date;
                        if(scope.date<=0){
                            scope.orderState = '已取消';
                            $interval.cancel(timer);
                        }
                    }
                    var timer = $interval(updateTime,1000)
                    updateTime()
                }
            }
        }
    })//时间到改状态
    .directive('closeModel',function () {
        return{
            restrict:'EA',
            link:function (scope,element,attrs) {
                console.log("22")
                element.bind('click',function () {
                    $(".pubtps").fadeOut();

                })
            }
        }
    })
    .directive('stopPropagation',function () {
        return{
            restrict:'EA',
            link:function (scope,element,attrs) {
                element.bind('click',function (e) {
                    e.stopPropagation();
                })
            }
        }
    })
