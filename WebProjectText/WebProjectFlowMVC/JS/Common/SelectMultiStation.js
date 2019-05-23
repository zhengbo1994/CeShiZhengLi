// VSelectMultiStation.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-13
function RefreshCorpStructure(struID) {
    // 页面层级不同，不能单独方法
    var vStationIDs = "";

    var lstStations = window.parent.getObj("lstStations");
    if (lstStations == null) {
        lstStations = window.parent.getObjP("lstStations");
    }

    for (var i = 0; i < lstStations.options.length; i++) {
        vStationIDs += "," + lstStations.options[i].value;
    }

    if (vStationIDs != "") {
        vStationIDs = vStationIDs.substr(1)
    }

    var mutiStation = getObjP('ddlMutiStation').value;
    //点击左侧架构时,传输关键字的值
    //作者：肖勇彬
    //日期：2015-04-16
    var vKey = getObjP('txtKey').value;

    $('#jqgStation', window.parent.frames("Main").document).getGridParam('postData').StruID = struID;
    $('#jqgStation', window.parent.frames("Main").document).getGridParam('postData').StationID = vStationIDs;
    $('#jqgStation', window.parent.frames("Main").document).getGridParam('postData').MutiStation = mutiStation;
    $('#jqgStation', window.parent.frames("Main").document).getGridParam('postData').KeyValue = vKey;

    window.parent.frames("Main").window.reloadData();
}

