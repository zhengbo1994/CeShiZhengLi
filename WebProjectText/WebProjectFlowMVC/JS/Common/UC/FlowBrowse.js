/// <reference path="../../../Common/MsgCenter/PressDo/VSendPressDo.aspx" />
/// <reference path="../../../Common/MsgCenter/PressDo/VSendPressDo.aspx" />
var $pointObj = {};
$(function ()
{
    divHeight();

    if (pageArgus.TranCDID != "")
    {
        //确认阅读转发意见
        var $divMPForm = $("div[id$='divMPForm']");
        if ($divMPForm.length == 1)
        {
            var $tr = $divMPForm.closest("table").closest("tr");
            var IsBrowsed = getParamValue("IsBrowsed") == "Y" ? true : false;
            var str = "<tr id='trTransport' class='noprint'><td class='open_pad' style='background-color:#e6e4cc;height:25px;'>" +
                "<div class='warnmsg' style='position:relative'>" + $("#hidTransportInfo").val() + "转发审批意见给你，请查阅" +
                "<span id='spanBtnTran' style='position:absolute;right:20px;display:block;cursor:hand;'>" + (IsBrowsed ? "已阅" : "<a href='#'>确认查阅</a>") + "</span>" +
                "</div></td></tr>";
            $tr.before(str);
            if ($("#hlCheckInfo").length == 1)
            {
                $("#hlCheckInfo").trigger("click");
                var $strTranReceCLSID = $("#hidTranReceCLSID");
                if ($strTranReceCLSID.length == 1)
                {
                    var tranReceCLSID = $strTranReceCLSID.val();
                    if (tranReceCLSID && $("td#" + tranReceCLSID).length == 1)
                    {
                        $("td#" + tranReceCLSID).css("font-weight", "bold");
                    }
                }
            }

            if (!IsBrowsed)
            {
                var bSubmit = false;
                $("#spanBtnTran").click(function ()
                {
                    var that = this;
                    if (!bSubmit)
                    {
                        bSubmit = true;
                        ajax(
                            "FillData.ashx",
                            {
                                "Action": "ComfirmReadTranDesc",
                                "TCDID": pageArgus.TranCDID
                            },
                            "html",
                            function ()
                            {
                                if (arguments[0] == "Y")
                                {
                                    $(that).text("已阅");
                                    $(that).unbind("click");
                                    window.opener.window.reloadData();
                                }
                                else
                                {
                                    bSubmit = false;
                                    return alertMsg("操作失败！");
                                }
                            },
                            true,
                            "POST"
                        );
                    }
                });
            }
        }
    }

    //撤回
    var $btnClose = $("#btnCancel_tb");
    var $btnRevokeTD = $("#btnRevoke_tb");
    if ($btnClose.length == 1 && $btnRevokeTD.length == 1)
    {
        $btnClose.before($btnRevokeTD);
        revokeCheck($("#btnRevoke"), $("#hidRevokeCLSID"), $("#hidCCID"), $("#hidModCode"));
    }
    else
    {
        $btnRevokeTD.hide();
    }

    //在浏览页撤销操作：如果上一环节为审核、调整、处理、沟通环节且包含我（CheckAccountID是我）、当前环节还未收文（IsReceive=N）
    //在页面windowLoad()或者$(function(){})调用此方法
    //$btnRevoke、$hidCLSID、$hidCCID都为jquery对象，依次为撤销按钮、隐藏当前审批顺序明细ID的hidden控件、审批ID
    function revokeCheck($btnRevoke, $hidCLSID, $hidCCID,$hidModCode)
    {
        if ($hidCLSID.size() != 1 || $hidCCID.val() == "")
        {
            $("#" + $btnRevoke[0].id + "_tb").remove();
            return;
        }
        $btnRevoke.click(function ()
        {
            setBtnEnabled($btnRevoke, false);
            ajax(
                            "FillData.ashx",
                            {
                                "Action": "RevokeCheck",
                                "CLSID": $hidCLSID.val(),
                                "CCID": $hidCCID.val(),
                                "ModCode": $hidModCode.val()
                            },
                            "html",
                            function ()
                            {
                                //显示提示消息
                                var msg = "撤回失败。";
                                if (arguments[0] == "Y")
                                {
                                    msg = "撤回成功。";
                                    $("#" + $btnRevoke[0].id + "_tb").remove();
                                }
                                else if (arguments[0] == "C")
                                {
                                    msg = "当前审批环节已改变，已不能撤回！";
                                    $("#" + $btnRevoke[0].id + "_tb").remove();
                                }
                                if ($btnRevoke.size() == 1)
                                {
                                    setBtnEnabled($btnRevoke, true);
                                }
                                return alertMsg(msg);
                            },
                            true,
                            "POST"
                        );
        });
    }

    var $tbContInfo = $("#tbControlInfo");
    var $tbContOper = $("table[id$='tbControlOper']");
    var $tbContReader = $("table[id$='tbControlReader']");
    if ($tbContInfo.length == 1 || $tbContOper.length == 1 || $tbContReader.length == 1)
    {
        //添加到相应的父节点中
        var $ul = $("div.idtab>ul");
        var num = $ul.find("li").length; 
        var isHasNum = parseInt($ul.find("li:first").text());

        var strLi = "<li><a id='lblControlInfo' name='TabInfo' href='javascript:void(0)' onfocus='this.blur()'>" +
                        "<span><span>" + (!isNaN(isHasNum) ? ((num + 1) + ".") : "") + "流程监控</span></span></a></li>";
        $ul.append(strLi);
        var $div = $("div.div-ControlInfo").attr("id", "div" + num);
        $("div.idtabdiv").append($div[0]);
        //控制监控信息显隐
        $("div.idtab").click(function (event)
        {
            if ($(event.target).parent().parent().attr("id") == "lblControlInfo" || $(event.target).parent().attr("id") == "lblControlInfo" || event.target.id == "lblControlInfo")
            {
                selectTab(num, "TabInfo");
                $("div.idtabdiv>div:visible").hide();
                $div.show();
            }
            else
            {
                $div.hide();
            }
        });

        if ($("#hidIsPostBack").val() == "Y")
        {
            $("#lblControlInfo").trigger("click");
        }

        if ($tbContOper.length == 1)
        {
            $("#ddlControlType,#ddlControl_Flow").change(function ()
            {
                $("#hidIsPostBack").val("Y");
            });
        }

        if ($("#tbControlInfo").length == 1)
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
            showControlSetting($("#rdlIsUseList")[0]);

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

                var value = openModalWindow(pageArgus.rootDir + '/Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=ContSetting&CorpID=', 1000, 700);
                if (value)
                {
                    var $chk = $(jObj).closest("table").closest("tr").find(":checkbox");
                    if (!$chk.is(":checked"))
                    {
                        $chk.attr("checked", true);
                    }
                }
            }
        }
    }

    // 催办按钮 edit by zhangmq 20150331
    var $btnPressDo = $("#btnPressDo_tb");
    if ($btnClose.length === 1 && $btnPressDo.length === 1)
    {
        $btnClose.before($btnPressDo);

        $btnPressDo.click(function ()
        {
            openModalWindow(pageArgus.rootDir + "/Common/MsgCenter/PressDo/VSendPressDo.aspx?CCID=" + $("#hidCCID").val(), 600, 280);
        });
    }
    else
    {
        $btnPressDo.hide();
    }
});

