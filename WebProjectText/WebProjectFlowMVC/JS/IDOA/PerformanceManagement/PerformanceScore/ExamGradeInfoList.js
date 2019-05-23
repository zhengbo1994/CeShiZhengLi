function changeCorp(vCTID, vCID)
{
    var sCropID = $("#ddlCorp").val();

    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    if (sCropID != "")
    {
        $.post('FillData.ashx', { action: 'GetExamPlanByCorpID',
            "ExamFilter": 3,
            CorpID: sCropID,
            IsNoSelect: "N"
        }, function (data, textStatus)
        {
            loadDropDownList(data, "ddlExamPlan", vCTID + '|' + vCID);
            changeExamPlan();
        }, 'json');
    }
    else
    {
        loadDropDownList([], "ddlExamPlan", vCTID + '|' + vCID);
        changeExamPlan();
    }
}
function changeExamPlan(vCTID, vCID)
{
    var sExamID = $("#ddlExamPlan").val();
    $("#hidExamID").val(sExamID);

    if (vCTID == null)
    {
        vCTID = "";
    }

    if (vCID == null)
    {
        vCID = "";
    }

    var AccountID = $("#hidAccountID").val();
    var Permission = $("#hidPermission").val();

    if (sExamID != "")
    {
        $.post('FillData.ashx', { action: 'GetExamScopeOrgByExamID',
            ExamID: sExamID,
            Permission: Permission,
            AccountID: AccountID,
            IsTeamLeader: "Y",
            IsResultApproval: "Y",
            ScopeType: "O",
            ValueField: "EOID",
            IsNoSelect: "N"
        },
        function (data, textStatus)
        {
            loadDropDownList(data, "ddlExamOrg", vCTID + '|' + vCID, "无可见组织");
            changeEO();
        }, 'json');
    }
    else
    {
        loadDropDownList([], "ddlExamOrg", vCTID + '|' + vCID);
        changeEO();
    }
}
function changeEO()
{
    var ddlExamOrg = $("#ddlExamOrg"),
        sEOID = ddlExamOrg.val(),
        index = ddlExamOrg.attr('selectedIndex'),
        couldOpt = getCouldOpt(index);

    $("#hidEOID").val(sEOID);

    if (couldOpt == "1")
    {
        showOptBtns();
    }
    else
    {
        hideOptBtns();
    }
}

function getCouldOpt(index)
{
    var hidCouldOpt = $("#hidCouldOpt"),
        jsonCouldOpt = hidCouldOpt.val().split(",");

    // json数组的个数等于下拉框有效选项（不包括“请选择”）的数量，所以json的索引比下拉框小1。
    if (isNaN(index) || !index || index > jsonCouldOpt.length)
    {
        return 0;
    }
    else
    {
        return jsonCouldOpt[index - 1];
    }
}

