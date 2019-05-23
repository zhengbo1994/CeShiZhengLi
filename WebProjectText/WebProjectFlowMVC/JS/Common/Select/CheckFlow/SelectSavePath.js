function commitSelect()
{
     var checkedRdo=$(':radio[name=\'rdoCFSIID\']:checked');
     if(!checkedRdo.val() || checkedRdo.val()<=0)
     {
        return alertMsg('请选择地址'); 
     }  
     var opener=window.dialogArguments;
     var txtSavePath = $('#txtSavePath',opener.document);
     var hidSavePathID = $('#hidSavePathID',opener.document);
     var txtSaveDocNo =  $('#txtSaveDocNo',opener.document);
     
     txtSavePath.val(checkedRdo.attr('empname'));
     hidSavePathID.val(checkedRdo.val());
     //是否自动生成文档编号 IsAuto：是归档页面传值 add by zhangmq 2012/8/1
     var isAutoDocNo = getParamValue("IsAuto") == "undefined" ? "Y" : getParamValue("IsAuto");
     if (isAutoDocNo == "Y")
     {
         txtSaveDocNo.val(checkedRdo.attr('saveno') + '-' + checkedRdo.attr('savecount'));
     }            
     window.opener=null;      
     window.close();   
}

