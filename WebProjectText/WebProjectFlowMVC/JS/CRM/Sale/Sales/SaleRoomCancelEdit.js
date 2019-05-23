
//显隐区块
function setVisible(areaName, tr)
{
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

function refreshMySelf()
{
    location.href = location.href;
}