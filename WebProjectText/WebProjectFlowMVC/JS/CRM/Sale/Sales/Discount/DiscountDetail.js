function loadDiscountDetailList()
{
    var url = getCurrentUrl(),
        projectGUID = getParamValue( 'ProjectGUID' ),
        payTypeGUID = getParamValue( 'PayTypeGUID' ),
        payTypeName = decodeURI( getParamValue( 'PayTypeName' ) ),
        payTypeDiscountRate = getParamValue( 'PayTypeDiscountRate' ),
        strID = getParamValue( 'discountInfoContainer' ),
        win = !!window.dialogArguments ? window.dialogArguments : window,
        discountDetailInfoContainer = $( '#' + strID, win.document ),
        discountDetailInfo = $.parseJSON( discountDetailInfoContainer.val() );
   
    loadCurrentDiscountInfo( discountDetailInfo );
    loadEnableDiscountGUIDByProject( projectGUID );
    bindDiscountDetailList( payTypeGUID, payTypeName, payTypeDiscountRate,discountDetailInfo );
    exportDiscountFormulaDescription();
}

// 加载已选折扣明细中使用的折扣方案ID
function loadCurrentDiscountInfo( discountDetailInfo )
{
    var discountGUID = getParamValue( 'DiscountGUID' );
    $( '#hidCurrentDiscountGUID' ).val( discountGUID );

}

// 加载当前生效的折扣方案ID
function loadEnableDiscountGUIDByProject( projectGUID )
{
    var discountGUID = getEnableDiscountGUID( projectGUID, 'project' ),
        hidEnableDiscountGUID = $( '#hidEnableDiscountGUID' );

    hidEnableDiscountGUID.val( discountGUID );
}

function bindDiscountDetailList( payTypeGUID, payTypeName, payTypeDiscountRate, listInfo )
{
    var tb = $( '#tbDiscountList tbody' ),
        tr, td,
        frag = document.createDocumentFragment();

    clearTable( tb[0], 1 );
    
    // 将付款方式对应的折扣信息添加到折扣明细列表
    tr = buildPayTypeDiscountRateItem( payTypeGUID, payTypeName, payTypeDiscountRate );
    if ( tr != null )
    {
        frag.appendChild( tr );
    }

    // 将折扣明细信息添加到折扣明细列表
    if ( listInfo && listInfo.length )
    {
        for ( var i = 0; i < listInfo.length; i++ )
        {
            tr = buildDiscountDetailListItem( listInfo[i] );

            frag.appendChild( tr );
        }
    }
    tb.append( frag );
}

// 根据付款方式创建折扣明细列表中的折扣明细项
function buildPayTypeDiscountRateItem( payTypeGUID, payTypeName, payTypeDiscountRate )
{
    if ( !payTypeGUID || !payTypeName )
    {
        return null;
    }
    var tr, td;
    tr = document.createElement( "tr" );

    td = document.createElement( "td" );
    td.style.textAlign = "center";
    tr.appendChild( td );

    // 折扣项名称
    td = document.createElement( "td" );
    td.innerHTML = payTypeName;
    tr.appendChild( td );

    // 计算方法
    td = document.createElement( "td" );
    td.style.textAlign = "center";
    td.innerHTML = "打折";
    tr.appendChild( td );

    // 折扣(%)
    td = document.createElement( "td" );
    td.style.textAlign = "right";
    td.innerHTML = createDiscountRateTextBox( "1", payTypeDiscountRate, "N" );
    tr.appendChild( td );

    // 优惠金额
    td = document.createElement( "td" );
    td.style.textAlign = "right";
    td.innerHTML = createDiscountMoneyTextBox( "1", "", "N" );
    tr.appendChild( td );

    // 折扣说明
    td = document.createElement( "td" );
    td.innerHTML = "付款方式定义的折扣";
    tr.appendChild( td );
    return tr;
}

