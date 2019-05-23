//***************************************************表单操作********************************************************************
//提交审核
function Submit(isSend) {
    //换房变更数据
    var IsAttachRoomCarry = $("#rblIsAttachCarray input[checked=true]").attr("value");
    var NewRoomGUID = $("#hidNewRoomGUID").val();
    var NewRoomName = $("#txtNewRoomName").val();
    if (NewRoomName == "" || NewRoomGUID == "") {
        alert('请选择要换入的房间！');
        return;
    }
    if (!confirm("确定要提交吗？")) return;
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };
    //获取表单数据并提交后台处理
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ChangeID = getObj("hidChangeID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val();


    var json = {vChangeID:ChangeID,vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType,
        vNewRoomGUID: NewRoomGUID, vNewRoomName: NewRoomName, vIsAttachRoomCarry: IsAttachRoomCarry
    };


    var query = $.jsonToString(json);
    /*/* Ajax请求 
    function ajax(url, data, dataType, sucess, async, type, before, complete)
    */


    ajax(location.href, { action: "Add", isSend: isSend, strData: query},
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : data);
        if (data == "success") closeMe();
    });
    handleBtn(true);    
    return true;
}

//保存
function Save(Send) {
    //换房变更数据
    var IsAttachRoomCarry = $("#rblIsAttachCarray input[checked=true]").attr("value");
    var NewRoomGUID = $("#hidNewRoomGUID").val();
    var NewRoomName = $("#txtNewRoomName").val();
    if (NewRoomName == "" || NewRoomGUID == "") {
        alert('请选择要换入的房间！');
        return;
    }
    if (!confirm("确定要提交吗？")) {
        return;
    }

    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };
    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value; //区别于新增的参数
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val();


    var json = { vSalesChangeID: SalesChangeID, vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType,
        vNewRoomGUID: NewRoomGUID, vNewRoomName: NewRoomName, vIsAttachRoomCarry: IsAttachRoomCarry
    };

    var query = $.jsonToString(json);

    ajax(location.href, { action: "Edit", isSend: Send, strData: query},
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : data);
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

//审核
function Check(isAgree) {
    handleBtn(false);
    var SalesOrderID = getObj("hidSalesOrderID").value;
    ajax(location.href, { action: "Check", isAgree: isAgree }, "text", function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : data);
        window.returnValue = data;
        if (data == "success") closeMe();
    });
    handleBtn(true);
}

//***************************************************前台交互********************************************************************
// 选择房间
function selectRoom() {
    var hidProjectGUID = $('#hidProjectGUID'),
        projectGUID,
        data = openModalWindow('../../../../Common/Select/CRM/VSelectRoomInfo.aspx?validFn=isValidRoom', 800, 600);

    if (!data) {
        return false;
    }
    else {
        RoomSelectedHandler(data[0].RoomGUID);
    }
}

// 选择房间处理程序
function RoomSelectedHandler(roomGUID) {
    var q = $(document),
        action = 'selectRoom';
        getRoomInfo(roomGUID, function (roomData) {
            
            // 填充房间信息
            fillNewRoomInfo(roomData);
        });
    
}

// 验证所选房间是否有效
function isValidRoom(rooms) {
    if (!rooms || !rooms.length) {
        return false;
    }
    var selectedRoom = rooms[0],
        selectedRoomSalesStatus = selectedRoom.SaleStatus,
		isAttachedRoom = selectedRoom.IsAttachedRoom;
    if (!/[34]/.test(selectedRoomSalesStatus)) {
        return alertMsg("只能选择待售、预约状态的房源");
    }
    if (isAttachedRoom == "Y") {
        return alertMsg("所选房间是其他房间的附属房产，不能对附属房产进行签约，请选择其他房间");
    }
    // 锁定房间，若房间已被锁定，则返回锁定失败，并弹出提示信息    
    var OrderID=$('#hidChangeID').val();   
    if (!lockSelectedRoomForChange(selectedRoom.RoomGUID,OrderID)) {
        return alertMsg("所选房源已经被锁定，请选择其他房间");
    }
    return true;
}

//提交时再次验证房间是有效
function isValidRoomOnSave(NewRoomGUID) {
    //看房间的锁定状态是否正常

}

function lockSelectedRoomForChange(roomGUID, OrderID) {
    
    var url = "FillData.ashx",
    lockSuccess = false;
    ajaxRequest(url, { action: "CRM_LockRoom", RoomGUID: roomGUID,ID: OrderID },
    'text', function (data, status) {
        lockSuccess = data.toLocaleLowerCase() == 'true';
    }, false, "POST");

    return lockSuccess;
}


// 填充房间信息
function fillNewRoomInfo(roomData) {
    var roomGUID = !!roomData ? roomData.RoomGUID : "",
        roomName = !!roomData ? roomData.RoomName : "";
    // 获取房间建筑信息和价格信息
    getObj("txtNewRoomName").value = roomName; 					// 房间名称
    getObj("hidNewRoomGUID").value = roomGUID; 					// 房间GUID        
}