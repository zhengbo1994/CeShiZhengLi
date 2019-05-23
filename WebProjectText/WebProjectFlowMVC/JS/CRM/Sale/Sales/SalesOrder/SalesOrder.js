// 空guid
var EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

function btnSubscriptionToContract_Click()
{
    var subscriptionGUID = getParamValue( 'ID' ),
        JQID = getParamValue( 'JQID' ),
        projectGUID = getParamValue( 'ProjectGUID' );

    location.href = "../SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=C&ProjectGUID=" + projectGUID +
        "&SubscriptionGUID=" + subscriptionGUID +
        "&JQID=" + JQID;
}


// 提交验证方法
function validate()
{
    var isValid = true;
    handleBtn( false );

    if ( $.ideaValidate() )
    {
        var StartDate = $( "#txtSalesOrderTime" ).val(),
			EndDate = $( "#txtSalesOrderInvalidTime" ).val(),
			hidClientBaseGUID = $( '#hidClientBaseGUID' ),
			clientBaseGUID = hidClientBaseGUID.val(),
			recommendClientBaseGUID = $( '#hidRecommendClient' ).val(),
			saveErrorMsg = "";

        if ( clientBaseGUID == recommendClientBaseGUID )
        {
            isValid = alertMsg( "客户和推荐人不能是同一个人,请重新选择推荐人。", hidClientBaseGUID[0] );
        }

        if ( isValid && compareDate( StartDate, EndDate ) == -1 )
        {
            isValid = alertMsg( "失效日期必须大于开始日期。", getObj( "txtSalesOrderInvalidTime" ) );
        }

        if ( isValid && !checkExistProperty() )
        {
            isValid = alertMsg( "请至少添加一名权益人", null );
        }

        handleBtn( true );

        // 记录房间折后总价
        recordRoomDiscountPrice();
        // 记录附属房产信息
        recordAttachRooms();
        // 记录权益人信息
        recordPropertyID();

        return isValid;
    }
    else
    {
        handleBtn( true );
        return false;
    }
    return true;
}


//---------  基础信息部分的金额信息部分  -----------//

// 页面加载控制器
function pageLoadingController()
{
    var salesOrderType = $( '#hidSalesOrderType' ).val(),
		reservationGUIDInUrl = getParamValue( 'ReservationGUID' ),
		subscriptionGUIDInUrl = getParamValue( 'SubscriptionGUID' ),
		roomGUID = getParamValue( 'RoomGUID' ),
		editType = getParamValue( 'EditType' );

    if ( editType.toLocaleLowerCase() == 'add' )
    {
        if ( !!reservationGUIDInUrl )
        {
            pageLoadFromReservation( reservationGUIDInUrl );
        }
            // url中存在认购单ID,且OrderType等于C时，说明当前页面是由认购单转签约而来
        else if ( !!subscriptionGUIDInUrl && salesOrderType.toLocaleUpperCase() == "C" )
        {
            pageLoadFromSubscription( subscriptionGUIDInUrl );
        }
        else if ( !!roomGUID )
        {
            pageLoadByRoom( roomGUID );
        }
        else
        {
            normalPageLoad();
        }
    }
    else
    {
        normalPageLoad();
    }

    setTotalPriceCtrlsEditable();

    setFormEditable();
}

// 页面来自预约单时的页面加载方法
function pageLoadFromReservation( reservationGUID )
{
    var reservationInfo = getReservationInfo( reservationGUID ),
		clientGUID = !!reservationInfo ? reservationInfo.ClientGUID : "",
		roomGUID = !!reservationInfo ? reservationInfo.RoomGUID : "",
		clientDemandInfo = getClientInfo( clientGUID ),
		hasRoomInReservation = roomGUID != EMPTY_GUID,
		// 当预约单没有选中房间时，不需要将选择房间按钮失效
		needDisabledElementsSelector = hasRoomInReservation ? "#btnClientName,#btnRoomName" : "#btnClientName";
    
    $( needDisabledElementsSelector ).attr( 'disabled', 'disabled' );

    fillClientInfo( clientDemandInfo );

    if ( hasRoomInReservation )
    {
        onRoomSelectedHandler( roomGUID );
    }
}

// 页面来自签约单时的页面加载方法
function pageLoadFromSubscription( subscriptionGUID )
{
    $( '#btnClientName,#btnRoomName,#btnAddProperty,#btnDeleteProperty' ).attr( 'disabled', 'disabled' );

    normalPageLoad();
}

function getReservationInfo( reservationGUID )
{
    var url = getCurrentUrl(),
		reservationInfo;

    ajax( url,
    {
        action: 'GetReservationInfo',
        ReservationGUID: reservationGUID
    }, 'json', function ( data, textStatus )
    {
        reservationInfo = data;
    }, false, "POST" );

    return reservationInfo;
}

function pageLoadByRoom( roomGUID )
{
    onRoomSelectedHandler( roomGUID );
    $( '#btnRoomName' ).attr( 'disabled', 'disabled' );
}


function normalPageLoad()
{
    var roomGUID = $( '#hidRoomGUID' ).val(),
        projectGUID = $( '#hidProjectGUID' ).val(),
	    //keyID = getParamValue( 'ID' ),
        //subscriptionGUID = getParamValue( 'SubscriptionGUID' ),
        // 当url中有认购单ID参数时，表示当前处于认购单转签约单操作中，此时使用该参数值，否则使用当前销售单ID值。
        attachedRoomOrderID = getParamValue( 'SubscriptionGUID' ) || getParamValue( 'ID' )
        payTypeGUID = $( '#hidPayTypeGUID' ).val();

    // 绑定系统配置信息
    bindConfigInfo( roomGUID, 'hidContainNumTypeArr', _PageMaster.baseInfoCtrlTypeMapping );

    // 绑定贷款信息
    bindLendingAreaInfo( 'pageload', payTypeGUID );

    // 显示折扣说明
    exportDiscountFormulaDescription();
    // 加载附属房产列表
    bindAttachRoomInfo( roomGUID, null, 'detail', 'TSalesOrder', attachedRoomOrderID );
    // 加载权益人列表
    loadPropertyList();
    // 绑定补差方案
    var ddlMakeUpMoneyProgram = $( '#ddlMakeUpMoneyProgram' ),
                hidMakeUpMoneyProgramGUID = $( '#hidMakeUpMoneyProgramGUID' );

    ddlMakeUpMoneyProgram.bind( 'change', makeUpMoneyProgramChange );

    bindMakeUpMoneyProgram( projectGUID, function ()
    {
        ddlMakeUpMoneyProgram.val( hidMakeUpMoneyProgramGUID.val() );
    } );
}

// 设置表单是否可编辑
function setFormEditable()
{
    var pageEditable = $( '#hidPageEditable' ).val();

    if ( pageEditable == "N" )
    {
        disabledFormElements( 'tblForm' );
    }
}

// 设置成家哦总价相关的文本框是否可编辑
// 相关文本框包括： 建筑成交单价、套内成交单价、折扣、房间总价
function setTotalPriceCtrlsEditable()
{
    var allowManualEntryTotalPrice = $( '#hidAllowManualEntryTotalPrice' ).val(),
		totalPriceRelatedCtrls = $( '#txtSaleDiscountRate,#txtConstructionTransactionUnitPrice,#txtInternalTransactionUnitPrice,#txtRoomDiscountPrice' );

    if ( allowManualEntryTotalPrice == "Y" )
    {
        totalPriceRelatedCtrls.removeAttr( 'disabled' ).bind( 'blur', function ()
        {
            calRoomForSalesPriceInfo( this );
        } );
    }
    else
    {
        totalPriceRelatedCtrls.attr( 'disabled', 'disabled' ).unbind( 'blur' );
    }
}


// 选择客户
function selectClientName()
{
    var strProjectGUID = getParamValue( 'ProjectGUID' ),
        strProjectName = getParamValue( 'ProjectName' );

    // 因为openWindow方法没有返回值，无法获取返回值后执行回调函数，这里只能将回调函数名当作url参数（clientInfoFn）传入弹出页，在弹出页中执行。
    openWindow( '../../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ClientType=Client&ProjectGUID=' + strProjectGUID +
        '&clientInfoFn=fillClientInfo' +
        "&ProjectName=" + encodeURI( strProjectName ), 800, 600 );
}



