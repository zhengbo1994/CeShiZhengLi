function showIndexTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 3; i++)
    {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";
}


//插入指标
function btnAdd_Click(type)
{
    var url = "";
    var table;
    var corpID = getObj("hidCorpID").value;

    if (type == "KPI")
    {
        url = "../../../Common/Select/IDOA/VSelectMultiKPIIndex.aspx?CorpID=" + corpID;
        table = tbKPIList;
    }
    else
    {
        url = "../../../Common/Select/IDOA/VSelectMultiBehaviorIndex.aspx";
        table = tbBIList
    }

    var vValue = openModalWindow(url, 800, 600);
    if (vValue)
    {
        var indexIDs;
        var indexNames;
        var DeptNames;
        var IndexClass;
        var IndexClassNames
        var deptIDs;
        var scoreStandards;

        if (type == "KPI")
        {
            indexIDs = vValue.IndexIDs.split(',');
            indexNames = vValue.IndexNames.split(',');
            DeptNames = vValue.BSNames.split(',');
            IndexClass = vValue.ICIDs.split(',');
            IndexClassNames = vValue.IndexClassNames.split(',');
            deptIDs = vValue.BSIDs.split(',');
            scoreStandards = vValue.ScoreStandards.split(',');
        }
        else
        {
            indexIDs = vValue.IndexIDs.split(',');
            indexNames = vValue.IndexNames.split(',');
            IndexClass = vValue.IndexClass.split(',');
            IndexClassNames = vValue.IndexClassNames.split(',');
            scoreStandards = vValue.ScoreStandards.split(',');
        }

        for (var i = 0; i < indexIDs.length; i++)
        {
            if (!checkIsRepeat(indexIDs[i], table))  //检测数据是否重复
            {
                var index = getIndexClassIndex(table, IndexClass[i])
                var row = table.insertRow(index);
                var name = getNewID();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(name, indexIDs[i]);

                cell = row.insertCell(1);
                cell.align = "Center";
                cell.innerHTML = "";

                cell = row.insertCell(2);
                cell.align = "left";
                cell.innerHTML = IndexClassNames[i]

                cell = row.insertCell(3);
                cell.align = "left";

                if (type == "KPI")
                {
                    cell.innerHTML = "<DIV Title='" + scoreStandards[i] + "'>" + indexNames[i] + "</DIV>"
                        + getHiddenHtml('hidIndexID' + name, indexIDs[i])
                        + getHiddenHtml('hidIndexName' + name, indexNames[i])
                        + getHiddenHtml('hidIndexClass' + name, IndexClass[i])
                        + getHiddenHtml('hidScoreStandard' + name, scoreStandards[i]);
                }
                else
                {
                    cell.innerHTML = "<DIV>" + indexNames[i] + "</DIV>"
                        + getHiddenHtml('hidIndexID' + name, indexIDs[i])
                        + getHiddenHtml('hidIndexName' + name, indexNames[i])
                        + getHiddenHtml('hidIndexClass' + name, IndexClass[i])
                        + getHiddenHtml('hidScoreStandard' + name, scoreStandards[i]);
                }

                cell = row.insertCell(4);
                cell.align = "left";
                cell.innerHTML = getTextBoxHtml("txtPencent" + name, 100, '', 'setPlusIntNum(this)', 10);

                cell = row.insertCell(5);
                cell.align = "left";
                cell.innerHTML = getTextBoxHtml("txtCauseValue" + name, 1000, '', '', '');

                cell = row.insertCell(6);
                cell.align = "left";
                if (type == "KPI")
                {
                    cell.innerHTML = DeptNames[i] + getHiddenHtml('hidDeptID' + name, deptIDs[i]);
                }
                else
                {
                    cell.innerHTML = "";
                }

                if (type == "KPI")
                {
                    cell = row.insertCell(7);
                    cell.align = "left";
                    cell.innerHTML = "";
                }
            }
        }
        setTableIndex(table);
        setTableRowAttributes(table);
    }
}

