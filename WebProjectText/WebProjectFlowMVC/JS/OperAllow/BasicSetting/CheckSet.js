// VCheckSetLeft.aspx用到的js

// 加载审批模块
function loadMod()
{
    ajax("VCheckSetLeft.aspx", {}, "html", loadModHtml);
}

// 加载审批模块并选中第一个模块
function loadModHtml(data, textStatus)
{
    $(document.body).html(data);

    var spans = document.getElementsByTagName("span");
    for (var i = 0; i < spans.length; i++)
    {
        if (spans[i].isleaf == "1")
        {
            spans[i].click();
            break;
        }
    }
}

// 点击审批模块
function showModInfo(fmId, docType, modCode, modelType, businessType, typeDepend, moduleCode)
{
    var span = getEventObj();
    if (span.isleaf == "1")
    {
        var query = stringFormat("?FMID={0}&DocType={1}&ModCode={2}&ModelType={3}&BusinessType={4}&TypeDepend={5}&ModuleCode={6}", fmId, docType, modCode, modelType, businessType, typeDepend, moduleCode);

        clickTreeNode(span);
        getObjP("ifrMain").src = "VCheckSetMain.aspx" + query;
    }
    else
    {
        var td = span.parentNode;
        var tr = td.parentNode;
        var img = getTGImg(tbMod, tr.rowIndex, td.cellIndex);
        if (img)
        {
            img.click();
        }
    }
}


// VCheckSetMain.aspx用到的js

// 加载类别
function loadType()
{
    // 只有业务类别的，将业务类别居左
    if (!$("#ddlModelType").length && $("#ddlBusinessType").length)
    {
        $("#tdlbl1").append($("#lbl2"));
        $("#tdddl1").append($("#ddlBusinessType"));
        $("#lbl").show();
        $("#ddlBusinessType").show();
        $("#tdBusinessType").removeAttr("id");
        $("#tdddl1").attr("id", "tdBusinessType");
    }

    loadBusinessType(true);
}

// 加载业务类别
function loadBusinessType(first)
{
    var needLoad = true;
    var ddlBusinessType = getObj("ddlBusinessType");
    if (ddlBusinessType)
    {
        var typeDepend = getParamValue("TypeDepend");
        if (first || typeDepend=="1")
        {
            var dependId = $("#ddlModelType").val();
            if (typeDepend == "1" && !dependId)
            {
                ddlBusinessType.length = 1;
            }
            else
            {
                ajax("VCheckSetMain.aspx", { "Action": "GetBusinessType", "BusinessType": getParamValue("BusinessType"), "DependID": dependId }, "json", refreshBusinessType);
                needLoad = false;
            }
        }
    }
    if (needLoad)
    {
        reloadData();
    }
}

// 刷新业务类别
function refreshBusinessType(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#tdBusinessType").html(data.Data);
        reloadData();
    }
    else
    {
        alert(data.Data);
    }
}

// 加载数据
function reloadData()
{
    var ddlModelType = getObj("ddlModelType");
    var ddlBusinessType = getObj("ddlBusinessType");
    var modelTypeID = ddlModelType ? ddlModelType.value : "";
    var typeID = ddlBusinessType ? ddlBusinessType.value : "";
    var docType = getParamValue("DocType");
    var modCode = getParamValue("ModCode");

    ajax("VCheckSetMain.aspx", { "Action": "GetCheckInfo", "DocType": docType, "ModCode": modCode, "ProjectID": modelTypeID, "TypeID": typeID }, "json", refreshCheckInfo);
}

