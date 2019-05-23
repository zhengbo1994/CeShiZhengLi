// 甘特图控件有关方法

// model：0:项目计划/1:项目计划调整/2:任务查看页/3:任务导入/4:历史计划查看/5:项目开发计划执行总览/6:任务分解/7:模板调整/8:模板查看/9:采购计划甘特图/10:基本任务库
// cols：要显示的列
var gtData, gtMap, model, cols;

/*
XmlPath:甘特图XML数据源的存放域
Container:甘特图呈现到哪个域内
IsFuncWBS:是否职能计划
IsProjectMainWBS:是否项目主项计划
ExistsMulitiExecVersion:是否存在多个基准版（用于显示调整时间、基准时间）
*/
var nativeConfig = { 'XmlPath': 'hidXmlPath', 'Container': 'divGantt', 'IsFuncWBS': 'false', 'IsProjectMainWBS': false, 'ExistsMultiExecVersion': false };

/** 
*  实现数字向汉字的转换，如 "12"=>"十二"
来源：http://topic.csdn.net/t/20031201/11/2513340.html
*   @param   inString         (String)输入的阿拉伯数字字符串(如:   "13800138000 ") 
*   @param   isUpcase         (boolean)输出汉字数码大小写指示(如:   false) 
*   @param   times               (String)阶数(如:   "个万亿兆... ") 
*   @param   errorCode       (String)错误时(溢出,空值,...)归零显示(如:   "E ") 
*   @return   ~errorCode 
*   @return   ~OUT               (String)转换后的汉字数码(如:   "一百三十八亿〇一十三万八千 ") 
*/
function changeDigitToHanzi(inString, isUpcase, times, errorCode)
{
    /**   变量定义   **/
    var base, digit;                                                       //   times:   阶数( "个万亿兆... ") 
    if (isUpcase)
    {
        base = "个拾佰仟 ";                                             //   base:   位数 
        digit = "零壹贰叁肆伍陆柒捌玖 ";                   //   digit:   汉字数码串(大写) 
    }
    else
    {
        base = "个十百千 ";
        digit = "〇一二三四五六七八九 ";
    }
    var sLen, b, t, bLen;
    sLen = inString.length;                                           //   输入字符串的长度 
    bLen = base.length;                                                   //   位数的长度 
    if (sLen > bLen * times.length || sLen < 1)             //   溢出归零 
        return errorCode;
    b = (sLen - 1) % bLen;                                                     //   当前数码在base中的位置 
    t = Math.floor((sLen - 1) / bLen);                             //   当前数码在times中的位置 
    var i, at, zero;
    i = 0;                                                                             //   at某个位上的数码,   i循环计数 
    zero = " ";                                                                     //   保存数字中的0值 
    var OUT;
    OUT = " ";                                                                     //   输出汉字数码 
    /**   开始   **/
    at = inString.charCodeAt(i) - 48;                           //   处理 "一十二 "为 "十二 ",   此时i=0 
    if (at == 1 && b == 1)
    {
        OUT += base.charAt(b--);
        i += 1;                                                                   //   此时,   i=1     
    }
    while (i < sLen)
    {
        at = inString.charCodeAt(i++) - 48;
        if (b != 0)
        {
            if (at != 0)
            {
                OUT += zero;
                zero = " ";
                OUT += digit.charAt(at);
                OUT += base.charAt(b);
            }
            else
                zero = digit.charAt(0);                   //   此时,   zero= "零 "或 "〇 " 
            b--;
        }
        else
        {
            if (at != 0)
            {
                OUT += zero;
                OUT += digit.charAt(at);
            }
            zero = " ";
            if (t != 0) OUT += times.charAt(t--);
            b = bLen - 1;
        }
    }
    return OUT;
}
//移除所有任务，主要用于搜索等改变甘特图数据的地方。
//目的是防止数据改变后，仍然保留的是全部数据。
SFData.prototype.clearAllTasks = function ()
{
    window['Gantt_All_Tasks'] = null;
}
//获取所有的任务（gtData.getAllTasks())
SFData.prototype.getAllTasks = function ()
{
    if (window['Gantt_All_Tasks'])
    {
        return window['Gantt_All_Tasks'];
    }
    var tasks = [];
    var task = this.getRootTask().getNext();
    while (task != null)
    {
        tasks.push(task);
        task = task.getNext();
    }

    window['Gantt_All_Tasks'] = tasks;
    return window['Gantt_All_Tasks'];
}
//获取某个大纲级别上的所有任务(gtData.getTasks(iOutlineNumber));
//iOutlineNumber:int 级别，为空时，获取所有任务
SFData.prototype.getTasks = function (iOutlineNumber)
{
    var tasks = this.getAllTasks();
    if (null == iOutlineNumber)
    {
        return tasks;
    }
    return $.grep(tasks, function (task, i)
    {
        return (task.OutlineNumber != '0') && (task.OutlineNumber.split('.').length == iOutlineNumber);
    });
}
//获取当前甘特图最大的大纲级别gtData.getMaxOutlineNumber()
SFData.prototype.getMaxOutlineNumber = function ()
{
    var max = 0;
    var tasks = this.getAllTasks();
    $.each(tasks, function (i, task)
    {
        if (task.OutlineNumber.split('.').length > max)
        {
            max = task.OutlineNumber.split('.').length;
        }
    });
    return max;
}
//查看某个级别的任务（除了所有任务外，其下级别的任务都会隐藏，类似于MS Project)
//gtMap.viewOutlineLevel(iOutlineNumber)
//iOutlineNumber:大纲级别
SFGantt.prototype.viewOutlineLevel = function (iOutlineNumber)
{
    var allTasks = gtData.getAllTasks();
    $.each(allTasks, function (i, task)
    {
        task.setProperty('Collapse', false);
    });
    if (null == iOutlineNumber)
    {
        return;
    }
    var curLevelTasks = gtData.getTasks(iOutlineNumber);
    $.each(curLevelTasks, function (i, task)
    {
        task.setProperty('Collapse', true);
    });
}
//根据当前最大的大纳级别，将可选择的查看范围绑定到一个select元素上（含查看所有子任务）
//特别注意，调用该方法时，需要在甘特图已显示后。
//gtMap.bindOutlineLevelToDDL(select)
//ddlLevel:select元素DOM对象
SFGantt.prototype.bindOutlineLevelToDDL = function (ddlLevel)
{
    gtData.clearAllTasks();
    ddlLevel.options.length = 0;
    addOptionAt(ddlLevel, '', '所有子任务', 0);
    var maxOutlineNumber = gtData.getMaxOutlineNumber();
    for (var i = 1; i <= maxOutlineNumber; i++)
    {
        addOptionAt(ddlLevel, i, '大纲级别 ' + i, i);
    }
}
//生成大纲级别连接HTML（一般放在描述区）
//特别注意，调用该方法时，需要在甘特图已显示后。
//gtMap.buildViewOutlineLevel();
SFGantt.prototype.buildViewOutlineLevel = function ()
{
    gtData.clearAllTasks();
    var maxOutlineNumber = gtData.getMaxOutlineNumber();
    var html = '';
    for (var i = 1; i <= maxOutlineNumber; i++)
    {
        html += '<a href="#ShowOutlineNumber" onclick="gtMap.viewOutlineLevel(' + i + ')">[' + changeDigitToHanzi(i.toString(), false, '个十百千', 'E') + ']</a>';
    }
    return html;
}
//获取模糊匹配关键词的任务列表（返回UID集合)
SFData.prototype.getFuzzyTasks = function (keyWord)
{
    var mappedUIDS = [];
    var tasks = this.getAllTasks();
    $.each(tasks, function (i, task)
    {
        if (task.Name.indexOf(keyWord) != -1)
        {
            mappedUIDS.push(task.UID);
        }
    });
    return mappedUIDS;
}
//关键字定位
SFData.prototype.locateTask = function (keyWord)
{
    if (keyWord.length <= 0)
    {
        gtMap.scrollToElement(gtData.getRootTask().getFirstChild(), 0);
        return;
    }
    if (!window['Gantt_OriKey'] || (keyWord != window['Gantt_OriKey']))
    {
        window['Gantt_OriKey'] = keyWord;
        window['Gantt_FocuedIndex'] = -1;
    }
    var mappedTasks = gtData.getFuzzyTasks(window['Gantt_OriKey']);
    if (mappedTasks && mappedTasks.length >= 1)
    {
        window['Gantt_FocuedIndex'] += 1;
        if (window['Gantt_FocuedIndex'] >= mappedTasks.length)
        {
            window['Gantt_FocuedIndex'] = 0;
        }
        gtMap.scrollToElement(gtData.getTaskByUid(mappedTasks[parseInt(window['Gantt_FocuedIndex'])]), 0);
        gtMap.setSelectedElement(gtData.getTaskByUid(mappedTasks[parseInt(window['Gantt_FocuedIndex'])]));
    }
}

