//changcx
//JS 文件

//加载数据
function reloadData() {
    var jqObj = $('#jqSaleBeforeFiles', document);
    var projectID = $('#ddlProject').val();
    jqObj.getGridParam("postData").ProjectID = projectID;
    jqObj.getGridParam("postData").txtSearch = $('#txtSearch').val();

    if (projectID != null) {
        refreshJQGrid("jqSaleBeforeFiles");

    }
    else {
        alert('请选择公司下的项目！');
    }
}
//搜索
function btnSearch_Click() {
    var search = $("#txtSearch").val();
    if ($("#ddlProject").val().length != 36) {
        alert('请选择项目！');
    }
    else {
        reloadData();
    }
   
}
//新增
function Add() {
    openAddWindow("VSaleBeforeFileAdd.aspx?projID=" + $("#ddlProject").val(), 800,450);
}
//修改
function Edit() {
    var SaleDid = getJQGridSelectedRowsID("jqSaleBeforeFiles", true);
    if (null == SaleDid || SaleDid.length == 0) {
        alert('请选择要修改的对象！'); return false;
    }
    else if (SaleDid.length > 1) {
        alert('请选择一个对象！'); return false;
    }
    else {
        var url = "VSaleBeforeFileEdit.aspx?SaleDid=" + SaleDid;
        openWindow(url, 800, 450);
    }
 }
//删除
function Delete() {
    var SaleDid = getJQGridSelectedRowsID("jqSaleBeforeFiles", true);
    if (null == SaleDid || SaleDid.length == 0) {
        alert('请选择要删除的对象！'); return false;
    }
    var url = "VSaleBeforeFileDel.aspx?SaleDid={0}";
    url = stringFormat(url, SaleDid.join(','));
    openModalWindow(url, 300, 200);
}
function SearchKeyDown() {
    if (window.event.keyCode == 13) {
        btnSearch_Click();
    }
}