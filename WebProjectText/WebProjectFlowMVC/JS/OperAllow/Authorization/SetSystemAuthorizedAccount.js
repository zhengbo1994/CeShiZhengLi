function ddlState_Change() {
    var state = $('#ddlState').val();
    if (state === "Y") {//有岗位情况下，有公司架构
        $('#trLeft').show();
        $('#tdMultiStation').show();
        $('#trIncludeChild').show();
        $('#tdAccountMain').attr("style", "width:52%");
        $('#tdResultBox').attr("style", "width:30%");
    }
    else {//不考虑公司架构情况
        $('#trLeft').hide();
        $('#tdMultiStation').hide();
        $('#trIncludeChild').hide();
        $('#tdAccountMain').attr("style", "width:62%");
        $('#tdResultBox').attr("style", "width:20%");
    }
    reloadData();
}

function ddlMutiStation_Change() {
    reloadData();
}

function btnSearch_Click() {
    reloadData();
}

function chkIncludeChild_Change() {
    reloadData();
}

function reloadData() {
    var stationState = $('#ddlState').val();
    var multiStationFlag = $('#ddlMutiStation').val();
    var includeChildFlag = $('#chkIncludeChild').attr("checked") ? "Y" : "N";
    var struID = window.frames("frmLeft").$('#hidStruID').val();
    var keyWord = $("#txtKey").val();
    execFrameFuns("frmMain",
        function () {
            window.frames("frmMain").reloadAccountData(
                stationState,
                multiStationFlag,
                includeChildFlag,
                struID,
                keyWord);
        },
        window);
}
//添加选中人员到被选择人员列表
function btnAdd_Click() {
    var lstEmployees = $("#lstEmployees")[0];

    var vEmployeeID = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'AccountID');
    var vEmployeeName = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'EmployeeName');
    var vEmployeeStation = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'StationName');

    if (vEmployeeID.length <= 0) {
        return alertMsg("请选择人员。", getObj("btnAdd"));
    }

    $.each(vEmployeeID, function (i, id) {
        if (id.length <= 0) {
            return;
        }
        var employeeName = $.jgrid.stripHtml(vEmployeeName[i]);
        var stationName = $.jgrid.stripHtml(vEmployeeStation[i]);

        if ($('#lstEmployees option[value=\'' + id + '\']').length <= 0) {
            var opt = document.createElement("option");
            opt.value = id;
            opt.type = 'E';
            if (stationName === '') {
                opt.text = employeeName;
            }
            else {
                opt.text = employeeName + "(" + stationName + ")";
            }
            lstEmployees.add(opt, lstEmployees.length);
        }
    });
}

//从被选人员中移除选中项
function btnDel_Click() {
    var lstEmployees = $("#lstEmployees");
    $('option:selected', lstEmployees).each(function (i) {
        lstEmployees.get(0).removeChild(this);
    });
}

//添加所有人员
function btnAddAll_Click() {
    var lstEmployees = $("#lstEmployees")[0];

    var vEmployeeID = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'AccountID');
    var vEmployeeName = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'EmployeeName');
    var vEmployeeStation = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'StationName');

    if (vEmployeeID.length <= 0) {
        return;
    }
    $.each(vEmployeeID, function (i, id) {
        if (id.length <= 0) {
            return;
        }
        var employeeName = $.jgrid.stripHtml(vEmployeeName[i]);
        var stationName = $.jgrid.stripHtml(vEmployeeStation[i]);

        if ($('#lstEmployees option[value=\'' + id + '\']').length <= 0) {
            var opt = document.createElement("option");
            opt.value = id;
            opt.type = 'E';
            if (stationName === '') {
                opt.text = employeeName;
            }
            else {
                opt.text = employeeName + "(" + stationName + ")";
            }
            lstEmployees.add(opt, lstEmployees.length);
        }
    });
}

function lstEmployeesDB_Clisk() {
    var index

    if (getObj("lstEmployees").length == 0) return (false);
    index = getObj("lstEmployees").selectedIndex
    if (index < 0) return (false);
    getObj("lstEmployees").remove(index)
}

function move(to) {
    var list = getObj("lstEmployees");
    var total = list.options.length - 1;
    var index = getObj("lstEmployees").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;

    //临时保存选项的值
    var text = list.options[index].text;
    var type = list.options[index].type;
    var value = list.options[index].value;

    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].type = list.options[index + to].type
    list.options[index].value = list.options[index + to].value

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].type = type;
    list.options[index + to].value = value;

    //选中索引也跟着变
    list.selectedIndex = index + to;
    list.focus();
}

//删除所有被选中人员
function btnDelAll_Click() {
    $("#lstEmployees").empty();
}
//授权提交
function btnChoose_Click(systemID) {
    setBtnEnabled($("#btnChoose"), false);
    var accountIDs = [];
    var lstEmployees = $("#lstEmployees");
    $('option', lstEmployees).each
    (
        function (i) {
            if (this.value != '') {
                accountIDs[i] = this.value;
            }
        }
    );
    if (accountIDs.length < 1) {
        setBtnEnabled($("#btnChoose"), true);
        return alertMsg("当前未选择任何帐号，请选择需要授权帐号。");
    }
    ajax("VSetSystemAuthorizedAccount.aspx", { AuthorizedSystemID: systemID, AccountIDs: $.jsonToString(accountIDs) }, "json",
        function (result) {
            setBtnEnabled($("#btnChoose"), true);
            alertMsg(result.Data);
            if (result.Success == "Y") {
                execFrameFuns("frmMain", function () { window.opener.frames("frmMain").reloadAccountData(); }, window.opener);
                closeMe();
            }
        }

   );
}
function ajaxError(xmlHttpRequest, textStatus, errorThrown) {
    setBtnEnabled($("#btnChoose"), true);
    alert("数据获取或操作失败。\n\n代码：" + xmlHttpRequest.status + "\n信息：" + xmlHttpRequest.statusText);
}