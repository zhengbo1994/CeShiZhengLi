// 选择我的公司的项目VSelectMyCorpProject.aspx用到的js
// 作者：程爱民
// 日期：2010-08-13

// 选择项目
function selectProject(bClose)
{
    var projectIDs = getJQGridSelectedRowsID("jqGrid1", true);

    if (getObj("hidFrom").value != "IA" && projectIDs.length == 0)
    {
        //alert("没有选择任何项目。");
        //return false;
        projectIDs = getJQGridSelectedRowsData("jqGrid1", false, "ProjectID");
    }
    if (getObj("hidFrom").value == "ZB" && projectIDs.length == 0)
    {
        alert("没有选择任何项目。");
        return false;
    }

    if (getObj("hidFrom").value == "ZB")
    {
        var tblZBProject = getObjD("tblZBProject");
        for (var i = 0; i < projectIDs.length; i++)
        {
            var repeat = false;
            for (var j = 1; j < tblZBProject.rows.length; j++)
            {
                if (projectIDs[i] == getObjTR(tblZBProject, j, "input", 0).value)
                {
                    repeat = true;
                    break;
                }
            }
            if (!repeat)
            {
                var row = tblZBProject.insertRow();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml('', projectIDs[i]);

                cell = row.insertCell(1);
                cell.innerHTML = getHiddenHtml('', getObj("ddlCorp").value) + stripHtml($('#jqGrid1').getCell(projectIDs[i], 'StruName'));

                cell = row.insertCell(2);
                cell.innerHTML = stripHtml($('#jqGrid1').getCell(projectIDs[i], 'ProjectName'));

                cell = row.insertCell(3);
                cell.innerHTML = getTextAreaHtml();
            }
        }
    }
    else if (getObj("hidFrom").value == "ProjectWarrant")
    {
        window["IsClose"] = bClose;
        ajaxRequest("FillData.ashx", { action: "ProjectWarrant", Aim: getParamValue("Aim"), ID: getParamValue("ID"), ProjectIDs: projectIDs.join(","), Title: window.dialogArguments.top.document.title },
            "text", finishProjectWarrant, null, "POST");
        return;
    }
    else if (getObj("hidFrom").value == "AccountBookProject")
    {
        if (projectIDs.length == 0 || !projectIDs.join(","))
        {
            alert("没有选择任何项目。");
            return false;
        }

        window["IsClose"] = bClose;
        ajax("../../../CCMP/CWJK/VAccountBookProject.aspx", { "ABID": getParamValue("ID"), "ProjectID": projectIDs.join(",") },
            "json", function (data, textStatus)
            {
                alert(data.Data);
                if (data.Success == "Y")
                {
                    if (!window["IsClose"])
                    {
                        reloadData();
                    }
                    window.dialogArguments.reloadData();
                    if (window["IsClose"])
                    {
                        window.close();
                    }
                }
            });
        return;
    }
    else if (getObj("hidFrom").value == "IA")
    {
        //当前页面
        getObj("hidProjectID").value = getJQGridSelectedRowsData("jqGrid1", false, "ProjectID") + ",";
        //返回页面
        getObjD("hidProjectID").value = getJQGridSelectedRowsData("jqGrid1", false, "ProjectID");
        getObjD("txtProjectName").value = stripHtml(getJQGridSelectedRowsData("jqGrid1", false, "ProjectName"));
        getObjD("hidCorpID").value = getObj("ddlCorp").value;
        getObjD("hidCorpName").value = stripHtml(getJQGridSelectedRowsData("jqGrid1", false, "StruName"));
    }
    else if (getObj("hidFrom").value == "POM")
    {
        if ((getParamValue('Top') - 0) > 0 && getJQGridSelectedRowsID('jqGrid1').length > (getParamValue('Top') - 0))
        {
            return alertMsg('请最多选择' + getParamValue('Top') + '个项目。');
        }
        var projectID = getJQGridSelectedRowsData("jqGrid1", checkJQGridEnableMultiSel('jqGrid1'), "ProjectID");
        var projectNames = stripHtml(getJQGridSelectedRowsData("jqGrid1", checkJQGridEnableMultiSel('jqGrid1'), "ProjectName"));

        getObj("hidProjectID").value = projectID;
        getObjD("hidProjectID").value = projectID;
        getObjD("hidProjectName").value = projectNames.replace(/,/g, '，');

    }
    else if (getObj("hidFrom").value == "DeptPlan")
    {
        //alert(projectIDs);
        getObjD("hidProjectID").value = projectIDs;
        if (getObjD("hidProjectName") != null && getObjD("hidProjectName") != undefined)
        {
            getObjD("hidProjectName").value = stripHtml(getJQGridSelectedRowsData("jqGrid1", false, "ProjectName"));
        }
    }

    window.close();
}

// 设置完工作组岗位，刷新数据
function finishProjectWarrant(data, textStatus)
{
    if (data == "Y")
    {
        alert("操作成功。");
        if (!window["IsClose"])
        {
            reloadData();
        }
        window.dialogArguments.reloadData();
        if (window["IsClose"])
        {
            window.close();
        }
    }
    else
    {
        alert(data);
    }
}

// 刷新数据
function reloadData()
{
    var query = { CorpID: getObj("ddlCorp").value, KW: getObj("txtKW").value };

    if (loadJQGrid("jqGrid1", query))
    {
        //        addParamsForJQGridQuery("jqGrid1", [query]);
        refreshJQGrid("jqGrid1");
    }
}

// 项目查看
function showProject(cellvalue, options, rowobject)
{
    var url = "'../../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + rowobject[0] + "'";
    return '<a href="javascript:openWindow(' + url + ', 600,600)">' + cellvalue + '</a>';
}

//清除数据
function btnClear_Click() {
    if (getObj("hidFrom").value == "DeptPlan") {
        getObjD("hidProjectID").value = "";
        if (getObjD("hidProjectName") != null && getObjD("hidProjectName") != undefined) {
            getObjD("hidProjectName").value = "";
        }
    }
    window.close();
}

