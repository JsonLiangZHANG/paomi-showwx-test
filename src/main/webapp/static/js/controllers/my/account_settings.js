'use strict';

stareal
    .controller("AccountSettingsController", function ($scope, $api, $alert, $state, $http, localStorageService) {
        $api.get("app/login/userinfo/retrieve", null, true)
            .then(function (ret) {
                var dateStr = ret.data.birthday;
                if(dateStr){
                    if (dateStr.length == 8) {
                        $scope.birthday = dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8);
                    }
                }else{
                        $scope.birthday = '未设置'
                }

                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge != "undefined") {
                    $scope.show = true;
                }
                $scope.thumb = {};
                $scope.thumb.imgSrc = ret.data.headimgurl;
                $scope.headimgurl = ret.data.headimgurl;
                $scope.nickname = ret.data.nickname;
                $scope.address_num = ret.data.address_num;
                // $scope.mobile = ret.data.mobile;
                var mobileStr = ret.data.mobile;
                if(mobileStr){
                    $scope.mobile = mobileStr.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                }
                var b = ret.data.sex
                if(b){
                    $scope.sex = ret.data.sex;
                }else{
                    $scope.sex = '未设置'
                }
                //获取现在的时间
                var yearNow = new Date().getFullYear();//获取年份
                var monthSel = new Date().getMonth()+1;//获取月份
                var maxDay = new Date(yearNow,monthSel,0).getDate();//获取当月天数
                if(dateStr){
                    $scope.year = dateStr.substring(0, 4);
                    $scope.month = dateStr.substring(4, 6);
                    $scope.day = dateStr.substring(6,8);
                    //初始化
                    $scope.time = {
                        year:Number($scope.year),
                        month:Number($scope.month),
                        day:Number($scope.day),
                    }
                }else{//生日不存在的时候
                    $scope.time = {
                        year:yearNow,
                        month:monthSel,
                        day:maxDay,
                    }
                }
                $scope.yearNows = [];//年份
                $scope.monthNow = [];//月份
                $scope.dayNow = [];//天数
                for(var i=yearNow;i>1899;i--){
                    $scope.yearNows.push({
                        id:i,
                        name:i
                    })
                }
                for(var i=1;i<13;i++){
                    $scope.monthNow.push({
                        id:i,
                        name:i
                    })
                }
                $scope.$watch('time.month',function(newValue){//这个是得监控月份才能获取天数
                    maxDay = newValue?new Date(yearNow,newValue,0).getDate():'';
                    for(var i=1;i<maxDay+1;i++){
                        $scope.dayNow.push({
                            id:i,
                            name:i
                        })
                    }
                })
            });
        //设置性别
        $scope.setSex = function () {
            var h = document.body.scrollHeight;
            $(".sex_mask").height(h);
            $(".sex_mask").css({"display":"block"})
            $(".sex_box").css({"display":"block"})
            $scope.isBoy = ($scope.sex =="男");
        }
        var set = function () {
            $api.get("app/login/userinfo/update", {
                sex: $scope.sex,
            }, true)
        }
        $scope.choose = function (sex) {
            $scope.sex = sex;
            $scope.isBoy = ($scope.sex =="男");
            $(".sex_mask").css({"display":"none"})
            set()
        }
        $(".sex_mask").click(function () {
            $(this).css({"display":"none"})
        })
        //设置生日
        $scope.setBirthday = function () {
            var h = document.body.scrollHeight;
            $(".birthday_mask").height(h);
            $(".birthday_mask").css({"display":"block"})
            $(".birthday_box").css({"display":"block"})
        }
        $scope.confirm = function () {
            var year = $scope.time.year.toString();
            var month = $scope.time.month<10?'0'+$scope.time.month.toString():$scope.time.month.toString();
            var day = $scope.time.day<10?'0'+$scope.time.day.toString():$scope.time.day.toString();
            var birthday = year+month+day;
            $scope.birthday = year+'-'+month+'-'+day
            $api.get("app/login/userinfo/update", {
                birthday:birthday,
            }, true)
            $(".birthday_mask").css({"display":"none"})
        }
        $(".birthday_mask").click(function () {
            $(this).css({"display":"none"})
        })
        //冒泡
        $scope.bubble = function ($event){
            $event.stopPropagation()
        }
        //修改绑定提示
        $scope.tip = function () {
            $alert.show("请前往APP中修改")
        }
    });