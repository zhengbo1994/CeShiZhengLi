/*
* jQuery 验证库
* Version 1.0 (2012-5-22)
* @requires jQuery v1.3.2 or later*
* Example at: DEMO/ideaValidate.aspx
* author: Jeremy
* 3ks   : mwc

* 本库可以对页面中的表单元素进行验证，并对验证结果作出提示。
* 用法:
    html:--
    1、能被验证的元素，需要具有rule属性，可选具有message属性
    2、元素可以有多个验证规则，此时rule属性和message属性值需要以|分开,如
         <input type="text" id="txt1" rule="required|bigint" message="名称不能为空" />
       此时表示该元素要求不能为空，且输入数字。
       message以|拆分后，其长度可以小于rule的长度，它的值与rule一一对应，如果rule没有找到，
       则将使用$.ideaValidate.rules中定义的提示。
    3、元素可以分组验证，此时元素需要添加validateGroup属性，比如
         <input type="text" id="txt1" validateGroup="g1" rule="required|bigint" message="名称不能为空" />
       此时表示该元素在2个验证组：a:所有具有rule属性的元素组中; b: 验证组 g1中。
    4、元素可以具有名为custom的rule，此时，需要定义对应的规则属性：expr。如：
         <input type="text" id="txt1" rule="custom" expr="/^1|0$/" message="请选择两者中的一项" />

       特别注意 ：目前暂时只支持同一个元素，只有能一个custom规则。如果不够用，请参见下面js中的第5条说明
    js:--
    1：调用$.ideaValidate()，即可对页面中具有rule属性的元素进行验证
    2：调用$.ideaValidate({validateGroup:'g1'}),即可对页面中具有rule属性且validateGroup属性值为g1的元素进行验证
    3：$.ideaValidate(options),返回是否验证通过的boolean值
    4：$.ideaValidate(options),options中的batchAlert，如果设置为true时，将会对所有组中的元素验证，并将结果在所有验证完后给出提示。
       如果设置为false(默认值），则，只要碰到一个未验证通过的元素时，就会中断验证，将给出提示（该元素同时获得提示焦点）。
    5：$.ideaValidate.rules定义了一些默认的验证规则。它可以在页面中被扩充，方法是：
        $.extend($.ideaValidate.rules,{reg:'正则表达式',prompt:'未验证通过的提示'});
*/
(function ($)
{
    $.extend({
        ideaValidateMessages: [], //所有需要提示的结果信息都可以向此数组中丢。
        ideaValidateTip: function ()
        {
            if (null == this.ideaValidateMessages || this.ideaValidateMessages.length <= 0)
            {
                return true;
            }
            else
            {
                var tipMsg = '';
                $.each(this.ideaValidateMessages, function (index, str)
                {
                    if ($.trim(str).length > 0)
                    {
                        tipMsg += $.trim(str) + '\r\n';
                    }
                });
                this.ideaValidateMessages = [];
                return alertMsg(tipMsg);
            }
            return true; //默认情况下是通过验证的。
        }
    });

    //验证方法
    $.ideaValidate = function (options)
    {

        var settings = $.extend({}, $.ideaValidate.defaults, options);

        var container = settings.targetContainer ? $(settings.targetContainer) : $('body');

        var validatedElements = null; 	//只有含有rule标记的元素才纳入验证中
        if (!settings.validateGroup || settings.validateGroup.length <= 0)
        {
            // validatedElements = container.find(":not([validateGroup])[rule]");
            validatedElements = container.find("[rule]");
        }
        else
        {
            validatedElements = container.find("[validateGroup='" + settings.validateGroup + "'][rule]")
        }
        if (null == validatedElements || validatedElements.length <= 0)
        {
            return true; //没有找到，默认表示已通过验证
        }

        var ruleRepository = $.ideaValidate.rules;
        var batchAlert = settings.batchAlert; 	//是否使用批量提示
        var ruleCheck = true; 					//是否检查通过

        validatedElements.each(function ()
        {
            var me = $(this);
            var nodeName = this.nodeName.toLowerCase();
            var rules = me.attr('rule') ? me.attr('rule').split('|') : []; 	//规则集合,以|分开
            var messages = me.attr('message') ? me.attr('message').split('|') : []; //消息集合,以|分开，对应每一条规则
            var val = ((nodeName === "input" || nodeName === "select") ? me.val() : me.text()) || ''; //元素的值
            $.each(rules, function (i, rule)
            {
                var message = messages.length > i ? messages[i] : (ruleRepository[rule] ? ruleRepository[rule].prompt : '');

                if (rule == 'required')
                {
                    if (val.length <= 0)
                    {
                        ruleCheck = false;
                    }
                }
                else
                {
                    //获取验证正则
                    var reg = (rule == 'custom' ? (new RegExp(me.attr("expr") || "")) : ruleRepository[rule].reg);

                    // 检查数据格式是否正确
                    if (!(rule === undefined || val.length === 0 || rule.length === 0 || reg.test(val)))
                    {
                        ruleCheck = false;
                    }
                }

                if (!ruleCheck)
                {
                    if (batchAlert)
                    {
                        $.ideaValidateMessages.push(message);
                    }
                    else
                    {
                        me.focus();
                        alertMsg(message);
                        return false;
                    }
                }
            });

            //如果不使用批量提示的话，就中止循环，进行提示
            if (!batchAlert && !ruleCheck)
            { return false; }
        });

        return batchAlert ? $.ideaValidateTip() : ruleCheck;
    };

    $.ideaValidate.rules =
	{
	    "required": { reg: new RegExp(""), prompt: "不能为空" }, //必填项
	    "bit": { reg: /^1|0$/, prompt: "请选择两者中的一项" },   // 是非项
	    "char": { reg: /^[a-z]{1}$/, prompt: "请输入一个小写英文字母" }, // 单个小写字母
	    "CHAR": { reg: /^[A-Z]{1}$/, prompt: "请输入一个大写英文字母" },  // 单个大写字母
	    "Char": { reg: /^[a-zA-Z]{1}$/, prompt: "请输入一个英文字母" },   // 单个字母(不限制大小写)
	    "int": { reg: /^(-?[1-9]\d{0,10}|0)$/, prompt: "请输入数字" },    // 整型数字
	    "+int": { reg: /^([1-9]\d{0,10}|0)$/, prompt: "请输入正数" },    // 正整型数字
	    "-int": { reg: /^(-[1-9]\d{0,10}|0)$/, prompt: "请输入负数" },    // 负整型数字
	    "bigint": { reg: /^(-?[1-9]\d{0,20}|0)$/, prompt: "请输入数字" },  // 长整型数字
	    "+bigint": { reg: /^([1-9]\d{0,20}|0)$/, prompt: "请输入正数" },  // 正长整型数字
	    "-bigint": { reg: /^(-[1-9]\d{0,20}|0)$/, prompt: "请输入数字" },  // 负长整型数字
	    "float": { reg: /^-?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, prompt: "请输入实数" },  // 浮点数
	    "+float": { reg: /^[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, prompt: "请输入实数" },  // 正浮点数
	    "-float": { reg: /^-[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/, prompt: "请输入实数" },  // 负浮点数
	    "date": { reg: /^(\d{2,4}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)((0[1-9])|[1-9]|([1-2][0-9])|(3[0-1])))|(\d{2,4}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)([1-9]|(0[1-9])|([1-2][0-9])|(3[0-1]))(\s)(0|00|([0-1][0-9])|(2[0-3])):(0|00|([0-5][0-9])):(0|00|([0-5][0-9])))$/, prompt: "请选择日期" },    // 日期

	    // 用途模式
	    "currency": { reg: /^-?([1-9]{1}[0-9]{0,2}?(,[0-9]{3})*|0)(\.[0-9]*)?$/, prompt: "请输入正确的千分位数字" }, // 用于千分位数字，一般用于金额，如1,000.00或-1,000.00
	    "+currency": { reg: /^([1-9]{1}[0-9]{0,2}?(,[0-9]{3})*|0)(\.[0-9]*)?$/, prompt: "请输入正确的千分位正数数字" }, // 用于千分位正数数字，一般用于金额，如1,000.00
	    "-currency": { reg: /^-([1-9]{1}[0-9]{0,2}?(,[0-9]{3})*|0)(\.[0-9]*)?$/, prompt: "请输入正确的千分位负数数字" }, //用于千分位负数数字，一般用于金额，如-1,000.00
	    "year": { reg: /^\d{4}$/, prompt: "请输入正确的年份" }, // 年份
	    "username": { reg: /^[a-zA-Z]\w{2,19}$/, prompt: "填写 3-30 个英文字母、数字及下划线的组合字符，首字符必须为英文字母" },  // 用户名
	    "password": { reg: /^.{6,30}$/, prompt: "密码要求至少 6个 字符" },   // 密码
	    "email": { reg: /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$/, prompt: "邮箱地址输入错误" },  // E-Mail
	    "chinese": { reg: /^[\u4e00-\u9fa5]+$/, prompt: "请输入中文" },  // 中文
	    "url": { reg: /^(([a-zA-Z][\-a-zA-Z\d]+)\:\/\/)?([a-zA-Z\d]+\.)*?([a-zA-Z\-\d]+)\.([a-zA-Z]{2,6})(\:[\d]+)?(([\/][^\.\?]*)*?([\/][^\.\?]+?\.([^\.\?])+)?)?(\?([^\=]+?\=.*))?$/, prompt: "不正确的网址格式" },    // 网址
	    "cardid": { reg: /^(\d{15}|\d{18})$/, prompt: "身份证号码格式不正确" },  // 身份证号码
	    "telphone": { reg: /^1\d{10}$/, prompt: "手机号码格式不正确" },    // 手机号码
	    "officephone": { reg: /^(([+]?\d{2}\-?)?\d{3,4}\-?)?\d{7,8}( \d{1,5})?$/, prompt: "座机电话号码格式不正确，格式例子：<div>[+86-0755-]8636919[ 806]</div>中括号部分可选输入，分机号码前用空格隔开" },    // 办公电话

	    "custom": { reg: new RegExp(""), prompt: ""}    // 自定义，将读取元素的 expr 自定义属性作为正则表达式
	}

    // 默认配置
    $.ideaValidate.defaults = {
        validateGroup: '',  //可以按组搜索
        targetContainer: '',   //被验证的元素所在容器
        batchAlert: false 		 //是否批量提示，默认为false
    };

})(jQuery);