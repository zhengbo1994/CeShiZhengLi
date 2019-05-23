// JScript 文件
//增加业务人员架构(测试)
function InsertBasicEmployeeYK() {
    debugger
    openAddWindow("VEmployeeYKInsert.aspx", -1, -1, "jqGrid1");
}
//修改业务人员架构(测试)
function EditBasicEmployeeYK() {
    openModifyWindow("VEmployeeYKInsert.aspx?actiontype=edit",
        -1, -1, "jqGrid1");
}
//增加业务人员架构
function addBasicEmployeeYK() {
    debugger
    openAddWindow("VEmployeeYKAdd.aspx", 500, 270, "jqGrid1");
}

//修改业务人员架构
function editBasicEmployeeYK() {
    debugger
    openModifyWindow("VEmployeeYKEdit.aspx", 500, 270, "jqGrid1")
}

//删除业务人员架构
function delBasicEmployeeYK() {
    openDeleteWindow("EmployeeYK", 1, "jqGrid1");
}

//验证数值
function validateSize() {

    if (!isPositiveInt(getObj("txtEmployeeNo").value)) {
        return alertMsg("员工编号必须为正整数。", getObj("txtEmployeeNo"));
    }
                                                                                                                                                                     

    if (getObj("txtEmployeeName").value == "") {
        return alertMsg("员工名称名称不能为空。", getObj("txtEmployeeName"));
    }

    if (getObj("ddlSetSex").value == "") {
        return alertMsg("性别不能为空。", getObj("ddlSetSex"));
    }
    return true;
    //if (getObj("txtSex").value == "") {
    //    return alertMsg("性别不能为空。", getObj("txtSex"));
    //}
    //return true;
}

var reloadData = function () {
    $('#jqGrid1').getGridParam('postData').KW = getObj("txtKW").value;
    refreshJQGrid('jqGrid1');
}



/* 刷新jqGrid */
//function reloadData() {
//    $('#jqGrid1').getGridParam('postData').IsSetStation = getObj("ddlSetSex").value;

//    $('#jqGrid1').trigger('reloadGrid');
//}

/* 重写refreshJQGrid */
//function refreshJQGrid(id) {
//    reloadData();
//}

//格式化名称增加超链接
function renderLink(cellvalue, options, rowobject) {
    debugger
    if (cellvalue != null) {
        var url = "'VEmployeeYK.aspx?ID=" + rowobject[0] + "'";
        return '<div class="nowrap"><a  href="javascript:window.openWindow(' + url + ',500,320)">' + cellvalue + '</a></div>';
    }
    else {
        return "&nbsp;";
    }
}