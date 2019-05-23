// VWorkGuideFlow.aspx的js文件

// 显示岗位流程
function showFlow(index, stationID, mode)
{
    selectTab(index, "IDFlowTab");
    window["CreateStationID"] = stationID;

    ajax(["VWorkFlow.aspx", "VWorkForm.aspx", "VWorkFlowForm.aspx"][mode], { "StationID": stationID, "Mode": mode }, "json", refreshFlow);
}

// 刷新流程
function refreshFlow(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divFlow).html(data.Data);

        // 为流程加title
        $(".nowrap").each(function ()
        {
            this.title = this.innerText + (this.title ? ("\n" + this.title) : "");
        });
        // 非本公司流程，在根类别上加[]并设置title为其公司
        $(".roottype").each(function ()
        {
            this.title && (this.innerText = "[" + this.innerText + "]");
        });

        // 流程点击
        $("a", divFlow).each(function ()
        {
            $(this).on("click", function ()
            {
                request(this.url, this.fid, this.ft);
            }).on("mouseover", function ()
            {
                showPreview(this, divFlow);
            });
        })

    }
    else
    {
        alert(data.Data);
    }
}

// 显示预览图标
function showPreview(aHref, container)
{
    var img = window["Flow_Preview"];
    if (!img)
    {
        img = document.createElement("img");
        img.style.position = "absolute";
        img.style.cursor = "pointer";
        img.title = "流程预览";
        img.src = "../../Image/home/preview.png";
        img.onmousemove = function () { img.src = "../../Image/home/previewon.png"; };
        img.onmouseout = function () { img.src = "../../Image/home/preview.png"; };

        window["Flow_Preview"] = img;
    }
    img.onclick = function ()
    {
        var url = stringFormat("VFlowPreview.aspx?FID={0}&Type={1}", aHref.fid, aHref.ft);
        window["CreateStationID"] && (url = addUrlParam(url, "StationID", window["CreateStationID"]));
        openWindow(url, 800, 600);
        //(parent && parent.closeGuide) && parent.closeGuide();
    }
    var left = getAbsAxisX(aHref) + container.scrollLeft - getAbsAxisX(container) + aHref.offsetWidth + 4;
    (left > getAbsAxisX(aHref.parentNode) + aHref.parentNode.offsetWidth - 16) && (left = getAbsAxisX(aHref.parentNode) + aHref.parentNode.offsetWidth - 16);
    img.style.left = left;
    img.style.top = getAbsAxisY(aHref) + container.scrollTop - getAbsAxisY(container) + (aHref.offsetHeight - 16) / 2;
    img.style.display = "";
    container.appendChild(img);
}

// 打开起草页（type：1:流程/2:表单/3:模块）
function request(url, flowID, type)
{
    var stationID = window["CreateStationID"] || getParamValue("StationID");
    stationID && (url = addUrlParam(url, "StationID", stationID));
    (type == 1) && (url = addUrlParam(url, "FlowID", flowID));
    (type == 2) && (url = addUrlParam(url, "FormID", flowID));
    url = addUrlParam(url, "JQID", "");
    
    (parent && parent.closeGuide) && parent.closeGuide();
    openWindow("../../" + url, 0, 0);
}

// 折叠展开列表
function ecList(img, behavior)
{
    if (behavior == -1)
    {
        var imgs = $(".dft_tle11>img");
        for (var i = 0; i < imgs.length; i++)
        {
            imgs[i].state = img.state == "0" ? "0" : "1";
            imgs[i].click();
        }
    }
    else if (behavior == 0)
    {
        img.state = (img.state == "0" ? "1" : "0");
        img.src = img.state == "0" ? img.src.replace("expand", "collapse") : img.src.replace("collapse", "expand");
        getObj("trList" + img.parentNode.findex).style.display = (img.state == "0" ? "none" : "");
    }
    else
    {
        var extension = img.src.substr(img.src.lastIndexOf("."));
        img.src = img.src.substr(0, img.src.lastIndexOf("/") + 1) + (behavior == 1 ? (img.state == "1" ? "area_expand_on"
            : "area_collapse_on") : (img.state == "1" ? "area_expand" : "area_collapse")) + extension;
    }

    var img = window["Flow_Preview"];
    if (img)
    {
        img.style.display = "none";
    }
}

