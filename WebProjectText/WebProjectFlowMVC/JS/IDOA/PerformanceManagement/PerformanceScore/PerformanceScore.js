// 绩效评分模块下页面的JS文件
// 作者：翁化青
// 时间：2012-04-20

/************ 公用方法  **************/
function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function setValidScore(len) {
    setNonMinusNum(len);
    var txt = getEventObj();
    if (txt.value > 100)
    { txt.value = 100; }
    else if (txt.value < 60) {txt.value = 60; }
}

function changeCorp(vCTID, vCID) {
    var sCropID = $("#ddlCorp").val();

    if (vCTID == null) {
        vCTID = "";
    }

    if (vCID == null) {
        vCID = "";
    }

    if (sCropID != "") {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, IsNoSelect: "Y" }, function (data, textStatus) {
            loadExamPlan(data, vCTID + '|' + vCID);
        }, 'json');
    }
    else {
        loadExamPlan([], vCTID + '|' + vCID);
    }
}
// 绑定考核计划
var loadExamPlan = function (data, vID) {
    var ddlExamPlan = getObj("ddlExamPlan");
    ddlExamPlan.options.length = 0;

    $(data).each(function (i,d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });

    if (ddlExamPlan.options.length > 0) {
        if (vID.split('|')[0] != "") {
            ddlExamPlan.value = vID.split('|')[0];
        }

    }
    else {
        $("<option value=''>全部</option>").appendTo(ddlExamPlan);
    }
}
function reloadData() {
    var StruType = $("hidStruType").val();

    var CorpID = $("#ddlCorp").val();
    var ExamID = $("#ddlExamPlan").val();
    var HasDone = $("#ddlHasDone").val();
    var ExamStartDate = $("#txtExamStartDate").val();
    var ExamEndDate = $("#txtExamEndDate").val();
    var vKey = $("#txtKey").val();
    var ExamCycle = $("#ddlExamCycle").val();
    var IsNeedSelfAssess = $('#ddlIsNeedSelfAssess').val();
    

    if (ExamStartDate != "" && ExamEndDate != "" && compareDate(ExamStartDate, ExamEndDate) == -1) {
        return alertMsg("结束时间必须大于开始时间。", getObj("txtExamEndDate"));
    }

    var jqgObj = $('#jqExamPlanScope', document);

    jqgObj.getGridParam('postData').StruType = StruType;
    jqgObj.getGridParam('postData').CorpID = CorpID;
    jqgObj.getGridParam('postData').ExamID = ExamID;
    jqgObj.getGridParam('postData').HasDone = HasDone;
    jqgObj.getGridParam('postData').ExamStartDate = ExamStartDate;
    jqgObj.getGridParam('postData').ExamEndDate = ExamEndDate;
    jqgObj.getGridParam('postData').SearchText = vKey;
    jqgObj.getGridParam('postData').ExamCycle = ExamCycle;
    jqgObj.getGridParam('postData').IsNeedSelfAssess = IsNeedSelfAssess;

    refreshJQGrid('jqExamPlanScope');
}
/************ 数据采集页方法  **************/
// 数据采集修改
function renderDataAcquisitionEdit(cellvalue, options, rowobject) {
    var HasDone = $("#ddlHasDone").val();    
    var url = "'VDataAcquisitionScopeEdit.aspx?EPSID=" + rowobject[0] +
        "&StruName=" + encodeURI(cellvalue) + "&JQID=jqExamPlanScope&HasDone=" + HasDone + "'";

    return '<a  href="javascript:void(0);" onclick="openWindow(' + url + ', 900, 600);">' + cellvalue + '</a>';
}


function validateDataAcquisition() {
    var dgArr = $("table[id$=dgKPIIndexList],table[id$=dgBehaviorIndexList],table[id$=dgProgressList]");  
    /* 获取所有DataGrid中的实际值TextBox*/   
    var txtActualValueArr = dgArr.find("input[id$=ActualValue]");

    var bValue = true;
    var errorObj = null;
    txtActualValueArr.each(function (i) {
        if (!!this && this.value == "") {
            bValue = false;
            errorObj = this;
            return false;
        }
    });
    if(!bValue)
    {
        return alertMsg("实际值不能为空。", errorObj);
    }

    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */
    setBtnEnabled("btnSaveClose", false);

    return true;
}


/************ 自评页方法  **************/
// 自评分修改
function renderSelfAssessScoreEdit(cellvalue, options, rowobject) {
    var HasDone = $("#ddlHasDone").val();
    var url = "'VSelfAssessScoreScopeEdit.aspx?EPSID=" + rowobject[0] +
            "&StruName=" + encodeURI(cellvalue) + "&JQID=jqExamPlanScope&HasDone=" + HasDone + "'";
    return '<a  href="javascript:void(0);" onclick="openWindow(' + url + ', 900, 600);">' + cellvalue + '</a>';
}

/* 验证是否全部自评分都填写完成 */
function validateSelfAssessScore() {
    var dgArr = $("table[id$=dgKPIIndexList],table[id$=dgBehaviorIndexList],table[id$=dgProgressList]");
    /* 获取所有DataGrid中的实际值TextBox*/
    var txtSelfAssessScoreArr = dgArr.find("input[id$=SelfAssessScore]");

    var bValue = true;
    var errorObj = null;
    var strErrorMsg="";
    txtSelfAssessScoreArr.each(function (i) {
        if (!!this && this.value == "") {
            strErrorMsg = "自评分不能为空。";
            bValue = false;
        }
        else if (parseFloat(this.value) != this.value.toString()) {
            strErrorMsg = "请输入有效数字。";
        }

        if (!bValue) {
            errorObj = this;
            return false;
        }
    });
    if (!bValue) {
        return alertMsg(strErrorMsg, errorObj);
    }

    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */
    setBtnEnabled(["btnSave", "btnSaveClose"], false);

    return true;
}

/************ 评分页方法  **************/
// 评分修改
function renderPerformanceScoreScopeEdit(cellvalue, options, rowobject) {
    var HasDone = $("#ddlHasDone").val();   
    if (rowobject[6] == "是")
        HasDone = "Y";
    var url = "'VPerformanceScoreScopeEdit.aspx?EPSID=" + rowobject[0] +
            "&StruName=" + encodeURI(cellvalue) + "&JQID=jqExamPlanScope&HasDone=" + HasDone + "'";

    return '<a href="javascript:void(0);" onclick="openWindow(' + url + ', 900, 600);">' + cellvalue + '</a>';
}

/* 验证是否全部评分都填写完成 */
function validatePerformanceScore() {
    var dgArr = $("table[id$=dgKPIIndexList],table[id$=dgBehaviorIndexList],table[id$=dgProgressList]");
    /* 获取所有DataGrid中的实际值TextBox*/
    var txtPerformanceScoreArr = dgArr.find("input[id$=ExamScore]");

    var bValue = true;
    var errorObj = null;
    var strErrorMsg = "";
    txtPerformanceScoreArr.each(function (i) {
        if (!!this && this.value == "") {
            strErrorMsg = "评分不能为空。";
            bValue = false;
        }
        else if (parseFloat(this.value) != this.value.toString()) {
            strErrorMsg = "请输入有效数字。";
        }

        if (!bValue) {
            errorObj = this;
            return false;
        }
    });
    if (!bValue) {
        return alertMsg(strErrorMsg, errorObj);
    }

    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */
    setBtnEnabled(["btnSave","btnSaveClose"], false);

    return true;
}