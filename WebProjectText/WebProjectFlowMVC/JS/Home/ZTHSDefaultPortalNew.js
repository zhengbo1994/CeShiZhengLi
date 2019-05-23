$(function ()
{
    //知识内容块
    var $divKM1 = $("#divKM1");
    var $divKM2 = $("#divKM2");
    var $tdKM1 = $("#tdKM1");
    var $tdKM2 = $("#tdKM2");
    $("#tdKM1,#tdKM2").click(function ()
    {
        this.id == "tdKM1" ? ($tdKM1.removeClass("td_blur").addClass("td_focus") && $divKM1.show() && $divKM2.hide()) : ($divKM1.hide() && $divKM2.show());
        $(this).removeClass("td_blur").addClass("td_focus");
        if (this.id == "tdKM1")
        {
            $tdKM1.removeClass("td_blur").addClass("td_focus");
            $tdKM2.removeClass("td_focus").addClass("td_blur");
            $divKM1.show();
            $divKM2.hide();
        }
        else
        {
            $tdKM2.removeClass("td_blur").addClass("td_focus");
            $tdKM1.removeClass("td_focus").addClass("td_blur");
            $divKM1.hide();
            $divKM2.show();
        }
    });

    //公告、制度内容块
    var $tbBulletin = $("#tbBulletin");
    var $tbRegime = $("#tbRegime");
    var $selectIden = $(".select-iden");
    $("span.content-title").click(function ()
    {
        if (this.className && this.className.indexOf("title_tulletin") != -1)
        {
            $tbBulletin.show();
            $tbRegime.hide();
            $selectIden.css("left", -200);
        }
        else if (this.className && this.className.indexOf("title_bylaw") != -1)
        {
            $tbBulletin.hide();
            $tbRegime.show();
            $selectIden.css("left", -80);
        }
    });

    $("#bulletin-more").click(function ()
    {
        if ($tbBulletin.is(":visible"))
        {
            showMoreBulletin();
        }
        else if ($tbRegime.is(":visible"))
        {
            showMoreRegime();
        }
    });

    //内刊
    $('.nk-box').mySlider({
        speed: 300,
        switchTime: 5,
        direction: 'left',
        prevClass: 'slider-prev',
        nextClass: 'slider-next',
        wrapperClass: 'slider-wrapper',
        moveClass: 'slider-move'
    });

    //亮点点击
    $(".bs-box").mySlider({
        speed: 300,
        switchTime: 5,
        direction: 'left',
        prevClass: 'slider-prev',
        nextClass: 'slider-next',
        wrapperClass: 'slider-wrapper',
        moveClass: 'slider-move'
    });

    //生日
    $('.birth-box').mySlider({
        speed: 300,
        switchTime: 5,
        direction: 'left',
        wrapperClass: 'slider-wrapper',
        moveClass: 'slider-move',
        titleClass: 'slider-title'
    });

    //生日为空时
    if ($(".birth-box li").length == 0)
    {
        $(".birth-box .slider-move").append("<li><img src='../../Image/home/ZTHS-birthday.jpg' style='width: 130px; height: 200px' /></li>");
    }

    //生日
    $('.mh-box').mySlider({
        speed: 300,
        switchTime: 5,
        direction: 'left',
        wrapperClass: 'slider-wrapper',
        moveClass: 'slider-move'
    });

    //论坛换页
    var iPageIndex = 1;
    var iRowCount = 0;

    var bIsGetBBSData = false;
    $("#tdBBS").mouseover(function ()
    {
        if (iPageIndex === 1)
        {
            $(".bbs-prev").attr("title", "当前为第一页");
        }
        else
        {
            $(".bbs-prev").attr("title", "上一页")
        }

        if (iPageIndex === Math.ceil(iRowCount / 8))
        {
            $(".bbs-next").attr("title", "当前为最后一页");
        }
        else
        {
            $(".bbs-next").attr("title", "下一页");
        }

        $(".bbs-prev,.bbs-next").css("display", "block");

    }).mouseout(function ()
    {
        $(".bbs-prev,.bbs-next").hide();
    });

    $(".bbs-btn").click(function ()
    {
        if (bIsGetBBSData)
        {
            return "正在获取数据...";
        }

        bIsGetBBSData = true;

        if (this.className.indexOf("bbs-prev") != -1 && iPageIndex === 1 || this.className.indexOf("bbs-next") != -1 && iPageIndex === Math.ceil(iRowCount / 8))
        {
            bIsGetBBSData = false;
            return;
        }

        var query = { AjaxRequest: true, PageIndex: (this.className.indexOf("bbs-prev") != -1 ? (iPageIndex - 1) : (iPageIndex + 1)), PageSize: 8, Aim: "GetBSS" };
        var that = this;
        ajaxRequest("/" + rootUrl + "/Home/Custom/ZTHSDefaultPortalNew.aspx", query, "json", function (data)
        {
            if (data.Success == "Y")
            {
                $("#divBBS").html(data.Data);
                iRowCount = parseInt(data.Others[0], 10);
                iPageIndex = (that.className.indexOf("bbs-prev") != -1 ? (iPageIndex - 1) : (iPageIndex + 1));
                bIsGetBBSData = false;
            }
            else
            {
                alert(data.Data);
            }
        });
    });
});
//会议纪要
function showMoreMeeting()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=7C8C9BA6-2337-4FB3-A566-4C48C66B5C30&IDM_CD=5&IDM_ID=7EEBC3BF-2D08-49FA-99D9-AB91C1A5853D", 0, 0);
}

