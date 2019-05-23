// VFormSelTable.aspx用到的js

// 新增
function addFormSelTable()
{
    openAddWindow("VFormSelTableAdd.aspx", 450, 420, "jqGrid1");
}

// 修改
function editFormSelTable()
{
    openModifyWindow("VFormSelTableEdit.aspx", 450, 420, "jqGrid1")
}

// 删除
function delFormSelTable()
{
    openDeleteWindow("FormSelTables", 0, "jqGrid1");
}

// 选择表名称
function showTableTitle(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="showSelTable(\'' + options.rowId + '\')">' + cellvalue + '</a>'
}

// 查看选择表
function showSelTable(selTId)
{
    openWindow("VFormSelTableBrowse.aspx?SelTID=" + selTId, 450, 420);
}

// 刷新数据
function reloadData()
{
    addParamsForJQGridQuery("jqGrid1",[{"KW":$("#txtKW").val()}]);
    
    refreshJQGrid("jqGrid1");    
}


// VFormSelTableAdd.aspx、VFormSelTableEdit.aspx用到的js

// 检查文本框输入的字节数（重写，不替换单引号）
function checkSize(txt, size)
{
    if (txt.value.replace(/[^\x00-\xff]/g, '**').length <= size)
    {
        return false;
    }
    
    txt.value = getStringByLength(txt.value, size, false);
}

// 提交校验
function validateSize()
{
    handleBtn(false);
    if (getObj("txtTableTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("选择表名称不能为空。", getObj("txtTableTitle"));
    }
    var ddlDBName = getObj("ddlDBName");
    var ddlTableName = getObj("ddlTableName");
    var ddlValueColName = getObj("ddlValueColName");
    var ddlTextColName = getObj("ddlTextColName");
    if (ddlDBName && ddlDBName.value == "")
    {
        handleBtn(true);
        return alertMsg("请选择一个数据库。", ddlDBName);
    }
    if (ddlTableName && ddlTableName.value == "")
    {
        handleBtn(true);
        return alertMsg("请选择一个数据表/视图。", ddlTableName);
    }
    if (ddlValueColName && ddlValueColName.value == "")
    {
        handleBtn(true);
        return alertMsg("请选择一个值列。", ddlValueColName);
    }
    if (ddlTextColName && ddlTextColName.value == "")
    {
        handleBtn(true);
        return alertMsg("请选择一个文本列。", ddlTextColName);
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled("btnSaveOpen,btnSaveClose", enabled);
}


// VFromSelTableBrowse.aspx用到的js

// 查看模式下切换选项卡
function showBrowseTab(index)
{
    selectTab(index, "SelTable");
                
    for (var i = 0; i < 2; i++)
    {
        if (i != index)
        {
            getObj("info" + i).style.display = "none";
        }
    }
    
    getObj("info" + index).style.display = "";
}