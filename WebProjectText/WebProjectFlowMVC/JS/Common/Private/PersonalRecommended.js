// 加载菜单模块
function reloadList()
{
    //ajax(location.href, { "Type": $("#ddlType").val() }, "json", refreshList);

    var query = { "Type": $("#ddlType").val(), "KW": $("#txtKey").val() };
    reloadGridData("idPager", query);
}
// 刷新菜单模块
function refreshList(data, textStatus)
{
    if (data.Success == "Y")
    {
        $("#divMPList").html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

function selectRecommended()
{
    var ids = [];
    $("#rightRecommended input[trid]").each(function ()
    {
        ids.push($(this).attr('trid'));
    });

    ajax(location.href, { "Action": "SaveData", "TRIDs": ids.toString() }, "json", function (data)
    {
        alert(data.Data);

        if(data.Success == "Y")
        {
            closeMe();
        }
    });
}
//下拉框变换事件
function ddlTypeChangeMore()
{
    reloadList();
}
//下拉框变换事件
function ddlTypeChange()
{
    reloadData($("#ddlType").val());
}
//加载左边表格的数据
function reloadData(type)
{
    var data = $.stringToJSON($("#hidRecommendedData").val());
    $("#leftRecommended tr:gt(0)").remove();
    for (var i = 0; i < data.length; i++)
    {
        var IsShow = true;
        $("#rightRecommended input[trid]").each(function ()
        {
            if (data[i].TRID == $(this).attr('trid'))
            {
                IsShow = false;
            }
        });
        if (IsShow && (type == '' || type == data[i].Type))
        {
            var html = "<tr><td align='center'><input type='checkbox'  trid='" + data[i].TRID + "' /></td><td><div class='nowrap div-link hand' linkurl='" + data[i].Url + "'>" +
                data[i].Aliases + "</div></td><td align='center'>" + (data[i].DefaultDisplay == "Y" ? "是" : "否") +
                "</td><td>&nbsp;" + data[i].Description + "</td></tr>";
            $("#leftRecommended").append(html);
        }
    }
    setTableRowAttributes(document.getElementById("leftRecommended"));
    updateTableCount("left");
}

// 搜索左边数据
function filterData(type)
{
    var data = $.stringToJSON($("#hidRecommendedData").val());

    $("#leftRecommended tr:gt(0)").remove();

    for (var i = 0; i < data.length; i++)
    {
        var IsShow = true;
        $("#rightRecommended input[trid]").each(function ()
        {
            if (data[i].TRID == $(this).attr('trid'))
            {
                IsShow = false;
            }
        });
        if (IsShow && (!type || type == data[i].Type) && data[i].Aliases.indexOf($("#txtKey").val()) > -1)
        {
            var html = "<tr><td align='center'><input type='checkbox'  trid='" + data[i].TRID + "' /></td><td><a class='nowrap div-link hand' linkurl='" + data[i].Url + "'>" + data[i].Aliases +
                "</a></td><td align='center'>" + (data[i].DefaultDisplay == "Y" ? "是" : "否") +
                "</td><td>&nbsp;" + data[i].Description + "</td></tr>";
            $("#leftRecommended").append(html);
        }
    }
    setTableRowAttributes(document.getElementById("leftRecommended"));
    updateTableCount("left");
}

//加载右边表格数据
function loadRightData()
{
    var data = $.stringToJSON($("#hidRecommendedData").val());
    // 没有设置项则去默认项
    var selTRIDArray = ($("#hidSelectTRIDs").val() === "" ? $("#hidDefaultTRIDs").val().split(",") : $("#hidSelectTRIDs").val().split(","));

    $("#rightRecommended tr:gt(0)").remove();
    for (var j = 0; j < selTRIDArray.length; j++)
    {
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].TRID == selTRIDArray[j])
            {
                var html = "<tr><td align='center'><input class='cbox' type='checkbox'" + " trid='" + data[i].TRID + "' /></td><td><a class='nowrap div-link hand' linkurl='" + data[i].Url + "'>" + data[i].Aliases + "</a></td></tr>";
                $("#rightRecommended").append(html);
            }
        }
    }
    initTableStyle("rightRecommended");

    $(".span-num-right").text($("#rightRecommended tr:gt(0)").length);
    //setTableRowAttributes(document.getElementById("rightRecommended"));
    updateTableCount("right");
}

function initTableStyle(tableName)
{
    $("#" + tableName + " tr:gt(0)").each(function ()
    {
        this.className = this.rowIndex % 2 == 1 ? "dg_row" : "dg_altrow";
    });
}

