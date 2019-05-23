var pageArg = {};
$(function ()
{
    var $jq = $("#jqgStation");
    pageArg.$jq = $jq;

    var reloadData = function ()
    {
        var strKeyWord = $("#txtKW", window.parent.document).val();
        var strStruID = window.parent.frames("Left").pageArg.treeTable.currentItem.sonid;
        var strStruType = window.parent.frames("Left").pageArg.treeTable.currentItem.type;
        var strRange = $("#ddlRange", window.parent.document).val();
        var query = { KeyWord: strKeyWord, StruID: strStruID, StruType: strStruType, Range: strRange };

        if (loadJQGrid($jq[0].id, query))
        {
            refreshJQGrid($jq[0].id);
        }
    }
    pageArg.reloadData = reloadData;
    reloadData();

    var saveSettingData = function ()
    {
        var $changeTr = $jq.find("tr[isChange='Y']");
        if ($changeTr.lenght == 0)
        {
            return alertMsg("数据未改变!");
        }

        var arrSettingData = [];
        $changeTr.each(function ()
        {
            var stationIDs = $(this).find("td[aria-describedby='jqgStation_StationIDs']")[0].title;
            var deptIDs = $(this).find("td[aria-describedby='jqgStation_DeptIDs']")[0].title;

            arrSettingData.push({
                OperStationID: $changeTr[0].id,
                StationIDs: stationIDs,
                DeptIDs: deptIDs
            });
        });

        ajax(document.URL, { "Action": "SaveSettingData", "SettingData": $.jsonToString(arrSettingData) }, "json", function (data)
        {
            alertMsg(data.Data);
        });
    };

    pageArg.saveSettingData = saveSettingData;


    $("body").click(function (event)
    {
        //选择岗位
        if (event.target.tagName.toUpperCase() == "A" && event.target.className && event.target.className.indexOf("select-icon") != -1)
        {
            if ($("#btnSave", window.parent.document).length != 0)
            {
                var $tr = $(event.target).closest("tr");
                var stationTd = $tr.find("td[aria-describedby='jqgStation_StationIDs']")[0];
                var deptTd = $tr.find("td[aria-describedby='jqgStation_DeptIDs']")[0];
                if (event.target.role && event.target.role == "station")
                {

                    stationTd.value = stationTd.title;
                    pageArg.hidInput = stationTd;
                    pageArg.txtInput = $(event.target).find("input")[0];  //关联全局变量，以备打开的模式窗口调用
                    if (!stationTd.oldValue)
                    {
                        stationTd.oldValue = stationTd.title;
                    }

                    var returnValue = openModalWindow("../../Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=SwitchStation&CorpID=TotalCompany", 1000, 700);
                    if (returnValue)
                    {
                        if (stationTd.value != stationTd.oldValue || deptTd.value != deptTd.oldValue)
                        {
                            $tr.attr("isChange", "Y");
                        }
                        else
                        {
                            $tr.attr("isChange", "N");
                        }
                    }
                }
                else if (event.target.role && event.target.role == "dept")
                {
                    deptTd.value = deptTd.title;
                    pageArg.hidInput = deptTd;
                    pageArg.txtInput = $(event.target).find("input")[0]; //关联全局变量，以备打开的模式窗口调用
                    if (!deptTd.oldValue)
                    {
                        deptTd.oldValue = deptTd.title;
                    }

                    var returnValue = openModalWindow("../../Common/Select/VSelectMultiDept.aspx?From=SwitchStation&CorpID=TotalCompany", 1000, 700);
                    if (returnValue)
                    {
                        if (deptTd.value != deptTd.oldValue || stationTd.value != stationTd.oldValue)
                        {
                            $tr.attr("isChange", "Y");
                        }
                        else
                        {
                            $tr.attr("isChange", "N");
                        }
                    }
                }
            }
            else
            {
                return alertMsg("没有设置权限。");
            }
        }
    });

    $jq.mouseover(function (event)
    {
        if (event.target.tagName.toUpperCase() == "INPUT")
        {
            if (!event.target.title || event.target.value != event.target.odlValue)
            {
                event.target.title = event.target.value;
            }
        }
    });
});


function switchStation(cellvalue, options, rowobject)
{
    return "<a class='select-icon' role='station'><input class='text' style='cursor:default' type='text' readonly='readonly' value='" + cellvalue + "'/></a>";
}

function switchDept(cellvalue, options, rowobject)
{
    return "<a class='select-icon' role='dept'><input class='text' style='cursor:default' type='text' readonly='readonly' value='" + cellvalue + "'/></a>";
}


// 岗位查看
function showStation(cellvalue, options, rowobject)
{
    var struID = parent["StruID"];
    var url = "'VStationInfoBrowse.aspx?StationID=" + rowobject[0] + "&StruID=" + struID + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}