/****************************************************  首页逻辑 已用angular实现  **************************************************
function home(id){
    var oHome = document.getElementById(id);
    var oAddress = oHome.children[0].children[0];
    var oBg = oHome.children[6];
    var oAlert = oHome.children[7];
    oAddress.onclick = function(){
        oBg.style.display = "block";
        oAlert.style.display = "block";
        setTimeout(function(){
            oBg.style.display = "none";
            oAlert.style.display = "none";
        },1000);
    };

    var oCarousel = document.getElementById("carousel");
    var aTi = oCarousel.children[1].children;
    var aTou = oCarousel.children[0].children;
    var ready = true;
    for(var i=0; i<aTi.length; i++){
        aTi[i].index = i;
    }
    function qingtou(){
        for(var i=0; i<aTou.length; i++){
            aTou[i].className = "";
        }
    };
    oCarousel.onmousedown = function(ev){
        var oEvt = ev || event;
        lastX = 0;
        document.onmousemove = function(ev){
            var oEvt = ev || event;
            lastX = oEvt.clientX;
        };
        document.onmouseup = function(){
            if(lastX == 0){
                for(var i=0; i<aTi.length; i++){
                    aTi[i].children[0].href = "html/perform.html";
                }
            }else{
                for(var i=0; i<aTi.length; i++){
                    aTi[i].children[0].href = "#";
                }
            }
            document.onmousemove = document.onmouseup = null;
        };
    };
    var hammertime = new Hammer(oCarousel, {});
    hammertime.on('pan', function(e) {
        if(ready){
            var carousel = $('#carousel');
            var percent = 100*e.deltaX/carousel.width();
            var active = carousel.find(".carousel-inner .active");
            var indicators = carousel.find(".carousel-indicators");
            var prev = active.prev();
            var next = active.next();
            if(!prev.length){
                prev = active.siblings().last();
            }
            if(!next.length){
                next = active.siblings().first();
            }
            carousel.carousel('pause');
            $([prev[0],next[0]]).css({display:"block", position: "absolute", width:"100%", top:"0", left:"0", transform: "translate3d(0,0,0)"});
            prev.css({marginLeft:"-100%"});
            next.css({marginLeft:"100%"});
            $([active[0],prev[0],next[0]]).css({left: percent+'%'});
            if(e.isFinal){
                var animate_to = 0;
                if(Math.abs(percent)>10){
                    animate_to = 100*percent/Math.abs(percent);
                }
                ready = false;
                $([active[0],prev[0],next[0]]).stop().animate({ left: animate_to+'%'},600,function(){
                    if($(this).hasClass("active")){
                        active.css({left:""});
                        $([prev[0],next[0]]).css({display:"", position: "", width:"", top:"", left:"", marginLeft:"", transform: ""});
                        if(animate_to!=0){
                            active.removeClass("active");
                            if(percent>0){
                                prev.addClass("active");
                                qingtou();
                                aTou[this.index].className = "active";
                            }else{
                                next.addClass("active");
                                qingtou();
                                aTou[this.index].className = "active";
                            }
                        }
                        carousel.carousel('cycle');
                    }
                    ready = true;
                })
            }
        }
    });





    var oActivity = oHome.children[3];
    var oHot = oHome.children[4];

    var aActivityImg = oActivity.getElementsByTagName("img");
    var aHotImg = oHot.getElementsByTagName("img");

    auto(aActivityImg);
    auto(aHotImg);
    function auto(arr){
        firstW = arr[0].offsetWidth;
        for(var i=0; i<arr.length; i++){
            arr[i].style.height = firstW*10/7 +"px";
        }
    };

    window.onresize = function(){
        auto(aActivityImg);
        auto(aHotImg);
        function auto(arr){
            firstW = arr[0].offsetWidth;
            for(var i=0; i<arr.length; i++){
                arr[i].style.height = firstW*10/7 +"px";
            }
        };
    };
};

 *****************************************************************************************************************************************/

