

// 页面显示总控制器，调用按钮和查询结果容器的显示
function pageMainDisplayController(queryType)
{
	buttonDisplayController(queryType);
	queryResultDisplayController(queryType);
}


// 查询结果显示控制器。 根据查询的类型显示/隐藏相应的结果展示区域。
// 包括图类查询（搜索平面图、销控图）和锁定查询
function queryResultDisplayController(queryType)
{
	var trMapQueryResult = $('#trMapQueryResult'),
		trLockedQueryResult = $('#trLockedQueryResult');

	switch (queryType.toLocaleLowerCase())
	{
		// 平面图查询 
		case "plane":
			// 销控图查询
		case "salescontrol":
			// 意向查询
		case "intention":
			trMapQueryResult.show();
			trLockedQueryResult.hide();
			break;
		// 锁定查询 
		case "locked":
			trMapQueryResult.hide();
			trLockedQueryResult.show();
			break;
		default:
			trMapQueryResult.hide();
			trLockedQueryResult.hide();
			break;
	}
}

// 按钮显示控制器。
// 根据查询状态和类型，控制页面上的按钮显示还是隐藏
function buttonDisplayController(queryType)
{
	var tdBtnContainer = $('#tdBtnContainer'),
		allBtn = tdBtnContainer.find('button'),
		btnRefresh = $('#btnRefresh'),
		btnDisplaySetting = $('#btnDisplaySetting'),
		btnIntentionQuery = $('#btnIntentionQuery'),
		btnLockQuery = $('#btnLockQuery'),
		btnPartialUnlock = $('#btnPartialUnlock'),
		btnAllUnlock = $('#btnAllUnlock'),
		btnPrintSalesCtrlMap = $('#btnPrintSalesCtrlMap'),
		btnShowPlaneMap = $('#btnShowPlaneMap'),
		btnShowSalesCtrlMap = $('#btnShowSalesCtrlMap'),

		ddlBuilding = $('#ddlBuilding'),
		buildingGUID = ddlBuilding.val(),
	// 当前BuildingGUID对应的是楼栋而不是区域
		isBuilding = !!buildingGUID && getIsRegionPropertyValue(buildingGUID) == "N";

	setObjectVisible(allBtn, false);

	switch (queryType.toLocaleLowerCase())
	{
		case "plane":
			setObjectVisible([btnIntentionQuery, btnLockQuery], true);
			setObjectVisible(btnShowSalesCtrlMap, isBuilding);
			break;
		case "salescontrol":
			setObjectVisible([btnRefresh, btnDisplaySetting, btnIntentionQuery, btnLockQuery, btnPrintSalesCtrlMap, btnShowPlaneMap], true);
			break;
		case "intention":
			setObjectVisible([btnIntentionQuery, btnLockQuery], true);
			break;
		case "locked":
			setObjectVisible([btnIntentionQuery, btnLockQuery, btnPartialUnlock, btnAllUnlock], true);
			break;
		default:
			break;
	}
}

// 更多信息区域显示控制器
function moreInfoDisplayController(roomInfo)
{


}


function hasAttachRoom(roomInfo)
{

}



// 页面元素事件注册器
function pageElementsEventRegister()
{
	expandBtnEventRegister();
	lockedRoomNodeEventRegister();
	intentionQueryResultNodeEventRegister();
}

// 页面默认查询方法。在页面加载、选择区域/楼栋下拉框时触发
function reloadData( mapType )
{
    var projectGUID = $( "#ddlProject" ).val(),
        buildingGUID = $( "#ddlBuilding" ).val(),
		isRegion = getIsRegionPropertyValue( buildingGUID ) == "Y",
        // 显示内容设置信息
        displayContentSettingInfo = $( '#hidDisplayContentSettingInfo' ).val();

    reloadMap( projectGUID, buildingGUID, isRegion, displayContentSettingInfo, mapType );
}

