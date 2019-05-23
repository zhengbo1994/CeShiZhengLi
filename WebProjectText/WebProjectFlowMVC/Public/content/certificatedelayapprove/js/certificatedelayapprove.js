
'use strict'
$(function () {

    var controllerName = "CertificateDelayApprove";
    var $divQueryArea = $('#divCertificateDelayApprove_QueryArea');
    var $gridMain = $("#gridCertificateDelayApprove_main");
    var $pagerMain = $("#pagerCertificateDelayApprove_main");

    var $divMulitCheckInfo = $("#divCertificateDelayApprove_CheckListInfo");
    var $mdlMulitCheckInfo = $("#mdlCertificateDelayApprove_CheckListInfo");

    var $divSingleCheckInfo = $("#divCertificateDelayApprove_CheckInfo");
    var $mdlSingleCheckInfo = $("#mdlCertificateDelayApprove_CheckInfo");



    var initQueryArea = function () {
        var $queryButton = $("#btnCertificateDelayApprove_Query");
        var initQueryButton = function () {
            $queryButton.on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea);
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initSelectChange = function () {
            $divQueryArea.find("select").on("change", function () {
                $queryButton.click();
            });
        }
        initSelectChange();
        initQueryButton();
    }
    var refreshQuery = function () {
        $("#btnCertificateDelayApprove_Query").click();
    }

    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetCertificateListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["certificateId", "姓名", "性别", "身份证号", "企业名称", "证书编号", "证书类型", "发证时间", "证书有效期", "延期资格审核", "是否同意延期", "确认人", "确认日期", "操作"],
            colModel: [
                    { name: "certificateId", index: "certificateId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 80 },
                    { name: "sex", index: "sex", align: "center", width: 50 },
                    { name: "iDNumber", index: "iDNumber", align: "center", width: 150 },
                    { name: "enterpriseName", index: "enterpriseName", align: "center", width: 150 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 150 },
                    { name: "examType", index: "examType", align: "center", width: 80 },
                    { name: "certificateStartDate", index: "certificateStartDate", align: "center", width: 80 },
                    { name: "certificateEndDate", index: "certificateEndDate", align: "center", width: 80 },
                    { name: "dataCheckStatus", index: "dataCheckStatus", align: "center", width: 80 },
                    { name: "approveStatus", index: "approveStatus", align: "center", width: 80 },
                    { name: "approveUserName", index: "approveUserName", align: "center", width: 80 },
                    { name: "approveDate", index: "approveDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            buttons += ""
                            + '<a href="#" title="确认" onclick="CertificateDelayApprove_Check(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                            + '<i class=" fa fa-check"></i> 确认</a>'
                            + '<a href="#" title="查看" onclick="CertificateDelayApprove_viewCheck(' + rowobj.certificateId + ')" style="padding: 7px;line-height: 1em;">'
                        + '<i class=" fa fa-search"></i> 查看</a>';
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
        var initCheckButton = function () {
            $("#btnCertificateDelayApprove_Check").on("click", function () {
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                if (arrRowid.length < 1) {
                    alert("请勾选要确认的记录");
                    return false;
                }
                $mdlMulitCheckInfo.modal("show");
            })
        }

        var resetForm = function ($form) {
            var data = getJson($form);
            for (var p in data) {
                data[p] = "";
            }
            setJson($form, data);
        }
        window.CertificateDelayApprove_Check = function (rowId) {
            debugger;
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var certificateId = rowData.certificateId;
            var dataCheckStatus = rowData.dataCheckStatus;
            var approveStatus = rowData.approveStatus;
            if (dataCheckStatus == "未审核") {
                alert("延期资格审核未审核,不能确认");
                return false;
            }
            if (dataCheckStatus == "不通过") {
                alert("延期资格审核不通过,不能确认");
                return false;
            }
            if (approveStatus == "同意" || approveStatus == "不同意") {
                alert("不能重复确认");
                return false;
            }

            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateDelayData",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    resetForm($divSingleCheckInfo);
                    jdata.certificateId = certificateId;
                    setJson($divSingleCheckInfo, jdata);

                    //将页面的控件禁用
                    var divData = getJson($divSingleCheckInfo);
                    for (var key in divData) {
                        $divSingleCheckInfo.find("[name='" + key + "']").prop("disabled", true);
                    }
                    //启用可编辑的控件
                    $divSingleCheckInfo.find("[name='approviedMark']").prop("disabled", false);
                    //显示审核按钮
                    $mdlSingleCheckInfo.find("[name='btnCheckPass'],[name='btnCheckNoPass']").removeClass("hidden");

                    $mdlSingleCheckInfo.modal("show");
                }
            });

        }
        window.CertificateDelayApprove_viewCheck = function (certificateId) {
            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateDelayData",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    resetForm($divSingleCheckInfo);
                    jdata.certificateId = certificateId;
                    setJson($divSingleCheckInfo, jdata);
                    //将页面的控件禁用
                    var divData = getJson($divSingleCheckInfo);
                    for (var key in divData) {
                        $divSingleCheckInfo.find("[name='" + key + "']").prop("disabled", true);
                    }
                    //启用可编辑的控件
                    $divSingleCheckInfo.find("[name='approviedMark']").prop("disabled", true);
                    //显示审核按钮
                    $mdlSingleCheckInfo.find("[name='btnCheckPass'],[name='btnCheckNoPass']").addClass("hidden");


                    $mdlSingleCheckInfo.modal("show");
                }
            });

        }
        initCheckButton();
    }

    var initCheckListModal = function () {
        var defaultRemark = "学习达标,同意";

        var initFormVerify = function () {

            var $arrInput = $divEmployeeCheck_CheckInfo.find("input,textarea,select");
            for (var i = 0; i < $arrInput.length; i++) {
                var $input = $($arrInput[i]);


                var verifyTypes = $input.data("verify");

                if (verifyTypes && $.trim(verifyTypes) != "") {



                    $input.on("focus", function () {
                        var $focusInput = $(this);
                        $focusInput.tooltip('destroy');
                    })

                    $input.on("blur", function () {
                        var $blurInput = $(this);
                        verifyInput($blurInput, function ($errInput) {
                            var errorMessage = $errInput.data("verify-errormessage");
                            $errInput.tooltip({ html: true, title: errorMessage }).tooltip('show')

                        })

                    })
                }
            }

        }

        var initCheckedButton = function () {

            var check = function (passFlag) {
                var checkResult = verifyForm($divMulitCheckInfo);
                if (!checkResult) {
                    return false;
                }
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                var certificateIdList = [];
                for (var i = 0; i < arrRowid.length; i++) {
                    var certificateId = $gridMain.jqGrid("getRowData", arrRowid[i]).certificateId;
                    certificateIdList.push(certificateId);
                }
                var checkedMark = $divMulitCheckInfo.find("[name='approviedMark']").val();
                var postData = {};
                postData.certificateIdList = certificateIdList;
                postData.passFlag = passFlag;
                postData.approviedMark = checkedMark;
                var strData = JSON.stringify(postData);
                var ajaxOpt = {
                    url: "/" + controllerName + "/CheckList?v=" + (new Date()).toDateString(),
                    data: { "strData": strData },
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("审核成功！")
                                refreshQuery();
                                $mdlMulitCheckInfo.modal("hide");
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            }

            $mdlMulitCheckInfo.find("[name='btnCheckedPass']").on("click", function () {
                check(true);
            });

            $mdlMulitCheckInfo.find("[name='btnCheckedNoPass']").on("click", function () {
                var remark = $mdlMulitCheckInfo.find("textarea[name='remark']").val();
                if (remark == defaultRemark) {
                    alert("请填写意见");
                    return false;
                }
                check(false);
            });

            $mdlMulitCheckInfo.on("show.bs.modal", function () {
                $divMulitCheckInfo.find("textarea[name='remark']").val(defaultRemark);
            })
        }
        //initFormVerify();
        initCheckedButton();
    }


    var initCheckModal = function () {
        var defaultCheckedMark = "学习达标,同意";

        var check = function (passFlag) {
            var formData = getJson($divSingleCheckInfo);
            var postData = {};
            postData.passFlag = passFlag;
            postData.checkedMark = formData.remark;
            postData.certificateIdList = [];
            postData.certificateIdList.push(formData.certificateId);

            ajaxRequest({
                url: "/" + controllerName + "/CheckList?v=" + (new Date()).toDateString(),
                data: { "strData": JSON.stringify(postData) },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === true) {
                        alert("审核成功！")
                        refreshQuery();
                        $mdlSingleCheckInfo.modal("hide");
                    } else {
                        alert(jdata.ErrorMessage);
                    }
                }
            });
        }

        var initCheckedPassButton = function () {
            $mdlSingleCheckInfo.find("[name='btnCheckPass']").on("click", function () {
                check(true);
            });
        }

        var initCheckedNoPassButton = function () {
            $mdlSingleCheckInfo.find("[name='btnCheckNoPass']").on("click", function () {
                var checedMark = $divSingleCheckInfo.find("[name='remark']").val();
                if (checedMark == defaultCheckedMark) {
                    alert("请填写意见");
                    return false;
                }
                check(false);
            });
        }

        initCheckedPassButton();
        initCheckedNoPassButton();
        $mdlSingleCheckInfo.on("show.bs.modal", function () {
            $divSingleCheckInfo.find("[name='remark']").val(defaultCheckedMark);
        });
    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();
        initCheckListModal();
        initCheckModal();

    })

})
