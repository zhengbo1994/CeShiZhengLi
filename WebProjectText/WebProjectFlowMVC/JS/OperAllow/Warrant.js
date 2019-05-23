// 工作组和岗位设置的js

// 选中的选项卡索引
var selIndex = -1;

// 切换选项卡
function showSetTab(index)
{
    if ((selIndex == 0 || selIndex == 1) && (!frameIsReady("Set" + selIndex) || !window.frames("Set" + selIndex).jqGridIsComplete("jqGrid1")))
    {
        return alertMsg("页面未加载完毕，请稍后再试。");
    }

    selectTab(index, "SetInfo");
                
    for (var i = 0; i < 6; i++)
    {
        if (i != index)
        {
            getObj("ifr" + i).style.display = "none";
        }
    }
    
    var ifr = getObj("ifr" + index);
    ifr.style.display = "block";
    
    if (ifr.src == "")
    {
        var aim = getObj("hidAim").value;
        var id = getObj("hidID").value;
        var struID =  "";
       if(getObj("hidStruID")) 
       {
           struID = getObj("hidStruID").value;
       }
    
        switch (index)
        {
            case 0:
                switch (aim)
                {
                    case "Group":
                        ifr.src = "VGroupContainStation.aspx?GroupID=" + id;
                        break;
                    case "Station":
                        ifr.src = "VStationUnderGroup.aspx?StationID=" + id;
                        break;
                }
                break;
            case 1:
                ifr.src = "VWarrantProject.aspx?Aim=" + aim + "&ID=" + id;
                break;
            case 2:
                ifr.src = "VWarrantOAOper.aspx?Aim=" + aim + "&ID=" + id+"&StruID="+struID;
                break;
            case 3:
                ifr.src = "VWarrantAPModel.aspx?Aim=" + aim + "&ID=" + id;
                break;
            case 4:
                ifr.src = "VWarrantAPModelForApp.aspx?Aim=" + aim + "&ID=" + id;
                break;
            case 5:
                ifr.src = "VWarrantAPModelForWeChat.aspx?Aim=" + aim + "&ID=" + id;
                break;
        }
    }
    
     var display = (index == 2 ? "" : "none");
    getObj("btnSaveAllow").style.display = display;
    getObj("btnSaveAllow_tb").style.display = display;

    display = (index == 3 ? "" : "none");
    getObj("btnSave").style.display = display;
    getObj("btnSave_tb").style.display = display;

    display = (index == 4 ? "" : "none");
    getObj("btnSaveApp").style.display = display;
    getObj("btnSaveApp_tb").style.display = display;

    getObj("btnSaveWeChat").style.display = index == 5 ? "" : "none";

    selIndex = index;
}

// 切换项目授权明细选项卡
function showOperTab(index)
{
    selectTab(index, "OperInfo");
                
    for (var i = 0; i < 2; i++)
    {
        if (i != index)
        {        
            getObj("tb" + i).style.display = "none";
        }
    }
    
    getObj("tb" + index).style.display = "block";
}

// 查看模式下切换选项卡
function showBrowseTab(index)
{
    if ((selIndex == 1 || selIndex == 2) && (!frameIsReady("Info" + selIndex) || !window.frames("Info" + selIndex).jqGridIsComplete("jqGrid1")))
    {
        return alertMsg("页面未加载完毕，请稍后再试。");
    }

    selectTab(index, "BrowseInfo");
                
    for (var i = 0; i < 7; i++)
    {
        if (i != index && getObj("info" + i))
        {
            getObj("info" + i).style.display = "none";
        }
    }
    
    var ifr = getObj("info" + index);
    ifr.style.display = "block";
    
    if (index > 0 && ifr.src == "")
    {
        var aim = getObj("hidAim").value;
        var id = getObj("hidID").value;
       var struID 
        if(getObj("hidStruID")) 
       { 
            struID=getObj("hidStruID").value;
       }
        switch (index)
        {
            case 1:
                switch (aim)
                {
                    case "Group":
                        ifr.src = "../Permission/VGroupContainStation.aspx?From=Browse&GroupID=" + id;
                        break;
                    case "Station":
                        ifr.src = "../Permission/VStationUnderGroup.aspx?From=Browse&StationID=" + id;
                        break;
                }
                break;
            case 2:
                ifr.src = "../Permission/VWarrantProject.aspx?From=Browse&Aim=" + aim + "&ID=" + id;
                break;
            case 3:
                ifr.src = "../Permission/VWarrantOAOper.aspx?From=Browse&Aim=" + aim + "&ID=" + id+"&StruID="+struID;
                break;
            case 4:
                ifr.src = "../Permission/VWarrantAPModel.aspx?From=Browse&Aim=" + aim + "&ID=" + id;
                break;
            case 5:
                ifr.src = "../Permission/VWarrantAPModelForApp.aspx?From=Browse&Aim=" + aim + "&ID=" + id;
                break;
            case 6:
                ifr.src = "../Permission/VWarrantAPModelForWeChat.aspx?From=Browse&Aim=" + aim + "&ID=" + id;
                break;
        }
    }
    
    selIndex = index;
}

