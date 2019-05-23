//js文件


///增删改 （"jqGrid"为jqGrid的id）

//新增跳转页面
function add() {
    openAddWindow("Employee_Add.aspx", 400, 300, "jqGrid"); 
}

//修改跳转页面
function update() {
    openModifyWindow("Employee_Edit.aspx", 400, 300, "jqGrid");
}

//删除（Employee_TrueDel(删除页面的cs文件的方法)  33（33模块的删除页面））
function del() {
    openDeleteWindow("Employee_TrueDel", 33, "jqGrid");
}
function ddlSex_Change() {
    reloadData();

}

//重新加载数据
function reloadData() {
    var EmployeeName = $("#txtEmployeeName").val();
    var Sex = $("#ddlSex").val();


    //var startDate = "";
    //var endDate = "";
    //if (getObj("txtStartDate").text != "")
    //    startDate = $("#txtStartDate").val();
    //if (getObj("txtEndDate").text != "")
    //    endDate = $("#txtEndDate").val();

    //if (startDate != "" && endDate != "" && compareDate(startDate, endDate) == -1) {
    //    return alertMsg("结束时间必须大于开始时间。", getObj("txtEndDate"));
    //}

    $("#jqGrid").getGridParam("postData").EmployeeName = EmployeeName;
    $("#jqGrid").getGridParam("postData").Sex = Sex;


    //$("#jqGrid").getGridParam("postData").StartDate = startDate;
    //$("#jqGrid").getGridParam("postData").EndDate = endDate;

    refreshJQGrid("jqGrid");
    
}

//验证数值
function validateSize() {
    if (getObj("txtEmployeeName").value == "") {
        return alertMsg("员工姓名不能为空。", getObj("txtEmployeeName"));
    }
    return true;
}



//获取当前对象
$.fn.GetTableObj = function (tableid) {
 if (tableid === "TBEmployee") {
     if (tbEmployeeobj) {
         return tbEmployeeobj;
        }
    }
}


//明细数据加载后处理
function tbEmployeeobj_AfterTRDataInit(tr) {
    var table = $(tr).parent().parent();
    var trobj = $(tr);
    trobj.addClass(trobj.index() % 2 == 0 ? " dg_row" : " dg_alrow");
}