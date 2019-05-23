//接收待办工作的响应
//remindWorks --参见WorkName.js的定义 
var timerWebMail;
        
function triggerRemindUpdate(remindWorks)
{
    if(remindWorks.CallbackHtml)
    {        
        $('#tbMarqueeRemind').html(remindWorks.CallbackHtml);
    }    
}

//显示更多
function showMoreWaitDo()
{
    openWindow('/'+rootUrl+'/Common/Personal/VWaitWork.aspx?WaitDo=1', 400, 700);
}

//点击待办后的响应
function remindClickCallback(url)
{       
    url = stringFormat("/{0}/" + url, rootUrl);
    openWindow(url, 960, 650);    
}

// 外部邮件
function loadMineWebMail(userid,key)
{
    window.clearTimeout(timerWebMail);
    ajaxRequest("http://mail.chinafortune.com.cn/cgi-bin/message_num", { 'USERID':userid,'KEY':key}, "html", refreshMineWebMail);
}

function refreshMineWebMail(data, textStatus)
{
    $(lblWebMailCount).text(data);
    
    timerWebMail =  window.setTimeout("loadWebMail()", 120000);
}