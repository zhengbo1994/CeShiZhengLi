// VFormColumnFormula.aspx用到的js

var currentCursor;
var formParamFields;
var formParamTexts;

// window.load
function loadFormula()
{
    var formulas = window.dialogArguments.hidFormula.value.split("|");
    if (formulas.length > 1)
    {
        window["Formulas"] = formulas[1];
    }

    initFormula();
}

// 初始化公式
function initFormula()
{
    formParamFields = $.stringToJSON($("#hidFields").val());
    formParamTexts = $.stringToJSON($("#hidTexts").val());

    if (inValues(getParamValue("opt"), "0", "1"))
    {
        for (var i = 4; i <= 7; i++)
        {
            tbOpts.rows[i].style.display = "";
        }
    }

    var formula = window["Formulas"];
    if (formula)
    {
        // 初始化公式
        divFormula.innerHTML = getCursor(0, 1) + formula.replace(/\{(.+?)\}|([\+\-×÷\(\)])|〈(.+?)〉\{(.+?)\}\[(.*?)\]/g, getFormulaText) + getCursor(0, 1);

        // 去相邻重复光标
        var cursors = divFormula.getElementsByTagName("input");
        for (var i = 0; i < cursors.length; i++)
        {
            if (cursors[i].nextSibling && cursors[i].nextSibling.nodeName == "INPUT")
            {
                cursors[i].parentNode.removeChild(cursors[i].nextSibling);
            }
        }
    }
    else
    {
        divFormula.appendChild(getCursor(0));
    }
    setTimeout("divFormula.lastChild.focus()", 0);
}

// 解析公式文本
function getFormulaText(match, field, opt, fun, tableField, funExpr)
{
    var result;
    if (field)
    {
        result = "{" + formParamTexts[field].t + "}";
    }
    else if (opt)
    {
        result = getCursor(0, 1) + getOpt(opt, 1) + getCursor(0, 1);
    }
    else
    {
        result = stringFormat('<div style="display:inline" field="{0}">〈{1}〉{<span>{2}</span>}[{3}]</div>',
            tableField, fun, formParamTexts[tableField].t,
            fun == "COUNT" ? '' : ('<span>' + getCursor(2, 1) + funExpr.replace(/\{(.+?)\}|([\+\-×÷\(\)])/g,
            function(match, $1, $2) { return getSubFormulaText(tableField, $1, $2) }) + getCursor(2, 1) + '</span>'));
    }
    return result;
}

// 解析聚合函数内公式文本
function getSubFormulaText(tableField, field, opt)
{
    return field ? ("{" + formParamTexts[tableField].d[field].t + "}") : (getCursor(2, 1) + getOpt(opt, 1) + getCursor(2, 1));
}

// 获取光标dom（type：0:表单列/1:子表/2:子表列）
function getCursor(type, isGetHtml)
{
    var html = stringFormat('<input t="{0}" style="width:10px;text-align:center;border:0" onfocus="focusCursor()" onkeydown="return triCursor()" />', type);
    return isGetHtml ? html : document.createElement(html);
}

// 获取操作符、常数、操作数dom
function getOpt(opt, isGetHtml)
{
    var span = document.createElement('span');
    span.innerText = opt;

    return isGetHtml ? span.outerHTML : span;
}

// 获取函数dom
function getFun(fun)
{
    var div = document.createElement('div');
    div.style.display = "inline";
    div.innerHTML = stringFormat('〈{0}〉{{1}}[{2}]', fun, getCursor(1, 1), (fun == "COUNT" ? '' : '<span>' + getCursor(2, 1) + '</span>'));

    return div;
}

// 光标获取焦点
function focusCursor()
{
    if (currentCursor)
    {
        currentCursor.style.background = '';
    }
    currentCursor = getEventObj();
    currentCursor.style.background = 'url(../../Image/form/cursor.gif) no-repeat bottom';

    var opts = tbOpts.getElementsByTagName("button");
    var params = divParams.getElementsByTagName("button");
    switch (currentCursor.t)
    {
        // 表单列
        case "0":
            for (var i = 0; i < opts.length; i++)
            {
                opts[i].disabled = false;
            }
            for (var i = 0; i < params.length; i++)
            {
                params[i].disabled = (params[i].pt == "0" && inValues(params[i].ct, "3", "4") || inValues(params[i].pt, "1", "2"));
                if (params[i].disabled)
                {
                    setIDBtn1(params[i], 0);
                }
            }
            break;
        // 子表
        case "1":
            for (var i = 0; i < opts.length; i++)
            {
                opts[i].disabled = true;
                setIDBtn1(opts[i], 0);
            }
            for (var i = 0; i < params.length; i++)
            {
                params[i].disabled = (params[i].pt == "0" && inValues(params[i].ct, "0", "1", "2") || inValues(params[i].pt, "1", "2"));
                if (params[i].disabled)
                {
                    setIDBtn1(params[i], 0);
                }
            }
            break;
        // 子表列
        case "2":
            var objFun = getParentObj(currentCursor, "div");
            for (var i = 0; i < opts.length; i++)
            {
                opts[i].disabled = inValues(opts[i].innerText, "SUM", "AVG", "MAX", "MIN", "COUNT");
                if (opts[i].disabled)
                {
                    setIDBtn1(opts[i], 0);
                }
            }
            for (var i = 0; i < params.length; i++)
            {
                params[i].disabled = (params[i].pt == "0" || objFun.field && objFun.field != getParentObj(getParentObj(params[i], "table"), "td").firstChild.field);
                if (params[i].disabled)
                {
                    setIDBtn1(params[i], 0);
                }
            }
            break;
    }
}

