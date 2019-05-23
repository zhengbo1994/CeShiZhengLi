

// JScript 文件

//新增
//参数type:
//0:新增同级,1:新增下级

var addFormType = function (type)
{
    var ftID = window["FTID"];
    var parentId = window["ParentID"];
    var formType = getObj("hidFormType").value;
    if ($('#lblNoData', window.frames('Left').document).length <= 0)
    {
        if (!ftID)
        {
            return alertMsg("请选择一个表单类别。");
        }
    }
    if (ftID == null || ftID == "")
    {
        //如果是预算的，由于页面多了岗位授权、部门授权文本框，故窗体宽度要宽些
        if (formType == '1' || formType == '2' || formType == '3' || formType == '4' || formType == '5')
            openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=00000", 540, 490);
        else
            openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=00000", 540, 490);
    }
    else
    {
        if (type == '0')
        {   //新增同级
            //如果是预算的，由于页面多了岗位授权、部门授权文本框，故窗体宽度要宽些
            if (formType == '1' || formType == '2' || formType == '3' || formType == '4' || formType == '5')
                openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=" + parentId, 540, 490);
            else
                openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=" + parentId, 540, 490);
        }
        else
        {
            if (ftID == 'DefaultFormType')
            {
                return alertMsg("默认表单类别不能添加下级。");
            }
            //如果是预算的，由于页面多了岗位授权、部门授权文本框，故窗体宽度要宽些
            if (formType == '1' || formType == '2' || formType == '3' || formType == '4' || formType == '5')
                openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=" + ftID, 540, 490);
            else
                openAddWindow("VFormTypeAdd.aspx?FormType=" + formType + "&ParentID=" + ftID, 540, 490);
        }
    }
}

//修改
var editFormType = function ()
{
    var ftID = window["FTID"];
    var formType = getObj("hidFormType").value;
    if ($('#lblNoData', window.frames('Left').document).length <= 0)
    {
        if (!ftID)
        {
            return alertMsg("请选择一个表单类别。");
        }
    }
    if (ftID == null || ftID == "")
    {
        alertMsg("您没有选择任何记录。");
        return;
    }
    if (ftID == 'DefaultFormType')
    {
        return alertMsg("默认表单类别不能修改。");
    }

    //如果是预算的，由于页面多了岗位授权、部门授权文本框，故窗体高度要高些
    openWindow("VFormTypeEdit.aspx?FormType=" + formType + "&FTID=" + ftID, 540, inValues(formType, '1', '2', '3', '4', '5','6','7') ? 490 : 280);
}

//删除

function deleteFormType(dwiID)
{
    var ftID = window["FTID"];
    if($('#lblNoData',window.frames('Left').document).length <= 0)
    {
        if(!ftID)
        {
            return alertMsg("请选择一个表单类别。");
        }        
    }
    else
    {
        return alertMsg("不存在任何表单类别。");
    }

    if(ftID == 'DefaultFormType')
    {
        return alertMsg("默认表单类别不能删除。");
    }
    var url = "/" + rootUrl + "/Common/Delete/VDeletePlatform.aspx?Action=FormType&JQID=&NoFrame=true&ID=" + ftID;    
    var width = 320;
    var height = 202;
    if (ieVersion >= 7)
    {
        height = 154;
    }
    var left = (screen.width - width)/2;
    var top = (screen.height - height)/2;
    	
	window.showModalDialog(url, window, 'dialogtop=' + top + 'px;dialogleft=' + left + 'px;dialogWidth=' + width + 'px;dialogHeight=' + height + 'px;status=1;resizable=0;scroll=0;scrollbars=0'); 
}


    

//验证表单数据是否合法
function validateSize()
{ 
    
    if (getObj("txtDWIName").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("txtDWIName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }    
    return true;
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled($("#btnSaveOpen"), enabled);
    setBtnEnabled($("#btnSaveClose"), enabled);
}

 // 加载
function loadFormType()
{
    ajaxRequest(window.location.href, { AjaxRequest: true }, "html", refreshFormType);
}

// 刷新
function refreshFormType(data, textStatus)
{
    $(document.body).html(data);
    
    var spanID = window.parent["Selected"];
    if (!spanID)
    {
        spanID = "span_0";
        
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
}
// 显示
function showFormType(span, ftID, parentId)
{
    if (ftID == "F83E9155-169E-4E58-838D-BD7F98E0D006") {
        getObjP("btnAddChild").style.display = "none";
        getObjP("btnEdit").style.display = "none";
        getObjP("btnDelete").style.display = "none";
    }
    else
    {
        getObjP("btnAddChild").style.display = "";
        getObjP("btnEdit").style.display = "";
        getObjP("btnDelete").style.display = "";
    }
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    span.className = "selNode";
    window.parent["Selected"] = span.id;

    window.parent["FTID"] = ftID;
    window.parent["ParentID"] = parentId;
    execFrameFuns("Main", function(){window.parent.frames("Main").loadInfo(ftID);}, window.parent);
}
function loadInfo(ftID)
{
    ajaxRequest("VFormTypeRight.aspx", { AjaxRequest: true, FTID: ftID,"FormType":getParamValue("FormType") }, "html", refreshInfo);
}
// 刷新
function refreshInfo(data, textStatus)
{
    $(document.body).html(data);
}  

//修改后重新加载
function reloadData()
{
    loadFormType();
}