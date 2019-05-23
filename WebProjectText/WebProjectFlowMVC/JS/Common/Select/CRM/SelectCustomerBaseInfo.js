// 选择客户信息VSelectCustomerInfo.aspx用到的js
// 作者：程镇彪
// 日期：2012-12-17

// 选择客户
function selectClient(bClose)
{
	var vClientBaseGUID = getJQGridSelectedRowsID('jqData', true);
	var vClientName = getJQGridSelectedRowsData('jqData', true, 'ClientName');

	if (vClientBaseGUID.length == 0) //为0说明是单选
	{
		vClientBaseGUID = getJQGridSelectedRowsData("jqData", false, 'ClientBaseGUID');
		vClientName = getJQGridSelectedRowsData('jqData', false, 'ClientName');
	}

	if (typeof (vClientBaseGUID) == "undefined" || vClientBaseGUID == "")
	{
		return alertMsg('请选择客户。');
	}
	var ids = [];
	var names = [];

	for (var i = 0; i < vClientBaseGUID.length; i++)
	{
		if (vClientBaseGUID[i] != "")
		{
			ids.push(vClientBaseGUID[i]);
			names.push($.jgrid.stripHtml(vClientName[i]));
		}
	}

	var customerBaseInfo = {
		ClientBaseGUID: ids.join(","),
		ClientName: names.join(",")
	};

	// 如果调用页面需要js验证方法的，可以通过url传入，在此进行调用验证。
	var validFnName = getParamValue("validFn");
	if (typeof parent.dialogArguments[validFnName] == 'function')
	{
		if (!parent.dialogArguments[validFnName](customerBaseInfo))
		{
			return false;
		}
	}

	window.returnValue = customerBaseInfo;

	window.close();
}

// 刷新数据
function reloadData()
{
    var sIsBusinessClient = getObj("ddlIsBusinessClient").value;// $("#rdlIsBusinessClient input:checked").val();
    var query = { IsBusinessClient:sIsBusinessClient, Key: getObj("txtKey").value };

    if (loadJQGrid("jqData", query))
    {
        
        refreshJQGrid("jqData");
    }
}

function ChangeBackColor(span)
{
    var selectedObj = $('.selNode');
    selectedObj.removeClass("selNode");
    selectedObj.addClass("normalNode");
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

// 客户基础信息链接
function showCustomerInfo(cellvalue, options, rowobject)
{

    var url = "'../../../CRM/Sale/Customer/VClientBaseDetailInfo.aspx?ClientBaseGUID=" + rowobject[0] + "&JQID=" + "jqData'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}