// 图查询方法
function reloadMap( projectGUID, buildingGUID, isRegion, displayContentSettingInfo, mapType )
{
    var url = getCurrentUrl(),
        hidBuildingGUID = $( '#hidBuildingGUID' ),
	    // 默认情况下,即还没选择楼栋时，获取的是平面图，所以当没有传入isRegion参数时，认为获取的是平面图
		isRegion = typeof isRegion == 'undefined' ? true : isRegion,
		mapType = typeof mapType == 'undefined' ? '' : mapType,
	    // 当楼栋GUID参数不为空、当前buildingGUID对应的不是区域，且mapType的值不为plane时，查询类型为销控图，否则为平面图。
		queryType = !!buildingGUID && !isRegion && mapType.toLocaleLowerCase() != 'plane' ? 'salescontrol' : 'plane';

    // 调用页面显示控制器，确保页面内容正确显示
    pageMainDisplayController( queryType );

    hidBuildingGUID.val( buildingGUID );
    setMoreInfoVisible( false );

    ajax( url,
    {
        action: 'GetMapResult',
        ProjectGUID: projectGUID,
        BuildingGUID: buildingGUID,
        MapType: mapType,
        DisplayContentSettingInfo: displayContentSettingInfo
    }, 'html', function ( data, textStatus )
    {
        var tdMapShowField = $( '#tdMapShowField' );
        tdMapShowField.html( textStatus == 'success' ? data : "" );

        if ( textStatus == 'success' )
        {
            bindMapEvent( tdMapShowField );
        }
    }, true, 'GET' );
}

// 判断当前图是否平面图，是的话，为其中元素绑定事件
function bindMapEvent(mapContainer)
{
	var mapContainer = $(mapContainer),
        planeMapObj = mapContainer.find('#divMap');

	if (planeMapObj.length)
	{
		bindPlaneMapEvent(planeMapObj);
	}
}

// 绑定平面图事件
function bindPlaneMapEvent(mapObj)
{
	var projectGUID = $("#ddlProject").val(),
        mapCells = $(mapObj).find('div[type=mapCell]'),
        cellID,
        isRegion;

	mapCells.bind('click', function (cell)
	{
		cellID = this.cellid;
		isRegion = this.isregion == "True";

		selectBuilding(cellID);
		reloadMap(projectGUID, cellID, isRegion);
	});
}

function SetbackgroundColor( roomTD )
{
    var projectGUID = $( '#ddlProject' ).val(),
        hidBuildingGUID = $( '#hidBuildingGUID' ),
        buildingID = hidBuildingGUID.val(),
        roomTD = $( roomTD ),
        roomGUID = roomTD.attr( 'roomGUID' ),
        saleStatus = roomTD.attr( 'SaleStatus' );

    if ( !!roomTD.length )
    {
        $( 'td[selected=selected]' ).removeAttr( 'selected' ).css( 'background-color', '' );

        roomTD.attr( 'selected', 'selected' );
        roomTD.css( 'background-color', 'green' );

        selectRoomCellHandler( projectGUID, roomGUID, saleStatus );
    }
}


function selectRoomCellHandler(projectGUID, roomGUID, saleStatus)
{
    // 显示页面右侧信息区域
    showRoomInfoField();

    // 加载房间建筑信息
    loadRoomInfo( roomGUID );
    // 加载房间更多信息
    loadMoreInfo( projectGUID, roomGUID, saleStatus );
}

function loadRoomInfo( roomGUID )
{
    var _infoContainer = $( '#divRoomStructureInfo' ),
        url = "../../../CommonInfoBlocks/Sale/Project/RoomBriefInfo.aspx",
        strHtml;

    if ( !_infoContainer.length )
    {
        return false;
    }

    ajax( url,
    {
        RoomGUID: roomGUID
    }, 'json', function ( data, textStatus )
    {
        strHtml = data.Data;
        _infoContainer.html( strHtml );
    } );
}

