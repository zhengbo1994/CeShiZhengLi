// JScript 文件

function ddlCorpChange()
{
    ajaxRequest('VCheckTachStatic.aspx',{AjaxGetType:'true',AjaxCorpID:$('#ddlCorp').val()},'json',function (data, textStatus){loadType(data);},false);
}

function loadType(data)
{
    $('#ddlCheckStaticType option').remove();
    $('#ddlCheckStaticType').get(0).options.add(new Option('请选择','')) ;    
    $(data).each(function(i)
    {
        $('#ddlCheckStaticType').get(0).options.add(new Option(data[i].text,data[i].value));
    });
}

function validateSize()
{
     if($('#ddlCorp').val()=="")
    {
      return alertMsg("请选择公司。", getObj('ddlCorp')); 
    }    
    
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();
    
    if(vStartTime == "" | vEndTime == "")
    {
        return alertMsg("请选择时间。", getObj('txtStartTime')); 
    }

    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);

        if (date1 > date2)
        {
            return alertMsg("结束日期必须晚于开始日期。", $("#txtEndTime"));
        }
    }    
    
    if($('#ddlCheckStaticType').val()=="")
    {
      return alertMsg("请选择统计类别。", getObj('ddlCheckStaticType')); 
    }       
  
    var vUrl = "";
    switch ($('#ddlStaticWay').val()+$('#ddlDetail').val())
    {
        case "DY":
            vUrl = "VCheckTachStaticDeptDetail.aspx";
            break;
        case "DN":
            vUrl = "VCheckTachStaticDeptList.aspx";
            break;
        case "PY":
            vUrl = "VCheckTachStaticPersonDetail.aspx";
            break;
        case "PN":
            vUrl = "VCheckTachStaticPersonList.aspx";
            break;
    }
    
    openWindow(vUrl+'?CorpID='+$('#ddlCorp').val()+'&StartDate='+$('#txtStartTime').val()+'&EndDate='+$('#txtEndTime').val()+'&CheckStaticType='+$('#ddlCheckStaticType').val(),1000,600)

}