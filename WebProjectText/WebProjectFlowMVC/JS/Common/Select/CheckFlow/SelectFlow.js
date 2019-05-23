// 选择流程页VSelectFlow.aspx用到的js
// 作者：程爱民
// 日期：2011-11-15


// VSelectFlow.aspx的js

var scrollTop = 0;
var scrollLeft = 0;

// 切换公司
function changeCorp()
{
    execFrameFuns("Left", function(){window.frames("Left").loadFlowType($("#ddlCorp").val());});
}

// 切换模块
function changeMod()
{
    execFrameFuns("Main", function(){window.frames("Main").reloadData();});
}


// VSelectFlowLeft.aspx的js

// 加载流程类别
function loadFlowType(corpID)
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    
    window.parent["CorpID"] = corpID;
    ajax("VSelectFlowLeft.aspx", { "CorpID": corpID }, "html", refreshFlowType);
}

// 刷新流程类别
function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);
    
    divMPList.scrollTop = scrollTop;
    divMPList.scrollLeft = scrollLeft;
    
    var spanID = window["TreeNode_Selected"];
    if (!spanID)
    {
        spanID = "span_0";
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["FlowTypeID"] = null;
    }
}

// 显示流程列表
function showFlowList(span, ftID)
{
    clickTreeNode(span);
    
    window.parent["FlowTypeID"] = ftID;
    execFrameFuns("Main", function(){window.parent.frames("Main").reloadData();}, window.parent);
}


// VSelectFlowMain.aspx的js

// 加载流程
function reloadData()
{
    var aim = getObjP("hidAim").value;
    var ddlMod = getObjP("ddlMod");
    var fmId = ddlMod.value;
    var kw = getObjP("txtKW").value;
    
    var query = { "CorpID":window.parent["CorpID"], "FlowTypeID":window.parent["FlowTypeID"], "FMID":fmId, "KW":kw };
    if (aim == "FormFlow")
    {
        query.FormID = window.parent.getParamValue("FormID");
    }
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// 流程名称项
function showFlowName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showFlow(\'' + options.rowId + '\')">' + cellvalue +'</a>';
}

// 查看流程
function showFlow(flowID)
{
    openWindow("../../../CheckFlow/Flow/VFlowBrowse.aspx?ID=" + flowID, 0, 0);
}

// 选择完成
function selectFlow(bClose)
{
    var aim = getObj("hidAim").value;
    var flowIDs = window.frames("Main").getJQGridSelectedRowsID("jqGrid1", true);

    if (flowIDs.length == 0)
    {
        alert("没有选择任何流程。");
        return false;
    }
    
    // 表单关联流程
    if (aim == "FormFlow")
    {
        window["IsClose"] = bClose;
        ajaxRequest("FillData.ashx", {"action": "AddFormFlow", "FlowIDs":flowIDs.join(","), "FormID":getParamValue("FormID"), "Title":window.dialogArguments.top.document.title},
            "text", finishAddFormFlow);
       return;     
    }
    
    if (bClose)
    {
        window.close();
    }
}

// 设置表单关联流程，刷新数据
function finishAddFormFlow(data, textStatus)
{
    if (data == "Y")
    {
        alert("操作成功。");
        if (!window["IsClose"])
        {
            window.frames("Main").reloadData();
        }
        window.dialogArguments.refreshJQGrid("jqGrid1");
        if (window["IsClose"])
        {
            window.close();
        }
    }
    else
    {
        alert(data);
    }
}
