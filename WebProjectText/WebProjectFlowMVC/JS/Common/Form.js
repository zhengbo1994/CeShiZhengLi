
// UC_Form.ascx的js文件

// 表单事件：

var form_border_color;

// 表单，鼠标悬停（边框变色）
function fm_over(tagName)
{
    var obj = getEventObj(tagName);
    if (obj)
    {
        form_border_color = obj.style.borderColor;
        obj.style.borderColor = obj.readOnly ? "#d4d0c8" : "#14abe3";
    }
}

// 表单，鼠标离开（边框颜色恢复）
function fm_out(tagName)
{
    var obj = getEventObj(tagName);
    if (obj)
    {
        obj.style.borderColor = form_border_color;
    }
}

// 数值onblur（total:是否需要合计）
function fm_num_blur(total)
{
    var txt = getEventObj();
    if (txt && !txt.readOnly)
    {
        var len = txt.len ? parseInt(txt.len, 10) : 0;
        var min = len ? -9007199254740992 : -2147483648;    // -2^53  -2^31
        var max = len ? 9007199254740991 : 2147483647;      // 2^53-1  2^31-1
        setRound(len, min, max);
        switch (txt.fmt)
        {
            case "N":
                setAccountingNum(len);
                break;
            case "P":
                setPercentNum(len);
                break;
            case "E":
                setScientificNum(len);
                break;
        }
        if (total)
        {
            var td = getParentObj(txt, "td");
            var tb = getParentObj(td, "table");
            totalSubTableCol(tb, td.cellIndex);
        }
    }
}

// 日期+时间，日期变化（时间的显隐）
function fm_dt_change()
{
    var txt = getEventObj();
    if (txt)
    {
        var container = getParentObj(txt);
        if (container)
        {
            var div = getObjC(container, "div", 0);
            if (div)
            {
                if (txt.value == "")
                {
                    div.style.display = "none";
                    var times = div.getElementsByTagName("input");
                    for (var i = 0; i < times.length; i++)
                    {
                        times[i].value = "00";
                    }
                }
                else
                {
                    div.style.display = "inline";
                }
            }
        }
    }
}

// 日期，激活（显示日期选择框）
function fm_dt_focus()
{
    var txt = getEventObj();
    var tb = getEventObj("table");
    if (txt && txt.ctp && !txt.readOnly || tb && tb.ctp && !tb.readOnly)
    {
        selectDate();
    }
}

// 日期+时间，单击（显示日期或时间选择框）
function fm_dt_click()
{
    var obj = getEventObj();
    if (obj && inValues(obj.tagName.toLowerCase(), "input", "div"))
    {
        return;
    }
    obj = getEventObj("table");
    if (obj && !obj.readOnly)
    {
        var txt = getObjC(obj, "input", 0);
        if (txt)
        {
            txt.focus();
        }
    }
}

// 时间，键盘↓↑键（微调时分秒）
function fm_time_keydown(opt)
{
    var txt = getEventObj();
    var div = getEventObj("div");
    var tb = getEventObj("table");
    if (txt && (div && div.ctp && !div.readOnly || tb && tb.ctp && !tb.readOnly))
    {
        fixIDTime(txt, opt);
    }
}

// 时间，单击（选择时分秒）
function fm_time_click(opt, index)
{
    var txt = getEventObj();
    var div = getEventObj("div");
    var tb = getEventObj("table");
    if (txt && (div && div.ctp && !div.readOnly || tb && tb.ctp && !tb.readOnly))
    {
        selectIDTime(txt, opt, index)
    }
}

// 添加自定义字表行
function fm_add_click()
{
    var table = getEventObj("table");
    addSubTableRow(table, -1);
}

// 删除自定义子表行
function fm_del_click()
{
    var table = getEventObj("table");
    for (var i = table.tBodies[0].rows.length - 1; i >= 0; i--)
    {
        var chk = getObjTC(table.tBodies[0], i, 0, "input", 0);
        if (chk && chk.type.toLowerCase() == "checkbox" && chk.checked)
        {
            table.tBodies[0].deleteRow(i);
        }
    }
    
    var chkAll = getObjTC(table.tHead, 1, 0, "input", 0);
    if (chkAll && chkAll.type.toLowerCase() == "checkbox")
    {
        chkAll.checked = false;
    }

    totalSubTable(table, 1);

    if ($.inArray(table.field, getFormExprParams()) != -1)
    {
        fm_value_calculate(table.field);
    }
}

// 上下移动自定义字表行(direction：0:下移/1:上移)
function fm_move_click(direction)
{
    var table = getEventObj("table");
    var checkedIndex;
    var checkedCnt = 0;
    for (var i = 0; i < table.tBodies[0].rows.length; i++)
    {
        var chk = getObjTC(table.tBodies[0], i, 0, "input", 0);
        if (chk.checked)
        {
            checkedIndex = i;
            checkedCnt++;
        }
    }
    if (checkedCnt > 1)
    {
        return alertMsg("只能移动一行。");
    }
    else if (checkedCnt == 1)
    {
        if (direction && checkedIndex > 0 || !direction && checkedIndex < table.tBodies[0].rows.length - 1)
        {
            table.tBodies[0].moveRow(checkedIndex, (direction ? checkedIndex - 1 : checkedIndex + 1));
        }
    }
}

// 全选自定义字表行
function fm_all_click()
{
    var chkAll = getEventObj();
    var table = getParentObj(chkAll, "table");
    for (var i = 0; i < table.tBodies[0].rows.length; i++)
    {
        var chk = getObjTC(table.tBodies[0], i, 0, "input", 0);
        if (chk && chk.type.toLowerCase() == "checkbox" && chk.checked != chkAll.checked)
        {
            chk.checked = chkAll.checked;
        }
    }
}

