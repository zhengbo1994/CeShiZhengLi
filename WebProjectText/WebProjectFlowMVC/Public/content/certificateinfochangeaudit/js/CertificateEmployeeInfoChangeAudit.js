
'use strict'
$(function () {

    var controllerName = "CertificateEnterpriseChangeAudit";
    var $divMainQueryArea = $('#divCertificateEnterpriseChangeAudit_QueryArea');
    var $gridMain = $("#gridCertificateEmployeeInfoChangAudit_main");
    var $pagerMain = $("#pagerCertificateEmployeeInfoChangAudit_main");
    var $divMainInfo = $("#divCertificateEntChangeAudit_CertificateEntChangeInfo");
    var $mdlMainInfo = $("#mdlCertificateEntChangeAudit_CertificateEntChangeInfo");

    var $divCheckInfo = $("#divCertificateEmployeeInfoChangeAudit_CheckInfo");
    var $mdlCheckInfo = $("#mdlCertificateEmployeeInfoChangeAudit_CheckInfo");

    var enum_EditTypes = {
        insert: 0,
        update: 1,
        view: 2
    }

    var refreshCertificateManagementGrid = function () {
        $gridMain.trigger("reloadGrid");
    }

    var currentEdittype = enum_EditTypes.insert;

    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridMain.jqGrid("getGridParam", "selrow");
        }
        selRowId = rowid;
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridMain.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnCertificateManagement_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divMainQueryArea)
                $gridCertificateManagement.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
    }



    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divMainQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetEmptyJqGridResult",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["Id", "持证人姓名", "性别", "出生年月", "身份证号", "联系方式", "企业名称", "职务", "技术职称", "证书编号", "证书类别", "证书有效期", "申请日期", "审核状态","审核时间", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "HolderOfTheCertificate", index: "HolderOfTheCertificate", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 80 },
                    { name: "DateOfBirth", index: "DateOfBirth", align: "center", width: 80 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 80 },
                    { name: "ContactWay", index: "ContactWay", align: "center", width: 80 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 80 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "TechnicalTitle", index: "TechnicalTitle", align: "center", width: 80 },
                    { name: "CertificateNumber", index: "CertificateNumber", align: "center", width: 90 },
                    { name: "CertificateType", index: "CertificateType", align: "center", width: 80 },
                    { name: "CertificateStatus", index: "CertificateStatus", align: "center", width: 80 },
                    { name: "CertificateStatus", index: "CertificateStatus", align: "center", width: 80 },
                    { name: "CertificateStatus", index: "CertificateStatus", align: "center", width: 80 },
                     { name: "CertificateStatus", index: "CertificateStatus", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 90, align: "center", formatter: function (cellvalue, options, rowobj) {

                            var buttons = ''
                              + '<a href="#" title="审核通过" onclick="btnCertificateManagement_View(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="icon-zoom-in blue"></i> 审核通过</a>'
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
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridMain.selector);
            }
        });
    }

    var initButtonArea = function () {
        var showCertificateManagementModel = function (CertificateManagementId) {
            var getCertificateManagementByID = function (certificateManagementId) {
                var queryData = {};
                var dataResult = {};
                queryData.certificateManagementId = certificateManagementId;
                ajaxRequest({
                    url: "/" + controllerName + "/GetcertificateManagementById",
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
            var certificateManagementData = {};
            if (enum_EditTypes.insert == edittype) {
                certificateManagementData = getJson($divCertificateManagementInfo);
                for (var p in certificateManagementData) {
                    certificateManagementData[p] = "";
                }
            } else if (enum_EditTypes.update == edittype || enum_EditTypes.view == edittype) {
                if (!certificateManagementId) {
                    var rowData = getSelectedRowDataOfGrid();
                    if (!rowData) {
                        return false;
                    }
                }
                certificateManagementData = getcertificateManagementByID(certificateManagementId);
            }
            setJson($divCertificateManagementInfo, certificateManagementData);


            if (enum_EditTypes.view == edittype) {
                for (var p in certificateManagementData) {
                    $divCertificateManagementInfo.find("[name='" + p + "']").prop("disabled", true);
                }
            } else {
                for (var p in certificateManagementData) {
                    $divCertificateManagementInfo.find("[name='" + p + "']").prop("disabled", false);
                }
            }
            $mdlCertificateManagementInfo.model("toggle");



        }

        var initSearchButton = function () {
            //注册windows方法
            window.btnCertificateManagement_View = function (certificateManagementId) {
                currentEdittype = enum_EditTypes.view;
                showCertificateManagementModel(certificateManagementId);
            };
        }

        var initCertificateEntChange_EntChangeAudit = function () {
            $("#btnCertificateEmployeeInfoChange_EmployeeInfoChangeAudit").on("click", function () {
                currentEdittype = enum_EditTypes.insert;
                $mdlCheckInfo.modal("toggle");
                // showCertificateManagementModel();
            });
        }
        initCertificateEntChange_EntChangeAudit();
    }

    var initCertificateManagementModal = function () {
        //初始化保存按钮
        var initCertificateManagementSavaButton = function () {
            $("#btnCertificateManagement_CertificateManagementInfoConfirm").on("click", function () {

                var checkResult = verifyForm($divCertificateManagementInfo);
                if (!checkResult) {
                    return;
                }
                var
                    certificateManagementInfo = getJson($divCertificateManagementInfo);
                var functionName = "";
                if (currentEdittype == enum_EditTypes.insert) {
                    functionName = "/InsertCertificateManagement"
                }
                else if (currentEdittype == enum_EditTypes.update) {
                    functionName = "/UpdateCertificateManagement"
                }
                var fData = new FormData();
                for (var p in certificateManagementInfo) {
                    fData.append(p, CertificateManagementInfo[p] || "");
                }

                ajaxRequest({
                    url: "/" + controllerName + functionName,
                    data: fData,
                    type: "post",
                    datatype: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                refreshCertificateManagementGrid();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                });
            });
        }
        initCertificateManagementSavaButton();
    }


    //页面加载时运行
    $(document).ready(function () {
        //initQueryArea();
        initMainGrid();
        initButtonArea();
        //initCertificateManagementModal();
    })

})