// 绑定下拉框
var loadDropDownList = function (data, id, vID, noRowText)
{
    var ddl = getObj(id),
        strNoRowText = !!noRowText ? noRowText : "请选择",
        hidCouldOpt = $("#hidCouldOpt"),
        jsonCouldOpt = [];

    ddl.options.length = 0;

    $(data).each(function (i, d)
    {
        var opt = document.createElement("option");
        opt.value = d.value;
        opt.text = d.text;
        ddl.add(opt, ddl.length);

        if (id == "ddlExamOrg" && typeof d.CurrentUserIsTeamLeader == "string")
        {
            jsonCouldOpt.push(d.CurrentUserIsTeamLeader);
        }
    });
    if (id == "ddlExamOrg")
    {
        hidCouldOpt.val(jsonCouldOpt.join());
    }

    if (ddl.options.length > 0)
    {
        if (vID.split('|')[0] != "")
        {
            ddl.value = vID.split('|')[0];
        }
    }
    else
    {
        $("<option value=''>" + strNoRowText + "</option>").appendTo(ddl);
    }
}
function loadEOInfo()
{
    var strExamID = $("#hidExamID").val();
    var strEOID = $("#hidEOID").val();

    ajaxRequest("VExamGradeInfoList.aspx", { AjaxRequest: true,
        action: "getEOInfo",
        ExamID: strExamID,
        EOID: strEOID
    }, "html",
            function (data)
            {
                var json = $.parseJSON(data),
                EOName = "", LevelName = "", IsGraded = "", GradeStatus = "", TotalPersonsCount = "";

                if (!!json && !!json.length && typeof json[0].EOName != "undefined")
                {
                    EOName = json[0].EOName;
                    LevelName = json[0].LevelName == "" ? "组织负责人未评分，暂时按最低等级计算" : json[0].LevelName;
                    IsGraded = json[0].IsGraded == "Y" ? "Y" : "N";
                    GradeStatus = IsGraded == "Y" ? "已锁定分布" : "未锁定分布";
                    TotalPersonsCount = json[0].TotalPersonsCount;
                }

                $("#txtEOName").val(EOName);
                $("#txtEOLevelName").val(LevelName);
                $("#hidIsGraded").val(IsGraded);
                $("#txtOrgGradeStatus").val(GradeStatus);
                $("#txtOrgTotalPersonsCount").val(TotalPersonsCount);
            });
}
function loadGradeInfoList()
{
    var strExamID = $("#hidExamID").val();
    var strEOID = $("#hidEOID").val();

    ajaxRequest("VExamGradeInfoList.aspx", { AjaxRequest: true,
        action: "getGradeList",
        ExamID: strExamID,
        EOID: strEOID
    }, "html",
    function (data)
    {
        var tdBtnArea = $("#tdBtnArea");
        var btnLock = $("#btnLock");
        var btnCancelLock = $("#btnCancelLock");
        var isGraded = $("#hidIsGraded").val();
        if (data == "")
        {
            tdBtnArea.hide();
        } else
        {
            if (isGraded == "Y")
            {
                btnLock.hide();
                btnCancelLock.show();
            }
            else
            {
                btnLock.show();
                btnCancelLock.hide();
            }

            tdBtnArea.show();
        }
        $("#tdOrgGradeInfo div").html(data);
    });
}

// 进行评分修改
function editScores(EPSID, StruName)
{
    var hidIsGraded = $("#hidIsGraded");
    if (hidIsGraded.val() == "N")
    {
        var url = "VPerformanceScoreScopeEdit.aspx?EPSID=" + EPSID +
            "&StruName=" + encodeURI(StruName) + "&HasDone=N";

        openWindow(url, 900, 600);
    }
    return false;
}
function refreshExamOrgGradeMain()
{
    loadGradeInfoList();
}

function showOptBtns()
{
    var btnLock = $("#btnLock").parent().parent();
    var btnCancelLock = $("#btnCancelLock").parent().parent();
    btnLock.css('visibility', '');
    btnCancelLock.css('visibility', '');
}
function hideOptBtns()
{
    var btnLock = $("#btnLock").parent().parent();
    var btnCancelLock = $("#btnCancelLock").parent().parent();
    btnLock.css('visibility', 'hidden');
    btnCancelLock.css('visibility', 'hidden');
}
function updateExamOrgIsGradedStatus(opt)
{
    var strExamID = $("#hidExamID").val();
    var strEOID = $("#hidEOID").val();
    var strSuccessMsg = opt == "lock" ? "锁定分布成功" : "解除锁定成功";
    var targetIsGradedStatus = opt == "lock" ? "Y" : "N";

    // 更新考核组织的强制分布状态
    ajaxRequest("VExamGradeInfoList.aspx", { AjaxRequest: true,
        action: "updateExamOrgIsGraded",
        ExamID: strExamID,
        EOID: strEOID,
        Opt: opt
    }, "html",
    function (data)
    {
        if (data == "")
        {
            $("#hidIsGraded").val(targetIsGradedStatus);
            alert(strSuccessMsg);
            loadEOInfo();
            loadGradeInfoList();
        }
        else
        {
            alert(data);
        }
        return false;
    });
}
