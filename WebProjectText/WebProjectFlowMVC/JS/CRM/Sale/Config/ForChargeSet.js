/*
客户自定义配置--代收费设置使用到的JS
作者：程镇彪
日期：2012-08-16
*/
//条件搜索
function reloadData()
{
    var sProjectGUID = $('#ddlProjectGUID').val();
    var sKey = getObj("txtKey").value;
//    alert(sProjectGUID)
    $('#jqData').getGridParam('postData').ProjectGUID = sProjectGUID;
    $('#jqData').getGridParam('postData').Key = sKey;
    refreshJQGrid('jqData');
}
//添加
function addVForChargeSet() 
{   
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openAddWindow( "VForChargeSetEdit.aspx?editType=add&ProjectGUID=" + $( "#ddlProjectGUID" ).val() + "&ProjectName=" + encodeURIComponent( sProjectName ), 800, 600, "jqData" );
}

//编辑
function editVForChargeSet()
{
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow("VForChargeSetEdit.aspx?editType=edit&ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqData");
   
}

//删除
function deleteVForChargeSet() 
{
    openDeleteWindow("ForChargeSet", 13, "jqData");
}


function validateSize()
{
    var isValid = true;

    handleBtn( false );
    if ( $.ideaValidate() )
    {
        var ddlCalculationMethod = $( "#ddlCalculationMethod" ),
            calculationMethod = ddlCalculationMethod.val(),
            txtChargeMoney = $( "#txtChargeMoney" ),
            txtChargeRate = $( "#txtChargeRate" );

        // 当计算方法是“固定金额”,且金额为0时
        if ( isValid && calculationMethod == "4" && txtChargeMoney.val() == "0" )
        {
            isValid = alertMsg( "请输入有效金额。", txtChargeMoney[0] );

        }
            // 当计算方法是“房款比例”、“按揭贷款比例”、“公积金贷款比例”时,且比例为0时
        else if ( isValid && /[1235]/.test( calculationMethod ) && txtChargeRate.val() == "0" )
        {
            isValid = alertMsg( "请输入有效比例。", txtChargeRate[0] );
        }
    }
    else
    {
        isValid = false;
    }

    handleBtn( true );
    return isValid;
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function calculationMethodChange()
{
    var ddlCalculationMethod = getObj( "ddlCalculationMethod" ),
        calculationMethod = ddlCalculationMethod.value,
        txtChargeMoney = getObj( "txtChargeMoney" ),
        txtChargeRate = getObj( "txtChargeRate" );


    // 当没有选择计算方法时
    if ( calculationMethod == "" )
    {
        setIDTextIsReadonly( txtChargeMoney, true );
        setIDTextIsReadonly( txtChargeRate, true );

        txtChargeMoney.value = "0";
        txtChargeRate.value = "0";
    }
    // 当计算方法是“固定金额”时
    else if ( calculationMethod == "4" )
    {
        setIDTextIsReadonly( txtChargeMoney, false );
        setIDTextIsReadonly( txtChargeRate, true );

        txtChargeRate.value = "0";
    }
    // 当计算方法是“高级扩展”时
    else if ( calculationMethod == "5" )
    {
        setIDTextIsReadonly( txtChargeMoney, true );
        setIDTextIsReadonly( txtChargeRate, true );

        txtChargeMoney.value = "0";
        txtChargeRate.value = "0";
    }
    // 当计算方法是“房款比例”、“按揭贷款比例”、“公积金贷款比例”时
    else
    {
        setIDTextIsReadonly( txtChargeMoney, true );
        setIDTextIsReadonly( txtChargeRate, false );

        txtChargeMoney.value = "0";
    }
}