// VFormFormat.aspx用到的js

// 设置设计器的样式
function setEditorCss() {
    var doc = frames("txtHtmlText_editor").document;
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href) {
            doc.createStyleSheet().addImport(document.styleSheets[i].href);
        }
    }
    doc.createStyleSheet().addImport("../../css/CheckFlow/FormDesign/designer.css");
}

// 插入表单列
function insertFormCol(btn, rowIndex, colIndex, colType, colDataType, colLen, fmt) {
    if (txtHtmlText_HtmlMode) {
        return alertMsg("HTML模式下不能插入表单列，请切换到设计模式。");
    }

    var tags = ["input", "textarea", "select", "div", "table"];
    for (var i = 0; i < tags.length; i++) {
        var objs = frames("txtHtmlText_editor").document.getElementsByTagName(tags[i]);
        for (var j = 0; j < objs.length; j++) {
            if (objs[j].ctp && objs[j].field == colIndex) {
                return alertMsg("该表单列已经添加进设计器中，不能重复添加。");
            }
        }
    }
    var colHtml;
    var editor = txtHtmlText_editor;
    editor.focus();

    if (colType == "0" && colDataType == "5") {
        colHtml = stringFormat('<div class="fm_bool_div font" ctp="0,5" field="{0}">'
                + '<label><input type="radio" name="Bool{0}" class="idbox" />是</label>'
                + '<label><input type="radio" name="Bool{0}" class="idbox" checked />否</label>'
                + '</div>', colIndex);
    }
    else {
        var height = 300;
        switch (colType) {
            case "0":
            case "1":
            case "2":
                switch (colDataType) {
                    case "0":
                        height = colLen > 200 ? 230 : 180;
                        break;
                    case "1":
                        height = 230;
                        break;
                    case "2":
                    case "3":
                    case "4":
                    case "6":
                        height = 180;
                        break;
                    case "7":
                        height = 200;
                        break;
                }
                break;
            case "3":
            case "4":
                height = 400;
                break;
        }
        colHtml = openModalWindow("FormFormat/InsertFormCol.htm?RI=" + rowIndex + "&Field=" + colIndex
            + "&CT=" + colType + "&CDT=" + colDataType + "&CL=" + colLen + "&FMT=" + fmt + "&Title=" + encode(trim(btn.innerText)), 360, height, 0);
    }

    if (colHtml) {
        if (editor.document.selection.type == 'Control')
        {
            editor.document.selection.clear();
        }
        sel = editor.document.selection.createRange();
        sel.pasteHTML(colHtml);
    }
}

// 插入表单表格///////////////////////////////////该方法需要重写。。。。。。
function FTB_InsertTable(editor, htmlmode) {
    if (htmlmode)
    {
        return;
    }
    editor.focus();

    var tablescript = FTB_HelperFilesPath.substring(0, FTB_HelperFilesPath.length - 1) + 'FTB_InsertTable.htm';
    if (FTB_HelperFilesParameters != '')
    {
        tablescript += '?' + FTB_HelperFilesParameters;
    }
    tableArr = openModalWindow(tablescript, 360, 500, 0);

    if (tableArr != null) {
        var newTable = editor.document.createElement('TABLE');
        for (y = 0; y < tableArr['Rows']; y++)
        {
            var newRow = newTable.insertRow();
            for (x = 0; x < tableArr['Columns']; x++)
            {
                var newCell = newRow.insertCell();
                newCell.style.borderWidth = tableArr['CellBorderWidth'];
                if (tableArr['HAlignCells'] != "")
                {
                    newCell.align = tableArr['HAlignCells'];
                }
                if (tableArr['VAlignCells'] != "")
                {
                    newCell.valign = tableArr['VAlignCells'];
                }
                if (tableArr['chkPercentCols'] == true)
                {
                    newCell.style.width = Math.round((1 / tableArr['Columns']) * 100) + "%";
                }
                if (tableArr['CellBorderStyle'] != "")
                {
                    newCell.style.borderStyle = tableArr['CellBorderStyle'];
                }
                if (tableArr['chkCellBorderColor'] == true)
                {
                    newCell.style.borderColor = tableArr['CellBorderColor'];
                }
                if (tableArr['chkCellBackgroundColor'] == true)
                {
                    newCell.style.backgroundColor = tableArr['CellBackgroundColor'];
                }
            }
        }
        newTable.border = tableArr['Border'];
        newTable.cellspacing = tableArr['Cellspacing'];
        newTable.cellpadding = tableArr['Cellpadding'];
        if (tableArr['chkTableWidth'] == true)
        {
            newTable.style.width = tableArr['TableWidth'] + tableArr['TableWidthUnit'];
        }
        if (tableArr['chkTableHeight'] == true)
        {
            newTable.style.height = tableArr['TableHeight'] + tableArr['TableHeightUnit'];
        }
        if (tableArr['TableBorderStyle'] != "")
        {
            newTable.style.borderStyle = tableArr['TableBorderStyle'];
        }
        if (tableArr['BorderCollapse'] != "")
        {
            newTable.style.borderCollapse = tableArr['BorderCollapse'];
        }
        if (tableArr['chkTableBorderColor'] == true)
        {
            newTable.style.borderColor = tableArr['TableBorderColor'];
        }
        if (tableArr['chkTableBackgroundColor'] == true)
        {
            newTable.style.backgroundColor = tableArr['TableBackgroundColor'];
        }

        if (editor.document.selection.type == 'Control')
        {
            editor.document.selection.clear();
            sel = editor.document.selection.createRange();
            sel.pasteHTML(newTable.outerHTML);

        }
        else
        {
            sel = editor.document.selection.createRange();
            sel.pasteHTML(newTable.outerHTML);
        }
    }
}