// 创建折扣明细项在列表中的tr对象
function buildDiscountDetailListItem( item )
{
    if ( !item )
    {
        return false;
    }
    var tr, td;
    tr = document.createElement( "tr" );

    td = document.createElement( "td" );
    td.style.textAlign = "center";
    td.innerHTML = "<input type='checkbox' onclick='selectRow(this)' guid='" + item.DiscountDetailGUID
        //+ "' discountGUID='" + item.DiscountGUID
        + "' discountType='" + item.DiscountType
        + "' rankNo='" + item.RankNo
        + "' isAllowAdjust='" + item.IsAllowAdjust + "' />";

    tr.appendChild( td );

    // 折扣项名称
    td = document.createElement( "td" );
    td.innerHTML = item.DiscountDetailName;
    tr.appendChild( td );

    // 计算方法
    td = document.createElement( "td" );
    td.style.textAlign = "center";
    td.innerHTML = item.DiscountTypeName;
    tr.appendChild( td );

    // 折扣(%)
    td = document.createElement( "td" );
    td.style.textAlign = "right";
    td.innerHTML = createDiscountRateTextBox( item.DiscountType, item.DiscountRate, item.IsAllowAdjust );
    tr.appendChild( td );

    // 优惠金额
    td = document.createElement( "td" );
    td.style.textAlign = "right";
    td.innerHTML = createDiscountMoneyTextBox( item.DiscountType, item.DiscountMoney, item.IsAllowAdjust );
    tr.appendChild( td );

    // 折扣说明
    td = document.createElement( "td" );
    td.innerHTML = item.Remark;
    tr.appendChild( td );
    return tr;
}


// 创建折扣率文本框，返回html
function createDiscountRateTextBox( discountType, discountRate, isAllowAdjust )
{
    // 折扣方法取值为：（ 1 打折 2 减点 3 总价优惠 4 单价优惠 ），当discountType（折扣方法)为1、2时，文本框可修改，否则只读。
    var editable = isAllowAdjust == "Y" && /[12]/.test( discountType ),
        strOnblurEvent = editable ? 'setRound(2);exportDiscountFormulaDescription();' : '';

    return getTextBoxHtml( null, null, null, strOnblurEvent, discountRate, !editable, null, 'right' );
}

// 创建折扣金额文本框，返回html
function createDiscountMoneyTextBox( discountType, discountMoney, isAllowAdjust )
{
    // 折扣方法取值为：（ 1 打折 2 减点 3 总价优惠 4 单价优惠 ），当discountType（折扣方法)为1、2时，文本框只读，否则可修改。
    var editable = isAllowAdjust == "Y" && /[34]/.test( discountType ),
        strOnblurEvent = editable ? 'setRound(2);exportDiscountFormulaDescription();' : '';

    return getTextBoxHtml( null, null, null, strOnblurEvent, discountMoney, !editable, null, 'right' );
}


function btnAddDiscount_Click()
{
    if ( !checkCouldAddDiscountItemOrNot() )
{
        return false;
    }

    // 先缓存已选的折扣项ID集合
    cacheExistDiscountDetailGUIDs();

    var projectGUID = getParamValue( 'ProjectGUID' ),
        discountInfo = openModalWindow( '../../../../Common/Select/CRM/VSelectDiscountDetail.aspx?ProjectGUID=' + projectGUID
            + '&hidIDs=hidExistIDs', 800, 600 ),
        tb = $( '#tbDiscountList tbody' );

    addDiscountDetailItems( tb, discountInfo );
    updateCurrentDiscountGUID( discountInfo );
}

function btnDeleteDiscount_Click()
{
    deleteTableRow( getObj( 'tbDiscountList' ) );
    exportDiscountFormulaDescription();
}

// 获取折扣明细项的行集合
function getDiscountDetailItemRow()
{
    var tb = $( '#tbDiscountList tbody' ),
        cbks = tb.find( 'tr:gt(0) input[type=checkbox]' ),
        rows = cbks.closest( 'tr' );

    return rows;
}

