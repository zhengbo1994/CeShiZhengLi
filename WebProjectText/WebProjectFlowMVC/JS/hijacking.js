/**
 * Copyright 2014 @SAPI
 * http://www.chinasap.cn
 * 
 * by maowenchao
 * 
 * hijacking.js v0.1 - 2014/7/15
 * 
 * 本脚本文件旨在提供一个劫持式的弹出对话框的工具，
 * 通过劫持旧有的 window.open 及 window.alert 函数使其改为在当前页面内使用 <块元素 + iframe> 方式弹出。
 * 所有样式表内置在脚本中，仅需在页面引用本脚本文件到页面，无须加入外部样式文件。
 * 
 * hijacking.js 依赖项:
 *      jQuery  1.4.2+       http://jquery.com
 *
 * 
 * 因 open() 函数为各大浏览器所不容，并且 showModalDialog() 这类非标准的 API 更是仅个别浏览器支持，
 * hijacking.js 通过对部分原生的全局方法(broswer) 进行重新赋值 (称为劫持，hook)，替换原有的行为逻辑，
 * 目的是提供另一种更为通用的对话框方式，以及兼容各大浏览器，屏弃不兼容的 API。
 * 
 * 若系统中的脚本已大量地、频繁地使用了 window.open() 以及非标准 API window.showModalDialog()、window.showModelessDialog()，
 * 可能因为调用的次数如此庞大，难以着手修改，面临此类问题的程序员可考虑使用 hijacking.js 暂时替换这些非标准 API。
 * 
 * 应用 hijacking.js，仅需在首页(事实上其他页均可) 加入 hijacking.js 即可，其他从这个页面打开的页面，将会被自动插入 hijacking.js。
 * 
 * 基本使用步骤：
 *      1、在 HTML 页面中引用 jQuery 及本脚本文件：
 * 
 *      <script src="js/jquery.1.10.js"></script>
 *      <script src="js/hijacking.js"></script>
 * 
 * 
 *      2、显示对话框
 *          2.1、隐式调用 (使用标签声明)
 * 
 *              2.1.1、使用回调提供参数信息
 * 
 *                  <script>
 *                      var kd = {
 *                          optionController: function () {
 *                              return {
 *                                  // 参数，所有参数请参看 2.2 显式调用部分
 *                              };
 *                          }
 *                      }
 *                  </script>
 *           
 *                  <a href="javascript: void 0" class="js-show-dialog">打开</a>
 * 
 *                  <!--
 *                      kd-dialog   指定此元素为对话框
 *                      data-target 提供引发对话框打开的事件源元素的选择器，
 *                      data-event  事件源元素的指定引发对话框打开的事件
 *                  -->
 *                  <div kd-dialog="kd.optionController" data-target=".js-show-dialog" data-event="click">
 *                      对话框内容
 *                  </div>
 *           
 *           
 *              2.1.2、使用元素属性提供参数信息 (若同时指定了回调提供参数信息，则元素属性优先)
 * 
 *                  <a href="javascript: void 0" class="js-show-dialog">打开</a>
 * 
 *                  <div    kd-dialog=""
 *                          data-target=".js-show-dialog"
 *                          data-event="click"
 *                          data-url="home/portal/portal.html"
 *                          data-size="300 auto"
 *                          data-position="center center"
 *                          data-modal="false"
 *                          ...... >
 * 
 *                      对话框内容
 *                  </div>
 * 
 * 
 *          2.2、显式调用
 * 
 *              <script>
 * 
 *                  window.open( "home/portal/portal.html" );   // 普通
 * 
 *                  window.open( {              // 对象方式提供参数，详细请参考 Dialog.defaultOptions
 *                      url: "home/portal/portal.html",     // 打开地址
 *                      size: {     // 对话框尺寸
 *                          width: "auto",
 *                          height: "auto"
 *                      },
 *                      position: {     // 对话框显示位置
 *                          left: "center",
 *                          top: "center"
 *                      }
 *                  } );
 *              </script>
 */

/**
 * 使用 [全局变量] 方式覆盖 window.close，转为关闭内部对话框，使得原 window.close [全局属性] 不再有机会被调用
 * 
 * 这种 [全局变量] 覆盖 [全局属性] 的技巧用于全局属性无法被正确地劫持 (通常是禁止 "写(Set)" 的属性)，
 * 如 window.close、window.parent 无法直接赋值函数达到替换效果的情况
 */
var close = function ()
{
    if ( window.dialogHosting )
    {
        ( function ()
        {
            var dlg = window.dialogHosting.data( "dialog" );

            if ( dlg )
            {
                dlg.close();
            }
        } )();
    }
}

var closeWindow = function () { }      // 取消 IdeaSoft.js 中的 closeWindow 函数

var topLayerWindow = window.parent;

// 强制劫持 parent 属性，更换对话框中 iframe 父对象为打开此对话框的 iframe 对象(此对象若存在，则保存在 window.parentCache 中)，
// 否则将默认为首页
if ( window.parentCache )
{
    // window.parent 全局属性是只读的，因此对于这样的语句:
    //          parent = { p: "v" };
    // 事实上是无效操作。
    //
    // 必须通过声明 parent 全局变量来达到覆盖 window.parent 全局属性之目的:
    //      var parent = value;
    //
    // 但无法如下方这样通过直接使用语句
    //      var parent = window.parentCache || window.parent;   // 若 parentCache 存在则替换，不存在使用原来的 parent
    //
    // 来达到覆盖原有的 parent 对象，原因是:
    //      1. 必须先通过判断 window.parentCache 是否存在，从而确定是否需要更换 window.parent 赋值，
    //          不存在则不应更换。
    //
    //      2. 若使用下方的代码:
    //              var parent = window.parentCache || window.parent;
    //
    //          此语句对于JS引擎而言如下::
    //              var parent;     // parent 变量将被先用 undefined 初始化
    //              parent = window.parentCache || window.parent;           // 此处将无法读取原来的 parent 了
    //                                                      ▲
    //                                               此处读取的 window.parent 将不再是原来的 parent 对象，而是 undefined
    //
    //          必须动态执行 JS 的方式来覆盖，下方使用 eval() 函数来实现。
    try
    {
        window.eval( "var parent;" );
    } catch ( e )
    {

    }

    parent = window.parentCache;
}

