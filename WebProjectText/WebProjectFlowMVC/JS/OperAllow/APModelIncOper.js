// JScript 文件

// VAPModelIncOperMain.aspx的js

// 加载模块权限
function reloadData(modID)
{
    var query = {ModID: modID};
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}


// VAPModelIncOperAdd.aspx的js
function validateSize()
{
    handleBtn(false);
    var nos = getJQGridSelectedRowsID("jqGrid1", true);
    if (nos.length == 0)
    {
        handleBtn(true);
        return alertMsg("您没有选择任何权限。");
    }
    else
    {
        getObj("hidNos").value = nos.join(",");
    }
    return true;    
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
