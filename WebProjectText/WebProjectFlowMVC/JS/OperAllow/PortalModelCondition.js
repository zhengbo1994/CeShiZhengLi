// JScript 文件
function AddPortalModelCondition()
{
    var PMID=getObjP("hidPMID").value;
    openAddWindow("VPortalModelConditionAdd.aspx?PMID="+PMID, 500, 240, "jqGrid1");
}

function EditPortalModelCondition()
{
    var PMID=getObjP("hidPMID").value;
    openModifyWindow("VPortalModelConditionEdit.aspx?PMID="+PMID, 500, 240, "jqGrid1")
}

function DelPortalModelCondition()
{
    openDeleteWindow("PortalModelCondition", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if(getObj("txtPMCName").value == "")
    {
        handleBtn(true);
        return alertMsg("条件名称不能为空。",getObj("txtPMCName"));
    }
    if(getObj("txtPMKey").value=="")
    {
        handleBtn(true);
        return alertMsg("参数不能为空。",getObj("txtPMKey"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}