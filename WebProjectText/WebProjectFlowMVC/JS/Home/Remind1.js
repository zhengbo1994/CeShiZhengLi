// 提醒消息方法

/*
    模块码与js中的remindWorks.RemindWork.RemindIndex对应，工作码与remindWorks.RemindWork.Work中的获取顺序[数组位置]对应
	
    -- 数据格式说明：系统模块与系统模块之前通过"#"来分隔
    --               同一个模块内，系统模块号与具体待办数目明细之间用"$"来分隔
    --               同一模块内，不同的工作项（WorkIndex)之间用"|"来分隔
    --               同一个工作项（WorkIndex)，与之前工作项对应的待办数目通过","号来分隔
    -- 最终格式为	:ModuleIndex$WorkIndex,待办数|WorkIndex,待办数#ModuleIndex$WorkIndex,待办数|WorkIndex,待办数
	-- 如  0$1,2-3|3,5#3$17,9|64,4-5
*/

var CONST_OLDWaitWork = "IDEA_WAITWORK_PERSONAL_OLDWAIT",
    CONST_IS_FIRST_GET = "IDEA_WAITWORK_PERSONAL_IS_FIRST_GET";

/**
* 设置待办工作（分析待办数目、弹出待办显示等）
* @param from 0:Logo/1:待办(待阅)工作
* @param strNewWork 当前获取的待办数目，格式｛WorkCount:***,'ShowWaitDo':boolean,'ShowWaitRead':boolean}
*/
function setWaitWork(from, strNewWork)
{
    if (!strNewWork) {
        return;
    }
    
    var oNewWork = $.stringToJSON(strNewWork);      //json:{BeWillShow:true|false,NewWorkFlag:true|false,NewWorks:[],PressDoCount:0,WorkCount:***}
    
    if (!oNewWork)
    {
        return; 
    }    

    var $doc = $(document);

    //当前用户上一次更新待办时获取的数据缓存
    var arrOldWork = $doc.data(CONST_OLDWaitWork) || [];    

    //当前用户是否是第一次获取待办（登录、刷新页面都视为第一次，而每隔一段时间获取的不算第一次）
    //如果是第一次获取，则不能允许出现new图标、弹出提示等。
    var isFirstGet = $doc.data(CONST_IS_FIRST_GET) || "Y";
    $doc.data(CONST_IS_FIRST_GET, "N");    

    if (!$doc.data("RemindWorkAdapter"))
    {
        //使用序列/反序列化的形式存储，避免“对象引用“。
        $doc.data("RemindWorkAdapter", $.jsonToString(remindWorks));
    }
    else
    {
        remindWorks = $.stringToJSON($doc.data("RemindWorkAdapter"));
    }
    remindWorks.IsFirstGet = isFirstGet == "Y";    
    
    //拆分结果时按模块(ModuleIndex)为元素的数组，格式如：
    //    [
    //      'ModuleIndex$WorkIndex,待办数|WorkIndex,待办数'
    //         ,
    //      'ModuleIndex$WorkIndex,待办数|WorkIndex,待办数'...
    //    ]
    var arrNewWork = oNewWork.WorkCount ? oNewWork.WorkCount.split('#') : [];    
    
    //将本次用户获取的待办数据存放进数据缓存，以便下一次获取时用来进行新旧之前的差异对比。    
    $doc.data(CONST_OLDWaitWork, arrNewWork);    
    
    //得到新待办的系统模块数，以及是否显示待办或待阅配置
    //显示待办或待阅的配置实际上由页面传递，在个人工作区的待办工作中，待办和待阅是分了两个tab的。
    //点击待办tab时，不应该显示待阅。点击待阅tab时，不应该显示待办。
    var length = arrNewWork.length,
		showWaitDo = oNewWork.ShowWaitDo,
		showWaitRead = oNewWork.ShowWaitRead;

    //初始化本次待办信息
    remindWorks.Count = 0;  //总数默认为0
    remindWorks.Height = 36; //默认弹出层高度为36PX
    remindWorks.PressDoCount = oNewWork.PressDoCount;

    //循环每一个系统模块
    for (var i = 0; i < length; i++)
    {
        // 获取当前系统模块的信息
        var moduleInfo = arrNewWork[i].split('$');                  //0:模块码  1:工作码和工作数

        // 获取当前系统模块码(模块码值，与remindWorks.RemindWork[x].RemindIndex对应)
        var iModuleIndex = parseInt(+moduleInfo[0], 10);

        // 获取当前系统模块在remindWorks.RemindWork数组中所在的索引号（注意，与模块码值不一定是一样的！！！）
        var iModuleDefIndex = getModuleDefineIndexInRemindWorks(iModuleIndex);    
        
        // 如果没有找到则直接进行下一个
        if (iModuleDefIndex <= -1)
        {
            continue;
        }
        
        //分析该模块下的待办：
        //1、设置每一个工作项的待办数目
        //2、设置每一个工作项是否有新待办
        //3、往remindWorks.News集合中插入新待办项
        analyseWorkRemind(iModuleDefIndex, moduleInfo[1], getOldWaitWorkOfModuleIndex(arrOldWork, iModuleIndex), showWaitDo, showWaitRead);
    }

    //如果来自于logo，也就是项部工作区时    
    if (from == 0)
    {  
        remindWorks.Width = (remindWorks.Count > 0 ? 480 : 150);
        remindWorks.Height = (remindWorks.Count > 0 ? (remindWorks.Height > 500 ? 500 : remindWorks.Height) : 60);
        
        var bNotifyObservers = remindWorks.News.length > 0;

        //如果有新待办，则需要闪烁提醒
        var newImgSrc = '../Image/home/' + (remindWorks.News.length > 0 ? 'remindnews.gif' : 'remind.gif');
        
        $("#spWorkCnt").css({ 'background-image': 'url(' + newImgSrc + ')', 'background-repeat': 'no-repeat', 'background-position': 'left center', 'padding-left': 16 }).html(remindDefine.RemindName + (remindWorks.Count > 0 ? (remindWorks.Count + remindDefine.Unit) : remindDefine.NoRemind));
        
        //设置点击弹出窗口的内容
        setWorkRemindHtml();

        ////just a test
        //remindWorks.News.push({ 'RemindDefIndex': 14, 'RemindIndex': 100, 'Works': [0] });
        //registerPopup(remindWorks.News);
        
        //如果立即显示，则还需要从底部滑窗提醒。
        if (remindWorks.BeWillShow)
        {
            //启用声音提醒
            var soundHTML = '';
            if ($('#hidSoundRemind').length == 1 && $('#hidSoundRemind').val() == 'Y')
            {
                soundHTML = '<bgsound src="../Resources/Sound/msg.mp3" loop="1">';
            }
            $("#spWorkCnt")[0].innerHTML += soundHTML;


            //是否启用滑窗提醒
            var bUsePopup = ($('#hidIsShowPopupMsg').val() == 'Y'
                //&& typeof PopupManager != 'undefined'
                && typeof Popup != 'undefined');
            
            if(bUsePopup)
            {
                if (!window.top.document.hasFocus() && !window["ID_FlashTitle"])
                {
                    flashTitle(true,false);
                }
                registerPopup(remindWorks.News);
            }
            else
            {
                if (window.top.document.hasFocus())
                { 
                    showNews();
                }
                else
                {
                    if (!window["ID_FlashTitle"])
                    {
                        flashTitle(true,true);
                    }
                }
            }            
        }
        
        //如果有第三方（比如内容块等，则通知它们有新待办，需要刷新）
        bNotifyObservers && notifyObservers();
    }
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
function analyseWorkRemind(iModuleDefIndex, strNewWork, strOldWork, bShowWaitDo, bShowWaitRead)
{
    
    //该系统模块下有待办数目的待办项的和
    //比如：运营系统下，只有项目主项计划发布和任务执行报告两个工作项有待办（阅），那么workCnt=2;
    var workCnt = 0,
        work = remindWorks.RemindWork[iModuleDefIndex],    //获取该模块的定义
        arrNewWaits = strNewWork.split('|');     //['工作码，数目-数目','工作码，数目-数目'....]

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
        var iWorkDefIndex = getWorkDefineIndexInRemindWorks(work.Work, iWorkIndex);

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
         
        if ( null != strOldWork)            
        {
            $.each(strOldWork.split('|'), function (i, oldWork)
            {
                var oldWorkIndexValue = oldWork.split(',');
                if (oldWork && oldWorkIndexValue[0] == iWorkIndex)
                {
                    iOldWaitDo = parseInt(+(oldWorkIndexValue[1].split('-')[0]),10);
                    iOldLook = oldWorkIndexValue[1].indexOf('-') != -1 ? parseInt(+(oldWorkIndexValue[1].split('-')[1]), 10) : 0;
                }
            });
        }
        
        //如果是第一次获取待办，则不能标记为新待办 
        if(!!!remindWorks.IsFirstGet)
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
        remindWorks.News.push({ 'RemindIndex': work.RemindIndex, 'RemindDefIndex': iModuleDefIndex, 'Works': moduleNews });
        remindWorks.BeWillShow = true;
    }

    remindWorks.Count += work.Count;

    if (work.Count > 0)
    {
        // modify by : wenghq 2013-05-10
        //var lineCnt = parseInt(workCnt / 3, 10);
        //remindWorks.Height += (34 + (workCnt % 3 == 0 ? lineCnt : (lineCnt + 1)) * 18);
        var lineCnt = Math.ceil(workCnt / 3);
        remindWorks.Height += (34 + lineCnt * 18);
    }
}

