/*
财务接口，业务对象配置
作者：胡春华
日期：2013-05-16
*/

function validateAdd()
{
    var bResult = true;
    handleBtn(false);
    var strFAOName = $("#txtFAOName").val();
    var strFAOCode = $("#ddlFAOCode").val();
    if (isNullOrEmpty(strFAOName))
    {
        handleBtn(true);
        return alertMsg("业务对象名称不能为空！", getObj("txtFAOName"));
    }
    if (isNullOrEmpty(strFAOCode))
    {
        handleBtn(true);
        return alertMsg("请选择业务对象！", getObj("ddlFAOCode"));
    }

    var strValue = $("input:radio:checked", rlIsAuxiliaryAccounting).val();
    var strAccountingName = $("#txtAccountingName").val();
    if (strValue == "Y"&&isNullOrEmpty(strAccountingName))
    {
        handleBtn(true);
        return alertMsg("核算名称不能为空！", getObj("txtAccountingName"));
    }
    ajax(
        window.location.href,
        { "FAOName": strFAOName, "FAOCode": strFAOCode },
        "json",
        function (rData)
        {
            if (rData.Success == "Y")
            {
                var jsonObj = $.stringToJSON(rData.Data);
                if (jsonObj.Name == "Y")
                {
                    bResult = false;
                    handleBtn(true);
                    return alertMsg("业务对象名称重复！", getObj("txtFAOName"));
                }
                if (jsonObj.Code == "Y")
                {
                    bResult = false;
                    handleBtn(true);
                    return alertMsg("业务对象重复!", getObj("ddlFAOCode"));
                }
            }
        },false
    );
    return bResult;
}

function validateEdit()
{
    var bResult = true;
    handleBtn(false);
    var strFAOName = $("#txtFAOName").val();
    var strFAOCode = $("#ddlFAOCode").val();
    if (isNullOrEmpty(strFAOName))
    {
        handleBtn(true);
        return alertMsg("业务对象名称不能为空！", getObj("txtFAOName"));
    }
    if (isNullOrEmpty(strFAOCode))
    {
        handleBtn(true);
        return alertMsg("请选择业务对象！", getObj("ddlFAOCode"));
    }

    var strValue = $("input:radio:checked", rlIsAuxiliaryAccounting).val();
    var strAccountingName = $("#txtAccountingName").val();
    if (strValue == "Y" && isNullOrEmpty(strAccountingName))
    {
        handleBtn(true);
        return alertMsg("核算名称不能为空！", getObj("txtAccountingName"));
    }
    var strFAOID=getParamValue("ID");
    ajax(
        window.location.href,
        {"FAOID":strFAOID,"FAOName": strFAOName, "FAOCode": strFAOCode },
        "json",
        function (rData)
        {
            if (rData.Success == "Y")
            {
                var jsonObj = $.stringToJSON(rData.Data);
                if (jsonObj.Name == "Y")
                {
                    bResult = false;
                    handleBtn(true);
                    return alertMsg("业务对象名称重复！", getObj("txtFAOName"));
                }
                if (jsonObj.Code == "Y")
                {
                    bResult = false;
                    handleBtn(true);
                    return alertMsg("业务对象重复!", getObj("ddlFAOCode"));
                }
            }
        }, false
    );
    return bResult;
}

function handleBtn(isEnabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), isEnabled);
    setBtnEnabled(getObj("btnSaveClose"), isEnabled);
}

//“是否可用作辅助核算”单选框
function rlIsAuxiliaryAccounting_Change(objRadioList)
{
    var strValue = $("input:radio:checked", objRadioList).val();
    if (strValue == "Y")
    {
        $("#trAccountingName").show();
    }
    else if (strValue == "N")
    {
        $("#trAccountingName").hide();
    }
}

function ddlFAOCode_Change(ddl)
{
    if ($(ddl).val() != "")
    {
        var strName = ddl.options[ddl.selectedIndex].text;
        $("#txtFAOName").val(strName);
    }
    else
    {
        $("#txtFAOName").val("");
    } 
}
