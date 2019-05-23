// 主页vLanYueDefault.aspx页

function loadDefault()
{
    getObj("txtKW").blur();
    
    var aHrefs = document.getElementsByTagName("a");
    for (var i = 0; i < aHrefs.length; i++)
    {
        aHrefs[i].title = aHrefs[i].innerText;
    }
    
    loadSchedule();  
    
    setWidth(); 
}

// 查看公告
function showBulletin(bullID)
{
    openWindow("../IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);
}

// 显示更多公告
function showMoreBulletin()
{
    openWindow("../IDOA/EnCulture/Bulletin/VBulletin.aspx", 800, 600);
}

// 查看新闻
function showNews(newsID)
{
    openWindow("../IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

// 显示更多新闻
function showMoreNews()
{
    openWindow("../IDOA/EnCulture/News/VNews.aspx",800,600)
}

// 显示请假记录
function showLeaveList()
{
    openWindow("../IDOA/Employee/VLeaveList.aspx", 800, 600);
}

// 显示出差记录
function showOutWorkList()
{
    openWindow("../IDOA/Employee/VOutWorkList.aspx", 800, 600);
}

// 显示外出记录
function showOutGoList()
{
    openWindow("../IDOA/MyWork/VOutGo.aspx", 800, 600);
}

// 上班登记
function onDuty(btn)
{
    setAjaxContainer(btn);
    ajaxRequest("vLanYueDefault.aspx", { AjaxRequest:true, Aim:"4"}, "text", finishOnDuty);
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
    ajaxRequest("vLanYueDefault.aspx", { AjaxRequest:true, Aim:"5"}, "text", finishOffDuty);
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
    openWindow("../IDOA/MyWork/VOutGoAdd.aspx", 500, 400);
}

// 显示更多外出
function showMoreOutGo()
{
    openWindow("../IDOA/MyWork/VOutGo.aspx",800,600)
}

// 查看外出
function showOutGo(ogID)
{
    openWindow("../IDOA/MyWork/VOutGoBrowse.aspx?ID=" + ogID, 500, 400);
}

// 写邮件
function wirteMail()
{
    openWindow("../IDOA/IntraMail/VMailWrite.aspx", 800, 600);
}

// 显示更多邮件
function showMoreMail()
{
    openWindow("../IDOA/IntraMail/VMailReceive.aspx",800,600)
}

// 查看邮件
function showMail(tmsID, rowIndex)
{
    var img = getObjTC(tbMail, rowIndex * 2, 0, "img", 0);
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + "mail_read.gif";
    openWindow("../IDOA/IntraMail/VMailBrowse.aspx?BrowseType=Receive&TMSID=" + tmsID, 800, 600);
}

// 查看知识
function showKM(aID, fileType)
{
    window.open("../Knowledge/Archives/KnowledgeDetail.aspx?ID=" + aID + "&FileType=" + fileType);
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
    ajaxRequest("vLanYueDefault.aspx", { AjaxRequest:true, Aim:kmAim, KMKw:kw}, "html", refreshKM);
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
    openWindow("../IDOA/EnCulture/bbs/VForumMyTopic.aspx", 800, 600);
}

// 进入帖子
function showMorePost()
{
    openWindow("../IDOA/EnCulture/bbs/VForumMainBrowse.aspx",800,600);
}

// 查看帖子
function showPost(fmID)
{
    openWindow("../IDOA/EnCulture/bbs/VTopicContent.aspx?ID=" + fmID, 800, 700);
}

// 加载日程
function loadSchedule()
{
    var ym = getObj("ddlYear").value + "-" + getObj("ddlMonth").value;
    setAjaxContainer(tdSchedule);
    ajaxRequest("vLanYueDefault.aspx", { AjaxRequest:true, Aim:"3", CalDate:ym}, "html", refreshSchedule);
}

// 刷新日程
function refreshSchedule(data, textStatus)
{
    $(tdSchedule).html(data);
}

// 显示更多日程
function showMoreSchedule()
{
    openWindow("../IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx", 800, 600);
}

// 查看日程
function showSchedule(td)
{
    if (td.innerText != "")
    {
        var year = getObj("ddlYear").value;
        var month = getObj("ddlMonth").value;
        var day = td.innerText;
        openWindow("../IDOA/MyWork/MySchedule/VMyScheduleDay.aspx?Year=" + year + "&Month=" + month + "&Day=" + day, 800, 500);
    }
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