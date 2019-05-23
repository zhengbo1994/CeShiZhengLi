// VFormColumn.aspx用到的js

// 新增
function addCol()
{
    var formId = getParamValue("FormID");
    var fmId = getParamValue("FMID");
    var tb = getParamValue("Tb");
    
    openWindow("VFormColumnAdd.aspx?FormID=" + formId + "&FMID=" + fmId + "&Tb=" + tb, 500, 450);
}

// 修改
function editCol()
{
    openModifyWindow("VFormColumnEdit.aspx", 500, 450, "jqGrid1");
}

// 删除
function delCol()
{
    openDeleteWindow("FormColumn", 0, "jqGrid1");
}

// 列名
function showColName(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="showColumn(\'' + options.rowId + '\')">' + cellvalue + '</a>';
}

// 类型
function showColType(cellvalue, options, rowobject)
{
    var value = "";
    var colType = rowobject[1];
    switch (colType)
    {
        case "0":
            switch (cellvalue)
            {
                case "0":
                    value = "文本";
                    break;
                case "1":
                    value = "富文本";
                    break;
                case "2":
                    value = "整数";
                    break;
                case "3":
                    value = "小数";
                    break;
                case "4":
                    value = "日期";
                    break;
                case "5":
                    value = "布尔";
                    break;
                case "6":
                    value = "单选";
                    break;
                case "7":
                    value = "多选";
                    break;
            }
            break;
        case "1":
            value = "公式";
            switch (cellvalue)
            {
                case "2":
                    value += "(整数)";
                    break;
                case "3":
                    value += "(小数)";
                    break;
            }
            break;
        case "2":
            value = "系统列";
            switch (cellvalue)
            {
                case "0":
                    value += "(文本)";
                    break;
                case "2":
                    value += "(整数)";
                    break;
                case "3":
                    value += "(小数)";
                    break;
                    break;
                case "4":
                    value += "(日期)";
                    break;
            }
            break;
        case "3":
            value = "系统子表";
            break;
        case "4":
            value = "自定义子表";
            break;
    }
    return value;
}

// 必填
function showRequired(cellvalue, options, rowobject)
{
    var colType = rowobject[1];
    return (colType == "0" || colType == "4") ? (cellvalue.toLowerCase() == "true" ? "必填" : "非必填") : "";
}

// 设置
function showSet(cellvalue, options, rowobject)
{
    var colType = rowobject[1];
    return colType == "4" ? '<a href="javascript:void(0)" onclick="setColumn(\'' + options.rowId + '\',\'' + encode(rowobject[0], 1) + '\')">设置</a>' : "";
}

// 查看列
function showColumn(formColId)
{
    openWindow("VFormColumnBrowse.aspx?FormColID=" + formColId, 500, 450);
}

// 设置列
function setColumn(formColId, tableName)
{
    openWindow("VFormColumnDetail.aspx?FormColID=" + formColId + "&Tb=" + tableName, 700, 400);
}



// VFormColumnAdd.aspx、VFormColumnEdit.aspx用到的js

// windowLoad
function loadColInfo()
{
    setDisplay();
    setSysCols(tbSysSubTableCols, 1);

    registerSubmitEvents(saveSysCols);

    showFormula();
}

// 显示公式（subColTableField：自定义子表的公式列修改时，为自定义子表的field）
function showFormula(subColTableField)
{
    var hidTexts = getObj("hidTexts");
    var colType = $("#ddlColType").length ? $("#ddlColType").val() : $("#hidColType").val();
    if (colType == "1" && hidTexts && hidTexts.value)
    {
        var hidFormula = getObj("hidFormula");

        // 记录原公式
        var hidOldFormulaCode = getObj("hidOldFormulaCode");
        if (hidOldFormulaCode)
        {
            hidOldFormulaCode.value = hidFormula.value.substr(0, hidFormula.value.indexOf("|"));
        }

        window["FormParamTexts"] = $.stringToJSON($("#hidTexts").val());

        // 解析公式文本
        var formulaText = hidFormula.value.substr(hidFormula.value.indexOf("|") + 1);
        txtFormula.value = formulaText.replace(/\{(.+?)\}|〈(.+?)〉\{(.+?)\}\[(.*?)\]/g,
            function(matche, $1, $2, $3, $4) { return getFormulaText(subColTableField, $1, $2, $3, $4); });
    }
}

