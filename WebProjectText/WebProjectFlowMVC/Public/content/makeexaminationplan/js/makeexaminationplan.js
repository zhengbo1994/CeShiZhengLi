
'use strict'
$(function () {

    var controllerName = "MakeExaminationPlan";
    var $examPlan_QueryArea = $('#divExamPlan_QueryArea');
    var $gridExamPlan = $("#gridExamPlan_main");
    var $pagerExamPlan = $("#pagerExamPlan_main");
    var $gridEmployeeAssign2ExamPlan = $("#gridEmployeeAssign2ExamPlan");
    var $gridEmployeeAssign2ExamPlanResult = $("#gridEmployeeAssign2ExamPlanResult");
    var $pagerEmployeeAssign2ExamPlan = $("#pageEmployeeAssign2ExamPlan");

    var $divMakeExamPlan_AutoAssign = $("#divMakeExamPlan_AutoAssign");
    var $mdlMakeExamPlan_AutoAssign = $("#mdlMakeExamPlan_AutoAssign");

    var $mdlMakeExamPlan_ManualAssign = $("#mdlMakeExamPlan_ManualAssign");
    var $divMakeExamPlan_ManualAssign = $("#divMakeExamPlan_ManualAssign");

    var $mdlEmployeeFileUpload = $("#mdlEmployee_FileUpload");
    var $mdlEnterpriseInfo = $("#mdlEmployee_EnterpriseInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshExamPlanGrid = function () {
        $gridExamPlan.trigger("reloadGrid");

    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridExamPlan.jqGrid("getGridParam", "selrow");
        }
        selRowId = rowid;
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridExamPlan.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }
    //初始化查询区域
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnMakeExaminationPlan_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($examPlan_QueryArea)
                $gridExamPlan.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
        setInputAsDatetimePlug($examPlan_QueryArea.find("[name='ExamDatetimeBegin']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($examPlan_QueryArea.find("[name='ExamDatetimeEnd']"), "yyyy-mm-dd hh:ii");
    }

    //初始化考试计划表格
    var initExamPlanGrid = function () {

        var queryData = {};
        var divQueryArea = $examPlan_QueryArea;
        queryData = getJson(divQueryArea)
        $gridExamPlan.jqGrid({
            url: "/" + controllerName + "/GetExamPlanRecoderListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["ExamPlanId", "考试计划流水号", "考试开始时间", "考试结束时间", "考试人数", "提交状态", "操作"],
            colModel: [
                    { name: "ExamPlanId", index: "ExamPlanId", hidden: true },
                    { name: "ExamPlanNumber", index: "ExamPlanNumber", align: "center", width: 80 },
                    { name: "ExamDatetimeBegin", index: "ExamDatetimeBegin", align: "center", width: 80 },
                    { name: "ExamDatetimeEnd", index: "ExamDatetimeEnd", align: "center", width: 80 },
                    { name: "ExamCount", index: "ExamCount", align: "center", width: 80 },
                    { name: "SubmitStatus", index: "SubmitStatus", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                             + '<a href="#" title="修改考试计划" onclick="showExamPlan_ManualAssignModal(' + rowobj.ExamPlanId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon  fa fa-edit"></i> 修改考试计划</a>'
                              + '<a href="#" title="提交考试计划" onclick="btnExamPlan_Submit(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon  fa fa-check"></i> 提交考试计划</a>'
                            return buttons;
                        }
                    },

            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerExamPlan,
            ondblClickRow: function (rowid, iRow, iCol, e) {
                $gridExamPlan.jqGrid("toggleSubGridRow", rowid);
            },
            subGrid: true,
            subGridOptions: {
                "plusicon": "ace-icon fa fa-plus",
                "minusicon": "ace-icon fa fa-minus",
                "openicon": "ace-icon fa fa-share",
            },
            subGridRowExpanded: function (subgrid_id, row_id) {
                var subgrid_table_id, pager_id;
                var rowData = $gridExamPlan.jqGrid("getRowData", row_id);
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = getJson($examPlan_QueryArea);
                subGridQueryData.ExamPlanNumber = rowData.ExamPlanNumber;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetEmployeeForExamPlanRecoderListForJqgrid",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["人员ID", "考试座位号", "考核点", "考场名称", "企业名称", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目"],
                    colModel: [
                        { name: "EmployeeId", index: "EmployeeId", width: "30", align: "center", hidden: true },
                        { name: "ExamSeatNumber", index: "ExamSeatNumber", width: "30", align: "center", },
                        { name: "TrainingInstitutionName", index: "TrainingInstitutionName", width: "50", align: "center", },
                        { name: "ExamRoomName", index: "ExamRoomName", width: "30", align: "center", },
                        { name: "EnterpriseName", index: "EnterpriseName", width: "50", align: "center" },
                        { name: "EmployeeName", index: "EmployeeName", width: "50", align: "center" },
                        { name: "Sex", index: "Sex", width: "40", align: "center" },
                        { name: "Age", index: "Age", width: "50", align: "center" },
                        { name: "IDNumber", index: "IDNumber", width: "80", align: "center" },
                        { name: "Job", index: "Job", width: "50", align: "center" },
                        { name: "Title4Technical", index: "Title4Technical", width: "50", align: "center" },
                        { name: "Industry", index: "Industry", width: "50", align: "center" },
                        { name: "ExamType", index: "ExamType", width: "50", align: "center" }
                    ],
                    autoWidth: true,
                    scroll: 1,
                    rowNum: 9999,
                    //pager: "#p_" + subgrid_table_id,                
                    //rowList: [10, 20, 30], 
                    //sortname: "CheckTime",
                    //sortorder: "desc",
                    //height: "100%",
                    //viewrecords: true,
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        return false;
                    },
                    loadComplete: function () {
                        jqGridAutoWidth();
                    }
                });
            },
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                setGridHeight($gridExamPlan.selector);
                jqGridAutoWidth();

            }
        });


    }

    var getExamPlanNumber = function () {
        var examPlanNumber = "";
        var ajaxOpt = {
            url: "/" + controllerName + "/GetExamPlanNumber",
            data: { DateTime: Date().toString() },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jdata) {
                examPlanNumber = jdata;
            }
        };
        ajaxRequest(ajaxOpt);
        return examPlanNumber;
    }

    //获取待分配的考生人数
    var getNotInExamPlanCount = function () {
        var notInExamPlanCount = 0;
        var ajaxOpt = {
            url: "/" + controllerName + "/GetNotInExamPlanCount",
            data: { DateTime: Date().toString() },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jdata) {

                notInExamPlanCount = jdata;
            }
        };
        ajaxRequest(ajaxOpt);
        return notInExamPlanCount;
    }

    //获取考试计划
    var getExamPlan = function (examPlanId) {
        var examPlanInfo = {}
        var ajaxOpt = {
            url: "/" + controllerName + "/GetExamPlanInfo",
            data: { ExamPlanId: examPlanId },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jdata) {
                if (jdata.IsSuccess === false) {
                    alert(jdata.ErrorMessage);

                }
                else {
                    examPlanInfo = jdata;
                }
            }
        };
        ajaxRequest(ajaxOpt);
        return examPlanInfo;
    }

    //初始化按钮区域
    var initButtonArea = function () {
        //显示手动分配 modal
        var showExamPlan_ManualAssignModal = function (examPlanId) {

            //先清空modal
            var modalData = getJson($divMakeExamPlan_ManualAssign);
            for (var p in modalData) {
                $divMakeExamPlan_ManualAssign.find("[name='" + p + "']").val("");
            }
            if (!examPlanId) {
                var examPlanNumber = getExamPlanNumber();
                $divMakeExamPlan_ManualAssign.find("[name='ExamPlanNumber']").val(examPlanNumber);
            }
            else {//加载考场信息
                var examPlan = getExamPlan(examPlanId);
                setJson($divMakeExamPlan_ManualAssign, examPlan);
                $divMakeExamPlan_ManualAssign.find("select[name='TrainingInstitutionId']").change();
                $divMakeExamPlan_ManualAssign.find("select[name='ExamRoomId']").val(examPlan.ExamRoomId);
            }
            var notInExamPlanCount = getNotInExamPlanCount();
            $divMakeExamPlan_ManualAssign.find("[name='NotInExamPlanCount']").text(notInExamPlanCount);
            calculateExamTimeSpan(enum_MakeExamPlanTypes.Manual);

            $mdlMakeExamPlan_ManualAssign.modal("toggle");

            clearEmployeeAssign2ExamPlanResultGrid();
            //加载数据
            refreshEmployeeAssign2ExamPlanGrid();

        };
        window.showExamPlan_ManualAssignModal = showExamPlan_ManualAssignModal;
        //显示自动分配 modal
        var showExamPlan_AutoAssignModal = function (examPlanId) {
            var modalData = getJson($divMakeExamPlan_AutoAssign);
            for (var p in modalData) {
                $divMakeExamPlan_AutoAssign.find("[name='" + p + "']").val("");
            }
            var notInExamPlanCount = getNotInExamPlanCount();
            $divMakeExamPlan_AutoAssign.find("[name='NotInExamPlanCount']").text(notInExamPlanCount);
            calculateExamTimeSpan(enum_MakeExamPlanTypes.Auto);
            $mdlMakeExamPlan_AutoAssign.modal("toggle");
        };
        var initExamPaln_AutoAssign = function () {
            $("#btnExamPaln_AutoAssign").on("click", function () {
                showExamPlan_AutoAssignModal();
            });

        };
        var initExamPaln_ManualAssign = function () {
            $("#btnExamPaln_ManualAssign").on("click", function () {
                showExamPlan_ManualAssignModal();
            });

        };

        var RegisterExam = function (examPlanId) {
            var examCoreExamId = 0;
            try {
                var ExamPlanData = {};
                var getExamPlanAjaxOpt = {
                    url: "/" + controllerName + "/GetPostExamData",
                    data: { "examPlanId": examPlanId },
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.resultMessage.IsSuccess == true) {
                            ExamPlanData = jdata;
                        }
                        else {
                            throw new Error("获取考试计划注册信息出错\r\n" + jdata.resultMessage.ErrorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        throw new Error("获取考试计划信息失败\r\n" + textStatus);
                    }
                };
                ajaxRequest(getExamPlanAjaxOpt);
                var postExamData = {};
                postExamData.TimeLimitFlag = ExamPlanData.TimeLimitFlag;
                postExamData.ExamBeginTime = ExamPlanData.ExamBeginTime;
                postExamData.ExamEndTime = ExamPlanData.ExamEndTime;
                postExamData.ExamResultUrl = ExamPlanData.ExamResultUrl;
                postExamData.ReturnUrl = ExamPlanData.ReturnUrl;
                postExamData.ExamTakerInfoList = ExamPlanData.ExamTakerInfoList;
                postExamData.PaperList = ExamPlanData.PaperList;
                var ajaxOpt = {
                    url: ExamPlanData.ExamRegisterUrl,
                    data: { "apipara": JSON.stringify(postExamData) },
                    type: "post",
                    dataType: "json",
                    async: false,
                    // crossDomain:true,
                    success: function (jdata) {
                        examCoreExamId = jdata;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var errormsg = "考试计划注册失败\r\n" + textStatus;
                        alert(errormsg);

                        throw new Error(errormsg);
                    }
                };
                //jQuery.support.cors = true;
                ajaxRequest(ajaxOpt);
            }
            catch (ex) {
                examCoreExamId = 0;
            }
            return examCoreExamId;
        };
        window.btnExamPlan_Submit = function (rowId) {

            var rowData = $gridExamPlan.jqGrid("getRowData", rowId);
            var examPlanId = rowData.ExamPlanId
            if (!examPlanId) {
                return false;
            }
            var submitStatus = rowData.SubmitStatus;
            if (submitStatus == "已提交") {
                alert("已经提交,不能再提交！");
                return false;
            }
            var examCoreExamId = RegisterExam(examPlanId);
            if (examCoreExamId == 0) {
                return false;
            }
            //if (!confirm("考试计划提交后不能修改\r\t确定提交考试计划吗？")) {
            //    return false;
            //}
            var postData = {};
            postData.examPlanId = examPlanId;
            postData.examCoreExamId = examCoreExamId;
            var ajaxOpt = {
                url: "/" + controllerName + "/SubmitExamPlan",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("提交成功！");
                        $gridExamPlan.jqGrid().trigger("reloadGrid");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        }

        initExamPaln_AutoAssign();
        initExamPaln_ManualAssign();
    }

    var calculateExamTimeSpan = function (enum_MakeExamPlanType) {
        var $formContainer = "";
        if (enum_MakeExamPlanType == enum_MakeExamPlanTypes.Auto) {
            $formContainer = $divMakeExamPlan_AutoAssign;
        }
        else if (enum_MakeExamPlanType == enum_MakeExamPlanTypes.Manual) {
            $formContainer = $divMakeExamPlan_ManualAssign;
        }
        var examDateTimeBegin = $formContainer.find("[name='ExamDateTimeBegin']").val();
        var aExamDateTimeEnd = $formContainer.find("[name='AExamDateTimeEnd']").val();
        var bExamDateTimeBegin = $formContainer.find("[name='BExamDateTimeBegin']").val();
        var examDateTimeEnd = $formContainer.find("[name='ExamDateTimeEnd']").val();
        if (!isNull(examDateTimeBegin) && !isNull(aExamDateTimeEnd))//计算安全知识考试时长
        {
            examDateTimeBegin = examDateTimeBegin.replace(/-/g, "/");
            examDateTimeBegin = new Date(examDateTimeBegin);
            aExamDateTimeEnd = aExamDateTimeEnd.replace(/-/g, "/");
            aExamDateTimeEnd = new Date(aExamDateTimeEnd);
            var safetyKnowledgeExamTimeSpan = aExamDateTimeEnd - examDateTimeBegin;
            var str_SafetyKnowledgeExamTimeSpan = parseInt(safetyKnowledgeExamTimeSpan / (1000 * 60)) + "分钟";
            $formContainer.find("[name='SafetyKnowledgeExamTimeSpan']").text(str_SafetyKnowledgeExamTimeSpan);
        }
        else {
            $formContainer.find("[name='SafetyKnowledgeExamTimeSpan']").text("----");
        }
        if (!isNull(bExamDateTimeBegin) && !isNull(examDateTimeEnd))//计算管理能力考试时长
        {
            bExamDateTimeBegin = bExamDateTimeBegin.replace(/-/g, "/");
            bExamDateTimeBegin = new Date(bExamDateTimeBegin);
            examDateTimeEnd = examDateTimeEnd.replace(/-/g, "/");
            examDateTimeEnd = new Date(examDateTimeEnd);
            var managementAbilityExamTimeSpan = examDateTimeEnd - bExamDateTimeBegin;
            var str_ManagementAbilityExamTimeSpan = parseInt(managementAbilityExamTimeSpan / (1000 * 60)) + "分钟";
            $formContainer.find("[name='ManagementAbilityExamTimeSpan']").text(str_ManagementAbilityExamTimeSpan);
        }
        else {
            $formContainer.find("[name='ManagementAbilityExamTimeSpan']").text("----");
        }

    }

    //制定考试计划 自动分配
    var initExamPlan_AutoAssignModal = function () {
        //初始化 form验证
        var initFormVerify = function () {

            var $arrInput = $divMakeExamPlan_AutoAssign.find("input,textarea,select");
            for (var i = 0; i < $arrInput.length; i++) {
                var $input = $($arrInput[i]);


                var verifyTypes = $input.data("verify");

                if (verifyTypes && $.trim(verifyTypes) != "") {



                    $input.on("focus", function () {
                        var $focusInput = $(this);
                        $focusInput.tooltip('destroy');
                    })

                    $input.on("blur", function () {
                        var $blurInput = $(this);
                        verifyInput($blurInput, function ($errInput) {
                            var errorMessage = $errInput.data("verify-errormessage");
                            $errInput.tooltip({ html: true, title: errorMessage }).tooltip('show')

                        })

                    })
                }
            }

        }
        //初始化 考核点
        var initTrainingInstitutionList = function () {
            var $TrainingInstitutionSelect = $divMakeExamPlan_AutoAssign.find("[name='TrainingInstitutionId']");
            var getTrainingInstitutionListByCityList = function () {
                var dataResult = {
                };
                ajaxRequest({
                    url: "/" + controllerName + "/GetTrainingInstitutionListByCiyList",
                    type: "post",
                    data: { dateTime: Date().toString() },
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function () {
                        dataResult = null;
                    }
                });
                return dataResult;
            }
            var trainingInstitutionList = getTrainingInstitutionListByCityList();

            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择考核点");
            $TrainingInstitutionSelect.append($optionAll);
            for (var i = 0; i < trainingInstitutionList.length; i++) {
                var trainingInstitution = trainingInstitutionList[i];
                var $option = $("<option>");
                $option.val(trainingInstitution.TrainingInstitutionId);
                $option.text(trainingInstitution.TrainingInstitutionName);
                $TrainingInstitutionSelect.append($option);
            }
        }
        //初始化保存按钮
        var initSaveButton = function () {
            $("#divMakeExamPlan_AutoAssignSave").on("click", function () {
                var checkResult = verifyForm($divMakeExamPlan_AutoAssign);
                if (!checkResult) {
                    return;
                }
                ////验证考试时间
                //var examDateTimeBegin = $divMakeExamPlan_AutoAssign.find("[name='ExamDateTimeBegin']").val();
                //examDateTimeBegin = new Date(examDateTimeBegin.replace(/-/g, "/"));
                //var aExamDateTimeEnd = $divMakeExamPlan_AutoAssign.find("[name='AExamDateTimeEnd']").val();
                //aExamDateTimeEnd = new Date(aExamDateTimeEnd.replace(/-/g, "/"));
                //var bExamDateTimeBegin = $divMakeExamPlan_AutoAssign.find("[name='BExamDateTimeBegin']").val();
                //bExamDateTimeBegin = new Date(bExamDateTimeBegin.replace(/-/g, "/"));
                //var examDateTimeEnd = $divMakeExamPlan_AutoAssign.find("[name='ExamDateTimeEnd']").val();
                //examDateTimeEnd = new Date(examDateTimeEnd.replace(/-/g, "/"));

                //if (aExamDateTimeEnd - examDateTimeBegin < 0) {
                //    alert("安全知识考试【结束时间】不能早于【开始时间】");
                //    return false;
                //}
                //if (bExamDateTimeBegin - aExamDateTimeEnd < 0) {
                //    alert("【管理能力考试开始时间】不能早于【安全知识开始结束时间】");
                //    return false;
                //}
                //if (examDateTimeEnd - bExamDateTimeBegin < 0) {
                //    alert("管理能力考试【结束时间】不能早于【开始时间】");
                //    return false;
                //}

                var postData = getJson($divMakeExamPlan_AutoAssign);
                ajaxRequest({
                    url: "/" + controllerName + "/MakeExamPlanAndAutoAssign",
                    data: postData,
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshExamPlanGrid();
                                var notInExamPlanCount = getNotInExamPlanCount();
                                $divMakeExamPlan_AutoAssign.find("[name='NotInExamPlanCount']").text(notInExamPlanCount);
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }

        var initCalculateExamTimeSpan = function () {
            $divMakeExamPlan_AutoAssign.find("[name='ExamDateTimeBegin'],[name='AExamDateTimeEnd'],[name='BExamDateTimeBegin'],[name='ExamDateTimeEnd']").on("change", function () {
                calculateExamTimeSpan(enum_MakeExamPlanTypes.Auto);
            });
        }

        setInputAsDatetimePlug($divMakeExamPlan_AutoAssign.find("[name='ExamDateTimeBegin']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($divMakeExamPlan_AutoAssign.find("[name='AExamDateTimeEnd']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($divMakeExamPlan_AutoAssign.find("[name='BExamDateTimeBegin']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($divMakeExamPlan_AutoAssign.find("[name='ExamDateTimeEnd']"), "yyyy-mm-dd hh:ii");

        initTrainingInstitutionList();
        initSaveButton();
        initFormVerify();
        // initCalculateExamTimeSpan();
    }

    //考试计划制定的类型
    var enum_MakeExamPlanTypes = {
        Auto: 0,
        Manual: 1
    }
    //刷新待选人员列表
    var refreshEmployeeAssign2ExamPlanGrid = function () {
        var queryData = {};
        var conditionStr = $("#divmakeexamplan_manualassignconditionstr").val();
        var examPlanNumber = $divMakeExamPlan_ManualAssign.find("[name='ExamPlanNumber']").val();
        var examRoomId = $divMakeExamPlan_ManualAssign.find("[name='ExamRoomId']").val();
        var trainingInstitutionId = $divMakeExamPlan_ManualAssign.find("[name='TrainingInstitutionId']").val();
        queryData.ConditionStr = conditionStr;
        queryData.ExamPlanNumber = examPlanNumber;
        queryData.ExamRoomId = examRoomId;
        queryData.TrainingInstitutionId = trainingInstitutionId;
        queryData.DateTime = Date().toString();
        var queryOpt = {
            url: "/" + controllerName + "/GetMakePlanEmployeeListForJqgrid",
            postData: queryData
        };
        $gridEmployeeAssign2ExamPlan.jqGrid("setGridParam", queryOpt).trigger("reloadGrid");

    }

    //清楚手动分配人员结果表数据
    var clearEmployeeAssign2ExamPlanResultGrid = function () {
        var rowIds = $gridEmployeeAssign2ExamPlanResult.jqGrid("getDataIDs");
        for (var i = 0; i < rowIds.length; i++) {
            var rowId = rowIds[i];
            $gridEmployeeAssign2ExamPlanResult.jqGrid('delRowData', rowId);
        }
    }

    //初始化制定考试计划 手动分配
    var initExamPlan_ManualAssignModal = function () {
        //初始化 form验证
        var initFormVerify = function () {

            var $arrInput = $divMakeExamPlan_ManualAssign.find("input,textarea,select");
            for (var i = 0; i < $arrInput.length; i++) {
                var $input = $($arrInput[i]);


                var verifyTypes = $input.data("verify");

                if (verifyTypes && $.trim(verifyTypes) != "") {



                    $input.on("focus", function () {
                        var $focusInput = $(this);
                        $focusInput.tooltip('destroy');
                    })

                    $input.on("blur", function () {
                        var $blurInput = $(this);
                        verifyInput($blurInput, function ($errInput) {
                            var errorMessage = $errInput.data("verify-errormessage");
                            $errInput.tooltip({ html: true, title: errorMessage }).tooltip('show')

                        })

                    })
                }
            }

        }

        var addRow_EmployeeAssign2ExamPlanResult = function (rowId, employeeAssign2ExamPlanRowData) {
            var resultLocalRow = $gridEmployeeAssign2ExamPlanResult.jqGrid("getRowData");
            if (arrContext(resultLocalRow, "EmployeeId", employeeAssign2ExamPlanRowData.EmployeeId) < 0) {
                var resultRowData = {};
                resultRowData.EmployeeId = employeeAssign2ExamPlanRowData.EmployeeId;
                resultRowData.EmployeeName = employeeAssign2ExamPlanRowData.EmployeeName;
                resultRowData.IDNumber = employeeAssign2ExamPlanRowData.IDNumber;
                resultRowData.EnterpriseName = employeeAssign2ExamPlanRowData.EnterpriseName;
                //将选中的人放到右边表格
                $gridEmployeeAssign2ExamPlanResult.jqGrid('addRowData', rowId, resultRowData);
            }
        }

        //移除结果表里的数据
        var deleteRow_EmployeeAssign2ExamPlanResult = function (employeeId) {
            var employeeAssign2ExamPlanResultRowIDs = $gridEmployeeAssign2ExamPlanResult.jqGrid('getDataIDs');
            for (var i = 0; i < employeeAssign2ExamPlanResultRowIDs.length; i++) {
                var rowId = employeeAssign2ExamPlanResultRowIDs[i];
                var rowData = $gridEmployeeAssign2ExamPlanResult.jqGrid('getRowData', rowId);
                if (employeeId == rowData.EmployeeId) {
                    //删除结果集的行
                    $gridEmployeeAssign2ExamPlanResult.jqGrid('delRowData', rowId);
                }
            }

            //将待选表的对应人员的check去掉选中
            var selarrrowIds = $gridEmployeeAssign2ExamPlan.jqGrid('getGridParam', 'selarrrow');
            for (var i = 0; i < selarrrowIds.length; i++) {
                var rowId = selarrrowIds[i];
                var employeeAssign2ExamPlanRowData = $gridEmployeeAssign2ExamPlan.jqGrid('getRowData', rowId);
                if (employeeAssign2ExamPlanRowData.EmployeeId == employeeId) {
                    $gridEmployeeAssign2ExamPlan.jqGrid('setSelection', rowId);
                    break;
                }
            }
        }
        window.makeExamPlan_deleteRowEmployeeAssign2ExamPlanResult = deleteRow_EmployeeAssign2ExamPlanResult;

        //将已分配的人 选中
        var setInExamPlanEmployeeChecked = function () {
            var rowIds = $gridEmployeeAssign2ExamPlan.jqGrid('getDataIDs');
            for (var i = 0; i < rowIds.length; i++) {
                var rowId = rowIds[i];
                var rowData = $gridEmployeeAssign2ExamPlan.jqGrid("getRowData", rowId);
                if (rowData.MakePlanStatus == "已安排") {
                    $gridEmployeeAssign2ExamPlan.jqGrid('setSelection', rowId);
                    addRow_EmployeeAssign2ExamPlanResult(rowId, rowData);
                }
            }
            setSelectedCount();
        }

        var setSelectedCount = function (rowIds, checkStatus) {
            if (!rowIds) {
                rowIds = [];
            }
            //如果是去掉选中的状态 则移除结果表的对应数据
            for (var i = 0; i < rowIds.length; i++) {
                var rowId = rowIds[i];
                var rowData = $gridEmployeeAssign2ExamPlan.jqGrid("getRowData", rowId);
                if (checkStatus) {
                    addRow_EmployeeAssign2ExamPlanResult(rowId, rowData);
                }
                else {
                    deleteRow_EmployeeAssign2ExamPlanResult(rowData.EmployeeId);
                }
            }
            var allResultRowData = $gridEmployeeAssign2ExamPlanResult.jqGrid('getDataIDs');
            //var selCount = $gridEmployeeAssign2ExamPlan.jqGrid("getGridParam", "selarrrow").length;

            $divMakeExamPlan_ManualAssign.find("[name='AssignedCount']").text(allResultRowData.length);

        }
        var getTrainingInstitutionList = function () {
            var dataResult = {
            };
            ajaxRequest({
                url: "/" + controllerName + "/GetTrainingInstitutionList",
                type: "post",
                data: { dateTime: Date().toString() },
                dataType: "json",
                async: false,
                success: function (jdata) {
                    dataResult = jdata;
                },
                error: function () {
                    dataResult = null;
                }
            });
            return dataResult;
        }

        //初始化 考核点
        var initTrainingInstitutionAndExamRoom = function () {
            var $TrainingInstitutionSelect = $divMakeExamPlan_ManualAssign.find("[name='TrainingInstitutionId']");
            var trainingInstitutionList = getTrainingInstitutionList();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择考核点");
            $TrainingInstitutionSelect.append($optionAll);
            for (var i = 0; i < trainingInstitutionList.length; i++) {
                var trainingInstitution = trainingInstitutionList[i];
                var $option = $("<option>");
                $option.val(trainingInstitution.TrainingInstitutionId);
                $option.text(trainingInstitution.TrainingInstitutionName);
                $TrainingInstitutionSelect.append($option);
            }
            var getExamRoomList = function (trainingInstitutionId) {
                var dataResult = {
                };
                ajaxRequest({
                    url: "/" + controllerName + "/GetExamRoomByTrainingInstitutionId",
                    type: "post",
                    data: { dateTime: Date().toString(), TrainingInstitutionId: trainingInstitutionId },
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function () {
                        dataResult = null;
                    }
                });
                return dataResult;
            }
            var initExamRoom = function (trainingInstitutionId) {
                var $examRoomSelect = $divMakeExamPlan_ManualAssign.find("[name='ExamRoomId']");
                var examRoomList = getExamRoomList(trainingInstitutionId);
                $examRoomSelect.empty();
                var $optionAll = $("<option>");
                $optionAll.val("");
                $optionAll.text("请选择考场");
                $examRoomSelect.append($optionAll);
                for (var i = 0; i < examRoomList.length; i++) {
                    var examRoom = examRoomList[i];
                    var $option = $("<option>");
                    $option.val(examRoom.ExamRoomId);
                    $option.text(examRoom.ExamRoomName);
                    $examRoomSelect.append($option);
                }
            }

            //考核点改变 考场联动
            $TrainingInstitutionSelect.on("change", function () {
                var trainingInstitutionId = $TrainingInstitutionSelect.val();
                initExamRoom(trainingInstitutionId);
            });
        }

        var initEmployeeAssign2ExamPlanGrid = function () {
            var queryData = {
            };

            $gridEmployeeAssign2ExamPlan.jqGrid({
                url: "/" + controllerName + "/GetEmptyJqGridResult",
                datatype: "json",
                multiselect: true,
                //multiboxonly: true,

                //postData: queryData,
                colNames: ["人员Id", "姓名", "性别", "年龄", "身份证号", "企业名称", "报考行业", "报考科目", "职务", "技术职称", "分配状态"],
                colModel: [
                { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                { name: "EmployeeName", index: "EmployeeName", align: "center", width: 60 },
                { name: "Sex", index: "Sex", align: "center", width: 20, hidden: true },
                { name: "Age", index: "Age", align: "center", width: 20, hidden: true },
                { name: "IDNumber", index: "IDNumber", align: "center", width: 130 },
                { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                { name: "Industry", index: "Industry", align: "center", width: 50 },
                { name: "ExamType", index: "ExamType", align: "center", width: 50 },
                { name: "Job", index: "Job", align: "center", width: 50 },
                { name: "Title4Technical", index: "Title4Technical", align: "center", width: 50 },
                { name: "MakePlanStatus", index: "MakePlanStatus", align: "center", width: 50 }
                ],
                autowidth: false,
                shrinkToFit: false,
                scroll: 1,
                height: 350,
                rowNum: 999,
                viewrecords: true,
                onSelectRow: function (rowid, status) {
                    var aRowids = [];
                    aRowids.push(rowid);
                    setSelectedCount(aRowids, status);
                },
                onSelectAll: function (aRowids, status) {
                    setSelectedCount(aRowids, status);
                },
                loadComplete: function () {
                    var table = this;
                    updatePagerIcons(table);
                    //jqGridAutoWidth();
                    setInExamPlanEmployeeChecked();
                    //setGridHeight($gridEmployeeAssign2ExamPlan.selector);
                }
            });
        }

        var initEmployeeAssign2ExamPlanResultGrid = function () {
            $gridEmployeeAssign2ExamPlanResult.jqGrid({
                datatype: "local",
                colNames: ["人员Id", "姓名", "身份证号", "企业名称", "移除"],
                colModel: [
                { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                { name: "EmployeeName", index: "EmployeeName", align: "center", width: 60 },
                { name: "IDNumber", index: "IDNumber", align: "center", width: 80 },
                { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 80 },
                {
                    name: '移除', index: '移除', width: 30, align: "center", formatter: function (cellvalue, options, rowobj) {
                        debugger;
                        var buttons = ''
                           + '<a href="#" title="移除" onclick="makeExamPlan_deleteRowEmployeeAssign2ExamPlanResult(\'' + rowobj.EmployeeId + '\')" style="padding: 7px;line-height: 1em;">'
                           + '<i class="ace-icon fa fa-trash"></i></a>'
                        return buttons;
                    }
                }
                ],
                rownumbers: true,
                autowidth: false,
                shrinkToFit: false,
                scroll: 1,
                height: 350,
                rowNum: 999,
                viewrecords: true,
                loadComplete: function () {
                    var table = this;
                    updatePagerIcons(table);
                    //jqGridAutoWidth();
                }
            });
        }

        var initEmployeeAssign2ExamPlanQueryBtn = function () {
            $("#btnEmployeeAssign2ExamPlan_Query").on("click", function () {
                refreshEmployeeAssign2ExamPlanGrid()
            });
        }

        var initSaveButton = function () {
            $("#btnExamPlan_ManualAssignComform").on("click", function () {
                var checkResult = verifyForm($divMakeExamPlan_ManualAssign);
                if (!checkResult) {
                    return;
                }
                ////验证考试时间
                //var examDateTimeBegin = $divMakeExamPlan_ManualAssign.find("[name='ExamDateTimeBegin']").val();
                //examDateTimeBegin = new Date(examDateTimeBegin.replace(/-/g, "/"));
                //var aExamDateTimeEnd = $divMakeExamPlan_ManualAssign.find("[name='AExamDateTimeEnd']").val();
                //aExamDateTimeEnd = new Date(aExamDateTimeEnd.replace(/-/g, "/"));
                //var bExamDateTimeBegin = $divMakeExamPlan_ManualAssign.find("[name='BExamDateTimeBegin']").val();
                //bExamDateTimeBegin = new Date(bExamDateTimeBegin.replace(/-/g, "/"));
                //var examDateTimeEnd = $divMakeExamPlan_ManualAssign.find("[name='ExamDateTimeEnd']").val();
                //examDateTimeEnd = new Date(examDateTimeEnd.replace(/-/g, "/"));

                //if (aExamDateTimeEnd - examDateTimeBegin < 0) {
                //    alert("安全知识考核【结束时间】不能早于【开始时间】");
                //    return false;
                //}
                //if (bExamDateTimeBegin - aExamDateTimeEnd < 0) {
                //    alert("【管理能力考试开始时间】不能早于【安全知识开始结束时间】");
                //    return false;
                //}
                //if (examDateTimeEnd - bExamDateTimeBegin < 0) {
                //    alert("管理能力考试【结束时间】不能早于【开始时间】");
                //    return false;
                //}

                var postData = getJson($divMakeExamPlan_ManualAssign);
                //将选择选中的人员Id加入进来
                // var getSelectedRowIdList = $gridEmployeeAssign2ExamPlan.jqGrid("getGridParam", "selarrrow");
                var getSelectedRowIdList = $gridEmployeeAssign2ExamPlanResult.jqGrid("getDataIDs");
                //if (getSelectedRowIdList.length < 1) {
                //    alert("请选择要分配到考试计划的人！");
                //    return false;
                //}
                postData.EmployeeIdList = []
                for (var i = 0; i < getSelectedRowIdList.length; i++) {
                    var employeeId = $gridEmployeeAssign2ExamPlanResult.jqGrid("getRowData", getSelectedRowIdList[i]).EmployeeId;
                    postData.EmployeeIdList.push(employeeId);
                }
                var ajaxOpt = {
                    url: "/" + controllerName + "/MakeExamPlanAndManualAssign",
                    data: { strData: JSON.stringify(postData) },
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("保存成功！");
                            var notInExamPlanCount = getNotInExamPlanCount();
                            $divMakeExamPlan_ManualAssign.find("[name='NotInExamPlanCount']").text(notInExamPlanCount);
                            //加载数据
                            refreshEmployeeAssign2ExamPlanGrid();
                            //刷新主页面数据
                            refreshExamPlanGrid();
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            });
        }

        var initQueryTrigger = function () {
            var $examRoomSelect = $divMakeExamPlan_ManualAssign.find("[name='ExamRoomId']");
            $examRoomSelect.on("change", function () {
                refreshEmployeeAssign2ExamPlanGrid();
            });

        }

        var initCalculateExamTimeSpan = function () {
            $divMakeExamPlan_ManualAssign.find("[name='ExamDateTimeBegin'],[name='AExamDateTimeEnd'],[name='BExamDateTimeBegin'],[name='ExamDateTimeEnd']").on("change", function () {
                calculateExamTimeSpan(enum_MakeExamPlanTypes.Manual);
            });
        }

        setInputAsDatetimePlug($divMakeExamPlan_ManualAssign.find("[name='ExamDateTimeBegin']"), "yyyy-mm-dd hh:ii");
        //setInputAsDatetimePlug($divMakeExamPlan_ManualAssign.find("[name='AExamDateTimeEnd']"), "yyyy-mm-dd hh:ii");
        //setInputAsDatetimePlug($divMakeExamPlan_ManualAssign.find("[name='BExamDateTimeBegin']"), "yyyy-mm-dd hh:ii");
        //setInputAsDatetimePlug($divMakeExamPlan_ManualAssign.find("[name='ExamDateTimeEnd']"), "yyyy-mm-dd hh:ii");
        initQueryTrigger();
        initEmployeeAssign2ExamPlanQueryBtn();
        initSaveButton();
        initTrainingInstitutionAndExamRoom();
        initEmployeeAssign2ExamPlanGrid();
        initEmployeeAssign2ExamPlanResultGrid();
        initFormVerify();
        // initCalculateExamTimeSpan();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initButtonArea();
        initExamPlanGrid();
        initExamPlan_AutoAssignModal();
        initExamPlan_ManualAssignModal();
    })

})
