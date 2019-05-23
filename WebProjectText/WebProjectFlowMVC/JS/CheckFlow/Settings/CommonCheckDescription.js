// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-公共审核意见
 * 文件类型：CommonCheckDescription.js
 * 作    者：马吉龙
 * 时    间：2010-5-5
 */

function addPosotion()
{
    openAddWindow("VCommonCheckDescriptionAdd.aspx", 500, 250, "jqGrid1");
}

function editPosition()
{
    openModifyWindow("VCommonCheckDescriptionEdit.aspx", 500, 250, "jqGrid1")
}

function delPosition()
{
    openDeleteWindow("CommonCheckDescription", 0, "jqGrid1");
}

function validateSize()
{
    if (getObj("txtRowNo").value == "")
    {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
       if (trim(getObj("txtCheckDescription").value) == "")
    {
        return alertMsg("内容不能为空。", getObj("txtCheckDescription"));
    }

    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}