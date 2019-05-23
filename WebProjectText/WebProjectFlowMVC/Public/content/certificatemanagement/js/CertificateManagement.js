
'use strict'
$(function () {

    var controllerName = "CertificateManagement";
    var $certificateManagement_QueryArea = $('#divCertificateManagement_QueryArea');
    var $gridCertificateManagement = $("#gridCertificateManagement_main");
    var $pagerCertificateManagement = $("#pagerCertificateManagement_main");
    var $divCertificateManagementInfo = $("#divCertificateManagement_CertificateManagementInfo");
    var $mdlCertificateManagementInfo = $("#mdlCertificateManagement_CertificateManagementInfo");

    var $mdlStatusChange = $("#mdlCertificateManagement_StatusChange");
    var $divStatusChange = $("#divCertificateManagement_StatusChange");

    var $mdlCamera = $("#mdlCertificateManagement_camera");
    var $divCamera = $("#divCertificateManagement_camera");
    var $canvasPhoto = $mdlCamera.find("[name='canvasPhoto']");
    var $canvasPhotoResult = $mdlCamera.find("[name='canvasPhotoResult']");

    var $mdlPrintCertificateInfo = $("#mdlCertificateManagement_CertificateInfo");




    var getSelectedRowDataOfGrid = function (rowid) {
        var selRowId = "";
        if (!rowid) {
            $gridCertificateManagement.jqGrid("getGridParam", "selrow");
        }
        selRowId = rowid;
        var rowData = {};
        if (selRowId && null != selRowId) {
            rowData = $gridCertificateManagement.jqGrid("getRowData", selRowId);
        }
        else {
            abortThread("请选中行！");
        }
        return rowData;
    }

    var refreshGrid = function () {
        $("#btnCertificateManagement_Query").click();
    }
    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnCertificateManagement_Query").on("click", function () {
                var queryData = {};

                queryData = getJson($certificateManagement_QueryArea)
                $gridCertificateManagement.jqGrid("setGridParam", { postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryCertificateStatus = function () {
            var $txtQueryCertificateStatus = $("#divCertificateManagement_QueryAreaCertificateStatus");
            var getCertificateStatusList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetCertificateStatusList",
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
            var listCertificateStatus = getCertificateStatusList();

            var $optionCertificateStatusAll = $("<option>");

            $optionCertificateStatusAll.val("");

            $optionCertificateStatusAll.text("正常");
            $txtQueryCertificateStatus.append($optionCertificateStatusAll);

            //for (var i = 0; i < listCertificateStatus.length ; i++) {
            //    var certificateStatus = listCertificateStatus[i];
            //    var $option = $("<option>");
            //    $option.val(certificateStatus);
            //    $option.text(certificateStatus);
            //    $txtQueryCertificateStatus.append($option);
            //}
        }

        var initQueryCity = function () {
            var $selectCity = $certificateManagement_QueryArea.find("[name='city']");
            ajaxRequest({
                url: "/" + controllerName + "/GetCityList",
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    var $optionAll = $("<option>");
                    $optionAll.val("");
                    $optionAll.text("请选择");
                    $selectCity.append($optionAll);

                    for (var i = 0; i < jdata.length ; i++) {
                        var city = jdata[i];
                        var $option = $("<option>");
                        $option.val(city);
                        $option.text(city);
                        $selectCity.append($option);
                    }
                }

            });
        }

        initQueryCertificateStatus();
        initQueryCity();
        initQueryButton();
        $certificateManagement_QueryArea.find("select").on("change", function () {
            refreshGrid();
        })
    }



    var initCertificateManagementGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divCertificateManagement_QueryArea")
        queryData = getJson(divQueryArea)
        $gridCertificateManagement.jqGrid({
            url: "/" + controllerName + "/GetCertificateListForJqGrid",
            datatype: "json",
            mtype: "post",
            // multiselect: true,
            // multiboxonly: true,
            postData: queryData,
            colNames: ["证书表ID", "持证人姓名", "性别", "出生年月", "身份证号", "企业名称", "职务", "技术职称", "证书编号", "证书类别", "证书状态", "证书有效期", "操作"],
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
                    { name: "certificateStatus", index: "certificateStatus", align: "center", width: 50 },
                    { name: "endCertificateDate", index: "endCertificateDate", align: "center", width: 60 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = ''
                              + '<a href="#" title="打印" onclick="CertificateManagement_PrintCertificate(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class=" fa fa-print"></i> 打印</a>'
                              + '<a href="#" title="变更企业" onclick="CertificateManagement_ChangeEnterprise(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class=" fa fa-exchange"></i> 变更企业</a>'
                              + '<a href="#" title="吊销" onclick="CertificateManagement_deactive(' + rowobj.certificateId + ',\'' + rowobj.certificateNo + '\')" style="padding: 7px;line-height: 1em;">'
                              + '<i class=" fa fa-remove"></i> 吊销</a>'
                              + '<a href="#" title="恢复" onclick="CertificateManagement_recover(' + rowobj.certificateId + ',\'' + rowobj.certificateNo + '\')" style="padding: 7px;line-height: 1em;">'
                              + '<i class=" fa fa-refresh"></i> 恢复</a>'

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
            pager: $pagerCertificateManagement,
            ondblClickRow: function (rowid, iRow, iCol, e) {
                $gridCertificateManagement.jqGrid("toggleSubGridRow", rowid);
            },
            subGrid: true,
            subGridOptions: {
                "plusicon": "ace-icon fa fa-plus",
                "minusicon": "ace-icon fa fa-minus",
                "openicon": "ace-icon fa fa-share",
            },
            subGridRowExpanded: function (subgrid_id, row_id) {
                var subgrid_table_id, pager_id;
                var rowData = $gridCertificateManagement.jqGrid("getRowData", row_id);
                subgrid_table_id = subgrid_id + "_t";
                pager_id = "p_" + subgrid_table_id;
                $("#" + subgrid_id).html("<div style='width:100%;overflow:auto'><table id='" + subgrid_table_id + "' class='scroll' ></table></div>");
                var subGridQueryData = {};
                subGridQueryData.certificateNo = rowData.certificateNo;
                $("#" + subgrid_table_id).jqGrid({
                    url: "/" + controllerName + "/GetCertificateListForSubJqGrid",
                    datatype: "json",
                    mtype: "post",
                    postData: subGridQueryData,
                    rownumbers: true,
                    colNames: ["操作", "备注", "操作人", "操作时间"],
                    colModel: [
                        { name: "operateType", index: "operateType", width: "50", align: "center" },
                        { name: "remark", index: "remark", width: "100", align: "center" },
                        { name: "createUserName", index: "createUserName", width: "100", align: "center" },
                        { name: "createDate", index: "createDate", width: "80", align: "center" }
                    ],
                    autoWidth: true,
                    //rowNum: 9999,
                    //pager: "#p_" + subgrid_table_id,                
                    //rowList: [10, 20, 30], 
                    //sortname: "CheckTime",
                    //sortorder: "desc",
                    //height: "100%",
                    //viewrecords: true,
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        return false;
                    },
                    loadComplete: function () {
                        jqGridAutoWidth();
                    }
                });
            },
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridCertificateManagement.selector);
            }
        });
    }

    var enum_operateType = {
        deactive: "吊销",
        recover: "恢复"
    };

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

    var initButtonArea = function () {
        //暂扣
        window.CertificateManagement_suspension = function (certificateId, certificateNo) {
            Open$mdlStatusChange(certificateId, certificateNo, enum_operateType.suspension);
        }
        //吊销
        window.CertificateManagement_deactive = function (certificateId, certificateNo) {
            Open$mdlStatusChange(certificateId, certificateNo, enum_operateType.deactive);
        }
        //恢复
        window.CertificateManagement_recover = function (certificateId, certificateNo) {
            Open$mdlStatusChange(certificateId, certificateNo, enum_operateType.recover);
        }
        var Open$mdlStatusChange = function (certificateId, certificateNo, operateType) {
            $mdlStatusChange.find("[name='title']").text(operateType + "确认");
            $divStatusChange.find("[name='operateType']").val(operateType);
            $divStatusChange.find("[name='certificateId']").val(certificateId);
            $divStatusChange.find("[name='certificateNo']").val(certificateNo);
            $divStatusChange.find("[name='remark']").val('');
            $mdlStatusChange.modal("toggle");
        }


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
        window.CertificateManagement_ChangeEnterprise = function (rowId) {
            var rowData = $gridCertificateManagement.jqGrid("getRowData", rowId);
            if ($.trim(rowData.examType).toUpperCase() == "C") {
                alert("C类证书不能变更企业");
                return false;
            }
            var certificateId = rowData.certificateId;
            //先进行实名认证
            var certData = certRead("objCertificateManagement_CertCtl");
            if (!certData || !certData.CertNumber) {
                alert("身份证读取失败,卡片未放好或已经读取过");
                return false;
            }
            //var certData = {};
            //certData.CertNumber = "429004198801010590";
            certData.certificateId = certificateId;
            var uploadResult = uploadCertInfo(certData);
            if (uploadResult.IsSuccess === false) {
                alert("姓名：" + certData.PartyName + "，身份证号：" + certData.CertNumber + "，实名认失败\r\n" + uploadResult.ErrorMessage);
                return false;
            }
            photograph(certificateId);
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
                    //如果证书类型为C类 则显示证书类型选择框  隐藏证书类型TD
                    if ($.trim(jdata.examType).toUpperCase() == "C") {
                        $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='examType']").addClass("hidden");
                        $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='examTypeSelect']").removeClass("hidden");
                        $mdlCamera.find("[name='divEmployeeInfo']").find("select[name='examType']").val("");
                    }
                    else {
                        $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='examType']").removeClass("hidden");
                        $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='examTypeSelect']").addClass("hidden");
                    }

                    //加载可编辑的信息
                    var $enterprisNameSelect = $mdlCamera.find("select[name='enterpriseName']");
                    $enterprisNameSelect.val("");
                    $enterprisNameSelect.val(jdata.enterpriseName);
                    $enterprisNameSelect.trigger("chosen:updated");
                }
            });
        }
        var photograph = function (certificateId) {
            $mdlCamera.find("[name='certificateId']").val(certificateId);
            initCamera();
            loadCertificateInfo(certificateId);
            $mdlCamera.modal("show");
        }

        var getCertificateData = function (certificateId) {
            var resultData = {};
            var ajaxOpt = {
                url: "/" + controllerName + "/GetCertificateData",
                data: { "certificateId": certificateId },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        throw new Error("获取证书信息失败\r\n" + jdata.ErrorMessage);
                    }
                    resultData = jdata;
                }
            };
            ajaxRequest(ajaxOpt);
            return resultData;
        };


        var loadCertificateData = function (certificateId) {
            var certificateData = getCertificateData(certificateId);

            var printContainer = $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']");
            //登记照
            printContainer.find("img[name='img_photo']").remove();
            var $img_photo = '<img name="img_photo" style="width:135px;height:150px;position:absolute;top:80px;left:100px;" src="data:image/png;base64,' + certificateData.PhotoBase64 + '" />';
            printContainer.append($img_photo);

            //二维码
            printContainer.find("img[name='img_QrCode']").remove();
            var $img_QrCode = '<img name="img_QrCode" style="width:100px;height:100px;position:absolute;top:250px;left:330px;" src="data:image/png;base64,' + certificateData.QRCodeBase64 + '" />';
            printContainer.append($img_QrCode);

            //printContainer.find("div[name='img_photo']").attr("src", photoUrl);
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
        var printCertificate = function (rowId) {
            var rowData = $gridCertificateManagement.jqGrid("getRowData", rowId);
            var certificateId = rowData.certificateId;
            loadCertificateData(certificateId);
            $mdlPrintCertificateInfo.find("div[name='divCertificatePrint']").jqprint({ operaSupport: true });
            //savePrintCertificateRecord();
        };
        window.CertificateManagement_PrintCertificate = printCertificate;
    }

    var initStatusChangeModal = function () {
        //初始化保存按钮
        var initCertificateManagementSavaButton = function () {

            //吊销
            var deactiveOk = function (jsonData) {
                var postData = jsonData;
                var ajaxOpt = {
                    url: "/" + controllerName + "/CertificateDeactive",
                    data: postData,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("吊销成功！");
                            $gridCertificateManagement.jqGrid().trigger("reloadGrid");
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            }
            //恢复
            var recoverOk = function (jsonData) {
                var postData = jsonData;
                var ajaxOpt = {
                    url: "/" + controllerName + "/CertificateRecover",
                    data: postData,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess) {
                            alert("恢复成功！");
                            $gridCertificateManagement.jqGrid().trigger("reloadGrid");
                        }
                        else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            }

            $mdlStatusChange.find("button[name='Ok']").on("click", function () {

                var jsonData = getJson($divStatusChange);
                debugger;

                if (enum_operateType.deactive == jsonData.operateType) {
                    deactiveOk(jsonData);
                }
                else if (enum_operateType.recover == jsonData.operateType) {
                    recoverOk(jsonData);
                }
                else {
                    alert("【" + jsonData.operateType + "】操作无效");
                }
                $mdlStatusChange.modal("toggle");
            });
        }

        initCertificateManagementSavaButton();
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
        var changeEnterpriseName = function () {
            var postData = {};
            postData.certificateId = $mdlCamera.find("[name='certificateId']").val();
            postData.examType = $mdlCamera.find("select[name='examType']").val();
            postData.enterpriseName = $mdlCamera.find("[name='enterpriseName']").val();
            ajaxRequest({
                url: "/" + controllerName + "/EnterpriseChange",
                data: postData,
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert("企业变更出错\r\n" + jdata.ErrorMessage);
                        return false;
                    }
                    alert("变更成功");
                }
            });
        }
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
                        changeEnterpriseName();
                        $mdlCamera.modal("hide");
                        refreshGrid()
                    }

                }
            });
        });
        var initEnterpriseChosen = function () {
            ajaxRequest({
                url: "/" + controllerName + "/GetEnterpriseList",
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    var $select = $mdlCamera.find("select[name='enterpriseName']");
                    var $optionAll = $("<option>");
                    $optionAll.val("");
                    $optionAll.text("请选择");
                    // $select.append($optionAll);
                    for (var i = 0; i < jdata.length ; i++) {
                        var item = jdata[i];
                        var $option = $("<option>");
                        $option.val(item.enterpriseName);
                        $option.text(item.enterpriseName + "【" + item.socialCreditCode + "】");
                        $select.append($option);
                    }

                    $select.chosen({
                        no_results_text: "未找到此企业",
                        placeholder_text: "请选择企业",
                        search_contains: true,
                        disable_search_threshold: 5
                    });
                }

            });
        };
        initEnterpriseChosen();
    }

    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initCertificateManagementGrid();
        initButtonArea();
        initStatusChangeModal();
        initCameraModal();
    })

})
