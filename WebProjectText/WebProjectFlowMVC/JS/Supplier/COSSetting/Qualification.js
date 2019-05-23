// JScript 文件
function addQualification() {
    openAddWindow("VQualificationAdd.aspx", 500, 300, "jqQualification");
}

function editQualification() {
    openModifyWindow("VQualificationEdit.aspx", 500, 300, "jqQualification")
}

function delQualification() {
    openDeleteWindow("Qualification", 2, "jqQualification");
}

function validateSize() {
    handleBtn(false);
    if (trim(getObj("txtCOSQName").value) == "") {
        handleBtn(true);
        return alertMsg("分类名称不能为空。", getObj("txtCOSQName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}
function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

//检索数据
var filterData = function () {
    var varKey = $("#txtKW").val();
    $("#jqQualification").getGridParam("postData").Key = varKey;
    refreshJQGrid("jqQualification");
}