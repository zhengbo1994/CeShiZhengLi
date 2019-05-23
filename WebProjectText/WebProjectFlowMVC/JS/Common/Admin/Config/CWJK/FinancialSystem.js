/*
财务系统信息
作者：胡春华
日期：2013-05-17
*/

function validate()
{
    var bFlag = true;
    handleBtn(false);
    var strCode = $("#ddlCode").val();
    if (isNullOrEmpty(strCode))
    {
        handleBtn(true);
        bFlag = false;
        return alertMsg("请选择财务系统！", getObj("ddlCode"));
    }
    var arrFSI = [];
    var cells = $("#cbFIType").children().children().children();
    cells.each(function (index, cell)
    {
        var objFSICode = getObjC(this, "input", 0);
        if (objFSICode.checked)
        {
            var strFSIID = getNewID().toUpperCase();
            var strFSICode = objFSICode.value;
            var strFSIName = getObjC(this, "label", 0).innerText;
            arrFSI.push(
            {
                FSIID: strFSIID,
                FSICode: strFSICode,
                FSIName: strFSIName
            });
        }
    });
    var strJson = $.jsonToString(arrFSI);
    $("#hidITypeList").val(strJson);
    return bFlag;
}

function handleBtn(isEnabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), isEnabled);
    setBtnEnabled(getObj("btnSaveClose"), isEnabled);
}


//“财务系统”下拉框改变事件
function ddlCode_Change()
{
    ajax(
        window.location.href,
        { "FSCode": $("#ddlCode").val() },
        "json",
        function (rData)
        {
            if (rData.Success == "Y")
            {
                $("#tdIType").html(rData.Data);
                $("#hidITypeHtml").val(rData.Data);
            }
            else
            {
                $("#tdIType").html("");
                alert(rData.Data);
            }
        }, false
    );
}
