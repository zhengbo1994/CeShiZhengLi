
function finishSelect()
{
    
        //return alertMsg('请选择一项。');
    
    var tID = $.jgrid.stripHtml(getJQGridSelectedRowsData('jqGrid', false, 'QSTID'));
    var tName = $.jgrid.stripHtml(getJQGridSelectedRowsData('jqGrid', false, 'QSTName'));
    
    if(tID == null || tID == '')
        return alertMsg('请选择一项。', getObj('btnChoose'));
    
    window.returnValue = tID +'|'+tName;
    window.close();
}

function showDetail(cellValue, options, rowObject)
{
    return "<div class=\"nowrap\"><a href=\"javascript:openWindow('../../../POM/TaskTemplate/VTQualitySecurityTemplateBrowse.aspx?TID=" + options.rowId + "', 600, 450)\">" + cellValue + "</a></div>";
}