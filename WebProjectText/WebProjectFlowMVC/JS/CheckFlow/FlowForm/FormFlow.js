// JScript 文件

// VFormFlow.aspx用到的js

// 新增
function addFlow()
{
    var formId = getParamValue("FormID");
    var fmId = getParamValue("FMID");
    
    openModalWindow('../../Common/Select/CheckFlow/VSelectFlow.aspx?Aim=FormFlow&FMID=' + fmId + "&FormID=" + formId, 800, 600);
}

// 删除
function delFlow()
{
    openDeleteWindow("FormFlow", 0, "jqGrid1", null, {"FormID":getParamValue("FormID")});
}

// 流程名称项
function showFlowName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showFlow(\'' + options.rowId + '\')">' + cellvalue +'</a>';
}

// 权限
function showOperName(cellvalue, options, rowobject)
{
    return '<a href="javascript:setOper(\'' + options.rowId + '\')">设置</a>';
}

// 查看流程
function showFlow(flowId)
{
    openWindow("../Flow/VFlowBrowse.aspx?ID=" + flowId, 0, 0);
}

// 设置流程权限
function setOper(flowId)
{
    var formId = getParamValue("FormID");
    openWindow("VFormFlowOper.aspx?FormID=" + formId + "&FlowID=" + flowId, 800, 500);
}



// VFlowForm.aspx用到的js

// 新增
function addForm()
{
    var flowId = getParamValue("FlowID");
    var fmId = $("#hidFMID").val();

    var forms = openModalWindow('../../Common/Select/CheckFlow/VSelectForm.aspx?Aim=FlowForm&FMID=' + fmId + "&FlowID=" + flowId, 800, 600);
    if (!forms)
    {
        return false;
    }

    var formids = "";
    for (var i = 0; i < forms.length; i++)
    {
        formids += (i > 0 ? "," : "") + forms[i]["FormID"];
    }

    if (formids)
    {
        ajax(document.URL, { "FormIDs": formids }, "json", function (data)
        {
            if (data.Success === "Y")
            {
                refreshJQGrid("jqGrid1");
            }
            else
            {
                alert(data.Data);
            }
        });
    }
}

// 删除
function delForm()
{
    openDeleteWindow("FlowForm", 0, "jqGrid1", null, { "FlowID": getParamValue("FlowID") });
}

// 表单名称项
function showFormName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showForm(\'' + options.rowId + '\')">' + cellvalue + '</a>';
}

// 权限
function showOperName1(cellvalue, options, rowobject)
{
    return '<a href="javascript:setOper1(\'' + options.rowId + '\')">设置</a>';
}

// 查看表单
function showForm(flowId)
{
    openWindow("VFormBrowse.aspx?FormID=" + flowId, 800, 600);
}

// 设置表单权限
function setOper1(formId)
{
    var flowId = getParamValue("FlowID");
    openWindow("VFormFlowOper.aspx?FormID=" + formId + "&FlowID=" + flowId, 800, 500);
}


// VFormFlowOper.aspx用到的js

// 设置选择状态
function setSelectState()
{
    if (dgData && dgData.rows.length > 2)
    {
        if (getParamValue("From") == "Browse")
        {
            var chks = dgData.getElementsByTagName("input");
            for (var i = 0; i < chks.length; i++)
            {
                if (chks[i].type.toLowerCase() == "checkbox")
                {
                    chks[i].onclick = function () { return false; };
                }
            }
        }
        else
        {
            var creator = $(".sp_fname_g").closest("td");
            creator.find(":checkbox").removeAttr("onclick").bind("click", function () { return false; });

            creator.each(function ()
            {
                var i = $(this).index() + 2;
                $("tr:gt(1)", dgData).each(function ()
                {
                    $("td:eq(" + i + ") :checkbox", this).attr("checked", "checked").removeAttr("onclick").bind("click", function () { return false; });
                });
            });

            for (var i = 2; i < dgData.rows[2].cells.length; i++)
            {
                checkSelectAllCols(dgData, 1, i - 2, i, 2);
            }
        }
    }
}

// 查看列
function showColumn(formColId)
{
    openWindow("VFormColumnBrowse.aspx?FormColID=" + formColId, 500, 450);
}

// 保存
function saveOper()
{
    if (dgData)
    {
        if (dgData.rows[0].cells.length < 3)
        {
            return alertMsg("该流程不包含任何审批人。");
        }
        if (dgData.rows.length < 3)
        {
            return alertMsg("该表单不包含任何列。");
        }
        
        var jsonDatas = [];
        for (var i = 2; i < dgData.rows.length; i++)
        {
            var formColId = getObjTC(dgData, i, 1, "input", 0).value;
            for (var j = 2; j < dgData.rows[2].cells.length; j++)
            {
                var flsId = getObjTC(dgData, 1, j - 2, "input", 0).value;
                if (getObjTC(dgData, i, j, "input", 0).checked)
                {
                    jsonDatas.push({"FormColID":formColId, "FLSID":flsId});
                }
            }
        }
        
        var query = { "Action":"SaveOper", "FlowID":getParamValue("FlowID"), "FormID":getParamValue("FormID"), "Oper":$.jsonToString(jsonDatas)};
        ajax("VFormFlowOper.aspx", query, "json", afterSaveOper, true, "POST");
    }
}

// 保存条件成功
function afterSaveOper(data, textStatus)
{
    if (data.Success == "Y")
    {
        alert("操作成功。");
    }
    else
    {
        alert(data.Data);
    }
}