/**
 * Copyright 2014 @SAPI
 * http://www.chinasap.cn
 * 
 * by maowenchao
 * 
 * silver.js v0.1 - 2014/6/1
 * 
 * 
 * Silver(简约银灰) 是EAP系统的一套皮肤。本脚本文件是该皮肤相关的脚本程序的集合。
 * 
 * 基于整体交互界面为框架式 SPI(单页模式) 界面，因此首页划分为三个区域，如下图：
 * 
 *                  SilverPage
 * ┌─────────────────────────────────────────┐             
 * │            TopFrame (iframe)            │             
 * ├────────────┬────────────────────────────┤             ┌────────────────┐
 * │            │                            │             │     Server     │
 * │            │                            │             └────────────────┘    
 * │            │                            │                   ↑
 * │            │                            │                   │ request data (ajax)
 * │ MenuSilder │        ContentFrame        │                   │
 * │            │          (iframe)          │             ┌────────────────┐
 * │            │                            │  <--- fill  │    ViewModel   │
 * │            │                            │             └────────────────┘
 * │            │                            │
 * │            │                            │
 * └────────────┴────────────────────────────┘
 *
 * SilverPage 页面中没有在服务器生成时即填充数据返回，所有数据来自异步请求服务器获取，所获取的数据将存放在 ViewModel 中，
 * 然后开始向各个区域填充数据。
 * 
 * 使用 iframe 作为内容展示的原因是为了兼容已有的皮肤结构设计方案。
 * 
 * SilverPage 表示整体框架页面的抽象与命名空间，该命名空间下属有以下成员：
 *      TopFrame     - 表示顶部区域，请参看 SilverPage.TopFrame
 *      MenuSilder   - 表示菜单区域，请参看 SilverPage.MenuSilder
 *      ContentFrame - 表示内容区域，请参看 SilverPage.ContentFrame
 * 
 *      DuckSilder   - 表示当 MenuSilder 隐藏时显示的 <展开菜单> 滑块，请参看 SilverPage.DuckSilder
 * 
 *      ViewModel    - 表示数据模型，请参看 SilverPage.ViewModel
 * 
 * --------------------------------------------------------------------------------
 * 
 * [参数类型术语]
 * 在函数参数说明中，在参数后面以及说明之前的位置，使用大括号括起的部分代表参数的类型，下方是参数类型的示例:
 * 
 *                @param username     {string} 用户名
 *                @param age          {number} 年龄
 *                function func( username, age )
 *                {
 *                }
 * 
 * 为简便起见，下方出现的配对代表的意思相同：
 *      字符串      = {string}    = {""}
 *      数字        = {number}    = {n}
 *      布尔        = {boolean}   = {bool}
 *      jQuery对象  = {jquery}    = {$}
 *      数组        = {array}     = {[]}
 *      正则表达式   = {regexp}    = {//}
 *      对象        = {object}    = {{}}
 *      函数        = {function}  = {()}
 * 
 */

/**
 * 表示页面及本页命名空间
*/
var SilverPage = (function () {
    function page() {
        // 主框架，包括：菜单区域(请参看 SilverPage.MenuSilder) 及 内容(请参看 SilverPage.ContentFrame)
        this.$frameMain = $("#frame-main");

        // <展开顶部框架> 按钮，当点击该按钮会展示顶部框架(请参看 SilverPage.TopFrame)
        this.$expandButton = this.$frameMain.find(".expand-top");

        this.$topFrameBanner = $(".fix-show-top-frame");

        // 是否显示 <展开顶部框架> 按钮，程序将检查这个状态标志来确定是否需要显示 <展开顶部框架> 按钮
        this.showExpandButton = false;

        this.topFrame = new SilverPage.TopFrame();  // 创建顶部框架(请参看 SilverPage.TopFrame)
        this.duckSilder = new SilverPage.DuckSilder();  // 创建 <展开菜单> 滑块(请参看 SilverPage.DuckSilder)
        this.menuSilder = new SilverPage.MenuSilder(this.handleWidth());  // 创建左侧导航菜单栏(请参看 SilverPage.MenuSilder)
        this.contentFrame = new SilverPage.ContentFrame();      // 创建主内容框架(请参看 SilverPage.ContentFrame)

        // 创建视图模型(请参看 SilverPage.ViewModel)
        this.vm = new SilverPage.ViewModel();

    }

    page.$body = $("body");

    page.$win = $(window);

    page.instance = void 0;

    var fn = page.prototype;



    /**
     * 处理导航菜单栏(SilverPage.MenuSilder) 宽度变化时，主内容框架(SilverPage.ContentFrame)的宽度跟随变化。
     * 
     * 下列情况需要重新调整主内容框架的宽度：
     *      1. 菜单栏右侧可拖动的尺寸调整条被拖动时
     *      2. 点击菜单栏下方收起按钮(<<) 时（将收起菜单）
     *      3. 点击展开菜单滑块(SilverPage.DuckSilder)时（将展开菜单）
     * 
     * @returns 响应主内容框架宽度变化的函数。
     */
    fn.handleWidth = function () {
        var that = this;

        /**
         * 响应主内容框架宽度变化的函数
         * 
         * @param width     {number} 传递指定响应的宽度，主框架的宽度将调整为指定的宽度。
         * @param isFixed   {boolean} 导航菜单栏是否为锚定状态，当导航菜单处于非锚定状态时，将遮盖主框架的内容，
         *                  因此主框架内容恒定为 0（关于 "锚定状态" 详细内容请参看 SilverPage.MenuSilder）
         */
        return function (width, isFixed) {
            if (isFixed) {
                that.contentFrame.adjustWidth(width);
            } else {
                that.contentFrame.adjustWidth(0);
            }
        }
    }

    /**
     * 页面启动器
     * 
     * 执行页面初始化及事件绑定。
     */
    fn.bootstrapper = function () {
        var that = this,
            win = SilverPage.$win;

        // <展开菜单> 滑块事件绑定，点击滑块时，展开导航菜单栏
        this.duckSilder.binding(function () {
            that.menuSilder.expand();
        });

        // 初始化顶部框架
        this.topFrame.init(
                            function (logoHeight) // 展开顶部框架时执行的回调
                            {
                                that.showExpandButton = false;
                                that.$topFrameBanner.hide();
                                that.$frameMain.css({ top: logoHeight });
                            },
                            function ()          // 收起顶部框架时执行的回调
                            {
                                that.$frameMain.css({ top: this.$obj.attr("kd-min-height") });
                                that.$topFrameBanner.show();
                                that.showExpandButton = true;
                            },
                            function (top)    // 当顶部框架页面加载完毕后执行的回调
                            {
                                top.$funcbar.data("counter", 0);

                                top.$funcbar.on("click", "a[data-main-target]", function ()    // 点击顶部菜单的部分存在 data-main-target 属性的链接
                                {
                                    var url = $(this).attr("data-main-target");

                                    if (url) {
                                        that.contentFrame.direct("../" + url);
                                    }
                                }).on("click", ".normal-menu.has-children", function ()      // 当点击顶部菜单并改菜单存在下来菜单时，显示子菜单
                                {
                                    var me = $(this),
                                        selector = ("div.submenu[data-menu-id=" + me.attr("data-url-id") + "]"),
                                        menus = SilverPage.$body.find(selector),
                                        allMenus = SilverPage.$body.find("div.submenu");

                                    if (menus.length === 0) {
                                        menus = top.$funcbar.find(selector).clone();

                                        menus.attr("tab-index", -1).on("blur", function () {
                                            
                                            menus.delay(200).slideUp(150);
                                            var num = parseInt(top.$funcbar.data("counter"));
                                            if (num) {
                                                top.$funcbar.data("counter", num - 1);
                                            }
                                        }).appendTo(SilverPage.$body);
                                    }

                                    //if (menus.css("display") === "none") {
                                    //    new SilverPage.ShortcutMenu(menus, me).show();
                                    //    top.$funcbar.data("counter", parseInt(top.$funcbar.data("counter") + 1));
                                    //}
                                    if (menus.is(":visible")) {
                                        new SilverPage.ShortcutMenu(menus, me).hide();
                                        var num = parseInt(top.$funcbar.data("counter"));
                                        if (num) {
                                            allMenus.hide();
                                            top.$funcbar.data("counter", num - 1);
                                        };
                                    } else {
                                        var num = parseInt(top.$funcbar.data("counter"));
                                        if (num) {
                                            allMenus.hide();
                                            top.$funcbar.data("counter", num - 1);
                                        }
                                        new SilverPage.ShortcutMenu(menus, me).show();
                                        top.$funcbar.data("counter", parseInt(top.$funcbar.data("counter") + 1));
                                    }
                                }).on("mouseenter", ".normal-menu.has-children", function ()      // 当子菜单有一个显示时，鼠标移到顶部菜单时，显示子菜单
                                    {
                                        if (parseInt(top.$funcbar.data("counter"))) {
                                            $(this).trigger("click");
                                        }
                                            
                                })
                            },
                            function (vm) {
                                return that.menuSilder.buildMainMenuContent(vm);
                            },
                            function (menu) {
                                if (menu.attr("data-linkway") === "-1") {
                                    that.contentFrame.direct("../" + menu.attr("target"));
                                    that.menuSilder.autoCollapse();
                                } else {
                                    that.menuSilder.showSubMenu(menu);
                                }
                            }
        );

        // 点击 <展开顶部框架> 按钮时，展开顶部框架。
        this.$expandButton.on("click", function () {
            // 隐藏 <展开顶部框架> 按钮（当顶部框架被展开显示时，才需要显示 <展开顶部框架> 按钮）
            that.$expandButton.hide();

            // 展开顶部框架
            that.topFrame.expand();
        }).on("mouseenter", function () {
            that.$expandButton.show();
        }).on("mouseout", function () {
            that.$expandButton.hide();
        });

        // 当顶部框架处于收起状态时，鼠标移动到顶部空白区域将显示 <展开顶部框架> 按钮
        this.$topFrameBanner.on("mouseenter", function (e) {
            if (that.showExpandButton)    // 若允许显示 <展开顶部框架> 按钮
            {
                that.$expandButton.show();      // 则显示 <展开顶部框架> 按钮
            }
        }).on("mouseout", function () {
            that.$expandButton.hide();      // 否则隐藏 <展开顶部框架> 按钮
        });

        /**
         * 当点击菜单栏上的菜单时，若存在链接，则触发主内容框架开始请求该链接。
         * 
         * @param target {$} 当前被点击的菜单 (不论级别，只要存在链接均会触发主内容框架跳转动作)
         */
        this.menuSilder.fire = function (target) {
            var url = target.attr("target"),
                script = url.match(/^\s*javascript\:(.*)$/i);

            if (script && script.length > 0) {
                $.globalEval(script[1]);
            } else {
                that.contentFrame.direct("../" + url);
            }

            // 自动收起导航菜单栏(当导航菜单栏在非锚定的情况下，点击菜单后将自动收起导航菜单栏)
            that.menuSilder.autoCollapse();
        }

        // 开始加载视图模型的数据
        this.vm.load(function (vm) {
            // 加载数据完毕后初始化数据：
            that.initData(vm, function () {
                that.initTop(vm);     // 执行顶部框架初始化
                that.initMenu(vm);    // 执行菜单初始化
                that.initContent(vm); // 执行主框架内容初始化
            });

            win.on("resize", function () {
                // 当浏览器小于 810px 时，自动收起菜单栏
                if (that.menuSilder.hasMenu() && win.width() < 1030) {
                    if (!that.menuSilder.userInterveneOperation)
                        that.menuSilder.collapse(700);
                }
            }).trigger("resize");

        });
    }

    fn.initData = function (vm, action) {
        if (vm.Success.toLowerCase() === "y")     // 判断是否成功请求到数据
        {
            if (typeof vm.Data === "string")  // 自动转换数据为 JSON 对象
            {
                vm.Data = JSON.parse(vm.Data);
            }







            action();
        } else {
            SilverPage.$win.attr("location", "VTimeOut.htm");
        }
    }

    /**
     * 执行顶部框架初始化
     * 
     * @param vm    {object} 视图模型数据
     */
    fn.initTop = function (vm) {
        this.topFrame.fill(vm);   // 填充数据到顶部框架
    }

    /**
     * 执行菜单初始化
     * 
     * @param vm        {object} 视图模型数据
     */
    fn.initMenu = function (vm) {
        this.menuSilder.fill(vm);     // 填充数据到导航菜单栏
    }

    /**
     * 执行主框架内容初始化
     * 
     * @param vm    {object} 视图模型数据
     */
    fn.initContent = function (vm) {
        var that = this;

        // 绑定主框架内容的加载事件，这个事件在每次切换菜单链接后均会被执行
        this.contentFrame.load = function (page) {
            // 在主框架页面中任意位置单击，都判断是否需要收起导航菜单栏
            // 若导航菜单栏是非锚定的浮动状态，此时将自动被收起
            page.on("click", function () {
                that.menuSilder.autoCollapse();
            });
        }

        // 填充数据到主内容框架
        this.contentFrame.fill(vm);
    }

    return page;
}());

