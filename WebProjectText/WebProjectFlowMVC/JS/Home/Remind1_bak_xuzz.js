// 提醒消息方法

/*
    模块码与js中的remindWorks.RemindWork.RemindIndex对应，工作码与remindWorks.RemindWork.Work中的获取顺序[数组位置]对应
	-- 返回	:模块1$工作码,待办数|工作码,待办数#模块2$工作码,待办数|工作码,待办数
	-- 如  0$1,2-3|3,5#3$17,9|64,4-5
*/
// 设置待办工作字符串(from:0:Logo/1:待办工作)
// strNewWork:此次获取的结果
function setWaitWork(from, strNewWork)
{
//	alert(strNewWork);
    if (!strNewWork)
    {
        return;
    }
    var oNewWork = $.stringToJSON(strNewWork);      //json:{BeWillShow:true|false,NewWorkFlag:true|false,NewWorks:[],WorkCount:***}
    if (!oNewWork)
    {
        return; 
    }

    //每一次都重置remindWorks.
    if (!window["RemindWorkAdapter"])
    {
        //使用序列/反序列化的形式存储，避免“对象引用“。
        window["RemindWorkAdapter"] = $.jsonToString(remindWorks);
    }
    else
    {
        remindWorks = $.stringToJSON(window["RemindWorkAdapter"]);
    }
        
    //['模块码$工作码,工作数|工作码，工作数','模块码$工作码,工作数|工作码，工作数'...]
    var arrNewWork = oNewWork.WorkCount ? oNewWork.WorkCount.split('#') : [];  
    
   // var remind = $("#hidRemind").val();
    //var length = remind.length;
    var length = arrNewWork.length,
		showWaitDo = oNewWork.ShowWaitDo,
		showWaitRead = oNewWork.ShowWaitRead;

    remindWorks.Count = 0;
    remindWorks.Height = 36;

    for (var i = 0; i < length; i++)
    {
        var moduleInfo = arrNewWork[i].split('$');                  //0:模块码  1:工作码和工作数
        var iModuleIndex = parseInt(+moduleInfo[0], 10);            //模块码值，与remindWorks.RemindWork[x].RemindIndex对应
        var iModuleDefIndex = getModuleIndexOfArr(iModuleIndex);    //模块在remindWorks.RemindWork数组中的位置，注意和模块码值是不一样的。
        
        if (iModuleDefIndex <= -1)
        {
            continue;
        }
        
        //邮件不检查授权[不需要再检查授权]
        //if (iModuleIndex == 100 || remindIsEnabled(remind, iModuleDefIndex))        
        //{
           setWorkRemind(iModuleDefIndex, moduleInfo[1], showWaitDo, showWaitRead);
        //}
    }        

    if (from == 0)
    {
        //如果待办数目大于0，并且是新待办
        //NewWorkFlag表示有新待办，但却不一定全是被授权的，因此，有可能检验授权后，就没有    
        //if (remindWorks.Count > 0 && oNewWork.NewWorkFlag)        
        //{
        //    remindWorks.BeWillShow = true;
        //}        
        remindWorks.Width = (remindWorks.Count > 0 ? 480 : 150);
        remindWorks.Height = (remindWorks.Count > 0 ? (remindWorks.Height > 500 ? 500 : remindWorks.Height) : 60);
        
        var src = '../Image/home/' + (oNewWork.NewWorkFlag ? 'remindnews.gif' : 'remind.gif');
      
        $("#spWorkCnt").css({ 'background-image': 'url(' + src + ')', 'background-repeat': 'no-repeat', 'background-position': 'left center', 'padding-left': 16 }).html(remindDefine.RemindName + (remindWorks.Count > 0 ? (remindWorks.Count + remindDefine.Unit) : remindDefine.NoRemind));

        setWorkRemindHtml();
        
        //if (remindWorks.BeWillShow)
        if (oNewWork.BeWillShow)
        {
            //启用声音提醒
            var soundHTML = '';
            if ($('#hidSoundRemind').length == 1 && $('#hidSoundRemind').val() == 'Y')
            {
                soundHTML = '<bgsound src="../Resources/Sound/msg.mp3" loop="1">';
            }
            $("#spWorkCnt")[0].innerHTML += soundHTML;


            //是否启用滑窗提醒
            var bUsePopup = ( $('#hidIsShowPopupMsg').val()=='Y' && typeof PopupManager!='undefined' && typeof Popup!='undefined' );
            
            if(bUsePopup)
            {
                if (!window.top.document.hasFocus() && !window["ID_FlashTitle"])
                {
                    flashTitle(true,false);
                }
                registerPopup(oNewWork.NewWorks);
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
        
        notifyObservers();              
    }
}

//右下角提醒
function registerPopup(arrNewWorks)
{
    var ret = getNewsObj(arrNewWorks);
    if (ret.length > 0)
    {
        var caption = '<table class="idtbfix" style="height:100%"><tr>'
            + '<td style="width:22px;padding-left:5px"><img src="../Image/home/remindnews.gif" />'
            + '" class="img_14" title="' + remindDefine.NewsToolTip + '" ondrag="return false" /></td>'
            + '<td><div>' + remindDefine.Caption + '</div></td></tr></table>';

        var message = '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">';
        //邮件显示在最前面
        if (remindWorks.RemindWork[ret[ret.length - 1].RemindIndex].Title == '邮件管理')
        {
            var csstitle = "index_msg_title1";
            message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[ret[ret.length - 1].RemindIndex].Title, getTableHtml(ret[ret.length - 1].RemindIndex, 1, ret[ret.length - 1].Works), csstitle);
        }
        $.each(ret, function (i, work)
        {
            if (remindWorks.RemindWork[work.RemindIndex].Title != '邮件管理')
            {
                var csstitle = (i == 0 ? "index_msg_title1" : "index_msg_title2");
                message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[work.RemindIndex].Title, getTableHtml(work.RemindIndex, 1, work.Works), csstitle);
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

function getNewsObj(arrNewWorks)
{
    arrNewWorks = arrNewWorks.sort(function (a, b)
    {
        return a.ModuleIndex - b.ModuleIndex;
    });
    var ret = [];

    $.each(arrNewWorks, function (i, work)
    {
        var existsIndex = -1;
        $.each(ret, function (i, remind)
        {
            if (remind.RemindIndex == work.ModuleIndex)
            {
                existsIndex = i;
                return false;
            }
        });
        if (existsIndex == -1)
        {
            ret.push({ RemindIndex: work.ModuleIndex, Works: [work.workIndex] });
        }
        else
        {
            ret[existsIndex].Works.push(work.workIndex);
        }
    });
    return ret;
}

var remindObservers = [];
//由监听窗口调用，不建议直接使用remindObservers
function addOberver(winObj)
{
    if(typeof winObj !== 'object') return;
    remindObservers.push(winObj);
}

// 通知自定义portal,需要更新或显示待办（比如华鑫的自定义页面）
// 所有监听窗口，使用triggerRemindUpdate来获取通知，通知参数为remindWorks
// 如果不传入 obj参数，则会通知所有窗口。
// 如果传入obj参数，则只响应该对应的要求（该对象不需要存在于监听窗口集合中)。
function notifyObservers(activeObj)
{            
    if(activeObj)
    {        
        if(typeof activeObj.triggerRemindUpdate==='function')
        {            
            setWorkRemindHtmlForObservers();
            activeObj.triggerRemindUpdate(remindWorks);
        }
    }
    else
    {
        if(remindObservers.length>0)
        {                
            setWorkRemindHtmlForObservers();
            $.each(remindObservers,function(i,winObj){            
                if(typeof winObj.triggerRemindUpdate==='function')
                {
                    winObj.triggerRemindUpdate(remindWorks);
                }
            });
        }
    }        
}

// 设置某个模块的工作提醒，参数iModuleIndex可为从0至12或100的任何数字，依次表示EWM、OA、CCM、PBM、POM、KM、SM
// iModuleDefIndex:模块定义在remindWorks.RemindWork中的位置
// strWorkCount:工作码，数目-数目｜工作码，数目
// bShowWaitDo:是否统计待办
// bShowWaitRead:是否统计待阅
function setWorkRemind(iModuleDefIndex, strWorkCount, bShowWaitDo, bShowWaitRead)
{
    var workCnt = 0;

    var work = remindWorks.RemindWork[iModuleDefIndex];
    work.Count = 0;

    var arrWaits = strWorkCount.split('|');     //['工作码，数目-数目','工作码，数目-数目'....]
    workCnt = arrWaits.length;
    
    $.each(arrWaits, function (i, wait)
    {
    	var arrWorkCount = wait.split(',');     //['数目','数目'] 2,32-36
        var iWorkIndex = parseInt(arrWorkCount[0], 10);
        var workDefine = getWorkDefine(work.Work, iWorkIndex);       
        if (!workDefine)
        {
            return;
        }

        var arrCnt = arrWorkCount[1].split('-');
        var iWaitDo = 0, iWaitLook = 0;
        
        //如果显示待办，获取待办数      
        if (bShowWaitDo)
        {
            iWaitDo = parseInt(arrCnt[0], 10);
        }

        //如果显示待阅，且当前项有阅读项，获取待阅数
        if (bShowWaitRead && arrCnt.length > 1)
        {
            iWaitLook = parseInt(arrCnt[1], 10);
        }

        //if (work.Work.length > iWorkIndex)
        //{
            workDefine[3] = iWaitDo;
            workDefine[4] = iWaitLook;
            //work.Work[iWorkIndex][3] = iWaitDo;
            //work.Work[iWorkIndex][4] = iWaitLook;
        //}
        work.Count += (iWaitDo + iWaitLook);
    });
        
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

// 设置提醒Html
function setWorkRemindHtml()
{
	// modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
	//    var html = '<table class="idtbfix index_msg_border" style="height:100%"><tr><td class="index_msg_header">'
	//        + '<table class="idtbfix" style="height:100%"><tr>'
	//        + '<td><div style=\'padding-left:3px\'>' + remindDefine.Caption + '</div></td><td class="index_msg_close" onclick="parent.hidePopup()"></td>'
	//        + '</tr></table>'
	//        + '</td></tr><tr><td class="idtd index_msg_info"><div class="index_msg_info_div">'
	//        + '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">'
	var html = [];
	html.push('<table class="idtbfix index_msg_border" style="height:100%"><tr><td class="index_msg_header">'
        , '<table class="idtbfix" style="height:100%"><tr>'
        , '<td><div style=\'padding-left:3px\'>', remindDefine.Caption, '</div></td><td class="index_msg_close" onclick="parent.hidePopup()"></td>'
        , '</tr></table>'
        , '</td></tr><tr><td class="idtd index_msg_info"><div class="index_msg_info_div">'
        , '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">');

	var length = remindWorks.RemindWork.length;
	//var remind = $("#hidRemind").val();
	//var length = remind.length;
	//if (length > remindWorks.RemindWork.length)
	//{
	//    length = remindWorks.RemindWork.length;
	//}

	var cnt = 0;
	//邮件放到最前面

	var mailwork = remindWorks.RemindWork[length - 1];
	if (mailwork.Count > 0)
	{
		var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
		//         html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', mailwork.Title, getTableHtml(length-1, 3), csstitle);
		html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', mailwork.Title, getTableHtml(length - 1, 3), csstitle));
		cnt++;
	}
	for (var i = 0; i < length - 1; i++)
	{
		//if (remindIsEnabled(remind, i))
		//{
		var work = remindWorks.RemindWork[i];
		if (work.Count > 0)
		{
			var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
			//                html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 3), csstitle);
			html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 3), csstitle));
			cnt++;
		}
		//}
	}

	if (remindWorks.Count == 0)
	{
		//        html += '<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>';
		html.push('<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>');
	}

	//    html += "</table></div></td></tr></table>";
	html.push("</table></div></td></tr></table>");

	if (ieVersion <= 6)
	{
		//        html = '<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>' + html;
		html.unshift('<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>');
	}

	remindWorks.Html = html.join("");
}

// 为所有监听者设置提醒Html
function setWorkRemindHtmlForObservers()
{
	// modify by : wenghq 2013-05-10，将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接
//	var html = '<table class="idtbfix" style="width:100%;height:100%"><div>';
	var html = [];
	html.push('<table class="idtbfix" style="width:100%;height:100%"><div>');
 
    var length = remindWorks.RemindWork.length;
    //var remind = $("#hidRemind").val();
    //var length = remind.length;
    //if (length > remindWorks.RemindWork.length)
    //{
    //    length = remindWorks.RemindWork.length;
    //}
    
    var cnt = 0;
    for (var i = 0; i < length; i++)
    {
        //if (i==length-1||remindIsEnabled(remind, i))
        //{
            var work = remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
                //                html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 1,'isObserver'), csstitle);
                html.push(stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 1, 'isObserver'), csstitle));
                cnt++;
            }
        //}
    }
    
    if (remindWorks.Count == 0)
    {
    	//        html += '<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>';
    	html.push('<tr><td class="promptmsg">', remindDefine.NoWork, '</td></tr>');
    }

    //    html += "</table></div></td></tr></table>";
    html.push("</table></div></td></tr></table>");
    
    if (ieVersion <= 6)
    {
    	//        html = '<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>' + html;
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
	//var html = '<table border="0" cellpadding="1" cellspacing="0" style="width:100%"><tr>';
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
            }wo 
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
        	//            toolTip = remindDefine.DoName + iDoCnt + remindDefine.Unit + ", " + remindDefine.LookName + iLookCnt + remindDefine.Unit;
        	//            workNum = iDoCnt + "-" + iLookCnt;
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
        	//html += '</tr><tr>'
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
        
//        html += stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" '
//            + 'title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a>{6}</td>', colWidth, clickEvent, toolTip, name, workNum,
//            ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"',
//            (haveNew ? '<img src="../Image/home/new.gif" ondrag="return false" />' : ''));

        html.push(
		stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a>{6}</td>',
			colWidth, clickEvent, toolTip, name, workNum,
            ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"',
            (haveNew ? '<img src="../Image/home/new.gif" ondrag="return false" />' : '')));

        workCnt++;
    }
    
    if (workCnt % colsCnt != 0)
    {
    	//        html += '<td colspan="' + (colsCnt - workCnt % colsCnt) + '"></td>';
    	html.push('<td colspan="' , (colsCnt - workCnt % colsCnt) , '"></td>');
    }