function insertTbProcessList()
{
    var table = tbProgressList
    var row = table.insertRow();
    var name = getNewID();
    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml(name, name);

    cell = row.insertCell(1);
    cell.align = "Center";
    cell.innerHTML = "";

    cell = row.insertCell(2);
    cell.align = "left";
    cell.innerHTML = getTextBoxHtml("txtWBSName" + name, 100, '', '', '')
    + getHiddenHtml('hidEPID' + name, name);

    cell = row.insertCell(3);
    cell.align = "left";
    cell.innerHTML = getTextBoxHtml("txtPencent" + name, 100, '', 'setPlusIntNum(this)', 10);

    cell = row.insertCell(4);
    cell.align = "left";
    cell.innerHTML = getTextBoxHtml("txtCauseValue" + name, 1000, '', '', '');

    cell = row.insertCell(5);
    cell.align = "left";
    cell.innerHTML = getSelectDateHtml("txtStartDate" + name, null, null, null, "txtEndDate" + name);

    cell = row.insertCell(6);
    cell.align = "left";
    cell.innerHTML = getSelectDateHtml("txtEndDate" + name);

    cell = row.insertCell(7);
    cell.align = "left";
    cell.innerHTML = "";

    setTableIndex(table);
    setTableRowAttributes(table);
}


//检查是否重复数据
function checkIsRepeat(chkval, table)
{
    var cnlt = table.rows.length;
    var kPIIDs = new Array()
    for (i = 1; i < cnlt; i++)
    {
        kPIIDs[i] = table.rows(i).getElementsByTagName("input").item(1).value;
    }

    var repeat = false;
    for (j = 0; j < kPIIDs.length; j++)
    {
        if (kPIIDs[j] == chkval)
        {
            repeat = true;
            break;
        }
    }

    return repeat;
}

function getIndexClassIndex(table, indexClass)
{
    var index = table.rows.length;
    for (i = 1; i < table.rows.length; i++)
    {
        if (indexClass == table.rows(i).getElementsByTagName("input").item(3).value)
        {
            index = i;
            break;
        }
    }

    return index;
}

function setTableIndex(table)
{
    var rowNo = 1;
    for (i = 1; i < table.rows.length; i++)
    {
        table.rows[i].cells[1].innerHTML = rowNo;
        rowNo++;
    }
}

// 删除表格行
function delDetail(table)
{
    // 删除表格中复选框选中的行
    deleteTableRow(table);

    //重新设置序号
    setTableIndex(table);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
}

function btnDelete_Click(type)
{
    if (type == "KPI")
    {
        delDetail(tbKPIList);
    }
    else if (type == "BI")
    {
        delDetail(tbBIList);
    }
    else
    {
        delDetail(tbProgressList);
    }
}

function btnSetDept_Click(type)
{
    var table;
    var selectList;
    if (type == "KPI")
    {
        table = tbKPIList;
        selectList = getObj("hidESelectList");
    }
    else
    {
        table = tbBIList;
        selectList = getObj("hidBISelectList");
    }

    if (!checkSelectChk(table, selectList))
    {
        return;
    }

    getObj("hidDeptID").value = "";
    if (selectList.value.length == 36)
    { //如果只选择一项 需要把数据传到设置页
        for (var j = table.rows.length - 1; j > 0; j--)
        {
            if (getObjTR(table, j, "input", 0).checked)
            {
                if (table.rows(j).cells(6).innerHTML != "")
                {
                    getObj("hidDeptID").value = getObjTR(table, j, "input", 7).value;
                }                
            }
        }
    } 

    var corpID = $('#hidCorpID').val();
    var sUrl;
    sUrl = '/' + rootUrl + '/Common/Select/VSingleDept.aspx?Aim=Index&CorpID=' + corpID;
    var vValue = openModalWindow(sUrl, 400, 600);

    if (vValue != "undefined" && vValue != null)
    {
        var deptID = vValue.split('|')[0];
        var deptName = vValue.split('|')[1];

        for (var i = 1; i < table.rows.length; i++)
        {
            var rowid = getObjTR(table, i, "input", 0).value;
            if (selectList.value.indexOf(rowid) > -1)
            {
                table.rows(i).cells(6).innerHTML = deptName + getHiddenHtml('hidDeptID' + getObjTR(table, i, "input", 0).value, deptID);
            }
        }
    }
}