function divHeight()
{
    if (!pageArgus.ID_dlCheckListID || !pageArgus.ID_divDL)
    {
        return;
    }
    var dlCheckList = getObj(pageArgus.ID_dlCheckListID);
    var divDL = document.getElementById(pageArgus.ID_divDL);
    if (dlCheckList == null)
    {
        divDL.style.display = "none";
        return false;
    }
    if (divDL.clientHeight < dlCheckList.clientHeight)
    {
        divDL.style.height = dlCheckList.clientHeight + 20 + 'px';
    }
}

function validateControlSetting()
{
    var $tbContInfo = $("#tbControlInfo");
    if ($tbContInfo.length == 1)
    {
        if ($("#ddlSender_Flow").val() == "")
        {
            return alertMsg("请选择启动岗位！", $("#ddlSender_Flow"));
        }

        var strSettingInfo = "";
        var isStart = $("#rdlIsUseList").find(":radio:checked").val();

        //设置了监控信息启用
        if (isStart == "Y")
        {
            var $chk = $("#tbControlSetting").find(":checkbox:checked");
            var isValidate = true;

            if ($chk.length == 0)
            {
                return alertMsg("请选择启用监控方式！");
            }

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
                return alertMsg("监控人和查阅人不能为空！")
            }

            $("#hidContSettingInfo").val(strSettingInfo.substring(1));
        }
        $("#hidIsPostBack").val("Y");

        return true;
    }

    return false;
}

function validateControlRemark()
{
    if ($("#ddlControl_Flow").val() == "")
    {
        return alertMsg("请选择监控岗位。", $("#ddlControl_Flow"));
    }

    if ($.trim($("#txtRemark_FlowBrowse").val()) == "" && $("#uploadFile").find("tr").length == 0)
    {
        return alertMsg("监控说明和附件不能同时为空。");
    }
    $("#hidIsPostBack").val("Y");
    return true;
}

function cancelControlRemind()
{
    $("#hidIsPostBack").val("Y");
    return true;
}