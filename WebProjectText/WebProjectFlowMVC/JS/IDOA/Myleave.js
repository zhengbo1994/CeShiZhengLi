// 创建人：余坤
// 时间：2019-04-01
function renderLink(cellvalue, options, rowobject) {
    var url = "'VLeaveBrowse.aspx?ID=" + rowobject[0] + "'";
    if (rowobject[1] == "未发出") {

        var url = "'VMyleaveApplicationEdit.aspx?ID=" + rowobject[0] + "&JQID=jqMyLeave'";//调用修改页
    }
    return '<div class="nowrap"><a  href="#ShowLeave" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a></div>';
}

function waitDoLink(cellvalue, options, rowobject) {
    var vState = rowobject[8];
    var vUrl = "''";
    switch (vState) {
        case "WaitCheck":
            vUrl = "'VWaitCheck.aspx?ID=" + rowobject[9] + "'";
            break;
        case "WaitCommunicate":
            vUrl = "'VWaitCommunicate.aspx?ID=" + rowobject[9] + "'";
            break;
        case "WaitDeal":
            vUrl = "'VWaitDeal.aspx?ID=" + rowobject[9] + "'";
            break;
        case "WaitAdjust":
            vUrl = "'VWaitAdjust.aspx?ID=" + rowobject[9] + "'";
            break;
        case "WaitSave":
            vUrl = "'VWaitSave.aspx?ID=" + rowobject[9] + "'";
            break;
        case "WaitLook":
            vUrl = "'VWaitLook.aspx?ID=" + rowobject[9] + "'";
            break;
    }

    return '<div class="nowrap"><a  href="#ShowLeave" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqgWaitLeave\');">' + cellvalue + '</a></div>';
}

function ddlCorp_Change(jqgid) {
    reloadData(jqgid);
}

function ddlCCState_Change(jqgid) {
    reloadData(jqgid);
}

function ddlMeDoState_Change(jqgid) {
    reloadData(jqgid);
}

function btnSearch_Click(jqgid) {
    reloadData(jqgid);
}

function btnSearchDate_Click(jqgid) {
    reloadData(jqgid);
}

function reloadData(jqgid) {
    var corpID = getObj("ddlCorp").value;
    var vKey = $("#txtKey").val();

    if (jqgid == "#jqMyLeave") {
        var ccState = getObj("ddlCCState").value;
        var meDoState = getObj("ddlMeDoState").value;
        var vStartTime = $("#txtStartTime").val();
        var vEndTime = $("#txtEndTime").val();
        var leaveType = getObj("ddlLeaveType").value;

        if (vStartTime != "" && vEndTime != "") {
            startDate1 = vStartTime.split("-");
            endDate1 = vEndTime.split("-");
            var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
            var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);

            if (date1 > date2) {
                return alertMsg("请假结束时间必须大于开始时间。", $("#txtEndTime"));
            }
        }

        $(jqgid, document).getGridParam('postData').MeDoState = meDoState;
        $(jqgid, document).getGridParam('postData').StartTime = vStartTime;
        $(jqgid, document).getGridParam('postData').EndTime = vEndTime;
        $(jqgid, document).getGridParam('postData').CCState = ccState;
        $(jqgid, document).getGridParam('postData').LeaveType = leaveType;
    }
    else if (jqgid == "#jqgWaitLeave") {
        var ccState = getObj("ddlCCState").value;

        $(jqgid, document).getGridParam('postData').CCState = ccState;
    }

    $(jqgid, document).getGridParam('postData').CorpID = corpID;
    $(jqgid, document).getGridParam('postData').KeyValue = vKey;

    var reg = new RegExp("#", "g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg, ""));
}

function btnLookList_Click() {
    openAddWindow("VWaitLookList.aspx", 0, 0, "jqgWaitLeave");
}

function addMyLeave() {
    openAddWindow("VMyleaveApplicationAdd.aspx", -1, -1, "jqMyLeave");
}

