//本JS用于内容块，与JS/Home/Remind1.js中的内容基本一致。
var CONST_OLDWaitWork = "IDEA_WAITWORK_PERSONAL_OLDWAIT",
    CONST_IS_FIRST_GET = "IDEA_WAITWORK_PERSONAL_IS_FIRST_GET";

/**
* 设置待办工作（分析待办数目、弹出待办显示等）
* @param strNewWork 当前获取的待办数目，格式｛WorkCount:***,'ShowWaitDo':boolean,'ShowWaitRead':boolean}
*/
function setWaitWork(strNewWork)
{
    if (!strNewWork) {
        return;
    }
    var oNewWork = $.stringToJSON(strNewWork);      //json:{BeWillShow:true|false,NewWorkFlag:true|false,NewWorks:[],WorkCount:***}
    
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

    //设置窗口的内容
    setWorkRemindHtml();

    return remindWorks.Html;
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
* 设置页面顶部弹出提示的html
*/
function setWorkRemindHtml()
{
	// modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	var html = [];
	html.push('<table border="0" cellpadding="4" cellspacing="0" style="width:100%">');

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
	html.push("</table>");

	if (ieVersion <= 6)
	{
		html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
	}

	remindWorks.Html = html.join("");
}

// 将各项工作内容均布在以colsCnt为列数的表格的单元格中
// 如果第三个参数不为空且值为isObserver，则表示是观察者调用
// 如果第三个参数不为空且值为数组，则表示是传递的是具有新消息的工作项索引数组
function getTableHtml(iModuleDefIndex, colsCnt)
{
	var html = [];
    var colWidth = 100.0 / colsCnt;
    
    var workCnt = 0;
    var arrWork = remindWorks.RemindWork[iModuleDefIndex].Work;

    html.push('<table border="0" cellpadding="1" cellspacing="0" style="width:100%"><tr>');

    for (var i = 0; i < arrWork.length; i++)
    {
        if(arguments.length==3 && arguments[2] != "isObserver" )
        {
            if($.inArray(i,arguments[2])==-1)
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
        
        var clickEvent = stringFormat('showWaitWork(\'{0}\',null,{1},{2})', waitUrl, remindWorks.RemindWork[iModuleDefIndex].RemindIndex, i);

        html.push(
		stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" style="cursor:pointer;" title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a></td>',
			colWidth, clickEvent, toolTip, name, workNum,
            ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"'
           ));

        workCnt++;
    }
    
    if (workCnt % colsCnt != 0)
    {
    	html.push('<td colspan="' , (colsCnt - workCnt % colsCnt) , '"></td>');
    }

    html.push('</tr></table>');
    
    return html.join("");
}

function showWaitWork(url, frameName, iModuleIndex, iWorkIndex)
{

    if (url.indexOf('/') == 0)
    {
        url = url.substring(1, url.length);
    }
    url = stringFormat("/{0}/" + url, rootUrl);
    if (frameName)
    {
        url += (url.indexOf("?") != -1 ? "&" : "?") + document.location.search.substr(1);
        window.parent.frames(frameName).location = url;
    }
    else
    {
        openWindow(url, 960, 650);
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