( function ( hijacking, win, doc, $, undefined, jq )
{
    // 若已被初始化，则不再执行，预防重复加载。
    if ( hijacking )
    {
        return;
    }

    var jq = $,
        isWrapOnFrame = win.parent !== win.self,    // 判断当前页面是否在 iframe 中
        pWin = isWrapOnFrame ? topLayerWindow : win,    // 若在 iframe 中，获得其父对象，否则当前页为首页(Top)

        noop = function () { },     // 空操作函数
        toBoolean = function ( v ) { return v && typeof v === "string" ? ( jq.trim( v ) === "false" ? false : true ) : !!v; },      // 将指定值转换为布尔值
        transFunction = function ( f ) { return win[f] instanceof Function ? f : noop; },   // 若参数为函数，直接返回，否则使用默认空函数
        transSize = function ( v ) { return transRelevanceValue( v, "width", "height", "auto" ); },     // 转换尺寸信息
        transPosition = function ( v ) { return transRelevanceValue( v, "left", "top", "center" ); },       // 转换位置信息

        readyCallback = noop,    // 当前 Hijacking 加载完毕后执行的回调

        // #region 配置项:

        prefix = "kd",      // HTML 元素前缀

        requireJQueryMinVersion = "1.4.2",    // 要求最低 jQuery 版本

        // 指定所在域，用于验证地址跨域。
        // 若置空则使用本窗口(若在iframe中则使用父窗口的domain作为跨域验证条件)
        domain = "",

        // 若是跨域地址则使用原生的 open 打开
        useNativeOpenIfCrossDomain = true,

        //hijackingPath = "hijacking.js",       // 本脚本所在路径
        //jQueryPath = "jquery-1.10.2.js",      // 若页面不存在 jQuery

        hijackingPath = "../js/hijacking.js",       // 本脚本所在路径
        jQueryPath = "../js/jquery-1.10.2.js",      // 若页面不存在 jQuery

        minDialogHeight = 150,              // 对话框最小高度
        minDialogWidth = 300,               // 对话框最小宽度

        defaultDialogHeight = 600,          // 对话框默认高度
        defaultDialogWidth = 760;           // 对话框默认宽度

    // #endregion

    // #region 辅助工具

    /**
     * 加载脚本
     * 
     * @param doc       {HTMLDocument} 加载到指定 document 中
     * @param url       {string} 加载脚本的地址
     * @param success   {function} 成功加载后的回调
     * @param error     {function} 加载失败后的回调 (IE 及 Opera 下不支持)
     */
    var loadScript = function ( doc, url, success, error )
    {
        var node = doc.createElement( "script" ),
            base = doc.getElementsByTagName( 'base' )[0],
            head = base ? base.parentNode : doc.getElementsByTagName( 'head' )[0],
            success = success || noop,
            error = error || noop;

        if ( !head )
        {
            return;
        }

        node.type = "text/javascript";
        node.charset = "utf-8";
        node.async = true;

        if ( node.attachEvent && !( typeof opera !== 'undefined' && opera.toString() === '[object Opera]' ) )
        {
            node.attachEvent( "onreadystatechange", success );      // IE 下会执行两次回调，I hate IE。
        } else
        {
            node.addEventListener( "load", success );
            node.addEventListener( "error", error );
        }

        node.src = url;

        if ( base )
        {
            head.insertBefore( node, base );
        } else
        {
            head.insertBefore( node, head.lastChild );
        }
    }

    /**
     * 转换复合值为对象
     * 
     * @param v     {string} 原始值
     * @param p1    {string} 属性名1
     * @param p2    {string} 属性名2
     * @param def   {string} 属性默认值
     */
    var transRelevanceValue = function ( v, p1, p2, def )
    {
        var result = {};

        try
        {
            result = JSON.parse( v );
        } catch ( e )
        {
            v = jq.trim( v );

            if ( v )
            {
                var set = v.split( /\s+/g );

                if ( set.length > 1 )
                {
                    result[p1] = set[0] || def;
                    result[p2] = set[1] || def;
                } else if ( set.length === 1 )
                {
                    result[p1] = set[0] || def;
                    result[p2] = result[p1];
                }
            } else
            {
                result[p1] = def;
                result[p2] = def;
            }
        }

        return result;
    }

    /**
     * 转换模式信息
     * 
     * @param v     {string} 模式信息
     */
    var transModal = function ( v )
    {
        var result = {
            use: use
        };

        try
        {
            result = JSON.parse( v );
        } catch ( e )
        {
            result.use = toBoolean( v );
        }

        return result;
    }

    /**
     * 从指定的 jQuery 对象创建选项
     * 
     * @param $obj  {$} 通过读取此对象的属性创建选项
     */
    var buildDialogOptions = function ( $obj )
    {
        var func = jq.trim( $obj.attr( prefix + "-dialog" ) ),
            funcOptions = {},
            options = {},
            specifyName = {
                "show-border-shadow": "showBorderShadow",
                "show-close-button": "showCloseButton",
                "show-maximized-button": "showMaximizedButton",
                "close-on-escape": "closeOnEscape",
                "full-screen": "fullscreen",
                "show-title-bar": "showTitleBar",
                "before-close": "beforeClose",
                "drag-end": "dragEnd",
                "resize-end": "resizeEnd"
            },
            parseSet = {
                url: jq.trim,
                content: void 0,
                round: toBoolean,
                title: jq.trim,
                size: transSize,
                position: transPosition,
                modal: transModal,
                "show-border-shadow": toBoolean,
                showBorderShadow: toBoolean,
                "show-close-button": toBoolean,
                showCloseButton: toBoolean,
                "show-maximized-button": toBoolean,
                showMaximizedButton: toBoolean,
                "close-on-escape": toBoolean,
                closeOnEscape: toBoolean,

                "full-screen": toBoolean,
                fullscreen: toBoolean,
                "show-title-bar": toBoolean,
                showTitleBar: toBoolean,

                draggable: toBoolean,
                resizable: toBoolean,

                "before-close": transFunction,
                beforeClose: transFunction,
                close: transFunction,
                create: transFunction,
                show: transFunction,
                maximize: transFunction,
                revert: transFunction,
                drag: transFunction,
                "drag-end": transFunction,
                dragEnd: transFunction,
                resize: transFunction,
                "resize-end": transFunction,
                resizeEnd: transFunction
            };

        if ( func )
        {
            try
            {
                funcOptions = pWin.eval( func )();
            } catch ( e )
            {
            }
        }

        for ( var p in parseSet )
        {
            var v = $obj.attr( "data-" + p ),
                f = parseSet[p];

            if ( v )
            {
                options[specifyName[p] || p] = ( f instanceof Function && f( v ) ) || v;
            }
        }

        return jq.extend( {}, Hijacking.Dialog.defaultOptions, options, funcOptions, true );
    }

    //#endregion

    /**
     * 执行初始化
     */
    win.Hijacking = function ()
    {
        var Dialog;

        // 若存在父窗口，即表示本脚本所在的页面运行在 iframe 框架中，
        // 则使用父窗口的 dialog 来弹出对话框
        if ( isWrapOnFrame )
        {
            jq = pWin.jQuery;
            Dialog = Hijacking.captureDialog();     // 使用顶部的对话框对象
        }

        var $body = jq( "body" ),
            $pWin = jq( pWin ),

            _ = {     // 存放旧的方法
                alert: win.alert,
                open: win.open,
                mockOpen: function ( url )
                {
                    var form = jq( '<form style="display:none" action="' + url + '" target="_blank"></form>' );

                    form.appendTo( $body );
                    form.submit();

                    form.remove();
                },
                showModalDialog: win.showModalDialog,
                showModelessDialog: win.showModelessDialog
            };

        Hijacking._ = _;

        if ( !Dialog )
        {
            // 初始化对话框对象，仅在首页加载时初始化，其余内部 iframe 页面使用该对象，参看上面两三行
            Dialog = ( function ()
            {
                /**
                 * 对话框对象
                 * 
                 * @param options 生成对话框的参数
                 */
                function dialog( options )
                {
                    var that = this;

                    this.options = options;
                    this.baseZIndex = dialog._.currIndex;   // 获得当前Z序

                    // 生成对话框实例
                    this.instance = jq( this.parse() ).data( "dialog", this );

                    // 获得对话框 iframe 页面
                    this.framepage = this.instance.find( "iframe.kd-frame-page" );

                    this.prevPosInfo = {};      // 记录最大化前的还原位置

                    if ( !this.options.closeBehavior )
                    {
                        dialog._.stackTree.push( this.instance );   // 记录当前对话框对象到堆栈中
                    }

                    this.instance.appendTo( $body );       // 添加到界面中

                    // 计算对话框尺寸
                    this.adjust( this.framepage.length > 0 ? this.framepage.contents() : null );

                    // 注入对话框参数 (若有)
                    Hijacking.injectFrames( this.framepage, this.instance, this.options.dialogArguments, this.options.dialogParent );

                    if ( typeof this.options.create === "function" )
                    {
                        this.options.create.call( this, this.instance );
                    }
                }

                dialog._ = {
                    globalDialogCover: jq( '<div tabindex="-1" class="kd-mimic-dialog-cover"></div>' ),       // 全局遮罩
                    currIndex: 20000,       // 当前 Z 序 (z-index)
                    stackTree: []           // 对话框堆栈
                };

                // 初始化对话框
                dialog.init = function ()
                {
                    // 若从未拖动过对话框，则尝试自动居中对话框
                    $pWin.bind( "resize", function ()
                    {
                        jq.each( dialog._.stackTree, function ( i, $dlg )
                        {
                            if ( !$dlg.data( "hasPositioned" ) )
                            {
                                $dlg.data( "dialog" ).setPosition();
                            }
                        } );
                    } );

                    // #region 添加样式表到首页顶部

                    if ( jq( ".kd-dialog-style-block" ).length === 0 )
                    {
                        jq( "head" ).append(
                            "<style class=\"kd-dialog-style-block\" type=\"text/css\">" +
                                ".kd-mimic-dialog-cover{left:0;right:0;top:0;bottom:0;position:absolute;display:none} " +
                                ".kd-mimic-dialog .custom-content{font-size:12px;line-height:22px}" +
                                ".kd-mimic-dialog .custom-content .alert-content{min-height:60px;padding:10px;padding-left:70px;position:absolute;left:0;right:0;top:0;bottom:40px;overflow:auto;background:url('data:image/png;base64,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') 10px 10px no-repeat}" +
                                ".kd-mimic-dialog .custom-content .alert-confirm{height:40px;border-top:1px solid #bac5cc;background-color:#e6ecef;position:absolute;left:0;right:0;bottom:0;text-align:center}" +
                                ".kd-mimic-dialog .custom-content .alert-confirm .btn-ok{display:inline-block;height:22px;margin-top:7px;line-height:22px;text-decoration:none;padding-left:15px;padding-right:15px;border:1px solid #d7e2f2;border-top-color:#e0ecfd;background-color:#d7e2f2;outline:1px solid #afc0d8;color:#555}" +
                                ".kd-mimic-dialog .custom-content .alert-confirm .btn-ok:hover{border:1px solid #c6d5e9;border-top-color:#d7e5f7;background-color:#c6d5e9}" +
                                ".kd-mimic-dialog .custom-content .alert-confirm .btn-ok:active{border:1px solid #afc0d8;border-top-color:#c0d1e8;background-color:#afc0d8}" +

                                ".overhide{overflow:hidden} " +
                                ".kd-mimic-dialog.kd-max-clear{margin-left:0;margin-top:0} " +
                                ".kd-mimic-dialog{margin-left:-12px;margin-top:-12px;position:absolute;padding:12px;background-color:transparent;display:none;overflow:hidden} " +
                                '.kd-mimic-dialog div,.kd-mimic-dialog ul{margin:0;padding:0;list-style:none;font-family: "微软雅黑", "Microsoft YaHei", "宋体", Song, Tahoma, Helvetica, Arial, sans-serif} ' +

                                ".kd-mimic-dialog .kd-dialog-shadow{position:absolute;left:0;right:0;top:0;bottom:0;background-color:transparent} " +
                                ".kd-dialog-shadow div{position:absolute} " +
                                ".kd-dialog-shadow .kd-shadow-top-left{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADtSURBVHjapJVrDoMwDIPdNAzYuTjvLsDl9qedgnFbYJEiggpfjPsg7fsOEalznwbPAgD8AkBdW2O/2gcgri3U3UY+gJqoTTTglIoZpjJToxPchT8RmsOVs9vABTA1YE7JTQ4WsRUmoBU0UXoYP8HV5EV4BL4oJ/EF9b2Dx8qGCp4LbCn1HOCTsOfksVJbFa4ll9BAqc8ALHpspDiClwJ9l4wNFNxcrAYFngvkvW3bBxfCLvgbwSsuhonNMVKNu4ojPDeU3wKngWJeHXjisdrWDL/tMRqnGsMfT94I/tfktU45f6oYnb+CCeua8R0Ai8AHhTHnAXsAAAAASUVORK5CYII=') no-repeat;height:22px;width:22px;left:0;top:0} " +
                                ".kd-dialog-shadow .kd-shadow-top{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAYAAACji9dXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRUE3NkQ1MDE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRUE3NkQ0RjE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOEI1MzkzNThDMERFNDExQkQwQkE2N0I3NzFDRjIyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnvSuCMAAAAvSURBVHjaYti9ezcrEwMDAwuIYAMRHCCCE0RwgQgeEMEHIvhBhCCIEAIRwgABBgCNLALRgVlybgAAAABJRU5ErkJggg==') repeat-x;height:12px;left:22px;right:22px;top:0} " +
                                ".kd-dialog-shadow .kd-shadow-top-right{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAErSURBVHjanJTtTsMwDEWP21AYAoHgzXjd9rH42tY2+5NMrnGyBktXaaL25MZ2KuM4BvyIlXm88S4BuKt8qEf9LM58wwjAsAOUtapnccxc1wJw7wCiA1yBzsBXBypADMChAsvjouBamPc3jh93ABdHOa95A50aCcCTc2QLm5UkaVH5XdVG5FQ8F6CzGs9JnQJ7sepUvKTJYqCzgp6AvgCOpouuxXtV4MUAMzQksJiejYXiSQDeHKcZeAKOBlyCdhoegPe04EF/k0L6kEqhRcGRGCN7YpqmD+AT+AK+gZ+06THprMytgf1xMEXV6pVrQR1vTzyk6z+kH1dQnfKnW1rBFto73dLseDDgmmNpBXtQcdTkuOTUveYt4FvQfxfPFqwEbU5FV8npBgpwGQBLgrfSmq1r1AAAAABJRU5ErkJggg==') no-repeat;height:22px;width:22px;top:0;right:0} " +
                                ".kd-dialog-shadow .kd-shadow-left{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAABCAYAAADq6085AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRUQ1QUU2QjE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRUQ1QUU2QTE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOEI1MzkzNThDMERFNDExQkQwQkE2N0I3NzFDRjIyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlTox6gAAAAsSURBVHjaDMMBCgAQEETRUQiJ2PufZC63/9Urtpukys7BycXNw8vHz0gBBgBwfgK84WMxVAAAAABJRU5ErkJggg==') repeat-y;width:12px;top:22px;bottom:22px;left:0} " +
                                ".kd-dialog-shadow .kd-shadow-right{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAABCAYAAADq6085AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRUQ1QUU2RjE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRUQ1QUU2RTE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOEI1MzkzNThDMERFNDExQkQwQkE2N0I3NzFDRjIyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv9/nzQAAAAtSURBVHjaDMPRDQAQEETBVb6atiaEXI6ID2+SKbarpMbOwcnFYHLz8PJ9AQYAWRkNODqjl0YAAAAASUVORK5CYII=') repeat-y;width:12px;top:22px;bottom:22px;right:0} " +
                                ".kd-dialog-shadow .kd-shadow-bottom-left{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEnSURBVHjapJVhTsMwDIU/tylsCASCK/VUXC0X28aW8ieZ3ixnardIVqM0/fz0HKeWc07ABLwAr8AeeAPegQ/gE/gCvoGfeZ5/WTEGmS/yjKLUYAu4By3AReK8FcwdhUWgD4FZAf17xIqeDQo9bQEvHbUR9PRs8XzBGvjwTPG84gY9bgGnABopTRKrhuWch6o8AaN0YevEnXRji31d38neSZIPqqDUBGpDS2o12r6zeO6ho4Ijf80FUtgGngLoCFiqmy3wOYJ6cPJKFYyDlzq/dE5MAzeYQq/WJfdx7/aKwKPE4OuRXINECXptPgjUXJFvPFYIAvfQu0CvWH0uQdGKA0Wn5qbYUfEsUG3unGtiP6eneOmsWQeqT7xi/98zd+OZe4cH+fE/ANtmrjA5NXwVAAAAAElFTkSuQmCC') no-repeat;height:22px;width:22px;left:0;bottom:0} " +
                                ".kd-dialog-shadow .kd-shadow-bottom{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAMCAYAAACji9dXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRjFDODc0RDE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRjFDODc0QzE1NkUxMUU0QUY0OEY2QUVENjFEOTZBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOEI1MzkzNThDMERFNDExQkQwQkE2N0I3NzFDRjIyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OTkzN0JGNUE2MDFFNDExQTAzM0IxQ0Q5Q0NBQjZFQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuWJBdQAAAAvSURBVHjaFMTBCQAgEAPBYPfWlJpUlOMU8SE7j5HtWiQ16jRo0qKgpE2HLr0vwACtSw1N/XjP0QAAAABJRU5ErkJggg==') repeat-x;height:12px;left:22px;right:22px;bottom:0} " +
                                ".kd-dialog-shadow .kd-shadow-bottom-right{background:transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEWSURBVHjapJRbTsQwDEUPKGtnVd0SI0aD6CPTmB8jGdd5QSQrrZIe27e2X0SEkbUsyxvwDtyAD+AOPIBP4AtYgR04gPzK+CpqUjHMzgz4CZzGSgs+C34aaGnAp8B5AM5fwEcFHuo9Cz4akf/SeQa8ObD9kf/6eZut007EU+C1Afd6k7SjitEtGz03tVW7azRqSdqmRS9E8N052Cpg0R2ApL0vJiULzwa+G2hX56QDRcwFC/fRHyP6/khxN2kUBz9d9LlTx9iIH8abh59BBr6GIzhJ56k4uBh4CUCnO7+0dNIyivo9chCZBENIkpYQjQEuDlIC55dBn7SM/IEEzzVQ9C1JywefSsdRtF8izpXZII136dzlewBAWT585kFx1AAAAABJRU5ErkJggg==') no-repeat;height:22px;width:22px;right:0;bottom:0} " +

                                ".kd-mimic-dialog .kd-dialog-size-handler{position:absolute;left:0;right:0;top:0;bottom:0;background-color:transparent} " +
                                ".kd-dialog-size-handler div{position:absolute} " +
                                ".kd-dialog-size-handler .kd-size-handler-top-left{height:5px;width:5px;left:8px;top:8px;cursor:se-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-top{height:5px;left:13px;top:8px;right:13px;cursor:n-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-top-right{height:5px;width:5px;right:8px;top:8px;cursor:ne-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-left{width:5px;top:13px;bottom:13px;left:8px;cursor:w-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-right{width:5px;top:13px;bottom:13px;right:8px;cursor:w-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-bottom-left{height:5px;width:5px;left:8px;bottom:8px;cursor:ne-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-bottom{height:5px;left:13px;bottom:8px;right:13px;cursor:n-resize} " +
                                ".kd-dialog-size-handler .kd-size-handler-bottom-right{height:5px;width:5px;right:8px;bottom:8px;cursor:nw-resize} " +

                                ".kd-dialog-content-wrapper{border:1px solid #929292;background-color:#fff;position:absolute;left:12px;right:12px;top:12px;bottom:12px} " +
                                ".kd-dialog-control{height:22px;position:absolute;right:0} " +
                                ".kd-dialog-control li{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAACECAYAAACDOEu6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJOSURBVHja7JqxSxxBFMa/J0eKLFFTWRyS0zZiYbpUY0zAf2BNu/1VQRYUa4mwSKrpDwIBvTpgk2QgJJ0pTtOk8K7RIAgWshJE8lLteCYnN6uzlzt9Dw5ulmN+896bnf3244iZ0csYQo9DgALMHSWXH6VpylEU2XG9XicA0FqzMQYAUKlUkCQJeckwCAJKksSOwzBkY4yFBUHgBAMAynPjG2NYa/3P9Sxj7z1USpFS6tqwa22arIxZaK25MGAYhtzWV7sAYwx7B0ZRZCetVquo1WrUliVarRZ7A8ZxzGmaZn2EUor+7l8cx/C+S+VoE6AABShAAV4d/PkLmiXi7IPGDtDYwemL5/bayXjZ3/OQRobx6O07O27OTPPZ5gYffvoAABgl4MH7LfJa0qHHU1ReWrHj/bVV+/3hdqMY1XZv4SWNzc5dujbxrVGsasvKmMXp4qviVFtzZtpOPkoXCzjb3PCv2o6fXMDKSyuX+ra/torf33edoE4i6mS8zEc/DwAAY7NzuL/+hjplPXHO5AUoR5sABShAAd5xYFevrd0q6RYuJlF/uokuK3ethOxSARazS/PciyITBShAAQrwLj4tJpc/Op/ue6+fDahq21p82nXl8+tfRbUJ8D/uUtcdKKpNgAIUoAD76PB2ffUeXOvLJQtX4yG3i9Fp4sL+19bTkt60lF4zzAMt+QDejh768ttEtQlQgAIUYI8O7x9Hv5xevQfX+mqPq2wwV+Mht4vRaWIXL67/S3rTUnrNMA/Ui2q7HT305beJahNg/wP/DACcrfOcK2kH6QAAAABJRU5ErkJggg==');background-color:transparent;background-repeat:no-repeat;background-position:center top;list-style:none;float:right;width:28px;height:22px;cursor:pointer} " +
                                ".kd-dialog-head{background-color:#eee;position:relative;height:22px} " +
                                ".kd-dialog-title-wrapper{line-height:20px;font-size:14px;font-weight:bold;height:22px;overflow:hidden;position:absolute;left:0;cursor:default} " +
                                ".kd-dialog-title-wrapper .kd-dialog-title{position:absolute;white-space:nowrap;padding-left:10px;margin-right:10px} " +
                                ".kd-dialog-control li:hover{background-color:#d9ebf7} " +
                                ".kd-dialog-control li.js-kd-dialog-close:hover{background-position:center -22px} " +
                                ".kd-dialog-control li.js-kd-dialog-size{background-position:center -44px} " +
                                ".kd-dialog-control li.js-kd-dialog-size:hover{background-position:center -66px} " +
                                ".kd-dialog-control li.js-kd-dialog-size.maximize{background-position:center -88px} " +
                                ".kd-dialog-control li.js-kd-dialog-size.maximize:hover{background-position:center -110px} " +
                                ".kd-dialog-content{position:absolute;top:22px;bottom:0;left:0;right:0;clear:both} " +
                                ".kd-dialog-content-cover{display:none;position:absolute;top:22px;bottom:0;left:0;right:0} " +
                                ".kd-mimic-dialog.kd-show-dialog-content-cover .kd-dialog-content-cover{display:block} " +
                                ".kd-dialog-content .kd-frame-page{margin:0;padding:0;width:100%;height:100%}" +
                            "</style>"
                        );
                    }

                    // #endregion

                    // #region 支持对话框拖放

                    var canMove = false,
                        movingObj = void 0,
                        movingOffsetX = 0,
                        movingOffsetY = 0;

                    $body.delegate( ".kd-dialog-draggable .kd-dialog-title-wrapper", "mousedown", function ( e )
                    {
                        var me = jq( this );

                        canMove = true;

                        movingObj = me.closest( ".kd-mimic-dialog" );
                        movingObj.instance = movingObj.data( "dialog" );
                        movingObj.instanceOptions = movingObj.instance.options;
                        movingObj.titleWrapper = me;
                        movingObj.maximizeButton = me.siblings( ".kd-dialog-control" ).find( ".js-kd-dialog-size.maximize" );
                        movingObj.maximized = ( movingObj.maximizeButton.length > 0 );      // 最大化状态

                        // 遮罩内容，为拖动过程准备（内容若为 iframe，则影响拖动效果）
                        movingObj.addClass( "kd-show-dialog-content-cover" );

                        movingOffsetX = e.offsetX;
                        movingOffsetY = e.offsetY;

                        return false;
                    } ).bind( "mouseup", function ()
                    {
                        if ( canMove && movingObj )
                        {
                            canMove = false;

                            // 撤除内容遮罩
                            movingObj.data( "hasPositioned", true ).removeClass( "kd-show-dialog-content-cover" );

                            if ( typeof movingObj.instanceOptions.dragEnd === "function" )
                            {
                                movingObj.instanceOptions.dragEnd.call( movingObj.instance, movingObj );
                            }

                            movingObj = void 0;
                            movingOffsetX = 0;
                            movingOffsetY = 0;

                            return false;
                        }
                    } ).bind( "mousemove", function ( e )
                    {
                        if ( canMove && movingObj )
                        {
                            if ( movingObj.maximized )     // 判断窗口是否最大化状态，若是，需先将窗口还原。
                            {
                                // 第一步: 计算鼠标点击时，鼠标指针 X 轴相对于窗口位置的比例
                                var scale = e.offsetX / movingObj.titleWrapper.width();

                                // 第二步: 还原窗口尺寸
                                dialog.doRevert( movingObj.maximizeButton );

                                // 第三步: 重新计算 X 偏移量
                                movingOffsetX = movingObj.titleWrapper.width() * scale;

                                movingObj.maximized = false;
                            }

                            movingObj.css( { left: e.pageX - movingOffsetX, top: e.pageY - movingOffsetY } );

                            if ( typeof movingObj.instanceOptions.drag === "function" )
                            {
                                movingObj.instanceOptions.drag.call( movingObj.instance, movingObj );
                            }

                            return false;
                        }
                    } );

                    // #endregion

                    // #region 调整对话框尺寸

                    var canResize = false,
                        resizingObj = void 0,
                        resizingStrategies = {      // 调整对话框尺寸策略
                            t: function ( p )   // 向上拖动块，需要调整 top 坐标和高度
                            {
                                var result = {},
                                    h = p.obj.height() - ( p.mouseTop - p.offset.top - 12 );

                                if ( p.mouseTop > 0 && h > minDialogHeight )
                                {
                                    result.top = p.mouseTop;
                                    result.height = h;
                                }

                                return result;
                            },
                            l: function ( p )   // 向左拖动块，需要调整 left 坐标和宽度
                            {
                                var result = {},
                                    w = p.obj.width() - ( p.mouseLeft - p.offset.left - 12 );

                                if ( p.mouseLeft > 0 && w > minDialogWidth )
                                {
                                    result.left = p.mouseLeft;
                                    result.width = w;
                                }

                                return result;
                            },
                            r: function ( p )       // 向右拖动块，仅需调整宽度
                            {
                                var w = p.mouseLeft - p.offset.left - 12;

                                return { width: w < minDialogWidth ? minDialogWidth : w };
                            },
                            b: function ( p )       // 向下拖动块，仅需调整高度
                            {
                                var h = p.mouseTop - p.offset.top - 12;

                                return { height: h < minDialogHeight ? minDialogHeight : h };
                            },
                            tl: function ( p )      // 左上角拖动块，需调整 top、left 坐标及宽高
                            {
                                var result = {},
                                    h = p.obj.height() - ( p.mouseTop - p.offset.top - 12 ),
                                    w = p.obj.width() - ( p.mouseLeft - p.offset.left - 12 );

                                if ( p.mouseTop > 0 && h > minDialogHeight )
                                {
                                    result.top = p.mouseTop;
                                    result.height = h;
                                }

                                if ( p.mouseLeft > 0 && w > minDialogWidth )
                                {
                                    result.left = p.mouseLeft;
                                    result.width = w;
                                }

                                return result;
                            },
                            tr: function ( p )      // 右上角拖动块，需调整 top 坐标和宽高
                            {
                                var result = {},
                                    h = p.obj.height() - ( p.mouseTop - p.offset.top - 12 ),
                                    w = p.mouseLeft - p.offset.left - 12;

                                if ( p.mouseTop > 0 && h > minDialogHeight )
                                {
                                    result.top = p.mouseTop;
                                    result.height = h;
                                }

                                if ( p.mouseLeft > 0 && w > minDialogWidth )
                                {
                                    result.width = w;
                                }

                                return result;
                            },
                            bl: function ( p )      // 左下角拖动块，需调整 left 坐标和宽高
                            {
                                var result = {},
                                    w = p.obj.width() - ( p.mouseLeft - p.offset.left - 12 ),
                                    h = p.mouseTop - p.offset.top - 12;

                                if ( p.mouseLeft > 0 && w > minDialogWidth )
                                {
                                    result.left = p.mouseLeft;
                                    result.width = w;
                                }

                                result.height = h < minDialogHeight ? minDialogHeight : h;

                                return result;
                            },
                            br: function ( p )      // 右下角拖动块，需调整宽度和高度两者
                            {
                                var w = p.mouseLeft - p.offset.left - 12,
                                    h = p.mouseTop - p.offset.top - 12;

                                return {
                                    width: w < minDialogWidth ? minDialogWidth : w,
                                    height: h < minDialogHeight ? minDialogHeight : h
                                };
                            }
                        };

                    $body.delegate( ".kd-dialog-resizable .kd-dialog-size-handler > div", "mousedown", function ( e )
                    {
                        var me = jq( this );

                        canResize = true;

                        resizingObj = me.closest( ".kd-mimic-dialog" );
                        resizingObj.instance = resizingObj.data( "dialog" );
                        resizingObj.instanceOptions = resizingObj.instance.options;

                        resizingObj.resizingStrategy = resizingStrategies[me.attr( "data-direct" )];

                        resizingObj.addClass( "kd-show-dialog-content-cover" );

                        return false;
                    } ).bind( "mouseup", function ()
                    {
                        if ( canResize && resizingObj )
                        {
                            canResize = false;

                            resizingObj.removeClass( "kd-show-dialog-content-cover" );

                            if ( typeof resizingObj.instanceOptions.resizeEnd === "function" )
                            {
                                resizingObj.instanceOptions.resizeEnd.call( resizingObj.instance, resizingObj );
                            }

                            resizingObj = void 0;
                            return false;
                        }
                    } ).bind( "mousemove", function ( e )
                    {
                        if ( canResize && resizingObj && typeof resizingObj.resizingStrategy === "function" )
                        {
                            resizingObj.css(
                                resizingObj.resizingStrategy( {
                                    obj: resizingObj,
                                    offset: resizingObj.offset(),
                                    mouseLeft: e.pageX,
                                    mouseTop: e.pageY
                                } )
                            );

                            if ( typeof resizingObj.instanceOptions.resize === "function" )
                            {
                                resizingObj.instanceOptions.resize.call( resizingObj.instance, resizingObj );
                            }

                            return false;
                        }
                    } );

                    // #endregion

                    // #region 对话框最大化控制

                    $body.delegate( ".js-kd-dialog-size:not(.maximize)", "click", function ()  // 最大化对话框
                    {
                        dialog.doMaximize( jq( this ) );
                    } ).delegate( ".js-kd-dialog-size.maximize", "click", function ()     // 还原对话框
                    {
                        dialog.doRevert( jq( this ) );
                    } ).delegate( ".kd-dialog-title-wrapper", "dblclick", function ()     // 双击标题栏最大化或最小化
                    {
                        jq( this ).siblings( ".kd-dialog-control" ).find( ".js-kd-dialog-size" ).trigger( "click" );
                    } );

                    // #endregion

                    // 支持按下 ESC 键关闭对话框
                    $body.bind( "keyup", function ( e, code )
                    {
                        if ( e.keyCode === 27 || code === 27 )
                        {
                            var tree = dialog._.stackTree;

                            if ( tree.length > 0 )
                            {
                                var dlg = tree[tree.length - 1].data( "dialog" );

                                if ( dlg.options.closeOnEscape )
                                {
                                    dlg.close();
                                }
                            }
                        }
                    } );

                    // 加入全局遮罩
                    dialog._.globalDialogCover.appendTo( $body );

                    // 关闭对话框
                    $body.delegate( ".js-kd-dialog-close", "click", function ()
                    {
                        var dlg = jq( this ).closest( ".kd-mimic-dialog" ).data( "dialog" );

                        if ( dlg )
                        {
                            dlg.close();
                        }
                    } );
                }

                // #region 默认选项

                dialog.defaultOptions = {              // 对象方式提供参数
                    url: "",        // 打开地址
                    content: "",    // 显示内容
                    round: false,   // 对话框是否圆角
                    title: "",      // 标题
                    size: {         // 对话框尺寸
                        width: "auto",
                        height: "auto"
                    },
                    position: {     // 对话框显示位置
                        left: "center",
                        top: "center"
                    },
                    //modal: true,      // 模式对话框 (使用透明遮罩背景内容)
                    modal: {            // 此选项与上方简写方式任选其一
                        use: true,      // 是否使用模式对话框
                        coverColor: "#000",        // 遮罩背景色 (默认)
                        coverOpacity: .1          // 遮罩透明度 (默认)
                    },
                    showBorderShadow: true,     // 显示边框阴影
                    showCloseButton: true,      // 右上角显示 [关闭对话框] 按钮
                    showMaximizedButton: true,  // 右上角显示 [最大化] 按钮
                    closeOnEscape: true,        // 按下 Esc 键关闭对话框

                    fullscreen: false,          // 是否全屏显示
                    showTitleBar: true,         // 是否显示标题栏

                    draggable: true,            // 支持拖放
                    resizable: true,            // 支持调整对话框尺寸

                    beforeClose: null,    // 关闭对话框之前执行的回调，函数返回 false 则不关闭对话框
                    close: null,          // 关闭对话框后执行的回调
                    create: null,         // 对话框创建完毕后执行的回调，this 代表当前对话框
                    show: null,           // 显示对话框时执行的回调
                    maximize: null,       // 最大化对话框时执行的回调
                    revert: null,         // 还原对话框时执行的回调
                    drag: null,           // 拖动对话框时执行的回调
                    dragEnd: null,        // 停止拖动对话框时执行的回调
                    resize: null,         // 正在调整对话框尺寸时执行的回调
                    resizeEnd: null       // 停止调整对话框尺寸时执行的回调
                };

                // #endregion

                /**
                 * 显示全局遮罩
                 */
                dialog.handleGlobalCover = function ()
                {
                    var tree = dialog._.stackTree,
                        len = tree.length;

                    $body.addClass( "overhide" );

                    if ( len > 0 )
                    {
                        var dlg = tree[len - 1].data( "dialog" ),
                            o = dlg.options,
                            css = {
                                "z-index": dlg.baseZIndex,
                                "display": "block",
                                "background-color": "#fff",
                                "opacity": 0
                            };

                        if ( o.modal.use )
                        {
                            css.backgroundColor = o.modal.coverColor;
                            css.opacity = o.modal.coverOpacity;
                        }

                        dialog._.globalDialogCover.css( css ).focus();
                    } else
                    {
                        $body.removeClass( "overhide" );
                        dialog._.globalDialogCover.hide();
                    }
                }

                /**
                 * 执行最大化对话框
                 * 
                 * @param element   最大化按钮
                 */
                dialog.doMaximize = function ( element )
                {
                    element.addClass( "maximize" ).closest( ".kd-mimic-dialog" ).data( "dialog" ).maximize();
                    $body.addClass( "overhide" );
                }

                /**
                 * 执行还原对话框
                 * 
                 * @param element   还原按钮
                 */
                dialog.doRevert = function ( element )
                {
                    element.removeClass( "maximize" ).closest( ".kd-mimic-dialog" ).data( "dialog" ).revert();
                    $body.removeClass( "overhide" );
                }

                var fn = dialog.prototype;

                /**
                 * 生成对话框 HTML
                 */
                fn.parse = function ()
                {
                    var round = this.options.round ? " kd-shadow-round" : "",
                        controlSize = ( ( this.options.showCloseButton ? 28 : 0 ) + ( this.options.showMaximizedButton ? 28 : 0 ) ),
                        url = jq.trim( this.options.url ),
                        z = this.baseZIndex,
                        dz = z + 1,
                        hz = dz + 2,
                        sz = ( this.options.round ? dz + 5 : dz + 1 ),
                        wz = dz + 4,
                        cz = wz + 1;

                    var html = '<div tab-index="-1" class="kd-mimic-dialog' +
                                                                ( this.options.draggable ? " kd-dialog-draggable" : "" ) +
                                                                ( this.options.showMaximizedButton ? " kd-dialog-maximizable" : "" ) +
                                                                ( this.options.resizable ? " kd-dialog-resizable" : "" ) +
                                                                '" style="z-index:' + dz + '">' +
                                    ( this.options.showBorderShadow ?
                                    '<div class="kd-dialog-shadow" style="z-index:' + sz + '">' +
                                        '<div class="kd-shadow-top-left' + round + '"></div>' +
                                        '<div class="kd-shadow-top"></div>' +
                                        '<div class="kd-shadow-top-right' + round + '"></div>' +
                                        '<div class="kd-shadow-left"></div>' +
                                        '<div class="kd-shadow-right"></div>' +
                                        '<div class="kd-shadow-bottom-left' + round + '"></div>' +
                                        '<div class="kd-shadow-bottom"></div>' +
                                        '<div class="kd-shadow-bottom-right' + round + '"></div>' +
                                    '</div>' : "" ) +
                                    ( this.options.resizable ?
                                    '<div class="kd-dialog-size-handler" style="z-index:' + hz + '">' +
                                        '<div class="kd-size-handler-top-left" data-direct="tl"></div>' +
                                        '<div class="kd-size-handler-top" data-direct="t"></div>' +
                                        '<div class="kd-size-handler-top-right" data-direct="tr"></div>' +
                                        '<div class="kd-size-handler-left" data-direct="l"></div>' +
                                        '<div class="kd-size-handler-right" data-direct="r"></div>' +
                                        '<div class="kd-size-handler-bottom-left" data-direct="bl"></div>' +
                                        '<div class="kd-size-handler-bottom" data-direct="b"></div>' +
                                        '<div class="kd-size-handler-bottom-right" data-direct="br"></div>' +
                                    '</div>' : "" ) +
                                    '<div class="kd-dialog-content-wrapper" style="z-index:' + wz + '">' +
                                        ( this.options.showTitleBar ?
                                        '<div class="kd-dialog-head">' +
                                            '<div class="kd-dialog-title-wrapper" style="right: ' + controlSize + 'px;z-index:' + cz + '">' +
                                                '<div class="kd-dialog-title">' + this.options.title + '</div>' +
                                            '</div>' +
                                            '<ul class="kd-dialog-control" style="z-index:' + cz + '">' +
                                                ( this.options.showCloseButton ? '<li class="js-kd-dialog-close"></li>' : '' ) +
                                                ( this.options.showMaximizedButton ? '<li class="js-kd-dialog-size"></li>' : '' ) +
                                            '</ul>' +
                                        '</div>' : '' ) +
                                        '<div class="kd-dialog-content">' +
                                            ( url ? '<iframe class="kd-frame-page" src="' + url + '" frameborder="0"></iframe>' : ( this.options.content instanceof jq ? this.options.content.html() : this.options.content ) ) +
                                        '</div>' +
                                        '<div class="kd-dialog-content-cover"></div>' +
                                    '</div>' +
                                '</div>';

                    dialog._.currIndex = z + 100;

                    return html;
                }

                /**
                 * 最大化对话框
                 */
                fn.maximize = function ()
                {
                    var i = this.instance.addClass( "kd-max-clear" );

                    i.prevPosInfo = { left: i.css( "left" ), right: "auto", top: i.css( "top" ), bottom: "auto", width: i.width(), height: i.height() };

                    i.css( { left: "-12px", right: "-12px", top: "-12px", bottom: "-12px", width: "auto", height: "auto" } );

                    if ( typeof this.options.maximize === "function" )
                    {
                        this.options.maximize.call( this, i );
                    }
                }

                /**
                 * 还原对话框
                 */
                fn.revert = function ()
                {
                    this.instance.removeClass( "kd-max-clear" ).css( this.instance.prevPosInfo );

                    if ( typeof this.options.revert === "function" )
                    {
                        this.options.revert.call( this, i );
                    }
                }

                /**
                 * 计算对话框适合的宽度及高度以及显示位置
                 * 
                 * @param c 相对页面
                 */
                fn.adjust = function ( c )
                {
                    this.setSize( c );
                    this.setPosition();
                }

                /**
                 * 转换整形
                 * 
                 * @param val 待转换的值
                 */
                var covertInt = function ( val )
                {
                    return parseInt( val ) || 0;
                }

                /**
                 * 计算内容尺寸
                 * 
                 * @param c             相对页面
                 * @param sizeName      指定尺寸名称 (取值: width/height)
                 * @param scrollName    指定滚动名称 (取值: scrollLeft/scrollTop)
                 */
                var figureContentSize = function ( c, sizeName, scollName )
                {
                    //var body = c.find( "body" ),
                    //    v = body[sizeName](),
                    //    tail = 0;

                    //if ( v === 0 )   // 若无法取得宽度，尝试从元素中获取
                    //{
                    //    body.children( ":visible" ).each( function ( i, e )
                    //    {
                    //        var me = jq( e ),
                    //            cv = covertInt( me[sizeName]() );

                    //        if ( me.css( "display" ) !== "inline" && v < cv )
                    //        {
                    //            if ( sizeName === "height" )
                    //            {
                    //                v += cv + covertInt( me.css( "margin-top" ) ) + covertInt( me.css( "margin-bottom" ) );
                    //            } else
                    //            {
                    //                v = cv + covertInt( me.css( "margin-left" ) ) + covertInt( me.css( "margin-right" ) );
                    //            }
                    //        }
                    //    } );
                    //}

                    //// 尝试获得最大宽度
                    //body.hide()[scollName]( 100000 );

                    //tail = body[scollName]();      // 获得滚动条尺寸

                    //body[scollName]( 0 ).show();

                    //return v + tail + 30;
                    return 0;
                }

                /**
                 * 设置对话框尺寸
                 * 
                 * @param c 相对页面
                 */
                fn.setSize = function ( c )
                {
                    var supply = 26,
                        isAutoWidth = this.options.size.width === "auto",
                        isAutoHeight = this.options.size.height === "auto",
                        w = ( isAutoWidth ? ( c ? figureContentSize( c, "width", "scrollLeft" ) : this.instance.width() ) : covertInt( this.options.size.width ) ) + supply,
                        h = ( isAutoHeight ? ( c ? figureContentSize( c, "height", "scrollTop" ) : this.instance.height() ) : covertInt( this.options.size.height ) ) + supply,
                        pw = $pWin.width() - supply,
                        ph = $pWin.height() - supply;

                    w = ( w === supply ? defaultDialogWidth : w );
                    h = ( h === supply ? defaultDialogHeight : h );

                    // 是否小于最小尺寸
                    w = ( w < minDialogWidth ? minDialogWidth : w );
                    h = ( h < minDialogHeight ? minDialogHeight : h );

                    // 是否大于页面尺寸
                    w = w > pw ? pw : w;
                    h = h > ph ? ph : h;

                    this.instance.width( w ).height( h );
                }

                /**
                 * 设置对话框显示位置
                 */
                fn.setPosition = function ()
                {
                    this.instance.css( {
                        left: ( $pWin.width() - this.instance.width() ) / 2,
                        top: ( $pWin.height() - this.instance.height() ) / 2
                    } );
                }

                /**
                 * 显示对话框
                 */
                fn.show = function ()
                {
                    var i = this.instance;

                    dialog.handleGlobalCover();

                    i.show();

                    if ( this.options.fullscreen )
                    {
                        Dialog.doMaximize( i.find( ".js-kd-dialog-size" ) );
                    }

                    if ( typeof this.options.show === "function" )
                    {
                        this.options.show.call( this, i );
                    }

                    return this;
                }

                /**
                 * 销毁对话框
                 * 
                 * @param instance 销毁指定对话框
                 */
                var destory = function ( instance )
                {
                    // 触发 beforeClose 事件
                    if ( typeof this.options.beforeClose === "function" && this.options.beforeClose.call( this, instance ) === false )
                    {
                        return false;
                    }

                    dialog.handleGlobalCover();

                    instance.find( "iframe" ).trigger( "unload" );

                    // 执行删除行为，默认为 remove，一般可以为 hide 或 remove
                    instance[this.options.closeBehavior || "remove"]();

                    // 触发 close 关闭完毕事件
                    if ( typeof this.options.close === "function" )
                    {
                        this.options.close.call();
                    }

                    return true;
                }

                /**
                 * 关闭对话框，
                 * 若关闭的不是顶层对话框，则将其后所有对话框均销毁
                 */
                fn.close = function ()
                {
                    var i = this.instance,
                        tree = dialog._.stackTree,
                        flag = true;

                    if ( !this.options.closeBehavior )
                    {
                        topDlg = tree.pop();

                        while ( i !== topDlg )
                        {
                            flag = destory.call( topDlg.data( "dialog" ), topDlg );

                            if ( flag === false )
                            {
                                break;
                            }

                            topDlg = tree.pop();
                        }
                    }

                    if ( flag )
                    {
                        destory.call( this, i );
                    }
                }

                dialog.init();

                return dialog;
            }() );
        }

        Hijacking.Dialog = Dialog;

        /**
         * 劫持 window.alert, window.open 函数，
         * 
         * 并使带有 xx-dialog 的元素成为对话框
         */
        void function ()
        {
            /**
             * 打开对话框
             * 
             * @param dialogArguments   模式对话框附加参数
             * @param args              对话框参数
             */
            function openDialog( dialogArguments, args )
            {
                var one = args[0],
                    isObj = jq.isPlainObject( one ),
                    options = null,
                    winOptions = {};

                if ( !isObj && Hijacking.isCrossDomain( one ) && useNativeOpenIfCrossDomain )
                {
                    return _.mockOpen( one, args[1] || "", args[2] || "", args[3] || "" );
                }

                if ( isObj )
                {
                    options = one;
                } else
                {
                    // 计算对话框选项
                    options = {
                        url: Hijacking.adaptPathToRoot( doc, one ),
                        content: ""
                    };

                    // 若参数超过2个，则第三个参数是对话框参数设置列表
                    if ( args.length > 2 )
                    {
                        jq.each( args[2].split( "," ), function ( i, e )
                        {
                            var kv = jq.trim( e ).split( /\s*\=\s*/ ),
                                key = jq.trim( kv[0] );

                            if ( key )
                            {
                                winOptions[key.toLowerCase()] = jq.trim( kv[1] );
                            }
                        } );
                    }

                    options.size = transSize(
                                                ( winOptions["width"] || ( winOptions["dialogwidth"] || "auto" ) ) +
                                                " " +
                                                ( winOptions["height"] || ( winOptions["dialogheight"] || "auto" ) )
                                            );

                    options.position = transPosition(
                                                        ( winOptions["left"] || ( winOptions["dialogleft"] || "center" ) ) +
                                                        " " +
                                                        ( winOptions["top"] || ( winOptions["dialogtop"] || "center" ) )
                                                    );

                    var resizableOption = ( winOptions["resizable"] || "yes" ).toLowerCase();
                    options.resizable = ( resizableOption === "yes" || resizableOption === "1" );

                    var fullOption = ( winOptions["fullscreen"] || "no" ).toLowerCase();
                    options.maximize = ( fullOption === "yes" || fullOption === "1" );

                    var titlebarOption = ( winOptions["titlebar"] || "yes" ).toLowerCase();
                    options.titlebar = ( titlebarOption === "yes" || titlebarOption === "1" );

                    options = jq.extend( {}, Dialog.defaultOptions, options, true );
                }

                options.dialogParent = win;     // 记录当前页面 window 对象

                if ( dialogArguments )      // 若有对话框参数
                {
                    options.dialogArguments = dialogArguments;
                }

                return new Dialog( options ).show();
            }

            // 弹出信息
            win.alert = function ()
            {
                var one = arguments[0],
                    o = {};

                if ( jq.isPlainObject( one ) )
                {
                    o = one;
                } else
                {
                    var content = jq( one );

                    jq.extend(
                        o,
                        Dialog.defaultOptions,
                        {
                            url: "",
                            content: content.length === 0 ? '<div class="custom-content"><div class="alert-content">' + one.replace( /\n/g, "<br />" ) + '</div><div class="alert-confirm"><a href="javascript: void 0" class="btn-ok js-kd-dialog-close">确定</a></div></div>' : one,
                            title: arguments[1] || "消息",
                            showMaximizedButton: false,
                            resizable: false,
                            size: { width: 360, height: 120 }
                        },
                        true
                    );
                }

                new Dialog( o ).show();
            };

            // 打开指定链接
            win.open = function ()
            {
                if ( arguments.length !== 0 && typeof arguments[0] === "string" && jq.trim( arguments[0] ).length === 0 )
                {
                    return;
                }

                if ( win.__modalDialogFlag )
                {
                    _.open( arguments[0], arguments[1], arguments[2], arguments[3] );
                } else
                {
                    openDialog( "", arguments );
                }
            };

            // 显示模态窗口 (仅IE)，使用 win.open 兼容之。
            //win.showModalDialog = function ()
            //{
            //    openDialog( arguments[1], arguments );
            //}

            // 显示非模态窗口 (仅IE)，使用 win.open 兼容之。
            //win.showModelessDialog = function ()
            //{
            //    openDialog( arguments[1], arguments );
            //}

            Hijacking.attach();

            readyCallback();
        }();
    }

    /**
     * 层级往上豪夺 Dialog 对象
     */
    Hijacking.captureDialog = function ()
    {
        var p = win.parent, d;

        do
        {
            if ( p.Hijacking )
            {
                d = p.Hijacking.Dialog;
                p = p.parent;
            } else
            {
                break;
            }
        } while ( !d );

        return d;
    }

    // 恢复所有被劫持的函数
    Hijacking.revert = function ()
    {
        win.alert = _.alert;
        win.open = _.open;
        win.showModalDialog = _.showModalDialog;
        win.showModelessDialog = _.showModelessDialog;
    }

    // 显示对话框
    Hijacking.showDialog = function ()
    {
        return win.open.apply( null, arguments );
    }

    /** 
     * 使指定父节点的所有对话框元素支持对话框
     * 
     * @param parent 指定父范围
     */
    Hijacking.attach = function ( parent )
    {
        parent = parent || "body";

        // 使带有 xx-dialog 的元素转为对话框，使用 $( selector ).data( "dialog" ); 可以读取对话框对象
        jq( parent + " [" + prefix + "-dialog]" ).hide().each( function ( i, e )
        {
            var me = jq( this ),
                options = buildDialogOptions( me ),
                event = me.attr( "data-event" ),
                targetSelector = me.attr( "data-target" );

            options.content = me.html();

            me.remove();

            options.closeBehavior = "hide";

            var dlg = new Hijacking.Dialog( options );

            if ( targetSelector )
            {
                jq( parent ).delegate( targetSelector, jq.trim( event ) || "immediateshow", function ()
                {
                    dlg.show();
                } ).triggerHandler( "immediateshow" );
            } else
            {
                dlg.show();
            }
        } );
    }

    /**
     * 判断指定地址是否跨域
     * 
     * @param url   指定地址
     */
    Hijacking.isCrossDomain = function ( url )
    {
        var result = false,
            urlDomain;

        if ( url && url.match( /^\w+\:\/\// ) )     // 若地址包含协议
        {
            urlDomain = url.match( /(?:\w+(?:\.\w+)+)/ );   // 获得url所在域

            if ( urlDomain )
            {
                result = urlDomain[0].indexOf( domain || pWin.document.domain ) === -1;
            }
        }

        return result;
    }

    /**
     * Hijacking 初始化完毕后执行回调
     * 
     * @param callback  初始化完毕执行的回调
     */
    Hijacking.ready = function ( callback )
    {
        typeof callback === "function" && ( readyCallback = callback );
    }

    /**
     * 计算相对于根的路径
     * 
     * @param doc   路径所在文档对象
     * @param url   计算的路径
     */
    Hijacking.adaptPathToRoot = function ( doc, url )
    {
        var loc = doc.location,
            url = url && jq ? jq.trim( url ) : url;

        if ( doc && loc && url &&
                    url.charAt( 0 ) !== '/' &&     // 若首字符为 '/' 则路径相对于根目录，忽略处理
                    url.match( /^\w+\:\/\// ) === null      // 若存在协议节点，则路径为绝对路径，忽略处理
        )
        {
            // 取出当前所在页面的路径除文件名部分，
            // 例如当前页面路径为：    /news/sports/w.html
            // 则下方匹配结果为：      /news/sports/
            var path = loc.pathname.match( /.*\// ) + "";

            // 将匹配结果与相对路径 url 拼接得到相对于根目录的最终路径
            // 并修正 file 协议因主机部分被忽略引起路径开始位置一个多余斜杠问题
            url = ( loc.protocol === "file:" ? path.substring( 1 ) : path ) + url;
        }

        return url;
    }

    /**
     * 重置当前 window 上下文相关对象
     * 
     * @param innerWindow       重置 opener 的窗口
     * @param dialogHosting     所在对话框
     * @param dialogArguments   模式窗口参数
     * @param dialogParent      对话框所在父窗口
     */
    Hijacking.reconnectWindowContext = function ( innerWindow, dialogHosting, dialogArguments, dialogParent )
    {
        if ( !innerWindow )
        {
            return;
        }

        if ( dialogArguments )
        {
            innerWindow.dialogArguments = dialogArguments;
        }

        if ( dialogHosting )
        {
            innerWindow.dialogHosting = dialogHosting;
            innerWindow.opener = dialogParent;
        }

        innerWindow.parentCache = dialogParent;
    }

    /**
     * 应用注入
     * 
     * @param dialogHosting     注入对话框对象 (若有)
     * @param dialogArguments   注入对话框参数 (若有) 
     * @param dialogParent      对话框所在父窗口
     */
    Hijacking.applyInject = function ( dialogHosting, dialogArguments, dialogParent )
    {
        Hijacking.reconnectWindowContext( this.contentWindow, dialogHosting, dialogArguments, dialogParent );

        loadScript( this.contentWindow.document, Hijacking.adaptPathToRoot( pWin.document, hijackingPath ), noop );
    }

    /**
     * 注入劫持脚本到指定的 iframe 对象
     * 
     * @param iframes           被注入的 iframe
     * @param dialogHosting     注入对话框对象 (若有)
     * @param dialogArguments   注入对话框参数 (若有)
     * @param dialogParent      对话框所在父窗口
     */
    Hijacking.injectFrames = function ( iframes, dialogHosting, dialogArguments, dialogParent )
    {
        iframes.each( function ()   // 向当前页面所有 iframe 注入对话框信息
        {
            if ( this.contentWindow.location.href !== "about:blank" )   // 忽略空白页
            {
                Hijacking.applyInject.call( this, dialogHosting, dialogArguments, dialogParent );
            }
        } );

        iframes.bind( "load", function ()   // 当页面加载完毕 (主要为防止被鼠标右键->刷新页面) 时，重新注入
        {
            // 对话框中 iframe 的页面卸载后，主动触发 beforeunload 事件
            jq( this.contentWindow )
                .focus()
                .bind( "unload", function ()
                {
                    jq( this ).trigger( "beforeunload" );
                } );

            var $body = jq( "body" );

            jq( this.contentWindow.document ).on( "keyup", function ( e )
            {
                $body.trigger( "keyup", [e.keyCode] );
            } );

            Hijacking.applyInject.call( this, dialogHosting, dialogArguments, dialogParent );
        } ).bind( "unload", function ()
        {
            // 对话框中的 iframe 卸载后，主动触发 unload 事件，
            // 由于在 load 事件中已绑定卸载时触发 beforeunload，因此其将间接触发 beforeunload (参看上方对 load 的绑定)
            // 这个事件将由对话框的 close() 方法中的代码进行主动触发，因为移除对话框时，iframe 不会自动触发 unload 事件
            jq( this.contentWindow ).trigger( "unload" );
        } );
    }

    // 检查是否已启动，用于修复 IE8- 若调用 loadScript 将触发两次启动
    Hijacking.hasStartup = false;

    /**
     * 开始执行
     */
    Hijacking.startup = function ()
    {
        if ( win.jQuery && !Hijacking.hasStartup )
        {
            Hijacking.hasStartup = true;

            jQuery( function ()
            {
                Hijacking.injectFrames( jQuery( "iframe" ) );
                Hijacking();
            } );
        }
    }

    /**
     * 检查 jQuery 版本是否适用，不适用返回 false
     */
    Hijacking.checkJQueryVerion = function ()
    {
        var v1 = requireJQueryMinVersion.split( "." ),
            v2 = jq( doc ).jquery.split( "." ),
            i, len, pv1, pv2;

        for ( i = 0, len = v1.length; i < len; i++ )
        {
            pv1 = parseInt( v1[i] );
            pv2 = parseInt( v2[i] );

            pv1 = isNaN( pv1 ) ? 0 : pv1;
            pv2 = isNaN( pv2 ) ? 0 : pv2;

            if ( pv2 < pv1 )    // 若版本小于指定 jQuery 版本
            {
                return false;
            }
        }

        return true;
    }

    // 若未发现 jQuery 或版本过低，加载较新的版本
    if ( !$ || !Hijacking.checkJQueryVerion() )
    {
        loadScript( doc, Hijacking.adaptPathToRoot( pWin.document, jQueryPath ), function ()
        {
            Hijacking.startup();
        } );
    } else
    {
        Hijacking.startup();
    }

} )( window.Hijacking, window, document, window.jQuery );