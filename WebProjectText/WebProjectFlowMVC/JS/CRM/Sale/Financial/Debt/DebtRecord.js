/*催款记录JS文件
**添加人：杨亮
**添加日期：2013-06-13
**后台文件：IDWebSoft\CRM\Sale\Financial\Debt\VDebtDetail.aspx
*/



//选择催款人
function selectAccount() {
    var rValue = openModalWindow('../../../../Common/Select/VSelectSingleAccount.aspx', 800, 600);
    if (!!rValue) {
        $("#txtPaymentPeople").val(rValue.Name);
        $("#hidPaymentPeople").val(rValue.ID);
    }
}


//验证表单
function validateFrom() {

    setBtnEnabled(['btnSave', 'btnClose'], false);
    if ($.ideaValidate()) {
        setBtnEnabled(['btnSave', 'btnClose'], true);
        
        return true;
    }
    else {
        setBtnEnabled(['btnSave', 'btnClose'], true);
        return false;
    }
    return true;
}


