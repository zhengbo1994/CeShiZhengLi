
/*
票据明细管理JS前台文件
添加日期：2013-05-17
添加人：杨亮
*/

$(document).ready(function () {
    //此处可以拓展票据规则等 ：
    $.extend($.ideaValidate.rules, { 'AStart': { reg: /^A{1}\d{4}$/, prompt: "aa" } });

});

//按条件搜索， 加载数据
function reloadJQData(jqgrid) {
    var query = [{
        "jqgrid": jqgrid, "ID": $("#hidSalesBillsGUID").val()
    }];
    if (loadJQGrid(jqgrid, query)) {
        addParamsForJQGridQuery(jqgrid, query);
        refreshJQGrid(jqgrid);
    }
}


//选择项目
function selectProject() {
    var rValue = openModalWindow('../../../../Common/Select/CRM/VSelectProjectInfo.aspx?IsMulti=Y', 800, 600);
    if (!!rValue) {
        $("#txtProjectNameList").val(rValue.ProjectName);
        $("#hidProjectGUIDList").val(rValue.ProjectID);
    }
}


//选择登记人或者核销人
function selectAccount(witch) {
    var rValue = openModalWindow('../../../../Common/Select/VSelectSingleAccount.aspx', 800, 600);
    if (!!rValue) {
        if (0 == witch) {
            $("#txtRegisterAccoutName").val(rValue.Name);
            $("#hidRegisterAccoutGUID").val(rValue.ID);
        } else if (1 == witch) {
            $("#txtWriteOffAccoutName").val(rValue.Name);
            $("#hidWriteOffAccoutGUID").val(rValue.ID);
        }

    }
}


//验证表单
function validateFrom() {

    setBtnEnabled(['btnNew_Save', 'btnClose_Save', 'btnClose'], false);
    if ($.ideaValidate()) {
        setBtnEnabled(['btnNew_Save', 'btnClose_Save', 'btnClose'], true);
        if (parseInt( $("#txtBeginNO").val(),10) > parseInt( $("#txtEndNO").val(),10)) {
            return alertMsg("结束编号不小于开始编号！", $("#txtEndNO"))
        }
        if (parseInt($("#txtEndNO").val(), 10)>10000) {
            return alertMsg("输入小于10000的整数!", $("#txtEndNO"))
        }
        return true;
    }
    else {
        setBtnEnabled(['btnNew_Save', 'btnClose_Save', 'btnClose'], true);
        return false;
    }
    return true;
}

//点击生成按钮, 执行BillsManage.js中的isCreateSalesBillsDetails（）方法
function createSalesBillsDetail() {
    if (window.opener != null) {
        try {
            showBrowseTab(0);
            window.opener.isCreateSalesBillsDetails($("#hidSalesBillsGUID").val());
        } catch (e) { }
    }
}

//点击票据领用或者票据核销, operate说明：1表示领取， 2表示核销
function recipientsBills(operate) {
    if ($("#hidIsCreateBillsDetail").val() == "0") {
        return alertMsg("票据明细尚未生成, 不能进行此操作！");
    }
    var url = "VBillsRecipients.aspx?SalesBillsGUID={0}&operate={1}&jqGrid={2}";
    url = stringFormat(url, $("#hidSalesBillsGUID").val(), operate, "jqGrid" + tabIndex);
    openModalWindow(url, 500, 350);
    //openWindow(url, 500, 350);
}

//点击票据核销
function writeOffBills() {

}


function renderSalesBillsStatus(cellvalue, options, rowobject) {
    switch (cellvalue) {
        case "1":
            return "未开";
        case "2":
            return "已开";
        case "3":
            return "作废";
        default:
            return "未知状态";
    }
}

//开始===================[所有票据明细]页面的操作
//票据作废操作
function salesAbolish(jqGridID) {
    var ids = getJQGridSelectedRowsID(jqGridID, true);
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50) {
        return alertMsg("您一次最多只能操作五十条记录。");
    }
    var flag = true;
    for (var i = 0; i < ids.length; i++) {
        if ("" != $('#' + jqGridID).getRowData(ids[i])["WriteOffTime"]) {
            flag = false;
            break;
        }
    }
    if (!flag) {
        return alertMsg("已经核销, 不能作废！");
    }
    var url = "VBillsAbolish.aspx?IDS={0}";
    url = stringFormat(url, ids.join(","));
    openModalWindow(url, 400, 350);
    //openWindow(url, 400, 350);
}
//作废操作完成时,刷新JQGRID 由后台调用。 
function callAbolishComplete() {
    var query = [{
        "jqgrid": "jqGrid1", "ID": $("#hidSalesBillsGUID").val()
    }];
    if (loadJQGrid("jqGrid1", query)) {
        addParamsForJQGridQuery("jqGrid1", query);
        reloadJQData('jqGrid1');
    }
}

