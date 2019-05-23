//***************************************************************************************
function btnDeleteAttachRoom_onclick()
{
    var tbAttachRoom = $( '#tbAttachRoom' );
    var selectRows = tbAttachRoom.find( 'tr input[type=checkbox][checked]' ).closest( 'tr' );
    selectRows.each(
       function ( i, obj )
       {
           var currentIDs = $( "#currentAttachRoomGUIDs" ).val();
           var tempstr = currentIDs.replace( obj['id'], "" ).replace( ",,", "," ).replace( /(^,)|(,$)/g, '' );
           $( "#currentAttachRoomGUIDs" ).val( tempstr );
       }
    );
    selectRows.remove();
    calAttachRoomsTotalPriceInfo();
}

// 选择房间
function btnSelectAttachRoom_onclick()
{
    //如果父页面有主房产，就要判断是否有值(认购签约时要先选择附属房产)
    var MainRoom = $( "#hidRoomGUID" );
    if ( MainRoom.length > 0 && MainRoom.val() == "" )
    {
        return alertMsg( "请先选择主房产！" );
    }
    var hidProjectGUID = $( '#hidProjectGUID' ),
        projectGUID,
        data = openModalWindow( '../../../../Common/Select/CRM/VSelectRoomInfo.aspx?validFn=isValidAttachRoom&MainRoomID=' + MainRoom.val() + '&projectGUID=' + hidProjectGUID.val(), 800, 600 );

    if ( !data )
    {
        return false;
    }
    else
    {
        AttachRoomSelectedHandler( data[0].RoomGUID );
    }
}

// 选择房间处理程序
function AttachRoomSelectedHandler( roomGUID )
{
    var q = $( document ),
        action = 'selectRoom';
    getAttachRoomInfo( roomGUID, function ( roomData )
    {
        // 填充房间信息
        fillAttachRoomInfo( roomData );
        calAttachRoomsTotalPriceInfo();
    } );
}

// 获取房间信息
function getAttachRoomInfo( roomGUID, callback )
{
    ajaxRequest( 'FillData.ashx', { action: "CRM_GetAttachRoomInfo", RoomGUID: roomGUID },
    'json', function ( data, status )
    {
        if ( typeof callback == 'function' )
        {
            callback( data[0] );
        }
    } );
}

// 验证所选房间是否有效
function isValidAttachRoom( rooms )
{
    if ( !rooms || !rooms.length )
    {
        return false;
    }
    var selectedRoom = rooms[0],
        selectedRoomSalesStatus = selectedRoom.SaleStatus,
		isAttachedRoom = selectedRoom.IsAttachedRoom,
        currentAttachRoomGUIDs = $( "#currentAttachRoomGUIDs" ).val(),
        isAlreadyExist = currentAttachRoomGUIDs.indexOf( selectedRoom.RoomGUID ) >= 0;
    var MainRoom = $( "#hidRoomGUID" );
    if ( MainRoom.length > 0 && selectedRoom.RoomGUID == MainRoom.val() )
    {
        return alertMsg( "主房产不能作为附属房产！" );
    }
    if ( !/[34]/.test( selectedRoomSalesStatus ) )
    {
        return alertMsg( "只能选择待售、预约状态的房源" );
    }
        // 锁定房间，若房间已被锁定，则返回锁定失败，并弹出提示信息       
    else if ( !lockSelectedRoom( selectedRoom.RoomGUID ) )
    {
        return alertMsg( "所选房源已经被锁定，请选择其他房间" );
    }
    else if ( isAttachedRoom == "Y" )
    {
        return alertMsg( "所选房间是其他房间的附属房产，请选择其他房间" );
    }
    else if ( isAlreadyExist )
    {
        return alertMsg( "不能重复选择同一房间，请选择其他房间" );
    }
    else
    {
        return true;
    }
}

//锁一段时间
function lockSelectedRoom( roomGUID )
{
    var url = "FillData.ashx",
        strID = $( '#hidMainOrderID' ).val(),
        lockSuccess = false;
    ajaxRequest( 'FillData.ashx', { action: "CRM_LockRoom", RoomGUID: roomGUID, ID: strID },
    'text', function ( data, status )
    {
        lockSuccess = data.toLocaleLowerCase() == 'true';
    }, false, "POST" );
    return lockSuccess;
}



