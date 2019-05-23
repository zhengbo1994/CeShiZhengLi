function openSelectLookAccount()
{
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?From=Execute&CorpID=' + getObj("hidCorpID").value, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidExecuteAccountID").value = vValue.split('|')[0];
        getObj("txtExecuteAccount").value = vValue.split('|')[1];
    }
} 

function validateSize()
{    
    setBtnEnabled('btnSaveClose',false);
    if($('#rdoFinish :radio:checked').val()=='Y' && $('#txtReviewTime').val().length>0 )
    {        
        if(compareDate((new Date()).Format('yyyy-MM-dd'),$('#txtReviewTime').val())==-1)
        {
            setBtnEnabled('btnSaveClose',true);
            return alertMsg('预警复查日期不能早于当前日期。',$('#txtReviewTime'));
        }
    }
    
    if($('#txtHandleAdvice').val().length<=0)
    {
        setBtnEnabled('btnSaveClose',true);
        return alertMsg('处理意见不能为空',$('#txtHandleAdvice').get(0));
    }
    
    return true;    
}

//设置预警复查日期
function checkWarningTime()
{
    var chkNerverWarning = $('#chkNerverWaring');
    var txtReviewTime = $('#txtReviewTime');
    if (chkNerverWarning.length >= 1 && txtReviewTime.length >= 1)
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