// 填充客户信息
function fillClientInfo( clientData )
{
    getClientBaseInfo( clientData, function ( baseClientInfo )
    {
        var clientGUID = !!baseClientInfo ? baseClientInfo.ClientGUID : "",
        clientBaseGUID = !!baseClientInfo ? baseClientInfo.ClientBaseGUID : "",
        clientName = !!baseClientInfo ? baseClientInfo.ClientName : "",
        tel = !!baseClientInfo ? baseClientInfo.MobileNumber : "";

        getObj( "hidClientGUID" ).value = clientGUID;
        getObj( "hidClientBaseGUID" ).value = clientBaseGUID;
        getObj( "txtClientName" ).value = clientName;
        getObj( "txtTel" ).value = tel;

        // 选择客户后，默认将客户添加到权益人列表
        addClientIntoPropertiesList( baseClientInfo );
    } );
}

// 将选择的客户添加进权益人列表
function addClientIntoPropertiesList( clientBaseInfo )
{
    var clientBaseGUID = !!clientBaseInfo ? clientBaseInfo.ClientBaseGUID : "";

    if ( !checkCurrentPropertyHasAdded( clientBaseGUID ) )
    {
        addPropertyIntoList( clientBaseInfo );
    }
}

// 获取基础客户信息
function getClientBaseInfo( clientData, callback )
{
    var clientGUID = !!clientData ? clientData.ClientGUID : "",
		clientBaseGUID = !!clientData ? clientData.ClientBaseGUID : "";

    ajaxRequest( 'FillData.ashx',
    {
        action: "CRM_GetClientBaseInfo",
        ClientBaseID: clientBaseGUID
    },
    'json', function ( data, status )
    {
        var clientBaseInfo = !!data ? data[0] : null;
        if ( clientBaseInfo != null )
        {
            mergeJsonData( clientBaseInfo, { ClientGUID: clientGUID }, true );
        }

        if ( typeof callback == 'function' )
        {
            callback( clientBaseInfo );
        }
    } );
    return false;
}

// 获取机会客户信息
function getClientInfo( clientGUID )
{
    var clientDemandInfo = {};
    ajaxRequest( 'FillData.ashx',
    {
        action: "CRM_GetClientInfo",
        ClientID: clientGUID
    },
    'json', function ( data, status )
    {
        clientDemandInfo = !!data ? data[0] : {};
    }, false );

    return clientDemandInfo;
}


// 验证所选房间是否有效
function isValidSalesOrderRoom( rooms )
{
    if ( !rooms || !rooms.length )
    {
        return false;
    }

    var orderType = getParamValue( 'OrderType' ),
        orderName = orderType == "S" ? "认购" : "签约",
        selectedRoom = rooms[0],
        selectedRoomSalesStatus = selectedRoom.SaleStatus,
		isAttachedRoom = selectedRoom.IsAttachedRoom,
        currentAttachRoomGUIDs = $( '#currentAttachRoomGUIDs' ).val(),
        roomLockStatus = getRoomLockStatus( selectedRoom.RoomGUID ),
        roomLockedAlterMsg;

    if ( !/[34]/.test( selectedRoomSalesStatus ) )
    {
        return alertMsg( "只能选择待售、预约状态的房源" );
    }
    // 锁定房间，若房间已被锁定，则返回锁定失败，并弹出提示信息
    else if ( isRoomLocked( roomLockStatus ) )
    {
        roomLockedAlterMsg = getRoomLockedAlterMsg( roomLockStatus );
        return alertMsg( roomLockedAlterMsg );
    }
    else if ( isAttachedRoom == "Y" )
    {
        return alertMsg( "所选房间是其他房间的附属房产，不能对附属房产进行" + orderName + "，请选择其他房间" );
    }
    else if ( !!currentAttachRoomGUIDs && currentAttachRoomGUIDs.indexOf( selectedRoom.RoomGUID ) >= 0 )
    {
        return alertMsg( "该房间已经被选为附属房产，请先将该房间从附属房产列表中删除，再重新选择该房间。" );
    }

    return true;
}

// 获取房间锁定状态
function getRoomLockStatus(roomGUID)
{
    var strID = $( '#hidID' ).val(),
        roomLockStatus;

    ajax( 'FillData.ashx',
    {
        action: 'CRM_GetRoomLockStatus',
        ID: strID,
        RoomGUID: roomGUID
    }, 'text', function ( data, textStatus )
    {
        roomLockStatus = data || "";
    }, false, "POST" );

    return roomLockStatus;
}

function getRoomLockedAlterMsg(roomLockStatus)
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

function isRoomLocked(roomLockStatus)
{
    return roomLockStatus.toLocaleLowerCase() != "nolock";
}

//function isRoomLocked(roomGUID)
//{
//    var url = getCurrentUrl(),
//        strID = $( '#hidID' ).val(),
//        isLock = false;

//    ajax( url,
//    {
//        action: 'isRoomLocked',
//        ID: strID,
//        RoomGUID: roomGUID
//    }, 'text', function ( data, textStatus )
//    {
//        isLock = data.toLocaleLowerCase() == 'true';
//    }, false, "POST" );

//    return isLock;
//}

function lockRoom( roomGUID )
{
    var strID = $( '#hidID' ).val(),
        lockSuccess = false;

    ajax( 'FillData.ashx',
    {
        action: 'CRM_LockRoom',
        ID: strID,
        RoomGUID: roomGUID
    }, 'text', function ( data, textStatus )
    {
        lockSuccess = data.toLocaleLowerCase() == 'true';
    }, false, "POST" );

    return lockSuccess;
}

// 选择房间
function selectRoomName()
{
    var hidProjectGUID = $( '#hidProjectGUID' ),
        projectGUID = hidProjectGUID.val(),
        data = openModalWindow( '../../../../Common/Select/CRM/VSelectRoomInfo.aspx?ProjectGUID=' + projectGUID +
            '&validFn=isValidSalesOrderRoom', 800, 600 );

    if ( !data )
    {
        return false;
    }
    else
    {
        onRoomSelectedHandler( data[0].RoomGUID );
    }
}

// 选择房间处理程序
function onRoomSelectedHandler( roomGUID )
{
    var q = $( document ),
        action = 'selectRoom',
        keyID = getParamValue( 'ID' ),
        selectedRoomSuccess;

    q.queue( action, function ()
    {
        // 选中房间后，对房间进行锁定操作
        selectedRoomSuccess = lockRoom( roomGUID );
        if ( selectedRoomSuccess )
        {
            q.dequeue( action );
        }
        else
        {
            alertMsg( '房间已经被锁定，请选择其他房间' );
            q.clearQueue( action );
        }
    } ).queue( action, function ()
    {
        // 绑定系统配置信息
        bindConfigInfo( roomGUID, 'hidContainNumTypeArr', _PageMaster.baseInfoCtrlTypeMapping, function ()
        {
            q.dequeue( action );
        } );
    } ).queue( action, function ()
    {
        // 绑定房间信息
        getRoomInfo( roomGUID, function ( roomData )
        {
            // 清空折扣信息
            clearDiscountDetail();
            // 填充房间信息
            fillRoomInfo( roomData );
            q.dequeue( action );
        } );
    } ).queue( action, function ()
    {
        // 绑定付款方式下拉框          
        rebindPayType( roomGUID, function ()
        {
            changePayType();
            q.dequeue( action );
        } );
    } ).queue( action, function ()
    {
        // 绑定附属房产信息        
        bindAttachRoomInfo( roomGUID, function ()
        {
            q.dequeue( action );
        }, 'room', 'TSalesOrder', keyID );
    } ).queue( action, function ()
    {
        // 触发计算所有金额信息
        recalculatedRoomSalesInformation();
        q.dequeue( action );
    } ).queue( action, function ()
    {
        var strSalesType = $( '#hidSalesOrderType' ).val();

        if ( strSalesType == "C" )
        {
            var hidProjectGUID = $( '#hidProjectGUID' ),
				projectGUID = hidProjectGUID.val();

            // 绑定补差方案下拉框
            bindMakeUpMoneyProgram( projectGUID, function ()
            {
                var ddlMakeUpMoneyProgram = $( '#ddlMakeUpMoneyProgram' ),
					hidMakeUpMoneyProgramGUID = $( '#hidMakeUpMoneyProgramGUID' );
                // 重新绑定后要重置补差方案的值
                hidMakeUpMoneyProgramGUID.val( ddlMakeUpMoneyProgram.val() );

                q.dequeue( action );
            } );
        }
        else
        {
            q.dequeue( action );
        }
    } ).dequeue( action );
}

