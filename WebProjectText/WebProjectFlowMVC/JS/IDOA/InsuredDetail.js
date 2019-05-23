//控件输入内容验证
function validateUI() {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    var obj = document.getElementById("txtEmail");

    if (getObj("txtEmployeeNo").value == "") {
        return alertMsg("员工编号不能为空。", getObj("txtEmployeeNo"));
    }
    if (!isPositiveInt(getObj("txtEmployeeNo").value)) {
        return alertMsg("员工编号必须为正整数。", getObj("txtEmployeeNo"));
    }
    if (getObj("txtEmpName").value == "") {
        return alertMsg("员工名称名称不能为空。", getObj("txtEmpName"));
    }
    if (getObj("ddlSex").value == "") {
        return alertMsg("性别不能为空。", getObj("ddlSex"));
    }
    if (!reg.test(obj.value)) {
        return alertMsg("请输入有效合法的邮箱地址！");
    }
    var rltPayPlanStr = ConvertTable.GetSerializeJson("TBInsuredDetail"); //获取付款计划明细
    //重新初始化参保明细说明
    $("#hidJson_TBInsuredDetail").val(rltPayPlanStr);
    tbInsuredDetailobj = $("#TBInsuredDetail").IDDetailTable();
    tbInsuredDetailobj.Initial();
    if (typeof (rltPayPlanStr) == 'boolean' && !rltPayPlanStr) {
        setBtnEnabled(["btnSaveOpen", "btnSaveClose"], true);
        return false;
    }
    return true;
}
