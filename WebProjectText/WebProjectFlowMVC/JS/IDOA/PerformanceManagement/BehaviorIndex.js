// JScript 文件

//新建
function btnAdd_Click()
{
    openAddWindow("VBehaviorIndexAdd.aspx?BICID=" + $("#ddlClass").val(), 400, 300, "jqBehaviorIndex");
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VBehaviorIndexEdit.aspx", 400, 300, "jqBehaviorIndex");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("BehaviorIndex", 1, "jqBehaviorIndex");
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var BICID = getObj("ddlClass").value;
    var vKey=$("#txtKey").val();
    
    $('#jqBehaviorIndex',document).getGridParam('postData').BICID=BICID;
    $('#jqBehaviorIndex',document).getGridParam('postData').SearchText=vKey; 
    refreshJQGrid('jqBehaviorIndex');
}


function validateSize()
{ 
    var rowNo = getObj("txtRowNo").value;
    if (getObj("ddlClass").value == "")
    {
        return alertMsg("指标类别不能为空。", getObj("ddlClass"));
    }
    if (getObj("txtBIName").value == "")
    {
        return alertMsg("指标名称不能为空。", getObj("txtBIName"));
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