// JScript 文件

var tbStation;

// 添加新的账户  
function addAccount()
{
    openAddWindow("VAccountAdd.aspx?CorpID="+$("#ddlCorp").val(), 650, 560, "jqGrid1");
}
// 修改账户资料
function modifyAccount()
{
    openModifyWindow("VAccountEdit.aspx?CorpID=" + $("#ddlCorp").val(), 650, 560, "jqGrid1")
}
// 查看USBKey
function openAccountToken()
{
    openModifyWindow("VAccountToken.aspx", 600, 400, "jqGrid1")
}
// 删除账户
function delAccount()
{
    openDeleteWindow("Account", 0, "jqGrid1");
}
// 设置账户
function setAccountStation()
{
    openModifyWindow("VAccountStationSet.aspx", 800, 500, "jqGrid1")
}
// 密码重置
function resetPwd()
{
    openResetPwdWindow("VAccountPwdReset.aspx", 400, 300, "jqGrid1");
}

//多密码修改
function openResetPwdWindow(url, width, height, jqGridID)
{
    if (jqGridID != null)
    {
        var ids;
        var vIsAllowEdit;
        
        ids = getJQGridSelectedRowsID(jqGridID, true);
        vIsAllowEdit = getJQGridSelectedRowsData(jqGridID, true, 'IsAllowEdit');
        
        if (ids == "" || ids.length == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }               
        if (stripHtml(vIsAllowEdit[0]) == "N")
        {
            return alertMsg("您不能修改该数据。");
        }
        url = addUrlParam(url, "JQID", jqGridID);
        if(ids.length > 1)
        {
            return alertMsg("您一次只能重置一个账号。");
        }
        
        url = addUrlParam(url, "ID", ids[0]);
        
//        if(ids.length > 1)
//        {
//            url = addUrlParam(url, "ID", ids.join(","));
//        }
//        else
//        {
//            url = addUrlParam(url, "ID", ids[0]);
//        }
	}
	openWindow(url, width, height);
}

function btnImport()
{
    openAddWindow("VAccountImport.aspx", 400, 300, "jqGrid1");
}

function ImportContacts()
{
    openAddWindow("VContactsImport.aspx", 400, 300, "jqGrid1");
}


//提交时验证输入的有效性
function validateSize()
{
    var txtUserName = document.all.txtUserName;
    var txtEmployeeNo = document.all.txtEmployeeNo;
    var txtEmployeeName = document.all.txtEmployeeName;
    var txtOfficeTel = document.all.txtOfficeTel;
    var txtMobile = document.all.txtMobile;
    var txtQQ = document.all.txtQQ;
    var txtMSN = document.all.txtMSN;
    var txtEmail = document.all.txtEmail;
    var txtRemark = document.all.txtRemark;    
    
    if (getObj("txtUserName").value == "")
    {
        return alertMsg("帐号名不能为空。", getObj("txtUserName"));
    }
    if (getObj("txtEmployeeName").value == "")
    {
        return alertMsg("员工姓名不能为空。", getObj("txtEmployeeName"));
    }
    if (getObj("txtEmployeeNo").value == "")
    {
        return alertMsg("员工编号不能为空。", getObj("txtEmployeeNo"));
    }       
    
    if(getObj("txtPwd1"))
    {
         if (getObj("txtPwd1").value != getObj("txtPwd2").value)
        {
            return alertMsg("密码和确认密码输入不一致。", getObj("txtPwd2"));
        }
        
        if(getObj("hidIsCheckPasswordStrength").value=="Y")
        {
             if(parseInt(getResult(getObj("txtPwd1").value))<2)
            {
                 return alertMsg("密码的强度不合规范，请使用中等强度以上密码。", getObj("txtPwd1"));
            }
        }
    }
    
    if($("#hidType").val() != "StationAccount") //新增岗位时新增账号不验证
    {
        getObj("hidStationList").value = "";
        getObj("hidDefaultStationID").value = "";
        for (var i = 1; i < tbStation.rows.length; i++)
        {
            var chk = getObjTR(tbStation, i, "input", 0);
            var rdo = getObjTR(tbStation, i, "input", 1);
            
            if (rdo.checked)
            {
                getObj("hidDefaultStationID").value = chk.value;
            }
            
            getObj("hidStationList").value += "," + chk.value;
        }
        if (getObj("hidStationList").value != "")
        {
            if (getObj("hidDefaultStationID").value == "")
            {
                return alertMsg("未设置默认岗位。", getObjTR(tbStation, 1, "input", 1));
            }
            getObj("hidStationList").value = getObj("hidStationList").value.substr(1);
        }
    }
    return true;
}

