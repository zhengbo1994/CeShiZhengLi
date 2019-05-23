// JScript 文件
//***************************************************//
//
//文件名:PortalImgConfig.js
//作者:马吉龙
//时间:2012-03-19
//功能描述:门户图片的相关JS
//
//*************************************************//

function showBriefingConfig(id,type)
{
    getObj("hidFirstID").value = id;
    getObjP("hidType").value = type;
    getObjP("hidID").value = id;
    reloadData();
} 
function selectTreeNode(span)
{
    getObj(getObjP("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObjP("hidFirstSpan").value = span.id;
}              
function reloadData()
{
    execFrameFuns("Main", function(){window.parent.frames("Main").loadInfo(getObj("hidFirstID").value,getObjP("hidType").value);}, window.parent);
}
       
 // 加载
function loadInfo(id,type)
{
    ajax("VPortalImgConfigMain.aspx",{ID: id,Type:type }, "html", refreshInfo);
}

// 刷新
function refreshInfo(data, textStatus)
{
    $(document.body).html(data);
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
    }
}
//设置
function setPortalImgConfig()
{
    openWindow("VPortalImgConfigSet.aspx?Type="+getObj("hidType").value+"&ID="+getObj("hidID").value ,500,300)
}