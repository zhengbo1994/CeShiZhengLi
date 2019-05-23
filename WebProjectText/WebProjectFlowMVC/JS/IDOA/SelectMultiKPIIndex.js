// VSelectMultiKPIIndex.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-04-17

function reloadData() {
    var ICID = $("#ddlClass").val();
    var IndexType = $("#ddlIndexType").val();
    var vKey = $("#txtKey").val();
    var IndexCycle = $("#ddlIndexCycle").val();
    var BSID = $("#ddlBSID").val();
    var ExistIDs = $('#hidExistIndexIDs').val();
    var HasLoaded = $('#hidHasLoaded').val();
    var jqgObj = $('#jqKPIIndex', document);

    jqgObj.getGridParam('postData').ICID = ICID;
    jqgObj.getGridParam('postData').IndexType = IndexType;
    jqgObj.getGridParam('postData').SearchText = vKey;
    jqgObj.getGridParam('postData').IndexCycle = IndexCycle;
    jqgObj.getGridParam('postData').BSID = BSID;
    jqgObj.getGridParam('postData').ExistIDs = ExistIDs;
    jqgObj.getGridParam('postData').HasLoaded = HasLoaded;

    setTimeout(function () {
        refreshJQGrid('jqKPIIndex');
    }, 500);
}

function btnChoose_Click() {
    var IndexIDs = getJQGridSelectedRowsID('jqKPIIndex', true);
    var ICIDs = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'ICID').join());
    var IndexNames = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'IndexName').join());
    var IndexClassNames = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'ICName').join());
    var IndexTypes = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'IndexType').join());
    var IndexTypeNames = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'IndexTypeName').join());
    var IndexCycles = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'IndexCycle').join());
    var IndexCycleNames = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'IndexCycleName').join());
    var ScoreStandards = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'ScoreStandard').join());
    var Remarks = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'Remark').join());
    var BSIDs = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'BSID').join());
    var BSNames = stripHtml(getJQGridSelectedRowsData('jqKPIIndex', true, 'BSName').join());

    if (!IndexIDs || IndexIDs.length == 0) {
        alert("请至少选择一个指标");
        return false;
    }
    IndexIDs = stripHtml(IndexIDs.join());

    var returnJson = {
        IndexIDs: IndexIDs,
        ICIDs:ICIDs,
        IndexNames: IndexNames,
        IndexClassNames: IndexClassNames,
        IndexTypes: IndexTypes,
        IndexTypeNames: IndexTypeNames,
        IndexCycles: IndexCycles,
        IndexCycleNames: IndexCycleNames,
        ScoreStandards: ScoreStandards,
        Remarks: Remarks,
        BSIDs: BSIDs,
        BSNames: BSNames
    };

    window.returnValue = returnJson;
    window.close();
}