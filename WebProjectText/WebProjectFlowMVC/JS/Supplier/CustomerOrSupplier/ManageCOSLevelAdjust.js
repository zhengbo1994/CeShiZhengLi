//***************************************************//
//
//文件名:ManageCOSLevelAdjust.js
//作者:王勇
//时间:2010-9-13 15:46:45
//功能描述:管理供应商级别调整中相关js操作
//
//*************************************************//

//选择起草人
function selectAccount(aim)
{
    var corpID = getObj("ddlCorp").value;
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?type=account&From=CheckDoc&CorpID=' + corpID, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}

//改变状态
function ddlIsDelete_Change()
{
    var vIsDelete = getObj("ddlIsDelete").value;
    if (vIsDelete == "Y")
    {
        $("#jqgCOSLevelAdjust").showCol("DeleteEmployeeName");
        $("#jqgCOSLevelAdjust").showCol("DeleteDate");
        $("#jqgCOSLevelAdjust").showCol("DeleteRemark");        
        
        $("#btnEdit_tb").hide();
        $("#btnRevision_tb").hide();
        $("#btnDelete_tb").hide();
        $("#btnDeleteAll_tb").show();
        $("#btnResume_tb").show();
    }
    else
    {
        $("#jqgCOSLevelAdjust").hideCol("DeleteEmployeeName");
        $("#jqgCOSLevelAdjust").hideCol("DeleteDate");
        $("#jqgCOSLevelAdjust").hideCol("DeleteRemark");
                
        $("#btnEdit_tb").show();
        $("#btnRevision_tb").show();
        $("#btnDelete_tb").show();
        $("#btnDeleteAll_tb").hide();
        $("#btnResume_tb").hide();
    }
    
    reloadData();
}

function reloadData()
{
    var adjustWay=getObj("ddlAdjustWay").value;    
    var ccState = getObj("ddlCCState").value;
    var vKey=$("#txtKW").val();
    var createAccountID = getObj("hidCreateAccountID").value;
    var dealAccountID=getObj("hidDealAccountID").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();
    var vAddClass=getObj("ddlAddClass").value;
    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
    
        if (date1 > date2)
        {
            return alertMsg("结束时间必须大于开始时间。", $("#txtEndTime"));
        }
    }
    var vIsDelete = getObj("ddlIsDelete").value;
    
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').AdjustWay=adjustWay;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').CCState=ccState;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').Key=vKey;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').StartTime=vStartTime;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').EndTime=vEndTime;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').CreateAccountID=createAccountID;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').DealAccountID=dealAccountID;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').IsDelete=vIsDelete;
    $('#jqgCOSLevelAdjust',document).getGridParam('postData').AddClass=vAddClass;
    
    refreshJQGrid('jqgCOSLevelAdjust');
}

function showCOSLevelAdjust(value, cell, row)
{
    var vUrl = "'VCOSLevelAdjustBrowser.aspx?ID=" + row[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}

function ddlAdjustWay_Change()
{
    reloadData();
}

function btnSerach_Click()
{
    reloadData();
}
function ddlCCState_Change()
{
    reloadData();
}

function btnEdit_Click()
{
    openModifyWindow("VMangeCOSLevelAdjustEdit.aspx", 0, 0, "jqgCOSLevelAdjust");
}

function btnDelete_Click()
{
    openDeleteWindow("DeleteCOSLevelAdjust", 2, "jqgCOSLevelAdjust", null,{Msg:'Y',From:'Manage'});
}

function btnDeleteAll_Click()
{
    openDeleteWindow("DeleteCOSLevelAdjustAll", 2, "jqgCOSLevelAdjust", null, {From:'Manage'});
}

function btnResume_Click()
{
    openResumeWindow("COSLevelAdjust", "jqgCOSLevelAdjust");
}

function btnRevision_Click()
{
    openRevisionWindow("jqgCOSLevelAdjust");
}

