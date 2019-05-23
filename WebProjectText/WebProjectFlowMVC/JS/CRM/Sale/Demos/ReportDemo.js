
function showIndexTab( index )
{
    // 调用这个方法，显示所选中的项
    selectTab( index, "TabInfo" );

    for ( var i = 0; i <= 3; i++ )
    {
        getObj( "div" + i ).style.display = "none";
    }

    getObj( "div" + index ).style.display = "block";

}