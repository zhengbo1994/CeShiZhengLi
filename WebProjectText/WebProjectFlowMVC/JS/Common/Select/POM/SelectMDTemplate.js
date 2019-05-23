function reloadData()
{    
    $('#jqGrid1').appendPostData({
        MTID:$('#ddlMeetingType').val(),
        MLID:$('#ddlMeetingLevel').val(),
        KeyWord:$('#txtKW').val()
    });
    refreshJQGrid('jqGrid1');
}

function renderTitleLink(cl,opt,rl)
{
    return "<div><a href=\"javascript:openWindow('../../../POM/KnowledgeManage/VMeetingDecisionTemplateBrowse.aspx?ID="+opt.rowId+"',650,450);\">"+cl+"</a></div>";  
}

function renderLevelLink(cl,opt,rl)
{
    return "<div><a href=\"javascript:openWindow('../../../POM/ProjectData/VMeetingLevelBrowse.aspx?ID="+rl[0]+"',500,350);\">"+cl+"</a></div>";  
}

function finishSelect()
{
    //多项间，用^分隔 ,单行之间按  ID|Name|No|Date的形式组合
    var retVal=new StringBuilder();
    //判断是否是多选
    var bMulitSelect = $('#jqGrid1').getGridParam('multiselect');
    
    var selectedIDsArr=[];
    var selectedIDs=getJQGridSelectedRowsID('jqGrid1',bMulitSelect);  
    
    //无论对于字符串还是数组来说，length都可以判定是否有元素
    if(!selectedIDs || selectedIDs.length<=0)
    {
        return alertMsg('请先选择模板');
    }
    
    if(!bMulitSelect)
    {
        selectedIDsArr.push(selectedIDs);
    }
    else
    {
        selectedIDsArr = $.merge(selectedIDsArr,selectedIDs);
    }
           
    for(var i=0,iLen=selectedIDsArr.length;i<iLen;i++)
    {        
        retVal.append(
            stringFormat('{0}|{1}|{2}|{3}',selectedIDsArr[i],stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['MDTName']),stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['MDTNo']),stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['CreateDate']))
        );
    }    
    
    window.returnValue=retVal.toString("^");
    window.opener=null;
    window.close();
}

function clearSelect()
{
    window.returnValue='|||';
    window.opener=null;
    window.close();
}