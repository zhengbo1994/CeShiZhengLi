// 简单tabs
var SimpleTabs = (function ()
{
    /**
    *  @param options {object}  初始化参数对象：
    *   {    
    *       @param container {object} tab容器，值为Dom对象
    *   }
    *  html实例如下：
    *   <div class="tabs">
    *       <ul class="tabs-list">
    *           <li class="list-active"><a>基本资料</a></li>
    *           <li><a>布局与主题</a></li>
    *       </ul>
    *       <div class="tabs-item">基本资料</div>
    *       <div class="tabs-item">布局与主题</div>
    *   </div>
    **/
    function SimpleTabs(options)
    {
        var that = this;
        options = options || {};
        this.tabActiveClass = options.tabActiveClass || "list-active";
        this.itemActiveClass = options.itemActiveClass || "item-active";
        this.container = options.container;
        if (!this.container)
        {
            return;
        }

        this.$container = $(this.container);
        this.$container.on("click", ".tabs-list>li", function ()
        {
            if (this === that.$currentTab[0])
            {
                return;
            }

            that._switchTabs(that.$currentTab, $(this));
        });

        this._$tabsList = this.$container.find(".tabs-list>li");

        this._$itemsList = this.$container.find(".tabs-item");

        this.index = (options.index && option.index < _$tabsList.length) || 0;

        this.$currentTab = this._$tabsList.eq(this.index);

        this._switchTabs(null, this.$currentTab);
    }

    // 切换选项卡
    SimpleTabs.prototype._switchTabs = function ($oldTab, $newTab)
    {
        if ($oldTab)
        {
            $oldTab.removeClass(this.tabActiveClass);
            this._$itemsList.eq(this._$tabsList.index($oldTab)).removeClass(this.itemActiveClass);
        }

        $newTab.addClass(this.tabActiveClass);
        this._$itemsList.eq(this._$tabsList.index($newTab)).addClass(this.itemActiveClass);
        this.$currentTab = $newTab;
    }

    return SimpleTabs;
})();

// 开关按钮
var SwtichButton = (function ()
{
    /**
    * 开关按钮
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param container {object}  容器，Dom对象
    *       @param state  {boolean}   初始值，默认为true
    *    }
    * html：<a id="switchDoem" class="switch-container">
    *           <i class="switch switch-open" title="启用">
    *               <input type="radio" name="rdoWelcome" class="radio-switch" value="Y" />
    *           </i>
    *           <i class="switch switch-close" title="禁用">
    *               <input type="radio" class="radio-switch" name="rdoWelcome" value="N" />
    *           </i>
    *       </a>
    **/
    function SwtichButton(options)
    {
        var that = this;
        options = options || {};

        this.container = options.container || null;
        this.state = typeof options.state === "boolean" ? options.state : true;
        this.callBack = options.callBack;

        if (!this.container)
        {
            return;
        }

        $(this.container).on("click", ".switch", function ()
        {
            that.switchState(!that.state);

            if (typeof that.callBack === "function")
            {
                that.callBack();
            }
        });

        // 初始化
        this.switchState(this.state);
    }

    // 切换状态：替换容器背景图片
    SwtichButton.prototype.switchState = function (bOpen)
    {
        if (bOpen)
        {
            $(this.container).removeClass("switch-state-open")
                .addClass("switch-state-close");
        }
        else
        {
            $(this.container).removeClass("switch-state-close")
                .addClass("switch-state-open");
        }

        this.setChecked(bOpen);
        this.setState(bOpen);
    };
    // 设置选中值
    SwtichButton.prototype.setState = function (bOpen)
    {
        this.state = bOpen;
    };
    // 获取选中值
    SwtichButton.prototype.getState = function ()
    {
        return this.state;
    }
    // 设置radio选中状态
    SwtichButton.prototype.setChecked = function (bOpen)
    {
        $(this.container).find(":radio[value='" + (bOpen ? "Y" : "N") + "']").attr("checked", "checked");
    }

    // 设置值和获取值
    SwtichButton.prototype.val = function (value)
    {
        if (typeof value === "boolean")
        {
            this.switchState(value);
        }
        else
        {
            return this.state;
        }
    }

    return SwtichButton;
})();

