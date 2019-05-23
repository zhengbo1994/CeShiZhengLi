
var priceType = "1";
function load()
{
    // 变更后输入的单价事件
    $("#txtConstructionUnitPriceAfter,#txtInternalUnitPriceAfter,#txtTotalPriceAfter").bind("change", price_OnChange);


    // 计价方式选择事件
    $("#rdlPriceTypeAfter :radio").click(function ()
    {
        var rdo = $(this).val();
        if (rdo != priceType)
        {
            priceType = rdo;
            if (priceType == "2")
            {
                $("#txtInternalUnitPriceAfter").removeAttr("readOnly");
                $("#txtConstructionUnitPriceAfter").attr("readOnly", true);
                $("#txtTotalPriceAfter").attr("readOnly", true);
            } else if (priceType == "3")
            {
                $("#txtTotalPriceAfter").removeAttr("readOnly");
                $("#txtConstructionUnitPriceAfter").attr("readOnly", true);
                $("#txtInternalUnitPriceAfter").attr("readOnly", true);
            } else
            {
                $("#txtConstructionUnitPriceAfter").removeAttr("readOnly");
                $("#txtTotalPriceAfter").attr("readOnly", true);
                $("#txtInternalUnitPriceAfter").attr("readOnly", true);
            }
            price_OnChange();
        }

    });

    $("#txtTotalPriceAfter").attr("readOnly", true);
    $("#txtInternalUnitPriceAfter").attr("readOnly", true);

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

// 计价方式
function price_OnChange()
{
    var type = $("#rdlPriceTypeAfter :checked").val();

    var constructionArea = $("#txtForSaleConstructionArea").val();
    var internalArea = $("#txtForSaleInternalArea").val();
    var constructionUnitPriceAfter = $("#txtConstructionUnitPriceAfter").val();
    var internalUnitPriceAfter = $("#txtInternalUnitPriceAfter").val();

    var totalPriceAfter = $("#txtTotalPriceAfter").val();
    var attachRoomDiscountPrice = $("#txtAttachRoomDiscountPrice").val();

    $.post("FillData.ashx", { action: "CRM_GetPriceAfter", type: type, constructionArea: constructionArea, internalArea: internalArea, constructionUnitPriceAfter: constructionUnitPriceAfter, internalUnitPriceAfter: internalUnitPriceAfter, totalPriceAfter: totalPriceAfter, attachRoomDiscountPrice: attachRoomDiscountPrice, companyID: $("#hidCorpID").val() }, function (data)
    {
        var prices = data.split('|');
        if (prices[0] == "True")
        {
            $("#txtConstructionUnitPriceAfter").val(prices[1]);
            $("#txtInternalUnitPriceAfter").val(prices[2]);
            $("#txtTotalPriceAfter").val(prices[3]);
            $("#txtContractTotalPriceAfter").val(prices[4]);
        } else
        {
            $("#txtConstructionUnitPriceAfter").val("");
            $("#txtInternalUnitPriceAfter").val("");
            $("#txtTotalPriceAfter").val("");
            $("#txtContractTotalPriceAfter").val("");
        }
    });
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