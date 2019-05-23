// JScript 文件

var _PageMaster = {};
_PageMaster.isSearching = false;

//修改
function btnEdit_Click()
{
    var url = "VManagePerformanceComplainEdit.aspx";
    openModifyWindow(url, 700, 500, "jqPerformanceComplain");
}


//删除
function btnDelete_Click()
{
    openDeleteWindow("PerformanceComplainMark", 1, "jqPerformanceComplain", null, { Msg: 'Y', From: 'Manage' });
}


//彻底删除
function btnRealDelete_Click()
{
    openDeleteWindow("PerformanceComplainReal", 1, "jqPerformanceComplain", null, { From: 'Manage' });
}

//还原
function btnResume_Click()
{
    openResumeWindow("PerformanceComplain", "jqPerformanceComplain");
}


//环节调整
function btnRevision_Click()
{
    openRevisionWindow("jqPerformanceComplain");
}

function setColShow(obj)
{
    if (obj.value == 'Y')
    {
        $("#btnRealDelete_tb").show();
        $("#btnResume_tb").show();
        $("#btnRealDelete").show();
        $("#btnResume").show();
        $("#btnRevision").hide();
        $("#btnEdit_tb").hide();
        $("#btnDelete_tb").hide();
        $("#btnAdjust_tb").hide();

        $("#jqPerformanceComplain").showCol("DeleteEmployeeName");
        $("#jqPerformanceComplain").showCol("DeleteDate");
        $("#jqPerformanceComplain").showCol("DeleteRemark");
    }

    else
    {
        $("#btnRealDelete_tb").hide();
        $("#btnResume_tb").hide();
        $("#btnRevision").show();
        $("#btnEdit_tb").show();
        $("#btnDelete_tb").show();
        $("#btnAdjust_tb").show();
        $("#jqPerformanceComplain").hideCol("DeleteEmployeeName");
        $("#jqPerformanceComplain").hideCol("DeleteDate");
        $("#jqPerformanceComplain").hideCol("DeleteRemark");
    }
}


function selectAccount(aim)
{
    var corpID = $("#ddlCorp").val();
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?type=account&From=AssessBook&CorpID=' + corpID, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid" + aim + "ID").value = vValue.split('|')[0];
        getObj("txt" + aim).value = vValue.split('|')[1];
    }
}


function renderLink(cellvalue, options, rowobject)
{
    var url = "'VPerformanceComplainBrowse.aspx?PCID=" + rowobject[0] + "'";
    return '<a href="#ShowPerformanceComplainBrowse" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
}


function changeCorp(vCTID, vCID)
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

    if (sCropID != "")
    {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, IsNoSelect: "Y" }, function (data, textStatus)
        {
            loadExamPlan(data, vCTID + '|' + vCID);
        }, 'json');
    }
    else
    {
        loadExamPlan([], vCTID + '|' + vCID);
    }
}
// 绑定考核计划
var loadExamPlan = function (data, vID)
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

    if (ddlExamPlan.options.length > 0)
    {
        if (vID.split('|')[0] != "")
        {
            ddlExamPlan.value = vID.split('|')[0];
        }

    }
    else
    {
        $("<option value=''>全部</option>").appendTo(ddlExamPlan);
    }    
}
function reloadData()
{
    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }
    var jqObj = $('#jqPerformanceComplain', document);

    var CorpID = $("#ddlCorp").val();
    var ExamID = $("#ddlExamPlan").val();
    var isDelete = $("#ddlIsDelete").val();
    var vKey = $("#txtKey").val();

    var CreatorAccountID = $("#hidCreateAccountID").val();
    var CCState = $("#ddlCCState").val();

    var CreateDateStart = $("#txtCreateDateStart").val();
    var CreateDateEnd = $("#txtCreateDateEnd").val();
    var DealAccountID = $("#hidDealAccountID").val();
    var AddClass = $("#ddlAddClass").val();

    if (CreateDateStart != "" && CreateDateEnd != "" && compareDate(CreateDateStart, CreateDateEnd) == -1)
    {
        _PageMaster.isSearching = false;
        return alertMsg("结束时间必须大于开始时间。", getObj("txtCreateDateEnd"));
    }

    jqObj.getGridParam('postData').CorpID = CorpID;
    jqObj.getGridParam('postData').ExamID = ExamID;
    jqObj.getGridParam('postData').IsDelete = isDelete;
    jqObj.getGridParam('postData').SearchText = vKey;
    jqObj.getGridParam('postData').CCState = CCState;
    jqObj.getGridParam('postData').CreatorAccountID = CreatorAccountID;
    jqObj.getGridParam('postData').CreateDateStart = CreateDateStart;
    jqObj.getGridParam('postData').CreateDateEnd = CreateDateEnd;
    jqObj.getGridParam('postData').DealAccountID = DealAccountID;
    jqObj.getGridParam('postData').AddClass = AddClass;

    refreshJQGrid('jqPerformanceComplain');
}

function customGridComplete()
{
    _PageMaster.isSearching = false;
}

//选择岗位
function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&From=Project&CorpID=' + getObj('hidCorpID').value, 700, window.screen.availheight);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

//选择部门
function btnSelectLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&From=Project&CorpID=' + getObj('hidCorpID').value, 700, window.screen.availheight);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}



//修改提交验证
function validateSize()
{
    var isNeedCheck = $("#hidIsNeedCheck").val();
    if (isNeedCheck == "N" && getObj("txtOldPABNo").value == "")
    {
        return alertMsg("申诉内部编号不能为空。", getObj("txtOldPCNo"));
    }
    if (getObj("txtPCName").value == "")
    {
        return alertMsg("申诉标题不能为空。", getObj("txtPCName"));
    }

    return true;
}