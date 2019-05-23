function reloadData()
{       
    var fstID=$('#ddlFSTID').val();
    var keyWord=$('#txtKW').val();
    
    $('#jqGrid1').appendPostData({FSTID:fstID,KeyWord:keyWord});
    refreshJQGrid('jqGrid1');
}

function renderNoLink(cl,opt,rl)
{    
    var   url = '../../../Knowledge/Library/SystemFiles/VFlowSystemFileView.aspx?ID='+opt.rowId;
    return '<div><a href="javascript:openWindow(\''+url+'\',500,400)">'+cl+'</a></div>' ;
}

function renderNameLink(cl,opt,rl)
{  
    return '<div><a href="javascript:downloadFile(\''+rl[0]+'\',\''+cl+'\');">'+cl+'</a></div>' ;
}

function finishSelect()
{
    //多项间，用^分隔 ,单行之间按  FileID|FileTitle|FileName|FileNo|FSTID|CreateDate的形式组合
    var retVal=new StringBuilder();
    //判断是否是多选
    var bMulitSelect = $('#jqGrid1').getGridParam('multiselect');
    
    var selectedIDsArr=[];
    var selectedIDs=getJQGridSelectedRowsID('jqGrid1',bMulitSelect);  
    
    //无论对于字符串还是数组来说，length都可以判定是否有元素
    if(!selectedIDs || selectedIDs.length<=0)
    {
        return alertMsg('请先选择文件');
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
            stringFormat('{0}|{1}|{2}|{3}|{4}|{5}',
                selectedIDsArr[i],
                stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['FileTitle']),
                stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['FileName']),
                stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['FileNo']),
                stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['FSTID']),
                stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['CreateDate'])
            )
        );
    }    
    window.returnValue=retVal.toString("^");
    window.opener=null;
    window.close();
}