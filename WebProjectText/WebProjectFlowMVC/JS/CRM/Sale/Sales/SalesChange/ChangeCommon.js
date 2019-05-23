//根据隐藏控件hidAction的值控制页面控件的读写属性。
function enableControl() {
    //输出折扣说明

    //exportDiscountFormulaDescriptionForBase();
    exportDiscountFormulaDescription();
    var action = getObj("hidAction").value;

    disabledFormElements("trBaseInfo", null, "#txtSaleDiscountExplain");
    if (action == "Add") {
        //新增：基本信息trBaseInfo只读
        //显示提交和取消按钮
        showContorlByID("#btnSaveSubmit,#btnCancel");
        disabledFormElements("trChangeCheckInfo");    

    } else if (action == "Edit") {
        //编辑：只显示保存和取消按钮
        showContorlByID("#btnSave,#btnCancel,#btnDelete");
        disabledFormElements("trChangeCheckInfo");
    } else if (action == "Check") {
        //编辑：只显示审批和取消按钮
        disabledFormElements("trChangeInfo");
        //价格变更
        disabledFormElements("trChangeDetail");
        //特批折扣
        disabledFormElements("trSpecial");
        disabledFormElements("trAfter");
        //换房变更
        disabledFormElements("trChangeRoomInfo");
        disabledFormElements("trAttachRoom");

        //审核通过，不通过显示取消审核与取消按钮，已执行的只显示取消按钮
        var status=getObj("hidStatus").value
        if (status == "0") //待审核
        {
            showContorlByID("#btnCheck,#btnCancel"); 

        }
        else if (status == "4"||status=="3") //已执行或者审核不通过，只显示取消按钮，并且不能编辑
        {
            showContorlByID("#btnCancel");
            disabledFormElements("trChangeCheckInfo");
        }
        else if(status=="2") //已审核，显示取消审核与取消按钮，也不能编辑
        {
            showContorlByID("#btnCancelCheck,#btnCancel");
            disabledFormElements("trChangeCheckInfo");
        }        

    } else {
        $('button[type=button]').hide();
    }
}

//显示指定id的控件
function showContorlByID(ctrlIDs) {
    $('button[type=button]').not('#btnRoomName,#btnClientName,#BtnSaleDiscountRate,#btnAddAttachRoom,#btnDeleteAttachRoom').hide();
    if (ctrlIDs != "" && ctrlIDs != null) {
        $(ctrlIDs).show();
    }
    $("button[id=BtnDiscountRate]").show();
}

//格式化
function format(currentCtrl) {
    var value = $(currentCtrl).val();
    //去掉逗号
    value = value.replace(/\,/g, "");
    $(currentCtrl).val(formatAmount(value));
}

//作废
function CancelChange() {
    if (!confirm("确定要作废该变更申请吗?")) return;
    handleBtn(false);

    //获取表单数据并提交后台处理
    var SalesChangeID = getObj("hidChangeID").value;
    var SalesOrderID = getObj("hidSalesOrderID").value;
    ajax(location.href, { vaction: "Cancel", vSalesChangeGUID: SalesChangeID,
        vSalesOrderID: SalesOrderID
    }, "text", function (data, stu) {
        alertMsg(data == "success" ? "操作成功！" : data);
        window.returnValue = data;
        closeMe();
    });
    handleBtn(true);
}

//控制按钮的可操作性
function handleAllBtn(enable) {
    if (enable) {
        $('button[type=button]').removeAttr('disabled');
    } else {
        $('button[type=button]').attr('disabled', 'disabled');
    }
}

// 设置数字控件的值
function setNumberCtrlValueWithPrecision(ele, value) {
    if (!ele || !$(ele).length) {
        return false;
    }

    // 当没有设置小数位时，默认为2位小数。
    var ele = $(ele),
        precision = isNaN($(ele).attr('precision')) ? 2 : $(ele).attr('precision');

    ele.val(getAccountingNum(value, precision));
}

//控制按钮
function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveSubmit"), enabled);
    setBtnEnabled(getObj("btnSave"), enabled);
    setBtnEnabled(getObj("btnCheck"), enabled);
    setBtnEnabled(getObj("btnRefuse"), enabled);
    setBtnEnabled(getObj("btnDelete"), enabled);
    setBtnEnabled(getObj("btnCancel"), enabled);
}

// 输出折扣公式描述
function exportDiscountFormulaDescriptionForBase() {

    var hidDiscountInfoContainer = $('#hidDiscountInfoContainer'),
        discountDetailInfoArray = $.parseJSON(hidDiscountInfoContainer.val()),
        ddlPayType = $('#ddlPayType'),
        strPayTypeGUID = ddlPayType.val(),
        strPayTypeName = ddlPayType.find('option[selected]').text(),
        payTypeDiscountRate = $('#hidPayTypeDiscountRate').val();
    $('#txtSaleDiscountExplain').val(buildDiscountFormulaDescription(strPayTypeGUID, 
    strPayTypeName, payTypeDiscountRate,discountDetailInfoArray));
}


//公用提交输入判断,没问题返回true，否则返回flase;
function checkChangeCommonRequired()
{
    if (getObj("txtCreaterName").value == "") {
        isValid = alertMsg("申请人不能为空", getObj("txtCreaterName"));
        handleBtn(true);
        return isValid;
    }
    if (getObj("ddlReasonType").value == "") {
        isValid = alertMsg("变更原因不能为空", getObj("ddlReasonType"));
        handleBtn(true);
        return isValid;
    }
    return true;
}




function check()
{
    var isAgree = $('#rblCheckResult input:checked').val();
    if (isAgree == "") {
        alertMsg("审核结果不能为待审核");
        return;
    }
    if (isAgree == "N") {
        if (!confirm("该操作不能恢复，确定要继续执行吗?")) return;
    }
    var remark = $("#txtCheckRemark").val();
    handleBtn(false);
    ajax(location.href, { vaction: "Check", isAgree: isAgree, vRemark: remark }, "text", function (data, stu)
    {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        window.returnValue = data;
        if (data == "success") {
            closeMe();
        }
    });
    handleBtn(true);
}

function cancelCheck()
{
   
    handleBtn(false);
    ajax(location.href, { vaction: "CancelCheck" }, "text", function (data, stu)
    {
        alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        window.returnValue = data;
        if (data == "success") {
            closeMe();
        }
    });
    handleBtn(true);
}

