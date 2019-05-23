// Tab.aspx中用到的js

// 显示子模块页(奇次选项卡)
function showMod1(index, id, url, isLeaf)
{
    selectTab(index, "IDModTab");
    
    if (isLeaf.toLowerCase() == "true")
    {
        if (isExecuteUrl(url))
        {
            eval(url);
            return;
        }
        url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
    }
    else
    {
        url = "Home/VTab2.aspx?&ModID=" + id;
    }

    // #rengion zengmeng @ 2014-8-5
    // 为iframe触发 cover 事件

    $( "#IDModTabFrame" ).triggerHandler( "cover" );

    // #endregion

    window.frames["IDModTabFrame"].location = "../" + url;
}

// 显示子模块页(偶次选项卡)
function showMod2(aHref, id, url, isLeaf)
{
    var position1 = "left -21px";
    var position2 = "right -21px";
    var color;
    if (getThemeVersion() === 2014)
    {
        position1 = "left -22px";
        position2 = "right -22px";
        color = "#ffffff";
    }
    else
    {
        color = "#1f5885";
    }
    selectIDTab(aHref, position1, position2, color);
    
    if (isLeaf.toLowerCase() == "true")
    {
        if (isExecuteUrl(url))
        {
            eval(url);
            return;
        }
        url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
    }
    else
    {
        url = "Home/VTab.aspx?ModID=" + id;
    }


    // #rengion zengmeng @ 2014-8-5
    // 为iframe触发 cover 事件

    $( "#IDModTabFrame" ).triggerHandler( "cover" );

    // #endregion

    window.frames[ "IDModTabFrame" ].location = "../" + url;
}