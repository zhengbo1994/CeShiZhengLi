
//当所属公司发生改变
 var selectChange=function()
{
   var varCompany=$("#ddlCompany").val();    
   $('#jqGrid1').getGridParam('postData').CorpID=varCompany;      
   window.reloadData();
}

//重新加载表格
function reloadData()
{      
   refreshJQGrid('jqGrid1'); 
}

function addGroup()
{   
    var sID=$('#hidStationID').val();    
    openAddWindow('VStationGroupAdd.aspx?JQID=jqGrid1&ID='+sID,800,600);
}

function delGroup()
{
    
}

//验证数据合法性。
//并在数据合法的情况下，将被选中的数据存入隐藏域
function validateSize()
{
    var ids=getJQGridSelectedRowsID('jqGrid1', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    $('#hidGroupIDS').val(ids.join(','));
    return true;
}