//将数据从左边添加到右边
function btnAdd_Click()
{
    var data = $.stringToJSON($("#hidRecommendedData").val());
    $("#leftRecommended input[trid]:checked").each(function ()
    {
        var trid = $(this).attr('trid');
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].TRID == trid)
            {
                var html = "<tr><td align='center'><input type='checkbox'  trid='" + data[i].TRID + "' /></td><td><a class='nowrap div-link hand' linkurl='" + data[i].Url + "'>" + data[i].Aliases + "</a></td></tr>";
                if (data[i].DefaultDisplay == "Y")
                {
                    $("#rightRecommended tr:eq(0)").after(html);
                }
                else
                {
                    $("#rightRecommended").append(html);
                }
                break;
            }
        }
        $(this).parent().parent().remove();
    });
    //setTableRowAttributes(document.getElementById("rightRecommended"));
    initTableStyle("rightRecommended");
    setTableRowAttributes(document.getElementById("leftRecommended"));
    updateTableCount();
}

// 更表格行数
function updateTableCount(direcation)
{
    if (direcation === "right")
    {
        $(".span-num-right").text($("#rightRecommended").find("tr:gt(0)").length);
    }
    else if (direcation === "left")
    {
        $(".span-num-left").text($("#leftRecommended").find("tr:gt(0)").length);
    }
    else
    {
        $(".span-num-right").text($("#rightRecommended").find("tr:gt(0)").length);
        $(".span-num-left").text($("#leftRecommended").find("tr:gt(0)").length)
    }

}
    //将数据从右边添加到左边
    function btnDel_Click()
    {
        var data = $.stringToJSON($("#hidRecommendedData").val());
        $("#rightRecommended input[trid]:checked").each(function ()
        {
            var trid = $(this).attr('trid');
            var isDefault = $(this).attr("isdefault");
            if (isDefault != "Y")
            {
                for (var i = 0; i < data.length; i++)
                {
                    if (data[i].TRID == trid)//&& ($("#ddlType").val() == '' || data[i].Type == $("#ddlType").val()))
                    {
                        var html = "<tr><td align='center'><input type='checkbox'  trid='" + data[i].TRID + "' /></td><td><a class='nowrap div-link hand' linkurl='" + data[i].Url + "'>" + data[i].Aliases + "</a></td><td style='text-align:center;'>"
                            + (data[i].DefaultDisplay == "Y" ? "是" : "否") + "</td><td>" + data[i].Description + "</td></tr>";

                        if (data[i].DefaultDisplay == "Y")
                        {
                            $("#leftRecommended tr:eq(0)").after($(html));
                        }
                        else
                        {
                            $("#leftRecommended").append(html);
                        }
                        //$("#leftRecommended input[trid=" + trid + "]").parent().parent().click();
                        break;
                    }
                }

                $(this).parent().parent().remove();
            }
        });
        //setTableRowAttributes(document.getElementById("rightRecommended"));
        initTableStyle("rightRecommended");
        setTableRowAttributes(document.getElementById("leftRecommended"));
        updateTableCount();
    }

    function move(direction)
    {
        var $chk = $("#rightRecommended input[trid]:checked");
        if ($chk.length == 1)
        {
            if($chk.attr("isdefault") === "Y")
            {
                return alert("默认推荐项不可排序。");
            }
            var data_tr = $chk.parent().parent();
            if (direction == "up")
            {//向上移动
                if (!$(data_tr).prev().hasClass("dg_headrow") && $(data_tr).prev().find(":checkbox").attr("isdefault") !== "Y")
                {
                    $(data_tr).insertBefore($(data_tr).prev());//将本身插入到目标tr的前面
                }
            }
            if (direction == "down")
            {//向下移动
                if ($(data_tr).next().html() != null)
                {
                    $(data_tr).insertAfter($(data_tr).next());//将本身插入到目标tr的后面
                }
            }
            //setTableRowAttributes(document.getElementById("rightRecommended"));
            //var trid = $("#rightRecommended input[trid]:checked").attr('trid');
            //$("#rightRecommended input[trid=" + trid + "]").click();
            //$("#rightRecommended input[trid=" + trid + "]").parent().parent().click();
        }
        else
        {
            alert("请先选择一行需要排序的数据!");
        }
    }


    function showTab(index, divID)
    {
        selectTab(index, "TabInfo");
        $(".tab-div").hide();
        $(divID).show();
    }

    //页面跳转到推荐使用个人设置 add by DZL 2014-06-13
    function RecommendedSeting()
    {
        if (getParamValue("IsInventory") == "Y")
        {
            openWindow('VPersonalRecommendedSet.aspx?IsInventory=Y', 0, 0);
        }
        else
        {
            openWindow('VPersonalRecommendedSet.aspx', 0, 0);
        }
        //closeMe();
    }

    function changeView(ThisButton)
    {
        ajax(location.href, { "Action": "Preview", "DisPlayStyle": ThisButton }, "json", function ()
        {
            var win = window.frames("frameWorkPlace").window;
            win.location = win.location.href;
        });
    }

    function changeInventoryView(ThisButton)
    {
        ajax(location.href, { "Action": "Preview", "DisPlayStyle": ThisButton }, "json", function ()
        {
            var win = window.frames("frameInventoryWorkPlace").window;
            win.location = win.location.href;
        });
    }