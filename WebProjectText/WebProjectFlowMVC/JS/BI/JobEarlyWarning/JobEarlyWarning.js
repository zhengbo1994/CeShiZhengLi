function selectPD()
{
    window.PD_CorpID = $('#hidCorpID').val();
    window.CorpDisable = $('#hidCorpDisable').val();
    openModalWindow('../../Common/Select/VSelectProjectOrDept.aspx?ModuleCode=ZBidding', 600, 500);
}

function reloadEWData()
{    
    var query =
    {
        PDID: $("#hidPDID").val(),
        EWType: $('#ddlEWType').val(),
        HandleType: $('#ddlHandleType').val(),
        WarningState: $('#ddlWarningState').val(),
        KW: $('#txtKW').val()
    };        
    
    if(loadJQGrid('jqEWS',query))
    {
        refreshJQGrid("jqEWS");  
    } 
}

function changeHandleType(ddl)
{
    var handleType = ddl.value;

    var batchReadMenu = "Setting|ReadBatch|标为已阅",
        batchHandleMenu = "Delegate|DelegateBatch|安排拟办,Finish|FinishBatch|填报处理情况,Startup|StartupBatch|不处理标为已阅";

    //处理批量操作
    if (handleType == '' || handleType == '2')
    {
        $('#btnBatch').hide();        
    }
    else if (handleType == '1')
    {
        $('#btnBatch').show().attr('menu', batchReadMenu);        
    }
    else
    {
        $('#btnBatch').show().attr('menu', batchHandleMenu);
    }

    //处理待办类型
    if (handleType == "0")
    {
        getObj("ddlWarningState").selectedIndex = 1;
        getObj("ddlWarningState").disabled = true;
    }
    else
    {
        getObj("ddlWarningState").selectedIndex = 0;
        getObj("ddlWarningState").disabled = false;
    }
}

function renderEW(cl, opt, rl)
{
    return "<div><a href=\"javascript:openWindow('VJobEarlyWarningWorkBrowse.aspx?JQID=jqEWS&JEWID=" + opt.rowId + "',850,650);\">" + cl + "</a></div>";
}
function renderState(cl, opt, rl)
{
    return cl;
}

function renderEWJob(cl, opt, rl)
{
    var relatedID = rl[0];
    var warningType = rl[1];
    var warningModule = rl[2];    
    var sourceOpt = rl[5];
    var JEWID = opt.rowId;
    var projectID=rl[8];
    //edit by 杜锋 2013-12-23
    if (warningModule == 0 && warningType == 1)
        return cl; //运营"任务取消"：不显示超链接，只显示任务名称
    else
        return "<div><a href=\"javascript:showEWJob('" + relatedID + "','" + warningModule + "','" + warningType + "','" + sourceOpt + "','" + JEWID + "','" + projectID + "')\">" + cl + "</a></div>";
}

function renderEWState(cl, opt, rl)
{
    var cellValue = "";
    if (cl == "0")
    {
        cellValue = "不需处理";
    }
    else if (cl == "1")
    {
        cellValue = "待处理";
        if (rl[7] == "2")
        {
            cellValue += "(<a href=\"javascript:void(0);\" onclick=\"showEWProgram('" + rl[3] + "');\">方案审批</a>)";
        }
    }
    else if (cl == "2")
    {
        cellValue = "处理完毕";
    }
    
    return cellValue;
}