// 通过xml文件加载甘特图
// @showModel　显示模式，必选
// @arguments[1] xml容器ID , 可选
//function loadGantt(showModel)
//{
//    model = showModel;

//    var xmlContainer = arguments.length > 1 ? arguments[1] : 'hidXmlPath';

//    if ($('#' + xmlContainer).val() != "")
//    {
//        $('#' + xmlContainer).val('');
//        SFAjax.loadXml($('#' + xmlContainer).val(), drawGantt);
//    }
//}

// 通过xml字符串加载甘特图
// @showModel　显示模式，必选
// @arguments[1] json对象，{xmlContainer:'',ganttContainer:''} , 可选
function loadGanttByXml(showModel)
{
    model = showModel;

    var _nativeConfig = nativeConfig;
    if (arguments.length > 1 && typeof arguments[1] === 'object')
    {
        $.extend(_nativeConfig, arguments[1]);
    }

    /*
    var xmlContainer = 'hidXmlPath';
    var ganttContainer = 'divGantt';

    if (arguments.length > 1 && typeof arguments[1] === 'object')
    {
    xmlContainer = arguments[1].xmlContainer;
    ganttContainer = arguments[1].ganttContainer;
    }
    */

    var xmlContent = $('#' + _nativeConfig.XmlPath).val();

    if (xmlContent != "")
    {
        var doc = SFAjax.createDocument(xmlContent);
        // drawGantt(doc, ganttContainer);
        drawGantt(doc, _nativeConfig);
    }
}