// 二选一按钮
var ChooseButtom = (function ()
{
    /**
    * 二选一按钮,如窗口模式
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param container    {object}  容器，Dom对象
    *       @param value        {string}   初始值
    *       @callBack           {function} 事件回调函数
    *    }
    * html：
    *   <a class="choose-container choose-state-left">
    *       <i class="choose choose-left choose-active">
    *           新窗口
    *           <input type="radio" class="radio-switch" name="rdoWindowMode" value="1" />
    *       </i>
    *       <i class="choose choose-right">
    *           对话框
    *           <input type="radio" class="radio-switch" name="rdoWindowMode" value="2" />
    *       </i>
    *   </a>
    **/
    function ChooseButtom(options)
    {
        var that = this;
        options = options || {};
        this.container = options.container || null;
        this.value = options.value || "0";
        this.callBack = options.callBack;
        this.$container = options.$container || null;

        this.$container = this.$container || $(this.container);
        this.container = this.container || this.$container[0];

        // 绑定选中事件
        this.$container.on("click", ".choose", function ()
        {
            var $choose = $(this);
            that.changeOptions($choose.find(":radio").val(), $choose.find(":radio"), $choose);

            if (typeof that.callBack === "function")
            {
                that.callBack();
            }
        });
        // 初始化选中值
        this.changeOptions(options.value);
    }

    // 改变选项
    ChooseButtom.prototype.changeOptions = function (value, $checkOption, $choose)
    {
        if (!$checkOption)
        {
            $checkOption = this.$container.find(":radio[value='" + value + "']");
        }

        if (!$choose)
        {
            $choose = $checkOption.parent();
        }

        this.$container.find(".choose-active").removeClass("choose-active");
        $checkOption.attr("checked", "checked")
        $choose.addClass("choose-active");

        if ($choose.hasClass("choose-left"))
        {
            this.$container.removeClass("choose-state-right")
                .addClass("choose-state-left");
        }
        else
        {
            this.$container.removeClass("choose-state-left")
                .addClass("choose-state-right");
        }

        this.setValue(value);
    };

    ChooseButtom.prototype.setValue = function (value)
    {
        this.value = value;
    };

    ChooseButtom.prototype.getValue = function ()
    {
        return this.value;
    };

    ChooseButtom.prototype.val = function (value)
    {
        if (typeof value === "string")
        {
            this.changeOptions(value);
        }
        else
        {
            return this.value;
        }
    }

    return ChooseButtom;
})();

// 图片展示选择（站点布局）
var ChooseImgs = (function ()
{
    /**
    * 图片展示选择,如窗口模式
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param container    {object}  容器，Dom对象
    *       @param value        {string}   初始值
    *       @callBack           {function} 事件回调函数
    *    }
    * html：
    *   <ul class="imgs-choose">
    *       <li class="choose-option option-active" value="1202322E-89A4-44F5-8FB1-B0F5762A8491">
    *           <div class="img-option-container">
    *               <img src="../../image/personalSetting/nav-default.png" alt="默认" class="img-option" />
    *               <div class="img-active-tag"></div>
    *           </div>
    *           <div>默认</div>
    *       </li>
    *       ...
    *   </ul>
    *   <div class="clear"></div>
    **/
    function ChooseImgs(options)
    {
        var that = this;
        options = options || {};
        this.container = options.container || {};
        if (!this.container)
        {
            return;
        }
        this.$container = $(this.container);
        this.value = options.value;
        this.callBack = options.callBack;
        this.change = options.change;

        this.$container.on("click", ".choose-option", function ()
        {
            that.setValue.call(that, $(this).attr("data-value"), $(this));

            if (typeof that.callBack === "function")
            {
                that.callBack.call(that);
            }
        });

        this.$container.on("mouseover", ".choose-option", function ()
        {
            
            $(this).addClass("choose-option-mouseover");
        });

        this.$container.on("mouseout", ".choose-option", function ()
        {
            $(this).removeClass("choose-option-mouseover");
        });

        this.setValue(this.value);
    }

    ChooseImgs.prototype.setValue = function (value, $chooseOption)
    {
        if (this.value === value)
        {
            return;
        }

        if (typeof $chooseOption === "undefined")
        {
            $chooseOption = this.$container.find("li[data-value='" + value + "']");

            if ($chooseOption.length === 0)
            {
                return;
            }
        }
        this.value = value;

        if (this.$currentOptions)
        {
            this.$currentOptions.removeClass("option-active");
        }
        this.$currentOptions = $chooseOption.addClass("option-active");

        if (typeof this.change === "function")
        {
            this.change();
        }
    }

    ChooseImgs.prototype.val = function (value)
    {
        if (typeof value === "string")
        {
            this.setValue(value);
        }
        else
        {
            return this.value;
        }
    }

    return ChooseImgs;
})();

