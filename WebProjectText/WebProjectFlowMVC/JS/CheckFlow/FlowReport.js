// VFlowCheckTimeoutReport.aspx的js

// 页面加载
function loadTimeoutPage()
{
    $("#tdType").length && loadStaticType();
    
    if (dgData)
    {
        var bIsDept = $("#hidStatType").val() == "0";
        var tdexpr = bIsDept ? ":eq(2),:eq(3),:eq(5),:eq(7),:eq(9)" : ":eq(3),:eq(4),:eq(6),:eq(8),:eq(10)";
        $("tr:gt(0):not(:last)", dgData).each(function ()
        {
            $(this).find("td" + tdexpr).each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text()) > 0)
                {
                    var row = cell.closest("tr");
                    var url = stringFormat("VFlowCheckTimeoutReportBrowse.aspx?ID={0}&StatType={1}&DeptID={2}&FlowRange={3}&SD={4}&ED={5}&Name={6}",
                        row.attr("id"),
                        $("#hidStatType").val(),
                        row.attr("deptid"),
                        $("#hidFlowRange").val(),
                        $("#hidSD").val(),
                        $("#hidED").val(),
                        encode(row.find(bIsDept ? ":eq(1)" : ":eq(2)").text()));
                    var cellIndex = cell.index();
                    bIsDept && cellIndex++;
                    if (inValues(cellIndex, 4, 6, 8, 10))
                    {
                        url = addUrlParam(url, "Filter", ["Normal", "Warning", "Timeout", "Skip"][cellIndex / 2 - 2]);
                    }

                    cell.html('<a href="javascript:void(0)">' + cell.text() + '</a>').find("a").on("click", function ()
                    {
                        openWindow(url, 800, 600);
                    });
                }
            });
        });
    }
}

// 加载流程分类
function loadStaticType()
{
    ajax(document.URL, { "CorpID": $("#ddlCorp").val() }, "json", function (data)
    {
        data.Success == "Y" ? $("#tdType").html(data.Data) : alert(data.Data);
    });
}

// 校验
function validateCheckTimeoutFilter()
{
    if (!$("#ddlCorp").val())
    {
        return alertMsg("请选择公司。", $("#ddlCorp"));
    }
    if ($("#txtSD").val() && $("#txtED").val() && compareDate($("#txtSD").val(), $("#txtED").val()) == -1)
    {
        return alertMsg("结束日期不能早于开始日期。", $("#txtED"));
    }
    $("#hidFlowRange").val($("#ddlFlowRange").val());
    return true;
}

// 导出
function exportTimeoutReport()
{
    if (dgData.rows.length < 3)
    {
        return alertMsg("没有数据可供导出。");
    }
    var query =
        {
            "CorpID": $("#hidCorpID").val(),
            "StatType": $("#hidStatType").val(),
            "FlowRange": $("#hidFlowRange").val(),
            "SD": $("#hidSD").val(),
            "ED": $("#hidED").val(),
            "DateRange": $("#txtDateRange").val(),
            "CorpName": $("#txtCorpName").val(),
            "Sum": $("#hidSum").val()
        };
    ajaxExportByData(document.URL, query);
}



// VFlowUseStateReport.aspx的js

// 页面加载
function loadUseStatePage()
{
    $("#tdFlowType").length && loadFlowType();
    $("#tdDept").length && loadDept();
    $("#ahFlow").length && ($("#ahFlow").val($("#hidFlowName").val()));
    $("#ahStation").length && ($("#ahStation").val($("#hidStationName").val()));

    if (dgData)
    {
        $("tr:gt(1)", dgData).each(function ()
        {
            $(this).find("td:gt(3):lt(11),td:eq(18),td:eq(20)").each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text()) > 0)
                {
                    var url = stringFormat("VFlowUseStateReportBrowse.aspx?FlowID={0}&CorpID={1}&DeptID={2}&StationID={3}&SD={4}&ED={5}",
                        cell.closest("tr").attr("id"),
                        $("#hidCorpID").val(),
                        $("#hidDeptID").val(),
                        $("#hidStationID").val(),
                        $("#hidSD").val(),
                        $("#hidED").val());

                    cell.html('<a href="javascript:void(0)">' + cell.text() + '</a>').find("a").on("click", function ()
                    {
                        openWindow(url, 800, 600);
                    });
                }
            });
        });

        setUseStatePageDesc();
    }
}

// 设置页面描述
function setUseStatePageDesc()
{
    $(".pagedesc").html('<span style="font-weight:bold">通过</span>含:通过,不同意但通过,会签,处理,发起会签,指派；'
        + '<span style="font-weight:bold">打回</span>含:打回调整,重新起草,打回重审,打回拆分。');
}

