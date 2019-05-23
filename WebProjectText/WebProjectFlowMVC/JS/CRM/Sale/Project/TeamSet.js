//myfunction
function refreshMain() {
    window.parent.location.reload();
}

///改变被选中的节点样式 
function changeBackColor(span) {
    $('.selNode').removeClass('selNode').addClass('normalNode');
    $(span).removeClass('normalNode').addClass('selNode');
//    var obj = document.getElementsByName("EOName");
//    for (i = 0; i < obj.length; i++) {
//        obj(i).className = 'normalNode';
//    }
//    span.className = "selNode";
}

//点击节点后(左边树调用)
function refreshOrganiztionInfo(TeamID, pjid) {
    parent["TeamID"] = TeamID;
    //parent["pjid"] = pjid;
    //mainFrame = window.parent.frames('Main');  
    window.parent.execFrameFuns("Main", function () {
        parent.window.frames('Main').reloadData();
    })   
    }
  
function reloadData() {
    //Main页面从父页面获取参数
    var query = { TeamID: parent["TeamID"] };    
        if (loadJQGrid("jqGrid1", query)) {            
            refreshJQGrid("jqGrid1");
        }
            
}




function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null; 
 }




 //add团队页面。。。。。。。。。。。。。。。。
 //添加团队 
 // 0-同级 1-下级
 function addOrganization(action) {
     var pjid = window["pjid"];
     if (pjid == "" || typeof (pjid) == "undefined") {

         pjid = getQueryString("pjid");
     }
     if (!pjid) {
         return alertMsg('请选择一个项目。');
     }

     action = (action == 0 ? "AddFriend" : "AddSon");
     var eoID = window["TeamID"];
     if (!eoID) {
         action = "AddFriendInRoot";
         if (window["pjid"] == "") window["pjid"] = getQueryString("pjid");
     }
     // openAddWindow("TeamSetAdd.aspx?Action=" + action + "&TeamID=" + eoID, 400, 550);
     var newTeamID = openModalWindow("TeamSetAdd.aspx?Action=" + action + "&TeamID=" + eoID + "&projectid=" + window["pjid"], 650, 450);
     //添加成功，左侧页面定位到新建团队，刷新右侧页面,充值页面参数
     if (newTeamID != "" && typeof (newTeamID) != "undefined") {
         window.frames('Left').location.href = "TeamSetLeft.aspx?pjid=" + window["pjid"] + "&TeamID=" + newTeamID + "&action=addhandle";
         window.frames('Main').reloadData();
     }
 }

//验证
function validateOrgSize() {

    if (getObj("txtEOName").value == "") {
        return alertMsg("团队名称不能为空。", getObj("txtEOName"));
    }
    if (getObj("txtCode").value == "") {
        return alertMsg("团队编号不能为空。", getObj("txtCode"));
    }
    return true;
}

function returanval(newTeamID) {
    window.dialogArguments.TeamID = newTeamID;
    window.returnValue = newTeamID;
}

//新增团队成员
function addMember() {
    var TeamID = window["TeamID"];
    if (!TeamID) {
            return alertMsg('请选择一个团队。');
        }
    var rValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim=ScopeStation&CorpID=TotalCompany', 0, 0);
    if (!rValue)
        return;
    getObj("hdstationID").value = rValue.split('|')[0];       
    if (confirm("是否确认新增这些成员吗？")) {
        //调用ajax新增并刷新jqgird
        ajax(        
           "TeamSet.aspx",
          { "action": "addmember", "IDs": getObj("hdstationID").value, "TeamID": window["TeamID"] },
            "text",
           reloadMainHandle          
        );
    }
}

function reloadMainHandle(data, textStatus) {
    if (data != "" && data != "AddFail") alert('操作完成！岗位：' + data + ' 已经存在，不需要重复添加！');
    if (data == "AddFail") alertMsg('操作失败！');
    if(data =="") alertMsg('操作成功！');
    window.frames('Main').reloadData();
}