/**
 * 快捷菜单
 */
SilverPage.ShortcutMenu = (function () {
    /**
     * 快捷菜单
     * 
     * @param menus     {array} 弹出菜单数据
     * @param target    {$} 弹出菜单源
     */
    function shortcutMenu(menus, target) {
        this.menus = menus;
        this.target = target;
    }

    var fn = shortcutMenu.prototype;

    fn.show = function (x, y) {
        var offset = this.target.offset(),
            winWidth = SilverPage.$win.width(),
            winHeight = SilverPage.$win.height();

        x = x || offset.left;
        y = y || offset.top + parseInt(this.target.css("font-size")) + 20;

        x = (x + this.menus.width()) >= winWidth-5 ? winWidth - this.menus.width() - 25 : x;

        this.menus.css({ left: x, top: y }).slideDown(150).focus();
    }
    fn.hide = function () {
        this.menus.slideUp(150);
    }

    shortcutMenu.applyFromElementAttribute = function (showEvent, disEvent, menu) {

    }

    return shortcutMenu;
}());

/**
 * 表示视图模型
 */
SilverPage.ViewModel = (function () {
    function viewModel() {
        this.vm = null;

        // 请求视图模型数据的服务器地址
        this.url = "FillData.ashx?Action=GetHomeData&IDAjax=true";
    }

    var fn = viewModel.prototype;

    /**
     * 加载视图模型数据
     * 
     * @param callback  {function} 加载完毕后的回调
     */
    fn.load = function (callback) {
        var that = this;

        $.ajax({
            url: that.url,
            dataType: "json",
            success: function (data) {
                that.vm = data;
                if (typeof callback === "function") {
                    callback.call(that, data);
                }
            },
            error: function (req, err, msg) {
                //console.log( msg );
            }
        });
    }

    return viewModel;
}());

/**
 * 表示主导航菜单列表
 * 
 * 包括菜单的搜索、创建及展示操作。
 * 
 * 为性能考虑，初始化时仅创建一级菜单，所有其他菜单按需创建（仅创建一次，其后不再重复创建），
 * 从未点击的一级菜单不会创建其下属菜单。
 * 
 * 例如点击某一级菜单，才开始创建该菜单的下一级菜单，创建完毕后添加到 DOM 中然后展示。
 * 但四级及以下的菜单不再按需创建，当展开到四级菜单时，其下属所有菜单全部创建为菜单树。
 * 
 * [菜单栏的锚定与浮动]
 * 锚定 - 当改变菜单栏宽度时，右侧主内容框需要跟随菜单栏的宽度变化而变化，主内容框架的左边框始终在菜单的右侧。
 * 浮动 - 主内容框架的宽度不跟随菜单栏的宽度变化而变化，恒定为100%。当菜单展开时，将遮盖主内容框架的内容；
 *        当在主框架内容的任意位置点击，或切换了菜单，菜单栏则自动收起。
 */