// 单选自定义字表行
function fm_row_click()
{
    var table = getEventObj("table");
    var flag = 0;
    for (var i = 0; i < table.tBodies[0].rows.length; i++)
    {
        var chk = getObjTC(table.tBodies[0], i, 0, "input", 0);
	    if (chk && chk.type.toLowerCase() == "checkbox" && !chk.checked)
	    {
		    flag = 1;
		    break;
	    }
    }
    getObjTC(table.tHead, 1, 0, "input", 0).checked = !flag;
}

// 获取表单控件集合
function fm_controls_get()
{
    if (!window["IDForm_Controls"])
    {
        var controls = [];
        var tags = ["input", "textarea", "select", "div", "table"];
        for (var i = 0; i < tags.length; i++)
        {
            var objs = document.getElementsByTagName(tags[i]);
            for (var j = 0; j < objs.length; j++)
            {
                // 公式框放最前面，便于作为公式参数的系统列、系统子表加载自身的值后计算公式框的值
                if (objs[j].ctp == "1")
                {
                    controls.unshift(objs[j]);
                }
                else if (objs[j].ctp)
                {
                    controls.push(objs[j]);
                }
            }
        }
        window["IDForm_Controls"] = controls;
    }
    return window["IDForm_Controls"];
}

// 初始化表单值
function fm_init()
{
    var _sels = $.stringToJSON(hidForm_Sels.value);
    var _cols = $.stringToJSON(hidForm_Values.value);
    var objs = fm_controls_get();
    for (var i = 0; i < objs.length; i++)
    {
        var obj = objs[i];
        var col = _cols[obj.field];
        if (col)
        {
            if (col.r)
            {
                obj.readOnly = true;
                try{obj.focus();}catch(e){}
            }
            
            var types = obj.ctp.split(",");
            switch (types[0])
            {
                // 自定义列、系统列
                case "0":
                case "2":
                    switch (types[1])
                    {
                        // 文本 
                        case "0":
                        case "1":
                            obj.value = col.v;
                            break;
                        // 数值 
                        case "2":
                        case "3":
                            var len = col.l ? parseInt(col.l, 10) : 0;
                            obj.value = (col.v ? getNumValue(col.v, len, col.f) : col.v);
                            obj.len = col.l;
                            obj.fmt = col.f;

                            if (!obj.readOnly) {
                                obj.onfocus = clearInputValue;
                            }

                            if ($.inArray(obj.field, getFormExprParams(_cols)) != -1)
                            {
                                if (!obj.readOnly)
                                {
                                    obj.onpropertychange = fm_value_calculate;
                                }
                                //else if (types[0] == "2")
                                //{
                                    fm_value_calculate(obj.field);
                                //}
                            }
                            break;
                        // 日期 
                        case "4":
                            if (types[0] == "2" || col.f == "0")
                            {
                                obj.value = getDateValue(col.v, col.f);
                            }
                            else
                            {
                                var dateValues = getDateValue(col.v);
                                var dates = obj.getElementsByTagName("input");
                                dates[0].value = (col.f == "1" || col.f == "2") ? dateValues[1] : dateValues[0];
                                dates[1].value = (col.f == "1" || col.f == "2") ? dateValues[2] : dateValues[1];
                                dates[2] && (dates[2].value = col.f == "2" ? dateValues[3] : dateValues[2]);
                                dates[3] && (dates[3].value = dateValues[3]);
                            }
                            obj.fmt = col.f;
                            break;
                        // 布尔
                        case "5":
                            getObjC(obj, "input", ((col.v == "Y" || !col.v && col.i) ? 0 : 1)).checked = true;
                            if (col.r)
                            {
                                setControlReadOnly(obj);
                            }
                            break;
                        // 单选 
                        case "6":
                            var sel = obj;
                            sel.length = 1;
                            var sels = _sels[col.v] || [];
                            for (var j = 0; j < sels.length; j++)
                            {
                                var opt = document.createElement("option");
                                opt.value = sels[j][0];
                                opt.text = sels[j][1];
                                sel.add(opt);
                                if (opt.value == col.d.v)
                                {
                                    opt.selected = true;
                                }
                            }
                            if (col.r)
                            {
                                setControlReadOnly(obj);
                            }
                            break;
                        // 多选 
                        case "7":
                            var table = obj;
                            var cols = table.cols ? table.cols : 1;
                            var row;
                            var cell;
                            clearTableAll(table.tBodies[0]); ;
                            var sels = _sels[col.v] || [];
                            for (var j = 0; j < sels.length; j++)
                            {
                                if (j % cols == 0)
                                {
                                    row = table.tBodies[0].insertRow();
                                }
                                cell = row.insertCell();
                                if (table.avg)
                                {
                                    cell.style.width = 100.00 / cols + '%';
                                }
                                cell.innerHTML = stringFormat('<label><input type="checkbox" class="idbox" value="{0}"{2}/>{1}</label>',
                                    sels[j][0], sels[j][1], ($.inArray(sels[j][0], col.d.v) != -1 ? " checked" : ""));
                            }
                            if (j % cols > 0)
                            {
                                cell = row.insertCell();
                                cell.colspan = cols - j % cols;
                                cell.innerHTML = "&nbsp;";
                            }
                            if (col.r)
                            {
                                setControlReadOnly(obj);
                            }
                            break;
                    }
                    break;
                // 公式列
                case "1":
                    var len = col.l ? parseInt(col.l, 10) : 0;
                    obj.value = (col.v ? getNumValue(col.v, len, col.f) : col.v);
                    obj.len = col.l;
                    obj.fmt = col.f;
                    obj.notNegative = !col.i;
                    obj.expr = col.e;
                    break;
                // 系统子表
                case "3":
                    var table = obj;
                    var heads = table.tHead.rows[0].cells;
                    var foots = table.tFoot.rows[0].cells;
                    table.tFoot.style.display = (col.e == "Y" ? "" : "none");
                    clearTableAll(table.tBodies[0]);
                    for (var j = 0; j < col.l; j++)
                    {
                        var row = table.tBodies[0].insertRow();
                        for (var k = 0; k < heads.length; k++)
                        {
                            var cell = row.insertCell();
                            var subCol = col.d[heads[k].field];
                            if (!subCol)
                            {
                                cell.innerHTML = "&nbsp;";
                                continue;
                            }
                            
                            var subVal = subCol[3][j];
                            switch (subCol[0])
                            {
                                case "0":
                                    cell.innerText = subVal;
                                    break;
                                case "2":
                                case "3":
                                    var len = subCol[1] ? parseInt(subCol[1], 10) : (subCol[2] == "P" ? 4 : 0);
                                    var totVal = getRound(subVal, len) + getRound(foots[k].innerText, len);
                                    cell.innerText = getNumValue(subVal, len, subCol[2]);
                                    k > 0 && (foots[k].innerText = getNumValue(totVal, len, subCol[2]));
                                    break;
                                case "4":
                                    cell.innerText = getDateValue(subVal, subCol[2]);
                                    break;
                            }
                        }
                    }
                    if ($.inArray(table.field, getFormExprParams(_cols)) != -1)
                    {
                        fm_value_calculate(table.field);
                    }
                    break;
                // 自定义子表
                case "4":
                    var table = obj;
                    table.tHead.rows[0].style.display = (col.r ? "none" : "");
                    table.tHead.rows[0].cells[0].style.display = (col.r ? "none" : "");
                    table.tHead.rows[1].cells[0].style.display = (col.r ? "none" : "");
                    table.tFoot.rows[0].cells[0].style.display = (col.r ? "none" : "");
                    table.tFoot.style.display = (col.e == "Y" ? "" : "none");

                    // 处理子表列宽
                    var colgroup = getObjC(table, "colgroup", 0);
                    var cgl = colgroup.childNodes.length;
                    var cl = table.tHead.rows[1].cells.length;
                    if (col.r && cgl && cgl == cl)
                    {
                        colgroup.removeChild(colgroup.childNodes[0]);
                    }
                    else if (!col.r && cgl < cl)
                    {
                        colgroup.insertAdjacentElement('afterBegin', document.createElement('<col style="text-align:center"/>'));
                    }

                    clearTableAll(table.tBodies[0]);
                    for (var j = 0; j < col.l; j++)
                    {
                        addSubTableRow(table, j, _sels, _cols);
                    }
                    // 新建时，自动添加一行
                    if (col.l == 0 && form_Mode.toLowerCase() == "create")
                    {
                        var btnAdd = getObjTC(table.tHead, 0, 0, "input", 0);
                        if (btnAdd && btnAdd.type == "button")
                        {
                            btnAdd.click();
                        }
                    }

                    totalSubTable(table, 0, col);
                    break;
            }
        }
    }
}

