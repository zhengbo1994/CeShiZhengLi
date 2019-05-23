// JScript 文件
var pop;

$(document).ready(function ()
{
    // 在document加载完成后， 添加本js中所需组建： jsontool.js
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = rootUrl + "/JS/jquery.jsontool.js";
    document.body.appendChild(script);
});


/* 刷新jqGrid */
function reloadData()
{
    var ddlMod = getObjP("ddlFlowModel");
    var fmId = ddlMod.value;

    var query =
        {
            CorpID: getObjP("ddlCorp").value,
            FMID: fmId,
            FlowTypeID: getObjPF("Left", "hidSelID").value,
            CheckAccountID: getObjP("hidAccountID").value,
            AllowAccountID: getObjP("hidRightAccountID").value,
            GetChild: getObjP("ddlChild").value,
            KeyWord: getObjP("txtKW").value
        };
    reloadGridData('idPager', query);
}

// 加载所有流程类别
function loadFlowType()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;    
    ajaxRequest("VFlowLeft.aspx", { AjaxRequest: true,CorpID:getObjP("ddlCorp").value }, "html", refreshFlowType,false);
}
//大小写区别
function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);

    if (getObj("span_0") != null)
    {
        getObj("span_0").click();
    }
    else
    {
        RefreshFlowType(null, 'All', 'TotalFlowType', '0');
    }
}

function CorpChange()
{
      if($('#ddlFlowModel').val()!='3F1E7A7C-995C-46F0-B3A9-70811B4D3129')
      {
         $('#btnPL').hide();
      }
      else
      {
         $('#btnPL').show();
      }
     $.post('FillData.ashx',{action:'GetFlowType',FMID:getObj("ddlFlowModel").value,CorpID:getObj("ddlCorp").value},function (data, textStatus){FillFlowType(data); window.frames("Left").loaddata();},'json');
}
function FillFlowType(data)
{
        $('#ddlFlowType option').remove();
		$('#ddlFlowType').get(0).options.add(new Option('请选择...','')) ;    
       $(data).each(function(i){
	        $('#ddlFlowType').get(0).options.add(new Option(data[i].text,data[i].value));
       });
       if( $("#ddlFlowType option[value='"+$('#hidFlowType').val()+"']").length>0)
       {
         $('#ddlFlowType').val($('#hidFlowType').val());
       }
       else
       {
         $('#hidFlowType').val($('#ddlFlowType').val());
        }
}

function FlowModelChange()
{
    window.frames("Main").reloadData();
}

function btnSearch_Click(changeRange)
{
    if (changeRange && !getObjF("Left", "hidSelID").value)
    {
        return;
    }
    window.frames("Main").reloadData();
}

//function ddlFlowModelChange()
//{
//   $.post('FillData.ashx',{action:'GetFlowTypeAndnotAll',FMID:getObj("ddlFlowModel").value,CorpID:getObj("hidCorpID").value},function (data, textStatus){FillFlowType(data)},'json');
//}

