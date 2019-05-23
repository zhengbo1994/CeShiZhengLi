// JScript 文件

function addSysDataDictionary()
{
    openAddWindow("VSysDataDictionaryTableAdd.aspx", 500, 300, "jqGrid1");
}

function editSysDataDictionary()
{
    openModifyWindow("VSysDataDictionaryTableEdit.aspx", 500, 300, "jqGrid1")
}

function delSysDataDictionary()
{
    openDeleteWindow("SysDataDictionaryTable", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtSDDTName").value == "")
    {
        handleBtn(true);
        return alertMsg("字典表名称不能为空。", getObj("txtSDDTName"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function openSysDataDictionaryTable(ID)
{
    openWindow("VSysDataDictionaryTableField.aspx?JQID=jqGrid1&ID="+ID,800,600);
}
