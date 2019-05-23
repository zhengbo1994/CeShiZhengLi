// JScript 文件

//搜索
function filteData()
{
    var varFilter=$("#txtFilter").val();
    $("#jqHistoryCustomerOrSupplier").getGridParam("postData").Filter = varFilter;
    $("#jqHistoryCustomerOrSupplier").getGridParam("postData").COSQName = getObj("txtCOSQName").value;
    refreshJQGrid("jqHistoryCustomerOrSupplier");
}    

function ddlProject_Change()
{
    var projectID = $("#ddlProject").val();
    if(projectID.indexOf("C_")>-1)
    {
         return alertMsg("请选择项目。", getObj("ddlProject"));
    }
    $('#jqHistoryCustomerOrSupplier').getGridParam('postData').ProjectID = projectID;
    refreshJQGrid('jqHistoryCustomerOrSupplier');
   
} 

//查看供应商信息
function renderCustomerOrSupplier(cellvalue,options,rowobject)
{
    var url = "'VCustomerOrSupplierBrowse.aspx?COSID="+options.rowId+"'";
    return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',800,600)">'+cellvalue+'</a></div>' ;
}
//企业资质 鄢亚龙 2013-05-30
function btnSelectCOSQName_Click() {
    openModalWindow('../../Common/Select/ZBidding/VSelectTCOSQualification.aspx', 500, 500);
}