
var radioValBefore = "1";
function load()
{
    // 优惠方式选择事件
    $(":radio").click(function ()
    {
        if ($(this).val() != radioValBefore)
        {
            radioValBefore = $(this).val();
            EmptyPrice();
            PayType_OnChange();
        }
    });

    IsEnabled();
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

// 优惠方式选择事件
function PayType_OnChange()
{
    IsEnabled();
    DiscountRateOrNumber_OnChange();
}

function IsEnabled()
{
    if ($("#rdlPayTypeGUID :checked").val() == "1")
    {
        $("#txtDiscountNumber").val("").attr("disabled", true);
        $("#txtDiscountRateNow").removeAttr("disabled");
    } else
    {
        $("#txtDiscountRateNow").val("").attr("disabled", true);
        $("#txtDiscountNumber").removeAttr("disabled");
    }

}

// 折扣或金额改变事件
function DiscountRateOrNumber_OnChange()
{
    var rate = $("#txtDiscountRateNow").val();
    var discountNumber = $("#txtDiscountNumber").val();
    var type = $("#rdlPayTypeGUID :checked").val();

    if (!CheckData(rate, discountNumber))
    {
        return false;
    }

    $.post('FillData.ashx', { action: 'CRM_GetPrice', type: type, discountRate: rate, discountNumber: discountNumber, TotalPrice: $("#hidTotalPrice").val(), InternalArea: $("#hidInternalArea").val(), BuildingArea: $("#hidBuildingArea").val(), companyID: $("#hidCorpID").val(), AttachRoomTotalPrice: $("#txtAttachRoomTotalPrice").val() }, function (data)
    {
        var arr = data.split('|');
        if (arr[0] == "True")
        {
            $("#txtNewTotalPrice").val(arr[1]);
            $("#txtNewBuildingPrice").val(arr[2]);
            $("#txtNewInternalPrice").val(arr[3]);
            $("#txtTotalPriceContract").val(arr[4]);
        } else
        {
            alert('请检查数据的合法性！');
            EmptyPrice();
        }
    });
}

function EmptyPrice()
{
    $("#txtNewTotalPrice").val("");
    $("#txtNewBuildingPrice").val("");
    $("#txtNewInternalPrice").val("");
    $("#txtTotalPriceContract").val("");
}

function CheckData(rate, discountNumber)
{
    if (rate == "" && discountNumber == "")
    {
        return false;
    } else
    {
        return true;
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

    $("#btnSaveSubmit").hide();
    $("#btnSave").hide();

    $("#rdlPayTypeGUID").attr("disabled", true);
    $("#txtDiscountRateNow").attr({ "disabled": true, "readOnly": true });
    $("#txtDiscountNumber").attr({ "disabled": true, "readOnly": true });
}