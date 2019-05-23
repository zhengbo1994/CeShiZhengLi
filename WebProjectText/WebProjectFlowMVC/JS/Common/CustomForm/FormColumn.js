// JScript 文件

//修改
function editColumn()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        openWindow('VExpenseTypeEdit.aspx?ID=' + chk.value, 450, 250, 0, 1, 1);
    }
}
//新增
function addColumn(isSon)
{
    var objSelect = document.getElementsByName("chkIDV3");
    var vFSID = getObj("hidFSID").value;
    if (objSelect.length)
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk != null)
        {
            var vParentID = '00000'
            if (isSon == 'Child')
            {
                vParentID = chk.value;
            }
            if (isSon == 'Sibling')
            {
                vParentID = chk.parentid;
            }
            openWindow("VFormColumnAdd.aspx?FSID=" + vFSID + " &ParentID=" + vParentID, 450, 250, 0, 1, 1);
        }
        return true;
    }
    openWindow("VFormColumnAdd.aspx?FSID=" + vFSID + " &ParentID=00000", 450, 250, 0, 1, 1);
}

//删除
function delColumn()
{
    openDeleteWindow("FormColumn", 6);
}
//提交验证
function validateSize()
{
    handleBtn(false);
    if (getObj("txtDisplayName").value == "")
    {
        handleBtn(true);
        return alertMsg(" 列名称不能为空。", getObj("txtDisplayName"));
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
    setBtnEnabled(getObj("btnSaveClose"), enabled);
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnClose"), enabled);

}

//动态添加付款方式明细
function addDetail()
{
    var row = tbChildColumn.insertRow();
    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml();

    cell = row.insertCell(1);
    cell.innerHTML = getTextBoxHtml(null, 100, null, null, null, false);

    cell = row.insertCell(2);
    cell.align = "center";
    cell.innerHTML = getObj("tdRule").innerHTML;



    setTableRowAttributes(tbPM);
}



//删除付款方式明细
function deleteDetail()
{
    var cnt = tbPM.rows.length - 1;
    for (j = cnt; j > 0; j--)
    {
        if (getObjTR(tbPM, j, "input", 0).checked)
        {
            tbPM.deleteRow(j);
        }
    }
    getObjTR(tbPM, 0, "input", 0).checked = false;

}