// 光标操作事件
function triCursor()
{
    var cursor = getEventObj();
    switch (event.keyCode)
    {
        // Tab键（允许）
        case 9:
            break;
        // Hmoe/End键（35:End/36:Home） 
        case 35:
        case 36:
            (event.keyCode == 35 ? divFormula.lastChild : divFormula.firstChild).focus();
            break;
        // 加减乘除
        case 107:
        case 109:
        case 106:
        case 111:
            insertOpt(event.keyCode == 107 ? "+" : (event.keyCode == 109 ? "-" : (event.keyCode == 106 ? "×" : "÷")));
            return false;
        // 左右方向键（37:←/39:→）
        case 37:
        case 39:
            var cursors = divFormula.getElementsByTagName("input");
            for (var i = 0; i < cursors.length; i++)
            {
                if (cursors[i] == cursor && (event.keyCode == 37 && i > 0 || event.keyCode == 39 && i < cursors.length - 1))
                {
                    cursors[i + (event.keyCode == 37 ? -1 : 1)].focus();
                    break;
                }
            }
            break;
        // 删除键（退格:Backspace/删除:Delete） 
        case 8:
        case 46:
            if (inValues(cursor.t, "0", "2"))
            {
                var delCursor = (event.keyCode == 8 ? cursor.previousSibling : cursor.nextSibling);
                if (delCursor)
                {
                    cursor.parentNode.removeChild(delCursor);
                    delCursor = (event.keyCode == 8 ? cursor.previousSibling : cursor.nextSibling);
                    if (delCursor)
                    {
                        cursor.parentNode.removeChild(delCursor);
                    }
                }
            }
            break;
        // 屏蔽其他键
        default:
            return false;
            break;
    }
    return true;
}

// 点击公式框
function clickFormula()
{
    var obj = getEventObj();
    if (obj.nodeName == "DIV" && obj.id == "divFormula")
    {
        var lastCursor = divFormula.lastChild;
        if (event.clientY > getAbsAxisY(lastCursor) + lastCursor.offsetHeight || event.clientX > getAbsAxisX(lastCursor) + lastCursor.offsetWidth && event.clientY > getAbsAxisY(lastCursor))
        {
            lastCursor.focus();
        }
    }
}

// 插入操作符
function insertOpt(opt)
{
    if (currentCursor)
    {
        var cursor = getCursor(currentCursor.t);
        var objOpt = getOpt(opt);
        currentCursor.insertAdjacentElement("afterEnd", objOpt);
        objOpt.insertAdjacentElement("afterEnd", cursor);
        cursor.focus();
    }
}

//插入函数
function insertFun(fun)
{
    if (currentCursor)
    {
        var cursor = getCursor(currentCursor.t);
        var objFun = getFun(fun);
        currentCursor.insertAdjacentElement("afterEnd", objFun);
        objFun.insertAdjacentElement("afterEnd", cursor);
        cursor = getObjC(objFun, "input", 0);
        cursor.focus();
    }
}

// 插入常数
function insertNum()
{
    if (currentCursor)
    {
        var cursor = getCursor(currentCursor.t);
        var txtNum = getObj("txtNum");
        if (txtNum.value == "")
        {
            return alertMsg("请输入一个数字。", txtNum);
        }
        var objNum = getOpt(txtNum.value);
        currentCursor.insertAdjacentElement("afterEnd", objNum);
        objNum.insertAdjacentElement("afterEnd", cursor);
        txtNum.value = "";
        cursor.focus();
    }
}

