/************************************* Javascript Library **************************
* Using jQuery 1.4.1
* Using Common/idcore.js
* Create by xiaodm on 2012-07-03
* Last Edit 2012-8-18
*******************************************************************************************/
(function ($)
{
    var _idc = $.idc;
    $.fn.IDTab = function ()
    {
        _initial = function (obj, s)
        {
            //            debugger;
            var tabBuilder = "";
            var dSelectTabId;
            var dSelectTabContentId;
            var allTabDefs = $(obj).children();
            var count = allTabDefs.length;
            //遍历所有的Tab定义
            for (var i = 0; i < count; i++)
            {
                var cur = allTabDefs[i];
                if (cur.id == "")
                    cur.id = obj.id + "_def_" + i;

                var curDisplay = $(cur).css("display"); //当前标签页的显示否
                $(cur).css("display", "none"); //隐藏标签页的定义

                var tabid = obj.id + "_tab_" + i;
                var title = $(cur).attr("idtitle");

                if (!title)
                {
                    title = cur.title;
                    if (!title || title.length == 0)
                    {
                        title = "Untitle";
                    }
                }

                //处理定义的隐藏数组
                var hidArray = s.hide;
                var fag = true;
                if (hidArray)
                {
                    for (var j = 0; j < hidArray.length; j++)
                    {
                        if (hidArray[j] == title)
                        {
                            fag = false;
                            break;
                        }
                    }
                }
                if (fag)
                {
                    tabBuilder += "<li id=\"li_" + tabid + "\" style=\"display:" + curDisplay + "\"><a name=\"TabInfo\" href=\"#Tab\" onfocus=\"this.blur()\" id=\"" + tabid + "\" bindid=\"" + cur.id + "\" onclick=\"$.fn.IDTab.Priv.tabSelect(this,'" + $(obj).attr("id") + "','" + $(cur).attr("tagertdiv") + "');\">";
                    tabBuilder += "<span><span>" + title + "</span></span></a></li>";

                }

                if (s.selected == i)
                {
                    dSelectTabId = tabid;
                    dSelectTabContentId = $(cur).attr("tagertdiv");
                }
            }
            if (tabBuilder.length > 0)
            {
                $(obj).children().remove();
                $(obj).append('<ul>' + tabBuilder + '</ul>');
                $.fn.IDTab.Priv.tabSelect(document.getElementById(dSelectTabId), $(obj).attr("id"), dSelectTabContentId);
            }
        };
        return this.each(function (index)
        {
            var _settings = { onclick: null, selected: 0, onload: null, hide: new Array() };
            if ($(this).attr("initial"))
            {
                _settings = $.extend(true, _settings, _idc.getvar($(this).attr("initial")));
            }
            _initial(this, _settings);
            if (_settings.onload != null)
                _settings.onload();
        });
    };

    $.fn.IDTab.Priv = {
        tabSelect: function (obj, divId, tagertdivId)
        {
            //            alert('click:' + $(obj).attr("bindid"));

            $.fn.IDTab.Priv.selectObjTab(obj, "TabInfo");

            if (tagertdivId)
            {
                $('div[type="contentdiv"]').each(function ()
                {
                    if ($(this).attr("id") == tagertdivId)
                    {
                        $(this).show();
                    }
                    else
                    {
                        $(this).hide();
                    }
                });
            }
            var settingStr = $("#" + divId).attr("initial");
            var setting = $.idc.getvar(settingStr);
            if (setting && setting.onclick)
                setting.onclick($(obj).attr("bindid"), obj.id);
        },
        selectObjTab: function (tabObj, aName, color)
        {
            var span1;
            var span2;
            var theme = getThemeVersion();

            if (aName == null)
            {
                aName = "TabInfo";
            }

            var obj = getObjs(aName);
            if (obj.length)
            {
                var position1 = "left -24px";
                var position2 = "right -24px";
                if (theme === 2014)
                {
                    position1 = "left -28px";
                    position2 = "right -28px";
                    if (!color && obj.length)
                    {
                        var divTab = getParentObj(obj[0], "div");
                        if (divTab)
                        {
                            switch (divTab.className)
                            {
                                case "idhometab":
                                    color = "#d7feff";
                                    break;
                                default:
                                    color = "#0285d0";
                                    break;
                            }
                        }
                    }
                }
            }

            if (obj.length)
            {
                for (var i = 0; i < obj.length; i++)
                {
                    //移除元素style,但保留style.display
                    //用于在初始化选项卡时，可以在后台根据参数（或字段）来隐藏某个（或某几个）选项卡
                    //方法是设置style.display='none';
                    var tmpDisplay = obj[i].style.display;
                    obj[i].removeAttribute("style");
                    obj[i].style.display = tmpDisplay;

                    span1 = getObjC(obj[i], "span", 0);
                    span2 = getObjC(obj[i], "span", 1);

                    if (span1)
                    {
                        span1.removeAttribute("style");
                    }
                    if (span2)
                    {
                        span2.removeAttribute("style");
                    }
                }

                tabObj.style.backgroundPosition = position1;

                span1 = getObjC(tabObj, "span", 0);
                span2 = getObjC(tabObj, "span", 1);
                if (span1)
                {
                    span1.style.backgroundPosition = position2;
                }
                if (span2)
                {
                    span2.style.backgroundPosition = position1;
                }
                if (color)
                {
                    if (span2)
                    {
                        span2.style.color = color;
                    }
                    else if (span1)
                    {
                        span1.style.color = color;
                    }
                }
            }
        }
    };
})(jQuery);

$(document).ready(function ()
{
    //初始化前事件
    if (typeof $.fn.BeforeInitTab == "function")
    {
        $.fn.BeforeInitTab();
    }

    $('div[type="tabDiv"]').each(function ()
    {
        $(this).IDTab();
    });
});