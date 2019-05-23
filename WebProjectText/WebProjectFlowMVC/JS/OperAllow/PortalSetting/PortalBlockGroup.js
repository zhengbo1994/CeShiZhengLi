// JScript 文件
//***************************************************//
//
//文件名:PortalBlockGroup.js .js
//作者:翁化青
//时间:2012-05-10
//功能描述:门户内容块组JS操作
//
//*************************************************//
var filterData = function (jqID) {
    var protalType = getObj("ddlPortalType").value;
    var key = getObj("txtKW").value;
    addParamsForJQGridQuery(jqID, [{ ProtalType: protalType, Key: key}]);
    refreshJQGrid(jqID);
}

// 搜索内容块组
var reloadPortalBlockGroup = function () {
    filterData("jqPortalBlockGroup")
}


var renderName = function (value, pt, record) {
    var vUrl = "'VPortalBlockGroupBrowse.aspx?ID=" + pt.rowId + "'";
    return '<a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a>';
}
//新增
var addPortalBlockGroup = function () {
    openAddWindow("VPortalBlockGroupAdd.aspx?ProtalType=" + getObj("ddlPortalType").value, 0, 0, "jqPortalBlockGroup");
}

//修改
var editPortalBlockGroup = function () {
    openModifyWindow("VPortalBlockGroupEdit.aspx", 0, 0, "jqPortalBlockGroup");
}

//删除
var deletePortalBlockGroup = function () {
    openDeleteWindow("PortalBlockGroup", 0, "jqPortalBlockGroup");
}


var validateSize = function () {
    if (getObj("ddlPortalType").value == "") {
        return alertMsg("类型不能为空。", getObj("ddlPortalType"));
    }
    if (getObj("txtPBGName").value == "") {
        return alertMsg("内容块组名称不能为空。", getObj("txtPBGName"));
    }
    if (getObj("txtRowNo").value == "") {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }

    return true;
}
