// VSelectInsertTach.aspx的js

$(function ()
{
    var ajaxUrl = "../../../CheckFlow/Flow/VFlowDesigner.aspx?From=IF&FlowID=" + $('#hidFlowID').val() + "&StationID=" + $('#hidStationID').val();

    // 右边栏中待选审批人的html
    var miniNodeHtml = '<span class="sp_checker_mi hand" sid="{0}" aid="{1}" sname="{2}" ename="{3}" cname="{4}" dname="{5}"><img src="../../../Image/flow/ps.png" class="img_checker_mi"/>\n'
        + '<span class="font valign">{6}</span></span><br/>';

    // 无数据的提示信息html
    var noDataHtml = '<span class="promptmsg{1}">[&nbsp;{0}&nbsp;]</span>';

    // 基本信息
    var tachinfo = parent["tachinfo"];

    // 最终插入的环节和岗位信息
    var result = [];

    // 交换数组元素
    var changeArrayItem = function (array, index1, index2)
    {
        array[index1] = array.splice(index2, 1, array[index1])[0];
        return array;
    }

    // 加载岗位
    var loadStations = function (selectedIndexes)
    {
        var lsts = $("#lstStation");

        if (!selectedIndexes)
        {
            selectedIndexes = [];
            lsts.find("option:selected").each(function ()
            {
                selectedIndexes.push($(this).index());
            });
        }

        lsts.html('');
        $.each(result, function (i, n)
        {
            lsts.append(stringFormat('<option{2}>{0}（{1}）</option>',
                n["stationname"],
                n["employeename"] ? n["employeename"] : '未指定',
                $.inArray(i, selectedIndexes) !== -1 ? ' selected' : ''));
        });
    }

    // 插入岗位
    var insertStations = function (station, beClear)
    {
        if (beClear)
        {
            result.length = 0;
        }
        else if (result.length)
        {
            for (var i = 0; i < result.length; i++)
            {
                if (result[i]["stationid"] === station["stationid"])
                {
                    return;
                }
            }
        }

        result.push(station);

        loadStations();
    }

    // 确认选择
    window.submitSelect = function ()
    {
        if (!result.length)
        {
            alert("未选择任何岗位。");
            return null;
        }

        var checkers = [];
        var oldchecker = tachinfo["waitselectchecker"];
        var source = { "Create": "6", "Check": "7", "Edit": "8" }[tachinfo["mode"]];
        for (var i = 0; i < result.length; i++)
        {
            var checker = {};
            checker["flsid"] = oldchecker["flsid"];
            checker["loadtype"] = "0";
            checker["findtype"] = "S";
            checker["isvisible"] = "Y";
            checker["source"] = source;
            checker["person"] = [result[i]];

            checkers.push(checker);
        }

        return checkers;
    }

    // 上移、下移
    $("#btnUp,#btnDown").on("click", function ()
    {
        var opts = $("#lstStation option:selected");
        if (opts.length)
        {
            var step = $(this).attr("id") === "btnUp" ? -1 : 1;
            var cnt = result.length;
            var selectedIndexes = [];
            if (step > 0)
            {
                opts = $(opts.get().reverse());
            }

            opts.each(function ()
            {
                var i = $(this).index();
                var j = step < 0 ? (i > 0 ? i - 1 : cnt - 1) : (i < cnt - 1 ? i + 1 : 0);
                changeArrayItem(result, i, j);
                selectedIndexes.push(j);
            });

            loadStations(selectedIndexes);
        }
    });

    // 删除
    $("#btnDel").on("click", function ()
    {
        var opts = $("#lstStation option:selected");
        if (opts.length)
        {
            opts = $(opts.get().reverse());
            opts.each(function ()
            {
                result.splice($(this).index(), 1);
            });

            loadStations([]);
        }
    });

    // 插入起草人
    $("#btnAdd").on("click", function ()
    {
        insertStations(tachinfo["creator"], inValues(tachinfo["flowoption"], "1", "5"));
    });

    // 初始化页面
    var initTime;
    (window.initPage = function (fromThisPage)
    {
        // 第一次加载页面时防止重复执行
        if (fromThisPage)
        {
            initTime = new Date();
        }
        else if (new Date().getTime() - initTime.getTime() < 500)
        {
            return;
        }

        inValues(tachinfo["flowoption"], "1", "5") ? $("#btnUp,#btnDown").attr("disabled", "disabled") : $("#btnUp,#btnDown").removeAttr("disabled");

        result.length = 0;
        loadStations();
    })(true);

    // 公司下拉框切换事件
    (window.changeCorp = function ()
    {
        var ddl = $("#ddlCorp")[0];
        setAjaxContainer(ddl);
        ajax(ajaxUrl, { "Action": "GetDeptByCorp", "CorpID": ddl.value }, "json", function (data)
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
                            ajax(ajaxUrl, { "Action": "GetStationByDept", "DeptID": tr.attr("did"), "InsertChecker": "Y" }, "json", function (data)
                            {
                                var stationHtml = '<tr id="' + id + '.0" class="dg_row"><td style="padding-left:' + ((itemLen - firstLen + 2) * 16 + 4) + 'px">';
                                switch (data.Success)
                                {
                                    case "Y":
                                        var stations = $.stringToJSON(data.Data);
                                        for (var i = 0; i < stations.length; i++)
                                        {
                                            stationHtml += stringFormat(miniNodeHtml, stations[i][0], stations[i][3], stations[i][1], stations[i][2],
                                                stations[i][4], stations[i][5], stations[i][1] + '（' + (stations[i][2] ? stations[i][2] : "未指定") + '）');
                                        }
                                        stationHtml += '</td></tr>';
                                        tr.after(stationHtml);
                                        tr.attr("g", "1");
                                        $(".sp_checker_mi", tr.next()).on("mouseover", function ()
                                        {
                                            $(this).addClass("td_popform_on");
                                        }).on("mouseout", function ()
                                        {
                                            $(this).removeClass("td_popform_on");
                                        }).on("click", function ()
                                        {
                                            var sp = $(this);
                                            insertStations(
                                                {
                                                    "stationid": sp.attr("sid"),
                                                    "accountid": sp.attr("aid"),
                                                    "stationname": sp.attr("sname"),
                                                    "employeename": sp.attr("ename"),
                                                    "corpname": sp.attr("cname"),
                                                    "deptname": sp.attr("dname")
                                                }, inValues(tachinfo["flowoption"], "1", "5"));
                                        });
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
                    break;
                case "X":
                    $("#divDept").html(stringFormat(noDataHtml, data.Data, " marginleft20"));
                    break;
                default:
                    alert(data.Data);
                    break;
            }
        });
    })();
});