// 填充房间信息
function fillAttachRoomInfo( roomData )
{
    var dg = $( "table#tbAttachRoom" );
    html = [];
    html.push(
    "<TR class='table_row' id='" + roomData.RoomID + "'>",
        "<TD><input type='checkbox' value='", roomData.RoomID, "'</TD>",
        "<TD align='left'>", roomData.RoomName, "</TD>",
        "<TD align='left'>", roomData.TotalPrice, "</TD>",
        "<TD align='right'><input type='text' ctrltype='DiscountPrice' onblur='reCal(this)' value='" + roomData.DiscountPrice + "' price='Y' style='width:100%'/></TD>",
        "<TD align='right'><input type='text' ctrltype='Discount' onblur='reCal(this)' value='" + roomData.Discount + "' discount='Y' style='width:100%' /></TD>",
        "<TD align='right'>", roomData.ForSaleConstructionArea, "</TD>",
        "<TD align='right'>", roomData.ForSaleInternalArea, "</TD>",
    "</TR>" );
    var currentAttachRoomGUIDs = $( "#currentAttachRoomGUIDs" ).val();
    $( "#currentAttachRoomGUIDs" ).val( currentAttachRoomGUIDs + "," + roomData.RoomID );
    dg.append( html.join( '' ) );
    calAttachRoomsTotalPriceInfo();
}

//***************************************************************************************

function reCal( current )
{
    var ctrl = $( current ).attr( "ctrltype" );
    var selectedTr = $( current ).parent().parent();
    var TotalPrice = selectedTr.find( 'td:eq(2)' ).text();
    var txtDiscountPrice = selectedTr.find( 'td:eq(3) input[price="Y"]' );
    var txtdiscount = selectedTr.find( 'td:eq(4) input[discount="Y"]' );
    if ( ctrl == "DiscountPrice" )
    {
        txtDiscountPrice.val( getAccountingNum( txtDiscountPrice.val(), 2 ) );
        var discount = accDiv( txtDiscountPrice.val(), TotalPrice ) * 100;
        txtdiscount.val( getAccountingNum( discount, 2 ) );
    } else
    {
        txtdiscount.val( getAccountingNum( txtdiscount.val(), 2 ) );
        var discountPrice = calPriceByPercent( TotalPrice, txtdiscount.val() );
        txtDiscountPrice.val( getAccountingNum( discountPrice, 2 ) );
    }
    calAttachRoomsTotalPriceInfo();
}

//计算附属房产总体信息,增删附属房产或者修改价格、比例时促发,最后是父页面的自定义函数
function calAttachRoomsTotalPriceInfo()
{
    var txtAttachRoomsTotalPrice = $( '#txtAttachRoomsTotalPrice' ),
        txtAttachRoomsDiscountPrice = $( '#txtAttachRoomsDiscountPrice' ),
        txtAttachRoomsTotalPriceDiscountPercent = $( '#txtAttachRoomsTotalPriceDiscountPercent' );
    //把当前附属房产信息填充到隐藏控件
    recordAttachRooms();
    var data = $( "#hidAttachRoomsInfo" ).val();
    var dg = $( "table#tbAttachRoom" );
    var attachRoomForSaleTotalPrice = 0,
        attachRoomForSaleDiscountPrice = 0,
        discount = 0;
    data = $.stringToJSON( data );
    if ( data && data.length > 0 )
    {
        // 显示数据到界面
        for ( var i = 0; i < data.length; i++ )
        {
            attachRoomForSaleTotalPrice = accAdd( attachRoomForSaleTotalPrice, data[i].TotalPrice );
            attachRoomForSaleDiscountPrice = accAdd( attachRoomForSaleDiscountPrice, data[i].DiscountPrice );
        }
        if ( attachRoomForSaleTotalPrice != 0 )
        {
            discount = accDiv( attachRoomForSaleDiscountPrice, attachRoomForSaleTotalPrice ) * 100;
        }
    }
    initialAttachRoomPriceInfo( attachRoomForSaleTotalPrice, attachRoomForSaleDiscountPrice, discount );
    //父页面的自定义函数，所有使用此控件的父页面都必须提供这个方法
    extendFunFromParent();
}


