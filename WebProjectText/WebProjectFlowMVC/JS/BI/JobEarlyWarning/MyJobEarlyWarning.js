function selectPD()
{
    openModalWindow('../../Common/Select/VSelectProjectOrDept.aspx', 400, 450);
}

function reloadData()
{
    var query =
        [{
            PDID: $("hidPDID").val(),
            EWType: $('#ddlEWType').val(),
            HandleType: $('#ddlHandleType').val(),
            WarningState: $('#ddlWarningState').val(),
            KW: $('#txtKW').val()
        }];
    
    addParamsForJQGridQuery("jqGrid1", query);
    refreshJQGrid("jqGrid1");   
}

function changeHandleType(ddl)
{
    if (ddl.value == "0")
    {
        getObj("ddlEWType").selectedIndex = 1;
        getObj("ddlEWType").disabled = true;
    }
    else
    {
        getObj("ddlEWType").disabled = false;
    }
}

function showEWProgram(hprid)
{
    openWindow('VHandleProgramRequestBrowse.aspx?HPRID=' + hprid, 0, 0);
}

function renderEW(cl, opt, rl)
{
    return "<a href=\"javascript:openWindow('VJobEarlyWarningWorkBrowse.aspx?JQID=jqGrid1&JEWID=" + opt.rowId + "',800,600);\">" + cl + "</a>";

}

function renderEWJob(cl, opt, rl)
{
    var relatedID = rl[1];
    var warningModule = rl[3];
    var warningType = rl[2];
    var sourceOpt = rl[7];
    
    return "<a href=\"javascript:showEWJob('" + relatedID + "','" + warningModule + "','" + warningType + "','" + sourceOpt + "')\">" + cl + "</a>"; 
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
        if (rl[4] == "2")
        {
            cellValue += "(<a href=\"#ShowEWProgram\" onclick=\"showEWProgram('" + rl[5] + "')\">方案</a>)";
        }
    }
    else if (cl == "2")
    {
        cellValue = "处理完毕";
    }
    
    return cellValue;
}

function renderHandleMenu(cl,opt,rl)
{    
    var strCode = (rl[6] == '0' ? '1111' : '1110');
    return "<a clickArgs=\""+rl[0]+"\"  menu=\"Startup|安排拟办,Decompound|处理方案和情况申报,Delegate|填报处理情况,Finish|不处理且标为已阅\" oncontextmenu=\"showDLMenu(this,'"+strCode+"');\"  onclick=\"showDLMenu(this,'"+strCode+"');\" href=\"javascript:void(0);\">"+cl+"</a>"; 
}

function showEWJob(relatedID, warningModule, warningType, sourceOpt)
{
    var url= "/" + rootUrl + "/";
    warningType = parseInt(warningType, 10);
    sourceOpt = parseInt(sourceOpt, 10);
    if (warningModule == "0")
    {
        if (warningType <= 4 || warningType == 7 || warningType == 8)
        {
            url += "POM/WBS/VWBSBrowse.aspx?WBSID=" + relatedID;
            // 阶段性成果
            if (sourceOpt == 1)
            {
                url += "";
            }
            // 会议决策
            else if (sourceOpt == 2)
            {
                url += "";
            }
            // 质量安全
            else if (sourceOpt == 3)
            {
                url += "";
            }
            // 月度计划
            else if (sourceOpt == 4)
            {
                url += "";
            }
        }
        else if (warningType == 5)
        {
            url += "POM/Quality/VTaskQualityDefectView.aspx?ID=" + relatedID;
        }
        else if (warningType == 6)
        {
            url += "POM/Security/VTaskSecurityAccidentView.aspx?ID=" + relatedID;
        }
        else if (warningType <= 9)
        {
            url += "POM/PlanExecute/ProjectCompleteExecute/VProjectCompleteExecute.aspx?ID=" + relatedID;
        }
    }
    else if (warningModule == "1")
    {
        if (warningType == 0)
        {
            url += "CCMP/Project/VProjectBrowse.aspx?ProjectID=" + relatedID;
        }
        // 科目
        else if (warningType == 1)
        {
            url += "";
        }
        else if (warningType == 2)
        {
            url += "CCMP/Contract/VMyContractHaveSave.aspx?ContractID=" + relatedID;
        }
    }
    else if (warningModule == "2")
    {
        if (warningType >= 0 && warningType <= 4)
        {
            url += "ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + relatedID;
        }
    } 
    
    openWindow(url, 0, 0);
}

function showEWProgram(hprid)
{
    openWindow("VHandleProgramRequestBrowse.aspx?HPRID=" + hprid, 0, 0);
}

function clickMenu()
{
    var args=arguments;
    var key=args[0];
    var sJEWID=args[1];
    var url='';
    switch (key)
    {
        case "Startup": //安排拟办
            openWindow("VArrangeExecuteEarlyWarning.aspx?JQID=jqGrid1&JEWID=" + sJEWID, 500, 350);
            break;
        case "Decompound": //处理方案和情况申报
            openWindow("VHandleProgramRequest.aspx?JQID=jqGrid1&JEWID=" + sJEWID, 0, 0);
            break;
        case "Delegate": //填报处理情况
            openWindow("VWriteHandleReport.aspx?JQID=jqGrid1&JEWID=" + sJEWID, 500, 350);
            break;
        case "Finish": //不处理，标为已阅
            openWindow("VReadJobEarlyWarning.aspx?JQID=jqGrid1&JEWID=" + sJEWID + "&IsHandler=Y",500,300);
            break;
    }
}