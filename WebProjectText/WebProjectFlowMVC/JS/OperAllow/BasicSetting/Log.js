// 日志公用js

// 选择日期（重写）
function selectDate(datePicking, datePicked, minDate, maxDate, format)
{
    var query = {};
    datePicked && (query.onpicked = datePicked);
    format && (query.dateFmt = format);
    minDate = $("#ddlMonth").val();
    maxDate = minDate;
    minDate = getDateObject(minDate);
    maxDate = getDateObject(maxDate);
    dateIsInAMonth(maxDate, idToday) ? (maxDate = idToday) : (maxDate.setMonth(maxDate.getMonth() + 1) && maxDate.setDate(maxDate.getDate() - 1));
    query.minDate = minDate.Format("yyyy-MM-dd");
    query.maxDate = maxDate.Format("yyyy-MM-dd");
    WdatePicker(query);
}

// 切换月份
function changeMonth()
{
    var minDate = getDateObject($("#ddlMonth").val());
    $("#txtSD").val(minDate.Format("yyyy-MM-dd"));
    dateIsInAMonth(minDate, idToday) ? (minDate = idToday) : (minDate.setMonth(minDate.getMonth() + 1) && minDate.setDate(minDate.getDate() - 1));
    $("#txtED").val(minDate.Format("yyyy-MM-dd"));
    reloadData();
}
