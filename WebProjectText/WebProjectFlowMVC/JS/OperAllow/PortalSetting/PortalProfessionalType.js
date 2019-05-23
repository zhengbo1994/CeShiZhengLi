// JScript 文件
//***************************************************//
//
//文件名:PortalProfessionalType.js
//作者:马吉龙
//时间:2012-03-17
//功能描述:门户专业类别JS操作
//
//*************************************************//

//新增
var addPortalProfessionalType=function()
{
    openAddWindow("VPortalProfessionalTypeAdd.aspx",510,300,"jqPortalProfessionalType");
}

//修改
var editPortalProfessionalType=function()
{
    openModifyWindow("VPortalProfessionalTypeEdit.aspx",510,300,"jqPortalProfessionalType");
}

//删除
var deletePortalProfessionalType=function()
{
    openDeleteWindow("PortalProfessionalType",0,"jqPortalProfessionalType");
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
