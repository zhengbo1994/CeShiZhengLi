
'use strict'
$(function () {

    var controllerName = "CertificateDelayApply";
    var $pageContainer = $('#divCertificateDelayApply_PageContainer');
    var $divQueryArea = $pageContainer.find("[name='divQueryArea']");
    var $gridCertificate = $("#gridCertificateDelayApply_main");
    var $pagerCertificate = $("#pagerCertificateDelayApply_main");
    var $divSubmitInfo = $pageContainer.find("[name='divSubmitInfo']");
    var $mdlSubmit = $pageContainer.find("[name='mdlSubmit']");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }



    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridCertificate.jqGrid("getGridParam", "selrow");
        }
        selRowId = rowid;
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridCertificate.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $pageContainer.find("[name='btnQuery']").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea);
                $gridCertificate.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
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

        //initQueryIndustry();
        //initQuerySubject();
        initQueryButton();
    }

    var refreshEmployeeGrid = function () {
        $pageContainer.find("[name='btnQuery']").click();
    }

    var initCertificateGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea);
        $gridCertificate.jqGrid({
            url: "/" + controllerName + "/GetCertificateListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["Id", "certificateId", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "行业", "证书类型", "证书编号", "发证日期", "有效期", "当前状态", "状态修改日期"],
            colModel: [
                    { name: "employeeId", index: "employeeId", width: 30, hidden: true },
                    { name: "certificateId", index: "certificateId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 80 },
                    { name: "sex", index: "sex", align: "center", width: 50 },
                    { name: "age", index: "age", align: "center", width: 50 },
                    { name: "iDNumber", index: "iDNumber", align: "center", width: 170 },
                    { name: "job", index: "Job", align: "center", width: 80 },
                    { name: "title4Technical", index: "title4Technical", align: "center", width: 80 },
                    { name: "industry", index: "industry", align: "center", width: 80 },
                    { name: "examType", index: "examType", align: "center", width: 80 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 150 },
                    { name: "startCertificateDate", index: "startCertificateDate", align: "center", width: 80 },
                    { name: "endCertificateDate", index: "endCertificateDate", align: "center", width: 80 },
                    { name: "currentStatus", index: "submitStatus", align: "center", width: 120 },
                    { name: "operationDate", index: "operationDate", align: "center", width: 120 }
            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerCertificate,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridCertificate.selector);
            }
        });
    }

    var initButtonArea = function () {
        var initSubmitButton = function () {
            $pageContainer.find("[name='btnSubmit']").on("click", function () {
                var arrRowid = $gridCertificate.jqGrid("getGridParam", "selarrrow");
                if (arrRowid.length < 1) {
                    alert("请勾选需要提交延期申请的证书");
                    return false;
                }
                for (var i = 0; i < arrRowid.length; i++) {
                    var rowId = arrRowid[i];
                    var examType = $gridCertificate.jqGrid("getRowData", rowId).examType;
                    if (examType == "C") {
                        alert("C类证书不能延期");
                        return false;
                    }
                }
                $mdlSubmit.modal("show");
            })

        }
        initSubmitButton();
    }

    var initSubmitModal = function () {

        var initTrainingInstitution = function () {
            var $txtSelect = $divSubmitInfo.find("[name='trainingInstitutionId']");

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

        var submited = function () {
            var trainingInstitutionId = $divSubmitInfo.find("[name='trainingInstitutionId']").val();
            if (!trainingInstitutionId || trainingInstitutionId == "") {
                alert("请选择培训机构");
                return false;
            }

            var arrRowid = $gridCertificate.jqGrid("getGridParam", "selarrrow");
            var certificateIdList = [];
            for (var i = 0; i < arrRowid.length; i++) {

                var certificateId = $gridCertificate.jqGrid("getRowData", arrRowid[i]).certificateId;
                certificateIdList.push(certificateId);
            }
            if (certificateIdList.length < 1) {
                return false;
            }
            if (!confirm("确认申请【" + certificateIdList.length + "】条延期申请？")) {
                return false;
            }
            var submitedData = {};
            submitedData.trainingInstitutionId = trainingInstitutionId;
            submitedData.certificateIdList = certificateIdList;
            submitedData.submitRemark = $divSubmitInfo.find("[name='submitRemark']").val();

            ajaxRequest({
                url: "/" + controllerName + "/Submit",
                data: { "strParam": JSON.stringify(submitedData) },
                type: "post",
                datatype: "json",
                async: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.IsSuccess === false) {
                            alert(jdata.ErrorMessage);
                        } else {
                            $mdlSubmit.modal("hide");
                            alert("提交成功！");
                            refreshEmployeeGrid();
                        }
                    }
                }
            });


        }

        $mdlSubmit.find("[name='btnSubmitOk']").on("click", function () {
            submited();
        })

        //$mdlChecked.find("[name='btnSubmitCancle']").on("click", function () {
        //    checkedConfirm(false);
        //})
        initTrainingInstitution();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initCertificateGrid();
        initButtonArea();
        initSubmitModal();
    })

})
