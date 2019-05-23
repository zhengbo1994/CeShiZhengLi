/// <reference path="../../Common/Select/CheckFlow/VSelectRelateChecker.aspx" />
/// <reference path="../../Common/Select/CheckFlow/VSelectRelateChecker.aspx" />
// JScript 文件
var pop;

$(document).ready(function ()
{
    // 在document加载完成后， 添加本js中所需组建： jsontool.js
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = rootUrl + "/JS/jquery.jsontool.js";
    document.body.appendChild(script);
});


/* 刷新jqGrid */
function reloadData()
{
    var ddlMod = getObjP("ddlFlowModel");
    var fmId = ddlMod.value;

    var query =
        {
            CorpID: getObjP("ddlCorp").value,
            FMID: fmId,
            FlowTypeID: getObjPF("Left", "hidSelID").value,
            CheckAccountID: getObjP("hidAccountID").value,
            AllowAccountID: getObjP("hidRightAccountID").value,
            GetChild: getObjP("ddlChild").value,
            KeyWord: getObjP("txtKW").value
        };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// 加载所有流程类别
function loadFlowType()
{
    scrollTop = divMPList.scrollTop;
    scrollLeft = divMPList.scrollLeft;
    ajaxRequest("VFlowLeft.aspx", { AjaxRequest: true, CorpID: getObjP("ddlCorp").value }, "html", refreshFlowType, false);
}

//大小写区别
function refreshFlowType(data, textStatus)
{
    $(document.body).html(data);

    if (getObj("span_0") != null)
    {
        getObj("span_0").click();
    }
    else
    {
        RefreshFlowType(null, 'All', 'TotalFlowType', '0');
    }
}


function CorpChange()
{
    if ($('#ddlFlowModel').val() != '3F1E7A7C-995C-46F0-B3A9-70811B4D3129')
    {
        $('#btnPL').hide();
    }
    else
    {
        $('#btnPL').show();
    }
    $.post('FillData.ashx', { action: 'GetFlowType', FMID: getObj("ddlFlowModel").value, CorpID: getObj("ddlCorp").value }, function (data, textStatus) { FillFlowType(data); window.frames("Left").loaddata(); }, 'json');
}

function FillFlowType(data)
{
    $('#ddlFlowType option').remove();
    $('#ddlFlowType').get(0).options.add(new Option('请选择...', ''));
    $(data).each(function (i)
    {
        $('#ddlFlowType').get(0).options.add(new Option(data[i].text, data[i].value));
    });
    if ($("#ddlFlowType option[value='" + $('#hidFlowType').val() + "']").length > 0)
    {
        $('#ddlFlowType').val($('#hidFlowType').val());
    }
    else
    {
        $('#hidFlowType').val($('#ddlFlowType').val());
    }
}

function FlowModelChange()
{
    var $btnMore = $("#btnMore");

    if ($btnMore.length === 1 && $("#hidPublishCompany").val() === "YXZY" && $("#hidSettingOper").val() === "Y")
    {
        var flowModelValue = $("#ddlFlowModel").val();
        var strCtrl = $("#hidCtrl").val();

        //strCtrl = strCtrl.substr(0, 3) + "1";
        // 个性流程设置（仅限付款申请和合同/合约模块模块）
        if (flowModelValue === "436D3C5F-A482-426F-9FD2-3E647E793E6E" || flowModelValue === "566C06CC-1DE8-4D88-B16B-81F31978BA9E")
        {
            strCtrl = strCtrl.substr(0, 4) + "1";
        }
        else
        {
            strCtrl = strCtrl.substr(0, 4) + "0";
        }

        $btnMore[0].onclick = function ()
        {
            showDLMenu(this, strCtrl)
        }
    }

    window.frames("Main").reloadData();
}

function btnSearch_Click(changeRange)
{
    if (changeRange && !getObjF("Left", "hidSelID").value)
    {
        return;
    }
    window.frames("Main").reloadData();
}

function needAllot()
{
    var hidFMIDs = $("#hidNeedAllotFMIDs");
    if (hidFMIDs.length && hidFMIDs.val() != "")
    {
        return $("#hidNeedAllotFMIDs").val().indexOf($("#ddlFlowModel").val()) != -1;
    }
}

function ddlFlowModelChangeAndCheckType()
{
    needAllot() ? $("#btnAddAllot").show() : $("#btnAddAllot").hide();

    CheckType();
}
function CheckType()
{
    var flowmodel = $('#ddlFlowModel').val();
    if (flowmodel == '3F1E7A7C-995C-46F0-B3A9-70811B4D3129')
    {
        $('#trShowModelFile').show();
        $('#trModelFile').show();
    }
    else
    {
        $('#trShowModelFile').hide();
        $('#trModelFile').hide();
    }
}
function btnSelectAccount_Click(btn, accountid, accountname)
{
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?From=Leave&type=account&CorpID=' + $("#ddlCorp").val(), 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj(accountid).value = vValue.split('|')[0];
        getObj(accountname).value = vValue.split('|')[1];
        window.frames("Main").reloadData();
    }
}
function btnSelectLookStation_Click(action, StationID, Station)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=' + action + '&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj(StationID).value = vValue.split('|')[0];
        getObj(Station).value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click(action, DeptID, Dept)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=' + action + '&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj(DeptID).value = vValue.split('|')[0];
        getObj(Dept).value = vValue.split('|')[1];
    }
}
function setVisible(areaName, tr)
{
    if (typeof tr === "string")
    {
        $("#" + tr.replace(",", ",#")).toggle(getObj(areaName).value === "1");
    }
    else
    {
        tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
    }
}
function setVisibleByRadio()
{

    var addtype = $("input[name='addtype'][checked=true]").val();
    if (addtype == "1")
    {
        $('#txtPosition').val('');
        $('#hidPositionID').val('');
        $('#trPostion').attr('disabled', 'disabled');
        $('#btnSelectPostion').attr('disabled', 'disabled');
        $('#trPostion').css('display', 'none')

        $('#trStation').attr('disabled', '');
        $('#trStation').css('display', '')
        $('#btnSelectStation').attr('disabled', '');
    }
    else
    {
        $('#trPostion').attr('disabled', '');
        $('#trPostion').css('display', '')
        $('#btnSelectPostion').attr('disabled', '');

        $('#txtStationName').val('');
        $('#hidStationID').val('');
        $('#trStation').attr('disabled', 'disabled');
        $('#trStation').css('display', 'none');
        $('#btnSelectStation').attr('disabled', 'disabled');

    }
}

