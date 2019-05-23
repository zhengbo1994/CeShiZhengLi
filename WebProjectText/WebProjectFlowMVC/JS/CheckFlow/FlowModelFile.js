// JScript 文件


function addFlowModelFile()
{
   
    //var mid=getObj("hidModId").value;
    var mid=getObj("ddlModel").value;
    if(mid=="")
    {
       return alertMsg("必须选择一个模块新增。", getObj("ddlModel"));
    }
   openAddWindow("VFlowModelFileAdd.aspx?mid="+mid, 500, 200, "jqGrid1");
}

function editFlowModelFile()
{
    var mid=getObj("ddlModel").value;
    //var mid=getObjP("hidModId").value;
    //var apNo=getObjP("hidApNo").value;
    //openModifyWindow("VFlowModelFileEdit.aspx?mid="+mid+"&apNo="+apNo, 500, 200, "jqGrid1");
    openModifyWindow("VFlowModelFileEdit.aspx?mid="+mid, 500, 200, "jqGrid1");
}

function delFlowModelFile()
{
    openDeleteWindow("FlowModelFile", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (trim(getObj("txtFmfName").value) == "")
    {
        handleBtn(true);
        return alertMsg("模块文件名称不能为空。", getObj("txtFmfName"));
    }
    if (getObj("txtAPNo").value == "")
    {
        handleBtn(true);
        return alertMsg("模块码不能为空。", getObj("txtAPNo"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