// 加载更多信息区域内容
function loadMoreInfo( projectGUID, roomGUID, saleStatus )
{
    if ( !roomGUID )
	{
		return false;
	}

	var visibleTabCount = 0,
		currentTabIsVisible = false,
		moreInfoAreaIsVisible = false;

	// 获取销售信息
	currentTabIsVisible = loadSalesInfo( projectGUID, roomGUID, saleStatus );
	visibleTabCount += currentTabIsVisible ? 1 : 0;
	
    // 获取绑定房源信息
	currentTabIsVisible = loadAttachRoomInfo( roomGUID );
	visibleTabCount += currentTabIsVisible ? 1 : 0;
	
	// 获取置业计划信息
	currentTabIsVisible = loadMortgageSubsidySchemeInfo( projectGUID,roomGUID );
	visibleTabCount += currentTabIsVisible ? 1 : 0;
	
	// 判断是否显示更多信息框
	resetMoreInfoTabContainerVisiblility();

	// 当有选项卡可见时，显示更多信息区域，否则隐藏该区域。
	setMoreInfoVisible(visibleTabCount > 0);
	// 当多余一个选项卡可见时，显示信息选择区，否则不显示。
	setMoreInfoMenuVisible(visibleTabCount > 1);
	
	if (visibleTabCount > 1)
	{
		// 自动选择第一个选项卡
		selectFirstMoreInfoTab();
	}
}

function selectFirstMoreInfoTab()
{
	var moreInfoTabs = $('[name=TabInfo]:visible');
	moreInfoTabs.eq(0).click();
}

// 绑定房间销售信息
// 返回值为：是否显示销售信息选项卡（boolean）
function loadSalesInfo(projectGUID,roomGUID, saleStatus)
{
	var salesInfoIsVisible = false,
		divSalesInfo = $('#divSalesInfo');

	// 仅预约、认购、签约、入伙状态的房间可以看到销售信息
	if (/[4567]/.test(saleStatus))
	{
		salesInfoIsVisible = true;
		switch (+saleStatus)
		{
			case 4:
				loadRoomReservationInfo(divSalesInfo,projectGUID, roomGUID);
				break;
			case 5:
				loadSubscriptionInfo(divSalesInfo, roomGUID);
				break;
			case 6:
				loadContractInfo(divSalesInfo, roomGUID);
				break;
			case 7:
				// 这部分需求还不明确。要明确后才能做。
				break;
			default:
				salesInfoIsVisible = false;
				break;
		}
	}
	else
	{
		salesInfoIsVisible = false;
		divSalesInfo.empty();
	}
	setSalesInfoVisible(salesInfoIsVisible);
	return salesInfoIsVisible;
}

// 绑定附属房产信息
// 返回值为：是否显示附属房产列表选项卡（boolean）
function loadAttachRoomInfo(roomGUID)
{
	var attachRoomInfoIsVisible = false;
	ajaxRequest( 'FillData.ashx', { action: 'CRM_BindAttachRoomByRoomGUID', RoomGUID: roomGUID },
    'json',
    function (data)
    {
    	// 清空datagrid
    	var tb = $("table#tbAttachRoomInfo");
    	tb.empty();

    	if (data.length > 0)
    	{
    		attachRoomInfoIsVisible = true;

    		var strHtml = [];

    		for (var i = 0; i < data.length; i++)
    		{
    			strHtml.push("<TR class='table_row'>",
	                            "<TD align='left'><span class='font' style='display:block;margin:3px;'>",
                                    data[i].RoomName,
                                "</span></TD></TR>");
    		}
    		tb.append(strHtml.join(""));
    	}
    	else
    	{
    		attachRoomInfoIsVisible = false;
    	}
    }, false);

    setAttachRoomInfoVisible(attachRoomInfoIsVisible);
    return attachRoomInfoIsVisible;
}

