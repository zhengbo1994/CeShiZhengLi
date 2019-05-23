
// JScript 文件

//系统菜单新增、修改、删除
function addFormSysTable()
{
    var FMID=getObj("ddlFlowModel").value;
    if(FMID=="")
    {
       return alertMsg("必须选择一个模块新增。", getObj("ddlFlowModel"));
    }
    openAddWindow("VFormSysTableAdd.aspx?FMID="+FMID, 500, 300, "jqGrid1");
}

function editFormSysTable()
{
    openModifyWindow("VFormSysTableEdit.aspx", 500, 300, "jqGrid1")
}

function delFormSysTable()
{
    openDeleteWindow("FormSysTable", 0, "jqGrid1");
}
//系统菜单新增修改验证
function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtTableTitle").value) == "")
    {
        handleBtn(true);
        return alertMsg("表单名称不能为空。", getObj("txtTableTitle"));
    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function openFormSysTableCols(ID)
{
    openWindow("VFormSysTableCols.aspx?JQID=jqGrid1&ID="+ID,800,600);
}
//系统菜单明细新增、修改、删除
function addFormSysTableSet()
{
    var SysID=getObj("SysID").value;
    var sourceDB=getObj("sourceDB").value;
    var sourceTable=getObj("sourceTable").value;
    
    openAddWindow("VFormSysTableSetAdd.aspx?SysID="+SysID+"&sourceDB="+sourceDB+"&sourceTable="+sourceTable, 500, 240, "jqGrid1");
}

function editFormSysTableSet()
{
    openModifyWindow("VFormSysTableSetEdit.aspx", 500, 240, "jqGrid1")
}

function delFormSysTableSet()
{
    openDeleteWindow("FormSysTableSet", 0, "jqGrid1");
}
//系统菜单明细新增修改验证
function validateSizeSet()
{
    if (trim(getObj("txtSDDTFName").value) == "")
    {
        handleBtn(true);
        return alertMsg("列标题不能为空。", getObj("txtSDDTFName"));
    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    return true;
}
//系统菜单明细新增时，列名称更改连动列数据类型
function changeType()
{
    var pType=getObj("ddlFieldValue").value;
  
    ajaxRequest(
        window.location.href, 
        {"action" : "LoadData", "pType" : pType} ,
        "text", 
        function(data){
            if(data != null)
            {
                getObj("txtFieldType").value=data;
                
            }            
        }
    ); 
}

//数据库更改
var dbchange=function()
{
    
    var dbName=getObj("ddlDBName").value;
    
     ajaxRequest(
            window.location.href, 
            {"action" : "BindItem", "DBName" : dbName}, 
            "json", 
            function(data){
               
                if(data != null)
                {  
                    setDgData(data)
                }            
            }
        );
      
}
function setDgData(data,status)
{   
    var ddlTableName = getObj("ddlTableName");
    for (var i = ddlTableName.length - 1; i >= 0; i--)
    {
        ddlTableName.remove(i);
    }    
    var opt = document.createElement("OPTION");
    if (data.length > 0)
    {
        for (var i = 0; i < data.length; i++)
        {  
            var opt = document.createElement("OPTION");
            opt.value = data[i].name;
            opt.text = data[i].name;
            ddlTableName.add(opt, ddlTableName.length);
        }
    }
    getObj("hidTableName").value=ddlTableName.value;
   
    
}
var tablechange=function()
{
    var tableName=getObj("ddlTableName").value;
    getObj("hidTableName").value=tableName;
}