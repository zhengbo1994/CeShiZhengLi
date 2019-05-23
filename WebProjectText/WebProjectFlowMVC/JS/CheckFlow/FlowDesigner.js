// VFlowDesigner.aspx用到的js

$(function ()
{
    // 流程对象
    var flow = {};

    // 鼠标悬停点的坐标尺寸的集合
    var monitoredAreas = [];

    // 替换括号的正则表达式
    //var regbracket = new RegExp("[（）]", "g"), regsemicolon = new RegExp("；", "g");
    var regbracket = new RegExp("[()]", "g"), regsemicolon = new RegExp("；", "g");  //替换成英文括号，处理岗位中带有中文括号时拖动岗位到审批环节，岗位名称与账号名称显示错误问题  20180105

    // 环节类型名称对象
    var flnames = { "0": "审核", "1": "调整", "2": "拆分", "3": "会签", "4": "处理", "5": "归档", "start": "开始", "end": "结束" };

    // 流程图中审批人的html
    var nodeHtml = '<table findtype="{0}" flsid="{1}" findid="{2}" loadtype="{3}" class="tb_checker"><tr><td><img src="../../Image/flow/p{0}.png" class="img_checker"/></td><td class="sp_ctype">'
        + '<span>{4}</span><br/><span class="sp_cname">{5}</span></td></tr></table>';

    // 右边栏中待选审批人的html
    var miniNodeHtml = '<span class="sp_checker_mi" findtype="{0}" findid="{2}"><img src="../../Image/flow/p{0}.png" class="img_checker_mi"/>\n<span class="font valign">{1}</span></span><br/>';

    // 无数据的提示信息html
    var noDataHtml = '<span class="promptmsg{1}">[&nbsp;{0}&nbsp;]</span>';

    // 鼠标拖动审批人到待指定审批人上是的悬停效果html
    var hoverImg = '<img src="../../Image/flow/p{0}.png" class="img_checker"/>';

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

        var flowoption = node["flowoption"];
        var checkers = node["checker"];

        html += '<td class="td_tach" flowoption="' + flowoption + '">';
        if (flowoption === "start")
        {
            html += '<img src="../../Image/flow/begin.png" class="img_swtich" title="开始"/>';
        }
        else if (flowoption === "end")
        {
            html += '<img src="../../Image/flow/end.png" class="img_swtich" title="结束"/>';
        }
        else
        {
            for (var i = 0; i < checkers.length; i++)
            {
                var checker = checkers[i];
                var findtype = checker["findtype"].toLowerCase();
                var flsid = checker["flsid"];
                var findid = checker["findid"];
                var loadtype = checker["loadtype"]
                var findname = checker["findname"];
                var employeename = checker["employeename"];
                switch (findtype)
                {
                    case "0":
                        findname = flnames[flowoption] + "人";
                        if (flowoption !== "2")
                        {
                            employeename = '<span style="color:red">待指定</span>';
                        }
                        break;
                    case "b":
                        employeename = findid ? "审批人" + getNodeOutline(findid) : "起草人";
                        break;
                }

                html += stringFormat(nodeHtml, findtype, flsid, findid, loadtype, findname, employeename);
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

    // 获取待选区分管领导html
    var getChargeLeaderHtml = function (nodes)
    {
        var html = stringFormat(miniNodeHtml, "b", '<span class="sp_cname">起草人</span>');

        for (var i = 1; i < nodes.length - 1; i++)
        {
            var checkers = nodes[i]["checker"];

            for (var j = 0; j < checkers.length; j++)
            {
                var checker = checkers[j];

                if (inValues(checker["findtype"], "S", "P", "A", "C", "D", "E"))
                {
                    html += stringFormat(miniNodeHtml, "b", '<span class="sp_cname">审批人' + getNodeOutline(checker["flsid"]) + '</span>\n' + checker["findname"], checker["flsid"]);
                }
            }
        }

        return html;
    };
    
    // 获取锚点dom
    var getAnchor = function (obj, opt)
    {
        anchor = anchor || document.createElement('div');
        if (opt === 3)
        {
            anchor.innerHTML = $(obj).closest("td").next().html();
        }
        else
        {
            var checker = getNode(obj, opt)["checker"][0];
            anchor.innerHTML = stringFormat(nodeHtml, checker["findtype"], checker["flsid"], checker["findid"], checker["loadtype"], checker["findname"], checker["employeename"]);
        }
        anchor.className = "div_anchor";

        return anchor;
    };

    // 获取插入点悬停效果dom
    var getHoverTip = function ()
    {
        tip = tip || document.createElement('div');
        tip.className = "div_dragtip";

        return tip;
    };

    // 拖动审批人时获取审批人对象
    var getNode = function (obj, opt)
    {
        var node, flsid, findtype, findid, loadtype, findname, employeename;

        switch (opt)
        {
            case 0:
                flsid = getNewID();
                findtype = obj.findtype;
                findid = obj.findid;
                findname = obj.innerText;
                employeename = "";
                switch (findtype)
                {
                    case "s":
                        var findnames = findname.split(regbracket);
                        findname = findnames[0];
                        employeename = findnames[1];
                        break;
                    case "f":
                        loadtype = "1";
                        break;
                    case "b":
                        findname = $(obj).closest("tr").prev().text();
                        employeename = $(".sp_cname", obj).text();
                        break;
                    case "d":
                    case "e":
                        loadtype = "1";
                        findname = findname.split(regbracket)[0];
                        break;
                }
                break;
            case 1:
                flsid = getNewID();
                findtype = obj.flowoption === "2" ? "h" : "0";
                findid = "";
                findname = flnames[obj.flowoption] + "人";
                employeename = "";
                break;
            case 2:
                var $obj = $(obj);
                if (!$obj.siblings().length) // 拖动串环中唯一审批人
                {
                    var o_x = $obj.parent().index() / 2;
                    node = flow["nodes"][o_x];
                }
                else // 拖动并环中一个审批人
                {
                    flsid = obj.flsid;
                    findtype = obj.findtype;
                    findid = obj.findid;
                    loadtype = obj.loadtype;
                    findname = $(".sp_ctype>span:eq(0)", obj).text();
                    employeename = $(".sp_cname", obj).text();
                }
                break;
            case 3:
                var o_x = ($(obj).closest("td").index() + 1) / 2;
                node = flow["nodes"][o_x];
                break;
        }

        node = node ||
            {
                "flid": getNewID(),
                "flowoption": obj.flowoption,
                "passtype": "1",
                "gd": "1",
                "ad": "1",
                "allowjump": "N",
                "allowadd": "Y",
                "checker": [{ "flsid": flsid, "findtype": findtype.toUpperCase(), "findid": findid, "loadtype": loadtype || "0", "findname": findname, "employeename": employeename }]
            };

        return node;
    };

    // 是否可插入
    var canBeInserted = function (x, y, obj, opt, rp)
    {
        switch (opt)
        {
            case 0:
                if (y === -1)
                {
                    obj.flowoption = hasPreviousSaveTach(x) ? "3" : "0";
                    return true;
                }
                return !hasSameChecker(x, obj.findtype, obj.findid) && (obj.findtype.toLowerCase() !== "b" || flow["nodes"][x]["flowoption"] !== "5");
            case 1:
                if (y === -1)
                {
                    if (obj.flowoption === "5" && hasNextCheckTach(x) || inValues(obj.flowoption, "0", "1") && hasPreviousSaveTach(x))
                    {
                        return false;
                    }
                    return true;
                }
                return false;
            case 2:
                var $obj, flowoption, o_x, o_y;
                if (y === -1)
                {
                    $obj = $(obj);
                    flowoption = $obj.closest("td").attr("flowoption");
                    if (!$obj.siblings().length) //来自串环
                    {
                        o_x = $obj.parent().index() / 2;
                        if (x === o_x || x === o_x + 1 || flowoption === "5" && hasNextCheckTach(x) || inValues(flowoption, "0", "1") && hasPreviousSaveTach(x))
                        {
                            return false;
                        }
                        obj.flowoption = flowoption;
                    }
                    else// 来自并环
                    {
                        obj.flowoption = (hasPreviousSaveTach(x) && flowoption === "0") ? "3" : flowoption;
                    }
                    return true;
                }
                else
                {
                    flowoption = flow["nodes"][x]["flowoption"];
                    var findtype = obj.findtype.toLowerCase();

                    if (rp && (flowoption === "1" && !inValues(findtype, "0", "h") || flowoption === "5" && !inValues(findtype, "0", "b", "g", "h")))
                    {
                        return true;
                    }

                    if (inValues(flowoption, "0", "3", "4") && !inValues(findtype, "g", "h"))
                    {
                        $obj = $(obj);
                        o_x = $obj.parent().index() / 2;
                        if (x === o_x)
                        {
                            o_y = $obj.index();
                            return y < o_y || y > o_y + 1 || y === o_y + 1 && rp;
                        }
                        else
                        {
                            return !hasSameChecker(x, obj.findtype, obj.findid);
                        }
                    }
                }
                return false;
            case 3:
                if (y === -1)
                {
                    var $obj, flowoption, o_x;
                    $obj = $(obj);
                    flowoption = $obj.closest("td").next().attr("flowoption");
                    o_x = ($obj.closest("td").index() + 1) / 2;
                    if (x === o_x || x === o_x + 1 || flowoption === "5" && hasNextCheckTach(x) || inValues(flowoption, "0", "1") && hasPreviousSaveTach(x))
                    {
                        return false;
                    }
                    obj.flowoption = flowoption;
                    return true;
                }
                return false;
        }
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

    // x环之中是否有相同审批人
    var hasSameChecker = function (x, findtype, findid)
    {
        var checkers = flow["nodes"][x]["checker"];
        var len = checkers.length;
        for (var i = 0; i < len; i++)
        {
            var checker = checkers[i];
            if (checker["findtype"] === findtype.toUpperCase() && checker["findid"] === findid)
            {
                return true;
            }
        }

        return false;
    };

    // x环之中是否有分管领导
    var hasChargeLeader = function (x)
    {
        var checkers = flow["nodes"][x]["checker"];
        var len = checkers.length;
        for (var i = 0; i < len; i++)
        {
            if (checkers[i]["findtype"] === "B")
            {
                return true;
            }
        }

        return false;
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

    // 是否为分管领导的依据人
    var beBasedByChargeLeader = function (x, y)
    {
        var cks = flow["nodes"][x]["checker"];
        if (arguments.length > 1)
        {
            cks = [cks[y]];
        }

        for (var i = 0; i < cks.length; i++)
        {
            var nodes = flow["nodes"];
            for (var j = 1; j < nodes.length - 1; j++)
            {
                var checkers = nodes[j]["checker"];
                for (var k = 0; k < checkers.length; k++)
                {
                    var checker = checkers[k];
                    if (checker["findtype"].toLowerCase() === "b" && checker["findid"] && checker["findid"] === cks[i]["flsid"])
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // 锚点弹回
    var reboundAnchor = function (anchor, obj, opt, cnt)
    {
        var diffX = anchor.offsetLeft - getAbsAxisX(obj) + (opt === 0 ? 11 : (opt === 1 ? -21 : (opt === 3 ? 0 : 0)));
        var diffY = anchor.offsetTop - getAbsAxisY(obj) + (opt === 0 ? 15 : (opt === 1 ? 3 : (opt === 3 ? (anchor.offsetHeight / 2 - 13) : 0)));
        if (cnt > 0 && Math.abs(diffX) > diffX / cnt)
        {
            anchor.style.left = anchor.offsetLeft - diffX / cnt;
            anchor.style.top = anchor.offsetTop - diffY / cnt;
            setTimeout(function () { reboundAnchor(anchor, obj, opt, --cnt); }, 10);
        }
        else
        {
            if (document.body.contains(anchor))
            {
                document.body.removeChild(anchor);
            }
            anchor = null;
        }
    };

    // 绑定拖动事件
    var bindNodeDragEvent = function (obj, opt)
    {
        obj.on("mousedown", function ()
        {
            if (opt !== 4 || event.clientY > getAbsAxisY(divFlow) + 20 && event.clientY < getAbsAxisY(divFlow) + divFlow.offsetHeight - 20
                    && event.clientX < getAbsAxisX(divFlow) + divFlow.offsetWidth - 20 && beDragBackground())
            {
                mDown(this, opt);
            }
        }).on("mousemove", function ()
        {
            if (moveopt === opt)
            {
                mMove(this, opt);
            }
        }).on("mouseup", function ()
        {
            if (moveopt === opt)
            {
                mUp(this, opt);
            }
        });

        if (opt !== 4)
        {
            obj.css("cursor", "pointer");
        }
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

        // 删除事件
        $("tr:eq(0) a[type]", divTip).on("click", function ()
        {
            var opt = $(this).attr("type");
            var infos = divTip.attr("id").split("_");
            var infoType = infos[1];
            var x = parseInt(infos[2]);
            var y = parseInt(infos[3]);
            var nodes = flow["nodes"];
            var node = nodes[x];
            var flowoption = x === 0 ? "0" : node["flowoption"];
            var checkers = node["checker"];
            var nodeCnt = nodes.length - 2;
            var checkerCnt = checkers.length;

            switch (opt)
            {
                case "ClearFlow":
                    deleteFilterAndPoint(opt);
                    nodes.splice(1, nodeCnt);
                    break;
                case "DeleteNode":
                    if (beBasedByChargeLeader(x))
                    {
                        hideAllTip();
                        return alertMsg("该环节中存在是其他审批人（分管领导）的依据人的审批人，不能被删除。");
                    }
                    deleteFilterAndPoint(opt, x);
                    nodes.splice(x, 1);
                    break;
                case "ClearNode":
                    if (beBasedByChargeLeader(x))
                    {
                        hideAllTip();
                        return alertMsg("该环节中存在是其他审批人（分管领导）的依据人的审批人，不能被清空。");
                    }
                    deleteFilterAndPoint(opt, x);
                    var emptyChecker = getNode($(".div_tach[flowoption='" + flowoption + "']")[0], 1)["checker"][0];
                    checkers.splice(0, checkerCnt, emptyChecker);
                    break;
                case "DeleteChecker":
                    if (beBasedByChargeLeader(x, y))
                    {
                        hideAllTip();
                        return alertMsg("该审批人是其他审批人（分管领导）的依据人，不能被删除。");
                    }
                    deleteFilterAndPoint(opt, x, y);
                    checkers.splice(y, 1);
                    if (checkerCnt === 1)
                    {
                        nodes.splice(x, 1);
                    }
                    break;
                case "ClearChecker":
                    if (beBasedByChargeLeader(x, y))
                    {
                        hideAllTip();
                        return alertMsg("该审批人是其他审批人（分管领导）的依据人，不能被清空。");
                    }
                    var emptyChecker = getNode($(".div_tach[flowoption='" + flowoption + "']")[0], 1)["checker"][0];
                    emptyChecker["flsid"] = checkers[y]["flsid"];
                    checkers.splice(y, 1, emptyChecker);
                    break;
            }

            hideAllTip();
            loadFlowChart();
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

    // 绑定环节和审批人信息提示框单选事件
    var bindTipSelectEvent = function (divTip)
    {
        // 单选事件
        $("#tdFlowOption,#tdPassType,#tdAllowJump,#tdAllowAdd,#tdLoadType", divTip).find(".normalNode").each(function ()
        {
            var sp = $(this);
            var cid = sp.closest("td").attr("id").substr(2).toLowerCase();
            var pid = divTip.attr("id") + "_" + cid;
            sp.attr("id", pid + "_sp" + sp.index());
            sp.on("click", function ()
            {
                clickTreeNode(sp[0], pid);

                var infos = divTip.attr("id").split("_");
                var infoType = infos[1];
                var x = parseInt(infos[2]);
                var node = flow["nodes"][x];

                if (cid === "loadtype")
                {
                    var y = parseInt(infos[3]);
                    var checker = node["checker"][y];
                    checker[cid] = sp.val();
                }
                else
                {
                    node[cid] = sp.val();
                }

                if (cid === "flowoption")
                {
                    loadFlowChart();
                }
            });
        });

        $("#lblCreatorAdjust :checkbox", divTip).on("click", function ()
        {
            var infos = divTip.attr("id").split("_");
            var x = parseInt(infos[2]);
            var y = parseInt(infos[3]);
            var checker = flow["nodes"][x]["checker"][y];
            checker["findtype"] = "G";
            checker["findname"] = "起草人";
            loadFlowChart();
            hideAllTip();
        });
    };

    // 绑定环节信息提示框文本框效果事件
    var bindTipTextEvent = function (divTip)
    {
        // 天数焦点事件
        $("#txtFLName,#txtGD,#txtAD,#txtFixRemark", divTip).on("focus", function ()
        {
            setIDText(this, 0);
        }).on("blur", function ()
        {
            setIDText(this, 1);

            var infos = divTip.attr("id").split("_");
            var x = parseInt(infos[2]);
            var node = flow["nodes"][x];

            switch (this.id)
            {
                case "txtFLName":
                    node["flname"] = this.value;
                    break;
                case "txtGD":
                    setRound(0, 1, 99);
                    node["gd"] = this.value;
                    break;
                case "txtAD":
                    setRound(0, 1, 99);
                    node["ad"] = this.value;
                    break;
                case "txtFixRemark":
                    var y = parseInt(infos[3]);
                    var checker = node["checker"][y];
                    checker["employeename"] = this.value;
                    checker["findid"] = this.value;
                    $("#trFlow td.td_tach:eq(" + x + ") table:eq(" + y + ") span.sp_cname").text(this.value);
                    break;
            }
        });

        // 天数加减事件
        $(".img_plus_minus", divTip).on("click", function (event)
        {
            var img = $(this);
            var isAdd = img.attr("type") === "1";
            var txt = isAdd ? img.closest("td").prev().find(":text") : img.closest("td").next().find(":text");
            txt.val(getRound(getRound(txt.val(), 0) + (isAdd ? 1 : -1), 0, 1, 99));

            var infos = divTip.attr("id").split("_");
            var x = parseInt(infos[2]);
            var node = flow["nodes"][x];

            node[txt.attr("id").substr(3).toLowerCase()] = txt.val();
        });
    };

    // 绑定流程条件信息框事件
    var bindTipFilterEvent = function (divTip)
    {
        $(".img_exp", divTip).on("click", function ()
        {
            var img = $(this);
            var tr = img.closest("tr").next();
            var isDisp = tr.css("display") !== "none";
            tr.toggle();
            img.attr("src", img.attr("src").replace(isDisp ? "expand" : "collapse", isDisp ? "collapse" : "expand"));
        });
        $(".sp_fgname", divTip).attr("title", function () { return $(this).text(); });
    };

    // 绑定信息框编辑事件
    var bindTipAddAndEditEvent = function (divTip)
    {
        $(".img_add[type='0'],.img_edit[type='0'],.img_del[type='0']", divTip).attr("title", function ()
        {
            switch ($(this).attr("opt"))
            {
                case "0":
                    return "新增条件组";
                case "1":
                    return "修改条件组";
                case "2":
                    return "删除条件组";
            }
        }).off("click").on("click", function ()
        {
            var img = $(this);
            var opt = img.attr("opt");
            var filtertype = divTip.attr("id").split("_")[1];
            var tr = opt === "0" ? img.closest("tr") : img.closest("tr").prev();
            var ownerid = tr.attr("ownerid");
            var formid = tr.attr("formid");
            var keyid = ownerid + formid;
            var fgs = flow["filter"][keyid];
            var fgid = opt === "0" ? getNewID() : img.closest("div").attr("fgid");
            if (opt === "0")
            {
                if ($.isEmptyObject(fgs))
                {
                    fgs = {};
                    flow["filter"][keyid] = fgs;
                }
                if ($.isEmptyObject(fgs[fgid]))
                {
                    fgs[fgid] = (function getNewFG(fgname, filtertype, ownerid, formid, remark)
                    {
                        return {
                            "fgname": fgname,
                            "filtertype": filtertype,
                            "ownerid": ownerid,
                            "isformgroup": (formid ? "1" : "0"),
                            "formid": formid,
                            "remark": remark
                        };
                    })("", filtertype, ownerid, formid, "");
                }
            }

            switch (opt)
            {
                case "0":
                case "1":
                    var id = "dlg" + "FF" + formid;
                    var ifrname = "FF" + id.substr(3);
                    var url = stringFormat("../FlowForm/VFlowFilterAdd.aspx?FromDesigner=Y&DocType={0}&ModCode={1}&IsForm={2}&FormID={3}&FilterType=&OwnerID=",
                        flow["doctype"], flow["modcode"], formid ? "1" : "0", formid);

                    hideAllTip();
                    showDialog(
                        {
                            "title": opt === "0" ? "条件组新增" : "条件组修改",
                            "html": stringFormat($("#scFF").html(), ifrname),
                            "width": 800,
                            "height": 650,
                            "id": id
                        }, function ()
                        {
                            var ifr = $("#" + id + " iframe");
                            if (ifr.attr("src") !== url)
                            {
                                ifr.attr("src", url);
                            }

                            $("#" + id + " #btnSOFF_tb").toggle(opt === "0");
                            $("#" + id + " #btnSFF,#" + id + " #btnSOFF,#" + id + " #btnCFF").off("click");
                            $("#" + id + " #btnCFF").on("click", function ()
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
                                    $("#" + id + " #btnSFF").on("click", function ()
                                    {
                                        if (frames(ifrname).saveFFToData())
                                        {
                                            closeDialog(id);
                                        }
                                    });
                                    if (opt === "0")
                                    {
                                        $("#" + id + " #btnSOFF").on("click", function ()
                                        {
                                            if (frames(ifrname).saveFFToData(true))
                                            {
                                                fgid = getNewID();
                                                fgs[fgid] = getNewFG("", filtertype, ownerid, formid, "");
                                                frames(ifrname).loadFFByData(fgs[fgid]);
                                            }
                                        });
                                    }

                                    frames(ifrname).loadFFByData(fgs[fgid]);
                                }
                            })();
                        });
                    break;
                case "2":
                    delete fgs[fgid];
                    if ($.isEmptyObject(fgs))
                    {
                        delete flow["filter"][keyid];
                    }

                    initTipInfoValue(divTip, "FilterTip");
                    break;
            }

        });

        $(".img_add[type='1'],.img_del[type='1']", divTip).attr("title", function ()
        {
            return $(this).attr("opt") === "0" ? "新增审批要点" : "删除审批要点";
        }).off("click").on("click", function ()
        {
            var img = $(this);
            var flsid = img.closest("table").attr("flsid");
            var cpid = img.closest("tr").attr("cpid");
            var cps = flow["point"][flsid];

            if (img.attr("opt") === "0")
            {
                var id = "dlgCP";
                var ifrname = "CPData";
                var url = "../../Common/Select/CheckFlow/VSelectCP.aspx";

                if ($.isEmptyObject(cps))
                {
                    cps = {};
                    flow["point"][flsid] = cps;
                }

                hideAllTip();
                showDialog(
                    {
                        "title": "选择审批要点",
                        "html": $("#scCP").html(),
                        "width": 750,
                        "height": 550,
                        "id": id
                    }, function ()
                    {
                        var ifr = $("#" + id + " iframe");
                        if (ifr.attr("src") !== url)
                        {
                            ifr.attr("src", url);
                        }

                        $("#" + id + " #btnSCP,#" + id + " #btnSOCP,#" + id + " #btnACP,#" + id + " #btnCCP").off("click");
                        $("#" + id + " #btnCCP").on("click", function ()
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
                                $("#" + id + " #btnSCP").on("click", function ()
                                {
                                    if (frames(ifrname).selectCP())
                                    {
                                        closeDialog(id);
                                    }
                                });
                                $("#" + id + " #btnSOCP").on("click", function ()
                                {
                                    frames(ifrname).selectCP(true);
                                });
                                $("#" + id + " #btnACP").on("click", function ()
                                {
                                    frames(ifrname).addCP();
                                });
                                frames(ifrname).acceptCP(cps);
                            }
                        })();
                    });
            }
            else
            {
                delete cps[cpid];
                if ($.isEmptyObject(cps))
                {
                    delete flow["point"][flsid];
                }

                initTipInfoValue(divTip, "PointTip");
            }
        });

        $("#tbPoint tbody :checkbox", divTip).on("click", function ()
        {
            var chk = $(this);
            var flsid = chk.closest("table").attr("flsid");
            var cpid = chk.closest("tr").attr("cpid");
            var cps = flow["point"][flsid];

            cps[cpid]["ismustcheck"] = chk[0].checked ? "Y" : "N";
        });
    };

    // 删除环节或审批人时，删除流程条件和审批要点
    var deleteFilterAndPoint = function (opt)
    {
        switch (opt)
        {
            case "ClearFlow":
                for (var x = 1; x < flow["nodes"].length - 1; x++)
                {
                    deleteFilterAndPoint("DeleteNode", x);
                }
                break;
            case "DeleteNode":
                var x = arguments[1];
                var flid = flow["nodes"][x]["flid"];
                deleteFilterAndPoint("DeleteFF", flid);
                deleteFilterAndPoint("ClearNode", x);
                break;
            case "ClearNode":
                var x = arguments[1];
                for (var y = 0; y < flow["nodes"][x]["checker"].length; y++)
                {
                    deleteFilterAndPoint("DeleteChecker", x, y);
                }
                break;
            case "DeleteChecker":
                var x = arguments[1];
                var y = arguments[2];
                var flsid = flow["nodes"][x]["checker"][y]["flsid"];
                deleteFilterAndPoint("DeleteFF", flsid);
                deleteFilterAndPoint("DeleteCP", flsid);
                break;
            case "DeleteFF":
                var ownerid = arguments[1];
                delete flow["filter"][ownerid];
                for (var i = 0; i < flow["form"].length;i++)
                {
                    delete flow["filter"][ownerid + flow["form"][i]["formid"]];
                }
                break;
            case "DeleteCP":
                var flsid = arguments[1];
                delete flow["point"][flsid];
                break;
        }

    }

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
        var cnt = checkers.length;

        switch (tipname)
        {
            case "FlowInfoTip":
                var flowinfo = getFFAndCPOwnerInfo();
                $("#divFLName", divTip).text(flow["flowname"]).attr("title", flow["flowname"]);
                $("#divFLNo", divTip).text(flow["flowno"]).attr("title", flow["flowno"]);
                $("#divFLTName", divTip).text(flow["flowtypename"]).attr("title", flow["flowtypename"]);
                $("#divModName", divTip).text(flow["modname"]).attr("title", flow["modname"]);
                $("#divHasFF", divTip).text(flowinfo["ffinfo"]).attr("title", flowinfo["ffinfo"].replace(regsemicolon,"\n"));
                $("#divHasCP", divTip).text(flowinfo["cpinfo"]).attr("title", flowinfo["cpinfo"].replace(regsemicolon, "\n"));
                break;
            case "FlowTip":
                $("tr:eq(0) a[type='ClearFlow']", divTip).toggle(!(nodes.length === 3 && nodes[1]["checker"].length === 1 && nodes[1]["checker"][0]["findtype"] === "0"));
                break;
            case "TachTip":
                var spFO = $("#tdFlowOption .normalNode", divTip);
                var spPT = $("#tdPassType .normalNode", divTip);
                var allowAdd = $("#tdAllowAdd", divTip).closest("tr");
                spFO.show();
                spPT.show();
                allowAdd.show();
                spFO.filter("[value='" + node["flowoption"] + "']").click();
                switch (flowoption)
                {
                    case "0":
                        spFO.filter("[value='2']").hide();
                        if (cnt > 1)
                        {
                            spFO.filter("[value='1'],[value='5']").hide();
                        }
                        if (hasNextCheckTach(x + 1))
                        {
                            spFO.filter("[value='5']").hide();
                        }
                        break;
                    case "1":
                        spFO.filter("[value='2']").hide();
                        if (checkers[y]["findtype"] === "G")
                        {
                            spFO.filter("[value!='1']").hide();
                        }
                        else if (hasNextCheckTach(x + 1))
                        {
                            spFO.filter("[value='5']").hide();
                        }
                        node["allowadd"] = "N";
                        allowAdd.hide();
                        break;
                    case "2":
                        spFO.filter("[value!='2']").hide();
                        break;
                    case "3":
                    case "4":
                        spFO.filter("[value='2']").hide();
                        if (cnt > 1)
                        {
                            spFO.filter("[value='1'],[value='5']").hide();
                        }
                        if (hasNextCheckTach(x + 1))
                        {
                            spFO.filter("[value='5']").hide();
                        }
                        if (hasPreviousSaveTach(x))
                        {
                            spFO.filter("[value='0'],[value='1']").hide();
                        }
                        break;
                    case "5":
                        spFO.filter("[value='2']").hide();
                        if (hasPreviousSaveTach(x))
                        {
                            spFO.filter("[value='0'],[value='1']").hide();
                        }
                        break;
                }
                if (hasChargeLeader(x))
                {
                    spFO.filter("[value='5']").hide();
                }
                $("#txtFLName", divTip).val(node["flname"]);

                spPT.filter("[value='" + node["passtype"] + "']").click();
                if (cnt === 1)
                {
                    spPT.filter("[value='2']").hide();
                }

                $("#txtGD", divTip).val(node["gd"]);
                $("#txtAD", divTip).val(node["ad"]);

                $("#tdAllowJump .normalNode[value='" + node["allowjump"] + "']", divTip).click();
                $("#tdAllowAdd .normalNode[value='" + node["allowadd"] + "']", divTip).click();

                $("tr:eq(0) a[type='ClearNode']", divTip).toggle(cnt > 1 || checkers[0]["findtype"] !== "0");
                $("tr:eq(0) .em_summary", divTip).text("环节" + x);
                break;
            case "CheckerTip":
                var checker = checkers[y];
                var findtype = checker["findtype"];
                var hasLoadType = inValues(findtype, "P", "D", "E");
                var beFixChecker = findtype === "F";
                if (hasLoadType)
                {
                    $("#tdLoadType .normalNode[value='" + checker["loadtype"] + "']", divTip).click();
                }
                if (beFixChecker)
                {
                    $("#txtFixRemark", divTip).val(checker["employeename"]);
                }
                $("#trLoadType", divTip).toggle(hasLoadType);
                $("#trFixRemark", divTip).toggle(beFixChecker);
                $("#trCheckerFilter", divTip).toggle(inValues(flowoption, "0", "3", "4") && !beFixChecker);
                $("tr:eq(0) a[type='DeleteChecker']", divTip).toggle(cnt > 1);
                $("tr:eq(0) a[type='ClearChecker']", divTip).toggle(findtype !== "0" && !hasSameChecker(x, "0", ""));
                $("#lblCreatorAdjust :checkbox", divTip).removeAttr("checked");
                $("#lblCreatorAdjust", divTip).toggle(flowoption === "1" && findtype === "0");
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

                    html += stringFormat('<tr ownerid="{0}" formid="{1}"><td><img class="img_add" type="0" opt="0" style="float:right" src="../../Image/flow/add.png" />'
                        + '<img src="../../Image/flow/expand.gif" class="img_exp" /><span class="sp_fgname">{2}</span></td></tr><tr><td class="padleft20">',
                        ownerid, forms[i]["formid"], forms[i]["formtitle"]);

                    if (!$.isEmptyObject(fgs))
                    {
                        for (var fgid in fgs)
                        {
                            var ffs = fgs[fgid]["filter"];

                            if (ffs && ffs.length)
                            {
                                fgcnt++;

                                html += stringFormat('<div fgid="{0}" style="padding:4px 0;"><img type="0" opt="2" class="img_del" style="float:right" src="../../Image/flow/delete.png" />'
                                    + '<img type="0" opt="1" class="img_edit" style="float:right" src="../../Image/flow/edit.png" /><span class="sp_fgname">{1}</span>'
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

                bindTipFilterEvent(divTip);
                bindTipAddAndEditEvent(divTip);
                break;
            case "PointTip":
                var flsid = checkers[y]["flsid"];
                var cps = flow["point"][flsid];
                var html = '';
                
                if (!$.isEmptyObject(cps))
                {
                    for (var cpid in cps)
                    {
                        html += stringFormat('<tr cpid="{0}"><td>{1}</td><td style="text-align:center"><input type="checkbox" class="idbox"{2} />'
                            + '</td><td><img type="1" opt="2" class="img_del" src="../../Image/flow/delete.png" /></td></tr>',
                            cpid, cps[cpid]["checkpointdesc"], cps[cpid]["ismustcheck"] === "Y" ? ' checked="checked"' : '');
                    }
                }
                else
                {
                    html += '<tr><td colspan="3" class="padleft20">';
                    html += stringFormat(noDataHtml, "不存在任何审批要点");
                    html += '</td></tr>';
                }
                $("#tbPoint", divTip).attr("flsid", flsid);
                $("#tbPoint tbody", divTip).html(html);

                bindTipAddAndEditEvent(divTip);
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
                    //divTip.focus();//先注释掉，避免其中的部分文本框失去焦点
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
                    bindTipCommonEvent(divTip);
                    break;
                case "TachTip":
                    bindTipCommonEvent(divTip);
                    bindTipSelectEvent(divTip);
                    bindTipTextEvent(divTip);
                    break;
                case "CheckerTip":
                    bindTipCommonEvent(divTip);
                    bindTipSelectEvent(divTip);
                    bindTipTextEvent(divTip);
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

    // 初始化监控区
    var initMonitoredAreas = function ()
    {
        var x, y, left, top, width, height;
        var divFlow = getObj("divFlow");

        monitoredAreas.splice(0, monitoredAreas.length);

        // 审批人可插入点、可替换点
        $("#trFlow .img_checker").each(function ()
        {
            var checker = $(this).closest("table");
            var tach = checker.closest("td");

            var beInsert = inValues(tach.attr("flowoption"), "0", "3", "4");
            var beReplace = checker.attr("findtype") === "0";

            if (beInsert || beReplace)
            {
                x = checker.parent().index() / 2;
                y = checker.index();
                left = getAbsAxisX(this) + divFlow.scrollLeft - 6;
                top = getAbsAxisY(this) + divFlow.scrollTop - 16;
                width = checker.parent().width();
                height = 26;

                // 插入点
                if (beInsert)
                {
                    monitoredAreas.push([x, y, left, top, width, height, false]);

                    if (y === checker.siblings().length)
                    {
                        monitoredAreas.push([x, y + 1, left, top + $(this).height() + 6, width, height, false]);
                    }
                }

                // 可替换点
                if (beReplace)
                {
                    // 数组最后一个元素true，标记该监控区为替换区
                    monitoredAreas.push([x, y, left, top + height, width, height, true]);
                }
            }
        });

        // 环节可插入点
        $("#trFlow .img_am").each(function ()
        {
            x = ($(this).closest("td").index() + 1) / 2;
            y = -1;
            left = getAbsAxisX(this) + divFlow.scrollLeft - 25;
            top = getAbsAxisY(this) + divFlow.scrollTop - 13;
            width = 81;
            height = 50;

            monitoredAreas.push([x, y, left, top, width, height, false]);
        });

        /*
        for (var i = 0; i < monitoredAreas.length; i++)
        {
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = monitoredAreas[i][2];
            div.style.top = monitoredAreas[i][3];
            div.style.width = monitoredAreas[i][4];
            div.style.height = monitoredAreas[i][5];
            div.style.border = "solid 1px red";
            document.body.appendChild(div);
        }
        */
    };

    // 加载流程图
    var loadFlowChart = function ()
    {
        initNodes(flow["nodes"]);

        loadChargeLeader(flow["nodes"]);

        var divFlow = getObj("divFlow");
        var sl = divFlow.scrollLeft;
        var st = divFlow.scrollTop;

        var tbFlow = getObj("tbFlow");
        //redrawHandle(tbFlow, function ()
        //{
            $("#trFlow", tbFlow).html(getChartHtml(flow["nodes"]));
            $("#trHead", tbFlow).html(getChartHeadHtml(flow["nodes"]));
        //});

        initMonitoredAreas();

        bindNodeDragEvent($("#trFlow .tb_checker"), 2);
        bindNodeDragEvent($("#trFlow .img_am:not([src$='1.png'])"), 3);
        bindNodeMouseOverEvent($("#trHead td.td_head:not(:first):not(:last),#trFlow .img_checker,#trFlow .img_swtich[src$='begin.png'],.img_info"));

        divFlow.scrollLeft = sl;
        divFlow.scrollTop = st;
    };

    // 加载分管领导
    var loadChargeLeader = function (nodes)
    {
        var div = $("#divChargeLeader");
        div.html(getChargeLeaderHtml(nodes));
        bindNodeDragEvent($(".sp_checker_mi", div), 0);
    };

    // 拖动效果
    // opt：0:拖动待选审批人/1:拖动待选环节/2:拖动流程图中审批人/3:拖动流程图中环节/4:拖动流程图背景
    var movable = 0, moveopt;       // 允许拖动（1/0）、当前操作类型
    var ox, oy;                     // 鼠标与拖动对象左上角的X、Y坐标差
    var px1, py1, px2, py2;         // 流程图面板左上角右下角点的坐标
    var pscleft, psctop;            // 流程图面板的滚动left和top
    var anchor, tip;                // 拖动点、插入点dom、环节悬停点dom
    var aheight, tdisp, tx, ty, rp; // 拖动点高度、插入点、可见性、插入点索引
    var mDown = function (obj, opt)
    {
        hideAllTip();
        $(obj).attr("moving", "1");

        moveopt = opt;
        var divFlow = getObj("divFlow");
        switch (opt)
        {
            case 0:
            case 1:
            case 2:
            case 3:
                ox = event.clientX - getAbsAxisX(obj);
                oy = event.clientY - getAbsAxisY(obj);
                px1 = getAbsAxisX(divFlow);
                py1 = getAbsAxisY(divFlow);
                px2 = px1 + divFlow.offsetWidth;
                py2 = py1 + divFlow.offsetHeight;
                pscleft = divFlow.scrollLeft;
                psctop = divFlow.scrollTop;

                anchor = getAnchor(obj, opt);
                anchor.style.display = "none";
                document.body.appendChild(anchor);

                tip = getHoverTip();
                tip.style.display = "none";
                document.body.appendChild(tip);
                break;
            case 4:
                ox = event.clientX + divFlow.scrollLeft;
                oy = event.clientY + divFlow.scrollTop;
                break;
        }

        movable = 1;
        obj.setCapture();
    };
    var mMove = function (obj, opt)
    {
        if (movable)
        {
            var divFlow = getObj("divFlow");
            switch (opt)
            {
                case 0:
                case 1:
                case 2:
                case 3:
                    if (anchor.style.display == "none")
                    {
                        anchor.style.display = "";
                        aheight = anchor.offsetHeight;
                    }
                    var x = event.clientX, y = event.clientY;
                    var tl, tt, tw, th, thtml;
                    tdisp = false;
                    anchor.style.left = x - ox - (opt === 0 ? 11 : (opt === 1 ? -21 : (opt == 3 ? 0 : 0)));
                    anchor.style.top = y - oy - (opt === 0 ? 15 : (opt === 1 ? 3 : (opt == 3 ? ((aheight || anchor.offsetHeight) / 2 - 13) : 0)));
                    for (var i = 0; i < monitoredAreas.length; i++)
                    {
                        tx = monitoredAreas[i][0];
                        ty = monitoredAreas[i][1];
                        rp = monitoredAreas[i][6];
                        var l = monitoredAreas[i][2] - pscleft;
                        var t = monitoredAreas[i][3] - psctop;
                        var w = monitoredAreas[i][4];
                        var h = monitoredAreas[i][5];

                        if (x > px1 && y > py1 && x < px2 && y < py2 && x >= l && x <= l + w && y >= t && y <= t + h && canBeInserted(tx, ty, obj, opt, rp))
                        {
                            thtml = '';
                            if (ty === -1)
                            {
                                tw = 5;
                                th = 50;
                                tl = l + (w - tw) / 2;
                                tt = t;
                            }
                            else
                            {
                                if (rp)
                                {
                                    tw = 23;
                                    th = 47;
                                    tl = l + 6;
                                    tt = t - (th - h) / 2 + 1;
                                    thtml = stringFormat(hoverImg, obj.findtype);
                                }
                                else
                                {
                                    tw = w;
                                    th = 4;
                                    tl = l;
                                    tt = t + (h - th) / 2;
                                }
                            }

                            if (thtml)
                            {
                                tip.style.backgroundColor = "transparent";
                            }
                            else
                            {
                                tip.removeAttribute("style");
                            }
                            if (tip.innerHTML !== thtml)
                            {
                                tip.innerHTML = thtml;
                            }
                            tip.style.width = tw;
                            tip.style.height = th;
                            tip.style.left = tl;
                            tip.style.top = tt;
                            tdisp = true;
                            break;
                        }
                    }
                    $(tip).toggle(tdisp);
                    break;
                case 4:
                    divFlow.scrollLeft = ox - event.clientX;
                    divFlow.scrollTop = oy - event.clientY;
                    break;
            }
        }
    };
    var mUp = function (obj, opt)
    {
        $(obj).removeAttr("moving");

        if (movable)
        {
            var divFlow = getObj("divFlow");
            switch (opt)
            {
                case 0:
                case 1:
                case 2:
                case 3:
                    if (document.body.contains(tip))
                    {
                        document.body.removeChild(tip);
                    }

                    if (tdisp)
                    {
                        if (document.body.contains(anchor))
                        {
                            document.body.removeChild(anchor);
                        }

                        for (var i = 0; i < monitoredAreas.length; i++)
                        {
                            if (tx === monitoredAreas[i][0] && ty === monitoredAreas[i][1] && rp === monitoredAreas[i][6])
                            {
                                var node = getNode(obj, opt);

                                if (ty === -1)
                                {
                                    flow["nodes"].splice(tx, 0, $.extend(true, {}, node));
                                }
                                else
                                {
                                    flow["nodes"][tx]["checker"].splice(ty, rp ? 1 : 0, node["checker"][0]);
                                }

                                if (opt === 2)
                                {
                                    var o_x = $(obj).parent().index() / 2, o_y = $(obj).index();

                                    if (ty === -1 && tx <= o_x)
                                    {
                                        o_x++;
                                    }
                                    else if (ty > -1 && tx === o_x && ty < o_y && !rp)
                                    {
                                        o_y++;
                                    }

                                    flow["nodes"][o_x]["checker"].splice(o_y, 1);

                                    if (!flow["nodes"][o_x]["checker"].length)
                                    {
                                        flow["nodes"].splice(o_x, 1);
                                    }
                                }
                                else if (opt === 3)
                                {
                                    var o_x = ($(obj).closest("td").index() + 1) / 2;
                                    if (ty === -1 && tx <= o_x)
                                    {
                                        o_x++;
                                    }
                                    flow["nodes"].splice(o_x, 1);
                                }

                                tdisp = false;
                                $(tip).hide();
                                loadFlowChart();
                                break;
                            }
                        }
                    }
                    else
                    {
                        reboundAnchor(anchor, obj, opt, 30);
                    }
                    break;
                case 4:
                    break;
            }

            movable = 0;
            obj.releaseCapture();
        }
    };

    // 显示/隐藏右边栏
    $(".div_exp").on("mouseover", function ()
    {
        $(this).attr("class", "div_exp_on");
    }).on("mouseout", function ()
    {
        $(this).attr("class", "div_exp");
    }).on("click", function ()
    {
        var img = $(this).find("img");
        var path = img.attr("src").substr(0, img.attr("src").lastIndexOf("/") + 1);
        img.attr("src", path + ($("#tdOption").css("display") === "none" ? "col" : "exp") + ".png");
        $("#tdOption").toggle();
    });

    // 公司下拉框切换事件
    window.changeCorp = function ()
    {
        var ddl = $("#ddlCorp")[0];
        setAjaxContainer(ddl);
        ajax(document.URL, { "Action": "GetDeptByCorp", "CorpID": ddl.value, "KeyWord": $("#txtKW").val() }, "json", function (data)
        {
            switch (data.Success)
            {
                case "Y":
                    $("#divDept").html(data.Data);

                    var firstLen = $("#divDept tr:first").attr("id").split(".").length;

                    $("#divDept img[onclick='expColTG(this)']").on("click", function ()
                    {
                        var tr = $(this).closest("tr");
                        var id = tr.attr("id");
                        var itemLen = id.split(".").length;

                        eval(this.onclick);

                        if (this.src.indexOf("expand") != -1 && !tr.attr("g"))
                        {
                            setAjaxContainer(tr[0]);
                            ajax(document.URL, { "Action": "GetStationByDept", "DeptID": tr.attr("did"), "KeyWord": $("#txtKW").val() }, "json", function (data)
                            {
                                var stationHtml = '<tr id="' + id + '.0" class="dg_row"><td style="padding-left:' + ((itemLen - firstLen + 2) * 16 + 4) + 'px">';
                                switch (data.Success)
                                {
                                    case "Y":
                                        var stations = $.stringToJSON(data.Data);
                                        for (var i = 0; i < stations.length; i++)
                                        {
                                            //stationHtml += stringFormat(miniNodeHtml, "s", stations[i][1] + '（' + (stations[i][2] ? stations[i][2] : "未指定") + '）', stations[i][0]);
                                            stationHtml += stringFormat(miniNodeHtml, "s", stations[i][1] + '(' + (stations[i][2] ? stations[i][2] : "未指定") + ')', stations[i][0]);
                                        }
                                        stationHtml += '</td></tr>';
                                        tr.after(stationHtml);
                                        tr.attr("g", "1");
                                        bindNodeDragEvent($(".sp_checker_mi", tr.next()), 0);
                                        break;
                                    case "X":
                                        var next = tr.next();
                                        if (!next.length || next.attr("id").split(".").length <= itemLen)
                                        {
                                            stationHtml += stringFormat(noDataHtml, data.Data);
                                            stationHtml += '</td></tr>';
                                            tr.after(stationHtml);
                                        }
                                        tr.attr("g", "1");
                                        break;
                                    default:
                                        alert(data.Data);
                                        break;
                                }
                            });
                        }
                    });

                    $("#divDept .normalNode").on("click", clickTGImg);
                    showLayerTG($("#divDept>table")[0], 1, 0, 0);
                    if ($("#txtKW").val() != "")
                    {
                    	var img = getTGImg($("#divDept>table")[0], 0, 0);
                    	if (img)
                    	{
                    		img.click();
                    	}
                    }
                    break;
                case "X":
                    $("#divDept").html(stringFormat(noDataHtml, data.Data, " marginleft20"));
                    break;
                default:
                    alert(data.Data);
                    break;
            }
        });
    };

    // 切换选项卡事件
    $(".dft_h2,.dft_h3").on("click", function ()
    {
        var i = $(this).index();
        $("#divTach,#divChecker").each(function (j)
        {
            $(this).toggle(i == j);
        });
        
        $(this).attr("class", "dft_h2").children("#spML1").attr("class", "dft_tle2");
        $(this).siblings().attr("class", "dft_h3").children("#spML2").attr("class", "dft_tle3");      
    });

    // 展开不同的审批人类型的事件
    $(".subtitle").on("click", function ()
    {
        var td = $(this);
        var img = td.children("img");
        var tr = td.closest("tr").next();
        var div = tr.find("div:last");
        var isDisp = !!img.filter("[src$=here.gif]").length;
        
        img.attr("src", img.attr("src").replace(isDisp ? "here" : "heredown", isDisp ? "heredown" : "here"));
        td.closest("tr").next().toggle(isDisp);

        if (isDisp && !div.html())
        {
            switch (td.attr("type"))
            {
                case "S":
                    changeCorp();
                    break;
                case "P":
                    setAjaxContainer(td[0]);
                    ajax(document.URL, { "Action": "GetPosition"}, "json", function (data)
                    {
                        switch (data.Success)
                        {
                            case "Y":
                                var positionHtml = "";
                                var positions = $.stringToJSON(data.Data);
                                for (var k in positions)
                                {
                                    positionHtml += stringFormat(miniNodeHtml, "p", positions[k], k);
                                }
                                div.html(positionHtml);
                                bindNodeDragEvent($(".sp_checker_mi", div), 0);
                                break;
                            case "X":
                                div.html(stringFormat(noDataHtml, data.Data));
                                break;
                            default:
                                alert(data.Data);
                                break;
                        }
                    });
                    break;
                case "F":
                    div.html(stringFormat(miniNodeHtml, "f", "固定审批人"));
                    bindNodeDragEvent($(".sp_checker_mi", div), 0);
                    break;
                case "A":
                    div.html(stringFormat(miniNodeHtml, "a", "部门负责人"));
                    bindNodeDragEvent($(".sp_checker_mi", div), 0);
                    break;
                case "B":
                    // 分管领导在加载流程图时一起加载
                    break;
                case "C":
                    div.html(stringFormat(miniNodeHtml, "c", "职能上级"));
                    bindNodeDragEvent($(".sp_checker_mi", div), 0);
                    break;
                case "D":
                case "E":
                    setAjaxContainer(td[0]);
                    ajax(document.URL, { "Action": "GetFRCategory", "FRType": td.attr("type") == "D" ? "0" : "1" }, "json", function (data)
                    {
                        switch (data.Success)
                        {
                            case "Y":
                                div.html(data.Data);

                                div.find("img[onclick='expColTG(this)']").on("click", function ()
                                {
                                    var tr = $(this).closest("tr");

                                    eval(this.onclick);

                                    if (this.src.indexOf("expand") != -1 && !tr.attr("g"))
                                    {
                                        setAjaxContainer(tr[0]);
                                        ajax(document.URL, { "Action": "GetFlowRole", "FRCID": tr.attr("cid") }, "json", function (data)
                                        {
                                            var stationHtml = '<tr id="' + tr.attr("id") + '.0" class="dg_row"><td class="padleft20">';
                                            switch (data.Success)
                                            {
                                                case "Y":
                                                    var roles = $.stringToJSON(data.Data);
                                                    for (var i = 0; i < roles.length; i++)
                                                    {
                                                        //stationHtml += stringFormat(miniNodeHtml, td.attr("type").toLowerCase(), roles[i][1] + (roles[i][2] ? ('（' + roles[i][2] + '）') : ""), roles[i][0]);
                                                        stationHtml += stringFormat(miniNodeHtml, td.attr("type").toLowerCase(), roles[i][1] + (roles[i][2] ? ('(' + roles[i][2] + ')') : ""), roles[i][0]);
                                                    }
                                                    stationHtml += '</td></tr>';
                                                    tr.after(stationHtml);
                                                    tr.attr("g", "1");
                                                    bindNodeDragEvent($(".sp_checker_mi", tr.next()), 0);
                                                    break;
                                                case "X":
                                                    stationHtml += stringFormat(noDataHtml, data.Data);
                                                    stationHtml += '</td></tr>';
                                                    tr.after(stationHtml);
                                                    tr.attr("g", "1");
                                                    break;
                                                default:
                                                    alert(data.Data);
                                                    break;
                                            }
                                        });
                                    }
                                });
                                div.find(".normalNode").on("click", clickTGImg);
                                showLayerTG(div.find("table")[0], 1, 0, 0);
                                break;
                            case "X":
                                div.html(stringFormat(noDataHtml, data.Data, " marginleft20"));
                                break;
                            default:
                                alert(data.Data);
                                break;
                        }
                    });
                    break;
                    
            }
        }
    });

    // 流程图resize事件
    var ww = $("#divFlow").width(), hh = $("#divFlow").height();
    $("#divFlow").on("resize", function ()
    {
        var nw = $("#divFlow").width(), nh = $("#divFlow").height();
        if (nw !== ww || nh !== hh)
        {
            hideAllTip();
            ww = nw;
            hh = nh;
        }
    });

    // 提交保存事件
    $("#btnSave").on("click", function ()
    {
        var nodes = flow["nodes"];
        if (nodes.length < 3)
        {
            return alertMsg("流程必须包含至少一个审批人。");
        }

        var hasCheckTach = false;
        for (var i = 1; i < nodes.length - 1; i++)
        {
            var node = nodes[i];
            var checkers = node["checker"];
            var flowoption = node["flowoption"];
            if (inValues(flowoption, "0", "3", "4", "5"))
            {
                hasCheckTach = true;
            }
            if (inValues(flowoption, "1", "2", "5") && checkers.length > 1)
            {
                return alertMsg(stringFormat("流程的环节{0}不能包含多个审批人。", i));
            }
            for (var j = 0; j < checkers.length; j++)
            {
                var checker = checkers[j];
                if (checker["findtype"] === "0")
                {
                    return alertMsg(stringFormat("流程中不能包含空审批人（审批人{0}为空审批人）。",getNodeOutline(checker["flsid"])));
                }
            }
            if (!node["flname"])
            {
                node["flname"] = flnames[flowoption];
            }
        }
        if (!hasCheckTach)
        {
            return alertMsg("流程不能只包含调整环" + (flow["isneedallot"] === "Y" ? "或拆分环" : "") + "。");
        }

        //移除多于的空流程条件组（流程条件打开便初始化了数据，关闭时无法清理干净故在此清理） 陈毓孟 2015-09-25 
        //过滤流程条件组的无效数据 肖勇彬 2015-09-25
        for (var ownertype in flow["filter"])
        {
            for (var group in flow["filter"][ownertype])
            {
                if (!flow["filter"][ownertype][group].filter)
                {
                    delete flow["filter"][ownertype][group];
                }
            }
        };

        ajax(document.URL, { "Action": "SubmitFlowDesign", "Data": $.jsonToString(flow) }, "json", function (data)
        {
            alert(data.Data);
        });
    });
    
    // 加载流程图
    setAjaxContainer($("#tdFlow")[0]);
    ajax(document.URL, { "Action": "GetFlowInfo" }, "json", function (data)
    {
        switch (data.Success)
        {
            case "Y":
                flow = $.stringToJSON(data.Data);
                if (flow["isneedallot"] === "Y")
                {
                    $("#spAllotTach,#imgAllot,#spAllot").show();
                }
                document.title += "：" + flow["flowname"];
                loadFlowChart();
                bindNodeDragEvent($(".div_tach"), 1);
                bindNodeDragEvent($("#divFlow"), 4);
                break;
            default:
                alert(data.Data);
                break;
        }
    });
});