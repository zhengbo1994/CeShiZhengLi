// 首页Logo4.aspx中用到的js

/**
 * 表示top页
 * param win 当前页面window对象
*/
var Page = (function (win)
{
    function page()
    {
        this.ReLoginWork = null; // 最后执行page.relogin所传aim参数
        this.topWindow = win.top;
        this.logoutPage = "Logout.aspx"; // 退出页面
        this.remindWorks = new Page.RemindWorks(); // 待办实例
        this.onLine = new Page.OnLine(); // 在线人数实例
        this.win = win; // 当前页面window
        this.accountID = "";
        this.$topBody = $("body", parent.document);
        this.$funcbar = $(".function-bar");
        this.publishCompany = $("#hidPublishCompany").val();
        this.SilverPageInstance = null;  // Index4.aspx页面的SilverPage实例
        this.vm = null; //数据源
    }

    /**
    * 执行当前页面内容初始化
    * 
    * @param silverPageInstance    {object} window.parent.SilverPage实例
    */
    page.prototype.init = function (silverPageInstance)
    {
        if (typeof silverPageInstance !== "object" || !(silverPageInstance instanceof this.topWindow.SilverPage))
        {
            return;
        }

        this.SilverPageInstance = silverPageInstance;
        this.vm = silverPageInstance.vm.vm;
        // 待办初始化 
        this.remindWorks.init(this.vm);
        // 在线人数
        this.onLine.init(this.vm);

        this.accountID = $("#hidAccountID").val();

        //页面第一次加载，需手动单点登录，后续按延迟时间单点登录
        page.prototype.ssoLoginSmartBi();

        var that = this;

        //退出
        this.$topBody.on("click", ".go-exit", function ()
        {
            that.logout.call(that);
        }).on("contextmenu", ".go-exit", function ()
        {
            that.relogin.call(that, 0);
            return false;
        });

        //系统在线人数
        this.$topBody.on("click", ".show-online-counter", function ()
        {
            that.onLine.showOnline.call(that.onLine);
        });

        //显示待办工作
        this.$funcbar.on("click", ".show-wait-working", function ()
        {
            that.remindWorks.showNews.call(that.remindWorks);
        });

        // 中铁建工首页logo菜单字体颜色为黑色 add by zhangmq 20141120
        if (this.publishCompany == "ZTSZTZ")
        {
            this.$topBody.find("a").css("color", "#000").end().
                find("i").css("color", "#f53a0a");
        }

        //系统管理员
        this.$funcbar.on("dblclick", ".logo-admin", function ()
        {
            if (that.vm.Data.IsIdeaAdmin === "Y" && $(this).attr("url"))
            {
                that.SilverPageInstance.contentFrame.direct($(this).attr("url")); 
            }
        });
    }

    /**
     * 重登陆
     * 
     * @param aim    {number} 0:停止获取待办数和在线人数；1：停止获取待办；2：停止获取在线人数
    */
    page.prototype.relogin = function (aim)
    {
        if (aim == 0 || aim == 1)
        {
            this.win.clearTimeout(this.onLine.onLineTimer);
        }
        if (aim == 0 || aim == 2)
        {
            this.win.clearTimeout(this.remindWorks.waitWorkTimer);
        }

        this.ReLoginWork = aim;
        this.win.status = "与站点的连接中断，正在重新登录……";

        var that = this;
        
        $.ajax({
            url: "FillData.ashx?Action=ReLogin&IDAjax=true&AccountID=" + this.accountID,
            dataType: "text",
            success: function (data)
            {
                that.afterReLogin.call(that, data);
            },
            error: function (req, err, msg)
            {
                that.relogin.call(that, 0);
            }
        });
    };

    /**
     * 重新登录成功后执行
     * 
     * @param aim    {number} 0:停止获取待办数和在线人数；1：停止获取待办；2：停止获取在线人数
    */
    page.prototype.afterReLogin = function (data)
    {
        if (data == "Y")
        {
            window.status = "登录成功";
            window.setTimeout("window.status=''", 5000);

            switch (this.ReLoginWork)
            {
                case 0:
                    this.onLine.getOnlineCount.call(this.onLine);
                    this.remindWorks.getWaitWorkCount.call(this.remindWorks);
                    break;
                case 1:
                    this.onLine.getOnlineCount.call(this.onLine);
                    break;
                case 2:
                    this.remindWorks.getWaitWorkCount.call(this.remindWorks);
                    break;
            }

            this.topWindow.setTimeout('vun(1)', 20000);
        }
        else
        {
            alert(data);
        }
    }

    /**
     * 退出
     * 
     * @param bKicked    {bool}
     * @param kickIP     {string}
    */
    page.prototype.logout = function (bKicked, kickIP)
    {
        this.topWindow.location = this.logoutPage + (bKicked ? "?Kicked=1&KickIP=" + kickIP : "");
    }

    /**
     * smartBI单点登录
     * 每4分钟单点访问smartbi主页，解决门户集成smartbi报clientID错误的问题
     * @param bKicked    {bool}
     * @param kickIP     {string}
    */
    page.prototype.ssoLoginSmartBi = function ()
    {

        $.ajax({
            url: "FillData.ashx?Action=SSOLoginSmartBi&IDAjax=true",
            dataType: "json",
            success: function (data)
            {
                if (data && data.Success == "Y")
                {
                    //http://172.56.1.33:18080/sapibi/vision/index.jsp?user=biuser&password=biuser&jsoncallback=?
                    var url = data.Data.replace("openresource", "index") + "&jsoncallback=?";
                    $.getJSON(url, function (json)
                    {
                        //window.setTimeout(function () { alert(123); page.prototype.ssoLoginSmartBi(); }, 2000);
                    });
                    window.setTimeout(function () { page.prototype.ssoLoginSmartBi(); }, 240000);
                }
            },
            error: function (req, err, msg)
            {
                window.setTimeout(function () { page.prototype.ssoLoginSmartBi(); }, 240000);
            }
        });
        
    }

    page.instance = void 0;

    return page;
})(window);