// 插入操作数
function insertParam()
{
    if (currentCursor)
    {
        var btn = getEventObj();

        // 子表
        if (btn.pt == "0" && inValues(btn.ct, "3", "4"))
        {
            var objParam = getOpt(btn.innerText);
            currentCursor.insertAdjacentElement("afterEnd", objParam);

            var objFun = getParentObj(currentCursor, "div");
            if (objFun)
            {
                objFun.removeChild(currentCursor);
                objFun.field = btn.field;

                var cursors = objFun.getElementsByTagName("input");
                if (cursors.length)
                {
                    cursors[0].focus();
                }
                else
                {
                    objFun.nextSibling.focus();
                }
            }
        }
        else
        {
            var cursor = getCursor(currentCursor.t);
            var objParam = getOpt("{" + btn.innerText + "}");
            currentCursor.insertAdjacentElement("afterEnd", objParam);
            objParam.insertAdjacentElement("afterEnd", cursor);

            // 子表列
            if (inValues(btn.pt, "1", "2"))
            {
                var objFun = getParentObj(currentCursor, "div");
                if (objFun && !objFun.field)
                {
                    var btnFuns = getParentObj(getParentObj(btn, "table"), "td").getElementsByTagName("button");
                    if (btnFuns.length)
                    {
                        currentCursor = getObjC(objFun, "input", 0);
                        btnFuns[0].disabled = false;
                        btnFuns[0].click();
                    }
                }
            }

            cursor.focus();
        }
    }
}

// 清空公式
function clearFormula()
{
    window["Formulas"] = "";
    divFormula.innerHTML = "";
    initFormula();
}

// 提交设置公式
function submitFormula()
{
    var formula = divFormula.innerText;
    if (!formula)
    {
        return alertMsg("公式不能为空。", divFormula.lastChild);
    }

    try
    {
        var formulaCode = formula.replace(/\{(.+?)\}|([\+\-×÷\(\)])|〈(.+?)〉\{(.*?)\}\[(.*?)\]/g,
            function(match, $1, $2, $3, $4, $5) { return getFormulaCode(1, $1, $2, $3, $4, $5); });

        var formValue = formulaCode.replace(/\{(.+?)\}|([\+\-×÷\(\)])|\<(.+?)\>\{(.*?)\}\[(.*?)\]/g, getFormulaValue);

        eval(formValue);

        var formulaText = formula.replace(/\{(.+?)\}|([\+\-×÷\(\)])|〈(.+?)〉\{(.+?)\}\[(.*?)\]/g,
            function(match, $1, $2, $3, $4, $5) { return getFormulaCode(0, $1, $2, $3, $4, $5); });

        window.dialogArguments.txtFormula.value = formula;
        window.dialogArguments.hidFormula.value = formulaCode + "|" + formulaText;
        window.close();
    }
    catch (err)
    {
        return alertMsg("公式不合法。", currentCursor);
    }
}

// 解析公式代码（isGetFormula：1:获取参数公式/0:获取参数field）
function getFormulaCode(isGetFormula, text, opt, fun, tableText, funExpr)
{
    var result;
    if (text)
    {
        var code = formParamFields[text];
        result = (isGetFormula && code.e) ? "(" + code.e + ")" : "{" + code.f + "}";
    }
    else if (opt)
    {
        result = isGetFormula ? (opt == "×" ? "*" : (opt == "÷" ? "/" : opt)) : opt;
    }
    else
    {
        result = stringFormat('{0}{{1}}[{2}]',
            (isGetFormula ? "<" + fun + ">" : "〈" + fun + "〉"), formParamFields[tableText].f,
            fun == "COUNT" ? '' : funExpr.replace(/\{(.+?)\}|([\+\-×÷\(\)])/g, function(match, $1, $2) { return getSubFormulaCode(isGetFormula, tableText, $1, $2); }));
    }
    return result;
}

// 解析聚合函数内公式代码
function getSubFormulaCode(isGetFormula, tableText, text, opt)
{
    var code = formParamFields[tableText].d[text];
    return text ? ((isGetFormula && code.e) ? "(" + code.e + ")" : "{" + code.f + "}")
        : (isGetFormula ? (opt == "×" ? "*" : (opt == "÷" ? "/" : opt)) : opt);
}

// 解析公式值（用于校验公式的合法性）
function getFormulaValue(match, field, opt, fun, tableField, funExpr)
{
    return field ? '8 ' : (opt ? opt : (fun == "COUNT" ? '8 ' : funExpr ? funExpr.replace(/\{(.+?)\}|([\+\-×÷\(\)])/g, function(match, $1, $2) { return $1 ? '8 ' : $2; }) : 'a'));
}

// 转非负数non-negative number （用于校验公式的合法性）
function parseNNN(value)
{
    return value > 0 ? value : 0;
}