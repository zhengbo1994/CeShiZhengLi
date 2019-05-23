// VInsertTachSingleStation.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-12
function RefreshCorpStructure(struID)
{
    $('#jqgStation',window.parent.frames("Main").document).getGridParam('postData').StruID=struID;
    window.parent.frames("Main").window.reloadData();
}

function ChangeBackColor(span)
{
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

function ddlType_Change()
{
    var vType=$("#ddlType").val();
    $('#jqgStation',window.frames("Main").document).getGridParam('postData').Type=vType;
    window.frames('Main').window.reloadData();
}

function reloadData()
{      
    refreshJQGrid('jqgStation');
}

function RenderLink(cellvalue,options,rowobject)
{
    var url = "'../../OperAllow/Station/VStationBrowse.aspx?StationID="+rowobject[0]+"'";
    return '<div class="nowrap"><a  href="javascript:window.openModalWindow('+url+',600,450)">'+cellvalue+'</a></div>' ;
}

function btnSearch_Click()
{
    var vKey=$("#txtKey").val();
    if (vKey == "")
    {
        getObj("trLeft").style.display = "";
    }
    else
    {
        getObj("trLeft").style.display = "none";
    }
    
    $('#jqgStation',window.frames("Main").document).getGridParam('postData').KeyValue=vKey;
    window.frames('Main').window.reloadData();
}

function btnChoose_Click()
{
    var vStationID = window.frames('Main').getJQGridSelectedRowsID('jqgStation', false);
    if (vStationID == null)
    {
        return alertMsg("请选择岗位。", getObj("btnChoose"));
    }

    var $txtInsertReason = $("#txtInsertReason");
    if ($("#hidCompany").val() == "XINYUAN" && $txtInsertReason.val() == "")
    {
        return alertMsg("请填写插入原因。", $txtInsertReason);
    }
    else if (!/^[^\|&#]*$/g.test($txtInsertReason.val()))
    {
        return alertMsg("插入原因中出入了特殊字符（&、|、#）", $txtInsertReason);
    }

    var vPassType = "All";  // 为串环时，通过方式为All
    var vCLName = getObj("txtCLName").value;
    var vCheckDays = getObj("txtCheckDays").value;
    var vAlertDays = getObj("txtAlertDays").value;
    
    var vFlowOption = "Check";
    var rbs= getObj("rblType").getElementsByTagName("input");
    if (rbs[0] != null && rbs[0].checked)
    {
        if(vCLName=="")
        {
            vCLName="审核"
        } 
    }
    if (rbs[1] != null && rbs[1].checked)
    {
        vFlowOption = "Adjust";
       if(vCLName=="")
       {
            vCLName="调整"
       } 
    }
    else if (rbs[2] != null && rbs[2].checked)
    {
        vFlowOption = "Communicate";
        if(vCLName=="")
       {
            vCLName="会签"
       }  
    }
    else if (rbs[3] != null && rbs[3].checked)
    {
        vFlowOption = "Deal";
        if(vCLName=="")
       {
            vCLName="处理"
       }  
    }
    else if (rbs[4] != null && rbs[4].checked)
    {
        vFlowOption = "Save";
        if(vCLName=="")
       {
            vCLName="归档"
       }  
    }
    
    var vIsAllowAddTache = "Y";
    rbs= getObj("rblIsAllowAddTache").getElementsByTagName("input");
    if (rbs[1].checked)
    {
        vIsAllowAddTache = "N";
    }
    
    var vAllowJump = "Y";
    rbs= getObj("rblAllowJump").getElementsByTagName("input");
    if (rbs[1].checked)
    {
        vAllowJump = "N";
    }
    
    var vCopyReadID = $("#hidCopyReadID").val();

    window.returnValue = vStationID + "#" + vPassType + "&" + vFlowOption + "&" + vAllowJump + "&" + vCheckDays
        + "&" + vAlertDays + "&" + vCLName + "&" + vIsAllowAddTache + "&" + $txtInsertReason.val() + "&" + vCopyReadID;
    
    window.close();
}

// 如果审批页的批复结果选中了“沟通”，则环节类型自动选中沟通（中伟）
function setFlowOption()
{
    if (getObj("hidCompany").value.toLowerCase() == "zhongwei")
    {
        var rblCheckState = getObjD("rblCheckState");
        if (rblCheckState)
        {
            var checkOpt = "0";
            var rdos = rblCheckState.getElementsByTagName("input");
            for (var i = 0; i < rdos.length; i++)
            {
                if (rdos[i].type.toLowerCase() == "radio" && rdos[i].checked)
                {
                    checkOpt = rdos[i].value;
                    break;
                }
            }
            if (checkOpt == "13")
            {
                var rblType = getObj("rblType");
                if (rblType)
                {
                    rdos = rblType.getElementsByTagName("input");
                    for (var i = 0; i < rdos.length; i++)
                    {
                        if (rdos[i].type.toLowerCase() == "radio" && rdos[i].value == "3")
                        {
                            rdos[i].checked = true;
                            break;
                        }
                    }
                }
            }
        }
    }
}