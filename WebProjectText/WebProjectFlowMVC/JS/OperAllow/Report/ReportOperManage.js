// VReportOperManage.aspx的js

/* 重新加载DataGrid数据 */
function reloadData()
{
    var modID = getObj("ddlMod").value;
    var corpID = getObj("ddlCorp").value;
    var kw= getObj("txtKW").value;
    ajax(location.href, { "ModID": modID, "CorpID": corpID, "KW": kw }, "json", refreshReportData);
}

/*Ajax 获取数据后填充Dom节点内容*/
function refreshReportData(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#divMPList").html(data.Data);
        $("#divMPList td").each(function ()
        {
            this.cellIndex > 1 && $(this).attr("title", $(this).text());
        });
    }
    else
    {
        alert(data.Data);
    }
}

// 查看报表授权信息
function showReportInfo()
{
    openWindow("VReportOperBrowse.aspx?ID=" + $("input:checkbox", getEventObj("tr")).val(), 500, 500);
}

// 设置授权
function setOper()
{
    var corpID = $("#ddlCorp").val();
    var ids = "";
    if (!corpID)
    {
        return alertMsg("请选择一个公司。");
    }
    $(":checked:not(#chkAll)").each(function (i)
    {
        ids += (i ? "," : "") + this.value;
    });
    if (!ids)
    {
        return alertMsg("请选择要授权的报表。");
    }
    $("#hidIDs").val(ids);

    openWindow('VReportOperManageSetting.aspx?CorpID=' + corpID, 0, 0);
}



// VReportOperBrowse.aspx的js

function reloadAllowData()
{
    ajax(location.href, { "CorpID": getObj("ddlCorp").value }, "json", refreshReportAllowData);
}

function refreshReportAllowData(data)
{
    if (data.Success == "Y")
    {
        $("#txtAllowStation").val(data.Others[0]);
        $("#txtAllowDept").val(data.Others[1]);
        $("#txtAllowGroup").val(data.Others[2]);
    }
    else
    {
        alert(data.Data);
    }
}