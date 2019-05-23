/*
客户自定义配置使用到的JS
作者：程镇彪
日期：2012-09-18
*/
//条件搜索
function reloadData()
{

    var sProjectGUID = getObj("ddlProjectGUID").value; 
    ajax(location.href, { "sProjectGUID": sProjectGUID }, "json", loadBuilding);
}

function loadBuilding(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }

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

function GetBuildingID(data)
{
    // 如果仅允许单选
    if (getObj("hidIsMulti").value == "N")
    {

    }
}

// 选择事件
function btnChoose_Click()
{
    var ids = "";
    $("input:checked").each(function (i)
    {
        var id = $(this).val();
        //var name = $(this).parent().parent().find("td").eq(2).text();
        if (id != null)
        {
            ids += id + '|'; // +name + '|';
        }
    })
    ids = ids.replace("on|", "");
    if (ids == "")
    {
        alert("没有选择楼栋。");
        return false;
    }
    window.returnValue = ids;
    window.close();
}