SilverPage.MenuSilder = (function () {
    /**
     * @param widthCallback     (function) 宽度调整的回调函数，目的是当菜单宽度变化时，
     *                          提供给外部执行其他操作的机会，例如主内容框架可能需跟随变化。
     */
    function menuSilder(widthCallback) {
        this.$obj = $("#frame-main .duck-menu-silder");
        this.$splitter = $(".layout-drag-splitter");      // 菜单栏尺寸调整器(可拖动)
        this.$menus = this.$obj.find(".menus-bar");

        this.$operat = this.$obj.find(".operate-area");
        this.$collapse = this.$operat.find(".collapse-menu");     // <收起菜单栏> 按钮
        this.$anchor = this.$operat.find(".anchor-menu");         // <锚定菜单栏> 按钮
        this.$refresh = this.$operat.find(".refresh-menu").hide();       // <刷新菜单> 按钮
        this.$search = this.$operat.find(".search-menu");
        this.widthCallback = widthCallback;

        this.minWidth = 120;     // 菜单最小宽度，小于此宽度则自动隐藏
        this.maxWidth = 760;    // 菜单最大宽度，大于此宽度则停止拖动调整尺寸
        this.oldWidth = 200;    // 上一次菜单栏被调整的宽度（用于在重新展开时计算尺寸）

        this.isPureTopLayout = this.$obj.closest(".pure-top-layout").length > 0;

        this.anchor = !this.isPureTopLayout;     // 菜单栏是否为锚定状态
        this.userInterveneOperation = false;    // 用户是否点击过浮动/锚定按钮

        this.isCollapsed = false;   // 菜单栏是否已收起

        this.currentMainMenu = void 0;

        this.saveData = null;

        // 菜单项存在链接，并被点击时执行 fire() 方法。
        // 此方法的目的是提供给外部执行其他操作的机会，例如主框架的地址进行变换。
        // 参数 target {$} 是当前被点击的菜单元素。
        this.fire = function (target) { };


        // 按需缓存三级菜单，便于在生成三级菜单时快速查找。
        this.allThirdMenuData = {};

        this.refreshRunning = false;

        this.init();
    }

    var fn = menuSilder.prototype;


    /**
     * 左侧导航菜单搜索功能
     */
    fn.searchMenu = (function () {
        var searchmenu = function () {
            this.$container = $("#search-menu-box");
            this.$fireInputBox = $(".operate-area").find(".search-menu");
            this.$inputBox = this.$container.find(".search-input-box");
            this.$input = this.$container.find(".search-input");
            this.$resultBox = this.$container.find(".search-list");
            this.$tipsBox = $(".operate-area").find(".search-tips");
            this.$closeTipsBox = this.$tipsBox.find(".close-search-tips");
            this.$menu = this.$container.next(".menus-bar");
            this.$anchor = this.$container.find(".anchor-search");
            this.anchorStatus = false;
            this.data = null;
            this.tipsBlurStatus = false;
            this.timer = null;
            this.slideTimer = null;
            this.fadeInTimer = null;
            this.blurTimer = null;
            this.indexHash = 0;
            this.detailHash = [];
            this.clickTimes = 0;
            this.resultFormat = "<li data-id='{id}' class='{lineNum}' data-hash='{hashIndex}' title='{title}'><div class='result-title'>{name}</div><div class='result-src'>{src}</div><i class='result-nav-ico'></i></li>"
        }
        searchmenu.prototype.init = function (vm) {
            var that = this;
            this.data = vm.Data.MenuMod;
            this.createHash(this.data);
            //菜单项小于30，不提供此功能
            if (this.detailHash.length < 30) {
                this.$fireInputBox.remove();
                return;
            }
            this.fireSearchBox().fireSearch();
            this.$input.on("focus", function () {
                if (that.slideTimer) {
                    clearTimeout(that.slideTimer);
                }
                if ($(this).val()) {
                    $(this).select();
                }
            })
            .on("blur", function () {
                that.slideTimer = setTimeout(function () {
                    if (that.anchorStatus) {
                        that.$resultBox.slideUp();
                    } else {
                        that.$fireInputBox.click();
                    }
                },300)
               
            })
            .on("click", function () {
                $(this).keyup();
            });
            this.$anchor.on("click", function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    that.anchorStatus = false;
                    localStorage && localStorage.setItem("search-anchor", false);
                } else {
                    $(this).addClass("active");
                    that.anchorStatus = true;
                    localStorage && localStorage.setItem("search-anchor", true);
                }
            });
            this.$resultBox.on("click", "li", function () {
                that.$input.val($(this).children(".result-title").text()).blur();
                //判断是否存在，不存在则根据wayId逐层寻找，直至找到存在的项目，然后依次触发click事件
                var tempArr = that.detailHash[$(this).attr("data-hash")]["wayId"].split(","), tempLen = tempArr.length, operateArr = [];
                //while (tempLen--) {
                //    var tempTarget = that.$menu.find("li[data-id=" + tempArr[tempLen] + "]");
                //    operateArr.unshift(tempArr[tempLen]);
                //    if (tempTarget && tempTarget.length) {
                //        tempLen = 0;
                //    }
                //}
                var lastObj = that.$menu.find("li.menu-selected[data-id=" + tempArr[tempLen - 1] + "]");
                if (lastObj && lastObj.length) { return }
                for (var i = 0; i < tempLen; i++) {
                    that.$menu.find("li[data-id=" + tempArr[i] + "]").click();
                }
            });
            //读取锚定状态
            if (localStorage && localStorage.getItem("search-anchor") == "true") {
                this.$fireInputBox.click();
                this.$anchor.click();
                this.$fireInputBox.focus();
            }
        };
        searchmenu.prototype.conputerTimes = function (boolen) {
            var status = localStorage && localStorage.getItem("search-tips");
            if (status == null || status == "true") {
                if (boolen || this.$input.val()) {
                    this.clickTimes = 0;
                } else {
                    this.clickTimes++;
                    if (this.clickTimes == 10) {
                        this.showTips();
                        this.clickTimes = 0;
                    }
                }
            }
        };
        searchmenu.prototype.showTips = function () {
            var that = this,
                $neverBox = that.$tipsBox.children(".never-show-box");
            clearTimeout(this.fadeInTimer);
            clearTimeout(this.blurTimer);
            this.fadeInTimer = setTimeout(function () {
                $neverBox.fadeIn();
            }, 1800);
            this.$tipsBox.show().off().on("blur", function () {
                if (that.tipsBlurStatus) {
                    return;
                }
                clearTimeout(that.fadeInTimer);
                clearTimeout(that.blurTimer);
                that.$tipsBox.fadeOut(function () {
                    that.$tipsBox.children(".never-show-box").hide();
                });
                if (that.$tipsBox.find(".never-show").prop("checked")) {
                    localStorage && localStorage.setItem("search-tips", false);
                }
            }).on("mouseover", function () {
                that.tipsBlurStatus = true;
            }).on("mouseout", function () {
                that.tipsBlurStatus = false;
            })
             .focus().css("backgroundImage", "url(../Image/searchtips.gif?" + (new Date()).getTime() + ")");

            this.$closeTipsBox.off().on("click", function () {
                that.$tipsBox.fadeOut().children(".never-show-box").hide();
                if (that.$tipsBox.find(".never-show").prop("checked")) {
                    localStorage && localStorage.setItem("search-tips", false);
                }
            });
            this.blurTimer = setTimeout(function () {
                that.$tipsBox.blur();
            }, 8000);
    };
        searchmenu.prototype.fireSearchBox = function () {
            var that = this;
            this.$fireInputBox.on("click", function () {
                clearTimeout(that.slideTimer);
                if (that.$container.is(":visible")) {
                    $(this).removeClass("active");
                    that.$container.slideUp(200);
                    that.$menu.animate({ "top": "41px" }, 200);
                } else {
                    $(this).addClass("active")
                    that.$container.slideDown(200);
                    that.$menu.animate({ "top": "74px" },200);
                    that.$input.focus();
                    that.$anchor.removeClass("active");
                    that.anchorStatus = false;
                }
            });
            return this;
        };
        searchmenu.prototype.createHash = function (arr, src, id) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].children && arr[i].children.length) {
                    this.createHash(arr[i].children, (src ? src + "/" : "") + arr[i].name, (id ? id + "," : "") + arr[i].id);
                }
                //this.nameHash.push(arr[i].name);
                this.detailHash.push({
                    name: arr[i].name,
                    index: this.indexHash++,
                    deep: (src ? src.split("/").length + 1 : 1),
                    id: arr[i].id,
                    url: arr[i].url,
                    parentWay: (src ? src + "/" : "") + arr[i].name,
                    wayId: (id ? id + "," : "") + arr[i].id
                })
            }
            return this;
        };
        searchmenu.prototype.fireSearch = function () {
            var that = this;
            this.$input.on("keyup", function (e) {
                if (e.keyCode == 9) {
                    return;
                }
                var resultList = that.$resultBox.children("li"),
                    resultLength = resultList.length;
                //if (that.timer) {
                //    clearTimeout(that.timer);
                //}
                if (e.keyCode == 108 || e.keyCode == 13) {
                    that.$resultBox.children(".active").click();
                    return;
                }
                if (resultLength) {
                    if (e.keyCode == 38) {
                        that.$resultBox.children(".active").prev().addClass("active").siblings().removeClass("active");
                        if(that.$resultBox.children(".active").position().top < 61){
                            that.$resultBox.animate({ scrollTop: that.$resultBox.scrollTop() - 61 },100)
                        }
                        return;
                    } else if (e.keyCode == 40) {
                        that.$resultBox.children(".active").next().addClass("active").siblings().removeClass("active");
                        console.log(that.$resultBox.children(".active").position().top);
                        console.log(that.$resultBox.height());
                        if (that.$resultBox.children(".active").position().top > that.$resultBox.height()-61) {
                            that.$resultBox.animate({ scrollTop: that.$resultBox.scrollTop() + 61 },100)
                        }
                        return;
                    }
                }
                if ($(this).val()) {
                    //that.timer = setTimeout(function () {
                        var result = that.fifter( that.index(that.$input.val(), that.detailHash) );
                        that.showResult(result, that.$input.val());
                    //}, 150)
                } else {
                    that.showResult([],"");
                }

            });
            return this;
        };
        searchmenu.prototype.index = function (words, area) {
            var result = [];
            for (var i = 0, len = area.length; i < len; i++) {
                if (area[i].name.indexOf(words) != -1) {
                    result.push(area[i]);
                }
            }
            //return {
            //    //index: index,
            //    result: result
            //}
            
            return result;
        };
        searchmenu.prototype.fifter = function (arr) {
            //对搜索结果进行排序；
            arr.sort(function (prev, next) {
                return next.deep - prev.deep;
            });
            return arr;
        };
        searchmenu.prototype.showResult = function (resultArr,keywords) {
            var temp = "";
            for (var i = 0, len = resultArr.length; i < len; i++) {
                temp += (this.resultFormat.replace(/\{lineNum\}/g, i%2 ? "odd-line" : "")
                                .replace(/\{hashIndex\}/g, resultArr[i]["index"])
                                .replace(/\{name\}/g, resultArr[i]["name"].replace(new RegExp(keywords,"g"), "<a>" + keywords + "</a>"))
                                .replace(/\{src\}/g, resultArr[i]["parentWay"])
                                .replace(/\{title\}/g, resultArr[i]["parentWay"])
                                .replace(/\{id\}/g, resultArr[i]["id"])
                );
            }
            if (!temp) {
                this.$resultBox.slideUp();
            } else {
                this.$resultBox.html(temp).slideDown().animate({ "scrollTop": 0 });
            }
            this.$resultBox.children("li").eq(0).addClass("active");
        };

        return new searchmenu();

    })()

    /**
     * 初始化左侧导航菜单
     */
    fn.init = function () {
        var that = this;

        // 点击 <收起菜单栏> 按钮
        this.$collapse.on("click", function () {
            that.collapse();
        });

        // 点击 <锚定/浮动> 按钮，每点击一次则切换状态（锚定切换为浮动，浮动切换为锚定）。
        this.$anchor.on("click", function () {
            that.anchor = !that.anchor; // 切换状态
            that.userInterveneOperation = true;

            if (that.anchor) {
                that.$anchor.addClass("anchor-menu-sel");
                that.widthCallback(that.$obj.width(), that.anchor);
            }
            else {
                that.$anchor.removeClass("anchor-menu-sel");
                that.collapse();    // 若是浮动状态，点击后自动收起。
            }
        });

        // 点击 <刷新菜单> 按钮
        this.$refresh.on("click", function () {
            SilverPage.instance.vm.load(function (vm) {
                // 加载数据完毕后初始化数据：
                SilverPage.instance.initData(vm, function () {
                    that.saveData = vm;
                    that.refresh(vm);    // 更新菜单
                });
            });
        });

        //点击<首页>按钮
        this.$operat.on("click", ".system-menu.go-main-page", function () {
            var url = "../" + $(this).attr("data-main-target");
            if (url) {
                var box = $("#frame-main .frame-content-box"),
                    obj = box.find("#frame-content"),
                    contentLoadingCover = $(".frame-content-loading-cover"),
                    contentLoadingCoverCopy = $(".frame-content-loading-cover-copy");

                contentLoadingCover.css(box.offset()).show();
                contentLoadingCoverCopy.css(box.offset()).show();
                obj.data("currLink", url);

                obj.attr("src", "").attr("src", url);
            }
            //收起已展开的一级菜单
            that.$menus.children(".main-menu").children("li.menu-selected").click();
        });
            


        // 点击了任何附带了链接的菜单项
        this.$menus.on("click", "li", function () {
            var me = $(this);

            if (me.attr("target")) {
                me.parents(".dynamic-tree-list").find("li.menu-selected").removeClass("menu-selected");

                that.fire(me);     // 触发主内容框架切换地址
            }

            me.addClass("menu-selected").siblings("li").removeClass("menu-selected");
        });

        // 主菜单项被点击时，显示二级菜单，若无则尝试创建。
        this.$menus.on("click", ".main-menu > li", function () {
            var me = $(this),
                parent = me.parent();

            // 进入二级菜单前，记录一级菜单当前的滚动条位置，以便回到一级菜单时再次恢复位置
            parent.data("scroll-top", parent.scrollTop());

            that.showSubMenu(me);

            that.searchMenu.conputerTimes($(this).attr("target"));
        });

        // 二级菜单的标题被点击时，返回一级菜单
        this.$menus.on("click", ".sub-menu .sub-menu-header", function () {
            if (!SilverPage.$body.hasClass("theme-top-level-menu")) {
                var menuBox = $(this).next("ul");

                // 返回一级菜单前，记录当前二级菜单的滚动条位置，以便回到二级菜单时再次恢复位置
                menuBox.data("scroll-top", menuBox.scrollTop());

                that.showMainMenu();
            }
        });

        if (this.isPureTopLayout) {
            this.$menus.on("click", function () {
                that.collapse();
            });
        }

        // 二级菜单被点击时，显示三级菜单，若无则尝试创建。
        this.$menus.on("click", ".sub-menu > ul > li", function () {
            var me = $(this),
                disableAnimate = me.hasClass("disable-animate-once");

            if (disableAnimate) {
                me.removeClass("disable-animate-once");
            }

            if (me.hasClass("has-third-menu")) {
                that.showThirdMenu(me, disableAnimate);
            } else {
                me.siblings()         // 而其兄弟
                   .removeClass("expand-third-menu")  // 全部移除展开样式
                       .next(".third-menu")   // 兄弟的子菜单
                       .slideUp(200)     // 全部收起
                           .find(".menu-selected")   // 兄弟所有被选中的菜单
                               .removeClass("menu-selected");    // 全部设为不选中
            }

            that.searchMenu.conputerTimes($(this).attr("target"));

            return false;
            if (that.isPureTopLayout) {
                return false;
            }

        });

        // 三级菜单被点击时，显示其他菜单，若无则尝试创建。
        this.$menus.on("click", ".third-menu > ul > li", function () {
            if ($(this).hasClass("has-other-menu")) {
                that.showOtherMenu($(this));
            } else {
                var p = $(this).position().top;
                if (p < 1) {
                    var m = $(this).parents(".main-menu");

                    m.stop().animate({ scrollTop: m.scrollTop() + p });
                }
            }
            that.searchMenu.conputerTimes($(this).attr("target"));
        });

        // 停止事件冒泡
        //      1. hack 四级及其下属的菜单被点击时触发父菜单被点击的 BUG，通过禁止事件向上冒泡。
        //      2. 三级菜单点击时
        this.$menus.on("click", ".dynamic-tree-list, .third-menu > ul", function () { return false; });

        // 四级及其下属菜单(菜单树)被点击时，展示其下级菜单
        this.$menus.on("click", ".dynamic-tree-list li", function () {
            var me = $(this);

            if (me.hasClass("has-sub-menu")) {
                that.showDynamicTreeListNode(me);
            }
            //var p = me.position().top;
            //if (p < 1) {
            //    var m = me.parents(".main-menu");

            //    m.stop().animate({ scrollTop: m.scrollTop() + p });
            //}
            //else
            //{
            //    me.siblings( ".expand-sub-menu" )
            //        .removeClass( "expand-sub-menu" )
            //            .children( ".dynamic-tree-list" )
            //            .slideUp( 200 );
            //}

            that.searchMenu.conputerTimes($(this).attr("target"));
        });

        // 尺寸调整器拖动，则改变菜单栏宽度跟随其变化
        this.$splitter.draggable({
            axis: "x",
            opacity: .5,
            scroll: false,
            iframeFix: "#frame-main",
            containment: [that.minWidth, 0, that.maxWidth, 0],
            start: function (e) {
                // 记录旧尺寸
                that.oldWidth = e.pageX;
                that.$splitter.addClass("layout-drag-splitter-dragging");
            },
            drag: function (e) { },
            stop: function (e) {
                var w = e.pageX-5,
                    collapse = false;

                if (w <= that.minWidth) {
                    w = that.oldWidth;
                    collapse = true;
                }

                if (w >= that.maxWidth) {
                    w = that.maxWidth;
                }

                that.$obj.width(w);
                that.oldWidth = w;

                //that.$splitter.removeClass( "layout-drag-splitter-dragging" ).css( { "left": w, "opacity": .7 } );
                that.$splitter.removeClass("layout-drag-splitter-dragging").css({ "left": w });  //为了支持ie8，删除透明
                that.widthCallback(w, that.anchor);

                if (collapse)     // 若小于最小尺寸，则自动收起。
                {
                    that.collapse();
                }
            }
        });
    }



    /**
     * 更新菜单
     * 
     * @param vm    {object} 数据模型
     */
    fn.refresh = function (vm) {
        if (!SilverPage.$body.hasClass("theme-top-level-menu") && !this.refreshRunning) {
            this.refreshRunning = true;

            // 重设主菜单
            var mainMenu = this.$menus.children(".main-menu"),
                mainMenuSelectedId = mainMenu.children("li.menu-selected").attr("data-id"),
                newMainMenu = $(this.buildMainMenuContent(vm));
            mainMenu.attr("data-menus-count", newMainMenu.attr("data-menus-count")).empty().append(newMainMenu.children());

            //var mainMenuSelectedItem = mainMenu.children("li[data-id=" + mainMenuSelectedId + "]").addClass("menu-selected");
            var mainMenuSelectedItem = mainMenu.children("li[data-id=" + mainMenuSelectedId + "]");

            var subMainItems = this.$menus.find(".sub-menu-" + mainMenuSelectedId + ":visible > ul");

            // 记录当前二级菜单的位置
            var pos = subMainItems.data("scroll-top") || subMainItems.scrollTop();
            var subMainSelectedId = subMainItems.children(".menu-selected").attr("data-id");

            // 删除所有二级菜单
            this.$menus.children(".sub-menu").remove();

            if (subMainItems.length) {
                // 显示选中的二级菜单
                this.showSubMenu(mainMenuSelectedItem, function (ul) {
                    // 显示选中的三级菜单
                    ul.children("[data-id=" + subMainSelectedId + "]").addClass("disable-animate-once").trigger("click");

                    ul.data("scroll-top", pos);
                });
            }

            this.refreshRunning = false;
        }
    }

    /**
     * 查询菜单栏是否存在显示的菜单
     */
    fn.hasMenu = function () {
        return this.$menus.children().length > 0;
    }

    /**
     * 显示一级主菜单
     */
    fn.showMainMenu = function () {
        var that = this;

        // 收起所有正在显示的子菜单 (若有)
        this.collapseMenu(this.$menus.find(".sub-menu:visible"));

        // 动画展示主菜单
        this.animateExpandMenu(".main-menu", ".main-menu", "li", function () {
            var main = that.$menus.find(".main-menu");

            // 恢复到上一次显示滚动条的位置
            main.animate({ scrollTop: main.data("scroll-top") || 0 }, 100, "swing");
        });
    }

    /**
     * 显示二级菜单
     * 
     * @param mainmenu  {$} 二级菜单对应的一级菜单项
     * @param finished  {boolean} 完成展示动画的回调
     */
    fn.showSubMenu = function (mainmenu, finished) {
        var id = mainmenu.attr("data-id"),
            submenu = this.$menus.find("div.sub-menu-" + id);

        this.currentMainMenu = mainmenu;

        this.$obj.closest("#frame-main").removeClass("theme-top-level-main");

        if (submenu.length === 0 || this.isPureTopLayout)     // 若没有发现该一级菜单有二级菜单
        {
            this.buildSubMenu(id);    // 则尝试创建
            submenu = this.$menus.find("div.sub-menu-" + id);
        }

        if (submenu.length > 0) {
            // 收起一级菜单
            //this.collapseMenu(".main-menu");

            this.expand(mainmenu);

            //$(".sub-menu").hide();
            //$(".sub-menu").slideUp();
            //submenu.slideDown();
           

            if (!this.isPureTopLayout) {
                // 动画展示二级菜单
                //this.animateExpandMenu(submenu, "> ul", "li", function () {
                //    var menuBox = submenu.children("ul");

                //    if (typeof finished === "function") {
                //        finished(menuBox);
                //    }

                //    // 恢复到上一次显示滚动条的位置
                //    menuBox.animate({ scrollTop: menuBox.data("scroll-top") || 0 }, 100, "swing");
                //});

                if (submenu.is(":visible")) {
                    submenu.slideUp(100);
                    submenu.parent("li").removeClass("menu-selected");
                } else {
                    $(".sub-menu").slideUp(100);
                    submenu.slideDown(210, function () {
                        //保证当前点击的项不被遮住
                        var clickTarget = submenu.parent("li.menu-selected");
                        var m = submenu.parents(".main-menu");
                        if (clickTarget.length) {
                            var p = clickTarget.position().top,
                                h = clickTarget.height(),
                                ah = m.height();
                            if (p < 1) {
                                m.stop().animate({ scrollTop: m.scrollTop() + p });
                            } else if (p + h > ah) {
                                m.stop().animate({ scrollTop: m.scrollTop() + ((h - ah) > 0 ? p : (h + p - ah)) })
                            }
                        }
                    });
                }
                var menuBox = submenu.children("ul");

                if (typeof finished === "function") {
                    finished(menuBox);
                }

                // 恢复到上一次显示滚动条的位置
                menuBox.animate({ scrollTop: menuBox.data("scroll-top") || 0 }, 100, "swing");

            } 
        } else {
            $(".sub-menu").slideUp();
        }
        
    }

    /**
     * 显示三级菜单
     * 
     * @param menu              {$} 三级菜单对应的二级菜单项
     * @param disableAnimate    {boolean} 是否禁用动画
     */
    fn.showThirdMenu = function (menu, disableAnimate) {
        this.showSlideMenu(menu, ".third-menu", "expand-third-menu", "buildThirdMenu", disableAnimate);
    }

    /**
     * 显示四级菜单
     * 
     * @param menu  {$} 四级菜单对应的三级菜单项
     * @param disableAnimate    {boolean} 是否禁用动画
     */
    fn.showOtherMenu = function (menu, disableAnimate) {
        this.showSlideMenu(menu, ".other-menu", "expand-other-menu", "buildOtherMenu", disableAnimate);
    }

    /**
     * 显示菜单树的菜单
     * 
     * @param menu  {$} 指定的上一级(父级)菜单项
     */
    fn.showDynamicTreeListNode = function (menu) {
        var subMenu = menu.children(".dynamic-tree-list");

        if (subMenu.length > 0) {
            if (subMenu.css("display") === "none") {
                menu.addClass("expand-sub-menu");
                //.siblings( ".expand-sub-menu" )
                //.removeClass( "expand-sub-menu" )
                //    .children( ".dynamic-tree-list" )
                //    .slideUp( 200 );

                subMenu.slideDown(210, function () {
                    //保证当前点击的项不被遮住
                    var clickTarget = menu;
                    var m = menu.parents(".main-menu");
                    if (clickTarget.length) {
                        var p = clickTarget.position().top,
                            h = clickTarget.height(),
                            ah = m.height();
                        if (p < 1) {
                            m.stop().animate({ scrollTop: m.scrollTop() + p });
                        } else if (p + h > ah) {
                            m.stop().animate({ scrollTop: m.scrollTop() + ((h - ah) > 0 ? p : (h + p - ah + 15)) })
                        }
                    }
                });
            } else {
                menu.removeClass("expand-sub-menu");
                subMenu.slideUp(210);
            }
        }
    }

    /**
     * 显示指定菜单，通过从上到下动画滑动展示
     * 
     * @param menu                  {$} 指定的上一级(父级)菜单项
     * @param subMenuClass          {string} 指定的子级菜单选择器
     * @param subMenuExpandClass    {string} 当子级菜单项展开时附加到该菜单项的CSS类
     * @param buildFunc             {function} 当子菜单不存在时调用的创建菜单函数
     * @param disableAnimate        {boolean} 是否禁用动画
     */
    fn.showSlideMenu = function (menu, subMenuClass, subMenuExpandClass, buildFunc, disableAnimate) {
        var subMenu = menu.next(subMenuClass);

        if (subMenu.length === 0) {
            this[buildFunc](menu);
            subMenu = menu.next(subMenuClass);
        }

        if (subMenu.length > 0) {
            if (subMenu.css("display") === "none") {
                menu.addClass(subMenuExpandClass)     // 二级菜单添加展开样式
                        .siblings()         // 而其兄弟
                        .removeClass(subMenuExpandClass)  // 全部移除展开样式
                            .next(subMenuClass)   // 兄弟的子菜单
                            .slideUp(200)     // 全部收起
                                .find(".menu-selected")   // 兄弟所有被选中的菜单
                                    .removeClass("menu-selected");    // 全部设为不选中

                subMenu.slideDown(disableAnimate ? 0 : 220, function () {
                    //var p = menu.position().top;
                    //if (p < 1) {
                    //    var m = subMenu.parents(".main-menu");

                    //    m.animate({ scrollTop: m.scrollTop() + p });
                    //}
                    //保证当前点击的项不被遮住
                    var m = menu.parents(".main-menu");
                    if (menu.length) {
                        var p = menu.position().top,
                            h = menu.height() + subMenu.height(),
                            ah = m.height();
                        if (p < 1) {
                            m.stop().animate({ scrollTop: m.scrollTop() + p });
                        } else if (p + h > ah) {
                            m.stop().animate({ scrollTop: m.scrollTop() + ((h - ah) > 0 ? p : (h + p - ah + 15)) })
                        }
                    }
                });
            } else {
                menu.removeClass(subMenuExpandClass).removeClass("menu-selected");
                subMenu.slideUp(200);
            }
        } else {
            var p = menu.position().top;
            if (p < 1) {
                var m = subMenu.parents(".main-menu");

                m.stop().animate({ scrollTop: m.scrollTop() + p });
            }
        }
    }

    /**
     * 自动收起导航菜单栏，需要自动收起的情况是：菜单栏设置为浮动(非锚定)，并且当前是展开状态。
     */
    fn.autoCollapse = function () {
        if (!this.anchor && !this.isCollapsed) {
            this.collapse();
        }
    }

    /**
     * 展开导航菜单栏
     */
    fn.expand = function (mainmenu, finished) {
        if (this.isPureTopLayout) {
            var ww = SilverPage.$win.width(),
                $sub = this.$obj.find(".menus-bar .sub-menu"),
                ml = mainmenu.offset().left,
                mw = mainmenu.width(),
                sw = $sub.width();

            if (sw + ml <= ww) {
                $sub.css({ left: mainmenu.offset().left, right: "auto" });
            } else {
                $sub.css({ left: "auto", right: ww - ml - mw - 26 });
            }

            $sub.slideDown(300, function () {
                if (typeof finished === "function") {
                    finished.call(that);
                }
            });

            this.$obj.css({ left: 0 }).show();
        }

        if (this.isCollapsed) {
            var that = this;

            this.isCollapsed = false;

            that.widthCallback(that.oldWidth, that.anchor);

            if (!this.isPureTopLayout) {
                this.$obj.animate({ left: 0 }, 200, "swing", function () {
                    that.$splitter.css({
                        left: that.oldWidth
                    }).show();

                    if (typeof finished === "function") {
                        finished.call(that);
                    }
                });
            }
            setTimeout(function(){
                that.searchMenu.$input.focus()
            },100) ;
        }
    }

    /**
     * 收起导航菜单栏
     * 
     * @param delay     {number} 延迟执行动画时间
     */
    fn.collapse = function (delay) {
        delay = delay || 0;

        if (!this.isCollapsed) {
            var that = this;

            this.isCollapsed = true;

            this.$splitter.hide();

            if (!that.isPureTopLayout) {
                this.$obj.stop().delay(delay).animate({ left: -(this.$obj.width() + 2) }, 200, "swing", function () {
                    that.widthCallback(0, that.anchor);
                });
            }
            else {
                //this.$obj.css( { left: -( this.$obj.width() + 2 ) } );
                this.$obj.find(".menus-bar .sub-menu").slideUp(300, function () {
                    that.$obj.hide();
                    that.widthCallback(0, that.anchor);
                });
            }
        }
    }

    /**
     * 展开菜单(动画，菜单项从左向右滑动)
     * 
     * @param menuSelector      {$/string}  指定菜单(仅用于一级或二级菜单)
     * @param boxSelector       {$/string}  指定应用动画的菜单外框，内部的所有子项将被动画展示
     * @param menuItemSelector  {string}    指定子项选择器
     * @param callback          {function}  所有动画执行完毕后执行的回调函数
     */
    fn.animateExpandMenu = function (menuSelector, boxSelector, menuItemSelector, callback) {
        //var menu = ((menuSelector instanceof $) ? menuSelector : this.$menus.find(menuSelector)).hide(),
        //    box = (menuSelector === boxSelector) ? menu : ((boxSelector instanceof $) ? boxSelector : menu.find(boxSelector)),
        //    items = box.children(menuItemSelector),
        //    len = items.length,
        //    width = menu.width(),
        //    step = Math.floor(width / len),
        //    loop = step,
        //    count = 0,
        //    total = (1 + len) / 2 * len,
        //    that = this;

        //items.each(function (i, e) {
        //    $(e).css({ marginLeft: -loop });
        //    loop += step;
        //});

        //menu.css({ marginLeft: 0 }).fadeIn(500);

        //items.each(function (i, e) {
        //    var index = i + 1;

        //    if (!that.isPureTopLayout) {
        //        $(e).animate({ marginLeft: 0 }, (index + 1) * (50 - i), "swing", function () {
        //            count += index;

        //            if (count >= total && typeof callback === "function") {
        //                callback();
        //            }
        //        });
        //    } else {
        //        $(e).css({ marginLeft: 0 });

        //        count += index;

        //        if (count >= total && typeof callback === "function") {
        //            callback();
        //        }
        //    }
        //});
        var menu = ((menuSelector instanceof $) ? menuSelector : this.$menus.find(menuSelector));
        menu.slideDown();

    }

    /**
     * 收起菜单(动画)
     * 
     * @param menuSelector  {$/string}  指定菜单(仅用于一级或二级菜单)
     */
    fn.animateCollapseMenu = function (menuSelector) {
        var menu = this.$menus.find(menuSelector);
        menu.slideUp();
        //if (!this.isPureTopLayout) {
        //    menu.animate({ marginLeft: -menu.width() }, 300, "swing").fadeOut(300);
        //} else {
        //    menu.css({ marginLeft: -menu.width() });
        //}
    }

    /**
     * 收起菜单(无动画)
     * 
     * @param menuSelector  {$/string}  指定菜单(仅用于一级或二级菜单)
     */
    fn.collapseMenu = function (menuSelector) {
        var menu = (menuSelector instanceof $) ? menuSelector : this.$menus.find(menuSelector);
        //menu.hide().css("height","0");
        //menu.hide().css({ marginLeft: -menu.width() });
    }

    /**
     * 填充视图模型数据到导航菜单栏
     * 
     * @param vm        {object} 视图模型数据
     */
    fn.fill = function (vm) {
        if (vm.Data.MenuMod) {
            this.fillMenus(vm);
        }
    }
   
   

    /**
     * 填充菜单项，仅创建一级菜单
     * 
     * @param vm        {object} 视图模型数据
     */
    fn.fillMenus = function (vm) {
        this.vm = vm;

        this.buildMainMenu(vm);
        this.animateExpandMenu(".main-menu", ".main-menu", "li");
        //搜索菜单初始化
        this.searchMenu.init(vm)
    }

    /**
     * 生成菜单目标地址
     * 
     * 如果是第一级且有url：地址为：url+ "&IDM_ID=" + 菜单ID，且展开子菜单；
     * 如果是最后一级且有url：地址为：url+ "&IDM_ID=" + 菜单ID；
     * 如果linkway为1：地址为："Home/VTab2.aspx?&ModID=" + 菜单ID。
     * 
     * @param url           {string} 指定的URL
     * @param id            {string} 当前菜单ID
     * @param linkway       {string} linkway
     * @param hasChildren   {boolean} 是否存在下一级菜单
     * @param isMainMenu    {boolean} 是否为一级主菜单
     */
    fn.generateTargetUrl = function (url, id, linkway, hasChildren, isMainMenu) {
        var target = ' target="{url}"',
            result = "";

        do {
            if (!url || url.length === 0) {
                break;
            }

            if (url.match(/^\s*javascript\:(.*)$/i))  // 若是脚本
            {
                result = target.replace("{url}", url);
                break;
            }

            if (linkway === "1")     // linkway 为 1 的情况
            {
                result = target.replace("{url}", "Home/VTab.aspx?&ModID=" + id);
                break;
            }

            if (isMainMenu || !hasChildren) {
                result = target.replace("{url}", url + (url.indexOf("?") === -1 ? "?" : "&") + "IDM_ID=" + id);
            }

        } while (false)

        return result;
    }

    /**
     * 创建一级主菜单内容
     * 
     * @param vm    {object} 菜单数据
     */
    fn.buildMainMenuContent = function (vm) {
        var menus = vm.Data.MenuMod,
            //format = '<li data-id="{id}" data-ico="{ico}" data-linkway="{linkway}"{target}>{name}</li>',
            //settingFormat = '<li class="setting-center" data-id="{id}" data-ico="{ico}" data-linkway="{linkway}"{target}><span class="i-setting-center">{name}</span></li>',
            settingFormat = '<li data-id="{id}" data-ico="{ico}" data-linkway="{linkway}"{target}><div class="item-box"><i class="i-item" style="{ico}"></i>{name}{collapsestatus}</div></li>',
            target = ' target="{url}&IDM_ID={id}"',
            result = [],
            that = this,
            menuname = "";

        if (SilverPage.$body.hasClass("theme-top-level-menu")) {
            result.push(
                settingFormat.replace(/\{ico\}/g, "")
                          .replace(/\{linkway\}/g, "-1")
                          .replace(/\{target\}/g, that.generateTargetUrl(vm.Data.HomePage || "", "", "", false, true))
                          .replace(/\{name\}/g, "首页")
                          .replace(/\{collapsestatus\}/g, "<i class='collapse-status'><i>")
                          .replace(/\{id\}/g, "")
            );
        }

        $(menus).each(function (i, e) {
            menuname = e["name"] || "";

            result.push(
             settingFormat.replace(/\{ico\}/g, e["ico"] ? "background-image:url(" + e["ico"] + ")" : "")
                          .replace(/\{linkway\}/g, e["linkway"] || "")
                          .replace(/\{target\}/g, that.generateTargetUrl(e["url"], e["id"] || "", e["linkway"] || "", e.children && e.children.length > 0, true))
                          .replace(/\{name\}/g, menuname)
                          .replace(/\{collapsestatus\}/g, (e.children && e.children.length > 0 ? "<i class='collapse-status'></i>" : ""))
                          .replace(/\{id\}/g, e["id"] || "")
                );
        });

        return '<ul class="main-menu" data-menus-count="' + menus.length + '">' + result.join("") + '</ul>';
    }

    /**
     * 创建一级主菜单
     * 
     * @param vm    {object} 菜单数据
     */
    fn.buildMainMenu = function (vm) {
        if (!SilverPage.$body.hasClass("theme-top-level-menu")) {
            this.$menus.append(this.buildMainMenuContent(vm));
        }
    }

    /**
     * 创建二级菜单
     * 
     * @param menuId    {string} 二级菜单的上一级菜单的 id
     */
    fn.buildSubMenu = function (menuId) {

        var menus = (this.saveData ? this.saveData.Data.MenuMod : this.vm.Data.MenuMod),
            format = '<li data-id="{id}" class="{class}" data-ico="{ico}" data-linkway="{linkway}"{target}><div>{icobox}{name}</div></li>',
            target = ' target="{url}"',
            that = this;

        $(menus).each(function (i, m) {
            if (m && m.children && m.children.length > 0 && m.id === menuId) {
                var result = [],
                    id = "";

                that.$menus.find("> div.sub-menu-" + menuId).remove();

                $(m.children).each(function (i, e) {
                    var hasChild = e.children && e.children.length;

                    id = e["id"] || "";

                    if (hasChild && id) {
                        // 缓存三级菜单，便于在点击二级菜单时快速查找。
                        that.allThirdMenuData[id] = e.children;
                    }

                    result.push(
                            format.replace(/\{id\}/g, id)
                                  .replace(/\{ico\}/g, e["ico"] || "")
                                  .replace(/\{linkway\}/g, e["linkway"] || "")
                                  .replace(/\{icobox\}/g,"<i class='second-ico'></i>")
                                  .replace(/\{target\}/g, that.generateTargetUrl(e["url"], id, e["linkway"] || "", hasChild, false))
                                  .replace(/\{name\}/g, e["name"] || "")
                                  .replace(/\{class\}/g, hasChild ? "has-third-menu" : "")
                        );
                });

                that.$menus.find(".menu-selected").append(
                                '<div class="sub-menu sub-menu-' + (m["id"] || "") + '" data-menus-count="' + m.children.length + '">' +
                                //'   <div class="sub-menu-header" title="返回上一级">' +
                                //'       <span class="menu-name">' + (m["name"] || "") + '</span>' +
                                //'   </div>' +
                                '   <ul>' +
                                        result.join("") +
                                '   </ul>' +
                                '</div>'
                    );

                return;
            }
        });
    }

    /**
     * 创建三级菜单
     * 
     * @param subMenu   {$} 二级菜单对象
     */
    fn.buildThirdMenu = function (subMenu) {
        var menus = this.allThirdMenuData[subMenu.attr("data-id")],
            format = '<li data-id="{id}" class="{class}" data-ico="{ico}" data-linkway="{linkway}"{target}><i class="third-ico"></i>{name}</li>',
            target = ' target="{url}"',
            that = this,
            result = $('<ul></ul>');

        if (menus && menus.length > 0) {
            $(menus).each(function (i, e) {
                var hasChild = e.children && e.children.length;

                result.append(
                        $(
                            format.replace(/\{id\}/g, e["id"] || "")
                                  .replace(/\{ico\}/g, e["ico"] || "")
                                  .replace(/\{linkway\}/g, e["linkway"] || "")
                                  .replace(/\{target\}/g, that.generateTargetUrl(e["url"], e["id"], e["linkway"] || "", hasChild, false))
                                  .replace(/\{name\}/g, e["name"] || "")
                                  .replace(/\{class\}/g, hasChild ? "has-other-menu" : "")
                        ).data("menu-children", e.children)       // 缓存子级菜单
                    );
            });

            subMenu.after($('<li class="third-menu" style="display: none;"></li>').append(result));
        }
    }

    /**
     * 创建四级菜单（包含所有四级以下的子级菜单）
     */
    fn.buildOtherMenu = function (otherMenu) {
        otherMenu.after(
            $('<li class="other-menu" style="display: none;"></li>').append(
                this.buildDynamicTreeNode(
                    otherMenu.data("menu-children")
                )
            )
        );
    }

    /**
     * 创建四级及以下的其他级别的菜单（递归结果为树形）
     * 
     * @param menus     {array} 菜单项数组
     */
    fn.buildDynamicTreeNode = function (menus) {
        var format = '<li data-id="{id}" class="{class}" data-ico="{ico}" data-linkway="{linkway}"{target}><span>{name}</span>{submenu}</li>',
            target = ' target="{url}"',
            result = [],
            that = this;

        if (menus && menus.length > 0) {
            $(menus).each(function (i, e) {
                var hasChild = e.children && e.children.length;

                result.push(
                                format.replace(/\{id\}/g, e["id"] || "")
                                      .replace(/\{ico\}/g, e["ico"] || "")
                                      .replace(/\{linkway\}/g, e["linkway"] || "")
                                      .replace(/\{target\}/g, that.generateTargetUrl(e["url"], e["id"], e["linkway"] || "", hasChild, false))
                                      .replace(/\{name\}/g, e["name"] || "")
                                      .replace(/\{class\}/g, hasChild ? "has-sub-menu" : "")
                                      .replace(/\{submenu\}/g, hasChild ? that.buildDynamicTreeNode(e.children) : "")
                    );
            });

            return '<ul class="dynamic-tree-list">' + result.join("") + '</ul>';
        } else {
            return "";
        }
    }

    return menuSilder;
}());

