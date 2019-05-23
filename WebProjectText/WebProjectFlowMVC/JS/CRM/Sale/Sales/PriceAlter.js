var _PageMaster = {};
_PageMaster.isSearching = false;
var typeIndex;


//搜索
function btnSearch_Click()
{
    reloadData();
}

// 重新加载数据
function reloadData()
{
    if (typeIndex == 3) {
        RefreshPriceHistory();
    }
    else if (typeIndex == 1 || typeIndex == 2||typeIndex==4) {
        var sProjectID = $("#ddlProject").val();
        var sBuildingIDList = $("#ddlBuilding").val();
        var sKey = $("#txtKey").val();
        // 无条件时，省略第二个参数
        if (sBuildingIDList == null || sBuildingIDList.toUpperCase() == "NULL") {
            sBuildingIDList = "";
        }
        var query;
        if (typeIndex == 1) {
            query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, Key: sKey, TabIndex: typeIndex };
        }
        else if (typeIndex == 4) {
            query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, Key: sKey, IsCheckAreaChangePrice: 'Y', TabIndex: typeIndex };
        }
        else {
            query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, Key: sKey, IsCheckChangeRoomPrice: 'Y', TabIndex: typeIndex };
        }

        reloadGridData("idPager", query);
    }
    else {
        RefreshPriceScheme();
    }

}


function customGridComplete()
{
    _PageMaster.isSearching = false;
}

function showBrowseTab(index)
{
    typeIndex = index;
    $("#hidTabIndex").val(index);
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i <= 3; i++) {

        if (i == 1 || i == 2) {
            getObj("div1").style.display = "none";
        }
        else {
            getObj("div" + i).style.display = "none";
        }
    }

    if (index == 1 || index == 2||index==4) {
        getObj("div1").style.display = "block";
    } else {
        getObj("div" + index).style.display = "block";
    }

    $("#btnAdd,#btnEditPrice,#btnEdit,#btnSave,#btnExport,#btnImportForSalePrice,#btnImportLowcost,#btnCheck,#btnHistoryExport").hide();

    if (index == 1) {
        $("#btnEditPrice,#btnSave,#btnExport,#btnImportForSalePrice,#btnImportLowcost").show();
    }
    else if (index == 2||index==4) {
        $("#btnCheck").show();
    }
    else if (index == 3) {
        $("#btnHistoryExport").show();
    }
    else {
        $("#btnAdd,#btnEdit").show();
    }

    reloadData();
}


// 项目变更，加载楼栋
function project_change()
{
    var projID = $("#ddlProject").val();
    if (projID.length != 36) {
        alert('请选择公司下的项目！');
        $("#ddlBuilding").empty();
        return;
    }

    var vCTID = "";
    var vCID = "";
    //获取价格精度
    ajax(
           "VPriceAlter.aspx",
          { "action": "getPrecision", "projID": projID },
            "text",
           function (data, status)
           {
               data = $.stringToJSON(data);
               $("#hidTotalPriceSaveBit").val(data.TotalPriceSaveBit);
               $("#hidUnitPriceSaveBit").val(data.UnitPriceSaveBit);
           },
           true,
           "POST"
        );

    $.post('FillData.ashx', { action: 'CRM_BindBuildingOnly', ProjectGUID: projID },
     function (data, textStatus) { loadBuildingInfo(data, vCTID + '|' + vCID) }, 'json');

}


var loadBuildingInfo = function (data, vID)
{
    if (!!data) {
        bindDdl(data, 'ddlBuilding', "", "SELECT");
    }
    else {
        bindDdl([], "ddlBuilding", '', "SELECT");
    }
    // 重新加载楼栋
    building_change();
}

// 楼栋变更
function building_change()
{
    if (typeIndex == "undefined" || typeIndex == null) {
        showBrowseTab(1);
    }
    else {
        showBrowseTab(typeIndex);
    }
}

