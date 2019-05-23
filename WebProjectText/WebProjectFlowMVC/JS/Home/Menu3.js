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
            url = "Home/VTab.aspx?ModID=" + id;
        }
        else if (id && url && !isValidUrl(url))
        {
            url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
        }
    
        if (!isValidUrl(url))
        {
            url = "../" + url;
        }
        getObjP("ifrMain").src = url;
        
        if (level == 2)
        {
            if (window.top["Mod3_SelectID"] != null)
            {
                try
                {
                    getObj(window.top["Mod3_SelectID"]).className = "";
                }
                catch(err){}
            }
            row.className = "index_mt2_sel";
            oldModCss = row.className;
            window.top["Mod3_SelectID"] = row.id;
        }
    }
    else
    {
        if (level == 1)
        {
            if (window.top["Mod2_SelectID"] != null && window.top["Mod2_SelectID"] != row.id)
            {
                try
                {
                    getObjC(getObj(window.top["Mod2_SelectID"]), "div", 2).style.fontWeight = "normal";
                    getObj(window.top["Mod2_SelectID"] + "_tb").style.display = "none";
                    getObj(window.top["Mod2_SelectID"] + "_tb_ft").style.display = "none";
                }
                catch(err){}
            }
            var tbID = row.id + "_tb";
            var display = (getObj(tbID).style.display == "block" ? "none" : "block");
            getObj(tbID).style.display = display;
            getObj(tbID + "_ft").style.display = display;
            div.style.fontWeight = (display == "none" ? "normal" : "bold");
            window.top["Mod2_SelectID"] = row.id;
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
window.onload = function ()
{
	// 将第一级菜单移到Top页
	window.top["Mod1MenuHtml"] = divMod1.innerHTML;
	divMod1.innerHTML = "";

	// 将第个人工作区菜单移到父页
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

	// 该段代码是为了鼠标悬停在目录上时显示浮动文字。但页面上没有效果。所以暂时注释掉。 翁化青 2013-05-10
	//	var menus = window.parent.document.getElementsByTagName("a"),
	//		currentMenu, menuLength = menus.length;
	//	for (var i = 0; i < menuLength; i++)
	//	{
	//		currentMenu = menus[i];
	//		if (currentMenu.onclick)
	//		{
	//			currentMenu.title = currentMenu.innerText;
	//		}
	//	}

	execFrameFuns("Top", function ()
	{
		getObjPF("Top", "divMod").innerHTML = window.top["Mod1MenuHtml"];

	    // 保持一级菜单状态（若有参数ModID，自动选择该模块；若不存在，则选中刷新前选中的模块；若还不存在，则选中首页 -- chengam 2013-07-26）
		var aHref;
		var modId = top.getParamValue("ModID");
		if (modId && !window.top["Mod1_SelectID"])
		{
		    var aHrefs = getObjPF("Top", "divMod").getElementsByTagName("a");
		    for (var i = 0; i < aHrefs.length; i++)
		    {
		        if (aHrefs[i].onclick.toString().indexOf(modId) != -1)
		        {
		            aHref = aHrefs[i];
		            break;
		        }
		    }
		}

		if (aHref)
		{
		    aHref.click();
		}
		else
		{
		    aHref = getObjPF("Top", "a0");
		    if (window.top["Mod1_SelectID"] && getObjPF("Top", window.top["Mod1_SelectID"]))
		    {
		        aHref = getObjPF("Top", window.top["Mod1_SelectID"]);
		        window.parent.frames("Top").selectMenu1(getObjPF("Top", window.top["Mod1_SelectID"]));
		    }

		    window.parent.frames("Top").selectMenu1(aHref);
		}
		window.parent.frames("Top").showMSBtn();
	}, window.parent);

	try
	{
		// 该段代码是为了鼠标悬停在目录上时显示浮动文字。但页面上没有效果。所以暂时注释掉。 翁化青 2013-05-10
		//		var menus = document.getElementsByTagName("div"),
		//			menuLength = menus.length;
		//		for (var i = 0; i < menuLength; i++)
		//		{
		//			currentMenu = menus[i];
		//			if (currentMenu.onclick)
		//			{
		//				currentMenu.title = currentMenu.innerText;
		//			}
		//		}

		if (window.top["Mod1_SelectID"] != null && window.top["Mod1_SelectID"] != "a0")
		{
			window.parent.showMenu2(true, window.top["Mod1_SelectID"]);
		}
		if (window.top["Mod2_SelectID"] != null)
		{
			getObjC(getObj(window.top["Mod2_SelectID"]), "div", 2).style.fontWeight = "bold";
			getObj(window.top["Mod2_SelectID"] + "_tb").style.display = "block";
			getObj(window.top["Mod2_SelectID"] + "_tb_ft").style.display = "block";
		}
		if (window.top["Mod3_SelectID"] != null)
		{
			getObj(window.top["Mod3_SelectID"]).className += " index_mt2_sel";
		}
	}
	catch (err) { }
}