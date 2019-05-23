// JScript 文件
//***************************************************//
//
//文件名:PortalProjectArea .js
//作者:马吉龙
//时间:2012-03-17
//功能描述:项目区域JS操作
//
//*************************************************//

//新增
var addPortalProjectArea =function()
{
    openAddWindow("VPortalProjectAreaAdd.aspx",800,600,"jqPortalProjectArea");
}

//修改
var editPortalProjectArea =function()
{
    openModifyWindow("VPortalProjectAreaEdit.aspx",800,600,"jqPortalProjectArea");
}

//删除
var deletePortalProjectArea =function()
{
    openDeleteWindow("PortalProjectArea",0,"jqPortalProjectArea");
}

//验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtPAName").value) == "")
    {
        handleBtn(true);
        return alertMsg("区域名称不能为空。", getObj("txtPAName"));
    }
    if (!isPositiveInt(getObj("txtX").value))
    {
        handleBtn(true);
        return alertMsg("X坐标必须为正整数。", getObj("txtX"));
    }
    if (!isPositiveInt(getObj("txtY").value))
    {
        handleBtn(true);
        return alertMsg("Y坐标必须为正整数。", getObj("txtY"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;    
}
var renderName=function(value,pt,record)
{
    var vUrl="'VPortalProjectCity.aspx?PAID=" + pt.rowId+"'";   
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">设置城市</div>';
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
var move = false,
// 按下鼠标左键时对象的初始坐标
    oox, ooy,
// 按下鼠标左键时的初始坐标
    ox, oy;

// mDown、mOver、mUp三个方法分别对应div的onmousedown、onmousemove、onmouseup事件，完成拖动
function mDown(obj, ev) {
    /* 获取初始鼠标坐标 */
    var ev = ev || window.event;

    if (!obj || obj.tagName != "DIV") {
        return false;
    }

    oox = parseInt($(obj).css('left')), // 目标对象当前横坐标
    ooy = parseInt($(obj).css('top')), // 目标对象当前纵坐标
    
    ox = event.clientX;
    oy = event.clientY;
     
    obj.setCapture();
   
    document.onmousemove = function (ev) {
        mMove(obj, ev);
    };
    document.onmouseup = function (ev) {
        mUp(obj);
    }
    document.onmouseup = function () {
        mUp(obj);
    }

    stopPropagation(ev);
}

function mMove(obj, ev) {
    var event = ev || window.event;

    var currentL = parseInt($(obj).css('left')), // 目标对象当前横坐标
        currentT = parseInt($(obj).css('top')), // 目标对象当前纵坐标
        currentW = obj.offsetWidth,
        currentH = obj.offsetHeight + 5, // +5px是为了保证当前对象的底部部超出父容器边界
    // 横坐标偏移量
        moveL = event.clientX - ox,
    // 纵坐标偏移量
        moveT = event.clientY - oy,
    // 目标横纵坐标
        targetL = oox + moveL,
        targetT = ooy + moveT,
    // divImg
        container = $(obj).parent(),
    // container width, height
        w = container[0].offsetWidth,
        h = container[0].offsetHeight;

    targetL = targetL <= 0 ? 0 : targetL;
    targetL = targetL >= (w - currentW) ? (w - currentW) : targetL;
    targetT = targetT <= 0 ? 0 : targetT;
    targetT = targetT >= (h - currentH) ? (h - currentH) : targetT;


    $(obj).css('left', targetL);
    $(obj).css('top', targetT);

    getObj("txtX").value = obj.style.pixelLeft;
    getObj("txtY").value = obj.style.pixelTop;

    window.status = obj.innerText + (obj.title == "" ? "" : ("," + obj.title)) +
        "坐标: " + obj.style.pixelLeft + ", " + obj.style.pixelTop;
}

function mUp(obj) {
    oox = null;
    ooy = null;
    ox = null;
    oy = null;

    obj.releaseCapture();

    document.onmousemove = null;
    document.onmouseup = null;
    document.onmouseup = null;
}
//双击
function mDB()
{    
    getObj("txtName").focus();
}


function stopPropagation(e) {
    e = e || window.event;
    if (e.stopPropagation) { //W3C阻止冒泡方法
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
}