// 重置密码时的校验
function validatePwd()
{   
    if (getObj("txtPwd1").value != getObj("txtPwd2").value)
    {
        return alertMsg("密码和确认密码输入不一致。", getObj("txtPwd2"));
    }
    
    if(getObj("hidIsCheckPasswordStrength").value=="Y")
    {
         if(parseInt(getResult(getObj("txtPwd1").value))<2)
        {
             return alertMsg("密码的强度不合规范，请使用中等强度以上密码。", getObj("txtPwd1"));
        }
    }
    
    if (getObj("hidIsDoublePWDFroAdmin").value == "Y" && getObj("txtAccountName").value.toUpperCase() == "ADMIN" && getObj("txtAdminPwd1").value != getObj("txtAdminPwd2").value)
    {
        return alertMsg("二级密码和确认二级密码输入不一致。", getObj("txtAdminPwd2"));
    }
    
    if(getObj("hidIsCheckPasswordStrength").value=="Y" && getObj("hidIsDoublePWDFroAdmin").value == "Y" && getObj("txtAccountName").value.toUpperCase() == "ADMIN" )
    {
         if(parseInt(getResult(getObj("txtAdminPwd1").value))<2)
        {
             return alertMsg("密码的强度不合规范，请使用中等强度以上密码。", getObj("txtAdminPwd1"));
        }
    } 

    return true;
}

function validateSelfPwd()
{
    if (getObj("txtPwd1").value != getObj("txtPwd2").value)
    {
        return alertMsg("密码和确认密码输入不一致。", getObj("txtPwd2"));
    }
    
    if(getObj("hidIsCheckPasswordStrength").value=="Y")
    {
         if(parseInt(getResult(getObj("txtPwd1").value))<2)
        {
             return alertMsg("密码的强度不合规范，请使用中等强度以上密码。", getObj("txtPwd1"));
        }
    }
  
    return true;
}

// 表单显示隐藏控制
function setDisplay()
{
    if (tbStation)
    {
        trStation.style.display = (tbStation.rows.length > 1 ? "block" : "none");
    }
}

/* 刷新jqGrid */
function reloadData()
{
    $('#jqGrid1').getGridParam('postData').IsSetStation = getObj("ddlSetStation").value;
    $('#jqGrid1').getGridParam('postData').AllowLogin = getObj("ddlAllowLogin").value;
    $('#jqGrid1').getGridParam('postData').KW = getObj("txtKW").value;
    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').getGridParam('postData').DeptID = getObj("ddlDept").value;

    $('#jqGrid1').trigger('reloadGrid');
}

/* 帐号查看 */
function showAccount(cellvalue, options, rowobject)
{
    return '<a href="#ShowAccount" onclick="openWindow(\'VAccountInfoBrowse.aspx?AccountID=' + rowobject[0]+"&StruID="+rowobject[9] + '\',800,600)">' + cellvalue + '</a>' ;
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}

/* 切换公司加载部门 */
function resetDept()
{
    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetDeptByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadDept,
            error: ajaxError
        });
}

// 加载部门
function loadDept(data, textStatus)
{
    var ddlDept = getObj("ddlDept");
    for (var i = ddlDept.length - 1; i > 0; i--)
    {
        ddlDept.remove(i);
    }
    
    if (data.Count > 0)
    {
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name;
            ddlDept.add(opt, ddlDept.length);
        }
    }
    
    reloadData();
}

// 选择岗位
function selectStations()
{
    var cnt = tbStation.rows.length;
    
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableStation.aspx?Aim=AccountStation&Type=AddStation&CorpID='+$("#hidCorpID").val(), 700, 600);
    
    setDisplay();
    
    if (tbStation.rows.length > cnt)
    {
        setTableRowAttributes(tbStation);
    }
}

// 删除岗位
function delectStations()
{
    deleteTableRow(tbStation);
    
    setDisplay();
    
    setTableRowAttributes(tbStation);
}

