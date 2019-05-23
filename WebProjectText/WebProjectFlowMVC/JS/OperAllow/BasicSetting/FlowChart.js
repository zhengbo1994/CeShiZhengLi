// VFlowChart.aspx、VFlowChartAdd.aspx、VFlowChartEdit.aspx用到的js

//添加流程图
function addFC()
{
    openAddWindow("VFlowChartAdd.aspx", 500, 300);
}

//编辑流程图
function editFC()
{
    openModifyWindow("VFlowChartEdit.aspx", 500, 300);
}

//删除流程图
function delFC()
{
    openDeleteWindow("FlowChart", 0);
}

//验证数据合法性
function validateSize()
{
    handleBtn(false);
    if (getObj("txtModName").value == "")
    {
        handleBtn(true);
        return alertMsg("流程图/模块名称不能为空。", getObj("txtModName"));
    }
    if (!fileImg.rows.length)
    {
        handleBtn(true);
        return alertMsg("请上传流程图。", fileImg);
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled("btnSaveOpen,btnSaveClose", enabled);
}

// 查看流程图
function showFlowChart()
{
    var tr = getEventObj("tr");
    var fcID = getObjC(tr, "input", 0).value;
    openWindow("VFlowChartBrowse.aspx?FCID=" + fcID, 0, 0);
}

// 设置流程图
function setFlowChart()
{
    var tr = getEventObj("tr");
    var fcID = getObjC(tr, "input", 0).value;
    openWindow("VFlowChartSetting.aspx?FCID=" + fcID, 0, 0);
}

// 加载流程图
function reloadData()
{
    ajax(location.href, { "SetOper": $("#hidSetOper").val() }, "json", loadFlowChart);
}

// 刷新流程图
function loadFlowChart(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}



// VFlowChartSetting.aspx用到的js

// 加载模块锚点
function loadModAnchors()
{
    document.body.onselectstart = function () { return false; };
    if ($("#hidFC").val())
    {
        var anchors = $.stringToJSON($("#hidFC").val());
        for (var i = 0; i < anchors.length; i++)
        {
            var id = getUniqueKey('div');
            var mod = getModAnchor(id, anchors[i].aid, anchors[i].atype, anchors[i].title, anchors[i].width, anchors[i].height);
            mod.style.left = anchors[i].left;
            mod.style.top = anchors[i].top - 20;

            divImg.appendChild(mod);
        }
    }
}

// 切换流程模块或系统菜单
function showAnchorList(isMenu)
{
    getObj("tdML1").className = isMenu ? "dft_h3" : "dft_h2";
    getObj("tdML2").className = isMenu ? "dft_h2" : "dft_h3";
    getObj("spML1").className = isMenu ? "dft_tle3" : "dft_tle2";
    getObj("spML2").className = isMenu ? "dft_tle2" : "dft_tle3";

    trFM.style.display = isMenu ? "none" : "";
    trAPM1.style.display = isMenu ? "" : "none";
    trAPM2.style.display = isMenu ? "" : "none";

    if (isMenu && !$(divAPModel).html())
    {
        reloadAPModel();
    }
}

// 显示或隐藏流程模块
function showFMList()
{
    var display;
    var tr = getEventObj("tr");
    var img = getObjC(tr, "img", 0);
    if (img.src.indexOf("heredown.gif") == -1)
    {
        display = "";
        img.src = img.src.replace("here.gif", "heredown.gif");
    }
    else
    {
        display = "none";
        img.src = img.src.replace("heredown.gif", "here.gif");
    }
    for (var i = tr.rowIndex + 1; i < tbFlowModel.rows.length; i++)
    {
        if (tbFlowModel.rows[i].cells[0].className)
        {
            break;
        }
        else
        {
            tbFlowModel.rows[i].style.display = display;
        }
    }
}

// 加载系统菜单
function reloadAPModel()
{
    setAjaxContainer(divAPModel);
    ajax(location.href, { "Action": "GetAPModel", "RootModID": $("#ddlAPModel").val() }, "json", refreshAPModel);
}

// 刷新系统菜单
function refreshAPModel(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divAPModel).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}


// 获取锚点DOM
function getModAnchor(id, aid, atype, title, width, height)
{
    var mod = document.createElement('div');
    mod.innerHTML = stringFormat('<div class="bd_div" style="width:{4}px">'
        + '<b class="bd1"></b><b class="bd2"></b><b class="bd3"></b><b class="bd4"></b>'
        + '<div class="bd_content font" style="padding:0;border-bottom:1px solid;text-align:center;white-space:nowrap;cursor:pointer" '
        + 'onmousedown="mDown(this,1,\'{0}\')" onmousemove="mMove(this,1,\'{0}\')" onmouseup="mUp(this,1)">{3}</div></div>'
        + '<div style="width:0px;height:0px;font-size:0px;padding:0" contentEditable="true" onkeydown="return delMod(\'{0}\')">'
        + '<div style="width:{5}px;height:{6}px;border:1px dashed blue;background-image:url(../../Image/transparent30.png)" '
        + 'disabled="true" aid="{1}" atype="{2}"></div></div>',
        id, aid, atype, title, (title.length * 12 + 10), width, height);
    mod.id = id;
    mod.style.position = 'absolute';

    return mod;
}

var movable = 0;    // 允许拖动（1/0）
var ox;             // 鼠标与拖动对象左上角的X坐标差
var oy;             // 鼠标与拖动对象左上角的Y坐标差
var anchor;

