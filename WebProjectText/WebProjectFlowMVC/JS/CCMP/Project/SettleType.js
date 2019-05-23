//结算方式
//作者：张敏强
//日期:2013-06-06
var pageArg = {};
$(function ()
{
    var $jq = $("#jqgSettleType");

    var btnSetting = {
        "btnAdd": function ()
        {
            openAddWindow("VSettleTypeAdd.aspx", 500, 240, $jq[0].id);
        },
        "btnEdit": function ()
        {
            openModifyWindow("VSettleTypeEdit.aspx", 500, 240, $jq[0].id);
        },
        "btnDelete": function ()
        {
            openDeleteWindow("SettleType", 4, $jq[0].id);
        },
        "btnSearch": function ()
        {
            reloadData();
        }
    }

    $("body").click(function (event)
    {
        if (event.target.id && btnSetting[event.target.id])
        {
            btnSetting[event.target.id].apply();
        }
    });

    var reloadData = function ()
    {
        var vKey = $("#txtKey").val();
        $jq.getGridParam('postData').KeyValue = vKey;

        refreshJQGrid($jq[0].id);
    };

    pageArg.reloadData = reloadData;
});

function clickMenu(key)
{
    switch (key)
    {
        case "Export":
            $("#btnExport").trigger("click");
            break;
        case "DefaultData":
            if (confirm("将清空现有数据，是否导入？"))
            {
                ajax(document.URL, { "Action": "ImportDefaultData" }, "json", function (d)
                {
                    d.Success == "Y" ? pageArg.reloadData() : alert(d.Data);
                });
            }
            break;
    }
}