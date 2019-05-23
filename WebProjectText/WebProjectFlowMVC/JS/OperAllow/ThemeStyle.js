// JScript 文件

// 重新加载数据
function reloadData()
{
    var query = { KW: $("#txtKW").val(), TVID: $("#ddlThemeVersions").val() }; 
    
    // 无条件时，省略第二个参数
    reloadGridData("idPager", query);
}

// 新增
function addTheme()
{
    openAddWindow("VThemeStyleAdd.aspx", 500, 300);
}

// 修改
function editTheme()
{
    openModifyWindow("VThemeStyleEdit.aspx", 500, 300);
}

// 删除
function delTheme()
{
    openDeleteWindow("Theme", 1);
}

// 设置默认主题
function setDefault(aHref)
{
    var row = aHref.parentNode.parentNode;
    var tsID = getObjC(row, "input", 0).value;
    var themeVersions = getObjC(row, "input", 0).tvid;
;
    ajaxRequest("FillData.ashx", { action: "SetDefaultTheme", TSID: tsID, Title: document.title, TVID: themeVersions }, "text", refreshData);
}

// 设置默认主题成功后刷新列表
function refreshData(data, textStatus)
{
    if (data == "Y")
    {
        reloadData();
    }
    else
    {
        alert(data);
    }
}

// 验证
function validateSize()
{
    handleBtn(false);
    if (getObj("txtTSName").value == "")
    {
        handleBtn(true);
        return alertMsg("主题标题不能为空。", getObj("txtTSName"));
    }
    if (getObj("txtTSValue").value == "")
    {
        handleBtn(true);
        return alertMsg("主题名称不能为空。", getObj("txtTSValue"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    return true;
}

// 按钮处理
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}