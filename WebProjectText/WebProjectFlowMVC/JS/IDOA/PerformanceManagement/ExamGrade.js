
//新建
function btnAdd_Click() {
    openAddWindow("VExamGradeAdd.aspx", 400, 300, "jqGrid1");
}

//修改
function btnEdit_Click() {
    openModifyWindow("VExamGradeEdit.aspx", 400, 300, "jqGrid1");
}

//删除
function btnDelete_Click() {
    openDeleteWindow("ExamGrade", 1, "jqGrid1");
}

function btnSetting_Click() {
    openAddWindow("VExamGradeSet.aspx", 800,600, "jqGrid1");
}

//查看
function renderLink(cellvalue, options, rowobject) {
    var url = "'VExamGradeBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 300)">' + cellvalue + '</a>';
}

function validateSize() {

    if (getObj("txtLevelName").value == "") {
        return alertMsg("分级名称不能为空。", getObj("txtLevelName"));
    }

    if (getObj("txtLevel").value == "") {
        return alertMsg("级别不能为空。", getObj("txtLevel"));
    }

    if (getObj("txtMaxRank").value == "") {
        return alertMsg("上限不能为空。", getObj("txtMaxRank"));
    }

    if (getObj("txtMinRank").value == "") {
        return alertMsg("下限不能为空。", getObj("txtMinRank"));
    }

    if (parseFloat(getObj("txtMinRank").value) > parseFloat(getObj("txtMaxRank").value)) {
        return alertMsg("上限不能小于下限。", getObj("txtMinRank"));
    }

    return true;
}

function changeRule(a) {
    if (a.innerHTML == "↑") {
        a.innerHTML = "↓"
    }
    else {
        a.innerHTML = "↑"
    }
}

function validateTable() {

    var table = getObj("table");

    var strValue = "";
    var strRowValue = "";
    var strEGIDs = "";
    var pencent;
    var total = 0;
    var rule;
    var name;

    //A等级`A等级,%|B等级,%|C等级,%|D等级,%^A等级`A等级,%|B等级,%|C等级,%|D等级,%

    //alert(a)
    for (var i = 1; i < table.rows[0].cells.length	; i++) {
        total = 0;
        strEGIDs = table.rows[0].cells[i].getElementsByTagName("input").item(0).value;
        name = table.rows[0].cells[i].getElementsByTagName("input").item(1).value;
        rule = table.rows[0].cells[i].getElementsByTagName("a").item(0);
        strValue += "^" + name+"," + strEGIDs + "," + rule.innerHTML + "`";
        strRowValue = ""; //清空
        for (var j = 1; j < table.rows.length; j++) {

            strRowValue += "|" + table.rows[j].cells[0].getElementsByTagName("input").item(0).value; //获取每一行对应的EGID
            pencent = table.rows[j].cells[i].getElementsByTagName("input").item(0); //获取权重
            strRowValue += "," + pencent.value;

            total += parseInt(pencent.value);

            if (j == table.rows.length - 1) {
                if (total != 100)
                { return alertMsg("权重之和必须为100。", pencent); }

                if (strRowValue.length>0) {
                    strRowValue = strRowValue.substr(1);
                }

                strValue += strRowValue;
             }
        }
    }

    if (strValue.length>0) {
        strValue = strValue.substr(1);
    }

    getObj("hidValue").value = strValue;
    return true;
}