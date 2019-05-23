// 提醒消息方法

// 设置待办工作字符串(from:0:Logo/1:待办工作)
function setWaitWork(from, strNewWork, strOldWork)
{
   
    if (!strNewWork)
    {
        return;
    }
    if (!strOldWork)
    {
        strOldWork = strNewWork;
    }
    var arrNewWork = strNewWork.split('#');
    var arrOldWork = strOldWork.split('#');
    if (arrNewWork.length != arrOldWork.length)
    {
        arrOldWork = arrNewWork;
    }
    
    var remind = $("#hidRemind").val();
    var length = remind.length;
    if (length > arrNewWork.length)
    {
        length = arrNewWork.length;
    }
    
    remindWorks.Count = 0;
    remindWorks.Height = 36;
    
    for (var i = 0; i < length; i++)
    {
      //邮件不检查授权
       if (i==length-1 || remindIsEnabled(remind, i))
       {
            setWorkRemind(i, arrNewWork[i], arrOldWork[i]);
        }
    }
    
    if (from == 0)
    {        
        remindWorks.Width = (remindWorks.Count > 0 ? 480 : 150);
        remindWorks.Height = (remindWorks.Count > 0 ? (remindWorks.Height > 500 ? 500 : remindWorks.Height) : 60);
        
        var src='../Image/home/' + (remindWorks.News.length > 0 ? 'remindnews.gif' : 'remind.gif' );
      
        $("#spWorkCnt").css({'background-image':'url('+src+')','background-repeat':'no-repeat','background-position':'left center','padding-left':16}).text(remindDefine.RemindName + (remindWorks.Count > 0 ? (remindWorks.Count + remindDefine.Unit) : remindDefine.NoRemind)); 
        
        setWorkRemindHtml();
        
        if (remindWorks.BeWillShow)
        {
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
                registerPopup();
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
function registerPopup()
{   
    var ret = getNewsObj(); 
    if(ret.length>0)
    {
        var caption = '<table class="idtbfix" style="height:100%"><tr>'
            + '<td style="width:22px;padding-left:5px"><img src="../Image/home/' + (remindWorks.News.length > 0 ? 'remindnews.gif' : 'remind.gif')
            + '" class="img_14" ' + (remindWorks.News.length > 0 ? 'title="' + remindDefine.NewsToolTip + '"' : '') + ' ondrag="return false"/></td>'
            + '<td><div>' + remindDefine.Caption + '</div></td></tr></table>';
            
        var message = '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">';
        //邮件显示在最前面
        if(remindWorks.RemindWork[ret[ret.length-1].RemindIndex].Title=='邮件管理')
        {
            var csstitle ="index_msg_title1";
            message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[ret[ret.length-1].RemindIndex].Title, getTableHtml(ret[ret.length-1].RemindIndex, 1,ret[ret.length-1].Works),csstitle);
        } 
        $.each(ret,function(i,work){
            if(remindWorks.RemindWork[work.RemindIndex].Title != '邮件管理')
            { 
                var csstitle = (i == 0 ? "index_msg_title1" : "index_msg_title2");
                message += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', remindWorks.RemindWork[work.RemindIndex].Title, getTableHtml(work.RemindIndex, 1,work.Works),csstitle);
            } 
        });        
        message += '</table>';
        
        var pop = new Popup('WaitWork',200,200,caption,message);
        pop.closeCallbacks.push(function(me){                                    
            if(me.closeByBtn)
            {//手动点击关闭时，才停止闪烁标题                
                flashTitle(false,false);
            }
        });
        pop.show();
        //PopupManager.getInstance().addPopup(pop);
    }
}

//获取新消息的格式数据,返回  [{RemindIndex:*,Works:[]},{RemindIndex:*,Works:[]}...]的格式
function getNewsObj()
{
    var ret = []; 
    if(remindWorks.News.length<=0)
    {
        return ret;
    }
    $.each(remindWorks.News,function(i,work){
        var remindIndex = parseInt(work.split('-')[0],10);
        var workIndex = parseInt(work.split('-')[1],10);
        var existsIndex = -1;
        $.each(ret,function(i,remind){
            if(remind.RemindIndex == remindIndex)
            {
                existsIndex = i; return;
            }
        });
        if(existsIndex == -1)
        {
            ret.push({RemindIndex:remindIndex,Works:[workIndex]});
        }
        else
        {
            ret[existsIndex].Works.push(workIndex);
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

// 设置某个模块的工作提醒，参数iModuleIndex可为从0至7的任何数字，依次表示EWM、OA、CCM、PBM、POM、KM、SM
function setWorkRemind(iModuleIndex, strNewWork, strOldWork)
{    
    var arrNewWork = strNewWork.split(',');
    var arrOldWork = strOldWork.split(',');
    var workCnt = 0;

    remindWorks.RemindWork[iModuleIndex].Work.sort(function(x, y){return x[0] - y[0];});
    var work = remindWorks.RemindWork[iModuleIndex];
    work.Count = 0;
        
    for (var i = 0; i < work.Work.length; i++)
    {
        var works = work.Work[i];
        var arrNewCnt = arrNewWork[works[1]].split("-");
        var arrOldCnt = arrOldWork[works[1]].split("-");
        
        var iNewWaitDo = 0
        var iNewLook = 0
        var iOldWaitDo = 0
        var iOldLook = 0
        
        iNewWaitDo = parseInt(arrNewCnt[0], 10);
        iOldWaitDo = parseInt(arrOldCnt[0], 10);
        
        if (arrNewCnt.length > 1)
        {
            iNewLook = parseInt(arrNewCnt[1], 10);
            iOldLook = parseInt(arrOldCnt[1], 10);
        }
        
        works[3] = iNewWaitDo;
        works[4] = iNewLook;
        if (iNewWaitDo + iNewLook > iOldWaitDo + iOldLook)
        {
            works[5] = true;
            if ($.inArray(iModuleIndex + "-" + i, remindWorks.News) == -1)
            {
                remindWorks.News.push(iModuleIndex + "-" + i);
            }
            remindWorks.BeWillShow = true;
        }
        if (iNewWaitDo + iNewLook > 0)
        {
            workCnt++;
        }
        
        work.Count += iNewWaitDo + iNewLook;
    }
    
    remindWorks.Count += work.Count;
    
    if (work.Count > 0)
    {
        var lineCnt = parseInt(workCnt / 3, 10);
        remindWorks.Height += (34 + (workCnt % 3 == 0 ? lineCnt : (lineCnt + 1)) * 18);
    }
}

// 设置提醒Html
function setWorkRemindHtml()
{
    var html = '<table class="idtbfix index_msg_border" style="height:100%"><tr><td class="index_msg_header">'
        + '<table class="idtbfix" style="height:100%"><tr>'
//        + '<td style="width:22px;padding-left:5px"><img src="../Image/home/' + (remindWorks.News.length > 0 ? 'remindnews.gif' : 'remind.gif')
//        + '" class="img_14" ' + (remindWorks.News.length > 0 ? 'title="' + remindDefine.NewsToolTip + '"' : '') + ' ondrag="return false"/></td>'
        + '<td><div style=\'padding-left:3px\'>' + remindDefine.Caption + '</div></td><td class="index_msg_close" onclick="parent.hidePopup()"></td>'
        + '</tr></table>'
        + '</td></tr><tr><td class="idtd index_msg_info"><div class="index_msg_info_div">'
        + '<table border="0" cellpadding="4" cellspacing="0" style="width:100%">'
 
    var remind = $("#hidRemind").val();
    var length = remind.length;
    if (length > remindWorks.RemindWork.length)
    {
        length = remindWorks.RemindWork.length;
    }
    
    var cnt = 0;
     //邮件放到最前面
  
     var mailwork=remindWorks.RemindWork[length-1];
    if(mailwork.Count > 0)
    {
         var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
         html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', mailwork.Title, getTableHtml(length-1, 3), csstitle);
         cnt++;
    }
    for (var i = 0; i < length-1; i++)
    {
        if (remindIsEnabled(remind, i))
        {
            var work = remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
                html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 3), csstitle);
                cnt++;
            }
        }
    }
    
    if (remindWorks.Count == 0)
    {
        html += '<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>';
    }
    
    html += "</table></div></td></tr></table>";
    
    if (ieVersion <= 6)
    {
        html = '<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>' + html;
    }
    
    remindWorks.Html = html;
}

// 为所有监听者设置提醒Html
function setWorkRemindHtmlForObservers()
{       
    var html = '<table class="idtbfix" style="width:100%;height:100%"><div>';
 
    var remind = $("#hidRemind").val();
    var length = remind.length;
    if (length > remindWorks.RemindWork.length)
    {
        length = remindWorks.RemindWork.length;
    }
    
    var cnt = 0;
    for (var i = 0; i < length; i++)
    {
        if (i==length-1||remindIsEnabled(remind, i))
        {
            var work = remindWorks.RemindWork[i];
            if (work.Count > 0)
            {
                var csstitle = (cnt == 0 ? "index_msg_title1" : "index_msg_title2");
                html += stringFormat('<tr><td class="{2}">{0}</td></tr><tr><td>{1}</td></tr>', work.Title, getTableHtml(i, 1,'isObserver'), csstitle);
                cnt++;
            }
        }
    }
    
    if (remindWorks.Count == 0)
    {
        html += '<tr><td class="promptmsg">' + remindDefine.NoWork + '</td></tr>';
    }
    
    html += "</table></div></td></tr></table>";
    
    if (ieVersion <= 6)
    {
        html = '<iframe style="width:100%;height:100%;position:absolute;z-index:-1" frameborder="0"></iframe>' + html;
    }
    
    remindWorks.CallbackHtml = html;
}

// 将各项工作内容均布在以colsCnt为列数的表格的单元格中
// 如果第三个参数不为空且值为isObserver，则表示是观察者调用
// 如果第三个参数不为空且值为数组，则表示是传递的是具有新消息的工作项索引数组
function getTableHtml(iModuleIndex, colsCnt)
{
    var html = '<table border="0" cellpadding="1" cellspacing="0" style="width:100%"><tr>';
    var colWidth = 100.0 / colsCnt;
    
    var workCnt = 0;
    var arrWork = remindWorks.RemindWork[iModuleIndex].Work;
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
        var toolTip = "";
        var workNum = "";
        
        if (iDoCnt > 0 && iLookCnt > 0)
        {
            toolTip = remindDefine.DoName + iDoCnt + remindDefine.Unit + ", " + remindDefine.LookName + iLookCnt + remindDefine.Unit;
            workNum = iDoCnt + "-" + iLookCnt;
        }
        else if (iDoCnt + iLookCnt > 0)
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
            html += '</tr><tr>'
        }
        
        var clickEvent ='';
        if(arguments.length==3 && arguments[2] == "isObserver" )
        {
            //所有监听窗口，需要自定义remindClickCallback来响应点击待办
            clickEvent= stringFormat('remindClickCallback(\'{0}\',null,{1})',waitUrl, iModuleIndex);
        }
        else
        {
            clickEvent= stringFormat('parent.showWaitWork(\'{0}\',null,{1},{2})',waitUrl, iModuleIndex, i);
        }
        html += stringFormat('<td style="width:{0}%" nowrap><a onclick="{1}" class="font hand" '
            + 'title="{2}"{5}>{3}[<span style="color:red">{4}</span>]</a>{6}</td>', colWidth, clickEvent, toolTip, name, workNum,
            ' style="text-decoration:none" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'\'"',
            (haveNew ? '<img src="../Image/home/new.gif" ondrag="return false" /><bgsound src="../Image/Sound/msg.mp3" loop="1">' : ''));       

        workCnt++;
    }
    
    if (workCnt % colsCnt != 0)
    {
        html += '<td colspan="' + (colsCnt - workCnt % colsCnt) + '"></td>';
    }
    
    html += '</tr></table>';
    
    return html;
}

// 收提醒
function receiveRemind(iModuleIndex, iWorkIndex)
{
    if (remindWorks.RemindWork[iModuleIndex].Work[iWorkIndex][5])
    {
        remindWorks.RemindWork[iModuleIndex].Work[iWorkIndex][5] = false;
        remindWorks.News.splice($.inArray(iModuleIndex+ "-" + iWorkIndex, remindWorks.News), 1);
        setWorkRemindHtml();
    }
}

// 存提醒
function saveRemind()
{
    var work = "";
    for (var i = 0; i < remindWorks.RemindWork.length; i++)
    {
        if (i > 0)
        {
            work += "#";
        }
        for (var j = 0; j < remindWorks.RemindWork[i].Work.length; j++)
        {
            var works = remindWorks.RemindWork[i].Work[j];
            if (j > 0)
            {
                work += ",";
            }
            work += works[3] + "-" + works[4];
        }
    }
    
    $("#hidWaitWork").val(work);
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

// 是否启用提醒
function remindIsEnabled(remind, i)
{   
    
    for (var j = 0; j < remindWorks.RemindWork[i].RemindIndex.length; j++)
    {
        if (remind.charAt(remindWorks.RemindWork[i].RemindIndex[j]) == "Y")
        {    
            return true;
        }
    }
    return false;
}