// 鼠标按下（opt：0:拖动模块到流程图中/1:在流程图中拖动模块改变其位置/2:拖动流程图，下同）
function mDown(obj, opt, id)
{
    switch (opt)
    {
        case 0:
            ox = event.clientX - getAbsAxisX(obj) + divImg.scrollLeft;
            oy = event.clientY - getAbsAxisY(obj) + divImg.scrollTop;

            var id = getUniqueKey('div');
            anchor = getModAnchor(id, obj.aid, obj.atype, obj.innerText, 100, 30);
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            break;
        case 1:
            var objMove = getObj(id);
            ox = event.clientX - objMove.offsetLeft;
            oy = event.clientY - objMove.offsetTop;
            break;
        case 2:
            ox = event.clientX + divImg.scrollLeft;
            oy = event.clientY + divImg.scrollTop;
            break;
    }

    movable = 1;
    obj.setCapture();
}

// 鼠标拖动
function mMove(obj, opt, id)
{
    if (movable)
    {
        switch (opt)
        {
            case 0:
                if (anchor.style.display == "none")
                {
                    anchor.style.display = "";
                }
                anchor.style.left = event.clientX - ox + divImg.scrollLeft;
                anchor.style.top = event.clientY - oy + divImg.scrollTop;
                break;
            case 1:
                var objMove = getObj(id);
                var img = getObj("imgChart");
                var objMod = getObjC(objMove, "div", 3);
                var l = event.clientX - ox;
                var t = event.clientY - oy;
                var w = objMod.offsetWidth;
                var h = objMod.offsetHeight + 20;
                objMove.style.left = (((l > 0 ? l : 0) > img.width - w) ? img.width - w : (l > 0 ? l : 0));
                objMove.style.top = (((t > 0 ? t : 0) > img.height - h) ? img.height - h : (t > 0 ? t : 0));
                break;
            case 2:
                divImg.scrollLeft = ox - event.clientX;
                divImg.scrollTop = oy - event.clientY;
                break;
        }
    }
}

// 鼠标松开
function mUp(obj, opt)
{
    if (movable)
    {
        switch (opt)
        {
            case 0:
                var x = anchor.offsetLeft;
                var y = anchor.offsetTop;
                var minX = getAbsAxisX(divImg);
                var minY = getAbsAxisY(divImg);
                var maxX = minX + divImg.offsetWidth - 100;
                var maxY = minY + divImg.offsetHeight - 50;
                if (x > minX && y > minY && x < maxX && y < maxY)
                {
                    anchor.style.left = anchor.offsetLeft - getAbsAxisX(divImg) + divImg.scrollLeft;
                    anchor.style.top = anchor.offsetTop - getAbsAxisY(divImg) + divImg.scrollTop;
                    divImg.appendChild(anchor);
                }
                else
                {
                    reboundMod(anchor, obj, 30);
                }
                break;
            case 1:
                break;
            case 2:
                break;
        }

        movable = 0;
        obj.releaseCapture();
    }
}

// 锚点弹回
function reboundMod(anchor, obj, cnt)
{
    var diffX = anchor.offsetLeft - getAbsAxisX(obj);
    var diffY = anchor.offsetTop - getAbsAxisY(obj);
    if (cnt > 0 && Math.abs(diffX) > diffX / cnt)
    {
        anchor.style.left = anchor.offsetLeft - diffX / cnt;
        anchor.style.top = anchor.offsetTop - diffY / cnt;
        setTimeout(function () { reboundMod(anchor, obj, --cnt); }, 10);
    }
    else
    {
        document.body.removeChild(anchor);
    }
}

// 锚点删除（流程图中的模块）
function delMod(id)
{
    if (event.keyCode == 46)
    {
        divImg.removeChild(getObj(id));
    }
    return true;
}

// 保存流程图锚点
function saveFC()
{
    var anchors = [];
    for (var i = 0; i < divImg.childNodes.length; i++)
    {
        if (divImg.childNodes[i].nodeName.toLowerCase() == "div")
        {
            var objMod = getObjC(divImg.childNodes[i], "div", 3);
            anchors.push(
            {
                "aid": objMod.aid,
                "atype": objMod.atype,
                "title": divImg.childNodes[i].innerText,
                "left": divImg.childNodes[i].offsetLeft,
                "top": divImg.childNodes[i].offsetTop + 20,
                "width": objMod.offsetWidth,
                "height": objMod.offsetHeight
            });
        }
    }
    if (!anchors.length)
    {
        return alertMsg("未设置任何流程模块。");
    }

    ajax(location.href, { "Action": "SaveFC", "Data": $.jsonToString(anchors) }, "json", finishSaveFC, true, "POST");
}

// 刷新流程图
function finishSaveFC(data, textStatus)
{
    alert(data.Data);
}



// VFlowChartBrowse.aspx用到的js

// 加载模块锚点
function loadAnchors()
{
    document.body.onselectstart = function () { return false; };
    if ($("#hidFC").val())
    {
        var anchors = $.stringToJSON($("#hidFC").val());
        for (var i = 0; i < anchors.length; i++)
        {
            var anchor = document.createElement('div');
            anchor.innerHTML = stringFormat('<div class="bd_div" style="width:{1}px">'
                + '<b class="bd1"></b><b class="bd2"></b><b class="bd3"></b><b class="bd4"></b>'
                + '<div class="bd_content font" style="padding:0;border-bottom:1px solid;text-align:center;white-space:nowrap">{0}</div></div>'
                + '<div style="width:{2}px;height:{3}px;border:1px dashed blue;background-image:url(../../Image/transparent30.png)"></div>',
                anchors[i].title, (anchors[i].title.length * 12 + 10), anchors[i].width, anchors[i].height);
            anchor.style.position = 'absolute';
            anchor.style.left = anchors[i].left;
            anchor.style.top = anchors[i].top - 20;

            divImg.appendChild(anchor);
        }
    }
}