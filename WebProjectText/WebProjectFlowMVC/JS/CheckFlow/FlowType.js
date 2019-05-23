// JScript 文件

function addFlowModel()
{
    openAddWindow("VFlowTypeAdd.aspx?CorpID="+$('#ddlCorp').val()+"&FMID="+$('#ddlFlowModel').val(), 650, 450, "jqGrid1");
}

function editFlowModel()
{
    openModifyWindow("VFlowTypeEdit.aspx", 650, 450, "jqGrid1")
}

function delFlowModel()
{
    openDeleteWindow("FlowType", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
      if (getObj("ddlFlowType").value == "")
    {
        handleBtn(true);
        return alertMsg("所属流程类别不能为空。", getObj("ddlFlowID"));
    }
    if (getObj("txtFlowName").value == "")
    {
        handleBtn(true);
        return alertMsg("流程类别的名称不能为空。", getObj("txtFlowName"));
    }
    if (getObj("txtFlowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("流程类别的编号不能为空。", getObj("txtFlowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg('行号必须为正整数。', getObj('txtRowNo'));
    }

    if (!isPositiveIntAnd0(getObj("txtMaxReturnCount").value))
    {
        handleBtn(true);
        return alertMsg('最大打回次数必须为整数。', getObj('txtMaxReturnCount'));
    }

    $('#hidRight').val($("input[name='right'][checked=true]").val());
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

var selectChange=function()
{
   var corpId=$("#ddlCorp").val(); 
   var flowId=$("#ddlFlowModel").val();
   var params=[{CorpID:corpId},{FMID:flowId}];
   addParamsForJQGridQuery('jqGrid1',params);    
   refreshJQGrid('jqGrid1');   
}

function allowRight()
{
  
    var right=$('#rblAllowType input[checked]').val();
    if(right=='2')
    {
       $('#trrightaccount').show();
       $('#trrightdept').show();
        $('#trrightPostion').show();
       
    }
    else
    {
       $('#trrightaccount').hide();
       $('#trrightdept').hide();
        $('#trrightPostion').hide();
    }
}

function btnSelectLookStation_Click(action,StationID,Station)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+action+'&CorpID=' + getObj("ddlCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj(StationID).value = vValue.split('|')[0];
        getObj(Station).value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click(action,DeptID,Dept)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+action+'&CorpID=' + getObj("ddlCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj(DeptID).value = vValue.split('|')[0];
        getObj(Dept).value = vValue.split('|')[1];
    }
}

function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function refreshAfterDelete()
{
    getObj("hidSelID").value = "";
    getObj("hidSelParentID").value = "";
    window.location = window.location;
}   

function RefreshFlowType(flowtypeID, parentFlowTypeID, outLine)
{
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;
    if(frameIsReady("Main"))
    {
        window.frames("Main").location = "VFlowTypeMain.aspx?FlowTypeID=" + flowtypeID;
    }
}

///改变被选中的节点样式 
 function ChangeBackColor(span)
{
    var obj=document.getElementsByName("FlowTypeName");
    for(i = 0; i <obj.length; i++)
    {
         obj(i).className='normalNode';
    }
     span.className = "selNode";
}

function setFlowType(aim) 
{
    
    var cnt = parseInt($("#hidNodesCount").val(), 10);
    var corpID = $("#ddlCorp").val();
    var flowtypeID = "TotalFlowType";
    if (aim == "Edit" || aim == "Delete")
    {
        if (cnt == 0 || getObj("hidSelID").value == "")
        {
            return alertMsg("请选择一个流程类别！"); 
        }
        else
        {
            flowtypeID = getObj("hidSelID").value;
        }
        
        if (aim == "Edit")
        {
            var url = "VFlowTypeEdit.aspx?FlowTypeID=" + flowtypeID;
            openWindow(url,500,500); 
        }
        else if (aim == "Delete")
        {            
           openDelete(flowtypeID);   
        }
    }
    else if (aim == "AddFriend" || aim == "AddSon")
    {
        if (cnt > 0)
        {
            if (getObj("hidSelID").value == "")
            {
                return alertMsg("请选择一个目录。");  
            }
            
            if (aim == "AddFriend")
            {
                flowtypeID = getObj("hidSelParentID").value;
            }
            else if (aim == "AddSon")
            {
                if (getObj("hidOutLine").value.split('.').length > 3)
                {
                    return alertMsg("最多只能建四级目录。");
                }
                
                flowtypeID = getObj("hidSelID").value;
            }
        }
       var url =  "VFlowTypeAdd.aspx?Action="+aim+"&FlowTypeID=" + flowtypeID+"&CorpID="+corpID;
        openWindow(url,500,500); 
    }
}

function openDelete(flowtypeID)
{
    var url = "/" + rootUrl + "/Common/Delete/VDeletePlatform.aspx?Action=FlowType&JQID=&NoFrame=true&ID=" + flowtypeID;    
    var width = 320;
    var height = 202;
    if (ieVersion >= 7)
    {
        height = 154;
    }
    var left = (screen.width - width)/2;
    var top = (screen.height - height)/2;
    	
	window.showModalDialog(url, window, 'dialogtop=' + top + 'px;dialogleft=' + left + 'px;dialogWidth=' + width + 'px;dialogHeight=' + height + 'px;status=1;resizable=0;scroll=0;scrollbars=0'); 
}

function clearAll()
{
   var form=document.forms[0]; 
   form.reset();
}

  function btnAddPostion()
{
  
    var rValue=openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID='+$('#hidRightPostionID').val()+"&PostionName="+escape($('#txtRightPostion').val()),800,600);
    if (rValue != "undefined" && rValue != null)
    {
       $('#hidRightPostionID').val(rValue.split('|')[0]);
       $('#txtRightPostion').val(rValue.split('|')[1]);
           return true;
    }
    else
    {
       return false;
    }
}
