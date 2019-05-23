// 按钮显示控制
function btnDisplayController()
{
	var roomSaleStatus = $('#hidRoomSaleStatus').val(),
		hidIsAttachRoom = $('#hidIsAttachRoom').val(),
		btnSubscription = $('#btnSubscription'),
		btnContract = $('#btnContract'),
		btnMore = $( '#divMortgageSubsidySchemeForm #btnMore' );

	if (/[34]/.test(roomSaleStatus) && hidIsAttachRoom=="N")
	{
		btnSubscription.show();
		btnContract.show();
		btnMore.attr('menu', 'Add|Reservation|预约,Add|Reserved|预留,Add|MortgageParameters|按揭参数,add|MortgageCalculationTools|按揭计算工具,add|SeniorMortgageSubsidyScheme|高级置业计划');
	}
	else
	{
		btnSubscription.hide();
		btnContract.hide();
		btnMore.attr('menu', 'Add|MortgageParameters|按揭参数,add|MortgageCalculationTools|按揭计算工具,add|SeniorMortgageSubsidyScheme|高级置业计划');
	}
 }


function changePayType()
{
    var ddlPayType = $( '#ddlPayType' ),
        payTypeGUID = ddlPayType.val();

    bindPayTypeInfo( payTypeGUID, function ()
    {
        recalculatedRoomSalesInformation();
        exportDiscountFormulaDescription();
        bindLendingAreaInfo( payTypeGUID );
    } );
}


// 绑定付款方式信息
function bindPayTypeInfo( payTypeGUID, callback )
{
    var hidPayTypeDiscountRate = $( '#hidPayTypeDiscountRate' ),
        DEFAULT_PAY_TYPE_DISCOUNT_RATE = 100;

    if ( !!payTypeGUID )
    {
        ajaxRequest( 'FillData.ashx',
        {
            action: "CRM_GetPayTypeInfo",
            PayTypeGUID: payTypeGUID
        },
        'json', function ( data, status )
        {
            if ( !data )
            {
                hidPayTypeDiscountRate.val( DEFAULT_PAY_TYPE_DISCOUNT_RATE );

            } else
            {
                hidPayTypeDiscountRate.val( data.DiscountRate );
            }

            if ( typeof callback == 'function' )
            {
                callback();
            }
        } );
    } else
    {
        hidPayTypeDiscountRate.val( DEFAULT_PAY_TYPE_DISCOUNT_RATE );

        if ( typeof callback == 'function' )
        {
            callback();
        }
    }
}

//绑定贷款信息
function bindLendingAreaInfo( payTypeGUID )
{
	var txtRoomDiscountPrice = $('#txtRoomDiscountPrice'),
		roomDiscountPrice = formatNumText(txtRoomDiscountPrice.val());

	ajaxRequest('FillData.ashx',
	{
		action: "CRM_GetLendingInfoByPayType",
		PayTypeGUID: payTypeGUID,
		TotalPrice: roomDiscountPrice
	},
	'json', function (data, status)
	{
		if (!data || !data.length)
		{
			clearLendingInfo();
			return false;
		}

		var dataRow = data[0],
			lendingInfoControls = getLendingInfoControls(),

			isNeedLoan = dataRow["IsNeedLoan"],

			isExistLendingMoney = dataRow["IsExistLendingMoney"],
			lendingBankMoney = dataRow["LendingBankMoney"],
			lendingMoneyFundsRate = dataRow["LendingMoneyFundsRate"],

			isExistProvidentFundMoney = dataRow["IsExistProvidentFundMoney"],
			providentFundMoney = dataRow["ProvidentFundMoney"],
    		providentFundMoneyFundsRate = dataRow["ProvidentFundMoneyFundsRate"];

		if (isNeedLoan == 'Y')
		{
			setControlsEnable(lendingInfoControls, true);

			bindLendingAreaData('lendingBank', isExistLendingMoney, lendingBankMoney, lendingMoneyFundsRate);
			bindLendingAreaData('providentFund', isExistLendingMoney, providentFundMoney, providentFundMoneyFundsRate);
		}
		else
		{
			setControlsEnable(lendingInfoControls, false);
			clearLendingInfo();
		}
	});
}

