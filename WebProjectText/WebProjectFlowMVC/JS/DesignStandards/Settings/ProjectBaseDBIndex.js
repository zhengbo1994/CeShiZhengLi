 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：项目产品交付与材料部品标准的表单设计
 * 文件类型：ProjectBaseDBIndex.js
 * 作    者：王勇
 * 时    间：2010年12月14日10:14:30
 */
 
 //新增
 //type 0:同级，1:下级
 var addBaseDBIndex=function(type)
 {
    if(window.frames("frmLeft").document!=null)
    {
        if(getObj("ddlProject").value=="")
        {
            return alertMsg("请选择项目",getObj("ddlProject"));
        }
        var vDBType=getObj("hidDBType").value;
        var vParentID=getObjF("frmLeft","hidParentID").value;
        var vParentID="00000";
        if(type==0)
        {
            //同级
            vParentID=getObjF("frmLeft","hidParentID").value;
        }
        else
        {
            //下级
            vParentID=getObjF("frmLeft","hidPBDBIID").value;
        }
        openWindow("../ProjectBaseData/VProjectBaseDBIndexAdd.aspx?ParentID="+vParentID+"&ProjectID="+getObj("ddlProject").value+"&DBType="+vDBType,500,300, 0, 1, 1);
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 } 
 //修改
 var editBaseDBIndex=function()
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID=getObjF("frmLeft","hidPBDBIID").value;
        var vParentID=getObjF("frmLeft","hidParentID").value;
        var vDBType=getObj("hidDBType").value;
        openWindow("../ProjectBaseData/VProjectBaseDBIndexEdit.aspx?ParentID="+vParentID+"&PBDBIID="+vID+"&DBType="+vDBType+"&ProjectID="+getObj("ddlProject").value,500,300, 0, 1, 1);
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 }
 //删除
 var deleteBaseDBIndex=function()
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID=getObjF("frmLeft", "hidPBDBIID").value; 
        if(vID==null||vID=="")
        {
            return alertMsg("您没有选择任何记录");
        }
        else
        {
            if(getObjF("Main","hidIsDelete").value=="D")
            {
            
                return alertMsg("该记录为系统默认记录不允许删除");
            }
        }
        openDeleteWindow("ProjectBaseDBIndex",4,vID,null,{ProjectID:getObj("ddlProject").value,DBType:getObj("hidDBType").value});
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 }
 
 //自定义表单
 var setCustomeForm=function()
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID=getObjF("frmLeft","hidFormID").value;
        var vDBType=getObj("hidDBType").value;
        openWindow("../../CheckFlow/CustomForm/VCustomFormColumn.aspx?FormID="+vID+"&DBType="+vDBType,800,600);
    }
    else
    {
        
    }
 }
 
 function reloadStandard(pbdbiid,url)
 {
    var path;
    if(url!=null)
        path=url;
    else
        path="../Settings/VProjectBaseDBIndexLeft.aspx";
    window.frames("frmLeft").location=path+"?PBDBIID="+pbdbiid+"&ProjectID="+getObj("ddlProject").value+"&DBType="+getObj("hidDBType").value;
 }
 
 // 下拉菜单方法
function clickMenu(key)
{  
    switch (key)
    {
        case "AddChild":
            btn_Import();
            break;
        case "AddProject":
            btn_ProjectImport();
            break;
        case "Export":
            btnExport.click();
            break;
    }
}
function btn_Import()
{
    if(window.frames("frmLeft").document!=null)
    {
        openWindow("../ProjectBaseData/VProjectBaseDBIndexImport.aspx?ProjectID="+getObj("ddlProject").value+"&DBType="+getObj("hidDBType").value,500,200, 0, 1, 1);
    }    
}

function btn_ProjectImport()
{
    var vDBType=getObj("hidDBType").value;
    openWindow("../ProjectBaseData/VProjectBaseDBIndexOtherProjectImport.aspx?ProjectID="+getObj("ddlProject").value+"&DBType="+vDBType,500,200, 0, 1, 1);
}
 
 //加载数据
 var loadData=function()
 {
    var vProjectID=getObj("ddlProject").value;
    var vDBType=getObj("hidDBType").value;
    window.frames("frmLeft").location="VProjectBaseDBIndexLeft.aspx?ProjectID="+vProjectID+"&DBType="+vDBType;
 }
 var ddlProejct_Change=function()
 {
    loadData();
 }
 
 var index=0;
 var btnSerach_Click=function()
 {
    var vKey=$("#txtKey").val();
    if(vKey!="")
    {
        var spans=window.frames("frmLeft").document.getElementsByTagName("span");
        if(spans!=null)
        {
            if(index==spans.length)
            {
                index=0;
            }
            var i=index;
            while(i<spans.length)
            {
                var span=spans[i];
                i++;
                index=i;
                if(span.innerText.indexOf(vKey)!=-1)
                {                    
                    span.click();
                    setScrollTop(span);                   
                    return;
                }
            }
        }
    }
 }
 function setScrollTop(span)
 {
    window.frames("frmLeft").getObj("divMPList").scrollTop=span.parentNode.parentNode.offsetParent.offsetTop-26;
 }
    