function ddlFlowModelChangeAndCheckType()
{
   CheckType();
   //ddlFlowModelChange();
}
function CheckType()
{
  
    var flowmodel=$('#ddlFlowModel').val()
    if(flowmodel=='3F1E7A7C-995C-46F0-B3A9-70811B4D3129'||flowmodel=='4DA0593E-5249-4675-9447-EB2B72E85E82'||flowmodel=='A74A13B1-F008-47B0-BF24-E7F546F79019'||flowmodel=='4F4205BE-D0F2-4142-B1C3-B99739904132'||flowmodel=='9AA83127-DE06-440A-A6E3-B659DFA76C8C'||flowmodel=='D49C9490-32E7-4F47-BF8F-D24B607AD8D0'||flowmodel=='40DC936D-7065-4167-A9C2-34CFC3B1D7B5'||flowmodel=='41405409-559B-4B1B-8F8E-05AA53EAAFFE'||flowmodel=='78941F4D-565E-4CDA-8A3E-DDB37C834D7D')
   {
//       $('#trareaRead').show();
//      if($('#areaRead').val()=='1')
//      {
//        $('#trRead').show();
//     }
      $('#trShowModelFile').show();
      $('#trModelFile').show();
   
   }
   else
   {
//        $('#trareaRead').hide();
//      $('#trRead').hide();
      $('#trShowModelFile').hide();
      $('#trModelFile').hide();
   }
}
function btnSelectAccount_Click(btn,accountid,accountname)
{
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?From=Leave&type=account&CorpID=' + $("#ddlCorp").val(), 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj(accountid).value = vValue.split('|')[0];
        getObj(accountname).value = vValue.split('|')[1];
        window.frames("Main").reloadData();
    }
}
function btnSelectLookStation_Click(action,StationID,Station)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+action+'&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj(StationID).value = vValue.split('|')[0];
        getObj(Station).value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click(action,DeptID,Dept)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+action+'&CorpID=' + getObj("hidCorpID").value, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj(DeptID).value = vValue.split('|')[0];
        getObj(Dept).value = vValue.split('|')[1];
    }
}
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}
function setVisibleByRadio()
{
   
     var addtype=$("input[name='addtype'][checked=true]").val();
     if(addtype=="1")
     {
        $('#txtPosition').val('');
        $('#hidPositionID').val('');
        $('#trPostion').attr('disabled','disabled');
        $('#btnSelectPostion').attr('disabled','disabled');
        $('#trPostion').css('display','none')
      
        $('#trStation').attr('disabled','');
        $('#trStation').css('display','') 
        $('#btnSelectStation').attr('disabled','');      
     }
     else
     {
        $('#trPostion').attr('disabled','');
        $('#trPostion').css('display','') 
        $('#btnSelectPostion').attr('disabled','');
         
        $('#txtStationName').val('');
        $('#hidStationID').val('');
        $('#trStation').attr('disabled','disabled');
        $('#trStation').css('display','none') 
        $('#btnSelectStation').attr('disabled','disabled');    
         
     }
}

function setFrameByRadio()
{   
     var addtype=$("input[name='addtype'][checked=true]").val();
     var tachtype=$('#hidTachType').val(); 
     if(tachtype=="Bunch")
    {
         $('#lstStations').hide();
          $('#lstStations').width(0);
            $('#lstStations').height(0);
        if(addtype=="0")
         {
            getObj("frmMain").src="../../Common/Select/CheckFlow/VSelectSinglePositionFrame.aspx";  
             
         }
         else
         {
            getObj("frmMain").src="../../Common/Select/OperAllow/VSelectSingleStationFrame.aspx?CorpID="+ getObj("hidCorpID").value;          
         }
    }  
    if(tachtype=="Parataxis")
    {
         $('#lstStations').show();
        if(addtype=="0")
         {
            getObj("frmMain").src="../../Common/Select/CheckFlow/VSelectMultiPositionFrame.aspx";   
         }
         else
         {
            getObj("frmMain").src="../../Common/Select/VSelectMultiStationFrame.aspx?CorpID="+ getObj("hidCorpID").value+"&From=Flow";          
         }
    }     
}

function addPosition()
{
    if (getObjF("Left","lblNoData") != null)
    {
        return alertMsg("请先设置流程类别。");
    }    
    
     if (getObjF("Left","hidSelID").value == "")
    {
        return alertMsg("请选择流程类别。");
    }

    openAddWindow("VFlowAdd.aspx?CorpID="+$('#ddlCorp').val()+"&FMID="+$('#ddlFlowModel').val()+"&FlowTypeID="+getObjF("Left","hidSelID").value, 800, 800, "jqGrid1");
}

function editPosition()
{
    openModifyWindow("VFlowEdit.aspx?CorpID="+$('#ddlCorp').val(),800,800, "jqGrid1","Main");
}

function addReader()
{
   var url="VFlowAddReader.aspx?id="+window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true)+"&JQID=jqGrid1";
   openWindow(url,400, 200);
}

function delPosition()
{
    openDeleteWindow("Flow", 0, "jqGrid1","Main");
}

function showMenu(id, index)
{
   
    document.all.hidInsertIndex.value = index;
    popMenu(itemMenu,120,id);
    event.returnValue = false;
    event.cancelBubble = true;
    return false;
}
        