// 刷新审批信息
function refreshCheckInfo(data, textStatus)
{
    if (data.Success == "Y")
    {
        var oper = getObj("btnSubmit") ? true : false;
        var chkOffice = getObj("chkOffice");
        var rblUseOffice = getObj("rblUseOffice");
        var rblAutoShowOffice = getObj("rblAutoShowOffice");
        var upOffice = getObj("upOffice");
        var hidFormID = getObj("hidFormID");
        var hrFormTitle = getObj("hrFormTitle");
        var hidLookStationID = getObj("hidLookStationID");
        var txtLookStation = getObj("txtLookStation");
        var hidLookDeptID = getObj("hidLookDeptID");
        var txtLookDept = getObj("txtLookDept");
        var chkBill = getObj("chkBill");

        var info = $.stringToJSON(data.Data);

        // 设置Office文档信息
        if (chkOffice)
        {
            var isUseOffice = (info[0][0] == "Y");
            var isAutoShow = (info[0][1] == "Y");
            chkOffice.checked = info[0][0] ? false : true;
            getObjC(rblUseOffice, "input", isUseOffice ? 0 : 1).checked = true;
            getObjC(rblAutoShowOffice, "input", (isUseOffice && isAutoShow) ? 0 : 1).checked = true;
            if (upOffice.rows.length > 0)
            {
                clearIDUpFile("upOffice");
            }
            if (isUseOffice && info[0][2] && info[0][3])
            {
                var file = { "id": "SWFUpload_0_1", "index": 1, "filestatus": -4, "type": ".doc", "name": info[0][3] };
                appendFileByManual("upOffice", file, info[0][2]);
                $("#divOffice").html(getObj("upOffice").outerHTML);
                $(".up_fdel", $("#divOffice")).hide();
            }
            getParentObj("upOffice", "table").style.display = oper ? "" : "none";
            getObj("divOffice").style.display = oper ? "none" : "";
            if (!oper)
            {
                setControlReadOnly(rblUseOffice);
                setControlReadOnly(rblAutoShowOffice);
            }
        }

        // 设置表单信息
        if (hidFormID)
        {
            getParentObj("btnSelectForm").style.display = oper ? "" : "none";
            hidFormID.value = info[0][4] ? info[0][4] : "";
            hrFormTitle.value = info[0][5] ? info[0][5] : "";
        }

        // 设置送阅信息
        if (hidLookStationID)
        {
            getParentObj("btnLookStation").style.display = oper ? "" : "none";
            getParentObj("btnLookDept").style.display = oper ? "" : "none";
            hidLookStationID.value = info[1][0];
            txtLookStation.value = info[1][1];
            hidLookDeptID.value = info[1][2];
            txtLookDept.value = info[1][3];
        }

        // 会签单基本信息
        chkBill.checked = info[2][0] ? false : true;
        /*
        getObjC("rblOfficeFile", "input", info[2][0] == "Y" ? 0 : 1).checked = true;
        getObjC("rblAccessaryFiles", "input", info[2][1] == "Y" ? 0 : 1).checked = true;
        getObjC("rblLookInfo", "input", info[2][2] == "Y" ? 0 : 1).checked = true;
        getObjC("rblSignBar", "input", info[2][3] == "Y" ? 0 : 1).checked = true;
        不配置（或全局未配置）时，全部显示，和会签单的实现保持一致 edit by chengam 2014-09-03
        */
        getObjC("rblOfficeFile", "input", info[2][0] == "N" ? 1 : 0).checked = true;
        getObjC("rblAccessaryFiles", "input", info[2][1] == "N" ? 1 : 0).checked = true;
        getObjC("rblLookInfo", "input", info[2][2] == "N" ? 1 : 0).checked = true;
        getObjC("rblSignBar", "input", info[2][3] == "N" ? 1 : 0).checked = true;

        getObjC("rblCheckInfo", "input", info[2][5] == "N" ? 1 : 0).checked = true;
        if (!oper)
        {
            setControlReadOnly("rblOfficeFile");
            setControlReadOnly("rblAccessaryFiles");
            setControlReadOnly("rblLookInfo");
            setControlReadOnly("rblSignBar");
            setControlReadOnly("rblCheckInfo");
        }

        // 会签单主表、子表列信息
        var keyTableName = info[2][4];
        clearTableAll(tbKeyTable);
        clearTableAll(tbSubTables);
        for (var tableName in info[3])
        {
            var sysTable = info[3][tableName];
            if (!oper && !sysTable.cols.length)
            {
                continue;
            }
            var hiddenId = getUniqueKey("hid");
            var tableId = getUniqueKey("tb");
            var isKey = (tableName == keyTableName);
            var row = isKey ? tbKeyTable.insertRow() : tbSubTables.insertRow();
            var cell = row.insertCell(0);
            cell.className = "tdlbl";
            cell.innerHTML = oper ? (isKey ? stringFormat('<span class="font">{0}<br/>(基本信息列)</span><input type="hidden" value="{0}"/>', sysTable.title)
                : stringFormat('<input type="text" class="text" onfocus="setIDText(this,0)" onblur="setIDText(this,1)" onkeyup="checkSize(this,50)" value="{0}" />', sysTable.title))
                : stringFormat('<span class="font">{0}{1}</span>', sysTable.title, (isKey ? '<br/>(基本信息列)' : ''));

            cell = row.insertCell(1);
            cell.innerHTML = stringFormat('<table border="0" cellpadding="2" cellspacing="0" width="100%"><tr{3}><td>'
                + '<button tableid="{1}" table="{2}" onclick="setCols(0,\'{0}\',\'{1}\',{6})" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)" '
                + 'onfocus="this.blur()" class="btnsmall"><span class="btntext">新增</span></button>'
                + '<button onclick="delCols(\'{1}\')" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)" '
                + 'onfocus="this.blur()" class="btnsmall"><span class="btntext">删除</span></button>'
                + '<input id="{0}" type="hidden"/></td></tr><tr><td><table id="{1}" class="table" border="0" cellspacing="0"><tr class="table_headrow">'
                + '<td style="width:5%;{4}" align="center"><input type="checkbox" class="idbox" onclick="selectTableAll({1},this)" /></td>'
                + '<td style="width:35%;white-space:nowrap">名称</td><td style="width:20%;white-space:nowrap">格式</td>'
                + '<td style="width:10%;white-space:nowrap">小数</td><td style="width:10%;white-space:nowrap;{5}">列宽%</td>'
                + '<td style="width:10%;white-space:nowrap;{5}">对齐</td><td style="width:10%;white-space:nowrap;{4}">移动</td>'
                + '</tr></table></td></tr></table>',
                hiddenId, tableId, tableName, (oper ? '' : ' style="display:none"'), (oper ? '' : ' display:none'), (isKey ? ' display:none' : ''), isKey);

            getObj(hiddenId).value = $.jsonToString(sysTable.cols);
            setCols(1, hiddenId, tableId, isKey);
        }
        tbKeyTable.style.display = tbKeyTable.rows.length > 0 ? "" : "none";
        tbSubTables.style.display = tbSubTables.rows.length > 0 ? "" : "none";

        setDisplay();
    }
    else
    {
        alert(data.Data);
    }
}