// 绑定置业计划信息
// 返回值为：是否显示置业计划选项卡（boolean）
function loadMortgageSubsidySchemeInfo( projectGUID,roomGUID )
{
	var mortgageSubsidySchemeIsVisible = true;

	var _infoContainer = $('#divMortgageSubsidyScheme'),
        url = "../../../CommonInfoBlocks/Sale/Sales/MortgageSubsidyScheme.aspx",
        strHtml;
	
	if (!_infoContainer.length)
	{
		return false;
	}

	ajax(url,
    {
        ProjectGUID: projectGUID,
    	RoomGUID: roomGUID
    }, 'json', function (data, textStatus)
    {
    	strHtml = data.Data;
    	_infoContainer.html(strHtml);

    	btnDisplayController();
    	changePayType();
    });
	
	setMortgageSubsidySchemeVisible(mortgageSubsidySchemeIsVisible);
	return mortgageSubsidySchemeIsVisible;
}

/*------------   加载预约单相关方法   ------------*/
function loadRoomReservationInfo(infoContainer, projectGUID,roomGUID)
{
	var _infoContainer = $(infoContainer),
        url = "../../../CommonInfoBlocks/Sale/Sales/ReservationListInfo.aspx",
        strHtml;

	if (!infoContainer.length)
	{
		return false;
	}

	ajax(url,
    {
        ProjectGUID: projectGUID,
    	RoomGUID: roomGUID
    }, 'json', function (data, textStatus)
    {
    	strHtml = data.Data;
    	_infoContainer.html(strHtml);
    });
}

function buildReservationList(data)
{
	var strHtml = [];
	strHtml.push("<table class='class'>",
                    buildReservationListHeader(),
					getReservationInfoContentHtml(data),
                "</table>");
	return strHtml.join("");
}

function buildReservationListHeader()
{
	var strHtml = [];
	strHtml.push("<tr class='table_headrow'>",
        "<td>序号</td>",
        "<td>客户名称</td>",
        "<td>预约日期</td>",
        "<td>失效日期</td>",
        "<td>房间排号</td>",
        "<td>业务员</td>",
        "</tr>");
	return strHtml.join("");
}

function getReservationInfoContentHtml(data)
{
	strHtml = [];
	if (data && data.length)
	{
		for (var i = 0; i < data.length; i++)
		{
			strHtml.push("<tr>",
                    "<td>", i, "</td>",
                    "<td>", data[i].ClientName, "</td>",
                    "<td>", data[i].ReservationTime, "</td>",
                    "<td>", data[i].ReservationInvalidTime, "</td>",
                    "<td>", data[i].RoomReservationNO, "</td>",
                    "<td>", data[i].ClerkEmployeeName, "</td>",
                "</tr>");
		}
	}
	strHtml.push("<tr><td>&nbsp;</td></tr>")
	return strHtml.join("");
}

/*------------   加载认购单相关方法   ------------*/
function loadSubscriptionInfo(infoContainer,roomGUID)
{
	var _infoContainer = $(infoContainer),
        url = "../../../CommonInfoBlocks/Sale/Sales/SubscriptionBriefInfo.aspx",
        strHtml; 
	 
	ajax(url,
    {
    	RoomGUID: roomGUID
    }, 'json', function (data, textStatus)
    {
    	strHtml = data.Data;
    	_infoContainer.html(strHtml);
    });
}

/*------------   加载签约单相关方法   ------------*/
function loadContractInfo(infoContainer, roomGUID)
{
	var _infoContainer = $(infoContainer),
        url = "../../../CommonInfoBlocks/Sale/Sales/ContractBriefInfo.aspx",
        strHtml;

	ajax(url,
    {
    	RoomGUID: roomGUID
    }, 'json', function (data, textStatus)
    {
    	strHtml = data.Data;
    	_infoContainer.html(strHtml);
    });
}



// 统计更多信息区域中可见的选项卡数量
function countVisibleMoreInfoTab()
{
	return $('#divSalesInfo,#tbAttachRoomInfo,#divMortgageSubsidyScheme').not(':empty').length;
}