// 提示框
var SimpleTip = (function ()
{
    var AlertType = {
        "sucess": {
            "background-color": "#c8e5bc",
            "border-color": "#b2dba1",
            "color": "#3c763d"
        },
        "info": {
            "background-color": "#b9def0",
            "border-color": "#9acfea",
            "color": "#31708f"
        },
        "warning": {
            "background-color": "#f8efc0",
            "border-color": "#f5e79e",
            "color": "#8a6d3b"
        },
        "danger": {
            "background-color": "#e7c3c3",
            "border-color": "#dca7a7",
            "color": "#a94442"
        }
    };

    var Point = {
        "right": { className: "tip-point-right", pointBorder: "border-left-color" },
        "left": { className: "tip-point-left", pointBorder: "border-right-color" },
        "top": { className: "tip-point-top", pointBorder: "border-bottom-color" },
        "bottom": { className: "tip-point-bottom", pointBorder: "border-bottom-color" }
    };

    /**
    * 图片展示选择,如窗口模式
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param alertType        {string} 指定AlertType属性，默认为"info"
    *       @param showTime         {number} 展示时间，过后隐藏 
    *       @param point            {string} 指定Point属性，默认“left”,暂时实现这种方式
    *       @param srouce           {object} 指定所属元素对象
    *    }
    * html：
    *   <div class='alert-tip'>
    *       <span class='tip-point'></span>
    *       <span class='tip-icon'></span>
    *       <span class='tip-message'></span>
    *   </div>
    **/
    function SimpleTip(options)
    {
        options = options || {};

        this.showTime = options.showTime || 0;
        this.timer = null;
        this.alertType = options.alertType || "info";
        this.message = options.message || "";
        this.point = options.point || "left";
        this.$container = $("<div class='alert-tip'><span class='tip-point'></span><span class='tip-icon'></span><span class='tip-message'></span></div>");
        this.$tipMessage = this.$container.find(".tip-message");
        this.srouce = options.srouce;
    }

    /**
    * options {top:0,left:0,alertType:"inof",message:"恭喜你"}
    **/
    SimpleTip.prototype.alertMsg = function (options)
    {
        if (options.showTime)
        {
            this.showTime = options.showTime;
        }
        else
        {
            this.showTime = 0;
        }
        this._setAlertType(options.type);
        this.setMessage(options.message || this.message);
        this.display();
        this._setOffset(options.top, options.left);
    }

    SimpleTip.prototype._setOffset = function (top, left)
    {
        if (top && left)
        {
            // 默认可设置视窗中间
            this.$container.css({ top: (top || 0), left: (left || 0) });
        }
        else
        {
            var pos = this._getOffset();

            this.$container.offset({ top: pos.top, left: pos.left });
        }
    }

    SimpleTip.prototype._getOffset = function ()
    {
        var pos = this.srouce.$container.offset();

        switch (this.point)
        {
            case "left":
                return { top: (pos.top - 5), left: (pos.left + this.srouce.$container.width() + 10) };
            case "right":
                return { top: (pos.top - 5), left: (pos.left + this.$container.width()) };
            case "top":
                return { top: (pos.top - 5 - this.srouce.$container.parent().height()), left: pos.left };
            case "bottom":
                return { top: (pos.top +5 + this.srouce.$container.height()), left: pos.left };
        }
    }

    SimpleTip.prototype._setAlertType = function (type)
    {
        var typeStyle = typeof AlertType[type] === "undefined" ?
            AlertType[this.type] : AlertType[type];
        var point = Point[this.point] ? Point[this.point] : Point["bottom"];

        // 设置tip方向
        this.$container.css(typeStyle)
            .find(".tip-point").addClass(point.className)
            .css(point.pointBorder, typeStyle["border-color"]);
    }

    SimpleTip.prototype.setMessage = function (message)
    {
        this.$tipMessage.text(message);
    }

    SimpleTip.prototype.display = function ()
    {
        var that = this;

        if (!this.showTime)
        {
            this.$container.show();
        }
        else
        {
            if (this.timer)
            {
                window.clearTimeout(this.timer);
            }
            this.$container.show();
            this.timer = window.setTimeout(function () { that.$container.hide() }, that.showTime);
        }
    }

    SimpleTip.prototype.hide = function ()
    {
        this.$container.hide();
    }

    return SimpleTip;
})();

