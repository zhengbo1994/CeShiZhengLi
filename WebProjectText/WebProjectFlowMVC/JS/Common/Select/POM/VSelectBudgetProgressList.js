function reloadData()
{    
    $('#jqGrid1').appendPostData({
        'LevelType':$('#ddlLevelType').val(),        
        'KeyWord':$('#txtKW').val()
    });
    refreshJQGrid('jqGrid1');
}

function renderNameLink(cl,opt,rl)
{
    return "<div><a href=\"javascript:openWindow('../../../POM/ProjectData/VWBSLevelEditBrowse.aspx?ID="+opt.rowId+"',650,450);\">"+cl+"</a></div>";  
}

function finishSelect(bClear)
{
    var retValue = {"action":(bClear?"clear":"select")};    
    if(!bClear)
    {
        var ids = [];
        if(checkJQGridEnableMultiSel('jqGrid1'))
        {
            ids = ids.concat(getJQGridSelectedRowsID('jqGrid1',true));
        }
        else
        { 
            if(!getJQGridSelectedRowsID('jqGrid1',false))
            {
                return alertMsg('请选择任务级别。');
            }
            ids.push(getJQGridSelectedRowsID('jqGrid1',false));
        }     
           
        if(ids.length<=0)
        {
            return alertMsg('请选择任务级别。');
        }
        
        retValue.Datas = [];
        $.each(ids,function(i,id){       
            retValue.Datas.push({            
                ID:id,
                Name:stripHtml($('#jqGrid1').getRowData(id)['WLName']),
                LevelType:stripHtml($('#jqGrid1').getRowData(id)['LevelType'])
            });
        }); 
    }
    
    window.returnValue = retValue;
    window.opener = null;
    window.close();
}

function clearSelect()
{
    finishSelect(true);
}
