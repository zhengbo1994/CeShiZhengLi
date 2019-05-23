
//新建
function btnAdd_Click() {
    openAddWindow("VBasicFunctionAdd.aspx", 1000, 700, "jqBasicFunction");
}

//修改
function btnEdit_Click() {
    openModifyWindow("VBasicFunctionEdit.aspx", 1000, 700, "jqBasicFunction");
}

//删除
function btnDelete_Click() {
    openDeleteWindow("BasicFunction", 1, "jqBasicFunction");
}

//查看
function renderLink(cellvalue, options, rowobject) {
    var url = "'VBasicFunctionBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',1000, 700)">' + cellvalue + '</a>';
}

//搜索
function btnSearch_Click() {
    reloadData();
}


function reloadData() {
    var vKey = $("#txtKey").val();
      
    $('#jqBasicFunction', document).getGridParam('postData').SearchText = vKey;
    refreshJQGrid('jqBasicFunction');
}


function validateSize() {
    var rowNo = getObj("txtRowNo").value;

    if (getObj("txtBFName").value == "") {
        return alertMsg("职能名不能为空。", getObj("txtBFName"));
    }

    if (rowNo == "") {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }

    if (!isPositiveInt(rowNo)) {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    collectIDs(dgBasicStation, 'hidBSIDs');
    collectIDs(dgKPIIndex, 'hidKPIIDs');

    return true;
}


function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");

    // 起草与浏览
    if (getObj("chkUseDocModel") != null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1") {
        setUseDocModel(getObj("chkUseDocModel"));
    }
    else if (getObj("chkUseDocModel") == null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1") {
        setDisplayDocModel();
    }
}



//用于新增基础部门
function addBS() {
    var table = dgBasicStation;

    var BSInfo = openModalWindow('../../../Common/Select/OperAllow/VSelectMultiBasicStation.aspx?hidBSIDs=hidBSIDs', 900, 600);
    var hidBSIDs = getObj('hidBSIDs');
    var existBSIDs = hidBSIDs.value;

    if (typeof BSInfo == "object" && BSInfo != null) {
        var BSIDs = BSInfo.BSIDs.split(',');
        var BSNames = BSInfo.BSNames.split(',');

        if (typeof BSIDs != "undefined" && BSIDs.length > 0) {
            for (var i = 0; i < BSIDs.length; i++) {
                // 若ID已存在，跳过
                if (existBSIDs.indexOf(BSIDs[i]) > -1) {
                    continue;
                }
                var row = table.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml("", BSIDs[i]);

                var cell = row.insertCell(1);
                cell.align = "left";
                cell.innerHTML = BSNames[i];
            }
        }
        setTableRowAttributes(table);
    }
    else if (typeof BSInfo == "string" && BSInfo == "ClearBS") {
        clearTableRows(table);
    }
    collectIDs(table, hidBSIDs);
}
 

function clearTableRows(table) {
    var thisTable  =null;
    if (typeof table == "string") {
        thisTable = getObj(table);
    }
    else if (typeof table == "object") {
        thisTable = table;
    }

    if (!thisTable) {
        return false;
    }

    var iRowCount = thisTable.rows.length;
    for (var i = iRowCount - 1; i > 0; i--) {
        thisTable.deleteRow(i);
    }
}


//用于新增KPI指标
function addKPIIndex() {
    var table = dgKPIIndex;

    var KPIIndexInfo = openModalWindow('../../../Common/Select/IDOA/VSelectMultiKPIIndex.aspx?hidIDs=hidKPIIDs', 900, 600);
    var hidKPIIDs = getObj('hidKPIIDs');
    var existKPIIDs = hidKPIIDs.value;

    if (typeof KPIIndexInfo == "object" && KPIIndexInfo != null) {
        var KPIIDs = KPIIndexInfo.IndexIDs.split(',');
        var ICNames = KPIIndexInfo.IndexClassNames.split(',');
        var IndexNames = KPIIndexInfo.IndexNames.split(',');
       
        if (typeof KPIIDs != "undefined" && KPIIDs.length > 0) {
            for (var i = 0; i < KPIIDs.length; i++) {
                // 若ID已存在，跳过
                if (existKPIIDs.indexOf(KPIIDs[i]) > -1) {
                    continue;
                }
                var row = table.insertRow();
               
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml("", KPIIDs[i]);

                var cell = row.insertCell(1);
                cell.align = "center";
                cell.innerHTML = ICNames[i];

                var cell = row.insertCell(2);
                cell.align = "left";
                cell.innerHTML = IndexNames[i];
            }
        }
        setTableRowAttributes(table);
    }
    collectIDs(table, hidKPIIDs);
}

//用于删除table中选中的行
function deleteDGRows(table,hid) {
    // 删除表格中复选框选中的行
    deleteTableRow(table);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
    collectIDs(table, hid);
}


function collectIDs(table, hid) {
    var thisTable = null, thisHid = null;
    if (typeof table == "string") {
        thisTable = $("#" + table);
    }
    else if (typeof table == "object") {
        thisTable = $(table);
    }

    if (typeof hid == "string") {
        thisHid = $("#"+hid);
    }
    else if (typeof table == "object") {
        thisHid = $(hid);
    }

    if (!thisTable.length || !thisHid.length) {
        return false;
    }

    var cbks = thisTable.find("input[type=checkbox]");
    var IDs = [];
    for (var i = 0; i < cbks.length; i++) {
        if (cbks[i].value.length > 10) {
            IDs.push(cbks[i].value);
        }
    }
    thisHid.val(IDs.join());
}