// 判断是否可以添加折扣项
function checkCouldAddDiscountItemOrNot()
{
    var currentDiscountGUID = $( '#hidCurrentDiscountGUID' ).val(),
        enableDiscountGUID = $( '#hidEnableDiscountGUID' ).val(),
        trs = getDiscountDetailItemRow(),
        discountItemCount = trs.length;

    if ( !enableDiscountGUID )
    {
        return alertMsg( "当前项目没有有效的折扣方案，无法添加折扣项。" );
    }
    // 当列表中折扣项个数大于0，且折扣项的折扣方案ID与项目当前生效的折扣方案ID不一致时，不能添加折扣项
    if ( !!currentDiscountGUID && currentDiscountGUID != enableDiscountGUID && discountItemCount > 0 )
    {
        return alertMsg( "项目折扣方案已发生变化，若要增加折扣项，请先删除现有的所有折扣项。" );
    }

    return true;
}

// 添加折扣项后要刷新当前折扣方案ID
function updateCurrentDiscountGUID( discountDetailInfo )
{
    var hidCurrentDiscountGUID = $( '#hidCurrentDiscountGUID' ),
        currentDiscountGUID = getFirstDiscountGUID( discountDetailInfo );

    if ( !!currentDiscountGUID )
    {
        hidCurrentDiscountGUID.val( currentDiscountGUID );
    }
}

// 获取折扣项集合的第一个折扣项的DiscountGUID
function getFirstDiscountGUID( discountDetailInfo )
{
    if ( discountDetailInfo && discountDetailInfo.length > 0 )
    {
        return discountDetailInfo[0]["DiscountGUID"];
    }
    return "";
}

// 获取折扣项集合的第一个折扣项的DiscountDetailGUID
function getFirstDiscountDetailGUID( discountDetailInfo )
{
    if ( discountDetailInfo && discountDetailInfo.length > 0 )
{
        return discountDetailInfo[0]["DiscountGUID"];
    }
    return "";
}

// 缓存已选的折扣项ID集合
function cacheExistDiscountDetailGUIDs()
{
    var tb = $( '#tbDiscountList tbody' ),
     hidExistIDs = $( '#hidExistIDs' );

    var idArr = [],
        cbks = tb.find( 'tr td input[type=checkbox]' );

    if ( cbks.length )
    {
        cbks.each( function ( i, o )
        {
            idArr.push( o.guid );
        } );
    }

    hidExistIDs.val( idArr.join() );
}


function addDiscountDetailItems( table, listInfo )
{
    if ( !listInfo || !listInfo.length )
    {
        return false;
    }
    for ( var i = 0; i < listInfo.length; i++ )
    {
        insertDiscountDetailItemIntoList( table, listInfo[i] );
    }

    exportDiscountFormulaDescription();
}

// 根据折扣项的序号获取在列表中的插入位置
function findInsertionPositionByRankNo( table, rankNo )
{
    if ( isNaN( rankNo ) || parseInt( Number( rankNo ) ) !== parseFloat( Number( rankNo ) ) )
    {
        throw new Error( "折扣项序号无效。" );
    }

    var rows = $( table ).find( 'tr' ),
        cbks = rows.find( 'td input[type=checkbox]' ),
        targetRow,
        targetIndex = -1;
    
    if ( cbks.length > 0 )
    {
        cbks.each( function ( i, o )
        {
            if ( o.rankNo > rankNo )
            {
                targetRow = $(o).parent().parent();
                targetIndex = rows.index( targetRow );
                return false;
            }
        } );
    }

    return targetIndex;
}

// 将单个折扣项插入到折扣明细列表中
function insertDiscountDetailItemIntoList( table, item )
{
    if ( !table || !item )
    {
        return false;
    }

    var insertionPosition = findInsertionPositionByRankNo( table, item.RankNo ),
        row = buildDiscountDetailListItem( item );

    insertRowIntoTable( table, row, insertionPosition );
}

// 将tr对象按传入的index插入table中。若index不在有效索引区域，如小于0或大于length，则将tr直接加在table的末尾
function insertRowIntoTable( table, row, index )
{
    var tb = $( table ), r = $( row );

    if ( !tb.length || !r.length
    || isNaN( index ) || parseInt( Number( index ) ) !== parseFloat( Number( index ) ) )
    {
        return false;
    }

    var rowCount = tb.find( 'tr' ).length,
        closestRow;

    if ( index < 0 || index >= rowCount )
    {
        tb.append( r );
    }
    else
    {
        closestRow = tb.find( 'tr:eq(' + index + ')' );
        r.insertBefore( closestRow );
    }
}