// 预览表单
function FTB_Preview(editor, htmlmode) {

    if (!htmlmode) {
        //var formType = getParamValue("Type");
        switch (formType)
        {
            case "EAPForm":
                openWindow("FormFormat/VFormPreview.aspx?FormID=" + getParamValue("FormID"), 720, 600);
                break;
            case "APPForm":
                openWindow("FormFormat/VFormPreviewAPP.aspx?FormID=" + getParamValue("FormID"), 720, 600);
                break;
            case "SignBillForm":
                openWindow("FormFormat/VFormPreviewSignBill.aspx?FormID=" + getParamValue("FormID"), 720, 600);
                break;
        }
    }
}



// InsertFormCol.htm用到的js

// 初始化表单列设置页面
function initDesignInfo() {
    var rowIndex = parseInt(getParamValue("RI"), 10);
    var colType = parseInt(getParamValue("CT"), 10);
    var colDataType = parseInt(getParamValue("CDT"), 10);
    var colLen = parseInt(getParamValue("CL"), 10);
    var title = "";
    switch (colType) {
        case 0:
            switch (colDataType) {
                case 0:
                    $("#trWidth1,#trWidth2").show();
                    if (colLen > 200) {
                        $("#trHeight1,#trHeight2").show();
                    }
                    title = "文本输入框尺寸";
                    break;
                case 1:
                    title = "富文本输入框尺寸";
                    break;
                case 2:
                case 3:
                    $("#trWidth1,#trWidth2").show();
                    title = "数字输入框尺寸";
                    break;
                case 4:
                    $("#trWidth1,#trWidth2").show();
                    title = "日期选择框尺寸";
                    break;
                case 5:
                    title = "布尔值选择框尺寸";
                    break;
                case 6:
                    $("#trWidth1,#trWidth2").show();
                    title = "选择框尺寸";
                    break;
                case 7:
                    $("#trWidth1,#trWidth2,#trSelectItemCount").show();
                    title = "选择框外观";
                    break;
            }
            break;
        case 1:
            $("#trWidth1,#trWidth2").show();
            title = "公示数字框尺寸";
            break;
        case 2:
            switch (colDataType) {
                case 0:
                    $("#trWidth1,#trWidth2").show();
                    if (colLen > 200) {
                        $("#trHeight1,#trHeight2").show();
                    }
                    title = "系统列（文本）显示框尺寸";
                    break;
                case 2:
                case 3:
                    $("#trWidth1,#trWidth2").show();
                    title = "系统列（数字）显示框尺寸";
                    break;
                case 4:
                    $("#trWidth1,#trWidth2").show();
                    title = "系统列（日期）显示框尺寸";
                    break;
            }
            break;
        case 3:
        case 4:
            $("#trWidth1,#trWidth2").show();
            $("#trSubTable").show();
            var hidCols = colType == 3 ? getObjD("hidSysSubTableCols") : getObjD("hidDetailCols");
            if (hidCols) {
                var cols = $.stringToJSON(hidCols.value)[getParamValue("Field")];
                for (var k in cols) {
                    var bMultiSelect = (colType == 4 && cols[k][1] == "0" && cols[k][2] == "7");
                    var defaultAlignCenter = (colType == 3 && (k == encode("Idx", 1) || cols[k][1] == "4") || colType == 4 && inValues(cols[k][2], "4", "5", "6", "7")) ? ' selected="selected"' : '';
                    var defaultAlignRight = (!defaultAlignCenter && inValues(colType == 3 ? cols[k][1] : cols[k][2], "2", "3")) ? ' selected="selected"' : '';

                    var row = tbSubTable.insertRow();
                    if (bMultiSelect) {
                        row.isMultiSelect = true;
                    }

                    var cell = row.insertCell();
                    cell.rowSpan = bMultiSelect ? 2 : 1;
                    cell.style.padding = "0 3px";
                    cell.field = k;
                    cell.innerText = cols[k][0];

                    cell = row.insertCell();
                    cell.rowSpan = bMultiSelect ? 2 : 1;
                    cell.align = "center";
                    cell.innerHTML = '<input type="checkbox" checked onclick="clickBox(4)"/>';

                    cell = row.insertCell();
                    cell.align = "center";
                    cell.innerHTML = '<input type="text" style="width:80%" onblur="blurSize(3)"/>';

                    cell = row.insertCell();
                    cell.align = "center";
                    cell.innerHTML = stringFormat('<select><option value="left">左对齐</option><option value="center"{0}>居中</option><option value="right"{1}>右对齐</option></select>',
                        defaultAlignCenter, defaultAlignRight);

                    if (bMultiSelect) {
                        row = tbSubTable.insertRow();
                        row.isMultiSelectCnt = true;
                        cell = row.insertCell();
                        cell.colSpan = 2;
                        cell.align = "center";
                        cell.innerHTML = '横向复选框数量<input type="text" style="width:50px" value="1" onblur="blurSize(4)"/>';
                    }
                }
            }
            title = colType == 3 ? "系统子表外观" : "自定义子表外观";
            break;
    }
    $("#spTitle").text(title);
}