// 获取房间信息
function getRoomInfo( roomGUID, callback )
{
    ajaxRequest( 'FillData.ashx', { action: "CRM_GetRoomInfo", RoomGUID: roomGUID },
    'json', function ( data, status )
    {
        if ( typeof callback == 'function' )
        {
            callback( data[0] );
        }
    } );
}

// 填充房间信息
function fillRoomInfo( roomData )
{
    var roomGUID = !!roomData ? roomData.RoomGUID : "",
        roomName = !!roomData ? roomData.RoomName : "",

        roomStructureName = !!roomData ? roomData.RoomStructureName : "",
        areaStatus = !!roomData ? roomData.AreaStatus : "",
		areaStatusName = !!roomData ? roomData.AreaStatusName : "",
        forSaleConstructionArea = !!roomData ? roomData.NowConstructionArea : "",   // 获取房间当前面积
        forSaleInternalArea = !!roomData ? roomData.NowInternalArea : "",           // 获取房间当前面积
        salePriceType = !!roomData ? roomData.SalePriceType : "",
        forSaleTotalPrice = !!roomData ? roomData.ForSaleTotalPrice : "",
        roomTotalPrice = forSaleTotalPrice,
		discountGUID = getDiscountGUID( roomGUID );

    // 获取房间建筑信息和价格信息
    getObj( "txtRoomName" ).value = roomName; 					// 房间名称
    getObj( "hidRoomGUID" ).value = roomGUID; 					// 房间GUID        
    getObj( "txtRoomStructureName" ).value = roomStructureName; // 房屋结构     
    getObj( "hidAreaStatus" ).value = areaStatus; 				// 面积状态代码
    getObj( "txtAreaStatus" ).value = areaStatusName; 			// 面积状态名称    

    getObj( "txtForSaleConstructionArea" ).value = forSaleConstructionArea; // 建筑面积
    getObj( "txtForSaleInternalArea" ).value = forSaleInternalArea; // 套内面积
    getObj( "txtForSaleConstructionUnitPrice" ).value = calUnitPrice( roomTotalPrice, forSaleConstructionArea ); // 建筑单价
    getObj( "txtForSaleInternalUnitPrice" ).value = calUnitPrice( roomTotalPrice, forSaleInternalArea ); // 套内单价
    bindListControlValue( 'rdlSalePriceType', 'radio', salePriceType ); // 计价方式
    getObj( "txtRoomTotalPrice" ).value = roomTotalPrice; // 标准总价
    getObj( "hidDiscountGUID" ).value = discountGUID; // 折扣方案

    //// 计算折后价格信息，包括房间总价、成交单价、折扣率等。
    //recalculatedRoomSalesInformation();

    // 完成值的输入后，根据系统设置格式化基础信息区域的数字控件的值
    FormatNumberCtrlsValue( _PageMaster.baseInfoCtrlTypeMapping );
}

/* 计算房间销售价格信息，如成交单价、房间总价（折后）
当“建筑成交单价”、“套内成交单价”、“房间总价”其中一个价格被改动时，自动计算另外两个价格。
*/
function calRoomForSalesPriceInfo( updatedCtrl )
{
    var txtSaleDiscountRate = $( '#txtSaleDiscountRate' ),

        rdlSalePriceType = $( '[id$=rdlSalePriceType]' ),
        txtSaleDiscountRate = $( '#txtSaleDiscountRate' ),
        txtConstructionTransactionUnitPrice = $( '#txtConstructionTransactionUnitPrice' ),
        txtInternalTransactionUnitPrice = $( '#txtInternalTransactionUnitPrice' ),
        txtRoomDiscountPrice = $( '#txtRoomDiscountPrice' ),

        roomTotalPrice = $( '#txtRoomTotalPrice' ).val(),
        forSaleConstructionArea = $( '#txtForSaleConstructionArea' ).val(),
        forSaleInternalArea = $( '#txtForSaleInternalArea' ).val(),

        constructionTransactionUnitPrice,
        internalTransactionUnitPrice,
        discountRate,
        originalDiscountPrice,
        newestManuallyAdjustPrice,
        roomDiscountPrice;

    // 被修改的是折扣
    if ( $( updatedCtrl ).attr( 'id' ) == txtSaleDiscountRate.attr( 'id' ) )
    {
        originalDiscountPrice = txtRoomDiscountPrice.val();
        discountRate = txtSaleDiscountRate.val();

        roomDiscountPrice = calPriceByPercent( roomTotalPrice, discountRate );

        constructionTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleConstructionArea );
        internalTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleInternalArea );
    }
    // 被修改的是建筑成交单价
    if ( $( updatedCtrl ).attr( 'id' ) == txtConstructionTransactionUnitPrice.attr( 'id' ) )
    {
        originalDiscountPrice = txtRoomDiscountPrice.val();
        constructionTransactionUnitPrice = $( updatedCtrl ).val();
        roomDiscountPrice = accMul( constructionTransactionUnitPrice, forSaleConstructionArea );
        internalTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleInternalArea );

    }
        // 被修改的是套内成交单价
    else if ( $( updatedCtrl ).attr( 'id' ) == txtInternalTransactionUnitPrice.attr( 'id' ) )
    {
        originalDiscountPrice = txtRoomDiscountPrice.val();
        internalTransactionUnitPrice = $( updatedCtrl ).val();
        roomDiscountPrice = accMul( internalTransactionUnitPrice, forSaleInternalArea );
        constructionTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleConstructionArea );
    }
        // 被修改的是房间总价
    else if ( $( updatedCtrl ).attr( 'id' ) == txtRoomDiscountPrice.attr( 'id' ) )
    {
        originalDiscountPrice = txtRoomDiscountPrice.attr( 'originalValue' );
        txtRoomDiscountPrice.removeAttr( 'originalValue' );

        roomDiscountPrice = $( updatedCtrl ).val();
        constructionTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleConstructionArea );
        internalTransactionUnitPrice = accDiv( roomDiscountPrice, forSaleInternalArea );
    }

    // 计算房间总价折扣率
    discountRate = calPercent( roomDiscountPrice, roomTotalPrice );

    // 设置房间销售信息（包括成交单价、折扣率、房间总价），并获取根据数字控件格式化信息格式化后的实际值
    discountRate = setNumberCtrlValue( txtSaleDiscountRate, discountRate );
    constructionTransactionUnitPrice = setNumberCtrlValue( txtConstructionTransactionUnitPrice, constructionTransactionUnitPrice );
    internalTransactionUnitPrice = setNumberCtrlValue( txtInternalTransactionUnitPrice, internalTransactionUnitPrice );
    roomDiscountPrice = setNumberCtrlValue( txtRoomDiscountPrice, roomDiscountPrice );

    // 更新折扣信息中的手工调整项
    originalDiscountPrice = originalDiscountPrice ? originalDiscountPrice : 0;
    newestManuallyAdjustPrice = accSub( originalDiscountPrice, roomDiscountPrice );

    addManuallyAdjustPrice( newestManuallyAdjustPrice );
    exportDiscountFormulaDescription();

    // 触发计算摘要部分的金额信息
    bindSummaryMoneyInfo();
}

// 将最新的手工调整记录添加到折扣信息中
function addManuallyAdjustPrice( adjustPrice )
{
    if ( isNaN( adjustPrice ) || Number( adjustPrice ) === 0 )
    {
        return false;
    }

    var hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' ),
        discountDetailInfoArray = $.parseJSON( hidDiscountInfoContainer.val() ),
        discountDetailInfoArray = isArray( discountDetailInfoArray ) ? discountDetailInfoArray : [],
        existManuallyAdjustItem = !!discountDetailInfoArray
                                    && isArray( discountDetailInfoArray )
                                    && discountDetailInfoArray.length > 0
                                    && discountDetailInfoArray[discountDetailInfoArray.length - 1]['DiscountDetailName'] == "手工调整",
        manuallyAdjustItem,
        manuallyAdjustItemPrice,
        manuallyAdjustItemName = '手工调整',
        manuallyAdjustItemDiscountType = 3,
        manuallyAdjustItemDiscountTypeName = '总价优惠',
        manuallyAdjustItemIsAllowAdjust = 'Y',
        manuallyAdjustItemRankNo = 9999,
        manuallyAdjustItemRemark = '手工调整价格或者直接修改折扣值产生的折扣项';

    if ( existManuallyAdjustItem )
    {
        manuallyAdjustItem = discountDetailInfoArray.pop();
    }
    else
    {
        manuallyAdjustItem = {
            DiscountDetailGUID: '',
            DiscountDetailName: manuallyAdjustItemName,
            DiscountType: manuallyAdjustItemDiscountType,
            DiscountTypeName: manuallyAdjustItemDiscountTypeName,
            DiscountRate: 0,
            DiscountMoney: 0,
            IsAllowAdjust: manuallyAdjustItemIsAllowAdjust,
            RankNo: manuallyAdjustItemRankNo,
            Remark: manuallyAdjustItemRemark
        };
    }
    manuallyAdjustItem.DiscountMoney = accAdd( manuallyAdjustItem.DiscountMoney, adjustPrice );

    // 当手动调整金额为0时，不将手动调整折扣项推入折扣信息数组。相当于移除手动调整
    if ( manuallyAdjustItem.DiscountMoney != 0 )
    {
        discountDetailInfoArray.push( manuallyAdjustItem );
    }

    hidDiscountInfoContainer.val( $.jsonToString( discountDetailInfoArray ) );
}