/**
 * 表示待办提醒 参考Remind1.js
*/
Page.RemindWorks = (function (originalRemindworks, define, win)
{
    function remindWorks()
    {
        this.originalRemindworks = originalRemindworks;
        this.remindWorks = this.cloneOriginalRemindWorks(); // 每次设置待办将克隆workname.js中的变量remindWorks
        this.remindDefine = define; //引用workname.js中的变量remindDefine
        //上一次更新待办时获取的数据缓存
        this.arrOldWork = [];

        //当前用户是否是第一次获取待办（登录、刷新页面都视为第一次，而每隔一段时间获取的不算第一次）
        //如果是第一次获取，则不能允许出现new图标、弹出提示等。
        this.isFirstGet = "Y"; //

        //使用序列/反序列化的形式存储，避免“对象引用“。
        this.remindWorkAdapter = "";

        this.count = 0;
        this.height = 36;
        this.isShowPopupMsg = "N";
        this.getWaitWorkTime = 30000; //
        this.isSoundRemind = "N";
        this.$remindElement = null; //待办设置
        this.sysTitle = ""; // string.Format("{0}({1})-{2}", user.EmployeeName, user.DefaultDeptName, CommonFuns.GetSysConfig("SysName"));
        this.replaceTitle = "";
        this.vm = void 0;
        this.topWindow = win.parent;
        this.win = win;
        this.page = void 0;


        //观察者列表，当待办有更新时，当通知所有的观察者进行刷新等动作。
        this.remindObservers = [];
    }

    /**
      * 表示待办提醒 
      *
      * @param  vm     {object}  SilverPage实例数据源
    */
    remindWorks.prototype.init = function (vm)
    {
        this.vm = vm;
        var waitConfig = vm.Data;
        if (waitConfig)
        {
            this.sysTitle = $("#hidSysTitle").val(); // 窗口标题
            this.setSysTitle(this.topWindow); // 设置系统标题
            // 获取待办事件间隔
            this.getWaitWorkTime = parseInt(waitConfig.GetWaitWorkTime, 10) > this.getWaitWorkTime ? parseInt(waitConfig.GetWaitWorkTime, 10) : this.getWaitWorkTime;
            this.isSoundRemind = waitConfig.IsSoundRemind || "N"; // 是否新待办声音提醒
            this.$hidWaitWork = $("#hidWaitWork");//(new Function("return " + waitConfig.WaitWork))() || null; // 最新的待办明细
            this.$remindElement = $(".show-wait-working"); // 显示待办元素
            this.remindElementIco = this.$remindElement.css("background-image"); // 待办元素背景，以备闪烁显示

            this.isShowPopupMsg = waitConfig.IsShowPopupMsg; // 是否滑窗显示
            this.page = Page.instance; //当前页面实例，以备引用相关对象方法

            // 初始化待办
            this.setWaitWork(0, this.$hidWaitWork.val());
            // 设置闪烁标题，以备新待办时替换显示
            this.setReplaceTitle();
            var that = this;
            // 间隔获取
            this.waitWorkTimer = window.setTimeout(function () { that.getWaitWorkCount.call(that) }, that.getWaitWorkTime); 
        }
    }

    //克隆原始对象，每次设置待办提醒需重新获取
    remindWorks.prototype.cloneOriginalRemindWorks = function ()
    {
        return (typeof this.originalRemindworks === "object") ? $.extend(true, this.originalRemindworks) : null;
    }

    /**
   * 设置待办工作（分析待办数目、弹出待办显示等）
   * @param from 0:Logo/1:待办(待阅)工作
   * @param strNewWork 当前获取的待办数目，格式｛WorkCount:***,'ShowWaitDo':boolean,'ShowWaitRead':boolean}
   */
    remindWorks.prototype.setWaitWork = function (from, strNewWork)
    {
        if (typeof strNewWork !== "string" || !strNewWork)
        {
            return;
        }

        this.waitWork = (new Function("return " + strNewWork))() || null;
        if (!this.waitWork)
        {
            return;
        }

        this.remindWorks = this.cloneOriginalRemindWorks();
        if (!this.remindWorks)
        {
            return;
        }

        this.remindWorks.IsFirstGet = this.isFirstGet == "Y";
        this.isFirstGet = "N";
        this.arrOldWork = this.arrNewWork || [];
        this.arrNewWork = this.waitWork.WorkCount ? this.waitWork.WorkCount.split("#") : [];
        this.remindWorks.Count = 0;
        this.remindWorks.Height = 36;
        this.remindWorks.PressDoCount = this.waitWork.PressDoCount;

        for (var i = 0, len = this.arrNewWork.length; i < len; i++)
        {
            var moduleInfo = this.arrNewWork[i].split("$");

            var iModuleIndex = parseInt(+moduleInfo[0], 10);

            // 获取当前系统模块在remindWorks.RemindWork数组中所在的索引号（注意，与模块码值不一定是一样的！！！）
            var iModuleDefIndex = this.getModuleDefineIndexInRemindWorks(iModuleIndex);

            if (iModuleDefIndex <= -1)
            {
                continue;
            }

            //分析该模块下的待办：
            //1、设置每一个工作项的待办数目
            //2、设置每一个工作项是否有新待办
            //3、往remindWorks.News集合中插入新待办项
            this.analyseWorkRemind(iModuleDefIndex, moduleInfo[1], this.getOldWaitWorkOfModuleIndex(this.arrOldWork, iModuleIndex), this.waitWork.ShowWaitDo, this.waitWork.ShowWaitRead);
        }

        if (from === 0)
        {
            this.remindWorks.Width = (this.remindWorks.Count > 0 ? 480 : 150);
            this.remindWorks.Height = (this.remindWorks.Count > 0 ? (this.remindWorks.Height > 500 ? 500 : this.remindWorks.Height) : 60);

            var bNotifyObservers = this.remindWorks.News.length > 0;

            //this.$remindElement.find("i").html( (this.remindWorks.Count > 0 ? this.remindWorks.Count : 0));
            this.$remindElement.find("i").addClass((this.remindWorks.Count > 0 ? "hasNewInfo" : ""));

            //设置点击弹出窗口的内容
            this.setWorkRemindHtml();

            //如果立即显示，则还需要从底部滑窗提醒。
            if (this.remindWorks.BeWillShow)
            {
                // 闪烁标题
                this.flashNewWaitIco(false);

                //启用声音提醒
                var soundHTML = '';
                if (this.isSoundRemind === "Y")
                {
                    soundHTML = '<bgsound src="../Resources/Sound/msg.mp3" loop="1">';
                }
                this.$remindElement.find("i").innerHTML += soundHTML;


                //是否启用滑窗提醒
                var bUsePopup = (this.isShowPopupMsg === 'Y'
                    //&& typeof PopupManager != 'undefined'
                    && typeof Popup != 'undefined');

                if (bUsePopup)
                {
                    if (!this.topWindow.document.hasFocus() && !this.flashTitleTimer)
                    {
                        this.flashTitle(true, false);
                    }

                    if (this.topWindow.document.hasFocus())
                    {
                        this.registerPopup(this.remindWorks.News);
                    }
                }
                else
                {
                    if (this.topWindow.document.hasFocus())
                    {
                        this.showNews();
                    }
                    else
                    {
                        if (!this.flashTitleTimer)
                        {
                            this.flashTitle(true, true);
                        }
                    }
                }
            }

            //如果有第三方（比如内容块等，则通知它们有新待办，需要刷新）
            bNotifyObservers && this.notifyObservers();
        }
    }

    /**
    *   根据模块序号获取该模块在remindWorks.RemindWork[]中的序号(数组序列)
    */
    remindWorks.prototype.getModuleDefineIndexInRemindWorks = function (iModuleIndex)
    {
        var iIndex = -1;

        $.each(this.remindWorks.RemindWork, function (i, work)
        {
            if ($.inArray(iModuleIndex, work.RemindIndex) !== -1)
            {
                iIndex = i;
                return false;
            }
        });

        return iIndex;
    }

    /**
*     分析某个模块的待办工作（如数目、是否有新待办等） 
*    @author jeremy
*    @param {number} iModuleDefIndex 模块定义在remindWorks.RemindWork中的位置
*    @param {string} strNewWork 新待办字符串，格式为工作码，数目-数目｜工作码，数目
*    @param {string} strOldWork 旧待办字符串，格式为工作码，数目-数目｜工作码，数目
*    @param {boolean} bShowWaitDo 是否显示待办
*    @param {boolean} bShowWaitRead 是否显示待阅     
*/
    remindWorks.prototype.analyseWorkRemind = function (iModuleDefIndex, strNewWork, strOldWork, bShowWaitDo, bShowWaitRead)
    {
        //该系统模块下有待办数目的待办项的和
        //比如：运营系统下，只有项目主项计划发布和任务执行报告两个工作项有待办（阅），那么workCnt=2;
        var workCnt = 0,
            work = this.remindWorks.RemindWork[iModuleDefIndex],    //获取该模块的定义
            arrNewWaits = strNewWork.split('|'), // ['工作码，数目-数目','工作码，数目-数目'....]
            that = this;     

        //该模块下有新待办的工作项集合
        var moduleNews = [];

        //默认设置该模块所有待办数目和为0
        work.Count = 0;

        workCnt = arrNewWaits.length;

        //循环每一个工作项    
        $.each(arrNewWaits, function (i, newWait)
        {
            var arrWorkCount = newWait.split(',');     //['数目','数目'] 2,32-36
            var iWorkIndex = parseInt(+arrWorkCount[0], 10);

            //获取工作项在remindworks中定义的序号
            var iWorkDefIndex = that.getWorkDefineIndexInRemindWorks(work.Work, iWorkIndex);

            //获取工作项的定义(也是一个数组)
            var workDefine = work.Work[iWorkDefIndex];
            if (!workDefine)
            {
                return;
            }

            // 获取该工作项的具体待办数目
            var arrCnt = arrWorkCount[1].split('-');

            var iWaitDo = 0, iWaitLook = 0,
                iOldWaitDo = 0, iOldLook = 0;

            //如果显示待办，获取待办数      
            if (bShowWaitDo)
            {
                iWaitDo = parseInt(+arrCnt[0], 10);
            }

            //如果显示待阅，且当前项有阅读项，获取待阅数
            if (bShowWaitRead && arrCnt.length > 1)
            {
                iWaitLook = parseInt(+arrCnt[1], 10);
            }

            workDefine[3] = iWaitDo;
            workDefine[4] = iWaitLook;

            //判断是否有新消息
            //判断标准:
            /*
                1、如果旧待办没有这个工作项，则视为有新消息 
                2、如果旧待办的待办和待阅数目小于新待办，则视为新消息
            */

            if (null != strOldWork)
            {
                $.each(strOldWork.split('|'), function (i, oldWork)
                {
                    var oldWorkIndexValue = oldWork.split(',');
                    if (oldWork && oldWorkIndexValue[0] == iWorkIndex)
                    {
                        iOldWaitDo = parseInt(+(oldWorkIndexValue[1].split('-')[0]), 10);
                        iOldLook = oldWorkIndexValue[1].indexOf('-') != -1 ? parseInt(+(oldWorkIndexValue[1].split('-')[1]), 10) : 0;
                    }
                });
            }

            //如果是第一次获取待办，则不能标记为新待办 
            if (!!!that.remindWorks.IsFirstGet)
            {
                if ((iOldLook + iOldWaitDo) < (iWaitDo + iWaitLook))
                {
                    workDefine[5] = true;
                    moduleNews.push(iWorkIndex);
                }
            }

            work.Count += (iWaitDo + iWaitLook);
        });

        if (moduleNews.length > 0)
        {
            // 滑窗提醒过滤重复提醒
            var bRepeater = false;
            $.each(this.remindWorks.News, function (i, value)
            {
                if (value.RemindIndex == work.RemindIndex)
                {
                    that.remindWorks.News.splice(i, 1, { 'RemindIndex': work.RemindIndex, 'RemindDefIndex': iModuleDefIndex, 'Works': $.merge(moduleNews, value.Works) }); //$.merge(moduleNews, value.Works) 
                    bRepeater = true;
                    return false;
                }
            });

            if (!bRepeater)
            {
                this.remindWorks.News.push({ 'RemindIndex': work.RemindIndex, 'RemindDefIndex': iModuleDefIndex, 'Works': moduleNews });
            }
            this.remindWorks.BeWillShow = true;
        }

        this.remindWorks.Count += work.Count;

        if (work.Count > 0)
        {
            // modify by : wenghq 2013-05-10
            //var lineCnt = parseInt(workCnt / 3, 10);
            //remindWorks.Height += (34 + (workCnt % 3 == 0 ? lineCnt : (lineCnt + 1)) * 18);
            var lineCnt = Math.ceil(workCnt / 3);
            this.remindWorks.Height += ((lineCnt + 1) * 26); //将每行都改为26px  肖勇彬 2015-09-10
        }
    }

    /**
    * 收提醒
    */
    remindWorks.prototype.receiveRemind = function (iModuleIndex, iWorkIndex)
    {
        var iModuleDefIndex = this.getModuleDefineIndexInRemindWorks(iModuleIndex);
        var workDefine = this.getWorkDefine(this.remindWorks.RemindWork[iModuleDefIndex].Work, iWorkIndex);
        if (workDefine && workDefine[5])
        {
            workDefine[5] = false;

            $.each(this.remindWorks.News, function (i, work)
            {
                if (work.RemindIndex == iModuleIndex)
                {
                    work.Works.splice($.inArray(iWorkIndex, work.Works), 1);
                }
            });

            this.setWorkRemindHtml();
        }
    }

    /**
    * 获取某个模块的上一次待办数据
    * @param {Array} arrOld 上一次待办
    * @param 系统模块码
    */
    remindWorks.prototype.getOldWaitWorkOfModuleIndex = function (arrOld, iModuleIndex)
    {
        if (!arrOld || typeof iModuleIndex !== "number")
        {
            return null;
        }

        var oldWaitWork = null;

        $.each(arrOld, function (i, old)
        {
            if (parseInt(+old.split("$")[0], 10) === iModuleIndex)
            {
                oldWaitWork = old.split("$")[1];
                return false;
            }
        });

        return oldWaitWork;
    }

    //获取工作项在remindworks中定义的序号
    remindWorks.prototype.getWorkDefineIndexInRemindWorks = function (works, iWorkIndex)
    {
        var workCount = works.length;
        for (var i = 0; i < workCount; i++)
        {
            if (works[i][0] == iWorkIndex)
            {
                return i;
            }
        }
        return -1;
    }

    /**
     * 设置页面顶部弹出提示的html
    */
    remindWorks.prototype.setWorkRemindHtml = function ()
    {
        // modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
        var html = [];
        html.push('<table class="idtbfix index_msg_border" style="height:100%"><tr><td class="index_msg_header">'
            , '<table class="idtbfix" style="height:100%"><tr>'
            , '<td><div style=\'padding-left:3px\'>', this.remindDefine.Caption
            , (this.remindWorks.PressDoCount && this.remindWorks.PressDoCount != "0" ? ("<span style='font-size:13px;color:red;cursor:hand' onclick='parent.openWindow(\"../Common/Personal/VWaitAllWork.aspx?WaitDo=1&IsPressedDo=Y\",960, 650)'> <span style='color:#414141'>--</span> 催办<span style='color:#414141'>[</span><span style='color:red;font-weight:normal;'>" + this.remindWorks.PressDoCount + "</span><span style='color:#414141'>]</span></span>") : "")
            , '</div></td><td class="index_msg_close" onclick="parent.hidePopup()"></td>'
            , '</tr></table>'
            , '</td></tr><tr><td class="idtd index_msg_info"><div class="index_msg_info_div">'
            , '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">');

        var length = this.remindWorks.RemindWork.length;

        var cnt = 0;
        //邮件放到最前面

        var mailwork = this.remindWorks.RemindWork[length - 1];
        if (mailwork.Count > 0)
        {
            var csstitle = (cnt === 0 ? "index_msg_title1" : "index_msg_title2");
            html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', mailwork.Title, this.getTableHtml(length - 1, 3), csstitle));
            cnt++;
        }
        for (var i = 0; i < length - 1; i++)
        {
            var work = this.remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt === 0 ? "index_msg_title1" : "index_msg_title2");
                html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, this.getTableHtml(i, 3), csstitle));
                cnt++;
            }
        }

        if (this.remindWorks.Count === 0)
        {
            html.push('<tr><td class="promptmsg">' + this.remindDefine.NoWork + '</td></tr>');
        }
        html.push("</table></div></td></tr></table>");

        if (ieVersion <= 6)
        {
            html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
        }

        this.remindWorks.Html = html.join("");
    }

    // 将各项工作内容均布在以colsCnt为列数的表格的单元格中
    // 如果第三个参数不为空且值为isObserver，则表示是观察者调用
    // 如果第三个参数不为空且值为数组，则表示是传递的是具有新消息的工作项索引数组
    remindWorks.prototype.getTableHtml = function (iModuleDefIndex, colsCnt)
    {
        /* modify by : wenghq 2013-05-10, 将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	 * 方法返回html.join("")
	 */
        var html = [];
        var colWidth = 100.0 / colsCnt;

        var workCnt = 0;
        var arrWork = this.remindWorks.RemindWork[iModuleDefIndex].Work;

        html.push('<table border="0" cellpadding="1" cellspacing="0" style="width:100%"><tr>');

        for (var i = 0; i < arrWork.length; i++)
        {
            if (arguments.length == 3 && arguments[2] != "isObserver")
            {
                //查看WorkIndex是否存在于arguments[2]中
                //作者：肖勇彬
                //日期：2015-04-15
                if ($.inArray(arrWork[i][0], arguments[2]) == -1)
                {
                    continue;
                }
            }
            var name = arrWork[i][2];
            var iDoCnt = arrWork[i][3];
            var iLookCnt = arrWork[i][4];
            var haveNew = arrWork[i][5];
            var beCheck = arrWork[i][6];
            var waitUrl = arrWork[i][7];
            var tempArr;
            var toolTip = "";
            var workNum = "";

            if (iDoCnt > 0 && iLookCnt > 0)
            {
                tempArr = [];
                tempArr.push(this.remindDefine.DoName, iDoCnt, this.remindDefine.Unit, ", ", this.remindDefine.LookName, iLookCnt, this.remindDefine.Unit);
                toolTip = tempArr.join("");

                tempArr = [];
                tempArr.push(iDoCnt, "-", iLookCnt);
                workNum = tempArr.join("");

                delete tempArr;
            }
            else if (+iDoCnt + iLookCnt > 0)
            {
                if (beCheck)
                {
                    name += (iDoCnt > 0 ? this.remindDefine.DoName : this.remindDefine.LookName);
                }
                workNum = (iDoCnt > 0 ? iDoCnt : iLookCnt);
            }
            else
            {
                continue;
            }

            if (workCnt > 0 && workCnt % colsCnt == 0)
            {
                html.push('</tr><tr>');
            }

            var clickEvent = '';
            if (arguments.length == 3 && arguments[2] == "isObserver")
            {
                //所有监听窗口，需要自定义remindClickCallback来响应点击待办
                // clickEvent= stringFormat('remindClickCallback(\'{0}\',null,{1})',waitUrl, iModuleDefIndex);
                clickEvent = stringFormat('remindClickCallback(\'{0}\',null,{1})', waitUrl, this.remindWorks.RemindWork[iModuleDefIndex].RemindIndex);
            }
            else
            {
                //eiditor:王星 参数传错了
                // clickEvent= stringFormat('parent.showWaitWork(\'{0}\',null,{1},{2})',waitUrl, iModuleDefIndex, i);
                clickEvent = stringFormat('parent.showWaitWork(\'{0}\',null,{1},{2})', waitUrl, this.remindWorks.RemindWork[iModuleDefIndex].RemindIndex, i);
            }

            html.push(
            stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a>{6}</td>',
                colWidth, clickEvent, toolTip, name, workNum,
                ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"',
                (haveNew ? '<img src="../image/home/new.gif" style="display:inline-block;margin-top:8px;" ondrag="return false" />' : '')));

            workCnt++;
        }

        if (workCnt % colsCnt != 0)
        {
            html.push('<td colspan="', (colsCnt - workCnt % colsCnt), '"></td>');
        }

        html.push('</tr></table>');

        return html.join("");
    }

    /**
    * 弹出右下角的提示
    */
    remindWorks.prototype.registerPopup = function (arrNewWorks)
    {
        var arrAddedRemindDefIndex = [];
        if (arrNewWorks && arrNewWorks.length > 0)
        {
            var caption = '<table class="idtbfix" style="height:100%"><tr>'
                + '<td style="width:22px;padding-left:5px"><img src="../Image/home/remindnews.gif" '
                + ' style="display:inline-block;margin-top:8px;" title="' + this.remindDefine.NewsToolTip + '" ondrag="return false" /></td>'
                + '<td><div>' + this.remindDefine.Caption + '</div></td></tr></table>';

            var message = '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">';

            //邮件显示在最前面
            if (this.remindWorks.RemindWork[arrNewWorks[arrNewWorks.length - 1].RemindDefIndex].Title === '邮件管理')
            {
                var csstitle = "index_msg_title1";
                message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>',
                    this.remindWorks.RemindWork[arrNewWorks[arrNewWorks.length - 1].RemindDefIndex].Title,
                    this.getTableHtml(arrNewWorks[arrNewWorks.length - 1].RemindDefIndex, 1, arrNewWorks[arrNewWorks.length - 1].Works), csstitle);
            }
            var that = this;
            $.each(arrNewWorks, function (i, work)
            {
                if (that.remindWorks.RemindWork[work.RemindDefIndex].Title !== '邮件管理')
                {
                    var csstitle = (i == 0 ? "index_msg_title1" : "index_msg_title2");
                    message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>',
                        that.remindWorks.RemindWork[work.RemindDefIndex].Title,
                        that.getTableHtml(work.RemindDefIndex, 1, work.Works), csstitle);
                }
            });
            message += '</table>';

            var pop = new Popup('WaitWork', 200, 200, caption, message);

            pop.closeCallbacks.push(function (me)
            {
                if (me.closeByBtn)
                {//手动点击关闭时，才停止闪烁标题                
                    that.flashTitle(false, false);
                    that.flashNewWaitIco(true);
                }
            });
            pop.show.call(pop);
        }
    }

    // 闪烁标题
    remindWorks.prototype.flashTitle = function (bStart, bShowNews)
    {
        var that = this;
        if (bStart)
        {
            if (this.topWindow.document.title.indexOf("(") != -1)
            {
                this.topWindow.document.title = this.replaceTitle;
            }
            else
            {
                this.topWindow.document.title = this.sysTitle;
            }

            if (this.topWindow.document.hasFocus())
            {
                bShowNews ? this.showNews() : this.flashTitle(false);

                this.topWindow.document.title = this.sysTitle;
            }
            else
            {
                this.flashTitleTimer = window.setTimeout(function () { that.flashTitle.call(that, bStart, bShowNews); }, 300);
            }
        }
        else
        {
            if (this.flashTitleTimer)
            {
                window.clearTimeout(this.flashTitleTimer);
                this.flashTitleTimer = null;
            }

            this.topWindow.document.title = this.sysTitle;
        }
    }

    /**
     *  闪烁待办图标
     *
     *  @param bStop         {bool} true:停止闪烁；false:闪烁
     */
    remindWorks.prototype.flashNewWaitIco = function (bStop)
    {
        var that = this;
        if (bStop)
        {
            if (this.flashNewWaitIcoTimer)
            {
                window.clearTimeout(this.flashNewWaitIcoTimer);
                this.flashNewWaitIcoTimer = null;
                this.$remindElement.css("background-image", this.remindElementIco);
            }
        }
        else
        {
            if (this.flashNewWaitIcoTimer)
            {
                window.clearTimeout(this.flashNewWaitIcoTimer);
            }
            this.isShowWaitIco = this.isShowWaitIco === "Y" ? "N" : "Y";

            this.$remindElement.css("background-image", this.isShowWaitIco === "Y" ? this.remindElementIco : "none");

            this.flashNewWaitIcoTimer = window.setTimeout(function () { that.flashNewWaitIco.call(that, false); }, 300);
        }
    }

    // 获取待办工作
    remindWorks.prototype.getWaitWorkCount = function ()
    {
        //ajaxRequest("FillData.ashx", { action: "WaitWorkCountNew" }, "text", this.showWaitWorkCount.call(this));
        var that = this;

        $.ajax({
            url: "FillData.ashx?Action=WaitWorkCountNew&IDAjax=true",
            dataType: "text",
            success: function (data)
            {
                that.showWaitWorkCount.call(that, data);
            },
            error: function (req, err, msg)
            {
                //console.log(msg);
                window.clearTimeout(that.waitWorkTimer);
                that.waitWorkTimer = window.setTimeout(function () { that.getWaitWorkCount.call(that) }, that.getWaitWorkTime);
            }
        });
    }

    // 获取待办成功之后执行
    remindWorks.prototype.showWaitWorkCount = function (data, textStatus)
    {
        if (data == "-1")
        {
            this.page.relogin.call(this.page, 2);
        }
        else if (data.substr(0, 2) == "-2")
        {
            this.page.logout.call(this.page, [0, data.substr(2)]);
        }
        else
        {
            this.setWaitWork(0, data);
            window.clearTimeout(this.waitWorkTimer);
            var that = this;

            this.waitWorkTimer = window.setTimeout(function () { that.getWaitWorkCount.call(that) }, this.getWaitWorkTime);
        }
    }

    //点击具体待办事项链接
    remindWorks.prototype.showWaitWork = function (url, frameName, iModuleIndex, iWorkIndex)
    {
        if (url.indexOf('/') == 0)
        {
            url = url.substring(1, url.length);
        }
        url = stringFormat("/{0}/" + url, rootUrl);
        //url = stringFormat("/{0}" + url, rootUrl);
        if (frameName)
        {
            url += (url.indexOf("?") != -1 ? "&" : "?") + document.location.search.substr(1);
            window.parent.frames(frameName).location = url;
        }
        else
        {
            if (arguments.length >= 4)
            {
                this.receiveRemind(iModuleIndex, iWorkIndex);
            }

            openWindow(url, 960, 650);
        }
    }

    // 显示待办窗口
    remindWorks.prototype.showNews = function ()
    {
        var aHref = this.$remindElement[0];
        var left = getAbsAxisX(aHref);
        var top = getAbsAxisY(aHref) + aHref.offsetHeight;

        //停止闪烁
        if (this.flashNewWaitIcoTimer)
        {
            this.flashNewWaitIco(true);
        }

        showPopup(this.remindWorks.Html, left, top, this.remindWorks.Width, this.remindWorks.Height, false);
    }

    //设置标题
    remindWorks.prototype.setSysTitle = function (win)
    {
        if (win)
        {
            win.document.title = this.sysTitle;
        }
    }

    //设置闪烁标题
    remindWorks.prototype.setReplaceTitle = function ()
    {
        if (this.sysTitle)
        {
            var len = this.sysTitle.replace(/[^\x00-\xff]/g, '**').length;
            for (var i = 0; i < len; i += 2)
            {
                this.replaceTitle += "　";
            }
        }
    }

    remindWorks.prototype.getWorkDefine = function (works, iWorkIndex)
    {
        var iWorkDefIndex = this.getWorkDefineIndexInRemindWorks(works, iWorkIndex);

        if (iWorkDefIndex == -1)
        { return null; }

        return works[iWorkDefIndex];
    }

    /**
    由监听窗口调用，不建议直接使用remindObservers
@param obj  可为对象或字符串，如果为对象则是窗口对象。如果是字符串，则表示某个内容块的ID
@param bTriggerImmediate  注册完是否立即刷新内容块
*/
    remindWorks.prototype.addOberver = function (obj, bTriggerImmediate)
    {
        if (!obj) return;
        if (this.indexOfObserver(obj) === -1)
        {
            this.remindObservers.push(obj);
            if (bTriggerImmediate)
            {
                this.notifyObservers(obj);
            }
        }
    }

    /**
    查找某个观察者在已有观察者列表中的索引。如果找到则返回不为-1的数字。没有找到则返回-1。
    @param obj 被索引的观察者。
*/
    remindWorks.prototype.indexOfObserver = function (obj)
    {
        var iIndex = -1;
        $.each(this.remindObservers, function (i, observer)
        {
            if (observer == obj)
            {
                iIndex = i;
                return false;
            }
        });
        return iIndex;
    }

    // 通知自定义portal,需要更新或显示待办（比如华鑫的自定义页面）
    // 所有监听窗口，使用triggerRemindUpdate来获取通知，通知参数为remindWorks
    // 如果不传入 obj参数，则会通知所有窗口。
    // 如果传入obj参数，则只响应该对应的要求（该对象不需要存在于监听窗口集合中)。
    remindWorks.prototype.notifyObservers = function (activeObj)
    {
        if (activeObj)
        {
            if (typeof activeObj === 'string')
            {
                this.updatePortalBlocks(activeObj);
            }
            else if (typeof activeObj.triggerRemindUpdate === 'function')
            {
                this.setWorkRemindHtmlForObservers();
                activeObj.triggerRemindUpdate(this.remindWorks);
            }
        }
        else
        {
            if (this.remindObservers.length > 0)
            {
                var that = this;
                this.setWorkRemindHtmlForObservers();
                $.each(this.remindObservers, function (i, activeObj)
                {
                    if (typeof activeObj === 'string')
                    {
                        that.updatePortalBlocks(activeObj);
                    }
                    else if (typeof activeObj.triggerRemindUpdate === 'function')
                    {
                        activeObj.triggerRemindUpdate(that.remindWorks);
                    }
                });
            }
        }
    }

    /**
* 为所有监听者设置提醒Html
*/
    remindWorks.prototype.setWorkRemindHtmlForObservers = function ()
    {
        // modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
        var html = [];
        html.push('<table class="idtbfix" style="width:100%;height:100%"><div>');

        var length = this.remindWorks.RemindWork.length;

        var cnt = 0;
        for (var i = 0; i < length; i++)
        {
            var work = this.remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
                html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, this.getTableHtml(i, 1, 'isObserver'), csstitle));
                cnt++;
            }
        }

        if (this.remindWorks.Count == 0)
        {
            html.push('<tr><td class="promptmsg">', this.remindDefine.NoWork, '</td></tr>');
        }

        html.push("</table></div></td></tr></table>");

        if (ieVersion <= 6)
        {
            html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
        }

        this.remindWorks.CallbackHtml = html.join("");
    }

    /**
    提醒观察者（内容块），待办有更新，需要作刷新处理。
    @param {String} blockID 内容块的ID
    */
    remindWorks.prototype.updatePortalBlocks = function (blockID)
    {
        var mainFrame = this.topWindow.parent ? this.topWindow.parent.frames('Main') : null;
        if (mainFrame)
        {
            if (typeof mainFrame.GetContentBlockById === 'function')
            {
                mainFrame.GetContentBlockById(blockID).ReLoad();
            }
        }
    }

    return remindWorks;
})(remindWorks || {}, remindDefine || {}, window);