// 切换下拉框 （opt：1:流程公司/2:起草人公司）
function changeCorp(opt)
{
    if (opt == 1)
    {
        if ($("#ddlCorp").val() != $("#ddlFlowCorp").val())
        {
            $("#ddlCorp").val($("#ddlFlowCorp").val());
            loadDept();
        }
        loadFlowType();
    }
    else if (opt == 2)
    {
        loadDept();
    }
}

// 加载流程分类
function loadFlowType()
{
    ajax(document.URL, { "Action": "GetFlowType", "CorpID": $("#ddlFlowCorp").val() }, "json", function (data)
    {
        data.Success == "Y" ? $("#tdFlowType").html(data.Data) : alert(data.Data);
        if ($("#hidFlowTypeID").val())
        {
            $("#tdFlowType option[value=" + $("#hidFlowTypeID").val() + "]").attr("selected", true);
            $("#hidFlowTypeID").val("");
        }
    });
}

// 加载部门
function loadDept()
{
    ajax(document.URL, { "Action": "GetDept", "CorpID": $("#ddlCorp").val() }, "json", function (data)
    {
        data.Success == "Y" ? $("#tdDept").html(data.Data) : alert(data.Data);
        if ($("#hidDeptID").val())
        {
            $("#tdDept option[value=" + $("#hidDeptID").val() + "]").attr("selected", true);
            $("#hidDeptID").val("");
        }
    });
}

// 选择流程
function selectFlow()
{
    var corpID = $("#ddlFlowCorp").val();
    var flowTypeID = $("#ddlFlowType").val();
    var fmID = $("#ddlFlowModel").val();
    var url = '../../Common/Select/CheckFlow/VSelectSingleFlow.aspx?CorpID=' + corpID + '&permission=all';
    if (flowTypeID)
    {
        url += '&FlowTypeID=' + flowTypeID;
    }
    if (fmID)
    {
        url += '&FMID=' + fmID;
    }

    var result = openModalWindow(url, 0, 0);
    if (result)
    {
        $("#hidFlowID").val(result.FlowID);
        $("#hidFlowName").val(result.FlowName);
        $("#ahFlow").val(result.FlowName);
    }
}

// 查看流程（opt：0:查看选择的流程/1:查看报表中的流程）
function showFlow(opt)
{
    openWindow("../Flow/VFlowBrowse.aspx?ID=" + (opt ? getEventObj("tr").id : $("#hidFlowID").val()), 0, 0);
}

// 选择起草人
function selectStation()
{
    var corpID = $("#ddlCorp").val();
    var deptID = $("#ddlDept").val();
    var url = '../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID;
    if (deptID)
    {
        url += '&DeptID=' + deptID;
    }

    var result = openModalWindow(url, 0, 0);
    if (result)
    {
        $("#hidStationID").val(result.split("|")[0]);
        $("#hidStationName").val(result.split("|")[1]);
        $("#ahStation").val(result.split("|")[1]);
    }
}

// 查看起草人
function showStation()
{
    openWindow('../../OperAllow/Station/VStationBrowse.aspx?StationID=' + $("#hidStationID").val(), 600, 450);
}

// 校验
function validateFlowUseStateFilter()
{
    if (!$("#ddlFlowCorp").val())
    {
        return alertMsg("请选择流程公司。", $("#ddlFlowCorp"));
    }
    if (!$("#ddlCorp").val())
    {
        return alertMsg("请选择起草人公司。", $("#ddlCorp"));
    }
    if ($("#txtSD").val() && $("#txtED").val() && compareDate($("#txtSD").val(), $("#txtED").val()) == -1)
    {
        return alertMsg("结束日期不能早于开始日期。", $("#txtED"));
    }
    var now = new Date().Format("yyyy-MM-dd");
    if ($("#txtSD").val() && compareDate($("#txtSD").val(), now) == -1)
    {
        return alertMsg("开始日期不能晚于今天。", $("#txtSD"));
    }
    $("#hidFlowTypeID").val($("#ddlFlowType").val());
    $("#hidDeptID").val($("#ddlDept").val());
    return true;
}

// 导出
function exportUseStateReport()
{
    if (dgData.rows.length < 3)
    {
        return alertMsg("没有数据可供导出。");
    }

    var pageArg = $.stringToJSON($("#hidFilterValue").val());

    var query =
    {
        "FlowCorpID": pageArg.FlowCorpID,
        "FlowTypeID": pageArg.FlowTypeID,
        "FMID": pageArg.FMID,
        "FlowID": pageArg.FlowID,
        "CorpID": pageArg.CorpID,
        "DeptID": pageArg.DeptID,
        "StationID": pageArg.StationID,
        "SD": pageArg.SD,
        "ED": pageArg.ED,
        "DateRange": pageArg.DateRange,
        "CorpName": pageArg.CorpName
    };

    ajaxExportByData(document.URL, query);
}

// 查看申请记录
function showRequest(keyID, url)
{
    if (!url)
    {
        url = $("#hidBrowseUrl").val();
    }

    openWindow("../../" + url + keyID, 0, 0);
}