// 校验表单值(save：0或无:校验并保存/1:仅保存)
function fm_validate(save)
{
    var _cols = $.stringToJSON(hidForm_Values.value);
    var objs = fm_controls_get();
    for (var i = 0; i < objs.length; i++)
    {
        var obj = objs[i];
        var col = _cols[obj.field];
        var types = obj.ctp.split(",");
        if (col && (types[0] == "1" || !col.r))
        {
            switch (types[0])
            {
                // 自定义列  
                case "0":
                    switch (types[1])
                    {
                        // 文本  
                        case "0":
                        case "1":
                            if (!save && col.i && obj.value == "")
                            {
                                return alertMsg("表单值(文本)不能为空。", obj);
                            }
                            col.v = trim(obj.value);
                            break;
                        // 数值  
                        case "2":
                        case "3":
                            if (!save && col.i && obj.value == "")
                            {
                                return alertMsg("表单值(数值)不能为空。", obj);
                            }
                            col.v = (obj.value ? getRound(obj.value) : "");
                            break;
                        // 日期  
                        case "4":
                            var dates = obj.getElementsByTagName("input");
                            switch (obj.fmt)
                            {
                                case "0":
                                    if (!save && col.i && obj.value == "")
                                    {
                                        return alertMsg("表单值(日期)不能为空。", obj);
                                    }
                                    col.v = (obj.value ? obj.value : "1900-01-01");
                                    break;
                                case "1":
                                case "2":
                                    col.v = stringFormat("1900-01-01 {0}:{1}:{2}", dates[0].value, dates[1].value, (dates[2] ? dates[2].value : "00"));
                                    break;
                                case "3":
                                case "4":
                                    if (!save && col.i && dates[0].value == "")
                                    {
                                        return alertMsg("表单值(日期)不能为空。", dates[0]);
                                    }
                                    col.v = stringFormat("{0} {1}:{2}:{3}", (dates[0].value ? dates[0].value : "1900-01-01"), dates[1].value, dates[2].value, (dates[3] ? dates[3].value : "00"));
                                    break;
                            }
                            break;
                        // 布尔  
                        case "5":
                            col.v = (getObjC(obj, "input", 0).checked ? "Y" : "N");
                            break;
                        // 单选  
                        case "6":
                            var sel = obj;
                            if (!save && col.i && sel.value == "")
                            {
                                return alertMsg("表单值(单选)不能为空。", sel);
                            }
                            col.d.v = sel.options[sel.selectedIndex].value;
                            col.d.t = (col.d.v ? sel.options[sel.selectedIndex].text : "");
                            break;
                        // 多选  
                        case "7":
                            col.d.v.splice(0, col.d.v.length);
                            col.d.t.splice(0, col.d.t.length);
                            var chks = obj.getElementsByTagName("input");
                            for (var j = 0; j < chks.length; j++)
                            {
                                if (chks[j].checked)
                                {
                                    col.d.v.push(chks[j].value);
                                    col.d.t.push(getParentObj(chks[j], "label").innerText);
                                }
                            }
                            if (!save && col.i && !col.d.v.length)
                            {
                                return alertMsg("表单值(多选)不能为空。", chks[0] ? chks[0] : obj);
                            }
                            break;
                    }
                    break;
                // 公式列
                case "1":
                    col.v = (obj.value ? getRound(obj.value) : "");
                    break;
                // 自定义子表
                case "4":
                    var table = obj;
                    var heads = table.tHead.rows[1].cells;
                    if (!save && col.i && !table.tBodies[0].rows.length)
                    {
                        var btnAdd = getObjTC(table.tHead, 0, 0, "input", 0);
                        if (btnAdd && btnAdd.type == "button")
                        {
                            btnAdd.click();
                        }
                    }
                    for (var k in col.d)
                    {
                        col.d[k].d.v.splice(0, col.d[k].d.v.length);
                        col.d[k].d.t.splice(0, col.d[k].d.t.length);
                    }
                    col.l = table.tBodies[0].rows.length;
                    for (var j = 0; j < col.l; j++)
                    {
                        for (var k = 1; k < heads.length; k++)
                        {
                            var subCol = col.d[heads[k].field];
                            if (!subCol)
                            {
                                continue;
                            }
                            var subTypes = heads[k].ctp.split(",");
                            // 自定义列
                            if (subTypes[0] == "0")
                            {
                                switch (subTypes[1])
                                {
                                    // 文本        
                                    case "0":
                                        var txt = getObjTC(table.tBodies[0], j, k, "input", 0) || getObjTC(table.tBodies[0], j, k, "textarea", 0);
                                        if (!save && subCol.i && txt.value == "")
                                        {
                                            return alertMsg("表单值(文本)不能为空。", txt);
                                        }
                                        subCol.d.v.push(trim(txt.value));
                                        break;
                                    // 整数、小数        
                                    case "2":
                                    case "3":
                                        var txt = getObjTC(table.tBodies[0], j, k, "input", 0);
                                        if (!save && subCol.i && txt.value == "")
                                        {
                                            return alertMsg("表单值(数值)不能为空。", txt);
                                        }
                                        subCol.d.v.push(txt.value ? getRound(txt.value) : "");
                                        break;
                                    // 日期        
                                    case "4":
                                        var dates = table.tBodies[0].rows[j].cells[k].getElementsByTagName("input");
                                        switch (subCol.f)
                                        {
                                            case "0":
                                                if (!save && subCol.i && dates[0].value == "")
                                                {
                                                    return alertMsg("表单值(日期)不能为空。", dates[0]);
                                                }
                                                subCol.d.v.push(dates[0].value ? dates[0].value : "1900-01-01");
                                                break;
                                            case "1":
                                            case "2":
                                                subCol.d.v.push(stringFormat("1900-01-01 {0}:{1}:{2}", dates[0].value, dates[1].value, (dates[2] ? dates[2].value : "00")));
                                                break;
                                            case "3":
                                            case "4":
                                                if (!save && subCol.i && dates[0].value == "")
                                                {
                                                    return alertMsg("表单值(日期)不能为空。", dates[0]);
                                                }
                                                subCol.d.v.push(stringFormat("{0} {1}:{2}:{3}", (dates[0].value ? dates[0].value : "1900-01-01"), dates[1].value, dates[2].value, (dates[3] ? dates[3].value : "00")));
                                                break;
                                        }
                                        break;
                                    // 布尔        
                                    case "5":
                                        subCol.d.v.push(getObjTC(table.tBodies[0], j, k, "input", 0).checked ? "Y" : "N");
                                        break;
                                    // 单选        
                                    case "6":
                                        var sel = getObjTC(table.tBodies[0], j, k, "select", 0);
                                        if (!save && subCol.i && sel.value == "")
                                        {
                                            return alertMsg("表单值(单选)不能为空。", sel);
                                        }
                                        subCol.d.v.push(sel.options[sel.selectedIndex].value);
                                        subCol.d.t.push(sel.options[sel.selectedIndex].value ? sel.options[sel.selectedIndex].text : "");
                                        break;
                                    // 多选        
                                    case "7":
                                        var selValues = [];
                                        var selTexts = [];
                                        var chks = table.tBodies[0].rows[j].cells[k].getElementsByTagName("input");
                                        for (var l = 0; l < chks.length; l++)
                                        {
                                            if (chks[l].checked)
                                            {
                                                selValues.push(chks[l].value);
                                                selTexts.push(getParentObj(chks[l], "label").innerText);
                                            }
                                        }
                                        if (!save && subCol.i && !selValues.length)
                                        {
                                            return alertMsg("表单值(多选)不能为空。", chks[0] ? chks[0] : table.tBodies[0].rows[j].cells[k]);
                                        }
                                        subCol.d.v.push(selValues);
                                        subCol.d.t.push(selTexts);
                                        break;
                                }
                            }
                            // 公式列
                            else
                            {
                                var txt = getObjTC(table.tBodies[0], j, k, "input", 0);
                                subCol.d.v.push(txt.value ? getRound(txt.value) : "");
                            }
                        }
                    }
                    break;
            }
        }
    }
    hidForm_Values.value = $.jsonToString(_cols);
    return true;
}

