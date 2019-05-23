
//切换快速入口/友情链接
$(function ()
{
    var $trTD = $("#trTD").find("td");
    var $tdDiv = $("#tdDiv>div");
    $trTD.each(function (i)
    {
        $(this).dblclick(function ()
        {
            switch (i)
            {
                case 1:
                    openWindow("/" + rootUrl + "/IDOA/EnCulture/VFriendURL.aspx", 800, 600);
                    break;
            }
        });
    });

    $("span.tab-span").click(function ()
    {
        if ($(this).attr("isfocus") == "N")
        {
            $("#" + $(this).siblings().attr("reltb")).hide();
            $("#" + this.reltb).show();
            $(this).attr("isfocus", "Y").removeClass("tag-focus");
            $(this).siblings().addClass("tag-focus").attr("isfocus", "N");
        }
    }).mouseover(function ()
    {
        if ($(this).attr("isfocus") != "Y")
        {
            $(this).removeClass("tag-focus");
        }
    }).mouseout(function ()
    {
        if ($(this).attr("isfocus") != "Y")
        {
            $(this).addClass("tag-focus");
        }
    });

    $("span.tag-more").click(function ()
    {
        var moreLink =
                {
                    tbBulletin: "/IDOA/EnCulture/Bulletin/VBulletin.aspx",
                    tbMeeting: "/IDOA/InformationIssue/VInformationIssue.aspx?IICID=E7A1E42A-BB0A-4E30-BFC1-94C3DCD8667A&IDM_CD=13&IDM_ID=7CEDDD55-BE0E-45A4-B08C-86C18DC7D7AB",
                    tbWaitDo: "/Common/Personal/VWaitAllWork.aspx?WaitDo=1",
                    tbCheckTrack: "/Common/Personal/VCheckContentTrack.aspx?IDM_ID=E8D8A070-AC4B-4ADE-8DC6-AE2AE71B9F6C",
                    tbNews: "/IDOA/EnCulture/News/VNews.aspx",
                    tbBBS: "/IDOA/EnCulture/bbs/VForumMainBrowse.aspx"
                }
        var relTable = $(this).closest("tr").find("span.tab-span[isfocus='Y']").attr("reltb");
        openWindow("/" + rootUrl + moreLink[relTable], 0, 0);
    });
});

function windowLoad() { loadDefault(); }
//接收待办工作的响应
//remindWorks --参见WorkName.js的定义 
var timerWebMail;

function triggerRemindUpdate(remindWorks)
{
    if (remindWorks.CallbackHtml)
    {
        $('#tbMarqueeRemind').html(remindWorks.CallbackHtml);
    }
}

//显示更多
function showMoreWaitDo()
{
    openWindow('../../Common/Personal/VWaitWork.aspx?WaitDo=1', 400, 700);
}

//点击待办后的响应
function remindClickCallback(url)
{
    url = stringFormat("/{0}/" + url, rootUrl);
    openWindow(url, 960, 650);
}

function showCheckTrack(url)
{
    openWindow("/" + rootUrl + "/" + url, 800, 600);
}

function showMeeting(strIIID)
{
    openWindow("/" + rootUrl + "/IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + strIIID, 800, 600);
}

function showWaitDo(url, id)
{
    url = url.replace(/\{(\d+)\}/g, function (i, h) { return id.split(",")[h] });
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    openWindow("/" + rootUrl + "/" + url + "&JQID=jqGrid", 800, 600);
}

function showShortcuts(url)
{
    openWindow("/" + rootUrl + "/" + url, 800, 600);
}

//友情链接
function showLink(url)
{
    window.open(url, '_blank');
}