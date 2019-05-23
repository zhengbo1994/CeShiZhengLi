// VPersonalShortcuts.aspx的js

// 页面初始化
function initPage()
{
    var type = getParamValue("Type");
    switch (type)
    {
        case "0":
            $("#btnAdd1").show();
            break;
        case "1":
            $("#btnAdd2,#btnAdd3,#btnAdd4").show();
            break;
        case "2":
            $("#btnAdd5").show();
            break;
    }

    reloadData();
}

// 新增/选择快捷方式
function selSC(scType)
{
    if (!$("#ddlType").val())
    {
        return alertMsg("请选择类别。", $("#ddlType"));
    }

    var url, width = 800, height = 600;

    switch (scType)
    {
        case 0:
            url = "SelectShortcuts/VSelectAPModel.aspx";
            width = 300;
            break;
        case 1:
            url = "SelectShortcuts/VSelectReport.aspx";
            break;
        case 2:
            url = "SelectShortcuts/VSelectFlow.aspx";
            break;
        case 3:
            url = "SelectShortcuts/VSelectForm.aspx";
            break;
        case 4:
            url = "SelectShortcuts/VSelectFlowModel.aspx";
            width = 300;
            break;
    }

    if (url)
    {
        var selectedIds = "";
        var tbSC = window["SCTable"];
        for (var j = 1; j < tbSC.rows.length; j++)
        {
            selectedIds += "," + getObjTR(tbSC, j, "input", 1).value;
        }
        if (selectedIds)
        {
            selectedIds = selectedIds.substr(1);
        }
        window["SelectedIDs"] = selectedIds;

        openModalWindow(url, width, height);

        var ids = window["SelectSC"];

        if (ids)
        {
            ajax(location.href, { "Action": "SaveData", "SCID": ids, "SCType": scType, "TypeID": $("#ddlType").val() }, "json", refreshSC);
        }
    }
}

// 删除
function delSC()
{
    openDeleteWindow("PersonalShortcuts", 0);
}

// 加载数据
function reloadData()
{
    ajax(location.href, { "Action": "GetData", "TypeID": $("#ddlType").val() }, "json", refreshSC);
}

// 刷新数据
function refreshSC(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);

        var table = getObjC(divMPList, "table", 0);
        window["SCTable"] = table;

        var len = table.rows.length;
        if (len > 1)
        {
            getObjTC(table, 1, 4, "a", 0).style.display = "none";
            getObjTC(table, len - 1, 4, "a", 1).style.display = "none";
        }
    }
    else
    {
        alert(data.Data);
    }
}

// 查看快捷方式
function showSC(scId, scType, url)
{
    switch (scType)
    {
        case 2:
            url = addUrlParam(url, "FlowID", scId);
            url = addUrlParam(url, "JQID", "");
            break;
        case 3:
            url = addUrlParam(url, "FormID", scId);
            url = addUrlParam(url, "JQID", "");
            break;
        case 4:
            url = addUrlParam(url, "JQID", "");
            break;
    }

    openWindow(url, 0, 0);
}

// 调整顺序
function moveSC(up)
{
    var tr1 = getEventObj("tr");
    var tr2 = up ? tr1.previousSibling : tr1.nextSibling;
    
    var key1 = getObjC(tr1, "input", 0).value;
    var rowNo1 = getObjC(tr1, "input", 2).value;
    var key2 = getObjC(tr2, "input", 0).value;
    var rowNo2 = getObjC(tr2, "input", 2).value;

    ajax(location.href, { "Action": "MoveData", "Key1": key1, "RowNo1": rowNo1, "Key2": key2, "RowNo2": rowNo2, "TypeID": $("#ddlType").val() }, "json", refreshSC);
}



// VSelectAPModel.aspx的js

// 页面初始化
function loadAPModel()
{
    window.dialogArguments["SelectSC"] = null;
    reloadAPModel();
}

// 加载菜单模块
function reloadAPModel()
{
    var modID = $("#ddlMod").val();
    if (modID)
    {
        if (window[modID])
        {
            $(divMPList).html(window[modID]);
        }
        else
        {
            ajax(location.href, { "RootModID": modID }, "json", refreshAPModel);
        }
    }
}

// 刷新菜单模块
function refreshAPModel(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
        var modID = getParams(this.data)["RootModID"];
        window[modID] = data.Data;
    }
    else
    {
        alert(data.Data);
    }
}



// VSelectFlow.aspx的js

// 加载流程类别
function loadFlowType()
{
    window.dialogArguments["SelectSC"] = null;
    setAjaxContainer(divFlowType);
    ajax(location.href, { "CorpID": $("#ddlCorp").val() }, "json", refreshFlowType);
}

// 刷新流程类别
function refreshFlowType(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#divFlowType").html(data.Data);

        var span = getObj("span_0");
        if (span)
        {
            span.click();
        }
    }
    else
    {
        alert(data.Data);
    }
}