//存在表单时验证当前流程是否可用
//Sunwei 2015-04-21
function flowIsEnable()
{
    //未提交表单不验证是否选择流程
    if ((!getObj("ddlFlow")) || $("#ddlFlow").is(":hidden"))
    {
        return true;
    }

    var bValue = false;
    var type = "Y";
    var flid = getObj("ddlFlow").value;

    //如果从首页发起工作入口或非起草页面，则需要检查环节是否更新
    if (getParamValue("FLowID"))
    {
        flid = getParamValue("FLowID");
    }
    
    if (!flid)
    {
        alert("未选择流程。");
        return false;
    }

    var flowInfo = getObj("hidFlowValidateInfo").value.split("|");
    var fmid = flowInfo[0];
    var keyID = flowInfo[1];
    var stationID = flowInfo[2];
    var formid = $("#hidFormID").val();
    if (btnSaveFormInfo) { btnSaveFormInfo.click(); }

    //如果从首页发起工作入口或非起草页面，则需要检查环节是否更新
    if (getParamValue("FLowID"))
    {
        flid = getParamValue("FLowID");
        //检查环节是否更新
        ajaxRequest(
           "FillData.ashx",
           { "action": "CurrentFlowIsUpdate", "Ajax_FMID": fmid, "Ajax_FlowID": flid, "Ajax_KeyID": keyID, "Ajax_FormID": formid, "Ajax_StationID": stationID, "Ajax_Param": hidFlow_Param.value, "Ajax_Flow": hidFlow_Values.value },
          "text",
           function (data)
           {
               type = data;
               bValue = data == "Y";
           },
           false,
           "POST");
    }
    else
    {
        //验证流程是否满足条件
        ajaxRequest(
           "FillData.ashx",
           { "action": "CurrentFlowIsEnable", "Ajax_FMID": fmid, "Ajax_FlowID": flid, "Ajax_KeyID": keyID, "Ajax_FormID": formid, "Ajax_StationID": stationID, "Ajax_Param": hidFlow_Param.value, "Ajax_Flow": hidFlow_Values.value },
          "text",
           function (data)
           {
               type = data;
               bValue = data == "Y";
           },
           false,
           "POST");
    }

    if (!bValue)
    {
        var message = "";
        if (type == "N")
        {
            if (getObj("hidFlowID")) getObj("hidFlowID").value = "";
            if (getObj("ddlFlow")) getObj("ddlFlow").value = "";
            message = "当前流程不满足自定义表单流程条件，请重新选择。"
        }
        else if (type == "U")
        {
            message = "当前流程环节已发生改变，请检查环节并重新提交。"
        }
        btnRefreshDDLFlow.click();
        return alertMsg(message);
    }

    return bValue;
}


