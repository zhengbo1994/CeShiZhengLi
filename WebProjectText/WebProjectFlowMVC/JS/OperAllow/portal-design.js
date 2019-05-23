
(function ($)
{
    //$.fn.extend( {
    //    droppablex: function ( o )
    //    {
    //        this.live( "mouseenter", function ()
    //        {
    //            if ( !$( this ).data( "init" ) )
    //            {
    //                $( this ).data( "init", true ).droppable( o );
    //            }
    //        } );

    //        return $();
    //    },
    //    splitter: function (o)
    //    {
    //        return this.each( function ( i, e )
    //        {
    //            var me = $( e ),
    //                split = null,
    //                p = me.closest( ".layout-table" );

    //            if ( !e.nextSibling )
    //                return;

    //            if ( p.length )
    //            {
    //                if ( !me.data( "hasSplitter" ) )     // 为当前布局创建分割条
    //                {
    //                    split = o.splitter.clone( true, true );

    //                    if ( p.hasClass( "hor" ) )
    //                    {
    //                        // 创建横向列分割条
    //                        split.addClass( "hor" );
    //                    } else if ( p.hasClass( "ver" ) )
    //                    {
    //                        // 创建纵向行分割条
    //                        split.addClass( "ver" );
    //                    } else
    //                    {
    //                        return;
    //                    }

    //                    split.data( "panel", me );
    //                    me.data( "hasSplitter", true );
    //                    me.data( "Splitter", split );

    //                    split.appendTo( o.container );

    //                } else
    //                {
    //                    split = me.data( "Splitter" );
    //                }

    //                if ( split )
    //                {
    //                    // 设置高度\宽度\位置
    //                    if ( split.hasClass( "hor" ) )
    //                    {
    //                        split.height( me.height() - 10 ).position( {
    //                            of: me,
    //                            offset: "-5 5",
    //                            my: "left top",
    //                            at: "right top"
    //                        } );

    //                    } else
    //                    {
    //                        split.width( me.width() - 10 ).position( {
    //                            of: me,
    //                            offset: "5 -5",
    //                            my: "left top",
    //                            at: "left bottom"
    //                        } );
    //                    }

    //                    var btns = split.children( ".buttons" );

    //                    split.draggable( {
    //                        axis: "x",
    //                        opacity: 0.5,
    //                        drag: function ( event, o )
    //                        {
    //                            btns.addClass( "buttons-dragging" );
    //                        },
    //                        stop: function ( event, o )
    //                        {
    //                            btns.removeClass( "buttons-dragging" );
    //                        }
    //                    } );

    //                    split.show();
    //                }
    //            }
    //        } );
    //    }
        //,
        //ruler: function ( o )
        //{
        //    var rb = $( ".ruler-box" );

        //    if ( rb.size() < 1 )
        //    {
        //        rb = $( '<div class="ruler-box" style="height: 0; overflow: hidden;">' +
        //                    '<div class="ruler" style="height: 18px; border: 1px solid #000; background-color: #fff;">' +
        //                        '<div style="height: 3px;" class="small-scale-line">| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |</div>' +
        //                        '<div style="height: 5px;" class="scale-line">| | | | | | | | | | |</div>' +
        //                        '<div style="" class="scale">0 10 20 30 40 50 60 70 80 90</div>' +
        //                        '<span style="position: absolute;">%</span>' +
        //                    '</div>' +
        //                '</div>' );

        //        rb.appendTo( $( "body" ) );
        //    }

        //    var r = rb.children( ".ruler" );

        //    var obj = this;

        //    this.hide = function ()
        //    {
        //        r.hide();
        //    }

        //    this.follow = function ()
        //    {
        //        return obj.each( function ()
        //        {
        //            var me = $( this );

        //            r.width( me.width() - 12 ).position( {
        //                of: me,
        //                my: "left top",
        //                at: "left bottom",
        //                offset: "5 -5",
        //                collision: "none none"
        //            } ).show();
        //        } );
        //    }

        //    return this.follow();
        //}
//    } );
//}(jQuery));

$(function ()
{
    // 步骤管理器
    function StepManager( steps )
    {
        var stepCollection = steps || [];

        this.addStep = function ( stepCallback )
        {
            if ( $.isFunction( stepCallback ) )
            {
                stepCollection.push( stepCallback );
            }
        };

        this.execute = function ()
        {
            for ( var i in stepCollection )
            {
                stepCollection[i]();
            }
        }
    }

    var win = $( window ),
        body = $( "body" ),
        review_panel = $( ".design-box > .review-panel" ),
        design_panel = $( ".design-box > .design-panel" ),
        loading_box = $( ".design-element > .loading-box" ),
        big_loading_box = $( ".design-element > .big-loading-box" ),
        operat_buttons = $( ".design-load-layout-from, .design-undo, .design-redo, .design-clean" ),
        design_control = $( ".design-panel-control" ),
        design_panel_inner = $( ".design-panel-inner" ),
        design_canvas = $( ".design-panel-inner .design-canvas" ),
        contents = $( ".design-control-layout-contents li" ),
        loadStep = new StepManager(),     // 装载步骤
        layout_splitter_box = $( ".layout-splitter-box" ),
        splitterOptions = {
            splitter: $( ".design-element .layout-splitter" ),
            container: layout_splitter_box
        };

    //design_canvas.hide().width( design_panel_inner.width() - 210 ).show();

    //win.on("resize", function ()
    //{
    //    design_canvas.stop().animate({
    //        width: design_panel_inner.width() - 210
    //    }, 300, "swing", function ()
    //    {
    //        if ($.fn["splitter"])
    //        {
    //            $(".layout-table.hor > tbody > tr > td").splitter(splitterOptions);    // 创建横向[列]分割条
    //            $(".layout-table.ver > tbody > tr").splitter(splitterOptions);         // 创建纵向[行]分割条
    //        }
    //    });
    //}).resize();

    //design_control.fadeIn( 300, function(){
    //    design_control.data( "load", true );
    //    win.trigger( "scroll" );
    //} );

    //$(".design-box > dt > .design-page").click(function ()
    //{
    //    $(this).addClass("sel").siblings(".review-page").removeClass("sel");
    //    operat_buttons.fadeIn(1000);
    //    review_panel.hide();
    //    design_panel.fadeIn(1000);
    //});

    function build_result_html()
    {
        return "";
    }

    //$(".design-box > dt > .review-page").click(function ()
    //{
    //    $(this).addClass("sel").siblings(".design-page").removeClass("sel");

    //    operat_buttons.hide();
    //    design_panel.hide();
    //    review_panel.empty().append(big_loading_box.clone()).fadeIn(1000);

    //    build_result_html();
    //});

    //win.on("scroll", function (e)
    //{
    //    if ( design_control.data( "load" ) )
    //    {
    //        var top = win.scrollTop();

    //        design_control.stop().animate( {
    //            top: top > 51 ? ( top - 41 ) : 0
    //        }, 500, "easeInOutQuint" );
    //    }
    //});

    // 操作堆栈管理
    function OperatStack(max, initObj, opeatCallback)
    {
        stackCollection = [];

        operat_stack_current = -1;

        maxLength = max > 0 ? max : 50;

        if ( $.isArray( initObj ) )
        {
            stackCollection = initObj;
            operat_stack_current = initObj.length - 1;
        } else
        {
            if ( $.isFunction( initObj ) )
            {
                opeatCallback = initObj;
            }
        }

        //this.push = function ( content )
        //{
        //    operat_stack_current += 1;
        //    stackCollection.length = operat_stack_current;

        //    stackCollection[operat_stack_current] = content;

        //    if ( stackCollection.length > maxLength )
        //    {
        //        stackCollection = stackCollection.slice( 1 );
        //        operat_stack_current -= 1;
        //    }
        //}

        this.push = function ( context, content )
        {
            operat_stack_current += 1;
            stackCollection.length = operat_stack_current;

            stackCollection[operat_stack_current] = { context: context, content: content };

            if ( stackCollection.length > maxLength )
            {
                stackCollection = stackCollection.slice( 1 );
                operat_stack_current -= 1;
            }
        }

        this.redo = function ()
        {
            if ( stackCollection.length && operat_stack_current < stackCollection.length - 1 )
            {
                operat_stack_current += 1;
                opeatCallback( stackCollection[operat_stack_current] );
            }
        }

        this.undo = function ()
        {
            if ( operat_stack_current > 0 )
            {
                operat_stack_current -= 1;
                opeatCallback( stackCollection[operat_stack_current] );
            }
        }
    }

    //layout_splitter_box.on( "mousedown", ".layout-splitter", function ()
    //{
    //    var split = $( this );
    //    this.ruler = split.data( "panel" ).parent().ruler();
    //} ).on( "mouseup", ".layout-splitter", function ()
    //{
    //    this.ruler.hide();
    //} );

    var operat_stack = new OperatStack( 50, [{ context: design_canvas, content: design_canvas }], function ( c )
    {
        c.appendTo( c.context );
        loadStep.execute();
    } );

    $(".design-panel-control .operat-box a").mousedown(function ()
    {
        $(this).css({ opacity: 0.5 });
    }).mouseup(function ()
    {
        $(this).css({ opacity: 1 });
    }).click(function ()
    {
        var me = $(this);

        if (me.hasClass("undo"))
        {
            operat_stack.undo();

            return;
        }

        if (me.hasClass("redo"))
        {
            operat_stack.redo();

            return;
        }

        if (me.hasClass("clean"))
        {
            operat_stack.push('<div class="empty-content"></div>');
            design_canvas.html('<div class="empty-content"></div>');
            layout_splitter_box.find(".layout-splitter").hide();

            return;
        }

        if (me.hasClass("save"))
        {
            alert(build_result_html());

            return;
        }
    });

    //$(".design-panel-control .search-content-input").focusin(function ()
    //{
    //    $(this).addClass("search-content-input-focus");
    //}).focusout(function ()
    //{
    //    var v = $.trim(this.value);

    //    if (!v)
    //    {
    //        $(this).removeClass("search-content-input-focus");
    //    }
    //}).keyup(function ()
    //{
    //    var v = $.trim(this.value);

    //    if (!v)
    //    {
    //        contents.show();
    //    } else
    //    {
    //        contents.hide();
    //        contents.filter("[title*='" + v + "']").show();
    //    }
    //});

    //$(".design-panel-control h3 > span").click(function ()
    //{
    //    $(this).addClass("sel").siblings("span").removeClass("sel");
    //});

    //$(".design-panel-control .select-layout-element").click(function ()
    //{
    //    var e = $(".design-control-layout-element");

    //    e.animate({ height: 80 }, 500, "easeInOutQuint");
    //    e.children(".default").fadeIn(500);
    //    e.children(".complex").hide();
    //});

    //$(".design-control-layout-content-header").click(function ()
    //{
    //    $(".design-panel-control .select-layout-element").trigger("click");
    //});

    //$(".design-panel-control .select-complex-layout-element").click(function ()
    //{
    //    var e = $(".design-control-layout-element");

    //    e.animate({ height: 420 }, 500, "easeInOutQuint");
    //    e.children(".complex").fadeIn(200);
    //    e.children(".default").hide();
    //} );

    //var design_element = $( ".design-element" );
    
    //// todo: 为所有内容块加入 “设置” 按钮

    //loadStep.addStep(function ()
    //{
    //    if (!$.trim(design_canvas.html()))
    //    {
    //        layout_splitter_box.find(".layout-splitter").hide();
    //    }
    //});

    //loadStep.addStep( function ()   // 加载或恢复内容块
    //{
    //    $(".layout-table > tbody > tr > td > :first-child").each(function (i, e)
    //    {
    //        var me = $(this);

    //        me.animate({
    //            height: me.parent().height() - 12
    //        }, 300, "swing");
    //    });
    //} );

    //loadStep.addStep( function ()   // 创建或恢复分割条
    //{
    //    $(".layout-table.hor > tbody > tr > td").splitter(splitterOptions);    // 创建横向[列]分割条
    //    $(".layout-table.ver > tbody > tr").splitter(splitterOptions);         // 创建纵向[行]分割条
    //});

    // 拖动布局到【画板】
    //$(".design-control-layout-element > li").draggable({
    //    addClasses: false,
    //    appendTo: "#layout-dragging-shelter",
    //    helper: "clone",
    //    opacity: 0.7,
    //    revert: "invalid",
    //    scroll: false,
    //    start: function (event, ui) { },    // 开始拖放
    //    drag: function (event, ui) { },     // 拖动
    //    stop: function (event, ui) { }      // 停止拖动
    //});

    // 【画板】接受【布局】
    //$(".empty-content").droppablex({
    //    accept: ".design-panel-control .design-control-layout-element li",
    //    activeClass: "drop-active",
    //    hoverClass: "drop-hover",
    //    addClasses: false,
    //    greedy: true,
    //    activate: function (event, ui) { },   // 开始
    //    deactivate: function (event, ui) { },    // 取消
    //    over: function (event, ui) { },  // 经过
    //    out: function (event, ui) { },  // 移出
    //    drop: function (event, ui)  // 投放
    //    {
    //        var me = $(this),
    //            p = $(this).parent(),
    //            layout = $(layouts[ui.helper.attr("layout")]);

    //        me.remove();
    //        layout.appendTo(p);

    //        operat_stack.push(design_canvas.html());    // 添加到可撤销列表

    //        $(".layout-table.hor > tbody > tr > td").splitter(splitterOptions);    // 创建横向[列]分割条
    //        $( ".layout-table.ver > tbody > tr" ).splitter( splitterOptions );         // 创建纵向[行]分割条

    //        $(".layout-table > tbody > tr > td > :first-child").autoHeight();
    //        layout.find(".empty-content").trigger("mouseenter");
    //    }
    //} );



    // 初始化内容快
    /*
        格式：

        [
            {
                "title": "内容块图标",
                "ico": "内容块图标",
                "list": 1/0,    // 是否列表块(int)
                "head": 1/0,    // 列表块是否包含表头(int)
                "url": "内容块路径",
                "moreurl": "更多的路径",
                "opts":     // 操作按钮
                [
                    {
                        "title": "操作项标题",
                        "ico": "操作项图标",
                        "url": "操作项打开的页面url",
                        "width": 0,     // 操作项打开的页面的宽度
                        "height": 0     // 操作项打开的页面的高度
                    }
                ]
            }
        ]
    */ 
    
    //ajax("FillData.ashx", { "action": "GetPortalBlock", "PortalType": getParamValue("PortalType", parent) }, "json",
    //    function (data, textStatus)
    //    {
    //        var ul = $(".design-control-layout-contents");
    //        if (data.Success == "Y")
    //        {
    //            var html = '';
    //            var blocks = eval('(' + data.Data + ')');

    //            for (var i = 0; i < blocks.length; i++)
    //            {
    //                html += stringFormat('<li title="{0}"><img src="{1}" alt="{0}" /></li>', blocks[i].title, blocks[i].ico);
    //            }

    //            ul.append(html);
    //            contents = $(".design-control-layout-contents li");
    //        }
    //        else
    //        {
    //            ul.html(data.Data);
    //        }
    //    });
});