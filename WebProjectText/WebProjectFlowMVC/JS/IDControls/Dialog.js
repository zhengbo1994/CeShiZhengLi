// 对话框js

// 显示对话框（options为json格式，可指定title,html,htmlid,left,top,width,height,id,resizable,onresize,style/json；若指定id且其存在，则显示它，否则创建）
// callback为显示对话框后的回调函数，类型为function
// showDialog({"title": "颜色和外观", "html": "......", "width": 400, "height": 300})
// showDialog({"title": "颜色和外观", "html": "......", "width": 400, "height": 300, "id": "divStyle"})
function showDialog(option, callback)
{
    // 位置、大小、标题、正文、可调整
    var width = option.width ? parseInt(option.width, 10) : 800;
    var height = option.height ? parseInt(option.height, 10) : 600;
    (width > document.body.offsetWidth) && (width = document.body.offsetWidth);
    (height > document.body.offsetHeight) && (height = document.body.offsetHeight);
    (width < 200) && (width = 200);
    (height < 100) && (height = 100);
    var left = option.left || (document.body.offsetWidth - width) / 2;
    var top = option.top || (document.body.offsetHeight - height) / 2;
    (left < 0) && (left = 0);
    (top < 0) && (top = 0);
    (!option.id) && (option.id = getUniqueKey("dlg", 8));
    (!option.title) && (option.title = "对话框");
    (!option.html) && (option.html = "");
    (option.resizable !== false && option.resizable !== 0) && (option.resizable = true);
    (option.onresize) && (window[option.id + "_onresize"] = option.onresize);

    // DOM
    var dialog = getObj(option.id);
    if (!dialog)
    {
        dialog = document.createElement("div");
        dialog.id = option.id;
        dialog.className = "div_dlg";
        dialog.style.position = "absolute";
        dialog.style.zIndex = 2000;
        dialog.style.display = "none";
        dialog.bgoffset = hasDoctype() ? 2 : 0;
        dialog.resizeoffset = hasDoctype() ? 8 : 0;

        var style = "";
        if (option.style)
        {
            for (var k in option.style)
            {
                if (inValues(k, "text-align", "vertical-align", "padding", "padding-left", "padding-right", "padding-top", "padding-bottom"))
                {
                    style += stringFormat("{0}:{1};", k, option.style[k]);
                }
            }
        }

        var html = stringFormat('<div id="{0}_b" class="dlg_bg" style="width:{3}px;height:{4}px">'
            + '<div id="{0}_t" class="dlg_title" style="width:{5}px" '
            + 'onmousedown="dlgDown(\'{0}\')" onmousemove="dlgMove(\'{0}\')" onmouseup="dlgUp(\'{0}\')">{1}</div>'
            + '<img id="{0}_q" class="dlg_close" src="/{9}/Image/home/close.png" '
            + 'onmouseover="dlgCloseOver(\'{0}\')" onmouseout="dlgCloseOut(\'{0}\')" onclick="closeDialog(\'{0}\')" />'
            + '<div id="{0}_f" class="dlg_form" style="width:{6}px;height:{7}px;{8}">{2}</div>',
            option.id, option.title, option.html, width - dialog.bgoffset, height - dialog.bgoffset,
            width - 63 - dialog.bgoffset, width - 18 - dialog.bgoffset, height - 39 - dialog.bgoffset, style, rootUrl);
        if (option.resizable)
        {
            html += stringFormat('<img id="{0}_i" class="dlg_resize" src="/{1}/Image/home/resize.png" '
                + 'onmousedown="dlgDown(\'{0}\',1)" onmousemove="dlgMove(\'{0}\',1)" onmouseup="dlgUp(\'{0}\',1)"/>',
                option.id, rootUrl);
        }
        html += '</div>';
        dialog.innerHTML = html;

        document.body.appendChild(dialog);

        if (option.htmlid)
        {
            var container = getObj(option.htmlid);
            if (container)
            {
                var dlgForm = getObj(option.id + "_f");
                for (var i = 0; i < container.childNodes.length; i++)
                {
                    dlgForm.appendChild(container.childNodes[i]);
                }
            }
        }
    }
    else
    {
        var border = getObj(option.id + "_b");
        var title = getObj(option.id + "_t");
        var form = getObj(option.id + "_f");

        border.style.width = width - dialog.bgoffset;
        border.style.height = height - dialog.bgoffset;
        title.style.width = width - 63 - dialog.bgoffset;
        form.style.width = width - 18 - dialog.bgoffset;
        form.style.height = height - 39 - dialog.bgoffset;
    }

    // 呈现
    $("div .dlg_title", dialog).text(option.title);
    dialog.style.width = width + "px";
    dialog.style.height = height + "px";
    dialog.style.left = left + "px";
    dialog.style.top = top + "px";
    dialog.style.display = "";
    
    if (typeof callback === 'function')
    {
        callback();
    }

    return option.id;
}