//检查复选框 并把所选保存在hid中 后面根据这个来判断什么行需要修改
function checkSelectChk(table, selectList)
{
    selectList.value = "";
    for (var j = table.rows.length - 1; j > 0; j--)
    {
        if (getObjTR(table, j, "input", 0).checked)
        {
            selectList.value += "^" + getObjTR(table, j, "input", 0).value;
        }
    }

    if (selectList.value == "")
    {
        return alertMsg("没有任何记录可供操作。");
    }
    else
    {
        selectList.value = selectList.value.substr(1);
    }

    return true;
}

function btnSetEvaluationMan_Click(type)
{
    var table;
    var selectList;

    if (type == "KPI")
    {
        table = tbKPIList;
        selectList = getObj("hidESelectList");
        if (!checkEvaluationMan(table, selectList, "KPI"))
        {
            return;
        }
    }
    else if (type == "BI")
    {
        table = tbBIList;
        selectList = getObj("hidBISelectList");
        if (!checkEvaluationMan(table, selectList, "BI"))
        {
            return;
        }
    }
    else
    {
        table = tbProgressList;
        selectList = getObj("hidPSelectList");
        if (!checkEvaluationMan(table, selectList, "Process"))
        {
            return;
        }
    }

    var vValue = openModalWindow("VSetEvaluationMan.aspx?CorpID=" + getObj("hidCorpID").value, 600, 400);

    if (vValue)
    {
        var ids = vValue.IDs;
        var namesText = vValue.NameText;
        var names = vValue.Names;
        var pencents = vValue.Pencents;

        if (type == "Process")
        {
            for (var i = 1; i < table.rows.length; i++)
            {
                if (selectList.value.indexOf(getObjTR(table, i, "input", 0).value) > -1)
                {
                    table.rows(i).cells(7).innerHTML = namesText + getHiddenHtml('hidEvaluationMan' + getObjTR(table, i, "input", 0).value, ids) + getHiddenHtml('hidEvaluationManName' + getObjTR(table, i, "input", 0).value, names) + getHiddenHtml('hidSatationPencents' + getObjTR(table, i, "input", 0).value, pencents);
                }
            }
        }
        else if (type == "KPI")
        {
            for (var i = 1; i < table.rows.length; i++)
            {
                if (selectList.value.indexOf(getObjTR(table, i, "input", 0).value) > -1)
                {
                    table.rows(i).cells(7).innerHTML = namesText + getHiddenHtml('hidEvaluationMan' + getObjTR(table, i, "input", 0).value, ids) + getHiddenHtml('hidEvaluationManName' + getObjTR(table, i, "input", 0).value, names) + getHiddenHtml('hidSatationPencents' + getObjTR(table, i, "input", 0).value, pencents);
                }
            }
        }
        else
        {
            for (var i = 1; i < table.rows.length; i++)
            {
                if (selectList.value.indexOf(getObjTR(table, i, "input", 0).value) > -1)
                {
                    table.rows(i).cells(6).innerHTML = namesText + getHiddenHtml('hidEvaluationMan' + getObjTR(table, i, "input", 0).value, ids) + getHiddenHtml('hidEvaluationManName' + getObjTR(table, i, "input", 0).value, names) + getHiddenHtml('hidSatationPencents' + getObjTR(table, i, "input", 0).value, pencents);
                }
            }
        }
    }
}