function editMyLeave() {
    openModifyWindow("VMyLeaveEdit.aspx", 0, 0, "jqMyLeave")
}

function delMyLeave() {
    openDeleteWindow("MyLeave", 0, "jqMyLeave");
}
function setPageBtnEnabled(bool) {
    setBtnEnabled(getObj("btnNext"), bool);
    setBtnEnabled(getObj("btnSaveNotSumbit"), bool);
    setBtnEnabled(getObj("btnSaveOpen"), bool);
    setBtnEnabled(getObj("btnSaveClose"), bool);
    //setBtnEnabled(getObj("btnSaveClose"), bool);
    //setBtnEnabled(getObj("btnThirdCheck"), bool);  
}
function validateSize() {
    setPageBtnEnabled(false);
    if (getObj("txtTitle").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("申请标题不能为空。", getObj("txtTitle"));
    }
    if (getObj("ddlLeaveType").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("请选择请假类型。", getObj("ddlLeaveType"));
    }
    if (getObj("ddlStation").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("请选择申请人岗位。", getObj("ddlStation"));
    }
    if (getObj("hidEmployeeID").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("请选择请假人员。", getObj("btnSelectEmployee"));
    }
    if (parseFloat(getObj("txtLeaveDays").value) <= 0) {
        setPageBtnEnabled(true);
        return alertMsg("请假天数必须大于0。", getObj("txtLeaveDays"));
    }
    if (getObj("txtStartDate").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("开始时间不能为空。", getObj("txtStartDate"));
    }
    if (getObj("txtEndDate").value == "") {
        setPageBtnEnabled(true);
        return alertMsg("结束时间不能为空。", getObj("txtEndDate"));
    }

    var startDate = getObj("txtStartDate").value.split('-');
    var endDate = getObj("txtEndDate").value.split('-');
    var date1 = new Date(startDate[0], startDate[1] - 1, startDate[2], getObj("txtStartDate_h").value, getObj("txtStartDate_m").value, 0);
    var date2 = new Date(endDate[0], endDate[1] - 1, endDate[2], getObj("txtEndDate_h").value, getObj("txtEndDate_m").value, 0);

    if (date1 >= date2) {
        setPageBtnEnabled(true);
        return alertMsg("请假结束时间必须大于开始时间。", getObj("txtEndDate"));
    }

    //提交确认框
    //add by陈钊晔 on 2013-09-26
    if ($('#txtLeaveDays').val() > countDays() + 1) {
        //return alertMsg("输入的请假天数已经超过实际的天数", getObj("txtEndDate"));

        //先把按钮可点击属性设置回Ture
        setPageBtnEnabled(true);
        if (confirm("输入的请假天数已经超过实际的天数,确定提交？")) {
            return true;
        }
        return;  //点击取消则中断提交到下一步，返回修改。
    }


    //if (getObj("txtRemark").value == "")
    //{
    //    return alertMsg("请假原因不能为空。", getObj("txtRemark"));
    //}
    if ($("#hidStep").val() == "1" && (!formValidate() || !flowValidate())) {
        setPageBtnEnabled(true);
        return false;
    }

    if (!saveDocModel()) {
        setPageBtnEnabled(true);
        return alertMsg("正文文档保存失败。", getObj("chkUseDocModel"));
    }
    setPageBtnEnabled(false);
    return true;
}

