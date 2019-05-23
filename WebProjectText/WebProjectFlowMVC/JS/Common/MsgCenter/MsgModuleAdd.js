var moduleDomElement = null;
$(function ()
{
    var alertMsg = window.alertMsg;
    moduleDomElement = {
            $txtModuleName: $("#txtModuleName"),
            $ddlSysModule: $("#ddlSysModule"),
            $txtModuleIndex: $("#txtModuleIndex"),
            $txtWorkIndex: $("#txtWorkIndex"),
            $txtRowNo: $("#txtRowNo"),
            $txtWaitListUrl: $("#txtWaitListUrl"),
            $txtDoneListUrl: $("#txtDoneListUrl")
        };

    // 数字类型失去焦点判断是否为数字
    $("body").on("blur", "#txtModuleIndex,#txtWorkIndex,#txtRowNo", function ()
    {
        if (isNaN(this.value))
        {
            $(this).val("");
            return alertMsg("请输入数字。", this);
        }
    });
});

function validateSize()
{
    if (!moduleDomElement)
    {
        return false;
    }

    if ($.trim(moduleDomElement.$txtModuleName.val()) === "")
    {
        return alertMsg("模块名称为空。", moduleDomElement.$txtModuleName);
    }

    if (moduleDomElement.$ddlSysModule.val() === "")
    {
        return alertMsg("请选择所属系统。", moduleDomElement.$ddlSysModule);
    }

    if ($.trim(moduleDomElement.$txtModuleIndex.val()) === "")
    {
        return alertMsg("系统码为空。", moduleDomElement.$txtModuleIndex);
    }

    if ($.trim(moduleDomElement.$txtWorkIndex.val()) === "")
    {
        return alertMsg("模块码为空。", moduleDomElement.$txtWorkIndex);
    }

    if ($.trim(moduleDomElement.$txtRowNo.val()) === "")
    {
        return alertMsg("行号为空。", moduleDomElement.$txtRowNo);
    }

    return true;
}