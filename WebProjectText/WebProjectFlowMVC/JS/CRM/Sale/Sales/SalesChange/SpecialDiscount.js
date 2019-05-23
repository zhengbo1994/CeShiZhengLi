/*************************************************************操作**********************************************/
//操作。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
function Submit(Send) {
    if (!confirm("确定要提交吗？")) return;
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };

    //所选优惠方式（1打折 2单价优惠 3总价优惠 4 指定单价 5 指定总价）
    var YhType = $("#rdlDiscountTypeGUID input[checked=true]").attr("value");
    //当前计价方式rdlCalPriceType（1，建筑 2套内 3套）
    var CalPriceType = $("#rdlSalePriceType input[checked=true]").attr("value");
    //获取表单数据并提交后台处理
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

    //新总价
    var NewTotalPrice = getObj("txtNewTotalPrice").value;
    //折扣率：优惠方式为“打折”就取控件值，反之为0
    var discountRate = YhType == 1 ? getObj("txtNewDiscountRate").value : "0";
    //优惠金额，不是“打折”就取控件值，反之为0
    var discountNumber = YhType != 1 ? getObj("txtDiscountNumber").value : "0";
   
    var json = { vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType,
        vNewTotalPrice: NewTotalPrice, vDiscountRate: discountRate, vDiscountNumber: discountNumber, vYhType: YhType
    };

    var query = $.jsonToString(json);

    /*/* Ajax请求 
    function ajax(url, data, dataType, sucess, async, type, before, complete)
    */
    ajax(location.href, { action: "Add", isSend: Send, strData: query},
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

//编辑
function Save(Send) {
    if (!confirm("确定要保存吗？")) return;
    var isValid = true;
    handleBtn(false);
    if (!checkChangeCommonRequired()) { return };

    //所选优惠方式（1打折 2单价优惠 3总价优惠 4 指定单价 5 指定总价）
    var YhType = $("#rdlDiscountTypeGUID input[checked=true]").attr("value");
    //当前计价方式rdlCalPriceType（1，建筑 2套内 3套）
    var CalPriceType = $("#rdlSalePriceType input[checked=true]").attr("value");
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

    //新总价
    var NewTotalPrice = getObj("txtNewTotalPrice").value;
    //折扣率：优惠方式为“打折”就取控件值，反之为0
    var discountRate = YhType == 1 ? getObj("txtNewDiscountRate").value : "0";
    //优惠金额，不是“打折”就取控件值，反之为0
    var discountNumber = YhType != 1 ? getObj("txtDiscountNumber").value : "0";

    var json = { vSalesChangeID: SalesChangeID, vSaleOrderID: SalesOrderID, vReasonType: ResonType, vHandFee: HandFee, vReason: Reason, vPayedMoney: PayedMoney,
        vCreaterName: CreaterName, vCreaterAccountID: CreaterAccountID, vCreaterDefaultStationID: CreaterDefaultStationID,
        vCreateDate: CreateDate, vCheckType: CheckType,
        vNewTotalPrice: NewTotalPrice, vDiscountRate: discountRate, vDiscountNumber: discountNumber, vYhType: YhType
    };

    var query = $.jsonToString(json);
    ajax(location.href, { action: "Edit", isSend: Send, strData: query },
    "text",
    function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        if (data == "success") closeMe();
    });
    handleBtn(true);
    return true;
}

