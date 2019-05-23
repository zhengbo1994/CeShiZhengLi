// 左侧布局首页Index1.aspx中用到的js

var mResizable = false;
var oMWidth = 200;
var oMAxisX;
var mborder;
window.menuLineHeight = 22;
window.logoMenuClicked = false;

// 获取菜单原始宽度
window.onload = function()
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
    
    oMWidth = tdIndexMenu.offsetWidth;
    window["Date_Theme"] = getObj("hidTheme").value;
}

// 关闭窗口前确认
window.onbeforeunload = function()
{
    var axisX = event.screenX - window.screenLeft;
    if (axisX > document.body.clientWidth - 20 && event.clientY < 0 || event.altKey || event.ctrlKey)   
    {
        return "关闭浏览器将退出本系统。";
    }  
}
        
        
// 显示和隐藏菜单效果
function setIDIndexMenu(div, opt)
{
    var display = tdMenu.style.display;
    if (opt == 0)
    {
        display = (display == "none" ? "" : "none");
        tdMenu.style.display = display;
        tbMod.style.display = display;
        tbResize.style.cursor = (display == "none" ? "" : "e-resize");
        tdIndexMenu.style.width = (display == "none" ? 6 : oMWidth) + "px";
        div.className = (display == "none" ? "index_col" : "index_exp");
    }
    else if (opt == 1)
    {
        div.className = (display == "none" ? "index_col_on" : "index_exp_on");
    }
    else if (opt == 2)
    {
        div.className = (display == "none" ? "index_col" : "index_exp");
    }
}

// 是否可拖动
function menuResizable()
{
    var e = event.srcElement || event.target;
    if (e.tagName.toUpperCase() == "DIV" || tdMenu.style.display == "none")
    {
        return false;
    }
    return true;
}


// 开始拖动
function mMenuDown(obj)
{
    if (menuResizable())
    {
        oMAxisX = event.clientX - getAbsAxisX(obj);

        if (!mborder)
        {
            mborder = document.createElement("div");
            mborder.className = "index_ec_drag";
            mborder.style.position = "absolute";
        }
        mborder.style.left = getAbsAxisX(obj);
        mborder.style.top = getAbsAxisY(obj);
        mborder.style.height = obj.offsetHeight;
        document.body.appendChild(mborder);

        mResizable = true;
        obj.setCapture();
    }
}

// 拖动中
function mMenuMove()
{
    if (mResizable)
    {
        var left = event.clientX - oMAxisX;
        (left < 0) && (left = 0);
        (left > document.body.offsetWidth - 6) && (left = document.body.offsetWidth - 6);
        mborder.style.left = left;
    }
}

// 结束拖动
function mMenuUp(obj)
{
    if (mResizable)
    {
        oMWidth = mborder.offsetLeft + 6;
        tdIndexMenu.style.width = oMWidth;
        document.body.removeChild(mborder);

        mResizable = false;
        obj.releaseCapture();
    }
}

// 显隐Logo区
function showIDLogo(div, opt)
{
    if (opt == 0)
    {
        if (window["LogoIsHide"])
        {
            trLogo.style.display = "";
            div.className = "l2_ec_on";
            window["LogoIsHide"] = 0;
            div.title = "隐藏 Logo 区域";
        }
        else
        {
            trLogo.style.display = "none";
            div.className = "l2_ec_off";
            window["LogoIsHide"] = 1;
            div.title = "显示 Logo 区域";
        }
    }
    else if (opt == 1)
    {
        div.className = (window["LogoIsHide"] ? "l2_ec_off" : "l2_ec_on");
    }
    else if (opt == 2)
    {
        div.className = "l2_ec";
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

// Logo中的菜单项鼠标效果
function gzxg(row, opt)
{
    row.className = (opt == 0 ? "index_mtr_on" : "");
}

// 打开工作页
function gz(index)
{
    showLogoWork(index);
}

// 打开个人设置
function sz()
{
    openWindow("../Common/Private/VPersonalSetting.aspx", 700, 300);
}
//是否是CTS
function initLocationPage()
{
    if ($("#hidPublishCompany").val() == "CTS")
    {
        getObj("ifrMain").src = "../CTSIM/Index/VHome.aspx";
    }
}

// 中铁华升显示企业门户时，不显示“待办”和“发起工作”，否则显示 add by zhangmq 20140228
$(function ()
{
    if ($("#hidPublishCompany").val() == "ZTHS")
    {
        execFrameFuns("Main", function ()
        {
            $("#aWorkGround", window.frames("Top").document).hide();
            $(".header-tab", window.frames("Main").document).click(function (event)
            {
                if (event.target && event.target.tagName && (event.target.tagName.toUpperCase() == "DD" && event.target.portalType || $(event.target).closest("dd[portalType]").length == 1))
                {
                    var portalType = event.target.portalType || $(event.target).closest("dd[portalType]").attr("portalType");
                    if (portalType === "2")
                    {
                        $("#aWork", window.frames("Top").document).hide();
                        $("#img1", window.frames("Top").document).parent("a").hide();
                    }
                    else
                    {
                        $("#aWork", window.frames("Top").document).show();
                        $("#img1", window.frames("Top").document).parent("a").show();
                    }
                }
            });
        });
    }
})