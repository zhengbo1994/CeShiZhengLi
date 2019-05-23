function LoadFlowAuditInfo()
{
    
    $.post('VCorpFlowAuditAnalysis.aspx', { action: 'GetFlowAuditInfoCorp', StartTime: $("#txtStartTime").val(), EndTime: $("#txtEndTime").val() },
         function (data, textStatus)
         {
             load(data);
         }, 'html');
}


function load(xmlContentText)
{
    $("#divMPList")

    var x = $("#divMPList").width()-100;
    var y =$("#divMPList").height()-100;

    var swfUrl = $("#hidRootPath").val() + '/Common/Flash/MSColumn3DLineDY.swf';
    var chart = new FusionCharts(swfUrl, "ChartId", '' + x, '' + y, "0", "0");
    chart.setDataXML(xmlContentText);
    chart.render('divLineChartContainer');
}

function btnSearch_Click()
{
    LoadFlowAuditInfo();
}