//审核
function Check(isAgree) {
    if (!confirm("确定要进行审核吗？")) return;
    handleBtn(false);
    var SalesOrderID = getObj("hidSalesOrderID").value;
    ajax(location.href, { action: "Check", isAgree: isAgree }, "text", function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        window.returnValue = data;
        if (data == "success") closeMe();
    });
    handleBtn(true);
}
/*************************************************************初始化**********************************************/
//根据优惠方式计算新成交价格
function calNewPrice() {

    //所选优惠方式（1打折 2单价优惠 3总价优惠 4 指定单价 5 指定总价）
    var YhType = $("#rdlDiscountTypeGUID input[checked=true]").attr("value");


    //当前计价方式rdlCalPriceType（1，建筑 2套内 3套）
    var CalPriceType = $("#rdlSalePriceType input[checked=true]").attr("value");
    var txtStruPrice = $("#txtConstructionTransactionUnitPrice"),
    txtInterPrice = $("#txtInternalTransactionUnitPrice"),
    txtTotalPrice = $("#txtRoomDiscountPrice"),
    //金额
    txtDiscountNumber = $("#txtDiscountNumber"),
    //折扣率
    txtNewDiscountRate=$("#txtNewDiscountRate");

    var txtNewStruPrice=$("#txtNewStruPrice"),
     txtNewInternalPrice=$("#txtNewInternalPrice"),
     txtNewTotalPrice=$("#txtNewTotalPrice");
      //修改对象
    var objToChange = null;
    //修改对象对应的原始值
    var originValueOfObj = null;  
    if (CalPriceType == 1) {//建筑面积
        objToChange = txtNewStruPrice;
        originValueOfObj = txtStruPrice.val();
    } else if (CalPriceType == 2) {//套内面积
        objToChange = txtNewInternalPrice;
        originValueOfObj = txtInterPrice.val();
    } else {//按套
        objToChange = txtNewTotalPrice;
        originValueOfObj = txtTotalPrice.val();
    }
  switch (YhType) {
        //打折：按计价方式打折对应的价格，反算其他价格
      case "1":

          var newData = calPriceByPercent(originValueOfObj, txtNewDiscountRate.val());
          //按精度给修改对象设置新值
          setNumberCtrlValueWithPrecision(objToChange, newData);
          //反算并设置其他值
          reCalNewData(objToChange);
          break;
            //单价优惠:按计价方式给对应的单价减去优惠金额，反算其他价格
      case "2":

          //计价方式是“按套”时，单价优惠指定到建筑单价
          if (CalPriceType == 3) {
              objToChange = txtNewStruPrice;
              originValueOfObj = txtStruPrice.val();
          }

          //计算修改对象的新值,原始单价-优惠金额
          var newData = accSub(originValueOfObj, txtDiscountNumber.val());

          //按精度给修改对象设置新值
          setNumberCtrlValueWithPrecision(objToChange, newData);
          //反算并设置其他值
          reCalNewData(objToChange);
          break;
            //总价优惠:按计价方式给总价减去优惠金额，反算其他价格
      case "3":

          //修改对象一定是房间总价
          objToChange = txtNewTotalPrice;
          originValueOfObj = txtTotalPrice.val();
          //计算修改对象的新值,原始单价-优惠金额
          var newData = accSub(originValueOfObj, txtDiscountNumber.val());

          //按精度给修改对象设置新值
          setNumberCtrlValueWithPrecision(objToChange, newData);
          //反算并设置其他值
          reCalNewData(objToChange);
          break;
            //指定单价：按计价方式指定单价，反算其他价格
      case "4":
          //计价方式是“按套”时，单价优惠指定到建筑单价
          if (CalPriceType == 3) {
              objToChange = txtNewStruPrice;
              originValueOfObj = txtStruPrice.val();
          }

          //按精度给修改对象设置新值
          setNumberCtrlValueWithPrecision(objToChange, txtDiscountNumber.val());
          //反算并设置其他值
          reCalNewData(objToChange);
          break;
            //指定总价：按计价方式指定总价，反算其他价格
      case "5":
          //修改对象一定是房间总价
          objToChange = txtNewTotalPrice;
          originValueOfObj = txtTotalPrice.val();

          //按精度给修改对象设置新值
          setNumberCtrlValueWithPrecision(objToChange, txtDiscountNumber.val());
          //反算并设置其他值
          reCalNewData(objToChange);
          break;
        default:
         
    }
}

