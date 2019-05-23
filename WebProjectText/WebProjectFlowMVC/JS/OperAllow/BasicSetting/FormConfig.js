// VFormConfig.aspx用到的js

// 初始化
function loadConfig()
{
    var span = getObj("sp_0");
    if (span)
    {
        span.click();
    }
}

// 新增
function addFC()
{
    //校验表单类别是否存在
    if (window["FTID"] == undefined || window["FTID"] == null || window["FTID"] == "")
    {
        return alertMsg("没有可操作的表单类别。");
    }

    var selectedIds = "";
    var tbFC = window["FCTable"];
    if (tbFC != undefined && tbFC.rows != null)
    {
        for (var j = 1; j < tbFC.rows.length; j++) {
            var chk = getObjTR(tbFC, j, "input", 1);
            if (chk) {
                selectedIds += "," + chk.value;
            }
        }
    }    
    if (selectedIds)
    {
        selectedIds = selectedIds.substr(1);
    }
    window["SelectedIDs"] = selectedIds;

    openModalWindow("../../Common/Private/SelectShortcuts/VSelectFlowModel.aspx", 300, 600);

    var ids = window["SelectSC"];
    if (ids)
    {
        ajax(location.href, { "Action": "SaveData", "FTID": window["FTID"], "FCInfo": ids }, "json", finishSaveFC);
    }
}

// 刷新数据
function finishSaveFC(data, textStatus)
{
    if (data.Success == "Y")
    {
        cancelEdit();
        reloadData();
    }
    else
    {
        alert(data.Data);
    }
}

// 修改
function editFC()
{
    //添加当列表中无数据时的校验
    var chks = getObjs("chkIDV3");
    if (!chks || chks.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    var chk = getSelectedBox("chkIDV3");
    if (chk)
    {
        var tr = getParentObj(chk, "tr");
        var oldname = tr.cells[3].innerText;

        $("#txtFMName").val(oldname);
        $("#hidFCID").val(chk.value);

        window["DialogID"] = showDialog(
            {
                "title": "模块重命名",
                "htmlid": "divRename",
                "width": 300,
                "height": 120,
                "id": window["DialogID"]
            });
    } 
}

// 提交修改
function submitEdit()
{
    if (!$("#txtFMName").val())
    {
        return alertMsg("模块名称不能为空。", $("#txtFMName"));
    }

    ajax(location.href, { "Action": "UpdateName", "FCID": $("#hidFCID").val(), "FMName": $("#txtFMName").val() }, "json", finishSaveFC);
}

// 取消修改
function cancelEdit()
{
    closeDialog(window["DialogID"]);
}



// 删除
function delFC()
{
    openDeleteWindow("FormConfig", 0);
}

// 点击表单类别
function showFC(span, ftID)
{
    clickTreeNode(span);
    window["FTID"] = ftID;
    reloadData();
}

// 查看表单
function showForm(formID)
{
    openWindow("../../CheckFlow/FlowForm/VFormBrowse.aspx?FormID=" + formID, 800, 600);
}

// 刷新表单记录
function reloadData()
{
    var ftId = window["FTID"];
    if (!ftId)
    {
        return;
    }
    var ddlMod = getObj("ddlFlowMod");
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
    var kw = getObj("txtKW").value;

    ajax(location.href, { "Action": "GetData", "FTID": ftId, "FMID": fmId, "KW": kw }, "json", refreshFC, true, "POST");
}

// 刷新数据
function refreshFC(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divForm).html(data.Data);

        var table = getObjC(divForm, "table", 0);
        window["FCTable"] = table;
    }
    else
    {
        alert(data.Data);
    }
}