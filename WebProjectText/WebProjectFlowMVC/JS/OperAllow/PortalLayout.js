/// <reference path="../jquery.d.ts"/>
/// <reference path="../jqueryui.d.ts"/>
var ContentType;
(function (ContentType) {
    ContentType[ContentType["Normal"] = 0] = "Normal";
    ContentType[ContentType["FramePage"] = 1] = "FramePage";
    ContentType[ContentType["CustomContent"] = 2] = "CustomContent"; // 自定义内容页面
})(ContentType || (ContentType = {}));
function GetContentBlockById(id) {
    return ContentBlock.GetById(id);
}
var QuickHelp = (function () {
    function QuickHelp() {
        var _this = this;
        this.help = null;
        this.help = $(".quick-help");
        this.help.on("blur", function () { return _this.help.hide(); });
    }
    QuickHelp.Show = function (title, content) {
        if (QuickHelp._quickHelp === null) {
            QuickHelp._quickHelp = new QuickHelp();
        }
        var h = QuickHelp._quickHelp.help;
        h.find("dt").text(title + "帮助");
        h.find("dd").html(content);
        h.show().focus();
    };
    QuickHelp._quickHelp = null;
    return QuickHelp;
})();
var CanvasView = (function () {
    function CanvasView() {
        var _this = this;
        this.canvas = CanvasView.Canvas = $(".canvas-view");
        CanvasView.TopHeader = $(".header");
        var win = $(window);
        var that = this;
        //this.canvas.on( "resize", function ()
        //{
        //    CanvasView.Canvas.height( function ()
        //    {
        //        return CanvasView.TopHeader.css( "display" ) === "none" ? win.height() : win.height() - $( this ).position().top - 5;
        //    } );
        //} );
        CanvasView.AutoBinding();
        win.on("resize", function () {
            CanvasView.Canvas.height(function () {
                return CanvasView.TopHeader.css("display") === "none" ? win.height() : win.height() - $(this).position().top - 5;
            });
            // add by zhangmq 20150922 调整滚动宽度长度
            //CanvasView.ComputScrollBoxWidth();
        });
        this.canvas.on("click", ".tab > .tab-pages > .tab-page", function () {
            var me = $(this);
            me.addClass("sel").siblings(".tab-page").removeClass("sel");
            me.closest(".tab").children(".tab-panel").hide().eq(me.index()).show();
            return false;
        }).on("click", ".content-placeholder .title-func > .help", function () {
            var me = $(this);
            var p = me.closest(".content-placeholder");
            var hc = $.trim(p.attr("remark"));
            QuickHelp.Show(p.find(".title .title-span").text(), hc || "尚无任何帮助内容");
            return false;
        }).on("click", ".content-placeholder .title-func > .refresh", function () {
            var me = $(this);
            var p = me.closest(".content-placeholder");
            var t = Number(p.attr("contenttype"));
            if (t === 1 /* FramePage */) {
                var iframe = p.find("> .content > .iframe-page");
                var url = iframe.attr("src");
                iframe.attr("src", "about:blank").attr("src", url);
                return false;
            }
            if (t === 2 /* CustomContent */) {
                p.find(".content").html(p.find(".content").html());
                return false;
            }
            var holders = p.find(".content-placeholder[contenttype=" + 0 /* Normal */ + "]:visible");
            var isOnTabLayout = (p.parent("td").parent("tr").parent("tbody").parent("table.layout-table.tab").length > 0);
            if (!isOnTabLayout) {
                holders = holders.add(p);
            }
            holders.find(".content").empty().addClass("content-loading").append('<div class="loading-box"><img class="loading" src="../../image/loading.gif" alt="" /></div>');
            holders.each(function (i, e) {
                return ContentBlock.ParseContentBlock($(this)).LoadContent();
            });
            return false;
        }).on("click", ".content-placeholder > .title > .title-image", function () {
            var holder = $(this).closest(".content-placeholder");
            var c = holder.children(":not(.title,.setting)");
            if (c.filter(":visible").length) {
                holder.closest(".layout-table").parent().height(function () { return "auto"; });
                c.fadeOut(200).hide(200);
            }
            else {
                c.fadeIn(200).show(200);
            }
            return false;
        }).on("click", ".content-placeholder .title-pager > a", function () {
            var me = $(this);
            me.attr("disabled", "disabled");
            if (!me.hasClass("sel")) {
                var p = me.closest(".content-placeholder");
                p.children(".content").attr("pageindex", me.attr("rel"));
                ContentBlock.ParseContentBlock(p).LoadContent(function () { return me.removeAttr("disabled"); });
            }
        }).on("mouseover", ".content-placeholder", function () {
            var me = $(this);
            if (me.attr("contentscrolling") === "true") {
                ContentScrolling.Pause(me);
            }
            return false;
        }).on("mouseleave", ".content-placeholder", function () {
            var me = $(this);
            if (me.attr("contentscrolling") === "true") {
                ContentScrolling.Resume(me);
            }
            return false;
        });
        if (!RequestDataObject.GetDebug()) {
            this.headerTab = CanvasView.HeadTabPage = $(".header .header-tab");
            this.headerTab.on("click", "dd:not(.scroll-box-wrap)", function ()
            {
                var me = $(this);
                var portalId = me.attr("portalId");
                var id = me.attr("myId");
                var portalType = Number(me.attr("portalType"));
                var url = $.trim(me.attr("url"));
                var p = me.find(".down-menu-bar");
                me.addClass("sel").siblings().removeClass("sel");
                p.hide();
                p.find("li.selected").removeClass("selected");
                p.find("li[portalId='" + me.attr("portalId") + "']").addClass("selected");
                if (portalType === 0 && p.find("li").length > 1) {
					that.canvas.css("top","70px");
                    that.canvas.addClass("fix-module");
                }
                else {
					that.canvas.css("top","44px");
                    that.canvas.removeClass("fix-module");
                }
                CanvasView.LoadData(url, portalId, id, portalType);
            }).on("click", "dd > a > .down-menu", function () {
                var dd = $(this).closest("dd");
                var p = $(this).closest("dd").find(".down-menu-bar");
                p.show();
                p.find("li.selected").removeClass("selected");
                p.find("li[myId='" + dd.attr("myId") + "']").addClass("selected");
                return false;
            }).on("mouseleave", "dd", function () {
                $(this).find(".down-menu-bar").hide();
            }).on("click", "dd > .down-menu-bar li", function () {
                var me = $(this);
                if (!me.hasClass("cn")) {
                    var parent = me.closest("dd");
                    me.addClass("selected").siblings().removeClass("selected");
                    parent.attr("portalId", me.attr("portalId"));
                    parent.attr("myId", me.attr("myId"));
                    parent.attr("portalType", me.attr("portalType"));
                    parent.attr("url", me.attr("url"));
                    parent.find("a > span").text(me.text().replace(/\(.*?\)/g, ""));
                    me.closest(".down-menu-bar").hide();
                }
                else {
                    me.closest(".down-menu-bar").hide();
                }
            });
            if (CanvasView.ShowSpecifyContentBlock) {
                CanvasView.LoadSpecifyContentBlock();
                return;
            }
            LoadUserPortalData(function (result) {
                // 加载用户门户到 tab
                if (result.Success && result.Success.toLowerCase() === "y") {
                    var plist = (new Function("return " + result.Data)());
                    if (plist && plist.length) {
                        if (plist.length === 1 && plist[0]["list"] === undefined) {
                            var portal = plist[0];
                            //that.canvas.css("top", "0");
                            CanvasView.LoadData(portal.url, portal.ppid, portal.id, Number(portal.type));
                        }
                        else {
                            for (var i in plist) {
                                if (plist.hasOwnProperty(i)) {
                                    var p = plist[i];
                                    var list = p.list;
                                    var hasChildren = (list && list.length > 0); // 是否有多个门户
                                    var isProject = (p.type === "1");
                                    // 创建标签页
                                    var dd = $(CanvasView._portal_tab_tag_format.replace(/\{0\}/g, CanvasView.PrefixName(p.pname, Number(p.type))).replace(/\{1\}/g, p.ppid).replace(/\{2\}/g, p.id).replace(/\{3\}/g, p.type).replace(/\{4\}/g, CanvasView.HandlePortalUrl(p.url)).replace(/\{5\}/g, hasChildren ? '<i class="down-menu"></i>' : "").replace(/\{6\}/g, hasChildren ? ' class="down-menu-parent"' : ""));
                                    // 该标签下有多个门户页
                                    if (hasChildren) {
                                        var ul = $(CanvasView._portal_down_menu_bar_format);
                                        if (isProject) {
                                            // 找出所有公司
                                            var companyList = {};
                                            for (var c in list) {
                                                if (list.hasOwnProperty(c)) {
                                                    var cnItem = list[c];
                                                    var cnName = cnItem.cname;
                                                    if (!companyList[cnName])
                                                        companyList[cnName] = [];
                                                    companyList[cnName].push(CanvasView._portal_list_item_format.replace("{0}", cnItem.pname).replace("{1}", cnItem.ppid).replace("{2}", cnItem.id).replace("{3}", p.type).replace("{4}", CanvasView.HandlePortalUrl(cnItem.url)));
                                                }
                                            }
                                            for (var cn in companyList) {
                                                if (companyList.hasOwnProperty(cn)) {
                                                    var cl = companyList[cn].join('');
                                                    $(CanvasView._portal_sub_level_format.replace("{0}", cn).replace("{1}", cl ? ("<ul>" + cl + "</ul>") : "")).appendTo(ul);
                                                }
                                            }
                                        }
                                        else {
                                            for (var t in list) {
                                                if (list.hasOwnProperty(t)) {
                                                    var item = list[t];
                                                    $(CanvasView._portal_list_item_format.replace("{0}", item.pname).replace("{1}", item.ppid).replace("{2}", item.id).replace("{3}", p.type).replace("{4}", CanvasView.HandlePortalUrl(item.url))).appendTo(ul);
                                                }
                                            }
                                        }
                                        ul.appendTo(dd);
                                    }
                                    dd.appendTo(CanvasView.HeadTabPage);
                                }
                            }
                            $(".header").fadeIn(200);
                            if ($('.down-menu-bar').length > 0)
                            {
                                //modify by wujj 2016-12-16 
                                //that.canvas.css("top", "70px");
                                that.canvas.css("top", "44px");
                            } else
                            {
                                that.canvas.css("top", "44px");
                            }
                            _this.headerTab.find("dd:first").click();
                            if (plist.length === 1) {
                                _this.headerTab.addClass("only-person");
                                that.canvas.addClass("only-person");
                            }
                        }

                        // 添加滚动字幕 edit by zhangmq 20150922
                        //_this.headerTab.append('<dd class="scroll-box-wrap"><span class="scroll-box" href="javascript:void(0)"><marquee scrolldelay="100" scrollamout="10" onMouseOut="this.start()" onMouseOver="this.stop()" behavior="scroll" direction="left"><span class="scroll-text">幸福时代集团监察审计中心受集团监事会直接领导，负责全集团范围内投诉举报事件的受理、调查、处理、回复事宜。监察审计中心投诉举报电话： 、邮箱：； 总裁投诉举报邮箱：。</span></marquee></span></dd>');
                        //CanvasView.ComputScrollBoxWidth();
                        return;
                    }
                }
                // 加载失败
                CanvasView.Canvas.empty().append(LoadingBox.CreateBigLoading("门户页加载失败 ...", "../../image/big-info.png"));
            });
        }
    }
    /** 绑定所有数字列表
     * 当内容块的内容为列表时（无序列表 ul 或有序列表 ol），若应用了 number 样式类则自动插入数字及相关样式。
    */
    CanvasView.BindingNumber = function () {
        $("ul.number,ol.number").each(function (i, e) {
            var me = $(this);
            if (!me.data("loadcompleted")) {
                var all_item = me.find("li");
                all_item.each(function (index, element) {
                    var me = $(this);
                    var i = me.children("i,em");
                    if (i.length === 0) {
                        me.html(("<em>" + (index + 1) + "</em>") + me.html());
                    }
                    else {
                        i.text(index + 1);
                    }
                    return me;
                });
                all_item.find("i:first-child,em:first-child").addClass("numberic");
                if (all_item.length > 0) {
                    var first = all_item.eq(0).addClass("first");
                }
                if (all_item.length > 1) {
                    var second = all_item.eq(1).addClass("second");
                }
                if (all_item.length > 2) {
                    var third = all_item.eq(2).addClass("third");
                }
                me.data("loadcompleted", true);
            }
            return me;
        });
    };
    CanvasView.AutoBinding = function () {
        CanvasView.BindingNumber();
    };
    CanvasView.PrefixName = function (name, type) {
        var format = (type === 0 ? CanvasView._portal_tab_tag_normal_text_format : CanvasView._portal_tab_tag_prefix_text_format);
        return format.replace(/\{0\}/g, name).replace(/\{1\}/g, CanvasView._prefix[type]);
    };
    // 处理门户页的 URL
    CanvasView.HandlePortalUrl = function (url) {
        return url ? url + (url.indexOf("?") === -1 ? "?" : "&") + "PortalType=" + RequestDataObject.GetPortalType() + "&PortalOwnerID=" + RequestDataObject.GetID() : "";
    };
    CanvasView.LoadData = function (url, portalId, id, portalType) {
        if (url) {
            CanvasView.LoadPortalLayoutInFrame(url);
        }
        else {
            RequestDataObject.SetData(portalId, id, portalType);
            CanvasView.ReLoadPortalLayout(portalId);
        }
    };
    CanvasView.prototype.Init = function () {
        if (RequestDataObject.GetDebug()) {
            CanvasView.ReLoadPortalLayout(RequestDataObject.GetPortalId());
        }
    };
    CanvasView.PrevProcess = function (result) {
        var jResult = null;
        if (result) {
            jResult = $(result);
            if (jResult.hasClass("empty-content")) {
                return null;
            }
            jResult.find(".setting").remove();
            jResult.find(".empty-content").remove();
            var titles = jResult.find(".content-placeholder > .title");
            titles.find("> .title-func > .add").remove();
            titles.find("> .title-image,> .title-span").attr("title", "");
            jResult.find(".tab > .tab-pages > .add").remove();
            //edit by wujj 2017-01-03 
            //门户页点击更多时，会默认初始化的地址，故去掉此onclick。
            //onclick事件是为了设计器预览时用到的
            jResult.find(".title-func > a[class=more-link]").removeAttr("onclick"); 
            jResult.find(".title-func > a:not(.refresh,.help)").attr("href", function () {
                var me = $(this);
                return "javascript: openWindow('" + CanvasView.GetMoreUrl(me.attr("rel")) + "', " + me.attr("opensize") + " )";
            });
            if (!jResult.hasClass("layout-table")) {
                var j = $('<table class="layout-table ver"><tbody><tr><td></td></tr></tbody></table>');
                j.find("td").append(jResult);
                jResult = j;
            }
            jResult = $('<div class="normal-canvas-inner-wrap"></div>').append(jResult);
        }
        return jResult;
    };
    CanvasView.LoadPortalLayoutInFrame = function (url) {
        var frame = $('<iframe src="' + url + '" frameborder="0" class="view-page-frame" scrolling="no"></iframe>');
        var loadingBox = LoadingBox.CreateBigLoading("正在加载页面 ...");
        frame.on("load", function () {
            loadingBox.remove();
            $(window).trigger("resize");
        });
        var c = CanvasView.Canvas.removeClass("normal-canvas").empty();
        c.append(loadingBox);
        c.append(frame);
        $(window).trigger("resize");
    };
    // 加载指定内容块
    /* 页面接收参数：
        id: 内容块ID（此参数必须）
        showtitle: 1:显示标题（默认）/0:不显示标题
        title: 当显示标题时，可重命名标题
        titlebg: 标题栏背景色：可指定gray、blue及颜色代码等（默认gray）
        showico: 1:显示标题栏图标（默认）/0:不显示标题栏图标
        showpager: 1:显示分页/0:不显示分页（默认）
        pagerpos: 分页按钮位置 => 'top':顶部（默认）, 'bottom':底部
        pagesize: 显示分页时的页大小、不显示分页时的记录条数（若为列表块，此参数必须）
        pageindex: 显示分页时的页码（默认为1）
        showrefresh: 1：显示刷新（默认）/0:不显示刷新
        refreshseconds: 自动刷新间隔（单位为秒，不得小于60，否则不自动刷新），默认为0（即不自动刷新）
        scroll: 1:上下滚动/0:不滚动（默认）
        showmore: 1:显示更多链接（默认）/0:不显示更多链接
        showopt: 1:显示操作项（默认）/0:不显示操作项

        必须的参数：id（内容块ID）、pagesizse（页大小或记录条数，列表块必须）
    */
    CanvasView.LoadSpecifyContentBlock = function () {
        var id = $.trim($("#hidID").val());
        if (!id) {
            CanvasView.Canvas.empty().append(LoadingBox.CreateBigLoading("提示：当前页面已失效。", "../../../image/big-info.png"));
            return;
        }
        var options = {
            id: "",
            contentBlockId: $.trim(getParamValue("id")),
            isShowTitle: $.trim(getParamValue("showtitle")) === "1" || !($.trim(getParamValue("showtitle"))),
            title: $.trim(getParamValue("title")),
            titleBackgroundColor: $.trim(getParamValue("titlebg")),
            isShowIco: $.trim(getParamValue("showico")) === "1" || !($.trim(getParamValue("showico"))),
            isShowPager: $.trim(getParamValue("showPager")) === "1" || !($.trim(getParamValue("showPager"))),
            pagerPosition: $.trim(getParamValue("pagerpos")),
            funcPosition: $.trim(getParamValue("funcpos")),
            pageSize: Number($.trim(getParamValue("pagesize"))),
            pageIndex: Number($.trim(getParamValue("pageindex"))),
            isShowRefreshButton: $.trim(getParamValue("showrefresh")) === "1",
            refreshInterval: Number($.trim(getParamValue("refreshseconds"))),
            isAutoScroll: $.trim(getParamValue("scroll")) === "1",
            isShowMoreUrl: $.trim(getParamValue("showmore")) === "1" || !($.trim(getParamValue("showmore"))),
            isShowOperatButton: $.trim(getParamValue("showopt")) === "1" || !($.trim(getParamValue("showopt")))
        };
        ajax("FillData.ashx", { "action": "GetPortalBlock", "PBID": options.contentBlockId, "randData": new Date().getTime() }, "json", function (data) {
            if (data.Success.toLowerCase() === "y") {
                var contentDatas = (new Function("return " + data.Data + ";")());
                if (contentDatas && contentDatas.length) {
                    var block = contentDatas[0];
                    options.id = id.split(",")[Number(block.type)];
                    options.pageIndex = isNaN(options.pageIndex) || options.pageIndex < 1 ? 1 : options.pageIndex;
                    options.pageSize = isNaN(options.pageSize) || options.pageSize < 1 ? 8 : options.pageSize;
                    RequestDataObject.SetData("", options.id, Number(block.type));
                    // 构建内容块
                    var holder = $('<div class="content-placeholder specify-content-block' + (options.titleBackgroundColor ? "" : (options.isShowTitle ? " theme-gray" : "")) + '" contenttype="0" islist="' + block.list + '" ishead="' + block.head + '" minwidth="' + block.minwidth + '">' + (options.isShowTitle ? ('<div class="title" style="background-color: ' + (options.titleBackgroundColor ? options.titleBackgroundColor : "transparent") + '!important;">' + (options.isShowIco ? '<img title="点击折叠内容块" class="title-image" alt="点击折叠内容块" src="' + block.ico + '"/>' : "") + '<span class="title-span">' + (options.title ? options.title : block.title) + '</span>' + (options.isShowOperatButton && options.funcPosition !== "bottom" ? ('<div class="title-func">' + ContentBlock.LoadOptions(block.opts) + (options.isShowRefreshButton ? '<a title="刷新" class="refresh" href="javascript:void(0)"><img alt="" src="../../image/refresh.png"/><span>刷新</span></a>' : "") + (options.isShowMoreUrl ? '<a class="more-link" href="javascript: openWindow(\'' + CanvasView.GetMoreUrl(block.moreurl) + '\', 0, 0 )" rel="' + CanvasView.GetMoreUrl(block.moreurl) + '" opensize="0, 0"><img title="更多" alt="更多" src="../../image/more.png"/><span>更多</span></a>' : "") + '</div>') : "") + (options.isShowPager && options.pagerPosition !== "bottom" ? '<div class="title-pager"></div>' : "") + '</div>') : "") + '<div class="content" pagesize="' + options.pageSize + '" href="' + block.url + '" pageindex="' + options.pageIndex + '"></div>' + (((options.isShowPager && options.pagerPosition === "bottom") || (options.isShowOperatButton && options.funcPosition === "bottom")) ? ('<div class="bottom">' + ((options.isShowOperatButton && options.funcPosition === "bottom") ? ('<div class="title-func">' + ContentBlock.LoadOptions(block.opts) + (options.isShowRefreshButton ? '<a title="刷新" class="refresh" href="javascript:void(0)"><img alt="" src="../../image/refresh.png"/><span>刷新</span></a>' : "") + (options.isShowMoreUrl ? '<a class="more-link" href="javascript: openWindow(\'' + CanvasView.GetMoreUrl(block.moreurl) + '\', 0, 0 )" rel="' + CanvasView.GetMoreUrl(block.moreurl) + '" opensize="0, 0"><img title="更多" alt="更多" src="../../image/more.png"/><span>更多</span></a>' : "") + '</div>') : "") + ((options.isShowPager && options.pagerPosition === "bottom") ? '<div class="title-pager"></div>' : "") + "</div>") : "") + '</div>');
                    holder.appendTo(CanvasView.Canvas.empty());
                    ContentBlock.ParseContentBlock(holder).LoadContent();
                    AutoRefresher.Initizal();
                    return;
                }
            }
            CanvasView.Canvas.empty().append(LoadingBox.CreateBigLoading("提示：内容块加载失败。", "../../image/big-info.png"));
        });
    };
    // 计算可完整显示（不小于内容块最小宽度）的最合适的宽度
    CanvasView.ComputMinWidth = function (parent) {
        var w = 0;
        if (parent.length) {
            var ls = parent.children(".layout-table"); // 查找下级布局
            var sub = 12; // 边框、内边距误差
            if (ls.length) {
                if (ls.hasClass("hor")) {
                    var left = ls.find("> tbody > tr > td:first"); // 左边的 td
                    var right = ls.find("> tbody > tr > td:last"); // 右边的 td

                    var leftWidth = left.width(); // 下级布局中左边 td 的宽度
                    var rightWidth = right.width(); // 下级布局中右边 td 的宽度
                    var subLeftWidth = CanvasView.ComputMinWidth(left); // 继续递归 [下级布局] 中左边 td 的下一级布局的最合适的宽度
                    var subRightWidth = CanvasView.ComputMinWidth(right); // 继续递归 [下级布局] 中右边 td 的下一级布局的最合适的宽度
                    // 若计算所得的下级所需的宽度比当前级别的宽度要大，则说明当前级别不足以将子级显示完整，则使用子级的宽度。
                    leftWidth = leftWidth > subLeftWidth ? leftWidth : subLeftWidth;
                    rightWidth = rightWidth > subRightWidth ? rightWidth : subRightWidth;
                    var orgLeftWidth = left[0].style.width; // 从左边的 td 得到宽度的百分比
                    orgLeftWidth = (!orgLeftWidth) ? "50%" : orgLeftWidth; // 若未设置这设置为 50% 平均分，否则设置的百分比
                    if (orgLeftWidth.toLowerCase() === "auto" || orgLeftWidth.indexOf("%") === -1) {
                        w = leftWidth + rightWidth; // 那么： 总宽度 = 左边+右边的最合适的宽度
                        var orgRightWidth = right[0].style.width.toLowerCase();
                        if (right && right.length && orgRightWidth.indexOf("px") !== -1) {
                            right.width(rightWidth);
                            w -= (rightWidth - Number(orgRightWidth.replace("px", "")));
                        }
                    }
                    else {
                        // 取左、右两者中宽度最大的一方进行百分比计算
                        //var maxTdWidth = leftWidth > rightWidth ? leftWidth : rightWidth;
                        //w = Math.ceil(maxTdWidth * 100 / Number(orgLeftWidth.replace("%", "")));

                        //测试性修改 by denghm @2016.3.18
                        var maxTdWidth = leftWidth > rightWidth ? leftWidth : rightWidth,
                        widthPercent = leftWidth > rightWidth ? orgLeftWidth.replace("%", "") : (100 - orgLeftWidth.replace("%", ""));
                        //修改结束
                        w = Math.ceil(maxTdWidth * 100 / Number(widthPercent));
                    }
                }
                else {
                    var verUp = ls.find("> tbody > tr:first > td"); // 表示上方的 td
                    var verDown = ls.find("> tbody > tr:last > td"); // 表示下方的 td
                    var verUpWidth = verUp.width(); // 上方原宽度
                    var verDownWidth = verDown.width(); // 下方原宽度
                    var verUpSubWidth = CanvasView.ComputMinWidth(ls.find("> tbody > tr:first > td")); // 上方子级最适合宽度
                    var verDownSubWidth = CanvasView.ComputMinWidth(ls.find("> tbody > tr:last > td")); // 下方子级最适合宽度
                    verUpWidth = verUpWidth > verUpSubWidth ? verUpWidth : verUpSubWidth;
                    verDownWidth = verDownWidth > verDownSubWidth ? verDownWidth : verDownSubWidth;
                    w = (verUpWidth > verDownWidth ? verUpWidth : verDownWidth);
                }
            }
            else {
                var allWidth = parent.find(".content-placeholder").map(function (i, e) {
                    var me = $(e);
                    var w = me.width() + sub;
                    var mw = Number($(e).attr("minwidth")) + sub;
                    mw = isNaN(mw) ? 0 : mw;
                    return mw > w ? mw : w;
                });
                var max = 0;
                for (var i in allWidth) {
                    if (allWidth.hasOwnProperty(i)) {
                        var n = allWidth[i];
                        n = isNaN(n) ? 0 : n;
                        max = max > n ? max : n;
                    }
                }
                w = max;
            }
        }
        return w;
    };
    CanvasView.ReLoadPortalLayout = function (portalId) {
        try {
            if (!portalId)
                return;
            var canvas = CanvasView.Canvas;
            if (!RequestDataObject.GetDebug())
                canvas.addClass("normal-canvas");
            canvas.empty().append(LoadingBox.CreateBigLoading("正在加载门户 ..."));
            // 加载内容页
            LoadPortalLayout(portalId, function (result) {
                result = $.trim(result);
                var jResult = CanvasView.PrevProcess(result);
                var canvas = CanvasView.Canvas;
                canvas.empty();
                if (jResult && jResult.length) {
                    canvas.append(jResult);
                }
                else {
                    canvas.append(LoadingBox.CreateBigLoading("门户页为空或者不可用 ...", "../../image/big-info.png"));
                    return;
                }
                var win = $(window);
                CanvasView.Canvas.height(function () {
                    return CanvasView.TopHeader.css("display") === "none" ? win.height() : win.height() - CanvasView.Canvas.position().top - 5;
                });
                var normalHolders = canvas.find(".content-placeholder[contenttype=" + 0 /* Normal */ + "]");
                normalHolders.find(".content").addClass("content-loading").append('<div class="loading-box"><img class="loading" src="../../image/loading.gif" alt="" /></div>');
                normalHolders.each(function (i, elem) {
                    return ContentBlock.ParseContentBlock($(this)).LoadContent();
                });
                var lt = canvas.children(".normal-canvas-inner-wrap");
                var mw = lt.width() - 17;
                var cw = CanvasView.ComputMinWidth(lt) - 18;
                cw = (cw > mw ? cw + 18 : cw);
                lt.css("min-width", Math.max(mw, cw));
                AutoRefresher.Initizal();
                TabPanelSetting.Apply();
            });
        }
        catch (msg) {
        }
    };
    CanvasView.GetMoreUrl = function (url) {
        return url ? (url + (url.indexOf("?") === -1 ? "?" : "&") + "PortalType=" + RequestDataObject.GetPortalType() + "&PortalOwnerID=" + RequestDataObject.GetID()) : "";
    };
    CanvasView.ShowSpecifyContentBlock = false;
    CanvasView.Style = $("#inlineStyle");
    CanvasView.Header = $("head");
    CanvasView.Body = $("body");
    CanvasView._portal_tab_tag_format = '<dd portalId="{1}" myId="{2}" class="portal-type-{3}" portalType="{3}" url="{4}"><a href="javascript: void(0)"{6}>{0}{5}</a></dd>';
    CanvasView._portal_tab_tag_normal_text_format = '<span>{0}</span>';
    CanvasView._portal_tab_tag_prefix_text_format = '{1} (<span>{0}</span>)';
    CanvasView._prefix = ["", "项目门户", "企业门户"];
    CanvasView._portal_down_menu_bar_format = '<ul class="down-menu-bar" />';
    CanvasView._portal_list_item_format = '<li portalId="{1}" myId="{2}" portalType="{3}" url="{4}">{0}</li>';
    CanvasView._portal_sub_level_format = '<li class="cn"><span>{0}</span>{1}</li>';
    CanvasView.ComputScrollBoxWidth = function ()
    {
        if (CanvasView.HeadTabPage && CanvasView.HeadTabPage.length ==1)
        {
            var tabs = CanvasView.HeadTabPage.children(),
                totalWidth = CanvasView.HeadTabPage.width();

            if (tabs.filter(".scroll-box-wrap").length === 0)
            {
                return;
            }
            tabs.each(function (index, elem)
            {
                var $elem = $(elem);
                if (index === tabs.length - 1)
                {
                    $elem.children().width(totalWidth - 10 - 25);
                    return;
                }
                totalWidth -= $(elem).outerWidth();
            });
        }
    }

    return CanvasView;
})();
var TabPanelSetting = (function () {
    function TabPanelSetting() {
    }
    TabPanelSetting.Apply = function () {
        var allHolders = $(".content-placeholder");
        allHolders.removeClass("specify-content-placeholder");
        allHolders.find("> .content .tab > .tab-panel > :only-child.content-placeholder").addClass("specify-content-placeholder");
    };
    return TabPanelSetting;
})();
/**
 * @class: AutoRefresher
 * @description: 表示自动刷新器的类
*/
var AutoRefresher = (function () {
    function AutoRefresher() {
    }
    // 初始化内容块自动刷新
    AutoRefresher.Initizal = function () {
        $("div.content-placeholder[contenttype=0][autorefresh=true]").each(function () {
            var me = $(this);
            AutoRefresher.ApplyAutoRefresh(me, Number(me.attr("refreshinterval")));
            return me;
        });
    };
    // 使内容块自动刷新
    // @param: targetContentBlock - 目标内容块
    // @param: interval - 刷新间隔，默认 60秒，若间隔值无效则使用默认值。
    AutoRefresher.ApplyAutoRefresh = function (targetContentBlock, interval) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            interval = (isNaN(interval) || !interval || interval < 60) ? 60 : interval;
            AutoRefresher.CancelAutoRefresh(targetContentBlock); // 取消之前的刷新器
            targetContentBlock.attr("timerHandleId", window.setInterval(function () {
                ContentBlock.ParseContentBlock(targetContentBlock).LoadContent();
            }, interval * 1000));
        }
    };
    // 取消内容块自动刷新
    AutoRefresher.CancelAutoRefresh = function (targetContentBlock) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            var timer = Number(targetContentBlock.attr("timerHandleId"));
            if (!isNaN(timer)) {
                window.clearInterval(timer);
            }
        }
    };
    return AutoRefresher;
})();
var ContentScrolling = (function () {
    function ContentScrolling() {
    }
    ContentScrolling.Scrolling = function (block) {
        try {
            if (block.attr("contentscrolling") === "true") {
                var c = block.data("contentPart");
                var height = block.data("endheight");
                var top = c.scrollTop();
                var top_last = top;
                c.stop(true, true).animate({ scrollTop: top + 5 }, 200, "linear", function () {
                    if (c.scrollTop() === top_last) {
                        c.stop().scrollTop(0);
                    }
                    ContentScrolling.Scrolling(block);
                });
            }
            else {
                ContentScrolling.CancelContentScrolling(block);
            }
        }
        catch (e) {
        }
    };
    ContentScrolling.ApplyContentScrolling = function (targetContentBlock) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            var c = targetContentBlock.children(".content");
            var h = c.height();
            var inner = c.wrapInner(function () { return '<div class="content-wrap-inner"></div>'; }).children();
            var title = targetContentBlock.children(".title");
            var mh = targetContentBlock.height() - (title.length > 0 ? title.height() : 0);
            c.height(mh);
            inner.css({ height: h + mh, paddingTop: mh });
            targetContentBlock.data({ "endheight": h + mh, "contentPart": c });
            ContentScrolling.Scrolling(targetContentBlock);
        }
    };
    ContentScrolling.Pause = function (targetContentBlock) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            targetContentBlock.children(".content").stop();
        }
    };
    ContentScrolling.Resume = function (targetContentBlock) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            ContentScrolling.Scrolling(targetContentBlock);
        }
    };
    ContentScrolling.CancelContentScrolling = function (targetContentBlock) {
        if (targetContentBlock && targetContentBlock.hasClass("content-placeholder")) {
            var c = targetContentBlock.children(".content");
            var inner = c.children(".content-wrap-inner");
            if (inner.length) {
                c.stop().css({ height: "" });
                inner.children().unwrap();
            }
        }
    };
    return ContentScrolling;
})();
var LoadingBox = (function () {
    function LoadingBox() {
        this.Big = $(".design-element > .big-loading-box");
        this.Small = $(".design-element > .loading-box");
    }
    LoadingBox.GetInstance = function () {
        if (LoadingBox._instance === null)
            LoadingBox._instance = new LoadingBox();
        return LoadingBox._instance;
    };
    // 创建大尺寸加载框
    LoadingBox.CreateBigLoading = function (text, img) {
        var c = LoadingBox.GetInstance().Big.clone();
        c.find("span").text(text);
        if (img && img.length) {
            c.find("img").attr("src", img);
        }
        return c;
    };
    // 创建小尺寸加载框
    LoadingBox.CreateSmallLoading = function () {
        return LoadingBox.GetInstance().Small.clone();
    };
    LoadingBox._instance = null;
    return LoadingBox;
})();
var ContentBlock = (function () {
    function ContentBlock() {
    }
    // 加载完成
    ContentBlock.prototype.LoadComplete = function (content, addClass) {
        if (addClass === void 0) { addClass = ""; }
        this.Content.removeClass("load-fail");
        var contentBox = this.Content.children(".content");
        var c = contentBox.empty().removeClass("content-loading").append(content).hide().fadeIn(500);
        contentBox.find(".tab > .tab-pages > .tab-page:first").trigger("click");
        if (addClass !== "") {
            c.addClass(addClass);
        }
        if (this.Content.siblings().length === 0 && this.Content.height() < 150) {
            this.Content.parent("td").height(function () { return "auto"; });
        }
    };
    // 加载内容块的内容失败
    ContentBlock.prototype.LoadFail = function (result) {
        this.Content.addClass("load-fail");
        this.LoadComplete('<img src="../../image/warning.png" alt="" style="vertical-align: middle" /> 内容未能成功加载 ...');
        this.Content.children(".content").addClass("load-fail-bg");
    };
    // 预加载资源（样式、脚本等）
    ContentBlock.prototype.PrevLoadResource = function (resource, resourceLoader) {
        var afterRes = [];
        if (resource && resource.length) {
            for (var i in resource) {
                if (resource.hasOwnProperty(i)) {
                    afterRes = afterRes.concat(this.LoadResource(resource[i], resourceLoader));
                }
            }
        }
        return afterRes;
    };
    // 格式化资源字符串
    ContentBlock.prototype.FormatResourceString = function (res) {
        return res.replace(/\r\n/g, "").replace('\\"', '"');
    };
    // 加载资源（样式、脚本等），返回后期加载的资源
    ContentBlock.prototype.LoadResource = function (res, resourceLoader) {
        var _this = this;
        res = this.FormatResourceString(res);
        var afterRes = [];
        if (res) {
            var m = res.match(ContentBlock._resource_format);
            if (m) {
                var outlineScript = [];
                var outlineStyle = [];
                var inlineStyle = [];
                for (var i = 0; i < m.length; i++) {
                    var s = m[i];
                    if (ContentBlock._outline_script_format.test(s))
                        outlineScript.push(s);
                    if (ContentBlock._inline_script_format.test(s))
                        afterRes.push(s);
                    if (ContentBlock._outline_style_format.test(s))
                        outlineStyle.push(s);
                    if (ContentBlock._inline_style_format.test(s))
                        inlineStyle.push(s);
                }
                for (var j in inlineStyle) {
                    if (inlineStyle.hasOwnProperty(j)) {
                        CanvasView.Header.append(inlineStyle[j]);
                    }
                }
                for (var k in outlineStyle) {
                    if (outlineStyle.hasOwnProperty(k)) {
                        this.Content.queue(resourceLoader, function () {
                            $.get(outlineStyle[k].match(ContentBlock._outline_style_format)[1], undefined, function (data) {
                                $(ContentBlock._style_format.replace(/\{0\}/, data)).on("load", function () { return _this.Content.dequeue(resourceLoader); }).appendTo(CanvasView.Header);
                            }, "text");
                        });
                    }
                }
                for (var l in outlineScript) {
                    if (outlineScript.hasOwnProperty(l)) {
                        this.Content.queue(resourceLoader, function () {
                            $.getScript(outlineScript[l].match(ContentBlock._outline_script_format)[1], function () { return _this.Content.dequeue(resourceLoader); });
                        });
                    }
                }
            }
        }
        return afterRes;
    };
    // 后期加载的资源
    ContentBlock.prototype.AfterLoadResource = function (resourceLoader, res) {
        for (var i in res) {
            if (res.hasOwnProperty(i)) {
                var code = res[i].match(ContentBlock._inline_script_format)[1].replace(/GetCurrentContentBlock\s*\(\s*\)/g, '$("div.content-placeholder[resourceindex=' + resourceLoader + ']").data("reference")');
                $.globalEval("try { " + code + " } catch (_error_message) {  } ");
            }
        }
    };
    // 加载操作项
    ContentBlock.LoadOptions = function (opts) {
        var result = "";
        var o = opts;
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                var item = o[i];
                var ico = $.trim(item.ico);
                result += ContentBlock._func_link_tag.replace(/\{0\}/g, item.url).replace(/\{1\}/g, CanvasView.GetMoreUrl(item.url)).replace(/\{2\}/g, item.width).replace(/\{3\}/g, item.height).replace(/\{4\}/g, "").replace(/\{5\}/g, ico ? "" : ico).replace(/\{7\}/g, ico ? "" : "hide").replace(/\{6\}/g, item.title);
            }
        }
        return result;
    };
    // pageIndex - 当前页码, recordTotal - 总记录数
    ContentBlock.prototype.UpdatePager = function (c, pageIndex, pageSize, recordTotal) {
        if (!isNaN(pageIndex)) {
            var pager = c.find(".title-pager");
            if (pager.length) {
                pager.empty();
                var p = new Pager(pageIndex, pageSize, recordTotal);
                var result = "";
                var format = '<a href="javascript: void(0)" rel="{1}"{2}>{0}</a>';
                if (p.recordCount) {
                    result += format.replace("{0}", '<img src="../../image/first-page.png" alt="上一页" title="上一页" />').replace("{1}", p.prevPage.toString()).replace("{2}", ' class="first-page' + (p.pageIndex === p.prevPage ? " sel" : "") + '"');
                    var interval = p.GetPageCodeInterval(3);
                    for (var i = interval.start; i <= interval.end; i++) {
                        result += format.replace("{0}", i.toString()).replace("{1}", i.toString()).replace("{2}", i === p.pageIndex ? ' class="sel"' : "");
                    }
                    result += format.replace("{0}", '<img src="../../image/last-page.png" alt="下一页" title="下一页" />').replace("{1}", p.nextPage.toString()).replace("{2}", ' class="last-page' + (p.pageIndex === p.nextPage ? " sel" : "") + '"');
                }
                pager.append(result);
            }
        }
    };
    // 重新加载
    ContentBlock.prototype.ReLoad = function (callbackFunc) {
        this.LoadContent(callbackFunc);
    };
    // 获得内容块ID
    ContentBlock.prototype.GetId = function () {
        return this.Content.attr("resourceindex");
    };
    // 通过ID获得指定内容块
    ContentBlock.GetById = function (id) {
        return $("div.content-placeholder[resourceindex=" + id + "]").data("reference");
    };
    // 设置请求参数
    ContentBlock.prototype.SetRequestParameter = function (parameterName, value) {
        var content = this.Content.children(".content");
        var url = content.attr("href");
        if (url) {
            var urls = url.split('?');
            var path = urls[0];
            var query = urls[1] || "";
            if (query) {
                if (new RegExp(parameterName + "\s*=").test(query)) {
                    query.replace(new RegExp(parameterName + "\s*=.*?(?:&|$)"), parameterName + "=" + value);
                }
                else {
                    query += "&" + parameterName + "=" + value;
                }
            }
            else {
                query = parameterName + "=" + value;
            }
            content.attr("href", path + "?" + query);
        }
    };
    // 开始加载当前拖放的内容块的内容
    ContentBlock.prototype.LoadContent = function (callbackFunc) {
        try {
            var my = this;
            var o = null;
            var url = "";
            var contentPart = this.Content.children(".content");
            var contentType = null;
            var isList = Number.NaN;
            var isHead = Number.NaN;
            var minWidth = Number.NaN;
            url = contentPart.attr("href");
            contentType = Number(this.Content.attr("contenttype"));
            isList = Number(my.Content.attr("islist"));
            isHead = Number(my.Content.attr("ishead"));
            minWidth = Number(my.Content.attr("minwidth"));
            if (!(isList === 1)) {
                my.Content.find(".title-pager").remove();
            }
            if (!isNaN(minWidth) && minWidth > 0)
                my.Content.css("min-width", minWidth);
            switch (contentType) {
                case 0 /* Normal */:
                    if (!url) {
                        my.LoadFail("");
                        return;
                    }
                    var pageSize = Number(contentPart.attr("pagesize"));
                    pageSize = (isNaN(pageSize) || pageSize < 1 ? 8 : pageSize);
                    var pageIndex = Number(contentPart.attr("pageindex"));
                    pageIndex = (isNaN(pageIndex) || pageIndex < 1 ? 1 : pageIndex);
                    $.when($.ajax({
                        url: url,
                        dataType: "json",
                        data: {
                            IDAjax: true,
                            ID: RequestDataObject.GetID(),
                            PortalType: RequestDataObject.GetPortalType(),
                            PageSize: pageSize,
                            PageIndex: pageIndex,
                            randData: new Date().getTime()
                        }
                    })).done(function (result) {
                        if (result && result.Success && result.Success.toLowerCase() === 'y') {
                            var resourceLoader = my.Content.attr("resourceindex");
                            if (!resourceLoader) {
                                resourceLoader = "ResourceLoader" + String(ContentBlock.ResourceIndex++);
                                my.Content.attr("resourceindex", resourceLoader).data("reference", my);
                            }
                            var afterRes = my.PrevLoadResource(result.Others, resourceLoader); // 预加载
                            my.Content.queue(resourceLoader, function () {
                                my.LoadComplete(result.Data); // Load 内容
                                my.Content.dequeue(resourceLoader);
                            }).queue(resourceLoader, function () {
                                my.AfterLoadResource(resourceLoader, afterRes); // Load 加载内容后才加载的资源（内联脚本）
                                my.Content.dequeue(resourceLoader);
                            }).queue(resourceLoader, function () {
                                if (isList === 1)
                                    my.UpdatePager(my.Content, Number(result.Others[1]), pageSize, Number(result.Others[0]));
                                my.Content.dequeue(resourceLoader);
                            }).queue(resourceLoader, function () {
                                // 设置内容块的内容最小高度
                                if (isList === 1)
                                    contentPart.css("min-height", ((pageSize + (contentPart.find("> .table > thead").length > 0 ? 1 : 0)) * 30 + "px"));
                                if (my.Content.attr("contentscrolling") === "true") {
                                    ContentScrolling.ApplyContentScrolling(my.Content);
                                }
                                my.Content.dequeue(resourceLoader);
                            }).queue(resourceLoader, function () {
                                if (callbackFunc && $.isFunction(callbackFunc)) {
                                    callbackFunc();
                                }
                                my.Content.dequeue(resourceLoader);
                            }).dequeue(resourceLoader);
                        }
                        else {
                            my.LoadFail(result);
                        }
                    }).fail(function (result) {
                        my.LoadFail(result);
                    });
                    return;
                case 1 /* FramePage */:
                    this.LoadComplete('<iframe class="iframe-page" src="about:blank" frameborder="0"></iframe>');
                    return;
                case 2 /* CustomContent */:
                    this.LoadComplete("", "custom-content-block");
                    return;
            }
            my.LoadFail("");
        }
        catch (msg) {
        }
    };
    // 使指定的对象被创建为 ContentBlock 对象
    ContentBlock.ParseContentBlock = function (content) {
        var c = new ContentBlock();
        c.Content = content;
        return c;
    };
    ContentBlock._default_content_image = "../../image/content-default.png";
    ContentBlock._default_content_title = "尚无标题";

    ContentBlock._resource_format = /(\<style.*?\>[\s\S]*?\<\/style\>)|(\<link.*?\>)|(\<script.*?\>[\s\S]*?\<\/script\>)/ig; // 资源正则表达式
    ContentBlock._outline_script_format = /\<script.*?src\s*\=\s*['"]+(.*?)['"]+.*?\>[\s\S]*?\<\/script\>/i;
    ContentBlock._inline_script_format = /\<script.*?\>([\s\S]*?)\<\/script\>/i;
    ContentBlock._outline_style_format = /\<link.*?href\s*\=\s*['"]+(.*?)['"]+.*?\>/i;
    ContentBlock._inline_style_format = /\<style.*?\>([\s\S]*?)\<\/style\>/i;

    ContentBlock._outline_style_tag = '<link rel="stylesheet" href="{0}" />';
    ContentBlock.ResourceIndex = 0;
    ContentBlock._style_format = '<style type="text/css">{0}</style>';
    ContentBlock._func_link_tag = '<a href="javascript: openWindow(\'{1}\', {2}, {3})" rel="{0}" opensize="{2}, {3}" class="{4}"><img src="{5}" class="{7}" title="{6}" alt="{6}" /><span>{6}</span></a>';
    return ContentBlock;
})();
/*
 * @class: Pager
 * @description: 表示分页类
*/
var Pager = (function () {
    function Pager(pageIndex, pageSize, recordCount) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.recordCount = recordCount;
        this.prevPage = 0;
        this.nextPage = 0;
        this.pageCount = 0;
        this.pageIndex = isNaN(this.pageIndex) || (this.pageIndex < 1) ? 1 : this.pageIndex;
        this.pageSize = isNaN(this.pageSize) || (this.pageSize < 1) ? 1 : this.pageSize;
        this.recordCount = isNaN(this.recordCount) || (this.recordCount < 0) ? 0 : this.recordCount;
        this.Comput();
    }
    Pager.prototype.Comput = function () {
        if (this.recordCount === 0) {
            this.pageCount = this.pageIndex = this.prevPage = this.nextPage = 1;
            return;
        }
        this.pageCount = Math.ceil(this.recordCount / this.pageSize);
        this.pageCount = this.pageCount < 1 ? 1 : this.pageCount;
        this.pageIndex = (this.pageIndex > this.pageCount) ? this.pageCount : this.pageIndex;
        this.prevPage = (this.pageIndex <= 1) ? 1 : this.pageIndex - 1;
        this.nextPage = (this.pageIndex >= this.pageCount) ? this.pageCount : this.pageIndex + 1;
    };
    Pager.prototype.GetMidValue = function (size) {
        return (size % 2 !== 0) ? ((size + 1) / 2) : (size / 2);
    };
    Pager.prototype.GetStartCode = function (size, midValue) {
        return ((this.pageIndex + midValue) > this.pageCount) ? (this.pageIndex - (size - (this.pageCount - this.pageIndex + 1))) : (this.pageIndex - (midValue - 1));
    };
    Pager.prototype.GetEndCode = function (size, midValue) {
        var end = (this.pageIndex < midValue) ? size : (this.pageIndex + midValue - 1);
        return (end > this.pageCount) ? this.pageCount : end;
    };
    Pager.prototype.GetPageCodeInterval = function (size) {
        size = size > 1 ? size : 1;
        var result = { start: 1, end: 1 };
        if (size <= 1) {
            result.start = this.pageIndex;
            result.end = this.pageIndex;
        }
        else {
            var midValue = this.GetMidValue(size);
            result.start = this.GetStartCode(size, midValue);
            result.end = this.GetEndCode(size, midValue);
        }
        result.start = result.start < 1 ? 1 : result.start;
        result.end = result.end < 1 ? 1 : result.end;
        return result;
    };
    return Pager;
})();
/**
 * @class: RequestDataObject
 * @description: 获得请求参数的静态类
*/
var RequestDataObject = (function () {
    function RequestDataObject() {
    }
    RequestDataObject.SetData = function (portalId, id, portalType) {
        RequestDataObject._id = id;
        RequestDataObject._portalId = portalId;
        RequestDataObject._portalType = portalType;
    };
    // 获取请求参数: ID
    RequestDataObject.GetID = function () {
        if (!RequestDataObject._id) {
            var m = document.location.search.match(/id\=(.*?)(?:&|$)/i);
            RequestDataObject._id = m ? m[1] : null;
        }
        return RequestDataObject._id;
    };
    // 获取请求参数: Debug
    RequestDataObject.GetDebug = function () {
        var m = document.location.search.match(/systemdebug\=(.*?)(?:&|$)/i);
        return m ? (m[1].toLowerCase() === "true") : false;
    };
    // 获取请求参数: PortalType
    RequestDataObject.GetPortalType = function () {
        if (isNaN(RequestDataObject._portalType)) {
            var m = document.location.search.match(/portaltype\=(\d+?)(?:&|$)/i);
            RequestDataObject._portalType = m ? Number(m[1]) : Number.NaN;
        }
        return RequestDataObject._portalType;
    };
    // 获取请求参数: PortalId
    RequestDataObject.GetPortalId = function () {
        if (!RequestDataObject._portalId) {
            var m = document.location.search.match(/portal\=(.*?)(?:&|$)/i);
            RequestDataObject._portalId = m ? m[1] : null;
        }
        return RequestDataObject._portalId;
    };
    RequestDataObject._id = null;
    RequestDataObject._portalType = Number.NaN;
    RequestDataObject._portalId = null;
    return RequestDataObject;
})();
$(function () { return new CanvasView().Init(); });
/**
 * 加载当前用户的门户数据
 *
 * @param:
 *      portalId - 门户页的 ID (Guid)
 *      callback - 执行完毕的回调函数，要求将结果传递给 callback (function)
 *
 * @return: 返回门户页的布局 (string)
 */
function LoadUserPortalData(callback) {
    ajax("FillData.ashx", { "action": "GetUserPortalData", "randData": new Date().getTime() }, "json", function (data) {
        callback(data);
    });
}
/**
 * 根据门户页ID加载其布局HTML
 *
 * @param:
 *      portalId - 门户页的 ID (Guid)
 *      callback - 执行完毕的回调函数，要求将结果传递给 callback (function)
 *
 * @return: 返回门户页的布局 (string)
 */
function LoadPortalLayout(portalId, callback) {
    ajax("FillData.ashx", { "action": "GetPortalHtml", "ppId": portalId, "randData": new Date().getTime() }, "json", function (data) {
        callback((data.Success == "Y" && data.Others[0] == "N") ? data.Data : "");
    });
}
function ajaxLoading() {
}
