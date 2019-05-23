function windowLoad()
{
    var opernerObjID = getParamValue( 'hidSelectedInfo' ),
        win = !!window.dialogArguments ? window.dialogArguments : window,
        openerHidSelectedInfo = win.getObj( opernerObjID ),
        strDisplayContentSetting = openerHidSelectedInfo.value,
        displayContentSetting = $.stringToJSON( strDisplayContentSetting ),

        cbkConstructionArea = $( '#cbkConstructionArea' ),
		cbkInternalArea = $( '#cbkInternalArea' ),
		cbkUnitPrice = $( '#cbkUnitPrice' ),
		cbkTotalPrice = $( '#cbkTotalPrice' ),
		cbkClientNames = $( '#cbkClientNames' );

    if ( displayContentSetting.showConstructionArea )
    {
        cbkConstructionArea.attr('checked','checked');
    }
    if ( displayContentSetting.showInternalArea )
    {
        cbkInternalArea.attr('checked','checked');
    }
    if ( displayContentSetting.showUnitPrice )
    {
        cbkUnitPrice.attr('checked','checked');
    }
    if ( displayContentSetting.showTotalPrice )
    {
        cbkTotalPrice.attr('checked','checked');
    }
    if ( displayContentSetting.showClientNames )
    {
        cbkClientNames.attr('checked','checked');
    }
}

// 确定按钮点击事件
function btnChoose_Click()
{
    var cbkConstructionArea = $( '#cbkConstructionArea[checked]' ),
		cbkInternalArea = $( '#cbkInternalArea[checked]' ),
		cbkUnitPrice = $( '#cbkUnitPrice[checked]' ),
		cbkTotalPrice = $( '#cbkTotalPrice[checked]' ),
		cbkClientNames = $( '#cbkClientNames[checked]' ),

		displayContentSettingInfo = {
		    showConstructionArea: cbkConstructionArea.length > 0,
		    showInternalArea: cbkInternalArea.length > 0,
		    showUnitPrice: cbkUnitPrice.length > 0,
		    showTotalPrice: cbkTotalPrice.length > 0,
		    showClientNames: cbkClientNames.length > 0
		};
    
    window.returnValue = displayContentSettingInfo;
    window.close();
}