// 计算房间折扣价格信息，包括房间总价、成交单价、折扣率等。
function recalculatedRoomSalesInformation()
{
    var txtForSaleConstructionArea = $( '#txtForSaleConstructionArea' ),
        txtForSaleInternalArea = $( '#txtForSaleInternalArea' ),
        txtRoomTotalPrice = $( '#txtRoomTotalPrice' ),

        txtSaleDiscountRate = $( "#txtSaleDiscountRate" ),
        txtConstructionTransactionUnitPrice = $( '#txtConstructionTransactionUnitPrice' ),
        txtInternalTransactionUnitPrice = $( '#txtInternalTransactionUnitPrice' ),
        txtRoomDiscountPrice = $( '#txtRoomDiscountPrice' ),

        forSaleConstructionArea = txtForSaleConstructionArea.val(),
        forSaleInternalArea = txtForSaleInternalArea.val(),
        roomTotalPrice = txtRoomTotalPrice.val(),
        roomDiscountPrice = calRoomDiscountPrice( roomTotalPrice );

    // 折扣
    setNumberCtrlValue( txtSaleDiscountRate, calPercent( roomDiscountPrice, roomTotalPrice ) );
    // 房间总价    
    setNumberCtrlValue( txtConstructionTransactionUnitPrice, calUnitPrice( roomDiscountPrice, forSaleConstructionArea ) );
    // 建筑成交单价
    setNumberCtrlValue( txtInternalTransactionUnitPrice, calUnitPrice( roomDiscountPrice, forSaleInternalArea ) );
    // 套内成交单价
    setNumberCtrlValue( txtRoomDiscountPrice, roomDiscountPrice );

    // 触发摘要部分的价格信息计算
    bindSummaryMoneyInfo();
}


function showDiscountInfo()
{
    var ddlPayType = $( '#ddlPayType' ),
        strPayTypeGUID = ddlPayType.val(),
        strPayTypeName = ddlPayType.find( 'option[selected]' ).text(),
        strPayTypeDiscountRate = $( '#hidPayTypeDiscountRate' ).val(),

        hidDiscountGUID = $( '#hidDiscountGUID' ),
        strProjectGUID = $( '#hidProjectGUID' ).val(),
        strDiscountGUID = hidDiscountGUID.val(),
        discountInfo = openModalWindow( '../Discount/VDiscountDetail.aspx?ProjectGUID=' + strProjectGUID
            + '&PayTypeGUID=' + strPayTypeGUID
            + '&PayTypeName=' + encodeURI( strPayTypeName )
            + '&PayTypeDiscountRate=' + strPayTypeDiscountRate
            + '&DiscountGUID=' + strDiscountGUID
            + "&discountInfoContainer=hidDiscountInfoContainer"
            , 800, 600 );

    if ( !discountInfo )
    {
        return false;
    }

    var txtSaleDiscountExplain = $( '#txtSaleDiscountExplain' ),
        hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' );

    hidDiscountGUID.val( discountInfo.discountGUID );
    txtSaleDiscountExplain.val( discountInfo.discountFormulaDescription );
    hidDiscountInfoContainer.val( $.jsonToString( discountInfo.discountDetailArr ) );

    recalculatedRoomSalesInformation();

}

// 输出折扣公式描述
function exportDiscountFormulaDescription()
{
    var hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' ),
        discountDetailInfoArray = $.parseJSON( hidDiscountInfoContainer.val()),
        ddlPayType = $('#ddlPayType'),
        strPayTypeGUID = ddlPayType.val(),
        strPayTypeName = ddlPayType.find( 'option[selected]' ).text(),
        payTypeDiscountRate = $( '#hidPayTypeDiscountRate' ).val();

    $( '#txtSaleDiscountExplain' ).val( buildDiscountFormulaDescription( strPayTypeGUID, strPayTypeName, payTypeDiscountRate,
        discountDetailInfoArray ) );
}

// 生成折扣公式描述
function buildDiscountFormulaDescription( payTypeGUID, payTypeName, payTypeDiscountRate, discountDetailArray )
{
    var strDesc = [],
        strFormula = [];

    strDesc.push( "以标准总价为基准计算: " );

    if ( payTypeGUID )
    {
        strFormula.push( payTypeName, " ", formatAmount( payTypeDiscountRate, true ) );
    }
    else
    {
        strFormula.push( "标准总价 100.00%" );
    }

    if ( discountDetailArray )
    {
        for ( var i = 0; i < discountDetailArray.length; i++ )
        {
            strFormula.unshift( "(" );
            strFormula.push( getDiscountSuffixText( discountDetailArray[i] ), ")" );
        }
    }

    strDesc.push( strFormula.join( "" ) );

    return strDesc.join( "" );
}

// 获取折扣项的总额，返回折扣率或实际金额
function getDiscountSuffixText( discountDetailItemInfo )
{
    var suffixText = [],
        opt = "",
        discountAmountText = "";

    switch ( Number( discountDetailItemInfo.DiscountType ) )
    {
        // 打折，获取discountRate  
        case 1:
            opt = "*";
            discountAmountText = formatAmount( discountDetailItemInfo.DiscountRate, true );
            break;
            // 减点，获取discountRate    
        case 2:
            opt = "-";
            discountAmountText = formatAmount( discountDetailItemInfo.DiscountRate, true );
            break;
            // 总价优惠，获取discountMoney        
        case 3:
            opt = "-";
            discountAmountText = formatAmount( discountDetailItemInfo.DiscountMoney, false );
            break;
            // 单价优惠，获取获取discountMoney       
        case 4:
            opt = "-";
            discountAmountText = "(" + formatAmount( discountDetailItemInfo.DiscountMoney, false ) + " * 面积)";
            break;
        default:
            opt = "-";
            discountAmountText = "";
            break;
    }

    suffixText.push( " ", opt, " ", discountDetailItemInfo.DiscountDetailName, " ", discountAmountText, ")" );

    return suffixText.join( "" );
}


function clearDiscountDetail()
{
    $( '#hidDiscountInfoContainer' ).val( '' );
    exportDiscountFormulaDescription();
}

// 计算房间总价,获取折扣、面积信息，综合房间标准总价计算得出折后总价
function calRoomDiscountPrice( roomTotalPrice )
{
    var payTypeGUID = $( '#hidPayTypeGUID' ).val(),
        payTypeDiscountRate = $( '#hidPayTypeDiscountRate' ).val(),
        hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' ),
        discountDetailInfoArray = $.parseJSON( hidDiscountInfoContainer.val() ),
        item,
        salesPriceType,
        area = getCurrentArea(),
        discountPrice = roomTotalPrice;

    // 若选择了付款方式，则减去付款方式的折扣
    if ( payTypeGUID && !isNaN( payTypeDiscountRate ) && payTypeDiscountRate != "" )
    {
        discountPrice = calByDirectDiscount( discountPrice, payTypeDiscountRate );
    }

    for ( var i = 0; isArray( discountDetailInfoArray ) && i < discountDetailInfoArray.length; i++ )
    {
        item = discountDetailInfoArray[i];
        switch ( Number( item.DiscountType ) )
        {
            // 打折   
            case 1:
                discountPrice = calByDirectDiscount( discountPrice, item.DiscountRate );
                break;
                // 减点   
            case 2:
                discountPrice = calByLessPoints( discountPrice, roomTotalPrice, item.DiscountRate );
                break;
                // 总价优惠   
            case 3:
                discountPrice = calByTotalPriceConcession( discountPrice, item.DiscountMoney );
                break;
                // 单价优惠   
            case 4:
                discountPrice = calByUnitPriceConcession( discountPrice, item.DiscountMoney, area );
                break;
                // 手工调整   
            case 0:
                discountPrice = calByManuallyAdjust( discountPrice, item.DiscountMoney );
                break;
            default:
                break;
        }
    }
    return discountPrice;
}

