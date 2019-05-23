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


function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
  
    setVisible('areaBasicInfo', trBasicInfo);
    setVisible('areaFlowFileInfo', trFlowFileInfo);
    setVisible('areaOfficeDoc',trOfficeDoc);
    if (index == 0)
    { 
        setDesc('areaFlowFileInfo');
        setDesc('areaLookInfo');
    }
}

function showCheckTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
    
    setVisible('areaBasicInfo', trBasicInfo);
    setVisible('areaFlowFileInfo', trFlowFileInfo);
    setVisible('areaOfficeDoc',trOfficeDoc);
    if (index == 0)
    { 
        setDesc('areaFlowFileInfo');
        setDesc('areaLookInfo');
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