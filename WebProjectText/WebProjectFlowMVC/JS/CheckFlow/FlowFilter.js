// JScript 文件

var scrollTop = 0;
var scrollLeft = 0;

// VFlowFilter.aspx的js

// 切换公司
function changeCorp()
{
    execFrameFuns("Left", function(){window.frames("Left").loadFlowType($("#ddlCorp").val());});
}

// 切换模块
function changeMod()
{
    execFrameFuns("Main", function(){window.frames("Main").reloadFlowData();});
}


// VFlowFilterLeft.aspx的js

// 加载流程类别
function loadFlowType(corpID)
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    
    window.parent["CorpID"] = corpID;
    ajax("VFlowFilterLeft.aspx", { "CorpID": corpID }, "html", refreshFlowType);
}

// 刷新流程类别
function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);
    
    divMPList.scrollTop = scrollTop;
    divMPList.scrollLeft = scrollLeft;
    
    var spanID = window["TreeNode_Selected"];
    if (!spanID)
    {
        spanID = "span_0";
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["FlowTypeID"] = null;
    }
}

// 显示流程列表
function showFlowList(span, ftID)
{
    clickTreeNode(span);
    
    window.parent["FlowTypeID"] = ftID;
    execFrameFuns("Main", function(){window.parent.frames("Main").reloadFlowData();}, window.parent);
}


// VFlowFilterMain.aspx的js

