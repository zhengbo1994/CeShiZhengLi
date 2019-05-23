
'use strict'
$(function () {

    var controllerName = "ManageExamresult";
    var $divQueryArea = $('#divManageExamResult_QueryArea');
    var $gridManageExamresult = $("#gridManageExamresult_main");
    var $pagerManageExamresult = $("#pagerManageExamresult_main");
    var $divManageExamresultInfo = $("#divManageExamresult_ManageExamresultInfo");
    var $mdlManageExamresultInfo = $("#mdlManageExamresult_ManageExamresultInfo");
    var $mdlManageExamresultFileUpload = $("#mdlManageExamresult_FileUpload");
    var $mdlEnterpriseInfo = $("#mdlManageExamresult_EnterpriseInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshManageExamresultGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridManageExamresult.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

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
            $("#btnManageExamresult_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridManageExamresult.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
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

    var initManageExamresultGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divManageExamresult_QueryArea")
        queryData = getJson(divQueryArea)
        $gridManageExamresult.jqGrid({
            url: "/" + controllerName + "/GetEmployeeExamResultListForJqgrid",
            datatype: "json",
            postData: queryData,
            colNames: ["人员ID", "考试计划ID", "考场计划流水号", "姓名", "性别", "年龄", "身份证号", "报考行业", "报考科目", "安全知识考核分数", "安全知识考核结果", "管理能力考核分数", "管理能力考核结果", "实操考核结果","最终考核结果", "提交状态", "操作"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "ExamPlanId", index: "ExamPlanId", width: 30, hidden: true },
                    { name: "ExamPlanNumber", index: "ExamPlanNumber", align: "center", width: 100 },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 50 },
                    { name: "Sex", index: "Sex", align: "center", width: 30 },
                    { name: "Age", index: "Age", align: "center", width: 30 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 100 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 50 },
                    { name: "SafetyKnowledgeExamScore", index: "SafetyKnowledgeExamScore", align: "center", width: 100 },
                    { name: "SafetyKnowledgeExamResult", index: "SafetyKnowledgeExamResult", align: "center", width: 100 },
                     { name: "ManagementAbilityExamScore", index: "ManagementAbilityExamScore", align: "center", width: 100 },
                    { name: "ManagementAbilityExamResult", index: "ManagementAbilityExamResult", align: "center", width: 100 },
                    { name: "FieldExamResult", index: "FieldExamResult", align: "center", width: 100 },
                    { name: "FinalExamResult", index: "FinalExamResult", align: "center", width: 80 },
                    { name: "SubmitStatus", index: "SubmitStatus", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {

                            var buttons = ''
                              + '<a href="#" title="录入考核结果" onclick="btnManageExamResult_InputExamResult(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-edit"></i> 录入考核结果</a>'
                            return buttons;
                        }
                    },
            ],
            autowidth: true,
            multiselect: true,
            multiboxonly: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerManageExamresult,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridManageExamresult.selector);
            }
        });
    }

    var initButtonArea = function () {
        var getExamResult = function (employeeId) {
            var dataResult = {};
            var ajaxOpt = {
                url: "/" + controllerName + "/GetExamResult",
                data: { employeeId: employeeId, timeStr: new Date().toDateString() },
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
                title: "实操考试结果图片上传",  //左上角标题名称
                menu: [{ 'fileKey': 'FieldExamImg', 'txt': "实操考试" }],     //右上角下拉菜单选项
                imgList: [],     //初始加载的图片
                removeImg_CallBack: function (fileId) { var result = DeleteImgFile(fileId); return result; },       //删除图片回调方法
                displayrows: 2,//显示行数
                modal_width: 400,//弹出model显示框 显示图片 宽
                modal_height: 500,//弹出model显示框 显示图片 高
                getImgUrl: "/" + controllerName + "/GetExamResultFile",//获取单个文件的Url
                edit: true,//是否可以编辑
                parentModal: $mdlManageExamresultInfo
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

            var ajaxOpt = {
                url: "/" + controllerName + "/DeleteFieldExamImgFile",
                data: { "imgId": fileId },
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
        window.btnManageExamResult_InputExamResult = function (rowId) {
            var rowData = $gridManageExamresult.jqGrid("getRowData", rowId);
            var examType = rowData.ExamType;
            var submitStatus = rowData.SubmitStatus;
            if (examType != "C1" && examType != "C3") {
                alert("报考C1、C3的人员需要上传实操考核结果");
                return false;
            }
            var employeeId = rowData.EmployeeId;
            $divManageExamresultInfo.find("[name='EmployeeId']").val(employeeId);
            var examResult = getExamResult(employeeId);
            var imgCfg = {};
            if (examResult.ImgFileList)//如果存在 考试结果  赋值
            {
                $divManageExamresultInfo.find("[name='ExamPlanId']").val(examResult.ExamPlanRecordId);
                $divManageExamresultInfo.find("[name='EmployeeId']").val(examResult.EmployeeId);
                $divManageExamresultInfo.find("[name='SafetyKnowledgeExamResult']").text(examResult.SafetyKnowledgeExamResult);
                $divManageExamresultInfo.find("[name='ManagementAbilityExamResult']").text(examResult.ManagementAbilityExamResult);
                imgCfg.imgList = examResult.ImgFileList;
                imgCfg.edit = submitStatus == "已提交" ? false : true;
            }
            initImgUpload(imgCfg);
            $mdlManageExamresultInfo.modal('toggle');
        }
        var initSubmit = function () {
            $("#btnManageExamresult_Submit").on("click", function () {
                var rowIdList = $gridManageExamresult.jqGrid("getGridParam", "selarrrow");
                if (rowIdList.length < 1) {
                    alert("请选择要提交的记录");
                    return false;
                }
                if (!confirm("确定提交勾选的考试结果吗？")) {
                    return false;
                }

                var postData = {};
                postData.employeeIdList = [];
                for (var i = 0; i < rowIdList.length; i++) {
                    var rowData = $gridManageExamresult.jqGrid("getRowData", rowIdList[i]);
                    var examType = rowData.ExamType;
                    var fieldExamResult = rowData.FieldExamResult;
                    var employeeName = rowData.EmployeeName;
                    if (!fieldExamResult && (examType == "C1" || examType == "C3")) {
                        alert("报考C1、C3的人员需要上传实操考核结果\r\n【" + employeeName + "】需要上传实操结果");
                        return false;
                    }
                    var employeeId = rowData.EmployeeId;
                    postData.employeeIdList.push(employeeId);
                }
                var ajaxOpt = {
                    url: "/" + controllerName + "/SubmitExamResult",
                    data: { strData: JSON.stringify(postData) },
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert('提交成功！');
                            refreshManageExamresultGrid();
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

            });
        }
        initSubmit();
    }

    var initManageExamresultModal = function () {
        var initSaveButton = function () {
            $("#btnManageExamresult_ManageExamresultInfoConfirm").on("click", function () {

                //var postData = getForm($divManageExamresultInfo);
                var ajaxOpt = {
                    url: "/" + controllerName + "/SaveFieldExamImg",
                    // data: postData,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("保存成功!");
                            $mdlManageExamresultInfo.modal("toggle");
                            refreshManageExamresultGrid();
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    },
                    error: function () {
                        alert("执行失败");
                    }
                }
                $divManageExamresultInfo.ajaxSubmit(ajaxOpt);
                //ajaxRequest(ajaxOpt);
            });
        }
        initSaveButton();
    }
    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initManageExamresultGrid();
        initButtonArea();
        initManageExamresultModal();

    })

})