// 重置更多信息区域可见性
function resetMoreInfoTabContainerVisiblility()
{
	var moreInfoTabContaner = $('#tbMoreInfo'),
		visibleMoreInfoTab = countVisibleMoreInfoTab(),
		moreInfoTabContanerIsVisible = visibleMoreInfoTab > 0;

	moreInfoTabContanerIsVisible ? moreInfoTabContaner.show() : moreInfoTabContaner.hide();
	return moreInfoTabContanerIsVisible > 0;
}

// 设置更多信息区域的可见性
function setMoreInfoVisible(isVisible)
{
	setObjectVisible($('#tbMoreInfo'), isVisible);
}

// 设置更多信息区域的选择区的可见性
function setMoreInfoMenuVisible(isVisible)
{
	var ele = $('#divMoreInfoMenu').closest('tr');
	setObjectVisible(ele, isVisible);
	ele.next().css('height', isVisible ? '' : '100%');

	// 更多信息区的边框和目录的可见性要保持一致。即不显示目录时，也不现实边框
	$('#tbMoreInfo .idtabdiv').css('border-style', isVisible ? '' : 'none');
}

// 设置销售信息选项卡的可见性
function setSalesInfoVisible(isVisible)
{
	setObjectVisible(getSalesInfoElements(), isVisible);
}

// 设置附属房产选项卡的可见性
function setAttachRoomInfoVisible(isVisible)
{
	setObjectVisible(getAttachRoomInfoElements(), isVisible);
}

// 设置置业计划选项卡的可见性
function setMortgageSubsidySchemeVisible(isVisible)
{
	setObjectVisible(getMortgageSubsidySchemeInfoElements(), isVisible);
}

// 获取销售信息相关对象
function getSalesInfoElements()
{
	return $('#hlSalesInfo,#divMoreInfoTab0');
}

// 获取附属房产相关对象
function getAttachRoomInfoElements()
{
	return $('#hlAttachRoomInfo,#divMoreInfoTab1');
}

// 获取置业计划相关对象
function getMortgageSubsidySchemeInfoElements()
{
	return $('#hlMortgageSubsidyScheme,#divMoreInfoTab2');
}


//------------------ 显示内容设置相关方法 -------------------//
function btnDisplaySettingClick()
{
    var settingInfo = openModalWindow( 'VDisplayContentSetting.aspx?hidSelectedInfo=hidDisplayContentSettingInfo', 300, 400 ),
        serializatedSettingInfo = $.jsonToString( settingInfo )
        hidDisplayContentSettingInfo = $( '#hidDisplayContentSettingInfo' );

    if ( typeof settingInfo != 'undefined' )
    {
        hidDisplayContentSettingInfo.val( serializatedSettingInfo );
        reloadData();
    }   
}


//------------------ 意向查询相关方法 -------------------//
// 意向查询按钮点击事件
function btnIntentionQuery_Click()
{
	var projectGUID = $("#ddlProject").val(),
		queryCondition = openModalWindow('VIntentionQuery.aspx?ProjectGUID=' + projectGUID, 600, 400);

	if (typeof queryCondition != 'undefined')
	{
		intentionQuery(projectGUID, queryCondition);
	}
}

// 意向查询
function intentionQuery(projectGUID, queryCondition)
{
	getIntentionQueryResultHTML(projectGUID, queryCondition,
	function (queryResultHtml)
	{
		displayIntentionQueryResult(queryResultHtml)
	});
}

// 获取意向查询结果html
function getIntentionQueryResultHTML(projectGUID, queryCondition, callback)
{
	var intentionQueryResultHtml = "",
		url = getCurrentUrl(),
		priceRange = !!queryCondition ? queryCondition.priceRange : "",
		allowSaleStatus = !!queryCondition ? queryCondition.allowSaleStatus : "",
		areaRange = !!queryCondition ? queryCondition.areaRange : "",
		roomStructure = !!queryCondition ? queryCondition.roomStructure : "",
		apartment = !!queryCondition ? queryCondition.apartment : "";

	ajax(url,
    {
    	action: 'GetIntentionQueryResult',
    	ProjectGUID: projectGUID,
    	PriceRange: priceRange,
    	AllowSaleStatus: allowSaleStatus,
    	AreaRange: areaRange,
    	RoomStructure: roomStructure,
    	Apartment: apartment
    }, 'text', function (data, textStatus)
    {
    	var intentionQueryResultHtml = typeof data == 'string' ? data : "";
    	if (typeof callback == 'function')
    	{
    		callback(intentionQueryResultHtml);
    	}
    });
}

