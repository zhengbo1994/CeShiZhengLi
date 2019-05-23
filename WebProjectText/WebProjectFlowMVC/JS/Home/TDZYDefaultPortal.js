$(function ()
{
    //公告、制度内容块
    var $tbBulletin = $("#tbBulletin");


})

//亮点回顾更多
function showMoreSport()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=5EB67746-88E7-412C-A7B9-6D4861528ABA&IDM_CD=200", 0, 0);
}
// 显示更多新闻
function showMoreNews()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNews.aspx", 800, 600);
}
//新闻图片
function showPicNews(newsID)
{
    openWindow("../../IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}
//荣誉榜
function showMoreMeeting()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=937D708D-A6E6-4217-81DD-F70A917A5767&IDM_CD=100", 800, 600);
}
//友情链接
function showMoreFriendLink()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/VFriendURL.aspx", 800, 600);
}
//公告
function showMoreBulletin()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletin.aspx", 800, 600);
}
//温馨提醒
function showMoreWarn()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=AFD694A5-CBEF-45C2-B635-041B2667441C&PortalType=0&IDM_CD=300", 0, 0);
}
//知识管理
function showMoreKnowledge()
{
    window.open("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=81DFCA6F-D84F-4066-B32A-F65AB56B2B74&IDM_CD=120", 0, 0);
}
//公司论坛
function showMorePost()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VForumMainBrowse.aspx", 800, 600);
}
//党纪群专栏
function showMoreDiscipline()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=3253874D-2D7A-4F79-8C24-351C49A5781C&IDM_CD=150", 0, 0);
}
//信息发布
function showMeeting(id)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + id, 800, 600);
}
// 查看新闻
function showNews(newsID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}
//展示外部链接
function showLink(strAction)
{
        if (typeof strAction === "string" && strAction)
        {
            var linkOption = {
                "PM": "http://www.hnsky-land.com/", //天地置业门户网站
                "VM": "http://115.29.192.179/", //视频监控系统
                "EM": "http://oa.hnic.com.cn/oa/themes/mskin/login/login.jsp",  //企业邮箱
                "OA": "http://oa.hnsky-land.com/"       //原来OA
            }

            if (linkOption[strAction.toUpperCase()])
            {
                window.open(linkOption[strAction.toUpperCase()], '_blank', 'resizable=1,status=1,scrollbars=1,width=800,height=600,location=1')
            }
        }
}
//应用链接
function showMoreLink()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/VFriendURL.aspx", 800, 600);
}
//公司公告
function showBulletin(bullID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);

}
//查看帖子
function showPost(fmID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VTopicContent.aspx?ID=" + fmID, 800, 700);
}