function showDiscountInfo()
{
    var ddlPayType = $( '#divMortgageSubsidySchemeForm #ddlPayType' ),
        payTypeGUID = ddlPayType.val(),
        payTypeName = ddlPayType.find( 'option[selected]' ).text(),
        payTypeDiscountRate = $( '#divMortgageSubsidySchemeForm #hidPayTypeDiscountRate' ).val(),

        projectGUID = $( '#divMortgageSubsidySchemeForm #hidProjectGUID' ).val(),
        roomGUID = $( '#divMortgageSubsidySchemeForm #hidRoomGUID' ).val(),
		discountGUID = getDiscountGUID(roomGUID),
		discountInfo = openModalWindow( '../../../Sale/Sales/Discount/VDiscountDetail.aspx?ProjectGUID=' + projectGUID
                + '&PayTypeGUID=' + payTypeGUID
                + '&PayTypeName=' + encodeURI( payTypeName )
                + '&PayTypeDiscountRate=' + payTypeDiscountRate
				+ "&DiscountGUID=" + discountGUID
				+ "&discountInfoContainer=hidDiscountInfoContainer"
			, 800, 600);

	if (!discountInfo)
	{
		return false;
	}

    var txtSaleDiscountExplain = $( '#divMortgageSubsidySchemeForm #txtSaleDiscountExplain' ),
		hidDiscountInfoContainer = $( '#divMortgageSubsidySchemeForm #hidDiscountInfoContainer' );

	txtSaleDiscountExplain.val(discountInfo.discountFormulaDescription);
	hidDiscountInfoContainer.val($.jsonToString(discountInfo.discountDetailArr));

	recalculatedRoomSalesInformation();
}

// 计算房间折扣价格信息，包括房间总价、成交单价、折扣率等。
function recalculatedRoomSalesInformation()
{
	var hidRoomOriginalPrice = $('#hidRoomOriginalPrice'),
        txtSaleDiscountRate = $("#txtSaleDiscountRate"),
        txtRoomDiscountPrice = $('#txtRoomDiscountPrice'),

        roomTotalPrice = hidRoomOriginalPrice.val(),
        roomDiscountPrice = calRoomDiscountPrice(roomTotalPrice);

	// 折扣
	setNumberCtrlValue(txtSaleDiscountRate, calPercent(roomDiscountPrice, roomTotalPrice));
	// 房间总价    
	setNumberCtrlValue(txtRoomDiscountPrice, roomDiscountPrice);
}