function checkEvaluationMan(table, selectList, type)
{

    if (!checkSelectChk(table, selectList))
    {
        return false;
    }

    getObj("hidEvaluationStation").value = "";
    getObj("hidEvaluationStationID").value = "";
    getObj("hidPencents").value = "";

    if (type == "Process")
    {
        if (selectList.value.length == 36)
        { //如果只选择一项 需要把数据传到设置页
            for (var j = table.rows.length - 1; j > 0; j--)
            {
                if (getObjTR(table, j, "input", 0).checked)
                {
                    if (table.rows(j).cells(7).innerHTML != "")
                    {
                        getObj("hidEvaluationStation").value = getObjTR(table, j, "input", 8).value;
                        getObj("hidEvaluationStationID").value = getObjTR(table, j, "input", 7).value;
                        getObj("hidPencents").value = getObjTR(table, j, "input", 9).value;
                    }
                }
            }
        } //end if
    }
    else
    {
        if (selectList.value.length == 36)
        { //如果只选择一项 需要把数据传到设置页
            for (var j = table.rows.length - 1; j > 0; j--)
            {
                if (getObjTR(table, j, "input", 0).checked)
                {
                    if (type == "KPI")
                    {
                        if (stationValue = table.rows(j).cells(7).innerHTML != "")
                        {
                            getObj("hidEvaluationStation").value = getObjTR(table, j, "input", 9).value;
                            getObj("hidEvaluationStationID").value = getObjTR(table, j, "input", 8).value;
                            getObj("hidPencents").value = getObjTR(table, j, "input", 10).value;
                        }
                    }
                    else
                    {
                        if (stationValue = table.rows(j).cells(6).innerHTML != "")
                        {
                            getObj("hidEvaluationStation").value = getObjTR(table, j, "input", 8).value;
                            getObj("hidEvaluationStationID").value = getObjTR(table, j, "input", 7).value;
                            getObj("hidPencents").value = getObjTR(table, j, "input", 9).value;
                        }
                    }
                }
            }
        } //end if
    }

    return true;
}


//校验数据
function validateSize()
{
    var type = getObj("hidModeType").value.split('|');

    if (type[0] == "Y")
    {
        if (!checkDataToJson(tbKPIList, getObj("hidKpiValues"), 'KPI'))
        {
            return false;
        }
    }

    if (type[1] == "Y")
    {
        if (!checktbProgressListValue())
        {
            return false;
        }
    }

    if (type[2] == "Y")
    {
        if (!checkDataToJson(tbBIList, getObj("hidBIValues"), 'BI'))
        {
            return false;
        }
    }

    return true;
}

function checkDataToJson(table, hidValues, type)
{
    var id = ""; //指标ID
    var name = ""; //指标名称
    var pencent = ""; //权重
    var cause = ""; //目标值
    var dept = ""; //部门
    var station = ""; //考核人
    var manPencent = ""; //每个考核人的权重
    var total = 0;
    var iCID = ""; //指标类别ID
    var scoreStandard = ""; //标准
    var jsonDatas = [];

    if (table.rows.length < 2) // 没有设置指标
    {
        if (type == "KPI")
        {
            showIndexTab(0);
            return alertMsg("请设置KPI指标。");

        }
        else
        {
            showIndexTab(2);
            return alertMsg("请设置品能指标。");
        }
    }

    hidValues.value = "";

    for (var i = 1; i < table.rows.length; i++)
    {
        if (type == "KPI")
        {
            var deptid = getObjTC(table, i, 6, "input", 0);
            if (deptid)
            {
                if (deptid.value == "")
                {
                    getObjTR(table, i, "input", 0).click();
                    shouTab(type);
                    return alertMsg("数据来源部门不能为空。");
                }
            } else
            {
                getObjTR(table, i, "input", 0).click();
                shouTab(type);
                return alertMsg("数据来源部门不能为空。");
            }
        }
        var man;
        if (type == "KPI")
        {
            man = getObjTC(table, i, 7, "input", 0)
        }
        else
        {
            man = getObjTC(table, i, 6, "input", 0)
        }

        if (man)
        {
            if (man.value == "")
            {
                getObjTR(table, i, "input", 0).click();
                shouTab(type);
                return alertMsg("评分人不能为空。");
            }
        }
        else
        {
            shouTab(type);
            return alertMsg("评分人不能为空。");
        }

        pencent = getObjTR(table, i, "input", 5).value;
        id = getObjTR(table, i, "input", 1).value;
        name = getObjTR(table, i, "input", 2).value;
        iCID = getObjTR(table, i, "input", 3).value;
        scoreStandard = getObjTR(table, i, "input", 4).value;
        cause = getObjTR(table, i, "input", 6).value;

        if (type == "KPI")
        {
            dept = getObjTR(table, i, "input", 7).value;
            station = getObjTR(table, i, "input", 8).value;
            manPencent = getObjTR(table, i, "input", 10).value;
        }
        else
        {
            dept = "";  //getObjTR(table, i, "input", 6).value;
            station = getObjTR(table, i, "input", 7).value;
            manPencent = getObjTR(table, i, "input", 9).value;
        }
        total += parseInt(pencent);

        //JSON序列化
        jsonDatas = [];
        jsonDatas.push({ "IndexID": id,
            "IndexName": name,
            "IndexClass": iCID,
            "ScoreStandard": scoreStandard,
            "Pencent": pencent,
            "CauseValue": cause,
            "DeptID": dept,
            "StationIDs": station,
            "StationPercents": manPencent
        });

        hidValues.value += "ˇ" + $.jsonToString(jsonDatas);
    }

    if (hidValues.value != "")
    {
        hidValues.value = hidValues.value.substr(1);
        if (total == 0)
        {
            shouTab(type);
            return alertMsg("权重总和不能为0请修改。");
        }
    }
    return true;
}

