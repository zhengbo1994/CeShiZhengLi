//用于折扣方案引入
//作者：常春侠
//时间：2013-6-26 16:34:24

function reloadData()
{
    var projID = $("#ddlProject").val();
    var txtSearch = $("#txtSearch").val();
    var query = { "ProjectID": projID, "txtSearch": txtSearch };
    if (loadJQGrid("jqDiscount", query))
    {
        addParamsForJQGridQuery("jqDiscount", query);
        refreshJQGrid("jqDiscount");
    }
}


function searchKeyDown()
{
    reloadData();
}
//搜索按钮
function btnSearch_Click()
{
    reloadData();
}
//项目选择
function project_change()
{
    if ($("#ddlProject").val().length != 36)
    {
        alert('请选择项目！');
    }
    else
    {
        reloadData();
    }
}
//选择按钮事件
function chooseDiscountInfo()
{
    var projID = $("#hidProjectID").val();;
    var isMultiSelect = checkJQGridEnableMultiSel("jqDiscount");
    var discountID = getJQGridSelectedRowsID("jqDiscount", isMultiSelect, "DiscountGUID");
    var discountName = getJQGridSelectedRowsData("jqDiscount", isMultiSelect, "DiscountName");

    if ("" == discountID)
    {
       return alertMsg("请选择要引入的折扣方案！");
    }

    var returnData = {};
    var discountIDs = [];
    var discountNames = [];

    if (isMultiSelect)
    {
        if (discountID.length > 0)
        {
            for (var i = 0; i < discountID.length; i++)
            {
                if (discountID[i] != "")
                {
                    discountIDs.push(stripHtml(discountID[i]));
                    discountNames.push(stripHtml(discountName[i]));
                }
            }
            returnData = {
                ProjectID: projID,
                DiscountID: discountIDs.join(','),
                DiscountName: discountNames.join(',')
            }


        }
    }
    else
    {
        returnData = {
            ProjectID: projID,
            DiscountID: stripHtml(discountID),
            DiscountName:stripHtml(discountName)
        }
    }
    window.returnValue = returnData;
    window.close();
}