// 控件显隐
function setDisplay()
{
    var chkOffice = getObj("chkOffice");
    var chkBill = getObj("chkBill");
    if (chkOffice)
    {
        var trOffice = getParentObj(chkOffice, "tr").nextSibling;
        var useOffice = getObjC("rblUseOffice", "input", 0).checked;
        trUseOffice1.style.display = useOffice ? "" : "none";
        trUseOffice2.style.display = useOffice ? "" : "none";
        trOffice.style.display = chkOffice.checked ? "none" : "";
    }
    var trBill1 = getParentObj(chkBill, "tr").nextSibling;
    var trBill2 = trBill1.nextSibling;
    trBill1.style.display = chkBill.checked ? "none" : "";
    trBill2.style.display = chkBill.checked ? "none" : "";
}

// 选择表单
function selectForm()
{
    var url = "../../Common/Select/CheckFlow/VSelectForm.aspx?SelectMode=Single&FMID=" + getParamValue("FMID");

    var returnValue = openModalWindow(url, 800, 600);
    if (!returnValue)
    {
        return false;
    }

    if (returnValue.length == 1)
    {
        getObj('hidFormID').value = returnValue[0].FormID;
        getObj('hrFormTitle').value = returnValue[0].FormTitle;
    }
}

// 查看表单
function showForm()
{
    var formID = getObj("hidFormID").value;
    openWindow('../../CheckFlow/FlowForm/VFormBrowse.aspx?FormID=' + formID, 800, 600);
}

