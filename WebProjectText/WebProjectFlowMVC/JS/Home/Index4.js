// 左侧布局首页Index4.aspx中用到的js

$(function ()
{
    var bWelcom = getObj("hidWelcom").value.substr(0, 1) == "Y";
    var kickIP = getObj("hidWelcom").value.substr(2);

    // 显示欢迎页
    if (bWelcom)
    {
        var win = openWindow("VWelcome.aspx", 800, 600);
        if (win)
        {
            win.focus();
        }
    }
    // 踢出登录提示
    if (kickIP)
    {
        alert("您的账号在别处登录（IP：" + kickIP + "），已将其下线。");
    }
    window["Date_Theme"] = getObj("hidTheme").value;
});

// 关闭窗口前确认
window.onbeforeunload = function()
{
    var axisX = event.screenX - window.screenLeft;
    if (axisX > document.body.clientWidth - 20 && event.clientY < 0 || event.altKey || event.ctrlKey)   
    {
        return "关闭浏览器将退出本系统。";
    }  
}

// 切换用户
function exchangeUser(accountID)
{
    ajaxRequest("FillData.ashx", {action: "ExchangeUser", AccountID:accountID}, "text", afterExchange);
}

// 切换用户
function afterExchange(data, textStatus)
{
    if (data == "Y")
    {
        window.frames("Top").location.reload();
        if (getObj("btnBackTrack"))
        {
            document.body.removeChild(getObj("btnBackTrack"));
        }
    }
    else
    {
        alert(data);
    }
}

// 打开个人设置
function showSetting()
{
    //openWindow("/" + rootUrl + "/Common/Private/VPersonalSetting.aspx", 700, 500);
    openWindow("/" + rootUrl + "/common/private/personalsettingnew.html", 580, 680);
}

//创建遮罩层
function creatMask() {
    var sWidth = $(document).width(),
           sHeight = $(document).height();
    var $mask = $("<div class='mask'></div>");
    $mask.css({
        "width": sWidth + "px",
        "height": sHeight + "px",
        "background": "#000",
        "position": "absolute",
        "left": "0",
        "top": "0",
        "filter": "alpha(opacity=0)"
    })
    $("body").append($mask);
}

// 发起工作
function showWork()
{
    //var html = '<iframe name="Guide" src="/' + rootUrl + '/Common/Personal/WorkGuide.aspx" scrolling="no" frameborder="0" style="width:100%;height:100%"></iframe>';
    //window["DialogID"] = showDialog({ "title": "发起工作", "html": html, "width": 960, "height": 640, "resizable": 1, "id": window["DialogID"] });
    creatMask();
    $(".work-outer-container").show(500);
}

// 打开工作页
function gz(index)
{
    showLogoWork(index);
}


//打开待办页面
function showWaitWorkDialog(wiatiWork) {
    creatMask();
    //$(".reminder-container").animate({
    //    height: 'toggle', opacity: 'toggle'
    //}, "slow");
    $(".reminder-container").show(500);
    //var a = 20;
    ////creatWaitWork(a);
}