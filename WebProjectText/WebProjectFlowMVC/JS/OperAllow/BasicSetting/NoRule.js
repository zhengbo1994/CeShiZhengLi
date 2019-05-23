// VNoRule.aspx用到的js


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
    ajax(document.URL, { "DocType": window["DocType"], "ModCode": window["ModCode"] }, "json", function (data)
    {
        if (data.Success == "Y")
        {
            $("#tdCols").html(data.Data);
            $("#txtPrefix").val(data.Others[0]);
            $("#txtSuffix").val(data.Others[1]);
            $("#txtIsConsecutive").val(data.Others[2]);
            $("#txtIsRecalculateFormal").val(data.Others[3]);
        }
        else
        {
            alert(data.Data);
        }
    });
}

// 设置编号规则
function setNoRule()
{
    openWindow("VNoRuleSetting.aspx?DocType=" + window["DocType"] + "&ModCode=" + window["ModCode"], 800, 500);
}



// VNoRuleSetting.aspx用到的js

// 页面打开时，加载编号规则
function loadNoRule()
{
    var cols = $.stringToJSON($("#hidCols").val());
    $.each(cols, function (i, n)
    {
        var cell = tbColumn.insertRow().insertCell(0);
        cell.style.whiteSpace = "nowrap";
        cell.innerHTML = stringFormat('<span id="sc_{0}" class="normalNode" onclick="selCol(this,{0})">{1}</span>', i, n.ColName);
    });

    addCol(tbCols, 1, cols);
}

// 选择字段
function selCol(span,i)
{
    clickTreeNode(span);
    window["ColSelected"] = 1;
    window["ColIndex"] = i;
}

// 新增明细(opt：0:新增/1:修改)
function addCol(table, opt, cols)
{
    var arrDatas = [];
    if (opt)
    {
        cols.sort(function (x, y) { return parseInt(x.RowNo, 10) - parseInt(y.RowNo, 10); });

        $.each(cols, function (i, n)
        {
            if (n.IsEnable == "Y")
            {
                arrDatas.push(n);
            }
        });
    }
    else
    {
        cols = $.stringToJSON($("#hidCols").val());
        arrDatas.push(cols[window["ColIndex"]]);
    }
    for (var i = 0; i < arrDatas.length; i++)
    {
        if (!opt && !window["ColSelected"])
        {
            return alertMsg("请选择要添加的字段。");
        }
        if ($("#tbCols :checkbox[value=" + arrDatas[i].RuleColID + "]").length)
        {
            return alertMsg("该字段已存在，不能重复添加。");
        }

        var colType = parseInt(arrDatas[i].ColType, 10);
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, arrDatas[i].RuleColID);
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerText = arrDatas[i].ColName;
                
        cell = row.insertCell(2);
        switch (colType)
        {
            case 0:
            case 1:
            case 2:
            case 3:
                var rdoName = getUniqueKey("ST");
                cell.innerHTML = (arrDatas[i].ShowTypeList.indexOf("V") != -1 ? getRadioHtml("rdoV_" + rdoName, "编号", null, rdoName, arrDatas[i].ShowType == "V" ? 'checked' : '') : '')
                    + '&nbsp;&nbsp;'
                    + (arrDatas[i].ShowTypeList.indexOf("T") != -1 ? getRadioHtml("rdoT_" + rdoName, "名称", null, rdoName, arrDatas[i].ShowType == "T" ? 'checked' : '') : '');
                break;
            case 4:
                $.each(arrDatas[i].Types, function (i, n)
                {
                    cell.innerHTML += stringFormat("{0}: {1}<br/>", n.TypeName, getTextBoxHtml(null, 50, null, null, n.NoValue, null, "40px"));
                });
                break;
            case 7:
                cell.innerHTML = "位数: " + getTextBoxHtml(null, 50, null, "setRound(0,2,5)", arrDatas[i].SerialLength, null, "40px");
                break;
        }
        cell.align = "right";
        cell.style.padding = "0 10px";
        cell.style.whiteSpace = "nowrap";

        cell = row.insertCell(3);
        cell.innerHTML = getTextBoxHtml(null, 50, null, null, arrDatas[i].Separator, null, null, "center");

        cell = row.insertCell(4);
        cell.innerHTML = colType == 7 ? '' : ('<input class="idbox" type="checkbox" ' + ((arrDatas[i].IsComputable == "Y" || !opt) ? "checked" : "") + '/>');
        cell.align = "center";

        cell = row.insertCell(5);
        cell.innerHTML = '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(1)" onfocus="this.blur()" title="上移" style="margin-right:0">∧</button> \n'
            + '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(0)" onfocus="this.blur()" title="下移" style="margin-right:0">∨</button>'
        cell.align = "center";

        setRowAttributes(row);
    }
}

