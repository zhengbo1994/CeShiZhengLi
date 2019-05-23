// JScript 文件

function renderLink(cellvalue,options,rowobject)
 {
       if(cellvalue!=null)
        {
            if(cellvalue =='0')
           {
                return '系统报表' ;
           } 
           else
           {
                return '自定义报表';
           }             
        }
        else
        {
            return "&nbsp;";
        }        
 }

function ddlReportAddress_Change()
{
    if($("#ddlReportAddress").val() ==0)
    {
        getObj("trCorp").style.display = "none";
       getObj("trProject").style.display = "none"; 
    }
    if($("#ddlReportAddress").val() ==2)
    {
        getObj("trCorp").style.display = "block";
        getObj("trProject").style.display = "none";
    }
     if($("#ddlReportAddress").val() ==3)
    {
        getObj("trCorp").style.display = "none";
        getObj("trProject").style.display = "block";
    }
    
    resetReportType();
} 


 /* 加载类别 */
function resetReportType()
{
    var strOption = getObj("ddlReportAddress").value;
    var strCorpID = getObj("ddlCorp").value;
    var strProject = getObj("ddlProject").value;
    $.ajax(
        {
            url: "VReportCenterConfig.aspx",
            data: { AjaxOption: strOption,AjaxCorpID: strCorpID,AjaxProject:strProject},
            dataType: "json",
            success: loadReportTypeData,
            error: ajaxError
        });
        
}

function loadReportTypeData(data, textStatus)
{
    var ddlReportType = getObj("ddlReportType");
    for (var i = ddlReportType.length -1; i >= 0; i--)
    {
        ddlReportType.remove(i);
    }
    if (data.Count > 0)
    {
        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = getLevelPrefix(data.Nodes[i].Outline.split(".").length - iFirstCnt) + data.Nodes[i].Name;
            ddlReportType.add(opt, ddlReportType.length);
        }
    }
    
    reloadData();
}

function reloadData()
{
    var query = {ReportOption:$("#ddlReportAddress").val(), CorpID:$("#ddlCorp").val(), ProjectID:$("#ddlProject").val(), ReportType:$("#ddlReportType").val()};
    
    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

function addReportConfig(aim)
{
    var reportOption =  $("#ddlReportAddress").val();
    var id = "";
    if (reportOption == "2")
    {
        if (getObj("ddlCorp").value =="")
        {
            return alertMsg("请选择公司。", getObj("ddlCorp")); 
        }
        else
        {
            id = getObj("ddlCorp").value;
        }
    }
    else if (reportOption == "3")
    {
        if (getObj("ddlProject").value =="")
        {
            return alertMsg("请选择项目。", getObj("ddlProject"));  
        }
        else
        {
            id = getObj("ddlProject").value;
        }
    }
    if (getObj("ddlReportType").value =="")
    {
        return alertMsg("请选择报表类型。", getObj("ddlReportType"));  
    }
    
    var rtID = getObj("ddlReportType").value;
    
    openWindow("VReportCenterConfigAdd.aspx?IDM_CD=" + getParamValue("IDM_CD") + "&ReportOption=" + reportOption + "&RTID=" + rtID, 750, 500, 0, 0, 1);
}

function editReportConfig()
{
    var reportName = getJQGridSelectedRowsData('jqGrid1',false,'ReportName')[0];
    var fromOption = getJQGridSelectedRowsData('jqGrid1',false,'FromOption')[0];
    var description =  getJQGridSelectedRowsData('jqGrid1',false,'Description')[0];
    //var id =  getJQGridSelectedRowsData('jqGrid1',false,'SelfID')[0];
    //去掉 div
    reportName =removeDIV(reportName);
    fromOption =removeDIV(fromOption);
    description =removeDIV(description);
    //中文处理
    reportName = encodeURI(encodeURI(reportName)); 
    fromOption = encodeURI(encodeURI(fromOption));  
    description = encodeURI(encodeURI(description));   
    
    openModifyWindow("VReportCenterConfigEdit.aspx?IDM_CD=" + getParamValue("IDM_CD") + "&ReportName=" + reportName + "&FromOption=" + fromOption + "&Description=" + description, 500, 280,"jqGrid1");
}

function removeDIV(text)
{
  text = text.replace("<DIV class=nowrap>","");
  text = text.replace("</DIV>","");
  return text 
}

function validateSize()
{
     if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }    
    return true;
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("ReportCenterConfig", 0, "jqGrid1");
}


 function clickMenu(key)
{
    switch (key)
    {
        case "Export":
            $('#btnExport').get(0).click();
            break;
        case "Delete":
            btnDelete_Click();
            break;
    }
}