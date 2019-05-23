$(function ()
{
    $("#btnDelegate").click(function ()
    {
        delegateWork();
    });
});

function showWaitDo(url)
{
    var index = url.indexOf('/');
    if (index == 0)
    {
        url = url.substring(index + 1, url.length);
    }
    if (url.indexOf("&JQID=") == -1)
    {
        url += "&JQID=jqGrid"
    }
    else
    {//替换url的JQID参数值

    }
    openWindow("/" + rootUrl + "/" + url, 1000, 800);
}

function delegateWork()
{
    var ids = getJQGridSelectedRowsID("jqGrid", true);
    var status = getJQGridSelectedRowsData("jqGrid", true, "DelegateStatus");
    var clsids = getJQGridSelectedRowsData("jqGrid", true, "CurrentCLSID");
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
    openWindow("/"+rootUrl + "/Common/Personal/Delegate/VWaitWorkDelegateSet.aspx?WaitID=" + ids.join(","), 1000, 600);
}

function renderWorkName(cellvalue, options, rowobject)
{
    var result = rowobject["WorkName"];
    if (rowobject["ModuleIndex"] == "0" && rowobject["WorkIndex"] != "0" && rowobject["WaitType"] != "WaitLook")    // 1成本超标预警2采购计划预警3进度计划预警4工程质量预警5工程安全预警
    {
        var result = "<a clickArgs='{$WorkID}' menu='Delegate|安排拟办,Decompound|处理方案和情况申报,Finish|填报处理情况,Startup|不处理且标为已阅' oncontextmenu=\"showDLMenu(this,'{$Code}');return false;\"  onclick=\"showDLMenu(this,'{$Code}');\" href='javascript:void(0);' menuwidth='150'>" + rowobject["WorkName"] + "</a>";
        //var strCode = para1 == '0' ? '1111' : '1110';
        var strCode = "1111";
        return result.replace("\{$WorkID}\g", rowobject["WorkID"]).replace("\{$Code}\g", strCode);
    }
    else if (rowobject["ModuleIndex"] == "1" && rowobject["WorkIndex"] == "1" && rowobject["WaitType"] != "WaitLook")    // 公司收文
    {
        if (rowobject["WaitType"] == "WaitTransact")
        {     //拟办  操作人 拟办人，操作列 5个操作 送阅 拟办并送阅 转办 转档案室 转档案管理员
            result = "<a clickArgs=\"" + rowobject["WorkID"] + "\"  menu=\"Reader|送阅,DelegateReader|拟办并送阅,Transmit|转办,SaveRoom|转档案室,SaveAdmin|转档案管理员\" oncontextmenu=\"showDLMenu(this,'11111');return false;\"  onclick=\"showDLMenu(this,'11111');\" href=\"javascript:void(0);\" menuwidth=\"150\">" + rowobject["WorkName"] + "</a>";
        }
        if (rowobject["WaitType"] == "WaitSave") //操作人：档案室管理员，操作列 2列  送阅，转存档案室
        {
            result = "<a clickArgs=\"" + rowobject["WorkID"] + "\"  menu=\"Reader|送阅,SaveRoom|转档案室\" oncontextmenu=\"showDLMenu(this,'11');return false;\"  onclick=\"showDLMenu(this,'11');\" href=\"javascript:void(0);\" menuwidth=\"150\">处理</a>";
        }
        return result;
    }
    else
    {
        var url = "";
        try
        {
            url = stringFormat(rowobject["HandleUrl"], rowobject["WorkID"].split(','));
        }
        catch(e)
        {
            return "待办页地址错误！请检查"
        }
        result = stringFormat("<a href=\"javascript:showWaitDo('{1}')\">{0}</a>", rowobject[workNameIndex], url);
        
    }
    return result;
}

function renderWaitTypeName(cellvalue, options, rowobject)
{
    return stringFormat("{1}{0}", rowobject["WaitTypeName"], (rowobject["DelegateStatus"] == "2" ? "<font color=red>委托</font>" : ""));
}

function renderDoneWorkName(cellvalue, options, rowobject)
{
    return stringFormat("<a href=\"javascript:showTitle('{1}')\">{0}</a>", rowobject["CCTitle"], rowobject["BrowseURL"]);
}

function showTitle(url)
{
    openWindow("../../" + url, 1000, 800);
}
function renderCurrentState(cellvalue, options, rowobject)
{
    var currentState;
    switch (rowobject["CurrentState"])
    {
        case "0":
            currentState = "待审核";
            break;
        case "1":
            currentState = "待调整";
            break;
        case "2":
            currentState = "待拆分";
            break;
        case "3":
            currentState = "待会签";
            break;
        case "4":
            currentState = "待处理";
            break;
        case "5":
            currentState = "待归档";
            break;
        case "N":
            currentState = "已取消";
            break;
        case "Y":
            currentState = "审批完成（正式）";
            break;
    }
    return currentState;
}
function renderFlowOption(cellvalue, options, rowobject)
{
    var flowOption;
    switch (rowobject["FlowOption"])
    {
        case "Create":
            flowOption = "已起草";
            break;
        case "Check":
            flowOption = "已审核";
            break;
        case "Adjust":
            flowOption = "已调整";
            break;
        case "Allot":
            flowOption = "已拆分";
            break;
        case "Communicate":
            flowOption = "已会签";
            break;
        case "Deal":
            flowOption = "已处理";
            break;
        case "Save":
            flowOption = "已归档";
            break;
        case "Look":
            flowOption = "已阅读";
            break;
    }
    return flowOption;   
}