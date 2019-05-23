// JScript 文件

/* 刷新jqGrid */
function reloadData()
{

    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').trigger('reloadGrid');
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}

function resetCorp()
{
    ajaxRequest('VCheckStaticTypeAdd.aspx',{AjaxGetRowNo:'true',AjaxCorpID:$('#ddlCorp').val()},'json',function (data, textStatus){loadRowNo(data);},false);
}

function loadRowNo(data)
{
    $('#txtRowNo').val(data);
}

function btnAdd_Click()
{
    if($('#ddlCorp').val()=="")
    {
       alertMsg("请选择公司。", getObj("ddlCorp")); 
    }    
    openAddWindow("VCheckStaticTypeAdd.aspx?CorpID="+$('#ddlCorp').val(), 500, 400, "jqGrid1");
}

//修改类别
function btnEdit_Click()
{
    openModifyWindow("VCheckStaticTypeEdit.aspx", 500, 400, "jqGrid1")
}

function btnDelete_Click()
{
    openDeleteWindow("CheckStaticType", 0, "jqGrid1");
}

function validateSize()
{
    if($('#ddlCorp').val()=="")
    {
      return alertMsg("请选择公司。", getObj('ddlCorp')); 
    }    
    
     if($('#txtCSTName').val()=="")
    {
      return alertMsg("分类名称不能为空。", getObj('txtCSTName')); 
    }  
    
    if(!isPositiveInt(getObj('txtRowNo').value)) 
    {
        return alertMsg("行号必须为整数。", getObj("txtRowNo")); 
        txtRowNo.select();
    }

    return true;
}

// 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Setting":
            AddFlow();
            break;
        case "Export":
            ajaxExport(location.href, 'jqGrid1');
            break;    
    }
}

function AddFlow()
{
    openModifyWindow("VCheckStaticTypeList.aspx?CorpID="+$('#ddlCorp').val(), 900, 600, "jqGrid1")
}

