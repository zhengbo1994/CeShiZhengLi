$(function () {

    //初始化页面
    changeText();

    $("input[type=radio]").click(function (e) {
        var eve = e.currentTarget;
        var eve_id = $(eve).attr("id");
        if (eve_id == "ctl00_FormArea_rdChangePrice") {
            $(".Calculate_Price").attr("readonly", "readonly");
            $(".Calculate_Price").css("background-color", "gray");
            $("input[name=ctl00$FormArea$Calculate_PriceType]").attr("readonly", "readonly");
            $("#btnStep4_tb").show();
            $("#btnNextStep_tb").hide();
            $("input[name=ctl00$FormArea$Calculate_PriceType]").attr("disabled", "disabled");

        }
        else if (eve_id == "ctl00_FormArea_rdResetPrice") {
            $(".Calculate_Price").removeAttr("readonly");
            $(".Calculate_Price").css("background-color", "white");
            changeText();
            $("#btnNextStep_tb").show();
            $("#btnStep4_tb").hide();
            $("input[name=ctl00$FormArea$Calculate_PriceType]").removeAttr("disabled", "disabled");
        }
        else if (eve_id == "ctl00_FormArea_rdTotalPrice") {
            if ($("#ctl00_FormArea_rdResetPrice").attr("checked") == true) {
                $("#ctl00_FormArea_txtTotalPrice").removeAttr("readonly");
                $("#ctl00_FormArea_txtTotalPrice").css("background-color", "white");
                $("#ctl00_FormArea_txtUnitPrice").attr("readonly", "readonly")
                $("#ctl00_FormArea_txtUnitPrice").css("background-color", "gray");
            }
        }
        else if (eve_id == "ctl00_FormArea_rdUnitPrice") {
            if ($("#ctl00_FormArea_rdResetPrice").attr("checked") == true) {
                $("#ctl00_FormArea_txtUnitPrice").removeAttr("readonly");
                $("#ctl00_FormArea_txtUnitPrice").css("background-color", "white");
                $("#ctl00_FormArea_txtTotalPrice").attr("readonly", "readonly");
                $("#ctl00_FormArea_txtTotalPrice").css("background-color", "gray");
            }
        }
    });
});

//切换文本框状态
function changeText() {
    var method = $("input[name=ctl00$FormArea$Calculate_MethodType]:checked").val();
    switch (method) {
        case "1":
            $("#btnStep4_tb").hide();
            var childValue = $("input[name=ctl00$FormArea$Calculate_PriceType]:checked").val();
            $("input[name=ctl00$FormArea$Calculate_PriceType]").removeAttr("disabled", "disabled");
            switch (childValue) {
                case "1":
                    $("#ctl00_FormArea_txtTotalPrice").removeAttr("readonly");
                    $("#ctl00_FormArea_txtTotalPrice").css("background-color", "white");
                    $("#ctl00_FormArea_txtUnitPrice").attr("readonly", "readonly")
                    $("#ctl00_FormArea_txtUnitPrice").css("background-color", "gray");
                    break;
                case "2":
                    $("#ctl00_FormArea_txtUnitPrice").removeAttr("readonly");
                    $("#ctl00_FormArea_txtUnitPrice").css("background-color", "white");
                    $("#ctl00_FormArea_txtTotalPrice").attr("readonly", "readonly");
                    $("#ctl00_FormArea_txtTotalPrice").css("background-color", "gray");
                    break;
            }
            break;
        case "2":
            $("#ctl00_FormArea_txtTotalPrice").attr("readonly", "readonly");
            $("#ctl00_FormArea_txtTotalPrice").css("background-color", "gray");
            $("#ctl00_FormArea_txtUnitPrice").attr("readonly", "readonly")
            $("#ctl00_FormArea_txtUnitPrice").css("background-color", "gray");
            $("input[name=ctl00$FormArea$Calculate_PriceType]").attr("disabled", "disabled");
            $("#btnStep4_tb").show();
            $("#btnNextStep_tb").hide();
            break;
    }
}

function pricePlanAddStep3_Click() {
    $("#hidPricePlanCalculateMethodType").val("1");
    var childValue = $("input[name=ctl00$FormArea$Calculate_PriceType]:checked").val();
    $("#hidPricePlanCalculatePriceType").val(childValue);
    var price = "";
    switch (childValue) {
        case "1":
            price = $("#ctl00_FormArea_txtTotalPrice").val();
            break;
        case "2":
            price = $("#ctl00_FormArea_txtUnitPrice").val();
            break;
    }
    if (price.length <= 0) {
        alert("请完成相应输入!");
        return false;
    }
    else {
        price = parseFloat(price);
        if (price > 0) {
            $("#hidPricePlanCalculatePrice").val(price.toFixed(2));
            return true;
        }
        else {
            alert("金额必须大于0!");
            return false;
         }
    }
}

function pricePlanAddStep4_Click() {
    $("#hidPricePlanCalculateMethodType").val("2");
    var keyValue = '';
    $("#ctl00_trBtn td input[type=hidden]").each(function () {
        var id = this.id;
        if (id != "hidPageControlKeyValue") {
            var value = this.value;
            keyValue += id + ":::" + value + ";";
        }
    });
    if (keyValue.length > 0) {
        keyValue = keyValue.substr(0, keyValue.length - 1);
    }
    $("#hidPageControlKeyValue").val(keyValue);
    return true;
}

//格式化数字为2位小数
function toFixed(obj) {
    if (obj.value != undefined && obj.value.length > 0) {
        var val = parseFloat(obj.value);
        if (val == undefined || isNaN(val)) {
            val = 0;
        }
        obj.value = val.toFixed(2);
    }
}