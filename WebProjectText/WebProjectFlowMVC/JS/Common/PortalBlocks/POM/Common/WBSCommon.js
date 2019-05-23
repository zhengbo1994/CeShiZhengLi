
//查看任务明细
function showWBS(wbsID)
{
    openWindow('/' + rootUrl + '/POM/Plan/VWBSBrowse.aspx?WBSID=' + wbsID, 950, 700);
}

//创建鼠标移上时的动态提示
function buildTip(taskJObj)
{
    var wbsState = taskJObj.attr('wbsstate');
    var ped = taskJObj.attr('ped');
    var aed = taskJObj.attr('aed');

    var tipContainer = $('<div id="tip" style="width:230px;overflow:hidden;position:absolute;top:20px;left:-50px;padding:5px;background-color:white;border:1px solid #a6c9e2;z-index:999;" />');
    var txtHtml = '<div class="font"><a href="javascript:void(0);" onclick=showWBS("' + taskJObj.attr('taskid') + '")>' + taskJObj.attr('taskname') + '</a></div>';
    txtHtml += '<div class="tipDate"><span class="font">计划时间:</span><span class="font">' + taskJObj.attr('psd') + '</span><span class="font">至</span><span class="font">' + taskJObj.attr('ped') + '</span></div>';
    if (wbsState != '0')
    {
        txtHtml += '<div class="tipDate"><span class="font">实际时间:</span><span class="font">' + taskJObj.attr('asd') + '</span>';
        if (wbsState == '2')
        {
            txtHtml += '<span>至</span><span class="font">' + taskJObj.attr('aed') + '</span>';
        }
        txtHtml += '</div>';

        if (wbsState == '2' && compareDate(ped, aed) == 1)
        {
            txtHtml += '<div class="tipDate"><span class="red">延期天数:</span><span class="font" style="color:red">' + getDayDiff(ped, aed) + '天</span>';
            txtHtml += '</div>';
        }
    }

    tipContainer.html(txtHtml);    

    taskJObj.append(tipContainer);
    tipContainer.fadeIn("slow");
}