/**
 * 表示在线人数
*/
Page.OnLine = (function (win)
{
    function onLine()
    {
        this.getOnlineTime = 10000;
        this.onLineTimer = null;
        this.$onLineElement = null;
        this.win = win;
        this.page = null;
        this.onLineCount = 1;
    }

    onLine.prototype.init = function (vm)
    {
        this.vm = vm;
        var waitConfig = vm.Data;
        if (waitConfig)
        {
            var that = this;
            this.page = Page.instance;
            this.getOnlineTime = parseInt(waitConfig.GetOnlineTime, 10) > this.getOnlineTime ? parseInt(waitConfig.GetOnlineTime, 10) : this.getOnlineTime;
            this.$onLineElement = $(".show-online-counter");
            //在线人数
            this.$onLineElement.find("i").text( (this.vm.Data.OnlineCount ? this.vm.Data.OnlineCount : this.onLineCount));

            this.onLineTimer = window.setTimeout(function () { that.getOnlineCount.call(that) }, that.getOnlineTime);
        }
    }

    // 获取在线人数
    onLine.prototype.getOnlineCount = function ()
    {
        var that = this;

        $.ajax({
            url: "FillData.ashx?Action=OnlineCount&IDAjax=true",
            dataType: "text",
            success: function (data)
            {
                that.showOnlineCount.call(that, data);
            },
            error: function (req, err, msg)
            {
                //console.log(msg);
                window.clearTimeout(that.onLineTimer);
                that.onLineTimer = window.setTimeout(function () { that.getOnlineCount.call(that); }, that.getOnlineTime);
            }
        });

    }

    // 显示在线人数
    onLine.prototype.showOnlineCount = function (data)
    {
        if (data == "-1")
        {
            this.page.relogin.call(this.page, 1);
        }
        else if (data.substr(0, 2) == "-2")
        {
            this.page.logout.call(this.page, 1, data.substr(2));
        }
        else
        {
            var that = this;
            this.$onLineElement.find("i").text( data );
            window.clearTimeout(this.onLineTimer);
            this.onLineTimer = window.setTimeout(function () { that.getOnlineCount.call(that); }, that.getOnlineTime);
        }
    }


    //打开在线人数详细页面
    onLine.prototype.showOnline = function ()
    {
        openWindow("OnlineOld.aspx", 960, 640);
    }

    return onLine;
})(window)

