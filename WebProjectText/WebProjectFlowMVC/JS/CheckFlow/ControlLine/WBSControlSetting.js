var $pointObj = {};
$(function ()
{
    //设置日期格式：中文简体
    $.datepicker.setDefaults($.datepicker.regional["zh-CN"]);

    var $divDialog = $("#divDialog");
    $divDialog.dialog({
        autoOpen: false,
        width: 600,
        height: 270,
        modal: true,
        buttons:
                {
                    "关闭": function ()
                    {
                        $divDialog.dialog("close");
                    }
                }
    });

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
        if (event.target.type && event.target.type.toUpperCase() == "BUTTON" && event.target.role)
        {
            if (event.target.role == "StationID")
            {
                showModal(event.target);
            }
            else if (event.target.role == "Percentage")
            {
                var $input = $(event.target).closest("tr").find(":input");
                showPercentage($input);
            }
            else if (event.target.role == "Date")
            {
                var $input = $(event.target).closest("tr").find(":input");
                showDate($input);
            }
            event.stopPropagation();
        }
    });

    //选择岗位窗口
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

    //实例化Slider
    var initSlider = function (objDiv, objInput)
    {
        $(objDiv).slider({
            value: objInput.value,
            slide: function (event, ui)
            {
                objInput.value = ui.value;
            },
            stop: function (event, ui)
            {
                var isRepeater = false;
                $divDialog.find("input").not(objInput).each(function ()
                {
                    if (this.value == ui.value.toString())
                    {
                        isRepeater = true;
                        return false;
                    }
                });

                if (isRepeater)
                {
                    alertMsg("有重复值，请重设置！");
                    return;
                }
            }
        });
    }

    //slider对应的input获得、失去焦点
    var onInputBlur = function (objDiv, objInput)
    {
        $(objInput).blur(function ()
        {
            if (!isNaN(objInput.value))
            {
                $(objDiv).slider("value", parseInt(objInput.value, 10));
            }
            else
            {
                objInput.value = this.oldValue;
                $(objDiv).slider("value", this.oldValue);
            }
            this.className = "text";
        }).focus(function ()
        {
            this.oldValue = this.value;
            this.className = "textfocus";
        });
    }

    //删除触发事情
    var onSpanClick = function (obj, type)
    {
        if (type == "slider")
        {
            $(obj).click(function ()
            {
                var $tr = $(this).closest("tr");
                $tr.find("div").slider("destroy");
                $tr.find("input").unbind("blur");
                $tr.remove();
            });
        }
        else if (type == "datepicker")
        {
            $(obj).click(function ()
            {
                var $tr = $(this).closest("tr");
                $tr.find("input").datepicker("destroy");
                $tr.remove();
            });
        }
    }

    //显示完成率
    var showPercentage = function ($input)
    {
        //初始化
        var sliderHtml = "<div style='height:200px;overflow:auto;'><table class='table'><tr class='table_headrow'><td colspan='2' style='width:80%'>进度</td><td style='width:20%'>操作</td></tr>";

        var vals = $input[0].value.split(",");
        vals[0] = vals[0] == "" ? 10 : vals[0];

        for (var i = 0, len = vals.length; i < len; i++)
        {
            sliderHtml += "<tr><td style='width:60%'><div style='width:100%'></div></td><td style='width:20%'><input type='text' class='text' style='text-align:right;width:80%' value='" +
                        vals[i] + "'/>%</td><td style='text-align:center'><span style='cursor:hand;color:#00f;'>删除</span></td></tr>";
        }
        sliderHtml += "</table></div>";

        $divDialog.html(sliderHtml);
        var $table = $divDialog.find("table");

        //遍历实例化Slider、相应事件委托
        $table.find("tr:gt(0)").each(function ()
        {
            initSlider($(this).find("div")[0], $(this).find("input")[0]);
            onInputBlur($(this).find("div")[0], $(this).find("input")[0]);
            onSpanClick($(this).find("span")[0], "slider");
        });

        //重设对话框相关属性和按钮事件
        $divDialog.dialog("option", "title", "设置进度提醒");
        $divDialog.dialog("option", "buttons", {
            "关闭": function ()
            {
                $divDialog.dialog("close");
            },
            "新增": function ()
            {
                //初始新增项的完成率
                var arrSliderValues = [];
                $table.find("input").each(function ()
                {
                    arrSliderValues.push(parseInt(this.value, 10));
                });
                //简单初始化值：获取最大值然后加10
                var maxValue = Math.max.apply({}, arrSliderValues);

                if (maxValue === -Infinity)
                {
                    maxValue = 10;
                }
                else if ((maxValue + 10) < 100)
                {
                    maxValue = maxValue + 10;
                }
                else
                {
                    maxValue = 100;
                }

                //初始新增项
                var strHtml = "<tr><td style='width:60%'><div style='width:100%'></div></td><td style='width:20%'><input type='text' class='text' style='text-align:right;width:80%' value='" +
                               maxValue.toString(10) + "'/>%</td><td style='text-align:center'><span style='cursor:hand;color:#00f;'>删除</span></td></tr>";
                $table.append(strHtml);
                $table.find("tr:last").each(function ()
                {
                    var divObj = $(this).find("div")[0];
                    var inputObj = $(this).find("input")[0];
                    initSlider(divObj, inputObj);
                    onInputBlur(divObj, inputObj);
                    inputObj.focus();
                    onSpanClick($(this).find("span")[0], "slider");
                });
            },
            "选择": function ()
            {
                var arrValues = [];
                var isRepeater = false;
                var repeaterObj = null;
                $table.find("input").each(function ()
                {
                    if (arrValues.toString().indexOf(this.value) != -1)
                    {
                        repeaterObj = this;
                        isRepeater = true;
                        return false;
                    }
                    arrValues.push(parseInt(this.value, 10));
                });

                if (isRepeater)
                {
                    alertMsg("完成率设置重复！");
                    $(repeaterObj).closest("tr").find("input")[0].focus();
                    return;
                }

                $input[0].value = arrValues.toString();
                $input[1].value = arrValues.toString() == "" ? "" : (arrValues.toString().replace(/,/g, "%,") + "%");
                $divDialog.dialog("close");
            }
        });

        $divDialog.dialog("option", "close", function ()
        {
            $divDialog.find("div").slider("destroy");
            $divDialog.find("input").unbind("blur,focus");
        });

        $divDialog.dialog("open");
    }

    //初始日期控件
    var initDatepicker = function (obj)
    {
        $(obj).datepicker({
            beforeShowDay: function (date)
            {
                //设置已选日期不可选
                var dt = $.datepicker.formatDate("yy-mm-dd", date)
                var isEnabled = false;
                $divDialog.find("input").not(obj).each(function ()
                {
                    if (this.value == dt)
                    {
                        isEnabled = true;
                        return false;
                    }
                });
                if (isEnabled)
                {
                    return [false, "", "已选择了该日期"];
                }

                return [true, "", ""];
            }
        });
    }

    //显示日期
    var showDate = function ($input)
    {
        var sliderHtml = "<div style='height:200px;overflow:auto;'><table class='table'><tr class='table_headrow'><td style='width:80%'>提醒日期</td><td style='width:20%'>操作</td></tr>";
        var vals = $input[0].value.split(",");
        for (var i = 0, len = vals.length; i < len; i++)
        {
            sliderHtml += "<tr><td style='width:80%;position:relative;'><input type='text' class='dt_date' value='" + vals[i] + "' /></td><td style='text-align:center'><span style='cursor:hand;color:#00f;'>删除</span></td></tr>";
        }
        sliderHtml += "</table></div>";

        $divDialog.html(sliderHtml);

        var $table = $divDialog.find("table");

        //实例化新增行
        $table.find("tr:gt(0)").each(function ()
        {
            initDatepicker($(this).find("input")[0]);
            onSpanClick($(this).find("span")[0], "datepicker");
        });

        $divDialog.dialog("option", "title", "设置日期提醒");
        $divDialog.dialog("option", "buttons", {
            "关闭": function ()
            {
                $divDialog.dialog("close");
            },
            "新增": function ()
            {
                var strHtml = "<tr><td style='width:80%'><input type='text' value='' class='dt_date' /></td><td style='text-align:center'><span style='cursor:hand;color:#00f;'>删除</span></td></tr>";
                $table.append(strHtml);
                $table.find("tr:last").each(function ()
                {
                    var inputObj = $(this).find("input")[0];
                    initDatepicker(inputObj);
                    inputObj.focus();
                    onSpanClick($(this).find("span")[0], "datepicker");
                });
            },
            "选择": function ()
            {
                if ($divDialog.find("input[value='']").length > 0)
                {
                    $divDialog.find("input[value='']")[0].focus();
                    return;
                }

                var strValues = "";
                $table.find("input").each(function ()
                {
                    strValues += (strValues.length == 0 ? "" : ",") + this.value;
                });

                $input[0].value = strValues;
                $input[1].value = strValues;
                $divDialog.dialog("close");
            }
        });
        $divDialog.dialog("option", "close", function ()
        {
            $divDialog.find("input").datepicker("destroy");
        });

        $divDialog.dialog("open");
    }
});

