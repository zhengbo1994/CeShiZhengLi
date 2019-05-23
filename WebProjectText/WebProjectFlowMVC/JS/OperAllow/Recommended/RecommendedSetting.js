//重新加载JQGrid
function reLoad() {
    if (loadJQGrid("jqGrid_Recommended", { KeyWord: $("#txtKey").val(), RecommendedType: $("#ddlRecommendedType").val() })) {
        refreshJQGrid("jqGrid_Recommended");
    }
}

//类型下拉框发生改变事件
function changeRecommendedType() {
    reLoad();
}

function addRecommended() {
    openWindow("VRecommendedAdd.aspx", 500, 400);
}

//新增菜单按钮
function addAPModel() {
    openWindow("VSelectAPModel.aspx", 350, 650);
}

//新增报表按钮
function addReport() {
    openWindow("VSelectReport.aspx", 800, 650);
}
//删除推荐
function deleteRecommended() {
    openDeleteWindow("Recommended", 0, "jqGrid_Recommended");
}
//编辑推荐
function editRecommended() {
    var TRID = getJQGridSelectedRowsData("jqGrid_Recommended", true, "TRID");
    var RecommendedType = getJQGridSelectedRowsData("jqGrid_Recommended", false, "RecommendedType").toString();
    RecommendedType = RecommendedType.substr(RecommendedType.indexOf(">") + 1, 2);
    if (TRID != "") {
        if (TRID.length == 1) {
            openWindow("VRecommendedEdit.aspx?RecommendedType=" + RecommendedType + "&TRID=" + TRID, 500, 400);
        }
        else {
            alert("一次只能修改一行数据。");
        }
    }
    else {
        alert("请选择需要修改的数据。");
    }
}

function showSmallIcons(cellvalue, options, rowobject) {
    var url = cellvalue;
    return stringFormat("<img src='{0}' width='20' height='20' onerror='imgError()' />", url);
}
function showIcons(cellvalue, options, rowobject) {
    var url = cellvalue;
    return stringFormat("<img src='{0}' width='20' height='20' onerror='imgError()' />", url);
}
function showLargeIcons(cellvalue, options, rowobject) {
    var url = cellvalue;
    return stringFormat("<img src='{0}' width='20' height='20' onerror='imgError()' />", url);
}
function showRecommendedName(cellvalue, options, rowobject) {
    var Url = rowobject[11];
    if (cellvalue == "")
        return cellvalue;
    else {
        return "<a href='javascript:void(0)' onclick='javascript:openWindow(\"" + Url + "\",900,700)'>" + cellvalue + "</a>";
    }
}
function showAliases(cellvalue, options, rowobject) {
    var Url = rowobject[10];
    var RecommendedUrl = rowobject[11];
    if (rowobject[3] == "")
        return "<a href='javascript:void(0)' onclick='javascript:openWindow(\"" + RecommendedUrl + "\",900,700)'>" + cellvalue + "</a>";
    else
        return "<a href='javascript:void(0)' onclick='javascript:openWindow(\"" + Url + "\",900,700)'>" + cellvalue + "</a>";
}
function showRecommendedType(cellvalue, options, rowobject) {
    var result = "";
    switch (cellvalue) {
        case "0":
            result = "菜单";
            break;
        case "1":
            result = "报表";
            break;
        case "2":
            result = "其它";
            break;
        default: break;
    }
    return result;
}
////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////

function checkData() {
    var re = /^-?\d+$/;
    var result = re.test($("#txtRecommendedSort").val());
    var isEmpty = true;
    if (!result) {
        alert("行号需为正整数。");
    }
    if ($("#txtAliases").val() === "") {
        isEmpty = false;
        alert("别名不允许为空。");
    }
    if ($("#txtRecommendedUrl").val() === "") {
        isEmpty = false;
        alert("自定义URL不允许为空。");
    }
    return result && isEmpty;
}
