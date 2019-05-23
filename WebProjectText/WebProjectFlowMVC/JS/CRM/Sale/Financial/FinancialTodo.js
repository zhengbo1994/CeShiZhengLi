function reloadData() {

    var ProjectGUID = $("#ddlProjectGUID").val();
    var vKey = $("#txtKey").val();
    var ChangeTimeStart = $("#txtChangeTimeStart").val();
    var ChangeTimeEnd = $("#txtChangeTimeEnd").val();
    var IsFinish = $("#ddlStatus").val();
    var ClientName = $("#txtClientName").val();
    var TransctorName = $("#txtTransctorName").val();
    var RoomName = $("#txtRoomName").val();
    var ChangeType = $("#ddlChangeType").val(); 
    if (ChangeTimeStart != "" && ChangeTimeEnd != "" && compareDate(ChangeTimeStart, ChangeTimeEnd) == -1) {
        return alertMsg("结束时间必须大于开始时间。", getObj("txtReservationTimeEnd"));
    }
    if (IsFinish == 'Y') {
        $("#btnFinish,#btnAdd").hide();
    } else {
        $("#btnFinish,#btnAdd").show();
    }
    var query = {
        ProjectGUID: ProjectGUID,
        SearchText: vKey,
        ChangeTimeStart: ChangeTimeStart,
        ChangeTimeEnd: ChangeTimeEnd,
        IsFinish: IsFinish,
        ClientName: ClientName,
        TransctorName: TransctorName,
        RoomName:RoomName,
        ChangeType:ChangeType
    };
    
    if (loadJQGrid('jqToDo', query)) {
        refreshJQGrid('jqToDo');
    }
}

function btnSearch_Click() {
    reloadData();
}

function showChange() {
    var SalesChangeGUID = getJQGridSelectedRowsData('jqToDo', false, 'SalesChangeGUID').join();
    var SalesOrderGUID = getJQGridSelectedRowsData('jqToDo', false, 'SalesOrderGUID').join();
    var ProjectGUID = getJQGridSelectedRowsData('jqToDo', false, 'ProjectGUID').join();
    var ChangeType = getJQGridSelectedRowsData('jqToDo', false, 'ChangeType').join();
    openCheckWindow(ProjectGUID, SalesOrderGUID, SalesChangeGUID, ChangeType);
}


function openCheckWindow(ProjectGUID, vSaleOrderID, SalesChangeID, ChangeType) {
    var page = getPage(ChangeType);
    if (page == "") return;
    var url = page + '.aspx?action=Check&ProjectGUID=' + ProjectGUID + '&vSaleOrderID=' + vSaleOrderID + '&SalesChangeID=' + SalesChangeID;
    var re = openModalWindow(url, 800, 600, "jqData");
    reloadData();
}

function getPage(ChangeType) {
    var page = "../Sales/SalesChange/";
    switch (ChangeType) {
        case "1":
            page += "VRoomCancelAdd";
            break;
        case "2":
            page += "VRoomChangeAdd";
            break;
        case "3":
            page += "VPriceChangeAdd";
            break;
        case "4":
            page += "VSpecialDiscountAdd";
            break;
        case "5":
            page += "VPropertyChangeAdd";
            break;
        default: page = "";

    }
    return page;
}

function btnFinish_Click()
{
    var vSalesChangeGUID = getJQGridSelectedRowsData('jqToDo', true, 'SalesChangeGUID').join();
    if (vSalesChangeGUID == "") {
        return alertMsg("请选择至少一条记录。");
    }
    if (confirm("确定要标示完成所选记录吗？")) 
    {

        ajax('VFinancialTodo.aspx',
        {
            pageAction: "finish",
            SalesChangeGUID: vSalesChangeGUID
        },
        'text', function (data, status)
        {       
            if (data == "success") {
                alert("操作成功！");
                reloadData();
            } else {
                alert("操作失败！");
            }

        });
    }
}