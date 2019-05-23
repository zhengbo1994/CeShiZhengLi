// 树形（获取子集有两种方式：默认为刷新一次，设置option.IsAllRefresh为true时，点击每次刷新
// 作者：张敏强 参考原树形
// 日期：2013-05-13
function DataTree()
{
}

DataTree.prototype.dataTree = function (option)
{
    this.option = option;
    this.$container = option.$container || $("#div-content");
    if (this.$container.length === 0)
    {
        return alertMsg("未找到匹配树容器元素！");
    }
    //获取数据地址
    if (!option.dataHref)
    {
        return alertMsg("请设置获取数据的地址！");
    }
    this.dataHref = option.dataHref;
    if (!option.dataInitAction)
    {
        return alertMsg("请指定初始化时指定给服务器的关键字！");
    }
    //初始化指定给服务器的关键字
    this.dataInitAction = option.dataInitAction;
    var that = this;
    ajaxRequest(this.dataHref, { AjaxRequest: true, Type: this.dataInitAction, ParentID: option.parentID }, "html",
        function (value)
        {
            if (value != "[]")
            {
                var strTable = "<table border='0' cellpadding='0' cellspacing='0' style='width:100%'>";
                var trObjs = $.parseJSON(value)
                for (var i = 0, len = trObjs.length; i < len; i++)
                {
                    var strImg = trObjs[i].IsLS == "Y" ?
                        (trObjs[i].IsHS == "Y" ? ("<span class='span-icon img-collapse-last'></span>") :
                        ("<span class='span-icon img-item-last'></span>")) :
                        (trObjs[i].IsHS == "Y" ? ("<span class='span-icon img-collapse'></span>") :
                        ("<span class='span-icon img-item'></span>"));

                    strTable += "<tr id='" + trObjs[i].OID + "'><td nowrap='nowrap'>" + strImg +
                    "<span sonid='" + trObjs[i].ID + "' parentid='" + trObjs[i].ParentID + "' class='tree-item normalNode'>" + trObjs[i].Name + "<span></td></tr>";
                }

                strTable += "</table>";

                option.$container[0].innerHTML = strTable;
            }
            else if (value == "N")
            {
                return alertMsg("初始化失败！");
            }
            else
            {
                option.$container[0].innerHTML = "<span id='NullSpan' class='promptmsg' sonid='Num' parentid='00000'>[注：不存在任何模块。]</span>";
            }

            that.init(option);
        });
};

//初始化树
DataTree.prototype.init = function (option)
{
    // 点击扩展图标是否一直刷新子集，默认刷新一次
    this.IsAllRefresh = option.IsAllRefresh || false;
    // 判断是否加载后自动点击第一个节点
    this.IsAutoClick = option.IsAutoClick === false ? false : true;
    //获取子集数据时提供的关键字
    this.dataAction = option.dataAction;

    //子集获取完成之后，指定的回调函数
    if (typeof option.getSonFun === "function")
    {
        this.getSonFun = option.getSonFun;
    }

    if (typeof option.linkFun === "function")
    {
        //设置回调函数
        this.linkFun = option.linkFun;
    }

    var that = this;
    this.$container.unbind("click");
    //事件委托
    this.$container.click(function (event)
    {
        if (event.target.tagName.toUpperCase() == "SPAN" && event.target.className)
        {
            if (event.target.className.indexOf("tree-item") != -1)
            {
                that.showItem.call(that, event.target, option);
            }
            else if (event.target.className.indexOf("img-collapse") != -1 || event.target.className.indexOf("img-expand") != -1)
            {
                that.showSon.call(that, event.target, option);
            }
        }
        event.stopPropagation();
    });


    if (option.prevSpanID && this.$container.find("span[sonid='" + option.prevSpanID + "']").length > 0)
    {
        this.$container.find("span[sonid='" + option.prevSpanID + "']").trigger("click");
    }
    else
    {
        if (this.IsAutoClick)
        {
            this.$container.find("span.tree-item:first").trigger("click");
        }
    }
};

// $tr为父级行；当存在指定了getSonFun回调行数时，需指定curSonid
DataTree.prototype.getSon = function ($tr, fn, curSonid, type, $parentSpan)
{
    var strPreTrID = $tr[0].id.substring(0, $tr[0].id.length - 3);
    var parentID = $tr.find(".tree-item")[0].sonid;
    var that = this;

    ajaxRequest(this.dataHref, { AjaxRequest: true, Type: this.dataAction, ParentID: parentID }, "html",
        function (value)
        {
            if (value != "")
            {
                var parentImgs = "";
                $tr.find(".span-icon").not(":last").each(function ()
                {
                    parentImgs += "<span class='" + this.className + "'></span>";
                });

                var trObjs = $.parseJSON(value);
                var strTrs = "";
                for (var i = 0, len = trObjs.length; i < len; i++)
                {
                    var strImg = parentImgs + (trObjs[i].PIsLS == "Y" ?
                        "<span class='span-icon img-blank'></span>" : "<span class='span-icon img-vline'></span>")

                    strImg += trObjs[i].IsLS == "Y" ?
                        (trObjs[i].IsHS == "Y" ? ("<span class='span-icon img-collapse-last'></span>") :
                        ("<span class='span-icon img-item-last'></span>")) :
                        (trObjs[i].IsHS == "Y" ? ("<span class='span-icon img-collapse'></span>") :
                        ("<span class='span-icon img-item'></span>"));

                    strTrs += "<tr id='" + strPreTrID + trObjs[i].OID + "'><td nowrap='nowrap'>" + strImg +
                    "<span sonid='" + trObjs[i].ID + "' parentid='" + trObjs[i].ParentID + "' class='tree-item normalNode'>" + trObjs[i].Name + "<span></td></tr>";
                }

                $tr.after(strTrs);

                if (typeof this.getSonFun === "function")
                {
                    that.getSonFun(curSonid);
                }

                if (typeof fn === "function")
                {
                    fn.call(that, curSonid, type, $parentSpan);
                }
            }
        }
    );
}

