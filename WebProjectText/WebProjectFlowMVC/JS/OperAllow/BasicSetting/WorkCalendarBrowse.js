var selectedYears = [] ; 
var workCalendarSettings = [] ; 
var weekDaysName ={
    'EName':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    'CNName':['周一','周二','周三','周四','周五','周六','周日']    
};

/*页面初始化时调用*/
function initPage()
{
    workCalendarSettings = workCalendarSettings || [];
    selectedYears = selectedYears || [];
    workCalendarSettings = $.stringToJSON($('#hidWorkCalendaySetting').val());  
    if(trim($('#hidYears').val()).length>0)
    {
        selectedYears = trim($('#hidYears').val()).split(','); 
        selectedYears.unique();           
        //将年份按日期升序排序
        selectedYears.sort(); 
        
        initTabs();
    }
    else
    {
        $('#trNoTip').show();
    }    
}

/*初始化Tab*/
function initTabs()
{
    $('#divMenu ul').html('');
    if(selectedYears && selectedYears.length>0)
    {
        $('#divMenu,.idtabdiv').show();        
    }
    else
    {
        $('#divMenu,.idtabdiv').hide();     
    }
    
    $.each(selectedYears,function(i,year){
        $('#divMenu ul').append(
            '<li><a  name="TabInfo" href="javascript:void(0);" onfocus="this.blur()" onclick="showBrowseTab('+i+');"> <span><span>'+year+'</span></span></a></li>'
        );
    });
    
    //初始化完成后，默认选中第一个日期
    showBrowseTab(0);
}

function showBrowseTab(index)
{    
    selectTab(index, "TabInfo");    
    loadYearsSetting(selectedYears[index]);
}

//加载某一年的设定
function loadYearsSetting(year)
{
    if(!year)
    {
        return;
    }   
    //先查找   workCalendarSettings 是否已存在指定年份的设定
    var yearIndex = indexOfYearSetting(parseInt(year,10));    
    if( yearIndex != -1)
    {
        reinitSettingForm(workCalendarSettings[yearIndex]);
    }
}

//重置设定表单
//@value 指的是某一年设定的明细
function reinitSettingForm(value)
{    
    //设置常规日期
    var workDay =[] , restDay =[];    
    $.each(weekDaysName.EName,function(i,day){
        if(value.Normal[day])
        {
            workDay.push(weekDaysName.CNName[i]);
        }
        else
        {
            restDay.push(weekDaysName.CNName[i]);
        }
    });

    
    if (value.IsIntervalCalendar)
    {
        if (value.FirstIntervalIsWorkDay)   //第一个周六是工作日
        {
            $('#txtInterval').val('使用大小周，年度第一个周六是工作日。');
        }
        else                                //第一个周六不是工作日
        {
            $('#txtInterval').val('使用大小周，年度第一个周六是休息日。');
        }
    }
    else
    {
        $('#txtInterval').val('未使用大小周');
    }
    
    if(workDay.length>0)
    {
        $('#txtWeekWork').val(workDay.join('，'));
    }
    else
    {
         $('#txtWeekWork').val('无工作日');
    }
    
    if(restDay.length>0)
    {
        $('#txtWeekRest').val(restDay.join('，'));
    }
    else
    {
         $('#txtWeekRest').val('无休息日');
    }
    
    //设置例外工作日
    clearTable($('#tbExtraWorkDays').get(0));
    addExtraDays($('#tbExtraWorkDays').get(0),value.ExtraWork);
    //设置例外休息日
    clearTable($('#tbExtraRestDays').get(0));
    addExtraDays($('#tbExtraRestDays').get(0),value.ExtraRest);
}

function addExtraDays()
{
    var table = arguments[0];
    var year  = $('#divMenu').attr('curYear');
    var arrDatas=[];
    if(arguments.length==2) //初始化时
    {        
        arrDatas=arguments[1]; 
    }
    else //新增时
    {
        arrDatas.push({StartDate:'',EndDate:'',Remark:''});
    }  
    
    $.each(arrDatas,function(i,data){
        var row = table.insertRow();    
        var ckID=getUniqueKey('rdo');   
        
        /*开始日期*/
        cell = row.insertCell(0);
        cell.align = "center";
        cell.innerHTML = data.StartDate; 
        /*结束日期*/
        cell = row.insertCell(1);
        cell.align = "center";
        cell.innerHTML = data.EndDate;   
        /*备注*/
        cell = row.insertCell(2);
        cell.align = "left";
        cell.innerHTML =  data.Remark;
    });   
        
    setTableRowAttributes(table);
}

//在workCalendarSettings中，查找某一年份设定的索引值
function indexOfYearSetting(year)
{
    var iIndex= -1;
    $.each(workCalendarSettings,function(i,setting){
        if( setting.Year && ( setting.Year == year ) )
        {
            iIndex = i ;
            return ;
        }
    });
    return iIndex ;
}