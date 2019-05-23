
'use strict'
$(function () {

    var controllerName = "TrainingRecord";
    var $divQueryArea = $('#divTrainingRecord_QueryArea');
    var $gridMain = $("#gridTrainingRecord_main");
    var $pagerMain = $("#pagerTrainingRecord_main");

    var $divTrainingRecord_Info = $("#divTrainingRecord_Info");
    var $mdlTrainingRecord_Info = $("#mdlTrainingRecord_Info");

    var $mdlTrainingRecord_StudyInfo = $("#mdlTrainingRecord_StudyInfo");
    var $divTrainingRecord_StudyInfo = $("#divTrainingRecord_StudyInfo");

    var refreshGrid = function () {
        $("#btnTrainingRecord_Query").click();
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnTrainingRecord_Query").on("click", function () {
                var queryData = {};

                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
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

        initQuerySubject();
        initQueryButton();
        $divQueryArea.find("select").on("change", function () {
            refreshGrid();
        });
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
            colNames: ["Id", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目", "培训类型", "报考城市", "企业名称", "学习课时", "练习最高分", "培训状态", "提交日期", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "Age", index: "Age", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 150 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "TrainingType", index: "TrainingType", align: "center", width: 80 },
                    { name: "City", index: "City", align: "center", width: 80 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                    { name: "TotalHours", index: "TotalHours", align: "center", width: 80 },
                    { name: "OnlineExerciseMaxCore", index: "OnlineExerciseMaxCore", align: "center", width: 80 },
                    { name: "TrainingStatus", index: "TrainingStatus", align: "center", width: 80 },
                    { name: "SubmitDate", index: "SubmitDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.TrainingType == "线下培训" && rowobj.TrainingStatus != "未审核") {
                                buttons = '<a href="#" title="查看培训结果" onclick="btnTrainingRecord_View(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                  + '<i class="ace-icon fa fa-search"></i> 查看培训结果</a>';
                            }
                            else if (rowobj.TrainingType == "线上培训") {
                                buttons = '<a href="#" title="查看在线学习记录" onclick="btnTrainingRecord_viewStudyRecord(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                 + '<i class="ace-icon fa fa-search"></i> 查看在线学习记录</a>';
                            }
                            return buttons;
                        }
                    }

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
        var initSubmitButton = function () {
            $("#btnTrainingRecord_Submit").on("click", function () {

                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                var employeeIdList = [];
                for (var i = 0; i < arrRowid.length; i++) {

                    var employeeId = $gridMain.jqGrid("getRowData", arrRowid[i]).Id;
                    employeeIdList.push(employeeId);
                }
                if (employeeIdList.length < 1) {
                    return false;
                }
                if (!confirm("确认提交【" + employeeIdList.length + "】条记录？")) {
                    return false;
                }
                //var postData = new FormData();
                //for (var i = 0; i < employeeIdList.length; i++) {
                //    postData.append("employeeIdList", employeeIdList[i]);
                //}
                var postData = {};
                postData.employeeIdList = employeeIdList;
                var ajaxOpt = {
                    url: "/" + controllerName + "/SubmitTrainRecord",
                    data: { strData: JSON.stringify(postData) },
                    dataType: "json",
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("提交成功！")
                                $gridMain.jqGrid().trigger("reloadGrid");

                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            })

        }
        var initCheckButton = function () {

            $("#btnTrainingRecord_Check").on("click", function () {
                //隐藏培训结果字段
                var hiddenOutlineInfo = true;
                var checkedRowIds = $gridMain.jqGrid("getGridParam", "selarrrow");
                for (var i = 0; i < checkedRowIds.length; i++) {
                    var rowId = checkedRowIds[i];
                    var trainingType = $gridMain.jqGrid("getRowData", rowId).TrainingType;
                    var checkStatus = $gridMain.jqGrid("getRowData", rowId).CheckStatus;
                    if (trainingType == "线下培训") {
                        hiddenOutlineInfo = false;
                    }
                    else {
                        alert("只能审核线下培训的人员");
                        return false;
                    }
                    if (checkStatus == "审核通过" || checkStatus == "审核不通过") {
                        alert("审核过的人不能重复审核");
                        return false;
                        break;
                    }
                }
                if (hiddenOutlineInfo === true) {
                    $mdlTrainingRecord_Info.find("div[name='outlineInfo']").addClass("hidden");
                }
                else {
                    $mdlTrainingRecord_Info.find("div[name='outlineInfo']").removeClass("hidden");
                }
                //显示审核按钮

                $mdlTrainingRecord_Info.modal("show");
            });

        }
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
        }

        window.btnTrainingRecord_Edit = function (rowId) {

            $("#btnTrainingRecord_Save").removeClass("hidden");
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.Id;
            var trainingStatus = rowData.TrainingStatus;
            if (trainingStatus == "培训完成") {
                $("#btnTrainingRecord_Save").addClass("hidden");
            }

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
        window.btnTrainingRecord_View = function (rowId) {


            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.Id;
            //先清空modal
            var emptyJson = getJson($divTrainingRecord_Info);
            for (var p in emptyJson) {
                emptyJson[p] = "";
                //设置控件只读
                $divTrainingRecord_Info.find("[name='" + p + "']").prop("readonly", true);
            }
            setJson($divTrainingRecord_Info, emptyJson);
            //隐藏按钮
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckPass']").addClass("hidden");
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckNoPass']").addClass("hidden");

            var trainingRecord = getTrainingRecord(employeeId);
            setJson($divTrainingRecord_Info, trainingRecord);
            $divTrainingRecord_Info.find("[name='EmployeeId']").val(employeeId);
            $mdlTrainingRecord_Info.modal("show");
        }
        //查看在线学习记录
        var viewStudyRecord = function (rowId) {
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.EmployeeId;
            var iDNumber = rowData.IDNumber;
            //获取视频学习记录
            var getStudyByVideoRecordList = function (IdNumber) {
                var studyRecordList = null;
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetStudyByVideoRecordList",
                    data: { "IdNumber": IdNumber },
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
                    var strInfo = "<ins><strong>" + studyByVideoRecord.completeDate + "</strong></ins>完成<ins><strong>[" + studyByVideoRecord.videoName + "]</strong></ins>学习";
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

            var studyByVideoRecordList = getStudyByVideoRecordList(iDNumber);
            loadStudyInfo(studyByVideoRecordList);
            //加载在线练习
            var onlineExerciseRecord = getOnlineExerciseRecord(iDNumber);
            loadOnlineExerciseRecord(onlineExerciseRecord);
            $mdlTrainingRecord_StudyInfo.modal("toggle");
        };
        window.btnTrainingRecord_viewStudyRecord = viewStudyRecord;
        initCheckButton();
        //   initSubmitButton();
    }

    var initTrainingRecordModal = function () {

        var initFormVerify = function () {

            var $arrInput = $divEmployeeInfo.find("input,textarea,select");
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

        var initEmployeeSaveButton = function () {
            $("#btnTrainingRecord_Save").on("click", function () {

                var trainingRecord = getJson($divTrainingRecord_Info);
                var ajaxOpt = {
                    url: "/" + controllerName + "/SaveTrainingRecord",
                    data: trainingRecord,
                    type: "post",
                    datatype: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        debugger;
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                $gridMain.jqGrid().trigger("reloadGrid");
                                $mdlTrainingRecord_Info.modal("toggle");
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            });
        }

        // initFormVerify();
        initEmployeeSaveButton();
        var check = function (passStatus) {
            var trainingRecord = getJson($divTrainingRecord_Info);

            if (passStatus == false && isNull(trainingRecord.Remark)) {
                alert("请填写意见");
                return;
            }
            var postData = {};
            postData.PassFlag = passStatus;
            postData.StudyTime = trainingRecord.StudyTime;
            postData.PracticeTime = trainingRecord.PracticeTime;
            postData.AbilityTestResult = trainingRecord.AbilityTestResult;
            postData.Remark = trainingRecord.Remark;
            //获取选择的人员ID
            var employeeIdList = [];
            var checkedRowIds = $gridMain.jqGrid("getGridParam", "selarrrow");
            for (var i = 0; i < checkedRowIds.length; i++) {
                var rowId = checkedRowIds[i];
                var employeeId = $gridMain.jqGrid("getRowData", rowId).Id;
                employeeIdList.push(employeeId);
            }
            postData.EmployeeIdList = employeeIdList;
            var ajaxOpt = {
                url: "/" + controllerName + "/CheckTrainingRecord",
                data: { "strParam": JSON.stringify(postData) },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    alert("审核成功");
                    $gridMain.jqGrid().trigger("reloadGrid");
                    $mdlTrainingRecord_Info.modal("hide");
                }
            };
            ajaxRequest(ajaxOpt);
        }
        var initCheckPassButton = function () {
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckPass']").on("click", function () {
                check(true);
            });
        }
        var initCheckNoPassButton = function () {
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckNoPass']").on("click", function () {
                check(false);
            });
        }

        initCheckPassButton();
        initCheckNoPassButton();

        $mdlTrainingRecord_Info.on("hidden.bs.modal", function () {
            //先清空modal
            var emptyJson = getJson($divTrainingRecord_Info);
            for (var p in emptyJson) {
                emptyJson[p] = "";
                $divTrainingRecord_Info.find("[name='" + p + "']").prop("readonly", false);
            }
            setJson($divTrainingRecord_Info, emptyJson);
            //显示按钮
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckPass']").removeClass("hidden");
            $mdlTrainingRecord_Info.find("a[name='btnTrainingRecord_CheckNoPass']").removeClass("hidden");
        });
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();
        initTrainingRecordModal();

    })

})
