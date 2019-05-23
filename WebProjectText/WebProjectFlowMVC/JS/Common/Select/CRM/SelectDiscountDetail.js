function btnChoose_Click()
{
    window.returnValue = getSelectedDiscountData();
    window.close();
}

function getSelectedDiscountData()
{
    var selectedDiscountData = [],
        discountDetailGUIDArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountDetailGUID' ),
        discountGUIDArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountGUID' ),
        discountDetailNameArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountDetailName' ),
        discountTypeNameArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountTypeName' ),
        discountTypeArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountType' ),
        discountRateArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountRate' ),
        discountMoneyArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'DiscountMoney' ),
        remarkArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'Remark' ),
        isAllowAdjustArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'IsAllowAdjust' ),
        rankNoArr = getJQGridSelectedRowsData( 'jqDiscountDetail', true, 'RankNo' );

    for ( var i = 0; i < discountDetailGUIDArr.length; i++ )
    {
        selectedDiscountData.push( {
            DiscountDetailGUID: stripHtml( discountDetailGUIDArr[i] ),
            DiscountGUID: stripHtml( discountGUIDArr[i] ),
            DiscountDetailName: stripHtml( discountDetailNameArr[i] ),
            DiscountTypeName: stripHtml( discountTypeNameArr[i] ),
            DiscountType: stripHtml( discountTypeArr[i] ),
            DiscountRate: stripHtml( discountRateArr[i] ),
            DiscountMoney: stripHtml( discountMoneyArr[i] ),
            Remark: stripHtml( remarkArr[i] ),
            IsAllowAdjust: stripHtml( isAllowAdjustArr[i] ),
            RankNo: stripHtml( rankNoArr[i] )
        } );
    }

    return selectedDiscountData;
}