function setFrameByRadio()
{
    var addtype = $("input[name='addtype'][checked=true]").val(),
        tachtype = $('#hidTachType').val(),
        mainFrame = getObj("frmMain"),
        divAddFixedChecker = $('#divAddFixedChecker'),
        divAddDeptHeader = $('#divAddDeptHeader'),
        divAddHigherFunction = $('#divAddHigherFunction');
    
    hideAllSelectCheckerForm();

    // 串环
    if (tachtype == "Bunch")
    {
        // 职务
        if (addtype == "0")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectSinglePositionFrame.aspx";
        }
            // 岗位
        else if (addtype == "1")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/OperAllow/VSelectSingleStationFrame.aspx?CorpID=" + getObj("hidCorpID").value;
        }
        // 固定审批人
        else if (addtype == "2")
        {
            $('#btnAddFixedChecker').hide();
            divAddFixedChecker.show();
        }
        // 分管领导
        else if (addtype == "B")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectRelateChecker.aspx?IsMulti=N";
        }
        // 公司角色
        else if (addtype == "D")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectFlowRoleFrame.aspx?RoleType=0&IsMulti=N&AddFn=addCorpRolesChecker";
        }
        // 项目角色
        else if (addtype == "E")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectFlowRoleFrame.aspx?RoleType=1&IsMulti=N&AddFn=addProjectRolesChecker";
        }
    }
    // 并环
    else if (tachtype == "Parataxis")
    {
        if (addtype == "0")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectMultiPositionFrame.aspx";
        }
        else if (addtype == "1")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/VSelectMultiStationFrame.aspx?CorpID=" + getObj("hidCorpID").value + "&From=Flow";
        }
            // 固定审批人
        else if (addtype == "2")
        {
            $('#btnAddFixedChecker').show();
            divAddFixedChecker.show();
        }
        // 负责人
        else if (addtype == "A")
        {
            divAddDeptHeader.show();
        }
        // 分管领导
        else if (addtype == "B")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectRelateChecker.aspx?IsMulti=Y";
        }
        // 职能上级
        else if (addtype == "C")
        {
            divAddHigherFunction.show();
        }
        // 公司角色
        else if (addtype == "D")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectFlowRoleFrame.aspx?RoleType=0&IsMulti=Y&AddFn=addCorpRolesChecker";
        }
        // 项目角色
        else if (addtype == "E")
        {
            mainFrame.style.display = "block";
            mainFrame.src = "../../Common/Select/CheckFlow/VSelectFlowRoleFrame.aspx?RoleType=1&IsMulti=Y&AddFn=addProjectRolesChecker";
        }
    }
}

function hideAllSelectCheckerForm() {
    var mainFrame = getObj("frmMain"),
        divAddFixedChecker = $('#divAddFixedChecker'),
        divAddDeptHeader = $('#divAddDeptHeader'),
        divAddChargeLeader = $('#divAddChargeLeader'),
        divAddHigherFunction = $('#divAddHigherFunction');

    mainFrame.style.display = "none";
    mainFrame.src = "";
    divAddFixedChecker.hide();
    divAddDeptHeader.hide();
    divAddChargeLeader.hide();
    divAddHigherFunction.hide();
}

/*
 * 添加公司角色审核人
 * 翁化青 2014-11-14
 * @param roleInfo json-array 角色信息数组
 */
function addCorpRolesChecker(roleInfo)
{
    return addRolesChecker(roleInfo,"0");
}

/*
 * 添加项目角色审核人
 * 翁化青 2014-11-14
 * @param roleInfo json-array 角色信息数组
 */
function addProjectRolesChecker(roleInfo)
{
    return addRolesChecker(roleInfo, "1");
}

/*
 * 添加角色审核人
 * 翁化青 2014-11-14
 * @param roleInfo json-array 角色信息数组
 * @param roleType string  角色类型， 0：公司角色，1：项目角色
 */
