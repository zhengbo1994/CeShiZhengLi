// JScript 文件


//新建
function btnAdd_Click()
{
    openAddWindow("VKPIIndexClassAdd.aspx", 400, 250, "jqKPIIndexClass");
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VKPIIndexClassEdit.aspx", 400, 250, "jqKPIIndexClass");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("KPIIndexClass", 1, "jqKPIIndexClass");
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var vKey=$("#txtKey").val();
        
    $('#jqKPIIndexClass',document).getGridParam('postData').SearchText=vKey; 
    refreshJQGrid('jqKPIIndexClass');
}

function validateSize()
{ 
    var rowNo = getObj("txtRowNo").value;
    if (getObj("txtICName").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("txtICName"));
    }
    if (rowNo == "")
    {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    
    if(!isPositiveInt(rowNo))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}