// JScript 文件
function addPosition()
{
    openAddWindow("VUserFormAdd.aspx?CorpID="+getObj("ddlCorp").value+"&FMID="+getObj("ddlFlowModel").value, 500, 280, "jqGrid1");
}

function editPosition()
{
    openModifyWindow("VUserFormEdit.aspx", 500, 280, "jqGrid1")
}
function FillPosition()
{
    openModifyWindow("VUserFormList.aspx", 500, 280, "jqGrid1")
}
function delPosition()
{
    openDeleteWindow("UserTable", 0, "jqGrid1");
}
function ValidateSize()
{
    if($("#txtTableTitle")[0].value == "")
    {
        alert("表名不能为空");
        return false;
    }
  
    return true;
}
function RenderLink(cellvalue,options,rowobject)
{
      var row=options.rowId;//获取ID
      return '<div class="nowrap"><a href="javascript:openModFile(\''+row+'\');">设置</a>';
}
function openModFile(ID)
{
    openWindow("VUserFormField.aspx?JQID=jqGrid1&ID="+ID, 800,600);
}

  function setDisplay()
{

    if(getParamValue('RestrictDataType') && getParamValue('RestrictDataType') == '0' )
    {
        getObj('ddlOperType').options.length=2;
        getObj('ddlShowType').options.length=1;
    }
  
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
    var url = 'VUserFormFieldAdd.aspx?ID='+$('#hidID').val();
    if(getParamValue('RestrictDataType'))
    {
        //限制只能是文本型
        url += '&RestrictDataType=0';
    }
    openAddWindow(url, 500, 380, "jqGrid1");
}

function editField()
{
    openModifyWindow("VUserFormFieldEdit.aspx", 500, 380, "jqGrid1")
}

function delField()
{
    openDeleteWindow("UserTableField", 0, "jqGrid1");
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

    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').getGridParam('postData').FMID = getObj("ddlFlowModel").value;
    $('#jqGrid1').getGridParam('postData').KeyWord = getObj("txtKW").value;
    $('#jqGrid1').trigger('reloadGrid');
}