function addRolesChecker(roleInfo, roleType)
{
    if (!roleInfo || !roleInfo.length)
    {
        return false;
    }
    var roleTypeName = roleType == "0" ? "[公司角色]" : "[项目角色]";
    var findType = roleType == "0" ? "D" : "E";
    var roleCheckers = PackageSelectedRoleInfoIntoCheckerInfo(roleInfo, '0');
    for (var i = 0, count = roleCheckers.length; i < count; i++) {
        var tempChecker = roleCheckers[i];
        var tempRole = roleInfo[i];
        addChecker(tempChecker.ID, tempRole.FRName + roleTypeName, findType, tempChecker.info);
    }
    return true;
}

function addChecker(value, text, type, info)
{
    var lstStations = getObj("lstStations"),
        infoStr = "",
        repeat = false;

    if (!info)
    {
        infoStr = "";
    }
    else
    {
        infoStr = typeof info === 'string' ? info : $.jsonToString(info);
    }

    // 判断要添加的审核人是否已存在
    for (var j = 0; j < lstStations.length; j++)
    {
        // 一个环节只能有一个固定审核人，只需判断type即可
        if (type == "F" && lstStations.options[j].optiontype == type)
        {
            repeat = lstStations.options[j].optiontype == type;
        }
            // 其他类型审核人需要判断ID、type和依据信息是否重复
        else
        {
            repeat = lstStations.options[j].value == value
                && lstStations.options[j].optiontype == type
                && lstStations.options[j].info == infoStr;
        }

        if (repeat)
        {
            return false;
        }
    }
    var opt = document.createElement("OPTION");
    opt.value = value;
    opt.text = text;
    opt.optiontype = type;
    opt.info = infoStr;

    lstStations.add(opt, lstStations.length);
    return true;
}

function addFlow()
{
    if (getObjF("Left", "lblNoData") != null)
    {
        return alertMsg("请先设置流程类别。");
    }

    if (getObjF("Left", "hidSelID").value == "")
    {
        return alertMsg("请选择流程类别。");
    }

    var useDesigner = $("#hidUseDesigner").val() === "Y";
    var url = "VFlowAdd.aspx?CorpID=" + $('#ddlCorp').val() + "&FMID=" + $('#ddlFlowModel').val() + "&FlowTypeID=" + getObjF("Left", "hidSelID").value;
    if (useDesigner)
    {
        url = addUrlParam(url, "UseDesigner", "1");
    }

    openAddWindow(url, 800, 800, "jqGrid1");
}

function editFlow()
{
    var useDesigner = $("#hidUseDesigner").val() === "Y";
    var url = "VFlowEdit.aspx?CorpID=" + $('#ddlCorp').val();
    if (useDesigner)
    {
        url = addUrlParam(url, "UseDesigner", "1");
    }

    openModifyWindow(url, 800, 800, "jqGrid1", "Main");
}

function addReader()
{
    var $tr = $("#jqGrid1 tr[aria-selected='true']", window.frames("Main").document);
    if ($tr.length < 1)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    var url = "VFlowAddReader.aspx?id=" + window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true) + "&JQID=jqGrid1";
    openWindow(url, 400, 250);
}

function delFlow()
{
    openDeleteWindow("Flow", 0, "jqGrid1", "Main");
}

function showMenu(id, index)
{
    if (id.substr(3, 1) == "1")
    {
        id = id.substr(0, 3) + (needAllot() ? "1" : "0") + id.substr(4);
    }
    document.all.hidInsertIndex.value = index;
    popMenu(itemMenu, 120, id);
    event.returnValue = false;
    event.cancelBubble = true;
    return false;
}

function popMenu(menuDiv, width, rowControlString)
{
    if (!pop)
    {
        pop = window.createPopup();
    }

    pop.document.body.innerHTML = menuDiv.innerHTML;
    var rowObjs = pop.document.body.all[0].rows;
    var rowCount = rowObjs.length;
    for (var i = 0; i < rowObjs.length; i++)
    {
        var hide = rowControlString.charAt(i) != '1';
        if (hide)
        {
            rowCount--;
        }
        rowObjs[i].style.display = (hide) ? "none" : "";
        rowObjs[i].cells[0].onmouseover = function ()
        {
            this.style.background = "#7b68ee";
            this.style.color = "white";
        }
        rowObjs[i].cells[0].onmouseout = function ()
        {
            this.style.background = "#ccff00";
            this.style.color = "black";
        }
    }

    pop.document.oncontextmenu = function ()
    {
        return false;
    }

    pop.document.onclick = function ()
    {
        pop.hide();
    }

    pop.show(event.clientX - 1, event.clientY, width, rowCount * 20, document.body);

    return true;
}

