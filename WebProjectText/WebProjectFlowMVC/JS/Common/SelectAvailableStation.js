// 选择我的公司的岗位页VSelectAvailableStation.aspx用到的js
// 作者：程爱民
// 日期：2010-07-28


// VSelectAvailableStation.aspx的js

// 页面加载或切换公司
function resetDept(ddlCorp)
{
    if (ddlCorp.value != "")
    {
        if (!frameIsReady("Left"))
        {
            alert("页面未加载完毕。");
            return;
        }
    
        window.frames('Left').refreshDept(ddlCorp.value);
    }
}

// 刷新公司下的部门
function refreshDept(corpID)
{
    ajaxRequest("VSelectAvailableStationDept.aspx", { AjaxCorpID: corpID }, "html", loadDept);
}

// 加载部门，加载完点击第一个部门
function loadDept(data, textStatus)
{
    $(document.body).html(data);
    
    var span = getObj("span_0");
    if (span)
    {
        span.click();
    }
    else
    {
        window.parent["DeptID"] = null;
        execFrameFuns("Main", function(){window.parent.frames("Main").reloadData();}, window.parent);        
    }
}


function selectStation(bClose)
{
    var aim = getObj("hidAim").value;
    var bAllRepeat = true;
    var stationIDs = window.frames("Main").getJQGridSelectedRowsID("jqStation", true);
    var stationNames = window.frames("Main").getJQGridSelectedRowsData("jqStation", true, "StationName");
    var corpNames = window.frames("Main").getJQGridSelectedRowsData("jqStation", true, "ParentCorpName");
    var names = window.frames("Main").getJQGridSelectedRowsData("jqStation", true, "TAccount__EmployeeName");
    var deptNames = window.frames("Main").getJQGridSelectedRowsData("jqStation", true, "TCorpStructure__StruName");
    var positionNames = window.frames("Main").getJQGridSelectedRowsData("jqStation", true, "TPosition__PositionName");

    if (stationIDs.length == 0)
    {
        alert("未选择任何岗位。");
        return false;
    }

    // 报表授权岗位
    if (aim == "ReportAllow")
    {
        var txt = getObjD("txtAllowStation");
        var hid = getObjD("hidAllowStationID");
        var bHaveRepeat = false;
        var selIds = hid.value.split(",");
        var values = [];
        var texts = [];
        for (var i = 0; i < stationIDs.length; i++)
        {
            var repeat = false;
            for (var j = 0; j < selIds.length; j++)
            {
                if (selIds[j] == stationIDs[i])
                {
                    repeat = true;
                    bHaveRepeat = true;
                    break;
                }
            }
            if (!repeat)
            {
                values.push(stationIDs[i]);
                texts.push(stripHtml(stationNames[i]) + (stripHtml(names[i]) ? "(" + stripHtml(names[i]) + ")" : ""));
                bAllRepeat = false;
            }
        }
        if (!values.length)
        {
            return alertMsg((bHaveRepeat ? "不能重复选择" : "未选择任何") + "岗位。");
        }
        txt.value += (txt.value ? "," : "") + texts.join(",");
        hid.value += (hid.value ? "," : "") + values.join(",");

        window.close();
        return;
    }
    
    // 账号设置岗位
    if (aim == "AccountStation") {
        var tbStation = getObjD("tbStation");
        if (!tbStation) {
            tbStation = window.dialogArguments.tbStation;
        }

        for (var i = 0; i < stationIDs.length; i++) {
            var repeat = false;
            for (var j = 1; j < tbStation.rows.length; j++) {
                if (getObjTR(tbStation, j, "input", 0).value == stationIDs[i]) {
                    repeat = true;
                    break;
                }
            }

            if (!repeat) {
                var row = tbStation.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(null, stationIDs[i]);

                cell = row.insertCell(1);
                cell.innerText = stripHtml(stationNames[i]);

                cell = row.insertCell(2);
                cell.innerText = corpNames[i];

                cell = row.insertCell(3);
                cell.innerText = stripHtml(deptNames[i]);

                cell = row.insertCell(4);
                cell.innerText = positionNames[i];

                cell = row.insertCell(5);
                cell.align = "center";
                if (tbStation.rows.length == 2) {
                    cell.innerHTML = '<input type="radio" name="DS" class="idbox" checked="true" />';
                }
                else {
                    cell.innerHTML = '<input type="radio" name="DS" class="idbox" />';
                }

                bAllRepeat = false;
            }
        }
    }

    // 工作组设置岗位
    else if (aim == "GroupStation") {
        window["IsClose"] = bClose;
        ajaxRequest("FillData.ashx", { action: "AddGroupStation", StationIDs: stationIDs.join(","), GroupID: getParamValue("GroupID"), Title: window.dialogArguments.top.document.title },
            "text", finishAddGroupStation, true, "POST");
        return;
    }
    // 高管团队
    else if (aim == "ExecutiveTeam") {
        window["IsClose"] = bClose;
        ajaxRequest("FillData.ashx", { action: "ExecutiveTeam", Type: getParamValue("Action"), StationIDs: stationIDs.join(","), ETID: getParamValue("ETID"), Title: window.dialogArguments.top.document.title },
            "text", finishAddGroupStation, true, "POST");
        return;
    }
    else if (aim == "IA") {
        window.returnValue = stationIDs + "|" + stripHtml(stationNames);
        window.opener = null;
        window.close();
        return;
    }
    if (bAllRepeat)
    {
        alert("不能重复添加岗位。");
        return false;
    }
    
    if (bClose)
    {
        window.close();
    }
    else
    {
        // 账号设置岗位
        if (aim == "AccountStation")
        {
            window.dialogArguments.setDisplay();
        }
    }
}

