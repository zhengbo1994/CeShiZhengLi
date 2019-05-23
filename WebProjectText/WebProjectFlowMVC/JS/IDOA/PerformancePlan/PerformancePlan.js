// JScript 文件

//新增计划
function btnAdd_Click()
{
    openAddWindow("VPerformancePlanAdd.aspx?CorpID=" + $("#ddlCorp").val(), 800, 500, "jqGrid1");
}

//修改计划
function btnEdit_Click()
{
    openModifyWindow("VPerformancePlanEdit.aspx", 800, 500, "jqGrid1")
}

//删除计划
function btnDelete_Click()
{
    openDeleteWindow("PerformancePlan", 1, "jqGrid1");
}

function btnImport_Click()
{
    openAddWindow("VPerformancePlanCopy.aspx?CorpID=" + $("#ddlCorp").val(), 400, 200, "jqGrid1");
}

// 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Export":
            window.document.getElementById('btnExport').click();
            break;
        case "Import":
            btnImport_Click();
            break;
    }
}

//刷新列表

function reloadData()
{
    var corpID = "";
    var searchText = "";
    if (getObj("ddlCorp"))
    {
        corpID = getObj("ddlCorp").value;
    }

    if (getObj("txtKey"))
    {
        searchText = getObj("txtKey").value;
    }
    var query = { EOID: parent["EOID"], CorpID: corpID, SearchText: searchText };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

//计划标题连接
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VPerformancePlanBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowPlan" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function myIndexLink(cellvalue, options, rowobject)
{
    var url = "'VPerformancePlanIndex.aspx?JQID=jqGrid1&IDM_CD=1&ID=" + rowobject[0] + "&ExamID=" + rowobject[9] + "'";
    var html = "";

    if (rowobject[8] == "N" && rowobject[10] == "N")
    {
        if (rowobject[7] == "Y")
        {
            html = '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',0, 0)">修改指标</a>'
        }
        else
        {
            html = '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',0, 0)"><font color="red">设置指标</font></a>'
        }
    }

    return html;
}

//设置考核范围
function scopeLink(cellvalue, options, rowobject)
{
    var strat = rowobject[8];
    if (strat != "Y")
    {
        var url = "'VPerformancePlanScope.aspx?ExamID=" + rowobject[0] + "&EOCID=" + rowobject[11] + "'";
        return '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',0, 0)">设置</a>';
    }
    else
    {
        return '';
    }
}

//查看考核范围链接
function renderScopeLink(cellvalue, options, rowobject)
{
    var url = "'VPerformancePlanScopeBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
}

function DataAcquisitionedLink(cellvalue, options, rowobject)
{
    var state = rowobject[12];
    var strat = rowobject[8];

    var url = "";

    if (strat == "Y")
    {
        return "";
    }

    if (state == "S")
    {
        url = '<a  href="#ShowPreview" onclick="javascript:SetDataAcquisitioned(\'' + rowobject[0] + '\',\'C\')">结束</a>'
    }
    else if (state == "C")
    {
        url = '<a  href="#ShowPreview" onclick="javascript:SetDataAcquisitioned(\'' + rowobject[0] + '\',\'S\')">重新开始</a>'
    }
    else
    {
        url = '<a  href="#ShowPreview" onclick="javascript:SetDataAcquisitioned(\'' + rowobject[0] + '\',\'S\')">开始</a>'
    }

    return url;
}

function SetDataAcquisitioned(strExamID, strStatus)
{
    ajaxRequest("FillData.ashx", { action: "SetDataAcquisitionedStatus", ExamID: strExamID, Status: strStatus }, "html", AlertMsg, true, "POST");
}


function StartLink(cellvalue, options, rowobject)
{
    var strat = cellvalue;
    var end = rowobject[9];
    var ExamID = rowobject[0];
    if (strat == "Y" & end == "Y")
    {
        return '考核完成';
    }
    else if (strat == "N")
    {
        return '<a  href="#ShowScope" onclick="javascript:validateStartPerformance(\'' + rowobject[0] + '\');"> 开始考核 </a>';
    }
    else
    {
        return '<a  href="#ShowScope" onclick="javascript:validateEndPerformance(\'' + rowobject[0] + '\');"> 结束考核 </a>';
    }
}


//选择调分人
function btnSelecStation_Click()
{
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + getObj("hidCorpID").value + '', 0, 0);
    if (!rValue)
        return;
    getObj("hidAdjustScoreSationID").value = rValue.split('|')[0];
    getObj("txtAdjustScoreSation").value = rValue.split('|')[1];
}

