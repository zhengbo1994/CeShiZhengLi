// JScript 文件

function reloadData()
{
    $('#jqGrid1').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqGrid1').getGridParam('postData').FlowModel = getObj("ddlFlowModel").value;
    $('#jqGrid1').getGridParam('postData').State = getObj("ddlState").value;
    $('#jqGrid1').getGridParam('postData').StartDate = getObj("txtStartDate").value;
    $('#jqGrid1').getGridParam('postData').EndDate = getObj("txtEndDate").value;
    $('#jqGrid1').getGridParam('postData').SearchText = getObj("txtFilter").value;

    $('#jqGrid1').trigger('reloadGrid');
}

function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ID=" + rowobject[1] + "'";
    return '<a  href="#ShowCheckDoc" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>' ;
}