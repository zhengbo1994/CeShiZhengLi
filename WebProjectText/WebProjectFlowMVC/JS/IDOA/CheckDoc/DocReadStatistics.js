// VDocReadStatistics.aspx 公文阅读统计页面
// 作者：Chenzy    
// 时间：2013-01-22
// 参考公文管理页面的VManageDoc.JS 
function renderLink(cellvalue,options,rowobject)
{
    var url = "'VCheckDocBrowse.aspx?ID=" + rowobject[0] + "&CheckDocType="+ getObj("hidCheckDocType").value + "'";
    var strHtml ="";
    if (getObj("hidDocRead").value == "Y" || $('#hidCheckDocType').val() == '0') {
        strHtml = '<div class="nowrap"><a  href="#ShowCheckDoc" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a></div>';
    }
    else {
        strHtml = cellvalue;
    }
    return strHtml;
}

function loadDept(data, textStatus)
{
    var ddlDept = getObj("ddlDept");
    ddlDept.options.length = 0;// 清空原数据
    
    var opt;
    opt = document.createElement("OPTION");
    opt.value = "";
    opt.text = "全部";
    ddlDept.add(opt, ddlDept.length);
    
    if (data.Count > 0)
    {
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name;
            ddlDept.add(opt, ddlDept.length);
        }
    }
    
    reloadData();
}

//公司改变获取流程类别 --
function ddlCorp_Change(isNotReload)
{
    $("#ddlFlowType").unbind("change");
    $("#ddlFlow").unbind("change");

    var ddlFlowType = getObj("ddlFlowType");
    ddlFlowType.options.length = 1;
    var ddlFlow = getObj("ddlFlow");
    ddlFlow.options.length = 1;

    $("#ddlFlowType").bind("change", ddlFlowType_Change);
    $("#ddlFlow").bind("change", ddlFlow_Change);
    if ($("#ddlCorp").val() != "")
    {
        ajax(
            window.location.href,
            { CorpID: $("#ddlCorp").val() },
            "html",
            function (data)
            {
                if (data != "")
                {
                    var dataArr = data.split(",");
                    for (var i = 0; i < dataArr.length; i++)
                    {
                        var opt = document.createElement("option");
                        var dArrSon = dataArr[i].split(":");
                        opt.value = dArrSon[0];
                        opt.text = dArrSon[1];
                        ddlFlowType.add(opt, ddlFlowType.length);
                    }
                }
            },
            false
    );
        }

    if (!isNotReload)
    {
        reloadData();
    }
}

//流程类别改变获取流程--
function ddlFlowType_Change()
{
   $("#ddlFlow").unbind("change");
   var ddlFlow = getObj("ddlFlow");
   ddlFlow.options.length = 1;
   $("#ddlFlow").bind("change",ddlFlow_Change);
   
   if($("#ddlFlowType").val() != "")
   {
       ajax(
           window.location.href,
           {FlowTypeID:$("#ddlFlowType").val()},
           "html",
           function(data)
           {
                if(data !="")
                {
                    var dataArr = data.split(",");                  
                    for(var i=0;i<dataArr.length;i++)
                    {
                        var dArrSon = dataArr[i].split(":");                    
                        var opt = document.createElement("option");                      
                        opt.value = dArrSon[0];
                        opt.text = dArrSon[1];
                        ddlFlow.add(opt,ddlFlow.length);
                    }          
                }               
           },
           false
       );
   }
   reloadData();
}

function ddlFlow_Change() 
{
  reloadData();
}

//表单类别
function ddlFormType_Change() {
    $("#ddlForm").unbind("change");
    var ddlForm = getObj("ddlForm");
    ddlForm.options.length = 1;
    $("#ddlForm").bind("change", ddlForm_Change);

    ajax(
        window.location.href,
        { FormTypeID: $("#ddlFormType").val() },
        "html",
        function (data) {
            if (data != "") {
                var dataArr = data.split(",");
                for (var i = 0; i < dataArr.length; i++) {
                    var dArrSon = dataArr[i].split(":");
                    var opt = document.createElement("option");
                    opt.value = dArrSon[0];
                    opt.text = dArrSon[1];
                    ddlForm.add(opt, ddlForm.length);
                }
            }
        },
        false
    );
    reloadData();
}

