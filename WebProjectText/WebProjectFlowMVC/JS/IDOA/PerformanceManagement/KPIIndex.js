// JScript 文件


//新建
function btnAdd_Click()
{
    openAddWindow("VKPIIndexAdd.aspx?ICID=" + $("#ddlClass").val() + "&BSID=" + $("#ddlBSID").val(), 400, 450, "jqKPIIndex");
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VKPIIndexEdit.aspx", 400, 450, "jqKPIIndex");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("KPIIndex", 1, "jqKPIIndex");
}

//查看
function renderLink(cellvalue,options,rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID="+ rowobject[0] + "'" ;
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>' ;
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
	var ICID=$("#ddlClass").val();
	var IndexType=$("#ddlIndexType").val();
	var vKey=$("#txtKey").val();
	var IndexCycle=$("#ddlIndexCycle").val();
    var BSID=$("#ddlBSID").val();
    
    $('#jqKPIIndex',document).getGridParam('postData').ICID=ICID; 
    $('#jqKPIIndex',document).getGridParam('postData').IndexType=IndexType; 
    $('#jqKPIIndex',document).getGridParam('postData').SearchText=vKey; 
    $('#jqKPIIndex',document).getGridParam('postData').IndexCycle=IndexCycle; 
    $('#jqKPIIndex',document).getGridParam('postData').BSID=BSID; 
    refreshJQGrid('jqKPIIndex');
}

function validateSize()
{ 
    var rowNo = getObj("txtRowNo").value;
    if (getObj("ddlICID").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("ddlICID"));
    }
    if (getObj("txtIndexNo").value == "") {
        return alertMsg("指标编号不能为空。", getObj("txtIndexNo"));
    }
    if (getObj("txtIndexName").value == "")
    {
        return alertMsg("指标名称不能为空。", getObj("txtIndexName"));
    }
    if (getObj("ddlIndexType").value == "")
    {
        return alertMsg("指标类型不能为空。", getObj("ddlIndexType"));
    }
    if (getObj("ddlIndexCycle").value == "")
    {
        return alertMsg("指标周期不能为空。", getObj("ddlIndexCycle"));
    }
//    if (getObj("ddlBSID").value == "")
//    {
//        return alertMsg("基础部门不能为空。", getObj("ddlBSID"));
//    }
        
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