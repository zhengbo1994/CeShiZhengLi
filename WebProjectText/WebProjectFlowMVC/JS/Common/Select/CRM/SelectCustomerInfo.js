// 选择客户信息VSelectCustomerInfo.aspx用到的js
// 作者：程镇彪
// 日期：2012-11-21

// 选择客户
function selectClient()
{
    window.returnValue =
    {
        ClientBaseGUID: getJQGridSelectedRowsData("jqData", false, "ClientBaseGUID"),
        ClientGUID: getJQGridSelectedRowsData("jqData", false, "ClientGUID"),
        ClientName: stripHtml(getJQGridSelectedRowsData("jqData", false, "ClientName")),
        ClientSex: getJQGridSelectedRowsData("jqData", false, "ClientSex"),
        MobileNumber: getJQGridSelectedRowsData("jqData", false, "MobileNumber"),
        IsOwner: getJQGridSelectedRowsData("jqData", false, "IsOwner"),
        ClientSourceType: getJQGridSelectedRowsData("jqData", false, "ClientSourceType"),
        ClientStatus: getJQGridSelectedRowsData("jqData", false, "ClientStatus"),
        LiveAreaConfigItemGUID: getJQGridSelectedRowsData("jqData", false, "LiveAreaConfigItemGUID"),
        StationName: getJQGridSelectedRowsData("jqData", false, "StationName")
    };

    window.close();

}


// 刷新数据
function reloadData()
{
	var projectGUID = $('#hdProjectGUID').val(),
			keyworkd = $('#txtKey').val(),
			query = { ProjectGUID: projectGUID, Key: keyworkd };

	if (loadJQGrid("jqData", query))
	{
		refreshJQGrid("jqData");
	}
}

// 下一步
function NextStep()
{
    var clientGUID = getJQGridSelectedRowsData("jqData", false, "ClientGUID"); ;
    var clientBaseGUID = getJQGridSelectedRowsData("jqData", false, "ClientBaseGUID");
    var clientInfoFn = GetQueryString("clientInfoFn");
    var projectGUID = GetQueryString("ProjectGUID");
    var clientName = getObj("txtKey").value;

    if (clientBaseGUID != "")
    {
        this.window.location.href('../../../CRM/Sale/Customer/CustomerBase/ClientBaseData.aspx?ID=' + clientGUID + '&BaseID=' + clientBaseGUID + '&clientInfoFn=' + clientInfoFn + '&ProjectGUID=' + projectGUID + '&ClientName=' + clientName);
    }
    else
    {
        return alertMsg("没有选择任何记录操作。");
    }
}

// 获取URL参数值
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}     

