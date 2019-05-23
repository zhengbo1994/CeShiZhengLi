// 分页控件处理脚本

// 重新加载分页数据
// pagerID: 分页控件ID
// query: json格式的请求参数
// url:增加请求url地址参数 add by evan 2013-09-03
//async:是否异步请求(只有明确指定为false时才为同步)  add Loper 2014-10-17
function reloadGridData(pagerID, query, url, async)
{
    url = url?url:window.location.href;
    if (url.indexOf("#") != -1)
    {
        url = url.substr(0, url.indexOf("#"));
    }
    
    var pageIndex = parseInt($("#" + pagerID + "_PageIndex").val(), 10);
    if (pageIndex < 1)
    {
        pageIndex = 1;
    }
    var pageSize = parseInt(getObj(pagerID + "_PageSize").value, 10);
    var orderBy = getObj(pagerID + "_OrderBy").value;
    if (!query)
    {
        query = window[pagerID + "_Query"];
    }
    if (async != undefined && typeof async != 'undefined')
    {
        window[pagerID + "_Async"] = async;
    }
    if (async === undefined && typeof async === 'undefined')
    {
        async = window[pagerID + "_Async"];
    }
    var data = {jqGridRequest:true, PageIndex:pageIndex, PageSize:pageSize, OrderBy:orderBy};
    if (window[pagerID + "_QueryData"])
    {
        data = mergeJsonData({}, [data, window[pagerID + "_QueryData"]],true);
    }
    if (query)
    {
        data = mergeJsonData({}, [data, query],true);
        window[pagerID + "_Query"] = query;
    }
    
    setAjaxContainer(getObj(pagerID + "_Box"));
    ajaxRequest(url, data, "json", function (data, status) { refreshPagerData(data, status, pagerID); }, !(async === false), "POST");
}

// 数据请求成功
function refreshPagerData(data, textStatus, pagerID)
{
    if (data.PageIndex == null)
    {
        return alertMsg("获取数据失败。");
    }
    var html = data.Html;
    var pageIndex = data.PageIndex
    var rowCount = data.RowCount;
    var orderBy = data.OrderBy;
    var pageSize = parseInt($("#" + pagerID + "_PageSize").val(), 10);
    
    // 呈现数据
    $("#" + pagerID + "_Box").html(html);
    $("td:empty", $("#" + pagerID + "_Box")).html("&nbsp;");
    
    // 呈现分页
    refreshPager(pagerID, pageIndex, pageSize, rowCount);

    // 更新页码、页大小、排序
    $("#" + pagerID + "_PageIndex").val(pageIndex);
    $("#" + pagerID + "_PageSize").val(pageSize);
    $("#" + pagerID + "_OrderBy").val(orderBy);

    var callback = window[pagerID + "_CallBack"];
    if (callback && typeof (callback) == "function")
    {
        callback();
    }
}

