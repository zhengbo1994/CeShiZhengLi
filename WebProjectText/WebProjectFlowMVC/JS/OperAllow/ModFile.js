// JScript 文件

// VModFileMain.aspx的js

// 加载模块文件
function reloadData(modID)
{
    var query = {ModID: modID};
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// VModFileAdd.aspx、VModFileEdit.aspx的js

function validateSize()
{
    handleBtn(false);
    if (getObj("txtFileName").value == "")
    {
        handleBtn(true);
        return alertMsg("文件名称不能为空。", getObj("txtFileName"));
    }
    if (getObj("txtAPNo").value == "")
    {
        handleBtn(true);
        return alertMsg("模块码不能为空。", getObj("txtAPNo"));
    }
    return true;    
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}