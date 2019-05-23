/// <reference path="../jquery.d.ts"/>
/// <reference path="../jqueryui.d.ts"/>

declare var ajax;

interface IPosition { top: number; left: number; }

interface ISize { width: number; height: number; }

interface JQuery
{
    spectrum( param: any ): JQuery;
    spectrum( api: string, value: string ): JQuery;

    xheditor( param: any ): any;
}

function GetContentBlockById( id: string ): Sapi.PortalDesign.ContentBlock
{
    return Sapi.PortalDesign.ContentBlock.GetById( id );
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

module Sapi.PortalDesign
{

    /**
     * @interface: IAsyncResult
     * @description: 定义异步请求返回结果的类型
     *
     * @remark:
     *      此接口是执行异步请求完毕时返回结果的类型的规范约束，
     *      Others 成员表示可能附加的其他信息，包括分页信息，或是样式表、脚本等内容。
     *
     * @reference:
     *      请参看 ContentBlockArea.LoadContentBlocks() 加载所有内容块函数。
    */
    export interface IAsyncResult
    {
        Success: string;    // 请求执行是否成功 (Y/N)
        Data: any;          // 执行后返回的数据，若执行失败 (Success=false)，则返回错误信息，否则返回内容块信息数组(参考 IContentDataFormat 接口)
        Others: string[];        // 附加的其他信息
    }

    /**
     * @interface: IContentDataFormat
     * @description: 定义内容块请求返回的数据的格式
     *
     * @remark:
     *      当完成请求所有内容块后，若 IContentResult.Success 为 'Y' 则代表请求成功 (请参看 IContentResult 接口的说明)，
     *      此时， IContentResult.Data 的类型将被转为 IContentDataFormat[] 数组类型。
     *      每个 IContentDataFormat 代表一个内容块的信息。
     *      所有内容块的信息将被遍历，然后显示到内容块列表中供设计器使用。
     *
     * @reference:
     *      请参看 ContentBlockArea.LoadContentBlocks() 加载所有内容块函数。
    */
    export interface IContentDataFormat
    {
        title: string;      // 内容块标题
        type?: string;      // 内容块门户类型 (0:个人门户  1:项目门户  2:企业门户)
        typename?: string;   // 所属类别名称
        ico?: string;        // 内容块图标url
        list: number;       // 1/0，是否为列表块
        head?: number;       // 1/0，列表块是否含表头
        url: string;        // 内容块请求路径
        moreurl?: string;    // "更多" 的路径
        minwidth?: number;   // 最小像素宽度
        remark?: string;    // 备注信息
        opts: {        // 其他选项
            title: string;  // 操作项标题
            ico?: string;    // 操作项图标
            url: string;    // 操作项打开的页面url
            width: number;  // 操作项打开的页面的宽度
            height: number; // 操作项打开的页面的高度
        }[];
    }

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
    enum ContentType
    {
        Normal = 0,         // 常规的内容块
        FramePage = 1,      // 框架页面
        CustomContent = 2,   // 自定义内容页面
        ImageContent = 3     // 图片内容块
    }

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
    enum LayoutSizeUnit
    {
        Percent = 0,    // 百分比
        Pixel = 1  // 像素
    }

    /**
     * @enum: DraggingIndicatorDirect
     * @description: 表示投放方向的枚举
     * @remark:
     *      内容块允许投放到已存在于画板中的另一个内容块之上，以此来确定当前拖动的内容块应该投放到该内容块的何种方向（位置）。
     *
     * @reference:
     *      请参考 ContentPlaceholderDraggingIndicator 类
    */
    enum DraggingIndicatorDirect
    {
        Unknown = -1,    // 未知方向
        Left = 0,       // 左
        Right = 1,      // 右
        Up = 2,         // 上
        Down = 3        // 下
    }

    /**
     * @interface: IResizeCoverCreateOption
     * @description: 表示尺寸调整提示块创建时选项
     * @remark: 
     *      当拖动横向尺寸调整分割条（仅横向允许拖动调整尺寸）时，分割条两边的布局将被半透明遮盖，并显示布局当前的宽度信息。
     *      因此，在创建这个半透明遮盖的元素时，需要首先明确这个元素应该遮盖到什么位置（top）及高度的尺寸。
     * @reference:
     *      参考 ResizeCover 类
    */
    interface IResizeCoverCreateOption
    {
        top: number;
        height: number;
        lineHeight: any;
    }

    /**
     * @interface: IResizeCoveringOption
     * @description: 表示尺寸调整提示块在调整过程中的选项
     * @remark:
     *      在拖动横向分割条的过程，分割条两边的布局的宽度不断改变，因此宽度的信息（像素及百分比）谁分割条的拖动传递给遮盖的元素并显示。
     * @reference:
     *      参考 ResizeCover 尺寸调整遮盖类
    */
    interface IResizeCoveringOption
    {
        option:
        {
            left: number;
            width: number;
        };
        percent: any;
    }

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
    export class DesignView     // 设计视图，代表整个设计界面
    {
        public DesignPanel: DesignPanel; // 设计面板(标签)
        private ReviewPanel: ReviewPanel; // 预览面板(标签)

        private designPage: JQuery;  // [设计] 标签页
        private reviewPage: JQuery; // [预览] 标签页

        public static Resizable: boolean = true;   // 当前是否允许调整布局尺寸

        public static Style: JQuery = $( "#inlineStyle" );
        public static Header: JQuery = $( "head" );
        public static Body: JQuery = $( "body" );

        constructor()
        {
            this.DesignPanel = new DesignPanel();
            this.ReviewPanel = new ReviewPanel();

            var pages: JQuery = $( ".design-box > dt" );

            this.designPage = pages.children( ".design-page" );
            this.reviewPage = pages.children( ".review-page" );
        }

        // 初始化整个设计界面
        public Init()
        {
            this.DesignPanel.Init();

            var my: DesignView = this;

            this.designPage.click( function ()  // 点击 [设计] 标签页时
            {
                // 显示 [设计] 视图并隐藏 [预览] 视图
                $( this ).addClass( "sel" ).siblings( ".review-page" ).removeClass( "sel" );
                my.ReviewPanel.Hide();
                my.DesignPanel.Show();

                DesignView.Resizable = true;
                DesignCanvas.DoResizeInterval();    // 重新使所有布局执行一次调整
            });

            this.reviewPage.click( function ()  // 点击 [预览] 标签页时
            {
                DesignView.Resizable = false;   // 禁用调整布局尺寸

                // 显示 [预览] 视图并隐藏 [设计] 视图
                $( this ).addClass( "sel" ).siblings( ".design-page" ).removeClass( "sel" );
                my.DesignPanel.Hide();

                // 开始创建 [预览]
                my.ReviewPanel.BuildReview( DesignPanel.CanvasStatic.GetFinalOutputHTML() );
            });

            // 得到所有内容块信息
            ajax(
                "FillData.ashx",
                {
                    "action": "GetPortalBlock",
                    "PortalType": RequestDataObject.GetPortalType(),
                    "randData": new Date().getTime()
                },
                "json",
                $.proxy( this.DesignPanel.OperatControl.ContentBlocks.LoadContentBlocks, this.DesignPanel.OperatControl.ContentBlocks )
                );

            // 得到所有内容块组信息
            ajax(
                "FillData.ashx",
                {
                    "action": "GetPortalBlockGroup",
                    "PortalType": RequestDataObject.GetPortalType(),
                    "randData": new Date().getTime()
                },
                "json",
                $.proxy( this.DesignPanel.OperatControl.ContentBlockGroups.LoadContentGroups, this.DesignPanel.OperatControl.ContentBlockGroups )
                );
        }
    }

    interface IColorScheme
    {
        PageBgColor: string;    // 页面背景色 (仅全局时可配置)

        ContentBgColor: string;     // 内容块背景色
        ContentBorderColor: string; // 内容块边框颜色
        TitleBgColor: string;   // 标题栏背景色
        TitleFgColor: string;   // 标题栏前景色
        TitleLinkColor: string;      // 标题中的超链接颜色（包括底部）
        TextColor: string;      // 普通文本颜色
    }

    /** 颜色预设框 */
    class ColorScheme
    {
        private static dialog: JQuery = null;
        private static target: JQuery = null;

        private static getInstance(): JQuery
        {
            if ( ColorScheme.dialog === null )
            {
                var dlg: JQuery = ColorScheme.dialog = $( ".color-scheme-box" );
                var win: JQuery = $( window );

                win.on( "resize scroll", () =>
                {
                    if ( dlg.css( "display" ) !== "none" )
                    {
                        dlg.stop().animate( {
                            left: ( win.width() - dlg.width() ) / 2,
                            top: ( win.height() - dlg.height() ) / 2 + win.scrollTop()
                        }, 300, "swing" );
                    }
                });

                var pickers: JQuery = dlg.find( ".color-picker" );

                pickers.spectrum( {
                    showInput: true,
                    showInitial: true,
                    showPalette: true,
                    showAlpha: true,
                    preferredFormat: "hex",
                    palette: [
                        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)", "rgb(183, 183, 183)",
                            "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
                        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                            "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                            "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                            "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                            "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                            "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                            "rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
                            "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",
                            "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                            "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                    ]
                });

                dlg.find( ".btn-cancel" ).on( "click", () => ColorScheme.Close() );

                dlg.find( ".btn-apply-all,.btn-apply" ).on( "click", () =>
                {
                    var t: JQuery = <JQuery>dlg.data( "target" );
                    var holders: JQuery = t.find( ".content-placeholder" );

                    if ( t.hasClass( "content-placeholder" ) )
                        holders = t;

                    var scheme: string = ColorScheme.GetColorScheme();
                    var cs: IColorScheme = <IColorScheme>$.parseJSON( scheme );

                    if ( t.hasClass( "design-canvas" ) )
                    {
                        t.attr( "oldColorScheme", t.attr( "colorscheme" ) );
                        t.attr( "colorscheme", scheme );
                    }

                    holders.each( ( i, e ) =>
                    {
                        var target: JQuery = $( e );

                        target.attr( "oldColorScheme", target.attr( "colorscheme" ) );
                        target.attr( "colorscheme", scheme );

                        ColorScheme.Apply( target, cs );
                    });

                    ColorScheme.Close();
                });

                dlg.find( ".btn-recover" ).on( "click", () =>
                {
                    var t: JQuery = <JQuery>dlg.data( "target" );
                    var oldScheme: string = $.trim( t.attr( "oldColorScheme" ) );

                    if ( oldScheme )
                    {
                        ColorScheme.ReSetColor( <IColorScheme>$.parseJSON( oldScheme ) )
                    }
                });

                dlg.find( ".btn-apply-page-bg-color" ).on( "click", () =>
                {
                    var t: JQuery = <JQuery>dlg.data( "target" );
                    var scheme: string = ColorScheme.GetColorScheme();
                    var cs: IColorScheme = <IColorScheme>$.parseJSON( scheme );

                    t.css( "background-color", cs.PageBgColor ).children().css( "background-color", cs.PageBgColor );
                });

                dlg.find( ".btn-set-global-default" ).on( "click", function ()
                {
                    DesignCanvas.Canvas.attr(
                        "colorscheme",
                        $( this ).closest( ".color-scheme-box" ).data( "target" ).attr( "colorscheme" )
                        );

                    if ( confirm( "是否确信设为全局颜色预设？" ) )
                    {
                        var oldTarger: JQuery = dlg.data( "target" );
                        dlg.data( "target", DesignCanvas.Canvas );
                        dlg.find( ".btn-apply-all" ).trigger( "click" );

                        ColorScheme.Close();
                    }
                });
            }

            return ColorScheme.dialog;
        }

        public static GetColorScheme(): string
        {
            var dlg: JQuery = ColorScheme.getInstance();
            var cs: string = "{";

            cs += '"PageBgColor": "' + dlg.find( ".page-bg-color" ).val() + '",';
            cs += '"ContentBgColor": "' + dlg.find( ".content-bg-color" ).val() + '",';
            cs += '"ContentBorderColor": "' + dlg.find( ".content-border-color" ).val() + '",';
            cs += '"TitleBgColor": "' + dlg.find( ".title-bg-color" ).val() + '",';
            cs += '"TitleFgColor": "' + dlg.find( ".title-color" ).val() + '",';
            cs += '"TitleLinkColor": "' + dlg.find( ".title-link-color" ).val() + '",';
            cs += '"TextColor": "' + dlg.find( ".text-color" ).val() + '"';

            cs += '}';

            return cs;
        }

        public static Apply( t: JQuery, cs: IColorScheme )
        {
            t.removeClass( "theme-blue theme-gray theme-tran" );

            t.css( "cssText", "background-color: " + cs.ContentBgColor + "; border-color: " + cs.ContentBorderColor + "; color: " + cs.TextColor + ' !important;' );

            var title: JQuery = t.children( ".title" );
            title.css( "cssText", "background-color: " + cs.TitleBgColor + ' !important; background-image: url(../../image/content-back.png);' );
            title.find( ".title-span" ).css( "cssText", "color: " + cs.TitleFgColor + ' !important;' );

            t.find( ".title-func a" ).css( "cssText", 'color: ' + cs.TitleLinkColor + ' !important;' );
        }

        public static ReSetColor( cs: IColorScheme )
        {
            var dlg: JQuery = ColorScheme.getInstance();

            dlg.find( ".page-bg-color" ).spectrum( "set", cs.PageBgColor );
            dlg.find( ".content-bg-color" ).spectrum( "set", cs.ContentBgColor );
            dlg.find( ".content-border-color" ).spectrum( "set", cs.ContentBorderColor );
            dlg.find( ".title-bg-color" ).spectrum( "set", cs.TitleBgColor );
            dlg.find( ".title-color" ).spectrum( "set", cs.TitleFgColor );
            dlg.find( ".title-link-color" ).spectrum( "set", cs.TitleLinkColor );
            dlg.find( ".text-color" ).spectrum( "set", cs.TextColor );
        }

        /**显示配置框*/
        public static Show( target: JQuery = DesignCanvas.Canvas )
        {
            var win: JQuery = $( window );
            var dlg: JQuery = ColorScheme.getInstance();
            var isTop: boolean = false;

            dlg.find( ".setting-dialog-btns :not(.btn-cancel,.btn-recover)" ).hide();
            dlg.find( ".page-background-color-setting" ).hide();

            if ( target.hasClass( "design-canvas" ) ) // 设置全局
            {
                dlg.find( ".dialog-title" ).text( "全局颜色预设" );
                dlg.find( ".page-background-color-setting" ).show();
                dlg.find( ".btn-apply-all" ).show();

                isTop = true;
            } else  // 指定内容块
            {
                dlg.find( ".dialog-title" ).text( "内容块颜色预设" );
                dlg.find( ".btn-set-global-default,.btn-apply" ).show();
            }

            var scheme: string = target.attr( "colorscheme" );
            ColorScheme.ReSetColor( scheme ? <IColorScheme>$.parseJSON( scheme ) : ColorScheme.GetSchemeByTarget( target, isTop ) );

            dlg.data( "target", target ).show().stop().animate( {
                left: ( win.width() - dlg.width() ) / 2,
                top: ( win.height() - dlg.height() ) / 2 + win.scrollTop() - 50
            }, 300, "swing" );
        }

        public static GetSchemeByTarget( target: JQuery, top: boolean = false ): IColorScheme
        {
            var t: JQuery = target;
            var cs: string = "{";

            if ( top )
            {
                t = target.find( ".content-placeholder:eq(0)" );
                cs += '"PageBgColor": "' + target.css( "background-color" ) + '",';
            }

            cs += '"ContentBgColor": "' + t.css( "background-color" ) + '",';
            cs += '"ContentBorderColor": "' + t.css( "border-color" ) + '",';

            cs += '"TitleLinkColor": "' + t.find( ".title-func a:first" ).css( "color" ) + '",';

            cs += '"TextColor": "' + t.css( "color" ) + '",';

            var title: JQuery = t.children( ".title" );
            cs += '"TitleBgColor": "' + title.css( "background-color" ) + '",';
            cs += '"TitleFgColor": "' + title.find( ".title-span" ).css( "color" ) + '"';

            cs += "}";

            target.attr( "colorscheme", cs );

            return <IColorScheme>$.parseJSON( cs );
        }

        /**关闭配置框*/
        public static Close(): void
        {
            ColorScheme.getInstance().hide();
        }
    }

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
    export class DesignPanel
    {
        private panel: JQuery;
        private inner: JQuery;
        private pages: JQuery;  // 右侧的标签
        private copyButton: JQuery; // 复制布局按钮
        private copyDialog: JQuery; // 复制布局对话框
        private selectCopyButton: JQuery;   // 复制布局对话框中的 [选择] 按钮
        private cancelCopyButton: JQuery;   // 复制布局对话框中的 [取消] 按钮
        private selectCopyList: JQuery;     // 复制布局对话框中的门户列表
        private copyDialogPortalTitle: JQuery;    // 复制布局对话框中的门户类型
        private reload: JQuery; // 重新加载
        private colorScheme: JQuery;

        public Canvas: DesignCanvas;    // 拖放目标的设计画板
        public OperatControl: OperatControl;    // 右侧操作控制面板
        public static CanvasStatic: DesignCanvas;

        constructor()
        {
            this.panel = $( ".design-box > .design-panel" );
            this.inner = $( ".design-panel-inner" );
            this.copyButton = $( ".design-load-layout-from" );
            this.reload = $( ".design-refresh-all-cb" );
            this.colorScheme = $( ".design-color-scheme" );

            this.copyDialog = $( ".layout-copy-selector" );
            this.selectCopyButton = this.copyDialog.find( ".layout-copy-selector-btns-ok" );
            this.cancelCopyButton = this.copyDialog.find( ".layout-copy-selector-btns-cancel" );
            this.selectCopyList = this.copyDialog.find( ".layout-copy-selector-list" );
            this.copyDialogPortalTitle = this.copyDialog.find( ".layout-copy-selector-target i" );

            this.copyDialogPortalTitle.text( ["个人门户", "项目门户", "企业门户"][RequestDataObject.GetPortalType()] );

            this.copyDialog.on( "click", ".layout-copy-selector-list > li", function ()
            {
                $( this ).addClass( "sel" ).siblings().removeClass( "sel" );
            });

            var win: JQuery = $( window );
            var copyDialogHeight: number = this.copyDialog.height();
            var copyDialogWidth: number = this.copyDialog.width();

            win.on( "resize scroll", () =>
            {
                if ( this.copyDialog.css( "display" ) !== "none" )
                {
                    this.copyDialog.stop().animate( {
                        left: ( win.width() - copyDialogWidth ) / 2,
                        top: ( win.height() - copyDialogHeight ) / 2 + win.scrollTop()
                    }, 300, "swing" );
                }
            });

            this.copyButton.on( "click", () =>
            {
                $( ".setting-dialog" ).hide();

                this.selectCopyList.children( "li" ).removeClass( "sel" );

                this.copyDialog.css( { left: ( win.width() - copyDialogWidth ) / 2, top: 0 }).show();
                win.trigger( "resize" );
            });

            this.reload.on( "click", function ()
            {
                $( ".setting-dialog" ).hide();

                $( ".content-placeholder[contenttype]:visible" ).each( function ( i, e )
                {
                    var me: JQuery = $( this );
                    var c: JQuery = me.find( ".content" );
                    var t: number = Number( me.attr( "contenttype" ) );

                    if ( t === ContentType.FramePage )
                    {
                        var iframe: JQuery = me.find( "> .content > .iframe-page" );

                        var url: string = iframe.attr( "src" );
                        iframe.attr( "src", "about:blank" ).attr( "src", url );

                        return me;
                    }

                    if ( t === ContentType.CustomContent )
                    {
                        c.html( c.html() );
                        return me;
                    }

                    c.empty().addClass( "content-loading" ).append( '<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>' );

                    ContentBlock.ParseContentBlock( me ).LoadContent();

                    return me;
                });
            });

            this.colorScheme.on( "click", function ()
            {
                $( ".setting-dialog" ).hide();

                ColorScheme.Show();
            });

            this.cancelCopyButton.on( "click", () => this.copyDialog.hide() );

            this.selectCopyButton.on( "click", () =>
            {

                this.copyDialog.hide();

                var selected: JQuery = this.selectCopyList.children( ".sel" );

                if ( selected.length )
                {
                    var portalId: string = $.trim( selected.attr( "rel" ) );

                    if ( portalId )
                        DesignCanvas.ReLoadPortalLayout( portalId );
                }
            });

            this.LoadPortalList();

            DesignPanel.CanvasStatic = this.Canvas = new DesignCanvas();
            this.OperatControl = new OperatControl();
        }

        // 初始化设计面板
        public Init()
        {
            this.Canvas.Init( this.inner );
            this.OperatControl.Init();
        }

        // 隐藏设计面板
        public Hide()
        {
            this.panel.hide();
            this.copyButton.hide();
            this.reload.hide();
            this.colorScheme.hide();
        }

        // 显示设计面板
        public Show()
        {
            this.panel.fadeIn( 1000 );
            this.copyButton.fadeIn( 500 );
            this.reload.fadeIn( 500 );
            this.colorScheme.fadeIn( 500 );
        }

        private LoadPortalList()
        {
            var my = this;

            ajax( "FillData.ashx", { "action": "GetPortalPageList", "PortalType": RequestDataObject.GetPortalType(), "randData": new Date().getTime() }, "json", function ( data )
            {
                if ( data.Success === "Y" )
                {
                    my.BuildPortalList( new Function( "return " + data.Data + ";" )() );
                }
            });
        }

        // 加载门户列表
        private BuildPortalList( list: Object )
        {
            var format: string = '<li rel="{0}">{1}</li>';
            delete list[RequestDataObject.GetPortalId()];

            for ( var i in list )
            {
                if ( list.hasOwnProperty( i ) )
                {
                    this.selectCopyList.append( format.replace( "{0}", i ).replace( "{1}", list[i] ) );
                }
            }
        }
    }

    /**
     * @class: ReviewPanel
     * @description: 表示 [预览] 面板视图的类
     * @remark:
     *      [预览] 提供展示门户页设计的最终结果，他与前台展示所呈现的结果一致。
    */
    class ReviewPanel
    {
        private panel: JQuery;
        private reviewFrame: JQuery;
        private win: JQuery;
        private innerWin: JQuery;

        constructor()
        {
            this.panel = $( ".design-box > .review-panel" );
            this.reviewFrame = $( ".review-page-frame" );
            this.win = $( window.parent );
            this.innerWin = $( window );

            this.win.on( "resize", () =>
            {
                try
                {
                    this.reviewFrame.height( this.innerWin.height() - this.reviewFrame.position().top - 20 );
                } catch ( msg )
                {
                }
            });

            this.reviewFrame.on( "load", () => this.win.trigger( "resize" ) );
        }

        // 隐藏预览面板
        public Hide()
        {
            this.panel.hide();
        }

        // 开始创建预览视图
        public BuildReview( result: string )
        {
            SplitterContainer.HideAll();

            var big: JQuery = LoadingBox.CreateBigLoading( "正在保存布局 ...", "../../image/big-loading.gif" );

            this.panel.empty().append( big ).fadeIn( 1000 );

            SavePortalLayout( RequestDataObject.GetPortalId(), result, ( result: boolean ) =>
            {
                if ( result )
                {
                    this.reviewFrame.attr( "src", "../../home/portal/portal.html?systemdebug=true&portal=" + RequestDataObject.GetPortalId() + "&id=" + RequestDataObject.GetID() + "&portalType=" + RequestDataObject.GetPortalType() );
                    this.panel.empty().append( this.reviewFrame );
                }
                else
                {
                    var span: JQuery = big.find( "span" );
                    var img: JQuery = big.find( "img" );

                    img.attr( "src", "../../image/big-info.png" );
                    span.text( "保存布局失败 ..." );
                }
            });
        }
    }

    class QuickHelp
    {
        private help: JQuery = null;
        private static _quickHelp: QuickHelp = null;

        constructor()
        {
            this.help = $( ".quick-help" );

            this.help.on( "blur", () => this.help.hide() );
        }

        public static Show( title: string, content: string ): void
        {
            if ( QuickHelp._quickHelp === null )
            {
                QuickHelp._quickHelp = new QuickHelp();
            }

            var h: JQuery = QuickHelp._quickHelp.help;
            h.find( "dt" ).text( title + "帮助" );
            h.find( "dd" ).html( content );
            h.show().focus();
        }
    }

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
    export class DesignCanvas
    {
        public static Canvas: JQuery;
        public static GroundLayout: Layout;

        private canvas: JQuery;
        private layout: Layout;     // 画板同时也是最底层的布局

        private operatControlBox: JQuery;

        public static EmptyContent: string = '<div class="empty-content"></div>';

        constructor()
        {
            this.canvas = DesignCanvas.Canvas = $( ".design-panel-inner .design-canvas" );
            this.layout = DesignCanvas.GroundLayout = new Layout( this.canvas );

            this.operatControlBox = $( ".operat-control-box" );

            DesignCanvas.AutoBinding();
        }

        /** 绑定所有数字列表
          * 当内容块的内容为列表时（无序列表 ul 或有序列表 ol），若应用了 number 样式类则自动插入数字及相关样式。
        */
        private static BindingNumber(): void
        {
            $( "ul.number,ol.number" ).each( function ( i, e )
            {
                var me: JQuery = $( this );

                if ( !me.data( "loadcompleted" ) )
                {
                    var all_item: JQuery = me.find( "li" );

                    all_item.each( function ( index, element )
                    {
                        var me: JQuery = $( this );
                        var i: JQuery = me.children( "i,em" );

                        if ( i.length === 0 )
                        {
                            me.html( ( "<em>" + ( index + 1 ) + "</em>" ) + me.html() );
                        } else
                        {
                            i.text( index + 1 );
                        }

                        return me;
                    });

                    all_item.find( "i:first-child,em:first-child" ).addClass( "numberic" );

                    if ( all_item.length > 0 )
                    {
                        var first: JQuery = all_item.eq( 0 ).addClass( "first" );
                    }

                    if ( all_item.length > 1 )
                    {
                        var second: JQuery = all_item.eq( 1 ).addClass( "second" );
                    }

                    if ( all_item.length > 2 )
                    {
                        var third: JQuery = all_item.eq( 2 ).addClass( "third" );
                    }

                    me.data( "loadcompleted", true );
                }

                return me;
            });
        }

        public static AutoBinding(): void
        {
            DesignCanvas.BindingNumber();
        }

        public static HiddenElement()
        {
            LayoutQuickToolbar.Hide();
            FramePageSetting.Reset();
            CustomContentSetting.Reset();
            MinWidthInfoBox.Hide();
        }

        public static GetMoreUrl( url: string ): string
        {
            return url ? ( url + ( url.indexOf( "?" ) === -1 ? "?" : "&" ) +
                "PortalType=" + RequestDataObject.GetPortalType() + "&PortalOwnerID=" + RequestDataObject.GetID() ) : "";
        }

        public static PrevProcess( result: string ): JQuery
        {
            var jResult: JQuery = null;

            if ( result )
            {
                jResult = $( result );

                jResult.find( ".title-func > a:not(.refresh,.help)" ).attr( "href", function ()
                {
                    var me = $( this );
                    return "javascript: openWindow('" + DesignCanvas.GetMoreUrl( me.attr( "rel" ) ) + "', " + me.attr( "opensize" ) + " )";
                });
            }

            return jResult;
        }

        public static HtmlInitialize( container: JQuery, html: string )
        {
            html = $.trim( html );
            var jResult = DesignCanvas.PrevProcess( html );

            if ( html )
                container.removeClass( "init-size" );

            container.empty();

            if ( jResult && jResult.length )
            {
                container.append( jResult );
            } else
            {
                container.append( DesignCanvas.EmptyContent );
            }

            container.find( ".layout-table" ).each( function ( i, elem )
            {
                var me: JQuery = $( this );

                new Layout( me, "" ).ActiveLayout();

                return me;
            });

            var normalHolders = container.find( ".content-placeholder[contenttype]" );

            normalHolders.filter( "[contenttype=" + ContentType.Normal + "]" ).find( ".content" )
                .addClass( "content-loading" )
                .append( '<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>' );

            normalHolders.each( function ( i, elem )
            {
                var me: JQuery = $( this );
                var c: ContentBlock = ContentBlock.ParseContentBlock( me );

                if ( Number( me.attr( "contenttype" ) ) === ContentType.Normal )
                    c.LoadContent();

                ContentBlock.ActiveDroppable( c );

                return me;
            });

            DesignCanvas.GroundLayout.ActiveLayout();    // 使画板面板成为拖放目标，开始允许接受拖放

            AutoRefresher.Initizal();   // 初始化自动刷新器
            TabPanelSetting.Apply();
        }

        public static ReLoadPortalLayout( portalId: string )
        {
            // 加载内容页
            LoadPortalLayout( portalId, ( result: string ) => DesignCanvas.HtmlInitialize( DesignCanvas.Canvas, result ) );
        }

        public Init( parent: JQuery )
        {
            var __cv: DesignCanvas = this;

            this.operatControlBox.on( "blur", () => this.operatControlBox.hide() );

            this.operatControlBox.on( "mouseenter", () => this.operatControlBox.off( "blur" ) );

            this.operatControlBox.on( "mouseleave", () =>
            {
                this.operatControlBox.on( "blur", () => this.operatControlBox.hide() ).focus();
            });

            this.operatControlBox.find( ".icon-only" ).on( "click", function ()
            {
                var t: JQuery = __cv.operatControlBox.data( "target" );
                var me: JQuery = $( this );

                if ( t && t.length )
                {
                    if ( me.attr( "checked" ) )
                    {
                        t.children( "img" ).show();
                    } else
                    {
                        t.children( "img" ).hide();
                    }
                }
            });

            this.operatControlBox.find( ".text-only" ).on( "click", function ()
            {
                var t: JQuery = __cv.operatControlBox.data( "target" );
                var me: JQuery = $( this );

                if ( t && t.length )
                {
                    if ( me.attr( "checked" ) )
                    {
                        t.children( "span" ).show();
                    } else
                    {
                        t.children( "span" ).hide();
                    }
                }
            });

            this.operatControlBox.find( ".input" ).on( "keyup", function ()
            {
                var t: JQuery = __cv.operatControlBox.data( "target" );

                if ( t && t.length )
                {
                    t.find( "span" ).text( this.value );
                }
            });

            this.operatControlBox.find( ".hide-operat-button" ).on( "click", function ()
            {
                var t: JQuery = __cv.operatControlBox.data( "target" );

                if ( t && t.length )
                {
                    t.hide();
                }

                __cv.operatControlBox.hide();
            });

            // 设置画板宽度，并在窗口尺寸改变时保持比例
            this.canvas.hide().width( parent.width() - 210 ).show();

            this.canvas.on( "resize", () =>
            {
                this.canvas.stop().animate( { width: parent.width() - 210 }, 300, "swing" );
                DesignView.Resizable = true;
                return false;
            });

            $( window ).on( "resize", () =>
            {
                DesignCanvas.HiddenElement();
                LayoutSetting.ReSet();

                this.canvas.trigger( "resize" );
            }).resize();

            // 每秒执行一次所有布局的尺寸调整
            setInterval( () =>
            {
                if ( DesignView.Resizable )
                {
                    DesignCanvas.Canvas.find( ".layout-table > tbody > tr > td:visible" ).trigger( "resize" );
                    DesignCanvas.Canvas.trigger( "resize" );
                }
            }, 1000 );

            // 加载当前门户页
            DesignCanvas.ReLoadPortalLayout( RequestDataObject.GetPortalId() );

            // 双击时改变布局宽度的方式：使用固定宽度或百分比
            this.canvas.on( "dblclick", "td", function ()
            {
                if ( this.getAttribute( "splitter" ) === "hor" && ( this.nextSibling || this.previousSibling ) )
                {
                    var me: JQuery = $( this );

                    var sizeunit: number = Number( this.getAttribute( "sizeunit" ) );
                    sizeunit = isNaN( sizeunit ) ? LayoutSizeUnit.Percent : sizeunit;

                    var finalunit: LayoutSizeUnit = ( sizeunit === LayoutSizeUnit.Percent ? LayoutSizeUnit.Pixel : LayoutSizeUnit.Percent );

                    this.setAttribute( "sizeunit", finalunit );

                    var sibling: JQuery = me.siblings();    // 同辈的另一个横向布局

                    if ( finalunit === LayoutSizeUnit.Pixel )
                    {
                        me.addClass( "pixel" ).width( me.width() ); // 重新设置为像素值 (me.width() 返回像素值)

                        if ( Number( sibling.attr( "sizeunit" ) ) === LayoutSizeUnit.Pixel )    // 若另外一个同辈元素也是按像素固定宽度
                        {
                            // 则将其设置为按百分比 (不允许两个都是按像素固定宽度，必须使其中一个根据浏览器宽度自动伸展)

                            // 设置另外一个宽度为自动(auto)，并且设置其按百分比伸展
                            sibling.attr( "sizeunit", LayoutSizeUnit.Percent ).removeClass( "pixel" );
                        }
                    }
                    else
                    {
                        // 自动转宽度为百分比，当前宽度 +5 个像素的误差值。
                        me.removeClass( "pixel" ).width( () => Math.floor( ( me.width() + 5 ) / me.parent().width() * 100 ) + "%" );
                    }

                    sibling.width( () => "auto" );  // 另一个横向布局自动伸展
                }

                return false;
            }).on( "mouseenter", "td > .empty-content", function ()    // 鼠标移动到布局的 spaceholder（是指布局占位，等待拖放布局或内容块的元素） 时，显示当前布局的尺寸信息和其他快速工具
                {
                    if ( DesignView.Resizable )
                        LayoutQuickToolbar.Anchor( $( this ) );

                    return false;
                }).on( "mouseout", "td > .empty-content", function ()      // 鼠标移出布局的 spaceholder 时，隐藏布局尺寸信息和其他快速工具
                {
                    if ( DesignView.Resizable )
                        LayoutQuickToolbar.Hide();

                    return false;
                }).on( "dblclick", ".content-placeholder", function ()     // 双击内容块禁止其事件冒泡
                {
                    return false;
                }).on( "mouseenter", ".content-placeholder", function ()     // 移动鼠标到内容块显示其最小宽度
                {
                    MinWidthInfoBox.Anchor( $( this ) );
                    return false;
                }).on( "dblclick", ".content-placeholder > .title > .title-span", function ()      // 双击内容块标题使其支持编辑文本
                {
                    var my: JQuery = $( this );
                    var pos: IPosition = <IPosition>my.offset();

                    TextCover.Anchor( my, { left: pos.left, top: pos.top + 4 }, { width: my.width() + 10, height: 20 }, null, "content-placeholder-title-editing" );

                    return false;
                }).on( "mouseenter", ".content-placeholder > .content .iframe-page", function ()   // 鼠标移动到框架页面内容块上，显示路径的配置框
                {
                    CustomContentSetting.Reset();
                    FramePageSetting.Anchor( $( this ) );
                    return false;
                }).on( "mouseout", ".content-placeholder > .content .iframe-page", function ()   // 鼠标移出框架页面内容块
                {
                    FramePageSetting.Reset();
                    return false;
                }).on( "mouseenter", ".content-placeholder > .content.custom-content-block", function ()   // 鼠标移动到自定义内容块上，显示内容的配置框
                {
                    FramePageSetting.Reset();
                    CustomContentSetting.Anchor( $( this ) );
                    return false;
                }).on( "mouseout", ".content-placeholder > .content.custom-content-block", function ()   // 鼠标移出自定义内容块
                {
                    CustomContentSetting.Reset();
                    return false;
                }).on( "click", ".content-placeholder > .setting", function ()    // 点击内容块的 [设置] 按钮
                {
                    var me: JQuery = $( this );
                    SettingShortcutMenu.Anchor( me.closest( ".content-placeholder" ), me );
                    return false;
                }).on( "click", ".content-placeholder .title-func > .help", function ()
                {
                    var me: JQuery = $( this );
                    var p: JQuery = me.closest( ".content-placeholder" );
                    var hc: string = $.trim( p.attr( "remark" ) );

                    DesignCanvas.HiddenElement();

                    QuickHelp.Show( p.find( ".title .title-span" ).text(), hc || "尚无任何帮助内容" );

                    return false;
                }).on( "click", ".content-placeholder .title-func > .refresh", function ()
                {
                    var me: JQuery = $( this );
                    var p: JQuery = me.closest( ".content-placeholder" );
                    var t: number = Number( p.attr( "contenttype" ) );

                    if ( t === ContentType.FramePage )
                    {
                        var iframe: JQuery = p.find( "> .content > .iframe-page" );

                        var url: string = iframe.attr( "src" );
                        iframe.attr( "src", "about:blank" ).attr( "src", url );

                        return false;
                    }

                    if ( t === ContentType.CustomContent )
                    {
                        p.find( ".content" ).html( p.find( ".content" ).html() );
                        return false;
                    }

                    var holders: JQuery = p.find( ".content-placeholder[contenttype=" + ContentType.Normal + "]:visible" );
                    var isOnTabLayout: boolean = ( p.parent( "td" ).parent( "tr" ).parent( "tbody" ).parent( "table.layout-table.tab" ).length > 0 );

                    if ( !isOnTabLayout )
                    {
                        holders = holders.add( p );
                    }

                    holders.find( ".content" ).empty()
                        .addClass( "content-loading" )
                        .append( '<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>' );

                    holders.each( function ( i, e )
                    {
                        return ContentBlock.ParseContentBlock( $( this ) ).LoadContent();
                    });

                    return false;
                }).on( "mouseover", ".content-placeholder .title-func > a", function ()
                {
                    var me: JQuery = $( this );
                    var ocb: JQuery = __cv.operatControlBox;
                    var txt: JQuery = me.children( "span" );

                    ocb.find( ".icon-only" ).attr( "checked", ( me.children( "img" ).css( "display" ) !== "none" ).toString() );
                    ocb.find( ".text-only" ).attr( "checked", ( txt.css( "display" ) !== "none" ).toString() );

                    ocb.find( ".input" ).val( txt.text() );

                    ocb.data( "target", me );

                    ocb.show().position( { of: me, offset: "0 5", my: "center top", at: "center bottom" }).focus();

                    return false;
                }).on( "click", ".content-placeholder > .title > .title-image", function ()
                {
                    var holder: JQuery = $( this ).closest( ".content-placeholder" );
                    var c: JQuery = holder.children( ":not(.title,.setting)" );

                    if ( c.filter( ":visible" ).length )
                    {
                        holder.closest( ".layout-table" ).parent().height( () => "auto" );
                        c.fadeOut( 200 ).hide( 200 );
                    } else
                    {
                        c.fadeIn( 200 ).show( 200 );
                    }

                    return false;
                }).on( "click", ".content-placeholder .title-pager > a", function ()
                {
                    var me: JQuery = $( this );
                    me.attr( "disabled", "disabled" );

                    if ( !me.hasClass( "sel" ) )
                    {
                        var p: JQuery = me.closest( ".content-placeholder" );

                        p.children( ".content" ).attr( "pageindex", me.attr( "rel" ) );
                        ContentBlock.ParseContentBlock( p ).LoadContent( () => me.removeAttr( "disabled" ) );
                    }
                }).on( "mouseover", ".content-placeholder", function ()
                {
                    var me = $( this );
                    if ( me.attr( "contentscrolling" ) === "true" )
                    {
                        ContentScrolling.Pause( me );
                    }

                    return false;
                }).on( "mouseleave", ".content-placeholder", function ()
                {
                    var me = $( this );
                    if ( me.attr( "contentscrolling" ) === "true" )
                    {
                        ContentScrolling.Resume( me );
                    }

                    return false;
                }).on( "resize", ".layout-table > tbody > tr > td", function ()
                {
                    if ( !DesignView.Resizable )
                        return false;

                    var me: JQuery = $( this ), attach: JQuery = me, e: HTMLElement = this, child: JQuery = me.children();

                    try
                    {
                        var direct: string = e.getAttribute( "splitter" );

                        if ( direct )   // 使用分割条
                        {
                            if ( direct === "ver" )
                                attach = $( e = e.parentElement );

                            if ( !e.nextSibling )   // 忽略最后一个元素
                                return;

                            var split: JQuery = <JQuery>attach.data( "splitter" );

                            if ( !split || split.length === 0 ) // 生成分割条
                                split = SplitterContainer.CreateSplitter( attach, direct );

                            var o: any = splitterOptions[direct];

                            if ( direct === "hor" )
                            {
                                split.height( attach.height() - 10 );

                                // 调整分割条可拖动的范围
                                var p: JQuery = me.parent();
                                var y: number = split.position().top;

                                split.draggable( "option", "containment", [me.position().left + 50, y, p.position().left + p.width() - 50, y] );
                            }
                            else
                            {
                                split.width( attach.width() - 10 );
                            }

                            split.position( { of: attach, offset: o.offset, my: o.my, at: o.at }).show();
                        }
                    } catch ( msg )
                    {

                    }

                    return false;
                });

            TabGlobalBinder.ApplyBinding();     // 为所有未来的标签页绑定事件，包括标签的点击、[新增标签]按钮点击等等元素的事件绑定
        }

        // 对所有当前可视的布局执行尺寸调整
        public static DoResizeInterval()
        {
            if ( DesignView.Resizable )
            {
                DesignCanvas.Canvas.find( ".layout-table > tbody > tr > td:visible" ).trigger( "resize" );
                DesignCanvas.Canvas.trigger( "resize" );
            }
        }

        // 获得最终结果的HTML
        public GetFinalOutputHTML( parent: JQuery = this.canvas ): string
        {
            var c: JQuery = parent.clone();

            var h = c.find( ".content-placeholder" )
                .removeAttr( "resourceindex" )
                .removeClass( "load-fail" )
                .css( { "min-height": "" })
                .filter( "[contenttype=" + ContentType.Normal + "]" );

            var content = h.find( ".content" );

            content.each( function ( i, e )
            {
                var me = $( e );
                me.attr( "href", me.attr( "originalHref" ) );
            });

            content.removeAttr( "style" )
                .removeAttr( "originalHref" )
                .removeClass( "load-fail-bg content-loading" )
                .html( "" );

            h.find( ".title-pager" ).html( "" );

            return c.html();
        }
    }

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
    export class OperatControl
    {
        private control: JQuery;
        private isLoad: boolean = false;    // 是否已加载
        private tabs: JQuery;   // 所有标签页
        private contentHeader: JQuery;

        public OperatButtons: OperatButtonArea;   // 操作按钮区
        public LayoutElementSelector: LayoutElementArea;    // 布局元素选择区
        public ContentBlocks: ContentBlockArea;   // 内容块区
        public ContentBlockGroups: ContentBlockGroupArea; // 内容块组

        constructor()
        {
            this.control = $( ".design-panel-control" );
            this.tabs = $( ".design-panel-control h3 > span" );
            this.contentHeader = $( ".design-control-layout-content-header" );

            this.OperatButtons = new OperatButtonArea();
            this.LayoutElementSelector = new LayoutElementArea();
            this.ContentBlocks = new ContentBlockArea();
            this.ContentBlockGroups = new ContentBlockGroupArea();
        }

        public Init()
        {
            var win: JQuery = $( window );

            win.on( "scroll", () =>
            {   // 当窗口的滚动条滚动时，计算并漂浮到新的位置
                if ( this.isLoad )
                {
                    var top: number = win.scrollTop();
                    this.control.stop().animate( { top: top > 51 ? ( top - 41 ) : 0 }, 500, "easeInOutQuint" );
                }
            });

            this.control.fadeIn( 300, () => { win.trigger( "scroll" ); });
            this.isLoad = true;

            this.tabs.click( function ()    // 使控制面板中的标签页支持点击
            {
                $( this ).addClass( "sel" ).siblings( "span" ).removeClass( "sel" );
            });

            this.contentHeader.click( () => { this.LayoutElementSelector.Active(); });

            this.OperatButtons.Init();
            this.LayoutElementSelector.Init();
            this.ContentBlocks.Init();
            this.ContentBlockGroups.Init();
        }
    }

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
    export class OperatButtonArea
    {
        private btns: JQuery;

        private undo: JQuery;   // 撤销按钮
        private redo: JQuery;   // 重做按钮
        private clean: JQuery;  // 清除按钮
        private save: JQuery;   // 保存按钮

        constructor()
        {
            this.btns = $( ".design-panel-control .operat-box a" );

            this.undo = this.btns.filter( ".undo" );
            this.redo = this.btns.filter( ".redo" );
            this.clean = this.btns.filter( ".clean" );
            this.save = this.btns.filter( ".save" );
        }

        public Init()
        {
            this.btns.mousedown( function ()
            {
                $( this ).css( { opacity: 0.5 });
            }).mouseup( function ()
                {
                    $( this ).css( { opacity: 1 });
                });

            this.undo.on( "click", () =>
            {
                //todo:
                alert( "正在开发中 ..." );
            });

            this.redo.on( "click", () =>
            {
                alert( "正在开发中 ..." );
            });

            this.clean.on( "click", () =>
            {
                var empty = $( DesignCanvas.EmptyContent );

                SplitterContainer.DeleteAll( "" );
                DesignCanvas.Canvas.empty().append( empty );

                Layout.ActiveDroppable( empty );
            });

            this.save.on( "click", () =>
            {
                SavePortalLayout( RequestDataObject.GetPortalId(), DesignPanel.CanvasStatic.GetFinalOutputHTML(), function ( result: boolean )
                {
                    if ( result )
                    {
                        alert( "保存成功。" );
                    }
                    else
                    {
                        alert( "保存失败。" );
                    }
                });
            });
        }
    }

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
    export class LayoutElementArea
    {
        private normalPage: JQuery;         // 普通布局元素页
        private complexPage: JQuery;        // 预设布局元素页

        private elementBox: JQuery;         // 布局外框
        private elements: JQuery;           // 所有布局元素
        private defaultElements: JQuery;    // 普通布局元素
        private complexElements: JQuery;    // 预设布局元素

        constructor()
        {
            this.normalPage = $( ".design-panel-control .select-layout-element" );
            this.complexPage = $( ".design-panel-control .select-complex-layout-element" );

            this.elementBox = $( ".design-control-layout-element" );
            this.elements = this.elementBox.children( "li" );
            this.defaultElements = this.elementBox.children( ".default" );
            this.complexElements = this.elementBox.children( ".complex" );
        }

        public Init()
        {
            this.normalPage.click( () =>
            {
                this.elementBox.animate( { height: 80 }, 500, "easeInOutQuint" );
                this.defaultElements.fadeIn( 500 );
                this.complexElements.hide();
            });

            this.complexPage.click( () =>
            {
                this.elementBox.animate( { height: 420 }, 500, "easeInOutQuint" );
                this.defaultElements.hide();
                this.complexElements.fadeIn( 500 );
            });

            // 元素拖放
            this.elements.draggable( {
                addClasses: false,
                appendTo: "#layout-dragging-shelter",
                helper: "clone",
                opacity: 0.7,
                revert: "invalid",
                scroll: false,
                start: function ( event, ui )
                {
                    DesignCanvas.HiddenElement();
                    LayoutSetting.ReSet();
                },    // 开始拖放
                drag: function ( event, ui ) { },     // 拖动
                stop: function ( event, ui ) { }      // 停止拖动
            });
        }

        public Active() // 激活布局元素选择
        {
            this.normalPage.click();
        }
    }

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
    export class ContentBlockArea
    {
        private block: JQuery;
        private search: JQuery;     // 搜索框
        private categoryButton: JQuery;     // 分类按钮
        private categoryListBox: JQuery;    // 分类列表
        private prompt: JQuery;     // 提示文本
        private contentPreview: JQuery;

        private iconOnleyButton: JQuery;
        private detailButton: JQuery;

        constructor()
        {
            this.block = $( ".design-control-layout-contents" );
            this.search = $( ".design-panel-control .search-content-input" );
            this.categoryButton = $( ".design-panel-control .search-choose-category" );
            this.categoryListBox = $( ".design-panel-control .search-choose-categories-box" );
            this.prompt = $( ".content-block-prompt" );

            this.contentPreview = $( ".content-block-preview" );

            this.iconOnleyButton = $( ".search-content-input-box .show-style .only-icon-style" );
            this.detailButton = $( ".search-content-input-box .show-style .detail-style" );

            var my: ContentBlockArea = this;

            var contentBlockTabPanel: JQuery = $( ".content-block-tab-panel" );
            var contentBlockGroupTabPanel: JQuery = $( ".content-block-group-tab-panel" );

            $( ".select-content" ).on( "click", function ()
            {
                contentBlockTabPanel.show();
                contentBlockGroupTabPanel.hide();
            });

            $( ".select-content-group" ).on( "click", function ()
            {
                contentBlockTabPanel.hide();
                contentBlockGroupTabPanel.show();
            });

            this.iconOnleyButton.on( "click", function ()
            {
                var me = $( this );

                if ( !me.hasClass( "sel" ) )
                {
                    my.detailButton.removeClass( "sel" );
                    me.addClass( "sel" );

                    my.getContents().removeClass( "detail-list" );
                }
            }).addClass( "sel" );

            this.detailButton.on( "click", function ()
            {
                var me = $( this );

                if ( !me.hasClass( "sel" ) )
                {
                    my.iconOnleyButton.removeClass( "sel" );
                    me.addClass( "sel" );

                    my.getContents().addClass( "detail-list" );
                }
            });

            this.prompt.on( "mouseenter", () => this.prompt.hide() );
            var timer: number = Number.NaN;

            this.contentPreview.on( "blur", () =>
            {
                this.contentPreview.hide();
            });

            this.block.on( "mouseenter", "li", function ()
            {
                var me: JQuery = $( this );
                var pos: IPosition = <IPosition>me.offset();

                my.prompt.text( me.attr( "rel" ) );

                var sub: number = ( my.prompt.width() - me.width() ) / 2;
                pos.left -= sub;
                pos.top += me.height() + 12;

                my.prompt.css( pos ).fadeIn( 100 );

                window.clearTimeout( timer );
                timer = window.setTimeout( () => my.prompt.hide(), 7000 );
            }).on( "mouseleave mousedown", "li", () =>
                {
                    this.prompt.hide();
                }).on( "dblclick", "li", function ()
                {
                    var me: JQuery = $( this );
                    var prev: JQuery = my.contentPreview.find( ".preview" ).empty().text( "正在加载 ..." );

                    my.contentPreview.children( ".preview-title" ).text( "预览 - " + me.find( "span" ).text() );
                    my.contentPreview.show().focus().position( { of: me, offset: "0 0", my: "right bottom", at: "right top" });

                    var cb: ContentBlock = new ContentBlock( me, () =>
                    {
                        var w: number = cb.Template.option.minwidth;
                        var tab: JQuery = cb.Content.find( ".tab" );

                        if ( tab.length )
                        {
                            tab.find( "> .tab-pages > .tab-page:eq(0)" ).addClass( "sel" );
                            tab.children( ".tab-panel:eq(0)" ).show();
                        }

                        prev.empty().width( ( w > 400 ) ? w : 400 ).append( cb.Content );
                        TabPanelSetting.Apply();

                        // todo: undo/redo
                        DesignCanvas.DoResizeInterval();

                        my.contentPreview.position( { of: me, offset: "0 0", my: "right bottom", at: "right top" });
                    });

                    if ( cb && cb.Content && cb.Template.contentType !== ContentType.Normal )
                    {
                        var w: number = cb.Template.option.minwidth;

                        prev.empty().width( ( w > 400 ) ? w : 400 ).append( cb.Content );
                        TabPanelSetting.Apply();

                        // todo: undo/redo
                        DesignCanvas.DoResizeInterval();

                        my.contentPreview.position( { of: me, offset: "0 0", my: "right bottom", at: "right top" });
                    }
                });
        }

        // 获得所有内容块
        private getContents(): JQuery
        {
            return this.block.find( "li" );
        }

        // 内容块下拉列表框配置
        private categoryListBoxSetting()
        {
            var my: ContentBlockArea = this;

            this.categoryButton.click( ( e ) =>
            {       // 当点击类别时显示 [内容块分类下拉框]，再次点击时收起
                if ( this.categoryListBox.css( "display" ) === "none" )
                {
                    this.categoryListBox.slideDown( 200 );
                    this.categoryListBox.focus();
                } else
                {
                    this.categoryListBox.slideUp( 200 );
                }
            });

            this.categoryListBox.focusout( () => { this.categoryButton.trigger( "click" ) });

            // 点击内容块分类下拉框中的某个分类时，则筛选该分类
            this.categoryListBox.on( "click", "li", function ()
            {
                var showCategory: string = this.getAttribute( "typename" );

                my.search.val( showCategory ? ( "[" + $.trim( this.innerText ) + "] 分类" ) : "" ).triggerHandler( "keyup" );

                if ( !showCategory )
                {
                    my.search.triggerHandler( "focusout" );
                    my.categoryButton.focus();
                }
                else
                {
                    my.search.triggerHandler( "focus" );
                }

                return false;
            });
        }

        // 搜索框配置
        private searchTextBoxSetting()
        {
            var my: ContentBlockArea = this;

            this.search.focus( function ()
            {
                $( this ).addClass( "search-content-input-focus" ).select();
            }).focusout( function ()
                {
                    if ( !$.trim( this.value ) )
                        $( this ).removeClass( "search-content-input-focus" );
                }).keyup( function ()      // 开始搜索内容块
                {
                    var v: string = $.trim( this.value );
                    var c: JQuery = my.getContents();

                    if ( !v )
                    {
                        c.show();
                    } else
                    {
                        var category: string[] = v.match( /\[(.+?)\]/ );    // 判断是否搜索的是内容块分类
                        c.hide().filter( category ? ( "[typename='" + $.trim( category[1] ) + "']" ) : "[rel*='" + v + "']" ).show();
                    }
                });
        }

        // 激活所有内容块支持拖动
        public ActiveContentBlockDraggable()
        {
            var prompt: JQuery = this.prompt;

            this.getContents().draggable( {
                addClasses: false,
                appendTo: "#content-dragging-shelter",
                helper: "clone",
                opacity: 0.7,
                revert: "invalid",
                scroll: false,
                start: function ( event, ui )    // 开始拖放
                {
                    prompt.hide();
                    DesignCanvas.HiddenElement();
                    LayoutSetting.ReSet();

                    ContentPlaceholderDraggingIndicator.Create( ui.helper );
                },
                drag: function ( event, ui )     // 拖动
                {
                    prompt.hide();
                    ContentPlaceholderDraggingIndicator.UpdateIndicator( ui.offset );
                },
                stop: function ( event, ui )      // 停止拖动
                {
                    ContentPlaceholderDraggingIndicator.Reset();
                    prompt.hide();
                }
            });
        }

        // 初始化内容块框
        public Init()
        {
            this.categoryListBoxSetting();
            this.searchTextBoxSetting();

            ContentBlockTemplateList.InitSystemTemplate();
        }

        private static _category_format: string = '<li typename="{0}">{0}</li>';

        // 添加分类到内容块分类下拉框
        private addCategory( categoryName: string )
        {
            if ( this.categoryListBox.find( "li[typename='" + categoryName + "']" ).length === 0 )
            {
                this.categoryListBox.append( ContentBlockArea._category_format.replace( /\{0\}/g, categoryName ) );
            }
        }

        private static _format: string = '<li dropType="2" rel="{0} {4}" remark="{5}" typename="{2}" template="{3}"><img onerror="imgError()" src="{1}" alt="" /><span>{0}</span></li>';

        // 加载所有内容块
        public LoadContentBlocks( rep: IAsyncResult )
        {
            if ( rep.Success && rep.Success.toUpperCase() === "Y" )     // 请求成功
            {
                var html: string = '';
                var contentDatas: IContentDataFormat[] = <IContentDataFormat[]>( new Function( "return " + rep.Data + ";" )() );

                if ( contentDatas && contentDatas.length )
                {
                    for ( var i: number = 0; i < contentDatas.length; i++ )
                    {
                        var obj: IContentDataFormat = contentDatas[i];
                        var categoryName: string = obj.typename ? $.trim( obj.typename ) : "系统";

                        var index: number = ContentBlockTemplateList.Push(
                            new ContentBlockTemplate( ContentType.Normal, obj )
                            );

                        html += ContentBlockArea._format
                            .replace( /\{0\}/g, obj.title )
                            .replace( /\{1\}/g, obj.ico )
                            .replace( /\{2\}/g, categoryName )
                            .replace( /\{3\}/g, index.toString() )
                            .replace( /\{4\}/g, "[" + categoryName + "]" )
                            .replace( /\{5\}/g, obj.remark || "" );

                        this.addCategory( categoryName );
                    }

                    this.block.append( html );
                    this.ActiveContentBlockDraggable();     // 激活所有内容块支持拖动
                }
            } else  // 失败
            {
                this.block.append( rep.Data );
            }
        }
    }

    export interface IContentGroup
    {
        key?: string;
        title: string;
        html: string;
        remark?: string;
    }

    /**
     * 内容块组区域
     */
    export class ContentBlockGroupArea
    {
        private block: JQuery;
        private search: JQuery;
        private groupBox: JQuery;
        private static groupBoxStatic: JQuery = null;
        private static blockStatic: JQuery = null;

        constructor()
        {
            this.block = $( ".content-block-group-tab-panel" );
            ContentBlockGroupArea.blockStatic = $( ".design-control-layout-content-group-box" );
            this.search = this.block.find( ".search-content-group-input" );
            this.groupBox = ContentBlockGroupArea.groupBoxStatic = this.block.find( ".design-control-layout-content-group" );
        }

        public Init()
        {
            var my = this;

            this.search.on( "focusin", function ()
            {
                $( this ).addClass( "search-content-input-focus" ).select();
            }).on( "focusout", function ()
                {
                    if ( !$.trim( this.value ) )
                        $( this ).removeClass( "search-content-input-focus" );
                }).on( "keyup", function ()
                {
                    var v: string = $.trim( this.value );
                    var c: JQuery = my.groupBox.children( "li" );

                    if ( !v )
                    {
                        c.show();
                    } else
                    {
                        c.hide().filter( ':contains(' + v + ')' ).show();
                    }
                });
        }

        /**
         * 创建组
         *
         * @param name 组名称
         * @param html 组 HTML 内容
         */
        public static CreateGroup( name: string, html: string ): void
        {
            if ( name )
            {
                ajax(
                    "FillData.ashx",
                    {
                        "action": "SavePortalBlockGroupHtml",
                        "PortalType": RequestDataObject.GetPortalType(),
                        "PBGName": name,
                        "Html": html,
                        "Remark": "",
                        "randData": new Date().getTime()
                    }, "json", function ( data )
                    {
                        if ( data )
                        {
                            if ( data.Success !== "Y" )
                            {
                                alert( data.Data );  // 异常消息，有可能是：名称重复、操作失败等
                            } else
                            {
                                $( ".select-content-group" ).trigger( "click" );

                                ContentBlockGroupArea.BuildGroupItem(
                                    ContentBlockGroupArea.groupBoxStatic,
                                    {
                                        title: name,
                                        html: html,
                                        remark: ""
                                    },
                                    true
                                    );

                                ContentBlockGroupArea.blockStatic.stop().animate( { "scrollTop": ContentBlockGroupArea.groupBoxStatic.height() }, "fast", "swing" );
                            }
                        } else
                        {
                            alert( "创建内容块组失败！" );
                        }
                    });
            }
        }

        private static format: string = '<li dropType="3" key="{0}">{1}</li>';

        public static GroupData: IContentGroup[] = null;

        /** 获取指定 key 的组数据 */
        public static GetGroupData( key: string ): IContentGroup
        {
            for ( var i in ContentBlockGroupArea.GroupData )
            {
                if ( ContentBlockGroupArea.GroupData && ContentBlockGroupArea.GroupData.hasOwnProperty( i ) )
                {
                    var item: IContentGroup = ContentBlockGroupArea.GroupData[i];
                    if ( item.key === key )
                        return item;
                }
            }

            return null;
        }

        /** 生成随机 Key */
        public static GenerateKey(): string
        {
            return String( new Date().getTime() ) + String( Math.floor( Math.random() * 1000000 ) );
        }

        public static HasKey( key: string )
        {
            return ( ContentBlockGroupArea.GetGroupData( key ) !== null );
        }

        /** 生成唯一 Key */
        public static GenerateUniqueKey(): string
        {
            var key = ContentBlockGroupArea.GenerateKey();
            return ContentBlockGroupArea.HasKey( key ) ? ContentBlockGroupArea.GenerateUniqueKey() : key;
        }

        /** 使所有内容块组支持拖放 */
        private static ApplyDraggable( target: JQuery )
        {
            target.draggable( {
                addClasses: false,
                appendTo: "#content-group-dragging-shelter",
                helper: "clone",
                opacity: 0.7,
                revert: "invalid",
                scroll: false,
                start: function ( event, ui ) { },    // 开始拖放
                drag: function ( event, ui ) { },    // 拖动
                stop: function ( event, ui ) { }     // 停止拖动
            });
        }

        public static BuildGroupItem( groupBox: JQuery, item: IContentGroup, apply: boolean = false )
        {
            item.key = ContentBlockGroupArea.GenerateUniqueKey();

            var jItem: JQuery = $(
                ContentBlockGroupArea.format
                    .replace( /\{0\}/g, item.key )
                    .replace( /\{1\}/g, item.title )
                );

            jItem.appendTo( groupBox );

            if ( apply )
            {
                ContentBlockGroupArea.GroupData.push( item );
                ContentBlockGroupArea.ApplyDraggable( jItem );
            }
        }

        /** 
         * 加载内容块组 
         *
         * @param data 内容块组的json数据
         */
        public LoadContentGroups( data: any )
        {
            if ( data )
            {
                if ( data.Success == "Y" )
                {
                    var d: IContentGroup[] = <IContentGroup[]>( new Function( "return " + data.Data + ";" )() );

                    if ( d && d.length > 0 )
                    {
                        ContentBlockGroupArea.GroupData = d;

                        for ( var i in d )
                        {
                            if ( d.hasOwnProperty( i ) )
                            {
                                var item: IContentGroup = d[i];

                                if ( $.trim( item.html ) )
                                {
                                    ContentBlockGroupArea.BuildGroupItem( this.groupBox, item );
                                }
                            }
                        }

                        ContentBlockGroupArea.ApplyDraggable( this.groupBox.find( "li" ) );
                    }
                } else
                {
                    alert( data.Data );
                }
            }
        }
    }

    /**
     * @class: AutoRefresher
     * @description: 表示自动刷新器的类
    */
    class AutoRefresher
    {
        // 初始化内容块自动刷新
        public static Initizal(): void
        {
            $( "div.content-placeholder[contenttype=0][autorefresh=true]" ).each( function ()
            {
                var me: JQuery = $( this );

                AutoRefresher.ApplyAutoRefresh( me, Number( me.attr( "refreshinterval" ) ) );

                return me;
            });
        }

        // 使内容块自动刷新
        // @param: targetContentBlock - 目标内容块
        // @param: interval - 刷新间隔，默认 60秒，若间隔值无效则使用默认值。
        public static ApplyAutoRefresh( targetContentBlock: JQuery, interval: number ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                interval = ( isNaN( interval ) || !interval || interval < 60 ) ? 60 : interval;

                AutoRefresher.CancelAutoRefresh( targetContentBlock );  // 取消之前的刷新器

                targetContentBlock.attr( "timerHandleId", window.setInterval( function ()
                {
                    ContentBlock.ParseContentBlock( targetContentBlock ).LoadContent();
                }, interval * 1000 ) );
            }
        }

        // 取消内容块自动刷新
        public static CancelAutoRefresh( targetContentBlock: JQuery ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                var timer = Number( targetContentBlock.attr( "timerHandleId" ) );

                if ( !isNaN( timer ) )
                {
                    window.clearInterval( timer );
                }
            }
        }
    }

    class ContentScrolling
    {
        public static Scrolling( block: JQuery ): void
        {
            try
            {
                if ( block.attr( "contentscrolling" ) === "true" )
                {
                    var c: JQuery = block.data( "contentPart" );
                    var height: number = block.data( "endheight" );
                    var top: number = c.scrollTop();
                    var top_last = top;

                    c.stop( true, true ).animate( { scrollTop: top + 5 }, 200, "linear", () =>
                    {
                        if ( c.scrollTop() === top_last )
                        {
                            c.stop().scrollTop( 0 );
                        }

                        ContentScrolling.Scrolling( block );
                    });
                } else
                {
                    ContentScrolling.CancelContentScrolling( block );
                }
            } catch ( e )
            {
            }
        }

        public static ApplyContentScrolling( targetContentBlock: JQuery ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                var c: JQuery = targetContentBlock.children( ".content" );
                var h: number = c.height();
                var inner: JQuery = c.wrapInner( () => '<div class="content-wrap-inner"></div>' ).children();
                var title: JQuery = targetContentBlock.children( ".title" );
                var mh: number = targetContentBlock.height() - ( title.length > 0 ? title.height() : 0 );

                c.height( mh );
                inner.css( { height: h + mh, paddingTop: mh });

                targetContentBlock.data( { "endheight": h + mh, "contentPart": c });

                ContentScrolling.Scrolling( targetContentBlock );
            }
        }

        public static Pause( targetContentBlock: JQuery ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                targetContentBlock.children( ".content" ).stop();
            }
        }

        public static Resume( targetContentBlock: JQuery ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                ContentScrolling.Scrolling( targetContentBlock );
            }
        }

        public static CancelContentScrolling( targetContentBlock: JQuery ): void
        {
            if ( targetContentBlock && targetContentBlock.hasClass( "content-placeholder" ) )
            {
                var c: JQuery = targetContentBlock.children( ".content" );
                var inner: JQuery = c.children( ".content-wrap-inner" );

                if ( inner.length )
                {
                    c.stop();
                    inner.children().unwrap();
                }
            }
        }
    }

    /**
     * @class: ContentBlockTemplate
     * @description: 表示内容块模版的基础类
    */
    export class ContentBlockTemplate
    {
        public TemplateIndex: number;

        constructor( public contentType: number, public option: IContentDataFormat )
        { }
    }

    /**
     * @class: ContentBlockTemplateList
     * @description: 表示内容块模板列表的静态类
     * @remark:
     *      所有被加载到内容块列表的内容块，各自均代表一种内容块（模板），事实上，通过拖放内容块到画板面板中，即生成一个内容块的实例。
     *      用户可自由更改其默认的配置，自定义为所需的最终的内容块。
     *
     *      这些实例的模版被统一由 ContentBlockTemplateList 管理。
    */
    class ContentBlockTemplateList
    {
        private static _list: ContentBlockTemplate[] = [];

        // 压入模版到列表，并返回该模版的索引号
        public static Push( t: ContentBlockTemplate ): number
        {
            var list: ContentBlockTemplate[] = ContentBlockTemplateList._list;
            var index: number = list.length;

            t.TemplateIndex = index;
            list.push( t );

            return index;
        }

        // 获取指定索引的模版
        public static GetTemplate( index: number ): ContentBlockTemplate
        {
            return ContentBlockTemplateList._list[index];
        }

        // 初始化系统模版，例如：自定义内容的内容块模版和框架页面内容块模板
        public static InitSystemTemplate()
        {
            ContentBlockTemplateList.Push( new ContentBlockTemplate( ContentType.FramePage, {
                title: "框架页面",
                typename: "系统",
                ico: "../../image/default-page.png",
                list: 0,
                head: 0,
                minwidth: 0,
                url: "",
                opts: null
            }) );

            ContentBlockTemplateList.Push( new ContentBlockTemplate( ContentType.CustomContent, {
                title: "自定义内容块",
                typename: "系统",
                ico: "../../image/content-page.png",
                list: 0,
                head: 0,
                minwidth: 0,
                url: "",
                opts: null
            }) );

            ContentBlockTemplateList.Push( new ContentBlockTemplate( ContentType.ImageContent, {
                title: "图片内容块",
                typename: "系统",
                ico: "../../image/content-image.png",
                list: 0,
                head: 0,
                minwidth: 0,
                url: "",
                opts: null
            }) );
        }
    }

    /**
     * @class: LayoutDefineList
     * @description: 表示布局定义列表的静态类
     * @remark:
     *      定义所有布局对应的定义 (HTML)，事实上，在拖动布局到设计画板(DesignCanvas)时，
     *      其实是所拖布局将对应的 HTML 插入到指定的位置（父布局）。
     *      
     *      本类定义了所有支持的布局所对应的 HTML。
    */
    class LayoutDefineList
    {
        public LayoutList: {};      // 布局定义列表
        private static _instance: LayoutDefineList = null;

        constructor()
        {
            this.initLayoutDefineList();
        }

        private static GetInstance()
        {
            if ( LayoutDefineList._instance === null )
                LayoutDefineList._instance = new LayoutDefineList();

            return LayoutDefineList._instance;
        }

        // 初始化所有布局对应的 HTML
        private initLayoutDefineList()
        {
            this.LayoutList = {
                //#region hor
                "hor": '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region ver
                "ver": '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region tab
                "tab": '<table class="layout-table tab">' +
                '<tbody>' +
                '<tr>' +
                '<td>' +
                '<div class="content-placeholder theme-gray">' +
                '<img onerror="imgError()" class="setting" src="../../image/setting.png" alt="" />' +
                '<div class="title">' +
                '<img onerror="imgError()" class="title-image" src="../../image/content-default.png" alt="" />' +
                '<span class="title-span">标题</span>' +
                '<div class="title-func">' +
                '<a href="javascript:void(0)" class="refresh" title="刷新"><img onerror="imgError()" src="../../image/refresh.png" alt="" /><span>刷新</span></a>' +
                //'<a class="add" href="javascript:void(0)"><img onerror="imgError()" src="../../image/add.gif" title="添加" alt="添加" /></a>' +
                '</div>' +
                '<div class="title-pager"></div>' +
                '</div>' +
                '<div class="content">' +
                '<dl class="tab">' +
                '<dt class="tab-pages">' +
                '<a class="tab-page sel" hidefocus href="javascript:void(0)">标签1</a>' +
                '<a class="tab-page" hidefocus href="javascript:void(0)">标签2</a>' +
                '<a class="tab-page" hidefocus href="javascript:void(0)">标签3</a>' +
                '<a class="add" href="javascript:void(0)"><img onerror="imgError()" src="../../image/add.gif" title="添加" alt="添加" /></a>' +
                '</dt>' +
                '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' +
                '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' +
                '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>' +
                '</dl>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-3col
                "complex-3col": '<table class="layout-table hor complex-3col">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-a
                "complex-a": '<table class="layout-table ver complex-a">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-b
                "complex-b": '<table class="layout-table ver complex-b">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-c
                "complex-c": '<table class="layout-table hor complex-c">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-d
                "complex-d": '<table class="layout-table hor complex-d">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-e
                "complex-e": '<table class="layout-table hor complex-e">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-f
                "complex-f": '<table class="layout-table hor complex-f">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-g
                "complex-g": '<table class="layout-table hor complex-g">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-h
                "complex-h": '<table class="layout-table hor complex-h">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-i
                "complex-i": '<table class="layout-table ver complex-i">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-j
                "complex-j": '<table class="layout-table ver complex-j">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-k
                "complex-k": '<table class="layout-table hor complex-k">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-l
                "complex-l": '<table class="layout-table hor complex-l">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-m
                "complex-m": '<table class="layout-table ver complex-m">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-n
                "complex-n": '<table class="layout-table hor complex-n">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-o
                "complex-o": '<table class="layout-table hor complex-o">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-p
                "complex-p": '<table class="layout-table ver complex-p">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-q
                "complex-q": '<table class="layout-table ver complex-q">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-r
                "complex-r": '<table class="layout-table ver complex-r">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-s
                "complex-s": '<table class="layout-table ver complex-s">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>',
                //#endregion
                //#region complex-t
                "complex-t": '<table class="layout-table ver complex-t">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table ver">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="ver"><div class="empty-content"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td splitter="ver">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor" style="width: 33%;"><div class="empty-content"></div></td>' +
                '<td splitter="hor">' +
                '<table class="layout-table hor">' +
                '<tbody>' +
                '<tr>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '<td splitter="hor"><div class="empty-content"></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>'
                //#endregion
            };
        }

        // 获得指定名称的布局元素
        public static GetLayout( name: string ): Layout
        {
            var html: string = LayoutDefineList.GetInstance().LayoutList[name];
            return html ? new Layout( $( html ), name ) : null;
        }
    }

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
    class LoadingBox
    {
        public Big: JQuery;
        public Small: JQuery;

        private static _instance: LoadingBox = null;

        constructor()
        {
            this.Big = $( ".design-element > .big-loading-box" );
            this.Small = $( ".design-element > .loading-box" );
        }

        static GetInstance(): LoadingBox
        {
            if ( LoadingBox._instance === null )
                LoadingBox._instance = new LoadingBox();

            return LoadingBox._instance;
        }

        // 创建大尺寸加载框
        public static CreateBigLoading( text: string, img?: string ): JQuery
        {
            var c = LoadingBox.GetInstance().Big.clone();

            c.find( "span" ).text( text );

            if ( img && img.length )
            {
                c.find( "img" ).attr( "src", img );
            }

            return c;
        }

        // 创建小尺寸加载框
        public static CreateSmallLoading(): JQuery
        {
            return LoadingBox.GetInstance().Small.clone();
        }
    }

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
    class ResizeCover
    {
        private Left: JQuery;
        private Right: JQuery;

        private LeftValueText1: JQuery;
        private LeftValueText2: JQuery;
        private LeftUnitText1: JQuery;
        private LeftUnitText2: JQuery;

        private LeftPixelText: JQuery;
        private LeftPercentText: JQuery;

        private RightValueText1: JQuery;
        private RightValueText2: JQuery;
        private RightUnitText1: JQuery;
        private RightUnitText2: JQuery;

        private RightPixelText: JQuery;
        private RightPercentText: JQuery;

        private static _instance: ResizeCover = null;

        constructor()
        {
            this.Left = $( ".resize-cover.cover-left" );
            this.Right = $( ".resize-cover.cover-right" );

            this.LeftValueText1 = this.Left.find( ".size-value" );
            this.LeftValueText2 = this.Left.find( ".other-size-value" );
            this.LeftUnitText1 = this.Left.find( ".size-unit" );
            this.LeftUnitText2 = this.Left.find( ".other-size-unit" );

            this.RightValueText1 = this.Right.find( ".size-value" );
            this.RightValueText2 = this.Right.find( ".other-size-value" );
            this.RightUnitText1 = this.Right.find( ".size-unit" );
            this.RightUnitText2 = this.Right.find( ".other-size-unit" );
        }

        // 开始创建调整的尺寸提示
        public static Create( o: IResizeCoverCreateOption, leftUnit: LayoutSizeUnit, rightUnit: LayoutSizeUnit ): void
        {
            if ( ResizeCover._instance === null )
                ResizeCover._instance = new ResizeCover();

            var c: ResizeCover = ResizeCover._instance;

            c.Left.css( o ).show();
            c.Right.css( o ).show();

            if ( leftUnit === LayoutSizeUnit.Percent )
            {
                c.LeftPercentText = c.LeftValueText1;
                c.LeftPixelText = c.LeftValueText2;

                c.LeftUnitText1.text( "%" );
                c.LeftUnitText2.text( "px" );
            } else
            {
                c.LeftPercentText = c.LeftValueText2;
                c.LeftPixelText = c.LeftValueText1;

                c.LeftUnitText1.text( "px" );
                c.LeftUnitText2.text( "%" );
            }

            if ( rightUnit === LayoutSizeUnit.Percent )
            {
                c.RightPercentText = c.RightValueText1;
                c.RightPixelText = c.RightValueText2;

                c.RightUnitText1.text( "%" );
                c.RightUnitText2.text( "px" );
            } else
            {
                c.RightPercentText = c.RightValueText2;
                c.RightPixelText = c.RightValueText1;

                c.RightUnitText1.text( "px" );
                c.RightUnitText2.text( "%" );
            }
        }

        // 调整尺寸过程
        public static Covering( left: IResizeCoveringOption, right: IResizeCoveringOption ): void
        {
            var c: ResizeCover = ResizeCover._instance;

            if ( c )
            {
                c.Left.css( left.option );
                c.LeftPercentText.text( left.percent );
                c.LeftPixelText.text( left.option.width.toString() );

                c.Right.css( right.option );
                c.RightPercentText.text( <any>( 100 - left.percent ) );
                c.RightPixelText.text( right.option.width.toString() );
            }
        }

        // 停止提示
        public static Stop(): void
        {
            if ( ResizeCover._instance )
            {
                ResizeCover._instance.Left.hide();
                ResizeCover._instance.Right.hide();
            }
        }
    }

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
    class SplitterContainer     // 分割条容器
    {
        private container: JQuery;
        private splitterElement: JQuery;    // 分割条元件
        private static _instance: SplitterContainer = null;

        constructor()
        {
            this.container = $( ".layout-splitter-box" );
            this.splitterElement = $( ".design-element .layout-splitter" );

            this.container.on( "click", ".layout-splitter > .buttons > li.first", function ()
            {
                var me: JQuery = $( this );
                var split: JQuery = me.closest( ".layout-splitter" );
                var attach: JQuery = split.data( "attach" );

                if ( attach && attach.length )
                    LayoutSetting.Attach( split.hasClass( "hor" ) ? attach : attach.children() );

                return false;
            }).on( "click", ".layout-splitter > .buttons > li.second", function ()
                {
                    var me: JQuery = $( this );
                    var split: JQuery = me.closest( ".layout-splitter" );
                    var attach: JQuery = split.data( "attach" );

                    if ( attach && attach.length )
                    {
                        var second: JQuery = split.hasClass( "hor" ) ? attach.next() : attach.next().children();
                        LayoutSetting.Attach( second );
                    }

                    return false;
                }).on( "click", ".layout-splitter > .buttons > li.third", function ()
                {
                    var me: JQuery = $( this );
                    var split: JQuery = me.closest( ".layout-splitter" );
                    var attach: JQuery = split.data( "attach" );

                    if ( attach && attach.length )
                    {
                        LayoutSetting.Attach( attach.closest( ".layout-table" ).parent() );
                    }

                    return false;
                }).on( "click", ".layout-splitter > .buttons > li.fourth", function ()
                {
                    LayoutSetting.ReSet();

                    var me: JQuery = $( this );
                    var split: JQuery = me.closest( ".layout-splitter" );
                    var attach: JQuery = split.data( "attach" );

                    if ( attach && attach.length )
                    {
                        SplitterContainer.DeleteAll( "" );

                        var second: JQuery = attach.next();
                        var ac: JQuery = attach.children().clone();
                        var se: JQuery = second.children().clone();

                        attach.empty().append( se );
                        second.empty().append( ac );

                        var allElement: JQuery = attach.add( second );

                        allElement.find( ".content-placeholder[contenttype]" ).each( function ( i, e )
                        {
                            ContentBlock.ActiveDroppable( ContentBlock.ParseContentBlock( $( this ) ) );
                            return me;
                        });

                        var ec: JQuery = allElement.find( ".empty-content" );

                        if ( ec.length )
                            Layout.ActiveDroppable( ec );
                    }

                    return false;
                });
        }

        // 为布局创建分割条
        public CreateSplitter( attach: JQuery, direct: string ): JQuery
        {
            var split: JQuery = this.splitterElement.clone( true, true );
            split.addClass( direct );
            split.data( "attach", attach ).appendTo( this.container );
            attach.data( "splitter", split );

            if ( direct === "hor" )
            {
                var btns: JQuery = split.children( ".buttons" );

                split.draggable( {  // 使分割条支持横向拖动
                    axis: "x",
                    opacity: 0.5,
                    containment: [0, 0, 0, 0],
                    start: function ()
                    {
                        DesignCanvas.HiddenElement();
                        DesignView.Resizable = false;

                        LayoutSetting.ReSet();

                        var o: any = splitterOptions["default"];

                        // 拖动开始时将分割条暂移动到画板的左上角
                        split.siblings().position( { of: DesignCanvas.Canvas, offset: o.offset, my: o.my, at: o.at });

                        btns.addClass( "buttons-dragging" );    // 拖动时隐藏分割条中的按钮

                        this["parentWidth"] = Math.floor( attach.parent().width() );
                        var h: number = split.height(), n: JQuery = attach.next();
                        var leftUnit: number = Number( attach.attr( "sizeunit" ) );
                        var rightUnit: number = Number( n.attr( "sizeunit" ) );

                        leftUnit = isNaN( leftUnit ) ? LayoutSizeUnit.Percent : leftUnit;
                        rightUnit = isNaN( rightUnit ) ? LayoutSizeUnit.Percent : rightUnit;

                        var condition: boolean = ( rightUnit === LayoutSizeUnit.Pixel );

                        this["settingLayout"] = condition ? n : attach;
                        this["settingLayoutSizeCondition"] = condition;
                        this["settingLayoutSizeUnit"] = condition ? rightUnit : leftUnit;

                        ResizeCover.Create( { top: split.position().top, height: h - 2, lineHeight: h + "px" }, leftUnit, rightUnit );
                    },
                    drag: function ( event, o )
                    {
                        var pos: any = attach.position();
                        var offset: any = <IPosition>attach.offset();
                        var pixSize: number = Math.floor( o.position.left - pos.left - 5 ); // 实际像素宽度尺寸
                        var w: number = Math.floor( this["parentWidth"] );
                        var nw: number = w - pixSize;
                        var percentSize: number = this["percentSize"] = Math.floor( pixSize / w * 100 );  // 对应百分比宽度尺寸

                        this["pixelSize"] = this["settingLayoutSizeCondition"] ? nw : pixSize;
                        this["settingLayout"].width( this["pixelSize"] );

                        ResizeCover.Covering(   // 显示尺寸信息
                            { option: { left: offset.left + 5, width: pixSize - 12 }, percent: percentSize },
                            { option: { left: offset.left + pixSize + 5, width: w - pixSize - 12 }, percent: 100 - percentSize }
                            );
                    },
                    stop: function ()
                    {
                        ResizeCover.Stop();

                        if ( this["settingLayoutSizeUnit"] === LayoutSizeUnit.Pixel )
                        {
                            this["settingLayout"].width( this["pixelSize"] );
                        }
                        else
                        {
                            this["settingLayout"].width( this["percentSize"] + "%" );
                        }

                        DesignView.Resizable = true;
                        DesignCanvas.DoResizeInterval();

                        btns.removeClass( "buttons-dragging" );
                    }
                });
            }

            return split;
        }

        // 创建分割条
        public static CreateSplitter( attach: JQuery, direct: string ): JQuery
        {
            if ( SplitterContainer._instance === null )
                SplitterContainer._instance = new SplitterContainer();

            return SplitterContainer._instance.CreateSplitter( attach, direct );
        }

        // 隐藏所有分割条
        public static HideAll(): void
        {
            if ( SplitterContainer._instance === null )
                SplitterContainer._instance = new SplitterContainer();

            SplitterContainer._instance.container.find( ".layout-splitter" ).hide();
        }

        // 删除所有风格条，它将在需要的时候再次被创建
        public static DeleteAll( currentDirect: string ): void
        {
            if ( SplitterContainer._instance === null )
                SplitterContainer._instance = new SplitterContainer();

            SplitterContainer._instance.container.empty();
            $( ".design-canvas td,.design-canvas tr" ).data( "splitter", null );

            if ( currentDirect === "ver" )
                $( ".layout-table,.layout-table .empty-content,.content-placeholder" ).css( { "height": "auto", "min-height": "100px" });
        }
    }

    // 分割器位置选项的默认值
    var splitterOptions: Object = {
        "hor": {    // 横向分割条
            offset: "-5 5",
            my: "left top",
            at: "right top"
        },
        "ver": {    // 纵向分割条
            offset: "5 -5",
            my: "left top",
            at: "left bottom"
        },
        "default": {    // 默认
            offset: "0 0",
            my: "left top",
            at: "left top"
        }
    };

    export enum DroppableType
    {
        None = 0,
        Layout = 1,
        ContentBlock = 2,
        ContentBlockGroup = 3
    }

    /**
     * @class: Layout
     * @description: 表示布局基础类
     * @remark:
     *      布局是一个容器，支持拖放的目标到布局中；接受的对象可以是另外一个布局，或者一个内容块。
    */
    export class Layout
    {
        public Layout: JQuery;
        public Name: string;

        constructor( layout: JQuery, name: string = "" )
        {
            this.Layout = layout;
            this.Name = name;
        }

        // 激活布局，使其支持拖放
        public ActiveLayout(): Layout
        {
            TabGlobalBinder.FireSelection( this.Layout );

            if ( this.Name === "tab" )  // 若当前布局为标签页
            {
                this.Layout.find( "> tbody > tr > td > .content-placeholder > .content > dl.tab > dt.tab-pages" ).sortable( {    // 使其支持标签页位置调整
                    axis: "x",
                    dropOnEmpty: false,
                    items: ".tab-page",
                    opacity: 0.5,
                    tolerance: "pointer",
                    start: function ( e, ui )
                    {
                        ui.helper.trigger( "click" );
                        this.srcIndex = ui.helper.index();
                    },
                    update: function ( e, ui )
                    {
                        var descIndex: number = ui.item.index();
                        var panels: any = ui.item.closest( ".tab" ).find( ".tab-panel" );

                        panels.eq( this.srcIndex )[this.srcIndex < descIndex ? "insertAfter" : "insertBefore"]( panels.eq( descIndex ) );
                    }
                });

                // 标签布局的结构与内容块的结构相近，使其支持拖放其他内容块到标签布局之上，以便插入其他内容块到其四周的位置
                //ContentBlock.ActiveDroppable( ContentBlock.ParseContentBlock( this.Layout.find( ".content-placeholder" ) ) );
            }

            Layout.ActiveDroppable( this.Layout.find( ".empty-content" ) );
            this.Layout.data( "actived", true );    // 标记为已激活

            return this;
        }

        // 使布局支持拖放
        public static ActiveDroppable( e: JQuery ): JQuery
        {
            return e.droppable( {       // 投放布局
                accept: ".design-panel-control .design-control-layout-element li,.design-panel-control .design-control-layout-contents li, .design-control-layout-content-group li",
                activeClass: "drop-active",
                hoverClass: "drop-hover",
                addClasses: false,
                greedy: true,
                activate: function ( event, ui ) { },   // 开始
                deactivate: function ( event, ui ) { $( ".drop-active,.drop-hover" ).removeClass( "drop-active drop-hover" ); },    // 取消
                over: function ( event, ui ) { },  // 经过
                out: function ( event, ui ) { },  // 移出
                drop: function ( event, ui )  // 投放
                {
                    var me: JQuery = $( this );
                    var p: JQuery = me.parent();

                    switch ( <DroppableType> Number( ui.helper.attr( "droptype" ) ) )
                    {
                        case DroppableType.Layout:       // 投放布局

                            var layoutName: string = ui.helper.attr( "layout" );
                            var parentLayout: JQuery = p.closest( ".layout-table" );

                            if ( !parentLayout.length )     // 如果是最顶部的画板布局
                                p.removeClass( "init-size" );   // 则自动调整高度

                            if ( layoutName )
                            {
                                var layout: Layout = LayoutDefineList.GetLayout( layoutName );

                                if ( layout )
                                {
                                    me.replaceWith( layout.Layout );

                                    // todo: undo/redo

                                    layout.ActiveLayout();

                                    layout.Layout.find( ".layout-table" ).each( function ( i, elem )
                                    {
                                        var me: JQuery = $( this );

                                        new Layout( me, "" ).ActiveLayout();

                                        return me;
                                    });
                                }
                            }

                            break;
                        case DroppableType.ContentBlock:      // 投放内容块

                            var cb: ContentBlock = new ContentBlock( ui.helper );

                            if ( cb && cb.Content )
                            {
                                ContentBlock.ActiveDroppable( cb );
                                me.replaceWith( cb.Content );

                                TabPanelSetting.Apply();

                                // todo: undo/redo
                                DesignCanvas.DoResizeInterval();
                            }

                            break;
                        case DroppableType.ContentBlockGroup:      // 投放内容块组

                            // todo: undo/redo

                            DesignCanvas.HtmlInitialize( me.parent(), ContentBlockGroupArea.GetGroupData( ui.helper.attr( "key" ) ).html );

                            break;
                    }
                }
            });

        }

        // 删除指定布局（需提供该布局所在的父元素）
        public static Delete( layoutParent: JQuery ): boolean
        {
            DesignView.Resizable = false;
            DesignCanvas.HiddenElement();

            if ( layoutParent !== null && layoutParent.length > 0 )
            {
                if ( layoutParent.hasClass( "layout-top" ) )
                {
                    var empty = $( DesignCanvas.EmptyContent );

                    SplitterContainer.DeleteAll( "" );
                    layoutParent.empty().append( empty );

                    Layout.ActiveDroppable( empty );
                }
                else
                {
                    var direct: string = layoutParent.attr( "splitter" );  // 取得布局方向

                    if ( direct )
                    {
                        var sibling: JQuery = ( direct === "hor" ) ? layoutParent.siblings() : layoutParent.closest( "tr" ).siblings();

                        if ( sibling.length > 0 )
                        {
                            // 取得兄弟布局的内容
                            var siblingContent: JQuery = ( direct === "hor" ) ? sibling.children() : sibling.children( "td" ).children();

                            // 取得当前布局所在的父布局
                            var layout: JQuery = layoutParent.closest( ".layout-table" );

                            // 删除分割条 (如果有，它将在需要的时候再次被创建)
                            SplitterContainer.DeleteAll( direct );

                            // 立即执行一次所有布局调整
                            DesignCanvas.DoResizeInterval();

                            var isInTab: boolean = layout.closest( "table.layout-table.tab" ).length > 0;

                            if ( layout.siblings().length ) // 若仍然有同级元素
                            {
                                layout.remove();
                            } else      // 替换父布局为当前布局的兄弟内容
                            {
                                layout.replaceWith( siblingContent );
                            }

                            //todo: undo/redo...

                            if ( isInTab )
                            {
                                TabPanelSetting.Apply();
                            }
                        }
                    }
                }
            }

            DesignView.Resizable = true;
            return false;
        }
    }

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
    export class ContentBlock
    {
        // 内容块外框
        private static _wrap_format: string =
        '<div class="content-placeholder theme-gray" remark="{3}">' +
        '<img onerror="imgError()" class="setting" src="../../image/setting.png" alt="高级配置" title="高级配置" />' +
        '<div class="title">' +
        '<img onerror="imgError()" class="title-image" src="{0}" alt="折叠/展示内容块" title="折叠/展示内容块" />' +
        '<span class="title-span" title="{1} - 双击此处编辑标题">{1}</span>' +
        '<div class="title-func">' +
        '{2}' +
        //'<a class="add" href="javascript:void(0)"><img onerror="imgError()" src="../../image/add.gif" title="添加" alt="添加" /></a>' +
        '</div>' +
        '<div class="title-pager"></div>' +
        '</div>' +
        '<div class="content content-loading">' +
        '<div class="loading-box"><img onerror="imgError()" class="loading" src="../../image/loading.gif" alt="" /></div>' +
        '</div>' +
        '</div>';

        private static _default_content_image: string = "../../image/content-default.png";
        private static _default_content_title: string = "尚无标题";

        private static _resource_format: RegExp = /(\<style.*?\>[\s\S]*?\<\/style\>)|(\<link.*?\>)|(\<script.*?\>[\s\S]*?\<\/script\>)/ig;   // 资源正则表达式
        private static _outline_script_format: RegExp = /\<script.*?src\s*\=\s*['"]+(.*?)['"]+.*?\>[\s\S]*?\<\/script\>/i;
        private static _inline_script_format: RegExp = /\<script.*?\>([\s\S]*?)\<\/script\>/i;
        private static _outline_style_format: RegExp = /\<link.*?href\s*\=\s*['"]+(.*?)['"]+.*?\>/i;
        private static _inline_style_format: RegExp = /\<style.*?\>([\s\S]*?)\<\/style\>/i;

        private static _outline_style_tag: string = '<link rel="stylesheet" href="{0}" />';
        private static _func_link_tag: string = '<a dataurl="{1}" url="{1}" href="javascript:void(0)" onclick="javascript:openWindow(this.url, {2}, {3});return false;" rel="{0}" opensize="{2}, {3}" class="{4}"><img onerror="imgError()" src="{5}" class="{7}" title="{6}" alt="{6}" /><span>{6}</span></a>';

        public static ResourceIndex: number = 0;
        private static _style_format: string = '<style type="text/css">{0}</style>';

        // 表示整个内容块的 JQuery 对象
        public Content: JQuery;
        public Template: ContentBlockTemplate = null;

        constructor( public context: JQuery, callbackFunc?: () => any )
        {
            if ( context )
            {
                var templateIndex: number = Number( context.attr( "template" ) );

                if ( !isNaN( templateIndex ) )
                    this.Template = ContentBlockTemplateList.GetTemplate( templateIndex );

                this.Content = $( this.PrevProcessing( ContentBlock._wrap_format ) ).attr( "contentType", this.Template.contentType );

                this.LoadContent( callbackFunc );
            }
        }

        // 使指定的对象被创建为 ContentBlock 对象
        public static ParseContentBlock( content: JQuery ): ContentBlock
        {
            var c: ContentBlock = new ContentBlock( null );

            c.Content = content;
            c.context = null;

            return c;
        }

        // 使内容块支持拖放
        public static ActiveDroppable( cb: ContentBlock )
        {
            cb.Content.droppable( {
                accept: ".design-panel-control .design-control-layout-contents li",
                addClasses: false,
                greedy: true,
                tolerance: "pointer",
                create: function ( event, ui ) { }, // 创建
                activate: function ( event, ui ) { },   // 开始
                deactivate: function ( event, ui ) { },    // 取消
                over: function ( event, ui )  // 经过
                {
                    ContentPlaceholderDraggingIndicator.Anchor( cb.Content );
                },
                out: function ( event, ui )  // 移出
                {
                    ContentPlaceholderDraggingIndicator.Anchor( null );
                },
                drop: function ( event, ui )  // 投放
                {
                    var direct: DraggingIndicatorDirect = ContentPlaceholderDraggingIndicator.GetDirect();

                    if ( direct !== DraggingIndicatorDirect.Unknown )
                    {
                        var isHor: boolean = ( direct === DraggingIndicatorDirect.Left || direct === DraggingIndicatorDirect.Right );

                        //var isLeftUp: boolean = ( direct === DraggingIndicatorDirect.Left || direct === DraggingIndicatorDirect.Up );

                        //var layout: Layout = LayoutDefineList.GetLayout( isHor ? "hor" : "ver" );

                        //var firstSelector: string = ( isHor ? "> tbody > tr > td:first > .empty-content" : "> tbody > tr:first > td > .empty-content" );
                        //var secondSelector: string = ( isHor ? "> tbody > tr > td:last > .empty-content" : "> tbody > tr:last > td > .empty-content" );

                        //var clone: JQuery = cb.Content.clone();
                        var dropBlock: ContentBlock = new ContentBlock( ui.draggable );

                        //var first: JQuery = isLeftUp ? dropBlock.Content : clone;
                        //var second: JQuery = isLeftUp ? clone : dropBlock.Content;

                        //layout.Layout.find( firstSelector ).replaceWith( first );
                        //layout.Layout.find( secondSelector ).replaceWith( second );

                        //cb.Content.replaceWith( layout.Layout );

                        //ContentBlock.ActiveDroppable( ContentBlock.ParseContentBlock( clone ) );
                        //ContentBlock.ActiveDroppable( dropBlock );

                        //layout.ActiveLayout();

                        if ( isHor )
                        {
                            var isLeftUp: boolean = ( direct === DraggingIndicatorDirect.Left || direct === DraggingIndicatorDirect.Up );
                            var layout: Layout = LayoutDefineList.GetLayout( "hor" );

                            var firstSelector: string = "> tbody > tr > td:first > .empty-content";
                            var secondSelector: string = "> tbody > tr > td:last > .empty-content";

                            var clone: JQuery = cb.Content.clone();

                            var first: JQuery = isLeftUp ? dropBlock.Content : clone;
                            var second: JQuery = isLeftUp ? clone : dropBlock.Content;

                            layout.Layout.find( firstSelector ).replaceWith( first );
                            layout.Layout.find( secondSelector ).replaceWith( second );

                            cb.Content.replaceWith( layout.Layout );

                            ContentBlock.ActiveDroppable( ContentBlock.ParseContentBlock( clone ) );

                            layout.ActiveLayout();
                        } else
                        {
                            //cb.Content.closest( "td" ).off( "resize" );

                            if ( direct === DraggingIndicatorDirect.Up )    // 添加到当前内容块的上（前）面
                            {
                                cb.Content.before( dropBlock.Content );
                            }
                            else    // 添加到当前内容块的下（后）面
                            {
                                cb.Content.after( dropBlock.Content );
                            }

                            DesignCanvas.DoResizeInterval();
                        }

                        ContentBlock.ActiveDroppable( dropBlock );

                        // todo: undo/redo...
                    }

                    TabPanelSetting.Apply();
                    ContentPlaceholderDraggingIndicator.Reset();
                }

            });
        }

        // 执行预处理（标题及标题图标等处理）
        private PrevProcessing( format: string ): string
        {
            var result: string = format;

            if ( this.Template )
            {
                var o: IContentDataFormat = this.Template.option;
                var moreUrl: string = $.trim( o.moreurl );

                result = result.replace( /\{0\}/g, o.ico ? o.ico : ContentBlock._default_content_image )
                    .replace( /\{1\}/g, o.title ? o.title : ContentBlock._default_content_title )
                    .replace( /\{3\}/g, o.remark )
                    .replace( /\{2\}/g,
                    this.LoadOptions() +
                    ( this.Template.contentType !== 2 ? '<a href="javascript:void(0)" class="refresh" title="刷新"><img onerror="imgError()" src="../../image/refresh.png" alt="" /><span>刷新</span></a>' : "" ) +
                    (
                    moreUrl ? (
                    ContentBlock._func_link_tag
                        .replace( /\{0\}/g, moreUrl )
                        .replace( /\{1\}/g, DesignCanvas.GetMoreUrl( moreUrl ) )
                        .replace( /\{2\}/g, "0" )
                        .replace( /\{3\}/g, "0" )
                        .replace( /\{4\}/g, "more-link" )
                        .replace( /\{5\}/g, "../../image/more.png" )
                        .replace( /\{7\}/g, "" )
                        .replace( /\{6\}/g, "更多" )
                    )
                    : ""
                    )
                    );
            }

            return result;
        }

        // 加载完成
        private LoadComplete( content: any, addClass: string = "" )
        {
            this.Content.removeClass( "load-fail" );

            var contentBox: JQuery = this.Content.children( ".content" );
            var c: JQuery = contentBox.empty().removeClass( "content-loading" ).append( content );

            contentBox.find( ".tab > .tab-pages > .tab-page:first" ).trigger( "click" );

            if ( addClass !== "" )
            {
                c.addClass( addClass );
            }

            if ( this.Content.siblings().length === 0 && this.Content.height() < 150 )
            {
                this.Content.parent( "td" ).height( () => "auto" );
            }
        }

        // 加载内容块的内容失败
        private LoadFail( result: any )
        {
            this.Content.addClass( "load-fail" );

            this.LoadComplete( '<img onerror="imgError()" src="../../image/warning.png" alt="" style="vertical-align: middle" /> 内容未能成功加载 ...' );
            this.Content.children( ".content" ).addClass( "load-fail-bg" );
        }

        // 格式化资源字符串
        private FormatResourceString( res: string ): string
        {
            return res.replace( /\r\n/g, "" ).replace( '\\"', '"' );
        }

        // 加载资源（样式、脚本等），返回后期加载的资源
        private LoadResource( res: string, resourceLoader: string ): string[]
        {
            res = this.FormatResourceString( res );

            var afterRes: string[] = [];

            if ( res )
            {
                var m: string[] = res.match( ContentBlock._resource_format );

                if ( m )
                {
                    var outlineScript: string[] = [];
                    var outlineStyle: string[] = [];
                    var inlineStyle: string[] = [];

                    // 得到所有资源
                    for ( var i: number = 0; i < m.length; i++ )
                    {
                        var s: string = m[i];

                        if ( ContentBlock._outline_script_format.test( s ) )
                            outlineScript.push( s );

                        if ( ContentBlock._inline_script_format.test( s ) )
                            afterRes.push( s );

                        if ( ContentBlock._outline_style_format.test( s ) )
                            outlineStyle.push( s );

                        if ( ContentBlock._inline_style_format.test( s ) )
                            inlineStyle.push( s );
                    }

                    // 加载内联样式
                    for ( var j in inlineStyle )
                    {
                        if ( inlineStyle.hasOwnProperty( j ) )
                        {
                            DesignView.Header.append( inlineStyle[j] );
                        }
                    }

                    //var style_format: string = '<style type="text/css">{0}</style>';

                    // 加载外部样式
                    for ( var k in outlineStyle )
                    {
                        if ( outlineStyle.hasOwnProperty( k ) )
                        {
                            this.Content.queue( resourceLoader, () =>
                            {
                                //var link: JQuery = $( ContentBlock._outline_style_tag.replace(
                                //                                /\{0\}/,
                                //                                outlineStyle[i].match( ContentBlock._outline_style_format )[1]
                                //                        ) );

                                //link.on( "load", () => { this.Content.dequeue( resourceLoader ); } ).appendTo( DesignView.Header );
                                //return jQuery.get( url, undefined, callback, "script" );
                                $.get( outlineStyle[k].match( ContentBlock._outline_style_format )[1], undefined, ( data ) =>
                                {
                                    $( ContentBlock._style_format.replace( /\{0\}/, data ) ).on( "load", () => this.Content.dequeue( resourceLoader ) ).appendTo( DesignView.Header );
                                }, "text" );
                            });
                        }
                    }

                    // 加载外部脚本
                    for ( var l in outlineScript )
                    {
                        if ( outlineScript.hasOwnProperty( l ) )
                        {
                            this.Content.queue( resourceLoader, () =>
                            {
                                $.getScript( outlineScript[l].match( ContentBlock._outline_script_format )[1], () => this.Content.dequeue( resourceLoader ) );
                            });
                        }
                    }
                }
            }

            return afterRes;
        }

        // 预加载资源（样式、脚本等）
        private PrevLoadResource( resource: string[], resourceLoader: string ): string[]
        {
            var afterRes: string[] = [];

            if ( resource && resource.length )
            {
                for ( var i in resource )
                {
                    if ( resource.hasOwnProperty( i ) )
                    {
                        afterRes = afterRes.concat( this.LoadResource( resource[i], resourceLoader ) );
                    }
                }
            }

            return afterRes;
        }

        // 后期加载的资源
        private AfterLoadResource( resourceLoader: string, res: string[] )
        {
            for ( var i in res )
            {
                if ( res.hasOwnProperty( i ) )
                {
                    var code: string = res[i].match( ContentBlock._inline_script_format )[1].replace( /GetCurrentContentBlock\s*\(\s*\)/g, '$("div.content-placeholder[resourceindex=' + resourceLoader + ']").data("reference")' );
                    $.globalEval( "try { " + code + " } catch (_error_message) {  } " );
                }
            }
        }

        // 加载操作项
        private LoadOptions(): string
        {
            var result: string = "";
            var o = this.Template.option.opts;

            for ( var i in o )
            {
                if ( o.hasOwnProperty( i ) )
                {
                    var item = o[i];
                    var ico = $.trim( item.ico );

                    result += ContentBlock._func_link_tag
                        .replace( /\{0\}/g, item.url )
                        .replace( /\{1\}/g, DesignCanvas.GetMoreUrl( item.url ) )
                        .replace( /\{2\}/g, item.width.toString() )
                        .replace( /\{3\}/g, item.height.toString() )
                        .replace( /\{4\}/g, "" )
                        .replace( /\{5\}/g, ico ? "" : ico )
                        .replace( /\{7\}/g, ico ? "" : "hide" )
                        .replace( /\{6\}/g, item.title );
                }
            }

            return result;
        }

        // pageIndex - 当前页码, recordTotal - 总记录数
        private UpdatePager( c: JQuery, pageIndex: number, pageSize: number, recordTotal: number )
        {
            if ( !isNaN( pageIndex ) )
            {
                var pager: JQuery = c.find( ".title-pager" );

                if ( pager.length )
                {
                    pager.empty();

                    var p = new Pager( pageIndex, pageSize, recordTotal );
                    var result: string = "";
                    var format: string = '<a href="javascript: void(0)" rel="{1}"{2}>{0}</a>';

                    if ( p.recordCount )
                    {
                        result += format.replace( "{0}", '<img onerror="imgError()" src="../../image/first-page.png" alt="上一页" title="上一页" />' ).replace( "{1}", p.prevPage.toString() ).replace( "{2}", ' class="first-page' + ( p.pageIndex === p.prevPage ? " sel" : "" ) + '"' );

                        var interval = p.GetPageCodeInterval( 3 );

                        for ( var i = interval.start; i <= interval.end; i++ )
                        {
                            result += format.replace( "{0}", i.toString() ).replace( "{1}", i.toString() ).replace( "{2}", i === p.pageIndex ? ' class="sel"' : "" );
                        }

                        result += format.replace( "{0}", '<img onerror="imgError()" src="../../image/last-page.png" alt="下一页" title="下一页" />' ).replace( "{1}", p.nextPage.toString() ).replace( "{2}", ' class="last-page' + ( p.pageIndex === p.nextPage ? " sel" : "" ) + '"' );
                    }

                    pager.append( result );
                }
            }
        }

        // 重新加载
        public ReLoad( callbackFunc?: () => any ): void
        {
            this.LoadContent( callbackFunc );
        }

        // 获得内容块ID
        public GetId(): string
        {
            return this.Content.attr( "resourceindex" );
        }

        // 通过ID获得指定内容块
        public static GetById( id: string ): ContentBlock
        {
            return $( "div.content-placeholder[resourceindex=" + id + "]" ).data( "reference" );
        }

        // 设置请求参数
        public SetRequestParameter( parameterName: string, value: string )
        {
            var content: JQuery = this.Content.children( ".content" );
            var url: string = content.attr( "href" );

            if ( url )
            {
                var urls: string[] = url.split( '?' );
                var path = urls[0];

                var query = urls[1] || "";

                if ( query )
                {
                    if ( new RegExp( parameterName + "\s*=" ).test( query ) )
                    {
                        query.replace( new RegExp( parameterName + "\s*=.*?(?:&|$)" ), parameterName + "=" + value );
                    } else
                    {
                        query += "&" + parameterName + "=" + value;
                    }
                } else
                {
                    query = parameterName + "=" + value;
                }

                content.attr( "href", path + "?" + query );
            }
        }

        // 开始加载当前拖放的内容块的内容
        public LoadContent( callbackFunc?: () => any ): void
        {
            try
            {
                var my: ContentBlock = this;
                var o: IContentDataFormat = null;
                var url: string = "";
                var contentPart: JQuery = this.Content.children( ".content" );
                var contentType: ContentType = null;
                var isList: number = Number.NaN;
                var isHead: number = Number.NaN;
                var minWidth: number = Number.NaN;

                if ( this.Template )
                {
                    o = this.Template.option;
                    url = o.url;

                    contentPart.attr( "href", url ).attr( "originalHref", url );
                    contentType = this.Template.contentType;

                    my.Content.attr( "islist", isList = Number( this.Template.option.list ) );
                    my.Content.attr( "ishead", isHead = Number( this.Template.option.head ) );
                    my.Content.attr( "minwidth", minWidth = Number( this.Template.option.minwidth ) );
                } else
                {
                    url = contentPart.attr( "href" );
                    contentType = Number( this.Content.attr( "contenttype" ) );

                    isList = Number( my.Content.attr( "islist" ) );
                    isHead = Number( my.Content.attr( "ishead" ) );
                    minWidth = Number( my.Content.attr( "minwidth" ) );
                }

                if ( !( isList === 1 ) )
                {
                    my.Content.find( ".title-pager" ).remove();
                }

                switch ( contentType )
                {
                    case ContentType.Normal:
                        if ( !url )
                        {
                            my.LoadFail( "" );
                            return;
                        }

                        var pageSize: number = Number( contentPart.attr( "pagesize" ) );
                        pageSize = ( isNaN( pageSize ) ? 8 : pageSize );

                        var pageIndex: number = Number( contentPart.attr( "pageIndex" ) );
                        pageIndex = ( isNaN( pageIndex ) ? 1 : pageIndex );

                        $.when( $.ajax( {
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
                        }) ).done( function ( result: IAsyncResult )
                            {
                                if ( result && result.Success && result.Success.toLowerCase() === 'y' )
                                {
                                    var resourceLoader: string = my.Content.attr( "resourceindex" );

                                    if ( !resourceLoader )
                                    {
                                        resourceLoader = "ResourceLoader" + String( ContentBlock.ResourceIndex++ );
                                        my.Content.attr( "resourceindex", resourceLoader ).data( "reference", my );
                                    }

                                    var afterRes: string[] = my.PrevLoadResource( result.Others, resourceLoader );  // 预加载

                                    my.Content.queue( resourceLoader, function ()
                                    {
                                        my.LoadComplete( result.Data );     // Load 内容
                                        my.Content.dequeue( resourceLoader );
                                    }).queue( resourceLoader, function ()
                                        {
                                            my.AfterLoadResource( resourceLoader, afterRes );   // Load 加载内容后才加载的资源（内联脚本）
                                            my.Content.dequeue( resourceLoader );
                                        }).queue( resourceLoader, function ()  // 更新页码
                                        {
                                            if ( isList === 1 )
                                                my.UpdatePager( my.Content, Number( result.Others[1] ), pageSize, Number( result.Others[0] ) );

                                            my.Content.dequeue( resourceLoader );
                                        }).queue( resourceLoader, function ()
                                        {
                                            // 设置内容块的内容最小高度
                                            if ( isList === 1 )
                                                contentPart.css( "min-height", ( ( pageSize + ( contentPart.find( "> .table > thead" ).length > 0 ? 1 : 0 ) ) * 30 + "px" ) );

                                            if ( my.Content.attr( "contentscrolling" ) === "true" )
                                            {
                                                ContentScrolling.ApplyContentScrolling( my.Content );
                                            }

                                            my.Content.dequeue( resourceLoader );
                                        }).queue( resourceLoader, function ()
                                        {
                                            if ( callbackFunc && $.isFunction( callbackFunc ) )
                                            {
                                                callbackFunc();
                                            }

                                            my.Content.dequeue( resourceLoader );
                                        }).dequeue( resourceLoader );
                                } else
                                {
                                    my.LoadFail( result );
                                }
                            }).fail( function ( result: any )
                            {
                                my.LoadFail( result );
                            });

                        return;
                    case ContentType.FramePage:
                        this.LoadComplete( '<iframe class="iframe-page" src="about:blank" frameborder="0"></iframe>' );
                        return;
                    case ContentType.CustomContent:
                        this.LoadComplete( "", "custom-content-block" );
                        return;
                    case ContentType.ImageContent:
                        this.LoadComplete( "", "image-content-block" );
                        return;
                }

                my.LoadFail( "" );
            } catch ( msg )
            {
            }
        }
    }

    class TabPanelSetting
    {
        public static Apply()
        {
            var allHolders: JQuery = $( ".content-placeholder" );

            allHolders.removeClass( "specify-content-placeholder" );
            allHolders.find( "> .content .tab > .tab-panel > :only-child.content-placeholder" ).addClass( "specify-content-placeholder" );
        }
    }

    /*
     * @class: Pager
     * @description: 表示分页类
    */
    class Pager
    {
        public prevPage: number = 0;
        public nextPage: number = 0;
        public pageCount: number = 0;

        constructor( public pageIndex: number, public pageSize: number, public recordCount: number )
        {
            this.pageIndex = isNaN( this.pageIndex ) || ( this.pageIndex < 1 ) ? 1 : this.pageIndex;
            this.pageSize = isNaN( this.pageSize ) || ( this.pageSize < 1 ) ? 1 : this.pageSize;
            this.recordCount = isNaN( this.recordCount ) || ( this.recordCount < 0 ) ? 0 : this.recordCount;

            this.Comput();
        }

        private Comput()
        {
            if ( this.recordCount === 0 )
            {
                this.pageCount = this.pageIndex = this.prevPage = this.nextPage = 1;
                return;
            }

            this.pageCount = Math.ceil( this.recordCount / this.pageSize );
            this.pageCount = this.pageCount < 1 ? 1 : this.pageCount;
            this.pageIndex = ( this.pageIndex > this.pageCount ) ? this.pageCount : this.pageIndex;
            this.prevPage = ( this.pageIndex <= 1 ) ? 1 : this.pageIndex - 1;
            this.nextPage = ( this.pageIndex >= this.pageCount ) ? this.pageCount : this.pageIndex + 1;
        }

        private GetMidValue( size: number ): number
        {
            return ( size % 2 !== 0 ) ? ( ( size + 1 ) / 2 ) : ( size / 2 );
        }

        private GetStartCode( size: number, midValue: number ): number
        {
            return ( ( this.pageIndex + midValue ) > this.pageCount ) ?
                ( this.pageIndex - ( size - ( this.pageCount - this.pageIndex + 1 ) ) ) :
                ( this.pageIndex - ( midValue - 1 ) );
        }

        private GetEndCode( size: number, midValue: number ): number
        {
            var end: number = ( this.pageIndex < midValue ) ? size : ( this.pageIndex + midValue - 1 );
            return ( end > this.pageCount ) ? this.pageCount : end;
        }

        public GetPageCodeInterval( size: number ): { start: number; end: number; }
        {
            size = size > 1 ? size : 1;
            var result = { start: 1, end: 1 };

            if ( size <= 1 )
            {
                result.start = this.pageIndex;
                result.end = this.pageIndex;
            } else
            {
                var midValue: number = this.GetMidValue( size );

                result.start = this.GetStartCode( size, midValue );
                result.end = this.GetEndCode( size, midValue );
            }

            result.start = result.start < 1 ? 1 : result.start;
            result.end = result.end < 1 ? 1 : result.end;

            return result;
        }
    }

    /**
     * @class: QuickSettingMenu
     * @description: 配置的快捷菜单
    */
    class SettingShortcutMenu
    {
        private shortcutMenu: JQuery = null;

        private static _instance: SettingShortcutMenu = null;

        public TargetContent: JQuery = null;

        constructor()
        {
            this.shortcutMenu = $( ".setting-shortcut-menu" );

            this.shortcutMenu.on( "blur", () =>
            {
                this.TargetContent = null;
                this.shortcutMenu.hide();

                return false;
            }).on( "mouseenter", () =>
                {
                    this.shortcutMenu.off( "blur" );
                }).on( "mouseleave", () =>
                {
                    this.shortcutMenu.on( "blur", () =>
                    {
                        this.TargetContent = null;
                        this.shortcutMenu.hide();

                        return false;
                    });
                });

            var contentTitle: JQuery = this.shortcutMenu.find( ".setting-toggle-title" );

            contentTitle.on( "click", () =>
            {
                var title: JQuery = this.TargetContent.children( ".title" );
                var toggle: boolean = ( title.css( "display" ) === "none" );

                if ( this.TargetContent !== null )
                {
                    if ( toggle )
                    {
                        contentTitle.text( "隐藏标题栏" );
                        title.show();
                        this.TargetContent.addClass( "theme-gray" );
                    }
                    else
                    {
                        contentTitle.text( "显示标题栏" );
                        title.hide();
                        this.TargetContent.removeClass( "theme-blue theme-gray" );
                    }

                    this.shortcutMenu.hide();
                }
            });

            this.shortcutMenu.find( ".setting-background-blue" ).on( "click", () =>
            {
                if ( this.TargetContent !== null )
                {
                    this.TargetContent.removeAttr( "style" ).removeClass( "theme-gray theme-tran" ).addClass( "theme-blue" ).children( ".title" ).show();
                    this.TargetContent.find( ".title,.title *,.bottom,.bottom *" ).removeAttr( "style" );
                    this.shortcutMenu.hide();
                }
            });

            this.shortcutMenu.find( ".setting-background-gray" ).on( "click", () =>
            {
                if ( this.TargetContent !== null )
                {
                    this.TargetContent.removeAttr( "style" ).removeClass( "theme-blue theme-tran" ).addClass( "theme-gray" ).children( ".title" ).show();
                    this.TargetContent.find( ".title,.title *,.bottom,.bottom *" ).removeAttr( "style" );
                    this.shortcutMenu.hide();
                }
            });

            this.shortcutMenu.find( ".setting-background-none" ).on( "click", () =>
            {
                if ( this.TargetContent !== null )
                {
                    this.TargetContent.removeAttr( "style" ).removeClass( "theme-blue theme-gray" ).addClass( "theme-tran" );
                    this.TargetContent.find( ".title,.title *,.bottom,.bottom *" ).removeAttr( "style" );
                    this.shortcutMenu.hide();
                }
            });

            var pageSettingBox: JQuery = $( ".page-setting-box" );
            var pageSettingWidth: number = pageSettingBox.width();
            var win: JQuery = $( window );

            win.on( "resize scroll", () =>
            {
                if ( pageSettingBox.css( "display" ) !== "none" )
                {
                    pageSettingBox.stop().animate( {
                        left: ( win.width() - pageSettingWidth ) / 2,
                        top: win.scrollTop() + ( win.height() - pageSettingBox.height() ) / 2
                    }, 300, "swing" );
                }
            });

            var pagerSettingBoxSlider: JQuery = pageSettingBox.find( ".pager-setting-box-slider" );
            var quickSettingBoxSlider: JQuery = pageSettingBox.find( ".quick-setting-box-slider" );
            var autoRefreshSettingBoxSlider: JQuery = pageSettingBox.find( ".auto-refresh-setting-box-slider" );
            var contentScrollingBoxSlider: JQuery = pageSettingBox.find( ".content-scrolling-box-slider" );
            var defaultShowSettingBoxSlider: JQuery = pageSettingBox.find( ".default-show-setting-box-slider" );
            var heightSettingBoxSlider: JQuery = pageSettingBox.find( ".height-setting-box-slider" );

            pageSettingBox.find( ".setting-dialog-btns-cancel" ).on( "click", function ()
            {
                heightSettingBoxSlider.hide();
                pagerSettingBoxSlider.hide();
                quickSettingBoxSlider.hide();
                autoRefreshSettingBoxSlider.hide();
                contentScrollingBoxSlider.hide();
                defaultShowSettingBoxSlider.hide();
                pageSettingBox.hide();
            });

            var my = this;

            pageSettingBox.find( ".is-show-title-icon" ).on( "click", function ()   // 是否显示标题图标
            {
                if ( my.TargetContent !== null )
                {
                    if ( $( this ).attr( "checked" ) === "checked" )
                    {
                        my.TargetContent.find( "> .title > .title-image" ).show();
                    } else
                    {
                        my.TargetContent.find( "> .title > .title-image" ).hide();
                    }
                }
            });

            pageSettingBox.find( ".is-show-pager" ).on( "click", function ()
            {
                if ( my.TargetContent !== null )
                {
                    if ( $( this ).attr( "checked" ) === "checked" )    // 显示分页
                    {
                        my.TargetContent.find( ".title-pager" ).show();
                        pageSettingBox.find( ".is-use-content-scrolling" ).attr( { "checked": false, "disabled": "disabled" });
                    } else      // 关闭分页
                    {
                        my.TargetContent.find( ".title-pager" ).hide();
                        pageSettingBox.find( ".is-use-content-scrolling" ).attr( { "disabled": false });
                    }
                }
            });

            pageSettingBox.find( ".is-use-auto-refresh" ).on( "click", function ()   // 是否启用自动刷新
            {
                if ( my.TargetContent !== null )
                {
                    var ckd: boolean = ( $( this ).attr( "checked" ) === "checked" );
                    my.TargetContent.attr( "autorefresh", ckd.toString() );

                    if ( ckd )
                    {
                        var val: number = Number( my.TargetContent.attr( "refreshinterval" ) );

                        if ( isNaN( val ) )
                        {
                            val = 60;

                            my.TargetContent.attr( "refreshinterval", "60" );
                            pageSettingBox.find( ".auto-refresh-interval" ).val( "60" );
                        }

                        AutoRefresher.ApplyAutoRefresh( my.TargetContent, val );
                    } else
                    {
                        AutoRefresher.CancelAutoRefresh( my.TargetContent );
                    }
                }
            });

            pageSettingBox.find( ".is-use-content-scrolling" ).on( "click", function ()   // 是否内容滚动
            {
                if ( my.TargetContent !== null )
                {
                    var ckd: boolean = ( $( this ).attr( "checked" ) === "checked" );
                    var sp: JQuery = pageSettingBox.find( ".is-show-pager" );

                    my.TargetContent.attr( "contentscrolling", ckd.toString() );

                    if ( ckd )
                    {
                        sp.attr( { "checked": false, "disabled": "disabled" });
                        my.TargetContent.find( ".title-pager" ).hide();

                        ContentScrolling.ApplyContentScrolling( my.TargetContent );
                    } else
                    {
                        sp.attr( { "disabled": false });

                        ContentScrolling.CancelContentScrolling( my.TargetContent );
                    }
                }
            });

            pageSettingBox.find( ".is-show-quick-btns" ).on( "click", function ()
            {
                if ( my.TargetContent !== null )
                {
                    if ( $( this ).attr( "checked" ) === "checked" )
                    {
                        my.TargetContent.find( ".title-func" ).show();
                    } else
                    {
                        my.TargetContent.find( ".title-func" ).hide();
                    }
                }
            });

            pageSettingBox.find( ".auto-refresh-interval" ).on( "blur", function ()
            {
                if ( my.TargetContent !== null )
                {
                    var me: JQuery = $( this );
                    var v: string = $.trim( me.val() );
                    var interval: number = Number( v );

                    interval = ( isNaN( interval ) || interval < 60 ) ? 60 : interval;
                    me.val( interval.toString() );
                    my.TargetContent.attr( "refreshinterval", interval.toString() );

                    if ( pageSettingBox.find( ".is-use-auto-refresh" ).attr( "checked" ) === "checked" )
                    {
                        AutoRefresher.ApplyAutoRefresh( my.TargetContent, interval );
                    }
                }
            }).on( "focus", function ()
                {
                    $( this ).select();
                });

            pageSettingBox.find( ".page-size" ).on( "blur", function ()
            {
                if ( my.TargetContent !== null && my.TargetContent.attr( "contenttype" ) === "0" )
                {
                    var me: JQuery = $( this );
                    var v: string = $.trim( me.val() );
                    var size: number = Number( v );
                    size = ( isNaN( size ) || size < 1 ) ? 8 : size;

                    me.val( size.toString() );

                    var targetContent: JQuery = my.TargetContent.children( ".content" );
                    var targetSize: number = Number( targetContent.attr( "pagesize" ) );
                    targetSize = ( isNaN( targetSize ) || targetSize < 1 ? 8 : targetSize );

                    if ( size !== targetSize )
                    {
                        targetContent.attr( "pagesize", size );
                        ContentBlock.ParseContentBlock( my.TargetContent ).LoadContent();
                    }
                }
            }).on( "focus", function ()
                {
                    $( this ).select();
                });

            pageSettingBox.find( ".page-index" ).on( "blur", function ()
            {
                if ( my.TargetContent !== null && my.TargetContent.attr( "contenttype" ) === "0" )
                {
                    var me: JQuery = $( this );
                    var v: string = $.trim( me.val() );
                    var size: number = Number( v );
                    size = ( isNaN( size ) || size < 1 ) ? 1 : size;

                    me.val( size.toString() );

                    var targetContent: JQuery = my.TargetContent.children( ".content" );
                    var targetSize: number = Number( targetContent.attr( "pageindex" ) );
                    targetSize = ( isNaN( targetSize ) || targetSize < 1 ? 8 : targetSize );

                    if ( size !== targetSize )
                    {
                        targetContent.attr( "pageindex", size );
                        ContentBlock.ParseContentBlock( my.TargetContent ).LoadContent();
                    }
                }
            }).on( "focus", function ()
                {
                    $( this ).select();
                });

            pageSettingBox.find( ".system-btn-refresh-link" ).on( "click", function ()
            {
                if ( my.TargetContent !== null && my.TargetContent.attr( "contenttype" ) !== "2" )
                {
                    if ( $( this ).attr( "checked" ) === "checked" )
                    {
                        my.TargetContent.find( ".title-func > .refresh" ).show();
                    } else
                    {
                        my.TargetContent.find( ".title-func > .refresh" ).hide();
                    }
                }
            });

            pageSettingBox.find( ".system-btn-help-link" ).on( "click", function ()
            {
                if ( my.TargetContent !== null )
                {
                    var help: JQuery = my.TargetContent.find( ".title-func > .help" );

                    if ( $( this ).attr( "checked" ) === "checked" )
                    {
                        my.TargetContent.find( ".title-func" ).append( '<a href="javascript: void(0)" class="help"><img onerror="imgError()" src="../../image/cb-help.png" alt="帮助" /><span>帮助</span></a>' );
                    } else
                    {
                        help.remove();
                    }
                }
            });

            pageSettingBox.find( ".system-btn-more-link" ).on( "click", function ()
            {
                if ( my.TargetContent !== null && my.TargetContent.attr( "contenttype" ) === "0" )
                {
                    if ( $( this ).attr( "checked" ) === "checked" )
                    {
                        my.TargetContent.find( ".title-func > .more-link" ).show();
                    } else
                    {
                        my.TargetContent.find( ".title-func > .more-link" ).hide();
                    }
                }
            });

            pageSettingBox.find( ".pager-on-position-top" ).on( "click", function ()
            {
                var title: JQuery = my.TargetContent.find( "> .title" );
                var title_pager: JQuery = title.find( "> .title-pager" );
                var bottom: JQuery = my.TargetContent.find( "> .bottom" );
                var holder_pager: JQuery = bottom.find( "> .title-pager" );

                if ( !title_pager.length && holder_pager.length )
                {
                    holder_pager.appendTo( title );
                }

                if ( bottom.children().length === 0 )
                {
                    bottom.remove();
                }
            });

            pageSettingBox.find( ".pager-on-position-bottom" ).on( "click", function ()
            {
                var title: JQuery = my.TargetContent.find( "> .title" );
                var title_pager: JQuery = title.find( "> .title-pager" );
                var bottom: JQuery = my.TargetContent.find( "> .bottom" );

                if ( !bottom || !bottom.length )
                {
                    bottom = $( '<div class="bottom"></div>' );
                    bottom.appendTo( my.TargetContent );
                }

                var holder_pager: JQuery = bottom.find( "> .title-pager" );

                if ( !holder_pager.length && title_pager.length )
                {
                    title_pager.appendTo( bottom );
                }
            });

            pageSettingBox.find( ".quick-on-position-top" ).on( "click", function ()
            {
                var title: JQuery = my.TargetContent.find( "> .title" );
                var title_func: JQuery = title.find( "> .title-func" );
                var bottom: JQuery = my.TargetContent.find( "> .bottom" );
                var holder_func: JQuery = bottom.find( "> .title-func" );

                if ( !title_func.length && holder_func.length )
                {
                    holder_func.appendTo( title );
                }

                if ( bottom.children().length === 0 )
                {
                    bottom.remove();
                }
            });

            pageSettingBox.find( ".quick-on-position-bottom" ).on( "click", function ()
            {
                var title: JQuery = my.TargetContent.find( "> .title" );
                var title_func: JQuery = title.find( "> .title-func" );
                var bottom: JQuery = my.TargetContent.find( "> .bottom" );

                if ( !bottom || !bottom.length )
                {
                    bottom = $( '<div class="bottom"></div>' );
                    bottom.appendTo( my.TargetContent );
                }

                var holder_func: JQuery = bottom.find( "> .title-func" );

                if ( !holder_func.length && title_func.length )
                {
                    title_func.appendTo( bottom );
                }
            });

            pageSettingBox.find( ".height-setting-box-slider .content-height" ).on( "blur", function ()
            {
                if ( my.TargetContent !== null && Number( my.TargetContent.attr( "islist" ) ) !== 1 )
                {
                    var me: JQuery = $( this );
                    var v: string = $.trim( me.val() );
                    var size: number = Number( v );

                    if ( !isNaN( size ) && size > 29 )
                    {
                        my.TargetContent.css( "cssText", "height: " + size + "px !important" );
                    } else
                    {
                        me.val( String( my.TargetContent.height() ) );
                    }
                }
            }).on( "focus", function ()
                {
                    $( this ).select();
                });

            this.shortcutMenu.find( ".setting-color-scheme" ).on( "click", () =>
            {
                ColorScheme.Show( my.TargetContent );

                this.shortcutMenu.hide();
            });

            this.shortcutMenu.find( ".setting-background-pageSetting" ).on( "click", () =>
            {
                $( ".setting-dialog" ).hide();

                heightSettingBoxSlider.hide();
                pagerSettingBoxSlider.hide();
                quickSettingBoxSlider.hide();
                autoRefreshSettingBoxSlider.hide();
                contentScrollingBoxSlider.hide();
                defaultShowSettingBoxSlider.hide();

                if ( this.TargetContent !== null )
                {
                    if ( Number( this.TargetContent.attr( "islist" ) ) !== 1 )
                    {
                        heightSettingBoxSlider.show();

                        pageSettingBox.find( ".height-setting-box-slider .content-height" ).val( String( this.TargetContent.height() ) );
                    }

                    var ct: string = my.TargetContent.attr( "contenttype" );

                    pageSettingBox.find( ".is-show-title-icon" ).attr( "checked", ( this.TargetContent.find( "> .title > .title-image:visible" ).length > 0 ).toString() );

                    if ( ct === "0" )
                    {
                        autoRefreshSettingBoxSlider.show();
                        contentScrollingBoxSlider.show();

                        pageSettingBox.find( ".is-use-content-scrolling" ).removeAttr( "checked" ).removeAttr( "disabled" );
                        pageSettingBox.find( ".is-show-pager" ).removeAttr( "disabled" );

                        // 分页 -----------------
                        var pager: JQuery = this.TargetContent.find( ".title-pager" );

                        if ( pager && pager.length )
                        {
                            pagerSettingBoxSlider.show();

                            var isPagerShowing: boolean = pager.css( "display" ) !== "none";

                            pageSettingBox.find( ".is-show-pager" ).attr( "checked", isPagerShowing.toString() ).parent().show();
                            pageSettingBox.find( ".pager-on-position-box" ).show();

                            if ( this.TargetContent.find( "> .title > .title-pager" ).length )
                            {
                                pageSettingBox.find( ".pager-on-position-top" ).attr( "checked", "checked" );
                            }

                            if ( this.TargetContent.find( "> .bottom > .title-pager" ).length )
                            {
                                pageSettingBox.find( ".pager-on-position-bottom" ).attr( "checked", "checked" );
                            }

                            if ( isPagerShowing )
                            {
                                this.TargetContent.attr( "contentscrolling", "false" );
                                pageSettingBox.find( ".is-use-content-scrolling" ).attr( { "checked": false, "disabled": true });
                            } else
                            {
                                pageSettingBox.find( ".is-use-content-scrolling" ).removeAttr( "disabled" );
                            }
                        } else
                        {
                            pageSettingBox.find( ".is-show-pager" ).removeAttr( "checked" ).parent().hide();
                            pageSettingBox.find( ".pager-on-position-box" ).hide();
                        }

                        var targetContent: JQuery = this.TargetContent.find( ".content" );

                        var pageSize: number = Number( targetContent.attr( "pagesize" ) );
                        pageSettingBox.find( ".page-size" ).val( String( isNaN( pageSize ) || pageSize === 0 ? 8 : pageSize ) );

                        var pageIndex: number = Number( targetContent.attr( "pageindex" ) );
                        pageSettingBox.find( ".page-index" ).val( String( isNaN( pageIndex ) || pageSize === 0 ? 1 : pageIndex ) );

                        // 是否滚动内容 -----------------
                        if ( this.TargetContent.attr( "contentscrolling" ) === "true" )
                        {
                            pageSettingBox.find( ".is-use-content-scrolling" ).attr( "checked", "checked" );
                            pageSettingBox.find( ".is-show-pager" ).attr( { "checked": false, "disabled": true });
                            this.TargetContent.find( ".title-pager" ).hide();
                        }

                        // 是否自动刷新 -----------------
                        var ri: number = Number( this.TargetContent.attr( "refreshinterval" ) );
                        ri = isNaN( ri ) ? 60 : ri;

                        pageSettingBox.find( ".auto-refresh-interval" ).val( ri.toString() );

                        pageSettingBox.find( ".is-use-auto-refresh" ).attr( "checked", ( this.TargetContent.attr( "autorefresh" ) === "true" ).toString() );
                    }

                    if ( ct === "1" )
                    {
                        pageSettingBox.find( ".system-btn-more-link-box" ).hide();
                    } else
                    {
                        pageSettingBox.find( ".system-btn-more-link-box" ).show();
                    }

                    // 快捷按钮 -----------------
                    if ( ct !== "2" )
                    {
                        var quickBtn: JQuery = this.TargetContent.find( ".title-func" );

                        if ( quickBtn && quickBtn.length )
                        {
                            pageSettingBox.find( ".is-show-quick-btns" ).attr( "checked", ( quickBtn.css( "display" ) !== "none" ).toString() ).parent().show();
                            quickSettingBoxSlider.show();
                        } else
                        {
                            pageSettingBox.find( ".is-show-quick-btns" ).removeAttr( "checked" ).parent().hide();
                            quickSettingBoxSlider.hide();
                        }

                        if ( this.TargetContent.find( "> .title > .title-func" ).length )
                        {
                            pageSettingBox.find( ".quick-on-position-top" ).attr( "checked", "checked" );
                        } else
                        {
                            pageSettingBox.find( ".quick-on-position-top" ).removeAttr( "checked" );
                        }

                        if ( this.TargetContent.find( "> .bottom > .title-func" ).length )
                        {
                            pageSettingBox.find( ".quick-on-position-bottom" ).attr( "checked", "checked" );
                        } else
                        {
                            pageSettingBox.find( ".quick-on-position-bottom" ).removeAttr( "checked" );
                        }

                        var moreLink: JQuery = this.TargetContent.find( ".title-func > .more-link" );

                        if ( moreLink && moreLink.length )
                        {
                            pageSettingBox.find( ".system-btn-more-link" ).attr( "checked", ( moreLink.css( "display" ) !== "none" ).toString() ).parent().show();
                        } else
                        {
                            pageSettingBox.find( ".system-btn-more-link" ).removeAttr( "checked" ).parent().hide();
                        }

                        var refreshLink: JQuery = this.TargetContent.find( ".title-func > .refresh" );

                        if ( refreshLink && refreshLink.length )
                        {
                            pageSettingBox.find( ".system-btn-refresh-link" ).attr( "checked", ( refreshLink.css( "display" ) !== "none" ).toString() ).parent().show();
                        } else
                        {
                            pageSettingBox.find( ".system-btn-refresh-link" ).removeAttr( "checked" ).parent().hide();
                        }

                        var helpLink: JQuery = this.TargetContent.find( ".title-func > .help" );

                        if ( helpLink && helpLink.length )
                        {
                            pageSettingBox.find( ".system-btn-help-link" ).attr( "checked", "checked" );
                        } else
                        {
                            pageSettingBox.find( ".system-btn-help-link" ).removeAttr( "checked" );
                        }
                    } else
                    {
                        defaultShowSettingBoxSlider.show();
                    }

                    // 显示高级配置框 -----------------
                    pageSettingBox.css( {
                        left: ( win.width() - pageSettingWidth ) / 2,
                        top: ( win.height() + win.scrollTop() - pageSettingBox.height() - 50 ) / 2
                    }).show();

                    win.trigger( "resize" );

                    this.shortcutMenu.hide();
                } else
                {
                    pageSettingBox.hide();
                }
            });

            this.shortcutMenu.find( ".setting-delete-contentblock" ).on( "click", () =>
            {
                if ( this.TargetContent !== null )
                {
                    if ( this.TargetContent.siblings().length )
                    {
                        var isTab: boolean = this.TargetContent.closest( "table.layout-table.tab" ).length > 0;
                        this.TargetContent.remove();

                        if ( isTab )
                        {
                            TabPanelSetting.Apply();
                        }
                    }
                    else
                    {
                        var empty: JQuery = $( DesignCanvas.EmptyContent );

                        // 若删除的内容块是 标签页布局
                        var layoutTab: JQuery = this.TargetContent.parent( "td" ).parent( "tr" ).parent( "tbody" ).parent( "table.layout-table.tab" );

                        if ( layoutTab.length )
                        {
                            layoutTab.replaceWith( empty );
                            SplitterContainer.DeleteAll( "ver" );
                        }
                        else
                        {
                            this.TargetContent.replaceWith( empty );
                        }

                        Layout.ActiveDroppable( empty );
                    }

                    this.shortcutMenu.hide();
                    DesignCanvas.Canvas.trigger( "resize" );
                    DesignCanvas.DoResizeInterval();
                }
            });

        }

        private static GetInstance(): SettingShortcutMenu
        {
            if ( SettingShortcutMenu._instance === null )
                SettingShortcutMenu._instance = new SettingShortcutMenu();

            return SettingShortcutMenu._instance;
        }

        public Anchor( target: JQuery, setting: JQuery )
        {
            var o: IPosition = <IPosition>setting.offset();

            o.top += 24;
            o.left -= 129;

            this.shortcutMenu.css( o )
                .find( ".setting-toggle-title" )
                .text( ( target.children( ".title" ).css( "display" ) === "none" ) ? "显示标题栏" : "隐藏标题栏" );

            this.shortcutMenu.slideDown( 100 ).focus();

            this.TargetContent = target;
        }

        public static Anchor( target: JQuery, setting: JQuery )
        {
            SettingShortcutMenu.GetInstance().Anchor( target, setting );
        }
    }

    /**
     * 内容块组框
     */
    class ContentGroupBox
    {
        private static box: JQuery = null;
        private static html: string = "";

        private static GetBox()
        {
            if ( ContentGroupBox.box === null )
            {
                var box: JQuery = ContentGroupBox.box = $( ".content-group-name-box" );
                var win: JQuery = $( window );
                var name: JQuery = box.find( ".input" );

                win.on( "resize scroll", () =>
                {
                    if ( box.css( "display" ) !== "none" )
                    {
                        box.show().stop().animate( {
                            left: ( win.width() - box.width() ) / 2,
                            top: ( win.height() - box.height() ) / 2 + win.scrollTop()
                        }, 300, "swing" );
                    }
                });

                box.find( ".btn-apply" ).on( "click", function ()
                {
                    var v: string = name.val();

                    v = $.trim( v );

                    if ( !v )
                    {
                        alert( "请输入内容块组的名称。" );
                        name.focus().select();
                    } else
                    {
                        ContentBlockGroupArea.CreateGroup( v, ContentGroupBox.html );
                        box.hide();
                    }
                });

                box.find( ".btn-cancel" ).on( "click", function ()
                {
                    box.hide();
                });
            }

            return ContentGroupBox.box;
        }

        public static Show( html: string ): void
        {
            html = $.trim( html );
            var box: JQuery = ContentGroupBox.GetBox();
            var win: JQuery = $( window );

            if ( html )
            {
                ContentGroupBox.html = html;

                box.show().stop().animate( {
                    left: ( win.width() - box.width() ) / 2,
                    top: ( win.height() - box.height() ) / 2 + win.scrollTop()
                }, 300, "swing" );

                box.find( ".input" ).focus().val( "" );
            }
        }
    }

    /** 布局配置框 */
    class LayoutSetting
    {
        private cover: JQuery = null;
        private box: JQuery = null;
        private target: JQuery = null;

        private btnDel: JQuery = null;
        private btnSaveAsGroup: JQuery = null;
        private btnWidthSetting: JQuery = null;
        private btnClose: JQuery = null;

        private static _instance: LayoutSetting = null;

        constructor()
        {
            this.cover = $( ".layout-setting-cover" );
            this.box = $( ".layout-setting-buttons-box" );

            this.btnDel = this.box.find( ".setting-btn-delete-layout" );
            this.btnClose = this.box.find( ".setting-btn-close" );
            this.btnSaveAsGroup = this.box.find( ".setting-btn-save-as-group" );
            this.btnWidthSetting = this.box.find( ".setting-btn-pixed" );

            this.btnClose.on( "click", () => this.ReSet() );

            this.btnDel.on( "click", () =>
            {
                if ( this.target && this.target.length )
                {
                    // todo: redo/undo
                    Layout.Delete( this.target );
                    this.ReSet();
                }
            });

            this.btnWidthSetting.on( "click", () =>
            {
                if ( this.target && this.target.length )
                {
                    this.target.trigger( "dblclick" );
                    this.ReSet();
                }
            });

            this.btnSaveAsGroup.on( "click", () =>
            {
                if ( this.target && this.target.length )
                {
                    ContentGroupBox.Show( DesignPanel.CanvasStatic.GetFinalOutputHTML( this.target ) );
                    this.ReSet();
                }
            });
        }

        public ReSet(): void
        {
            this.target = null;

            if ( this.cover )
                this.cover.hide();

            if ( this.box )
                this.box.hide();
        }

        public Attach( target: JQuery ): void
        {
            if ( target && target.length )
            {
                this.target = target;
                var size = { width: target.width() - 12, height: target.height() - 12 };

                this.cover.css( size ).show().position( { of: target, offset: "5 5", my: "left top", at: "left top" });
                this.box.css( size ).show().position( { of: target, offset: "5 5", my: "left top", at: "left top" });

                if ( target.find( ".content-placeholder" ).length > 1 )
                {
                    this.btnSaveAsGroup.show();
                } else
                {
                    this.btnSaveAsGroup.hide();
                }

                if ( target.closest( ".layout-table" ).hasClass( "hor" ) )
                {
                    this.btnWidthSetting.val( Number( target.attr( "sizeunit" ) ) === 1 ? "设置为百分比宽度" : "设置为固定像素宽度" ).show();
                } else
                {
                    this.btnWidthSetting.hide();
                }
            }
        }

        public static ReSet(): void
        {
            LayoutSetting.GetInstance().ReSet();
        }

        public static GetInstance(): LayoutSetting
        {
            if ( LayoutSetting._instance === null )
            {
                LayoutSetting._instance = new LayoutSetting();
            }

            return LayoutSetting._instance;
        }

        public static Attach( target: JQuery ): void
        {
            LayoutSetting.GetInstance().Attach( target );
        }
    }

    class MinWidthInfoBox
    {
        public Box: JQuery = null;
        public Text: JQuery = null;

        public timer: number = Number.NaN;

        constructor()
        {
            this.Box = $( ".min-width-info-box" );
            this.Box.find( ".prompt-cover" ).css( "opacity", 0.3 );
            this.Text = this.Box.find( ".prompt-text > span" );
        }

        public Anchor( target: JQuery ): void
        {
            var minWidth: number = Number( target.attr( "minwidth" ) );
            var pos: IPosition = target.position();
            var size: ISize = { width: target.width(), height: target.height() };
            this.Box.hide();

            if ( !isNaN( this.timer ) )
            {
                window.clearTimeout( this.timer );
            }

            this.Text.text( ( !isNaN( minWidth ) && minWidth !== 0 ) ? ( minWidth + "px" ) : "(未配置)" );

            this.timer = window.setTimeout( () => this.Box.hide(), 3000 );

            this.Box.css( { left: pos.left + ( size.width / 2 - 58 ), top: pos.top + ( size.height / 2 + 36 ) }).show();
        }

        private static mb: MinWidthInfoBox = null;

        public static GetInstance(): MinWidthInfoBox
        {
            if ( MinWidthInfoBox.mb === null )
            {
                MinWidthInfoBox.mb = new MinWidthInfoBox();
            }

            return MinWidthInfoBox.mb;
        }

        public static Anchor( target: JQuery ): void
        {
            if ( target.hasClass( "content-placeholder" ) )
            {
                MinWidthInfoBox.GetInstance().Anchor( target );
            }
        }

        public static Hide()
        {
            var o: MinWidthInfoBox = MinWidthInfoBox.GetInstance();
            o.Box.hide();

            if ( !isNaN( o.timer ) )
            {
                window.clearTimeout( o.timer );
            }
        }
    }

    class CustomContentTextAreaBox
    {
        private static _instance: CustomContentTextAreaBox = null;
        private editor: any = null;
        private box: JQuery;
        private target: JQuery;

        constructor()
        {
            var box: JQuery = this.box = $( ".custom-content-text-area" );
            var win: JQuery = $( window );

            win.on( "resize scroll", () =>
            {
                if ( box.css( "display" ) !== "none" )
                {
                    box.stop().animate( {
                        left: ( win.width() - box.width() ) / 2,
                        top: ( win.height() - box.height() ) / 2 + win.scrollTop()
                    }, 300, "swing" );
                }
            });

            this.editor = this.box.find( ".text-area textarea" ).xheditor( {
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

            this.box.find( ".btn-cancel" ).on( "click", () => this.box.hide() );
            this.box.find( ".btn-clear" ).on( "click", () => this.editor.setSource( "" ) );
            this.box.find( ".btn-apply" ).on( "click", () =>
            {
                if ( this.target && this.target.length > 0 )
                {
                    this.target.html( this.editor.getSource() )

                    DesignCanvas.AutoBinding();
                }

                this.box.hide();
            });
        }

        private static GetInstance(): CustomContentTextAreaBox
        {
            if ( CustomContentTextAreaBox._instance === null )
            {
                CustomContentTextAreaBox._instance = new CustomContentTextAreaBox();
            }

            return CustomContentTextAreaBox._instance;
        }

        public Show( target: JQuery, html: string )
        {
            var win: JQuery = $( window );
            this.target = target;

            this.editor.setSource( html || "" );

            this.box.show().stop().animate( {
                left: ( win.width() - this.box.width() ) / 2,
                top: ( win.height() - this.box.height() ) / 2 + win.scrollTop() - 50
            }, 300, "swing" );

        }

        public static Show( target: JQuery, html: string )
        {
            CustomContentTextAreaBox.GetInstance().Show( target, html );
        }
    }

    /**
     * @class: CustomContentSetting
     * @description: 表示 [自定义内容的内容块] 配置界面的静态类
    */
    class CustomContentSetting
    {
        public Target: JQuery = null;
        public Setting: JQuery = null;
        public Showing: boolean = false;

        constructor()
        {
            this.Setting = $( ".custom-content-page" );

            this.Setting.on( "click", () =>
            {
                this.Setting.hide();
                this.Showing = true;

                CustomContentTextAreaBox.Show( this.Target, this.Target.html() );
            });

            this.Setting.on( "mouseenter", () =>
            {
                this.Setting.show();
                this.Showing = true;
            });

            this.Setting.on( "mouseout", () =>
            {
                this.Showing = false;
            });
        }

        private static _instance: CustomContentSetting = null;

        public static GetInstance()
        {
            if ( CustomContentSetting._instance === null )
            {
                CustomContentSetting._instance = new CustomContentSetting();
            }

            return CustomContentSetting._instance;
        }

        public Anchor( target: JQuery )
        {
            if ( target && target.length )
            {
                var offset: IPosition = <IPosition>target.offset();

                offset.left += 1;
                offset.top += 1;

                this.Setting.css( offset );
                this.Setting.width( target.width() - 4 );
                this.Target = target;

                this.Setting.show();
            }
        }

        public Reset()
        {
            if ( !this.Showing )
            {
                this.Setting.hide();
            }
        }

        public static Anchor( target: JQuery )
        {
            CustomContentSetting.GetInstance().Anchor( target );
        }

        public static Reset()
        {
            CustomContentSetting.GetInstance().Reset();
        }
    }

    /**
     * @class: FramePageSetting
     * @description: 表示 [框架页面内容块] 配置界面的静态类
    */
    class FramePageSetting
    {
        public Target: JQuery = null;
        public Setting: JQuery = null;
        public UrlBox: JQuery = null;
        public HeightBox: JQuery = null;
        public Showing: boolean = false;
        public Selecting: JQuery = null;

        constructor()
        {
            this.Setting = $( ".frame-page" );
            this.UrlBox = this.Setting.find( ".frame-address-url" );
            this.HeightBox = this.Setting.find( ".frame-height" );

            this.Setting.on( "mouseenter", () =>
            {
                this.Setting.show();
                this.Showing = true;
            });

            this.Setting.on( "mouseout", () =>
            {
                this.Showing = false;
            });

            this.UrlBox.on( "keyup", ( e ) =>
            {
                if ( e.keyCode === 13 && this.Target )
                {
                    // todo: redo/undo

                    this.Target.attr( "src", this.getUrl( $.trim( this.UrlBox.val() ) ) );
                    this.Setting.hide();
                }
            }).on( "focus", () =>
                {
                    this.UrlBox.select();
                    this.Selecting = this.UrlBox;
                });

            this.HeightBox.on( "keyup", ( e ) =>
            {
                if ( e.keyCode === 13 )
                {
                    if ( this.Target )
                    {
                        this.Target.css( "height", this.getHeight( $.trim( this.HeightBox.val() ) ) );
                    }
                }
            }).on( "focus", () =>
                {
                    this.HeightBox.select();
                    this.Selecting = this.HeightBox;
                });
        }

        private getHeight( height: string ): string
        {
            if ( height )
            {
                var h: number = Number( height );

                if ( isNaN( h ) )
                    return "150";

                return h.toString();
            } else
            {
                return "150";
            }
        }

        private getUrl( url: string ): string
        {
            return ( url ) ?
                ( ( new RegExp( "^([a-z]{2,6})\:\/\/.+", "i" ).test( url ) ) ? url : ( "http://" + url ) ) :
                "about:blank";
        }

        public Reset(): void
        {
            if ( !this.Showing )
            {
                this.Setting.hide();
            }
        }

        public Anchor( target: JQuery )
        {
            if ( target && target.length )
            {
                var offset: IPosition = <IPosition>target.offset();

                offset.left += 1;
                offset.top += 1;

                this.Setting.css( offset );
                this.Setting.width( target.width() - 2 );
                this.Target = target;

                var url: string = target.attr( "src" );

                if ( url )
                {
                    this.UrlBox.val( url === "about:blank" ? "http://" : url );
                }

                if ( this.Selecting )
                    this.Selecting.select();

                this.HeightBox.val( target.css( "height" ).replace( /px|\%/g, "" ) );
                this.Setting.show();
            }
        }

        private static _instance: FramePageSetting = null;

        public static GetInstance()
        {
            if ( FramePageSetting._instance === null )
            {
                FramePageSetting._instance = new FramePageSetting();
            }

            return FramePageSetting._instance;
        }

        public static Anchor( target: JQuery )
        {
            FramePageSetting.GetInstance().Anchor( target );
        }

        public static Reset()
        {
            FramePageSetting.GetInstance().Reset();
        }
    }

    /**
     * @class: RequestDataObject
     * @description: 获得请求参数的静态类
    */
    class RequestDataObject
    {
        private static _id: string = null;
        private static _portalType: number = Number.NaN;
        private static _portalId: string = null;

        // 获取请求参数: ID
        public static GetID(): string
        {
            if ( !RequestDataObject._id )
            {
                var m: string[] = document.location.search.match( /id\=(.*?)(?:&|$)/i );
                RequestDataObject._id = m ? m[1] : null;
            }

            return RequestDataObject._id;
        }

        // 获取请求参数: PortalType
        public static GetPortalType(): number
        {
            if ( isNaN( RequestDataObject._portalType ) )
            {
                var m: string[] = document.location.search.match( /portaltype\=(\d+?)(?:&|$)/i );
                RequestDataObject._portalType = m ? Number( m[1] ) : Number.NaN;
            }

            return RequestDataObject._portalType;
        }

        // 获取请求参数: PortalId
        public static GetPortalId(): string
        {
            if ( !RequestDataObject._portalId )
            {
                var m: string[] = document.location.search.match( /portal\=(.*?)(?:&|$)/i );
                RequestDataObject._portalId = m ? m[1] : null;
            }

            return RequestDataObject._portalId;
        }
    }

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
    class ContentPlaceholderDraggingIndicator
    {
        private block: JQuery;

        public DropPosition: IPosition;
        public DropSize: ISize;

        public DirectPosition: any[];

        public DraggingContentBlock: JQuery = null;   // 正在拖放的内容块
        public DroppingContentBlock: JQuery = null;   // 准备投放的内容块
        public Direct: DraggingIndicatorDirect = DraggingIndicatorDirect.Unknown;

        constructor()
        {
            this.block = $( ".content-placeholder-dragging-indicator" );
        }

        public Reset()
        {
            this.DraggingContentBlock = null;
            this.DroppingContentBlock = null;
            this.Direct = DraggingIndicatorDirect.Unknown;

            this.block.hide();
        }

        public Update( draggingPosition: IPosition )
        {
            // 计算位置
            if ( this.DraggingContentBlock && this.DraggingContentBlock.length && this.DroppingContentBlock && this.DroppingContentBlock.length )
            {
                // 得到拖动中的内容块当前位置与准备投放的内容块的 上下左右 各自分别的距离。
                var dropPos: IPosition = this.DropPosition;
                var dropSize: ISize = this.DropSize;

                var left: number = draggingPosition.left - dropPos.left + 10;
                var up: number = draggingPosition.top - dropPos.top + 10;
                var right: number = dropSize.width - left;
                var down: number = dropSize.height - up;

                var directSelector: Object = {};

                directSelector["ds" + left] = DraggingIndicatorDirect.Left;
                directSelector["ds" + up] = DraggingIndicatorDirect.Up;
                directSelector["ds" + right] = DraggingIndicatorDirect.Right;
                directSelector["ds" + down] = DraggingIndicatorDirect.Down;

                this.Direct = directSelector["ds" + Math.min( left, right, up, down )];

                this.block.css( this.DirectPosition[this.Direct] );
                this.block.show();
            }
        }

        private static indicator: ContentPlaceholderDraggingIndicator = null;

        public static GetInstance(): ContentPlaceholderDraggingIndicator
        {
            if ( ContentPlaceholderDraggingIndicator.indicator === null )
                ContentPlaceholderDraggingIndicator.indicator = new ContentPlaceholderDraggingIndicator();

            return ContentPlaceholderDraggingIndicator.indicator;
        }

        // 重置指示器
        public static Reset()
        {
            ContentPlaceholderDraggingIndicator.GetInstance().Reset();
        }

        // 开始创建指示器
        public static Create( draggingContentBlock: JQuery ): void
        {
            ContentPlaceholderDraggingIndicator.GetInstance().DraggingContentBlock = draggingContentBlock;
        }

        // 锚定投放目标
        public static Anchor( droppingContentBlock: JQuery ): void
        {
            var c: ContentPlaceholderDraggingIndicator = ContentPlaceholderDraggingIndicator.GetInstance();

            c.DroppingContentBlock = droppingContentBlock;

            if ( droppingContentBlock === null )
            {
                c.block.hide();
            } else
            {
                var dw: number = droppingContentBlock.width() + 1;
                var dh: number = droppingContentBlock.height() + 2;

                c.DropPosition = <IPosition>droppingContentBlock.offset();
                c.DropSize = { width: dw, height: dh };

                c.DirectPosition = [
                    { left: c.DropPosition.left, top: c.DropPosition.top, width: 4, height: dh },       // 左
                    { left: c.DropPosition.left + dw - 3, top: c.DropPosition.top, width: 4, height: dh },  // 右
                    { left: c.DropPosition.left, top: c.DropPosition.top, width: dw, height: 4 },       // 上
                    { left: c.DropPosition.left, top: c.DropPosition.top + dh - 4, width: dw, height: 4 }   // 下
                ];
            }
        }

        // 计算并更新指示器的方向
        public static UpdateIndicator( draggingPosition: IPosition )
        {
            ContentPlaceholderDraggingIndicator.GetInstance().Update( draggingPosition );
        }

        // 获得当前的投放方向
        public static GetDirect(): DraggingIndicatorDirect
        {
            return ContentPlaceholderDraggingIndicator.GetInstance().Direct;
        }
    }

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
    class TextCover
    {
        public Attach: JQuery = null;
        public TextBox: JQuery = null;
        public Callback: ( newText: string, oldText: string ) => void = null;   // 编辑动作完毕后调用的回调函数

        private static _instance: TextCover = null;

        // 编辑完毕后，重置 TextCover 为默认值
        private reset()
        {
            this.Attach = null;
            this.TextBox.val( "" ).hide().attr( "class", "text-cover" );;
            this.Callback = null;
        }

        // 应用更改
        private applyChange()
        {
            if ( this.Attach )
            {
                var oldText: string = this.Attach.text();
                var newText: string = $.trim( this.TextBox.val() );

                newText = ( newText ? newText : oldText );

                this.Attach.text( newText );

                // todo: undo/redo

                if ( this.Callback )
                    this.Callback( newText, oldText );

                this.reset();
            }
        }

        constructor()
        {
            this.TextBox = $( ".text-cover" );
            var my: TextCover = this;

            this.TextBox.on( "blur", function ()   // 失去焦点时自动应用修改
            {
                my.applyChange();
            }).on( "keyup", function ( e: JQueryEventObject )
                {
                    if ( e.keyCode === 13 )     // 按下回车时应用修改
                        my.applyChange();
                });
        }

        private static GetInstance()
        {
            if ( TextCover._instance === null )
                TextCover._instance = new TextCover();

            return TextCover._instance;
        }

        // 使输入框依附并遮盖到指定的对象 attach 上。
        public static Anchor( attach: JQuery, position?: IPosition, size?: ISize, callback?: ( newText: string, oldText: string ) => void, addClass?: string )
        {
            if ( attach && attach.length )
            {
                var c: TextCover = TextCover.GetInstance();
                var p: IPosition = <IPosition>attach.offset();

                c.Attach = attach;
                c.TextBox.css( position ? position : { left: p.left + 1, top: p.top + 1 });

                if ( size )
                {
                    c.TextBox.width( size.width ).height( size.height ).css( "line-height", size.height + "px" );
                } else
                {
                    var h: number = attach.height();
                    c.TextBox.width( attach.width() + 10 ).height( h ).css( "line-height", h + "px" );
                }

                if ( addClass )
                {
                    c.TextBox.addClass( addClass );
                }

                c.Callback = callback ? callback : null;

                c.TextBox.val( attach.text() ).show().focus().select();
            }
        }
    }

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
    class TabGlobalBinder
    {
        private static _selector: string = ".tab > .tab-pages > .tab-page.sel";
        private static _tab_page_format: string = '<a class="tab-page" hidefocus href="javascript:void(0)">标签{0}</a>';
        private static _panel_format: string = '<dd class="tab-panel layout-top"><div class="empty-content"></div></dd>';
        public static _empty_content: string = DesignCanvas.EmptyContent;

        // 使已选中的标签执行点击
        public static FireSelection( scope: JQuery = null ): void
        {
            var src: JQuery = ( scope === null ) ? $( TabGlobalBinder._selector ) : scope.find( TabGlobalBinder._selector );

            src.trigger( "click" );
        }

        // 绑定标签页的基本事件
        public static ApplyBinding(): void
        {
            // 点击删除标签页，若删除的是最后一个标签页，则整个 tab 都删除。
            var deleteTabPageButton: JQuery = $( ".delete-tab-page" );

            DesignCanvas.Canvas.on( "click", ".tab > .tab-pages > .tab-page", function ()     // 单击某个标签页
            {
                SplitterContainer.HideAll();

                var me: JQuery = $( this );
                var siblings: JQuery = me.siblings( ".tab-page" );
                var tab: JQuery = me.closest( ".tab" );
                var panels: JQuery = tab.children( ".tab-panel" );

                me.addClass( "sel" );
                siblings.removeClass( "sel" );
                panels.hide().eq( me.index() ).show();

                DesignCanvas.DoResizeInterval();
            }).on( "dblclick", ".tab > .tab-pages > .tab-page", function ()  // 双击标签页，修改标签文本
                {
                    TextCover.Anchor( $( this ) );
                }).on( "mouseenter", ".tab > .tab-pages", function ()  // 移动鼠标到标签页容器
                {
                    DesignCanvas.HiddenElement();
                }).on( "click", ".tab > .tab-pages > .tab-page > .delete-tab-page", function ()    // 删除指定的标签页
                {
                    var p: JQuery = $( this ).parent();
                    var siblings: JQuery = p.siblings( ".tab-page" );

                    if ( siblings.length > 0 )
                    {
                        var index: number = p.index( ".tab-page" );
                        var panel: JQuery = p.closest( ".tab" ).find( ".tab-panel:eq(" + index + ")" );
                        var next: JQuery = p.next( ".tab-page" );

                        next = next.length === 0 ? p.prev() : next;

                        p.remove();
                        panel.remove();

                        if ( p.hasClass( "sel" ) )     // 使下一个标签（或当删除的是最后一个标签时，使上一个标签）可见
                            next.trigger( "click" );
                    } else      // 删除到最后一个标签页时删除整个 tab 布局
                    {
                        p.closest( ".layout-table.tab" ).replaceWith( Layout.ActiveDroppable( $( TabGlobalBinder._empty_content ) ) );

                        // 重整布局
                        SplitterContainer.DeleteAll( "ver" );
                        DesignCanvas.DoResizeInterval();
                    }

                    // todo: redo/undo
                }).on( "mouseenter", ".tab > .tab-pages > .tab-page", function ()  // 鼠标移动到某个标签页显示 [删除标签] 按钮
                {
                    var del: JQuery = $( this ).children( ".delete-tab-page" );

                    if ( del.length === 0 )     // 若无则添加
                        deleteTabPageButton.clone().appendTo( this );
                }).on( "click", ".tab > .tab-pages > .add", function ()  // 点击 [增加标签] 按钮
                {
                    var me: JQuery = $( this );
                    var tab: JQuery = me.closest( ".tab" );
                    var pages: JQuery = me.siblings( ".tab-page" );
                    var tabPage: JQuery = $( TabGlobalBinder._tab_page_format.replace( /\{0\}/g, ( pages.length + 1 ).toString() ) );
                    var panel: JQuery = $( TabGlobalBinder._panel_format );

                    Layout.ActiveDroppable( panel.children( ".empty-content" ) );

                    me.before( tabPage );
                    tab.append( panel );
                });

            TabGlobalBinder.FireSelection();
        }
    }

    /**
     * 门户页尺寸选择对话框
     */
    class PortalPageSizeDialog
    {
        private $obj: JQuery = $( ".portal-page-size" );

        constructor()
        {
            
        }
    }

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
    class LayoutQuickToolbar
    {
        public toolbar: JQuery;

        public SpanText: JQuery;
        public IText: JQuery;
        public Q: JQuery;

        public AttachLayout: JQuery = null;

        constructor()
        {
            this.toolbar = $( ".layout-quick-toolbar" ).on( "mouseenter", () => this.toolbar.show() );

            var sd: JQuery = this.toolbar.find( ".size-data" );
            this.SpanText = sd.children( "span" );
            this.IText = sd.children( "i" );
            this.Q = sd.children( "q" );

            // 删除布局
            this.toolbar.find( ".delete-layout" ).on( "click", () => { return Layout.Delete( this.AttachLayout ); });
        }

        private static _instance: LayoutQuickToolbar = null;

        // 使关联的 attach (td) 显示尺寸信息
        public static Anchor( attach: JQuery ): void
        {
            try
            {
                var c: LayoutQuickToolbar = LayoutQuickToolbar._instance;

                if ( c === null )
                    c = LayoutQuickToolbar._instance = new LayoutQuickToolbar();

                var tb: JQuery = c.toolbar;
                var td: JQuery = attach.parent();

                c.AttachLayout = td;

                var w: number = td.width();
                var ew: number = w - 12;
                var pw: number = td.parent().width();
                var p: number = Math.floor( w / pw * 100 );
                var unit: number = Number( td.attr( "sizeunit" ) );
                var isVer: boolean = ( td.attr( "splitter" ) === "ver" );

                tb.css( attach.offset() );

                unit = isNaN( unit ) ? LayoutSizeUnit.Percent : unit;
                var isPercent: boolean = ( unit === LayoutSizeUnit.Percent );

                c.SpanText.text( ( isPercent && ( !isVer ) ) ? ( p + "%" ) : ( ew + "Px" ) );
                c.IText.text( isPercent ? ( ew + "Px" ) : ( p + "%" ) );

                if ( isVer )
                {
                    c.IText.hide();
                    c.Q.hide();
                } else
                {
                    c.IText.show();
                    c.Q.show();
                }

                tb.width( attach.width() ).show();
            } catch ( e )
            {

            }
        }

        // 隐藏工具栏
        public static Hide()
        {
            var c: LayoutQuickToolbar = LayoutQuickToolbar._instance;

            if ( c === null )
                c = LayoutQuickToolbar._instance = new LayoutQuickToolbar();

            c.toolbar.hide();
        }
    }
}

// 创建设计视图，开始初始化设计面板
$( () => new Sapi.PortalDesign.DesignView().Init() );

/**
 * 加载当前门户页布局
 * 
 * @param: 
 *      portalId - 门户页的 ID (Guid)
 *      callback - 执行完毕的回调函数，要求将结果传递给 callback (function)
 *
 * @return: 返回门户页的布局 (string)
 */
function LoadPortalLayout( portalId: string, callback: ( result: string ) => void ): void
{
    ajax( "FillData.ashx", { "action": "GetPortalHtml", "PPID": portalId, randData: new Date().getTime() }, "json", function ( data )
    {
        callback( ( data.Success === "Y" && data.Others[0] === "N" ) ? data.Data : "" );
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
function SavePortalLayout( portalId: string, layout: string, callback: ( result: boolean ) => void ): void
{
    ajax( "FillData.ashx", { "action": "SavePortalHtml", "PPID": portalId, "Html": layout, randData: new Date().getTime() }, "json", function ( data )
    {
        callback( data.Success === "Y" );
    });
}

function ajaxLoading() { }