// 辅助方法：

// 获取数值（bNotNegative表示为非负数）
function getNumValue(value, len, format, bNotNegative)
{
    // 非负数
    if (bNotNegative)
    {
        value = getRound(value, null, 0);
    }
    switch (format)
    {
        case "N":
            return getAccountingNum(value, len);
        case "P":
            return getPercentNum(value, len);
        case "E":
            return getScientificNum(value, len);
        default:
            return getRound(value, len).toFixed(len);
    }
}

// 获取日期值
function getDateValue(value, format)
{
    var dates = [];
    var objDate = getDateObject(value);
    dates.push(objDate.getFullYear() > 1900 ? stringFormat("{0}-{1}-{2}", objDate.getFullYear(), padLeft(objDate.getMonth() + 1, 2), padLeft(objDate.getDate(), 2)) : "");
    dates.push(padLeft(objDate.getHours(), 2));
    dates.push(padLeft(objDate.getMinutes(), 2));
    dates.push(padLeft(objDate.getSeconds(), 2));
    
    switch (format)
    {
        case "0":
            return dates[0];
        case "1":
            return stringFormat("{0}:{1}", dates[1], dates[2]);
        case "2":
            return stringFormat("{0}:{1}:{2}", dates[1], dates[2], dates[3]);
        case "3":
            return dates[0] ? stringFormat("{0} {1}:{2}", dates[0], dates[1], dates[2]) : "";
        case "4":
            return dates[0] ? stringFormat("{0} {1}:{2}:{3}", dates[0], dates[1], dates[2], dates[3]) : "";
        default:
            return dates;
    }
}

// 对自定义子表各列进行合计运算(postBack为0时表示页面加载调用)
function totalSubTable(table, postBack, col)
{
    if (!col)
    {
        col = $.stringToJSON(hidForm_Values.value)[table.field];
    }
    if (!col || postBack && col.e == "N")
    {
        return;
    }
    var heads = table.tHead.rows[1].cells;
    for (var j = 2; j < heads.length; j++)
    {
        var subTypes = heads[j].ctp.split(",");
        if (subTypes[0] == "0" && (subTypes[1] == "2" || subTypes[1] == "3") || subTypes[0] == "1")
        {
            if (postBack)
            {
                totalSubTableCol(table, j);
            }
            else
            {
                var subCol = col.d[heads[j].field];
                heads[j].len = subCol ? subCol.l : 0;
                heads[j].fmt = subCol ? subCol.f : "";
                if (col.e == "Y")
                {
                    totalSubTableCol(table, j);
                }
            }
        }
    }
}