/**
 * 表示主内容框架区域
 * 
 * 默认加载指定的首页，当左侧的导航菜单栏中的菜单被点击时，加载指定页面。
 */
SilverPage.ContentFrame = (function () {
    function contentFrame() {
        this.$box = $("#frame-main .frame-content-box");
        this.$obj = this.$box.find("#frame-content");

        this.$page = null;      // 表示框架的 HTML 内容

        this.$contentLoadingCover = $(".frame-content-loading-cover");
        this.$contentLoadingCoverCopy = $(".frame-content-loading-cover-copy");

        this.isPureTopLayout = this.$obj.closest(".pure-top-layout").length > 0;

        // 主内容框架加载页面完毕的事件，目的是提供给外部重写这个函数
        // 参数 page {$} 为主内容框架的页面 HTML 元素
        this.load = function (page) { };

        this.init();
    }

    var fn = contentFrame.prototype;

    /**
     * 初始化主内容框架
     */
    fn.init = function () {
        var that = this;

        this.$obj.on("load", function () {
            that.$contentLoadingCover.hide();
            that.$contentLoadingCoverCopy.hide();

            that.$page = that.$obj.contents();
            that.load(that.$page);
        });
    }

    /**
     * 重定向主内容框架地址
     * 
     * @param url   {string} 指定重定向位置
     */
    fn.direct = function (url) {
        //if ( this.$obj.data( "currLink" ) !== url )
        //{
            this.$box = $("#frame-main .frame-content-box");
            this.$contentLoadingCover.css(this.$box.offset()).show();
            this.$contentLoadingCoverCopy.css(this.$box.offset()).show();
            this.$obj.data("currLink", url);

            this.$obj.attr("src", "").attr("src", url);
        //}
    }

    /**
     * 适应页面宽度，
     * 当左侧的导航菜单尺寸发生变化时，主内容框架的宽度需要跟随变化。
     * 
     * @param width {number} 指定适应的宽度
     */
    fn.adjustWidth = function (width) {
        //if (width === 0) {
        //    width = 0;     // 最小宽度为 30px
        //}

        width = this.isPureTopLayout ? 0 : width + 1;

        this.$box.css({ marginLeft: width });

        if (this.$contentLoadingCover.css("display") !== "none") {
            this.$contentLoadingCover.css(this.$box.offset());
            this.$contentLoadingCoverCopy.css(this.$box.offset()).show();
        }
    }

    /**
     * 填充主内容框架的数据
     * 
     * @param vm    {object} 视图模型数据
     */
    fn.fill = function (vm) {
        if (vm.Data.HomePage) {
            this.direct("../" + vm.Data.HomePage);
        }
    }

    return contentFrame;
}());