function popMenu(menuDiv, width, rowControlString)
{
    if(!pop)
    {
        pop = window.createPopup();
    }
    
    pop.document.body.innerHTML = menuDiv.innerHTML;
    var rowObjs = pop.document.body.all[0].rows;
    var rowCount = rowObjs.length;
    for(var i = 0; i < rowObjs.length; i ++)
    {
        var hide = rowControlString.charAt(i) != '1';
        if(hide)
        {
            rowCount --;
        }
        rowObjs[i].style.display = (hide)?"none":"";
        rowObjs[i].cells[0].onmouseover = function()
        {
            this.style.background = "#7b68ee";
            this.style.color = "white";
        }
        rowObjs[i].cells[0].onmouseout=function()
        {
            this.style.background = "#ccff00";
            this.style.color = "black";
        }
    }

    pop.document.oncontextmenu = function()
    {
        return false;
    }
    
    pop.document.onclick = function()
    {
        pop.hide();
    }
    
    pop.show(event.clientX-1, event.clientY, width, rowCount*20, document.body);

    return true;
}

function addFlowTach(tachType, addToLast)
{
    if (pop)
    {
        pop.hide();
    }

    var top, left, newTachInfo;

    document.all.hidInsertID.value = "";

    if (addToLast == true)
    {
        document.all.hidInsertIndex.value = "";
    }

    //调整环
    if (tachType == "Adjust")
    {
        newTachInfo = {
            fixation: 'Y',
            passType: 'ALL',
            flowOption: 'Adjust',
            allowJump: 'N',
            checkDays: 1,
            alertDays: 1,
            flName: '调整',
            isAllowAddTache: 'N',
            checkers: []
        };

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        document.all.btnInsertTach.click();
    }
        //拆分环
    else if (tachType == "Allot")
    {
        newTachInfo = {
            fixation: 'Y',
            passType: 'ALL',
            flowOption: 'Allot',
            allowJump: 'N',
            checkDays: 1,
            alertDays: 1,
            flName: '拆分',
            isAllowAddTache: 'N',
            checkers: []
        };

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        document.all.btnInsertTach.click();
    }
        //串环
    else if (tachType == "Bunch")
    {
        top = (window.screen.availHeight - 600) / 2;
        left = (window.screen.width - 1000) / 2;
        
        newTachInfo = openModalWindow('VFlowAddTach.aspx?TachType=Bunch&CorpID=' + document.all.hidCorpID.value, 1000, 800);

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        if (document.all.hidInsertID.value != "" && document.all.hidInsertID.value != "undefined")
        {
            document.all.btnInsertTach.click();
        }
    }
        //并环
    else if (tachType == "Parataxis")
    {
        top = (window.screen.availheight - 700) / 2;
        left = (window.screen.width - 1000) / 2;
        
        newTachInfo = openModalWindow('VFlowAddTach.aspx?TachType=Parataxis&CorpID=' + document.all.hidCorpID.value, 1000, 800);

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        if (document.all.hidInsertID.value != "" && document.all.hidInsertID.value != "undefined")
        {
            document.all.btnInsertTach.click();
        }
    }
}
        
function deleteFlowTach()
{    
    document.all.btnDeleteTach.click();
}

function movePrevious()
{
    document.all.btnMovePrevious.click();
}

function moveNext()
{
    document.all.btnMoveNext.click();
}

function divHeight()
{ 
}


function btnAddBunch_onclick()
{
    addFlowTach('Bunch', true);
}

function btnAddParataxis_onclick()
{
    addFlowTach('Parataxis', true);
}

function btnAddAdjust_onclick()
{
    addFlowTach('Adjust', true);
}


function selectStationDept(aim)
{
    OpenSelectModelDialog("../../IDOA/CheckDoc/VWaitSaveEditLook.aspx?Aim=" + aim + "&CorpID=" + $("hidCorpID").value, 400, 400);
}

function selectStation(stationName,stationid)
{

   var rValue=openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID='+ getObj("hidCorpID").value +'',0,0);
   if(!rValue)
      return;
   getObj(stationName).value=rValue.split("|")[1];
   getObj(stationid).value=rValue.split("|")[0];
}

function selectPosition(PositionName,Positionid)
{

   var rValue=openModalWindow('../../Common/Select/CheckFlow/VSelectSinglePosition.aspx',800,600);
   if(!rValue)
      return;
   getObj(PositionName).value=rValue.split("|")[1];
   getObj(Positionid).value=rValue.split("|")[0];
}

