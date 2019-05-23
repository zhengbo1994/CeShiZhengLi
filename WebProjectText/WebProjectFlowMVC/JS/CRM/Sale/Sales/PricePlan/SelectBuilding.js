/*
客户自定义配置使用到的JS
作者：程镇彪
日期：2012-09-18
*/
//条件搜索
function reloadData() {

    var sProjectGUID = getObj("ddlProjectGUID").value;
    var sPostBuidingGuidList=getObj("hidPostBuildingGuidList").value;
    ajax(location.href, { "sProjectGUID": sProjectGUID, "sPostBuidingGuidList": sPostBuidingGuidList }, "json", loadBuilding);
}

function loadBuilding(data, textStatus) {
    if (data.Success == "Y") {
        $(divMPList).html(data.Data);
    }
    else {
        alert(data.Data);
    }   
}

// 下一步
function btnNextStep_Click() {
    var ids = "";
    $("input[type=checkbox]:checked").each(function (i) {
        var id = $(this).val();
        if (id != null) {
            ids += id + '|';
        }
    })
    ids = ids.replace("on|", "");
    if (ids == "") {
        alert("没有选择楼栋。");
        return false;
    }
    var roomType = $("input[type=radio]:checked").val();
    ids += roomType;
    $("#hidIds").val(ids);
    $("#hidProjectGuid").val(getObj("ddlProjectGUID").value);
    return true;
}

