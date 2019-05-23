//**************************************************
// FileName:    BriefingReadMethod.js
// Autor:       王勇
// DateTime:    2011-4-27 18:40:45
// Description: 简报配置中的设置查看方式相关js的操作
//**************************************************

//新增
function addReadMethod()
{
    openAddWindow("VBriefingReadMethodAdd.aspx?BCID="+bcId, 500, 300, "jqgReadMethod");
}

//修改
function editReadMethod()
{
    openModifyWindow("VBriefingReadMethodEdit.aspx", 500, 300, "jqgReadMethod");
}

//删除
function delReadMethod()
{
    openDeleteWindow("BriefingMethod", 1, "jqgReadMethod");
}

function validateSize()
{
    handleBtn(false);
    if(getObj("txtRBMName").value=="")
    {
        handleBtn(true);
        return alertMsg("查看方式名称不能为空",getObj("txtRBMName"));
    }
    if(getObj("txtUrl").value=="")
    {
        handleBtn(true);
        return alertMsg("简报不能为空",getObj("txtUrl"));
    }
    var reg = /^[1-9][0-9]{0,8}$/;
    if (!reg.test(getObj("txtRowNo").value)) 
    {
        handleBtn(true);
        return alertMsg('行号应该为正整数。', getObj("txtRowNo"));
    }
    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
