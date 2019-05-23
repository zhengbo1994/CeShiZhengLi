
'use strict'
$(function () {
    var controllerName = "Enterprise";
    var $gridEnterprise = $("#gridEnterprise_main");
    var $pagerEnterprise = $("#pagerEnterprise_main");
    var $divEnterpriseInfo = $("#divEnterprise_EnterpriseInfo");
    var $mdlEnterpriseInfo = $("#mdlEnterprise_EnterpriseInfo");
    var $mdlEmployeeFileUpload = $("#mdlEmployee_FileUpload");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshEnterpriseGrid = function () {
        $gridEnterprise.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function () {
        var selRowId = $gridEnterprise.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridEnterprise.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }



    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnEnterprise_Query").on("click", function () {
                var queryData = {};
                var divQueryArea = $("#divEnterprise_QueryArea")
                queryData = getJson(divQueryArea)
                $gridEnterprise.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryCity = function () {
            var $txtQueryCity = $("#divEnterprise_QueryAreaCity");
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

            $optionCityAll.val("");

            $optionCityAll.text("全部");
            $txtQueryCity.append($optionCityAll);

            for (var i = 0; i < listCity.length ; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtQueryCity.append($option);
            }
            $("#divEnterprise_QueryAreaCity").on("change", function () {
                initQueryAreaArea();
            })
        }
        var initQueryAreaArea = function () {
            var $txtQueryCity = $("#divEnterprise_QueryAreaCity");
            var jdata = { 'cityName': $txtQueryCity.val() };
            var $txtQueryAreaArea = $("#divEnterprise_QueryAreaArea");
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
            $txtQueryAreaArea.empty();
            var $optionAreaAll = $("<option>");

            $optionAreaAll.val("");

            $optionAreaAll.text("全部");
            $txtQueryAreaArea.append($optionAreaAll);

            for (var i = 0; i < listArea.length ; i++) {
                var area = listArea[i];
                var $option = $("<option>");
                $option.val(area);
                $option.text(area);
                $txtQueryAreaArea.append($option);
            }

        }

        initQueryCity();
        initQueryButton();
    }

    var initEnterpriseGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divEnterprise_QueryArea")
        queryData = getJson(divQueryArea)
        debugger;
        $gridEnterprise.jqGrid({
            url: "/" + controllerName + "/GetEnterpriseListForJqgrid",
            datatype: "json",
            postData: queryData,
            colNames: ["Id", "企业名称", "社会信用代码", "法定代表人", "法定代表人电话", "联系人", "联系人电话", "城市", "区域", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 200 },
                    { name: "SocialCreditCode", index: "SocialCreditCode", align: "center", width: 80 },
                    { name: "LegalRepresentative", index: "LegalRepresentative", align: "center", width: 50 },
                    { name: "LegalRepresentativeNumber", index: "LegalRepresentativeNumber", align: "center", width: 80 },
                    { name: "ContactPerson", index: "ContactPerson", align: "center", width: 50 },
                    { name: "ContactNumber", index: "ContactNumber", align: "center", width: 80 },
                    { name: "City", index: "City", align: "center", width: 30 },
                    { name: "Area", index: "Area", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 80, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="查看" onclick="btnEnterprise_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search "></i> 查看</a>'
                            + '<a href="#" title="修改" onclick="btnEnterprise_Update(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                                + '<i class="icon-zoom-in blue"></i> 修改</a>'
                            //+ '<a href="#" title="删除" onclick="btnEnterprise_Delete(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                            //   + '<i class="icon-zoom-in blue"></i> 删除</a>'
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
            pager: $pagerEnterprise,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridEnterprise.selector);

            }
        });
    }

    var initButtonArea = function () {
        //显示企业详细信息
        var showEnterpriseModal = function (enterpriseId) {
            var getEnterpriseByID = function (enterpriseId) {
                var queryData = {};
                var dataResult = {};
                queryData.enterpriseId = enterpriseId;
                ajaxRequest({
                    url: "/" + controllerName + "/GetEnterpriseById",
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
            var enterpriseData = {};
            if (enum_EditTypes.insert == edittype) {
                enterpriseData = getJson($divEnterpriseInfo);
                for (var p in enterpriseData) {
                    enterpriseData[p] = "";
                }
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!enterpriseId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                enterpriseData = getEnterpriseByID(enterpriseId);
            }
            setJson($divEnterpriseInfo, enterpriseData);


            if (enum_EditTypes.view == edittype) {
                for (var p in enterpriseData) {
                    $divEnterpriseInfo.find("[name='" + p + "']").prop("disabled", true);
                }
            } else {
                for (var p in enterpriseData) {
                    $divEnterpriseInfo.find("[name='" + p + "']").prop("disabled", false);
                }
            }
            if (enterpriseData && enterpriseData.Area) {
                $divEnterpriseInfo.find("[name='City']").change();
                $divEnterpriseInfo.find("[name='Area']").val(enterpriseData.Area);
            }
            if (enum_EditTypes.update == edittype) {//将不允许变更的字段 禁用
                // $divEnterpriseInfo.find("[name='EnterpriseName']").prop("disabled", true);
                $divEnterpriseInfo.find("[name='SocialCreditCode']").prop("disabled", true);
                $divEnterpriseInfo.find("[name='City']").prop("disabled", true);
                //$divEnterpriseInfo.find("[name='Area']").prop("disabled", true);
            }
            $mdlEnterpriseInfo.modal("toggle");


        }
        //初始化查询按钮
        var initSearchButton = function () {
            //注册windows方法
            window.btnEnterprise_View = function (enterpriseId) {
                currentEdittype = enum_EditTypes.view;
                showEnterpriseModal(enterpriseId);
            };
        }
        //初始化插入按钮
        var initInsertButton = function () {
            $("#btnEnterprise_Insert").on("click", function () {
                currentEdittype = enum_EditTypes.insert;

                showEnterpriseModal();
            });
        }
        //初始化更新企业信息
        var initUpdateButton = function () {
            //注册window方法
            window.btnEnterprise_Update = function (enterpriseId) {
                currentEdittype = enum_EditTypes.update;
                showEnterpriseModal(enterpriseId);
            };
        }
        var initDeleteButton = function () {
            //注册window方法
            window.btnEnterprise_Delete = function (enterpriseId) {
                var queryData = {};
                if (!enterpriseId) {
                    queryData.enterpriseId = getSelectedRowDataOfGrid().Id;
                }
                queryData.enterpriseId = enterpriseId;
                if (!confirm("确认删除吗？")) {
                    return false;
                }
                ajaxRequest({
                    url: "/" + controllerName + "/DeleteEnterpriseById",
                    data: queryData,
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert("删除成功！")
                            refreshEnterpriseGrid();
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                });
            };
        }
        var initSubmitButton = function () {
            $("#btnEnterprise_Submit").on("click", function () {
                showCheckedModal();
            })

        }
        var initImputExcel = function () {
            $("#btnEnterprise_ImputExcel").on("click", function () {
                initFileUploadModal();
                $mdlEnterpriseFileUpload.modal("toggle");
            })


        }

        initSearchButton();
        initInsertButton();
        initUpdateButton();
        initDeleteButton();
        initSubmitButton();
        initImputExcel();
    }

    var initEnterpriseModal = function () {
        var getEnterpriseFile = function (enterpriseId) {
            var jsonData = {};
            $.ajax({
                url: "/" + controllerName + "/GetEnterpriseFile",
                data: { "enterpriseId": enterpriseId },
                type: "POST",
                datatype: "string",
                async: false,
                success: function (jdata) {
                    if (jdata.length > 0) {
                        jsonData = jdata;
                    }
                }
            });
            return jsonData;
        }
        ////初始化图片上传控件
        //var initEmployeeImageUploader = function (employeeId, operate) {
        //    operate = operate == 0 ? 'insert' : operate == 1 ? 'update' : 'view';
        //    var jsonData = getEmployeeFile(employeeId);
        //    //$("#imageUpload").html("");
        //    $("#divEmployee_EmployeeInfoImageUpload").ImageUpload({
        //        "title": "附件上传<span style='font-size:14px; margin-left:100px; color:#999;'>请上传 身份证正反扫描件、登记照片</span>",
        //        "height": "160",
        //        "operate": operate,
        //        //"modal_height": "500",
        //        //"modal_width": "800",
        //        "menu": [
        //            { "name": "身份证正反面","value":"IDCard" },
        //            { "name": "登记照片", "value": "RegistrationPhoto" }
        //        ],
        //        "data": jsonData,
        //        "remove_method": function (fileId) {
        //            var result = false;
        //            if (operate == "add") {
        //                if (confirm("删除后不可恢复，确定要删除吗？")) {
        //                    DeleteFile(fileId);
        //                    result = true;;
        //                }
        //            }
        //            return result
        //        },
        //        "btn_disable": operate =='view'? true : false
        //    });
        //}
        //window.initEmployeeImageUploader = initEmployeeImageUploader;
        //初始化企业城市和区域 联动效果
        var initEnterpriseModalCityAndArea = function () {
            var $txtCity = $("#divEnterprise_enterpriseInfoCity");
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
            $txtCity.empty();

            var $optionAll = $("<option>");
            $optionAll.val("");
            $optionAll.text("请选择城市");
            $txtCity.append($optionAll);

            for (var i = 0; i < listCity.length ; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtCity.append($option);
            }
            var initArea = function () {

                var jdata = { 'cityName': $txtCity.val() };
                var $txtArea = $("#divEnterprise_enterpriseArea");
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
                $txtArea.empty();
                for (var i = 0; i < listArea.length ; i++) {
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
            });
        }


        //初始化保存按钮
        var initEnterpriseSaveButton = function () {
            $("#btnEnterprise_EnterpriseInfoConfirm").on("click", function () {

                var checkResult = verifyForm($divEnterpriseInfo);
                if (!checkResult) {
                    return;
                }
                var enterpriseInfo = getJson($divEnterpriseInfo);
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/InsertEnterprise"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateEnterprise"
                }
                var strData = JSON.stringify(enterpriseInfo);

                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: { "strData": strData },
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！");
                                refreshEnterpriseGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }

        // initEmployeeImageUploader(0, currentEdittype);
        initEnterpriseModalCityAndArea();
        initEnterpriseSaveButton();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();

        initEnterpriseGrid();




        initButtonArea();
        initEnterpriseModal();
        //initCheckedModal();
    })

})
