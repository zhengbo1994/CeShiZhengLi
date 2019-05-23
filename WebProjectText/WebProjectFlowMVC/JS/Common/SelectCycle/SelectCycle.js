/*
    返回值类型是：
    {
        "unit":"0",   //周期类型 0：天 1：周 2：月
        "number":"1", //每多少天|周|月
        "value":[]    //周期值
    }
*/

function changeUnit()
{
    var unit=$('#ddlCycleUnit').val();
    switch(unit)
    {
        case '0': //天
            $('#tbCycle').hide();
            $('#txtNumberTip').text('天');
            $('#tbWeekInfo,#tbMonthInfo').hide();
            break;
        case '1': //周
            $('#tbCycle').show();
            $('#txtNumberTip').text('周');
            $('#tbWeekInfo').show();
            $('#tbMonthInfo').hide();
            break;
        case '2': //月
            $('#tbCycle').show();
            $('#txtNumberTip').text('月');
            $('#tbMonthInfo').show();
            $('#tbWeekInfo').hide();
            break;
    }
}

function initCtls()
{
    if($('#hidCycleUnit').val().length>0)
    {
        $('#ddlCycleUnit option[value=\''+$('#hidCycleUnit').val()+'\']').attr('selected','selected');
        changeUnit();        
    }
    if($('#hidCycleNumber').val().length>0)
    {
        $('#txtNumber').val($('#hidCycleNumber').val());
    }
    var unit=$('#hidCycleUnit').val();
    var value=$('#hidCycleValue').val().length>0?$('#hidCycleValue').val().split(','):[];
    switch(unit)
    {           
        case '1': //周       
            $.each(value,function(i,v){                
               $('#chkWeek span[checkValue=\''+v+'\']').children(':checkbox').attr('checked','checked');
            });
            break;
        case '2': //月    
            $.each(value,function(i,v){
                $('#chkMonth span[checkValue=\''+v+'\']').children(':checkbox').attr('checked','checked');
            });
            break;
    }    
}

function finishChoose()
{     
    var retValue={};
    var unit=$('#ddlCycleUnit').val();
    var number=$('#txtNumber').val();
    if(number.length<=0)
    {
        return alertMsg('周期数不能为空！',$('#txtNumber'));
    }
    if (!isPositiveInt(number))
    {
        return alertMsg('周期数必须为整数，且不能为0！',$('#txtNumber'));
    }
    var value=[];
    switch(unit)
    {
        case '1': //周   
            if($('#chkWeek :checked').length<=0)
            {
                return alertMsg('请选择周期');
            }         
            $('#chkWeek :checked').each(function(i,d){
                value.push($(d).parent().attr('checkValue'));
            });        
            break;
        case '2': //月            
            if($('#chkMonth :checked').length<=0)
            {
                return alertMsg('请选择周期');
            }  
            $('#chkMonth :checked').each(function(i,d){
                value.push($(d).parent().attr('checkValue'));
            });   
            break;
    }
    
    retValue.Unit=unit;
    retValue.Number=number;
    retValue.Value=value;
    
    window.opener=null;
    window.returnValue=retValue;
    window.close();    
}