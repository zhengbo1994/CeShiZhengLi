// JScript 文件
var dialogId;

function modifySysConfig() {
    openWindow("VSysConfigEdit.aspx", 800, 600);
}
function configDLMenu() {
    openWindow("VSysConfigModual.aspx", 300, 300);
}
function configSysModual() {
    openWindow("VSysConfigModule.aspx", 800, 600);
}

function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "1" ? "none" : "");
}
function validate()
{
    var MALValue = $("#IDTextAllowMailAccessaryLength").val();
    if ($.trim(MALValue) == "" || isNaN(MALValue))
    {
        return alertMsg("请输入正确的数字。", this);
    }

    if (parseFloat(MALValue) > parseFloat($("#hidSysUploadLength").val()))
    {
        return alertMsg("设置值不能大于系统允许上传文件最大值。", this);
    }

    if ($('#IDTextSysMailPwdRepeate').val() != $('#IDTextSysMailPwd').val())
    {
        alert('两次输入的密码不一致,请重新输入');
        return false
    }
    if ($('#IDTextServerMailPort').val().length > 0) {
        if ($('#IDTextServerMailPort').val() != '25' && $('#IDTextServerMailPort').val() != '465') {
            alert('邮箱服务器端口暂时只支持25或465。');
            return false
        }
    }
    return true;
}
function check(exp, txt) {
    //var patrn = new RegExp(exp);
                
    //if (!patrn.exec(txt.value))
    //{
    //    alertMsg("您输入的配置不符合规则,请重新输入!",txt);
    //}
}
function checkText(txtFundPlanPaySetting) {
    var value = txtFundPlanPaySetting.value.replace(/\s*$/, "");
    if (value == "" || getRound(value) >= 4) {
        txtFundPlanPaySetting.value = "0";
    }
}

// 设置模拟用户信息
function setImpersonateInfo(opt) {
    if (opt) {
        $("#IDTextImpersonateInfo").val($("#txtImpersonateInfo").val());
        closeDialog(dialogId);
    }
    else {
        var source = $("#IDTextImpersonateInfo").val();
        if (source) {
            $("#txtImpersonateInfo").val(source);
            ajax(document.URL, { "Action": "Decryp", "Source": source }, "json", function (data) {
                if (data.Success == "Y") {
                    var infos = data.Data.split(";");
                    $("#txtImpersonateDomain").val(infos[0]);
                    $("#txtImpersonateUser").val(infos[1]);
                    $("#txtImpersonatePwd").val(infos[2]);
                }
                else {
                    alert(data.Data);
                }
            });
        }

        dialogId = showDialog(
            {
                "title": "生成模拟用户信息",
                "htmlid": "divImpersonateInfo",
                "width": 400,
                "height": 240,
                "id": dialogId
            });
    }
}

// 生成模拟用户信息
function generateImpersonateInfo() {
    var source = stringFormat("{0};{1};{2}", $("#txtImpersonateDomain").val(), $("#txtImpersonateUser").val(), $("#txtImpersonatePwd").val());

    ajax(document.URL, { "Action": "Encry", "Source": source }, "json", function (data) {
        data.Success == "Y" ? $("#txtImpersonateInfo").val(data.Data) : alert(data.Data);
    });
}


// VSysConfigModule.aspx、VSysConfigModual.aspx的js

// 加载模块配置信息
function loadModConfigInfo() {
    $(":checkbox:[code]").on("click", function () { setEnabled(this); });
    $(":checkbox[fmid]").on("click", function () { setAll(this); });
    $(".dg_headrow :checkbox").on("click", function () { selectAll(this); });
    $("label:has(:checkbox:[code=YTHR]),td[code=YTHR]:eq(0)").attr("title", "绩效管理（银泰）");
    $("label:has(:checkbox:[code=CTSIM]),td[code=CTSIM]:eq(0)").attr("title", "投资管理（港中旅）");
    setAll();
    setEnabled();
}

// 设置子模块是否可设置
function setEnabled(chk) {
    if (chk) {
        $("td[code=" + chk.code + "]").attr("disabled", !chk.checked);
    }
    else {
        $(":checkbox:[code]").each(function () { $(this).triggerHandler("click") });
    }
}

// 选中子模块时，设置全选状态
function setAll(chk) {
    if (chk) {
        var td = $(chk).closest("td");
        $("#tbModel tr:eq(0)>td:eq(" + td.index() + ") :checkbox").attr("checked", !$(":checkbox:not(:checked)", td).length);
    }
    else {
        $("#tbModel tr:eq(0) :checkbox").attr("checked", function (i) { return !$("#tbModel tr:eq(1)>td:eq(" + i + ") :checkbox:not(:checked)").length; });
    }
}

// 全选子模块
function selectAll(chk) {
    $("#tbModel tr:eq(1)>td:eq(" + $(chk).closest("td").index() + ") :checkbox").attr("checked", !!$(chk).attr("checked"));
}

// 保存模块配置信息
function saveModConfigInfo() {
    $(":checkbox:[code]:not(:checked)").each(function () {
        $("td[code=" + $(this).attr("code") + "] :checked").attr("checked", false);
    });

    var modules = {}, models = {};
    $(":checkbox:[code]").each(function () {
        var chk = $(this);
        modules[chk.attr("code")] = !!chk.attr("checked");
    });
    $(":checkbox:[fmid]").each(function () {
        var chk = $(this);
        models[chk.attr("fmid")] = !!chk.attr("checked");
    });

    ajax(document.URL, { "Module": $.jsonToString(modules), "Model": $.jsonToString(models) }, "json", function (data) {
        alert(data.Data);
        data.Success == "Y" && window.close();
    });
}

//打开修改消息模板页面
function editMessageTemplates() {
    openWindow("../../../Resources/Templates/MessageTemplatesEdit.aspx?SystemCode=SYS", 1000, 800);
}