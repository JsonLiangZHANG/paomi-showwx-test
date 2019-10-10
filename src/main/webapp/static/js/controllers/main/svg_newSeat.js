'use strict';

stareal
    .controller("SeatController", function ($rootScope,$scope,$http,$compile,$interval,$stateParams,$location,$anchorScroll,$api, $sce, base64, $state, $alert,$timeout, localStorageService,FileUploader) {
        $scope.currentId = $stateParams.good_id;
        $scope.currentEventId = $stateParams.event_id;
        $scope.date=localStorageService.get('date') ;
        $scope.timeId=localStorageService.get('timeId') ;
        $scope.goodTitle=localStorageService.get('good_title');
        $scope.max=localStorageService.get('good_titlemax');
        $scope.timeIndex= localStorageService.get('timeIndex');
        $scope._po=localStorageService.get('_po');
        $scope.seatsShow=true;
        $scope.laydate=15000;
        $("#seatsLoading").show();
        var timer1=null;
        var height=($(window).height()-parseInt(document.documentElement.style.fontSize)*4.0)+'px';
        $("#inverted-contain").height(height);
        //$("#svg").height(height);
        $("#svg").attr('width',$(window).width());
        $("#svg").attr('height',height);

        $scope.GetGood = function () {
            $api.get("app/detail/good/retrieve", {id: $stateParams.good_id},true)
                .then(function (ret) {
                    var good = ret.data;
                    // console.log(ret)
                    good.detail = $sce.trustAsHtml(base64.decode(good.detail));
                    $scope.good = good;
                    $scope.share=good.share;
                    $scope.seat = good.seat_thumb;
                    $scope.title = $scope.good.title;
                    $scope.introduction=$scope.good.introduction
                    $scope.site_title = $scope.good.site_title;
                    $scope.favor = $scope.good.favor;//收藏
                    $scope.thumb = $scope.good.thumb;
                    // console.log($scope.good.site_id);
                    $scope.mapId=$scope.good.site_id;
                    //  console.log($scope.mapId);
                    localStorageService.set('GoodmapId',$scope.mapId);
                    $scope.seat = good.seat_thumb; //座位图
                    $scope.gettickets();
                    // //生成分享的二维码
                    // $('#weixin_corder').qrcode({
                    //     text:  $scope.share
                    // });
                    if(!good.star){
                        $scope.showstar = true;
                    }else{
                        var star = good.star.split('.')
                        $scope.star1 = star[0];
                        $scope.star2 = star[1]
                    }
                    if (good.state == '售票中') {
                        $scope.gbs = {background: '#FF2450'};
                        $scope.gbn = '立即购票';
                        $scope.gf = 1;
                        $scope.process_status=2;
                        $scope.process_2=true;
                    }
                    if (good.state == '预售中') {
                        $scope.gbs = {background: '#FF2450'};
                        $scope.gbn = '立即购票';
                        $scope.gf = 1;
                        $scope.process_status=1;
                        $scope.process_1=true;
                    }
                    if (good.state == '扫尾票') {
                        $scope.gbs = {background: '#FF2450'};
                        $scope.gbn = '立即购票';
                        $scope.gf = 1;
                        $scope.process_status=3;
                        $scope.process_3=true;
                    }
                    if (good.state == '即将开票') {
                        $scope.process_0=true;
                        var t = function () {
                            if (!localStorageService.get('token')) {
                                $scope.$broadcast('to-child');
                                return;
                            }
                            //预约登记
                            var height = $(window).height();
                            $(".subscribe").css("height", height);
                            $(".subscribe-t").fadeIn();
                        }
                        $scope.createOrder = t;
                        if(good.appRegistered==1){
                            $scope.gbs = {background: '#fdcc4b'};
                            $scope.gbn = '已预约';
                            $scope.gf = 4;
                        }else{
                            $scope.gbs = {background: '#fdcc4b'};
                            $scope.gbn = '立即预约';
                            $scope.gf = 0;
                        }
                    }

                    if (good.state == '演出结束') {
                        $scope.gbs = {background: '#E8E8E8'};
                        $scope.gbn = good.state;
                        $scope.gf = 3;
                        $scope.process_status=4;
                        // $scope.process_4=true;
                    }
                    if (good.state == '已售罄') {
                        $scope.gbs = {background: '#E8E8E8'};
                        $scope.gbn = good.state;
                        $scope.gf = 3;
                    }

                });
        }
        $scope.GetGood();

        //获取场次
        $scope.gettickets=function(){
            $api.get("app/detail/ticket/retrieve", {id: $stateParams.good_id})
                .then(function (ret) {
                    $scope.timesList=ret.data;
                    $scope.switch( $scope.timeId,$scope.timeIndex);
                })
        }

        $scope.show = function () {
            if($scope.timeshow){
                $scope.timeshow=false;
            }else{
                $scope.timeshow = true;
            }

        }

        $scope.hide = function () {
            $scope.timeshow = false;
        }
        //更换场次
        $scope.switch=function(timeId,index){
            $scope.timeId=timeId;
            $scope.date= $scope.timesList[index].name;
            $scope.max= $scope.timesList[index].max_num;
            $scope.currentEventId= $scope.timesList[index].eventId;
            $scope.timeshow = false;
            localStorageService.set("myslectSeats",'');
            $scope.slectSeats=[];
            $scope.total = 0;
            if(localStorageService.get('token')){
                var mobile=localStorageService.get('mobile');  //获取区域
                $scope.getSetionImg();
            }
        }
        //获取背景图
        $scope.getSetionImg=function() {
            // timer1 = $interval(updateTime,1000);
            // updateTime()
            // function updateTime(){
            //     $scope.laydate -= 1000;
            //     if($scope.laydate<=0){
            //         $interval.cancel(timer1);
            //         $("#seatsLoading").hide();
            //         $alert.show('系统繁忙,数据加载失败!');
            //     }
            // }
            $api.get("app/map/ticket_v2/map", {mapid: $scope.mapId}, true)
                .then(function (ret) {
                    //console.log(ret);
                    var data=ret.map;
                    $scope.setionSvgsImg = data;
                    // var a=1000/ $scope.setionSvgsImg.height*0.32;
                    // var ssx="matrix("+a+", 0, 0, "+a+",0,0)";
                    // $("#all").attr("transform",ssx);
                    $("#bg").attr('width',data.width);
                    $("#bg").attr('height',data.height);
                    $scope.getSetion();
                });
        }
        //获取svg 区域
        $scope.getSetion=function(){
            $api.get("app/map/ticket_v2/sections",{mapid:$scope.mapId},true)
                .then(function (ret) {
                    $scope.setionSvgs=ret.section;
                    $scope.getSvgPrices();
                });
        }
        //价格区域
        $scope.getSvgPrices=function(){
            $api.get("app/map/ticket_v2/price", {mapid:$scope.mapId},true)
                .then(function (ret) {
                    $scope.priceSvgs=ret.price;
                });
        }
        //获取座位
        $scope.SELECTarea=0;

        $scope.getSvgSeats=function(areaID){
            // var timer=null;
            // timer = $interval(updateTime,1000);
            var timeout = setInterval(function(){
                $scope.laydate -= 1000;
                if($scope.laydate<=0){
                    $interval.cancel(timer);
                    $("#seatsLoading").hide();
                    // $alert.show('系统繁忙,数据加载失败!');
                }
            }, 1000)

            $scope.moveToch(areaID);
            $api.get("app/map/ticket_v2/seat", {mapid: $scope.mapId,areaid:areaID,eventid: $scope.currentEventId},true)
                .then(function (ret) {
                    var data=ret.seat;
                    clearInterval(timeout)
                    for(var i=0;i<data.length;i++){
                        if(data[i].locker_level!=99){
                            data[i].status='已售';
                        }
                    }
                    $scope.seatSvgs=data;
                    $scope.SELECTarea=areaID;
                    if( $scope.seatSvgs.length==0){
                        $("#seatsLoading").hide();
                    }else{
                        for(var i=0;i<$scope.setionSvgs.length;i++){  //section_url
                            if($scope.setionSvgs[i].id==areaID) {
                                $scope.Img360scan = $scope.setionSvgs[i].section_url;
                            }
                        }
                    }
                },function(err){
                    $alert.show('系统繁忙,数据加载失败!');
                    clearInterval(timeout)
                    $("#seatsLoading").hide();
                });

            function updateTime(){
                $scope.laydate -= 1000;
                if($scope.laydate<=0){
                    clearInterval(timeout)
                    $("#seatsLoading").hide();
                   // $alert.show('系统繁忙,数据加载失败!');
                }
            }

        }
        $scope.goShow=function () {
            $(".seat_dailog").fadeIn();
        }
        $scope.hideShow=function () {
            $(".seat_dailog").fadeOut();
        }

        $scope.completecarRepeat=function(){
            $("#loading_img").css('display','none');
        }
        //选座提交订单
        $scope.xuanCreateOrder=function(gf){
            if ( $scope.slectSeats.length == 0) {
                $alert.show("请选择座位!");
                return;
            }else{
                $scope.slectSeatsCarts=[];
                $.each($scope.slectSeats,function(index,data) {
                    $scope.slectSeatsCarts.push(data.price_seat_id);
                })

            }
            //$scope.max
            if ( $scope.slectSeats.length >$scope.max) {
                $alert.show("该演出一次只能购买"+$scope.max+'张！');
                return;
            }
            if(gf==1){
                $(angular.element("body")[0]).css('overflow','auto');
                localStorageService.set('seatscart',$scope.slectSeatsCarts);
                localStorageService.set('title',$scope.title);
                localStorageService.set('ticketId',$scope._po.id);
                localStorageService.set('site_title',$scope.site_title);
                localStorageService.set('eventShowId', $scope.currentEventId);
                localStorageService.set('thumb',$scope.thumb);
                localStorageService.set('seatsList',$scope.slectSeats);
                $state.go('main.xuanpay',{order_id:$stateParams.good_id});
                // var href='?#/main/xuanpay?order_id='+$stateParams.good_id
                //window.location.href = href;
            }
            if($scope.gf == 2) {
                if (!localStorageService.get('token')) {
                    // $state.go("main.login",{})
                    // return false;
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        // 正式地址
                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                            "appid=wx02aed5e805f89544&" +
                            "redirect_uri=http%3A%2F%2Fm.mldfzj.com%2Foauth%2Findex" +
                            "&response_type=code&scope=snsapi_userinfo&state=";
                    } else {
                        location.href = "#/main/login/";
                    }
                }
            }
            if(gf==0){//预约登记
                var height = $(window).height();
                $(".subscribe").css("height", height);
                $(".subscribe").fadeIn();
                return false
            }
            if(gf==3){
                $alert.show("演出结束");
                return false
            }
            if(gf==4){
                $alert.show("您已预约！")
                return false;
            }
        }
        var currentAreaId=0;
        //勾选座位
        if(localStorageService.get("myslectSeats")){
            $scope.slectSeats=localStorageService.get("myslectSeats");
            $scope.total = 0;
            $.each($scope.slectSeats, function (index, data) {
                $scope.total += data.price;
            })
        }else{
            $scope.slectSeats=[];
            $scope.total = 0;
        }
        //锚点
        $scope.seatsDalogshowStatus=false;
        $scope.seatsDalogshow=function(section_area,section_names,section_name,row,columns,price,status,size,price_seat_id,id,e){
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x0 = e.pageX || e.clientX + scrollX;
            var y0 = e.pageY || e.clientY + scrollY;
            // console.log(e);
            console.log(x0);
             console.log(y0);
             if(x0>300) {
               x0=280
             }
            $("#alert_show0").css({top:y0-20,left:x0+22});
            $scope.Seats_section_name=section_names+section_area;//  section_name;
            $scope.Seats_row=row;
            $scope.Seats_columns=columns;
            $scope.Seats_price=price;
            $scope.Seats_status=status;
            // $scope.Seats_size=size;
            $scope.seatsDalogshowStatus=true;
            var timeOut=function(){
                $scope.seatsDalogshowStatus=false;
            }
            $timeout(timeOut,1500,true)
        }
        $scope.seatsDaloghide=function(){
            console.log("999")
            $scope.seatsDalogshowStatus=false;
        }
        $scope.selectSeats=function(section_id,status,price_seat_id,id,event,section_name,section_area,section_names,row,columns,price,e) {
            $scope.seatsDalogshow(section_area,section_names,section_name,row,columns,price,status,'',price_seat_id,id,e)
            if (status == '待售') {
                if ($('#seats_' + id).attr('class') == 'seatselected') {
                    $('#seats_' + id).attr('class', '');
                    $scope.total = 0;
                    var data=$scope.slectSeats;
                    for(var i=0;i<data.length;i++){
                        if (data[i].id == id) {
                            $scope.slectSeats.splice(i, 1)
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        if (data[i].id != id) {
                            $scope.total += data[i].price;
                        }
                    }

                    localStorageService.set("myslectSeats",$scope.slectSeats);
                } else {
                    if ($scope.slectSeats.length <$scope.max) {
                        $('#seats_' + id).attr('class', 'seatselected');
                        //  console.log( $('#seats_' + id));
                        var obj = new Object();
                        obj.id = id;
                        obj.section_name = section_name;
                        obj.section_area = section_area;
                        obj.section_names = section_names;
                        obj.row = row;
                        obj.columns = columns;
                        obj.price_seat_id=price_seat_id;
                        obj.price = price;
                        obj.section_id=section_id;
                        $scope.slectSeats.push(obj);
                        $scope.total = 0;
                        $.each($scope.slectSeats, function (index, data) {
                            $scope.total += data.price;
                        })
                        localStorageService.set("myslectSeats",$scope.slectSeats);
                    } else {
                        $alert.show("该演出一次只能购买"+$scope.max+"张！");
                    }
                }
            }else if (status == '已售') {
                $alert.show("该座位已被抢,看看其他的吧！");
            }
        }
        $scope.deletseats=function(event,id){
            var e=event;
            e.stopPropagation();
            $scope.total=0;
            var data=$scope.slectSeats;
            $('#seats_'+id).attr('class','');
            for(var i=0;i<data.length;i++){
                if (data[i].id == id) {
                    $scope.slectSeats.splice(i, 1)
                }
            }
            for(var i=0;i<data.length;i++){
                if (data[i].id != id) {
                    $scope.total += data[i].price;
                }
            }
            localStorageService.set("myslectSeats",$scope.slectSeats);
        }
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $(document).ready(function(){
                FastClick.attach(document.body);
                var zoompaor={};
                var eventsHandler;
                eventsHandler = {
                    haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
                    , init: function(options) {
                        // console.log(options);
                        var instance = options.instance
                            , initialScale = 1
                            , pannedX = 0
                            , pannedY = 0;
                        zoompaor =options.instance

                        // Init Hammer
                        // Listen only for pointer and touch events
                        this.hammer = Hammer(options.svgElement, {
                            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
                        })

                        // Enable pinch
                        this.hammer.get('pinch').set({enable: true})

                        // Handle double tap
                        this.hammer.on('doubvarap', function(ev){
                            instance.zoomIn()
                        })

                        // Handle pan
                        this.hammer.on('panstart panmove', function(ev){
                            // On pan start reset panned variables
                            if (ev.type === 'panstart') {
                                pannedX = 0
                                pannedY = 0
                            }

                            // Pan only the difference
                            instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
                            pannedX = ev.deltaX
                            pannedY = ev.deltaY
                        })

                        // Handle pinch
                        this.hammer.on('pinchstart pinchmove', function(ev){
                            // On pinch start remember initial zoom
                            if (ev.type === 'pinchstart') {
                                initialScale = instance.getZoom()
                                instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
                            }

                            instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
                        })

                        // Prevent moving the page on some devices when panning over SVG
                        options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });

                    }

                    , destroy: function(){
                        this.hammer.destroy()
                    }




                }

                // Expose to window namespace for testing purposes
                 //   , controlIconsEnabled: true
                var panZoom = svgPanZoom('#svg', {
                    zoomEnabled: true
                    , fit:true
                    , center:true
                    ,viewportSelector:"#all"
                    , customEventsHandler: eventsHandler,
                    zoomScaleSensitivity:0.3,
                    minZoom:0.3
                    ,maxZoom:6
                    , onZoom:function(){
                        onZoom();
                    }
                    , beforePan: function(){}
                    , onPan: function(){
                        onpan();
                    }

                });
                var onZoom=function(){
                    var instance = zoompaor;
                    var initialScale = instance.getZoom()
                    var ev = initialScale.toFixed(2);
                    // onpan();
                    if(ev >= 6.0){
                        $timeout(function () {
                            $alert.show('已经是最大了!');
                        },0)

                    }
                    if(ev <= 0.3){
                        $timeout(function () {
                          $alert.show("已经是最小了");
                        },0)
                    }
                };
                // 限制移动范围
                var onpan=function(){
                    var cilentH = document.documentElement.clientHeight || document.body.clientHeight;
                    var cilentW = document.documentElement.clientWidth || document.body.clientWidth;
                    var instance = zoompaor;
                    var svgTop =  parseInt(document.documentElement.style.fontSize)*2.9;
                    var rectO = document.getElementById("all").getBoundingClientRect();
                    // console.log( rectO );
                    var wc = 0;
                    var hc = 0;
                    var ev=instance.getPan();
                    // console.log(ev);
                    var item  = null;//定时器
                    clearTimeout(item)//清除定时器
                    // 如果本身超过来了屏幕宽度
                    if(rectO.width > cilentW){
                        wc = rectO.width - cilentW;
                    }
                    // 如果本身超过来了屏幕高度
                    if(rectO.height > cilentH) {
                        hc = rectO.height - cilentH;
                    }
                    if(-(rectO.width*2/3)> ev.x){
                        document.getElementById("all").classList.add("ts");
                        instance.pan({x:-(wc/2),y:ev.y})
                        // if(wc>0){
                        //     instance.pan({x:-(wc/2),y:ev.y})
                        // }else{
                        //     instance.pan({x:0,y:ev.y})
                        // }
                        setTimeout(function(){
                            document.getElementById("all").classList.remove("ts");
                        },1000)
                    }
                    if((cilentW-rectO.width/3)< ev.x){

                        document.getElementById("all").classList.add("ts");
                        // if(wc>0){
                        //     instance.pan({x:-(wc/2),y:ev.y})
                        // }else{
                        //     instance.pan({x:0,y:ev.y})
                        // }
                        instance.pan({x:-(wc/2),y:ev.y})
                        setTimeout(function(){
                            document.getElementById("all").classList.remove("ts");
                        },1000)
                    }

                    if(-(rectO.height*2/3) > ev.y){
                        document.getElementById("all").classList.add("ts");
                        if(hc>0){
                            instance.pan({x:ev.x,y:(hc/2)})
                        }else {
                            instance.pan({x: ev.x, y: -(rectO.height - cilentH) * 1 / 2})
                        }
                        setTimeout(function(){
                            document.getElementById("all").classList.remove("ts");
                        },1000)
                    }
                    if((cilentH - $(window).width()*2/3) < ev.y){

                        document.getElementById("all").classList.add("ts");
                        if(hc>0){
                            instance.pan({x:ev.x,y:(hc/2)})
                        }else{
                            instance.pan({x:ev.x,y:-(rectO.height - cilentH)*1/2})
                        }
                        setTimeout(function(){
                            document.getElementById("all").classList.remove("ts");
                        },1000)
                    }

                }
                $scope.moveToch=function (areaID) {
                    var areaId=areaID;//$(this).attr('area');
                    currentAreaId=areaId;
                    $("#seatsLoading").show();

                    var instance = panZoom// 获取插件参数
                    var initialScale = instance.getZoom();
                    var item  = null;//定时器
                    clearTimeout(item)//清除定时器
                    document.getElementById("all").classList.add("ts");
                    var cilentH = document.documentElement.clientHeight || document.body.clientHeight;
                    var cilentW = document.documentElement.clientWidth || document.body.clientWidth;
                    var svgTop =  parseInt(document.documentElement.style.fontSize)*2.9;//document.querySelector(".seat_title_box").getBoundingClientRect().height+ document.querySelector(".nav").getBoundingClientRect().height;
                    var cilentHT =(cilentH-svgTop)/2;  //(cilentH-svgTop)/2
                    // console.log(document.querySelector(".d"+areaId));
                    var rect = document.querySelector(".d"+areaId).getBoundingClientRect(); // 没放大缩小内部矩形的数据
                    // console.log(rect);
                    var rectW = parseInt(rect.width)/2+parseInt(rect.left);//没放大缩小内部矩形的矩形宽度
                    var rectH =parseInt(rect.height)/2+parseInt(rect.top);//没大缩小内部矩形的矩形高度
                    instance.pan({x:instance.getPan().x+((cilentW/2)-rectW),y:svgTop+(instance.getPan().y+(cilentHT-rectH))})
                    // console.log(instance.getPan())
                   // instance.zoomAtPoint(1.8, {x:instance.getPan().x,y:instance.getPan().y})
                    item = setTimeout(function(){
                        document.getElementById("all").classList.remove("ts");
                        $("path").css("display",'block');
                        $("path[area="+areaId+"]").css("display",'none');
                    },1000)
                }


            })

            //这里写获取dom的操作，
            if($scope.slectSeats.length!=0) {
                $.each($scope.slectSeats, function (index, data) {
                    if (data.section_id == $scope.SELECTarea) {
                        // console.log(data.id);
                        //  console.log('222');
                        $('#seats_' + data.id).attr('class', 'seatselected');

                    }
                })
            }
            $interval.cancel(timer1);
            var timeOut=function(){
                $("#seatsLoading").hide();
            }
            $timeout(timeOut,1000);
        });
        $scope.goTo360=function(){
            localStorageService.set('360Img',$scope.Img360scan);
            $state.go('main.venus360',{},true);
        }
    });