$(document).ready(
    function ()
    {
        //add by linshuling 页面加载时，判断按钮的显示情况 20150717
        showFlowBtns();

        //注册直接登记，正常申请切换事件
        $("input[name*='rdlRequestMethod']").click(changeRequestMethod);
        //注册提交审核按钮事件
        //        $("#btnCheckRequest_tb").click(
        //              function ()
        //              {
        //                  $("#hidCheckFlowStepIndex").val("2");
        //                  showStepInfo();
        //                  showFlowBtns();
        //              }
        //        );
        //注册返回按钮事件
        $("#btnPrevious_tb").click(
              function ()
              {
                  $("#hidCheckFlowStepIndex").val("1");
                  showCheckFlowInfo();
                  showStepInfo();
                  showFlowBtns();
                  changeRequestMethod();
              }
        );
    }
);
//显示审核信息（附件、Office文档、送阅等）。具体实现收业务界面重写。
function showCheckFlowInfo()
{
    //涉及Office文档加载问题，若默认加载标签不为“审批单”时，请重写showFlowTabInfo方法，使showCheckFlowInfo方法在加载“审批单”标签时执行。
    // 在回发后若要保持原来选中项，同理。（需自行处理）
    setVisible('areaBasicInfo', trBasicInfo);
    setVisible('areaFileInfo', trFileInfo);
    setVisible('areaOfficeDoc', trOfficeDoc);
    setVisible('areaLookInfo', trLookInfo);

    setDesc('areaFileInfo');
    setDesc('areaLookInfo');
    setDesc('areaOfficeDoc');
}

function showStepInfo()
{
    var stepIndex = $("#hidCheckFlowStepIndex").val();
    $("table[class='tabstep']").hide();
    $("table[class='tabstep'][index='" + (stepIndex == "" ? "1" : stepIndex) + "']").show();
}
//隐藏流程标签卡问题
function showFlowTabInfo(obj)
{
    $(".checkflowtab").hide();
    var tab = $("[id*=" + $(obj).attr("tabno") + "]");
    tab.show();
    var index=$.inArray(obj, $("a[name='TabInfo']"));
    $("#divMenu").attr("selectedindex", index)
    selectTab(index, "TabInfo");

}
//显示流程按钮
function showFlowBtns()
{
    var isBookFormal = $("input[name*='rdlRequestMethod']:checked").val() == "N";
    var isFirstStep = $("#hidCheckFlowStepIndex").val() == "1";
    var isUsedThirdCheck = $("#hidIsUsedThirdChecked").val() == "Y";
    //保存不提交按钮：直接登记且第一步
    $("#btnSave_tb").attr("style", isFirstStep ? "" : "display:none");
    //返回：第二步
    $("#btnPrevious_tb").attr("style", !isFirstStep ? "" : "display:none");
    //提交审核：正常申请且第一步
    $("#btnCheckRequest_tb").attr("style", !isBookFormal && isFirstStep ? "" : "display:none");
    //提交并新建：正常申请且第二步 或 直接登记且第一步
    $("#btnSaveOpen_tb").attr("style", ((isBookFormal && isFirstStep) || (!isBookFormal && !isFirstStep)) ? "" : "display:none");
    //提交并关闭：正常申请且第二步 或 直接登记且第一步
    $("#btnSaveClose_tb").attr("style", ((isBookFormal && isFirstStep) || (!isBookFormal && !isFirstStep)) ? "" : "display:none");
    //第3方审批：直接登记且需要第三方审批
    $("#btnThirdCheck_tb").attr("style", isBookFormal && isUsedThirdCheck ? "" : "display:none");
    
    //流程步骤：需要第三方审核
    if ($("#btnThirdShowEntry"))
    {
        $("#btnThirdShowEntry").attr("style", isUsedThirdCheck ? "" : "display:none;");
    }
    //审批表单：需要第三方审核
    if ($("#btnThirdView"))
    {
        $("#btnThirdView").attr("style", isUsedThirdCheck ? "" : "display:none;");
    }
}
function showInfo()
{
    //加载标签信息
    $("a[name='TabInfo']")[$("#divMenu").attr("selectedindex")].click();
    //加载按钮信息
    showFlowBtns();
    //加载步骤信息
    showStepInfo();
}
//显示紧急程序
function showUrgency()
{
    var isBookFormal = $("input[name*='rdlRequestMethod']:checked").val() == "N";
    $("#trUrgency").css("display", isBookFormal ? "none" : "");

    //当不显示紧急程度时，其他资料也不显示，项目合约规划新增页没有紧急程度时，其他资料显示为空
    $("#trOtherInfo_common").prev().css("display", isBookFormal ? "none" : "");
}
//提交并审核
function jumpToFlowStep()
{
    $("#hidCheckFlowStepIndex").val("2");
    showStepInfo();
    showFlowBtns();
}
function handleBtn(isEnabled)
{
    setBtnEnabled(["btnSave", "btnPrevious", "btnCheckRequest", "btnSaveOpen", "btnSaveClose", "btnThirdCheck"], isEnabled);
    //modify by dinghuan @2013-10-15 根据页面环境设置按钮显示状态
    showFlowBtns();
}

