'use strict';

stareal
    .controller("WriteReviewsController", function ($scope,$http, $stateParams, $api, $state,localStorageService,$alert,FileUploader) {
        //写评论
        var oStar = document.getElementById("star");
        var aLi = oStar.getElementsByTagName("li");
        var oUl = oStar.getElementsByTagName("ul")[0];
        var i =0;
        var iScore = 0;
        var iStar = 0;
        for (i = 1; i <= aLi.length; i++)
        {
            aLi[i - 1].index = i;
            //鼠标移过显示分数
            aLi[i - 1].onmouseover = function ()
            {
                fnPoint(this.index);
                //浮动层显示
                //计算浮动层位置

            };
            //鼠标离开后恢复上次评分
            aLi[i - 1].onmouseout = function ()
            {
                fnPoint();
                //关闭浮动层
            };
            //点击后进行评分处理
            aLi[i - 1].onclick = function ()
            {
                iStar = this.index;
            }
        }
        //评分处理
        function fnPoint(iArg)
        {
            //分数赋值
            iScore = iArg || iStar;
            for (i = 0; i < aLi.length; i++) {
                aLi[i].className = i < iScore ? "on" : ""
            };
        }
        var token = localStorageService.get('token')
         var url = 'http://api.amazingmusicals.com/mobile/app/upload/image?accessToken='+token;//正式
       // var url = 'http://192.168.1.4/mobile/app/upload/image?accessToken='+token;//测试
        var uploader = $scope.uploader = new FileUploader({
            url:url,
            alias:'image',
            queueLimit:5
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        //评分
        var img_str = ''
        $scope.submit = function () {
            var scor = iStar*2;
            if(scor==0){
                $alert.show('请打分!');
                return false;
            }
            if(!$scope.conten){
                $alert.show("请写评论!")
                return false;
            }
            if(uploader.queue.length!=0){//选择了图片
                //上传
                uploader.uploadAll()
                //上传每一个
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    if(img_str==''||undefined){
                        img_str = response.url
                    }else{
                        img_str = img_str+','+response.url;
                    }
                };
                //上传总进度
                uploader.onProgressAll = function(progress) {
                    if(progress!=100){
                        angular.element(".img_load_mask").show();
                    }
                    if(progress==100){
                        angular.element(".img_load_mask").hide();
                    }
                };
                //全部上传成功
                uploader.onCompleteAll = function() {
                    $api.post("app/comment/create",{
                        good_id:$stateParams.good_id,
                        content:$scope.conten,
                        star:scor,
                        attach:img_str
                    },true)
                        .then(function (ret) {
                            $alert.show("评论成功!");
                            history.back();
                        },function (err) {
                            $alert.show(err)
                        })
                };
            }else{//没有选择图片
                $api.post("app/comment/create",{
                    good_id:$stateParams.good_id,
                    content:$scope.conten,
                    star:scor
                },true)
                    .then(function (ret) {
                        $alert.show("评论成功!");
                        history.back();
                    },function (err) {
                        $alert.show(err)
                    })
            }
        }
        $scope.surplus = 150;
        //剩余多少字
        var scoreText = document.getElementById("score");
        scoreText.oninput = function () {
            $scope.surplus = 150-this.value.length;
            if($scope.surplus<0){
                $scope.surplus = 0;
                return false;
            }
        }
    });