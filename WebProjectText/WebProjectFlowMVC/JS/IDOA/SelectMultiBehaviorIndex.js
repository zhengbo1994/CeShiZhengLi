// VSelectMultiBehaviorIndex.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-04-17


function reloadData()
{
    var BICID = getObj("ddlClass").value;
    var vKey=$("#txtKey").val();
    var ExistIDs = $('#hidExistIndexIDs').val();
    
    var jqgObj = $('#jqBehaviorIndex',document);
    
    $('#jqBehaviorIndex',document).getGridParam('postData').BICID=BICID;
    $('#jqBehaviorIndex',document).getGridParam('postData').SearchText=vKey; 
    jqgObj.getGridParam('postData').ExistIDs=ExistIDs;
    
    refreshJQGrid('jqBehaviorIndex');
}

function btnChoose_Click(){
    var IndexIDs = getJQGridSelectedRowsID('jqBehaviorIndex', true);
    var IndexClass = stripHtml(getJQGridSelectedRowsData('jqBehaviorIndex', true, 'BICID').join());
    var IndexNames = stripHtml(getJQGridSelectedRowsData('jqBehaviorIndex', true, 'BIName').join());
    var IndexClassNames = stripHtml(getJQGridSelectedRowsData('jqBehaviorIndex', true, 'BICName').join());
    var ScoreStandards = stripHtml(getJQGridSelectedRowsData('jqBehaviorIndex', true, 'ScoreStandard').join());

    if (!IndexIDs || IndexIDs.length == 0)
    {
        alert("请至少选择一个指标。");
        return false;
    }
    IndexIDs = stripHtml(IndexIDs.join());

    var returnJson = {
        IndexIDs: IndexIDs,
        IndexClass: IndexClass,
        IndexNames:IndexNames,
        IndexClassNames:IndexClassNames,
        ScoreStandards: ScoreStandards           
    };
    
    window.returnValue = returnJson;
    window.close();    
}