//***************************************************//
//
//文件名:ManagePPMASRequest.js
//作者:王勇
//时间:2010年12月17日9:57:48
//功能描述:项目产品标准/材料部品标准中相关js操作
//
//*************************************************//

//格式化名称
var renderName=function(value,pt,record)
{
    var vUrl="'VMyPPMASRequestBrowser.aspx?ID=" + record[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}

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

 //选择项目投资分析阶段
var btnSelectPPID_Click=function()
{   
    if(getObj("ddlProject").value=="")
    {
        return alertMsg("请选择项目",getObj("ddlProject"));
    }
    var vValue=openModalWindow('../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID='+getObj("ddlProject").value, 800, 600);
    if(vValue!=null&&vValue!="")
    {
        getObj("hidPPID").value=vValue.split('|')[0];
        getObj("txtPPName").value=vValue.split('|')[1];
    }
    else
    {
        getObj("hidPPID").value="";
        getObj("txtPPName").value="";
    }
    return true;
}

//改变状态
function ddlIsDelete_Change()
{
    var vIsDelete = getObj("ddlIsDelete").value;
    if (vIsDelete == "Y")
    {
        $("#jqgManageRequest").showCol("DeleteEmployeeName");
        $("#jqgManageRequest").showCol("DeleteDate");
        $("#jqgManageRequest").showCol("DeleteRemark");
        
        getObj("btnEdit_tb").style.display = "none";
        getObj("btnRevision_tb").style.display = "none";
        getObj("btnDelete_tb").style.display = "none";
        getObj("btnDeleteAll_tb").style.display = "";
        getObj("btnDeleteAll").style.display = "";
        getObj("btnResume_tb").style.display = "";
        getObj("btnResume").style.display = "";
    }
    else
    {
        $("#jqgManageRequest").hideCol("DeleteEmployeeName");
        $("#jqgManageRequest").hideCol("DeleteDate");
        $("#jqgManageRequest").hideCol("DeleteRemark");
        
        getObj("btnEdit_tb").style.display = "";
        getObj("btnRevision_tb").style.display = "";
        getObj("btnDelete_tb").style.display = "";
        getObj("btnDeleteAll_tb").style.display = "none";
        getObj("btnResume_tb").style.display = "none";
    }
    
    reloadData();
}

function reloadData()
{
    var projectID = getObj("ddlProject").value;
    var ppID=getObj("hidPPID").value;
    var ccState = getObj("ddlCCState").value;
    var vKey=$("#txtKW").val();
    var createAccountID = getObj("hidCreateAccountID").value;
    var dealAccountID=getObj("hidDealAccountID").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val(); 
    var vAddClass=$("#ddlAddClass").val();   
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
    
    $('#jqgManageRequest',document).getGridParam('postData').ProjectID=projectID;
    $('#jqgManageRequest',document).getGridParam('postData').PPID=ppID;
    $('#jqgManageRequest',document).getGridParam('postData').CCState=ccState;
    $('#jqgManageRequest',document).getGridParam('postData').Key=vKey;
    $('#jqgManageRequest',document).getGridParam('postData').StartTime=vStartTime;
    $('#jqgManageRequest',document).getGridParam('postData').EndTime=vEndTime;
    $('#jqgManageRequest',document).getGridParam('postData').CreateAccountID=createAccountID;
    $('#jqgManageRequest',document).getGridParam('postData').DealAccountID=dealAccountID;
    $('#jqgManageRequest',document).getGridParam('postData').IsDelete=vIsDelete;
    $('#jqgManageRequest',document).getGridParam('postData').AddClass=vAddClass;
    
    refreshJQGrid('jqgManageRequest');
}

function ddlProject_Change()
{
    reloadData();
}
function ddlCCState_Change()
{
    reloadData();
}
function btnSerach_Click()
{
    reloadData();
}


function btnEdit_Click()
{
    var vRType=getObj("hidRType").value;
    openModifyWindow("VManagePPMASRequestEdit.aspx?RType="+vRType, 0, 0, "jqgManageRequest");
}

function btnDelete_Click()
{
    openDeleteWindow("PeriodProjectMaterialAndStandards", 4, "jqgManageRequest", null,{Msg:'Y',From:'Manage'});
}

function btnDeleteAll_Click()
{
    openDeleteWindow("DeletePeriodProjectMaterialAndStandardsAll", 4, "jqgManageRequest", null, {From:'Manage'});
}

function btnResume_Click()
{
    openResumeWindow("PeriodProjectMaterialAndStandards", "jqgManageRequest");
}

function btnRevision_Click()
{
    openRevisionWindow("jqgManageRequest");
}