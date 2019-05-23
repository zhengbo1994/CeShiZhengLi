/*
客户自定义配置使用到的JS
作者：程镇彪
日期：2012-09-18
*/
//条件搜索
function reloadData()
{
    var sCompanyGUID = getObj("ddlCompanyGUID").value;
    var sProjectGUID = getObj("ddlProjectGUID").value;
    var sKey = getObj("txtKey").value;
    ajax(location.href, { "CompanyGUID": sCompanyGUID, "ProjectGUID": sProjectGUID, "Key": sKey }, "html", loadConfigItem);
}

function loadConfigItem(data, textStatus)
{
    $(divMPList).html(data);
}

//添加
function addVCustomConfigItem()
{
    var ConfigCode = getObj( "hdConfigCode" ).value;
    var ConfigType = getObj( "hdConfigType" ).value;
    var ConfigName = getObj( "hdTitle" ).value;

    var CompanyGUID = getNullGuid();
    var ProjectGUID = getNullGuid();

    // 获取项目ID、公司ID    shanyf 2013-07-09
    if ( ConfigType == "P" )
    {
        ProjectGUID = getObj( "ddlProjectGUID" ).value;
    }
    else if ( ConfigType == "C" )
    {
        CompanyGUID = getObj( "ddlCompanyGUID" ).value;
    }

    openAddWindow( "VCustomConfigItemAdd.aspx?ConfigCode=" + ConfigCode + "&ConfigType=" + ConfigType + "&ConfigName=" + encodeURIComponent( ConfigName ) + "&CompanyGUID=" + CompanyGUID + "&ProjectGUID=" + ProjectGUID, 500, 300, "gdData" );

}

// 检测判断系统级配置不让删除、修改
function CheckIsSysItem()
{
    var chks = getObjs("chkIDV3");
    for (var i = 0; i < chks.length; i++)
    {
        if (chks[i].checked)
        {
            if (getParentObj(chks[i], "tr").cells[3].innerText.Trim() == "是")
            {
                return false;
            }
        }
    }

    return true;
}

//编辑
function editVCustomConfigItem()
{
    if (CheckIsSysItem())
    {
        var ConfigCode = getObj("hdConfigCode").value;
        var ConfigType = getObj("hdConfigType").value;
        var ConfigName = getObj("hdTitle").value;

        var CompanyGUID = getNullGuid();
        var ProjectGUID = getNullGuid();

        // 获取项目ID、公司ID    shanyf 2013-07-09
        if ( ConfigType == "P" )
        {
            ProjectGUID = getObj( "ddlProjectGUID" ).value;
        }
        else if ( ConfigType == "C" )
        {
            CompanyGUID = getObj( "ddlCompanyGUID" ).value;
        }

        openModifyWindow("VCustomConfigItemEdit.aspx?ConfigCode=" + ConfigCode + "&ConfigType=" + ConfigType + "&ConfigName=" + encodeURIComponent(ConfigName) + "&CompanyGUID=" + CompanyGUID + "&ProjectGUID=" + ProjectGUID, 500, 300);
    }
    else
    {
        alertMsg("不允许对系统级配置项进行修改！") 
    }
}

//删除

function deleteVCustomConfigItem()
{
    if (CheckIsSysItem())
    {
        openDeleteWindow("CustomConfigItem", 13);
    }
    else
    {
        alertMsg("不允许对系统级配置项进行删除！")
    }
}


function validateSize() {
    handleBtn(false);
    if (getObj("ddlCompanyGUID").value == "" && getObj("hdConfigType").value == "C")// 公司级 
    {
        handleBtn(true);
        return alertMsg('公司级所属公司不能为空。', getObj("ddlCompanyGUID"));
    }
    if (getObj("ddlProjectGUID").value == "" && getObj("hdConfigType").value == "P")// 项目级 
    {
        handleBtn(true);
        return alertMsg('项目级所属项目不能为空。', getObj("ddlProjectGUID"));
    }
    if (getObj("txtConfigItemCode").value == "")
    {
        handleBtn(true);
        return alertMsg('配置项编码不能为空。', getObj("txtConfigItemCode"));
    }
    if (getObj("txtConfigItemName").value == "")
    {
        handleBtn(true);
        return alertMsg('配置项名称不能为空。', getObj("txtConfigItemName"));
    }
    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }
    return true;
}

function handleBtn(enabled) 
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


/* 切换公司加载排序号 新增 */
function resetGetMaxRow()
{
    var CorpID = getObj("ddlCompanyGUID").value; //所属公司
    var ProjectID = getObj("ddlProjectGUID").value; //所属项目
    var ParentItemID = getObj("ddlParentItemGUID").value; //父级配置项
//    $('#hidCorpID').val(corpID);
    $.ajax(
        {
            url: "VCustomConfigItemAdd.aspx",
            data: { action: "GetMaxRow", AjaxCorpID: CorpID, AjaxProjectID: ProjectID, AjaxParentItemID: ParentItemID },
//            dataType: "json",
            success: SetSortNo,
            error: ajaxError
        });
}
// 加载排序号
function SetSortNo(data, textStatus)
{   
    var jsonData = stringToJson(data);

//    alert(jsonData.RowNo);
    getObj("txtSortNo").value = jsonData.RowNo;

    
}