// obj:事件源,即点击的项；option是配置项
DataTree.prototype.showItem = function (obj, option)
{
    if (this.$prevSpan)
    {
        this.blur(this.$prevSpan[0]);
    }
    this.$prevSpan = $(obj);
    if (obj.sonid != "Num")
    {
        this.focus(this.$prevSpan[0]);
    }

    if (typeof this.linkFun == "function")
    {
        //执行回调函数
        this.linkFun.call(this, obj, option);
    }
};

// obj:事件源,即点击的图标；option是配置项
DataTree.prototype.showSon = function (obj, option)
{
    var $tr = $(obj).closest("tr");

    // 每次点击刷新子集
    if (this.IsAllRefresh)
    {
        if (!obj.collapse || obj.collapse && obj.collapse == "Y")
        {
            this.getSon($tr);
        }
        else
        {
            this.removeSon($tr[0].id);
        }
    }
    else
    {
        //第一次点击刷新
        if (!obj.isrefresh)
        {
            obj.isrefresh = "Y";
            this.getSon($tr);
        }
        //隐藏子集时保存子集下显示的tr
        else if (obj.collapse == "N")
        {
            $tr[0].visible = this.$container.find("tr[id^='" + $tr[0].id + ".']:visible");
            this.$container.find("tr[id^='" + $tr[0].id + ".']").hide();
        }
        //显示子集时显示隐藏前显示的TR
        else if (obj.collapse == "Y")
        {
            $tr[0].visible.show();
        }
    }

    //切换图标
    if (!obj.collapse || obj.collapse && obj.collapse == "Y")
    {
        this.imgExpand(obj);
    }
    else
    {
        this.imgCollapse(obj);
    }
}

//删除子集
DataTree.prototype.removeSon = function (parentTrID)
{
    this.$container.find("tr[id^='" + parentTrID + ".']").remove();
}

DataTree.prototype.focus = function (obj)
{
    $(obj).removeClass("normalNode").addClass("selNode");
}

DataTree.prototype.blur = function (obj)
{
    $(obj).removeClass("selNode").addClass("normalNode");
}

DataTree.prototype.imgExpand = function (obj)
{
    obj.collapse = "N";
    $(obj).removeClass("img-collapse").addClass("img-expand");
}

DataTree.prototype.imgCollapse = function (obj)
{
    obj.collapse = "Y";
    $(obj).removeClass("img-expand").addClass("img-collapse");
}

// 当前选中项，type:0时为新增同级，1时为新增子集, 2时修改或删除时
DataTree.prototype.addItemFun = function (type)
{
    var sonid = this.$prevSpan[0].sonid;
    var $parentSpan = this.$container.find("span.tree-item[sonid='" + this.$prevSpan[0].parentid + "']");
    if ($parentSpan.length == 1)
    {
        var $parentImg = $parentSpan.siblings().filter(".img-expand");
        if ($parentImg.length == 1)
        {
            this.removeSon($parentSpan.closest("tr")[0].id);
            this.getSon($parentSpan.closest("tr"), function (sonid, type, $parentSpan)
            {
                var $newSpan = this.$container.find("span.tree-item[sonid='" + sonid + "']");
                //找到当前项
                if ($newSpan.length == 1)
                {
                    this.focus($newSpan[0]);
                    this.$prevSpan = $newSpan;
                    if (type === 1)
                    {
                        this.removeSon($newSpan.closest("tr")[0].id);
                        this.getSon($newSpan.closest("tr"));
                        if ($newSpan.siblings().filter(".img-collapse").length === 1)
                        {
                            this.imgExpand($newSpan.siblings().filter(".img-collapse")[0]);
                        }
                    }
                    else if (type === 2)
                    {
                        if (typeof this.linkFun === "function")
                        {
                            this.linkFun(this.$prevSpan[0]);
                        }
                    }
                }
                //没有找到则选中它的上级
                else
                {
                    this.focus($parentSpan[0]);
                    this.$prevSpan = $parentSpan;
                    this.linkFun(this.$prevSpan[0]);
                }
            }, sonid, type, $parentSpan);
        }
    }
    else
    {
        this.dataTree(this.option);
    }
}
