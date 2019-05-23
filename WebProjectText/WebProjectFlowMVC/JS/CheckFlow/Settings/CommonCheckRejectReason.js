// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-审批驳回意见
 * 文件类型：CommonCheckRejectReason.js
 * 作    者：张敏强
 * 时    间：2014-8-12
 */

function addRejectReason()
{
    openAddWindow("VFlowRejectReasonAdd.aspx", 500, 200, "jqGrid1");
}

function editRejectReason()
{
    openModifyWindow("VFlowRejectReasonEdit.aspx", 500, 200, "jqGrid1")
}

function delRejectReason()
{
    openDeleteWindow("RejectReason", 0, "jqGrid1");
}


function validateSize()
{
    if (trim(getObj("txtRowNo").value) == "")
    {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    if (trim(getObj("txtRejectReason").value) == "")
    {
        return alertMsg("驳回原因不能为空。", getObj("txtRejectReason"));
    }

    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}