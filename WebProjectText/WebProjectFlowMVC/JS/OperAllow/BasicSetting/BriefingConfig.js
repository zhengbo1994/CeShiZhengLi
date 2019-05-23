// JScript 文件

function addBriefingConfig()
{
    openWindow('VSelectBriefingConfig.aspx?ProjectID='+$('#hidProjectID').val()+'&BType='+$('#hidType').val(),800,600);
}
function delBriefingConfig()
{
    if(window.frames("Main").document != null)
    {
        var chks=window.frames("Main").document.getElementsByName("chkSelect");
        var selectedKeyDatas=[];
        if(chks != null)
        {
            for(var i = 0; i< chks.length; i++)
            {
                if(chks[i].checked)
                {
                    selectedKeyDatas.push(chks[i].value);
                }
            }
            if(selectedKeyDatas.length<1)
            {
                return alertMsg("没有选择任何记录");
            }            
            if(selectedKeyDatas.length>50)
            {
                return alertMsg("您一次最多只能删除50条记录。");
            }            
           openDeleteWindow("BriefingSetting",1, selectedKeyDatas.join(','));
        }
    } 
        
}

//设置简报
function setBriefingConfig()
{
    if(window.frames("Main").document != null)
    {
        var chks=window.frames("Main").document.getElementsByName("chkSelect");
        var selectedKeyDatas=[];
        if(chks != null)
        {
            for(var i = 0; i< chks.length; i++)
            {
                if(chks[i].checked)
                {
                    selectedKeyDatas.push(chks[i].value);
                }
            }
            if(selectedKeyDatas.length<1)
            {
                return alertMsg("没有选择记录");
            }
            
            var vUrl="VBriefingConfigSet.aspx?BCID=" + selectedKeyDatas.join(",") + "&ProjectID=" + $('#hidProjectID').val() + "&BType=" + $('#hidType').val() + "&ProjectName=" + escape($('#hidProjectName').val());
            openWindow(vUrl, 800, 450);
        }
    }
    else
    {
      return alertMsg("页面未加载完成");
    }
}

function chk_Click(chk, aim)
{
    switch(aim)
    {
        case "Status":
            if(chk.checked)
            {
                getObj("rblIsEnable").disabled = false;
            }    
            else
            {
                getObj("rblIsEnable").disabled = true;
            }
            break;
        case "BriefingDay":
            if(chk.checked)
            {
                getObj("txtBriefingDay").disabled = false;
            }    
            else
            {
                getObj("txtBriefingDay").disabled = true;
            }
            break;
        case "Allow":
            if(chk.checked)
            {
                getObj("btnSelectAllowStation").disabled = false;
                getObj("btnSelectAllowDeptID").disabled = false;
            }    
            else
            {
                getObj("btnSelectAllowStation").disabled = true;
                getObj("btnSelectAllowDeptID").disabled = true;
            }
            break;
        case "Look":
            if(chk.checked)
            {
                getObj("btnSelectLookStation").disabled = false;
                getObj("btnSelectLookDept").disabled = false;
            }    
            else
            {
                getObj("btnSelectLookStation").disabled = true;
                getObj("btnSelectLookDept").disabled = true;
            }
            break;
    }
}

//送阅岗位
function btnSelectStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

//授权岗位
function btnSelectAllowStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=AllowStation', 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidAllowStationID").value = vValue.split('|')[0];
        getObj("txtAllowStation").value = vValue.split('|')[1];
    }
}

//送阅部门
function btnSelectDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDeptID&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDeptID").value = vValue.split('|')[1];
    }
}

//授权部门
function btnSelectAllowDept_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=AllowDeptID', 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidAllowDeptID").value = vValue.split('|')[0];
        getObj("txtAllowDeptID").value = vValue.split('|')[1];
    }
}

//提交验证
function validate()
{  
    if(getObj("rblIsEnable").getElementsByTagName("input")[0].checked == false && getObj("rblIsEnable").getElementsByTagName("input")[1].checked == false)
    {
        return alertMsg("请设置简报的状态", getObj("rblIsEnable"));  
    }    
    if ((getObj("txtBriefingDay").value) < 1 || (getObj("txtBriefingDay").value) > 31)
    {
        
        return alertMsg("简报日必须为1到31之间的正整数。", getObj("txtBriefingDay"));
    }
    return true;
}