// 呈现分页
function refreshPager(pagerID, pageIndex, pageSize, rowCount)
{
    var startRowIndex = pageSize * (pageIndex - 1) + 1;
    if (startRowIndex < 0)
    {
        startRowIndex = 0;
    }
    var endRowIndex = (pageIndex * pageSize < rowCount ? (pageIndex * pageSize) : rowCount);
    var pageCount = (rowCount % pageSize == 0 ? rowCount / pageSize : parseInt(rowCount / pageSize, 10) + 1);
    
    var bLoaded = false;
    if (!$("#" + pagerID + "_Pager").html())
    {
        bLoaded = true;

        var pageHtml
            = '<td>\n'
            + '    <table class="ui-pg-table navtable" style="float:left" cellspacing="0" cellpadding="0" border="0">\n'
            + '        <tr>\n'
            + '            <td id="' + pagerID + '_Refresh" class="ui-pg-button ui-corner-all" title="刷新数据">\n'
            + '                <div class="ui-pg-div">\n'
            + '                    <span class="ui-icon ui-icon-refresh"></span>\n'
            + '                </div>\n'
            + '            </td>\n'
            + '        </tr>\n'
            + '    </table>\n'
            + '</td>\n'
            + '<td style="white-space:pre" align="center">\n'
            + '    <div id="' + pagerID + '_Info" class="ui-paging-info" style="text-align:center"></div>\n'
            + '</td>\n';
        
        if (getThemeVersion() === 2014)
        {
            pageHtml
                = '<td align="left">\n'
                + '    <div id="' + pagerID + '_Info" class=ui-paging-info style="text-align:left"></div>\n'
                + '    <table class="ui-pg-table navtable" style="table-layout:auto;float:left" cellspacing="0" cellpadding="0" border="0">\n'
                + '        <tr>\n'
                + '            <td id="' + pagerID + '_Refresh" class="ui-pg-button ui-corner-all" title="刷新数据">\n'
                + '                <div class=ui-pg-div>\n'
                + '                    <span class="ui-icon ui-icon-refresh"></span>\n'
                + '                </div>\n'
                + '            </td>\n'
                + '        </tr>\n'
                + '    </table>\n'
                + '</td>\n'
                + '<td style="white-space:pre" align="center">\n'
                + '</td>\n';
        }
        
        var html = ''
            + '<div class="ui-jqgrid ui-widget ui-widget-content ui-corner-all" style="border-top:0">\n'
            + '    <div class="ui-state-default ui-jqgrid-pager ui-corner-bottom">\n'
            + '        <div class="ui-pager-control">\n'
            + '            <table class="ui-pg-table" style="table-layout:fixed;width:100%" cellspacing="0" cellpadding="0" border="0">\n'
            + '                <tr>\n' + pageHtml
            + '                    <td style="width: 256px" align="right">\n'
            + '                        <table class="ui-pg-table" style="table-layout: auto" cellspacing="0" cellpadding="0" border="0">\n'
            + '                            <tr>\n'
            + '                                <td id="' + pagerID + '_First" class="ui-pg-button ui-corner-all ui-state-disabled">\n'
            + '                                    <span class="ui-icon ui-icon-seek-first"></span>\n'
            + '                                </td>\n'
            + '                                <td id="' + pagerID + '_Previous" class="ui-pg-button ui-corner-all ui-state-disabled">\n'
            + '                                    <span class="ui-icon ui-icon-seek-prev"></span>\n'
            + '                                </td>\n'
            + '                                <td class="ui-pg-button ui-state-disabled" style="width:4px">\n'
            + '                                    <span class="ui-separator"></span>\n'
            + '                                </td>\n'
            + '                                <td>\n'
            + '                                    <input id="' + pagerID + '_NewPageIndex" class="ui-pg-input" maxlength="7" size="2" value="1">\n'
            + '                                    共 <span id="' + pagerID + '_PageCount">0</span>页</td>\n'
            + '                                <td class="ui-pg-button ui-state-disabled" style="width:4px">\n'
            + '                                    <span class="ui-separator"></span>\n'
            + '                                </td>\n'
            + '                                <td id="' + pagerID + '_Next" class="ui-pg-button ui-corner-all ui-state-disabled">\n'
            + '                                    <span class="ui-icon ui-icon-seek-next"></span>\n'
            + '                                </td>\n'
            + '                                <td id="' + pagerID + '_Last" class="ui-pg-button ui-corner-all ui-state-disabled">\n'
            + '                                    <span class="ui-icon ui-icon-seek-end"></span>\n'
            + '                                </td>\n'
            + '                                <td>\n'
            + '                                    <select id="' + pagerID + '_NewPageSize" class="ui-pg-selbox">\n'
            + '                                        <option value="20">20</option>\n'
            + '                                        <option value="50">50</option>\n'
            + '                                        <option value="100">100</option>\n'
            + '                                    </select>\n'
            + '                                </td>\n'
            + '                            </tr>\n'
            + '                        </table>\n'
            + '                    </td>\n'
            + '                </tr>\n'
            + '            </table>\n'
            + '        </div>\n'
            + '    </div>\n'
            + '</div>';
            
        $("#" + pagerID + "_Pager").html(html);
    }
    
    var refresh = $("#" + pagerID + "_Refresh");
    var info = $("#" + pagerID + "_Info");
    var first = $("#" + pagerID + "_First");
    var previous = $("#" + pagerID + "_Previous");
    var next = $("#" + pagerID + "_Next");
    var last = $("#" + pagerID + "_Last");
    var newIndex = $("#" + pagerID + "_NewPageIndex");
    var pageCnt = $("#" + pagerID + "_PageCount");
    var newSize = $("#" + pagerID + "_NewPageSize");
        
    first.unbind();
    previous.unbind();
    next.unbind();
    last.unbind();
    
    if (bLoaded)
    {
        bindHover(refresh);
        refresh.click(function(){reloadGridData(pagerID);});
        newIndex.keydown(function(){newPageIndexInput(pagerID, this);});
        newSize.change(function(){pageSizeChanged(pagerID, this);});
    }
    
    if (pageIndex <= 1)
    {
        setCss(first, "ui-state-disabled", true);
        setCss(first, "ui-state-hover", false);
        first.css("cursor", "auto");
        setCss(previous, "ui-state-disabled", true);
        setCss(previous, "ui-state-hover", false);
        previous.css("cursor", "auto");
    }
    else
    {
        setCss(first, "ui-state-disabled", false);
        setCss(previous, "ui-state-disabled", false);
        first.css("cursor", "hand");
        previous.css("cursor", "hand");
    }
    if (pageIndex >= pageCount)
    {
        setCss(next, "ui-state-disabled", true);
        setCss(next, "ui-state-hover", false);
        next.css("cursor", "auto");
        setCss(last, "ui-state-disabled", true);
        setCss(last, "ui-state-hover", false);
        last.css("cursor", "auto");
    }
    else
    {
        setCss(next, "ui-state-disabled", false);
        setCss(last, "ui-state-disabled", false);
        next.css("cursor", "hand");
        last.css("cursor", "hand");
    }
    
    if (pageIndex > 1)
    {
        bindHover(first);
        bindHover(previous);
        first.click(function(){goFirstPage(pagerID);});
        previous.click(function(){goPreviousPage(pagerID)});
    }
    if (pageIndex < pageCount)
    {
        bindHover(next);
        bindHover(last);
        next.click(function(){goNextPage(pagerID)});
        last.click(function(){goLastPage(pagerID, pageCount)});
    }

    newIndex.val(pageIndex);
    pageCnt.text(pageCount);
    if (!inValues(pageSize, 20, 50, 100) && !$('option[value="' + pageSize + '"]', newSize).length)
    {
        var size = document.createElement("OPTION");
        size.value = pageSize;
        size.text = pageSize;
        newSize[0].add(size, pageSize < 20 ? 0 : ((pageSize > 20 && pageSize < 50) ? 1 : ((pageSize > 50 && pageSize < 100) ? 2 : 3)));
    }
    newSize.val(pageSize);
    info.text(stringFormat("{0} - {1} 行 共 {2}", startRowIndex, endRowIndex, rowCount));
}

