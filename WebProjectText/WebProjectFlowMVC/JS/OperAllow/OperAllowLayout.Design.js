/*
* 门户布局设计时
* =======================================
* 包含门户编辑布局、展示布局设计时脚本
*
* by maowc @ 2012-5-9
* 
*/

$( function ()
{
    var layoutListPanel = $( ".layout-list-panel" );    // 布局元素容器
    var contentListPanel = $( ".content-list-panel" );    // 内容块元素容器

    // 初始化布局
    function initLayout()
    {
        var tags = '';
        var show_layouts = $.grep( window.layouts, function ( e, i ) { return e["Show"]; } );

        for ( var i in show_layouts )
        {
            var e = show_layouts[i];
            tags += '<dd><img src="../../Image/' + e["Name"] + '.png" lid="' + e["Id"] + '" alt="' + e["Title"] + '" /></dd>';
        }

        layoutListPanel.append( tags );
    }

    initLayout();

    // 移动到布局或内容块
    $( ".layout-panel dl dd img" ).delegate( "", "mouseenter", function ()
    {
        $( this ).closest( "dd" ).addClass( "hover" );
    } ).delegate( "", "mouseout", function ()
    {
        $( this ).closest( "dd" ).removeClass( "hover" );
    } );

    var layoutOption = {
        closable: false
    };

    $( ".layout-content" ).layout( layoutOption );

    // 拖动布局
    $( ".layout-panel dl dd img" ).delegate( "", "mouseenter", function ()
    {
        $( this ).draggable( {
            hoverClass: "select-src-hover",
            activeClass: "select-src-active",
            appendTo: "body",
            scroll: false,
            //cursorAt: { left: 25, top: 48 },
            helper: "clone",
            revert: "invalid"
        } );
    } );

    // 处理 drop 事件
    function handleDrop( e, ui )
    {
        if ( !ui.draggable.hasClass( "ui-layout-resizer" ) )
        {
            var lo = getLayoutById( ui.draggable.attr( "lid" ) );

            if ( lo )
            {
                var l = $( lo.Content() );
                l.height( "100%" ).appendTo( this );
                l.find( ".ui-layout-center,.ui-layout-north,.ui-layout-south,.ui-layout-west,.ui-layout-east" ).droppable( { drop: handleDrop } );
                if ( l.hasClass( "layout-tab" ) )
                {
                    l.find( ".tab-page" ).layout( layoutOption ).hide();
                    l.tabs();
                }
                else
                {
                    l.layout( layoutOption );
                }
            }
        }

        $( window ).resize();
    }

    // 放下布局
    $( ".ui-layout-center,.ui-layout-north,.ui-layout-south,.ui-layout-west,.ui-layout-east" ).droppable( { drop: handleDrop } );

} );