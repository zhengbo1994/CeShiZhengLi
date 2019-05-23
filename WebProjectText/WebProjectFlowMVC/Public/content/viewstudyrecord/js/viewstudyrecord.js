
'use strict'
$(function () {

    var controllerName = "ViewStudyRecord";
    var $divQueryArea = $('#divViewStudyRecord_QueryArea');
    var $gridMain = $("#gridViewStudyRecord_main");
    var $pagerMain = $("#pagerViewStudyRecord_main");


    var $divTrainingRecord_Info = $("#divViewStudyRecord_TrainingRecordInfo");
    var $mdlTrainingRecord_Info = $("#mdlViewStudyRecord_TrainingRecordInfo");

    var $mdlTrainingRecord_StudyInfo = $("#mdlViewStudyRecord_StudyRecordInfo");
    var $divTrainingRecord_StudyInfo = $("#divViewStudyRecord_StudyRecordInfo");

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnViewStudyRecord_Query").on("click", function () {
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
        var initCityAndArea = function () {
            var initCity = function () {
                var $txtQueryCity = $divQueryArea.find("[name='City']");
                var getCityList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetCityList",
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
                var listCity = getCityList();


                $txtQueryCity.empty();
                var $optionCityAll = $("<option>");
                $optionCityAll.val("");
                $optionCityAll.text("全部");
                $txtQueryCity.append($optionCityAll);
                for (var i = 0; i < listCity.length ; i++) {
                    var city = listCity[i];
                    var $option = $("<option>");
                    $option.val(city);
                    $option.text(city);
                    $txtQueryCity.append($option);
                }
            }
            var initArea = function (cityName) {

                var jdata = { 'cityName': cityName };
                var $txtArea = $divQueryArea.find("[name='Area']");
                var getAreaList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetAreaListByCityName",
                        type: "post",
                        datatype: "json",
                        data: jdata,
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


                var listArea = getAreaList();
                $txtArea.empty();
                var $optionAreaAll = $("<option>");
                $optionAreaAll.val("");
                $optionAreaAll.text("全部");
                $txtArea.append($optionAreaAll);

                for (var i = 0; i < listArea.length ; i++) {
                    var area = listArea[i];
                    var $option = $("<option>");
                    $option.val(area);
                    $option.text(area);
                    $txtArea.append($option);
                }

            }
            initCity();
            $divQueryArea.find("[name='City']").on("change", function () {
                var cityName = $divQueryArea.find("[name='City']").val();
                initArea(cityName);
            });
        }

        initQueryIndustry();
        initQuerySubject();
        initQueryButton();
        initCityAndArea();
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
            colNames: ["EmployeeId", "姓名", "性别", "年龄", "身份证号", "企业名称", "职务", "技术职称", "报考行业", "报考科目", "在线视频学习课时", "在线练习最高分", "注册建造师证书编号", "城市", "区域", "报考城市", "培训类型", "报考考核点", "操作"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 50 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "Age", index: "Age", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 120 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                    { name: "Job", index: "Job", align: "center", width: 80, hidden: true },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80, hidden: true },
                    { name: "Industry", index: "Industry", align: "center", width: 60 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 60 },
                    { name: "TotalPeriods", index: "TotalPeriods", align: "center", width: 100 },
                    { name: "MaxScore", index: "MaxScore", align: "center", width: 80, hidden: true },
                    { name: "ConstructorCertificateNo", index: "ConstructorCertificateNo", align: "center", width: 150, hidden: true },
                    { name: "EnterpriseCity", index: "EnterpriseCity", align: "center", width: 50 },
                    { name: "EnterpriseArea", index: "EnterpriseArea", align: "center", width: 50 },
                    { name: "City", index: "City", align: "center", width: 80, hidden: true },
                    { name: "TrainingType", index: "TrainingType", align: "center", width: 80, hidden: true },
                    { name: "TrainingInstitutionName", index: "TrainingInstitutionName", align: "center", width: 80, hidden: true },
                    {
                        name: "操作", index: "操作", key: true, width: 120, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.TrainingType == "线下培训") {
                                buttons = '<a href="#" title="查看培训结果" onclick="ViewStudyRecord_viewTrainRecord(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                  + '<i class="ace-icon fa fa-edit"></i> 查看培训结果</a>';
                            }
                            else if (rowobj.TrainingType == "线上培训") {
                                buttons = '<a href="#" title="查看在线学习记录" onclick="ViewStudyRecord_viewStudyRecord(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
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
        window.ViewStudyRecord_viewTrainRecord = function (rowId) {
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
            //var employeeId = rowData.EmployeeId;
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

            var studyByVideoRecordList = getStudyByVideoRecordList(iDNumber);
            loadStudyInfo(studyByVideoRecordList);
            //加载在线练习
            var onlineExerciseRecord = getOnlineExerciseRecord(iDNumber);
            loadOnlineExerciseRecord(onlineExerciseRecord);
            $mdlTrainingRecord_StudyInfo.modal("toggle");
        };
        window.ViewStudyRecord_viewStudyRecord = viewStudyRecord;
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();

    })

})
