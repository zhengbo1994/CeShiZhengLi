// VSelectInsertRole.aspx的js

$(function ()
{
    // 右边栏中待选审批人的html
    var miniNodeHtml = '<span class="sp_checker_mi hand" idx="{0}" sid="{1}" aid="{2}" sname="{3}" ename="{4}" cname="{5}" dname="{6}"><img src="../../../Image/flow/ps.png" class="img_checker_mi"/>\n'
        + '<span class="font valign">{7}</span></span><br/>';

    // 基本信息
    var tachinfo = parent["tachinfo"];

    // 最终插入的岗位信息
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

        var flowOption = tachinfo["flowoption"];
        var findtype = tachinfo["waitselectchecker"]["findtype"].toLowerCase();
        var persons = tachinfo["waitselectchecker"]["person"];

        switch (findtype)
        {
            case "f":
                $("#spTitle").text("");
                break;
            case "p":
                $("#spTitle").text("职务“" + tachinfo["waitselectchecker"]["findname"] + "”关联的岗位");
                break;
            case "d":
                $("#spTitle").text("公司角色“" + tachinfo["waitselectchecker"]["findname"] + "”关联的岗位");
                break;
            case "e":
                $("#spTitle").text("项目角色“" + tachinfo["waitselectchecker"]["findname"] + "”关联的岗位");
                break;
        }

        inValues(flowOption, "1", "5") ? $("#btnUp,#btnDown").attr("disabled", "disabled") : $("#btnUp,#btnDown").removeAttr("disabled");

        var divStation = $("#divStation");
        var stationHtml = '';
        for (var i = 0; i < persons.length; i++)
        {
            var person = persons[i];
            stationHtml += stringFormat(miniNodeHtml, person["idx"], person["stationid"], person["accountid"], person["stationname"], person["employeename"],
                person["corpname"], person["deptname"], person["stationname"] + '（' + (person["employeename"] ? person["employeename"] : "未指定") + '）');
        }
        divStation.html(stationHtml);

        divStation.find(".sp_checker_mi").on("mouseover", function ()
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
                    "idx": sp.attr("idx"),
                    "stationid": sp.attr("sid"),
                    "accountid": sp.attr("aid"),
                    "stationname": sp.attr("sname"),
                    "employeename": sp.attr("ename"),
                    "corpname": sp.attr("cname"),
                    "deptname": sp.attr("dname")
                }, inValues(flowOption, "1", "5"));
        });

        result.length = 0;
        loadStations();
    })(true);
});