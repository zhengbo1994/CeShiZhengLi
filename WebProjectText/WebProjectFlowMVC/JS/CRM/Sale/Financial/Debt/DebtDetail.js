/// <reference path="../../../../IdeaSoft.js" />

/*
欠款明细管理JS文件
添加日期：2013-06-05
添加人：杨亮
*/

//按条件搜索， 加载数据
function reloadJQData(jqgrid) {

    var query = [{ }];
    if (loadJQGrid(jqgrid, query)) {
        addParamsForJQGridQuery(jqgrid, query);
        refreshJQGrid(jqgrid);
    }
}

//增加催款记录
function addRecord() {
    var url = "VDebtRecord.aspx?TransactionGUID={0}";
    url = stringFormat(url, $("#hidTransactionGUID").val());
    openAddWindow(url, 400, 350);
}


//点击菜单项的方法(应在页面JS中重写该方法)
function clickMenu(key) {
    switch (key) {
        case "Delete"://删除催款记录
            openDeleteWindow("CallsArrearsRecord", 7, "jqGrid0");
            break;
    }
}

//双击单元行，处理事件
function dblClickRowFun(rowid, iRow, iCol, e) {
    var url = "VDebtRecord.aspx?ID={0}&TransactionGUID={1}";
    url=stringFormat(url,rowid, $("#hidTransactionGUID").val())
    openWindow(url, 400, 350);
}

//格式化欠款明细列表 标识 （1 未收 2 部分收取 3 全额收取 4 多收）
function renderPaiedStatus(cellvalue, options, rowobject) {
    switch (cellvalue) {
        case "1":
            return "未收";
        case "2":
            return "部分收取";
        case "3":
            return "全额收取";
        case "4":
            return "多收";
        default:
            return "未知类型";
    }
}

//点击客户名称超链接
function showClientInfo(ClientGUID,ProjectGUID) {
    var url = "../../Customer/VClientInfoAdd2.aspx?ID={0}&ProjectGUID={1}&JQID=jqData";
    url = stringFormat(url, ClientGUID, ProjectGUID);
    openWindow(url, 1000, 800);
}

//点击房间超链接
function showRoomInfo(RoomGUID) {
    var url="../../Project/VHousesAdd.aspx?RoomGUID={0}";
    url = stringFormat(url, RoomGUID);
    openWindow(url, -1, -1);
}

//销售单的 认购、签约单
function showSalesOrderInfo(SalesOrderGUID,ProjectGUID,ProjectName, SalesOrderType) {
    //目前签约和认购的链接页面,只有OrderType参数不同
    var url = "../../Sales/SalesOrder/VSalesOrderEdit.aspx?EditType=edit&OrderType={3}&JQID=jqSubscription&ID={0}&ProjectGUID={1}&ProjectName={2}";//encodeURI(strProjectName)
    url = stringFormat(url, SalesOrderGUID, ProjectGUID, encodeURI(ProjectName), SalesOrderType);
    
    openWindow(url, 0, 0);
}