function showMeeting(id)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + id, 800, 600);
}
//知识管理
function showMoreKnowledge()
{
    window.open("../../Knowledge/Archives/KnowledgeIndex.aspx", '_blank', 'resizable=1,status=1,scrollbars=1,width=800,height=600,location=1')
}

//内刊更多
function showMoreNK()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowseMap.aspx?IICID=3E734848-8124-4188-B291-6C4391771981&IDM_CD=0&IDM_ID=F275882A-A9A2-45DE-BB62-2F8388075453&CorpID=TotalCompany", 0, 0);
}

//亮点点击更多
function showMoreBrightSpot()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowseMap.aspx?IICID=72ACDF58-BF93-4902-9685-8CA121AF4FB8&IDM_CD=65&IDM_ID=2D316EC9-AAD9-4397-B76D-73F821F77E19&CorpID=TotalCompany", 0, 0);
}

//光荣榜
function showMoreHR()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=9013717E-2FEC-4CA7-BA9D-38A4C0B1D29D&IDM_CD=62", 0, 0);
}

//培训地图
function showMoreTM()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowseMap.aspx?IICID=4C167E99-6E6F-47BE-A5EA-0A08EDB0DBA3&IDM_CD=63&CorpID=TotalCompany", 0, 0);
}

//样板房
function showMoreMH()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssuePicMapZTHS.aspx?IICID=8B106DBF-3FE1-4A26-99C9-C4FAAD6241E5&IDM_CD=61", 0, 0);
}

function showNK(id)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + id, 800, 600);
}

function showPicNews(newsID)
{
    openWindow("../../IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

function showKnowledge(id)
{
    openWindow("../../Knowledge/Archives/KnowledgeListOther.aspx?id=" + id, 800, 600);
}

// 查看公告
function showBulletin(bullID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletinBrowse.aspx?ID=" + bullID, 800, 600);
}

// 显示更多公告
function showMoreBulletin()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/Bulletin/VBulletin.aspx", 800, 600);
}

// 查看新闻
function showNews(newsID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

// 显示更多新闻
function showMoreNews()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/News/VNews.aspx", 800, 600);
}


// 写邮件
function wirteMail()
{
    openWindow("/" + rootUrl + "/IDOA/IntraMail/VMailWrite.aspx", 800, 600);
}

// 显示更多邮件
function showMoreMail()
{
    openWindow("/" + rootUrl + "/IDOA/IntraMail/VMailReceive.aspx", 800, 600);
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

// 新建帖子
function writePost()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VForumMyTopic.aspx", 800, 600);
}

// 进入帖子
function showMorePost()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VForumMainBrowse.aspx", 800, 600);
}

// 查看帖子
function showPost(fmID)
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/bbs/VTopicContent.aspx?ID=" + fmID, 800, 700);
}

// 显示更多制度
function showMoreRegime()
{
    openWindow("/" + rootUrl + "/IDOA/Bylaw/VRegimeViewFrame.aspx", 800, 600);
}
//查看制度
function showRegime(BID, check, BIID)
{
    openWindow("/" + rootUrl + "/IDOA/Bylaw/VRegimeViewBrowse.aspx?BID=" + BID + "&BIID=" + BIID, 800, 600);
}

//应用链接
function showMoreLink()
{
    openWindow("/" + rootUrl + "/IDOA/EnCulture/VFriendURL.aspx", 800, 600);
}

function showLink(strAction)
{
    if (typeof strAction === "string" && strAction)
    {
        var linkOption = {
            "PM": "http://125.64.16.14/SQSOFT/Web/index.aspx?CorpSynchCode=c807bdc5-976c-4e7a-90d6-bed3cb6b7f12", //物业管理系统
            "CRM": "../../Common/Private/VSSOJump.aspx?SSOCID=4E214428-C32D-457A-A620-EC81F3F71A88", //销售管理系统
            "HOUSE": "https://passport.yunxuetang.cn/ssl/login.htm?h=crcehs.yunxuetang.cn&o=fc4b408e-07fc-493b-b072-ec488bc0eb3e",
            "HR": "../../Common/Private/VSSOJump.aspx?SSOCID=A08F6D4F-3B10-4B4B-A721-8C2B719F4BA7",
            "EBOOK": "../../Common/Private/VSSOJump.aspx?SSOCID=06817397-0202-4887-AF1C-659FB3DC150A"
        }

        if (linkOption[strAction.toUpperCase()])
        {
            window.open(linkOption[strAction.toUpperCase()], '_blank', 'resizable=1,status=1,scrollbars=1,width=800,height=600,location=1')
        }
    }
}

