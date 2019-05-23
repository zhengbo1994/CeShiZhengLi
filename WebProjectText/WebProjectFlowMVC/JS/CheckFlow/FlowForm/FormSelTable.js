// VFormSelTable.aspx用到的js

// 新增
function addFormSelTable()
{
    openAddWindow("VFormSelTableAdd.aspx", 450, 450, "jqGrid1");
}

// 修改
function editFormSelTable()
{
    var types = getJQGridSelectedRowsData("jqGrid1", true, "IsFromDB");
    for (var i = 0; i < types.length; i++)
    {
        if (types[i].toLowerCase() == "true")
        {
            return alertMsg("不能修改系统选择表。");
        }
    }
    
    openModifyWindow("VFormSelTableEdit.aspx", 450, 450, "jqGrid1")
}

// 删除
function delFormSelTable()
{
    var types = getJQGridSelectedRowsData("jqGrid1", true, "IsFromDB");
    for (var i = 0; i < types.length; i++)
    {
        if (types[i].toLowerCase() == "true")
        {
            return alertMsg("不能删除系统选择表。");
        }
    }

    openDeleteWindow("FormSelTables", 0, "jqGrid1");
}

// 切换选择表类型
function changeTableType()
{
    setBtnEnabled("btnAdd,btnEdit,btnDel", $("#ddlIsFromDB").val() != "1");
}

// 选择表类型
function showIsFromDB(cellvalue, options, rowobject)
{
    return cellvalue.toLowerCase() == "true" ? "系统选择表" : "自定义选择表";
}

// 选择表名称
function showTableTitle(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="showSelTable(\'' + options.rowId + '\')">' + cellvalue + '</a>'
}

// 查看选择表
function showSelTable(selTId)
{
    openWindow("VFormSelTableBrowse.aspx?SelTID=" + selTId, 450, 450);
}

// 刷新数据
function reloadData()
{
    addParamsForJQGridQuery("jqGrid1",[{"IsFromDB":$("#ddlIsFromDB").val(), "KW":$("#txtKW").val()}]);
    
    refreshJQGrid("jqGrid1");    
}


// VFormSelTableAdd.aspx、VFormSelTableEdit.aspx用到的js

// 提交校验
function validateSize()
{
    handleBtn(false);
    if (getObj("txtTableTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("选择表名称不能为空。", getObj("txtTableTitle"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    if (tbValues.rows.length < 2)
    {
        handleBtn(true);
        return alertMsg("选择项不能为空。", getObj("btnAdd"));
    }
    var jsonDatas = [];
    for (var i = 1; i < tbValues.rows.length; i++)
    {
        var chk = getObjTC(tbValues, i, 0, "input", 0);
        var txtValue = getObjTC(tbValues, i, 1, "input", 0);
        var txtRemark = getObjTC(tbValues, i, 2, "input", 0);
        if (txtValue.value == "")
        {
            handleBtn(true);
            return alertMsg("第" + i + "行的选择项不能为空。", txtValue);
        }
        jsonDatas.push({"ValueID":chk.value, "ValueName":txtValue.value, "Remark":txtRemark.value});
    }
    getObj("hidValues").value = $.jsonToString(jsonDatas);
    
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled("btnSaveOpen,btnSaveClose", enabled);
}

// 新增明细(opt：0:新增/1:修改)
function addValue(tbValues, opt)
{
    var arrDatas = [];
    if (opt)
    {
        arrDatas = $.stringToJSON($("#hidValues").val());
    }
    else
    {
        arrDatas.push({"ValueID":"", "ValueName":"" ,"Remark":""});
    }
    for (var i = 0; i < arrDatas.length; i++)
    {
        var row = tbValues.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, arrDatas[i].ValueID);
        cell.align = "center";
        
        cell = row.insertCell(1);
        cell.innerHTML = getTextBoxHtml(null, 200, null, null, arrDatas[i].ValueName);
      
        cell = row.insertCell(2);
        cell.innerHTML = getTextBoxHtml(null, 1000, null, null, arrDatas[i].Remark);

        cell = row.insertCell(3);
        cell.innerHTML = '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveValue(1)" onfocus="this.blur()" title="上移" style="margin-right:0">∧</button> \n'
            + '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveValue(0)" onfocus="this.blur()" title="下移" style="margin-right:0">∨</button>'
        cell.align = "center";
        
        setRowAttributes(row);
    }
}

// 删除明细
function delValue(table)
{
    deleteTableRow(table);
    setTableRowAttributes(table);
}

// 上下移动行
function moveValue(isUp)
{
    var row = getEventObj("tr");
    var table = getParentObj(row, "table");
    if (isUp && row.rowIndex > 1)
    {
        table.moveRow(row.rowIndex, row.rowIndex - 1);
    }
    else if (!isUp && row.rowIndex < row.parentNode.rows.length - 1)
    {
        table.moveRow(row.rowIndex, row.rowIndex + 1);
    }

    setTableRowAttributes(table);
}