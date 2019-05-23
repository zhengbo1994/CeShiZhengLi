// 我的工作预警/公司预警中心，选择项目或部门页VSelectEWProjectOrDept.aspx用到的js
// 作者：程爱民
// 日期：2011-03-16


// 页面加载
function loadPD()
{
    var pd = null;
   
    if($('#ddlType').attr('disabled'))
    {
        pd = $('#ddlType :selected').val();
    }
    else
    {    
        pd = getObjD("hidPDType").value;
    }
    var id = getObjD("hidPDID").value;
    var corpID = window.dialogArguments["PD_CorpID"];
    
    if (!pd)
    {
        getObj("ddlType").selectedIndex = 0;
        //getObj("ddlCorp").disabled = true;
    }
    else if (pd == "P")
    {
        getObj("ddlType").selectedIndex = 1;
    }
    else if (pd == "D")
    {
        getObj("ddlType").selectedIndex = 2;
    }
    
    //for (var i = 0; i < getObj("ddlCorp").length; i++)
    //{
    //    if (getObj("ddlCorp").options[i].value == corpID)
    //    {
    //        getObj("ddlCorp").selectedIndex = i;
    //        break;
    //    }
    //}
    if (corpID)
    {
        $('#ddlCorp').val(corpID);
    }
    if (window.dialogArguments["CorpDisable"]=='true')
    {
        $('#ddlCorp').attr('disabled', true);
    }
    
    window["IsFirst"] = true;
    if (pd == "P" || pd == "D")
    {
        refreshPD();
    }
}

// 刷新公司下的项目/部门
function refreshPD()
{
    window["SelectedID"] = null;
    window["SelectedName"] = null;

    var corpID = getObj("ddlCorp").value;
    var pd = getObj("ddlType").value;
    var moduleCode = getObj("hidModuleCode")!=undefined ? getObj("hidModuleCode").value:"";

    ajaxRequest("VSelectProjectOrDept.aspx", { AjaxCorpID: corpID, PD: pd, ModuleCode:moduleCode }, "text", loadPDInfo);
}

// 加载项目/部门
function loadPDInfo(data, textStatus)
{
    switch (data.split(":")[0])
    {
        case "success":
            $(divMPList).html(data.substr(8));
            if (window["IsFirst"])
            {
                window["IsFirst"] = false;
                var id = getObjD("hidPDID").value;
                if (id)
                {
                    var spans = divMPList.getElementsByTagName("span");
                    for (var i = 0; i < spans.length; i++)
                    {
                        if (spans[i].onclick && spans[i].onclick.toString().indexOf(id) != -1)
                        {
                            clickPD(spans[i], id);
                            break;
                        }
                    }
                }
            }
            break;
        case "error":
            showWarnMsg(true, data.substr(6));
            break;
    }
}

// 切换选择项目或部门
function changeSelectType()
{
    var pd = getObj("ddlType").value;
    if (pd == "P" && !getObj("tbProject") || pd == "D" && !getObj("tbDept"))
    {
        //getObj("ddlCorp").disabled = false;
        refreshPD();
    }
    else if (!pd)
    {
        //getObj("ddlCorp").disabled = true;
        $(divMPList).html("<input type=\"hidden\" id=\"hidModuleCode\" value=\"" + getObj("hidModuleCode").value+ "\" />");
        window["SelectedID"] = "";
        window["SelectedName"] = "全部";
    }
}

// 点击项目/部门
function clickPD(span, id)
{
    if ($(span).attr('idtype') && $(span).attr('idtype') === 'C') return;
    clickTreeNode(span);
    
    window["SelectedID"] = id;
    window["SelectedName"] = span.innerText;
}

// 选择项目/部门
function selectPD()
{
    if (getObj("ddlType").value && !window["SelectedID"])
    {
        alert("没有选择任何项目/部门。");
        return false;
    }
    else
    {
        getObjD("hidPDType").value = getObj("ddlType").value;
        getObjD("hidPDID").value = window["SelectedID"] || "";              //window["SelectedID"] edit by xiaodm 2012-9-10
        getObjD("txtPDName").value = window["SelectedName"] || "全部";     //window["SelectedName"] edit by xiaodm 2012-9-10
        window.dialogArguments["PD_CorpID"] = getObj("ddlCorp").value;
        window.close();
    }
}

// 清空选择
function clearPD()
{
    getObjD("hidPDType").value = "";
    getObjD("hidPDID").value = "";
    getObjD("txtPDName").value = "";
    window.dialogArguments["PD_CorpID"] = null;
    window.close();
}