function addFlowTach(tachType, addToLast)
{
    if (pop)
    {
        pop.hide();
    }

    var top, left, newTachInfo;

    document.all.hidInsertID.value = "";

    if (addToLast == true)
    {
        document.all.hidInsertIndex.value = "";
    }

    //调整环
    if (tachType == "Adjust")
    {
        newTachInfo = {
            fixation: 'Y',
            passType: 'ALL',
            flowOption: 'Adjust',
            allowJump: 'N',
            checkDays: 1,
            alertDays: 1,
            flName: '调整',
            isAllowAddTache: 'N',
            checkers: []
        };

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        document.all.btnInsertTach.click();
    }
    //拆分环
    else if (tachType == "Allot")
    {
        newTachInfo = {
            fixation: 'Y',
            passType: 'ALL',
            flowOption: 'Allot',
            allowJump: 'N',
            checkDays: 1,
            alertDays: 1,
            flName: '拆分',
            isAllowAddTache: 'N',
            checkers: []
        };

        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        document.all.btnInsertTach.click();
    }
    //串环
    else if (tachType == "Bunch")
    {
        top = (window.screen.availHeight - 600) / 2;
        left = (window.screen.width - 1000) / 2;

        newTachInfo = openModalWindow('VFlowAddTach.aspx?TachType=Bunch&CorpID=' + document.all.hidCorpID.value, 1000, 800);
        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        if (document.all.hidInsertID.value != "" && document.all.hidInsertID.value != "undefined")
        {
            document.all.btnInsertTach.click();
        }
    }
    //并环
    else if (tachType == "Parataxis")
    {
        top = (window.screen.availheight - 700) / 2;
        left = (window.screen.width - 1000) / 2;
        newTachInfo = openModalWindow('VFlowAddTach.aspx?TachType=Parataxis&CorpID=' + document.all.hidCorpID.value, 1000, 800);
        document.all.hidInsertID.value = $.jsonToString(newTachInfo);
        if (document.all.hidInsertID.value != "" && document.all.hidInsertID.value != "undefined")
        {
            document.all.btnInsertTach.click();
        }
    }
}

function deleteFlowTach()
{
    document.all.btnDeleteTach.click();
}

function movePrevious()
{
    document.all.btnMovePrevious.click();
}

function moveNext()
{
    document.all.btnMoveNext.click();
}

function divHeight()
{

    //    if(document.all.dlFlowList == null)
    //    {
    //        divDL.style.display = 'none';
    //        return false;
    //    }
    //    if(divDL.clientHeight < dlFlowList.clientHeight)
    //    {
    //        divDL.style.height = dlFlowList.clientHeight + 20 + 'px';
    //    }
}

function btnAddBunch_onclick()
{
    addFlowTach('Bunch', true);
}

function btnAddParataxis_onclick()
{
    addFlowTach('Parataxis', true);
}

function btnAddAdjust_onclick()
{
    addFlowTach('Adjust', true);
}

function btnAddAllot_onclick()
{
    addFlowTach('Allot', true);
}

function selectStationDept(aim)
{
    OpenSelectModelDialog("../../IDOA/CheckDoc/VWaitSaveEditLook.aspx?Aim=" + aim + "&CorpID=" + $("hidCorpID").value, 400, 400);
}

function selectStation(stationName, stationid)
{

    var rValue = openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + getObj("hidCorpID").value + '', 0, 0);
    if (!rValue) { return; }
    getObj(stationName).value = rValue.split("|")[1];
    getObj(stationid).value = rValue.split("|")[0];
}

function selectPosition(PositionName, Positionid)
{

    var rValue = openModalWindow('../../Common/Select/CheckFlow/VSelectSinglePosition.aspx', 800, 600);
    if (!rValue) { return; }
    getObj(PositionName).value = rValue.split("|")[1];
    getObj(Positionid).value = rValue.split("|")[0];
}

function selectMultiPosition(PositionName, Positionid)
{

    var rValue = openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID=' + getObj(Positionid).value + "&PostionName=" + escape(getObj(PositionName).value), 800, 600);
    if (!rValue) { return; }
    getObj(PositionName).value = rValue.split("|")[1];
    getObj(Positionid).value = rValue.split("|")[0];
}

// 验证表单
function validateForm(goDesigner)
{
    //    if(!IsAlowAddOADocFlow())
    //    {
    //        return false;
    //    }
    var txtFlowName = document.all.txtflowname;
    var txtFlowNo = document.all.txtFlowNo;

    if (txtFlowNo.value == "")
    {
        alert('流程编号不能为空。');
        txtFlowNo.focus();
        return false;
    }
    if (txtFlowName.value == "")
    {
        alert('流程名称不能为空。');
        txtFlowName.focus();
        return false;
    }

    if ($("#hidHaveAllot").length && $("#hidHaveAllot").val() == "Y" && !needAllot())
    {
        return alertMsg("该流程模块的流程不能包含成本拆分。");
    }

    $("#hidGoDesigner").val(goDesigner ? "Y" : "N");

    return true;
}

// 验证流程
function validateFlow()
{
    if (getParamValue("UseDesigner") === "1")
    {
        return true;
    }
    var rows = $("table[id$='FormArea_dgTach']>tbody>tr:gt(0)");
    if (!rows.length)
    {
        return alertMsg("请设置流程环节。");
    }
    else
    {
        var errorDay = null;
        var $txtCheckDays = rows.find("input[id='txtCheckDays']").each(function ()
        {
            if (parseInt(this.value, 10) <= 0)
            {
                errorDay = this;
                return false;
            }
        });

        if (errorDay)
        {
            return alertMsg("正常审批天数为不能小于1的正整数。", errorDay);
        }

        var $txtAlertDays = rows.find("input[id='txtAlertDays']").each(function ()
        {
            if (parseInt(this.value, 10) < 0)
            {
                errorDay = this;
                return false;
            }
        });

        if (errorDay)
        {
            return alertMsg("警告天数为非负数。", errorDay);
        }

        if (rows.length == rows.filter("[fo=Adjust]").length)
        {
            return alertMsg("流程不能只包含起草人调整。");
        }
        else if (rows.length == rows.filter("[fo=Allot]").length)
        {
            return alertMsg("流程不能只包含成本拆分。");
        }
        else if (rows.length == rows.filter("[fo=Adjust],[fo=Allot]").length)
        {
            return alertMsg("流程不能只包含起草人调整或成本拆分。");
        }
        else if (!needAllot() && rows.filter("[fo=Allot]").length)
        {
            return alertMsg("该流程模块的流程不能包含成本拆分。");
        }

    }
    return true;
}

