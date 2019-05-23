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
    var hidFlowOptionValue = $("#hidFlowOption").val();
    //为提交事件增加审批验证
    onclickCheckValidate();

    //重新提交按钮的onclick事件，在页面提交前检查验证
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
                                if (returnMsg && strShowSuggOrTran.charAt(1) == "Y" && (hidFlowOptionValue == "Check" || hidFlowOptionValue == "Deal" || hidFlowOptionValue == "Communicate"))
                                {
                                    returnMsg = pageArgus.validateTranDesc();
                                }
                                if (returnMsg && typeof ValidateReCheck == "function")
                                {
                                    returnMsg = ValidateReCheck();
                                }
                                if (returnMsg && typeof validateRejectReason === "function")
                                {
                                    returnMsg = validateRejectReason();
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

    divHeight();
    if (hidFlowOptionValue == "Save") //归档环时需要插入节点 这里需要显示
    {
        $("#trCheckFlow").css("display", "")
    }

    if (strShowSuggOrTran.charAt(0) == "Y" && (hidFlowOptionValue == "Check" || hidFlowOptionValue == "Deal" || hidFlowOptionValue == "Communicate"))
    {
        var $btnSCD = $("#btnSelectCustomDescription");
        //只有在调整、审批、处理、沟通可征询意见
        if ($btnSCD.size() == 1)
        {
            var strBtnConsultation = "<input class='btnsmall btnpad' id='btnConsultation'" +
                "style='width: 70px;' onmouseover='setIDBtn1(this,1)' onmouseout='setIDBtn1(this,0)'" +
                " onfocus='this.blur()' type='button' value='" + (pageArgus.publishCompany == "BAONENGJT" ? "知会会签" : "征询意见") + "'/>";
            $btnSCD.after(strBtnConsultation);

            $("#btnConsultation").click(function ()
            {
                openWindow("/" + rootUrl + "/CheckFlow/Consultation/VCheckConsultation.aspx?CCID=" + $("#hidCCID").val(), 530, 310);
            });
        }
    }

    var $hidScrollData = $("#hidScrollData");
    var $divCheckFlow = $("#divCheckFlow");
    var $divDL = $("div[id$='ucFlowCheck_divDL']");
    if ($hidScrollData.val() != "")
    {
        $divCheckFlow[0].scrollTop = $hidScrollData.val().split("|")[0];
        $divDL[0].scrollLeft = $hidScrollData.val().split("|")[1];
    }

    if ($("#btnSaveUpdateTach").size() == 1)
    {
        $("#" + pageArgus.divDLID + " img.img-human").click(function ()
        {
            $pointObj = {};
            $pointObj.$pointImg = $(this); //头像
            $pointObj.$pointItem = $(this).siblings().eq(1); //该审批人的审批要点信息
            $pointObj.$pointHuman = $(this).siblings().eq(0); //审批人ID
            $pointObj.$pointInfo = $(this).closest("span").siblings().eq(0); //该环节信息
            $pointObj.$pointType = $(this).closest("span").siblings().eq(1); //该环节审批要点类别，只能是同一类别
            $pointObj.tachType = $(this).closest("span").find("table").size() > 1 ? "P" : "O"; //P:并环;O:串环

            var bValue = openModalWindow(pageArgus.rootDir + "/CheckFlow/CheckPoint/VCheckPointSelect.aspx", 800, 600);
            if (bValue)
            {
                $hidScrollData.val($divCheckFlow[0].scrollTop + "|" + $divDL[0].scrollLeft);
                $("#" + pageArgus.btnSavePointID)[0].click();
            }
            arguments[0].stopPropagation();
            return false;
        }).css("cursor", "hand");
    }

    //回退节点
    var $rblCheckState = $("#rblCheckState");
    if ($rblCheckState.length == 1)
    {
        var $rdo = $rblCheckState.find(":radio");
        var $reRdo = $rdo.filter("[value^='4@']");
        var headColor = "";
        switch (pageArgus.pageTheme)
        {
            case "Gray":
                headColor = "#3f4749";
                break;
            default:
                headColor = "#5a8cc5";
        }

        //回退节点
        if ($reRdo.length == 1)
        {
            var headColor = "";
            switch (pageArgus.pageTheme)
            {
                case "Gray":
                    headColor = "#3f4749";
                    break;
                default:
                    headColor = "#5a8cc5";
            }
            var strReCheck = "<div id='divReCheck' style='display:none;position:absolute;width:280px;overflow:hidden;'></div>";
            $("body").append(strReCheck);
            var strHtml = "<iframe style='position: absolute; z-index: -1; width: 100%;bottom: 0; left: 0; scrolling: no;' frameborder='0' src='about:blank'></iframe>" +
                        "<div style='background-color:#eee;border:1px solid #aaa;padding:3px;width:100%;height:100%;'><div style='width:100%;height:18px;padding-top:1px;margin-bottom:3px;padding-left:3px;border-left:8px solid " + headColor + ";border-bottom:1px solid " + headColor + ";color:" + headColor + "'>确定回退节点" +
                        "<span id='spanReCheck' style='background:url(" + pageArgus.rootDir + "/App_Themes/" + pageArgus.pageTheme + "/img/control/area_collapse.gif) no-repeat center center;display:block;width:20px;height:20px;position:absolute;right:0;top:0;cursor:hand'></span></div>" +
                        "<table class='table' id='tbReCheck'><tr class='table_headrow'><td style='width:30px'></td>" +
                        "<td style='width:30px'>序号</td><td style='width:60px'>环节名称</td><td style='width:150px'>审批人</td></tr>";
            var $detailTable = $("table.dl_table:gt(0)");
            if ($detailTable.length)
            {
                $detailTable.each(function ()
                {
                    // hidIsChecked "是否已经审批|环节号"
                    var hidIsChecked = $(this).find("#hidIsChecked").val();
                    if (hidIsChecked.charAt(0) == "Y")
                    {
                        var CLName = $(this).find("#lblCLName").text();
                        var hidCLIDValue = $(this).find("#hidCLID").val();
                        var $tbs = $(this).find("#lblTach").find("table");
                        var checkMan = [];
                        $tbs.each(function ()
                        {
                            if ($(this).find(":input").length != 0)
                            {
                                checkMan.push($(this).text());
                            }
                        });
                        strHtml += "<tr><td style='text-align:center'><input type='radio' name='reCheck' value='" + hidCLIDValue + "' /></td><td style='text-align:center'>" + hidIsChecked.split("|")[1] + "</td><td style='text-align:center'>" + CLName + "</td><td><div class='nowrap' title='" + checkMan.join("，") + "' style='width:150px'>" + checkMan.join("，") + "</div></td></tr>";
                    }
                    else
                    {
                        return false;
                    }
                });
            }
            else if (window["tachinfo"] && hidFlow_Values.value)
            {
                var flow = $.stringToJSON(hidFlow_Values.value);
                var currentclid = flow["basicinfo"]["info"]["currentclid"];
                //新的流程已经不存在起草环节，所以索引由从1开始改为从0开始  肖勇彬 2015-06-17
                for (var i = 0; i < flow["nodes"].length; i++)
                {
                    var node = flow["nodes"][i];
                    if (node["isvisible"] === "Y")
                    {
                        var clid = node["clid"];
                        if (clid === currentclid)
                        {
                            break;
                        }
                        var clname = node["clname"];
                        var checkmen = [];
                        for (var j = 0; j < node["checker"].length; j++)
                        {
                            var checker = node["checker"][j];
                            checker["isvisible"]=="Y" && checkmen.push(checker["employeename"] + "[" + checker["stationname"] + ']');
                        }
                        strHtml += "<tr><td style='text-align:center'><input type='radio' name='reCheck' value='" + clid + "' /></td><td style='text-align:center'>" + (i+1) + "</td><td style='text-align:center'>" + clname + "</td><td><div class='nowrap' title='" + checkmen.join("，") + "' style='width:150px'>" + checkmen.join("，") + "</div></td></tr>";
                    }
                }
            }

            strHtml += "</table></div>"
            var $divReCheck = $("#divReCheck");
            $divReCheck.html(strHtml);

            var pos = $reRdo.offset();
            var bodyHeight = document.body.clientHeight;

            $divReCheck.css({ bottom: bodyHeight - pos.top + 2, left: pos.left });
            $divReCheck.find("iframe").find("body").height($divReCheck.height());
            $rdo.click(function ()
            {
                if ($reRdo[0] == this && $(this).is(":checked"))
                {
                    $divReCheck.show();
                }
                else
                {
                    $divReCheck.hide();
                }
            });

            $("#spanReCheck").click(function ()
            {
                $divReCheck.hide();
            });
            var $tbReCheck = $("#tbReCheck");
            setTableRowAttributes($tbReCheck[0]);
            //验证回退节点
            var ValidateReCheck = function ()
            {
                if ($reRdo.is(":checked") && $tbReCheck.find(":input:checked").length == 0)
                {
                    $divReCheck.show();
                    return alertMsg("请选择回退节点！");
                }
                $("#hidReturnCLID").val($tbReCheck.find(":input:checked").val())
                return true;
            };
        }

        $rdo.click(function ()
        {
            // 打回调整等不需要验证审核要点 add by zhangmq 2014-08-11
            var txtReplyResult = $(this).parent().text();
            if (txtReplyResult === "不同意" || txtReplyResult === "打回调整" || txtReplyResult === "打回重审" ||
                txtReplyResult === "打回拆分" || txtReplyResult === "重新起草")
            {
                $("span.ico-IsMustCheck").hide();
            }
            else
            {
                $("tr.item-MustCheck").find("span.ico-IsMustCheck").show();
            }
        });

        var arrRejectReasons = (new Function("return " + $("#hidRejectReasons").val()))();
        if (typeof arrRejectReasons === "object" && arrRejectReasons instanceof Array && arrRejectReasons.length > 0)
        {
            //驳回原因
            var divRejectReason = "<div id='divRejectReason' style='display:none;position:absolute;width:400px;'></div>";

            $("body").append(divRejectReason);
            var strHtml = "<iframe style='position: absolute; z-index: -1; width: 100%;top: 0; left: 0;margin:0;padding:0; scrolling: no;' frameborder='0' src='about:blank'></iframe>" +
                        "<div style='background-color:#eee;border:1px solid #aaa;padding:3px;width:100%;height:100%;'><div style='width:100%;height:18px;padding-top:1px;margin-bottom:3px;padding-left:3px;border-left:8px solid " + headColor + ";border-bottom:1px solid " + headColor + ";color:" + headColor + "'>请选择驳回原因" +
                        "<span id='spanRejectCheck' style='background:url(" + pageArgus.rootDir + "/App_Themes/" + pageArgus.pageTheme + "/img/control/area_collapse.gif) no-repeat center center;display:block;width:20px;height:20px;position:absolute;right:0;top:0;cursor:hand'></span></div>" +
                        "<table class='table' id='tbRejectReason'><tr class='table_headrow'><td style='width:30px'></td>" +
                        "<td style='width:370px'>驳回原因</td></tr>";



            $.each(arrRejectReasons, function (i, value)
            {
                strHtml += "<tr><td style='text-align:center'><input type='radio' name='rejectReason' value='" + value.FRRID +
                    "' /></td><td style='text-align:left' title='" + value.Remark + "'>" + value.RejectReason + "</td></tr>";
            });

            strHtml += "</table></div>"
            var $divRejectReason = $("#divRejectReason");
            $divRejectReason.html(strHtml);

            var bodyHeight = document.body.clientHeight;
            $divRejectReason.find("iframe").find("body").height($divRejectReason.height());

            // 驳回批复结果代码
            var rejectOption = {
                2: true,
                5: true,
                6: true,
                11: true
            };

            $rdo.click(function ()
            {
                var pos = $(this).offset();
                if (rejectOption[this.value.split('@')[0]] && $(this).is(":checked"))
                {
                    $divRejectReason.css({ bottom: bodyHeight - pos.top + 2, left: pos.left });
                    $divRejectReason.show();
                }
                else
                {
                    $divRejectReason.hide();
                }
            });

            $("#spanRejectCheck").click(function ()
            {
                $divRejectReason.hide();
            });

            var $tbRejectReason = $("#tbRejectReason");
            setTableRowAttributes($tbRejectReason[0]);

            //  验证是否选择驳回原因
            var validateRejectReason = function ()
            {
                var $chkRadio = $tbRejectReason.find(":input:checked");
                if (rejectOption[$rdo.filter(":checked").val().split("@")[0]] && $chkRadio.length == 0)
                {
                    $divRejectReason.show();
                    return alertMsg("请选择驳回原因！");
                }

                var txtRejectReason = $chkRadio.closest("tr").find("td:eq(1)").text();
                $("#hidRejectValue").val(txtRejectReason);
                $("#hidRejectFRRID").val($chkRadio.val());
                return true;
            };
        }
    }

    //保留意见 add by zhangmq 2013-1-10
    if (hidFlowOptionValue == "Check" || hidFlowOptionValue == "Deal" || hidFlowOptionValue == "Communicate")
    {
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
                    "action": "SaveCheckDescription",
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
    }
});

    function showMenu(id, index)
    {
        getObj('hidInsertIndex').value = index;
        popMenu(getObj(pageArgus.id_divMenuID), 130, id);
        event.returnValue = false;
        event.cancelBubble = true;
        return false;
    }

    function popMenu(menuDiv, width, rowControlString)
    {
        if (!pop)
        {
            pop = window.createPopup();
        }
        pop.document.body.innerHTML = menuDiv.innerHTML;
        var rowObjs = pop.document.body.all[0].rows;
        var rowCount = rowObjs.length;
        for (var i = 0; i < rowObjs.length; i++)
        {
            var hide = rowControlString.charAt(i) != '1';
            if (hide)
            {
                rowCount--;
            }
            rowObjs[i].style.display = (hide) ? "none" : "";
            rowObjs[i].cells[0].onmouseover = function ()
            {
                this.style.background = "#7b68ee";
                this.style.color = "white";
            }
            rowObjs[i].cells[0].onmouseout = function ()
            {
                this.style.background = "#ccff00";
                this.style.color = "black";
            }
        }

        pop.document.oncontextmenu = function ()
        {
            return false;
        }

        pop.document.onclick = function ()
        {
            pop.hide();
        }

        pop.show(event.clientX - 1, event.clientY, width, rowCount * 20, document.body);

        return true;
    }

    function divHeight()
    {
        var dlCheckList = getObj(pageArgus.id_dlCheckListID);
        var divDL = getObj(pageArgus.id_divDLID);
        if (dlCheckList != null && divDL.clientHeight < dlCheckList.clientHeight)
        {
            divDL.style.height = dlCheckList.clientHeight + 20 + 'px';
        }
    }

    function addCheckTach(tachType)
    {
        if (pop)
        {
            pop.hide();
        }

        var rootDir = pageArgus.rootDir;
        var corpID = getObj('hidCorpID').value;

        var hidInsertStationID = getObj('hidInsertStationID');
        var btnInsertTach = getObj(pageArgus.id_btnInsertTachID);

        hidInsertStationID.value = "";
        if ($("#divCheckFlow").length != 0 && $("div[id$='ucFlowCheck_divDL']") != 0)
        {
            $("#hidScrollData").val($("#divCheckFlow")[0].scrollTop + "|" + $("div[id$='ucFlowCheck_divDL']")[0].scrollLeft);
        }

        //起草人调整
        if (tachType == "Adjust")
        {
            hidInsertStationID.value = pageArgus.createStationID + "#All&Adjust&N&1&1&调整&N&&";
            btnInsertTach.click();
        }
        //成本拆分
        else if (tachType == "Allot")
        {
            hidInsertStationID.value = pageArgus.allotStationID + "#All&Allot&N&1&1&拆分&N&&";
            btnInsertTach.click();
        }
        //串环
        else if (tachType == "Bunch")
        {
            hidInsertStationID.value = openModalWindow(pageArgus.rootDir + '/Common/Select/VInsertTachSingleStation.aspx?From=Check&CorpID=' + corpID, 0, 0);
            if (hidInsertStationID.value != "" && hidInsertStationID.value != "undefined")
            {
                btnInsertTach.click();
            }
        }
        //并环
        else if (tachType == "Parataxis")
        {
            hidInsertStationID.value = openModalWindow(pageArgus.rootDir + '/Common/Select/VInsertTachMultiStation.aspx?From=Check&CorpID=' + corpID, 0, 0);
            if (hidInsertStationID.value != "" && hidInsertStationID.value != "undefined")
            {
                btnInsertTach.click();
            }
        }
    }