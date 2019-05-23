
'use strict'
$(function () {

    var controllerName = "PrintAdmissionticket";
    var $printAdmissionticket_QueryArea = $('#divPrintAdmissionticket_QueryArea');
    var $gridPrintAdmissionticket = $("#gridPrintAdmissionticket_main");
    var $pagerPrintAdmissionticket = $("#pagerPrintAdmissionticket_main");
    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshPrintAdmissionticketGrid = function () {
        $gridPrintAdmissionticket.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function () {
        var selRowId = $gridPrintAdmissionticket.jqGrid("getGridParam", "selrow");
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridPrintAdmissionticket.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initPrintAdmissionticketGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divPrintAdmissionticket_QueryArea")
        queryData = getJson(divQueryArea)
        $gridPrintAdmissionticket.jqGrid({
            url: "/" + controllerName + "/GetEmptyJqGridResult",
            datatype: "json",
            postData: queryData,
            colNames: ["Id", "考场计划流水号", "考核点名称", "考场名称","考试开始时间","考试结束时间","考试地点","考试人数","操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "TheExaminationProgramSerialNumber", index: "TheExaminationProgramSerialNumber", align: "center", width: 80 },
                    { name: "InstitutionName", index: "InstitutionName", align: "center", width: 80 },
                    { name: "CentreName", index: "CentreName", align: "center", width: 80 },
                    { name: "ExaminationpStarttime", index: "ExaminationpStarttime", align: "center", width: 80 },
                    { name: "ExaminationpEndtime", index: "ExaminationpEndtime", align: "center", width: 80 },
                    { name: "ExaminationPlace", index: "ExaminationPlace", align: "center", width: 80 },
                    { name: "ExaminationNumber", index: "ExaminationNumber", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 90, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="查看考试人员" onclick="btnPrintAdmissionticket_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="icon-zoom-in blue"></i> 查看考试人员</a>'
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
            pager: $pagerPrintAdmissionticket,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridPrintAdmissionticket.selector);
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
                if (!confirm("确认删除吗？"))
                {
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
     
        initSearchButton();
        initInsertButton();
        initUpdateButton();
        initDeleteButton();
      
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
              

                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: enterpriseInfo,
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshEnterpriseGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });

            });
        }
     

        initEnterpriseSaveButton();       
    }

    //页面加载时运行
    $(document).ready(function () {
        //initQueryArea();
        initPrintAdmissionticketGrid();
        //initButtonArea();
        //initEnterpriseModal();
        //initCheckedModal();
    })

})