//删除团队成员
function btnDelete_Click() {
    var StrMemberIDs = window.frames('Main').getJQGridSelectedRowsID("jqGrid1")
    if (StrMemberIDs == "" || typeof (StrMemberIDs) == "undefined") {
        return alertMsg('请选择成员！');
    } 
    window.frames('Main').openDeleteWindow("TeamMember", 7, "jqGrid1");
}
//删除团队
function deleteOrganization() {
    var eoID = window["TeamID"];
    if (!eoID) {
        return alertMsg('请选择一个团队。');
    }
    if (window.frames('Left').isLeaf() == "N") {
        return alertMsg('只能删除底层团队。');
    }
    window.frames('Left').myopenDeleteWindow("ProjectTeam", 7, eoID);
}

//删除树的节点，用不到公有的delete函数，只好自己弄了
function myopenDeleteWindow(action,aim,teamid) {
   //获取CRM删除页
    var url = getDeletePageUrl(aim);

    url += "?Action=" + action + "&ID=" + teamid;
    var winobj = getOpenWinObj(2);
    var ret=window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
        + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
        window.parent.location.href = "TeamSet.aspx?IDM_ID=" + parent.getQueryString("IDM_ID") + "&pjid=" + parent['pjid'];
}

//获取当前选中
function isLeaf() {
    return $('.selNode').attr("isLeaf");
}

//设置组长,isSet=1设置，=0撤销
function btnSetLeader_Click(isSet) {
    var StrMemberIDs = window.frames('Main').getJQGridSelectedRowsID("jqGrid1")
    if (StrMemberIDs == ""||typeof(StrMemberIDs)=="undefined") {
        return alertMsg('请选择成员！');
    }    
    var strConfirm = isSet ? "确定要设置为组长吗?" : "确定要撤销组长吗?";
    if (confirm(strConfirm)) {        
        window.frames('Main').btnSetLeader_userInFrame(isSet);
    }
}

//在main中调用设置为组长
function btnSetLeader_userInFrame(isSet) {
    var ids = getJQGridSelectedRowsID("jqGrid1");
    var CurrentAccountID = getObj("hidAccountID").value;
    var strTeamID=parent["TeamID"];
    //调用ajax新增并刷新jqgird
   // alert(isSet ? "SetLeader" : "CancleLeader");
    $.ajax(
        {
            url: addRandParam("TeamSetMain.aspx"),
            data: { action: isSet ? "SetLeader" : "CancleLeader", LeaderIDs: ids.join(), TeamID: strTeamID, AccountID: CurrentAccountID },
            dataType: "text",
            success: reloadDataForSetLeader,
            error: ajaxError
        });
}
//设置组长的回调函数
function reloadDataForSetLeader(data, status) {

    if (data == "True") alert('设置成功！');
    else if (data == "N") alert('组长才能撤销！');
    else alertMsg('设置失败！');
    reloadData();
}

//编辑团队
function editOrganization() {
    var teamid = window["TeamID"];
    if (!teamid) {
        return alertMsg('请选择一个团队。');
    }
    if (window.frames('Left').isLeaf() == "N") {
        return alertMsg('只能编辑底层团队。');
    }
    var url = "TeamSetEdit.aspx";
    url += "?Action=Edit&TeamID=" + teamid;
    url=addRandParam(url);
    var winobj = getOpenWinObj(2);
    var ret=window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' +650 + 'px;dialogHeight='
        + 400 + 'px;status=1;resizable=0;scroll=0;scrollbars=0');

    if (typeof ret != "undefined") {
        window.frames('Left').location.href = "TeamSetLeft.aspx?pjid=" + parent["pjid"] + "&TeamID=" + teamid + "&action=addhandle";
    }
     
}

