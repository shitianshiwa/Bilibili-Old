// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    Motoori Kashin
// @version      2.5.4
// @description  切换Bilibili旧版HTML5播放器，恢复2019年12月09日之前的界面。已实现video/bangumi/watchlater/mylist及嵌入式播放器。
// @author       Motoori Kashin
// @homepageURL  https://github.com/MotooriKashin/Bilibili-Old/
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*/*
// @license      MIT License
// @run-at       document-start
// @icon         https://static.hdslb.com/images/favicon.ico
// @compatible   chrome
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* 设置为全网脚本是处理bilibili嵌入播放器的跨域权限 */
    /* 若有强迫症，可自行将上面@match后面替换为【*://*.bilibili.com/*】 */
    /* 那将导致非bilibili域名下的嵌入播放器替换失败 */

    let INITIAL_DOCUMENT = ""; // 网页源代码，为避免多余请求，需要时再通过url获取(尚不知如何直接从本地获取)
    let INITIAL_TITLE = document.getElementsByTagName("title");if (INITIAL_TITLE[0]){INITIAL_TITLE = INITIAL_TITLE[0].innerText;} // 网页原标题
    let INITIAL_PATH = document.location.href.split('/'); // 当前网址(包括嵌入的子页面)

    const page = { // 网页框架
        "video" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style>#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script> <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true"></div><div class="bili-wrapper" id="bofqi" style="visibility: hidden;"><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script></div><script>0</script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>',
        "watchlater" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style>#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="watchlater-app"></div><div class="footer bili-footer"></div><script type="text/javascript">0</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/1.watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script></body></html>',
        "bangumi" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
        "special" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/bangumi/play/js/promise.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/manifest.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/vendor.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/bangumi-play.3b709027.js" crossorigin defer></script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
        "home" : '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>'
    }
    const iframeplayer = { // 嵌入式播放器，当前取第一个(blackboard)
        "blackboard" : (aid,cid) => {return "https://www.bilibili.com/blackboard/html5player.html?aid=" + aid + "&cid=" + cid + "&as_wide=1&player_type=2&urlparam=module%253DbangumicrossDomain=true";},
        "ancient" : (aid,cid) => {return "https://www.bilibili.com/blackboard/activity-ancient-player.html?aid=" + aid + "&cid=" + cid;},
        "normal" : (aid,cid) => {return "https://player.bilibili.com/player.html?aid=" + aid + "&cid=" + cid + "&page=1";},
        "html" : (aid,cid) => {return "https://www.bilibili.com/html/player.html?wmode=transparent&aid=" + aid;}
    }
    const InitialState = { // bangumi播放信息(INITIAL_STATE)
        "bangumi" : (xhr,epId)=>{
            let is = JSON.parse(xhr).result; // url返回的INITIAL_STATE
            let ep = 0; // 布尔值，判断当前集数用，需登录且有播放记录才不为0
            let ic = JSON.parse(INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/\;\(function/,"")); // 网页源INITIAL_STATE
            let pug = JSON.parse(INITIAL_DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,"")); // 网页源用户信息(PGC_USERSTATE)
            let dat = {"ver":{},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":false,"area":0,"app":false,"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};
            if (epId){dat.epId = 1 * epId;ep = 1;}else{dat.epId = "";if(pug.hasOwnProperty("progress")){dat.epId = pug.progress.last_ep_id;ep = 1;}} // 当前选集，ep=0时取第一集
            dat.ssId = is.season_id; // 番剧id
            dat.mdId = 1 * is.link.match(/[0-9][0-9]*/)[0]; // 番剧详情id
            dat.mediaInfo = {};/* 番剧基本信息 */dat.mediaInfo.actors = is.actors;dat.mediaInfo.alias = is.alias;dat.mediaInfo.areas = is.areas;dat.mediaInfo.cover = is.cover;dat.mediaInfo.evaluate = is.evaluate;dat.mediaInfo.is_paster_ads = is.is_paster_ads;dat.mediaInfo.jp_title = is.jp_title;dat.mediaInfo.link = is.link;dat.mediaInfo.media_id = is.media_id;dat.mediaInfo.mode = is.mode;dat.mediaInfo.season_id = is.season_id;dat.mediaInfo.season_status = is.season_status;dat.mediaInfo.season_title = is.season_title;dat.mediaInfo.season_type = is.season_type;dat.mediaInfo.series_title = is.series_title;dat.mediaInfo.square_cover = is.square_cover;dat.mediaInfo.staff = is.staff;dat.mediaInfo.style = is.style;dat.mediaInfo.title = is.title;dat.mediaInfo.total_ep = is.total_ep;
            dat.mediaRating = is.rating; // 番剧评分相关
            dat.epList = is.episodes;/*番剧分集信息*/if (ep==0){dat.epId=dat.epList[0].ep_id;}for (let i = 0;i<dat.epList.length;i++){if(dat.epList[i].ep_id == dat.epId){dat.epInfo = dat.epList[i]}}
            dat.newestEp = is.newest_ep; // 番剧连载状态
            dat.seasonList = is.seasons;if(!dat.seasonList){dat.seasonList = ic.sections;} // 番剧分季信息
            dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
            dat.userStat = {"loaded":true,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};/*用户信息*/dat.userStat.watchProgress = pug.progress;dat.userStat.vipInfo = pug.vip_info;
            dat.upInfo = is.up_info; // up主信息
            dat.rightsInfo = is.rights; // 权限信息
            dat.pubInfo = is.publish; // 时间信息
            if(pug.dialog){dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};dat.payMent.vip_promotion = pug.dialog.title;
                           if(pug.dialog.btn_left){dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];}} // 会员信息
            window.__INITIAL_STATE__ = dat;
            },
        "special" : (xhr,epId)=>{
            let ini = JSON.parse(xhr).result;let ep = 0;
            let pug = JSON.parse(INITIAL_DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,""));
            let is = JSON.parse(INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/\;\(function/,""));
            let dat = {"ver":{"mobile":false,"ios":false,"android":false,"windowsPhone":false,"iPhone":false,"ios9":false,"iPad":false,"webApp":false,"microMessenger":false,"weibo":false,"uc":false,"qq":false,"baidu":false,"mqq":false,"mBaidu":false,"iqiyi":false,"qqLive":false,"safari":true,"youku":false,"ie":false,"edge":false,"bili":false,"biliVer":0},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":true,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false};
            if (epId){dat.epId = 1 * epId;ep = 1;}else{dat.epId = "";if(pug.hasOwnProperty("progress")){dat.epId = pug.progress.last_ep_id;ep = 1;}}
            dat.ssId = ini.season_id;
            dat.mdId = 1 * ini.link.match(/[0-9][0-9]*/)[0];
            dat.mediaInfo = {};dat.mediaInfo.actors = ini.actors;dat.mediaInfo.alias = ini.alias;dat.mediaInfo.areas = ini.areas;dat.mediaInfo.bkg_cover = ini.bkg_cover;dat.mediaInfo.cover = ini.cover;dat.mediaInfo.evaluate = ini.evaluate;dat.mediaInfo.is_paster_ads = ini.is_paster_ads;dat.jp_title = ini.jp_title;dat.mediaInfo.link = ini.link;dat.mediaInfo.media_id = ini.media_id;dat.mediaInfo.mode = ini.mode;dat.mediaInfo.season_id = ini.season_id;dat.mediaInfo.season_status = ini.season_status;dat.mediaInfo.season_title = ini.season_title;dat.mediaInfo.season_type = ini.season_type;dat.mediaInfo.square_cover = ini.square_cover;dat.mediaInfo.staff = ini.staff;dat.mediaInfo.stat = ini.state;dat.mediaInfo.style = ini.style;dat.mediaInfo.title = ini.title;
            dat.mediaRating = ini.rating;
            dat.epList = ini.episodes;if (ep==0){dat.epId=dat.epList[0].ep_id;}for (let i = 0;i<dat.epList.length;i++){if(dat.epList[i].ep_id == dat.epId){dat.epInfo = dat.epList[i]}}
            dat.newestEp = ini.newest_ep;
            dat.seasonList = ini.seasons;if(!dat.seasonList){dat.seasonList = is.sections;}
            dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
            dat.userStat = {"loaded":false,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};dat.userStat.watchProgress = pug.progress;dat.userStat.vipInfo = pug.vip_info;
            dat.upInfo = ini.up_info;
            dat.rightsInfo = ini.rights;
            dat.pubInfo = ini.publish;
            if(pug.dialog){dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};dat.payMent.vip_promotion = pug.dialog.title;
                       if(pug.dialog.btn_left){dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];}}
            window.__INITIAL_STATE__ = dat;
            }
    }
    const functionInterface = {
        "rewritePage" : (html)=>{ // 重写页面
            document.open();
            document.write(html);
            document.close();},
        "selectDanmu" : ()=>{ // 弹幕列表
            let danmuku = window.setInterval(()=>{
                let setDanmu = document.getElementsByClassName("bilibili-player-filter-btn")[1];
                if (setDanmu){setDanmu.click();clearInterval(danmuku);}
            },100);
            },
        "deleteHead" : ()=>{ // 失效版头
            let reh = window.setInterval(()=>{
                let reHead = document.getElementsByClassName("bili-header-m");
                if (reHead[1]){
                    reHead[1].remove();
                    document.getElementById("bofqi").removeAttribute("style");
                    clearInterval(reh);}
            },100);
            },
        "deleteNewEntry" : ()=>{ // 新版入口
            let reh = window.setInterval(()=>{
                let etN = document.getElementsByClassName("new-entry")[0];
                if (etN){etN.setAttribute("style","visibility: hidden;");clearInterval(reh);}
            },100);
            },
        "setMiniHead" : (ele)=>{ // 迷你版头
            let reh = document.createElement("div");
            reh.setAttribute("class","z-top-container");
            ele.replaceWith(reh);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            document.body.appendChild(script);
            },
        "setTotalHead" : (ele)=>{ // 完整版头
            let reh = document.createElement("div");
            reh.setAttribute("class","z-top-container has-menu");
            ele.replaceWith(reh);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            document.body.appendChild(script);
            },
        "setFoot" : (ele)=>{ // 版底
            let ret = document.createElement("div");
            ret.setAttribute("class","footer bili-footer report-wrap-module");
            ret.setAttribute("id","home_footer");
            ele.replaceWith(ret);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//static.hdslb.com/common/js/footer.js");
            document.body.appendChild(script);
            },
        "removeBlur" : ()=>{ // 版头蒙板
            let blur = document.getElementsByClassName("blur-bg");
            if (blur[0]){
                blur[0].removeAttribute("style");}
            },
        "removePreview" : ()=>{ // 6分钟预览
            let hint = document.getElementsByClassName("video-float-hint-btn");
            if (hint[0]){
                let i = 10; // 倒计时长度，可自行修改，单位/s
                if(document.getElementsByClassName("second-cut")[0]){return;}
                else{
                    let sec = document.createElement("span");
                    sec.setAttribute("class","video-float-hint-btn second-cut");
                    hint[0].parentNode.appendChild(sec);
                    function cut(){
                        sec.innerText = i - 1 + "s";
                        if(i==0){hint[0].parentNode.remove();return;}
                        i = i - 1;
                        window.setTimeout(cut,1000);
                    }
                    new cut();
                }
            }
            }
    }
    const xhr = { // xhr接口
        "false" : (url)=>{
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            if (xhr.status === 200) {
                return xhr.responseText;}},
        "true" : (url)=>{
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = () => {
                return xhr.responseText;
                xhr.send();}}
    }
    const global = {
        "rewriteSction" : ()=>{ // 版头和版底
            document.addEventListener("DOMNodeInserted",() => {
            let inh = document.getElementById("internationalHeader");
            let inf = document.getElementsByClassName("international-footer");
            if (inh){ // 判断版头类型
                let ppt = document.getElementById("primaryPageTab");
                if (ppt){functionInterface.setTotalHead(inh);}else{functionInterface.setMiniHead(inh);}
            }
            if (inf[0]){functionInterface.setFoot(inf[0]);} // 判断版底
        });},
        "resetSction" : ()=>{ // 其他全局入口
            document.addEventListener("DOMNodeInserted",() => {
                functionInterface.removeBlur();
                functionInterface.removePreview();
            });
        }
    }
    const rewritePage = {
        "av" : ()=>{
            INITIAL_DOCUMENT = xhr.false(location.href);
            if (INITIAL_DOCUMENT.match(/biliconfig/) == null && INITIAL_DOCUMENT.match(/"trueCode":-404/) == null){
                window.__INITIAL_STATE__ = JSON.parse(INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/\;\(function/,""));
                let html = page.video;
                functionInterface.rewritePage(html);
                functionInterface.selectDanmu();
                functionInterface.deleteHead();
            }
            else{
                console.log("Error！Old Bilibili: 跳转页 ",INITIAL_DOCUMENT.match(/biliconfig/));
                console.log("Error！Old Bilibili: 报错页 ",INITIAL_DOCUMENT.match(/"trueCode":-404/));
            }
            },
        "watchlater" : ()=>{
            let html = page.watchlater;
            functionInterface.rewritePage(html);
            functionInterface.selectDanmu();
            },
        "bangumi" : ()=>{
            INITIAL_DOCUMENT = xhr.false(location.href);
            if (INITIAL_DOCUMENT.match(/__INITIAL_STATE__/)){
                if (INITIAL_DOCUMENT.match(/"specialCover":""/)){
                    if(window.__INITIAL_STATE__){
                        Reflect.deleteProperty(window, "__INITIAL_STATE__");}
                    let id = location.href.match(/[0-9]+/);
                    if(INITIAL_PATH[5].startsWith('ss')){
                        let url = "https://bangumi.bilibili.com/view/web_api/season?season_id=" + id[0];
                        let ini = xhr.false(url);
                        InitialState.bangumi(ini,null);}
                    if(INITIAL_PATH[5].startsWith('ep')){
                        let url = "https://bangumi.bilibili.com/view/web_api/season?ep_id=" + id[0];
                        let ini = xhr.false(url);
                        InitialState.bangumi(ini,id[0]);}
                    let html = page.bangumi;
                    functionInterface.rewritePage(html);
                    functionInterface.selectDanmu();
                    functionInterface.deleteNewEntry();
                }
                else{rewritePage.special();}}
            },
        "special" : ()=>{
            if(window.__INITIAL_STATE__){
                Reflect.deleteProperty(window, "__INITIAL_STATE__");}
            let id = location.href.match(/[0-9]+/);
            if(INITIAL_PATH[5].startsWith('ss')){
                let url = "https://bangumi.bilibili.com/view/web_api/season?season_id=" + id[0];
                let ini = xhr.false(url);
                InitialState.special(ini,null);}
            if(INITIAL_PATH[5].startsWith('ep')){
                let url = "https://bangumi.bilibili.com/view/web_api/season?ep_id=" + id[0];
                let ini = xhr.false(url);
                InitialState.special(ini,id[0]);}
            let html = page.special;
            functionInterface.rewritePage(html);
            },
        "blackboard" : ()=>{
            let player = document.getElementsByTagName("iframe");
            if (player[0]){
                for (let i = 0;i < player.length;i++){
                    let src = player[i].src;
                    console.log(player[i]);
                    if (src && src.match(/newplayer/)){
                        let aid = 1 * src.match(/aid=[0-9]*/)[0].replace(/aid=/,"");
                        let cid = src.match(/cid=[0-9]*/);if(cid && cid[0]){cid = 1 * cid[0].replace(/cid=/,"");}
                        let element = player[i];
                        let width = player[i].offsetWidth;let height = player[i].offsetHeight;
                        if(!cid){ // 尝试用URL获取cid(可能会跨域注意！)
                            let xhr = new XMLHttpRequest();
                            let url = '//api.bilibili.com/x/player/pagelist?aid=' + aid + '&jsonp=jsonp';
                            xhr.open('GET',url,true);
                            xhr.onload = () => {
                                let cid = JSON.parse(xhr.responseText).data[0].cid;
                                let iframe = document.createElement("iframe");
                                iframe.setAttribute("src",iframeplayer.blackboard(aid,cid));
                                iframe.setAttribute("style",'width: '+ width +'px;height: ' + height + 'px;');
                                element.replaceWith(iframe);
                            }
                            xhr.send();
                        }
                        else{
                            let iframe = document.createElement("iframe");
                            iframe.setAttribute("src",iframeplayer.blackboard(aid,cid));
                            iframe.setAttribute("style",'width: '+ width +'px;height: ' + height + 'px;');
                            element.replaceWith(iframe);
                        }
                    }
                }
            }
            },
        "home" : ()=>{
            let html = page.home;
            functionInterface.rewritePage(html);
            },
    }
    if(INITIAL_PATH[2] && INITIAL_PATH[2].match(/bilibili\./)){ // 匹配*.bilibili.com
        if(INITIAL_PATH[3]){
            if(INITIAL_PATH[3] == 'video' && INITIAL_PATH[4].startsWith('av')){rewritePage.av();} // 普通av页
            if(INITIAL_PATH[3] == 'watchlater'){rewritePage.watchlater();} // 稍后再看
            if(INITIAL_PATH[3] == 'bangumi' && INITIAL_PATH[4] == 'play'){rewritePage.bangumi();} // bangumi(包括特殊页面)
            if(INITIAL_PATH[3] == 'blackboard' && INITIAL_PATH[4] && INITIAL_PATH[4].startsWith('newplayer')){window.parent.postMessage("newplayer", "*")} // 嵌入式页面
            if(INITIAL_PATH[2] != 'live.bilibili.com'){global.rewriteSction();} // 不处理直播页版面
        }
        if(INITIAL_PATH[2].match(/live/) == null){
            document.addEventListener("DOMContentLoaded",global.resetSction()); // 不对直播页进行其他全局处理
        }
    }
    /* 监听子页面传送的嵌入式播放器信息 */
    window.addEventListener('message',(event)=>{if(event.data == "newplayer"){console.log("发现嵌入播放器！开始替换……",event.data + " -> oldplayer");rewritePage.blackboard();}},false);
})();
