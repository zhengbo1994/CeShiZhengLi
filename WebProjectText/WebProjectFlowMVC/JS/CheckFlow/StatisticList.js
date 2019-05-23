// JScript 文件


function showFlow(flowID, fmName, ftName,fName,corpID,deptID,accountID,startDate,endDate,checkAcountID)
{
    openWindow('VEfficiency.aspx?FlowID=' + flowID + '&FMName=' + encodeURI(fmName) + '&FlowTypeName=' + encodeURI(ftName) + '&FlowName=' + encodeURI(fName)
        + '&CorpID=' + corpID + '&DeptID=' + deptID + '&AccountID=' + accountID + '&StartDate=' + startDate + '&EndDate=' + endDate + '&CheckAccountID='+checkAcountID
        , 1000, 400);
}

function showFlowList(cType,flowID)
{
    openWindow('VStaticFlowList.aspx?FlowID='+flowID+'&CorpID='+$('#ddlCorp').val()+'&DeptID='+$('#ddlDept').val()+'&CreateAccountID='+$('#hidCreateAccountID').val()
        +'&AccountName='+encodeURI($('#txtCreateAccountName').val())+'&StartDate='+$('#txtStartTime').val()+'&EndDate='+$('#txtEndTime').val()+'&Type='+cType
        +'&CheckAccountID='+$('#hidResponAccountID').val()+'&CheckAccountName='+encodeURI($('#txtResponAccountName').val()),
         800,600);
}

function RenderLinkShow(cellvalue,options,rowobject)
{
   return  "<a  href='#ShowForm' onclick=\"openWindow('../Flow/VFlowBrowse.aspx?ID=" + rowobject[1] + "&JQID=jqGrid1&CorpID="+$('#ddlCorp').val()+"',0,0)\">" +  cellvalue  + "</a>";
}

function RenderTitle(cellvalue,options,rowobject)
{
    return  "<a  href='#ShowForm' onclick=\"openWindow('../.."+ rowobject[12] +rowobject[13] + "',0,0)\">" +  cellvalue  + "</a>";
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

function StateChange()
{
    reloadData();
}

function btnSearch_Click()
{
    reloadData();
}

/* 刷新jqGrid */
function reloadData()
{
    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').getGridParam('postData').DeptID = getObj("ddlDept").value;
    $('#jqGrid1').getGridParam('postData').Type = getObj("ddlState").value;
    $('#jqGrid1').getGridParam('postData').CreateAccountID = getObj("hidCreateAccountID").value;
    $('#jqGrid1').getGridParam('postData').CheckAccountID = getObj("hidResponAccountID").value;
    $('#jqGrid1').getGridParam('postData').StartTime = getObj("txtStartTime").value;
    $('#jqGrid1').getGridParam('postData').EndTime = getObj("txtEndTime").value;
    $('#jqGrid1').trigger('reloadGrid');
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}