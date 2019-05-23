 /*
 * 版本信息：爱德软件版权所有
 * 模块名称：项目产品交付与材料部品标准的表单设计
 * 文件类型：MyPPMASRequest.js
 * 作    者：王勇
 * 时    间：2010-12-15 10:52:15
 */
 
 
//刷新数据
var refreshData=function(jqgid)
{
    var projectID = getObj("ddlProject").value;
    var vKey=$("#txtKey").val();
    
    if (jqgid == "#jqgMyRequest")
    {
        var ccState = getObj("ddlCCState").value;
        var meDoState = getObj("ddlMeDoState").value;
        var vStartTime=$("#txtStartTime").val();
        var vEndTime=$("#txtEndTime").val();
        var vAddClass=$("#ddlAddClass").val();
        var PPID=$("#hidPPID").val();
        
        if (vStartTime != "" && vEndTime != "")
        {
            startDate1 = vStartTime.split("-");
            endDate1 = vEndTime.split("-");
            var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
            var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
        
            if (date1 > date2)
            {
                return alertMsg("起草结束时间必须大于开始时间。", $("#txtEndTime"));
            }
        }
    
        $(jqgid,document).getGridParam('postData').MeDoState=meDoState;
        $(jqgid,document).getGridParam('postData').StartTime=vStartTime;
        $(jqgid,document).getGridParam('postData').EndTime=vEndTime;
        $(jqgid,document).getGridParam('postData').CCState=ccState;
        $(jqgid,document).getGridParam('postData').PPID=PPID;
        $(jqgid,document).getGridParam('postData').AddClass=vAddClass;
    }
    
    $(jqgid,document).getGridParam('postData').ProjectID=projectID;
    $(jqgid,document).getGridParam('postData').KeyValue=vKey;
    
    var reg=new RegExp("#","g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg,""));
}

var ddlProjectChange=function(jqgid)
{
    refreshData(jqgid);
}

var ddlMeDoState_Change=function(jqgid)
{
    refreshData(jqgid);
}
var btnSerach_Click=function(jqgid)
{
    refreshData(jqgid);
}
var ddlCCState_Change=function(jqgid)
{
    refreshData(jqgid);
}
var view=function(value)
{
    openWindow("VMyPPMASRequestBrowser.aspx?ID="+value,0,0);
} 
var viewRequest=function(value,pt,record)
{
    if(record[1]=="未发出")
    {
        var vRType=getObj("hidRType").value;
        var vUrl="'VMyPPMASRequestEdit.aspx?ID=" + record[0] + "&RType="+vRType+"&JQID=jqgMyRequest'";
        return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
    }
    var vUrl="'VMyPPMASRequestBrowser.aspx?ID=" + record[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}
 
 //选择项目投资分析阶段(新增)
var btnSelectPPID_Click=function()
{   
    if(getObj("ddlProject").value=="")
    {
        return alertMsg("请选择项目",getObj("ddlProject"));
    }
    var vValue=openModalWindow('../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID='+getObj("ddlProject").value, 800, 600);
    if(vValue!=null&&vValue!="")
    {
        getObj("hidPPID").value=vValue.split('|')[0];
        getObj("txtPPName").value=vValue.split('|')[1];
    }
    else
    {
        getObj("hidPPID").value="";
        getObj("txtPPName").value="";
    }
    return true;
}

// //选择项目投资分析阶段(新增)
//var btnSelectPPID_ClickEdit=function()
//{   
//    
//    var vValue=openModalWindow('../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID='+getObj("hidProjectID").value, 800, 600);
//    if(vValue!=null&&vValue!="")
//    {
//        getObj("hidPPID").value=vValue.split('|')[0];
//        getObj("txtPPName").value=vValue.split('|')[1];
//    }
//    else
//    {
//        getObj("hidPPID").value="";
//        getObj("txtPPName").value="";
//    }
//    return true;
//}
 
 //新增
 var addMyPPMASRequest=function()
 {
    var vRType=getObj("hidRType").value;
    openAddWindow("VMyPPMASRequestAdd.aspx?RType="+vRType,0,0,"jqgMyRequest");
 }
 
 //修改
 var revokeMyPPMASRequest=function()
 {
    openRevokeWindow("PPMASRequest","jqgMyRequest");
 }
 
 //删除
 var deleteMyPPMASRequest=function()
 {
    //彻底删除
    openDeleteWindow("DeletePeriodProjectMaterialAndStandardsAll", 4, "jqgMyRequest");
 }
 
 //变更
 var changeMyPPMASRequest=function()
 {
    var vRType=getObj("hidRType").value;
    var selectedRowsID=getJQGridSelectedRowsID("jqgMyRequest",true);
    var IsAllowChange=stripHtml(getJQGridSelectedRowsData("jqgMyRequest",false,"IsAllowChange"));
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
        openAddWindow("VMyPPMASRequestChange.aspx?ID="+selectedRowsID[0]+"&RType="+vRType,0,0,"jqgMyRequest");
    }
 }
 
 //---------------------------------编辑---------------------------------START
 
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

//登记类型改变
function rblIsNeedCheck_Change()
{
    var step=getObj("hidStep").value;
    if(rblIsNeedCheck.getElementsByTagName("input")[0].checked)
    {
    
        if(getObj("btnSaveClose_tb"))
        {
            getObj("btnSaveClose_tb").style.display="";
        }
        if(getObj("btnSaveOpen_tb"))
        {
            getObj("btnSaveOpen_tb").style.display="";
        }
        if(getObj("btnNext_tb"))
        {
            getObj("btnNext_tb").style.display="none";
        }
        if(getObj("trUrgency"))
        {
            getObj("trUrgency").style.display="none";
        }
    }
    else
    { 
        if(getObj("btnNext_tb"))
        {
            getObj("btnNext_tb").style.display="";
        }
        if(getObj("btnSaveOpen_tb"))
        {
            getObj("btnSaveOpen_tb").style.display=step=="1"?"":"none";
        }
        if(getObj("btnSaveClose_tb"))
        {
            getObj("btnSaveClose_tb").style.display=step=="1"?"":"none";
        }
        if(getObj("trUrgency"))
        {
            getObj("trUrgency").style.display="";
        }
    }
    
} 

//项目改变
var ddlProject_Change=function()
{
    if(ddlProject.value=="C")
    {
        ddlProject.selectedIndex=ddlProject.selectedIndex+1;
    }
    getObj("hidPPID").value="";
    getObj("hidPPName").value="";
    getObj("hlPPName").value="";
    return true;
}

//选择项目投资分析阶段
var btnSelectPP_Click=function()
{   
    if(ddlProject.value=="")
    {
        return alertMsg("请选择项目",ddlProject);
    }
    var vValue=openModalWindow('../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID='+ddlProject.value, 800, 600);
    if(vValue!=null&&vValue!=""&&vValue!="undefined")
    {
        if(getObj("hidPPID").value==vValue.split('|')[0])
        {
            return false;
        }        
        getObj("hidPPID").value=vValue.split('|')[0];
        getObj("hidPPName").value=vValue.split('|')[1];
        getObj("hlPPName").value=vValue.split('|')[1];
        getObj("txtPPSDRName").value=$("#ddlProject option:selected").text().replace("　　","")+getObj("hidPPName").value+new Date().Format("yyyy-MM-dd");
        
        return true;
    }
    else if(vValue=="")
    {
        getObj("hidPPID").value="";
        getObj("hidPPName").value="";
        getObj("hlPPName").value="";
        
        return true
    }    
    return false;
}
//选择项目投资分析阶段Edit
var btnSelectPP_ClickEdit=function()
{   
 
    var vValue=openModalWindow('../../Common/Select/CCMP/VSelectProjectPeriod.aspx?ProjectID='+getObj("hidProjectID").value, 800, 600);
    if(vValue!=null&&vValue!=""&&vValue!="undefined")
    {
        if(getObj("hidPPID").value==vValue.split('|')[0])
        {
            return false;
        }        
        getObj("hidPPID").value=vValue.split('|')[0];
        getObj("hidPPName").value=vValue.split('|')[1];
        getObj("hlPPName").value=vValue.split('|')[1];
        getObj("txtPPSDRName").value=getObj("txtProjectName").value+getObj("hidPPName").value+new Date().Format("yyyy-MM-dd");
        
        return true;
    }
    else if(vValue=="")
    {
        getObj("hidPPID").value="";
        getObj("hidPPName").value="";
        getObj("hlPPName").value="";
        
        return true
    }    
    return false;
}


var saveHtml=function()
{
    hidListHtml.value=tdColumn.innerHTML;
}

var getCustomFormList=function()
{
    //#FormID*ColID|ColValue
    var list="";
    var tds=tdColumn.getElementsByTagName("td");
    if(tds!=null)
    {      
        for(var i=0;i<tds.length;i++)
        {
            var id=tds[i].id;
            if(id!=null&&id!="")
            {
                var idarry=id.split('|');
                if(idarry[1]=="Y")
                {
                    list=list+"#"+idarry[0];
                    var colvalue="";
                    var obj=tds[i].parentNode.getElementsByTagName("input");
                    if(obj!=null)
                    {
                        var vMValue="";
                        var vColID="";
                        for(var j=0;j<obj.length;j++)
                        {
                            if(obj(j).type.toUpperCase()=="TEXT")
                            {
                                list=list+"*"+obj(j).id+"|"+obj(j).value;
                            }
                            else if(obj(j).type.toUpperCase()=="CHECKBOX")
                            {
                                if(vColID!=""&&vColID!=obj(j).name)
                                {
                                    if(vMValue.length>0)
                                    {
                                        vMValue=vMValue.substr(1);
                                    }
                                    list=list+"*"+vColID+"|"+vMValue;
                                    vMValue="";
                                }
                                if(obj(j).checked)
                                {
                                    vMValue=vMValue+","+obj(j).value;
                                    vColID=obj(j).name;
                                }
                            }                       
                        }
                        if(vMValue.length>0)
                        {
                            vMValue=vMValue.substr(1);
                            list=list+"*"+vColID+"|"+vMValue;
                        }                        
                    }
                    obj=tds[i].parentNode.getElementsByTagName("select");
                    if(obj!=null)
                    {
                        for(var j=0;j<obj.length;j++)
                        {
                            list=list+"*"+obj(j).id+"|"+obj(j).value;
                        }
                    }
                    obj=tds[i].parentNode.getElementsByTagName("textarea");
                    if(obj!=null)
                    {
                        for(var j=0;j<obj.length;j++)
                        {
                            list=list+"*"+obj(j).id+"|"+obj(j).value;
                        }
                    }
                }
            }
        }        
    }
    list=list.substr(1);    
    hidList.value=list; 
    return true;
}



var validate=function()
{
    if(ddlProject!=null)
    {
        if(ddlProject.value=="")
        {
            return alertMsg("请选择项目",ddlProject);
        }
    }
    if(getObj("txtPPSDRName").value=="")
    {
        return alertMsg("申请标题不能为空",getObj("txtPPSDRName"));
    }
    if(getObj("hidPPID").value==""||getObj("hlPPName").value=="")
    {
        return alertMsg("项目投资分析阶段不能为空",getObj("hlPPName"));
    }
    if(!getCustomFormList())
    {
        return false;
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
 
//------------------------------------------------------------------------END

//----------------------------调整----------------------------------start

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
    
    if(!getCustomFormList())
    {
        return false;
    }
    return true;
}

////////////////////////////////////////////////////////////////////////////end


//------------------------------------审核------------------------------start

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
//--------------------------------------------------------------------------------------------END

//----------------------------阅读验证
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

//修改时验证
var validateEdit=function()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    
    var vTitle = getObj("txtEditTitle").value;
    var vNo = getObj("txtEditNo").value;
    
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


//选择多部门（项目）
function selectMultiDeptByProject(aim)
{
    
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+aim+'&From=Project&CorpID='+ getObj('hidProjectID').value, 800, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}
//选择单岗位(项目)
function selectSingleStationByProject(aim)
{
    var url="../../Common/Select/OperAllow/VSelectSingleStation.aspx?From=Project&CorpID="+getObj('hidProjectID').value+"&Aim="+aim;
    var value = openModalWindow(url, 800, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}
