// JScript 文件
/*******************************列表页面使用**************************************/
/* 刷新jqGrid */
function reloadData()
{    
    var jqObj=$('#jqMyApply');
    var sCCState=$('#ddlCCState').val();
    var sKey=$('#txtKW').val();    
    var meDoState = getObj("ddlMeDoState").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();
    var sCorpID=$('#ddlCorp').val();
    var ExamID = $("#ddlExamPlan").val();
    if(vStartTime.length>0 && vEndTime.length>0)
    {
        if(compareDate(vStartTime,vEndTime)==-1)      
        {
            return alertMsg('结束日期必须大于开始日期',$("#txtEndTime"));
        }
    } 
    jqObj.getGridParam('postData').CCState=sCCState;
    jqObj.getGridParam('postData').KeyWord=sKey;
    jqObj.getGridParam('postData').CorpID=sCorpID;
    jqObj.getGridParam('postData').ExamID=ExamID;
    jqObj.getGridParam('postData').meDoState=meDoState;
    jqObj.getGridParam('postData').StartTime=vStartTime;  
    jqObj.getGridParam('postData').EndTime=vEndTime; 
    jqObj.trigger('reloadGrid');
}

//增加维护
function addApproval()
{
    openAddWindow("VMyPerformanceApprovalAdd.aspx", 0, 0, "jqMyApply");
}

//删除
function DeleteApproval()
{
    openDeleteWindow("CachetRequest", 1, "jqMyApply");   
}
//维护标题
function renderApplyTitle(cl,opt,rl)
{     
    if(rl[0]=='未发出')
    {
        var url = "'VMyPerformanceApprovalEdit.aspx?ReqID=" +opt.rowId + "&JQID=jqMyApply'";
         return '<div class=\"nowrap\"><a  href="#EditCheckDoc" onclick="javascript:openWindow(' + url + ',0, 0)">' + cl + '</a></div>' ;
    }
    else
    {
        return "<div class=\"nowrap\"><a href=\"javascript:openWindow('VMyPerformanceApprovalBrowse.aspx?JQID=jqMyApply&CCID="+rl[8]+"',0,0);\">"+cl+"</div>";
    }  
}
/*******************************列表页面使用**************************************/


/*******************************Add、Edit页面使用**************************************/

//起草人岗位变化
function ddlStation_Change()
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

function changCheckState()
{
    if($('#rblAddClass input:checked').val() == "N")
    {
        //正常申请
        getObj('trUrgency').style.display = "";
        
        $('#btnNext').show();
        if($('#hidStep').val() == "0")
        {                
            $('#btnSaveClose').hide();
            $('#btnSaveOpen').hide();
        }
        else
        {
            $('#btnSaveClose').show();
            $('#btnSaveOpen').show();
        }  
    }
    else
    {
        //直接登记
         getObj('trUrgency').style.display = "none";
         
        $('#btnNext').hide();
        $('#btnSaveClose').show();
        $('#btnSaveOpen').show();
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


function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i <= 2; i++)
    {                
         if (getObj("div" + i)) {
            getObj("div" + i).style.display = "none";
        }
    }
    
    getObj("div" + index).style.display = "block";
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


function validateSize()
{
    var addClass = getObj("rblAddClass").value;
    if (addClass == "")
    {
        return alertMsg("登记类型不能为空。", getObj("rblAddClass"));
    }
    
    if (getObj("ddlCorp").value == "")
    {
        return alertMsg("公司不能为空。", getObj("ddlCorp"));
    }
    
    if (getObj("txtPABName").value == "")
    {
        return alertMsg("考核标题不能为空。", getObj("txtPABName"));
    }
    
    if (getObj("ddlStation").value == "")
    {
        return alertMsg("起草岗位不能为空。", getObj("ddlStation"));
    }
    
    
    if (getObj("txtPABNo").value == "")
    {
        return alertMsg("考核编号不能为空。", getObj("txtPABNo"));
    }

    if (addClass == "N")
    {
        if (getObj("rblUrgency").value == "")
        {
            return alertMsg("紧急程度不能为空。", getObj("rblUrgency"));
        }
    }
    else
    {
        if (getObj("txtOldPABNo").value == "")
        {
            return alertMsg("直接登记时内部编号不能为空。", getObj("txtOldPABNo"));
        }
    }
    

    return true;
}
/*******************************Add、Edit页面使用**************************************/