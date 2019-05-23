// JScript 文件

/* 刷新jqGrid */
function reloadData()
{
   var query = {CorpID:getObjP("ddlCorp").value,FMID:getObjP("ddlFlowModel").value,FlowTypeID:getObjPF("Left","hidSelID").value,KeyWord:getObjP("txtKW").value,Child:getObjP("ddlChild").value};
    
        if (loadJQGrid("jqGrid1", query))
        {
            addParamsForJQGridQuery("jqGrid1", [query]);
            refreshJQGrid("jqGrid1");
        }
}

function btnAdd_Click()
{
    if($('#ddlCorp').val()=="")
    {
       alertMsg("请选择公司。", getObj("ddlCorp")); 
    }    
    openAddWindow("VCheckStaticTypeAdd.aspx?CorpID="+$('#ddlCorp').val(), 500, 400, "jqGrid1");
}

function btnFlowAdd_Click()
{
    if (getObjF("Left","lblNoData") != null)
    {
        return alertMsg("请先设置流程类别。");
    }    
    
     if (getObjF("Left","hidSelID").value == "All")
    {
        return alertMsg("请选择流程类别。");
    }

    openAddWindow("VCheckStaticTypeListAdd.aspx?CSTID="+$('#hidCSTID').val()+"&CorpID="+$('#ddlCorp').val()+"&FMID="+$('#ddlFlowModel').val()+"&FlowTypeID="+getObjF("Left","hidSelID").value, 800, 800, "jqGrid1");
}

function btnFlowDelete_Click()
{
    openDeleteWindow("CheckStaticTypeList", 0, "jqGrid1","Main");
}

//修改类别
function btnEdit_Click()
{
    openModifyWindow("VCheckStaticTypeEdit.aspx", 500, 400, "jqGrid1")
}

function btnDelete_Click()
{
    openDeleteWindow("CheckStaticType", 1, "jqGrid1");
}

function RefreshFlowType(span,flowtypeID, parentFlowTypeID, outLine)
{
 
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    if(span!=null)
    {
        span.className = "selNode";
        window.parent["Selected"] = span.id;
    }
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;
    execFrameFuns("Main",function(){window.parent.frames('Main').reloadData();},window.parent);
}

// 加载所有流程类别
function loadType()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;    
    ajaxRequest("VFlowLeft.aspx", { AjaxRequest: true,CorpID:getObjP("ddlCorp").value }, "html", refreshFlowType,false);
}
//大小写区别
  function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);
    
    if(getObj("span_0") !=null)
    {
        getObj("span_0").click();
    }
    else
    {
       RefreshFlowType(null,'All','TotalFlowType','0');
    }   
} 

function RenderLinkShow(cellvalue,options,rowobject)
{
   return  "<a  href='#ShowForm' onclick=\"openWindow('../Flow/VFlowBrowse.aspx?ID=" + rowobject[5] + "&JQID=jqGrid1&CorpID="+getObjP('ddlCorp').value+"',0,0)\">" +  cellvalue  + "</a>";
}

function FlowModelChange()
{
    window.frames("Main").reloadData();
}

function btnSearch_Click()
{
    window.frames("Main").reloadData();
}

function validateSize()
{
    var FlowIDs = getObj('hidFlowIDs');
    var ids= window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    FlowIDs.value = ids.join(",");    
    return true;
}