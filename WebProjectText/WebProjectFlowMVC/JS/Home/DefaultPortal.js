// 主页DefaultPortal.aspx页

function loadDefault()
{
    var txtKW = getObj("txtKW");
    if (txtKW)
    {
        txtKW.blur();
    }
    
    var aHrefs = document.getElementsByTagName("a");
    for (var i = 0; i < aHrefs.length; i++)
    {
        aHrefs[i].title = aHrefs[i].innerText;
    }

    loadSchedule();
    loadScheduleInfo();
    //待办
    if(window.parent.parent.document.getElementsByName("Main").length && window.parent.parent.frames('Top'))
    {
        if(window.parent.parent.frames('Top').addOberver)
        {
            window.parent.parent.frames('Top').addOberver(window);  
            //注册后，立即发起一个主动请求：
            window.parent.parent.frames('Top').notifyObservers(window);                  
        }
    }
}

// 查看公告
function showBulletin(bullID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);
}

// 显示更多公告
function showMoreBulletin()
{
    getWin().location = "/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletin.aspx";
}

// 查看新闻
function showNews(newsID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

// 显示更多新闻
function showMoreNews()
{
    getWin().location = "/" + rootUrl + "/IDOA/EnCulture/News/VNews.aspx";
}

// 显示请假记录
function showLeaveList()
{
    openWindow("/" + rootUrl + "/IDOA/Employee/VLeaveList.aspx", 800, 600);
}

// 显示出差记录
function showOutWorkList()
{
    openWindow("/" + rootUrl + "/IDOA/Employee/VOutWorkList.aspx", 800, 600);
}

// 显示外出记录
function showOutGoList()
{
    openWindow("/" + rootUrl + "/IDOA/MyWork/VOutGo.aspx", 800, 600);
}

// 上班登记
function onDuty(btn)
{
    setAjaxContainer(btn);
    ajaxRequest("/" + rootUrl + "/Home/DefaultPortal.aspx", { AjaxRequest: true, Aim: "4" }, "text", finishOnDuty);
}

// 上班成功
function finishOnDuty(data, textStatus)
{
    if (data == "Y")
    {
        alert("上班考勤成功。");
    }
    else
    {
        alert(data);
    }
}

// 下班登记
function offDuty(btn)
{
    setAjaxContainer(btn);
    ajaxRequest("/" + rootUrl + "/Home/DefaultPortal.aspx", { AjaxRequest: true, Aim: "5" }, "text", finishOffDuty);
}

// 下班成功
function finishOffDuty(data, textStatus)
{
    if (data == "Y")
    {
        alert("下班考勤成功。");
    }
    else
    {
        alert(data);
    }
}

// 登记外出
function writeOutGo()
{
    openWindow("/" + rootUrl + "/IDOA/MyWork/VOutGoAdd.aspx", 500, 400);
}

// 显示更多外出
function showMoreOutGo()
{
    getWin().location = "/" + rootUrl + "/IDOA/MyWork/VOutGo.aspx";
}

// 查看外出
function showOutGo(ogID)
{
    openWindow("/" + rootUrl + "/IDOA/MyWork/VOutGoBrowse.aspx?ID=" + ogID, 500, 400);
}

// 企业邮局
function onWebMail(userid,key)
{
    window.open("http://mail.chinafortune.com.cn/cgi-bin/login.sso?USERID="+userid+"@chinafortune.com.cn&KEY="+key, '_blank');
//    openWindow("http://mail.cf-re.com.cn/cgi-bin/login.sso?USERID="+userid+"&KEY="+key, 960, 650);
}

// 更多待办
function showMoreWaitDo()
{
//    getWin().location = "";
}

// 写邮件
function wirteMail()
{
    openWindow("/" + rootUrl + "/IDOA/IntraMail/VMailWrite.aspx", 800, 600);
}

// 显示更多邮件
function showMoreMail()
{
    getWin().location = "/" + rootUrl + "/IDOA/IntraMail/VMailReceive.aspx";
}

// 查看邮件
function showMail(tmsID, rowIndex)
{
    var img = getObjTC(tbMail, rowIndex * 2, 0, "img", 0);
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + "mail_read.gif";
    openWindow("/" + rootUrl + "/IDOA/IntraMail/VMailBrowse.aspx?BrowseType=Receive&TMSID=" + tmsID, 800, 600);
}

// 查看知识
function showKM(aID, fileType)
{
    window.open("/" + rootUrl + "/Knowledge/Archives/KnowledgeDetail.aspx?ID=" + aID + "&FileType=" + fileType);
}

// 显示最新上传知识
function showKM1()
{
    divKM1.style.display = "";
    divKM2.style.display = "none";
    getObj("spKM1").className = "dft_tle2";
    getObj("spKM2").className = "dft_tle3";
    tdKM1.className = "dft_h2";
    tdKM2.className = "dft_h3";
    getObj("txtKW").value = "";
    if (window["Default_KM_1"])
    {
        getObj("txtKW").value = window["Default_KM_1"];
        getObj("txtKW").className = "flt_txt_on";
    }
    else
    {
        disableKW(getObj("txtKW"))
    }
}

// 显示知识浏览排行
function showKM2()
{
    divKM1.style.display = "none";
    divKM2.style.display = "";
    getObj("spKM1").className = "dft_tle3";
    getObj("spKM2").className = "dft_tle2";
    tdKM1.className = "dft_h3";
    tdKM2.className = "dft_h2";
    getObj("txtKW").value = "";
    if (window["Default_KM_2"])
    {
        getObj("txtKW").value = window["Default_KM_2"];
        getObj("txtKW").className = "flt_txt_on";
    }
    else
    {
        disableKW(getObj("txtKW"))
    }
}

// 进入知识关键字
function activeKW(txt)
{
    if (txt.value == "知识搜索…")
    {
        txt.value = "";
        txt.className = "flt_txt_on";
    }
}

// 离开知识关键字
function disableKW(txt)
{
    if (txt.value == "")
    {
        txt.value = "知识搜索…";
        txt.className = "flt_txt_off";
    }
}

// 搜索知识
function searchKM()
{
    var kmAim = (tdKM1.className == "dft_h2" ? "1" : "2");
    var kw = getObj("txtKW").value;
    if (kw == "知识搜索…")
    {
        kw = "";
    }
    window["Default_KM_" + kmAim] = kw;
    
    setAjaxContainer(tdKM);
    ajaxRequest("/" + rootUrl + "/Home/DefaultPortal.aspx", { AjaxRequest: true, Aim: kmAim, KMKw: kw }, "html", refreshKM);
}

// 刷新知识
function refreshKM(data, textStatus)
{
    var kmAim = (tdKM1.className == "dft_h2" ? "1" : "2");
    if (kmAim == "1")
    {
        $(divKM1).html(data);
    }
    else
    {
        $(divKM2).html(data);
    }
}

// 新建帖子
function writePost()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VForumMyTopic.aspx", 800, 600);
}