/**
 * 表示顶部框架
 */
SilverPage.TopFrame = (function () {
    function top() {
        this.$obj = $("#frame-top");

        this.$topPage = null;   // 顶部框架页面
        this.$logo = null;      // LOGO 图片

        this.$topping = null;
        this.$topBox = null;
        this.$funcbar = null;

        this.doExpand = null;   // 执行展开顶部 (提供给外部的回调，目的是给外部有机会做一些其他处理)
        this.doFold = null;     // 执行折叠顶部 (提供给外部的回调)
        this.doPageLoad = null; // 页面加载完毕

        this.minHeight = 57;    // 顶部最小高度
        this.height = this.minHeight;

        this.vm = null;
    }

    var fn = top.prototype;

    fn.checkScroll = function () {
        //增加对象是否存在的判断 肖勇彬 2015-09-10
        var m = this.$topLeveMenuBox && this.$topLeveMenuBox.find(".main-menu");

        if (m && m.length) {
            var left = m.scrollLeft(), leftX = 0;

            m.scrollLeft(100000);

            leftX = m.scrollLeft();

            m.scrollLeft(left);

            if (leftX > 0) {
                if (left === 0) {
                    this.$rollLeft.fadeOut(0);
                } else {
                    this.$rollLeft.fadeIn(0);
                }

                if (left === leftX) {
                    this.$rollRight.fadeOut(0);
                } else {
                    this.$rollRight.fadeIn(0);
                }
            } else {
                this.$rollLeft.hide();
                this.$rollRight.hide();
            }
        }
    }

    /**
     * 初始化顶部框架
     * 
     * @param expand    {function} 展开顶部框架时的回调函数
     * @param fold      {function} 折叠顶部框架时的回调函数
     * @param pageLoad  {function} 顶部框架页面加载完毕后的回调函数
     */
    fn.init = function (expand, fold, pageLoad, getMainMenu, showMenu) {
        var that = this;

        this.doExpand = expand || function () { };
        this.doFold = fold || function () { };
        this.doPageLoad = pageLoad || function () { };
        this.showMenu = showMenu || function () { };
        this.getMainMenu = getMainMenu || function () { return "" };

        // 绑定顶部页面的加载事件
        this.$obj.on("load", function () {
            // 获取顶部框架的 HTML
            that.$topPage = that.$obj.contents();

            that.$topping = that.$topPage.find("#topping");
            that.$topBox = that.$topping.find(".function-box");
            that.$funcbar = that.$topping.find(".function-bar");
            that.$topLeveMenu = that.$topping.find(".top-level-menu");

            that.$rollLeft = that.$topLeveMenu.find(".menu-roll-left");
            that.$rollRight = that.$topLeveMenu.find(".menu-roll-right");

            that.$topLeveMenuBox = that.$topLeveMenu.find(".top-level-menu-wrapper");

            // 获取 LOGO 图片元素
            that.$logo = that.$topping.find(".logo");

            that.$rollLeft.on("click", function () {
                var m = that.$topLeveMenuBox.find(".main-menu");

                m.animate({ scrollLeft: "-=150px" }, function () {
                    that.checkScroll();
                });
            });

            that.$rollRight.on("click", function () {
                var m = that.$topLeveMenuBox.find(".main-menu");

                m.animate({ scrollLeft: "+=150px" }, function () {
                    that.checkScroll();
                });
            });

            // 当图片加载完毕后，开始调整顶部框架的高度，以便外部（如主内容框架）自适应这个高度
            that.$logo.on("load", function () {
                var h = that.$logo.height();    // 获得图片的高度
                // 若小于最小高度，则使用最小高度，否则按LOGO图片高度撑高
                that.height = h < this.minHeight ? this.minHeight : h;

                if (that.$topLeveMenu.length > 0) {
                    that.height += that.$topLeveMenu.height();
                }

                that.expand();  // 展开顶部框架
            }).parent("a").on("click", function () {
                $("#frame-main").find(".home-menu").children("a").click();
                return false;
            });

            // 当点击顶部框架的 <收起顶部> 按钮
            that.$topPage.find("#hide-top-bar").on("click", function () {
                that.fold();    // 执行顶部折叠
            });

            that.$topLeveMenu.on("click", "li", function () {
                var me = $(this);

                me.addClass("sel").siblings("li").removeClass("sel");

                that.showMenu(me);
            });

            that.tryfill();

            that.doPageLoad(that);
        });

        this.$obj.attr("src", this.$obj.attr("kd-href"));

        SilverPage.$win.on("resize", function () {
            that.checkScroll();
        });
    };

    /**
     * 在加载时尝试填充数据
     * 
     * 通过轮询 vm 是否存在，若存在则开始填充。
     * vm 直到视图模型加载完毕才真正存在。
     */
    fn.tryfill = function () {
        var that = this,
            vm = this.vm;

        if (this.vm === null) {
            setTimeout(function () {
                that.tryfill();
            }, 0);
        } else {

            if (vm.Data.UserInfo) {
                //SilverPage.MenuSilder.prototype.fillUserInfo.call(SilverPage.MenuSilder,vm);
                this.fillUserInfo(vm);
            }

            var format = '<a href="{url}" data-url-id="{urlid}" class="normal-menu{hasChildren}"{target}>{ico}{urlname}{dropDownArrow}</a>{children}',
                phoneFormat = '<a href="{url}" data-url-id="{urlid}" class="normal-menu{hasChildren} phoneType"{target}>{dropDownArrow}</a>{children}',
                icoFormat = '<img src="..{ico}" alt="" /> ';

            // 指定 LOGO 图片
            if (vm.Data.LogoImage === "Image/Logo/eap-logo.png") {
                this.$logo.attr("src", "../Image/Logo/eap-new-logo.png")
            } else {
                this.$logo.attr("src", "../" + vm.Data.LogoImage)
            };


            // 生成默认菜单
            //if (!SilverPage.$body.hasClass("theme-top-level-menu")) {
            //    that.$funcbar.append('<a href="javascript: void 0" data-main-target="' + vm.Data.HomePage + '" class="system-menu go-main-page">首页</a>');
            //}
            var homeButton = SilverPage.$body.find(".operate-area").find(".go-main-page");
            if (!homeButton.length) {
                SilverPage.$body.find(".operate-area").append('<li class="home-menu"><i></i><a href="javascript: void 0" data-main-target="' + vm.Data.HomePage + '" class="system-menu go-main-page"></a></li>')
            }
            
            that.$funcbar.prepend('<a href="javascript: void 0" class="system-menu show-wait-working"><i></i></a>');
            
            //计算适合的宽度
            var tempTarget = SilverPage.$body.find(".operate-area");
            tempTarget.addClass("class-" + (tempTarget.children("li").length - 1));

            // 生成顶部菜单列表
            if (vm.Data.LogoLinks && vm.Data.LogoLinks.length > 0) {
                $(vm.Data.LogoLinks).each(function (i, elem) {
                    var hasChildren = elem["children"] && elem["children"].length > 0,
                        url = elem["url"] || "";
                        //thatApplendTarget = that.$funcbar,
                        //appendStatus = thatApplendTarget.find(".normal-menu.phoneType").length,
                        //appendType;

                    //保证手机版是最后一个显示
                    //if (appendStatus) {
                    //    thatApplendTarget = thatApplendTarget.find(".normal-menu.phoneType");
                    //    appendType = "before";
                    //} else {
                    //    thatApplendTarget = that.$funcbar;
                    //    appendType = "append";
                    //}

                        //thatApplendTarget[appendType](
                    //(elem["urlname"] == "手机版" ? phoneFormat : format) 

                    that.$funcbar.find(".user-info").before(
                        (elem["urlname"] == "手机版" ? phoneFormat : format)
                                      .replace(/\{url\}/g, url || "javascript: void 0")
                                      .replace(/\{urlid\}/g, elem["urlid"] || "")
                                      .replace(/\{urlname\}/g, elem["urlname"] || "")
                                      .replace(/\{ico\}/g, elem["ico"] && elem["ico"].length > 0 ? icoFormat.replace(/\{ico\}/g, elem["ico"]) : "")
                                      .replace(/\{hasChildren\}/g, hasChildren ? " has-children" : "")
                                      .replace(/\{dropDownArrow\}/g, hasChildren ? "<em></em>" : "")
                                      .replace(/\{target\}/g, url.match(/^\s*javascript\:.*/) || hasChildren ? "" : ' target="_blank"')
                                      .replace(/\{children\}/g, hasChildren ? '<div class="submenu shortcut-menu" data-menu-id="' + elem["urlid"] + '">' + that.buildChildrenMenu(elem["children"]) + '</div>' : "")
                                      //.replace(/\{children\}/g,"")
                        );
                });

            }

            // 生成默认菜单
            //that.$funcbar.append('<a href="javascript: void 0" class="system-menu show-online-counter">在线人数 <i>(0)</i></a>');
            //that.$funcbar.append('<a href="javascript: void 0" class="system-menu go-exit">退出</a>');

            //插入用户区域容器
            //that.$funcbar.find(".normal-menu.phoneType").before('<div class="user-info">'
            //        + '<a class="profile-setting" href="javascript: showSetting()" title="点击查看个人设置">'
            //            +'<img src="" alt="" />'
            //        +'</a>'
            //        +'<dl class="user-role-box">'
            //            +'<dt class="user-name"></dt>'
            //            +'<dd class="user-role"></dd>'
            //        +'</dl>'
            //    +'</div>')


           // that.$funcbar.append('<a href="javascript: void 0" class="system-menu user-info"></a>');
            that.$topPage.find("#spAdmin").appendTo(that.$funcbar);
            // 触发菜单加载完成事件
            SilverPage.$body.trigger("menuload");

            if (typeof that.getMainMenu === "function") {
                $(that.getMainMenu(that.vm)).appendTo(that.$topLeveMenu.children(".top-level-menu-wrapper"));
                that.checkScroll();
            }

            this.$topBox.fadeIn(500);
        }
    }

  /**
   * 填充用户基本信息
   * 
   * @param vm    {object} 视图模型数据
   */
    fn.fillUserInfo = function (vm) {
        var u = vm.Data.UserInfo,
            target = $("#frame-main .duck-menu-silder").find(".refresh-menu");

        if (vm.Data.IsIdeaAdmin === 'Y' && target.length > 0) {
            target.show();
        } else {
            target.parent().addClass("not-admin")
            target.remove();
        }

        //插入用户基本信息显示容器
        var userContainer = $("#frame-top").contents().find("#topping .function-bar");
        if (!userContainer.find(".user-info").length) {
            userContainer.append('<div class="user-info normal-menu has-children" data-url-id="user-operate-list-box">'
                    + '<a class="profile-setting"></a>'
                    + '<img src="" alt="" />'
                    + '<dl class="user-role-box">'
                        + '<dt class="user-name"></dt>'
                        + '<dd class="user-role"></dd>'
                    + '</dl>'
                    + '<div class="submenu shortcut-menu" data-menu-id="user-operate-list-box">'
                        + '<ul class="user-operate-list">'
                            + '<li class="system-menu person-setting">'
                                + '<a href="javascript: showSetting()"><em></em>个人设置</a>'
                            +'</li>'
                            +'<li class="system-menu show-online-counter">'
                                +'<em></em>在线人数'
                                + '<i></i>'
                            +'</li>'
                            +'<li class="system-menu go-exit">'
                                + '<em></em>退出'
                            +'</li>'
                        + '</ul>'
                    + '</div>'
                + '</div>')
        }


        this.$user = userContainer.find(".user-info");
        this.$user.find("img").on("error", function () {
            $(this).attr("src", "../css/App_Themes/Silver/img/user-head.png");
        }).on("load", function () {
            /**#region by zm **/
            var $this = $(this),
                h = $this.height();

            if ($this.width() !== h) {
                $this.css({ "top": (-(h - 60) / 2) });
            }
        	/**#endregion by zm**/
       
            	//$this.attr("src", "../" + u.HeadImg + "?x=" + setTimeout(" ", 0));
        });

        var timer = setInterval(function ()
        {
        	//console.log(userContainer.find(".user-info img")[0].complete)
        	if (userContainer.find(".user-info img")[0].complete)
        	{
        		clearInterval(timer)
        		userContainer.find(".user-info img").attr("src", "../" + u.HeadImg + "?x=" + setTimeout(" ", 0));
        	}
        }, 80)

        this.$user.find(".user-name").html("欢迎您，" + (u.EmployeeName || "<未知用户>") + "<em></em>");
        //this.$user.find( ".user-role" ).text( u.DefaultStationName || "<未知角色>" );

        this.$user.show();
    }


    /**
     * 创建子菜单
     * 
     * @param submenu   {array} 指定子菜单
     */
    fn.buildChildrenMenu = function (submenu) {
        var result = "",
            format = '<li{ico}><a href="{url}" data-url-id="{urlid}" class="normal-sub-menu{hasChildren}"{target}>{urlname}{arrow}</a>{children}</li>',
            that = this,
            noIcos = "";

        if (submenu && submenu.length > 0) {
            $(submenu).each(function (i, e) {
                var hasChildren = e["children"] && e["children"].length > 0,
                    url = e["url"] || "";

                noIcos += e["ico"] || "";

                result += format.replace(/\{url\}/g, url || "javascript: void 0")
                                      .replace(/\{urlid\}/g, e["urlid"] || "")
                                      .replace(/\{urlname\}/g, e["urlname"] || "")
                                      .replace(/\{ico\}/g, e["ico"] ? ' style="background-image: url(' + e["ico"] + ')"' : "")
                                      .replace(/\{hasChildren\}/g, hasChildren ? " has-sub-children" : "")
                                      .replace(/\{arrow\}/g, hasChildren ? "<em></em>" : "")
                                      .replace(/\{target\}/g, url.match(/^\s*javascript\:.*/) || hasChildren ? "" : ' target="_blank"')
                                      .replace(/\{children\}/g, that.buildChildrenMenu(e["children"]));
            });

            return '<ul class="pop-menus' + (noIcos ? "" : " no-icos") + '">' + result + "</ul>";
        }

        return result;
    }

    /**
     * 填充顶部框架中的数据，
     * 填充的内容包括：
     *      1. 指定 LOGO 图片
     *      2. 生成顶部菜单列表
     * 
     * @param vm    {object} 视图模型数据
     */

    fn.fill = function (vm) {
        this.vm = vm;
    }


    /**
     * 展开顶部框架
     */
    fn.expand = function () {
        this.$obj.height(this.height);
        this.$topping.show();
        this.$funcbar.show();
        this.$logo.show();

        this.doExpand(this.height);
    }

    /**
     * 折叠顶部框架（将高度设置为0）
     */
    fn.fold = function () {
        this.$obj.height(parseInt(this.$obj.attr("kd-min-height"), 10));
        this.$funcbar.hide();
        this.$logo.hide();

        this.doFold();
    }

    return top;
}());