// 合计自定义子表某列
function totalSubTableCol(table, cellIndex)
{
    if (cellIndex > 1)
    {
        var value = 0;
        var head = table.tHead.rows[1].cells[cellIndex];
        var len = head.len ? parseInt(head.len, 10) : 0;
        var fmt = head.fmt ? head.fmt : "";
        for (var i = 0; i < table.tBodies[0].rows.length; i++)
        {
            var txt = getObjTC(table.tBodies[0], i, cellIndex, "input", 0);
            if (txt)
            {
                value += getRound(txt.value, len);
            }
        }
        table.tFoot.rows[0].cells[cellIndex].innerText = getNumValue(value, len ,fmt);
    }
}

// 自定义子表添加行(rowIndex==1-时为新增)
function addSubTableRow(table, rowIndex, _sels, _cols)
{
    if (!_sels)
    {
        _sels = $.stringToJSON(hidForm_Sels.value);
    }
    if (!_cols)
    {
        _cols = $.stringToJSON(hidForm_Values.value);
    }
    var col = _cols[table.field];
    if (!col)
    {
        return;
    }
    
    var heads = table.tHead.rows[1].cells;
    var foots = table.tFoot.rows[0].cells;
    
    var ro1 = (col.r ? ' readOnly="true"' : '');
    var ro2_1 = (col.r ? '<span onmouseover="this.setCapture()" onmouseout="this.releaseCapture()" onfocus="this.blur()" onbeforeactivate="return false">' : '');
    var ro2_2 = (col.r ? '</span>' : '');
    var row = table.tBodies[0].insertRow();
    for (var i = 0; i < heads.length; i++)
    {
        var cell = row.insertCell();
        if (i == 0)
        {
            if (col.r)
            {
                cell.style.display = "none";
            }
            else
            {
                cell.innerHTML = '<input type="checkbox" class="idbox" onclick="fm_row_click()" />';
            }
            continue;
        }
        var subCol = col.d[heads[i].field];
        if (!subCol)
        {
            cell.innerHTML = "&nbsp;";
            continue;
        }
        var align = $("colgroup>col", table).eq(col.r ? i - 1 : i).css("text-align");
        var subVal = (rowIndex == -1 ? "" : subCol.d.v[rowIndex]);
        var subTypes = heads[i].ctp.split(",");
        switch (subTypes[0])
        {
            // 自定义列
            case "0":
                switch (subTypes[1])
                {
                    // 文本 
                    case "0":
                        cell.innerHTML = stringFormat('<textarea class="fm_textarea2" style="text-align:{3}" onmouseover="fm_over()" onmouseout="fm_out()" onkeyup="checkLen({0})" onblur="checkLen({0})"{2}>{1}</textarea>',
                            subCol.l, subVal, ro1, align);
                        break;
                    // 整数 
                    case "2":
                        cell.innerHTML = stringFormat('<input type="text" class="fm_text" style="text-align:{5}" onmouseover="fm_over()" onmouseout="fm_out()" onblur="fm_num_blur({2})" maxlength="50" style="text-align:right" value="{0}" fmt="{1}"{3}{4}' + (!col.r ? 'onfocus="clearInputValue.call(this)"' : '') + '/>',
                            (subVal ? getNumValue(subVal, 0, subCol.f) : subVal), subCol.f, (col.e == "Y" ? 1 : 0),
                            (($.inArray(table.field + "." + heads[i].field, getFormExprParams(_cols)) != -1 && !col.r) ? ' onpropertychange="fm_value_calculate()"' : ''), ro1, align);
                        break;
                    // 小数 
                    case "3":
                        cell.innerHTML = stringFormat('<input type="text" class="fm_text" style="text-align:{6}" onmouseover="fm_over()" onmouseout="fm_out()" onblur="fm_num_blur({3})" maxlength="50" style="text-align:right" value="{0}" len="{1}" fmt="{2}"{4}{5}' + (!col.r ? 'onfocus="clearInputValue.call(this)"' : '') + '/>',
                            (subVal ? getNumValue(subVal, subCol.l, subCol.f) : subVal), subCol.l, subCol.f, (col.e == "Y" ? 1 : 0),
                            (($.inArray(table.field + "." + heads[i].field, getFormExprParams(_cols)) != -1 && !col.r) ? ' onpropertychange="fm_value_calculate()"' : ''), ro1, align);
                        break;
                    // 日期 
                    case "4":
                        var dates = getDateValue(subVal);
                        switch (subCol.f)
                        {
                            case "0":
                                cell.innerHTML = stringFormat('<input type="text" class="fm_text" style="text-align:{3}" onmouseover="fm_over()" onmouseout="fm_out()" onkeydown="skipEnter()" onfocus="fm_dt_focus()" value="{0}" ctp="{1}"{2}/>',
                                    dates[0], heads[i].ctp, ro1, align);
                                break;
                            case "1":
                                cell.innerHTML = stringFormat('<div class="form_time_div" style="text-align:{5}" onmouseover="fm_over(\'div\')" onmouseout="fm_out(\'div\')" ctp="{3}"{4}>'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" value="{1}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" value="{2}" readonly/></div>',
                                    getUniqueKey("t"), dates[1], dates[2], heads[i].ctp, ro1, align);
                                break;
                            case "2":
                                cell.innerHTML = stringFormat('<div class="form_time_div" style="text-align:{6}" onmouseover="fm_over(\'div\')" onmouseout="fm_out(\'div\')" ctp="{4}"{5}>'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" value="{1}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" value="{2}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'s\')" onclick="fm_time_click(\'s\',2)" value="{3}" readonly/></div>',
                                    getUniqueKey("t"), dates[1], dates[2], dates[3], heads[i].ctp, ro1, align);
                                break;
                            case "3":
                                cell.innerHTML = stringFormat('<table class="fm_dt_table" cellspacing="0" onmouseover="fm_over(\'table\')" onmouseout="fm_out(\'table\')" onclick="fm_dt_click()" ctp="{5}"{6}><tr><td style="text-align:{7}">'
                                    + '<input type="text" class="fm_dt_text" onkeydown="skipEnter()" onfocus="fm_dt_focus()" onpropertychange="fm_dt_change()" value="{1}" readonly/>'
                                    + '<div class="form_time_div"{4}>'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" value="{2}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" value="{3}" readonly/></div></td></tr></table>',
                                    getUniqueKey("t"), dates[0], dates[1], dates[2], (dates[0] ? '' : ' style="display:none"'), heads[i].ctp, ro1, align);
                                break;
                            case "4":
                                cell.innerHTML = stringFormat('<table class="fm_dt_table" cellspacing="0" onmouseover="fm_over(\'table\')" onmouseout="fm_out(\'table\')" onclick="fm_dt_click()" ctp="{6}"{7}><tr><td style="text-align:{8}">'
                                    + '<input type="text" class="fm_dt_text" onkeydown="skipEnter()" onfocus="fm_dt_focus()" onpropertychange="fm_dt_change()" value="{1}" readonly/>'
                                    + '<div class="form_time_div"{5}>'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'h\')" onclick="fm_time_click(\'h\',0)" value="{2}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'m\')" onclick="fm_time_click(\'m\',1)" value="{3}" readonly/>:'
                                    + '<input type="text" name="{0}" class="dt_hm" onkeydown="fm_time_keydown(\'s\')" onclick="fm_time_click(\'s\',2)" value="{4}" readonly/></div></td></tr></table>',
                                    getUniqueKey("t"), dates[0], dates[1], dates[2], dates[3], (dates[0] ? '' : ' style="display:none"'), heads[i].ctp, ro1, align);
                                break;
                        }
                        break;
                    // 布尔 
                    case "5":
                        subVal = (rowIndex == -1 ? (subCol.i ? "Y" : "N") : subVal);
                        cell.innerHTML = stringFormat('{4}<div{3}>'
                            + '<label><input type="radio" name="{0}" class="idbox"{1}/>是</label>'
                            + '<label><input type="radio" name="{0}" class="idbox"{2}/>否</label></div>{5}',
                            getUniqueKey("b"), (subVal == "Y" ? " checked" : ""), (subVal == "Y" ? "" : " checked"), ro1, ro2_1, ro2_2);
                        break;
                    // 单选 
                    case "6":
                        var selHtml = stringFormat('{1}<select class="font" style="width:100%"{0}>'
                            + '<option value="">请选择</option>', ro1, ro2_1);
                        var sels = _sels[subCol.v] || [];
                        for (var l = 0; l < sels.length; l++)
                        {
                            selHtml += stringFormat('<option value="{0}"{2}>{1}</option>', sels[l][0], sels[l][1], (sels[l][0] == subVal ? " selected" : ""));
                        }
                        selHtml += '</select>' + ro2_2;
                        cell.innerHTML = selHtml;
                        break;
                    // 多选 
                    case "7":
                        var cols = heads[i].cols ? heads[i].cols : 1
                        var selHtml = stringFormat('{1}<div class="nowrap"{0}>', ro1, ro2_1);
                        var sels = _sels[subCol.v] || [];
                        for (var l = 0; l < sels.length; l++)
                        {
                            selHtml += stringFormat('{2}<label><input type="checkbox" class="idbox" value="{0}"{3}/>{1}</label>',
                                sels[l][0], sels[l][1], ((l > 0 && l % cols == 0) ? "<br/>" : ""), (subVal.splice && $.inArray(sels[l][0], subVal) != -1 ? " checked" : ""));
                        }
                        selHtml += '</div>' + ro2_2;
                        cell.innerHTML = selHtml;
                        break;
                }
                break;
            // 公式列
            case "1":
                if (rowIndex <= 0)
                {
                    heads[i].expr = subCol.e;
                    heads[i].notNegative = !subCol.i;
                }
                cell.innerHTML = stringFormat('<input type="text" class="fm_text" onmouseover="fm_over()" onmouseout="fm_out()" style="text-align:{3}" value="{0}" len="{1}" fmt="{2}" readOnly="true"/>',
                    (subVal ? getNumValue(subVal, subCol.l, subCol.f) : subVal), subCol.l, subCol.f, align);
                break;
        }
    }
    if ($.inArray(table.field, getFormExprParams(_cols)) != -1)
    {
        fm_value_calculate(table.field);
    }
}