// 输出折扣公式描述
function exportDiscountFormulaDescription()
{
    var discountDetailInfoArray = buildDiscountDetailInfoArray();
    $( '#spnDiscountDescription' ).text( buildDiscountFormulaDescription( discountDetailInfoArray ) );
}

// 生成折扣公式描述
function buildDiscountFormulaDescription( discountDetailArray )
{
    var strDesc = [],
        strFormula = [],
        payTypeGUID = getParamValue( 'PayTypeGUID' ),
        payTypeName = decodeURI( getParamValue( 'PayTypeName' ) ),
        payTypeDiscountRate = getParamValue( 'PayTypeDiscountRate' );

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
            strFormula.push( getDiscountFollowUpText( discountDetailArray[i] ), ")" );
        }
    }

    strDesc.push( strFormula.join( "" ) );

    return strDesc.join( "" );
}

function buildDiscountDetailInfoArray()
{
    var trs = getDiscountDetailItemRow(),
        discountDetailInfoArray = [],
        discountDetailItem;

    trs.each( function ( i, tr )
    {
        discountDetailItem = getDiscountDetailItemRowInfo( tr );
        discountDetailInfoArray.push( discountDetailItem );
    } );

    return discountDetailInfoArray;
}

function getDiscountDetailItemRowInfo( tr )
{
    tr = $( tr );

    var cbk = tr.find( 'td:eq(0) input[type=checkbox]' ),
        discountDetailGUID = cbk.attr( 'guid' ),
        discountDetailName = tr.find( 'td:eq(1)' ).text(),
        discountType = cbk.attr( 'discountType' ),
        discountTypeName = tr.find( 'td:eq(2)' ).text(),
        rankNo = cbk.attr( 'rankNo' ),
        discountRate = tr.find( 'td:eq(3) input[type=text]' ).val(),
        discountMoney = tr.find( 'td:eq(4) input[type=text]' ).val(),
        remark = tr.find( 'td:eq(5)' ).text(),
        isAllowAdjust = cbk.attr( 'isAllowAdjust' );

    return {
        DiscountDetailGUID: discountDetailGUID,
        DiscountDetailName: discountDetailName,
        DiscountType: discountType,
        DiscountTypeName: discountTypeName,
        DiscountRate: discountRate,
        DiscountMoney: discountMoney,
        IsAllowAdjust: isAllowAdjust,
        RankNo: rankNo,
        Remark: remark
    };
}

// 获取折扣项的总额，返回折扣率或实际金额，用于添加到公式尾部
function getDiscountFollowUpText( discountDetailItemInfo )
{
    var suffixText = [],
        opt = "",
        discountAmountText = "",
        ONE_HUNDRED_PERCENT = 100;

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

// 格式化数字，用于将折扣金额、折扣率格式化成2位小数。折扣率需要加上百分比符号。
function formatAmount( value, isPercent )
{
    var amount = Number( value ).toFixed( 2 );

    if ( !isNaN( amount ) && isPercent )
    {
        amount += "%";
    }
    return amount;
}


// 折扣明细页确认按钮事件，点击后将折扣信息返回到父页面
function btnSaveClose_Click()
{
    var currentDiscountGUID = $( '#hidCurrentDiscountGUID' ).val(),
        enableDiscountGUID = $( '#hidEnableDiscountGUID' ).val(),
        discountData = {},
        discountDetailArr = [],
        trs = getDiscountDetailItemRow(),
        spnDiscountDescription = $( '#spnDiscountDescription' );

    trs.each( function ( i, tr )
    {
        discountDetailItem = getDiscountDetailItemRowInfo( tr );
        discountDetailArr.push( discountDetailItem );
    } );

    window.returnValue = {
        // 若当前没有折扣项信息，则返回当前项目中生效的折扣方案ID
        discountGUID: currentDiscountGUID || enableDiscountGUID,
        discountDetailArr: discountDetailArr,
        discountFormulaDescription: spnDiscountDescription.text()
    };
    window.close();
}