// 根据计价方式返回当前有效的面积
function getCurrentArea()
{
    var rdlSalePriceType = $( '[name$=rdlSalePriceType][checked]' ),
        areaCtrlID,
        areaCtrl,
        area;

    if ( rdlSalePriceType.length == 0 )
    {
        return 0;
    }

    // 计价方式
    switch ( Number( rdlSalePriceType.val() ) )
    {
        // 按建筑面积   
        case 1:
            areaCtrlID = "txtForSaleConstructionArea";
            break;
            // 按套内面积    
        case 2:
            areaCtrlID = "txtForSaleInternalArea";
            break;
            // 按套   
        case 3:
            areaCtrlID = "txtForSaleConstructionArea";
            break;
        default:
            areaCtrlID = "";
            break;
    }
    areaCtrl = $( '#' + areaCtrlID );
    area = formatNumText( areaCtrl.val() );
    area = isNaN( area ) ? 0 : Number( area );
    return area;
}

// 记录房间折扣总价
function recordRoomDiscountPrice()
{
    $( '#hidRoomDiscountPrice' ).val( $( '#txtRoomDiscountPrice' ).val() );
}

// 绑定付款方式信息
function bindPayTypeInfo( payTypeGUID, callback )
{
    var hidPayTypeDiscountRate = $( '#hidPayTypeDiscountRate' ),
        hidPayTypeEarnestInfo = $( '#hidPayTypeEarnestInfo' ),
        DEFAULT_PAY_TYPE_DISCOUNT_RATE = 100;

    if ( !!payTypeGUID )
    {
        ajaxRequest( 'FillData.ashx',
        {
            action: "CRM_GetPayTypeInfoWithEarnestForSalesOrder",
            PayTypeGUID: payTypeGUID
        },
        'json', function ( data, status )
        {
            if ( data && data.Success == "Y" )
            {
                var payTypeInfo = $.stringToJSON(data.Others[0]),
                    earnestInfo = data.Others[1];

                hidPayTypeDiscountRate.val( payTypeInfo.DiscountRate );
                hidPayTypeEarnestInfo.val( earnestInfo );
            }
            else
            {
                hidPayTypeDiscountRate.val( DEFAULT_PAY_TYPE_DISCOUNT_RATE );
                hidPayTypeEarnestInfo.val('');
            }
            
            if ( typeof callback == 'function' )
            {
                callback();
            }
        } );
    }
    else
    {
        hidPayTypeDiscountRate.val( DEFAULT_PAY_TYPE_DISCOUNT_RATE );
        hidPayTypeEarnestInfo.val( '' );

        if ( typeof callback == 'function' )
        {
            callback();
        }
    }
}

function extendFunFromParent()
{
    var OrderTotalPrice = accAdd( $( '#txtRoomDiscountPrice' ).val(), $( '#txtAttachRoomsDiscountPrice' ).val() );
    setNumberCtrlValue( $( '#txtSalesOrderTotalPrice' ), OrderTotalPrice );
}

//---------  摘要部分的金额信息部分  -----------//
function bindSummaryMoneyInfo()
{
    var salesOrderType = getParamValue( 'OrderType' ),

        txtRoomDiscountPrice = $( '#txtRoomDiscountPrice' ),
        txtAttachRoomsDiscountPrice = $( '#txtAttachRoomsDiscountPrice' ),

        txtSalesOrderTotalPrice = $( '#txtSalesOrderTotalPrice' ),
        salesOrderTotalPrice = accAdd( txtRoomDiscountPrice.val(), txtAttachRoomsDiscountPrice.val() );
        
    setNumberCtrlValue( txtSalesOrderTotalPrice, salesOrderTotalPrice );

    // 当销售单类型是认购单时，需要根据项目级配置信息，设置应收定金和失效日期
    if ( salesOrderType == "S" )
    {
        var txtForPaySalesOrderMoney = $( '#txtForPaySalesOrderMoney' ),
            forPaySalesOrderMoney = getForPaySalesOrderMoney( salesOrderTotalPrice );

        setNumberCtrlValue( txtForPaySalesOrderMoney, forPaySalesOrderMoney );
    }
    calculateLendingInfo( salesOrderTotalPrice );
}

/* 获取应收定金。逻辑如下:
//  所选付款方式中有定金类型的付款项时，优先按照付款方式中指定的定金付款项计算出应收定金
//  当付款方式中没有定金类型的付款项时，按照项目级配置中设置的定金计算方式计算出应收定金
*/
function getForPaySalesOrderMoney(salesOrderTotalPrice)
{
    var hidPayTypeEarnestInfo = $( '#hidPayTypeEarnestInfo' ),
        payTypeEarnestInfo = $.stringToJSON( hidPayTypeEarnestInfo.val() ),

        hidSubscriptionDepositMethod = $( '#hidSubscriptionDepositMethod' ),
        hidSubscriptionStandardDeposit = $( '#hidSubscriptionStandardDeposit' ),
        hidSubscriptionStandardDepositPercent = $( '#hidSubscriptionStandardDepositPercent' ),

        subscriptionDepositMethod = hidSubscriptionDepositMethod.val(),
        subscriptionStandardDeposit = hidSubscriptionStandardDeposit.val(),
        subscriptionStandardDepositPercent = hidSubscriptionStandardDepositPercent.val(),

        forPaySalesOrderMoney;

    // 付款方式中指定了定金类型的付款项时
    if ( payTypeEarnestInfo.length )
    {
        forPaySalesOrderMoney = 0;

        $.each( payTypeEarnestInfo, function ( i, o )
        {
            forPaySalesOrderMoney += +( o.CalculationMethod == "1" ? calPriceByPercent( salesOrderTotalPrice, o.FundsRate ) : o.FundsMoney );
        } );
    }
    // 付款方式中没有指定定金类型的付款项时
    else
    {
        forPaySalesOrderMoney = subscriptionDepositMethod == "1" ?
            subscriptionStandardDeposit : calPriceByPercent( salesOrderTotalPrice, subscriptionStandardDepositPercent );
    }

    return forPaySalesOrderMoney;
}


/* 验证所选的推荐人是否有效。无效的推荐人包括：
1. 客户本人	
*/
function checkValidRecommendClient( clientData )
{
    var hidClientBaseGUID = $( '#hidClientBaseGUID' ),
		clientBaseGUID = hidClientBaseGUID.val(),
		RecommendClientBaseGUID = clientData.ClientBaseGUID;

    if ( clientBaseGUID == RecommendClientBaseGUID )
    {
        return alertMsg( "推荐人不可以是客户本人。" );
    }
    return true;
}

// 选择推荐人按钮事件
function btnSelectRecommendClient_Click()
{
    selectBaseClient( 'checkValidRecommendClient', function ( clientBaseInfo )
    {
        var clientBaseGUID = clientBaseInfo.ClientBaseGUID,
			clientName = clientBaseInfo.ClientName,
			txtRecommendClient = $( '#txtRecommendClient' ),
			hidRecommendClient = $( '#hidRecommendClient' );

        txtRecommendClient.val( clientName );
        hidRecommendClient.val( clientBaseGUID );
    } );
}

// 选择业务员按钮事件
function btnSelectClerk_Click()
{
    var strSalesType = $( '#hidSalesOrderType' ).val(),
        strID = getParamValue( 'ID' ),
        strProjectGUID = $( '#hidProjectGUID' ).val(),
        clerkInfo = openModalWindow( '../Clerk/VClerkDetail.aspx?id=' + strID
             + "&OrderType=" + strSalesType
             + "&ProjectGUID=" + strProjectGUID
             + "&clerkInfoContainer=hidClerksInfo"
             , 800, 600 );

    if ( !clerkInfo )
    {
        return false;
    }

    // 缓存业务员信息
    cacheClerkInfo( clerkInfo );

    // 显示业务员姓名
    displayClerksName();
}

