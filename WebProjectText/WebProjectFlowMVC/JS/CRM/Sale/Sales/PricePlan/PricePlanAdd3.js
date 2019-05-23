var dgFactor = undefined;
$(function () {
    dgFactor = ctl00_FormArea_dgFactor;
    ReviewFactorTable();
});
//添加行
function btnDgAdd_onclick() {
    var name = getUniqueKey();

    var row = dgFactor.insertRow();

    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml(name);

    cell = row.insertCell(1);
    cell.innerHTML = getTextBoxHtml("txtName" + name, 30);

    cell = row.insertCell(2);
    cell.innerHTML = getDropdownHtml("ddlArithmetic" + name, [{ 'text': '差价', 'value': '1' }, { 'text': '系数', 'value': '2'}]);

    cell = row.insertCell(3);
    cell.innerHTML = getTextBoxHtml("txtDefaultVlue" + name, 15, '', "ToFixed(this)", null, null, null, "Right");

    $("#optSelectAll").removeAttr("checked");

    $("input[id^=txtName]").unbind("blur");
    $("input[id^=txtName]").blur(function (e) { checkFactorName(e) }); //绑定重名检查方法
    $("select").unbind("change");
    $("select").change(function (e) { checkValue(e) });
    return row;
}

//重现返回的因素数据
function ReviewFactorTable() {
    var arithmetics = $("#hidArithmeticValue").val();
    if (arithmetics != undefined && arithmetics != null && arithmetics.length > 0) {
        var arithmeticList = arithmetics.split(';');
        for (var i = 0; i < arithmeticList.length; i++) {
            var arithmeticItem = arithmeticList[i].split(',');
            var thisRow = btnDgAdd_onclick();
            $(thisRow).find("input:eq(1)").val(arithmeticItem[0]);
            $(thisRow).find("select").val(arithmeticItem[1]);
            $(thisRow).find("input:eq(2)").val(arithmeticItem[2]);
        }
    }
}

//删除行
function btnDgDelete_onclick() {
    var cnt = dgFactor.rows.length - 1;

    for (j = cnt; j > 0; j--) {
        if (dgFactor.rows(j).getElementsByTagName("input").item(0).checked) {
            dgFactor.deleteRow(j);
        }
    }
    dgFactor.rows(0).getElementsByTagName("input").item(0).checked = false;
}

//格式化数字为2位小数
function ToFixed(obj) {
    if (obj.value != undefined && obj.value.length > 0) {
        var val = parseFloat(obj.value);
        if (val == undefined || isNaN(val)) {
            val = 0;
        }
        obj.value = val.toFixed(2);
        var type = $(obj).parent().prev().find("select").val();
        if (type == '2') {
            if (obj.value < 0) {
                alert("系数值不能小于0!");
                obj.focus();
            }
        }
    }
}

//提交数据
function PricePlanAddStep4_Click() {
    var itemLength = $("#ctl00_FormArea_dgFactor tr").length;
    var keyValue = "";
    if (itemLength <= 1) {
        alert("请增加价格因素!");
        return false;
    }
    else {
        var isPost = true;
        $("#ctl00_FormArea_dgFactor tr:gt(0)").each(function () {
            var name = $(this).children(":eq(1)").find("input").val();
            var type = $(this).children(":eq(2)").find("select").val();
            var value = $(this).children(":eq(3)").find("input").val();
            if (name == undefined || name.length <= 0 || (type != "1" && type != "2") || value == undefined || isNaN(parseFloat(value))) {
                isPost = false;
                alert("价格因素输入不完整!");
                return false;
            }
            if (name.indexOf(";") > -1 || name.indexOf(",") > -1) {
                isPost = false;
                alert("输入不能包含,;等符号!");
                return false;
            }
            if (type == "2" && parseFloat(value) <= 0) {
                isPost = false;
                alert("价格因素系数值不能为小于等于0!");
                return false;
             }
            keyValue += $.trim(name) + "," + type + "," + $.trim(value) + ";";
        });
        if (!isPost) {
            return false;
        }
        else {
            if (keyValue.length > 0) {
                keyValue = keyValue.substr(0, keyValue.length - 1);
                $("#hidArithmeticValue").val(keyValue);
                return true;
            }
        }
    }
}

//检查系数时选项值是否小于0
function checkValue(e) {
    var obj = e.currentTarget;
    var thisTarget=$(obj).parent().next().find("input");
    var thisValue = $(thisTarget).val();
    if ($(obj).val() == "2" && thisValue.length > 0 && parseFloat(thisValue) < 0) {
        alert("系数值不能小于0!");
        thisTarget.focus();
    }
}

//检查因素名称是否重名
function checkFactorName(e) {
    var obj = e.currentTarget;
    var value = $(obj).val();
    if (value != undefined && $.trim(value) != '') {
        var id = $(obj).attr("id");
        var isChecked = true;
        $("input[id^=txtName]").each(function () {
            if (this.id != id) {
                var value2 = this.value;
                if ($.trim(value) == $.trim(value2)) {
                    isChecked = false;
                    return false;
                }
            }
        });
        if (!isChecked) {
            alert("因素名称不能相同!");
            $(obj).focus();
        }
    }
}