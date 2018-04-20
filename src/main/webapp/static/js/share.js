//微信分享http://192.168.1.4:9090/oauth/getSignature
// $ajax("oauth/getSignature",{url: encodeURIComponent(window.location.href.split('#')[0])})
// $(function() {
//     $.ajax({
//         data: {url: encodeURIComponent(window.location.href.split('#')[0])},
//         type: "GET",
//         url: 'http://192.168.1.4:9090/oauth/getSignature',
//         success: function (ret) {
//             if (ret) {
//                 console.log(ret);
//                 var data = JSON.parse(ret);
//                 console.log('-----------------sssss--------------');
//                 console.log(ret);
//                 wx.config({
//                     debug: false,
//                     appId: data.appid,
//                     timestamp: data.timestamp,
//                     nonceStr: data.nonceStr,
//                     signature: data.signature,
//                     jsApiList: [
//                         'onMenuShareTimeline',
//                         'onMenuShareAppMessage',
//                         'onMenuShareQQ',
//                         'onMenuShareWeibo',
//                         'onMenuShareQZone'
//                     ]
//                 });
//                 wx.ready(function (res) {
//                     //分享到朋友圈
//                     wx.onMenuShareTimeline({
//                         title: '独角秀', // 分享标题
//                         link: 'http://m.mydeershow.com/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                         imgUrl: 'http://image.mydeershow.com/2018-02-11.png', // 分享图标
//                         success: function () {
//                             // 用户确认分享后执行的回调函数
//                         },
//                         cancel: function () {
//                             // 用户取消分享后执行的回调函数
//                         }
//                     });
//                     //分享给朋友
//                     wx.onMenuShareAppMessage({
//                         title: '独角秀', // 分享标题
//                         desc: '独角秀--泡米文化传媒(上海)有限公司 (企业)', // 分享描述
//                         link: 'http://m.mydeershow.com/?#/main/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                         imgUrl: 'http://image.mydeershow.com/2018-02-11.png', // 分享图标
//                         type: '', // 分享类型,music、video或link，不填默认为link
//                         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                         success: function () {
// // 用户确认分享后执行的回调函数
//                         },
//                         cancel: function () {
// // 用户取消分享后执行的回调函数
//                         }
//                     });
//                 });
//                 wx.error(function (res) {
//                     alert("微信分享接口配置失败");
//                 });
//             }
//         },
//         error: function (ret) {
//             alert('出错');
//         }
//     })
// })