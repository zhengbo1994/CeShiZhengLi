/// <reference path="../../../../IdeaSoft.js" />
/// <reference path="../../../../jquery.jsontool.js" />

/*
欠款管理JS文件
添加日期：2013-06-05
添加人：杨亮
*/

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

//查询时验证条件合法性
function validate() {

    if (compareDate($("#txtStartRegisterDate").val(), $("#txtEndRegisterDate").val()) < 0) {
        return alertMsg("签署日期：结束日期不小于开始日期！", $("#txtStartRegisterDate"));
    }

    return true;
}

$(document).ready(function () {
    reloadData();

});

//重新加载数据
function reloadData() {
    //提交前验证
    var flag = validate();
    if (!flag) return;
    //防止多次点击
    if (_PageMaster.isSearching) {
        return false;
    }
    else {
        _PageMaster.isSearching = true;
    }

    var query = [{
        "ProjectGUID": $("#ddlProjectName").val(),
        "Statu": $("#ddlStatu").val(),
        "ConfigType": $("#ddlConfigType").val(),
        "Keyword": $("#txtKeyword").val(),
        "SalesOrderDateStartDate": $("#txtSalesOrderDateStartDate").val(),
        "SalesOrderDateEndDate": $("#txtSalesOrderDateEndDate").val()
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}
//JQGRID完成事件， 具体定义在IdeaSoft.js中的initJQGrid方法
function customGridComplete() {
    _PageMaster.isSearching = false;
    
}

function openDebtDetail() {
    openAddWindow("VDebtDetail.aspx", 800, 650);
}

//格式化销售单状态
function renderSalesOrderType(cellvalue, options, rowobject) {
    switch (cellvalue) {
        case "S":
            return "<span  style='color:red'>认购</span>";
        case "C":
            return "<span  style='color:red'>签约</span>";
        default:
            return "未知类型";
    }
}
//双击JQGRID弹出窗口
function dblClickRowFun(rowid, iRow, iCol, e) {
    var url = "VDebtDetail.aspx?SalesOrderGUID={0}&PayMoney={1}&Statu={2}";
    url = stringFormat(url, rowid, stripHtml(jQuery("#jqData").getRowData(rowid)["PayMoney"]), $("#ddlStatu").val());
    openWindow(url, 800, 650);
}

//更多操作事件处理(重写IdeaSoft.js的clickMenu方法)
function clickMenu(key) {
    switch (key) {
        case "Print":
            alert('Print');
            break;
        case "Export":
            //var url = "{0}?ProjectGUID={1}&Statu={2}&ConfigType={3}&Keyword={4}&SalesOrderDateStartDate={5}&SalesOrderDateEndDate={6}";
            //url = stringFormat(url, location.href,
            //    $("#ddlProjectName").val(),
            //    $("#ddlStatu").val(),
            //    $("#ddlConfigType").val(),
            //    $("#txtKeyword").val(),
            //    $("#txtSalesOrderDateStartDate").val(),
            //    $("#txtSalesOrderDateEndDate").val()
            //    );
            //alert(url);
            var query = {
                "ProjectGUID": $("#ddlProjectName").val(),
                "Statu": $("#ddlStatu").val(),
                "ConfigType": $("#ddlConfigType").val(),
                "Keyword": $("#txtKeyword").val(),
                "SalesOrderDateStartDate": $("#txtSalesOrderDateStartDate").val(),
                "SalesOrderDateEndDate": $("#txtSalesOrderDateEndDate").val()
            };
            ajaxExportByData(location.href, query);
            //ajaxExport(url);
            break;
    }
}