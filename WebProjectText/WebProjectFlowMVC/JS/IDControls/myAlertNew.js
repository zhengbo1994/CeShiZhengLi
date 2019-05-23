/**
 * 表示提示框
 * 调用示例：
 *   1. MyAlert.show("提示信息"); // 显示提示信息
 *   2. MyAlert.show("read"); // 显示“读取中”提示类型
 *   3. MyAlert.show({id: "read", message:"数据读取中，请稍后。"});
 * hide()            隐藏提示框
 * show(@options)    {object|string|undefined}显示提示框，@options参数对象可重置提示框，也可为已初始化过的id，不传则为显示当前id
 *  参数 @options属性如下：
 *  {
 *      id:        {string}指定唯一ID，提供六种(read/save/calculate/config/run),支持添加其他类型，不指定时默认为red  
 *      message:        {string}提示信息
 *      title:          {string}提示标题
 *      isShowTitle:    {boolean}是否显示标题，true为显示，false为不显示，不指定时默认不显示
 *      btns:           {array}按钮数组对象[{name:"关闭",click:null}[,...]]，不指定时默认有[{name:"关闭",click:null}];
 *      isShowBtn:      {boolean}是否显示按钮区域，true为显示，false不显示，不指定时默认不显示
 *      icon:           {string}提示信息前标识图片
 *      width:          {number}提示框宽度
 *  }
 * isExists(id) 判断是否初始化过相应的id
 */
