// 首页Logo.aspx中用到的js

var time1 = 10000;
var time2 = 30000;
var timer1;
var timer2;
var scrollTimer;


// 显示工作菜单
function showWork(aHref, index, isL2)
{
    // 发起工作
    if (index == 1)
    {
        var html = '<iframe name="Guide" src="../Common/Personal/WorkGuide.aspx" scrolling="no" frameborder="0" style="width:100%;height:100%"></iframe>';
        window["DialogID"] = parent.showDialog({ "title": "发起工作", "html": html, "width": 960, "height": 640, "resizable": 1, "id": window["DialogID"] });
    }
    else
    {
        if (isL2)
        {
            if (window.top.document.hasFocus())
            {
                var divMenu = getObjP("divGZ" + index);
                var left = getAbsAxisX(aHref) - 6;
                var top = getAbsAxisY(aHref) + aHref.offsetHeight - 8;
                var width = 110;
                var height = divMenu.cnt * window.parent.menuLineHeight + 20;
                        
                window.parent.showMenu(divMenu, left, top, width, height, true);
            }
        }
        else
        {
            var tbGZ = getObj("tbGZ" + index);
            var width = 100;
            var height = tbGZ.rows.length * window.parent.menuLineHeight;
            var left = getAbsAxisX(aHref);
            var top = getAbsAxisY(aHref) + aHref.offsetHeight;
            
            var html = tbGZ.outerHTML.replace(/\.\.\/\.\.\//g, "");
            window.parent.showPopup(html, left, top, width, height);
        }
    }
}

// 顶部：选择第一级菜单，显示二级以下菜单
function showMenu2(aHref, id, url, linkWay, isLeaf)
{
    selectMenu1(aHref);
    if (id == "0")
    {
        execFrameFuns("Upper", function()
        {
            window.parent.frames("Upper").hideGuide();
        }, window.parent);
    }
    
    if (linkWay == "1" || isLeaf == "1")
    {
        if (linkWay == "1")
        {
            url = "Home/VTab.aspx?ModID=" + id;
        }
        else if (id && id != "0" && url && !isValidUrl(url))
        {
            url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
        }
        
        if (!isValidUrl(url))
        {
            url = "../" + url;
        }
        getObjP("ifrMain").src = url;
            
        var aHref = getEventObj("A");
        if (aHref && id != "0")
        {
            execFrameFuns("Upper", function()
            {
                window.parent.frames("Upper").showGuide(aHref.innerText);
            }, window.parent);
        }
        window.top["Mod1_SelectID"] = aHref.id;
        window.parent.menu2Clicked = false;
    }
    else
    {
        var divMenu = getObjP("div_" + aHref.id.substr(1));
        if (divMenu)
        {
            var left = getAbsAxisX(aHref) - 6;
            var top = getAbsAxisY(aHref) + aHref.offsetHeight - 8;
            var width = 150;
            var height = divMenu.cnt * window.parent.menuLineHeight + 20;
            
            window.parent.showMenu(divMenu, left, top, width, height, true);
            window.parent.menu2Clicked = true;
        }
    }
}


// 顶部+左侧：选择第一级菜单，在左侧显示二级以下菜单
function showMenu3(aHref, id, url, linkWay, isLeaf)
{
    selectMenu1(aHref);
    
    if (linkWay == "1" || isLeaf == "1")
    {
        window.parent.showMenu2(false);
    
        if (linkWay == "1")
        {
            url = "Home/VTab.aspx?ModID=" + id;
        }
        else if (id && id != "0" && url && !isValidUrl(url))
        {
            url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
        }
    }
    else
    {
        window.parent.showMenu2(true, aHref.id);
    }
    
    if (url)
    {
        if (!isValidUrl(url))
        {
            url = "../" + url;
        }
        getObjP("ifrMain").src = url;
    }
    
    window.top["Mod1_SelectID"] = aHref.id;
}

// 顶部：第一级菜单效果
function selectMenu1(aHref)
{
    if (aHref)
    {
        selectIDTab(aHref, "left -30px", "right -30px");
    }
}

// 顶部：第一级菜单mouseover
function mE(linkWay, isLeaf)
{
    var aHref = getEventObj("A");
    if (aHref && window.parent.menu2Clicked)
    {
        if (linkWay == "1" || isLeaf == "1")
        {
            window.parent.removeIDTabStyle(aHref, true);
            window.parent.hideOtherMenu("div_" + aHref.id.substr(1));                
            setTimeout("window.parent.menu2Clicked = true", 1)
        }
        else
        {
            showMenu2(aHref, "", "", "0", "0");
        }
    }
}

/* 顶部：一级菜单滚动按钮效果 */
function mSE(btn, beMoveLeft)
{
    divMod.scrollLeft = beMoveLeft ? 0 : (divMod.scrollWidth - divMod.offsetWidth);
    showMSBtn();
}
function showMSBtn()
{
    var width = divMod.scrollWidth - divMod.offsetWidth;
    var left = divMod.scrollLeft;
    
    getObj("btnMS1").style.display = ((width > 0 && left > 0) ? "" : "none");
    getObj("btnMS2").style.display = ((width > 0 && left < width) ? "" : "none");
    
    window.clearTimeout(scrollTimer);
    scrollTimer = null;
}
function resizeLogo()
{
    if (!scrollTimer)
    {
        scrollTimer = setTimeout(showMSBtn, 0);
    }
}

// 显示消息
function showNews()
{
    var aHref = getObj("aWork");
    var left = getAbsAxisX(aHref);
    var top = getAbsAxisY(aHref) + aHref.offsetHeight;
    var width = remindWorks.Width;
    var height = remindWorks.Height;
    
    flashTitle(false,true);
    remindWorks.BeWillShow = false;
    saveRemind();
    showPopup(remindWorks.Html, left, top, width, height, false);
}

// 顶部：显示个人工作区
function showWorkaround(aHref)
{
    var divMenu = getObjP("div_0.1");
    if (divMenu)
    {
        var left = getAbsAxisX(aHref) - 6;
        var top = getAbsAxisY(aHref) + aHref.offsetHeight - 8;
        var width = 150;
        var height = divMenu.cnt * window.parent.menuLineHeight + 20;
                
        window.parent.showMenu(divMenu, left, top, width, height, true);
    }
}

// 回首页
function goHome()
{
    window.parent.frames("Main").location = "portal/portal.html";
}

// 打开汉国售楼系统
function showHGSL()
{
    var hidUrl = getObj("hidHGSLUrl");
    if (hidUrl != null)
    {
        openWindow(hidUrl.value, 960, 650);
    }
}

// 打开个人设置
function showSZ()
{
    openWindow("../Common/Private/VPersonalSetting.aspx", 700, 300);
}

// 退出
function logout(bKicked, kickIP)
{
    window.top.location = "Logout.aspx" + (bKicked ? "?Kicked=1&KickIP=" + kickIP : "");
}

// 重登录
function relogin(aim)
{
    if (aim == 0 || aim == 1)
    {
        window.clearTimeout(timer1);
    }
    if (aim == 0 || aim == 2)
    {
        window.clearTimeout(timer2);
    }
    
    window["ReLoginWork"] = aim;
    window.status = "与站点的连接中断，正在重新登录……";
    ajaxRequest("FillData.ashx", {action: "ReLogin", AccountID:$("#hidAccountID").val()}, "text", afterReLogin);
}

// 重登录
function afterReLogin(data, textStatus)
{
    if (data == "Y")
    {
        window.status = "登录成功";
        window.setTimeout("window.status=''", 5000);
        
        switch (window["ReLoginWork"])
        {
            case 0:
                getOnlineCount();
                getWaitWorkCount();
                break;
            case 1:
                getOnlineCount();
                break;
            case 2:
                getWaitWorkCount();
                break;
        }
        
        parent.setTimeout('vun(1)', 20000);
    }
    else
    {
        alert(data);
    }
}

// 显示在线人数
function showOnline()
{
    openWindow("OnlineOld.aspx", 960, 640);
}

// 系统管理
function manageSys(url)
{
    getObjP("ifrMain").src = url;
}


// 自动加载Logo图片

addWindowLoad(function(){
    
    window.top.document.title = $("#hidSysTitle").val();    

    // 闪烁替换标题内容
    window["ID_ReplaceTitle"] = "";
    var length = $("#hidSysTitle").val().replace(/[^\x00-\xff]/g, '**').length;
    for (var i = 0; i < length; i += 2)
    {
        window["ID_ReplaceTitle"] += "　";
    }

    tbLogo.style.backgroundImage = "url('" + getObj("imgLogo").src + "')";
    
    // 加载待办
    setWaitWork(0, $("#hidWaitWork").val());

    // 获取刷新在线人数、刷新待办工作的时间间隔
    if ($("#hidGetOnlineCountTime").val() != "")
    {
        time1 = parseInt($("#hidGetOnlineCountTime").val(), 10);
        if (time1 < 10000)
        {
            time1 = 10000;
        }
    }
    if ($("#hidGetWaitWorkTime").val() != "")
    {
        time2 = parseInt($("#hidGetWaitWorkTime").val(), 10);
        if (time2 < 30000)
        {
            time2 = 30000;
        }
    }
    
    // 获取在线人数
    timer1 = window.setTimeout("getOnlineCount()", time1);
    
    // 获取待办工作
    if ($("#hidRemind").val().indexOf("Y") != -1)
    {
        timer2 = window.setTimeout("getWaitWorkCount()", time2);
        if (time2 < 30000)
        {
            time2 = 30000;
        }
    }
    
    // 采用布局2时的处理
    // 将快捷菜单移到父页
    if (getObjP("divIDLogoMenu") && getObj("divLogoMenu"))
    {
        getObjP("divIDLogoMenu").innerHTML = divLogoMenu.innerHTML;;
        divLogoMenu.innerHTML = "";
    }
    // 初始化一级菜单
    if (window.top["Mod1MenuHtml"] && getObj("divMod") && !divMod.innerHTML)
    {
        divMod.innerHTML = window.top["Mod1MenuHtml"];
    }
    if (window.top["Mod1_SelectID"] && getObj(window.top["Mod1_SelectID"]))
    {
        selectMenu1(getObj(window.top["Mod1_SelectID"]));
    }
    else
    {
        selectMenu1(getObj("a0"));
    }
    // 一级菜单滚动按钮显隐
    if (getObj("divMod") && getObj("btnMS1") && getObj("btnMS2"))
    {
        showMSBtn();
    }
    // Logo区隐藏
    if (window.top["LogoIsHide"] && getObj("trLogo1") && getObj("trLogo2"))
    {
        tbLogo.style.backgroundImage = "none";
        trLogo1.style.display = "none";
        trLogo2.style.display = "none";
    }
});

// 获取在线人数
function getOnlineCount()
{
    ajaxRequest("FillData.ashx", {action: "OnlineCount"}, "text", showOnlineCount);
}

// 获取待办工作
function getWaitWorkCount()
{
    ajaxRequest("FillData.ashx", {action: "WaitWorkCount"}, "text", showWaitWorkCount);
}

// 显示在线人数
function showOnlineCount(data, textStatus)
{
    if (data == "-1")
    {
        relogin(1);
    }
    else if (data.substr(0, 2) == "-2")
    {
        logout(1, data.substr(2));
    }
    else
    {
        $("#spOnlineCount").text(data);
        window.clearTimeout(timer1);
        timer1 = window.setTimeout("getOnlineCount()", time1);
    }
}

// 更新待办数
function showWaitWorkCount(data, textStatus)
{
    if (data == "-1")
    {
        relogin(2);
    }
    else if (data.substr(0, 2) == "-2")
    {
        logout(1, data.substr(2));

    }
    else
    {
        if ($("#hidWaitWork").val())
        {
            setWaitWork(0, data, $("#hidWaitWork").val());
            $("#hidWaitWork").val(data);
        }
        window.clearTimeout(timer2);
        timer2 = window.setTimeout("getWaitWorkCount()", time2);
    }
}

/* Ajax请求失败时给出提示 */
function ajaxError(xmlHttpRequest, textStatus, errorThrown) 
{
    window.status = "实时数据获取失败。代码：" + xmlHttpRequest.status + "；信息：" + xmlHttpRequest.statusText;
    window.setTimeout("window.status=''", 5000);
}

/* 注释掉公共方法 */
function ajaxLoading(xmlHttpRequest)
{
}

function showWebMail(vCompany,vUName,vDoMain,vSign) {
    if (vUName == "")
    {
        alert('没有配置EMail地址或EMail地址格式不正确，无法登陆外部邮箱');
        return ;
    }
    
    if (vCompany == "TLDCJT")
    {
        if (vDoMain.toUpperCase() != "760HK.COM")
        {
            alert('EMail地址配置有误，必须是企业邮箱');
            return ; 
        }

        openMailWindow("http://pcc.263.net/PCC/263mail.do?cid=ff8080813466aacf0135e60448fe0149&domain=" + vDoMain + "&uid=" + vUName + "&sign=" + vSign);
    }
    else if (vCompany == "HS")
    {
        if (vDoMain.toUpperCase() != "SXHC.NET")
        {
            alert('EMail地址配置有误，必须是企业邮箱');
            return ; 
        }

        openMailWindow("http://pcc.263.net/PCC/263mail.do?cid=ff80808139f67aaa013bbb7df05212bd&domain=" + vDoMain + "&uid=" + vUName + "&sign=" + vSign);
    }
}


function openMailWindow(url, width, height) {
    var winobj = getOpenWinObj(0, width, height);

    // 解决模式窗口打开新窗口Session丢失问题
    var win = window;
    if (typeof (window.dialogArguments) == "object") {
        win = window.dialogArguments;
    }

    //url = addUrlParam(url, "x", getUniqueKey("x"));

    win.open(url, '_blank', 'resizable=1,status=1,scrollbars=0,top=' + winobj.top + ',left=' + winobj.left + ',width=' + winobj.width + ',height=' + winobj.height);
}

// 预期审批
function showYQSP()
{
    openWindow("../Common/Personal/VWaitCheck.aspx", 960, 650);
}

//左菜单 顶部按钮
function leftmenu_click()
{
    parent.$("#divec").click();
}