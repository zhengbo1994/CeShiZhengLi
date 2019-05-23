// problem:
//      1. 在拖动时，若总尺寸小于（最小尺寸*2）则放弃拖动。
//      2. 删除一个布局时的处理。
//      2.1 Tab 布局中的 BUG
//      2.2 在分割条上添加按钮
//      3. 输出布局信息（HTML即可）
//      4. 内容块
//          4.1 编辑
//          4.2 加载内容块
//          4.3 拖拽内容块到布局中，支持调整
//      5. 布局
//          编辑局部、自定义布局（拖拽）、布局模板（多几种）
//      7. 布局执行完毕后才显示。

/*
* Sapi Layout Plugin.
*
* by mwc @2010-6 for platform
*
*/

// [布局样式及布局属性]
// 使用样式来标记布局的类型，以及标记为布局内容块元素。
// --------------------------------------------------------
// layout-horizontal
// 横向列布局样式
//
// layout-vertical
// 纵向行布局样式
//
// layout-tab
// 标签页布局样式
//
// layout-element
// 标记元素为一个内容块的布局样式，用于添加到上述3个布局样式中说明是内容块。
//
// layout-size
// 元素的布局属性，指明布局尺寸。在横向列布局时表示列宽，在纵向行布局时表示行高。




// [Usage]
// --------------------------------------------------------
// 1、基本
//
// >> 例子： 两列布局
//
// >> HTML
//
// <div class="wrap layout-horizontal">
//      <div>第一列</div>
//      <div>第二列</div>
// </div>
//
// >> JavaScript
//
// $( "wrap" ).layout();


// 2、内联默认宽度
//      使用 layout-size 自定义属性给出，没有指定 layout-size 的元素将设置为平均宽度。仅应用到 layout-horizontal （横向列布局有效）。
// 
// <div class="layout-horizontal">
//      <div layout-size="200">第一列</div>
//      <div>第二列</div>
// </div>

// 3、内联默认高度
//      使用 layout-size 自定义属性给出，没有指定 layout-size 的元素将设置为平均高度。仅应用到 layout-vertical （纵向行布局有效）。
//
// <div class="layout-vertical">
//      <div layout-size="200">第一列</div>
//      <div>第二列</div>
// </div>

// 4、Tab 布局例子
//      默认使用 dl 作为 Tab 容器，可以通过选项配置为其他任意块元素。必须要为 dt 设置高度。
//
// <dl class="layout-tab">
//      <dt>
//          <a href="javascript:void(0)">标签1</a>
//          <a href="javascript:void(0)">标签2</a>
//          <a href="javascript:void(0)">标签3</a>
//      </dt>
//      <dd class="layout-element">标签1 对应的面板</dd>
//      <dd class="layout-element">标签2 对应的面板</dd>
//      <dd class="layout-element">标签3 对应的面板</dd>
// </dl>

// 5、设置分割器的样式
//      分割器是指两个布局之间的间隙，鼠标移动到此处可以拖动调整间隙两边的布局的尺寸。
//      分割器样式类名： .layout-splitter，默认使用分割器所在元素容器的背景颜色

