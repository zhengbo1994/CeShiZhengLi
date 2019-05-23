
/*
票据管理JS文件
添加日期：2013-05-16
添加人：杨亮
*/


/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
billsGUID 用于链接是传递参数
*/
var _PageMaster = {};
_PageMaster.isSearching = false;
_PageMaster.billsGUID = "";

//查询时验证条件合法性
function validate() {

    if (compareDate($("#txtStartRegisterDate").val(), $("#txtEndRegisterDate").val()) < 0) {
       return alertMsg("登记日期：结束日期不小于开始日期！", $("#txtStartRegisterDate"));
    }
    
    if (compareDate($("#txtStartWriteOffDate").val(), $("#txtEndWriteOffDate").val()) < 0 ) {
       return alertMsg("核销日期：结束日期不小于开始日期！", $("#txtStartWriteOffDate"));
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
        "BillsStatu": $("#ddlBillsStatu").val(),
        "BillsType": $("#ddlBillsType").val(),
        "Keyword": $("#txtKeyword").val(),
        "StartRegisterDate": $("#txtStartRegisterDate").val(),
        "EndRegisterDate": $("#txtEndRegisterDate").val(),
        "StartWriteOffDate": $("#txtStartWriteOffDate").val(),
        "EndWriteOffDate": $("#txtEndWriteOffDate").val()
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}
//JQGRID完成事件， 具体定义在IdeaSoft.js中的initJQGrid方法
function customGridComplete() {
    _PageMaster.isSearching = false;
    //根据不同视图，设置显示/隐藏列,  设置操作按钮等。
    switch ($("#ddlBillsStatu").val()) {
        case "0":
            jQuery("#jqData").setGridParam().showCol("WriteOffAccountName");
            jQuery("#jqData").setGridParam().showCol("WriteOffTime");
            jQuery("#jqData").setGridParam().hideCol("StatusCount");

            $("#btnDelete").show();
            break;
        case "1":
            jQuery("#jqData").setGridParam().hideCol("WriteOffAccountName");
            jQuery("#jqData").setGridParam().hideCol("WriteOffTime");
            jQuery("#jqData").setGridParam().hideCol("StatusCount");

            $("#btnDelete").show();
            break;
        case "2":
            jQuery("#jqData").setGridParam().hideCol("WriteOffAccountName");
            jQuery("#jqData").setGridParam().hideCol("WriteOffTime");
            jQuery("#jqData").setGridParam().showCol("StatusCount");

            $("#btnDelete").hide();
            break;
        case "3":
            jQuery("#jqData").setGridParam().showCol("WriteOffAccountName");
            jQuery("#jqData").setGridParam().showCol("WriteOffTime");
            jQuery("#jqData").setGridParam().hideCol("StatusCount");

            $("#btnDelete").hide();
            break;
        default:
            jQuery("#jqData").setGridParam().hideCol("WriteOffAccountName");
            jQuery("#jqData").setGridParam().hideCol("WriteOffTime");
            jQuery("#jqData").setGridParam().hideCol("StatusCount");

            $("#btnDelete").show();
            break;
    }
    jQuery("#jqData")[0].updateColumns();
}


//按条件搜索， 加载数据
function reloadJQData() {
    
    var query = [{ "DiscountGUID": $("#hidDiscountGUID").val() }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}

//新增票据
function addBills() {
    openAddWindow("VBillsOperate.aspx?BillsGUID=" + _PageMaster.billsGUID, 800, 650);
    //showModalDialog("VBillsOperate.aspx?BillsGUID=" + _PageMaster.billsGUID, 800, 650);
    //showModalDialog('VBillsOperate.aspx', this, 'dialogtop= 10px;dialogleft=10px;dialogWidth=800px;dialogHeight=650px;');
}

//修改票据
function editBills() {
    //alert(getJQGridSelectedRowsID("jqData", true));
    //在IdeaSoft.js中没有提供当Jqgrid的MultiSelect="false" 时，获取选中行的方法。 所以下面需要自己写获取选中行的方法.
    var id = $("#jqData").jqGrid('getGridParam', 'selrow');
    var url = "VBillsOperate.aspx?BillsGUID=" + _PageMaster.billsGUID;
    url = addUrlParam(url, "JQID", "jqData");
    url = addUrlParam(url, "ID", id);
    openWindow(url, 800, 650);
    //openModifyWindow("VBillsOperate.aspx?BillsGUID=" + _PageMaster.billsGUID, 800, 650, "jqData");
    
}

//删除票据
function delBills() {
    var id = $("#jqData").jqGrid('getGridParam', 'selrow');
    var url = getDeletePageUrl(7);
    if (url == "") {
        return alertMsg("参数错误。");
    }
    url += "?Action=SalesBills";
    url += "&JQID=jqData&ID=" + id;
    var winobj = getOpenWinObj(2);
    window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
        + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    //openDeleteWindow("SalesBills", 7, "jqData");
}

//更多操作事件处理(重写IdeaSoft.js的clickMenu方法)
function clickMenu(key) {
    switch (key) {
        case "Print":
            alert('Print');
            break;
        case "Export":
            ajaxExport(location.href);
            break;
    }
}

//改变视图状态
function changeBillsStatu() {
    reloadData();
}

//改变票据类型
function changeBillsType() {
    reloadData();
}

//格式化票据类型
function renderBillsType(cellvalue, options, rowobject) {
    switch (cellvalue) {
        case "1":
            return "发票";
        case "2":
            return "单据";
        default:
            return "未知类型";
    }
}

//生成票据明细方法, 有是否生成提示。
function isCreateSalesBillsDetails(SalesBillsGUID) {
    var flag= confirm("是否生成票据明细数据?");
    if (flag) {
        ajax('VBillsOperate.aspx', { "action": "createBillsDetails", "SalesBillsGUID": SalesBillsGUID }, "json", callBackSuccess);
    }
}
function callBackSuccess(data) {
    if (data.Success == 'Y') {
        //此操作完成后， 需要屏蔽按钮等等

        //switch (tabIndex) {
        //    case 1:
        //        var query = [{
        //            "jqgrid": "jqGrid1", "ID": $("#hidSalesBillsGUID").val()
        //        }];
        //        if (loadJQGrid("jqGrid1", query)) {
        //            addParamsForJQGridQuery("jqGrid1", query);
        //            reloadJQData('jqGrid1');
        //        }
        //        break;
        //    case 3:
        //        var query = [{
        //            "jqgrid": "jqGrid3", "ID": $("#hidSalesBillsGUID").val()
        //        }];
        //        if (loadJQGrid("jqGrid3", query)) {
        //            addParamsForJQGridQuery("jqGrid3", query);
        //            reloadJQData('jqGrid3');
        //        }
        //        break;

        //}
    } else {
        alertMsg(data.Data);
    }

}

//修改信息后，重新生成票据明细。不给提示， 强制重新生成!
function ReCreateSalesBillsDetails(SalesBillsGUID) {
    ajax('VBillsOperate.aspx', { "action": "ReCreateSalesBillsDetails", "SalesBillsGUID": SalesBillsGUID }, "json", callBackReCreateSuccess);
}
function callBackReCreateSuccess(data) {
    if (data.Success == 'Y') {
        alertMsg("操作成功！");
    } else {
        alertMsg(data.Data);
    }

}