// 作者：张敏强
// 日期：2013-04-11
//控制方式设置
function DataTree()
{
}

//初始化树
DataTree.prototype.init = function (option)
{
    this.$linkFrame = option.$linkFrame;
    if (typeof option.linkFun == "function")
    {
        //设置回调函数
        this.linkFun = option.linkFun;
    }

    this.$container = option.$container || $("#div-content");
    if (this.$container.length > 0)
    {
        var that = this;
        //事件委托
        this.$container.click(function (event)
        {
            if (event.target.tagName.toUpperCase() == "SPAN")
            {
                that.showItem.call(that, event.target, option);
            }
            event.stopPropagation();
        });

        if (option.prevSpanID && this.$container.find("span[sonid='" + option.prevSpanID + "']").length > 0)
        {
            this.$container.find("span[sonid='" + option.prevSpanID + "']").trigger("click");
        }
        else
        {
            this.$container.find("span:first").trigger("click");
        }
    }
    else
    {
        return alertMsg("未找到匹配树容器元素！");
    }
};

// obj:事件源；option是配置项
DataTree.prototype.showItem = function (obj, option)
{
    if (this.$prevSpan)
    {
        this.$prevSpan.attr("class", "normalNode"); 
    }
    this.$prevSpan = $(obj);
    if (obj.sonid != "Num")
    {
        this.$prevSpan.attr("class", "selNode");
    }

    if (typeof this.linkFun == "function")
    {
        //执行回调函数
        this.linkFun.call(this, obj, option);
    }
};

var dataTree = new DataTree();

$(function ()
{
    var option = {
        $linkFrame: $("iframe"),
        linkFun: function (obj, opttions)
        {
            if (this.$linkFrame.length > 0)
            {
                this.$linkFrame[0].src = "VControlTypeMain.aspx?CTID=" + obj.sonid;
            }
        },
        $container: $("#div-content"),
        prevSpanID: ((typeof getParamValue("ID") != "undefined") ? getParamValue("ID") : null)
    };
    dataTree.init(option);

    var btnArray = [
    //新增同级
        {btnID: "btnAddSibling", btnFun: function ()
        {
            if (dataTree.$prevSpan[0].parentid)
            {
                openWindow("VControlTypeAdd.aspx?ID=" + dataTree.$prevSpan[0].parentid, 500, 280);
            }
        }
    },
    //新增子级
        {btnID: "btnAddSon", btnFun: function ()
        {
            if (dataTree.$prevSpan[0].sonid)
            {
                openWindow("VControlTypeAdd.aspx?ID=" + dataTree.$prevSpan[0].sonid, 500, 280);
            }
        }
    },
    //修改
        {btnID: "btnEdit", btnFun: function ()
        {
            if (dataTree.$prevSpan[0].sonid && dataTree.$prevSpan[0].sonid == "Num")
            {
                return alertMsg("不存在类别!");
            }
            else
            {
                openWindow("VControlTypeEdit.aspx?ID=" + dataTree.$prevSpan[0].sonid, 500, 280);
            }
        }
    },
    //删除
        {btnID: "btnDelete", btnFun: function ()
        {
            if (dataTree.$prevSpan[0].sonid && dataTree.$prevSpan[0].sonid == "Num")
            {
                return alertMsg("不存在类别!");
            }
            else
            {
                var isHasSon = dataTree.$container.find("span[parentid='" + dataTree.$prevSpan[0].sonid + "']").length > 0; //是否有子节点
                if (isHasSon)
                {
                    return alertMsg("请先删除该类别的子类别！");
                }
                var url = "/" + rootUrl + "/Common/Delete/VDeletePlatform.aspx?Action=ControlType&JQID=&NoFrame=true&ID=" + dataTree.$prevSpan[0].sonid;
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
    }
    ];

    $("body").click(function (event)
    {
        $.each(btnArray, function (i, value)
        {
            if (event.target.id == value.btnID)
            {
                value.btnFun.apply();
            }
        });
    });
});

//子页面调用此方法刷新页面
function reloadData()
{
    if (dataTree.$prevSpan[0].sonid != "Num")
    {
        window.location = window.location.href + "&ID=" + dataTree.$prevSpan[0].sonid;
    }
    else
    {
        window.location = window.location.href;
    }
}

