var MACAddr, IPAddr, DNSName;

function imgload(img)
{
    if (img && img.src)
    {
        var imgSize = new Image;
        imgSize.src = img.src;

        var css_forebox =
            {
                "width": imgSize.width + "px",
                "height": imgSize.height + "px",
                "margin-left": (-imgSize.width / 2) + "px",
                "margin-top": (-imgSize.height / 2) + "px"
            };
        $("#divLogin").css(css_forebox);
    }
    $("#divLogin").css("display", "inline-block");
}

function imgerr(img)
{
    var css_forebox =
        {
            "width": "776px",
            "height": "374px",
            "margin-left": "-388px",
            "margin-top": "-187px"
        };
    $("#divLogin").css(css_forebox);
    $(img).hide();
    imgload();
}

function macReady(objObject, objAsyncContext)
{
    if (objObject.IPEnabled != null && objObject.IPEnabled != "undefined" && objObject.IPEnabled == true)
    {
        if (objObject.MACAddress != null && objObject.MACAddress != "undefined")
        {
            MACAddr = objObject.MACAddress;
        }
        if (objObject.IPEnabled && objObject.IPAddress(0) != null && objObject.IPAddress(0) != "undefined")
        {
            IPAddr = objObject.IPAddress(0);
        }
        if (objObject.DNSHostName != null && objObject.DNSHostName != "undefined")
        {
            DNSName = objObject.DNSHostName;
        }
    }
}

function macComplete(hResult, pErrorObject, pAsyncContext)
{
    $("#hidMACAddr").val(MACAddr);

    if ($("#hidMACAddr").val() == "")
    {
        returnMsg("没有获取到MAC，请刷新页面点击按钮再获取一次！");
    }
}

//客户端加密密码
function encrptyPwd() {    
    //setMaxDigits(129);
    var pwd = $('#txtPwd').val();
    var pwdRtn = pwd;
    //if (pwd.length > 0) {
    //    var key = new RSAKeyPair($('#hidPublicKeyExponent').val(), "", $('#hidPublicKeyModulus').val());
    //    pwdRtn = encryptedString(key, pwd);
    //}
    $("#hidPWD").val(pwdRtn);
    return true;
}

function validate()
{
    if (!$("#txtUser").val())
    {
        alert("请输入帐号！");
        $("#txtUser").focus();
        return false;
    }
    if ($("#hid2PWDAdmin").val() == "Y" && $("#txtUser").val().toUpperCase() == "ADMIN")
    {
        var result = openModalWindow("Common/Select/Confirm/VAdminConfirm.aspx", 350, 170);
        if (result == "Cancel" || result == "undefined" || result == null)
        {
            return false;
        }
        $("#hidAdminPwd").val(result);
    }
    if ($("#hidUseMAC").val() == "Y" && !$("#hidMACAddr").val())
    {
        return alertMsg("没有获取到MAC，请刷新页面点击按钮再获取一次！");
    }
    if ($("#txtSecurityCode").length === 1 && $.trim($("#txtSecurityCode").val()) === "")
    {
        return alertMsg("请输入验证码！");
    }
    if (!encrptyPwd()) {
        return false;
    }
    return true;
}

//单点登录smartBI
function ssoLoginSmartBi()
{
    $.ajax({
        url: "FillData.ashx?Action=SSOLoginSmartBi&IDAjax=true",
        dataType: "json",
        success: function (data)
        {
            //http://172.56.1.33:18080/sapibi/vision/index.jsp?user=biuser&password=biuser&jsoncallback=?
            if (data && data.Success == "Y")
            {
                var url = data.Data.replace("openresource", "index") + "&jsoncallback=?";
                $.getJSON(url, function (json)
                {
                    
                });
            }
        }
    });

}

$(function ()
{
    if ($.browser.mozilla)
    {
        $("#divLogin").css("display", "inline-block");
    }
   // if (!$.browser.msie || parseFloat($.browser.version) < 6)
   // {
   //     location.href = "Home/NotSupport.html";
   //     return;
  //  }

    if ($("#hidUseMAC").val() == "Y")
    {
        try
        {
            var service = locator.ConnectServer();
            service.Security_.ImpersonationLevel = 3;
            service.InstancesOfAsync(foo, 'Win32_NetworkAdapterConfiguration');
        }
        catch (err)
        {
            return alertMsg("请把此网站添加到可信站点，然后把可信站点设置 “对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本” 为启用或者提示。");
        }
    }

    if ($("#hidIsPostBack").val() == "N")
    {
        var params = location.search.substr(1).split("&");
        for (var i = 0; i < params.length; i++)
        {
            if (params[i].length && params[i].indexOf("=") != -1)
            {
                var param = params[i].split("=");
                param[0].toUpperCase() == "NAME" && $("#txtUser").val(param[1]);
                param[0].toUpperCase() == "PWD" && $("#txtPwd").val(param[1]);
            }
        }
        params.length && $("#txtUser").val() && $("#btnLogin").click();
    }
    
    var kickIP = $("#hidKickIP").val();
    if (kickIP)
    {
        alert(stringFormat("您的账号在另一地点登录（IP：{0}），您被迫下线。\n\n如果这不是您本人的操作，那么您的密码很可能已经泄露。", kickIP));
        $("#hidKickIP").val("");
    }

    $("#txtUser").val() ? $("#txtPwd").focus() : $("#txtUser").focus();

    $("#txtSecurityCode").css("vertical-align", "middle")
       .attr("title", "请输入验证码（忽略大小写）。").val("");

    $("#imgSecurityCode").click(function ()
    {
        $(this).attr("src", "FillData.ashx?Action=LoginVerificationCode&date=" + new Date());
    }).css({ "cursor": "hand", "vertical-align": "middle" }).attr("title", "点击换一张图片。");
});