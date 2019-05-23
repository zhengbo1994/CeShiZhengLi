/*
   企业架构设置的支持文件
*/

//添加企业架构 
//@struType 0-同级 1-下级
function addStructure(action)
{
    var struID = window["StruID"];
    if (!struID)
    {
        return alertMsg('请选择一个公司或部门。');
    }    
    if (struID == "TotalCompany" && action == 0)
    {
        return alertMsg('总公司只能新增下级。');
    }
    if (getObj("hidCompany").value == "chinasap" && window["IsPD"] == "Y" && action == 1)
    {
        return alertMsg('项目部不能新增下级。');
    }
    
    action = (action == 0 ? "AddFriend" : "AddSon");
    
    openWindow("VCorpStructureAdd.aspx?Action=" + action + "&StruID=" + struID, 500, 500);
}

//修改企业架构
function editStructure()
{
    var struID = window["StruID"];
    if(!struID)
    {
        return alertMsg('请选择要修改的公司或部门。');
    }

    openWindow("VCorpStructureEdit.aspx?StruID=" + struID, 500, 500);
}

//删除企业架构
function delStructure()
{
    var struID = window["StruID"];
    if (!struID)
    {
        return alertMsg('请选择要删除的公司或部门。');
    }
    if (struID == "TotalCompany")
    {
        return alertMsg('总公司不能删除。');
    }
    openDeleteWindow("CorpStructure", 1, struID);
}

// 项目部管理
function managePD()
{
    openWindow("VProjectDept.aspx",  400, 600);
}

function btnImport_Click()
{
     var struID = window["StruID"];
    if (!struID)
    {
        return alertMsg('请选择要导入的公司或部门。');
    }
    //if (struID == "TotalCompany")
    //{
    //    return alertMsg('总公司不能导入。');
    //}4
    openAddWindow("VCorpStructureExcelImport.aspx?CorpID=" + struID, 500, 200);
}

//验证表单数据是否合法
function validateSize()
{
    handleBtn(false);        
    if($('#txtStruName').val().length<=0)
    {
        handleBtn(true);
        return alertMsg("名称不能为空。", $('#txtStruName').get(0));
    }
    if ($('#txtStruNo').val().length <= 0) {
        handleBtn(true);
        return alertMsg("编号不能为空。", $('#txtStruNo').get(0));
    }
    return true;
}

function setDisplay()
{
    var rblStruType = getObj("rblStruType");
    var lblCheckInOutManager = $("#lblCheckInOutManager");
    var rdoCorp;
    if (rblStruType != null)
    {
        rdoCorp = getObjC(rblStruType, "input", 0);
    }

    if (rblStruType != null && rdoCorp.checked)
    {
        trBD.style.display = "none";
        trDeptHeaderStation.style.display = "none";
        trChargeLeaderStation.style.display = "none";
        trHigherFunctionStation.style.display = "none";
        trIsPD.style.display = "none";
        trProject.style.display = "none";
        trTheme.style.display = "";
        trLayout.style.display = "";
        trLogo.style.display = "";
        corpLogoDesc.style.display = "";
        
        if (lblCheckInOutManager && lblCheckInOutManager.length == 1)
        {
            lblCheckInOutManager.html("公司考勤<br/>管理员")
        }
    }
    else
    {
        trBD.style.display = "";
        trDeptHeaderStation.style.display = "";
        trChargeLeaderStation.style.display = "";
        trHigherFunctionStation.style.display = "";

        if (getObj("hidCompany").value == "chinasap" && getObj("hidIsLeaf") && getObj("hidIsLeaf").value == "Y")
        {
            trIsPD.style.display = "";
            var rdoIsPD = getObjC(getObj("rblIsPD"), "input", 0);
            trProject.style.display = ((rdoIsPD && rdoIsPD.checked) ? "" : "none");
        }
        trTheme.style.display = "none";
        trLayout.style.display = "none";
        trLogo.style.display = "none";
        corpLogoDesc.style.display = "none";

        if (lblCheckInOutManager && lblCheckInOutManager.length == 1)
        {
            lblCheckInOutManager.html("部门考勤<br/>管理员")
        }
    }
}

//设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled($("#btnSaveOpen"), enabled);
    setBtnEnabled($("#btnSaveClose"), enabled);
}

// 项目查看
function showProject(projectID)
{
    var url = "../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + projectID;
    openWindow(url, 600,600);
}



// VCorpStructureLeft.aspx的js

// 刷新页面数据
function reloadData()
{
    loadStrudcture();
}

var scrollTop = 0;
var scrollLeft = 0;

// 加载所有架构
function loadStrudcture()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
 
    $(".pagedesc", parent.document).html("");

    ajaxRequest("VCorpStructureLeft.aspx", { AjaxRequest: true }, "html", refreshStructure);
}

// 刷新架构
function refreshStructure(data, textStatus)
{
    $(document.body).html(data);
    
    divMPList.scrollTop = scrollTop;
    divMPList.scrollLeft = scrollLeft;
    
    var spanID = window["TreeNode_Selected"];
    
    if (!spanID)
    {
        spanID = "span_0";
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["StruID"] = null;
        window.parent["IsPD"] = null;
    }

    showLayerTool();
}

// 显示展开或折叠链接
function showLayerTool()
{
    var maxlevel = 0;
    $("#divMPList tr[id]").each(function ()
    {
        var level = this.id.split(".").length;
        if (level > maxlevel)
        {
            maxlevel = level;
        }
    });

    for (var i = 0; i < maxlevel; i++)
    {
        $(".pagedesc", parent.document).append('<a class="fontsize" href="javascript:void(0)" onclick="frames(\'Left\').expColStru(' + (i + 1) + ')">['
            + ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][i] + ']</a>&nbsp;');
    }
}

// 展开或折叠架构
function expColStru(i)
{
    showLayerTG($('#divMPList table')[0], i, 0, 0);
}

// 显示架构信息
function showStructure(span, struID, isPD)
{
    clickTreeNode(span);

    window.parent["StruID"] = struID;
    window.parent["IsPD"] = isPD;

    execFrameFuns("Main", function () { window.parent.frames("Main").loadStruInfo(struID); }, window.parent);
}



// VCorpStructureMain.aspx的js

// 加载架构信息
function loadStruInfo(struID)
{
    ajaxRequest("VCorpStructureMain.aspx", { AjaxRequest: true, StruID: struID }, "html", refreshStruInfo);
}

// 刷新架构信息
function refreshStruInfo(data, textStatus)
{
    $(document.body).html(data);
}

//(公司/部门）考勤管理员
function btnSelectCheckInOutManager_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=CheckInOutManager', 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidCheckInOutManagerID").value = vValue.split('|')[0];
        getObj("txtCheckInOutManager").value = vValue.split('|')[1];
    }
}