// 呈现甘特图
// @doc  甘特图内容，必选
// @arguments[1]  甘特图容器，可选项
function drawGantt(doc)
{
    ajaxLoading();

    // var ganttContainer = arguments.length > 1 ? arguments[1] : 'divGantt';

    var _nativeConfig = arguments.length > 1 ? arguments[1] : nativeConfig;

    if (null != gtMap)
    {
        gtMap.depose();
        gtMap = null;
        gtData = null;
    }

    if (getObj(_nativeConfig.Container))
    {
        getObj(_nativeConfig.Container).innerHTML = '';
    }

    // 初始化一个页面上的配置对象
    var gtConfig = new SFConfig();

    gtConfig.setConfig("SFGantt/taskStyle/TaskImportant",
	{
	    percentBarStyle: { backgroundColor: "blue", color: 'gray' },
	    listStyle: { backgroundColor: 'white', color: 'red' },
	    listSelectedStyle: { backgroundColor: 'red', color: 'black' }
	});

    // 月度计划样式
    gtConfig.setConfig("SFGantt/taskStyle/DistinguishTask",
	{
	    listStyle: { backgroundColor: '#F0F8FF', color: 'black' },
	    listSelectedStyle: { backgroundColor: '#D5D5D5', color: 'black' }
	});

    gtConfig.setConfig("SFGantt/container", _nativeConfig.Container);
    gtConfig.setConfig("SFGantt/imgPath", "/" + rootUrl + "/Image/Gantt/img/");
    gtConfig.setConfig("SFGantt/imgType", ".gif");
    gtConfig.setConfig("SFGantt/taskIdFieldNames", "ID");

    if (model == 0 || model == 2 || model == 5 || model == 9)
    {
        gtConfig.setConfig("SFGantt/isTracking", true);
    }

    // model == 0 项目开发（年度、季度、月度）、专项计划（年度、季度、月度）一览
    // model == 1 主项计划、年度主项计划、专项计划、部门年度职能计划、部门月度计划编制/调整
    // model == 2 任务查看
    // model == 3 任务导入
    // model == 4 
    // model == 5 项目开发（年度、季度、月度）、专项计划（年度、季度、月度）执行一览
    // model == 6
    // model == 7
    // model == 8 计划模板查看
    // model == 9
    // model == 10 主项计划基本库


//    if (model == 0 || model == 5)
//    {
//        gtConfig.setConfig("SFGanttTasksMap/taskStyle", "DistinguishTask");
//    }

    gtConfig.setConfig("SFGantt/readOnly", true);
    gtConfig.setConfig("SFGanttField/dateShowFormat", "yyyy-MM-dd");

    var adapter = new SFDataProject(doc);

    var companyIsBN = ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'BAONENGJT');

    // 添加属性
    if (model == 0 || model == 1 || model == 2 || model == 4 || model == 5 || model == 6 || model == 7 || model == 8 || model == 10)
    {
        //任务专业
        adapter.addTaskProperty("SortName", "SortName", SFDataRender.types.String);
        //任务性质
        adapter.addTaskProperty("WBSOption", "WBSOption", SFDataRender.types.String);
        //任务类型
        //注意：任务类型与数据库中PlanType或TaskType列含义不是一样的，这里指的是：全部、工程任务、阶段性成果、会议决策、其他
        adapter.addTaskProperty("WBSType", "WBSType", SFDataRender.types.String);

        //计划开始时间
        adapter.addTaskProperty("PlanStartDate", "PlanStartDate", SFDataRender.types.Time);
        //计划结束时间
        adapter.addTaskProperty("PlanEndDate", "PlanEndDate", SFDataRender.types.Time);
        //计划工期
        adapter.addTaskProperty("Duration", "Duration", SFDataRender.types.Int);
        //实际开始时间
        adapter.addTaskProperty("ActualStartDate", "ActualStartDate", SFDataRender.types.Time);
        //实际结束时间
        adapter.addTaskProperty("ActualEndDate", "ActualEndDate", SFDataRender.types.Time);
        //实际工期
        adapter.addTaskProperty("ActualDuration", "ActualDuration", SFDataRender.types.Int);

        ////计划时间，指的是一个日期范围，如 2010-10-11 ~ 2011-1-12 (*天）
        //adapter.addTaskProperty("PlanDateRange", "PlanDateRange", SFDataRender.types.String);
        ////实际时间，指的是一个日期范围，如 2010-10-11 ~ 2011-1-12 (*天）        
        //adapter.addTaskProperty("ActualDateRange", "ActualDateRange", SFDataRender.types.String);
        //预计延迟时间
        adapter.addTaskProperty("ExpectedDelayDays", "ExpectedDelayDays", SFDataRender.types.String);
        // 成效衡量
        adapter.addTaskProperty("InputMessage", "InputMessage", SFDataRender.types.String);
        //计划描述
        adapter.addTaskProperty("Notes", "Notes", SFDataRender.types.String);

        //延迟时间,(*天）
        adapter.addTaskProperty("DelayDays", "DelayDays", SFDataRender.types.String);
        //任务状态
        adapter.addTaskProperty("WBSState", "WBSState", SFDataRender.types.String);
        //监督人岗位
        adapter.addTaskProperty("SuperviseStationName", "SuperviseStationName", SFDataRender.types.String);
        //监督人部门
        adapter.addTaskProperty("SuperviseDeptName", "SuperviseDeptName", SFDataRender.types.String);
    }
    adapter.addTaskProperty("CID", "CID", SFDataRender.types.String);

    adapter.addTaskProperty("TaskLevel", "TaskLevel", SFDataRender.types.String);

    adapter.addTaskProperty("DutyDept", "DutyDept", SFDataRender.types.String);
    adapter.addTaskProperty("DutyMan", "DutyMan", SFDataRender.types.String);

    if (model == 5)
    {
        adapter.addTaskProperty("ExpectedSD", "ExpectedSD", SFDataRender.types.Time);
        adapter.addTaskProperty("ExpectedED", "ExpectedED", SFDataRender.types.Time);
        // 主责部门
        adapter.addTaskProperty("MainDeptName", "MainDeptName", SFDataRender.types.String);
    }

    if (model == 0 || model == 1 || model == 2 || model == 4 || model == 5)
    {
        adapter.addTaskProperty("StandardSD", "StandardSD", SFDataRender.types.Time);
        adapter.addTaskProperty("StandardED", "StandardED", SFDataRender.types.Time);
        adapter.addTaskProperty("StandardD", "StandardD", SFDataRender.types.Int);
    }

    if (model == 0 || model == 5)
    {
        adapter.addTaskProperty("HasRelatedWBS", "HasRelatedWBS", SFDataRender.types.String);

        adapter.addTaskProperty("DistinguishType", "DistinguishType", SFDataRender.types.String);
    }

    if (model == 0 || model == 2 || model == 5 || model == 9)
    {
        adapter.addTaskProperty("EWType", "EWType", SFDataRender.types.String);

        //状态图颜色
        adapter.addTaskProperty("StateColor", "StateColor", SFDataRender.types.String);
    }
    else if (model == 1 || model == 6 || model == 7 || model == 10)
    {
        adapter.addTaskProperty("Info", "Info", SFDataRender.types.String);

        if (model == 1 || model == 7)
        {
            adapter.addTaskProperty('SubjectSonWBSNum', 'SubjectSonWBSNum', SFDataRender.types.Int);
            adapter.addTaskProperty('IsSubjectWBS', 'IsSubjectWBS', SFDataRender.types.String);
            adapter.addTaskProperty('WBSNo', 'WBSNo', SFDataRender.types.String);
        }
    }

    /*
    定义计划开始、结束时间的显示名称   

    如果不是基准版，则只显示基准时间。

    如果是基准版，但是，目前是基准版第一版编制过程，则只显示基准时间。
    如果是基准版，但是，目前是基准版第一版查看（一览），则只显示基准时间。
    如果是基准版，但是，目前已经是基准版的变更 过程 ，则显示基准时间和调整时间。
    如果是基准版（且不止一版），那么查看（一览）时，显示基准时间和调整时间。

    特别注意：在非基准版或第一版基准版时，PlanStartDate和PlanEndDate值名字是基准时间。
    如果是基准版且不是第一版时，这两个值就变为调整时间 ，相应的基准时间变为StandardSD和StandardED。

    bShowBasicDateName表示时间标题是否显示为“基准”，只有主项计划才显示。
    bShowAdjustDate表示是否显示调整时间（只有是主项计划、且是有多个执行版时）。
        
    */

    var ssdHeadName = '调整开始时间',
        sedHeadName = '调整结束时间',
        sdHeadName = '调整工期',

        psdHeadName = '基准开始时间',
        pedHeadName = '基准结束时间',
        pdHeadName = '基准工期',

        bShowBasicDateName = _nativeConfig.IsProjectMainWBS,
        bShowAdjustDate = _nativeConfig.IsProjectMainWBS
                         &&
                          _nativeConfig.ExistsMultiExecVersion
                         && (model == '0' || model == '1' || model == '2' || model == '4' || model == '5')
                        ;

    if (!bShowBasicDateName)
    {
        psdHeadName = '计划开始时间';
        pedHeadName = '计划结束时间';
        pdHeadName = '计划工期';
    }
    else if (bShowAdjustDate)
    {
        psdHeadName = '计划/调整开始时间';
        pedHeadName = '计划/调整结束时间';
        pdHeadName = '调整工期';

        ssdHeadName = '基准开始时间';
        sedHeadName = '基准结束时间';
        sdHeadName = '基准工期';
    }

    SFGanttField.setTaskField("Name", new SFGanttFieldTreeName({ width: 280, bodyData: "Name", headText: "任务名称", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));
    SFGanttField.setTaskField("InputMessage", new SFGanttField({ width: 150, bodyData: "InputMessage", headText: "成效衡量", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'left'} }));
    SFGanttField.setTaskField("Notes", new SFGanttField({ width: 150, bodyData: "Notes", headText: "计划描述", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'left'} }));
    if (model != 9)
    {
        SFGanttField.setTaskField("TaskLevel", new SFGanttField({ width: 80, bodyData: "TaskLevel", headText: "任务级别", ReadOnly: true, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap'} }));
        SFGanttField.setTaskField("TaskSort", new SFGanttField({ width: 100, bodyData: "SortName", headText: "任务专业", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));

        SFGanttField.setTaskField("TaskOption", new SFGanttField({ width: 100, bodyData: "WBSOption", headText: "任务性质", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            if (!data) { return; }
            switch (data)
            {
                case '0':
                    cell.appendChild(document.createTextNode('任务'));
                    break;
                case '1':
                    cell.appendChild(document.createTextNode('里程碑'));
                    break;
                case '2':
                    cell.appendChild(document.createTextNode('任务组'));
                    break;
                default:
                    return;
            }
        }, bodyStyle: { whiteSpace: 'nowrap' }
        }));
        SFGanttField.setTaskField("TaskType", new SFGanttField({ width: 100, bodyData: "WBSType", headText: "任务类型", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));

        SFGanttField.setTaskField("PlanStartDate", new SFGanttField({ width: 120, bodyData: "PlanStartDate", headText: psdHeadName + "<br/>E", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            if (null != data && data.getFullYear() != '1900')
            {
                cell.innerHTML = data.Format("yyyy-MM-dd");
            }
        }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));
        SFGanttField.setTaskField("PlanEndDate", new SFGanttField({
            width: 120, bodyData: "PlanEndDate", headText: pedHeadName + "<br/>F", ReadOnly: true, bodyFunc: function (cell, task, list)
            {
                var data = task.getProperty(this.bodyData);
                if (null != data && data.getFullYear() != '1900')
                {
                    cell.innerHTML = data.Format("yyyy-MM-dd");
                }
            }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));
        SFGanttField.setTaskField("ActualStartDate", new SFGanttField({ width: 100, bodyData: "ActualStartDate", headText: "实际开始时间<br/>M", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            if (null != data && data.getFullYear() != '1900')
            {
                cell.innerHTML = data.Format("yyyy-MM-dd");
            }
        }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));
        SFGanttField.setTaskField("ActualEndDate", new SFGanttField({ width: 100, bodyData: "ActualEndDate", headText: "实际结束时间<br/>N", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            if (null != data && data.getFullYear() != '1900')
            {
                cell.innerHTML = data.Format("yyyy-MM-dd");
            }
        }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));
        SFGanttField.setTaskField("ActualDuration", new SFGanttField({ width: 80, bodyData: "ActualDuration", headText: "实际工期<br/>O=N-M", ReadOnly: true, bodyStyle: { textAlign: 'right'} }));

        if (model == 5)
        {

            SFGanttField.setTaskField("ExpectedSD", new SFGanttField({
                width: 100, bodyData: "ExpectedSD", headText: "预计开始日期<br/>K", ReadOnly: true, bodyFunc: function (cell, task, list)
                {
                    var data = task.getProperty(this.bodyData);
                    if (null != data && data.getFullYear() != '1900')
                    {
                        cell.innerHTML = data.Format("yyyy-MM-dd");
                    }
                }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
            }));

            SFGanttField.setTaskField("ExpectedED", new SFGanttField({
                width: 100, bodyData: "ExpectedED", headText: "预计结束日期<br/>L", ReadOnly: true, bodyFunc: function (cell, task, list)
                {
                    var data = task.getProperty(this.bodyData);
                    if (null != data && data.getFullYear() != '1900')
                    {
                        cell.innerHTML = data.Format("yyyy-MM-dd");
                    }
                }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
            }));
        }
        SFGanttField.setTaskField("ExpectedDelayDays", new SFGanttField({ width: 100, bodyData: "ExpectedDelayDays", headText: "预计延迟时间<br/>P=L-F", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'right'} }));
        SFGanttField.setTaskField("DelayDays", new SFGanttField({ width: 100, bodyData: "DelayDays", headText: "延迟时间<br/>Q=N-F", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'right'} }));
        SFGanttField.setTaskField("WBSState", new SFGanttField({ width: 80, bodyData: "WBSState", headText: "任务状态", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            cell.innerHTML = getStateText(data);
        }, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'right' }
    }));

        SFGanttField.setTaskField("SuperviseStationName", new SFGanttField({ width: 120, bodyData: "SuperviseStationName", headText: "监督人岗位", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'left'} }));
        SFGanttField.setTaskField("SuperviseDeptName", new SFGanttField({ width: 100, bodyData: "SuperviseDeptName", headText: "监督人部门", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'left'} }));
    } // end if model != 9

    SFGanttField.setTaskField("DutyDept", new SFGanttField({ width: 100, bodyData: "DutyDept", headText: "责任部门", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));
    SFGanttField.setTaskField("DutyMan", new SFGanttField({ width: 160, bodyData: "DutyMan", headText: "责任岗位", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));

    if (model == 0 || model == 1 || model == 2 || model == 4 || model == 5 || model == 6 || model == 7 || model == 8 || model == 10)
    {
        SFGanttField.setTaskField("Duration", new SFGanttField({ width: 80, bodyData: "Duration", headText: pdHeadName + "<br/>G=F-E", ReadOnly: true, bodyStyle: { textAlign: 'right'} }));
        //SFGanttField.getTaskField("PercentComplete").setHeadText("进度(%)");

        if ($("#hidPublishCompany").val() == "YTJT-ERP")
        {
            SFGanttField.getTaskField("PercentComplete").setHeadText("进度(%)");
        }
        else
        {
            //自带进度列，不支持小数位，所以使用自定义列
            SFGanttField.setTaskField("PercentComplete", new SFGanttField({
                width: 80, bodyData: "PercentComplete", headText: "进度(%)", ReadOnly: true, bodyStyle: { textAlign: 'right' }
            }));
        }
    }
    else
    {
        SFGanttField.getTaskField("PercentComplete").setHeadText("进度(%)");
    }

    if (model == 0 || model == 5)
    {
        SFGanttField.setTaskField("RelationWBS", new SFGanttField({ width: 100, bodyData: "CID", headText: "关联任务<br/>R", ReadOnly: true, bodyFunc: function (cell, task, list)
        {
            var data = task.getProperty(this.bodyData);
            if (!data) { cell.innerHTML = ""; return; }
            var hasRelatedWBS = task.getProperty("HasRelatedWBS");
            if (!hasRelatedWBS) { cell.innerHTML = ""; return; }
            if (hasRelatedWBS != "Y") { cell.innerHTML = ""; return; }
            var wbsID = data.split(".")[1];
            cell.innerHTML = '<a href="javascript:void(0);" onclick="openWindow( \'/' + rootUrl + '/POM/Plan/VWBSBrowse.aspx?ShowIndex=14&WBSID=' + wbsID + '\',950,700);\">关联任务</a>';
        }, bodyStyle: { whiteSpace: 'nowrap', textAlign: 'center' }
        }));

        SFGanttField.setTaskField("DistinguishType", new SFGanttField({ width: 50, bodyData: "DistinguishType", headText: "是否月度计划", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));
        if (model == 5)
        {
            SFGanttField.setTaskField("MainDeptName", new SFGanttField({ width: 100, bodyData: "MainDeptName", headText: "主责部门", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));
        }
    }

    if (model == 1 || model == 7)
    {
        SFGanttField.setTaskField("WBSNo", new SFGanttField({ width: 120, bodyData: "WBSNo", headText: "任务编码", ReadOnly: true, bodyStyle: { whiteSpace: 'nowrap'} }));
    }
    
    var startDate = SFGanttField.getTaskField("Start");
    startDate.setBodyAlign("center");
    startDate.setHeadText(psdHeadName + "<br/>E");
    startDate.setWidth(120);
    startDate.bodyFunc = function (cell, task, list)
    {
        var data = task.getProperty(this.bodyData);
        if (null != data && data.getFullYear() != '1900')
        {
            cell.innerHTML = data.Format("yyyy-MM-dd");
        }
    };

    var finishDate = SFGanttField.getTaskField("Finish");
    finishDate.setBodyAlign("center");
    finishDate.setHeadText(pedHeadName + "<br/>F");
    finishDate.setWidth(120);
    finishDate.bodyFunc = function (cell, task, list)
    {
        var data = task.getProperty(this.bodyData);
        if (null != data && data.getFullYear() != '1900')
        {
            cell.innerHTML = data.Format("yyyy-MM-dd");
        }
    };

    if (model == 0 || model == 2 || model == 5 || model == 9)
    {
        var stateCol = SFGanttField.getTaskField("WBSState");
        stateCol.bodyFunc = function (cell, task, list)
        {
            var stateData = task.getProperty(this.bodyData);
            var stateColor = task.getProperty("StateColor");
            if (null != stateData)
            {
                cell.innerHTML = getStateImg(stateData, stateColor) + '&nbsp;' + getStateText(stateData);
            }
        };
    }

    if (model == 3 || model == 7 || model == 8 || model == 9)
    {
        SFGanttField.getTaskField("Duration").setWidth(100);
        SFGanttField.getTaskField("Duration").setBodyAlign("center");
    }

    if ((model == '0' || model == '1' || model == '2' || model == '4' || model == '5') && bShowAdjustDate)
    {
        SFGanttField.setTaskField("StandardSD", new SFGanttField({
            width: 100, bodyData: "StandardSD", headText: ssdHeadName + "<br/>H", ReadOnly: true, bodyFunc: function (cell, task, list)
            {
                var data = task.getProperty(this.bodyData);
                if (null != data && data.getFullYear() != '1900')
                {
                    cell.innerHTML = data.Format("yyyy-MM-dd");
                }
            }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));

        SFGanttField.setTaskField("StandardED", new SFGanttField({
            width: 100, bodyData: "StandardED", headText: sedHeadName + "<br/>I", ReadOnly: true, bodyFunc: function (cell, task, list)
            {
                var data = task.getProperty(this.bodyData);
                if (null != data && data.getFullYear() != '1900')
                {
                    cell.innerHTML = data.Format("yyyy-MM-dd");
                }
            }, bodyStyle: { textAlign: 'center', whiteSpace: 'nowrap' }
        }));

        SFGanttField.setTaskField("StandardD", new SFGanttField({ width: 80, bodyData: "StandardD", headText: sdHeadName + "<br/>J=I-H", ReadOnly: true, bodyStyle: { textAlign: 'right'} }));
    }

    /*
    if (model == 0 || model == 2 || model == 5)
    {
    setEWIconColumn();
    }
    if (model == 9) 
    {
    setEWIconColumnPB();
    } */
    //是否显示基准日期
    var showstandardate = ($("#hidPublishCompany").val() == "YTJT-ERP") ? true : false;

    //设置在列表之中显示哪些列
    if (model == 0)    //项目开发计划创建->项目开发计划
    {
        if (bShowAdjustDate)
        {
            if (showstandardate)
            {
                    cols = "WBSState,Name,TaskLevel,PlanStartDate,PlanEndDate,Duration,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
            }
            else
            {
                if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'XINYUAN')
                {
                    cols = "WBSState,Name,TaskLevel,StandardD,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,DutyDept,DutyMan,RelationWBS,TaskSort,TaskOption,TaskType";
                }
                else if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'BAONENGJT')
                {
                    cols = "WBSState,Name,TaskLevel,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,StandardD,RelationWBS,TaskSort,TaskOption,TaskType,SuperviseDeptName,SuperviseStationName,DutyDept,DutyMan";
                }
                 else
                {
                    cols = "WBSState,Name,TaskLevel,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,StandardD,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
                }
            }
        }
        else
        {
            if (showstandardate)
            {
                cols = "WBSState,Name,TaskLevel,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
            }
            else
            {
                if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'XINYUAN')
                {
                    cols = "WBSState,Name,TaskLevel,Duration,PlanStartDate,PlanEndDate,DutyDept,DutyMan,RelationWBS,TaskSort,TaskOption,TaskType";
                }
                else if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'BAONENGJT')
                {
                    cols = "WBSState,Name,TaskLevel,PlanStartDate,PlanEndDate,Duration,RelationWBS,TaskSort,TaskOption,TaskType,SuperviseDeptName,SuperviseStationName,DutyDept,DutyMan";
                }
                else if ($("#hidIsTastControl").length == 1 && $("#hidIsTastControl").val() == "Y")
                {
                    cols = "Selected,Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "WBSState,Name,TaskLevel,PlanStartDate,PlanEndDate,Duration,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
                }
            }
        }

    }
    else if (model == 5)  //项目开发计划执行总览
    {
        if (bShowAdjustDate)
        {
            if (showstandardate)
            {
                cols = "WBSState,Name,TaskLevel,PercentComplete,PlanStartDate,PlanEndDate,Duration,ExpectedSD,ExpectedED,ActualStartDate,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan,MainDeptName";
            }
            else
            {
                if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'XINYUAN')
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,StandardD,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,DutyDept,DutyMan,ExpectedSD,ExpectedED,ActualStartDate,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType";
                }
                else if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'BAONENGJT')
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,StandardD,ExpectedSD,ExpectedED,ActualStartDate,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,SuperviseDeptName,SuperviseStationName,DutyDept,DutyMan";
                }
                else
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,PlanStartDate,PlanEndDate,Duration,StandardSD,StandardED,StandardD,ExpectedSD,ExpectedED,ActualStartDate,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
                }
            }
        }
        else
        {
            if (showstandardate)
            {
                cols = "WBSState,Name,TaskLevel,PercentComplete,ActualStartDate,ExpectedSD,ExpectedED,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan,MainDeptName";
            }
            else
            {
                if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'XINYUAN')
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,Duration,PlanStartDate,PlanEndDate,DutyDept,DutyMan,ActualStartDate,ExpectedSD,ExpectedED,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType";
                }
                else if ($('#hidPublishCompany') && $('#hidPublishCompany').val() == 'BAONENGJT')
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,PlanStartDate,PlanEndDate,Duration,ActualStartDate,ExpectedSD,ExpectedED,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,SuperviseDeptName,SuperviseStationName,DutyDept,DutyMan";
                }
                else
                {
                    cols = "WBSState,Name,TaskLevel,PercentComplete,PlanStartDate,PlanEndDate,Duration,ActualStartDate,ExpectedSD,ExpectedED,ActualEndDate,ActualDuration,ExpectedDelayDays,DelayDays,RelationWBS,TaskSort,TaskOption,TaskType,DutyDept,DutyMan";
                }
            }
        }
    }
    else if (model == 2 || model == 4)
    {
        if (bShowAdjustDate)
        {
            if (showstandardate)
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Name,InputMessage,Notes,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
            }
            else
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Name,InputMessage,Notes,Start,Finish,Duration,StandardSD,StandardED,StandardD,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Name,TaskLevel,Start,Finish,Duration,StandardSD,StandardED,StandardD,PercentComplete,DutyDept,DutyMan";
                }
            }
        }
        else
        {
            if (showstandardate)
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Name,InputMessage,Notes,PercentComplete,DutyDept,DutyMan";
                }
                else
                {

                    cols = "Name,TaskLevel,PercentComplete,DutyDept,DutyMan";
                }
            }
            else
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Name,InputMessage,Notes,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
            }
        }
    }
    else if (model == 1)
    {
        if (bShowAdjustDate)
        {
            if (showstandardate)
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Selected,WBSNo,Name,InputMessage,Notes,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Selected,WBSNo,Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
            }
            else
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Selected,WBSNo,Name,InputMessage,Notes,Start,Finish,Duration,StandardSD,StandardED,StandardD,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Selected,WBSNo,Name,TaskLevel,Start,Finish,Duration,StandardSD,StandardED,StandardD,PercentComplete,DutyDept,DutyMan";
                }
            }
        }
        else
        {
            if (showstandardate)
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Selected,WBSNo,Name,InputMessage,Notes,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Selected,WBSNo,Name,TaskLevel,PercentComplete,DutyDept,DutyMan";
                }

            }
            else
            {
                if (_nativeConfig.IsFuncWBS == true)
                {
                    cols = "Selected,WBSNo,Name,InputMessage,Notes,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
                else
                {
                    cols = "Selected,WBSNo,Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
                }
            }
        }
    }
    else if (model == 6)
    {
        cols = "Selected,Name,TaskLevel,Start,Finish,Duration,PercentComplete,DutyDept,DutyMan";
    }
    else if (model == 3 || model == 7)
    {   //如果是职能计划，显示成效衡量与计划描述
        if (_nativeConfig.IsFuncWBS == true)
        {
            cols = "Selected,Name,InputMessage,Notes,Start,Finish,Duration,DutyMan";
        }
        else
        {
            cols = "Selected,Name,TaskLevel,Start,Finish,Duration,DutyMan";
        }
    }
    else if (model == 8)
    {
        cols = "Name,TaskLevel,Start,Finish,Duration,DutyMan";
    }
    else if (model == 9)
    {
        cols = "Name,Start,Finish,PercentComplete,DutyDept,DutyMan";
    }
    else if (model == 10)
    {
        cols = "Selected,Name,TaskLevel,Start,Finish,Duration,DutyMan";
    }

    gtConfig.setConfig("SFGantt/taskFieldNames", cols);
    gtData = new SFData(adapter);
    gtMap = new SFGantt(gtConfig, gtData);

    if (model == 1 || model == 6 || model == 7)
    {
        gtData.addComponent(new SFDataOutlineComponent());
        gtData.addComponent(new SFDataIDComponent());
    }

    // 鼠标双击
    if (model == 0 || model == 2 || model == 3 || model == 4 || model == 7 || model == 8 || model == 9 || model == 10)
    {
        SFEvent.addListener(gtMap, "taskdblclick", gtMap.focusIntoView);
    }
    else if (model == 1 || model == 5 || model == 6)
    {
        SFEvent.addListener(gtMap, "taskdblclick", onTaskDblClick);
    }

    // 选择(反选)任务
    if (model == 3)
    {
        SFEvent.addListener(gtMap, "taskfocus", selectWBS);
        SFEvent.addListener(gtMap, "taskblur", removeSelectWBS);
    }

    gtMap.removeContextMenuItem(gtMap.getContextMenuItemById("Print"));
    gtMap.getContextMenuItemById("FocusIntoView").setIndex(0);
    gtMap.addContextMenuItem(menuVisible, menuBrowse, "查看详细", "", "BrowseWBS", 1);

    if (model === 9) {
        gtMap.removeContextMenuItem(gtMap.getContextMenuItemById("FocusIntoView"));
    }    

    // 导入任务时增加右键全选
    if (model == 1 || model == 3 || model == 7 || model == 10)
    {
        gtMap.addContextMenuItem(menuVisible, menuSelectAll, "全选", "", "SelectAllWBS", 2);
    }

    if (model == 0)
    {
        var time = new Date();
        gtMap.showMap(time, 6);

        gtMap.move(-200);

        gtMap.addTimeLine(time, false, { borderStyle: 'solid', borderColor: 'red' });
    }
    else if (model == 1 || model == 6 || model == 7 || model == 10)
    {
        if ((model == 1 || model == 6) && hidRecordState.value == "0" || (model == 7 || model == 10))
        {
            /* 所有主项计划都不可以添加同级 、也不能被修改、删除
            主项任务判断: IsSubjectWBS = 0, ParentWBSID = '00000'(Info.split('.')[0])
            */
            /*
            带过来的主项计划，只有最底级可以添加下级
            判断方法: MaxRowNoOfSon == 0(Info.split('.')[3])
            */
            gtMap.addContextMenuItem(menuVisible, menuImport, "导入", "", "Import", 2);
            //gtMap.addContextMenuItem(menuVisible, menuAddFriend, "新增同级", "", "AddFriend", 3);
            gtMap.addContextMenuItem(function (ma)
            {
                if (ma.type = 'list')
                {
                    var focusTask = ma.gantt.getFocusTask(); //获得当前的焦点任务
                    if (focusTask != null)
                    {
                        if (focusTask.getProperty('IsSubjectWBS'))
                        {
                            return (focusTask.getProperty('IsSubjectWBS') == '0') ? 0 : 1;
                        }
                        return 1;
                    }
                }
                return 0;
            }, menuAddFriend, "新增同级", "", "AddFriend", 3);
            //gtMap.addContextMenuItem(menuVisible, menuAddSon, "新增下级", "", "AddSon", 4);
            gtMap.addContextMenuItem(function (ma)
            {
                if (ma.type = 'list')
                {
                    var focusTask = ma.gantt.getFocusTask(); //获得当前的焦点任务
                    if (focusTask != null)
                    {
                        if (focusTask.getProperty('IsSubjectWBS'))
                        {
                            return (focusTask.getProperty('IsSubjectWBS') == '0' && parseInt(focusTask.getProperty('SubjectSonWBSNum')) > 0) ? 0 : 1;
                        }
                        return 1;
                    }
                }
                return 0;
            }, menuAddSon, "新增下级", "", "AddSon", 4);
            // gtMap.addContextMenuItem(menuVisible, menuEdit, "修改", "", "Edit", 5);
            gtMap.addContextMenuItem(function (ma)
            {
                if (ma.type = 'list')
                {
                    var focusTask = ma.gantt.getFocusTask(); //获得当前的焦点任务
                    if (focusTask != null)
                    {
                        if (focusTask.getProperty('IsSubjectWBS'))
                        {
                            return (focusTask.getProperty('IsSubjectWBS') == '0') ? 0 : 1;
                        }
                        return 1;
                    }
                }
                return 0;
            }, menuEdit, "修改", "", "Edit", 5);
            gtMap.addContextMenuItem(menuVisible, menuMove, "移动", "", "Move", 7);
            // gtMap.addContextMenuItem(menuVisible, menuDelete, "删除", "", "Delete", 8);
            gtMap.addContextMenuItem(function (ma)
            {
                if (ma.type = 'list')
                {
                    var focusTask = ma.gantt.getFocusTask(); //获得当前的焦点任务
                    if (focusTask != null)
                    {
                        if (focusTask.getProperty('IsSubjectWBS'))
                        {
                            return (focusTask.getProperty('IsSubjectWBS') == '0') ? 0 : 1;
                        }
                        return 1;
                    }
                }
                return 0;
            }, menuDelete, "删除", "", "Delete", 8);
            if ((model == 1 || model == 6 || model == 7))
            {
                // gtMap.addContextMenuItem(menuVisible, menuBatchEdit, "批量修改", "", "BatchEdit", 6);
                gtMap.addContextMenuItem(function (ma)
                {
                    if (ma.type = 'list')
                    {
                        var focusTask = ma.gantt.getFocusTask(); //获得当前的焦点任务
                        if (focusTask != null)
                        {
                            if (focusTask.getProperty('IsSubjectWBS'))
                            {
                                return (focusTask.getProperty('IsSubjectWBS') == '0') ? 0 : 1;
                            }
                            return 1;
                        }
                    }
                    return 0;
                }, menuBatchEdit, "批量修改", "", "BatchEdit", 6);
            }
        }

        gtMap.showMap(null, 6);

        //hidCanAdjust 在模板调整中是没有的 ( $('#hidCanAdjust').length<=0 )
        //下面这一段，暂时只在模板调用中用到。
        if ($('#hidCanAdjust').length <= 0)
        {
            setBtnEnabled($("#btnImport,#btnAddFriend,#btnAddSon,#btnEdit,#btnMove,#btnDelete,#btnPublish,#btnAbandon"), true);
        }

        if (model == 1 || model == 6)
        {
            setBtnEnabled($("#btnBatchEdit"), true);
        }
    }
    else if (model == 2)
    {
        gtMap.showMap(null, 3);
    }
    else if (model == 3 || model == 4 || model == 8 || model == 9)
    {
        gtMap.showMap(null, 6);
    }
    else if (model == 5)
    {
        var time = new Date();
        gtMap.showMap(time, 6);

        gtMap.addTimeLine(time, false, { borderStyle: 'solid', backgroundColor: 'red' });
        gtMap.move(-150);

        var task = gtData.getTaskByOutline("1");
        if (task != null)
        {
            gtMap.setSelectedTask(task);

            var wbsID = task.getProperty("CID").split(".")[1];
        }
    }

    gtMap.collapseMap();

    ajaxComplete();

}

