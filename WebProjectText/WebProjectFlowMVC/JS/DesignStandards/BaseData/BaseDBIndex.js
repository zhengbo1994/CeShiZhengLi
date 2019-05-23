// JScript 文件

 function ajaxDataGrid()
 {
        ajaxRequest('VBaseDBIndex.aspx',{ajax:'GetBaseDBIndex'},'html',function(data,status){
            if(data!=null)
            {
                divData.innerHTML=data;
            }
        });
 }

//导入
function importBaseDBIndex()
{
    openWindow("VBaseDBIndexImport.aspx" ,450,150, 0, 1, 1); 
}
//编辑
function editBaseDBIndex()
{   
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        if(chk.issystem=="Y")
        {   
            return alertMsg("此项不能被修改");
        }
        else
        {
            openWindow('VBaseDBIndexEdit.aspx?DBType=0&PBDBIID=' + chk.value, 500, 400, 0, 0, 1);
        }
        
    }
}
//新增
//适用于基础数据库
function addBaseDBIndex(isSon)
{     
    var objSelect = document.getElementsByName("chkIDV3");    
    if (objSelect.length)
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk != null)
        {
            var vParentID='00000'
            if(isSon=='Child')
            {
                vParentID = chk.value;   
            }
            if(isSon=='Sibling')
            {
                vParentID = chk.parentid;   
            }
            openWindow("VBaseDBIndexAdd.aspx?DBType=0&ParentID=" + vParentID,500,400, 0, 1, 1);
        }
        return true;
    } 
    openWindow("VBaseDBIndexAdd.aspx?ParentID=00000&DBType=0",500,400, 0, 1, 1); 
}  

//新增
//type 0:同级，1:下级
//适用于产品标准库和部品标准库
 var addBaseDB=function(type,dbType)
 {
    if(window.frames("frmLeft").document!=null)
    {
        if(getObj("ddlProductType").value=="")
        {
            return alertMsg("请选择产品类型",getObj("ddlProductType"));
        }
        var vDBType=dbType;
        var vParentID=getObjF("frmLeft","hidParentID").value;
        var vParentID="00000";
        if(type=="Sibling")
        {
            //同级
            vParentID=getObjF("frmLeft","hidParentID").value;
        }
        else
        {
            //下级
            vParentID=getObjF("frmLeft","hidPBDBIID").value;
        }
        openWindow("VBaseDBIndexAdd.aspx?ParentID="+vParentID+"&PTID="+getObj("ddlProductType").value+"&DBType="+vDBType,500,300, 0, 1, 1);
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 } 
 
  //修改
  //适用于产品标准库和部品标准库
 function editBaseDB(dbtype)
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID=getObjF("frmLeft","hidPBDBIID").value;
        var vParentID=getObjF("frmLeft","hidParentID").value;
        var vDBType=dbtype;
        openWindow("VBaseDBIndexEdit.aspx?ParentID="+vParentID+"&PBDBIID="+vID+"&DBType="+vDBType+"&PTID="+getObj("ddlProductType").value,500,300, 0, 1, 1);
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 }
 
//删除
//适用于基础数据库
function delBaseDBIndex()
{
    var chk = getObjs("chkIDV3");
    var i=0;
    if(chk.length)
    {
        for(var i=0;i<chk.length;i++)
        {
            if(chk[i].checked&&chk[i].issystem!="N")
            {
                return alertMsg("此项不能被删除");
            }
        }
        openDeleteWindow("BaseDBIndex",4,null,null,{DBType:"0",RealID:"0"});            
    }  
}   

 //删除
 //适用于产品标准库和部品标准库
 
 var deleteBaseDB=function(dbType)
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID = getObjF("frmLeft", "hidPBDBIID").value; 
        var ptID = getObj("ddlProductType").value;
        if(ptID=="")
        {
            return alertMsg("请选择产品类型",getObj("ddlProductType"));
        }
        
        if(vID==null||vID=="")
        {
            return alertMsg("您没有选择任何记录");
        }
        else
        {
            if(getObjF("Main","hidIsSystem").value=="Y")
            {            
                return alertMsg("该记录为系统默认记录不允许删除");
            }
        }
        var realID=ptID+dbType;
        openDeleteWindow("BaseDBIndex",4,vID,null,{DBType:dbType,RealID:realID});
    }
    else
    {
        return alertMsg("页面未加载完成");
    }
 }

