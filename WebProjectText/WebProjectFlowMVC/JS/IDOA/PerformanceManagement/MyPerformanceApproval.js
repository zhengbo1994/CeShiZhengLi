// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

//新建
function btnAdd_Click()
{
    openAddWindow("VMyPerformanceApprovalAdd.aspx", 800, 600, "jqPerformanceApproval");
}


//修改
function showMyPerformanceApprovalEdit(PABID)
{
    $("#jqPerformanceApproval").resetSelection();
    $("#jqPerformanceApproval").setSelection(PABID, false);
    var url = "VMyPerformanceApprovalEdit.aspx?PABID=" + PABID;
    openModifyWindow(url, 800, 600, "jqPerformanceApproval");
}

//查看
function showMyPerformanceApprovalBrowse(PABID)
{
    openWindow("VPerformanceApprovalBrowse.aspx?PABID=" + PABID, 800, 600);
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("PerformanceApproval", 1, "jqPerformanceApproval");
}


//撤销
function revokeMyPerformanceApproval()
{
    openRevokeWindow("PerformanceApproval", "jqPerformanceApproval");
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
var loadExamPlan = function (data, vID) {
    var ddlExamPlan = getObj("ddlExamPlan");    
    ddlExamPlan.options.length = 0;

    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddlExamPlan.add(opt, ddlExamPlan.length);
    });

    if (ddlExamPlan.options.length > 0) {
        if (vID.split('|')[0] != "") {
            ddlExamPlan.value = vID.split('|')[0];
        }

    }
    else {
        $("<option value=''>全部</option>").appendTo(ddlExamPlan);
    }
}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var jqObj = $('#jqPerformanceApproval', document);

    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }
    var CorpID = $("#ddlCorp").val();
    var ExamID = $("#ddlExamPlan").val();
    var CCState = $("#ddlCCState").val();
    var AddClass = $("#ddlAddClass").val();
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
    jqObj.getGridParam('postData').AddClass = AddClass;
    jqObj.getGridParam('postData').SearchText = vKey;
    jqObj.getGridParam('postData').MeDoState = MeDoState;
    jqObj.getGridParam('postData').CreateDateStart = CreateDateStart;
    jqObj.getGridParam('postData').CreateDateEnd = CreateDateEnd;

    refreshJQGrid('jqPerformanceApproval');
}
function customGridComplete()
{
    _PageMaster.isSearching = false;
}

//选择考核计划
function selectSingleExamPlan()
{
    var CorpID = getObj('ddlCorp').value;
    if (CorpID == "")
    {
        return alertMsg("请先选择公司。", getObj("ddlCorp"));
    }

    var ExamPlanInfo = openModalWindow('../../../Common/Select/IDOA/VSelectSingleExamPlan.aspx?CorpID=' + CorpID, 900, 600);

    if (typeof ExamPlanInfo != "undefined" && ExamPlanInfo != null)
    {
        getObj("txtExamName").value = ExamPlanInfo.ExamName;
        getObj("hidExamID").value = ExamPlanInfo.ExamID;
        getObj("ddlCorp").value = ExamPlanInfo.CorpID;
        getObj("hidCorpID").value = ExamPlanInfo.CorpID;

        // 清空考核范围列表
        clearPerformanceBill();
    }
}

// 修改页中获取考核对象明细
function reloadPerformanceBillWhenEdit()
{
    var PABID = $("#hidKeyID").val();
    var jqgObj = $('#jqPerformanceBill', document);

    jqgObj.getGridParam('postData').PABID = PABID;
    setTimeout(function ()
    {
        refreshJQGrid('jqPerformanceBill')
    }, 1000);
}

function showScope(id)
{
    var url = "../PerformancePlan/VPerformancePlanScopeBrowse.aspx?ID=" + id + "";
    openWindow(url, 800, 600);
}


