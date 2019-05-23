// JScript 文件


 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：业务系统导航-设计标准-待办我的项目项目基础数据库
 * 文件类型：WaitPeriodProjectBaseDBRequest.js
 * 作    者：马吉龙
 * 时    间：2010-12-13
 */
//搜索
var filterData=function()
{
    var ProjectID=getObj("ddlProject").value;
    var CCState=getObj("ddlCCState").value;
    var Key=getObj("txtKey").value;
    addParamsForJQGridQuery("jqWaitPeriodProjectBaseDBRequest",[{ProjectID:ProjectID,CCState:CCState,Key:Key}]);
    refreshJQGrid("jqWaitPeriodProjectBaseDBRequest");
}
function btnSerach_Click(jqgid)
{
     var ProjectID=getObj("ddlProject").value;
    var Key=getObj("txtKey").value;
    addParamsForJQGridQuery(jqgid,[{ProjectID:ProjectID,Key:Key}]);
    refreshJQGrid(jqgid);
}


function waitDoLink(value,pt,record)
{
    var vState = record[7];
    var vUrl = "''";
    switch (vState)
    {
        case "WaitCheck":
            vUrl="'VWaitCheckPeriodProjectBaseDBRequest.aspx?CCID=" + record[0] + "'";
            break;
        case "WaitCommunicate":
            vUrl="'VWaitCommunicatePeriodProjectBaseDBRequest.aspx?CCID=" + record[0] + "'";
            break;
        case "WaitDeal":
            vUrl="'VWaitDealPeriodProjectBaseDBRequest.aspx?CCID=" + record[0] + "'";
            break;
        case "WaitAdjust":
            vUrl="'VWaitAdjustPeriodProjectBaseDBRequest.aspx?CCID=" + record[0] + "'";
            break;
        case "WaitSave":
            vUrl="'VWaitSavePeriodProjectBaseDBRequest.aspx?CCID=" + record[0] + "'";
            break;
        case "WaitLook":
            vUrl="'VWaitLookPeriodProjectBaseDBRequest.aspx?ID=" + record[6] + "'";
            break;
    }
    return '<div class="nowrap"><a  href="#ShowLeave" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqWaitPeriodProjectBaseDBRequest\');">' + value + '</a></div>';
}