function shouTab(type)
{
    if (type == "KPI")
    {
        showIndexTab(0);
    }

    if (type == "BI")
    {
        showIndexTab(2);
    }
}

function checktbProgressListValue()
{
    var table = tbProgressList;

    var name = ""; //名称
    var pencent = ""; //权重
    var cause = ""; //目标值
    var strat = ""; //开始时间
    var end = ""; //结束时间
    var station = ""; //考核人
    var manPencent = ""; //每个考核人的权重
    var total = 0;

    var jsonDatas = [];

    if (table.rows.length < 2)
    {
        showIndexTab(1);
        return alertMsg("请设置工作任务。");
    }

    hidValues = getObj("hidProgressValues");
    hidValues.value = "";

    for (var i = 1; i < table.rows.length; i++)
    {

        if (table.rows(i).cells(7).innerHTML == "")
        {
            getObjTR(table, i, "input", 0).click();
            return alertMsg("评分人不能为空。");
        }

        name = getObjTR(table, i, "input", 1);
        pencent = getObjTR(table, i, "input", 3);
        cause = getObjTR(table, i, "input", 4);
        strat = getObjTR(table, i, "input", 5);
        end = getObjTR(table, i, "input", 6);
        station = getObjTR(table, i, "input", 7).value;
        manPencent = getObjTR(table, i, "input", 9).value;

        if (name.value == "")
        {
            return alertMsg("任务名称不能为空。", name);
        }

        if (cause.value == "")
        {
            return alertMsg("目标不能为空。", cause);
        }

        if (strat.value == "")
        {
            return alertMsg("开始时间不能为空。", strat);
        }

        if (end.value == "")
        {
            return alertMsg("结束时间不能为空。", end);
        }

        if (compareDate(strat.value, end.value) == -1)
        {
            return alertMsg("结束时间不能小于开始时间。", end);
        }

        total += parseInt(pencent.value);

        //JSON序列化
        jsonDatas = [];
        jsonDatas.push({
            "Name": name.value,
            "Pencent": pencent.value,
            "CauseValue": cause.value,
            "StartDate": strat.value,
            "EndDate": end.value,
            "StationIDs": station,
            "StationPercents": manPencent
        });

        hidValues.value += "ˇ" + $.jsonToString(jsonDatas);
    }

    if (hidValues.value != "")
    {
        hidValues.value = hidValues.value.substr(1);
        if (total == 0)
        {
            return alertMsg("权重总和不能为0请修改。");
        }
    }
    return true;

}