// 解析公式文本
function getFormulaText(subColTableField, field, fun, tableField, funExpr)
{
    var result;
    if (field)
    {
        result = "{" + (subColTableField ? window["FormParamTexts"][subColTableField].d[field].t : window["FormParamTexts"][field].t) + "}";
    }
    else
    {
        result = stringFormat('〈{0}〉{{1}}[{2}]', fun, window["FormParamTexts"][tableField].t,
            fun == "COUNT" ? '' : funExpr.replace(/\{(.+?)\}/g,
            function(match, $1) { return "{" + window["FormParamTexts"][tableField].d[$1].t + "}"; }));
    }
    return result;
}

// 控件显隐
function setDisplay()
{
    var colType = $("#ddlColType").length ? $("#ddlColType").val() : $("#hidColType").val();
    var colDataType = $("#ddlColDataType").length ? $("#ddlColDataType").val() : $("#hidColDataType").val();
    var colDataTypeFormula = $("#ddlColDataTypeFormula").length ? $("#ddlColDataTypeFormula").val() : $("#hidColDataTypeFormula").val();
    var colDBType = $("#ddlSysTableCol").length ? $("#ddlSysTableCol").val().split(",")[1] : $("#hidColDBType").val();
    var isInt = inValues(colDBType, "int", "smallint");
    var isDec = inValues(colDBType, "float", "decimal");
    var isNum = (isInt || isDec);
    var isDate = inValues(colDBType, "datetime", "smalldatetime")

    trColDataType.style.display = colType == "0" ? "" : "none";
    trColDataTypeFormula.style.display = colType == "1" ? "" : "none";
    trSysTable.style.display = colType == "2" ? "" : "none";
    trSysTableCol.style.display = trSysTable.style.display;
    trSysSubTable.style.display = colType == "3" ? "" : "none";
    trSysSubTableCol.style.display = trSysSubTable.style.display;
    trColLenText.style.display = (colType == "0" && colDataType == "0") ? "" : "none";
    trFormatNum.style.display = (colType == "0" && inValues(colDataType, "2", "3")
        || colType == "1" && inValues(colDataTypeFormula, "2", "3") || colType == "2" && isNum) ? "" : "none";
    trColLenNum.style.display = (colType == "0" && colDataType == "3"
        || colType == "1" && colDataTypeFormula == "3" || colType == "2" && isDec) ? "" : "none";
    trFormatDate.style.display = (colType == "0" && colDataType == "4" || colType == "2" && isDate) ? "" : "none";
    trFormula.style.display = colType == "1" ? "" : "none";
    trSelTable.style.display = (colType == "0" && inValues(colDataType, "6", "7")) ? "" : "none";
    trUnit.style.display = trFormatNum.style.display;
    trIsNeedTotal.style.display = inValues(colType, "3", "4") ? "" : "none";
    trIsRequired.style.display = inValues(colType, "0", "1", "4") ? "" : "none";
    $("#lblIsRequired").text((colType == "0" && colDataType == "5") ? "默认值" : (colType == "1" ? "允许为负数" : "是否必填"));
    if ($("#trCustomTableCol").length)
    {
        trCustomTableCol.style.display = colType == "4" ? "" : "none";
    }
}

// 切换系统表列或系统子表时自动设置列标题
function setColTitle(ddl)
{
    $("#txtColTitle").val(ddl.value ? ddl.options[ddl.selectedIndex].text : "");
}

// 新增明细(opt：0:新增/1:修改)
function setSysCols(table, opt)
{
    if (!opt)
    {
        var sysSubTable = $("#ddlSysSubTable").val() || $("#hidSysSubTable").val();
        if (!sysSubTable)
        {
            return alertMsg("请选择系统子表。", $("#ddlSysSubTable"));
        }
        openModalWindow("../../Common/Select/CheckFlow/VSelectSysTableCols.aspx?TableName=" + encode(sysSubTable, 1), 350, 500);
    }
    var arrDatas = $.stringToJSON($("#hidSysSubTableCols").val());
    for (var i = 0; i < arrDatas.length; i++)
    {
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, arrDatas[i].ColName, {"format":arrDatas[i].Format});
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerText = arrDatas[i].ColTitle;
      
        cell = row.insertCell(2);
        cell.innerText = getFmtName(arrDatas[i]);
        cell.align = "center";
      
        cell = row.insertCell(3);
        cell.innerText = arrDatas[i].ColLen;
        cell.align = "center";
      
        cell = row.insertCell(4);
        cell.innerHTML = '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(1)" onfocus="this.blur()" title="上移" style="margin-right:0">∧</button> \n'
            + '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
            + ' onclick="moveCol(0)" onfocus="this.blur()" title="下移" style="margin-right:0">∨</button>'
        cell.align = "center";
        
        setRowAttributes(row);
    }
    $("#hidSysSubTableCols").val("");
}

