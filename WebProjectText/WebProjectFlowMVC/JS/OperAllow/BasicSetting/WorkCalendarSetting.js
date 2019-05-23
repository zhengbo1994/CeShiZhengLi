/*
    页面全局变量(Array)，用于存放已选择年份,将根据此数据生成tab
*/
var selectedYears = [];
/*
  页面全局变量
  初次新增时，该对象存放的选择的年份的设置的JSON值。
  修改时，该数组存放的是从数据库中返回的JSON值
  无论是新增还是修改，此变量结构均与工作日历设置格式化（JSON）的结构一致(不包括日期本身的数据结构，仅仅从设置(WorkCalendarSettingsJson)开始
  
  需要注意的是：新增时，workCalendarSettings是空数组，而，修改时，它是包括多项设定的
*/
var workCalendarSettings = [];
function showBrowseTab(index) {
    var curYear = selectedYears[index]; //被点击的tab对应的年份
    $('#divMenu').attr('curYear', curYear);
    var prevYear = $('#divMenu').attr('prevYear');  //被点击前被选中的tab对应的年份    
    //如果点击的是与上一次相同的年份，则不作处理
    if (prevYear == curYear) {
        return;
    }

    //保存点击前被选中的tab对应的年份的设定
    if (saveYearsSetting(prevYear)) {
        selectTab(index, "TabInfo");

        $('#divMenu').attr('prevYear', curYear);

        //加载被点击的tab对应的年份的设定 
        loadYearsSetting(curYear);

        //显示常规休息日
        showNormalRestInfo();
    }
}

function selectYears(obj) {
    
    showIDYear('hidSettedYears', obj.id, true, function () {
        //edit by 杨俊 2017-06-13 将清除当前年份的语句移动到方法内，是为了解决仅仅点击“选择需要设置的年份”按钮却不做任何操作时，出现当前年份无法删除的问题
        $('#divMenu').attr('curYear', '');
        $('#divMenu').attr('prevYear', '');
        var years = $('#hidSettedYears').val();
        var deleteYear = [];        

        for (var i = 0; i < selectedYears.length; i++) {
            if ($.inArray(selectedYears[i], years) == -1) {
                deleteYear.push(selectedYears[i]);
            }
        }
        if (deleteYear.length > 0) {
            var message = '您确定要删除';
            for (var t = 0; t < deleteYear.length; t++) {

                message += deleteYear[t];
                if (t < deleteYear.length - 1) {
                    message += ',';
                }
                else {
                    message += '?';
                }
            }
            if (confirm(message)) {
                for (var j = 0; j < deleteYear.length; j++) {
                    var year = deleteYear[j];
                    $.each(selectedYears, function (i, iYear) {
                        if (iYear == year) {
                            selectedYears.splice(i, 1);
                            return;
                        }
                    });
                    var iSettingIndex = indexOfYearSetting(year);
                    if (iSettingIndex != -1) {
                        workCalendarSettings.splice(iSettingIndex, 1);
                    }
                }
                $('#divMenu').attr('curYear', '');
                $('#divMenu').attr('prevYear', '');
            }
            else {
                var value = '';
                for (var z = 0; z < selectedYears.length; z++) {
                    value += selectedYears[z];
                    if (i < selectedYears.length - 1) {
                        value += ',';
                    }
                }
                $('#hidSettedYears').val(value);
                return false;
            }
        }
        //edit by 杨俊 2017-06-13 判断当years不存在或为空时，则设置selectedYears的值为空数组
        selectedYears = years && years.split(',') || [];

        //selectedYears = $.merge(selectedYears,years.split(','));
        //edit by 杨俊 2017-06-13 当selectedYears存在并且个数大于0时，才需要去除重复项和排序
        if (selectedYears && selectedYears.length > 0) {
            //去除重复项
            selectedYears.unique();
            //将年份按日期升序排序
            selectedYears.sort();
        }
        //完成后，初始化Tabs
        initTabs();
        
    })
    //    var years = openModalWindow('../../Common/Select/VSelectYears.aspx',500,300);
    //    if(years)
    //    {
    //        selectedYears = $.merge(selectedYears,years.split(','));
    //        //去除重复项
    //        selectedYears.unique();
    //        //将年份按日期升序排序
    //        selectedYears.sort(); 
    //        //完成后，初始化Tabs
    //        initTabs();   
    //    }
}

