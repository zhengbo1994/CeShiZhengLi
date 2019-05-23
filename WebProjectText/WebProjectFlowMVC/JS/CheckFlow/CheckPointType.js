$(function ()
{
    var $content = $("#div-content");
    var $contentSon = $content.find("span");
    //同级新增
    $("#btnAddSibling").click(function ()
    {
        var id = $content.data("ids").parentid;
        if (id)
        {
            openWindow("VCheckPointTypeAdd.aspx?ID=" + id, 500, 300);
        }
        else
        {
            return alertMsg("请选择添加的类别！");
        }
    });

    //下级新增
    $("#btnAddSon").click(function ()
    {
        var id = $content.data("ids").cptid;
        if (id)
        {
            openWindow("VCheckPointTypeAdd.aspx?ID=" + id, 500, 300);
        }
        else
        {
            return alertMsg("请选择添加的类别！");
        }
    });

    //修改
    $("#btnEdit").click(function ()
    {
        var id = $content.data("ids").cptid;
        if (id)
        {
            if (id == "Num")
            {
                return alertMsg("不存在类别！");
            }
            else
            {
                openWindow("VCheckPointTypeEdit.aspx?ID=" + id, 500, 300);
            }
        }
        else
        {
            return alertMsg("请选择修改的类别！");
        }
    });

    //删除
    $("#btnDelete").click(function ()
    {

        var id = $content.data("ids").cptid;
        if (id)
        {
            if (id == "Num")
            {
                return alertMsg("不存在类别!");
            }
            else
            {
                var isHasSon = $contentSon.filter("[parentid='" + id + "']").size() > 0; //是否有子节点
                if (isHasSon)
                {
                    return alertMsg("请先删除该类别的子类别！");
                }
                var url = "/" + rootUrl + "/Common/Delete/VDeletePlatform.aspx?Action=CheckPointType&JQID=&NoFrame=true&ID=" + id;
                var width = 320;
                var height = 202;
                if (ieVersion >= 7)
                {
                    height = 154;
                }
                var left = (screen.width - width) / 2;
                var top = (screen.height - height) / 2;

                window.showModalDialog(url, window, 'dialogtop=' + top + 'px;dialogleft=' + left + 'px;dialogWidth=' + width + 'px;dialogHeight=' + height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
            }
        }
        else
        {
            return alertMsg("请选择删除的类别！");
        }
    });

    //初始化审批类别
    var $prevClickSpan = null; //前一次点击对象
    $contentSon.click(function ()
    {
        if ($prevClickSpan == null || $prevClickSpan != this.cptid)
        {
            $content.data("ids", { cptid: this.cptid, parentid: this.parentid });
            $(this).removeClass("normalNode").addClass("selNode");
            if ($prevClickSpan != null)
            {
                $prevClickSpan.removeClass("selNode").addClass("normalNode");
            }
            $("iframe")[0].src = "VCheckPointTypeMain.aspx?CPTID=" + this.cptid;
            $prevClickSpan = $(this);
        }
    });

    //新增刷新时选中之前所选项
    if (typeof getParamValue("ID") != "undefined")
    {
        if ($contentSon.filter("[cptid='" + getParamValue("ID") + "']").length == 1)
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

//子页面调用此方法刷新页面
function reloadData()
{
    if ($("#div-content").data("ids").cptid != "Num")
    {
        window.location = window.location.href + "&ID=" + $("#div-content").data("ids").cptid;
    }
    else
    {
        window.location = window.location.href;
    }
}