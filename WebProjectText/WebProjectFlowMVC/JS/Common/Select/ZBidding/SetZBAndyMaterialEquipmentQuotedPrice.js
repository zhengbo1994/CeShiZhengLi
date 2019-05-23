///-----------------------------------------------------------//
/// <reference path="../../../jquery-1.4.2-vsdoc.js" />

// VSetZBAndyMaterialEquipmentQuotedPrice.aspx等页面的JS文件
// 作者：王勇
// 时间：2010年7月15日 11:11:34
//
//-----------------------------------------------------------//


var initPageData = function ()
{
    if (hidGoodPrice.value.length > 0)
    {
        initTableData(hidGoodPrice.value);
    }
}

//getTextBoxHtml(txtID, length, onfocus, onblur, value, readonly)
//getTextAreaHtml(txtID, length, height, value)
var initTableData = function (value)
{
    clearTable(dgData);
    var vGoodPrice = value.split('^');
    var cn = vGoodPrice.length;
    for (var i = 0; i < cn; i++)
    {
        var vGoodPrices = vGoodPrice[i].split('|');

        var row = dgData.insertRow();

        var cell = row.insertCell(0);
        cell.align = "center";
        cell.innerHTML = getCheckBoxHtml();

        cell = row.insertCell(1);
        cell.innerHTML = getTextBoxHtml('', 0, '', '', vGoodPrices[0]);

        cell = row.insertCell(2);
        cell.innerHTML = getTextBoxHtml('', 0, '', '', vGoodPrices[1]);

        cell = row.insertCell(3);
        cell.innerHTML = getTextAreaHtml('', 0, 0, vGoodPrices[2]);

        cell = row.insertCell(4);
        cell.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">'
                        + '<tr><td style="width:30%"><span class="font">产地</span></td><td>' + getTextBoxHtml('', 0, '', '', vGoodPrices[3]) + '</td></tr>'
                        + '<tr><td><span class="font">颜色</span></td><td>' + getTextBoxHtml('', 0, '', '', vGoodPrices[4]) + '</td></tr>'
                        + '<tr><td><span class="font">材质</span></td><td>' + getTextBoxHtml('', 0, '', '', vGoodPrices[5]) + '</td></tr></table>';

        cell = row.insertCell(5);
        cell.innerHTML = getTextAreaHtml('', 0, 0, vGoodPrices[6]);

        cell = row.insertCell(6);
        cell.innerHTML = getTextBoxHtml('', 0, '', '', vGoodPrices[7]);

        var txtIDQTY = getUniqueKey("txt");
        var txtIDPrice = getUniqueKey("txt");
        var txtAmount = getUniqueKey("txt");

        cell = row.insertCell(7);
        cell.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">'
                        + '<tr><td style="width:30%"><span class="font">数量</span></td><td>' + getTextBoxHtml(txtIDQTY, 0, '', stringFormat("setNonMinusIntNum();calculator('{0}','{1}','{2}')", txtIDQTY, txtIDPrice, txtAmount), vGoodPrices[8]) + '</td></tr>'
                        + '<tr><td><span class="font">单价</span></td><td>' + getTextBoxHtml(txtIDPrice, 0, '', stringFormat("setMoneyValue(2);calculator('{0}','{1}','{2}')", txtIDQTY, txtIDPrice, txtAmount), vGoodPrices[9]) + '</td></tr>'
                        + '<tr><td><span class="font">金额</span></td><td>' + getTextBoxHtml(txtAmount, 0, '', '', vGoodPrices[10], true) + '</td></tr></table>';

        var txtID = getUniqueKey("txt");
        var hidID = getUniqueKey("hid");
        var btnID = getUniqueKey("btn");

        //getSelectHtml(theme, txtID, hidID, btnID, onclick, text, value)
        cell = row.insertCell(8);
        cell.innerHTML = getSelectHtml(varTheme, txtID, hidID, btnID, stringFormat("selectCOS('{0}','{1}')", txtID, hidID), vGoodPrices[11], vGoodPrices[12]);

        var selID = getUniqueKey("sel");
        cell = row.insertCell(9);
        cell.innerHTML = '<select id=' + selID + ' style="width:98%"></select>';

        fillDataToDDLQCType(selID, vGoodPrices[13]);

        // 重新设置各行的样式(区分奇偶行)和事件
        setTableRowAttributes(dgData);
    }

    calculatorAmount();
}


// 删除表格行
function delDetail(table)
{
    // 删除表格中复选框选中的行
    deleteTableRow(table);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);

    calculatorAmount();
}

