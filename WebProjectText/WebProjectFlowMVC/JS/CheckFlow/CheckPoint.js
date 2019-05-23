//是否第一次
var ispost = false;
$(function ()
{
    //新增
    $("#btnAdd").click(function ()
    {
        if (!$("#div-content").data("ids"))
        {
            return alertMsg("没有审核要点类别可供操作。");
        }
        var id = $("#div-content").data("ids").cptid;
        if (id == "all")
        {
            var $chk = $("#jqGrid1 :checkbox:checked", window.frames("Main").document);
            if ($chk.size() == 0)
            {
                return alertMsg("请选择要添加的审核要点类别！");
            }
            else if ($chk.size() > 1)
            {
                return alertMsg("您一次只能操作一条数据。");
            }
            openAddWindow("VCheckPointAdd.aspx?ID=" + $chk.closest("tr").find("td")[5].title, 500, 300, "jqGrid1");
        }
        else
        {
            openAddWindow("VCheckPointAdd.aspx?ID=" + id, 500, 300, "jqGrid1");
        }
    });

    //修改
    $("#btnEdit").click(function ()
    {
        var $chk = $("#jqGrid1 :checkbox:checked", window.frames("Main").document);
        if ($chk.size() == 0)
        {
            return alertMsg("没有任何记录可供操作。");
        }
        else if ($chk.size() > 1)
        {
            return alertMsg("您一次只能操作一条数据。");
        }
        else
        {
            openWindow("VCheckPointEdit.aspx?ID=" + $chk.closest("tr")[0].id, 500, 300);
        }
    });

    //删除
    $("#btnDelete").click(function ()
    {
        //校验是否有记录可供操作
        var $chk = $("#jqGrid1 :checkbox:checked", window.frames("Main").document);
        if ($chk.size() == 0) {
            return alertMsg("没有任何记录可供操作。");
        }
        openDeleteWindow("CheckPoint", 0, "jqGrid1", "Main");
    });

    //搜索
    $("#btnSearch").click(function ()
    {
        //当主框架加载了一次后，才能调用主框架中的reloadData()方法
        if (ispost) {
            window.frames("Main").reloadData();
        }
    });

    var $content = $("#div-content");
    var $contentSon = $content.find("span");
    var prevClickSpan = null; //保留上一次点击的span

    var contentSon_Click = function ()
    {
        if (prevClickSpan == null || prevClickSpan != this)
        {
            if (prevClickSpan)
            {
                $(prevClickSpan).removeClass("selNode").addClass("normalNode");
            }
            $(this).removeClass("normalNode").addClass("selNode");
            prevClickSpan = this;
        }

        $("#div-content").data("ids", { cptid: this.cptid, parentid: this.parentid });
        if (!ispost)
        {
            $("iframe")[0].src = "VCheckPointMain.aspx?CPTID=" + this.cptid;
            ispost = true;
        }
        else
        {
            $("#hidCPTID", window.frames("Main").document).val(this.cptid);
            window.frames("Main").reloadData(ispost);
        }
    };

    //初始化审核类别
    $contentSon.click(contentSon_Click);

    //新增刷新时选中之前所选项
    if (typeof getParamValue("ID") != "undefined")
    {
        if ($contentSon.filter("[cptid='" + getParamValue("ID") + "']").size() == 1)
        {
            $contentSon.filter("[cptid='" + getParamValue("ID") + "']")[0].click();
        }
        else
        {
            $contentSon[0].click();
        }
    }
    else if ($contentSon.size() != 0)
    {
        $contentSon[0].click();
    }
});

//刷新列表页
function reloadMainData()
{
    window.frames("Main").reloadData(ispost);
}