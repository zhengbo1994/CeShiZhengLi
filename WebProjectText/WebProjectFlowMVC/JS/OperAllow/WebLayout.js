// JScript 文件

// 重新加载数据
function reloadData()
{
    var query = { KW: $("#txtKW").val(), TVID: $("#ddlThemeVersions").val() };
    
    // 无条件时，省略第二个参数
    reloadGridData("idPager", query);
}

// 新增
function addLayout()
{
    openAddWindow("VWebLayoutAdd.aspx", 500, 300);
}

// 修改
function editLayout()
{
    openModifyWindow("VWebLayoutEdit.aspx", 500, 300);
}

// 删除
function delLayout()
{
    openDeleteWindow("Layout", 1);
}

// 设置默认布局
function setDefault(aHref)
{
    var row = aHref.parentNode.parentNode;
    var lID = getObjC(row, "input", 0).value;
    var strTVID = getObjC(row, "input", 0).tvid;

    ajaxRequest("FillData.ashx", { action: "SetDefaultLayout", LID: lID, Title: document.title, TVID: strTVID }, "text", refreshData);
}

// 设置默认布局成功后刷新列表
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
    if (getObj("txtLName").value == "")
    {
        handleBtn(true);
        return alertMsg("布局标题不能为空。", getObj("txtLName"));
    }
    if (getObj("txtLPath").value == "")
    {
        handleBtn(true);
        return alertMsg("首页路径不能为空。", getObj("txtLPath"));
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