var $pointObj = {};
$(function ()
{
    //是否显示监控设置
    $("#rdlIsUseList").click(function ()
    {
        showControlSetting(this);
    });

    var showControlSetting = function (obj)
    {
        var $chk = $(obj).find(":radio:checked");
        if ($chk.val() == "Y")
        {
            $("#trControlSetting").show();
        }
        else
        {
            $("#trControlSetting").hide();
        }
    }
    showControlSetting($("#rdlIsUseList")[0])

    var strCorpID = getParamValue("CorpID");
    //监控设置表的事件委托
    $("#tbControlSetting").click(function (event)
    {
        if (event.target.type && event.target.type.toUpperCase() == "BUTTON")
        {
            showModal(event.target);
            event.stopPropagation();
        }
    });

    var showModal = function (jObj)
    {
        var $tr = $(jObj).closest("tr");
        $pointObj.$curInputs = $tr.find(":input"); //关联全局变量，以备打开的模式窗口调用

        var value = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=ContSetting&CorpID=' + strCorpID, 1000, 700);
        if (value)
        {
            var $chk = $(jObj).closest("table").closest("tr").find(":checkbox");
            if (!$chk.is(":checked"))
            {
                $chk.attr("checked", true);
            }
        }
    }
});

function validateSize()
{
    setBtnEnabled($("#btnSaveClose"), false);
    //设置了监控信息启用
    if ($("#rdlIsUseList").find(":radio:checked").val() == "Y")
    {
        var $chk = $("#tbControlSetting").find(":checkbox:checked");
        if ($chk.length == 0)
        {
            setBtnEnabled($("#btnSaveClose"), true);
            return alertMsg("请选择启用监控方式！");
        }

        //                var settingInfo = { "ControlSetting": [] };
        var strSettingInfo = "";
        var isValidate = true;
        $chk.each(function ()
        {
            var $input = $(this).closest("tr").find("input");
            if ($input[1].value == "" || $input[2].value == "")
            {
                isValidate = false;
                return false;
            }

            strSettingInfo += "^" + this.value + "*" + $input[1].value + "|" + $input[2].value;
        });

        if (!isValidate)
        {
            setBtnEnabled($("#btnSaveClose"), true);
            return alertMsg("监控人和查阅人不能为空！")
        }
        else
        {
            $("#hidContSettingInfo")[0].value = strSettingInfo.substring(1);
        }
    }

    if (getParamValue("Type") && getParamValue("Type") == "More")
    {
        var strKeyIDs = "";
        $("#jqgControlCheck :checkbox:checked", window.dialogArguments.document).each(function ()
        {
            strKeyIDs = strKeyIDs + "," + $(this).closest("tr")[0].id;
        });
        $("#hidKeyID").val(strKeyIDs.substring(1));
    }

    return true;
}