// 进入帖子
function showMorePost()
{
    getWin().location = "/" + rootUrl + "/IDOA/EnCulture/bbs/VForumMainBrowse.aspx";
}

// 查看帖子
function showPost(fmID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VTopicContent.aspx?ID=" + fmID, 800, 700);
}

// 加载日程
function loadSchedule()
{
    var ddlYear = getObj("ddlYear");
    var ddlMonth = getObj("ddlMonth");
    if (ddlYear)
    {
        var ym = ddlYear.value + "-" + ddlMonth.value;
        setAjaxContainer(tdSchedule);
        ajaxRequest("/" + rootUrl + "/Home/DefaultPortal.aspx", { AjaxRequest: true, Aim: "3", CalDate: ym }, "html", refreshSchedule);
    }
}

// 刷新日程
function refreshSchedule(data, textStatus)
{
    $(tdSchedule).html(data);
}

// 加载两条日程数据
function loadScheduleInfo()
{
    if ($("#tdScheduleInfo")[0])
    {
        setAjaxContainer(tdScheduleInfo);
        ajaxRequest("/" + rootUrl + "/Home/DefaultPortal.aspx", { AjaxRequest: true, Aim: "6", CalDate: '' }, "html", refreshScheduleInfo);
    }
}

// 刷新两条日程数据
function refreshScheduleInfo(data, textStatus)
{
    $(tdScheduleInfo).html(data);
}

// 显示更多日程
function showMoreSchedule()
{
    getWin().location = "/" + rootUrl + "/IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx";
}

// 查看日程
function showSchedule(td)
{
    if (td.innerText != "")
    {
        var year = getObj("ddlYear").value;
        var month = getObj("ddlMonth").value;
        var day = td.innerText;
        openWindow("/" + rootUrl + "/IDOA/MyWork/MySchedule/VMyScheduleDay.aspx?Year=" + year + "&Month=" + month + "&Day=" + day, 800, 500);
    }
}

//查看今天的日程
function showTodaySchedule() 
{
    var year = (new Date()).getFullYear();
    var month = (new Date()).getMonth() + 1;
    if (month < 10) month = "0" + month;
    var day = (new Date()).getDate();
    if (day < 10) day = "0" + day;
    openWindow("/" + rootUrl + "/IDOA/MyWork/MySchedule/VMyScheduleDay.aspx?Year=" + year + "&Month=" + month + "&Day=" + day, 800, 500);
}

// 日程悬停
function overDay(td)
{
    if (td.innerText != "")
    {
        td.style.cursor = "hand";
        td.className = "sch_tdon";
    }
}

// 日程离开
function outDay(td)
{
    if (td.innerText != "")
    {
        td.className = "";   
    }
}

// 获取跳转时的window对象
function getWin()
{
    var win;
    var pp = getObjPP("Main");
    var p = getObjPP=("IDModTabFrame");
    if (window.parent && window.parent.parent && pp && pp.tagName.toUpperCase() == "IFRAME")
    {
        win = window.parent.parent.frames("Main");
    }
    else if (window.parent && pp && pp.tagName.toUpperCase() == "IFRAME")
    {
        win = window.parent.frames("IDModTabFrame");
    }
    else
    {
        win = window;
    }
    
    return win;
}

// 显示更多制度
function showMoreRegime()
{
    getWin().location = "/" + rootUrl + "/IDOA/Bylaw/VRegimeViewFrame.aspx";
}
//查看制度
function  showRegime(BID,check,BIID)
{
    //统一用VRegimeViewBrowse页面，不管是否直接登记还是申请 edit by zhangmq 2012-7-10
//    if(check == "Y")
//    {
//        openWindow("../IDOA/Bylaw/VRegimeBrowse.aspx?BID=" + BID, 800, 600);
//    }
//    else
//    {
    openWindow("/" + rootUrl + "/IDOA/Bylaw/VRegimeViewBrowse.aspx?BID=" + BID + "&BIID=" + BIID, 800, 600);
//    }
}
//查看公司信息发布
function showIssue(ID)
{ 
    openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + ID, 800, 600);
}

function showMoreCorpThing()
{
    getWin().location = "/" + rootUrl + "/IDOA/EnCulture/CorpThing/VCorpThing.aspx";
}

function showCorpThing()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/CorpThing/VCorpThingBrowse.aspx?ID=" + arguments[0], 800, 600);
}