//票据取消作废操作
function salesReAbolish(jqGridID) {
    var ids = getJQGridSelectedRowsID(jqGridID, true);
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50) {
        return alertMsg("您一次最多只能操作五十条记录。");
    }
    ajax(location.href, { "action": "ReAbolish", "ids": ids.join(",") }, "json", successFunAbolish);
}

function successFunAbolish(data) {
    if (data.Success == 'Y') {
        switch (tabIndex) {
            case 1:
                var query = [{
                    "jqgrid": "jqGrid1", "ID": $("#hidSalesBillsGUID").val()
                }];
                if (loadJQGrid("jqGrid1", query)) {
                    addParamsForJQGridQuery("jqGrid1", query);
                    reloadJQData('jqGrid1');
                }
                break;
            case 4:
                var query = [{
                    "jqgrid": "jqGrid4", "ID": $("#hidSalesBillsGUID").val()
                }];
                if (loadJQGrid("jqGrid4", query)) {
                    addParamsForJQGridQuery("jqGrid4", query);
                    reloadJQData('jqGrid4');
                }
                break;
        }
    } else {
        alertMsg(data.Data);
    }
}

//回收票据
function salesRegain(jqGridID) {
    var ids = getJQGridSelectedRowsID(jqGridID, true);
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50) {
        return alertMsg("您一次最多只能操作五十条记录。");
    }
    ajax(location.href, { "action": "Regain", "ids": ids.join(",") }, "json", successFunRegain);
}
function successFunRegain(data) {
    if (data.Success == 'Y') {
        var query = [{
            "jqgrid": "jqGrid1", "ID": $("#hidSalesBillsGUID").val()
        }];
        if (loadJQGrid("jqGrid1", query)) {
            addParamsForJQGridQuery("jqGrid1", query);
            reloadJQData('jqGrid1');
        }
    } else {
        alertMsg(data.Data);
    }
}

//票据取消核销
function salesReWriteOff(jqGridID) {
    var ids = getJQGridSelectedRowsID(jqGridID, true);
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50) {
        return alertMsg("您一次最多只能操作五十条记录。");
    }
    ajax(location.href, { "action": "ReWriteOff", "ids": ids.join(",") }, "json", successFun);
}
function successFun(data) {
    if (data.Success == 'Y') {
        switch(tabIndex)
        {
            case 1:
                var query = [{
                    "jqgrid": "jqGrid1", "ID": $("#hidSalesBillsGUID").val()
                }];
                if (loadJQGrid("jqGrid1", query)) {
                    addParamsForJQGridQuery("jqGrid1", query);
                    reloadJQData('jqGrid1');
                }
                break;
            case 3:
                var query = [{
                    "jqgrid": "jqGrid3", "ID": $("#hidSalesBillsGUID").val()
                }];
                if (loadJQGrid("jqGrid3", query)) {
                    addParamsForJQGridQuery("jqGrid3", query);
                    reloadJQData('jqGrid3');
                }
                break;
        
        }
    } else {
        alertMsg(data.Data);
    }
}

//点击菜单项的方法(应在页面JS中重写该方法)
function clickMenu(key) {
    switch (key) {
        case "Regain"://回收票据
            salesRegain('jqGrid1');
            break;
        case "ReWriteOff"://取消核销
            salesReWriteOff('jqGrid1');
            break;
    }
}

//结束===================[所有票据明细]页面的操作

//开始===================[已核销]页面的操作

//已经共用方法
//结束===================[已核销]页面的操作

//开始===================[已作废]页面的操作

//已经共用方法
//结束===================[已作废]页面的操作

//几种状态票据明细列表的双击事件 说明：rowid：当前行id；iRow：当前行索引位置；iCol：当前单元格位置索引；e:event对象
function dblClickRowStatus(rowid, iRow, iCol, e)
{
    if ("已开" == stripHtml(jQuery("#jqGrid1").getRowData(rowid)["SalesBillsStatus"])) {
        alert("已使用的单据，跳转到收款单页面！这里需要与代收费模块对接！！！");
    } else {
        alert("票据尚未使用,无法查看！");
    }
}

