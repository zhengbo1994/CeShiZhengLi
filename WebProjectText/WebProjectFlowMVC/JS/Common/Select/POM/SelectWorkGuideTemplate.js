function reloadData()
{
    var ptid=$('#ddlPTID').val();
    var keyWord=$('#txtKW').val();
    
    $('#jqGrid1').appendPostData({PTID:ptid,KeyWord:keyWord});
    refreshJQGrid('jqGrid1');
}

function finishSelect()
{
    var retVal=[];
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
        retVal.push(
            {
                WGTID:selectedIDsArr[i],
                WGTNo:stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['WGTNo']),
                WGTName:stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['WGTName']),
                CreateDate:stripHtml($('#jqGrid1').getRowData(selectedIDsArr[i])['CreateDate'])            
            }
        );
    }
     
    if(!bMulitSelect)
    {
        window.returnValue=retVal[0];
    }
    else
    {
        window.returnValue=retVal;
    }
    
    window.opener=null;
    window.close();
}