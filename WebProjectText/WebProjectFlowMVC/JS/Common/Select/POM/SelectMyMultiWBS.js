// JScript 文件
//基础数据
function InitData(planType)
{
    if (arguments.length == 1)
    {
        /*
            getObj("hidFromType").value == "0": 任务执行报告
            getObj("hidFromType").value == "1": 公司部门工作报告
            getObj("hidFromType").value == "2": 公司部门工作检查报告
        */

        //根据来源控制各个选项卡的显示或隐藏
        if (getObj("hidFromType").value == "0" || getObj("hidFromType").value == "1")
        {
            if (getObj("hidFromType").value == "0")
            {
                getObj("hlMDoc").style.display = "none";
                getObj("hlQSDoc").style.display = "none";
            }
        }
        else if (getObj("hidFromType").value == "2")
        {
            getObj("hlDDoc").style.display = "none";
            getObj("hlSPDoc").style.display = "none";
            getObj("hlHDoc").style.display = "none";
            getObj("hlMDoc").style.display = "none";
            getObj("hlQSDoc").style.display = "none";
        }

        //开发计划和专项计划
        if (planType == "0" || planType == "2" || planType == "5" || planType == "6" || planType == "7")
        {
            //项目
            getObj("selectProject").style.display = "";
            getObj("selectDept").style.display = "none";
            getObj("tbProDept").style.display = "none";
            //加载项目
            //resetProject(getObj("hidCorpID").value);
            //计划日期
            getObj("tbPlanDate").style.display = "";
            getObj("tbPlanMonth").style.display = "none";
        }
        if (planType == "1" || planType == "3")
        {
            //部门
            getObj("selectDept").style.display = "";
            getObj("selectProject").style.display = "none";
            getObj("tbProDept").style.display = "none";
            //加载部门
            //resetDept(getObj("hidCorpID").value);
            //计划月份
            getObj("tbPlanMonth").style.display = "";
            getObj("tbPlanDate").style.display = "none";
        }
        //分解计划
        if (planType == "4")
        {
            //项目/部门
            getObj("tbProDept").style.display = "";
            getObj("selectProject").style.display = "none";
            getObj("selectDept").style.display = "none";
            //计划日期
            getObj("tbPlanDate").style.display = "";
            getObj("tbPlanMonth").style.display = "none";
        }
        var remindDetail = getObj('hidRemindDetail').value;
        if (remindDetail != null)
        {
            // 主项计划
            if (remindDetail.substr(0, 1) == 'N')
            {
                getObj('hlPDoc').style.display = 'none';
            }
            // 职能计划
            if (remindDetail.substr(2, 1) == 'N')
            {
                getObj('hlCDoc').style.display = 'none';
            }
            // 专项计划
            if (remindDetail.substr(1, 1) == 'N')
            {
                getObj('hlSDoc').style.display = 'none';
            }
            // 部门月度计划
            if (remindDetail.substr(3, 1) == 'N')
            {
                getObj('hlDDoc').style.display = 'none';
            }
            // 分解计划
            if (remindDetail.substr(4, 1) == 'N')
            {
                getObj('hlSPDoc').style.display = 'none';
            }
            // 阶段性成果
            if (remindDetail.substr(5, 1) == 'N')
            {
                getObj('hlHDoc').style.display = 'none';
            }
            // 会议决策
            if (remindDetail.substr(6, 1) == 'N')
            {
                getObj('hlMDoc').style.display = 'none';
            }
            // 质量安全
            if (remindDetail.substr(7, 1) == 'N')
            {
                getObj('hlQSDoc').style.display = 'none';
            }
        }

        if ((getObj("hidFromType").value == "0" && remindDetail.substr(0, 6) == 'NNNNNN')
            || (getObj("hidFromType").value == "1" && remindDetail.substr(0, 8) == 'NNNNNNNN')
            || (getObj("hidFromType").value == "2" && remindDetail.substr(0, 3) == 'NNN'))
        {
            alert('请先启用模块。');
            window.close();
        }
        else
        {
            planType = remindDetail.indexOf('Y');
            getObj("hidPlanType").value = planType;
        }
    }

    // 调用这个方法，显示所选中的项
    selectTab(planType, "TabInfo");

    for (var i = 0; i < 8; i++)
    {
        getObj("div" + i).style.display = "none";
    }
    getObj("div" + planType).style.display = "";

    filterData();
}

function showCheckTab(index)
{
    getObj("hidPlanType").value = index;
    InitData(index, 0);
    // Jeremy's Annotation 2011-11-18
    //    var query = 
    //        {
    //            AjaxPlanType:index,
    //            CreateType: getObj("hidCreateType").value,
    //            AjaxFrom: getObj("hidFromType").value
    //            }; 
    //    reloadGridData("idPager", query);
}

function filterData()
{
    var query;
    var strProjectID = "";
    var strDeptID = "";
    var strPDID = "";
    var vYear = "";
    var vMonth = "";
    var strKeyWord = getObj("txtKey").value;

    strProjectID = getObj("ddlProject").value;
    strDeptID = getObj("ddlDept").value;
    strPDID = getObj("hidPDID").value;

    //if (vYear.length > 1) 
    {
        vYear = $('#ddlMonth').val().split('-')[0];
        vMonth = $('#ddlMonth').val().split('-')[1];
    }
    var vStartTime = $("#txtStartTime").val();
    var vEndTime = $("#txtEndTime").val();

    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);

        if (date1 > date2)
        {
            return alertMsg("结束时间必须大于开始时间。", getObj("txtEndTime"));
        }
    }

    query = {
        AjaxPlanType: getObj("hidPlanType").value,
        CreateType: getObj("hidCreateType").value,
        AjaxProjectID: strProjectID,
        AjaxDeptID: strDeptID,
        PDID: strPDID,
        Year: vYear,
        Month: vMonth,
        StartTime: vStartTime,
        EndTime: vEndTime,
        KeyWord: strKeyWord
    }

    reloadGridData("idPager", query);
}

// 单击全选复选框
function selectAllData(chk)
{
    var chkArray = getObjs("chkIDV3");
    if (chkArray.length < 1)
    {
        return false;
    }
    for (var i = 0; i < chkArray.length; i++)
    {
        if (chkArray(i).checked != chk.checked)
        {
            chkArray(i).checked = chk.checked;
            selectRowFromSelectAll(chkArray(i));
        }
    }
}

function selectPD()
{
    openModalWindow('../../../Common/Select/VSelectProjectOrDept.aspx', 400, 450);
}