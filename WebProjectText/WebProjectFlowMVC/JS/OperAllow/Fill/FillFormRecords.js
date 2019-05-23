$(function ()
{
    var $hidTemplateName = $("#hidTemplateName"),
        $tbFillFormRecords = $("#tbFillFormRecords"),
        $divFillFormRecords = $("#divFillFormRecords"),
        timerID = null,
        refreshTime = 60000;

    // 新增
    $("#btnAdd").click(function ()
    {
        if (controller)
        {
            controller.OpenNewExcel($hidTemplateName.val());
        }
    });

    // 修改
    $("#btnEdit").click(function ()
    {
        if (controller)
        {
            var $chekbox = $("#tbFillFormRecords").find(":checkbox:checked");
            if ($chekbox.length === 0)
            {
                return alertMsg("没有任何记录可供操作。");
            }
            else if ($chekbox.length > 1)
            {
                return alertMsg("您一次只能操作一条记录。");
            }

            var $filter = $($chekbox[0]).closest("tr").find("#hidFilter")
            controller.OpenEditExcel($hidTemplateName.val(), $filter.val());
        }
    });

    // 刷新
    $("#btnRefresh").on("click", function ()
    {
        if (timerID)
        {
            window.clearTimeout(timerID);
        }

        document.location.reload();
    });

    // 查看
    $("#tbFillFormRecords").on("click", ".show-field", function ()
    {
        if (controller)
        {
            var $tdPrimaryKey = $(this).closest("tr").find("td.primarykey"),
                fieldName = $tdPrimaryKey.attr("fieldname"),
                fieldValue = $tdPrimaryKey.find("#lbFieldValue").text();

            controller.OpenBrowseExcel($hidTemplateName.val(), fieldName + "='" + fieldValue + "'");
        }
    });

    function refreshData()
    {
        ajax("VFillFormRecords.aspx", {
            TemplateID: $("#hidTemplateID").val(),
            RelationID: $("#hidRelationID").val(),
            FieldCount: $("#hidFieldCount").val(),
            filter:unescape(getParamValue("filter"))
        }, "json", function (data)
        {
            if (data && data.Success === "Y")
            {
                $divFillFormRecords.html(data.Data);
            }

            if (timerID)
            {
                window.clearTimeout(timerID);
            }

            timerID = window.setTimeout(function () { refreshData() }, refreshTime);
        });
    }

    timerID = window.setTimeout(function () { refreshData() }, refreshTime);
});