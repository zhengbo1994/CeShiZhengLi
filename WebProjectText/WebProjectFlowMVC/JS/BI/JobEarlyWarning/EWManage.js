function editApply()
{
    var CCID = getJQGridSelectedRowsData('jqGrid1',true,'CCID');
    openModifyWindow("VEWManageEdit.aspx?CCID=" + CCID, 0, 0, "jqGrid1");
}

function deleteApply(bDeleteAll)
{
    if(!bDeleteAll)
    {
        openDeleteWindow("HandleProgram", 1, "jqGrid1",null,{Msg:'Y',From:'Manage'}); 
    }
    else
    {
        openDeleteWindow("HandleProgramAll", 1, "jqGrid1",null,{Msg:'N',From:'Manage'}); 
    }
}

function selectAccount(aim)
{
    var corpID = getObj("ddlProject").corpID;
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?type=account&From=Bylaw&CorpID=' + corpID, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
    }
}

//申请标题
function renderApplyTitle(cl,opt,rl)
{     
       return "<div class=\"nowrap\"><a href=\"javascript:openWindow('VHandleProgramRequestBrowse.aspx?JQID=jqMyApply&HPRID="+opt.rowId+"',0,0);\">"+cl+"</div>";  
}

function setBtnVisible()
{
    var bIsDelete=$('#ddlIsDelete').val();
    if(bIsDelete=='Y')
    {
           $("#jqGrid1").showCol("DeleteEmployeeName");
           $("#jqGrid1").showCol("DeleteDate");
           $("#jqGrid1").showCol("DeleteRemark");
           
           $('#btnEdit_tb,#btnRevision_tb,#btnDelete_tb').hide();
           $('#btnDeleteAll_tb,#btnDeleteAll,#btnResume_tb,#btnResume').show();
    }
    else
    {  
           $("#jqGrid1").hideCol("DeleteEmployeeName");
           $("#jqGrid1").hideCol("DeleteDate");
           $("#jqGrid1").hideCol("DeleteRemark");
           
           $('#btnEdit_tb,#btnRevision_tb,#btnDelete_tb').show();
           $('#btnDeleteAll_tb,#btnResume_tb').hide();
    }
}

function resetDept()
{
       var corpID = $("#ddlCorp").val();
       $('#ddlDept option').remove();
       $('#ddlDept').get(0).options.add(new Option('全部','')) ;
       $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetDeptByCorpID", CorpID: corpID },
            dataType: "json",
            cache:false,
            success: loadDept,
            error: ajaxError
        });
       reloadData();
}

function loadDept(data, textStatus)
{
    if (data && data.Count > 0)
    {      
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        { 
            $('#ddlDept').get(0).options.add(new Option(getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name,data.Nodes[i].ID));
        }
        
    }
}

//重新加载数据
function reloadData()
{
  var startDate=$('#txtStartTime').val();
  var endDate=$('#txtEndTime').val();
  if(compareDate(startDate,endDate)==-1)
  {
    return alertMsg('结束日期必须大于开始日期',$('#txtEndTime'));
  } 
  
  $('#jqGrid1').appendPostData({
    ProjectID:$('#ddlProject').val(),
    EWType:$('#ddlEWType').val(),
    CCState:$('#ddlCCState').val(),
    DeptID:$('#ddlDept').val(),
    CreateAccountID:$('#hidCreateAccountID').val(),
    DealAccountID:$('#hidDealAccountID').val(),
    IsDelete:$('#ddlIsDelete').val(),
    StartDate:startDate,
    EndDate:endDate,
    KeyWord:$('#txtKey').val()
  });
 
  refreshJQGrid('jqGrid1');  
}

function resumeApply()
{
    openResumeWindow("HandleProgram", "jqGrid1");
}

//调整环节
function adjustRevision()
{
   openRevisionWindow("jqGrid1");
}

function renderEW(cl,opt,rl)
{
    return "<div class=\"nowrap\"><a href=\"javascript:openWindow('VJobEarlyWarningWorkBrowse.aspx?JQID=jqGrid1&JEWID="+rl[0]+"',800,600);\">"+cl+"</div>";  

}