; ( function ($)

//$( function ()
{
    // 横向布局
    function doLayoutHorizontal()
    {
        doLayoutGrid.apply( this, [0] );
    }

    // 纵向布局
    function doLayoutVertical()
    {
        doLayoutGrid.apply( this, [1] );
    }

    // 执行尺寸调整
    function doResizeBar( elements, splitters, direct, event, o )
    {
        var helper = o.helper,
            ae = helper.data( "associateElement" ),     // 获得关联的元素
            hor = ( direct == 0 ),      // 是否横向分隔
            funcFlag = ( hor ? "width" : "height" ),    // 获得需要设置的属性，横向设置 width，纵向设置 height
            e = ae.prev,    // 分隔条两边的第一个元素，横向分隔时指的是分隔条左边的元素，纵向分隔时指的是上边的元素。
            next = ae.next, // 分隔条两边的第二个元素，横向分隔时指的是分隔条右边的元素，纵向分隔时指的是下边的元素。
            options = this.layoutOptions,
            totalSize = ( e[funcFlag]() + next[funcFlag]() );   // 计算分隔条两边元素之间的尺寸总和，横向分隔时是宽度总和，纵向分隔时是高度总和
        //minSize = this.layoutOptions.minSize * 2;

        if ( elements && elements.length )  //&& totalSize > minSize )
        {
            var ap = helper.data( "associateSplitter" ),    // 得到关联的分隔条，当前分隔条两边的分隔条
                coorFlag = ( hor ? "left" : "top" ),
                diff = ( o.position[coorFlag] - o.originalPosition[coorFlag] ),     // 计算分隔条拖动后，当前位置与源位置之间的差
                eSize = e[funcFlag]() + diff,   // 重新计算第一个元素的尺寸
                nSize = totalSize - eSize;      // 重新计算第二个元素的尺寸

            e.attr( "layout-size", eSize )[funcFlag]( eSize );      // 重置第一个元素尺寸
            next.attr( "layout-size", nSize )[funcFlag]( nSize )    // 重置第二个元素的尺寸
                .css( coorFlag, o.position[coorFlag] + options.splitter.size );     // 并改变第二个元素的坐标位置
  
            if ( ap.prev )
            {
                ap.prev.draggable( "option", "containment" )[hor ? 2 : 3] += diff;      // 重新设置当前分隔条的前一个分隔条可以拖动的范围（若有的话）
            }

            if ( ap.next )
            {
                ap.next.draggable( "option", "containment" )[hor ? 0 : 1] += diff;      // 重新设置当前分隔条的后一个分隔条可以拖动的范围（若有的话）
            }

            e.layoutOptions = next.layoutOptions = options;

            doLayout.apply( e );    // 第一个元素的子内容重新布局
            doLayout.apply( next ); // 第二个元素的子内容重新布局
        }
    }

    // 创建 resizeBar, direct: 0-横向，1-纵向
    function buildResizeBar( elements, len, direct )
    {
        var options = this.layoutOptions,
            buildOption = options.splitter.build,
            splitters = null,
            splitterEvent = options.splitter.event,
            SPLITTER_FORMAT = '<div class="layout-splitter"></div>';

        if ( buildOption == "none" ||
                ( 
                    buildOption != "both" &&
                    ( 
                        ( buildOption == "horizental" && direct != 0 ) ||
                        ( buildOption == "vertical" && direct != 1 )
                    )
                )
        )     // 不生成分隔条
        {
            return null;
        }

        if ( options.mode == "layout" && options.splitter.size > 0 )     // 布局模式生成 resizeBar
        {
            splitters = this.children( ".layout-splitter" );

            if ( splitters.length == 0 )
            {
                splitters = $( new Array( len ).join( SPLITTER_FORMAT ) );      // 生成 len - 1 个分隔条

                splitters.css( {
                    display: "block",
                    position: "absolute",
                    cursor: "url(" + [options.splitter.horizontalImage, options.splitter.verticalImage][direct] + "), " + ["w-resize", "n-resize"][direct]
                } ).appendTo( this );

                splitters.each( function ( i, e )
                {
                    $( e ).attr( "e-index", i );
                } ).draggable( {      // 调整 resize bar 的位置来确定调整布局
                    axis: ["x", "y"][direct],
                    opacity: 0.5,
                    drag: function ( event, o ) 
                    {
                        if ( splitterEvent == "drag" )
                        {
                            this.layoutOptions = options;
                            doResizeBar.apply( this, [elements, splitters, direct, event, o] );
                        }
                    },
                    stop: function ( event, o )
                    {
                        if ( splitterEvent == "stop" )
                        {
                            this.layoutOptions = options;
                            doResizeBar.apply( this, [elements, splitters, direct, event, o] );
                        }
                    }
                });

                if (!options.splitter.drag)
                {
                    splitters.draggable("disable");
                }
            }

            if ( direct )
                splitters.height( options.splitter.size ).width( this.width() );
            else
                splitters.height( this.height() ).width( options.splitter.size );
        }

        return splitters;
    }

    // 创建格状布局
    function doLayoutGrid( direct )
    {
        var elements = getSubLayout.apply( this ),
            len = elements.length;

        this.css( "position", this.data( "container" ) ? "relative" : "absolute" );

        if ( len )
        {
            var pSize = ( direct ? this.height() : this.width() ),  // 元素总尺寸
                paddingLeft = parseInt( this.css( "padding-left" ) ),
                increment = paddingLeft,
                knownSizeElements = elements.filter( "[layout-size]" ),
                knownSize = 0,
                avgLen = elements.length - knownSizeElements.length,   // 使用平均值的元素的个数
                options = this.layoutOptions,
                splitterSize = options.splitter.size,
                layoutMode = options.mode,
                showDelBtn = options.deleteLayoutButton.show,
                gaps = ( len - 1 ) * splitterSize,   // 所有间隙占用的宽度
                splitters = null;

            knownSizeElements.each( function ( i, e )      // 计算已指定 layout-size 元素的总和
            {
                var me = $( e ),
                    size = me.attr( "layout-size" ),
                    actualSize = 0;

                actualSize = parseInt( 
                                        ( size.indexOf( "%" ) != -1 ) ?
                                            ( pSize * ( parseFloat( size ) / 100.0 ) ) :
                                            size
                );

                me.data( "layout-actual-size", actualSize );

                knownSize += actualSize;
            } );

            var s = pSize - gaps - knownSize;  // 元素总宽度（不包括间隙及 layout-size 指定的宽度）
            var avg = ( avgLen == 0 ? 0 : parseInt( s / avgLen ) );   // 元素平均宽度

            if ( direct )   // 自动尺寸
                elements.width( this.width() - paddingLeft );
            else
                elements.height( this.height() );

            splitters = buildResizeBar.apply( this, [elements, len, direct] );

            elements                        // 所有元素
                .css({ display: "block", position: "absolute" })  // 并且设置绝对定位。
                .each(function (i, e)        // 每个元素 \
                {
                    var me = $(e),
                        size = me.data("layout-actual-size"),
                        layoutSize = 0;

                    me.layoutOptions = options;
                    me.css(direct ? { top: increment } : { left: increment });  // 设置定位左边坐标

                    layoutSize = (i + 1 == len) ? (pSize - increment) : (size ? size : avg);

                    if (direct)
                        me.height(layoutSize);
                    else
                        me.width(layoutSize);

                    increment += layoutSize;      // 计算下一个元素的左边位置

                    if (layoutMode == "layout")
                    {
                        if (splitters)    // 定位 resizeBar
                        {
                            splitters.eq(i).css(direct ? { top: increment } : { left: increment });
                        }

                        if (showDelBtn)
                        {
                            //todo: 在分割条上添加按钮
                        }
                    }

                    increment += splitterSize;

                    doLayout.apply(me);   // 开始执行当前元素的子元素的布局（递归）

                }).each(function (i, e)
                {
                    var me = $(e),
                        pos = me.offset(),
                        minSize = options.minSize;

                    if (layoutMode == "layout" && splitters)
                    {
                        var sp = splitters.eq(i);

                        // 计算可以拖动的范围
                        sp.draggable("option", "containment", (
                                        direct ?
                                            [0, pos.top + minSize, 0, pos.top + me.height() + me.next(elements).height() - minSize] :
                                            [pos.left + minSize, 0, pos.left + me.width() + me.next(elements).width() - minSize, 0]
                        ));

                        // 设置关联的元素
                        sp.data("associateElement", {
                            prev: elements.eq(i),
                            next: elements.eq(i + 1)
                        });

                        // 设置关联的分隔条
                        sp.data("associateSplitter", {
                            prev: i ? splitters.eq(i - 1) : null,
                            next: i == splitters.length - 1 ? null : splitters.eq(i + 1)
                        });
                    }
                });
        }
    }

    // 获得子布局元素
    function getSubLayout()
    {
        return this.children( ":not(.layout-splitter)" );
    }

    function setLayoutTabCss( obj )
    {
        if ( obj && obj instanceof $ )
        {
            obj.css( {
                "white-space": "nowrap"
            } );
        }
    }

    // 标签页
    function doLayoutTab()
    {
        var options = this.layoutOptions,
            o = options.tab,
            labelSelector = o.label + ":not(.layout-tab-label-func)",
            tabs = this,
            initialized = tabs.data( "initialized" ),
            labels = tabs.find( labelSelector ),
            panels = tabs.children( o.panel ).hide(),
            tabTag = labels[0].tagName.toLowerCase(),
            panelTag = panels[0].tagName.toLowerCase(),
            events = labels.data( "events" ),
            wrap = labels.parent(),
            panelWrap = panels.parent();

        panels.css( "position", "absolute" )
            .width( "100%" )
            .height( tabs.height() - wrap.height() )
            .each( function ( i, e )
            {
                var me = $( this );
                me.layoutOptions = options;
                doLayout.apply( me );
            } );

        if ( !events )
        {
            wrap.on( "click", labelSelector, function ()   // 生成标签页单击事件
            {
                var me = $( this );

                tabs.find( labelSelector ).removeClass( o.selected );
                me.addClass( o.selected );

                var index = tabs.find( labelSelector ).index( this );
                tabs.attr( "sel-index", index ).data( "selectedIndex", index );

                tabs.children( o.panel ).hide().eq( index ).show();
            } );
        };

        labels.eq( tabs.data( "selectedIndex" ) || tabs.attr( "sel-index" ) || o.selectedIndex ).trigger( "click" );

        if ( !initialized )
        {
            tabs.data( "initialized", true );
            labels.addClass( "layout-tab-label" ).wrapInner( '<label style="cursor: pointer" class="layout-tab-label-text" />' );
            setLayoutTabCss( labels );
            panels.addClass( "layout-tab-panel" );
        }

        if ( !initialized && ( options.mode == "layout" || options.mode == "edit" ) )
        {
            // 拖动标签页改变位置
            tabs.sortable( {
                axis: "x",
                dropOnEmpty: false,
                items: labelSelector,
                opacity: 0.5,
                tolerance: "pointer",
                start: function ( e, o )
                {
                    o.helper.trigger( "click" );
                    this.srcindex = o.helper.index( labelSelector );
                },
                update: function ( e, o )
                {
                    var ps = tabs.children( options.tab.panel ),
                        descindex = o.item.index( labelSelector ),
                        src = ps.eq( this.srcindex ),
                        desc = ps.eq( descindex );

                    src[this.srcindex < descindex ? "insertAfter" : "insertBefore"]( desc );
                }
            } );

            // 删除标签 ------------------------------------------
            var delBtn = $( '<a class="layout-tab-label-del" href="javascript:void(0)"></a>' );

            delBtn.css( {
                "float": "none",
                "display": "inline",
                "margin": 0,
                "padding": 0,
                "margin-left": "5px",
                "line-height": wrap.height() + "px"
            } );

            if ( o.del )
            {
                delBtn.addClass( o.del );
            }

            if ( o.delText )
            {
                delBtn.html( o.delText );
            }

            if ( o.delPromptText )
            {
                delBtn.attr( { "title": o.delPromptText, "alt": o.delPromptText } );
            }

            tabs.find( labelSelector ).append( delBtn );

            wrap.on( "deltab click", ".layout-tab-label-del", function ()
            {
                var me = $( this ),
                    tab = me.closest( ".layout-tab-label" ),
                    index = tab.index( ".layout-tab-label" );

                if ( tab.hasClass( o.selected ) )
                {
                    var next = tab.next( ".layout-tab-label" );

                    if ( next.length )
                        next.trigger( "click" );
                    else
                        tab.prev( ".layout-tab-label" ).trigger( "click" );
                }

                tabs.children( o.panel ).eq( index ).remove();
                tab.remove();

                if ( tabs.find( labelSelector ).length == 0 )
                {
                    //var tp = tabs.parent();
                    //tabs.remove();
                    //doLayout.apply( tp );
                }

                return false;
            } );

            // 增加标签 ------------------------------------------
            if ( !wrap.find( ".layout-tab-label-add" ).length )
            {
                // 增加【增加标签】按钮
                var addBtn = $( "<" + tabTag + "/>" );

                if ( tabTag == "a" )
                {
                    addBtn.attr( "href", "javascript:void(0)" );
                }

                if ( o.addText )
                {
                    addBtn.html( o.addText );
                }

                if ( o.addPromptText )
                {
                    addBtn.attr( { "title": o.addPromptText, "alt": o.addPromptText } );
                }

                addBtn.addClass( "layout-tab-label-add layout-tab-label-func" );

                if ( o.add )
                {
                    addBtn.addClass( o.add );
                }

                // 点击【增加标签】按钮后，添加新的标签及该标签对应的面板
                addBtn.on( "click", function ()
                {
                    // 添加新标签页 ---------------------------------
                    var newTab = $( "<" + tabTag + "/>" ),
                        tabText = o.newTabText;

                    if ( tabTag == "a" )
                    {
                        newTab.attr( "href", "javascript:void(0)" );
                    }

                    newTab.addClass( "layout-tab-label" );
                    setLayoutTabCss( newTab );

                    addBtn.before( newTab );

                    if ( tabText )
                    {
                        newTab.html( '<label style="cursor: pointer" class="layout-tab-label-text">' + tabText.replace( /\{0\}/g, tabs.find( labelSelector ).length ) + '</label>' );
                    }

                    newTab.append( delBtn.clone() );

                    // 添加新面板 ---------------------------------
                    var newPanel = $( "<" + panelTag + "/>" );

                    newPanel.css( "position", "absolute" )
                            .width( "100%" )
                            .height( tabs.height() - wrap.height() )
                            .addClass( "layout-tab-panel" )
                            .appendTo( panelWrap );

                    // 自动选中新标签，并且触发编辑标签页
                    newTab.trigger( "click" ).trigger( "dblclick" );
                } );

                addBtn.appendTo( wrap );
            }


            // 标签页改变名称 ------------------------------------------
            if ( !labels.find( ".layout-tab-label-input" ).length )
            {
                var hiddenInput = $( '<input type="text" class="layout-tab-label-input layout-tab-label-func" style="position: absolute; display: none; border: 0" />' );

                if ( o.input )
                {
                    hiddenInput.addClass( o.input );
                }

                hiddenInput.on( "blur", function ()
                {
                    if ( hiddenInput.val() && hiddenInput.currentLabel && hiddenInput.currentLabel.length )
                    {
                        hiddenInput.currentLabel.find( ".layout-tab-label-text" ).text( hiddenInput.val() );
                    }

                    hiddenInput.hide();
                } ).on( "keyup", function ( e )
                {
                    if ( e.keyCode == 13 )
                        hiddenInput.trigger( "blur" );
                } );

                hiddenInput.appendTo( wrap );

                wrap.on( "dblclick", labelSelector, function ()
                {
                    var me = $( this ),
                        pos = me.position();

                    hiddenInput.currentLabel = me;

                    hiddenInput.val( me.find( ".layout-tab-label-text" ).text() ).css( {
                        "left": pos.left,
                        "top": pos.top,
                        "width": me.width(),
                        "height": me.height(),
                        "line-height": me.height() + "px",
                        "padding-left": me.css( "padding-left" ),
                        "padding-top": me.css( "padding-top" ),
                        "padding-bottom": me.css( "padding-bottom" ),
                        "padding-right": me.css( "padding-right" ),
                        "margin-left": me.css( "margin-left" ),
                        "margin-top": me.css( "margin-top" ),
                        "margin-bottom": me.css( "margin-bottom" ),
                        "margin-right": me.css( "margin-right" )
                    } ).show()[0].select();
                } );
            }
        }
    }

    // 内容块元素布局
    function doLayoutElement()
    {
        var child = getSubLayout.apply( this ),
            options = this.layoutOptions;

        child.width( this.width() )
            .height( this.height() )
            .each( function ( i, e )
            {
                var me = $( this );
                me.layoutOptions = options;
                doLayout.apply( me );
            } );
    }

    // 从 class 得到布局类型
    function guessLayoutType()
    {
        for ( var layout in $.layoutType )
        {
            if ( this.hasClass( "layout-" + layout ) )
                return layout;
        }
    }

    // 执行布局
    function doLayout( type )
    {
        var flag = $.layoutGlobalHelper.flag;

        if ( this.hasClass( flag ) && this.parents( "." + flag ).length && !this.layoutOptions.adjustInnerLayout )
        {
            this.trigger( "layouting" );
            return;
        }

        if ( type )     // 通过代码形式创建布局
        {
            this.addClass( "layout-" + type );      // 自动添加布局内容的样式到标记（可能设置统一的样式表时用到）
        }
        
        $.layoutType[
            type ||     // 代码形式直接给出 type
            guessLayoutType.apply( this ) ||    // 根据标记的 class 获得布局类型
            "defaultType"       // 如果都没有找到合适的布局类型，则不作任何处理
        ].apply( this );
    }

    $.extend( {
        layoutType: {   // 布局类型
            defaultType: $.noop,
            element: doLayoutElement,   // 元素布局
            horizontal: doLayoutHorizontal,     // 横向
            vertical: doLayoutVertical,         // 纵向
            tab: doLayoutTab                    // 标签页
        },

        layoutOptions: {  // 全局选项
            mode: "view",        // 模式，可选模式： view(只读视图，默认), edit(移动、编辑内容块模式), layout(布局模式，拖动调整布局尺寸和删除布局)      (string)
            deleteLayoutButton: {
                show: true,      // 是否显示删除按钮（仅布局模式下有效）
                image: "content/image/delete.png"       // 删除按钮的图片
            },
            type: null,     // 当前元素布局类型，默认: 无（通过样式表指定）；所有类型参看 $.layoutType。(string),
            minSize: 50,        // 最小尺寸        (number)
            splitter: {      // 分割器
                size: 10,        // 尺寸 ( number, px )
                build: "both",      // 生成分隔条，none-不生成分隔条；horizontal-仅横向分隔条；vertical-仅纵向分隔条；both-两者均生成（默认）
                event: "stop",  // 拖动停止时开始改变两边布局尺寸, drag=跟随分隔条调整（当前不支持，尚待完善）；stop=分隔条停止后才开始调整，默认stop      (string)
                drag: true,     // 是否拖动
                button: "",     // 分隔器按钮样式
                horizontalImage: "move_h.cur",      // 横向分隔调整图标，不可用时使用 w-reisze     (string)
                verticalImage: "move_v.cur"       // 纵向分隔调整图标，不可用时使用 n-resize       (string)
            },
            adjustResize: true,     // 自动适应尺寸调整      (boolean)
            adjustInnerLayout: true,    // 调整布局时是否自动调整内嵌布局      (boolean)
            tab: {          // tab 标签页设置
                direct: "top",         // 标签方向（当前不支持）       (string)
                label: "dt > a",    // 标签页选择器                   (string)
                panel: "dd",        // 标签对应面板选择器            (string)
                selected: "sel",    // 标签选中的选择器             (string)
                selectedIndex: 0,    // 默认标签页(从0开始)          (number)
                input: "",  // 更改标签名称的输入框样式         (string)
                add: "",      // 【添加新标签】按钮的默认样式             (string)
                addText: "<strong style='font-size: 16px; color: #0099FF;'>+</strong>",  // 【添加新标签】按钮的默认文本             (string)
                addPromptText: "添加新标签",     // 【添加新标签】按钮的提示文本             (string)
                del: "",    // 【删除标签】按钮样式       (string)
                delText: "×",       // 【删除标签】按钮的默认文本             (string)
                delPromptText: "删除此标签",     // 【删除标签】按钮的提示文本             (string)
                newTabText: "新标签{0}"   // 新添加的标签的默认文本             (string)
            }
        },

        layoutGlobalHelper: {       // 全局助手
            flag: "JQUERY-SAPI-LAYOUT-PLUGIN-INSTANCE",
            resizeCounter: 0
        }
    } );

    // data - 布局数据 (Json)
    $.fn.layout = function ( options, data )
    {
        var o = {};
        $.extend( true, o, $.layoutOptions, options || {} );

        this.data( "resizing", false );      // 是否正在处理尺寸

        // 开始加载布局
        function loadLayout()
        {
            doLayout.apply( 
                this.data( "container", true ).addClass( $.layoutGlobalHelper.flag ),
                [o.type]
            );
        }

        // 获取布局信息
        this.getLayout = function ()
        {
            //todo:
        }

        // 从指定数据中加载布局
        //        if ( data && $.isPlainObject( data ) )
        //        {
        //            deserialize( data );
        //        }

        return this.each( function ( i, e )
        {
            var me = $( e );

            me.layoutOptions = o;
            loadLayout.apply( me );

            me.on( "layouting", function ()
            {
                var me = $( e );

                if ( !me.data( "resizing" ) )
                {
                    me.data( "resizing", true );
                    me.layoutOptions = o;
                    loadLayout.apply( me );
                    me.data( "resizing", false );
                }
            } );

            if ( o.adjustResize )     // 调整尺寸时自动适应
            {
                $( window ).resize( function ()
                {
                    me.trigger( "layouting" );
                } );
            }
        } );
    }

//} );

} )( jQuery );