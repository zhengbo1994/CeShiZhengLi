
'use strict'
$(function () {
    var controllerName = "Examinationpoint";
    var $gridExaminationPoint = $("#gridExaminationPoint_main");
    var $pagerExaminationPoint = $("#pagerExaminationPoint_main");
    var $divExaminationPointInfo = $("#divExaminationPoint_ExaminationPointInfo");
    var $mdlExaminationPointInfo = $("#mdlExaminationPoint_ExaminationPointInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshExaminationPointGrid = function () {
        $gridExaminationPoint.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectRowDataOfGrid = function () {
        var selRowId = $gridExaminationPoint.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridExaminationPoint.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnExaminationPoint_Query").on("click", function () {
                var queryData = {};
                var divQueryArea = $("#divExaminationPoint_QueryArea")
                queryData = getJson(divQueryArea)
                $gridExaminationPoint.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryCityAndArea = function () {
            var $txtQueryCityInput = $("#divExaminationPoint_QueryAreaCity");
            var $txtQueryAreaInput = $("#divExaminationPoint_QueryAreaInput");
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
            $optionCityAll.text("全部");
            $optionCityAll.val("");
            $txtQueryCityInput.append($optionCityAll);

            for (var i = 0; i < listCity.length; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtQueryCityInput.append($option);
            }
            //给城市绑定change事件
            $txtQueryCityInput.on("change", function () {

                initQueryAreaInput();
            })
            var initQueryAreaInput = function () {

                var jdata = {};
                jdata.CityName = $txtQueryCityInput.val();;
                var getAreaList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetAreaListByCityName",
                        type: "post",
                        datatype: "json",
                        data: jdata,
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
                var listArea = getAreaList();
                $txtQueryAreaInput.empty();
                var $optionAreaAll = $("<option>");
                $optionAreaAll.val("");
                $optionAreaAll.text("全部");
                $txtQueryAreaInput.append($optionAreaAll);
                for (var i = 0; i < listArea.length; i++) {
                    var area = listArea[i];
                    var $option = $("<option>");
                    $option.val(area);
                    $option.text(area);
                    $txtQueryAreaInput.append($option);
                }
            }
        }
        initQueryButton();
        initQueryCityAndArea();
    }
    var initExaminationPointGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divExaminationPoint_QueryArea")
        queryData = getJson(divQueryArea)
        $gridExaminationPoint.jqGrid({
            url: "/" + controllerName + "/GetExaminationPointListForJqGrid",
            datatype: "json",
            postData: queryData,
            colNames: ["Id", "考核点名称", "社会信用代码", "法定代表人", "法定代表人电话", "联系人", "联系人电话", "城市", "区域", "地址", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "InstitutionName", index: "InstitutionName", align: "center", width: 80 },
                    { name: "SocialCreditCode", index: "SocialCreditCode", align: "center", width: 80 },
                    { name: "LegalRepresentative", index: "LegalRepresentative", align: "center", width: 80 },
                    { name: "LegalRepresentativeNumber", index: "LegalRepresentativeNumber", align: "center", width: 80 },
                    { name: "ContactPerson", index: "ContactPerson", align: "center", width: 80 },
                    { name: "ContactNumber", index: "ContactNumber", align: "center", width: 80 },
                    { name: "City", index: "City", align: "center", width: 80 },
                    { name: "Area", index: "Area", align: "center", width: 80 },
                    { name: "Address", index: "Address", align: "center", width: 100 },
                    {
                        name: "操作", index: "操作", key: true, width: 110, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                         + '<a href="#" title="查看" onclick="btnExaminationPoint_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search"></i> 查看</a>'
                         + '<a href="#" title="修改" onclick="btnExaminationPoint_Update(' + rowobj.Id + ')" style="padding:7px;line-height:1em;">'
                            + '<i class="ace-icon fa fa-edit"></i>修改</a>'
                            //+ '<a href="#" title="删除" onclick="btnExaminationPoint_Delete(' + rowobj.Id + ')" style="padding:7px;line-height:1em;">'
                            //   + '<i class="icon-zoom-in blue"></li>删除</a>'
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
            pager: $pagerExaminationPoint,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridExaminationPoint.selector);
            },
            ondblClickRow: function (rowid, iRow, iCol, e) {
                $gridExaminationPoint.jqGrid("toggleSubGridRow", rowid);
            },
            subGrid: true,
            subGridOptions: {
                "plusicon": "ace-icon fa fa-plus",
                "minusicon": "ace-icon fa fa-minus",
                "openicon": "ace-icon fa fa-share",
            },
            subGridRowExpanded: function (subgrid_id, row_id) {
                var subgrid_table_id, pager_id;
                var rowData = $gridExaminationPoint.jqGrid("getRowData", row_id);
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = {};
                subGridQueryData.ExaminationPointId = rowData.Id;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetExaminationRoomListForJqGrid",
                    datatype: "json",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["Id", "考场名称", "核定人数"],
                    colModel: [
                            { name: "Id", index: "Id", width: 30, hidden: true },
                            { name: "ExamRoomName", index: "ExamRoomName", align: "center", width: 200 },
                            { name: "PersonCount", index: "PersonCount", align: "center", width: 80 }
                    ],
                    autoWidth: false,
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        return false;
                    },
                    loadComplete: function () {
                        //jqGridAutoWidth();
                    }
                });
            }
        })
    }

    var initButtonArea = function () {
        //显示考核点信息
        var showTrainingIstitutionModal = function (ExaminationPointId) {
            var getExaminationPointByID = function (ExaminationPointId) {
                var queryData = {};
                var dataResult = {};
                queryData.examinationPointId = ExaminationPointId;
                ajaxRequest({
                    url: "/" + controllerName + "/GetExaminationPointById",
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
            var ExaminationPointData = {};
            if (enum_EditTypes.insert == edittype) {
                ExaminationPointData = getJson($divExaminationPointInfo);
                for (var p in ExaminationPointData) {
                    ExaminationPointData[p] = "";
                }
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!ExaminationPointId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                ExaminationPointData = getExaminationPointByID(ExaminationPointId);
            }
            setJson($divExaminationPointInfo, ExaminationPointData);

            if (enum_EditTypes.view == edittype) {
                for (var p in ExaminationPointData) {
                    $divExaminationPointInfo.find("[name='" + p + "']").prop("disabled", true);
                }
                $mdlExaminationPointInfo.find("#btnExaminationPoint_ExaminationPointInfoConfirm").addClass("hidden")
            } else {
                for (var p in ExaminationPointData) {
                    $divExaminationPointInfo.find("[name='" + p + "']").prop("disabled", false);
                }
                $mdlExaminationPointInfo.find("#btnExaminationPoint_ExaminationPointInfoConfirm").removeClass("hidden")
            }
            $mdlExaminationPointInfo.modal("toggle");
        }
        //初始化插入按钮
        var initInsertButton = function () {
            $("#btnExaminationPoint_Insert").on("click", function () {
                currentEdittype = enum_EditTypes.insert;
                showTrainingIstitutionModal();
            })
        }
        //初始化查看按钮
        var initSearchButton = function () {
            //注册windows方法
            window.btnExaminationPoint_View = function (ExaminationPointId) {
                currentEdittype = enum_EditTypes.view;
                showTrainingIstitutionModal(ExaminationPointId);
            }
        }
        //初始化更新按钮
        var initUpdateButton = function () {
            window.btnExaminationPoint_Update = function (ExaminationPointId) {
                currentEdittype = enum_EditTypes.update;
                showTrainingIstitutionModal(ExaminationPointId);
            }
        }
        //初始化删除按钮
        var initDeleteButtton = function () {
            window.btnExaminationPoint_Delete = function (ExaminationPointId) {
                var queryData = {};
                if (!ExaminationPointId) {
                    ExaminationPointId = getSelectRowDataOfGrid().Id;
                }
                queryData.ExaminationPointId = ExaminationPointId;
                if (!confirm("确认删除吗？")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/DeleteExaminationPointById",
                    data: queryData,
                    type: "post",
                    datatype: "Json",
                    ansyc: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("删除成功！")
                            refreshExaminationPointGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                });

            };
        }

        initInsertButton();
        initSearchButton();
        initUpdateButton();
        initDeleteButtton();
    }

    var initExaminationPointModal = function () {
        //初始化考核点城市和区域 联动效果
        var initExaminationPointCityAndArea = function () {
            var $txtCity = $("#divExaminationPoint_ExaminationPointInfoCity");
            var $txtArea = $("#divExaminationPoint_ExaminationPointInfoArea");

            var getCityList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetCityList",
                    type: "POST",
                    datatype: "Json",
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
            $txtCity.empty();
            var $optionCityAll = $("<option>");
            $optionCityAll.val("");
            $optionCityAll.text("请选择");
            $txtCity.append($optionCityAll);
            for (var i = 0; i < listCity.length; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtCity.append($option);
            }
            var initArea = function () {
                var jdata = { 'cityName': $txtCity.val() };
                var getAreaList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetAreaListByCityName",
                        type: "post",
                        data: jdata,
                        datatype: "Json",
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
                var listArea = getAreaList();
                $txtArea.empty();
                var $optionAreaAll = $("<option>");
                $optionAreaAll.val("");
                $optionAreaAll.text("请选择");
                $txtArea.append($optionAreaAll);

                for (var i = 0; i < listArea.length; i++) {
                    var area = listArea[i];
                    var $option = $("<option>");
                    $option.val(area);
                    $option.text(area);
                    $txtArea.append($option);
                }
            }
            initArea();
            $txtCity.on("change", function () {
                initArea();
            })
        }

        //初始化保存按钮
        var initExaminationPointSavaButton = function () {

            $("#btnExaminationPoint_ExaminationPointInfoConfirm").on("click", function () {
                var checkResult = verifyForm($divExaminationPointInfo);
                if (!checkResult) {
                    return;
                }
                var ExaminationPointInfo = getJson($divExaminationPointInfo);
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/InsertExaminationPoint"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateExaminationPoint"
                }
                if (!functionName) {
                    return false;
                }
                //var fData = new FormData();
                //for (var p in ExaminationPointInfo) {
                //    fData.append(p, ExaminationPointInfo[p] || "");
                //}
                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: ExaminationPointInfo,
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                $mdlExaminationPointInfo.modal("toggle");
                                refreshExaminationPointGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });
            });
        }


        initExaminationPointCityAndArea();
        initExaminationPointSavaButton();
    }


    $(document).ready(function () {
        initQueryArea();
        initExaminationPointGrid();
        initButtonArea();
        initExaminationPointModal();
    })
})