// 根据业务员信息获取业务员名称，多个业务员名称用逗号分隔。
function getClerksName( clerkInfo )
{
    var clerksName = [];
    if ( isArray( clerkInfo ) )
    {
        for ( var i = 0; i < clerkInfo.length; i++ )
        {
            clerksName.push( clerkInfo[i].EmployeeName );
        }
    }
    return clerksName.join();
}

// 显示业务员名称
function displayClerksName()
{
    var clerkInfo = getCachedClerkInfo();
    $( '#txtClerksName' ).val( getClerksName( clerkInfo ) );
}

// 缓存业务员信息
function cacheClerkInfo( clerkInfo )
{
    var hidClerksInfo = $( '#hidClerksInfo' );
    hidClerksInfo.val( $.jsonToString( clerkInfo ) );
}

// 获取已缓存的业务员信息
function getCachedClerkInfo()
{
    var hidClerksInfo = $( '#hidClerksInfo' ),
		serializedClerksInfo = hidClerksInfo.val(),
		deserializedClerksInfo = $.stringToJSON( serializedClerksInfo );

    return deserializedClerksInfo;
}
//---------  权益人信息部分  -----------//
function loadPropertyList()
{
    var hidPropertiesInfo = $( '#hidPropertiesInfo' ),
		propertyInfo = $.stringToJSON( hidPropertiesInfo.val() );
    if ( !propertyInfo || !isArray( propertyInfo ) )
    {
        return false;
    }
    for ( var i = 0; i < propertyInfo.length; i++ )
    {
        addPropertyIntoList( propertyInfo[i] );
    }
}

function checkExistProperty()
{
    return $( '#tbPropertyList' ).find( 'tr:gt(0)' ).length > 0;
}

//function getClientBaseInfo(clientBaseGUID, callback)
//{
//	ajaxRequest('FillData.ashx',
//    {
//    	action: "CRM_GetClientBaseInfo",
//    	ClientBaseID: clientBaseGUID
//    },
//    'json', function (data, status)
//    {
//    	if (typeof callback == 'function')
//    	{
//    		callback(!!data ? data[0] : null);
//    	}
//    });
//}

function checkCurrentPropertyHasAdded( clientBaseGUID )
{
    return $( '#tbPropertyList' ).find( 'tr:gt(0)>td:first-child' ).find( 'input[type=checkbox][value=' + clientBaseGUID + ']' ).length > 0;
}

function addPropertyIntoList( clientBaseInfo )
{
    if ( !clientBaseInfo )
    {
        return false;
    }

    var tbPropertyList = $( '#tbPropertyList' ),
        rowNo = tbPropertyList.find( 'tr' ).length,
        clientBaseGUID = clientBaseInfo.ClientBaseGUID,
        clientName = clientBaseInfo.ClientName,
        credentialsNumber = clientBaseInfo.CredentialsNumber,
        mobileNumber = clientBaseInfo.MobileNumber,
        html = [];

    if ( checkCurrentPropertyHasAdded( clientBaseGUID ) )
    {
        return alertMsg( "您已添加过这个权益人" );
    }

    html.push( "<tr>",
        "<td><input type='checkbox' value='", clientBaseGUID, "'</td>",
        "<td>", clientName, "</td>",
        "<td>", credentialsNumber, "</td>",
        "<td>", mobileNumber, "</td>",
        "</tr>" );

    tbPropertyList.append( html.join( '' ) );
}

function btnAddProperty_Click()
{
    selectBaseClient( '',
            function ( clientBaseInfo )
            {
                getClientBaseInfo( clientBaseInfo, addPropertyIntoList );
            }
         );
}

function btnDeleteProperty_Click()
{
    var tbPropertyList = $( '#tbPropertyList' ),
         selectRows = tbPropertyList.find( 'tr input[type=checkbox][checked]' ).closest( 'tr' );

    selectRows.remove();
}

// 记录权益人列表中的权益人ID。保存到隐藏控件中
function recordPropertyID()
{
    var hidPropertiesInfo = $( '#hidPropertiesInfo' ),
        tbPropertyList = $( '#tbPropertyList' ),
        cbkCtrl = tbPropertyList.find( 'tr td input[type=checkbox]' ),
		selectedTr,
		clientBaseGUID,
		clientName,
		credentialsNumber,
		MobileNumber,
        propertyArr = [];

    cbkCtrl.each( function ( i, cbk )
    {
        var me = $( cbk );
        selectedTr = me.parent().parent();

        propertyArr.push( {
            ClientBaseGUID: me.val(),
            ClientName: selectedTr.find( 'td:eq(1)' ).text(),
            CredentialsNumber: selectedTr.find( 'td:eq(2)' ).text(),
            MobileNumber: selectedTr.find( 'td:eq(3)' ).text()
        } );
    } );

    hidPropertiesInfo.val( $.jsonToString( propertyArr ) );
}

//---------  贷款信息部分  -----------//
function rebindPayType( roomID, callback )
{
    rebindDdl( { action: 'CRM_GetPayType', ID: roomID, IDType: 'room' }, 'ddlPayType', '', 'select', callback );
}


function changePayType()
{
    var ddlPayType = $( '#ddlPayType' ),
        hidPayTypeGUID = $( '#hidPayTypeGUID' ),
        payTypeGUID = ddlPayType.val();

    hidPayTypeGUID.val( ddlPayType.val() );

    bindPayTypeInfo( payTypeGUID, function ()
    {
        recalculatedRoomSalesInformation();
        exportDiscountFormulaDescription();
        bindLendingAreaInfo( 'rebind', payTypeGUID );
    } );
}


function bindLendingAreaInfo( bindType, payTypeGUID )
{
    if ( bindType != 'rebind' && bindType != 'pageload' )
    {
        return false;
    }

    var txtSalesOrderTotalPrice = $( '#txtSalesOrderTotalPrice' ),
        salesOrderTotalPrice = formatNumText( txtSalesOrderTotalPrice.val() );

    ajaxRequest( 'FillData.ashx',
    {
        action: "CRM_GetLendingInfoByPayType",
        PayTypeGUID: payTypeGUID,
        TotalPrice: salesOrderTotalPrice
    },
    'json', function ( data, status )
    {
        if ( !data || !data.length )
        {
            setLendingInfoAreaDisplay( 'hide' );
            clearLendingInfoAreaForm();
            return false;
        }

        var dataRow = data[0],
            isNeedLoan = dataRow["IsNeedLoan"],
            // 按揭相关信息
            isExistLendingMoney = dataRow["IsExistLendingMoney"],
            lendingBankConfigItemGUID = dataRow["LendingBankConfigItemGUID"],

            lendingMoneyCalculateionMethod = dataRow["LendingMoneyCalculationMethod"],
            lendingMoneyFundsRate = dataRow["LendingMoneyFundsRate"],
            lendingMoneyFundsMoney = dataRow["LendingMoneyFundsMoney"],

            lendingBankMoneySaveBit = dataRow["LendingBankMoneySaveBit"],
            lendingMoneyInstallmentNum = dataRow["LendingMoneyInstallmentNum"],
            lendingBankMoney = dataRow["LendingBankMoney"],

            // 公积金相关信息
            isExistProvidentFundMoney = dataRow["IsExistProvidentFundMoney"],
            providentFundConfigItemGUID = dataRow["ProvidentFundConfigItemGUID"],

            providentFundMoneyCalculationMethod = dataRow["ProvidentFundMoneyCalculationMethod"],
            providentFundMoneyFundsRate = dataRow["ProvidentFundMoneyFundsRate"],
            providentFundMoneyFundsMoney = dataRow["ProvidentFundMoneyFundsMoney"],

            providentFundMoneySaveBit = dataRow["ProvidentFundMoneySaveBit"],
            providentFundMoneyInstallmentNum = dataRow["ProvidentFundMoneyInstallmentNum"],
            providentFundMoney = dataRow["ProvidentFundMoney"],

            // 保存按揭信息的隐藏控件
            hidLendingBankMoneySaveBit = $( '#hidLendingBankMoneySaveBit' ),

            // 保存公积金信息的隐藏控件
            hidProvidentFundMoneySaveBit = $( '#hidProvidentFundMoneySaveBit' );

        if ( isNeedLoan == 'Y' )
        {
            setLendingInfoAreaDisplay( 'show' );
            var numTypeConfigInfo = { LendingMoney: lendingBankMoneySaveBit, ProvidentMoney: providentFundMoneySaveBit };
            bindCtrlsNumFormat( numTypeConfigInfo, _PageMaster.lendingInfoCtrlTypeMapping )

            setLendingAreaCtrlEnable( 'lendingBank', isExistLendingMoney );
            setLendingAreaCtrlEnable( 'providentFund', isExistProvidentFundMoney );
            
            setLendingInfoAreaCalculateInfo( 'lendingBank',
                lendingMoneyCalculateionMethod, lendingMoneyFundsRate, lendingMoneyFundsMoney );
            setLendingInfoAreaCalculateInfo( 'providentFund',
                providentFundMoneyCalculationMethod, providentFundMoneyFundsRate, providentFundMoneyFundsMoney );

            // 当绑定类型为重新绑定（rebind）时，重新绑定金额的保留为和相关控件的值
            if ( bindType == 'rebind' )
            {
                hidLendingBankMoneySaveBit.val( lendingBankMoneySaveBit );
                hidProvidentFundMoneySaveBit.val( providentFundMoneySaveBit );

                bindLendingAreaData( 'lendingBank', isExistLendingMoney, lendingBankConfigItemGUID, lendingBankMoney, lendingMoneyInstallmentNum );
                bindLendingAreaData( 'providentFund', isExistProvidentFundMoney, providentFundConfigItemGUID, providentFundMoney, providentFundMoneyInstallmentNum );
            }

            // 完成值的输入后，根据系统设置格式化贷款信息区域的数字控件的值
            FormatNumberCtrlsValue( _PageMaster.lendingInfoCtrlTypeMapping );
        }
        else
        {
            setLendingInfoAreaDisplay( 'hide' );
            clearLendingInfoAreaForm();
        }
    }, false );
}

