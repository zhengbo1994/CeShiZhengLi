// VNoColumn.aspx用到的js


// 点击模块显示编号字段
function showColumn(span, docType, modCode)
{
    if (span.isleaf == "N")
    {
        clickTGImg();
        return false;
    }

    clickTreeNode(span);

    window["DocType"] = docType;
    window["ModCode"] = modCode;

    reloadData();
}

// 加载编号字段
function reloadData()
{
    ajax(document.URL, { "Action": "GetData", "DocType": window["DocType"], "ModCode": window["ModCode"] }, "json", refreshColumn);
}

// 刷新编号字段
function refreshColumn(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#divCols").html(data.Data);
        $("#divCols td[types]").each(function ()
        {
            var cell = $(this);
            var types = $.stringToJSON(cell.attr("types"));
            $.each(types, function (k, v)
            {
                cell.html(cell.html() + stringFormat("<br/>{0}：{1}", v.code, v.name));
            });
        });
    }
    else
    {
        alert(data.Data);
    }
}

// 删除编号字段
function delColumn(docType, modCode)
{
    openDeleteWindow("NoRuleColumn", 0);
}

// 新增/修改编号字段（action：0:修改/1:新增）
var dialogId;
function editColumn(action)
{
    var title;
    $("#hidAction").val(action);
    clearTable(tbTypes);
    if (action == "AddData")
    {
        $("#hidRuleColID").val("");
        $("#hidTypes").val("");
        $("#txtColName").val("");
        $("#txtRowNo").val("");
        $("#ddlColType").val("");
        $("#txtNoCol").val("");
        $("#txtNameCol").val("");
        $("#txtRowNo").val("");
        title = "编号字段新增";
    }
    else
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk)
        {
            var cells = $(chk).closest("tr").children("td");
            $("#hidRuleColID").val(chk.value);
            $("#txtColName").val(cells.eq(1).text());
            $("#ddlColType").val(chk.ct);
            $("#txtNoCol").val(cells.eq(3).text());
            $("#txtNameCol").val(cells.eq(4).text());
            if (chk.ct == "4")
            {
                $("#hidTypes").val(cells.eq(2).attr("types"));
                addType(tbTypes, 1);
            }
            $("#txtRowNo").val(cells.eq(5).text());
        }
        else
        {
            return false;
        }
        setDisplay();
        title = "编号字段修改";
    }

    dialogId = showDialog({ "title": title, "htmlid": "divColumn", "width": 350, "height": 350, "id": dialogId });
}

// 提交新增修改
function submitEdit()
{
    var types = "";
    var colType = $("#ddlColType").val();
    if (!colType)
    {
        return alertMsg("字段类型不能为空。", $("#ddlColType"));
    }
    if (!$("#txtColName").val())
    {
        return alertMsg("字段名称不能为空。", $("#txtColName"));
    }
    if (colType == "0" && !$("#txtNoCol").val() && !$("#txtNameCol").val())
    {
        return alertMsg("为“自定义字段”时，必须设置编号值或名称值。", $("#txtNoCol"));
    }
    if (colType == "4")
    {
        var jsonDatas = [];
        var rows = $("#tbTypes tr");
        if (rows.length < 2)
        {
            return alertMsg("为“类型/枚举”时，必须设置类型项。", $("#btnAddDetail"));
        }
        for (var i = 1; i < rows.length; i++)
        {
            var chk = rows.eq(i).find(":checkbox");
            var txts = rows.eq(i).find(":text");
            if (!txts.eq(0).val())
            {
                return alertMsg("类型码不能为空。", txts.eq(0));
            }
            if (!txts.eq(1).val())
            {
                return alertMsg("类型名称不能为空。", txts.eq(1));
            }
            jsonDatas.push({ "code": txts.eq(0).val(), "name": txts.eq(1).val(), "no": chk.attr("no") });
        }
        types = $.jsonToString(jsonDatas);
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    ajax(location.href,
        {
            "Action": $("#hidAction").val(),
            "DocType": window["DocType"],
            "ModCode": window["ModCode"],
            "RuleColID": $("#hidRuleColID").val(),
            "ColName": $("#txtColName").val(),
            "ColType": $("#ddlColType").val(),
            "NoCol": $("#txtNoCol").val(),
            "NameCol": $("#txtNameCol").val(),
            "Types": types,
            "RowNo": $("#txtRowNo").val()
        }, "json", function (d, t)
        {
            cancelEdit();
            refreshColumn(d, t);
        });
}

// 取消新增修改
function cancelEdit()
{
    closeDialog(dialogId);
}

// 设置数据源条件
var dialogId2;
function setFilter()
{
    $("#txtDataFilter").val($("#divCols tr:last>td:eq(2)").text());
    dialogId2 = showDialog({ "title": "数据源条件", "htmlid": "divFilter", "width": 350, "height": 150, "id": dialogId2 });
}

// 提交新增修改
function saveFilter()
{
    ajax(location.href,
        {
            "Action": "SaveFilter",
            "DocType": window["DocType"],
            "ModCode": window["ModCode"],
            "DataFilter": $("#txtDataFilter").val()
        }, "json", function (d, t)
        {
            cancelFilter();
            refreshColumn(d, t);
        });
}

// 检查文本框输入的字节数（重写，不替换单引号）
function checkSize(txt, size)
{
    if (txt.value.replace(/[^\x00-\xff]/g, '**').length <= size)
    {
        return false;
    }

    txt.value = getStringByLength(txt.value, size, false);
}

// 取消新增修改
function cancelFilter()
{
    closeDialog(dialogId2);
}

// 切换字段类型
function setDisplay()
{
    var colType = $("#ddlColType").val();
    trNoCol.style.display = colType == "0" ? "" : "none";
    trNameCol.style.display = trNoCol.style.display;
    trTypeDetail.style.display = colType == "4" ? "" : "none";
    ($("#hidAction").val() == "AddData") && $("#txtColName").val(inValues(colType, "", "0", "4") ? "" : $("#ddlColType :selected").text());
}


// 新增明细(opt：0:新增/1:修改)
function addType(table, opt)
{
    var arrDatas = [];
    if (opt)
    {
        arrDatas = $.stringToJSON($("#hidTypes").val());
    }
    else
    {
        arrDatas.push({ "code": "", "name": "", "no": "" });
    }
    for (var i = 0; i < arrDatas.length; i++)
    {
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, null, { "no": arrDatas[i].no });
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerHTML = getTextBoxHtml(null, 10, null, null, arrDatas[i].code);

        cell = row.insertCell(2);
        cell.innerHTML = getTextBoxHtml(null, 50, null, null, arrDatas[i].name);

        setRowAttributes(row);
    }
}

// 删除明细
function delType(table)
{
    deleteTableRow(table);
    setTableRowAttributes(table);
}