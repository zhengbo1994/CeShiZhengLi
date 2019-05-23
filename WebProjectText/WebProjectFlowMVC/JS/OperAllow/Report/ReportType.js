function changeType()
{
    var sType=$('#ddlReportAddress').val();    
    switch(sType)
    {
        case '0':  //集团报表
        case '5':  //个人报表
            $('#tbCorp,#tbProject').hide();
            break;
        case '2':  //公司报表
            $('#tbCorp').show();
            $('#tbProject').hide();
            break;
        case '3':  //项目报表
            $('#tbProject').show();
            $('#tbCorp').hide();
            break;        
    }
    reloadData();
}

function reloadData()
{
    var sType=$('#ddlReportAddress').val();
    var sCorpID=$('#ddlCorp').val();
    var sProjectID=$('#ddlProject').val();
    var sKey=$('#txtKW').val();
    $('#jqGrid1').getGridParam('postData').ReportOption=sType;
    $('#jqGrid1').getGridParam('postData').CorpID=sCorpID;
    $('#jqGrid1').getGridParam('postData').ProjectID=sProjectID;
    $('#jqGrid1').getGridParam('postData').KeyWord=sKey;
    
    refreshJQGrid('jqGrid1');
}

//新增类别
function addType()
{
    var sUrl='VReportTypeAdd.aspx?IDM_CD=' + getParamValue("IDM_CD");
    var sType=$('#ddlReportAddress').val();
    switch(sType)
    {
        case '0':  //集团报表
            sUrl+='&ReportOption=0&ID=&Name=';
            break;
        case '5':  //个人报表
            sUrl+='&ReportOption=5&ID=&Name=';
            break;
        case '2':  //公司报表       
            var sCorpID=$('#ddlCorp').val();   
            var sCorpName=encodeURI($('#ddlCorp option[value=\''+sCorpID+'\']').text()); 
            sUrl+='&ReportOption=2&ID='+sCorpID+'&Name='+sCorpName;            
            break;
        case '3':  //项目报表
            var sProjectID=$('#ddlProject').val();   
            var sProjectName=encodeURI($('#ddlProject').text());
            sUrl+='&ReportOption=3&ID='+sProjectID+'&Name='+sProjectName;
            break;        
    }
    openAddWindow(sUrl, 500, 350, "jqGrid1");
}

//修改类别
function editType()
{
    openModifyWindow("VReportTypeEdit.aspx?IDM_CD=" + getParamValue("IDM_CD"), 500, 300, "jqGrid1")
}


//删除类别
function delType()
{
    openDeleteWindow("ReportType", 0, "jqGrid1");
}


function validateSize()
{ 
    setBtnEnabled(getObj('btnSaveOpen'),false);
    setBtnEnabled(getObj('btnSaveClose'),false);
    if (getObj("txtName").value == "")
    {
        setBtnEnabled(getObj('btnSaveOpen'),true);
        setBtnEnabled(getObj('btnSaveClose'),true);
        return alertMsg("类别名称不能为空。", getObj("txtName"));
    }
    if(getObj('txtRowNo').value=="")
    {
        setBtnEnabled(getObj('btnSaveOpen'),true);
        setBtnEnabled(getObj('btnSaveClose'),true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        setBtnEnabled(getObj('btnSaveOpen'),true);
        setBtnEnabled(getObj('btnSaveClose'),true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}


function validateEdit()
{ 
    setBtnEnabled(getObj('btnSave'),false);
    if (getObj("txtName").value == "")
    {
        setBtnEnabled(getObj('btnSave'),true);
        return alertMsg("类别名称不能为空。", getObj("txtName"));
    }
    if(getObj('txtRowNo').value=="")
    {
        setBtnEnabled(getObj('btnSave'),true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        setBtnEnabled(getObj('btnSave'),true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}
