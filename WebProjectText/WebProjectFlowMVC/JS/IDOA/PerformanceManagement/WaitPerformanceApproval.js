// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

function btnLookList_Click() {
    openAddWindow("VWaitLookList.aspx", 800, 600, "jqPerformanceApproval");
}
function btnSaveList_Click() {
    openAddWindow("VWaitSaveList.aspx", 800, 600, "jqPerformanceApproval");
}


function waitDoLink(cellvalue, options, rowobject) {
    var strCCID = rowobject[0];
    var strID = rowobject[9];
    var vState = rowobject[8];
    var vUrl = "''";

    switch (vState) {
        case "WaitCheck":
            vUrl = "'VWaitCheck.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
        case "WaitCommunicate":
            vUrl = "'VWaitCommunicate.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
        case "WaitDeal":
            vUrl = "'VWaitDeal.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
        case "WaitAdjust":
            vUrl = "'VWaitAdjust.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
        case "WaitSave":
            vUrl = "'VWaitSave.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
        case "WaitLook":
            vUrl = "'VWaitLook.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
            break;
    }
    return '<div class="nowrap"><a  href="#Show" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqPerformanceApproval\');">' + cellvalue + '</a></div>';
}


function waitSave(cellvalue, options, rowobject) {
    var strCCID = rowobject[0];
    var strID = rowobject[10];

    vUrl = "'VWaitSave.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
    return '<div class="nowrap"><a  href="#Show" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqgWaitSaveList\');">' + cellvalue + '</a></div>';
}

function waitLook(cellvalue, options, rowobject) {
    var strCCID = rowobject[0];
    var strID = rowobject[9];

    vUrl = "'VWaitLook.aspx?CCID=" + strCCID + "&ID=" + strID + "'";
    return '<div class="nowrap"><a  href="#Show" onclick="javascript:openAddWindow(' + vUrl + ', 0, 0, \'jqgWaitSaveList\');">' + cellvalue + '</a></div>';
}

function reloadData(jqGridID) {
    if (_PageMaster.isSearching) {
        return false;
    }
    else {
        _PageMaster.isSearching = true;
    }

    jqGridID = typeof jqGridID == 'undefined' ? 'jqPerformanceApproval' : jqGridID;

    var jqGrid = $('#' + jqGridID, document);

    var CorpID = $("#ddlCorp").val();
    var CCState = $("#ddlCCState").val();
    var vKey = $("#txtKey").val();

    jqGrid.getGridParam('postData').CorpID = CorpID;
    jqGrid.getGridParam('postData').CCState = CCState;
    jqGrid.getGridParam('postData').SearchText = vKey;

    refreshJQGrid(jqGridID);
}
function customGridComplete() {
    _PageMaster.isSearching = false;
}


function showCheckTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i <= 2; i++) {
        if (getObj("div" + i)) {
            getObj("div" + i).style.display = "none";
        }
    }

    getObj("div" + index).style.display = "block";

    setVisible('areaFileInfo', trFileInfo);
    setVisible('areaOfficeDoc', trOfficeDoc);
    setVisible('areaLookInfo', trLookInfo);

    if (index == 0) {
        setDesc('areaFileInfo');
        setDesc('areaLookInfo');
    }
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

            if (getObj("txtLookDeptNames") != null && getObj("txtLookDeptNames").value != "") {
                if (getObj(areaName + '_desc').value != "") {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门(系统)：" + getObj("txtLookDeptNames").value
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



function validateCheck()
{
    if (getObj('tdRequiredlblCheckTitle') && getObj('tdRequiredlblCheckTitle').style.display != "none" && trim(getObj("txtCheckDescription").value) == "")
    {
        return alertMsg("请填写审核/处理意见。");
    }
    setBtnEnabled(getObj("btnSubmit"), false);

    if ((!formValidate())) {
        setBtnEnabled(getObj("btnSubmit"), false);
        return false;
    }


    var left = (screen.width - 350) / 2;
    var top = (screen.height - 170) / 2;
    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
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

function showBrowseTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 3; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";
}


// 调整验证
function validateAdjust() {
    if (getObj("txtPABName").value == "") {
        return alertMsg("考核标题不能为空。", getObj("txtPABName"));
    }

    var result = openModalWindow('../../../Common/Select/Confirm/VCheckConfirm.aspx', 350, 170);
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

    setBtnEnabled(getObj("btnSubmit"), false);
    setBtnEnabled(getObj("btnBlankOut"), false);

    return true;
}


function btnSelectLookStation_Click() {
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim=LookStation&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click() {
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiDept.aspx?Aim=LookDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null) {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}


// 批量归档验证
function validateSaveList() {
    setBtnEnabled('btnSubmit', false);
    var vKeyID = getJQGridSelectedRowsData('jqgWaitSaveList', true,'KeyID');
    var vCCID = getJQGridSelectedRowsData('jqgWaitSaveList', true, 'CCID');
    var vFlowID = getJQGridSelectedRowsData('jqgWaitSaveList', true, 'FlowID');
    var vCorpIDs = getJQGridSelectedRowsData('jqgWaitSaveList', true, 'CorpID');

    if (vCCID.length == 0) {
        setBtnEnabled('btnSubmit', true);
        return alertMsg("请选择申请。", getObj("btnSubmit"));

    }
    getObj("hidSaveList").value = vKeyID;
    getObj("hidSaveCCID").value = vCCID;
    getObj("hidSaveFlowID").value = vFlowID;
    getObj("hidCorpID").value = vCorpIDs;
    return true;
}


// 批量阅读验证
function validateLookList() {
    var vReqID = getJQGridSelectedRowsData('jqgWaitLookList', true, 'KeyID');
    if (vReqID.length == 0) {
        return alertMsg("请选择申请。", getObj("btnSubmit"));
    }
    getObj("hidLookList").value = vReqID;
    return true;
}


function showScope(id)
{
    var url = "../PerformancePlan/VPerformancePlanScopeBrowse.aspx?ID=" + id + "";
    openWindow(url, 800, 600);
}
