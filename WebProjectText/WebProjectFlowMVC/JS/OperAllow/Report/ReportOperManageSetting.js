// VReportOperManageSetting.aspx的js

// 初始化
function initReportOper()
{
    if ($("#hidIsBack").val() == "N")
    {
        var hidSelectedIDs = getObjO("hidIDs");
        if (hidSelectedIDs && hidSelectedIDs.value)
        {
            $("#hidIDs").val(getObjO("hidIDs").value);
        }
        else
        {
            return alertMsg("您已经离开了报表权限设置页面。");
        }

        var btn = $("input[id*=btnInitData]");
        btn.length && btn[0].click();
    }
}

//选择岗位
function selectStation() 
{
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableStation.aspx?Aim=ReportAllow&CorpID=' + getParamValue("CorpID"), 800, 600);
}

//选择部门
function selectDept() 
{
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableDept.aspx?Aim=ReportAllow&CorpID=' + getParamValue("CorpID"), 400, 600);
}

//选择工作组
function selectGroup()
{
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableGroup.aspx?Aim=ReportAllow&CorpID=' + getParamValue("CorpID"), 700, 600);
}