function ddlCorp_Change()
{
    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetDeptByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadDept,
            error: ajaxError
        });
}

function ddlMod_Change()
{
    var fmid = getObj("ddlMod").value;
    var corpID = getObj("ddlCorp").value;

    if (fmid==null||fmid =="")
    {
        var ddl = getObj("ddlFlowType");
        ddl.options.length = 0;
        addOptionAt(ddl, '', "请选择", ddl.length);
    }
    else
    {
        $.post('FillData.ashx', { action: 'GetFlowType', FMID: fmid, CorpID: corpID },
       function (data, textStatus)
       {
           bindDdl(data, 'ddlFlowType', '', "NONE");
       }, 'json');
    }

    reloadData();
}

function loadDept(data, textStatus)
{
    var ddlDept = getObj("ddlDept");
    for (var i = ddlDept.length - 1; i > 0; i--)
    {
        ddlDept.remove(i);
    }

    addOptionAt(ddlDept, '', "全部", ddlDept.length);

    if (data.Count > 0)
    {
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name;
            ddlDept.add(opt, ddlDept.length);
        }
    }

    ddlMod_Change();
}

function btnSearch_Click()
{
    reloadData();
}

function ddlFlowType_Change()
{
    reloadData();
}

function ddlDept_Change()
{
    reloadData();
}

function selectAccount(aim)
{
    var corpID = getObj("ddlCorp").value;
    var vValue = openModalWindow('../../../Common/Select/VSelectSingleEmployee.aspx?type=account&CorpID=' + corpID, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidAccountID").value = vValue.split('|')[0];
        getObj("txtAccount").value = vValue.split('|')[1];
        reloadData();
    }
}

function ddlHasAudit_Change()
{
    reloadData();
}

function reloadData()
{
    var query = {
        DeptID: $("#ddlDept").val(),
        CorpID: $("#ddlCorp").val(),
        FMID: $("#ddlMod").val(),
        KeyWord: $("#txtKey").val(),
        FlowTypeID: $("#ddlFlowType").val(),
        AccountID: $("#hidAccountID").val(),
        HasAudit: $("#ddlHasAudit").val(),
        StartTime: $("#txtStartTime").val(),
        EndTime: $("#txtEndTime").val()
    };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

function btnAudit_Click(type)
{
    var ids = getJQGridSelectedRowsData('jqGrid1', true, 'LinkID');
    var vIsAllowDelete = getJQGridSelectedRowsData('jqGrid1', true, 'IsAllowAudit');

    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }

    if (stripHtml(vIsAllowDelete.join(",")).indexOf('N') != -1)
    {
        return alertMsg("部分数据已审计。");
    }

    if (ids.length > 50)
    {
        return alertMsg("您一次最多只能审计50条记录。");
    }

    var url = "VFlowAuditSet.aspx?Type=" + type + "&JQID=jqGrid1&ID=" + ids.join(",");

    var winobj = getOpenWinObj(1,600,400);
    window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
        + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
}

function renderLink(cellvalue, options, rowobject)
{
    var url = "'../../.."+rowobject[11] + rowobject[0] + "'";
    return '<a  href="#ShowTitle" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function renderAuditLink(cellvalue, options, rowobject)
{
    var url = "'VFlowAuditBrowse.aspx?ID=" + rowobject[14]+"'";
    return '<a  href="#ShowAudit" onclick="javascript:openWindow(' + url + ',500, 400)">' + cellvalue + '</a>';
}

function renderAuditListLink(cellvalue, options, rowobject)
{
    var url = "'VFlowAuditBrowse.aspx?ID=" + rowobject[10] + "'";
    return '<a  href="#ShowAudit" onclick="javascript:openWindow(' + url + ',500, 400)">' + cellvalue + '</a>';
}

function renderListLink(cellvalue, options, rowobject)
{
    var url = "'../../.." + rowobject[9] + rowobject[0] + "'";
    return '<a  href="#ShowTitle" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}


function showCCtitle(url, id)
{
    var url = "../../.." + url + id;
    openWindow(url, 0, 0);
}

function checkForm()
{
    if (getObj("txtAuditContent").value == "")
    {
        handleBtn(true);
        return alertMsg("审核意见不能为空。", getObj("txtAuditContent"));
    }

    return true;
}