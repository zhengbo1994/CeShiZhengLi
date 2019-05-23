// VSelectPortalLayou.aspx用到的js文件

// 切换布局模式(简单/组合)
function clickLayoutMode()
{
    for (var i = 1; i <= 11; i++)
    {
        if (i <= 3)
        {
            tbLayout.rows[i].style.display = getObj("rdoSimple").checked ? "" : "none";
        }
        if (i == 4 || i >= 7)
        {
            tbLayout.rows[i].style.display = getObj("rdoSimple").checked ? "none" : "";
        }
    }
}

// 鼠标悬停布局
function overLayout()
{
    var table = getEventObj("table");
    var layout = parseInt(table.id.substr(2), 10);
    if (window["PortalScale"] != layout && window["PortalLayout"] != layout)
    {
        table.style.border = "solid 2px #50b2e7";
    }
}

// 鼠标离开布局
function outLayout()
{
    var table = getEventObj("table");
    var layout = parseInt(table.id.substr(2), 10);
    if (window["PortalScale"] != layout && window["PortalLayout"] != layout)
    {
        table.style.border = "0";
    }
}

// 鼠标点击布局
function clickLayout()
{
    var table = getEventObj("table");
    var layout = parseInt(table.id.substr(2), 10);
    if (layout <= 20)
    {
        if (window["PortalScale"] && window["PortalScale"] != layout)
        {
            getObj("tb" + window["PortalScale"]).style.border = "0";
        }
        window["PortalScale"] = layout;
    }
    else
    {
        if (window["PortalLayout"] && window["PortalLayout"] != layout)
        {
            getObj("tb" + window["PortalLayout"]).style.border = "0";
        }
        window["PortalLayout"] = layout;
    }
}

// 选择布局
function selectLayout()
{
    var portalScale = window["PortalScale"];
    var portalLayout = window["PortalLayout"];
    if (getObj("rdoSimple").checked)
    {
        if (!portalScale)
        {
            return alertMsg("请选择一种布局。");
        }
    }
    else
    {
        if (!portalScale || portalScale <= 10)
        {
            return alertMsg("请选择一种列宽。");
        }
        else if (!portalLayout)
        {
            return alertMsg("请选择一种布局。");
        }
    }
    
    
    // 这里返回布局html
}