// 获取网站虚拟根目录名
// 网站的URL必须符合以下格式：http://站点名/虚拟根目录名/XXX.html
// 否则，也可以更改下面的语句，指定具体的虚拟路径名
var rootUrl = window.location.href.split("/")[3];
/*将来这里改成ajax获取*/

// ----------------------- start -------------------------------------
// 添加自 maowenchao @2014/8/18
// 
// 目的:
//      针对页面转跳后，无法立即劫持 close 引起无法关闭对话框无效的 BUG。
//      下方代码兼容旧皮肤，不会对旧有皮肤造成影响。

window.__nativeClose = window.close;    // 保存原生 close

function __doHijackingClose()
{
    if ( window.Hijacking )
    {
        window.close();
    } else
    {
        setTimeout( __doHijackingClose, 0 );
    }
}

if ( !window.Hijacking )    // 若 hijacking.js 先于 ideasoft.js 加载，则不覆盖 close
{
    window.eval(        // 覆盖原生 close
        "function close()" +
        "{" +

        // 调用原生 close，若是非新版本UI(旧皮肤)，脚本执行完此句后，页面已被释放，下方的 __doHijackingClose() 函数将没有机会执行
        "    window.__nativeClose();" +
        "    __doHijackingClose();" +       // 尝试调用新版UI的 close()

        "}"
    );
}

// ----------------------- end -------------------------------------

// IE版本
var ieVersion = 0;
if (navigator.appName.indexOf("Internet Explorer") != -1)
{
    var temp = navigator.appVersion.split("MSIE");
    ieVersion = parseFloat(temp[1]);
}

var idToday = new Date();

//edited by jeremy at 2010-4-30 17:40
// 引入js文件的方法
function include()
{
    var scripts = document.getElementsByTagName("script");
    if (!scripts)
    {
        return;
    }
    var jsPath = scripts[0].src;
    jsPath = jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    var header = document.getElementsByTagName('head')[0];

    //    var script = document.createElement('script'); 
    //    script.type = "text/javascript";  
    //    script.src = jsPath + path;2013/7/19
    //    header.appendChild(script); 

    //直接使用arguments,避免多次调用本方法。     
    for (var i = 0; i < arguments.length; i++)
    {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'utf-8');
        script.setAttribute('src', jsPath + arguments[i]);
        header.appendChild(script);
    }
}

//注册form提交事件(onsubmit)
//可以在同一页面的不同地方调用，form本身的onsubmit事件属性只会注册一次。
//arguments : 提交响应事件(function类型)
//示例： registerSubmitEvent(function(){alert('a');},function(){alert('b');}......);

function registerSubmitEvents()
{
    if (!window['SubmitEvents'])
    {
        window['SubmitEvents'] = [];
        //注册form元素本身具有的onsubmit事件属性    
        if (document.forms[0].onsubmit)
        {
            var originalFunc = document.forms[0].onsubmit;
            window['SubmitEvents'].push(originalFunc);
        }
    }
    var eventsContainer = window['SubmitEvents'];

    //注册传递过来的函数
    for (var i = 0; i < arguments.length; i++)
    {
        eventsContainer.push(arguments[i]);
    }

    //注册事件
    document.forms[0].onsubmit = function ()
    {
        for (var i = 0; i < eventsContainer.length; i++)
        {
            eventsContainer[i] && eventsContainer[i]();
        }
    }
}

function registerSubmitEventsToHead()
{
    if (!window['SubmitEvents'])
    {
        window['SubmitEvents'] = [];
        //注册form元素本身具有的onsubmit事件属性    
        if (document.forms[0].onsubmit)
        {
            var originalFunc = document.forms[0].onsubmit;
            window['SubmitEvents'].push(originalFunc);
        }
    }
    var eventsContainer = window['SubmitEvents'];

    //注册传递过来的函数
    for (var i = arguments.length - 1; i >= 0; i--)
    {
        eventsContainer.unshift(arguments[i]);
    }

    //注册事件
    document.forms[0].onsubmit = function ()
    {
        for (var i = 0; i < eventsContainer.length; i++)
        {
            var submit = eventsContainer[i];
            if (submit && !submit() && submit.prototype.functionName == 'CheckSubmit')
            {
                EnableAllButton();
                return false;
            }
        }
        return true;
    }
}

//将所有提交按钮启用
function EnableAllButton()
{
    var isPostBack = new RegExp("__doPostBack");
    var btns = $("button");

    for (var i = 0; i < btns.length; i++)
    {
        if (btns[i].onclick && isPostBack.test(btns[i].onclick.toString()))
        {
            btns[i].disabled = false;
        }
    }
    $('input[Type="submit"]').attr("disabled", "");
}


/*//////////////////////////////////////////(1)基本方法//////////////////////////////////////////////*/
// 获取顶页面对象
function getTopWindow(objWin)
{
    var objTopWin = null;
    if (objWin.parent.isSapiTopWindow != null && objWin.parent.isSapiTopWindow) {
        objTopWin = window.parent;
    }
    else if (objWin.parent.document != window.top.document) {
        getTopWindow(objWin.parent);
    }

    return objTopWin;
}

// 获取页面的Html控件
function getObj(id)
{
    if (!id)
    {
        return null;
    }
    return document.getElementById(id);
}

// 获取页面数据区域容器元素
function getDataAreaObj()
{
    return getObj('divMPList');
}

// 获取页面的Html控件数组
function getObjs(name)
{
    return document.getElementsByName(name);
}

// 获取模式窗口父页面的Html控件
function getObjD(id)
{
    if (!id)
    {
        return null;
    }
    return window.dialogArguments.document.getElementById(id);
}

// 获取一般弹出(非模式)窗口父页面的Html控件
function getObjO(id)
{
    if (!id)
    {
        return null;
    }
    return window.opener.document.getElementById(id);
}

// 获取父页面的Html控件
function getObjP(id)
{
    if (!id)
    {
        return null;
    }
    return window.parent.document.getElementById(id);
}

// 获取祖页面的Html控件
function getObjPP(id)
{
    if (!id)
    {
        return null;
    }
    return window.parent.parent.document.getElementById(id);
}

// 获取本页某个框架(或内嵌框架)里的Html控件
function getObjF(frameName, id)
{
    if (!frameName || !id)
    {
        return null;
    }
    return window.frames(frameName).document.getElementById(id);
}

// 获取父页面某个框架(或内嵌框架)里的Html控件
function getObjPF(frameName, id)
{
    if (!frameName || !id)
    {
        return null;
    }
    return window.parent.frames(frameName).document.getElementById(id);
}

// 获取顶页面的Html控件
function getObjT(id)
{
    if (!id)
    {
        return null;
    }
    return window.top.document.getElementById(id);
}

// 获取容器container中标记为tagName的HTML控件数组中的第tagIndex个控件
// 容器可以是table、tr、td、div等可以含子元素的元素
function getObjC(container, tagName, tagIndex)
{
	var obj = null;
	if (typeof container == "string")
	{
		container = getObj(container);
	}

	// ------------------------------------------------------------------------------
	// modify by: wenghq 2013-05-10,缓存getByTag的查询结果,避免重复查找。
	//    if (container && container.getElementsByTagName(tagName).length > tagIndex)
	//    {
	//        obj = container.getElementsByTagName(tagName).item(tagIndex);
    //    }	
	if ( container )
	{
	    var tagArr = container.getElementsByTagName( tagName );
	    if ( tagArr && tagArr.length > tagIndex )
	    {
	        obj = tagArr.item( tagIndex );
	    }
	}
	//------------------------------------------------------------------------------
	return obj;
}

// 获取表格table中第rowIndex行的标记为tagName的HTML控件数组中的第tagIndex个控件
function getObjTR(table, rowIndex, tagName, tagIndex)
{
	var obj = null;
	if (typeof table == "string")
	{
		table = getObj(table);
	}

	// ------------------------------------------------------------------------------
	//  modify by: wenghq 2013-05-10,缓存getByTag的查询结果,避免重复查找。
	//    if (table && table.rows(rowIndex).getElementsByTagName(tagName).length > tagIndex)
	//    {
	//        obj = table.rows(rowIndex).getElementsByTagName(tagName).item(tagIndex);
    //    }
	if ( table )
	{
	    var tagArr = table.rows( rowIndex ).getElementsByTagName( tagName );
	    if ( tagArr && tagArr.length > tagIndex )
	    {
	        obj = tagArr.item( tagIndex );
	    }
	}
	// ------------------------------------------------------------------------------

	return obj;
}

// 获取表格table中第rowIndex行第colIndex列的标记为tagName的HTML控件数组中的第tagIndex个控件
function getObjTC(table, rowIndex, colIndex, tagName, tagIndex)
{
	var obj = null;
	if (typeof table == "string")
	{
		table = getObj(table);
	}
	// ------------------------------------------------------------------------------
	//  modify by: wenghq 2013-05-10,缓存getByTag的查询结果,避免重复查找。
	//    if (table && table.rows[rowIndex].cells[colIndex].getElementsByTagName(tagName).length > tagIndex)
	//    {
	//        obj = table.rows[rowIndex].cells[colIndex].getElementsByTagName(tagName).item(tagIndex);
    //       }
	if ( table )
	{
	    var tagArr = table.rows[rowIndex].cells[colIndex].getElementsByTagName( tagName );
	    if ( tagArr && tagArr.length > tagIndex )
	    {
	        obj = tagArr.item( tagIndex );
	    }
	}
	// ------------------------------------------------------------------------------
	return obj;
}

// 对字符串进行html编码
function htmlEncode(f)
{
    return !f ? f : String(f).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;");
}

// 把html编码后的字符串还原
function htmlDecode(f)
{
    if (f == "&nbsp;" || f == "&#160;" || f.length == 1 && f.charCodeAt(0) == 160)
    {
        return "";
    }
    return !f ? f : String(f).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
}

// 字符串模板转换，类似于C#中的string.Format，需要jQuery的支持
// 如：stringFormat("Please enter a value between {0} and {1}.", 4, 8) 将返回 "Please enter a value between 4 and 8."
function stringFormat()
{
	// var k = $.makeArray(arguments).slice(1);
    // modify by： wenghq 2013-05-10, 原因： 用原生方法将arguments转换成数组的效率比用jquery方法要好。
    var k;
    if (arguments.length == 2 && arguments[1] instanceof Array)
    {// add by evan 2013-09-09 支持直接传数组
        k = arguments[1];
    }
    else
    {
        k = Array.prototype.slice.call(arguments, 1);
    }
	f = (!arguments.length || arguments[0] === undefined) ? "" : arguments[0];
	return f.replace(/\{(\d+)\}/g, function (i, h) { return typeof k[h] !== 'undefined' ? k[h] : ""; });
}

// 去掉html标签返回标签中内容
function stripHtml(f)
{
    f += "";
    var k = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
    if (f)
    {
        return ((f = f.replace(k, "")) && f !== "&nbsp;" && f !== "&#160;") ? f.replace(/\"/g, "'") : "";
    }
    else
    {
        return f;
    }
}

// 去除数组里的对象的脚本与Html代码
function removeArrayStripHtml(arr)
{
    $(arr).each(
        function(index)
        {
            arr[index] = stripHtml(this);
        }
    )

    return arr;
}

// JSON数据处理：把jsonstring转换为json对象
function stringToJson(f)
{
    f = f;
    if (f.substr(0, 9) == "while(1);")
    {
        f = f.substr(9);
    }
    if (f.substr(0, 2) == "/*")
    {
        f = f.substr(2, f.length - 4);
    }
    f || (f = "{}");

    return typeof JSON === "object" && typeof JSON.parse === "function" ? JSON.parse(f) : eval("(" + f + ")");
}

// XML数据处理：把xmlstring转换为xml dom对象
function stringToDoc(f)
{
    var k;
    if (typeof f !== "string")
    {
        return f;
    }
    try
    {
        k = (new DOMParser).parseFromString(f, "text/xml")
    }
    catch (i)
    {
        k = new ActiveXObject("Microsoft.XMLDOM");
        k.async = false;
        k.loadXML(f);
    }

    return (k && k.documentElement && k.documentElement.tagName != "parsererror" ? k : null);
}

// 合并json数据，调用方法：var a = {a:"1",b:"2"}  var b ={c:"3",d:"4",e:"5"}  var c = mergeJsonData({}, [a, b]);
function mergeJsonData(des, src, override)
{
    if (src instanceof Array)
    {
        for (var i = 0, len = src.length; i < len; i++)
        {
            mergeJsonData(des, src[i], override);
        }
    }
    for (var i in src)
    {
        if (override || !(i in des))
        {
            des[i] = src[i];
        }
    }
    return des;
}

// 获取唯一字符串(两个参数分别为前缀和长度，可以不指定)
function getUniqueKey(prefix, length)
{
    if (prefix == null)
    {
        prefix = "id";
    }
    if (length == null || length < 8)
    {
        length = 8;
    }
    if (prefix.length >= length)
    {
        return prefix.substr(0, length);
    }

    var result = prefix;
    var chars = "1234567890abcdefghijklmnopqrstuvwxyz";

    var dupCount = 0;
    var preIndex = 0;
    for (var i = 0; i < length - prefix.length; ++i)
    {
        var index = Math.floor(Math.random() * 36.0);
        if (index == preIndex)
        {
            ++dupCount;
        }
        result += chars.charAt(index);
        preIndex = index;
    }
    if (length - prefix.length >= 2 && dupCount >= length - prefix.length - 2)
    {
        return getUniqueKey(prefix, length);
    }

    return result;
}

// 获取全球唯一值(类似sql中的newid)
function getNewID()
{
    var guid = "";

    for (var i = 1; i <= 32; i++)
    {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if (i == 8 || i == 12 || i == 16 || i == 20)
        {
            guid += "-";
        }
    }
    return guid;
}

// 验证是否为图片文件
function isImage(filename)
{
    if (filename.indexOf(".") != -1)
    {
        filename = filename.substr(filename.lastIndexOf("."));
    }

    switch (filename.toUpperCase())
    {
        case ".GIF":
        case ".JPG":
        case ".JPEG":
        case ".BMP":
        case ".PNG":
            return true;
        default:
            return false;
    }
}

function couldBrowseOnlineFile(filename)
{
    var ext = "";
    if (filename.indexOf(".") != -1)
    {
        ext = filename.substr(filename.lastIndexOf("."));
    }

    switch (ext.toUpperCase())
    {
        case ".RTF":
        case ".TXT":
        case ".PNG":
        case ".JPG":
        case ".JPEG":
        case ".BMP":
        case ".GIF":
            return true;
        default:
            return false;
    }
}

function isPDF(filename)
{
    var ext = "";
    if (filename.indexOf(".") != -1)
    {
        ext = filename.substr(filename.lastIndexOf("."));
    }

    switch (ext.toUpperCase())
    {
        case ".PDF":
            return true;
        default:
            return false;
    }
}

function isOfficeDocFile(filename)
{
    var ext = "";
    if (filename.indexOf(".") != -1)
    {
        ext = filename.substr(filename.lastIndexOf("."));
    }

    switch (ext.toUpperCase())
    {
        case ".DOC":
        case ".DOCX":
        case ".XLS":
        case ".XLSX":
        case ".PPT":
        case ".PPTX":
            return true;
        default:
            return false;
    }
}

// 验证是否为Office文件(支持Word、Excel、PowerPoint、Access、Visio、Project的常用格式)
function isOffice(filename)
{
    if (filename.indexOf(".") != -1)
    {
        filename = filename.substr(filename.lastIndexOf("."));
    }

    switch (filename.toUpperCase())
    {
        case ".DOC":
        case ".DOCX":
        case ".XLS":
        case ".XLSX":
        case ".PPT":
        case ".PPTX":
        case ".MDB":
        case ".ACCDB":
        case ".VSD":
        case ".MPP":
            return true;
        default:
            return false;
    }
}

// 是否文本框(input text、textarea)
function isTextBox(obj)
{
    return (obj && obj.tagName && (obj.tagName.toLowerCase() == "input" && obj.type.toLowerCase() == "text" || obj.tagName.toLowerCase() == "textarea"));
}

//获取一个下拉框中所有option的value的集合，以逗号分隔
function getDDLAllValues(ddl)
{
    var _ddl = typeof ddl == "string" ? $("#" + ddl) : $(ddl),
        options = _ddl.find("option"),
        values = [];

    options.each(function ()
    {
        values.push(this.value);
    });
    return values.join();
}


// 关闭窗口
function closeMe()
{
    window.opener = null;
    window.open("", "_self");
    window.close();

    setTimeout(closeWindow, 10);
}

// 关闭窗口2
function closeWindow()
{
    var obj = document.createElement("object");
    obj.classid = "CLSID:8856F961-340A-11D0-A96B-00C04FD705A2";
    obj.style.display = "none";

    document.body.appendChild(obj);

    try
    {
        obj.ExecWB(45, 1);
    }
    catch (err) { }
}


// 是否引用了js文件
function isIncludeJS(src)
{
    var bResult = false;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++)
    {
        if (scripts[i].src.indexOf("/") != -1 && scripts[i].src.substr(scripts[i].src.lastIndexOf("/") + 1).toUpperCase() == src.toUpperCase())
        {
            bResult = true;
            break;
        }
    }
    return bResult;
}

// 是否引用了jQuery
function isIncludeJQuery()
{
    return isIncludeJS("jquery-1.4.2.min.js") || isIncludeJS("jquery-1.7.2.min.js");
}

// 页面是否定义了DOCTYPE
function hasDoctype()
{
    var t = document.firstChild;
    return t && t.nodeType == 8 && t.nodeValue && t.nodeValue.substr(0, 7).toLowerCase().indexOf("ctype") != -1;
}

// 获取页面主题
function getTheme()
{
    var themes = ["Default", "Gray", "Silver", "Blue", "Jade", "Yellow", "Red", "TenderBlue", "JadeBlue", "GreyBlack", "VerdureGreen", "CloudsWhite"];
    for (var i = 0; i < document.styleSheets.length; i++)
    {
        var cssHref = document.styleSheets[i].href;
        if (cssHref)
        {
            for (var j = 0; j < themes.length; j++)
            {
                if (cssHref.toLowerCase().indexOf("/app_themes/" + themes[j].toLowerCase() + "/") != -1)
                {
                    return themes[j];
                }
            }
        }
    }

    return themes[0];
}

// 获取主题版本
function getThemeVersion(themeName)
{
    switch (themeName || getTheme())
    {
        case "Silver":
        case "Blue":
        case "Jade":
        case "Yellow":
        case "Red":
        case "TenderBlue":
        case "JadeBlue":
        case "GreyBlack":
        case "VerdureGreen":
        case "CloudsWhite":
            return 2014;
        default://Default、Gray
            return 2010;
    }
}



// 是否有效Url
function isValidUrl(url)
{
    return (url.substr(0, 11).toLowerCase() == "javascript:" || url.substr(0, 8).toLowerCase() == "https://"
        || url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 7).toLowerCase() == "mailto:"
        || url.substr(0, 7).toLowerCase() == "telnet:" || url.substr(0, 6).toLowerCase() == "ftp://"
        || url.substr(0, 5).toLowerCase() == "news:" || url.substr(0, 5).toLowerCase() == "wais:")
}

// 是否可执行Url
function isExecuteUrl(url)
{
    return (url.substr(0, 11).toLowerCase() == "javascript:" || url.substr(0, 7).toLowerCase() == "mailto:"
        || url.substr(0, 7).toLowerCase() == "telnet:" || url.substr(0, 5).toLowerCase() == "news:"
        || url.substr(0, 5).toLowerCase() == "wais:")
}

// 获取页面参数值
//@paramName 参数名
//@win window对象，默认是当前window
//@caseSensitive 是否大小写敏感， 默认为不敏感
function getParamValue(paramName, win, caseSensitive )
{
    var actualParamName = caseSensitive === true ? paramName : paramName.toLowerCase();
    var params = getParams(null, win, caseSensitive);
    return params[actualParamName];
}

// 获取页面参数对象(json对象)
function getParams(search, win, caseSensitive)
{
    if (!search)
    {
        if (!win)
        {
            win = window;
        }
        search = win.document.location.search.substr(1);
    }

    return getJsonParams(search, "&", "=", caseSensitive);
}

// 为url添加参数
function addUrlParam(url, paramName, paramValue)
{
    url += (url.indexOf("?") == -1 ? "?" : "&") + paramName + "=" + paramValue;
    return url;
}

// 为url添加参数
// @params name-value键值对，如{id:'abc',action:'getData'}
function addUrlParams(url, params)
{
    if (!params)
        return url;
    for (var param in params)
    {
        url += (url.indexOf("?") == -1 ? "?" : "&") + param + "=" + params[param];
    }
    return url;
}

// 为url添加随机参数（防止页面缓存）
function addRandParam(url)
{
    if (url.indexOf("?x=") == -1 && url.indexOf("&x=") == -1)
    {
        url = addUrlParam(url, "x", getUniqueKey("x"));
    }
    return url;
}

// 将按照某种规律连接的字符串转为json对象
// 如search为字符串1-1,2-0,6-1,7-1，则separator为,，parting为-
// @caseSensitive 是否大小写敏感， 默认为不敏感
function getJsonParams(search, separator, parting, caseSensitive)
{
    var result = {};

    var params = search.split(separator);
    for (var i = 0; i < params.length; i++)
    {
        // 过滤空字符串，避免param[1]返回undefined
        if (params[i].length > 0)
        {
            var param = params[i].split(parting);
            var paramName = caseSensitive === true ? param[0] : param[0].toLowerCase();
            result[paramName] = param[1];
        }
    }

    return result;
}

// 获取不包含参数的url字符串
function getCurrentUrl()
{
    return location.href.replace(location.search, "");
}

// 某个值(第一个参数)是否在集合中，如inValues("a","b","a","c")返回true
function inValues(value)
{
    if (arguments.length > 1)
    {
        for (var i = 1; i < arguments.length; i++)
        {
            if (value == arguments[i])
            {
                return true;
            }
        }
    }
    return false;
}

// document.click增加事件(method为已有的方法名，或function(arguments){...})
function addDocumentClick(method)
{
    if (document.all)
    {
        document.attachEvent('onclick', method);
    }
    else
    {
        document.addEventListener('click', method, false);
    }
}

// window.onload增加事件(method为已有的方法名，或function(arguments){...})
function addWindowLoad(method)
{
    if (document.all)
    {
        window.attachEvent('onload', method);
    }
    else
    {
        window.addEventListener('load', method, false);
    }
}

// 添加事件
function addEventHandler(obj, eventType, handler)
{
    if (obj.attachEvent)
    {
        obj.attachEvent("on" + eventType, handler);
    }
    else if (obj.addEventListener)
    {
        obj.addEventListener(eventType, handler, false);
    }
    else
    {
        obj["on" + eventType] = handler;
    }
}

// 取消事件
function removeEventHandler(obj, eventType, handler)
{
    if (obj.detachEvent)
    {
        obj.detachEvent("on" + eventType, handler);
    }
    else if (obj.removeEventListener)
    {
        obj.removeEventListener(eventType, handler, false);
    }
    else
    {
        obj["on" + eventType] = null;
    }
}

// 出发某个对象的某个事件
// element可以为对象本身，或对象ID
// event为事件名称，如click，blur，change，mouseout，mouseover等
function fireEvent(element, event)
{
    var ele = typeof element == "string" ? getObj(element) : element;

    if (document.createEventObject)
    {
        // dispatch for IE
        var evt = document.createEventObject();
        return ele.fireEvent('on' + event, evt)
    }
    else
    {
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !ele.dispatchEvent(evt);
    }
}

// 获取事件元素(可获取上级指定标记的元素)
function getEventObj(tagName)
{
    var obj = window.event.srcElement || window.event.target;
    if (tagName && obj)
    {
        while (obj.tagName && obj.tagName.toUpperCase() != tagName.toUpperCase())
        {
            obj = obj.parentNode;
        }
    }
    return obj;
}

// 获取上级元素(可获取上级指定标记的元素)
function getParentObj(obj, tagName)
{
    if (typeof obj == "string")
    {
        obj = getObj(obj);
    }
    if (obj)
    {
        obj = obj.parentNode;
        if (tagName)
        {
            while (obj.tagName && obj.tagName.toUpperCase() != tagName.toUpperCase())
            {
                obj = obj.parentNode;
            }
        }
    }
    return obj;
}

// 为数组添加元素（忽略重复元素，需要引用jQuery，keepLast为true时，表示去除重复的元素后再push到最后）
function pushArray(array, item, keepLast)
{
    var index = $.inArray(item, array);
    if (index == -1)
    {
        array.push(item);
    }
    else if (keepLast)
    {
        array.splice(index, 1);
        pushArray(array, item, keepLast);
    }
}

//获取单选框的值
function getRadioValue(rdl)
{
    var value = ""
    var rbs = rdl.getElementsByTagName("input");
    for (var i = 0; i < rbs.length; i++)
    {
        if (rbs[i].checked)
        {
            value = rbs[i].value;
            break;
        }
    }
    return value
}
//获取单选框的值
function setRadioValue(rdl, value)
{
    var rbs = rdl.getElementsByTagName("input");
    for (var i = 0; i < rbs.length; i++)
    {
        if (rbs[i].value == value)
        {
            rbs[i].checked = true;
            break;
        }
    }
}

/*/////////////////////////////////////////(1)基本方法(end)//////////////////////////////////////////*/











/*//////////////////////////////////////////(2)公共方法//////////////////////////////////////////////*/

// 检查文本框输入的字数
function checkLen(size)
{
    var txt = getEventObj();
    // edit by chengam 20130929
    if (txt && !txt.readOnly && trim(txt.value).length > size)
    {
        txt.value = trim(txt.value).substr(0, size);
    }
}