// 为控件绑定鼠标悬停事件
function bindHover(obj)
{
    obj.hover(function(){$(this).addClass("ui-state-hover");}, function(){$(this).removeClass("ui-state-hover");});
}

// 为控件增删样式
function setCss(obj, css, bAdd)
{
    if (bAdd && !obj.hasClass(css))
    {
        obj.addClass(css);
    }
    else if (!bAdd && obj.hasClass(css))
    {
        obj.removeClass(css);
    }
}

// 设置回发保存条件
function setPagerDataPostBackQuery(pagerID)
{
    registerSubmitEvents(function()
    {
        var params = window[pagerID + "_Query"];
        if (params)
        {
            var filter = "";
            for (var p in params)
            {
                filter += "&" + p + "=" + params[p];
            }
            if (filter != "")
            {
                if (!window["PagerPostBackUrl"])
                {
                    window["PagerPostBackUrl"] = document.forms[0].action;
                }
                if (window["PagerPostBackUrl"].indexOf("?") == -1)
                {
                    window["PagerPostBackUrl"] += "?";
                    filter = filter.substr(1);
                }
                
                document.forms[0].action = window["PagerPostBackUrl"] + filter;
            }
        }
    });
}

// 上页
function goPreviousPage(pagerID)
{
    var pageIndex = parseInt($("#" + pagerID + "_PageIndex").val(), 10);
    pageIndex--;
    if (pageIndex < 1)
    {
        pageIndex = 1;
    }
    
    goNewPage(pagerID, pageIndex);
}

// 下页
function goNextPage(pagerID)
{
    var pageIndex = parseInt($("#" + pagerID + "_PageIndex").val(), 10);
    pageIndex++;
    
    goNewPage(pagerID, pageIndex);
}

// 首页
function goFirstPage(pagerID)
{
    goNewPage(pagerID, 1);
}

// 尾页
function goLastPage(pagerID, lastPageIndex)
{
    goNewPage(pagerID, lastPageIndex);
}

// 新页
function goNewPage(pagerID, newPageIndex)
{
    $("#" + pagerID + "_PageIndex").val(newPageIndex);
    
    reloadGridData(pagerID);
}

// 输入页码
function newPageIndexInput(pagerID, txt)
{
    if (event.keyCode == 13)
    {
        event.keyCode = 9;
        event.returnValue = false;
         
        var pageIndex = parseInt($("#" + pagerID + "_PageIndex").val(), 10);
        
        var reg = /^[+|-]?(\d+)$/;    
        if (txt.value != "" && reg.test(txt.value)) 
        {
            pageIndex = parseInt(txt.value, 10);
            if (pageIndex < 1)
            {
                pageIndex = 1;
            }
        }
        
        goNewPage(pagerID, pageIndex);
    }
}

// 切换页大小
function pageSizeChanged(pagerID, ddl)
{
    $("#" + pagerID + "_PageSize").val(ddl.value);
    
    reloadGridData(pagerID);
}