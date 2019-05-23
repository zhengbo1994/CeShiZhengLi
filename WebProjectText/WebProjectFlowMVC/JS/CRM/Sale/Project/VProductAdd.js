// JScript 文件


// 隐藏按钮
//function btnAddHidden() {
//    $("#btnAdd").hide();
//}
//function btnEditHidden() {
//    $("#btnEdit").hide();
//}

//新建
function btnAdd_Click()
{
    openAddWindow("SaleAdd.aspx", 800, 600);
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VProjectEdit.aspx", 800, 600, "jqProjectInfo");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("DeleteProject", 1, "jqProjectInfo");
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var ProjectName = $("#txtKey").val();

    $('#jqProjectInfo', document).getGridParam('postData').ProjectName = ProjectName;
    refreshJQGrid('jqProjectInfo');
}

function validateSize()
{
    var rowNo = getObj("txtRowNo").value;
    if (getObj("ddlICID").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("ddlICID"));
    }
    if (getObj("txtIndexNo").value == "")
    {
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

    if (!isPositiveInt(rowNo))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}


