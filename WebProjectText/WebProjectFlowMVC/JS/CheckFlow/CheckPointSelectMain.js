$(function ()
{
    reloadData();

    //调用父页面方法
    $(document).click(function ()
    {
        window.top.closeDialog();
    });
});

function reloadData()
{
    var strKeyWord = $.trim($("#txtKW", window.parent.document).val());
    var strCPTID = $("#hidCPTID").val();
    if (strCPTID != "")
    {
        var query = { CPTID: strCPTID, KeyWord: strKeyWord };
        //点击类别时
        if (arguments[0])
        {
            query = { CPTIDS: strCPTID, KeyWord: strKeyWord };
        }

        if (loadJQGrid("jqGrid1", query))
        {
            addParamsForJQGridQuery("jqGrid1", [query]);
            refreshJQGrid("jqGrid1");
        }
    }
}


function customGridComplete()
{
    //初始化已选
    var $tr = $("#tbPoint tr:gt(0)", window.top.document);
    $tr.each(function ()
    {
        var $selDiv = $("#" + this.id);
        if ($selDiv.size() > 0)
        {
            $selDiv.trigger("click");
            $selDiv.find("input").eq(1).attr("checked", $(this).find("input").eq(1).attr("checked"));
        }
    });
}

//jqgrid行选择事件
function savePointInfo(rowid, status)
{
    var $TR = $("#tbPoint tr:gt(0)", window.top.document);
    var $cptid = $("#hidCPTID");
    if (status == true)
    {
        if ($TR.filter("[id='" + rowid + "']").size() == 0)
        {
            var $tr = $("#" + rowid);
            var $td = $tr.find("td");

            if ($TR.size() == 0 && $cptid.val() == "all")
            {
                $cptid.val($td[6].title);
            }
            else
            {
                if ($td[6].title != $cptid.val())
                {
                    alertMsg("只能添加同类别的审批要点！");
                    $tr.trigger("click");
                    return false;
                }
            }
            var strHtml = "<tr id='" + rowid + "' title='" + $td[2].title + "'><td style='text-align:center'><input type='checkbox' onclick='selectTR(this)' checked /></td><td><div class='nowrap' style='width:430px'>" + $td[2].title
                        + "</div></td><td style='text-align:center'><input type='checkbox' onclick='changeMust(this)' " + ($td.eq(5).find("input").is(":checked") == true ? "checked" : "") + "/></td></tr>";
            $("#tbPoint", window.top.document).append(strHtml);
            if (!$("#tbPoint :checkbox:first", window.top.document).is(":checked"))
            {
                $("#tbPoint :checkbox:first", window.top.document).attr("checked", true);
            }
        }
    }
    else
    {
        var $delTR = $("#" + rowid, window.top.document);
        if ($delTR.size() > 0)
        {
            $delTR.remove();
        }

        if ($("#tbPoint tr:gt(0)", window.top.document).size() == 0)
        {
            $cptid.val("all")
        }
    }
}

//全选事件
function saveAllPointInfo(aRowids, status)
{
    if ($("#div-content", window.top.document).find(".selNode")[0].cptid == "all" && status == true)
    {
        var $jqTR = $("#jqGrid1 tr");
        //是否为同类别
        var isSameType = true;
        //第一项的类别
        var firstCPTID = "";
        $jqTR.each(function (i)
        {
            if (i == 0)
            {
                firstCPTID = $(this).find("td")[6].title;
                return true;
            }
            if (firstCPTID != $(this).find("td")[6].title)
            {
                isSameType = false;
                return false;
            }
        });
        if (!isSameType)
        {
            alertMsg("存在不同类别，不可全选！");
            var $allChk = $("#cb_jqGrid1");
            $allChk.attr("checked", !$allChk.attr("checked"));
            $("#jqGrid1 tr").trigger("click");
            return;
        }
    }

    var $TR = $("#tbPoint tr:gt(0)", window.top.document);
    if (status == true)
    {
        $.each(aRowids, function (i, value)
        {
            if ($TR.filter("[id='" + value + "']").size() == 0)
            {
                var $tr = $("#" + value);
                var $td = $tr.find("td");
                var strHtml = "<tr id='" + value + "' title='" + $td[2].title + "'><td style='text-align:center'><input type='checkbox' onclick='selectTR(this)' checked /></td><td><div class='nowrap' style='width:430px'>" + $td[2].title
                        + "</div></td><td style='text-align:center'><input type='checkbox' onclick='changeMust(this)' " + ($td.eq(5).find("input").is(":checked") == true ? "checked" : "") + "/></td></tr>";
                $("#tbPoint", window.top.document).append(strHtml);
            }
        });
    }
    else
    {
        $.each(aRowids, function (i, value)
        {
            var $delTR = $("#" + value, window.top.document);
            if ($delTR.size() > 0)
            {
                $delTR.remove();
            }
        });
    }
}

function chkChange(obj)
{
    var $tr = $(obj).closest("tr");
    var $chk = $tr.find(":checkbox:first");
    if ($chk.is(":checked"))
    {
        var $changeDiv = $("#" + $tr[0].id, window.top.document);
        if ($changeDiv.size() > 0)
        {
            $changeDiv.find("input").eq(1).attr("checked", $(obj).attr("checked"));
        }
    }
}