function selectMultiPosition(PositionName,Positionid)
{

   var rValue=openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID='+getObj(Positionid).value+"&PostionName="+escape(getObj(PositionName).value),800,600);
   if(!rValue)
      return;
   getObj(PositionName).value=rValue.split("|")[1];
   getObj(Positionid).value=rValue.split("|")[0];
}


 function ValidateSize()
{
    var txtFlowName = document.all.txtflowname;
    var txtFlowNo = document.all.txtFlowNo;
    if($('#divDL').attr('innerHtml')=='')
    {
         alert('请设置流程环节。');
        return false;
    }
//    if($('#ddlFlowType').val()=='')
//    {
//        alert('请选择流程类别。');
//        return false;
//    }
    if(txtFlowNo.value == "")
    {
        alert('流程编号不能为空。');
        txtFlowNo.focus();
        return false;
    }

    if(txtFlowName.value == "")
    {
        alert('流程名称不能为空。');
        txtFlowName.focus();
        return false;
    }
    $('#hidRight').val($("input[name='right'][checked=true]").val());
     $('#hidShowModelFile').val($("input[name='ShowModelFile'][checked=true]").val());
     $('#hidFlowType').val($('#ddlFlowType').val());
     return true
   

}
function allowRight()
{
   
    var right=$('#rblAllowType input[checked]').val();

    if(right=='2')
    {
       $('#trrightaccount').show();
       $('#trrightdept').show();
       $('#trrightPostion').show();
       
    }
    else
    {
       $('#trrightaccount').hide();
       $('#trrightdept').hide();
        $('#trrightPostion').hide();
    }
}

function setDesc(areaName)
{
    $('#'+areaName+'_desc').val('');
    if(areaName=='areaRight')
    {
       if($('#rblAllowType input[checked]').val()=="2"&&$('#'+areaName).val()=="0")
       {
             var Content='';
             if($('#txtRightStation').val()!='')
             {
                Content+='授权岗位：'+$('#txtRightStation').val()+"   ";
             }
             if($('#txtRightDept').val()!='')
             {
                Content+="授权部门："+$('#txtRightDept').val()+"    ";
             }
              if($('#txtRightPostion').val()!='')
             {
                Content+="授权职务："+$('#txtRightPostion').val();
             }
             $('#'+areaName+'_desc').val(Content);  
       }
    
    }
    if(areaName=='areaRead')
    {
       if($('#'+areaName).val()=="0")
       {
             var ReadContent='';
             if($('#txtLookStation').val()!='')
             {
                ReadContent+='送阅岗位：'+$('#txtLookStation').val();
             }
             if($('#txtLookDept').val()!='')
             {
               ReadContent+="    送阅部门："+$('#txtLookDept').val();
             }
              $('#'+areaName+'_desc').val(ReadContent);  
       }
    }
}


// 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Add":
            addReader();
            break;
        case "Setting":
            btnUserTable_Click();
            break;
        case "Edit":
            btnTachCondition_Click();
            break;
        case "Export":
            window.frames('Main').document.getElementById('btnExport').click();
           break;
        case "Attention":
           btnShowFlow_Click();
           break;   
        case "Move":
           btnMoveFlow_Click();
           break;         
    }
}

function btnUserTable_Click()
{
    if( window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'IsCheckDocMod')=='N')
    {
       alert('只有公文模块允许挂接表单');
       return false;
    }
    openModifyWindow("VFlowUserFormList.aspx?FlowName="+escape(stripHtml(window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'FlowName'))), 0, 0, "jqGrid1","Main");
    // openModifyWindow("../CustomForm/VHangForm.aspx", 0, 0, "jqGrid1","Main");
}

function RenderLink(cellvalue,options,rowobject)
{
    if(rowobject[8]!=""&&rowobject[8]!=null)
    {
        return "<a  href='#ShowForm' onclick=\"showForm('" + rowobject[8] + "')\">" +  cellvalue  + "</a>";
    }
    else
    {
        return "<div  style='width:100%'>无<div>";
    }
}
function RenderLinkShow(cellvalue,options,rowobject)
{
   return  "<a  href='#ShowForm' onclick=\"openWindow('VFlowBrowse.aspx?ID=" + rowobject[0] + "',0,0)\">" +  cellvalue  + "</a>";
}
function showForm(formID)
{
    openWindow("../CustomForm/VCustomFormBrowse.aspx?FormID=" + formID, 800, 600);
}

