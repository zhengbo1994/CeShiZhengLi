function Submit(Send) {
    if (!confirm("确定要提交吗？")) {
        return;
    }
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };
    //获取表单数据并提交后台处理
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType =$('#rblCheckType input:checked').val() 
    var Action ="CancelAdd";
    var json = { vSaleOrderID:SalesOrderID,vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
    vCreaterName:CreaterName,vCreaterAccountID:CreaterAccountID,vCreaterDefaultStationID:CreaterDefaultStationID,vCreateDate:CreateDate,vCheckType:CheckType};
var query = $.jsonToString(json);

ajax(location.href, { action:"Add",isSend: Send, strData: query }, "text", function (data, stu) { alertMsg(data == "success" ? "操作成功！" : "操作失败！"); if(data == "success")closeMe(); });
    handleBtn(true);
    return true;
}

function Save(Send) {
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };
    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value;
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val()
    var Action = "CancelAdd";
    var json = { vSalesChangeID:SalesChangeID,vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID, vCreateDate: CreateDate, vCheckType: CheckType
    };
    var query = $.jsonToString(json);


    ajax(location.href, { action: "Edit", isSend: Send, strData: query }, "text", function (data, stu) { alertMsg(data == "success" ? "操作成功！" : "操作失败！"); if (data == "success") closeMe(); });
    handleBtn(true);
    return true;
}




function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveSubmit"), enabled);
    setBtnEnabled(getObj("btnCheck"), enabled);
    setBtnEnabled(getObj("btnRefuse"), enabled);
}