

function setFlowType(id)
{
    openWindow("VFunctionClassSetFlowType.aspx?FCID="+id, 700, 500, 0, 1, 1);
}
function setModule(id)
{
    openWindow("VFunctionClassSetModule.aspx?FCID="+id, 600, 400, 0, 1, 1);
}

function editFunctionClass()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        openWindow('VFunctionClassEdit.aspx?ID=' + chk.value, 400, 300, 0, 0, 1);
    }
}

function addFunctionClass(isSon)
{
    var objSelect = document.getElementsByName("chkIDV3");
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
            openWindow("VFunctionClassAdd.aspx?ParentID=" + vParentID, 400, 300, 0, 1, 1);
        }
        return true;
    }
    openWindow("VFunctionClassAdd.aspx?ParentID=00000", 400, 300, 0, 1, 1);
}

function delFunctionClass()
{
    //判断 存在父级不能删除。
    openDeleteWindow("FunctionClass", 0);
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtFCName").value == "")
    {
        handleBtn(true);
        return alertMsg("职能分类名称不能为空。", getObj("txtFCName"));
    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSave"), enabled);
    setBtnEnabled(getObj("btnClose"), enabled);
}