function checkCustomForm() {
    // 获取自定义表单数据
    var vCustomFormID = "";
    var vCustomFormValue = "";

    var vCheckID = "";
    var vCheckValue = "";

    setBtnEnabled($("#btnSaveOpen,#btnSaveClose"), false);

    if (getObj("tableContent") != null) {
        $("#tableContent select").each(function () {
            var vID = $(this).attr('id');
            var vValue = $(this).val();

            vCustomFormID += "|" + vID;
            vCustomFormValue += "|" + vValue;
        });

        $('#tableContent input').each(function () {
            if ($(this).attr('type') == "text") {
                var vID = $(this).attr('id');
                var vValue = $(this).val();

                vCustomFormID += "|" + vID;
                vCustomFormValue += "|" + vValue;
            }
            else if ($(this).attr('type') == "checkbox") {
                if ($(this).attr('checked')) {
                    var vID = $(this).attr('id');
                    var vValue = $(this).val();

                    // 记录的是FidleID
                    vCheckID += "|" + vID;
                    vCheckValue += "|" + vValue;
                }
            }
        });

        if (vCustomFormID != "") {
            vCustomFormID = vCustomFormID.substr(1);
            vCustomFormValue = vCustomFormValue.substr(1);
        }

        if (vCheckID != "") {
            vCheckID = vCheckID.substr(1);
            vCheckValue = vCheckValue.substr(1);
        }
    }

    if (!formValidate() || !flowValidate())//自定义表单和流程校验
    {
        setBtnEnabled($("#btnSaveOpen,#btnSaveClose"), true);
        return false;
    }
    /*
    getObj("hidCustomFormID").value = vCustomFormID;
    getObj("hidCustomFormValue").value = vCustomFormValue;
    
    getObj("hidCustomFormCheckID").value = vCheckID;
    getObj("hidCustomFormCheckValue").value = vCheckValue;
    */

    return true;
}

function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");

    // 起草与浏览
    if (getObj("chkUseDocModel") != null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1") {
        setUseDocModel(getObj("chkUseDocModel"));
    }
    else if (getObj("chkUseDocModel") == null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1") {
        setDisplayDocModel();
    }
}

function setDesc(areaName) {
    if (getObj(areaName).value == "0") {
        getObj(areaName + '_desc').value = "";

        if (areaName == "areaLookInfo") {
            if (getObj("txtLookStationNames") != null && getObj("txtLookStationNames").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅岗位(系统)：" + getObj("txtLookStationNames").value
            }
            //补充txtSysLookStationNames 用于adjust控件时生效 陈毓孟 2017-05-12
            if (getObj("txtSysLookStationNames") != null && getObj("txtSysLookStationNames").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅岗位(系统)：" + getObj("txtSysLookStationNames").value
            }

            if (getObj("txtLookDeptNames") != null && getObj("txtLookDeptNames").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门(系统)：" + getObj("txtLookDeptNames").value
            }
            //补充txtSysLookDeptNames 用于adjust控件时生效 陈毓孟 2017-05-12
            if (getObj("txtSysLookDeptNames") != null && getObj("txtSysLookDeptNames").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门(系统)：" + getObj("txtSysLookDeptNames").value
            }

            if (getObj("txtLookStation").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅岗位：" + getObj("txtLookStation").value
            }

            if (getObj("txtLookDept").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门：" + getObj("txtLookDept").value
            }
        }
        else if (areaName == "areaFileInfo") {
            for (var i = 0; i < getObj("accessaryFile").rows.length; i++) {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }

                if (getObj("accessaryFile").rows[i].filetitle != undefined) {
                    getObj(areaName + '_desc').value += getObj("accessaryFile").rows[i].filetitle;
                }
            }
        }
    }
    else {
        getObj(areaName + '_desc').value = "";
    }
}

function ddlStation_Change(ddl) {
    if (ddl.value == "") {
        getObj("hidStationID").value = "";
        getObj("hidCorpID").value = "";
        getObj("hidPositionLevel").value = "";
    }
    else {
        getObj("hidStationID").value = ddl.value.split('|')[0];
        getObj("hidCorpID").value = ddl.value.split('|')[1];
        getObj("hidPositionLevel").value = ddl.value.split('|')[2];
    }
}

