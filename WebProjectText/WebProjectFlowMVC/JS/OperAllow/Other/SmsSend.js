// JScript 文件

function validateSize()
{
    if (getObj("txtMobile").value == "")
    {
        alert("接收手机号码不能为空。");
        document.all.txtMobile.focus();
        return false;
    }
    if (trim($("#txtContent").val()) == "")
    {
        return alertMsg("短信内容不能为空。", $("#txtContent"));
    }
    return true;
}
function Message(oper)
{
    // edit by zhangmq 20141112 添加参数Oper
    window.location = 'VSmsSendList.aspx?Oper=' + oper;
}
//送阅部门
function btnSelect_Click()
{
    var vValue = openModalWindow('../../../Common/Select/VSelectAccount.aspx?CorpID=' + getObj("hidCorpID").value + '&Aim=SmSend', 0, 0);
}

function SendMessage()
{
    window.location = 'VSmsSend.aspx';
}
function IsSucess()
{
    reloadData();
}
function Del()
{
    openDeleteWindow("SmsSend", 1,"jqSmsSend");
}

var reloadData = function()
{ 
    var strIsSucess = $('#ddlIsSuccess').val();
    var strStartTime = $('#txtStartTime').val();
    var strEndTime = $('#txtEndTime').val();
    var strFilter = $('#txtFilter').val();
    
    if(strStartTime != "" && strEndTime != "")
    {
        intStartTime = strStartTime.split("-");
        intEndTime = strEndTime.split("-");
        var dtmStartTime = new Date(intStartTime[0], intStartTime[1]-1, intStartTime[2]);
        var dtmEndTime = new Date(intEndTime[0] ,intEndTime[1]-1, intEndTime[2]);
        if(dtmStartTime > dtmEndTime)
        {
            return alertMsg("起始时间不能大于结束时间!", getObj("txtEndTime"));            
        }        
    }

    $('#jqSmsSend').appendPostData({
        'IsSuccess':$('#ddlIsSuccess').val(),
        'StartTime':$('#txtStartTime').val(),
        'EndTime':$('#txtEndTime').val(),
        'KeyWord':$('#txtKeyWord').val()
    });    
    refreshJQGrid('jqSmsSend');
}