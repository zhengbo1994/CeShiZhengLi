//单元：生成付款明细
//作者：常春侠
//时间：2013-7-10 17:06:42

//款项类型 更改
function changeFundsType(isWindowLoad)
{
    var projectGUID = getParamValue('projID'),
          idType = 'project',
          ddlFundsTypeConfigItemGUID = $('#ddlPayType'),
          fundsTypeConfigItemGUID = ddlFundsTypeConfigItemGUID.val(), //款项类型
          fundsTypeName = ddlFundsTypeConfigItemGUID.find('option[selected]').text(),
          hdFundsNameConfigItemGUID = $('#hdFundsNameConfigItemGUID'),
          defaultFundsNameConfigItemGUID = isWindowLoad ? hdFundsNameConfigItemGUID.val() : "",
          action = getFundsTypeChangeActionName(fundsTypeName);


   // setControlsVisibleByFundsType(fundsTypeName);

    rebindDdlBySelectedValue({
        action: action,
        ID: projectGUID,
        IDType: idType,
        FundsTypeConfigItemGUID: fundsTypeConfigItemGUID
    },
    'ddlPayName', defaultFundsNameConfigItemGUID, 'SELECT', null);

}
function getFundsTypeChangeActionName(fundsTypeName) {
    return fundsTypeName == "代收费用" ? "CRM_GetAvailableForChargeSet" : "CRM_GetFundsNames";
}
//款项名称 更改
function changeFundsName()
{
    
    $("#hdFundsNameConfigItemGUID").val($("#ddlPayName").val());
    $("#hdFundsNameConfigItemName").val($("#ddlPayName").find(":selected").text());

  //  alert("hd:" + $("#hdFundsNameConfigItemName").val()); return false;
}
//检查数据
function check()
{
    var payType = $("#ddlPayType").val();
    var payName = $("#ddlPayName").val();
    var payMoney = $("#txtPayMoney").val();
    if (payType == "")
    {
        alert("请选择款项类型！"); return false;
    }
    if (payName == "")
    {
        alert("请选择款项名称！"); return false;
    }
    if (payMoney == "") {
        alert("请填写金额！"); return false;
    }
    return true;
}