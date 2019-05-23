function showMorePublication()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=3E734848-8124-4188-B291-6C4391771981&IDM_CD=0&IDM_ID=F275882A-A9A2-45DE-BB62-2F8388075453", 800, 600);
}

function showPublication(id)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + id, 800, 600);
}

function showMoreProduct()
{
    //            getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=F602560F-3C3A-4FCC-9BA6-9D1B36B72D04&IDM_CD=26&IDM_ID=07782E80-935E-4E44-93B8-F87780C1AD2B";
    openWindow("../../Knowledge/CorpImage/VCorpImage.aspx?CorpID=TotalCompany", 800, 600);
}

function showProduct(id)
{
    openWindow("../../Knowledge/CorpImage/VCorpImage.aspx?CorpID=TotalCompany&ID=" + id, 800, 600);
}

function showPicNews(newsID)
{
    openWindow("../../IDOA/EnCulture/News/VNewsBrowse.aspx?ID=" + newsID, 800, 600);
}

function showMoreModelContract()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=E172AB80-1CA3-4BB1-AE6B-6ADA7F8DF6A7&IDM_CD=16&IDM_ID=5FDA6B89-1B3E-4EC8-A771-B28D217B02AF", 800, 600);
}

function showMoreStandardDoc()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=DDA344A9-A216-4B04-951B-8933776CB6E5&IDM_CD=18&IDM_ID=E3232424-222E-47AC-B1F2-2FE95B89B8D3", 800, 600);
}

function showMoreLearnGarden()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=EB578F63-BFFD-4580-A6F4-278C12A28EB1&IDM_CD=29&IDM_ID=E3232424-222E-47AC-B1F2-2FE95B89B8D3", 800, 600);
}

function showModelContract(id)
{
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + id, 800, 600);
}

function showMorePublicity()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=6116A0ED-BF67-47C5-A7C6-0C06502FDE0A&IDM_CD=60", 800, 600);
}

//查看更多互动公示  add by chenzy on 2014-05-14
function showMoreInteractPublicity()
{
    openWindow("../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=74E328AD-4FBF-45CD-BE78-401A9FF20B6B&IDM_CD=30", 800, 600);
}

function showAssistantWork(index)
{
    var url = "";

    switch (index)
    {
        case 100: //发起流程
            url = "/{0}/Common/Personal/WorkGuide.aspx";
            break;
        case 101: //新建消息
            url = "/{0}/IDOA/IntraMail/VMailWrite.aspx";
            break;
        case 102: //手机短信
            url = "/{0}/OperAllow/Other/Sms/VSmsSend.aspx";
            break;
        case 103: //收件箱
            url = "/{0}/IDOA/IntraMail/VMailReceive.aspx";
            break;
        case 104: //公司通讯录
            url = "/{0}/IDOA/MyWork/MyDirectory/VSoftDirectoryData.aspx";
            break;
        case 105: //待办流程
            url = "/{0}/Home/VTab.aspx?ModID=2BE0873C-4443-4FCF-93C5-2A5BAE5B31CA";
            break;
        case 106: //会议室申请
            url = "/{0}/IDOA/BoardRoom/VBoardroomBookViewByGraphic.aspx";
            break;
        case 107: //跟踪事务
            url = "/{0}/Common/Personal/VCheckContentTrack.aspx?IDM_ID=E8D8A070-AC4B-4ADE-8DC6-AE2AE71B9F6C";
            break;
        case 108: //文档共享
            url = "/{0}/IDOA/InformationIssue/VInformationIssue.aspx?IICID=F1D5F159-E4A9-48D6-99DD-8A47D8E79AD4&IDM_CD=71"
            break;
    }

    if (url != "")
    {
        openWindow(stringFormat(url, rootUrl), 960, 650);
    }
}

function showTitle(url)
{
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    openWindow("../../" + url + "&JQID=jqGrid", 800, 600);
}

function showMoreWaitDo()
{
    openWindow("../../Common/Personal/VWaitAllWork.aspx?WaitDo=1", 800, 600);
}

function showMoreRG()
{
    openWindow("../../IDOA/Bylaw/VRegimeViewFrame.aspx", 800, 600);
}

function showInfo(tbInfoId, morefunc)
{
    var me = $(getEventObj());
    var td = me.closest("td");
    var currentSpan = td.children("span").eq(parseInt(td.attr("cs")))
    var currentTable = $("#" + td.attr("ct"));

    currentSpan.addClass("nav-blur");
    currentTable.hide();

    me.removeClass("nav-blur");
    $("#" + tbInfoId).show();

    td.attr("cs", me.index());
    td.attr("ct", tbInfoId);
    td.attr("mf", morefunc);
}

function showMoreInfo()
{
    var moreFunc = $(getEventObj()).closest("td").attr("mf");
    eval(moreFunc + "()");
}

/*
function Nav()
{
}
Nav.prototype.init = function (obj)
{
    this.nav = obj;
    if (this.nav.length == 0)
    {
        return alert("未找到初始化对象！");
    }

    this.allSpan = this.nav.find("span");

    this.allSpan.each(function ()
    {
        if (this.reltb != "more")
        {
            if ($("#" + this.reltb).length == 0)
            {
                return alert(this.reltb + "表格不存在！");
            }
        }
    });

    this.currentSpan = this.allSpan.eq(0);
    if ($("#" + this.currentSpan.attr("reltb")).length != 0)
    {
        this.currentTable = $("#" + this.currentSpan.attr("reltb"))
    }

    var that = this;
    this.allSpan.click(function ()
    {
        if ($(this).attr("reltb") != "more")
        {
            that.currentSpan.addClass("nav-blur");
            $("#" + that.currentSpan.attr("reltb")).hide();
            $(this).removeClass("nav-blur");
            $("#" + $(this).attr("reltb")).show();
            that.currentSpan = $(this);
        }
        else if ($(this).attr("reltb") == "more")
        {
            if (that.currentSpan.attr("func"))
            {
                eval(that.currentSpan.attr("func") + "()");
            }
        }
    });
}
*/

function windowLoad()
{
    loadDefault();

    // (new Nav()).init($("#tdNav"));
    // (new Nav()).init($("#tdNav2"));

    //提示信息
    $('#divDialog').dialog({
        autoOpen: false,
        width: 320,
        height: 200,
        create: function (event, ui)
        {
            $(this).dialog("option", "title", "消息提示");
        },
        buttons: {
            "取消": function ()
            {
                $("#divDialog").dialog("close");
            }
        }
    });

    $("#span-mail").click(function (e)
    {
        if (!$("#divDialog").dialog("isOpen"))
        {
            $("#divDialog").dialog("open");
        }
        e.stopPropagation();
    });

    $("body").click(function ()
    {
        $("#divDialog").dialog("close");
    });
}

// 刷新两条日程数据
function refreshScheduleInfo(data, textStatus)
{
    $(tdScheduleInfo).html(data);
    $("#tdNav,#tdNav2").css("position", "relative");
}

// 显示更多邮件
function showMoreMail()
{
    getWin().location = "/" + rootUrl + "/Home/VTab.aspx?ModID=BDA72E03-49C7-4253-81DC-73597B120954";
}
