//控制权益人增删按钮的显隐
function propertyBtnShow() {
    $('#btnAddProperty,#btnDeleteProperty').show();
}

function propertyBtnHide() {
    $('#btnAddProperty,#btnDeleteProperty').hide();
}

//提交审核
function Submit(isSend) {
  
    //把权益人写入隐藏控件
    recordPropertyID();
    //权益人变更数据
    var NewProperties = $("#hidPropertiesInfo").val();
    if (NewProperties == "[]") {
        alert('至少要有一位权益人');
        return;
    }
    if (!confirm("确定要提交吗？")) return;
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
    var CheckType = $('#rblCheckType input:checked').val();

    //权益人变更数据
    var NewProperties = $("#hidPropertiesInfo").val();

    var json = { vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType
    };


    var query = $.jsonToString(json);
    /*/* Ajax请求 
    function ajax(url, data, dataType, sucess, async, type, before, complete)
    */


    ajax(location.href, { action: "Add", isSend: isSend, strData: query, vNewProperties: NewProperties },
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

//保存
function Save(Send) {

    //把权益人写入隐藏控件
    recordPropertyID();
    //权益人变更数据
    var NewProperties = $("#hidPropertiesInfo").val();
    if (NewProperties == "[]") {
        alert('至少要有一位权益人');
        return;
    }
    if (!confirm("确定要提交吗？")) return;
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };

    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value; //区别于新增的参数
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val();

   
    var json = { vSalesChangeID: SalesChangeID, vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType
    };


    var query = $.jsonToString(json);
 
    ajax(location.href, { action: "Edit", isSend: Send, strData: query, vNewProperties: NewProperties },
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

//审核
function Check(isAgree) {
    handleBtn(false);
    var SalesOrderID = getObj("hidSalesOrderID").value;
    ajax(location.href, { action: "Check", isAgree: isAgree }, "text", function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        window.returnValue = data;
        if (data == "success") closeMe();
    });
    handleBtn(true);
}



