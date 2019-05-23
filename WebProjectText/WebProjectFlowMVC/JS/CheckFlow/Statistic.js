// JScript 文件


function showFlow(flowID, fmName, ftName,fName,corpID,deptID,accountID,startDate,endDate,checkAcountID)
{
    openWindow('VEfficiency.aspx?FlowID=' + flowID + '&FMName=' + encodeURI(fmName) + '&FlowTypeName=' + encodeURI(ftName) + '&FlowName=' + encodeURI(fName)
        + '&CorpID=' + corpID + '&DeptID=' + deptID + '&AccountID=' + accountID + '&StartDate=' + startDate + '&EndDate=' + endDate + '&CheckAccountID='+checkAcountID
        , 1000, 400);
}

function showFlowList(cType,flowID)
{
    openWindow('VStaticFlowList.aspx?FlowID1='+flowID+'&CorpID1='+$('#ddlCorp').val()+'&DeptID1='+$('#ddlDept').val()+'&CreateAccountID1='+$('#hidCreateAccountID').val()
        +'&AccountName1='+encodeURI($('#txtCreateAccountName').val())+'&StartDate1='+$('#txtStartTime').val()+'&EndDate1='+$('#txtEndTime').val()+'&Type1='+cType
        +'&CheckAccountID1='+$('#hidResponAccountID').val()+'&CheckAccountName1='+encodeURI($('#txtResponAccountName').val()),
         800,600);
}

function RenderLinkShow(cellvalue,options,rowobject)
{
   return  "<a  href='#ShowForm' onclick=\"openWindow('../Flow/VFlowBrowse.aspx?ID=" + rowobject[0] + "&JQID=jqGrid1&CorpID="+$('#ddlCorp').val()+"',0,0)\">" +  cellvalue  + "</a>";
}

function getFlowData()
{
     $.post('VStatistic.aspx',{GetFlow:true,FlowTypeID:getObj('ddlFlowType').value,FMID:getObj("ddlFlowModel").value,CorpID:getObj("ddlFlowCorp").value},function (data, textStatus){FillFlow(data);},'json');
}

function FillFlow(data)
{
    $('#ddlFlow option').remove();
	$('#ddlFlow').get(0).options.add(new Option('全部','')) ;    
   $(data).each(function(i){
        $('#ddlFlow').get(0).options.add(new Option(data[i].text,data[i].value));
   });
}

function FlowCorpChange()
{
     $.post('VStatistic.aspx',{GetFlowType:true,FlowCorpID:getObj("ddlFlowCorp").value},function (data, textStatus){FillFlowType(data);},'json');
}

function FillFlowType(data)
{
    $('#ddlFlowType option').remove();
	$('#ddlFlowType').get(0).options.add(new Option('全部','')) ;    
   $(data).each(function(i){
        $('#ddlFlowType').get(0).options.add(new Option(data[i].text,data[i].value));
   });
}

function FlowModelChange()
{
    getFlowData();
}

function FlowChange()
{
    reloadData();
}

function FlowTypeChange()
{
    getFlowData();
}

function CorpChange()
{
     $.post('VStatistic.aspx',{GetDept:true,CorpID:getObj("ddlCorp").value},function (data, textStatus){FillDept(data);},'json');
}

function DeptChange()
{
    reloadData();
}

function FillDept(data)
{
    $('#ddlDept option').remove();
	$('#ddlDept').get(0).options.add(new Option('全部','')) ;    
   $(data).each(function(i){
        $('#ddlDept').get(0).options.add(new Option(data[i].text,data[i].value));
   });
}


function btnSelectCreateAccount_Click()
{
   var rValue=openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID='+ getObj("ddlCorp").value +'',0,0);
   if(!rValue)
      return;
  getObj('txtCreateAccountName').value=rValue.split("|")[1];
  getObj('hidCreateAccountID').value=rValue.split("|")[5]; 
} 

function btnSelectResponAccount_Click()
{
    var rValue=openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID='+ getObj("ddlCorp").value +'',0,0);
   if(!rValue)
      return;
    
    getObj('txtResponAccountName').value=rValue.split("|")[1];
    getObj('hidResponAccountID').value=rValue.split("|")[5];
} 

function btnSearch_Click()
{
    reloadData();
}

// 重新加载数据
function reloadData()
{
    var query = {KW: $("#txtKey").val(),FMID:getObj("ddlFlowModel").value,FlowTypeID:getObj("ddlFlowType").value,
                           FlowID:getObj("ddlFlow").value,CorpID:getObj("ddlCorp").value,DeptID:getObj("ddlDept").value,
                           CAccountID:getObj("hidCreateAccountID").value,RAccountID:getObj("hidResponAccountID").value,
                           StartDate:getObj("txtStartTime").value,EndDate:getObj("txtEndTime").value,FlowCorpID:getObj("ddlFlowCorp").value}; 
    
    // 无条件时，省略第二个参数
    reloadGridData("idPager", query);
}