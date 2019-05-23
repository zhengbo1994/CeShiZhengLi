//changcx
//2013-05-08 13:58
var request = new QueryString();
var proj = request["pID"];
var tj = request["tj"];
//加载
function reloadData() {
    var jqObj = $('#jqSaleContactList', document);
    var State = $("#ddlServiceState").val();
    var keys = $("#txtSearch").val();
    var Project = $("#ddlProject").val();
    if (!!tj) {
        $("#ddlProject").val(proj);
        $("#ddlServiceState").val(tj);
        State = tj;
        Project = proj;
    }
   // alert("tj:" + tj);
  //  alert("Project:" + Project);
    if (!!proj) {
        $("#ddlProject").val(proj);
        Project = proj;
    }
   
   /* jqObj.getGridParam("postData").PState = State;
    jqObj.getGridParam("postData").txtSearch = keys;
    jqObj.getGridParam("postData").Project = Project;*/
    var query = { "Project": Project, "PState": State, "txtSearch": keys };
    if(loadJQGrid("jqSaleContactList",query)){
   // addParamsForJQGridQuery("jqSaleContactList", [query]);
    refreshJQGrid("jqSaleContactList");
    }
}
//搜索
function btnSearch_Click() {
    reloadData();
}
//获取url后面查询字符串？后面；
function QueryString() {
    var name, value, i;
    var str = location.search;
    //alert(str);
    var num = str.indexOf("?")
    str = str.substr(num + 1);
    var arrtmp = str.split("&");
    for (i = 0; i < arrtmp.length; i++) {
        num = arrtmp[i].indexOf("=");
        if (num > 0) {
            name = arrtmp[i].substring(0, num);
            value = arrtmp[i].substr(num + 1);
            this[name] = value;
        }
    }
}

