/// <reference path="../../../../IdeaSoft.js" />


/*
批量调整代收费用JS文件
引用路径; CRM/Sale/Financial/ForCharge/VForChargeAdjust.aspx
添加日期：2013-06-28
添加人：杨亮
*/


//重新加载数据
function reloadData() {
    if ($("#hidBuildingGUIDList").val() == "") {
        return;
    }
    var query = [{
        "ProjectGUID": $("#hidProjectID").val(),
        "BuildingGUID": $("#hidBuildingGUIDList").val(),
        "ChargeNameConfigItemGUID": $("#ddlChargeNameConfigItemGUID").val(),
        "CalculationMethod": $("#ddlCalculationMethod").val(),
        "ChargeRate": $("#txtChargeRate").val(),
        "ChargeMoney": $("#txtChargeMoney").val(),
        "SaveBit":getRadioValue(getObj("rdlSaveBit")),
        "CarryMethod": $("#ddlCarryMethod").val()
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}

//JQGRID完成事件， 具体定义在IdeaSoft.js中的initJQGrid方法
function customGridComplete() {
    hiddenJQgridPager("jqData");//这个JQGRID不需要分页， 在加载完成时间中，隐藏掉。
    if ($("#txtTransferDate").val() != "") {
        disabledFormElements(getObj("ctl00_divMPForm"));
    }
}


//选择楼栋
function selectBuilding() {
    var ProjectGUID = $("#hidProjectID").val();
    var url = '../../../../Common/Select/CRM/VSelectBuildingInfo.aspx?IsProjectFixed=Y&ProjectGUID=' + ProjectGUID + '&IsMulti=Y';
    var rValue = openModalWindow(url, 800, 600);

    if (rValue != null && rValue != "undefined" && rValue != "") {
        rValue = rValue.substring(0, rValue.lastIndexOf('|'));
        var dt = rValue.split('|');
        var names = "";
        var ids = "";
        for (var i = 0; i < dt.length; i++) {
            names += dt[i].split(',')[1] + ",";
            ids += dt[i].split(',')[0] + ",";
        }
        names = names.substring(0, names.lastIndexOf(','));
        ids = ids.substring(0, ids.lastIndexOf(','));

        getObj("hidBuildingGUIDList").value = ids;
        getObj("txtBuildingNameList").value = names;
        reloadData();
    }
}

//验证表单
function validateFrom() {
    setBtnEnabled(['btnSave', 'btnSaveClose', 'btnCalculator', 'btnMove', 'btnClose'], false);
    if ($.ideaValidate()) {
        setBtnEnabled(['btnSave', 'btnSaveClose', 'btnCalculator', 'btnMove', 'btnClose'], true);
        if (parseInt($("#txtChargeRate").val(), 10) > 100) {
            return alertMsg("输入0 ~ 100 之间的数值!", $("#txtChargeRate"))
        }
        return true;
    }
    else {
        setBtnEnabled(['btnSave', 'btnSaveClose', 'btnCalculator', 'btnMove', 'btnClose'], true);
        return false;
    }
    return true;
}

function calculatorFee() {
    var flag = validateFrom();
    if (!flag) {
        return;
    }
    reloadData();
}

//选择执行方法时， 隐藏/显示控件
function calculationMethodChange() {
    var ddlCalculationMethod = getObj("ddlCalculationMethod"),
        calculationMethod = ddlCalculationMethod.value,
        txtChargeMoney = getObj("txtChargeMoney"),
        txtChargeRate = getObj("txtChargeRate"),
        lblChargeRate = getObj("lblChargeRate"),
        lblChargeMoney = getObj("lblChargeMoney");
    // 当没有选择计算方法时
    if (calculationMethod == "") {
        $(txtChargeMoney).show();
        $(lblChargeMoney).show();
        $(txtChargeRate).hide();
        $(lblChargeRate).hide();

        txtChargeMoney.value = "0";
        txtChargeRate.value = "0";
    }
        // 当计算方法是“固定金额”时
    else if (calculationMethod == "4") {
        $(txtChargeMoney).show();
        $(lblChargeMoney).show();
        $(txtChargeRate).hide();
        $(lblChargeRate).hide();

        txtChargeRate.value = "0";
    }
        // 当计算方法是“高级扩展”时
    else if (calculationMethod == "5") {
        $(txtChargeMoney).show();
        $(lblChargeMoney).show();
        $(txtChargeRate).hide();
        $(lblChargeRate).hide();

        txtChargeMoney.value = "0";
        txtChargeRate.value = "0";
    }
        // 当计算方法是“房款比例”、“按揭贷款比例”、“公积金贷款比例”时
    else {
        $(txtChargeMoney).hide();
        $(lblChargeMoney).hide();
        $(txtChargeRate).show();
        $(lblChargeRate).show();

        txtChargeMoney.value = "0";
    }
}

//选择款项名称
function selectChargeNameConfigItem() {
    ajax(location.href, { "action": "SelectChargeName", "ChargeNameConfigItemGUID": $("#ddlChargeNameConfigItemGUID").val(), "ProjectGUID": $("#hidProjectID").val() }, "json", successFun);
}
function successFun(data) {
    if (data.Success == 'Y') {
        //Others数值包含数值顺序： CalculationMethod, ChargeMoney, ChargeRate, SaveBit, CarryMethod
        setChargeMoneyAndRate(data.Others[0], data.Others[1], data.Others[2], data.Others[3], data.Others[4]);
    } else {
        alertMsg(data.Data);
    }
}

//根据计算方法, 设置金额/比例、小数保留位、进位方法
function setChargeMoneyAndRate(calculationMethod, chargeMoney, chargeRate, saveBit, carryMethod) {
    //calculationMethod:计算方法 (1房款比例 2 按揭贷款比例 3 公积金贷款比例 4 固定金额 5 高级扩展 )
    var txtChargeMoney = getObj("txtChargeMoney"),
        txtChargeRate = getObj("txtChargeRate"),
        lblChargeRate = getObj("lblChargeRate"),
        lblChargeMoney = getObj("lblChargeMoney");
       
    $("#ddlCalculationMethod").val(calculationMethod);
    //alert('saveBit:' + saveBit + '   carryMethod:' + carryMethod);
    $("#ddlCarryMethod").val(carryMethod);
    setRadioValue(getObj("rdlSaveBit"), saveBit);
    if (calculationMethod == "4") {
        $(txtChargeMoney).show();
        $(lblChargeMoney).show();
        $(txtChargeRate).hide();
        $(lblChargeRate).hide();
        
        txtChargeMoney.value = chargeMoney;
    }
        // 当计算方法是“高级扩展”时
    else if (calculationMethod == "5") {
        $(txtChargeMoney).show();
        $(lblChargeMoney).show();
        $(txtChargeRate).hide();
        $(lblChargeRate).hide();

        txtChargeMoney.value = "0";
        txtChargeRate.value = "0";
    }
        // 当计算方法是“房款比例”、“按揭贷款比例”、“公积金贷款比例”时
    else {
        $(txtChargeMoney).hide();
        $(lblChargeMoney).hide();
        $(txtChargeRate).show();
        $(lblChargeRate).show();
        
        txtChargeRate.value = chargeRate;
    }
}


//删除调整费用， 仅仅从JQGRID列表中删除。
function deleteAjustFee() {
    var selectedRowsID = getJQGridSelectedRowsID("jqData", true);
    if (selectedRowsID == undefined || selectedRowsID.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    for (var i = selectedRowsID.length - 1; i >= 0; i--) {
        jQuery("#jqData").delRowData(selectedRowsID[i]);
    }

}

//点击保存按钮， 保存数据
function saveAjustFee() {
    //var allRowsID = $('#jqData').getDataIDs();
    //var selectedKeyDatas = [];
    //for (var i = 0; i < allRowsID.length; i++) {
    //    selectedKeyDatas.push($('#jqData').getRowData(allRowsID[i])["ClientName"]);
    //}
    //alert(selectedKeyDatas);
    var forChargeFee = stripHtml(getJQGridAllRowsData("jqData", "ForChargeFee"));
    
    var roomGUID = getJQGridAllRowsID("jqData").join(",");
    if (roomGUID == '') {
        return alertMsg("没有选择调整数据！")
    }
    var data = {
        "action": "SaveAjustFee",
        "rdlSaveBit": getRadioValue(getObj("rdlSaveBit")),// 页面元素是Radio的，CRMCommon.js中的 GetFullFieldValue（）函数获取不到，需要代码单独获取。
        "RoomGUID":roomGUID,
        "ForChargeFee": forChargeFee
    };
    var fieldData=GetFullFieldValue($("#tData"));
    var totalData = mergeJsonData({}, [data, fieldData]);
    //alert($.jsonToString(data));
    //alert(stripHtml(getJQGridAllRowsData("jqData", "ForChargeFee")));
    //alert($.jsonToString(totalData));
    ajax(location.href, totalData, "json", successSaveAjustFeeFun, true, "POST");
}
function successSaveAjustFeeFun(data) {
    if (data.Success == 'Y') {
        if (window.opener != null)
        { try { window.opener.refreshJQGrid('jqGrid0'); } catch (e) { } };
    } else {
        alertMsg(data.Data);
    }
}

//点击传递按钮，传递费用
function transferFee() {
    var flag = confirm("注：费用金额为0的不会被传递。");
    if (!flag) return;
    var data = {
        "action": "TransferFee",
        "ForChargeAdjustGUID": $("#hidForChargeAdjustGUID").val()
    };
    ajax(location.href, data, "json", successTransferFeeFun, true, "POST");
}
function successTransferFeeFun(data) {
    if (data.Success == 'Y') {
        if (window.opener != null)
        {
            try {
                window.opener.refreshJQGrid('jqGrid0');
            } catch (e) { }
        };
        
    } else {
        alertMsg(data.Data);
    }
}



