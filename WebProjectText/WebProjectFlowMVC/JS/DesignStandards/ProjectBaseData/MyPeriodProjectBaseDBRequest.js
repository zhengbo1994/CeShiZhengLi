// JScript 文件

 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：业务系统导航-设计标准-我的项目基础数据库
 * 文件类型：MyPeriodProjectBaseDBRequest.js
 * 作    者：马吉龙
 * 时    间：2010-12-16
 */
//搜索
var filterData=function()
{
    var ProjectID=getObj("ddlProject").value;
    var CCState=getObj("ddlCCState").value;
    var Key=getObj("txtKW").value;
    var meDoState = getObj("ddlMeDoState").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();
    var vIsNeedCheck = $("#ddlIsNeedCheck").val();
    var vPPID = $("#hidPPID").val();
    
    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
    
        if (date1 > date2)
        {
            return alertMsg("结束时间必须大于开始时间。", $("#txtEndTime"));
        }
    }
    addParamsForJQGridQuery("jqMyPeriodProjectBaseDBRequest",[{ProjectID:ProjectID,CCState:CCState,Key:Key,MeDoState:meDoState,StartTime:vStartTime,EndTime:vEndTime,IsNeedCheck:vIsNeedCheck,PPID:vPPID}]);
    refreshJQGrid("jqMyPeriodProjectBaseDBRequest");    
}

//新增
var addMyPeriodProjectBaseDBRequest=function()
{
    var ProjectID=getObj("ddlProject").value;
    openAddWindow("VMyPeriodProjectBaseDBRequestAdd.aspx?ProjectID="+ProjectID, 1000,800,"jqMyPeriodProjectBaseDBRequest");
}

//修改
var editMyPeriodProjectBaseDBRequest=function()
{
    var ProjectID=getObj("ddlProject").value;
    openModifyWindow("VMyPeriodProjectBaseDBRequestEdit.aspx?ProjectID="+ProjectID, 1000, 800, "jqMyPeriodProjectBaseDBRequest")
}

//删除
var delMyPeriodProjectBaseDBRequest=function()
{
    openDeleteWindow("DeleteMyPeriodProjectBaseDBRequestAll", 4, "jqMyPeriodProjectBaseDBRequest");
}
//变更
 var MyPeriodProjectBaseDBRequestChange=function()
 {
    var selectedRowsID=getJQGridSelectedRowsID("jqMyPeriodProjectBaseDBRequest",true);
    var IsAllowChange=stripHtml(getJQGridSelectedRowsData("jqMyPeriodProjectBaseDBRequest",false,"IsAllowChange"));
    if(selectedRowsID.length<1)
    {
        return alertMsg("没有选择任何记录");
    }
    else if(selectedRowsID.length>1)
    {
        return alertMsg("只能选择一条记录");
    }
    else if(IsAllowChange=="N")
    {
        return alertMsg("不能操作该数据");        
    }
    else if(IsAllowChange=="Y")
    {   
        openAddWindow("VMyPeriodProjectBaseDBRequestChange.aspx?ID="+selectedRowsID[0],0,0,"jqMyPeriodProjectBaseDBRequest");
    }
 }

//根据项目加载数据
  function ajaxDataGrid()
 {
        ajaxRequest('VMyPeriodProjectBaseDBRequestAdd.aspx?JQID=jqMyPeriodProjectBaseDBRequest',{ProjectID:getObj("ddlProject").value,ajax:'GetDtSubject'},'html',function(data,status){
            if(data!=null)
            {
                divData.innerHTML=data;
                
            }
        },false);
 }
 //撤销
var revokeMyPeriodProjectBaseDBRequest=function()
{
    openRevokeWindow("PeriodProjectBaseDBRequest","jqMyPeriodProjectBaseDBRequest");
}
//格式化名称

var renderName=function(value,pt,record)
{
    var ProjectID=getObj("ddlProject").value;
    var vUrl="'VMyPeriodProjectBaseDBRequestBrowse.aspx?ID=" + record[0] + "'";
    if(record[1]=="未发出")
    {
        var vUrl="'VMyPeriodProjectBaseDBRequestEdit.aspx?ID=" + record[0] +"&ProjectID="+ProjectID+"&JQID=jqMyPeriodProjectBaseDBRequest'";
        return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
    }
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}
//选择我的页面项目阶段文件
var selectPPValue=function()
{
    var ProjectID=getObj("ddlProject").value;
    if(ProjectID!=""){
        var SMR=openModalWindow("../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID="+ProjectID,800,600);
        if(SMR!=null&&SMR!="")
        {
            getObj("hidPPID").value=SMR.split('|')[0];
            getObj("hidPPName").value=SMR.split('|')[1];     
            getObj("hlPPName").value=SMR.split('|')[1]; 
        }
    }else{
        return alertMsg("请选择项目",getObj("ddlProject"));
        return false;
    }
    
    filterData();
    
    return true;
}
 
 //选择项目阶段文件
