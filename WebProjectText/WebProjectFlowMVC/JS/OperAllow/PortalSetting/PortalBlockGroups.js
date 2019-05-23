// JScript 文件
//***************************************************//
//
//文件名:PortalBlockGroups.js .js
//作者:翁化青
//时间:2012-05-10
//功能描述:门户内容块群JS操作
//
//*************************************************//
var filterData = function (jqID) {
    var protalType = getObj("ddlPortalType").value;
    var key = getObj("txtKW").value;
    addParamsForJQGridQuery(jqID, [{ ProtalType: protalType, Key: key}]);
    refreshJQGrid(jqID);
}

// 搜索内容块组
var reloadPortalBlockGroups = function () {
    filterData("jqPortalBlockGroups")
}


var renderName = function (value, pt, record) {
    var vUrl = "'VPortalBlockGroupsBrowse.aspx?ID=" + pt.rowId + "'";
    return '<a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',600,500)">' + value + '</a>';
}
//新增
var addPortalBlockGroups = function () {
    openAddWindow("VPortalBlockGroupsAdd.aspx?ProtalType=" + getObj("ddlPortalType").value, 600, 500, "jqPortalBlockGroups");
}

//修改
var editPortalBlockGroups = function () {
    openModifyWindow("VPortalBlockGroupsEdit.aspx", 600, 500, "jqPortalBlockGroups");
}

//删除
var deletePortalBlockGroups = function () {
    openDeleteWindow("PortalBlockGroups", 0, "jqPortalBlockGroups");
}


var validateSize = function () {
    if (getObj("ddlPortalType").value == "") {
        return alertMsg("类型不能为空。", getObj("ddlPortalType"));
    }
    if (getObj("txtPBGSName").value == "") {
        return alertMsg("内容块群名称不能为空。", getObj("txtPBGSName"));
    }
    if (getObj("txtRowNo").value == "") {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }

    var jsonDatas = [];
    for (var i = 1; i < tbItems.rows.length; i++) {
        var chk = getObjTC(tbItems, i, 0, "input", 0);
        var spnPBGName = getObjTC(tbItems, i, 1, "span", 0);
        var spnPBGIndex = getObjTC(tbItems, i, 2, "span", 0);     
        var spnRowNo = getObjTC(tbItems, i, 3, "span", 0);
      
        jsonDatas.push({
            "PBGID": chk.value,
            "PBGName": spnPBGName.innerHTML,
            "PBGIndex": spnPBGIndex.innerHTML,
            "RowNo": spnRowNo.innerHTML
        });
    }
    getObj("hidItems").value = $.jsonToString(jsonDatas);  
    return true;
}

// 初始化内容块组别表
function initialGroupTable() {
    arrDatas = $.stringToJSON($("#hidItems").val());
    addTableRowsByJson(tbItems, arrDatas);
}

// 设置内容块组
function setItems(table) {
    var ddlPortalType = getObj("ddlPortalType");
    var info = openModalWindow('VPortalBlockGroupSet.aspx?ProtalType=' + ddlPortalType.value + '&tbID=tbItems', 900, 600);
    if (typeof info != "object") {
        return false;
    }
    clearTableRow(table);
    addTableRowsByJson(table, info);
}
// 清空表
function clearTableRow(table) {
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

// 添加行
function addTableRowsByJson(table, json) {
    if (table.tagName != "TABLE" || !json) {
        return false;
    }

    for (var i = 0; i < json.length; i++) {
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, json[i].PBGID);
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerHTML = getNormalTxtHtml(json[i].PBGName);

        cell = row.insertCell(2);
        cell.innerHTML = getNormalTxtHtml(json[i].PBGIndex);
        cell.align = "center";

        cell = row.insertCell(3);
        cell.innerHTML = getNormalTxtHtml(json[i].RowNo);
        cell.align = "center";

        setRowAttributes(row);
    }
}
// 删除明细
function delItems(table) {
    deleteTableRow(table);
    setTableRowAttributes(table);
}

