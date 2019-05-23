/// <reference path="../../../../IdeaSoft.js" />
/*
划拨单JS文件
引用路径; CRM/Sale/Financial/ForCharge/VForChargeLayOffVoucher.aspx
添加日期：2013-06-26
添加人：杨亮
*/


//重新加载数据
function reloadData() {
    
    var query = [{
        "ProjectGUID": $("#hidProjectID").val(),
        "SelectedGUID": $("#hidSelectedGUID").val(),
        "FilterGUID": $("#hidFilterGUID").val()
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}


//点击选择费用按钮
function selectSalesOrderFee() {
    //选择费用时，记录最新的费用数据, 赋值给隐藏域
    var allRowsID = getJQGridAllRowsID("jqData")
    $("#hidSelectedGUID").val(allRowsID.join(','));
    var ProjectGUID = $("#hidProjectID").val();
    var url = '../../../../Common/Select/CRM/VSelectSalesOrderFee.aspx?ProjectGUID=' + ProjectGUID + '&IsMulti=Y';
    var rValue = openModalWindow(url, 800, 600);
    if (!!rValue) {
        $("#hidSelectedGUID").val(rValue.SalesOrderFeeGUID);
        $("#hidFilterGUID").val("");
        reloadData();
    }
}

//JQGRID完成事件， 具体定义在IdeaSoft.js中的initJQGrid方法
function customGridComplete() {
    hiddenJQgridPager("jqData");//这个JQGRID不需要分页， 在加载完成时间中，隐藏掉。
    $("#txtPayMoney").val($("#jqData").footerData()["ForChargeFee"]);
}

//更多操作事件处理(重写IdeaSoft.js的clickMenu方法)
function clickMenu(key) {
    switch (key) {
        case "Delete":
            deleteSelectSalesOrderFee();
            break;
    }
}

//删除已选择款项明细记录， 仅仅是逻辑上移除JQGRID的值
function deleteSelectSalesOrderFee() {
    var selectedRowsID = getJQGridSelectedRowsID("jqData", true);
    if (selectedRowsID == "" || selectedRowsID.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    var newVal = $("#hidFilterGUID").val() + ',' + selectedRowsID;//把上次选择的值，一并过滤
    $("#hidFilterGUID").val(newVal);//注意： selectSalesOrderFee（）方法时，一定要清空控件的值。 
    reloadData();
    
}

//点击保存按钮，保存划拨单记录
function saveLayOffVoucher() {
    var roomGUID = stripHtml(getJQGridAllRowsData("jqData", "RoomGUID"));
    var forChargeFee = stripHtml(getJQGridAllRowsData("jqData", "ForChargeFee"));
    var configItemGUID = stripHtml(getJQGridAllRowsData("jqData", "ConfigItemGUID"));

    var data = {
        "action": "SaveLayOffVoucher",
        "RoomGUID": roomGUID,
        "ConfigItemGUID": configItemGUID,
        "ForChargeFee": forChargeFee
    };
    var fieldData = GetFullFieldValue($("#tData"));
    var totalData = mergeJsonData({}, [data, fieldData]);
    //alert($.jsonToString(data));
    //alert(stripHtml(getJQGridAllRowsData("jqData", "ForChargeFee")));
    //alert($.jsonToString(totalData));
    ajax(location.href, totalData, "json", successSaveLayOffVoucherFun, true, "POST");
}
function successSaveLayOffVoucherFun(data) {
    if (data.Success == 'Y') {
        if (window.opener != null)
        { try { window.opener.refreshJQGrid('jqGrid0'); } catch (e) { } };
    } else {
        alertMsg(data.Data);
    }
}
