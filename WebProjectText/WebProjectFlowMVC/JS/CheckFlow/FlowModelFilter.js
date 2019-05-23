// JScript 文件

// 条件项类型
function showType(cellvalue, options, rowobject)
{
    var type = "";
    if (cellvalue == "1")
    {
        type = "数字";
    }
    else if (cellvalue == "2")
    {
        type = "百分比";
    }

    return type;
}

// 启用状态
function showEnabled(cellvalue, options, rowobject)
{
    return (cellvalue.toString().toLowerCase() == "true" ? "启用" : "不启用");
}

// 设置条件项
function showColSet(cellvalue, options, rowobject)
{
    var values = $("#ddlFlowMod").val().split("-");
    var enabledValue = !(rowobject[3].toLowerCase() == "true");
    var enabledText = enabledValue ? "启用" : "停用";
    var colType = rowobject[1] == "1" ? "2" : "1";
    var colTypeText = colType == "1" ? "数字" : "百分比";
    var url = "'VFlowModelFilterOperator.aspx?DocType=" + values[0] + "&ModCode=" + values[1] + "&ColName=" + options.rowId + "'";
    var cellhtml = '<a href="javascript:openWindow(' + url + ',500,300)">操作符</a>'
        + ' <a href="javascript:setColEnabled(\'' + options.rowId + '\',' + rowobject[1] + ',' + enabledValue + ')">' + enabledText +'</a>';
    if (inValues(options.rowId, "ContractAmountOverrun", "ChangeCostOverrun", "BAMonthPayOverrun", "BAYearPayOverrun", 'TotalLocalityChangeRate', 'TotalDesignChangeRate'))
    {
        cellhtml += ' <a href="javascript:setColEnabled(\'' + options.rowId + '\',' + colType + ',' + !enabledValue + ')">' + colTypeText + '</a>';
    }
    return cellhtml;
}

// 设置操作符
function showOptSet(cellvalue, options, rowobject)
{
    var enabledValue = !(rowobject[3].toLowerCase() == "true");
    var enabledText = enabledValue ? "启用" : "停用";
    return '<a href="javascript:setOptEnabled(\'' + options.rowId + '\',' + enabledValue + ')">' + enabledText +'</a>';
}

// 设置条件项启用
function setColEnabled(colName, colType, isEnabled)
{
    var values = $("#ddlFlowMod").val().split("-");
    
    ajaxRequest("FillData.ashx", {"action":"SetFMFilterEnabled","DocType":values[0],"ModCode":values[1],"ColName":colName,"ColType":colType,"IsEnabled":isEnabled,"Title":document.title}, "text", refreshColData);
}

// 设置操作符启用
function setOptEnabled(oCode, isEnabled)
{
    var docType = getParamValue("DocType");
    var modCode = getParamValue("ModCode");
    var colName = getParamValue("ColName");
    
    ajaxRequest("FillData.ashx", {"action":"SetFMFilterEnabled","DocType":docType,"ModCode":modCode,"ColName":colName,"OCode":oCode,"IsEnabled":isEnabled,"Title":document.title}, "text", refreshOptData);
}

// 设置成功后刷新条件项列表
function refreshColData(data, textStatus)
{
    if (data == "Y")
    {
        reloadData();
    }
    else
    {
        alert(data);
    }
}

// 设置成功后刷新操作符列表
function refreshOptData(data, textStatus)
{
    if (data == "Y")
    {
        refreshJQGrid("jqGrid1");
        if (opener && opener.reloadData)
        {
            opener.reloadData();
        }
    }
    else
    {
        alert(data);
    }
}

function reloadData()
{
    var values = $("#ddlFlowMod").val().split("-");

    var query = {'DocType':values[0], 'ModCode':values[1]};

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}