function ChangeBackColor(span) {
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

function reloadData() {
    refreshJQGrid('jqgStation');
}

function renderLink(cellvalue, options, rowobject) {
    var url = "'../../OperAllow/Station/VStationBrowse.aspx?StationID=" + rowobject[0] + "'";
    return '<div class="nowrap"><a  href="javascript:window.openModalWindow(' + url + ',600,450)">' + cellvalue + '</a></div>';
}

function showTip(cellvalue, options, rowobject) {
    return '<span style="width:100%;" title="' + rowobject[2] + '\>' + rowobject[3] + '\>' + cellvalue + '(' + rowobject[4] + ')">' + cellvalue + '</span>';
}

function ChangeChild() {
    btnSearch_Click();
}

function ddlMutiStation_Change() {
    var value = getObj('ddlMutiStation').value;
    SetCookie('MutiStation', value);
    btnSearch_Click();
}

function btnSearch_Click() {
    var vKey = $("#txtKey").val();
    if (getObj("trLeft") != null) {
        if (vKey == "") {
            getObj("trLeft").style.display = "";
        }
        else {
            getObj("trLeft").style.display = "none";
        }
    }
    var child = $('#ddlChild').val();
    var mutiStation = getObj('ddlMutiStation').value;
    $('#jqgStation', window.frames("Main").document).getGridParam('postData').Child = child;
    $('#jqgStation', window.frames("Main").document).getGridParam('postData').KeyValue = vKey;
    $('#jqgStation', window.frames("Main").document).getGridParam('postData').MutiStation = mutiStation;
    window.frames('Main').window.reloadData();
}

function btnChoose_Click() {
    btnAdd_Click();
    var vStationID = "";
    var vStationName = "";
    var vStationNo = "";
    var vCorpName = "";
    var vStaName = "";
    var vDeptName = "";
    var vPositionName = "";
    var vDeptID = "";
    var vPositionID = "";
    var vParentCorpID = "";
    var vEmployeeName = "";
    var vAccountID = "";
    if ($('#hidMode').val().toUpperCase() == 'SINGLE') {
        vStationID = $('#jqgStation', window.frames('Main').document).getGridParam('selrow');

        if (!vStationID) {
            return alertMsg("请选择岗位。");
        }

        vEmployeeName = window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'TAccount__EmployeeName');
        vStaName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'StationName'));

        vStationName = vStaName + "(" + vEmployeeName + ")";
        vEmployeeName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'TAccount__EmployeeName'));
        vStationNo = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'StationNo'));
        vCorpName = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'ParentCorpName'));
        vDeptName = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'TCorpStructure__StruName'));
        vPositionName = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'TPosition__PositionName'));
        vDeptID = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'StruID'));
        vPositionID = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'PositionID'));
        vParentCorpID = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'PositionID'));
        vAccountID = stripHtml(window.frames("Main").getJQGridSelectedRowsData('jqgStation', false, 'AccountID'));

    }
    else {
        var lstStations = getObj("lstStations");
        for (i = 0; i < lstStations.length; i++) {
            vStationID += ',' + lstStations.options[i].value;
            vStationName += '，' + lstStations.options[i].text;
            vStationNo += '，' + lstStations.options[i].stationNo;
            vCorpName += '，' + lstStations.options[i].corpName;
            vStaName += '，' + lstStations.options[i].stationName;
            vDeptName += '，' + lstStations.options[i].deptName;
            vPositionName += '，' + lstStations.options[i].positionName;
            vDeptID += ',' + lstStations.options[i].deptID;
            vEmployeeName += '，' + lstStations.options[i].employeeName;
            vParentCorpID += ',' + lstStations.options[i].parentCorpID;
            vPositionID += ',' + lstStations.options[i].positionID;
            vAccountID += ',' + lstStations.options[i].accountID;
        }
    }

    if (vStationID.indexOf(',') > -1) {
        vStationID = vStationID.substr(1);
        vStationName = vStationName.substr(1);
        vStationNo = vStationNo.substr(1);
        vCorpName = vCorpName.substr(1);
        vStaName = vStaName.substr(1);
        vDeptName = vDeptName.substr(1);
        vPositionName = vPositionName.substr(1);
        vDeptID = vDeptID.substr(1);
        vEmployeeName = vEmployeeName.substr(1);
        vParentCorpID = vParentCorpID.substr(1);
        vPositionID = vPositionID.substr(1);
        vAccountID = vAccountID.substr(1);
    }

    if (vStationID == "") {
        vStationID = "";
        vStationName = "";
        vStationNo = "";
        vCorpName = "";
        vStaName = "";
        vDeptName = "";
        vPositionName = "";
        vDeptID = "";
        vEmployeeName = "";
        vParentCorpID = "";
        vPositionID = "";
        vAccountID = "";
    }

    if ($('#hidFrom').val() != 'plan') {
        //转发意见
        if (getObj("hidAim").value == "TransportDescription") {
            window.returnValue = vStationID + "|" + vStationName;
            window.opener = null;
            window.close();
            return;
        }
        //用于处理页面中未知多个的岗位选择情况
        if (getObj("hidAim").value == "Multi" && $("#hidFrom").val() == "ContOper") //监控人设置页面
        {
            var $input = window.dialogArguments.pageArg.$curInputs;
            $input.eq(0).val(vStationID);
            $input.eq(1).val(vStationName);
            window.returnValue = true;
            window.opener = null;
            window.close();
            return;
        }
        else if (getObj("hidAim").value == "Multi" && $("#hidFrom").val() == "ContSetting") //监控人设置页面
        {
            var $input = window.dialogArguments.$pointObj.$curInputs;
            $input.eq(0).val(vStationID);
            $input.eq(1).val(vStationName);
            window.returnValue = true;
            window.opener = null;
            window.close();
            return;
        }
        else if (getObj("hidAim").value == "Multi" && $("#hidFrom").val() == "SwitchStation") //切换岗位权限
        {
            var pageArg = window.dialogArguments.pageArg;
            pageArg.txtInput.value = vStationName;
            pageArg.hidInput.value = vStationID;
            pageArg.hidInput.title = vStationID;
            window.returnValue = true;
            window.opener = null;
            window.close();
            return;
        }
        window.returnValue = vStationID +
            "|" + vStationName +
            "|" + vStationNo +
            "|" + vCorpName +
            "|" + vStaName +
            "|" + vDeptName +
            "|" + vPositionName +
            "|" + vDeptID +
            "|" + vEmployeeName +
            "|" + vParentCorpID +
            "|" + vPositionID +
            "|" + vAccountID;

        //个人工作区 - 我负责的任务 - 知会(YXW)
        if (getObj("hidAim").value == "WBSAssStation") {
            var flag = 0;
            var repeat = 0;
            var dgWBSAssPersons = window.dialogArguments.tbAssPersons;
            var wbsID = window.dialogArguments.hidWBSIDs.value;
            var obj = getObj("lstStations");
            for (var i = 0; i < obj.length; i++) {
                var row = dgWBSAssPersons.insertRow();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" value="' + obj(i).value + '" onclick="selectRow(this)" />'
                                        + '<input id="hidWbsID" type="hidden" value="' + wbsID + '" onclick="selectRow(this)" />';

                cell = row.insertCell(1);
                cell.innerText = obj(i).text.substring(obj(i).text.indexOf("(") + 1, obj(i).text.indexOf(")"));


                cell = row.insertCell(2);
                cell.innerHTML = obj(i).deptName;

                cell = row.insertCell(3);
                cell.innerText = obj(i).positionName;

                cell = row.insertCell(4);
                cell.innerHTML = obj(i).text.substring(0, obj(i).text.indexOf("("));

                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerText = '知会';

                cell = row.insertCell(6);
                cell.align = "center";
                cell.innerHTML = '<select id="seDeptOrPerson"><option value="D">部门</option><option value="P">个人</option></select>';

                cell = row.insertCell(7);
                cell.align = "center";
                cell.innerHTML = '<textarea id="txtRemark" class="text" style="width: 98%;height:40px"></textarea>';

                flag++;
            }
            //            }
            if (flag == 0) {
                if (repeat > 0) {
                    alert("你不能重复添加协作人员。");
                }
                else {
                    alert("没有选择任何协作人员。");
                }
                return false;
            }
        }
        else if (getObj("hidAim").value == "ListPageRole") {
            var stations = getObj("lstStations");
            var returnValues = [];
            for (var i = 0; i < stations.length; i++) {
                returnValues.push(
                    {
                        MID: getNewID().toUpperCase(),
                        MemberID: stations.options[i].value,
                        MemberName: stations.options[i].text,
                        MemberTypeName: "岗位",
                        MemberType: "0"
                    }
                );
            }
            window.returnValue = returnValues;
        }

        window.opener = null;
        window.close();
    }
    else {
        parent.window.returnValue = vStationID + "~Station|" + vStationName;
        parent.window.opener = null;
        parent.window.close();
    }
}
//end--btnChoose_Click()

