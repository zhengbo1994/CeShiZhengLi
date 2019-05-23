function reloadData()
{
   var jqObj=$('#jqWaitLookList');
   var corpID=$('#ddlCorp').val();
   var ccState=$('#ddlCCState').val();
   var keyWord=$('#txtKey').val();
   jqObj.getGridParam('postData').CorpID=corpID;
   jqObj.getGridParam('postData').CCState=ccState;
   jqObj.getGridParam('postData').KeyValue=keyWord;
   jqObj.trigger('reloadGrid');
}

function validateLookList()
{
    var vKeyID = getJQGridSelectedRowsData('jqWaitLookList',true,'KeyID');    
    if (!vKeyID || vKeyID.length == 0)
    {
        return alertMsg("请选择申请。", getObj("btnSubmit"));    
    }
    getObj("hidLookList").value = vKeyID.join(',');    
    return true;
}

function validateLook()
{
    setBtnEnabled(getObj("btnSuggest"), false);
    
    var vSuggest = getObj("txtLookRemark").value;
    
    if (vSuggest == "")
    {
        if(!window.confirm("你没有填写阅读意见，确定标为已阅吗？"))
        {
            setBtnEnabled(getObj("btnSuggest"), true);
            getObj("txtLookRemark").focus();
  		return false;
        }
    }
    
    return true;
}

function waitDoLink(cellvalue,options,rowobject)
{
    var vUrl="'VWaitLookEW.aspx?ID=" + rowobject[8] + "'";
    
    return '<div class="nowrap"><a  href="javascript:void(0);" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqWaitLookList\');">' + cellvalue + '</a></div>';
}