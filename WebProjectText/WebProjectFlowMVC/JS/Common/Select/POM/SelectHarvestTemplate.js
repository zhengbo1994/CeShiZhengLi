function reloadData()
{
    var source= $('#ddlSource').val();
    
    //更换colModel,以便在切换数据源后，可以排序，否则，切换后，按列排序出错。
    //由于启用的多选（单选），因此，第一列为单选或空白列，实际数据列从1开始。
    var colModels = $('#jqGrid1').getGridParam('colModel');
    if(source == 'Template')
    {
        colModels[1].index='HTNo';
        colModels[1].name='HTNo';
        colModels[2].index='HTName';
        colModels[2].name='HTName';
        //只有选择模板时，产品类型才有效
        $('#tbPTID').show();
    }
    else if(source =='Case')
    {
        colModels[1].index='CaseNo';
        colModels[1].name='CaseNo';
        colModels[2].index='CaseName';
        colModels[2].name='CaseName';
        $('#tbPTID').hide();
    }
    var ptid=$('#ddlPTID').val();
    var keyWord=$('#txtKW').val();
    
    $('#jqGrid1').appendPostData({DataSource:source,PTID:ptid,KeyWord:keyWord});
    refreshJQGrid('jqGrid1');
}

function renderNameLink(cl,opt,rl)
{
    var source = $('#jqGrid1').getPostDataItem('DataSource');
    var url ='';
    if(source =='Template')
    {
        url = '../../../POM/ProjectData/VHarvestTemplateBrowse.aspx?HTID='+opt.rowId;
        return '<div class="nowrap"><a class="font nowrap" href="javascript:openWindow(\''+url+'\',800,600)">'+cl+'</a></div>' ;
    }
    else if(source =='Case')
    {
        url = '../../../POM/KnowledgeManage/VTHarvestCaseBrowse.aspx?HCID='+rl[3];
        return '<div class="nowrap"><a class="font nowrap" href="javascript:openWindow(\''+url+'\',500,400)">'+cl+'</a></div>' ;
    }
    else
    {
        return cl;
    }
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
        return alertMsg('请先选择模板或案例');
    }
    
    if(!bMulitSelect)
    {
        selectedIDsArr.push(selectedIDs);
    }
    else
    {
        selectedIDsArr = $.merge(selectedIDsArr,selectedIDs);
    }
    
    var source= $('#ddlSource').val();
    var colModels = $('#jqGrid1').getGridParam('colModel');
    var noIndex = '';
    var nameIndex='';
    if(source == 'Template')
    {
        noIndex='HTNo';
        nameIndex='HTName';        
    }
    else if(source =='Case')
    {
        noIndex='CaseNo';
        nameIndex='CaseName';        
    } 
           
    for(var i=0,iLen=selectedIDsArr.length;i<iLen;i++)
    {        
        retVal.append(
            stringFormat('{0}|{1}|{2}|{3}',selectedIDsArr[i],stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])[nameIndex]),stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])[noIndex]),stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['CreateDate']))
        );
    }    
    
    window.returnValue=retVal.toString("^");
    window.opener=null;
    window.close();
}