//清除(add by xiaoft 2012-10-11 不确定$('#hidFrom').val() != 'plan'是什么情况,所以这里只做一步,其他同事可补充.)
//项目新增时返回空值
function btnClear_Click() {
    if ($('#hidFrom').val() == 'plan' || /VProjectEditOrAdd\.aspx/gi.test(parent.dialogArguments.window.location.href)) {
        parent.window.returnValue = "~Station|";
        parent.window.opener = null;
        parent.window.close();
    }
}

function btnAdd_Click(chk) {
    
    var lstStations = getObj("lstStations");
    if (lstStations == null) {
        lstStations = getObjP("lstStations");
    }

    var vStationID = window.frames('Main').getJQGridSelectedRowsID('jqgStation', true);
    var vStationName = window.frames('Main').getJQGridSelectedRowsData('jqgStation', true, 'StationName');
    var vEmployeeName = window.frames('Main').getJQGridSelectedRowsData('jqgStation', true, 'TAccount__EmployeeName');
    var vStationNo = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'StationNo');
    var vCorpName = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'ParentCorpName');
    var vDeptName = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'TCorpStructure__StruName');
    var vPositionName = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'TPosition__PositionName');
    var vDeptID = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'StruID');
    var vPositionID = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'PositionID');
    var vParentCorpID = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'ParentCorpID');
    var vAccountID = window.frames("Main").getJQGridSelectedRowsData('jqgStation', true, 'AccountID');
    if (vStationID.length == 0 & chk == 'chk') {
        return alertMsg("请选择岗位。", getObj("btnAdd"));
    }

    for (var i = 0; i < vStationID.length; i++) {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++) {
            if (lstStations.options[j].value == vStationID[i]) {
                repeat = true;
                break;
            }
        }

        if (!repeat && vStationID[i] != "") {
            var opt = document.createElement("OPTION");
            opt.value = vStationID[i];
            if (getObj("hidAim").value == "TransportDescription") {
                opt.text = $.jgrid.stripHtml(vEmployeeName[i] + "[" + vStationName[i] + "]");
            }
            else {
                opt.text = $.jgrid.stripHtml(vStationName[i] + "(" + vEmployeeName[i] + ")");
            }
            opt.stationNo = vStationNo[i];
            opt.stationName = vStationName[i];
            opt.corpName = vCorpName[i];
            opt.deptName = vDeptName[i];
            opt.positionName = vPositionName[i];
            opt.deptID = vDeptID[i];
            opt.positionID = vPositionID[i];
            opt.employeeName = vEmployeeName[i];
            opt.parentCorpID = vParentCorpID[i];
            opt.accountID = vAccountID[i];
            opt.optiontype = "S";

            lstStations.add(opt, lstStations.length);
        }
    }
}

