// JScript 文件

// VForm.aspx用到的js

// 切换条件刷新数据
function reloadData()
{
    execFrameFuns("Main", function(){window.frames("Main").reloadFormData();});
}

// 新增
function addForm()
{
    var ftID = window["FTID"];
    var fmID = $("#ddlFlowMod").val();
    
    openWindow("VFormAdd.aspx?FMID=" + fmID + "&FTID=" + ftID, 450, 420);
}

// 修改
function editForm()
{
    openModifyWindow("VFormEdit.aspx", 450, 420, "jqGrid1", "Main")
}

// 删除
function delForm()
{
    var vIsFixedForm = window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'IsFixedForm');
    if (stripHtml(vIsFixedForm.join(",")).indexOf('Y') != -1) {
        return alertMsg("移动端审批表单类别下的表单不可进行删除。");
    }
    openDeleteWindow("Form", 0, "jqGrid1","Main");
}

// 导出
function expForm()
{
    execFrameFuns("Main", function(){window.frames("Main").ajaxExport("VFormMain.aspx", "jqGrid1");});
}


// VFormLeft.aspx用到的js

// 点击树刷新数据
function showFormList(span, ftID)
{
    //移动审批表单禁止新增删除  杜学  20170606
    if (getObjP("btnAdd") != undefined && getObjP("btnDelete") !=undefined) {
        if (ftID == "F83E9155-169E-4E58-838D-BD7F98E0D006") {
            getObjP("btnAdd").style.display = "none";
            getObjP("btnDelete").style.display = "none";
        }
        else {
            getObjP("btnAdd").style.display = "";
            getObjP("btnDelete").style.display = "";
        }
    }

    clickTreeNode(span);
    
    window.parent["FTID"] = ftID;
    
    var chkChild = getObjP("chkChild");
    if (ftID)
    {
        chkChild.disabled = false;
    }
    else
    {
        chkChild.checked = true;
        chkChild.disabled = true;
    }
    
    execFrameFuns("Main", function(){window.parent.frames("Main").reloadFormData();}, window.parent);
}


// VFormMain.aspx用到的js

// 表单名称
function showFormName(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="javascript:showForm(\'' + options.rowId + '\');">' + cellvalue + '</a>';
}
function showForm(formID)
{
    var url = "VFormBrowse.aspx?FormID=" + formID;
    openWindow(url,800,600);
}

// 表单统计
function showStat(cellvalue, options, rowobject)
{
    return '<a href="javascript:void(0)" onclick="javascript:openStat(\'' + options.rowId + '\');">统计</a>';
}
function openStat(ID)
{
    openWindow("VFormStat.aspx?FormID=" + ID, 0, 0);
}

// 设置
function showSet(cellvalue, options, rowobject)
{
    var formId = options.rowId;
    return '<a href="javascript:void(0)" onclick="javascript:openWindow(\'VFormColumn.aspx?FormID=' + formId + '&FMID=' + rowobject[0] +'&Tb=' + encode(rowobject[1], 1) + '\',0,0)">列</a>'
        + ' <a href="javascript:void(0)" onclick="javascript:openWindow(\'VFormFormatTab.aspx?FormID=' + formId + '\',0,0)">格式</a>'
        + ' <a href="javascript:void(0)" onclick="javascript:openWindow(\'VFormFlow.aspx?FormID=' + formId + '&FMID=' + rowobject[0] + '\',0,0)">流程</a>';
}

// 刷新表单记录
function reloadFormData()
{
    var ddlMod = getObjP("ddlFlowMod");
    var fmId = ddlMod.value;
    if (!fmId)
    {
        for (var i = 1; i < ddlMod.options.length; i++)
        {
            fmId += "," + ddlMod.options[i].value;
        }
        if (fmId)
        {
            fmId = fmId.substr(1);
        }
    }
    var isChild = getObjP("chkChild").checked ? "Y" : "N";
    var kw = getObjP("txtKW").value;
    
    var query = { "FMID":fmId, "FTID":window.parent["FTID"], "IsChild":isChild, "KW":kw };
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}


// VFormAdd.aspx、VFormEdit.aspx用到的js

function setDisplay()
{
    trFile.style.display = ($("#hidDocFMID").val() == $("#ddlFlowMod").val()? "" : "none");
    trFileOpen.style.display = trFile.style.display;
}

function validateSize()
{
    if (getObj("ddlFlowMod").value == "")
    {
        return alertMsg("请选择一个模块。", getObj("ddlFlowMod"));
    }
    else if (getObj("ddlFormType").value == "")
    {
        return alertMsg("请选择一个类别。", getObj("ddlFormType"));
    }
    else if(getObj("txtFormTitle").value == "")
    {
        return alertMsg("表单名不能为空。", getObj("txtFormTitle"));
    }
    return true;
}


// VFormBrowse.aspx用到的js

// 选中的选项卡索引
var selIndex = -1;

// 查看模式下切换选项卡
function showBrowseTab(index)
{
    if ((selIndex == 1 || selIndex == 3) && !jqGridIsComplete(selIndex == 1 ? "jqGridCol" : "jqGridFlow"))
    {
        return alertMsg("数据未加载完毕，请稍后再试。");
    }

    selectTab(index, "BrowseInfo");
                
    for (var i = 0; i < 4; i++)
    {
        if (i != index)
        {
            getObj("info" + i).style.display = "none";
        }
    }
    
    getObj("info" + index).style.display = "";
    
    if (index == 1)
    {
        if (loadJQGrid("jqGridCol"))
        {
            refreshJQGrid("jqGridCol");
        }
    }
    else if (index == 2)
    {
        showFormTab(0);
    }
    else if (index == 3)
    {
        if (loadJQGrid("jqGridFlow"))
        {
            refreshJQGrid("jqGridFlow");
        }
    }
    
    selIndex = index;
}

function showFormTab(index)
{
    selectTab(index, "Form");

    $("div[id]", $("#info2")).hide();

    $("#div" + index).show();
}

// 流程名称项
function showFlowName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showFlow(\'' + options.rowId + '\')">' + cellvalue +'</a>';
}

// 权限
function showOperName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showOper(\'' + options.rowId + '\')">查看</a>';
}

// 查看流程
function showFlow(flowID)
{
    openWindow("../Flow/VFlowBrowse.aspx?ID=" + flowID, 0, 0);
}

// 查看流程权限
function showOper(flowId)
{
    var formId = getParamValue("FormID");
    openWindow("VFormFlowOper.aspx?From=Browse&FormID=" + formId + "&FlowID=" + flowId, 800, 500);
}