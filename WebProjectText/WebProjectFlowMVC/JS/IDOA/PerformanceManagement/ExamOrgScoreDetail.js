// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/


//搜索
function btnSearch_Click()
{
    reloadData();
}


// 获取数据
function reloadData()
{
    var sAccountID = $("#hdAccountID").val();
    var sEPSID = $("#ddlExamScope").val();
    var strCorpID = $("#ddlCorp").val();
    var strExamID = $("#ddlExamPlan").val();

    getObj("hdFilter").value = strCorpID + "|" + strExamID + "|" + sEPSID;

    $.post('FillData.ashx', { action: 'GetExamOrgScoreTable', EPSID: sEPSID, AccountID: sAccountID, CorpID: strCorpID, ExamID: strExamID },
    function (data, textStatus) { loadListData(data) });

    if (getObj("hdEPSID").value != "") // 只取一次（第一次加载）
    {
        sEPSID = getObj("hdEPSID").value;
    }

    if (sEPSID != "" && sEPSID != null && sEPSID != "null")
    {
        $.post('FillData.ashx', { action: 'GetExamScopeScoreDetail', EPSID: sEPSID, ScopeType: "O" },
        function (data, textStatus) { loadDetailData(data) });
        getObj("hdEPSID").value = ""; // 清除隐藏值
    }
    else
    {
        getObj("dDetail").innerHTML = "";
    }

    getObj("hdEEPSID").value = sEPSID;
}


// 显示明细数据
var loadDetailData = function (data)
{
    if (data != null)
    {
        getObj("dDetail").innerHTML = data;
    }
}

// 显示列表数据
var loadListData = function (data)
{
    if (data != null)
    {
        getObj("dlist").innerHTML = data;
    }
    else
    {
        getObj("dlist").innerHTML = "当前没有符合条件的已报批组织绩效！";
    }
}

// 链接到明细数据
function showdetail(sEPSID)
{
    showBrowseTab(0);

    if (sEPSID != "" && sEPSID != null && sEPSID != "null")
    {
        $.post('FillData.ashx', { action: 'GetExamScopeScoreDetail', EPSID: sEPSID, ScopeType: "O" },
        function (data, textStatus) { loadDetailData(data) });
    }
    else
    {
        getObj("dDetail").innerHTML = "";
    }

    getObj("hdEEPSID").value = sEPSID;
}

function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 2; i++)
    {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";

    getObj("hdShowType").value = index;

}


// 根据公司获取考核计划
function ddlCorp_change(vCTID, vCID)
{
    var sCropID = $("#ddlCorp").val();
    var sAccountID = $("#hdAccountID").val();

    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    getObj("ddlExamPlan").options.length = 0;

    $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, ExamFilter: 2, IsTeamLeader: 'Y', IsResultApproval: "Y", AccountID: sAccountID, IsNoSelect: 'N' },
    function (data, textStatus) { loadExamPlan(data, vCTID + '|' + vCID); ddlExamPlan_change(); }, 'json');
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
function ddlExamPlan_change(vCTID, vCID)
{
    var sExamID = $("#ddlExamPlan").val();
    var sAccountID = $("#hdAccountID").val();

    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    getObj("ddlExamScope").options.length = 0;

    $.post('FillData.ashx', { action: 'GetExamScopeOrgByExamID', ExamID: sExamID, AccountID: sAccountID, IsTeamLeader: 'Y', ValueField: 'EPSID', IsResultApproval: 'Y', IsNoSelect: 'N' },
        function (data, textStatus) { loadExamScope(data, vCTID + '|' + vCID); ddlExamScope_change(); }, 'json');
}


// 绑定考核范围
var loadExamScope = function (data, vID)
{
    var ddlExamScope = getObj("ddlExamScope");
    $(data).each(function (i, d)
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

// 考核对象变化
function ddlExamScope_change()
{
    reloadData();
}


// 显示指标明细得分
function showExamIndexScore(IndexID)
{
    var url = "VExamIndexScoreView.aspx?EPSID=" + getObj("ddlExamScope").value + "&IndexID=" + IndexID;
    openWindow(url, 800, 600);
}
