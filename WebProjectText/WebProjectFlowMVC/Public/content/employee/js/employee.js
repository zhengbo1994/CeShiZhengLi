
'use strict'
$(function () {

    var controllerName = "EmployeeRegistration";
    var $employee_QueryArea = $('#divEmployee_QueryArea');
    var $gridEmployee = $("#gridEmployee_main");
    var $pagerEmployee = $("#pagerEmployee_main");
    var $divEmployeeInfo = $("#divEmployee_EmployeeInfo");
    var $mdlEmployeeInfo = $("#mdlEmployee_EmployeeInfo");
    var $divChecked = $("#divEmployee_Checked");
    var $mdlChecked = $("#mdlEmployee_Checked");
    var $mdlEmployeeFileUpload = $("#mdlEmployee_FileUpload");
    var $mdlEnterpriseInfo = $("#mdlEmployee_EnterpriseInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshEmployeeGrid = function () {
        $gridEmployee.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridEmployee.jqGrid("getGridParam", "selrow");
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
            $("#btnEmployee_Query").on("click", function () {
                var queryData = {};
                var divQueryArea = $("#divEmployee_QueryArea");
                queryData = getJson(divQueryArea);
                $gridEmployee.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryIndustry = function () {
            var $txtQueryIndustry = $employee_QueryArea.find("[name='Industry']");
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
            var $txtQuerySubject = $employee_QueryArea.find("[name='ExamType']");
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

        initQueryIndustry();
        initQuerySubject();
        initQueryButton();
    }

    var initEmployeeGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divEmployee_QueryArea")
        queryData = getJson(divQueryArea)
        $gridEmployee.jqGrid({
            url: "/" + controllerName + "/GetEmployeeListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["Id", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目", "注册建造师证书编号", "培训类型", "报考城市", "培训机构", "当前状态", "状态修改日期", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "Age", index: "Age", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 170 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "ConstructorCertificateNo", index: "ConstructorCertificateNo", align: "center", width: 150 },
                    { name: "TrainingType", index: "TrainingType", align: "center", width: 80 },
                    { name: "City", index: "City", align: "center", width: 80 },
                    { name: "TrainingInstitutionName", index: "TrainingInstitutionName", align: "center", width: 150 },
                    { name: "CurrentStatus", index: "SubmitStatus", align: "center", width: 120 },
                    { name: "OperationDate", index: "OperationDate", align: "center", width: 120 },
                    {
                        name: "操作", index: "操作", key: true, width: 350, align: "center", formatter: function (cellvalue, options, rowobj) {

                            var buttons = ''
                              + '<a href="#" title="打印准考证" onclick="EmployeeRegistration_PrintAdmissionticket(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-print"></i> 打印准考证</a>'
                              + '<a href="#" title="查看" onclick="btnEmployee_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search"></i> 查看</a>'
                              + '<a href="#" title="修改" onclick="btnEmployee_Update(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-edit"></i> 修改</a>'
                              + '<a href="#" title="删除" onclick="btnEmployee_Delete(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-trash"></i> 删除</a>'
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
            pager: $pagerEmployee,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridEmployee.selector);
            }
        });
    }

    var initButtonArea = function () {
        //设置人员的默认城市 为企业所在城市
        var setDefaultCity = function () {
            var ajaxOpt = {
                url: "/" + controllerName + "/GetEnterpriseCity",
                type: "post",
                datatype: "json",
                async: false,
                success: function (jdata) {
                    var $txtQueryCity = $divEmployeeInfo.find("[name='City']");
                    $txtQueryCity.val(jdata);
                    $txtQueryCity.change();
                }
            }
            ajaxRequest(ajaxOpt);
        }

        //显示人员详细信息
        var showEmployeeModal = function (employeeId) {
            var getEmployeeByID = function (employeeId) {
                var queryData = {};
                var dataResult = {};
                queryData.employeeId = employeeId;
                queryData.datetimeStr = new Date().toDateString();
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeById",
                    data: queryData,
                    type: "post",
                    datatype: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        dataResult = null;
                    }
                });
                return dataResult;
            }

            var edittype = currentEdittype;
            var employeeData = {};
            if (enum_EditTypes.insert == edittype) {
                employeeData = getJson($divEmployeeInfo);
                for (var p in employeeData) {
                    employeeData[p] = "";
                }
                //默认值
                employeeData.IsTraining = true;
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!employeeId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                employeeData = getEmployeeByID(employeeId);
            }
            setJson($divEmployeeInfo, employeeData);



            if (enum_EditTypes.view == edittype) {
                for (var p in employeeData) {
                    $divEmployeeInfo.find("[name='" + p + "']").prop("disabled", true);
                }
            } else {
                for (var p in employeeData) {
                    $divEmployeeInfo.find("[name='" + p + "']").prop("disabled", false);
                }
            }
            $divEmployeeInfo.find("[name='IsTraining']:checked").change();
            $divEmployeeInfo.find("[name='ExamType']").change();
            $divEmployeeInfo.find("[name='City']").change();
            //将级联的数据 重新赋值
            if (employeeData) {
                $divEmployeeInfo.find("[name='TrainingInstitutionId']").val(employeeData.TrainingInstitutionId);
            }

            $mdlEmployeeInfo.modal("toggle");


        }
        //初始化查询按钮
        var initSearchButton = function () {
            //注册windows方法
            window.btnEmployee_View = function (employeeId) {
                currentEdittype = enum_EditTypes.view;
                showEmployeeModal(employeeId);
            };
        }
        //初始化插入按钮
        var initInsertButton = function () {
            $("#btnEmployee_Insert").on("click", function (id) {
                currentEdittype = enum_EditTypes.insert;
                showEmployeeModal(id);
                setDefaultCity();
            });
        }
        //初始化更新人员信息
        var initUpdateButton = function () {
            //注册window方法
            window.btnEmployee_Update = function (id) {
                currentEdittype = enum_EditTypes.update;
                showEmployeeModal(id);
            };
        }
        var initDeleteButton = function () {
            //注册window方法
            window.btnEmployee_Delete = function (id) {
                var queryData = {};
                if (!id) {
                    queryData.employeeId = getSelectedRowDataOfGrid().Id;
                }
                queryData.employeeId = id;
                if (!confirm("确认删除吗?")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/DeleteEmployeeById",
                    data: queryData,
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("删除成功！")
                            refreshEmployeeGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                });
            };
        }
        var initSubmitButton = function () {
            $("#btnEmployee_Submit").on("click", function () {
                var arrRowid = $gridEmployee.jqGrid("getGridParam", "selarrrow");

                var employeeIdList = [];
                for (var i = 0; i < arrRowid.length; i++) {

                    var employeeId = getSelectedRowDataOfGrid(arrRowid[i]).Id;
                    employeeIdList.push(employeeId);
                }
                if (employeeIdList.length < 1) {
                    return false;
                }
                if (!confirm("确认提交【" + employeeIdList.length + "】条记录？")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/SubmitEmployee",
                    data: { 'strEmployeeIdList': JSON.stringify(employeeIdList) },
                    // data:employeeIdList,
                    datatype: "string",
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
            })

        }
        var initImputExcel = function () {
            $("#btnEmployee_ImputExcel").on("click", function () {
                initFileUploadModal();
                $mdlEmployeeFileUpload.modal("toggle");
            })


        }
        var PrintAdmissionticket = function (employeeId) {
            var newWin = window.open("", "_blank");
            newWin.location.href = "/" + controllerName + "/ShowAdmissionticket?employeeId=" + employeeId;
        }
        window.EmployeeRegistration_PrintAdmissionticket = PrintAdmissionticket;

        initSearchButton();
        initInsertButton();
        initUpdateButton();
        initDeleteButton();
        initSubmitButton();
        initImputExcel();
    }

    var initEmployeeModal = function () {
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
        var initCity = function () {
            var $txtQueryCity = $divEmployeeInfo.find("[name='City']");
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

            var $optionCityAll = $("<option>");

            $optionCityAll.val("");

            $optionCityAll.text("请选择");
            $txtQueryCity.append($optionCityAll);

            for (var i = 0; i < listCity.length ; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtQueryCity.append($option);
            }
        }
        var initCityChange = function () {
            $divEmployeeInfo.find("[name='City']").on("change", function () {
                var city = $divEmployeeInfo.find("[name='City']").val();
                if (city == "武汉市") {
                    $divEmployeeInfo.find("[name='TrainingType'][value='线下培训']").prop("checked", true);
                    $divEmployeeInfo.find("[name='tdTrainingType']").addClass("hidden");
                } else {
                    $divEmployeeInfo.find("[name='TrainingType'][value='线上培训']").prop("checked", true);
                    $divEmployeeInfo.find("[name='tdTrainingType']").removeClass("hidden");
                }
                loadTrainingInstitution();
            });
        }
        var initIsTrainingChange = function () {

            $divEmployeeInfo.find("[name='IsTraining']").on("change", function () {

                var IsTraining = $divEmployeeInfo.find("[name='IsTraining']:checked").val();
                if (IsTraining == "True") {//参加培训 培训类型可选 培训机构可选
                    //培训机构必填
                    $divEmployeeInfo.find("[name='span_TrainingInstitutionId']").removeClass("hidden");
                    $divEmployeeInfo.find("[name='TrainingInstitutionId']").attr("disabled", false);
                    // $divEmployeeInfo.find("[name='TrainingInstitutionId']").val("");
                    //培训类型必填  默认为线上培训
                    $divEmployeeInfo.find("[name='span_TrainingType']").removeClass("hidden");
                    if ($divEmployeeInfo.find("[name='TrainingType']:checked").length < 1) {
                        $divEmployeeInfo.find("[name='TrainingType'][value='线上培训']").prop("checked", true);
                    }
                    $divEmployeeInfo.find("[name='TrainingType']").prop("disabled", false);
                }
                else {//不参加培训
                    //培训机构不可填写 且清除值
                    $divEmployeeInfo.find("[name='span_TrainingInstitutionId']").addClass("hidden");
                    $divEmployeeInfo.find("[name='TrainingInstitutionId']").val("");
                    $divEmployeeInfo.find("[name='TrainingInstitutionId']").attr("disabled", true);
                    //培训类型不可填写 且清除值
                    $divEmployeeInfo.find("[name='TrainingType']").prop("checked", false);
                    $divEmployeeInfo.find("[name='span_TrainingType']").addClass("hidden");
                    $divEmployeeInfo.find("[name='TrainingType']").prop("disabled", true);
                }
            });

        }
        var initExamTypeChange = function () {
            $divEmployeeInfo.find("[name='ExamType']").on("change", function () {

                var examType = $divEmployeeInfo.find("[name='ExamType']").val();
                if (examType == "B") {
                    $divEmployeeInfo.find("[name='span_ConstructorCertificateNo']").removeClass("hidden");
                    $divEmployeeInfo.find("[name='ConstructorCertificateNo']").attr("disabled", false);
                }
                else {
                    $divEmployeeInfo.find("[name='span_ConstructorCertificateNo']").addClass("hidden");
                    $divEmployeeInfo.find("[name='ConstructorCertificateNo']").val("");
                    $divEmployeeInfo.find("[name='ConstructorCertificateNo']").attr("disabled", true);
                }
            });
        }
        var loadTrainingInstitution = function () {
            var $txtSelect = $divEmployeeInfo.find("[name='TrainingInstitutionId']");
            var city = $divEmployeeInfo.find("[name='City']").val();
            var postData = {};
            postData.city = city;
            ajaxRequest({
                url: "/" + controllerName + "/GetTrainingInstitutionList",
                data: postData,
                type: "post",
                datatype: "json",
                async: false,
                success: function (jdata) {
                    $txtSelect.empty();
                    var trainingInstitutionList = jdata;
                    var $optionAll = $("<option>");
                    $optionAll.val("");
                    $optionAll.text("请选择");
                    $txtSelect.append($optionAll);

                    for (var i = 0; i < trainingInstitutionList.length ; i++) {
                        var trainingInstitution = trainingInstitutionList[i];
                        var $option = $("<option>");
                        $option.val(trainingInstitution.ItemValue);
                        $option.text(trainingInstitution.ItemText);
                        $txtSelect.append($option);
                    }
                }

            });
        }
        //初始化报考科目
        var initQuerySubject = function () {
            var $txtQuerySubject = $divEmployeeInfo.find("[name='ExamType']");

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

            $txtQuerySubject.empty();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择");
            $txtQuerySubject.append($optionAll);

            for (var i = 0; i < listSubject.length ; i++) {
                var Subject = listSubject[i];
                var $option = $("<option>");
                $option.val(Subject.ItemValue);
                $option.text(Subject.ItemText);
                $txtQuerySubject.append($option);
            }
        }
        //初始化报考行业
        var initQueryIndustry = function () {
            var $txtQueryIndustry = $divEmployeeInfo.find("[name='Industry']");

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
            $txtQueryIndustry.empty();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择");
            $txtQueryIndustry.append($optionAll);
            for (var i = 0; i < industryList.length ; i++) {
                var Item = industryList[i];
                var $option = $("<option>");
                $option.val(Item.ItemValue);
                $option.text(Item.ItemText);
                $txtQueryIndustry.append($option);
            }
        }
        //初始化保存按钮
        var initEmployeeSaveButton = function () {
            $("#btnEmployee_EmployeeInfoConfirm").on("click", function () {
                var checkResult = verifyForm($divEmployeeInfo);
                if (!checkResult) {
                    return;
                }
                var employeeInfo = getJson($divEmployeeInfo);
                if (employeeInfo.TrainingType == "线上培训" && employeeInfo.City == "武汉市") {
                    alert("武汉市暂未开通【线上培训】,请选择【线下培训】");
                    return false;
                }
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/RegistrationEmployee"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateRegistrationEmployee"
                }
                $("#divEmployee_EmployeeInfo").ajaxSubmit({
                    url: "/" + controllerName + functionName,
                    type: "post",
                    beforeSubmit: function (formArray, jqForm) {

                    },
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshEmployeeGrid();
                                //编辑时  保存之后关闭页面
                                var formData = getJson($("#divEmployee_EmployeeInfo"));
                                if (formData && formData.Id && formData.Id.length > 0) {
                                    $mdlEmployeeInfo.modal("toggle");
                                }
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    },
                    error: function (a, b, c) {
                        console.log(b + " " + c);
                    }
                });

                //var formData = new FormData();
                //for (var p in employeeInfo) {
                //    var pItem = employeeInfo[p];
                //    if (isArray(pItem)) {
                //        for (var i = 0; i < pItem.length; i++) {
                //            formData.append(p, pItem[i]);
                //        }
                //    }
                //    else {
                //        formData.append(p, pItem || "");
                //    }
                //}

                //ajaxRequest({
                //    url: "/" + controllerName + functionName,
                //    data: formData,
                //    type: "post",
                //    datatype: "json",
                //    processData: false,
                //    contentType: false,
                //    async: false,
                //    success: function (jdata) {
                //        if (jdata) {
                //            if (jdata.IsSuccess === true) {
                //                alert("保存成功！")
                //                refreshEmployeeGrid();
                //            } else {
                //                alert(jdata.ErrorMessage);
                //            }
                //        }
                //    }
                //});

            });
        }
        //初始化 身份证号生成出生日期
        var initIDnumberBlur = function () {
            $("#divEmployee_EmployeeInfoIDNumber").on("blur", function () {
                var $Birthday = $("#divEmployee_EmployeeInfoBirthday");
                var IDNumber = $divEmployeeInfo.find("[name='IDNumber']").val();
                if (IDNumber.length >= 18) {
                    var Birthday = IDNumber.substring(6, 10) + '-' + IDNumber.substring(10, 12) + '-' + IDNumber.substring(12, 14);
                    $Birthday.val(Birthday);
                    var sexNumber = IDNumber.substring(16, 17);
                    if (sexNumber % 2 == 0) {
                        $divEmployeeInfo.find("[name='Sex'][value='女']").prop("checked", true);
                    }
                    else {
                        $divEmployeeInfo.find("[name='Sex'][value='男']").prop("checked", true);
                    }

                }
            });
        };
        //
        var initEnterpriseName = function () {
            var getEnterpriseName = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEnterpriseName",
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
            $divEmployeeInfo.find("#txtEmployee_SelectedEnterpriseName").val(getEnterpriseName);
        }


        initIsTrainingChange();
        initExamTypeChange();
        initCity();
        initCityChange();
        //initTrainingInstitution();

        initQuerySubject();
        initQueryIndustry();
        initIDnumberBlur();
        initEmployeeSaveButton();
        initEnterpriseName();
        //setDefaultCity();
        initFormVerify();

        //$divEmployeeInfo.find("[name='IsTraining']:checked").change();
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
        initEmployeeGrid();
        initButtonArea();
        initEmployeeModal();
        initCheckedModal();
    })

})
