// 首页Menu1.aspx中用到的js

// 点击菜单
function cM(id, url, opt, level)
{
    var div = window.event.srcElement || window.event.target;
    if (div.tagName.toUpperCase() != "DIV")
    {
        return;
    }

    var row = div.parentNode.parentNode;
    if (level == 1)
    {
        row = row.parentNode.parentNode;
    }
    
    var linkWay = opt.substr(0, 1);
    var isLeaf = opt.substr(1);
    
    if (linkWay == "1" || isLeaf == "1")
    {
        if (linkWay == "1")
        {
            window.parent.frames("Main").location = "VTab.aspx?ModID=" + id;
        }
        else
        {
            if (!isValidUrl(url))
            {
                url = "../" + url + (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
            }      
        
            window.parent.frames("Main").location = url;
        }
        
        if (level == 2)
        {
            if (window.top["Mod2_SelectID"] != null)
            {
                try
                {
                    getObj(window.top["Mod2_SelectID"]).className = "";
                }
                catch(err){}
            }
            row.className = "index_mt2_sel";
            oldModCss = row.className;
            window.top["Mod2_SelectID"] = row.id;
        }
    }
    else
    {
        if (level == 1)
        {
            if (window.top["Mod1_SelectID"] != null && window.top["Mod1_SelectID"] != row.id)
            {
                try
                {
                    getObjC(getObj(window.top["Mod1_SelectID"]), "div", 2).style.fontWeight = "normal";
                    getObj(window.top["Mod1_SelectID"] + "_tb").style.display = "none";
                    getObj(window.top["Mod1_SelectID"] + "_tb_ft").style.display = "none";
                }
                catch(err){}
            }
            var tbID = row.id + "_tb";
            var display = (getObj(tbID).style.display == "block" ? "none" : "block");
            getObj(tbID).style.display = display;
            getObj(tbID + "_ft").style.display = display;
            div.style.fontWeight = (display == "none" ? "normal" : "bold");
            window.top["Mod1_SelectID"] = row.id;
        }
        else if (level == 2)
        {
            var table = row.parentNode.parentNode;
            getTGImg(table, row.rowIndex, 0).click();
        }
    }
}

// 第三级以下菜单鼠标效果
function setIDMod2(row, i)
{
    if (i == 1)
    {
        oldModCss = row.className;
        if (oldModCss == "index_mt2_on")
        {
            oldModCss = "";
        }
        row.className = "index_mt2_on";
    }
    else
    {
        try
        {
            row.className = oldModCss;
        }
        catch(err){}
    }
}

// 刷新页面保持上次选中
window.onload = function()
{
    try
    {
        var menus = document.getElementsByTagName("div");
        for (var i = 0; i < menus.length; i++)
        {
            if (menus[i].onclick)
            {
                menus[i].title = menus[i].innerText;
            }
        }
    
        if (window.top["Mod1_SelectID"] != null)
        {
            getObjC(getObj(window.top["Mod1_SelectID"]), "div", 2).style.fontWeight = "bold";
            getObj(window.top["Mod1_SelectID"] + "_tb").style.display = "block";
            getObj(window.top["Mod1_SelectID"] + "_tb_ft").style.display = "block";
        }
        if (window.top["Mod2_SelectID"] != null)
        {   
            getObj(window.top["Mod2_SelectID"]).className += " index_mt2_sel";
        }
    }
    catch(err){}
}