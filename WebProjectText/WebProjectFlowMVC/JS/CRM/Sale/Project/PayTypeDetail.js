// JScript 文件

//新建付款方式
function addPayTypeDetail() {
    var sProjectGUID = getObj("hdProjectGUID").value;
    var sPayTypeGUID = getObj("hdPayTypeGUID").value;
    var sPayTypeName = getObj("txtPayTypeName").value;
    var sIsNeedLoan = $("#rdlIsNeedLoan input:checked").val();
    
    openAddWindow( "VPayTypeDetailEdit.aspx?EditType=add&ProjectGUID=" + sProjectGUID + "&PayTypeGUID="
        + sPayTypeGUID + "&PayTypeName="
        + encodeURIComponent( sPayTypeName )
        + "&IsNeedLoan=" + sIsNeedLoan, 800, 600, "gdData" );
}
//修改付款方式
function editPayTypeDetail()
{
    var sProjectGUID = getObj("hdProjectGUID").value;
    var sPayTypeGUID = getObj("hdPayTypeGUID").value;
    var sPayTypeName = getObj("txtPayTypeName").value;
    var sIsNeedLoan = $( "#rdlIsNeedLoan input:checked" ).val();

    openModifyWindow( "VPayTypeDetailEdit.aspx?EditType=edit&ProjectGUID=" + sProjectGUID
        + "&PayTypeGUID=" + sPayTypeGUID
        + "&PayTypeName=" + encodeURIComponent( sPayTypeName )
        + "&IsNeedLoan=" + sIsNeedLoan, 800, 600, "gdData" );
}

//删除付款方式
function delPayTypeDetail()
{
   openDeleteWindow("PayTypeDetail", 13, "gdData");
}

//设置付款时间点
function SetTimeType()
{
    if (trim($("#ddlPayTypeTimeConfigItemGUID").find("option:selected").text()) == "指定时间")
    {      
        //几天内
        getObj("txtTimeIndays").value = "0";
        getObj("txtTimeIndays").style.borderColor = "#c0c4cf";
        getObj("txtTimeIndays").readOnly = true;
        //几个月内
        getObj("txtTimeInMonths").value = "0";
        getObj("txtTimeInMonths").style.borderColor = "#c0c4cf";
        getObj("txtTimeInMonths").readOnly = true;
        //指定时间
        getObj("txtPayTime").style.borderColor = "";
        getObj("txtPayTime").disabled = false;
    }
    else
    {
        //几天内
        getObj("txtTimeIndays").style.borderColor = "";
        getObj("txtTimeIndays").readOnly = false;
        //几个月内
        getObj("txtTimeInMonths").style.borderColor = "";
        getObj("txtTimeInMonths").readOnly = false;
        //指定时间
        getObj("txtPayTime").value = "";
        getObj("txtPayTime").style.borderColor = "#c0c4cf";
        getObj("txtPayTime").disabled = true;
    }
}

//设置授权
function setAllow(bDisplay)
{
    trBuildName.style.display = bDisplay ? "block" : "none";

}
//设置贷款
function setNeedLoan(bDisplay)
{
    trLendingBankConfigItemGUID.style.display = bDisplay ? "block" : "none";
    trProvidentFundConfigItemGUID.style.display = bDisplay ? "block" : "none";
}


