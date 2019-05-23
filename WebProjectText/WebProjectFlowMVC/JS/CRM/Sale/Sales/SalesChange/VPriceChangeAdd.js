//操作。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
function Submit(Send)
{
    if (!confirm("确定要提交吗？")) return;
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };

    //附属房产信息
    recordAttachRooms();
    var JsonAttachRoomsTotalInfo = $('#hidAttachRoomsTotalInfo').val();
    var JarryAttachRoomsInfo = $('#hidAttachRoomsInfo').val();

    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value; //区别于新增的参数
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val();

    //价格变更数据
    var totalPrice = getObj("txtOrderRoomTotalPrice").value;
    var payType = getObj("ddlPayType2").value;
    var CalPriceType = $('#rdlCalPriceType input:checked').val();
    var ReturnDiscountGUID = getObj("hidReturnDiscountGUID").value;
    var NewPayTypeDiscountRate=getObj("hidNewPayTypeDiscountRate").value;
    var json = { vSalesChangeID: SalesChangeID, vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType,
        vTotalPrice: totalPrice, vPayType: payType, vCalPriceType: CalPriceType, vReturnDiscountGUID: ReturnDiscountGUID,vNewPayTypeDiscountRate:NewPayTypeDiscountRate
    };
    var discountList = getObj("hidDiscountInfoContainer2").value;
  

    var query = $.jsonToString(json);
    /*/* Ajax请求 
    function ajax(url, data, dataType, sucess, async, type, before, complete)
    */
    ajax(location.href,
    { action: "Add", isSend: Send, strData: query,
        vDiscountList: discountList, vAttachRoomsInfo: JarryAttachRoomsInfo, vAttachRoomsTotalInfo: JsonAttachRoomsTotalInfo
    },
    "text",
    function (data, stu)
    {
        alertMsg(data == "success" ? "操作成功！" : data);
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

function Save(Send)
{
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };
    //附属房产信息
    recordAttachRooms();
    var JsonAttachRoomsTotalInfo = $('#hidAttachRoomsTotalInfo').val();
    var JarryAttachRoomsInfo = $('#hidAttachRoomsInfo').val();

    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value; //区别于新增的参数
    var SalesOrderID = getObj("hidSalesOrderID").value;
    var ResonType = getObj("ddlReasonType").value;
    var HandFee = getObj("txtHandFee").value.replace(/\,/g, "");
    var Reason = getObj("txtReason").value;
    var PayedMoney = getObj("txtPayedMoney").value.replace(/\,/g, "");
    var CreaterName = getObj("txtCreaterName").value;
    var CreaterAccountID = getObj("hidCreaterAccountID").value;
    var CreaterDefaultStationID = getObj("hidCreaterDefaultStationID").value;
    var CreateDate = getObj("IDDCreateDate").value;
    var CheckType = $('#rblCheckType input:checked').val();

    //价格变更数据
    var totalPrice = getObj("txtOrderRoomTotalPrice").value;
    var payType = getObj("ddlPayType2").value;
    var CalPriceType = $('#rdlCalPriceType input:checked').val()
    var NewPayTypeDiscountRate=getObj("hidNewPayTypeDiscountRate").value;
    var json = { vSalesChangeID: SalesChangeID, vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType:CheckType,vNewPayTypeDiscountRate:NewPayTypeDiscountRate,
        vTotalPrice: totalPrice, vPayType: payType, vCalPriceType: CalPriceType
    };
    var discountList = getObj("hidDiscountInfoContainer2").value;

    var query = $.jsonToString(json);
    ajax(location.href, { action: "Edit", isSend: Send, strData: query, vDiscountList: discountList
    , vAttachRoomsInfo: JarryAttachRoomsInfo, vAttachRoomsTotalInfo: JsonAttachRoomsTotalInfo
    },
    "text",
    function (data, stu)
    {
        alertMsg(data == "success" ? "操作成功！" : data);
        if (data == "success") {
            closeMe();
        }
        handleBtn(true);
    });

    return true;
}


//function Check(isAgree)
//{
//    handleBtn(false);
//    var SalesOrderID = getObj("hidSalesOrderID").value;
//    ajax(location.href, { action: "Check", isAgree: isAgree }, "text", function (data, stu)
//    {
//        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
//        window.returnValue = data;
//        if (data == "success") closeMe();
//    });
//    handleBtn(true);
//}




//初始化......................................................................
function initCtrls(roomGUID, ChangeID, SalesOrderID, MainOrderID)
{

    enableControl();

    var action = $('#hidAction').val();
    //附属房产绑定
    if (action == "Add") {
        //新增从销售单取数据
        bindAttachRoomInfo(roomGUID, extendFunFromParent, 'detail', 'TSalesOrder', SalesOrderID);
    } else if (action == "Edit") {
        //编辑从变更表取数据
        bindAttachRoomInfo(roomGUID, extendFunFromParent, 'detail', 'TSalesPriceChange', ChangeID);
    } else if (action == "Check") {
        //编辑从变更表取数据
        bindAttachRoomInfo(roomGUID, extendFunFromParent, 'detail', 'TSalesPriceChange', ChangeID);
        disabledFormElements("trAttachRoom");
    }

    var Type = $('[name$=rdlCalPriceType][checked]').val();
    $('#hidCalPriceType').val(Type);
    var originClass = $("input[ctrlType = 'price']").attr("class");
    $("input[ctrlType = 'price']").attr('disabled', 'disabled');
    $("input[ctrlType = 'price']").removeClass().addClass('graytext');
    //显示折扣率
    $('#txtDiscountRate').removeAttr('disabled');
    if (Type == 1) { //按建筑面积        
        //显示建筑单价
        $('#txtStruTransUnitPrice').removeAttr('disabled');
        $('#txtStruTransUnitPrice').removeClass().addClass(originClass);

    } else if (Type == 2) {//按套内面积
        $('#txtInterTransUnitPrice').removeAttr('disabled');
        $('#txtInterTransUnitPrice').removeClass().addClass(originClass);
    } else if (Type == 3) {//按套
        $('#txtOrderRoomTotalPrice').removeAttr('disabled');
        $('#txtOrderRoomTotalPrice').removeClass().addClass(originClass);
    } else {//没选择
    }

    setCtrlsByMode();
    //重置价格变更数值
    if (action == "Add") {
        resetCtrls();
    }
    else {
        exportDiscountFormulaDescriptionForChange();
    }

}

//根据配置（成交总价录入模式）控制读写,即是否允许手工调整价格
function setCtrlsByMode()
{
    var mode = $("#hidTotalPriceGetMode").val();
    if (mode == 2) {
        $("#txtStruTransUnitPrice").attr('disabled', 'disabled');
        $("#txtInterTransUnitPrice").attr('disabled', 'disabled');
        $('#txtDiscountRate').attr('disabled', 'disabled');
        $('#txtOrderRoomTotalPrice').attr('disabled', 'disabled');
    }
}

function resetCtrls()
{
    setNumberCtrlValueWithPrecision($('#txtStruTransUnitPrice'), $('#txtConstructionTransactionUnitPrice').val());
    setNumberCtrlValueWithPrecision($('#txtInterTransUnitPrice'), $('#txtInternalTransactionUnitPrice').val());
    setNumberCtrlValueWithPrecision($('#txtDiscountRate'), $('#txtSaleDiscountRate').val());
    $('#txtDiscountExplain').val($('#txtSaleDiscountExplain').val());
    setNumberCtrlValueWithPrecision($('#txtOrderRoomTotalPrice'), $('#txtRoomDiscountPrice').val());
    var OrderTotalPrice = accAdd($('#txtRoomDiscountPrice').val(), $('#txtAttachRoomsDiscountPrice').val());
    setNumberCtrlValueWithPrecision($('#txtOrderTotalPrice'), OrderTotalPrice);
}

function onCalPriceTypeChange()
{
   var Type = $('[name$=rdlCalPriceType][checked]').val();
    $('#hidCalPriceType').val(Type);
    var originClass = $("input[ctrlType = 'price']").attr("class");
    $("input[ctrlType = 'price']").attr('disabled', 'disabled');
    $("input[ctrlType = 'price']").removeClass().addClass('graytext');
    //显示折扣率
    $('#txtDiscountRate').removeAttr('disabled');
    if (Type == 1) { //按建筑面积        
        //显示建筑单价
        $('#txtStruTransUnitPrice').removeAttr('disabled');
        $('#txtStruTransUnitPrice').removeClass().addClass(originClass);

    } else if (Type == 2) {//按套内面积
        $('#txtInterTransUnitPrice').removeAttr('disabled');
        $('#txtInterTransUnitPrice').removeClass().addClass(originClass);
    } else if (Type == 3) {//按套
        $('#txtOrderRoomTotalPrice').removeAttr('disabled');
        $('#txtOrderRoomTotalPrice').removeClass().addClass(originClass);
    } else {//没选择
    }

}

//修改折扣
function selectDiscountInfo()
{
    //变更使用中的
    var strDiscountGUID = $('#hidNowDiscountGUID').val(),
    strProjectGUID = $('#hidProjectGUID').val(),
    ddlPayType2 = $('#ddlPayType2'),
    strPayTypeGUID = ddlPayType2.val(),
    strPayTypeName = ddlPayType2.find('option[selected]').text(),
    newPayTypeDiscountRate = $('#hidNewPayTypeDiscountRate').val();

    discountInfo = openModalWindow('../Discount/VDiscountDetail.aspx?ProjectGUID='+
     strProjectGUID +  
       '&PayTypeGUID=' + strPayTypeGUID+
       '&PayTypeName=' + encodeURI( strPayTypeName )+
       '&PayTypeDiscountRate=' + newPayTypeDiscountRate+
       '&DiscountGUID=' + strDiscountGUID +
     '&discountInfoContainer=hidDiscountInfoContainer2'
             , 800, 600);

    if (!discountInfo) {
        return false;
    }

    var txtSaleDiscountExplain = $('#txtDiscountExplain'),
        hidDiscountInfoContainer = $('#hidDiscountInfoContainer2'),
        hidReturnDiscountGUID = $('#hidReturnDiscountGUID');
    txtSaleDiscountExplain.val(discountInfo.discountFormulaDescription);
    hidReturnDiscountGUID.val(discountInfo.DiscountGUID);
    hidDiscountInfoContainer.val($.jsonToString(discountInfo.discountDetailArr));
    selectDiscountHandler();
}

// 选择折扣，计算房间折扣价格信息，包括房间总价、成交单价、折扣率等。
function selectDiscountHandler()
{
    var priceType = $('#hidCalPriceType').val(), //计价方式
    txtStruTransUnitPrice = $('#txtStruTransUnitPrice'),
    txtInterTransUnitPrice = $('#txtInterTransUnitPrice'),
    txtOrderRoomTotalPrice = $('#txtOrderRoomTotalPrice'),
    txtOrderTotalPrice = $('#txtOrderTotalPrice'), //协议总价
    txtDiscountRate = $('#txtDiscountRate'),

     txtAttachRoomsDiscountPrice = $('#txtAttachRoomsDiscountPrice'),

    roomTotalPrice = $('#txtRoomTotalPrice').val(), //标准总价
    forSaleConstructionArea = $('#txtForSaleConstructionArea').val(),
    forSaleInternalArea = $('#txtForSaleInternalArea').val();

    var NewTotalPrice = calRoomDiscountPrice(roomTotalPrice);
    // 折扣,折后价除以标准总价
    setNumberCtrlValueWithPrecision(txtDiscountRate, calPercent(NewTotalPrice, roomTotalPrice));
    // 建筑成交单价    
    setNumberCtrlValueWithPrecision(txtStruTransUnitPrice, calUnitPrice(NewTotalPrice, forSaleConstructionArea));
    // 套内成交单价
    setNumberCtrlValueWithPrecision(txtInterTransUnitPrice, calUnitPrice(NewTotalPrice, forSaleInternalArea));
    // 总价
    setNumberCtrlValueWithPrecision(txtOrderRoomTotalPrice, NewTotalPrice);
    //协议总价
    orderTotalPrice = accAdd(NewTotalPrice, txtAttachRoomsDiscountPrice.val());
    setNumberCtrlValueWithPrecision(txtOrderTotalPrice, orderTotalPrice);
    //把当前房间总价存入属性中
    txtOrderRoomTotalPrice.attr('originalValue', txtOrderRoomTotalPrice.val());
    exportDiscountFormulaDescriptionForChange();
    
}

// 修改折扣时也要反算。
function reCalByTypeForDiscount()
{
    var priceType = $('#hidCalPriceType').val(), //计价方式
    txtStruTransUnitPrice = $('#txtStruTransUnitPrice'),
    txtInterTransUnitPrice = $('#txtInterTransUnitPrice'),
    txtOrderRoomTotalPrice = $('#txtOrderRoomTotalPrice'),
    txtOrderTotalPrice = $('#txtOrderTotalPrice'), //协议总价
    txtDiscountRate = $('#txtDiscountRate'),

     txtAttachRoomsDiscountPrice = $('#txtAttachRoomsDiscountPrice'),

    roomTotalPrice = $('#txtRoomTotalPrice').val(), //标准总价
    forSaleConstructionArea = $('#txtForSaleConstructionArea').val(),
    forSaleInternalArea = $('#txtForSaleInternalArea').val(),
    orderRoomTotalPriceDecimalPlace = $('#txtOrderRoomTotalPrice').attr('precision');

    //原总价，总价，建筑单价，套内单价，折扣率，
    var originalDiscountPrice, discountRate, totalPrice, orderTotalPrice, struPrice, interPrice, discountRate;

    //计算出结果并赋值给控件

    discountRate = txtDiscountRate.val();
    originalTotalPrice = txtOrderRoomTotalPrice.val();

    totalPrice = calPriceByPercent(roomTotalPrice, discountRate);
    totalPrice = getAccountingNum(totalPrice, orderRoomTotalPriceDecimalPlace);

    //协议总价
    orderTotalPrice = accAdd(totalPrice, txtAttachRoomsDiscountPrice.val());
    struPrice = accDiv(totalPrice, forSaleConstructionArea);
    interPrice = accDiv(totalPrice, forSaleInternalArea);

    setNumberCtrlValueWithPrecision(txtDiscountRate, discountRate);
    setNumberCtrlValueWithPrecision(txtOrderRoomTotalPrice, totalPrice);
    setNumberCtrlValueWithPrecision(txtStruTransUnitPrice, struPrice);
    setNumberCtrlValueWithPrecision(txtInterTransUnitPrice, interPrice);
    setNumberCtrlValueWithPrecision(txtOrderTotalPrice, orderTotalPrice);

    // 更新折扣信息中的手工调整项(跟最新的原成交总房价相比)
    //    alert(originalTotalPrice);
    //    alert(totalPrice);
    newestManuallyAdjustPrice = accSub(originalTotalPrice, totalPrice);
    //    alert(newestManuallyAdjustPrice);
    addManuallyAdjustPrice(newestManuallyAdjustPrice);

    exportDiscountFormulaDescriptionForChange();

    //把当前房间总价存入属性中
    txtOrderRoomTotalPrice.attr('originalValue', txtOrderRoomTotalPrice.val());
}

//反算控件值
function reCalByType()
{
    var priceType = $('#hidCalPriceType').val(), //计价方式
    txtStruTransUnitPrice = $('#txtStruTransUnitPrice'),
    txtInterTransUnitPrice = $('#txtInterTransUnitPrice'),
    txtOrderRoomTotalPrice = $('#txtOrderRoomTotalPrice'),
    txtOrderTotalPrice = $('#txtOrderTotalPrice'), //协议总价
    txtDiscountRate = $('#txtDiscountRate'),

    txtAttachRoomsDiscountPrice = $('#txtAttachRoomsDiscountPrice'),

    roomTotalPrice = $('#txtRoomTotalPrice').val(), //标准总价
    forSaleConstructionArea = $('#txtForSaleConstructionArea').val(),
    forSaleInternalArea = $('#txtForSaleInternalArea').val();

    //原总价，总价，建筑单价，套内单价，折扣率，
    var totalPrice, struPrice, interPrice, discountRate;

    //计算出结果
    originalTotalPrice = txtOrderRoomTotalPrice.attr('originalValue');
    if (priceType == 1) { //按建筑面积        
        //房间总价=建筑面积×成交建筑单价
        totalPrice = accMul(txtStruTransUnitPrice.val(), forSaleConstructionArea);
        //建筑单价=修改值
        struPrice = txtStruTransUnitPrice.val();
        //套内单价=总价/套内面积
        interPrice = accDiv(totalPrice, forSaleInternalArea);
    } else if (priceType == 2) {//按套内面积
        //房间总价=套内面积×成交套内单价
        totalPrice = accMul(txtInterTransUnitPrice.val(), forSaleInternalArea);
        //套内单价=修改值
        interPrice = txtInterTransUnitPrice.val();
        //建筑单价=总价/建筑面积
        struPrice = accDiv(totalPrice, forSaleConstructionArea);

    } else if (priceType == 3) {//按套
        totalPrice = txtOrderRoomTotalPrice.val();
        struPrice = accDiv(totalPrice, forSaleConstructionArea);
        interPrice = accDiv(totalPrice, forSaleInternalArea);

    } else {//
    }

    // 计算房间总价折扣率
    discountRate = calPercent(totalPrice, roomTotalPrice);

    // 设置房间销售信息（包括成交单价、折扣率、房间总价）
    setNumberCtrlValueWithPrecision(txtDiscountRate, discountRate);
    setNumberCtrlValueWithPrecision(txtStruTransUnitPrice, struPrice);
    setNumberCtrlValueWithPrecision(txtInterTransUnitPrice, interPrice);
    setNumberCtrlValueWithPrecision(txtOrderRoomTotalPrice, totalPrice);
    setNumberCtrlValueWithPrecision(txtOrderTotalPrice, accAdd(totalPrice, txtAttachRoomsDiscountPrice.val()));

    // 更新折扣信息中的手工调整项(跟最新的原成交总房价相比)    
    newestManuallyAdjustPrice = accSub(originalTotalPrice, totalPrice);
    addManuallyAdjustPrice(newestManuallyAdjustPrice);

    exportDiscountFormulaDescriptionForChange();

    //把当前房间总价存入属性中
    txtOrderRoomTotalPrice.attr('originalValue', txtOrderRoomTotalPrice.val());
}


// 将最新的手工调整记录添加到折扣信息中
function addManuallyAdjustPrice(adjustPrice)
{
    if (isNaN(adjustPrice) || Number(adjustPrice) === 0) {
        return false;
    }

    var hidDiscountInfoContainer = $('#hidDiscountInfoContainer2'),
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

    if (existManuallyAdjustItem) {
        manuallyAdjustItem = discountDetailInfoArray.pop();
    }
    else {
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
    if (manuallyAdjustItem.DiscountMoney != 0) {
        //alert("DiscountMoney:"+manuallyAdjustItem.DiscountMoney);
        discountDetailInfoArray.push(manuallyAdjustItem);
    }

    hidDiscountInfoContainer.val($.jsonToString(discountDetailInfoArray));
}

// 输出折扣公式描述
function exportDiscountFormulaDescriptionForChange()
{
    var hidDiscountInfoContainer = $('#hidDiscountInfoContainer2'),
        discountDetailInfoArray = $.parseJSON(hidDiscountInfoContainer.val()),
        ddlPayType2 = $('#ddlPayType2'),
        strPayTypeGUID = ddlPayType2.val(),
        strPayTypeName = ddlPayType2.find('option[selected]').text(),
        newPayTypeDiscountRate = $('#hidNewPayTypeDiscountRate').val();

    $('#txtDiscountExplain').val(buildDiscountFormulaDescription(strPayTypeGUID, strPayTypeName, newPayTypeDiscountRate,
        discountDetailInfoArray));
}


// 获取折扣项的总额，返回折扣率或实际金额
function getDiscountSuffixText(discountDetailItemInfo)
{
    var suffixText = [],
        opt = "",
        discountAmountText = "";
    switch (Number(discountDetailItemInfo.DiscountType)) {
        // 打折，获取discountRate     
        case 1:
            opt = "*";
            discountAmountText = formatAmount(discountDetailItemInfo.DiscountRate, true);
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

// 计算房间总价,获取折扣、面积信息，综合房间标准总价计算得出折后总价,roomTotalPrice=标准总价
function calRoomDiscountPrice(roomTotalPrice)
{
    var hidDiscountInfoContainer = $('#hidDiscountInfoContainer2'),
        discountDetailInfoArray = $.parseJSON(hidDiscountInfoContainer.val()),
        item,
        salesPriceType,
        area = getCurrentArea(),
        discountRate=accDiv($("#hidNewPayTypeDiscountRate").val(),100);
        discountPrice =accMul(roomTotalPrice,discountRate);
    for (var i = 0; isArray(discountDetailInfoArray) && i < discountDetailInfoArray.length; i++) {
        item = discountDetailInfoArray[i];
        switch (Number(item.DiscountType)) {
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
    var rdlSalePriceType = $('[name$=rdlCalPriceType][checked]'),
        areaCtrlID,
        areaCtrl,
        area;

    if (rdlSalePriceType.length == 0) {
        return 0;
    }

    // 计价方式
    switch (Number(rdlSalePriceType.val())) {
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
    areaCtrl = $('#' + areaCtrlID);
    area = formatNumText(areaCtrl.val());
    area = isNaN(area) ? 0 : Number(area);
    return area;
}

function extendFunFromParent()
{
    OrderTotalPrice = accAdd($('#txtOrderRoomTotalPrice').val(), $('#txtAttachRoomsDiscountPrice').val());
    setNumberCtrlValueWithPrecision($('#txtOrderTotalPrice'), OrderTotalPrice);
}

// 绑定付款方式信息
function onNewPayTypeChange()
{
    var ddlPayType = $('#ddlPayType2'),
       payTypeGUID = ddlPayType.val();
    bindPayTypeInfo(payTypeGUID, selectDiscountHandler);
}

function bindPayTypeInfo(payTypeGUID, callback)
{
    var hidNewPayTypeDiscountRate = $('#hidNewPayTypeDiscountRate'),
        DEFAULT_PAY_TYPE_DISCOUNT_RATE = 100;

    if (!!payTypeGUID) {
        ajaxRequest('FillData.ashx',
        {
            action: "CRM_GetPayTypeInfo",
            PayTypeGUID: payTypeGUID
        },
        'json', function (data, status)
        {         
            if (!data) {
                hidNewPayTypeDiscountRate.val(DEFAULT_PAY_TYPE_DISCOUNT_RATE);

            } else {
                hidNewPayTypeDiscountRate.val(data.DiscountRate);
            }

            if (typeof callback == 'function') {
                callback();
            }
        });
    } else {
        hidNewPayTypeDiscountRate.val(DEFAULT_PAY_TYPE_DISCOUNT_RATE);

        if (typeof callback == 'function') {
            callback();
        }
    }
}
