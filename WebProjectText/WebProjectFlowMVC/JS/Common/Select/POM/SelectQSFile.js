/* frmLeft 调用*/
function loadQuality(t)
{
    if(t == 'Q')
        ajaxRequest("VSelectQualityFileLeft.aspx", { AjaxRequest: true }, "html", refreshQuality);
    else
        ajaxRequest("VSelectSecurityFileLeft.aspx", { AjaxRequest: true }, "html", refreshQuality);
}

function refreshQuality(data, textStatus)
{
    $(document.body).html(data);
    
    var spanID = window.parent["Selected"];
    
    if (!spanID)
    {
        spanID = "span_1";
    }
    var span = getObj(spanID);
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["FID"] = null;
    }
}

function showFile(span, strFId)
{
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    span.className = "selNode";
    
    window.parent["Selected"] = span.id;
    
    window.parent["FID"] = strFId;
    
    execFrameFuns("frmMain", function(){ window.parent.frames("frmMain").loadFile();}, window.parent);    
}

function doSearch()
{    
    window.frames('frmMain').loadFile($('#txtFilter').val());
    
}

/* frmMain调用*/
function loadFile(keyWord)
{        
    var strFId = window.parent["FID"];
    var query = {FID: strFId} ;
    query.KeyWord = keyWord || "";
    if(loadJQGrid('jqGrid', query))
    {
        refreshJQGrid('jqGrid');
    }
}

function choose(t)
{    
    var selrow = $('#jqGrid',window.frames('frmMain').document).getGridParam('selrow');
    
    if(selrow == null)
        return alertMsg('请选择文件。');
    var fileId = '';
    var fileName = '';
    if(t == 'Q')
    {
        fileId = window.frames('frmMain').getJQGridSelectedRowsData('jqGrid', false, 'QFID');
        fileName = stripHtml(window.frames("frmMain").getJQGridSelectedRowsData('jqGrid',false, 'QFName'));
    }
    else
    {
        fileId = window.frames('frmMain').getJQGridSelectedRowsData('jqGrid', false, 'SFID');
        fileName = stripHtml(window.frames('frmMain').getJQGridSelectedRowsData('jqGrid', false, 'SFName'));
    }
    window.parent.returnValue = fileId + '|' + fileName;
    window.parent.close();
}