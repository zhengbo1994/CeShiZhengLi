// 主页DefaultPortal.aspx页

//function loadDefault()
//{
//    var txtKW = getObj("txtKW");
//    if (txtKW)
//    {
//        txtKW.blur();
//    }
//    
//    var aHrefs = document.getElementsByTagName("a");
//    for (var i = 0; i < aHrefs.length; i++)
//    {
//        aHrefs[i].title = aHrefs[i].innerText;
//    }
//    
//    loadSchedule();
//    //待办
//    if(window.parent.parent.frames('Top'))
//    {
//        if(window.parent.parent.frames('Top').addOberver)
//        {
//            window.parent.parent.frames('Top').addOberver(window);  
//            //注册后，立即发起一个主动请求：
//            window.parent.parent.frames('Top').notifyObservers(window);                  
//        }
//    }
//}

// 查看公告
function showBulletin(bullID)
{
    openWindow("/"+rootUrl+"/IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);
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


// 查看知识
function showKM(aID, fileType)
{
    window.open("/" + rootUrl + "/Knowledge/Archives/KnowledgeDetail.aspx?ID=" + aID + "&FileType=" + fileType);
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

//公司文档
function showMoreCorpDoc()
{
    openWindow("/" + rootUrl + "/Knowledge/Archives/KnowledgeIndex.aspx", 800, 600);
}

//管理参考
function showMoreMngRef()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/ManageRefer/VManageRefer.aspx", 800, 600);
}

function showMngRef()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/ManageRefer/VManageReferBrowse.aspx?ID=" + arguments[0], 800, 600);
}

//招标公告
function showMoreTenderNotice()
{
    openWindow("/" + rootUrl + "/ZBidding/WebBidding/VZBiddingBulletin.aspx", 800, 600);
}

function showTenderNotice()
{
    openWindow("/" + rootUrl + "/ZBidding/WebBidding/VZBiddingBulletinBrowse.aspx?ZBBID=" + arguments[0], 800, 600);
}

// 进入质量缺陷跟踪页面
function showPlanTrack()
{
    //    getWin().location = "/"+rootUrl+"/POM/PlanTrack/DevPlanTrack/VTQDefectTrack.aspx";
    openWindow("/" + rootUrl + "/IDOA/QualityCheck/VQualityCheck.aspx", 800, 600);
}

// 查看工作预警
function showJobEarlyWarningWork(JEWID)
{
    openWindow('/'+rootUrl+'/BI/JobEarlyWarning/VJobEarlyWarningWorkBrowse.aspx?JEWID=' + JEWID, 800, 600);
}

// 查看任务质量缺陷
function showPlanTrackDetail(TQDID)
{
    openWindow('/'+rootUrl+'/POM/Quality/VTaskQualityDefectView.aspx?ID=' + TQDID, 800, 450);
}

// 查看任务信息
function showTaskDetail(TaskID)
{
    openWindow('/'+rootUrl+'/POM/Plan/VWorkTaskBrowse.aspx?ID=' + TaskID, 800, 600);
}

function showTaskReport(TaskID)
{
    openWindow('/'+rootUrl+'/POM/Plan/TaskExecution/VMyTaskExecReportBrowse.aspx?ID=' + TaskID, 850, 600);
}

function OpenTrackForm()
{
    getWin().location = "/" + rootUrl + "/IDOA/PlanTracking/VPlanTracking.aspx";
}

//质量检查
function showQualityCheck(id, title) {
    openWindow('/'+rootUrl+'/IDOA/QualityCheck/VQualityCheckView.aspx?Type=0&ID=' + id + '&Title=' + encodeURI(title), screen.availWidth, screen.availHeight, 0, 0, 1);
}

//计划运营跟踪平台
function showPlanTracking(id) {
    openWindow('/'+rootUrl+'/IDOA/PlanTracking/VPlanTrackingView.aspx?Type=0&ID=' + id, screen.availWidth, screen.availHeight, 0, 0, 1);
}
//显示更多人力资源动态信息
function showMoreHrInfo()
{
    openWindow("/" + rootUrl + "/IDOA/HumanResourcesInfo/VHumanResourcesInfo.aspx", 900, 700);
}
//显示人力资源动态信息明细
function showHumanResourcesInfo(hrid)
{
    openWindow("/" + rootUrl + "/IDOA/HumanResourcesInfo/VHumanResourcesInfoBrowse.aspx?HRID="+hrid, 900, 700);
}
//待办事项更多
function showMoreWaitApprove()
{
    openWindow("/" + rootUrl + "/IDOA/HumanResourcesInfo/VWaitApproveInfo.aspx", 900, 700);
}
//显示岗位竞聘明细
function showStationCompetition(tscid)
{
    openWindow("/" + rootUrl + "/IDOA/StationCompetition/VStationCompetitionBrowse.aspx?TSCID=" + tscid, 900, 700);
}
//岗位竞聘更多
function showMoreStationCompetition()
{
    openWindow("/" + rootUrl + "/IDOA/StationCompetition/VStationCompetition.aspx", 900, 700);
}