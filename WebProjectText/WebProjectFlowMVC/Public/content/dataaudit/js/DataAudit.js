
'use strict'
$(function () {

    var controllerName = "DataAudit";
    var $divQueryArea = $('#divDataAudit_QueryArea');
    var $gridMain = $("#gridDataAudit_main");
    var $pagerMain = $("#pagerDataAudit_main");

    var $mdlDataAudit_MultiCheck = $("#mdlDataAudit_MultiCheck");
    var $divDataAudit_MultiCheck = $("#divDataAudit_MultiCheck");

    var $mdlDataAudit_SingleCheck = $("#mdlDataAudit_SingleCheck");
    var $divDataAudit_SingleCheck = $("#divDataAudit_SingleCheck");

    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshMainGrid = function () {
        $gridMain.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function () {
        var selRowId = $gridMain.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridMain.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnDataAudit_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }
        //初始化 行业
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
        //初始化 科目
        var initQueryExamType = function () {
            var $txtQueryExamType = $divQueryArea.find("[name='ExamType']");

            var getExamTypeList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeExamTypeList",
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
            var examTypeList = getExamTypeList();

            $txtQueryExamType.empty();
            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("全部");
            $txtQueryExamType.append($optionAll);
            for (var i = 0; i < examTypeList.length ; i++) {
                var examTypeItem = examTypeList[i];
                var $option = $("<option>");
                $option.val(examTypeItem.ItemValue);
                $option.text(examTypeItem.ItemText);
                $txtQueryExamType.append($option);
            }
        }

        initQueryButton();
        initQueryIndustry();
        initQueryExamType();

        setInputAsDatePlug($divQueryArea.find("[name='AuditDateBegin']"));
        setInputAsDatePlug($divQueryArea.find("[name='AuditDateEnd']"));
    }


    var initDataAuditGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetEmployeeDataAduitListForJqgrid",
            datatype: "json",
            postData: queryData,
            colNames: ["人员ID", "企业名称", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目", "审核状态", "审核单位", "审核日期", "操作"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 80 },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 80 },
                    { name: "Age", index: "Age", align: "center", width: 80 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 80 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 100 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 100 },
                    { name: "AuditStatus", index: "AuditStatus", align: "center", width: 80 },
                    { name: "AuditUnit", index: "AuditUnit", align: "center", width: 80 },
                    { name: "AuditDate", index: "AuditDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 60, align: "center", formatter: function (cellvalue, options, rowobj) {

                            var buttons = ''
                          + '<a href="#" title="删除" onclick="btnDataAudit_SingleCheck(' + rowobj.EmployeeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-check"></i> 审核</a>'
                            return buttons;
                        }
                    }
            ],
            multiselect: true,
            multiboxonly: true,
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

    var initCheckModal = function () {
        //初始化批量审核
        var initMultiCheckModal = function () {
            $("#btnDataAudit_Pass").on("click", function () {
                postChecked(true);
            });
            $("#btnDataAudit_NoPass").on("click", function () {
                postChecked(false);
            });
            var postChecked = function (passFlag) {
               
                //获取选中人员Id
                var rowIdList = $gridMain.jqGrid("getGridParam", "selarrrow");
                var employeeIdList = [];
                for (var i = 0; i < rowIdList.length; i++) {
                    var employeeId = $gridMain.jqGrid("getRowData", rowIdList[i]).EmployeeId;
                    employeeIdList.push(employeeId);
                }
                //组织上传数据
                var postFormData = new FormData();
                for (var i = 0; i < employeeIdList.length; i++) {
                    postFormData.append("EmployeeIdList", employeeIdList[i]);
                }
                postFormData.append("PassFlag", passFlag);
                postFormData.append("CheckedMark", $divDataAudit_MultiCheck.find("[name='CheckedMark']").val());
                var ajaxOption = {
                    url: "/" + controllerName + "/EmployeeDataCheck",
                    data: postFormData,
                    type: "post",
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("审核成功！")
                            refreshMainGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOption);
            };
        }
        var initSingleCheckModal = function () {
            $("#divDataAudit_SingleCheckBtnPass").on("click", function () {
                postChecked(true);
            });
            $("#divDataAudit_SingleCheckBtnNoPass").on("click", function () {
                postChecked(false);
            });
            var postChecked = function (passFlag) {
             
                //组织上传数据
                var postFormData = new FormData();
                var employeeId = $divDataAudit_SingleCheck.find("[name='EmployeeId']").val();
                postFormData.append("EmployeeIdList", employeeId);
                postFormData.append("PassFlag", passFlag);
                postFormData.append("CheckedMark", postFormData.append("CheckedMark", $divDataAudit_SingleCheck.find("[name='CheckedMark']").val()));
                var ajaxOption = {
                    url: "/" + controllerName + "/EmployeeDataCheck",
                    data: postFormData,
                    type: "post",
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("审核成功！")
                            refreshMainGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOption);
            };
        }

        initMultiCheckModal();
        initSingleCheckModal();
    }

    var initButtonArea = function () {
        var initDataCheckMulti = function () {
            $("#btnDataAduit_MultiCheck").on("click", function () {
                //验证有没有选择人员
                var selectedRowIdList = $gridMain.jqGrid("getGridParam", "selarrrow");
                if (selectedRowIdList.length < 1) {
                    alert("请勾选要审核的记录");
                    return false;
                }
                //设置默认审核意见
                $divDataAudit_MultiCheck.find("[name='CheckedMark']").val("资料齐全,同意");
                //显示审核页面
                $mdlDataAudit_MultiCheck.modal("toggle");
            });
        };
        var initDataCheckSingle = function () {
            window.btnDataAudit_SingleCheck = function (employeeId) {
             
                InitSingleCheckData(employeeId);
                $divDataAudit_SingleCheck.find("[name='CheckedMark']").val("资料齐全,同意");
                $mdlDataAudit_SingleCheck.modal("toggle");
            };
            var InitSingleCheckData = function (employeeId) {
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetEmployeeById",
                    data: { "employeeId": employeeId },
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                       
                        setJson($divDataAudit_SingleCheck, jdata);
                    },
                    error: function () {
                        dataResult = null;
                    }
                };
                ajaxRequest(ajaxOpt);
            }
        };

        initDataCheckMulti();
        initDataCheckSingle();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initDataAuditGrid();
        initButtonArea();
        initCheckModal();
    })

})