function btnSelectEmployee_Click(btn) {
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?From=Leave&CorpID=' + getObj("hidCorpID").value, 0, 0);
    if (vValue != "undefined" && vValue != null) {
        getObj("hidEmployeeID").value = vValue.split('|')[0];
        getObj("txtEmployeeName").value = vValue.split('|')[1];
        getObj("hidRStationID").value = vValue.split('|')[3];

        //补选或者重新选择 职员后，也应该再刷新一下请假日期天数的计算与显示。
        //add by陈钊晔  on 2013-09-26
        getDays();

        //异步设置默认的开始和结束时间（小时与分钟数）  add by chenzy on 2014-05-27
        ajax(getCurrentUrl(), { "EmployeeID": vValue.split('|')[0] }, "json",
            function (data) {
                if (data.Success === 'Y') {
                    var times = data.Data.split(',');
                    if (times.length > 1) {
                        $("#txtStartDate_h").val(times[0].split(':')[0]);  //开始时间的小时数
                        $("#txtStartDate_m").val(times[0].split(':')[1]);  //开始时间的分钟数

                        $("#txtEndDate_h").val(times[1].split(':')[0]);
                        $("#txtEndDate_m").val(times[1].split(':')[1]);
                    }
                }
                else {
                    $("#txtStartDate_h").val('08');
                    $("#txtStartDate_m").val('00');

                    $("#txtEndDate_h").val('17');
                    $("#txtEndDate_m").val('00');
                }
            });

    }
}

function btnSelectLookStation_Click() {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click() {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}

function showBrowseTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 2; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";
}

function showCheckTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 2; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";

    // 在回发后若要保持原来选中项，同理。（需自行处理）            
    setVisible('areaBasicInfo', trBasicInfo);
    setVisible('areaOtherInfo', trOtherInfo);
    setVisible('areaFileInfo', trFileInfo);
    setVisible('areaOfficeDoc', trOfficeDoc);
    setVisible('areaLookInfo', trLookInfo);

    if (index == 0) {
        setDesc('areaFileInfo');
        setDesc('areaLookInfo');
    }
}

