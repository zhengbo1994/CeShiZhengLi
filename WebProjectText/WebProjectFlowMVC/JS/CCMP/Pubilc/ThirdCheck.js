// JScript 文件
// guobin  创建
//成本审批公用JS 只使用在审批中。 其他不要使用。
//这个JS 一定放在自己页面本身JS前
//  顺序如下
//  <script language="javascript" type="text/javascript" src="../../../JS/IdeaSoft.js"></script>
//  <script language="javascript" type="text/javascript" src="../../../JS/CCMP/Pubilc/Pubilc.js"></script>
//  <script 自己的js></script> 


function showBrowseTab(index,count)
{
    
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");          
    for (var i = 0; i < count; i++)
    {                
        getObj("div" + i).style.display = "none";
    }                                                             
    getObj("div" + index).style.display = "block";
}

function showCheckTab(index,count)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
        
    for (var i = 0; i < count; i++)
    {                
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";
    setVisible('areaBasicInfo', trBasicInfo);
    if (index == 0)
    {    
        setVisible('areaFileInfo', trFileInfo);
        setVisible('areaOfficeDoc', trOfficeDoc);
        setVisible('areaLookInfo', trLookInfo); 
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
            if (getObj("txtSystemLookStation") != null && getObj("txtSystemLookStation").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅岗位(系统)：" + getObj("txtSystemLookStation").value
            }
            
            if (getObj("txtSystemLookDept") != null && getObj("txtSystemLookDept").value != "")
            {
                if (getObj(areaName+'_desc').value != "")
                {
                    getObj(areaName+'_desc').value += "；";
                }
                getObj(areaName+'_desc').value += "送阅部门(系统)：" + getObj("txtSystemLookDept").value
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


//选择多岗位(项目)
function selectMultiStationByProject(aim)
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim='+aim+'&From=Project&CorpID='+ getObj('hidProjectID').value, 900, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择多岗位（公司）
function selectMultiStationByCorp(aim)
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim='+aim+'&CorpID=' + getObj('hidCorpID').value, 900, 600);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}


//选择多部门（项目）
function selectMultiDeptByProject(aim)
{
    
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiDept.aspx?Aim='+aim+'&From=Project&CorpID='+ getObj('hidProjectID').value, 900, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择多部门（公司）
function selectMultiDeptByCorp(aim)
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiDept.aspx?Aim='+aim+'&CorpID=' + getObj('hidCorpID').value, 900, 600);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择单岗位(项目)
function selectSingleStationByProject(aim)
{
    var url="../../../Common/Select/OperAllow/VSelectSingleStation.aspx?From=Project&CorpID="+getObj('hidProjectID').value+"&Aim="+aim;
    var value = openModalWindow(url, 900, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}
//选择单岗位(公司)
function selectSingleStationByCorp(aim)
{
    var url="../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID="+getObj('hidCorpID').value+"&Aim="+aim;
    var value = openModalWindow(url, 900, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}

//改变登记类型
function changeCheck(isAddClass,isUseThirdPartyCheck)
{
    getObj('trUrgency').style.display = isAddClass == "Y" ? "none":"";
    
//    if(getObj('trDocFormat')!=null)
//    {
//        getObj('trDocFormat').style.display = isAddClass == "Y" ? "":"none";
//    }
    if(getObj('btnNext')!=null)
    {
        getObj('btnNext_tb').style.display = isAddClass == "Y" ? "none":getObj('hidStep').value == "1" ? "none":"";
        getObj('btnNext').style.display = isAddClass == "Y" ? "none":getObj('hidStep').value == "1" ? "none":"";
    }
    if(getObj('btnSaveOpen_tb')!=null)
    {
        getObj('btnSaveOpen_tb').style.display = isAddClass == "Y" ? "":getObj('hidStep').value == "1" ?"":"none";
        getObj('btnSaveOpen').style.display = isAddClass == "Y" ? "":getObj('hidStep').value == "1" ?"":"none";   
    }
    getObj('btnSaveClose_tb').style.display = isAddClass == "Y" ? "":getObj('hidStep').value == "1"?"":"none";
   
    getObj('btnSaveClose').style.display = isAddClass == "Y" ? "":getObj('hidStep').value == "1"?"":"none";
    if(isUseThirdPartyCheck)
    {
        var display=isUseThirdPartyCheck=='Y'?"":"none";
        getObj("btnThirdCheck_tb").style.display=isAddClass=="Y"?display:"none";
    }

}
//改变岗位
function changeStation()
{
    var stationID = getObj('ddlStation').value;
    if(stationID != "")
    {
        getObj('hidStationID').value = stationID.split('|')[0];
        getObj('hidCorpID').value = stationID.split('|')[1];
        getObj('hidPositionLevel').value = stationID.split('|')[2];
    }
    else
    {
        getObj('hidStationID').value = "";
        getObj('hidCorpID').value = "";
        getObj('hidPositionLevel').value = "";
    }
}


//调整校验 需要重写
function submitAdjust()
{  
    submitContent();//这个是调整控件里的。
    return true;
}
//处理校验 需要重写
function submitDeal()   
{  
    customFormCheckValidate();
    return true;
}
//沟通校验 需要重写
function submitCommunicate()   
{  
    customFormCheckValidate();
    return true;
}
//审批校验 需要重写
function submitCheck()   
{  
    customFormCheckValidate();
    return true;
}
//处理提交验证密码
function validateDeal()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    if(!submitDeal())
    {   
        return false;
    }
    
    var left = (screen.width - 350)/2;
    var top = (screen.height - 170)/2;
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
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

//沟通提交验证密码
function validateCommunicate()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    if(!submitCommunicate())
    {   
        return false;
    }
    
    var left = (screen.width - 350)/2;
    var top = (screen.height - 170)/2;
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
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

//审核提交验证密码
function validateCheck()
{
    if (getObj('tdRequiredlblCheckTitle') && getObj('tdRequiredlblCheckTitle').style.display != "none" && trim(getObj("txtCheckDescription").value) == "")
    {
        return alertMsg("请填写审核/处理意见。");
    }
    setBtnEnabled(getObj("btnSubmit"), false);
    if(!submitCheck())
    {   
        return false;
    }
    
    var left = (screen.width - 350)/2;
    var top = (screen.height - 170)/2;
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
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

//调整提交验证密码
function validateAdjust()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);
    if(!submitAdjust())
    {   
        return false;
    }
    
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
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
//拆分校验
function validateAllot()
{
    setBtnEnabled(getObj("btnSubmit"), false);

    var left = (screen.width - 350)/2;
    var top = (screen.height - 170)/2;
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);	
    if (result == "Cancel" || result == "undefined" || result == null || result == "No")
    {
        if (result == "No")
        {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    return true;
}
//送阅校验
function validateLook()
{
    setBtnEnabled(getObj("btnSuggest"), false);
    
    var vSuggest = getObj("txtLookRemark").value;
    
    if (vSuggest == "")
    {
        if(!window.confirm("你没有填写阅读意见，确定标为已阅吗？"))
        {
            setBtnEnabled(getObj("btnSuggest"), true);
            getObj("txtLookRemark").focus();
            return false;
        }
    }
    
    return true;
}

//浏览页 
function showDoc(cdID)
{    
    var url="../../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ID=" + cdID;
    openWindow(url,800,600);
}
function showProject(projectID)
{
    openWindow("../../Project/VProjectBrowse.aspx?ProjectID="+projectID,600, 600);
}
//合同
function showContract(contractID)
{  
    openWindow("../../Contract/VMyContractHaveSave.aspx?ContractID="+contractID,screen.availWidth, screen.availHeight);
}
//合同奖惩
function showContractSanction(caaomID)
{
    openWindow('../../ContractSanction/VContractSanctionBrowse.aspx?CAAOMID='+caaomID,800,600);
}
// 其他变更
function showDesignChange(dcID)
{
    openWindow('../../DesignChange/VDesignChangeBrowse.aspx?DCID='+dcID,800,600);
}
//现场签证
function showLocalityChange(lcID)
{
    openWindow('../../LocalityChange/VLocalityChangeBrowse.aspx?LCID='+lcID,800,600);
}
//合同结算
function showSettlement(sID)
{
    openWindow('../../Settlement/VSettlementBrowse.aspx?SID='+sID,800,600);
}  
//进度款审核  
function showEstimate(eID)
{
    openWindow("../../Estimate/VEstimateBrowse.aspx?EID="+eID,800,600);
} 
// 付款申请
function showPayRequest(prID)
{
    openWindow("../../PayManage/VPayRequestBrowse.aspx?PRID="+prID,800,600);
}
// 付款
function showPay(pID)
{
    openWindow("../../Pay/VPayBrowse.aspx?PID="+pID,800,600);
}
//供应商
function showCOSName(cosID)
{
    openWindow('../../../Supplier/CustomerOrSupplier/VCustomerOrSupplierBrowse.aspx?COSID='+cosID,800,600);
}
//工程进度
function showProjectProgress(prID)
{  
    openWindow("../../ProjectProgress/VProgressBrowse.aspx?PRID="+prID,800,600);
}
//合同进度
function showContractProgress(ppID)
{  
    openWindow("../../ProjectProgress/VContractProgressBrowse.aspx?PPID="+ppID,800,600);
}

//招标计划
function showZBiddingPlan(zbpID)
{
    openWindow("../../../ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID="+zbpID,screen.availWidth, screen.availHeight);    
}
//调整成本
function showSAName(saID)
{
    openWindow("../../AdjustCost/VSubjectAdjustBrowse.aspx?ID=" + saID,600, 400);    
}

//选择单个合同
function selectSingleContractByProject(aim)
{
    var projectID = getObj('hidProjectID').value;
    if(projectID == "")
    {
        return alertMsg("选择项目。", getObj("ddlProjectName"));
    }
    var contractID = getObj('hidContractID').value;
    var url="../../../Common/Select/CCMP/VSelectSingleContract.aspx?Action="+aim+"&ProjectID=" + projectID;

    var returnValue = openModalWindow(url,800,600,0,1,1);
    if(returnValue == "" || returnValue == "undefined" || returnValue == null)
    {
        return false;
    }

    getObj('hidContractID').value = returnValue.split('|')[0];
    getObj('hrContractName').value = returnValue.split('|')[1];

    if(contractID == getObj('hidContractID').value)
    {
        return false;
    }
    changeContract();
    if(getObj('hidContractID').value=="")
    {
        return false;
    }
    return true;
}

//合同改变
function changeContract() //需要重写
{

}

// 选择 成本拆分人
function btnSelectAllotStation(aim)
{
    var contractID = getObj('hidContractID').value;
    if(contractID == "")
    {
        return alertMsg("选择合同。", getObj("btnContractName"));    
    }
    selectSingleStationByProject(aim);
}
function  changeCreatorAllot()
{
    if(getObj('chkIsCreatorAllot').checked)
    {
        getObj('txtCostAllotStation').value = "";
        getObj('hidCostAllotStationID').value = "";
        getObj('btnSelectCostAllotStation').disabled = true;
    }
    else
    {
        getObj('btnSelectCostAllotStation').disabled = false;
    }
}

//改变项目
function changeProject() //需要重写
{
    getObj('hidProjectID').value = getObj('ddlProjectName').value;
}
//清除表
function clearTable(table)
{
    var cnt = table.rows.length - 1;
    for(var i = cnt; i > 0; i--)
    {
        table.deleteRow(i);
    }
}
//删除选中行
function delTableSelected(table)
{
    var cnt = table.rows.length - 1;
    for(j = cnt; j > 0; j--)
    {
        
        if (getObjTR(table, j, "input", 0).checked)
        {
            table.deleteRow(j);      
        }
    }
    getObjTR(table, 0, "input", 0).checked = false;
}

function setPageBtnEnabled(bool)
{
    setBtnEnabled(getObj("btnNext"), bool);
    setBtnEnabled(getObj("btnSave"), bool);
    setBtnEnabled(getObj("btnSaveOpen"), bool);
    setBtnEnabled(getObj("btnSaveClose"), bool);
    setBtnEnabled(getObj("btnSaveClose"), bool);
    setBtnEnabled(getObj("btnThirdCheck"), bool);  
}
function showThirdCheck(action)
{
    var url = getObj('hidThirdPartyUrl').value + "&Action=" + action;
    openWindow(url, 800, 600);      
}

//自定义表单 新增 修改
function customFormCreateValidate()
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
    
    getObj("hidDocCustomFormID").value = vCustomFormID;
    getObj("hidDocCustomFormValue").value = vCustomFormValue;
    
    getObj("hidDocCustomFormCheckID").value = vCheckID;
    getObj("hidDocCustomFormCheckValue").value = vCheckValue;
    
    return true;
}
//自定义表单  审批 调整 处理 沟通 归档 等等
//function  customFormCheckValidate()
//{
//        // 获取自定义表单数据
//    var vCustomFormID = "";
//    var vCustomFormValue = "";
//    
//    var vCheckID = "";
//    var vCheckValue = "";
//    
//    if (getObj("tableContent") != null)
//    {
//        $("#tableContent select").each(function(){
//            var vID=$(this).attr('id');
//            var vValue = $(this).val();
//            
//            vCustomFormID += "|" + vID;
//            vCustomFormValue += "|" + vValue;
//        });
//        
//        $('#tableContent input').each(function(){
//            // 文本框，非只读才记录
//            if ($(this).attr('type') == "text" && !$(this).attr('readonly'))
//            {
//                var vID=$(this).attr('id');
//                var vValue=$(this).val();
//                
//                vCustomFormID += "|" + vID;
//                vCustomFormValue += "|" + vValue;
//            }
//            else if ($(this).attr('type') == "checkbox")
//            {
//                if ($(this).attr('checked'))
//                {
//                    var vID=$(this).attr('id');
//                    var vValue=$(this).val();
//                    
//                    // 记录的是FidleID
//                    vCheckID += "|" + vID;
//                    vCheckValue += "|" + vValue;
//                }
//            }
//        });
//        
//        if (vCustomFormID != "")
//        {
//            vCustomFormID = vCustomFormID.substr(1);
//            vCustomFormValue = vCustomFormValue.substr(1);
//        }
//        
//        if (vCheckID != "")
//        {
//            vCheckID = vCheckID.substr(1);
//            vCheckValue = vCheckValue.substr(1);
//        }
//    }
//    
//    getObj("hidCustomFormID").value = vCustomFormID;
//    getObj("hidCustomFormValue").value = vCustomFormValue;
//    
//    getObj("hidCustomFormCheckID").value = vCheckID;
//    getObj("hidCustomFormCheckValue").value = vCheckValue;
//    return true;
//}

//自定义表单  审批 调整 处理 沟通 归档 等等
function customFormCheckValidate()
{
    if (getObj("hidFormID") && getObj("hidFormID").value!="" && (!formValidate()))
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    return true;
}

function openRelateWindow(jqGridID,realOption)
{
    var url="/" + rootUrl + "/CCMP/Public/VRelateDetail.aspx?Action=Relate&RealOption="+realOption;
    var ids;
    if(jqGridID!=null)
    {
        ids = getJQGridSelectedRowsID(jqGridID, true);
    }

    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 1)
    {
        return alertMsg("您一次只能操作一条记录。");
    }
                    
    url = url + "&JQID=" + jqGridID + "&RealID=" + ids[0];
    
    openModalWindow(url,900,700);

}
