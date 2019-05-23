/*
选择认购单使用到的JS
作者：程镇彪
日期：2012-12-10
*/
// 选择客户信息VSelectContract.aspx用到的js
// 作者：程镇彪
// 日期：2012-12-11


// 刷新数据
function reloadData()
{
 
    var query = { ProjectGUID: getObj("ddlProjectGUID").value, Key: getObj("txtKey").value };

    if (loadJQGrid("jqData", query))
    {
        
        refreshJQGrid("jqData");
    }
//    if ($("#hidIsMulti").val() != "Y")
//    {   
//        // 取消选中行事件
//        $("tr").removeAttr("onclick");
//        $(":checkbox").removeAttr("onclick");
//        $("#chkAll").hide();

//        $(":checkbox").click(function ()
//        {
//            $(":checkbox").attr("checked", false);
//            $(this).attr("checked", true);
//        })
//    }
}

function ChangeBackColor(span)
{
    var selectedObj = $('.selNode');
    selectedObj.removeClass("selNode");
    selectedObj.addClass("normalNode");
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}


function selectProject()
{
    var vProjectID = getJQGridSelectedRowsID('jqData', true);
    var vProjectName = getJQGridSelectedRowsData('jqData', true, 'ProjectName');
    var ids = [];
    var names = [];
    for (var i = 0; i < vProjectID.length; i++)
    {
        if (vProjectID[i] != "")
        {
            ids.push(vProjectID[i]);
            names.push($.jgrid.stripHtml(vProjectName[i]));
        }
    }
    window.returnValue = ids.join(",") + "|" + names.join("，");
    window.close();
}