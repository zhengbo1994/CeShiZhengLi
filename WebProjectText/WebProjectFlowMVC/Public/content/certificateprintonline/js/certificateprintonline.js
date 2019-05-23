$(function () {
    var controllerName = "CertificatePrintOnline";
    var $pagerCertificatePrintOnline = $("#pagerCertificatePrintOnline_main");
    var $gridCertificatePrintOnline = $("#gridCertificatePrintOnline_main");

    var initQueryArea = function () {
        //初始化查询按钮
        var initQueryButton = function () {
            $("#btnCertificatePrintOnline_Query").on("click", function () {
                var queryData = {};
                var divQueryArea = $("#divCertificatePrintOnline_QueryArea")
                queryData = getJson(divQueryArea)
                $gridCertificatePrintOnline.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }
        initQueryButton();
    }


    var initCertificatePrintOnlineGrid = function () {
        debugger;
        var queryData = {};
        var divQueryArea = $("#divCertificatePrintOnline_QueryArea")
        queryData = getJson(divQueryArea)
        $gridCertificatePrintOnline.jqGrid({
            url: "/" + controllerName + "/GetCertificateListForJqGrid",
            datatype: "json",
            mtype: "post",
            postData: queryData,
            colNames: ["证书Id","持证人姓名", "性别", "出生年月", "身份证号", "企业名称", "职务", "技术职称", "证书编号", "证书类别", "证书有效期"],
            colModel: [
                    { name: "certificateId", index: "certificateId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 50 },
                    { name: "sex", index: "sex", align: "center", width: 30 },
                    { name: "birthday", index: "birthday", align: "center", width: 50 },
                    { name: "iDNumber", index: "iDNumber", align: "center", width: 100 },
                    { name: "enterpriseName", index: "enterpriseName", align: "center", width: 100 },
                    { name: "job", index: "job", align: "center", width: 80 },
                    { name: "title4Technical", index: "title4Technical", align: "center", width: 80 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 120 },
                    { name: "examType", index: "examType", align: "center", width: 50 },
                    { name: "endCertificateDate", index: "endCertificateDate", align: "center", width: 60 },

            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerCertificatePrintOnline,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridCertificatePrintOnline.selector);
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
                    resultData = jdata;
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
            debugger;
            var certificateData = getCertificateData(certificateId);

            //登记照
            //var printContainer = $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']");
            //printContainer.find("img[name='img_photo']").remove();
            var photoContainer = $("#divCertificatePrintOnline_Print").find("td[name='tdPhoto']");
            photoContainer.empty();
            var photoUrl = getPhoto(certificateId);
            var $img_photo = '<img style="height:150px;margin-left:50px" src="data:image/png;base64,' + photoUrl + '"/>'
            //var $img_photo = '<img name="img_photo" style="width:135px;height:150px;position:absolute;top:80px;left:100px;" src="data:image/png;base64,' + photoUrl + '" />';
            photoContainer.append($img_photo);


            var QRCodeContainer = $("#divCertificatePrintOnline_Print").find("td[name='tdQRCode']");
            QRCodeContainer.empty();
            var qrCodeUrl = getCertificateQRCode(certificateData.CertificateNo);
            $img_QrCode = '<img src="data:image/png;base64,' + qrCodeUrl + '" />';
            QRCodeContainer.append($img_QrCode);
            ////二维码
            //printContainer.find("img[name='img_QrCode']").remove();
            ////var qrCodeUrl = controllerName + "/GetCertificateQRCode?certificateNo=" + certificateData.CertificateNo;
            //var qrCodeUrl = getCertificateQRCode(certificateData.CertificateNo);
            //var $img_QrCode = '<img name="img_QrCode" style="width:100px;height:100px;position:absolute;top:250px;left:330px;" src="data:image/png;base64,' + qrCodeUrl + '" />';
            //printContainer.append($img_QrCode);

            setJson($("#divCertificatePrintOnline_Print"), certificateData);
        };


        $("#btnCertificatePrintOnline_Print").on("click", function () {
            var rowId = $gridCertificatePrintOnline.jqGrid("getGridParam", "selrow");
            if (!rowId) {
                alert("请选择要打印的证书记录");
                return false;
            }

            var certificateId = $gridCertificatePrintOnline.jqGrid("getRowData", rowId).certificateId;
            loadCertificateData(certificateId);
            $("#divCertificatePrintOnline_Print").jqprint({ operaSupport: true });

        });

    }


    $(document).ready(function () {

        initQueryArea();
        initCertificatePrintOnlineGrid();

        initButtonArea();

    })
})