// 选择岗位
function selectStation()
{
    var from;
    switch (getParamValue("ModelType"))
    {
        case "P":
            from = "Project";
            break;
        case "D":
            from = "Dept";
            break;
        default:
            from = "Corp";
            break;
    }
    var ddlModelType = getObj("ddlModelType");
    var corpID = ddlModelType ? ddlModelType.value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + corpID + '&From=' + from, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

// 选择部门
function selectDept()
{
    var from;
    switch (getParamValue("ModelType"))
    {
        case "P":
            from = "Project";
            break;
        case "D":
            from = "Dept";
            break;
        default:
            from = "Corp";
            break;
    }
    var ddlModelType = getObj("ddlModelType");
    var corpID = ddlModelType ? ddlModelType.value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + corpID + '&From=' + from, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}

// 新增明细(opt：0:新增/1:修改)
function setCols(opt, hiddenId, tableId, isKey)
{
    if (!opt)
    {
        var tableName = getEventObj().table;
        openModalWindow("../../Common/Select/CheckFlow/VSelectSysTableCols.aspx?TableName=" + tableName + "&HiddenID=" + hiddenId + "&TableID=" + tableId, 350, 500);
    }
    var hidTable = getObj(hiddenId);
    var table = getObj(tableId);
    var arrDatas = $.stringToJSON(hidTable.value);
    var oper = getObj("btnSubmit") ? true : false;
    for (var i = 0; i < arrDatas.length; i++)
    {
        var col = arrDatas[i];
        var row = table.insertRow();
        var cell;
        var cellIndex = 0;

        if (oper)
        {
            cell = row.insertCell(cellIndex++);
            cell.innerHTML = getCheckBoxHtml(null, col.ColName, { "format": col.Format });
            cell.align = "center";
        }

        cell = row.insertCell(cellIndex++);
        cell.innerText = col.ColTitle;

        cell = row.insertCell(cellIndex++);
        cell.innerText = getFmtName(col);
        cell.align = "center";

        cell = row.insertCell(cellIndex++);
        cell.innerText = col.ColLen;
        cell.align = "center";

        if (!isKey)
        {
            var width = col.Width ? col.Width : "";
            cell = row.insertCell(cellIndex++);
            cell.innerHTML = oper ? '<input type="text" class="text" onfocus="setIDText(this,0)" onblur="setIDText(this,1);setPlusIntNum()" value="'
                + width + '" maxlength="2" style="width:30px" />' : width;
            cell.align = "center";

            var align = col.Align ? col.Align : "L";
            cell = row.insertCell(cellIndex++);
            cell.innerHTML = oper ? stringFormat('<select class="font"><option value="left"{0}>左</option><option value="center"{1}>中</option><option value="right"{2}>右</option></select>',
                (align == "left" ? " selected" : ""), (align == "center" ? " selected" : ""), (align == "right" ? " selected" : "")) : (align == "center" ? "中" : (align == "right" ? "右" : "左"));
            cell.align = "center";
        }

        if (oper)
        {
            cell = row.insertCell(cellIndex++);
            cell.innerHTML = '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
                + ' onclick="moveCol(1)" onfocus="this.blur()" title="上移" style="margin-right:0">∧</button> \n'
                + '<button class="btnsmall" onmouseout="setIDBtn1(this,0)" onmouseover="setIDBtn1(this,1)"'
                + ' onclick="moveCol(0)" onfocus="this.blur()" title="下移" style="margin-right:0">∨</button>'
            cell.align = "center";
        }

        setRowAttributes(row);
    }
    hidTable.value = "";
}

// 删除明细
function delCols(tableId)
{
    var table = getObj(tableId);
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

// 保存审批信息
function saveCheckInfo()
{
    var ddlModelType = getObj("ddlModelType");
    var ddlBusinessType = getObj("ddlBusinessType");
    var hidFormID = getObj("hidFormID");
    var chkOffice = getObj("chkOffice");
    var upOffice = getObj("upOffice");
    var rdoIsUseOffice = getObjC("rblUseOffice", "input", 0);
    var rdoIsNoUseOffice = getObjC("rblUseOffice", "input", 1);
    var rodIsAutoShowOffice = getObjC("rblAutoShowOffice", "input", 0);
    var hidLookStationID = getObj("hidLookStationID");
    var hidLookDeptID = getObj("hidLookDeptID");
    var chkBill = getObj("chkBill");
    var rdoIsShowOffice = getObjC("rblOfficeFile", "input", 0);
    var rdoIsShowFile = getObjC("rblAccessaryFiles", "input", 0);
    var rdoIsShowLook = getObjC("rblLookInfo", "input", 0);
    var rdoIsShowSign = getObjC("rblSignBar", "input", 0);
    var tbKeyTable = getObj("tbKeyTable");
    var tbSubTables = getObj("tbSubTables");
    var rdoIsShowCheckInfo = getObjC("rblCheckInfo", "input", 0);

    var basicInfo =
        {
            "DocType": getParamValue("DocType"),
            "ModCode": getParamValue("ModCode"),
            "ProjectID": ddlModelType ? ddlModelType.value : "",
            "TypeID": ddlBusinessType ? ddlBusinessType.value : "",
            "DefaultFormID": hidFormID ? hidFormID.value : "",
            "IsUseOfficeFile": (chkOffice && !chkOffice.checked) ? (rdoIsUseOffice.checked ? "Y" : "N") : "",
            "IsAutoShowModelFile": (rodIsAutoShowOffice && rodIsAutoShowOffice.checked) ? "Y" : "N",
            "ModelFileName": (upOffice && upOffice.rows.length) ? upOffice.rows[0].filename : "",
            "ModelTitle": (upOffice && upOffice.rows.length) ? upOffice.rows[0].filetitle : "",
            "StationID": hidLookStationID ? hidLookStationID.value : "",
            "DeptID": hidLookDeptID ? hidLookDeptID.value : "",
            "IsShowOfficeFile": (chkBill && !chkBill.checked) ? (rdoIsShowOffice.checked ? "Y" : "N") : "",
            "IsShowAccessaryFiles": rdoIsShowFile.checked ? "Y" : "N",
            "IsShowLookInfo": rdoIsShowLook.checked ? "Y" : "N",
            "IsShowSignBar": rdoIsShowSign.checked ? "Y" : "N",
            "IsShowCheckInfo": rdoIsShowCheckInfo.checked ? "Y" : "N"
        };
    var tableInfo = [];
    if (!chkBill.checked)
    {
        var tables = [tbKeyTable, tbSubTables];
        for (var i = 0; i < tables.length; i++)
        {
            for (var j = 0; j < tables[i].rows.length; j++)
            {
                var txtTitle = getObjTC(tables[i], j, 0, "input", 0);
                if (txtTitle && txtTitle.value.Trim() == "")
                {
                    return alertMsg("明细表的名称不能为空。", txtTitle);
                }
                var tableTitle = txtTitle.value;
                var btnAdd = getObjC(tables[i].rows[j], "button", 0);
                var sysTable = getObj(btnAdd.tableid);
                if (sysTable.rows.length > 1)
                {
                    var cols = [];
                    for (var k = 1; k < sysTable.rows.length; k++)
                    {
                        var chk = getObjTC(sysTable, k, 0, "input", 0);
                        var txtWidth = i ? getObjTC(sysTable, k, 4, "input", 0) : null;
                        var colName = chk.value;
                        var colTitle = sysTable.rows[k].cells[1].innerText;
                        var format = chk.format;
                        var colLen = sysTable.rows[k].cells[3].innerText;
                        var width = i ? txtWidth.value : 0;
                        var align = i ? getObjTC(sysTable, k, 5, "select", 0).value : "";
                        cols.push({ "ColName": colName, "ColTitle": colTitle, "ColLen": colLen, "Format": format, "Width": width, "Align": align });
                    }
                    tableInfo.push({ "TableName": btnAdd.table, "TableTitle": tableTitle, "IsKey": (i == 0), "Cols": cols });
                }
            }
        }
    }

    ajax("VCheckSetMain.aspx", { "Action": "SaveCheckInfo", "Data": $.jsonToString([basicInfo, tableInfo]) }, "json", finishSaveCheckInfo, true, "POST");
}

// 保存完毕
function finishSaveCheckInfo(data, textStatus)
{
    if (data.Success == "Y")
    {
        alert("操作成功。");
    }
    else
    {
        alert(data.Data);
    }
}