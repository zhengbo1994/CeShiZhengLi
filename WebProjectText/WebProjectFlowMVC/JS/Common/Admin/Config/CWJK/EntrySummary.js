/*
业务对象
作者：胡春华
日期：2013-05-16
*/

function validate(optionType)
{
    handleBtn(false);
    var bFlag = true;
    var strFWTName = $("#txtFWTName").val();
    var strFWTCode = $("#ddlFWTCode").val();
    if (isNullOrEmpty(strFWTName))
    {
        handleBtn(true);
        return alertMsg("分录摘要名称不能为空！", getObj("txtFWTName"));
    }
    if (isNullOrEmpty(strFWTCode))
    {
        handleBtn(true);
        return alertMsg("请选择分录摘要！", getObj("ddlFWTCode"));
    }

    var jsonParam;
    if (optionType == "add")
    {
        jsonParam={ "FWTName": strFWTName, "FWTCode": strFWTCode };
    }
    else if(optionType=="edit")
    {
        jsonParam={"FWTID":getParamValue("ID"),"FWTName": strFWTName, "FWTCode": strFWTCode };
    }
    ajax(
        window.location.href,
        jsonParam,
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
                    return alertMsg("分录摘要名称重复！", getObj("txtFWTName"));
                }
                if (jsonObj.Code == "Y")
                {
                    bFlag = false;
                    handleBtn(true);
                    return alertMsg("分录摘要重复!", getObj("ddlFWTCode"));
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
    setBtnEnabled(getObj("btnClose"), isEnabled);
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
