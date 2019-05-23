/*
 * 门户布局
 * =======================================
 * 包含门户编辑布局、展示布局脚本
 *
 * by maowc @ 2012-5-9
 */

// 布局创建器
window.layoutBuilders = {
    content: function ()
    {
        return '<div class="layout-content"><div class="ui-layout-center"></div></div>';
    },
    twocols: function ()
    {
        return '<div class="layout-twocols"><div class="ui-layout-west"></div><div class="ui-layout-center"></div></div>';
    },
    tworows: function ()
    {
        return '<div class="layout-tworows"><div class="ui-layout-north"></div><div class="ui-layout-center"></div></div>';
    },
    tab: function ()
    {
        return '<div class="layout-tab"><ul><li><a href=".tab-1">标签1</a></li><li><a href=".tab-2">标签2</a></li><li><a href=".tab-3">标签3</a></li></ul><div class="tab-page tab-1"><div class="ui-layout-center">1</div></div><div class="tab-page tab-1"><div class="ui-layout-center">222</div></div><div id="tab-1"><div class="ui-layout-center">33</div></div></div>';
    }
};

// 所有布局
window.layouts = [
    { Id: 1, Name: "content", Title: "无", Show: false, Content: layoutBuilders.content },
    { Id: 2, Name: "twocols", Title: "两列", Show: true, Content: layoutBuilders.twocols },
    { Id: 3, Name: "tworows", Title: "两行", Show: true, Content: layoutBuilders.tworows },
    { Id: 4, Name: "tab", Title: "标签页", Show: true, Content: layoutBuilders.tab }
];

    // 获取指定ID的布局
    function getLayoutById( id )
    {
        for ( var i in window.layouts )
        {
            var layout = window.layouts[i];

            if ( layout["Id"] == id )
                return layout;
        }

        return null;
    }

// 布局宽度调节
//window.sizeControllers = [
//    { Id: 2, Name: "1:2", Type: 2, WidthSet: [34, 66] },
//    { Id: 3, Name: "2:1", Type: 2, WidthSet: [66, 34] },
//    { Id: 4, Name: "1:3", Type: 2, WidthSet: [25, 75] },
//    { Id: 5, Name: "3:1", Type: 2, WidthSet: [75, 25] },
//    { Id: 6, Name: "1:1", Type: 2, WidthSet: [50, 50] },
//    { Id: 7, Name: "1:4", Type: 2, WidthSet: [20, 80] },
//    { Id: 8, Name: "4:1", Type: 2, WidthSet: [80, 20] },
//    { Id: 9, Name: "2:3", Type: 2, WidthSet: [40, 60] },
//    { Id: 10, Name: "3:2", Type: 2, WidthSet: [60, 40] }
//];

$( function ()
{

} );