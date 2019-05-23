// 选择房间信息VSelectRoomInfo.aspx用到的js
// 作者：程镇彪
// 日期：2012-11-24

function RefreshRoomStructure(strBuildingGUID)
{
    ajax(window.parent.frames("Main").location.href, { "BuildingGUID": strBuildingGUID }, "json", function (data)
    {
        if (!!data && data.Data != "undefined" && data.Data != "null")
        {
            $("#tbBuilding", window.parent.frames("Main").document).html(data.Data);
        }
    });

    $("#hdBuildingGUID", window.parent.frames("Left").document).val(strBuildingGUID);
}


//function ChangeBackColor(span)
//{
//    getObj(getObj("hidFirstSpan").value).className = "normalNode";
//    span.className = "selNode";
//    getObj("hidFirstSpan").value = span.id;
//}

//选择
function btnChoose_Click()
{
    var gBuildingGUID = $("#hdBuildingGUID", window.parent.frames("Left").document).val();

    var roomID = $("#hdSelectedID", window.parent.frames("Main").document).val();
    $.post('FillData.ashx', { action: 'CRM_GetRoomInfoByTDRoomID', TDRoomID: roomID, BuildingID: gBuildingGUID },
     function (data, textStatus) { loadRoomInfo(data) }, 'json');
}

// 加载room信息
var loadRoomInfo = function (data) {
    // 请注意：如果需要处理业务，请在原页面进行处理 或 自行添加获取参数判断后进行处理，以免影响其它页面。 单云飞 2012-11-30
    // 返回页面业务操作

    // 如果调用页面需要js验证方法的，可以通过url传入，在此进行调用验证。
    var validFnName = getParamValue("validFn");
    if (typeof parent.dialogArguments[validFnName] == 'function') {
        if (!parent.dialogArguments[validFnName](data)) {
            return false;
        }
    }

    window.returnValue = data;
    window.close();
}

function btnClear_Click()
{
    var emptyRoom = [{
        RoomGUID: '',
        TDRoomID: '',
        RoomName: '',
        RoomCode: '',
        SaleStatus: '',
        SaleStatusName: '',
        BuildingGUID: '',
        ParentBuildingGUID: '',
        ProjectGUID: '',
        ProjectName: '',
        IsAttachedRoom: '',
        MainRoomGUID: '',
        Remark: ''
    }];
    window.returnValue = emptyRoom;
    window.close();
}

function ChangeBackColor(span)
{
    var selectedObj = $('.selNode');
    selectedObj.removeClass("selNode");
    selectedObj.addClass("normalNode");
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}