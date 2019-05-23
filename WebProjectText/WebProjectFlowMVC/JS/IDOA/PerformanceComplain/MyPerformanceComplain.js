// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;


//新建
function btnAdd_Click() {
    openAddWindow("VMyPerformanceComplainAdd.aspx", 800, 600, "jqPerformanceComplain");
}

//修改
function showMyPerformanceComplainEdit(PCID) {
    $("#jqPerformanceComplain").resetSelection();
    $("#jqPerformanceComplain").setSelection(PCID, false);
    var url = "VMyPerformanceComplainEdit.aspx?PCID=" + PCID;
    openModifyWindow(url, 800, 600, "jqPerformanceComplain");
}

//查看
function showMyPerformanceComplainBrowse(PCID) {
    openWindow("VPerformanceComplainBrowse.aspx?PCID=" + PCID, 800, 600);
}

//删除
function btnDelete_Click() {
    openDeleteWindow("PerformanceComplainMark", 1, "jqPerformanceComplain");
}


//撤销
function revokeMyPerformanceComplain() {
    openRevokeWindow("PerformanceComplain", "jqPerformanceComplain");
}

//搜索
function btnSearch_Click() {
    reloadData();
}


function changeCorp(vCTID, vCID) {
    var sCropID = $("#ddlCorp").val();

    if (vCTID == null) {
        vCTID = "";
    }

    if (vCID == null) {
        vCID = "";
    }

    if (sCropID != "") {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID', CorpID: sCropID, IsNoSelect: "Y" }, function (data, textStatus) {
            loadExamPlan(data, vCTID + '|' + vCID);
        }, 'json');
    }
    else {
        loadExamPlan([], vCTID + '|' + vCID);
    }
}
// 绑定考核计划
var loadExamPlan = function (data, vID)
{
    var ddlExamPlan = getObj("ddlExamPlan");
    ddlExamPlan.options.length = 0;

    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt,ddlExamPlan.length);
    });

    if (ddlExamPlan.options.length > 0)
    {
        if (vID.split('|')[0] != "")
        {
            ddlExamPlan.value = vID.split('|')[0];
        }

    }
    else
    {
        $("<option value=''>全部</option>").appendTo(ddlExamPlan);
    }
}

function reloadData() {
    var jqObj = $('#jqPerformanceComplain', document);

    if (_PageMaster.isSearching) {
        return false;
    }
    else {
        _PageMaster.isSearching = true;
    }

    var CorpID = $("#ddlCorp").val();
    var ExamID = $("#ddlExamPlan").val();
    var CCState = $("#ddlCCState").val();
    var IsNeedCheck = $("#ddlIsNeedCheck").val();
    var vKey = $("#txtKey").val();
    var MeDoState = $("#ddlMeDoState").val();
    var CreateDateStart = $("#txtCreateDateStart").val();
    var CreateDateEnd = $("#txtCreateDateEnd").val();

    if (CreateDateStart != "" && CreateDateEnd != "" && compareDate(CreateDateStart, CreateDateEnd) == -1)
    {
        _PageMaster.isSearching = false;
        return alertMsg("结束时间必须大于开始时间。", getObj("txtCreateDateEnd"));
    }

    jqObj.getGridParam('postData').CorpID = CorpID;
    jqObj.getGridParam('postData').ExamID = ExamID;
    jqObj.getGridParam('postData').CCState = CCState;
    jqObj.getGridParam('postData').IsNeedCheck = IsNeedCheck;
    jqObj.getGridParam('postData').SearchText = vKey;
    jqObj.getGridParam('postData').MeDoState = MeDoState;
    jqObj.getGridParam('postData').CreateDateStart = CreateDateStart;
    jqObj.getGridParam('postData').CreateDateEnd = CreateDateEnd;

    refreshJQGrid('jqPerformanceComplain');
}

function customGridComplete() {
    _PageMaster.isSearching = false;
}


//起草人岗位变化
var ddlStation_Change = function () {
    var ddl = getObj("ddlStation");
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

// 考核计划变化
var ddlExamPlan_Change = function () {
    getObj("hidExamID").value = getObj("ddlExamPlan").value;
}

function changCheckState() {
    if ($('#rblAddClass input:checked').val() == "N") {
        //正常申请
        getObj('trUrgency').style.display = "";

        $('#btnNext').show();


        if ($('#hidStep').val() == "0") {
            $('#btnSaveClose').hide();
            $('#btnSaveOpen').hide();
        }
        else {
            $('#btnSaveClose').show();
            $('#btnSaveOpen').show();
        }
    }
    else {
        //直接登记
        getObj('trUrgency').style.display = "none";

        $('#btnNext').hide();
        $('#btnSaveClose').show();
        $('#btnSaveOpen').show();
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

function showBrowseTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i <= 2; i++) {
        if (getObj("div" + i)) {
            getObj("div" + i).style.display = "none";
        }
    }

    getObj("div" + index).style.display = "block";
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


function validateSize(vtype) {

    var rblAddClass = $("input[name$=rblAddClass][checked]");
    var addClass = rblAddClass.val();

    if (addClass == "") {
        return alertMsg("登记类型不能为空。", getObj("rblAddClass"));
    }

    if (getObj("txtPCName").value == "") {
        return alertMsg("申诉标题不能为空。", getObj("txtPCName"));
    }

    if (getObj("ddlCorp").value == "") {
        return alertMsg("公司不能为空。", getObj("ddlCorp"));
    }


    if (getObj("ddlStation").value == "") {
        return alertMsg("申诉人岗位不能为空。", getObj("ddlStation"));
    }

    if (getObj("ddlExamPlan").value == "") {
        return alertMsg("请选择对应的考核计划！", getObj("ddlExamPlan"));
    }

    if (getObj("txtPCNo").value == "") {
        return alertMsg("申诉编号不能为空。", getObj("txtPCNo"));
    }


    if (getObj("txtRequestDate").value == "") {
        return alertMsg("申诉日期不能为空。", getObj("txtRequestDate"));
    }

    if (addClass == "N") {
        if (getObj("rblUrgency").value == "") {
            return alertMsg("紧急程度不能为空。", getObj("rblUrgency"));
        }
    }
    else {
        if (getObj("txtOldPCNo").value == "") {
            return alertMsg("直接登记时内部编号不能为空。", getObj("txtOldPCNo"));
        }
    }

    // 只有在正式提交时才验证自定义表单信息
    if (vtype == "1") {
        // 自定义表单信息
        if ((!formValidate() || !flowValidate())) {
            return false;
        }
    }

    if (!saveDocModel()) {
        return alertMsg("正文文档保存失败。", getObj("chkUseDocModel"));
    }


    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */
    disabledButtonsWhenSubmit();

    return true;
}


//选择多岗位（公司）
function selectMultiStationByCorp(aim) {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=' + aim + '&CorpID=' + getObj('hidCorpID').value, 900, 600);

    if (vValue != "undefined" && vValue != null) {
        getObj("hid" + aim + "ID").value = vValue.split('|')[0];
        getObj("txt" + aim).value = vValue.split('|')[1];
    }
}
//选择多部门（公司）
function selectMultiDeptByCorp(aim) {
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=' + aim + '&CorpID=' + getObj('hidCorpID').value, 900, 600);

    if (vValue != "undefined" && vValue != null) {
        getObj("hid" + aim + "ID").value = vValue.split('|')[0];
        getObj("txt" + aim).value = vValue.split('|')[1];
    }
}


function disabledButtonsWhenSubmit() {
    setBtnEnabled("btnSaveNotSumbit,btnPrevious,btnNext,btnSaveOpen,btnSaveClose", false);
}