$(function ()
{
    var page = new Page(),
        win = window,
        winParent = win.parent,
        silverPageInstance = void 0;

    Page.instance = page;

    winParent.$("body").unbind("menuload") // 解除绑定、防止多次绑定
        .on("menuload", function ()
        {
            silverPageInstance = winParent.SilverPage.instance;
            page.init(silverPageInstance);
            openFunToGlobal(win, page);
        });

    //公开方法到全局变量中
    var openFunToGlobal = function (win, page)
    {
        //显示待办
        win.showWaitWork = function (url, frameName, iModuleIndex, iWorkIndex)
        {
            page.remindWorks.showWaitWork.call(page.remindWorks, url, frameName, iModuleIndex, iWorkIndex);
        };

        //退出
        win.logout = function (bKicked, kickIP)
        {
            page.logout.call(page, bKicked, kickIP);
        }

        //重新登录
        win.relogin = function (aim)
        {
            page.relogin.call(page, aim);
        };

        win.afterReLogin = function (data, textStatus)
        {
            page.afterReLogin.call(page, data, textStatus);
        }

        // 由监听窗口调用，不建议直接使用remindObservers
        win.addOberver = function (obj, bTriggerImmediate)
        {
            page.remindWorks.addOberver.call(page.remindWorks, obj, bTriggerImmediate);
        }

        /**
        提醒观察者（内容块），待办有更新，需要作刷新处理。
        @param {String} blockID 内容块的ID
        */
        win.updatePortalBlocks = function (blockID)
        {
            page.remindWorks.updatePortalBlocks.call(page.remindWorks, blockID);
        }

        // 通知自定义portal,需要更新或显示待办（比如华鑫的自定义页面）
        win.notifyObservers = function (activeObj)
        {
            page.remindWorks.notifyObservers.call(page.remindWorks, activeObj);
        }
    }
});