// 切换选择
function clickBox(opt) {
    switch (opt) {
        case 0:
            var checked = getObj("WidthBox1").checked;
            setBtnEnabled("WidthValue2", !checked);
            setBtnEnabled("WidthUnit2", !checked);
            break;
        case 1:
            var txtWidthValue = getObj("WidthValue2");
            txtWidthValue.focus();
            txtWidthValue.blur();
            break;
        case 2:
            var checked = getObj("HeightBox1").checked;
            setBtnEnabled("HeightValue2", !checked);
            setBtnEnabled("HeightUnit2", !checked);
            break;
        case 3:
            for (var i = 1; i < tbSubTable.rows.length; i++) {
                if (tbSubTable.rows[i].isMultiSelectCnt) {
                    continue;
                }
                var txtWidthValue = getObjTC(tbSubTable, i, 2, "input", 0);
                txtWidthValue.disabled = (!getObjTC(tbSubTable, i, 1, "input", 0).checked || $("#SubTableColWidthType").val() == "auto");
                if (txtWidthValue.disabled) {
                    txtWidthValue.value = "";
                }
                else {
                    txtWidthValue.focus();
                    txtWidthValue.blur();
                }
            }
            break;
        case 4:
            var chk = getEventObj();
            var row = getParentObj(chk, "tr");
            var txtWidthValue = getObjTC(tbSubTable, row.rowIndex, 2, "input", 0);
            txtWidthValue.disabled = (!chk.checked || $("#SubTableColWidthType").val() == "auto");
            if (txtWidthValue.disabled) {
                txtWidthValue.value = "";
            }
            getObjTC(tbSubTable, row.rowIndex, 3, "select", 0).disabled = !chk.checked;
            if (row.isMultiSelect) {
                getObjTR(tbSubTable, row.rowIndex + 1, "input", 0).disabled = !chk.checked;
            }
            break;
    }
}

