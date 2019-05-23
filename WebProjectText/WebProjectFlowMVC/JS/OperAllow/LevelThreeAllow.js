// JScript 文件

var scrollTop = 0;
var scrollLeft = 0;

// 加载所有架构
function loadStrudcture()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    var stationID = getObjP("ddlStation").value;
    var idm_ID = getObjP("hidIDM_ID").value;
    ajaxRequest("VLevelThreeAllowLeft.aspx", { AjaxRequest: true,StationID:stationID,IDM_ID:idm_ID }, "html", refreshStructure);
}

// 刷新架构
function refreshStructure(data, textStatus)
{
    $(document.body).html(data);
    
    divMPList.scrollTop = scrollTop;
    divMPList.scrollLeft = scrollLeft;
    
    var spanID = window["TreeNode_Selected"];
    
    if (!spanID)
    {
        spanID = "span_0";
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["StruID"] = null;
        window.parent["IsPD"] = null;
    }
}

function ddlStation_Change()
{
    window.frames("Left").loadStrudcture();
}

// 显示架构信息
function showStructure(span, struID,type)
{
    clickTreeNode(span);
    
    window.parent["StruID"] = struID;
    
    if(struID =="ALL")
    {
        window.parent.frames("Main").location ="VLevelThreeAllowCorp.aspx"
    }
    
    if(type=="C" && struID !="ALL" )
    {
        window.parent.frames("Main").location ="VLevelThreeAllowDept.aspx?CorpID="+struID;
    }
    
    if(type=="D")
    {
        window.parent.frames("Main").location ="VLevelThreeAllowStation.aspx?StruID="+struID;
    }
    
    //execFrameFuns("Main", function(){window.parent.frames("Main").loadStruInfo(struID);}, window.parent);
}



// VCorpStructureMain.aspx的js

// 加载架构信息
function loadStruInfo(struID)
{
    ajaxRequest("VCorpStructureMain.aspx", { AjaxRequest: true, StruID: struID }, "html", refreshStruInfo);
}

// 刷新架构信息
function refreshStruInfo(data, textStatus)
{
    $(document.body).html(data);
}

//生成文档名称超链接
function setCorpLink(cellvalue,opts,rowobj)
{
   return "<div class=\"nowrap\"><a href=\"javascript:SetAllow('"+rowobj[0]+"','0');\">设置</a></div>";
}

function setDeptLink(cellvalue,opts,rowobj)
{
   return "<div class=\"nowrap\"><a href=\"javascript:SetAllow('"+rowobj[0]+"','1');\">设置</a></div>";
}

function setStationLink(cellvalue,opts,rowobj)
{
   return "<div class=\"nowrap\"><a href=\"javascript:SetAllow('"+rowobj[0]+"','2');\">设置</a></div>";
}


function SetAllow(id,type)
{
    var vValue = openModalWindow('VSetLevelThreeAllow.aspx?ID='+id+'&Type='+type, 500, 400);
}

 function btnSelectStation_Click(action)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+action+'&CorpID=', 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("txtStation").value = vValue.split('|')[1];
        getObj("hidStationID").value = vValue.split('|')[0];
    }
}

function btnSelectDept_Click(action)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+action+'&CorpID=', 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("txtDept").value = vValue.split('|')[1];
        getObj("hidDeptID").value = vValue.split('|')[0];
    }
}

function btnSelectGroup_Click()
{
    var vValue = openModalWindow('../../Common/Select/OperAllow/VSelectAvailableGroup.aspx?Aim=ArchivesGroup', 700, 600);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("txtGroup").value =vValue.split('|')[1];
        getObj("hidGroupID").value = vValue.split('|')[0];
    } 
}

 function validateSize()
 {
    if(getObj("txtDept").value==""&&getObj("txtStation").value==""&&getObj("txtDept").value=="")
    {
        return alertMsg("请选择一项授权。");
    }
    return true;
 }