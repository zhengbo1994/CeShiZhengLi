
/*
票据领用与票据核销JS前台文件
添加日期：2013-05-24
添加人：杨亮
*/


//验证表单
function validateFrom() {
    var isContinue = true;
    if ($("#hidIsRecipients").val() == "1")
    {
        isContinue=confirm("部分票据已被领用,已领用的不会重复领用,是否继续?");
    }
    if ($("#hidIsRecipients2").val() == "1") {
        isContinue = confirm("部分票据已被核销,已核销的不会重复核销,是否继续?");
    }
    if (!isContinue) return;

    setBtnEnabled(['btnSaveClose', 'btnCancel'], false);
    if ($.ideaValidate()) {
        setBtnEnabled(['btnSaveClose', 'btnCancel'], true);
        return true;
    }
    else {
        setBtnEnabled(['btnSaveClose', 'btnCancel'], true);
        return false;
    }
    return true;
}

//选择领用人
function selectAccount() {
    var rValue = openModalWindow('../../../../Common/Select/VSelectSingleAccount.aspx', 800, 600);
    if (!!rValue) {
        $("#txtRecipientsAccoutName").val(rValue.Name);
        $("#hidRecipientsAccoutGUID").val(rValue.ID);
        
    }
}

//点击 整本领用或分段领用
function changeRange(val) {
    if (val == "1") {//整本领用
        $("#txtBeginNO").attr("disabled", "none");
        $("#txtEndNO").attr("disabled", "none");
        $("#txtBeginNO").val($("#hidBeginNO").val());
        $("#txtEndNO").val($("#hidEndNO").val());
    } else if (val == "2")
    {
        $("#txtBeginNO").removeAttr("disabled");
        $("#txtEndNO").removeAttr("disabled");
    }
}

/* 设置正整数-onblur.  重写IdeaSoft.js的setPlusIntNum()方法
min：不能小于最小值
max: 不能大于最大值
*/
function setPlusIntNum() {
    var txt = getEventObj();
    txt.value = parseInt( getPlusIntNum(txt.value),10);
    var min =parseInt( $("#hidBeginNO").val(),10);
    var max =parseInt( $("#hidEndNO").val(),10);
    if (txt.value > max || txt.value < min) {
        alertMsg("请录入从 " + min + " 到 " + max + " 之间的数字！", txt);
    }
}

