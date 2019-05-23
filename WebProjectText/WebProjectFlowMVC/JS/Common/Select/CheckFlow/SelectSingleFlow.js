// 选择流程页VSelectSingleFlow.aspx用到的js
// 作者：程爱民
// 日期：2011-11-15


// VSelectSingleFlow.aspx的js

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


// VSelectSingleFlowLeft.aspx的js

// 加载流程类别
function loadFlowType(corpID)
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    
    window.parent["CorpID"] = corpID;
    ajax("VSelectSingleFlowLeft.aspx", { "CorpID": corpID }, "html", refreshFlowType);
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
        var ftID = window.parent.getParamValue("FlowTypeID");
        if (ftID)
        {
            spanID = $("span[ftid=" + ftID + "]").attr("id");
        }
        if (!spanID)
        {
            spanID = "span_0";
        }
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
function showFlowList(span)
{
    clickTreeNode(span);
    
    window.parent["FlowTypeID"] = span.ftid;
    execFrameFuns("Main", function(){window.parent.frames("Main").reloadData();}, window.parent);
}


// VSelectSingleFlowMain.aspx的js

// 加载流程
function reloadData()
{
    var ddlMod = getObjP("ddlMod");
    var fmId = ddlMod.value;
    var kw = getObjP("txtKW").value;
    
    var query = { "CorpID":window.parent["CorpID"], "FlowTypeID":window.parent["FlowTypeID"], "FMID":fmId, "KW":kw };
    
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
function selectFlow()
{
    var flowID = window.frames("Main").getJQGridSelectedRowsID("jqGrid1", false);
    var flowName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGrid1', false, 'FlowName'));

    if (!flowID)
    {
        alert("请选择一个流程。");
        return false;
    }
    
    window.returnValue = { "FlowID": flowID, "FlowName": flowName };
    window.close();
}

// 清空选择
function clearFlow()
{
    window.returnValue = { "FlowID": "", "FlowName": "" };
    window.close();
}
