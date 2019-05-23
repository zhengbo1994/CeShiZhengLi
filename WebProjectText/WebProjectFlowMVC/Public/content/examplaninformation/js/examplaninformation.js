
'use strict'
$(function () {

    var controllerName = "ExamPlanInformation";
    var $divQueryArea = $('#divExamPlanInformation_QueryArea');
    var $gridMain = $("#gridExamPlanInformation_main");
    var $pagerMain = $("#pagerExamPlanInformation_main");

    //初始化查询区域
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnExamPlanInformation_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
        setInputAsDatetimePlug($divQueryArea.find("[name='ExamDatetimeBegin']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($divQueryArea.find("[name='ExamDatetimeEnd']"), "yyyy-mm-dd hh:ii");
    }
    //初始化考试计划表格
    var initExamPlanGrid = function () {

        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetExamPlanRecoderListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["ExamPlanId", "考试计划流水号", "考试开始时间", "考试结束时间", "总人数", "参考人数", "缺考人数", "合格人数", "不合格人数", "状态"],
            colModel: [
                    { name: "ExamPlanId", index: "ExamPlanId", hidden: true },
                    { name: "ExamPlanNumber", index: "ExamPlanNumber", align: "center", width: 80 },
                    { name: "ExamDatetimeBegin", index: "ExamDatetimeBegin", align: "center", width: 80 },
                    { name: "ExamDatetimeEnd", index: "ExamDatetimeEnd", align: "center", width: 80 },
                    { name: "ExamTotalCount", index: "ExamTotalCount", align: "center", width: 80 },
                    { name: "ExamCount", index: "ExamCount", align: "center", width: 80 },
                    { name: "NoExamCount", index: "NoExamCount", align: "center", width: 80 },
                    { name: "QualifiedCount", index: "QualifiedCount", align: "center", width: 80 },
                    { name: "NotQualifiedCount", index: "NotQualifiedCount", align: "center", width: 80 },
                    { name: "ExamStatus", index: "ExamStatus", align: "center", width: 80 }
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
                var subGridQueryData = getJson($divQueryArea);
                subGridQueryData.ExamPlanNumber = rowData.ExamPlanNumber;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetEmployeeForExamPlanRecoderListForJqgrid",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["人员ID", "考核点", "考场名称","座位号","准考证号", "企业名称", "姓名", "性别", "年龄", "身份证号", "报考行业", "报考科目", "安全知识考核", "管理能力考核", "实操考核", "考核结果"],
                    colModel: [
                        { name: "EmployeeId", index: "EmployeeId", width: "30", align: "center", hidden: true },
                        { name: "TrainingInstitutionName", index: "TrainingInstitutionName", width: "80", align: "center", },
                        { name: "ExamRoomName", index: "ExamRoomName", width: "50", align: "center", },
                        { name: "ExamSeatNumber", index: "ExamSeatNumber", width: "30", align: "center", },
                        { name: "ExamRegistrationNumber", index: "ExamRegistrationNumber", width: "80", align: "center", },
                        { name: "EnterpriseName", index: "EnterpriseName", width: "100", align: "center" },
                        { name: "EmployeeName", index: "EmployeeName", width: "30", align: "center" },
                        { name: "Sex", index: "Sex", width: "30", align: "center" },
                        { name: "Age", index: "Age", width: "30", align: "center" },
                        { name: "IDNumber", index: "IDNumber", width: "80", align: "center" },
                        { name: "Industry", index: "Industry", width: "50", align: "center" },
                        { name: "ExamType", index: "ExamType", width: "30", align: "center" },
                        { name: "SafetyKnowledgeExamScore", index: "SafetyKnowledgeExamScore", width: "55", align: "center" },
                        { name: "ManagementAbilityExamScore", index: "ManagementAbilityExamScore", width: "55", align: "center" },
                        { name: "ActualOperationExamResult", index: "ActualOperationExamResult", width: "40", align: "center" },
                        { name: "FinalExamResult", index: "FinalExamResult", width: "50", align: "center" },
                    ],
                    autoWidth: true,
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
                setGridHeight($gridMain.selector);
                jqGridAutoWidth();

            }
        });


    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initExamPlanGrid();
    })

})