// 新增工作组岗位
function addGroupStation()
{
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableStation.aspx?Aim=GroupStation&GroupID=' + getObj("hidGroupID").value, 700, 600);
}

// 新增岗位工作组
function addStationGroup()
{
    openModalWindow('../../Common/Select/OperAllow/VSelectAvailableGroup.aspx?Aim=StationGroup&StationID=' + getObj("hidStationID").value, 700, 600);
}

// 新增项目
function addProject()
{
    openModalWindow('../../Common/Select/OperAllow/VSelectMyCorpProject.aspx?From=ProjectWarrant&Aim=' + getObj("hidAim").value + "&ID=" + getObj("hidID").value, 700, 600);
}

// 刷新数据(工作组包含岗位、岗位隶属于工作组、授权项目)
function reloadData()
{
    $('#jqGrid1').getGridParam('postData').KW = getObj("txtKW").value;

    $('#jqGrid1').trigger('reloadGrid');
}

// 删除工作组岗位(岗位删除工作组也用该方法)
function delGroupStation()
{
    openDeleteWindow("GroupStation", 1, "jqGrid1");
}

// 删除授权项目
function delProject()
{
    openDeleteWindow("AllowProject", 1, "jqGrid1");
}

// 岗位查看
function showStation(cellvalue, options, rowobject)
{
    var url = "'../Station/VStationBrowse.aspx?StationID=" + rowobject[1] + "'";
    return '<a href="javascript:openWindow(' + url + ',600,450)">' + cellvalue + '</a>';
}

// 帐号查看
function showAccount(accountID)
{
    openWindow("../Account/VAccountBrowse.aspx?AccountID=" + accountID, 650, 600);
}

// 工作组查看
function showGroup(cellvalue, options, rowobject)
{
    var url = "'../Group/VGroupBrowse.aspx?GroupID=" + rowobject[1] + "'";
    return '<a href="javascript:openWindow(' + url + ',500,320)">' + cellvalue + '</a>';
}

// 项目查看
function showProject(cellvalue, options, rowobject)
{
    var url = "'../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + rowobject[1] + "'";
    return '<a href="javascript:openWindow(' + url + ', 600,600)">' + cellvalue + '</a>';
}

// 项目权限设置
function setProjectOper(cellvalue, options, rowobject)
{
    var url = "VWarrantProjectOper.aspx?ProjectID=" + rowobject[1] + "&APID=" + rowobject[0] + "&Aim=" + getObj("hidAim").value + "&ID=" + getObj("hidID").value;
    var text = "设置";
    if (getObj("hidFrom").value == "Browse")
    {
        url += "&From=Browse";
        text = "查看";
    }
    return '<a href="javascript:openWindow(\'' + url + '\', 960,600)">' + text + '</a>';
}

// 科目权限设置
function setSubjectOper(cellvalue, options, rowobject)
{
    
    if(cellvalue=="N" || getObj("hidIsNeedSubjectOper").value=="N")
    return "";
    var aim = getObj("hidAim").value;
    if(aim=="Group")
    {
        var url = "../../CCMP/CauseCost/VSubjectGroupOper.aspx?ProjectID=" + rowobject[1]+"&GroupID="+getObj("hidID").value;
        if (getObj("hidFrom").value == "Browse")
        {
            url += "&From=Browse";
            text = "查看";
        }
        else
        {
            url +=  "&From=Set";
            text = "设置";
        }
        return '<a href="javascript:openWindow(\'' + url + '\', 960,600)">' + text + '</a>';
    }
    if(aim=="Station")
    {
        return "";//Sunwei 2015-11-13 岗位时，返回空。功能后续补充
        //var url = "../../CCMP/CauseCost/VSubjectStationOperBrowse.aspx?ProjectID=" + rowobject[1]+"&StationID="+getObj("hidID").value+"&From=Browse";
        //var text = "查看";
        //return '<a href="javascript:openWindow(\'' + url + '\', 960,600)">' + text + '</a>';
    }
}


