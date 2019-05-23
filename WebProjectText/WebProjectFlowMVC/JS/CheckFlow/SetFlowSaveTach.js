function setFrameByRadio()
{
    var addtype = $("#rblType input[checked=true]").val();
    if (addtype == "0")
    {
        getObj("frmMain").src = "../../Common/Select/CheckFlow/VSelectSinglePositionFrame.aspx";

    }
    else
    {
        getObj("frmMain").src = "../../Common/Select/OperAllow/VSelectSingleStationFrame.aspx?CorpID=" + getObj("hidCorpID").value;
    }
}

function validateSize()
{
    setBtnEnabled($("#btnSaveClose"),false);
    var addtype = $("#rblType input[checked=true]").val();
    var typeid = "";
    if (addtype == "0")
    {
        typeid = window.frames('frmMain').getJQGridSelectedRowsID('jqGrid1', false);
        if (typeid === null)
        {
            setBtnEnabled($("#btnSaveClose"),true);
            return alertMsg("请选择职位。");
        }
    }
    else
    {
        typeid = window.frames('frmMain').window.frames('Main').getJQGridSelectedRowsID('jqgStation', false);
        if (typeid === null)
        {
            setBtnEnabled($("#btnSaveClose"),true);
            return alertMsg("请选择岗位。");
        }
    }
    $("#hidTypeID").val(typeid);
    if (confirm("确定插入或更新归档环节吗?"))
    {
        return true;
    }
    else
    {
        setBtnEnabled($("#btnSaveClose"), true);
        return false;
    }
}

function validClear()
{
    if (confirm("确定删除所有的归档环节吗?"))
    {
        return true;
    }
    else
    {
        return false;
    }
}