// JScript 文件

function reloadData() {
    if (loadJQGrid("jqGrid1", {})) {
        $('#jqGrid1').trigger('reloadGrid');
    }
}


function showIndexTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 2; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";


    if (index == "1") {
        reloadData();
        $('#hdIsLoad').val("Y");
    }

    //if (index == "0") {
    //    $("#btnSave").show();
    //}
    //else {
    //    $("#btnSave").hide();
    //}
}

//新建
function btnAdd_Click() {
    openAddWindow("VProductAdd.aspx?projectID=" + $("#hiddProjectID").val(), 800, 450);
}

//修改
function btnEdit_Click() {
    openModifyWindow("VProductAdd.aspx?projectID=" + $("#hiddProjectID").val(), 800, 600, "jqGrid1");
}

//删除
function btnDelete_Click() {
    openDeleteWindow("Product", 7, "jqGrid1");
}

//查看
function renderLink(cellvalue, options, rowobject) {
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}


// 上传(队列中单个文件)完成事件
// fileRow为放置文件所在的表格行，其有rowIndex、filetitle、filename、filesize、thumbnailname等属性
// uploadID为控件的id，也即放置文件所在表格的id
function fileUploaded( fileRow, uploadID )
{
    trSinPic.style.display = "";
    getObj( "imgSinPic" ).src = "../../.." + fileRow.thumbnailname;
}

function fileDeleted(fileRow, uploadID) {
    trSinPic.style.display = "none";
}


function validateSize() {

    handleBtn(false);
    if (getObj("txtProjectName").value == "") {
        handleBtn(true);
        return alertMsg("项目名称不能为空。", getObj("txtProjectName"));
    }

    if (getObj("ddlProductType").value == "") {
        handleBtn(true);
        return alertMsg("产品类型不能为空。", getObj("ddlProductType"));
    }

    if (getObj("txtProjectNo").value == "") {
        handleBtn(true);
        return alertMsg("项目编号不能为空。", getObj("txtProjectNo"));
    }

    if (getObj("txtRowNo").value == "") {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }

    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    if (getObj("ddlProjectState").value == "") {
        handleBtn(true);
        return alertMsg("项目状态不能为空。", getObj("ddlProjectState"));
    }

    //自定义字段可否输入
    //    if (!validateAuto())
    //    {
    //        return false;
    //    }

    // 将操作信息写入 隐藏控件
    $('#hdParentProjectID').val($("#ddlParentProject").val());

    return true;
}


function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}