//起草人岗位变化
var ddlStation_Change = function ()
{
    var ddl = getObj("ddlStation");
    if (ddl.value == "")
    {
        getObj("hidStationID").value = "";
        getObj("hidCorpID").value = "";
        getObj("hidPositionLevel").value = "";
    }
    else
    {
        getObj("hidStationID").value = ddl.value.split('|')[0];
        getObj("hidCorpID").value = ddl.value.split('|')[1];
        getObj("hidPositionLevel").value = ddl.value.split('|')[2];
    }
}


function changCheckState()
{
    if ($('#rblAddClass input:checked').val() == "N")
    {
        //正常申请
        getObj('trUrgency').style.display = "";

        $('#btnNext').show();
        if ($('#hidStep').val() == "0")
        {
            $('#btnSaveClose').hide();
            $('#btnSaveOpen').hide();
        }
        else
        {
            $('#btnSaveClose').show();
            $('#btnSaveOpen').show();
        }
    }
    else
    {
        //直接登记
        getObj('trUrgency').style.display = "none";

        $('#btnNext').hide();
        $('#btnSaveClose').show();
        $('#btnSaveOpen').show();
    }
}


//用于新增考核范围
function addPerformanceBill()
{
    var ExamID = getObj("hidExamID").value;
    if (ExamID == "")
    {
        return alertMsg("请先选择考核计划。", getObj("txtExamName"));
    }

    var rblPABType = $("input[name$=rblPABType][checked]");
    var PABType = rblPABType.val();
    if (PABType != "O" && PABType != "S")
    {
        return alertMsg("请先选择报批类型。", getObj("rblPABType"));
    }

    var table = tbPerformanceBill;

    var ExamPlanScopeInfo = openModalWindow('../../../Common/Select/IDOA/VSelectMultiApprovalScope.aspx?ExamID=' + ExamID + '&PABType=' + PABType + '&tbID=' + tbPerformanceBill.id, 900, 600);

    if (typeof ExamPlanScopeInfo != "undefined" && ExamPlanScopeInfo != null && ExamPlanScopeInfo.EPSIDs != "")
    {
        var EPSIDs = ExamPlanScopeInfo.EPSIDs.split(',');
        var EONames = ExamPlanScopeInfo.EONames.split(',');
        var IsTeamLeaders = ExamPlanScopeInfo.IsTeamLeaders.split(',');
        var StruNames = ExamPlanScopeInfo.StruNames.split(',');
        var ExamScores = ExamPlanScopeInfo.ExamScores.split(',');
        var LevelNames = ExamPlanScopeInfo.LevelNames.split(',');

        

        if (typeof EPSIDs != "undefined" && EPSIDs.length > 0)
        {
            for (var i = 0; i < EPSIDs.length; i++)
            {
                if (!checkIsRepeat(EPSIDs[i], table))  //检测数据是否重复
                {
                    var row = table.insertRow();

                    var cell = row.insertCell(0);
                    cell.align = "center";
                    cell.innerHTML = getCheckBoxHtml("", EPSIDs[i]);

                    var cell = row.insertCell(1);
                    cell.align = "left";
                    cell.innerHTML = EONames[i];

                    var cell = row.insertCell(2);
                    cell.align = "left";
                    cell.innerHTML = "<a href='javascript:void(0);' onclick='javascript:showScope(\"" + EPSIDs[i] + "\");'>"
                        + StruNames[i] + "</a>";

                    var cell = row.insertCell(3);
                    cell.align = "right";
                    cell.innerHTML = "<a href='../PerformanceScore/VExamScopeScore.aspx?EPSID=" 
                    + EPSIDs[i] + "&PABType="
                    + PABType + "' target='_blank'>" 
                    + formatFloat(ExamScores[i], 2) + "</a>"
                    + getHiddenHtml("hidExamScores", ExamScores[i]);

                    var cell = row.insertCell(4);
                    cell.align = "center";
                    cell.innerHTML = LevelNames[i];
                }
            }
        }
        setTableRowAttributes(table);
    }
}

//检查是否重复数据
function checkIsRepeat(chkval, table)
{
    var cnlt = table.rows.length;
    var id = "";
    var ids = new Array()
    for (i = 1; i < cnlt; i++)
    {
        ids[i] = table.rows(i).getElementsByTagName("input").item(0).value;
    }

    var repeat = false;
    for (j = 0; j < ids.length; j++)
    {
        if (ids[j] == chkval)
        {
            repeat = true;
            break;
        }
    }

    return repeat;
}