var selectPPID=function()
{
    var ProjectID=getObj("ddlProject").value;
    if(ProjectID!=""){
        var SMR=openModalWindow("../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID="+ProjectID,800,600);
        if(SMR!=null&&SMR!="")
        {
            getObj("hidPPID").value=SMR.split('|')[0];
            getObj("hidPPName").value=SMR.split('|')[1];     
            getObj("hlPPName").value=SMR.split('|')[1]; 
            getObj("txtPPBDBRName").value= getObj("hidProjectName").value+SMR.split('|')[1]+getObj("hidDate").value   
        }
    }else{
        return alertMsg("请选择项目",getObj("ddlProject"));
        return false;
    }
    return true;
}
//项目改变
var ddlProjectChange=function()
{
    var ddlProject=getObj("ddlProject");
    if(ddlProject.value=="C")
    {
        ddlProject.selectedIndex=ddlProject.selectedIndex+1;
        
    }
   
}
//计算得分
function sumScore(cosbsacid, parentcosbsacid)
{
    var dgData = getObj(getObj("hidDataGridClientID").value); 
    if (dgData != null)
    {
        var iSum = 0;
        var iPercent = 0;
        var txtParentValue = null;
        var txtParentZBETCID = null;
        for(var i = 1; i < dgData.rows.length; i++)
        {
            // 记录父节点
            if(getObjTR(dgData,i,"input",2).value==parentcosbsacid)
            {
                txtParentValue=getObjTR(dgData,i,"input",1);
                txtParentZBETCID=getObjTR(dgData,i,"input",3);
            }
            
            // 统计子节点
            if(getObjTR(dgData,i,"input",3).value==parentcosbsacid)
            {
                iSum+=getRound(getObjTR(dgData,i,"input",1).value,2);
            }
        }
        
        if (txtParentValue != null)
        {
            txtParentValue.value = iSum.toFixed(2);
            if (parentcosbsacid != "00000")
            {
                sumScore(parentcosbsacid, txtParentZBETCID.value);
            }
           
        }
    }
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
                getObj(areaName+'_desc').value += "送阅部门(系统)：" + getObj("txtLookStationNames").value
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
 function selectRow(obj)
{
    var row = obj.parentNode.parentNode;
    var table = row.parentNode.parentNode;
    if (obj.type.toLowerCase() == "checkbox")
    {
        row.className = obj.checked ? 'dg_rowselected' : (row.rowIndex % 2 == 1 ? 'dg_row' : 'dg_alternaterow');
        
        var chkAll = getObjTR(table, 0, "input", 0);
        if (chkAll != null && chkAll.type.toLowerCase() == "checkbox")
        {
            checkSelectAll(table);
        }
    }
    else if (obj.type.toLowerCase() == "radio")
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            table.rows(i).className = (table.rows(i).rowIndex % 2 == 1 ? 'dg_row' : 'dg_alternaterow');
        }
        row.className = 'dg_rowselected';
    }
    rowClass = row.className;    
    var selectIDs = "";    
    var chks = getObjs("chkIDV3");
    if(chks.length>0)
    {
        for(var i=0;i<chks.length;i++)
        {
            if(chks[i].checked)
            { 
                selectIDs += "," + chks[i].value;
            }
        }
    }            
  
}

//客户端验证
function validate()
{
    if (getObj("txtPPBDBRName").value == "")
    {
        return alertMsg("申请名称不能为空。", getObj("txtPPBDBRName"));
    }
  
    if (getObj("ddlProject").value == "")
    {
        return alertMsg("项目名称不能为空。", getObj("ddlProject"));
    }   
   
    if (getObj("hlPPName").value == "")
    {
        return alertMsg("项目投资阶段名称不能为空。", getObj("hlPPName"));
    }  
 
   var dgData = getObj(getObj("hidDataGridClientID").value); 
   var hidList=getObj("hidList");

        for(var i=1;i<dgData.rows.length;i++)
        {
       //PBDBIID#Qty#Remark
        hidList.value=hidList.value+"$"+getObjTR(dgData,i,"input",0).value+"#"+
                                        getObjTR(dgData,i,"input",1).value+"#"+                                        
                                        getObjTR(dgData,i,"textArea",0).value;     
        }

    if(hidList.value.length>0)
    {
        hidList.value=hidList.value.substr(1);
    }
    else
    {
         return alertMsg("不能没有项目投资阶段明细");
    } 
    if (!saveDocModel())
    {
        return alertMsg("正文文档保存失败。", getObj("chkUseDocModel"));
    }       
    return true;
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