// 提交前保存信息
function saveFormInfo()
{
    $('#hidRight').val($("input[name='right'][checked=true]").val());
    $('#hidShowModelFile').val($("input[name='ShowModelFile'][checked=true]").val());
    $('#hidFlowType').val($('#ddlFlowType').val());

    //设置了监控信息启用
    if ($("#rdlIsUseList").find(":radio:checked").val() == "Y")
    {
        var $chk = $("#tbControlSetting").find(":checkbox:checked");
        if ($chk.length == 0)
        {
            return alertMsg("请选择启用监控方式！");
        }

        var settingInfo = { "ControlSetting": [] };
        var isValidate = true;
        $chk.each(function ()
        {
            var $input = $(this).closest("tr").find("input");
            if ($input[1].value == "" || $input[2].value == "")
            {
                isValidate = false;
                return false;
            }

            settingInfo.ControlSetting.push({
                CTID: this.value,
                OperStationIDs: $input[1].value,
                ReaderStationIDs: $input[2].value
            });
        });

        if (!isValidate)
        {
            return alertMsg("监控人和查阅人不能为空！");
        }
        else
        {
            if (settingInfo.ControlSetting.length > 0)
            {
                $("#hidContSettingInfo")[0].value = $.jsonToString(settingInfo);
            }
        }
    }
    return true;
}

function allowRight()
{
    var right = $('#rblAllowType input[checked]').val();

    if (right == '2')
    {
        $('#trrightaccount').show();
        $('#trrightdept').show();
        $('#trrightPostion').show();

    }
    else
    {
        $('#trrightaccount').hide();
        $('#trrightdept').hide();
        $('#trrightPostion').hide();
    }
}

function setDesc(areaName)
{
    $('#' + areaName + '_desc').val('');
    if (areaName == 'areaRight')
    {
        if ($('#rblAllowType input[checked]').val() == "2" && $('#' + areaName).val() == "0")
        {
            var Content = '';
            if ($('#txtRightStation').val() != '')
            {
                Content += '授权岗位：' + $('#txtRightStation').val() + "   ";
            }
            if ($('#txtRightDept').val() != '')
            {
                Content += "授权部门：" + $('#txtRightDept').val() + "    ";
            }
            if ($('#txtRightPostion').val() != '')
            {
                Content += "授权职务：" + $('#txtRightPostion').val();
            }
            $('#' + areaName + '_desc').val(Content);
        }

    }
    if (areaName == 'areaRead')
    {
        if ($('#' + areaName).val() == "0")
        {
            var ReadContent = '';
            if ($('#txtLookStation').val() != '')
            {
                ReadContent += '送阅岗位：' + $('#txtLookStation').val();
            }
            if ($('#txtLookDept').val() != '')
            {
                ReadContent += "    送阅部门：" + $('#txtLookDept').val();
            }
            $('#' + areaName + '_desc').val(ReadContent);
        }
    }
}


/**************************  更多操作点击事件相关配置 ***********************************/
if (typeof clickMenuEventHandlers == 'undefined')
{
    var clickMenuEventHandlers = {};
}
mergeJsonData(clickMenuEventHandlers, {
    "Add": function()
    {
        addReader();
    },
    "Setting": function()
    {
        btnUserTable_Click();
    },
    "Edit": function()
    {
        btnTachCondition_Click();
    },
    "Export": function()
    {
        window.frames('Main').ajaxExport("VFlowMain.aspx", "jqGrid1");
//            window.frames('Main').document.getElementById('btnExport').click();
    },
    "Attention": function()
    {
        btnShowFlow_Click();
    },
    "Move": function()
    {
        btnMoveFlow_Click();
    },
    "Save": function()
    {
        btnSetSaveTach_Click();
    },
    "EnableAttachmentEdit": function()
    {
        settingFlowEditAttachAuthorize(true);
    },
    "DisableAttachmentEdit": function()
    {
        settingFlowEditAttachAuthorize(false);
    },
    "AttachmentEditAuthorize": function()
    {
        attachmentEditAuthorize();
    },
    "Manage": function()
    {
        openSpecialFlowSetWindow();
    },
    // #region 审核人列表的增加审核人下拉按钮事件              
    "AddPersonByStation": function ()
    {
        if (btnAddPerson_onclickByStation())
        {
            btnAddPerson_Click();
        }
    },
    "AddPersonByPosition": function ()
    {
        if (btnAddPerson_onclickByPostion())
        {
            btnAddPerson_Click();
        }
    },
    "AddPersonByFixed": function ()
    {
        if (btnAddPerson_onclickByFixed())
        {
            btnAddPerson_Click();
        }
    },
    "AddPersonByDeptHeader": function ()
    {
        $('#hidAddPersonInfo').val($.jsonToString([{
            findType: "A",
            ID: ""
        }]));
        btnAddPerson_Click();
    },
    "AddPersonByChargeLeader": function ()
    {
        if (addPersonByChargeLeader())
        {
            btnAddPerson_Click();
        }
    },
    "AddPersonByHigherFunction": function ()
    {
        $('#hidAddPersonInfo').val($.jsonToString([{
            findType: "C",
            ID: ""
        }]));
        btnAddPerson_Click();
    },
    "AddPersonByCorpRole": function ()
    {
        if (addPersonByCorpRole())
        {
            btnAddPerson_Click();
        }
    },
    "AddPersonByProjectRole": function ()
    {
        if (addPersonByProjectRole())
        {
            btnAddPerson_Click();
        }
    }
    ///#endregion
}, true);