// 设置完工作组岗位，刷新数据
function finishAddGroupStation(data, textStatus)
{
    if (data == "Y")
    {
        alert("操作成功。");
        if (!window["IsClose"])
        {
            window.frames("Main").reloadData();
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




// VSelectAvailableStationDept.aspx的js

// 点击部门
function showStation(span, deptID)
{
    if (!window.parent.frameIsReady("Main"))
    {
        alert("页面未加载完毕。");
        return;
    }
    
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    span.className = "selNode";
    window.parent["Selected"] = span.id;
    
    window.parent["DeptID"] = deptID;
    execFrameFuns("Main", function(){window.parent.frames("Main").reloadData();}, window.parent);
}



// VSelectAvailableStationMain.aspx的js

// 刷新数据
function reloadData()
{
    var query = {IsSetAccount:getObjP("ddlSetAccount").value, DeptID:window.parent["DeptID"], KW:getObjP("txtKW").value};
    
    if (loadJQGrid("jqStation", query))
    {
//        addParamsForJQGridQuery("jqStation", [query]);
        refreshJQGrid("jqStation");
    }
}

// 岗位名称的超链
function renderLink(cellvalue, options, rowobject)
{
    return stringFormat("<a href='#Show' onclick=\"openWindow('/{0}/OperAllow/Station/VStationBrowse.aspx?StationID={1}',600,450)\">{2}</a>", rootUrl, rowobject[0], cellvalue);
}

//新增岗位 Add by 张敏强 2012-4-11
var stationInfo=null;
function addStation()
{
    stationInfo = [];
    openModalWindow('../../OperAllow/Station/VStationAdd.aspx?type=AccountStation&StruID='+$("#ddlCorp").val(),850,600);
    if(stationInfo.length > 1)
    {                
        var tbStation = getObjD("tbStation");
        if (!tbStation)
        {
            tbStation = window.dialogArguments.tbStation;
        }
        
        var repeat = false;
        for (var j = 1; j < tbStation.rows.length; j++)
        {
            if (getObjTR(tbStation, j, "input", 0).value == stationInfo[0])
            {
                repeat = true;
                break;
            }
        }
    
        if (!repeat)
        {
            var row = tbStation.insertRow();
                    
            var cell = row.insertCell(0);
            cell.align = "center";
            cell.innerHTML = getCheckBoxHtml(null, stationInfo[0]);
            
            cell = row.insertCell(1);
            cell.innerText = stationInfo[1];
            
            cell = row.insertCell(2);
            cell.innerText = $("#ddlCorp").find("option:selected").text();
            
            cell = row.insertCell(3);
            cell.innerText = stationInfo[2];
            
            cell = row.insertCell(4);
            cell.innerText = stationInfo[3];
            
            cell = row.insertCell(5);
            cell.align = "center";
            if (tbStation.rows.length == 2)
            {
                cell.innerHTML = '<input type="radio" name="DS" class="idbox" checked="true" />';
            }
            else
            {
                cell.innerHTML = '<input type="radio" name="DS" class="idbox" />';
            }
            
            bAllRepeat = false;
        } 
        
        window.close();          
    }
}

// 清空岗位
function clearStation()
{
    switch ($("#hidAim").val())
    {
        case "ReportAllow":
            getObjD("txtAllowStation").value = "";
            getObjD("hidAllowStationID").value = "";
            break;
    }
    window.close();
}