/**
 * 表示 <展开菜单> 滑块
 */
SilverPage.DuckSilder = (function () {
    function silder() {
        this.$obj = $("#frame-main .duck-silder");
    }

    /**
     * 绑定当 <展开菜单> 滑块被点击时执行的回调
     */
    silder.prototype.binding = function (callback) {
        this.$obj.on("click", function () {
            callback();
        });
    };

    return silder;
}());

/**
 * 表示提示框
 * 调用示例：
 *   1. SilverPage.MyAlert.show("提示信息"); // 显示提示信息
 *   2. SilverPage.MyAlert.show("read"); // 显示“读取中”提示类型
 *   3. SilverPage.MyAlert.show({id: "read", message:"数据读取中，请稍后。"});
 * hide()            隐藏提示框
 * show(@options)    {object|string|undefined}显示提示框，@options参数对象可重置提示框，也可为已初始化过的id，不传则为显示当前id
 *  参数 @options属性如下：
 *  {
 *      id:        {string}指定唯一ID，提供六种(read/save/calculate/config/run),支持添加其他类型，不指定时默认为red  
 *      message:        {string}提示信息
 *      title:          {string}提示标题
 *      isShowTitle:    {boolean}是否显示标题，true为显示，false为不显示，不指定时默认不显示
 *      btns:           {array}按钮数组对象[{name:"关闭",click:null}[,...]]，不指定时默认有[{name:"关闭",click:null}];
 *      isShowBtn:      {boolean}是否显示按钮区域，true为显示，false不显示，不指定时默认不显示
 *      icon:           {string}提示信息前标识图片
 *      width:          {number}提示框宽度
 *  }
 * isExists(id) 判断是否初始化过相应的id
 */
