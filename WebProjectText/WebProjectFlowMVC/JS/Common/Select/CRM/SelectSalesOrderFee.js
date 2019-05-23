/// <reference path="../../../IdeaSoft.js" />
/*
选择代收费用款项前台JS文件.
引用路径： Common/Select/CRM/VSelectSalesOrderFee.aspx
作者：杨亮
日期：2013-06-26
*/


//重新加载数据
function reloadData() {
    if ($("#txtBuildingNameList").val() == "") {
        return false;
    }
    var query = [{
        "ProjectGUID": $("#hidProjectID").val(),
        "BuildingGUID": $("#hidBuildingGUIDList").val(),
        "ConfigItemGUID": $("#hidConfigItemGUIDList").val(),
        "SelectedGUID": $("#hidSelectedGUID").val()
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}

//点击查找按钮，执行方法
function searchData() {
    if ($("#txtBuildingNameList").val() == "") {
        return alertMsg("请选择楼栋！", $("#IDBtn11"))
    }
    reloadData();
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
        //加载数据
        reloadData();
    }
}

//选择款项
function selectConfigItem() {
    var url = '../../../../Common/Select/CRM/VSelectConfigItem.aspx?ConfigItemName=' + encodeURI('代收费用') + '&IsMulti=Y';
    var rValue = openModalWindow(url, 400, 400);
    if (!!rValue) {
        $("#txtConfigItemNameList").val(rValue.ConfigItemName);
        $("#hidConfigItemGUIDList").val(rValue.ConfigItemGUID);
        //加载数据
        reloadData();
    }
}

//点击选择，回传JSON格式数据
function selectSalesOrderFee() {
    var vSalesOrderFeeGUID = getJQGridSelectedRowsID('jqData', true);
    if (vSalesOrderFeeGUID ==null || vSalesOrderFeeGUID.length == 0) {
        return alertMsg('请选择数据！');
    }
    var ids = [];
    for (var i = 0; i < vSalesOrderFeeGUID.length; i++) {
        if (vSalesOrderFeeGUID[i] != "") {
            ids.push(vSalesOrderFeeGUID[i]);
        }
    }
    //隐藏域中，保存着之前已经选择的数据。  一并回传过去。
    var selectedGUID = $("#hidSelectedGUID").val().split(',');
    for (var i = 0; i < selectedGUID.length; i++) {
        if (selectedGUID[i] != "") {
            ids.push(selectedGUID[i]);
        }
    }
    window.returnValue = { "SalesOrderFeeGUID": ids.join(",") };
    window.close();
}
