// 登录页设置

var move = false;
var ox, oy;

// mDown、mOver、mUp三个方法分别对应div的onmousedown、onmousemove、onmouseup事件，完成拖动
function mDown(obj)
{
    move = true;
    obj.setCapture();
    
    ox = event.clientX - obj.style.pixelLeft;
    oy = event.clientY - obj.style.pixelTop;
}

function mMove(obj)
{
    if (move)
    {
        obj.style.left = event.clientX - ox;
        obj.style.top = event.clientY - oy;
    }
    
    window.status = "登录框坐标: " + obj.style.pixelLeft + ", " + obj.style.pixelTop;
}

function mUp(obj)
{
    obj.releaseCapture();
    move = false;
}

// 选择背景色
function selectBgColor(txt, img)
{
    var url = "../../Common/FTB/FTB_SelectColor.htm?iframe=" + txt.value.substr(1);
    var color = openModalWindow(url, 440, 285);
    if (color != null)
    {
        txt.value = color;
        img.style.backgroundColor = color;
        tbBody.style.backgroundColor = color;
    }
}

// 上传
function fileUploaded(fileRow, uploadID)
{
    if (uploadID == "fileBgImg")
    {
        tbBody.style.backgroundImage = "url('../.." + fileRow.filename + "')";
    }
    else if (uploadID == "filImg")
    {
        imgLogin.src = "../.." + fileRow.filename;
        imgLogin.style.display = "";
    }
}

// 删除
function fileDeleted(fileRow, uploadID)
{
    if (uploadID == "fileBgImg")
    {
        tbBody.style.backgroundImage = "none";
    }
    else if (uploadID == "filImg")
    {
        imgLogin.src = "";
    }
}

// 登录页图片加载
function loginImgLoad(div, img)
{
    div.style.width = img.offsetWidth;
    div.style.height = img.offsetHeight;
}
// 登录页图片失败
function loginImgError(div, img)
{
    div.style.width = 776;
    div.style.height = 374;
    img.style.display = 'none';
}

// 保存设置
function saveLoginInfo()
{
    var bgColor = $("#txtBgColor").val();
    var bgImg = "";
    var img = "";
    var left = login.style.pixelLeft;
    var top = login.style.pixelTop;
    
    if (fileBgImg.rows.length > 0)
    {
        bgImg = fileBgImg.rows[0].filename;
    }
    if (filImg.rows.length > 0)
    {
        img = filImg.rows[0].filename;
    }
    
    ajaxRequest("FillData.ashx", {action: "SaveLoginInfo", BgColor:bgColor, BgImg:bgImg, Img:img, Left:left, Top:top}, "text", afterSaveLoginInfo);
}

// 设置完成
function afterSaveLoginInfo(data, textStatus)
{
    alert(data);
}