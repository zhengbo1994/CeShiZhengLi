///改变被选中的节点样式
function changeBackColor(span) {
    var me = $(span);
    if (!me.hasClass("selNode")) {
        $(".selNode").removeClass("selNode").addClass("normalNode");
    }
    me.removeClass("normalNode").addClass("selNode");
}

//点击节点后(左边树调用)
function refreshExamOrgGradeInfo(ExamID, EOID, EOName,IsGraded) {
    var mainFrame = window.parent.frames('Main'),
        mainLocation = mainFrame.location,
        mainSearch = mainLocation.search,
        hasParas = mainSearch.length > 0,
        pathNameLength = hasParas ? mainLocation.href.indexOf(mainSearch) : mainLocation.href.length,
        mainPathName = mainLocation.href.substring(0, pathNameLength),
        jsonParams = hasParas ? mainFrame.getParams(mainSearch.substring(1)) : {},
        newHref;

    jsonParams["examid"] = ExamID;
    jsonParams["eoid"] = EOID;
    jsonParams["eoname"] = EOName;
    jsonParams["isgraded"] = IsGraded;

    newHref = addUrlParams(mainPathName, jsonParams);
   
    mainLocation.href = newHref;
}


// 进行评分修改
function editScores(EPSID, StruName, couldScore) {
    if (couldScore == "1") {
        var url = "VPerformanceScoreScopeEdit.aspx?EPSID=" + EPSID +
            "&StruName=" + encodeURI(StruName) + "&IsResultApproval=N";

        var returnInfo = openWindow(url, 900, 600);

        if (!!returnInfo) {
            this.location.reload();
        }
    }
    return false;
}

function refreshExamOrgGradeMain() {
    this.location.reload();
}