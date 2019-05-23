// VSelectCheckDescription.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-06-02

function finishSelect()
{
    if (window.opener != null)
    {
        var txtCheckDescription = getObjO("txtCheckDescription");
        if (txtCheckDescription != null)
        {
            var vValue = getJQGridSelectedRowsData("jqgPersonalCheckDescription",true,'CheckDescription');
            if (txtCheckDescription.value != "")
            {
                txtCheckDescription.value += "；\n";
            }
            txtCheckDescription.value += $.jgrid.stripHtml(vValue.join("；\n"));
        }
    }
    
    window.close();
}

function addPersonalCheckDescription()
{
    openAddWindow("VPersonalCheckDescriptionAdd.aspx", 550, 250, "jqgPersonalCheckDescription");
}

function editPersonalCheckDescription()
{
    openModifyWindow("VPersonalCheckDescriptionEdit.aspx", 550, 250, "jqgPersonalCheckDescription")
}

function delPersonalCheckDescription() {
    var IsDel = true;
    //如果存在常用意见则提示不能删除
    $("#jqgPersonalCheckDescription tr").each(function () {
        if ($(this).find("td:eq(1)").find(":checkbox").attr("checked") == true && $(this).find("td:eq(6)").get(0).title == "N") {
            IsDel = false;
            return;
        }

    });
    if (IsDel == false) {
        alert("常用意见不能删除");
        return;
    }
    openDeleteWindow("PersonalCheckDescription", 0, "jqgPersonalCheckDescription");
}

function ddlCType_Change(jqgid)
{    
    $(jqgid,document).getGridParam('postData').CType=getObj("ddlCType").value;
    
    reloadData(jqgid);
}

function btnSearch_Click(jqgid)
{
    var vKey=$("#txtKey").val();
    
    $(jqgid,document).getGridParam('postData').KeyValue=vKey;
    
    reloadData(jqgid);
}

function reloadData(jqgid)
{
    var reg=new RegExp("#","g"); //创建正则RegExp对象
    refreshJQGrid(jqgid.replace(reg,""));
}

function validateSize()
{
    if (getObj("txtRemark").value == "")
    {
        return alertMsg("审核内容不能为空。", getObj("txtRemark"));
    }
    
    return true;
}