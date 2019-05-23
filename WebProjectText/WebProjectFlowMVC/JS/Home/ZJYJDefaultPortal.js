// 主页DefaultPortal.aspx页

function loadDefault()
{
//    getObj("txtKW").blur();
//    
//    var aHrefs = document.getElementsByTagName("a");
//    for (var i = 0; i < aHrefs.length; i++)
//    {
//        aHrefs[i].title = aHrefs[i].innerText;
//    }
//    
    loadSchedule();
    //loadScheduleInfo();
}
 // 中建一局筑福书园
function showZJZFSY()
{
    getWin().location = "../../IDOA/EnCulture/bbs/VForumMainBrowse.aspx?IDM_ID=57E26C3F-C349-4E64-B1EF-C8DD3C174999";
	
}

function showYZ()
{
    window.open("http://www.cscec1bre.com/2_1.asp?id=6", '_blank');
}

// 查看公告
function showBulletin(bullID)
{
    openWindow("../../IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);
}

// 显示更多公告
function showMoreBulletin()
{
    getWin().location = "../../IDOA/EnCulture/Bulletin/VBulletin.aspx";
}

// 查看新闻
function showNews(newsID)
{
    openWindow("../../IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

// 显示更多新闻
function showMoreNews()
{
    getWin().location = "../../IDOA/EnCulture/News/VNews.aspx";
}

// 显示出差记录
function showOutWorkList()
{
    openWindow("../../IDOA/Employee/VOutWorkList.aspx", 800, 600);
}

// 显示外出记录
function showOutGoList()
{
    openWindow("../../IDOA/MyWork/VOutGo.aspx", 800, 600);
}


// 登记外出
function writeOutGo()
{
    openWindow("../../IDOA/MyWork/VOutGoAdd.aspx", 500, 400);
}

// 显示更多外出
function showMoreOutGo()
{
    getWin().location = "../../IDOA/MyWork/VOutGo.aspx";
}

// 查看外出
function showOutGo(ogID)
{
    openWindow("../../IDOA/MyWork/VOutGoBrowse.aspx?ID=" + ogID, 500, 400);
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
    openWindow("../../IDOA/IntraMail/VMailWrite.aspx", 800, 600);
}

// 显示更多邮件
function showMoreMail()
{
    getWin().location = "../../IDOA/IntraMail/VMailReceive.aspx";
}

// 查看邮件
function showMail(tmsID, rowIndex)
{
    var tbMail =getObj("tbMail");
    var img = getObjTC(tbMail, rowIndex * 2, 0, "img", 0);
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + "mail_read.gif";
    openWindow("../../IDOA/IntraMail/VMailBrowse.aspx?BrowseType=Receive&TMSID=" + tmsID, 800, 600);
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
    
}

// 加载日程
function loadSchedule()
{
    var ym = getObj("ddlYear").value + "-" + getObj("ddlMonth").value;
    setAjaxContainer(tdSchedule);
    ajaxRequest("ZJDefaultPortal.aspx", { AjaxRequest: true, Aim: "3", CalDate: ym }, "html", refreshSchedule);
}

// 显示更多日程
function showMoreSchedule()
{
    getWin().location = "../../IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx";
}

// 加载两条日程数据
function loadScheduleInfo()
{
    setAjaxContainer(tdScheduleInfo);
    ajaxRequest("DefaultPortal.aspx", { AjaxRequest: true, Aim: "6", CalDate: '' }, "html", refreshScheduleInfo);
}

// 刷新两条日程数据
function refreshScheduleInfo(data, textStatus)
{
    $(tdScheduleInfo).html(data);
}

// 显示更多日程
function showMoreSchedule()
{
    getWin().location = "../../IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx";
}

// 查看日程
function showSchedule(td)
{
    if (td.innerText != "")
    {
        var year = getObj("ddlYear").value;
        var month = getObj("ddlMonth").value;
        var day = td.innerText;
        openWindow("../../IDOA/MyWork/MySchedule/VMyScheduleDay.aspx?Year=" + year + "&Month=" + month + "&Day=" + day, 800, 500);
    }
}

// 刷新日程
function refreshSchedule(data, textStatus)
{
    $(tdSchedule).html(data);
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

// 新建帖子
function writePost()
{
    openWindow("../../IDOA/EnCulture/bbs/VForumMyTopic.aspx", 800, 600);
}

// 进入帖子
function showMorePost()
{
    getWin().location = "../../IDOA/EnCulture/bbs/VForumMainBrowse.aspx";
}

// 查看帖子
function showPost(fmID)
{
    openWindow("../../IDOA/EnCulture/bbs/VTopicContent.aspx?ID=" + fmID, 800, 700);
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
function showMoreChat()
{
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=3E734848-8124-4188-B291-6C4391771981&IDM_CD=0&IDM_ID=F275882A-A9A2-45DE-BB62-2F8388075453";
}
function showMoreHT()
{
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=0D5B2157-3FA0-4297-A162-E866BDB3FC6A&IDM_CD=3&IDM_ID=D69B58D9-E668-4DB9-A98D-711A072AF833";
}
function showMoreWork()
{
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=005376DB-49C3-411C-A3B1-CBE41E5EDEB6&IDM_CD=6&IDM_ID=3C706606-2B72-4CD7-9249-ED1C16C75A5D";
}
function showMoreTZ()
{
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=B23ABF99-DCA8-4931-8171-29EE779AA9F6&IDM_CD=4&IDM_ID=0E864B42-BEAC-4EE3-B283-4FF60E31C946";
}
 function showMoreZP()
{
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=556A3DED-82ED-4337-B61B-7AAD416743D5&IDM_CD=1&IDM_ID=86711C0A-C4F2-4EA4-B5B0-7618408166C7";
}

function showNK(NKid)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + NKid, 800, 600);
}
function showDoc()
{
    openWindow("../../IDOA/MyWork/MyDoc/VMyDoc.aspx", 800, 600);
}  

function showWID(ID)
{
    openWindow("../../IDOA/MyWork/MyDoc/VMyDocView.aspx?ID=" + ID, 800, 600);
}
//问卷
function showQ(ID)
{
    openWindow("../../IDOA/EnCulture/Survey/VQuestionnaire.aspx?ID="+ID, 800, 600);
}
//投票
function showV(ID)
{
    openWindow("../../IDOA/VoteOnline/Votehand.aspx?ID="+ID, 800, 600);
}
function showZP(ZPid)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + ZPid, 800, 600);
}
function showBR(type)
{
    if(type==0)
    {
        getWin().location = "../../IDOA/VoteOnline/VoteList.aspx";
    }else{
        getWin().location = "../../IDOA/EnCulture/Survey/VSurveyVote.aspx";
    }
}

//友情链接
 function showMoreLink()
{
    openWindow("../../IDOA/EnCulture/VFriendURL.aspx",800,600)
} 

function showLink(url)
{
    window.open(url, '_blank');
} 