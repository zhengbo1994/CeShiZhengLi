// JScript 文件

//增加
function addDealer()
{
    openAddWindow("VBDealerInfoAdd.aspx", 500, 270, "jqDealer");
}
function editDealer()
{
    openModifyWindow("VBDealerInfoEdit.aspx", 500, 270, "jqDealer");
}
//删除
function deleteDealer()
{
    openDeleteWindow("Dealer", 0, "jqDealer");
}

// 选择经销商名称
function showTableTitle(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="showDetailTable(\'' + options.rowId + '\')">' + cellvalue + '</a>'
}

// 查看选择表
function showDetailTable(selTId)
{
    openWindow("VZBDealerInfoBrowse.aspx?DealerID=" + selTId, 450, 450);
}


//验证数值
function validateSize()
{
    if (getObj("txtDName").value == "")
    {
        return alertMsg("经销商名称不能为空。", getObj("txtDName"));
    }
    return true;
}

//格式化名称增加超链接
function renderLink(cellvalue, options, rowobject)
{
    if (cellvalue != null)
    {
        var url = "'VZBDealerInfo.aspx?ID=" + rowobject[0] + "'";
        return '<div class="nowrap"><a  href="javascript:window.openWindow(' + url + ',500,320)">' + cellvalue + '</a></div>';
    }
    else
    {
        return "&nbsp;";
    }
}

//关键字搜索
function btnSearch_Click()
{
    reloadData();
}
//筛选
function reloadData()
{
    var query = {  SearchText: $("#txtKey").val() };

    if (loadJQGrid("jqDealer", query))
    {
        refreshJQGrid("jqDealer");
    }
}


//添加明细


// 提交校验
function validateSize()
{
    //handleBtn(false);
   // if (getObj("txtTableTitle").value == "")
   // {
   //     handleBtn(true);
   //     return alertMsg("联系人名称不能为空。", getObj("txtTableTitle"));
  //  }
    //if (!isPositiveInt(getObj("txtRowNo").value))
    //{
    //    handleBtn(true);
    //    return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    //}
    if (tbValues.rows.length < 2)
    {
        //handleBtn(true);
        return alertMsg("选择项不能为空。", getObj("btnAdd"));
    }
    var jsonDatas = [];
    for (var i = 1; i < tbValues.rows.length; i++)
    {
        var chk = getObjTC(tbValues, i, 1, "input", 0);
        var txtValue = getObjTC(tbValues, i, 2, "input", 0);
       // var txtRemark = getObjTC(tbValues, i, 2, "input", 0);
        if (txtValue.value == "")
        {
           // handleBtn(true);
            return alertMsg("第" + i + "行的选择项不能为空。", txtValue);
        }
        jsonDatas.push({ "PeopleName": chk.value, "PeopleTell": txtValue.value });
    }
    getObj("hidValues").value = $.jsonToString(jsonDatas);

    return true;
}

//function handleBtn(enabled)
//{
  //  setBtnEnabled("btnSaveOpen,btnSaveClose", enabled);
//}


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
        arrDatas.push({ "valueid":"", "PeopleName": "", "PeopleTell": "" });
    }
    for (var i = 0; i < arrDatas.length; i++)
    {
        var row = tbValues.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, arrDatas[i].valueid);
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerHTML = getTextBoxHtml(null, 200, null, null, arrDatas[i].PeopleName);

        cell = row.insertCell(2);
        cell.innerHTML = getTextBoxHtml(null, 1000, null, null, arrDatas[i].PeopleTell);

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