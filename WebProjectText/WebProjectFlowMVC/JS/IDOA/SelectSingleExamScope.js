// 作者：单云飞
// 时间：2012-07-05

function reloadData()
{
    refreshJQGrid('jqExamPlan');
}

function btnChoose_Click()
{
    var EPSID = getJQGridSelectedRowsID('jqExamPlan', false);
    var StruName = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'StruName'));
    var FinalScore = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'FinalScore'));
    var FinalLevelName = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'FinalLevelName'));
    var FinalEGID = stripHtml(getJQGridSelectedRowsData('jqExamPlan', false, 'FinalEGID'));

    EPSID = stripHtml(EPSID);

    var returnJson = {
        EPSID: EPSID,
        StruName: StruName,
        FinalScore: FinalScore,
        FinalLevelName: FinalLevelName,
        FinalEGID: FinalEGID
    };

    window.returnValue = returnJson;
    window.close();
}