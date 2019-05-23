
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

    $('#txtRoomName').val(data[0].RoomName);
    $('#hidRoomGUID').val(data[0].RoomGUID);

    $.post("FillData.ashx", { action: "CRM_GetAttachedRoom", roomGuid: data[0].RoomGUID }, function (data)
    {

    });
}

function SetFont()
{
    $("#labRoom,#lblReasonType,#lblPerson,#lblDate").css({ "color": "red", "font-weight": "bold" });

    //    $("#btnAddCustomer").css();
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

// 新增客户
function SelectCustom()
{
    var project = $("#hidProjectGUID").val();
    var projectName = $("#hidProjectName").val();
    var returnValue = openModalWindow('../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ClientType=RecommendClient&ProjectGUID=' + project + "&ProjectName=" + encodeURIComponent(projectName), 800, 600);

    // 处理hidReturnClientID:返回的clientID值
    if (!$("#hidReturnClientID").val())
    {
        // 添加行
        $.post('FillData.ashx', { action: 'CRM_GetCustomInfo', ClientID: $("#hidReturnClientID").val() }, function (data)
        {
            if (!data)
            {
                $(".dg_table").appent(data);

                // 改变hidNewClientGUIDList的值
                EditClientGUIDList();
            }
        });
    }
}

// 删除客户
function DeleteCustom()
{
    if ($(":checkbox:first").is(":checked"))
    {
        alert('该客户不能删除！');
    }
    else if ($(":checked").length == 0)
    {
        alert('请选择要删除的项！');
    }
    else
    {
        $(":checked").each(function ()
        {
            // 移除行
            $(this).parent().parent().remove();
        });

        // 改变hidNewClientGUIDList的值
        EditClientGUIDList();
    }
}

function EditClientGUIDList()
{
    var values = "";
    $(":checked").each(function ()
    {
        values = $(this).val() + ",";
    });
    $("#hidNewClientGUIDList").val(values.substr(0, values.length - 1));
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

    $("#btnSaveSubmit").hide();
    $("#btnSave").hide();
}