/* 计算贷款信息
    参与计算信息：
    销售单总价
    按揭计算方法
    按揭比例
    按揭金额
    公积金计算方法
    公积金比例
    公积金金额

    将被该方法修改的控件：
    按揭金额
    公积金金额
*/
function calculateLendingInfo(salesOrderTotalPrice)
{
    var txtLendingBankMoney = $( '#txtLendingBankMoney' ),
        txtProvidentFundMoney = $( '#txtProvidentFundMoney' ),

        lendingBankCtrls = getLendingAreaCalculateInfoCtrls( 'lendingBank' ),
        providentFundCtrls = getLendingAreaCalculateInfoCtrls( 'providentFund' );

    if ( !lendingBankCtrls || !providentFundCtrls )
    {
        return false;
    }

    var lendingBankCalculateionMethod = lendingBankCtrls.hidMoneyCalculationMethod.val(),
        lendingBankMoneyFundsRate = lendingBankCtrls.hidMoneyFundsRate.val(),
        lendingBankMoneyFundsMoney = lendingBankCtrls.hidMoneyFundsMoney.val(),

        lendingBankMoney = calculateLendingMoneyByMethod( salesOrderTotalPrice, 
            lendingBankCalculateionMethod, lendingBankMoneyFundsRate, lendingBankMoneyFundsMoney ),
            
        providentFundCalculateionMethod = providentFundCtrls.hidMoneyCalculationMethod.val(),
        providentFundMoneyFundsRate = providentFundCtrls.hidMoneyFundsRate.val(),
        providentFundMoneyFundsMoney = providentFundCtrls.hidMoneyFundsMoney.val(),

        providentFundmoney = calculateLendingMoneyByMethod( salesOrderTotalPrice,
            providentFundCalculateionMethod, providentFundMoneyFundsRate, providentFundMoneyFundsMoney );
    
    setNumberCtrlValue( txtLendingBankMoney, lendingBankMoney );
    setNumberCtrlValue( txtProvidentFundMoney, providentFundmoney );
}

// 根据计算方法计算贷款金额
function calculateLendingMoneyByMethod( totalPrice, method, rate, money )
{
    if ( isNaN( totalPrice ) || totalPrice === "" || !method )
    {
        return 0;
    }

    var resultMoney = 0;

    switch ( method )
    {
        // 房款比例
        case "1":
            resultMoney = accDiv( accMul( totalPrice, rate ), 100 );
            break;
            // 固定金额
        case "4":
            resultMoney = money;
            break;
    }

    return resultMoney;
}


// 清空贷款信息表单的内容
function clearLendingInfoAreaForm()
{
    clearLendingInfoAreaFormByType( 'lendingBank' );
    clearLendingInfoAreaFormByType( 'providentFund' );
}

function clearLendingInfoAreaFormByType( lendingType )
{
    var lengdingAreaCtrls = getLendingAreaDisplayCtrls( lendingType );

    if ( !lengdingAreaCtrls )
    {
        return false;
    }

    var ddlBank = lengdingAreaCtrls.ddlBank,
        txtLendingMoney = lengdingAreaCtrls.txtLendingMoney,
        txtInstallmentNum = lengdingAreaCtrls.txtInstallmentNum;

    ddlBank.attr( 'selectedIndex', 0 );
    txtLendingMoney.val( '' );
    txtInstallmentNum.val( '' );
}

// 设置贷款信息区域和计算相关的信息
function setLendingInfoAreaCalculateInfo( lendingType, method, rate, money )
{
    var ctrls = getLendingAreaCalculateInfoCtrls( lendingType );

    if ( !ctrls )
    {
        return false;
    }

    var hidMethod = ctrls.hidMoneyCalculationMethod,
       hidMoneyFundsRate = ctrls.hidMoneyFundsRate,
       hidMoneyFundsMoney = ctrls.hidMoneyFundsMoney;
   
    hidMethod.val( method );
    hidMoneyFundsRate.val( rate );
    hidMoneyFundsMoney.val( money );
}

function setLendingInfoAreaDisplay( showOrHide )
{
    var lendingInfoArea = $( '#trLendingArea,#trLending' );
    if ( showOrHide == 'show' )
    {
        lendingInfoArea.show();
    }
    else
    {
        lendingInfoArea.hide();
    }
}

function setLendingAreaCtrlEnable( lendingType, isEnabled )
{
    var lengdingAreaCtrls = getLendingAreaDisplayCtrls( lendingType ),
        lendingAreaIsEnableCtrl = getLendingAreaIsEnableCtrl( lendingType );

    if ( !lengdingAreaCtrls || !lendingAreaIsEnableCtrl )
    {
        return false;
    }

    var ddlBank = lengdingAreaCtrls.ddlBank,
        txtLendingMoney = lengdingAreaCtrls.txtLendingMoney,
        txtInstallmentNum = lengdingAreaCtrls.txtInstallmentNum,
        hidIsExistMoney = lendingAreaIsEnableCtrl.hidIsExistMoney;

    if ( isEnabled )
    {
        ddlBank.removeAttr( 'disabled' );

        setIDTextIsReadonly( txtLendingMoney, false );
        setIDTextIsReadonly( txtInstallmentNum, false );

        hidIsExistMoney.val("Y");
    }
    else
    {
        ddlBank.attr( 'disabled', 'disabled' );

        setIDTextIsReadonly( txtLendingMoney, true );
        setIDTextIsReadonly( txtInstallmentNum, true );

        hidIsExistMoney.val( "N" );
    }
}

// 绑定贷款区域数据，可用于绑定按揭贷款或公积金贷款的数据
function bindLendingAreaData( lendingType, isEnabled, bankID, lendingMoney, InstallmentNum )
{
    var lengdingAreaCtrls = getLendingAreaDisplayCtrls( lendingType );

    if ( !lengdingAreaCtrls )
    {
        return false;
    }

    var ddlBank = lengdingAreaCtrls.ddlBank,
        txtLendingMoney = lengdingAreaCtrls.txtLendingMoney,
        txtInstallmentNum = lengdingAreaCtrls.txtInstallmentNum;

    if ( isEnabled )
    {
        ddlBank.val( bankID );
        setNumberCtrlValue( txtLendingMoney, lendingMoney );
        txtInstallmentNum.val( InstallmentNum );
    }
    else
    {
        clearLendingInfoAreaFormByType( lendingType );
    }
}

// 获取贷款信息区域记录是否存在贷款的控件
function getLendingAreaIsEnableCtrl( lendingType )
{
    var idPart = getLendingAreaCtrlsIDPart( lendingType );

    if ( !idPart )
    {
        return null;
    }

    var ctrls = {};
    ctrls.hidIsExistMoney = $( '#hidIsExistMoney' + idPart + 'Money' );

    return ctrls;
}

