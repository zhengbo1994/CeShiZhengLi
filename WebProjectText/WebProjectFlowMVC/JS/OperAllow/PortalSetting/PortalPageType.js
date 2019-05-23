// JScript 文件
//***************************************************//
//
//文件名:PortalPageType .js
//作者:马吉龙
//时间:2012-03-26
//功能描述:门户也类别JS操作
//
//*************************************************//
var filterData=function()
{
    var protalType=getObj("ddlPortalType").value;
    var key=getObj("txtKW").value;  
    addParamsForJQGridQuery("jqPortalPageType",[{ProtalType:protalType,Key:key}]);
    refreshJQGrid("jqPortalPageType");
    
}
//新增
var addPortalPageType =function()
{
    openAddWindow("VPortalPageTypeAdd.aspx?ProtalType="+getObj("ddlPortalType").value,400,280,"jqPortalPageType");
}

//修改
var editPortalPageType =function()
{
    openModifyWindow("VPortalPageTypeEdit.aspx", 400, 280, "jqPortalPageType");
}

//删除 仅当该门户页类别没有别使用时才能删除
var deletePortalPageType = function () {
    var strPPTIDs = getJQGridSelectedRowsID('jqPortalPageType', true);

    ajaxRequest('FillData.ashx',
    { action: 'GetPortalPageTypeUsedCount', PPTIDs:strPPTIDs.join(), temp: Math.random() },
    "text",
    function (data) {
        if (data == "0") {
            openDeleteWindow("PortalPageType", 0, "jqPortalPageType");
        }
        else {
            alert("部分被选中的门户页类别已经被使用，无法删除。");
        }
    },
    true,
    "POST");
}

//验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtPPTName").value) == "")
    {
        handleBtn(true);
        return alertMsg("门户页类别名称不能为空。", getObj("txtPPTName"));
    }
    if (getObj("ddlPortalType").value=="")
    {
        handleBtn(true);
        return alertMsg("类型不能为空。", getObj("ddlPortalType"));
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
