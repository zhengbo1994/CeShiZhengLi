/// <reference path="../../../../IdeaSoft.js" />




//按条件搜索， 加载数据
function reloadJQData(jqgrid) {
    var query = [{
        "jqgrid": jqgrid,
        "ProjectGUID": $("#ddlProjectName").val(),
        "Keyword": $("#txtKeyword").val()
    }];
    if (loadJQGrid(jqgrid, query)) {
        addParamsForJQGridQuery(jqgrid, query);
        refreshJQGrid(jqgrid);
    }
}

//重新加载数据
function reloadData() {
    switch (tabIndex) {
        case 0:
            reloadJQData("jqGrid0");
            break;
        case 1:
            reloadJQData("jqGrid1");
            break;
    }

}

//新增批量调整代收费用
function addForChargeAdjust() {
    var url = "VForChargeAdjust.aspx?ProjectGUID={0}";
    url = stringFormat(url, $("#ddlProjectName").val());
    openWindow(url, 1000, 618);
}

//新增划拨单
function addForChargeLayOffVouche() {
    var url = "VForChargeLayOffVoucher.aspx?ProjectGUID={0}";
    url = stringFormat(url, $("#ddlProjectName").val());
    openWindow(url, 1000, 618);
}

//格式化计算方法
function renderCalculationMethod(cellvalue, options, rowobject) {
    //计算方法 (1房款比例 2 按揭贷款比例 3 公积金贷款比例 4 固定金额 5 高级扩展 )
    switch (cellvalue) {
        case "1":
            return "房款比例";
        case "2":
            return "按揭贷款比例";
        case "3":
            return "公积金贷款比例";
        case "4":
            return "固定金额";
        case "5":
            return "高级扩展";
        default:
            return "未知";
    }
}

//删除批量调整代收费用
function deleteForChargeAdjust() {
    var transferTime = stripHtml(getJQGridSelectedRowsData("jqGrid0",false, "TransferTime"))
    if (transferTime != "") {
        return alertMsg("不能删除已经传递的代收费用调整记录！");
    }
    openDeleteWindowByRadioType("DeleteForChargeAdjust", 7, "jqGrid0");

}

//修改批量调整代收费用
function updateForChargeAdjust()
{
    var url = "VForChargeAdjust.aspx?ProjectGUID={0}";
    url = stringFormat(url, $("#ddlProjectName").val());
    openModifyWindowByRadioType(url, 1000, 618, "jqGrid0");
}

//修改划拨单数据
function updateForChargeLayOffVoucher() {
    var url = "VForChargeLayOffVoucher.aspx?ProjectGUID={0}";
    url = stringFormat(url, $("#ddlProjectName").val());
    openModifyWindowByRadioType(url, 1000, 618, "jqGrid1");
}