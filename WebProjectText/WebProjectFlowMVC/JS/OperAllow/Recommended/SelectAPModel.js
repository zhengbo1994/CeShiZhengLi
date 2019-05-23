// VSelectAPModel.aspx页面js
// 作者：张敏强 2014-07-13
var APModelPage = (function (win)
{
    function page()
    {
        this.win = win;
        this.url = "VSelectAPModel.aspx?IDAjax=true";
        // 模块刷新
        this.$ddlMod = null;
        // 选择并关闭
        this.$btnChooseClose = null;
        // 保存按钮
        this.$btnSave = null;
        // 页面取消
        this.$btnCancel = null;
        this.parentjqGridID = "jqGrid_Recommended";
        this.closeWindow = false;
        // 当前操作模块
        this.targetMod = {
            ModCheckBox: null,
            DefaultCheckBox: null
        };
        // 是否提交中
        this.bSaving = false;
        // 实时保存的更新数据
        this.UpdateData = {
            AddData: [],
            DeleteData: [],
            UpdateData: []
        };

        //初始化方法
        this.init = function (initOption)
        {
            if (typeof initOption !== "object")
            {
                return;
            }

            this.$btnChooseClose = initOption.$btnChooseClose || $("#btnChooseClose");
            this.$btnSave = initOption.$btnSave || $("#btnChoose");
            this.$btnCancel = initOption.$btnCancel || $("#btnCancel");
            this.$body = $("body");
            this.$divMPList = $("div[id$='divMPList']");
            this.$ddlMod = $("#ddlMod");
            var that = this;

            // 刷新模块
            this.$ddlMod.on("change", function ()
            {
                that.reloadAPModel.call(that);
            })

            // 模块项事件监听
            this.$body.on("click", ".mod-item", function ()
            {
                var $defaultCheckBox = $(this).closest("tr").find(".recommended-isdefault");
                that.targetMod.ModCheckBox = this;
                that.targetMod.DefaultCheckBox = $defaultCheckBox.length === 1 ? $defaultCheckBox[0] : null;

                // 保存原始值，以备判断当前模块的actiontype状态
                if (!$(this).attr("oldCheckState"))
                {
                    $(this).attr("oldCheckState", ($(this).attr("checked") === "checked" ? "N" : "Y"));
                }

                // 取消选中模块时取消默认显示
                if ($(this).attr("checked") !== "checked")
                {
                    $(that.targetMod.DefaultCheckBox).removeAttr("checked");
                }

                that.updateTargetModActionType.call(that);
            })

            // 模块名称点击
            this.$body.on("click", ".mod-name", function ()
            {
                var $modItem = $(this).closest("td").find(".mod-item");

                if ($modItem.length === 1)
                {
                    // click() 方法触发
                    $(this).closest("td").find(".mod-item")[0].click();
                }
            })

            // 是否默认显示时间
            this.$body.on("click", ".recommended-isdefault", function ()
            {
                var $modCheckBox = $(this).closest("tr").find(".mod-item");
                that.targetMod.ModCheckBox = $modCheckBox.length === 1 ? $modCheckBox[0] : null;
                that.targetMod.DefaultCheckBox = this;

                if (!$(this).attr("oldCheckState"))
                {
                    $(this).attr("oldCheckState", ($(this).attr("checked") === "checked" ? "N" : "Y"));
                }

                that.updateTargetModActionType.call(that);
            })

            // 保存数据
            this.$btnSave.on("click", function ()
            {
                if (that.bSaving)
                {
                    alert("数据保存中，请稍候……");
                    return false;
                }
                that.bSaving = true;

                that.getUpdateData.call(that);
                that.saveData.call(that);
            })

            // 页面取消
            this.$btnCancel.on("click", function ()
            {
                that.cancal.call(that);
            })

            this.$btnChooseClose.on("click", function ()
            {
                that.closeWindow = true;
                that.$btnSave[0].click();
            })

            this.reloadAPModel();
        }
    }

    // 异步刷新模块
    page.prototype.reloadAPModel = function ()
    {
        var that = this;

        $.ajax({
            url: this.url,
            data: {
                Action: "ReloadAPModel",
                RootModID: this.$ddlMod.val()
            },
            dataType: "json",
            success: function (data)
            {
                if (data.Success === "Y")
                {
                    that.$divMPList.html(data.Data);
                }
                else
                {
                    alert(data.Data)
                }
            },
            error: function (req, err, msg)
            {
                alert(msg);
            }
        });
    }

    // 获取更新数据
    page.prototype.getUpdateData = function ()
    {
        var that = this,
            $changeMod = $(".mod-item[actiontype]"),
        actionFun = {
            "A": function ()
            {
                var objRecommended = {
                    RecommendedID: this.value,
                    RecommendedType: "0",
                    DefaultDisplay: ($(this).closest("tr").find(".recommended-isdefault").attr("checked") === "checked" ? "Y" : "N"),
                    Aliases: $(this).closest("td").text()
                };

                that.UpdateData.AddData.push(objRecommended);
            },
            "D": function ()
            {
                that.UpdateData.DeleteData.push(this.value);
            },
            "U": function ()
            {
                var objRecommended = {
                    RecommendedID: this.value,
                    DefaultDisplay: ($(this).closest("tr").find(".recommended-isdefault").attr("checked") === "checked" ? "Y" : "N")
                };

                that.UpdateData.UpdateData.push(objRecommended);
            }
        };

        // 初始化为空
        that.UpdateData.AddData = [];
        that.UpdateData.DeleteData = [];
        that.UpdateData.UpdateData = [];

        $changeMod.each(function ()
        {
            var my = this;
            if (typeof actionFun[this.actiontype] === "function")
            {
                actionFun[this.actiontype].call(my);
            }
        })
    }

    // 更新当前菜单项状态actionType ：A :新增； D: 删除；U: 更新; O:初始状态
    page.prototype.updateTargetModActionType = function ()
    {
        var modCheck = this.targetMod.ModCheckBox,
            defaultCheck = this.targetMod.DefaultCheckBox,
            oldModCheckState = $(modCheck).attr("oldCheckState") ? $(modCheck).attr("oldCheckState") : ($(modCheck).attr("checked") === "checked" ? "Y" : "N"),
            newModCheckState = $(modCheck).attr("checked"),
            oldDefaultCheckState = $(defaultCheck).attr("oldCheckState") ? $(defaultCheck).attr("oldCheckState") : ($(defaultCheck).attr("checked") === "checked" ? "Y" : "N"),
            newDefaultCheckState = $(defaultCheck).attr("checked");

        // 模块选中值改变只有两种情况：删除或者新增
        if (oldModCheckState === "Y" && newModCheckState === undefined || oldModCheckState === "N" && newModCheckState === "checked")
        {
            $(modCheck).attr("actiontype", (newModCheckState === "checked" ? "A" : "D"));
        }
            // 模块选中值未改变且默认显示值改变
        else if (oldModCheckState === "Y" && newModCheckState === "checked"
            && (oldDefaultCheckState === "Y" && newDefaultCheckState === undefined ||
            oldDefaultCheckState === "N" && newDefaultCheckState === "checked"))
        {
            $(modCheck).attr("actiontype", "U");
        }
        else
        {
            $(modCheck).attr("actiontype", "O");
        }
    }

    // 保存数据
    page.prototype.saveData = function ()
    {
        var that = this;
        $.ajax({
            url: this.url,
            data: {
                Action: "UpdateRecommended",
                AddRecommended: $.jsonToString(this.UpdateData.AddData),
                DeleteRecommended: this.UpdateData.DeleteData.toString(),
                UpdateRecommended: $.jsonToString(this.UpdateData.UpdateData)
            },
            dataType: "json",
            success: function (data)
            {
                that.bSaving = false;
                alert(data.Data);

                // 刷新父页面
                that.refreshParentJQGrid.call(that);

                if (that.closeWindow)
                {
                    that.cancal.call(that);
                }
                // 还原初始状态，防止重复提交
                $(".mod-item[actiontype]").removeAttr("actiontype")
                    .removeAttr("oldCheckState");

                $("..recommended-isdefault").removeAttr("oldCheckState");
            },
            error: function (req, err, msg)
            {
                that.bSaving = false;
                alert(msg);
            },
            type:"POST"
        })

    }

    page.prototype.initModDefaultValue = function ()
    {

    }

    page.prototype.cancal = function ()
    {
        this.win.closeMe();
    }

    page.prototype.refreshParentJQGrid = function ()
    {
        if (this.win.opener)
        {
            try{
                this.win.opener.refreshJQGrid(this.parentjqGridID);
            }
            catch(e)
            {
                
            }
        }
    }

    return page;
})(window)

$(function ()
{
    var page = new APModelPage();
    page.init({});
})