function SearchKeyDown() {
    if (window.event.keyCode == 13) {
        btnSearch_Click();
    }
}
//项目选择
function project_change() {
    var projID = $("#ddlProject").val();
    if (projID.length != 36) {
        alert('请选择公司下的项目！');
        return;
    }
    // reloadData();
   ajax(
     location.href, 
     {
         Action: "GetSalesService",
         ProjectGUID: projID
     },
     "json",
     getData
    );
}
function getData(data) {
    if (!!data) {
        $("#ddlServiceState option").remove();
        $("#ddlServiceState").get(0).options.add(new Option('所有进程', 'All'));
        for (var i = 0; i < data.length; i++) {
            $("#ddlServiceState").get(0).options.add(new Option(data[i].ServiceProcessName,data[i].SalesServiceDetailGUID));

        } //for
        $("#ddlServiceState").get(0).options.add(new Option('超期办理', 'OverTime'));

        reloadData();
    }
}
function changeState() {
    if (!!tj) {
        tj = "";
        proj = "";
    }
    reloadData();
}
//批量备案
function showRecordDate() {
        var IDs = getJQGridSelectedRowsID("jqSaleContactList", true);
        if (null == IDs || IDs.length == 0) {
            alert('请选择记录！');return;
        }
    var url = getDataForDeal("SalesRecordDataList.aspx", "SaleOrderID");
    openAddWindow(url, 350, 250);
}
//办理
function showDeal(serviceType) {
    var IDs = getJQGridSelectedRowsID("jqSaleContactList", true);
    if (null == IDs || IDs.length == 0) {
        alert('请选择记录！'); return;
    }
    var url = getDataForDeal("SalesDealService.aspx", "SalesServiceDetailGUID");
    //alert(url);
    // var salesOrderServiceGuid = getJQGridSelectedRowsID("jqSaleContactList", true);
    url = url + "&SalesOrderServiceGUID={0}&type=l&serviceType=" + serviceType + "&projID="+$("#ddlProject").val();
    url = stringFormat(url, IDs.join(','));
  //  alert(url);
    openAddWindow(url, 500, 450);
}
//获取要处理的数据
function getDataForDeal(urlstr, param) {
    var url = "";
    var IDs = "";//  getJQGridSelectedRowsID("jqSaleContactList", true);
    if (param == "SaleOrderID") {
        IDs = getJQGridSelectedRowsData("jqSaleContactList", true, "SalesOrderGUID");
    }
    if (param == "SalesServiceDetailGUID") {
        IDs = getJQGridSelectedRowsData("jqSaleContactList", true, "SalesServiceDetailGUID");
    }
    url = urlstr + "?" + param + "={0}";
    url = stringFormat(url, IDs.join(','));
    return url;
}
//双击jqgrid 行，弹出销售单销售服务
function showSalesOrderService(rowid, iRow, iCol, e) {
    var saleOrderId = $('#jqSaleContactList').getRowData(rowid)["SalesOrderGUID"];
    var SalesServiceDetailGUID = $('#jqSaleContactList').getRowData(rowid)["SalesServiceDetailGUID"];
    var url = "SalesOrderaServiceDetailInfo.aspx?SalesOrderServiceID=" + rowid + "&SaleOrderGUID=" + saleOrderId + "&SalesServiceDetailGUID=" + SalesServiceDetailGUID + "&projID=" + $("#ddlProject").val()+"";
    // alert(url);
    openAddWindow(url, 800, 700);
}
//合同登记明细--处理进程
//type=d 表示从合同登记明细进入，type=l表示从办理进入；
function addSalesServiceDetail() {
    var SalesServiceDetailGUID = $("#hidSalesServiceDetailGUID").val();
    var SalesOrderServiceGUID = $("#hidSalesOrderServiceGUID").val();
    var url = "SalesDealService.aspx?SalesServiceDetailGUID=" + SalesServiceDetailGUID + "&SalesOrderServiceGUID=" + SalesOrderServiceGUID + "&type=d&serviceType=1&projID=" + $("#hidProjectID").val();
    openAddWindow(url, 500, 450);

}
//合同登记明细-删除进程
function delSalesServiceDetail() {
    var ServiceIDs = getSelectedCheckBox("chkIDV3");
    var firstProcessID = $("#hidProcessFirst").val();
    if (null == ServiceIDs || ServiceIDs.length == 0) {
        alert('请选择要删除的服务进程！'); return;
    }
    if (ServiceIDs.indexOf(firstProcessID) >= 0) {
        alert('请不要删除第一行数据！'); return;
    }
    openDeleteWindow("SalesOrderServiceDetail", 13);
}
//合同登记明细-检查数据合法性
function Check() {
    var sdate = $("#txtSdate").val();
    var edate = $("#txtEdate").val();
    var contactData = $("#txtContactTime").val();
    if (sdate == "" || edate == "" || contactData == "") {
        var str = "";
        if (sdate == "")
            str = "承诺办理时间";
        if (edate == "")
            str = "承诺完成时间";
        if (contactData == "")
            str = "合同备案时间";
        alert('请确保' + str + '不为空！'); return false;
    }
    else {
        if (sdate > edate) {
            alert('请确保承诺办理时间小于承诺完成时间！'); return false;
        }
        if (sdate < contactData || edate < contactData) {
            alert('请确保合同备案时间小于承诺办理时间和承诺完成时间！'); return false;
        }
    }
    return true;
}
//获取选中的checkbox 
// 获取选中的选择框的value值；
function getSelectedCheckBox(id) {
    var strValues = "";
    var chks = getObjs(id);
    if (chks.length > 0) {
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                strValues = strValues + chks[i].value + ",";
            }
        }
    }
    return strValues;
}
//重新加载进程数据
function reloadProcessData() {
    ajax(location.href, { 'action': 'GetByAjaxHtmlData' }, 'json', function (ret) {
        if (ret && ret.Success == "Y") {
            //alert(ret.Data);
            //$(dg).html(ret.Data);
            //  dg.innerHtml = ret.Data;
             $("#divRpt").html(ret.Data);
             // $("#dgSalesProcess").html(ret.Data);
        }
    });
    return false;
}
//导出前先判断jqgrid是否有数据
function checkJqgridData() {
    var jqObj = getObj("jqSaleContactList");
    if (jqObj.rows.length == 0) {
        alert('当前查询无数据记录，无需导出！');return false;
    }
    return true;
}