//说明：主要 用于付款方式引入
//作者：常春侠
//时间：2013-6-18 10:50:39

function reloadData() {
    var projID = $("#ddlProject").val();
    var key = $("#txtKey").val();
    var query = { ProjectID: projID, Key: key };
    if (loadJQGrid("jqGridpt", query)) {
        refreshJQGrid("jqGridpt");
    }
}
//选择项目--方便后续扩展
function project_change() {
    reloadData();
}
//点击搜索按钮--方便后续扩展
function search_click() {
    reloadData();
}
function choosePayType()
{
    var projID = $("#hidProjectID").val();
    var isMultiSelect = checkJQGridEnableMultiSel("jqGridpt");
    var payTypeIDs = getJQGridSelectedRowsID("jqGridpt", isMultiSelect, "PayTypeGUID");
    var payTypeNames = getJQGridSelectedRowsData("jqGridpt", isMultiSelect, "PayTypeName");
   // alert(payTypeIDs);
    if ("" == payTypeIDs) 
    {
        return alertMsg("请选择付款方式！");
    }

    var returnData = {};
    var _payTypeIDs = [];
    var _payTypeNames = [];

    if (isMultiSelect) 
    {
        for (var i = 0; i < payTypeIDs.length; i++) 
        {
            if (payTypeIDs[i] != "") 
            {
                _payTypeIDs.push(stripHtml(payTypeIDs[i]));
                _payTypeNames.push(stripHtml(payTypeNames[i]));
            }
        }
        returnData = {
                        ProjectID: projID,
                        PayTypeID: _payTypeIDs.join(','),
                        PayTypeName:_payTypeNames.join(',')
                     };
    }
    else 
    {
        returnData = {
                        ProjectID: projID,
                        PayTypeID: stripHtml(payTypeIDs),
                        PayTypeName: stripHtml(payTypeNames)
                      };
     }
                window.returnValue = returnData;
                window.close();
 }