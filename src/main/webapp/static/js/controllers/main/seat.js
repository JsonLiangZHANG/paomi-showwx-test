'use strict';

stareal
    .controller("SeatController", function ($rootScope,$scope,$http,$compile,$interval,$stateParams,$location,$anchorScroll,$api, $sce, base64, $state, $alert, localStorageService,FileUploader) {
        $scope.currentId = $stateParams.good_id;
        $scope.currentEventId = $stateParams.event_id;
        $scope.date=localStorageService.get('date') ;
        $scope.timeId=localStorageService.get('timeId') ;
        $scope.goodTitle=localStorageService.get('good_title');
        $scope.max=  localStorageService.get('good_titlemax');
        $scope.timeIndex= localStorageService.get('timeIndex');
        $scope._po=localStorageService.get('_po');
        $scope.seatsShow=true;
        // console.log($scope.currentId);
        // console.log($scope.currentEventId);
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
                    console.log($scope.good.site_id);
                    $scope.mapId=$scope.good.site_id;
                    console.log($scope.mapId);
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
            $scope.timeshow = true;
        }

        $scope.hide = function () {
            $scope.timeshow = false;
        }
        //更换场次
        $scope.switch=function(timeId,index){
            $scope.timeId=timeId;
            $scope.date= $scope.timesList[index].name;
            $scope.max=$scope.timesList[index].max_num;
            $scope.currentEventId= $scope.timesList[index].eventId;
            $scope.timeshow = false;
            var host_arg = "&hostname="+ location.host;
            if(!localStorageService.get('token')){
                var mobile=localStorageService.get('telphone_no');
                console.log(mobile)
                //http://app.mydeershow.com/ 正式
                //http://api.dd.com/  测试  http://192.168.191.1:9090/map/dome.do?mapId=5&mobile=18721481251&sellerId=1001&source=pc&eventId=16
                $scope.specialHtml = $sce.trustAsHtml('<iframe id="projects" name="projects" src="http://ticket.blackwan.cn/map/phonedome.do?mapId='+$scope.mapId+'&mobile='+mobile+'&sellerId=1001&source=h5&eventId='+$scope.currentEventId+'&ver='+Math.random()+ host_arg + '" frameborder="0" width="100%" height="500" ;style="display: inline;overflow: hidden;"scrolling="no"></iframe>');
                // $scope.specialHtml = $sce.trustAsHtml('<iframe id="projects" name="projects" src="http://app.mydeershow.com/webpc/GetEvent?EventId='+$scope.currentEventId+'&UserId='+mobile+'&AppId=FEQWEe&m=pc&ver='+Math.random()+'" frameborder="0" width="100%" height="700";style="display: inline;overflow: hidden;"scrolling="no"></iframe>');
            }else{
                var mobile=localStorageService.get('telphone_no');
                console.log(mobile);
                $scope.specialHtml = $sce.trustAsHtml('<iframe id="projects" name="projects" src="http://ticket.blackwan.cn/map/phonedome.do?mapId='+$scope.mapId+'&mobile='+mobile+'&sellerId=1001&source=h5&eventId='+$scope.currentEventId+'&ver='+Math.random()+ host_arg + '" frameborder="0" width="100%" height="500" ;style="display: inline;overflow: hidden;"scrolling="no"></iframe>');
                //$scope.specialHtml = $sce.trustAsHtml('<iframe id="projects" name="projects" src="http://app.mydeershow.com/webpc/GetEvent?EventId='+$scope.currentEventId+'&UserId='+mobile+'&AppId=FEQWEe&m=pc&ver='+Math.random()+'" frameborder="0" width="100%" height="700";style="display: inline;overflow: hidden;"scrolling="no"></iframe>')

            }
            $scope.getseats();

        }

        $scope.getseats=function(){
            //console.log("调用");
            $scope.seatscart=[];
            //正式  http://app.mydeershow.com/mobile/getCartP    http://ticket.blackwan.cn/
            // var myUrl = 'http://app.mydeershow.com/webpc/getCartP?EventId='+ $scope.currentEventId+'&UserId='+localStorageService.get('mobile')+'&AppId=FEQWEe&m=pc';
            var myUrl='http://ticket.blackwan.cn/shoppingcart_v2/usercart-cors?eventid='+$scope.currentEventId+'&userid='+localStorageService.get('telphone_no')+'&mapid='+$scope.mapId+'&source=h5&callback=JSON_CALLBACK';
            $http.jsonp(myUrl)
                .success(function (data) {
                    console.log(data);
                    var data=data.data;
                    $scope.seatsList=data;
                    // $scope.seatscart=carts.cart;
                    $scope.seatsnum=$scope.seatsList.length;
                    // console.log(carts);
                    $(".seats_list").show();
                    $scope.total=0;
                    $.each($scope.seatsList,function(index,data){
                        //  console.log(data);
                        $scope.seatscart.push(data.price_seat_id);
                        $scope.total+=parseInt(data.price);
                    })

                })
                .error(function (e) {
                    // console.log(e);
                });
            /*  $http.jsonp(myUrl).success(
                  function (response) {
                      $scope.seatsList=carts.seats;
                      $scope.seatscart=carts.cart;
                      $scope.seatsnum=$scope.seatscart.length;
                      $(".seats_list").show();
                      $scope.total=0;
                      $.each($scope.seatsList,function(index,data){
                          console.log(data);
                          $scope.total+=parseInt(data.unit_price);
                      })

                  })
                  .error(
                      function(response,config){
                          $scope.seatsList=carts.seats;
                          $scope.seatscart=carts.cart;
                          $scope.seatsnum=$scope.seatscart.length;
                          // console.log(carts);
                          $(".seats_list").show();
                          $scope.total=0;
                          $.each($scope.seatsList,function(index,data){
                               console.log(data);
                              $scope.total+=parseInt(data.unit_price);
                          })

                      });*/

        }
        $scope.retractableFn=function(){
            if( $scope.seatsShow){
                $("#seats_list").animate({left:"-310px"},2000);
                $(".retractable").animate({left:"0px"},2000);
                $scope.seatsShow=false;
            }else{
                $("#seats_list").animate({left:"0px"},2000);
                $(".retractable").animate({left:"310px"},2000);
                $scope.seatsShow=true;
            }

        }



        //选座弹
        // var alertSeatBox = angular.element('.seat_box2 #Seat_alertBox').outerHeight();
        $scope.goShow=function () {
            $(".seat_dailog").fadeIn();

        //
        //     angular.element('.seat_box2 #Seat_alertBox').css({
        //         'display': 'block',
        //         'bottom': -alertSeatBox
        //     });
        //     angular.element('.seat_box2 #Seat_alertBox').animate({bottom: '0px'}, 200);
        //
        }
        $scope.hideShow=function () {
            $(".seat_dailog").fadeOut();

            //
            //     angular.element('.seat_box2 #Seat_alertBox').css({
            //         'display': 'block',
            //         'bottom': -alertSeatBox
            //     });
            //     angular.element('.seat_box2 #Seat_alertBox').animate({bottom: '0px'}, 200);
            //
        }



        //删除选的座位
        $scope.seats=function(seatNo,seatId,section_name){
            // shoppingcart_v2/pcdeltocart  callback userid id appid eventid
            // console.log(seatNo);

            // var myUrl='http://sxzc67.natappfree.cc/shoppingcart_v2/pcdeltocart?eventid=16&id='+seatNo+'&userid='+localStorageService.get('mobile')+'&mapid=5&source=pc&callback=JSON_CALLBACK';
            // $http.jsonp(myUrl)
            //     .success(function (data) {
            //
            //       if(data.success){
            //$scope.getseats();
            var iframes='http://ticket.blackwan.cn/map/temp.do?eventid='+$scope.currentEventId+'&id='+seatNo+'&seatId='+seatId+'&seat_area='+section_name+'&userid='+localStorageService.get('telphone_no')+'&mapid='+$scope.mapId+'&source=h5';
            var  oFrame = document.createElement('iframe');
            if(typeof(oFrame)=='undefined'){
                oFrame.src = iframes +'&a='+ Math.random()+'&time='+new Date();
                oFrame.style.display = 'none';
                document.body.appendChild(oFrame);
                //console.log('a');
            }else {
                oFrame.src = iframes + '&a=' + Math.random() + '&time=' + new Date();
                oFrame.style.display = 'none';
                document.body.appendChild(oFrame);
            }
            // console.log('b');
            //   }else{
            //       $alert.show(data.msg);
            //   }
            //
            //
            // })
            // .error(function (e) {
            //     $alert.show(e);
            // });

        }
        $scope.completecarRepeat=function(){
            $("#loading_img").css('display','none');
        }
        //选座提交订单
        $scope.xuanCreateOrder=function(gf){
            // if (!localStorageService.get('token')) {
            //     $scope.$broadcast('to-child');
            //     return;
            // }
            // var _po = $scope.prices[$scope.paras.priceIndex];
            // console.log(_po);

            if ( $scope.seatsList.length == 0) {
                $alert.show("请选择座位!");
                return;
            }
            if ( $scope.seatsList.length >$scope.max) {
                $alert.show("该演出一次只能购买"+$scope.max+'张！');
                return;
            }
            if(gf==1){
                $(angular.element("body")[0]).css('overflow','auto');
                localStorageService.set('seatscart', $scope.seatscart);
                localStorageService.set('title',$scope.title);
                localStorageService.set('ticketId',$scope._po.id);
                localStorageService.set('site_title',$scope.site_title);
                localStorageService.set('eventShowId', $scope.currentEventId);
                localStorageService.set('thumb',$scope.thumb);
                localStorageService.set('seatsList',$scope.seatsList);
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
                            // "appid=wxd39f7e740343d507&" +
                            // "redirect_uri=http%3A%2F%2Fm.stareal.cn%2Foauth%2Findex" +
                            "appid=wx0d1d2af6c50baa27&" +
                            "redirect_uri=http%3A%2F%2Fm.xiuhelive.com%2Foauth%2Findex" +
                            "&response_type=code&scope=snsapi_userinfo&state=";

                        // //测试redirect_uri
                        // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
                        //     "appid=wxd39f7e740343d507&" +
                        //     "redirect_uri=http%3A%2F%2Ft.stareal.cn%2Foauth%2Findex" +
                        //     "&response_type=code&scope=snsapi_userinfo&state=" + encodeURIComponent(rs);
                    } else {
                        // location.href = "https://open.weixin.qq.com/connect/qrconnect?" +
                        //     "appid=wx05c47c7db58b03aa&" +
                        //     "redirect_uri=http%3A%2F%2Fwww.stareal.cn%2Fwx%2Foauth%2Fweixin" +
                        //     "&response_type=code&scope=snsapi_login&state=" + encodeURIComponent(rs) + "#wechat_redirect";
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
    });