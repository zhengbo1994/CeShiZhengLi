/*
选择认购单使用到的JS
作者：程镇彪
日期：2012-12-10
*/
// 选择客户信息VSelectSubscription.aspx用到的js
// 作者：程镇彪
// 日期：2012-11-21


function ddlCorp_change()
{
    $("#hdCorpID").val(getObj("ddlCorp").value);
    reloadData();
}

// 刷新数据
function reloadData()
{
    //alert(getObj("hdCorpID").value);

    var query = { JQCorpID: getObj("hdCorpID").value, ProjectName: getObj("txtKey").value };

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
	var isMultiSelect = checkJQGridEnableMultiSel('jqData');

	var vProjectID = getJQGridSelectedRowsID('jqData', isMultiSelect, 'ProjectID');
	var vProjectName = getJQGridSelectedRowsData('jqData', isMultiSelect, 'ProjectName');

	if (typeof vProjectID == "undefined" || vProjectID == "")
	{
		return alertMsg('请选择项目。');
	}

	var returnProjectData = {};
	var ids = [];
	var names = [];

	if (isMultiSelect)
	{
		for (var i = 0; i < vProjectID.length; i++)
		{
			if (vProjectID[i] != "")
			{
				ids.push(stripHtml(vProjectID[i]));
				names.push(stripHtml(vProjectName[i]));
			}
		}
		returnProjectData = {
			ProjectID: ids.join(","),
			ProjectName: names.join(",")
		};
	}
	else
	{
		returnProjectData = {
			ProjectID: stripHtml(vProjectID),
			ProjectName: stripHtml(vProjectName)
		};
	}
	window.returnValue = returnProjectData;
	window.close();
}