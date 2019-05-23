function reloadData()
{    
    $('#jqGrid1').appendPostData({
        'ProjectID':$('#ddlProject').val(),
        'CCState':$('#ddlState').val(),
        'MeDoState':$('#ddlMeDoState').val(),
        'StartTime':$('#txtStartTime').val(),
        'EndTime':$('#txtEndTime').val(),
        'EWType':$('#ddlReqType').val(),
        'IsNeedHandle':$('#ddlIsNeedHandle').val(),
        'KeyWord':$('#txtKW').val()
    });
    
    refreshJQGrid('jqGrid1');       
}

function renderEW(cl, opt, rl)
{
    return "<div><a href=\"javascript:openWindow('VJobEarlyWarningWorkBrowse.aspx?JEWID=" + rl[0] + "',800,600);\">" + cl + "</a></div>";
}

function renderEWProgram(cl,opt,rl)
{
    return "<div><a href=\"javascript:showEWProgram('"+opt.rowId+"');\">"+cl+"</div>";  
}

function showEWProgram(hprid)
{
    openWindow("/" + rootUrl + "/BI/JobEarlyWarning/VHandleProgramRequestBrowse.aspx?HPRID=" + hprid, 0, 0);
}