//---------  附属房产部分的金额信息部分  -----------//
// 根据房间GUID绑定附属房产列表, 
//@source room或者detail
//@attachClass bll类名的核心部分
//@OrderID 销售单或者变更单的ID
function bindAttachRoomInfo( roomGUID, callback, source, attachClass, OrderID )
{
    var action = source.toLocaleLowerCase() == 'room' ? 'CRM_BindAttachRoomByRoomGUID' : 'CRM_BindAttachRoomByRoomGUIDForEdit';

    var attachClass = attachClass;
    var json = { action: action, roomGUID: roomGUID, attachClass: attachClass, orderID: OrderID };
   
    ajaxRequest( 'FillData.ashx', json, 'json',
    function ( data )
    {
        var dg = $( "table#tbAttachRoom" );
        var html = [],
            attachRoomForSaleTotalPrice = 0,
            attachRoomForSaleDiscountPrice = 0,
            discount = 0;

        // 清空附属房产列表
        dg.empty();
        dg.append( buildAttachRoomListHeader() );
        if ( data && data.length > 0 )
        {
            // 显示数据到界面
            var currentAttachRoomGUIDs = "";
            for ( var i = 0; i < data.length; i++ )
            {
                html.push(
                    "<TR class='table_row' id='" + data[i].RoomID + "'>",
                    "<TD><input type='checkbox' value='", data[i].RoomID, "'</TD>",
                    "<TD align='left'>", data[i].RoomName, "</TD>",
                    "<TD align='left'>", data[i].TotalPrice, "</TD>",
                    "<TD align='right'><input type='text' ctrltype='DiscountPrice' onblur='reCal(this)' value='" + data[i].DiscountPrice + "' price='Y' style='width:100%'/></TD>",
                    "<TD align='right'><input type='text' ctrltype='Discount' onblur='reCal(this)' value='" + data[i].Discount + "' discount='Y' style='width:100%' /></TD>",
                    "<TD align='right'>", data[i].ForSaleConstructionArea, "</TD>",
                    "<TD align='right'>", data[i].ForSaleInternalArea, "</TD>",
                "</TR>" );
                currentAttachRoomGUIDs = currentAttachRoomGUIDs + "," + data[i].RoomID;
                attachRoomForSaleTotalPrice = accAdd( attachRoomForSaleTotalPrice, data[i].TotalPrice );
                attachRoomForSaleDiscountPrice = accAdd( attachRoomForSaleDiscountPrice, data[i].DiscountPrice );
            }
            $( "#currentAttachRoomGUIDs" ).val( currentAttachRoomGUIDs.replace( /(^,)|(,$)/g, '' ) );
            if ( attachRoomForSaleTotalPrice != 0 )
            {
                discount = accDiv( attachRoomForSaleDiscountPrice, attachRoomForSaleTotalPrice ) * 100;
            }
        }
        dg.append( html.join( '' ) );
        // 初始化附属房产总体价格信息
        initialAttachRoomPriceInfo( attachRoomForSaleTotalPrice, attachRoomForSaleDiscountPrice, discount );
        // 执行回调函数
        if ( typeof callback == 'function' )
        {
            callback( data && data.length ? data[0] : null );
        }
    }, false );
}

// 生成附属房产列表表头
function buildAttachRoomListHeader()
{
    var html = [];
    html.push( "<tr class='table_headrow'>",
     "<td></td>",
        "<td>房间</td>",
        "<td>标准总价</td>",
        "<td>成交价格</td>",
        "<td>折扣率(%)</td>",
        "<td>建筑面积</td>",
        "<td>套内面积</td>",
        "</tr>"
    );
    return html.join( "" );
}

// 初始化附属房产价格信息
function initialAttachRoomPriceInfo( TotalPrice, DiscountPrice, discount )
{
    var txtAttachRoomsTotalPrice = $( '#txtAttachRoomsTotalPrice' ),
        txtAttachRoomsDiscountPrice = $( '#txtAttachRoomsDiscountPrice' ),
        txtAttachRoomsTotalPriceDiscountPercent = $( '#txtAttachRoomsTotalPriceDiscountPercent' );

    txtAttachRoomsTotalPrice.val( TotalPrice );
    txtAttachRoomsDiscountPrice.val( DiscountPrice );
    txtAttachRoomsTotalPriceDiscountPercent.val( getAccountingNum( discount, 2 ) );

}


// 保存附属房产信息到隐藏控件中
function recordAttachRooms()
{
    var hidAttachRoomsInfo = $( '#hidAttachRoomsInfo' ),
        hidAttachRoomsTotalInfo = $( '#hidAttachRoomsTotalInfo' ),
        tbAttachRoom = $( '#tbAttachRoom' ),
        cbkCtrl = tbAttachRoom.find( 'tr td input[type=checkbox]' ),
        AttachRoomArr = [],
        roomCount = cbkCtrl.length;

    if ( cbkCtrl.length > 0 )
    {
        cbkCtrl.each( function ( i, cbk )
        {
            var me = $( cbk );
            selectedTr = me.parent().parent();
            AttachRoomArr.push( {
                RoomID: me.val(),
                RoomName: selectedTr.find( 'td:eq(1)' ).text(),
                TotalPrice: selectedTr.find( 'td:eq(2)' ).text(),
                DiscountPrice: selectedTr.find( 'td:eq(3) input[price="Y"]' ).val(),
                discount: selectedTr.find( 'td:eq(4) input[discount="Y"]' ).val(),
                ForSaleConstructionArea: selectedTr.find( 'td:eq(5)' ).text(),
                ForSaleInternalArea: selectedTr.find( 'td:eq(6)' ).text()
            } );
        } );
    }
    var AttachRoomsTotalInfo = {
        RoomTotalNum: roomCount,
        RoomsTotalPrice: $( "#txtAttachRoomsTotalPrice" ).val(),
        RoomsTotalDiscountPrice: $( "#txtAttachRoomsDiscountPrice" ).val(),
        RoomsTotalDiscount: $( "#txtAttachRoomsTotalPriceDiscountPercent" ).val()
    };
    hidAttachRoomsTotalInfo.val( $.jsonToString( AttachRoomsTotalInfo ) );
    hidAttachRoomsInfo.val( $.jsonToString( AttachRoomArr ) );
}