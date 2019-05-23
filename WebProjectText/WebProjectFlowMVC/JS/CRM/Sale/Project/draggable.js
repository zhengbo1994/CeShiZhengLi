/*
    由JS/Subarea.js改编而来，因其脚本參杂业务元素，图片路径也是相对于其业务路径
*/

var move = false;
var ox, oy;
var closeCursorImgUrl = rootUrl + "/image/icon/closedhand.cur";
var openCursorImgUrl = rootUrl + "/image/icon/openhand.cur";

//注册拖拽元素事件
//container表示容器,target表示拖拽的目标地,dragElements表示可拖拽元素
function draggable(containerid,targetid,dragElements)
{
    //注册目标地的鼠标移动事件
    var dragTarget = $("#" + targetid).get(0);
    var dragContainer = $("#" + containerid).get(0);
    //dragTarget.onmousedown = function () { dragDown(dragContainer, dragTarget, true) };
    //dragTarget.onmousemove = function () { dragMove(dragContainer,dragTarget, dragTarget, true) };
    //dragTarget.onmouseup = function() {dragUp(dragContainer, dragTarget, true)};
    dragTarget.style.cursor = "url(" + closeCursorImgUrl + ");";
    dragTarget.style.zindex = 0;
    dragTarget.onerror = function () { dragTarget.src = rootUrl + "/image/noip.gif"; }
    //可移动元素
    if (dragElements && dragElements.length > 0)
    {
        dragElements.each
        (
            function ()
            {
                var dragElement = $(this).get(0);
                dragElement.style.zindex = 1;
                dragElement.onmousedown = function () { dragDown(dragContainer, dragElement, false); };
                dragElement.onmousemove = function () { dragMove(dragContainer,dragTarget, dragElement, false); }
                dragElement.onmouseup = function () { dragUp(dragElement, false); }
            }
        );
    }
    
}

function dragDown(container,obj,isTarget)
{
    move = true;
    obj.setCapture();
    if (isTarget)
    {
        obj.style.cursor = "url(" + openCursorImgUrl + "),move";
        ox = event.clientX + container.scrollLeft;
        oy = event.clientY + container.scrollTop;
    }
    else
    {
        ox = event.clientX - obj.offsetLeft;
        oy = event.clientY - obj.offsetTop;
    }
}

function dragMove(container,target, obj, isTarget)
{
    if (move)
    {
        if (isTarget)
        {
            var l = ox - event.clientX;
            var h = oy - event.clientY;
            container.scrollLeft = l;
            container.scrollTop = h;
        }
        else
        {
            var l = event.clientX - ox;
            var h = event.clientY - oy;

            obj.style.left = (((l > 0 ? l : 0) > target.width - 23) ? target.width - 23 : (l > 0 ? l : 0));
            obj.style.top = (((h > 0 ? h : 0) > target.height - 25) ? target.height - 25 : (h > 0 ? h : 0));
        }
    }

    if (!isTarget)
    {
        window.status = obj.innerText + (obj.title == "" ? "" : ("," + obj.title)) + ": " + obj.style.pixelLeft + ", " + obj.style.pixelTop;
    }
}

function dragUp(obj, isTarget)
{
    obj.releaseCapture();
    move = false;
    if (isTarget)
    {
        obj.style.cursor = "url("+closeCursorImgUrl+"),default";
    }
}

//获取指定元素的位置,elements只支持jquery对象
function getPosition(elements)
{
    var positions = [];
    if (elements && elements.length > 0)
    {
        elements.each
        (
            function ()
            {
                var element = $(this).get(0);
                positions.push(
                    {
                        Element: element,
                        PosLeft: element.style.pixelLeft,
                        PosTop: element.style.pixelTop
                    }
                    );
             }
        );
    }
    return positions;
}