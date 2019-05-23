function Add() {
    var url = "/" + rootUrl + "/CheckFlow/VCheckRequestAdd.aspx?DocType=FundPlan&JQID=jqGrid1";
    openAddWindow(url, 0, 0, "jqGrid1");
}


function revoke() {
    openRevokeWindow("RevokeFundPlanRequest", "jqGrid1");
}

//删除(合同修订只能删除未发出的)
function FundPlanReviseDel() {
    var isSend = getJQGridSelectedRowsData("jqGrid1", true, 'IsSend');

    for (var i = 0; i < isSend.length; i++) {
        if (isSend[i] == "Y") {
            return alertMsg("部分数据已发出，不能删除。");
        }
    }
    openDeleteWindow("FundPlanDelComplete", 1, "jqGrid1", null, { ID: ids }, true);
}