// 转非负数non-negative number 
function parseNNN(value)
{
    return value > 0 ? value : 0;
}




// 公式解析：

// 获取控件（mode：1:获取设置了公式且使用field为公式参数的控件数组/2:获取指定field的控件）
function getFormControlByFiled(field, mode)
{
    var controls = [];
    var objs = fm_controls_get();
    for (var i = 0; i < objs.length; i++)
    {
        if (mode == 1 && objs[i].expr && objs[i].expr.indexOf("{" + field + "}") != -1)
        {
            controls.push(objs[i]);
        }
        else if (mode == 2 && objs[i].field == field)
        {
            controls.push(objs[i]);
            break;
        }
    }
    return mode == 1 ? controls : (controls.length ? controls[0] : null);
}

//用于数值类型文本框光标聚焦时零值清空
function clearInputValue() {
    if (!Number(this.value)) {
        this.value = '';
    }
}

// 计算公式值，用于文本框的onpropertychange
function fm_value_calculate(field)
{
    if (field || event.propertyName == "value")
    {
        if (!field)
        {
            var obj = getEventObj();

            // 自定义子表的单元格文本框改变
            if (!obj.field)
            {
                var td = getParentObj(obj, "td");
                var tr = getParentObj(td, "tr");
                var tb = getParentObj(td, "table");
                obj = tb.tHead.rows[1].cells[td.cellIndex];

                // 计算自定义子表内同一行中设置了的公式的文本框的值
                for (var i = 0; i < tb.tHead.rows[1].cells.length; i++)
                {
                    var th = tb.tHead.rows[1].cells[i];
                    if (th.expr && th.expr.indexOf("{" + obj.field + "}") != -1)
                    {
                        var txt = getObjC(tr.cells[i], "input", 0);
                        if (txt)
                        {
                            txt.value = getNumValue(eval(th.expr.replace(/\{(.+?)\}/g, function(match, $1) { return getSubTableCellValue(tr, $1); })), txt.len, txt.fmt, th.notNegative);
                            if (tb.tFoot.style.display == "")
                            {
                                totalSubTableCol(tb, i);
                            }
                        }
                    }
                }
            }

            field = obj.field;
        }

        // 计算设置了公式文本框的值
        var objs = getFormControlByFiled(field, 1);
        for (var i = 0; i < objs.length; i++)
        {
            objs[i].value = getNumValue(eval(objs[i].expr.replace(/\{(.+?)\}|\<(.+?)\>\{(.+?)\}\[(.*?)\]/g, getFormControlValue)), objs[i].len, objs[i].fmt, objs[i].notNegative);
        }
    }
}

