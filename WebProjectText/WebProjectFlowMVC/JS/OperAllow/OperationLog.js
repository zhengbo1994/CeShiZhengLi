// JScript 文件

function reloadData()
{
    var varCompany = $("#ddlCompany").val();     
    var query = $("#txtKW").val();
    var vStartTime = $("#txtSD").val();
    var vEndTime = $("#txtED").val();    
    
    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
    
        if (date1 > date2)
        {
            return alertMsg("结束时间必须大于开始时间。", getObj("txtED"));
        }
    }
    
    $('#jqOperationLog',document).getGridParam('postData').SD=vStartTime;
    $('#jqOperationLog',document).getGridParam('postData').ED=vEndTime;
    $('#jqOperationLog').getGridParam('postData').CorpID=varCompany;  
    $('#jqOperationLog').getGridParam('postData').KW=query;
    refreshJQGrid("jqOperationLog");
}

function MyreloadData()
{ 
    var query = $("#txtKW").val();
    var vStartTime = $("#txtSD").val();
    var vEndTime = $("#txtED").val();    
    
    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
    
        if (date1 > date2)
        {
            return alertMsg("结束时间必须大于开始时间。", getObj("txtED"));
        }
    }
    
    $('#jqOperationLog',document).getGridParam('postData').SD=vStartTime;
    $('#jqOperationLog',document).getGridParam('postData').ED=vEndTime;
    $('#jqOperationLog').getGridParam('postData').KW=query;
    refreshJQGrid("jqOperationLog");
}

function showMyTraceLog(cellvalue, options, rowobject)
{
    return '<a href="#ShowLog" onclick="openWindow(\'VMyLogBrowse.aspx?LogID=' + options.rowId + '\',500,360)">' + cellvalue + '</a>' ;
}