// 搜索
var kw = "";
var num = 0;
function searchFlow()
{
    if (kw == getObj("txtKW").value)
    {
        num++;
    }
    else
    {
        kw = getObj("txtKW").value;
        num = 0;
    }
    var indexs = [];
    var objs = divFlow.getElementsByTagName("a");
    for (var i = 0; i < objs.length; i++)
    {
        //为了匹配搜索时不区分大小写 张韩 20150821
        var reg=/^[A-Za-z]+$/;
        var div = objs[i].parentNode;
        div.style.backgroundColor = "";
        if (reg.test(kw)) {
            if (kw != "" && div.title.indexOf(kw.toLowerCase()) != -1)
            {
                indexs.push(i);
            }
            if (kw != "" && div.title.indexOf(kw.toUpperCase()) != -1)
            {
                indexs.push(i);
            }
        }
        else
        {
            if (kw != "" && div.title.indexOf(kw) != -1)
            {
                indexs.push(i);
            }
        }
        
    }
    if (kw != "")
    {
        if (num > indexs.length - 1)
        {
            num = 0;
        }
        if (indexs.length)
        {
            var div = objs[indexs[num]].parentNode;
            div.style.backgroundColor = "yellow";
            var row = div;
            while (row)
            {
                row = row.parentNode;
                if (row.tagName.toUpperCase() == "TR" && row.id.indexOf("trList") != -1)
                {
                    break;
                }
            }
            if (row.style.display == "none")
            {
                getObjC(row.parentNode.rows[row.rowIndex - 1], "img", 0).click();
            }
            div.focus();
            getObj("txtKW").focus();
        }
        else
        {
            // 未搜索到，可弹出自动隐藏的提示，待续
        }
    }
}

// 选中第一项
function loadGuideInfo(mode)
{
    switch (mode)
    {
        // 流程、表单模式、流程+表单 10模式
        case 0:
        case 1:
            try
            {
                var tabDefault = getObjs("IDFlowTab")[parseInt(getObj("hidDefaultIndex").value)];
                tabDefault.title += "\n(默认岗位)";
                tabDefault.click();
                if (getThemeVersion() === 2014)
                {
                    getObj("divFlow").style.paddingTop = 0;
                }
            }
            catch (err) { }
            break;
        // 流程图模式
        case 2:
            document.body.onselectstart = function () { return false; };
            tbFC.parentNode.style.verticalAlign = "top";
            var fcs = getObjs("IDFCTab");
            if (fcs.length)
            {
                fcs[0].click();
            }
            break;
    }
}



// VWorkFlowChart.aspx的js文件

// 显示流程图
function showFC(index, url)
{
    selectTab(index, "IDFCTab");

    // 清空锚点
    for (var i = divImg.childNodes.length - 1; i >= 0; i--)
    {
        var node = divImg.childNodes[i];
        if (node.nodeName.toLowerCase() != "img")
        {
            divImg.removeChild(node);
        }
    }

    var imgChart = getObj("imgChart");
    imgChart.style.display = "";
    imgChart.index = index;
    imgChart.src = url;

    parent.window[parent.window["DialogID"] + "_onresize"] = function () { showFC(index, url); };
}

// 加载流程图锚点（流程图img onload中调用）
function loadAnchors(imgChart)
{
    var bg = "url(/" + rootUrl + "/Image/transparent.png)";
    var bgOver = "url(/" + rootUrl + "/Image/transparent30.png)";
    var anchors = eval($("#hidFC").val())[imgChart.index];
    for (var i = 0; i < anchors.length; i++)
    {
        var anchor = document.createElement('div');
        anchor.style.position = 'absolute';
        anchor.style.width = anchors[i].width;
        anchor.style.height = anchors[i].height;
        anchor.style.left = parseInt(anchors[i].left, 10) + imgChart.offsetLeft;
        anchor.style.top = anchors[i].top;
        anchor.title = anchors[i].title;
        anchor.style.backgroundImage = bg;
        anchor.onmouseover = function () { this.style.backgroundImage = bgOver; };
        anchor.onmouseout = function () { this.style.backgroundImage = bg; };
        if (anchors[i].allow == "Y")
        {
            anchor.style.cursor = "pointer";
            var url = "/" + rootUrl + "/" + anchors[i].url;
            anchor.onclick = (function (url)
            {
                return function ()
                {
                    (parent && parent.closeGuide) && parent.closeGuide();
                    openWindow(url, 0, 0);
                }
            })(anchors[i].atype == "0" ? addUrlParam(url, "JQID", "") : url);
            if (anchors[i].atype == "0")
            {
                anchor.fid = anchors[i].fmid;
                anchor.ft = "4";
                $(anchor).on("mouseover", function () { showPreview(this, divImg); });
            }
        }
        else
        {
            anchor.title += "（未授权）";
        }

        divImg.appendChild(anchor);
    }
}

// 拖动背景
var movable = 0;    // 允许拖动（1/0）
var ox;             // 鼠标与拖动对象左上角的X坐标差
var oy;             // 鼠标与拖动对象左上角的Y坐标差

// 鼠标按下（opt：0:拖动模块到流程图中/1:在流程图中拖动模块改变其位置/2:拖动流程图，下同）
function mDown(obj)
{
    ox = event.clientX + divImg.scrollLeft;
    oy = event.clientY + divImg.scrollTop;

    movable = 1;
    obj.setCapture();
}

// 鼠标拖动
function mMove()
{
    if (movable)
    {
        divImg.scrollLeft = ox - event.clientX;
        divImg.scrollTop = oy - event.clientY;
    }
}

// 鼠标松开
function mUp(obj)
{
    if (movable)
    {
        movable = 0;
        obj.releaseCapture();
    }
}