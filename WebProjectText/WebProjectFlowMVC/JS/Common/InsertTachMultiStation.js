// VInsertTachMultiStation.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-12
function RefreshCorpStructure(struID)
{
    // 页面层级不同，不能单独方法
    var vStationIDs = "";
    var lstStations = window.parent.getObj("lstStations");
    for (var i=0; i<lstStations.options.length; i++)
    {
        vStationIDs += "," + lstStations.options[i].value;
    }
    
    if (vStationIDs != "")
    {
        vStationIDs = vStationIDs.substr(1)
    }
    
    $('#jqgStation',window.parent.frames("Main").document).getGridParam('postData').StruID=struID;
    $('#jqgStation',window.parent.frames("Main").document).getGridParam('postData').StationID=vStationIDs;
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
    // 页面层级不同，不能单独方法
    var vStationIDs = "";
    var lstStations = getObj("lstStations");
    for (var i=0; i<lstStations.options.length; i++)
    {
        vStationIDs += "," + lstStations.options[i].value;
    }
    
    if (vStationIDs != "")
    {
        vStationIDs = vStationIDs.substr(1)
    }
    
    var vType=$("#ddlType").val();
    $('#jqgStation',window.frames("Main").document).getGridParam('postData').Type=vType;
    $('#jqgStation',window.parent.frames("Main").document).getGridParam('postData').StationID=vStationIDs;
    window.frames('Main').window.reloadData();
}

function reloadData()
{      
    refreshJQGrid('jqgStation');
}

function showTip(cellvalue,options,rowobject)
{
    return '<span style="width:100%;" title="'+rowobject[2]+'\>'+rowobject[3]+'\>'+cellvalue + '(' + rowobject[4]+')">'+cellvalue+'</span>';
}