function calculator(txtQtyi, txtPricei, txtAmounti)  //计算金额及总额的方法
{
    var qty = getObj(txtQtyi).value;
    var price = getObj(txtPricei).value;
    var flag = 1;

    if (qty == "")
    {
        flag = 0;
        getObj(txtQtyi).value = "0";
        getObj(txtAmounti).value = "0.00";
    }
    if (price == "")
    {
        flag = 0;
        getObj(txtPricei).value = "0.00";
        getObj(txtAmounti).value = "0.00";
    }
    if (flag == 1)
    {
        getObj(txtAmounti).value = getMoneyValue(getRound(qty * getRound(price, 2), 2));
    }

    calculatorAmount();
}

function calculatorAmount()
{
    var sumAmount = 0;
    var amount = 0;
    var cnt = dgData.rows.length;
    for (var j = 1; j < cnt; j++)
    {
        amount = getObjTR(dgData, j, "input", 9).value;
        sumAmount += getRound(amount, 2);
    }
    getObj('txtSumAmount').value = getMoneyValue(getRound(sumAmount, 2));
}

function addDetail(table)
{
    var row = table.insertRow();

    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml();

    cell = row.insertCell(1);
    cell.innerHTML = getTextBoxHtml();

    cell = row.insertCell(2);
    cell.innerHTML = getTextBoxHtml();

    cell = row.insertCell(3);
    cell.innerHTML = getTextAreaHtml();

    cell = row.insertCell(4);
    cell.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">'
                    + '<tr><td style="width:30%"><span class="font">产地</span></td><td>' + getTextBoxHtml() + '</td></tr>'
                    + '<tr><td><span class="font">颜色</span></td><td>' + getTextBoxHtml() + '</td></tr>'
                    + '<tr><td><span class="font">材质</span></td><td>' + getTextBoxHtml() + '</td></tr>';

    cell = row.insertCell(5);
    cell.innerHTML = getTextAreaHtml();

    cell = row.insertCell(6);
    cell.innerHTML = getTextBoxHtml();

    var txtIDQTY = getUniqueKey("txt");
    var txtIDPrice = getUniqueKey("txt");
    var txtAmount = getUniqueKey("txt");

    cell = row.insertCell(7);
    cell.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">'
                    + '<tr><td style="width:30%"><span class="font">数量</span></td><td>' + getTextBoxHtml(txtIDQTY, 0, '', stringFormat("setNonMinusIntNum();calculator('{0}','{1}','{2}')", txtIDQTY, txtIDPrice, txtAmount)) + '</td></tr>'
                    + '<tr><td><span class="font">单价</span></td><td>' + getTextBoxHtml(txtIDPrice, 0, '', stringFormat("setMoneyValue(2);calculator('{0}','{1}','{2}')", txtIDQTY, txtIDPrice, txtAmount)) + '</td></tr>'
                    + '<tr><td><span class="font">金额</span></td><td>' + getTextBoxHtml(txtAmount, 0, '', '', 0, true) + '</td></tr>';

    var txtID = getUniqueKey("txt");
    var hidID = getUniqueKey("hid");
    var btnID = getUniqueKey("btn");

    cell = row.insertCell(8);
    cell.innerHTML = getSelectHtml(varTheme, txtID, hidID, btnID, stringFormat("selectCOS('{0}','{1}')", txtID, hidID));

    var selID = getUniqueKey("selID");
    cell = row.insertCell(9);
    cell.innerHTML = '<select id=' + selID + ' style="width:98%"></select>';

    fillDataToDDLQCType(selID);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
}

//导入材料设备报价清单
function exportGoodPrice()
{
    var projectID = getObj('hidProjectID').value;
    openModalWindow('/' + rootUrl + '/Common/Select/ZBidding/VSetZBAndyMaterialEquipmentQuotedPriceInput.aspx?ProjectID=' + projectID, 480, 200);
    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(dgData);
    calculatorAmount();
}

//选择供应商
var selectCOS = function (txtID, hidID)
{
    var rValue = openModalWindow('/' + rootUrl + '/Common/Select/VSelectSingleCOS.aspx', 0, 0);
    if (!rValue)
        return;
    getObj(txtID).value = rValue.split("|")[1];
    getObj(hidID).value = rValue.split("|")[0];
}

//可以批量设置供应商
var setCOS = function ()
{
    if (dgData.rows.length > 1)
    {
        var flag = false;
        for (var i = 1; i < dgData.rows.length; i++)
        {
            if (getObjTR(dgData, i, "input", 0).checked)
            {
                flag = true;
                break;
            }
        }
        if (!flag)
        {
            return alertMsg("请选择需要设置供应商的材料");
        }
        var rValue = openModalWindow('~/Common/Select/VSelectSingleCOS.aspx', 0, 0);
        if (!rValue)
            return;
        for (var i = 1; i < dgData.rows.length; i++)
        {
            if (getObjTR(dgData, i, "input", 0).checked)
            {
                getObjTR(dgData, i, "input", 10).value = rValue.split('|')[1];
                getObjTR(dgData, i, "input", 11).value = rValue.split('|')[0];
            }
        }
    }
}

