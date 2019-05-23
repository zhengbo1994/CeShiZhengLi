function validateSize()
{
    setBtnEnabled('btnSaveClose', false);
    if($('#txtReviewTime').val().length>0)
    {
        if (compareDate((new Date()).Format('yyyy-MM-dd'), $('#txtReviewTime').val()) == -1)
        {
            setBtnEnabled('btnSaveClose', true);
            return alertMsg('预警复查日期不能早于当前日期。', $('#txtReviewTime'));
        }
    }
    var IsHandler=$('#hidIsHandler').val();
    var msg = "";
    if (IsHandler == 'Y')
    {
        msg = "确定不予处理，并标记为已阅读吗？";
    }
    else
    {
        msg = "确定要标记为已阅读吗？";
    }

    if (!confirm(msg))
    {
        setBtnEnabled('btnSaveClose', true);
        return false;
    }

    return true;
}

//设置预警复查日期
function checkWarningTime()
{
    var chkNerverWarning = $('#chkNerverWaring');
    var txtReviewTime = $('#txtReviewTime');
    if (chkNerverWarning.length >= 1 && txtReviewTime.length>=1)
    {
        if (chkNerverWarning.attr('checked'))
        {
            $('#txtReviewTime').attr('disabled', 'disabled');
        }
        else
        {
            $('#txtReviewTime').removeAttr('disabled');
        }
    }
}