//新增页面ajax验证团队是否重名
function checkReName() {       
    var parentTeamID = getObj("hidParentEOID").value;
    var NewTeamName = getObj("txtEOName").value;
    if (NewTeamName == "") {
        showTip("团队名不能为空", 200);
        return;
    }
        ajax(
           "TeamSetAdd.aspx",
          { "action": "CheckReName", "parentTeamID": parentTeamID, "NewTeamName": NewTeamName },
            "text",
           showTip
        );
    }

    //编辑页面
    function checkReNameInEdit() {
        var parentTeamID = getObj("hidParentEOID").value;
        var NewTeamName = getObj("txtEOName").value;
        var originalTeamName = getObj("hidOriginalTeamName").value;
        if (NewTeamName == "") {
            showTip("团队名不能为空", 200);
            return;
        }
        ajax(
           "TeamSetEdit.aspx",
          { "action": "CheckReName", "parentTeamID": parentTeamID, "NewTeamName": NewTeamName, "originalTeamName": originalTeamName },
            "text",
           showTip
        );
    }

    function showTip(data, status) {
        data = '<span style="font-size:13;color:red">' + data + '</span>';
        $("#lbNameTip").html(data);

    }


    //新增页面ajax验证团队编号是否重复
    function checkReCode() {
        var parentTeamID = getObj("hidParentEOID").value;
        var NewTeamCode = getObj("txtCode").value;
        if (NewTeamCode == "") {
            showCodeTip("团队编号不能为空", 200);
            return;
        }
        ajax(
           "TeamSetAdd.aspx",
          { "action": "CheckReCode", "parentTeamID": parentTeamID, "NewTeamCode": NewTeamCode },
            "text",
           showCodeTip
        );
    }
    //编辑页面ajax验证团队编号是否重复
    function checkReCodeInEdit() {
        var parentTeamID = getObj("hidParentEOID").value;
        var NewTeamCode = getObj("txtCode").value;
        var originalTeamCode = getObj("hidOriginalTeamCode").value;
        if (NewTeamCode == "") {
            showCodeTip("团队编号不能为空", 200);
            return;
        }
        ajax(
           "TeamSetEdit.aspx",
          { "action": "CheckReCode", "parentTeamID": parentTeamID, "NewTeamCode": NewTeamCode, "originalTeamCode": originalTeamCode },
            "text",
           showCodeTip
        );
    }

    function showCodeTip(data, status) {
        data = '<span style="font-size:13;color:red">' + data + '</span>';
        $("#lbCodeTip").html(data);

    }


//下面的不知道有什么用，先留着**************************************************************************************************************

//新建
function btnAdd_Click() {
    var corpid = getObj("ddlCorp").value;
    openAddWindow("VExamOrganizationAdd.aspx?CorpID=" + corpid, 400, 300, "jqGrid1");
}

//修改
function btnEdit_Click() {
    openModifyWindow("VExamOrganizationEdit.aspx", 400, 300, "jqGrid1");
}


function btnSetting_Click() {
    openAddWindow("VExamGradeSet.aspx", 800, 600, "jqGrid1");
}

function btnImport_Click() {
    openModifyWindow("VExamOrganizationImport.aspx?CorpID=" + getObj("ddlCorp").value, 450, 200, "jqGrid1");
}

function btnSearch_Click() {
    reloadListData();
}

function ddlCorp_Change() {
    reloadListData();
}

function reloadListData() {
    var query = { CorpID: getObj("ddlCorp").value, SearchText: getObj("txtKey").value };

    if (loadJQGrid("jqGrid1", query)) {
        refreshJQGrid("jqGrid1");
    }
}

//查看
function renderLink(cellvalue, options, rowobject) {
    var url = "'VExamOrganizationBrowse.aspx?EOCID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function renderOperateLink(cellvalue, options, rowobject) {
    var url = "'VExamOrganizationSet.aspx?EOCID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)"> 设置 </a>';
}

function validateSize() {
    if (getObj("txtEOCName").value == "") {
        return alertMsg("团队配置不能为空。", getObj("txtEOCName"));
    }

    if (getObj("ddlCorp")) {
        if (getObj("ddlCorp").value == "") {
            return alertMsg("公司不能为空。", getObj("ddlCorp"));
        }
    }

    return true;
}







function btnDeleteStation_Click() {
    try {
        openDeleteWindow("ExamOrganizationStation", 1, "jqGrid1", "Main");
    } catch (e) {
        alertMsg('请选择一个团队。');
    }
}

function btnSet_Click() {
    var eoID = window["TeamID"];
    if (!eoID) {
        return alertMsg('请选择一个团队。');
    }
    openWindow("VExamOrganizationStation.aspx?EOID=" + eoID + "&JQID=jqGrid1", 400, 400);
}



