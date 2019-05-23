// JScript 文件

// 设置模块名称
function showModName(cellvalue, options, rowobject)
{
    var modName = "";
    var ddlFlowMod = getObj("ddlFlowMod");
    for (var i = 0; i < ddlFlowMod.length; i++)
    {
        var opt = ddlFlowMod.options[i];
        if (opt.value == cellvalue)
        {
            modName = opt.text;
            break;
        }
    }

    return modName;
}

// 设置表名称
function showTableName(cellvalue, options, rowobject)
{
    return '<a href="#ShowSysTable" onclick="showSysTable(this,\'' + options.rowId.split('-')[0] + '\',\'' + rowobject[2] + '\')">' + cellvalue +'</a>';
}

// 表类型
function showTableType(cellvalue, options, rowobject)
{
    return (cellvalue.toString().toLowerCase() == "true" ? "主表" : "明细表");
}

// 查看系统表
function showSysTable(aHref, tbName, tbType)
{
    openWindow("VFormSysTableBrowse.aspx?Name=" + encode(aHref.innerText, 1) + "&Type=" + tbType + "&Cols=" + encode(tbName, 1), 400, 500);
}

// 加载数据
function reloadData()
{
    var values = $("#ddlFlowMod").val().split("-");
    var docType = values[0];
    var modCode = values.length > 1 ? values[1] : "";

    var query = {'DocType':docType, 'ModCode':modCode, 'KW':$("#txtKW").val()};

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}