// 获取贷款信息区域显示在页面上的控件集合
function getLendingAreaDisplayCtrls( lendingType )
{
    var idPart = getLendingAreaCtrlsIDPart (lendingType);
     
    if(!idPart)
    {
        return null;
    }

    var ctrls = {};
    ctrls.ddlBank = $( '#ddl' + idPart );
    ctrls.txtLendingMoney = $( '#txt' + idPart + 'Money' );
    ctrls.txtInstallmentNum = $( '#txt' + idPart + 'MoneyInstallmentNum' );

    return ctrls;
}

// 获取贷款信息区域保存计算信息的控件集合
function getLendingAreaCalculateInfoCtrls( lendingType )
{
    var idPart = getLendingAreaCtrlsIDPart( lendingType );
    
    if ( !idPart )
    {
        return null;
    }

    var ctrls = {};
    ctrls.hidMoneyCalculationMethod = $( '#hid' + idPart + 'CalculationMethod' );
    ctrls.hidMoneyFundsRate = $( '#hid' + idPart + 'MoneyFundsRate' );
    ctrls.hidMoneyFundsMoney = $( '#hid' + idPart + 'MoneyFundsMoney' );

    return ctrls;
}

function getLendingAreaCtrlsIDPart( lendingType )
{
    var idPart;

    if ( lendingType == 'lendingBank' )
    {
        idPart = "LendingBank";
    }
    else if ( lendingType == 'providentFund' )
    {
        idPart = "ProvidentFund";
    }
    else
    {
        return null;
    }

    return idPart;
}



//---------  补差信息部分  -----------//

// 绑定补差方案下拉框
function bindMakeUpMoneyProgram( projectGUID, callback )
{
    var ddlMakeUpMoneyProgram = $( '#ddlMakeUpMoneyProgram' ),
        hidMakeUpMoneyProgramGUID = $( '#hidMakeUpMoneyProgramGUID' );

    // 绑定补差方案下拉框
    rebindDdl( { action: 'CRM_GetMakeUpPriceType', projectID: projectGUID },
            'ddlMakeUpMoneyProgram', '', 'select', function ()
            {
                if ( typeof callback == 'function' )
                {
                    callback();
                }
            } );
}

function makeUpMoneyProgramChange()
{
    var ddlMakeUpMoneyProgram = $( '#ddlMakeUpMoneyProgram' ),
        hidMakeUpMoneyProgramGUID = $( '#hidMakeUpMoneyProgramGUID' );

    hidMakeUpMoneyProgramGUID.val( ddlMakeUpMoneyProgram.val() );
}

//---------  公用方法  -----------//
/* 选择基础客户
@validFunctionName type:string.  验证所选客户是否有效的方法名。
@callback type: function. 选择基础客户并获取客户信息后的回调函数。
*/
function selectBaseClient( validFunctionName, callback )
{
    var strProjectGUID = getParamValue( 'ProjectGUID' ),
        strProjectName = getParamValue( 'ProjectName' ),
        data = openModalWindow( '../../../../Common/Select/CRM/VSelectCustomerBaseInfo.aspx?validFn=' + validFunctionName +
            '&ProjectGUID=' + strProjectGUID +
            "&ProjectName=" + encodeURI( strProjectName ), 800, 600 );

    if ( !data )
    {
        return false;
    }
    else
    {
        if ( typeof callback == 'function' )
        {
            callback( data );
        }
        //		getClientBaseInfo(data, typeof callback == 'function' ? callback : new Function());
    }
}

function rebindDdl( params, ddlId, defaultValue, defaultOptionType, callback )
{
    if ( params != null )
    {
        $.post( 'FillData.ashx', params, function ( data, textStatus )
        {
            // 绑定下拉框
            bindDdl( data, ddlId, defaultValue, defaultOptionType );

            if ( typeof callback == 'function' )
            {
                callback();
            }
        }, 'json' );
    }
    else
    {
        // 绑定下拉框
        bindDdl( [], ddlId, '', defaultOptionType );
    }
}

function saveOriginalValue( obj )
{
    if ( !obj )
    {
        return false;
    }

    obj["originalValue"] = obj.value;
}

// 显隐区块
function setVisible( areaName, tr )
{
    tr.style.display = ( getObj( areaName ).value == "0" ? "none" : "" );
}


function handleBtn( enabled )
{
    setBtnEnabled( getObj( "btnSaveOpen" ), enabled );
    setBtnEnabled( getObj( "btnSaveClose" ), enabled );
}
//添加 付款详情明细 或者 修改付款详情
//type 0为add 1为edit
//作者：常春侠
//时间：2013-7-10 17:10:22
function addForPayMoneyDetail(type)
{
    
    var url = "CVForPayMoneyAdd.aspx?saleOrderID=" + $("#hidID").val() + "&projID=" + $("#hidProjectGUID").val() + "&transID=" + $("#hidTransactionGUID").val() + "&editType=" + type;
    if (type == "1")
    {
        var forPayMoneyIDs = getSelectedCheckBox("chkIDV3");
        if (!forPayMoneyIDs) {
            alert("请选择要修改的记录！"); return false;
        }
        if (forPayMoneyIDs.split(',').length > 2)
        {
            alert("请选择一条记录！"); return false;
        }
        url = url + "&payID="+forPayMoneyIDs.replace(",","");
    }
    //alert(url);
    openAddWindow(url, 600, 500);
    //重新设置各行的样式(区分奇偶行)和事件

    setTableRowAttributes(dgData);
    getObj("trData").style.display = dgData.rows.length > 1 ? "" : "none";
}

//删除 付款详情明细
//作者：常春侠
//时间：2013-7-11 16:42:36
function delForPayMoneyDetail() {
    var forPayMoneyIDs = getSelectedCheckBox("chkIDV3"); 
    if (!forPayMoneyIDs)
    {
        alert("请选择要删除的记录！"); return false;
    }
    openDeleteWindow("SalesOrderForPayMoneyDetail", 13);
}
//获取选中的checkbox 
// 获取选中的选择框的value值；
function getSelectedCheckBox(id) {
    var strValues = "";
    var chks = getObjs(id);
    if (chks.length > 0) {
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                strValues = strValues + chks[i].value + ",";
            }
        }
    }
    return strValues;
}
//判断付款详情是否需要重新生成付款详情
//作者：常春侠
//时间：2013-7-11 16:42:36
function isRgenerateForPayMoney()
{
    var payCount = $("#hidPayMoneyCount").val();
    if (parseInt(payCount)>0)
    {
        return confirm("付款详情已经生成，是否重新生成？");
    }
}
//添加新记录后，异步刷新父页面
//作者：常春侠
//时间：2013-7-12 
function reloadDgData(type,data)
{
    
    if (type == "0")//新增
    {
        
        if (null != data)
        {
           // var forPayMoneyData = $.jsonToString(data);
           // alert("fropayno:"+data.ForPayNO);
            //alert("fropaymoney[0]:" + forPayMoneyData["SalesOrderForPayMoneyGUID"]);
            var row = dgData.insertRow();
            var cell = row.insertCell(0);
            cell.align = "center";
            cell.innerHTML = getCheckBoxHtml("chkIDV3", data.SalesOrderForPayMoneyGUID);//forPayMoneyData.SalesOrderForPayMoneyGUID

            cell = row.insertCell(1);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.ForPayNO);

            cell = row.insertCell(2);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.ForPayDate);

            cell = row.insertCell(3);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.PayMoneyTypeName);

            cell = row.insertCell(4);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.PayMoneyName);

            cell = row.insertCell(5);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.ForPayMoney);

            cell = row.insertCell(6);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.ForPayMoney);

            cell = row.insertCell(7);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.ForPayRemainMoney);

            cell = row.insertCell(8);
            cell.align = "center";
            cell.innerHTML = getNormalTxtHtml(data.PaiedOverMoney);

            // 重新设置各行的样式(区分奇偶行)和事件
            setTableRowAttributes(dgData);

            getObj("trData").style.display = dgData.rows.length > 1 ? "" : "none";
        }
        if (type == "1")
        {
             
        }
        if (type == "2")//删除
        {
            // 删除表格中复选框选中的行
            deleteTableRow(dgData);

            // 重新设置各行的样式(区分奇偶行)和事件
            setTableRowAttributes(dgData);

            getObj("trData").style.display = dgData.rows.length > 1 ? "" : "none";
        }
    }
}