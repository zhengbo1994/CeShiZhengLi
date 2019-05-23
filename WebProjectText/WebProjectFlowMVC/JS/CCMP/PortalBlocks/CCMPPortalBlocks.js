
//***************************************项目一级科目动态成本图表**********************************//
//显示一级科目动态成本(项目门户)
function showFirstSubjectDynamic(projectID, subjectID, endDate)
{
    var url = "/" + rootUrl + "/Common/PortalBlocks/CCMP/Common/VProjectSubjectObjectDynamicCostList.aspx?";

    url += 'SubjectID='+subjectID+'&ProjectID=' + projectID + '&EndDate=' + endDate ;
    openWindow(url, 1000, 800);
}
//***************************************项目整动态成本预警图表**********************************//
//显示项目动态成本(项目门户)
function showProjectDynamic(projectID, endDate)
{
    var url = "/" + rootUrl + "/Common/PortalBlocks/CCMP/Common/VDynamicCostList.aspx?";

    url += 'ProjectID=' + projectID + '&EndDate=' + endDate;
    openWindow(url, 1000, 800);
}

//***************************************项目一级核算对象动态成本图表**********************************//
//显示一级核算对象动态成本(项目门户)
function showObjectDynamic(projectID, objectID, endDate)
{
    var url = "/" + rootUrl + "/Common/PortalBlocks/CCMP/Common/VProjectObjectCostChartList.aspx?";

    url += 'ObjectID='+objectID+'&ProjectID=' + projectID + '&EndDate=' + endDate;
    openWindow(url, 1000, 800);
}

