// JScript 文件
function btnAdd_Click()
{
    if (getObj("hidSelID").value=="All")
    {
        return alertMsg("请选择左边流程类别目录。");
    }
    if (getObjF("Main","ddlFlowModel").value=="")
    {
        return alertMsg("请选择流程模块");
    }
    openAddWindow("VFlowModelFilterAdd.aspx?FMID="+getObjF("Main","ddlFlowModel").value+"&FTID="+getObj("hidSelID").value, 400, 250, "jqGrid1","Main");
}

function btnEdit_Click()
{
   openModifyWindow("VFlowModelFilterEdit.aspx", 400, 250, "jqGrid1","Main")
}

function btnDelete_Click()
{
    openDeleteWindow("Form", 0, "jqGrid1","Main");
}

function btnExport_Click()
{    
    getObjF("Main","btnExport").click();
}

function ValidateSize()
{
    if(getObj("txtFormTitle").value == "")
    {
        return alertMsg("表单名不能为空");
    }
    if(getObj("ddlFormType").value == "")
    {
        return alertMsg("表单类型不能为空");
    }
  
    return true;
}

function RenderLink(cellvalue,options,rowobject)
{
      var row=options.rowId;//获取ID
      return '<a href="javascript:openModFile(\''+row+'\');"><font size="-2">设置</font></a>';
}

function RenderLinkOpe(cellvalue,options,rowobject)
{
      var row=options.rowId;//获取ID
      return '<a href="javascript:openModFile(\''+row+'\');"><font size="-2">启用</font></a>&nbsp&nbsp<a href="javascript:openModFile(\''+row+'\');"><font size="-2">停用</font></a> ';
}

//统计
function Stat(cellvalue,options,rowobject)
{
    var row=options.rowId;//获取ID
    return '<a href="javascript:openStat(\''+row+'\');"><font size="-2">统计</font></a>';
}

function openStat(ID)
{
    openWindow("VFlowModelFilterStat.aspx?ID="+ID,800,600);
}

function openModFile(ID)
{
    openWindow("VFlowModelFilterColumn.aspx?JQID=jqGrid1&ID="+ID,1100,768);
}

function openModHtml()
{
    openWindow("VCustomFormHtml.aspx?JQID=jqGrid1&ID="+$('#hidID').val(), window.screen.availWidth,window.screen.availHeight);
}

function setDisplay()
{
  
    var colType = $('#ddlOperType').val();
    if(colType=="6")
    {
         $("#trLength").hide();
         $("#trTable").show();
         $("#trwhere").show();
         $("#trSignle").show();
         $("#trshow").show();
         $("#trvalue").show();
        
    }
    else
    {
       $("#trTable").hide();
         $("#trwhere").hide();
         $("#trSignle").hide();
         $("#trshow").hide();
         $("#trvalue").hide();
       if(colType=="0")
       {
           $("#trLength").show();
       }
       else
       {
        $("#trLength").hide();
       }       
    }   
}

function addField()
{
    openAddWindow("VCustomFormFieldAdd.aspx?ID="+$('#hidID').val(), 500, 190, "jqGrid1");
}

function editField()
{
    openModifyWindow("VCustomFormFieldEdit.aspx?tableid="+$('#hidID').val(), 500, 190, "jqGrid1")
}

function delField()
{
    openDeleteWindow("UserFormField", 0, "jqGrid1");
}
function ValidateAddFieldSize()
{
    if($("#txtFieldTitle")[0].value == "")
    {
        alert("列名不能为空");
        return false;
    }
  
    return true;
}

/* 刷新jqGrid */
function reloadData()
{
//    var radio=getObj("rdoChild").getElementsByTagName("input")[1];

//    var name=radio.name;
//    alert(getObj(name).value);
    $('#jqGrid1').getGridParam('postData').FMID = getObj("ddlFlowModel").value;
    $('#jqGrid1').getGridParam('postData').KeyWord = getObj("txtKW").value;
    $('#jqGrid1').getGridParam('postData').FTID = getObjP("hidSelID").value;
    if(getObj("rdoChild").getElementsByTagName("input")[0].checked)
    {
        $('#jqGrid1').getGridParam('postData').Child ="Y";
    }else{
        $('#jqGrid1').getGridParam('postData').Child ='N';
    }
    $('#jqGrid1').trigger('reloadGrid');
}

function RefreshDraftingWizardIndex(dwiID, parentDWIID, outLine)
{
    getObj("hidSelID").value = dwiID;
    getObj("hidSelParentID").value = parentDWIID;
    getObj("hidOutLine").value = outLine;
     window.frames("Main").window.reloadData();
}

///改变被选中的节点样式 
 function ChangeBackColor(span)
{
    var obj=document.getElementsByName("DWIName");
    for(i = 0; i <obj.length; i++)
    {
         obj(i).className='normalNode';
    }
     span.className = "selNode";
}

function btnMove_Click()
{
    var dwids = window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true,"FormID");
     if (dwids == "" || dwids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    if (dwids.length > 50)
    {
        return alertMsg("您一次最多只能移动50条记录。");
    }
    
    openWindow("VFlowModelFilterMove.aspx?JQID=jqGrid1&FormID="+dwids.join(","), 300, 150)    
}

function ValidateMove()
{
    if($("#ddlIndex").val() == "")
    {
        return alertMsg("请选择二级目录。");
    }
  
    return true;
}
