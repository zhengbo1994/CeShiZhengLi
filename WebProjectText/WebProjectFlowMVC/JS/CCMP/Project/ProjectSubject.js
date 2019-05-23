// JScript 文件  
// 点击CheckBox
function selectMe(chk)
{
    var rowID = chk.parentNode.parentNode.id;
    var len = rowID.split(".").length;
    var cellIndex = chk.parentNode.cellIndex;
    
    // 选中时，选中父级、所有子级；取消选中时，取消所有子级的选中
    for (var i = 1; i < dgData.rows.length; i++)
    {
        var sID = dgData.rows[i].id;
        var sLen = sID.split(".").length;
        
        if (chk.checked && rowID.indexOf(sID) != -1 && sLen < len || sID.indexOf(rowID) != -1 && sLen > len)
        {
            setChecked(sID, cellIndex, chk.checked);
        }
    }
    
    // 取消选择时，如果兄弟项全部未选中，则父级也取消选中
    if (len > 1 && !chk.checked)
    {
        setParentUnSelected(rowID, cellIndex);
    }
}

// 设置id行的CheckBox的选中状态
function setChecked(id, cellIndex, checked)
{
    getObjC(getObj(id).cells[cellIndex], "input", 0).checked = checked;
}

// 取消父级的选中状态
function setParentUnSelected(id, cellIndex)
{
    var len = id.split(".").length;
    if (len > 1 && isAllSiblingUnSelected(id, cellIndex))
    {
        var pID = getPID(id);
        
        setChecked(pID, cellIndex, false);
        
        setParentUnSelected(pID, cellIndex);
    }
}

// 获取父ID
function getPID(id)
{
    var ids = id.split(".");
    ids.pop();
    return ids.join(".");
}

// 是否所有兄弟项都未选中
function isAllSiblingUnSelected(id, cellIndex)
{
    var result = true;            
    var pID = getPID(id);        
    var pLen = pID.split(".").length;
    
    for (var i = getObj(pID).rowIndex + 1; i < dgData.rows.length; i++)
    {
        var sID = dgData.rows[i].id;
        var sLen = sID.split(".").length;
        
        if (sID.indexOf(pID) != -1 && sLen == pLen + 1)
        {
            var chk = getObjTC(dgData, i, cellIndex, "input", 0);
            if (chk.checked)
            {
                result = false;
                break;
            }
        }
        if (sLen <= pLen)
        {
            break;
        }
    }
    
    return result;
}