/*页面初始化时调用*/
function initPage() {
    workCalendarSettings = workCalendarSettings || [];
    selectedYears = selectedYears || [];
    workCalendarSettings = $.stringToJSON($('#hidWorkCalendaySetting').val());
    if (trim($('#hidSettedYears').val()).length > 0) {
        selectedYears = trim($('#hidSettedYears').val()).split(',');
        selectedYears.unique();
        //将年份按日期升序排序
        selectedYears.sort();
    }
    initTabs();
}

/*初始化Tab*/
function initTabs() {
    $('#divMenu ul').html('');
    //如果选中的日期不为空，则显示选项卡及日期设置TABLE,否则将两者隐藏起来
    if (selectedYears && selectedYears.length > 0) {
        $('#divMenu,.idtabdiv').show();
    }
    else {
        $('#divMenu,.idtabdiv').hide();
    }

    $.each(selectedYears, function (i, year) {
        $('#divMenu ul').append(
            '<li><a  name="TabInfo" href="javascript:void(0);" onfocus="this.blur()" onclick="showBrowseTab(' + i + ');"> <span><span>' + year + '</span></span></a></li>'
        );
    });

    //初始化完成后，默认选中第一个日期
    showBrowseTab(0);
}

//保存某一年的设定
function saveYearsSetting(year) {
    if (!year) {
        return true;
    }
    //先查找   workCalendarSettings 是否已存在指定年份的设定
    var yearIndex = indexOfYearSetting(parseInt(year, 10));
    if (yearIndex != -1) {
        //如果已存在，则删除
        workCalendarSettings.splice(yearIndex, 1);
    }

    var cbkIsIntervalCalendar = $("#cbkIsIntervalCalendar"),
        cbkFirstIntervalIsWorkDay = $("#cbkFirstIntervalIsWorkDay");

    // 初始化年份设置，包括是否大小周设置
    var yearSetting = {
        Year: parseInt(year, 10),
        IsIntervalCalendar: cbkIsIntervalCalendar.attr('checked'),
        FirstIntervalIsWorkDay: cbkFirstIntervalIsWorkDay.attr('checked'),
        Normal: {}, ExtraWork: [], ExtraRest: []
    };

    //保存常规日期设置
    var chkWeekList = $('#chkWeekSetList :checkbox');
    var weekName = '';
    $.each(chkWeekList, function (i, week) {
        weekName = $(this).closest('span').eq(0).attr('weekName');
        yearSetting.Normal[weekName] = this.checked;
    });
    //保存例外工作日设定
    var tbExtraWorkDays = $('#tbExtraWorkDays').get(0);
    for (var i = 1, iLen = tbExtraWorkDays.rows.length; i < iLen; i++) {
        var sD = getObjTR(tbExtraWorkDays, i, "input", 1).value;
        var eD = getObjTR(tbExtraWorkDays, i, "input", 2).value;
        if (sD.length <= 0 || eD.length <= 0) {
            return alertMsg('开始日期或结束日期不能为空。', getObjTR(tbExtraWorkDays, i, "input", 1));
        }
        if (compareDate(sD, eD) == -1) {
            return alertMsg('结束日期不能早于开始日期', getObjTR(tbExtraWorkDays, i, "input", 2));
        }
        //开始日期和结束日期都不能在已选择的日期范围内
        var remark = trim(getObjTR(tbExtraWorkDays, i, "textarea", 0).value).replace(/\^/g, '').replace(/\|/g, '');
        yearSetting.ExtraWork.push({ StartDate: sD, EndDate: eD, Remark: remark });
    }
    //保存例外休息日设定  
    var tbExtraRestDays = $('#tbExtraRestDays').get(0);
    for (var i = 1, iLen = tbExtraRestDays.rows.length; i < iLen; i++) {
        var sD = getObjTR(tbExtraRestDays, i, "input", 1).value;
        var eD = getObjTR(tbExtraRestDays, i, "input", 2).value;
        if (sD.length <= 0 || eD.length <= 0) {
            return alertMsg('开始日期或结束日期不能为空。', getObjTR(tbExtraRestDays, i, "input", 1));
        }
        if (compareDate(sD, eD) == -1) {
            return alertMsg('结束日期不能小于开始日期', getObjTR(tbExtraRestDays, i, "input", 2));
        }

        var iDateRepeated = false;
        $.each(yearSetting.ExtraWork, function (i, date) {
            if ((sD >= date.StartDate && sD <= date.EndDate) || (eD >= date.StartDate && eD <= date.EndDate)) {
                iDateRepeated = true;
                return alertMsg('休息日范围：' + sD + '~' + eD + ',已有部分或全部日期被设置成工作日，请先调整该日期范围设置。', getObjTR(tbExtraWorkDays, i, "input", 2));
            }
        });

        if (iDateRepeated) {
            return false;
        }

        //开始日期和结束日期都不能在已选择的日期范围内
        var remark = trim(getObjTR(tbExtraRestDays, i, "textarea", 0).value).replace(/\^/g, '').replace(/\|/g, '');
        yearSetting.ExtraRest.push({ StartDate: sD, EndDate: eD, Remark: remark });
    }

    workCalendarSettings.push(yearSetting);
    return true;
}