// 模块授权时加载模块
function loadMod()
{
    var modID = getObj("ddlMod").value;
    if (modID)
    {
        if (window[modID])
        {
            divMPList.innerHTML = window[modID];
            var span = getObj("span_0");
            if (span)
            {
                span.click();
            }
        }
        else
        {
            ajaxRequest(window.location.href, { AjaxRequest: true, RootModID: modID }, "html", refreshMod);
        }
    }
}

// 刷新模块
function refreshMod(data, textStatus)
{
    switch (data.substr(0, 1))
    {
        case "Y":
            var modID = getParams(this.data)["RootModID"];
            window[modID] = data.substr(1);
            divMPList.innerHTML = window[modID];
            var span = getObj("span_0");
            if (span)
            {
                span.click();
            }
            break;
        case "N":
            showWarnMsg(true, data.substr(1));
            break;
    }
}

// 显示模块信息
function showMod(span, modID)
{
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
    
    window.parent["ModID"] = modID;    
    execFrameFuns("Main", function(){window.parent.frames("Main").loadModInfo(modID, getObjP("hidAim").value, getObjP("hidID").value);}, window.parent);
}

// 加载模块信息
function loadModInfo(modID, aim, id)
{
    ajaxRequest(window.location.href, {AjaxRequest:true, ModID:modID, Aim:aim, ID:id}, "html", refreshModInfo);
}

// 刷新模块信息
function refreshModInfo(data, textStatus)
{
    $(document.body).html(data);
    
    initBoxSize();
    
    var table = getObj(dgID);
    for (var i = 1; i < table.rows.length; i++)
    {
        checkSelectModRowAll(i, 0);
    
        var chks = table.rows[i].cells[2].getElementsByTagName("input");
        for (var j = 0; j < chks.length; j++)
        {
            chks[j].onclick = checkSelectModRowAll;
        }
    }
    
    checkSelectAll(table);    
    
    if (getObjP("hidFrom").value == "Browse")
    {
        var chks = table.getElementsByTagName("input");
        for (var i = 0; i < chks.length; i++)
        {
            chks[i].onclick = function(){ return false; };
        }
    }
}

// 保存模块授权
function saveModWarrant()
{
    if (frameIsReady("Set3") && window.frames("Set3").frameIsReady("Main"))
    {
        var win = window.frames("Set3").frames("Main");
        var aim = getObj("hidAim").value;
        var id = getObj("hidID").value;
        var postInfo = "";        
        var table = win.getObj(win.dgID);        
        for (var i = 1; i < table.rows.length; i++)
        {
            var modID = getObjTR(table, i, "input", 0).value;
            var modOpers = "";
            var chks = table.rows[i].cells[2].getElementsByTagName("input");
            for (var j = 0; j < chks.length; j++)
            {
                if (chks[j].checked)
                {
                    modOpers += "_" + chks[j].value;
                }
            }
            if (modOpers != "")
            {
                modOpers = modOpers.substr(1);
            }
            
            postInfo += "," + modID + "|" + modOpers;
        }
        
        if (postInfo != "")
        {
            postInfo = postInfo.substr(1);
            ajaxRequest("FillData.ashx", {action:(aim + "ModWarrant"), ID:id, Info:postInfo, Title:top.document.title}, "html", afterSave, true, "POST");
        }
        else
        {
            alert("无任何权限信息。");
        }
    }
    else
    {
        alert("页面未加载完毕，请稍后再试。");
    }
}