function showEWJob(relatedID, warningModule, warningType, sourceOpt, JEWID,projectID,sourceID)
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

    var url= "/" + rootUrl + "/";
    warningType = parseInt(warningType, 10);
    sourceOpt = parseInt(sourceOpt, 10);

    //运营
    if (warningModule == "0")
    {
        //取消预警（任务删除），只能从历史表中查看任务明细
        if (warningType == 1)
        {
            if (!sourceOpt || sourceOpt == 0)
            {
                url += "POM/Plan/VWBSHistoryBrowse.aspx?WBSID=" + relatedID + "&WBSCID=" + sourceID;
            }
            // 阶段性成果
            if (sourceOpt == 1) {
                url += "POM/ProjectHarvest/VProjectHarvestChangeBrowse.aspx?ID=" + relatedID + "&WBSCID=" + sourceID;
            }
            // 会议决策
            else if (sourceOpt == 2) {
                url += "POM/MeetingDecision/VMeetingDecisionChangeBrowse.aspx?ID=" + relatedID + "&WBSCID=" + sourceID;
            }
            //月度计划
            else if (sourceOpt == 4)
            {
                url += "POM/Plan/VWorkTaskChangeBrowse.aspx?ID=" + relatedID + "&WBSCID=" + sourceID;
            }
        }
        else if (warningType <= 4 || warningType == 7 || warningType == 8)
        {
            if(!sourceOpt || sourceOpt == 0)
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
                url += "POM/Plan/QualitySecurityPlan/VQualitySecurityPlanBrowse.aspx?ID=" + relatedID;
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
            // 质量缺陷 (预警主体为任务)
            if (sourceOpt == 0)
            {
               // url += "POM/Quality/VTaskQualityDefectView.aspx?ID=" + relatedID;
               url += "POM/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
            // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "POM/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
        else if (warningType == 6)
        {
            // 安全事故(预警主体为任务)
            if (sourceOpt == 0)
            {
                //url += "POM/Security/VTaskSecurityAccidentView.aspx?ID=" + relatedID;
                url += "POM/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
            // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "POM/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
    }
    //成本
    else if (warningModule == "1")
    {
        // 项目
        if (warningType == 0)
        {
            url += "CCMP/BI/Warning/WarningBrowse/VProjectSubjectDynamicCost.aspx?RelatedID="+relatedID+"&JEWID=" + JEWID;
        }
        // 科目
        else if (warningType == 1)
        {
            url += "CCMP/BI/Warning/WarningBrowse/VProjectSubjectDynamicCost.aspx?RelatedID="+relatedID+"&JEWID=" + JEWID;
        }
        // 合同
        else if (warningType == 2)
        {
            url += "CCMP/DynamicCost/VProjectContractClassDynamicCost.aspx?JEWID=" + JEWID + "&CCID=" +relatedID;
        }
        // 合同（合约超标）
        else if (warningType == 3) {
            url += "CCMP/Contract/VContractBrowse.aspx?JEWID=" + JEWID + "&ContractID=" + relatedID;
        }
        //科目已发生成本超标
        else if (warningType == 4)
        {
            url += "CCMP/BI/Warning/WarningBrowse/VSubjectHappenedCost.aspx?IsOption=ProjectSubject&RealID=" + projectID + "&SubjectID=" + relatedID + "&JEWID=" + JEWID;
        }
    }
    //采购
    else if (warningModule == "2")
    {
        if (warningType == 1)
        {
            // 战略采购计划明细
            if (sourceOpt == 0)
            {
                url += "ZBidding/NewZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PType=2&PZBPLID=" + relatedID;
            }
                //项目采购计划明细
            else if (sourceOpt == 1)
            {
                url += "ZBidding/NewZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PType=4&PZBPLID=" + relatedID;
            }
        }
            // 单项采购计划
        else if (warningType == 0|| warningType == 2 || warningType == 3)
        {
            url += "ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + relatedID;
        }

    }
    //投资管理
    else if (warningModule == "7")
    {
        //投资计划执行 指标预警,链接到"我的##页面"
        if (warningType == 0)
        {
            url += "CTSIM/ProjectInvestPlanExecute/VProjectInvestPlanExecute.aspx";
        }
        //月度资本性支出报表延期(warningType=1),
        //资本性支出预算汇总报表延期(warningType=5).链接到"年度预算浏览页"
        else if (warningType == 1 || warningType == 5)
        {
            url += "CTSIM/CapitalPayPlan/VCapitalPayPlanBrowse.aspx?ID=" + relatedID;
        }
        //招标报表上报延期,链接到"季度预算待办页"
        else if (warningType == 2)
        {
            //url += "CTSIM/BiddingPlanFormation/VBiddingPlanFormationBrowse.aspx?ID=" + relatedID;
            url += "CTSIM/BiddingPlanFormation/VWaitBiddingPlanFormation.aspx";
        }
        //招标报表执行延期,链接到"季度预算浏览页"
        else if (warningType == 3)
        {
            url += "CTSIM/BiddingPlanFormation/VBiddingPlanFormationBrowse.aspx?ID=" + relatedID;
        }
        //资本性支出执行进度预警(warningType=4), 
        //资本性支出执行汇总报表延期(warningType=6). 链接到"年度执行浏览页"
        if (warningType == 4 || warningType == 6)
        {
            url += "CTSIM/CapitalPayExecute/VCapitalPayExecuteBrowse.aspx?ID=" + relatedID;
        }
    }
    else if (warningModule == "8")
    {
        if (warningType <= 4 || warningType == 7 || warningType == 8)
        {
            if (!sourceOpt || sourceOpt == 0)
            {
                url += "Product/TaskManage/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
            // 阶段性成果
            if (sourceOpt == 1)
            {
                url += "Product/TaskManage/ProjectHarvest/VProjectHarvestBrowse.aspx?ID=" + relatedID;
            }
                // 会议决策
            else if (sourceOpt == 2)
            {
                url += "Product/TaskManage/MeetingDecision/VMeetingDecisionBrowse.aspx?ID=" + relatedID;
            }
                // 质量安全
            else if (sourceOpt == 3)
            {
                url += "Product/TaskManage/Plan/QualitySecurityPlan/VQualitySecurityPlanBrowse.aspx?ID=" + relatedID;
            }
                // 月度计划
            else if (sourceOpt == 4)
            {
                url += "Product/TaskManage/Plan/VWorkTaskBrowse.aspx?ID=" + relatedID;
            }
                // 竣工验收项
            else if (sourceOpt == 5)
            {
                url += "Product/TaskManage/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
        else if (warningType == 5)
        {
            // 质量缺陷 (预警主体为任务)
            if (sourceOpt == 0)
            {
                // url += "POM/Quality/VTaskQualityDefectView.aspx?ID=" + relatedID;
                url += "Product/TaskManage/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
                // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "Product/TaskManage/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
        else if (warningType == 6)
        {
            // 安全事故(预警主体为任务)
            if (sourceOpt == 0)
            {
                //url += "POM/Security/VTaskSecurityAccidentView.aspx?ID=" + relatedID;
                url += "Product/TaskManage/Plan/VWBSBrowse.aspx?WBSID=" + relatedID;
            }
                // 竣工验收项
            else if (sourceOpt == 1)
            {
                url += "Product/TaskManage/ProjectData/VProjectCompleteBrowse.aspx?PCID=" + relatedID;
            }
        }
    }
    //成本发票抵扣认证预警
    else if (warningModule == "9")
    {
        if (warningType == 0)
        {
            url += "CCMP/Pay/Invoice/VMyInvoiceBrowse.aspx?InvoiceID=" + relatedID;
        }
        else if (warningType == 1)
        {
            url += "POM/ProjectData/VProjectDataBrowse.aspx?ProjectID=" + relatedID;
        }
    }
    
    openWindow(url,0,0);
}

function showEW(jewID)
{
    if (jewID == null)
    {
        jewID = getObj("hidJEWID").value;
    }
    openWindow("/" + rootUrl + "/BI/JobEarlyWarning/VJobEarlyWarningWorkBrowse.aspx?JQID=jqEWS&JEWID=" + jewID, 800, 600);
}

function showEWProgram(hprid)
{
    openWindow("/" + rootUrl + "/BI/JobEarlyWarning/VHandleProgramRequestBrowse.aspx?HPRID=" + hprid, 0, 0);
}

function renderHandleMenu(cl, opt, rl)
{
    /*
    如果handleType = '0' 则是等待处理的 ='1'时则是送阅给我的
    如果souceType='0'是系统的处理人，可以不处理标为已阅，其它的不考虑
    */
    var jewID = opt.rowId;
    var handleType = rl[6];
    var sourceType = rl[4];
    if (handleType == '1')
    {
        return "<a href=\"javascript:readEW('" + jewID + "','N');\">标为已阅</a>";
    }
    else if (handleType == '0')
    {
        var strCode = sourceType == '0' ? '1111' : '1110';
        return "<a clickArgs=\"" + opt.rowId + "\"  menu=\"Delegate|安排拟办,Decompound|处理方案和情况申报,Finish|填报处理情况,Startup|不处理且标为已阅\" oncontextmenu=\"showDLMenu(this,'" + strCode + "');return false;\"  onclick=\"showDLMenu(this,'" + strCode + "');\" href=\"javascript:void(0);\" menuwidth=\"150\">" + cl + "</a>";
    }
    else
    {
        return '&nbsp;';
    }
}

function clickMenu()
{
    var args=arguments;    
    var key=args[0];
    var sJEWID=args[1];
    var url='';
    switch (key)
    {
        case "Startup": //不处理，标为已阅 
            readEW(sJEWID, 'Y');            
            break;
        case "Decompound": //处理方案和情况申报
            openWindow("VHandleProgramRequest.aspx?JQID=jqEWS&JEWID=" + sJEWID, 950, 700);
            break;
        case "Delegate": //安排拟办
            openWindow("VArrangeExecuteEarlyWarning.aspx?JQID=jqEWS&JEWID=" + sJEWID, 500, 350);            
            break;
        case "Finish": //填报处理情况           
            openWindow("VWriteHandleReport.aspx?JQID=jqEWS&JEWID=" + sJEWID, 500, 350);
            break;
        case "ReadBatch":    //批量标为已阅读
        case "StartupBatch": //批量不处理标为已阅
        case "DecompoundBatch": //批量处理方案和情况申报
        case "DelegateBatch": //批量安排拟办
        case "FinishBatch": //批量填报处理情况            
            batchHandle(key);
            break;
    }
}

function batchHandle(key)
{
    var selectedIDS = getJQGridSelectedRowsID('jqEWS', true);
    if (selectedIDS.length <= 0)
    {
        return alertMsg('请选择需要处理的预警。');
    }
    var url = '', checkMsgs = [];

    if (key == 'ReadBatch') //阅读
    {        
        url = 'VReadJobEarlyWarning.aspx?JQID=jqEWS&IsHandler=N';
    }
    else if (key == 'StartupBatch')    //不处理标为已阅
    {
        url = 'VReadJobEarlyWarning.aspx?JQID=jqEWS&IsHandler=Y';
    }
    else if (key == 'DelegateBatch')    //安排拟办
    {
        url = 'VArrangeExecuteEarlyWarning.aspx?JQID=jqEWS';
    }
    else if (key == 'FinishBatch')     //填报处理情况
    {
        url = 'VWriteHandleReport.aspx?JQID=jqEWS';
    }

    if (selectedIDS.length == 1)
    {
        url = url + '&JEWID=' + selectedIDS;
    }
    else
    {
        window['BatchEdit_JEWIDs'] = selectedIDS;
    }
    
    openWindow(url, 500, 350);
}

function readEW(jewID,isHandle)
{
    if (isHandle)
    {
        openWindow("VReadJobEarlyWarning.aspx?JQID=jqEWS&JEWID=" + jewID + "&IsHandler=" + isHandle, 550, 400);
    }
    else
    {
        openWindow("VJobEarlyWarningWorkBrowse.aspx?JQID=jqEWS&JEWID=" + jewID + "&IsHandler=" + isHandle, 800, 600);
    }
    //openWindow("VReadJobEarlyWarning.aspx?JQID=jqEWS&JEWID=" + jewID + "&IsHandler="+isHandle,500,350);
}

function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
}