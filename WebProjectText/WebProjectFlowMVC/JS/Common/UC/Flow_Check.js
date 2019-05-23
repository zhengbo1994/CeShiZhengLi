// UC_Flow_Check.ascx、UC_Flow_Adjust.ascx、UC_Flow_Browse.ascx用到的js

$(function ()
{
    if (!hidFlow_Values.value)
    {
        return;
    }

    var flowImgDir = "/" + rootUrl + "/Image/flow";
    var insertTachPageDir = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectInsertTach.aspx";
    var insertCheckerPageDir = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectInsertFixer.aspx";
    var insertBtnId = pageArgus.id_btnInsertTachID;

    // 流程对象
    var flow = {};

    // 替换分号的正则表达式
    var reg = new RegExp("；", "g");

    // 环节类型名称对象
    var flnames = { "0": ["审核", "Check"], "1": ["调整", "Adjust"], "2": ["拆分", "Allot"], "3": ["会签", "Communicate"], "4": ["处理", "Deal"], "5": ["归档", "Save"], "start": ["开始"], "end": ["结束"] };

    // 通过方式
    var passtypes = { "1": "全部通过", "2": "一人通过" };

    // 允许xxx
    var allows = { "Y": "允许", "N": "不允许" };



    // 流程图中审批人的html
    var nodeHtml = '<table checkeridx="{1}" class="tb_checker"><tr><td><img src="' + flowImgDir + '/p{0}.png" class="img_checker"/></td><td class="sp_ctype">'
        + '<span{4}>{2}</span><br/><span class="sp_cname">{3}</span></td></tr></table>';

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
        var currentclid = flow["basicinfo"]["info"]["currentclid"];

        flow["basicinfo"]["info"]["currentidx"] = -1;
        for (var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            if (node["clid"] === currentclid)
            {
                flow["basicinfo"]["info"]["currentidx"] = i;
            }
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
        var currentclid = flow["basicinfo"]["info"]["currentclid"];

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
                    var person = checker["person"] ? checker["person"][0] : checker;
                    html += stringFormat(nodeHtml, "s", i, person["employeename"] ? person["employeename"] : '未指定', person["stationname"],
                        (node["clid"] === currentclid && person["checkopt"] === "0" || person["checkopt"] === "2") ? ' style="color:red"' : '');
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
        var currentIdx = flow["basicinfo"]["info"]["currentidx"];
        
        for (var i = 0; i < nodes.length; i++)
        {
            var node = nodes[i];
            if (node["isvisible"] === "Y")
            {
                html += getNodeHtml(node, i);
                if (i < nodes.length - 1)
                {
                    if (hidFlow_Mode.value === "Edit")
                    {
                        node["allowinsert"] = nodes[i + 1]["allowinsert"] = (currentIdx > 0 && i >= currentIdx) ? "Y" : "N";
                    }
                    var j = getNextNodeIsVisible(i, nodes);
                    html += getSeparatorHtml(node["cnt"], node["nextcnt"], (node["allowinsert"] === "Y" || nodes[j]["allowinsert"] === "Y") ? (j) : -1);
                }
            }
        }

        return html;
    };

    var getNextNodeIsVisible = function (i, nodes)
    {
        for (var j = i + 1; j < nodes.length; j++)
        {
            if (nodes[j]["isvisible"] === "Y")
            {
                return j;
            }
        }
        return i + 1;
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
                    + '<span>' + flnames[nodes[i]["flowoption"]][0] + '</span></td>';

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

                                        // 此处仍然保留原有做法，通过刷新页面来刷新流程图
                                        //flow["nodes"].splice(x, 0, node);
                                        //loadFlowChart();

                                        var insertInfo = "";
                                        for (var i = 0; i < node["checker"].length; i++)
                                        {
                                            insertInfo += "," + node["checker"][i]["person"][0]["stationid"];
                                        }
                                        insertInfo += "#" + (node["passtype"] === "1" ? "All" : "One");
                                        insertInfo += "&" + flnames[node["flowoption"]][1];
                                        insertInfo += "&" + node["allowjump"];
                                        insertInfo += "&" + node["gd"];
                                        insertInfo += "&" + node["ad"];
                                        insertInfo += "&" + node["flname"];
                                        insertInfo += "&" + node["allowadd"];
                                        insertInfo += "&"
                                        insertInfo += "&"

                                        $("#hidInsertIndex").val(x - 1);
                                        $("#hidInsertStationID").val(insertInfo.substr(1));
                                        $("#" + insertBtnId).click();
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
                    id = "div1_" + $(this).attr("nodeidx") + "_" + ($(this).closest("td").index() / 2);
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

    // 绑定信息提示框更多和关闭事件
    var bindTipCommonEvent = function (divTip)
    {
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

            showTipInfo(divTip.attr("id") + "_" + tipname_more, getAbsAxisX(this) + this.offsetWidth, getAbsAxisY(this), 300, 160, tipname_more);
        }).bind("mouseout", function ()
        {
            var img = $(this).find("img");
            img.attr("src", img.attr("src").replace("moreon", "more"));
            $(this).removeClass("td_popform_on");
        });

        // 删除事件（管理-环节调整）
        if (hidFlow_Mode.value === "Edit")
        {
            $("tr:eq(0) a[type]", divTip).bind("click", function ()
            {
                hideAllTip();

                var opt = $(this).attr("type");
                var infos = divTip.attr("id").split("_");
                var x = parseInt(infos[1]);
                var y = parseInt(infos[2]);
                var nodes = flow["nodes"];
                var node = nodes[x];
                var flowoption = node["flowoption"];
                var checkers = node["checker"];
                var checkerCnt = node["cnt"];

                $("#hidInsertIndex").val(x);
                switch (opt)
                {
                    case "DeleteNode":
                        $("#btnDeleteTach").click();
                        break;
                    case "MovePrev":
                        $("#btnMovePrevious").click();
                        break;
                    case "MoveNext":
                        $("#btnMoveNext").click();
                        break;
                    case "AddChecker":
                        var id = "dlgSIF";
                        var ifrname = "IFData";

                        window["tachinfo"]["flowoption"] = node["flowoption"];
                        window["tachinfo"]["waitselectchecker"] = checkers[0];

                        showDialog(
                            {
                                "title": "选择岗位",
                                "html": stringFormat($("#scInsertStation").html(), ifrname),
                                "width": 600,
                                "height": 480,
                                "id": id
                            }, function ()
                            {
                                var ifr = $("#" + id + " iframe");
                                if (ifr.attr("src") !== insertCheckerPageDir)
                                {
                                    ifr.attr("src", insertCheckerPageDir);
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
                                                var sid = "";
                                                for (var i = 0; i < selectedCheckers.length; i++, y++)
                                                {
                                                    sid += "," + selectedCheckers[i]["person"][0]["stationid"];
                                                }
                                                $("#hidInsertStationID").val(sid.substr(1));
                                                $("#btnAddChecker").click();
                                            }
                                        });
                                        frames(ifrname).initPage();
                                    }
                                })();
                            });
                        break;
                    case "DeleteChecker":
                        $("#hidCheckerIndex").val(y);
                        $("#btnDeleteChecker").click();
                        break;
                }
            });
        }
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

    // 绑定信息框编辑事件
    var bindTipAddAndEditEvent = function (divTip, cps, clsid)
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
                            saveInsertedCheckPoint(cps, clsid);
                        });

                    });
            }
            else
            {
                cps.splice($(this).closest("tr").index(), 1);
                initTipInfoValue(divTip, "PointTip");
                saveInsertedCheckPoint(cps, clsid);
            }
        });

        $("#tbPoint tbody :checkbox", divTip).bind("click", function ()
        {
            var chk = $(this);
            cps[chk.closest("tr").index()]["ismustcheck"] = chk[0].checked ? "Y" : "N";
            saveInsertedCheckPoint(cps, clsid);
        });
    };

    // 实时保存插入的要点
    function saveInsertedCheckPoint(cps, clsid)
    {
        var insertcps = hidFlow_InsertCP.value ? $.stringToJSON(hidFlow_InsertCP.value) : {};
        insertcps[clsid] = cps;
        hidFlow_InsertCP.value = $.jsonToString(insertcps);
    }
    
    // 初始化信息框的值
    var initTipInfoValue = function (divTip, tipname)
    {
        var infos = divTip.attr("id").split("_");
        var x = parseInt(infos[1]);
        var y = parseInt(infos[2]);
        var currentIdx = flow["basicinfo"]["info"]["currentidx"];
        var nodes = flow["nodes"];
        var node = nodes[x];
        var flowoption = node["flowoption"];
        var checkers = node["checker"];
        var nodeCnt = $("#trHead_UF td.td_head").length;
        var checkerCnt = node["cnt"];

        switch (tipname)
        {
            case "TachTip":
                $("#tdFlowOption span", divTip).text(flnames[flowoption][0]);
                $("#divFLName", divTip).text(node["clname"]).attr("title", node["clname"]);
                $("#tdPassType span", divTip).text(passtypes[node["passtype"]]);
                $("#spGD", divTip).text(node["gd"]);
                $("#spAD", divTip).text(node["ad"]);
                $("#tdAllowJump span", divTip).text(allows[node["allowjump"]]);
                $("#tdAllowAdd span", divTip).text(allows[node["allowadd"]]);
                if (hidFlow_Mode.value === "Edit")
                {
                    $("tr:eq(0) a[type='DeleteNode']", divTip).toggle(x >= currentIdx && y < nodeCnt - 2);
                    $("tr:eq(0) a[type='MovePrev']", divTip).toggle(x > currentIdx)
                    $("tr:eq(0) a[type='MoveNext']", divTip).toggle(x >= currentIdx && y < nodeCnt - 2)
                    $("tr:eq(0) a[type='AddChecker']", divTip).toggle(x >= currentIdx && inValues(flowoption, "0", "3", "4", "5"))
                }
                $("tr:eq(0) .em_summary", divTip).text("环节" + node["outline"]);
                break;
            case "CheckerTip":
                var checker = checkers[y];
                $("#trDelegate", divTip).toggle(!!checker["client"]);
                $("#trCheckPoint", divTip).toggle(checker["isinserted"] === "Y");
                $("#trEmployee .sp_fvalue", divTip).text(checker["employeename"]);
                $("#trStation .sp_fvalue", divTip).text(checker["stationname"]);
                $("#trCorp .sp_fvalue", divTip).text(checker["corpname"]);
                $("#trDept .sp_fvalue", divTip).text(checker["deptname"]);
                $("#trDelegate .sp_fvalue", divTip).text(checker["client"]);
                if (hidFlow_Mode.value === "Edit")
                {
                    $("#trEmployee .sp_fvalue", divTip).html(stringFormat('<a href="javascript:void(0)">{0}</a>', checker["employeename"]));
                    $("#trEmployee .sp_fvalue a", divTip).bind("click", function ()
                    {
                        hideAllTip();
                        openWindow("../../OperAllow/Account/VAccountBrowse.aspx?AccountID=" + checker["accountid"], 650, 600);
                    });
                    $("tr:eq(0) a[type='DeleteChecker']", divTip).toggle(x >= currentIdx && checkerCnt > 1 && checker["checkopt"] === "0");
                }
                $("tr:eq(0) .em_summary", divTip).text("审批人" + checker["outline"]);
                break;
            case "PointTip":
                var checker = checkers[y];
                var cps = checker["point"];
                var readOnly = !$("#btnSaveUpdateTach").length;
                var html = '';

                if (!$.isEmptyObject(cps))
                {
                    for (var i = 0; i < cps.length; i++)
                    {
                        html += stringFormat('<tr><td>{0}</td><td style="text-align:center"><input type="checkbox" class="idbox"{1}{2} />'
                            + '</td><td{3}><img type="1" opt="2" class="img_del" src="../../Image/flow/delete.png" /></td></tr>',
                            cps[i]["checkpointdesc"], cps[i]["ismustcheck"] === "Y" ? ' checked="checked"' : '',
                            readOnly ? 'disabled=" disabled"' : '', readOnly ? ' style="display:none"' : '');
                    }
                }
                else
                {
                    cps = [];
                    checker["point"] = cps;
                }

                $("#tbPoint tbody", divTip).html(html);
                readOnly ? $("#tbPoint thead th:eq(2)", divTip).hide() : bindTipAddAndEditEvent(divTip, cps, checker["clsid"]);
                break;
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

            bindTipCommonEvent(divTip);
        }

        initTipInfoValue(divTip, tipname);

        hideOtherTip(id);

        if (height < divTip[0].offsetHeight)
        {
            height = divTip[0].offsetHeight;
        }
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

            if (inValues(hidFlow_Mode.value, "Check", "Edit"))
            {
                insertIco = null;
                bindInsertTachMouseEvent($("#trFlow_UF .img_am[insertidx]"));
            }

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

    // 加载流程图
    flow = $.stringToJSON(hidFlow_Values.value);
    loadFlowChart();
    bindChartEvent($("#divFlow_UF"));
    window["tachinfo"] = flow["basicinfo"];
    window["tachinfo"]["isneedallot"] = !!flow["basicinfo"]["allotor"];
    window["tachinfo"]["mode"] = hidFlow_Mode.value;
});