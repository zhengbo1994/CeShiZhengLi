// JScript 文件
// guobin  创建
//成本审批公用JS 只使用在审批中。 其他不要使用。
//这个JS 一定放在自己页面本身JS前
//  顺序如下
//  <script language="javascript" type="text/javascript" src="../../JS/IdeaSoft.js"></script>
//  <script language="javascript" type="text/javascript" src="../../JS/CCMP/Pubilc/Pubilc.js"></script>
//  <script 自己的js></script> //


function showBrowseTab(index,count)
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
        if ($("#ifrDocModel").length > 0 && !$("#ifrDocModel")[0].contentWindow.bDocOpen)
        {
            setVisible('areaOfficeDoc', trOfficeDoc);
        }
    }

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
    var projectID = getObj('hidProjectID') ? getObj('hidProjectID').value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+aim+'&From=Project&CorpID='+ projectID, 1100, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择多岗位（公司）
function selectMultiStationByCorp(aim)
{
    var corpID = getObj('hidCorpID') ? getObj('hidCorpID').value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+aim+'&CorpID=' + corpID, 1100, 600);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}


//选择多部门（项目）
function selectMultiDeptByProject(aim)
{
    var projectID = getObj('hidProjectID') ? getObj('hidProjectID').value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+aim+'&From=Project&CorpID='+ projectID, 1100, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择多部门（公司）
function selectMultiDeptByCorp(aim)
{
	var corpID = getObj('hidCorpID') ? getObj('hidCorpID').value : "";
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+aim+'&CorpID=' + corpID, 1100, 600);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择单岗位(项目)
function selectSingleStationByProject(aim)
{
	var projectID = getObj('hidProjectID') ? getObj('hidProjectID').value : "";
    var url="../../Common/Select/OperAllow/VSelectSingleStation.aspx?From=Project&CorpID="+projectID+"&Aim="+aim;
    var value = openModalWindow(url, 1100, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}
//选择单岗位(公司)
function selectSingleStationByCorp(aim)
{
	 var corpID = getObj('hidCorpID') ? getObj('hidCorpID').value : "";
    var url="../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID="+corpID+"&Aim="+aim;
    var value = openModalWindow(url, 1100, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}

//改变登记类型
//isUseThirdPartyCheck 好像是作废的
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

    getObj('btnSaveClose').style.display = isAddClass == "Y" ? "" : getObj('hidStep').value == "1" ? "" : "none";
    if(isUseThirdPartyCheck && isUseThirdPartyCheck.value=="Y")
    {
        var display = isUseThirdPartyCheck == 'Y'?"":"none";
        getObj("btnThirdCheck_tb").style.display = isAddClass == "Y" ? display:"none";
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
//调整成本
function selectSubjectAdjust()
{
    var url = "../../CCMP/Common/Select/VSelectSubjectAdjust.aspx?ProjectID=" + getObj('hidProjectID').value;

    var returnValue = openModalWindow(url,800,600,0,1,1);
    if(returnValue != "" && returnValue != "undefined" && returnValue != null)
    {
        getObj('hidSAID').value = returnValue.split('|')[0];
        getObj('hrSAName').value = returnValue.split('|')[1];
    }

    return false;
}

//调整校验 需要重写
function submitAdjust()
{
    return customFormCheckValidate();
}
//处理校验 需要重写
function submitDeal()   
{
    return customFormCheckValidate();
}
//沟通校验 需要重写
function submitCommunicate()   
{
    return customFormCheckValidate();
}
//审批校验 需要重写
function submitCheck()   
{
    return customFormCheckValidate();
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

//调整提交验证密码
function validateAdjust()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);
    if(!submitAdjust())
    {   
        return false;
    }
    
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
    
    if ($("#hidStep").val() == "1" && getObj("hidFormID").value != ""  && (!formValidate()))
    {
        setPageBtnEnabled(true);
        return false;
    }
    return true;
}
//拆分校验
function validateAllot()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    
    var isReAppoint = getObj('rblIsReAppoint');
    if(isReAppoint != null && getRadioValue(isReAppoint) == "Y")
    {
        var stationID = getObj('hidSubjectReSetAllotStationID');
        var stationName = getObj('txtSubjectReSetAllotStation');
        if(stationID.value == "" || stationName.value == "")
        {
            setBtnEnabled(getObj("btnSubmit"), true);
            return alertMsg("请指派拆分人。", getObj('btnSelectAllotStation'));
        }
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
    if ($("#hidStep").val() == "1" && getObj("hidFormID").value != ""  && (!formValidate()))
    {
            setPageBtnEnabled(true);
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
    var url="../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ID=" + cdID;
    openWindow(url,800,600);
}
function showProject(projectID)
{
    openWindow("../Project/VProjectBrowse.aspx?ProjectID="+projectID,600, 600);
}
//合同
function showContract(contractID)
{  
    openWindow("../Contract/VMyContractHaveSave.aspx?ContractID="+contractID,screen.availWidth, screen.availHeight);
}
//合同奖惩
function showContractSanction(caaomID)
{
    openWindow('../ContractSanction/VContractSanctionBrowse.aspx?CAAOMID='+caaomID,800,600);
}
// 其他变更
function showDesignChange(dcID)
{
    openWindow('../DesignChange/VDesignChangeBrowse.aspx?DCID='+dcID,800,600);
}
//现场签证
function showLocalityChange(lcID)
{
    openWindow('../LocalityChange/VLocalityChangeBrowse.aspx?LCID='+lcID,800,600);
} 
//设计变更
function showDesignAlterChange(daid)
{
    openWindow('../DesignAlter/VMyDesignAlterBrowse.aspx?DAID='+daid,800,600);
}
//资金收入申请
function showIncomeRequest(irID)
{
    openWindow('../IncomeRequest/VIncomeRequestBrowse.aspx?IRID='+irID,800,600);
}
//合同结算
function showSettlement(sID)
{
    openWindow('../Settlement/VSettlementBrowse.aspx?SID='+sID,800,600);
}  
//进度款审核  
function showEstimate(eID)
{
    openWindow("../Estimate/VEstimateBrowse.aspx?EID="+eID,800,600);
} 
// 付款申请
function showPayRequest(prID)
{
    openWindow("../PayManage/VPayRequestBrowse.aspx?PRID="+prID,800,600);
}
// 付款
function showPay(pID)
{
    openWindow("../Pay/VPayBrowse.aspx?PID="+pID,800,600);
}
//供应商
function showCOSName(cosID)
{
    openWindow('../../Supplier/CustomerOrSupplier/VCustomerOrSupplierBrowse.aspx?COSID='+cosID,1000,800);
}


//工程进度
function showProjectProgress(prID)
{  
    openWindow("../ProjectProgress/VProgressBrowse.aspx?PRID="+prID,800,600);
}
//合同进度
function showContractProgress(ppID)
{  
    openWindow("../ProjectProgress/VContractProgressBrowse.aspx?PPID="+ppID,800,600);
}
//function showEvaluation(cosID)
//{
//    openWindow("../Contract/VMyContractHaveSave.aspx?ContractID="+cosID,screen.availWidth, screen.availHeight);
//}
//function showPayGist(cosID)
//{
//    openWindow("../Contract/VMyContractHaveSave.aspx?ContractID="+cosID,screen.availWidth, screen.availHeight);
//}
//招标计划
function showZBiddingPlan(zbpID)
{
    openWindow("/" + rootUrl + "/ZBidding/NewZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID="+zbpID,screen.availWidth, screen.availHeight);    
}
//调整成本
function showSAName(saID)
{
    openWindow("../AdjustCost/VSubjectAdjustBrowse.aspx?ID=" + saID,600, 400);    
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
    var url = "../../CCMP/Common/Select/VSelectSingleContract.aspx?Action=" + aim + "&ProjectID=" + projectID;

    var returnValue = openModalWindow(url, screen.availWidth, screen.availHeight, 0, 1, 1);
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
    for(var j = cnt; j > 0; j--)
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
    if (fm_validate)
    {
        if (!fm_validate())
        {
            setBtnEnabled(getObj("btnSubmit"), true);
            return false;
        }
    }
    return true;
}
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

//选择检查
function checkSelect(jqGridID,singleFlag)
{
    var ids="";
    if(jqGridID)
    {
        ids = getJQGridSelectedRowsID(jqGridID, true);
        
        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }
        if(singleFlag)
        {
            if (ids.length > 1)
            {
                return alertMsg("您一次只能操作一条记录。");
            }    
        }
    }
    return ids;
}

//搜索 按一条一条搜索(仅支持列表模板页即其上层是<div id="divMPList">)
//start:起始行;keyword 关键字;table 搜索的表格对象
//cellNums:搜索的表格列数组，如{0,1}代表搜索0列1列
//headRowNum:表头行数
//noHead:是否无表头
//tableType:jqgrid，null为普通表格
function search(start,keyWord,table,cellNums,headRowNum,noHead,tableType)
{
    //jqGrid无表头第一行数据行从0开始
    var first=noHead==true?0:1;
    if(keyWord==""||table==null||cellNums==null||cellNums.length==0)
        return 0;
    for(var i=start;i<table.rows.length;i++)
    {
        for(var j=0;j<cellNums.length;j++)
        {   
            if(cellNums[j]<table.rows[i].cells.length)
            {
                if(stripHtml(table.rows[i].cells[cellNums[j]].innerHTML).indexOf(keyWord)!=-1)
                {
                    setSearchSelect(table,tableType,i,start);
                    setScrollTop(table.rows[i],headRowNum);
                    return i;
                }
            }
        }
    }
    return start!=first?search(first,keyWord,table,cellNums,headRowNum,noHead,tableType):first-1;
}

function setSearchSelect(table,tableType,rowIndex,start)
{
    if(tableType!=null) tableType=tableType.toLowerCase();
    if(tableType=="jqgrid")
    {
        table.rows[rowIndex].click();
        return;
    }
    var selRow=$("tr[class='dg_rowselected']",$(table));
    selRow.removeClass("dg_rowselected");
    selRow.addClass((start-1) % 2 == 1 ? 'dg_row' : 'dg_altrow');
    table.rows[rowIndex].className='dg_rowselected'
}

function setScrollTop(row,headRowNum)
{
    var height = $(row).height();
    if(headRowNum==null)
        headRowNum=1;
    getObj("divMPList").scrollTop = row.children(0).offsetTop - height * headRowNum;
}


//参数otherHid：目前仅用于付款登记，其它情况仅传type
function hidWhenOneCoin(type,otherHid)//只有1种货币时
{
     if(getObj("hidIsOneCoin").value=="1"||getObj("hidIsOneCoin").value=="0") 
     {
        switch(type)
        {
            case "contract":
                    if(getObj("hidIsOneCoin").value=="0")  //contract(add edit)页
                    {
                        if(ddlSignCoin.length==2) 
                        {
                            getObj("tbSignCoinAndAmount").rows(0).style.display="none"; 
                            getObj("tbOther").style.display="none";
                        }
                    }
                    else  //contract其它页
                    {
                        getObj("tbSignCoinAndAmount").rows(0).style.display="none"; 
                        getObj("tbOther").style.display="none";
                    }
                    break;
             case "saction":
                    getObj("tbSignCoinAndAmount").rows(0).style.display="none"; 
                    getObj("tbOther").style.display="none";
                    break;
            case "design":
            case "locality":
                    if(getObj("hidCheckOrOther").value=="check") //check页 
                    {
                        getObj("tbSignCoinAndAmount").rows(0).style.display="none";
                        getObj("tbOther").style.display="none";
                    }
                    else //其它页
                    {
                        getObj("tbSignBrowse").rows(0).style.display="none";
                        getObj("tbSignBrowseOther").style.display="none";
                    }
                    break;
             case "estimate":  
                   getObj("tbSignCoinAndAmount").rows(0).style.display="none"; 
                   getObj("tbOther").rows(0).style.display="none";
                   getObj("tbOther").rows(1).style.display="none";
                    break;
            case "settlement":
                    if(getObj("trSignCoin").style.display!="none") 
                    {
                        getObj("trSignCoin").style.display="none";
                    }
                    $("tr[id='trSetelment'] > td")[0].style.display="";
                    $("tr[id='trSetelment'] > td")[1].style.display="none";
                    $("tr[id='trSetelment'] > td")[2].style.display="none";
                    break;
             case "payRequest":
                    if(getObj("hidCheckOrOther").value=="check") //check页
                    {
                        $("table[id='tbSignCoinAndAmount'] tr:first")[0].style.display="none";
                        $("table[id='tbOther']")[0].style.display="none";
                    }
                    else
                    {
                        $("table[id='tbSignBrowse'] tr:first")[0].style.display="none";
                        $("table[id='tbSignBrowseOther']")[0].style.display="none";
                    }
                    break;
              case "pay": 
                        //getObj("tbAcount").rows(2).style.display="none"; 
                        //getObj("tbAcount").rows(3).style.display="none"; 
                        //if(otherHid=='N')
                        //{
                        //    $("#trPayPrepareMan").css('display','none'); //隐藏付款调配人
                        //    $("#trPay").css('display','none');//隐藏付款调配说明
                        //}
                     break; 
        }
     }
 }

function showContactClass(ProjectID,CCID)
{
    openWindow('../Contract/ContractClass/VContractClassBrowse.aspx?BasicCCID=' + CCID + '&ProjectID=' + ProjectID, 1000, 600);
}

function hidFirstCell(table) //当只有表头时候，隐藏第一列
{
    var tableName=table;
    if(tableName.rows.length==1) 
    {
        tableName.rows(0).style.display="none";
    }

}



//供应商排序 add by lisj 2016-5-10
function sortTaxInfo(obj1, obj2)
{
    if (obj1.SupID > obj2.SupID)
        return 1;
    if (obj1.SupID < obj2.SupID)
        return -1;
    if (obj1.SupID == obj2.SupID)
    {
        if (obj1.IndustryName > obj2.IndustryName)
            return 1;
        if (obj1.IndustryName < obj2.IndustryName)
            return -1;

        if (obj1.IndustryName == obj2.IndustryName)
        {
            if (obj1.taxRate > obj2.taxRate)
                return 1;
            if (obj1.taxRate < obj2.taxRate)
                return -1;
            if (obj1.taxRate == obj2.taxRate)
            {
                if (obj1.NoteTypeName > obj2.NoteTypeName)
                    return 1;
                if (obj1.NoteTypeName < obj2.NoteTypeName)
                    return -1;
            }
        }

        return 0;
    }
    return 0;
}

function validateTaxDetailsTaxResult(taxDetailsTax)
{
    var invalidMsg = "";
    //判断是否存在相同的值
    $(taxDetailsTax).each(function (i)
    {

        for (var i = 0; i < taxDetailsTax.length; i++)
        {
            if (i + 1 < taxDetailsTax.length)
            {
                if (taxDetailsTax[i].SupID == taxDetailsTax[i + 1].SupID)
                {
                    if (taxDetailsTax[i].IndustryName == taxDetailsTax[i + 1].IndustryName && taxDetailsTax[i].TaxRate == taxDetailsTax[i + 1].TaxRate && taxDetailsTax[i].NoteTypeName == taxDetailsTax[i + 1].NoteTypeName)
                    {
                        invalidMsg = "供应商：" + taxDetailsTax[i].SupName + "，行业类型：" + taxDetailsTax[i].IndustryName + "，税率：" + taxDetailsTax[i].TaxRate * 100 + "%，票据类型：" + taxDetailsTax[i].NoteTypeName + "的数据重复,请重新选择。";
                        break;
                    }
                }
            }
        }
        return false;
    });
    return invalidMsg;
}