// 显示意向查询结果
function displayIntentionQueryResult(queryResultHtml)
{
	// 调用页面显示控制器，确保页面内容正确显示
	pageMainDisplayController('intention');

	var tdMapShowField = $('#tdMapShowField'),
		html = typeof queryResultHtml == 'string' ? queryResultHtml : "";

	tdMapShowField.html(html);
}

function intentionQueryResultNodeEventRegister()
{
	var tdIntentionQueryResultContainer = $('#tdMapShowField');

	tdIntentionQueryResultContainer.on('click', ' table tr td ul li', function (ev) { intentionQueryResultNodeClickEventHandler(ev); });
}

function intentionQueryResultNodeClickEventHandler(ev)
{
	var ev = ev || window.event,
		url = getCurrentUrl(),
		targetNode = $( ev.target ),
        projectGUID = $('#ddlProject').val(),
		buildingID = targetNode.closest('p').attr('buildingGUID'),
		roomTDid = targetNode.closest('span').attr('roomTDid'),
		roomGUID = targetNode.closest('span').attr('roomGUID'),
		nodesContainer = $('#tdMapShowField'),
		selectedNode = nodesContainer.find('li.selLockedRoom');

	selectedNode.removeClass('selLockedRoom');
	targetNode.closest('li').toggleClass('selLockedRoom');

	ajax(url,
    { action: 'GetRoomInfo', RoomGUID: roomGUID },
    'json',
    function (data, textStatus)
    {
        if ( data && data.length )
        {
            var projectGUID = data[0].ProjectGUID,
                roomGUID = data[0].RoomGUID,
                saleStatus = data[0].SaleStatus;

            selectRoomCellHandler( projectGUID, roomGUID, saleStatus );
        }
    });
}

//------------------ 锁定查询相关方法 -------------------//
function lockedRoomQuery()
{
	// 调用页面显示控制器，确保页面内容正确显示
	pageMainDisplayController('locked');

	var url = getCurrentUrl(),
		projectGUID = $("#ddlProject").val(),
		tdLockedQueryResultContainer = $('#tdLockedQueryResultContainer');

	ajax(url,
    {
    	action: 'LockedRoomQuery',
    	ProjectGUID: projectGUID
    }, 'html', function (data, textStatus)
    {
    	var lockedResultHtml = typeof data == 'string' ? data : "";
    	tdLockedQueryResultContainer.html(lockedResultHtml);
    });
}


function lockedRoomNodeEventRegister()
{
	var tdLockedQueryResultContainer = $('#tdLockedQueryResultContainer');

	tdLockedQueryResultContainer.on('click', ' table tr td ul li', function (ev) { lockedRoomNodeClickEventHandler(ev); });
}

function lockedRoomNodeClickEventHandler(ev)
{
	var ev = ev || window.event,
		targetNode = $(ev.target);

	targetNode.closest('li').toggleClass('selLockedRoom');
}

// 获取已选择的被锁定房间
function getSelectedLockedRoomsGUID()
{
	var selectedLockedRoomsNode = $('#tdLockedQueryResultContainer .selLockedRoom'),
		currentRoomGUID,
		roomGUIDs = [];

	selectedLockedRoomsNode.each(function (i, node)
	{
		currentRoomGUID = $(node).children().attr('roomGUID');
		roomGUIDs.push(currentRoomGUID);
	});

	return roomGUIDs;
}

