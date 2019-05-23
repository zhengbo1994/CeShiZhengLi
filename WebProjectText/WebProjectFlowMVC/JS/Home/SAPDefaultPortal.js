// JScript 文件
$(function ()
{
    //日程刷新
    //    loadSchedule();

    //“更多”click事件绑定 
    $("span.zmqMore").click(function ()
    {
        var spanID = this.id;

        switch (spanID)
        {
            case "spanMngSta": //管理规范
                openWindow("/"+rootUrl+"/IDOA/InformationIssue/VInformationIssue.aspx?IICID=18242412-02D3-405C-B28C-B6C93BAC6C5C&IDM_CD=7&IDM_ID=D37B9A56-CE49-4C02-982F-4519653B08CF", 800, 600);
                break;
            case "spanSelfIntr": //自我介绍
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=CDC30FEA-1C77-4F0D-A17C-B808089BFB5D&IDM_CD=9&IDM_ID=833439B9-A25B-450C-B805-3A1942976FC1", 800, 600);
                break;
            case "spanProjectMng": //项目管理通告
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=BC04C3D5-0700-40BC-A9A1-99214DC8E493&IDM_CD=4&IDM_ID=274603C4-356E-43D7-B4CE-654B5743787C", 800, 600);
                break;
            case "spanRPsh": //奖惩表彰
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=A4FCCA2A-E3D8-4452-8674-576414EDF1FA&IDM_CD=8&IDM_ID=81813A68-6D63-4671-98BE-5AC357CDAE7D", 800, 600);
                break;
            case "spanMarketNotice": //市场通告
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=841CB5EC-F344-4B7F-A221-0355285FE9AC&IDM_CD=5&IDM_ID=70119972-2D11-429E-8A65-AFC4C46F5810", 800, 600);
                break;
            case "spanSchedule": //日程安排
                getWin().location = "/" + rootUrl + "/IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx";
                break;
            case "spanBullentin": //事务通告
                //                getWin().location = "/"+rootUrl+"/IDOA/EnCulture/Bulletin/VBulletin.aspx";
                openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletin.aspx", 800, 600);
                break;
            case "spanNews": //内部新闻
                //                getWin().location = "../IDOA/EnCulture/News/VNews.aspx";
                openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNews.aspx", 800, 600);
                break;
            case "spanLinks": //友情链接
                openWindow("/" + rootUrl + "/IDOA/EnCulture/VFriendURL.aspx", 800, 600);
                break;
            case "spanKdg": //知识问答
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=3F51C6F9-E7DD-4296-94E7-D7FC0BEA7167&IDM_CD=19&IDM_ID=8DCA7DB7-37E1-4D60-821C-71F4DAD52776", 800, 600);
                break;
        }
    });

    //每条数据的click事件绑定
    $("div.zContent a").click(function ()
    {
        var strHref = this.href.split("#")[1];

        switch (strHref)
        {
            case "MngSta":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=7&IDM_ID=D37B9A56-CE49-4C02-982F-4519653B08CF", 800, 600);
                break;
            case "SelfIntr":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=9&IDM_ID=833439B9-A25B-450C-B805-3A1942976FC1", 800, 600);
                break;
            case "ProjectMng":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=4&IDM_ID=274603C4-356E-43D7-B4CE-654B5743787C", 800, 600);
                break;
            case "RPsh":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=8&IDM_ID=81813A68-6D63-4671-98BE-5AC357CDAE7D", 800, 600);
                break;
            case "MarketNotice":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=5&IDM_ID=70119972-2D11-429E-8A65-AFC4C46F5810", 800, 600);
                break;
            case "KdgQA":
                openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + this.id + "&IDM_CD=19&IDM_ID=8DCA7DB7-37E1-4D60-821C-71F4DAD52776", 800, 600);
                break;
            case "Bulletin":
                openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + this.id, 800, 600);
                break;
            case "News":
                openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + this.id, 800, 600);
                break;
            case "Links":
                window.open(this.id, '_blank');
                break;
        }
    });

    //隐藏最后一条数据下边框
    $(".zContent table").each(function ()
    {
        $(this).find("tr:last td").css("border-bottom", "none");
    });
});

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


