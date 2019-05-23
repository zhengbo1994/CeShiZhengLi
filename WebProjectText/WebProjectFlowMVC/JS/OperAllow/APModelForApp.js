// JScript 文件

function validateSize()
{
    handleBtn(false);
    if (getObj("txtModNo").value=="") {
        handleBtn(true);
        return alertMsg("模块编号不能为空。", getObj("txtModNo"));
    }
    if (getObj("txtModName").value == "")
    {
        handleBtn(true);
        return alertMsg("模块名称不能为空。", getObj("txtModName"));
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