SilverPage.MyAlert = (function () {
    var defaultConfig = {
        id: "reading",
        title: "提示",
        message: "操作中",
        // 默认大尺寸
        iconSize: "l",
        // 默认上下布局
        direction: "v",
        isShowBtn: false,
        isShowTitle: false,
        width: 450,
        btns: [{
            name: "关闭", click: function () {
                myAlert.instance.hide();
            }
        }]
    };


    function myAlert() {
        // 是否初始化
        this._isInit = false;
        // 当前配置
        this._currentConfig = defaultConfig;
        this._defaultConfig = defaultConfig;

        // 默认的五种提示类型
        this._DD = {
            "reading": $.extend(true, $.extend(true, {}, defaultConfig), { id: "reading", message: "读取中" }),
            "r": $.extend(true, $.extend(true, {}, defaultConfig), { id: "reading", message: "读取中" }),
            "writing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "writing", message: "写入中" }),
            "w": $.extend(true, $.extend(true, {}, defaultConfig), { id: "writing", message: "写入中" }),
            "computing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "computing", message: "计算中" }),
            "c": $.extend(true, $.extend(true, {}, defaultConfig), { id: "computing", message: "计算中" }),
            "setting": $.extend(true, $.extend(true, {}, defaultConfig), { id: "setting", message: "配置中" }),
            "s": $.extend(true, $.extend(true, {}, defaultConfig), { id: "setting", message: "配置中" }),
            "executing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "executing", message: "运行中" }),
            "e": $.extend(true, $.extend(true, {}, defaultConfig), { id: "executing", message: "运行中" })
        };
    }

    myAlert.prototype._init = function () {
        // 构建html
        this._renderHtml();
        // 初始化事件
        this._bindEvent();
    }

    myAlert.prototype._renderHtml = function () {
        var htmlTemplate = {
            backDrop: '<div class="alert-backdrop"></div>',
            alertWrap: '<div id="alertWrap" class="alert-wrap"><div class="alert-message-wrap">{$titleWrap}{$messageWrap}{$btnWrap}'
                    + '</div></div>',
            titleWrap: '<div class="alert-title-wrap">'
                    + '<button type="button" class="close"><span>×</span></button>'
                    + '<h4 class="alert-title"><a class="title-link" href="#"><span class="title-icon"></span></a></h4>'
                    + '</div>',
            messageWrap: '<div class="alert-direction-v"><div class="alert-message icon-reading-l"></div></div>',
            btnWrap: '<div class="alert-btn-wrap"></div>'
        };

        this.$contentBox = $(".frame-content-box");
        this.$contentBox.append($(htmlTemplate["backDrop"]));
        this.$contentBox.append($(htmlTemplate["alertWrap"].replace(/\{\$titleWrap\}/g, htmlTemplate["titleWrap"])
            .replace(/\{\$messageWrap\}/g, htmlTemplate["messageWrap"])
            .replace(/\{\$btnWrap\}/g, htmlTemplate["btnWrap"])));
    }

    // 设置定位父级
    myAlert.prototype._setPostionParent = function () {
        this.contentBoxPos = this.$contentBox.css("position")

        if (!/relative|absolute/.test(this.contentBoxPos.toLowerCase())) {
            this.$contentBox.css("position", "relative");
        }
    }

    myAlert.prototype._origPositionParent = function () {
        this.$contentBox.css("position", this.contentBoxPos);
    }

    myAlert.prototype._bindEvent = function () {
        this.$backdrop = this.$contentBox.children("div.alert-backdrop");
        this.$alert = this.$contentBox.children("div.alert-wrap");
        this.$alertMessageWrap = this.$alert.children("div.alert-message-wrap");
        this.$titleWrap = this.$alert.find("div.alert-title-wrap");
        this.$title = this.$titleWrap.find("h4.alert-title");
        this.$message = this.$alert.find("div.alert-message");
        this.$btnsWrap = this.$alert.find("div.alert-btn-wrap");
        var that = this;

        this.$btnsWrap.on("click", "input.btn-default", function () {
            var $btns = that.$btnsWrap.find("input.btn-default");

            if ($btns.index(this) != -1) {
                var btn = that.currentDialog["buttons"][$btns.index(this)];
                if (typeof btn["click"] === "function") {
                    btn["click"]();
                }
            }

            that.hide();
        });

        this.$titleWrap.on("click", ".close", function () {
            that.hide.call(that);
        });
    }

    // 显示
    myAlert.prototype.show = function (options) {
        var top;
        if (!this._isInit) {
            this._init();
        }

        this._reset(arguments)
        this.$backdrop.show();
        this.$alert.show();

        top = (this.$contentBox.height() - this.$alertMessageWrap.height()) / 2;
        this.$alertMessageWrap.css({ "margin-top": top });
    }

    // 重新设置
    myAlert.prototype._reset = function (args) {
        var alertConfig,
            options = args[0];

        if (typeof options === "object") {
            alertConfig = this._DD[options.id];
            if (!alertConfig) {
                // 存在id添加新的提示类型，否则替换默认
                this._currentConfig = $.extend(true, $.extend(true, {}, this._defaultConfig), options);
            }
            else {
                this._currentConfig = $.extend(true, $.extend(true, {}, alertConfig), options);
            }
        }
        else if (typeof options === "string") {
            // 是提示类型，则取提示类型配置，否则默认为是提示信息
            if (this.isExists(options)) {
                alertConfig = {};
                typeof args[1] === "string" ? alertConfig["message"] = args[1] : null;
                typeof args[2] === "string" ? alertConfig["iconSize"] = args[2] : null;
                typeof args[3] === "string" ? alertConfig["direction"] = args[3] : null;

                this._currentConfig = $.extend(true, $.extend(true, {}, this._DD[options]), alertConfig);
            }
            else {
                this._currentConfig = $.extend(true, $.extend(true, {}, this._DD["reading"]), { "message": options });
            }
        }

        // 重新渲染：标题、按钮、内容
        this._afreshRender();
    }

    // 重新渲染：标题、按钮、内容
    myAlert.prototype._afreshRender = function () {
        var direction = {
            "h": "alert-direction-h",
            "horizontal": "alert-direction-h",
            "v": "alert-direction-v",
            "vertical": "alert-direction-v"
        }, iconSize = {
            "l": "l", // 默认为大尺寸128
            "m": "m", // 中等 90
            "s": "s",// 小 72
            "large": "l",
            "small": "s",
            "medium": "m"
        }, currentConfig = this._currentConfig;
        // 设置标题
        this.$title.html(currentConfig["title"]);
        // 设置提示信息
        this.$message.html(currentConfig["message"])
            .removeClass().addClass("alert-message icon-" + (currentConfig["id"] || "reading") + "-" + (iconSize[currentConfig["iconSize"]] || "l"))
            .parent().removeClass().addClass(direction[currentConfig["direction"] || "v"]);

        // 设置按钮
        this.$btnsWrap.html(this._generateBtnsHtml(currentConfig["btns"]));

        //设置定位基点元素 
        this._setPostionParent();


        currentConfig["isShowTitle"] ? this.$titleWrap.show() : this.$titleWrap.hide();
        currentConfig["isShowBtn"] ? this.$btnsWrap.show() : this.$btnsWrap.hide();
        this.$alertMessageWrap.css("width", currentConfig["width"]);
    }

    myAlert.prototype._generateBtnsHtml = function (btns) {
        var htmlTemplate = '<input type="button" class="btn-default" value="{$name}" />', btnsHtml = [];
        btns = btns;

        for (i = 0, len = btns.length; i < len; i++) {
            btnsHtml.push(htmlTemplate.replace(/\{\$name\}/g, btns[i]["name"]));
        }

        return btnsHtml.join("");
    }

    // 隐藏
    myAlert.prototype.hide = function () {
        $.when(this.$alert.hide())
            .then(this.$backdrop.hide());
        this._origPositionParent();
    }

    // 判断是否存在
    myAlert.prototype.isExists = function (id) {
        return typeof this._DD[id] !== "undefined";
    }

    myAlert.instance = new myAlert();
    return myAlert.instance;
}());

$(function () {
    // 创建当前页面
    var page = new SilverPage();

    SilverPage.instance = page;

    // 执行页面初始化
    page.bootstrapper();
});