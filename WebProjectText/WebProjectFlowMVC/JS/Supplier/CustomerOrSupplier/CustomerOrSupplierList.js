// JScript 文件
/* 刷新jqGrid */
function reloadData()
{
    $('#jqCustomerOrSupplier').getGridParam('postData').AreaID = getObj("ddlArea").value;    
    $('#jqCustomerOrSupplier').getGridParam('postData').COSRSID = getObj("ddlCOSRegSort").value;  
    $('#jqCustomerOrSupplier').getGridParam('postData').COSLID = getObj("ddlCOSLevel").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').PSCID = getObj("ddlPSC").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').IsAll = getObj("chkAll").checked ? "Y" : "N";
    $('#jqCustomerOrSupplier').getGridParam('postData').KeyWord = getObj("txtKey").value;
    $('#jqCustomerOrSupplier').trigger('reloadGrid');
}

//查看供应商信息
function renderCustomerOrSupplier(cellvalue,options,rowobject)
{
    var url = "'VCustomerOrSupplierBrowse.aspx?COSID="+rowobject[0]+"'";
    return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',800,600)">'+cellvalue+'</a></div>' ;
}