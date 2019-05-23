// VManageDoc.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-06-28

function renderLink(cellvalue,options,rowobject)
{
    var url = "'VCheckDocBrowse.aspx?ID=" + rowobject[0] + "&CheckDocType="+ getObj("hidCheckDocType").value + "'";
    var strHtml ="";
    if (getObj("hidDocRead").value == "Y" || $('#hidCheckDocType').val() != '0') {
        strHtml = '<div class="nowrap"><a  href="#ShowCheckDoc" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a></div>';
    }
    else {
        strHtml = cellvalue;
    }
    return strHtml;
}

function ddlCorp_Change()
{
    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetDeptByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadDept,
            error: ajaxError
        });
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

function ddlIsDelete_Change()
{
    var vIsDelete = getObj("ddlIsDelete").value;
    if (vIsDelete == "Y")
    {
        $("#jqgCheckDocManage").showCol("DeleteEmployeeName");
        $("#jqgCheckDocManage").showCol("DeleteDate");
        $("#jqgCheckDocManage").showCol("DeleteRemark");
        
        getObj("btnEdit_tb").style.display = "none";
        getObj("btnRevision_tb").style.display = "none";
        getObj("btnDelete_tb").style.display = "none";
        getObj("btnDeleteAll_tb").style.display = "";
        getObj("btnDeleteAll").style.display = "";
        getObj("btnResume_tb").style.display = "";
        getObj("btnResume").style.display = "";
    }
    else
    {
        $("#jqgCheckDocManage").hideCol("DeleteEmployeeName");
        $("#jqgCheckDocManage").hideCol("DeleteDate");
        $("#jqgCheckDocManage").hideCol("DeleteRemark");
        
        getObj("btnEdit_tb").style.display = "";
        getObj("btnRevision_tb").style.display = "";
        getObj("btnDelete_tb").style.display = "";
        getObj("btnDeleteAll").style.display = "none";
        getObj("btnResume_tb").style.display = "none";
    }
    
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

function ddlCheckDocType_Change()
{
    reloadData();
}

function reloadData()
{
    var corpID = getObj("ddlCorp").value;
    var year = getObj("txtYear").value;
    var projectID = "";
    if (getObj("hidCheckDocType")&&getObj("hidCheckDocType").value == "4")
    {
        projectID = getObj("ddlProject").value;
    }
    var ccState = getObj("ddlCCState").value;
    var vKey=$("#txtKey").val();
    var deptID = getObj("ddlDept").value;
    var createAccountID = getObj("hidCreateAccountID").value;
    var dealAccountID = getObj("hidDealAccountID").value;
    var leaveTypeID = getObj("ddlCheckDocType").value;
    var vStartTime=$("#txtStartTime").val();
    var vEndTime=$("#txtEndTime").val();    
    var flowTypeID = $("#ddlFlowType").val();
    var flowID = $("#ddlFlow").val();
    var formTypeID = $("#ddlFormType").val();
    var formID = $("#ddlForm").val();
    
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
    var vIsDelete = getObj("ddlIsDelete").value;
    
    $('#jqgCheckDocManage',document).getGridParam('postData').Year=year;
    $('#jqgCheckDocManage',document).getGridParam('postData').ProjectID=projectID;
    $('#jqgCheckDocManage',document).getGridParam('postData').CorpID=corpID;
    $('#jqgCheckDocManage',document).getGridParam('postData').CCState=ccState;
    $('#jqgCheckDocManage',document).getGridParam('postData').KeyValue=vKey;
    $('#jqgCheckDocManage',document).getGridParam('postData').DeptID=deptID;
    $('#jqgCheckDocManage',document).getGridParam('postData').CheckDocTypeID=leaveTypeID;
    $('#jqgCheckDocManage',document).getGridParam('postData').StartTime=vStartTime;
    $('#jqgCheckDocManage',document).getGridParam('postData').EndTime=vEndTime;
    $('#jqgCheckDocManage',document).getGridParam('postData').CreateAccountID=createAccountID;
    $('#jqgCheckDocManage',document).getGridParam('postData').DealAccountID=dealAccountID;
    $('#jqgCheckDocManage',document).getGridParam('postData').IsDelete=vIsDelete;
    
    $('#jqgCheckDocManage',document).getGridParam('postData').FlowTypeID = flowTypeID;
    $('#jqgCheckDocManage',document).getGridParam('postData').FlowID = flowID;

    $('#jqgCheckDocManage', document).getGridParam('postData').FormTypeID = formTypeID;
    $('#jqgCheckDocManage', document).getGridParam('postData').FormID = formID;
    
    refreshJQGrid('jqgCheckDocManage');
}

function btnEdit_Click()
{
    openModifyWindow("VManageCheckDocEdit.aspx?Aim=ManageEdit&CheckDocType=" + getObj("hidCheckDocType").value, 0, 0, "jqgCheckDocManage");
}

function btnDelete_Click()
{
    openDeleteWindow("CheckDocManage", 1, "jqgCheckDocManage", null,{Msg:'Y',From:'Manage'});
}

function btnDeleteAll_Click()
{
    openDeleteWindow("MyCheckDoc", 1, "jqgCheckDocManage", null,{From:'Manage'});
}

function btnResume_Click()
{
    openResumeWindow("CheckDocManage", "jqgCheckDocManage");
}

function btnRevision_Click()
{
    openRevisionWindow("jqgCheckDocManage");
}

function btnAdd_Click() 
{
    openAddWindow("VMyCheckDocAdd.aspx?CheckDocType=" + getObj("hidCheckDocType").value, 0, 0, "jqgCheckDocManage");
}

// 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Export":
            window.document.getElementById('btnExport').click();
            break;
        case "Aware":
            btnLook_Click();
            break;
    }
}