// 转到当前任务的图形展示
// 甘特图本身的菜单项，在一开始隐藏图表时，再点击会报错。
function focusIntoView(ma)
{
    if (ma.gantt.isChartShow())
    {
        ma.gantt.focusIntoView();
    }
}

// 右键菜单项是否显示
function menuVisible(ma)
{
    //var focusTask = ma.gantt.getFocusTask();

    //右键点击的位置类型有以下几种：column(中间分隔条),logo(甘特图的logo),map(右侧图表),list(左侧列表)
    if (ma.type == "list" && ma.gantt.getFocusTask() != null)
    {
        return 1;
    }
    return 0;
}

// 右键菜单项的单击事件
function menuBrowse(ma)
{
    var task = ma.gantt.getFocusTask();
    if (task != null)
    {
        var ids = task.getProperty("CID").split(".");
        var wbsID = ids[1];
        var url = '';
        var width = 950, height = 700;

        if (model == 0 || model == 2 || model == 5)
        {
            if (model != 2 && task.getProperty("DistinguishType") == '1')
            {
                url = "/" + rootUrl + "/POM/Plan/VWorkTaskBrowse.aspx?ID=" + wbsID;
            }
            else
            {
                url = "/" + rootUrl + "/POM/Plan/VWBSBrowse.aspx?WBSID=" + wbsID;
            }
        }
        else if (model == 1 || model == 4 || model == 6)
        {
            var wbscID = ids[0];
            if (model == 1 && task.IsSubjectWBS == '0')
            {
                url = "/" + rootUrl + "/POM/Plan/VWBSBrowse.aspx?WBSID=" + wbsID;
            }
            else
            {
                url = "/" + rootUrl + "/POM/Plan/VWBSHistoryBrowse.aspx?WBSCID=" + wbscID + "&WBSID=" + wbsID;
            }
        }
        else if (model == 3 || model == 8 || model == 10)
        {
            var ttID = ids[0];
            url = "/" + rootUrl + "/POM/TaskTemplate/VTemplateWBSBrowse.aspx?From=Template&TTID=" + ttID + "&WBSID=" + wbsID;
            width = 750;
            height = 500;
        }
        else if (model == 7)
        {
            var ttcID = ids[0];

            if (task.IsSubjectWBS == '0')
            {
                url = "/" + rootUrl + "/POM/TaskTemplate/VTemplateWBSBrowse.aspx?From=Template&WBSID=" + wbsID;
            }
            else
            {
                url = "/" + rootUrl + "/POM/TaskTemplate/VTemplateWBSChangeBrowse.aspx?TTCID=" + ttcID + "&WBSID=" + wbsID;
            }
            width = 750;
            height = 500;
        }
        else if (model == 9)
        {
            // 0：项目计划；1：单项计划；2：前期文档；3：资格预审/推荐单位审批；4：标底预算；
            // 5：招标文件；6：发标；7：回标；8：开标；9：评标；10：定标；
            var vType = Number(ids[2]);
            var ttcID = ids[0];

            if (vType < 0) {
                url = "/" + rootUrl + "/ZBidding/NewZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + ttcID + "&PType=4";
            }
            else {
                url = "/" + rootUrl + "/ZBidding/NewZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + ttcID;
            }

            /*
            if (vType == "0")
            {
                url = "/" + rootUrl + "/ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + wbsID;
            }
            else if (vType == "1" && ttcID != "")
            {
                url = "/" + rootUrl + "/ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + ttcID;
            }
            else if (vType != "0" && vType != "1" && ttcID != "")
            {
                url = "/" + rootUrl + "/ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + ttcID;
            }
            else if (vType == "1")
            {
                url = "/" + rootUrl + "/ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + wbsID;
            }
            else if (vType == "2")
            {
                url = "/" + rootUrl + "/ZBidding/ZBFCheck/VZBFCheckBrowse.aspx?ID=" + wbsID;
            }
            else if (vType == "3")
            {
                url = "/" + rootUrl + "/ZBidding/BiddingCommon/VMyBiddingSupplierBrowse.aspx?ID=" + wbsID;
            }
            else if (vType == "4")
            {
                url = "/" + rootUrl + "/ZBidding/EBudget/VEBudgetBrowse.aspx?ID=" + wbsID;
            }
            else if (vType == "5")
            {
                url = "/" + rootUrl + "/ZBidding/ZBFile/VZBiddingFileBrowse.aspx?ID=" + wbsID;
            }
            else if (vType == "6")
            {
                url = "/" + rootUrl + "/ZBidding/ZBiddingRequest/VZBiddingRequestBrowse.aspx?ID=" + wbsID;
            }
            else if (vType == "7")
            {
                url = "/" + rootUrl + "/ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + ttcID;
            }
            else if (vType == "8")
            {
                url = "/" + rootUrl + "/ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + ttcID;
            }
            else if (vType == "9")
            {
                url = "/" + rootUrl + "/ZBidding/ProjectZBiddingPlan/VProjectZBiddingPlanDetailBrowse.aspx?PZBPLID=" + ttcID;
            }
            else if (vType == "10")
            {
                url = "/" + rootUrl + "/ZBidding/ZBAndy/VZBAndyBrowse.aspx?ID=" + wbsID;
            }
            */
        }

        openWindow(url, width, height);
        ma.gantt.clearSelectedElement();

    }
}

