
'use strict'
$(function () {

    var controllerName = "CertificateDelayDataCheck";
    var $divQueryArea = $('#divCertificateDelayDataCheck_QueryArea');
    var $gridMain = $("#gridCertificateDelayDataCheck_main");
    var $pagerMain = $("#pagerCertificateDelayDataCheck_main");


    var $mdlCheckInfo = $("#mdlCertificateDelayDataCheck_CheckInfo");
    var $divCheckInfo = $("#divCertificateDelayDataCheck_CheckInfo");

    var $mdlCamera = $("#mdlCertificateDelayDataCheck_camera");
    var $divCamera = $("#divCertificateDelayDataCheck_camera");
    var $canvasPhoto = $mdlCamera.find("[name='canvasPhoto']");
    var $canvasPhotoResult = $mdlCamera.find("[name='canvasPhotoResult']");
    var $queryButton = $("#btnCertificateDelayDataCheck_Query");



    var initQueryArea = function () {
        var initQueryButton = function () {
            $queryButton.on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initSelectChange = function () {
            $divQueryArea.find("select").on("change", function () {
                $queryButton.click();
            });
        }
        initQueryButton();
        initSelectChange();
    }

    var refreshQuery = function () {
        $queryButton.click();
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
            colNames: ["certificateId", "姓名", "性别", "身份证号", "职务", "技术职称", "行业", "证书类别", "证书编号", "企业名称", "实名认证值", "实名认证", "拍照值", "拍照", "延期资格审核", "延期资格审核日期", "操作"],
            colModel: [
                    { name: "certificateId", index: "certificateId", width: 30, hidden: true },
                    { name: "employeeName", index: "employeeName", align: "center", width: 80 },
                    { name: "sex", index: "Sex", align: "center", width: 50 },
                    { name: "iDNumber", index: "IDNumber", align: "center", width: 120 },
                    { name: "job", index: "Job", align: "center", width: 80 },
                    { name: "title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "industry", index: "industry", align: "center", width: 80 },
                    { name: "examType", index: "examType", align: "center", width: 80 },
                    { name: "certificateNo", index: "certificateNo", align: "center", width: 120 },
                    { name: "enterpriseName", index: "enterpriseName", align: "center", width: 150 },
                    { name: "authenticationStatus", index: "authenticationStatus", align: "center", width: 80, hidden: true },
                    {
                        name: "authenticationStatusDisplay", index: "authenticationStatusDisplay", align: "center", width: 80,
                        formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.authenticationStatus == true) {
                                var buttons = '<i class="fa fa-check blue"></i>';
                            }
                            return buttons;
                        }
                    },
                    { name: "photoStatus", index: "photoStatus", align: "center", width: 80, hidden: true },
                    {
                        name: "photoStatusDisplay", index: "photoStatusDisplay", align: "center", width: 50,
                        formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.photoStatus == true) {
                                var buttons = '<i class="fa fa-check blue"></i>';
                            }
                            return buttons;
                        }
                    },
                    { name: "checkStatus", index: "checkStatus", align: "center", width: 80 },
                    { name: "checkDate", index: "checkDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 200, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            buttons += '<a href="#" title="拍照" onclick="CertificateDelayDataCheck_Photograph(' + rowobj.certificateId + ')" style="padding: 7px;line-height: 1em;">'
                             + '<i class=" fa fa-camera"></i> 拍照</a>'
                            + '<a href="#" title="延期审核" onclick="CertificateDelayDataCheck_dataCheck(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                            + '<i class=" fa fa-check"></i> 延期审核</a>'
                               + '<a href="#" title="查看" onclick="CertificateDelayDataCheck_viewDataCheck(' + rowobj.certificateId + ')" style="padding: 7px;line-height: 1em;">'
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


    var initCamera = function () {
        var $canvas = $canvasPhoto;
        var ctx = $canvas[0].getContext("2d");
        var initJQWebCam = function () {
            //初始化登记照画布
            var photoWidth = 172, photoHeight = 240;
            $canvasPhotoResult[0].setAttribute('width', photoWidth);
            $canvasPhotoResult[0].setAttribute('height', photoHeight);

            //初始化视频截图画布
            var pos = 0;
            var canvasWidth = 320, canvasHeight = 240;
            var canvas = $canvas[0];
            canvas.setAttribute('width', canvasWidth);
            canvas.setAttribute('height', canvasHeight);
            var ctx = canvas.getContext("2d");
            var image = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

            //截图到登记照画布
            var cutPhoto = function (src_canvas, dest_canvas) {
                debugger;
                var srcWidth = src_canvas.getAttribute("width");
                var srcHeight = src_canvas.getAttribute("height");

                var destWidth = dest_canvas.getAttribute('width');
                var destHeight = dest_canvas.getAttribute('height');
                //照片保存到画布完毕
                var img = new Image();
                img.src = src_canvas.toDataURL("image/png");
                var newContext = dest_canvas.getContext("2d");
                //截取中间部分
                //原图开始位置
                /*
                img	规定要使用的图像、画布或视频。
                sx	可选。开始剪切的 x 坐标位置。
                sy	可选。开始剪切的 y 坐标位置。
                swidth	可选。被剪切图像的宽度。
                sheight	可选。被剪切图像的高度。
                x	在画布上放置图像的 x 坐标位置。
                y	在画布上放置图像的 y 坐标位置。
                width	可选。要使用的图像的宽度。（伸展或缩小图像）
                height	可选。要使用的图像的高度。（伸展或缩小图像）
                */
                newContext.drawImage(img, (srcWidth - destWidth) / 2, 0, destWidth, destHeight, 0, 0, destWidth, destHeight);
            }
            //循环保存
            var saveCB = function (data) {
                var col = data.split(";");
                var img = image;
                for (var i = 0; i < canvasWidth; i++) {
                    var tmp = parseInt(col[i]);
                    img.data[pos + 0] = (tmp >> 16) & 0xff;
                    img.data[pos + 1] = (tmp >> 8) & 0xff;
                    img.data[pos + 2] = tmp & 0xff;
                    img.data[pos + 3] = 0xff;
                    pos += 4;
                }
                if (pos >= 4 * canvasWidth * canvasHeight) {
                    ctx.putImageData(img, 0, 0);
                    pos = 0;
                    cutPhoto(canvas, $canvasPhotoResult[0]);
                }
            };
            $divCamera.html("");
            $divCamera.webcam({
                width: canvasWidth,
                height: canvasHeight,
                mode: "callback",
                swffile: "/Public/jquery-webcam/jscam_canvas_only.swf",
                onTick: function () { },
                onSave: saveCB,
                onCapture: function () {
                    window.webcam.save();
                },
                debug: function () { },
                onLoad: function () { }
            });
        };
        initJQWebCam();
    };

    var resetForm = function ($form) {
        var data = getJson($form);
        for (var p in data) {
            data[p] = "";
        }
        setJson($form, data);
    }

    var initButtonArea = function () {


        var initCheckButton = function () {
            $("#btnCertificateDelayDataCheck_Check").on("click", function () {
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                if (arrRowid.length < 1) {
                    alert("请选择需要审核记录");
                    return false;
                }
                $divCheckInfo.find("tr[name='baseInfo']").addClass("hidden");
                resetForm($divCheckInfo);
                $mdlCheckInfo.modal("show");
            })

        }

        var initCertReaderButton = function () {

            var uploadCertInfo = function (certData) {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/UploadCertInfo",
                    type: "post",
                    data: certData,
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    }

                });
                return dataResult;
            }

            $("#btnCertificateDelayDataCheck_CertReader").on("click", function () {

                var certData = certRead("objCertificateDelayDataCheck_CertCtl");
                if (!certData || !certData.CertNumber) {
                    alert("身份证读取失败,卡片未放好或已经读取过");
                    return false;
                }
                //var certData = {};
                //certData.CertNumber = "429005197202178297";
                var uploadResult = uploadCertInfo(certData);
                if (uploadResult.IsSuccess === false) {
                    alert("姓名：" + certData.PartyName + "，身份证号：" + certData.CertNumber + "，实名认失败\r\n" + uploadResult.ErrorMessage);
                    return false;
                }
                var certificateId = uploadResult.ErrorMessage;

                CertificateDelayDataCheck_Photograph(certificateId);
            })

        }

        var loadCertificateInfo = function (certificateId) {
            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateInfo",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    //if (jdata.IsSuccess === true) {
                    //    debugger;
                    //    var img = new Image();
                    //    img.src = "data:image/png;base64," + jdata.ErrorMessage;
                    //    var newContext = $canvasPhotoResult[0].getContext("2d");
                    //    newContext.drawImage(img, 0, 0);
                    //} else {
                    //    console.log("loadPhoto:" + jdata.ErrorMessage);
                    //}
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    //加载已有照片
                    if (isNull(jdata.photoBase64) == false) {
                        var img = new Image();
                        img.src = "data:image/png;base64," + jdata.photoBase64;
                        var newContext = $canvasPhotoResult[0].getContext("2d");
                        newContext.drawImage(img, 0, 0);
                    }
                    //加载个人信息
                    for (var p in jdata) {
                        $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='" + p + "']").text(isNull(jdata[p]) ? "" : jdata[p]);
                    }
                }
            });
        }
        window.CertificateDelayDataCheck_Photograph = function (certificateId) {
            $mdlCamera.find("[name='certificateId']").val(certificateId);
            initCamera();
            loadCertificateInfo(certificateId);
            $mdlCamera.modal("show");
        }
        window.CertificateDelayDataCheck_dataCheck = function (rowId) {
            var certificateId = $gridMain.jqGrid("getRowData", rowId).certificateId;
            var checkStatus = $gridMain.jqGrid("getRowData", rowId).checkStatus;
            if (checkStatus != "未审核") {
                alert("不能重复审核");
                return false;
            }
            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateDelayData",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    $divCheckInfo.find("tr[name='baseInfo']").removeClass("hidden");
                    resetForm($divCheckInfo);
                    jdata.certificateId = certificateId;
                    setJson($divCheckInfo, jdata);
                    //将页面的控件禁用
                    var divData = getJson($divCheckInfo);
                    for (var key in divData) {
                        $divCheckInfo.find("[name='" + key + "']").prop("disabled", true);
                    }
                    //启用可编辑的控件
                    $divCheckInfo.find("[name='inValidityDate']").prop("disabled", false);
                    $divCheckInfo.find("[name='annualSafetyTraining']").prop("disabled", false);
                    $divCheckInfo.find("[name='notBadBehavior']").prop("disabled", false);
                    $divCheckInfo.find("[name='trainingWith24Hours']").prop("disabled", false);
                    $divCheckInfo.find("[name='checkedMark']").prop("disabled", false);
                    //显示审核按钮
                    $mdlCheckInfo.find("[name='btnCheckPass'],[name='btnCheckNoPass']").removeClass("hidden");

                    $mdlCheckInfo.modal("show");
                }
            });

        }

        window.CertificateDelayDataCheck_viewDataCheck = function (certificateId) {

            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateDelayData",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    $divCheckInfo.find("tr[name='baseInfo']").removeClass("hidden");
                    resetForm($divCheckInfo);
                    jdata.certificateId = certificateId;
                    setJson($divCheckInfo, jdata);
                    //禁用页面控件
                    var divData = getJson($divCheckInfo);
                    for (var key in divData) {
                        $divCheckInfo.find("[name='" + key + "']").prop("disabled", true);
                    }
                    //隐藏审核按钮
                    $mdlCheckInfo.find("[name='btnCheckPass'],[name='btnCheckNoPass']").addClass("hidden");
                    $mdlCheckInfo.modal("show");
                }
            });

        }

        initCheckButton();
        initCertReaderButton();

    }


    var initCameraModal = function () {

        $mdlCamera.find("[name='btnPhotograph']").on("click", function () {
            window.webcam.capture();
        });
        var clearPhoto = function () {
            $canvasPhoto[0].getContext('2d').clearRect(0, 0, $canvasPhoto[0].width, $canvasPhoto[0].height);
            $canvasPhotoResult[0].getContext('2d').clearRect(0, 0, $canvasPhotoResult[0].width, $canvasPhotoResult[0].height);
            $divCamera.html("");
        }
        $mdlCamera.on("hide.bs.modal", function () {
            clearPhoto();
        })
        $mdlCamera.find("[name='btnSave']").on("click", function () {
            var postData = {};
            var dataUrl = $canvasPhotoResult[0].toDataURL("image/png");
            if (dataUrl && dataUrl.length > 1) {
                dataUrl = dataUrl.substr(dataUrl.indexOf(',') + 1);
            }
            postData.fileInBase64 = dataUrl;
            postData.certificateId = $mdlCamera.find("[name='certificateId']").val();
            $.ajax({
                url: "/" + controllerName + "/SavePhoto",
                data: postData,
                type: "post",
                dataType: "json",
                async: true,
                success: function (jdata) {
                    if (jdata.IsSuccess == false) {
                        alert("保存登记照出错：" + jdata.ErrorMessage);
                        return false;
                    }
                    else {
                        alert("保存成功");
                        $gridMain.jqGrid().trigger("reloadGrid");
                        $mdlCamera.modal("hide");
                    }

                }
            });
        });

    }

    var initCheckModal = function () {
        var defaultCheckedMark = "资料齐全,同意";

        var initCheckDelayConditions = function () {
            $divCheckInfo.find("[name='inValidityDate'],[name='annualSafetyTraining'],[name='notBadBehavior'],[name='trainingWith24Hours']").on("change", function () {
                var inValidityDate = $divCheckInfo.find("[name='inValidityDate'][value='True']").prop("checked");
                var annualSafetyTraining = $divCheckInfo.find("[name='annualSafetyTraining'][value='True']").prop("checked");
                var notBadBehavior = $divCheckInfo.find("[name='notBadBehavior'][value='True']").prop("checked");
                var trainingWith24Hours = $divCheckInfo.find("[name='trainingWith24Hours'][value='True']").prop("checked");
                if (inValidityDate && annualSafetyTraining && notBadBehavior && trainingWith24Hours) {
                    $divCheckInfo.find("[name='delayConditions'][value='True']").prop("checked", true);
                }
                else {
                    $divCheckInfo.find("[name='delayConditions'][value='False']").prop("checked", true);
                }
            });
        }

        var check = function (passStatus) {
            var formData = getJson($divCheckInfo);
            var postData = {};
            postData.PassStatus = passStatus;
            postData.inValidityDate = formData.inValidityDate;
            postData.annualSafetyTraining = formData.annualSafetyTraining;
            postData.notBadBehavior = formData.notBadBehavior;
            postData.trainingWith24Hours = formData.trainingWith24Hours;
            // postData.delayConditions = formData.delayConditions;
            postData.checkedMark = formData.checkedMark;

            if (passStatus == true) {
                if (postData.inValidityDate != "True" || postData.annualSafetyTraining != "True" || postData.notBadBehavior != "True" || postData.trainingWith24Hours != "True") {
                    alert("延期条件不满足,不能审核通过");
                    return false;
                }
            }
            var certificateIdList = [];

            if (isNull(formData.certificateId)) {//如果form 上没有人员Id 则认为是多选
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                for (var i = 0; i < arrRowid.length; i++) {
                    var certificateId = $gridMain.jqGrid("getRowData", arrRowid[i]).certificateId;
                    certificateIdList.push(certificateId);
                }
            }
            else {
                certificateIdList.push(formData.certificateId);
            }
            postData.certificateIdList = certificateIdList;

            ajaxRequest({
                url: "/" + controllerName + "/CheckByCertificateIdList?v=" + (new Date()).toDateString(),
                data: { "strData": JSON.stringify(postData) },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === true) {
                        alert("审核成功！")
                        refreshQuery();
                        $mdlCheckInfo.modal("hide");
                    } else {
                        alert(jdata.ErrorMessage);
                    }
                }
            });
        }

        var initCheckedPassButton = function () {
            $mdlCheckInfo.find("[name='btnCheckPass']").on("click", function () {
                //var delayConditions = $divCheckInfo.find("[name='delayConditions'][value='True']").prop("checked");
                //if (delayConditions === false) {
                //    alert("不符合延期条件不能审核通过");
                //    return false;
                //}
                check(true);
            });
        }

        var initCheckedNoPassButton = function () {
            $mdlCheckInfo.find("[name='btnCheckNoPass']").on("click", function () {
                var checedMark = $divCheckInfo.find("[name='checkedMark']").val();
                if (checedMark == defaultCheckedMark) {
                    alert("请填写审核意见");
                    return false;
                }
                check(false);
            });
        }

        initCheckedPassButton();
        initCheckedNoPassButton();
        $mdlCheckInfo.on("show.bs.modal", function () {
            if ($mdlCheckInfo.find("[name='checkedMark']").val() == "") {
                $mdlCheckInfo.find("[name='checkedMark']").val(defaultCheckedMark);
            }

        });
        // initCheckDelayConditions();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initMainGrid();
        initButtonArea();
        //initCheckModal();
        initCameraModal();
        initCheckModal();
    })

})
