// JScript 文件

function addFlowModel()
{
    openAddWindow("VFlowModelAdd.aspx", 500, 320, "jqGrid1");
}

function editFlowModel()
{
    openModifyWindow("VFlowModelEdit.aspx", 500, 320, "jqGrid1")
}

function delFlowModel()
{
    openDeleteWindow("FlowModel", 0, "jqGrid1");
}

function openModFile(ID)
{
    openWindow("VFlowModelFile.aspx?JQID=jqGrid1&ID="+ID, window.screen.availWidth,window.screen.availHeight);
}
function validateSize()
{
    handleBtn(false);
    if (getObj("txtFMName").value == "")
    {
        handleBtn(true);
        return alertMsg("流程模块名称不能为空。", getObj("txtFMName"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