//提交验证
function validateSize()
{
    handleBtn(false);
    if (getObj("txtNo").value == "")
    {
        handleBtn(true);
        return alertMsg("编号不能为空。", getObj("txtNo"));
    }
    if (getObj("txtName").value == "")
    {
        handleBtn(true);
        return alertMsg("名称不能为空。", getObj("txtName"));
    }
//    if (getObj("txtUnit").value == "")
//    {
//        handleBtn(true);
//        return alertMsg("单位不能为空。", getObj("txtUnit"));
//    }    
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
   
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


 //加载数据
 var loadData=function()
 {
    var vPTID=getObj("ddlProductType").value;
    var vDBType=getObj("hidDBType").value;
    window.frames("frmLeft").location="VProductStandardDBLeft.aspx?PTID="+vPTID+"&DBType="+vDBType;
 }
 var ddlProductType_Change=function()
 {
    loadData();
 }
 
 function reloadStandard(pbdbiid,url)
 {
    var path;
    if(url!=null)
        path=url;
    else
        path="VProductStandardDBLeft.aspx";
    window.frames("frmLeft").location=path+"?PBDBIID="+pbdbiid+"&PTID="+getObj("ddlProductType").value+"&DBType="+getObj("hidDBType").value;
 }
 
  //自定义表单
 var setCustomeForm=function()
 {
    if(window.frames("frmLeft").document!=null)
    {
        var vID=getObjF("frmLeft","hidPBDBIID").value;
        var vDBType=getObj("hidDBType").value;
        openWindow("../../../CheckFlow/CustomForm/VCustomFormColumn.aspx?FormID="+vID+"&DBType="+vDBType,800,600);
    }
    else
    {
        
    }
 }
 
  // 下拉菜单方法
function clickMenu(key)
{  
    if(getObj("ddlProductType").value=="")
    {
        return alertMsg("请选择产品类型",getObj("ddlProductType"));
    }
    switch (key)
    {
        case "AddChild":
            btn_Import();
            break;
        case "AddProject":
            btn_ProductTypeImport();
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
        openWindow("VBaseDBIndexImport.aspx?PTID="+getObj("ddlProductType").value+"&DBType="+getObj("hidDBType").value,500,200, 0, 1, 1);
    }    
}

function btn_ProductTypeImport()
{
    var vDBType=getObj("hidDBType").value;
    openWindow("VProductStandardDBOtherTypeImport.aspx?PTID="+getObj("ddlProductType").value+"&DBType="+vDBType,500,200, 0, 1, 1);
}

function checkNo(txtNo)
{
    var patrn=new RegExp("^[1-9]+(\\.[0-9]+)*$");
    var btnSaveOpen=getObj("btnSaveOpen");
    var btnSaveClose=getObj("btnSaveClose");
    if(!patrn.exec(txtNo.value))
    {
        setBtnEnabled(btnSaveOpen,false);
        setBtnEnabled(btnSaveClose,false);
        showWarn("不满足编号规则xx.xx.xx(1.2.3)",true);
        txtNo.focus();
    }
    else
    {
         setBtnEnabled(getObj("btnSaveOpen"),true);
         setBtnEnabled(getObj("btnSaveClose"),true);
         showWarn("",false);
    }
}

function showWarn(msg,isShow)
{
    var warnMsg=$("span[class='warnmsg']");
    var trWarn=$("tr[id$='trWarn']");
    if(isShow)
    {
        trWarn.show();
        warnMsg.text(msg);
    }
    else
    {
        trWarn.hide();
    }
}

 var index=0;
 function btnSearch_Click()
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

function addSys()
{
    getObj("trAddSys").style.display="";
}
 
    