function renderLink(cellvalue,options,rowobject)
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
    var $divContainSon = $("#divContain").find("div");
    if ($divContainSon.length < 1)
    {
        return alertMsg("请选择岗位。");
    }

    var vStationID = [];
    var vInsertSeason = [];
    var boolIsValidate = true;
    $divContainSon.each(function ()
    {
        if ($("#hidCompany").val() == "XINYUAN" && $.trim($(this).find(":input")[0].value) == "")
        {
            boolIsValidate = false;
            $divInsertReason.show();
            return alertMsg("请填写插入原因。", $(this).find(":input")[0]);
        }
        if (!/^[^\|&#]*$/g.test($(this).find(":input")[0].value))
        {
            boolIsValidate = false;
            $divInsertReason.show();
            return alertMsg("插入原因中出入了特殊字符（&、|、#）", $(this).find(":input")[0]);
        }
        vStationID.push(this.id);
        vInsertSeason.push($(this).find(":input")[0].value);
    });
    if (!boolIsValidate)
    {
        return;
    }
    vStationID = vStationID.toString();
    vInsertSeason = vInsertSeason.join("|");

    //插入并环添加审批人
    if (getParamValue("Aim") == "AddCheckMan")
    {
        window.returnValue = vStationID + "#" + vInsertSeason;
        window.close();
        return;
    }

    var vPassType = "All";
    var rblPassType= getObj("rblPassType").getElementsByTagName("input");
    if (rblPassType[1] != null && rblPassType[1].checked)
    {
        vPassType = "One";
    }
    
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
//    if (rbs[1] != null && rbs[1].checked)
//    {
//        vFlowOption = "Adjust";
//       if(vCLName=="")
//       {
//            vCLName="调整"
//       } 
//    }
    else if (rbs[1] != null && rbs[1].checked)
    {
        vFlowOption = "Communicate";
        if(vCLName=="")
       {
            vCLName="会签"
       }  
    }
    else if (rbs[2] != null && rbs[2].checked)
    {
        vFlowOption = "Deal";
        if(vCLName=="")
       {
            vCLName="处理"
       }  
    }
//    else if (rbs[4] != null && rbs[4].checked)
//    {
//        vFlowOption = "Save";
//        if(vCLName=="")
//       {
//            vCLName="归档"
//       }  
//    }
    
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
        + "&" + vAlertDays + "&" + vCLName + "&" + vIsAllowAddTache + "&" + vInsertSeason + "&" + vCopyReadID;
    
    window.close();
}

function btnAdd_Click()
{
    addCheckMan();
}

function btnDel_Click()
{
    var lstStations = getObj("lstStations");
    for(i = lstStations.options.length - 1; i >= 0; i--) 
    {
        if (lstStations.options[i].selected)
        {
            if ($divInsertReason.find("#" + lstStations.options[i].value).length > 0)
            {
                $divInsertReason.find("#" + lstStations.options[i].value).remove();
            }
            lstStations.remove(i);
        }
    }
}

function btnAddAll_Click()
{
    addCheckMan();
}

function btnDelAll_Click()
{
    var lstStations = getObj("lstStations");
    for(i = lstStations.options.length - 1; i >= 0; i--)
    {
        if ($divInsertReason.find("#" + lstStations.options[i].value).length > 0)
        {
            $divInsertReason.find("#" + lstStations.options[i].value).remove();
        }
        lstStations.remove(i);
    }
}

function  lstStationsDB_Clisk() 
{
    var   addOption=document.createElement( "option ") 
    var   index 
            
    if(getObj("lstStations").length==0)return(false); 
    index=getObj("lstStations").selectedIndex
    if (index < 0) return (false);
    $divInsertReason.find("#" + getObj("lstStations").options[index].value).remove();
    getObj("lstStations").remove(index);
}

 //双击添加人员
function jqGridDblClick(rowid, iRow, iCol, e)
{        
    var lstStations = getObjP("lstStations");

    var vStationID = rowid;
    var vStationName = $('#jqgStation').getRowData(rowid)['StationName'];
    var vEmployeeName = $('#jqgStation').getRowData(rowid)['TAccount__EmployeeName'];

    var strTR = "";
    var strhidCompany = $("#hidCompany",window.parent.document).val();
     if($(window.parent.document).find('#lstStations option[value=\''+vStationID+'\']').length<=0)
    {               
        var opt = document.createElement("OPTION");
        opt.value = vStationID;
        opt.text = $.jgrid.stripHtml(vStationName + "(" + vEmployeeName + ")");

        lstStations.add(opt, lstStations.length);

        strTR += "<div id='" + vStationID + "' style='height:50px'><span>"
                + vStationName + "(" + vEmployeeName + ")</span>" + (strhidCompany == "YTJT-ERP" ? "<span class='lblastk'>*</span>" : "") +
                "<textarea class='text' style='height: 40px;' rows='2' onfocus='setIDText(this,0)' onblur='setIDText(this,1)' cols='10'/></div>";

        if ($("#btnInsertReason_tb",window.parent.document).is(":hidden"))
        {
            $("#btnInsertReason_tb",window.parent.document).show();
            $("#btnInsertReason",window.parent.document).show();
        }
        $("#divInsertReason",window.parent.document).show();
    }

    if (strTR != "")
    {
        if ($("#divContain", window.parent.document).find("div").length == 0)
        {
            $("#divContain", window.parent.document).html("");
        }
        $("#divContain",window.parent.document).append(strTR);
        $("#divInsertReason",window.parent.document).css({ right: 0, bottom: 0 });
        $("#divInsertReason", window.parent.document).show();
    }
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

function addCheckMan()
{
    var lstStations = getObj("lstStations");

    var vStationID = window.frames('Main').getJQGridSelectedRowsID('jqgStation', true);
    var vStationName = window.frames('Main').getJQGridSelectedRowsData('jqgStation', true, 'StationName');
    var vEmployeeName = window.frames('Main').getJQGridSelectedRowsData('jqgStation', true, 'TAccount__EmployeeName');

    if (vStationID.length == 0)
    {
        return alertMsg("请选择岗位。", getObj("btnAdd"));
    }

    var strTR = "";
    var strhidCompany = $("#hidCompany").val();
    for (var i = 0; i < vStationID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == vStationID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vStationID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vStationID[i];
            opt.text = $.jgrid.stripHtml(vStationName[i] + "(" + vEmployeeName[i] + ")");

            lstStations.add(opt, lstStations.length);

            strTR += "<div id='" + vStationID[i] + "' style='height:50px;border-bottom:1px dashed #cad4fe;padding-bottom:5px;'><span style='line-height:25px'>"
                + vStationName[i] + "(" + vEmployeeName[i] + ")</span>" + (strhidCompany == "XINYUAN" ? "<span class='lblastk'>*</span>" : "") +
                "<textarea class='text' style='height: 40px;' rows='2' onfocus='setIDText(this,0)' onblur='setIDText(this,1)' cols='10'/></div>";

            if (!$("#btnInsertReason_tb").is(":hidden"))
            {
                $("#btnInsertReason_tb").show();
                $("#btnInsertReason").show();
            }
        }
    }

    if (strTR != "")
    {
        if ($("#divContain").find("div").length == 0)
        {
            $("#divContain").html("");
        }
        $("#divContain").append(strTR);
        $divInsertReason.css({ right: 0, bottom: 0 });
        $divInsertReason.show();
    }
}