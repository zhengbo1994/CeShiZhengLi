//修改或新增员工
function setEmploy(type) {
        if (type == "Add") {
            openWindow("/" + rootUrl + "/Demo/xj/EmployListEdit.aspx?APNO=0&action=" + type, 500, 500);
        } else {
            var ids = getJQGridSelectedRowsData("jqGrid1", true, 'EmployeeID');

            //var ids = getJQGridSelectedRowsID('jqGrid1', checkJQGridEnableMultiSel('jqGrid1'));
            if (ids.length > 0) {
                if (ids.length > 1) {
                    return alertMsg("您一次只能操作一条记录。")
                }
                var employId = ids[0];
                openWindow("/" + rootUrl + "/Demo/xj/EmployListEdit.aspx?APNO=1&action=" + type + "&employId=" + employId, 500, 500);
            } else {
                alert("请选择一个员工！");
            }
            
        }

}

//删除员工
function Delete() {
    //var width = 320;
    //var height = 202;
    //if (ieVersion >= 7) {
    //    height = 154;
    //}
    //var left = (screen.width - width) / 2;
    //var top = (screen.height - height) / 2;
    ////var ids = getJQGridSelectedRowsID('jqGrid1', checkJQGridEnableMultiSel('jqGrid1'));
    var ids = getJQGridSelectedRowsData("jqGrid1", true, 'EmployeeID');
    //if (ids.length > 0) {
    //    //var employId = ids[0];
    //    window.showModalDialog("/" + rootUrl + "/Demo/xj/TEmployDemoDelete.aspx?ID=" + ids, window, 'dialogtop=' + top + 'px;dialogleft=' + left + 'px;dialogWidth=' + width + 'px;dialogHeight=' + height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    //} else {
    //    alert("请选择一个员工！");
    //}
    openDeleteWindow("DemoEmploy", 1, "jqGrid1", null, { ID: ids }, true);
    
}

//ajax请求
function Temp() {
    ajax(
        "EmployList1.aspx",
        { "demo": "成功" }, "json",
        function (data,textstatus) {

            alert(data.Data);
    })
}

/* 刷新jqGrid1 */
function reloadData() {
    var querydata = { "EmployName": $("#txtEmployName").val(), "Man": $("#chkMan:checked").val(), "Famale": $("#chkFamale:checked").val(), "StrKey": $("#txtKW").val() };
    addParamsForJQGridQuery("jqGrid1",[querydata])
        refreshJQGrid("jqGrid1");
}
function Inputvalidate() {
    if (getObj("txtEmployNo").value == "") {
        return alertMsg("员工编号不能为空。", getObj("txtEmployNo"));
    }
    if (getObj("txtEmployName").value == "") {
        return alertMsg("员工姓名不能为空。", getObj("txtEmployName"));
    }
    return true;
}
//格式化列
function CellFormatter(cellvalue, options, rowobject) {
    return "<a  href='#'>" + cellvalue + "</a>";
}

function SexFormatter(cellvalue, options, rowobject) {
    if (cellvalue=="F") {

        return "<a  href='#'>女</a>";
    } else {
        return "<a  href='#'>男</a>";
    }
}

//点击下拉按钮
function clickMenu(key) {
    
    var path = window.document.URL;
    var url=path.substring(0, path.lastIndexOf('/'));

    switch(key){
        case "Controls":
            openWindow(url + "/DemoControls.aspx", 800, 600)
            break;
        case "AJAX":
            Temp();
            break;
        case "Export":
            ajaxExport(document.URL, 'jqGrid1');
            break;
        default:
            break;
    }    

}