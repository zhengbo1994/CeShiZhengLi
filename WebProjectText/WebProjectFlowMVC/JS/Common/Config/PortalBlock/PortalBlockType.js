// JScript 文件
//***************************************************//
//
//文件名:PortalBlockType .js
//作者:马吉龙
//时间:2012-10-22
//功能描述:门户页内容块类别JS操作
//
//*************************************************//
var filterData=function()
{
    var protalType=getObj("ddlPortalType").value;
    var key=getObj("txtKW").value;  
    addParamsForJQGridQuery("jqPortalBlockType",[{ProtalType:protalType,Key:key}]);
    refreshJQGrid("jqPortalBlockType");
    
}
//新增
var addPortalBlockType =function()
{
    openAddWindow("VPortalBlockTypeAdd.aspx?ProtalType="+getObj("ddlPortalType").value,400,280,"jqPortalBlockType");
}

//修改
var editPortalBlockType =function()
{
    openModifyWindow("VPortalBlockTypeEdit.aspx", 400, 280, "jqPortalBlockType");
}

//删除 仅当该门户页类别没有别使用时才能删除
var deletePortalBlockType = function () {
    var strPBTIDs = getJQGridSelectedRowsID('jqPortalBlockType', true);

    ajaxRequest('FillData.ashx',
    { action: 'GetPortalBlockTypeUsedCount', PBTIDs:strPBTIDs.join(), temp: Math.random() },
    "text",
    function (data) {
        if (data == "0") {
            openDeleteWindow("PortalBlockType", 0, "jqPortalBlockType");
        }
        else {
            alertMsg("部分被选中的门户页内容块类别已经被使用，无法删除。");
        }
    },
    true,
    "POST");
}

//验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtPBTName").value) == "")
    {
        handleBtn(true);
        return alertMsg("门户页内容块类别名称不能为空。", getObj("txtPBTName"));
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
