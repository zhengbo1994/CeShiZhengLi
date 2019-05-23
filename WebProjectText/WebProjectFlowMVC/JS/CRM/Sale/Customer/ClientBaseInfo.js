// JScript 文件


//条件搜索
function reloadData()
{
    //    window["indxe"] = sindex;
    var sIsBusinessClient = $("#rdlIsBusinessClient input:checked").val(); //客户类型
    var sCredentialsNumber = getObj("txtCredentialsNumber").value;
    var sKey = getObj("txtKey").value;
    var sDel = getObj("txtDel").value; //联系电话
    var sClientName = getObj("txtClientName").value; //客户姓名
    var query = { "IsBusinessClient": sIsBusinessClient, "Key": sKey, "Del": sDel, "ClientName": sClientName, "CredentialsNumber": sCredentialsNumber, "index": window["index"] };
    //
    if (loadJQGrid("jqData", query))
    {
        refreshJQGrid("jqData");
    }

}


// 客户基础信息链接
function showCustomerInfo(cellvalue, options, rowobject)
{
    var url = "'VClientBaseDetailInfo.aspx?ClientBaseGUID=" + rowobject[0] + "&JQID=" + "jqData'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