// 保存系统子表列
function saveSysCols()
{
    var jsonDatas = [];
    for (var i = 1; i < tbSysSubTableCols.rows.length; i++)
    {
        var chk = getObjTC(tbSysSubTableCols, i, 0, "input", 0);
        var colName = chk.value;
        var colTitle = tbSysSubTableCols.rows[i].cells[1].innerText;
        var format = chk.format;
        var colLen = tbSysSubTableCols.rows[i].cells[3].innerText;
        jsonDatas.push({"ColName":colName, "ColTitle":colTitle, "ColLen":colLen, "Format":format});
    }
    $("#hidSysSubTableCols").val($.jsonToString(jsonDatas));
}

// 获取格式名称
function getFmtName(data)
{
    var result;
    switch (data.Format)
    {
        case "N":
            result = "会计格式";
            break;
        case "P":
            result = "百分比";
            break;
        case "E":
            result = "科学计数";
            break;
        case "yyyy-MM-dd":
            result = "日期";
            break;
        case "HH:mm":
            result = "时分";
            break;
        case "HH:mm:ss":
            result = "时分秒";
            break;
        case "yyyy-MM-dd HH:mm":
            result = "日期+时分";
            break;
        case "yyyy-MM-dd HH:mm:ss":
            result = "日期+时分秒";
            break;
        default:
            result = data.ColLen ? "常规" : "";
            break;
    }
    return result;
}