function validateCheck() {
    if (getObj('tdRequiredlblCheckTitle') && getObj('tdRequiredlblCheckTitle').style.display != "none" && trim(getObj("txtCheckDescription").value) == "") {
        return alertMsg("请填写审核/处理意见。");
    }
    setBtnEnabled(getObj("btnSubmit"), false);

    // 获取自定义表单数据
    var vCustomFormID = "";
    var vCustomFormValue = "";

    var vCheckID = "";
    var vCheckValue = "";

    if (getObj("tableContent") != null) {
        $("#tableContent select").each(function () {
            var vID = $(this).attr('id');
            var vValue = $(this).val();

            vCustomFormID += "|" + vID;
            vCustomFormValue += "|" + vValue;
        });

        $('#tableContent input').each(function () {
            // 文本框，非只读才记录
            if ($(this).attr('type') == "text" && !$(this).attr('readonly')) {
                var vID = $(this).attr('id');
                var vValue = $(this).val();

                vCustomFormID += "|" + vID;
                vCustomFormValue += "|" + vValue;
            }
            else if ($(this).attr('type') == "checkbox") {
                if ($(this).attr('checked')) {
                    var vID = $(this).attr('id');
                    var vValue = $(this).val();

                    // 记录的是FidleID
                    vCheckID += "|" + vID;
                    vCheckValue += "|" + vValue;
                }
            }
        });

        if (vCustomFormID != "") {
            vCustomFormID = vCustomFormID.substr(1);
            vCustomFormValue = vCustomFormValue.substr(1);
        }

        if (vCheckID != "") {
            vCheckID = vCheckID.substr(1);
            vCheckValue = vCheckValue.substr(1);
        }
    }
    if ((!formValidate()))//自定义表单校验
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }

    getObj("hidCustomFormID").value = vCustomFormID;
    getObj("hidCustomFormValue").value = vCustomFormValue;

    getObj("hidCustomFormCheckID").value = vCheckID;
    getObj("hidCustomFormCheckValue").value = vCheckValue;

    var left = (screen.width - 350) / 2;
    var top = (screen.height - 170) / 2;
    var result = openModalWindow('../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
    if (result == "Cancel" || result == "undefined" || result == null || result == "No") {
        if (result == "No") {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }

    if (!saveDocModel()) {
        setBtnEnabled(getObj("btnSubmit"), true);
        return false;
    }
    return true;
}

function validateAdjust() {
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);

    if (getObj("ddlLeaveType").value == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return alertMsg("请选择请假类型。", getObj("ddlLeaveType"));
    }
    if (parseFloat(getObj("txtLeaveDays").value) <= 0) {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return alertMsg("请假天数必须大于0。", getObj("txtLeaveDays"));
    }
    if (getObj("txtStartTime").value == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return alertMsg("开始时间不能为空。", getObj("txtStartTime"));
    }
    if (getObj("txtStartTime").value == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return alertMsg("结束时间不能为空。", getObj("txtStartTime"));
    }

    var startDate = getObj("txtStartTime").value.split('-');
    var endDate = getObj("txtEndTime").value.split('-');
    var date1 = new Date(startDate[0], startDate[1] - 1, startDate[2], getObj("txtStartTime_h").value, getObj("txtStartTime_m").value, 0);
    var date2 = new Date(endDate[0], endDate[1] - 1, endDate[2], getObj("txtEndTime_h").value, getObj("txtEndTime_m").value, 0);

    if (date1 >= date2) {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return alertMsg("出差结束时间必须大于开始时间。", getObj("txtEndTime"));
    }

    //提交确认框
    //add by chenzy on 2013-10-09
    if ($('#txtLeaveDays').val() > countDaysTime() + 1) {
        //return alertMsg("输入的请假天数已经超过实际的天数", getObj("txtEndDate"));

        //先把按钮可点击属性设置回Ture
        setPageBtnEnabled(true);
        if (confirm("输入的请假天数已经超过实际的天数,确定提交？")) {
            return true;
        }
        return;  //点击取消则中断提交到下一步，返回修改。
    }


    if ((!formValidate()))//自定义表单校验
    {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    //submitContent();

    var result = openModalWindow('../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
    if (result == "Cancel" || result == "undefined" || result == null || result == "No") {
        if (result == "No") {
            alert("密码不正确。");
        }
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    if (!saveDocModel()) {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnBlankOut"), true);
        return false;
    }

    return true;
}

function validateLook() {
    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnSuggest"), false);

    var vSuggest = getObj("txtLookRemark").value;

    if (vSuggest == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        setBtnEnabled(getObj("btnSuggest"), true);
        return alertMsg("审阅意见不能为空。", getObj("txtLookRemark"));
    }

    return true;
}

function ddlLeaveType_Change() {
    saveDocModel();
}

function btnSelectEditLookStation_Click() {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidEditLookStationID").value = vValue.split('|')[0];
        getObj("txtEditLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectEditLookDept_Click() {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidEditLookDeptID").value = vValue.split('|')[0];
        getObj("txtEditLookDept").value = vValue.split('|')[1];
    }
}

function validateEdit() {
    setBtnEnabled(getObj("btnSubmit"), false);

    var vTitle = getObj("txtEditTitle").value;
    var vNo = getObj("txtEditNo").value;

    if (vTitle == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        return alertMsg("申请标题不能为空。", getObj("txtEditTitle"));
    }

    if (vNo == "") {
        setBtnEnabled(getObj("btnSubmit"), true);
        return alertMsg("申请编号不能为空。", getObj("txtEditNo"));
    }
    //注释此地方，管理页修改 无需校验表单， 陈毓孟 2015-10-09
    //if ((!formValidate() || !flowValidate()))//自定义表单校验
    //{
    //    setBtnEnabled(getObj("btnSubmit"), true);
    //    return false;
    //}

    return true;
}

function validateLookList() {
    var vReqID = getJQGridSelectedRowsData('jqgWaitLookList', true, 'KeyID');
    if (vReqID.length == 0) {
        return alertMsg("请选择申请。", getObj("btnSubmit"));
    }
    getObj("hidLookList").value = vReqID;
    return true;
}

function deleteMyLeave() {
    openDeleteWindow("MyLeave", 1, "jqMyLeave");
}

function revokeMyLeave() {
    openRevokeWindow("MyLeave", "jqMyLeave");
}

//获取工作天数 根据日历来获取
function getDays() {
    if ($("#txtStartDate").val() != "" && $("#txtEndDate").val() != "") {
        station = getObj('hidStationID').value;
        startDate = getObj('txtStartDate').value;
        endDate = getObj('txtEndDate').value;
        ajaxRequest('FillData.ashx', { action: 'GetWorkDaysByStationID', StationID: station, StartDate: startDate, EndDate: endDate }, 'json', function (data) {
            if (data) {

                $('#txtLeaveDays').val(data.WorkDays);
            }
            else {
                $('#txtLeaveDays').val('0');
            }
        });
    }
}

//计算实际天数(忽略个人工作放假日历) 
//add by陈钊晔  on 2013-09-26
function countDays() {
    var arrDate, objDate1, objDate2;
    objDate1 = document.getElementById("txtStartDate").value;  //$("#txtStartDate").val()
    objDate2 = document.getElementById("txtEndDate").value;

    arrDate = objDate1.split("-");
    var startDate = new Date(arrDate[0], parseInt(arrDate[1], 10) - 1, arrDate[2]);
    //alert(startDate);

    arrDate = objDate2.split("-");
    var endDate = new Date(arrDate[0], parseInt(arrDate[1], 10) - 1, arrDate[2]);
    //alert(endDate);

    var Days = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24);
    return Days;
}



//检验输入的请假天数是否已经超过实际天数，若超过则提示用户人为确定。
//add by陈钊晔  on 2013-09-26
function checkDays() {
    var factDays = countDays();
    if ($('#txtLeaveDays').val() > factDays + 1) {
        alert("输入的请假天数已经超过实际的天数，请根据自己的实际情况填写");
    }
}


//add by chenzy  on 2013-10-09
//获取工作天数 根据日历来获取
function getDaysTime() {
    if ($("#txtStartTime").val() != "" && $("#txtEndTime").val() != "") {
        station = getObj('hidStationID').value;
        startDate = getObj('txtStartTime').value;
        endDate = getObj('txtEndTime').value;
        ajaxRequest('FillData.ashx', { action: 'GetWorkDaysByStationID', StationID: station, StartDate: startDate, EndDate: endDate }, 'json', function (data) {
            if (data) {

                $('#txtLeaveDays').val(data.WorkDays);
            }
            else {
                $('#txtLeaveDays').val('0');
            }
        });
    }
}

//计算实际天数(忽略个人工作放假日历) 
//add by chenzy  on 2013-10-09
function countDaysTime() {
    var arrDate, objDate1, objDate2;
    objDate1 = document.getElementById("txtStartTime").value;  //$("#txtStartDate").val()
    objDate2 = document.getElementById("txtEndTime").value;

    arrDate = objDate1.split("-");
    var startDate = new Date(arrDate[0], parseInt(arrDate[1], 10) - 1, arrDate[2]);
    //alert(startDate);

    arrDate = objDate2.split("-");
    var endDate = new Date(arrDate[0], parseInt(arrDate[1], 10) - 1, arrDate[2]);
    //alert(endDate);

    var Days = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24);
    return Days;
}



//检验输入的请假天数是否已经超过实际天数，若超过则提示用户人为确定。
//add by chenzy on 2013-10-09
function checkDaysTime() {
    var factDays = countDaysTime();
    if ($('#txtLeaveDays').val() > factDays + 1) {
        alert("输入的请假天数已经超过实际的天数，请根据自己的实际情况填写");
    }
}