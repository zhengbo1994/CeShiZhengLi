function TreeTable()
{
}

TreeTable.prototype.treeTable = function (option)
{
    if (typeof option.treeTableID == "string" && $("#" + option.treeTableID).length == 1)
    {
        this.treeTable = $("#" + option.treeTableID)[0];
    }
    else
    {
        $("#divMPList").html("<span class='promptmsg'>[ 注：不存在任何公司和部门。]</span>");
    }

    if (typeof option.itemFocusFun == "function")
    {
        this.itemFocusFun = option.itemFocusFun;
    }

    var that = this;
    this.option = option;
    var eventFuns = function (event)
    {
        //树项触发事件
        if (event.target.tagName.toUpperCase() == "SPAN" && event.target.className && event.target.className.indexOf("tree-item") != -1)
        {
            that.showItem.call(that, event.target);
        }

        event.stopPropagation();
    }

    //事件委托
    $(this.treeTable).click(eventFuns);

    //进入页面选中某项
    if (option.currentItem && $(this.treeTable).find("span.tree-item[sonid='" + option.currentItem + "']").length > 0)
    {
        $(this.treeTable).find("span.oper-item[sonid='" + option.currentItem + "']").trigger("click");
    }
    else
    {
        var $triggerSpan = $(this.treeTable).find("span.oper-item:first");
        $triggerSpan.trigger("click");

        if ($triggerSpan.length > 0)
        {
            $triggerSpan[0].scrollIntoView(false);
        }
    }
}

//点击树项
TreeTable.prototype.showItem = function (item)
{
    if (item.className.indexOf("oper-item") == -1)
    {
        return;
    }

    if (this.currentItem)
    {
        this.blur(this.currentItem);
    }
    this.currentItem = item;
    if (item.sonid != "Num")
    {
        this.focus(this.currentItem);
    }

    if (typeof this.itemFocusFun == "function")
    {
        //执行回调函数
        this.itemFocusFun.call(this, item, this.option);
    }
}

TreeTable.prototype.focus = function (item)
{
    $(item).removeClass("normalNode").addClass("selNode");
}

TreeTable.prototype.blur = function (item)
{
    $(item).removeClass("selNode").addClass("normalNode");
}

var pageArg = {};
$(function ()
{
    var treeTable = new TreeTable();
    var option = {
        "treeTableID": "tree-table",
        "itemFocusFun": function (item)
        {
            var mainFrame = $("iframe[name='Main']", window.parent.document)[0];
            if (!mainFrame.src)
            {
                mainFrame.src = "VSwitchStationData.aspx";
            }
            else
            {
                window.parent.frames("Main").pageArg.reloadData();
            }
        }
    }
    treeTable.treeTable(option)

    pageArg.treeTable = treeTable;
});