// 主页DefaultPortal.aspx页

function loadDefault()
{
    var aHrefs = document.getElementsByTagName("a");
    for (var i = 0; i < aHrefs.length; i++)
    {
        aHrefs[i].title = aHrefs[i].innerText;
    }
    
    loadSchedule();
}

// 查看付款申请
function showPayRequest(prid)
{
    openWindow("../PayManage/VPayRequestBrowse.aspx?PRID=" + prid, 1000,800);
}

// 显示更多付款申请
function showMorePayRequest()
{
    getWin().location = "../PayManage/VMyPayRequest.aspx";
}

function showProject(projectID)
{
    openWindow("../Project/VProjectBrowse.aspx?ProjectID=" + projectID, 1000,800);
}

function showContract(contractID,isformal)
{
    if(isformal=='Y')
    {
        url="../Contract/VMyContractHaveSave.aspx?ContractID="+contractID;
    }
    else
    {
        url="../Contract/VContractBrowse.aspx?ContractID="+contractID;
    }
    openWindow( url, 1000,800);
}

// 显示更多付款申请
function showMoreContract()
{
    getWin().location = "../Contract/VMyContract.aspx";
}


// 企业邮局
function onWebMail(userid,key)
{
    window.open("http://mail.chinafortune.com.cn/cgi-bin/login.sso?USERID="+userid+"@chinafortune.com.cn&KEY="+key, '_blank');
//    openWindow("http://mail.cf-re.com.cn/cgi-bin/login.sso?USERID="+userid+"&KEY="+key, 960, 650);
}



// 写邮件
function wirteMail()
{
    openWindow("/"+rootUrl+"/IDOA/IntraMail/VMailWrite.aspx", 800, 600);
}

// 显示更多邮件
function showMoreMail()
{
    getWin().location = "/"+rootUrl+"/IDOA/IntraMail/VMailReceive.aspx";
}

// 查看邮件
function showMail(tmsID, rowIndex)
{
    var img = getObjTC(tbMail, rowIndex * 2, 0, "img", 0);
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + "mail_read.gif";
    openWindow("/"+rootUrl+"/IDOA/IntraMail/VMailBrowse.aspx?BrowseType=Receive&TMSID=" + tmsID, 800, 600);
}



// 加载日程
function loadSchedule()
{
    var ym = getObj("ddlYear").value + "-" + getObj("ddlMonth").value;
    setAjaxContainer(tdSchedule);
    ajaxRequest("/"+rootUrl+"/Home/DefaultPortal.aspx", { AjaxRequest:true, Aim:"3", CalDate:ym}, "html", refreshSchedule);
}

// 刷新日程
function refreshSchedule(data, textStatus)
{
    $(tdSchedule).html(data);
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
        openWindow("/"+rootUrl+"/IDOA/MyWork/MySchedule/VMyScheduleDay.aspx?Year=" + year + "&Month=" + month + "&Day=" + day, 800, 500);
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