// 下拉菜单方法
function clickMenu()
{
    var key = arguments[0],
        clickEventHandler = clickMenuEventHandlers ? clickMenuEventHandlers[key] : null;

    if (typeof clickEventHandler == 'function')
    {
        clickEventHandler();
    }

    return false;
}
/************************************************************************************/

// 在环节中添加审核人点击事件
function btnAddPerson_Click()
{
    // 触发添加审批人按钮的点击事件
    $('#btnAddPerson').click();
}

// 在环节中增加岗位审核人
function btnAddPerson_onclickByStation()
{
    //防止岗位页面自动选中
    $('#hidMultiStationID').val('');
    $('#hidMultiPostionID').val('');
    $('#hidAddFixedChecker').val('');
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=MultiStation&CorpID=' + getObj("hidCorpID").value, 0, 0);
    if (vValue != "undefined" && vValue != null && vValue != '|')
    {
        $('#hidMultiStationID').val(vValue.split('|')[0]);
        return true;
    }
    else
    {
        return false;
    }
}

// 在环节中增加职务审核人
function btnAddPerson_onclickByPostion()
{
    $('#hidMultiStationID').val('');
    $('#hidMultiPostionID').val('');
    $('#hidAddFixedChecker').val('');
    var rValue = openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID=', 800, 600);
    if (rValue != "undefined" && rValue != null)
    {
        $('#hidMultiPostionID').val(rValue.split('|')[0]);
        return true;
    }
    else
    {
        return false;
    }
}

// 在环节中增加固定审核人
function btnAddPerson_onclickByFixed()
{
    var fixerName = prompt("请输入固定审批人描述（不超过8个字符）", "");
    if (fixerName != null)
    {
        if (fixerName.length > 8)
        {
            return alertMsg("描述请不要超过8个字符");
        }
        var checker = [{ ID: fixerName, findType: "F", info: "" }];
        $('#hidAddPersonInfo').val($.jsonToString(checker));
        return true;
    }
    else
    {
        return false;
    }
}

// 在环节中增加分管领导审核人
function addPersonByChargeLeader()
{
    var chargeLeaderInfo = openModalWindow('../../Common/Select/CheckFlow/VSelectRelateCheckerFrame.aspx', 0, 0);
    if (chargeLeaderInfo && chargeLeaderInfo.length)
    {
        $('#hidAddPersonInfo').val($.jsonToString(chargeLeaderInfo));
        return true;
    }
    else
    {
        return false;
    }
}

// 在环节中增加公司角色审核人
function addPersonByCorpRole()
{
    var CORP_ROLE_TYPE = "0",
        url = getRoleSelectUrl(CORP_ROLE_TYPE),
        corpRoleInfo = openModalWindow(url, 0, 0);
    if (corpRoleInfo && corpRoleInfo.length)
    {
        var roleCheckerInfo = PackageSelectedRoleInfoIntoCheckerInfo(corpRoleInfo, CORP_ROLE_TYPE);
        $('#hidAddPersonInfo').val($.jsonToString(roleCheckerInfo));
        return true;
    }
    else
    {
        return false;
    }
}

// 在环节中增加项目角色审核人
function addPersonByProjectRole()
{
    var PROJECT_ROLE_TYPE = "1",
        url = getRoleSelectUrl(PROJECT_ROLE_TYPE),
        projectRoleInfo = openModalWindow(url, 0, 0);
    if (projectRoleInfo && projectRoleInfo.length)
    {
        var roleCheckerInfo =  PackageSelectedRoleInfoIntoCheckerInfo(projectRoleInfo, PROJECT_ROLE_TYPE);
        $('#hidAddPersonInfo').val($.jsonToString(roleCheckerInfo));
        return true;
    }
    else
    {
        return false;
    }
}

/*
 * 根据角色类型获取角色选择页URL
 * 翁化青 2014-11-13
 */
function getRoleSelectUrl(roleType)
{
    return '../../Common/Select/CheckFlow/VSelectFlowRole.aspx?RoleType=' + roleType + '&IsMulti=Y';
}

/*
 * 将选择到的角色信息集合包装成审核人信息集合
 * 翁化青 2014-11-13
 * @param rolesInfo json 选择的角色信息json数组
 * @param roleType string 角色类型，值为 0或1
 */