// 输入验证（onblur）
function blurSize(opt) {
    switch (opt) {
        case 0:
            var bIsPx = $("#WidthUnit2").val() == "px";
            setRound(0, 0, bIsPx ? 1000 : 100);
            break;
        case 1:
            setRound(0, 22, 500);
            break;
        case 2:
            setRound(0, 1, 8);
            break;
        case 3:
            var bIsPx = $("#SubTableColWidthType").val() == "px";
            setRound(0, 0, bIsPx ? 500 : 100);
            break;
        case 4:
            setRound(0, 1, 4);
            break;
    }
}

// 完成添加表单列
function insertCol() {
    var colHtml = "";
    var field = getParamValue("Field");
    var title = '[' + decodeURIComponent(getParamValue("Title")) + ']';
    var rowIndex = parseInt(getParamValue("RI"), 10);
    var colType = parseInt(getParamValue("CT"), 10);
    var colDataType = parseInt(getParamValue("CDT"), 10);
    var colLen = parseInt(getParamValue("CL"), 10);
    var fmt = getParamValue("FMT");
    var style = "";
    if (getObj("WidthBox2").checked) {
        style = stringFormat('width:{0}{1};', $("#WidthValue2").val(), $("#WidthUnit2").val());
    }
    if (getObj("HeightBox2").checked) {
        style += stringFormat('height:{0}{1};', $("#HeightValue2").val(), $("#HeightUnit2").val());
    }
    if (style != '') {
        style = stringFormat(' style="{0}"', style);
    }
    switch (colType) {
        case 0:
            switch (colDataType) {
                case 0:
                    colHtml = '<textarea class="{0}"{1} onmouseover="fm_over()" onmouseout="fm_out()" onkeyup="checkLen({2})" onblur="checkLen({2})" ctp="0,0" field="{3}">{4}</textarea>';
                    colHtml = stringFormat(colHtml, (colLen > 200 ? 'fm_textarea' : 'fm_textarea2'), style, colLen, field, title);
                    break;
                case 1:
                    colHtml = "";
                    break;
                case 2:
                case 3:
                    colHtml = '<input type="text" class="fm_text"{0} maxlength="50" onmouseover="fm_over()" onmouseout="fm_out()" onblur="fm_num_blur()" ctp="0,{1}" field="{2}" value="{3}"/>';
                    colHtml = stringFormat(colHtml, style, colDataType, field, title);
                    break;
                case 4:
                    switch (fmt) {
                        case "0":
                            colHtml = '<input type="text" class="fm_text"{0} onmouseover="fm_over()" onmouseout="fm_out()" onkeydown="skipEnter()" onfocus="fm_dt_focus()" ctp="0,4" field="{1}" value="{2}"/>';
                            colHtml = stringFormat(colHtml, style, field, title);
                            break;
                        case "1":
                            colHtml = '<div class="form_time_div"{0} onmouseover="fm_over(\'div\')" onmouseout="fm_out(\'div\')" ctp="0,4" field="{1}">'
                                + '<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" readonly/>'
                                + '</div>';
                            colHtml = stringFormat(colHtml, style, field);
                            break;
                        case "2":
                            colHtml = '<div class="form_time_div"{0} onmouseover="fm_over(\'div\')" onmouseout="fm_out(\'div\')" ctp="0,4" field="{1}">'
                                + '<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'s\')" onclick="fm_time_click(\'s\',2)" readonly/>'
                                + '</div>';
                            colHtml = stringFormat(colHtml, style, field);
                            break;
                        case "3":
                            colHtml = '<table class="fm_dt_table"{0} cellspacing="0" onmouseover="fm_over(\'table\')" onmouseout="fm_out(\'table\')" onclick="fm_dt_click()" ctp="0,4" field="{1}">'
                                + '<tr><td>'
                                + '<input type="text" class="fm_dt_text" onkeydown="skipEnter()" onfocus="fm_dt_focus()" onpropertychange="fm_dt_change()" value="{2}" readonly/>'
                                + '<div class="form_time_div" style="display:none">'
                                + '<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" readonly/>'
                                + '</div>'
                                + '</td></tr></table>';
                            colHtml = stringFormat(colHtml, style, field, title);
                            break;
                        case "4":
                            colHtml = '<table class="fm_dt_table"{0} cellspacing="0" onmouseover="fm_over(\'table\')" onmouseout="fm_out(\'table\')" onclick="fm_dt_click()" ctp="0,4" field="{1}">'
                                + '<tr><td>'
                                + '<input type="text" class="fm_dt_text" onkeydown="skipEnter()" onfocus="fm_dt_focus()" onpropertychange="fm_dt_change()" value="{2}" readonly/>'
                                + '<div class="form_time_div" style="display:none">'
                                + '<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" readonly/>'
                                + ':<input type="text" name="t_{1}" class="dt_hm" value="00" onkeydown="fm_time_keydown(\'s\')" onclick="fm_time_click(\'s\',2)" readonly/>'
                                + '</div>'
                                + '</td></tr></table>';
                            colHtml = stringFormat(colHtml, style, field, title);
                            break;
                    }
                    break;
                case 6:
                    colHtml = '<select class="font"{0} ctp="0,6" field="{1}">'
                        + '<option value="">请选择</option>'
                        + '</select>'
                    colHtml = stringFormat(colHtml, style == '' ? 'style="width:100%"' : style, field);
                    break;
                case 7:
                    var selCnt = parseInt($("#SelectItemCount").val(), 10);
                    var avg = '';
                    if (getObj("SelectItemBox2").checked) {
                        avg = ' avg="1"';
                    }
                    colHtml = '<table class="fm_dt_table font"{0} cellspacing="2" cols="{2}"{3} ctp="0,7" field="{1}" style="background-color:transparent"><tbody><tr>';
                    for (var i = 1; i <= selCnt; i++) {
                        colHtml += '<td><label><input type="checkbox" class="idbox" value="a" />选项' + i + '</label></td>'
                    }
                    colHtml += '</tr></tbody></table>';
                    colHtml = stringFormat(colHtml, style, field, selCnt, avg);
                    break;
            }
            break;
        case 1:
            colHtml = '<input type="text" class="fm_text"{0} maxlength="50" onmouseover="fm_over()" onmouseout="fm_out()" onblur="fm_num_blur()" ctp="1" field="{1}" value="{2}"/>';
            colHtml = stringFormat(colHtml, style, field, title);
            break;
        case 2:
            switch (colDataType) {
                case 0:
                    colHtml = '<textarea class="fm_textarea2"{0} onmouseover="fm_over()" onmouseout="fm_out()" readonly ctp="2,0" field="{1}">{2}</textarea>';
                    colHtml = stringFormat(colHtml, style, field, title);
                    break;
                case 2:
                case 3:
                case 4:
                    colHtml = '<input type="text" class="fm_text"{0} onmouseover="fm_over()" onmouseout="fm_out()" readonly ctp="2,{1}" field="{2}" value="{3}"/>';
                    colHtml = stringFormat(colHtml, style, colDataType, field, title);
                    break;
            }
            break;
        case 3:
            var cnt = 0;
            var group = '';
            var head = '';
            var body = '';
            var foot = '';
            var widthType = $("#SubTableColWidthType").val();
            for (var i = 1; i < tbSubTable.rows.length; i++) {
                if (getObjTC(tbSubTable, i, 1, "input", 0).checked) {
                    var subField = tbSubTable.rows[i].cells[0].field;
                    var align = getObjTC(tbSubTable, i, 3, "select", 0).value;
                    var txtWidth = getObjTC(tbSubTable, i, 2, "input", 0);
                    group += stringFormat('<col style="text-align:{0};{1}"/>', align, (widthType != "auto" && txtWidth.value != "" && txtWidth.value != "0") ? 'width:' + txtWidth.value + widthType : "");
                    head += stringFormat('<th field="{0}">{1}</th>', tbSubTable.rows[i].cells[0].field, tbSubTable.rows[i].cells[0].innerText);
                    body += '<td></td>';
                    foot += (cnt == 0 ? '<td align="center" style="white-space:nowrap">合计</td>' : '<td></td>');
                    cnt++;
                }
            }
            if (cnt > 0) {
                colHtml = '<table class="fm_sub_table"{0} cellspacing="0" ctp="3" field="{1}">'
                    + '<colgroup>{2}</colgroup>'
                    + '<thead><tr>{3}</tr></thead>'
                    + '<tbody><tr>{4}</tr></tbody>'
                    + '<tfoot style="display:none"><tr>{5}</tr></tfoot>'
                    + '</table>';
                colHtml = stringFormat(colHtml, style, field, group, head, body, foot);
            }
            else {
                return alertMsg("没有选择任何子表列。");
            }
            break;
        case 4:
            var hidCols = getObjD("hidDetailCols");
            if (!hidCols) {
                return alertMsg("没有选择任何子表列。");
            }
            var cols = $.stringToJSON(hidCols.value)[field];
            var cnt = 0;
            var group = '';
            var head = '<th style="display:none"><input type="checkbox" class="idbox" onclick="fm_all_click()"/></th>';
            var body = '<td style="display:none"><input type="checkbox" class="idbox" onclick="fm_row_click()" /></td>';
            var foot = '<td style="display:none"></td>';
            var widthType = $("#SubTableColWidthType").val();
            for (var i = 1; i < tbSubTable.rows.length; i++) {
                if (getObjTC(tbSubTable, i, 1, "input", 0).checked) {
                    var subField = tbSubTable.rows[i].cells[0].field;
                    var align = getObjTC(tbSubTable, i, 3, "select", 0).value;
                    var txtWidth = getObjTC(tbSubTable, i, 2, "input", 0);
                    group += stringFormat('<col style="text-align:{0};{1}"/>', align, (widthType != "auto" && txtWidth.value != "" && txtWidth.value != "0") ? 'width:' + txtWidth.value + widthType : "");
                    body += '<td></td>';
                    foot += (cnt == 0 ? '<td align="center" style="white-space:nowrap">合计</td>' : '<td></td>');
                    head += stringFormat('<th ctp="{0}" field="{1}"', (cols[subField][1] == "0" ? "0," + cols[subField][2] : cols[subField][1]), subField);
                    if (tbSubTable.rows[i].isMultiSelect) {
                        i++;
                        head += stringFormat(' cols="{0}"', getObjTR(tbSubTable, i, "input", 0).value);
                    }
                    head += stringFormat('>{0}</th>', cols[subField][0]);
                    cnt++;
                }
            }
            if (cnt > 0) {
                colHtml = '<table class="fm_sub_table"{0} cellspacing="0" ctp="4" field="{1}">'
                    + '<colgroup>{2}</colgroup>'
                    + '<thead><tr style="display:none"><td colspan="{6}" style="text-align:left;display:none">'
                    + '<input type="button" value="新增" class="btnsmall btnpad" onmouseover="setIDBtn1(this,1)" onmouseout="setIDBtn1(this,0)" onfocus="this.blur()"'
                    + ' onclick="fm_add_click()"/><input type="button" value="删除" class="btnsmall btnpad" onmouseover="setIDBtn1(this,1)" onmouseout="setIDBtn1(this,0)"'
                    + ' onfocus="this.blur()" onclick="fm_del_click()"/><input type="button" value="上移" class="btnsmall btnpad" onmouseover="setIDBtn1(this,1)"'
                    + ' onmouseout="setIDBtn1(this,0)" onfocus="this.blur()" onclick="fm_move_click(1)" /><input type="button" value="下移" class="btnsmall btnpad"'
                    + ' onmouseover="setIDBtn1(this,1)" onmouseout="setIDBtn1(this,0)" onfocus="this.blur()" onclick="fm_move_click(0)" />'
                    + '</td></tr><tr>{3}</tr></thead>'
                    + '<tbody><tr>{4}</tr></tbody>'
                    + '<tfoot style="display:none"><tr>{5}</tr></tfoot>'
                    + '</table>';
                colHtml = stringFormat(colHtml, style, field, group, head, body, foot, cnt + 1);
            }
            else {
                return alertMsg("没有选择任何子表列。");
            }
            break;
    }

    window.returnValue = colHtml;
    window.close();
}