// 计算房间总价,获取折扣、面积信息，综合房间标准总价计算得出折后总价
function calRoomDiscountPrice(roomTotalPrice)
{
    var payTypeGUID = $( '#ddlPayType' ).val(),
        payTypeDiscountRate = $( '#hidPayTypeDiscountRate' ).val(),
        hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' ),
        discountDetailInfoArray = $.parseJSON(hidDiscountInfoContainer.val()),
        item,
        salesPriceType,
        area = getCurrentArea(),
        discountPrice = roomTotalPrice;
        
    // 若选择了付款方式，则减去付款方式的折扣
	if ( payTypeGUID && !isNaN( payTypeDiscountRate ) && payTypeDiscountRate != "" )
	{
	    discountPrice = calByDirectDiscount( discountPrice, payTypeDiscountRate );
	}
	
	for (var i = 0; isArray(discountDetailInfoArray) && i < discountDetailInfoArray.length; i++)
	{
		item = discountDetailInfoArray[i];
		switch (Number(item.DiscountType))
		{
			// 打折  
			case 1:
				discountPrice = calByDirectDiscount(discountPrice, item.DiscountRate);
				break;
			// 减点  
			case 2:
				discountPrice = calByLessPoints(discountPrice, roomTotalPrice, item.DiscountRate);
				break;
			// 总价优惠  
			case 3:
				discountPrice = calByTotalPriceConcession(discountPrice, item.DiscountMoney);
				break;
			// 单价优惠  
			case 4:
				discountPrice = calByUnitPriceConcession(discountPrice, item.DiscountMoney, area);
				break;
			// 手工调整  
			case 0:
				discountPrice = calByManuallyAdjust(discountPrice, item.DiscountMoney);
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
	var hidSalePriceType = $('#hidSalePriceType'),
        areaCtrlID,
        areaCtrl,
        area;

	if (hidSalePriceType.length == 0)
	{
		return 0;
	}

	// 计价方式
	switch (Number(hidSalePriceType.val()))
	{
		// 按建筑面积  
		case 1:
			areaCtrlID = "txtNowConstructionArea";
			break;
		// 按套内面积   
		case 2:
			areaCtrlID = "txtNowInternalArea";
			break;
		// 按套  
		case 3:
			areaCtrlID = "txtNowConstructionArea";
			break;
		default:
			areaCtrlID = "";
			break;
	}
	areaCtrl = $('#' + areaCtrlID);
	area = formatNumText(areaCtrl.val());
	area = isNaN(area) ? 0 : Number(area);
	return area;
}


/* 计算房间销售价格信息，如成交单价、房间总价（折后）
当“房间总价”、“折扣率”其中一个被改动时，自动计算另一个数值。
*/
function calRoomForSalesPriceInfo(updatedCtrl)
{
	var txtSaleDiscountRate = $('#txtSaleDiscountRate'),
		txtRoomDiscountPrice = $('#txtRoomDiscountPrice'),
        roomTotalPrice = $('#hidRoomOriginalPrice').val(),
		area = getCurrentArea(),

        discountRate,
        originalDiscountPrice,
        newestManuallyAdjustPrice,
        roomDiscountPrice;

	// 被修改的是折扣
	if ($(updatedCtrl).attr('id') == txtSaleDiscountRate.attr('id'))
	{
		originalDiscountPrice = txtRoomDiscountPrice.val();
		discountRate = txtSaleDiscountRate.val();

		roomDiscountPrice = calPriceByPercent(roomTotalPrice, discountRate);
	}
	// 被修改的是房间总价
	else if ($(updatedCtrl).attr('id') == txtRoomDiscountPrice.attr('id'))
	{
		originalDiscountPrice = txtRoomDiscountPrice.attr('originalValue');
		txtRoomDiscountPrice.removeAttr('originalValue');

		roomDiscountPrice = $(updatedCtrl).val();
	}

	// 计算房间总价折扣率
	discountRate = calPercent(roomDiscountPrice, roomTotalPrice);

	// 设置房间销售信息（包括折扣率、房间总价）
	setNumberCtrlValue(txtSaleDiscountRate, discountRate);
	setNumberCtrlValue(txtRoomDiscountPrice, roomDiscountPrice);

	// 更新折扣信息中的手工调整项
	originalDiscountPrice = originalDiscountPrice ? originalDiscountPrice : 0;
	newestManuallyAdjustPrice = accSub(originalDiscountPrice, roomDiscountPrice);
	addManuallyAdjustPrice(newestManuallyAdjustPrice);
	exportDiscountFormulaDescription();


	// 触发计算贷款信息
	calAllLendingInfo();

	// 触发计算摘要部分的金额信息
	//bindSummaryMoneyInfo();
}

// 输出折扣公式描述
function exportDiscountFormulaDescription()
{
    var hidDiscountInfoContainer = $( '#hidDiscountInfoContainer' ),
        discountDetailInfoArray = $.parseJSON( hidDiscountInfoContainer.val() ),
        ddlPayType = $( '#ddlPayType' ),
        payTypeGUID = ddlPayType.val(),
        payTypeName = ddlPayType.find( 'option[selected]' ).text(),
        payTypeDiscountRate = $( '#hidPayTypeDiscountRate' ).val();

    $( '#txtSaleDiscountExplain' ).val(
        buildDiscountFormulaDescription( payTypeGUID, payTypeName, payTypeDiscountRate, discountDetailInfoArray )
     );
}

// 生成折扣公式描述
function buildDiscountFormulaDescription( payTypeGUID, payTypeName, payTypeDiscountRate, discountDetailArray )
{
	var strDesc = [],
        strFormula = [];
	
	strDesc.push("以标准总价为基准计算: ");
	
	if ( payTypeGUID )
	{
	    strFormula.push( payTypeName, " ", formatAmount( payTypeDiscountRate, true ) );
	}
	else
	{
	    strFormula.push( "标准总价 100.00%" );
	}

	if (discountDetailArray)
	{
		for (var i = 0; i < discountDetailArray.length; i++)
		{
			strFormula.unshift("(");
			strFormula.push(getDiscountSuffixText(discountDetailArray[i]), ")");
		}
	}

	strDesc.push(strFormula.join(""));

	return strDesc.join("");
}


// 获取折扣项的总额，返回折扣率或实际金额
function getDiscountSuffixText(discountDetailItemInfo)
{
	var suffixText = [],
        opt = "",
        discountAmountText = "",
        ONE_HUNDRED_PERCENT = 100;

	switch (Number(discountDetailItemInfo.DiscountType))
	{
		// 打折，获取discountRate   
		case 1:
			opt = "*";
			discountAmountText = formatAmount(ONE_HUNDRED_PERCENT - discountDetailItemInfo.DiscountRate, true);
			break;
		// 减点，获取discountRate   
		case 2:
			opt = "-";
			discountAmountText = formatAmount(discountDetailItemInfo.DiscountRate, true);
			break;
		// 总价优惠，获取discountMoney       
		case 3:
			opt = "-";
			discountAmountText = formatAmount(discountDetailItemInfo.DiscountMoney, false);
			break;
		// 单价优惠，获取获取discountMoney      
		case 4:
			opt = "-";
			discountAmountText = "(" + formatAmount(discountDetailItemInfo.DiscountMoney, false) + " * 面积)";
			break;
		default:
			opt = "-";
			discountAmountText = "";
			break;
	}

	suffixText.push(" ", opt, " ", discountDetailItemInfo.DiscountDetailName, " ", discountAmountText, ")");

	return suffixText.join("");
}

// 将最新的手工调整记录添加到折扣信息中
function addManuallyAdjustPrice(adjustPrice)
{
	if (isNaN(adjustPrice) || Number(adjustPrice) === 0)
	{
		return false;
	}

	var hidDiscountInfoContainer = $('#hidDiscountInfoContainer'),
        discountDetailInfoArray = $.parseJSON(hidDiscountInfoContainer.val()),
        discountDetailInfoArray = isArray(discountDetailInfoArray) ? discountDetailInfoArray : [],
        existManuallyAdjustItem = !!discountDetailInfoArray
                                    && isArray(discountDetailInfoArray)
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

	if (existManuallyAdjustItem)
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

	manuallyAdjustItem.DiscountMoney = accAdd(manuallyAdjustItem.DiscountMoney, adjustPrice);

	// 当手动调整金额为0时，不将手动调整折扣项推入折扣信息数组。相当于移除手动调整
	if (manuallyAdjustItem.DiscountMoney != 0)
	{
		discountDetailInfoArray.push(manuallyAdjustItem);
	}

	hidDiscountInfoContainer.val($.jsonToString(discountDetailInfoArray));
}


function resetRoomDiscountPrice()
{
	var txtRoomDiscountPrice = $('#txtRoomDiscountPrice'),
        roomTotalPrice = $('#hidRoomOriginalPrice').val();

	txtRoomDiscountPrice.val(roomTotalPrice);
}

function clearDiscountDetail()
{
	$('#hidDiscountInfoContainer').val('');
	exportDiscountFormulaDescription();
}


function getLendingInfoControls()
{
	return $('#txtLendingBankMoney,#txtLendingBankMoneyFundsRate,#txtProvidentFundMoney,#txtProvidentFundMoneyFundsRate');
}

function getLendingAreaCtrls(lendingType)
{
	var idPart;

	if (lendingType == 'lendingBank')
	{
		idPart = "LendingBank";
	}
	else if (lendingType == 'providentFund')
	{
		idPart = "ProvidentFund";
	}
	else
	{
		return null;
	}

	var ctrls = {};
	ctrls.txtMoney = $('#txt' + idPart + 'Money'),
	ctrls.txtRate = $('#txt' + idPart + 'MoneyFundsRate');

	return ctrls;
}

function calAllLendingInfo()
{
	calLendingInfo('lendingBank');
	calLendingInfo('providentFund');
}

function calLendingInfo(lendingType, updatedCtrl)
{
	var lengdingAreaCtrls = getLendingAreaCtrls(lendingType);

	if (!lengdingAreaCtrls)
	{
		return false;
	}

	var txtMoney = lengdingAreaCtrls.txtMoney,
		txtRate = lengdingAreaCtrls.txtRate,
		txtRoomDiscountPrice = $('#txtRoomDiscountPrice'),

		money,
		rate,
		roomDiscountPrice = txtRoomDiscountPrice.val();

	// 被修改的是贷款金额
	if ($(updatedCtrl).attr('id') == txtMoney.attr('id'))
	{
		money = $(updatedCtrl).val();
		rate = calPercent(money, roomDiscountPrice);
	}
	// 被修改的是贷款率
	else if ($(updatedCtrl).attr('id') == txtRate.attr('id'))
	{
		rate = $(updatedCtrl).val();
		money = calPriceByPercent(roomDiscountPrice, rate);
	}
	// 被修改的是房款总额或在加载内容时调用
	else
	{
		rate = txtRate.val();
		money = calPriceByPercent(roomDiscountPrice, rate);
	}

	$(updatedCtrl).removeAttr('originalValue');

	setNumberCtrlValue(txtMoney, money);
	setNumberCtrlValue(txtRate, rate);
}





// 绑定贷款区域数据，可用于绑定按揭贷款或公积金贷款的数据
function bindLendingAreaData(lendingType, isEnabled, money, rate)
{
	var lengdingAreaCtrls = getLendingAreaCtrls(lendingType);

	if (!lengdingAreaCtrls)
	{
		return false;
	}

	var txtMoney = lengdingAreaCtrls.txtMoney,
				txtRate = lengdingAreaCtrls.txtRate;

	if (isEnabled)
	{
		txtMoney.val(money);
		txtRate.val(rate);
	}
	else
	{
		txtMoney.val('0');
		txtRate.val('0.00');
	}
}


// 清空贷款信息表单的内容
function clearLendingInfo()
{
	var txtLendingBankMoney = $('#txtLendingBankMoney'),
		txtLendingBankMoneyFundsRate = $('#txtLendingBankMoneyFundsRate'),
		txtProvidentFundMoney = $('#txtProvidentFundMoney'),
		txtProvidentFundMoneyFundsRate = $('#txtProvidentFundMoneyFundsRate');

	txtLendingBankMoney.val('0');
	txtLendingBankMoneyFundsRate.val('0.00');
	txtProvidentFundMoney.val('0');
	txtProvidentFundMoneyFundsRate.val('0.00');
}

/**************************  更多操作点击事件相关配置 ***********************************/
if ( typeof clickMenuEventHandlers == 'undefined' )
{
    var clickMenuEventHandlers = {};
}
mergeJsonData( clickMenuEventHandlers, {
    "Reservation": function ()
    {
        var roomGUID = $( '#hidMortgageSubsidySchemeCacheInfo' ).attr('RoomGUID');
        
        openAddWindow( "../../../Sale/Sales/Reservation/VReservationEdit.aspx?EditType=add&RoomGUID=" + roomGUID,
             0, 0, "" );
    }
}, true );

function newSubscription()
{
    var hidMortgageSubsidySchemeCacheInfo = $( '#hidMortgageSubsidySchemeCacheInfo' ),
        projectGUID = hidMortgageSubsidySchemeCacheInfo.attr( 'ProjectGUID' ),
        roomGUID = hidMortgageSubsidySchemeCacheInfo.attr( 'RoomGUID' ),
        roomLockStatus = getRoomLockStatus( roomGUID ),
        roomLockedAlterMsg;

    if ( !isRoomLocked( roomLockStatus ))
    {
        openAddWindow( "../../../Sale/Sales/SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=S&ProjectGUID=" + projectGUID + "&RoomGUID=" + roomGUID,
                            1000, 800, "" );
    }
    else
    {
        roomLockedAlterMsg = getRoomLockedAlterMsg( roomLockStatus );
        return alertMsg( roomLockedAlterMsg );
    }
}

function newContract()
{
    var hidMortgageSubsidySchemeCacheInfo = $( '#hidMortgageSubsidySchemeCacheInfo' ),
        projectGUID = hidMortgageSubsidySchemeCacheInfo.attr( 'ProjectGUID' ),
        roomGUID = hidMortgageSubsidySchemeCacheInfo.attr( 'RoomGUID' ),
        roomLockStatus = getRoomLockStatus( roomGUID ),
        roomLockedAlterMsg;

    if ( !isRoomLocked( roomLockStatus ))
    {
        openAddWindow( "../../../Sale/Sales/SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=C&ProjectGUID=" + projectGUID + "&RoomGUID=" + roomGUID,
            1000, 800, "" );
    }
    else
    {
        roomLockedAlterMsg = getRoomLockedAlterMsg( roomLockStatus );
        return alertMsg( roomLockedAlterMsg );
    }
						
}

function saveOriginalValue(obj)
{
	if (!obj)
	{
		return false;
	}

	obj["originalValue"] = obj.value;
}

function setControlsEnable(jqObjects, isEnable)
{
	if (typeof jqObjects.attr == 'function' && typeof isEnable == 'boolean')
	{
		jqObjects.attr('disabled', isEnable ? '' : 'disabled');
	}
}