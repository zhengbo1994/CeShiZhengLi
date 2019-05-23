/// <reference path="../jquery.d.ts"/>
/// <reference path="../jqueryui.d.ts"/>
function GetContentBlockById(id) {
    return Sapi.PortalDesign.ContentBlock.GetById(id);
}
/**
 * @author: maowc
 * @version: 1.0
 * @date: 2012/10
 * @description:
 *      [门户布局设计器]
 *
 *  门户布局设计器是对内容块布局的设计的面板，主要包含 [设计] 与 [预览] 两种模式；
 *
 *  [预览] 模式提供对设计的最终结果进行展示，其展示的结果与前台门户展示的结果一致。
 *  [设计] 模式下，可在设计画板中任意拖放布局元素或内容块进行设计工作；
 *
 *  “布局” 是门户布局设计器的基本术语之一，布局是指为添加内容块之前，先为内容块设计一个放置定位的容器。
 *  布局允许嵌套其他任意布局，设计器默认提供两类布局，分别为：布局元素及预设布局；
 *
 *  布局元素提供最基础的三种布局元素，包括横向两列布局、纵向两行布局及标签页布局；在这三种基本布局的基础上，使用布局的嵌套特性，可以设计出任意复杂的布局。
 *  与此同时，设计器也提供若干个预设布局，预设布局是指预先提供比较常见的布局，当所需设计的布局正好在预设布局中已经提供时，可立即添加到布局画板中快速地完成布局工作，
 *  从而免除烦冗的布局设计过程。
 *
 *  设计器为方便设计工作，提供 “撤销”、“重做” 及 “清空” 三种基本的布局编辑操作。
*/
var Sapi;
(function (Sapi) {
    var PortalDesign;
    (function (PortalDesign) {
        /**
         * @enum: ContentType
         * @description: 定义内容块的内容的类型
         * @remark:
         *      系统默认提供了两个特殊的内容块，他们被归类到 “系统” 内容块类别下。
         *
         *      这两个内容块分别是 [框架页面]内容块，及 [自定义内容页面]内容块；
         *
         *      所谓 [框架页面]内容块，指的是这个内容块说请求的目标允许是非本系统的外部地址，例如：http://www.qq.com
         *      [框架页面]内容块需要指定目标地址，设计器仅请求该地址得到最终结果，此期间没有任何系统特殊行为（常规的内容块还可能处理分页、脚本等）。
         *      事实上，[框架页面]内容块的内容只是一个 iframe 元素。
         *
         *      [自定义内容页面]内容块是指某些内容可能是固定的一些文字或者 HTML 代码，使用 [自定义内容页面]内容块时，需要指定最终的内容，设计器仅将输入的
         *      文本或者 HTML 展示到内容块中，此期间没有任何系统特殊行为。
         *
         * @reference:
         *      请参看 ContentBlockArea.LoadContentBlocks() 加载所有内容块函数。
        */
        var ContentType;
        (function (ContentType) {
            ContentType[ContentType["Normal"] = 0] = "Normal";
            ContentType[ContentType["FramePage"] = 1] = "FramePage";
            ContentType[ContentType["CustomContent"] = 2] = "CustomContent";
            ContentType[ContentType["ImageContent"] = 3] = "ImageContent"; // 图片内容块
        })(ContentType || (ContentType = {}));
        /**
         * @enum: LayoutSizeUnit
         * @description: 定义布局尺寸单位(宽度)的枚举
         * @remark:
         *      布局的尺寸默认使用的是百分比方式（布局的背景将显示一个圆圈，圆圈内的 % 符号代表当前布局为百分比布局），百分比方式的特点是跟随宽度的变化而变化；
         *      通过 [双击] 某个布局，可以切换布局的尺寸单位为 “固定不变的宽度” （其背景将显示 (Px) 图形，代表设置成功），再次双击则切换为百分比方式。
         *
         * @reference:
         *      请参看下述相关的类型或函数：
         *          ResizeCover.Create() 函数
         *          SplitterContainer.CreateSplitter() 函数
         *          DesignCanvas.Init() 函数
         *          LayoutQuickToolbar 布局快速工具类
        */
        var LayoutSizeUnit;
        (function (LayoutSizeUnit) {
            LayoutSizeUnit[LayoutSizeUnit["Percent"] = 0] = "Percent";
            LayoutSizeUnit[LayoutSizeUnit["Pixel"] = 1] = "Pixel"; // 像素
        })(LayoutSizeUnit || (LayoutSizeUnit = {}));
        /**
         * @enum: DraggingIndicatorDirect
         * @description: 表示投放方向的枚举
         * @remark:
         *      内容块允许投放到已存在于画板中的另一个内容块之上，以此来确定当前拖动的内容块应该投放到该内容块的何种方向（位置）。
         *
         * @reference:
         *      请参考 ContentPlaceholderDraggingIndicator 类
        */
        var DraggingIndicatorDirect;
        (function (DraggingIndicatorDirect) {
            DraggingIndicatorDirect[DraggingIndicatorDirect["Unknown"] = -1] = "Unknown";
            DraggingIndicatorDirect[DraggingIndicatorDirect["Left"] = 0] = "Left";
            DraggingIndicatorDirect[DraggingIndicatorDirect["Right"] = 1] = "Right";
            DraggingIndicatorDirect[DraggingIndicatorDirect["Up"] = 2] = "Up";
            DraggingIndicatorDirect[DraggingIndicatorDirect["Down"] = 3] = "Down"; // 下
        })(DraggingIndicatorDirect || (DraggingIndicatorDirect = {}));
        /**
         * @class: DesignView
         * @description: 设计视图的类，此类表示整个设计界面
         * @remark:
         *      整个设计界面分为两大部分，分别为 [设计]部分与 [预览]部分；
         *      [设计]与[预览]两个视图以标签页的形式表示。
         *
         *      DesignView 表示两个部分的总体。
         *
         * @reference:
         *      请参考 [设计] 视图类 DesignPanel，及 [预览] 视图类 ReviewPanel。
        */
        var DesignView = (function () {
            function DesignView() {
                this.DesignPanel = new DesignPanel();
                this.ReviewPanel = new ReviewPanel();
                var pages = $(".design-box > dt");
                this.designPage = pages.children(".design-page");
                this.reviewPage = pages.children(".review-page");
            }
            // 初始化整个设计界面
            DesignView.prototype.Init = function () {
                this.DesignPanel.Init();
                var my = this;
                this.designPage.click(function () {
                    // 显示 [设计] 视图并隐藏 [预览] 视图
                    $(this).addClass("sel").siblings(".review-page").removeClass("sel");
                    my.ReviewPanel.Hide();
                    my.DesignPanel.Show();
                    DesignView.Resizable = true;
                    DesignCanvas.DoResizeInterval(); // 重新使所有布局执行一次调整
                });
                this.reviewPage.click(function () {
                    DesignView.Resizable = false; // 禁用调整布局尺寸
                    // 显示 [预览] 视图并隐藏 [设计] 视图
                    $(this).addClass("sel").siblings(".design-page").removeClass("sel");
                    my.DesignPanel.Hide();
                    // 开始创建 [预览]
                    my.ReviewPanel.BuildReview(DesignPanel.CanvasStatic.GetFinalOutputHTML());
                });
                // 得到所有内容块信息
                ajax("FillData.ashx", {
                    "action": "GetPortalBlock",
                    "PortalType": RequestDataObject.GetPortalType(),
                    "randData": new Date().getTime()
                }, "json", $.proxy(this.DesignPanel.OperatControl.ContentBlocks.LoadContentBlocks, this.DesignPanel.OperatControl.ContentBlocks));
                // 得到所有内容块组信息
                ajax("FillData.ashx", {
                    "action": "GetPortalBlockGroup",
                    "PortalType": RequestDataObject.GetPortalType(),
                    "randData": new Date().getTime()
                }, "json", $.proxy(this.DesignPanel.OperatControl.ContentBlockGroups.LoadContentGroups, this.DesignPanel.OperatControl.ContentBlockGroups));
            };
            DesignView.Resizable = true; // 当前是否允许调整布局尺寸
            DesignView.Style = $("#inlineStyle");
            DesignView.Header = $("head");
            DesignView.Body = $("body");
            return DesignView;
        })();
        PortalDesign.DesignView = DesignView;
        /** 颜色预设框 */
        var ColorScheme = (function () {
            function ColorScheme() {
            }
            ColorScheme.getInstance = function () {
                if (ColorScheme.dialog === null) {
                    var dlg = ColorScheme.dialog = $(".color-scheme-box");
                    var win = $(window);
                    win.on("resize scroll", function () {
                        if (dlg.css("display") !== "none") {
                            dlg.stop().animate({
                                left: (win.width() - dlg.width()) / 2,
                                top: (win.height() - dlg.height()) / 2 + win.scrollTop()
                            }, 300, "swing");
                        }
                    });
                    var pickers = dlg.find(".color-picker");
                    pickers.spectrum({
                        showInput: true,
                        showInitial: true,
                        showPalette: true,
                        showAlpha: true,
                        preferredFormat: "hex",
                        palette: [
                            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)", "rgb(183, 183, 183)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
                            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)", "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                        ]
                    });
                    dlg.find(".btn-cancel").on("click", function () { return ColorScheme.Close(); });
                    dlg.find(".btn-apply-all,.btn-apply").on("click", function () {
                        var t = dlg.data("target");
                        var holders = t.find(".content-placeholder");
                        if (t.hasClass("content-placeholder"))
                            holders = t;
                        var scheme = ColorScheme.GetColorScheme();
                        var cs = $.parseJSON(scheme);
                        if (t.hasClass("design-canvas")) {
                            t.attr("oldColorScheme", t.attr("colorscheme"));
                            t.attr("colorscheme", scheme);
                        }
                        holders.each(function (i, e) {
                            var target = $(e);
                            target.attr("oldColorScheme", target.attr("colorscheme"));
                            target.attr("colorscheme", scheme);
                            ColorScheme.Apply(target, cs);
                        });
                        ColorScheme.Close();
                    });
                    dlg.find(".btn-recover").on("click", function () {
                        var t = dlg.data("target");
                        var oldScheme = $.trim(t.attr("oldColorScheme"));
                        if (oldScheme) {
                            ColorScheme.ReSetColor($.parseJSON(oldScheme));
                        }
                    });
                    dlg.find(".btn-apply-page-bg-color").on("click", function () {
                        var t = dlg.data("target");
                        var scheme = ColorScheme.GetColorScheme();
                        var cs = $.parseJSON(scheme);
                        t.css("background-color", cs.PageBgColor).children().css("background-color", cs.PageBgColor);
                    });
                    dlg.find(".btn-set-global-default").on("click", function () {
                        DesignCanvas.Canvas.attr("colorscheme", $(this).closest(".color-scheme-box").data("target").attr("colorscheme"));
                        if (confirm("是否确信设为全局颜色预设？")) {
                            var oldTarger = dlg.data("target");
                            dlg.data("target", DesignCanvas.Canvas);
                            dlg.find(".btn-apply-all").trigger("click");
                            ColorScheme.Close();
                        }
                    });
                }
                return ColorScheme.dialog;
            };
            ColorScheme.GetColorScheme = function () {
                var dlg = ColorScheme.getInstance();
                var cs = "{";
                cs += '"PageBgColor": "' + dlg.find(".page-bg-color").val() + '",';
                cs += '"ContentBgColor": "' + dlg.find(".content-bg-color").val() + '",';
                cs += '"ContentBorderColor": "' + dlg.find(".content-border-color").val() + '",';
                cs += '"TitleBgColor": "' + dlg.find(".title-bg-color").val() + '",';
                cs += '"TitleFgColor": "' + dlg.find(".title-color").val() + '",';
                cs += '"TitleLinkColor": "' + dlg.find(".title-link-color").val() + '",';
                cs += '"TextColor": "' + dlg.find(".text-color").val() + '"';
                cs += '}';
                return cs;
            };
            ColorScheme.Apply = function (t, cs) {
                t.removeClass("theme-blue theme-gray theme-tran");
                t.css("cssText", "background-color: " + cs.ContentBgColor + "; border-color: " + cs.ContentBorderColor + "; color: " + cs.TextColor + ' !important;');
                var title = t.children(".title");
                title.css("cssText", "background-color: " + cs.TitleBgColor + ' !important; background-image: url(../../image/content-back.png);');
                title.find(".title-span").css("cssText", "color: " + cs.TitleFgColor + ' !important;');
                t.find(".title-func a").css("cssText", 'color: ' + cs.TitleLinkColor + ' !important;');
            };
            ColorScheme.ReSetColor = function (cs) {
                var dlg = ColorScheme.getInstance();
                dlg.find(".page-bg-color").spectrum("set", cs.PageBgColor);
                dlg.find(".content-bg-color").spectrum("set", cs.ContentBgColor);
                dlg.find(".content-border-color").spectrum("set", cs.ContentBorderColor);
                dlg.find(".title-bg-color").spectrum("set", cs.TitleBgColor);
                dlg.find(".title-color").spectrum("set", cs.TitleFgColor);
                dlg.find(".title-link-color").spectrum("set", cs.TitleLinkColor);
                dlg.find(".text-color").spectrum("set", cs.TextColor);
            };
            /**显示配置框*/
            ColorScheme.Show = function (target) {
                if (target === void 0) { target = DesignCanvas.Canvas; }
                var win = $(window);
                var dlg = ColorScheme.getInstance();
                var isTop = false;
                dlg.find(".setting-dialog-btns :not(.btn-cancel,.btn-recover)").hide();
                dlg.find(".page-background-color-setting").hide();
                if (target.hasClass("design-canvas")) {
                    dlg.find(".dialog-title").text("全局颜色预设");
                    dlg.find(".page-background-color-setting").show();
                    dlg.find(".btn-apply-all").show();
                    isTop = true;
                }
                else {
                    dlg.find(".dialog-title").text("内容块颜色预设");
                    dlg.find(".btn-set-global-default,.btn-apply").show();
                }
                var scheme = target.attr("colorscheme");
                ColorScheme.ReSetColor(scheme ? $.parseJSON(scheme) : ColorScheme.GetSchemeByTarget(target, isTop));
                dlg.data("target", target).show().stop().animate({
                    left: (win.width() - dlg.width()) / 2,
                    top: (win.height() - dlg.height()) / 2 + win.scrollTop() - 50
                }, 300, "swing");
            };
            ColorScheme.GetSchemeByTarget = function (target, top) {
                if (top === void 0) { top = false; }
                var t = target;
                var cs = "{";
                if (top) {
                    t = target.find(".content-placeholder:eq(0)");
                    cs += '"PageBgColor": "' + target.css("background-color") + '",';
                }
                cs += '"ContentBgColor": "' + t.css("background-color") + '",';
                cs += '"ContentBorderColor": "' + t.css("border-color") + '",';
                cs += '"TitleLinkColor": "' + t.find(".title-func a:first").css("color") + '",';
                cs += '"TextColor": "' + t.css("color") + '",';
                var title = t.children(".title");
                cs += '"TitleBgColor": "' + title.css("background-color") + '",';
                cs += '"TitleFgColor": "' + title.find(".title-span").css("color") + '"';
                cs += "}";
                target.attr("colorscheme", cs);
                return $.parseJSON(cs);
            };
            /**关闭配置框*/
            ColorScheme.Close = function () {
                ColorScheme.getInstance().hide();
            };
            ColorScheme.dialog = null;
            ColorScheme.target = null;
            return ColorScheme;
        })();
        /**
         * @class: DesignPanel
         * @description: 表示 [设计] 面板视图的类
         * @remark:
         *      设计视图主要分为两大部分：[画板面板] 以及 [操作控制面板]。
         *
         *      画板面板指的是 [设计] 视图左侧最大空旷的块，呈灰色背景；[画板面板] 用于接受从 [操作控制面板] 中拖放到此处的内容块或者布局，
         *      画板面板是门户页设计器的核心组件，大部分设计工作需要活动在此组件之上，画板面板被封装在 DesignCanvas 类中。
         *
         *      操作控制面板 则提供设计所需的 “工具”，这些工具被包装在 操作控制面板 的类上。请参考操作控制面板类：OperatControl。
         * @reference:
         *      DesignCanvas 画板视图类
         *      OperatControl 操作控制面板类
        */
        var DesignPanel = (function () {
            function DesignPanel() {
                var _this = this;
                this.panel = $(".design-box > .design-panel");
                this.inner = $(".design-panel-inner");
                this.copyButton = $(".design-load-layout-from");
                this.reload = $(".design-refresh-all-cb");
                this.colorScheme = $(".design-color-scheme");
                this.copyDialog = $(".layout-copy-selector");
                this.selectCopyButton = this.copyDialog.find(".layout-copy-selector-btns-ok");
                this.cancelCopyButton = this.copyDialog.find(".layout-copy-selector-btns-cancel");
                this.selectCopyList = this.copyDialog.find(".layout-copy-selector-list");
                this.copyDialogPortalTitle = this.copyDialog.find(".layout-copy-selector-target i");
                this.copyDialogPortalTitle.text(["个人门户", "项目门户", "企业门户"][RequestDataObject.GetPortalType()]);
                this.copyDialog.on("click", ".layout-copy-selector-list > li", function () {
                    $(this).addClass("sel").siblings().removeClass("sel");
                });
                var win = $(window);
                var copyDialogHeight = this.copyDialog.height();
                var copyDialogWidth = this.copyDialog.width();
                win.on("resize scroll", function () {
                    if (_this.copyDialog.css("display") !== "none") {
                        _this.copyDialog.stop().animate({
                            left: (win.width() - copyDialogWidth) / 2,
                            top: (win.height() - copyDialogHeight) / 2 + win.scrollTop()
                        }, 300, "swing");
                    }
                });
                this.copyButton.on("click", function () {
                    $(".setting-dialog").hide();
                    _this.selectCopyList.children("li").removeClass("sel");
                    _this.copyDialog.css({ left: (win.width() - copyDialogWidth) / 2, top: 0 }).show();
                    win.trigger("resize");
                });
                this.reload.on("click", function () {
                    $(".setting-dialog").hide();
                    $(".content-placeholder[contenttype]:visible").each(function (i, e) {
                        var me = $(this);
                        var c = me.find(".content");
                        var t = Number(me.attr("contenttype"));
                        if (t === 1 /* FramePage */) {
                            var iframe = me.find("> .content > .iframe-page");
                            var url = iframe.attr("src");
                            iframe.attr("src", "about:blank").attr("src", url);
                            return me;
                        }
                        if (t === 2 /* CustomContent */) {
                            c.html(c.html());
                            return me;
                        }
                        c.empty().addClass("content-loading").append('<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>');
                        ContentBlock.ParseContentBlock(me).LoadContent();
                        return me;
                    });
                });
                this.colorScheme.on("click", function () {
                    $(".setting-dialog").hide();
                    ColorScheme.Show();
                });
                this.cancelCopyButton.on("click", function () { return _this.copyDialog.hide(); });
                this.selectCopyButton.on("click", function () {
                    _this.copyDialog.hide();
                    var selected = _this.selectCopyList.children(".sel");
                    if (selected.length) {
                        var portalId = $.trim(selected.attr("rel"));
                        if (portalId)
                            DesignCanvas.ReLoadPortalLayout(portalId);
                    }
                });
                this.LoadPortalList();
                DesignPanel.CanvasStatic = this.Canvas = new DesignCanvas();
                this.OperatControl = new OperatControl();
            }
            // 初始化设计面板
            DesignPanel.prototype.Init = function () {
                this.Canvas.Init(this.inner);
                this.OperatControl.Init();
            };
            // 隐藏设计面板
            DesignPanel.prototype.Hide = function () {
                this.panel.hide();
                this.copyButton.hide();
                this.reload.hide();
                this.colorScheme.hide();
            };
            // 显示设计面板
            DesignPanel.prototype.Show = function () {
                this.panel.fadeIn(1000);
                this.copyButton.fadeIn(500);
                this.reload.fadeIn(500);
                this.colorScheme.fadeIn(500);
            };
            DesignPanel.prototype.LoadPortalList = function () {
                var my = this;
                ajax("FillData.ashx", { "action": "GetPortalPageList", "PortalType": RequestDataObject.GetPortalType(), "randData": new Date().getTime() }, "json", function (data) {
                    if (data.Success === "Y") {
                        my.BuildPortalList(new Function("return " + data.Data + ";")());
                    }
                });
            };
            // 加载门户列表
            DesignPanel.prototype.BuildPortalList = function (list) {
                var format = '<li rel="{0}">{1}</li>';
                delete list[RequestDataObject.GetPortalId()];
                for (var i in list) {
                    if (list.hasOwnProperty(i)) {
                        this.selectCopyList.append(format.replace("{0}", i).replace("{1}", list[i]));
                    }
                }
            };
            return DesignPanel;
        })();
        PortalDesign.DesignPanel = DesignPanel;
        /**
         * @class: ReviewPanel
         * @description: 表示 [预览] 面板视图的类
         * @remark:
         *      [预览] 提供展示门户页设计的最终结果，他与前台展示所呈现的结果一致。
        */
        var ReviewPanel = (function () {
            function ReviewPanel() {
                var _this = this;
                this.panel = $(".design-box > .review-panel");
                this.reviewFrame = $(".review-page-frame");
                this.win = $(window.parent);
                this.innerWin = $(window);
                this.win.on("resize", function () {
                    try {
                        _this.reviewFrame.height(_this.innerWin.height() - _this.reviewFrame.position().top - 20);
                    }
                    catch (msg) {
                    }
                });
                this.reviewFrame.on("load", function () { return _this.win.trigger("resize"); });
            }
            // 隐藏预览面板
            ReviewPanel.prototype.Hide = function () {
                this.panel.hide();
            };
            // 开始创建预览视图
            ReviewPanel.prototype.BuildReview = function (result) {
                var _this = this;
                SplitterContainer.HideAll();
                var big = LoadingBox.CreateBigLoading("正在保存布局 ...", "../../image/big-loading.gif");
                this.panel.empty().append(big).fadeIn(1000);
                SavePortalLayout(RequestDataObject.GetPortalId(), result, function (result) {
                    if (result) {
                        _this.reviewFrame.attr("src", "../../home/portal/portal.html?systemdebug=true&portal=" + RequestDataObject.GetPortalId() + "&id=" + RequestDataObject.GetID() + "&portalType=" + RequestDataObject.GetPortalType());
                        _this.panel.empty().append(_this.reviewFrame);
                    }
                    else {
                        var span = big.find("span");
                        var img = big.find("img");
                        img.attr("src", "../../image/big-info.png");
                        span.text("保存布局失败 ...");
                    }
                });
            };
            return ReviewPanel;
        })();
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
        /**
         * @class: DesignCanvas
         * @description: 表示画板面板视图的类
         * @remark:
         *      画板面板作为所有布局中最底层的容器，它同时也是基本的布局，接受直接拖放其他布局或者内容块。
         *
         *      画板面板核心的工作是负责初始化画板及未来拖放到画板的元素的一些事件，
         *      例如所有布局在调整时自动适应界面，或者是移动鼠标到某个布局上显示尺寸信息，或者是让为未来的 Tab标签页布局执行绑定等等。
         *
         *      当门户页设计完毕后，画板面板类负责生成最终的被呈现到前台的 HTML。
         *
         * @reference:
         *      Layout 布局类
         *      TabGlobalBinder 标签页全局事件绑定类
        */
        var DesignCanvas = (function () {
            function DesignCanvas() {
                this.canvas = DesignCanvas.Canvas = $(".design-panel-inner .design-canvas");
                this.layout = DesignCanvas.GroundLayout = new Layout(this.canvas);
                this.operatControlBox = $(".operat-control-box");
                DesignCanvas.AutoBinding();
            }
            /** 绑定所有数字列表
              * 当内容块的内容为列表时（无序列表 ul 或有序列表 ol），若应用了 number 样式类则自动插入数字及相关样式。
            */
            DesignCanvas.BindingNumber = function () {
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
            DesignCanvas.AutoBinding = function () {
                DesignCanvas.BindingNumber();
            };
            DesignCanvas.HiddenElement = function () {
                LayoutQuickToolbar.Hide();
                FramePageSetting.Reset();
                CustomContentSetting.Reset();
                MinWidthInfoBox.Hide();
            };
            DesignCanvas.GetMoreUrl = function (url) {
                return url ? (url + (url.indexOf("?") === -1 ? "?" : "&") + "PortalType=" + RequestDataObject.GetPortalType() + "&PortalOwnerID=" + RequestDataObject.GetID()) : "";
            };
            DesignCanvas.PrevProcess = function (result) {
                var jResult = null;
                if (result) {
                    jResult = $(result);
                    jResult.find(".title-func > a:not(.refresh,.help)").attr("href", function () {
                        var me = $(this);
                        return "javascript: openWindow('" + DesignCanvas.GetMoreUrl(me.attr("rel")) + "', " + me.attr("opensize") + " )";
                    });
                }
                return jResult;
            };
            DesignCanvas.HtmlInitialize = function (container, html) {
                html = $.trim(html);
                var jResult = DesignCanvas.PrevProcess(html);
                if (html)
                    container.removeClass("init-size");
                container.empty();
                if (jResult && jResult.length) {
                    container.append(jResult);
                }
                else {
                    container.append(DesignCanvas.EmptyContent);
                }
                container.find(".layout-table").each(function (i, elem) {
                    var me = $(this);
                    new Layout(me, "").ActiveLayout();
                    return me;
                });
                var normalHolders = container.find(".content-placeholder[contenttype]");
                normalHolders.filter("[contenttype=" + 0 /* Normal */ + "]").find(".content").addClass("content-loading").append('<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>');
                normalHolders.each(function (i, elem) {
                    var me = $(this);
                    var c = ContentBlock.ParseContentBlock(me);
                    if (Number(me.attr("contenttype")) === 0 /* Normal */)
                        c.LoadContent();
                    ContentBlock.ActiveDroppable(c);
                    return me;
                });
                DesignCanvas.GroundLayout.ActiveLayout(); // 使画板面板成为拖放目标，开始允许接受拖放
                AutoRefresher.Initizal(); // 初始化自动刷新器
                TabPanelSetting.Apply();
            };
            DesignCanvas.ReLoadPortalLayout = function (portalId) {
                // 加载内容页
                LoadPortalLayout(portalId, function (result) { return DesignCanvas.HtmlInitialize(DesignCanvas.Canvas, result); });
            };
            DesignCanvas.prototype.Init = function (parent) {
                var _this = this;
                var __cv = this;
                this.operatControlBox.on("blur", function () { return _this.operatControlBox.hide(); });
                this.operatControlBox.on("mouseenter", function () { return _this.operatControlBox.off("blur"); });
                this.operatControlBox.on("mouseleave", function () {
                    _this.operatControlBox.on("blur", function () { return _this.operatControlBox.hide(); }).focus();
                });
                this.operatControlBox.find(".icon-only").on("click", function () {
                    var t = __cv.operatControlBox.data("target");
                    var me = $(this);
                    if (t && t.length) {
                        if (me.attr("checked")) {
                            t.children("img").show();
                        }
                        else {
                            t.children("img").hide();
                        }
                    }
                });
                this.operatControlBox.find(".text-only").on("click", function () {
                    var t = __cv.operatControlBox.data("target");
                    var me = $(this);
                    if (t && t.length) {
                        if (me.attr("checked")) {
                            t.children("span").show();
                        }
                        else {
                            t.children("span").hide();
                        }
                    }
                });
                this.operatControlBox.find(".input").on("keyup", function () {
                    var t = __cv.operatControlBox.data("target");
                    if (t && t.length) {
                        t.find("span").text(this.value);
                    }
                });
                this.operatControlBox.find(".hide-operat-button").on("click", function () {
                    var t = __cv.operatControlBox.data("target");
                    if (t && t.length) {
                        t.hide();
                    }
                    __cv.operatControlBox.hide();
                });
                // 设置画板宽度，并在窗口尺寸改变时保持比例
                this.canvas.hide().width(parent.width() - 210).show();
                this.canvas.on("resize", function () {
                    _this.canvas.stop().animate({ width: parent.width() - 210 }, 300, "swing");
                    DesignView.Resizable = true;
                    return false;
                });
                $(window).on("resize", function () {
                    DesignCanvas.HiddenElement();
                    LayoutSetting.ReSet();
                    _this.canvas.trigger("resize");
                }).resize();
                // 每秒执行一次所有布局的尺寸调整
                setInterval(function () {
                    if (DesignView.Resizable) {
                        DesignCanvas.Canvas.find(".layout-table > tbody > tr > td:visible").trigger("resize");
                        DesignCanvas.Canvas.trigger("resize");
                    }
                }, 1000);
                // 加载当前门户页
                DesignCanvas.ReLoadPortalLayout(RequestDataObject.GetPortalId());
                // 双击时改变布局宽度的方式：使用固定宽度或百分比
                this.canvas.on("dblclick", "td", function () {
                    if (this.getAttribute("splitter") === "hor" && (this.nextSibling || this.previousSibling)) {
                        var me = $(this);
                        var sizeunit = Number(this.getAttribute("sizeunit"));
                        sizeunit = isNaN(sizeunit) ? 0 /* Percent */ : sizeunit;
                        var finalunit = (sizeunit === 0 /* Percent */ ? 1 /* Pixel */ : 0 /* Percent */);
                        this.setAttribute("sizeunit", finalunit);
                        var sibling = me.siblings(); // 同辈的另一个横向布局
                        if (finalunit === 1 /* Pixel */) {
                            me.addClass("pixel").width(me.width()); // 重新设置为像素值 (me.width() 返回像素值)
                            if (Number(sibling.attr("sizeunit")) === 1 /* Pixel */) {
                                // 则将其设置为按百分比 (不允许两个都是按像素固定宽度，必须使其中一个根据浏览器宽度自动伸展)
                                // 设置另外一个宽度为自动(auto)，并且设置其按百分比伸展
                                sibling.attr("sizeunit", 0 /* Percent */).removeClass("pixel");
                            }
                        }
                        else {
                            // 自动转宽度为百分比，当前宽度 +5 个像素的误差值。
                            me.removeClass("pixel").width(function () { return Math.floor((me.width() + 5) / me.parent().width() * 100) + "%"; });
                        }
                        sibling.width(function () { return "auto"; }); // 另一个横向布局自动伸展
                    }
                    return false;
                }).on("mouseenter", "td > .empty-content", function () {
                    if (DesignView.Resizable)
                        LayoutQuickToolbar.Anchor($(this));
                    return false;
                }).on("mouseout", "td > .empty-content", function () {
                    if (DesignView.Resizable)
                        LayoutQuickToolbar.Hide();
                    return false;
                }).on("dblclick", ".content-placeholder", function () {
                    return false;
                }).on("mouseenter", ".content-placeholder", function () {
                    MinWidthInfoBox.Anchor($(this));
                    return false;
                }).on("dblclick", ".content-placeholder > .title > .title-span", function () {
                    var my = $(this);
                    var pos = my.offset();
                    TextCover.Anchor(my, { left: pos.left, top: pos.top + 4 }, { width: my.width() + 10, height: 20 }, null, "content-placeholder-title-editing");
                    return false;
                }).on("mouseenter", ".content-placeholder > .content .iframe-page", function () {
                    CustomContentSetting.Reset();
                    FramePageSetting.Anchor($(this));
                    return false;
                }).on("mouseout", ".content-placeholder > .content .iframe-page", function () {
                    FramePageSetting.Reset();
                    return false;
                }).on("mouseenter", ".content-placeholder > .content.custom-content-block", function () {
                    FramePageSetting.Reset();
                    CustomContentSetting.Anchor($(this));
                    return false;
                }).on("mouseout", ".content-placeholder > .content.custom-content-block", function () {
                    CustomContentSetting.Reset();
                    return false;
                }).on("click", ".content-placeholder > .setting", function () {
                    var me = $(this);
                    SettingShortcutMenu.Anchor(me.closest(".content-placeholder"), me);
                    return false;
                }).on("click", ".content-placeholder .title-func > .help", function () {
                    var me = $(this);
                    var p = me.closest(".content-placeholder");
                    var hc = $.trim(p.attr("remark"));
                    DesignCanvas.HiddenElement();
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
                    holders.find(".content").empty().addClass("content-loading").append('<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>');
                    holders.each(function (i, e) {
                        return ContentBlock.ParseContentBlock($(this)).LoadContent();
                    });
                    return false;
                }).on("mouseover", ".content-placeholder .title-func > a", function () {
                    var me = $(this);
                    var ocb = __cv.operatControlBox;
                    var txt = me.children("span");
                    ocb.find(".icon-only").attr("checked", (me.children("img").css("display") !== "none").toString());
                    ocb.find(".text-only").attr("checked", (txt.css("display") !== "none").toString());
                    ocb.find(".input").val(txt.text());
                    ocb.data("target", me);
                    ocb.show().position({ of: me, offset: "0 5", my: "center top", at: "center bottom" }).focus();
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
                }).on("resize", ".layout-table > tbody > tr > td", function () {
                    if (!DesignView.Resizable)
                        return false;
                    var me = $(this), attach = me, e = this, child = me.children();
                    try {
                        var direct = e.getAttribute("splitter");
                        if (direct) {
                            if (direct === "ver")
                                attach = $(e = e.parentElement);
                            if (!e.nextSibling)
                                return;
                            var split = attach.data("splitter");
                            if (!split || split.length === 0)
                                split = SplitterContainer.CreateSplitter(attach, direct);
                            var o = splitterOptions[direct];
                            if (direct === "hor") {
                                split.height(attach.height() - 10);
                                // 调整分割条可拖动的范围
                                var p = me.parent();
                                var y = split.position().top;
                                split.draggable("option", "containment", [me.position().left + 50, y, p.position().left + p.width() - 50, y]);
                            }
                            else {
                                split.width(attach.width() - 10);
                            }
                            split.position({ of: attach, offset: o.offset, my: o.my, at: o.at }).show();
                        }
                    }
                    catch (msg) {
                    }
                    return false;
                });
                TabGlobalBinder.ApplyBinding(); // 为所有未来的标签页绑定事件，包括标签的点击、[新增标签]按钮点击等等元素的事件绑定
            };
            // 对所有当前可视的布局执行尺寸调整
            DesignCanvas.DoResizeInterval = function () {
                if (DesignView.Resizable) {
                    DesignCanvas.Canvas.find(".layout-table > tbody > tr > td:visible").trigger("resize");
                    DesignCanvas.Canvas.trigger("resize");
                }
            };
            // 获得最终结果的HTML
            DesignCanvas.prototype.GetFinalOutputHTML = function (parent) {
                if (parent === void 0) { parent = this.canvas; }
                var c = parent.clone();
                var h = c.find(".content-placeholder").removeAttr("resourceindex").removeClass("load-fail").css({ "min-height": "" }).filter("[contenttype=" + 0 /* Normal */ + "]");
                var content = h.find(".content");
                content.each(function (i, e) {
                    var me = $(e);
                    me.attr("href", me.attr("originalHref"));
                });
                content.removeAttr("style").removeAttr("originalHref").removeClass("load-fail-bg content-loading").html("");
                h.find(".title-pager").html("");
                return c.html();
            };
            DesignCanvas.EmptyContent = '<div class="empty-content"></div>';
            return DesignCanvas;
        })();
        PortalDesign.DesignCanvas = DesignCanvas;
        /**
         * @class: OperatControl
         * @description: 表示操作控制画板的类
         * @remark:
         *      [操作控制面板] 是指显示在 [设计] 视图右侧的面板，操作控制共分三个区块，包括：操作按钮区、布局元素选择区及内容块区。
         *
         *      操作按钮区在控制面板顶部，提供 “撤销”、“重做”、“清空”和 “保存” 功能。请参考 OperatButtons 类。
         *
         *      布局元素选择区罗列当前所有支持的布局元素，共分为两类，分别为：布局元素(基本)和预设布局。
         *
         *      内容块/组区罗列所有可供添加到布局的内容块/组；
         *
         *      [控制面板] 自动跟随窗口的纵向滚动条的滚动而自动飘浮到适当位置。
         *
         * @reference:
         *      OperatButtons 操作按钮区的类
         *      LayoutElementSelector 布局元素选择区的类
         *      ContentBlockArea 内容块区的类
        */
        var OperatControl = (function () {
            function OperatControl() {
                this.isLoad = false; // 是否已加载
                this.control = $(".design-panel-control");
                this.tabs = $(".design-panel-control h3 > span");
                this.contentHeader = $(".design-control-layout-content-header");
                this.OperatButtons = new OperatButtonArea();
                this.LayoutElementSelector = new LayoutElementArea();
                this.ContentBlocks = new ContentBlockArea();
                this.ContentBlockGroups = new ContentBlockGroupArea();
            }
            OperatControl.prototype.Init = function () {
                var _this = this;
                var win = $(window);
                win.on("scroll", function () {
                    if (_this.isLoad) {
                        var top = win.scrollTop();
                        _this.control.stop().animate({ top: top > 51 ? (top - 41) : 0 }, 500, "easeInOutQuint");
                    }
                });
                this.control.fadeIn(300, function () {
                    win.trigger("scroll");
                });
                this.isLoad = true;
                this.tabs.click(function () {
                    $(this).addClass("sel").siblings("span").removeClass("sel");
                });
                this.contentHeader.click(function () {
                    _this.LayoutElementSelector.Active();
                });
                this.OperatButtons.Init();
                this.LayoutElementSelector.Init();
                this.ContentBlocks.Init();
                this.ContentBlockGroups.Init();
            };
            return OperatControl;
        })();
        PortalDesign.OperatControl = OperatControl;
        /**
         * @class: OperatButtonArea
         * @description: 表示操作控制画板-按钮区的类
         * @remark:
         *      操作按钮区在控制面板顶部，提供 “撤销”、“重做”、“清空”和 “保存” 功能。
         *
         *      撤销、重做默认最多支持 100 个操作步骤，超过这个尺寸的步骤则自动抛弃。
         *
         *      撤销 - 撤销上一步操作，支持布局、内容块（及细节操作）。
         *      重做 - 重做上一步操作，支持布局、内容块（及细节操作）。
         *      清空 - 清空整个设计画板。
         *      保存 - 保存布局到数据库。
         * @reference:
         *      OperatControl 操作控制画板类
        */
        var OperatButtonArea = (function () {
            function OperatButtonArea() {
                this.btns = $(".design-panel-control .operat-box a");
                this.undo = this.btns.filter(".undo");
                this.redo = this.btns.filter(".redo");
                this.clean = this.btns.filter(".clean");
                this.save = this.btns.filter(".save");
            }
            OperatButtonArea.prototype.Init = function () {
                this.btns.mousedown(function () {
                    $(this).css({ opacity: 0.5 });
                }).mouseup(function () {
                    $(this).css({ opacity: 1 });
                });
                this.undo.on("click", function () {
                    //todo:
                    alert("正在开发中 ...");
                });
                this.redo.on("click", function () {
                    alert("正在开发中 ...");
                });
                this.clean.on("click", function () {
                    var empty = $(DesignCanvas.EmptyContent);
                    SplitterContainer.DeleteAll("");
                    DesignCanvas.Canvas.empty().append(empty);
                    Layout.ActiveDroppable(empty);
                });
                this.save.on("click", function () {
                    SavePortalLayout(RequestDataObject.GetPortalId(), DesignPanel.CanvasStatic.GetFinalOutputHTML(), function (result) {
                        if (result) {
                            alert("保存成功。");
                        }
                        else {
                            alert("保存失败。");
                        }
                    });
                });
            };
            return OperatButtonArea;
        })();
        PortalDesign.OperatButtonArea = OperatButtonArea;
        /**
         * @class:
         * @description: 表示操作控制面板-布局元素选择区的类
         * @remark:
         *      布局元素选择区罗列当前所有支持的布局元素，共分为两类，分别为：布局元素(基本)和预设布局。
         *
         *      事实上，因为布局支持嵌套特性，因此通过布局元素中的 “横向两列布局”、“纵向三列布局” 及 “标签页布局” 三者，便可组合出任意复杂的布局。
         *
         *      预设布局提供的是较为常见的布局，以便进行快速设计。
         * @reference:
         *      OperatControl 操作控制画板类
        */
        var LayoutElementArea = (function () {
            function LayoutElementArea() {
                this.normalPage = $(".design-panel-control .select-layout-element");
                this.complexPage = $(".design-panel-control .select-complex-layout-element");
                this.elementBox = $(".design-control-layout-element");
                this.elements = this.elementBox.children("li");
                this.defaultElements = this.elementBox.children(".default");
                this.complexElements = this.elementBox.children(".complex");
            }
            LayoutElementArea.prototype.Init = function () {
                var _this = this;
                this.normalPage.click(function () {
                    _this.elementBox.animate({ height: 80 }, 500, "easeInOutQuint");
                    _this.defaultElements.fadeIn(500);
                    _this.complexElements.hide();
                });
                this.complexPage.click(function () {
                    _this.elementBox.animate({ height: 420 }, 500, "easeInOutQuint");
                    _this.defaultElements.hide();
                    _this.complexElements.fadeIn(500);
                    _this.elementBox.css("overflow", "auto");//修复BUG21615  张韩  20150629
                });
                // 元素拖放
                this.elements.draggable({
                    addClasses: false,
                    appendTo: "#layout-dragging-shelter",
                    helper: "clone",
                    opacity: 0.7,
                    revert: "invalid",
                    scroll: false,
                    start: function (event, ui) {
                        DesignCanvas.HiddenElement();
                        LayoutSetting.ReSet();
                    },
                    drag: function (event, ui) {
                    },
                    stop: function (event, ui) {
                    } // 停止拖动
                });
            };
            LayoutElementArea.prototype.Active = function () {
                this.normalPage.click();
            };
            return LayoutElementArea;
        })();
        PortalDesign.LayoutElementArea = LayoutElementArea;
        /**
         * @class:
         * @description: 表示内容块区域的类
         * @remark:
         *      内容块区域呈现所有内容块及内容块组。
         *
         *      内容块或内容块组均支持搜索，内容块同时也支持分组搜索。
         *      内容块分组搜索的方法是在中括号中输入要搜索的组名，参看下方格式：
         *          [组名]
         *
         *      常规情况下无需用户输入组名，可点击搜索框右侧的下拉按钮，在弹出的内容块分类列表中选择即可。
         * @reference:
         *      OperatControl 操作控制画板类
        */
        var ContentBlockArea = (function () {
            function ContentBlockArea() {
                var _this = this;
                this.block = $(".design-control-layout-contents");
                this.search = $(".design-panel-control .search-content-input");
                this.categoryButton = $(".design-panel-control .search-choose-category");
                this.categoryListBox = $(".design-panel-control .search-choose-categories-box");
                this.prompt = $(".content-block-prompt");
                this.contentPreview = $(".content-block-preview");
                this.iconOnleyButton = $(".search-content-input-box .show-style .only-icon-style");
                this.detailButton = $(".search-content-input-box .show-style .detail-style");
                var my = this;
                var contentBlockTabPanel = $(".content-block-tab-panel");
                var contentBlockGroupTabPanel = $(".content-block-group-tab-panel");
                $(".select-content").on("click", function () {
                    contentBlockTabPanel.show();
                    contentBlockGroupTabPanel.hide();
                });
                $(".select-content-group").on("click", function () {
                    contentBlockTabPanel.hide();
                    contentBlockGroupTabPanel.show();
                });
                this.iconOnleyButton.on("click", function () {
                    var me = $(this);
                    if (!me.hasClass("sel")) {
                        my.detailButton.removeClass("sel");
                        me.addClass("sel");
                        my.getContents().removeClass("detail-list");
                    }
                }).addClass("sel");
                this.detailButton.on("click", function () {
                    var me = $(this);
                    if (!me.hasClass("sel")) {
                        my.iconOnleyButton.removeClass("sel");
                        me.addClass("sel");
                        my.getContents().addClass("detail-list");
                    }
                });
                this.prompt.on("mouseenter", function () { return _this.prompt.hide(); });
                var timer = Number.NaN;
                this.contentPreview.on("blur", function () {
                    _this.contentPreview.hide();
                });
                this.block.on("mouseenter", "li", function () {
                    var me = $(this);
                    var pos = me.offset();
                    my.prompt.text(me.attr("rel"));
                    var sub = (my.prompt.width() - me.width()) / 2;
                    pos.left -= sub;
                    pos.top += me.height() + 12;
                    my.prompt.css(pos).fadeIn(100);
                    window.clearTimeout(timer);
                    timer = window.setTimeout(function () { return my.prompt.hide(); }, 7000);
                }).on("mouseleave mousedown", "li", function () {
                    _this.prompt.hide();
                }).on("dblclick", "li", function () {
                    var me = $(this);
                    var prev = my.contentPreview.find(".preview").empty().text("正在加载 ...");
                    my.contentPreview.children(".preview-title").text("预览 - " + me.find("span").text());
                    my.contentPreview.show().focus().position({ of: me, offset: "0 0", my: "right bottom", at: "right top" });
                    var cb = new ContentBlock(me, function () {
                        var w = cb.Template.option.minwidth;
                        var tab = cb.Content.find(".tab");
                        if (tab.length) {
                            tab.find("> .tab-pages > .tab-page:eq(0)").addClass("sel");
                            tab.children(".tab-panel:eq(0)").show();
                        }
                        prev.empty().width((w > 400) ? w : 400).append(cb.Content);
                        TabPanelSetting.Apply();
                        // todo: undo/redo
                        DesignCanvas.DoResizeInterval();
                        my.contentPreview.position({ of: me, offset: "0 0", my: "right bottom", at: "right top" });
                    });
                    if (cb && cb.Content && cb.Template.contentType !== 0 /* Normal */) {
                        var w = cb.Template.option.minwidth;
                        prev.empty().width((w > 400) ? w : 400).append(cb.Content);
                        TabPanelSetting.Apply();
                        // todo: undo/redo
                        DesignCanvas.DoResizeInterval();
                        my.contentPreview.position({ of: me, offset: "0 0", my: "right bottom", at: "right top" });
                    }
                });
            }
            // 获得所有内容块
            ContentBlockArea.prototype.getContents = function () {
                return this.block.find("li");
            };
            // 内容块下拉列表框配置
            ContentBlockArea.prototype.categoryListBoxSetting = function () {
                var _this = this;
                var my = this;
                this.categoryButton.click(function (e) {
                    if (_this.categoryListBox.css("display") === "none") {
                        _this.categoryListBox.slideDown(200);
                        _this.categoryListBox.focus();
                        _this.categoryListBox.css("overflow","auto");
                    }
                    else {
                        _this.categoryListBox.slideUp(200);
                    }
                });
                this.categoryListBox.focusout(function () {
                    _this.categoryButton.trigger("click");
                });
                // 点击内容块分类下拉框中的某个分类时，则筛选该分类
                this.categoryListBox.on("click", "li", function () {
                    var showCategory = this.getAttribute("typename");
                    my.search.val(showCategory ? ("[" + $.trim(this.innerText) + "] 分类") : "").triggerHandler("keyup");
                    if (!showCategory) {
                        my.search.triggerHandler("focusout");
                        my.categoryButton.focus();
                    }
                    else {
                        my.search.triggerHandler("focus");
                    }
                    return false;
                });
            };
            // 搜索框配置
            ContentBlockArea.prototype.searchTextBoxSetting = function () {
                var my = this;
                this.search.focus(function () {
                    $(this).addClass("search-content-input-focus").select();
                }).focusout(function () {
                    if (!$.trim(this.value))
                        $(this).removeClass("search-content-input-focus");
                }).keyup(function () {
                    var v = $.trim(this.value);
                    var c = my.getContents();
                    if (!v) {
                        c.show();
                    }
                    else {
                        var category = v.match(/\[(.+?)\]/); // 判断是否搜索的是内容块分类
                        c.hide().filter(category ? ("[typename='" + $.trim(category[1]) + "']") : "[rel*='" + v + "']").show();
                    }
                });
            };
            // 激活所有内容块支持拖动
            ContentBlockArea.prototype.ActiveContentBlockDraggable = function () {
                var prompt = this.prompt;
                this.getContents().draggable({
                    addClasses: false,
                    appendTo: "#content-dragging-shelter",
                    helper: "clone",
                    opacity: 0.7,
                    revert: "invalid",
                    scroll: false,
                    start: function (event, ui) {
                        prompt.hide();
                        DesignCanvas.HiddenElement();
                        LayoutSetting.ReSet();
                        ContentPlaceholderDraggingIndicator.Create(ui.helper);
                    },
                    drag: function (event, ui) {
                        prompt.hide();
                        ContentPlaceholderDraggingIndicator.UpdateIndicator(ui.offset);
                    },
                    stop: function (event, ui) {
                        ContentPlaceholderDraggingIndicator.Reset();
                        prompt.hide();
                    }
                });
            };
            // 初始化内容块框
            ContentBlockArea.prototype.Init = function () {
                this.categoryListBoxSetting();
                this.searchTextBoxSetting();
                ContentBlockTemplateList.InitSystemTemplate();
            };
            // 添加分类到内容块分类下拉框
            ContentBlockArea.prototype.addCategory = function (categoryName) {
                if (this.categoryListBox.find("li[typename='" + categoryName + "']").length === 0) {
                    this.categoryListBox.append(ContentBlockArea._category_format.replace(/\{0\}/g, categoryName));
                }
            };
            // 加载所有内容块
            ContentBlockArea.prototype.LoadContentBlocks = function (rep) {
                if (rep.Success && rep.Success.toUpperCase() === "Y") {
                    var html = '';
                    var contentDatas = (new Function("return " + rep.Data + ";")());
                    if (contentDatas && contentDatas.length) {
                        for (var i = 0; i < contentDatas.length; i++) {
                            var obj = contentDatas[i];
                            var categoryName = obj.typename ? $.trim(obj.typename) : "系统";
                            var index = ContentBlockTemplateList.Push(new ContentBlockTemplate(0 /* Normal */, obj));
                            html += ContentBlockArea._format.replace(/\{0\}/g, obj.title).replace(/\{1\}/g, obj.ico).replace(/\{2\}/g, categoryName).replace(/\{3\}/g, index.toString()).replace(/\{4\}/g, "[" + categoryName + "]").replace(/\{5\}/g, obj.remark || "");
                            this.addCategory(categoryName);
                        }
                        this.block.append(html);
                        this.ActiveContentBlockDraggable(); // 激活所有内容块支持拖动
                    }
                }
                else {
                    this.block.append(rep.Data);
                }
            };
            ContentBlockArea._category_format = '<li typename="{0}">{0}</li>';
            ContentBlockArea._format = '<li dropType="2" rel="{0} {4}" remark="{5}" typename="{2}" template="{3}"><img onerror="imgError()" src="{1}" alt="" /><span>{0}</span></li>';
            return ContentBlockArea;
        })();
        PortalDesign.ContentBlockArea = ContentBlockArea;
        /**
         * 内容块组区域
         */
        var ContentBlockGroupArea = (function () {
            function ContentBlockGroupArea() {
                this.block = $(".content-block-group-tab-panel");
                ContentBlockGroupArea.blockStatic = $(".design-control-layout-content-group-box");
                this.search = this.block.find(".search-content-group-input");
                this.groupBox = ContentBlockGroupArea.groupBoxStatic = this.block.find(".design-control-layout-content-group");
            }
            ContentBlockGroupArea.prototype.Init = function () {
                var my = this;
                this.search.on("focusin", function () {
                    $(this).addClass("search-content-input-focus").select();
                }).on("focusout", function () {
                    if (!$.trim(this.value))
                        $(this).removeClass("search-content-input-focus");
                }).on("keyup", function () {
                    var v = $.trim(this.value);
                    var c = my.groupBox.children("li");
                    if (!v) {
                        c.show();
                    }
                    else {
                        c.hide().filter(':contains(' + v + ')').show();
                    }
                });
            };
            /**
             * 创建组
             *
             * @param name 组名称
             * @param html 组 HTML 内容
             */
            ContentBlockGroupArea.CreateGroup = function (name, html) {
                if (name) {
                    ajax("FillData.ashx", {
                        "action": "SavePortalBlockGroupHtml",
                        "PortalType": RequestDataObject.GetPortalType(),
                        "PBGName": name,
                        "Html": html,
                        "Remark": "",
                        "randData": new Date().getTime()
                    }, "json", function (data) {
                        if (data) {
                            if (data.Success !== "Y") {
                                alert(data.Data); // 异常消息，有可能是：名称重复、操作失败等
                            }
                            else {
                                $(".select-content-group").trigger("click");
                                ContentBlockGroupArea.BuildGroupItem(ContentBlockGroupArea.groupBoxStatic, {
                                    title: name,
                                    html: html,
                                    remark: ""
                                }, true);
                                ContentBlockGroupArea.blockStatic.stop().animate({ "scrollTop": ContentBlockGroupArea.groupBoxStatic.height() }, "fast", "swing");
                            }
                        }
                        else {
                            alert("创建内容块组失败！");
                        }
                    });
                }
            };
            /** 获取指定 key 的组数据 */
            ContentBlockGroupArea.GetGroupData = function (key) {
                for (var i in ContentBlockGroupArea.GroupData) {
                    if (ContentBlockGroupArea.GroupData && ContentBlockGroupArea.GroupData.hasOwnProperty(i)) {
                        var item = ContentBlockGroupArea.GroupData[i];
                        if (item.key === key)
                            return item;
                    }
                }
                return null;
            };
            /** 生成随机 Key */
            ContentBlockGroupArea.GenerateKey = function () {
                return String(new Date().getTime()) + String(Math.floor(Math.random() * 1000000));
            };
            ContentBlockGroupArea.HasKey = function (key) {
                return (ContentBlockGroupArea.GetGroupData(key) !== null);
            };
            /** 生成唯一 Key */
            ContentBlockGroupArea.GenerateUniqueKey = function () {
                var key = ContentBlockGroupArea.GenerateKey();
                return ContentBlockGroupArea.HasKey(key) ? ContentBlockGroupArea.GenerateUniqueKey() : key;
            };
            /** 使所有内容块组支持拖放 */
            ContentBlockGroupArea.ApplyDraggable = function (target) {
                target.draggable({
                    addClasses: false,
                    appendTo: "#content-group-dragging-shelter",
                    helper: "clone",
                    opacity: 0.7,
                    revert: "invalid",
                    scroll: false,
                    start: function (event, ui) {
                    },
                    drag: function (event, ui) {
                    },
                    stop: function (event, ui) {
                    } // 停止拖动
                });
            };
            ContentBlockGroupArea.BuildGroupItem = function (groupBox, item, apply) {
                if (apply === void 0) { apply = false; }
                item.key = ContentBlockGroupArea.GenerateUniqueKey();
                var jItem = $(ContentBlockGroupArea.format.replace(/\{0\}/g, item.key).replace(/\{1\}/g, item.title));
                jItem.appendTo(groupBox);
                if (apply) {
                    ContentBlockGroupArea.GroupData.push(item);
                    ContentBlockGroupArea.ApplyDraggable(jItem);
                }
            };
            /**
             * 加载内容块组
             *
             * @param data 内容块组的json数据
             */
            ContentBlockGroupArea.prototype.LoadContentGroups = function (data) {
                if (data) {
                    if (data.Success == "Y") {
                        var d = (new Function("return " + data.Data + ";")());
                        if (d && d.length > 0) {
                            ContentBlockGroupArea.GroupData = d;
                            for (var i in d) {
                                if (d.hasOwnProperty(i)) {
                                    var item = d[i];
                                    if ($.trim(item.html)) {
                                        ContentBlockGroupArea.BuildGroupItem(this.groupBox, item);
                                    }
                                }
                            }
                            ContentBlockGroupArea.ApplyDraggable(this.groupBox.find("li"));
                        }
                    }
                    else {
                        alert(data.Data);
                    }
                }
            };
            ContentBlockGroupArea.groupBoxStatic = null;
            ContentBlockGroupArea.blockStatic = null;
            ContentBlockGroupArea.format = '<li dropType="3" key="{0}">{1}</li>';
            ContentBlockGroupArea.GroupData = null;
            return ContentBlockGroupArea;
        })();
        PortalDesign.ContentBlockGroupArea = ContentBlockGroupArea;
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
                        c.stop();
                        inner.children().unwrap();
                    }
                }
            };
            return ContentScrolling;
        })();
        /**
         * @class: ContentBlockTemplate
         * @description: 表示内容块模版的基础类
        */
        var ContentBlockTemplate = (function () {
            function ContentBlockTemplate(contentType, option) {
                this.contentType = contentType;
                this.option = option;
            }
            return ContentBlockTemplate;
        })();
        PortalDesign.ContentBlockTemplate = ContentBlockTemplate;
        /**
         * @class: ContentBlockTemplateList
         * @description: 表示内容块模板列表的静态类
         * @remark:
         *      所有被加载到内容块列表的内容块，各自均代表一种内容块（模板），事实上，通过拖放内容块到画板面板中，即生成一个内容块的实例。
         *      用户可自由更改其默认的配置，自定义为所需的最终的内容块。
         *
         *      这些实例的模版被统一由 ContentBlockTemplateList 管理。
        */
        var ContentBlockTemplateList = (function () {
            function ContentBlockTemplateList() {
            }
            // 压入模版到列表，并返回该模版的索引号
            ContentBlockTemplateList.Push = function (t) {
                var list = ContentBlockTemplateList._list;
                var index = list.length;
                t.TemplateIndex = index;
                list.push(t);
                return index;
            };
            // 获取指定索引的模版
            ContentBlockTemplateList.GetTemplate = function (index) {
                return ContentBlockTemplateList._list[index];
            };
            // 初始化系统模版，例如：自定义内容的内容块模版和框架页面内容块模板
            ContentBlockTemplateList.InitSystemTemplate = function () {
                ContentBlockTemplateList.Push(new ContentBlockTemplate(1 /* FramePage */, {
                    title: "框架页面",
                    typename: "系统",
                    ico: "../../image/default-page.png",
                    list: 0,
                    head: 0,
                    minwidth: 0,
                    url: "",
                    opts: null
                }));
                ContentBlockTemplateList.Push(new ContentBlockTemplate(2 /* CustomContent */, {
                    title: "自定义内容块",
                    typename: "系统",
                    ico: "../../image/content-page.png",
                    list: 0,
                    head: 0,
                    minwidth: 0,
                    url: "",
                    opts: null
                }));
                ContentBlockTemplateList.Push(new ContentBlockTemplate(3 /* ImageContent */, {
                    title: "图片内容块",
                    typename: "系统",
                    ico: "../../image/content-image.png",
                    list: 0,
                    head: 0,
                    minwidth: 0,
                    url: "",
                    opts: null
                }));
            };
            ContentBlockTemplateList._list = [];
            return ContentBlockTemplateList;
        })();
        /**
         * @class: LayoutDefineList
         * @description: 表示布局定义列表的静态类
         * @remark:
         *      定义所有布局对应的定义 (HTML)，事实上，在拖动布局到设计画板(DesignCanvas)时，
         *      其实是所拖布局将对应的 HTML 插入到指定的位置（父布局）。
         *
         *      本类定义了所有支持的布局所对应的 HTML。
        */
        var LayoutDefineList = (function () {
            function LayoutDefineList() {
                this.initLayoutDefineList();
            }
            LayoutDefineList.GetInstance = function () {
                if (LayoutDefineList._instance === null)
                    LayoutDefineList._instance = new LayoutDefineList();
                return LayoutDefineList._instance;
            };
            // 初始化所有布局对应的 HTML
            LayoutDefineList.prototype.initLayoutDefineList = function () {
                this.LayoutList = {
                    //#region hor
                    "hor": '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region ver
                    "ver": '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region tab
                    "tab": '<table class="layout-table tab">' + '<tbody>' + '<tr>' + '<td>' + '<div class="content-placeholder theme-gray">' + '<img onerror="imgError()" class="setting" src="../../image/setting.png" alt="" />' + '<div class="title">' + '<img onerror="imgError()" class="title-image" src="../../image/content-default.png" alt="" />' + '<span class="title-span">标题</span>' + '<div class="title-func">' + '<a href="javascript:void(0)" class="refresh" title="刷新"><img onerror="imgError()" src="../../image/refresh.png" alt="" /><span>刷新</span></a>' + '</div>' + '<div class="title-pager"></div>' + '</div>' + '<div class="content">' + '<dl class="tab">' + '<dt class="tab-pages">' + '<a class="tab-page sel" hidefocus href="javascript:void(0)">标签1</a>' + '<a class="tab-page" hidefocus href="javascript:void(0)">标签2</a>' + '<a class="tab-page" hidefocus href="javascript:void(0)">标签3</a>' + '<a class="add" href="javascript:void(0)"><img onerror="imgError()" src="../../image/add.gif" title="添加" alt="添加" /></a>' + '</dt>' + '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' + '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' + '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' + '</dl>' + '</div>' + '</div>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-3col
                    "complex-3col": '<table class="layout-table hor complex-3col">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-a
                    "complex-a": '<table class="layout-table ver complex-a">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-b
                    "complex-b": '<table class="layout-table ver complex-b">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-c
                    "complex-c": '<table class="layout-table hor complex-c">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-d
                    "complex-d": '<table class="layout-table hor complex-d">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-e
                    "complex-e": '<table class="layout-table hor complex-e">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-f
                    "complex-f": '<table class="layout-table hor complex-f">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-g
                    "complex-g": '<table class="layout-table hor complex-g">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-h
                    "complex-h": '<table class="layout-table hor complex-h">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-i
                    "complex-i": '<table class="layout-table ver complex-i">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-j
                    "complex-j": '<table class="layout-table ver complex-j">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-k
                    "complex-k": '<table class="layout-table hor complex-k">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-l
                    "complex-l": '<table class="layout-table hor complex-l">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-m
                    "complex-m": '<table class="layout-table ver complex-m">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-n
                    "complex-n": '<table class="layout-table hor complex-n">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-o
                    "complex-o": '<table class="layout-table hor complex-o">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-p
                    "complex-p": '<table class="layout-table ver complex-p">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-q
                    "complex-q": '<table class="layout-table ver complex-q">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-r
                    "complex-r": '<table class="layout-table ver complex-r">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-s
                    "complex-s": '<table class="layout-table ver complex-s">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>',
                    //#endregion
                    //#region complex-t
                    "complex-t": '<table class="layout-table ver complex-t">' + '<tbody>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table ver">' + '<tbody>' + '<tr>' + '<td splitter="ver"><div class="empty-content"></div></td>' + '</tr>' + '<tr>' + '<td splitter="ver">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' + '<td splitter="hor">' + '<table class="layout-table hor">' + '<tbody>' + '<tr>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '<td splitter="hor"><div class="empty-content"></div></td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</td>' + '</tr>' + '</tbody>' + '</table>'
                };
            };
            // 获得指定名称的布局元素
            LayoutDefineList.GetLayout = function (name) {
                var html = LayoutDefineList.GetInstance().LayoutList[name];
                return html ? new Layout($(html), name) : null;
            };
            LayoutDefineList._instance = null;
            return LayoutDefineList;
        })();
        /**
         * @class: LoadingBox
         * @description: 表示加载框的静态类
         * @remark:
         *      加载框是指内容正在执行且未完成时，暂时显示的 loading 框，设计器提供两种加载框，两种之间的唯一区别是尺寸的大小。
         *
         *      可通过 LoadingBox 的静态方法创建不同尺寸的加载框，
         *      LoadingBox.CreateBigLoading() 静态方法用于创建大尺寸的加载框，当前主要用在 [预览] 准备过程时显示；
         *      LoadingBox.CreateSmallLoading() 静态方法用于创建较小尺寸的加载框，当前主要用于内容块的内容正在加载时显示。
        */
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
        /**
         * @class: ResizeCover
         * @description: 表示尺寸调整提示块(左-右两边)的类
         * @remark:
         *      尺寸调整提示块是在拖动横向布局之间的横向分割条时显示；
         *      显示的内容为分割条左右两边的布局的尺寸信息，
         *      这些尺寸信息包括：百分比信息，及对应的像素值信息。
         *
         *      尺寸信息在显示时，分为 “重点信息” 与 “相关信息” 两部分，重点信息将会以稍大字体显示；而相关信息则以较小字体显示。
         *      在当前布局的尺寸方式为百分比时 (关于尺寸方式的信息请参考 LayoutSizeUnit 枚举)，重点信息为百分比数据；反之在尺寸方式为像素时，重点信息为像素值。
         * @reference:
         *      LayoutSizeUnit 布局尺寸方式的单位枚举
         *      SplitterContainer 分割条容器封装类
        */
        var ResizeCover = (function () {
            function ResizeCover() {
                this.Left = $(".resize-cover.cover-left");
                this.Right = $(".resize-cover.cover-right");
                this.LeftValueText1 = this.Left.find(".size-value");
                this.LeftValueText2 = this.Left.find(".other-size-value");
                this.LeftUnitText1 = this.Left.find(".size-unit");
                this.LeftUnitText2 = this.Left.find(".other-size-unit");
                this.RightValueText1 = this.Right.find(".size-value");
                this.RightValueText2 = this.Right.find(".other-size-value");
                this.RightUnitText1 = this.Right.find(".size-unit");
                this.RightUnitText2 = this.Right.find(".other-size-unit");
            }
            // 开始创建调整的尺寸提示
            ResizeCover.Create = function (o, leftUnit, rightUnit) {
                if (ResizeCover._instance === null)
                    ResizeCover._instance = new ResizeCover();
                var c = ResizeCover._instance;
                c.Left.css(o).show();
                c.Right.css(o).show();
                if (leftUnit === 0 /* Percent */) {
                    c.LeftPercentText = c.LeftValueText1;
                    c.LeftPixelText = c.LeftValueText2;
                    c.LeftUnitText1.text("%");
                    c.LeftUnitText2.text("px");
                }
                else {
                    c.LeftPercentText = c.LeftValueText2;
                    c.LeftPixelText = c.LeftValueText1;
                    c.LeftUnitText1.text("px");
                    c.LeftUnitText2.text("%");
                }
                if (rightUnit === 0 /* Percent */) {
                    c.RightPercentText = c.RightValueText1;
                    c.RightPixelText = c.RightValueText2;
                    c.RightUnitText1.text("%");
                    c.RightUnitText2.text("px");
                }
                else {
                    c.RightPercentText = c.RightValueText2;
                    c.RightPixelText = c.RightValueText1;
                    c.RightUnitText1.text("px");
                    c.RightUnitText2.text("%");
                }
            };
            // 调整尺寸过程
            ResizeCover.Covering = function (left, right) {
                var c = ResizeCover._instance;
                if (c) {
                    c.Left.css(left.option);
                    c.LeftPercentText.text(left.percent);
                    c.LeftPixelText.text(left.option.width.toString());
                    c.Right.css(right.option);
                    c.RightPercentText.text((100 - left.percent));
                    c.RightPixelText.text(right.option.width.toString());
                }
            };
            // 停止提示
            ResizeCover.Stop = function () {
                if (ResizeCover._instance) {
                    ResizeCover._instance.Left.hide();
                    ResizeCover._instance.Right.hide();
                }
            };
            ResizeCover._instance = null;
            return ResizeCover;
        })();
        /**
         * @class: SplitterContainer
         * @description: 表示分割条容器的静态类
         * @remark:
         *      所有的分割条均使用 SplitterContainer 类来创建，SplitterContainer 同时也是存放所有分割条的容器。
         *
         *      通过使用 SplitterContainer.CreateSplitter() 函数创建分割条，而允许拖动的分割条仅限横向分割条，事因内容块的高度是跟随内容的高度自动变化。
         *
         *      每个分割条分别包含了数个按钮，包括：
         *          [选择分割条前面的布局] 按钮 - 三角形箭头，点击时可选择前一个布局（在横向两列布局中应该称之为 “左边的布局”，而在纵向两列布局中，应该称之为 “上方的布局”）；
         *          [选择分割条后面的布局] 按钮 - 三角形箭头，点击时可选择后一个布局（在横向两列布局中应该称之为 “右边的布局”，而在纵向两列布局中，应该称之为 “下方的布局”）；
         *          [同时选择分割条前后两个布局] 按钮 - 实心矩形，点击时可选择分割条两边的布局。
         *          [切换布局] 按钮 - 双三角形箭头，点击时可交换两边布局。
         * @reference:
         *      ResizeCover 尺寸调整提示块类
         *      Layout 布局类
        */
        var SplitterContainer = (function () {
            function SplitterContainer() {
                this.container = $(".layout-splitter-box");
                this.splitterElement = $(".design-element .layout-splitter");
                this.container.on("click", ".layout-splitter > .buttons > li.first", function () {
                    var me = $(this);
                    var split = me.closest(".layout-splitter");
                    var attach = split.data("attach");
                    if (attach && attach.length)
                        LayoutSetting.Attach(split.hasClass("hor") ? attach : attach.children());
                    return false;
                }).on("click", ".layout-splitter > .buttons > li.second", function () {
                    var me = $(this);
                    var split = me.closest(".layout-splitter");
                    var attach = split.data("attach");
                    if (attach && attach.length) {
                        var second = split.hasClass("hor") ? attach.next() : attach.next().children();
                        LayoutSetting.Attach(second);
                    }
                    return false;
                }).on("click", ".layout-splitter > .buttons > li.third", function () {
                    var me = $(this);
                    var split = me.closest(".layout-splitter");
                    var attach = split.data("attach");
                    if (attach && attach.length) {
                        LayoutSetting.Attach(attach.closest(".layout-table").parent());
                    }
                    return false;
                }).on("click", ".layout-splitter > .buttons > li.fourth", function () {
                    LayoutSetting.ReSet();
                    var me = $(this);
                    var split = me.closest(".layout-splitter");
                    var attach = split.data("attach");
                    if (attach && attach.length) {
                        SplitterContainer.DeleteAll("");
                        var second = attach.next();
                        var ac = attach.children().clone();
                        var se = second.children().clone();
                        attach.empty().append(se);
                        second.empty().append(ac);
                        var allElement = attach.add(second);
                        allElement.find(".content-placeholder[contenttype]").each(function (i, e) {
                            ContentBlock.ActiveDroppable(ContentBlock.ParseContentBlock($(this)));
                            return me;
                        });
                        var ec = allElement.find(".empty-content");
                        if (ec.length)
                            Layout.ActiveDroppable(ec);
                    }
                    return false;
                });
            }
            // 为布局创建分割条
            SplitterContainer.prototype.CreateSplitter = function (attach, direct) {
                var split = this.splitterElement.clone(true, true);
                split.addClass(direct);
                split.data("attach", attach).appendTo(this.container);
                attach.data("splitter", split);
                if (direct === "hor") {
                    var btns = split.children(".buttons");
                    split.draggable({
                        axis: "x",
                        opacity: 0.5,
                        containment: [0, 0, 0, 0],
                        start: function () {
                            DesignCanvas.HiddenElement();
                            DesignView.Resizable = false;
                            LayoutSetting.ReSet();
                            var o = splitterOptions["default"];
                            // 拖动开始时将分割条暂移动到画板的左上角
                            split.siblings().position({ of: DesignCanvas.Canvas, offset: o.offset, my: o.my, at: o.at });
                            btns.addClass("buttons-dragging"); // 拖动时隐藏分割条中的按钮
                            this["parentWidth"] = Math.floor(attach.parent().width());
                            var h = split.height(), n = attach.next();
                            var leftUnit = Number(attach.attr("sizeunit"));
                            var rightUnit = Number(n.attr("sizeunit"));
                            leftUnit = isNaN(leftUnit) ? 0 /* Percent */ : leftUnit;
                            rightUnit = isNaN(rightUnit) ? 0 /* Percent */ : rightUnit;
                            var condition = (rightUnit === 1 /* Pixel */);
                            this["settingLayout"] = condition ? n : attach;
                            this["settingLayoutSizeCondition"] = condition;
                            this["settingLayoutSizeUnit"] = condition ? rightUnit : leftUnit;
                            ResizeCover.Create({ top: split.position().top, height: h - 2, lineHeight: h + "px" }, leftUnit, rightUnit);
                        },
                        drag: function (event, o) {
                            var pos = attach.position();
                            var offset = attach.offset();
                            var pixSize = Math.floor(o.position.left - pos.left - 5); // 实际像素宽度尺寸
                            var w = Math.floor(this["parentWidth"]);
                            var nw = w - pixSize;
                            var percentSize = this["percentSize"] = Math.floor(pixSize / w * 100); // 对应百分比宽度尺寸
                            this["pixelSize"] = this["settingLayoutSizeCondition"] ? nw : pixSize;
                            this["settingLayout"].width(this["pixelSize"]);
                            ResizeCover.Covering({ option: { left: offset.left + 5, width: pixSize - 12 }, percent: percentSize }, { option: { left: offset.left + pixSize + 5, width: w - pixSize - 12 }, percent: 100 - percentSize });
                            $(document).trigger("splitterDrag", null);
                        },
                        stop: function () {
                            ResizeCover.Stop();
                            if (this["settingLayoutSizeUnit"] === 1 /* Pixel */) {
                                this["settingLayout"].width(this["pixelSize"]);
                            }
                            else {
                                this["settingLayout"].width(this["percentSize"] + "%");
                            }
                            DesignView.Resizable = true;
                            DesignCanvas.DoResizeInterval();
                            btns.removeClass("buttons-dragging");
                        }
                    });
                }
                return split;
            };
            // 创建分割条
            SplitterContainer.CreateSplitter = function (attach, direct) {
                if (SplitterContainer._instance === null)
                    SplitterContainer._instance = new SplitterContainer();
                return SplitterContainer._instance.CreateSplitter(attach, direct);
            };
            // 隐藏所有分割条
            SplitterContainer.HideAll = function () {
                if (SplitterContainer._instance === null)
                    SplitterContainer._instance = new SplitterContainer();
                SplitterContainer._instance.container.find(".layout-splitter").hide();
            };
            // 删除所有风格条，它将在需要的时候再次被创建
            SplitterContainer.DeleteAll = function (currentDirect) {
                if (SplitterContainer._instance === null)
                    SplitterContainer._instance = new SplitterContainer();
                SplitterContainer._instance.container.empty();
                $(".design-canvas td,.design-canvas tr").data("splitter", null);
                if (currentDirect === "ver")
                    $(".layout-table,.layout-table .empty-content,.content-placeholder").css({ "height": "auto", "min-height": "100px" });
            };
            SplitterContainer._instance = null;
            return SplitterContainer;
        })();
        // 分割器位置选项的默认值
        var splitterOptions = {
            "hor": {
                offset: "-5 5",
                my: "left top",
                at: "right top"
            },
            "ver": {
                offset: "5 -5",
                my: "left top",
                at: "left bottom"
            },
            "default": {
                offset: "0 0",
                my: "left top",
                at: "left top"
            }
        };
        (function (DroppableType) {
            DroppableType[DroppableType["None"] = 0] = "None";
            DroppableType[DroppableType["Layout"] = 1] = "Layout";
            DroppableType[DroppableType["ContentBlock"] = 2] = "ContentBlock";
            DroppableType[DroppableType["ContentBlockGroup"] = 3] = "ContentBlockGroup";
        })(PortalDesign.DroppableType || (PortalDesign.DroppableType = {}));
        var DroppableType = PortalDesign.DroppableType;
        /**
         * @class: Layout
         * @description: 表示布局基础类
         * @remark:
         *      布局是一个容器，支持拖放的目标到布局中；接受的对象可以是另外一个布局，或者一个内容块。
        */
        var Layout = (function () {
            function Layout(layout, name) {
                if (name === void 0) { name = ""; }
                this.Layout = layout;
                this.Name = name;
            }
            // 激活布局，使其支持拖放
            Layout.prototype.ActiveLayout = function () {
                TabGlobalBinder.FireSelection(this.Layout);
                if (this.Name === "tab") {
                    this.Layout.find("> tbody > tr > td > .content-placeholder > .content > dl.tab > dt.tab-pages").sortable({
                        axis: "x",
                        dropOnEmpty: false,
                        items: ".tab-page",
                        opacity: 0.5,
                        tolerance: "pointer",
                        start: function (e, ui) {
                            ui.helper.trigger("click");
                            this.srcIndex = ui.helper.index();
                        },
                        update: function (e, ui) {
                            var descIndex = ui.item.index();
                            var panels = ui.item.closest(".tab").find(".tab-panel");
                            panels.eq(this.srcIndex)[this.srcIndex < descIndex ? "insertAfter" : "insertBefore"](panels.eq(descIndex));
                        }
                    });
                }
                Layout.ActiveDroppable(this.Layout.find(".empty-content"));
                this.Layout.data("actived", true); // 标记为已激活
                return this;
            };
            // 使布局支持拖放
            Layout.ActiveDroppable = function (e) {
                return e.droppable({
                    accept: ".design-panel-control .design-control-layout-element li,.design-panel-control .design-control-layout-contents li, .design-control-layout-content-group li",
                    activeClass: "drop-active",
                    hoverClass: "drop-hover",
                    addClasses: false,
                    greedy: true,
                    activate: function (event, ui) {
                    },
                    deactivate: function (event, ui) {
                        $(".drop-active,.drop-hover").removeClass("drop-active drop-hover");
                    },
                    over: function (event, ui) {
                    },
                    out: function (event, ui) {
                    },
                    drop: function (event, ui) {
                        var me = $(this);
                        var p = me.parent();
                        switch (Number(ui.helper.attr("droptype"))) {
                            case 1 /* Layout */:
                                var layoutName = ui.helper.attr("layout");
                                var parentLayout = p.closest(".layout-table");
                                if (!parentLayout.length)
                                    p.removeClass("init-size"); // 则自动调整高度
                                if (layoutName) {
                                    var layout = LayoutDefineList.GetLayout(layoutName);
                                    if (layout) {
                                        me.replaceWith(layout.Layout);
                                        // todo: undo/redo
                                        layout.ActiveLayout();
                                        layout.Layout.find(".layout-table").each(function (i, elem) {
                                            var me = $(this);
                                            new Layout(me, "").ActiveLayout();
                                            return me;
                                        });
                                    }
                                }
                                break;
                            case 2 /* ContentBlock */:
                                var cb = new ContentBlock(ui.helper);
                                if (cb && cb.Content) {
                                    ContentBlock.ActiveDroppable(cb);
                                    me.replaceWith(cb.Content);
                                    TabPanelSetting.Apply();
                                    // todo: undo/redo
                                    DesignCanvas.DoResizeInterval();
                                }
                                break;
                            case 3 /* ContentBlockGroup */:
                                // todo: undo/redo
                                DesignCanvas.HtmlInitialize(me.parent(), ContentBlockGroupArea.GetGroupData(ui.helper.attr("key")).html);
                                break;
                        }
                    }
                });
            };
            // 删除指定布局（需提供该布局所在的父元素）
            Layout.Delete = function (layoutParent) {
                DesignView.Resizable = false;
                DesignCanvas.HiddenElement();
                if (layoutParent !== null && layoutParent.length > 0) {
                    if (layoutParent.hasClass("layout-top")) {
                        var empty = $(DesignCanvas.EmptyContent);
                        SplitterContainer.DeleteAll("");
                        layoutParent.empty().append(empty);
                        Layout.ActiveDroppable(empty);
                    }
                    else {
                        var direct = layoutParent.attr("splitter"); // 取得布局方向
                        if (direct) {
                            var sibling = (direct === "hor") ? layoutParent.siblings() : layoutParent.closest("tr").siblings();
                            if (sibling.length > 0) {
                                // 取得兄弟布局的内容
                                var siblingContent = (direct === "hor") ? sibling.children() : sibling.children("td").children();
                                // 取得当前布局所在的父布局
                                var layout = layoutParent.closest(".layout-table");
                                // 删除分割条 (如果有，它将在需要的时候再次被创建)
                                SplitterContainer.DeleteAll(direct);
                                // 立即执行一次所有布局调整
                                DesignCanvas.DoResizeInterval();
                                var isInTab = layout.closest("table.layout-table.tab").length > 0;
                                if (layout.siblings().length) {
                                    layout.remove();
                                }
                                else {
                                    layout.replaceWith(siblingContent);
                                }
                                //todo: undo/redo...
                                if (isInTab) {
                                    TabPanelSetting.Apply();
                                }
                            }
                        }
                    }
                }
                DesignView.Resizable = true;
                return false;
            };
            return Layout;
        })();
        PortalDesign.Layout = Layout;
        /**
         * @class: ContentBlock
         * @description: 表示内容块的类
         * @remark:
         *       内容块是指显示在指定布局上的块元素。
         *       内容块需要被填充到某个布局中，因此，在设计门户页时，首先需要设计布局，以便后续在布局上投放内容块。
         *
         *       内容块被投放到布局后，首先呈现默认的样式，内容块可能包含标题部分、内容部分，通过配置内容块可以设置为无标题。
         *
         *       内容块在加载时首先请求内容块的内容（异步），加载完毕后显示最终加载的结果；若加载失败则显示错误信息。
        */
        var ContentBlock = (function () {
            function ContentBlock(context, callbackFunc) {
                this.context = context;
                this.Template = null;
                if (context) {
                    var templateIndex = Number(context.attr("template"));
                    if (!isNaN(templateIndex))
                        this.Template = ContentBlockTemplateList.GetTemplate(templateIndex);
                    this.Content = $(this.PrevProcessing(ContentBlock._wrap_format)).attr("contentType", this.Template.contentType);
                    this.LoadContent(callbackFunc);
                }
            }
            // 使指定的对象被创建为 ContentBlock 对象
            ContentBlock.ParseContentBlock = function (content) {
                var c = new ContentBlock(null);
                c.Content = content;
                c.context = null;
                return c;
            };
            // 使内容块支持拖放
            ContentBlock.ActiveDroppable = function (cb) {
                cb.Content.droppable({
                    accept: ".design-panel-control .design-control-layout-contents li",
                    addClasses: false,
                    greedy: true,
                    tolerance: "pointer",
                    create: function (event, ui) {
                    },
                    activate: function (event, ui) {
                    },
                    deactivate: function (event, ui) {
                    },
                    over: function (event, ui) {
                        ContentPlaceholderDraggingIndicator.Anchor(cb.Content);
                    },
                    out: function (event, ui) {
                        ContentPlaceholderDraggingIndicator.Anchor(null);
                    },
                    drop: function (event, ui) {
                        var direct = ContentPlaceholderDraggingIndicator.GetDirect();
                        if (direct !== -1 /* Unknown */) {
                            var isHor = (direct === 0 /* Left */ || direct === 1 /* Right */);
                            //var isLeftUp: boolean = ( direct === DraggingIndicatorDirect.Left || direct === DraggingIndicatorDirect.Up );
                            //var layout: Layout = LayoutDefineList.GetLayout( isHor ? "hor" : "ver" );
                            //var firstSelector: string = ( isHor ? "> tbody > tr > td:first > .empty-content" : "> tbody > tr:first > td > .empty-content" );
                            //var secondSelector: string = ( isHor ? "> tbody > tr > td:last > .empty-content" : "> tbody > tr:last > td > .empty-content" );
                            //var clone: JQuery = cb.Content.clone();
                            var dropBlock = new ContentBlock(ui.draggable);
                            //var first: JQuery = isLeftUp ? dropBlock.Content : clone;
                            //var second: JQuery = isLeftUp ? clone : dropBlock.Content;
                            //layout.Layout.find( firstSelector ).replaceWith( first );
                            //layout.Layout.find( secondSelector ).replaceWith( second );
                            //cb.Content.replaceWith( layout.Layout );
                            //ContentBlock.ActiveDroppable( ContentBlock.ParseContentBlock( clone ) );
                            //ContentBlock.ActiveDroppable( dropBlock );
                            //layout.ActiveLayout();
                            if (isHor) {
                                var isLeftUp = (direct === 0 /* Left */ || direct === 2 /* Up */);
                                var layout = LayoutDefineList.GetLayout("hor");
                                var firstSelector = "> tbody > tr > td:first > .empty-content";
                                var secondSelector = "> tbody > tr > td:last > .empty-content";
                                var clone = cb.Content.clone();
                                var first = isLeftUp ? dropBlock.Content : clone;
                                var second = isLeftUp ? clone : dropBlock.Content;
                                layout.Layout.find(firstSelector).replaceWith(first);
                                layout.Layout.find(secondSelector).replaceWith(second);
                                cb.Content.replaceWith(layout.Layout);
                                ContentBlock.ActiveDroppable(ContentBlock.ParseContentBlock(clone));
                                layout.ActiveLayout();
                            }
                            else {
                                //cb.Content.closest( "td" ).off( "resize" );
                                if (direct === 2 /* Up */) {
                                    cb.Content.before(dropBlock.Content);
                                }
                                else {
                                    cb.Content.after(dropBlock.Content);
                                }
                                DesignCanvas.DoResizeInterval();
                            }
                            ContentBlock.ActiveDroppable(dropBlock);
                        }
                        TabPanelSetting.Apply();
                        ContentPlaceholderDraggingIndicator.Reset();
                    }
                });
            };
            // 执行预处理（标题及标题图标等处理）
            ContentBlock.prototype.PrevProcessing = function (format) {
                var result = format;
                if (this.Template) {
                    var o = this.Template.option;
                    var moreUrl = $.trim(o.moreurl);
                    result = result.replace(/\{0\}/g, o.ico ? o.ico : ContentBlock._default_content_image).replace(/\{1\}/g, o.title ? o.title : ContentBlock._default_content_title).replace(/\{3\}/g, o.remark).replace(/\{2\}/g, this.LoadOptions() + (this.Template.contentType !== 2 ? '<a href="javascript:void(0)" class="refresh" title="刷新"><img onerror="imgError()" src="../../image/refresh.png" alt="" /><span>刷新</span></a>' : "") + (moreUrl ? (ContentBlock._func_link_tag.replace(/\{0\}/g, moreUrl).replace(/\{1\}/g, DesignCanvas.GetMoreUrl(moreUrl)).replace(/\{2\}/g, "0").replace(/\{3\}/g, "0").replace(/\{4\}/g, "more-link").replace(/\{5\}/g, "../../image/more.png").replace(/\{7\}/g, "").replace(/\{6\}/g, "更多")) : ""));
                }
                return result;
            };
            // 加载完成
            ContentBlock.prototype.LoadComplete = function (content, addClass) {
                if (addClass === void 0) { addClass = ""; }
                this.Content.removeClass("load-fail");
                var contentBox = this.Content.children(".content");
                var c = contentBox.empty().removeClass("content-loading").append(content);
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
                this.LoadComplete('<img onerror="imgError()" src="../../image/warning.png" alt="" style="vertical-align: middle" /> 内容未能成功加载 ...');
                this.Content.children(".content").addClass("load-fail-bg");
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
                                DesignView.Header.append(inlineStyle[j]);
                            }
                        }
                        for (var k in outlineStyle) {
                            if (outlineStyle.hasOwnProperty(k)) {
                                this.Content.queue(resourceLoader, function () {
                                    //var link: JQuery = $( ContentBlock._outline_style_tag.replace(
                                    //                                /\{0\}/,
                                    //                                outlineStyle[i].match( ContentBlock._outline_style_format )[1]
                                    //                        ) );
                                    //link.on( "load", () => { this.Content.dequeue( resourceLoader ); } ).appendTo( DesignView.Header );
                                    //return jQuery.get( url, undefined, callback, "script" );
                                    $.get(outlineStyle[k].match(ContentBlock._outline_style_format)[1], undefined, function (data) {
                                        $(ContentBlock._style_format.replace(/\{0\}/, data)).on("load", function () { return _this.Content.dequeue(resourceLoader); }).appendTo(DesignView.Header);
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
            ContentBlock.prototype.LoadOptions = function () {
                var result = "";
                var o = this.Template.option.opts;
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        var item = o[i];
                        var ico = $.trim(item.ico);
                        result += ContentBlock._func_link_tag.replace(/\{0\}/g, item.url).replace(/\{1\}/g, DesignCanvas.GetMoreUrl(item.url)).replace(/\{2\}/g, item.width.toString()).replace(/\{3\}/g, item.height.toString()).replace(/\{4\}/g, "").replace(/\{5\}/g, ico ? "" : ico).replace(/\{7\}/g, ico ? "" : "hide").replace(/\{6\}/g, item.title);
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
                            result += format.replace("{0}", '<img onerror="imgError()" src="../../image/first-page.png" alt="上一页" title="上一页" />').replace("{1}", p.prevPage.toString()).replace("{2}", ' class="first-page' + (p.pageIndex === p.prevPage ? " sel" : "") + '"');
                            var interval = p.GetPageCodeInterval(3);
                            for (var i = interval.start; i <= interval.end; i++) {
                                result += format.replace("{0}", i.toString()).replace("{1}", i.toString()).replace("{2}", i === p.pageIndex ? ' class="sel"' : "");
                            }
                            result += format.replace("{0}", '<img onerror="imgError()" src="../../image/last-page.png" alt="下一页" title="下一页" />').replace("{1}", p.nextPage.toString()).replace("{2}", ' class="last-page' + (p.pageIndex === p.nextPage ? " sel" : "") + '"');
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
                    if (this.Template) {
                        o = this.Template.option;
                        url = o.url;
                        contentPart.attr("href", url).attr("originalHref", url);
                        contentType = this.Template.contentType;
                        my.Content.attr("islist", isList = Number(this.Template.option.list));
                        my.Content.attr("ishead", isHead = Number(this.Template.option.head));
                        my.Content.attr("minwidth", minWidth = Number(this.Template.option.minwidth));
                    }
                    else {
                        url = contentPart.attr("href");
                        contentType = Number(this.Content.attr("contenttype"));
                        isList = Number(my.Content.attr("islist"));
                        isHead = Number(my.Content.attr("ishead"));
                        minWidth = Number(my.Content.attr("minwidth"));
                    }
                    if (!(isList === 1)) {
                        my.Content.find(".title-pager").remove();
                    }
                    switch (contentType) {
                        case 0 /* Normal */:
                            if (!url) {
                                my.LoadFail("");
                                return;
                            }
                            var pageSize = Number(contentPart.attr("pagesize"));
                            pageSize = (isNaN(pageSize) ? 8 : pageSize);
                            var pageIndex = Number(contentPart.attr("pageIndex"));
                            pageIndex = (isNaN(pageIndex) ? 1 : pageIndex);
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
                        case 3 /* ImageContent */:
                            this.LoadComplete("", "image-content-block");
                            return;
                    }
                    my.LoadFail("");
                }
                catch (msg) {
                }
            };
            // 内容块外框
            ContentBlock._wrap_format = '<div class="content-placeholder theme-gray" remark="{3}">' + '<img onerror="imgError()" class="setting" src="../../image/setting.png" alt="高级配置" title="高级配置" />' + '<div class="title">' + '<img onerror="imgError()" class="title-image" src="{0}" alt="折叠/展示内容块" title="折叠/展示内容块" />' + '<span class="title-span" title="{1} - 双击此处编辑标题">{1}</span>' + '<div class="title-func">' + '{2}' + '</div>' + '<div class="title-pager"></div>' + '</div>' + '<div class="content content-loading">' + '<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>' + '</div>' + '</div>';
            ContentBlock._default_content_image = "../../image/content-default.png";
            ContentBlock._default_content_title = "尚无标题";
            ContentBlock._resource_format = /(\<style.*?\>[\s\S]*?\<\/style\>)|(\<link.*?\>)|(\<script.*?\>[\s\S]*?\<\/script\>)/ig; // 资源正则表达式
            ContentBlock._outline_script_format = /\<script.*?src\s*\=\s*['"]+(.*?)['"]+.*?\>[\s\S]*?\<\/script\>/i;
            ContentBlock._inline_script_format = /\<script.*?\>([\s\S]*?)\<\/script\>/i;
            ContentBlock._outline_style_format = /\<link.*?href\s*\=\s*['"]+(.*?)['"]+.*?\>/i;
            ContentBlock._inline_style_format = /\<style.*?\>([\s\S]*?)\<\/style\>/i;
            ContentBlock._outline_style_tag = '<link rel="stylesheet" href="{0}" />';
            ContentBlock._func_link_tag = '<a dataurl="{1}" url="{1}" href="javascript:void(0)" onclick="javascript:openWindow(this.url, {2}, {3});return false;" rel="{0}" opensize="{2}, {3}" class="{4}"><img onerror="imgError()" src="{5}" class="{7}" title="{6}" alt="{6}" /><span>{6}</span></a>';
            ContentBlock.ResourceIndex = 0;
            ContentBlock._style_format = '<style type="text/css">{0}</style>';
            return ContentBlock;
        })();
        PortalDesign.ContentBlock = ContentBlock;
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
         * @class: QuickSettingMenu
         * @description: 配置的快捷菜单
        */
        var SettingShortcutMenu = (function () {
            function SettingShortcutMenu() {
                var _this = this;
                this.shortcutMenu = null;
                this.TargetContent = null;
                this.shortcutMenu = $(".setting-shortcut-menu");
                this.shortcutMenu.on("blur", function () {
                    _this.TargetContent = null;
                    _this.shortcutMenu.hide();
                    return false;
                }).on("mouseenter", function () {
                    _this.shortcutMenu.off("blur");
                }).on("mouseleave", function () {
                    _this.shortcutMenu.on("blur", function () {
                        _this.TargetContent = null;
                        _this.shortcutMenu.hide();
                        return false;
                    });
                });
                var contentTitle = this.shortcutMenu.find(".setting-toggle-title");
                contentTitle.on("click", function () {
                    var title = _this.TargetContent.children(".title");
                    var toggle = (title.css("display") === "none");
                    if (_this.TargetContent !== null) {
                        if (toggle) {
                            contentTitle.text("隐藏标题栏");
                            title.show();
                            _this.TargetContent.addClass("theme-gray");
                        }
                        else {
                            contentTitle.text("显示标题栏");
                            title.hide();
                            _this.TargetContent.removeClass("theme-blue theme-gray");
                        }
                        _this.shortcutMenu.hide();
                    }
                });
                this.shortcutMenu.find(".setting-background-blue").on("click", function () {
                    if (_this.TargetContent !== null) {
                        _this.TargetContent.removeAttr("style").removeClass("theme-gray theme-tran").addClass("theme-blue").children(".title").show();
                        _this.TargetContent.find(".title,.title *,.bottom,.bottom *").removeAttr("style");
                        _this.shortcutMenu.hide();
                    }
                });
                this.shortcutMenu.find(".setting-background-gray").on("click", function () {
                    if (_this.TargetContent !== null) {
                        _this.TargetContent.removeAttr("style").removeClass("theme-blue theme-tran").addClass("theme-gray").children(".title").show();
                        _this.TargetContent.find(".title,.title *,.bottom,.bottom *").removeAttr("style");
                        _this.shortcutMenu.hide();
                    }
                });
                this.shortcutMenu.find(".setting-background-none").on("click", function () {
                    if (_this.TargetContent !== null) {
                        _this.TargetContent.removeAttr("style").removeClass("theme-blue theme-gray").addClass("theme-tran");
                        _this.TargetContent.find(".title,.title *,.bottom,.bottom *").removeAttr("style");
                        _this.shortcutMenu.hide();
                    }
                });
                var pageSettingBox = $(".page-setting-box");
                var pageSettingWidth = pageSettingBox.width();
                var win = $(window);
                win.on("resize scroll", function () {
                    if (pageSettingBox.css("display") !== "none") {
                        pageSettingBox.stop().animate({
                            left: (win.width() - pageSettingWidth) / 2,
                            top: win.scrollTop() + (win.height() - pageSettingBox.height()) / 2
                        }, 300, "swing");
                    }
                });
                var pagerSettingBoxSlider = pageSettingBox.find(".pager-setting-box-slider");
                var quickSettingBoxSlider = pageSettingBox.find(".quick-setting-box-slider");
                var autoRefreshSettingBoxSlider = pageSettingBox.find(".auto-refresh-setting-box-slider");
                var contentScrollingBoxSlider = pageSettingBox.find(".content-scrolling-box-slider");
                var defaultShowSettingBoxSlider = pageSettingBox.find(".default-show-setting-box-slider");
                var heightSettingBoxSlider = pageSettingBox.find(".height-setting-box-slider");
                pageSettingBox.find(".setting-dialog-btns-cancel").on("click", function () {
                    heightSettingBoxSlider.hide();
                    pagerSettingBoxSlider.hide();
                    quickSettingBoxSlider.hide();
                    autoRefreshSettingBoxSlider.hide();
                    contentScrollingBoxSlider.hide();
                    defaultShowSettingBoxSlider.hide();
                    pageSettingBox.hide();
                });
                var my = this;
                pageSettingBox.find(".is-show-title-icon").on("click", function () {
                    if (my.TargetContent !== null) {
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find("> .title > .title-image").show();
                        }
                        else {
                            my.TargetContent.find("> .title > .title-image").hide();
                        }
                    }
                });
                pageSettingBox.find(".is-show-pager").on("click", function () {
                    if (my.TargetContent !== null) {
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find(".title-pager").show();
                            pageSettingBox.find(".is-use-content-scrolling").attr({ "checked": false, "disabled": "disabled" });
                        }
                        else {
                            my.TargetContent.find(".title-pager").hide();
                            pageSettingBox.find(".is-use-content-scrolling").attr({ "disabled": false });
                        }
                    }
                });
                pageSettingBox.find(".is-use-auto-refresh").on("click", function () {
                    if (my.TargetContent !== null) {
                        var ckd = ($(this).attr("checked") === "checked");
                        my.TargetContent.attr("autorefresh", ckd.toString());
                        if (ckd) {
                            var val = Number(my.TargetContent.attr("refreshinterval"));
                            if (isNaN(val)) {
                                val = 60;
                                my.TargetContent.attr("refreshinterval", "60");
                                pageSettingBox.find(".auto-refresh-interval").val("60");
                            }
                            AutoRefresher.ApplyAutoRefresh(my.TargetContent, val);
                        }
                        else {
                            AutoRefresher.CancelAutoRefresh(my.TargetContent);
                        }
                    }
                });
                pageSettingBox.find(".is-use-content-scrolling").on("click", function () {
                    if (my.TargetContent !== null) {
                        var ckd = ($(this).attr("checked") === "checked");
                        var sp = pageSettingBox.find(".is-show-pager");
                        my.TargetContent.attr("contentscrolling", ckd.toString());
                        if (ckd) {
                            sp.attr({ "checked": false, "disabled": "disabled" });
                            my.TargetContent.find(".title-pager").hide();
                            ContentScrolling.ApplyContentScrolling(my.TargetContent);
                        }
                        else {
                            sp.attr({ "disabled": false });
                            ContentScrolling.CancelContentScrolling(my.TargetContent);
                        }
                    }
                });
                pageSettingBox.find(".is-show-quick-btns").on("click", function () {
                    if (my.TargetContent !== null) {
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find(".title-func").show();
                        }
                        else {
                            my.TargetContent.find(".title-func").hide();
                        }
                    }
                });
                pageSettingBox.find(".auto-refresh-interval").on("blur", function () {
                    if (my.TargetContent !== null) {
                        var me = $(this);
                        var v = $.trim(me.val());
                        var interval = Number(v);
                        interval = (isNaN(interval) || interval < 60) ? 60 : interval;
                        me.val(interval.toString());
                        my.TargetContent.attr("refreshinterval", interval.toString());
                        if (pageSettingBox.find(".is-use-auto-refresh").attr("checked") === "checked") {
                            AutoRefresher.ApplyAutoRefresh(my.TargetContent, interval);
                        }
                    }
                }).on("focus", function () {
                    $(this).select();
                });
                pageSettingBox.find(".page-size").on("blur", function () {
                    if (my.TargetContent !== null && my.TargetContent.attr("contenttype") === "0") {
                        var me = $(this);
                        var v = $.trim(me.val());
                        var size = Number(v);
                        size = (isNaN(size) || size < 1) ? 8 : size;
                        me.val(size.toString());
                        var targetContent = my.TargetContent.children(".content");
                        var targetSize = Number(targetContent.attr("pagesize"));
                        targetSize = (isNaN(targetSize) || targetSize < 1 ? 8 : targetSize);
                        if (size !== targetSize) {
                            targetContent.attr("pagesize", size);
                            ContentBlock.ParseContentBlock(my.TargetContent).LoadContent();
                        }
                    }
                }).on("focus", function () {
                    $(this).select();
                });
                pageSettingBox.find(".page-index").on("blur", function () {
                    if (my.TargetContent !== null && my.TargetContent.attr("contenttype") === "0") {
                        var me = $(this);
                        var v = $.trim(me.val());
                        var size = Number(v);
                        size = (isNaN(size) || size < 1) ? 1 : size;
                        me.val(size.toString());
                        var targetContent = my.TargetContent.children(".content");
                        var targetSize = Number(targetContent.attr("pageindex"));
                        targetSize = (isNaN(targetSize) || targetSize < 1 ? 8 : targetSize);
                        if (size !== targetSize) {
                            targetContent.attr("pageindex", size);
                            ContentBlock.ParseContentBlock(my.TargetContent).LoadContent();
                        }
                    }
                }).on("focus", function () {
                    $(this).select();
                });
                pageSettingBox.find(".system-btn-refresh-link").on("click", function () {
                    if (my.TargetContent !== null && my.TargetContent.attr("contenttype") !== "2") {
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find(".title-func > .refresh").show();
                        }
                        else {
                            my.TargetContent.find(".title-func > .refresh").hide();
                        }
                    }
                });
                pageSettingBox.find(".system-btn-help-link").on("click", function () {
                    if (my.TargetContent !== null) {
                        var help = my.TargetContent.find(".title-func > .help");
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find(".title-func").append('<a href="javascript: void(0)" class="help"><img onerror="imgError()" src="../../image/cb-help.png" alt="帮助" /><span>帮助</span></a>');
                        }
                        else {
                            help.remove();
                        }
                    }
                });
                pageSettingBox.find(".system-btn-more-link").on("click", function () {
                    if (my.TargetContent !== null && my.TargetContent.attr("contenttype") === "0") {
                        if ($(this).attr("checked") === "checked") {
                            my.TargetContent.find(".title-func > .more-link").show();
                        }
                        else {
                            my.TargetContent.find(".title-func > .more-link").hide();
                        }
                    }
                });
                pageSettingBox.find(".pager-on-position-top").on("click", function () {
                    var title = my.TargetContent.find("> .title");
                    var title_pager = title.find("> .title-pager");
                    var bottom = my.TargetContent.find("> .bottom");
                    var holder_pager = bottom.find("> .title-pager");
                    if (!title_pager.length && holder_pager.length) {
                        holder_pager.appendTo(title);
                    }
                    if (bottom.children().length === 0) {
                        bottom.remove();
                    }
                });
                pageSettingBox.find(".pager-on-position-bottom").on("click", function () {
                    var title = my.TargetContent.find("> .title");
                    var title_pager = title.find("> .title-pager");
                    var bottom = my.TargetContent.find("> .bottom");
                    if (!bottom || !bottom.length) {
                        bottom = $('<div class="bottom"></div>');
                        bottom.appendTo(my.TargetContent);
                    }
                    var holder_pager = bottom.find("> .title-pager");
                    if (!holder_pager.length && title_pager.length) {
                        title_pager.appendTo(bottom);
                    }
                });
                pageSettingBox.find(".quick-on-position-top").on("click", function () {
                    var title = my.TargetContent.find("> .title");
                    var title_func = title.find("> .title-func");
                    var bottom = my.TargetContent.find("> .bottom");
                    var holder_func = bottom.find("> .title-func");
                    if (!title_func.length && holder_func.length) {
                        holder_func.appendTo(title);
                    }
                    if (bottom.children().length === 0) {
                        bottom.remove();
                    }
                });
                pageSettingBox.find(".quick-on-position-bottom").on("click", function () {
                    var title = my.TargetContent.find("> .title");
                    var title_func = title.find("> .title-func");
                    var bottom = my.TargetContent.find("> .bottom");
                    if (!bottom || !bottom.length) {
                        bottom = $('<div class="bottom"></div>');
                        bottom.appendTo(my.TargetContent);
                    }
                    var holder_func = bottom.find("> .title-func");
                    if (!holder_func.length && title_func.length) {
                        title_func.appendTo(bottom);
                    }
                });
                pageSettingBox.find(".height-setting-box-slider .content-height").on("blur", function () {
                    if (my.TargetContent !== null && Number(my.TargetContent.attr("islist")) !== 1) {
                        var me = $(this);
                        var v = $.trim(me.val());
                        var size = Number(v);
                        if (!isNaN(size) && size > 29) {
                            my.TargetContent.css("cssText", "height: " + size + "px !important");
                        }
                        else {
                            me.val(String(my.TargetContent.height()));
                        }
                        $(document).trigger("splitterDrag", null);
                    }
                }).on("focus", function () {
                    $(this).select();
                });
                this.shortcutMenu.find(".setting-color-scheme").on("click", function () {
                    ColorScheme.Show(my.TargetContent);
                    _this.shortcutMenu.hide();
                });
                this.shortcutMenu.find(".setting-background-pageSetting").on("click", function () {
                    $(".setting-dialog").hide();
                    heightSettingBoxSlider.hide();
                    pagerSettingBoxSlider.hide();
                    quickSettingBoxSlider.hide();
                    autoRefreshSettingBoxSlider.hide();
                    contentScrollingBoxSlider.hide();
                    defaultShowSettingBoxSlider.hide();
                    if (_this.TargetContent !== null) {
                        if (Number(_this.TargetContent.attr("islist")) !== 1) {
                            heightSettingBoxSlider.show();
                            pageSettingBox.find(".height-setting-box-slider .content-height").val(String(_this.TargetContent.height()));
                        }
                        var ct = my.TargetContent.attr("contenttype");
                        pageSettingBox.find(".is-show-title-icon").attr("checked", (_this.TargetContent.find("> .title > .title-image:visible").length > 0).toString());
                        if (ct === "0") {
                            autoRefreshSettingBoxSlider.show();
                            contentScrollingBoxSlider.show();
                            pageSettingBox.find(".is-use-content-scrolling").removeAttr("checked").removeAttr("disabled");
                            pageSettingBox.find(".is-show-pager").removeAttr("disabled");
                            // 分页 -----------------
                            var pager = _this.TargetContent.find(".title-pager");
                            if (pager && pager.length) {
                                pagerSettingBoxSlider.show();
                                var isPagerShowing = pager.css("display") !== "none";
                                pageSettingBox.find(".is-show-pager").attr("checked", isPagerShowing.toString()).parent().show();
                                pageSettingBox.find(".pager-on-position-box").show();
                                if (_this.TargetContent.find("> .title > .title-pager").length) {
                                    pageSettingBox.find(".pager-on-position-top").attr("checked", "checked");
                                }
                                if (_this.TargetContent.find("> .bottom > .title-pager").length) {
                                    pageSettingBox.find(".pager-on-position-bottom").attr("checked", "checked");
                                }
                                if (isPagerShowing) {
                                    _this.TargetContent.attr("contentscrolling", "false");
                                    pageSettingBox.find(".is-use-content-scrolling").attr({ "checked": false, "disabled": true });
                                }
                                else {
                                    pageSettingBox.find(".is-use-content-scrolling").removeAttr("disabled");
                                }
                            }
                            else {
                                pageSettingBox.find(".is-show-pager").removeAttr("checked").parent().hide();
                                pageSettingBox.find(".pager-on-position-box").hide();
                            }
                            var targetContent = _this.TargetContent.find(".content");
                            var pageSize = Number(targetContent.attr("pagesize"));
                            pageSettingBox.find(".page-size").val(String(isNaN(pageSize) || pageSize === 0 ? 8 : pageSize));
                            var pageIndex = Number(targetContent.attr("pageindex"));
                            pageSettingBox.find(".page-index").val(String(isNaN(pageIndex) || pageSize === 0 ? 1 : pageIndex));
                            // 是否滚动内容 -----------------
                            if (_this.TargetContent.attr("contentscrolling") === "true") {
                                pageSettingBox.find(".is-use-content-scrolling").attr("checked", "checked");
                                pageSettingBox.find(".is-show-pager").attr({ "checked": false, "disabled": true });
                                _this.TargetContent.find(".title-pager").hide();
                            }
                            // 是否自动刷新 -----------------
                            var ri = Number(_this.TargetContent.attr("refreshinterval"));
                            ri = isNaN(ri) ? 60 : ri;
                            pageSettingBox.find(".auto-refresh-interval").val(ri.toString());
                            pageSettingBox.find(".is-use-auto-refresh").attr("checked", (_this.TargetContent.attr("autorefresh") === "true").toString());
                        }
                        if (ct === "1") {
                            pageSettingBox.find(".system-btn-more-link-box").hide();
                        }
                        else {
                            pageSettingBox.find(".system-btn-more-link-box").show();
                        }
                        // 快捷按钮 -----------------
                        if (ct !== "2") {
                            var quickBtn = _this.TargetContent.find(".title-func");
                            if (quickBtn && quickBtn.length) {
                                pageSettingBox.find(".is-show-quick-btns").attr("checked", (quickBtn.css("display") !== "none").toString()).parent().show();
                                quickSettingBoxSlider.show();
                            }
                            else {
                                pageSettingBox.find(".is-show-quick-btns").removeAttr("checked").parent().hide();
                                quickSettingBoxSlider.hide();
                            }
                            if (_this.TargetContent.find("> .title > .title-func").length) {
                                pageSettingBox.find(".quick-on-position-top").attr("checked", "checked");
                            }
                            else {
                                pageSettingBox.find(".quick-on-position-top").removeAttr("checked");
                            }
                            if (_this.TargetContent.find("> .bottom > .title-func").length) {
                                pageSettingBox.find(".quick-on-position-bottom").attr("checked", "checked");
                            }
                            else {
                                pageSettingBox.find(".quick-on-position-bottom").removeAttr("checked");
                            }
                            var moreLink = _this.TargetContent.find(".title-func > .more-link");
                            if (moreLink && moreLink.length) {
                                pageSettingBox.find(".system-btn-more-link").attr("checked", (moreLink.css("display") !== "none").toString()).parent().show();
                            }
                            else {
                                pageSettingBox.find(".system-btn-more-link").removeAttr("checked").parent().hide();
                            }
                            var refreshLink = _this.TargetContent.find(".title-func > .refresh");
                            if (refreshLink && refreshLink.length) {
                                pageSettingBox.find(".system-btn-refresh-link").attr("checked", (refreshLink.css("display") !== "none").toString()).parent().show();
                            }
                            else {
                                pageSettingBox.find(".system-btn-refresh-link").removeAttr("checked").parent().hide();
                            }
                            var helpLink = _this.TargetContent.find(".title-func > .help");
                            if (helpLink && helpLink.length) {
                                pageSettingBox.find(".system-btn-help-link").attr("checked", "checked");
                            }
                            else {
                                pageSettingBox.find(".system-btn-help-link").removeAttr("checked");
                            }
                        }
                        else {
                            defaultShowSettingBoxSlider.show();
                        }
                        // 显示高级配置框 -----------------
                        pageSettingBox.css({
                            left: (win.width() - pageSettingWidth) / 2,
                            top: (win.height() + win.scrollTop() - pageSettingBox.height() - 50) / 2
                        }).show();
                        win.trigger("resize");
                        _this.shortcutMenu.hide();
                    }
                    else {
                        pageSettingBox.hide();
                    }
                });
                this.shortcutMenu.find(".setting-delete-contentblock").on("click", function () {
                    if (_this.TargetContent !== null) {
                        if (_this.TargetContent.siblings().length) {
                            var isTab = _this.TargetContent.closest("table.layout-table.tab").length > 0;
                            _this.TargetContent.remove();
                            if (isTab) {
                                TabPanelSetting.Apply();
                            }
                        }
                        else {
                            var empty = $(DesignCanvas.EmptyContent);
                            // 若删除的内容块是 标签页布局
                            var layoutTab = _this.TargetContent.parent("td").parent("tr").parent("tbody").parent("table.layout-table.tab");
                            if (layoutTab.length) {
                                layoutTab.replaceWith(empty);
                                SplitterContainer.DeleteAll("ver");
                            }
                            else {
                                _this.TargetContent.replaceWith(empty);
                            }
                            Layout.ActiveDroppable(empty);
                        }
                        _this.shortcutMenu.hide();
                        DesignCanvas.Canvas.trigger("resize");
                        DesignCanvas.DoResizeInterval();
                    }
                });
            }
            SettingShortcutMenu.GetInstance = function () {
                if (SettingShortcutMenu._instance === null)
                    SettingShortcutMenu._instance = new SettingShortcutMenu();
                return SettingShortcutMenu._instance;
            };
            SettingShortcutMenu.prototype.Anchor = function (target, setting) {
                var o = setting.offset();
                o.top += 24;
                o.left -= 129;
                this.shortcutMenu.css(o).find(".setting-toggle-title").text((target.children(".title").css("display") === "none") ? "显示标题栏" : "隐藏标题栏");
                this.shortcutMenu.slideDown(100).focus();
                this.TargetContent = target;
            };
            SettingShortcutMenu.Anchor = function (target, setting) {
                SettingShortcutMenu.GetInstance().Anchor(target, setting);
            };
            SettingShortcutMenu._instance = null;
            return SettingShortcutMenu;
        })();
        /**
         * 内容块组框
         */
        var ContentGroupBox = (function () {
            function ContentGroupBox() {
            }
            ContentGroupBox.GetBox = function () {
                if (ContentGroupBox.box === null) {
                    var box = ContentGroupBox.box = $(".content-group-name-box");
                    var win = $(window);
                    var name = box.find(".input");
                    win.on("resize scroll", function () {
                        if (box.css("display") !== "none") {
                            box.show().stop().animate({
                                left: (win.width() - box.width()) / 2,
                                top: (win.height() - box.height()) / 2 + win.scrollTop()
                            }, 300, "swing");
                        }
                    });
                    box.find(".btn-apply").on("click", function () {
                        var v = name.val();
                        v = $.trim(v);
                        if (!v) {
                            alert("请输入内容块组的名称。");
                            name.focus().select();
                        }
                        else {
                            ContentBlockGroupArea.CreateGroup(v, ContentGroupBox.html);
                            box.hide();
                        }
                    });
                    box.find(".btn-cancel").on("click", function () {
                        box.hide();
                    });
                }
                return ContentGroupBox.box;
            };
            ContentGroupBox.Show = function (html) {
                html = $.trim(html);
                var box = ContentGroupBox.GetBox();
                var win = $(window);
                if (html) {
                    ContentGroupBox.html = html;
                    box.show().stop().animate({
                        left: (win.width() - box.width()) / 2,
                        top: (win.height() - box.height()) / 2 + win.scrollTop()
                    }, 300, "swing");
                    box.find(".input").focus().val("");
                }
            };
            ContentGroupBox.box = null;
            ContentGroupBox.html = "";
            return ContentGroupBox;
        })();
        /** 布局配置框 */
        var LayoutSetting = (function () {
            function LayoutSetting() {
                var _this = this;
                this.cover = null;
                this.box = null;
                this.target = null;
                this.btnDel = null;
                this.btnSaveAsGroup = null;
                this.btnWidthSetting = null;
                this.btnClose = null;
                this.cover = $(".layout-setting-cover");
                this.box = $(".layout-setting-buttons-box");
                this.btnDel = this.box.find(".setting-btn-delete-layout");
                this.btnClose = this.box.find(".setting-btn-close");
                this.btnSaveAsGroup = this.box.find(".setting-btn-save-as-group");
                this.btnWidthSetting = this.box.find(".setting-btn-pixed");
                this.btnClose.on("click", function () { return _this.ReSet(); });
                this.btnDel.on("click", function () {
                    if (_this.target && _this.target.length) {
                        // todo: redo/undo
                        Layout.Delete(_this.target);
                        _this.ReSet();
                    }
                });
                this.btnWidthSetting.on("click", function () {
                    if (_this.target && _this.target.length) {
                        _this.target.trigger("dblclick");
                        _this.ReSet();
                    }
                });
                this.btnSaveAsGroup.on("click", function () {
                    if (_this.target && _this.target.length) {
                        ContentGroupBox.Show(DesignPanel.CanvasStatic.GetFinalOutputHTML(_this.target));
                        _this.ReSet();
                    }
                });
            }
            LayoutSetting.prototype.ReSet = function () {
                this.target = null;
                if (this.cover)
                    this.cover.hide();
                if (this.box)
                    this.box.hide();
            };
            LayoutSetting.prototype.Attach = function (target) {
                if (target && target.length) {
                    this.target = target;
                    var size = { width: target.width() - 12, height: target.height() - 12 };
                    this.cover.css(size).show().position({ of: target, offset: "5 5", my: "left top", at: "left top" });
                    this.box.css(size).show().position({ of: target, offset: "5 5", my: "left top", at: "left top" });
                    if (target.find(".content-placeholder").length > 1) {
                        this.btnSaveAsGroup.show();
                    }
                    else {
                        this.btnSaveAsGroup.hide();
                    }
                    if (target.closest(".layout-table").hasClass("hor")) {
                        this.btnWidthSetting.val(Number(target.attr("sizeunit")) === 1 ? "设置为百分比宽度" : "设置为固定像素宽度").show();
                    }
                    else {
                        this.btnWidthSetting.hide();
                    }
                }
            };
            LayoutSetting.ReSet = function () {
                LayoutSetting.GetInstance().ReSet();
            };
            LayoutSetting.GetInstance = function () {
                if (LayoutSetting._instance === null) {
                    LayoutSetting._instance = new LayoutSetting();
                }
                return LayoutSetting._instance;
            };
            LayoutSetting.Attach = function (target) {
                LayoutSetting.GetInstance().Attach(target);
            };
            LayoutSetting._instance = null;
            return LayoutSetting;
        })();
        var MinWidthInfoBox = (function () {
            function MinWidthInfoBox() {
                this.Box = null;
                this.Text = null;
                this.timer = Number.NaN;
                this.Box = $(".min-width-info-box");
                this.Box.find(".prompt-cover").css("opacity", 0.3);
                this.Text = this.Box.find(".prompt-text > span");
            }
            MinWidthInfoBox.prototype.Anchor = function (target) {
                var _this = this;
                var minWidth = Number(target.attr("minwidth"));
                var pos = target.position();
                var size = { width: target.width(), height: target.height() };
                this.Box.hide();
                if (!isNaN(this.timer)) {
                    window.clearTimeout(this.timer);
                }
                this.Text.text((!isNaN(minWidth) && minWidth !== 0) ? (minWidth + "px") : "(未配置)");
                this.timer = window.setTimeout(function () { return _this.Box.hide(); }, 3000);
                this.Box.css({ left: pos.left + (size.width / 2 - 58), top: pos.top + (size.height / 2 + 36) }).show();
            };
            MinWidthInfoBox.GetInstance = function () {
                if (MinWidthInfoBox.mb === null) {
                    MinWidthInfoBox.mb = new MinWidthInfoBox();
                }
                return MinWidthInfoBox.mb;
            };
            MinWidthInfoBox.Anchor = function (target) {
                if (target.hasClass("content-placeholder")) {
                    MinWidthInfoBox.GetInstance().Anchor(target);
                }
            };
            MinWidthInfoBox.Hide = function () {
                var o = MinWidthInfoBox.GetInstance();
                o.Box.hide();
                if (!isNaN(o.timer)) {
                    window.clearTimeout(o.timer);
                }
            };
            MinWidthInfoBox.mb = null;
            return MinWidthInfoBox;
        })();
        var CustomContentTextAreaBox = (function () {
            function CustomContentTextAreaBox() {
                var _this = this;
                this.editor = null;
                var box = this.box = $(".custom-content-text-area");
                var win = $(window);
                win.on("resize scroll", function () {
                    if (box.css("display") !== "none") {
                        box.stop().animate({
                            left: (win.width() - box.width()) / 2,
                            top: (win.height() - box.height()) / 2 + win.scrollTop()
                        }, 300, "swing");
                    }
                });
                this.editor = this.box.find(".text-area textarea").xheditor({
                    tools: "full",
                    skin: "nostyle",
                    layerShadow: 1,
                    showBlocktag: true,
                    linkTag: true,
                    internalScript: true,
                    inlineScript: true,
                    internalStyle: true,
                    inlineStyle: true,
                    width: "100%",
                    height: 300,
                    forcePtag: false,
                    cleanPaste: 2,
                    html5Upload: false,
                    upMultiple: 1
                });
                this.box.find(".btn-cancel").on("click", function () { return _this.box.hide(); });
                this.box.find(".btn-clear").on("click", function () { return _this.editor.setSource(""); });
                this.box.find(".btn-apply").on("click", function () {
                    if (_this.target && _this.target.length > 0) {
                        _this.target.html(_this.editor.getSource());
                        DesignCanvas.AutoBinding();
                    }
                    _this.box.hide();
                });
            }
            CustomContentTextAreaBox.GetInstance = function () {
                if (CustomContentTextAreaBox._instance === null) {
                    CustomContentTextAreaBox._instance = new CustomContentTextAreaBox();
                }
                return CustomContentTextAreaBox._instance;
            };
            CustomContentTextAreaBox.prototype.Show = function (target, html) {
                var win = $(window);
                this.target = target;
                this.editor.setSource(html || "");
                this.box.show().stop().animate({
                    left: (win.width() - this.box.width()) / 2,
                    top: (win.height() - this.box.height()) / 2 + win.scrollTop() - 50
                }, 300, "swing");
            };
            CustomContentTextAreaBox.Show = function (target, html) {
                CustomContentTextAreaBox.GetInstance().Show(target, html);
            };
            CustomContentTextAreaBox._instance = null;
            return CustomContentTextAreaBox;
        })();
        /**
         * @class: CustomContentSetting
         * @description: 表示 [自定义内容的内容块] 配置界面的静态类
        */
        var CustomContentSetting = (function () {
            function CustomContentSetting() {
                var _this = this;
                this.Target = null;
                this.Setting = null;
                this.Showing = false;
                this.Setting = $(".custom-content-page");
                this.Setting.on("click", function () {
                    _this.Setting.hide();
                    _this.Showing = true;
                    CustomContentTextAreaBox.Show(_this.Target, _this.Target.html());
                });
                this.Setting.on("mouseenter", function () {
                    _this.Setting.show();
                    _this.Showing = true;
                });
                this.Setting.on("mouseout", function () {
                    _this.Showing = false;
                });
            }
            CustomContentSetting.GetInstance = function () {
                if (CustomContentSetting._instance === null) {
                    CustomContentSetting._instance = new CustomContentSetting();
                }
                return CustomContentSetting._instance;
            };
            CustomContentSetting.prototype.Anchor = function (target) {
                if (target && target.length) {
                    var offset = target.offset();
                    offset.left += 1;
                    offset.top += 1;
                    this.Setting.css(offset);
                    this.Setting.width(target.width() - 4);
                    this.Target = target;
                    this.Setting.show();
                }
            };
            CustomContentSetting.prototype.Reset = function () {
                if (!this.Showing) {
                    this.Setting.hide();
                }
            };
            CustomContentSetting.Anchor = function (target) {
                CustomContentSetting.GetInstance().Anchor(target);
            };
            CustomContentSetting.Reset = function () {
                CustomContentSetting.GetInstance().Reset();
            };
            CustomContentSetting._instance = null;
            return CustomContentSetting;
        })();
        /**
         * @class: FramePageSetting
         * @description: 表示 [框架页面内容块] 配置界面的静态类
        */
        var FramePageSetting = (function () {
            function FramePageSetting() {
                var _this = this;
                this.Target = null;
                this.Setting = null;
                this.UrlBox = null;
                this.HeightBox = null;
                this.Showing = false;
                this.Selecting = null;
                this.Setting = $(".frame-page");
                this.UrlBox = this.Setting.find(".frame-address-url");
                this.HeightBox = this.Setting.find(".frame-height");
                this.Setting.on("mouseenter", function () {
                    _this.Setting.show();
                    _this.Showing = true;
                });
                this.Setting.on("mouseout", function () {
                    _this.Showing = false;
                });
                this.UrlBox.on("keyup", function (e) {
                    if (e.keyCode === 13 && _this.Target) {
                        // todo: redo/undo
                        _this.Target.attr("src", _this.getUrl($.trim(_this.UrlBox.val())));
                        _this.Setting.hide();
                    }
                }).on("focus", function () {
                    _this.UrlBox.select();
                    _this.Selecting = _this.UrlBox;
                });
                this.HeightBox.on("keyup", function (e) {
                    if (e.keyCode === 13) {
                        if (_this.Target) {
                            _this.Target.css("height", _this.getHeight($.trim(_this.HeightBox.val())));
                        }
                    }
                }).on("focus", function () {
                    _this.HeightBox.select();
                    _this.Selecting = _this.HeightBox;
                });
            }
            FramePageSetting.prototype.getHeight = function (height) {
                if (height) {
                    var h = Number(height);
                    if (isNaN(h))
                        return "150";
                    return h.toString();
                }
                else {
                    return "150";
                }
            };
            FramePageSetting.prototype.getUrl = function (url) {
                return (url) ? ((new RegExp("^([a-z]{2,6})\:\/\/.+", "i").test(url)) ? url : ("http://" + url)) : "about:blank";
            };
            FramePageSetting.prototype.Reset = function () {
                if (!this.Showing) {
                    this.Setting.hide();
                }
            };
            FramePageSetting.prototype.Anchor = function (target) {
                if (target && target.length) {
                    var offset = target.offset();
                    offset.left += 1;
                    offset.top += 1;
                    this.Setting.css(offset);
                    this.Setting.width(target.width() - 2);
                    this.Target = target;
                    var url = target.attr("src");
                    if (url) {
                        this.UrlBox.val(url === "about:blank" ? "http://" : url);
                    }
                    if (this.Selecting)
                        this.Selecting.select();
                    this.HeightBox.val(target.css("height").replace(/px|\%/g, ""));
                    this.Setting.show();
                }
            };
            FramePageSetting.GetInstance = function () {
                if (FramePageSetting._instance === null) {
                    FramePageSetting._instance = new FramePageSetting();
                }
                return FramePageSetting._instance;
            };
            FramePageSetting.Anchor = function (target) {
                FramePageSetting.GetInstance().Anchor(target);
            };
            FramePageSetting.Reset = function () {
                FramePageSetting.GetInstance().Reset();
            };
            FramePageSetting._instance = null;
            return FramePageSetting;
        })();
        /**
         * @class: RequestDataObject
         * @description: 获得请求参数的静态类
        */
        var RequestDataObject = (function () {
            function RequestDataObject() {
            }
            // 获取请求参数: ID
            RequestDataObject.GetID = function () {
                if (!RequestDataObject._id) {
                    var m = document.location.search.match(/id\=(.*?)(?:&|$)/i);
                    RequestDataObject._id = m ? m[1] : null;
                }
                return RequestDataObject._id;
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
        /**
         * @class: ContentPlaceholderDraggingIndicator
         * @description: 表示从右侧操作控制面板中拖动的内容块在其拖放过程中，画板中的被投放的目标内容块上显示投放位置的指示器的静态类
         * @remark:
         *      内容块允许拖放到另外一个内容块的上、下、左、右位置。
         *
         *      某个内容块A 从右侧操作控制面板中的内容块列表中开始拖向画板(参考 DesignCanvas 画板类)，在画板中已经存在的任意一个内容块则可作为 A 的投放目标，
         *      例如，当 A 拖动到画板已存在的内容块 B 之上时，ContentPlaceholderDraggingIndicator 会计算合理的投放位置，可能是上下左右四个方便，当确定投放的方向时，
         *      假设确定方向为 “左”，内容块B 将在左侧显示一个橙色的矩形方块，表示若在此处松开鼠标确定投放的话，将在内容 B 的左侧插入内容块 A。
         *
         *      其他方向如此类推。
         *
         *      事实上，通过此指示器可以简化设计布局过程，因为一个布局仅能接受一个内容块，在同一个布局中不会出现两个或以上的内容块；
         *      当确定投放某个方向后，例如在左侧，这个位置仅仅作为投放的参考位置，投放完毕后其实是自动创建一个左右两列的横向布局，
         *      然后将内容块 B 放置在左边的布局中，而内容块 A 则放置在右边，以此来简化设计布局的过程。
         * @reference:
         *      请参考 DraggingIndicatorDirect 枚举
        */
        var ContentPlaceholderDraggingIndicator = (function () {
            function ContentPlaceholderDraggingIndicator() {
                this.DraggingContentBlock = null; // 正在拖放的内容块
                this.DroppingContentBlock = null; // 准备投放的内容块
                this.Direct = -1 /* Unknown */;
                this.block = $(".content-placeholder-dragging-indicator");
            }
            ContentPlaceholderDraggingIndicator.prototype.Reset = function () {
                this.DraggingContentBlock = null;
                this.DroppingContentBlock = null;
                this.Direct = -1 /* Unknown */;
                this.block.hide();
            };
            ContentPlaceholderDraggingIndicator.prototype.Update = function (draggingPosition) {
                // 计算位置
                if (this.DraggingContentBlock && this.DraggingContentBlock.length && this.DroppingContentBlock && this.DroppingContentBlock.length) {
                    // 得到拖动中的内容块当前位置与准备投放的内容块的 上下左右 各自分别的距离。
                    var dropPos = this.DropPosition;
                    var dropSize = this.DropSize;
                    var left = draggingPosition.left - dropPos.left + 10;
                    var up = draggingPosition.top - dropPos.top + 10;
                    var right = dropSize.width - left;
                    var down = dropSize.height - up;
                    var directSelector = {};
                    directSelector["ds" + left] = 0 /* Left */;
                    directSelector["ds" + up] = 2 /* Up */;
                    directSelector["ds" + right] = 1 /* Right */;
                    directSelector["ds" + down] = 3 /* Down */;
                    this.Direct = directSelector["ds" + Math.min(left, right, up, down)];
                    this.block.css(this.DirectPosition[this.Direct]);
                    this.block.show();
                }
            };
            ContentPlaceholderDraggingIndicator.GetInstance = function () {
                if (ContentPlaceholderDraggingIndicator.indicator === null)
                    ContentPlaceholderDraggingIndicator.indicator = new ContentPlaceholderDraggingIndicator();
                return ContentPlaceholderDraggingIndicator.indicator;
            };
            // 重置指示器
            ContentPlaceholderDraggingIndicator.Reset = function () {
                ContentPlaceholderDraggingIndicator.GetInstance().Reset();
            };
            // 开始创建指示器
            ContentPlaceholderDraggingIndicator.Create = function (draggingContentBlock) {
                ContentPlaceholderDraggingIndicator.GetInstance().DraggingContentBlock = draggingContentBlock;
            };
            // 锚定投放目标
            ContentPlaceholderDraggingIndicator.Anchor = function (droppingContentBlock) {
                var c = ContentPlaceholderDraggingIndicator.GetInstance();
                c.DroppingContentBlock = droppingContentBlock;
                if (droppingContentBlock === null) {
                    c.block.hide();
                }
                else {
                    var dw = droppingContentBlock.width() + 1;
                    var dh = droppingContentBlock.height() + 2;
                    c.DropPosition = droppingContentBlock.offset();
                    c.DropSize = { width: dw, height: dh };
                    c.DirectPosition = [
                        { left: c.DropPosition.left, top: c.DropPosition.top, width: 4, height: dh },
                        { left: c.DropPosition.left + dw - 3, top: c.DropPosition.top, width: 4, height: dh },
                        { left: c.DropPosition.left, top: c.DropPosition.top, width: dw, height: 4 },
                        { left: c.DropPosition.left, top: c.DropPosition.top + dh - 4, width: dw, height: 4 }
                    ];
                }
            };
            // 计算并更新指示器的方向
            ContentPlaceholderDraggingIndicator.UpdateIndicator = function (draggingPosition) {
                ContentPlaceholderDraggingIndicator.GetInstance().Update(draggingPosition);
            };
            // 获得当前的投放方向
            ContentPlaceholderDraggingIndicator.GetDirect = function () {
                return ContentPlaceholderDraggingIndicator.GetInstance().Direct;
            };
            ContentPlaceholderDraggingIndicator.indicator = null;
            return ContentPlaceholderDraggingIndicator;
        })();
        /**
         * @class: TextCover
         * @description: 表示可编辑的文本框的静态类
         * @remark:
         *      TextCover 是一个输入框，它的作用是在需要的时候，依附到指定的对象上支持编辑文本。
         *
         *      例如，在内容块的标题文本上双击时，TextCover 将输入框覆盖原来的标题文本，当重新输入一个新标题并按回车时，新的标题将替换旧的标题。
         *      此外在任意一个标签页上双击时，TextCover 也使标签页的标题可编辑。
         *
         *      编辑动作是否输入完毕通过两个方法判断：
         *          1、用户按下了 [回车键]
         *          2、TextCover 的输入框失去焦点
         *
         *      通过 TextCover.Anchor() 方法可以使输入框覆盖原来的文本，并开始接受新的文本输入。
        */
        var TextCover = (function () {
            function TextCover() {
                this.Attach = null;
                this.TextBox = null;
                this.Callback = null; // 编辑动作完毕后调用的回调函数
                this.TextBox = $(".text-cover");
                var my = this;
                this.TextBox.on("blur", function () {
                    my.applyChange();
                }).on("keyup", function (e) {
                    if (e.keyCode === 13)
                        my.applyChange();
                });
            }
            // 编辑完毕后，重置 TextCover 为默认值
            TextCover.prototype.reset = function () {
                this.Attach = null;
                this.TextBox.val("").hide().attr("class", "text-cover");
                ;
                this.Callback = null;
            };
            // 应用更改
            TextCover.prototype.applyChange = function () {
                if (this.Attach) {
                    var oldText = this.Attach.text();
                    var newText = $.trim(this.TextBox.val());
                    newText = (newText ? newText : oldText);
                    this.Attach.text(newText);
                    // todo: undo/redo
                    if (this.Callback)
                        this.Callback(newText, oldText);
                    this.reset();
                }
            };
            TextCover.GetInstance = function () {
                if (TextCover._instance === null)
                    TextCover._instance = new TextCover();
                return TextCover._instance;
            };
            // 使输入框依附并遮盖到指定的对象 attach 上。
            TextCover.Anchor = function (attach, position, size, callback, addClass) {
                if (attach && attach.length) {
                    var c = TextCover.GetInstance();
                    var p = attach.offset();
                    c.Attach = attach;
                    c.TextBox.css(position ? position : { left: p.left + 1, top: p.top + 1 });
                    if (size) {
                        c.TextBox.width(size.width).height(size.height).css("line-height", size.height + "px");
                    }
                    else {
                        var h = attach.height();
                        c.TextBox.width(attach.width() + 10).height(h).css("line-height", h + "px");
                    }
                    if (addClass) {
                        c.TextBox.addClass(addClass);
                    }
                    c.Callback = callback ? callback : null;
                    c.TextBox.val(attach.text()).show().focus().select();
                }
            };
            TextCover._instance = null;
            return TextCover;
        })();
        /**
         * @class: TabGlobalBinder
         * @description: 表示标签页事件绑定的类
         * @remark:
         *      TabGlobalBinder 类包含了标签页相关的所有事件绑定及处理程序。
         *
         *      TabGlobalBinder 为未来将添加到画板视图中的标签页预先绑定事件，这些事件包括点击标签页时切换对应的 tab 面板(panel)，双击时编辑标签页的标题等等。
         *
         *      移动鼠标到某个标签页时，其右上角显示 x 形的删除按钮，点击该按钮将删除此标签；若删除的是最后一个标签页，则整个 tab 都将被删除。
        */
        var TabGlobalBinder = (function () {
            function TabGlobalBinder() {
            }
            // 使已选中的标签执行点击
            TabGlobalBinder.FireSelection = function (scope) {
                if (scope === void 0) { scope = null; }
                var src = (scope === null) ? $(TabGlobalBinder._selector) : scope.find(TabGlobalBinder._selector);
                src.trigger("click");
            };
            // 绑定标签页的基本事件
            TabGlobalBinder.ApplyBinding = function () {
                // 点击删除标签页，若删除的是最后一个标签页，则整个 tab 都删除。
                var deleteTabPageButton = $(".delete-tab-page");
                DesignCanvas.Canvas.on("click", ".tab > .tab-pages > .tab-page", function () {
                    SplitterContainer.HideAll();
                    var me = $(this);
                    var siblings = me.siblings(".tab-page");
                    var tab = me.closest(".tab");
                    var panels = tab.children(".tab-panel");
                    me.addClass("sel");
                    siblings.removeClass("sel");
                    panels.hide().eq(me.index()).show();
                    DesignCanvas.DoResizeInterval();
                }).on("dblclick", ".tab > .tab-pages > .tab-page", function () {
                    TextCover.Anchor($(this));
                }).on("mouseenter", ".tab > .tab-pages", function () {
                    DesignCanvas.HiddenElement();
                }).on("click", ".tab > .tab-pages > .tab-page > .delete-tab-page", function () {
                    var p = $(this).parent();
                    var siblings = p.siblings(".tab-page");
                    if (siblings.length > 0) {
                        var index = p.index(".tab-page");
                        var panel = p.closest(".tab").find(".tab-panel:eq(" + index + ")");
                        var next = p.next(".tab-page");
                        next = next.length === 0 ? p.prev() : next;
                        p.remove();
                        panel.remove();
                        if (p.hasClass("sel"))
                            next.trigger("click");
                    }
                    else {
                        p.closest(".layout-table.tab").replaceWith(Layout.ActiveDroppable($(TabGlobalBinder._empty_content)));
                        // 重整布局
                        SplitterContainer.DeleteAll("ver");
                        DesignCanvas.DoResizeInterval();
                    }
                    // todo: redo/undo
                }).on("mouseenter", ".tab > .tab-pages > .tab-page", function () {
                    var del = $(this).children(".delete-tab-page");
                    if (del.length === 0)
                        deleteTabPageButton.clone().appendTo(this);
                }).on("click", ".tab > .tab-pages > .add", function () {
                    var me = $(this);
                    var tab = me.closest(".tab");
                    var pages = me.siblings(".tab-page");
                    var tabPage = $(TabGlobalBinder._tab_page_format.replace(/\{0\}/g, (pages.length + 1).toString()));
                    var panel = $(TabGlobalBinder._panel_format);
                    Layout.ActiveDroppable(panel.children(".empty-content"));
                    me.before(tabPage);
                    tab.append(panel);
                });
                TabGlobalBinder.FireSelection();
            };
            TabGlobalBinder._selector = ".tab > .tab-pages > .tab-page.sel";
            TabGlobalBinder._tab_page_format = '<a class="tab-page" hidefocus href="javascript:void(0)">标签{0}</a>';
            TabGlobalBinder._panel_format = '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>';
            TabGlobalBinder._empty_content = DesignCanvas.EmptyContent;
            return TabGlobalBinder;
        })();
        /**
         * 门户页尺寸选择对话框
         */
        var PortalPageSizeDialog = (function () {
            function PortalPageSizeDialog() {
                this.$obj = $(".portal-page-size");
            }
            return PortalPageSizeDialog;
        })();
        /**
         * @class: ContentBlockSetting
         * @description: 表示内容块配置静态类
         */
        //class ContentBlockSetting
        //{
        //    private setting: JQuery;
        //    private static _instance: ContentBlockSetting = null;
        //    constructor ()
        //    {
        //        this.setting = $( ".setting-box" );
        //    }
        //    // 锚定到指定内容块
        //    public Anchor( content: JQuery )
        //    {
        //        if ( this.setting.css( "display" ) !== "none" )
        //        {
        //            // 先隐藏
        //        }
        //        console.log( "show setting..." );
        //    }
        //    // 切换回内容块展示界面
        //    public Toggle( content: JQuery )
        //    {
        //        console.log( "hide setting..." );
        //    }
        //    private static GetInstance()
        //    {
        //        if ( ContentBlockSetting._instance === null )
        //            ContentBlockSetting._instance = new ContentBlockSetting();
        //        return ContentBlockSetting._instance;
        //    }
        //    public static Anchor( content: JQuery, toggle: boolean )
        //    {
        //        if ( !toggle )
        //            ContentBlockSetting.GetInstance().Anchor( content );
        //        else
        //            ContentBlockSetting.GetInstance().Toggle( content );
        //    }
        //}
        /**
         * @class: LayoutQuickToolbar
         * @description: 表示布局工具栏的类
         * @remark:
         *      布局工具栏提供在鼠标移动到某个布局时显示的快速工具。
         *
         *      例如：[删除布局] 按钮，及当前布局的尺寸(宽度)信息等。
        */
        var LayoutQuickToolbar = (function () {
            function LayoutQuickToolbar() {
                var _this = this;
                this.AttachLayout = null;
                this.toolbar = $(".layout-quick-toolbar").on("mouseenter", function () { return _this.toolbar.show(); });
                var sd = this.toolbar.find(".size-data");
                this.SpanText = sd.children("span");
                this.IText = sd.children("i");
                this.Q = sd.children("q");
                // 删除布局
                this.toolbar.find(".delete-layout").on("click", function () {
                    return Layout.Delete(_this.AttachLayout);
                });
            }
            // 使关联的 attach (td) 显示尺寸信息
            LayoutQuickToolbar.Anchor = function (attach) {
                try {
                    var c = LayoutQuickToolbar._instance;
                    if (c === null)
                        c = LayoutQuickToolbar._instance = new LayoutQuickToolbar();
                    var tb = c.toolbar;
                    var td = attach.parent();
                    c.AttachLayout = td;
                    var w = td.width();
                    var ew = w - 12;
                    var pw = td.parent().width();
                    var p = Math.floor(w / pw * 100);
                    var unit = Number(td.attr("sizeunit"));
                    var isVer = (td.attr("splitter") === "ver");
                    tb.css(attach.offset());
                    unit = isNaN(unit) ? 0 /* Percent */ : unit;
                    var isPercent = (unit === 0 /* Percent */);
                    c.SpanText.text((isPercent && (!isVer)) ? (p + "%") : (ew + "Px"));
                    c.IText.text(isPercent ? (ew + "Px") : (p + "%"));
                    if (isVer) {
                        c.IText.hide();
                        c.Q.hide();
                    }
                    else {
                        c.IText.show();
                        c.Q.show();
                    }
                    tb.width(attach.width()).show();
                }
                catch (e) {
                }
            };
            // 隐藏工具栏
            LayoutQuickToolbar.Hide = function () {
                var c = LayoutQuickToolbar._instance;
                if (c === null)
                    c = LayoutQuickToolbar._instance = new LayoutQuickToolbar();
                c.toolbar.hide();
            };
            LayoutQuickToolbar._instance = null;
            return LayoutQuickToolbar;
        })();
    })(PortalDesign = Sapi.PortalDesign || (Sapi.PortalDesign = {}));
})(Sapi || (Sapi = {}));
// 创建设计视图，开始初始化设计面板
$(function () { return new Sapi.PortalDesign.DesignView().Init(); });
/**
 * 加载当前门户页布局
 *
 * @param:
 *      portalId - 门户页的 ID (Guid)
 *      callback - 执行完毕的回调函数，要求将结果传递给 callback (function)
 *
 * @return: 返回门户页的布局 (string)
 */
function LoadPortalLayout(portalId, callback) {
    ajax("FillData.ashx", { "action": "GetPortalHtml", "PPID": portalId, randData: new Date().getTime() }, "json", function (data) {
        callback((data.Success === "Y" && data.Others[0] === "N") ? data.Data : "");
    });
}
/**
 * 保存当前门户页布局到数据库
 *
 * @param:
 *      portalId - 门户页的 ID (Guid)
 *      layout - 保存的信息 (string)
 *      callback - 执行完毕的回调函数，要求将结果传递给 callback (function)
 *
 * @return: 保存成功返回 true，失败返回 false (boolean)。
 */
function SavePortalLayout(portalId, layout, callback) {
    ajax("FillData.ashx", { "action": "SavePortalHtml", "PPID": portalId, "Html": layout, randData: new Date().getTime() }, "json", function (data) {
        callback(data.Success === "Y");
    });
}
function ajaxLoading() {
}
