// JScript 文件

function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../PerformanceComplain/VPerformanceComplainBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<div class="nowrap"><a  href="#ShowPerformanceComplain" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a></div>' ;
}

function renderPerformanceComplainLink(cellvalue,options,rowobject)
{
    var url = "'VPerformanceComplainBrowse.aspx?ELID=" +cellvalue + "'";
    return '<div class="nowrap"><a  href="#ShowPerformanceComplain" onclick="javascript:openWindow(' + url + ',500, 400)">查看详细 </a></div>' ;
}

function doSearch()
{
    var sState=$('#ddlCCState').val();
    var sRange=$('#ddlRange').val();
    $('#jqMyPerformanceComplain').getGridParam('postData').CCState = sState;
    $('#jqMyPerformanceComplain').getGridParam('postData').Range = sRange;
    $('#jqMyPerformanceComplain').trigger('reloadGrid');
}