// 保存模块授权
function saveModAppWarrant()
{
    if (frameIsReady("Set4") && window.frames("Set4").frameIsReady("Main"))
    {
        var win = window.frames("Set4").frames("Main");
        var aim = getObj("hidAim").value;
        var id = getObj("hidID").value;
        var postInfo = "";
        var table = win.getObj(win.dgID);
        for (var i = 1; i < table.rows.length; i++)
        {
            var modID = getObjTR(table, i, "input", 0).value;
            var modOpers = "";
            var chks = table.rows[i].cells[2].getElementsByTagName("input");
            for (var j = 0; j < chks.length; j++)
            {
                if (chks[j].checked)
                {
                    modOpers += "_" + chks[j].value;
                }
            }
            if (modOpers != "")
            {
                modOpers = modOpers.substr(1);
            }

            postInfo += "," + modID + "|" + modOpers;
        }

        if (postInfo != "")
        {
            postInfo = postInfo.substr(1);
            ajaxRequest("FillData.ashx", { action: (aim + "ModWarrant"), ID: id, Info: postInfo, Title: top.document.title }, "html", afterSave, true, "POST");
        }
        else
        {
            alert("无任何权限信息。");
        }
    }
    else
    {
        alert("页面未加载完毕，请稍后再试。");
    }
}
// 保存模块授权
function saveModWeChatWarrant()
{
    if (frameIsReady("Set5") && window.frames("Set5").frameIsReady("Main"))
    {
        var win = window.frames("Set5").frames("Main");
        var aim = getObj("hidAim").value;
        var id = getObj("hidID").value;
        var postInfo = "";
        var table = win.getObj(win.dgID);
        for (var i = 1; i < table.rows.length; i++)
        {
            var modID = getObjTR(table, i, "input", 0).value;
            var modOpers = "";
            var chks = table.rows[i].cells[2].getElementsByTagName("input");
            for (var j = 0; j < chks.length; j++)
            {
                if (chks[j].checked)
                {
                    modOpers += "_" + chks[j].value;
                }
            }
            if (modOpers != "")
            {
                modOpers = modOpers.substr(1);
            }

            postInfo += "," + modID + "|" + modOpers;
        }

        if (postInfo != "")
        {
            postInfo = postInfo.substr(1);
            ajaxRequest("FillData.ashx", { action: (aim + "ModWarrant"), ID: id, Info: postInfo, Title: top.document.title }, "html", afterSave, true, "POST");
        }
        else
        {
            alert("无任何权限信息。");
        }
    }
    else
    {
        alert("页面未加载完毕，请稍后再试。");
    }
}

// 保存项目授权
function saveProjectWarrant(bClose)
{
    var apID = getObj("hidAPID").value;
    var info1 = getSaveProjectOperInfo(tbCCM, 1, false);
    var info2 = getSaveProjectOperInfo(dgCCM, 2, true);
    var info3 = getSaveProjectOperInfo(tbPBM, 1, false);
    var info4 = getSaveProjectOperInfo(dgPBM, 2, true);
    
    var postData = {action:"ProjectOperWarrant", APID:apID, Info1:info1, Info2:info2, Info3:info3, Info4:info4, Title:document.title};
    var sucess = function(data, textStatus)
    {
        afterSave(data, textStatus);
        if (bClose)
        {
            closeMe();
        }
    }
    
    ajaxRequest("FillData.ashx", postData, "html", sucess, true, "POST");
}

function saveAllowCorpOper(bClose)
{
    var corpID = getObjF("ifr2","ddlCorp").value;
    var relID = getObj("hidID").value;
    var dgOA =  window.frames("ifr2").dgOA;
    var info = getSaveProjectOperInfo(dgOA, 2, true);
    var aim = getObj("hidAim").value;
    var relType="G";

    if(aim =="Station")
    {
        relType="S";
    }
    
    var postData = {action:"AllowCorpOper", CorpID:corpID, RelID:relID, RelType:relType, Info:info, Title:document.title};
    var sucess = function(data, textStatus)
    {
        afterSave(data, textStatus);
        if (bClose)
        {
            closeMe();
        }
    }
    
    ajaxRequest("FillData.ashx", postData, "html", sucess, true, "POST");
}

// 获取项目授权信息
function getSaveProjectOperInfo(table, startCellIndex, needType)
{
    var result = "";
    for (var i = 1; i < table.rows.length; i++)
    {
        if (needType)
        {
            result += "," + getObjTC(table, i, 0, "input", 0).value;
        }
        for (var j = startCellIndex; j < table.rows[0].cells.length; j++)
        {
            var chks = table.rows[i].cells[j].getElementsByTagName("input");
            if(chks.length>3)
            {
                result += "|"+chks[3].value+"^" + (chks[0].checked ? "0" : "N") + (chks[1].checked ? "1" : "N") + (chks[2].checked ? "2" : "N");
            }
        }
    }
    if (result != "")
    {
        result = result.substr(1);
    }
    
    return result;
}

// 保存模块权限后弹出消息(成功或失败)
function afterSave(data, textStatus)
{
    alert(data);
}

/* 模块授权的选择控制 */