function btnDel_Click() {
    var lstStations = getObj("lstStations");
    if (lstStations == null) {
        lstStations = getObjP("lstStations");
    }
    for (i = lstStations.options.length - 1; i >= 0; i--) {
        if (lstStations.options[i].selected) {
            lstStations.remove(i);
        }
    }
}

function btnAddAll_Click() {
    var lstStations = getObj("lstStations");
    if (lstStations == null) {
        lstStations = getObjP("lstStations");
    }

    var vStationID = window.frames('Main').getJQGridAllRowsID('jqgStation');
    var vStationName = window.frames('Main').getJQGridAllRowsData('jqgStation', 'StationName');
    var vEmployeeName = window.frames('Main').getJQGridAllRowsData('jqgStation', 'TAccount__EmployeeName');
    var vDeptName = window.frames('Main').getJQGridAllRowsData('jqgStation', 'TCorpStructure__StruName');
    var vDeptID = window.frames('Main').getJQGridAllRowsData('jqgStation', 'StruID');
    if (vStationID.length == 0) {
        return;
    }

    for (var i = 0; i < vStationID.length; i++) {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++) {
            if (lstStations.options[j].value == vStationID[i]) {
                repeat = true;
                break;
            }
        }

        if (!repeat && vStationID[i] != "") {
            var opt = document.createElement("OPTION");
            opt.value = vStationID[i];
            if (getObj("hidAim").value == "TransportDescription") {
                opt.text = $.jgrid.stripHtml(vEmployeeName[i] + "[" + vStationName[i] + "]");
            }
            else {
                opt.text = $.jgrid.stripHtml(vStationName[i] + "(" + vEmployeeName[i] + ")");
            }
            opt.deptName = vDeptName[i];
            opt.deptID = vDeptID[i];
            opt.optiontype = "S";

            lstStations.add(opt, lstStations.length);
        }
    }
}

function btnDelAll_Click() {
    var lstStations = getObj("lstStations");
    if (lstStations == null) {
        lstStations = getObjP("lstStations");
    }
    for (i = lstStations.options.length - 1; i >= 0; i--) {
        lstStations.remove(i);
    }
}

function lstStationsDB_Clisk() {
    var addOption = document.createElement("option ")
    var index

    if (getObj("lstStations").length == 0) return (false);
    index = getObj("lstStations").selectedIndex
    if (index < 0) return (false);
    getObj("lstStations").remove(index)
}