// 鼠标双击事件
function onTaskDblClick(task, type, field)
{
    gtMap.focusIntoView();

    if (model == 1 || model == 6)
    {
        if (hidRecordState.value == "0")
        {
            openSetSingleTaskWindow("Edit", task);
        }
    }
    //    else if (model == 5)
    //    {
    //        var wbsID = task.getProperty("CID").split(".")[1];
    //        window.parent.trOtherInfo.style.display = "block";
    //        window.parent.trEWInfo.style.display = "none";
    //        window.parent.frames("BasicInfo").location = "VWBSBasicInfo.aspx?WBSID=" + wbsID;
    //        window.parent.frames("OtherInfo").location = "VWBSOtherInfo.aspx?WBSID=" + wbsID;
    //    }
}

// 右键菜单项(全选)的单击事件		
function menuSelectAll(ma)
{
    var task = gtData.getRootTask();
    task.setProperty("Selected", true);
    selectWBS(task);
    task.setProperty("Selected", false);
}

// 选中任务组时自动选中其子任务
function selectWBS(task)
{
    if (task.getProperty("Selected") || task.OutlineNumber == "0")
    {
        var firstSonTask = task.getFirstChild();
        if (firstSonTask != null)
        {
            firstSonTask.setProperty("Selected", true);
            selectWBS(firstSonTask);

            var nextSonTask = firstSonTask.getNextSibling();
            while (nextSonTask != null)
            {
                nextSonTask.setProperty("Selected", true);
                selectWBS(nextSonTask);

                nextSonTask = nextSonTask.getNextSibling();
            }
        }
    }
}