// 下载APP（新版UI）
$(function ()
{
    var downMenu;

    // 点击下载APP
    window.top.downApp = function ()
    {
        var menu = $("a[href$='downApp()']");
        if (downMenu)
        {
            showORCode(downMenu, menu);
        }
        else
        {
            setAjaxContainer(menu[0]);
            ajax("AppData.ashx", { "action": "GetDataTableByText", "cmdtext": "SELECT AppORCodeUrl,WeChatORCodeUrl FROM OperAllowDB.dbo.TMobileConfig" }, "json", function (data)
            {
                if (data.OperateResult)
                {
                    data = eval("(" + data.ResultText + ")");
                    if (data.length && data[0].length)
                    {
                        var url = data[0][0]["AppORCodeUrl"];
                        var weurl = data[0][0]["WeChatORCodeUrl"];

                        if (url && !isValidUrl(url))
                        {
                            url = stringFormat("/{0}/{1}", rootUrl, url);
                        }
                        if (weurl && !isValidUrl(weurl))
                        {
                            weurl = stringFormat("/{0}/{1}", rootUrl, weurl);
                        }

                        if (!url && !weurl)
                        {
                            return;
                        }

                        var html = '<div class="shortcut-menu"><table><tr>';
                        if (url)
                        {
                            html += stringFormat('<td style="padding:10px"><img src="{0}" style="width:120px;border:0"/><div style="line-height:normal;font-size:12px;margin-top:5px">扫描二维码下载App</div></td>', url);
                        }
                        if (weurl)
                        {
                            html += stringFormat('<td style="padding:10px"><img src="{0}" style="width:120px;border:0"/><div style="line-height:normal;font-size:12px;margin-top:5px">扫描二维码关注企业号</div></td>', weurl);
                        }
                        html += '</tr></table></div>';

                        downMenu = $(html);
                        $("body", window.parent.document).append(downMenu);

                        downMenu.on("blur", function ()
                        {
                            downMenu.delay(200).slideUp(150);
                        }).on("contextmenu drag", function ()
                        {
                            return false;
                        });

                        showORCode(downMenu, menu);
                    }
                    else
                    {
                        alert("未配置APP下载二维码。");
                    }
                }
                else
                {
                    alert("APP下载二维码获取失败。");
                }
            });
        }
    }

    // 显示二维码
    var showORCode = function (downMenu, menu)
    {
        if (downMenu.css("display") === "none")
        {
            var offset = menu.offset();
            var winWidth = $(window).width();
            var winHeight = $(window).height();

            var x = offset.left;
            var y = offset.top + parseInt(menu.css("font-size")) + 10;
            var w = downMenu.width();

            x = (x + w) > winWidth - 2 ? winWidth - 2 - w : x;

            downMenu.css({ "left": x, "top": y }).slideDown(150).focus();
        }
    }
});