// 表格(模块)权限全选
function selectMods(chk)
{
    var table = getObj(dgID);
    var chks = table.getElementsByTagName("input");
    for (var i = 1; i < chks.length; i++)
    {
        chks[i].checked = chk.checked;
    }
}

// 某行(模块)权限全选
function selectMod(chk)
{
    var row = chk.parentNode.parentNode;
    var chks = row.cells[2].getElementsByTagName("input");
    for (var i = 0; i < chks.length; i++)
    {
        chks[i].checked = chk.checked;
    }
    
    checkSelectAll(getObj(dgID));
}

// 某行、表格的全选控制
function checkSelectModRowAll(rowIndex, checkAll)
{
    var chk;
    if (!rowIndex)
    {
        chk = window.event.srcElement || window.event.target;
        if (chk != null)
        {
            rowIndex = chk.parentNode.parentNode.rowIndex;
        }
    }
    
    if (rowIndex)
    {
        var flag = 0;
        var table = getObj(dgID);
        var chks = table.rows[rowIndex].cells[2].getElementsByTagName("input");
        if (chks.length == 0)
        {
            flag = 1;
        }
        else
        {
            // View权限和其他权限的联动关系
            if (chk != null)
            {
                if (chk.value.toUpperCase() == "VIEW" && !chk.checked)
                {
                    for (var i = 1; i < chks.length; i++)
                    {
                        chks[i].checked = false;
                    }
                }
                if (chk.value.toUpperCase() != "VIEW" && chk.checked)
                {
                    chks[0].checked = true;                
                }
            }
        }
        for (var i = 0; i < chks.length; i++)
        {
            if (!chks[i].checked)
            {
	            flag = 1;
	            break;
            }
        }
        
        getObjTR(table, rowIndex, "input", 0).checked = (flag != 1);
        
        if (checkAll != 0)
        {
            checkSelectAll(table);
        }
    }    
}


// 项目授权设置页的onload
function loadProjectOper()
{
    showOperTab(0);
    
    initOperClick(tbCCM, 1, 1);
    initOperClick(dgCCM, 1, 2);
    initOperClick(tbPBM, 1, 1);
    initOperClick(dgPBM, 1, 2);

    checkSelectRowAll(tbCCM, -1, 0); 
    if (dgCCM.rows.length > 1)
    {
        checkSelectRowAll(dgCCM, -1, 0);
        checkSelectCellAll(dgCCM, -1, 0);
        checkSelectTableAll(dgCCM);
    }
    checkSelectRowAll(tbPBM, -1, 0);
    if (dgPBM.rows.length > 1)
    {
        checkSelectRowAll(dgPBM, -1, 0);
        checkSelectCellAll(dgPBM, -1, 0);
        checkSelectTableAll(dgPBM);
    }
    
    if (getObj("hidFrom").value == "Browse")
    {
        var chks = tdOper.getElementsByTagName("input");
        for (var i = 0; i < chks.length; i++)
        {
            chks[i].onclick = function(){ return false; };
        }
    }
}

// 项目授权设置页的onload
function loadAllowCorpOper()
{
    initOperClick(dgOA, 1, 2);

    if (dgOA.rows.length > 1)
    {
        checkSelectRowAll(dgOA, -1, 0);
        checkSelectCellAll(dgOA, -1, 0);
        checkSelectTableAll(dgOA);
    }
    
    if (getObj("hidFrom").value == "Browse")
    {
        var chks = dgOA.getElementsByTagName("input");
        for (var i = 0; i < chks.length; i++)
        {
            chks[i].onclick = function(){ return false; };
        }
    }
}

// 为权限CheckBox加onclick
function initOperClick(table, startRowIndex, startCellIndex)
{
    for (var i = startRowIndex; i < table.rows.length; i++)
    {
        for (var j = startCellIndex; j < table.rows[0].cells.length; j++)
        {
            var chks = table.rows[i].cells[j].getElementsByTagName("input");
            for (var k = 0; k < chks.length; k++)
            {
                chks[k].onclick = selectOper;
            }
        }
    }    
}


/* 项目授权的选择控制 */

// 全选权限表格
function selectAll(chk, container)
{
    var chks = container.getElementsByTagName("input");
    for (var i = 1; i < chks.length; i++)
    {
        if (chks[i].type.toUpperCase() == "CHECKBOX")
        {
            chks[i].checked = chk.checked;
        }
    }
}

