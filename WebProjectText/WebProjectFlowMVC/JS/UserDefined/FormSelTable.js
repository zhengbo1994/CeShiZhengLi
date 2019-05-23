
// JScript 文件
//搜索
var filterData=function()
{   
    var Key=getObj("txtKW").value;
    addParamsForJQGridQuery("jqGrid1",[{Key:Key}]);
    refreshJQGrid("jqGrid1");    
}
function addFormSelTable()
{
    openAddWindow("VFormSelTableAdd.aspx", 600, 350, "jqGrid1");
}

function editFormSelTable()
{
    openModifyWindow("VFormSelTableEdit.aspx", 600, 350, "jqGrid1")
}

function delFormSelTable()
{
    openDeleteWindow("FormSelTable", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtTableTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("表单名称不能为空。", getObj("txtTableTitle"));
    }
    getObj("hidTableName").value=getObj("ddlTableName").value;
    getObj("hidValueColName").value=getObj("ddlValueColName").value;
    getObj("hidTextColName").value=getObj("ddlTextColName").value;
    if (getObj("ddlTableName").value == "")
    {
        handleBtn(true);
        return alertMsg("表\视图名称不能为空。", getObj("txtRowNo"));
    }
    if (getObj("ddlValueColName").value == "")
    {
        handleBtn(true);
        return alertMsg("值列名称不能为空。", getObj("txtRowNo"));
    }
    if (getObj("ddlTextColName").value == "")
    {
        handleBtn(true);
        return alertMsg("文本列名称不能为空。", getObj("txtRowNo"));
    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if(getObj("txtWhereString").value.length>0)
    {
        if(getObj("txtWhereString").value.indexOf("where")>-1)
        {
           handleBtn(true);
           return alertMsg("条件语句不能包含where字符。", getObj("txtWhereString"));
        }
    }
    if(getObj("txtOrderByString").value.length>0)
    {
        if(getObj("txtOrderByString").value.indexOf("order by")>-1)
        {
           handleBtn(true);
           return alertMsg("排序语句不能包含order by字符。", getObj("txtOrderByString"));
        }
    }
    
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function openFormSelTableCols(ID)
{
    openWindow("VFormSelTableCols.aspx?JQID=jqGrid1&ID="+ID,800,600);
}
//数据库更改
var dbchange=function()
{
    var dbName=getObj("ddlDBName").value;
     ajaxRequest(
            window.location.href, 
            {"action" : "BindItem", DBName : dbName}, 
            "json", 
            function(data){
                if(data != null)
                {
                    setDgData(data)
                }            
            },false
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
    for(var i=0;i<getObj("ddlTableName").length;i++)
    {
        if(getObj("ddlTableName").options[i].value==getObj("hidTableName").value)
        {
            getObj("ddlTableName").selectedIndex=i;
            break;
        }
    }
    tablechange();
    
}
//表的更改
var tablechange=function()
{
    var tableName=getObj("ddlTableName").value;
    var dbName=getObj("ddlDBName").value;
     ajaxRequest(
            window.location.href, 
            {"action" : "BindColItem", DBName : dbName,TableName : tableName}, 
            "json", 
            function(data){
                if(data != null)
                {
                    setTableData(data)
                }            
            },false
        );     
       
}
function setTableData(data)
{     
    var ddlValueColName = getObj("ddlValueColName");
     var ddlTextColName = getObj("ddlTextColName");
    for (var i = ddlValueColName.length - 1; i >= 0; i--)
    {
        ddlValueColName.remove(i);
        ddlTextColName.remove(i);
    }    
    var opt = document.createElement("OPTION");
    if (data.length > 0)
    {
        for (var i = 0; i < data.length; i++)
        {  
            var opt = document.createElement("OPTION");
            opt.value = data[i].name;
            opt.text = data[i].name;
            ddlValueColName.add(opt, ddlValueColName.length);
            opt = document.createElement("OPTION");
            opt.value = data[i].name;
            opt.text = data[i].name;
            ddlTextColName.add(opt, ddlTextColName.length);
        }
    }
    for(var i=0;i<ddlValueColName.length;i++)
    {
        if(ddlValueColName.options[i].value==getObj("hidValueColName").value)
        {
            ddlValueColName.selectedIndex=i;
            break;
        }
    }
    for(var i=0;i<ddlTextColName.length;i++)
    {
        if(ddlTextColName.options[i].value==getObj("hidTextColName").value)
        {
            ddlTextColName.selectedIndex=i;
            break;
        }
    }   
}


function showInfo(index)
{
    selectTab(index,"TabInfo");
    
    for (var i = 0; i < 2; i++)
    {
        getObj("divInfo" + i).style.display = "none";
    }
    getObj("divInfo" + index).style.display = "block";
    if(index==1)
    {
        if(loadJQGrid('jqGrid1',{strWhere:getObj("txtWhere").value,strOrder:getObj("txtOrder").value,ValueColName:getObj("txtValue").value,DBName:getObj("txtBName").value,TextColName:getObj("txtText").value,TableName:getObj("txtTable").value}))
        {
            refreshJQGrid('jqGrid1');
        }
    }
    
}