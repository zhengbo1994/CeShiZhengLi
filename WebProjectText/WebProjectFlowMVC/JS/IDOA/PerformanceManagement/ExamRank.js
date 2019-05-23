// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/

//搜索
function btnSearch_Click()
{
    reloadData();
}


// 重新加载数据
function reloadData()
{
    var sExamID = $("#ddlExamPlan").val();
    var sOrganizationID = $("#ddlOrganization").val();
    var sShowFilter = $("#ddlShowFilter").val();
    var sKey = $("#txtKey").val();
    var bIsNoEOID = $("#hdIsNoEOID").val();
    var query = { ExamID: sExamID, OrganizationID: sOrganizationID, ShowFilter: sShowFilter, Key: sKey, IsNoEOID: bIsNoEOID };

    // 无条件时，省略第二个参数
    reloadGridData("idPager", query);
}

function btnReComputer_Click()
{
    var sExamID = $("#ddlExamPlan").val();
    if (sExamID == "" || sExamID == "null")
    {
        alert("请选择考核计划!");
    }
    else
    {
        var IsComputer = confirm("重新算分过程较慢，确定要算分吗？");

        if (IsComputer)
        {

            var sOrganizationID = $("#ddlOrganization").val();
            var sShowFilter = $("#ddlShowFilter").val();
            var sKey = $("#txtKey").val();
            var query = { ExamID: sExamID, OrganizationID: sOrganizationID, ShowFilter: sShowFilter, Key: sKey, bIsComputer: "Y" };
            reloadGridData("idPager", query);
        }
    }
}

function customGridComplete()
{
    _PageMaster.isSearching = false;
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
}

// 根据公司获取考核计划
function ddlCorp_change(vCTID, vCID)
{
    var sCropID = $("#ddlCorp").val();

    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    getObj("ddlExamPlan").length = 0;

    if (sCropID != "")
    {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, ExamFilter: "2", IsNoSelect: 'N' },
        function (data, textStatus) { loadExamPlan(data, vCTID + '|' + vCID); ddlExamPlan_change() }, 'json');
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo('#ddlExamPlan');
    }

}

// 绑定考核计划
var loadExamPlan = function (data, vID)
{

    var ddlExamPlan = getObj('ddlExamPlan');
    $.each(data, function (i, d)
    {
        var opt = document.createElement("OPTION");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });
    //    $(data).each(function (i)
    //    {
    //        $("<option value='" + data[i].value + "'>" + data[i].text + "</option>").appendTo('#ddlExamPlan');
    //    });

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


// 根据考核计划获取考核组织
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

    getObj("ddlOrganization").options.length = 0;

    $.post('FillData.ashx', { action: 'GetExamScopeOrgByExamID', ExamID: sExamID, AccountID: sAccountID, IsTeamLeader: 'Y', IsNoSelect: 'N' },
    function (data, textStatus) { loadExamOrganization(data, vCTID + '|' + vCID); reloadData(); }, 'json');

}


// 绑定考核方式
var loadExamOrganization = function (data, vID)
{
    var ddlOrganization = getObj("ddlOrganization");
    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlOrganization.add(opt, ddlOrganization.length);
    });

    if (getObj("ddlOrganization").options.length > 0)
    {
        if (vID.split('|')[0] != "")
        {
            getObj("ddlOrganization").value = vID.split('|')[0];
        }

        if (getObj("ddlOrganization").options.length == 2)
        {
            getObj("ddlOrganization").selectedIndex = 1;
        }

        $("#hdIsNoEOID").val("N")
    }
    else
    {
        $("#hdIsNoEOID").val("Y")
        $("<option value=''>请选择</option>").appendTo('#ddlOrganization');
    }
}







