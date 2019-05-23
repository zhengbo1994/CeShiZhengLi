// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-报文质量分析表设置
 * 文件类型：FlowMessageReportField.js
 * 作    者：张敏强
 * 时    间：2014-8-16
 */

function addField()
{
    openAddWindow("VFlowMessageReportFieldAdd.aspx", 500, 300, "jqGrid1");
}

function editField()
{
    openModifyWindow("VFlowMessageReportFieldEdit.aspx", 500, 300, "jqGrid1")
}

function deleteField()
{
    openDeleteWindow("FlowMessageReportField", 0, "jqGrid1");
}

function settingField()
{
    openWindow("VFlowMessageReportSetting.aspx", 800, 600);
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

    if (trim(getObj("txtFieldName").value) == "")
    {
        return alertMsg("列名称不能为空。", getObj("txtFieldName"));
    }

    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}