function validateSize()
{

    handleBtn(false);
    var timeselect = trim($("#ddlPayTypeTimeConfigItemGUID").find("option:selected").val());
    if (timeselect == "") {
        handleBtn(true);
        return alertMsg('请选择时间点。', getObj("ddlPayTypeTimeConfigItemGUID"));
    }
    var bDisplay = trim($("#ddlPayTypeTimeConfigItemGUID").find("option:selected").text()) == "指定时间";
   
    if (bDisplay)
    {       
        if (getObj("txtPayTime").value == "")
        {
            handleBtn(true);
            return alertMsg('指定时间不能为空。', getObj("txtPayTime"));
        }
    }
    else
    {
       
        if (getObj("txtTimeIndays").value == "0" && getObj("txtTimeInMonths").value == "0")
        {
            handleBtn(true);
            return alertMsg('请填写时间点。', getObj("txtTimeIndays"));
        }
    }
  
    if (getObj("txtInstallmentNum").value != "0")//如果分期不为0
    {
        if (getObj("txtPayDayOfInstallment").value == "") //
        {
            handleBtn(true);
            return alertMsg('每月几日交款时间不能为空。', getObj("txtPayDayOfInstallment"));
        }
        else if (getObj("txtPayMonthOnce").value == "")
        {
            handleBtn(true);
            return alertMsg('间隔几个月交款时间不能为空。', getObj("txtPayMonthOnce"));
        }
    }


    //清空无关控件的值， #trIsDeductDeposit，trPayDayOfInstallment
    //原来判断条件会加上bDisplay,但我觉得任何时候都要判断是否同时存在值或者同时不存在值
    
    if ( ( getObj( "txtFundsRate" ).value == "0.00" || getObj( "txtFundsRate" ).value == "0" )
        && ( getObj( "txtFundsMoney" ).value == "0.00" || getObj( "txtFundsMoney" ).value == "0" ) )
    {
        handleBtn(true);
        return alertMsg('比例和金额不能同时为空。', getObj("txtFundsRate"));
    }
  
    //chj 不能同时有值
    if ( ( getObj( "txtFundsRate" ).value != "0.00" && getObj( "txtFundsRate" ).value != "0" )
        && ( getObj( "txtFundsMoney" ).value != "0.00" && getObj( "txtFundsMoney" ).value != "0" ) )
    {
        handleBtn(true);
        return alertMsg('比例和金额不能同时有值。', getObj("txtFundsRate"));
    }

    try {
        if (parseFloat(getObj("txtFundsRate").value) > 100 || parseFloat(getObj("txtFundsRate").value)<0) {
            handleBtn(true);
            return alertMsg('比例数值不能大于100或者小于0', getObj("txtFundsRate"));
        }
    } catch (e) { }
    //给hdFundsNameConfigItemGUID隐藏控件赋值
    getObj("hdFundsNameConfigItemGUID").value = $("#ddlFundsNameConfigItemGUID").find("option:selected").val();

    return true;
}