// 取消选中任务时，自动取消其父任务的选中
function removeSelectWBS(task)
{
    if (!task.getProperty("Selected"))
    {
        var parentTask = task.getParentTask();
        while (parentTask != null)
        {
            parentTask.setProperty("Selected", false);
            parentTask = parentTask.getParentTask();
        }
    }
}

function menuImport(ma) { openSetSingleTaskWindow("Import", ma.gantt.getFocusTask()); }
function menuAddFriend(ma) { openSetSingleTaskWindow("AddFriend", ma.gantt.getFocusTask()); }
function menuAddSon(ma) { openSetSingleTaskWindow("AddSon", ma.gantt.getFocusTask()); }
function menuEdit(ma) { openSetSingleTaskWindow("Edit", ma.gantt.getFocusTask()); }
function menuBatchEdit(ma) { openSetMultiTaskWindow("BatchEdit"); }
function menuMove(ma) { openSetSingleTaskWindow("Move", ma.gantt.getFocusTask()); }
function menuDelete(ma) { openSetMultiTaskWindow("Delete"); }


// 设置预警图标
function setEWIconColumn()
{
    var field = SFGanttField.getTaskField("StatusIcon");
    var ewtypes = ["0-未开始", "1-进行中", /*"2-已完成", */"0-0", "0-2", "0-3", "0-4", "0-5", "0-6"];

    field.width = '100';
    field.setBodyStyle({ whiteSpace: 'nowrap' });

    if (window['Gantt_IconField_IconsLen'])
    {
        //每次往图片集合中加图片前,加恢复到原始状态
        field.icons.length = window['Gantt_IconField_IconsLen'];
    }
    else
    {
        //获取图片列的原始图片长度
        window['Gantt_IconField_IconsLen'] = field.icons.length;
    }

    for (var i = 0; i < ewtypes.length; i++)
    {
        setEWIconColumnInfo(field, ewtypes[i]);
    }
}
function setEWIconColumnPB()
{
    var field = SFGanttField.getTaskField("StatusIcon");
    var ewtypes = ["0-未开始", "0-未发标", "1-已发标未定标", "2-已定标", "2-1", "2-2", "2-3"];

    field.width = '100';
    field.setBodyStyle({ whiteSpace: 'nowrap' });

    if (window['Gantt_IconField_IconsLen'])
    {
        //每次往图片集合中加图片前,加恢复到原始状态
        field.icons.length = window['Gantt_IconField_IconsLen'];
    }
    else
    {
        //获取图片列的原始图片长度
        window['Gantt_IconField_IconsLen'] = field.icons.length;
    }

    for (var i = 0; i < ewtypes.length; i++)
    {
        setEWIconColumnInfo(field, ewtypes[i]);
    }
}