function formatFloat(src, pos)
{
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

//用于删除考核范围
function deletePerformanceBill()
{
    // 删除表格中复选框选中的行
    deleteTableRow(tbPerformanceBill);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(tbPerformanceBill);
}

// 生成查看考核目标明细链接
function showPerformanceBillDetail(EPSID, StruName)
{
    var url = "VPerformanceBillBrowser.aspx?EPSID=" + EPSID;
    return '<a href="#" onclick="openWindow(\'' + url + '\',800, 600)">' + StruName + '</a>';
}


function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");

    // 起草与浏览
    if (getObj("chkUseDocModel") != null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setUseDocModel(getObj("chkUseDocModel"));
    }
    else if (getObj("chkUseDocModel") == null && areaName == "areaOfficeDoc" && getObj(areaName).value == "1")
    {
        setDisplayDocModel();
    }
}

function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i <= 2; i++)
    {
        if (getObj("div" + i))
        {
            getObj("div" + i).style.display = "none";
        }
    }

    getObj("div" + index).style.display = "block";
}


function setDesc(areaName)
{
    if (getObj(areaName).value == "0")
    {
        getObj(areaName + '_desc').value = "";

        if (areaName == "areaLookInfo")
        {
            if (getObj("txtLookStationNames") != null && getObj("txtLookStationNames").value != "")
            {
                if (getObj(areaName + '_desc').value != "")
                {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅岗位(系统)：" + getObj("txtLookStationNames").value
            }

            if (getObj("txtLookDeptNames") != null && getObj("txtLookDeptNames").value != "")
            {
                if (getObj(areaName + '_desc').value != "")
                {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门(系统)：" + getObj("txtLookDeptNames").value
            }

            if (getObj("txtLookStation").value != "")
            {
                if (getObj(areaName + '_desc').value != "")
                {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅岗位：" + getObj("txtLookStation").value
            }

            if (getObj("txtLookDept").value != "")
            {
                if (getObj(areaName + '_desc').value != "")
                {
                    getObj(areaName + '_desc').value += "；";
                }
                getObj(areaName + '_desc').value += "送阅部门：" + getObj("txtLookDept").value
            }
        }
        else if (areaName == "areaFileInfo")
        {
            for (var i = 0; i < getObj("accessaryFile").rows.length; i++)
            {
                if (getObj(areaName + '_desc').value != "")
                {
                    getObj(areaName + '_desc').value += "；";
                }

                if (getObj("accessaryFile").rows[i].filetitle != undefined)
                {
                    getObj(areaName + '_desc').value += getObj("accessaryFile").rows[i].filetitle;
                }
            }
        }
    }
    else
    {
        getObj(areaName + '_desc').value = "";
    }
}


function validateSize(vtype)
{

    var rblAddClass = $("input[name$=rblAddClass][checked]");
    var addClass = rblAddClass.val();

    var rblPABType = $("input[name$=rblPABType][checked]");
    var PABType = rblPABType.val();

    if (addClass == "")
    {
        return alertMsg("登记类型不能为空。", getObj("rblAddClass"));
    }

    if (getObj("ddlCorp").value == "")
    {
        return alertMsg("公司不能为空。", getObj("ddlCorp"));
    }

    if (getObj("ddlExamPlan").value == "")
    {
        return alertMsg("请选择考核计划！", getObj("ddlExamPlan"));
    }

    if (getObj("txtPABName").value == "")
    {
        return alertMsg("考核标题不能为空。", getObj("txtPABName"));
    }

    if (getObj("ddlStation").value == "")
    {
        return alertMsg("起草岗位不能为空。", getObj("ddlStation"));
    }

    if (getObj("txtPABNo").value == "")
    {
        return alertMsg("考核编号不能为空。", getObj("txtPABNo"));
    }

    if (PABType != "O" && PABType != "S")
    {
        return alertMsg("请选择报批类型。", getObj("rblPABType"));
    }

    if (addClass == "N")
    {
        if (getObj("rblUrgency").value == "")
        {
            return alertMsg("紧急程度不能为空。", getObj("rblUrgency"));
        }
    }
    else
    {
        if (getObj("txtOldPABNo").value == "")
        {
            return alertMsg("直接登记时内部编号不能为空。", getObj("txtOldPABNo"));
        }
    }

    // 只有在正式提交时才验证自定义表单信息
    if (vtype == "1")
    {
        // 自定义表单信息
        if ((!formValidate() || !flowValidate()))
        {
            return false;
        }
    }

    if (!saveDocModel())
    {
        return alertMsg("正文文档保存失败。", getObj("chkUseDocModel"));
    }

    var table = tbPerformanceBill;
    var objIDs = $(table).find("input[type=checkbox]");
    var IDs = [];
    objIDs.each(function (i)
    {
        if (this.value.length >= 36)
        {
            IDs.push(this.value);
        }
    });
    var EPSIDs = IDs.join();

    if (EPSIDs.length == 0)
    {
        alert("请添加报批范围（考核对象）。");
        return false;
    }

    getObj("hidEPSIDs").value = EPSIDs;

    /*  要执行改方法的按钮都是需要提交数据的，为了避免重复点击按钮导致数据多次提交，
    故在执行此函数是，disable所有需要提交数据的按钮。
    这些按钮会在postback之后被enable。
    */

    //alert(a);

    disabledButtonsWhenSubmit();

    return true;
}


//选择多岗位（公司）
function selectMultiStationByCorp(aim)
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiStation.aspx?Aim=' + aim + '&CorpID=' + getObj('hidCorpID').value, 900, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid" + aim + "ID").value = vValue.split('|')[0];
        getObj("txt" + aim).value = vValue.split('|')[1];
    }
}
//选择多部门（公司）
function selectMultiDeptByCorp(aim)
{
    var vValue = openModalWindow('../../../Common/Select/VSelectMultiDept.aspx?Aim=' + aim + '&CorpID=' + getObj('hidCorpID').value, 900, 600);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hid" + aim + "ID").value = vValue.split('|')[0];
        getObj("txt" + aim).value = vValue.split('|')[1];
    }
}