// 选择权限项
function selectOper()
{
    chk = window.event.srcElement || window.event.target;
    if (chk != null)
    {
        var cell = chk.parentNode;
        var row = cell.parentNode;
        var table = row.parentNode.parentNode;
        var cellIndex = cell.cellIndex
        var rowIndex = row.rowIndex;
        
        if (chk.id.indexOf("_0_") != -1 && !chk.checked)
        {
            getObjC(cell, "input", 1).checked = chk.checked;
        }
        else if (chk.id.indexOf("_1_") != -1 && chk.checked)
        {
            getObjC(cell, "input", 0).checked = chk.checked;
        }
        
        checkSelectRowAll(table, -1, 0);
        if (table.id.indexOf("dg") != -1)
        {
            checkSelectCellAll(table, -1, 0);
            checkSelectTableAll(table);
        }
    }
}

// 全选权限行
function selectRowAll(chk, table, rowIndex)
{
    var chks = table.rows[rowIndex].getElementsByTagName("input");
    for (var i = 1; i < chks.length; i++)
    {
        if (chks[i].type.toUpperCase() == "CHECKBOX")
        {
            chks[i].checked = chk.checked;
        }
    }
    
    if (table.id.indexOf("dg") != -1)
    {
        checkSelectCellAll(table, -1, 1);
    }
}

// 全选权限列
function selectCellAll(chk, table, cellIndex, operIndex)
{
    for (var i = 1; i < table.rows.length; i++)
    {
        getObjTC(table, i, cellIndex, "input", operIndex).checked = chk.checked;
        if (operIndex == 0 && !chk.checked)
        {
            getObjTC(table, 0, cellIndex, "input", 1).checked = chk.checked;
            getObjTC(table, i, cellIndex, "input", 1).checked = chk.checked;
        }
        else if (operIndex == 1 && chk.checked)
        {
            getObjTC(table, 0, cellIndex, "input", 0).checked = chk.checked;
            getObjTC(table, i, cellIndex, "input", 0).checked = chk.checked;
        }
    }
    
    checkSelectRowAll(table, -1, 1);
}

// 权限行的全选控制
function checkSelectRowAll(table, rowIndex, checkAll)
{
    var min = rowIndex;
    var max = rowIndex;
    if (rowIndex < 1)
    {
        min = 1
        max = table.rows.length - 1;
    }
    for (var i = min; i <= max; i++)
    {
        var flag = 0;
        var chks = table.rows[i].getElementsByTagName("input");
        for (var j = 1; j < chks.length; j++)
        {
            if (chks[j].type.toUpperCase() == "CHECKBOX" && !chks[j].checked)
            {
                flag = 1;
                break;
            }
        }
        getObjTC(table, i, 0, "input", 0).checked = (flag != 1);
    }
    
    if (checkAll != 0)
    {
        checkSelectTableAll(table);
    }
}

// 权限列的全选控制
function checkSelectCellAll(table, cellIndex, checkAll)
{
    var min = cellIndex;
    var max = cellIndex;
    if (cellIndex < 2)
    {
        min = 2
        max = table.rows[0].cells.length - 1;
    }
    
    for (var i = min; i <= max; i++)
    {
        var flag0 = 0;
        var flag1 = 0;
        var flag2 = 0;
        for (var j = 1; j < table.rows.length && (flag0 == 0 || flag1 == 0 || flag2 == 0); j++)
        {
            if (flag0 == 0 && !getObjTC(table, j, i, "input", 0).checked)
            {
                flag0 = 1;
            }
            if (flag1 == 0 && !getObjTC(table, j, i, "input", 1).checked)
            {
                flag1 = 1;
            }
            if (flag2 == 0 && !getObjTC(table, j, i, "input", 2).checked)
            {
                flag2 = 1;
            }
        }
        getObjTC(table, 0, i, "input", 0).checked = (flag0 != 1);
        getObjTC(table, 0, i, "input", 1).checked = (flag1 != 1);
        getObjTC(table, 0, i, "input", 2).checked = (flag2 != 1);
    }
    
    if (checkAll != 0)
    {
        checkSelectTableAll(table);
    }
}

// 权限表的全选控制
function checkSelectTableAll(table)
{
    var flag = 0;
    var chks = table.rows[0].getElementsByTagName("input");
    for (var i = 1; i < chks.length; i++)
    {
        if (!chks[i].checked)
        {
            flag = 1;
            break;
        }
    }
    getObjTC(table, 0, 0, "input", 0).checked = (flag != 1);
}