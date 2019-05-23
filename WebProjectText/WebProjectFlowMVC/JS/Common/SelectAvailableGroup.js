// 选择我的公司的工作组VSelectAvailableGroup.aspx用到的js
// 作者：程爱民
// 日期：2010-08-06

// 选择工作组
function selectGroup(bClose)
{
    var groupIDs = getJQGridSelectedRowsID("jqGrid1", true);
    var selNames = getJQGridSelectedRowsData('jqGrid1', true, 'GroupName');
    if (groupIDs.length == 0&&getObj("hidAim").value!="ArchivesGroup")
    {
        alert("没有选择任何工作组。");
        return false;
    }

    //项目资料授权
    if ($("#hidAim").val() == "ProjectMeterialAllow") {
        window.returnValue = groupIDs + "|" + stripHtml(selNames);
        window.close();
        return;
    }

    // 报表授权工作组
    if ($("#hidAim").val() == "ReportAllow")
    {
        var txt = getObjD("txtAllowGroup");
        var hid = getObjD("hidAllowGroupID");
        var bHaveRepeat = false;
        var selIds = hid.value.split(",");
        var values = [];
        var texts = [];
        for (var i = 0; i < groupIDs.length; i++)
        {
            var repeat = false;
            for (var j = 0; j < selIds.length; j++)
            {
                if (selIds[j] == groupIDs[i])
                {
                    repeat = true;
                    bHaveRepeat = true;
                    break;
                }
            }
            if (!repeat)
            {
                values.push(groupIDs[i]);
                texts.push(stripHtml(selNames[i]));
                bAllRepeat = false;
            }
        }
        if (!values.length)
        {
            return alertMsg((bHaveRepeat ? "不能重复选择" : "未选择任何") + "工作组。");
        }
        txt.value += (txt.value ? "," : "") + texts.join(",");
        hid.value += (hid.value ? "," : "") + values.join(",");

        window.close();
        return;
    }
    
    //新增岗位时设置工作组 add by 张敏强
    if($("#hidAim").val() == "AddGroup")
    {
        //返回选择项的信息
        var groupObj = window.dialogArguments.groupInfo;
        $("#jqGrid1 tr").each(function(){
            if ($(this).find("td:first input:checkbox").attr("checked") && !$(this).find("td:first input:checkbox").attr("disabled"))
            {
                var $td = $(this).find("td");
                groupObj.groupIDs.push(this.id);
                groupObj.groupNos.push($td.filter(":eq(2)").get(0).title);
                groupObj.groupNames.push($td.filter(":eq(3)").get(0).title);
                groupObj.groupCorpNames.push($td.filter(":eq(4)").get(0).title);
            }
        });
  
        window.close();
    }
    
    var bAllRepeat = true;
    
    // 为岗位设置隶属于工作组
    if (getObj("hidAim").value == "StationGroup")
    {
        window["IsClose"] = bClose;
        ajaxRequest("FillData.ashx", {action: "AddStationGroup", StationID:getParamValue("StationID"), GroupIDs:groupIDs.join(","), Title:window.dialogArguments.top.document.title},
            "text", finishAddStationGroup);
        return;
    } 
    //为知识目录中的文档设置工作组权限       
    if (getObj("hidAim").value == "ArchivesGroupView" || getObj("hidAim").value == "ArchivesGroupDown")
    {
        window.returnValue = groupIDs + "|" + stripHtml(selNames);
        bAllRepeat = false;
    }

    if ($("#hidAim").val() == "ListPageRole")
    {
        var selectedGrops = [];
        $("#jqGrid1 tr").each(function ()
        {
            if ($(this).find("td:first input:checkbox").attr("checked") && !$(this).find("td:first input:checkbox").attr("disabled"))
            {
                var $td = $(this).find("td");
                selectedGrops.push(
                    {
                        MID: getNewID().toUpperCase(),
                        MemberID: this.id,
                        MemberName: $td.filter(":eq(3)").get(0).title,
                        MemberTypeName: "工作组",
                        MemberType: "1"
                    }
                );

                window.returnValue = selectedGrops;
                bAllRepeat = false;
            }
        });
    }
    if (bAllRepeat)
    {
        alert("不能重复添加工作组。");
        return false;
    }
    
    window.close();
}

// 设置完岗位工作组，刷新数据
function finishAddStationGroup(data, textStatus)
{
    if (data == "Y")
    {
        alert("操作成功。");
        if (!window["IsClose"])
        {
            reloadData();
        }
        window.dialogArguments.reloadData();
        if (window["IsClose"])
        {
            window.close();
        }
    }
    else
    {
        alert(data);
    }
}

// 刷新数据
function reloadData()
{
    var query = {CorpID:getObj("ddlCorp").value, KW:getObj("txtKW").value};
    
    if (loadJQGrid("jqGrid1", query))
    {
       // addParamsForJQGridQuery("jqGrid1", [query]);
        refreshJQGrid("jqGrid1");
    }
}

//岗位新增时设置工作组 add by 张敏强 2012-4-13
function customGridComplete()
{
    //设置已选项为不可用
    if($("#hidAim").val() == "AddGroup")
    {
        idArray = window.dialogArguments.groupInfo.groupArr.slice(0);
        var $trs = $("#jqGrid1 tr");
        if($trs.length > 0 && idArray.length > 0)
        {
            $trs.each(function(){            
                for(var j=0;j < idArray.length;j++)
                {
                    if(this.id  === idArray[j].toString())
                    {
                        $(this).find("td:first input:checkbox").attr("disabled","disabled");
                        idArray = idArray.slice(0,j).concat(idArray.slice(j+1,idArray.length));
                        return;
                    }
                }
            });
        }
    }
}

// 工作组查看
function showGroup(cellvalue,options,rowobject)
{
    var url = "'../../../OperAllow/Group/VGroupBrowse.aspx?GroupID=" + rowobject[0] + "'";
    return '<a href="javascript:window.openWindow(' + url + ',500,300)">' + cellvalue + '</a>';
}

// 清空岗位
function clearGroup()
{
    switch ($("#hidAim").val())
    {
        case "ReportAllow":
            getObjD("txtAllowGroup").value = "";
            getObjD("hidAllowGroupID").value = "";
            break;
        //知识管理，管理员目录管理，清空工作组  张韩  20150709
        case "ArchivesGroupView":
            getObjD("txtGroupID").value = "";
            getObjD("hidGroupID").value = "";
            break;
        case "ArchivesGroupDown":
            getObjD("txtGroupDL").value = "";
            getObjD("hidGroupDL").value = "";
            break;
        case "ProjectMeterialAllow":
            window.returnValue = "|";
            break;
    }
    window.close();
}