//    html += '</tr></table>';
    html.push('</tr></table>');
    
    return html.join("");
}

// 收提醒
function receiveRemind(iModuleIndex, iWorkIndex)
{
    var iModuleDefIndex = getModuleIndexOfArr(iModuleIndex);
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
    
    //if (remindWorks.RemindWork[iModuleDefIndex].Work[iWorkIndex][5])
    //{
    //    remindWorks.RemindWork[iModuleIndex].Work[iWorkIndex][5] = false;
    //    remindWorks.News.splice($.inArray(iModuleIndex+ "-" + iWorkIndex, remindWorks.News), 1);
    //    setWorkRemindHtml();
    //}
}

// 存提醒
function saveRemind()
{
	/* modify by : wenghq 2013-05-10, 将方法中绝大部分拼接字符串的代码从用“+”号拼接改成使用数组对象拼接*/
	//    var work = "";
	var work = [];
	for (var i = 0; i < remindWorks.RemindWork.length; i++)
	{
		if (i > 0)
		{
			//            work += "#";
			work.push("#");
		}
		for (var j = 0; j < remindWorks.RemindWork[i].Work.length; j++)
		{
			var works = remindWorks.RemindWork[i].Work[j];
			if (j > 0)
			{
				//                work += ",";
				work.push(",");
			}
			//            work += works[3] + "-" + works[4];
			work.push(works[3], "-", works[4]);
		}
	}

	$("#hidWaitWork").val(work.join(""));
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

// 模块是否被启用【弃用，获取待办时，已在数据库中判断模块是否启用】
//function remindIsEnabled(remind, iModuleDefIndex)
//{
//    var bEnabled = false;
//    $.each(remindWorks.RemindWork[iModuleDefIndex].RemindIndex, function (i, index)
//    {
//        if (remind.charAt(index).toLowerCase() == 'y')
//        {
//            bEnabled = true;
//        }
//    });
//    return bEnabled;
//}

//根据模块序号获取该模块在remindWorks.RemindWork[]中的位置(数组序列)
function getModuleIndexOfArr(iModuleIndex)
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

function getWorkDefIndex(works, iWorkIndex)
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
    var iWorkDefIndex = getWorkDefIndex(works, iWorkIndex);

    if (iWorkDefIndex == -1)
    { return null; }

    return works[iWorkDefIndex];
}