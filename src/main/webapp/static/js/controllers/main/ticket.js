'use strict';

stareal
    .controller("TicketController", function ($scope, $stateParams, $api, $state, $alert,localStorageService,$timeout) {
        $scope.id = $stateParams.good_id;
        $api.get("app/detail/ticket/retrieve", {id: $stateParams.good_id})
            .then(function (ret) {
                console.log(ret)
                $scope.remark = ret.remark;
                $scope.plans = ret.data;
                $scope.paras = {};
                $scope.max = 6;

                // 获取第一个可以选择的场次
                var getAvailablePlanIndex = function () {
                    return 0;
                };


                var getAvailableCatIndex = function () {
                    var _index = [null, null];

                    catsLoop:
                        for (var _i = 0; _i < $scope.cats.length; _i++) {
                            var _gory = $scope.cats[_i].children;
                            for (var _j = 0; _j < _gory.length; _j++) {
                                if (_gory[_j].status) {
                                    _index = [_i, _j];
                                    break catsLoop;
                                }
                            }
                        }
                    return _index;
                };
                // 获取第一个可以选择的价格
                var getAvailablePriceIndex = function () {
                    var _index = null;

                    for (var _i = 0; _i < $scope.prices.length; _i++) {
                        if ($scope.prices[_i].status) {
                            _index = _i;
                            break;
                        }
                    }
                    return _index;
                };

                // 更改场次
                var switchPlan = function (index) {
                    if (true) {
                        $scope.paras.planIndex = index;
                        $scope.cats = $scope.plans[index].children;
                        $scope.max = $scope.plans[index].max_num;
                        localStorageService.set('date',$scope.plans[index].name)
                        $scope.time=$scope.plans[index].name.replace(/#/g,"");
                        // 联动切换价位
                        var _index = getAvailableCatIndex();
                        switchCat(_index[0], _index[1], true);
                    }
                };

                // 更改价位
                var switchCat = function (index1, index2, choosable,e) {
                    if(choosable==''){
                        $scope.pop(e)
                    }
                    if (choosable) {
                        $scope.paras.catIndex1 = index1;
                        $scope.paras.catIndex2 = index2;
                        localStorageService.set('cat',$scope.plans[$scope.paras.planIndex].children[index1].children[index2].name)
                        // 没有可选择的价位
                        if (index1 == null) {
                            $scope.prices = [];
                        } else {
                            $scope.prices = $scope.plans[$scope.paras.planIndex].children[index1].children[index2].children;
                        }
                        // 联动切换价格
                        var _index = getAvailablePriceIndex();
                        switchPrice(_index, true)
                    }else {
                        $scope.price2 = $scope.plans[$scope.paras.planIndex].children[index1].children[index2].name;
                        $scope.ticketId=$scope.plans[$scope.paras.planIndex].children[index1].children[index2].id;
                    }
                };

                // 更改价格
                var switchPrice = function (index, choosable) {
                    if (choosable) {
                        $scope.paras.priceIndex = index;
                    }
                };

                // ****************************************  加载计算张数部分  ****************************************
                $scope.num = 1;

                $scope.subNum = function () {
                    if ($scope.num == 1) {
                        return;
                    }
                    $scope.num = $scope.num - 1;
                    calTotal();
                };

                $scope.addNum = function () {
                    if ($scope.num == $scope.max) {
                        $alert.show("最多只能购买"+$scope.max+"张!")
                        return;
                    }
                    $scope.num = $scope.num + 1;
                    calTotal();
                };

                $scope.$watch("paras", function (newValue) {
                    // 张数还原到1
                    $scope.num = 1;
                    calTotal();
                }, true);

                var calTotal = function () {
                    var _po = $scope.prices[$scope.paras.priceIndex];
                    var _price = (_po ? _po.price : 0);
                    $scope.total = _price * $scope.num;
                }

                var createOrder = function () {
                    if ($scope.paras.priceIndex == null) {
                        $alert.show("请选择座位!")
                    }

                    var _po = $scope.prices[$scope.paras.priceIndex];
                    var _sku = _po.num;
                    if (_sku < $scope.num) {
                        $alert.show("库存不足!");
                        return false
                    }
                    localStorageService.set('seat',_po.name);
                    localStorageService.set('price',_po.price);
                    localStorageService.set('ticketId',_po.id);
                    localStorageService.set('total',$scope.total);
                    localStorageService.set('num',$scope.num);
                    $state.go('main.pay',{order_id:$stateParams.good_id})
                }

                // ****************************************  初始化  ****************************************
                $scope.switchPlan = switchPlan;
                $scope.switchCat = switchCat;
                $scope.switchPrice = switchPrice;
                $scope.createOrder = createOrder;
                switchPlan(0);
                if($scope.plans.length>3){
                    $timeout(function () {
                        var swiper = new Swiper('.swiper-container', {
                            slidesPerView: 'auto',
                            spaceBetween:0,
                            observer:true//修改swiper自己或子元素时，自动初始化swiper
                        })
                    },0)
                }
                //设置票类型
                $scope.ticketType = function (price1,price2) {
                    var price1 = Number(price1);
                    var price2 = Number(price2);
                    $scope.ticketObj = {};
                    if(price1>price2){//折扣票
                        $scope.ticketObj.defstyle = {
                            "background":"#4899FE"
                        }
                        $scope.ticketObj.ticketText = '折'
                    }else if(price1==price2){
                        $scope.ticketObj.defstyle = {
                            "display":"none"
                        }
                    }else{//议价票
                        $scope.ticketObj.defstyle = {
                            "background":"#FF5000"
                        }
                        $scope.ticketObj.ticketText = '溢'
                    }
                    return $scope.ticketObj
                }
            });
        //到货提醒弹窗
        $scope.telphone_no = localStorageService.get("telphone_no");
        var alertHe =  angular.element('.mask1 .alert_box1').outerHeight();
        $scope.pop = function (e) {
            var bodyH = angular.element('body').height();
            angular.element('.mask1').css({
                'display':'block',
                'height':bodyH
            })
            angular.element('.mask1 .alert_box1').css({
                'display':'block',
                'bottom':-alertHe
            });
            angular.element('.mask1 .alert_box1').animate({bottom:'0px'},200);
        }
        //关闭弹窗
        angular.element('.mask1 .alert_box1').click(function (e) {
            e.stopPropagation();
        })
        angular.element('.mask1').click(function () {
            $scope.close()
        })
        //关闭
        $scope.close = function () {
            angular.element('.mask1 .alert_box1').animate({bottom:-alertHe},200);
            angular.element('.mask1').fadeOut()
        }
        //提交预约
        $scope.submitPop = function (){
            var myreg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
            if (!myreg.test($scope.telphone_no)) {
                $alert.show('请输入有效的手机号码！');
                return false;
            }
            $api.post("app/register/oos/create",{ticket_id:$scope.ticketId,mobile: $scope.telphone_no},true)
                .then(function (ret) {
                    $alert.show("登记成功！")
                    $scope.close();
                },function (err) {
                    $alert.show(err);
                    $scope.close();
                })
        }
    });