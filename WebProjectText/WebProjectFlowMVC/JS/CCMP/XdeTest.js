function reloadData() {
    $('#divData').trigger('reloadGrid');
}

function AddTest() {
    openAddWindow("XDeTestAdd.aspx", 400, 350, "jqTest");
}

function EditTest() {
    openModifyWindow("XdeTestEdit.aspx", 400, 350, "jqTest");
}

function delTest(){
    openDeleteWindow("XdeTest",4,"jqTest");
}


//验证数值
function validateSize() {
    if (getObj("txtEmployeeNO").value == "") {
        return alertMsg("员工编号不能为空。", getObj("txtEmployeeNO"));
    }
    return true;
}