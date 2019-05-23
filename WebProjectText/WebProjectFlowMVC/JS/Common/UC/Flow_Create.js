// UC_Flow_Create.ascx用到的js

$(function ()
{
    if (!getObj("divFlow_UF"))
    {
        return;
    }

    var flowImgDir = "/" + rootUrl + "/Image/flow";
    var insertTachPageDir = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectInsertTach.aspx";
    var insertRolePageDir = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectInsertRole.aspx";
    var insertFixerPageDir = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectInsertFixer.aspx?FlowID=" + $('#ddlFlow').val() + "&StationID=" + $('#hidStationID').val();

    // 流程对象
    var flow = {};

    // 替换分号的正则表达式
    var reg = new RegExp("；", "g");

    // 环节类型名称对象
    var flnames = { "0": "审核", "1": "调整", "2": "拆分", "3": "会签", "4": "处理", "5": "归档", "start": "开始", "end": "结束" };

    // 通过方式
    var passtypes = { "1": "全部通过", "2": "一人通过" };

    // 流程图中审批人的html
    var nodeHtml = '<table checkeridx="{1}" class="tb_checker"><tr><td><img src="' + flowImgDir + '/p{0}.png" class="img_checker"/></td><td class="sp_ctype">'
        + '<span>{2}</span><br/><span class="sp_cname">{3}</span></td></tr></table>';

    // 流程信息悬停提示
    var tip_over = false, arr_display = [], arr_focus = [], zIndex = 2000;

    // 添加开始和结束节点，并设置结构码
    var initNodes = function (nodes)
    {
        if (nodes.length === 0 || nodes[0]["flowoption"] !== "start")
        {
            nodes.unshift({ "flowoption": "start", "isvisible": "Y", "checker": [{}] });
        }
        if (nodes[nodes.length - 1]["flowoption"] !== "end")
        {
            nodes.push({ "flowoption": "end", "isvisible": "Y", "checker": [{}] });
        }

        var preIdx, tNo = 0, cNo;
        for (var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            if (node["isvisible"] === "Y")
            {
                cNo = 0;
                var checkers = node["checker"];
                for (var j = 0; j < checkers.length; j++)
                {
                    var checker = checkers[j];
                    if (checker["isvisible"] === "Y")
                    {
                        checker["outline"] = tNo + "." + (++cNo);
                    }
                }
                if (cNo === 1)
                {
                    checkers[0]["outline"] = tNo;
                }
                node["outline"] = tNo;
                node["cnt"] = cNo;
                if (i > 0)
                {
                    nodes[preIdx]["nextcnt"] = cNo;
                }

                preIdx = i;
                tNo++;
            }
        }
    };

    // 根据flsid获取审批人的结构码
    var getNodeOutline = function (flsid)
    {
        for (var i = 1; i < flow["nodes"].length - 1; i++)
        {
            var checkers = flow["nodes"][i]["checker"];
            for (var j = 0; j < checkers.length; j++)
            {
                var checker = checkers[j];
                if (checker["flsid"] === flsid)
                {
                    return checker["outline"];
                }
            }
        }
    };

    // 获取连接线（箭头）的html
    var getSeparatorHtml = function (preLen, nextLen, insertIdx)
    {
        var html = '<td><div class="div_arr">';
        var utop, dtop, vlheight, len1, len2;

        if (!preLen)
        {
            preLen = 1;
        }
        if (!nextLen)
        {
            nextLen = 1;
        }

        len1 = (preLen - preLen % 2) / 2;
        len2 = (nextLen - nextLen % 2) / 2;

        if (preLen % 2 === 1)
        {
            utop = 2;
            dtop = -12;
            vlheight = 28;
            html += '<img src="' + flowImgDir + '/l0.png" class="img_al0" style="top:-' + utop + 'px"/>';
        }
        else
        {
            utop = -25;
            dtop = -38;
            vlheight = 2;
        }

        for (var i = 0; i < len1 ; i++)
        {
            utop += 53;
            dtop += 53;
            html += '<img src="' + flowImgDir + '/l1.png" class="img_al1" style="top:-' + utop + 'px"/>';
            html += '<img src="' + flowImgDir + '/l2.png" class="img_al1" style="top:' + dtop + 'px"/>';
        }

        if (len1 >= 1)
        {
            vlheight += 53 * (len1 - 1);
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:25px;top:-' + (utop - 15) + 'px"></div>';
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:25px;top:13px"></div>';
        }

        html += '<img src="' + flowImgDir + '/m' + (preLen === 1 ? '1' : (preLen % 2 === 0 ? '2' : '3')) + (nextLen === 1 ? '1' : (nextLen % 2 === 0 ? '2' : '3'))
            + '.png" class="img_am"' + (insertIdx >= 0 ? ' insertidx=' + insertIdx : '') + ' style="left:25px;top:-12px"/>';

        if (nextLen % 2 === 1)
        {
            utop = 5;
            dtop = -12;
            vlheight = 28;
            html += '<img src="' + flowImgDir + '/r0.png" class="img_ar0" style="left:56px;top:-' + utop + 'px"/>';
        }
        else
        {
            utop = -22;
            dtop = -38;
            vlheight = 2;
        }
        for (var i = 0; i < len2 ; i++)
        {
            utop += 53;
            dtop += 53;
            html += '<img src="' + flowImgDir + '/r1.png" class="img_ar1" style="left:53px;top:-' + utop + 'px"/>';
            html += '<img src="' + flowImgDir + '/r2.png" class="img_ar1" style="left:53px;top:' + dtop + 'px"/>';
        }

        if (len2 >= 1)
        {
            vlheight += 53 * (len2 - 1);
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:53px;top:-' + (utop - 18) + 'px"></div>';
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:53px;top:13px"></div>';
        }

        html += '</div></td>';

        return html;
    };

    // 获取环节（含审批人）的html
    var getNodeHtml = function (node, nodeIdx)
    {
        var html = '';

        var flowOption = node["flowoption"];
        var checkers = node["checker"];

        html += '<td class="td_tach" nodeidx="' + nodeIdx + '">';
        if (flowOption === "start")
        {
            html += '<img src="' + flowImgDir + '/begin.png" class="img_swtich" title="开始"/>';
        }
        else if (flowOption === "end")
        {
            html += '<img src="' + flowImgDir + '/end.png" class="img_swtich" title="结束"/>';
        }
        else
        {
            for (var i = 0; i < checkers.length; i++)
            {
                var checker = checkers[i];
                if (checker["isvisible"] === "Y")
                {
                    var findtype = checker["findtype"].toLowerCase();
                    var loadtype = checker["loadtype"];

                    switch (loadtype)
                    {
                        case "0":
                            var person = checker["person"][0];
                            html += stringFormat(nodeHtml, "s", i, person["employeename"] ? person["employeename"] : '未指定', person["stationname"]);
                            break;
                        case "1":
                            html += stringFormat(nodeHtml, findtype, i, checker["findname"], '<img src="' + flowImgDir + '/add.png" class="img_selectIco" />');
                            break;
                        case "2":
                            html += stringFormat(nodeHtml, findtype, i, checker["findname"], '审批人' + getNodeOutline(checker["findid"]));
                            break;
                    }
                }
            }
        }

        html += '</td>';

        return html;
    };

    // 获取流程图的html
    var getChartHtml = function (nodes)
    {
        var html = "";
        var allowAdd = flow["basicinfo"]["info"]["allowadd"];
        for (var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            if (node["isvisible"] === "Y")
            {
                html += getNodeHtml(node, i);
                if (i < nodes.length - 1)
                {
                    html += getSeparatorHtml(node["cnt"], node["nextcnt"], allowAdd === "Y" ? (i + 1) : -1);
                }
            }
        }

        return html;
    };

    // 获取流程图头的html
    var getChartHeadHtml = function (nodes)
    {
        var html = '', tNo = 0;
        for (var i = 0; i < nodes.length; i++)
        {
            if (nodes[i]["isvisible"] === "Y")
            {
                html += '<td nodeidx="' + i + '" class="td_head">' + ((i > 0 && i < nodes.length - 1) ? '<em class="em_tachno">' + ++tNo + '</em>' : '')
                    + '<span>' + flnames[nodes[i]["flowoption"]] + '</span></td>';

                if (i < nodes.length - 1)
                {
                    html += '<td class="td_sep"></td>';
                }
            }
        }

        return html;
    };

    // 获取插入环节图标的dom
    var insertIco, mouseWithinIco;
    var getInertTachHoverTip = function (insertIdx)
    {   
        if (!insertIco)
        {
            insertIco = document.createElement('img');
            insertIco.src = flowImgDir + "/add.png";
            insertIco.className = "img_insertico";
            $(insertIco).appendTo($(document.body));

            $(insertIco).bind("mouseover", function ()
            {
                mouseWithinIco = true;
            }).bind("mouseout", function ()
            {
                mouseWithinIco = false;
            }).bind("click", function ()
            {
                $(this).hide();
                var x = parseInt(this.insertidx);
                var id = "dlgIS";
                var ifrname = "ISData";

                window["tachinfo"]["hasPreviousSaveTach"] = hasPreviousSaveTach(x);
                window["tachinfo"]["hasNextSaveTach"] = hasNextSaveTach(x);
                window["tachinfo"]["hasNextCheckTach"] = hasNextCheckTach(x);

                showDialog(
                    {
                        "title": "选择审批人岗位并设置环节信息",
                        "html": stringFormat($("#scInsertStation").html(), ifrname),
                        "width": 600,
                        "height": 480,
                        "id": id
                    }, function ()
                    {
                        var ifr = $("#" + id + " iframe");
                        if (ifr.attr("src") !== insertTachPageDir)
                        {
                            ifr.attr("src", insertTachPageDir);
                        }

                        $("#" + id + " button").unbind("click");
                        $("#" + id + " button:eq(1)").bind("click", function ()
                        {
                            closeDialog(id);
                        });

                        (function loadFramePage()
                        {
                            var state = frames(ifrname).document.readyState;
                            if (state !== "complete")
                            {
                                setTimeout(loadFramePage, 20);
                            }
                            else
                            {
                                $("#" + id + " button:eq(0)").bind("click", function ()
                                {
                                    var node = frames(ifrname).submitSelect()
                                    if (node)
                                    {
                                        closeDialog(id);
                                        flow["nodes"].splice(x, 0, node);
                                        loadFlowChart();
                                        showFlowOptBtn();
                                    }
                                });
                                frames(ifrname).initPage();
                            }
                        })();
                    });
            });
        }
        insertIco.insertidx = insertIdx;

        return insertIco;
    };

    // x环之前是否有归档环节
    var hasPreviousSaveTach = function (x)
    {
        for (var i = 1; i < x; i++)
        {
            if (flow["nodes"][i]["flowoption"] === "5")
            {
                return true;
            }
        }

        return false;
    };

    // x环之后是否有归档环节
    var hasNextSaveTach = function (x)
    {
        var len = flow["nodes"].length;
        for (var i = x; i < len - 1; i++)
        {
            if (flow["nodes"][i]["flowoption"] === "5")
            {
                return true;
            }
        }

        return false;
    };

    // x环之后是否有审核和调整环节
    var hasNextCheckTach = function (x)
    {
        var len = flow["nodes"].length;
        for (var i = x; i < len - 1; i++)
        {
            if (inValues(flow["nodes"][i]["flowoption"], "0", "1"))
            {
                return true;
            }
        }

        return false;
    };

    // 绑定拖动和resize事件
    var bindChartEvent = function (obj)
    {
        obj.bind("mousedown", function ()
        {
            var divFlow = getObj("divFlow_UF");
            if (event.clientY > getAbsAxisY(divFlow) + 20 && event.clientY < getAbsAxisY(divFlow) + divFlow.offsetHeight - 20
                    && event.clientX < getAbsAxisX(divFlow) + divFlow.offsetWidth - 20 && beDragBackground())
            {
                mDown(this);
            }
        }).bind("mousemove", function ()
        {
            mMove(this);
        }).bind("mouseup", function ()
        {
            mUp(this);
        });

        var ww = obj.width(), hh = obj.height();
        obj.bind("resize", function ()
        {
            var nw = obj.width(), nh = obj.height();
            if (nw !== ww || nh !== hh)
            {
                hideAllTip();
                ww = nw;
                hh = nh;
            }
        });
    };

    // 绑定环节和审批人的悬停事件
    var bindNodeMouseOverEvent = function (obj)
    {
        if (obj.css("cursor") !== "pointer")
        {
            obj.css("cursor", "pointer");
        }

        obj.bind("mouseover", function ()
        {
            var id, left, top, width, height, tipname;
            switch (this.className)
            {
                // 环节（表头环节号）
                case "td_head":
                    id = "div1_" + $(this).attr("nodeidx") + "_0";
                    left = getAbsAxisX(this) + $(this).width() / 2;
                    top = getAbsAxisY(this) + $(this).height();
                    width = 230;
                    height = 10;
                    tipname = "TachTip";
                    break;
                    // 审批人
                case "img_checker":
                    if ($(this).closest("tb_checker").attr("moving"))
                    {
                        return;
                    }
                    id = "div2_" + $(this).closest(".td_tach").attr("nodeidx") + "_" + $(this).closest(".tb_checker").attr("checkeridx");
                    left = getAbsAxisX(this) + 23;
                    top = getAbsAxisY(this) + 34;
                    width = 200;
                    height = 10;
                    tipname = "CheckerTip";
                    break;
            }

            showTipInfo(id, left, top, width, height, tipname);
        });
    };

    // 绑定插入环节图标的鼠标事件
    var bindInsertTachMouseEvent = function (obj)
    {
        if (obj.length)
        {
            if (obj.css("cursor") !== "pointer")
            {
                obj.css("cursor", "pointer");
            }

            obj.bind("mouseover", function ()
            {
                hideAllTip();
                insertIco = getInertTachHoverTip($(this).attr("insertidx"));
                $(insertIco).appendTo($(this).closest(".div_arr"));
                $(insertIco).show();
            }).bind("mouseout", function ()
            {
                setTimeout(function ()
                {
                    if (!mouseWithinIco)
                    {
                        $(insertIco).hide();
                    }
                }, 10);
            });
        }
    };

    // 绑定选择审批人图标的鼠标事件（F/P/D/E）
    var bindWaitSelectMouseEvent = function (obj)
    {
        if (obj.length)
        {
            obj.bind("click", function ()
            {
                var x = parseInt($(this).closest(".td_tach").attr("nodeidx"));
                var y = parseInt($(this).closest(".tb_checker").attr("checkeridx"));
                var node = flow["nodes"][x];
                var checkers = node["checker"];
                var checker = checkers[y];
                var findtype = checker["findtype"].toLowerCase();
                var insertPage = findtype === "f" ? insertFixerPageDir : insertRolePageDir;
                var id = findtype === "f" ? "dlgSIF" : "dlgSIR";
                var ifrname = findtype === "f" ? "IFData" : "IRData";

                window["tachinfo"]["flowoption"] = node["flowoption"];
                window["tachinfo"]["waitselectchecker"] = checker;

                showDialog(
                    {
                        "title": "选择岗位",
                        "html": stringFormat($("#scInsertStation").html(), ifrname),
                        "width": 600,
                        "height": findtype === "f" ? 480 : 300,
                        "id": id
                    }, function ()
                    {
                        var ifr = $("#" + id + " iframe");
                        if (ifr.attr("src") !== insertPage)
                        {
                            ifr.attr("src", insertPage);
                        }

                        $("#" + id + " button").unbind("click");
                        $("#" + id + " button:eq(1)").bind("click", function ()
                        {
                            closeDialog(id);
                        });

                        (function loadFramePage()
                        {
                            var state = frames(ifrname).document.readyState;
                            if (state !== "complete")
                            {
                                setTimeout(loadFramePage, 20);
                            }
                            else
                            {
                                $("#" + id + " button:eq(0)").bind("click", function ()
                                {
                                    var selectedCheckers = frames(ifrname).submitSelect()
                                    if (selectedCheckers)
                                    {
                                        closeDialog(id);
                                        for (var i = 0; i < selectedCheckers.length; i++, y++)
                                        {
                                            checkers.splice(y, i > 0 ? 0 : 1, selectedCheckers[i]);
                                        }
                                        if (findtype !== "f")
                                        {
                                            resetChargeLeader(checker["flsid"], selectedCheckers[0]["person"][0]["idx"]);
                                        }
                                        loadFlowChart();
                                        showFlowOptBtn();
                                    }
                                });
                                frames(ifrname).initPage();
                            }
                        })();
                    });
            });
        }
    };

    // 绑定信息框编辑事件
    var bindTipAddAndEditEvent = function (divTip, cps)
    {
        $(".img_add[type='1'],.img_del[type='1']", divTip).attr("title", function ()
        {
            return $(this).attr("opt") === "0" ? "新增审批要点" : "删除审批要点";
        }).unbind("click").bind("click", function ()
        {
            if ($(this).attr("opt") === "0")
            {
                var id = "dlgCP";

                hideAllTip();

                showDialog(
                    {
                        "title": "输入审批要点",
                        "html": $("#scAddCP").html(),
                        "width": 400,
                        "height": 150,
                        "id": id
                    }, function ()
                    {
                        var txtCPDesc = $("#dlgCP #txtCPDesc");
                        txtCPDesc[0].focus();

                        $("#" + id + " #btnSOCP,#" + id + " #btnSCCP,#" + id + " #btnCCP").unbind("click");
                        $("#" + id + " #btnCCP").bind("click", function ()
                        {
                            closeDialog(id);
                        });

                        $("#" + id + " #btnSOCP,#" + id + " #btnSCCP").bind("click", function ()
                        {
                            if (trim(txtCPDesc.val()) == "")
                            {
                                return alertMsg("要点描述不能为空。", txtCPDesc);
                            }
                            cps.push({ "checkpointdesc": trim(txtCPDesc.val()), "ismustcheck": "N" });
                            txtCPDesc.val("");
                            txtCPDesc[0].focus();
                            if ($(this).attr("id") === "btnSCCP")
                            {
                                closeDialog(id);
                            }
                        });
                    });
            }
            else
            {
                cps.splice($(this).closest("tr").index(), 1);
                initTipInfoValue(divTip, "PointTip");
            }
        });

        $("#tbPoint tbody :checkbox", divTip).bind("click", function ()
        {
            var chk = $(this);
            cps[chk.closest("tr").index()]["ismustcheck"] = chk[0].checked ? "Y" : "N";
        });
    };

    // 显示流程操作按钮（重置）
    var flowOptBtn;
    var showFlowOptBtn = function ()
    {
        if (!flowOptBtn)
        {
            flowOptBtn = $('<div class="div_optbtn"></div>')
            flowOptBtn.html($("#scResetBtn").html());
            $("#divFlow_UF").parent().append(flowOptBtn);

            $("#btnResetFlow").bind("click", function ()
            {
                flow = $.stringToJSON(hidFlow_Values.value);
                loadFlowChart();
                flowOptBtn.hide();
            });
        }
        flowOptBtn.show();
    }
    
    // 初始化信息框的值
    var initTipInfoValue = function (divTip, tipname)
    {
        var infos = divTip.attr("id").split("_");
        var x = parseInt(infos[1]);
        var y = parseInt(infos[2]);
        var nodes = flow["nodes"];
        var node = nodes[x];
        var flowoption = node["flowoption"];
        var checkers = node["checker"];

        switch (tipname)
        {
            case "TachTip":
                $("#tdFlowOption span", divTip).text(flnames[flowoption]);
                $("#divFLName", divTip).text(node["flname"]).attr("title", node["flname"]);
                $("#tdPassType span", divTip).text(passtypes[node["passtype"]]);
                $("#spGD", divTip).text(node["gd"]);
                $("#spAD", divTip).text(node["ad"]);
                $("tr:eq(0) .em_summary", divTip).text("环节" + node["outline"]);
                break;
            case "CheckerTip":
                var checker = checkers[y];
                
                var findtype = checker["findtype"].toLowerCase();
                var loadtype = checker["loadtype"];
                var persons = checker["person"];

                $("#trEmployee,#trStation,#trCorp,#trDept", divTip).toggle(loadtype === "0");
                $("#trPosition", divTip).toggle(loadtype === "1" && findtype === "p");
                $("#trFlowRole1", divTip).toggle(loadtype === "1" && findtype === "d");
                $("#trFlowRole2", divTip).toggle(loadtype === "1" && findtype === "e");
                $("#trFixRemark", divTip).toggle(loadtype === "1" && findtype === "f");
                $("#trLeader", divTip).toggle(loadtype === "2" && findtype === "b");
                $("#trCheckPoint", divTip).toggle(checker["isinserted"] === "Y");
                
                switch (loadtype)
                {
                    case "0":
                        if (persons.length)
                        {
                            $("#trEmployee .sp_fvalue", divTip).text(persons[0]["employeename"]);
                            $("#trStation .sp_fvalue", divTip).text(persons[0]["stationname"]);
                            $("#trCorp .sp_fvalue", divTip).text(persons[0]["corpname"]);
                            $("#trDept .sp_fvalue", divTip).text(persons[0]["deptname"]);
                        }
                        break;
                    case "1":
                        switch (findtype)
                        {
                            case "p":
                                $("#trPosition .sp_fvalue", divTip).text(checker["findname"]);
                                break;
                            case "d":
                                $("#trFlowRole1 .sp_fvalue", divTip).text(checker["findname"]);
                                break;
                            case "e":
                                $("#trFlowRole2 .sp_fvalue", divTip).text(checker["findname"]);
                                break;
                            case "f":
                                if (persons.length)
                                {
                                    $("#trFixRemark .sp_fvalue", divTip).text(persons[0]["stationname"]);
                                }
                                break;
                        }
                        break;
                    case "2":
                        $("#trLeader .sp_fvalue", divTip).text("审批人" + getNodeOutline(checker["findid"]));
                        break;
                }
                $("tr:eq(0) .em_summary", divTip).text("审批人" + checker["outline"]);
                break;
            case "PointTip":
                var checker = checkers[y];
                var cps = checker["point"];
                var html = '';

                if (!$.isEmptyObject(cps))
                {
                    for (var i = 0; i < cps.length; i++)
                    {
                        html += stringFormat('<tr><td>{0}</td><td style="text-align:center"><input type="checkbox" class="idbox"{1} />'
                            + '</td><td><img type="1" opt="2" class="img_del" src="../../Image/flow/delete.png" /></td></tr>',
                            cps[i]["checkpointdesc"], cps[i]["ismustcheck"] === "Y" ? ' checked="checked"' : '');
                    }
                }
                else
                {
                    cps = [];
                    checker["point"] = cps;
                }

                $("#tbPoint tbody", divTip).html(html);
                bindTipAddAndEditEvent(divTip, cps);
                break;
        }
    };

    // 设置分管领导
    var resetChargeLeader = function (flsid, baseIdx)
    {
        for (var i = 0; i < flow["nodes"].length; i++)
        {
            var node = flow["nodes"][i];
            if (inValues(node["flowoption"], "0", "1", "3", "4"))
            {
                var checkers = node["checker"];
                var hasVisibleChecker = false;
                for (var j = 0; j < checkers.length; j++)
                {
                    var checker = checkers[j];
                    if (checker["findtype"].toLowerCase() === "b" && checker["findid"] === flsid)
                    {
                        var persons = checker["person"];
                        var hasChargeLeader = false;
                        for (var k = 0; k < persons.length; k++)
                        {
                            if (persons[k]["baseidx"] === baseIdx)
                            {
                                hasChargeLeader = true;
                                persons.splice(0, persons.length, persons[k]);
                                checker["loadtype"] = "0";
                                break;
                            }
                        }
                        if (!hasChargeLeader)
                        {
                            persons.length = 0;
                            checker["isvisible"] = "N";
                        }
                    }
                    if (checker["isvisible"] === "Y")
                    {
                        hasVisibleChecker = true;
                    }
                }
                if (!hasVisibleChecker)
                {
                    node["isvisible"] = "N";
                }
            }
        }
    };

    // 显示流程信息提示框
    var showTipInfo = function (id, left, top, width, height, tipname)
    {
        var divTip = $("#" + id);

        if (!divTip.length)
        {
            divTip = $('<div id="' + id + '" class="div_hoverinfotip"></div>');

            if (tipname === "PointTip")
            {
                divTip.css("overflow-y", "auto");
            }

            divTip.bind("mouseover", function ()
            {
                tip_over = true;

                if (arr_display[id])
                {
                    arr_focus[id] = 1;
                    divTip.focus();
                }
            }).bind("mouseout", function ()
            {
                tip_over = false;
            }).bind("blur", function ()
            {
                arr_focus[id] = 0;

                if (!tip_over)
                {
                    var allblur = 1;
                    for (var key in arr_display)
                    {
                        if (arr_display[key] && arr_focus[key])
                        {
                            allblur = 0;
                            break;
                        }
                    }
                    if (allblur)
                    {
                        hideAllTip();
                    }
                }
            });

            divTip.html(stringFormat($("#sc" + tipname).html(), flowImgDir));

            divTip.appendTo(document.body);
            
            // 关闭图标效果
            $(".img_close", divTip).bind("mouseover", function ()
            {
                $(this).attr("src", $(this).attr("src").replace("close", "closeon"));
            }).bind("mouseout", function ()
            {
                $(this).attr("src", $(this).attr("src").replace("closeon", "close"));
            }).bind("click", function ()
            {
                hideAllTip();
            });

            // 更多信息（审批要点）效果
            $(".img_more", divTip).closest("td").bind("mouseover", function ()
            {
                var td = $(this);
                var img = td.find("img");
                var tipname_more = td.attr("tipname");

                img.attr("src", img.attr("src").replace("more", "moreon"));
                td.addClass("td_popform_on");

                showTipInfo(id + "_" + tipname_more, getAbsAxisX(this) + this.offsetWidth, getAbsAxisY(this), 300, 160, tipname_more);
            }).bind("mouseout", function ()
            {
                var img = $(this).find("img");
                img.attr("src", img.attr("src").replace("moreon", "more"));
                $(this).removeClass("td_popform_on");
            });
        }

        initTipInfoValue(divTip, tipname);

        hideOtherTip(id);

        if (left + width > document.body.offsetWidth)
        {
            left = document.body.offsetWidth - width;
        }
        if (document.body.offsetHeight - top - height < 0)
        {
            top = document.body.offsetHeight - height;
        }
        if (left < 0)
        {
            left = 0;
        }
        if (top < 0)
        {
            top = 0;
        }

        divTip.css(
            {
                "left": left,
                "top": top,
                "width": width,
                "height": height,
                "z-index": ++zIndex,
                "display": "block"
            });

        height = divTip[0].offsetHeight;
        if (document.body.offsetHeight - top - height < 0)
        {
            divTip.css({ "top": document.body.offsetHeight - height });
        }

        divTip.focus();
    };

    // 隐藏其他信息提示框
    var hideOtherTip = function (id)
    {
        var len = id.split("_").length;
        for (var key in arr_display)
        {
            if (key != id && key.split("_").length >= len && arr_display[key])
            {
                $("#" + key).hide();
                arr_display[key] = 0;
            }
        }
        if (getObj(id))
        {
            arr_display[id] = 1;
            arr_focus[id] = 1;
        }
    };

    // 隐藏所有信息提示框
    var hideAllTip = function ()
    {
        for (var key in arr_display)
        {
            if (arr_display[key])
            {
                $("#" + key).hide();
                arr_display[key] = 0;
                arr_focus[key] = 0;
            }
        }
        tip_over = false;
    };

    // 是否拖动面板背景
    var beDragBackground = function ()
    {
        var eobj = getEventObj();
        var etag = eobj.tagName.toLowerCase();
        var etr = getParentObj(eobj, "tr");

        return (etag === "div" || etag === "td" && etr.id === "trFlow_UF");
    }
    
    // 加载流程图
    var loadFlowChart = function ()
    {
        var divFlow = getObj("divFlow_UF");
        if (divFlow)
        {
            var sl = divFlow.scrollLeft;
            var st = divFlow.scrollTop;

            initNodes(flow["nodes"]);

            var tbFlow = getObj("tbFlow_UF");
            //redrawHandle(tbFlow, function ()
            //{
            $("#trFlow_UF", tbFlow).html(getChartHtml(flow["nodes"]));
            $("#trHead_UF", tbFlow).html(getChartHeadHtml(flow["nodes"]));
            //});

            bindNodeMouseOverEvent($("#trHead_UF td.td_head:not(:first):not(:last),#trFlow_UF .img_checker"));

            insertIco = null;
            bindInsertTachMouseEvent($("#trFlow_UF .img_am[insertidx]"));
            bindWaitSelectMouseEvent($("#trFlow_UF .img_selectIco"));

            divFlow.scrollLeft = sl;
            divFlow.scrollTop = st;

            setTimeout(function ()
            {
                if (divFlow.scrollWidth > divFlow.offsetWidth)
                {
                    divFlow.style.overflowX = 'scroll';
                }
            }, 10);
        }
    };

    // 拖动流程图背景效果
    var ox, oy, movable = 0;    // 鼠标与拖动对象左上角的X、Y坐标差、允许拖动（1/0）、当前操作类型
    var mDown = function (obj)
    {
        hideAllTip();
        $(obj).attr("moving", "1");

        var divFlow = getObj("divFlow_UF");
        ox = event.clientX + divFlow.scrollLeft;
        oy = event.clientY + divFlow.scrollTop;

        movable = 1;
        obj.setCapture();
    };
    var mMove = function (obj)
    {
        if (movable)
        {
            var divFlow = getObj("divFlow_UF");
            divFlow.scrollLeft = ox - event.clientX;
            //divFlow.scrollTop = oy - event.clientY;
        }
    };
    var mUp = function (obj)
    {
        $(obj).removeAttr("moving");

        if (movable)
        {
            movable = 0;
            obj.releaseCapture();
        }
    };

    // 流程验证
    window.fl_validate = function ()
    {
        var hasValidChecker = false;
        var hasAllotor = false;
        for (var i = 0; i < flow["nodes"].length; i++)
        {
            var node = flow["nodes"][i];
            if (node["isvisible"] === "Y")
            {
                var checkers = node["checker"];
                for (var j = 0; j < checkers.length; j++)
                {
                    var checker = checkers[j];
                    if (checker["isvisible"] === "Y")
                    {
                        if (checker["loadtype"] === "1")
                        {
                            //alert("请为审批人" + checker["outline"] + "选择岗位。");
                            //更改提示信息  张韩  20150720
                            if (checker["outline"] && String(checker["outline"]).indexOf(".") > -1)
                            {
                                var outlines = checker["outline"].split('.');
                                alert("请为第" + outlines[0] + "个环节，第" + outlines[1] + "个审批人选择岗位。");
                            }
                            else
                            {
                                alert("请为第" + checker["outline"] + "环节审批人选择岗位。");
                            }
                               return false;
                        }
                        switch (node["flowoption"])
                        {
                            case "0":
                            case "3":
                            case "4":
                            case "5":
                                hasValidChecker = true;
                                break;
                            case "2":
                                hasAllotor = true;
                                break;
                        }
                    }
                }
            }
        }

        if (!hasValidChecker)
        {
            alert("流程必须包含审核（会签/处理/归档）环节。");
            return false;
        }
        if (window["tachinfo"]["isneedallot"] && !hasAllotor)
        {
            alert("流程必须包含成本拆分环节。");
            return false;
        }

        hidFlow_Values.value = $.jsonToString(flow);
        return true;
    }

    // 加载流程图
    flow = $.stringToJSON(hidFlow_Values.value);
    loadFlowChart();
    bindChartEvent($("#divFlow_UF"));
    window["tachinfo"] = flow["basicinfo"];
    window["tachinfo"]["isneedallot"] = !!getParams(hidFlow_Param.value)["allotstationid"];
    window["tachinfo"]["mode"] = hidFlow_Mode.value;
});