 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：待办项目产品交付与材料部品标准的表单设计
 * 文件类型：WaitPPMASRequestList.js
 * 作    者：王勇
 * 时    间：2010-12-15 10:52:15
 */
 
 function waitDoLink(cellvalue,options,rowobject)
{
    var vState = rowobject[6];
    var vUrl = "''";
    switch (vState)
    {
        case "WaitCheck":
            vUrl="'VWaitPPMASRequestCheck.aspx?CCID=" + rowobject[0] + "'";
            break;
        case "WaitCommunicate":
            vUrl="'VWaitPPMASRequestCommunicate.aspx?CCID=" + rowobject[0] + "'";
            break;
        case "WaitDeal":
            vUrl="'VWaitPPMASRequestDeal.aspx?CCID=" + rowobject[0] + "'";
            break;
        case "WaitAdjust":
            vUrl="'VWaitPPMASRequestAdjust.aspx?CCID=" + rowobject[0] + "'";
            break;
        case "WaitSave":
            vUrl="'VWaitPPMASRequestSave.aspx?CCID=" + rowobject[0] + "'";
            break;
        case "WaitLook":
            vUrl="'VWaitPPMASRequestLook.aspx?ID=" + rowobject[7] + "'";
            break;
    }

    return '<div class="nowrap"><a  href="#ShowDoc" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqWaitRequest\');">' + cellvalue + '</a></div>';
}

function btnLookList_Click()
{
    var vRType=getObj("hidRType").value;
    openAddWindow("VWaitPPMASRequestLookList.aspx?RType="+vRType, 0, 0, "jqWaitRequest");
}

function btnSaveList_Click()
{
    var vRType=getObj("hidRType").value;
    openAddWindow("VWaitPPMASRequestSateList.aspx?RType="+vRType, 0, 0, "jqWaitRequest");
}

function btnSerach_Click(jqgid)
{
    var ccState = getObj("ddlCCState").value;
    var projectID=getObj("ddlProject").value;
    var vKey=getObj("txtKW").value;
        
    $(jqgid,document).getGridParam('postData').CCState=ccState;
    
    $(jqgid,document).getGridParam('postData').ProjectID=projectID;
    $(jqgid,document).getGridParam('postData').KeyValue=vKey;
    
    var reg=new RegExp("#","g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg,""));
}

//批量阅读
function validateLookList()
{
    var vReqID = getJQGridSelectedRowsData('jqWaitRequestLookList',true,'KeyID');
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
    var vZBPID = getJQGridSelectedRowsID('jqWaitRequestSaveList', true);
    var vCCID = getJQGridSelectedRowsData('jqWaitRequestSaveList',true,'CCID');
    var vFlowID = getJQGridSelectedRowsData('jqWaitRequestSaveList',true,'FlowID');
    if (vZBPID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidSaveList").value = vZBPID;
    getObj("hidSaveCCID").value = vCCID;
    getObj("hidSaveFlowID").value = vFlowID;
    
    return true;
}