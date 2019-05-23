// VFlowDesigner.aspx用到的js

$(function ()
{
    // 流程对象
    var flow = {};

    // 替换分号的正则表达式
    var reg = new RegExp("；", "g");

    // 环节类型名称对象
    var flnames = { "0": "审核", "1": "调整", "2": "拆分", "3": "会签", "4": "处理", "5": "归档", "start": "开始", "end": "结束" };

    // 通过方式
    var passtypes = { "1": "全部通过", "2": "一人通过" };

    // 允许xxx
    var allows = { "Y": "允许", "N": "不允许" };

    // 加载方式
    var loadtypes = { "0": "自动获取", "1": "起草设置" }

    // 流程图中审批人的html
    var nodeHtml = '<table findtype="{0}" flsid="{1}" findid="{2}" class="tb_checker"><tr><td><img src="../../Image/flow/p{0}.png" class="img_checker"/></td><td class="sp_ctype">'
        + '<span>{3}</span><br/><span class="sp_cname">{4}</span></td></tr></table>';

    // 无数据的提示信息html
    var noDataHtml = '<span class="promptmsg{1}">[&nbsp;{0}&nbsp;]</span>';

    // 流程信息悬停提示
    var tip_over = false, arr_display = [], arr_focus = [], zIndex = 2000;

    // 添加开始和结束节点，并设置结构码
    var initNodes = function (nodes)
    {
        if (nodes.length === 0 || nodes[0]["flowoption"] !== "start")
        {
            nodes.unshift({ "flowoption": "start", "checker": [{}] });
        }
        if (nodes[nodes.length - 1]["flowoption"] !== "end")
        {
            nodes.push({ "flowoption": "end", "checker": [{}] });
        }

        for (var i = 0; i < nodes.length; i++)
        {
            var checkers = nodes[i]["checker"];
            var len = checkers.length;
            for (var j = 0; j < checkers.length; j++)
            {
                checkers[j]["outline"] = i + (len > 1 ? "." + (j + 1) : "");
            }
        }
    };

    // 根据flsid获取审批人的结构码
    var getNodeOutline = function (flsid)
    {
        for (var i = 0; i < flow["nodes"].length; i++)
        {
            var checkers = flow["nodes"][i]["checker"];
            for (var j = 0; j < checkers.length; j++)
            {
                var checker = checkers[j];
                if (checkers[j]["flsid"] === flsid)
                {
                    return checker["outline"];
                }
            }
        }
    };

    // 获取包含流程条件或审批要点的主体信息
    var getFFAndCPOwnerInfo = function ()
    {
        var ffinfo = "", cpinfo = "";

        if (hasFlowFilter(flow["flowid"]))
        {
            ffinfo += "；流程";
        }
        for (var i = 1; i < flow["nodes"].length - 1; i++)
        {
            var node = flow["nodes"][i];
            if (hasFlowFilter(node["flid"]))
            {
                ffinfo += "；环节" + i;
            }
            for (var j = 0; j < node["checker"].length; j++)
            {
                var len = node["checker"].length;
                var flsid = node["checker"][j]["flsid"];
                if (hasFlowFilter(flsid))
                {
                    ffinfo += "；审批人" + (i + (len > 1 ? "." + (j + 1) : ""));
                }
                if (hasCheckPoint(flsid))
                {
                    cpinfo += "；审批人" + (i + (len > 1 ? "." + (j + 1) : ""));
                }
            }
        }
        ffinfo = ffinfo ? ffinfo.substr(1) : "无";
        cpinfo = cpinfo ? cpinfo.substr(1) : "无";

        return { "ffinfo": ffinfo, "cpinfo": cpinfo };
    }

    // 获取连接线（箭头）的html
    var getSeparatorHtml = function (preLen, nextLen)
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
            html += '<img src="../../Image/flow/l0.png" class="img_al0" style="top:-' + utop + 'px"/>';
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
            html += '<img src="../../Image/flow/l1.png" class="img_al1" style="top:-' + utop + 'px"/>';
            html += '<img src="../../Image/flow/l2.png" class="img_al1" style="top:' + dtop + 'px"/>';
        }

        if (len1 >= 1)
        {
            vlheight += 53 * (len1 - 1);
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:25px;top:-' + (utop - 15) + 'px"></div>';
            html += '<div class="div_vline" style="height:' + vlheight + 'px;left:25px;top:13px"></div>';
        }

        html += '<img src="../../Image/flow/m' + (preLen === 1 ? '1' : (preLen % 2 === 0 ? '2' : '3')) + (nextLen === 1 ? '1' : (nextLen % 2 === 0 ? '2' : '3'))
            + '.png" class="img_am" style="left:25px;top:-12px"/>';

        if (nextLen % 2 === 1)
        {
            utop = 5;
            dtop = -12;
            vlheight = 28;
            html += '<img src="../../Image/flow/r0.png" class="img_ar0" style="left:56px;top:-' + utop + 'px"/>';
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
            html += '<img src="../../Image/flow/r1.png" class="img_ar1" style="left:53px;top:-' + utop + 'px"/>';
            html += '<img src="../../Image/flow/r2.png" class="img_ar1" style="left:53px;top:' + dtop + 'px"/>';
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
    var getNodeHtml = function (node)
    {
        var html = '';

        var flowOption = node["flowoption"];
        var checkers = node["checker"];

        html += '<td class="td_tach" flowoption="' + flowOption + '">';
        if (flowOption === "start")
        {
            html += '<img src="../../Image/flow/begin.png" class="img_swtich" title="开始"/>';
        }
        else if (flowOption === "end")
        {
            html += '<img src="../../Image/flow/end.png" class="img_swtich" title="结束"/>';
        }
        else
        {
            for (var i = 0; i < checkers.length; i++)
            {
                var checker = checkers[i];
                var flsid = checker["flsid"];
                var findid = checker["findid"];
                var findtype = checker["findtype"].toLowerCase();
                var findname = checker["findname"];
                var employeename = checker["employeename"];
                switch (findtype)
                {
                    case "0":
                        findname = flnames[flowOption] + "人";
                        if (flowOption !== "2")
                        {
                            employeename = '<span style="color:red">待指定</span>';
                        }
                        break;
                    case "b":
                        employeename = findid ? "审批人" + getNodeOutline(findid) : "起草人";
                        break;
                }

                html += stringFormat(nodeHtml, findtype, flsid, findid, findname, employeename);
            }
        }

        html += '</td>';

        return html;
    };

    // 获取流程图的html
    var getChartHtml = function (nodes)
    {
        var html = "";

        for (var i = 0; i < nodes.length; i++)
        {
            html += getNodeHtml(nodes[i]);
            if (i < nodes.length - 1)
            {
                html += getSeparatorHtml(nodes[i]["checker"].length, nodes[i + 1]["checker"].length);
            }
        }

        return html;
    };

    // 获取流程图头的html
    var getChartHeadHtml = function (nodes)
    {
        var html = '';
        for (var i = 0; i < nodes.length; i++)
        {
            html += '<td class="td_head">' + ((i > 0 && i < nodes.length - 1) ? '<em class="em_tachno">' + i + '</em>' : '')
                + '<span>' + flnames[flow["nodes"][i]["flowoption"]] + '</span></td>';

            if (i < nodes.length - 1)
            {
                html += '<td class="td_sep"></td>';
            }
        }

        return html;
    };

    // 流程、环节、审批人是否包含流程条件
    var hasFlowFilter = function (ownerid)
    {
        var filters = flow["filter"];
        if (!$.isEmptyObject(filters[ownerid]))
        {
            return true;
        }
        for (var i = 0; i < flow["form"].length; i++)
        {
            if (!$.isEmptyObject(filters[ownerid + flow["form"][i]["formid"]]))
            {
                return true;
            }
        }
        return false;
    }

    // 审批人是否包含审批要点
    var hasCheckPoint = function (flsid)
    {
        return !$.isEmptyObject(flow["point"][flsid]);
    }

    // 绑定拖动和resize事件
    var bindChartEvent = function (obj)
    {
        obj.on("mousedown", function ()
        {
            if (event.clientY > getAbsAxisY(divFlow) + 20 && event.clientY < getAbsAxisY(divFlow) + divFlow.offsetHeight - 20
                    && event.clientX < getAbsAxisX(divFlow) + divFlow.offsetWidth - 20 && beDragBackground())
            {
                mDown(this);
            }
        }).on("mousemove", function ()
        {
            mMove(this);
        }).on("mouseup", function ()
        {
            mUp(this);
        });

        var ww = obj.width(), hh = obj.height();
        obj.on("resize", function ()
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

        obj.on("mouseover", function ()
        {
            var id, left, top, width, height, tipname;
            switch (this.className)
            {
                // 流程（启动）
                case "img_swtich":
                    id = "div_0_0_0";
                    left = getAbsAxisX(this) + 38;
                    top = getAbsAxisY(this) + 43;
                    width = 180;
                    height = 10;
                    tipname = "FlowTip";
                    break;
                    // 环节（表头环节号）
                case "td_head":
                    id = "div_1_" + ($(this).closest("td").index() / 2) + "_0";
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
                    var checker = $(this).closest("table");
                    id = "div_2_" + (checker.parent().index() / 2) + "_" + checker.index();
                    left = getAbsAxisX(this) + 23;
                    top = getAbsAxisY(this) + 34;
                    width = 200;
                    height = 10;
                    tipname = "CheckerTip";
                    break;
                case "img_info":
                    id = "div_3_0_0";
                    left = getAbsAxisX(this) - 238;
                    top = getAbsAxisY(this) - 205;
                    width = 260;
                    height = 200;
                    tipname = "FlowInfoTip";
                    break;
            }

            showTipInfo(id, left, top, width, height, tipname);
        });
    };

    // 绑定信息提示框更多和关闭事件
    var bindTipCommonEvent = function (divTip)
    {
        // 关闭图标效果
        $(".img_close", divTip).on("mouseover", function ()
        {
            $(this).attr("src", $(this).attr("src").replace("close", "closeon"));
        }).on("mouseout", function ()
        {
            $(this).attr("src", $(this).attr("src").replace("closeon", "close"));
        }).on("click", function ()
        {
            hideAllTip();
        });

        // 悬停普通行隐藏更多信息
        $(".td_popform", divTip).on("mouseover", function ()
        {
            hideOtherTip(divTip.attr("id"));
        });

        // 更多信息（条件和要点）效果
        $(".img_more", divTip).closest("td").on("mouseover", function ()
        {
            var td = $(this);
            var img = td.find("img");
            var tipname = td.attr("tipname");
            var type = td.attr("type");

            var left = getAbsAxisX(this) + this.offsetWidth;
            var top = getAbsAxisY(this);
            var width = (tipname === "FilterTip" ? 360 : 300);
            var height = (tipname === "FilterTip" ? 250 : 200);

            img.attr("src", img.attr("src").replace("more", "moreon"));
            td.addClass("td_popform_on");

            showTipInfo(divTip.attr("id") + "_" + tipname, left, top, width, height, tipname);

        }).on("mouseout", function ()
        {
            var img = $(this).find("img");
            img.attr("src", img.attr("src").replace("moreon", "more"));
            $(this).removeClass("td_popform_on");
        });
    };
    
    // 初始化信息框的值
    var initTipInfoValue = function (divTip, tipname)
    {
        var infos = divTip.attr("id").split("_");
        var infoType = infos[1];
        var x = parseInt(infos[2]);
        var y = parseInt(infos[3]);
        var nodes = flow["nodes"];
        var node = nodes[x];
        var flowoption = node["flowoption"];
        var checkers = node["checker"];

        switch (tipname)
        {
            case "FlowInfoTip":
                var flowinfo = getFFAndCPOwnerInfo();
                $("#divFLName", divTip).text(flow["flowname"]).attr("title", flow["flowname"]);
                $("#divFLNo", divTip).text(flow["flowno"]).attr("title", flow["flowno"]);
                $("#divFLTName", divTip).text(flow["flowtypename"]).attr("title", flow["flowtypename"]);
                $("#divModName", divTip).text(flow["modname"]).attr("title", flow["modname"]);
                $("#divHasFF", divTip).text(flowinfo["ffinfo"]).attr("title", flowinfo["ffinfo"].replace(reg, "\n"));
                $("#divHasCP", divTip).text(flowinfo["cpinfo"]).attr("title", flowinfo["cpinfo"].replace(reg, "\n"));
                break;
            case "TachTip":
                $("#tdFlowOption span", divTip).text(flnames[flowoption]);
                $("#divFLName", divTip).text(node["flname"]).attr("title", node["flname"]);
                $("#tdPassType span", divTip).text(passtypes[node["passtype"]]);
                $("#spGD", divTip).text(node["gd"]);
                $("#spAD", divTip).text(node["ad"]);
                $("#tdAllowJump span", divTip).text(allows[node["allowjump"]]);
                $("#tdAllowAdd span", divTip).text(allows[node["allowadd"]]);
                $("tr:eq(0) .em_summary", divTip).text("环节" + x);
                break;
            case "CheckerTip":
                var checker = checkers[y];
                $("#trLoadType", divTip).toggle(inValues(checker["findtype"], "P", "D", "E"));
                $("#tdLoadType span", divTip).text(loadtypes[checker["loadtype"]]);
                $("#trCheckerFilter", divTip).toggle(inValues(flowoption, "0", "3", "4"));
                $("tr:eq(0) .em_summary", divTip).text("审批人" + getNodeOutline(checker["flsid"]));
                break;
            case "FilterTip":
                var ownerid = infoType === "0" ? flow["flowid"] : (infoType === "1" ? node["flid"] : checkers[y]["flsid"]);
                var forms = [{ "formid": "", "formtitle": "基本条件" }].concat(flow["form"]);
                var html = '';

                for (var i = 0; i < forms.length; i++)
                {
                    var fgs = flow["filter"][ownerid + forms[i]["formid"]];
                    var fgcnt = 0;

                    html += stringFormat('<tr ownerid="{0}" formid="{1}"><td><img src="../../Image/flow/expand.gif" class="img_exp" />'
                        + '<span class="sp_fgname">{2}</span></td></tr><tr><td class="padleft20">',
                        ownerid, forms[i]["formid"], forms[i]["formtitle"]);

                    if (!$.isEmptyObject(fgs))
                    {
                        for (var fgid in fgs)
                        {
                            var ffs = fgs[fgid]["filter"];

                            if (ffs && ffs.length)
                            {
                                fgcnt++;

                                html += stringFormat('<div fgid="{0}" style="padding:4px 0;"><span class="sp_fgname">{1}</span>'
                                    + '</div><table class="table" border="0" cellspacing="0">', fgid, fgs[fgid]["fgname"]);

                                for (var j = 0; j < ffs.length; j++)
                                {
                                    var ff = ffs[j];

                                    html += stringFormat('<tr><td style="width:20%">{0}</td><td style="width:14%">{1}</td><td style="width:64%">{2}</td></tr>',
                                        ff["coltitle"], ff["oname"], ff["filtertext"]);
                                }

                                html += '</table>';
                            }
                        }
                    }
                    if (!fgcnt)
                    {
                        html += stringFormat(noDataHtml, "无");
                    }

                    html += '</td></tr>';
                }
                $("#tbFilter", divTip).html(html);
                $(".img_exp", divTip).on("click", function ()
                {
                    var img = $(this);
                    var tr = img.closest("tr").next();
                    var isDisp = tr.css("display") !== "none";
                    tr.toggle();
                    img.attr("src", img.attr("src").replace(isDisp ? "expand" : "collapse", isDisp ? "collapse" : "expand"));
                });
                $(".sp_fgname", divTip).attr("title", function () { return $(this).text(); });
                break;
            case "PointTip":
                var flsid = checkers[y]["flsid"];
                var cps = flow["point"][flsid];
                var html = '';
                
                if (!$.isEmptyObject(cps))
                {
                    for (var cpid in cps)
                    {
                        html += stringFormat('<tr cpid="{0}"><td>{1}</td><td style="text-align:center">{2}</td></tr>',
                            cpid, cps[cpid]["checkpointdesc"], cps[cpid]["ismustcheck"] === "Y" ? '<span class="fontst">√</span>' : '&nbsp;');
                    }
                }
                else
                {
                    html += '<tr><td colspan="2" class="padleft20">';
                    html += stringFormat(noDataHtml, "不存在任何审批要点");
                    html += '</td></tr>';
                }
                $("#tbPoint", divTip).attr("flsid", flsid);
                $("#tbPoint tbody", divTip).html(html);
                break;
        }
    };

    // 显示流程信息提示框
    var showTipInfo = function (id, left, top, width, height, tipname)
    {
        var beFilter = inValues(tipname, "FlowTip", "TachTip", "CheckerTip");
        var divTip = $("#" + id);

        if (!divTip.length)
        {
            divTip = $('<div id="' + id + '" class="div_hoverinfotip"></div>');

            if (!beFilter)
            {
                divTip.css("overflow-y", "auto");
            }

            divTip.on("mouseover", function ()
            {
                tip_over = true;

                if (arr_display[id])
                {
                    arr_focus[id] = 1;
                    divTip.focus();
                }
            }).on("mouseout", function ()
            {
                tip_over = false;
            }).on("blur", function ()
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

            divTip.html($("#sc" + tipname).html());

            divTip.appendTo(document.body);

            switch (tipname)
            {
                case "FlowInfoTip":
                case "FlowTip":
                case "TachTip":
                case "CheckerTip":
                    bindTipCommonEvent(divTip);
                    break;
            }
        }

        initTipInfoValue(divTip, tipname);

        hideOtherTip(id);

        if (left + width > document.body.offsetWidth)
        {
            left = beFilter ? (document.body.offsetWidth - width) : (left - width - $("#" + id.replace("_" + tipname, "")).width());
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

        return (etag === "div" || etag === "td" && etr.id === "trFlow");
    }
    
    // 加载流程图
    var loadFlowChart = function ()
    {
        initNodes(flow["nodes"]);

        var divFlow = getObj("divFlow");
        var sl = divFlow.scrollLeft;
        var st = divFlow.scrollTop;

        var tbFlow = getObj("tbFlow");
        //redrawHandle(tbFlow, function ()
        //{
        $("#trFlow", tbFlow).html(getChartHtml(flow["nodes"]));
        $("#trHead", tbFlow).html(getChartHeadHtml(flow["nodes"]));
        //});

        bindNodeMouseOverEvent($("#trHead td.td_head:not(:first):not(:last),#trFlow .img_checker,#trFlow .img_swtich[src$='begin.png'],.img_info"));

        divFlow.scrollLeft = sl;
        divFlow.scrollTop = st;
    };

    // 拖动流程图背景效果
    var ox, oy, movable = 0;    // 鼠标与拖动对象左上角的X、Y坐标差、允许拖动（1/0）、当前操作类型
    var mDown = function (obj)
    {
        hideAllTip();
        $(obj).attr("moving", "1");

        var divFlow = getObj("divFlow");
        ox = event.clientX + divFlow.scrollLeft;
        oy = event.clientY + divFlow.scrollTop;

        movable = 1;
        obj.setCapture();
    };
    var mMove = function (obj)
    {
        if (movable)
        {
            var divFlow = getObj("divFlow");
            divFlow.scrollLeft = ox - event.clientX;
            divFlow.scrollTop = oy - event.clientY;
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
    setAjaxContainer($("#tdFlow")[0]);
    ajax("VFlowDesigner.aspx", { "Action": "GetFlowInfo", "FlowID": getParamValue("FlowID") }, "json", function (data)
    {
        switch (data.Success)
        {
            case "Y":
                flow = $.stringToJSON(data.Data);
                if (flow["isneedallot"] === "Y")
                {
                    $("#imgAllot,#spAllot").show();
                }
                loadFlowChart();
                bindChartEvent($("#divFlow"));
                break;
            default:
                alert(data.Data);
                break;
        }
    });
});