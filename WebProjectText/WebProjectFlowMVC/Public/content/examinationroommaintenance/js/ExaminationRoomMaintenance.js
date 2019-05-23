
'use strict'
$(function () {

    var controllerName = "ExaminationRoomMaintenance";
    var $gridExaminationRoomMaintenance = $("#gridExaminationRoomMaintenance_main");
    var $pagerExaminationRoomMaintenance = $("#pagerExaminationRoomMaintenance_main");
    var $divQueryArea = $("#divExaminationRoomMaintenance_QueryArea");
    var $divExaminationRoomMaintenanceInfo = $("#divExaminationRoomMaintenance_ExaminationRoomMaintenanceInfo");
    var $mdlExaminationRoomMaintenanceInfo = $("#mdlExaminationRoomMaintenance_ExaminationRoomMaintenanceInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshExaminationRoomMaintenanceGrid = function () {
        $gridExaminationRoomMaintenance.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function () {
        var selRowId = $gridExaminationRoomMaintenance.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridExaminationRoomMaintenance.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnExaminationRoomMaintenance_Query").on("click", function () {
                var queryData = getJson($divQueryArea)
                $gridExaminationRoomMaintenance.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            });
        };
        initQueryButton();
    };
    var initExaminationRoomMaintenanceGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divExaminationRoomMaintenance_QueryArea")
        queryData = getJson(divQueryArea)
        $gridExaminationRoomMaintenance.jqGrid({
            url: "/" + controllerName + "/GetExaminationRoomListForJqGrid",
            datatype: "json",
            postData: queryData,
            colNames: ["考场ID", "考场名称", "核定人数", "是否可用", "创建时间", "操作"],
            colModel: [
                    { name: "Id", index: "Id", align: "center", width: 30 },
                    { name: "ExamRoomName", index: "ExamRoomName", align: "center", width: 80 },
                    { name: "PersonCount", index: "PersonCount", align: "center", width: 80 },
                    { name: "Enabled", index: "Enabled", align: "center", width: 80 },
                    { name: "CreatDate", index: "CreatDate", align: "center", width: 80 },
                     {
                         name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {

                             var buttons = ''
                               + '<a href="#" title="查看" onclick="btnExaminationRoomMaintenance_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                               + '<i class="icon-zoom-in blue"></i> 查看</a>'
                               + '<a href="#" title="修改" onclick="btnExaminationRoomMaintenance_Update(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                               + '<i class="icon-zoom-in blue"></i> 修改</a>'
                               //+ '<a href="#" title="视频监控" onclick="btnExaminationRoomMaintenance_CamerView(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                               //+ '<i class="ace-icon  fa fa-video-camera"></i> 视频监控</a>'
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
            pager: $pagerExaminationRoomMaintenance,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridExaminationRoomMaintenance.selector);
            }
        });
    }
    var initButtonArea = function () {
        //显示考场详细信息
        var showExamRoomModal = function (examRoomId) {
            var getExamRoomByID = function (examRoomId) {
                var queryData = {};
                var dataResult = {};
                queryData.examRoomId = examRoomId;
                ajaxRequest({
                    url: "/" + controllerName + "/GetExamRoomById",
                    data: queryData,
                    type: "get",
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
            var edittype = currentEdittype;
            var examRoomData = {};
            if (enum_EditTypes.insert == edittype) {
                examRoomData = getJson($divExaminationRoomMaintenanceInfo);
                for (var p in examRoomData) {
                    examRoomData[p] = "";
                }
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!examRoomId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                examRoomData = getExamRoomByID(examRoomId);
            }
            setJson($divExaminationRoomMaintenanceInfo, examRoomData);
            if (enum_EditTypes.view == edittype) {
                for (var p in examRoomData) {
                    $divExaminationRoomMaintenanceInfo.find("[name='" + p + "']").prop("disabled", true);
                }
            } else {
                for (var p in examRoomData) {
                    $divExaminationRoomMaintenanceInfo.find("[name='" + p + "']").prop("disabled", false);
                }
            }
            $mdlExaminationRoomMaintenanceInfo.modal("toggle");


        }
        //初始化查询按钮
        var initViewButton = function () {
            //注册windows方法
            window.btnExaminationRoomMaintenance_View = function (examRoomId) {
                currentEdittype = enum_EditTypes.view;
                showExamRoomModal(examRoomId);
            };
        }
        //初始化插入按钮
        var initInsertButton = function () {
            $("#btnExaminationRoomMaintenance_Insert").on("click", function () {
                currentEdittype = enum_EditTypes.insert;
                showExamRoomModal();
            });
        }
        //初始化更新企业信息
        var initUpdateButton = function () {
            //注册window方法
            window.btnExaminationRoomMaintenance_Update = function (examRoomId) {
                currentEdittype = enum_EditTypes.update;
                showExamRoomModal(examRoomId);
            };
        }
        var initDeleteButton = function () {
            //注册window方法
            window.btnExaminationRoomMaintenance_Delete = function (examRoomId) {
                var queryData = {};
                if (!examRoomId) {
                    examRoomId = getSelectedRowDataOfGrid().Id;
                }
                queryData.examRoomId = examRoomId;
                if (!confirm("确认删除吗？")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/DeleteExamRoomById",
                    data: queryData,
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("删除成功！")
                            refreshExaminationRoomMaintenanceGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                });
            };
        }

        var initCamerView = function () {
            var btnExaminationRoomMaintenance_CamerView = function (examRoomId) {
                var examInvigilateUrl = "/CamerView?examRoomId=" + examRoomId;
                window.open(examInvigilateUrl);
            }
            window.btnExaminationRoomMaintenance_CamerView = btnExaminationRoomMaintenance_CamerView;
        }
        initViewButton();
        initInsertButton();
        initUpdateButton();
        initDeleteButton();
        initCamerView();

    }

    var initExamRoomModal = function () {
        //初始化保存按钮
        var initSaveButton = function () {
            $("#btnExaminationRoomMaintenance_ExaminationRoomMaintenanceInfoConfirm").on("click", function () {

                var checkResult = verifyForm($divExaminationRoomMaintenanceInfo);
                if (!checkResult) {
                    return;
                }
                var examRoomInfo = getJson($divExaminationRoomMaintenanceInfo);
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/InsertExamRoom"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateExamRoom"
                }
                else {
                    return false;
                }


                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: examRoomInfo,
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshExaminationRoomMaintenanceGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }
        initSaveButton();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initExaminationRoomMaintenanceGrid();
        initButtonArea();
        initExamRoomModal();
    })

})
