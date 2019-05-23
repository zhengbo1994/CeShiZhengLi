// JScript 文件

/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-系统管理-系统登陆日志
 * 文件类型：Urgency.js
 * 作    者：魏守国
 * 时    间：2010-5-10
 */
 
 
 
var reloadData = function()
{
    var varCompany=$("#ddlCompany").val();     
    var strSearch = $("#txtKW").val();
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
    
    $('#jqLoginLog',document).getGridParam('postData').SD=vStartTime;
    $('#jqLoginLog',document).getGridParam('postData').ED=vEndTime;
    $('#jqLoginLog').getGridParam('postData').Company=varCompany;  
    $('#jqLoginLog').getGridParam('postData').SearchText=strSearch;    
    refreshJQGrid('jqLoginLog'); ;
}

var MyreloadData = function()
{
    var strSearch = $("#txtKW").val();
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
    
    $('#jqLoginLog',document).getGridParam('postData').SD=vStartTime;
    $('#jqLoginLog',document).getGridParam('postData').ED=vEndTime;
    $('#jqLoginLog').getGridParam('postData').SearchText=strSearch;    
    refreshJQGrid('jqLoginLog'); ;
}