// 计价方式改变
function price_change(current)
{
    //设置为“已改动”
    var parent = $(current).parent().parent();
    if (typeIndex == 1) {
        parent.find("[signal='y']").attr("isalter", '1');
    }
    var priceConstruction = parent.find("[name$='Construction']");
    var priceInternal = parent.find("[name$='Internal']");
    var priceTotal = parent.find("[name$='Total']");
    var NowConstructionArea = parent.find("[name$='spanNowConstructionArea']").text();
    var NowInternalArea = parent.find("[name$='spanNowInternalArea']").text();
    var SalePriceType = parent.find("select").val(); //curVal;
    var TotalPriceSaveBit = $("#hidTotalPriceSaveBit").val();
    var UnitPriceSaveBit = $("#hidUnitPriceSaveBit").val();
    var currentPrice = $(current).val();

    var currentPrice = "";
    if (SalePriceType == "1") {
        currentPrice = priceConstruction.val();
        priceConstruction.removeAttr("readonly");
        priceInternal.attr("readonly", "readonly");
        priceTotal.attr("readonly", "readonly");
        //增加相应价格输入框焦点
        priceConstruction.focus();
    }
    else if (SalePriceType == "2") {
        currentPrice = priceInternal.val();
        priceConstruction.attr("readOnly", 'readonly');
        priceInternal.removeAttr("readOnly");
        priceTotal.attr("readOnly", "readonly");

        //增加相应价格输入框焦点
        priceInternal.focus();
    }
    else {
        currentPrice = priceTotal.val();
        priceConstruction.attr("readOnly", 'readonly');
        priceInternal.attr("readOnly", "readonly");
        priceTotal.removeAttr("readOnly");
        //增加相应价格输入框焦点
        priceTotal.focus();
    }

    reCalPrice(priceConstruction, priceInternal, priceTotal,
    SalePriceType, currentPrice, NowConstructionArea, NowInternalArea, TotalPriceSaveBit, UnitPriceSaveBit);

}

// 文本框改变
function textBox_change(current)
{
    var parent = $(current).parent().parent();
    var priceConstruction = parent.find("[name$='Construction']");
    var priceInternal = parent.find("[name$='Internal']");
    var priceTotal = parent.find("[name$='Total']");
    var NowConstructionArea = parent.find("[name$='spanNowConstructionArea']").text();
    var NowInternalArea = parent.find("[name$='spanNowInternalArea']").text();
    var SalePriceType = parent.find("select").val(); //curVal;
    var TotalPriceSaveBit = $("#hidTotalPriceSaveBit").val();
    var UnitPriceSaveBit = $("#hidUnitPriceSaveBit").val();
    var currentPrice = $(current).val();
    reCalPrice(priceConstruction, priceInternal, priceTotal,
    SalePriceType, currentPrice, NowConstructionArea, NowInternalArea, TotalPriceSaveBit, UnitPriceSaveBit);
}

function reCalPrice(priceConstruction, priceInternal, priceTotal,
SalePriceType, currentPrice, NowConstructionArea, NowInternalArea, TotalPriceSaveBit, UnitPriceSaveBit)
{
    var totalPrice, construPrice, interPrice;
    if (SalePriceType == 1) {//建筑面积
        totalPrice = accMul(currentPrice, NowConstructionArea);
        interPrice = accDiv(totalPrice, NowInternalArea);
        construPrice = currentPrice;
    } else if (SalePriceType == 2) {//套内  
        totalPrice = accMul(currentPrice, NowInternalArea);
        construPrice = accDiv(totalPrice, NowConstructionArea);
        interPrice = currentPrice;
    } else {//套
        construPrice = accDiv(currentPrice, NowConstructionArea);
        interPrice = accDiv(currentPrice, NowInternalArea);
        totalPrice = currentPrice;
    }

    priceConstruction.val(getAccountingNum(construPrice, UnitPriceSaveBit));
    priceInternal.val(getAccountingNum(interPrice, UnitPriceSaveBit));
    priceTotal.val(getAccountingNum(totalPrice, TotalPriceSaveBit));
}

// 输入验证：文本框只能输入数字 且 处理退格键与浏览器的冲突
function InputCheck(current)
{
    //设置为“已改动”
    //退换房价格审核和面积变更必须勾选复选框才能审核
    if (typeIndex != 2&&typeIndex!=4) {
        $(current).parent().parent().find("[signal='y']").attr("isalter", '1')
    }

    $("input[name$='Construction'],input[name$='Internal'],input[name$='Total']").keydown(
    function ()
    {
        var e = event || window.event;
        var code = parseInt(e.keyCode);
        if ($(this).attr("readonly") && code == 8) {
            return false;
        }
        if ((code > 95 && code < 106) ||                  //小键盘上的0到9  
            (code > 47 && code < 60) ||                  //大键盘上的0到9  
             code == 8 || code == 9 || code == 46 || code == 37 || code == 39 || code == 110 || code == 190) {
            return true;
        } else {
            return false;
        }

    });
}

