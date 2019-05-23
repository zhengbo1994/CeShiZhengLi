function addWorkCalendar()
{
    openAddWindow("VWorkCalendarAdd.aspx", 500, 300, "jqGridWorkCalendar");
}

function editWorkCalendar()
{
    openModifyWindow("VWorkCalendarEdit.aspx", 500, 300, "jqGridWorkCalendar");
}

function delWorkCalendar()
{
    openDeleteWindow("WorkCalendar", 0, "jqGridWorkCalendar");
}

/*
    设置工作日历    
*/
function setWorkCalendar(wcID)
{
    openWindow('VWorkCalendarSetting.aspx?WCID='+wcID,850,600);
}

/*
    设置某个工作日历为默认工作日历
    @wcID  将被设为默认工作日历的日历ID
    @wcName 将被设为默认工作日历的名称
*/
function setDefaultCalendar(wcID,wcName)
{
    ajaxRequest('FillData.ashx',{action:'SetDefaultWorkCalendar',WCID:wcID},'text',function(result){
        if(result && result.toLowerCase()=='fail')
        {
            alertMsg('设置工作日历：'+wcName+' 为默认失败。');
        }
        else
        {
            refreshJQGrid('jqGridWorkCalendar');
        }
    });    
}

function renderTitleLink(cl,opt,rl)
{
      return "<div><a href=\"javascript:openWindow('VWorkCalendarBrowse.aspx?WCID="+opt.rowId+"',850,600);\">"+cl+"</a></div>";
}

function renderLinkWorkDetail(cl,opt,rl)
{       
     return "<div><a href=\"javascript:setWorkCalendar('"+opt.rowId+"');\">设置</a>&nbsp;&nbsp;" + ( cl.toLowerCase()=='true' ? "(默认)" : "<a href=\"javascript:setDefaultCalendar('"+opt.rowId+"','"+stripHtml(rl[0])+"');\">设为默认</a>" )+"</div>"; 
}

function renderIsDefault(cl,opt,rl)
{
    return cl.toLowerCase()=='true' ? '是' : '否' ;
}

function validateAdd()
{
    setBtnEnabled(['btnSaveOpen','btnSaveClose'],false);
    if($('#txtWCName').val().length<=0)
    {
        setBtnEnabled(['btnSaveOpen','btnSaveClose'],true);    
        return alertMsg('日历名称不能为空。',$('#txtWCName'));
    }
    if($('#txtRowNo').val().length<=0)
    {
        setBtnEnabled(['btnSaveOpen','btnSaveClose'],true);  
        return alertMsg("行号不能为空。", $('#txtRowNo'));
    }
    if (!isPositiveInt($('#txtRowNo').val()))
    {
        setBtnEnabled(['btnSaveOpen','btnSaveClose'],true);
        return alertMsg("行号必须为正整数。", $('#txtRowNo'));
    }
    
    return true;
}

function validateEdit()
{
    setBtnEnabled(['btnSaveClose'],false);
    if($('#txtWCName').val().length<=0)
    {
        setBtnEnabled(['btnSaveClose'],true);    
        return alertMsg('日历名称不能为空。',$('#txtWCName'));
    }
    if($('#txtRowNo').val().length<=0)
    {
        setBtnEnabled(['btnSaveClose'],true);  
        return alertMsg("行号不能为空。", $('#txtRowNo'));
    }
    if (!isPositiveInt($('#txtRowNo').val()))
    {
        setBtnEnabled(['btnSaveClose'],true);
        return alertMsg("行号必须为正整数。", $('#txtRowNo'));
    }
    
    return true;
}