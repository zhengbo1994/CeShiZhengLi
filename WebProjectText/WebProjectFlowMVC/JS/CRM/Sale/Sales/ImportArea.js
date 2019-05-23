// 下载模板
function DownExcel()
{
    if (getObj("txtSelectBuildingName").value == "") {
        return alertMsg("请先选择需要调价的楼栋。", getObj("txtSelectBuildingName"));
    }

    return true;
}

// 选择楼栋范围
function selectBuilding()
{
    var ProjectGUID = $("#hidProjectID").val();
    var url = '../../../Common/Select/CRM/VSelectBuildingInfo.aspx?IsProjectFixed=Y&ProjectGUID=' + ProjectGUID + '&IsMulti=Y';
    var rValue = openModalWindow(url, 800, 600);

    if (rValue != null && rValue != "undefined" && rValue != "") {
        rValue = rValue.substring(0, rValue.lastIndexOf('|'));
        var dt = rValue.split('|');
        var names = "";
        var ids = "";
        for (var i = 0; i < dt.length; i++) {
            names += dt[i].split(',')[1] + ",";
            ids += dt[i].split(',')[0] + ",";
        }
        names = names.substring(0, names.lastIndexOf(','));
        ids = ids.substring(0, ids.lastIndexOf(','));

        getObj("hidSelectBuildingID").value = ids;
        getObj("txtSelectBuildingName").value = names;
    }

}