// 获得焦点
function areaOnFocus(curr)
{
    setFocus();
    var val = $(curr).val();
    $(curr).val(RemoveComma(val));
}


// 保存：批量修改
function SaveOnChange()
{
    var alertRows = $("[isalter='1']");
    if (alertRows.length < 1) {
        alertMsg("没有要操作的数据！");
        return;
    }
    var arrayObj = new Array();
    alertRows.each(function (i)
    {
        var ctrl = $(this).parent().parent();
        var PriceType = ctrl.find("option:selected").val();
        var Construction = ctrl.find("input[name$='Construction']").val();
        var Internal = ctrl.find("input[name$='Internal']").val();
        var Total = ctrl.find("input[name$='Total']").val();

        var oriConstruction = ctrl.find("input[name$='Construction']").attr("originalValue");
        var oriInternal = ctrl.find("input[name$='Internal']").attr("originalValue");
        var oriTotal = ctrl.find("input[name$='Total']").attr("originalValue");
        var RoomID = $(this).val();
        arrayObj[i] = { r: RoomID, p: PriceType, c: Construction, i: Internal, t: Total,
            oriC: oriConstruction, oriI: oriInternal, oriT: oriTotal
        };

    })

    var strData = $.jsonToString(arrayObj);

    var vaction = "priceAdjust";
    if (typeIndex == 1) {
        vaction = "priceAdjust";
    } else if (typeIndex == 2) {
        vaction = "ChangeCancelRoomCheckPrice";
    }
    else if (typeIndex == 4) {
        vaction = "AreaChangeCheckPrice";
    }
    else {
        vaction = "priceAdjust";
    }
    alert(vaction);
    if (confirm("改操作将覆盖原有数据，确定要继续操作吗？")) {
        //调用ajax新增并刷新jqgird
        ajax(
           "VPriceAlter.aspx",
          { "action": vaction, "data": strData },
            "text",
           function (data)
           {
               if (data == "True") {
                   alert("操作成功！");
                   reloadData();
               } else {
                   alert("操作失败！");
               }
           },
           true,
           "POST"
        );
    }

}



// 刷新价格历史
function RefreshPriceHistory()
{
    var sProjectID = $("#ddlProject").val();
    var sBuildingIDList = $("#ddlBuilding").val();
    var sKey = $("#txtKey").val();
    query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList,
        Key: sKey, TabIndex: typeIndex, IsExportHistory: "Y"
    };
    if (loadJQGrid("jqPriceHistory", query)) {
        $('#jqPriceHistory').trigger('reloadGrid');
    }

}


// SearchKeyDown
function SearchKeyDown()
{
    if (window.event.keyCode == 13) {
        reloadData();
    }
}

// 新增价格方案
function addPriceScheme()
{
    var projectID = $("#ddlProject").val();
    if (projectID == "C") {
        return;
    }
    var projectName = ltrim($("#ddlProject").find("option:selected").text());
    openAddWindow("PricePlan/VPricePlanAdd.aspx?projectName=" + projectName + "&projectID=" + projectID, 800, 600);
}

// 价格方案列表
function RefreshPriceScheme()
{
    var queryParam = { ProjectID: $("#ddlProject").val(), TabIndex: typeIndex }

    if (loadJQGrid("jqPriceScheme", queryParam)) {
        $('#jqPriceScheme').trigger('reloadGrid');
    }
}

// 修改
function editPriceScheme()
{
    openModifyWindow("VPriceSchemeEdit.aspx", 800, 600, "jqPriceScheme");
}


// 批量设置补差方案
function SettingScheme()
{
    // 要修改的ID
    var id = "";
    $(":checked").each(function ()
    {
        if ($(this).val() != "on") {
            id += $(this).val() + ",";
        }
    }
    );
    var count = $(":checked").length;
    if (id == "" || (count == 1 && $(":checked").val() == "on")) {
        alert('请先勾选要设置的方案！');
        return;
    }
    else {
        id = id.substring(0, id.lastIndexOf(','));
    }

    // 要设置的值
    var value = openModalWindow("SettingScheme.aspx", 250, 180);
    if (value == undefined) {
        return;
    }

    // 修改下拉框
    $(":checked").each(function ()
    {
        var selectValue = $(this).parent().parent().find("select option[value='" + value + "']").attr("selected", true);
    });

    // ajax处理后台
    ajax('VPriceAlter.aspx', { action: 'BatchSetPriceType', id: id, value: value }, "text", function (data)
    {
        if (data == "True") {
            alert('操作成功！');
        } else {
            alert('操作失败！');
        }
        reloadData();
    });
}




