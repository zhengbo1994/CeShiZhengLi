//登陆页通过身份证获取账号名称
//宝能集团定制
$(function ()
{
    var $btnValidate = $("#btnIDCard");
    if ($btnValidate.length > 0)
    {
        $("body").append("<div id='divValidate'><table border='0' cellspacing='0' cellpadding='0' style='width:100%;height:100%'>" +
            "<tr><td style='width:100px;'>身份证号：</td><td><input type='text' id='txtIden' style='width:80%' class='login_text' value='' />" +
            "</td></tr><tr><td >账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</td><td>" +
            "<input type='text' id='txtAccountName' style='width:80%' class='login_text' value='' readonly/></td></table></div>");
        var $divValidate = $("#divValidate");
        var isSend = false;
        $divValidate.dialog(
        {
            autoOpen: false,
            width: 450,
            height: 200,
            create: function (event, ui)
            {
                $(this).dialog("option", "title", "账号查询");
            },
            buttons: {
                "确定": function ()
                {
                    if ($("#txtAccountName").val() != "未查到账号信息！")
                    {
                        $("#txtUser").val($("#txtAccountName").val());
                    }
                    $divValidate.dialog("close");
                },
                "提交": function ()
                {
                    if ($.trim($("#txtIden").val()) == "")
                    {
                        return alertMsg("请输入身份证号！", $("#txtIden")[0]);
                    }
                    if (!isSend)
                    {
                        isSend = true;
                    }
                    else
                    {
                        return alertMsg("正在查询，请稍等！");
                    }
                    ajax(
                        "FillData.ashx",
                        {
                            "Action": "GetAccountNameByIden",
                            "IdenValue": $("#txtIden").val()
                        },
                        "json",
                        function (value)
                        {
                            isSend = false;
                            if (value.Success != "N")
                            {
                                $("#txtAccountName").val(value.Data);
                            }
                            else
                            {
                                $("#txtAccountName").val("未查到账号信息！");
                            }
                        },
                        true,
                        "POST"
                    );
                }
            }
        });

        $btnValidate.click(function ()
        {
            $divValidate.dialog("open");
            return false;
        });
    }
});