// 替换公式内的field为值
function getFormControlValue(match, txtField, fun, tableField, funExpr)
{
    var result = 0;
    // 子表外计算
    if (txtField)
    {
        var txt = getFormControlByFiled(txtField, 2);
        if (txt)
        {
            result = getRound(txt.value);
        }
    }
    // 子表内聚合或子表行数
    else
    {
        var tb = getFormControlByFiled(tableField, 2);
        if (tb)
        {
            if (fun == "COUNT")
            {
                result = tb.tBodies[0].rows.length;
            }
            else if (tb.tBodies[0].rows.length > 0)
            {
                for (var i = 0; i < tb.tBodies[0].rows.length; i++)
                {
                    var value = eval(funExpr.replace(/\{(.+?)\}/g, function(match, $1) { return getSubTableCellValue(tb.tBodies[0].rows[i], $1); }));
                    if (fun == "SUM" || fun == "AVG")
                    {
                        result += value;
                    }
                    else if (fun == "MAX" && value > result || fun == "MIN" && value < result || i == 0)
                    {
                        result = value;
                    }
                }
                if (fun == "AVG")
                {
                    result /= tb.tBodies[0].rows.length;
                }
            }
        }
    }
    if (result < 0)
    {
        result = "(" + result + ")";
    }
    return result;
}

// 获取子表单元格的值
function getSubTableCellValue(row, thField)
{
    var result = 0;
    var table = getParentObj(row, "table");
    var cellIndex = getSubTableThCellIndex(table, thField);
    if (cellIndex >= 0)
    {
        // 自定义子表
        if (table.tHead.rows.length > 1)
        {
            var txt = getObjC(row.cells[cellIndex], "input", 0);
            if (txt)
            {
                result = getRound(txt.value);
            }
        }
        // 系统子表
        else
        {
            result = getRound(row.cells[cellIndex].innerText);
        }
    }
    if (result < 0)
    {
        result = "(" + result + ")";
    }
    return result;
}

// 获取子表指定列的索引
function getSubTableThCellIndex(table, thField)
{
    var cellIndex = -1;
    var thFieldRowIndex = table.tHead.rows.length - 1;
    var cells = table.tHead.rows[thFieldRowIndex].cells;
    for (var i = 0; i < cells.length; i++)
    {
        if (table.tHead.rows[thFieldRowIndex].cells[i].field == thField)
        {
            cellIndex = i;
            break;
        }
    }
    return cellIndex;
}

// 获取作为公式参数的列的field数组（自定义列为其field，自定义子表列为tableField.field）
function getFormExprParams(cols)
{
    if (!cols)
    {
        cols = $.stringToJSON(hidForm_Values.value);
    }
    var exprParams = window["IDForm_ExprParamFields"];
    if (!exprParams)
    {
        exprParams = [];
        window["IDForm_ExprParamFields"] = exprParams;

        for (var colField in cols)
        {
            var col = cols[colField];
            if (col.t == "1")
            {
                col.e.replace(/\{(.+?)\}|\<(.+?)\>\{(.+?)\}\[(.*?)\]/g, setFormExprParams);
            }
            else if (col.t == "4")
            {
                for (var subColField in col.d)
                {
                    var subCol = col.d[subColField];
                    if (subCol.t == "1")
                    {
                        subCol.e.replace(/\{(.+?)\}/g, function(match, $1) { pushArray(exprParams, colField + "." + $1); });
                    }
                }
            }
        }
    }

    return exprParams;
}

// 设置作为公式参数的列的field数组
function setFormExprParams(match, txtField, fun, tableField, funExpr)
{
    var exprParams = window["IDForm_ExprParamFields"];
    if (txtField)
    {
        pushArray(exprParams, txtField);
    }
    else
    {
        pushArray(exprParams, tableField);
        if (funExpr)
        {
            funExpr.replace(/\{(.+?)\}/g, function(match, $1) { pushArray(exprParams, tableField + "." + $1); });
        }
    }
}