/**
* 弹出右下角的提示
*/
function registerPopup(arrNewWorks)
{
    if (arrNewWorks && arrNewWorks.length > 0)
    {
        var caption = '<table class="idtbfix" style="height:100%"><tr>'
            + '<td style="width:22px;padding-left:5px"><img src="../Image/home/remindnews.gif" '
            + ' class="img_14" title="' + remindDefine.NewsToolTip + '" ondrag="return false" /></td>'
            + '<td><div>' + remindDefine.Caption + '</div></td></tr></table>';

        var message = '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">';

        //邮件显示在最前面
        if (remindWorks.RemindWork[arrNewWorks[arrNewWorks.length - 1].RemindDefIndex].Title == '邮件管理')
        {
            var csstitle = "index_msg_title1";
            message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[arrNewWorks[arrNewWorks.length - 1].RemindDefIndex].Title, getTableHtml(arrNewWorks[arrNewWorks.length - 1].RemindDefIndex, 1, arrNewWorks[arrNewWorks.length - 1].Works), csstitle);
        }
        $.each(arrNewWorks, function (i, work)
        {
            if (remindWorks.RemindWork[work.RemindDefIndex].Title != '邮件管理')
            {
                var csstitle = (i == 0 ? "index_msg_title1" : "index_msg_title2");
                message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[work.RemindDefIndex].Title, getTableHtml(work.RemindDefIndex, 1, work.Works), csstitle);
            }
        });
        message += '</table>';

        var pop = new Popup('WaitWork', 200, 200, caption, message);
        pop.closeCallbacks.push(function (me)
        {
            if (me.closeByBtn)
            {//手动点击关闭时，才停止闪烁标题                
                flashTitle(false, false);
            }
        });
        pop.show();
    }
}

