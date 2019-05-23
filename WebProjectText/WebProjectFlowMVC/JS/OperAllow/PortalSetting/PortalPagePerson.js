// JScript 文件
//个人门户配置Js
//马吉龙
//日期:2012-3-26

/* 刷新jqGrid */
function reloadData() {
    $('#jqGrid1').getGridParam('postData').KW = getObj("txtKW").value;
    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').getGridParam('postData').DeptID = getObj("ddlDept").value;

    $('#jqGrid1').trigger('reloadGrid');
}

/* 切换公司加载部门 */
function resetDept() {
    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetDeptByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadDept,
            error: ajaxError
        });
}

// 加载部门
function loadDept(data, textStatus) {
    var ddlDept = getObj("ddlDept");
    for (var i = ddlDept.length - 1; i > 0; i--) {
        ddlDept.remove(i);
    }

    if (data.Count > 0) {
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++) {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name;
            ddlDept.add(opt, ddlDept.length);
        }
    }

    reloadData();
}
//设置
var setPortalPage = function () {
    var ids = getJQGridSelectedRowsID("jqGrid1", true);
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50) {
        return alertMsg("您一次最多只能操作50条记录。");
    }
    openWindow("VPortalPagePersonSetting.aspx?ids=" + ids.join(","), 600, 500, "jqGrid1");
}
//个人门户查看
var renderName = function (value, pt, record)
{
    var ppIDs = record[10],
        html = "";

    if (ppIDs)
    {
        var arrPPID = ppIDs.split(","),
            arrPPName = value.split(","),
            vUrl = "";

        html += "<div>";
        for (var i = 0; i < arrPPID.length; i++)
        {
            vUrl = "'../Portal/VPortalPageBrowse.aspx?ID=" + arrPPID[i] + "'";
            html += '<a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',500,400)">' + arrPPName[i] +
                (arrPPID.length - 1 == i ? "" : "，") + '</a>';
        }
        html += "</div>";
    }

    return html;
}

var renderCName = function (value, pt, record) {
    var vUrl = "'../Portal/VPortalPageBrowse.aspx?ID=" + record[11] + "'";
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',500,400)">' + value + '</div>';
}
var renderDName = function (value, pt, record) {
    var vUrl = "'../Portal/VPortalPageBrowse.aspx?ID=" + record[12] + "'";
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',500,400)">' + value + '</div>';
}
//设置
var setPersonPortalPage = function (type)
{
        if (type != "0") {
            openModifyWindow("VPortalProjectSetting.aspx?Type=" + type, 650, 480, "jqGrid1")
        } else {
            var ids = getJQGridSelectedRowsID("jqGrid1", true);
            if (ids == "" || ids.length == 0) {
                return alertMsg("没有任何记录可供操作。");
            }
            if (ids.length > 50) {
                return alertMsg("您一次最多只能操作50条记录。");
            }
            openWindow("VPortalProjectSetting.aspx?ID=&Type=" + type + "&ids=" + ids.join(","), 600, 480, "jqGrid1");
        }
}

//设置门户排序
var btnPortalOrderSettingClick = function (record) {
    var AccountIDs = getJQGridSelectedRowsID("jqGrid1", true);
    //判断是否设置了个人门户
    var PPID = getJQGridSelectedRowsData("jqGrid1", true, 'PPID').toString();
    var  ppids = PPID.split(',');
    for (var i = 0; i < ppids.length; i++)
    {
        if (ppids[i] == "")
        {
            return alertMsg("部分数据未设置个人门户。");
        }
    }
    if (AccountIDs != "") {
        openWindow("VPortalOrderSetting.aspx?AccountIDs=" + AccountIDs.join(","), 400, 250);
    }
    else {
        alert("没有任何记录可供操作。");
    }
}