//根据优惠类型和目标修改对象设置控件
function YhType_OnClick() {
    //金额
   var txtDiscountNumber = $("#txtDiscountNumber"),
    //折扣率
    txtNewDiscountRate = $("#txtNewDiscountRate"),
    lblNewDiscountRate = $("#lblNewDiscountRate"),
    lblDiscountNumber = $("#lblDiscountNumber");
    //所选优惠方式（1打折 2单价优惠 3总价优惠 4 指定单价 5 指定总价）
    var YhType = $("#rdlDiscountTypeGUID input[checked=true]").attr("value");
    //当前计价方式rdlCalPriceType（1，建筑 2套内 3套）
    var CalPriceType = $("#rdlSalePriceType input[checked=true]").attr("value");
    //打折
    if (YhType == 1) {
        //金额只读
        txtDiscountNumber.hide();
        lblDiscountNumber.hide();
        txtNewDiscountRate.show();
        lblNewDiscountRate.show();
        
    }
    else {
        //金额只读
        txtNewDiscountRate.hide();
        lblNewDiscountRate.hide();
        txtDiscountNumber.show();
        lblDiscountNumber.show();
    }

    switch (YhType) {
        //打折
        case "1":
            txtDiscountNumber.val("0.00");
            txtNewDiscountRate.val("100");
            break;
        //单价优惠
        case "2":
            txtDiscountNumber.val("0.00");
            txtNewDiscountRate.val("0.00");
            break;
        //总价优惠
        case "3":
            txtDiscountNumber.val("0.00");
            txtNewDiscountRate.val("0.00");
            break;
        //指定单价
        case "4":
            if (CalPriceType == 1 || CalPriceType == 3) txtDiscountNumber.val($("#txtConstructionTransactionUnitPrice").val());
            else txtDiscountNumber.val($("#txtInternalTransactionUnitPrice").val());
            txtNewDiscountRate.val("0.00");
            break;
        //指定总价
        case "5":
            txtDiscountNumber.val($("#txtRoomDiscountPrice").val());
            txtNewDiscountRate.val("0.00");
            break;
        default:

    }
    calNewPrice();

}

function reCalNewData(objToChange) {
    var objID = objToChange.attr("id");
    var forSaleConstructionArea = $('#txtForSaleConstructionArea').val(),
    forSaleInternalArea = $('#txtForSaleInternalArea').val(),
    totalPrice,
    struPrice,
    interPrice;
    if (objID == "txtNewStruPrice") {
        //总价
        totalPrice = accMul(objToChange.val(), forSaleConstructionArea);
        //建筑单价=修改值
        struPrice = objToChange.val();
        //套内单价=总价/套内面积
        interPrice = accDiv(totalPrice, forSaleInternalArea);
    }else if (objID == "txtNewInternalPrice") {
        //总价
        totalPrice = accMul(objToChange.val(), forSaleInternalArea);
        //套内单价=修改值
        interPrice = objToChange.val();
        //建筑单价=总价/建筑面积
        struPrice = accDiv(totalPrice, forSaleConstructionArea);
    } else if (objID == "txtNewTotalPrice") {
        totalPrice = objToChange.val();
        struPrice = accDiv(totalPrice, forSaleConstructionArea);
        interPrice = accDiv(totalPrice, forSaleInternalArea);
    }
    //建筑成交单价
    setNumberCtrlValueWithPrecision($("#txtNewStruPrice"), struPrice);
    // 套内成交单价
    setNumberCtrlValueWithPrecision($("#txtNewInternalPrice"), interPrice);
    // 总价
    setNumberCtrlValueWithPrecision($("#txtNewTotalPrice"), totalPrice);
    //协议总价
    orderTotalPrice = accAdd(totalPrice, $('#txtAttachRoomsDiscountPrice').val());
    setNumberCtrlValueWithPrecision($("#txtNewTotalContractPrice"), orderTotalPrice);
}

//初始化新成交信息
function initAfterInfo() {
    //建筑成交单价
    setNumberCtrlValueWithPrecision($("#txtNewStruPrice"), $("#txtConstructionTransactionUnitPrice").val());
    // 套内成交单价
    setNumberCtrlValueWithPrecision($("#txtNewInternalPrice"), $("#txtInternalTransactionUnitPrice").val());
    // 总价
    setNumberCtrlValueWithPrecision($("#txtNewTotalPrice"), $("#txtRoomDiscountPrice").val());
    //协议总价txtAttachRoomsDiscountPrice  
    orderTotalPrice = accAdd($("#txtRoomDiscountPrice").val(), $('#txtAttachRoomsDiscountPrice').val());

    setNumberCtrlValueWithPrecision($("#txtNewTotalContractPrice"), orderTotalPrice);

    //默认选择打折
    var rdl = $("#rdlDiscountTypeGUID");
    var rdbtn = rdl.find("input[value=1]").attr("checked", true);

    $("#txtNewDiscountRate").val("100.00");
    $("#txtDiscountNumber").val("0.00");

    //失效金额
    $("#txtDiscountNumber").hide();
    $("#lblDiscountNumber").hide();
    
}