// 加载流程
function reloadFlowData()
{
    var ddlMod = getObjP("ddlMod");
    var fmId = ddlMod.value;
    var kw = getObjP("txtKW").value;
    if (fmId)
    {
        fmId = fmId.split("|")[0];
    }
    
    var query = { "CorpID":window.parent["CorpID"], "FlowTypeID":window.parent["FlowTypeID"], "FMID":fmId, "KW":kw };
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// 流程名称项
function cellFlowName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showFlow(\'' + options.rowId + '\')">' + cellvalue +'</a>';
}

// 流程条件项
function cellFilter(cellvalue, options, rowobject)
{
    var filter = "";
    var action = 0;
    var docType = "";
    var modCode = "";
    var fmId = rowobject[0];
    var ddlMod = getObjP("ddlMod");
    for (var i = 1; i < ddlMod.options.length; i++)
    {
        var modInfo = ddlMod.options[i].value.split("|");
        if (fmId == modInfo[0])
        {
            docType = modInfo[1];
            modCode = modInfo[2];
            break;
        }
    }
    
    if (cellvalue && cellvalue.length >= 3)
    {
        if (cellvalue.charAt(0) == "1")
        {
            filter += "/流程";
        }
        if (cellvalue.charAt(1) == "1")
        {
            filter += "/环节";
        }
        if (cellvalue.charAt(2) == "1")
        {
            filter += "/审批人";
        }
        if (filter != "")
        {
            filter = filter.substr(1);
        }
        action = 1;
    }
    else
    {
        filter = "设置";
    }
    
    return '<a href="javascript:setFilter(\'' + options.rowId + '\',\'' + docType + '\',\'' + modCode + '\',' + action + ')">' + filter + '</a>';
}

// 查看流程
function showFlow(flowID)
{
    openWindow("../Flow/VFlowBrowse.aspx?ID=" + flowID, 0, 0);
}

// 预览/设置流程条件
function setFilter(flowID, docType, modCode, action)
{
    var url = "VFlowFilterSetting.aspx";
    url = addUrlParam(url, "DocType", docType);
    url = addUrlParam(url, "ModCode", modCode);
    url = addUrlParam(url, "FlowID", flowID);
    if (action)
    {
        url = addUrlParam(url, "From", "Browse");
    }

    openWindow(url, 0, -1);
}


// VFlowFilterSetting.aspx的js

// onload默认加载流程的系统条件
function loadFFInfo()
{
    var from = (getParamValue("From") == "Browse");
    
    getObj("liPreview").style.display = from ? "" : "none";
    tdBtn.style.display = from ? "none" : "";

    selectTab(0, "SetInfo");

    var position1 = "left -21px";
    var position2 = "right -21px";
    var color;
    if (getThemeVersion() === 2014)
    {
        position1 = "left -22px";
        position2 = "right -22px";
        color = "#ffffff";
    }
    else
    {
        color = "#1f5885";
    }
    selectIDTab(getObjs("IDFormTab")[0], position1, position2, color);
    
    loadFF();
}

// 流程图鼠标效果(opt：0:mouseover/1:mouseout/2:click；type：0;flow/1:tach/2:checker)
function setFlowStyle(opt, type)
{
    event.cancelBubble = true;
    
    var obj = type == 0 ? divFL : (type == 1 ? getEventObj("table") : getEventObj("tr"));
    
    // 调整、拆分、归档环为串行环节，其审批人不支持条件（条件设置在环节上）
    if (type == 2 && inValues(obj.flowoption, "1", "2", "5"))
    {
        type = 1;
        obj = getParentObj(obj, "table");
    }

    if (opt == 2)
    {
        if (type == 1)
        {
            $("#ddlTach").val(obj.ownerid);
        }
        else if (type == 2)
        {
            $("#ddlChecker").val(obj.ownerid);
        }
        showSetTab(type);
        return;
    }
    
    var backColor = opt == 0 ? "#fff8d9" : "";
    var borderColor = opt == 0 ? "#febe8f" : "";
    
    obj.style.backgroundColor = backColor;
    if (type == 2)
    {
        obj.cells[0].style.borderColor = borderColor;
        obj.cells[1].style.borderColor = borderColor;
    }
    else
    {
        obj.style.borderColor = borderColor;
    }
}

// 切换条件类型tab
function showSetTab(index)
{
    selectTab(index, "SetInfo");
    trTach.style.display = (index == 1 ? "" : "none");
    trChecker.style.display = (index == 2 ? "" : "none");
    trFF.style.display = (index == 3 ? "none" : "");
    trPFF.style.display = (index == 3 ? "" : "none");
    tdPv.style.display = (index == 3 ? "" : "none");
    
    if (index == 0)
    {
        $("#hidFilterType").val(0);
        $("#hidOwnerID").val($("#hidFlowID").val());
    }
    else if (index == 1)
    {
        $("#hidFilterType").val(1);
        $("#hidOwnerID").val($("#ddlTach").val());
    }
    else if (index == 2)
    {
        $("#hidFilterType").val(2);
        $("#hidOwnerID").val($("#ddlChecker").val());
    }
    else if (index == 3)
    {
        $("#hidOwnerID").val("");
    }
    
    loadFF();
}

// 切换表单tab
function showFormTab(aHref, formId)
{
    var position1 = "left -21px";
    var position2 = "right -21px";
    var color;
    if (getThemeVersion() === 2014)
    {
        position1 = "left -22px";
        position2 = "right -22px";
        color = "#ffffff";
    }
    else
    {
        color = "#1f5885";
    }
    selectIDTab(aHref, position1, position2, color);
    
    if (formId != $("#hidFormID").val() && !$("#hidOwnerID").val())
    {
        clearTable(tbFV);
    }
    
    $("#hidIsForm").val(formId ? "1" : "0");
    $("#hidFormID").val(formId);
    
    loadFF();
}

// 切换环节或审批人
function changeDDL(ddl)
{
    $("#hidOwnerID").val(ddl.value);
    
    loadFF();
}

// 加载流程条件/条件列
function loadFF()
{
    var docType = $("#hidDocType").val();
    var modCode = $("#hidModCode").val();
    var ownerId = $("#hidOwnerID").val();
    var isForm = $("#hidIsForm").val();
    var formId = $("#hidFormID").val();

    if (ownerId)
    {        
        scrollTop = divMPList1.scrollTop;
        scrollLeft = divMPList1.scrollLeft;
        setAjaxContainer(divMPList1);
        
        var query = { "Action":"GetFG", "DocType":docType, "ModCode":modCode, "OwnerID":ownerId, "IsForm":isForm, "FormID":formId }
        if (getParamValue("From") == "Browse")
        {
            query.From = "Browse";
        }
        ajax("VFlowFilterSetting.aspx", query, "html", refreshFF);
    }
    else
    {
        getObj("ddlOpt").length = 0;
        $(divValues).html("");
        
        setAjaxContainer(divCols);
        
        var query = { "Action":"GetFC", "DocType":docType, "ModCode":modCode, "IsForm":isForm, "FormID":formId }
        ajax("VFlowFilterSetting.aspx", query, "html", refreshFC);
    }
}

// 刷新流程条件
function refreshFF(data, textStatus)
{
    $(divMPList1).html(data);
    
    divMPList1.scrollTop = scrollTop;
    divMPList1.scrollLeft = scrollLeft;
}

// 刷新流程条件
function refreshFC(data, textStatus)
{
    $(divCols).html(data);
}

// 增加/修改条件组
function editFG(isAdd)
{
    var url = isAdd ? "VFlowFilterAdd.aspx" : "VFlowFilterEdit.aspx";
    
    url = addUrlParam(url, "DocType", $("#hidDocType").val());
    url = addUrlParam(url, "ModCode", $("#hidModCode").val());
    url = addUrlParam(url, "FilterType", $("#hidFilterType").val());
    url = addUrlParam(url, "OwnerID", $("#hidOwnerID").val());
    url = addUrlParam(url, "IsForm", $("#hidIsForm").val());
    url = addUrlParam(url, "FormID", $("#hidFormID").val());
    
    if (isAdd)
    {
        openWindow(url, 800, 600);
    }
    else
    {
        openModifyWindow(url, 800, 600);
    }
}

// 删除条件组
function delFG()
{
    openDeleteWindow("FlowFilterGroup", 0);
}

// 增删改后刷新条件组
function reloadData()
{
    loadFF();
}

// 预览流程
function pvFlow(isOriginal)
{
    var filter = "";
    var formId = "";
    if (!isOriginal)
    {
        formId = $("#hidFormID").val();
        if (tbFV.rows.length < 2)
        {
            return alertMsg("请设置条件。");
        }
        
        var jsonDatas = [];
        for (var i = 1; i < tbFV.rows.length; i++)
        {
            var chk = getObjTR(tbFV, i, "input", 0);
            var isForm = chk.isform;
            var colname = chk.colname;
            var ocode = chk.ocode;
            var value = chk.value;
            var vtype = chk.vtype;
            
            jsonDatas.push({"IsFormCol":isForm, "ColName":colname, "OCode":ocode, "Value":value, "Text":"", "ValueType":vtype});
        }
        filter = $.jsonToString(jsonDatas);
    }
    
    setAjaxContainer(divFL);
    ajax("VFlowFilterSetting.aspx", { "Action":"RefreshFlow", "FlowID":$("#hidFlowID").val(), "FormID":formId, "Filter":filter}, "html", afterRefreshFlow);
}

// 刷新流程
function afterRefreshFlow(data, textStatus)
{
    $(divFL).html(data);
}


// VFlowFilterAdd.aspx的js

// 点击条件项
function cFC(span, isFormCol, colName, colType, colDataType, colDbType, colLen, operator, isPreview)
{
    // 选中
    clickTreeNode(span);
    
    // 加载操作符
    var ddlOpt = getObj("ddlOpt");
    var opts = getJsonParams(getObj("hidOpt").value, ",", "-");
    ddlOpt.length = 0;
    
    // 预览时，操作符只能为包含(4种情况)或等于(其他)
    if (isPreview)
    {
        var k = (isFormCol && colType == 0 && colDataType == 7 || !isFormCol && inValues(colName, "ZBSort", "ZBFType", "PlanType")) ? "12" : "0";
        var opt = document.createElement("OPTION");
        opt.value = k;
        opt.text = opts[k];
        ddlOpt.add(opt);
    }
    else
    {
        var ocodes = operator.split(",");
        for (var i = 0; i < ocodes.length; i++)
        {
            for (var k in opts)
            {
                if (ocodes[i] == k)
                {
                    var opt = document.createElement("OPTION");
                    opt.value = k;
                    opt.text = opts[k];
                    ddlOpt.add(opt);
                    break;
                }
            }
        }
    }
    
    $("#spDesc").text("");
    
    // 存条件信息
    window["IsFormCol"] = isFormCol;
    window["ColType"] = colType;
    window["ColDataType"] = colDataType;
    window["ColDBType"] = colDbType;
    window["ColName"] = colName;
    window["ColTitle"] = span.innerText;
    window["ColLen"] = colLen;
    
    // 加载值
    loadFV();
}

// 条件值类型：0:选择/1:数字/2:百分比/3:日期/4:关键字
function getFVType()
{
    var result;

    var isFormCol = window["IsFormCol"];
    var colType = window["ColType"];
    var colDataType = window["ColDataType"];
    var colDbType = (window["ColDBType"] ? window["ColDBType"].toLowerCase() : "");    

    // 表单条件
    if (isFormCol)
    {
        // 自定义列
        if (colType == 0)
        {
            if (colDataType == 0)
            {
                result = 4;
            }
            else if (colDataType == 2 || colDataType == 3)
            {
                result = 1;
            }
            else if (colDataType == 4)
            {
                result = 3;
            }
            else if (colDataType == 5 || colDataType == 6 || colDataType == 7)
            {
                result = 0;
            }
        }
        // 公式列
        else if (colType == 1)
        {
            result = 1;
        }
        // 系统列
        else if (colType == 2)
        {
            if (colDbType == "int" || colDbType == "smallint" || colDbType == "float" || colDbType.indexOf("decimal") != -1)
            {
                result = 1;
            }
            else if (colDbType == "datetime" || colDbType == "smalldatetime")
            {
                result = 3;
            }
            else
            {
                result = 4;
            }
        }
    }
    // 系统条件
    else
    {
        result = colType;
    }
    
    return result;
}

// 切换操作符
function cOpt()
{
    var operator = $("#ddlOpt").val();
    
    var fvType = getFVType();
    if (fvType == 0)
    {
        var html = $(divValues).html();
        if (operator == "10" || operator == "11" || operator == "12" || operator == "13")
        {
            html = html.replace(/type=['"]?radio['"]?/gi, 'type="checkbox"');
            $("#lblSelectAll").show();
        }
        else
        {
            html = html.replace(/type=['"]?checkbox['"]?/gi, 'type="radio"');
            $("#lblSelectAll").hide();
        }
        $(divValues).html(html);
    }
    else if (fvType == 1 || fvType == 2 || fvType == 3)
    {
        var txt = getObjC(divValues, "input", 0);
        if (operator == "6" || operator == "7" || operator == "8" || operator == "9")
        {
            var operatorTexts = getJsonParams(getObj("hidOpt").value, ",", "-")[operator].split('&');
            var table = getObjC(divValues, "table", 0);
            if (table)
            {
                $(table.rows[0].cells[0]).text(operatorTexts[0]);
                $(table.rows[2].cells[0]).text(operatorTexts[1]);
            }
            else
            {
                $(divValues).html(stringFormat('<table style="width:100%">'
                    + '<tr><td class="font" style="width:1%;white-space:nowrap">{0}</td><td>{2}</td></tr>'
                    + '<tr><td colspan="2" class="font">且</td></tr>'
                    + '<tr><td class="font" style="white-space:nowrap">{1}</td><td>{3}</td></tr>'
                    + '</table>', operatorTexts[0], operatorTexts[1], txt.outerHTML, txt.outerHTML));
            }
        }
        else
        {
            $(divValues).html(txt.outerHTML);
        }
    }
    else if (fvType == 4)
    {
        $("#spDesc").text((operator == "12" || operator == "13") ? " (关键字，多个用逗号,分隔)" : "");
    }

    if (fvType == 0 && (operator == "10" || operator == "11" || operator == "12" || operator == "13"))
    {
        $("#tbValues td").click(selectChildValues);
    }
}

// 全选条件值
function selectAllValues(chk) 
{
    $("#tbValues :checkbox").not(".nodisp").attr("checked", chk.checked);
}

// 选择条件值（含子项的值）
function selectChildValues()
{
    var obj = getEventObj();
    if (obj.tagName.toLowerCase() == "td")
    {
        var tr = getParentObj(obj, "tr");
        var objs = $("#tbValues tr:[id^=" + tr.id + "]").find(":checkbox").not(".nodisp");
        if (objs.length)
        {
            objs.attr("checked", !objs.get(0).checked);
        }
    }
}

// 加载条件值
function loadFV()
{
    var ddlOpt = getObj("ddlOpt");
    if (!window["ColName"] || !ddlOpt.length)
    {
        return;
    }
    
    var fvType = getFVType();
    
    var isFormCol = window["IsFormCol"];
    var colType = window["ColType"];
    var colName = window["ColName"];
    var colTitle = window["ColTitle"];
    var colLen = window["ColLen"];
    
    switch (fvType)
    {
        case 0:
            setAjaxContainer(divValues);
            ajax("VFlowFilterAdd.aspx", { "Action":"GetFV", "IsFormCol":isFormCol, "ColName":colName }, "html", refreshFV);
            break;
        case 1:
            if (colTitle.indexOf("(") != -1 && colTitle.indexOf(")") != -1)
            {
                var i = colTitle.lastIndexOf("(");
                var j = colTitle.lastIndexOf(")");
                $("#spDesc").text(" " + colTitle.substr(i, j - i + 1));
            }
            $(divValues).html(getTextBoxHtml("txtValues", null, null, "setRound(" + colLen + ")"));
            break;
        case 2:
            $("#spDesc").text(" (%)");
            $(divValues).html(getTextBoxHtml("txtValues", null, null, "setRound(" + colLen + ",0,100)"));
            break;
        case 3:
            $(divValues).html(getSelectDateHtml("txtValues"));
            break;
        case 4:
            $(divValues).html(getTextAreaHtml("txtValues", null, 60));
            break;
    }
}

// 刷新条件值
function refreshFV(data, textStatus)
{
    $(divValues).html(data);
    cOpt();
}

// 点击第一级条件值
function cFV1(lbl)
{
    var td = lbl.parentNode;
    var tr = td.parentNode;
    var img = getTGImg(tbValues, tr.rowIndex, td.cellIndex);
    if (img)
    {
        img.click();
    }
}

// 增加条件
function addFF()
{
    var colName = window["ColName"];
    if (!colName)
    {
        return alertMsg("请选择条件。");
    }
    for (var i = 1; i < tbFV.rows.length; i++)
    {
        if (getObjTR(tbFV, i, "input", 0).colname == colName)
        {
            return alertMsg("该条件项已存在，不能重复添加。");
        }
    }
    
    var value = "";
    var text = "";
    var vtype = "";
    var objValue;
    var operator = $("#ddlOpt").val();
    var fvType = getFVType();
    if (fvType == 0)
    {
        objValue = getObj("tbValues");
        if (objValue)
        {
            for (var i = 0; i < objValue.rows.length; i++)
            {
                var chk = getObjTR(objValue, i, "input", 0);
                if (chk.checked)
                {
                    value += "," + chk.value;
                    text += "," + trim(objValue.rows[i].cells[0].innerText);
                }
            }
            if (value)
            {
                value = value.substr(1);
                text = text.substr(1);
            }
        }
    }
    else
    {
        if (operator == "6" || operator == "7" || operator == "8" || operator == "9")
        {
            var objMinValue = getObjC(divValues, "input", 0);
            var objMaxValue = getObjC(divValues, "input", 1);
            if (objMinValue && objMaxValue)
            {
                var minValue = objMinValue.value;
                var maxValue = objMaxValue.value;
                if (minValue != "" && maxValue != "")
                {
                    if ((fvType == 1 || fvType == 2) && getRound(minValue) > getRound(maxValue) || fvType == 3 && compareDate(minValue, maxValue) == -1)
                    {
                        return alertMsg("上限值不能小于下限值。", objMaxValue);
                    }
                    else
                    {
                        value = minValue + ',' + maxValue;
                        text = ((operator == "6" || operator == "7") ? '(' : '[') + minValue + (fvType == 2 ? "%" : "")
                            + ',' + maxValue + (fvType == 2 ? "%" : "") + ((operator == "6" || operator == "8") ? ')' : ']');
                    }
                }
                else
                {
                    objValue = minValue == "" ? objMinValue : objMaxValue;
                }
            }
        }
        else
        {
            objValue = getObj("txtValues");
            if (objValue)
            {
                value = objValue.value;
                text = objValue.value + (fvType == 2 ? "%" : "");
            }
        }
    }
    if (fvType == 0 || fvType == 4)
    {
        if (operator == "10" || operator == "11" || operator == "12" || operator == "13")
        {
            vtype = "3";
        }
        else
        {
            vtype = "0";
        }
    }
    else if (fvType == 1 || fvType == 2)
    {
        vtype = "1";
    }
    else if (fvType == 3)
    {
        vtype = "2";
    }
    if (value != "")
    {
        insertFFRow(window["IsFormCol"], colName, window["ColTitle"], operator, $("#ddlOpt option:selected").text(), vtype, value, text);
        
        setTableRowAttributes(tbFV);
        
        window["IsFormCol"] = null;
        window["ColType"] = null;
        window["ColDataType"] = null;
        window["ColDBType"] = null;
        window["ColName"] = null;
        window["ColTitle"] = null;
        window["ColLen"] = null;
        
        deselectTreeNode();
        getObj("ddlOpt").length = 0;
        $(divValues).html("");
    }
    else
    {
        return alertMsg("“" + window["ColTitle"] + "”的条件值不能为空。", objValue);
    }    
}

// 插入一行条件
function insertFFRow(isformcol, colname, coltitle, ocode, oname, valuetype, filtervalue, filtertext)
{
    var row = tbFV.insertRow();

    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = stringFormat('<input class="idbox" type="checkbox" isform="{0}" colname="{1}" ocode="{2}" value="{3}" vtype="{4}" onclick="selectRow(this)" />',
        isformcol, colname, ocode, filtervalue, valuetype);

    cell = row.insertCell(1);
    cell.innerText = coltitle;

    cell = row.insertCell(2);
    cell.align = "center";
    cell.innerText = oname;

    cell = row.insertCell(3);
    cell.innerText = filtertext;
}

// 删除条件
function delFF()
{
    deleteTableRow(tbFV);
    setTableRowAttributes(tbFV);
}

// 保存条件组
function saveFG(isClose)
{
    window["IsClose"] = isClose;

    handleBtn(false);
    if (getObj("txtFGName").value == "")
    {
        handleBtn(true);
        return alertMsg("条件组名称不能为空。", getObj("txtFGName"));
    }
    if (tbFV.rows.length < 2)
    {
        handleBtn(true);
        return alertMsg("未设置任何条件。");
    }
    
    var jsonDatas = [];
    for (var i = 1; i < tbFV.rows.length; i++)
    {
        var chk = getObjTR(tbFV, i, "input", 0);
        var isForm = chk.isform;
        var colname = chk.colname;
        var ocode = chk.ocode;
        var value = chk.value;
        var text = tbFV.rows[i].cells[3].innerText;
        var vtype = chk.vtype;
        
        jsonDatas.push({"IsFormCol":isForm, "ColName":colname, "OCode":ocode, "Value":value, "Text":text, "ValueType":vtype});
    }
    
    var fgName = getObj("txtFGName").value;
    var remark = getObj("txtRemark").value;
    var filter = $.jsonToString(jsonDatas);
    
    var url = location.href;
    var action = "InsertFG";
    if (url.indexOf("VFlowFilterEdit.aspx") != -1)
    {
        url = url.replace("VFlowFilterEdit.aspx", "VFlowFilterAdd.aspx");
        action = "UpdateFG";
    }
    
    ajax(url, { "Action":action, "FGName":fgName, "Remark":remark, "Filter":filter}, "json", afterSaveFV, true, "POST");
}

// 保存条件成功
function afterSaveFV(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#txtFGName").val("");
        $("#txtRemark").val("");
        
        if (opener)
        {
            opener.loadFF();
        }
        if (window["IsClose"])
        {
            closeMe();
        }
        else
        {
            clearTable(tbFV);
            handleBtn(true);
        }
    }
    else
    {
        handleBtn(true);
        alert(data.Data);
    }
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled("btnSaveOpen,btnSaveClose", enabled)
}

// 加载条件（设计器调用）
function loadFFByData(fg)
{
    clearTable(tbFV);
    window["FG_Designer"] = fg;
    if (!fg["filter"])
    {
        return;
    }

    $("#txtFGName").val(fg["fgname"]);
    $("#txtRemark").val(fg["remark"]);

    for (var i = 0; i < fg["filter"].length; i++)
    {
        var ff = fg["filter"][i];

        insertFFRow(ff["isformcol"], ff["colname"], ff["coltitle"], ff["ocode"], ff["oname"], ff["valuetype"], ff["filtervalue"], ff["filtertext"]);
    }

    setTableRowAttributes(tbFV);
}

// 保存条件组（设计器调用）
function saveFFToData(saveopen)
{
    var fg = window["FG_Designer"];
    if (!fg)
    {
        return alertMsg("上下文丢失，请关闭本窗口重试。");
    }

    if (getObj("txtFGName").value == "")
    {
        return alertMsg("条件组名称不能为空。", getObj("txtFGName"));
    }
    if (tbFV.rows.length < 2)
    {
        return alertMsg("未设置任何条件。");
    }

    var ffs = [];
    for (var i = 1; i < tbFV.rows.length; i++)
    {
        var chk = getObjTR(tbFV, i, "input", 0);
        var isForm = chk.isform;
        var colname = chk.colname;
        var coltitle = tbFV.rows[i].cells[1].innerText;
        var ocode = chk.ocode;
        var oname = tbFV.rows[i].cells[2].innerText;
        var value = chk.value;
        var text = tbFV.rows[i].cells[3].innerText;
        var vtype = chk.vtype;

        ffs.push(
            {
                "ffid": "",
                "colname": colname,
                "coltitle": coltitle,
                "isformcol": isForm,
                "ocode": ocode,
                "oname": oname,
                "valuetype": vtype,
                "filtervalue": value,
                "filtertext": text
            });
    }

    fg["fgname"] = $("#txtFGName").val();
    fg["remark"] = $("#txtRemark").val();
    fg["filter"] = ffs;

    $("#txtFGName").val("");
    $("#txtRemark").val("");
    clearTable(tbFV);

    if (saveopen)
    {
        deselectTreeNode();
        getObj("ddlOpt").length = 0;
        $(divValues).html("");

        window["IsFormCol"] = null;
        window["ColType"] = null;
        window["ColDataType"] = null;
        window["ColDBType"] = null;
        window["ColName"] = null;
        window["ColTitle"] = null;
        window["ColLen"] = null;
    }

    return true;
}