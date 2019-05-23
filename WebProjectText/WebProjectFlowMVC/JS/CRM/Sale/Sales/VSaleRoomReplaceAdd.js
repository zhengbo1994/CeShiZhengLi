
//选择房间
function selectRoom()
{
    var projectGUID = $('#hidProjectGUID').val();
    if (!projectGUID)
    {
        return false;
    }
    var data = openModalWindow('../../../Common/Select/CRM/VSelectRoomInfo.aspx?ProjectGUID=' + projectGUID, 800, 600);

    if (!data)
    {
        return;
    }
    if (data[0].RoomGUID == $("#hidOldRoomGUID").val())
    {
        alert('换入的房间不能是自身！');
        return;
    }

    // 房间是否可以更换
    $.post("FillData.ashx", { action: "CRM_GetAttachedRoom", NewRoomGuid: data[0].RoomGUID, companyID: $("#hidCorpID").val() }, function (backData)
    {
        var values = backData.split('|');
        if (values[0] == "True")
        {
            $('#txtNewRoomName').val(data[0].RoomName);
            $('#hidNewRoomGUID').val(data[0].RoomGUID);

            // 附属房产的显示-datagrid
            $("#attachRoomList .dg_table").append(values[1]);
        }
        else
        {
            alert('换入的房间，只能是代售和预约的房间！');

            $('#txtNewRoomName').val("");
            $('#hidNewRoomGUID').val("");
        }
    });
}

function SetFont()
{
    $("#labRoom,#lblReasonType,#lblPerson,#lblDate").css({ "color": "red", "font-weight": "bold" });
}


//显隐区块
function setVisible(areaName, tr)
{
    //tr.style.display = (getObj(areaName).value == "0" ? "none" : "");

    // 修改版：支持class设置多行
    // tr为id名称或class名称

    var selector = "." + tr + ",#" + tr;
    $(selector).each(function ()
    {
        if ($(this).is(":hidden"))
        {
            $(this).show();
        } else
        {
            $(this).hide();
        }
    });
}

//选择制定人
function seleSubscriptionAddStationName()
{
    var corpID = ''; //暂时不理 '<% = strCorpID %>';
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 800, 600);

    if (rValue != "undefined" && rValue != null)
    {
        getObj("hidSubscriptionAddStationName").value = rValue.split('|')[0];
        getObj("txtSubscriptionAddStationName").value = rValue.split('|')[1];
    }

}

function refreshMySelf()
{
    location.href = location.href;
}

function UnEnabled()
{
    $("#ddlCancelReasonType").attr("disabled", true);
    $("#datAddTime").attr("disabled", true);
    $("#txtPayedMoney").attr("readOnly", true);
    $("#txtCancelReasons").attr("readOnly", true);
    $("#txtRoomCancelFee").attr("readOnly", true);
    $("#txtSubscriptionAddStationName").attr("readOnly", true);
    $("#BtnSubscriptionAddStationName").removeAttr("onclick");
    $("#btnSelectRoom").removeAttr("onclick");

    $("#btnSaveSubmit").hide();
    $("#btnSave").hide();
}