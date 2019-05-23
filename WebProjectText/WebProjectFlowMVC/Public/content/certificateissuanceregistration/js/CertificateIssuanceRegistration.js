
'use strict'
$(function () {

    var controllerName = "CertificateIssuanceRegistration";
    var $divQueryArea = $("#divCertificateIssuanceRegistration_QueryArea")
    var $gridCertificateIssuanceRegistration = $("#gridCertificateIssuanceRegistration_main");
    var $pagerCertificateIssuanceRegistration = $("#pagerCertificateIssuanceRegistration_main");
    var $mdlCertificateIssuanceRegistration_Checked = $("#mdlCertificateIssuanceRegistration_Checked");
    var $divCertificateIssuanceRegistration_Checked = $("#divCertificateIssuanceRegistration_Checked");


    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnCertificateIssuanceRegistration_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridCertificateIssuanceRegistration.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
        setInputAsDatePlug($divQueryArea.find("[name='issuanceDateTimeBegin']"));
        setInputAsDatePlug($divQueryArea.find("[name='issuanceDateTimeEnd']"));
    }



    var initCertificateIssuanceRegistrationGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridCertificateIssuanceRegistration.jqGrid({
            url: "/" + controllerName + "/GetExamPlanInCertificateIssuanceForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["ExamPlanId", "TrainingInsititutionId", "考试计划流水号", "考核点名称", "证书总数量", "证书发放时间", "备注", "操作"],
            colModel: [
                    { name: "ExamPlanId", index: "ExamPlanId", width: 30, hidden: true },
                    { name: "TrainingInsititutionId", index: "TrainingInsititutionId", width: 30, hidden: true },
                    { name: "ExamPlanNumber", index: "TheExaminationProgramSerialNumber", align: "center", width: 80 },
                    { name: "TrainingInsititutionName", index: "TrainingInsititutionName", align: "center", width: 80 },
                    { name: "IssuanceStatus", index: "IssuanceStatus", align: "center", width: 80 },
                    { name: "IssuanceDateTime", index: "IssuanceDateTime", align: "center", width: 80 },
                    { name: "Remark", index: "Remark", align: "center", width: 100 },
                    {
                        name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                             + '<a href="#" title="发放证书" onclick="IssuanceByExamPlan(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon  fa fa-check"></i> 发放证书</a>'
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
            pager: $pagerCertificateIssuanceRegistration,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridCertificateIssuanceRegistration.selector);
            }
        });
    }

    var initButtonArea = function () {
        var enum_IssuanceTypes = {
            ExamPlan: 0,
            Employee: 1
        }
        var initIssuanceButton = function () {
            $("#btnCertificateIssuanceRegistration_OK").on("click", function () {

                var issuanceType = $mdlCertificateIssuanceRegistration_Checked.find("input[name='IssuanceType']").val();
                if (issuanceType == enum_IssuanceTypes.ExamPlan) {
                    issuanceByExamPlan();
                }
                else if (issuanceType == enum_IssuanceTypes.Employee) {
                    issuanceByEmployee();
                }
            });
        }

        var issuanceByExamPlan = function () {
            var formJson = getJson($divCertificateIssuanceRegistration_Checked);
            var postData = {};
            postData.examPlanId = formJson.ExamPlanId;
            postData.trainingInsititutionId = formJson.TrainingInsititutionId;
            postData.remark = formJson.Remark;

            var ajaxOpt = {
                url: "/" + controllerName + "/IssuanceByExamPlan",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("发放成功");
                        $mdlCertificateIssuanceRegistration_Checked.modal("toggle");
                        $gridCertificateIssuanceRegistration.jqGrid().trigger("reloadGrid");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        };

        var issuanceByEmployee = function () {
            var formJson = getJson($divCertificateIssuanceRegistration_Checked);
            var postData = {};
            postData.employeeId = formJson.EmployeeId;
            postData.examPlanId = formJson.ExamPlanId;
            postData.trainingInsititutionId = formJson.TrainingInsititutionId;
            postData.remark = formJson.Remark;
            var ajaxOpt = {
                url: "/" + controllerName + "/IssuanceByEmployee",
                data: postData,
                type: "post",
                datatype: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("发放成功");
                        $mdlCertificateIssuanceRegistration_Checked.modal("toggle");
                        $gridCertificateIssuanceRegistration.jqGrid().trigger("reloadGrid");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        };

        window.IssuanceByExamPlan = function (rowId) {
            var rowData = $gridCertificateIssuanceRegistration.jqGrid("getRowData", rowId);
            var formJson = getJson($divCertificateIssuanceRegistration_Checked);
            for (var p in formJson) {
                formJson[p] = "";
            }
            formJson.ExamPlanId = rowData.ExamPlanId;
            formJson.TrainingInsititutionId = rowData.TrainingInsititutionId;
            formJson.IssuanceType = enum_IssuanceTypes.ExamPlan;
            setJson($divCertificateIssuanceRegistration_Checked, formJson);



            $mdlCertificateIssuanceRegistration_Checked.modal("toggle");

        }

        window.IssuanceByEmployee = function (subGridId, rowId) {
            var rowData = $("#" + subGridId).jqGrid("getRowData", rowId);
            var formJson = getJson($divCertificateIssuanceRegistration_Checked);
            for (var p in formJson) {
                formJson[p] = "";
            }
            formJson.ExamPlanId = rowData.ExamPlanId;
            formJson.TrainingInsititutionId = rowData.TrainingInsititutionId;
            formJson.EmployeeId = rowData.EmployeeId;
            formJson.IssuanceType = enum_IssuanceTypes.Employee;
            setJson($divCertificateIssuanceRegistration_Checked, formJson);


            $mdlCertificateIssuanceRegistration_Checked.modal("toggle");
        }

        initIssuanceButton();
    }



    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initCertificateIssuanceRegistrationGrid();
        initButtonArea();
    })

})
