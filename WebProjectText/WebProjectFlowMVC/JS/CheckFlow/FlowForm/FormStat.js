// JScript 文件

// VFormStat.aspx用到的js

// 页面初始化
function loadPage()
{
    // 设置按钮靠右
    var title = $(".open_u")[0];
    var desc = $(".pagedesc")[0];
    title.insertAdjacentElement("afterBegin", desc);
    $(".pagedesc").css("float", "right");

    if (getObj("hidCols"))
    {
        window["FormCols"] = $.stringToJSON($("#hidCols").val());
        window["FormSels"] = $.stringToJSON($("#hidSels").val());

        initCols();
        initFilter();
    }
}

// 初始化表单列
function initCols()
{
    var _cols = window["FormCols"];
    for (var k in _cols)
    {
        var row = tbCols.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = stringFormat('<input type="checkbox" class="idbox" value="{0}" onclick="selectRow(this)" checked/>', k);
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerText = _cols[k][0];

        cell = row.insertCell(2);
        cell.align = "center";
        cell.innerHTML = '<input type="checkbox" class="idbox" onclick="setSort()"/>';

        cell = row.insertCell(3);
        cell.innerHTML = '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(1)" onfocus="this.blur()" title="上移" style="margin-right:0">∧</button> \n'
            + '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(0)" onfocus="this.blur()" title="下移" style="margin-right:0">∨</button>'
        cell.align = "center";

        setRowAttributes(row);
    }
}

// 初始化筛选条件
function initFilter()
{
    // 綁定审核状态下拉框
    bindCheckStateDDL();
    
    var _cols = window["FormCols"];
    var _sels = window["FormSels"];
    var i = 0;
    var row, cell;
    for (var k in _cols)
    {
        var html = "";
        var title = _cols[k][0];
        var colDataType = _cols[k][1];

        if (++i % 2)
        {
            row = tbFilter.insertRow();
            cell = row.insertCell(0);
            cell.className = "font";
            cell = row.insertCell(1);
        }
        else
        {
            cell = row.insertCell(2);
            cell = row.insertCell(3);
            cell.className = "font";
            cell = row.insertCell(4);
        }

        switch (colDataType)
        {
            case "0":
                title += "(关键字)";
                html = '<input type="text" class="text" onfocus="setIDText(this,0)" onblur="setIDText(this,1);blurFV(0)" onkeyup="checkLen(200)"/>';
                break;
            case "2":
            case "3":
                title += "(范围)";
                html = '<table class="idtb"><tr><td style="width:49%">'
                    + '<input type="text" class="text" maxlength="50" onfocus="setIDText(this,0)" onblur="setIDText(this,1);blurFV(1)"/>'
                    + '</td><td class="font" style="width:2%">至</td><td style="width:49%">'
                    + '<input type="text" class="text" maxlength="50" onfocus="setIDText(this,0)" onblur="setIDText(this,1);blurFV(1)"/>'
                    + '</td></tr></table>';
                break;
            case "4":
                title += "(范围)";
                html = '<table class="idtb"><tr><td style="width:49%">'
                    + '<input type="text" class="dt_date" onkeydown="skipEnter()" onfocus="selectDate()" readonly/>'
                    + '</td><td class="font" style="width:2%">至</td><td style="width:49%">'
                    + '<input type="text" class="dt_date" onkeydown="skipEnter()" onfocus="selectDate()" readonly/>'
                    + '</td></tr></table>';
                break;
            case "5":
                html = '<div class="font" style="width:100%">'
                    + '<label><input type="radio" name="Bool{0}" class="idbox" checked />&nbsp;全部</label>&nbsp;&nbsp;'
                    + '<label><input type="radio" name="Bool{0}" class="idbox" />&nbsp;是</label>&nbsp;&nbsp;'
                    + '<label><input type="radio" name="Bool{0}" class="idbox" />&nbsp;否</label>'
                    + '</div>';
                break;
            case "6":
            case "7":
                title += (colDataType == 6 ? "(属于)" : "(包含)");
                var sels = _sels[_cols[k][2]] || [];
                html = '<div class="font" style="width:100%">';
                for (var j = 0; j < sels.length; j++)
                {
                    html += stringFormat('<label style="display:block;margin:2px 0"><input type="checkbox" class="idbox" value="{0}"/>&nbsp;{1}</label>', sels[j][0], sels[j][1]);
                }
                html += '</div>';
                break;
        }
        row.cells[cell.cellIndex - 1].innerText = title;
        cell.field = k;
        cell.ctp = colDataType;
        cell.innerHTML = html;
    }
}

function bindCheckStateDDL()
{
    var url = getCurrentUrl(),
        formID = getParamValue("FormID");

    ajax(url,
    { action: "GetCheckState", formID: formID },
    "json",
    function (data)
    {
        if (data && data.Data)
        {
            var dataSource = $.stringToJSON(data.Data);
            bindDdl(dataSource, 'ddlCheckState');
        }
        return false;
    });
}

