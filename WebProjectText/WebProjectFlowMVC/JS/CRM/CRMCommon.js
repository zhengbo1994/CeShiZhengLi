// CRM JS 公共函数
// 单云飞 2013-03-01

function getNullGuid()
{
    return "00000000-0000-0000-0000-000000000000";
}

// 禁用表单中的指定对象
// @containerID 需要禁用的表单对象的容器ID,容器对象，或undefined，当未undefined时，容器指定为document
// @customSelector 用于查找需要禁用的对象的自定义jq选择器。当不指定时，使用默认选择，默认选择器指向所有input、select、button标签
// @notDisabledSelector 用于指定某些对象不需要禁用的选择器。
function disabledFormElements( containerID, customSelector, notDisabledSelector )
{
    var defaultSelector = 'input,select,button,textarea';
    var selector = !customSelector ? defaultSelector : customSelector;
    var container = null;

    if ( typeof containerID === 'string' )
    {
        container = $( '#' + containerID );
    }
    else if ( typeof containerID === 'object' )
    {
        container = $( containerID );
    }
    else
    {
        container = document;
    }

    var jqDom = $( selector, container );

    // 获取要设置为disable的目标对象集合
    jqDom = !notDisabledSelector ? jqDom : jqDom.not( notDisabledSelector );
    // 清空目标对象集合的事件
    jqDom.unbind();
    // 将目标对象集合设置成disabled
    jqDom.attr( 'disabled', 'disabled' );
    // 将文本框的样式改成只读的样式
    jqDom.filter( 'input[type=text]' ).removeClass().addClass( 'graytext' );
}

// 重新绑定下拉框方法
function rebindDdl( params, ddlId, defaultOptionType, callback )
{
    rebindDdlBySelectedValue( params, ddlId, '', defaultOptionType, callback );
}

function rebindDdlBySelectedValue( params, ddlId, defaultValue, defaultOptionType, callback )
{
    if ( params != null )
    {
        $.post( 'FillData.ashx', params, function ( data, textStatus )
        {
            // 绑定下拉框
            bindDdl( data, ddlId, defaultValue, defaultOptionType );

            if ( typeof callback == 'function' )
            {
                callback();
            }
        }, 'json' );
    }
    else
    {
        // 绑定下拉框
        bindDdl( [], ddlId, '', defaultOptionType );
    }
}

//获取jqgrid选中行的数据
///获取jqGrid被选中行的关键数据
///获取jqGrid被选中行的行ID(即tr的客户端html id属性值)
///@jqGridID jqGrid的客户端ID
///@bEnableMultiselect 是否启用多行选择（即有checkbox的时候),

function getJQGridSelectedRows( jqGridID, bEnableMultiselect )
{

    var selectedRowsID = getJQGridSelectedRowsID( jqGridID, bEnableMultiselect );
    var selectedDatas = [];
    if ( bEnableMultiselect )
    {
        for ( var i = 0; i < selectedRowsID.length; i++ )
        {
            selectedDatas.push( $( '#' + jqGridID ).getRowData( selectedRowsID[i] ) );
        }
    }
    else
    {
        selectedDatas.push( $( '#' + jqGridID ).getRowData( selectedRowsID ) );
    }
    return selectedDatas;
}

// 输入验证：文本框只能输入数字和小数点且 处理退格键与浏览器的冲突(貌似对浏览器有选择，无论按什么keycode都为229,临时解决办法是给空间加ime-mode: disabled)
function KeepDigital(current)
{
    $(current).keydown(
    function ()
    {
        var e = $(this).event || window.event;
        var code = parseInt(e.keyCode);
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8 || code == 190 || code == 110) {
            return true;
        } else {
            return false;
        }

    });
}

//按精度四舍五入
function RoundByPrecision( current, precision )
{
    $( current ).val( getRound( $( current ).val(), precision ) );
}


// 获取对象内所有控件value值  chensq 2013-6-8
//formObj 参数可传多个对象，如id1，id2
function GetFullFieldValue( Obj )
{
    var argLength = arguments.length;
    var strJson = "";
    for ( var i = 0; i < argLength; i++ )
    {
        $( arguments[i] ).find( "input[type!=submit][type!=button]" ).each( function ()
        {
            var id = this.id;
            var value = this.value == undefined ? "" : this.value;
            if ( $( this ).attr( "type" ) == "radio" || $( this ).attr( "type" ) == "checkbox" )
            {
                value = $( this ).attr( "checked" ) == "checked" ? "1" : "0";
            }
            strJson += id + ":" + "'" + value + "',";
        } );
        $( arguments[i] ).find( "select" ).each( function ()
        {
            var id = this.id;
            var value = this.value == undefined ? "" : this.value;
            strJson += id + ":" + "'" + value + "',";
        } );
        $( arguments[i] ).find( "textarea" ).each( function ()
        {
            var id = this.id;
            var value = this.value == undefined ? "" : this.value;
            strJson += id + ":" + "'" + value + "',";
        } );

    }
    if ( strJson.length > 0 )
    {
        strJson = "{" + strJson.substr( 0, strJson.length - 1 ) + "}";
        return eval( '(' + strJson + ')' );
    }
    else
    {
        return strJson;
    }

}