// 上下移动子表列
function moveCol(isUp)
{
    var row = getEventObj("tr");
    var table = getParentObj(row, "table");
    if (isUp && row.rowIndex > 1)
    {
        table.moveRow(row.rowIndex, row.rowIndex - 1);
    }
    else if (!isUp && row.rowIndex < row.parentNode.rows.length - 1)
    {
        table.moveRow(row.rowIndex, row.rowIndex + 1);
    }
    setTableRowAttributes(table);
}

// 删除明细
function delCol(table)
{
    deleteTableRow(table);
    setTableRowAttributes(table);
}

// 提交保存编号规则
function saveNoRule()
{
    var reg = /\d{2}/g;
    var serialIdx = -1;
    var errorColName;
    var txtErrorType;

    if (reg.test($("#txtSuffix").val()))
    {
        return alertMsg("后缀不允许包含连续2位的数字。", $("#txtSuffix"));
    }

    var rows = $("#tbCols tr:gt(0)");
    if (!rows.length)
    {
        return alertMsg("未设置任何字段。");
    }

    var cols = $.stringToJSON($("#hidCols").val());
    $.each(cols, function (i, n)
    {
        n.IsEnable = "N";
    });

    rows.each(function (i)
    {
        var row = $(this);
        var id = row.find("td:eq(0) :checkbox").val();
        $.each(cols, function (j, n)
        {
            var colType = parseInt(n.ColType, 10);
            if (n.RuleColID == id)
            {
                switch (colType)
                {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        n.ShowType = row.find("td:eq(2) :checked[id^=rdoV_]").length ? "V" : "T";
                        break;
                    case 4:
                        row.find("td:eq(2) :text").each(function (k)
                        {
                            n.Types[k].NoValue = $(this).val();
                            if (reg.test($(this).val()) && !txtErrorType)
                            {
                                txtErrorType = $(this);
                            }
                        });
                        break;
                    case 7:
                        serialIdx = i;
                        n.SerialLength = $.trim(row.find("td:eq(2) :text").val());
                        break;
                }

                if (colType != 4 && serialIdx >= 0 && i > serialIdx && !errorColName)
                {
                    errorColName = n.ColName;
                }

                n.Separator = i < rows.length - 1 ? $.trim(row.find("td:eq(3) :text").val()) : "";
                n.IsComputable = row.find("td:eq(4) :checked").length ? "Y" : "N";
                n.RowNo = i + 1;
                n.IsEnable = "Y";

                return false;
            }
        });
    });

    if (serialIdx < 0)
    {
        return alertMsg("编号字段必须包含“流水号”。");
    }
    if (errorColName)
    {
        return alertMsg("流水号后面不允许有“" + errorColName + "”（只允许有“类型”字段）。");
    }
    if (txtErrorType)
    {
        return alertMsg("“类型”字段的编号值不允许包含连续2位的数字。", txtErrorType);
    }

    var data = {
        "Prefix": $.trim($("#txtPrefix").val()),
        "Suffix": $.trim($("#txtSuffix").val()),
        "IsConsecutive": $("#rblIsConsecutive :checked").val(),
        "IsRecalculateFormal": $("#rblIsRecalculateFormal :checked").val(),
        "Data": $.jsonToString(cols)
    }

    ajax(document.URL, data, "json", function (data)
    {
        alert(data.Data);
        if (data.Success == "Y")
        {
            window.opener.reloadData();
            window.close();
        }
    });
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