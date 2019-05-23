// <tr id='Outline'><td>TreeImg
// <span class="tree-item normalNode" sonid=StruID type=StruType>
// StruName</span></td></tr>
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

    if (typeof option.itemClickValidate == "function")
    {
        this.itemClickValidate = option.itemClickValidate;
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
        $(this.treeTable).find("span.tree-item[sonid='" + option.currentItem + "']").trigger("click");
    }
    else
    {
        $(this.treeTable).find("span.tree-item:first").trigger("click");
    }
}

//点击树项
TreeTable.prototype.showItem = function (item)
{
    if (this.itemClickValidate)
    {
        var result = this.itemClickValidate.call(this, item);
        if (typeof result != "boolean" || !result)
        {
            return;
        }
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