function ddlCorp_PlanChange()
{
    var vCorpID = getObj("ddlCorp").value;
    $.post('FillData.ashx', { action: 'GetExamOrgConfigByCorpID', CorpID: vCorpID }, function (data, textStatus) { loadOrgConfig(data) }, 'json');
}

var loadOrgConfig = function (data)
{
    var ddlOrg = getObj("ddlOrg");

    getObj("ddlOrg").options.length = 0;
    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlOrg.add(opt, ddlOrg.length);
    });
}

//改变考核周期显示不同的时间范围
function changeExamCycle()
{
    var type = $('#ddlExamCycle').val();

    $('#trYear').css('display', 'none');
    $('#ddlQuarter').css('display', 'none');
    $('#ddlMonth').css('display', 'none');
    $('#ddlHalfYear').css('display', 'none');
    $('#lblQuarter').css('display', 'none');
    $('#lblMonth').css('display', 'none');
    $('#trTime').css('display', 'none');
    $('#lblkong').css('display', 'none');
    $('#lblkong').css('display', 'none');
    switch (type)
    {
        case "0":  //年度考核
            $('#trYear').css('display', '');
            $('#lblkong').css('display', '');
            $('#lblkong').css('display', '');
            break;
        case "1": //季度考核
            $('#trYear').css('display', '');
            $('#ddlQuarter').css('display', '');
            $('#lblQuarter').css('display', '');
            break;
        case "2": //月度考核
            $('#trYear').css('display', '');
            $('#ddlMonth').css('display', '');
            $('#lblMonth').css('display', '');
            break;
        case "3": //半年度
            $('#trYear').css('display', '');
            $('#ddlHalfYear').css('display', '');
            break;
        case "9": //不定期
            $('#trTime').css('display', '');
            break;
    }
}

function changeScopeType()
{
    $('#trIsNeedSelfAssess').css('display', '');

    var rbs = getObj("rblScopeType").getElementsByTagName("INPUT");
    var type = "";

    for (var i = 0; i < rbs.length; i++)
    {
        if (rbs[i].checked)
        {
            type = rbs[i].value;
            break;
        }
    }

    if (type != "1")
    {
        $('#trIsNeedSelfAssess').css('display', 'none');
    }
}

function dsj()
{
    if (type != "1")
    {
        $('#trIsNeedSelfAssess').css('display', 'none');
    }
}

//校验数据
function validateSize()
{
    if (getObj("txtExamName").value == "")
    {
        return alertMsg("考核工作计划名称不能为空。", getObj("txtExamName"));
    }

    if (getObj("txtStartDate").value != "" && getObj("txtEndDate").value != "")
    {
        if (compareDate(getObj("txtStartDate").value, getObj("txtEndDate").value) == -1)
        {
            return alertMsg("考核结束时间不能比开始时间早。", getObj("txtEndDate"));
        }
    }

    if (getObj("txtAdjustScoreSation").value == "")
    {
        return alertMsg("调分人不能为空。", getObj("txtAdjustScoreSation"));
    }

    if (getObj("ddlOrg").value == "")
    {
        return alertMsg("考核组织不能为空。", getObj("ddlOrg"));
    }

    getObj("hidEOCID").value = getObj("ddlOrg").value;

    if (getObj("ddlCorp").value == "")
    {
        return alertMsg("考核公司不能为空。", getObj("ddlCorp"));
    }    
    //    if (!checkExamMode()) {
    //        return alertMsg("权重之和不能为0，请调整。");
    //    }
    return true;
}

