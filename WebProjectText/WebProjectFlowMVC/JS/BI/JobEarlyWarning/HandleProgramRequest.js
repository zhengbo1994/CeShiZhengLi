function ddlFlowChanged()
{
    saveDocModel();
}

//显隐区块
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
    
    // 起草与浏览
    if (getObj("chkUseDocModel") != null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setUseDocModel(getObj("chkUseDocModel"));
    }
    else if (getObj("chkUseDocModel") == null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setDisplayDocModel();
    }
}

function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}

function ddlStation_Change(ddl)
{
    if (ddl.value == "")
    {
        getObj("hidStationID").value = "";
        getObj("hidCorpID").value = "";
        getObj("hidPositionLevel").value = "";
    }
    else
    {
        getObj("hidStationID").value = ddl.value.split('|')[0];
        getObj("hidCorpID").value = ddl.value.split('|')[1];
        getObj("hidPositionLevel").value = ddl.value.split('|')[2];
    }
}

function setDesc(areaName)
{
    if (getObj(areaName).value == "0")
    {
        getObj(areaName+'_desc').value = "";
        
        if (areaName == "areaLookInfo")
        {   
            if (getObj("txtSystemLookStation") != null && getObj("txtSystemLookStation").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅岗位(系统)：" + getObj("txtSystemLookStation").value
            }        
            if (getObj("txtSystemLookDept") != null && getObj("txtSystemLookDept").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅部门(系统)：" + getObj("txtSystemLookDept").value
            }
            if (getObj("txtLookStation").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅岗位：" + getObj("txtLookStation").value
            }
            
            if (getObj("txtLookDept").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅部门：" + getObj("txtLookDept").value
            }
        }  
        else if (areaName == "areaFlowFileInfo")
        {
            for (var i=0; i<getObj("flowAccessFile").rows.length; i++)
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                
                if (getObj("flowAccessFile").rows[i].filetitle != undefined)
                {
                    getObj(areaName+'_desc').value += getObj("flowAccessFile").rows[i].filetitle;
                }
            }
        }
    }
    else
    {
        getObj(areaName+'_desc').value = "";
    }
}


function reInitVisible(index)
{     
    // 在回发后若要保持原来选中项，同理。（需自行处理）            
    setVisible('areaBasicInfo', trBasicInfo); 
    setVisible('areaOtherInfo', trOtherInfo);  
    setVisible('areaFlowFileInfo', trFlowFileInfo);  
    setVisible('areaOfficeDoc', trOfficeDoc);
    setVisible('areaLookInfo', trLookInfo);
}

//设置按钮可见性  
function setBtnEnable()
{
 var step=$('#hidStep').val();  
 if(step=='0')
 {
     //第一步。固定不显示返回
     //根据是否审核，判定是否显示提交审核等  
       $('#btnPrevious_tb').hide();
       $('#btnNext_tb').show();
       $('#btnSaveClose_tb').hide();            
    
  }   
  if(step=='1')
  {
       //固定显示返回，但不显示提交审核
       $('#btnNext_tb,#btnSave_tb').hide(); 
       $('#btnPrevious_tb,#btnSaveClose_tb').show();        
  } 
}   

//设置默认区域显示情况 
function setAreaDefault()
{
    $('#tabStep0,#tabStep1').hide();
    
    $('#tabStep'+$('#hidStep').val()).show();
    
    if ($('#hidStep').val()=="0")
    {           
        setDesc('areaLookInfo');
        setDesc('areaFlowFileInfo');
    } 
}   

//提交审核验证数据
function validateSize()
{    
    if ($("#txtTitle").val().length<=0)
    {
        return alertMsg("申请标题不能为空。", $("#txtTitle").get(0));
    }       
    
    if ($("#hidStep").val() == "1" && (!formValidate() || !flowValidate()))
    {        
        return false;
    }
    
    if (!saveDocModel())
    {
        return alertMsg("正文文档保存失败。", $("#chkUseDocModel").get(0));
    }
    
    return true;
}