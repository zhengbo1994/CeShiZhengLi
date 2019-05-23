// 形象进度分区

var move = false;
var ox, oy;

// mDown、mOver、mUp三个方法分别对应div的onmousedown、onmousemove、onmouseup事件，完成拖动
// isBg为true时拖动背景
function mDown(obj, isBg)
{
    move = true;
    obj.setCapture();
    if (isBg)
    {
        obj.style.cursor = "url(../../image/icon/closedhand.cur),move";
        ox = event.clientX + divImg.scrollLeft;
        oy = event.clientY + divImg.scrollTop;
    }
    else
    {
        ox = event.clientX - obj.offsetLeft;
        oy = event.clientY - obj.offsetTop;
    }
}

function mMove(obj, isBg)
{
    if (move)
    {
        if (isBg)
        {
            var l = ox - event.clientX;
            var h = oy - event.clientY;
            
            divImg.scrollLeft = l;
            divImg.scrollTop = h;
        }
        else
        {
            var l = event.clientX - ox;
            var h = event.clientY - oy;
            
            obj.style.left = (((l > 0 ? l : 0) > imgUrl.width - 23) ? imgUrl.width - 23 : (l > 0 ? l : 0));
            obj.style.top = (((h > 0 ? h : 0) > imgUrl.height - 25) ? imgUrl.height - 25 : (h > 0 ? h : 0));
        }
    }
    
    if (!isBg)
    {
        window.status = obj.innerText + (obj.title == "" ? "" : ("," + obj.title)) + ": " + obj.style.pixelLeft + ", " + obj.style.pixelTop;
    }
}

function mUp(obj, isBg)
{
    obj.releaseCapture();
    move = false;
    if (isBg)
    {
        obj.style.cursor = "url(../../image/icon/openhand.cur),default";
    }
}

// 移动div(dir：0/上移，1/下移)
function moveSA(div, dir)
{   
    var fromIndex = div.parentNode.parentNode.rowIndex;
    if (fromIndex == 0 && dir == 0 || fromIndex == tbSA.rows.length - 1 && dir == 1)
    {
        return false;
    }
    var toIndex = dir == 0 ? (fromIndex - 1) :(fromIndex + 1);
    
    var fromValue = C$(tbSA.rows[fromIndex].cells[0], "input", 0).value;
    var fromName = C$(tbSA.rows[fromIndex].cells[2], "input", 0).value;
    var toValue = C$(tbSA.rows[toIndex].cells[0], "input", 0).value;
    var toName = C$(tbSA.rows[toIndex].cells[2], "input", 0).value;
    C$(tbSA.rows[fromIndex].cells[0], "input", 0).value = toValue;
    C$(tbSA.rows[fromIndex].cells[2], "input", 0).value = toName;
    C$(tbSA.rows[toIndex].cells[0], "input", 0).value = fromValue;
    C$(tbSA.rows[toIndex].cells[2], "input", 0).value = fromName;
    
    var divs = divImg.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++)
    {
        if (parseInt(divs[i].innerText) == fromIndex + 1)
        {
            divs[i].innerText = toIndex + 1;
            divs[i].style.zIndex = toIndex + 1
            continue;
        }
        if (parseInt(divs[i].innerText) == toIndex + 1)
        {
            divs[i].innerText = fromIndex + 1;
            divs[i].style.zIndex = fromIndex + 1
        }
    }
}

// 居中显示分区(aim：0/不显示气泡，1/显示气泡)
function centerSA(saNo, aim)
{
    var divs = divImg.getElementsByTagName("div");
    
    for (var i = 0; i < divs.length; i++)
    {
        if (divs[i].innerText == saNo)
        {
            if (aim == 1)
            {
                if (hidSAList.value == "")
                {
                    return false;
                }
            
                hideBubble();
            
                // 如气泡出界，则移动图区
                var left = divs[i].style.pixelLeft - 121;
                var top = divs[i].style.pixelTop - 141;
                if (left < 0)
                {
                    moveIPImgArea(left, 0);
                    left = 0;
                }
                if (top < 0)
                {
                    moveIPImgArea(0, top);
                    top = 0;
                }
                
                var bubble = divBubble.cloneNode(true);
                bubble.style.display = "block";
                bubble.style.left = left;
                bubble.style.top = top;
                
                var saInfo = hidSAList.value.split("^")[i].split("|");
                C$(bubble, "div", 0).innerText = saInfo[2];
                C$(bubble, "div", 2).innerHTML = getStringByLength(saInfo[7], 50, true)
                    + (saInfo[8] != "" ? (getPercentHtml(saInfo[9])) : "")
                    + (saInfo[6] != "" ? ((saInfo[8] == "" ? "<br/>" : "") +"[" + saInfo[6] + "]") : "");
                C$(bubble, "img", 1).saNo = saNo;
                C$(bubble, "img", 1).style.display = "block";
                C$(bubble, "img", 1).src = "../.." + saInfo[5];
                
                divImg.appendChild(bubble);
            }
        
            // 出现横向滚动条
            if (divImg.offsetHeight > divImg.clientHeight)
            {
                divImg.scrollLeft = divs[i].style.pixelLeft - divImg.clientWidth / 2 + 13;
            }
            // 出现纵向滚动条
            if (divImg.offsetWidth > divImg.clientWidth)
            {
                if (aim == 0)
                {
                    divImg.scrollTop = divs[i].style.pixelTop - divImg.clientHeight / 2 + 13;
                }
                // 有气泡，则向下偏移50
                if (aim == 1)
                {
                    divImg.scrollTop = divs[i].style.pixelTop - divImg.clientHeight / 2 - 37;
                }
            }
            
            break;
        }
    }
}

