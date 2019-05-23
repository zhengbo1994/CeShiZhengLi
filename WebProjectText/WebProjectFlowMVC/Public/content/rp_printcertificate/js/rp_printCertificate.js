
'use strict'
$(function () {

    var controllerName = "RP_PrintCertificate";
    var $printCertificate_QueryArea = $('#divRP_PrintCertificate_QueryArea');
    var $gridPrintCertificate = $("#gridRP_PrintCertificate_main");
    var $pagerPrintCertificate = $("#pagerRP_PrintCertificate_main");
    var $mdlPrintCertificateInfo = $("#mdlRP_PrintCertificate_CertificateInfo");

    //初始化查询区域
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnRP_PrintCertificate_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($printCertificate_QueryArea);
                $gridPrintCertificate.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
    }

    var initPrintCertificateGrid = function () {
        var queryData = {};
        queryData = getJson($printCertificate_QueryArea)
        $gridPrintCertificate.jqGrid({
            url: "/" + controllerName + "/GetEmployeeListForJqgrid",
            datatype: "json",
            postData: queryData,
            colNames: ["CertificateId", "姓名", "身份证号", "性别", "证书编号", "证书有效期", "发证日期", "出生年月", "企业名称", "职务", "技术职称", "证书行业", "证书类别", "操作"],
            colModel: [
                    { name: "CertificateId", index: "CertificateId", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 120 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "CertificateNo", index: "CertificateNo", align: "center", width: 230 },
                    { name: "EndCertificateDate", index: "EndCertificateDate", align: "center", width: 100 },
                    { name: "StartCertificateDate", index: "StartCertificateDate", align: "center", width: 100 },
                    { name: "Birthday", index: "Birthday", align: "center", width: 100 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 250 },
                    { name: "Job", index: "Job", align: "center", width: 100 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 100 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="打印证书" onclick="RP_PrintCertificate(' + rowobj.CertificateId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-print"></i> 打印证书</a>'
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
            pager: $pagerPrintCertificate,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridPrintCertificate.selector);
            }
        });
    }

    var initButtonArea = function () {
        var getCertificateData = function (certificateId) {
            var resultData = {};
            var ajaxOpt = {
                url: "/" + controllerName + "/GetCertificateInfo",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.resultMessage.IsSuccess) {
                        resultData = jdata;
                    }
                    else {
                        resultData = null;
                        throw new Error("获取证书信息失败\r\n" + jdata.resultMessage.ErrorMessage);
                    }
                }
            };
            ajaxRequest(ajaxOpt);
            return resultData;
        };
        var getPhoto = function (certificateId) {
            var resultData = "";
            var ajaxOpt = {
                url: "/" + controllerName + "/GetPhoto",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "text",
                async: false,
                success: function (jdata) {
                    resultData = jdata;
                }
            };
            ajaxRequest(ajaxOpt);
            return resultData;
        };
        var getCertificateQRCode = function (certificateNo) {
            var resultData = "";
            var ajaxOpt = {
                url: "/" + controllerName + "/GetCertificateQRCode",
                data: { "certificateNo": certificateNo },
                type: "post",
                dataType: "text",
                async: false,
                success: function (jdata) {
                    resultData = jdata;
                }
            };
            ajaxRequest(ajaxOpt);
            return resultData;
        };

        var loadCertificateData = function (certificateId) {
            var certificateData = getCertificateData(certificateId);
            //登记照
            var printContainer = $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']");
            printContainer.find("img[name='img_photo']").remove();
            // var photoUrl = controllerName + "/GetPhoto?employeeId=" + employeeId;
            var photoUrl = getPhoto(certificateId);
            var $img_photo = '<img name="img_photo" style="width:135px;height:150px;position:absolute;top:80px;left:100px;" src="data:image/png;base64,' + photoUrl + '" />';
            printContainer.append($img_photo);

            //二维码
            printContainer.find("img[name='img_QrCode']").remove();
            //var qrCodeUrl = controllerName + "/GetCertificateQRCode?certificateNo=" + certificateData.CertificateNo;
            var qrCodeUrl = getCertificateQRCode(certificateData.CertificateNo);
            var $img_QrCode = '<img name="img_QrCode" style="width:100px;height:100px;position:absolute;top:250px;left:330px;" src="data:image/png;base64,' + qrCodeUrl + '" />';
            printContainer.append($img_QrCode);

            printContainer.find("div[name='img_photo']").attr("src", photoUrl);
            printContainer.find("div[name='EmployeeName']").text(certificateData.EmployeeName);
            printContainer.find("div[name='Sex']").text(certificateData.Sex);
            printContainer.find("div[name='Birthday']").text(certificateData.Birthday);
            printContainer.find("div[name='IDNumber']").text(certificateData.IDNumber);
            printContainer.find("div[name='EnterpriseName']").text(certificateData.EnterpriseName);
            printContainer.find("div[name='Job']").text(certificateData.Job);
            printContainer.find("div[name='Title4Technical']").text(certificateData.Title4Technical);
            printContainer.find("div[name='CertificateNo']").text(certificateData.CertificateNo);
            printContainer.find("div[name='StartCertificateDate_Year']").text(certificateData.StartCertificateDate_Year);
            printContainer.find("div[name='StartCertificateDate_Month']").text(certificateData.StartCertificateDate_Month);
            printContainer.find("div[name='StartCertificateDate_Day']").text(certificateData.StartCertificateDate_Day);
        };
        var savePrintCertificateRecord = function () {
            var certificateNo = $mdlPrintCertificateInfo.find("[name='CertificateNo']").text();
            var ajaxOpt = {
                url: "/" + controllerName + "/SavePrintCertificateRecord",
                data: { "certificateNo": certificateNo },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                }
            };
            ajaxRequest(ajaxOpt);
        }
        var printCertificate = function (certificateId) {
            loadCertificateData(certificateId);
            $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']").jqprint({ operaSupport: true });
            savePrintCertificateRecord();
        };
        window.PrintCertificate = printCertificate;
        $("#btnRP_PrintCertificate_Print").on("click", function () {
            var rowId = $gridPrintCertificate.jqGrid("getGridParam", "selrow");
            if (!rowId) {
                alert("请选择要打印的证书记录");
                return false;
            }
            var certificateId = $gridPrintCertificate.jqGrid("getRowData", rowId).CertificateId;
            loadCertificateData(certificateId);
            $("#mdlRP_PrintCertificate_CertificateInfo").modal("toggle");
        });
        $mdlPrintCertificateInfo.find("[name='btnPrintCertificate']").on("click", function () {
            $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']").jqprint({ operaSupport: true });
            savePrintCertificateRecord();
        });
    }
    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initPrintCertificateGrid();
        initButtonArea();
        //initEnterpriseModal();
        //initCheckedModal();
    })

})
