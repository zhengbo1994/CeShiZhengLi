/// <reference path="../../jquery-1.4.2-vsdoc.js" />
/*
港中旅投资管理系统首页
作者：舒斌
日期：2012-10-08
*/

//选择项目
var selectProject = function (hidID, txtID)
{
    var vValue = openModalWindow('../../CTSIM/Public/VSelectProject.aspx', 900, 600);
    if (typeof (vValue) == "undefined")//点击右上角关闭按钮
    {
        return;
    }
    if (vValue != null && vValue.length != 0)
    {
        getObj(hidID).value = vValue[0].ProjectID;
        getObj(txtID).value = vValue[0].ProjectName;
        ajax(
                window.location.href,
                { ajax: true, ProjectID: getObj(hidID).value },
                "json",
                loadProjectInvestPlanExecute
            );
    }
    else if (vValue == null)
    {
        getObj(hidID).value = "";
        getObj(txtID).value = "";
    }
    //取消
    else if (vValue.length == 0)
    {
    }

}
var loadProjectInvestPlanExecute = function (data, status) {
    $("#tdInvestPlanExecuteTable").html(data);
}

// 资本性支出预算执行分析公司选择
var selectPayExecuteCorp = function () {
    if ($("#ddlCapitalPayExecuteCorp").val() != "") {
        ajax(
            window.location.href,
            { ajax: true, PayExecuteCorpID: $("#ddlCapitalPayExecuteCorp").val() },
            "json",
            loadPayExecute
        );
    }
}
var loadPayExecute = function (data, status) {
    $("#tdCapitalPayExecuteTable").html(data);
}

//招标执行情况分析
var selectBiddingPlanExectueCorp = function () {
    if ($("#ddlCorp").val() != "") {
        ajax(
            window.location.href,
            { ajax: true, CorpID: $("#ddlCorp").val() },
            "json",
            loadBiddingPlanExectue
        );
    }
}
var loadBiddingPlanExectue = function (data, status) {
    $("#tdBiddingPlanExectueTable").html("<div class='divcontent'>"+data+"</div>");
    showLayerTG(getObj('ctl00_ContentArea_dgData'), 2, 0);
}

//显示更多 预警
function showMoreAlertInfo() {
    openWindow("../../BI/JobEarlyWarning/VMyJobEarlyWarning.aspx", 800, 600);
}

//显示更多 待办
function showMoreWaitDo() {
    openWindow("../../Common/Personal/VWaitDo.aspx", 800, 600);
}

//显示更多 公司制度
function showMoreRegime() {
    openWindow("../../IDOA/Bylaw/VRegimeViewFrame.aspx", 800, 600);
}

//显示更多 信息交流
function showMoreMessageRelease()
{
    openWindow("../../CTSIM/MessageRelease/VMessageRelease.aspx", 800, 600);
}

//显示 信息交流明细
function showMessageRelease(mid)
{
    openWindow("../../CTSIM/MessageRelease/VMessageBrowse.aspx?ID="+mid, 800, 600);
}

function showTitle(url) {
    var index = url.indexOf('/');
    if (index == 0) {
        url = url.substring(index + 1, url.length);
    }
    openWindow("../../" + url + "&JQID=jqGrid", 1000, 800);
}
function showWaitDo(url) {
    var index = url.indexOf('/');
    if (index == 0) {
        url = url.substring(index + 1, url.length);
    }
    openWindow("../../" + url + "&JQID=jqGrid", 1000, 800);
}