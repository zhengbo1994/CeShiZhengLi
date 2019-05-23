
(function ($)
{
    $.fn.extend( {
        autoHeight: function ()
        {
            return this.each( function ( i, e )
            {
                var me = $( this );

                me.animate( {
                    height: me.parent().height() - 12
                }, 300, "swing" );
            } );
        }
    } ); 
     
})(jQuery);

$(function ()
{
    var win = $(window);

    $(".layout-table > tbody > tr > td > :first-child").autoHeight();

    $(".content-placeholder > .content > .tab").each(function (i,e)
    {
        var me = $(e),
            tab = me.children(".tab-tags");

        me.children(".tab-panel").eq(tab.children(".sel").index()).show();

        tab.on("click", ".tab-tag", function ()
        {
            var t = $(this);
            
            t.addClass("sel").siblings(".tab-tag").removeClass("sel");
            me.children(".tab-panel").hide().eq(t.index()).show();
        });
    });

    $(".layout-table.hor > tbody > tr > td").splitter();    // 创建横向[列]分割条
    $(".layout-table.ver > tbody > tr").splitter();         // 创建纵向[行]分割条

});