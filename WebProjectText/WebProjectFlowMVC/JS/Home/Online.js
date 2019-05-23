var activex = ((navigator.userAgent.indexOf('Win')  != -1) && (navigator.userAgent.indexOf('MSIE') != -1) && (parseInt(navigator.appVersion) >= 4 ));
var CantDetect = ((navigator.userAgent.indexOf('Safari')  != -1) || (navigator.userAgent.indexOf('Opera')  != -1));

function oopsPopup()
{
	var windowName = "oops";
	var URLtoOpen = "http://download.skype.tom.com/Tom-SkypeSetup.exe";
	//var popW = 540, popH = 305;
	//var scrollB = 'no';
	//w = screen.availWidth;
	//h = screen.availHeight;
	//var leftPos = (w-popW)/2, topPos = (h-popH)/2;
	if (window.confirm("您好，您的电脑还没有安装通话软件Skype，点击“确定”后下载安装。"))
	{
	    oopswindow = window.open(URLtoOpen, windowName);//,'width=' + popW + ',height=' + popH + ',scrollbars=' + scrollB + ',screenx=' +leftPos +',screeny=' +topPos +',top=' +topPos +',left=' +leftPos);
	}
	return false;
}

if (typeof(detected) == "undefined" && activex)
{
    document.write(
        ['<script language="VBscript">',
        'Function isSkypeInstalled()',
        'on error resume next',
        'Set oSkype = CreateObject("Skype.Detection")',
        'isSkypeInstalled = IsObject(oSkype)',
        'Set oSkype = nothing',
        'End Function',
        '</script>'].join("\n")
    );
}

function skypeCheck()
{
    if (CantDetect)
    {
        return true;
    }
    else if(!activex)
    {
        var skypeMime = navigator.mimeTypes["application/x-skype"];
        detected = true;
        if(typeof(skypeMime) == "object")
        {
            return true;
        }
        else
        {
            return oopsPopup();
        }
    }
    else
    {
        if (isSkypeInstalled())
        {
            detected = true;
            return true;
        }
    }
    
    detected = true;
    return oopsPopup();
}

function onlineState(cellvalue, options, rowobject)
{
    return '<img align="absbottom" width="16" height="16" src="../Image/home/' + cellvalue + '.gif">';
}

function mailUser(cellvalue, options, rowobject)
{
    if ($("#hidPublishCompany").length == 1 && $("#hidPublishCompany").val() == "BAONENGJT")
    {

        return '<a href="#Mail" onclick="openWindow(\'../OperAllow/Account/VAccountBrowse.aspx?AccountID=' + options.rowId + '\',800,650)" title="' + cellvalue + '">' + cellvalue + '</a>';
    }
    else
    {
        return '<a href="#Mail" onclick="openWindow(\'../IDOA/IntraMail/VMailWrite.aspx?AccountID=' + options.rowId + '&EmployeeName='
        + encode(cellvalue) + '\',800,650)" title="' + cellvalue + '">' + cellvalue + '</a>';
    }
}

function chatSkype(cellvalue, options, rowobject)
{
    return '<a href="skype:' + cellvalue + '?call" onclick="return skypeCheck()" onfocus="this.blur()"><img src="http://mystatus.skype.com/mediumicon/'
        + cellvalue + '" border="0" alt="Skype" align="absmiddle" title="点击这里给我发消息" onerror="this.src=\'../Image/home/noskype.gif\';this.title=\'不存在\'" /></a>';
}

function chatQQ(cellvalue, options, rowobject)
{
    return '<a href="tencent://message/?Menu=yes&uin=' + cellvalue + '\'" onfocus="this.blur()"><img src="http://wpa.qq.com/pa?p=2:'
        + cellvalue + ':45" border="0" alt="QQ" align="absmiddle" title="点击这里给我发消息" onerror="this.src=\'../Image/home/noqq.gif\';this.title=\'不存在\'" /></a>' + cellvalue;
}

function chatMSN(cellvalue, options, rowobject)
{
    return '<a href="msnim:chat?contact=' + cellvalue + '" onfocus="this.blur()"><img src=\'../Image/home/nomsn.gif\''
        + ' border="0" alt="MSN" title="点击这里给我发消息" align="absmiddle" onerror="this.src=\'../Image/home/nomsn.gif\';this.title=\'不存在\'" /></a>' + cellvalue; 
}

function chatRTX(cellvalue, options, rowobject)
{
    return '<img align="absbottom" width="16" height="16" src="../RTXCongif/Image/blank.gif" onload="RAP(\'' + cellvalue + '\');">' + cellvalue + '</img>';
}

function chatLYNC(cellvalue, options, rowobject)
{
    return '<span><img id="img' + options.rowId + '" style="margin-left: 3px;" src="../LYNCConfig/Image/imnoff.gif" onload="IMNRC(\'' + cellvalue + '\',this)" border="0">' + cellvalue + '</img></span>';
}

function chatWeChat(cellvalue, options, rowobject)
{
    return '<a href="https://wx.qq.com/" target="_blank"><img src="../Image/icon/icon_TencentWeb.jpg" align="absmiddle" alt="腾讯微信" title="点击这里登录微信" border="0" /></a>' + cellvalue;
}

function chatSinaWeb(cellvalue, options, rowobject)
{
    return '<a href="http://weibo.com/" target="_blank"><img src="../Image/icon/icon_sinaweibo.jpg" align="absmiddle" alt="新浪微博" title="点击这里登录微博" border="0" /></a>' + cellvalue;
}

function reloadData()
{
    var query = {
        StruID: parent["StruID"],
        StruType: parent["StruType"],
        Range: $("#ddlRange", parent.document).val(),
        IsDefault: $("#ddlIsDefault", parent.document).val(),
        KW: $("#txtKW", parent.document).val() 
    };
   
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}