
// 计算单价
function calUnitPrice(totalPrice, area)
{
	var result = accDiv(totalPrice, area);
	return isNaN(result) ? 0 : result;
	//return (isNaN(result) ? 0 : result).toFixed(2);
}
// 计算百分比（仅返回百分比的数字部分）
function calPercent(resultPrice, originalPrice)
{
	var result = accDiv(resultPrice, originalPrice);
	return (isNaN(result) ? 0 : (result * 100)).toFixed(2);
}

// 返回价格*百分比的结果
function calPriceByPercent(price, percent)
{
	var result = accDiv(accMul(price, percent), 100);
	return isNaN(result) ? 0 : result;
}

// 返回打折折扣后的价格，算法： 结果 = 当前价格 * 打折百分比
function calByDirectDiscount(price, percent)
{
	return calPriceByPercent(price, percent);
}

// 返回减点折扣后的价格，算法： 结果 = 当前价格 - (标准价格 * 减点百分比)
function calByLessPoints(price, originalPrice, percent)
{
	return accSub(price, calPriceByPercent(originalPrice, percent));
}

// 返回总价优惠后的价格， 算法： 结果 = 当前价格 - 总价优惠金额
function calByTotalPriceConcession(price, amount)
{
	return accSub(price, amount);
}

// 返回单价优惠后的价格， 算法： 结果 = 当前价格 - (单价优惠金额 * 面积)
function calByUnitPriceConcession(price, amount, area)
{
	return accSub(price, accMul(amount, area));
}

// 返回手工调整后的价格， 算法： 结果 = 当前价格 - 手工调整金额
function calByManuallyAdjust(price, amount)
{
	return accSub(price, amount);
}

// 绑定多选项控件的值，如RadioButtonList，CheckBoxList
function bindListControlValue(listControlID, listControlType, value)
{
	$('#' + listControlID).find('input[type=' + listControlType + '][value=' + value + ']').attr('checked', 'checked');
}

// 根据系统设置格式化数字控件内容的格式。
// 通过触发数字控件的onblur事件实现该功能
function FormatNumberCtrlsValue(mappingInfoArr)
{
	var ctrls = null;
	var ctrlIDArr = [];

	for (var numType in mappingInfoArr)
	{
		ctrlIDArr = ctrlIDArr.concat(mappingInfoArr[numType]);
	}

	$('#' + ctrlIDArr.join(',#')).val(function (index, value)
	{
		var currentCtrl = $(this);
		return getAccountingNum(value, currentCtrl.attr('decimalPlace'));
	});
}

// 设置数字控件的值，并返回格式化后的数字控件的值
function setNumberCtrlValue(ele, value)
{
	if (!ele || !$(ele).length)
	{
		return NaN;
	}

	// 当没有设置小数位时，默认为2位小数。
	var DEFAULT_DECIMAL_PLACE = 2,
		ele = $(ele),
        decimalPlace = isNaN($(ele).attr('decimalPlace')) ? DEFAULT_DECIMAL_PLACE : $(ele).attr('decimalPlace'),
		newNumberCtrlValue = getAccountingNum(value, decimalPlace);

	ele.val(newNumberCtrlValue);
	return newNumberCtrlValue;
}

// 绑定系统小数位设置信息
function bindConfigInfo(roomGUID,numTypeInfoContainerID, ctrlTypeMappingData, callback)
{
	var hidContainNumTypeArr = $('#' + numTypeInfoContainerID),
        strContainNumTypeArrStr = hidContainNumTypeArr.val();
 
	ajaxRequest('FillData.ashx',
    {
    	action: "CRM_GetConfigInfoByNumTypeArray",
    	NumTypeArr: strContainNumTypeArrStr,
    	ID: roomGUID, IDType: "room"
    },
    'json', function (data, status)
    {
    	bindCtrlsNumFormat(data, ctrlTypeMappingData);

    	// 执行回调函数
    	if (typeof callback == 'function')
    	{
    		callback(data);
    	}
    });
}

// 绑定数字类型控件的格式设置
// @configInfo 数字类型和小数保留位的映射关系json对象。格式如：{ Area: 2, UnitPrice: 1 };
// @ctrlTypeMappingInfo 数字类型和页面控件ID的映射关系json对象。格式如 { Area:["txt1", "txt2"], UnitPrice:["txt3"] }
function bindCtrlsNumFormat(configInfo, ctrlTypeMappingInfo)
{
	if (!configInfo)
	{
		return false;
	}
	var ctrlIDArr,
        numTypeSaveBit,
        defaultSaveBit = 2,
        currentCtrl,
        originBlurEventStr;

	for (var numType in ctrlTypeMappingInfo)
	{
		ctrlIDArr = ctrlTypeMappingInfo[numType];
		numTypeSaveBit = isNaN(configInfo[numType]) ? defaultSaveBit : configInfo[numType];
		
		for (var i = 0; i < ctrlIDArr.length; i++)
		{
			currentCtrl = $('#' + ctrlIDArr[i]);
			currentCtrl.attr('decimalPlace', numTypeSaveBit);
		}
	}
}

// 通过房间ID获取当前房间所属项目的生效的折扣方案ID
function getDiscountGUID( roomGUID )
{
    return getEnableDiscountGUID( roomGUID, 'room' );
}

function getEnableDiscountGUID( id, idType )
{
    var discountGUID = "";
    ajaxRequest( 'FillData.ashx', { action: "CRM_GetEnableDiscountGUID", ID: id, IDType: idType },
    'text', function ( data, status )
    {
        discountGUID = !!data ? data : "";
    }, false );
    return discountGUID;
}

// 通过折扣项ID获取折扣方案ID
function getCurrentDiscountGUIDByDiscountDetail( discountDetailGUID )
{
    var discountGUID = "";
    ajaxRequest( 'FillData.ashx', { action: "CRM_DiscountGUIDByDiscountDetail", DiscountDetailGUID: discountDetailGUID },
    'text', function ( data, status )
    {
        discountGUID = !!data ? data : "";
    }, false );
    return discountGUID;
}


// 格式化数字，用于将折扣金额、折扣率格式化成2位小数。折扣率需要加上百分比符号。
function formatAmount(value, isPercent)
{
	var amount = getAccountingNum(Number(value), 2);

	if (!isNaN(amount) && isPercent)
	{
		amount += "%";
	}
	return amount;
}
