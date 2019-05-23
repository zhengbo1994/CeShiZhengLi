// Portal.aspx（业务首页）中用到的js

// 显示子模块页
function showPortal(index, sysModule)
{
    selectTab(index, "IDPortalTab");
    switch (sysModule)
    {
        case "OA":
            window.frames("IDModTabFrame").location = "DefaultPortal.aspx";
            break;
        case "WaitDo":
            window.frames("IDModTabFrame").location = "../Common/Personal/VWaitDo.aspx";
            break;
        case "WaitRead":
            window.frames("IDModTabFrame").location = "../Common/Personal/VWaitRead.aspx";
            break;
        case "ProjectPlan":
            window.frames("IDModTabFrame").location = "../POM/DevPlanExecute/VGPDevPlanCompleteStatusChart.aspx?IDM_CD=2";
            break;
        case "ZBCockpit":
            window.frames("IDModTabFrame").location = "../ZBidding/BI/VManagementCockpit.aspx";
            break;
        case "CCMCockpit":
            window.frames("IDModTabFrame").location = "../CCMP/BI/Cockpit/VProjectCockpit.aspx";
            break;
    }
}