function PackageSelectedRoleInfoIntoCheckerInfo(rolesInfo, roleType)
{
    var roleCheckerInfo = [],
        // 角色类型为0时是公司角色，对应findType为D， 角色类型为1时是项目角色，对应findType为E
        findType = roleType == "0" ? "D" : "E";
    for (var i = 0, count = rolesInfo.length; i < count; i++) {
        var tempRole = rolesInfo[i];
        roleCheckerInfo.push({
            ID: tempRole.FRID,
            findType: findType,
            info: $.jsonToString({ isCreatorSelect: tempRole.isCreatorSelect })
        });
    }
    return roleCheckerInfo;
}


function btnUserTable_Click()
{
    var isDocs = window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'IsDoc');
    if (isDocs.length > 1)
    {
        return alertMsg("您一次只能操作一条记录。")
    }
    if (isDocs[0] == 'N')
    {
        alert('只有公文模块允许挂接表单');
        return false;
    }
    openModifyWindow("VFlowUserFormList.aspx?FlowName=" + escape(stripHtml(window.frames("Main").getJQGridSelectedRowsData("jqGrid1", true, 'FlowName'))), 0, 0, "jqGrid1", "Main");
    // openModifyWindow("../CustomForm/VHangForm.aspx", 0, 0, "jqGrid1","Main");
}

function RenderLink(cellvalue, options, rowobject)
{
    if (rowobject[8] != "" && rowobject[8] != null)
    {
        return "<a  href='#ShowForm' onclick=\"showForm('" + rowobject[8] + "')\">" + cellvalue + "</a>";
    }
    else
    {
        return "<div  style='width:100%'>无<div>";
    }
}
function showFlow(cellvalue, options, rowobject)
{
    return "<a  href='#ShowForm' onclick=\"openWindow('VFlowBrowse.aspx?ID=" + options.rowId + "',0,0)\">" + cellvalue + "</a>";
}

function getEditAttachmentText(cellvalue, options, rowobject)
{
    var text = "";

    switch (cellvalue.toLocaleLowerCase())
    {
        case "true":
            text = "已授权";
            break;
        case "false":
            text = "未授权";
            break;
        default:
            text = "未授权";
            break;
    }

    return text;
}

// 设置
function showSet(cellvalue, options, rowobject)
{
    var flowId = options.rowId;
    return ($("#hidUseDesigner", parent.document).val() === "Y" ? '<a href="javascript:void(0)" onclick="javascript:openWindow(\'VFlowDesigner.aspx?FlowID=' + flowId + '\',1200,0)">设计</a>' : '')
        + ' <a href="javascript:void(0)" onclick="javascript:openWindow(\'../FlowForm/VFlowForm.aspx?FlowID=' + flowId + '\',0,0)">表单</a>';
}


function showForm(formID)
{
    openWindow("../CustomForm/VCustomFormBrowse.aspx?FormID=" + formID, 800, 600);
}

function btnTachCondition_Click()
{
    openModifyWindow("VCheckDocTachConditionList.aspx?FMID=" + window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 800, 600, "jqGrid1", "Main");
}

function btnMoveFlow_Click()
{
    var ids = window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    openWindow("VFlowMove.aspx?FlowID=" + ids.join(",") + "&CorpID=" + getObj("ddlCorp").value, 600, 400);
}

function btnSetSaveTach_Click()
{
    var ids = window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true);
    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    if (ids.length > 50)
    {
        return alertMsg("一次最多可操作50条记录。");
    }
    openWindow("VSetFlowSaveTach.aspx?FlowID=" + ids.join(","), 820, 650);
}

function btnShowFlow_Click()
{
    if (window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0] == "3F1E7A7C-995C-46F0-B3A9-70811B4D3129")//公文
    {
        openModifyWindow("VCheckDocFlowShow.aspx?FMID=" + window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 900, 0, "jqGrid1", "Main");
    }
    else
    {
        openModifyWindow("FlowShow.aspx?FMID=" + window.frames("Main").getJQGridSelectedRowsData('jqGrid1', true, 'FMID')[0], 900, 0, "jqGrid1", "Main");
    }
}

function settingFlowEditAttachAuthorize(enable)
{
    if (typeof enable != 'boolean')
    {
        return false;
    }

    var ids = window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true),
        url = getCurrentUrl();

    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }

    ajax("VFlowAttachmentEditSetting.aspx",
        {
            Action: "SaveFlowSetting", FlowIDs: ids.join(), EditAttachment: enable
        }, "json", function (data)
        {
            alert(data.Data);

            if (data.Success == "Y")
            {
                execFrameFuns("Main", function () { window.frames('Main').reloadData(); }, window);
            }
        }, true);
}

// 审核人附件编辑授权
function attachmentEditAuthorize()
{
    var ids = window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true);

    if (ids.length > 1)
    {
        return alertMsg("您一次只能操作一条记录。");
    }
    else if (ids.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    else
    {
        openWindow("VFlowAttachmentEditSetting.aspx?FlowID=" + ids[0], 900, 0, "jqGrid1", "Main");
    }
}