//业务数据验证，需在业务JS中重写
function validate()
{
    return true;
}
//验证数据并进行预保存
//add by dinghuan @2013-03-13 添加 isSend 表示是否发出
function validateAndPresave(isSend)
{
    debugger;
    handleBtn(false);
    if (!validate(isSend))    //业务数据验证
    {
        handleBtn(true);
        return false;
    }
    if (isSend && $("#hidCheckFlowStepIndex").val() == "2" && (!flowValidate() || $("input[id*=hidFormID]").length > 0 && $("input[id*=hidFormID]").val() != "" && !formValidate()))  //业务自定义表单验证
    {
        handleBtn(true);
        return false;
    }
    if (!saveDocModel())    //正文Office保存
    {
        handleBtn(true);
        return alertMsg("正文文档保存失败。", $("#chkUseDocModel"));
    }

    return true;
}

//审核提交验证，需在业务JS中重写
function validateCheck()
{
    return true;
}
function validateCheckAndPresave()
{
    if (getObj('tdRequiredlblCheckTitle') && getObj('tdRequiredlblCheckTitle').style.display != "none" && trim(getObj("txtCheckDescription").value) == "")
    {
        return alertMsg("请填写审核/处理意见。");
    }
    setBtnEnabled(getObj("btnSubmit"), false);
    if (!validateCheck())   //业务数据验证
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    if ($("input[id*=hidFormID]").length > 0 && $("input[id*=hidFormID]").val() != "" && (!formValidate()))  //业务自定义表单验证
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }

    var left = (screen.width - 350) / 2;
    var top = (screen.height - 170) / 2;
    var result = openModalWindow("/"+rootUrl + '/Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
    if (result == "Cancel" || result == "undefined" || result == null || result == "No")
    {
        if (result == "No")
        {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }

    if (!saveDocModel())
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    setBtnEnabled(getObj("btnSubmit"), true);
    return true;
}

//调整校验 需要重写  调整提交验证密码
function validateAdjust()
{
    return true;
}
function validateAdjustAndPresave()
{
    //modify by dinghuan @2013-03-10 调整提交JS验证请用submitAdjust方法
//    if (!validate())
//    {
//        return false;
//    }
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);
    if (!validateAdjust())
    {
        return false;
    }

    var result = openModalWindow("/"+rootUrl + '/Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
    if (result == "Cancel" || result == "undefined" || result == null || result == "No")
    {
        if (result == "No")
        {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    if (!saveDocModel())
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    if ($("input[id*=hidFormID]").length > 0 && $("input[id*=hidFormID]").val() != "" && (!formValidate()))
    {
        setPageBtnEnabled(true);
        return false;
    }
    return true;
}

//切换登记类型
function changeRequestMethod()
{
    showFlowBtns();
    showUrgency();
}

//第三方审核方法(暂且不实现)
function showThirdCheck()
{ 
    
}