function ExportAdjust()
{
    if (typeIndex != 0 && typeIndex != 2) {
        var sProjectID = $("#ddlProject").val();
        var sBuildingID = $("#ddlBuilding").val();
        var sKey = $("#txtKey").val();

        // 无条件时，省略第二个参数
        if (sBuildingID == "" || sBuildingID == "null") {
            sBuildingID = "00000000-0000-0000-0000-000000000000";
        }

        var query = { ProjectID: sProjectID, BuildingID: sBuildingID, Key: sKey, searchKey: $("#txtSearch").val(), TabIndex: "1", isExport: "Y" };
        reloadGridData("idPager", query);
    }
}


function renderLink(cellvalue, options, rowobject)
{
    var url = '<a target="_blank" href=VPriceSchemeEdit.aspx?ID=' + rowobject[0] + '>' + cellvalue + '</a>';
    return url;
}

// 设置光标位置在最后
function setFocus()
{
    var obj = event.srcElement;
    var txt = obj.createTextRange();
    txt.moveStart('character', obj.value.length);
    txt.collapse(true);
    txt.select();
}

// 去除逗号和小数点
function RemoveComma(str)
{
    var tmp = str;
    if (tmp.indexOf('.')) {
        var tmp = str.split('.')[0];
    }
    return tmp.replace(/\,/g, "");
}


function onCheckClick(obj, callback)
{
    var Row = obj.parentNode.parentNode;
    selectRow(obj);
    //推换房变更要反填价格，反填时设置改动标识
    if (typeIndex == "2") {
        if (typeof callback == "function") {
            callback(Row);
        }
    }
    //面积变更要设置改动标识
    if (typeIndex == "4")
    {
        $(Row).find("[signal='y']").attr("isalter", "1");
    }
}

function onAllCheckClick(chk)
{
    var chkArray = getObjs("chkIDV3");
    if (chkArray.length < 1) {
        return false;
    }
    for (var i = 0; i < chkArray.length; i++) {
        var row = chkArray(i).parentNode.parentNode;
        if (chkArray(i).checked != chk.checked) {

            if (typeIndex == "2") {
                chkArray(i).checked = chk.checked;
                fillDataToCheckedRow(row);
            }
            else {
                if ($(row).attr("disabled").toString() != "true") {
                    chkArray(i).checked = chk.checked;
                    selectRowFromSelectAll(chkArray(i));
                }
            }
            //面积变更要设置改动标识
            if (typeIndex == "4") {
                $(row).find("[signal='y']").attr("isalter", "1");
            }
        }
    }
}

//推换房时复选框单击事件
function fillDataToCheckedRow(Row)
{
    Row = $(Row);
    var currentSignal = Row.find("[signal='y']").attr("isalter");
    if (currentSignal == "1") {
        Row.find("[signal='y']").attr("isalter", "0");
    }
    else {
        Row.find("[signal='y']").attr("isalter", "1");
    }
    var Construction = Row.find("input[id$='Construction']");
    var Internal = Row.find("input[id$='Internal']");
    var Total = Row.find("input[id$='Total']");
    if (Row.find("input[id='chkIDV3']").attr('checked') == true) {
        Construction.val(Construction.attr("LastValue"));
        Internal.val(Internal.attr("LastValue"));
        Total.val(Total.attr("LastValue"));
    }
    else {
        Construction.val(Construction.attr("originalValue"));
        Internal.val(Internal.attr("originalValue"));
        Total.val(Total.attr("originalValue"));
    }
}

function FillBuildingGUID()
{
    var sBuildingIDList = $("#ddlBuilding").val();
    $("#hidBuildingGUID").val(sBuildingIDList);
}

function OpenImportPrice(priceType)
{
    var sProjectID = $("#ddlProject").val();
    var sProjectName = $("#ddlProject").find("option:selected").text();
    var url = "VImportPrice.aspx?ProjectID=" + sProjectID + "&ProjectName=" + encodeURI(sProjectName);
    if (priceType == 2) {
        url += "&priceType=dj001";
    }
    else {
        url += "&priceType=bzj002";
    }
    openAddWindow(url, 750, 350);
}