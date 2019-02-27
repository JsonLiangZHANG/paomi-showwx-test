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
        $("#svg").height(height);
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
            timer1 = $interval(updateTime,1000);
            updateTime()
            function updateTime(){
                $scope.laydate -= 1000;
                if($scope.laydate<=0){
                    $interval.cancel(timer1);
                    $("#seatsLoading").hide();
                    $alert.show('系统繁忙,数据加载失败!');
                }
            }
            $api.get("app/map/ticket_v2/map", {mapid: $scope.mapId}, true)
                .then(function (ret) {
                    //console.log(ret);
                    var data=ret.map;
                    $scope.setionSvgsImg = data;
                    var a=1000/ $scope.setionSvgsImg.height*0.32;
                    var ssx="matrix("+a+", 0, 0, "+a+",0,0)";
                    $("#all").attr("transform",ssx);
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
            $scope.moveToch(areaID);
            $api.get("app/map/ticket_v2/seat", {mapid: $scope.mapId,areaid:areaID,eventid: $scope.currentEventId},true)
                .then(function (ret) {
                    var data=ret.seat;
                    $interval.cancel(timer);
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
                    $interval.cancel(timer);
                    $("#seatsLoading").hide();
                });
            var timer=null;
            timer = $interval(updateTime,1000);
            updateTime()
            function updateTime(){
                $scope.laydate -= 1000;
                if($scope.laydate<=0){
                    $interval.cancel(timer);
                    $("#seatsLoading").hide();
                    $alert.show('系统繁忙,数据加载失败!');
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
                $state.go('main.xuanpay',{order_id:$stateParams.good_id})
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

        var times=0;
        var times1=0;
        var times2=0;
        var x0=500;
        var y0=500;
        var svg = Snap("#svg");
        var g=Snap("#all");
        // var mapsvg= Snap("#map");
        // var seatssvg= Snap("#seats");
        // var pricesvg=Snap("#price");
        var currentAreaId=0;
        var topx=0;
        var scalebei=1;
        var matrix = new Snap.matrix(1,0,0,1,0,0);
        var theRequest = new Object();
        //  $("#price").on('touchend',"path",function(){
        $scope.moveToch=function (areaID) {
            var areaId=areaID;//$(this).attr('area');
            currentAreaId=areaId;
            $("#seatsLoading").show();
            $("path").css("display",'block');
            $("path[area="+areaId+"]").css("display",'none');
            var d=$("path[area="+areaId+"]").attr('d');
            var pathBox=Snap.path.getBBox(d);
            var a=getAndSetCurrentMatrix0().a;
            var xchang=pathBox.x;
            var ychang=pathBox.y;
            var x0pointer=a*pathBox.x;
            var y0pointer=a*pathBox.y;
            var hcurrent=pathBox.h;
            var ecurrent=getAndSetCurrentMatrix0().e;
            var fcurrent=getAndSetCurrentMatrix0().f;
            matrix=getAndSetCurrentMatrix0();
            if(a<2){
                var ma0=matrix.translate((-ecurrent)*1/a, (-fcurrent)*1/a);
                var scale= matrix.scale(2/a, 2/a);
                var ma1=matrix.translate((-xchang+20), (-ychang+40));
                scalebei=3;
                g.animate({
                    transform: matrix.toString()
                }, 1500, mina.linear);
            }else{
                matrix.add(1,0,0,1,-(x0pointer-topx+ecurrent-20)/a,-(y0pointer+fcurrent-40)/a);
                g.animate({
                    transform: matrix.toString()
                }, 1000, mina.linear);

            }
        }

        // });
        $(document).ready(function(){
            FastClick.attach(document.body);
            var docEl = document.documentElement;
            var clientWidth = docEl.clientWidth;
            topx=(clientWidth-320)/2;
            var $section = $('#inverted-contain');
            $section.find('.panzoom').panzoom({
                $zoomIn: $section.find(".zoom-in"),
                $zoomOut: $section.find(".zoom-out"),
                $zoomRange: $section.find(".zoom-range"),
                //  $reset: $section.find(".reset"),
                startTransform: 'scale(.32)',
                increment: 0.1,
                minScale: 0.32
            }).panzoom('zoom');
            matrix.add(0.32,0,0,0.32,topx,0);
            g.transform(matrix.toString());

        })
        function getAndSetCurrentMatrix0(){
            matrix =  g.transform().localMatrix;
            return matrix;

        }
        function getAndSetCurrentMatrix(){
            matrix =  g.transform().localMatrix;
            return matrix.a;

        }
        function getCurrentMoveCenter(){
            var  matrixz =g.transform().localMatrix;
        }
        //重置中心点  yi
        function setCurrentPoint(event){
            var e = event || window.event;
            var d=$(e).attr('d');
            var pathBox=Snap.path.getBBox(d);
            //svg移到中心位置
            // console.log(pathBox);
            matrix.add(1,0,0,1,-(pathBox.cx-x0),-(pathBox.cy-y0));
            x0=pathBox.cx;
            y0=pathBox.cy;
            //  console.log(x0);
            // console.log(y0);
            g.transform(matrix.toString());
        }
        $scope.big=function(n){
            //修改
            // var point = getSvgCenterPoint();
            // var x = point[0];
            // var y = point[1];
            //console.log(point);
            var ecurrent=getAndSetCurrentMatrix0().e;
            var fcurrent=getAndSetCurrentMatrix0().f;
            var a=getAndSetCurrentMatrix();
            // console.log(a);
            if(a==0.32){
                scalebei=1;
            }
            if(n==1&&a<2){
                if(scalebei==1){
                    //  console.log(a);
                    scalebei++;
                    matrix.add(1,0,0,1,-(ecurrent+340)/a,-(fcurrent+340)/a);
                    matrix.add(1/a,0,0,1/a,0,0);
                    g.animate({
                        transform: matrix.toString()
                    }, 1500, mina.linear);
                } else if(scalebei==2){
                    scalebei++;
                    matrix.add(1,0,0,1,-(ecurrent+870)/a,-(fcurrent+770)/a);
                    matrix.add(2/a,0,0,2/a,0,0);
                    g.animate({
                        transform: matrix.toString()

                    }, 1500, mina.linear);
                }
            }else if(n==0&&a>0.32){
                if(scalebei==3){scalebei--;
                    matrix.add(1,0,0,1,-(ecurrent+340)/a,-(fcurrent+340)/a);
                    matrix.add(1/a,0,0,1/a,0,0);
                    //g.transform(matrix.toString());
                    g.animate({
                        transform: matrix.toString()

                    }, 1500, mina.linear);
                } else if(scalebei==2){
                    scalebei--;
                    matrix.add(1,0,0,1,-(ecurrent)/a,-(fcurrent)/a);
                    matrix.add(0.32/a,0,0,0.32/a,0,0);
                    g.animate({
                        transform: matrix.toString()
                    }, 1500, mina.linear);
                }
            }else if(n==1&&a>=2||scalebei==3){
                //alert("已经放到最大了");
                $alert.show("已经放到最大了");
                return false;
            }else if(n==0&&a<=0.32||scalebei==1){
                //alert("已经缩到最小了");
                $alert.show("已经缩到最小了");
                return false;
            }
        }

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

        $scope.selectSeats=function(section_id,status,price_seat_id,id,event,section_name,section_area,section_names,row,columns,price) {
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