// 删除明细
function delCols(table)
{
    deleteTableRow(table);
    setTableRowAttributes(table);
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

// 提交校验(新增)
function validateSize()
{
    handleBtn(false);
    if (getObj("txtColTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("列名称不能为空。", getObj("txtColTitle"));
    }
    var colType = $("#ddlColType").val();
    if (!colType)
    {
        handleBtn(true);
        return alertMsg("请选择列类型。", $("#ddlColType"));
    }
    switch (colType)
    {
        // 自定义列
        case "0":
            var colDataType = $("#ddlColDataType").val();
            if (!colDataType)
            {
                handleBtn(true);
                return alertMsg("请选择数据类型。", $("#ddlColDataType"));
            }
            if (inValues(colDataType, "6", "7") && !$("#ddlSelTable").val())
            {
                handleBtn(true);
                return alertMsg("请选择选择项。", $("#ddlSelTable"));
            }
            break;
        // 公式列
        case "1":
            var colDataType = $("#ddlColDataTypeFormula").val();
            if (!$("#hidFormula").val())
            {
                handleBtn(true);
                return alertMsg("公式不能为空。", $("#btnSet"));
            }
            if (!colDataType)
            {
                handleBtn(true);
                return alertMsg("请选择数据类型。", $("#ddlColDataTypeFormula"));
            }
            break;
        // 系统列
        case "2":
            if (!$("#ddlSysTable").val())
            {
                handleBtn(true);
                return alertMsg("请选择系统表。", $("#ddlSysTable"));
            }
            if (!$("#ddlSysTableCol").val())
            {
                handleBtn(true);
                return alertMsg("请选择系统表列。", $("#ddlSysTableCol"));
            }
            break;
        // 系统子表
        case "3":
            if (!$("#ddlSysSubTable").val())
            {
                handleBtn(true);
                return alertMsg("请选择系统子表。", $("#ddlSysSubTable"));
            }
            if (tbSysSubTableCols.rows.length < 2)
            {
                handleBtn(true);
                return alertMsg("系统子表列不能为空。", $("#btnAdd"));
            }
            saveSysCols();
            break;
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    
    return true;
}

// 提交校验(修改)
function validateForm()
{
    handleBtn(false);
    if (getObj("txtColTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("列名称不能为空。", getObj("txtColTitle"));
    }
    switch ($("#hidColType").val())
    {
        // 公式列
        case "1":
            var hidFormula = getObj("hidFormula");
            var newFormulaCode = hidFormula.value.substr(0, hidFormula.value.indexOf("|"));
            var oldFormulaCode = getObj("hidOldFormulaCode").value;

            // 如果公式有变更，要同步更新以本列作为公式参数的公式列的公式
            if (newFormulaCode.value != oldFormulaCode)
            {
                var notNegative = !getObjC(rdlIsRequired, "input", 0).checked;
                var fields = $("#hidField").val().split(".");
                var field = { "f": fields[1], "tf": fields[0] };
                var cols = window["FormParamTexts"];

                if (fields[0])
                {
                    cols[field.tf].d[field.f].e = notNegative ? stringFormat("parseNNN({0})", newFormulaCode) : newFormulaCode;
                }
                else
                {
                    cols[field.f].e = notNegative ? stringFormat("parseNNN({0})", newFormulaCode) : newFormulaCode;
                }

                var changedFormulas = [];

                createRelatedFormulaFields(cols, changedFormulas, field);

                var j = 0;
                for (var i = 0; i < 10; i++)
                {
                    var len = changedFormulas.length;
                    for (; j < len; j++)
                    {
                        var searchs = changedFormulas[j].split(".");
                        var search = { "f": searchs[1], "tf": searchs[0] };
                        createRelatedFormulaFields(cols, changedFormulas, search);
                    }
                }

                for (var i = 0; i < changedFormulas.length; i++)
                {
                    fields = changedFormulas[i].split(".");
                    var changedFormula;
                    if (fields[0])
                    {
                        changedFormula = cols[fields[0]].d[fields[1]];
                        changedFormula.e = changedFormula.f.replace(/\{(.+?)\}|([\+\-×÷\(\)])/g,
                            function(match, $1, $2) { return getSubFormulaCode(cols, fields[0], $1, $2); });
                    }
                    else
                    {
                        changedFormula = cols[fields[1]];
                        changedFormula.e = changedFormula.f.replace(/\{(.+?)\}|([\+\-×÷\(\)])|〈(.+?)〉\{(.*?)\}\[(.*?)\]/g,
                            function(match, $1, $2, $3, $4, $5) { return getFormulaCode(cols, $1, $2, $3, $4, $5); });
                    }
                    changedFormulas[i] = { "IsSub": fields[0] ? "1" : "0", "Field": fields[1], "e": changedFormula.e, "f": changedFormula.f };
                }

                if (changedFormulas.length > 0)
                {
                    $("#hidChangedFoumulas").val($.jsonToString(changedFormulas));
                }
            }
            break;
        // 系统子表  
        case "3":
            if (tbSysSubTableCols.rows.length < 2)
            {
                handleBtn(true);
                return alertMsg("系统子表列不能为空。", $("#btnAdd"));
            }
            saveSysCols();
            break; ;
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    return true;
}

// 提交校验(修改)辅助方法（1）：构造作为公式参数的列的field数组（格式为:表单列:.field/子表列:tableField.field）
function createRelatedFormulaFields(cols, formulaFields, search)
{
    for (var colField in cols)
    {
        var col = cols[colField];
        if (col.d && colField == search.tf)
        {
            var subCols = col.d;
            for (var subColField in subCols)
            {
                var subCol = subCols[subColField];
                if (subCol.f)
                {
                    var match = { "f": subColField, "tf": colField };
                    subCol.f.replace(/\{(.+?)\}/g,
                        function(m, $1) { setRelatedSubFormulaFields(formulaFields, search, match, colField, $1); });
                }
            }
        }
        else if (col.f && colField != search.f)
        {
            var match = { "f": colField, "tf": "" };
            col.f.replace(/\{(.+?)\}|〈(.+?)〉\{(.+?)\}\[(.*?)\]/g,
                function(m, $1, $2, $3, $4) { setRelatedFormulaFields(formulaFields, search, match, $1, $2, $3, $4); });
        }
    }
}

// 提交校验(修改)辅助方法（2）：构造作为公式参数的列的field数组
function setRelatedFormulaFields(formulaFields, search, match, field, fun, tableField, funExpr)
{
    if (field && field == search.f)
    {
        pushArray(formulaFields, match.tf + "." + match.f,1);
    }
    else if (funExpr)
    {
        funExpr.replace(/\{(.+?)\}/g, function(m, $1) { setRelatedSubFormulaFields(formulaFields, search, match, tableField, $1); });
    }
}

// 提交校验(修改)辅助方法（3）：构造作为公式参数的列的field数组
function setRelatedSubFormulaFields(formulaFields, search, match, tableField, thField)
{
    if (tableField == search.tf && thField == search.f)
    {
        pushArray(formulaFields, match.tf + "." + match.f, 1);
    }
}

// 解析公式代码
function getFormulaCode(cols, field, opt, fun, tableField, funExpr)
{
    var result;
    if (field)
    {
        var code = cols[field];
        result = code.e ? "(" + code.e + ")" : "{" + field + "}";
    }
    else if (opt)
    {
        result = (opt == "×" ? "*" : (opt == "÷" ? "/" : opt));
    }
    else
    {
        result = stringFormat('<{0}>{{1}}[{2}]', fun, tableField,
            fun == "COUNT" ? '' : funExpr.replace(/\{(.+?)\}|([\+\-×÷\(\)])/g,
            function(match, $1, $2) { return getSubFormulaCode(cols, tableField, $1, $2); }));
    }
    return result;
}

// 解析聚合函数内公式代码
function getSubFormulaCode(cols, tableField, field, opt)
{
    var code = cols[tableField].d[field];
    return field ? (code.e ? "(" + code.e + ")" : "{" + field + "}") : (opt == "×" ? "*" : (opt == "÷" ? "/" : opt));
}

function handleBtn(enabled)
{
    setBtnEnabled("btnSaveOpen,btnSaveClose", enabled);
}


//设置公式（opt：0:新增公式列/1:修改公式列/2:新增子表公式列/3:修改子表公式列）
function setFormula(opt)
{
    var url = "VFormColumnFormula.aspx?Opt=" + opt;
    switch (opt)
    {
        case 0:
            url += "&ID=" + getParamValue("FormID");
            break;
        case 1:
        case 3:
            url += "&ID=" + getParamValue("ID");
            break;
        case 2:
            url += "&ID=" + getParamValue("FormColID");
            break;
    }
    openModalWindow(url, 700, 550);
}



// VFormColumnBrowse.aspx用到的js

// 查看选择表
function showSelTable(selTId)
{
    openWindow("VFormSelTableBrowse.aspx?SelTID=" + selTId, 450, 450);
}

// 查看系统表
function showSysTable(aHref, tbName, tbType)
{
    openWindow("VFormSysTableBrowse.aspx?Name=" + encode(aHref.innerText, 1) + "&Type=" + tbType + "&Cols=" + tbName, 400, 500);
}



// VFormColumnDetail.aspx用到的js

// 新增
function addSubTableCol()
{
    var formId = getParamValue("FormColID");
    var tb = getParamValue("Tb");
    
    openWindow("VFormColumnDetailAdd.aspx?FormColID=" + formId + "&Tb=" + tb, 500, 400);
}

// 修改
function editSubTableCol()
{
    openModifyWindow("VFormColumnDetailEdit.aspx", 500, 400, "jqGrid1");
}

// 删除
function delSubTableCol()
{
    openDeleteWindow("FormColumnDetail", 0, "jqGrid1");
}

// 列名
function showSubTableColName(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="showSubTableColumn(\'' + options.rowId + '\')">' + cellvalue + '</a>';
}

// 查看子表列
function showSubTableColumn(detailId)
{
    openWindow("VFormColumnDetailBrowse.aspx?DetailID=" + detailId, 500, 400);
}



// VFormColumnDetailAdd.aspx、VFormColumnDetailEdit.aspx用到的js

// 控件显隐
function setDisplayInfo()
{
    var colType = $("#ddlColType").length ? $("#ddlColType").val() : $("#hidColType").val();
    var colDataType = $("#ddlColDataType").length ? $("#ddlColDataType").val() : $("#hidColDataType").val();
    var colDataTypeFormula = $("#ddlColDataTypeFormula").length ? $("#ddlColDataTypeFormula").val() : $("#hidColDataTypeFormula").val();

    trColDataType.style.display = colType == "0" ? "" : "none";
    trColDataTypeFormula.style.display = colType == "1" ? "" : "none";
    trColLenText.style.display = (colType == "0" && colDataType == "0") ? "" : "none";
    trFormatNum.style.display = (colType == "0" && inValues(colDataType, "2", "3") || colType == "1" && inValues(colDataTypeFormula, "2", "3")) ? "" : "none";
    trColLenNum.style.display = (colType == "0" && colDataType == "3" || colType == "1" && colDataTypeFormula == "3") ? "" : "none";
    trFormatDate.style.display = (colType == "0" && colDataType == "4") ? "" : "none";
    trFormula.style.display = colType == "1" ? "" : "none";
    trSelTable.style.display = (colType == "0" && inValues(colDataType, "6", "7")) ? "" : "none";
    trUnit.style.display = trFormatNum.style.display;
    $("#lblIsRequired").text((colType == "0" && colDataType == "5") ? "默认值" : (colType == "1" ? "允许为负数" : "是否必填"));
}