// 岗位查看
function showStation(cellvalue, options, rowobject) {
    var struID = parent["EOID"];
    var url = "'../../../OperAllow/Station/VStationInfoBrowse.aspx?StationID=" + rowobject[1] + "&StruID=" + struID + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

//团队选择页×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
//团队选择测试
//pjid-项目ID，IsMulti=true时多选，其他情况单选
//返回JSON数组[{ MemberAccountID: '*****',MemberName: '张三'},{ MemberAccountID: '*****',MemberName: '李四'}]                                    
function btnSelectTeamMember_Click()
{
    var url = 'TeamSelect.aspx?pjid=19949203-9CC5-42E3-83EC-165528BA91C3&IsMulti=true';
    var jsonArr = openModalWindow(url, 950, 600);
    alert($.jsonToString(jsonArr));
}

//点击选择按钮返回帐号ID和员工名称JSON对象
function onBtnChoose_Click()
{
    var isMulti = Boolean($("#IsMulti").val());
    btnAdd_Click();
    var Employees = getObj("lstEmployees");
    var returnValues = [];
    
    for (var i = 0; i < Employees.length; i++) {
        returnValues.push(
                    {                        
                        MemberAccountID: Employees.options[i].value,
                        MemberName: Employees.options[i].text                  
                    }
                );
    }

    if (!isMulti && returnValues.length > 1) {
        return alertMsg("只能选择一条数据");
    }
    window.returnValue = returnValues;
    window.close();
}

//添加选中
function btnAdd_Click(chk)
{

    var lstEmployees = getObj("lstEmployees");
    if (lstEmployees == null) {
        lstEmployees = getObjP("lstEmployees");
    }

    var vAccountGUIDs = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'AccountGUID');
    var vEmployeeNames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'employeeName');

    if (vAccountGUIDs.length == 0 & chk == 'chk') {
        return alertMsg("请选择数据", getObj("btnAdd"));
    }

    for (var i = 0; i < vAccountGUIDs.length; i++) {
        var repeat = false;
        for (j = 0; j < lstEmployees.length; j++) {
            if (lstEmployees.options[j].value == vAccountGUIDs[i]) {
                repeat = true;
                break;
            }
        }

        if (!repeat && vAccountGUIDs[i] != "") {
            var opt = document.createElement("OPTION");
            opt.value = vAccountGUIDs[i];
            opt.text = vEmployeeNames[i];

            lstEmployees.add(opt, lstEmployees.length);
        }
    }
}


function btnAddAll_Click()
{
    var lstEmployees = getObj("lstEmployees");
    if (lstEmployees == null) {
        lstEmployees = getObjP("lstEmployees");
    }

    var vAccountGUIDs = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'AccountGUID');
    var vEmployeeNames = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'employeeName');

    for (var i = 0; i < vAccountGUIDs.length; i++) {
        var repeat = false;
        for (j = 0; j < lstEmployees.length; j++) {
            if (lstEmployees.options[j].value == vAccountGUIDs[i]) {
                repeat = true;
                break;
            }
        }

        if (!repeat && vAccountGUIDs[i] != "") {
            var opt = document.createElement("OPTION");
            opt.value = vAccountGUIDs[i];
            opt.text = vEmployeeNames[i];

            lstEmployees.add(opt, lstEmployees.length);
        }
    }
}


//删除选中项
function btnDel_Click()
{
    var lstEmployees = getObj("lstEmployees");
    if (lstEmployees == null) {
        lstEmployees = getObjP("lstEmployees");
    }
    for (i = lstEmployees.options.length - 1; i >= 0; i--) {
        if (lstEmployees.options[i].selected) {
            lstEmployees.remove(i);
        }
    }
}

function btnDelAll_Click()
{
    var lstEmployees = getObj("lstEmployees");
    if (lstEmployees == null) {
        lstEmployees = getObjP("lstEmployees");
    }
    for (i = lstEmployees.options.length - 1; i >= 0; i--) {
        lstEmployees.remove(i);
    }
}

//双击选中的人
function lstEmployeesDB_Clisk()
{
    var addOption = document.createElement("option ")
    var index

    if (getObj("lstEmployees").length == 0) return (false);
    index = getObj("lstEmployees").selectedIndex
    if (index < 0) return (false);
    getObj("lstEmployees").remove(index)
}