/**
* 设置页面顶部弹出提示的html
*/
function setWorkRemindHtml()
{
	// modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	var html = [];
	html.push('<table class="idtbfix index_msg_border" style="height:100%"><tr><td class="index_msg_header">'
        , '<table class="idtbfix" style="height:100%"><tr>'
        , '<td><div style=\'padding-left:3px\'>', remindDefine.Caption
        , (remindWorks.PressDoCount && remindWorks.PressDoCount != "0" ? ("<span style='font-size:13px;color:red;cursor:hand' onclick='parent.openWindow(\"../Common/Personal/VWaitAllWork.aspx?WaitDo=1&IsPressedDo=Y\",960, 650)'> <span style='color:#414141'>--</span> 催办<span style='color:#414141'>[</span><span style='color:red;font-weight:normal;'>" + remindWorks.PressDoCount + "</span><span style='color:#414141'>]</span></span>") : "")
        , '</div></td><td class="index_msg_close" onclick="parent.hidePopup()"></td>'
        , '</tr></table>'
        , '</td></tr><tr><td class="idtd index_msg_info"><div class="index_msg_info_div">'
        , '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">');

	var length = remindWorks.RemindWork.length;

	var cnt = 0;
	//邮件放到最前面

	var mailwork = remindWorks.RemindWork[length - 1];
	if (mailwork.Count > 0)
	{
		var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
		html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', mailwork.Title, getTableHtml(length - 1, 3), csstitle));
		cnt++;
	}
	for (var i = 0; i < length - 1; i++)
	{
		var work = remindWorks.RemindWork[i];
		if (work.Count > 0)
		{
			var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
			html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 3), csstitle));
			cnt++;
		}
	}

	if (remindWorks.Count == 0)
	{
		html.push('<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>');
	}
	html.push("</table></div></td></tr></table>");

	if (ieVersion <= 6)
	{
		html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
	}

	remindWorks.Html = html.join("");
}