function setEWIconColumnInfo(field, ewtype)
{
    field.addIcon(function (element, gantt)
    {
        var k = -1;
        var arrEWType = element.EWType.split(",");
        for (var j = 0; j < arrEWType.length; j++)
        {
            if (arrEWType[j].indexOf(ewtype) != -1)
            {
                k = j;
                break;
            }
        }

        if (k >= 0)
        {
            var imgName = "";
            var toolTip = "";
            var arrEW = arrEWType[k].split("-");
            if (arrEW.length <= 2)
            {
                switch (arrEW[0])
                {
                    case "0":
                        imgName = "state0";         // 未开始
                        break;
                    case "1":
                        imgName = "state1";         // 进行中
                        break;
                    case "2":
                        imgName = "state2";         // 已完成
                        break;
                }
                toolTip = arrEW[1];
            }
            else
            {
                switch (arrEW[1])
                {
                    case "0":
                        imgName = "change";          // 计划变更
                        break;
                    case "2":
                        imgName = "delay";           // 计划延期
                        break;
                    case "3":
                        imgName = "ds" + arrEW[3];   // 计划延期启动
                        break;
                    case "4":
                        imgName = "df" + arrEW[3];   // 计划延期完成
                        break;
                    case "5":
                        imgName = "q" + arrEW[3];    // 工程质量缺陷
                        break;
                    case "6":
                        imgName = "s" + arrEW[3];    // 工程安全事故
                        break;
                }
                toolTip = arrEW[2];
            }
            if (imgName != "")
            {
                var img = this.createImage(gantt);
                img.src = "/" + rootUrl + "/Image/ew/" + imgName + ".gif";
                img.className = "img_state";

                gantt.setTooltip(img, function ()
                {
                    var tip = gantt.getTooltip();
                    tip.setContent(document.createTextNode(toolTip));
                    return tip;
                });

                return img;
            }
        }
    }, "EWType");
}

function getStateText(stateData)
{
    if (!stateData) { return ''; }
    switch (stateData)
    {
        case '0':
            return '未开始';
            break;
        case '1':
            return '进行中';
            break;
        case '2':
            return '已完成';
            break;
        default:
            return '';
    }
}

function getStateImg(stateData, stateColor)
{
    if (!stateData || !stateColor)
    {
        return '';
    }

    var imgName = '', tip = '';
    if (stateData != '2')
    {
        imgName = stateColor + '-light';
    }
    else
    {
        imgName = stateColor + '-draw';
    }

    if (stateData == '0')
    {
        tip = '延期启动';
    }
    else if (stateData == '1')
    {
        tip = '延期';
    }
    else
    {
        if (stateColor != 'green')
        {
            tip = '延期完成';
        }
        else
        {
            tip = '已完成';
        }
    }

    return "<img src='/" + rootUrl + "/Image/state/" + imgName + ".gif' title='" + tip + "' class='img_state' style='cursor:pointer;' />";
}