// 编辑分区名称时设置分区的悬停提示
function setTitle(txt)
{
    var index = C$(txt.parentNode.parentNode.cells[1], "div", 0).innerText;
    var divs = divImg.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++)
    {
        if (divs[i].innerText == index)
        {
            divs[i].title = txt.value;
            break;
        }
    }
}

// 插入分区(aim：0/查看，1/编辑，2/进度一览查看)
function insertSA(left, top, value, name, aim, imgUrl)
{
    hidIndex.value = parseInt(hidIndex.value) + 1;
    var divSA = C$(divImg, "div", 0).cloneNode(false);
    divSA.style.left = left;
    divSA.style.top = top;
    divSA.zIndex = parseInt(hidIndex.value);
    divSA.innerText = hidIndex.value;
    divSA.title = name;
    divImg.appendChild(divSA);
    
    var row = tbSA.childNodes(0).cloneNode(true);
    tbSA.appendChild(row);
    if (aim == 0)
    {
        C$(tbSA.rows[tbSA.rows.length - 1].cells[0], "div", 0).innerText = hidIndex.value;
        tbSA.rows[tbSA.rows.length - 1].cells[1].innerText = name;
    }
    else if (aim == 1)
    {
        C$(tbSA.rows[tbSA.rows.length - 1].cells[0], "input", 0).value = value;
        C$(tbSA.rows[tbSA.rows.length - 1].cells[1], "div", 0).innerText = hidIndex.value;
        C$(tbSA.rows[tbSA.rows.length - 1].cells[2], "input", 0).value = name;
    }
    else if (aim == 2)
    {
        C$(tbSA.rows[tbSA.rows.length - 1].cells[0], "div", 0).innerText = hidIndex.value;        
        C$(C$(tbSA.rows[tbSA.rows.length - 1].cells[1], "table", 0).rows(0).cells[0], "a", 0).innerText = name;
        C$(C$(tbSA.rows[tbSA.rows.length - 1].cells[1], "table", 0).rows(1).cells[0], "img", 0).style.display = 'block';
        C$(C$(tbSA.rows[tbSA.rows.length - 1].cells[1], "table", 0).rows(1).cells[0], "img", 0).src = "../.." + imgUrl;
    }
}

// 删除分区
function deleteSA()
{
    if (tbSA.rows.length == 1 && TR$(tbSA, 0, "input", 0).checked)
    {
        alert("必须至少保留一个分区。");
        return false;
    }
    var cnt = 0;
    var divs;
    for(var i = tbSA.rows.length - 1; i >= 0; i--)
    {
	    if (TR$(tbSA, i, "input", 0).checked && tbSA.rows.length > 1)
	    {
	        cnt++;
		    tbSA.removeChild(tbSA.childNodes[i]);
		    
		    divs = divImg.getElementsByTagName("div");
            for (var j = 0; j < divs.length; j++)
            {
                if (parseInt(divs[j].innerText) == i + 1)
                {
                    divImg.removeChild(divs[j]);
                    break;
                }
            }
	    }
    }
    if (cnt == 0)
    {
        alert("请选择要删除的分区。");
        return false;
    }
    $("chkAll").checked = false;
    
    for(var i = 0; i < tbSA.rows.length; i++)
    {
        var tmpIndex = C$(tbSA.rows[i].cells[1], "div", 0).innerText;
        
        C$(tbSA.rows[i].cells[1], "div", 0).innerText = i + 1;
        
	    divs = divImg.getElementsByTagName("div");
        for (var j = 0; j < divs.length; j++)
        {
            if (divs[j].innerText == tmpIndex)
            {
                divs[j].innerText = i + 1;
                divs[j].style.zIndex = i + 1;
                break;
            }
        }
    }
    
    hidIndex.value = parseInt(hidIndex.value) - cnt;
} 