var MyAlert = (function ()
{
    var defaultConfig = {
        id: "reading",
        title: "提示",
        message: "操作中",
        // 默认大尺寸
        iconSize: "l",
        // 默认上下布局
        direction: "v",
        isShowBtn: false,
        isShowTitle: false,
        width: 450,
        btns: [{
            name: "关闭", click: function ()
            {
                myAlert.instance.hide();
            }
        }]
    };


    function myAlert()
    {
        // 是否初始化
        this._isInit = false;
        // 当前配置
        this._currentConfig = defaultConfig;
        this._defaultConfig = defaultConfig;

        // 默认的五种提示类型
        this._DD = {
            "reading": $.extend(true, $.extend(true, {}, defaultConfig), { id: "reading", message: "读取中" }),
            "r": $.extend(true, $.extend(true, {}, defaultConfig), { id: "reading", message: "读取中" }),
            "writing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "writing", message: "写入中" }),
            "w": $.extend(true, $.extend(true, {}, defaultConfig), { id: "writing", message: "写入中" }),
            "computing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "computing", message: "计算中" }),
            "c": $.extend(true, $.extend(true, {}, defaultConfig), { id: "computing", message: "计算中" }),
            "setting": $.extend(true, $.extend(true, {}, defaultConfig), { id: "setting", message: "配置中" }),
            "s": $.extend(true, $.extend(true, {}, defaultConfig), { id: "setting", message: "配置中" }),
            "executing": $.extend(true, $.extend(true, {}, defaultConfig), { id: "executing", message: "运行中" }),
            "e": $.extend(true, $.extend(true, {}, defaultConfig), { id: "executing", message: "运行中" })
        };
    }

    myAlert.prototype._init = function ()
    {
        // 构建html
        this._renderHtml();
        // 初始化事件
        this._bindEvent();
    }

    myAlert.prototype._renderHtml = function ()
    {
        var htmlTemplate = {
            backDrop: '<div class="alert-backdrop"></div>',
            alertWrap: '<div id="alertWrap" class="alert-wrap"><div class="alert-message-wrap">{$titleWrap}{$messageWrap}{$btnWrap}'
                    + '</div></div>',
            titleWrap: '<div class="alert-title-wrap">'
                    + '<button type="button" class="close"><span>×</span></button>'
                    + '<h4 class="alert-title"><a class="title-link" href="#"><span class="title-icon"></span></a></h4>'
                    + '</div>',
            messageWrap: '<div class="alert-direction-v"><div class="alert-message icon-reading-l"></div></div>',
            btnWrap: '<div class="alert-btn-wrap"></div>'
        };

        this.$contentBox = $(".frame-content-box").length === 0 ? $("body") : $(".frame-content-box");
        this.$contentBox.append($(htmlTemplate["backDrop"]));
        this.$contentBox.append($(htmlTemplate["alertWrap"].replace(/\{\$titleWrap\}/g, htmlTemplate["titleWrap"])
            .replace(/\{\$messageWrap\}/g, htmlTemplate["messageWrap"])
            .replace(/\{\$btnWrap\}/g, htmlTemplate["btnWrap"])));
    }

    // 设置定位父级
    myAlert.prototype._setPostionParent = function ()
    {
        this.contentBoxPos = this.$contentBox.css("position")

        if (!/relative|absolute/.test(this.contentBoxPos.toLowerCase()))
        {
            this.$contentBox.css("position", "relative");
        }
    }

    myAlert.prototype._origPositionParent = function ()
    {
        this.$contentBox.css("position", this.contentBoxPos);
    }

    myAlert.prototype._bindEvent = function ()
    {
        this.$backdrop = this.$contentBox.children("div.alert-backdrop");
        this.$alert = this.$contentBox.children("div.alert-wrap");
        this.$alertMessageWrap = this.$alert.children("div.alert-message-wrap");
        this.$titleWrap = this.$alert.find("div.alert-title-wrap");
        this.$title = this.$titleWrap.find("h4.alert-title");
        this.$message = this.$alert.find("div.alert-message");
        this.$btnsWrap = this.$alert.find("div.alert-btn-wrap");
        var that = this;

        this.$btnsWrap.bind("click", function (e)
        {
            var $target = $(e.target);
            if ($target.hasClass("btn-default"))
            {
                var $btns = that.$btnsWrap.find("input.btn-default");
                
                if ($btns.index(e.target) != -1)
                {
                    
                    var btn = that._currentConfig["btns"][$btns.index(e.target)];
                    if (typeof btn["click"] === "function")
                    {
                       
                        btn["click"]();
                        
                    }
                }

                that.hide();
            }
        });

        this.$titleWrap.bind("click", function (e)
        {
            if ($(e.target).hasClass("close"))
            {
                that.hide.call(that);
            }
        });
    }

    // 显示
    myAlert.prototype.show = function (options)
    {
        var top;
        if (!this._isInit)
        {
            this._init();
            this._isInit = true;
        }

        this._reset(arguments)
        this.$backdrop.show();
        this.$alert.show();

        top = ($(window).height() - this.$alertMessageWrap.height()) / 2;
        this.$alertMessageWrap.css({ "margin-top": top });
    }

    // 重新设置
    myAlert.prototype._reset = function (args)
    {
        var alertConfig,
            options = args[0];

        if (typeof options === "object")
        {
            alertConfig = this._DD[options.id];
            if (!alertConfig)
            {
                // 存在id添加新的提示类型，否则替换默认
                this._currentConfig = $.extend(true, $.extend(true, {}, this._defaultConfig), options);
            }
            else
            {
                this._currentConfig = $.extend(true, $.extend(true, {}, alertConfig), options);
            }
        }
        else if (typeof options === "string")
        {
            // 是提示类型，则取提示类型配置，否则默认为是提示信息
            if (this.isExists(options))
            {
                alertConfig = {};
                typeof args[1] === "string" ? alertConfig["message"] = args[1] : null;
                typeof args[2] === "string" ? alertConfig["iconSize"] = args[2] : null;
                typeof args[3] === "string" ? alertConfig["direction"] = args[3] : null;

                this._currentConfig = $.extend(true, $.extend(true, {}, this._DD[options]), alertConfig);
            }
            else
            {
                this._currentConfig = $.extend(true, $.extend(true, {}, this._DD["reading"]), { "message": options });
            }
        }

        // 重新渲染：标题、按钮、内容
        this._afreshRender();
    }

    // 重新渲染：标题、按钮、内容
    myAlert.prototype._afreshRender = function ()
    {
        var direction = {
            "h": "alert-direction-h",
            "horizontal": "alert-direction-h",
            "v": "alert-direction-v",
            "vertical": "alert-direction-v"
        }, iconSize = {
            "l": "l", // 默认为大尺寸128
            "m": "m", // 中等 90
            "s": "s",// 小 72
            "large": "l",
            "small": "s",
            "medium": "m"
        }, currentConfig = this._currentConfig;
        // 设置标题
        this.$title.html(currentConfig["title"]);
        // 设置提示信息
        this.$message.html(currentConfig["message"])
            .removeClass().addClass("alert-message icon-" + (currentConfig["id"] || "reading") + "-" + (iconSize[currentConfig["iconSize"] || "l"]))
            .parent().removeClass().addClass(direction[currentConfig["direction"] || "v"]);

        // 设置按钮
        this.$btnsWrap.html(this._generateBtnsHtml(currentConfig["btns"]));

        //设置定位基点元素 
        this._setPostionParent();


        currentConfig["isShowTitle"] ? this.$titleWrap.show() : this.$titleWrap.hide();
        currentConfig["isShowBtn"] ? this.$btnsWrap.show() : this.$btnsWrap.hide();
        this.$alertMessageWrap.css("width", currentConfig["width"]);
    }

    myAlert.prototype._generateBtnsHtml = function (btns)
    {
        var htmlTemplate = '<input type="button" class="btn-default" value="{$name}" />', btnsHtml = [];
        btns = btns;

        for (i = 0, len = btns.length; i < len; i++)
        {
            btnsHtml.push(htmlTemplate.replace(/\{\$name\}/g, btns[i]["name"]));
        }

        return btnsHtml.join("");
    }

    // 隐藏
    myAlert.prototype.hide = function ()
    {
        this.$alert.hide()
        this.$backdrop.hide();
        this._origPositionParent();
    }

    // 判断是否存在
    myAlert.prototype.isExists = function (id)
    {
        return typeof this._DD[id] !== "undefined";
    }

    myAlert.instance = new myAlert();
    return myAlert.instance;
}());