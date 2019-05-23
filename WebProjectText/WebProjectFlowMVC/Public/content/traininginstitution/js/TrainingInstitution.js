
'use strict'
$(function () {
    var controllerName = "TrainingInstitution";
    var $gridTrainingInstitution = $("#gridTrainingInstitution_main");
    var $pagerTrainingInstitution = $("#pagerTrainingInstitution_main");
    var $divTrainingInstitutionInfo = $("#divTrainingInstitution_TrainingInstitutionInfo");
    var $mdlTrainingInstitutionInfo = $("#mdlTrainingInstitution_TrainingInstitutionInfo");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshTraininginstitutionGrid = function () {
        $gridTrainingInstitution.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectRowDataOfGrid = function () {
        var selRowId = $gridTrainingInstitution.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridTrainingInstitution.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnTrainingInstitution_Query").on("click", function () {
                var queryData = {};
                var divQueryArea = $("#divTrainingInstitution_QueryArea")
                queryData = getJson(divQueryArea)
                $gridTrainingInstitution.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryCityAndArea = function () {
            var $txtQueryCityInput = $("#divTrainingInstitution_QueryAreaCity");
            var $txtQueryAreaInput = $("#divTrainingInstitution_QueryAreaInput");
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
                $txtQueryAreaInput.append("$optionAreaAll");
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
    var initTrainingInstitutionGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divTrainingInstitution_QueryArea")
        queryData = getJson(divQueryArea)
        $gridTrainingInstitution.jqGrid({
            url: "/" + controllerName + "/GetTrainInstitutionListForJqGrid",
            datatype: "json",
            postData: queryData,
            colNames: ["Id", "培训机构名称", "社会信用代码", "法定代表人", "法定代表人电话", "联系人", "联系人电话", "城市", "区域", "地址", "操作"],
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
                         + '<a href="#" title="查看" onclick="btnTrainingInstitution_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search"></i> 查看</a>'
                         + '<a href="#" title="修改" onclick="btnTrainingInstitution_Update(' + rowobj.Id + ')" style="padding:7px;line-height:1em;">'
                            + '<i class="ace-icon fa fa-edit"></i>修改</a>'
                            //+ '<a href="#" title="删除" onclick="btnTrainingInstitution_Delete(' + rowobj.Id + ')" style="padding:7px;line-height:1em;">'
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
            pager: $pagerTrainingInstitution,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridTrainingInstitution.selector);
            }
        })
    }

    var initButtonArea = function () {
        //显示考核点信息
        var showTrainingIstitutionModal = function (trainingInstitutionId) {
            var getTrainingInstitutionByID = function (trainingInstitutionId) {
                var queryData = {};
                var dataResult = {};
                queryData.trainingInstitutionId = trainingInstitutionId;
                ajaxRequest({
                    url: "/" + controllerName + "/GetTrainingInstitutionById",
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
            var trainingInstitutionData = {};
            if (enum_EditTypes.insert == edittype) {
                trainingInstitutionData = getJson($divTrainingInstitutionInfo);
                for (var p in trainingInstitutionData) {
                    trainingInstitutionData[p] = "";
                }
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!trainingInstitutionId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                trainingInstitutionData = getTrainingInstitutionByID(trainingInstitutionId);
            }
            setJson($divTrainingInstitutionInfo, trainingInstitutionData);

            if (enum_EditTypes.view == edittype) {
                for (var p in trainingInstitutionData) {
                    $divTrainingInstitutionInfo.find("[name='" + p + "']").prop("disabled", true);
                }
                $mdlTrainingInstitutionInfo.find("#btnTrainingInstitution_TrainingInstitutionInfoConfirm").addClass("hidden")
            } else {
                for (var p in trainingInstitutionData) {
                    $divTrainingInstitutionInfo.find("[name='" + p + "']").prop("disabled", false);
                }
                $mdlTrainingInstitutionInfo.find("#btnTrainingInstitution_TrainingInstitutionInfoConfirm").removeClass("hidden")
            }
            $mdlTrainingInstitutionInfo.modal("toggle");
        }
        //初始化插入按钮
        var initInsertButton = function () {
            $("#btnTrainingInstitution_Insert").on("click", function () {
                currentEdittype = enum_EditTypes.insert;
                showTrainingIstitutionModal();
            })
        }
        //初始化查看按钮
        var initSearchButton = function () {
            //注册windows方法
            window.btnTrainingInstitution_View = function (trainingInstitutionId) {
                currentEdittype = enum_EditTypes.view;
                showTrainingIstitutionModal(trainingInstitutionId);
            }
        }
        //初始化更新按钮
        var initUpdateButton = function () {
            window.btnTrainingInstitution_Update = function (trainingInstitutionId) {
                currentEdittype = enum_EditTypes.update;
                showTrainingIstitutionModal(trainingInstitutionId);
            }
        }
        //初始化删除按钮
        var initDeleteButtton = function () {
            window.btnTrainingInstitution_Delete = function (trainingInstitutionId) {
                var queryData = {};
                if (!trainingInstitutionId) {
                    trainingInstitutionId = getSelectRowDataOfGrid().Id;
                }
                queryData.trainingInstitutionId = trainingInstitutionId;
                if (!confirm("确认删除吗？")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/DeleteTrainingInstitutionById",
                    data: queryData,
                    type: "post",
                    datatype: "Json",
                    ansyc: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("删除成功！")
                            refreshTraininginstitutionGrid();
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

    var initTrainingInstitutionModal = function () {
        //初始化考核点城市和区域 联动效果
        var initTrainingInstitutionCityAndArea = function () {
            var $txtCity = $("#divTrainingInstitution_TrainingInstitutionInfoCity");
            var $txtArea = $("#divTrainingInstitution_TrainingInstitutionInfoArea");

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
        var initTrainingInstitutionSavaButton = function () {

            $("#btnTrainingInstitution_TrainingInstitutionInfoConfirm").on("click", function () {
                var checkResult = verifyForm($divTrainingInstitutionInfo);
                if (!checkResult) {
                    return;
                }
                var trainingInstitutionInfo = getJson($divTrainingInstitutionInfo);
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/InsertTrainingInstitution"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateTrainingInstitution"
                }
                if (!functionName) {
                    return false;
                }
                //var fData = new FormData();
                //for (var p in trainingInstitutionInfo) {
                //    fData.append(p, trainingInstitutionInfo[p] || "");
                //}
                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: trainingInstitutionInfo,
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                $mdlTrainingInstitutionInfo.modal("toggle");
                                refreshTraininginstitutionGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });
            });
        }


        initTrainingInstitutionCityAndArea();
        initTrainingInstitutionSavaButton();
    }


    $(document).ready(function () {
        initQueryArea();
        initTrainingInstitutionGrid();
        initButtonArea();
        initTrainingInstitutionModal();
    })
})