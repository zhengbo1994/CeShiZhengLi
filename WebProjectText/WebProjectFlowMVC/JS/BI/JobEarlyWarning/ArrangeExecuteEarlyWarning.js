function openSelectLookAccount()
{
    var rValue=openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID='+$('#hidCorpID').val(),800,600);
    if(!rValue)
        return;
  
    $('#hidExecuteAccountID').val(rValue.split('|')[0]);
    $('#txtExecuteAccount').val(rValue.split('|')[1]);    
} 

function validateSize()
{    
    setBtnEnabled('btnSaveClose',false);
    if($('#hidExecuteAccountID').val().length<=0)
    {
        setBtnEnabled('btnSaveClose',true);
        return alertMsg('拟办人不能为空。',$('#txtExecuteAccount').get(0));
    }
    if($('#txtAppointDescription').val().length<=0)
    {
        setBtnEnabled('btnSaveClose',true);
        return alertMsg('安排意见不能为空。',$('#txtAppointDescription').get(0));
    }
    
    return true;    
}

//modify by dinghuan @2012-12-01 加上参数JEWID，用于成本预警链接
function showEWJob(relatedID, warningModule, warningType, sourceOpt, JEWID)
{
    if (relatedID == null)
    {
        relatedID = getObj("hidRelatedID").value;
    }
    if (warningModule == null)
    {
        warningModule = getObj("hidWarningModule").value;
    }
    if (warningType == null)
    {
        warningType = getObj("hidWarningType").value;
    }
    if (sourceOpt == null)
    {
        sourceOpt = getObj("hidSourceOpt").value;
    }

    var url = "/" + rootUrl + "/";
    warningType = parseInt(warningType, 10);
    sourceOpt = parseInt(sourceOpt, 10);
    if (warningModule == "0")
    {
        if (warningType <= 4)
        {
            if (!sourceOpt || sourceOpt == 0)
            {
                url += "POM/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
            // 阶段性成果
            if (sourceOpt == 1)
            {
                url += "POM/ProjectHarvest/VProjectHarvestBrowse.aspx?ID=" + relatedID;
            }
            // 会议决策
            else if (sourceOpt == 2)
            {
                url += "POM/MeetingDecision/VMeetingDecisionBrowse.aspx?ID=" + relatedID;
            }
            // 质量安全
            else if (sourceOpt == 3)
            {
                url += "POM/ProjectQaulitySecurity/VProjectQaulitySecurityBrowse.aspx?ID=" + relatedID;
            }
            // 月度计划
            else if (sourceOpt == 4)
            {
                url += "POM/Plan/VWorkTaskBrowse.aspx?ID=" + relatedID;
            }
            // 竣工验收项
            else if (sourceOpt == 5)
            {
                url += "POM/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
        else if (warningType == 5)
        {
            // 质量缺陷
            if (sourceOpt == 0)
            {
                url += "POM/Quality/VTaskQualityDefectView.aspx?ID=" + relatedID;
            }
            // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "POM/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
        else if (warningType == 6)
        {
            // 安全事故
            if (sourceOpt == 0)
            {
                url += "POM/Security/VTaskSecurityAccidentView.aspx?ID=" + relatedID;
            }
            // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "POM/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
    }
    else if (warningModule == "1")
    {
        //modify by dinghuan @2012-12-01 修改 1、2的链接，加上3类型
        // 项目
        if (warningType == 0)
        {
            url += "CCMP/Project/VProjectBrowse.aspx?ProjectID=" + relatedID;
        }
        // 科目
        else if (warningType == 1)
        {
            url += "CCMP/BI/Warning/WarningBrowse/VProjectSubjectDynamicCost.aspx?RelatedID=" + relatedID + "&JEWID=" + JEWID;
        }
        // 合同
        else if (warningType == 2)
        {
            url += "CCMP/DynamicCost/VProjectContractClassDynamicCost.aspx?JEWID=" + JEWID + "&CCID=" + relatedID;
        }
        // 合同（合约超标）
        else if (warningType == 3)
        {
            url += "CCMP/Contract/VContractBrowse.aspx?JEWID=" + JEWID + "&ContractID=" + relatedID;
        }
    }
    else if (warningModule == "2")
    {
        // 项目采购计划明细
        if (warningType == 0)
        {
            url += "ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + relatedID;
        }
        else if (warningType == 1)
        {
            // 项目采购计划明细
            if (sourceOpt == 0)
            {
                url += "ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + relatedID;
            }
            // 单项采购计划
            else if (sourceOpt == 1)
            {
                url += "ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + relatedID;
            }
        }
        // 单项采购计划
        else if (warningType == 2 || warningType == 3)
        {
            url += "ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + relatedID;
        }
    }
    else if (warningModule == "8") {
        if (warningType <= 4 || warningType == 7 || warningType == 8) {
            if (!sourceOpt || sourceOpt == 0) {
                url += "Product/TaskManage/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
        }
    }

    openWindow(url, 0, 0);
}

function showEW(jewID)
{
   
    openWindow("/" + rootUrl + "/BI/JobEarlyWarning/VJobEarlyWarningWorkBrowse.aspx?JEWID=" + jewID, 800, 600);
}