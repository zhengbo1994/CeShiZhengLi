/// <reference path="../../Common/Select/CheckFlow/VSelectRelateChecker.aspx" />
/// <reference path="../../Common/Select/CheckFlow/VSelectRelateChecker.aspx" />
// JScript 文件
var pop;

$(document).ready(function ()
{
    // 在document加载完成后， 添加本js中所需组建： jsontool.js
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = rootUrl + "/JS/jquery.jsontool.js";
    document.body.appendChild(script);
});

/* 刷新jqGrid */
function reloadData()
{
    var ddlMod = getObjP("ddlFlowModel");
    var fmId = ddlMod.value;

    var query =
        {
            CorpID: getObjP("ddlCorp").value,
            FMID: fmId,
            FlowTypeID: getObjPF("Left", "hidSelID").value,
            CheckAccountID: getObjP("hidAccountID").value,
            AllowAccountID: getObjP("hidRightAccountID").value,
            GetChild: getObjP("ddlChild").value,
            KeyWord: getObjP("txtKW").value
        };
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// 加载所有流程类别
function loadFlowType()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    ajaxRequest("VFlowLeftDemo.aspx", { AjaxRequest: true, CorpID: getObjP("ddlCorp").value }, "html", refreshFlowType, false);
}

// 加载设置按钮
function showSet(cellvalue, options, rowobject)
{
    var flowId = options.rowId;
    return ($("#hidUseDesigner", parent.document).val() === "Y" ? '<a href="javascript:void(0)" onclick="javascript:openWindow(\'VFlowDesigner.aspx?FlowID=' + flowId + '\',1200,0)">设计</a>' : '')
        + ' <a href="javascript:void(0)" onclick="javascript:openWindow(\'../FlowForm/VFlowForm.aspx?FlowID=' + flowId + '\',0,0)">表单</a>';
}

//加载流程名称 a 标签链接
function showFlow(cellvalue, options, rowobject)
{
    return "<a  href='#ShowForm' onclick=\"openWindow('VFlowBrowseDemo.aspx?ID=" + options.rowId + "',0,0)\">" + cellvalue + "</a>";
}

//判断烈数据是否授权
function getEditAttachmentText(cellvalue, options, rowobject)
{
    var text = "";

    switch (cellvalue.toLocaleLowerCase())
    {
        case "true":
            text = "已授权";
            break;
        case "false":
            text = "未授权";
            break;
        default:
            text = "未授权";
            break;
    }

    return text;
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

//流程类别更换节点单击事件
function RefreshFlowType(span, flowtypeID, parentFlowTypeID, outLine)
{

    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    if (span != null)
    {
        span.className = "selNode";
        window.parent["Selected"] = span.id;
    }
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;
    execFrameFuns("Main", function () { window.parent.frames('Main').reloadData(); }, window.parent);
}
//选择公司 事件
function CorpChange()
{
    if ($('#ddlFlowModel').val() != '3F1E7A7C-995C-46F0-B3A9-70811B4D3129')
    {
        $('#btnPL').hide();
    }
    else
    {
        $('#btnPL').show();
    }
    $.post('FillData.ashx', { action: 'GetFlowType', FMID: getObj("ddlFlowModel").value, CorpID: getObj("ddlCorp").value }, function (data, textStatus) { FillFlowType(data); window.frames("Left").loaddata(); }, 'json');
}
//选择流程类型事件
function FillFlowType(data)
{
    $('#ddlFlowType option').remove();
    $('#ddlFlowType').get(0).options.add(new Option('请选择...', ''));
    $(data).each(function (i)
    {
        $('#ddlFlowType').get(0).options.add(new Option(data[i].text, data[i].value));
    });
    if ($("#ddlFlowType option[value='" + $('#hidFlowType').val() + "']").length > 0)
    {
        $('#ddlFlowType').val($('#hidFlowType').val());
    }
    else
    {
        $('#hidFlowType').val($('#ddlFlowType').val());
    }
}

//选择模块 事件
function FlowModelChange()
{
    var $btnMore = $("#btnMore");

    if ($btnMore.length === 1 && $("#hidPublishCompany").val() === "YXZY" && $("#hidSettingOper").val() === "Y")
    {
        var flowModelValue = $("#ddlFlowModel").val();
        var strCtrl = $("#hidCtrl").val();

        //strCtrl = strCtrl.substr(0, 3) + "1";
        // 个性流程设置（仅限付款申请和合同/合约模块模块）
        if (flowModelValue === "436D3C5F-A482-426F-9FD2-3E647E793E6E" || flowModelValue === "566C06CC-1DE8-4D88-B16B-81F31978BA9E")
        {
            strCtrl = strCtrl.substr(0, 4) + "1";
        }
        else
        {
            strCtrl = strCtrl.substr(0, 4) + "0";
        }

        $btnMore[0].onclick = function ()
        {
            showDLMenu(this, strCtrl)
        }
    }
    //重新加载
    window.frames("Main").reloadData();
}

//筛选选项类别关键字 单击事件
function btnSearch_Click(changeRange)
{
    if (changeRange && !getObjF("Left", "hidSelID").value)
    {
        return;
    }
    window.frames("Main").reloadData();
}

/////////////////页面展示显示部分完毕 END//////////////////////////////

////////////////加载审核人功能START////////////////////////////////////

//打开审核人页面按钮单击事件  VFlowDemo.aspx
function btnSelectAccount_Click(btn, accountid, accountname)
{  
    //打开ifram  传递公司corp
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployeeDemo.aspx?From=Leave&type=account&CorpID=' + $("#ddlCorp").val(), 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj(accountid).value = vValue.split('|')[0];
        getObj(accountname).value = vValue.split('|')[1];
        window.frames("Main").reloadData();
    }
}
/////////////审核人 授权人END///////////////////////////////////////


/////////////流程详情查询START//////////////////////////////////////////

//A标签 打开新的查询窗体 (VFlowMain.aspx 流程名称showflow)
function showFlow(cellvalue, options, rowobject)
{
    return "<a href='#ShowFrom' onclick=\"openWindow('VFlowBrowseDemo.aspx?ID=" + options.rowId + "',0,0)\">" + cellvalue + "</a>";
}

//切换Tab 选项卡效果
var selIndex = -1;
function showBrowseTab(index)
{
    if (selIndex == 2 && !jqGridIsComplete("jqGridForm"))
    {
        return alertMsg("数据未加载完毕，请稍后再试。");
    }

    selectTab(index, "BrowseInfo");

    for (var i = 0; i < 4; i++)
    {
        if (i != index)
        {
            getObj("info" + i).style.display = "none";
        }
    }

    getObj("info" + index).style.display = "";

    if (index === 1 && !getObj("info" + index).src)
    {
        getObj("info" + index).src = $("#hidUseDesigner").val() === "Y" ? "VFlowDesignerBrowseDemo.aspx?FlowID=" + getParamValue("ID")
            : 'VFlowShowTach.aspx?CorpID=' + $("#hidCorpID").val() + '&FlowID=' + getParamValue("ID") + "&IsNew=Y";
    }
    else if (index === 2 && loadJQGrid("jqGridForm"))
    {
        refreshJQGrid("jqGridForm");
    }

    selIndex = index;
}