/*********************************************************************************
function performlist(id){
    var oPerformance = document.getElementById(id);
    var oNav = oPerformance.children[3].children[0];
    var oNavli = oNav.children;
    var oNava = oNav.getElementsByTagName("a");
    var oNavliPos = [];

    var oList = oPerformance.children[4];

    if(oList.children.length !=0){
        var aImg = oList.getElementsByTagName("img");
        var winW = document.documentElement.clientWidth;
        var fristImgW = aImg[0].offsetWidth;
        for(var i=0; i<aImg.length; i++){
            aImg[i].style.height = (fristImgW-12) * 10 / 7 + "px";
        }

        var oListaLi = oList.children;
        var aTitle = [];
        var aAddress = [];
        var aTitleinnerHTML = [];
        var aAddressinnerHTML = [];
        for(var i=0; i<oListaLi.length; i++){
            aTitle.push(oListaLi[i].children[0].children[1].children[0]);
            aAddress.push(oListaLi[i].children[0].children[1].children[2]);
            aTitleinnerHTML.push(aTitle[i].innerHTML);
            aAddressinnerHTML.push(aAddress[i].innerHTML);
        }
        var num1 = parseInt(aTitle[0].offsetWidth/15);
        var num2 = parseInt(aAddress[0].offsetWidth/13);
        for(var i=0; i<aTitle.length; i++){
            aTitle[i].innerHTML = csubstr(aTitle[i].innerHTML,num1,aTitle[i].innerHTML.length);
            aAddress[i].innerHTML = csubstr(aAddress[i].innerHTML,num2,aAddress[i].innerHTML.length);
        }
        function csubstr(innerHtml,num,len){
            str = innerHtml;
            if(len > num){
                if(len > 2*num){
                    return str.substring(0,num) + str.substring(num,2*num-1) + "...";
                }else{
                    return str;
                }
            }else{
                return str;
            }
        };
        window.onresize = function(){
            num1 = parseInt(aTitle[0].offsetWidth/15);
            num2 = parseInt(aAddress[0].offsetWidth/13);
            for(var i=0; i<aTitle.length; i++){
                aTitle[i].innerHTML = csubstr(aTitleinnerHTML[i],num1,aTitleinnerHTML[i].length);
                aAddress[i].innerHTML = csubstr(aAddressinnerHTML[i],num2,aAddressinnerHTML[i].length);
            }


            winW = document.documentElement.clientWidth;
            fristImgW = aImg[0].offsetWidth;
            for(var i=0; i<aImg.length; i++){
                aImg[i].style.height = (fristImgW-12) * 10 / 7 + "px";
            }
        };
    }else{
        oPerformance.children[5].style.display = "block";
    }
**********************************************************************************/
/*********************************************************************************

    for(var i=0; i<oNavli.length; i++){
        oNavliPos.push(oNavli[i].offsetLeft);
    }
    for(var i=0; i<oNavli.length; i++){
        oNavli[i].style.position = "absolute";
        oNavli[i].style.left = oNavliPos[i] + "px";
    }
    for(var i=0; i<oNavli.length; i++){
        oNavli[i].index = i;
        oNavli[i].onclick = function(){
            allW = 0;
            if(this.index >= 3 && this.index <= 5){
                for(var j=0; j< this.index; j++){
                    allW += oNavli[j].offsetWidth;
                }
                oNav.style.marginLeft = winW/2 - allW - this.offsetWidth/2 + "px";
            }
            if(this.index < 3){
                oNav.style.marginLeft = 0;
            }
            if(this.index > 5){
                oNav.style.marginLeft = winW - oNav.offsetWidth + "px";
            }
        };
    }

    for(var i=0; i<oNava.length; i++){
        oNava[i].index = i;
        oNava[i].onclick = function(){
            for(var j=0; j<oNava.length; j++){
                oNava[j].className = "";
            }
            this.className = "active";
        }
    }
    var oFloatinglayer = oPerformance.children[2];
    var oSort = oPerformance.children[0].children[2].children[0];
    var oSortsearch = oPerformance.children[1];
    var oHot = oSortsearch.children[0];
    var oTime = oSortsearch.children[1];
    oSort.onclick = function(){
        if(oSortsearch.style.display == "block"){
            oSortsearch.style.display = "none";
            oFloatinglayer.style.display = "none";
        }else{
            oSortsearch.style.display = "block";
            oFloatinglayer.style.display = "block";
        }
    };
    oHot.onclick = function(){
        this.children[0].src = "../img/HotSort2.png";
        this.children[2].style.display = "block";
        oTime.children[0].src = "../img/TimeSort1.png";
        oTime.children[2].style.display = "none";
        oSortsearch.style.display = "none";
        oFloatinglayer.style.display = "none";
    };
    oTime.onclick = function(){
        this.children[0].src = "../img/TimeSort2.png";
        this.children[2].style.display = "block";
        oHot.children[0].src = "../img/HotSort1.png";
        oHot.children[2].style.display = "none";
        oSortsearch.style.display = "none";
        oFloatinglayer.style.display = "none";
    };
    oFloatinglayer.onclick = function(){
        oSortsearch.style.display = "none";
        oFloatinglayer.style.display = "none";
    };
};
 **********************************************************************************/