//批量阅读
var btnLookList_Click=function()
{
    openAddWindow("VWaitLookPeriodProjectBaseDBRequestList.aspx", 0, 0, "jqWaitPeriodProjectBaseDBRequest");
}
//批量归档
var btnSaveList_Click=function()
{
    openAddWindow("VWaitSavekPeriodProjectBaseDBRequestList.aspx", 0, 0, "jqWaitPeriodProjectBaseDBRequest");
}
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
    
    if (index == 0)
    {    
        setDesc('areaFileInfo');
        setDesc('areaLookInfo');
    }
}
function validateLookList()
{
    var vReqID = getJQGridSelectedRowsData('jqWaitLookPeriodProjectBaseDBRequest',true,'KeyID');
    if (vReqID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidLookList").value = vReqID;
    return true;
}
function validateSaveList()
{
    var vZBPID = getJQGridSelectedRowsID('jqWaitLookPeriodProjectBaseDBRequest', true);
    var vCCID = getJQGridSelectedRowsData('jqWaitLookPeriodProjectBaseDBRequest',true,'CCID');
    var vFlowID = getJQGridSelectedRowsData('jqWaitLookPeriodProjectBaseDBRequest',true,'FlowID');
    if (vZBPID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidSaveList").value = vZBPID;
    getObj("hidSaveCCID").value = vCCID;
    getObj("hidSaveFlowID").value = vFlowID;
    
    return true;
}


function validateCheck()
{
    setBtnEnabled(getObj("btnSubmit"), false);

    // 获取自定义表单数据
    var vCustomFormID = "";
    var vCustomFormValue = "";
    
    var vCheckID = "";
    var vCheckValue = "";
    
    if (getObj("tableContent") != null)
    {
        $("#tableContent select").each(function(){
            var vID=$(this).attr('id');
            var vValue = $(this).val();
            
            vCustomFormID += "|" + vID;
            vCustomFormValue += "|" + vValue;
        });
        
        $('#tableContent input').each(function(){
            // 文本框，非只读才记录
            if ($(this).attr('type') == "text" && !$(this).attr('readonly'))
            {
                var vID=$(this).attr('id');
                var vValue=$(this).val();
                
                vCustomFormID += "|" + vID;
                vCustomFormValue += "|" + vValue;
            }
            else if ($(this).attr('type') == "checkbox")
            {
                if ($(this).attr('checked'))
                {
                    var vID=$(this).attr('id');
                    var vValue=$(this).val();
                    
                    // 记录的是FidleID
                    vCheckID += "|" + vID;
                    vCheckValue += "|" + vValue;
                }
            }
        });
        
        if (vCustomFormID != "")
        {
            vCustomFormID = vCustomFormID.substr(1);
            vCustomFormValue = vCustomFormValue.substr(1);
        }
        
        if (vCheckID != "")
        {
            vCheckID = vCheckID.substr(1);
            vCheckValue = vCheckValue.substr(1);
        }
    }
    
    getObj("hidCustomFormID").value = vCustomFormID;
    getObj("hidCustomFormValue").value = vCustomFormValue;
    
    getObj("hidCustomFormCheckID").value = vCheckID;
    getObj("hidCustomFormCheckValue").value = vCheckValue;
    
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
//格式化名称
var renderName=function(value,pt,record)
{
    var vUrl="'VMyPeriodProjectBaseDBRequestBrowse.aspx?ID=" + record[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',1000,800)">' + value + '</a></div>';
}
//调整相关验证
function validateAdjust()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);

    submitContent();
    
    var result = openModalWindow('../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
    if (result == "Cancel" || result == "undefined" || result == null || result == "No")
    {
        if (result == "No")
        {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }
    
    if (!saveDocModel())
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }
    
    return true;
}
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
    
    if (index == 0)
    {    
        setDesc('areaFileInfo');
        setDesc('areaLookInfo');
    }
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

function checkCustomForm()
{
    // 获取自定义表单数据
    var vCustomFormID = "";
    var vCustomFormValue = "";
    
    var vCheckID = "";
    var vCheckValue = "";
    
    if (getObj("tableContent") != null)
    {
        $("#tableContent select").each(function(){
            var vID=$(this).attr('id');
            var vValue = $(this).val();
            
            vCustomFormID += "|" + vID;
            vCustomFormValue += "|" + vValue;
        });
        
        $('#tableContent input').each(function(){
            if ($(this).attr('type') == "text")
            {
                var vID=$(this).attr('id');
                var vValue=$(this).val();
                
                vCustomFormID += "|" + vID;
                vCustomFormValue += "|" + vValue;
            }
            else if ($(this).attr('type') == "checkbox")
            {
                if ($(this).attr('checked'))
                {
                    var vID=$(this).attr('id');
                    var vValue=$(this).val();
                    
                    // 记录的是FidleID
                    vCheckID += "|" + vID;
                    vCheckValue += "|" + vValue;
                }
            }
        });
        
        if (vCustomFormID != "")
        {
            vCustomFormID = vCustomFormID.substr(1);
            vCustomFormValue = vCustomFormValue.substr(1);
        }
        
        if (vCheckID != "")
        {
            vCheckID = vCheckID.substr(1);
            vCheckValue = vCheckValue.substr(1);
        }
    }
    if (!formValidate() || !flowValidate())//自定义表单和流程校验
    {
        setBtnEnabled($("#btnSaveOpen,#btnSaveClose"), true);
        return false;
    }
    /*
     getObj("hidCustomFormID").value = vCustomFormID;
     getObj("hidCustomFormValue").value = vCustomFormValue;
     
     getObj("hidCustomFormCheckID").value = vCheckID;
     getObj("hidCustomFormCheckValue").value = vCheckValue;
     */
    
    return true;
}

//送阅岗位
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

//审核信息
//起草人岗位变化
var ddlStation_Change=function()
{
    var ddl=getObj("ddlStation");
    if (ddl.value == "")
    {
        getObj("hidStationID").value = "";
        getObj("hidCorpID").value = "";
        getObj("hidPositionLevel").value = "";
    }
    else
    {
        getObj("hidStationID").value = ddl.value.split('|')[0];
        getObj("hidCorpID").value = ddl.value.split('|')[1];
        getObj("hidPositionLevel").value = ddl.value.split('|')[2];
    }
}


//送阅岗位
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