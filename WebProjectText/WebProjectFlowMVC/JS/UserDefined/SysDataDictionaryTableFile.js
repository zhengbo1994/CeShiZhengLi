// JScript 文件

function addSysDataDictionaryTableFile()
{
    var fid=getObjP("hidFid").value;
    var sourceDB=getObjP("hidSourceDB").value;
    var sourceTable=getObjP("hidSourceTable").value;
    openAddWindow("VSysDataDictionaryTableFieldAdd.aspx?fid="+fid+"&sourceDB="+sourceDB+"&sourceTable="+sourceTable, 500, 300, "jqGrid1")
}

function editSysDataDictionaryTableFile()
{
    var fid=getObjP("hidFid").value;
    var sourceDB=getObjP("hidSourceDB").value;
    var sourceTable=getObjP("hidSourceTable").value;
    openModifyWindow("VSysDataDictionaryTableFieldEdit.aspx?fid="+fid+"&sourceDB="+sourceDB+"&sourceTable="+sourceTable, 500, 210, "jqGrid1")
}

function delSysDataDictionaryTableFile()
{
    openDeleteWindow("SysDataDictionaryTableField", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtSDDTFName").value == "")
    {
        handleBtn(true);
        return alertMsg("字段名称不能为空。", getObj("txtSDDTFName"));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
