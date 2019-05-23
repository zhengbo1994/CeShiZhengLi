// VSelectSingleExamTask.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-10-12
function reloadData()
{
    var CorpID = $("#hidCorpID").val();
    var EWPID = $("#ddlExamWorkPlan").val();
    var vKey = $("#txtKey").val();

    var jqgObj = $('#jqgExamTask', document);
 
    jqgObj.getGridParam('postData').CorpID = CorpID;
    jqgObj.getGridParam('postData').EWPID = EWPID;
    jqgObj.getGridParam('postData').SearchText = vKey;

    refreshJQGrid('jqgExamTask');
}

function btnChoose_Click()
{
    var ETID = getJQGridSelectedRowsID('jqgExamTask', false);
    var TaskName = stripHtml(getJQGridSelectedRowsData('jqgExamTask', false, 'TaskName'));

    if (!ETID || ETID.length == 0)
    {
        alert("请选择一个考核任务");
        return false;
    }
    ETID = stripHtml(ETID);

    var returnJson = {
        ETID: ETID,
        TaskName: TaskName
    };

    window.returnValue = returnJson;
    window.close();
}