//提交验证
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

        var strSettingInfo = "";
        var isValidate = true;
        $chk.each(function ()
        {
            var $input = $(this).closest("tr").find("input");
            if ($input[1].value == "" || $input[2].value == "" || ($input[3].value == "" && $input[4].value == ""))
            {
                isValidate = false;
                return false;
            }

            strSettingInfo += (strSettingInfo == "" ? "" : "^") + this.value + "*" + $input[1].value + "|" + $input[2].value + "|" + $input[3].value + "|" + $input[4].value;
        });

        if (!isValidate)
        {
            setBtnEnabled($("#btnSaveClose"), true);
            return alertMsg("监控人、查阅人、提醒不能为空！")
        }
        else
        {
            $("#hidContSettingInfo")[0].value = strSettingInfo;
        }
    }

    if (getParamValue("Type") && getParamValue("Type") == "More")
    {
        var strWBSIDs = "";
        var tasks = window.dialogArguments.window.gtMap.getSelectedTasks();
        for (var i = 0, len = tasks.length; i < len; i++)
        {
            strWBSIDs += (strWBSIDs == "" ? "" : ",") + tasks[i].getProperty('CID').split('.')[1];
        }
        $("#hidWBSID").val(strWBSIDs);
    }
    return true;
}

function validateControlRemark()
{
    if ($("#ddlControlStation").val() == "")
    {
        return alertMsg("请选择监控岗位！", $("#ddlControlStation"));
    }

    if ($.trim($("#txtRemark").val()) == "")
    {
        return alertMsg("监控说明不能为空！", $("#txtRemark"));
    }
    return true;
}