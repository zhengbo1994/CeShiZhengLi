// 确定按钮点击事件
function btnChoose_Click()
{
	var ddlTotalPrice = $('#ddlTotalPrice'),
		ddlSaleStatus = $('#ddlSaleStatus'),
		ddlArea = $('#ddlArea'),
		ddlRoomStructure = $('#ddlRoomStructure'),
		ddlApartment = $('#ddlApartment'),

		queryCondition = {
			priceRange: ddlTotalPrice.val(),
			allowSaleStatus: ddlSaleStatus.val(),
			areaRange: ddlArea.val(),
			roomStructure: ddlRoomStructure.val(),
			apartment: ddlApartment.val()
		};

	window.returnValue = queryCondition;
	window.close();
}