function renderReqeustName(cellvalue, options, rowobject)
{
    if (rowobject["CurrentState"] == "R" || rowobject["CurrentState"] == "D")
    {
        return cellvalue;
    }
    var url = stringFormat(rowobject["BrowseURL"], rowobject["KeyID"].split(','));
    return stringFormat("<a href=\"javascript:showTitle('{1}')\">{0}</a>", rowobject["RequestName"], url);
}

function renderDoneTypeName(cellvalue, options, rowobject)
{
    var name = "";
    switch (rowobject["DoneType"])
    {
        case "Add":
        case "DoneCreate":
            name = "已起草";
            break;
        case "DoneCheck":
            name = "已审核";
            break;
        case "DoneAdjust":
            name = "已调整";
            break;
        case "DoneAllot":
            name = "已拆分";
            break;
        case "DoneCommunicate":
            name = "已会签";
            break;
        case "DoneDeal":
            name = "已处理";
            break;
        case "DoneSave":
            name = "已归档";
            break;
        case "DoneTachChange":
            name = "变更审核人";
            break;
    }
    return name;
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
        case "R":
            currentState = "已撤销";
            break;
        case "D":
            currentState = "已彻底删除";
            break;
    }
    return currentState;
}