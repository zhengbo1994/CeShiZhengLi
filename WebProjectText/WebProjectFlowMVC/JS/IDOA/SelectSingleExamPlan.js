// VSelectSingleStation.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-04-17

function reloadData() {
    var CorpID = $("#hidCorpID").val();
	var ExamStartDate=$("#txtExamStartDate").val();
	var ExamEndDate=$("#txtExamEndDate").val();
	var vKey=$("#txtKey").val();
	var ExamCycle=$("#ddlExamCycle").val();
    var ScopeType=$("#ddlScopeType").val();
    var IsNeedSelfAssess = $('#ddlIsNeedSelfAssess').val();
    
    if (ExamStartDate != "" && ExamEndDate != "" && compareDate(ExamStartDate,ExamEndDate)==-1)
    {    
            return alertMsg("结束时间必须大于开始时间。", getObj("txtExamEndDate"));
    }

    var jqgObj = $('#jqExamPlan', document);

    jqgObj.getGridParam('postData').CorpID = CorpID; 
    jqgObj.getGridParam('postData').ExamStartDate=ExamStartDate; 
    jqgObj.getGridParam('postData').ExamEndDate=ExamEndDate; 
    jqgObj.getGridParam('postData').SearchText=vKey; 
    jqgObj.getGridParam('postData').ExamCycle=ExamCycle; 
    jqgObj.getGridParam('postData').ScopeType=ScopeType; 
    jqgObj.getGridParam('postData').IsNeedSelfAssess=IsNeedSelfAssess;
    
    refreshJQGrid('jqExamPlan');
}

function btnChoose_Click(){
    var ExamID = getJQGridSelectedRowsID('jqExamPlan', false);
    var ExamName = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'ExamName'));
    var CorpID = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'CorpID'));

    if (!ExamID || ExamID.length == 0)
    {
        alert("请选择一个考核工作计划");
        return false;
    }
    ExamID = stripHtml(ExamID);
    
    var returnJson = {
        ExamID:ExamID,
        ExamName:ExamName,
        CorpID: CorpID
    };
    
    window.returnValue = returnJson;
    window.close();    
}