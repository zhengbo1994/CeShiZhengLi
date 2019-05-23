
'use strict'
$(function () {

    var controllerName = "RP_EmployeeCheck";
    var $divQueryArea = $('#divRP_EmployeeCheck_QueryArea');
    var $gridMain = $("#gridRP_EmployeeCheck_main");
    var $pagerMain = $("#pagerRP_EmployeeCheck_main");

    var $divEmployeeCheck_CheckInfo = $("#divRP_EmployeeCheck_CheckInfo");
    var $mdlEmployeeCheck_CheckInfo = $("#mdlRP_EmployeeCheck_CheckInfo");

    var $divEmployeeCheck_ReturnInfo = $("#divRP_EmployeeCheck_ReturnInfo");
    var $mdlEmployeeCheck_ReturnInfo = $("#mdlRP_EmployeeCheck_ReturnInfo");

    var $divTrainingRecord_Info = $("#divRP_EmployeeCheck_TrainingRecordInfo");
    var $mdlTrainingRecord_Info = $("#mdlRP_EmployeeCheck_TrainingRecordInfo");

    var $mdlTrainingRecord_StudyInfo = $("#mdlRP_EmployeeCheck_TrainingRecordStudyInfo");
    var $divTrainingRecord_StudyInfo = $("#divRP_EmployeeCheck_TrainingRecordStudyInfo");

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnRP_EmployeeCheck_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea);
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryIndustry = function () {
            var $txtQueryIndustry = $divQueryArea.find("[name='Industry']");
            var getIndustryList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeIndustryList",
                    type: "post",
                    datatype: "json",
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
            var industryList = getIndustryList();

            var $optionAll = $("<option>");

            $optionAll.val("");

            $optionAll.text("全部");
            $txtQueryIndustry.append($optionAll);

            for (var i = 0; i < industryList.length ; i++) {
                var industryItem = industryList[i];
                var $option = $("<option>");
                $option.val(industryItem.ItemValue);
                $option.text(industryItem.ItemText);
                $txtQueryIndustry.append($option);
            }
        }
        var initQuerySubject = function () {
            var $txtQuerySubject = $divQueryArea.find("[name='ExamType']");
            var getSubjectList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeSubjectList",
                    type: "post",
                    datatype: "json",
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
            var listSubject = getSubjectList();

            var $optionAll = $("<option>");

            $optionAll.val("");

            $optionAll.text("全部");
            $txtQuerySubject.append($optionAll);

            for (var i = 0; i < listSubject.length ; i++) {
                var Subject = listSubject[i];
                var $option = $("<option>");
                $option.val(Subject.ItemValue);
                $option.text(Subject.ItemText);
                $txtQuerySubject.append($option);
            }
        }
        setInputAsDatePlug($divQueryArea.find("[name='CheckDateBegin']"));
        setInputAsDatePlug($divQueryArea.find("[name='CheckDateEnd']"));

        initQueryIndustry();
        initQuerySubject();
        initQueryButton();
    }

    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetEmployeeListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["EmployeeId", "姓名", "性别", "身份证号", "城市", "培训机构", "企业名称", "报考科目", "原证书编号", "累计学时", "模拟考试成绩", "审核状态", "审核人", "审核日期", "操作"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 150 },
                    { name: "City", index: "City", align: "center", width: 80 },
                    { name: "TrainingInstitutionName", index: "TrainingInstitutionName", align: "center", width: 150 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "OldCertificateNo", index: "OldCertificateNo", align: "center", width: 150 },
                    { name: "TotalHours", index: "TotalHours", align: "center", width: 80 },
                    { name: "SimulatedExamMaxCore", index: "SimulatedExamMaxCore", align: "center", width: 80 },
                    { name: "CheckStatus", index: "CheckStatus", align: "center", width: 80 },
                    { name: "CheckUserName", index: "CheckUserName", align: "center", width: 80 },
                    { name: "CheckDate", index: "CheckDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.TrainingType == "线下培训") {
                                buttons = '<a href="#" title="查看培训结果" onclick="EmployeeCheck_viewTrainRecord(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                  + '<i class="ace-icon fa fa-edit"></i> 查看培训结果</a>';
                            }
                            else if (rowobj.TrainingType == "线上培训") {
                                buttons = '<a href="#" title="查看在线学习记录" onclick="EmployeeCheck_viewStudyRecord(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                 + '<i class="ace-icon fa fa-search"></i> 查看在线学习记录</a>';
                            }
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
            pager: $pagerMain,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridMain.selector);
            }
        });
    }

    var initButtonArea = function () {
        var initCheckButton = function () {
            $("#btnRP_EmployeeCheck_Check").on("click", function () {
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                if (arrRowid.length < 1) {
                    alert("请勾选要审核的记录");
                    return false;
                }
                $mdlEmployeeCheck_CheckInfo.modal("toggle");
                $divEmployeeCheck_CheckInfo.find("[name='Remark']").val("同意");

            })

        }

        window.EmployeeCheck_viewTrainRecord = function (rowId) {
            debugger;
            //获取视频学习记录
            var getTrainingRecord = function (employeeId) {
                var dataResult = {};
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetTrainingRecord",
                    data: { "employeeId": employeeId },
                    type: "post",
                    datatype: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    }
                };
                ajaxRequest(ajaxOpt);
                return dataResult;
            };
            $("#btnTrainingRecord_Save").addClass("hidden");
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.EmployeeId;

            //先清空modal
            var emptyJson = getJson($divTrainingRecord_Info);
            for (var p in emptyJson) {
                emptyJson[p] = "";
            }
            setJson($divTrainingRecord_Info, emptyJson);

            var trainingRecord = getTrainingRecord(employeeId);

            setJson($divTrainingRecord_Info, trainingRecord);
            $divTrainingRecord_Info.find("[name='EmployeeId']").val(employeeId);
            $mdlTrainingRecord_Info.modal("toggle");
        }
        //查看在线学习记录
        var viewStudyRecord = function (rowId) {
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.EmployeeId;
            var iDNumber = rowData.IDNumber;
            //获取视频学习记录
            var getStudyByVideoRecordList = function (employeeId) {
                var studyRecordList = null;
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetStudyByVideoRecordList",
                    data: { "employeeId": employeeId },
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.resultMessage.IsSuccess) {
                            studyRecordList = jdata.data;
                        }
                        else {
                            alert("获取视频学习记录--" + jdata.resultMessage.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
                return studyRecordList;
            };
            //加载学习记录
            var loadStudyInfo = function (studyByVideoRecordList) {
                $divTrainingRecord_StudyInfo.html("");
                if (!studyByVideoRecordList || studyByVideoRecordList.length < 1) {
                    var $div_alert = '<div class="alert alert-warning"><strong>提示</strong>没有视频学习记录.<br></div>';
                    $divTrainingRecord_StudyInfo.append($div_alert);
                }

                for (var i = 0; i < studyByVideoRecordList.length; i++) {
                    var studyByVideoRecord = studyByVideoRecordList[i];
                    var $div_alert = $("<div>").addClass("alert alert-success");
                    var $p = $("<p>");
                    $p.append('<strong><i class="ace-icon fa fa-check-square-o"></i></strong>');
                    var $span = $("<span>").addClass("padding-left-1");
                    var strInfo = "在<ins><strong>" + studyByVideoRecord.studyDateTimeStart + "</strong></ins>到<ins><strong>" + studyByVideoRecord.studyDateTimeEnd + "</strong></ins>观看视频<ins><strong>[" + studyByVideoRecord.videoName + "]</strong></ins>共计<ins><strong>" + studyByVideoRecord.studyHours + "</strong></ins>小时";
                    $span.append(strInfo);
                    $p.append($span);
                    $div_alert.append($p);
                    $divTrainingRecord_StudyInfo.append($div_alert);
                }
            };
            //获取在线练习记录
            var getOnlineExerciseRecord = function (iDNumber) {
                var onlineExerciseRecord = null;
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetOnlineExerciseRecord",
                    data: { "iDNumber": iDNumber },
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.resultMessage.IsSuccess) {
                            onlineExerciseRecord = jdata;
                        }
                        else {
                            onlineExerciseRecord = null;
                            // alert("获取在线练习记录--" + jdata.resultMessage.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
                return onlineExerciseRecord;
            }
            //加载在线练习记录
            var loadOnlineExerciseRecord = function (onlineExerciseRecord) {
                // $divTrainingRecord_StudyInfo.html("");
                var $div_alert = "";
                if (!onlineExerciseRecord) {
                    $div_alert = '<div class="alert alert-warning"><strong>提示</strong>没有在线练习记录.<br></div>';
                    $divTrainingRecord_StudyInfo.append($div_alert);
                    return false;
                }

                $div_alert = $("<div>").addClass("alert alert-info");
                var $p = $("<p>");
                $p.append('<strong><i class="ace-icon fa fa-check-square-o"></i></strong>');
                var $span = $("<span>").addClass("padding-left-1");
                var strInfo = "在<ins><strong>" + onlineExerciseRecord.startDateTime + "</strong></ins>到<ins><strong>" + onlineExerciseRecord.endDateTime + "</strong></ins>在线练习共计<ins><strong>[" + onlineExerciseRecord.onlineExerciseCount + "]次</strong></ins>最高分数<ins><strong>" + onlineExerciseRecord.maxScore + "</strong></ins>分";
                $span.append(strInfo);
                $p.append($span);
                $div_alert.append($p);
                $divTrainingRecord_StudyInfo.append($div_alert);

            };

            var studyByVideoRecordList = getStudyByVideoRecordList(employeeId);
            loadStudyInfo(studyByVideoRecordList);
            //加载在线练习
            var onlineExerciseRecord = getOnlineExerciseRecord(iDNumber);
            loadOnlineExerciseRecord(onlineExerciseRecord);
            $mdlTrainingRecord_StudyInfo.modal("toggle");
        };
        window.EmployeeCheck_viewStudyRecord = viewStudyRecord;

        initCheckButton();
    }

    var initCheckedModal = function () {
        var defaultRemark = "学习达标,同意";

        var initFormVerify = function () {

            var $arrInput = $divEmployeeCheck_CheckInfo.find("input,textarea,select");
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

        var initCheckedButton = function () {

            var CheckedEmployee = function (passFlag) {
                var checkResult = verifyForm($divEmployeeCheck_CheckInfo);
                if (!checkResult) {
                    return;
                }
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                var employeeIdList = [];
                for (var i = 0; i < arrRowid.length; i++) {

                    var employeeId = $gridMain.jqGrid("getRowData", arrRowid[i]).EmployeeId;
                    employeeIdList.push(employeeId);
                }
                var checkedMark = $divEmployeeCheck_CheckInfo.find("[name='Remark']").val();
                var postData = {};
                postData.employeeIdList = [];
                for (var i = 0; i < employeeIdList.length; i++) {
                    postData.employeeIdList.push(employeeIdList[i]);
                }

                postData.passFlag = passFlag;
                postData.checkedMark = checkedMark;
                var strData = JSON.stringify(postData);
                var ajaxOpt = {
                    url: "/" + controllerName + "/CheckEmployeeList",
                    data: { "strData": strData },
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("审核成功！")
                                $gridMain.jqGrid().trigger("reloadGrid");
                                $mdlEmployeeCheck_CheckInfo.modal("toggle");
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            }

            $mdlEmployeeCheck_CheckInfo.find("[name='btnCheckedPass']").on("click", function () {
                CheckedEmployee(true);
            });

            $mdlEmployeeCheck_CheckInfo.find("[name='btnCheckedNoPass']").on("click", function () {
                var remark = $mdlEmployeeCheck_CheckInfo.find("textarea[name='Remark']").val();
                if (remark == defaultRemark) {
                    alert("请填写审核意见");
                    return false;
                }
                CheckedEmployee(false);
            });
        }
        $mdlEmployeeCheck_CheckInfo.on("show.bs.modal", function () {
            $mdlEmployeeCheck_CheckInfo.find("textarea[name='Remark']").val(defaultRemark);
        })
        initFormVerify();
        initCheckedButton();
    }

    var initReturnModal = function () {

        var initFormVerify = function () {

            var $arrInput = $divEmployeeCheck_ReturnInfo.find("input,textarea,select");
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
        initFormVerify();
        $mdlEmployeeCheck_ReturnInfo.on("show.bs.modal", function () {
            var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
            if (arrRowid.length < 1) {
                alert("请选择需要退回的记录！");
                return false;
            }
        });

        $("#btnEmployeeCheck_ReturnOk").on("click", function () {
            var checkResult = verifyForm($divEmployeeCheck_ReturnInfo);
            if (!checkResult) {
                return;
            }

            var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
            if (arrRowid.length < 1) {
                alert("请选择需要退回的记录！");
                return false;
            }
            var employeeIdList = [];
            for (var i = 0; i < arrRowid.length; i++) {
                var employeeId = $gridMain.jqGrid("getRowData", arrRowid[i]).EmployeeId;
                employeeIdList.push(employeeId);
            }
            var postData = {};
            var checkedMark = $divEmployeeCheck_ReturnInfo.find("[name='Remark']").val();
            postData.checkedMark = checkedMark;
            postData.employeeIdList = employeeIdList;
            ajaxRequest({
                url: "/" + controllerName + "/ReturnEmployeeList",
                data: { "strData": JSON.stringify(postData) },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("退回成功！")
                            $gridMain.jqGrid().trigger("reloadGrid");
                            $mdlEmployeeCheck_ReturnInfo.modal("toggle");
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                }
            });
        });
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();
        initCheckedModal();
        initReturnModal();
    })

})