//双击添加人员
function jqGridDblClick(rowid, iRow, iCol, e) {
    var lstStations = getObjP("lstStations");
    var parentDoc = window.parent.document;
    if (lstStations == null) {
        lstStations = window.parent.parent.document.getElementById("lstStations");
        parentDoc = window.parent.parent.document;
    }
    var vStationID = rowid;
    var vStationName = $('#jqgStation').getRowData(rowid)['StationName'];
    var vEmployeeName = $('#jqgStation').getRowData(rowid)['TAccount__EmployeeName'];
    var vStationNo = $('#jqgStation').getRowData(rowid)['StationNo'];
    var vCorpName = $('#jqgStation').getRowData(rowid)['ParentCorpName'];
    var vDeptName = $('#jqgStation').getRowData(rowid)['TCorpStructure__StruName'];
    var vPositionName = $('#jqgStation').getRowData(rowid)['TPosition__PositionName'];
    var vDeptID = $('#jqgStation').getRowData(rowid)['StruID'];
    var vPositionID = $('#jqgStation').getRowData(rowid)['PositionID'];
    var vParentCorpID = $('#jqgStation').getRowData(rowid)['ParentCorpID'];
    var vAccountID = $('#jqgStation').getRowData(rowid)['AccountID'];

    if ($(parentDoc).find('#lstStations option[value=\'' + vStationID + '\']').length <= 0) {
        var opt = document.createElement("OPTION");
        opt.value = vStationID;
        if (getObjP("hidAim").value == "TransportDescription") {
            opt.text = $.jgrid.stripHtml(vEmployeeName + "[" + vStationName + "]");
        }
        else {
            opt.text = $.jgrid.stripHtml(vStationName + "(" + vEmployeeName + ")");
        }
        opt.stationNo = vStationNo;
        opt.stationName = vStationName;
        opt.corpName = vCorpName;
        opt.deptName = vDeptName;
        opt.positionName = vPositionName;
        opt.deptID = vDeptID;
        opt.positionID = vPositionID;
        opt.employeeName = vEmployeeName;
        opt.parentCorpID = vParentCorpID;
        opt.accountID = vAccountID;
        opt.optiontype = "S";

        lstStations.add(opt, lstStations.length);
    }
}

//上下移动选项 陈晓明
function move(to) {
    var list = getObj("lstStations");
    var total = list.options.length - 1;
    var index = getObj("lstStations").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;

    //临时保存选项的值
    var text = list.options[index].text;
    var value = list.options[index].value;
    var stationNo = list.options[index].stationNo;
    var stationName = list.options[index].stationName;
    var corpName = list.options[index].corpName;
    var deptName = list.options[index].deptName;
    var positionName = list.options[index].positionName;
    var deptID = list.options[index].deptID;
    var positionID = list.options[index].positionID;
    var employeeName = list.options[index].employeeName;
    var parentCorpID = list.options[index].parentCorpID;
    var accountID = list.options[index].accountID;

    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value
    list.options[index].stationNo = list.options[index + to].stationNo
    list.options[index].stationName = list.options[index + to].stationName
    list.options[index].corpName = list.options[index + to].corpName
    list.options[index].deptName = list.options[index + to].deptName
    list.options[index].positionName = list.options[index + to].positionName
    list.options[index].deptID = list.options[index + to].deptID
    list.options[index].positionID = list.options[index + to].positionID
    list.options[index].employeeName = list.options[index + to].employeeName
    list.options[index].parentCorpID = list.options[index + to].parentCorpID
    list.options[index].accountID = list.options[index + to].accountID
    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;
    list.options[index + to].stationNo = stationNo;
    list.options[index + to].stationName = stationName;
    list.options[index + to].corpName = corpName;
    list.options[index + to].deptName = deptName;
    list.options[index + to].positionName = positionName;
    list.options[index + to].deptID = deptID;
    list.options[index + to].positionID = positionID;
    list.options[index + to].employeeName = employeeName;
    list.options[index + to].parentCorpID = parentCorpID;
    list.options[index + to].accountID = accountID;
    //选中索引也跟着变
    list.selectedIndex = index + to;

}

function SetCookie(name, value)//两个参数，一个是cookie的名子，一个是值
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
}

