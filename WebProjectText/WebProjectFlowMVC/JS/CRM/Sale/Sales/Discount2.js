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

function customGridComplete() {
}

//在修改折扣方案时，加载显示折扣方案明细。
function reloadJQData() {
    //当JQGrid的AutoLoad=false时,模拟手动加载
    var query = [{ "DiscountGUID": $("#hidDiscountGUID").val()}];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}

//格式化折扣类型
function renderDiscountType(cellvalue, options, rowobject) {
    switch (cellvalue) {
        case "1":
            return '打折';
        case "2":
            return '减点';
        case "3":
            return '总价优惠';
        case "4":
            return '单价优惠';
        default:
            return '未知折扣类型';
     }
     
}
//格式化折扣明细项名称
function renderDiscountDetailName(cellvalue, options, rowobject) {
    var url = "VDiscountDetailAdd.aspx?DiscountGUID={0}&DiscountName={1}&ID={2}";
    url = stringFormat(url, $("#hidDiscountGUID").val(), encodeURIComponent($("#txtDiscountName").val()), rowobject[0]);
    var link = "<a href='javascript:void(0)' onclick=\"javascript:openWindow('" + url + "',0, 0)\" >" + cellvalue + "</a>";

    return link; 
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


// 点击新增按钮时， 添加折扣方案方法
function addDiscount()
{
    openAddWindow( "VDiscountDetail2.aspx?ProjectGUID=" + $( "#ddlProject" ).val(), 650, 320 );
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
    openModifyWindow("VDiscountDetail2.aspx?ProjectGUID=" + $("#ddlProject").val(), 800, 600, "jqDiscount");
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


//格式化折扣名称
function renderLink(cellvalue, options, rowobject) {
    var url = "VDiscountDetail2.aspx?ProjectGUID={0}&ID={1}";
    url = stringFormat(url, $("#ddlProject").val(), rowobject[0]);
    var link = "<a href='javascript:void(0)' onclick=\"javascript:openWindow('" + url + "',0, 0)\" >" + cellvalue + "</a>";
    return link;
}

// SearchKeyDown
function SearchKeyDown()
{
    if (window.event.keyCode == 13)
    {
        btnSearch_Click();
    }
}

//显隐区块
function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
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

function changeIsEnable(value) {
    $("#txtIsEnable").val(value);
}

function validateSizeMain() {
    if (getObj("txtDiscountName").value == "") {
        return alertMsg('折扣项名称不能为空!', getObj("txtDiscountName"));
    }
    if ($("#txtIsEnable").val() == "Y") {
        return confirm("若该项目下已启用其他折扣方案，启用该方案会禁用原方案，是否继续启用?");
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveClose"), enabled);
    setBtnEnabled(getObj("btnClose"), enabled);
}

// 判断选中的折扣明细是否允许编辑（、排序）  单云飞  2013-6-26
function IsDiscountAllowEdit(message)
{
    var did = getJQGridSelectedRowsData( "jqData", true, "DiscountDetailGUID" );
    if ( did.length == 0)
    {
        alert( "请选择一条记录！" );
        return false;
    }
    else if ( did.length > 1 )
    {
        alert( "只能选择一条记录！" );
        return false;
    }
   else  if ( did.join() == "00000000-0000-0000-0000-000000000000" )
    {
        alert(message);
        return false;
    }
    else
    {
        return true;
    }
}

//新增折扣明细
function addDiscountDetail() {
    var sDiscountGUID = getObj("hidDiscountGUID").value;
    var sDiscountName = getObj("txtDiscountName").value;
    var url = "VDiscountDetailAdd.aspx?DiscountGUID={0}&DiscountName={1}";
    url = stringFormat(url, sDiscountGUID, encodeURIComponent(sDiscountName));
    var a = openAddWindow(url, 800, 600, "jqData");
}

//修改折扣明细
function editDiscountDetail()
{
    var message = "付款方式折扣不允许修改！";
    if (IsDiscountAllowEdit( message ) )
    {
        var sDiscountGUID = getObj( "hidDiscountGUID" ).value;
        var sDiscountName = getObj( "txtDiscountName" ).value;
        var url = "VDiscountDetailAdd.aspx?DiscountGUID={0}&DiscountName={1}";
        url = stringFormat( url, sDiscountGUID, encodeURIComponent( sDiscountName ) );
        openModifyWindow( url, 800, 600, "jqData" );
    }
}

//删除折扣明细
function delDiscountDetail()
{
    var did = getJQGridSelectedRowsData( "jqData", true, "DiscountDetailGUID" ).join();
    if ( did.indexOf( "00000000-0000-0000-0000-000000000000" ) != "-1" )
    {
        alert("所选折扣包括付款方式折扣，付款方式折扣不允许删除！");
    }
    else
    {
        var a = openDeleteWindow( "DiscountDetail", 7, "jqData" );
        //openDeleteWindow使用的是模式窗口，可以在模式窗口返回后直接在此刷新。
        reloadJQData();
    }
}

//折扣明细向上移动
function moveToUpDiscountDetail()
{
    var message = "付款方式折扣必须排最前面，不允许移动！";
    if (IsDiscountAllowEdit(message))
    {
    }
}

//折扣明细向下移动
function moveToDownDiscountDetail()
{
    var message = "付款方式折扣必须排最前面，不允许移动！";
    if (IsDiscountAllowEdit( message ) )
    {
    }
}
//功能：折扣方案引入
//作者：常春侠
//时间：2013-6-26 17:32:18
function importDiscount()
{
    var projID = $("#ddlProject").val(); 
    var url = "../../../Common/Select/CRM/VSelectDiscountInfo.aspx?IsMulti=Y&projID=" + projID;

    var rValue = openModalWindow(url, 800, 600);
    if (null != rValue)
    {
       // alert("discoutname:"+rValue.DiscountName); return false;
        $.post("FillData.ashx", { action: "CRM_ImportDiscountInfo", ProjectID: rValue.ProjectID, DiscountID: rValue.DiscountID, DiscountName: rValue.DiscountName }, function (data, textstatus)
        {
            if (data.toUpperCase() == "TRUE") {
                alert("引入成功！"); reloadDatajq();
            }
            else {
                alertMsg("引入失败，请重新操作！");
            }
        });
    }
}