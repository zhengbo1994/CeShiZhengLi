/*
客户自定义配置使用到的JS
作者：程镇彪
日期：2012-09-18
*/
////条件搜索
//function reloadData() {
//    var sKey = getObj("txtKey").value;
//    $('#gdData').getGridParam('postData').Key = sKey;
//    refreshJQGrid('gdData');
//}
//添加
function addVCustomConfig()
{
    var ConfigCode = getObj("hdConfigCode").value;
    var ConfigType = getObj("hdConfigType").value;
    openAddWindow("VCustomConfigAdd.aspx?ConfigCode='" + ConfigCode + "'&ConfigType='" + ConfigType +"'", 500, 300, "gdData");
}

//编辑
function editVCustomConfig() {
    openModifyWindow("VCustomConfigEdit.aspx", 500, 300, "gdData");
}

//删除

//function deleteVCustomConfig() {
//    openDeleteWindow("CustomConfig", 1, "gdData");
//}


function validateSize() {
    handleBtn(false);
    if (getObj("txtConfigCode").value == "")
    {
        handleBtn(true);
        return alertMsg('客户自定义配置代码不能为空。', getObj("txtConfigCode"));
    }
    if (getObj("txtConfigName").value == "")
    {
        handleBtn(true);
        return alertMsg('客户自定义配置名称不能为空。', getObj("txtConfigName"));
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