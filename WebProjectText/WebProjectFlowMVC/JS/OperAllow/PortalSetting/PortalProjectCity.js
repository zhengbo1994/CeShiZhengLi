// JScript 文件
//***************************************************//
//
//文件名:PortalProjectCity .js
//作者:马吉龙
//时间:2012-03-17
//功能描述:项目城市JS操作
//
//*************************************************//

//新增
var addPortalProjectCity =function()
{
    openAddWindow("VPortalProjectCityAdd.aspx?PAID="+$("#hidPAID").val(),300,200);
}

//修改
var editPortalProjectCity =function()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        openAddWindow('VPortalProjectCityEdit.aspx?ID='+chk.value, 300, 200);
    }
}
//配置项目
var setProjectInfo =function()
{
    var objSelect = document.getElementsByName("chkIDV3");
    if (objSelect.length)
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk != null)
        {
             getObj("hidProjectID").value=chk.projectids;
             openModalWindow("VSetProject.aspx?PCID="+chk.value,300,500);
        }
    }
}
//删除
var deletePortalProjectCity =function()
{
    openDeleteWindow("PortalProjectCity",0);
    
}

//验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtPCName").value) == "")
    {
        handleBtn(true);
        return alertMsg("城市名称不能为空。", getObj("txtPCName"));
    }   
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;    
}
var renderName=function(value,pt,record)
{
    var vUrl="'VPortalProjectCity.aspx?PAID=" + pt.rowId+"'";   
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',screen.availWidth,screen.availHeight)">设置城市</div>';
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