// 显示流程列表
function showFlowList(span, ftID)
{
    clickTreeNode(span);

    window["FlowTypeID"] = ftID;
    reloadFlow();
}

// 加载流程
function reloadFlow()
{
    var query = { "CorpID": $("#ddlCorp").val(), "FlowTypeID": window["FlowTypeID"], "FMID": $("#ddlMod").val(), "KW": $("#txtKW").val() };
    
    reloadGridData("idPager", query);
}

// 查看流程
function showFlow()
{
    var tr = getEventObj("tr");
    var flowID = getObjC(tr, "input", 0).value;
    openWindow("../../../CheckFlow/Flow/VFlowBrowse.aspx?ID=" + flowID, 0, 0);
}



// VSelectForm.aspx的js

// 初始化
function loadForm()
{
    window.dialogArguments["SelectSC"] = null;
    var span = getObj("span_0");
    if (span)
    {
        span.click();
    }
}

// 显示表单列表
function showFormList(span, ftID)
{
    clickTreeNode(span);

    window["FormTypeID"] = ftID;
    reloadForm();
}

// 加载表单
function reloadForm()
{
    var query = { "FTID": window["FormTypeID"], "FMID": $("#ddlMod").val(), "KW": $("#txtKW").val() };

   reloadGridData("idPager", query);
}

// 查看流程
function showForm()
{
    var tr = getEventObj("tr");
    var formID = getObjC(tr, "input", 0).value;
    openWindow("../../../CheckFlow/FlowForm/VFormBrowse.aspx?FormID=" + formID, 800, 600);
}




// VSelectFlowModel.aspx的js

// 初始化
function loadFlowModel()
{
    window.dialogArguments["SelectSC"] = null;
}



// VSelectReport.aspx的js

// 初始化
function loadReport()
{
    window.dialogArguments["SelectSC"] = null;
    reloadReport();
}

// 加载报表
function reloadReport()
{
    var query = { "ModID": $("#ddlMod").val(), "KW": $("#txtKW").val() };

    reloadGridData("idPager", query);
}



// 选择快捷方式页面共用的js

// 选择快捷方式
function selectSC(scType)
{
    var bHaveRepeat = false;
    var chks = getObjs("chkIDV3");
    var ids = [];
    var scs = window.dialogArguments["SelectedIDs"].split(",");
    for (var i = 0; i < chks.length; i++)
    {
        if (chks[i].checked)
        {
            var repeat = false;
            for (var j = 0; j < scs.length; j++)
            {
                if (scs[j] == chks[i].value)
                {
                    repeat = true;
                    bHaveRepeat = true;
                    break;
                }
            }
            if (!repeat)
            {
                ids.push(chks[i].value);
                bAllRepeat = false;
            }
        }
    }
    if (!ids.length)
    {
        var scTypeName = ["菜单模块", "报表", "流程", "表单", "流程模块"][scType];

        return alertMsg((bHaveRepeat ? "不能重复添加" : "未选择任何") + scTypeName + "。");
    }

    window.dialogArguments["SelectSC"] = ids.join(",");
    window.close();
}



// VPersonalShortcutType.aspx的js

// 加载类别
function reloadSCT()
{
    ajax(location.href, { "Action": "GetSCT" }, "json", refreshSCT);
}

// 刷新类别
function refreshSCT(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

// 新增修改类别（action：0:新增/1:修改）
var dialogId;
function editSCT(action)
{
    var title;
    if (action == "AddSCT")
    {
        $("#hidPSCTID").val("");
        $("#txtPSCTName").val("");
        $("#txtRowNo").val("");
        title = "类别新增";
    }
    else
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk)
        {
            var tr = getParentObj(chk, "tr");
            $("#hidPSCTID").val(chk.value);
            $("#txtPSCTName").val(tr.cells[1].innerText);
            $("#txtRowNo").val(tr.cells[2].innerText);
        }
        else
        {
            return false;
        }
        title = "类别修改";
    }

    $("#hidAction").val(action);
    dialogId = showDialog({ "title": title, "htmlid": "divType", "width": 300, "height": 180, "id": dialogId });
}

// 删除类别
function delSCT()
{
    openDeleteWindow("PersonalShortcutType", 0);
}

// 提交新增修改
function submitEdit()
{
    if (!$("#txtPSCTName").val())
    {
        return alertMsg("类别名称不能为空。", $("#txtPSCTName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    ajax(location.href,
        {
            "Action": $("#hidAction").val(),
            "PSCTID": $("#hidPSCTID").val(),
            "PSCTName": $("#txtPSCTName").val(),
            "RowNo": $("#txtRowNo").val()
        }, "json", function (d, t)
        {
            cancelEdit();
            refreshSCT(d, t);
        });
}

// 取消修改
function cancelEdit()
{
    closeDialog(dialogId);
}