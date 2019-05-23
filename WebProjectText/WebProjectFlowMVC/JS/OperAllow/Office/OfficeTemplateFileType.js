/*
Office套文类别使用到的JS
作者：程镇彪
日期：2012-07-03
*/
//条件搜索
function reloadData()
{
    var corpID = getObj("ddlCorp").value;
    var sKey = getObj("txtKey").value;
    $('#dgData').getGridParam('postData').CorpID = corpID;
    $('#dgData').getGridParam('postData').Key = sKey;
    refreshJQGrid('dgData');
}
//添加
function addVOfficeTemplateFileType()
{
    if (getObj("ddlCorp").value == "")
    {
        return alertMsg("请选择公司。", getObj("ddlCorp"));
    }
    openAddWindow("VOfficeTemplateFileTypeAdd.aspx?CorpID=" + $("#ddlCorp").val(), 500, 300, "dgData");
}

//编辑
function editVOfficeTemplateFileType() {
    openModifyWindow("VOfficeTemplateFileTypeEdit.aspx", 500, 300, "dgData");
}

//删除

function deleteVOfficeTemplateFileType() {
    openDeleteWindow("OfficeTemplateFileType", 0, "dgData");
}


function validateSize() {
    handleBtn(false);
    if (getObj("txtOTFTName").value == "") {
        handleBtn(true);
        return alertMsg('名称不能为空。', getObj('txtOTFTName'));
    }
    if (getObj("ddlCorp").value == "")
    {
        handleBtn(true);
        return alertMsg('请选择公司。', getObj('ddlCorp'));
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg('行号必须为正整数。', getObj('txtRowNo'));
    }
    return true;
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}