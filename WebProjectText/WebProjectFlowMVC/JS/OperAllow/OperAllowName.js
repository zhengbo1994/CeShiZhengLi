// JScript 文件

function addOperAllowName()
{
    openAddWindow("VOperAllowNameAdd.aspx", 500, 300, "jqGrid1");
}

function editOperAllowName()
{
    openModifyWindow("VOperAllowNameEdit.aspx", 500, 300, "jqGrid1")
}

function delOperAllowName()
{
    openDeleteWindow("OperAllowName", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtOperAllowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("权限代码不能为空。", getObj("txtOperAllowNo"));
    }
    if (getObj("txtOperAllowName").value == "")
    {
        handleBtn(true);
        return alertMsg("权限名称不能为空。", getObj("txtOperAllowName"));
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