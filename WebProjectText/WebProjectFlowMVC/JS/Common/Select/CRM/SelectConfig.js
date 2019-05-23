
// 加载
function reloadData()
{
    ajax(location.href, { searchKey: $("#txtKey").val(), selectedID: $("#ddlItems").val(), idType: $("#lblItemsName").text() }, "html", loadConfigItem);
}

function loadConfigItem(data, textStatus)
{
    $(divMPList).html(data);

    if ($("#hidIsMulti").val() != "Y")
    {
        // 取消选中行事件
        $("tr").removeAttr("onclick");
        $(":checkbox").removeAttr("onclick");
        $("#chkAll").hide();

        $(":checkbox").click(function ()
        {
            $(":checkbox").attr("checked", false);
            $(this).attr("checked", true);
        })
    }
}

// 搜索
function btnSearch_Click()
{
    reloadData();
}

//选择事件
function btnChoose_Click()
{
    var ids = "";
    $("input:checked").each(function (i)
    {
        var id = $(this).val();
        var name = $(this).parent().parent().find("td").eq(2).text();
        if (id != null && id.length == 36)
        {
            ids += id + ',' + name + '|';
        }
    })

    window.returnValue = ids;
    window.close();
}
