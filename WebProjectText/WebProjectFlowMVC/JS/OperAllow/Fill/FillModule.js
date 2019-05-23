//JScript文件

//将后台获取到的FillMode转化成对应的值进行显示
function changShow(cellvalue) {
    if (cellvalue != null) {
        return cellvalue == 1 ? "Excel报表" : cellvalue == 2 ? "附件上传" : "Excel报表,附件上传";
    }
    else {
        return "";
    }
}

//增加报表行
function addFillModule() {
    openAddWindow("VFillModuleAdd.aspx", 500, 320, "jqGrid1");
}

//修改报表
function editFillModule() {
    openModifyWindow("VFillModuleEdit.aspx", 500, 320, "jqGrid1");
}

//删除报表
function delFillModule() {
    openDeleteWindow("FillModule", 0, "jqGrid1");
}

//验证数据
function validataSize() {
    handleBtn(false);
    if (getObj("txtModuleID").value == "") {
        handleBtn(true);
        return alertMsg("模块ID不能为空。", getObj("txtModuleID"));
    }
    if (getObj("txtFMName").value == "") {
        handleBtn(true);
        return alertMsg("模块名称不能为空。", getObj("txtFMName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    if ($("#chkFillMode").find(":checked").length == 0)
    {
        handleBtn(true);
        return alertMsg("填报方式必须至少选择其中一种", getObj("hidFillModeValue"));
    }
    return true;
}

//控制提交按钮是否失效
function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

//重新加载Grid数据
function filteData() {
    var query = { "txtKW": $("#txtKW").val() };

    if (loadJQGrid("jqGrid1", query)) {
        refreshJQGrid("jqGrid1");
    }
}