// 解锁被选中房间
function manualUnlockSelectedRooms(selectedRoomGUIDs)
{
	var url = getCurrentUrl();

	ajax(url,
    {
    	action: 'ManualUnlockRooms',
    	RoomGUIDs: selectedRoomGUIDs.join()
    }, 'text', function (data, textStatus)
    {
    	// 解锁成功时没有返回信息，直接刷新锁定查询结果。
    	// 仅当操作异常时才会有返回信息。此时弹出异常信息。
    	// 为了保证数据实时性，即使遇到异常也刷新锁定查询结果。
    	if (typeof data == 'string' && data.length)
    	{
    		alert(data);
    	}
    	lockedRoomQuery();
    });
}

// 解锁部分房间（解锁选中房间）
function manualUnlockPartialRooms()
{
	var selectedRoomGUIDs = getSelectedLockedRoomsGUID();

	if (selectedRoomGUIDs.length && confirm("确定要解锁选中的房间吗？"))
	{
		manualUnlockSelectedRooms(selectedRoomGUIDs);
	}
}

// 解锁全部房间
function manualUnlockAllRooms()
{
	var lockedRoomsCount = getLockedRoomCount();

	if (lockedRoomsCount && confirm("确定要解锁全部房间吗？"))
	{
		selectAllLockedRoom();

		var selectedRoomGUIDs = getSelectedLockedRoomsGUID();
		manualUnlockSelectedRooms(selectedRoomGUIDs);
	}
}

// 选中全部锁定房间
function selectAllLockedRoom()
{
	var tdLockedQueryResultContainer = $('#tdLockedQueryResultContainer'),
		allRoomNodes = tdLockedQueryResultContainer.find('table tr td ul li');

	allRoomNodes.addClass('selLockedRoom');
}

function getLockedRoomCount()
{
	var tdLockedQueryResultContainer = $('#tdLockedQueryResultContainer'),
		allRoomNodes = tdLockedQueryResultContainer.find('table tr td ul li');

	return allRoomNodes.length;
}

//------------------ 公用方法 -------------------//

// 更多信息选项卡中，更多操作按钮点击事件
function clickMenu()
{
    var args = arguments;
    var key = args[0];
    var url = '';

    var clickEventHandler = clickMenuEventHandlers ? clickMenuEventHandlers[key] : null;
  
    if ( typeof clickEventHandler == 'function' )
    {
        clickEventHandler();
    }

    return false;
}

// 选择项目，加载楼栋
function projectChange()
{
	var projectGUID = $("#ddlProject").val();

	// post请求
	ajaxRequest('FillData.ashx', { action: 'CRM_BindBuilding', ProjectGUID: projectGUID },
    'json',
    function (data, textStatus)
    {
    	loadBuildingInfo(data, '')
    });
}

// 加载区域/楼栋下拉框
function loadBuildingInfo(data, vID)
{
	if (!!data)
	{
		bindDdl(data, 'ddlBuilding', "", "SELECT");
	}
	else
	{
		bindDdl([], "ddlBuilding", '', "SELECT");
	}

	// 重新加载楼栋
	buildingChange();
}

// 区域/楼栋下拉框改变事件
function buildingChange()
{
	reloadData();
}

function selectBuilding(buildingID)
{
	$('#ddlBuilding').val(buildingID);
}

function getIsRegionPropertyValue(buildingGUID)
{
	var isRegion = "";

	if (!!buildingGUID)
	{
		ajaxRequest('FillData.ashx', { action: 'CRM_GetBuildingIsRegionPropertyValue', BuildingGUID: buildingGUID },
		'text',
		function (data, textStatus)
		{
    		isRegion = data;
		}, false);
    }

	return isRegion;
}


