// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

function selectExamScope(aim)
{
    var ExamPlanID = getObj("ddlExamPlan").value;
    if (ExamPlanID == "")
    {
        return alertMsg("请先选择考核计划！", getObj("ddlExamPlan"));
    }
    else
    {
        var vValue = openModalWindow('../../../Common/Select/IDOA/VSelectSingleExamScope.aspx?ExamID=' + ExamPlanID, 0, 0);

        if (vValue)
        {
            getObj("hd" + aim).value = vValue.EPSID;
            getObj("txt" + aim).value = vValue.StruName;
            getObj("txtBeforeScore").value = vValue.FinalScore;
            getObj("ddlBeforeLevel").value = vValue.FinalEGID;
            getObj("ddlAfterLevel").value = vValue.FinalEGID;

            // 将原等级保存在隐藏控件
            getObj("hdOriginEGID").value = vValue.FinalEGID;
        }
    }
}

function validateSize() {
    var ExamPlanID = getObj("ddlExamPlan").value;
    if (ExamPlanID == "") {
        return alertMsg("请选择考核计划！", getObj("ddlExamPlan"));
    }

    if (getObj("hdExamScope").value == "") {
        return alertMsg("请选择考核对象！", getObj("txtExamScope"));
    }

    if (getObj("txtAfterScore").value == "") {
        return alertMsg("请输入调整后的分数！", getObj("txtAfterScore"));
    }

    if (getObj("ddlAfterLevel").value == "")
    {
        return alertMsg("请选择调整后的等级！", getObj("txtAfterScore"));
    }

    if (!isScorePercent(getObj("txtAfterScore").value)) {
        return alertMsg("调整后的分数只能为数字！", getObj("txtAfterScore"));
    }

    if (getObj("txtRemark").value == "") {
        return alertMsg("请输入调分原因！", getObj("txtRemark"));
    }

    getObj("hdEPSID").value = getObj("hdExamScope").value

    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */
    disabledButtonsWhenSubmit();

    return true;
}

function disabledButtonsWhenSubmit() {
    setBtnEnabled("btnSave", false);
}


// 根据公司获取考核计划
function ddlCorp_change(vCTID, vCID)
{
    var sCropID = $("#ddlCorp").val();
    var sAccountID = getObj("hdAccountID").value;
    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    getObj("ddlExamPlan").options.length = 0;

    if (sCropID != "")
    {
        $.post('FillData.ashx', { action: 'GetAdjustExamPlanByCorpID', CorpID: sCropID, AccountID: sAccountID, IsNoSelect: "N" },
        function (data, textStatus) { loadExamPlan(data, vCTID + '|' + vCID); }, 'json');
    }
}


// 绑定考核计划
var loadExamPlan = function (data, vID) {
    var ddlExamPlan = getObj("ddlExamPlan");
    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });

    if (getObj("ddlExamPlan").options.length > 0) {
        if (vID.split('|')[0] != "") {
            getObj("ddlExamPlan").value = vID.split('|')[0];
        }

    }
    else {
        $("<option value=''>请选择</option>").appendTo('#ddlExamPlan');
    }
}


//根据考核计划变动
function ddlExamPlan_change()
{
    getObj("hdExamScope").value = "";
    getObj("txtExamScope").value = "";
    getObj("txtBeforeScore").value = "";
    getObj("ddlBeforeLevel").value = "";
    getObj("ddlAfterLevel").value = "";

    // 将原等级保存在隐藏控件
    getObj("hdOriginEGID").value = "";


 }

// 获取分数
function getExamScore(vCTID, vCID) {

    getObj("txtBeforeScore").value = "";

    if (getObj("hdExamScope").value != "") {

        var sEPSID = $("#hdExamScope").val();

        if (vCTID == null) {
            vCTID = "";
        }

        if (vCID == null) {
            vCID = "";
        }

        $.post('FillData.ashx', { action: 'GetExamScoreByEPSID', EPSID: sEPSID }, function (data, textStatus) { loadExamScore(data, vCTID + '|' + vCID) }, 'json');
    }
}

// 显示考核分数
var loadExamScore = function (data, vID) {
    if (data != null) {
        getObj("txtBeforeScore").value = data[0].FinalScore;
        getObj("ddlBeforeLevel").value = data[0].FinalEGID;
        getObj("ddlAfterLevel").value = data[0].FinalEGID;

        // 将原等级保存在隐藏控件
        getObj("hdOriginEGID").value = data[0].FinalEGID;
    }
}