//校验数据 总和不能为0 
function checkExamMode()
{
    var total = 0;
    var IsEnable = getObj("chkKPI").checked;
    if (IsEnable)
    {
        total += parseInt(getObj("txtKPIPencent").value)
    }

    IsEnable = getObj("chkBI").checked;
    if (IsEnable)
    {
        total += parseInt(getObj("txtBIPencent").value)
    }

    IsEnable = getObj("chkProgress").checked;
    if (IsEnable)
    {
        total += parseInt(getObj("txtProgress").value)
    }

    if (total == 0)
    {
        return false;
    }

    return true;
}
// 点击考核开始时的验证方法
function validateStartPerformance(ExamID)
{
    var strExamID = "";
    if (ExamID)
    {
        strExamID = ExamID;
    }
    else
    {
        strExamID = getObj("hidExamID").value;
    }

    /* ExamPlanScope Status:
    返回两位二进制数
    十位为1时: 部分考核范围未加入目标书
    个位为1时: 部分考核范围未完成数据采集
    */
    var strStatus, strConfirmMsg, bValue = true;

    $.post('FillData.ashx',
    { action: 'GetExamPlanScopesStatus', ExamID: strExamID, temp: Math.random() },
    function (data, textStatus)
    {
        strStatus = data;

        switch (strStatus)
        {
            case "00":
                strConfirmMsg = "您确定要开始考核工作计划吗？";
                break;
            case 
            "10":
                strConfirmMsg = "有部分考核范围未加入目标书或目标书非正式，您确定要开始考核工作计划吗？";
                break;
            case "01":
                strConfirmMsg = "有部分考核范围未完成数据采集，您确定要开始考核工作计划吗？";
                break;
            case "11":
                strConfirmMsg = "有部分考核范围未加入目标书或目标书非正式，您确定要开始考核工作计划吗？";
                break;
            default:
                strConfirmMsg = "无效状态，无法开始考核工作计划。";
                bValue = false;
                break;
        }

        if (bValue)
        {
            if (confirm(strConfirmMsg))
            {
                ajaxRequest("FillData.ashx", { action: "SetExamPlanStatus", ExamID: strExamID, Start: "Y" }, "html", afterSave, true, "POST");
                if (!getObj("hidExamID"))
                {
                    reloadData();
                }
            }
        }
        else
        {
            alert(strConfirmMsg);
            return false;
        }
    });

    return false;
}

// 保存后弹出消息(成功或失败)
function afterSave(data, textStatus)
{
    alert(data);
    if (getObj("hidExamID"))
    {
        window.opener.refreshJQGrid("jqGrid1");
        closeMe();
    }
}

// 保存后弹出消息(成功或失败)
function AlertMsg(data, textStatus)
{
    alert(data);
    window.refreshJQGrid("jqGrid1");
}


// 点击考核结束时的验证方法
function validateEndPerformance(ExamID)
{
    var strExamID = "";
    if (ExamID)
    {
        strExamID = ExamID;
    }
    else
    {
        strExamID = getObj("hidExamID").value;
    }

    /*  获取还未完成评分的考核范围数量
    */
    var iNotCauseCheckedCount, strConfirmMsg;

    $.post('FillData.ashx',
    { action: 'GetIsNotScoredCount', ExamID: strExamID, temp: Math.random() },
    function (data, textStatus)
    {
        iNotCauseCheckedCount = data;

        if (!isNaN(iNotCauseCheckedCount))
        {
            if (iNotCauseCheckedCount > 0)
            {
                strConfirmMsg = "部分考核范围未完成评分，您确定要结束考核吗？";
            }
            else
            {
                strConfirmMsg = "您确定要结束考核吗？";
            }

            if (confirm(strConfirmMsg))
            {
                ajaxRequest("FillData.ashx", { action: "SetExamPlanStatus", ExamID: strExamID, End: "Y" }, "html", afterSave, true, "POST");
                if (!getObj("hidExamID"))
                {
                    reloadData();
                }
            }
        }
        else
        {
            strConfirmMsg = "获取考核范围信息失败，请重试或联系系统管理员。";
            alert(strConfirmMsg);
            return false;
        }
    });

    return false;
}

//撤销考核工作计划 只有在未开始自评时可以撤销
function validatebtnRevokePerformance()
{

    var strExamID = getObj("hidExamID").value;
    var isSelfAssessCount, strConfirmMsg;

    $.post('FillData.ashx',
    { action: 'GetRevokeExamPlanEnable', ExamID: strExamID, temp: Math.random() },
    function (data, textStatus)
    {
        isSelfAssessCount = data;

        if (!isNaN(isSelfAssessCount))
        {
            if (isSelfAssessCount > 0)
            {
                return alertMsg("由于自评已开始，不能撤销此计划请返回。");
            }
            else
            {
                strConfirmMsg = "您确定要撤销考核吗？";
            }

            if (confirm(strConfirmMsg))
            {
                ajaxRequest("FillData.ashx", { action: "SetExamPlanStatus", ExamID: strExamID, Revoke: "Y" }, "html", afterSave, true, "POST");
            }
        }
        else
        {
            return alertMsg("获取考核范围信息失败，请重试或联系系统管理员。");
        }
    });

    return false;
}

/////////////////////////////////////////////PerformancePlanScope/////////////////////////////////////////////////////

function btnSet_Click()
{
    var examID = getObj("hidExamID").value;
    var eoID = window["EOID"];
    if (!eoID)
    {
        return alertMsg('请选择一个组织。');
    }
    openWindow("VPerformancePlanScopeSet.aspx?JQID=jqGrid1&ExamID=" + examID + "&EOID=" + eoID, 600, 400)
}

