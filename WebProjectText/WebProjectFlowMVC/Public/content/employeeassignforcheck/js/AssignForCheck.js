
'use strict'
$(function () {

    var controllerName = "EmployeeAssignForCheck";
    var divQueryArea = $("#divEmployeeAssignForCheck_QueryArea")
    var $employeeAssignForCheck_QueryArea = $('#divEmployeeAssignForCheck_QueryArea');
    var $gridEmployeeAssignForCheck = $("#gridEmployeeAssignForCheck_main");
    var $pagerEmployeeAssignForCheck = $("#pagerEmployeeAssignForCheck_main");

    var $divEmployeeAssignForCheck_ManualAssign = $("#divEmployeeAssignForCheck_ManualAssign");
    var $mdlEmployeeAssignForCheck_ManualAssign = $("#mdlEmployeeAssignForCheck_ManualAssign");

    var $divEmployeeAssignForCheck_AutoAssign = $("#divEmployeeAssignForCheck_AutoAssign");
    var $mdlEmployeeAssignForCheck_AutoAssign = $("#mdlEmployeeAssignForCheck_AutoAssign");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshMainGrid = function () {
        $gridEmployeeAssignForCheck.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridEmployeeAssignForCheck.jqGrid("getGridParam", "selrow");
        }
        selRowId = rowid;
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridEmployee.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnEmployeeAssignForCheck_Query").on("click", function () {
                var queryData = {};

                queryData = getJson(divQueryArea)
                $gridEmployeeAssignForCheck.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }

        var initQuerySubject = function () {
            var $txtQuerySubject = $("#divEmployeeAssignForCheck_QueryAreaExamType");

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

        setInputAsDatePlug($employeeAssignForCheck_QueryArea.find("[name='AssignDateBegin']"));
        setInputAsDatePlug($employeeAssignForCheck_QueryArea.find("[name='AssignDateEnd']"));

        initQuerySubject();
        initQueryButton();
    }



    var initEmployeeAssignForCheckGrid = function () {
        var queryData = {};
        queryData = getJson(divQueryArea)
        $gridEmployeeAssignForCheck.jqGrid({
            url: "/" + controllerName + "/GetEmployeeAssignListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["人员Id", "分配考核点名称", "姓名", "性别", "年龄", "身份证号", "企业名称", "职务", "技术职称", "报考行业", "报考类型", "分配状态", "分配日期"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "InstitutionName", index: "InstitutionName", align: "center", width: 100 },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 50 },
                    { name: "Sex", index: "Sex", align: "center", width: 20 },
                    { name: "Age", index: "Age", align: "center", width: 20 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 80 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 100 },
                    { name: "Job", index: "Job", align: "center", width: 50 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 30 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 30 },
                    { name: "AssignStatus", index: "AssignStatus", align: "center", width: 30 },
                    { name: "AssignDate", index: "AssignDate", align: "center", width: 30 }
            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerEmployeeAssignForCheck,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridEmployeeAssignForCheck.selector);
            }
        });
    }

    var initButtonArea = function () {
        //初始化手动分配
        var initManualAssign = function () {
            $("#btnEmployeeAssignForCheck_ManualAssign").on("click", function () {
                $mdlEmployeeAssignForCheck_ManualAssign.modal("toggle");
            });
        }
        //初始化自动分配
        var initAutoAssign = function () {
            $("#btnEmployeeAssignForCheck_AutoAssign").on("click", function () {
                $mdlEmployeeAssignForCheck_AutoAssign.modal("toggle");
            });
        }
        initManualAssign();
        initAutoAssign();
    }

    var initManualAssignModal = function () {
        var initFormVerify = function () {

            var $arrInput = $divEmployeeAssignForCheck_ManualAssign.find("input,textarea");
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
        //初始化考核点选择
        var initTrainingInstitutionSelect = function () {
            var $TrainingInstitutionSelect = $("#divEmployeeAssignForCheck_ManualAssignTrainingInstitution");

            var getTrainingInstitutionList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetTrainingInstitutionList",
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
            var trainingInstitutionList = getTrainingInstitutionList();
            $TrainingInstitutionSelect.empty();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择考核点");
            $TrainingInstitutionSelect.append($optionAll);
            for (var i = 0; i < trainingInstitutionList.length ; i++) {
                var Item = trainingInstitutionList[i];
                var $option = $("<option>");
                $option.val(Item.TrainingInstitutionId);
                $option.text(Item.TrainingInstitutionName);
                $TrainingInstitutionSelect.append($option);
            }
        }
        //初始化保存按钮
        var initManualAssignSaveButton = function () {
            $("#btnEmployeeAssignForCheck_ManualAssignConfirm").on("click", function () {

                var checkResult = verifyForm($divEmployeeAssignForCheck_ManualAssign);
                if (!checkResult) {
                    return;
                }
                var manualAssignInfo = getForm($divEmployeeAssignForCheck_ManualAssign);
                //获取选中人的EmployeeId
                var rowIdList = $gridEmployeeAssignForCheck.jqGrid("getGridParam", "selarrrow");
                if (rowIdList.length < 1) {
                    alert("请选择需要分配的人员");
                    return false;
                }
                for (var i = 0; i < rowIdList.length; i++) {
                    var rowId = rowIdList[i];
                    var employeeId = $gridEmployeeAssignForCheck.jqGrid("getRowData", rowId).EmployeeId;
                    manualAssignInfo.append("employeeIdList", employeeId);
                }
                ajaxRequest({
                    url: "/" + controllerName + "/EmployeeManualAssignForCheck",
                    data: manualAssignInfo,
                    type: "post",
                    datatype: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshMainGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }


        initTrainingInstitutionSelect();
        initManualAssignSaveButton();
        initFormVerify();
    }
    var initAutoAssignModal = function () {
        var initFormVerify = function () {

            var $arrInput = $divEmployeeAssignForCheck_AutoAssign.find("input,textarea");
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
        //初始化考核点选择
        var initTrainingInstitutionSelect = function () {
            var $TrainingInstitutionSelect = $("#divEmployeeAssignForCheck_AutoAssignTrainingInstitution");

            var getTrainingInstitutionList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetTrainingInstitutionList",
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
            var trainingInstitutionList = getTrainingInstitutionList();
            $TrainingInstitutionSelect.empty();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择考核点");
            $TrainingInstitutionSelect.append($optionAll);
            for (var i = 0; i < trainingInstitutionList.length ; i++) {
                var Item = trainingInstitutionList[i];
                var $option = $("<option>");
                $option.val(Item.TrainingInstitutionId);
                $option.text(Item.TrainingInstitutionName);
                $TrainingInstitutionSelect.append($option);
            }
        }
        //初始化保存按钮
        var initAutoAssignSaveButton = function () {

            $("#btnEmployeeAssignForCheck_AutoAssignConfirm").on("click", function () {
                var checkResult = verifyForm($divEmployeeAssignForCheck_AutoAssign);
                if (!checkResult) {
                    return;
                }
                var autoAssignInfo = getForm($divEmployeeAssignForCheck_AutoAssign);
                ajaxRequest({
                    url: "/" + controllerName + "/EmployeeAutoAssignForCheck",
                    data: autoAssignInfo,
                    type: "post",
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("分配成功！")
                                refreshMainGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }


        initTrainingInstitutionSelect();
        initAutoAssignSaveButton();
        initFormVerify();
    }

    var initCheckedModal = function () {

        var checkedConfirm = function (checkedResult) {

            var employeeId = getSelectedRowDataOfGrid().Id;

            var checkRemark = $("#txtEmployee_SubmitRemark").val();

            var checkedData = {};
            checkedData.employeeId = employeeId
            checkedData.checkedResult = checkedResult
            checkedData.checkRemark = checkRemark

            ajaxRequest({
                url: "/" + controllerName + "/SubmitEmployeeById",
                data: checkedData,
                type: "post",
                datatype: "json",
                async: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("提交成功！")
                            refreshEmployeeGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                }
            });


        }

        $("#btnEmployee_SubmitOk").on("click", function () {
            checkedConfirm(true);
        })

        $("#btnEmployee_SubmitCancle").on("click", function () {
            checkedConfirm(false);
        })

    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initEmployeeAssignForCheckGrid();
        initButtonArea();
        initManualAssignModal();
        initAutoAssignModal();
        //initEmployeeModal();
        //initCheckedModal();
    })

})
