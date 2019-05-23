function showTitle(url)
{
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    openWindow("../../" + url + "&JQID=jqGrid", 1000, 800);
}
function showWaitDo(url)
{
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    openWindow("../../" + url + "&JQID=jqGrid", 1000, 800);
}

function reloadData()
{
    $("#jqGrid").getGridParam("postData").WaitType = $("#hidWorkType").val() == "" ? $("#ddlWaitType").val() : $("#hidWorkType").val();
    $("#jqGrid").getGridParam("postData").ModID = $("#ddlWaitModule").val();
    $("#jqGrid").getGridParam("postData").KeyWord = $("#txtKeyWord").val();
    //为横帮定制待办到达时间 20140403 add by 陈毓孟
    if ('<%=IDCommon.CommonFuns.GetUser().PublishCompany%>' == "LSHB" && $("#ddlWaitModule").val() == "4_12")
    {
        $("#jqGrid").showCol("CreateDate");
        $("#jqGrid").hideCol("UrgencyName");
        $("#jqGrid").hideCol("FlowTypeName");
        $("#jqGrid").hideCol("FlowName");
    }
    else
    {
        $("#jqGrid").hideCol("CreateDate");
        $("#jqGrid").showCol("UrgencyName");
        $("#jqGrid").showCol("FlowTypeName");
        $("#jqGrid").showCol("FlowName");
    }
    refreshJQGrid('jqGrid');
}

//重写customGridComplete，jqGrid加载完成后，若待办数量变化，则刷新左侧待办列表树
function customGridComplete()
{
    refreshWaitWorkTree("jqGrid",theme);
    // 设置状态显隐
    SetIsPressedDoDisplay();
}

// 设置状态显隐add by zhangmq 20150402
function SetIsPressedDoDisplay()
{
    if ($("#jqGrid").find("img.pressDo").length > 0)
    {
        $("#jqGrid").showCol("IsPressedDo");
    }
    else
    {
        $("#jqGrid").hideCol("IsPressedDo");
    }
}

function changeFlowModel(span)
{
    var tr = span.parentNode;
    var table = tr.parentNode.parentNode;
    var img = getTGImg(table, tr.rowIndex, span.cellIndex);
    if (tr)
    {
        reloadData();
        //if (tr.id != "0" && tr.id.indexOf(".") == -1)
        //{
        //    img.click();
        //}
        //else
        //{
        //    reloadData();
        //}
    }
}

function delegateWork()
{
    var ids = getJQGridSelectedRowsID("jqGrid", true);
    var status = getJQGridSelectedRowsData("jqGrid", true, "DelegateStatus");
    var clsids = getJQGridSelectedRowsData("jqGrid", true, "CurrentCLSID");
    if (ids.length < 1)
    {
        return alertMsg("没有选中任何记录。");
    }
    if (ids.length > 50)
    {
        return alertMsg("一次不能选择超过50个工作事项。");
    }
    if (clsids && clsids.length > 0)
    {
        for (var i = 0; i < clsids.length; i++)
        {
            if (clsids[i] == " " || clsids[i].length == 0)
                return alertMsg("存在非审批流程的工作事项，不允许委托。");
        }
    }
    if (status && status.length > 0)
    {
        for (var j = 0; j < status.length; j++)
        {
            if (status[j] == "2")
                return alertMsg("存在代理工作未处理，不允许再次委托。");
        }
    }
    openWindow("Delegate/VWaitWorkDelegateSet.aspx?WaitID=" + ids.join(","), 1000, 600);
}
function clickMenu()
{
    var args = arguments;
    var key = args[0];
    var sJEWID = args[1];
    var url = '';
    switch (key)
    {
        case "Startup": //不处理，标为已阅 
            openWindow("../../BI/JobEarlyWarning/VReadJobEarlyWarning.aspx?JQID=jqGrid&IsHandler=Y&JEWID=" + sJEWID, 400, 300);
            break;
        case "Decompound": //处理方案和情况申报
            openWindow("../../BI/JobEarlyWarning/VHandleProgramRequest.aspx?JQID=jqGrid&JEWID=" + sJEWID, 950, 700);
            break;
        case "Delegate": //安排拟办
            openWindow("../../BI/JobEarlyWarning/VArrangeExecuteEarlyWarning.aspx?JQID=jqGrid&JEWID=" + sJEWID, 500, 350);
            break;
        case "Finish": //填报处理情况           
            openWindow("../../BI/JobEarlyWarning/VWriteHandleReport.aspx?JQID=jqGrid&JEWID=" + sJEWID, 500, 350);
            break;
            ///// 公司收文的         
        case "Reader": //送阅
            openWindow("../../IDOA/CheckDoc/VReceDocAddReader.aspx?JQID=jqGrid&Type=Add&ADID=" + sJEWID, 500, 350);
            break;
        case "DelegateReader": //拟办并送阅
            openWindow("../../IDOA/CheckDoc/VReceDocAddReader.aspx?JQID=jqGrid&Type=Send&ADID=" + sJEWID, 500, 350);
            break;
        case "Transmit": //转办
            openWindow("../../IDOA/CheckDoc/VMyCheckDocAdd.aspx?JQID=jqGrid&ADID=" + sJEWID, 900, 700);
            break;
        case "SaveRoom": //转档案室
            openWindow("../../IDOA/CheckDoc/VWaitReceDocSave.aspx?JQID=jqGrid&ADID=" + sJEWID, 500, 550);
            break;
        case "SaveAdmin": //转档案管理员
            openWindow("../../IDOA/CheckDoc/VWaitReceDocSendAdmin.aspx?JQID=jqGrid&ADID=" + sJEWID, 800, 600);
            break;
    }
}
//打开批量阅读窗口 edit by xiaoyb 添加JQID参数 2014-04-19
function btnLookList_Click()
{
    var url = "../../" + getFormatUrl(getObj('hidLookListURL').value);
    url = addUrlParam(url, "JQID", "jqGrid");
    openWindow(url, 800, 600);
}
//批量归档 edit by xiaoyb 添加JQID参数 2014-04-19
function btnSaveList_Click()
{
    var url = "../../" + getFormatUrl(getObj('hidSaveListURL').value);
    url = addUrlParam(url, "JQID", "jqGrid");
    openWindow(url, 800, 600);
}
//格式Url 去掉/，统一
function getFormatUrl(url)
{
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    return url;
}
//打开邮件更新页面状态
function link(url)
{
    openWindow("../../" + url, 800, 700);
    reloadData();
}

$(function ()
{
    $("#jqGrid").on("click", ".pressDo", function (event)
    {
        var waitID = $(this).attr("waitid"),
            title = $(this).closest("tr").find("td[aria-describedby='jqGrid_WorkName']").attr("title");

        if (waitID)
        {
            ajax("VWaitAllWork.aspx", { WaitID: waitID, Action: "GetPressDoRecord" }, "json", function (data)
            {
                if (data.Success == "Y")
                {
                    showDialog({ "title": "催办明细（" + title + "）", "html": data.Data, width: 550, height: 400 });
                }
                else
                {
                    alert(data.Data);
                }
            });
        }

        event.preventDefault();
        return false;
    });
});