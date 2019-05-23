// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;


//搜索
function btnSearch_Click() {
    reloadData();
}

//新建
function btnAdd_Click() {
    openAddWindow("VExamAdjust.aspx", 800, 600, "jqExamHistory");
}


function reloadData() {
    var jqObj = $('#jqExamHistory', document);

    if (_PageMaster.isSearching) {
        return false;
    }
    else {
        _PageMaster.isSearching = true;
    }

    var sExamID = $("#ddlExamPlan").val();
    var sEOID = $("#ddlExamScope").val();
    var sCorpID = $("#ddlCorp").val();
    var sKey = $("#txtKey").val();

    jqObj.getGridParam('postData').ExamID = sExamID;
    jqObj.getGridParam('postData').EOID = sEOID;
    jqObj.getGridParam('postData').CorpID = sCorpID;
    jqObj.getGridParam('postData').Key = sKey;

    refreshJQGrid('jqExamHistory');
}

function customGridComplete() {
    _PageMaster.isSearching = false;
}


// 根据公司获取考核计划
function ddlCorp_change(vCTID, vCID) {
    var sCropID = $("#ddlCorp").val();

    if (vCTID == null) {
        vCTID = "";
    }

    if (vCID == null) {
        vCID = "";
    }

    getObj("ddlExamPlan").options.length = 0;

    if (sCropID != "") {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, ExamFilter: "2", IsNoSelect: 'N' },
        function (data, textStatus) { loadExamPlan(data, vCTID + '|' + vCID); ddlExamPlan_change() }, 'json');
    }    
}


// 绑定考核计划
var loadExamPlan = function (data, vID)
{
    var ddlExamPlan = getObj("ddlExamPlan");
    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });

    if (getObj("ddlExamPlan").options.length > 0)
    {
        if (vID.split('|')[0] != "")
        {
            getObj("ddlExamPlan").value = vID.split('|')[0];
        }

        if (getObj("ddlExamPlan").options.length == 2)
        {
            getObj("ddlExamPlan").selectedIndex = 1;
        }
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo('#ddlExamPlan');
    }
}

// 根据考核计划获取考核范围（考核结果已报批）
function ddlExamPlan_change(vCTID, vCID) {
    var sExamID = $("#ddlExamPlan").val();

    if (vCTID == null) {
        vCTID = "";
    }

    if (vCID == null) {
        vCID = "";
    }

    getObj("ddlExamScope").options.length = 0;

    $.post('FillData.ashx', { action: 'GetExamScopeOrgByExamID', ExamID: sExamID, IsTeamLeader: 'Y', IsNoSelect: 'N' },
    function (data, textStatus) { loadExamScope(data, vCTID + '|' + vCID); ddlExamScope_change() }, 'json');
}


// 绑定考核范围
var loadExamScope = function (data, vID)
{
    var ddlExamScope = getObj("ddlExamScope");
    $(data).each(function (i,d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamScope.add(opt, ddlExamScope.length);
    });

    if (getObj("ddlExamScope").options.length > 0)
    {

        if (vID.split('|')[0] != "")
        {
            getObj("ddlExamScope").value = vID.split('|')[0];
        }
        if (getObj("ddlExamScope").options.length == 2)
        {
            getObj("ddlExamScope").selectedIndex = 1;
        }
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo('#ddlExamScope');
    }
}


// 考核计划变化
function ddlExamScope_change() {
    reloadData();
}