// 加载分区(aim：0/查看，1/编辑，2/进度一览查看)
function loadSA(aim)
{
    if (hidSAList.value != "")
    {
        var saList = hidSAList.value.split("^");
        for (var i = 0; i < saList.length; i++)
        {
            var saInfo = saList[i].split("|");
            var left = parseInt(saInfo[3]);
            var top = parseInt(saInfo[4]);
            var value = saInfo[0];
            var name = saInfo[2];
            if (i == 0)
            {
                if (aim == 0)
                {
                    tbSA.rows[0].cells[1].innerText = name;
                }
                else if (aim == 1)
                {
                    C$(tbSA.rows[0].cells[0], "input", 0).value = value;
                    C$(tbSA.rows[0].cells[2], "input", 0).value = name;
                }
                else if (aim == 2)
                {
                    C$(C$(tbSA.rows[0].cells[1], "table", 0).rows(0).cells[0], "a", 0).innerText = name;
                    C$(C$(tbSA.rows[0].cells[1], "table", 0).rows(1).cells[0], "img", 0).style.display = 'block';
                    C$(C$(tbSA.rows[0].cells[1], "table", 0).rows(1).cells[0], "img", 0).src = "../.." + saInfo[5];
                }
                var divSA = C$(divImg, "div", 0);
                divSA.style.left = left;
                divSA.style.top = top;
                divSA.title = name;
            }
            else
            {
                if (aim == 0 || aim == 1)
                {
                    insertSA(left, top, value, name, aim);
                }
                else if (aim == 2)
                {
                    insertSA(left, top, value, name, aim, saInfo[5]);
                }
            }
        }
    }
}

// 加载驾驶舱中的进度图
function loadCockpit(cnt, dir)
{
    if (dir == null)
    {
        dir = "../..";
    }
    if (hidSAList.value != "")
    {
        var saList = hidSAList.value.split("^");
        var i;
        for (i = 0; i < saList.length && i < cnt; i++)
        {
            var saInfo = saList[i].split("|");
            getObj("divSANo" + i).innerText = saInfo[0];
            getObj("divSAName" + i).innerText = saInfo[1];
            getObj("img" + i).style.display = "block";
            getObj("img" + i).src = dir + saInfo[2];
            getObj("img" + i).title = saInfo[4] + "\n[" + saInfo[3] + "]";
            if (saInfo[5] != "")
            {
                getObj("tdProgress" + i).innerHTML = getPercentHtml(saInfo[6]);
            }
            else
            {
                getObj("tdProgress" + i).style.display = "none";
            }
        }
        for (i++; i <= cnt; i++)
        {
            getObj("td" + i).innerHTML = "";
        }
    }
    else
    {
        tbIP.outerHTML = '<br/><div align="center" style="width:100%;color:red">该项目无形象进度。</div>';
    }
}

// 保存分区信息
function saveSA()
{
    hidSAList.value = "";
    
	var divs = divImg.getElementsByTagName("div");
    
    for (var i = 0; i < tbSA.rows.length; i++)
    {
        hidSAList.value += "^" + C$(tbSA.rows[i].cells[0], "input", 0).value + "|" + C$(tbSA.rows[i].cells[1], "div", 0).innerText + "|"
            + C$(tbSA.rows[i].cells[2], "input", 0).value.replace(/[\|\^]/g, "");
        
        for (var j = 0; j < divs.length; j++)
        {
            if (parseInt(divs[j].innerText) == i + 1)
            {
                hidSAList.value += "|" + divs[j].style.pixelLeft + "|" + divs[j].style.pixelTop;
                break;
            }
        }
    }
    
    if (hidSAList.value != "")
    {
        hidSAList.value = hidSAList.value.substr(1);
    }
}

// 隐藏气泡，图区归位
function hideBubble()
{
    var saList = hidSAList.value.split("^");
    if (divImg.childNodes.length > saList.length + 1)
    {
        for (var i = divImg.childNodes.length - 1; i > saList.length; i--)
        {
            divImg.removeChild(divImg.childNodes[i]);
        }
    }
    
    var left = imgUrl.style.pixelLeft;
    var top = imgUrl.style.pixelTop;
    
    moveIPImgArea(left, top);
}

// 移动图区
function moveIPImgArea(left, top)
{
    if (left != 0)
    {
        for (var i = 0; i < divImg.childNodes.length; i++)
        {
            divImg.childNodes[i].style.left = divImg.childNodes[i].style.pixelLeft - left;
        }
    }
    if (top != 0)
    {
        for (var i = 0; i < divImg.childNodes.length; i++)
        {
            divImg.childNodes[i].style.top = divImg.childNodes[i].style.pixelTop - top;;
        }   
    }
}

// 获取进度条的Html
function getPercentHtml(percent, width)
{
    percent = getRound(percent, 2);
    
    if (width == null)
    {
        width = 110;
    }
    else if (width < 50)
    {
        width = 50;
    }
    imgpercent = 100 * (width - 40) / width;
    
    return '<table id="tbProgress" border="0" cellpadding="0" cellspacing="0" style="width:' + width + 'px"><tr><td style="width:' + imgpercent + '%" nowrap="nowrap">'
        + '<div class="ipstrip1" style="width:' + percent + '%"></div>'
        + '<div class="ipstrip2" style="width:' + (100 - percent) + '%"></div>'
        + '</td><td class="ipstrip3" style="width:' + (100 - imgpercent) + '%">' + percent + '%</td></tr></table>';
}