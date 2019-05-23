
'use strict'
$(function () {

    var controllerName = "CertificateInfoChange";
    var $divMainQueryArea = $('#divCertificateInfoChange_QueryArea');
    var $gridMain = $("#gridCertificateInfoChang_main");
    var $pagerMain = $("#pagerCertificateInfoChang_main");
    var $divCertificateInfoChange = $("#divCertificateInfoChange_CertificateInfoChange");
    var $mdlCertificateInfoChange = $("#mdlCertificateInfoChange_CertificateInfoChange");








    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnCertificateInfoChange_Query").on("click", function () {
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
            url: "/" + controllerName + "/GetCertificateInfoChangeListForJqGrid",
            datatype: "json",
            mtype: "post",
            // multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["certificateChangeId", "持证人姓名", "性别", "出生年月", "身份证号", "原企业名称", "职务", "技术职称", "证书编号", "证书类别", "申请日期", "申请状态", "审核意见", "操作"],
            colModel: [
                    { name: "certificateChangeId", index: "certificateChangeId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 80 },
                    { name: "sex", index: "sex", align: "center", width: 35 },
                    { name: "birthday", index: "birthday", align: "center", width: 80 },
                    { name: "iDNumber", index: "iDNumber", align: "center", width: 150 },
                    { name: "oldEnterpriseName", index: "oldEnterpriseName", align: "center", width: 150 },
                    { name: "job", index: "job", align: "center", width: 50 },
                    { name: "title4Technical", index: "title4Technical", align: "center", width: 80 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 150 },
                    { name: "examType", index: "examType", align: "center", width: 80 },
                     { name: "submitDate", index: "submitDate", align: "center", width: 80 },
                    { name: "checkStatus", index: "checkStatus", align: "center", width: 80 },

                    { name: "remark", index: "remark", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", width: 300, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="提交" onclick="certificateChangeInfo_submit(' + rowobj.certificateChangeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-check "></i> 提交</a>'
                              + '<a href="#" title="查看" onclick="certificateChangeInfo_viewCertificateChangeInfo(' + rowobj.certificateChangeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-search"></i> 查看</a>'
                              + '<a href="#" title="修改" onclick="certificateChangeInfo_updateCertificateChangeInfo(' + rowobj.certificateChangeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-edit"></i> 修改</a>'
                              + '<a href="#" title="删除" onclick="certificateChangeInfo_deleteCertificateChangeInfo(' + rowobj.certificateChangeId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-trash"></i> 删除</a>'
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
        var button_CertificateInfoChange = function () {
            $("#btnCertificateInfoChange").on("click", function () {
                 
                //清空modal页
                var formJson = getJson($divCertificateInfoChange);
                for (var p in formJson) {
                    if (p.toLowerCase() == "enterpriseName".toLowerCase()) {
                        continue;
                    }
                    formJson[p] = "";
                }
                setJson($divCertificateInfoChange, formJson);
                $mdlCertificateInfoChange.modal("toggle");
            });
        };
        var updateCertificateChangeInfo = function (certificatechangeId) {
            //清空modal页
            var formJson = getJson($divCertificateInfoChange);
            for (var p in formJson) {
                if (p.toLowerCase() == "enterpriseName".toLowerCase()) {
                    continue;
                }
                formJson[p] = "";
            }
            setJson($divCertificateInfoChange, formJson);
            loadCertificateChangeInfo(certificatechangeId);
            $mdlCertificateInfoChange.modal("toggle");
        };
        //更新
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
                        setJson($divCertificateInfoChange, jdata.data);
                    }
                    else {
                        alert(jdata.resultMessage.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        }
        window.certificateChangeInfo_updateCertificateChangeInfo = function (certificateChangeId) {
            $mdlCertificateInfoChange.find("[name='btnSave']").removeClass("hidden");
            updateCertificateChangeInfo(certificateChangeId);
        }

        //查看
        window.certificateChangeInfo_viewCertificateChangeInfo = function (certificatechangeId) {
            updateCertificateChangeInfo(certificatechangeId);
            $mdlCertificateInfoChange.find("[name='btnSave']").addClass("hidden");
        };
        //删除
        var deleteCertificateChangeInfo = function (certificatechangeId) {
            var ajaxOpt = {
                url: "/" + controllerName + "/DeleteCertificateChangeInfo",
                data: { certificateChangeId: certificateChangeId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("删除成功！");
                        $gridMain.jqGrid().trigger("reload");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        }
        window.certificateChangeInfo_deleteCertificateChangeInfo = deleteCertificateChangeInfo;

        //提交
        var submitCertificateChange = function (certificateChangeId) {
            if (!confirm("确定提交变更记录吗？")) {
                return false;
            }
            var ajaxOpt = {
                url: "/" + controllerName + "/SubmitCertificateChangeInfo",
                data: { certificateChangeId: certificateChangeId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("提交成功！");
                        $gridMain.jqGrid().trigger("reloadGrid");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        };
        window.certificateChangeInfo_submit = submitCertificateChange;

        button_CertificateInfoChange();

    }
    //初始化证书变更modal
    var initCertificateInfoModal = function () {
        //初始化本企业名称
        var initEnterpriseNameByCurrentAccount = function () {
            var dataResult = {};
            var ajaxOpt = {
                url: "/" + controllerName + "/GetEnterpriseName",
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                     
                    $divCertificateInfoChange.find("[name='enterpriseName']").val(jdata);
                }
            }
            ajaxRequest(ajaxOpt);
            return dataResult;
        };
        //绑定证书编号的 失去焦点事件和回车事件
        var initCertificateNoEvent = function () {
            $divCertificateInfoChange.find("[name='certificateNo']").on("blur", function () {
                loadCertificateByCertificateNo($(this).val());
            });
            //$divCertificateInfoChange.find("[name='certificateNo']").on("keypress", function (event) {
            //     
            //    if (event.keyCode == "13") {
            //        loadCertificateByCertificateNo(this.val());
            //    }
            //});
        };
        var loadCertificateByCertificateNo = function (certificateNo) {
            if (certificateNo.length < 19) {
                return false;
            }
             
            var ajaxOpt = {
                url: "/" + controllerName + "/GetCertificateInfo",
                data: { certificateNo: certificateNo },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.resultMessage.IsSuccess) {
                        setJson($divCertificateInfoChange, jdata.data);
                    }
                    else {
                        alert(jdata.resultMessage.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
        };
        //初始化保存按钮
        var initCertificateChangeSavaButton = function () {
            $mdlCertificateInfoChange.find("[name='btnSave']").on("click", function () {
                var checkResult = verifyForm($divCertificateInfoChange);
                if (!checkResult) {
                    return;
                }
                var certificateInfo = getJson($divCertificateInfoChange);
                var ajaxOpt = {
                    url: "/" + controllerName + "/SaveCertificateChangeInfo",
                    data: certificateInfo,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("保存成功！")
                            $mdlCertificateInfoChange.modal("toggle");
                            $gridMain.jqGrid().trigger("reloadGrid");
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            });
        };


        initEnterpriseNameByCurrentAccount();
        initCertificateNoEvent();
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
