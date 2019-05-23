/*
财务接口，业务类型配置
作者：胡春华
日期：2013-05-16
*/

function validate()
{
    handleBtn(false);
    var bFlag = true;
    var strFWTName = $("#txtFWTName").val();
    var strFWTCode = $("#ddlFWTCode").val();
    if (isNullOrEmpty(strFWTName))
    {
        handleBtn(true);
        return alertMsg("业务类型名称不能为空！", getObj("txtFWTName"));
    }
    if (isNullOrEmpty(strFWTCode))
    {
        handleBtn(true);
        return alertMsg("请选择业务类型！", getObj("ddlFWTCode"));
    }
    ajax(
        window.location.href,
        { "FWTName": strFWTName, "FWTCode": strFWTCode },
        "json",
        function (rData)
        {
            if (rData.Success == "Y")
            {
                var jsonObj = $.stringToJSON(rData.Data);
                if (jsonObj.Name == "Y")
                {
                    bFlag = false;
                    handleBtn(true);
                    return alertMsg("业务类型名称重复！", getObj("txtFWTName"));
                }
                if (jsonObj.Code == "Y")
                {
                    bFlag = false;
                    handleBtn(true);
                    return alertMsg("业务类型重复!", getObj("ddlFWTCode"));
                }
            }
        }, false
    );
    return bFlag;
}

function handleBtn(isEnabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), isEnabled);
    setBtnEnabled(getObj("btnSaveClose"), isEnabled);
}

function ddlFWTCode_Change(ddl)
{
    if ($(ddl).val() != "")
    {
        var strName = ddl.options[ddl.selectedIndex].text;
        $("#txtFWTName").val(strName);
    }
    else
    {
        $("#txtFWTName").val("");
    }
}
