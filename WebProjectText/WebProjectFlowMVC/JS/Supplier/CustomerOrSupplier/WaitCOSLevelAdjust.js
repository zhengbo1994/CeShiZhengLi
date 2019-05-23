// JScript 文件
//***************************************************//
//
//文件名:WaitCOSLevelAdjust.js
//作者:王勇
//时间:2011-07-21 09:17
//功能描述:待办供应商级别调整中相关js操作
//
//*************************************************//

function waitDoLink(cellvalue,options,rowobject)
{
    var vState = rowobject[7];
    var vUrl = "''";
    switch (vState)
    {
        case "WaitCreate":
            vUrl="'VCOSLevelAdjustAdd.aspx'";
            break;
        case "WaitCheck":
            vUrl="'VWaitCheckCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
        case "WaitCommunicate":
            vUrl = "'VWaitCommunicateCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
        case "WaitDeal":
            vUrl = "'VWaitDealCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
        case "WaitAdjust":
            vUrl = "'VWaitAdjustCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
        case "WaitSave":
            vUrl = "'VWaitSaveCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
        case "WaitLook":
            vUrl = "'VWaitLookCOSLevelAdjust.aspx?ID=" + options.rowId + "'";
            break;
         default:
            vUrl="'#'";
            break;
    }

    return '<div class="nowrap"><a  href="#ShowDoc" onclick="javascript:openAddWindow(' + vUrl + ', screen.availWidth, screen.availHeight, \'jqgWaitCOSLevelAdjust\');">' + cellvalue + '</a></div>';
}

//点击供应商名称连接弹出页面  add by huch 2012-09-28
function showCOS(id)
{
    openWindow("VCustomerOrSupplierBrowse.aspx?COSID=" + id, 800, 600, 0, 0, 1);
}

function refreshData()
{
    var adjustWay = getObj("ddlAdjustWay").value;
    var vCCState = "";
    if(getObj("ddlCCState"))
    {
        vCCState = getObj("ddlCCState").value;
    }
    var vKey = getObj("txtKW").value;
    
    addParamsForJQGridQuery('jqgWaitCOSLevelAdjust',[{AdjustWay : adjustWay ,CCState : vCCState, KeyValue : vKey}]);
    
    refreshJQGrid('jqgWaitCOSLevelAdjust');
}

function ddlAdjustWay_Change()
{
    refreshData();
}
function ddlCCState_Change()
{
    refreshData();
}
function btnSerach_Click()
{
    refreshData();
}

function btnLookList_Click()
{
    openAddWindow("VWaitCOSLevelAdjustLookList.aspx", 0, 0, "jqgWaitCOSLevelAdjust");
}

function btnSaveList_Click()
{
    openAddWindow("VWaitCOSLevelAdjustSaveList.aspx", 0, 0, "jqgWaitCOSLevelAdjust");
}

//批量阅读
function validateLookList()
{
    var vReqID = getJQGridSelectedRowsData('jqgWaitCOSLevelAdjust',true,'KeyID');
    if (vReqID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidLookList").value = vReqID;
    return true;
}
//批量归档
function validateSaveList()
{
    
    var vEID = getJQGridSelectedRowsID('jqgWaitCOSLevelAdjust', true);
    var vCCID = getJQGridSelectedRowsData('jqgWaitCOSLevelAdjust',true,'CCID');
   // var vFlowID = getJQGridSelectedRowsData('jqgWaitCOSLevelAdjust',true,'FlowID');
    
    if (vEID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidSaveList").value = vEID;
    getObj("hidSaveCCID").value = vCCID;
   
    //getObj("hidSaveFlowID").value = vFlowID;
    
    return true;
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
            for (var i=0; i<getObj("fileList").rows.length; i++)
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                
                if (getObj("fileList").rows[i].filetitle != undefined)
                {
                    getObj(areaName+'_desc').value += getObj("fileList").rows[i].filetitle;
                }
            }
        }
    }
    else
    {
        getObj(areaName+'_desc').value = "";
    }
}
function validateCheck()
{
    if (getObj('tdRequiredlblCheckTitle') && getObj('tdRequiredlblCheckTitle').style.display != "none" && trim(getObj("txtCheckDescription").value) == "")
    {
        return alertMsg("请填写审核/处理意见。");
    }
    setBtnEnabled(getObj("btnSubmit"), false);

    if((!formValidate()))
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    
    var left = (screen.width - 350)/2;
    var top = (screen.height - 170)/2;
    var result = openModalWindow('../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
    if (result == "Cancel" || result == "undefined" || result == null || result == "No")
    {
        if (result == "No")
        {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    
    if (!saveDocModel())
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    
    return true;
}

//选择人员岗位
function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];       
    }
}
//送阅部门
function btnSelectLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}

//选择人员岗位 管理修改
function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidEditLookStationID").value = vValue.split('|')[0];
        getObj("txtEditLookStation").value = vValue.split('|')[1];       
    }
}
//送阅部门 管理修改
function btnSelectEditLookDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidEditLookDeptID").value = vValue.split('|')[0];
        getObj("txtEditLookDept").value = vValue.split('|')[1];
    }
}
//修改时验证
var validateEdit=function()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    
    var vTitle = trim(getObj("txtEditTitle").value);
    var vNo = trim(getObj("txtEditNo").value);
    
    if (vTitle == "")
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return alertMsg("申请标题不能为空。", getObj("txtEditTitle"));
    }
    
    if (vNo == "")
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return alertMsg("申请编号不能为空。", getObj("txtEditNo"));
    }
    
    return true;
}


function showCheckTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
    
    // 在回发后若要保持原来选中项，同理。（需自行处理）            
    setVisible('areaBasicInfo', trBasicInfo);
    setVisible('areaOtherInfo', trOtherInfo);
    setVisible('areaFileInfo', trFileInfo);
    setVisible('areaOfficeDoc', trOfficeDoc);
    setVisible('areaLookInfo', trLookInfo);
    setVisible('areaCOSList', trCOSList);
    
    if (index == 0)
    {    
        setDesc('areaFileInfo');
        setDesc('areaLookInfo');
    }
}

//----------------------------阅读验证

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

function validateLook()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnSuggest"), false);
    
    var vSuggest = getObj("txtLookRemark").value;
    
    if (vSuggest == "")
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnSuggest"), true);
        return alertMsg("审阅意见不能为空。", getObj("txtLookRemark"));
    }
    
    return true;
}
//--------------------------end