// 设置排序列
function setSort()
{
    var bExist = false;
    var chk = getEventObj();
    var tr = getParentObj(chk, "tr");
    var chkSelect = getObjC(tr, "input", 0);
    var field = chkSelect.value;
    var title = tr.cells[1].innerText;

    for (var i = 1; i < tbSort.rows.length; i++)
    {
        if (getObjC(tbSort.rows[i], "input", 0).value == field)
        {
            bExist = true;
            !chk.checked && (tbSort.deleteRow(i));
            break;
        }
    }

    if (chk.checked && !bExist)
    {
        var row = tbSort.insertRow();
        var cell = row.insertCell(0);
        cell.innerText = title;

        cell = row.insertCell(1);
        cell.align = "center";
        cell.innerHTML = stringFormat('<input type="hidden" value="{0}"/>'
            + '<label><input type="radio" name="Sort{0}" class="idbox" checked/>&nbsp;升序</label>&nbsp;&nbsp;'
            + '<label><input type="radio" name="Sort{0}" class="idbox"/>&nbsp;降序</label>', field);

        cell = row.insertCell(2);
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

function selectRow(obj)
{
    checkSelectAll(tbCols);
    // 屏蔽公共方法（不需要选中行改变颜色）
}
function selectRowFromSelectAll(obj)
{
    // 屏蔽公共方法（不需要选中行改变颜色）
}

// 文本、数字条件值blur事件（opt：0:文本/1:数字）
function blurFV(opt)
{
    var txt = getEventObj();
    if (trim(txt.value) == "" || opt == "1" && isNaN(txt.value))
    {
        txt.value = "";
    }
    else if (opt == "1")
    {
        setRound(2);
    }
}

// 统计校验
function validate()
{
    var cols = "";
    var sort = "";
    var filter = "";

    var bHasCols = false;
    for (var i = 1; i < tbCols.rows.length; i++)
    {
        var chkCol = getObjTR(tbCols, i, "input", 0);
        if (chkCol.checked)
        {
            bHasCols = true;
            cols += "," + chkCol.value;
        }
    }
    if (!bHasCols)
    {
        return alertMsg("请选择要统计的表单列。");
    }
    if (tbSort.rows.length < 2)
    {
        return alertMsg("请设置排序列。");
    }

    for (var i = 1; i < tbSort.rows.length; i++)
    {
        var chkSort = getObjTR(tbSort, i, "input", 0);
        var rdoAsc = getObjTR(tbSort, i, "input", 1);

        sort += stringFormat("&{0}:{1}", chkSort.value, rdoAsc.checked ? "ASC" : "DESC");
    }

    for (var i = 0; i < tbFilter.cells.length; i++)
    {
        var cell = tbFilter.cells[i];
        if (cell.field)
        {           
            var value1 = "";
            var value2 = "";
            switch (cell.ctp)
            {
                case "0":
                    value1 = formatFormValue(getObjC(cell, "input", 0).value);
                    break;
                case "2":
                case "3":
                case "4":
                    value1 = getObjC(cell, "input", 0).value;
                    value2 = getObjC(cell, "input", 1).value;
                    if (value1 && value2)
                    {
                        if (cell.ctp == "4" && compareDate(value1, value2) < 0)
                        {
                            return alertMsg("日期范围的大值不能早于小值。", getObjC(cell, "input", 1));
                        }
                        else if (inValues(cell.ctp, "2", "3") && parseFloat(value1) > parseFloat(value2))
                        {
                            return alertMsg("数字范围的大值不能小于小值。", getObjC(cell, "input", 1));
                        }
                    }
                    break;
                case "5":
                    value1 = getObjC(cell, "input", 1).checked ? "Y" : (getObjC(cell, "input", 2).checked ? "N" : "");
                    break;
                case "6":
                    var objs = $(cell).find('input[checked],select option[selected]');
                    value1 = "";
                    objs.each(function ()
                    {
                        if (this.tagName.toLocaleLowerCase() == "input")
                        {
                            value1 += "," + formatFormValue(this.parentNode.innerText);
                        }
                        else if (this.tagName.toLocaleLowerCase() == "option" && this.value != "")
                        {
                            value1 += "," + formatFormValue(this.text);
                        }
                    })
                    if (value1)
                    {
                        value1 = value1.substr(1);
                    }
                    break;
                case "7":
                    var objs = cell.getElementsByTagName("input");
                    for (var j = 0; j < objs.length; j++)
                    {
                        if (objs[j].checked)
                        {
                            value1 += "," + formatFormValue(objs[j].parentNode.innerText);
                        }
                    }
                    if (value1)
                    {
                        value1 = value1.substr(1);
                    }
                    break;
            }
            if (value1 || value2)
            {
                filter += stringFormat("&{0}:{1}|{2}", cell.field, value1, value2);
            }
        }
    }

    cols && (cols = cols.substr(1));
    sort && (sort = sort.substr(1));
    filter && (filter = filter.substr(1));

    $("#hidStatCols").val(cols);
    $("#hidSort").val(sort);
    $("#hidFilter").val(filter);

    return true;
}

// 格式化条件值（替换特殊字符）
function formatFormValue(value)
{
    return trim(value.replace(/[&]/g, '＆').replace(/[:]/g, '：').replace(/[|]/g, '｜').replace(/[,]/g, '，'));
}

// 导出统计结果
function exportStatValue()
{
    var data = { PageIndex: 1, PageSize: 10000 };
    if (window["idPager_QueryData"])
    {
        data = mergeJsonData({}, [data, window["idPager_QueryData"]], true);
    }

    ajaxExportByData(location.href, data);
}