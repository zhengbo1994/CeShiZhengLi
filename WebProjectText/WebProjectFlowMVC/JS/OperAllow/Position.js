// JScript 文件

//添加企业职务
function addPosition()
{
    openAddWindow("VPositionAdd.aspx", 500, 340, "jqGrid1");
}

//编辑企业职务
function editPosition()
{
    openModifyWindow("VPositionEdit.aspx", 500, 340, "jqGrid1")
}

//删除企业职务
function delPosition()
{
    openDeleteWindow("Position", 0, "jqGrid1");
}

//验证数据合法性
function validateSize()
{
    handleBtn(false);
    if (getObj("txtPositionName").value == "")
    {
        handleBtn(true);
        return alertMsg("职务名称不能为空。", getObj("txtPositionName"));
    }
    if (!isPositiveInt(getObj("txtPositionLevel").value))
    {
        handleBtn(true);
        return alertMsg("职务等级必须为正整数。", getObj("txtPositionLevel"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

//导入
function btnImport_Click() {
    openAddWindow("VPositionExcelImport.aspx", 500, 200);
}