function RefreshFlowType(span, flowtypeID, parentFlowTypeID, outLine)
{

    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    if (span != null)
    {
        span.className = "selNode";
        window.parent["Selected"] = span.id;
    }
    getObj("hidSelID").value = flowtypeID;
    getObj("hidSelParentID").value = parentFlowTypeID;
    getObj("hidOutLine").value = outLine;
    execFrameFuns("Main", function () { window.parent.frames('Main').reloadData(); }, window.parent);
    //setTimeout("window.parent.frames('Main').reloadData()",10);
}

///改变被选中的节点样式 
function ChangeBackColor(span)
{
    var obj = document.getElementsByName("FlowTypeName");
    for (i = 0; i < obj.length; i++)
    {
        obj(i).className = 'normalNode';
    }
    span.className = "selNode";
}

function SelectFlowType(flowtypeID, flowtypeName)
{
    $('#hidFlowTypeID').val(flowtypeID);
    $('#hidFlowTypeName').val(flowtypeName);
}

function btnChoose_Click()
{
    if (getObj("hidFlowTypeID").value == "")
    {
        return alertMsg("请选择一个流程类别。");
    }
    return true;
}

function selectFlowType()
{
    var vFlowTypeID = $('#hidFlowTypeID').val();
    var vFlowTypeName = $('#hidFlowTypeName').val();

    if (vFlowTypeID == "")
    {
        return alertMsg("请选择一个流程类别。");
    }

    if (vFlowTypeName == "")
    {
        return alertMsg("请选择一个流程类别。");
    }

    window.returnValue = { FlowTypeID: vFlowTypeID, FlowTypeName: vFlowTypeName };
    window.close();
}

function btnSetectFlowType_Click()
{
    var rValue = openModalWindow('VSelectFlowType.aspx?CorpID=' + getObj("hidCorpID").value, 350, 350);
    if (!rValue)
        return;
    getObj("txtFlowType").value = rValue.FlowTypeName;
    getObj("hidFlowType").value = rValue.FlowTypeID;
}

function btnAddPostion()
{

    var rValue = openModalWindow('../../Common/Select/CheckFlow/VSelectMultiPosition.aspx?PostionID=' + $('#hidRightPostionID').val() + "&PostionName=" + escape($('#txtRightPostion').val()), 800, 600);
    if (rValue != "undefined" && rValue != null)
    {
        $('#hidRightPostionID').val(rValue.split('|')[0]);
        $('#txtRightPostion').val(rValue.split('|')[1]);
        return true;
    }
    else
    {
        return false;
    }
}

// add by zhangmq 2014-08-08
function openSpecialFlowSetWindow()
{
    var $tr = $("#jqGrid1 tr[aria-selected='true']", window.frames("Main").document);

    if ($tr.length < 1)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    else if ($tr.length > 1)
    {
        return alertMsg("您一次只能操作一条记录。");
    }

    var url = "VSpecialFlowTachSet.aspx?CorpID=" + $('#ddlCorp').val() + "&FlowID=" + window.frames("Main").getJQGridSelectedRowsID('jqGrid1', true) + "&JQID=jqGrid1";
    openWindow(url, 800, 800);
}

var selIndex = -1;
function showBrowseTab(index)
{
    if (selIndex == 2 && !jqGridIsComplete("jqGridForm"))
    {
        return alertMsg("数据未加载完毕，请稍后再试。");
    }

    selectTab(index, "BrowseInfo");

    for (var i = 0; i < 4; i++)
    {
        if (i != index)
        {
            getObj("info" + i).style.display = "none";
        }
    }

    getObj("info" + index).style.display = "";

    if (index === 1 && !getObj("info" + index).src)
    {
        getObj("info" + index).src = $("#hidUseDesigner").val() === "Y" ? "VFlowDesignerBrowse.aspx?FlowID=" + getParamValue("ID")
            : 'VFlowShowTach.aspx?CorpID=' + $("#hidCorpID").val() + '&FlowID=' + getParamValue("ID")+"&IsNew=Y";
    }
    else if (index === 2 && loadJQGrid("jqGridForm"))
    {
        refreshJQGrid("jqGridForm");
    }

    selIndex = index;
}

// 表单列
function showFormName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showForm1(\'' + options.rowId + '\')">' + cellvalue + '</a>';
}

// 查看表单
function showForm1(flowId)
{
    openWindow("../FlowForm/VFormBrowse.aspx?FormID=" + flowId, 800, 600);
}

// 表单权限列
function showOperName(cellvalue, options, rowobject)
{
    return '<a href="javascript:showFormOper(\'' + options.rowId + '\')">查看</a>';
}

// 查看表单权限
function showFormOper(formId)
{
    var flowId = getParamValue("ID");
    openWindow("../FlowForm/VFormFlowOper.aspx?From=Browse&FormID=" + formId + "&FlowID=" + flowId, 800, 500);
}


////是否允许新增公文流程（泉山湖定制最多50个公文流程）
//function IsAlowAddOADocFlow()
//{
//    //VFlow、VFlowAdd、VFlowEdit的控件ID一样
//    var sFMID = $('#ddlFlowModel').val();
//    if (sFMID == "3F1E7A7C-995C-46F0-B3A9-70811B4D3129" && $("#hidOADocFlowCount") && $("#hidOADocFlowCount").val() >= 50)
//    {
//        alertMsg("公文的流程数量已达到系统设定的最大值！");
//        return false;
//    }    
//    return true;
//}
