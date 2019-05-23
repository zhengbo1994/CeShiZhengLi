var pageArgu = {};
var $topCorp = null;
$(function ()
{
    $topCorp = $("#ddlCorp", window.parent.document);

    reloadFlowTypeData();
});

//初始化
function initData()
{
    var $tbMod = $("#tbMod");
    var $spanSon = $tbMod.find("span");
    var prevClickSpan = null;

    //绑定事件
    $spanSon.click(function ()
    {
        if (prevClickSpan == null || prevClickSpan != this)
        {
            if (prevClickSpan)
            {
                $(prevClickSpan).removeClass("selNode").addClass("normalNode");
                prevClickSpan = this;
                pageArgu.FlowType = prevClickSpan;
                window.parent.frames("Main").reloadData();
            }
            else
            {
                prevClickSpan = this;
                pageArgu.FlowType = prevClickSpan;
                $("iframe", window.parent.document)[1].src = "VMonthFlowRunningAuditMain.aspx";
            }
            $(this).removeClass("normalNode").addClass("selNode");
        }
    });

    if ($spanSon.length != 0)
    {
        $spanSon[0].click();
    }
}

function reloadFlowTypeData()
{
    ajaxRequest("VMonthFlowRunningAuditLeft.aspx", { AjaxRequest: true, CorpID: $topCorp.val() }, "html", refreshFlowType, false);
}

function refreshFlowType(data)
{
    $(document.body).html(data);
    initData();
}