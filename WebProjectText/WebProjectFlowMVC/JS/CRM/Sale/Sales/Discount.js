// JScript 文件

//搜索
var DiscountGUID;
var projIndex;
function btnSearch_Click()
{
    var search = $("#txtSearch").val();
    if ($("#ddlProject").val().length != 36)
    {
        alert('请选择项目！');
    }
    else
    {
        reloadDatajq();
    }

}

function reloadDatajq()
{
    var jqObj = $('#jqDiscount', document);
    var projectID = $("#ddlProject").val();

    jqObj.getGridParam('postData').ProjectID = projectID;
    jqObj.getGridParam('postData').txtSearch = $("#txtSearch").val();
    if (projectID != null && projectID.length == 36)
    {
        refreshJQGrid("jqDiscount");
        projIndex = document.getElementById("ddlProject").selectedIndex;
    } else
    {
        alert('只能选择公司下的项目！');
        $("#ddlProject option").eq(projIndex).attr("selected", true);
    }
}


function reloadData()
{
    DiscountGUID = $("#hiddDiscountGUID").val();
    ajax(location.href, { "discountGUID": DiscountGUID }, "json", loadBuilding);
}

function loadBuilding(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

// 显示明细
function ShowDiscountDetail()
{
    openAddWindow("VDiscountDetail.aspx?projID=" + $("#ddlProject").val(), 800, 600);
}

// 添加明细
function addDscountDetail()
{
    if (DiscountGUID != null && DiscountGUID != "")
    {
        openAddWindow("VDiscountDetailAdd.aspx?DiscountGUID=" + DiscountGUID, 800, 600);
    }
}

// 修改
function editDiscount()
{
    openModifyWindow("VDiscountDetail.aspx?projID=" + $("#ddlProject").val(), 800, 600, "jqDiscount");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("MakeUpMoneySet", 7, "jqBuChaScheme");
}

// 删除折扣
function DeleteDiscount()
{
    openDeleteWindow("Discount", 7, "jqDiscount");
}

// 删除折扣明细
function btnDelDetail_Click()
{
    var ids = "";
    $("input:checked").each(function ()
    {
        var val = $(this).val();
        if (val != null && val.length == 36)
        {
            ids += val + ",";
        }


    })
    $("#hiddDetailID").val(ids);

}

function renderLink(cellvalue, options, rowobject)
{
    var url = '<a target="_blank" href=VDiscountDetail.aspx?projID=' + $("#ddlProject").val() + '&ID=' + rowobject[0] + '>' + cellvalue + '</a>';
    return url;
}

// SearchKeyDown
function SearchKeyDown()
{
    if (window.event.keyCode == 13)
    {
        btnSearch_Click();
    }
}


// 更改折扣计算方法
function rdlDiscountType_click()
{
    var sDiscountType = $("input[name$=rdlDiscountType][checked]");
    if (sDiscountType.val() == "1" || sDiscountType.val() == "2")
    {
        $('#txtDiscountMoney').val("");
        $('#txtDiscountMoney').attr("disabled", "disabled")
        $('#txtDiscountRate').removeAttr("disabled");

        $("#tdRequiredlblDiscountRate span").show();
        $("#tdRequiredlblDiscountMoney span").hide();
    }
    else
    {
        $('#txtDiscountRate').val("");
        $('#txtDiscountRate').attr("disabled", "disabled")
        $('#txtDiscountMoney').removeAttr("disabled");
        $("#tdRequiredlblDiscountMoney span").show();
        $("#tdRequiredlblDiscountRate span").hide();
    }
}

// 添加/修改折扣明细验证
function validateSize()
{
    handleBtn(false);
    if (getObj("txtDiscountDetailName").value == "")
    {
        handleBtn(true);
        return alertMsg("折扣项名称不能为空。", getObj("txtDiscountDetailName"));
    }

    var sDiscountType = $("input[name$=rdlDiscountType][checked]");
    if (sDiscountType.val() == "1" || sDiscountType.val() == "2")
    {
        var sDiscountRate = getObj("txtDiscountRate").value;
        if (sDiscountRate == "" || !isScorePercent(sDiscountRate) || getRound(sDiscountRate) <= 0 || getRound(sDiscountRate) >= 100)
        {
            handleBtn(true);
            return alertMsg("折扣（%）必须为0-100之间的数字。", getObj("txtDiscountRate"));
        }
    }
    else
    {
        // 优惠金额
        var sDiscountMoney = getObj("txtDiscountMoney").value;
        if (sDiscountMoney == "" || !isScorePercent(sDiscountMoney) || getRound(sDiscountMoney) == 0)
        {
            handleBtn(true);
            return alertMsg("优惠金额（元）必须为大于0的数字。", getObj("txtDiscountMoney"));
        }
    }

    return true;
}


function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnAdd"), enabled);
    setBtnEnabled(getObj("btnEdit"), enabled);
}