// 检查文本框输入的字节数
function checkSize(txt, size)
{
    // edit by maowenchao at 2017-11-15
    if (!txt.checkSizeHackedFlag) {
        txt.checkSizeHackedFlag = true;

        txt.attachEvent('onkeydown', function (e) {
            window.hackIME = (e.keyCode === 229 || e.keyCode === 197);
        });
    }

    // edit by chengam 20130929
    if (txt.readOnly) {
        return false;
    }

    if (window.hackIME == false) {	// edit by maowenchao at 2017-11-15
        if (txt.value.indexOf("'") != -1) {
            txt.value = txt.value.replace(/'/g, "’");
        }

        if (txt.value.replace(/[^\x00-\xff]/g, '**').length <= size) {
            return false;
        }

        txt.value = getStringByLength(txt.value, size, false);
    }

    //// edit by chengam 20130929
    //if (txt.readOnly)
    //{
    //    return false;
    //}
    //if (txt.value.indexOf("'") != -1)
    //{
    //    txt.value = txt.value.replace(/[\']/g, "’");
    //}
    //if (txt.value.replace(/[^\x00-\xff]/g, '**').length <= size)
    //{
    //    return false;
    //}

    //txt.value = getStringByLength(txt.value, size, false);
}

//获取字符串的字节长度
function getStringSize(str)
{
    str = str.replace(/[\']/g, "’");
    return str.replace(/[^\x00-\xff]/g, '**').length;
}

// 截断字符串(needSuffix是否需后缀)
function getStringByLength(str, size, needSuffix)
{
    // edit by maowenchao at 2017-11-15
    var i = 0;
    var vector = 0;
    var total = 0;
    var len = str.length;

    if (typeof str == 'string' && size > 0) {
        while (i < len && size > total) {
            vector = str.charCodeAt(i) > 255 ? 2 : 1;
            total += vector;
            i += 1;
        }

        str = str.substr(0, i);
    }
    else {
        return '';
    }

    // var newValue = value.substr(0, size);
    // var matches = newValue.match(/[^\x00-\xff]/g);

    // if (!matches) {
    //     return newValue;
    // }

    // var result = newValue.substr(0, size - matches.length);
    // if (needSuffix)
    // {
    //     result += "...";
    // }
    // return result;

    return needSuffix ? str + '...' : str;

}

//判断字符串是否为Null或为空，若为一连串空格，则视为空
//作者：胡春华
//日期：2013-05-13
function isNullOrEmpty(mystr)
{
    var bValue = false;
    if (!mystr||mystr==null)
    {
        return true;
    }
    //去除前面空格
    while ((mystr.indexOf(" ") == 0) && (mystr.length > 1))
    {
        mystr = mystr.substring(1, mystr.length);
    }
    //去除后面空格 
    while ((mystr.lastIndexOf(" ") == mystr.length - 1) && (mystr.length > 1))
    {
        mystr = mystr.substring(0, mystr.length - 1);
    }
    if (mystr == " " || mystr == "")
    {
        bValue = true;
    }
    return bValue;
}

// 初始化选择框的外观尺寸
function initBoxSize()
{
    var obj = document.getElementsByTagName("input");
    for (var i = 0; i < obj.length; i++)
    {
        if (obj[i].type.toLowerCase() == "checkbox" || obj[i].type.toLowerCase() == "radio")
        {
            obj[i].className = "idbox";
        }
    }
}

// 获取滚动条所在高度
function getScrollTop()
{
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop)
    {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body)
    {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

// 获取文档内容实际高度
function getScrollHeight()
{
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

// 取窗口可视范围的高度
function getClientHeight()
{
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight)
    {
        var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else
    {
        var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
}

// 设置滚动条高度
function setScrollTop(adjustHeight)
{
    // 滚动条当前位置大于0，说明已经有滚动条位置改变的
    if (getScrollTop() > 0)
    {
        if (getScrollTop() + adjustHeight > getScrollHeight())
        {
            if (document.documentElement && document.documentElement.scrollTop)
            {
                document.documentElement.scrollTop = getScrollHeight();
            }
            else if (document.body)
            {
                document.body.scrollTop = getScrollHeight();
            }
        }
        else
        {
            if (document.documentElement && document.documentElement.scrollTop)
            {
                document.documentElement.scrollTop = getScrollTop() + adjustHeight;
            }
            else if (document.body)
            {
                document.body.scrollTop = getScrollTop() + adjustHeight;
            }
        }
    }
}

// 刷新窗口(数据更新，一般在新增或修改完更新父窗口时使用)
function refreshForm(isAjax)
{
    if (isAjax)
    {
        // 在页面js中实现该方法
        reloadData();
    }
    else
    {
        window.location = window.location.href;
        //        window.history.go(0);

        //        var form = document.forms[0];
        //        if (!form.onsubmit || (form.onsubmit() != false))
        //        {
        //            form.submit();
        //        }
    }
}

// 设置按钮的可用状态，七种用法：
// (1) setBtnEnabled(["btnSave", "btnSaveOpen", "btnSaveClose"], enabled);
// (2) setBtnEnabled([getObj("btnSave"), getObj("btnSaveOpen"), getObj("btnSaveClose")], enabled);
// (3) setBtnEnabled("btnSave,btnSaveOpen,btnSaveClose", enabled);
// (4) setBtnEnabled("btnSave", enabled);
// (5) setBtnEnabled(getObj("btnSave"), enabled);
// (6) setBtnEnabled($("#btnSave"), enabled);
// (7) setBtnEnabled($("#btnSave,#btnSaveOpen,#btnSaveClose"), enabled);
function setBtnEnabled(btn, enabled)
{
    if (btn)
    {
        if (typeof btn === "string")
        {
            btn = btn.split(",");
        }
        if (isIncludeJQuery() && btn instanceof jQuery)
        {
            btn.each(function ()
            {
                this.disabled = !enabled;
            });
        }
        else if (btn.slice)
        {
            for (i in btn)
            {
                var obj = btn[i];
                if (typeof obj === "string")
                {
                    obj = getObj(obj);
                }
                if (obj)
                {
                    obj.disabled = !enabled;
                }
            }
        }
        else
        {
            btn.disabled = !enabled;
        }
    }
}

// 设置按钮的显示文件，七种用法：
// (1) setBtnEnabled(["btnSave", "btnSaveOpen", "btnSaveClose"], '文本');
// (2) setBtnEnabled([getObj("btnSave"), getObj("btnSaveOpen"), getObj("btnSaveClose")], '文本');
// (3) setBtnEnabled("btnSave,btnSaveOpen,btnSaveClose", '文本');
// (4) setBtnEnabled("btnSave", '文本');
// (5) setBtnEnabled(getObj("btnSave"), '文本');
// (6) setBtnEnabled($("#btnSave"), '文本');
// (7) setBtnEnabled($("#btnSave,#btnSaveOpen,#btnSaveClose"), '文本');
function setBtnText(btn,txt)
{
    if (btn)
    {
        if (typeof btn === "string")
        {
            btn = btn.split(",");
        }
        if (isIncludeJQuery() && btn instanceof jQuery)
        {
            btn.each(function ()
            {
                $('.btntextr',this).text(txt);                
            });
        }
        else if (btn.slice)
        {
            for (i in btn)
            {
                var obj = btn[i];
                if (typeof obj === "string")
                {
                    obj = getObj(obj);
                }
                if (obj)
                {
                    $('.btntextr',obj).text(txt); 
                }
            }
        }
        else
        {
            $('.btntextr',btn).text(txt); 
        }
    }
}

// 设置控件只读（主要是：radio、checkbox、select等控件）
function setControlReadOnly(obj)
{
    if (typeof obj == "string")
    {
        obj = getObj(obj);
    }
    if (obj)
    {
        var span = document.createElement('<span oncontextmenu=" return false;" onmouseover="this.setCapture()" onmouseout="this.releaseCapture()" onfocus="this.blur()" onbeforeactivate="return false"></span>');
        obj.insertAdjacentElement("beforeBegin", span);
        span.appendChild(obj);
    }
}

// 屏蔽JS错误
function killError()
{
    return true;
}

// 框架页是否加载完成
function frameIsReady(frameName)
{
    return (window.frames(frameName).document.readyState == "complete");
}

// 执行客户端方法
function execFuns(funs, win)
{
    if (!win)
    {
        win = window;
    }
    var doc = win.document;

    if (!win['DocCompleteEvents'])
    {
        win['DocCompleteEvents'] = [];
    }
    var eventsContainer = win['DocCompleteEvents'];

    eventsContainer.push(funs);

    if (doc.readyState == "complete" || win['DocReadyState'] == "complete")
    {
        for (var i = 0; i < eventsContainer.length; i++)
        {
            eventsContainer[i] && eventsContainer[i]();
        }
        win['DocCompleteEvents'] = null;
        win['DocReadyState'] = "complete"
    }
    else
    {
        doc.onreadystatechange = function ()
        {
            if (doc.readyState == "complete")
            {
                for (var i = 0; i < eventsContainer.length; i++)
                {
                    try
                    {
                        eventsContainer[i] && eventsContainer[i]();
                    }
                    catch (e) { }
                }
                win['DocCompleteEvents'] = null;
                win['DocReadyState'] = "complete";
            }
        }
    }
}

// 执行框架里的方法
function execFrameFuns(frameName, funs, win)
{
    if (!win)
    {
        win = window;
    }

    execFuns(funs, win.frames[frameName]);
}

// 加快渲染处理（对obj更改样式时，调用此函数可以加快渲染，funs为更改样式的代码函数）
function redrawHandle(obj, funs)
{
    if (funs)
    {
        var pObj = obj.parentNode;
        var preObj = obj.previousSibling;
        var nextObj = obj.nextSibling;
        var oriObj = preObj || nextObj || pObj;
        var opt = preObj ? 0 : (nextObj ? 1 : 2);
        var baseObj = oriObj;

        pObj.removeChild(obj);

        funs();

        if (oriObj.nodeType == 3)
        {
            baseObj = document.createElement("b");
            baseObj.swapNode(oriObj);
        }

        if (opt == 0)
        {
            baseObj.insertAdjacentElement("afterEnd", obj);
        }
        else if (opt == 1)
        {
            baseObj.insertAdjacentElement("beforeBegin", obj);
        }
        else if (opt == 2)
        {
            baseObj.appendChild(obj)
        }

        if (oriObj.nodeType == 3)
        {
            baseObj.swapNode(oriObj);
        }
    }
}

// 对Url字符串的参数进行编码
function encode(str, isComplex)
{
    // 简单编码
    if (!str || !isComplex)
    {
        return encodeURIComponent(str);
    }

    // 复杂编码
    var password = "http://www.ideasoft.net.cn";
    var passIndex = 0;
    var passLength = password.length;
    var num = 0;
    var byt = 0;
    var len = str.length;
    var resultStr = "";
    for (var i = 0; i < len; i++)
    {
        var code = str.charCodeAt(i);
        if (code >= 2048)
        {
            byt = (byt << 24) + (((code >> 12) | 0xe0) << 16) + ((((code & 0xfff) >> 6) | 0x80) << 8) + ((code & 0x3f) | 0x80);
            num += 24;
        }
        else if (code >= 128)
        {
            byt = (byt << 16) + (((code >> 6) | 0xc0) << 8) + ((code & 0x3f) | 0x80);
            num += 16;
        }
        else
        {
            num += 8;
            byt = (byt << 8) + code;
        }
        while (num >= 6)
        {
            var b = byt >> (num - 6);
            byt = byt - (b << (num - 6));
            num -= 6;
            b = (b + password.charCodeAt(passIndex++)) % 64;
            passIndex = passIndex % passLength;

            var code = (b <= 9) ? (b + 48) : ((b <= 35) ? (b + 55) : ((b <= 61) ? (b + 61) : ((b == 62) ? 44 : 95)));
            resultStr += String.fromCharCode(code);
        }
    }
    if (num > 0)
    {
        var b = byt << (6 - num);
        b = (b + password.charCodeAt(passIndex++)) % 64;
        passIndex = passIndex % passLength;

        resultStr += String.fromCharCode((b <= 9) ? (b + 48) : ((b <= 35) ? (b + 55) : ((b <= 61) ? (b + 61) : ((b == 62) ? 44 : 95))));
    }
    return resultStr;
}

// 对Url字符串的参数进行解码
function decode(str)
{
    return decodeURIComponent(str);
}

// 文本框中回车默认点击按钮
function clickBtn(btn)
{
    if (event.keyCode == 13)
    {
        if (typeof btn == "string")
        {
            btn = getObj(btn);
        }
        if (btn)
        {
            var txt = getEventObj("input");

            var chars1 = ["'", "[", "%", "_"];
            var chars2 = ["''", "[[]", "[%]", "[_]"];

            for (var i = 0; i < chars1.length; i++)
            {
                if (txt.value.indexOf(chars1[i]) != -1)
                {
                    var reg = new RegExp("[" + chars1[i] + "]", "g");
                    txt.value = txt.value.replace(reg, chars2[i]);

                    chars2[i] = chars2[i].replace(/\[/g, "\\[").replace(/\]/g, "\\]");
                }
                else
                {
                    chars1.splice(i, 1);
                    chars2.splice(i--, 1);
                }
            }

            event.keyCode = 9;
            event.returnValue = false;
            btn.click();

            for (var i = 0; i < chars2.length; i++)
            {
                var reg = new RegExp(chars2[i], "g");
                txt.value = txt.value.replace(reg, chars1[i]);
            }
        }
    }
}

// 文本框中忽略回车
function skipEnter()
{
    if (event.keyCode == 13)
    {
        event.returnValue = false;
        return false;
    }
}

// 弹出消息，并让控件obj获取焦点
// @msg 弹出的消息
// @obj 弹出消息后，获取焦点的对象，可以为DOM或JQuery对象
function alertMsg(msg, obj)
{
    alert(msg);
    if (obj && (isIncludeJQuery() && obj instanceof jQuery))
    {
        obj = obj[0];
    }
    if (!!obj)
    {
        if (obj.tagName.toUpperCase() == "INPUT" && obj.type.toLowerCase() == "text"
            || obj.tagName.toUpperCase() == "TEXTAREA" || obj.tagName.toUpperCase() == "SELECT")
        {
            try
            {
                obj.select();
            }
            catch (err) { }
        }
        if (obj.readOnly != true && obj.style.display != "none" && obj.disabled != true)
        {
            try
            {
                obj.focus();
            }
            catch (err) { }
        }
    }
    return false;
}

// 下载文件(frameName为页面上一个隐藏的IFrame的ID)
function downloadFile(fileName, fileTitle, frameName)
{
    if (!fileTitle)
    {
        if (fileName.indexOf("/") != -1)
        {
            fileTitle = fileName.substr(fileName.lastIndexOf("/") + 1);
        }
        else if (fileName.indexOf("\\") != -1)
        {
            fileTitle = fileName.substr(fileName.lastIndexOf("\\") + 1);
        }
        else
        {
            fileTitle = fileName;
        }
    }
    if (!frameName)
    {
        frameName = "ID_DownloadFile";
    }
    var frame = getObj(frameName);
    if (frame == null || frame.tagName.toUpperCase() != "IFRAME")
    {
        frame = document.createElement("IFRAME");
        frame.id = frameName;
        frame.style.display = "none";
        document.body.appendChild(frame);
    }

    var url = "/" + rootUrl + "/Common/Handler/Download.aspx?FileName=" + encode(fileName) + "&FileTitle=" + encode(fileTitle);
    if (arguments.length > 3 && arguments[3] === true)
    {
        url += "&Opt=Export";
    }
    if (arguments.length > 4 && arguments[4] === true) {
        url += "&IsDecrypt=1"
    }
    frame.src = url;
}



//获取某个对象的宽和高
//@obj 对象的html dom
function getObjWidthAndHeight(obj)
{
    var data = { width: 0, height: 0 };
    if (null == obj)
    {
        return data;
    }
    if (obj.clientWidth || obj.clientHeight)
    {
        data.width = obj.clientWidth - 5;
        data.height = obj.clientHeight - 5;
        return data;
    }
    if (obj.offsetWidth || obj.offsetHeight)
    {
        data.width = obj.offsetWidth - 6;
        data.height = obj.offsetHeight - 6;
        return data;
    }
    if (obj.scrollWidth || obj.scrollHeight)
    {
        data.width = obj.scrollWidth - 6;
        data.height = obj.scrollHeight - 6;
        return data;
    }
    if (obj.clip != null)
    {
        data.width = obj.clip.right - obj.clip.left - 6;
        data.height = obj.clip.bottom - obj.clip.top - 6;
        return data;
    }

}

// 选择日期(文本框的onfocus事件调用)
function selectDate(datePicking, datePicked, minDate, maxDate, format,dateCleared)
{
    var query = {};
    if (datePicking)
    {
        query.onpicking = datePicking;
    }
    if (datePicked)
    {
        query.onpicked = datePicked;
    }
    if (minDate && minDate.length > 0)
    {
        query.minDate = minDate;
    }
    if (maxDate && maxDate.length > 0)
    {
        query.maxDate = maxDate;
    }
    if (format)
    {
        query.dateFmt = format;
    }
    //增加日期空间的清空事件，2016-01-15 陈毓孟
    if (typeof(dateCleared)=="function")
    {
        query.oncleared = dateCleared;
    }

    WdatePicker(query);
}

// 日期是否合法
function dateIsRight(txt)
{
    if (txt.value != "")
    {
        var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/;

        if (!reg.test(txt.value))
        {
            return alertMsg("日期不合法。", txt);
        }
    }
}

// 获取控件的X轴绝对坐标
function getAbsAxisX(obj)
{
    return obj.getBoundingClientRect().left;
}

// 获取控件的Y轴绝对坐标
function getAbsAxisY(obj)
{
    return obj.getBoundingClientRect().top;
}

/* 图片加载失败 */
function imgError(url)
{
    var img = getEventObj();
    if (url != null)
    {
        img.src = url;
    }
    else
    {
        img.style.display = "none";
    }
}

/* 发起Ajax请求 */
// url：发送请求的地址
// data：发送到服务器的数据，json格式
// dataType：服务器返回的数据类型，如：xml、text、html、json、script等
// sucess：请求成功后的回调函数
// async：是否异步请求(只有明确指定为false时才为同步)
// type：请求类型，默认GET
function ajaxRequest(url, data, dataType, sucess, async, type, before, complete)
{
    if (url.indexOf("#") != -1)
    {
        url = url.substr(0, url.indexOf("#"));
    }
    url = addRandParam(url);

    $.ajax(
        {
            type: (type === "POST" ? "POST" : "GET"),
            url: url,
            async: !(async === false),
            data: data,
            dataType: dataType,
            success: sucess,
            cache:false,
            beforeSend: (before == null ? ajaxLoading : before),
            complete: (complete == null ? ajaxComplete : complete),
            error: ajaxError
        });
}

/* Ajax请求 */
function ajax(url, data, dataType, sucess, async, type, before, complete)
{
    data.IDAjax = true;
    ajaxRequest(url, data, dataType, sucess, async, (type === "GET" ? "GET" : "POST"), before, complete);
}

//导出文件(希望替代原ajaxExport,原导出方法请求数据后取得文件名称，再请求下载,当前导出方法只需一次Get请求）
//作者:陈毓孟
//日期:2013-01-17
function exportFile(url)
{
    var frameName = "frm_DownloadFile";
    var frame = document.createElement("IFRAME");
    frame.id = frameName;
    frame.style.display = "none";
    document.body.appendChild(frame);
    frame.src = url;
}

/* Ajax导出 */
function ajaxExport(url, jqGridID,exportBtn)
{
    var data = {};
    data.IDExport = true;
    if (jqGridID)
    {
        var params = $("#" + jqGridID).getGridParam("postData");
        for (var p in params)
        {
            if (p != "jqGridRequest" && p != "_search" && p != "nd")
            {
                data[p] = params[p];
            }
        }
    }
    setBtnEnabled(exportBtn, false);
    //修改导出按钮状态控制 2016-02-17 陈毓孟
    ajaxRequest(url, data, "json", function(result,status)
    {
        downloadExportFile(result, status);
        setBtnEnabled(exportBtn,true);
    }, true, "POST");
    
}

function ajaxExportByData(url, data)
{
    data.IDExport = true;
    ajaxRequest(url, data, "json", downloadExportFile, true, "POST");
}

/* 下载导出文件 */
function downloadExportFile(data, textStatus)
{
    if (data.Success == "Y")
    {
        downloadFile(data.Path, data.Name, null, true);
    }
    else
    {
        alert(data.Name);
    }
}

/* Ajax请求中 */
function ajaxLoading(xmlHttpRequest)
{
    var left;
    var top;
    var container = window["AjaxContainer"];
    if (container)
    {
        left = getAbsAxisX(container) + container.offsetWidth / 2 - 8;
        top = getAbsAxisY(container) + container.offsetHeight / 2 - 8;
        window["AjaxContainer"] = null;
    }
    else
    {
        left = document.body.offsetWidth / 2 - 8;
        top = document.body.offsetHeight / 2 - 8;
    }
    
    if(this.url)
    {

        this.url = addRandParam(this.url);
    
        var imgLoading = document.createElement("img");
        imgLoading.id = getParams(this.url.substr(this.url.indexOf("?") + 1))["x"];
        imgLoading.src = "/" + rootUrl + "/Image/home/loading.gif";
        imgLoading.className = "img_load";
        imgLoading.style.left = left;
        imgLoading.style.top = top;
        document.body.appendChild( imgLoading );
    }
}

/* Ajax请求完成 */
function ajaxComplete(xmlHttpRequest, textStatus)
{
    if(this.url)
    {
        var imgLoading = getObj(getParams(this.url.substr(this.url.indexOf("?") + 1))["x"]);
        if (imgLoading)
        {
            document.body.removeChild( imgLoading );
        }
    }
}

/* Ajax请求失败时给出提示 */
function ajaxError(xmlHttpRequest, textStatus, errorThrown)
{
    //    alert("数据失败：" + xmlHttpRequest.responseText);
    alert("数据获取或操作失败。\n\n代码：" + xmlHttpRequest.status + "\n信息：" + xmlHttpRequest.statusText);
}

// 设置Ajax请求时，显示进度动画的控件
function setAjaxContainer(obj)
{
    if (typeof obj == "string")
    {
        obj = getObj(obj);
    }

    window["AjaxContainer"] = obj;
}

/* 将多级架构加载入下拉框中时，返回名称的前缀 */
function getLevelPrefix(iStep)
{
    strResult = "";
    if (iStep > 0)
    {
        strResult += "　";
        for (var i = 0; i < iStep - 1; i++)
        {
            strResult += "|　　";
        }
        strResult += "|—";
    }
    return strResult;
}

// 选择项目DDL里的公司item，自动选中其下的第一个项目
function selectProject(ddl)
{
    if (ddl.options[ddl.selectedIndex].value.length > 1)
    {
        if (ddl.options[ddl.selectedIndex].value.indexOf("C_") != -1)
        {
            ddl.selectedIndex += 1;
        }
        return;
    }

    if (ddl.options[ddl.selectedIndex].value == "C")
    {
        ddl.selectedIndex += 1;
    }
}


/***数字校验方法***/

// 校验字符串是否为正整数
function isPositiveInt(value)
{
    var reg = /^[1-9][0-9]{0,8}$/;
    return reg.test(value);
}
// 校验字符串是否为整数和0
function isPositiveIntAnd0(value)
{
    var reg = /^[0-9][0-9]{0,8}$/;
    return reg.test(value);
}

// 校验文本框值是否为大于0的数值；
//校验权重
function isScorePercent(value)
{
    var vbool = false;
    if (value != "" && !isNaN(value) && getRound(value) >= 0)
    {
        vbool = true;
    }
    return vbool;
}

/***数字校验方法(end)***/


/***数字处理（value一般为文本框的值，len为小数位数，下同）***/

// 去掉空格、逗号
function formatNumText(value)
{
    // 有三种空格：半角空格、全角空格、&nbsp;的text形式空格
    var reg = ",", blanks = [32, 160, 8194, 8195, 8201, 12288];
    for (var i = 0; i < blanks.length; i++)
    {
        reg += String.fromCharCode(blanks[i]);
    }

    return value.toString().replace(new RegExp("[" + reg + "]", "g"), "");
}

// (1) 数值(四舍五入)
// 数值(四舍五入)-get
function getRound(value, len, min, max)
{
    if (typeof (value) == "object" && value.value)
    {
        value = value.value;
    }
    value = formatNumText(value);
    if (value.length > 1 && value.substr(value.length - 1, 1) == "%" && !isNaN(value.substr(0, value.length - 1)))
    {
        value = parseFloat(value.substr(0, value.length - 1)) / 100;
    }
    if (value == "" || isNaN(value) || Math.abs(value) == Infinity)
    {
        value = 0;
    }
    else
    {
        value = parseFloat(value);
    }
    if (len != null)
    {
        value = Math.round(value * Math.pow(10, len)) / Math.pow(10, len);
    }
    if (min != null && value < min)
    {
        value = min;
    }
    if (max != null && value > max)
    {
        value = max;
    }
    return value;
}
// 数值(四舍五入)-onblur
function setRound(len, min, max)
{
    var txt = getEventObj();
    txt.value = getRound(txt.value, len, min, max);
}

// (2) 正数
// 正数-get
function getPlusNum(value, len)
{
    var result = getRound(value, len);
    if (result <= 0)
    {
        result = 1;
    }
    return result;
}
// 正数-onblur
function setPlusNum(len)
{
    var txt = getEventObj();
    txt.value = getPlusNum(txt.value, len);
}

// (3) 非负数
// 非负数-get
function getNonMinusNum(value, len)
{
    var result = getRound(value, len);
    if (result < 0)
    {
        result = 0;
    }
    return result;
}
// 非负数-onblur
function setNonMinusNum(len)
{
    var txt = getEventObj();
    txt.value = getNonMinusNum(txt.value, len);
}

// (4) 整数
// 整数-get
function getIntNum(value)
{
    return getRound(value, 0);
}
// 整数-onblur
function setIntNum()
{
    var txt = getEventObj();
    txt.value = getIntNum(txt.value);
}

// (5) 正整数
// 正整数-get
function getPlusIntNum(value)
{
    var result = getRound(value, 0);
    if (result <= 0)
    {
        result = 1;
    }
    return result;
}
// 正整数-onblur
function setPlusIntNum()
{
    var txt = getEventObj();
    txt.value = getPlusIntNum(txt.value);
}

// (6) 非负整数
// 非负整数-get
function getNonMinusIntNum(value)
{
    var result = getRound(value, 0)
    if (result < 0)
    {
        result = 0;
    }
    return result;
}
// 非负整数-onblur
function setNonMinusIntNum()
{
    var txt = getEventObj();
    txt.value = getNonMinusIntNum(txt.value);
}

// (7) 会计格式
// 会计格式-get
function getAccountingNum(value, len)
{
    value = getRound(value);
    var isNegative = value < 0;
    value = Math.abs(value);
    if (len != null)
    {
        value = getRound(value, len);
    }
    var result = isNegative ? "-" : "";
    var arr = value.toString().split(".");
    for (var i = 0; i < arr[0].length; i++)
    {
        if (i > 0 && i % 3 == arr[0].length % 3)
        {
            result += ",";
        }
        result += arr[0].charAt(i);
    }
    if (len!=null && len > 0)//长度为0时不做补位处理 add by evan 2013-09-25
    {
        if (arr.length > 1)
        {
            //342.4保留两位小数，结果为342.40  【edit by huch 2013-07-11】
            if (arr[1].length < len)
            {
                result += "." + arr[1] + padRight("0", len - arr[1].length);
            }
            else
            {
                result += "." + arr[1];
            }
        }
        else
        {
            result += "." + padRight("0", len);
        }
    }
    return result;
}
// 会计格式-onblur
function setAccountingNum(len)
{
    var txt = getEventObj();
    txt.value = getAccountingNum(txt.value, len);
}

// (8) 百分比
// 百分比-get
function getPercentNum(value, len)
{
    value = getRound(value, len);
    if (value == 0)
    {
        return "0%";
    }
    var isNegative = value < 0;
    value = Math.abs(value);
    //var decimalPart = value.toString().split(".")[1];
    //len = decimalPart && decimalPart.length > 2 ? decimalPart.length - 2 : 0;
    len = 2; // 百分比中分子取2位小数
    value *= 100;
    return (isNegative ? "-" : "") + getRound(value, len) + "%";
}
// 百分比-onblur
function setPercentNum(len)
{
    var txt = getEventObj();
    txt.value = getPercentNum(txt.value, len);
}

// (9) 科学计数
// 科学计数-get
function getScientificNum(value, len)
{
    value = getRound(value, len);
    if (value == 0)
    {
        return "0E+0";
    }
    var isNegative = value < 0;
    var indexIsNegative = Math.abs(value) < 1;
    var cnt = 0;
    value = Math.abs(value);
    //len = parseFloat(value.toString().replace(/\./g, "")).toString().length - 1;
    len = 2; // 科学计数中底数取2位小数
    while (value < 1)
    {
        value *= 10;
        cnt++;
    }
    while (value >= 10)
    {
        value /= 10;
        cnt++;
    }
    return (isNegative ? "-" : "") + getRound(value, len) + "E" + (indexIsNegative ? "-" : "+") + cnt;
}
// 科学计数-onblur
function setScientificNum(len)
{
    var txt = getEventObj();
    txt.value = getScientificNum(txt.value, len);
}

// (10) 钱值(扩展会计格式，2位小数)
// 钱值-get
function getMoneyValue(value, len)
{
    return getAccountingNum(value, (len == null ? 2 : len));
}
// 百分比-onblur
function setMoneyValue(len)
{
    var txt = getEventObj();
    var value = formatNumText(txt.value);
    if (value == "" || isNaN(value))
    {
        txt.value = 0;
        return;
    }
    var num = txt.value.split('.')[0];
    if (num.length > 16)
    {
        txt.value = 0;
        return alertMsg("您填写的金额超过上限。", txt);
    }
    txt.value = getAccountingNum(txt.value, len);
}

// (11) 大写金额(最多支持2位小数)
// 大写金额-get
function getMoneyCNValue(value)
{
    var t = getRound(value, 2).toString();

    var ms = t.replace(/[^\\d\\.]/g, "").replace(/(\\.\\d{2}).+$/, "$1").replace(/^0+([1-9])/, "$1").replace(/^0+$/, "0");
    var ms = t;
    var txt = ms.split(".");
    while (/\\d{4}(,|$)/.test(txt[0]))
    {
        txt[0] = txt[0].replace(/(\\d)(\\d{3}(,|$))/, "$1,$2");
    }
    t = stmp = txt[0] + (txt.length > 1 ? "." + txt[1] : "");

    var number = Math.round(ms * 100) / 100;
    number = number.toString(10).split(".");
    var a = number[0];
    if (a.length > 16)
    {
        t = t.substring(0, 16);
        return "您填写的金额超过上限。"
    }
    else
    {
        var e = "零壹贰叁肆伍陆柒捌玖";
        var num1 = "";
        var len = a.length - 1;
        for (var i = 0; i <= len; i++)
        {
            num1 += e.charAt(parseInt(a.charAt(i))) + [["圆", "万", "亿", "万"][Math.floor((len - i) / 4)], "拾", "佰", "仟"][(len - i) % 4];
        }
        if (number.length == 2 && number[1] != "")
        {
            var a = number[1];
            for (var i = 0; i < a.length; i++)
            {
                num1 += e.charAt(parseInt(a.charAt(i))) + ["角", "分"][i];
            }
        }
        num1 = num1.replace(/零佰|零拾|零仟|零角/g, "零");
        num1 = num1.replace(/零{2,}/g, "零");
        num1 = num1.replace(/零(?=圆|万|亿)/g, "");
        num1 = num1.replace(/亿万/, "亿");
        num1 = num1.replace(/^圆零?/, "");
        if (num1 != "" && !/分$/.test(num1))
        {
            num1 += "整";
        }
        return num1;
    }
}

/***数字处理end***/


////去左空格;
//function ltrim(s)
//{
//    return s.replace(/(^\s*)/g, "");
//}
////去右空格;
//function rtrim(s)
//{
//    return s.replace(/(\s*$)/g, "");
//}
//去左空格;
function ltrim(s)
{
    var reg = new RegExp("^[\\s|" + String.fromCharCode(12288) + "]*");
    return s.replace(reg, "");
}
//去右空格;
function rtrim(s)
{
    var reg = new RegExp("[\\s|" + String.fromCharCode(12288) + "]*$");
    return s.replace(reg, "");
}

//去左右空格;
function trim(s)
{
    return rtrim(ltrim(s));
}
/* */

//组合日期字符串
function combineDateString(date, hour, minute)
{
    return date + ' ' + hour + ':' + minute;
}

// 根据日期字符串获取日期对象
// 传入的字符串，如果在包含时间时，最好由combineDateString生成。
// 日期字符串格式为2008-07-04 或 2009-07-04 14:30
function getDateObject(date)
{
    if (date instanceof Date)
    {
        return date;
    }
    else if (typeof date == "string")
    {
        date = date.split(" ");
        var dates = date[0] ? date[0].split("-") : [];
        var times = date[1] ? date[1].split(":") : [];
        var yy = dates[0] ? dates[0] : 1900;
        var mm = dates[1] ? (parseInt(dates[1], 10) - 1) : 0;
        var dd = dates[2] ? dates[2] : 1;
        var hh = times[0] ? times[0] : 0;
        var mi = times[1] ? times[1] : 0;
        var ss = times[2] ? times[2] : 0;

        return new Date(yy, mm, dd, hh, mi, ss);
    }
    else
    {
        return null;
    }
}

//比较两个日期是否在同一个季度 shux 2014年3月12日
function dateIsInAQuarter(date1, date2) {
    var date1 = getDateObject(date1);
    var date2 = getDateObject(date2);

    return (date1.getFullYear() == date2.getFullYear()) && (parseInt(date1.getMonth()) + 2) / 3 == ((parseInt(date2.getMonth()) + 2) / 3)
}
//比较两个日期是否在同一个年 shux 2014年3月12日
function dateIsInAYear(date1, date2) {
    var date1 = getDateObject(date1);
    var date2 = getDateObject(date2);

    return date1.getFullYear() == date2.getFullYear()
}
//比较两个日期是否在同一个月
function dateIsInAMonth(date1, date2, month)
{
    var date1 = getDateObject(date1);
    var date2 = getDateObject(date2);

    if (null == month)
    {
        return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth())
    }
    else
    {
        return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && ((date1.getMonth() + 1) == month);
    }
}

// 比较日期大小，参数为两个日期字符串
// 格式可以为 'yyyy-MM-dd',也可以为 'yyyy-MM-dd HH:mm'
function compareDate(startDate, endDate)
{
    var date1 = getDateObject(startDate);
    var date2 = getDateObject(endDate);

    if (date1 < date2)
    {
        return 1;
    }
    else if (date1 > date2)
    {
        return -1
    }
    else
    {
        return 0;
    }
}

//返回两个日期差(天)
function getDayDiff(startDateValue, endDateValue)
{
    var startDate = startDateValue;
    var endDate = endDateValue;
    startDate = startDate.split("-");
    endDate = endDate.split("-");
    var date1 = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    var date2 = new Date(endDate[0], endDate[1] - 1, endDate[2]);

    return Math.floor((date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000));
}

// 日期是否为工作日期(周六、周日为休息日)
function isWorkDate(dateValue)
{
    var date = getDateObject(dateValue);

    return (date.getDay() != 0 && date.getDay() != 6);
}

// 根据开始日期、结束日期获取默认工作天数(周六、周日为休息日)，参数为两个日期对象
function getWorkDays(startDate, endDate)
{
    var date1 = getDateObject(startDate);
    var date2 = getDateObject(endDate);

    return getWorkDaysBetweenTwoDate(date1, date2);
}

// 根据开始日期、结束日期获取默认工作天数(周六、周日为休息日)，参数为两个日期对象
function getWorkDaysBetweenTwoDate(date1, date2)
{
    var days = 0;

    while (date1 <= date2)
    {
        if (date1.getDay() != 0 && date1.getDay() != 6)
        {
            days++;
        }

        date1.setDate(date1.getDate() + 1);
    }

    return days;
}
// 根据开始日期、工作天数获取结束日期(周六、周日为休息日)
function getEndWorkDate(dateValue, days)
{
    var cnt = 0;
    var date = getDateObject(dateValue);

    while (cnt < days)
    {
        if (date.getDay() != 0 && date.getDay() != 6)
        {
            cnt++;
        }

        date.setDate(date.getDate() + 1);
    }

    date.setDate(date.getDate() - 1);

    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    if (mm < 10)
    {
        mm = "0" + mm;
    }
    if (dd < 10)
    {
        dd = "0" + dd;
    }

    return yyyy + "-" + mm + "-" + dd;
}



// 根据开始日期、工作天数获取结束日期
function getEndDate(dateValue, days)
{
    var cnt = 0;
    var date = getDateObject(dateValue);

    while (cnt < days)
    {
        cnt++;

        date.setDate(date.getDate() + 1);
    }

    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    if (mm < 10)
    {
        mm = "0" + mm;
    }
    if (dd < 10)
    {
        dd = "0" + dd;
    }

    return yyyy + "-" + mm + "-" + dd;
}

//获取周期的文本描述
//cycle : 格式 { Unit:'',Number:'',Value:[] }
function getCycleDescription(cycle)
{
    if (!cycle)
    {
        return "";
    }
    var tmpCycleValue = $.merge([],cycle.Value);
    switch (cycle.Unit)
    {
        case '0':
            return '每' + cycle.Number + '天';
            break;
        case '1':
            return '每' + cycle.Number + '周的' + getWeekCNName(tmpCycleValue);
            break;
        case '2':
            return '每' + cycle.Number + '个月的' + tmpCycleValue.join('、');
            break;
        case '9'://选择无周期的返回内容
            return '计划结束日期';
            break;
    }
    return "";
}

//获取周*的中文描述，如：周一、周二
//参数需要是整型，或整型数组，且值在1-7
//特别注意：每周的第一天从周日算起。
//示例：要获取周一，则传入的参数为2 ，即getWeekCNName(2),如果传入1，则返回周日
//传入整型数组，则返回以、号连接的字符串
function getWeekCNName(weekDays)
{
    if (!weekDays) return '';

    var arrNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    if (typeof weekDays === 'number')
    {
        if (weekDays < 1 || weekDays > 7)
            return '';
        return arrNames[weekDays - 1];
    }
    else
    {
        var retNames = [];
        $.each(weekDays, function (i, day)
        {
            if (day >= 1 && day <= 7)
            {
                retNames.push(arrNames[day - 1]);
            }
        });
        return retNames.join('、');
    }
}

// 获取百分比字符串
function formatPercent(baseNumber)
{
    return baseNumber.toFixed(2) + " %";
}

//过滤空格
String.prototype.Trim= function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.Ltrim = function()
{
    return this.replace(/(^\s*)/g, "");
}
String.prototype.Rtrim = function ()
{
    return this.replace(/(\s*$)/g, "");
}
//时间函数类似SQL的用法
//date.Format("yyyy-MM-dd");
Date.prototype.Format = function (fmt)
{
    //author: meizz 
    var o =
    {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.addDays = function (d)
{
    this.setDate(this.getDate() + d);
};


Date.prototype.addWeeks = function (w)
{
    this.addDays(w * 7);
};


Date.prototype.addMonths = function (m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};


Date.prototype.addYears = function (y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth())
    {
        this.setDate(0);
    }
};

/*//////////////////////////////////////////(2)公共方法(end)/////////////////////////////////////////*/











/*//////////////////////////////////////////(3)自定义控件效果////////////////////////////////////////*/

// select元素在指定位置插入option
function addOptionAt(selectCtl, optionValue, optionText, position)
{
    var option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionText;
    selectCtl.insertBefore(option, selectCtl.options[position]);
    //需要设置option的宽度为100%,否则，新加的option会导致select宽度与预设的100%不一致。
    //且必须在insert完成后设置宽度，否则无效。
    option.style.width = '100%';
    return option;
}

// 获取select元素下option的值的集合（返回数组）
// 可传入第二个参数，标识获取值的起始索引
function getOptionsValue(selectCtl)
{
    var ret = [];
    var iStart = arguments.length == 2 ? parseInt(arguments[1], 10) : 0;
    while (iStart < selectCtl.length)
    {
        if (selectCtl.options[iStart].value.length > 0)
        { ret.push(selectCtl.options[iStart].value); }
        iStart++;
    }
    return ret;
}

// 获取含树状文本的真实值
// 如：'| | |—门窗渗漏 '返回门窗渗漏
function getOutlineText(value)
{
    if (!value) return '';
    return value.replace(/([\|,\—,\s])*/gi, "");
}

// 切换按钮效果(鼠标悬停)
function setIDBtn(btn, i)
{
    var div = btn.parentNode.parentNode.parentNode.parentNode.parentNode;
    div.className = "btntb" + i;
}

function setIDBtn1(btn, i)
{
    var btnTag = btn.tagName.toUpperCase();

    if (btnTag == "BUTTON" || btnTag == "INPUT")
    {
        btn.className = (i == 0 ? "btnsmall" : (i == 1 ? "btnsmallon" : "btnsmalldown"));
        if (btnTag == "INPUT")
        {
            btn.className += " btnpad";
        }
    }
}
// 按钮的显隐
function setIDBtnDisp(btn)
{
    if (getObj(btn.id + "_tb"))
    {
        getObj(btn.id + "_tb").style.display = btn.style.display;
    }
}

// 显示按钮的下拉菜单
function showDLMenu(btn, ctrl)
{    
    if (btn.menu)
    {
        var k = btn.menu.split(/[,;]/g).length;
        if (!ctrl)
        {
            ctrl = "";
            for (var i = 0; i < k; i++)
            {
                ctrl += "1";
            }
        }
        else if (ctrl.indexOf("1") == -1)
        {
            return false;
        }

        var arrMenu = new Array(0);
        var menus = btn.menu.split(";");
        for (var i = 0; i < menus.length; i++)
        {
            arrMenu.push(menus[i].split(","));
        }
        for (var i = arrMenu.length - 1; i >= 0; i--)
        {
            for (var j = arrMenu[i].length - 1; j >= 0; j--)
            {
                if (ctrl.charAt(--k) == "0")
                {
                    arrMenu[i].splice(j, 1);
                }
            }
        }

        var isTheme2014 = getThemeVersion() === 2014;
        var lineHeight = isTheme2014 ? 32 : 25;
        var menuHtml = '<table class="dlmtb">';
        var m = 0;
        var n = 0;
        for (var i = 0; i < arrMenu.length; i++)
        {
            if (i > 0 && arrMenu[i].length > 0 && n > 0)
            {
                if (isTheme2014)
                {
                    menuHtml += '<tr><td colspan="2" class="dlmseptd1"><div class="dlmsepdiv"></div></td></tr>';
                }
                else
                {
                    menuHtml += '<tr><td class="dlmseptd1"></td><td><div class="dlmsepdiv"></div></td></tr>';
                }
                m++;
            }
            for (var j = 0; j < arrMenu[i].length; j++)
            {
                var menu = arrMenu[i][j].split("|");
                var btnType = menu[0];
                var key = btnType;
                var text = menu[1];
                var args = btn.getAttribute('clickargs') ? ',\'' + btn.getAttribute('clickargs') + '\'' : '';
                if (menu.length == 3)
                {
                    key = menu[1];
                    text = menu[2];
                }
                var img = "";
                if (menu[0].toLowerCase() != "none")
                {
                    img = stringFormat('<img class="img_16" src="/{0}/App_Themes/{1}/img/button/{2}{3}"/>',
                        rootUrl, (btn.theme ? btn.theme : "Default"), btnType.toLowerCase(), getButtonIconExtension(btn.theme || "Default"));
                }
                menuHtml += stringFormat('<tr onclick="parent.clickMenu(\'{0}\'{3})" onmouseover="parent.setDLMenu(this,0)" onmouseout="parent.setDLMenu(this,1)">'
                    + '<td class="dlmtd1">{1}</td><td class="dlmtd2">{2}</td></tr>', key, img, text, args);
                n++;
            }
        }
        menuHtml += "</table>";

        var width = 100;
        if (btn.menuwidth)
        {
            width = parseInt(btn.menuwidth, 10);
        }
        var height = m * 5 + n * lineHeight;
        var left = getAbsAxisX(btn) - 8;
        if (btn.tagName.toUpperCase() != "BUTTON")
        {
            left += 8;
        }
        var top = getAbsAxisY(btn) + btn.offsetHeight;

        showPopup(menuHtml, left, top, width, height);
    }
}

// 显示弹窗
// html:弹窗的html/left:弹窗X坐标/top:弹窗Y坐标/width:弹窗宽度/height:弹窗高度/bHideWhenClick:是否单击隐藏弹窗
function showPopup(html, left, top, width, height, bClickHide)
{
    var pop = window["ID_PopupMenu"];
    if (!pop)
    {
        pop = window.createPopup();
        for (var i = 0; i < document.styleSheets.length; i++)
        {
            if (document.styleSheets[i].href)
            {
                pop.document.createStyleSheet().addImport(document.styleSheets[i].href);
            }
        }
        if (!bClickHide === false)
        {
            pop.document.onclick = function () { pop.hide(); };
        }
        pop.document.oncontextmenu = function () { return false; };
        window["ID_PopupMenu"] = pop;
    }
    pop.document.body.innerHTML = html;

    if (left + width > document.body.offsetWidth)
    {
        left = document.body.offsetWidth - width;
    }
    if (left < 0)
    {
        left = 0;
    }
    
    setTimeout(function ()
    {
        pop.show(left, top, width, height, document.body);
    }, 10);

    return false;
}

// 隐藏弹窗
function hidePopup()
{
    var pop = window["ID_PopupMenu"];
    if (pop)
    {
        pop.hide();
    }
}

// 点击菜单项的方法(应在页面JS中重写该方法)
function clickMenu(key)
{
    alert(key);
}

// 菜单项目效果(鼠标悬停)
function setDLMenu(row, behavior)
{
    row.cells(0).className = (behavior == 0 ? "dlmtd1_on" : "dlmtd1");
    row.cells(1).className = (behavior == 0 ? "dlmtd2_on" : "dlmtd2");
}

// 内容分区控件效果(鼠标悬停)
function setIDArea(tb, behavior)
{
    var hidState = getObjTC(tb, 0, 0, "input", 0);
    var img1 = getObjTC(tb, 0, 0, "img", 0);
    var img2 = getObjTC(tb, 0, 3, "img", 0);
    var spTitle = getObjTC(tb, 0, 1, "span", 0);
    var spDesc = getObjTC(tb, 0, 2, "span", 0);
    var extension = img1.src.substr(img1.src.lastIndexOf("."));

    //tb.className = (behavior == 0 ? "areatbon" : "areatb");
    tb.className && (tb.className = tb.className.replace(behavior == 0 ? /\bareatb\b/ : /\bareatbon\b/,
        behavior == 0 ? "areatbon" : "areatb"));
    //spTitle.className = (behavior == 0 ? "areafonton" : "areafont");
    spTitle.className && (spTitle.className = spTitle.className.replace(behavior == 0 ? "areafont" : "areafonton",
        behavior == 0 ? "areafonton" : "areafont"));

    if (spDesc != null)
    {
        spDesc.className = (behavior == 0 ? "areadescfonton" : "areadescfont");
    }

    img1.src = img1.src.substr(0, img1.src.lastIndexOf("/") + 1) + (behavior == 0 ? "area_on" : "area") + extension;
    img2.src = img2.src.substr(0, img2.src.lastIndexOf("/") + 1) + (behavior == 0 ? (hidState.value == "1" ? "area_expand_on"
        : "area_collapse_on") : (hidState.value == "1" ? "area_expand" : "area_collapse")) + extension;
}

// 内容分区控件效果(鼠标点击)
function clickIDArea(tb)
{
    var hidState = getObjTC(tb, 0, 0, "input", 0);
    var img1 = getObjTC(tb, 0, 0, "img", 0);
    var img2 = getObjTC(tb, 0, 3, "img", 0);
    var extension = img1.src.substr(img1.src.lastIndexOf("."));
    hidState.value = (hidState.value == "0" ? "1" : "0");

    if (hidState.value === "0")
    {
        tb.className += " areatb-close"
    }
    else
    {
        tb.className = tb.className.replace(/\bareatb-close\b/, "");
    }


    img2.src = img2.src.substr(0, img2.src.lastIndexOf("/") + 1) + (hidState.value == "1" ? "area_expand_on" : "area_collapse_on") + extension;
}

/* 内容分区控件设置描述说明 */
function setIDAreaDesc(hid)
{
    getObjC(hid.parentNode.parentNode, "span", 1).innerText = (hid.value == "" ? "" : ("| " + hid.value));
}

// 文本框效果(获取焦点)
function setIDText(txt, behavior)
{
    //edit by 陈毓孟 2012-06-09, 
    //edit by 翁化青 2013-03-06,把replace中的"focus"字符串换成正则表达式/(focus)*$/
    txt.className = (behavior == 0 ? txt.className + "focus" : txt.className.replace(/(focus)*$/, ""));
}

//光标移动到最后
function getSelectPos(obj) {
    var esrc = obj;
    if (esrc == null) {
        esrc = event.srcElement;
    }
    var rtextRange = esrc.createTextRange();
    rtextRange.moveStart('character', esrc.value.length);
    rtextRange.collapse(true);
    rtextRange.select();
}

// 超链控件设置值
function setIDHrefText(hid)
{
    var aHref = getObj(hid.id + "_a");
    aHref.innerText = hid.value;
    aHref.title = hid.value;
}

// 选项卡选中效果(为各标签指定name)
function selectTab(index, aName, color)
{
    var span1;
    var span2;
    var themeName = getTheme();
    var theme = getThemeVersion(themeName);

    if (aName == null)
    {
        aName = "TabInfo";
    }

    var obj = getObjs(aName);
    if (obj.length)
    {
        var position1 = "left -24px";
        var position2 = "right -24px";
        if (theme === 2014)
        {
            position1 = "left -26px";
            position2 = "right -26px";
            if (!color && obj.length)
            {
                var divTab = getParentObj(obj[0], "div");
                if (divTab)
                {
                    switch(divTab.className)
                    {
                        case "idhometab":
                            //color = "#d7feff";
                            break;
                        default:
                            color = "#0285d0";
                            break;
                    }
                }
            }

            // TenderBlue中idtab选项卡高度为39px 
            if (themeName === "TenderBlue" || themeName === "JadeBlue" || themeName === "GreyBlack" || themeName === "VerdureGreen" || themeName === "CloudsWhite")
            {
                color = themeName === "TenderBlue" ? "#007aff" : "#4b5c64";
                var ul = getParentObj(obj[0], "ul");
                var tab = getParentObj(ul);

                if (tab.className && tab.className.indexOf("idtab") != -1)
                {
                    position1 = "left -30px";
                    position2 = "right -30px";
                }
            }
        }

        for (var i = 0; i < obj.length; i++)
        {
            //移除元素style,但保留style.display
            //用于在初始化选项卡时，可以在后台根据参数（或字段）来隐藏某个（或某几个）选项卡
            //方法是设置style.display='none';
            var tmpDisplay = obj[i].style.display;
            obj[i].removeAttribute("style");
            obj[i].style.display = tmpDisplay;

            span1 = getObjC(obj[i], "span", 0);
            span2 = getObjC(obj[i], "span", 1);

            if (span1)
            {
                span1.removeAttribute("style");
            }
            if (span2)
            {
                span2.removeAttribute("style");
            }
        }

        obj[index].style.backgroundPosition = position1;

        span1 = getObjC(obj[index], "span", 0);
        span2 = getObjC(obj[index], "span", 1);
        if (span1)
        {
            span1.style.backgroundPosition = position2;
        }
        if (span2)
        {
            span2.style.backgroundPosition = position1;
        }
        if (color)
        {
            if (span2)
            {
                span2.style.color = color;
            }
            else if (span1)
            {
                span1.style.color = color;
            }
        }
    }
}

// 选项卡选中效果(为各标签指定id)
// 参数：tab:某个标签(一般为超链a，须有id属性)，position1、position2为标签的两种背景位置，color为文字颜色
// bOnlyParentAffect：只被父级标签影响(根据标签的id按.分割的数组length来判断)
function selectIDTab(tab, position1, position2, color, bOnlyParentAffect)
{
    removeIDTabStyle(tab, bOnlyParentAffect);
    appendIDTabStyle(tab, position1, position2, color);
}

// 去掉选项卡标签的选中style
function removeIDTabStyle(tab, bOnlyParentAffect)
{
	var sels = window["IDTab_Href_ID"];
    if (sels)
    {
		// -----------------------------
		// modify by :wenghq 2013-05-10
    	//for (var i = sels.length - 1; i >= 0; i--)
    	var selLength = sels.length;
    	for (var i = selLength - 1; i >= 0; i--)
		// -----------------------------
        {
            if (!bOnlyParentAffect || sels[i].split(".").length >= tab.id.split(".").length)
            {
                var tabPre = getObj(sels[i]);
                if (tabPre)
                {
                    tabPre.removeAttribute("style");

                    var span1 = getObjC(tabPre, "span", 0);
                    var span2 = getObjC(tabPre, "span", 1);
                    if (span1)
                    {
                        span1.removeAttribute("style");
                    }
                    if (span2)
                    {
                        span2.removeAttribute("style");
                    }
                }
                sels.splice(i, 1);
            }
        }
    }
    else
    {
		// ----------------------------
		// modify by: wenghq 2013-05-10
    	//sels = new Array();
    	sels = [];
		// ----------------------------
    }
    sels.push(tab.id);
    window["IDTab_Href_ID"] = sels;
}

// 添加选项卡标签的选中style
function appendIDTabStyle(tab, position1, position2, color)
{
    var span1 = getObjC(tab, "span", 0);
    var span2 = getObjC(tab, "span", 1);

    tab.style.backgroundPosition = position1;
    if (span1)
    {
        span1.style.backgroundPosition = position2;
    }
    if (span2)
    {
        span2.style.backgroundPosition = position1;
    }
    if (color)
    {
        if (span2)
        {
            span2.style.color = color;
        }
        else if (span1)
        {
            span1.style.color = color;
        }
    }
}


// 选择公司和项目控件的效果
function setIDDDL(btn, i)
{
    var img = getObjC(btn.parentNode.parentNode.cells[1], "img", 0);
    var extension = img.src.substr(img.src.lastIndexOf("."));
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + (i == 0 ? "ddl_on" : (i == 1 ? "ddl" : "ddl_down")) + extension;
}

function setIDDDList(tr, id, i)
{
    var tb = getObj(id);
    var selectedIndex = getObjC(tb, "input", 2).value;

    tr.className = (i == 0 ? "ddl_listtr_on" : (tr.rowIndex == selectedIndex ? "ddl_listtr_down" : "ddl_listtr"));
}

// 选择公司和项目控件设置值
function setIDDDLText(hid)
{
    getObjC(hid.parentNode, "div", 0).innerText = hid.value;
}

// 鼠标动作
function setIDDDLOpt(id, opt)
{
    var divList = getObj(id + '_listdiv');
    if (opt != 0 && divList.style.display == "block")
    {
        divList.focus();
    }
    window[id + "_opt"] = opt;
}

function setKeyWord(id) {
    window[id + "_opt"] = 1;
    var txtkey = getObj('txtKeyWord_' + id);
    var divList = getObj(id + '_listdiv');
    if (txtkey) txtkey.focus();
    if (divList) divList.blur();
}

//下拉框中的搜索方法
function comboxSerach(id) {
    var $keyWord = $('#txtKeyWord_' + id);
    var $hidDataSource = $('#hidSerializeSource_' + id);
    var $table = $('#' + id + '_listtb');
    var keyWord = $keyWord.length > 0 ? $keyWord.val() : '';
    var data = $.stringToJSON($hidDataSource.val());
    if (keyWord.length < 1) {
        insertTableRow($table, data, 'A', id);
        return;
    }
    else {
        var arrData = getDataByFilter(data, keyWord);
        insertTableRow($table, arrData, 'S', id);
    }
}

//根据关键字查询
function getDataByFilter(datasource, keyword) {
    var arrData = [];
    if (datasource) {
        for (var i = 0; i < datasource.length; i++) {
            if (datasource[i].Name.indexOf(keyword) != -1) {
                arrData.push(datasource[i]);
            }
        }
    }
    return arrData;
}

//获取搜索选中数据在原有数据的索引
function getRowIndex(value, id) {
    if ($('#hidSerializeSource_' + id).length < 1) {
        return null;
    }
    var $hidDataSource = $('#hidSerializeSource_' + id);
    var data = $.stringToJSON($hidDataSource.val());
    for (var i = 0; i < data.length; i++) {
        if (data[i].ID == value) return i;
    }
    return -1;
}


//插入数据
function insertTableRow(table, arrData, aType, id) {
    clearTableAll(table.get(0));
    var isneedauthorize = table.attr('isneedauthorize');
    var isenablecorpselected = table.attr('isenablecorpselected');
    var isenableapprojectselected = table.attr('isenableapprojectselected');
    var isenableprojectselected = table.attr('isenableprojectselected');
    var isenableareaprojectselected = table.attr('isenableareaprojectselected');
    var selectedindex = table.attr('selectedindex');
    var onclientchange = table.attr('onclientchange');
    var selecttype = table.attr('selecttype').toLowerCase();
    var postbackscript = table.attr('postbackscript');
    var autopostback = table.attr('autopostback');
    if (autopostback != "Y") {
        postbackscript = "";
    }

    for (var i = 0; i < arrData.length; i++) {
        var idType = arrData[i].IDType;
        var isIntertemporal = arrData[i].IsIntertemporal;
        var isAuthorize = arrData[i].IsAuthor;
        var htmlRow = '';
        var trClass = "ddl_listtr";
        var index = getRowIndex(arrData[i].ID, id);
        if (index.toString() == selectedindex) {
            trClass = "ddl_listtr_down";
        }
        if ((this.isneedauthorize && !isAuthorize)
                    || (isenablecorpselected != "Y" && idType == "C")
                    || (isenableapprojectselected != "Y" && isIntertemporal == "Y" && idType == "P")
                    || (isenableprojectselected != "Y" && isIntertemporal == "N" && idType == "P")
                    || (isenableareaprojectselected != "Y" && isIntertemporal == "A" && idType == "P")) {
            //如果需要授权，且没有权限的是不允许选择,
            //如果不允许选择公司，那么公司选择项禁用
            //如果不允许选择跨期项目，那么跨期项目选择项禁用
            //如果不允许选择跨普通项目，那么普通项目选择项禁用
            //如果不允许选择项目分区，那么项目分区选择项禁用
            htmlRow = stringFormat("<tr id='{2}' class='ddl_listtr' value='{5}' idtype='{4}' onclick=\"setIDDDLOpt('{0}',2)\"><td>{3}{1}</td></tr>", id, arrData[i].Name, arrData[i].Outline, aType == "A" ? arrData[i].TreeImg : "", idType, arrData[i].ID);
        }
        else {
            htmlRow = stringFormat("<tr id='{6}' value='{1}' isintertemporal='{9}' idtype='{12}' class='{4}' "
                + "onmouseover=\"setIDDDList(this,'{0}',0)\" onmouseout=\"setIDDDList(this,'{0}',1)\">"
                + "<td onclick=\"if(selectDDLItem(this,'{0}','{1}',{3}{7},'{12}')){{10};{11}}\"{8}>{5}{2}</td></tr>",
                id, arrData[i].ID, arrData[i].Name, i, trClass, aType == "A" ? arrData[i].TreeImg : "", arrData[i].Outline,
                selecttype == 'project' ? stringFormat(" ,'{0}','{1}'", arrData[i].CorpID, arrData[i].CorpName) : "",
                isIntertemporal == "N" || isIntertemporal == "A" ? " dp='1'" : "", isIntertemporal, onclientchange, index.toString() == selectedindex ? "" : postbackscript, idType);
        }
        $(htmlRow).appendTo(table);
    }
}



// 选择某项
function selectDDLItem(td, id, value, index, corpID, corpName, idType)
{
    var obj = getEventObj();
    if (obj.tagName.toUpperCase() == "IMG" && (obj.src.indexOf("collapse") != -1 || obj.src.indexOf("expand") != -1))
    {
        window[id + "_opt"] = 2;
        getObj(id + "_listdiv").focus();
        return false;
    }

    var text = td.innerText;
    var tb = getObj(id);
    var tbList = getObj(id + '_listtb');
    var hidIndex = getObjC(tb, "input", 2);
    var oldIndex = parseInt(hidIndex.value, 10);

    if (oldIndex >= 0)
    {
        if (tbList.rows.length > oldIndex) tbList.rows[oldIndex].className = 'ddl_listtr';
    }
    tbList.rows[index].className = 'ddl_listtr_down';

    var _index = getRowIndex(value, id);
    if (_index && _index != index) {
        index = _index;
    }

    getObjC(tb, "input", 0).value = value;
    getObjC(tb, "input", 1).value = text;
    hidIndex.value = index;

    tb.value = value;
    tb.text = text;
    tb.selectedIndex = index;

    if (arguments.length > 4)
    {
        getObjC(tb, "input", 3).value = corpID;
        getObjC(tb, "input", 4).value = corpName;
        tb.corpID = corpID;
        tb.corpName = corpName;
        tb.idType = idType;
    }

    window[id + "_opt"] = 0;

    if (td.dp)
    {
        ajax('FillData.ashx', { 'action': 'SetDefaultProject', 'ProjectID': value, 'AccountID': tb.userid }, 'json', function (ret)
        {
            //后续操作 ret为AjaxHtmlData的json序列化版本。
        });
    }

    return true;
}
//获取IDSelectDDL选中项
function getIDSelectDDLSelectedItem(id)
{
    var selectedIndex = $("#"+id).attr("selectedIndex");
    if (selectedIndex > -1)
    {
        return $("#"+id+"_listtb").find("tr").eq(selectedIndex);
    }
    return null;
}
// 点击下拉框
function clickDDLBtn(tb)
{
    getObjC(tb, "button", 0).click();
}

// 显示下拉框
function showIDDDList(id)
{
    var rowHeight = getThemeVersion() === 2014 ? 32 : 16;// 行高
    var tb = getObj(id);
    var divList = getObj(id + '_listdiv');
    var tbList = getObj(id + '_listtb');

    var width = tb.offsetWidth;
    var height = tb.length * rowHeight + 2;
    if (divList.getElementsByTagName("button").length > 0)
    {
        height += getThemeVersion() === 2014 ? 28 : 22;
    }
    //if (!tb.fixed)
    //{
        //width = (width < 350 ? 350 : width);
    //}
    //height = (height > 300 ? 300 : (height < 10 ? 36 : height));
    //项目下拉框控件外层div的高度由数据高度决定，小于300px时取数据高度，此时可能小于里层div默认高度270px，导致无法滚动问题处理。
    height = (height > 300 ? 300 : (height < 10 ? 36 : 300));

    divList.style.width = width;
    divList.style.height = height;
    divList.style.display = (divList.style.display == "none" ? "block" : "none");

    if (divList.style.display == "block")
    {
        divList.focus();

        var selectedIndex = parseInt(getObjC(tb, "input", 2).value, 10);
        // selectedIndex == 0(下拉列表为空)时,会报脚本错误.edit by xiaoft 2012-08-28
        if (selectedIndex > 0 && tbList != null)
        {
            if (tbList.rows.length > selectedIndex) tbList.rows[selectedIndex].className = 'ddl_listtr_down';

            // 滚动滚动条，使选中项可见
            var visibleRowCnt = divList.offsetHeight / rowHeight;   // 可见行数
            var minTop = (selectedIndex + 1 > visibleRowCnt ? (selectedIndex + 1 - visibleRowCnt) * rowHeight : 0);
            var maxTop = (selectedIndex > 0 ? selectedIndex * rowHeight : 0);

            if (divList.scrollTop < minTop || divList.scrollTop > maxTop)
            {
                divList.scrollTop = maxTop;
            }
        }

        // add by denght  当内容超出了下拉框显示宽度是，展示滚动条
        if (width < $(tbList).width()) {
            $(divList).css('overflowX', 'scroll')
        }
    }
}

// 隐藏下拉框
function hideIDDDList(id)
{
    var divList = getObj(id + '_listdiv');
    divList.style.display = "none";
    window[id + "_opt"] = 0;
}

// 点击下拉框之外隐藏下拉框的方法
function hideIDCPDDL(id)
{
    if (window[id + "_opt"] == 0)
    {
        if (window[id + "_timer"])
        {
            window.clearTimeout(window[id + "_timer"]);
        }
        hideIDDDList(id);
    }
    else if (window[id + "_opt"] == 1)
    {
        var timerDDL = window.setTimeout("hideIDCPDDL('" + id + "')", 20);
        window[id + "_timer"] = timerDDL;
    }

    //    var e = getEventObj();
    //           
    //    while (e)
    //    {
    //        if (e.id == id || e.id == id + '_listdiv')   
    //        {   
    //            return;   
    //        }   
    //        e = e.parentNode;        
    //    } 

    //    hideIDDDList(id);
}


/*
该方法用于绑定下拉框（ddl），
data为绑定下拉框的json对象数组，数组中每个元素需要具有value和text属性，
ddlID为下拉框的ID，
vID为默认选项的键值对，格式为value|text,
ddlHeaderType为当data参数为空时，下拉框绑定的默认选项的值，
根据需要可传入"ALL"、"SELECT"或“NO”（不区分大小写），和枚举DDLHeaderType的选项一致,
当传入的ddlHeaderType不属于上述3个值或不传入该参数时，都当做ALL处理。
注：data参数的数组中不需要包含默认选项。
作者：翁化青
日期：2012-09-07
*/
var bindDdl = function (data, ddlID, vID, ddlHeaderType)
{
    var ddl = getObj(ddlID);
    if (!ddl)
    {
        return false;
    }
    var strDefaultHeader = "",
        headerType = (typeof ddlHeaderType == "undefined") ? "" : ddlHeaderType;

    switch (headerType.toLocaleUpperCase())
    {
        case "ALL":
            strDefaultHeader = "全部";
            break;
        case "SELECT":
            strDefaultHeader = "请选择";
            break;
        case "NONE":
            strDefaultHeader = "";
            break;
        default:
            strDefaultHeader = "全部";
            break;
    }

    ddl.options.length = 0;

    if (strDefaultHeader)
    {
        addOptionAt(ddl, '', strDefaultHeader, ddl.length);
    }

    $(data).each(function (i, d)
    {
        addOptionAt(ddl, d.value, d.text, ddl.length);
    });

    if (ddl.options.length > 0 && typeof vID === 'string')
    {
        if (vID.split('|')[0] != "")
        {
            ddl.value = vID.split('|')[0];
        }
    }
}

// 项目过滤
//dataRangeType 项目数据来源：null|None|Mine我的,All全部
function filterProject(dataRangeType)
{
    if (!dataRangeType || dataRangeType.toLowerCase() == 'none')
    {
        dataRangeType = 'Mine';
    }
    openModalWindow("/" + rootUrl + "/Common/Private/VProjectFilter.aspx?DataRangeType=" + dataRangeType, 300, 600);
}

// 显示年份下拉框(参数说明：(1)存放年份的textbox或hidden的id、(2)按钮的id、(3)是否多选、(4)客户端change事件的js函数句柄、(5)服务端change事件的js函数句柄)
function showIDYear(txtId, btnId, bMulti, changeMethod, postBackMethod)
{
    var txtYY = getObj(txtId);
    var btn = getObj(btnId);
    var width = 200;
    var height = getThemeVersion() === 2014 ? 160 : 120;
    var left = getAbsAxisX(btn) + btn.offsetWidth - width;
    var top = getAbsAxisY(btn) + btn.offsetHeight - 1;

    var type = (bMulti ? 'type="checkbox"' : 'type="radio" name="Year"');
    var method = "";
    if (!bMulti)
    {
        method = "parent.selectIDYear('" + txtId + "',this," + changeMethod + "," + postBackMethod + ")";
    }

    var html = '<table id="ddl_yy" class="ddl_yy font">';
    var currentYear = new Date().getFullYear();
    var minYear = currentYear - 9;
    var maxYear = currentYear + 10;
    var deta = 0;
    for (var i = minYear; i <= maxYear; i++)
    {
        deta++;
        var rdoId = txtId + "_" + i;
        var checked = (txtYY.value.indexOf(i) != -1 ? "checked" : "");

        if (deta % 4 == 1)
        {
            html += '<tr>';
        }
        html += '<td onmouseover="this.style.backgroundColor=\'#B5CEE8\'" onmouseout="this.style.backgroundColor=\'\'">';

        html += '<input id="' + rdoId + '" ' + type + ' class="idbox hand" value="' + i + '" onclick="' + method + '" ' + checked
            + '/><label for="' + rdoId + '" class="hand">' + i + '</label>';

        html += '</td>';
        if (deta % 4 == 0)
        {
            html += '</tr>';
        }
    }

    var defaultY = idToday.getFullYear();
    var aDefault = '<a onclick="parent.setIDYearValue(\'' + txtId + '\',\'' + defaultY + '\',' + changeMethod + ',' + postBackMethod + ')">今年</a>'
    var btn = '<button onclick="parent.setIDYearValue(\'' + txtId + '\',\'\',' + changeMethod + ',' + postBackMethod + ')" '
        + 'onmouseout="parent.setIDBtn1(this,0)" onmouseover="parent.setIDBtn1(this,1)" onfocus="this.blur()" class="btnsmall">'
        + '<span class="btntext" style="padding-top:2px">清空</span></button>';
    if (bMulti)
    {
        btn += '<button onclick="parent.selectIDYear(\'' + txtId + '\',ddl_yy,' + changeMethod + ',' + postBackMethod + ')" '
            + 'onmouseout="parent.setIDBtn1(this,0)" onmouseover="parent.setIDBtn1(this,1)" onfocus="this.blur()" class="btnsmall">'
            + '<span class="btntext" style="padding-top:2px">确定</span></button>';
    }
    html += '<tr><td>' + aDefault + '</td><td colspan="3" style="text-align:right">' + btn + '</td></tr></table>';

    showPopup(html, left, top, width, height, false);
}


// 显示年份下拉框(参数说明：(1)存放月份的textbox或hidden的id、(2)按钮的id、(3)是否多选、(4)客户端change事件的js函数句柄、(5)服务端change事件的js函数句柄)
function showIDMonth(txtId, btnId, bMulti, changeMethod, postBackMethod, endYearNum)
{
    var txtYY = getObj(txtId);
    var btn = getObj(btnId);
    var width = 540;
    var height = getThemeVersion() === 2014 ? 255 : 220;   // 如果从2001到2025，则height设为410(390)
    var left = getAbsAxisX(btn) + btn.offsetWidth - width;
    var top = getAbsAxisY(btn) + btn.offsetHeight - 1;
    
    endYearNum = new Date().getFullYear()+2; //设置月份选择控件的最大年份范围为当前年加2  杜学  2017-04-10
    var endYear = (endYearNum || 2016);
    var startYear = (endYearNum || 2016)-9;

    var type = (bMulti ? 'type="checkbox"' : 'type="radio" name="Year"');
    var method = "";
    if (!bMulti)
    {
        method = "parent.selectIDYear('" + txtId + "',this," + changeMethod + "," + postBackMethod + ")";
    }
    
    var html = '<table id="ddl_yy" class="ddl_yy font">';
    for (var i = startYear; i <= endYear; i++)
    {
        html += '<tr><td>' + i + '年</td>';

        for (var j = 1; j <= 12; j++)
        {
            var month = i + '-' + (j < 10 ? '0' + j : j);
            var rdoId = txtId + "_" + i + '_' + j;
            var checked = (txtYY.value.indexOf(month) != -1 ? "checked" : "");

            html += '<td onmouseover="this.style.backgroundColor=\'#B5CEE8\'" onmouseout="this.style.backgroundColor=\'\'">';

            html += '<input id="' + rdoId + '" ' + type + ' class="idbox hand" value="' + month + '" onclick="' + method + '" ' + checked
                + '/><label for="' + rdoId + '" class="hand">' + j + '月</label>';

            html += '</td>';
        }

        html += '</tr>'
    }

    var m = idToday.getMonth() + 1;
    var defaultM = idToday.getFullYear() + '-' + (m < 10 ? '0' + m : m);
    var aDefault = '<a onclick="parent.setIDYearValue(\'' + txtId + '\',\'' + defaultM + '\',' + changeMethod + ',' + postBackMethod + ')">本月</a>'
    var btn = '<button onclick="parent.setIDYearValue(\'' + txtId + '\',\'\',' + changeMethod + ',' + postBackMethod + ')" '
        + 'onmouseout="parent.setIDBtn1(this,0)" onmouseover="parent.setIDBtn1(this,1)" onfocus="this.blur()" class="btnsmall">'
        + '<span class="btntext" style="padding-top:2px">清空</span></button>';
    if (bMulti)
    {
        btn += '<button onclick="parent.selectIDYear(\'' + txtId + '\',ddl_yy,' + changeMethod + ',' + postBackMethod + ')" '
            + 'onmouseout="parent.setIDBtn1(this,0)" onmouseover="parent.setIDBtn1(this,1)" onfocus="this.blur()" class="btnsmall">'
            + '<span class="btntext" style="padding-top:2px">确定</span></button>';
    }
    html += '<tr><td>' + aDefault + '</td><td colspan="12" style="text-align:right">' + btn + '</td></tr></table>';

    showPopup(html, left, top, width, height, false);
}

// 年(月)份选择控件选择年(月)份
function selectIDYear(txtId, obj, changeMethod, postBackMethod)
{
    var txtYY = getObj(txtId);
    var value = "";
    if (obj.tagName.toUpperCase() == "TABLE")
    {
        var objs = obj.getElementsByTagName("input");
        for (var i = 0; i < objs.length; i++)
        {
            if (objs[i].checked)
            {
                value += "," + objs[i].value;
            }
        }
        if (value != "")
        {
            value = value.substr(1);
        }
    }
    else
    {
        value = obj.value;
    }

    setIDYearValue(txtId, value, changeMethod, postBackMethod);
}

// 选择或清空年(月)份时设置年份
function setIDYearValue(txtId, value, changeMethod, postBackMethod)
{
    hidePopup();
    var txtYY = getObj(txtId);
    if (txtYY.value != value)
    {
        txtYY.value = value;
        txtYY.title = value;
        if (changeMethod)
        {
            eval('(' + changeMethod + ')()');
        }
        if (postBackMethod)
        {
            eval('(' + postBackMethod + ')()');
        }
    }
}

// 上传控件文件下载
function downloadIDUpFile(isDecrypt)
{
    var row = getEventObj("tr");
    var fileName = row.filename;
    var fileTitle = row.filetitle;

    downloadFile(fileName, fileTitle, null, false, isDecrypt === 1);
}

// 查看或编辑上传控件中的Office文件
function showIDUpOfficeFile(behavior)
{
    //    alert("123");
    var row = getEventObj("tr");
    var params = "";
    if (behavior == 1)
    {
        //        params = "?Aim=" + encode("Read", 1) + "&FileName=" + encode(row.filename, 1);
        params = "VFileBrowser.aspx?FileName=" + encode(row.filename, 1);
    }
    else if (behavior == 2)
    {
        //        params = "?Aim=" + encode("Edit", 1) + "&SavePath=" + encode(row.filename, 1);
        params = "VFileEditor.aspx?SavePath=" + encode(row.filename, 1);
        /// <reference path="../Common/Doc/VFileEditor.aspx" />
        openModalWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);
        checkInIDUpOfficeFile(row.filename);
        return;
    }
    else if (behavior == 3)
    {
        //        params = "?Aim=" + encode("Read", 1) + "&FileName=" + encode(row.filename, 1) + "&p=" + encode(new Date().Format("yyyy-MM-dd"), 1);
        params = "VFileBrowser.aspx?FileName=" + encode(row.filename, 1) + "&p=" + encode(new Date().Format("yyyy-MM-dd"), 1);

    }

    //    openWindow("/" + rootUrl + "/Common/Doc/VFileEditor.aspx" + params, 960, 650);
    openWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);

}

function checkInIDUpOfficeFile(fileName)
{
    var url = "/" + rootUrl + "/Common/Doc/VFileEditor.aspx";
    ajax(url, {
        "Action": "CheckIn",
        "FileName": fileName
    }, "json", function (data)
    {
    });
}

function showIDUpCouldBrowseFile()
{
    var row = getEventObj("tr");
    openWindow("/" + rootUrl + row.filename, 960, 650);
}

function showIDUpImageFile()
{
    var row = getEventObj("tr");
    var params = "VImageBrowser.aspx?FileName=" + encode('/' + rootUrl + row.filename, 1);
    openWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);
}

function showIDUpPDFFile()
{
    var row = getEventObj("tr");
    var params = "VPDFBrowser.aspx?FileName=" + encode(row.filename, 1);
    openWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);
}

function showIDUpCADFile() {
    var row = getEventObj("tr");
    var params = "VCADBrowser.aspx?FileName=" + encode(row.filename, 1);
    openWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);
}

// 打开上传控件中的文件(文件名超链)
function showIDUpFile()
{
    var row = getParentObj(getEventObj("table"), "tr");
    var fileName = row.filename;
    var fileTitle = row.filetitle;

    downloadFile(fileName, fileTitle);
    // window.open("/" + rootUrl + fileName);
}

function showIDImageFile(url)
{
    var params = "VImageBrowser.aspx?FileName=" + encode("/" + rootUrl + url, 1);
    openWindow("/" + rootUrl + "/Common/Doc/" + params, 960, 650);
}

// 上传控件文件存档
function saveIDUpFile()
{
    var row = getEventObj("tr");
    var fileName = row.filename;
    var fileTitle = row.filetitle;
    alert('文件路径：' + fileName + '\n文件名：' + fileTitle + '\n开发中……');
}

// 上传控件文件删除
function deleteIDUpFile()
{
    var aHref = getEventObj();
    var row = getParentObj(aHref, "tr");
    var table = getParentObj(row, "table");
    var swfu = eval("swfu_" + table.id);

    // 删除事件
    if (swfu.settings.custom_settings.fileDeleted)
    {
        swfu.settings.custom_settings.fileDeleted(row, table.id);
    }
    deleteUploadedFile(aHref, row.filename, row.filetitle, swfu.settings.custom_settings.delReally);

    // 是否自动生成缩略图
    var autoGenerateThumbnail = (swfu.settings.post_params.Thumbnail == "1");

    var trFile = table.parentNode.parentNode;
    var txtNames = getObjC(trFile, "input", 0);
    var txtTitles = getObjC(trFile, "input", 1);
    var txtLengths = getObjC(trFile, "input", 2);
    var txtAuthorIDs = getObjC(trFile, "input", 3);
    var txtAuthorNames = getObjC(trFile, "input", 4);
    var txtTimes = getObjC(trFile, "input", 5);
    var txtThumbnails;
    if (autoGenerateThumbnail)
    {
        txtThumbnails = getObjC(trFile, "input", 6);
    }
    var i = row.rowIndex;

    table.deleteRow(i);

    var stat = swfu.getStats();
    stat.successful_uploads--;
    swfu.setStats(stat);

    if (txtNames.value != "")
    {
        var names = txtNames.value.split("|");
        var titles = txtTitles.value.split("|");
        var lengths = txtLengths.value.split("|");
        var authorIDs = txtAuthorIDs.value.split("|");
        var authorNames = txtAuthorNames.value.split("|");
        var times = txtTimes.value.split("|");
        names.splice(i, 1);
        titles.splice(i, 1);
        lengths.splice(i, 1);
        authorIDs.splice(i, 1);
        authorNames.splice(i, 1);
        times.splice(i, 1);
        txtNames.value = names.join("|");
        txtTitles.value = titles.join("|");
        txtLengths.value = lengths.join("|");
        txtAuthorIDs.value = authorIDs.join("|");
        txtAuthorNames.value = authorNames.join("|");
        txtTimes.value = times.join("|");
        if (autoGenerateThumbnail)
        {
            var thumbnails = txtThumbnails.value.split("|");
            thumbnails.splice(i, 1);
            txtThumbnails.value = thumbnails.join("|");
        }
    }

    for (; i < table.rows.length; i++)
    {
        table.rows[i].cells[0].innerText = i + 1;
    }
}

// 清空上传的文件
function clearIDUpFile(fileID)
{
    var table = getObj(fileID);
    var trFile = table.parentNode.parentNode;
    var swfu = eval("swfu_" + fileID);

    clearTableAll(table);

    getObjC(trFile, "input", 0).value = "";
    getObjC(trFile, "input", 1).value = "";
    getObjC(trFile, "input", 2).value = "";
    getObjC(trFile, "input", 3).value = "";
    getObjC(trFile, "input", 4).value = "";
    getObjC(trFile, "input", 5).value = "";

    // 生成缩略图时还清空缩略图
    if (swfu.settings.post_params.Thumbnail == "1")
    {
        getObjC(trFile, "input", 6).value = "";
    }

    try
    {
        var stat = swfu.getStats();
        stat.successful_uploads = 0;
        swfu.setStats(stat);
    }
    catch (e) { }
}

// 格式化文件大小
function formatIDFileSize(fileID, colIndex)
{
    if (colIndex > 0)
    {
        var tbFile = getObj(fileID);
        if (tbFile != null && tbFile.rows.length > 0 && tbFile.rows[0].cells.length > colIndex)
        {
            for (var i = 0; i < tbFile.rows.length; i++)
            {
                tbFile.rows[i].cells[colIndex].innerText = getIDFileSize(tbFile.rows[i].filesize);
            }
        }
    }
}

// 获取文件大小
function getIDFileSize(baseNumber)
{
    var sizeUnits = [1073741824, 1048576, 1024, 1];
    var sizeLabels = ["GB", "MB", "KB", "bytes"];

    var i, unit, sizeLabel;

    if (baseNumber == 0)
    {
        return "0 KB";
    }
    else if (baseNumber > 0 && baseNumber < 1024)
    {
        baseNumber = 1024;
    }

    unit = baseNumber;
    sizeLabel = "";
    for (i = 0; i < sizeUnits.length; i++)
    {
        if (baseNumber >= sizeUnits[i])
        {
            unit = (baseNumber / sizeUnits[i]).toFixed(2);
            sizeLabel = sizeLabels.length >= i ? " " + sizeLabels[i] : "";
            break;
        }
    }

    return unit + sizeLabel;
}

// 文件类型不存在
function fileIcoError()
{
    var img = getEventObj();
    img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + "_.png";
}

// 日期控件激活下一日期控件
function toNextIDDT(id, txt)
{
    var nextDate
    if (document.getElementsByName(id).length > 1)
    {
        while (!nextDate && txt)
        {
            txt = txt.parentNode;
            var objs = txt.getElementsByTagName("input");
            for (var i = 0; i < objs.length; i++)
            {
                if (objs[i].id == id)
                {
                    nextDate = objs[i];
                    break;
                }
            }
        }
    }
    else
    {
        nextDate = getObj(id);
    }

    if (nextDate && nextDate.value == "")
    {
        nextDate.focus();
    }
}

// 日期控件选择时间
function selectIDTime(txt, opt, index)
{
    var div = txt.parentNode;
    var theme = getTheme();
    // add by zhangmq 20160308
    var bTenderBlue = (theme === "TenderBlue" || theme === "JadeBlue" || theme === "GreyBlack" || theme === "VerdureGreen" || theme === "CloudsWhite");
    var bgColor = bTenderBlue ? '#007aff' : '#B5CEE8';
    var hoverColor = bTenderBlue ? 'this.style.color=\'#FFFFFF\'' : '';
    var color = bTenderBlue ? 'this.style.color=\'#515557\'' : '';
    var html = '<table id="ddl_yy" ' + (bTenderBlue ? 'cellspacing="3"' : '') + ' class="ddl_yy font">';
    var width, height, min, max;
    var left = getAbsAxisX(div) - 1;

    if (div.className == "time_div" || div.className == "form_time_div")
    {
        left = getAbsAxisX(txt) - 1;
    }
    var top = getAbsAxisY(div) + div.offsetHeight - 1;
    if (opt == "h")
    {
        width = bTenderBlue ? 132 : 100;
        height = bTenderBlue ? 92 : 80;
        for (var i = 0; i <= 23; i++)
        {
            if (i % 6 == 0)
            {
                html += '<tr>';
            }
            min = txt.min ? parseInt(txt.min) : 0;
            max = txt.max ? parseInt(txt.max) : 23;
            if (i >= min && i <= max)
            {
                html += '<td onmouseover="this.style.backgroundColor=\'' + bgColor + '\';' + hoverColor + '" onmouseout="this.style.backgroundColor=\'\';' +
                    color + '"' + ' onclick="parent.setIDTimeValue(' + i + ',\'' + txt.name + '\',' + index + ')">' + i + '</td>';
            }
            else
            {
                html += '<td style="color:#999999;cursor:normal">' + i + '</td>';
            }

            if (i % 6 == 5)
            {
                html += '</tr>';
            }
        }
    }
    else if (opt == "m" || opt == "s")
    {
        width = bTenderBlue ? 90 : 80;
        height = bTenderBlue ? 70 : 60;
        for (var i = 0; i <= 55; i += 5)
        {
            if (i / 5 % 4 == 0)
            {
                html += '<tr>';
            }
            html += '<td onmouseover="this.style.backgroundColor=\'' + bgColor + '\';' + hoverColor
                + '" onmouseout="this.style.backgroundColor=\'\';' + color + '"'
                + ' onclick="parent.setIDTimeValue(' + i + ',\'' + txt.name + '\',' + index + ')">' + i + '</td>';

            if (i / 5 % 4 == 3)
            {
                html += '</tr>';
            }
        }
    }
    html += '</table>';
    showPopup(html, left, top, width, height, false);
}

// 日期控件设置时分
function setIDTimeValue(value, name, index)
{
    if (value < 10)
    {
        value = "0" + value;
    }

    var objs = document.getElementsByName(name);
    if (objs.length > index)
    {
        objs[index].value = value;
        objs[index].blur();
    }
    hidePopup();
}

// 上下箭头调节小时和分钟
function fixIDTime(txt, opt)
{
    if (event.keyCode == 38 || event.keyCode == 40)
    {
        var max = (opt == "h" ? (txt.max ? parseInt(txt.max) : 23) : 59);
        var min = txt.min ? parseInt(txt.min) : 0;
        var value = parseInt(txt.value, 10) + (event.keyCode == 38 ? 1 : -1);
        value = (value == min - 1 ? max : (value == max + 1 ? min : value));
        if (value < 10)
        {
            value = "0" + value;
        }
        txt.value = value;
    }
}

/*//////////////////////////////////////////(3)自定义控件效果(end)///////////////////////////////////*/











/*//////////////////////////////////////////(4)搜索框、首页公共操作//////////////////////////////////*/

/* 显示搜索框 */
function showFilter(img, divID, height)
{
    var width = 300;
    var divFilter = getObj(divID);

    divFilter.style.left = getAbsAxisX(img) - width + img.offsetWidth;
    divFilter.style.top = getAbsAxisY(img) + img.offsetHeight;
    divFilter.style.width = width;
    divFilter.style.height = height;
    divFilter.style.display = "block";
}

/* 隐藏高级搜索框 */
function hideFilter(divID)
{
    getObj(divID).style.display = "none";
}

/* 重置搜索框 */
function resetFilter(divID)
{
    var divFilter = getObj(divID);
    var obj = divFilter.getElementsByTagName("select");
    for (var i = 0; i < obj.length; i++)
    {
        obj[i].selectedIndex = 0;
    }
    obj = divFilter.getElementsByTagName("input");
    for (var i = 0; i < obj.length; i++)
    {
        if (obj[i].type.toLowerCase() == "text")
        {
            obj[i].value = "";
        }
    }
}

/* 显示更多搜索条件(母版页) */
function showMoreMPF(btn, trMoreFilter)
{
    if (btn === 0 || btn === 1)
    {
        var trobj = getEventObj("tr");
        trobj.className = btn === 0 ? "trmfilter" : "trmfilter_on";

        var themes = getTheme();
        // add by zhangmq 2016 操作图标加悬浮效果
        if (themes === "TenderBlue" || themes === "JadeBlue" || themes === "GreyBlack" || themes === "VerdureGreen" || themes === "CloudsWhite")
        {
            var trmfdiv = trobj.firstChild.firstChild;
            var className = trmfdiv.className;
            if (btn === 0)
            {
                className.indexOf("_active") !== -1 && (trmfdiv.className = className.replace("_active", ""));
            }
            else
            {
                className.indexOf("_active") === -1 && (trmfdiv.className = className + "_active");
            }
        }
        return;
    }

    var display = (trMoreFilter.style.display === "none" ? "block" : "none");
    trMoreFilter.style.display = display;
    btn.title = (display === "none" ? "更多" : "收起");

    switch (btn.tagName.toLowerCase())
    {
        case "button":
            var img = getObjC(btn, "img", 0);
            img.src = (img.src.substr(0, img.src.lastIndexOf("/") + 1) + (display === "none" ? "navdown.gif" : "navup.gif"));
            break;
        case "td":
            getObjC(btn, "div", 0).className = display === "none" ? "trmfdiv" : "trmfdiv_up";
            break;
    }
}

/* 
显示警告区域
bShow : 是否显示
msg   : 显示的消息 
*/
function showWarnMsg(bShow, msg, color)
{
    var warnArea = $('tr[id*=\'trWarn\']');
    if (warnArea && warnArea.length == 1)
    {
        msg = msg ? msg : '';
        if (bShow)
        {
            warnArea.show();
        }
        else
        {
            warnArea.hide();
        }
        $('span[class=\'warnmsg\']', warnArea).text(msg);
        if (color != null)
        {
            $('span[class=\'warnmsg\']', warnArea).css("color", color);
        }
    }
}

/* 当页面为TabList时，对页面进行一些处理 */
function setIDTabList()
{
    if (parent != null)
    {
        var ifr1 = parent.frames["IDModTabFrame"];
        var ifr2 = parent.frames["IDWorkaroundTabFrame"];
        if (ifr1 && ifr1.location.href == window.location.href)
        {
            tbIDListMP.rows[0].cells[0].style.display = "none";
            tbIDListMP.rows[0].cells[2].style.display = "none";
            tbIDListMP.rows[1].cells[0].style.display = "none";
            tbIDListMP.rows[1].cells[2].style.display = "none";
            tbIDListMP.rows[2].style.display = "none";

            tbIDListMP.rows[0].cells[1].className = "tab" + tbIDListMP.rows[0].cells[1].className;
            if (trMPF)
            {
                trMPF.cells[0].className = "tab" + trMPF.cells[0].className;
            }
        }
        if (ifr2 && ifr2.location.href == window.location.href)
        {
            tbIDListMP.rows[0].cells[0].style.display = "none";
            tbIDListMP.rows[0].cells[2].style.display = "none";
            tbIDListMP.rows[1].cells[0].style.display = "none";
            tbIDListMP.rows[1].cells[2].style.display = "none";
            tbIDListMP.rows[2].style.display = "none";

            tbIDListMP.rows[0].cells[1].className = "tab" + tbIDListMP.rows[0].cells[1].className;
            if (trMPF)
            {
                trMPF.cells[0].className = "tab" + trMPF.cells[0].className;
            }
        }
    }
}

/* 保存公共页的操作日志标题 */
function saveCommonLogTitle(hidTitleID)
{
    if (window.dialogArguments)
    {
        getObj(hidTitleID).value = window.dialogArguments.document.title;
    }
}

/*//////////////////////////////////////////(4)搜索框、首页公共操作(end)/////////////////////////////*/











/*//////////////////////////////////////////(5)jqGrid获取的相关处理//////////////////////////////////*/

// 刷新JQGrid
function refreshJQGrid(jqGridID)
{    
    $('#' + jqGridID).trigger('reloadGrid');
}

// JQGrid是否加载完毕
function jqGridIsComplete(jqGridID)
{
    if (window[jqGridID + "_divWidth"])
    {
        return true;
    }
    else
    {
        return false;
    }
}

///获取jqGrid被选中行的行ID(即tr的客户端html id属性值)
///@jqGridID jqGrid的客户端ID
///@bEnableMultiselect 可选,是否启用多行选择（即有checkbox的时候),
///                    启用多行选择后返回的是数组，否则返回的是单字符串
function getJQGridSelectedRowsID(jqGridID, bEnableMultiselect)
{
    if (null == bEnableMultiselect || undefined == bEnableMultiselect)
    {
        bEnableMultiselect = $('#' + jqGridID).getGridParam('multiselect');
    }
    if (bEnableMultiselect)
    {
        return $('#' + jqGridID).getGridParam('selarrrow');
    }
    else
    {
        return $('#' + jqGridID).getGridParam('selrow');
    }
    return '';
}
///获取jqGrid被选中行的关键数据
///获取jqGrid被选中行的行ID(即tr的客户端html id属性值)
///@jqGridID jqGrid的客户端ID
///@bEnableMultiselect 是否启用多行选择（即有checkbox的时候),
///@keyName 关键列名
function getJQGridSelectedRowsData(jqGridID, bEnableMultiselect, keyName)
{

    var selectedRowsID = getJQGridSelectedRowsID(jqGridID, bEnableMultiselect);
    var selectedKeyDatas = [];
    if (bEnableMultiselect)
    {
        for (var i = 0; i < selectedRowsID.length; i++)
        {
            selectedKeyDatas.push($('#' + jqGridID).getRowData(selectedRowsID[i])[keyName]);
        }
    }
    else
    {
        selectedKeyDatas.push($('#' + jqGridID).getRowData(selectedRowsID)[keyName]);
    }
    return selectedKeyDatas;
}

///获取jqGrid当前页所有行的行ID(即tr的客户端html id属性值)
///@jqGridID jqGrid的客户端ID
function getJQGridAllRowsID(jqGridID)
{
    return $('#' + jqGridID).getDataIDs();
}

///获取jqGrid当前页所有行的关键数据
///获取jqGrid所有行的行ID(即tr的客户端html id属性值)
///@jqGridID jqGrid的客户端ID
///@keyName 关键列名
function getJQGridAllRowsData(jqGridID, keyName)
{
    var allRowsID = $('#' + jqGridID).getDataIDs();
    var selectedKeyDatas = [];
    for (var i = 0; i < allRowsID.length; i++)
    {
        selectedKeyDatas.push($('#' + jqGridID).getRowData(allRowsID[i])[keyName]);
    }
    return selectedKeyDatas;
}

function checkJQGridEnableMultiSel(jqGridID)
{
    return $('#' + jqGridID).getGridParam('multiselect');
}

function $TC(jqGridID, selectedRowID, keyName)
{
    return $('#' + jqGridID).getRowData(selectedRowID)[keyName];
}

///动态的为jqGrid添加参数，通过postData实现
///@jqGrid，可以是字符串（jqGrid的ID，只适用于当前页),也可以为jqGrid对象（可以传入框架页中的对象)
///@param,要求是一个以json元素组成的数组，如：
///        之所以设计成数组，是出于可以将param 按功能、特性等不同的特征分组传递(方便维护)。
///        实际上，即使设计成单一json元素也是可以的。
///[{id:'2',name:'abc'}]，那么传递到后台的将有id和name,可用Request来获取
function addParamsForJQGridQuery(jqGrid, param)
{
    //判断是否是数组
    if (!param.splice)
    {
        return;
    }
    var jqObj = jqGrid;
    if (typeof jqGrid === 'string')
    {
        jqObj = $('#' + jqGrid);
    }

    for (var i = 0; i < param.length; i++)
    {
        if (typeof param[i] !== 'object')
        {
            continue;
        }
        for (var key in param[i])
        {
            jqObj.getGridParam('postData')[key] = param[i][key];
        }
    }
}

// 当设置jqGrid的AutoLoad为false时，本方法可以判断jqGrid是否加载过，未加载时会再次加载
// 页面上刷新jqGrid的方法中要先调用本方法，如果返回true，则刷新jqGrid
// 参考VSelectAvailableGroup.aspx的js文件
function loadJQGrid(jqGridID, query)
{   
    if (window[jqGridID + "_Loaded"] === false)
    {
        eval(jqGridID + "Load(query)");
        return false;
    }
    else
    {
        addParamsForJQGridQuery(jqGridID, [query]);
        return true;
    }
}

// 当设置jqGrid的AutoLoad为false时，该方法在生成的jqGrid客户端脚本中使用
function getJQGridPostDataParamByQuery(oriParam, query)
{
    var result = oriParam;
    if (query)
    {
        result = mergeJsonData({}, [query, result]);
    }

    return result;
}

// 获取jqGrid的宽度和高度
function getJQGridWidth(jqGridID)
{
    var jqGridObj = getObj("divID_" + jqGridID);
    // tenderblue主题列表页中的jqGrid两边无边框 add by zhangmq 20160314
    //var bTenderblueList = jqGridObj.childNodes[0] &&
    //    jqGridObj.childNodes[0].currentStyle.getAttribute("borderLeftWidth") === "medium" || false;

    //补增语法兼容 by denghm at 2016年4月1日
    var temp, bTenderblueList;
    if (jqGridObj.childNodes[0]) {
        temp = (window.getComputedStyle ? window.getComputedStyle(jqGridObj.childNodes[0], null).borderLeftWidth : jqGridObj.childNodes[0].currentStyle.borderLeftWidth);
    }
    bTenderblueList = jqGridObj.childNodes[0] && temp === "medium" || false;
    

    return jqGridObj.offsetWidth - (bTenderblueList ? 0 : 2);
}
function getJQGridHeight(jqGridID, bShowFooter)
{
    var theme = getTheme();
    var bTenderBlue = (theme === "TenderBlue" || theme === "JadeBlue" || theme === "GreyBlack" || theme === "VerdureGreen" || theme === "CloudsWhite");
    var isTheme2014 = getThemeVersion(theme) === 2014;
    var headerHeight = isTheme2014 ? (bTenderBlue ? 38 : 32) : 28;
    var pagerHeight = isTheme2014 ? (bTenderBlue ? 39 : 32) : 26;
    var footerHeight = isTheme2014 ? (bTenderBlue ? 37 : 31) : 25;
    var height = getObj("divID_" + jqGridID).offsetHeight - headerHeight - pagerHeight - (bShowFooter ? footerHeight : 0);

    return height;
}

// 页面大小发生变化时，让jqGrid自适应
function resizeJQGrid(divJQGrid)
{
    var jqGridID = divJQGrid.id.replace("divID_", "");
    if (window[jqGridID + "_divWidth"])// && window[jqGridID + "_divHeight"])
    {
        var widthChanged = (divJQGrid.offsetWidth != window[jqGridID + "_divWidth"]);
        var heightChanged = (divJQGrid.offsetHeight != window[jqGridID + "_divHeight"]);

        if (widthChanged || heightChanged)
        {
            var jqGrid = $("#" + jqGridID);

            if (widthChanged)
            {
                var jqTable = getObj(jqGridID);
                var width = getJQGridWidth(jqGridID);
                var shrink = (jqTable.offsetWidth <= width);
                jqGrid.setGridWidth(width, shrink);
                fillJQGridWidth(jqTable, width);
                if (!shrink)
                {
                    jqGrid.setGridParam({ shrinkToFit: false });
                }

                window[jqGridID + "_divWidth"] = divJQGrid.offsetWidth;
            }

            if (heightChanged)
            {
                var height = getJQGridHeight(jqGridID, jqGrid.getGridParam("footerrow"));
                jqGrid.setGridHeight(height);

                window[jqGridID + "_divHeight"] = divJQGrid.offsetHeight;
            }
        }
    }
}

// 回发前保存数据：选中行、页面条件(页面条件加入Url字符串)
function saveJQGridPostBackData(jqGridID, selRow, sortName)
{
    registerSubmitEvents(function ()
    {
        // 保存选中行
        saveJQGridPostBackSelectedRows(jqGridID, selRow, sortName);

        // 保存页面条件
        if ($('#' + jqGridID).getGridParam('autoSaveJQGridFilters'))
        {
            saveJQGridFilters(jqGridID);
        }
    });
}

// 回发前保存选中行
function saveJQGridPostBackSelectedRows(jqGridID, selRow, sortName)
{
    var jqGrid = $("#" + jqGridID);
    var selectedRowIDS = jqGrid.getGridParam(selRow);

    if (selectedRowIDS && selectedRowIDS.length >= 1)
    {
        var selectedValues = "";
        for (var i = 0; i < selectedRowIDS.length; i++)
        {
            selectedValues += jqGrid.getRowData(selectedRowIDS[i])[sortName];

            if (i < selectedRowIDS.length - 1)
            {
                selectedValues += "&";
            }
        }
        // 只有在允许多选的时候才进行ID组合。
        if (selRow.toLowerCase() != 'selrow')
        {
            selectedRowIDS = selectedRowIDS.join("&");
        }

        $("#" + jqGridID + "_SelectedDatas").val(selectedRowIDS + "|" + selectedValues);
    }
}

// 回发前保存页面条件
function saveJQGridFilters(jqGridID)
{
    var filter = "";
    var params = $("#" + jqGridID).getGridParam("postData");

    for (var p in params)
    {
        if (p != "jqGridRequest" && p != "_search" && p != "nd" && p != "rows" && p != "page" && p != "sidx" && p != "sord")
        {
            filter += "&" + p + "=" + params[p];
        }
    }
    if (filter != "")
    {
        if (!window["JQGridPostBackUrl"])
        {
            window["JQGridPostBackUrl"] = document.forms[0].action;
        }
        if (window["JQGridPostBackUrl"].indexOf("?") == -1)
        {
            window["JQGridPostBackUrl"] += "?";
            filter = filter.substr(1);
        }

        document.forms[0].action = window["JQGridPostBackUrl"] + filter;
    }
}

// 页面在第一次进入(或回发后)数据加载完毕后设置选中状态、设置JQGrid附加样式
function initJQGrid(jqGridID, selectedRowIDS)
{
    var jqGrid = $("#" + jqGridID);
    var jqTable = getObj(jqGridID);
    var that = jqGrid.getGridParam("onSelectRow");

    jqGrid.setGridParam({
        gridComplete: function ()
        {
            // 设置选中状态
            if (selectedRowIDS != "")
            {
                var rowIDsArr = selectedRowIDS.split("&");
                for (var i = 0; i < rowIDsArr.length; i++)
                {
                    try
                    {
                        jqGrid.setSelection(rowIDsArr[i], false);
                    }
                    catch (err) { }
                }
            }

            // 存jqGrid外层的div的size
            if (!window[jqGridID + "_divWidth"])
            {
                window[jqGridID + "_divWidth"] = getObj("divID_" + jqGridID).offsetWidth;
            }
            if (!window[jqGridID + "_divHeight"])
            {
                window[jqGridID + "_divHeight"] = getObj("divID_" + jqGridID).offsetHeight
            }

            // 重置表格宽度
            var width = getJQGridWidth(jqGridID);
            if ((jqGrid.getGridParam("shrinkToFit") || jqTable.offsetWidth <= width) && jqTable.rows.length > 0)
            {
                jqGrid.setGridWidth(width, true);
                fillJQGridWidth(jqTable, width);
            }

            // 更新页码、页大小、排序字段、排序类型(用于回发)
            $("#" + jqGridID + "_CurrentPageIndex").val(jqGrid.getGridParam("page"));
            $("#" + jqGridID + "_PageSize").val(jqGrid.getGridParam("rowNum"));
            $("#" + jqGridID + "_SortName").val(jqGrid.getGridParam("sortname"));
            $("#" + jqGridID + "_SortOrder").val(jqGrid.getGridParam("sortorder"));

            if (typeof customGridComplete === 'function')
            {
                customGridComplete();
            }


            // JQGrid附加样式
            attachJQGridStyle(jqGridID);

            //滚动事件
            //$(this).parents("body").on("scroll",function () {
            //    console.log("123")
            //});

        },
        resizeStart: function ()
        {
            window[jqGridID + "_Width"] = jqTable.offsetWidth;
        },
        resizeStop: function ()
        {
            var width = getJQGridWidth(jqGridID);
            var preWidth = window[jqGridID + "_Width"];
            if (preWidth && preWidth > width)
            {
                width = preWidth;
            }
            if (jqTable.offsetWidth > width)
            {
                jqGrid.setGridParam({ shrinkToFit: false });
            }
        },
        // jqGrid 判断是否全选  肖勇彬 2015-11-10
        onSelectRow: function (rowid, status)
        {
            that && that(rowid, status);
            $(".ui-jqgrid-htable :checkbox").attr("checked", this.rows && this.rows.length === $("tr[aria-selected=true]", $(this)).length);
        }
    });
}

// JQGrid附加样式(不换行，内容超出用省略号显示、最后一列边框)
function attachJQGridStyle(jqGridID)
{
    var jqHead = $(".ui-jqgrid-htable");
    for (var i = 0; i < jqHead.length; i++)
    {
        if (jqHead[i].rows.length > 0 && jqHead[i].rows[0].cells.length > 0)
        {
            jqHead[i].rows[0].cells[0].style.borderLeft = "none 0";
        }
    }
    var jqTable = getObj(jqGridID);
    if (jqTable != null && jqTable.tagName.toUpperCase() == "TABLE" && jqTable.rows.length > 0)
    {
        for (var i = 0; i < jqTable.rows.length; i++)
        {
            for (var j = 0; j < jqTable.rows[i].cells.length; j++)
            {
                var cell = jqTable.rows[i].cells[j];
                if (cell.style.display != "none" && $("div.nowrap", $(cell)).length == 0 && $("div.tree-wrap", $(cell)).length == 0)
                {
                    cell.innerHTML = "<div class='nowrap'>" + cell.innerHTML + "</div>";
                }
                if (i == 0)
                {
                    cell.style.borderTop = "none 0";
                }
                if (j == 0)
                {
                    cell.style.borderLeft = "none 0";
                }
            }
        }
    }
    var jqFoot = $(".ui-jqgrid-ftable");
    if (jqFoot.length && jqFoot[0].rows.length)
    {
        for (var i = 0; i < jqFoot[0].rows[0].cells.length; i++)
        {
            var cell = $(jqFoot[0].rows[0].cells[i])
            cell.text(cell.text());
        }
    }
}

// 补全表格宽度(在调整页面大小时，jqTable偶尔会不到边，有一个像素缝隙)
function fillJQGridWidth(jqTable, width)
{
    if (jqTable.offsetWidth + 1 == width)
    {
        $(jqTable).width(width);
    }
    if (width > $(".ui-jqgrid-htable").width() && width - $(".ui-jqgrid-htable").width() <= 2)
    {
        $(".ui-jqgrid-htable").width(width);
    }
}

    /*//////////////////////////////////////////(5)jqGrid获取的相关处理(end)/////////////////////////////*/











    /*//////////////////////////////////////////(6)窗口操作//////////////////////////////////////////////*/

    /* 返回打开窗口的位置和尺寸的对象 */
    /* dialog：0:普通窗口/1:模式窗口/2:删除等模式窗口 */
    function getOpenWinObj(dialog, width, height)
    {
        var winobj = {};
        if (dialog == 2)
        {
            width = 320;
            height = 202;
            if (ieVersion >= 7)
            {
                height = 154;
            }
            var left = (screen.width - width) / 2;
            var top = (screen.height - height) / 2;

            winobj.width = width;
            winobj.height = height;
            winobj.left = left;
            winobj.top = top;
        }
        else
        {
            if (width == -1)
            {
                width = screen.availWidth;
            }
            else if (width == 0)
            {
                width = 960;
            }
            if (height == -1)
            {
                height = screen.availHeight;
            }
            else if (height == 0)
            {
                height = 650;
            }
            if (dialog && ieVersion >= 7)
            {
                height -= 50;
            }

            var left = (screen.availWidth - width - 10) / 2;
            var top = (screen.availHeight - height - 50) / 2;

            if (top < 0)
            {
                height = screen.availHeight - 50;
                top = 0;
            }
            if (left < 0)
            {
                width = screen.availWidth - 10;
                left = 0;
            }

            if (window.opener || window.dialogArguments)
            {
                if (Math.abs(document.body.clientWidth - width) < 10)
                {
                    left += 20;
                }
                if (Math.abs(document.body.clientHeight - height) < 10)
                {
                    top += 20;
                }
            }
            winobj.width = width;
            winobj.height = height;
            winobj.left = left;
            winobj.top = top;
        }

        return winobj;
    }

    /* 打开一般窗口 */
    function openWindow(url, width, height)
    {
        var winobj = getOpenWinObj(0, width, height);

        // 解决模式窗口打开新窗口Session丢失问题
        var win = window;
        if (typeof (window.dialogArguments) == "object")
        {
            win = window.dialogArguments;
        }

        url = addRandParam(url);

        win.open(url, '_blank', 'resizable=1,status=1,scrollbars=0,top=' + winobj.top + ',left=' + winobj.left + ',width=' + winobj.width + ',height=' + winobj.height);
    }

    /* 打开模式窗口 
    param:额外附加的参数，在打开的模式窗口中，以dialogArguments.postData获取
    winParam:窗口属性：'status=1;resizable=1;scroll=0;scrollbars=0'，字符串
    */
    function openModalWindow(url, width, height, param, winParam)
    {
        var winobj = getOpenWinObj(1, width, height);

        url = addRandParam(url);

        // 解决模式窗口打开新窗口Session丢失问题
        var win = window;
        if (typeof (window.dialogArguments) == "object")
        {
            win = window.dialogArguments;
        }

        window.postData = null;
        if (param)
        {
            window.postData = param;
        }
        var _winParam = 'status=1;resizable=1;scroll=0;scrollbars=0';
        if(winParam)
        {
            _winParam = winParam;
        }
        return win.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
            + winobj.height + 'px;' + _winParam);
    }

    /* 打开新增窗口(非jqGrid页的新增不允许指定第四个参数) */
    function openAddWindow(url, width, height, jqGridID)
    {
        if (jqGridID != null)
        {
            url = addUrlParam(url, "JQID", jqGridID);
        }

        openWindow(url, width, height);
    }

    /* 打开修改窗口 */
    // (1) jqGrid页的修改，第四个参数为jqGrid的ID，不允许指定第五个参数
    // (2) 框架中的jqGrid页的修改，第四个参数为jqGrid的ID，第五个参数为框架的name
    // (3) 普通Table页的修改，不允许指定第四、五个参数(这种页面的记录前必须包含命名为chkIDV3的CheckBox)
    // (4) 树视图页的修改，参数url中包含ID，不允许指定第四、五个参数
    function openModifyWindow(url, width, height, jqGridID, frameName)
    {
        // (1) jqGrid页的修改、(2)框架中的jqGrid页的修改
        if (jqGridID != null)
        {
            var ids;
            var vIsAllowEdit;
            if (frameName != null)
            {
                ids = window.frames(frameName).getJQGridSelectedRowsID(jqGridID, true);
                vIsAllowEdit = window.frames(frameName).getJQGridSelectedRowsData(jqGridID, true, 'IsAllowEdit');
            }
            else
            {
                ids = getJQGridSelectedRowsID(jqGridID, true);
                vIsAllowEdit = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowEdit');
            }
            if (ids == "" || ids.length == 0)
            {
                return alertMsg("没有任何记录可供操作。");
            }
            if (ids.length > 1)
            {
                return alertMsg("您一次只能操作一条记录。");
            }
            if (stripHtml(vIsAllowEdit[0]) == "N")
            {
                return alertMsg("您不能修改该数据。");
            }

            url = addUrlParam(url, "JQID", jqGridID);
            url = addUrlParam(url, "ID", ids[0]);
        }

            // (3) 普通Table页的修改
        else
        {
            var chks = getObjs("chkIDV3");
            if (chks != null && chks.length >= 0)
            {
                var checkedIndex = -1;
                var checkedCnt = 0;
                for (var i = 0; i < chks.length; i++)
                {
                    if (chks[i].checked)
                    {
                        checkedIndex = i;
                        checkedCnt++;
                    }
                }
                if (checkedCnt > 1)
                {
                    return alertMsg("您一次只能操作一条记录。");
                }
                else if (checkedCnt == 0)
                {
                    return alertMsg("没有任何记录可供操作。");
                }
                // add by xiaoft 2012-09-04 状态为"已完成"的数据,不可修改
                if (chks[checkedIndex].allows != null)
                {
                    if (chks[checkedIndex].allows == 'N')
                    {
                        return alertMsg("您不能修改该数据。");
                    }
                }

                url = addUrlParam(url, "ID", chks[checkedIndex].value);
                if (chks[checkedIndex].IsLeaf != null)
                {
                    url = addUrlParam(url, "IsLeaf", chks[checkedIndex].IsLeaf);
                }
            }

            // (4) 树视图页的修改，请使用openWindow
        }

        openWindow(url, width, height);
    }

    /* 打开删除窗口 */
    // (1) 树视图页的删除，第三个参数为要删除的记录的ID，不允许指定第四个参数
    // (2) jqGrid页的删除，第三个参数为jqGrid的ID，不允许指定第四个参数
    // (3) 框架中的jqGrid页的删除，第三个参数为jqGrid的ID，第四个参数为框架的name
    // (4) 普通Table页的删除，不允许指定第三、四个参数(这种页面的记录前必须包含命名为chkIDV3的CheckBox)
    // (5) 其它的参数，键值对形式(可选，如需要删除原因、来自管理页时，为{Msg:'Y', From:'Manage'})
    // (6) 是否自已传入ID，如果自己传入，则系统不再判断jqGrid或页面中的chkIDV3
    function openDeleteWindow(action, aim, jqGridID, frameName, appendParams, customizeID)
    {
        var url = getDeletePageUrl(aim);
        if (url == "")
        {
            return alertMsg("参数错误。");
        }
        url += "?Action=" + action;
        if (appendParams && typeof appendParams === 'object')
        {
            for (var k in appendParams)
            {
                url += '&' + k + '=' + appendParams[k];
            }
        }

        if (!customizeID)
        {
            var ids = "";
            var vIsAllowDelete;
            if (jqGridID != null)
            {
                // (1) 树视图页的删除(可在if里加条件)
                if (action == "BasicContractClass" || action == "APModel" || action == "CorpStructure" || action == "ZBEType" || action == "COSBusinessSort" || action == "COSGoods"
                    || action == "COSBSAppraiseClass" || action == "GoodsIndex" || action == "CorpFileIndex" || action == "CorpFileSaveIndex"
                    || action == "ProductServiceClass" || action == "ZBWorkFlow" || action == "NewZBWorkFlow" || action == "BoardroomPosition" || action == "SecurityAccidentType" || action == "COSBusiness"
                    || action == "SecurityFileType" || action == "QualityDefectType" || action == "QualityFileType" || action == "BylawIndex"
                    || action == "VenditionPlace" || action == "ZBETypeClass" || action == "ZBPScoreItemSub" || action == "Area" || action == "MyDocType"
                    || action == "FlowSystemType" || action == "UserFormField" || action == "ProjectBaseDBIndex" || action == "SubsectionSubentry"
                    || action == "ContractRangeType" || action == "BaseDBIndex" || action == "BriefingSetting" || action == "ArchivesIndex" || action == "RedHeadOrganization"
                    || action == "ExamOrganization" || action == "KnowledgeInterfaceIndex" || action == "CorpImageIndex" || action == "DrawingIndex" || action == "MaterialServiceClass" || action == "APModelForApp" || action == "APModelForWechat"
                    || action == "BMMFillType" || action == "FillType" || action == "MsgModule")
                {

                    if (jqGridID == null)
                    {
                        return alertMsg("参数错误。");
                    }
                    url += "&ID=" + jqGridID;
                    //alert(url);
                }
                else if (action == "ProjectZBiddingPlanList")
                {
                    if (frameName == null)
                    {
                        return alertMsg("参数错误。");
                    }
                    url += "&ID=" + frameName + "&JQID=" + jqGridID;
                }

                    // (2) jqGrid页的删除、(3) 框架中的jqGrid页的删除
                else
                {
                    if (frameName != null)
                    {
                        ids = window.frames(frameName).getJQGridSelectedRowsID(jqGridID, true);
                        vIsAllowDelete = window.frames(frameName).getJQGridSelectedRowsData(jqGridID, true, 'IsAllowDelete');
                    }
                    else
                    {
                        ids = getJQGridSelectedRowsID(jqGridID, true);
                        vIsAllowDelete = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowDelete');
                    }
                    if (ids == "" || ids.length == 0)
                    {
                        return alertMsg("没有任何记录可供操作。");
                    }

                    if (stripHtml(vIsAllowDelete.join(",")).indexOf('N') != -1)
                    {
                        return alertMsg("部分数据不能删除。");
                    }

                    if (ids.length > 50)
                    {
                        return alertMsg("您一次最多只能删除50条记录。");
                    }

                    url += "&JQID=" + jqGridID + "&ID=" + ids.join(",");
                }
            }

                // (4) 普通Table页的删除
            else
            {
                var chks = getObjs("chkIDV3");
                if (chks != null && chks.length > 0)
                {
                    var checkedCnt = 0;
                    for (var i = 0; i < chks.length; i++)
                    {
                        if (chks[i].checked)
                        {
                            ids += "," + chks[i].value;
                            checkedCnt++;
                        }
                    }
                    if (checkedCnt == 0)
                    {
                        return alertMsg("没有任何记录可供操作。");
                    }
                    else if (checkedCnt > 50)
                    {
                        return alertMsg("您一次最多只能删除50条记录。");
                    }
                    if (ids != "")
                    {
                        url += "&ID=" + ids.substr(1);
                    }

                    if (action == "DocManage")
                    {
                        var remark = window.prompt("请输入删除原因", "");
                        if (!remark || remark == "")
                        {
                            alert("删除原因必须输入。");
                            return false;
                        }
                        url += "&Remark=" + encode(remark);
                    }
                }
                else
                {
                    return alertMsg("没有任何记录可供操作。");
                }
            }
        }
        //window.open(url);//调试用
        var winobj = getOpenWinObj(2);
        window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
            + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    }

    /* 打开环节调整窗口 */
    function openRevisionWindow(jqGridID)
    {
        var url = "/" + rootUrl + "/Common/Handler/VRevision.aspx";

        var ids = getJQGridSelectedRowsID(jqGridID, true);
        var vIsAllowRevision = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowRevision');

        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }
        if (ids.length > 1)
        {
            return alertMsg("您一次只能操作一条记录。");
        }
        if (stripHtml(vIsAllowRevision[0]) == "N")
        {
            return alertMsg("您不能操作该数据。");
        }

        url = addUrlParam(url, "JQID", jqGridID);
        url = addUrlParam(url, "ID", ids[0]);

        openWindow(url, 0, 0);
    }

    /* 打开还原窗口 */
    // 第三个参数，键值对形式(可选，为{Msg:'Y', From:'Manage'})
    function openResumeWindow(action, jqGridID, appendParams)
    {
        var url = "/" + rootUrl + "/Common/Handler/VResume.aspx?Action=" + action;
        if (appendParams && typeof appendParams === 'object')
        {
            for (var k in appendParams)
            {
                url += '&' + k + '=' + appendParams[k];
            }
        }
        var ids = getJQGridSelectedRowsID(jqGridID, true);
        var vIsAllowResume = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowResume'); //edited by 王勇 2011-5-21 18:25:40  
        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }
        if (ids.length > 50)
        {
            return alertMsg("您一次最多只能还原50条记录。");
        }

        if (stripHtml(vIsAllowResume.join(",")).indexOf('N') != -1)
        {
            return alertMsg("部分数据不能还原。");
        }

        url += "&JQID=" + jqGridID + "&ID=" + ids.join(",");

        var winobj = getOpenWinObj(2);
        window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
            + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    }

    /* 打开撤销窗口 */
    function openRevokeWindow(action, jqGridID)
    {
        var ids = getJQGridSelectedRowsID(jqGridID, true);
        var vIsAllowRevoke = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowRevoke');

        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }
        if (ids.length > 1)
        {
            return alertMsg("您一次只能操作一条记录。");
        }
        if (stripHtml(vIsAllowRevoke[0]) == "N")
        {
            return alertMsg("您不能操作该数据。");
        }

        var url = "/" + rootUrl + "/Common/Handler/VRevoke.aspx";
        url = addUrlParam(url, "JQID", jqGridID);
        url = addUrlParam(url, "ID", ids[0]);
        url = addUrlParam(url, "Action", action);

        var winobj = getOpenWinObj(2);
        window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
            + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    }

    /* 打开确认窗口 */
    function openConfirmWindow(action, title, jqGridID, appendParams)
    {
        var url = "/" + rootUrl + "/Common/Handler/VConfirm.aspx?Action=" + action + "&Title=" + encode(title);

        if (appendParams && typeof appendParams === 'object')
        {
            for (var k in appendParams)
            {
                url += '&' + k + '=' + appendParams[k];
            }
        }

        if (jqGridID != null)
        {
            var bMSelect = $('#' + jqGridID).getGridParam('multiselect');
            var ids = getJQGridSelectedRowsID(jqGridID, bMSelect);
            if (bMSelect)
            {
                if (ids == "" || ids.length == 0)
                {
                    return alertMsg("没有任何记录可供操作。");
                }
                if (ids.length > 50)
                {
                    return alertMsg("您一次最多只能操作50条记录。");
                }
                url += "&JQID=" + jqGridID + "&ID=" + ids.join(",");
            }
            else
            {
                if (ids == null)
                {
                    return alertMsg("没有任何记录可供操作。");
                }
                url += "&JQID=" + jqGridID + "&ID=" + ids;
            }
        }

        var winobj = getOpenWinObj(2);
        window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
            + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    }

    /* 获取各个模块的删除页面 */
    // 0：平台
    // 1：OA
    // 2：知识
    // 3：供应商和材料
    // 4：成本
    // 5：采购招标
    // 6：项目运营
    // 7：CRM模块
    // 11：IA模块
    // 12：绩效管理模块
    function getDeletePageUrl(aim)
    {
        var url = "/" + rootUrl + "/Common/Delete/";
        switch (aim)
        {
            case 0:
                url += "VDeletePlatform.aspx";
                break;
            case 1:
                url = "/" + rootUrl + "/IDOA/Common/Delete/VDeleteOA.aspx";
                break;
            case 2:
                url = "/" + rootUrl + "/Knowledge/Common/Delete/VDeleteKM.aspx";
                break;
            case 3:
                url = "/" + rootUrl + "/Supplier/Common/Delete/VDeleteSup.aspx";
                break;
            case 4:
                url = "/" + rootUrl + "/CCMP/Common/Handler/VDeleteCCM.aspx";
                break;
            case 5:
                url = "/" + rootUrl + "/ZBidding/Common/Delete/VDeletePBM.aspx";
                break;
            case 6:
                url = "/" + rootUrl + "/POM/Common/Handler/VDeletePOM.aspx";
                break;
            case 7:
                url = "/" + rootUrl + "/CRM/Common/Delete/VDeleteCRM.aspx";
                break;
            case 8:
                url = "/" + rootUrl + "/BM/Common/Delete/VDeleteBM.aspx";
                break;
            case 11:
                url = "/" + rootUrl + "/IA/Common/Delete/VDeleteIA.aspx";
                break;
            case 12:
                url = "/" + rootUrl + "/HR/Common/Delete/VDeleteHR.aspx";
                break;
            case 18:
                url += "VDeleteCTSIM.aspx";
                break;
            case 22:
                url = "/" + rootUrl + "/CostLibrary/Common/Handler/VDeleteCostLibrary.aspx";
                break;
            case 33:
                url = "/" + rootUrl + "/DemoEmployee/Employee_Del.aspx";
                break;
            default:
                url = "";
                break;
        }
        return url;
    }

    // 模板存知识库
    function saveModelToKnowledge(objModelID, objTitleID, objCorpID)
    {
        openAddWindow("/" + rootUrl + "/Knowledge/ArchivesFile/VSaveToArchivesFile.aspx?Type=Model&ControlID=" + objModelID + "&TitleControlID=" + objTitleID + "&CorpControlID=" + objCorpID, 400, 300);
    }

    /*//////////////////////////////////////////(6)窗口操作(end)/////////////////////////////////////////*/











    /*//////////////////////////////////////////(7)Table、Grid、TreeGrid操作/////////////////////////////*/

    // 单击全选复选框
    function selectAll(chk)
    {
        var chkArray = getObjs("chkIDV3");
        if (chkArray.length < 1)
        {
            return false;
        }
        for (var i = 0; i < chkArray.length; i++)
        {
            if (chkArray(i).checked != chk.checked)
            {
                chkArray(i).checked = chk.checked;
                selectRowFromSelectAll(chkArray(i));
            }
        }
    }


    // 单击表格的全选复选框，只全选本表格的所有行
    // IsSetRowClass：是否设置行样式
    function selectTableAll(table, chk, IsSetRowClass)
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            var opt = getObjTR(table, i, "input", 0);
            if (opt != null && opt.type.toLowerCase() == "checkbox" && opt.checked != chk.checked)
            {
                opt.checked = chk.checked;
                if (IsSetRowClass != false)
                {
                    selectRowFromSelectAll(opt);
                }
            }
        }
    }

    // 删除表格中复选框选中的行
    function deleteTableRow(table)
    {
        var value='';
        for (var i = table.rows.length - 1; i > 0; i--)
        {
            var chk = getObjTR(table, i, "input", 0);
            if (chk != null && chk.type.toLowerCase() == "checkbox" && chk.checked)
            {
                //如果被标记了CanDeleted，且值为true才允许删除
                if (chk.getAttribute('CanDeleted') && chk.getAttribute('CanDeleted').toLowerCase() != 'true')
                { continue; }

                table.deleteRow(i);
                if(chk.value)
                {
                    value=value+','+chk.value;
                }
            }
        }

        var chkAll = getObjTR(table, 0, "input", 0);
        if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
        {
            chkAll.checked = false;
        }
        return value;
    }

    // 删除表格中的除表头外的所有行
    function clearTable(table, headerRowCount)
    {
        var _headerRowCount = !headerRowCount || isNaN(headerRowCount) || headerRowCount < 1 ? 0 : parseInt(headerRowCount, 10) - 1;
        for (var i = table.rows.length - 1; i > _headerRowCount; i--)
        {
            table.deleteRow(i);
        }

        var chkAll = getObjTR(table, 0, "input", 0);
        if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
        {
            chkAll.checked = false;
        }
    }

    // 删除表格中的所有行
    function clearTableAll(table)
    {
        for (var i = table.rows.length - 1; i >= 0; i--)
        {
            table.deleteRow(i);
        }
    }

    // 单击表格行中的单元格
    function rowClick(row)
    {
        if (inValues(window.event.srcElement.tagName.toUpperCase(), "TD", "DIV", "SPAN"))
        {
            var obj = row.getElementsByTagName("input").item(0);
            if (obj != null)
            {
                if (obj.type.toLowerCase() == "radio")
                {
                    if (!obj.checked)
                    {
                        obj.checked = true;
                        selectRow(obj);
                    }
                }
                if (obj.type.toLowerCase() == "checkbox")
                {
                    obj.checked = !obj.checked;
                    selectRow(obj);
                }
            }
        }
    }

    // 单击选择框选择某行(单击某行的选择框或单元格时调用，如为复选，则检查是否全选)
    // isSerach 是否搜索选中
    function selectRow(obj, isSerach)
    {
        if (!obj) return;
        if (!obj.parentNode) return;
        var row = obj.parentNode.parentNode;
        if (!row) return;
        var table = row.parentNode.parentNode;
        if (obj.type.toLowerCase() == "checkbox")
        {
            row.className = obj.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');

            var chkAll = getObjTR(table, 0, "input", 0);
            if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
            {
                checkSelectAll(table);
            }
        }
        else if (obj.type.toLowerCase() == "radio")
        {
            if (!isSerach)
            {
                for (var i = 1; i < table.rows.length; i++)
                {
                    //            if(table.rows(i).className=='dg_rowselected')
                    //            {                
                    //                table.rows(i).className = (table.rows(i).rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
                    //                getObjC(table.rows(i),"input",0).checked=false;
                    //                break;
                    //            }
                    var inputRowI = getObjC(table.rows(i), "input", 0);
                    if (null != inputRowI && typeof inputRowI != 'undefined')
                    {
                        if (inputRowI.checked == false)
                        {
                            table.rows(i).className = (table.rows(i).rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
                            inputRowI.checked = false;
                        }
                    }
                }
            }
            row.className = obj.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
        }
        rowClass = row.className;
    }

    // 单击复选框选择某行(单击全选复选框时调用)
    function selectRowFromSelectAll(obj)
    {
        var row = obj.parentNode.parentNode;
        var table = row.parentNode.parentNode;
        if (obj.type.toLowerCase() == "checkbox")
        {
            row.className = obj.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
        }
        else if (obj.type.toLowerCase() == "radio")
        {
            for (var i = 0; i < table.rows.length; i++)
            {
                table.rows(i).className = (table.rows(i).rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
            }
            row.className = 'dg_rowselected';
        }
        rowClass = row.className;
    }

    // 选中某行时，检查是否全选(单击某行的复选框或单元格时调用)
    function checkSelectAll(table)
    {
        var flag = 0;
        for (var i = 1; i < table.rows.length; i++)
        {
            var chk = getObjTR(table, i, "input", 0);
            if (chk != null && chk.type.toLowerCase() == "checkbox" && !chk.checked)
            {
                flag = 1;
                break;
            }
        }
        getObjTR(table, 0, "input", 0).checked = !flag;
    }

    // 按照行的选中状态设置行样式
    function checkSelectRow(table)
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            var chk = getObjTR(table, i, "input", 0);
            if (chk != null && chk.type.toLowerCase() == "checkbox" && chk.checked)
            {
                table.rows[i].className = chk.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_altrow');
            }
        }
    }

    // 表格行鼠标悬停时，更换样式
    function rowMouseOver(row)
    {
        rowClass = row.className;
        row.className = 'dg_rowmouseover';
    }

    // 表格行鼠标离开时，还原样式
    function rowMouseOut(row)
    {
        try
        {
            row.className = rowClass;
        }
        catch (err) { }
    }

    // 动态增加行时，设置行的事件、样式
    function setRowAttributes(row)
    {
        if (row.className == "dg_footrow")
        {
            return;
        }
        row.className = row.rowIndex % 2 == 1 ? "dg_row" : "dg_altrow";

        row.onclick = function ()
        {
            rowClick(row);
        }
        row.onmouseover = function ()
        {
            rowMouseOver(row);
        }
        row.onmouseout = function ()
        {
            rowMouseOut(row);
        }

        // 因为上面动态添加的事件无法更新HTML，在submit前保存表格的innerHTML时事件将会丢失，
        // 为了在页面刷新并重加载表格后事件仍然有效，特将这些事件以属性(注意大小写必须不同)的形式再设置一次(因为属性的设置会更新HTML)
        row.setAttribute("onClick", "rowClick(this)");
        row.setAttribute("onMouseOver", "rowMouseOver(this)");
        row.setAttribute("onMouseOut", "rowMouseOut(this)");
    }

    // 重新设置表格所有行(表头除外)的事件、样式
    function setTableRowAttributes(table)
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            setRowAttributes(table.rows[i]);
        }
    }

    // 单击表格某列的全选复选框，全选某列
    // iCellIndex：要选择的列的索引（不指定时为全选复选框所在列的索引）
    // iStartRowIndex：要选择的列的起始行索引（不指定时为全选复选框所在行的下一行）
    function selectAllCols(iCellIndex, iStartRowIndex)
    {
        var chk = getEventObj("input");
        if (chk && chk.type.toLowerCase() == "checkbox")
        {
            var cell = chk.parentNode;
            var row = cell.parentNode;
            var table = row.parentNode.parentNode;
            if (iCellIndex == null)
            {
                iCellIndex = cell.cellIndex;
            }
            if (iStartRowIndex == null)
            {
                iStartRowIndex = row.rowIndex + 1;
            }
            for (var i = iStartRowIndex; i < table.rows.length; i++)
            {
                var obj = getObjTC(table, i, iCellIndex, "input", 0);
                if (obj && obj.type.toLowerCase() == "checkbox" && obj.checked != chk.checked)
                {
                    obj.checked = chk.checked;
                }
            }
        }
    }

    // 单击复选框选择某列
    // iAllRowIndex、iAllCellIndex：全选复选框所在行和列的索引
    // iCellIndex：要选择的列的索引（不指定时为全选复选框所在列的索引）
    // iStartRowIndex：要选择的列的起始行索引（不指定时为全选复选框所在行的下一行）
    function selectCol(iAllRowIndex, iAllCellIndex, iCellIndex, iStartRowIndex)
    {
        var chk = getEventObj("input");
        if (chk && chk.type.toLowerCase() == "checkbox")
        {
            var cell = chk.parentNode;
            var row = cell.parentNode;
            var table = row.parentNode.parentNode;
            if (iAllRowIndex == null)
            {
                iAllRowIndex = 0;
            }
            if (iAllCellIndex == null)
            {
                iAllCellIndex = cell.cellIndex;
            }
            if (iCellIndex == null)
            {
                iCellIndex = cell.cellIndex;
            }
            if (iStartRowIndex == null)
            {
                iStartRowIndex = iAllRowIndex + 1;
            }
            var chkAll = getObjTC(table, iAllRowIndex, iAllCellIndex, "input", 0);
            if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
            {
                checkSelectAllCols(table, iAllRowIndex, iAllCellIndex, iCellIndex, iStartRowIndex);
            }
        }
    }

    // 选中某列时，检查是否全选
    // iAllRowIndex、iAllCellIndex：全选列复选框所在行和列的索引
    // iCellIndex：要选择的列的索引（不指定时为全选复选框所在列的索引）
    // iStartRowIndex：要选择的列的起始行索引（不指定时为全选复选框所在行的下一行）
    function checkSelectAllCols(table, iAllRowIndex, iAllCellIndex, iCellIndex, iStartRowIndex)
    {
        if (iCellIndex == null)
        {
            iCellIndex = iAllCellIndex;
        }
        if (iStartRowIndex == null)
        {
            iSelectAllCellIndex = iAllRowIndex + 1;
        }
        var chkAll = getObjTC(table, iAllRowIndex, iAllCellIndex, "input", 0);
        if (chkAll && chkAll.type.toLowerCase() == "checkbox")
        {
            var flag = 0;
            for (var i = iStartRowIndex; i < table.rows.length; i++)
            {
                var chk = getObjTC(table, i, iCellIndex, "input", 0);
                if (chk && chk.type.toLowerCase() == "checkbox" && !chk.checked)
                {
                    flag = 1;
                    break;
                }
            }

            chkAll.checked = !flag;
        }
    }

    //动态增加表格行时，获取隐藏域的HTML
    //hidID:隐藏域ID ;value默认值
    function getHiddenHtml(hidID, value)
    {
        value = (value != null ? stringFormat(' value="{0}"', value) : '');
        return stringFormat('<input {0} type="hidden" {1} />', getIDString(hidID), value);
    }

    //动态增加表格行时，获取普通文本的HTML
    function getNormalTxtHtml(value)
    {
        return stringFormat('<span class="font">{0}</span>', value);
    }

    //动态增加表格行时，生成图片
    //src : 只需要传入相对于theme/img的图片路径，如button/add.gif
    function getImageHtml(theme, src, id, className, alt, onclick)
    {
        src = stringFormat("/{0}/App_Themes/{1}/img/{2}", rootUrl, theme, src);
        id = (null != id ? 'id="' + id + '"' : '');
        className = (null != className ? 'class="' + className + '"' : '');
        alt = (null != alt ? 'alt="' + alt + '"' : 'alt=""');
        callBack = (null != onclick ? 'onclick="' + onclick + '"' : '');
        return stringFormat('<img src="{0}" {1} {2} {3} {4} />', src, id, className, alt, callBack)
    }

    // 动态增加表格行时，获取复选框列的Html
    // chkID:复选框的ID； value:默认值/params:json格式，设置其他自定义复选框属性。所有参数均可不用指定
    function getCheckBoxHtml(chkID, value, params,onclick)
    {
        value = (value != null ? stringFormat(' value="{0}"', value) : '');
        var callBack = (null != onclick ? 'onclick="selectRow(this);' + onclick + '"' : 'onclick="selectRow(this)"');
        var param = '';
        if (params)
        {
            for (var k in params)
            {
                param += stringFormat(' {0}="{1}"', k, params[k]);
            }
        }
        return stringFormat('<input{0} class="idbox" type="checkbox"{1}{2} {3} />', getIDString(chkID), value, param,callBack);
    }

    // 动态增加表格行时，生成单选框
    //rdoID:单选框ID；text:提示信息;value:默认值(可选);name:单选组名(可选);callBack:点击单选引发的事件名(可选)
    function getRadioHtml(rdoID, text, value, name, checked, callBack)
    {
        text = (text != null ? stringFormat(' <label for="{0}">{1}</label>', rdoID, text) : '');
        value = (value != null ? stringFormat(' value="{0}"', value) : '');
        name = (name != null ? stringFormat(' name="{0}"', name) : '');
        //checked = (checked != null ? stringFormat(' checked="{0}"' , checked):'');
        if (checked)
        {
            checked = 'checked="checked"';
        }
        callBack = (callBack != null ? stringFormat(' onclick="{0}(this);"', callBack) : '');
        return stringFormat('<input{0} class="idbox" type="radio"{1} {2} {3} {4} />{5}', getIDString(rdoID), value, name, callBack, checked, text);
    }

    // 动态增加表格行时，获取选择日期列的Html
    // txtID:日期文本框的ID； value:默认值； minDate:最小日期限制； maxDate:最大日期限制；nextID:下一个时间选择器的ID
    // width:选择框的宽度
    // pickingCallback--表示开始选择日期的回调   (必须以字符串的形式传入函数的名称，回调参数为选择文本框对象）
    // pickedCallback --表示选择完成日期后的回调（必须以字符串的形式传入函数的名称，回调参数为选择文本框对象）
    //enabled:是否可操作
    function getSelectDateHtml(txtID, value, minDate, maxDate, nextID, width, pickingCallback, pickedCallback, format, enabled) {
        value = (value != null ? stringFormat(' value="{0}"', value) : '');

        var datePicking = (pickingCallback != null ? ("function(){ " + pickingCallback + "(this);}") : "null");
        var datePicked = ",function(){";
        if (nextID) {
            datePicked = datePicked + (stringFormat("  toNextIDDT('{0}',this); ", nextID));
        }
        if (pickedCallback) {
            datePicked = datePicked + pickedCallback + "(this);  ";
        }
        datePicked = datePicked + "}";

        minDate = (minDate != null ? stringFormat(",'{0}'", minDate) : ",null");
        maxDate = (maxDate != null ? stringFormat(",'{0}'", maxDate) : ",null");

        width = (width != null ? "style='width:" + width + ";'" : "style='width:98%;'");

        format = (format != null ? stringFormat(",'{0}'", format) : ",null");

        enabled = ((enabled != null && enabled == false) ? 'disabled="disabled"' : '');

        return stringFormat('<input{0} type="text" class="dt_date"{1} {4} readonly {8} onkeydown="skipEnter()" onfocus="selectDate({5}{6}{2}{3}{7})"/>', getIDString(txtID), value, minDate, maxDate, width, datePicking, datePicked, format, enabled);
    }

    // 动态增加表格行时，获取选择列的Html
    // theme:页面主题； txtID:文本框的ID； hidID:隐藏域的ID； btnID:选择按钮的ID； onclick:点击按钮执行的js方法； text:文本框默认值； value:隐藏域默认值。除第一个参数外，其他参数可以不指定
    function getSelectHtml(theme, txtID, hidID, btnID, onclick, text, value)
    {
        var html = '<table class="idtb" style="width:98%"><tr><td class="idtd" style="width:99%">{0}{1}</td><td class="idtd" style="width:1%">{2}</td></tr></table>';

        text = (text != null ? stringFormat(' value="{0}"', text) : '');
        var txt = stringFormat('<input{0} type="text" style="width:100%" class="text"{1} readonly="true" />', getIDString(txtID), text);

        value = (value != null ? stringFormat(' value="{0}"', value) : '');
        var hid = (hidID != null ? stringFormat('<input id="{0}" type="hidden"{1} />', hidID, value) : '');

        var btn = stringFormat('<button{1} onclick="{0}" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)" onfocus="this.blur()" '
            + 'class="btnsmall"><img class="btnimg" onerror="this.style.display=\'none\'" src="/{2}/App_Themes/{3}/img/button/lookup{4}" /></button>',
            onclick, getIDString(btnID), rootUrl, theme, getButtonIconExtension("theme"));

        return stringFormat(html, txt, hid, btn);
    }

    // 动态增加表格行时，获取下拉列表的Html
    // selectID:下拉列表的ID； 
    // options: 以{text:'',value:''}格式组成的json数组，或该json数组对应的字符串表示
    // value: 当前select的值
    // onchange:select的onchange事件;enabled:是否有用;所有参数均可以不用指定
    function getDropdownHtml(selectID, options, value, onchange, enabled, width)
    {
        if (!options)
        {
            return "&nbsp;";
        }
        if (typeof options === 'string')
        {
            try
            {
                options = $.stringToJSON(options);
            }
            catch (ex)
            {
                options = eval('(' + options + ')');
            }
        }
        onchange = (onchange != null ? stringFormat(' onchange="{0}"', onchange) : '');
        enabled = ((enabled != null && enabled == false) ? 'disabled="disabled"' : '');
        width = (width != null ? "style='width:" + width + ";'" : "style='width:100%;'");
        var html = stringFormat('<select{0} class="font" {1} {2} {3}>', getIDString(selectID), onchange, enabled, width);
        $.each(options, function (i, option)
        {
            html += stringFormat('<option value="{1}" {2} {3}>{0}</option>', option.text, option.value, ((value != null && option.value == value) ? 'selected="selected"' : ''), (null != option.style ? "style='" + option.style + "'" : ''));
        });
        html += '</select>';
        return html;
    }

    // 动态增加表格行时，获取文本框的Html
    // txtID:文本框的ID； length:文本框允许输入的字节数； onfocus:获取焦点事件； onblur:失去焦点事件； value:默认值； readonly:是否只读;
    // width:文本框的宽度。所有参数均可不用指定
    // talign:文本框中的内容对齐方式；className:文本框的样式；style：样式
    function getTextBoxHtml(txtID, length, onfocus, onblur, value, readonly, width, talign, className, title, style, onpropertychange)
    {
        var onkeyup = ((length != null && length > 0) ? stringFormat(' onkeyup="checkSize(this,{0})"', length) : '');
        onfocus = stringFormat(' onfocus="{0};setIDText(this,0)"', (onfocus != null ? onfocus : ''));
        onblur = stringFormat(' onblur="{0};setIDText(this,1)"', (onblur != null ? onblur : ''));
        value = (value != null ? stringFormat(' value="{0}"', value) : '');
        width = (width != null ? stringFormat("style='width:" + width + ";{0}'", talign != null ? "text-align:" + talign : "") : stringFormat("style='width:98%;{0}'", talign != null ? "text-align:" + talign : ""));
        // add by xiaoft 2012-09-14 鼠标停留在文本框的时候显示信息
        title = (title != null ? stringFormat(' title = "{0}"', title) : '');
        style = (style != null ? stringFormat(' style = "{0}"', style) : '');
        onpropertychange = (onpropertychange != null ? stringFormat(' onpropertychange = "{0}"', onpropertychange) : '');
        if (readonly)
        {
            onkeyup = ' readonly="true"';
            onfocus = '';
            onblur = '';
        }
        className = readonly ? 'graytext' : ((className == null ? "text" : className));

        return stringFormat('<input{0} type="text" {5} class="{6}"{1}{2}{3}{4}{7}{8}{9} />', getIDString(txtID), value, onkeyup, onfocus, onblur, width, className, title, style, onpropertychange);
    }

    // 动态增加表格行时，获取按钮的Html
    // txtID:文本框的ID； text:按钮上的文本； otherAttr: 赋给按钮对象的其他属性；
    // onclick：点击事件； onfocus:获取焦点事件； onmouseover:鼠标在其上时的事件；
    // onmouseout:鼠标离开时的事件； width:按钮的宽度。所有参数均可不用指定
    // talign:文本框中的内容对齐方式；className:文本框的样式
    function getButtonHtml(btnID, text,otherAttr, onclick, onfocus, onmouseover, onmouseout, width, talign, className)
    {
        var text = text != null ? text : '',
            otherAttr = otherAttr != null ? otherAttr : '',
            onclick = stringFormat(' onclick="{0};setIDText(this,1)"', (onclick != null ? onclick : '')),
            onfocus = stringFormat(' onfocus="{0};this.blur();"', (onfocus != null ? onfocus : '')),
            onmouseover = stringFormat(' onmouseover="{0};setIDBtn1(this,1);"', (onmouseover != null ? onmouseover : '')),
            onmouseout = stringFormat(' onmouseout="{0};setIDBtn1(this,0);"', (onmouseout != null ? onmouseout : '')),

            width = (width != null ? stringFormat(" style='width:" + width + ";{0}'", talign != null ? "text-align:" + talign : "") : stringFormat("style='{0}'", talign != null ? "text-align:" + talign : "")),

            title = (title != null ? stringFormat(' title = "{0}"', title) : ''),
            className = className == null ? "btnsmall" : className;

        return stringFormat('<button {0} {6} class="{1}" {2}{3}{4}{5}{7} {9}><span class="btntext">{8}</span></button>',
            getIDString(btnID), className, onclick, onfocus, onmouseover, onmouseout, width, title, text, otherAttr);
    }

    // 动态增加表格行时，获取多行文本框的Html
    // txtID:文本框的ID； length:文本框允许输入的字节数； height:文本框高度； value:默认值。所有参数均可不用指定
    //function getTextAreaHtml(txtID, length, height, value, readonly)
    function getTextAreaHtml(txtID, length, height, value, readonly, btnID, theme, hidTextID, hidID, hidIDValue, onclick)
    {
        var heightStyle = stringFormat('height:{0}px"', ((height != null && height > 0) ? height : '40'));
        var onkeyup = ((length != null && length > 0) ? stringFormat(' onkeyup="checkSize(this,{0})"', length) : '');
        if (readonly)
        {
            onkeyup = ' readonly="true"';
        }
        var btn = stringFormat('<button{1} onclick="{0}" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)" onfocus="this.blur()" '
            + 'class="btnsmall"><img class="btnimg" onerror="this.style.display=\'none\'" src="/{2}/App_Themes/{3}/img/button/lookup{4}" /></button>',
            onclick, getIDString(btnID), rootUrl, theme, getButtonIconExtension("theme"));
        var hid = (hidID != null ? stringFormat('<input id="{0}" type="hidden" value="{1}" /><input id="{2}" type="hidden" value="{3}" />', hidTextID, value, hidID, hidIDValue) : '');

        //return stringFormat('<textarea{0} class="text" style="width:98%;{1}"{2} onfocus="setIDText(this,0)" onblur="setIDText(this,1)">{3}</textarea>',
        //    getIDString(txtID), heightStyle, onkeyup, (value != null ? value : ''));
        return stringFormat('<textarea{0} class="billtext" style="width:{6}%;{1}"{2} onfocus="setIDText(this,0)" onblur="setIDText(this,1)">{3}</textarea>{4}{5}',
            getIDString(txtID), heightStyle, onkeyup, (value != null ? value : ''), (btnID != null ? hid : ''), (btnID != null ? btn : ''), (btnID != null ? 86 : 99));
    }
    // 动态增加表格行时，获取超链的Html
    // hrefName:href  value:默认值 onclick 事件 所有参数均可不用指定
    function getHrefHtml(hrefName, value, onclick)
    {
        var onclick = (onclick != null ? stringFormat(' onclick="{0}"', onclick) : '');
        return stringFormat('<a href="#{0}" {2}>{1}</a>', hrefName, value, onclick);
    }

    // 根据样式获取按钮图片扩展名 add by zhangmq 20160321
    function getButtonIconExtension(theme)
    {
        theme = theme || getTheme();
        var ext = ".gif";
        if (theme === "TenderBlue" || theme === "JadeBlue" || theme === "GreyBlack" || theme === "VerdureGreen" || theme === "CloudsWhite")
        {
            ext = ".png";
        }

        return ext;
    }

    // 根据ID获取HTML中的ID字符串
    function getIDString(id)
    {
        return (id != null ? stringFormat(' id="{0}"', id) : '');
    }

    // 获取选中的选择框
    function getSelectedBox(id)
    {
        var selectedBox = null;
        var chks = getObjs(id);
        if (chks.length > 0)
        {
            var checkedIndex = -1;
            var checkedCnt = 0;
            for (var i = 0; i < chks.length; i++)
            {
                if (chks[i].checked)
                {
                    checkedIndex = i;
                    checkedCnt++;
                }
            }
            if (checkedCnt > 1)
            {
                alertMsg("您一次只能操作一条记录。");
            }
            else if (checkedCnt == 0)
            {
                alertMsg("没有任何记录可供操作。");
            }
            if (checkedIndex >= 0 && checkedCnt == 1)
            {
                selectedBox = chks[checkedIndex];
            }
        }
        return selectedBox;
    }

    /* 展开或折叠TreeGrid */
    function expColTG(img, tableWrap)
    {
        tableWrap = tableWrap || "divMPList";
        var cellIndex = img.parentNode.cellIndex;
        var row = img.parentNode.parentNode;
        if (row.tagName.toUpperCase() == "TD")
        {
            cellIndex = row.cellIndex;
            row = row.parentNode;
        }
        var table = row.parentNode.parentNode;
        var outlen = row.id.split(".").length;
        var $tableWrap = $(img).parents("#" + tableWrap);
        if (tableWrap != "divMPList" && $tableWrap.length == 0)
        {
            var $tableWrap = $(img).parents("[id$=divData]");
        }
        var scrollTop = $tableWrap.scrollTop();
        redrawHandle(table, function ()
        {
            // 切换图片
            changeTGImg(img);

            var display = (img.src.substr(img.src.lastIndexOf("/")).indexOf("expand") != -1 ? "block" : "none");

            for (var i = row.rowIndex + 1; i < table.rows.length; i++)
            {
                var id = table.rows[i].id;
                var len = id.split(".").length;
                if (id.indexOf(row.id) != -1 && len > outlen)
                {
                    if (len == outlen + 1 || display == "none")
                    {
                        table.rows[i].style.display = display;
                    }
                    else
                    {
                        var pIndex = getTGParentRowIndex(table, i, cellIndex);

                        if (table.rows[pIndex].style.display == "none")
                        {
                            table.rows[i].style.display = "none";
                        }
                        else
                        {
                            table.rows[i].style.display = (tgItemIsExpand(getTGImg(table, pIndex, cellIndex)) ? "block" : "none");
                        }
                    }
                }
                else
                {
                    break;
                }
            }
        });
     
        $tableWrap.scrollTop(scrollTop);
        //$(img).parents("#divMPList").scroll();
    }

    /* 获取TreeGrid数据行的父级行的行索引 */
    function getTGParentRowIndex(table, rowIndex, cellIndex)
    {
        var id = table.rows[rowIndex].id
        var pID = id.substr(0, id.lastIndexOf("."));
        for (var i = rowIndex - 1; i > 0; i--)
        {
            if (table.rows[i].id == pID)
            {
                break;
            }
        }
        return i;
    }

    /* 获取TreeGrid数据行的层级图片(cellIndex为层次结构所在的列索引) */
    function getTGImg(table, rowIndex, cellIndex)
    {
        var img = null;
        var imgs = table.rows[rowIndex].cells[cellIndex].getElementsByTagName("img");
        if (imgs.length > 0)
        {
            img = imgs[imgs.length - 1];
            if (table.haveIco)
            {
                img = imgs[imgs.length - 2];
            }
        }
        return img;
    }

    /* 获取TreeGrid某行是否展开(子级是否显示) */
    function tgItemIsExpand(img)
    {
        var result = false;
        if (img != null)
        {
            var file = img.src.substr(img.src.lastIndexOf("/"));
            result = (file.indexOf("expand") != -1);
        }
        return result;
    }

    /* TreeGrid行数据是否最底级 */
    function tgItemIsLeaf(img)
    {
        var file = img.src.substr(img.src.lastIndexOf("/"));
        return (file.indexOf("expand") == -1 && file.indexOf("collapse") == -1)
    }

    /* TreeGrid切换图片 */
    function changeTGImg(img)
    {
        var path = img.src.substr(0, img.src.lastIndexOf("/") + 1);
        var file = img.src.substr(img.src.lastIndexOf("/") + 1);
        var newfile = (file.indexOf("expand") != -1 ? file.replace("expand", "collapse") : file.replace("collapse", "expand"));
        img.src = path + newfile;
    }

    /* 显示TreeGrid到指定级别(table:表名，level:显示的级别，cellIndex:层次结构所在的列索引) */
    function showLayerTG(table, level, cellIndex, startRowIndex) 
    {
        if (startRowIndex == null)
        {
            startRowIndex = 1;
        }
        redrawHandle(table, function ()
        {
            var firstLevel;
            for (var i = startRowIndex; i < table.rows.length; i++)
            {
                var row = table.rows[i];
                var img = getTGImg(table, i, cellIndex);
                if (row.id != "" && img != null)
                {
                    var itemLevel = row.id.split(".").length;

                    if (!firstLevel)
                    {
                        firstLevel = itemLevel;
                    }

                    itemLevel -= firstLevel - 1;

                    var display = (itemLevel <= level ? "" : "none");
                    var bIsExpand = (itemLevel < level);
                    if (row.style.display != display)
                    {
                        row.style.display = display;
                    }
                    if (!tgItemIsLeaf(img) && tgItemIsExpand(img) != bIsExpand)
                    {
                        changeTGImg(img);
                    }
                }
            }
        });
    }

    // 点击树节点文本时可调用该方法点击节点图片
    function clickTGImg()
    {
        var td = getEventObj("td");
        var tr = getParentObj(td, "tr");
        var table = getParentObj(tr, "table");
        var img = getTGImg(table, tr.rowIndex, td.cellIndex);
        if (img)
        {
            img.click();
        }
    }

    /* 点击树节点样式(参数node一般为命名的span) */
    function clickTreeNode(node, suffix)
    {
        var key = "TreeNode_Selected" + (suffix ? ("_" + suffix) : "");

        deselectTreeNode(suffix)
        node.className = "selNode";
        window[key] = node.id;
    }

    /* 反选树节点(取消所有选中效果) */
    function deselectTreeNode(suffix)
    {
        var key = "TreeNode_Selected" + (suffix ? ("_" + suffix) : "");

        if (window[key])
        {
            var pre_node = getObj(window[key]);
            if (pre_node)
            {
                pre_node.className = "normalNode";
            }
        }
    }

    /* 获取树图，参数i：1:枝(折叠)/2:枝(折叠、最后)/3:枝(展开)/4:枝(展开、最后)/5:叶/6:叶(最后)/7:竖线/8:空格 */
    function getTreeImg(theme, i)
    {
        var treeImgs =
            [
                '',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/collapse.gif" class="img_tree" onclick="expColTG(this)"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/collapse_last.gif" class="img_tree" onclick="expColTG(this)"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/expand.gif" class="img_tree" onclick="expColTG(this)"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/expand_last.gif" class="img_tree" onclick="expColTG(this)"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/item.gif" class="img_tree"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/item_last.gif" class="img_tree"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/vline.gif" class="img_tree"/>',
                '<img src="/' + rootUrl + '/App_Themes/' + theme + '/img/tree/blank.gif" class="img_tree"/>'
            ]

        return treeImgs[i];
    }

    /*//////////////////////////////////////////(7)Table、Grid、TreeGrid操作(end)////////////////////////*/











    /*//////////////////////////////////////////(8)其他方法//////////////////////////////////////////////*/

    //完成选择，返回值或为父窗口赋值
    function finishSelect(aim, mode)
    {
        var flag = 0;

        var idList = "";
        var nameList = "";
        var elementName = "";

        var corpName = "";
        var deptID = "";
        var deptName = "";
        var positionName = "";
        var accountID = "";
        var accountName = "";
        var employeeName = "";
        var stationName = "";

        var hidIDList = "hid" + aim + "ID";
        var txtNameList = "txt" + aim;
        if (aim == "ContractSignMan")  //这个作废
        {
            hidIDList = "ucContract_hidContractSignManID";
            txtNameList = "ucContract_txtContractSignMan";
        }

        if (mode == "Single")
        {
            elementName = "radioSelect";
        }
        if (mode == "Multi")
        {
            elementName = "optionSelect";
        }

        var obj = getObjs(elementName);
        for (i = 0; i < obj.length; i++)
        {
            if (obj(i).checked)
            {
                if (mode == "Single")
                {
                    idList = obj(i).value;
                    if (aim == "FlowCheckStation")
                    {
                        idList = obj(i).value + "|S";
                    }
                    if (aim == "FlowCheckPosition")
                    {
                        idList = obj(i).value + "|P";
                    }
                    if (aim == "Leave" || aim == "OutWork" || aim == "Wage")
                    {
                        idList = obj(i).empID;
                    }
                    if (aim == "Station")
                    {
                        employeeName = obj(i).employeename;
                        stationName = obj(i).stationname;
                    }
                    if (aim == "ZBiddingPersonStation" || aim == "PlanProfessionalStation" || aim == "ZBiddingFilePersonStation"
                         || aim == "WBSAppraiseStation" || aim == "HandleStationList" || aim == "CollaborationStationList"
                         || aim == "TemplateWBSPrincipalStation" || aim == "PrincipalStation" || aim == "TreatStation")
                    {
                        deptID = obj(i).deptID;
                        deptName = obj(i).deptName;
                        positionName = obj(i).positionName;
                    }
                    if (aim == "WBSCheckListStation" || aim == "WBSAppraiseStation" || aim == "DefectExecuteStation")
                    {
                        accountID = obj(i).accountID;
                    }
                    if (aim == "MarkStation")
                    {
                        accountName = obj(i).accountName;
                    }
                    // 岗位新增或修改选择部门
                    if (aim == "Dept" || aim == "Index" || aim == "MyOvertimeDept")
                    {
                        nameList = obj(i).text;
                    }
                }
                if (mode == "Multi")
                {
                    idList += "," + obj(i).value;
                    corpName += "," + obj(i).corpName;
                }
                var name = document.getElementsByTagName("a");

                for (j = 0; j < name.length; j++)
                {
                    if (aim == "CreateAccountList" && obj(i).stationid != null)
                    {
                        if (name(j).href.toString().indexOf(obj(i).stationid) != -1)
                        {
                            if (mode == "Single")
                            {
                                nameList = name(j).innerText.replace(/\ /g, '');
                            }
                            if (mode == "Multi")
                            {
                                nameList += "，" + name(j).innerText;
                            }
                            break;
                        }
                    }
                    else
                    {
                        if (name(j).href.toString().indexOf(obj(i).value) != -1)
                        {
                            if (mode == "Single")
                            {
                                nameList = name(j).innerText.replace(/\ /g, '');
                            }
                            if (mode == "Multi")
                            {
                                nameList += "，" + name(j).innerText;
                            }
                            break;
                        }
                    }
                }
                flag = 1;
            }
        }
        //    alert(nameList);
        if (flag == 0)
        {
            alert("你没有选择任何数据。");
            return false;
        }

        if (mode == "Multi")
        {
            idList = idList.substr(1);
            corpName = corpName.substr(1);
            nameList = nameList.substr(1).replace(/\ /g, '');
        }

        // 选择审核岗位、送阅岗位、送阅部门等，单选以返回值返回，多选返回到页面列表框
        if (aim == "CheckStation" || aim == "SaveDocLookStation" || aim == "SaveDocLookDept" || aim == "SuperviseStation" || aim == "CreateAccountList"
            || aim == "SuperviseDept" || aim == "HandleStation" || aim == "CollaborationStation" || aim == "ReportAllowStation" || aim == "ReportAllowDept"
            || aim == "AllowStation" || aim == "AllowDept" || aim == "AppraiseStation" || aim == "AppraiseDept" || aim == "AttendStation" || aim == "AttendDept"
            || aim == "EmployeeGroom")
        {
            if (mode == "Single")
            {
                if (aim == "CheckStation")
                {
                    var passType = "All";       // 为串环时，通过方式为All
                    var flowOption = "Check";   // 操作类型为审核
                    var allowJump = document.all.ddlAllowJump.options[document.all.ddlAllowJump.selectedIndex].value;
                    var flName = window.parent.document.all.txtFLName.value;
                    var checkDays = document.all.txtCheckDays.value;
                    var alertDays = document.all.txtAlertDays.value;
                    var allowAddTache = window.parent.document.all.ddlIsAllowAddTache.options[window.parent.document.all.ddlIsAllowAddTache.selectedIndex].value;
                    if (window.parent.document.all.rblType_0 != null && window.parent.document.all.rblType_0.checked)
                    {
                        flowOption = "Check";
                    }
                    else if (window.parent.document.all.rblType_1 != null && window.parent.document.all.rblType_1.checked)
                    {
                        flowOption = "Communicate";
                    }
                    else if (window.parent.document.all.rblType_2 != null && window.parent.document.all.rblType_2.checked)
                    {
                        flowOption = "Deal";
                    }
                    if (idList != "")
                    {
                        window.returnValue = idList + "#" + passType + "&" + flowOption + "&" + allowJump + "&" + checkDays + "&" + alertDays + "&" + flName + "&" + allowAddTache;
                    }
                }
                else
                {
                    window.returnValue = idList;
                }
            }

            if (mode == "Multi")
            {
                var ids = idList.split(",");
                var names = nameList.split("，");
                var corps = corpName.split(",");
                if (aim == "CheckStation")
                {
                    lst = window.dialogArguments.document.all.lstStations;
                    if (lst == null)
                    {
                        lst = window.dialogArguments.lstStations;
                    }
                }
                if (aim == "CreateAccountList")
                {
                    lst = window.dialogArguments.document.all.lstLooks;
                }
                if (aim == "SaveDocLookStation" || aim == "SaveDocLookDept" || aim == "SuperviseStation" || aim == "SuperviseDept"
                    || aim == "HandleStation" || aim == "CollaborationStation" || aim == "ReportAllowStation" || aim == "ReportAllowDept"
                    || aim == "EmployeeGroom" || aim == "AllowStation" || aim == "AllowDept" || aim == "AppraiseStation" || aim == "AppraiseDept" || aim == "AttendStation" || aim == "AttendDept")
                {
                    lst = window.dialogArguments.document.all.lstLooks;
                }
                for (i = 0; i < ids.length; i++)
                {
                    var repeat = false;
                    for (j = 0; j < lst.length; j++)
                    {
                        if (lst.options[j].value == ids[i])
                        {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat && ids[i] != "")
                    {
                        var opt = window.dialogArguments.document.createElement("OPTION");
                        if (aim == "AllowDept" || aim == "SaveDocLookDept")
                        {
                            opt.text = names[i] + corps[i];
                        }
                        else
                        {
                            opt.text = names[i];
                        }
                        opt.value = ids[i];
                        lst.add(opt, lst.length);
                    }
                }
            }
        }

            // 选择流程审核岗位或流程审核职务，单选以返回值返回，多选返回到页面列表框
        else if (aim == "FlowCheckStation" || aim == "FlowCheckPosition")
        {
            if (mode == "Single")
            {
                var fixration = document.all.ddlFixation.options[document.all.ddlFixation.selectedIndex].value;
                var passType = "All";       // 为串环时，通过方式为All
                var flowOption = "Check";   // 操作类型为审核
                var allowJump = document.all.ddlAllowJump.options[document.all.ddlAllowJump.selectedIndex].value;
                var flName = window.parent.document.all.txtFLName.value;
                var checkDays = window.parent.document.all.txtCheckDays.value;
                var alertDays = window.parent.document.all.txtAlertDays.value;
                var allowAddTache = window.parent.document.all.ddlIsAllowAddTache.options[window.parent.document.all.ddlIsAllowAddTache.selectedIndex].value;
                if (window.parent.document.all.rblType_0 != null && window.parent.document.all.rblType_0.checked)
                {
                    flowOption = "Check";
                }
                else if (window.parent.document.all.rblType_1 != null && window.parent.document.all.rblType_1.checked)
                {
                    flowOption = "Communicate";
                }
                else if (window.parent.document.all.rblType_2 != null && window.parent.document.all.rblType_2.checked)
                {
                    flowOption = "Deal";
                }
                if (idList != "")
                {
                    window.returnValue = idList + "#" + fixration + "&" + passType + "&" + flowOption + "&" + allowJump + "&" + checkDays + "&" + alertDays + "&" + flName + "&" + allowAddTache;
                }
            }
            if (mode == "Multi")
            {
                var ids = idList.split(",");
                var names = nameList.split("，");
                lst = window.parent.frames("Middle").document.all.lstIDs;
                for (i = 0; i < ids.length; i++)
                {
                    var repeat = false;
                    for (j = 0; j < lst.length; j++)
                    {
                        if (lst.options[j].value == ids[i])
                        {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat && ids[i] != "")
                    {
                        var opt = window.parent.frames("Middle").document.createElement("OPTION");
                        if (aim == "FlowCheckStation")
                        {
                            opt.text = names[i];
                        }
                        if (aim == "FlowCheckPosition")
                        {
                            opt.text = "[" + names[i] + "]";
                        }
                        opt.value = ids[i];
                        lst.add(opt, lst.length);
                    }
                }
                return false;
            }
        }
        else if (aim == "NCSettlementAllot")  // 这个会用Allot 代替
        {
            window.dialogArguments.hidSubjectAllotStationID.value = idList;
            window.dialogArguments.txtAllotCostMan.value = nameList;
            window.dialogArguments.hidSubjectAllotMan.value = nameList;
        }
        else if (aim == "ZBAndySubjectAllot" || aim == "Allot")  //设置科目拆分人，成本拆分 均使用这个
        {
            window.dialogArguments.hidSubjectAllotStationID.value = idList;
            window.dialogArguments.txtSubjectAllotStation.value = nameList;
        }
        else if (aim == "PayRequest")  //设置付款申请 均使用这个
        {

        }
        else if (aim == "Estimate")  //设置进度款审核均使用这个
        {

        }
        else if (aim == "Accessary")  //设置附件调整人 均使用这个
        {

        }
        else if (aim == "Check")  //设置合同校对  均使用这个
        {

        }
        else if (aim == "MasterCreateAccount")// 起草人
        {
            window.dialogArguments.hidCreateAccountID.value = idList;
            window.dialogArguments.txtCreateAccount.value = nameList;
        }
        else if (aim == "MasterDealAccount") //处理人
        {
            window.dialogArguments.hidDealAccountID.value = idList;
            window.dialogArguments.txtDealAccount.value = nameList;
        }
        else if (aim == "Station") //作废 新式页面 返回  hidStationID   hidStationMan   hidEmployeeName  hidStationName 中中转
        {
            hidStationID = window.dialogArguments.hidStationID;
            if (hidStationID == null)
            {
                hidStationID = window.dialogArguments.document.all.hidStationID;
            }
            hidStationMan = window.dialogArguments.hidStationMan;
            if (hidStationMan == null)
            {
                hidStationMan = window.dialogArguments.document.all.hidStationMan;
            }
            hidEmployeeName1 = window.dialogArguments.hidEmployeeName1;

            if (hidEmployeeName1 == null)
            {
                hidEmployeeName1 = window.dialogArguments.document.all.hidEmployeeName1;
            }

            hidStationName = window.dialogArguments.hidStationName;
            if (hidStationName == null)
            {
                hidStationName = window.dialogArguments.document.all.hidStationName;
            }
            if (hidStationID != null)
            {
                hidStationID.value = idList;
            }
            if (hidStationMan != null)
            {
                hidStationMan.value = nameList;
            }
            if (hidEmployeeName1 != null)
            {
                hidEmployeeName1.value = employeeName;
            }
            if (hidStationName != null)
            {
                hidStationName.value = stationName;
            }

        }
        else if (aim == "Index" || aim == "MyOvertimeDept") //从考核指标进入
        {
            window.returnValue = idList + "|" + nameList;
        }
            // 其它选择，返回到页面隐藏域或文本框
        else
        {
            window.dialogArguments.document.all(hidIDList).value = idList;
            window.dialogArguments.document.all(txtNameList).value = nameList;

            if (aim == "ZBiddingPersonStation" || aim == "PlanProfessionalStation" || aim == "ZBiddingFilePersonStation"
                || aim == "WBSAppraiseStation" || aim == "HandleStationList" || aim == "CollaborationStationList"
                || aim == "TemplateWBSPrincipalStation" || aim == "PrincipalStation" || aim == "TreatStation")
            {
                if (window.dialogArguments.document.all.hidDeptID != null)
                {
                    window.dialogArguments.document.all.hidDeptID.value = deptID;
                }
                if (window.dialogArguments.document.all.txtDeptName != null)
                {
                    window.dialogArguments.document.all.txtDeptName.value = deptName;
                }
                if (window.dialogArguments.document.all.txtPositionName != null)
                {
                    window.dialogArguments.document.all.txtPositionName.value = positionName;
                }
            }
            if (aim == "WBSCheckListStation")
            {
                window.dialogArguments.document.all.hidCheckAccountID.value = accountID;
            }
            if (aim == "WBSAppraiseStation")
            {
                window.dialogArguments.document.all.hidWBSAAccountID.value = accountID;
            }
            if (aim == "DefectExecuteStation")
            {
                window.dialogArguments.document.all.hidAccountID.value = accountID;
            }
            if (aim == "MarkStation")
            {
                window.dialogArguments.document.all.hidAccountName.value = accountName;
            }
        }


        window.opener = null;
        window.close();
    }

    //完成选择，返回值或为父窗口赋值
    function SingleDeptSelect(aim, mode)
    {
        var rltValues = "";
        var obj = getObjs("radioSelect");
        for (i = 0; i < obj.length; i++)
        {
            if (obj(i).checked)
            {
                var id = obj(i).value;
                var name = obj(i).text;
                var no = $(obj).parent().find("[id=hidDeptNo]").val();
                rltValues = id + "|" + name + "|" + no;
                window.returnValue = rltValues;
                window.close();
            }
        }
    }
    function selectCustomDescription()
    {
        var width = 600;
        var height = 500;
        var top = (window.screen.availheight - height) / 2;
        var left = (window.screen.availWidth - width) / 2;
        if (height >= screen.availHeight)
        {
            top = 0;
        }
        if (width >= screen.availWidth)
        {
            left = 0;
        }
        var url = "/" + rootUrl + "/Common/Select/Confirm/VSelectCheckDescription.aspx";

        openWindow(url, width, height);
    }

    // 设置流程环节是否显示
    function setCheckFlow(btn, trCheckFlow)
    {
        if (trCheckFlow != null)
        {
            var display = getObj("hidIsShowFlowCheck").value;
            var img = getObjC(btn, "img", 0);
            var span = getObjC(btn, "span", 0);
            display = (display == "none" ? "block" : "none");
            img.src = (img.src.substr(0, img.src.lastIndexOf("/") + 1) + (display == "none" ? "navdown.gif" : "navup.gif"));
            span.innerText = (display == "none" ? "显示流程" : "隐藏流程");
            trCheckFlow.style.display = display;
            getObj("hidIsShowFlowCheck").value = display;
            // 如果是展开的话，有滚动条的话，默认到最后
            if (divCheckFlow != null)
            {
                divCheckFlow.scrollTop = divCheckFlow.scrollHeight;
            }
        }
    }

    // 加载显示流程环节是否显示
    function showCheckFlow(btn, trCheckFlow)
    {
        if (trCheckFlow != null)
        {
            var display = getObj("hidIsShowFlowCheck").value;
            var img = getObjC(btn, "img", 0);
            var span = getObjC(btn, "span", 0);
            //        display = (display == "none" ? "block" : "none");
            img.src = (img.src.substr(0, img.src.lastIndexOf("/") + 1) + (display == "none" ? "navdown.gif" : "navup.gif"));
            span.innerText = (display == "none" ? "显示流程" : "隐藏流程");
            trCheckFlow.style.display = display;

            // 如果是展开的话，有滚动条的话，默认到最后
            //        if (divCheckFlow != null)
            //        {
            //            divCheckFlow.scrollTop = divCheckFlow.scrollHeight;
            //        }
        }
    }

    // 选择归档位置 vIsAuto:是否自动生成归档编号 add by zhangmq 2012/8/1
    function selectSavePath(vAim, vCorpID, vIsAuto)
    {
        var url = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectSavePath_Tree.aspx?Type=1&Aim=" + vAim + "&CorpID=" + vCorpID + "&IsAuto=" + vIsAuto;
        //更改宽度为600，原来为550 edit by 陈毓孟 2011-09-07 
        openModalWindow(url, 600, 400);
    }

    // 自定义表单验证
    function formValidate()
    {
        var bValue = true;
        var isEnable = true;

        if (typeof (fm_validate) == "function")
        {
            bValue = fm_validate();
        }

        if (bValue && typeof (flowIsEnable) == "function")
        {
            isEnable = flowIsEnable();
        }

        return bValue && isEnable;
    }
    // 流程验证（起草）
    function flowValidate()
    {
        if (typeof (fl_validate) == "function")
        {
            return fl_validate();
        }
        else
        {
            return alertMsg("未加载流程。");
        }
    }
    //补字符。len：想要的字符串长度(功能等同于C#中的padLeft方法)。 WeiSG  2010-12-20
    function padLeft(str, len)
    {
        if (!len || isNaN(len))
        {
            return str;
        }

        str = str.toString();
        if (str.length >= len)
        {
            return str;
        }
        else
        {
            return padLeft("0" + str, len);
        }
    }

    function padRight(str, len)
    {
        if (!len || isNaN(len))
        {
            return str;
        }

        str = str.toString();
        if (str.length >= len)
        {
            return str;
        }
        else
        {
            return padRight(str + "0", len);
        }
    }


    //联合数组去重复
    function unoinArray(arrOne, arrOther)
    {
        for (var i = 0; i < arrOne.length; i++)
        {
            for (var j = 0; j < arrOther.length; j++)
            {
                if (arrOne[i] === arrOther[j])
                {
                    arrOne.splice(i, 1);
                }
            }
        }

        for (var i = 0; i < arrOther.length; i++)
        {
            arrOne.push(arrOther[i]);
        }
        return arrOne;
    }

    /*//////////////////////////////////////////(8)其他方法(end)/////////////////////////////////////////*/

    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    function accDiv(arg1, arg2)
    {
        arg1 = isNaN(parseFloat(formatNumText(arg1))) ? 0 : parseFloat(formatNumText(arg1));
        arg2 = isNaN(parseFloat(formatNumText(arg2))) ? 1 : parseFloat(formatNumText(arg2));
     
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math)
        {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
    //乘法函数，用来得到精确的乘法结果
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    //调用：accMul(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    function accMul(arg1, arg2)
    {
        arg1 = isNaN(parseFloat(formatNumText(arg1))) ? 0 : parseFloat(formatNumText(arg1));
        arg2 = isNaN(parseFloat(formatNumText(arg2))) ? 0 : parseFloat(formatNumText(arg2));

        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    //加法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    function accAdd(arg1, arg2)
    {
        arg1 = isNaN(parseFloat(formatNumText(arg1))) ? 0 : parseFloat(formatNumText(arg1));
        arg2 = isNaN(parseFloat(formatNumText(arg2))) ? 0 : parseFloat(formatNumText(arg2));

        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }
    //减法函数
    function accSub(arg1, arg2)
    {
        arg1 = isNaN(parseFloat(formatNumText(arg1))) ? 0 : parseFloat(formatNumText(arg1));
        arg2 = isNaN(parseFloat(formatNumText(arg2))) ? 0 : parseFloat(formatNumText(arg2));

        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        //last modify by deeka
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }


    //保留小数位数，不足补0   (add by xiaodm)
    function RoundNum(number, w)
    {
        var num = number;
        var w10 = 1;
        for (var i = 1; i <= w; i++)
        {
            w10 *= 10;
        }

        num = Math.round(num * w10) / w10;

        var wdot = num.toString().indexOf(".");
        var NUM = num.toString();

        if (wdot == -1)
        {
            NUM = NUM + ".";
            wdot = NUM.length - 1;
        }
        if (wdot + w + 1 > NUM.length)
        {
            //不足补0
            var addNum = wdot + w + 1 - NUM.length;
            for (i = 0; i < addNum; i++)
            {
                NUM = NUM + "0";
            }
        }
        return NUM;
    }

    //待审核页面，根据批复结果决定审核/处理意见是否必填
    function setCheckState()
    {
        getObj('tdRequiredlblCheckTitle').style.display = $('#rblCheckState :radio:checked').val().toLowerCase().lastIndexOf('t') > 0 ? 'block' : 'none';
    }

    // 当对象为null时，按照不同类型返回相应类型的对象
    function isNull(obj, type)
    {
        var oReturnWhenNull;
        switch (type)
        {
            case "string":
                oReturnWhenNull = "";
                break;
            case "object":
                oReturnWhenNull = {};
                break;
            case "array":
                oReturnWhenNull = [];
                break;
            default:
                oReturnWhenNull = "";
                break;
        }
        return !obj ? oReturnWhenNull : obj;
    }

    function isArray(obj)
    {
        return Object.prototype.toString.call(obj).toLowerCase().indexOf('array') > -1;
    }

    //刷新全部工作页面的左侧列表树,jqGridID为当前页面JQID
    function refreshWaitWorkTree(jqGridID, theme)
    {
        var cnt = window["WaitCount"];
        var cntNew = $("#" + jqGridID).getGridParam("records");
        try
        {
            if (cnt != null && cnt >= 0 && cnt != cntNew)
            {
                var treeNode = window.parent.frames("Left").$(".selNode[id]").attr("id");
                window.parent.frames("Left").reloadTree(theme || "Default", true, treeNode ? treeNode.split("_")[1] : false);
            }
        }
        catch (err) { };
        window["WaitCount"] = cntNew;
    }

    //比较两个日期是否在同一个季度 2014年3月12日
    function dateIsInAQuarter(date1, date2)
    {
        var date1 = getDateObject(date1);
        var date2 = getDateObject(date2);

        return (date1.getFullYear() == date2.getFullYear()) && (Math.round((date1.getMonth() + 2) / 3) == Math.round((date2.getMonth() + 2) / 3))
    }


    function stopDefaultEvent()
    {
        var obj = window.event;
        if (obj.keyCode == 8)
        {
            window.event.returnValue = false;
            return false;
        }
        return true;
    }

    function tabEvent() {
        //全局tab事件
        if (typeof $ != "undefined") {
            $(function () {
                var topDoc = window.top.window.document;
                var $closeButton = $(topDoc).find("#frame-main").find(".collapse-menu");
                var $openButton = $(topDoc).find("#frame-main").find(".duck-silder");
                var $target = $(topDoc).find("#frame-main").find(".duck-menu-silder");
                $(document).bind("keyup", function (e) {
                    $(topDoc).focus();
                    if (e.keyCode == 9) {
                        if (parseInt($target.css("left")) < 0) {
                            $openButton.click();
                        } else {
                            $closeButton.click();
                        }
                        return false;
                    }
                });
            });
        } else {
            setTimeout(tabEvent, 500);
        }
    }
    tabEvent();

    //客户端给IDCombox控件赋值 duxue  20180107  
    function setComboxText(ddlCorpOrProject, val) {
        $("#" + ddlCorpOrProject + "_listtb tr[value=" + val + "]").find('td:eq(0)')[0].click();
    }