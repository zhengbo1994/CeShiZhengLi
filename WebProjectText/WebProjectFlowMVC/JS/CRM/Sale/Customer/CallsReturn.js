// JScript 文件

function reloadData()
{
   
    var jqObj = $('#jqData', document);

    var sProjectGUID = $("#ddlProjectGUID").val();
    var sCallsTime = $("#ddlCallsTime").val();
    var sKey = getObj("txtKey").value;
   

    jqObj.getGridParam('postData').ProjectGUID = sProjectGUID;
    jqObj.getGridParam('postData').CallsTime = sCallsTime;
    jqObj.getGridParam('postData').Key = sKey;
    
   
    refreshJQGrid('jqData');
}
function showCustomerInfo(cellvalue, options, rowobject)
{
    var sProjectGUID = getObj("ddlProjectGUID").value;
    var url = "'VClientInfoAdd2.aspx?ID=" + rowobject[0] + "&ProjectGUID=" + sProjectGUID + "&JQID=" + "jqData'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

