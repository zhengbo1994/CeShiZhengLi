function btnSelectLookStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation', 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1] ? vValue.split('|')[1] : "全部";
    }
}

// 校验
function validateFilter()
{

    if ($("#txtSD").val() && $("#txtED").val() && compareDate($("#txtSD").val(), $("#txtED").val()) == -1)
    {
        return alertMsg("结束日期不能早于开始日期。", $("#txtED"));
    }

    $("#hidStationIDs").val($("#hidLookStationID").val());

    return true;
}

// 导出
function exportReport()
{
    if (dgData.rows.length < 3)
    {
        return alertMsg("没有数据可供导出。");
    }
    var query =
        {
            "StationIDs": $("#hidStationIDs").val(),
            "SD": $("#hidSD").val(),
            "ED": $("#hidED").val(),
            "DateRange": $("#txtDateRange").val(),
            "Sum": $("#hidSum").val()
        };
    ajaxExportByData(document.URL, query);
}

function loadStationPage()
{
    if (dgData)
    {
        $("tr:gt(0):not(:last)", dgData).each(function ()
        {
            $(this).find("td:eq(3)").each(function ()
            {
                var cell = $(this);
                if (parseInt(cell.text(), 10) > 0)
                {
                    var row = cell.closest("tr");
                    var url = stringFormat("VFlowMessageStationReportBrowse.aspx?SD={0}&ED={1}&CreateStationID={2}&Name={3}",
                        $("#hidSD").val(),
                        $("#hidED").val(),
                        $(row).attr("stationid"),
                        encode(row.find(":eq(1)").text()));

                    cell.html('<a href="javascript:void(0)">' + cell.text() + '</a>').find("a").on("click", function ()
                    {
                        openWindow(url, 0, 0);
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