//加载某一年的设定
function loadYearsSetting(year) {
    if (!year) {
        return;
    }
    //先查找   workCalendarSettings 是否已存在指定年份的设定
    var yearIndex = indexOfYearSetting(parseInt(year, 10));
    if (yearIndex == -1) {
        reinitSettingForm({
            Year: parseInt(year, 10), IsIntervalCalendar: false, FirstIntervalIsWorkDay: false,
            Normal: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false, Sunday: false }, ExtraWork: [], ExtraRest: []
        });
    }
    else {
        reinitSettingForm(workCalendarSettings[yearIndex]);
    }

    //判断是否显示大小周的设置
    setIsIntervalCalendar();
}

//重置设定表单
//@value 指的是某一年设定的明细
function reinitSettingForm(value) {
    //设置常规日期
    var chkWeekList = $('#chkWeekSetList :checkbox');
    var weekName = '';
    $.each(chkWeekList, function (i, week) {
        weekName = $(this).closest('span').eq(0).attr('weekName');
        this.checked = value.Normal[weekName];
    });

    //设置是否大小周
    var cbkIsIntervalCalendar = $("#cbkIsIntervalCalendar"),
        cbkFirstIntervalIsWorkDay = $("#cbkFirstIntervalIsWorkDay");
    cbkIsIntervalCalendar.attr('checked', value.IsIntervalCalendar);
    cbkFirstIntervalIsWorkDay.attr('checked', value.FirstIntervalIsWorkDay);

    //设置例外工作日
    clearTable($('#tbExtraWorkDays').get(0));
    addExtraDays($('#tbExtraWorkDays').get(0), value.ExtraWork);
    //设置例外休息日
    clearTable($('#tbExtraRestDays').get(0));
    addExtraDays($('#tbExtraRestDays').get(0), value.ExtraRest);
}

function addExtraDays() {
    var table = arguments[0];
    var year = $('#divMenu').attr('curYear');
    var arrDatas = [];
    if (arguments.length == 2) //初始化时
    {
        arrDatas = arguments[1];
    }
    else //新增时
    {
        arrDatas.push({ StartDate: '', EndDate: '', Remark: '' });
    }

    $.each(arrDatas, function (i, data) {
        var row = table.insertRow();
        var theme = $('#hidTheme').val();
        var ckID = getUniqueKey('rdo');

        var cell = row.insertCell(0);
        cell.align = "center";
        //行ID 0
        cell.innerHTML = getCheckBoxHtml(ckID);

        /*开始日期*/
        cell = row.insertCell(1);
        cell.align = "left";
        cell.innerHTML = getSelectDateHtml(getUniqueKey('txt'), data.StartDate, year + '-01-01', year + '-12-31');
        /*结束日期*/
        cell = row.insertCell(2);
        cell.align = "left";
        cell.innerHTML = getSelectDateHtml(getUniqueKey('txt'), data.EndDate, year + '-01-01', year + '-12-31');
        /*备注*/
        cell = row.insertCell(3);
        cell.align = "left";
        cell.innerHTML = getTextAreaHtml(getUniqueKey('txt'), null, 30, data.Remark);
    });

    setTableRowAttributes(table);
}

