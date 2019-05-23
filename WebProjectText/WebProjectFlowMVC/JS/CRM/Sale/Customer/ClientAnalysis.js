/**
文件说明： 客户管理-->潜在客户分析 JS文件
**/

//选中Tab的索引
var tabIndex = 0;

function showIndexTab( index )
{
    tabIndex = index;//记录选中的索引

    // 调用这个方法，显示所选中的项
    selectTab( index, "TabInfo" );

    for ( var i = 0; i <= 4; i++ )
    {
        getObj( "div" + i ).style.display = "none";
    }

    getObj( "div" + index ).style.display = "block";

    $( "#tbClerkFilter,#tbDateFilter").hide();

    if ( index == 0 )
    {
        $( "#tbClerkFilter,#tbDateFilter" ).show();
    }
    else if ( index == 1 || index == 4 )
    {
        $( "#tbDateFilter" ).show();
    }

    reloadData();
}


//选择日期时，验证日期是否有效
function validateDate()
{
    if ( compareDate( $( "#txtStartDate" ).val(), $( "#txtEndDate" ).val() ) < 0 )
    {
        alertMsg( "结束时间不小于开始时间！", $( "#txtEndDate" ) );
    }
    return true;
}

//重新加载数据
function reloadData()
{
    //validateDate();
    var query = {
        "ProjectGUID": $( "#ddlProjectGUID" ).val(),
        "ClerkAccountGUID": $( "#ddlAccountGUID" ).val(),
        "StartDate": $( "#txtStartDate" ).val(),
        "EndDate": $( "#EndDate" ).val()
    };

    switch ( this.tabIndex )
    {
        case 0:
            ajax( location.href, query, "json", callBackFun );
            break;
        case 1:
            break;
        case 2:
            query.action = "jqGrid";
            if ( loadJQGrid( "jqGrid", query ) )
            {
                refreshJQGrid( "jqGrid" );
            }
            break;
        case 3:
            query.action = "jqData";
            if ( loadJQGrid( "jqData", query ) )
            {
                refreshJQGrid( "jqData" );
            }
            break;
    }
}

//选择项目时，重新加载该项目下的置业人员
function reloadAccountData()
{
    //alert("选择项目..." + $("#ddlProjectGUID").val());
    var query = { "t": new Date().getTime(), "action": "GetAccountByProjectGUID", "ProjectGUID": $( "#ddlProjectGUID" ).val() };
    $.getJSON( location.href, query, function ( data )
    {
        if ( data )
        {
            $( '#ddlAccountGUID option' ).remove();
            $( '#ddlAccountGUID' ).get( 0 ).options.add( new Option( '全部', '0' ) );
            for ( var i = 0; i < data.length; i++ )
            {
                $( '#ddlAccountGUID' ).get( 0 ).options.add( new Option( data[i].AccountName, data[i].AccountID ) );
            }
            changeAccount();
        }
    } );
}

//置业人员下拉选择
function changeAccount()
{

    reloadData();
}

function callBackFun( data, textStatus )
{
    if ( data.Success == "Y" )
    {
        $( "#div0" ).html( data.Data );
    }
    else
    {
        alert( "获取数据失败！" );
    }
}








