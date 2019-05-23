$(function ()
{
    var strShowSuggOrTran = pageArgus.isShowSuggOrTran;
    if ($("#hidCheckPointHTML").val() != "")
    {
        //后台拼html再前台js插入页面
        $(document.body).append($("#hidCheckPointHTML").val());
        //调整审批要点div位置
        setInterval(setCheckPointPosition, 100);
    }
    //为提交事件增加审批要点验证
    onclickCheckValidate();

    //重新提交按钮的onclick事件，在页面提交前检查强管控的审批要点是否被确认
    function onclickCheckValidate()
    {
        //找到onclick带有__doPostBack方法的button，并劫持其onclick事件
        var isPostBack = new RegExp("__doPostBack");
        var btns = $("button");

        for (var i = 0; i < btns.length; i++)
        {
            if (btns[i].onclick && isPostBack.test(btns[i].onclick.toString()))
            {
                btns[i].onclick =
                        (function (old)
                        {
                            return function ()
                            {
                                var returnMsg = true;
                                //审批要点
                                if ($("#hidCheckPointHTML").val() != "")
                                {
                                    returnMsg = CheckPoint();
                                }
                                //转发意见
                                if (returnMsg && strShowSuggOrTran.charAt(1) == "Y")
                                {
                                    returnMsg = pageArgus.validateTranDesc();
                                }
                                if (returnMsg)
                                {
                                    old();
                                }
                            }
                        })(btns[i].onclick);
            }
        }
    }

    if (strShowSuggOrTran.charAt(0) == "Y")
    {
        //征询意见
        var $btnSCD = $("#btnSelectCustomDescription");
        if ($btnSCD.size() == 1)
        {
            var strBtnConsultation = "<input class='btnsmall btnpad' id='btnConsultation'" +
                "style='width: 70px;' onmouseover='setIDBtn1(this,1)' onmouseout='setIDBtn1(this,0)'" +
                " onfocus='this.blur()' type='button' value='" + (pageArgus.publishCompany == "BAONENGJT" ? "知会会签" : "征询意见") + "'/>";
            $btnSCD.after(strBtnConsultation);

            $("#btnConsultation").click(function ()
            {
                openWindow("/" + rootUrl + "/CheckFlow/Consultation/VCheckConsultation.aspx?CCID=" + $("#hidCCID").val(), 530, 320);
            });
        }
    }

    //保留意见 add by zhangmq 2013-1-10
    var $btnSubmit = $("#btnSubmit_tb");
    var strSaveDescTable = "<table id='btnSaveDescription_tb' class='btntb3'><tr><td><div><button onpropertychange='setIDBtnDisp(this)' id='btnSaveDescription' onfocus='this.blur()' onmouseover='setIDBtn(this,4)' type='button' onmouseout='setIDBtn(this,3)' Text='保存意见'> " +
            "<img style='border-width:0px' class='btnimg' src='" + pageArgus.rootDir + "/App_Themes/" + pageArgus.pageTheme + "/img/button/save" + getButtonIconExtension(pageArgus.pageTheme) + "'><span class='" + (pageArgus.pageTheme == "Gray" ? "btntextr-g" : "btntextr") + "'>保存意见</span></button></div></td></tr></table>";
    $btnSubmit.after(strSaveDescTable);
    var $btnSave = $("#btnSaveDescription");

    $btnSave.click(function ()
    {
        var $Msg = $("#txtCheckDescription");
        if ($Msg.val() == "")
        {
            return alertMsg("意见为空，请填写意见。", $Msg);
        }
        setBtnEnabled(this, false);
        var that = this;
        ajax(
                "FillData.ashx",
                {
                    "Action": "SaveCheckDescription",
                    "CLSID": $("#hidCurrentCLSID").val(),
                    "Description": $Msg.val()
                },
                "html",
                function ()
                {
                    //显示提示消息
                    var msg = "保存失败！";
                    if (arguments[0] == "Y")
                    {
                        msg = "保存成功";
                    }

                    var $alertObj = $("#successMsg");
                    if ($alertObj.size() == 0)
                    {
                        $("body").append("<span id='successMsg' style='position:absolute;display:none;text-align:right;color:blue'>" + msg + "</span>");
                        $alertObj = $("#successMsg");
                    }
                    else
                    {
                        $alertObj.text(msg);
                    }
                    $alertObj.css({ top: $Msg.offset().top + ($Msg.height()) / 2, left: ($Msg.offset().left + $Msg.width()) / 2 });
                    $alertObj.show('slow');
                    setBtnEnabled(that, true);
                    var timeID = window.setTimeout(function () { $alertObj.hide('slow'); clearTimeout(timeID); }, 2000);
                },
                true,
                "POST"
            );
    });
});

function divHeight()
{
    if (!pageArgus.id_dlCheckListID || !pageArgus.id_divDL)
    {
        return;
    }
    var dlCheckList = getObj(pageArgus.id_dlCheckListID);
    var divDL = document.getElementById(pageArgus.id_divDL)
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