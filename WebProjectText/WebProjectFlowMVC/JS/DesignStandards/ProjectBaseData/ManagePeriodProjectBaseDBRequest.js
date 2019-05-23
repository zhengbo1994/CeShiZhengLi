// JScript 文件

 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：业务系统导航-设计标准-管理项目项目基础数据库
 * 文件类型：ManagePeriodProjectBaseDBRequest.js
 * 作    者：马吉龙
 * 时    间：2010-12-16
 */
 
 //搜索
var filterData=function()
{
    var ProjectID=getObj("ddlProject").value;
    var CCState=getObj("ddlCCState").value;
    var Key=getObj("txtKey").value;
    var AccountID=getObj("hidCreateAccountID").value;
    var DealAccountID=getObj("hidDealAccountID").value;
    var Start=getObj("txtStartTime").value;
    var End=getObj("txtEndTime").value;
    var Delete=getObj("ddlIsDelete").value;
    var vIsNeedCheck = $("#ddlIsNeedCheck").val();
    var vPPID = $("#hidPPID").val();
    addParamsForJQGridQuery("jqManageMyPeriodProjectBaseDBRequest",[{ProjectID:ProjectID,CCState:CCState,Key:Key,AccountID:AccountID,Start:Start,End:End,Delete:Delete,DealAccountID:DealAccountID,IsNeedCheck:vIsNeedCheck,PPID:vPPID}]);
    refreshJQGrid("jqManageMyPeriodProjectBaseDBRequest");
}

//改变删除与未删除状态
function ddlIsDelete_Change()
{
    var vIsDelete = getObj("ddlIsDelete").value;
    if (vIsDelete == "Y")
    {   
        $("#jqManageMyPeriodProjectBaseDBRequest").showCol("DeleteEmployeeName");
        $("#jqManageMyPeriodProjectBaseDBRequest").showCol("DeleteDate");
        $("#jqManageMyPeriodProjectBaseDBRequest").showCol("DeleteRemark");     
        
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
        $("#jqManageMyPeriodProjectBaseDBRequest").hideCol("DeleteEmployeeName");
        $("#jqManageMyPeriodProjectBaseDBRequest").hideCol("DeleteDate");
        $("#jqManageMyPeriodProjectBaseDBRequest").hideCol("DeleteRemark");
        
        getObj("btnEdit_tb").style.display = "";
        getObj("btnRevision_tb").style.display = "";
        getObj("btnDelete_tb").style.display = "";
        getObj("btnDeleteAll_tb").style.display = "none";
        getObj("btnResume_tb").style.display = "none";
    }
    
    filterData();
}
//选择我的页面项目阶段文件
var selectPPValue=function()
{
    var ProjectID=getObj("ddlProject").value;
    if(ProjectID!=""){
        var SMR=openModalWindow("../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID="+ProjectID,800,600);
        if(SMR!=null&&SMR!="")
        {
            getObj("hidPPID").value=SMR.split('|')[0];
            getObj("hidPPName").value=SMR.split('|')[1];     
            getObj("hlPPName").value=SMR.split('|')[1]; 
        }
    }else{
        return alertMsg("请选择项目",getObj("ddlProject"));
        return false;
    }
    
    filterData();
    
    return true;
}
//格式化名称
var renderName=function(value,pt,record)
{
    var vUrl="'VMyPeriodProjectBaseDBRequestBrowse.aspx?ID=" + record[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',1000,800)">' + value + '</a></div>';
}

//选择起草人
function selectAccount(aim)
{
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?type=account&From=Leave&CorpID=', 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//环节调整
function btnRevision_Click()
{
    openRevisionWindow("jqManageMyPeriodProjectBaseDBRequest");
}
//删除
function btnDelete_Click()
{
   openDeleteWindow("DeleteMyPeriodProjectBaseDBRequest", 4, "jqManageMyPeriodProjectBaseDBRequest");
}
//彻底删除
function btnDeleteAll_Click()
{
    openDeleteWindow("DeleteMyPeriodProjectBaseDBRequestAll", 4, "jqManageMyPeriodProjectBaseDBRequest");
}
//还原
function btnResume_Click()
{
    openResumeWindow("PeriodProjectBaseDBRequest", "jqManageMyPeriodProjectBaseDBRequest");
}
//修改
function btnEdit_Click()
{
   openModifyWindow("VManagePeriodProjectBaseDBRequestEdit.aspx", 0, 0, "jqManageMyPeriodProjectBaseDBRequest");
}
