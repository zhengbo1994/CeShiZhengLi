// 新增
function addThemeVersions()
{
    openAddWindow("VThemeVersionsAdd.aspx", 500, 300);
}

// 修改
function editThemeVersions()
{
    openModifyWindow("VThemeVersionsEdit.aspx", 500, 300, "jqThemeVersions");
}

// 删除
function delThemeVersions()
{
    openDeleteWindow("ThemeVersions", 0, "jqThemeVersions");
}

// 验证
function validateSize()
{
    handleBtn(false);
    if (getObj("txtThemeVersions").value == "")
    {
        handleBtn(true);
        return alertMsg("界面版本名称不能为空。", getObj("txtThemeVersions"));
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