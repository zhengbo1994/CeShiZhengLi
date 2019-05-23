//更改架构改变流程类别和统计方式
function changeFlowCorp(init)
{
    loadFlowType();
    if (init)
    {
        $("#ddlCorp").val($("#hidCorpID").val());
    }
    else
    {
        $("#ddlCorp").val($("#ddlFlowCorp").val());
    }
    changeCorp(init);
    setFlow();
}

function changeCorp(init)
{
    loadDept(init);
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
function loadDept(init)
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
        changeDept(init);
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
    if ($("#txtSD").val() && compareDate($("#txtSD").val(), now) == -1)
    {
        return alertMsg("开始日期不能晚于今天。", $("#txtSD"));
    }
    $("#hidFlowTypeID").val($("#ddlFlowType").val());
    $("#hidDeptID").val($("#ddlDept").val());
    return true;
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

// 导出
function exportUseStateReport()
{
    if (dgData.rows.length < 2)
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

function setFlow()
{
    if ($("#hidFlowName").val())
    {
        $("#ahFlow").val($("#hidFlowName").val());
    }
}

function changeDept(init)
{
    setStation(init);
}

function setStation(init)
{
    if(init)
    {
        $("#ahStation").val($("#hidStationName").val());
    }
    else
    {
        $("#hidStationID").val("");
        $("#hidStationName").val("");
        $("#ahStation").val("");
    }
}

// 查看流程（opt：0:查看选择的流程/1:查看报表中的流程）
function showFlow(opt)
{
    openWindow("../Flow/VFlowBrowse.aspx?ID=" + (opt ? getEventObj("tr").id : $("#hidFlowID").val()), 0, 0);
}

// 页面加载
function loadPageData()
{
    if (dgData)
    {
        $("tr:gt(0)", dgData).each(function ()
        {
            $(this).find("td:eq(4),td:eq(5)").each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text()) > 0)
                {
                    var url = stringFormat("VFlowUseStateReportByTimeDetail.aspx?FlowID={0}&CorpID={1}&DeptID={2}&StationID={3}&SD={4}&ED={5}",
                        cell.closest("tr").attr("id"),
                        $("#hidCorpID").val(),
                        $("#hidDeptID").val(),
                        $("#hidStationID").val(),
                        $("#hidSD").val(),
                        $("#hidED").val());
                    var status = "";
                    if (cell.index() == 5)
                    {
                        status = "Formal";
                    }
                    url = addUrlParam(url, "Status", status);
                    cell.html('<a href="javascript:void(0)">' + cell.text() + '</a>').find("a").on("click", function ()
                    {
                        openWindow(url, 800, 600);
                    });
                }
            });
        });
    }
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