//验证比例不能大于100，并且精度为4
function checkFundsRate() {
    var obj = getObj("txtFundsRate");
    obj.value = getRound(obj.value, 4);
    try {
        if (parseFloat(obj.value) > 100) {
            handleBtn(true);
            return alertMsg('比例数值不能大于100', getObj("txtFundsRate"));
        }
    } catch (e) { }
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


/* 改变款项类型 */
function changeFundsType( isWindowLoad )
{
    var projectGUID = getParamValue( 'ProjectGUID' ),
        idType = 'project',
        ddlFundsTypeConfigItemGUID = $( '#ddlFundsTypeConfigItemGUID' ),
        fundsTypeConfigItemGUID = ddlFundsTypeConfigItemGUID.val(), //款项类型
        fundsTypeName = ddlFundsTypeConfigItemGUID.find( 'option[selected]' ).text(),
        hdFundsNameConfigItemGUID = $( '#hdFundsNameConfigItemGUID' ),
        defaultFundsNameConfigItemGUID = isWindowLoad ? hdFundsNameConfigItemGUID.val() : "",
        action = getFundsTypeChangeActionName( fundsTypeName );


    setControlsVisibleByFundsType( fundsTypeName );
    
    rebindDdlBySelectedValue( {
        action: action,
        ID: projectGUID,
        IDType: idType,
        FundsTypeConfigItemGUID: fundsTypeConfigItemGUID
    },
    'ddlFundsNameConfigItemGUID', defaultFundsNameConfigItemGUID, 'SELECT', function ()
    {        
        changeFundsName( isWindowLoad );
    } );
}


function getFundsTypeChangeActionName( fundsTypeName )
{
    return fundsTypeName == "代收费用" ? "CRM_GetAvailableForChargeSet" : "CRM_GetFundsNames";
}

/* 根据款项类型设置控件显示或隐藏         
   是代收费时：
        需隐藏和清空的控件：
            是否扣除定金
            分期
            每月几日交款
            间隔几个月

    不是代收费时：
        需隐藏和清空的控件：
            计算方法
            保留位
            进位方法      
   要清空的控件的值，数字类型的应该值设置为0，文本的设置为空。
   翁化青 2013-06-24
*/
function setControlsVisibleByFundsType( fundsType )
{
    var isForChargeSet = fundsType == "代收费用";

    if ( isForChargeSet )
    {
        $( "#trCalculationMethod" ).show();
        $( "#trSaveBit" ).show();

        $( "#trIsDeductDeposit" ).hide();
        $( "#trPayDayOfInstallment" ).hide();

        $( '#rdlIsDeductDeposit option[value=0]' ).attr( 'selected', 'selected' );
        $( '#txtInstallmentNum' ).val( '0' );
        $( '#txtPayDayOfInstallment' ).val( '0' );
        $( '#txtPayMonthOnce' ).val( '0' );
    }
    else
    {
        $( "#trIsDeductDeposit" ).show();
        $( "#trPayDayOfInstallment" ).show();

        $( "#trCalculationMethod" ).hide();
        $( "#trSaveBit" ).hide();

        $( '#txtCalculationMethod' ).val( '' );
        $( '#hidCalculationMethod' ).val( '' );
        $( '#ddlCarryMethod' ).attr( 'selectedIndex', '0' );
    }
}

// 修改款项名称下拉框事件
function changeFundsName( isWindowLoad )
{
    var hdFundsNameConfigItemGUID = $( '#hdFundsNameConfigItemGUID' ),
        ddlFundsNameConfigItemGUID = $( '#ddlFundsNameConfigItemGUID' ),
        fundsType = trim( $( "#ddlFundsTypeConfigItemGUID" ).find( "option:selected" ).text() );

    hdFundsNameConfigItemGUID.val( ddlFundsNameConfigItemGUID.val() );

    //是不是代收费用
    var isForChargeSet = fundsType == "代收费用" ? true : false;

    if ( isForChargeSet )
    {
        bindForChargeSetInfo(isWindowLoad);
    }
}

// 绑定代收费用信息
function bindForChargeSetInfo( isWindowLoad )
{
    var projectGUID = getObj( "hdProjectGUID" ).value; //款项名称
    var fundsNameConfigItemGUID = getObj( "ddlFundsNameConfigItemGUID" ).value; //款项名称

    ajax( 'VPayTypeDetailAdd.aspx',
    {
        action: 'GetForChargeSet',
        FundsNameConfigItemGUID: fundsNameConfigItemGUID,
        ProjectGUID: projectGUID
    }, 'json', function (data,textStatus)
    {
        if(!isWindowLoad)
        {
            setControlsByForChargeSet( data );
        }
        setRateAndMoneyTxtReadonlyByForChargeSet();
    });
}

// 为代收费用设置比例和金额的文本框是否只读
function setRateAndMoneyTxtReadonlyByForChargeSet()
{
    var txtFundsRate = $( "#txtFundsRate" ),
        txtFundsMoney = $( "#txtFundsMoney" ),
        calculationMethod = $( "#hidCalculationMethod" ).val(),
        FIX_AMOUNT_CODE = "4",
        bNeedEnterMoney = calculationMethod == FIX_AMOUNT_CODE;

    setIDTextIsReadonly( txtFundsRate, bNeedEnterMoney );
    setIDTextIsReadonly( txtFundsMoney, !bNeedEnterMoney );
}

// 根据代收费用信息设置相关空间
function setControlsByForChargeSet( data )
{
    if ( data && data.length > 0 )
    {
        var strCalculationMethod = "",
            txtFundsRate = $( "#txtFundsRate" ),
            txtFundsMoney = $( "#txtFundsMoney" ),
            bNeedEnterMoney = data[0].CalculationMethod == "4";

        switch ( data[0].CalculationMethod )
        {
            case "1":
                strCalculationMethod = "房款比例";
                break;
            case "2":
                strCalculationMethod = "按揭贷款比例";
                break;
            case "3":
                strCalculationMethod = "公积金贷款比例";
                break;
            case "4":
                strCalculationMethod = "固定金额";
                break;
            case "5":
                strCalculationMethod = "高级扩展";
                break;
        }

        txtFundsRate.val( data[0].ChargeRate );
        txtFundsMoney.val( data[0].ChargeMoney );

        $( "#txtCalculationMethod" ).val( strCalculationMethod ); //计算方法
        $( "#hidCalculationMethod" ).val( data[0].CalculationMethod );
        $( "#rdlSaveBit input[type=radio][value=" + data[0].SaveBit + "]" ).attr( 'checked', 'checked' );
        $( "#ddlCarryMethod" ).val( data[0].CarryMethod );
    }
}

//清除指定控件内容
function clearOther( otherControl )
{
    getObj( otherControl ).value = '0.00';
}