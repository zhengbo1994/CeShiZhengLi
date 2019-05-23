
'use strict'
$(function () {


    var controllerName = "Authentication";
    var $divQueryArea = $('#divAuthentication_QueryArea');
    var $gridMain = $("#gridAuthentication_Main");
    var $pagerMain = $("#pagerAuthentication_Main");

    var $mdlCamera = $("#mdlAuthentication_camera");
    var $divCamera = $("#divAuthentication_camera");
    var $canvasPhoto = $("#canvasAuthentication_Photo");
    var $canvasPhotoResult = $("#canvasAuthentication_PhotoResult");


    var initQueryArea = function () {

        var initSelectExamPlanNumber = function () {

            var getExamPlanNumberList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetExamPlanNumberList",
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function () {
                    }
                });
                return dataResult;
            }

            var examPlanNumberList = getExamPlanNumberList();

            var $select = $divQueryArea.find("[name='ExamPlanNumber']");

            for (var i = 0; i < examPlanNumberList.length; i++) {
                var examPlanNumber = examPlanNumberList[i];
                var $option = $("<option>").append(examPlanNumber).val(examPlanNumber);
                $select.append($option);
            }


        }

        var initSelectExaminationRoom = function () {

            var getExaminationRoomList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetExaminationRoomList",
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function () {
                    }
                });
                return dataResult;
            }

            var examinationRoomList = getExaminationRoomList();

            var $select = $divQueryArea.find("[name='ExamRoomId']");

            debugger;

            for (var i = 0; i < examinationRoomList.length; i++) {
                var examinationRoom = examinationRoomList[i];
                var $option = $("<option>").append(examinationRoom.ExaminationRoomName).val(examinationRoom.ExaminationRoomId);
                $select.append($option);
            }


        }

        var initQueryButton = function () {
            $("#btnAuthentication_Query").on("click", function () {
                var queryData = getJson($divQueryArea);
                queryData = getJson($divQueryArea);
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }

        initSelectExamPlanNumber();
        initSelectExaminationRoom();
        initQueryButton();
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
    var initButtonArea = function () {

        var initCertReaderButton = function () {

            var verifyEmployeeByIdNumber = function (idNumber) {

                var param = getJson($divQueryArea);
                param.idNumber = idNumber;

                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/VerifyEmployeeByIdNumber",
                    type: "post",
                    data: param,
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = jdata;
                    },
                    error: function () {
                        dataResult = false;
                    }
                });
                return dataResult;



            }

            var uploadCertInfo = function (certData) {
                var param = getJson($divQueryArea);
                certData.ExamPlanNumber = param.ExamPlanNumber;
                certData.ExamRoomId = param.ExamRoomId;

                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/UploadCertInfo",
                    type: "post",
                    data: certData,
                    datatype: "json",
                    async: false,
                    success: function (jdata) {
                        dataResult = true;
                    },
                    error: function () {
                        dataResult = false;
                    }
                });
                return dataResult;
            }

            $("#btnAuthentication_CertReader").on("click", function () {

                //certConnect("objAuthentication_CertCtl");
                var certData = certRead("objAuthentication_CertCtl");
                //certDisonnect("objAuthentication_CertCtl");


                debugger;

                var verifyResult = verifyEmployeeByIdNumber(certData.CertNumber);



                if (verifyResult == "True") {

                    var uploadResult = uploadCertInfo(certData);
                    if (uploadResult) {
                        //alert("姓名：" + certData.PartyName + "，身份证号：" + certData.CertNumber + "，实名认证成功！");
                        var rowIds = $gridMain.jqGrid("getDataIDs");
                        var rowId = 0;
                        for (var i = 0; i < rowIds.length; i++) {
                            var rowData = $gridMain.jqGrid("getRowData", rowIds[i]);
                            if (rowData.IDNumber.toLowerCase() === certData.CertNumber.toLowerCase()) {
                                rowId = rowIds[i];
                                break;
                            }
                        }
                        Authentication_Photograph(rowId);
                        // $("#btnAuthentication_Query").click();
                    }
                    else {
                        alert("姓名：" + certData.PartyName + "，身份证号：" + certData.CertNumber + "，实名认证数据上传失败！")
                    }
                }
                else {
                    alert("姓名：" + certData.PartyName + "，身份证号：" + certData.CertNumber + "，身份验证失败！")

                }

            })

        }
        var loadEmployeeInfo = function (employeeId) {
            ajaxRequest({
                url: "/" + controllerName + "/GetEmployeeInfo",
                data: { employeeId: employeeId },
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
                    if (isNull(jdata.PhotoBase64) == false) {
                        var img = new Image();
                        img.src = "data:image/png;base64," + jdata.PhotoBase64;
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
        window.Authentication_Photograph = function (rowId) {
            var rowData = $gridMain.jqGrid("getRowData", rowId);
            var employeeId = rowData.EmployeeId;
            $mdlCamera.find("[name='EmployeeId']").val(employeeId);
            initCamera();
            loadEmployeeInfo(employeeId);
            $mdlCamera.modal("show");
        }

        initCertReaderButton();

    }

    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea);
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetAuthenticationEmployeeListForJqgrid",
            datatype: "json",
            //multiselect: true,
            //multiboxonly: true,
            postData: queryData,
            colNames: ["EmployeeId", "姓名", "性别", "年龄", "身份证号", "企业名称", "职务", "技术职称", "报考行业", "报考科目", "注册建造师证书编号", "备注", "实名认证状态值", "照片上传状态值", "实名认证状态", "照片上传状态", "操作"],
            colModel: [
                    { name: "EmployeeId", index: "EmployeeId", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "Age", index: "Age", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 150 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "ConstructorCertificateNo", index: "ConstructorCertificateNo", align: "center", width: 150 },
                    { name: "Remark", index: "Remark", align: "center", width: 150 },
                    { name: "AuthenticationStatus", index: "AuthenticationStatus", align: "center", width: 150, hidden: true },
                    { name: "ImageStatus", index: "ImageStatus", align: "center", width: 150, hidden: true },
                    {
                        name: "AuthenticationStatusDisplay", index: "AuthenticationStatusDisplay", align: "center", width: 150,
                        formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.AuthenticationStatus == true) {
                                var buttons = '<i class="fa fa-check blue"></i>';
                            }
                            return buttons;
                        }
                    },
                    {
                        name: "ImageStatusDisplay", index: "ImageStatusDisplay", align: "center", width: 150, formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            if (rowobj.ImageStatus == true) {
                                var buttons = '<i class="fa fa-check blue"></i>';
                            }
                            return buttons;
                        }
                    },
                     {
                         name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                             var buttons = "";
                             buttons += '<a href="#" title="拍照" onclick="Authentication_Photograph(' + options.rowId + ')" style="padding: 7px;line-height: 1em;">'
                              + '<i class="ace-icon fa fa-camera"></i> 拍照</a>';
                             return buttons;
                         }
                     }
            ],
            autowidth: true,
            rowNum: 999,
            altRows: true,
            //pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            //pginput: true,
            //rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerMain,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridMain.selector);
            }
        });
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
        var clearTable = function () {
            var tdList = $mdlCamera.find("[name='divEmployeeInfo']").find("td");

            for (var i = 0; i < tdList.length; i++) {
                var tdName = $(tdList[i]).attr("name");
                if (isNull(tdName)) {
                    continue;
                }
                $mdlCamera.find("[name='divEmployeeInfo']").find("td[name='" + tdName + "']").text("");
            }
        }
        $mdlCamera.on("hide.bs.modal", function () {
            clearPhoto();
            clearTable();
        })
        $mdlCamera.find("[name='btnSave']").on("click", function () {
            var postData = {};
            var dataUrl = $canvasPhotoResult[0].toDataURL("image/png");
            if (dataUrl && dataUrl.length > 1) {
                dataUrl = dataUrl.substr(dataUrl.indexOf(',') + 1);
            }
            postData.fileInBase64 = dataUrl;
            postData.employeeId = $mdlCamera.find("[name='EmployeeId']").val();
            $.ajax({
                url: "/" + controllerName + "/SaveEmployeePhoto",
                //data: { "userData": JSON.stringify(postData) },
                data: postData,
                type: "post",
                dataType: "json",
                async: true,
                success: function (jdata) {
                    if (jdata.IsSuccess == false) {
                        alert("保存实名认证登记照出错：" + jdata.ErrorMessage);
                        return false;
                    }
                    else {
                        alert("保存成功");
                        $("#btnAuthentication_Query").click();
                    }
                    $mdlCamera.modal("hide");
                }
            });
        });

    }



    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initButtonArea();
        initMainGrid();
        initCameraModal();
    })

})