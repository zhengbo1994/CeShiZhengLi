// 计价方式选择
function priceSelect() {
    var tbPrice = $("#rdlPriceStyle");
    var tbCalulation = $("#rdlCalculationStyle");
    if ($("#txtPriceAdjustName").val() == "") {
        tbCalulation.find("[value='2']").attr("disabled", "disabled");
    }

    tbPrice.find(":radio").live("click",
    function () {
        var currValue = $(this).val();
        var targetValue = tbCalulation.find(":checked").val();
        if (currValue == "1") {
            tbCalulation.find(":radio").removeAttr("disabled");
            tbCalulation.find("[value='2']").attr("disabled", "disabled");
            if (targetValue == "2") {
                tbCalulation.find("[value='1']").attr("checked", true);
            }
        }
        else if (currValue == "2") {
            tbCalulation.find(":radio").removeAttr("disabled");
            tbCalulation.find("[value='1']").attr("disabled", "disabled");
            if (targetValue == "1") {
                tbCalulation.find("[value='2']").attr("checked", true);
            }

        } else {
            //tbCalulation.find(":radio").attr("disabled", "disabled");
            tbCalulation.find("[value='1'],[value='2']").attr("disabled", "disabled");
            tbCalulation.find("[value='3']").attr("checked", true);
        }
    });

}

// 选择楼栋范围
function selectBuilding() {
    var ProjectGUID = $("#hidProjectID").val(); var a = '';
    var url = 'VSelectBuilding.aspx?ProjectGUID=' + ProjectGUID;
    var strRoomGuidList = openModalWindow(url, 800, 600);
    if (strRoomGuidList != null && strRoomGuidList != "undefined" && strRoomGuidList != "") {
        var roomStatus = strRoomGuidList.substr(strRoomGuidList.lastIndexOf(',') + 1);
        strRoomGuidList = strRoomGuidList.substr(0, strRoomGuidList.lastIndexOf(','));
        $("#hidRoomStatus").val(roomStatus);
        reloadData(strRoomGuidList);
    }

}

//条件搜索
function reloadData(strRoomGuidList) {
    $("#btnNextStep").attr("disabled", "disabled");
    ajax(location.href, { "RoomGUIDList": strRoomGuidList }, "json", loadBuilding);
    getObj("hidRoomGuidList").value = strRoomGuidList;
}

//回调方法
function loadBuilding(data, textStatus) {
    if (data.Success == "Y") {
        $("#dgGrid").html(data.Data);
    }
    else {
        alert(data.Data);
    }
    $("#btnNextStep").removeAttr("disabled");
}

//获取房间清单,以POST形式传参数
function getBuildingDetail(RoomGuidList) {
    var url = "VRoomDetailList.aspx";
    var obj = new Object();
    obj.RoomGuidList = RoomGuidList;
    window.showModalDialog(url, obj, "dialogWidth=960px;dialogHeight=610px");
}

//进入价格方案第二步
function PricePlanAddStep2_Click() {
    var AddName = getObj("txtPriceAdjustName").value;
    var AddTime = getObj("txtRequestDate").value;
    var AddRoomGuidList = getObj("hidRoomGuidList").value;
    var AddProjectID = getObj("hidProjectID").value;
    var AddStationID = getObj("hidStationID").value;
    var AddUserName = getObj("txtEmployeeName").value;
    if (AddName != undefined && $.trim(AddName).length > 0 && AddTime != undefined && $.trim(AddTime).length > 0 && AddRoomGuidList != undefined && $.trim(AddRoomGuidList).length > 0 && AddProjectID != undefined && $.trim(AddProjectID).length > 0 && AddStationID != undefined && $.trim(AddStationID).length > 0 && AddUserName != undefined && $.trim(AddUserName).length > 0) {
        var BuildingGuidList = '';
        $("input[name=hidBuildGuid]").each(function () {
            BuildingGuidList += this.value + ",";
        });
        $("#hidBuildingGuidList").val(BuildingGuidList.substr(0, BuildingGuidList.length - 1));
        return true;
    }
    else {
        return false;
    }
}

//职位改变事件
function ddlStation_change(obj) {
    var value = obj.value;
    var valueList = value.split('|');
    $("#hidStationID").val(valueList[0]);
    $("#hidCorpID").val(valueList[1]);
    $("#hidPositionLevel").val(valueList[2]);
}