// 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Setting":
            setAccountStation();
            break;
        case "Security":
            openAccountToken();
            break;
        case "Export":
            ajaxExport(location.href, "jqGrid1");
            break;
       case "Import":
            btnImport();
            break; 
        case "Edit":
            setPersonPortal();
            break;
        case "Clear":
            resetPwd();
            break;
        case "Manage":
            ImportContacts();
            break;
        case "Startup":
            btnEmployee_Click()
            break;
    }
}
// 页面初始化
function initPageInfo()
{
    if (getObj("hidStationHtml").value != "")
    {
        tdStation.innerHTML = getObj("hidStationHtml").value;
    }
    
//    document.forms[0].onsubmit = function()
//    {
//        getObj("hidStationHtml").value = tdStation.innerHTML;
//    }
    registerSubmitEvents(function()
    {
        getObj("hidStationHtml").value = tdStation.innerHTML;
    });
    
    tbStation = getObj(getObj("hidStationTableID").value);
    
    var hidSO = getObj("hidIsSaveOpen");
    if (hidSO != null)
    {
        if (hidSO.value == "Y")
        {
            clearTable(tbStation);
        }
        hidSO.value = "N";
    }
    
    setDisplay();
    
}

// 选中的选项卡索引
var selIndex = -1;

// 查看模式下切换选项卡
function showBrowseTab(index)
{
    selectTab(index, "BrowseInfo");
                
    for (var i = 0; i < 5; i++)
    {
        if (i != index)
        {
            getObj("info" + i).style.display = "none";
        }
    }
    
    var ifr = getObj("info" + index);
    ifr.style.display = "block";
    
    if (index > 0 && ifr.src == "")
    {
        var id = getObj("hidAccountID").value;
        var struID = getObj("hidStruID").value;
        switch (index)
        {
            case 1:
                ifr.src = "AccountInfo/VStationGroup.aspx?AccountID=" + id;
                break;
            case 2:
                ifr.src = "AccountInfo/VWarrantProject.aspx?AccountID=" + id;
                break;
            case 3:
                ifr.src = "../Permission/VWarrantOAOper.aspx?From=Browse&Aim=Account&ID=" + id+"&StruID="+struID;
                break;
            case 4:
                ifr.src = "AccountInfo/VWarrantAPModel.aspx?AccountID=" + id;
                break;
            case 5:
                ifr.src = "AccountInfo/VAuthorizedAccountSystem.aspx?AccountID=" + id;
                break;
        }
    }
    
    
    
    selIndex = index;
}

// 岗位查看
function showStation(stationID)
{
    openWindow("../../Station/VStationBrowse.aspx?StationID=" + stationID, 600, 450);
}

// 工作组查看
function showGroup(groupID)
{
    openWindow("../../Group/VGroupBrowse.aspx?GroupID=" + groupID, 500, 350);
}

// 项目查看
function showProject(projectID)
{
    openWindow("../../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + projectID, 600, 600);
}

// 数据授权查看
function showDataOper(projectID)
{  
    openWindow("../../Permission/VWarrantProjectOper.aspx?From=Browse&APID=&Aim=Account&ProjectID=" + projectID + "&ID=" + getObj("hidAccountID").value, 960, 650);
}

//pwStrength函数  
//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色  
function pwStrength(pwd)
{
    if(getObj("hidIsCheckPasswordStrength").value=="Y")
    {
        O_color="#eeeeee";  
        L_color="#FF0000";  
        M_color="#FF9900";  
        H_color="#33CC00";  
        if (pwd==null||pwd=='')
        {  
            Lcolor=Mcolor=Hcolor=O_color;  
        }  
        else
        {  
           // S_level=checkStrong(pwd);  
           S_level=getResult(pwd);
            
            switch(S_level) 
            {  
                case 0:  
                Lcolor=Mcolor=Hcolor=O_color;  
                case 1:  
                Lcolor=L_color;  
                Mcolor=Hcolor=O_color;  
                break;  
                case 2:  
                Lcolor=Mcolor=M_color;  
                Hcolor=O_color;  
                break;  
                default:  
                Lcolor=Mcolor=Hcolor=H_color;  
            }  
        }

        getObj("strength_L").style.background=Lcolor;  
        getObj("strength_M").style.background=Mcolor;  
        getObj("strength_H").style.background=Hcolor;  
    }
    
    return;  
}  

function getResult(s)
{ 

  if(s.length < 4)
  { 
     return 0; 
  } 
  
  var ls = 0; 
  if (s.match(/[a-z]/ig))
  { 
      ls++; 
  } 
  
  if (s.match(/[0-9]/ig))
  { 
      ls++; 
  } 
  
   if (s.match(/(.[^a-z0-9])/ig))
   { 
      ls++; 
  } 
  
  if (s.length < 6 && ls > 0)
  { 
      ls=0; 
  } 
  
  return ls
}
//人事资料设置
function btnEmployee_Click()
{
    openModifyWindow("../../IDOA/Employee/VEmployeeDetail.aspx", 0, 0, "jqGrid1");
}
