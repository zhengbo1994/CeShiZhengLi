/* 刷新jqGrid */
function reloadData()
{
    var ddlMod = getObjP("ddlFlowModel");
    var fmId = ddlMod.value;
    if (!fmId)
    {
        for (var i = 1; i < ddlMod.options.length; i++)
        {
            fmId += "," + ddlMod.options[i].value;
        }
        if (fmId)
        {
            fmId = fmId.substr(1);
        }
    }

    var query = { CorpID: getObjP("ddlCorp").value, FMID: fmId, FlowTypeID: getObjPF("Left", "hidSelID").value, Account: getObjP("hidAccountID").value, RightAccount: getObjP("hidRightAccountID").value, KeyWord: getObjP("txtKW").value, Child: getObjP("ddlChild").value };
    reloadGridData('idPager', query);

}

// 加载所有流程类别
function loadFlowType()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    ajaxRequest("VFlowRunningAuditLeft.aspx", { AjaxRequest: true, CorpID: getObjP("ddlCorp").value }, "html", refreshFlowType, false);
}
//大小写区别
function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);

    if (getObj("span_0") != null)
    {
        getObj("span_0").click();
    }
    else
    {
        RefreshFlowType(null, 'All', 'TotalFlowType', '0');
    }
}

///改变被选中的节点样式 
function ChangeBackColor(span)
{
    var obj = $(".selNode").each(
        function (i)
            {
                this.className="normalNode";
            }
        );

    span.className = "selNode";
}

function RefreshFlowType(span,flowtypeID, parentFlowTypeID, outLine)
{
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;

    ChangeBackColor(span);

    window.parent.reloadData();
}

function reloadData()
{
    var query = {
        FlowTypeID: getObjF("Left", "hidSelID").value,
        CorpID:$("#ddlCorp").val(),
        CCState:$("#ddlCCState").val(),
        KeyWord:$("#txtKey").val(),
        StartTime:$("#txtStartTime").val(),
        EndTime:$("#txtEndTime").val()
    }; 
    
    // 无条件时，省略第二个参数
    window.frames("Main").reloadGridData("idPager", query);
}

function ddlCorp_Change()
{
    window.frames("Left").loadFlowType()
    reloadData();
}

function ddlCCState_Change()
{
    reloadData();
}

function btnSearch_Click()
{
    reloadData();
}

function btnExport_Click()
{
    getObjF("Main", "btnExport").click();
}

