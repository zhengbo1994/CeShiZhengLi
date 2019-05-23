function reloadData()
{
    $('#jqWaits').appendPostData({
        ProjectID:$('#ddlProject').val(),
        CCState:$('#ddlCCState').val(),
        KeyValue:$('#txtKey').val()
    });
    refreshJQGrid('jqWaits');
}

function showWaitLookList()
{
     openAddWindow("VWaitLookList.aspx", 950, 700, "jqWaits");
}

function waitDoLink(cellvalue,options,rowobject)
{    
    var vState = rowobject[0];
    var vKeyID = rowobject[1];
    var vUrl = "''";
    switch (vState)
    {
        case "WaitCheck":
            vUrl = "'VWaitCheckEW.aspx?ID=" + vKeyID + "'";
            break;
        case "WaitCommunicate":
            vUrl = "'VWaitCommunicateEW.aspx?ID=" + vKeyID + "'";
            break;
        case "WaitDeal":
            vUrl = "'VWaitDealEW.aspx?ID=" + vKeyID + "'";
            break;
        case "WaitAdjust":
            vUrl = "'VWaitAdjustEW.aspx?ID=" + vKeyID + "'";
            break;
        case "WaitSave":
            vUrl = "'VWaitSaveEW.aspx?ID=" + vKeyID + "'";
            break;
        case "WaitLook":
            vUrl="'VWaitLookEW.aspx?ID="+rowobject[1]+"'"; 
            break;
    }

    return '<a  href="javascript:void(0);" onclick="javascript:openAddWindow(' + vUrl + ', 950, 700, \'jqWaits\');">' + cellvalue + '</a>';
}

function renderEW(cl,opt,rl)
{
    return "<a href=\"javascript:openWindow('VJobEarlyWarningWorkBrowse.aspx?JQID=jqGrid1&JEWID="+rl[2]+"',800,600);\">"+cl+"</a>"; 
}