
'use strict'
$(function () {

    var controllerName = "EmployeeInformation";
    var $queryArea = $('#divEmployeeInformation_QueryArea');
    var $gridMain = $("#gridEmployeeInformation_main");
    var $pagerMain = $("#pagerEmployeeInformation_main");
    var $divEmployeeInfo = $("#divEmployee_EmployeeInfo");
    var $mdlEmployeeInfo = $("#mdlEmployee_EmployeeInfo");

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnEmployeeInformation_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($queryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryIndustry = function () {
            var $txtQueryIndustry = $queryArea.find("[name='Industry']");
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
            var $txtQuerySubject = $queryArea.find("[name='ExamType']");

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

    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($queryArea);
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetEmployeeListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["报名记录Id", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目", "安全知识成绩", "管理能力成绩", "安全知识考核结果", "管理能力考核结果", "实操考核结果", "本次考核结果", "当前状态", "状态修改日期", "企业名称"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 30 },
                    { name: "Age", index: "Age", align: "center", width: 30 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 100 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "SafetyKnowledgeExamScore", index: "SafetyKnowledgeExamScore", align: "center", width: 80 },
                    { name: "ManagementAbilityExamScore", index: "ManagementAbilityExamScore", align: "center", width: 80 },
                    { name: "SafetyKnowledgeExamResult", index: "SafetyKnowledgeExamResult", align: "center", width: 80 },
                    { name: "ManagementAbilityExamResult", index: "ManagementAbilityExamResult", align: "center", width: 80 },
                    { name: "ActualOperationExamResult", index: "ActualOperationExamResult", align: "center", width: 80 },
                    { name: "FinalExamResult", index: "FinalExamResult", align: "center", width: 80 },
                    { name: "CurrentStatus", index: "SubmitStatus", align: "center", width: 80 },
                    { name: "OperationDate", index: "OperationDate", align: "center", width: 80 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 200 }
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
            ondblClickRow: function (rowid, iRow, iCol, e) {
                $gridMain.jqGrid("toggleSubGridRow", rowid);
            },
            subGrid: true,
            subGridOptions: {
                "plusicon": "ace-icon fa fa-plus",
                "minusicon": "ace-icon fa fa-minus",
                "openicon": "ace-icon fa fa-share",
            },
            subGridRowExpanded: function (subgrid_id, row_id) {
                var subgrid_table_id, pager_id;
                var rowData = $gridMain.jqGrid("getRowData", row_id);
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = {};
                subGridQueryData.employeeId = rowData.EmployeeId;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetWorkFlow",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    rowNum: 10,
                    colNames: ["操作时间", "操作人", "操作", "备注"],
                    colModel: [
                        { name: "OperaDateTime", index: "OperaDateTime", width: "150", align: "center", },
                        { name: "OperaUserName", index: "OperaUserName", width: "200", align: "center", },
                        { name: "Operation", index: "Operation", width: "200", align: "center", },
                        { name: "Remark", index: "Remark", width: "500", align: "center", }

                    ],
                    autoWidth: false,
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        return false;
                    },
                    loadComplete: function () {

                    }
                });
            },
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridMain.selector);
            }
        });
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
    })

})