/**
* 为所有监听者设置提醒Html
*/
function setWorkRemindHtmlForObservers()
{
	// modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	var html = [];
	html.push('<table class="idtbfix" style="width:100%;height:100%"><div>');
 
    var length = remindWorks.RemindWork.length;
    
    var cnt = 0;
    for (var i = 0; i < length; i++)
    {
            var work = remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
                html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 1, 'isObserver'), csstitle));
                cnt++;
            }
    }
    
    if (remindWorks.Count == 0)
    {
    	html.push('<tr><td class="promptmsg">', remindDefine.NoWork, '</td></tr>');
    }

    html.push("</table></div></td></tr></table>");
    
    if (ieVersion <= 6)
    {
    	html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
    }
    
    remindWorks.CallbackHtml = html.join("");
}

// 将各项工作内容均布在以colsCnt为列数的表格的单元格中
// 如果第三个参数不为空且值为isObserver，则表示是观察者调用
// 如果第三个参数不为空且值为数组，则表示是传递的是具有新消息的工作项索引数组
function getTableHtml(iModuleDefIndex, colsCnt)
{
	/* modify by : wenghq 2013-05-10, 将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	 * 方法返回html.join("")
	 */
	var html = [];
    var colWidth = 100.0 / colsCnt;
    
    var workCnt = 0;
    var arrWork = remindWorks.RemindWork[iModuleDefIndex].Work;

    html.push('<table border="0" cellpadding="1" cellspacing="0" style="width:100%"><tr>');

    for (var i = 0; i < arrWork.length; i++)
    {
        if(arguments.length==3 && arguments[2] != "isObserver" )
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
        	tempArr.push(remindDefine.DoName, iDoCnt, remindDefine.Unit, ", ", remindDefine.LookName, iLookCnt, remindDefine.Unit);
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
        		name += (iDoCnt > 0 ? remindDefine.DoName : remindDefine.LookName);
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
        
        var clickEvent ='';
        if(arguments.length==3 && arguments[2] == "isObserver" )
        {
            //所有监听窗口，需要自定义remindClickCallback来响应点击待办
            // clickEvent= stringFormat('remindClickCallback(\'{0}\',null,{1})',waitUrl, iModuleDefIndex);
            clickEvent = stringFormat('remindClickCallback(\'{0}\',null,{1})', waitUrl, remindWorks.RemindWork[iModuleDefIndex].RemindIndex);
        }
        else
        {
            //eiditor:王星 参数传错了
            // clickEvent= stringFormat('parent.showWaitWork(\'{0}\',null,{1},{2})',waitUrl, iModuleDefIndex, i);
            clickEvent = stringFormat('parent.showWaitWork(\'{0}\',null,{1},{2})', waitUrl, remindWorks.RemindWork[iModuleDefIndex].RemindIndex, i);
        }

        html.push(
		stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a>{6}</td>',
			colWidth, clickEvent, toolTip, name, workNum,
            ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"',
            (haveNew ? '<img src="../Image/home/new.gif" ondrag="return false" />' : '')));

        workCnt++;
    }
    
    if (workCnt % colsCnt != 0)
    {
    	html.push('<td colspan="' , (colsCnt - workCnt % colsCnt) , '"></td>');
    }

    html.push('</tr></table>');
    
    return html.join("");
}

/**
* 收提醒
*/
function receiveRemind(iModuleIndex, iWorkIndex)
{
    var iModuleDefIndex = getModuleDefineIndexInRemindWorks(iModuleIndex);
    var workDefine = getWorkDefine(remindWorks.RemindWork[iModuleDefIndex].Work, iWorkIndex);
    if (workDefine && workDefine[5])
    {
        workDefine[5] = false;
        $.each(remindWorks.News, function (i, work)
        {
            if (work.RemindIndex == iModuleIndex)
            {
                work.Works.splice($.inArray(iWorkIndex, work.Works), 1);
            }
        });        
        setWorkRemindHtml();
    }    
}

// 存提醒
function saveRemind()
{
    // comment by jeremy @ 2013-6-28
    // 注释方法体，现在不再使用该方法，但不确定是否有其它地方调用，所以注释
    $("#hidWaitWork").val('');

	//var work = [];
	//for (var i = 0; i < remindWorks.RemindWork.length; i++)
	//{
	//	if (i > 0)
	//	{
	//		work.push("#");
	//	}
	//	for (var j = 0; j < remindWorks.RemindWork[i].Work.length; j++)
	//	{
	//		var works = remindWorks.RemindWork[i].Work[j];
	//		if (j > 0)
	//		{
	//			work.push(",");
	//		}
	//		work.push(works[3], "-", works[4]);
	//	}
	//}

	//$("#hidWaitWork").val(work.join(""));
}