function ddlForm_Change() 
{
    reloadData();
}

function ddlCCState_Change()
{
    reloadData();
}

function btnSearch_Click()
{
    reloadData();
}

function ddlDept_Change()
{    
    reloadData();
}


//阅读状态
function ddlReadState_Change()
{
    //var vReadState = getObj("ddlReadState").value;
    var vReadState = $("#ddlReadState").val();

    reloadData();
}


function selectAccount(aim)
{
    var corpID = getObj("ddlCorp").value;
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?type=account&From=CheckDoc&CorpID=' + corpID, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid"+aim+"ID").value = vValue.split('|')[0];
        getObj("txt"+aim).value = vValue.split('|')[1];
        reloadData();
    }
}

//选阅读人帐号(多选)
function openSelectLookAccount() {
    var corpID = $('#ddlCorp').val();
    if ($("#ddlDept").val() != "")
    {
        corpID = $("#ddlDept").val();
    }
    var rValue = openModalWindow('../../Common/Select/VSelectAccount.aspx?Aim=ReadAccount&CorpID=' + corpID, 0, 0);
    if (!rValue)
        return;
    getObj('txtReadAccount').value = rValue.Names;
    getObj('hidReadAccountID').value = rValue.IDS;
    getObj('hidReadAccountType').value = rValue.Types;
    reloadData();
}



function ddlCheckDocType_Change()
{
    reloadData();
}

function reloadData()
{
    var corpID = getObj("ddlCorp").value;
    var year = getObj("txtYear").value;
    var projectID = getObj("ddlProject").value;
    var vKey=$("#txtKey").val();
    var deptID = getObj("ddlDept").value;
    var createAccountID = getObj("hidCreateAccountID").value;
    var leaveTypeID = getObj("ddlCheckDocType").value;
    var vStartTime = $("#txtStartFormalTime").val();
    var vEndTime = $("#txtEndFormalTime").val();
    var flowTypeID = $("#ddlFlowType").val();   //流程类别
    var flowID = $("#ddlFlow").val();
    var formTypeID = $("#ddlFormType").val();   //表单类别
    var formID = $("#ddlForm").val();
    var hidReadAccountIDS = getObj('hidReadAccountID').value; //多个阅读人帐号ID
    var ReadState = $("#ddlReadState").val();       //阅读状态
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
    var postDataObj = $('#jqgDocReadStatistics', window.document).getGridParam('postData')
    postDataObj.Year = year; 
    postDataObj.ProjectID = projectID;
    postDataObj.CorpID = corpID;
    postDataObj.KeyValue = vKey;
    postDataObj.DeptID = deptID;
    postDataObj.CheckDocTypeID = leaveTypeID;
    postDataObj.StartTime=vStartTime;
    postDataObj.EndTime=vEndTime;
    postDataObj.CreateAccountID=createAccountID;
    
    postDataObj.FlowTypeID = flowTypeID;
    postDataObj.FlowID = flowID;
    postDataObj.FormTypeID = formTypeID;
    postDataObj.FormID = formID;

    postDataObj.hidReadAccountIDS = hidReadAccountIDS;
    postDataObj.ReadState = ReadState;
    refreshJQGrid('jqgDocReadStatistics');
}

function btnEdit_Click()
{
    openModifyWindow("VManageCheckDocEdit.aspx?Aim=ManageEdit&CheckDocType=" + getObj("hidCheckDocType").value, 0, 0, "jqgDocReadStatistics");
}

function btnDelete_Click()
{
    openDeleteWindow("CheckDocManage", 1, "jqgDocReadStatistics", null,{Msg:'Y',From:'Manage'});
}

function btnDeleteAll_Click()
{
    openDeleteWindow("MyCheckDoc", 1, "jqgDocReadStatistics", null,{From:'Manage'});
}

function btnResume_Click()
{
    openResumeWindow("CheckDocManage", "jqgDocReadStatistics");
}

function btnRevision_Click()
{
    openRevisionWindow("jqgDocReadStatistics");
}

function btnAdd_Click() 
{
    openAddWindow("VMyCheckDocAdd.aspx?CheckDocType=" + getObj("hidCheckDocType").value, 0, 0, "jqgDocReadStatistics");
}