// 收缩展开按钮鼠标事件注册器
function expandBtnEventRegister()
{
    $( '#btnExpand' ).hover( function ()
    {
        this.className = this.className
					.replace( /index_col/g, "index_col_on" )
					.replace( /index_exp/g, "index_exp_on" );
    }, function ()
    {
        this.className = this.className
					.replace( /index_col_on/g, "index_col" )
					.replace( /index_exp_on/g, "index_exp" );
    } )
	.click( function ()
	{
	    var currentClassName = this.className;
	    if ( /index_col/g.test( currentClassName ) )
	    {
	        hideMoreInfo();
	    }
	    else
	    {
	        showRoomInfoField();
	    }
	} );
}

// 显示更多信息
function showRoomInfoField()
{
    var btnExpand = $( '#btnExpand' )[0],
        currentClassName = btnExpand.className,
        colgroup = $( '#tbResultContainer > colgroup' );

    if ( /index_exp/g.test( currentClassName ))
    {
        btnExpand.className = currentClassName.replace( /index_exp/g, "index_col" );
    
        colgroup.find( 'col:eq(0)' ).css( 'width', '59%' );
        colgroup.find( 'col:eq(2)' ).css( 'width', '40%' );
        $( '#tdInfoField' ).show();
    }
}

// 隐藏更多信息
function hideMoreInfo()
{
    var btnExpand = $( '#btnExpand' )[0],
        currentClassName = btnExpand.className,
        colgroup = $( '#tbResultContainer > colgroup' );

    if ( /index_col/g.test( currentClassName ))
    {
        btnExpand.className = currentClassName.replace( /index_col/g, "index_exp" );

        colgroup.find( 'col:eq(0)' ).css( 'width', '99%' );
        colgroup.find( 'col:eq(2)' ).css( 'width', '0%' );
        $( '#tdInfoField' ).hide();
    }
}

function showIndexTab(index)
{
	// 调用这个方法，显示所选中的项
	//            index = 0;
	selectTab(index, "TabInfo");

	var tabCount = $('a[name=TabInfo]').length;

	for (var i = 0; i < tabCount; i++)
	{
		$('[id^=divMoreInfoTab]').not('#divMoreInfoTab' + index).css('display', 'none');
	}
	$('#divMoreInfoTab' + index).css('display', 'block');
}

// 设置对象数组是否可见
function setObjectVisible(obj, visible)
{
	if (obj)
	{
		if (typeof obj === "string")
		{
			obj = obj.split(",");
		}
		if (isIncludeJQuery() && obj instanceof jQuery)
		{
			obj.each(function ()
			{
				this.style.display = visible ? "" : "none";
			});
		}
		else if (obj.slice)
		{
			for (var i = 0; i < obj.length; i++)
			{
				var currentObj = obj[i];
				if (typeof currentObj === "string")
				{
					currentObj = getObj(currentObj);
				}
				if (currentObj)
				{
					$(currentObj).css('display', visible ? "" : "none");
				}
			}
		}
		else
		{
			obj.style.display = visible ? "" : "none";
		}
	}
}


/*--------------  查看房间锁定状态相关方法  ------------*/
// 获取房间锁定状态
function getRoomLockStatus( roomGUID )
{
    var roomLockStatus;

    ajax( 'FillData.ashx',
    {
        action: 'CRM_GetRoomLockStatus',
        RoomGUID: roomGUID
    }, 'text', function ( data, textStatus )
    {
        roomLockStatus = data || "";
    }, false, "POST" );

    return roomLockStatus;
}

function getRoomLockedAlterMsg( roomLockStatus )
{
    var alterMsg = "";

    if ( !roomLockStatus || roomLockStatus.toLocaleLowerCase() == "nolock" )
    {
        alterMsg = "未知错误";
    }
    else if ( roomLockStatus.toLocaleLowerCase() == "saleslocked" )
    {
        alterMsg = "所选房源已经被锁定，请选择其他房间";
    }
    else if ( roomLockStatus.toLocaleLowerCase() == "saleschangelocked" )
    {
        alterMsg = "所选房源正处于变更中，请选择其他房间";
    }

    return alterMsg;
}

function isRoomLocked( roomLockStatus )
{
    return roomLockStatus.toLocaleLowerCase() != "nolock";
}