// 关闭
function closeDialog(dlgID)
{
    var dialog = getObj(dlgID);
    if (dialog)
    {
        dialog.style.display = "none";
    }
}

// 鼠标Down/调整开始
function dlgDown(dlgID, resize)
{
    var obj = getObj(dlgID + (resize ? "_i" : "_t"));
    var dialog = getObj(dlgID);
    window[dlgID + "_ox"] = event.clientX - (resize ? dialog.offsetWidth : dialog.offsetLeft);
    window[dlgID + "_oy"] = event.clientY - (resize ? dialog.offsetHeight : dialog.offsetTop);

    var frame = window[dlgID + "_frame"];
    if (!frame)
    {
        frame = document.createElement("div");
        frame.style.position = "absolute";
        frame.style.zIndex = 2000;
        frame.style.border = "4px solid gray";
        window[dlgID + "_frame"] = frame;
    }
    frame.style.left = dialog.offsetLeft;
    frame.style.top = dialog.offsetTop;
    frame.style.width = dialog.offsetWidth - dialog.resizeoffset;
    frame.style.height = dialog.offsetHeight - dialog.resizeoffset;
    document.body.appendChild(frame);

    window[dlgID + "_move"] = 1;
    obj.setCapture();

}

// 鼠标Move/调整中
function dlgMove(dlgID, resize)
{
    if (window[dlgID + "_move"])
    {
        var dialog = getObj(dlgID);
        var nx = event.clientX - window[dlgID + "_ox"];
        var ny = event.clientY - window[dlgID + "_oy"];
        var frame = window[dlgID + "_frame"];

        if (resize)
        {
            (nx < 200) && (nx = 200);
            (ny < 100) && (ny = 100);

            frame.style.width = nx - dialog.resizeoffset;
            frame.style.height = ny - dialog.resizeoffset;
        }
        else
        {
            (ny < 0) && (ny = 0);
            (ny > document.body.offsetHeight - 31 + dialog.bgoffset) && (ny = document.body.offsetHeight - 31 + dialog.bgoffset);
            frame.style.left = nx;
            frame.style.top = ny;
        }
    }
}

// 鼠标Up/调整完毕
function dlgUp(dlgID, resize)
{
    if (window[dlgID + "_move"])
    {
        var frame = window[dlgID + "_frame"];
        var obj = getObj(dlgID + (resize ? "_i" : "_t"));
        var dialog = getObj(dlgID);
        if (resize)
        {
            var w = frame.offsetWidth;
            var h = frame.offsetHeight;
            var border = getObj(dlgID + "_b");
            var title = getObj(dlgID + "_t");
            var form = getObj(dlgID + "_f");

            dialog.style.width = w;
            dialog.style.height = h;
            border.style.width = w - dialog.bgoffset;
            border.style.height = h - dialog.bgoffset;
            title.style.width = w - 63 - dialog.bgoffset;
            form.style.width = w - 18 - dialog.bgoffset;
            form.style.height = h - 39 - dialog.bgoffset;

            var onresize = window[dlgID + "_onresize"];
            if (onresize && typeof (onresize) == "function")
            {
                onresize();
            }
        }
        else
        {
            dialog.style.left = frame.offsetLeft;
            dialog.style.top = frame.offsetTop;
        }
        document.body.removeChild(frame);

        window[dlgID + "_move"] = null;
        obj.releaseCapture();
    }
}

// 关闭图标Over
function dlgCloseOver(dlgID)
{
    var img = getObj(dlgID + "_q");
    img.src = img.src.replace("close.png", "closeon.png");
}

// 关闭图标Out
function dlgCloseOut(dlgID)
{
    var img = getObj(dlgID + "_q");
    img.src = img.src.replace("closeon.png", "close.png");
}