// 输入框
var InputBox = (function ()
{
    /**
    * 文本输入框
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param container    {object}   inputDom对象
    *       @param defaultValue {string}   值为空时显示提示信息
    *       @param focus        {function} 绑定获得焦点事件
    *       @param blur         {function} 绑定失去焦点事件
    *       @param click        {function} 绑定点击事件
    *       @param enFormat     {function} 正则表达式验证成功执行格式化函数
    *       @param deFormat     {function} 正则表达式验证不成功执行解格式化函数
    *       @param keyUp        {function} 输入时验证通过则执行方法
    *       @param tip          {SimpleTip} 提示框对象
    *    }
    * 属性：
    *   data-default    {string} 设置显示提示信息，默认为 "点击开始编辑"
    *   data-regex      {string} 正则表达式字符串，对输入值验证
    *   data-alert      {string} 验证失败提示信息
    * html：
    *   <input type="text" class="text" data-default="点击开始编辑" data-alert="请输入正确办公电话。" data-regex="^0\d{2,3}-?\d{7,8}$" id="txtOfficePhone" />
    **/
    function InputBox(options)
    {
        var that = this;
        options = options || "";
        this.container = options.container;
        if (!this.container)
        {
            return;
        }
        this.$container = $(options.container);
        this.defaultValue = options.defaultValue || this.$container.attr("data-default") || "点击开始编辑";
        this.focus = options.focus;
        this.blur = options.blur;
        this.click = options.click;
        this.keyUp = options.keyUp;
        this.validateState = true;
        this.enFormat = options.enFormat;
        this.deFormat = options.deFormat;
        this.callBack = options.callBack;
        this.oldValue = "";

        this.$container.click(function ()
        {
            if (typeof this.click === "function")
            {
                that.click.call(that);
            }
        });

        this.$container.blur(function ()
        {
            if (!that.container.value || that.container.value === ""
                || that.container.value === that.defaultValue)
            {
                that.value = "";
                that.setDefaultStyle();
            }
            else
            {
                if(typeof that.deFormat === "function")
                {
                    that.deFormat.call(that);
                }

                that.value = that.container.value;
            }

            that.validate.call(that);

            if (that.validateState)
            {
                // 验证成功失去焦点，执行事件
                if (typeof that.blur === "function")
                {
                    that.blur.call(that);
                }

                // 有值且验证成功失去焦点，执行事件格式化
                if (that.value && typeof that.enFormat === "function")
                {
                    that.enFormat.call(that);
                }
            }
        });

        this.$container.focus(function ()
        {
            if (!that.value || that.value === ""
                || that.container.value === that.defaultValue)
            {
                that.clearDefaultStyle();
            }

            if (typeof that.focus === "function")
            {
                that.focus.call(that);
            }

            if (that.$container.attr("data-regex") && that.value &&
                that.validateState && typeof that.enFormat === "function")
            {
                that.enFormat.call(that);
            }
            else if (typeof that.deFormat === "function")
            {
                that.deFormat.call(that);
            }

            if (that.value)
            {
                var range = that.container.createTextRange(); //建立文本选区
                range.moveStart('character', that.container.value.length); //选区的起点移到最后去
                range.collapse(true);
                range.select();
            }
        });

        this.$container.keyup(function ()
        {
            if (!that.container.value || that.container.value === ""
                || that.container.value === that.defaultValue)
            {
                that.value = "";
                //that.setDefaultStyle();
            }
            else
            {
                if(typeof that.deFormat === "function")
                {
                    that.deFormat.call(that);
                }

                that.value = that.container.value;
            }

            that.validate.call(that);

            if (that.validateState)
            {
                // 验证表达式通过则格式化
                if (that.$container.attr("data-regex") && that.value && typeof that.enFormat === "function")
                {
                    that.enFormat.call(that);
                }

                if (typeof that.keyUp === "function")
                {
                    that.keyUp.call(that);
                }
            }
            else if(typeof that.deFormat === "function")
            {
                that.deFormat.call(that);
            }

            event.returnValue = false;
        });

        this.setValue(options.value || "");
        // 有提示信息
        if (this.$container.attr("data-alert"))
        {
            this.tip = new SimpleTip({ srouce: this, point: "bottom"});
            this.$container.after(this.tip.$container);
        }
    }

    InputBox.prototype.validateInputValue = function ()
    {
        var dataReg = this.$container.attr("data-regex");
        if (dataReg)
        {
            var reg = new RegExp(dataReg);
            var inputValue = this.$container.val();
            if (inputValue && inputValue !== this.defaultValue)
            {
                if (reg.test(inputValue))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        return false;
    }

    InputBox.prototype.validate = function ()
    {
        var dataReg = this.$container.attr("data-regex");
        if (dataReg)
        {
            var reg = new RegExp(dataReg);

            if (this.value && !reg.test(this.value))
            {
                if(this.tip)
                {
                    this.tip.alertMsg({ type: "warning", message: this.$container.attr("data-alert"), showTime: 3600 });
                }
                this.validateState = false;
                return false;
            }
            else
            {
                this.tip && this.tip.hide();
            }
            this.validateState = true;
            return true;
        }
    }

    InputBox.prototype.setDefaultStyle = function ()
    {
        this.$container.addClass("text-default")
            .val(this.defaultValue);
    };

    InputBox.prototype.clearDefaultStyle = function ()
    {
        this.$container.removeClass("text-default")
            .val("");
    }

    InputBox.prototype.setValue = function (value)
    {
        this.value = value;
        if (!this.value)
        {
            this.setDefaultStyle();
        }
        else
        {
            this.clearDefaultStyle();
            this.$container.val(value);
        }
        this.oldValue = this.value;
    };

    InputBox.prototype.getValue = function ()
    {
        return this.value;
    }

    InputBox.prototype.val = function (value)
    {
        if (typeof value === "string")
        {
            this.setValue(value);
        }
        else
        {
            return this.value;
        }
    }

    return InputBox;
})();

// 输入框组：手机号码
var InputBoxGroup = (function ()
{
    /**
    * 输入框组
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param container    {object}   inputDom对象
    *       @param defaultValue {string}   值为空时显示提示信息
    *       @param focus        {function} 绑定获得焦点事件
    *       @param blur         {function} 绑定失去焦点事件
    *       @param click        {function} 绑定点击事件
    *       @param enFormat     {function} 正则表达式验证成功执行格式化函数
    *       @param deFormat     {function} 正则表达式验证不成功执行解格式化函数
    *       @param keyUp        {function} 输入时验证通过则执行方法
    *       @param tip          {SimpleTip} 提示框对象
    *       @param parentID     {string} 组对象
    *    }
    * 多个InputBox组成，当输入框输入满足条件数据时自动新增一个InputBox。
    *   
    **/
    function InputBoxGroup(options)
    {
        this.container = options.container;
        var that = this;
        if (!this.container)
        {
            return;
        }

        var originalBlur = options.blur;
        options.blur = function ()
        {
            if (this.value && this.validateState && that._isEnabledAdd())
            {
                $(this.container).closest("li").after(that._getInputHtml());

                that.options.container = document.getElementById(that.parentID + "" + that.index);
                that._add(that.parentID + "" + that.index.toString(), new InputBox(that.options));
            }
            else if (!this.value)
            {
                that._remove($(this.container).attr("id"));
            }

            if (typeof originalBlur === "function")
            {
                originalBlur.call(this);
            }
        };

        var originalKeyUp = options.keyUp;
        options.keyUp = function ()
        {
            if (this.value && this.validateState && that._isEnabledAdd())
            {
                $(this.container).closest("li").after(that._getInputHtml());

                that.options.container = document.getElementById(that.parentID + "" + that.index);
                that._add(that.parentID + "" + that.index.toString(), new InputBox(that.options));
            }
            //else if (!this.value)
            //{
            //    that._remove($(this.container).attr("id"));
            //}

            if (typeof originalKeyUp === "function")
            {
                originalKeyUp.call(this);
            }
        };

        this.options = options;
        this.options.blur = options.blur;
        this.parentID = $(this.container).attr("id");
        this.collection = {};
        this.collection[this.parentID] = (new InputBox(options));
        this.template = [];
        this.index = 1;
        this.count = 1;
    }

    InputBoxGroup.prototype._getInputHtml = function ()
    {
        var inputTemplate = [];
        this.index += 1;

        inputTemplate.push("<li>");
        inputTemplate.push("<div class='form-group-position'>");
        inputTemplate.push("<div class='form-input-container col-ml-120'>");
        inputTemplate.push("<input id='" + (this.parentID + "" + this.index) + "' data-default='新增更多电话' type='text' class='form-input' data-alert='请输入正确移动电话。' data-regex='^0?1[3|4|5|8][0-9]\\d{8}$' />");
        inputTemplate.push("</div>");
        inputTemplate.push("</div>");
        inputTemplate.push("</li>");

        return inputTemplate.join("");
    }

    InputBoxGroup.prototype._isEnabledAdd = function ()
    {
        for (var inputBox in this.collection)
        {
            if (!this.collection[inputBox].val())
            {
                return false;
                break;
            }
            else if (this.collection[inputBox].val() && !this.collection[inputBox].validateState)
            {
                return false;
                break;
            }
        }

        return true;
    }

    InputBoxGroup.prototype._isEnableRemove = function ()
    {
        var enableEditCount = 0;
        for (var inputBox in this.collection)
        {
            if (!this.collection[inputBox].val())
            {
                enableEditCount += 1;
            }
            else if (this.collection[inputBox].val() && !this.collection[inputBox].validateState)
            {
                enableEditCount += 1;
            }

            if (enableEditCount > 1)
            {
                return true;
            }
        }

        return false;
    }

    InputBoxGroup.prototype._add = function (id, inputBox)
    {
        this.collection[id] = inputBox;
        this.count = this.count + 1;
    }

    InputBoxGroup.prototype._remove = function (id)
    {
        if (id === this.parentID)
        {
            return;
        }

        if (this.count == 2)
        {
            return;
        }

        if (this.collection[id] && this._isEnableRemove())
        {
            $(this.collection[id].container).closest("li").remove();
            delete this.collection[id];
            this.count = this.count - 1;
        }
    }

    InputBoxGroup.prototype._getValue = function ()
    {
        var valArray = [];
        for (var inputBox in this.collection)
        {
            if (this.collection[inputBox].val())
            {
                valArray.push(this.collection[inputBox].val());
            }
        }

        return valArray.join(",");
    }

    InputBoxGroup.prototype._setValue = function (value)
    {
        var valueArray = value.split(",");

        // 删除除了父
        for (var id in this.collection)
        {
            if (this.collection[id] && this.parentID !== id)
            {
                delete this.collection[id];
            }
        }

        // 赋值给父
        this.collection[this.parentID].val(valueArray[0]);
        this.collection[this.parentID].$container.trigger("blur");

        // 初始化其他值
        for (var i = 1; i < valueArray.length; i++)
        {
            var sibling = this.collection[this.parentID + "" + this.collection.index] || this.collection[this.parentID];
            
            $(sibling.container).closest("li").after(this._getInputHtml());
            this.options.container = document.getElementById(this.parentID + "" + this.index);
            var inputBox = new InputBox(this.options);
            inputBox.val(valueArray[i]);
            inputBox.$container.trigger("blur");

            this._add(this.parentID + "" + this.index, inputBox);
        }
    }

    InputBoxGroup.prototype.val = function (value)
    {
        if (typeof value === "undefined")
        {
            return this._getValue();
        }
        else if(typeof value === "string" && value)
        {
            this._setValue(value);
        }
    }

    InputBoxGroup.prototype.validate = function ()
    {
        var result = true;

        for (var inputID in this.collection)
        {
            if (!this.collection[inputID].validate() && result)
            {
                result = false;
            }
        }

        return result;
    }

    return InputBoxGroup;
})();

// 提示框
var PromptDialog = (function ()
{
    var templateHtml = [];
    templateHtml.push("<div class='prompt-dialog'>");
    templateHtml.push("<div class='prompt-dialog-panel'>");
    templateHtml.push("<input class='prompt-dialog-close' type='button' value='关闭' />");
    templateHtml.push("<span class='prompt-dialog-icon'></span>");
    templateHtml.push("<span class='prompt-dialog-message'></span>");
    templateHtml.push("</div>");
    templateHtml.push("</div>");

    var PromptType = {
        "success": {
            "background-color": "#c8e5bc",
            "border-color": "#b2dba1",
            "color": "#3c763d"
        },
        "info": {
            "background-color": "#b9def0",
            "border-color": "#9acfea",
            "color": "#31708f"
        },
        "warning": {
            "background-color": "#f8efc0",
            "border-color": "#f5e79e",
            "color": "#8a6d3b"
        },
        "danger": {
            "background-color": "#e7c3c3",
            "border-color": "#dca7a7",
            "color": "#a94442"
        }
    };

    /**
    * 提示框
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param showTime     {number}   提示框显示时间，0为一直显示
    *       @param bottom       {number}   提示框距离底边位置
    *       @param promptType   {string}   提示类型, 为PromptType属性, 默认为success 
    *    }
    * html：
    *   <div class="prompt-dialog">
    *       <div class='prompt-dialog-panel'>
    *           <input class="prompt-dialog-close" type="button" value="关闭" />
    *           <span class='prompt-dialog-icon'></span>
    *           <span class='prompt-dialog-message'>保存成功。</span>
    *       </div>
    *   </div>
    **/

    function PromptDialog(options)
    {
        options = options || {};

        this.templateHtml = templateHtml.join("");
        this.$container = $(this.templateHtml);

        this.showTime = options.showTime || 0;
        this.timer = null;
        this.bottom = options.bottom || 40;
        this.promptType = "success";
        this.$promptMessage = this.$container.find(".prompt-dialog-message");
        this.$promptDialogPanel = this.$container.find(".prompt-dialog-panel");

        $("body").append(this.$container);
    }

    PromptDialog.prototype.show = function (options)
    {
        options = options || {};
        this._setOffset(options.bottom || this.bottom);
        this._setPromptType(options.promptType);
        this._setMessage(options.message);
        this.showTime = options.shwoTime || options.showTime;
        this._display();
    }

    PromptDialog.prototype._setOffset = function (bottom)
    {
        this.$container.css("bottom", bottom);
    }

    PromptDialog.prototype._setPromptType = function (promptType)
    {
        var typeStyles = PromptType[promptType] || PromptType["success"];

        this.$promptDialogPanel.css(typeStyles);
    }

    PromptDialog.prototype._setMessage = function (msg)
    {
        this.$promptMessage.text(msg)
    }

    PromptDialog.prototype._display = function ()
    {
        var that = this;
        this.$container.fadeIn("slow");

        if (this.showTime)
        {
            if (this.timer)
            {
                window.clearTimeout(this.timer);
            }

            this.timer = window.setTimeout(function ()
            {
                that.$container.fadeOut("slow");
            }, that.showTime);
        }
    }

    return PromptDialog;
})();

// 视图模型：获取提交数据
var ViewModel = (function ()
{
    function ViewModel()
    {
    }

    ViewModel.ajax = function (url, callBack, data)
    {
        var that = this;
        try
        {
            $.ajax({
                url: url,
                data: (data || {}),
                dataType: "json",
                success: function (data)
                {
                    if (typeof callBack === "function")
                    {
                        callBack.call(that, data);
                    }
                },
                error: function (req, err, msg)
                {
                    document.location = "../../Home/VTimeOut.htm";
                }
            });
        }
        catch (ex)
        {
            throw ex;
        }
    }

    return ViewModel;
})();

// 页面对象
var WebPage = (function ()
{
    var controlClass = {
        "tabs-list": ""
    };
    /**
    * 页面对象
    * *  @param options {object}  初始化参数对象，主要参数如下：
    *    { 
    *       @param init         {function} 初始化函数
    *       @param loadCallBack {function} 数据加载完成之后执行函数
    *       @param loadUrl      {string} 获取数据地址，若指定，则创建实例时加载页面
    *       @param loadData     {join} 异步加载的data
    *       @param submitUrl    {string} 提交地址
    *       @param submitData   {join} 提交时data
    *       @param submitCallBack  {function} 提交成功时执行函数
    *       @param validate     {function} 提交时验证函数
    *       @param submitState  {boolean} 提交状态：true:成功;false:失败
    *    }
    * 事件：
    *   指定了loadUrl参数，则创建实例时加载页面
    *   keydown事件，如果指定了submitUrl参数，将触发提交数据
    * html：
    *   <input type="text" class="text" data-default="点击开始编辑" data-alert="请输入正确办公电话。" data-regex="^0\d{2,3}-?\d{7,8}$" id="txtOfficePhone" />
    **/
    function WebPage(options)
    {
        options = options || {};
        this.init = options.init;
        this.loadCallBack = options.load;
        this.loadUrl = options.loadUrl;
        this.loadData = options.loadData;
        this.submitUrl = options.submitUrl
        this.submitData = options.submitData;
        this.submitCallBack = options.submit
        this.validate = options.validate
        this.submitState = true;

        this.viewModel = ViewModel;
        this.bootstrapper();
    }

    WebPage.prototype.produceControl = function ()
    {

    }

    // 绑定事件和初始化
    WebPage.prototype.bootstrapper = function ()
    {
        var that = this;

        $("body").on("keydown", function ()
        {
            //keyCode=13是回车键
            if (event.keyCode == "13")
            {
                if (typeof that.validate === "function")
                {
                    if (!that.validate.call(that))
                        return false;
                }

                // 提交数据
                that.submit.call(that);

                event.keyCode = 9;
                event.returnValue = false;
            }
        });

        if (typeof this.init === "function")
        {
            this.init.call(this);
        }

        this.load();
    }

    WebPage.prototype.load = function ()
    {
        try
        {
            if (typeof this.loadUrl === "string")
            {
                var postData = typeof this.loadData === "function" ? this.loadData() : this.loadData;
                this.viewModel.ajax.call(this, this.loadUrl, this.loadCallBack, postData);
            }
        }
        catch (e)
        {
            alert(e);
            document.location = "../../Home/VTimeOut.htm";
        }
    }

    WebPage.prototype.submit = function ()
    {
        try
        {
            if (this.submitUrl)
            {
                if (typeof this.validate === "function" && !this.validate())
                {
                    return false;
                }

                var postData = typeof this.submitData === "function" ? this.submitData() : this.submitData;

                this.viewModel.ajax(this.submitUrl, this.submitCallBack, postData);
            }
        }
        catch (e)
        {
            alert(e);
            document.location = "../../Home/VTimeOut.htm";
        }
    }

    return WebPage;
})();