
'use strict'
$(function () {

    var controllerName = "ExamManage";
    var $examPlan_QueryArea = $('#divExamManage_QueryArea');
    var $gridExamPlan = $("#gridExamManage_main");
    var $pagerExamPlan = $("#pagerExamManage_main");

    var refreshExamPlanGrid = function () {
        $gridExamPlan.trigger("reloadGrid");
    }
    //初始化查询区域
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnExamManage_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($examPlan_QueryArea)
                $gridExamPlan.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
        setInputAsDatetimePlug($examPlan_QueryArea.find("[name='ExamDatetimeBegin']"), "yyyy-mm-dd hh:ii");
        setInputAsDatetimePlug($examPlan_QueryArea.find("[name='ExamDatetimeEnd']"), "yyyy-mm-dd hh:ii");
    }
    //初始化考试计划表格
    var initExamPlanGrid = function () {
        var queryData = {};
        var divQueryArea = $examPlan_QueryArea;
        queryData = getJson(divQueryArea)
        $gridExamPlan.jqGrid({
            url: "/" + controllerName + "/GetExamInfoInExamingForJqgrid",
            datatype: "json",
            postData: queryData,
            colNames: ["ExamPlanId", "考试核心考试ID", "考核点ID", "考场ID", "考试计划流水号", "考试开始时间", "考试结束时间", "考核点名称", "考场", "考试人数", "操作"],
            colModel: [
                    { name: "ExamPlanId", index: "ExamPlanId", hidden: true },
                    { name: "ExamCoreExamId", index: "ExamCoreExamId", hidden: true },
                    { name: "TrainingInstitutionId", index: "TrainingInstitutionId", hidden: true },
                    { name: "ExamRoomId", index: "ExamRoomId", hidden: true },
                    { name: "ExamPlanNumber", index: "ExamPlanNumber", align: "center", width: 80 },
                    { name: "ExamDateTimeBegin", index: "ExamDatetimeBegin", align: "center", width: 80 },
                    { name: "ExamDateTimeEnd", index: "ExamDatetimeEnd", align: "center", width: 80 },
                    { name: "TrainingInstitutionName", index: "TrainingInstitutionName", align: "center", width: 80 },
                    { name: "ExamRoomName", index: "ExamRoomName", align: "center", width: 80 },
                    { name: "ExamEmployeeCnt", index: "ExamEmployeeCnt", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 180, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                             + '<a href="#" title="监考" onclick="ExamManage_ExamInvigilate(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                             + '<i class="ace-icon  fa fa-share"></i> 监考</a>'
                             + '<a href="#" title="视频监控" onclick="ExamManage_CamerView(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                             + '<i class="ace-icon  fa fa-video-camera"></i> 视频监控</a>'
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
            pager: $pagerExamPlan,
            ondblClickRow: function (rowid) {
                $gridExamPlan.jqGrid("toggleSubGridRow", rowid);
            },
            //subGrid: true,
            subGridOptions: {
                "plusicon": "ace-icon fa fa-plus",
                "minusicon": "ace-icon fa fa-minus",
                "openicon": "ace-icon fa fa-share",
            },
            subGridRowExpanded: function (subgrid_id, row_id) {
                var subgrid_table_id, pager_id;
                var rowData = $gridExamPlan.jqGrid("getRowData", row_id);
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = getJson($examPlan_QueryArea);
                subGridQueryData.ExamPlanNumber = rowData.ExamPlanNumber;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetEmployeeForExamPlanRecoderListForJqgrid",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["人员ID", "考核点", "考场名称", "企业名称", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "报考行业", "报考科目"],
                    colModel: [
                        { name: "EmployeeId", index: "EmployeeId", width: "30", align: "center", hidden: true },
                        { name: "TrainingInstitutionName", index: "TrainingInstitutionName", width: "50", align: "center", },
                        { name: "ExamRoomName", index: "ExamRoomName", width: "30", align: "center", },
                        { name: "EnterpriseName", index: "EnterpriseName", width: "50", align: "center" },
                        { name: "EmployeeName", index: "EmployeeName", width: "50", align: "center" },
                        { name: "Sex", index: "Sex", width: "40", align: "center" },
                        { name: "Age", index: "Age", width: "50", align: "center" },
                        { name: "IDNumber", index: "IDNumber", width: "80", align: "center" },
                        { name: "Job", index: "Job", width: "50", align: "center" },
                        { name: "Title4Technical", index: "Title4Technical", width: "50", align: "center" },
                        { name: "Industry", index: "Industry", width: "50", align: "center" },
                        { name: "ExamType", index: "ExamType", width: "50", align: "center" }
                    ],
                    autoWidth: true,


                    //rowNum: 9999,
                    //pager: "#p_" + subgrid_table_id,                
                    //rowList: [10, 20, 30], 
                    //sortname: "CheckTime",
                    //sortorder: "desc",
                    //height: "100%",
                    //viewrecords: true,
                    loadComplete: function () {
                        jqGridAutoWidth();
                    }
                });
            },
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                setGridHeight($gridExamPlan.selector);
                jqGridAutoWidth();

            }
        });


    }
    //初始化按钮区域
    var initButtonArea = function () {

        window.ExamManage_ExamInvigilate = function (rowId) {
            var rowData = $gridExamPlan.jqGrid("getRowData", rowId);
            var examCoreExamId = rowData.ExamCoreExamId;
            var examRoomId = rowData.ExamRoomId;
            var examPlanId = rowData.ExamPlanId;
            var examInvigilateUrl = "/ExamInvigilate?examCoreExamId=" + examCoreExamId + "&examRoomId=" + examRoomId + "&examPlanId=" + examPlanId;
            window.open(examInvigilateUrl);
        }
        window.ExamManage_CamerView = function (rowId) {
            var rowData = $gridExamPlan.jqGrid("getRowData", rowId);
            var examRoomId = rowData.ExamRoomId;
            var examInvigilateUrl = "/CamerView?examRoomId=" + examRoomId;
            window.open(examInvigilateUrl);
        }
    }
    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initButtonArea();
        initExamPlanGrid();
    })

})
