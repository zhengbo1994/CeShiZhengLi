///改变被选中的节点样式 报表类型页调用  
function changeBackColor(span)
{
    var obj=document.getElementsByName("ReportType");
    for(i = 0; i <obj.length; i++)
    {
         obj(i).className='normalNode';
    }
    span.className = "selNode";
} 

///切换报表类型 报表类型页调用 
function refreshFiles(corpID, projectID, rtID)
{
    var jqID=$('#jqGrid1',window.parent.frames('frmMain').document);        
    addParamsForJQGridQuery(jqID,[{QueryReportOption:$('#hidReportOption').val(),QueryCorpID:corpID,QueryProjectID:projectID,QueryRTID:rtID}]);    
    window.parent.frames('frmMain').window.refreshJQGrid('jqGrid1');
    //window.parent.frames("frmMain").location = "VReportCenterList.aspx?ReportOption="+$('#hidReportOption').val()+"&CorpID=" + corpID + "&ProjectID=" + projectID + "&RTID=" + rtID;
}       

function showReport(fromOption, reportID, url)
{
    if (fromOption == "0")
    {
        openWindow("/" + rootUrl + "/" + url, 800, 600);
    }
    else if (fromOption == "1")
    {
        openWindow("../CustomReport/VCustomReportBrowse.aspx?From=BI&CRID=" + reportID, 800, 600);
    }
}

///列表页调用 
function renderLink(cl,opt,rl)
{
   return "<div class=\"nowrap\"><a href=\"javascript:showReport('"+rl[0]+"','"+rl[1]+"','"+rl[2]+rl[3]+"');\">"+cl+"</div>";
}

///导出时，数据全都设为整数
function renderNumberForExport(exportHtml)
{
    var exportObj = $(exportHtml);
    exportObj.find(".dgNumSpan").each(function ()
    {
        var num = $(this).text();
        $(this).text(getRound(num, 0));
    });
    return exportObj[0].outerHTML;
 
}

//打开个人报表配置页面
function OpenConfigure()
{
    openWindow("../../OperAllow/Report/VReportCenterConfig.aspx?IDM_CD=1", 960, 760);
}


//打开报表类型设置页面
function OpenSetting()
{
    openWindow("../../OperAllow/Report/VReportType.aspx?IDM_CD=1", 960, 760);
}