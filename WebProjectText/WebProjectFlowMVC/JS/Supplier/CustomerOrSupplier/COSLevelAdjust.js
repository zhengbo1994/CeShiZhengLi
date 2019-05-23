// JScript 文件

//新增
function addCOSLevelAdjust()
{
    openAddWindow("VCOSLevelAdjustAdd.aspx", screen.availWidth, screen.availHeight, "jqgCOSLevelAdjust");
}

function revokeCOSLevelAdjust()
{
     openRevokeWindow("COSLevelAdjust","jqgCOSLevelAdjust");
}

function delCOSLevelAdjust()
{
    openDeleteWindow("DeleteCOSLevelAdjustAll", 2, "jqgCOSLevelAdjust");
}

function showCOSLevelAdjust(value, cell, row)
{
    if(row[1] == "未发出")
    {
        var vUrl = "'VCOSLevelAdjustEdit.aspx?ID=" + row[0] + "&JQID=jqgCOSLevelAdjust'";
        return '<div class="nowrap"><a href="javascript:void(0)" onclick="openWindow(' + vUrl + ',screen.availWidth,screen.availHeight)">' + value + '</a></div>';
    }
    var vUrl = "'VCOSLevelAdjustBrowser.aspx?ID=" + row[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}

function showCOS(id)
{
    openWindow("VCustomerOrSupplierBrowse.aspx?COSID=" + id, 800, 600, 0 ,0, 1);
}

function refreshData()
{
    var adjustWay = getObj("ddlAdjustWay").value;
    var ccState = getObj("ddlCCState").value;
    var meDoState = getObj("ddlMeDoState").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();
    var vKey=$("#txtKW").val();
    var vAddClass=getObj("ddlAddClass").value;
    
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
    
    addParamsForJQGridQuery("jqgCOSLevelAdjust",[{AdjustWay : adjustWay, CCState:ccState,MeDoState:meDoState,StartTime:vStartTime,EndTime:vEndTime,KeyValue:vKey,AddClass:vAddClass}]);
    
    refreshJQGrid('jqgCOSLevelAdjust');
}

//**************
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

function changCheckState()
{
    if(rdoNeedCheck.getElementsByTagName("input")[0].checked)
    {
        getObj("trUrgency").style.display="none";
       
       $('#btnNext').hide();
       $('#btnSaveClose').show();
       $('#btnSaveOpen').show();
    }
    else
    {
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
        getObj("trUrgency").style.display="";
    }
}

function addCOS()
{
    openModalWindow('../../Common/Select/VSelectSingleCOS.aspx?SelectType=Multi&Action=COSLevelAdjust', 800, 600);
    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(tbCOS);
}
function showEvaluation(type, cosid)
{
    openWindow("VCOSEvaluationList.aspx?EType=" + type + "&COSID=" + cosid, 800, 600, 0 ,0, 1);
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

// 删除表格行
function delDetail(table)
{
    // 删除表格中复选框选中的行
    deleteTableRow(table);
    
    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
}

function saveList()
{
    hidCOSOriTDList.value = tdCOS.innerHTML;
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

function checkData()
{   
    if(trim(getObj("txtEUGRName").value) == "")
    {
        return alertMsg("调整名称不能为空",getObj("txtEUGRName"));
    }
    if (!saveDocModel())
    {
        return alertMsg("正文文档保存失败。", getObj("chkUseDocModel"));
    }    
    if (getRound(txtProgressWeight.value,2) + getRound(txtAfterWeight.value,2) + getRound(txtYearWeight.value,2) + getRound(txtPerformanceWeight.value, 2) + getRound(txtSpecialWeight.value, 2) == 0)
    {
        return alertMsg('权重之和为0，统计无效，请重新输入。', txtProgressWeight);
    }
    hidCOSList.value = "";
    for(var i = 1;i < tbCOS.rows.length; i++)
    {
        hidCOSList.value = hidCOSList.value + "," + getObjTR(tbCOS, i, "input", 0).value;
    }
    if(hidCOSList.value.length < 1)
    {
        return alertMsg("请选择供应商", getObj("btnAddCOS"));
    }
    hidCOSList.value = hidCOSList.value.substr(1);    
    var reValue = openModalWindow('VCOSLevelAdjustStaticList.aspx',1000,600);    
    if(reValue != "Y")
    {
        return false;        
    }    
    if(hidList.value.length < 1)
    {
        return alertMsg("没有设置供应商的级别");        
    }        
    return true;
}

function checkCustomForm()
{
    if($("#hidStep").val() == "0" && !checkData())
    {
        return false;
    }
    if($("#hidStep").val() == "1" && (!formValidate() || !flowValidate()))
    {
        return false;
    }
    return true;
}

//调整相关验证
function validateAdjust()
{
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);
    
    if(!checkData())
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    if((!formValidate()))
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
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
    
    return true;
}


