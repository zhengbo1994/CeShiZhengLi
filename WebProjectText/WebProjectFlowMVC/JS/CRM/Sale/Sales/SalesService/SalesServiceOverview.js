//常春侠
//2013年5月30日10:24:19


// 项目变更，加载楼栋
function project_change() {
    var projID = $("#ddlProject").val();
    if (projID.length != 36) {
        alert('请选择公司下的项目！');
        $("#ddlBuilding").empty();
        return;
    }

    var vCTID = "";
    var vCID = "";

    // post请求
    $.post('FillData.ashx', { action: 'CRM_BindBuildingOnly', ProjectGUID: projID }, function (data, textStatus) { loadBuildingInfo(data, vCTID + '|' + vCID) }, 'json');

}


var loadBuildingInfo = function (data, vID) {
    if (!!data) {
        bindDdl(data, 'ddlBuilding', "", "SELECT");
    }
    else {
        bindDdl([], "ddlBuilding", '', "SELECT");
    }
    // 重新加载楼栋
     buildingChange();
}
function buildingChange() {
    var sProjectID = $("#ddlProject").val();
    var sBuildingIDList = $("#ddlBuilding").val();

    // 无条件时，省略第二个参数
    if (sBuildingIDList == null || sBuildingIDList.toUpperCase() == "NULL") {
        sBuildingIDList = "";
    }

   // alert(getObj("ddlBuilding").value);
    ajax(location.href,
    {
        "ProjectID": sProjectID,
        "BuildGUIDList": sBuildingIDList
    },
    "json",
    function (ret) {
        if (ret && ret.Success == "Y") {
            //alert(ret.Data);
            $("#divRpt").html(ret.Data);
           // $("#divRpt").html(ret.Data);
         
        }
    });
}
function getUrl(i) {
    var url = "";
    switch (i) {
        case 1: url = "SalesContactServiceList.aspx"; break;
        case 2: url = "SalesHousingFundList.aspx"; break;
        case 3: url = "SalesMortgagesList.aspx"; break;
        case 4: url = "SalesOccupationServiceList.aspx"; break;
        case 5: url = "SalesPropertyServiceList.aspx"; break;
    }
    return url;
}
//在后台拼接html 的时候给style2的元素添加事件
//type=0是全部数据type=1是超期处理；
function showOverTime(i, type) {
    var url = getUrl(i);
    var projID = $("#ddlProject").val();
    if (type == 0) {
        url = url + "?pID="+projID;
        openAddWindow(url, 800, 600);
    }
    else {
        url = url + "?tj=OverTime&pID="+projID;
        openAddWindow(url, 800, 600);
    }
}
//获取服务类型i下的具体进程信息
function showProcessInfo(i,ProcessGuid) {
    var url = getUrl(i);
    var projID = $("#ddlProject").val();
    url = url + "?tj=" + ProcessGuid + "&pID=" + projID;
    //alert(url);return;
    openAddWindow(url, 800, 600);
}