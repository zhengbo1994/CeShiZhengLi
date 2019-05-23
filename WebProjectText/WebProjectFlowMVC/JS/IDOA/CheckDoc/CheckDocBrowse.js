// VCheckDocBrowse.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-06-24
function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
}

function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
    
    // 起草与浏览
    if (getObj("chkUseDocModel") != null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setUseDocModel(getObj("chkUseDocModel"));
    }
    else if (getObj("chkUseDocModel") == null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setDisplayDocModel();
    }
}

function setDesc(areaName)
{
    if (getObj(areaName).value == "0")
    {
        getObj(areaName+'_desc').value = "";
        
        if (areaName == "areaLookInfo")
        {
            if (getObj("txtLookStationNames") != null && getObj("txtLookStationNames").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅岗位(系统)：" + getObj("txtLookStationNames").value
            }
            
            if (getObj("txtLookDeptNames") != null && getObj("txtLookDeptNames").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅部门(系统)：" + getObj("txtLookDeptNames").value
            }
            
            if (getObj("txtLookStation").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅岗位：" + getObj("txtLookStation").value
            }
            
            if (getObj("txtLookDept").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅部门：" + getObj("txtLookDept").value
            }
        }
        else if (areaName == "areaFileInfo")
        {
            for (var i=0; i<getObj("accessaryFile").rows.length; i++)
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                
                if (getObj("accessaryFile").rows[i].filetitle != undefined)
                {
                    getObj(areaName+'_desc').value += getObj("accessaryFile").rows[i].filetitle;
                }
            }
        }
    }
    else
    {
        getObj(areaName+'_desc').value = "";
    }
}

function showIsCachet()
{
    if (getObj("hidIsCachet").value == "Y")
    {
       // getObj("trCachetArea").style.display = "";
        getObj("trCachetInfo").style.display = "";
    }
    else
    {
      //  getObj("trCachetArea").style.display = "none";
        getObj("trCachetInfo").style.display = "none";
    }
}

function showDoc(vCDID)
{
    openWindow('VCheckDocBrowse.aspx?CheckDocType=0&ID='+vCDID,0, 0);
}

function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}

function btnSelectEditLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidEditLookStationID").value = vValue.split('|')[0];
        getObj("txtEditLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectEditLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidEditLookDeptID").value = vValue.split('|')[0];
        getObj("txtEditLookDept").value = vValue.split('|')[1];
    }
}

function validateEdit()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    
    var vTitle = getObj("txtEditTitle").value;
    var vNo = getObj("txtEditNo").value;
    
    if (vTitle == "")
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return alertMsg("申请标题不能为空。", getObj("txtEditTitle"));
    }
    //如果控制申请编号不为空直接申请的修改会报错，故去掉此控制   dux  2017-04-13
    //if (vNo == "")
    //{
    //    setBtnEnabled(getObj("btnSubmit"), true);
    //    return alertMsg("申请编号不能为空。", getObj("txtEditNo"));
    //}
    
    return true;
}

// 项目查看
function showProject(projectID)
{
    var url = "../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + projectID;
    openWindow(url, 600,600);
}

function showDetail()
{
    if(getObj("hidCheckDocType").value == "2")
    {
        var url = "'../../../../POM/GroupBusinessManagedPlan/VGBMPlanBrowse.aspx?ID=" + getObj("hidKeyID").value;
    }
    else if(getObj("hidCheckDocType").value == "3")
    {
        var url = "'../../../../POM/CorpBusinessManagedPlan/VCBMPlanBrowse.aspx?ID=" + getObj("hidKeyID").value;
    }
    else
    {
        var url = "'../../../../POM/POTargetBook/VManagePOTargetBookBrowse.aspx?ID=" + getObj("hidKeyID").value;
    }
    openWindow(url,0, 0);
}

//入库认证评估查看
function showEvaluation(vEID)
{
    openWindow("/" + rootUrl + "/Supplier/COSEvaluation/VEvaluationBrowse.aspx?ID=" + vEID, 0, 0);
}