/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

function reloadData()
{
	if (_PageMaster.isSearching)
	{
		return false;
	}
	else
	{
		_PageMaster.isSearching = true;
	}

	var projectGUID = $( "#ddlProjectGUID" ).val(),
        key = $( "#txtKey" ).val(),
        subscriptionTimeStart = $( "#txtSubscriptionTimeStart" ).val(),
        subscriptionTimeEnd = $( "#txtSubscriptionTimeEnd" ).val(),
        status = $( "#ddlStatus" ).val(),
        isSalesChanging = $( '#ddlIsSalesChanging' ).val(),

        query = {
            ProjectGUID: projectGUID,
            SearchText: key,
            SubscriptionTimeStart: subscriptionTimeStart,
            SubscriptionTimeEnd: subscriptionTimeEnd,
            Status: status,
            IsSalesChanging: isSalesChanging
        };

	if (loadJQGrid('jqSubscription', query))
	{
		refreshJQGrid('jqSubscription');
	}
}

function customGridComplete()
{
	_PageMaster.isSearching = false;
}

// 变更申请 单云飞 2013-3-19
function clickMenu( key )
{
    var salesOrderStatus = getJQGridSelectedRowsData( 'jqSubscription', false, 'SalesOrderStatus' );

    if ( salesOrderStatus == "3" )
    {
        return alertMsg("不能对已关闭的认购单发起变更申请");
    }

    if ( existsSalesChangingSubscription() )
    {
        return alertMsg( "所选认购单已经在变更申请中。" );
    }

    var salesOrderID = getJQGridSelectedRowsData('jqSubscription', false, 'SubscriptionGUID');
    if (salesOrderID.toString() == "") 
    {
        return alertMsg("请选择要变更的认购单");
    }
    
    var url = "../../../../CRM/Sale/Sales/" + key + ".aspx?action=Add&OrderType=S&ProjectGUID=" + $('#ddlProjectGUID').val() + "&vSaleOrderID=" + salesOrderID;
    var re = openModalWindow(url, 1050, 0);
    reloadData();     
}

// 新建认购单
function addSubscription()
{
	var ddlProjectGUID = $('#ddlProjectGUID'),
        strProjectGUID = ddlProjectGUID.val(),
        strProjectName = ddlProjectGUID.find('option[selected]').text();

	openAddWindow("../SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=S&ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURI(strProjectName),
        1000, 800, "jqSubscription");
}

// 作废认购单
function btnInvalid_Click()
{
	var url = getCurrentUrl(),
        SubscriptionGUIDs = getJQGridSelectedRowsID('jqSubscription', true);

	if (!SubscriptionGUIDs || !SubscriptionGUIDs.length)
	{
		alert("请先选择认购单。");
		return false;
	}

	if ( existsSalesChangingSubscription() )
	{
	    return alertMsg( "不能作废变更申请中的认购单。" );
	}

	if (!confirm("确认要作废您所选择的认购单吗？"))
	{
		return false;
	}

	ajax(url,
    {
    	action: 'InvalidSubscription',
    	SubscriptionGUIDs: SubscriptionGUIDs.join()
    }, 'text', function (data, textStatus)
    {
    	saveErrorMsg = data;
    	if (!!saveErrorMsg)
    	{
    		alert(saveErrorMsg);
    	}
    	else
    	{
    		alert("认购单作废成功。");
    		reloadData();
    	}
    }, true, "POST");
}

function existsSalesChangingSubscription()
{
    var isSalesChangings = getJQGridSelectedRowsData( 'jqSubscription', true, 'IsSalesChanging' );
    return isSalesChangings.join( "," ).indexOf( "Y" ) >= 0;
}


// 查看
function renderLink(cellvalue, options, rowobject)
{
	var ddlProjectGUID = $('#ddlProjectGUID'),
        strProjectGUID = ddlProjectGUID.val(),
        strProjectName = ddlProjectGUID.find('option[selected]').text();

	var url = "'../SalesOrder/VSalesOrderEdit.aspx?EditType=edit&OrderType=S&JQID=jqSubscription&ID=" + rowobject[0] +
					"&ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURI(strProjectName) + "'";

	return '<a  href="javascript:void(0)" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}


//格式化状态
function renderStatus( cellvalue, options, rowobject )
{
    switch ( cellvalue )
    {
        case '0':
            return '待审核';
        case '1':
            return '已审核';
        case '2':
            return '变更申请中';
        case '3':
            return '已关闭';
        default:
            return '未知审核';
    }
}

// 格式化是否变更中
function renderIsSalesChanging( cellvalue, options, rowobject )
{
    switch ( cellvalue )
    {
        case 'Y':
            return '是';
        case 'N':
            return '否';
        default:
            return '';
    }
}