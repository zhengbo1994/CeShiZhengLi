// JScript 文件

//新建
function btnAdd_Click()
{
    openAddWindow("VBehaviorIndexClassAdd.aspx", 400, 250, "jqBehaviorIndexClass");
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VBehaviorIndexClassEdit.aspx", 400, 250, "jqBehaviorIndexClass");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("BehaviorIndexClass", 1, "jqBehaviorIndexClass");
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var vKey=$("#txtKey").val();
        
    $('#jqBehaviorIndexClass',document).getGridParam('postData').SearchText=vKey; 
    refreshJQGrid('jqBehaviorIndexClass');
}

function validateSize()
{ 
    var rowNo = getObj("txtRowNo").value;
    if (getObj("txtBICName").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("txtBICName"));
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