function btnTachCondition_Click()
{
    openModifyWindow("VCheckDocTachConditionList.aspx?FMID="+window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 800, 600, "jqGrid1","Main");
}

function btnMoveFlow_Click()
{
    var ids = window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FlowID');
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    openWindow("VFlowMove.aspx?FlowID="+ids.join(",")+"&CorpID="+getObj("ddlCorp").value, 600, 400);
}

function btnShowFlow_Click()
{
   if(window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0]=="3F1E7A7C-995C-46F0-B3A9-70811B4D3129")//公文
   {
        openModifyWindow("VCheckDocFlowShow.aspx?FMID="+window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 900, 0, "jqGrid1","Main");
   } 
   else
   {
        openModifyWindow("FlowShow.aspx?FMID="+window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 900, 0, "jqGrid1","Main");
   }            
}

function RefreshFlowType(span,flowtypeID, parentFlowTypeID, outLine)
{
 
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    if(span!=null)
    {
        span.className = "selNode";
        window.parent["Selected"] = span.id;
    }
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;
    execFrameFuns("Main",function(){window.parent.frames('Main').reloadData();},window.parent);
   //setTimeout("window.parent.frames('Main').reloadData()",10);
}

///改变被选中的节点样式 
 function ChangeBackColor(span)
{
    var obj=document.getElementsByName("FlowTypeName");
    for(i = 0; i <obj.length; i++)
    {
         obj(i).className='normalNode';
    }
     span.className = "selNode";
}

function SelectFlowType(flowtypeID,flowtypeName)
{
    $('#hidFlowTypeID').val(flowtypeID);
    $('#hidFlowTypeName').val(flowtypeName);
}

function btnChoose_Click()
{
     if (getObj("hidFlowTypeID").value == "")
    {
        return alertMsg("请选择一个流程类别。");
    }  
    return true;
}

function selectFlowType()
{
    var vFlowTypeID = $('#hidFlowTypeID').val();
    var vFlowTypeName = $('#hidFlowTypeName').val();
    
     if (vFlowTypeID == "")
    {
        return alertMsg("请选择一个流程类别。");
    }  
    
     if (vFlowTypeName == "")
    {
        return alertMsg("请选择一个流程类别。");
    }  
    
    window.returnValue={FlowTypeID:vFlowTypeID,FlowTypeName:vFlowTypeName};
    window.close(); 
}

function btnSetectFlowType_Click()
{
   var rValue=openModalWindow('VSelectFlowType.aspx?CorpID='+getObj("hidCorpID").value,800,600);
   if(!rValue)
      return;
   getObj("txtFlowType").value=rValue.FlowTypeName;
   getObj("hidFlowType").value=rValue.FlowTypeID;
}

  function btnAddPostion()
{
  
    var rValue=openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID='+$('#hidRightPostionID').val()+"&PostionName="+escape($('#txtRightPostion').val()),800,600);
    if (rValue != "undefined" && rValue != null)
    {
       $('#hidRightPostionID').val(rValue.split('|')[0]);
       $('#txtRightPostion').val(rValue.split('|')[1]);
           return true;
    }
    else
    {
       return false;
    }
}

function ajaxExportDataForList()
{
    var ddlMod = getObjP("ddlFlowModel");
    var fmId = ddlMod.value;
    var query =
        {
            CorpID: getObjP("ddlCorp").value,
            FMID: fmId,
            FlowTypeID: getObjPF("Left", "hidSelID").value,
            CheckAccountID: getObjP("hidAccountID").value,
            AllowAccountID: getObjP("hidRightAccountID").value,
            GetChild: getObjP("ddlChild").value,
            KeyWord: getObjP("txtKW").value,
            iPageSize: $("#idPager_PageSize").val(),
            iPageIndex: $("#idPager_PageIndex").val()
        };
    ajaxExportByData('VFlowListMain.aspx', query);
}


