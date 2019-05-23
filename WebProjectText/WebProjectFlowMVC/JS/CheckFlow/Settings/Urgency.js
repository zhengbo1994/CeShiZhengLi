// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-紧急程度设置
 * 文件类型：Urgency.js
 * 作    者：马吉龙
 * 时    间：2010-5-5
 */
function ShowColor(cellvalue, options, rowobject) {
    return "<span style='background-color:" + cellvalue + ";height:20px;width:100%;'></span>";
}

function addPosotion()
{
    openAddWindow("VUrgencyAdd.aspx", 450, 300, "jqGrid1");
}

function editPosition()
{
    openModifyWindow("VUrgencyEdit.aspx", 450, 300, "jqGrid1")
}

function delPosition()
{
    openDeleteWindow("Urgency", 0, "jqGrid1");
}

function validateSize()
{
    if (getObj("txtUrgencyName").value == "")
    {
        return alertMsg("紧急程度名称不能为空。", getObj("txtUrgencyName"));
    }
     if (getObj("txtUrgencyLevel").value == "")
    {
        return alertMsg("紧急程度级别不能为空。", getObj("txtUrgencyLevel"));
    }
    if (!isPositiveInt(getObj("txtUrgencyLevel").value))
    {
        return alertMsg("紧急程度级别必须为正整数。", getObj("txtUrgencyLevel"));
    }
   
    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}