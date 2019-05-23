//更改架构改变流程类别和统计方式
function changeFlowCorp(init)
{
    loadFlowType();
    if (!init)
    {
        $("#ddlCorp").val($("#ddlFlowCorp").val());
    }
    changeCorp();
    setFlow();
}

function setFlow()
{
    if($("#hidFlowName").val())
    {
        $("#ahFlow").val($("#hidFlowName").val());
    }
}

//
function changeCorp()
{
    loadDept();
}

// 加载流程分类
function loadFlowType()
{
    ajax(document.URL, { "Action": "GetFlowType", "FlowCorpID": $("#ddlFlowCorp").val() }, "json", function (data)
    {
        data.Success == "Y" ? $("#tdFlowType").html(data.Data) : alert(data.Data);
        if ($("#hidFlowTypeID").val())
        {
            $("#tdFlowType option[value=" + $("#hidFlowTypeID").val() + "]").attr("selected", true);
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
        }

        if ($("#hidDeptID").val())
        {
            $("#ddlDept").val($("#hidDeptID").val());
        }
        changeDept();
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

// 校验
function validateSize()
{
    if (!$("#ddlFlowCorp").val())
    {
        return alertMsg("请选择流程公司。", $("#ddlFlowCorp"));
    }
    if (!$("#ddlCorp").val())
    {
        return alertMsg("请选择统计公司。", $("#ddlCorp"));
    }
    if ($("#txtSD").val() && $("#txtED").val() && compareDate($("#txtSD").val(), $("#txtED").val()) == -1)
    {
        return alertMsg("结束日期不能早于开始日期。", $("#txtED"));
    }
    var now = new Date().Format("yyyy-MM-dd");
    if ($("#txtSD").val() && compareDate($("#txtSD").val(),now) == -1)
    {
        return alertMsg("开始日期不能晚于今天。", $("#txtSD"));
    }

    $("#hidFlowTypeID").val($("#ddlFlowType").val());
    $("#hidDeptID").val($("#ddlDept").val());
    $("#hidStateType").val($("#ddlStateType").val());
    return true;
}

function changeDept()
{
    var deptID = $("#ddlDept").val();
    if(deptID)
    {
        $("#ddlStateType").val("1").attr("disabled", true);
    }
    else
    {
        $("#ddlStateType").removeAttr("disabled");
    }
}

// 页面加载
function loadTimeoutPage()
{
    if (dgData)
    {
        var bIsDept = $("#hidStateType").val() == "0";
        var tdexpr = bIsDept ? ":eq(2),:eq(3),:eq(5),:eq(7),:eq(9)" : ":eq(3),:eq(4),:eq(6),:eq(8),:eq(10)";
        $("tr:gt(0):not(:last)", dgData).each(function ()
        {
            $(this).find("td" + tdexpr).each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text()) > 0)
                {
                    var row = cell.closest("tr");
                    var url = stringFormat("VFlowCheckTimeoutAnalyseByCorpDetail.aspx?ID={0}&StateType={1}&DeptID={2}&FlowCorpID={3}&FMID={4}&FlowTypeID={5}&FlowID={6}&SD={7}&ED={8}&Name={9}",
                        row.attr("id"),
                        $("#hidStateType").val(),
                        row.attr("deptid"),
                        $("#hidFlowCorpID").val(),
                        $("#hidFMID").val(),
                        $("#hidFlowTypeID").val(),
                        $("#hidFlowID").val(),
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


// 导出
function exportTimeoutReport()
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
        "SD": pageArg.SD,
        "ED": pageArg.ED,
        "StateType": pageArg.StateType,
        "DateRange": pageArg.DateRange,
        "CorpName": pageArg.CorpName,
        "Sum": $("#hidSum").val()
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

function loadPageData()
{
    if (dgData)
    {
        var bIsDept = $("#hidStateType").val() == "0";
        var tdexpr = bIsDept ? ":eq(2),:eq(3),:eq(4)" : ":eq(3),:eq(4),:eq(5)";
        $("tr:gt(0):not(:last)", dgData).each(function ()
        {
            $(this).find("td" + tdexpr).each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text()) > 0)
                {
                    var row = cell.closest("tr");
                    var url = stringFormat("VFlowCheckTimeoutAnalyseByTimeDetail.aspx?ID={0}&StateType={1}&DeptID={2}&FlowCorpID={3}&FMID={4}&FlowTypeID={5}&FlowID={6}&SD={7}&ED={8}&Name={9}",
                        row.attr("id"),
                        $("#hidStateType").val(),
                        row.attr("deptid"),
                        $("#hidFlowCorpID").val(),
                        $("#hidFMID").val(),
                        $("#hidFlowTypeID").val(),
                        $("#hidFlowID").val(),
                        $("#hidSD").val(),
                        $("#hidED").val(),
                        encode(row.find(bIsDept ? ":eq(1)" : ":eq(2)").text()));
                    var cellIndex = cell.index();
                    bIsDept && cellIndex++;

                    url = addUrlParam(url, "CheckOption", ["", "Normal", "AbNormal"][cellIndex - 3]);


                    cell.html('<a href="javascript:void(0)">' + cell.text() + '</a>').find("a").on("click", function ()
                    {
                        openWindow(url, 800, 600);
                    });
                }
            });
        });
    }
}