function delDetail(table) {
    // 删除表格中复选框选中的行
    deleteTableRow(table);
    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
}

//在workCalendarSettings中，查找某一年份设定的索引值
function indexOfYearSetting(year) {
    var iIndex = -1;
    $.each(workCalendarSettings, function (i, setting) {
        if (setting.Year && (setting.Year == year)) {
            iIndex = i;
            return;
        }
    });
    return iIndex;
}

//显示常规休息日信息
function showNormalRestInfo() {
    var restInfo = '';
    $('#txtWeekRest').val('');
    var chkWeekList = $('#chkWeekSetList :checkbox');
    var weekCNName = '';
    $.each(chkWeekList, function (i, week) {
        weekCNName = $(this).closest('span').eq(0).attr('weekCNName');
        this.checked || (restInfo = restInfo + '、' + weekCNName);
    });
    if (restInfo.length > 0) {
        restInfo = restInfo.substr(1);
    }
    else {
        restInfo = '无休息日';
    }
    $('#txtWeekRest').val(restInfo);
}

//填充遗漏的年份设置（也就是有选项卡，但没有点过选项卡的年份)
//将填充默认值（即周一至周五为工作日，周六周日为休息日）
function fillOmitYearsSetting() {
    $.each(selectedYears, function (i, year) {
        if (indexOfYearSetting(year) == -1) {
            workCalendarSettings.push({
                Year: parseInt(year, 10),
                Normal: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false, Sunday: false },
                ExtraWork: [],
                ExtraRest: []
            });
        }
    });
}

//删除某年的设定
function removeYearSetting() {
    var year = $('#divMenu').attr('curYear');
    if (!year) {
        return;
    }
    var message = '您确定要删除' + year + "?"
    if (confirm(message)) {
        $.each(selectedYears, function (i, iYear) {
            if (iYear == year) {
                selectedYears.splice(i, 1);
                return;
            }
        });
        var iSettingIndex = indexOfYearSetting(year);
        if (iSettingIndex != -1) {
            workCalendarSettings.splice(iSettingIndex, 1);
        }
        //每次删除，都需要更改curYear和prevYear,防止saveYearsSetting将已删除的保存
        $('#divMenu').attr('curYear', '');
        $('#divMenu').attr('prevYear', '');

        //edit by 杨俊 2017-06-13 当删除某个当前年份时，重新更新hidSettedYears的值
        $("#hidSettedYears").val(selectedYears.join(','));
        if (selectedYears.length <= 0) {
            $('#divMenu,.idtabdiv').hide();
        }
        else {
            initTabs();
        }
    }
}

function validateSetting() {
    setBtnEnabled('btnSaveClose', false);

    //在提交时，当前选中的选项卡是没有保存的，因此，要将其保存
    if (!saveYearsSetting($('#divMenu').attr('curYear'))) {
        setBtnEnabled('btnSaveClose', true);
        return false;
    }

    //填充遗漏的年份
    fillOmitYearsSetting();

    $('#hidWorkCalendaySetting').val('[]');
    $('#hidWorkCalendaySetting').val($.jsonToString(workCalendarSettings));

    return true;
}

// 设置是否大小周
function setIsIntervalCalendar() {
    var cbkSaturday = $("#chkWeekSetList [weekName=Saturday]"),
     trIsIntervalCalendar = $("#trIsIntervalCalendar"),
     cbkIsIntervalCalendar = $("#cbkIsIntervalCalendar"),
     cbkFirstIntervalIsWorkDay = $("#cbkFirstIntervalIsWorkDay,[for=cbkFirstIntervalIsWorkDay]");

    if (cbkSaturday.find("input[type=checkbox][checked]").length) {
        trIsIntervalCalendar.show();

        if (cbkIsIntervalCalendar.attr('checked')) {
            cbkFirstIntervalIsWorkDay.show();
        }
        else {
            cbkFirstIntervalIsWorkDay.hide();
        }
    }
    else {
        trIsIntervalCalendar.hide();
        cbkIsIntervalCalendar.attr('checked', '');
        cbkFirstIntervalIsWorkDay.hide().attr('checked', '');
    }
}