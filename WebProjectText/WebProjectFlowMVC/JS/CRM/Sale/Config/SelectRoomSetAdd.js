// JScript 文件

// 修改值
function OnSelectedIndexChanged()
{
    var buildingGUID = $( "#ddlBuilding" ).val(),

        projName = $( "#hddProjName" ).val(),
        buildingName = "", isRegion = "";

    ajaxRequest( 'FillData.ashx', { action: "CRM_GetBuildingInfo", BuildingGUID: buildingGUID },
   'json', function ( data, status )
   {
       buildingName = data.FullBuildingName;
       isRegion = data.IsRegion;

       $( "#txtBuildingGUID" ).val( buildingName );
       $( "#hidIsRegion" ).val( isRegion );
   }, false, "POST" );
}


// 提交验证方法
function validate()
{
    var isValid = true;
    handleBtn( false );

    if ( $.ideaValidate() )
    {
        var hidIsRegion = $( '#hidIsRegion' ),
            ddlBuilding = $( "#ddlBuilding" );

        if ( hidIsRegion.val() == "Y" )
        {
            isValid = alertMsg( "当前选择的是区域，请选择楼栋。", ddlBuilding[0] );
        }

        handleBtn( true );

        return isValid;
    }
    else
    {
        handleBtn( true );
        return false;
    }
    return true;
}

function handleBtn( enabled )
{
    setBtnEnabled( getObj( "btnSave" ), enabled );
}