/************************************************    选择门票逻辑 已用angular实现
function selecttickets(id){
    var oSelecttickets = document.getElementById(id);
    var oTime = oSelecttickets.children[2];
    var aPlac = oSelecttickets.children[3].getElementsByTagName("li");
    var oSet = oSelecttickets.children[4];
    var oMoney = oSelecttickets.children[6].children[1];
    var oUnitprice = aPlac[1].children[0].innerHTML;

    select(oTime.children[1].children);
    select(oSet.children[1].children);
    select(aPlac);

    function select(obj){
        for(var i=0; i<obj.length; i++){
            obj[i].index = i;
            obj[i].onclick = function(){
                if(this.className != "none"){
                    for(var j=0; j<obj.length;j++){
                        obj[j].getElementsByTagName("p")[0].className = "";
                    }
                    this.getElementsByTagName("p")[0].className = "selected";
                    if(this.parentNode.className == "clearfix money"){
                        oUnitprice = parseInt(this.children[0].innerHTML);
                        oMoney.innerHTML = parseInt(oUnitprice) * parseInt(oNum.value);
                    }
                }
            };
        }
    };
    show(oTime.children[1]);
    show(oSet.children[1]);
    function show(obj){
        var aObj = obj.children;
        var open = obj.nextElementSibling || obj.nextSibling;
        if(obj.length <= 6){
            open.className = "";
        }else{
            for(var i=6; i<aObj.length; i++){
                aObj[i].style.display = "none";
            }
            open.className = "show";
        }
        var openbtn = open.children[0];
        var Open = true;
        openbtn.onclick = function(){
            if(Open){
                for(var i=6; i<aObj.length; i++){
                    aObj[i].style.display = "block";
                }
                openbtn.src = "../img/openup.png";
                Open = false;
            }else{
                for(var i=6; i<aObj.length; i++){
                    aObj[i].style.display = "none";
                }
                openbtn.src = "../img/opendown.png";
                Open = true;
            }
        };
    };
    var oReduce = oSelecttickets.children[5].children[1].children[0];
    var oNum = oSelecttickets.children[5].children[1].children[1];
    var oPlus = oSelecttickets.children[5].children[1].children[2];
    oReduce.onclick = function(){
        if(oNum.value > 1) oNum.value--;
        oMoney.innerHTML = parseInt(oUnitprice) * parseInt(oNum.value);
    };
    oPlus.onclick = function(){
        if(oNum.value == 8){alert("一次最多购买 8 张票");}
        if(oNum.value < 8){oNum.value++;}
        oMoney.innerHTML = parseInt(oUnitprice) * parseInt(oNum.value);
    };
    oMoney.innerHTML = parseInt(oUnitprice) * parseInt(oNum.value);
    oNum.onkeyup = function(){
        if(!isNaN(parseInt(oNum.value)) && parseInt(oNum.value) >= 1){
            if(oNum.value > 8){
                alert("一次最多购买 8 张票");
                oNum.value = 8;
            }
            oMoney.innerHTML = parseInt(oUnitprice) * parseInt(oNum.value);
        }else{
            oNum.value = 1;
        }
    };


    var oBkg = oSelecttickets.children[7];//背景
    var oSeatdistribution = oSelecttickets.children[8];//座位图
    var oHaveseat = oSelecttickets.children[0].children[2].children[0].children[0];//座位图标
    var oAlert = oSelecttickets.children[9];

    oHaveseat.onclick = function(){
        oBkg.style.display = "block";
        oSeatdistribution.style.display = "block";
    };
    oSeatdistribution.onclick = oBkg.onclick = function(){
        oBkg.style.display = "none";
        oSeatdistribution.style.display = "none";
    };




    function bar(){
        oBkg.style.display = "block";
        oAlert.style.display = "block";

        setTimeout(function(){
            oBkg.style.display = "none";
            oAlert.style.display = "none";
        },2000)
    };

    bar();
};


function pay(id){
    var oPay = document.getElementById(id);
    var aOPtion = oPay.children[3].children[0].children;
    var oAddress = oPay.children[3].children[1];
    var oTickets = oPay.children[3].children[2];
    var oImg = oPay.children[1].children[0];
    var oImgW = oImg.offsetWidth;
    oImg.style.height = (oImgW-12) * 10 / 7 + "px";
    window.onresize = function(){
        oImgW = oImg.offsetWidth;
        oImg.style.height = (oImgW-12) * 10 / 7 + "px";
    };
    for(var i=0; i<aOPtion.length;i++){
        aOPtion[i].index = i;
        aOPtion[i].onclick = function(){
            for(var j=0; j<aOPtion.length;j++){
                aOPtion[j].className = "";
            }
            this.className = "active";
            if(this.index == 0){
                oAddress.style.display = "block";
                oTickets.style.display = "none";
            }else{
                oAddress.style.display = "none";
                oTickets.style.display = "block";
            }
        };
    }
    var oReturn = oPay.children[0].children[0].children[0];
    var oBg = oPay.children[7];
    var oAlert = oPay.children[8];
    var oCancel = oAlert.children[2].children[0];
    oReturn.onclick = function(){
        oAlert.style.display = "block";
        oBg.style.display = "block";
    };
    oCancel.onclick = function(){
        oAlert.style.display = "none";
        oBg.style.display = "none";
    };
};

function addaddress(id){

    var oAddaddress = document.getElementById(id);
    var oBoo = oAddaddress.children[1].children[3].children[1];
    var oSel = oAddaddress.children[1].children[4];
    var oPot1 = oSel.children[0];
    var oPot2 = oSel.children[1];
    var oPot3 = oSel.children[2];
    var ready = true;
    oPot1.onfocus = function(){
        if(ready){
            oPot1.innerHTML = "";
            for(var key in data){
                oPot1.innerHTML += "<option value="+key+">"+key+"</option>";
            }
            oPot2chge();
            oBoo.innerHTML = oPot1.value + "&nbsp;&nbsp;" + oPot2.value + "&nbsp;&nbsp;" +oPot3.value;
            ready = false;
        }
    };
    oPot1.onchange = function(){
        oPot2chge();
        oBoo.innerHTML = oPot1.value + "&nbsp;&nbsp;" + oPot2.value + "&nbsp;&nbsp;" +oPot3.value;
    };
    oPot2.onchange = function(){
        oPot3chge();
        oBoo.innerHTML = oPot1.value + "&nbsp;&nbsp;" + oPot2.value + "&nbsp;&nbsp;" +oPot3.value;
    };
    oPot3.onchange = function(){
        oBoo.innerHTML = oPot1.value + "&nbsp;&nbsp;" + oPot2.value + "&nbsp;&nbsp;" +oPot3.value;
    };
    function oPot3chge(){
        oPot3.style.display = "block";
        oPot3.innerHTML = "";
        console.log(data[oPot1.value][oPot2.value]);
        for(var i=0; i<data[oPot1.value][oPot2.value].length; i++){
            oPot3.innerHTML += "<option value="+data[oPot1.value][oPot2.value][i]+">"+data[oPot1.value][oPot2.value][i]+"</option>";
        }
    };
    function oPot2chge(){
        oPot2.style.display = "block";
        oPot2.innerHTML = "";
        for(var key in data[oPot1.value]){
            oPot2.innerHTML += "<option value="+key+">"+key+"</option>";
        }
        oPot3chge();
    };

    var oDefault = oAddaddress.children[2].children[1];
    oDefault.onclick = function(){
        if(oDefault.className == "active"){
            oDefault.className = "";
        }else{
            oDefault.className = "active";
        }
    };
};

function coupon(id){
    var oCoupon = document.getElementById(id);
    var couponaLi = [];
    var aMenu = oCoupon.children[0].children[1].children[0].children;
    var aLi = oCoupon.children[1].children;
    for(var i=0; i<aMenu.length; i++){
        aMenu[i].onclick = function(){
            for(var j=0; j<aMenu.length; j++){
                aMenu[j].className = "";
            }
            this.className = "active";
        };
    }
    for(var i=0; i<aLi.length; i++){
        couponaLi.push(aLi[i]);
    }
    function coupontab(){
        for(var i=0; i<couponaLi.length; i++){
            couponaLi[i].index = i;
            couponaLi[i].onclick = function(){
                for(var j=0; j<couponaLi.length; j++){
                    couponaLi[j].children[1].children[2].className = "";
                }
                this.children[1].children[2].className = "selected";
            };
        }
    };
    coupontab();
    var oAdd = oCoupon.children[0].children[2];
    var oUl = oCoupon.children[1];
    var oBg = oCoupon.children[2];
    var oAddcoupon = oCoupon.children[3];
    var oAlert = oCoupon.children[4];
    var oText = oCoupon.children[3].children[1];
    var oCancel = oCoupon.children[3].children[2].children[0];
    var oConfirm = oCoupon.children[3].children[2].children[1];
    oAdd.onclick = function(){
        oBg.style.display = "block";
        oAddcoupon.style.display = "block";
    };
    oCancel.onclick = function(){
        oBg.style.display = "none";
        oAddcoupon.style.display = "none";
    };
    oConfirm.onclick = function(){
        oBg.style.display = "none";
        oAddcoupon.style.display = "none";
        if(oText.value == ""){
            Alert(oBg,oAlert);
        }else{
            var oLi = document.createElement("li");
            oLi.innerHTML = "<div class='number'>编号: <span>"+oText.value+"</span></div><div class='discount'><span>8折</span><div class='effective'><strong>折扣</strong><div>2020-01-01</div></div><img src='../img/default.png' width='18' alt=''></div>";
            oUl.appendChild(oLi);
            couponaLi.push(oLi);
            coupontab();
            oText.value = "";
        }
    };
    function Alert(bg,alert){
        bg.style.display = "block";
        alert.style.display = "block";
        setTimeout(function(){
            bg.style.display = "none";
            alert.style.display = "none";
        },2000);
    };
};


function search(id){
    var oSearch = document.getElementById(id);
    var oText = oSearch.children[0].children[0].children[0];
    var searchbtn = oSearch.children[0].children[0].children[1];
    var aHots = oSearch.children[1].children[1].children;
    var oHots = oSearch.children[1];
    var oHistory = oSearch.children[2];
    var list = oSearch.children[3];
    var oUl = oSearch.children[2].children[1];
    var aLi = oSearch.children[2].children[1].children;
    var soon = [];

    oText.onkeyup = function(){
        if(oText.value != ""){
            searchbtn.innerHTML = "搜索";
        }
        if(oText.value == ""){
            searchbtn.innerHTML = "取消";
        }
    };
    searchbtn.onclick = function(){
        if(searchbtn.innerHTML == "取消"){
            searchbtn.href = "../index.html";
            oHots.style.display = "block";
            oHistory.style.display = "block";
            list.style.display = "none";
            oText.value = "";
        }
        if(searchbtn.innerHTML == "搜索"){
            searchlist();
            wrap(oText.value);
        }
        if(bl){
         if(oText.value != ""){
         searchlist();
         wrap(oText.value);
         }
         }else{
         searchbtn.innerHTML = "搜索";
         oHots.style.display = "block";
         oHistory.style.display = "block";
         list.style.display = "none";
         bl = true;
         }
    };
    for(var i=0; i<aHots.length; i++){
        aHots[i].onclick = function(){
            searchlist();
            wrap(this.innerHTML);
        };
    }
    function wrap(data){
        oUl.innerHTML = '<li class="eliminate"><a href="javascript:;"><img src="../img/dustbin.png" width="16" alt=""><strong>清除搜索记录</strong></a></li>';
        var newSoon = [];
        for(var i=0; i<soon.length; i++){
            if(soon[i] != data){
                newSoon.push(soon[i]);
            }
        }
        newSoon.push(data);
        soon = newSoon;
        createrecord();
    };
    function createrecord(){
        for(var i=0; i<soon.length; i++){
            var oLi = document.createElement("li");
            oLi.innerHTML = '<img class="record" src="../img/history.png" width="20" alt=""><span>'+soon[i]+'</span><a class="delete" href="javascript:;"><img src="../img/alert.png" width="14" alt=""></a>';
            oUl.insertBefore(oLi,oUl.children[0]);
        }
        deleterecord();
    };
    function deleterecord(){
        aLi = oUl.children;
        aDelete = [];
        for(var i=0; i<aLi.length-1; i++){
            aDelete.push(aLi[i].children[2]);
        }
        for(var i=0; i<aDelete.length; i++){
            aDelete[i].onclick = function(){
                oUl.removeChild(this.parentNode);
                soon.shift(this.parentNode.children[1]);
                console.log(soon);
                if(oUl.children.length < 2){
                    oHistory.style.display = "none";
                }
            };
        }
        allclear = oUl.children[aLi.length-1].children[0];
        allclear.onclick = function(){
            oUl.innerHTML = "";
            soon = [];
            oHistory.style.display = "none";
        };
    };
    function searchlist(){
        searchbtn.innerHTML = "取消";
        oHots.style.display = "none";
        oHistory.style.display = "none";
        list.style.display = "block";
    };
};



function perform(id){
    var oPerformDetails = document.getElementById(id);
    var aBox = oPerformDetails.children;//所有子
    var oImg = oPerformDetails.children[1].children[0];//展图
    var oGinto = oPerformDetails.children[7];//放大图
    var oBkg = oPerformDetails.children[5];//背景
    var oSeatdistribution = oPerformDetails.children[6];//座位图
    var oHaveseat = oPerformDetails.children[1].children[1].children[1].children[2];//座位图标
    var oSharebtn = oPerformDetails.children[0].children[2];//分享图标
    var oSharetu = oPerformDetails.children[8];//分享提示图

    oImg.onclick = function(){
        for(var i=0; i<aBox.length; i++){
            aBox[i].style.display = "none";
        }
        oGinto.style.display = "block";
    };
    oGinto.onclick = function(){
        for(var i=0; i<aBox.length; i++){
            aBox[i].style.display = "block";
        }
        allhide();
    };
    oHaveseat.onclick = function(){
        oGinto.style.display = "none";
        oSeatdistribution.style.display = "block";
        oSharetu.style.display = "none";
        oBkg.style.display = "block";
    };
    oBkg.onclick = function(){
        allhide();
    };
    oSeatdistribution.onclick = function(){
        allhide();
    };
    oSharebtn.onclick = function(){
        oGinto.style.display = "none";
        oSeatdistribution.style.display = "none";
        oSharetu.style.display = "block";
        oBkg.style.display = "block";
    };
    oSharetu.onclick = function(){
        allhide();
    };
    function allhide(){
        oGinto.style.display = "none";
        oSeatdistribution.style.display = "none";
        oSharetu.style.display = "none";
        oBkg.style.display = "none";
    };
};

function settings(id){
    var oBody = document.getElementsByTagName("body")[0];
    var oSettings = document.getElementById(id);
    var oBack = oSettings.children[0].children[0];
    var oTitle = oSettings.children[0].children[1];

    var oPersonallist = oSettings.children[1];
    var aList = oPersonallist.children;
    var oB = oSettings.children[2];
    var aListob = oB.children;
    var bl = false;
    var oForm = aListob[0].children[0];
    var oText = aListob[0].children[0].children[0];
    var oBg = oSettings.children[3];
    var oAlert = oSettings.children[4];

    oForm.onsubmit = function(){
        if(oText.value == ""){
            oAlert.children[0].style.border = "1px solid #999";
            oAlert.children[0].innerHTML = '<img src="../img/alert.png" alt="">';
            oAlert.children[1].innerHTML = "请输入反馈内容!请输入反馈内容!请输入反馈内容!";
            showhide();
            return false;
        }else{
            back();
            oAlert.children[0].style.border = "none";
            oAlert.children[0].innerHTML = '<img src="../img/default.png" width="42" alt="">';
            oAlert.children[1].innerHTML = "提交成功! 感谢您的反馈!";
            showhide();
            return false;
        }
    };
    function showhide(){
        oBg.style.display = "block";
        oAlert.style.display = "block";
        setTimeout(function(){
            oBg.style.display = "none";
            oAlert.style.display = "none";
        },2000);
    };
    function back(){
        oPersonallist.style.display = "block";
        oBody.className = "";
        for(var j=0; j<aList.length; j++){
            aListob[j].style.display = "none";
        }
        oTitle.innerHTML = "设置";
        bl = false;
    };
    for(var i=0; i<aList.length; i++){
        aList[i].index = i;
        aList[i].onclick = function(){
            oTitle.innerHTML = this.children[1].children[0].innerHTML;
            oPersonallist.style.display = "none";
            for(var j=0; j<aList.length; j++){
                aListob[j].style.display = "none";
            }
            aListob[this.index].style.display = "block";
            if(this.index == 2){
                oBody.className = "body";
            }
            bl = true;
        };
    }
    oBack.onclick = function(){
        if(bl){
            back();
        }else{
            oBack.href = "personal.html";
        }
    };
};

function myorder(id){
    var oMyorder = document.getElementById(id);
    var aImg = oMyorder.children[1].getElementsByTagName("img");
    var firstImgW = aImg[0].offsetWidth;
    for(var i=0; i<aImg.length; i++){
        aImg[i].style.height = (firstImgW-10) * 10 / 7 + "px";
    }
    window.onresize = function(){
        firstImgW = aImg[0].offsetWidth;
        for(var i=0; i<aImg.length; i++){
            aImg[i].style.height = (firstImgW-10) * 10 / 7 + "px";
        }
    };
};
function orderdetails(id){
    var Orderdetails = document.getElementById(id);
    var oImg = Orderdetails.children[0].children[3].getElementsByTagName("img")[0];
    var firstImgW = oImg.offsetWidth;
    oImg[i].style.height = (firstImgW-10) * 10 / 7 + "px";
    window.onresize = function(){
        firstImgW = aImg[0].offsetWidth;
        oImg[i].style.height = (firstImgW-10) * 10 / 7 + "px";
    };
};
 **/