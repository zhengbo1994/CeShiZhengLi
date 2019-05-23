// JScript 文件
//***************************************************//
//
//文件名:PortalBIType.js
//作者:马吉龙
//时间:2012-03-17
//功能描述:商业智能门户类别JS操作
//
//*************************************************//

//新增
var addPortalBIType=function()
{
    openAddWindow("VPortalBITypeAdd.aspx",510,300,"jqPortalBIType");
}

//修改
var editPortalBIType=function()
{
    openModifyWindow("VPortalBITypeEdit.aspx",510,300,"jqPortalBIType");
}

//删除
var deletePortalBIType=function()
{
    openDeleteWindow("PortalBIType",0,"jqPortalBIType");
}

//验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtPTName").value) == "")
    {
        handleBtn(true);
        return alertMsg("专业门户类别名称不能为空。", getObj("txtPTName"));
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
