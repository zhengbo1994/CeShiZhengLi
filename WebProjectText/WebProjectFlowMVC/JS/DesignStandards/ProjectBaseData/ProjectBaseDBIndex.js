
 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：业务系统导航-设计标准-项目基础数据库表单
 * 文件类型：ProjectBaseDBIndex.js
 * 作    者：马吉龙
 * 时    间：2010-12-13
 */
 
 //根据项目加载数据
  function ajaxDataGrid()
 {
    var projectid=getObj("ddlProject").value;
    if(projectid!="")
    {
        ajaxRequest('VProjectBaseDBIndex.aspx',{ProjectID:getObj("ddlProject").value,ajax:'GetDtSubject'},'html',function(data,status){
            if(data!=null)
            {
                divData.innerHTML=data;
            }
        });
    }
 }
 
 
 // 下拉菜单方法
function clickMenu(key)
{
    
    switch (key)
    {
        case "AddChild":
            btn_Import();
            break;
        case "Export":
            btnExport.click();
            break;
        case "AddProject":
            btn_ProjectImport();
            break;
    }
}
function selectRow(obj)
{
    var row = obj.parentNode.parentNode;
    var table = row.parentNode.parentNode;
    if (obj.type.toLowerCase() == "checkbox")
    {
        row.className = obj.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_alternaterow');
        
        var chkAll = getObjTR(table, 0, "input", 0);
        if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
        {
            checkSelectAll(table);
        }
    }
    else if (obj.type.toLowerCase() == "radio")
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            table.rows(i).className = (table.rows(i).rowIndex % 2 == 1 ? 'dg_row' : 'dg_alternaterow');
        }
        row.className = 'dg_rowselected';
    }
    rowClass = row.className;    
    var selectIDs = "";    
    var chks = getObjs("chkIDV3");
    if(chks.length>0)
    {
        for(var i=0;i<chks.length;i++)
        {
            if(chks[i].checked)
            { 
                selectIDs += "," + chks[i].value;
            }
        }
    }            
  
}

function btn_Import()
{
//     var chk = getSelectedBox("chkIDV3");
//     if(chk!=null)
//     {
//        var vPID="";
//        if(type==0)
//        {
//            vPID=chk.parentid;
//        }
//        else if(type==1)
//        {
//            vPID=chk.value;
//        }
        openWindow("VProjectBaseDBIndexImport.aspx?ProjectID="+getObj("ddlProject").value+"&DBType=0",500,200, 0, 1, 1);
//     }     
}

function btn_ProjectImport()
{
    openWindow("VProjectBaseDBIndexOtherProjectImport.aspx?ProjectID="+getObj("ddlProject").value+"&DBType=0",500,200, 0, 1, 1);
}

function addProjectBaseDBIndex(isSon)
{     
    if(getObj("ddlProject").value!="")
    {
        var objSelect = document.getElementsByName("chkIDV3");    
        var ParentID='00000'
        if (objSelect.length)
        {
            var chk = getSelectedBox("chkIDV3");
            if (chk != null)
            {       
                if(isSon=='0')
                {   
                    ParentID = chk.parentid;
                }
                if(isSon=='1')
                {
                    ParentID = chk.value;   
                }
                openWindow("VProjectBaseDBIndexAdd.aspx?ParentID="+ParentID+"&ProjectID="+getObj("ddlProject").value+"&isSon="+isSon,500,300, 0, 1, 1);
           
            }
            return;
        } 
        openWindow("VProjectBaseDBIndexAdd.aspx?ParentID="+ParentID+"&ProjectID="+getObj("ddlProject").value+"&isSon="+isSon,500,300, 0, 1, 1);
    }else{
        return alertMsg("请选择项目",getObj("ddlProject"));
    }
}  

function editProjectBaseDBIndex()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {   
        if(chk.pbdbtype=="5")
        { 
            var str="PBDBIID="+chk.value+"&ParentID="+chk.parentid+"&ProjectID="+getObj("ddlProject").value;
            openWindow('VProjectBaseDBIndexEdit.aspx?'+str, 500, 300, 0, 0, 1);
        } else
        {
            return alertMsg("您不能修改此项");
        }        
    }   
}
  
function delProjectBaseDBIndex()
{
    var chk = getObjs("chkIDV3");
    var i=0;
    if(chk.length)
    {
        for(var i=0;i<chk.length;i++)
        {
            if(chk[i].checked&&chk[i].isdelete=="D")
            {
                return alertMsg("删除项包含有不能被删除的项");
            }
        }
        openDeleteWindow("ProjectBaseDBIndex",4,null,null,{ProjectID:getObj("ddlProject").value,DBType:"0"});            
    }         

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
    

//验证表单数据是否合法
function validateSize()
{
    handleBtn(false);
   
     if (getObj("txtPBDBIName").value == "")
    {
        handleBtn(true);
        return alertMsg("名称不能为空。", getObj("txtPBDBIName"));
    }
//     if (getObj("txtUnit").value == "")
//    {
//        handleBtn(true);
//        return alertMsg("单位不能为空。", getObj("txtUnit"));
//    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为整数。", getObj("txtRowNo"));
    }
    return true;    
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled($("#btnSaveOpen"), enabled);
    setBtnEnabled($("#btnSaveClose"), enabled);
}

