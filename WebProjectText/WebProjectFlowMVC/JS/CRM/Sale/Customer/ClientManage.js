// JScript 文件

function saveJQGridFilters()
{ }

//条件搜索
function reloadData()
{
  
    var sKey = getObj("txtKey").value;
   
    var sProjectGUID = $('#ddlProjectGUID').val();

    var query = { "Key": sKey, "ProjectGUID": sProjectGUID,"TabIndex": window["TabIndex"] };
   
    switch (window["TabIndex"])
    {
        case 0:
        case "0":
          
            ajax(location.href, query, "json", loaddgData);
            break;
        case 1:
        case "1":
        case 2:
        case "2":
            query.action = "jqGrid";
            getObj("hidTabIndex").value = window["TabIndex"];
            if (loadJQGrid("jqGrid", query))
            {
                refreshJQGrid("jqGrid");
            }
            break;
        case 3:
        case "3":
            query.action = "jqData";
            getObj("hidTabIndex").value = window["TabIndex"];
            if (loadJQGrid("jqData", query))
            {
                refreshJQGrid("jqData");
            }
            break;
    }
}

function loaddgData(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#div0").html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

//分配客户设置
function setDistribution()
{
   
    var hidClientGUIDs = getObj('hidClientGUIDs');
    var ids = getJQGridSelectedRowsID('jqGrid', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有选择任何记录操作。");
    }
    hidClientGUIDs.value = ids.join(",");
    SelectSingleStation();

    return true;
}


//选择置业顾问岗位
function SelectSingleStation()
{
    var corpID = ''; //暂时不理 '<% = strCorpID %>';
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 800, 600);

    if (rValue != "undefined" && rValue != null)
    {
        getObj("hidStationID").value = rValue.split('|')[0];       
    }
}

//分配交易设置
function setTransaction()
{
    var hidClientGUIDs = getObj('hidClientGUIDs');
    var ids = getJQGridSelectedRowsID('jqData', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有选择任何记录操作。");
    }
    hidClientGUIDs.value = ids.join(",");
    SelectCustomerBaseInfo();
    
    return getObj("hidCustomerBaseGUID").value != "";

//    return true;
}

//客户链接
function showCustomerInfo(cellvalue, options, rowobject)
{
    var sProjectGUID = getObj("ddlProjectGUID").value;
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    var url = "'VClientInfoAdd2.aspx?ID=" + rowobject[0] + "&ProjectGUID=" + sProjectGUID + "&JQID=" + "jqGrid'";
    return '<a href="javascript:openWindow(' + url + ',1000,800)">' + cellvalue + '</a>';
}


//销售单链接
function showSalesOrderInfo(cellvalue, options, rowobject) {
    var sProjectGUID = getObj("ddlProjectGUID").value;
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    var url = "'../Sales/SalesOrder/VSalesOrderEdit.aspx?EditType=edit&JQID=jqData&ID=" + rowobject[1] + "&ProjectGUID=" + sProjectGUID ;

    if (cellvalue == "认购单") {
        url = url + "&OrderType=S'";
    }
    else {
        url = url + "&OrderType=C'";
    }

    return '<a href="javascript:openWindow(' + url + ',1000,800)">' + cellvalue + '</a>';
}

//选择客户基本信息
function SelectCustomerBaseInfo()
{

    var rValue = openModalWindow('../../../Common/Select/CRM/VSelectCustomerBaseInfo.aspx', 800, 600);
}
