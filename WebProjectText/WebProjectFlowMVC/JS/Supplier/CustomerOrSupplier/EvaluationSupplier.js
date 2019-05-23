
/* 刷新jqGrid */
function reloadData()
{
    $('#jqEvaluationCustomerOrSupplier').getGridParam('postData').COSRSID = getObj("ddlCOSRegSort").value;  
    $('#jqEvaluationCustomerOrSupplier').getGridParam('postData').ProcessCOSLID = getObj("ddlCompCOSLevel").value;
    $('#jqEvaluationCustomerOrSupplier').getGridParam('postData').COSID = getObj("ddlBusinessSort").value;
    $('#jqEvaluationCustomerOrSupplier').getGridParam('postData').KeyWord = getObj("txtKey").value;
    $('#jqEvaluationCustomerOrSupplier').getGridParam('postData').COSQName = getObj("txtCOSQName").value;
    $('#jqEvaluationCustomerOrSupplier').trigger('reloadGrid');
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}
//查看供应商信息
function renderCustomerOrSupplier(cellvalue,options,rowobject)
{
    var url = "'VCustomerOrSupplierBrowse.aspx?COSID="+rowobject[0]+"'";
    return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',800,600)">'+cellvalue+'</a></div>' ;
}
//企业资质 鄢亚龙 2013-05-30
function btnSelectCOSQName_Click() {
    openModalWindow('../../Common/Select/ZBidding/VSelectTCOSQualification.aspx', 500, 500);
}
