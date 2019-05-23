// 首页Menu2.aspx中用到的js

// 显示导航
function showGuide(guide)
{
    var trGuide = getObjP("trGruide");
    if (trGuide.style.display == "none")
    {
        trGuide.style.display = "";
    }
    divGuide.style.display = "";
    divGuide.innerText = guide;
    window.top["ID_Guide"] = guide;
}

// 隐藏导航
function hideGuide()
{
    var trGuide = getObjP("trGruide");
    if (trGuide.style.display == "")
    {
        trGuide.style.display = "none";
    }
    divGuide.style.display = "none";
    window.top["ID_Guide"] = null;
}

// 刷新页面保持上次选中
window.onload = function ()
{
    // 将第一级菜单移到Top页
    if (MyPublishCompany == 'DFYZ')
    {
        document.getElementById('a0').parentNode.removeChild(document.getElementById('a0'));
    }
    window.top["Mod1MenuHtml"] = divMod1.innerHTML;
    divMod1.innerHTML = "";

    // 将第二级以下菜单移到父页
    if (ieVersion <= 7)
    {
        getObjP("divIDMenu").innerHTML = divMod2.innerHTML;
        divMod2.innerHTML = "";
    }
    else
    {
        for (var i = divMod2.childNodes.length - 1; i >= 0; i--)
        {
            if (getObjP(divMod2.childNodes[i].id))
            {
                window.parent.document.body.removeChild(getObjP(divMod2.childNodes[i].id));
            }
            window.parent.document.body.appendChild(divMod2.childNodes[i]);
        }
    }
    var menus = window.parent.document.getElementsByTagName("a");
    for (var i = 0; i < menus.length; i++)
    {
        if (menus[i].onclick)
        {
            menus[i].title = menus[i].innerText;
        }
    }

    execFrameFuns("Top", function ()
    {
        getObjPF("Top", "divMod").innerHTML = window.top["Mod1MenuHtml"];

        // 保持一级菜单状态
        var aHref = getObjPF("Top", "a0");
        if (window.top["Mod1_SelectID"] && getObjPF("Top", window.top["Mod1_SelectID"]))
        {
            aHref = getObjPF("Top", window.top["Mod1_SelectID"]);
            window.parent.frames("Top").selectMenu1(getObjPF("Top", window.top["Mod1_SelectID"]));
        }

        window.parent.frames("Top").selectMenu1(aHref);
        window.parent.frames("Top").showMSBtn();
    }, window.parent);

    if (window.top["ID_Guide"])
    {
        showGuide(window.top["ID_Guide"]);
    }
}