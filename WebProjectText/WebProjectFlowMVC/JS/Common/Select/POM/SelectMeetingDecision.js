function reloadData()
{   
    var vStartTime=$('#txtStartTime').val();
    var vEndTime=$('#txtEndTime').val(); 
    if (vStartTime != '' && vEndTime != '')
    {
        if(compareDate(vStartTime,vEndTime)==-1)
        {
            return alertMsg('结束时间必须大于开始时间。');
        }
    }
    
    if(loadJQGrid('jqMeetingDecision',{
        AjaxCorpID:$('#ddlCorp').val(), 
        StartTime:vStartTime,
        EndTime:vEndTime,     
        MLID:$('#ddlMeetingLevel').val(),
        MTID:$('#ddlMeetingType').val(),  
        KeyWord:$('#txtKW').val()
    }))
    {
        refreshJQGrid('jqMeetingDecision');
    }  
}

function renderTitleLink(cl,opt,rl)
{
     return "<div><a href=\"javascript:openWindow('../../../POM/MeetingDecision/VMeetingDecisionBrowse.aspx?ID="+opt.rowId+"',700,500);\">"+cl+"</div>"; 
}

function renderTemplateLink(cl,opt,rl)
{
    return "<div><a href=\"javascript:openWindow('../../../POM/KnowledgeManage/VMeetingDecisionTemplateBrowse.aspx?ID="+rl[0]+"',650,450);\">"+cl+"</div>";  
}

//bClear,是否清空选择
function finishSelect(bClear)
{
    var retValue = {"action":(bClear?"clear":"select")};    
    if(!bClear)
    {
        var ids = [];
        if(checkJQGridEnableMultiSel('jqMeetingDecision'))
        {
            ids = ids.concat(getJQGridSelectedRowsID('jqMeetingDecision',true));
        }
        else
        { 
            if(!getJQGridSelectedRowsID('jqMeetingDecision',false))
            {
                return alertMsg('请选择会议决策。');
            }
            ids.push(getJQGridSelectedRowsID('jqMeetingDecision',false));
        }     
           
        if(ids.length<=0)
        {
            return alertMsg('请选择会议决策。');
        }
        
        retValue.Datas = [];
        $.each(ids,function(i,id){       
            retValue.Datas.push({            
                ID:id,
                Name:stripHtml($('#jqMeetingDecision').getRowData(id)['MDName']),
                No:stripHtml($('#jqMeetingDecision').getRowData(id)['MDNo']),
                MDTID:stripHtml($('#jqMeetingDecision').getRowData(id)['MDTID']),
                MDTName:stripHtml($('#jqMeetingDecision').getRowData(id)['MDTName']),
                CorpID:stripHtml($('#jqMeetingDecision').getRowData(id)['CorpID']),
                ProjectID:stripHtml($('#jqMeetingDecision').getRowData(id)['ProjectID']),
                StartDate:stripHtml($('#jqMeetingDecision').getRowData(id)['PSD']),
                EndDate:stripHtml($('#jqMeetingDecision').getRowData(id)['PED']),
                MLID:stripHtml($('#jqMeetingDecision').getRowData(id)['MLID']),
                MTID:stripHtml($('#jqMeetingDecision').getRowData(id)['MTID']),
                PrincipalStationID:stripHtml($('#jqMeetingDecision').getRowData(id)['PrincipalStationID']),
                MTarget:stripHtml($('#jqMeetingDecision').getRowData(id)['MTarget'])
            });
        }); 
    }
    
    window.returnValue = retValue;
    window.opener = null;
    window.close();
}