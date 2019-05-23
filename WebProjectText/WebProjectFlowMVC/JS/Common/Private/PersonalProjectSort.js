// JScript 文件

function add()
{
    openAddWindow("VPersonalProjectSortAdd.aspx", 500, 300, "jqGrid1");
}

function edit()
{
    openModifyWindow("VPersonalProjectSortEdit.aspx", 500, 300, "jqGrid1")
}

function del()
{
    openDeleteWindow("PersonalProjectSort",0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtSortName").value == "")
    {
        handleBtn(true);
        return alertMsg("类别名称不能为空。", getObj("txtSortName"));
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
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function setProject(strSortID)
{
    openModalWindow("VPersonalProjectSortSet.aspx?SortID="+strSortID,300,600);
}

function setDefault(strSortID)
{
    $("#jqGrid1").resetSelection();
    $("#jqGrid1").setSelection(strSortID,false);
    openConfirmWindow("PersonalProjectSort","您是否确定设置此类别为默认类别。", "jqGrid1", null);
}
