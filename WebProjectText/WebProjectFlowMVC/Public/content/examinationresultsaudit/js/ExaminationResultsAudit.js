
'use strict'
$(function () {

    var controllerName = "ExaminationResultsAudit";
    var $divQueryArea = $('#divExaminationResultsAudit_QueryArea');
    var $gridMain = $("#gridExaminationResultsAudit_main");
    var $pagerMain = $("#pagerExaminationResultsAudit_main");
    var $mdlCheckByExamPlan = $("#mdlExamResultCheck_CheckByExamPlan");
    var $divCheckByExamPlan = $("#divExamResultCheck_CheckByExamPlan");
    var $mdlCheckByEmployee = $("#mdlExamResultAduit_CheckByEmployee");
    var $divCheckByEmployee = $("#divExamResultAduit_CheckByEmployee");

    var refreshMainGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
    }
    var getSelectedRowDataOfGrid = function () {
        var selRowId = $gridManageExamresult.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridManageExamresult.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnExaminationResultsAudit_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
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
    }

    var initExamResultCheckGrid = function () {

        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetExamPlanRecoderListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["考试计划ID", "考试计划流水号", "考试开始时间", "考试结束时间", "考试人数", "操作"],
            colModel: [
                    { name: "ExamPlanId", index: "ExamPlanId", hidden: true },
                    { name: "ExamPlanNumber", index: "ExamPlanNumber", align: "center", width: 80 },
                    { name: "ExamDatetimeBegin", index: "ExamDatetimeBegin", align: "center", width: 80 },
                    { name: "ExamDatetimeEnd", index: "ExamDatetimeEnd", align: "center", width: 80 },
                    { name: "ExamCount", index: "ExamCount", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="审核" onclick="btnExaminationResultsAudit_CheckByExamPlan(' + rowobj.ExamPlanId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon  fa fa-check"></i> 审核</a>'
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
            ondblClickRow: function (rowid) {
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
                //pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = getJson($divQueryArea);
                subGridQueryData.ExamPlanId = rowData.ExamPlanId;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetEmployeeListInExamResultCheckForJqgrid",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["人员ID", "姓名", "性别", "年龄", "身份证号", "报考行业", "报考科目", "安全知识考核分数", "安全知识考核结果", "管理能力考核分数", "管理能力考核结果","实操考核结果", "最终考核结果", "审核日期", "审核状态", "操作"],
                    colModel: [
                        { name: "EmployeeId", index: "EmployeeId", width: "30", align: "center", hidden: true },
                        { name: "EmployeeName", index: "EmployeeName", width: "50", align: "center" },
                        { name: "Sex", index: "Sex", width: "40", align: "center" },
                        { name: "Age", index: "Age", width: "50", align: "center" },
                        { name: "IDNumber", index: "IDNumber", width: "80", align: "center" },
                        { name: "Industry", index: "Industry", width: "50", align: "center" },
                        { name: "ExamType", index: "ExamType", width: "50", align: "center" },
                        { name: "SafetyKnowledgeExamScore", index: "SafetyKnowledgeExamScore", width: "60", align: "center", },
                        { name: "SafetyKnowledgeExamResult", index: "SafetyKnowledgeExamResult", width: "100", align: "center" },
                        { name: "ManagementAbilityExamScore", index: "ManagementAbilityExamScore", width: "60", align: "center" },
                        { name: "ManagementAbilityExamResult", index: "ManagementAbilityExamResult", width: "100", align: "center" },
                        { name: "FieldExamResult", index: "FieldExamResult", align: "center", width: 100 },
                        { name: "FinalExamResult", index: "FinalExamResult", width: "50", align: "center"},
                        { name: "CheckDate", index: "CheckDate", width: "50", align: "center" },
                        { name: "CheckStatus", index: "CheckStatus", width: "50", align: "center" },
                        {
                            name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {

                                var buttons = ''
                                  + '<a href="#" title="审核" onclick="btnExaminationResultsAudit_CheckByEmployee(\'' + options.gid + '\',' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                                  + '<i class="ace-icon  fa fa-check"></i> 审核</a>'
                                return buttons;
                            }
                        }
                    ],
                    autoWidth: true,


                    rowNum: 9999,
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
                setGridHeight($gridMain.selector);
                jqGridAutoWidth();

            }
        });


    }

    var initCheckByExamPlanModal = function () {
        var checkByExamPlan = function (PassStatus) {
             
            var startCertificateDate = $divCheckByExamPlan.find("[name='StartCertificateDate']").val();
            var checkedMark = $divCheckByExamPlan.find("[name='CheckedMark']").val();
            if (PassStatus) {
                if (!startCertificateDate) {
                    alert("发证日期不能为空");
                    return false;
                }
                if (!checkedMark)//审核意见默认值
                {
                    $divCheckByExamPlan.find("[name='CheckedMark']").val("审核通过");
                }
            }
            else {
                if (!checkedMark) {
                    alert("审核意见不能为空");
                    return false;
                }
            }

            var postData = getJson($divCheckByExamPlan);
            postData.PassStatus = PassStatus;
            var ajaxOpt = {
                url: "/" + controllerName + "/CheckByExamPlan",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert('提交成功！');
                        $mdlCheckByExamPlan.modal("toggle");
                        refreshMainGrid();
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                },
                error: function () {
                    alert("执行失败");
                }
            }
            ajaxRequest(ajaxOpt);
        }
        var initCheckPassButton = function () {
            $("#btnExamResultCheck_Pass").on("click", function () {
                checkByExamPlan(true);
            });
        }
        var initCheckNoPassButton = function () {
            $("#btnExamResultCheck_NoPass").on("click", function () {
                checkByExamPlan(false);
            });
        }

        setInputAsDatePlug($divCheckByExamPlan.find("[name='StartCertificateDate']"));
        initCheckPassButton();
        initCheckNoPassButton();
    }

    var initCheckByEmployeeModal = function () {
        var checkByEmployee = function (PassStatus) {
             
            var startCertificateDate = $divCheckByEmployee.find("[name='StartCertificateDate']").val();
            var checkedMark = $divCheckByEmployee.find("[name='CheckedMark']").val();
            if (PassStatus) {
                if (!startCertificateDate) {
                    alert("发证日期不能为空");
                    return false;
                }
                if (!checkedMark)//审核意见默认值
                {
                    $divCheckByEmployee.find("[name='CheckedMark']").val("审核通过");
                }
            }
            else {
                if (!checkedMark) {
                    alert("审核意见不能为空");
                    return false;
                }
            }

            var postData = getJson($divCheckByEmployee);
            postData.PassStatus = PassStatus;
            var ajaxOpt = {
                url: "/" + controllerName + "/CheckByEmployee",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert('审核成功！');
                        $mdlCheckByEmployee.modal("toggle");
                        refreshMainGrid();
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                },
                error: function () {
                    alert("执行失败");
                }
            }
            ajaxRequest(ajaxOpt);
        }
        var initCheckPassButton = function () {
            $("#btnExamResultAduit_CheckByEmployeePass").on("click", function () {
                checkByEmployee(true);
            });
        }
        var initCheckNoPassButton = function () {
            $("#btnExamResultAduit_CheckByEmployeeNoPass").on("click", function () {
                checkByEmployee(false);
            });
        }
         
        setInputAsDatePlug($divCheckByEmployee.find("[name='StartCertificateDate']"));
        initCheckPassButton();
        initCheckNoPassButton();
    }

    var initButtonArea = function () {
        var getExamResult = function (employeeId) {
            var dataResult = {};
            var postData = {};
            postData.employeeId = employeeId;
            var ajaxOpt = {
                url: "/" + controllerName + "/GetExamResult",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    dataResult = jdata;
                },
                error: function () {
                    dataResult = null;
                }
            }
            ajaxRequest(ajaxOpt);
            return dataResult;
        }
        var initImgUpload = function (config) {
            var cfgOpt = {
                title: "实操考试结果图片",  //左上角标题名称
                menu: [{ 'fileKey': 'FieldExamImg', 'txt': "实操考试" }],     //右上角下拉菜单选项
                imgList: [],     //初始加载的图片
                removeImg_CallBack: function (fileId) { var result = DeleteImgFile(fileId); return result; },       //删除图片回调方法
                displayrows: 1,//显示行数
                modal_width: 400,//弹出model显示框 显示图片 宽
                modal_height: 500,//弹出model显示框 显示图片 高
                getImgUrl: "/" + controllerName + "/GetExamResultFile",//获取单个文件的Url
                edit: true//是否可以编辑
            }
            for (var p in config) {
                cfgOpt[p] = config[p];
            }
            $("#divManageExamresult_ManageExamresultInfoImageUpload").ImageUpload(cfgOpt);
        }
        var DeleteImgFile = function (fileId) {
            var result = false;
            var comfirmResult = confirm("确认删除图片！\r\n删除后将不可恢复");
            if (!comfirmResult) {
                result = false;
                return result;
            }

            var postData = {};
            postData.imgId = fileId;
            var ajaxOpt = {
                url: "/" + controllerName + "/DeleteFieldExamImgFile",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("删除成功!");
                        result = true;
                    }
                    else {
                        alert(jdata.ErrorMessage);
                        result = false;
                    }
                },
                error: function () {
                    alert("执行失败");
                }
            }
            ajaxRequest(ajaxOpt);
            return result;
        }
        window.btnExaminationResultsAudit_CheckByEmployee = function (subGridId, rowId) {
            var rowData = $("#" + subGridId).jqGrid("getRowData", rowId);
            var employeeId = rowData.EmployeeId;
            $divCheckByEmployee.find("[name='EmployeeId']").val(employeeId);
            var examResult = getExamResult(employeeId);

            $divCheckByEmployee.find("[name='SafetyKnowledgeExamResult']").text(examResult.SafetyKnowledgeExamScore);
            $divCheckByEmployee.find("[name='ManagementAbilityExamResult']").text(examResult.ManagementAbilityExamScore);
            $divCheckByEmployee.find("[name='FieldExamResult']").text(examResult.FieldExamResult);
            //$divCheckByEmployee.find("[name='CheckedMark']").val("审核通过");
            var imgCfg = { edit: false };
            imgCfg.imgList = examResult.ImgFileList;
            var ExamType = rowData.ExamType;
            if (ExamType == "C1" || ExamType == "C3") {
                $divCheckByEmployee.find("[name='FieldExamResultImg']").removeClass("hidden");
                initImgUpload(imgCfg);
            }
            else {
                $divCheckByEmployee.find("[name='FieldExamResultImg']").addClass("hidden");
            }
            $divCheckByEmployee.find("[name='StartCertificateDate']").val((new Date()).toFormatString("yyyy-MM-dd"));
            $mdlCheckByEmployee.modal('toggle');
        }
        window.btnExaminationResultsAudit_CheckByExamPlan = function (examPlanId) {
            $divCheckByExamPlan.find("[name='ExamPlanId']").val(examPlanId);
            //$divCheckByExamPlan.find("[name='CheckedMark']").val("审核通过");
            $divCheckByExamPlan.find("[name='StartCertificateDate']").val((new Date()).toFormatString("yyyy-MM-dd"));
            $mdlCheckByExamPlan.modal("toggle");
        }
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initExamResultCheckGrid();
        initButtonArea();
        initCheckByExamPlanModal();
        initCheckByEmployeeModal();

    })

})