// 闪烁标题
function flashTitle(bStart,bShowNews)
{
    if (bStart)
    {
        if (window.top.document.title.indexOf("(") != -1)
        {
            window.top.document.title = window["ID_ReplaceTitle"];
        }
        else
        {
            window.top.document.title = $("#hidSysTitle").val();
        }
        
        if (window.top.document.hasFocus())
        {        
            bShowNews ? showNews() : flashTitle(false);
        }
        else
        {
            window["ID_FlashTitle"] = window.setTimeout(function(){flashTitle(bStart,bShowNews);}, 300);
        }
    }
    else
    {
        if (window["ID_FlashTitle"])
        {
            window.clearTimeout(window["ID_FlashTitle"]);
            window["ID_FlashTitle"] = null;
            window.top.document.title = $("#hidSysTitle").val();
        }
    }
}

/**
* 获取某个模块的上一次待办数据
* @param {Array} arrOld 上一次待办
* @param 系统模块码
*/
function getOldWaitWorkOfModuleIndex(arrOld, iModuleIndex)
{
    if (!arrOld)
    { return null; }

    var oldWaitWork = null;
    $.each(arrOld, function (i, old)
    {
        if (parseInt(+(old.split('$')[0]), 10) == iModuleIndex)
        {
            oldWaitWork = old.split('$')[1];
            return false;
        }
    });
    return oldWaitWork;
}

/**
*   根据模块序号获取该模块在remindWorks.RemindWork[]中的序号(数组序列)
*/
function getModuleDefineIndexInRemindWorks(iModuleIndex)
{
	var iIndex = -1;
	$.each(remindWorks.RemindWork, function (i, work)
	{
		if ($.inArray(iModuleIndex, work.RemindIndex) != -1)
		{
			iIndex = i;
			return false;   //return true->continue,return false->break;
		}
	});
	return iIndex;
}

function getWorkDefineIndexInRemindWorks(works, iWorkIndex)
{
	// modify by： wenghq 2013-05-10.简单测试表明，在这里用原生的循环性能较好。如果之后验证each的性能更好，请替换回来。
//	var iWorkDefIndex = -1;
//	$.each(works, function (i, work)
//	{
//		if (work[0] == iWorkIndex)
//		{
//			iWorkDefIndex = i;
//			return false;
//		}
	//	});
	//	return iWorkDefIndex;

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

function getWorkDefine(works, iWorkIndex)
{
    var iWorkDefIndex = getWorkDefineIndexInRemindWorks(works, iWorkIndex);

    if (iWorkDefIndex == -1)
    { return null; }

    return works[iWorkDefIndex];
}

/**
    观察者列表，当待办有更新时，当通知所有的观察者进行刷新等动作。
*/
var remindObservers = [];
/**
    由监听窗口调用，不建议直接使用remindObservers
@param obj  可为对象或字符串，如果为对象则是窗口对象。如果是字符串，则表示某个内容块的ID
@param bTriggerImmediate  注册完是否立即刷新内容块
*/
function addOberver(obj,bTriggerImmediate)
{    
    if (!obj) return;
    if (indexOfObserver(obj) == -1)
    {
        remindObservers.push(obj);
        if (bTriggerImmediate)
        {
            notifyObservers(obj);
        }
    }
}

/**
    查找某个观察者在已有观察者列表中的索引。如果找到则返回不为-1的数字。没有找到则返回-1。
    @param obj 被索引的观察者。
*/
function indexOfObserver(obj)
{
    var iIndex = -1;
    $.each(remindObservers, function (i, observer)
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
function notifyObservers(activeObj)
{
    if (activeObj)
    {
        if (typeof activeObj === 'string')
        {
            updatePortalBlocks(activeObj);
        }
        else if (typeof activeObj.triggerRemindUpdate === 'function')
        {
            setWorkRemindHtmlForObservers();
            activeObj.triggerRemindUpdate(remindWorks);
        }
    }
    else
    {
        if (remindObservers.length > 0)
        {
            setWorkRemindHtmlForObservers();
            $.each(remindObservers, function (i, activeObj)
            {
                if (typeof activeObj === 'string')
                {
                    updatePortalBlocks(activeObj);
                }
                else if (typeof activeObj.triggerRemindUpdate === 'function')
                {
                    activeObj.triggerRemindUpdate(remindWorks);
                }
            });
        }
    }
}

/**
    提醒观察者（内容块），待办有更新，需要作刷新处理。
    @param {String} blockID 内容块的ID
*/
function updatePortalBlocks(blockID)
{   
    var mainFrame = window.parent.parent.frames('Main');    
    if (mainFrame)
    {
        if (typeof mainFrame.GetContentBlockById === 'function')
        {
            mainFrame.GetContentBlockById(blockID).ReLoad();
        }
    }
}