//obj参数表示选择的树对象当前级别
//Pvalue参数表示指定类别（父级项）的固定值
//levelSymbol参数表示层级符号,如'|'
//separator参数表示与正式文本相分隔的符号,如'—'
// chensq  2013-6-8   目前暂用于 根据项目获取楼栋的楼栋绑定下拉框
getFullLevelIds = function ( obj, Pvalue, levelSymbol, separator )
{
    var itemList = [];
    var isArea = $.trim( $( obj ).val() ) == Pvalue || $.trim( $( obj ).val() ).length == 0 ? true : false;
    var result = '';
    if ( isArea )
    {
        var objLevel = getObjLevel( obj );
        $( obj ).nextAll().each( function ()
        {
            var thisLevel = getObjLevel( this, levelSymbol, separator );
            if ( thisLevel <= objLevel )
            {
                return false;
            }
            else
            {
                var isThisArea = $.trim( $( this ).val() ) == Pvalue ? true : false;
                if ( !isThisArea )
                {
                    itemList.push( $( this ).val() );
                }
            }
        } );
    }
    else
    {
        result = itemList.push( $( obj ).val() );
    }
    return itemList;
}

//获取树对象的等级
getObjLevel = function ( obj, levelSymbol, separator )
{
    var objHtml = $( obj ).html();
    var objLevelHtml = objHtml.substring( 0, objHtml.indexOf( separator ) );
    var objLevel = objLevelHtml == undefined || objHtml.split( levelSymbol ).length == 1 ? 0 : objHtml.split( levelSymbol ).length / 2;
    return objLevel;
}


// 设置IDTextBox控件是否只读
function setIDTextIsReadonly( IDTextObj, isReadOnly )
{
    if ( isReadOnly )
    {
        setIDText( $(IDTextObj)[0], 1 );
        $( IDTextObj ).attr( 'readonly', 'readonly' ).removeClass( 'text' ).addClass( 'graytext' ).css( 'width', '100%' )[0].onfocus = function ()
        {
            this.blur();
        };
    }
    else
    {
        $( IDTextObj ).removeAttr( 'readonly' ).removeClass( 'graytext' ).addClass( 'text' ).css( 'width', '' )[0].onfocus = function ()
        {
            setIDText( IDTextObj, 0 );
        };
    }
}

/* 打开删除窗口。IdeaSoft.js中没有提供单选JQGRID删除数据的方法，此方法就是用在单选JQGRID   */
// (1) 树视图页的删除，第三个参数为要删除的记录的ID，不允许指定第四个参数
// (2) jqGrid页的删除，第三个参数为jqGrid的ID，不允许指定第四个参数
// (3) 框架中的jqGrid页的删除，第三个参数为jqGrid的ID
function openDeleteWindowByRadioType(action, aim, jqGridID) {
    var url = getDeletePageUrl(aim);
    if (url == "") {
        return alertMsg("参数错误。");
    }
    url += "?Action=" + action;
    
    ids = $("#"+jqGridID).jqGrid('getGridParam', 'selrow');
    if (ids == "" || ids.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    url += "&JQID=" + jqGridID + "&ID=" + ids;
    //window.open(url);//调试用
    var winobj = getOpenWinObj(2);
    window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
        + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
}

/* 打开修改窗口 */
// (1) jqGrid页的修改，第四个参数为jqGrid的ID，不允许指定第五个参数
// (2) 框架中的jqGrid页的修改，第四个参数为jqGrid的ID，第五个参数为框架的name
function openModifyWindowByRadioType(url, width, height, jqGridID) {
    var id = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
    url = addUrlParam(url, "JQID", jqGridID);
    url = addUrlParam(url, "ID", id);

    openWindow(url, width, height);
}

//隐藏JQGRID分页按钮
function hiddenJQgridPager(jqgrid) {
    $("#pg_"+jqgrid+"_Pager").hide();
}