function btnScopeDelete_Click()
{
    try
    {
        openDeleteWindow("PerformancePlanScope", 1, "jqGrid1", "Main");
    } catch (e)
    {
        return alertMsg('请选择考核范围。');
    }
}

function btnExamMode_Click()
{
    try
    {
        var ids;
        var vIsAllowEdit;

        ids = window.frames("Main").getJQGridSelectedRowsID("jqGrid1", true);
        vIsAllowEdit = window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'IsAllowEdit');

        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }

        if (stripHtml(vIsAllowEdit[0]) == "N")
        {
            return alertMsg("您不能修改该数据。");
        }
        openWindow("VPerformancePlanScopeMode.aspx?ID=" + ids.join(",") + "&JQID=jqGrid1", 600, 400);
    } catch (e)
    {
        return alertMsg('请选择考核范围。');
    }
}

function btnCopy_Click()
{
    var id = getObj("hidExamID").value;
    var eocID = getObj("hidEOCID").value;

    openWindow("VPerformancePlanIndexCopy.aspx?JQID=jqGrid1&ExamID=" + id + "&EOCID=" + eocID, 400, 250)
}

function openSelectScopeStation()
{
    var rValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim=ScopeStation&CorpID=' + getObj("hidCorpID").value + '', 0, 0);
    if (!rValue)
        return;
    getObj("hidScopeStationID").value = rValue.split('|')[0];
    getObj("txtScopeStation").value = rValue.split('|')[1];
}

function openSelectScopeDept()
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiDept.aspx?Aim=ScopeDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidScopeDeptID").value = vValue.split('|')[0];
        getObj("txtScopeDept").value = vValue.split('|')[1];
    }
}

function openSelectScopeCorp()
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiCorp.aspx?Aim=ScopeCorp', 800, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidScopeCorpID").value = vValue.split('|')[0];
        getObj("txtScopeCorp").value = vValue.split('|')[1];
    }
}

//function validateScopeSize() {
//    var strValue = "";
//    if (getObj("hidScopeType").value == "1") {  //岗位
//        strValue = getObj("hidScopeStationID").value;
//    }
//    else { //组织
//        strValue =getObj("hidScopeDeptID").value + getObj("hidScopeCorpID").value;
//    }
//    if (strValue == "") {
//        return alertMsg("请选择范围。");
//    }

//    return true;
//}

function validateScopeSize()
{

    if (getObj("txtTeamLeaderStation").value == "")
    {
        return alertMsg("部门负责人不能为空。", getObj("txtTeamLeaderStation"));
    }

    if (getObj("txtScopeStation").value == "")
    {
        return alertMsg("组员不能为空。", getObj("txtScopeStation"));
    }

    if (getObj("hidScopeStationID").value.indexOf(getObj("hidTeamLeaderStationID").value) != -1)
    {
        return alertMsg("部门负责人不能为组员。", getObj("txtScopeStation"));
    }

    return true;
}

//////////////////////////////////////////////////////////////////////

function indexLink(cellvalue, options, rowobject)
{
    var url = "'VPerformancePlanIndex.aspx?JQID=jqGrid1&ID=" + rowobject[0] + "&ExamID=" + rowobject[1] + "'";
    var html = "";

    if (rowobject[6] == "是")
    {
        html = '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',0, 0)">修改指标</a>'
    }
    else
    {
        html = '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',0, 0)"><font color="red">设置指标</font></a>'
    }

    return html;
}


///////////////////////////////////VPerformancePlanCopy.aspx//////////////////////////////////////////////
function ddlCorp_Change()
{
    var vCorpID = getObj("ddlCorp").value;
    $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: vCorpID }, function (data, textStatus) { loadExamPlan(data) }, 'json');
}

var loadExamPlan = function (data)
{
    var ddlExamPlan = getObj("ddlExamPlan");
    ddlExamPlan.options.length = 0;

    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });
}

function validateCorySize()
{
    getObj("hidExamID").value = getObj("ddlExamPlan").value;

    if (getObj("ddlExamPlan").value == "")
    {
        return alertMsg("请选择需要拷贝的考核工作计划。", getObj("ddlExamPlan"));
    }

    if (getObj("txtExamPlan").value == "")
    {
        return alertMsg("请填写考核工作计划名称。", getObj("txtExamPlan"));
    }

    if (getObj("txtStartDate").value != "" && getObj("txtEndDate").value != "")
    {
        if (compareDate(getObj("txtStartDate").value, getObj("txtEndDate").value) == -1)
        {
            return alertMsg("考核结束时间不能比开始时间早。", getObj("txtEndDate"));
        }
    }

    return true;
}