function disabledButtonsWhenSubmit()
{
    setBtnEnabled("btnSaveNotSumbit,btnPrevious,btnNext,btnSaveOpen,btnSaveClose", false);
}


function ddlExamPlan_change()
{
    getObj("hidExamID").value = getObj("ddlExamPlan").value

    clearPerformanceBill();
}



//用于清空考核范围列表
function clearPerformanceBill()
{
    var cbk = $(tbPerformanceBill).find("input[type=checkbox]");
    if (cbk.length > 0)
    {
        cbk[0].checked = "checked";
        selectTableAll(tbPerformanceBill, cbk[0])
        deletePerformanceBill();
        cbk[0].checked = "";
    }
}


// 通过传入参数，构造jqGrid不同的字段，用以表现不同内容。
// type: 可传入"KPI","Behavior","Progress",根据该参数jqGrid讲呈现不同的内容和字段
function showPerformanceBillDetailList(type)
{
    var jqObj = $("#jqPerformanceBillDetailList");
    /* 判断jqGrid对象是否正确获得 */
    if (!jqObj || typeof jqObj.jqGrid != "function")
    {
        return false;
    }

    var div0 = getObj("div0"),
        div1 = getObj("div1"),
        div2 = getObj("div2");

    if (!div0 || !div1 || !div2)
    {
        return false;
    }

    switch (type.toLocaleLowerCase())
    {
        case "kpi":
            div0.style.display = "";
            div1.style.display = "none";
            div2.style.display = "none";
            break;
        case "behavior":
            div0.style.display = "none";
            div1.style.display = "";
            div2.style.display = "none";
            break;
        case "progress":
            div0.style.display = "none";
            div1.style.display = "none";
            div2.style.display = "";
            break;
        default:
            break;
    }
}