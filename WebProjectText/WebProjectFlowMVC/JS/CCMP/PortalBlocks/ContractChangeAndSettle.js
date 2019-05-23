//***************************************变更图表**********************************//
//显示变更成本
function showContractChange(projectID, startDate, endDate)
{
    if (projectID != "")
    {
        var url = "/" + rootUrl + "/";
        if (projectID.split(',').length == 1)  //一个项目
        {
            url = url + "CCMP/BI/Tracing/VProjectTracingDetail.aspx?";
        }
        else      //多项目的
        {
            url += "CCMP/BI/Cockpit/ProjectCompare/VProjectCompareDetail.aspx?";
        }
        url += 'DateOption=Month&Action=ContractChange&ProjectID=' + projectID + '&EndDate=' + endDate + '&StartDate=' + startDate;
        openWindow(url, 800, 600);
    }
}
//***************************************变更图表**********************************//


//***************************************结算图表**********************************//
//显示结算图表的（签约成本） （项目门户）
function showProjectContract(projectID, startDate, endDate)
{
    showProjectSettlement(projectID, startDate, endDate, true)
}

//显示结算图表的（结算成本） （项目门户）
function showProjectSettlement(projectID, startDate, endDate, isContract)
{
    if (projectID != "")
    {
        var url = "/" + rootUrl + "/";
        if (projectID.split(',').length == 1)  //一个项目
        {
            url = url + "CCMP/BI/Tracing/VProjectTracingDetail.aspx?";
        }
        else      //多项目的
        {
            url += "CCMP/BI/Cockpit/ProjectCompare/VProjectCompareDetail.aspx?";
        }
        var Action = isContract ? "Contract" : "Settlement";
        url += 'DateOption=Month&Action=' + Action + '&ProjectID=' + projectID + '&StartDate=' + startDate + '&EndDate=' + endDate;
        openWindow(url, 800, 600);
    }
}


//显示结算图表的（结算成本） （公司门户）
function showContractSettlementForCorp(projectID, startDate, endDate)
{
    if (projectID != "")
    {
        var url = "/" + rootUrl + "/";

        if (projectID.split(',').length == 1)  //一个项目
        {
            url += "CCMP/BI/Tracing/VProjectTracingDetail.aspx?";
        }
        else      //多项目的
        {
            url += "CCMP/BI/Cockpit/ProjectCompare/VProjectDetail.aspx?";
        }
        url += 'DateOption=Month&Action=Settlement&ProjectID=' + projectID + '&EndDate=' + endDate + '&StartDate=' + startDate;
        openWindow(url, 800, 600);
    }

}

//显示结算图表的（签约成本） （公司门户）
function showProjectContractForCorp(projectID, startDate, endDate)
{
    showContractSettlementForCorp(projectID, startDate, endDate);
}

//***************************************结算图表**********************************//
