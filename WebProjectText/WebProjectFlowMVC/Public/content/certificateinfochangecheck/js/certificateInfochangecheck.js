
'use strict'
$(function () {

    var controllerName = "CertificateInfoChangeCheck";
    var $divMainQueryArea = $('#divCertificateInfoChangeCheck_QueryArea');
    var $gridMain = $("#gridCertificateInfoChangCheck_main");
    var $pagerMain = $("#pagerCertificateInfoChangCheck_main");
    var $divCertificateInfoChangeCheck = $("#divCertificateInfoChangeCheck_CertificateInfoChange");
    var $mdlCertificateInfoChangeCheck = $("#mdlCertificateInfoChangeCheck_CertificateInfoChange");


    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnCertificateInfoChangeCheck_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divMainQueryArea)
                $gridMain.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
    }
    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divMainQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetCertificateInfoChangeCheckListForJqGrid",
            datatype: "json",
            mtype: "post",
            // multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["certificateChangeId", "持证人姓名", "性别", "出生年月", "身份证号", "原企业名称", "职务", "技术职称", "证书编号", "证书类别", "申请日期", "申请状态", "审核日期", "审核意见", "操作"],
            colModel: [
                    { name: "certificateChangeId", index: "certificateChangeId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 80 },
                    { name: "sex", index: "sex", align: "center", width: 35 },
                    { name: "birthday", index: "birthday", align: "center", width: 80 },
                    { name: "iDNumber", index: "iDNumber", align: "center", width: 150 },
                    { name: "oldEnterpriseName", index: "oldEnterpriseName", align: "center", width: 150 },
                    { name: "job", index: "job", align: "center", width: 80 },
                    { name: "title4Technical", index: "title4Technical", align: "center", width: 80 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 180 },
                    { name: "examType", index: "examType", align: "center", width: 80 },
                    { name: "submitDate", index: "submitDate", align: "center", width: 80 },
                    { name: "checkStatus", index: "checkStatus", align: "center", width: 80 },
                    { name: "checkDate", index: "checkDate", align: "center", width: 80 },
                    { name: "remark", index: "remark", align: "center", width: 100 },
                    {
                        name: "操作", index: "操作", width: 200, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="审核" onclick="certificateChangeInfoCheck_CheckCertificateChangeInfo(' + rowobj.certificateChangeId + ',\'' + rowobj.checkStatus + '\')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-check "></i> 审核</a>'
                              + '<a href="#" title="查看" onclick="certificateChangeCheckInfo_viewCertificateChangeInfo(' + rowobj.certificateChangeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search"></i> 查看</a>'
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

    //初始化按钮区域
    var initButtonArea = function () {


        var CheckCertificateChangeInfo = function (certificatechangeId) {
            //清空modal页
            var formJson = getJson($divCertificateInfoChangeCheck);
            for (var p in formJson) {
                if (p.toLowerCase() == "enterpriseName".toLowerCase()) {
                    continue;
                }
                formJson[p] = "";
            }
            setJson($divCertificateInfoChangeCheck, formJson);
            loadCertificateChangeInfo(certificatechangeId);
            $mdlCertificateInfoChangeCheck.modal("toggle");
        };

        var loadCertificateChangeInfo = function (certificateChangeId) {
            var ajaxOpt = {
                url: "/" + controllerName + "/GetCertificateChangeInfo",
                data: { certificateChangeId: certificateChangeId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.resultMessage.IsSuccess) {
                        setJson($divCertificateInfoChangeCheck, jdata.data);
                    }
                    else {
                        alert(jdata.resultMessage.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        }
        window.certificateChangeInfoCheck_CheckCertificateChangeInfo = function (certificateChangeId, checkStatus) {
            if (checkStatus != "未审核") {
                alert("已经审核过,不能继续审核");
                return false;
            }
            $mdlCertificateInfoChangeCheck.find("[name='btnPass']").removeClass("hidden");
            $mdlCertificateInfoChangeCheck.find("[name='btnNoPass']").removeClass("hidden");
            CheckCertificateChangeInfo(certificateChangeId);

        }

        //查看
        window.certificateChangeCheckInfo_viewCertificateChangeInfo = function (certificatechangeId) {

            $mdlCertificateInfoChangeCheck.find("[name='btnPass']").addClass("hidden");
            $mdlCertificateInfoChangeCheck.find("[name='btnNoPass']").addClass("hidden");
            CheckCertificateChangeInfo(certificatechangeId);
        };
    }
    //初始化证书变更modal
    var initCertificateInfoModal = function () {


        //初始化保存按钮
        var initCertificateChangeSavaButton = function () {
            $mdlCertificateInfoChangeCheck.find("[name='btnPass']").on("click", function () {
                checkCertificateChange(true);
            });
            $mdlCertificateInfoChangeCheck.find("[name='btnNoPass']").on("click", function () {
                checkCertificateChange(false);
            });
            var checkCertificateChange = function (passFlag) {
                var checkResult = verifyForm($divCertificateInfoChangeCheck);
                if (!checkResult) {
                    return;
                }
                var certificateInfo = getJson($divCertificateInfoChangeCheck);
                certificateInfo.passFlag = passFlag;
                var ajaxOpt = {
                    url: "/" + controllerName + "/CheckCertificateChangeInfo",
                    data: certificateInfo,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("审核成功！")
                            $mdlCertificateInfoChangeCheck.modal("toggle");
                            $gridMain.jqGrid().trigger("reloadGrid");
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            }
        };
        initCertificateChangeSavaButton();
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();
        initCertificateInfoModal();
    })

});