var ddlQCType = null;
var ddlValue = "";

var fillDataToDDLQCType = function (ddlID, value)
{
    ddlQCType = getObj(ddlID);
    ddlValue = value != null ? value : "";
    $.ajax(
    {
        url: "FillData.ashx",
        data: { action: "GetQCType", ProjectID: getObj("hidProjectID").value },
        dataType: "json",
        async: false,
        success: setDgData,
        error: ajaxError,
        beforeSend: function () { },
        complete: function () { }
    });
}
function setDgData(data, status)
{
    if (ddlQCType != null)
    {
        for (var i = ddlQCType.length - 1; i >= 0; i--)
        {
            ddlQCType.remove(i);
        }
        var opts = document.createElement("OPTION");
        opts.value = "";
        opts.text = "请选择";
        ddlQCType.add(opts, ddlQCType.length);
        if (data != null && data.Count > 0)
        {
            for (var i = 0; i < data.Count; i++)
            {
                var opt = document.createElement("OPTION");
                opt.value = data.Nodes[i].ID;
                opt.text = data.Nodes[i].Name;
                ddlQCType.add(opt, ddlQCType.length);
            }
        }
        if (ddlQCType.options.length > 0)
        {
            for (var i = 0; i < ddlQCType.options.length; i++)
            {
                if (ddlValue == ddlQCType.options[i].value)
                {
                    ddlQCType.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

function btnSubmit_Click()
{
    var cn = dgData.rows.length;
    hidGoodPrice.value = "";
    if (cn < 2)
    {
        return alertMsg("必须至少选择一个供应商材料", getObj("btnAddDetail"));
    }
    var vtxtMNo = "", vtxtMName = "", vtxtMUnit = "", vtxtMQty = "", vtxtMPrice = "", vtxtMCOSName = "", vtxtMQCTID = "";
    for (var i = 1; i < cn; i++)
    {
        vtxtMNo = getObjTR(dgData, i, "input", 1);
        if (vtxtMNo.value == "")
        {
            return alertMsg("材料编号必须填写", vtxtMNo);
        }
        for (var index = 1; index < cn; index++)
        {
            if ((index != i) && vtxtMNo.value == getObjTR(dgData, index, "input", 1).value)
            {
                return alertMsg("材料编号不能重复", getObjTR(dgData, index, "input", 1));
            } 
        }
        
        vtxtMName = getObjTR(dgData, i, "input", 2);
        if (vtxtMName.value == "")
        {
            return alertMsg("材料名称必须填写", vtxtMName);
        }
        vtxtMUnit = getObjTR(dgData, i, "input", 6);
        if (vtxtMUnit.value == "")
        {
            return alertMsg("单位必须填写", vtxtMUnit);
        }
        vtxtMQty = getObjTR(dgData, i, "input", 7);
        if (vtxtMQty.value == "")
        {
            return alertMsg("数量必须填写", vtxtMQty);
        }
        vtxtMPrice = getObjTR(dgData, i, "input", 8);
        if (vtxtMPrice.value == "")
        {
            return alertMsg("价格必须填写", vtxtMPrice);
        }
        vtxtMCOSName = getObjTR(dgData, i, "input", 10);
        if (vtxtMCOSName.value == "")
        {
            return alertMsg("供应商必须填写", vtxtMCOSName);
        }
        vtxtMQCTID = getObjTR(dgData, i, "select", 0);
        if (vtxtMQCTID.value == "")
        {
            return alertMsg("请选择材料的供应方式", vtxtMQCTID);
        }

        //^MENo|MEName|Size|Origin|Color|Material|PerformanceParas|Unit|Qty|Price|Amount|COSName|COSID|QCTID|OCTName
        hidGoodPrice.value = hidGoodPrice.value + "^" + vtxtMNo.value + "|" + vtxtMName.value + "|" + getObjTR(dgData, i, "textarea", 0).value + "|" +
                                             getObjTR(dgData, i, "input", 3).value + "|" + getObjTR(dgData, i, "input", 4).value + "|" +
                                             getObjTR(dgData, i, "input", 5).value + "|" + getObjTR(dgData, i, "textarea", 1).value + "|" +
                                             vtxtMUnit.value + "|" + vtxtMQty.value + "|" + vtxtMPrice.value + "|" + getObjTR(dgData, i, "input", 9).value + "|" +
                                             vtxtMCOSName.value + "|" + getObjTR(dgData, i, "input", 11).value + "|" + vtxtMQCTID.value + "|" + vtxtMQCTID.options[vtxtMQCTID.selectedIndex].text;
    }
    if (hidGoodPrice.value.length > 0)
    {
        hidGoodPrice.value = hidGoodPrice.value.substr(1);
        window.close();
    }
    else
    {
        alert("至少选择一个材料");
        return;
    }
}