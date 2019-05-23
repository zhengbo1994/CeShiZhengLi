
'use strict'
$(function () {

    var controllerName = "RP_EmployeeDataCheck";
    var $divQueryArea = $('#divRP_EmployeeDataCheck_QueryArea');
    var $gridMain = $("#gridRP_EmployeeDataCheck_main");
    var $pagerMain = $("#pagerRP_EmployeeDataCheck_main");


    var $mdlCheckInfo = $("#mdlRP_EmployeeDataCheck_CheckInfo");
    var $divCheckInfo = $("#divRP_EmployeeDataCheck_CheckInfo");

    var $mdlCamera = $("#mdlRP_EmployeeDataCheck_camera");
    var $divCamera = $("#divRP_EmployeeDataCheck_camera");
    var $canvasPhoto = $("#canvasRP_EmployeeDataCheck_Photo");
    var $canvasPhotoResult = $("#canvasRP_EmployeeDataCheck_PhotoResult");

    //var $mdlSingleCheckInfo = $("#mdlRP_EmployeeDataCheck_SingleCheckInfo");
    //var $divSingleCheckInfo = $("#divRP_EmployeeDataCheck_SingleCheckInfo");

    var initQueryArea = function () {
        var initQueryButton = function () {
            $("#btnRP_EmployeeDataCheck_Query").on("click", function () {
                var queryData = {};
                queryData = getJson($divQueryArea)
                $gridMain.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");
            })
        }
        var initQueryIndustry = function () {
            var $txtQueryIndustry = $divQueryArea.find("[name='Industry']");
            var getIndustryList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeIndustryList",
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
            var industryList = getIndustryList();

            var $optionAll = $("<option>");

            $optionAll.val("");

            $optionAll.text("全部");
            $txtQueryIndustry.append($optionAll);

            for (var i = 0; i < industryList.length ; i++) {
                var industryItem = industryList[i];
                var $option = $("<option>");
                $option.val(industryItem.ItemValue);
                $option.text(industryItem.ItemText);
                $txtQueryIndustry.append($option);
            }
        }
        var initQuerySubject = function () {
            var $txtQuerySubject = $divQueryArea.find("[name='ExamType']");
            var getSubjectList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetEmployeeSubjectList",
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
            var listSubject = getSubjectList();

            var $optionAll = $("<option>");

            $optionAll.val("");

            $optionAll.text("全部");
            $txtQuerySubject.append($optionAll);

            for (var i = 0; i < listSubject.length ; i++) {
                var Subject = listSubject[i];
                var $option = $("<option>");
                $option.val(Subject.ItemValue);
                $option.text(Subject.ItemText);
                $txtQuerySubject.append($option);
            }
        }

        initQueryIndustry();
        initQuerySubject();
        initQueryButton();
    }

    var initMainGrid = function () {
        var queryData = {};
        queryData = getJson($divQueryArea)
        $gridMain.jqGrid({
            url: "/" + controllerName + "/GetEmployeeListForJqgrid",
            datatype: "json",
            multiselect: true,
            multiboxonly: true,
            postData: queryData,
            colNames: ["Id", "姓名", "性别", "年龄", "身份证号", "职务", "技术职称", "行业", "证书类别", "原证书编号", "报考城市", "企业名称", "拍照", "审核状态", "审核日期", "操作"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "EmployeeName", index: "EmployeeName", align: "center", width: 80 },
                    { name: "Sex", index: "Sex", align: "center", width: 50 },
                    { name: "Age", index: "Age", align: "center", width: 50 },
                    { name: "IDNumber", index: "IDNumber", align: "center", width: 120 },
                    { name: "Job", index: "Job", align: "center", width: 80 },
                    { name: "Title4Technical", index: "Title4Technical", align: "center", width: 80 },
                    { name: "Industry", index: "Industry", align: "center", width: 80 },
                    { name: "ExamType", index: "ExamType", align: "center", width: 80 },
                    { name: "OldCertificateNo", index: "OldCertificateNo", align: "center", width: 120 },
                    { name: "City", index: "City", align: "center", width: 80 },
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 150 },
                    { name: "PhotoStatus", index: "PhotoStatus", align: "center", width: 80 },
                    { name: "CheckStatus", index: "TrainingStatus", align: "center", width: 80 },
                    { name: "CheckDate", index: "CheckDate", align: "center", width: 80 },
                    {
                        name: "操作", index: "操作", key: true, width: 150, align: "center", formatter: function (cellvalue, options, rowobj) {
                            var buttons = "";
                            buttons += '<a href="#" title="拍照" onclick="RP_EmployeeDataCheck_Photograph(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                             + '<i class=" fa fa-camera"></i> 拍照</a>'
                            + '<a href="#" title="延期审核" onclick="RP_EmployeeDataCheck_dataCheck(' + rowobj.Id + ')" style="padding: 7px;line-height: 1em;">'
                            + '<i class=" fa fa-check"></i> 延期审核</a>';
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
            $("#btnRP_EmployeeDataCheck_Check").on("click", function () {
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
        var loadPhoto = function (rpEmployeeId) {
            ajaxRequest({
                url: "/" + controllerName + "/GetRPEmployeePhoto",
                data: { rpEmployeeId: rpEmployeeId },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === true) {
                        debugger;
                        var img = new Image();
                        img.src = "data:image/png;base64," + jdata.ErrorMessage;
                        var newContext = $canvasPhotoResult[0].getContext("2d");
                        newContext.drawImage(img, 0, 0);
                    } else {
                        console.log("loadPhoto:" + jdata.ErrorMessage);
                    }
                }
            });
        }
        window.RP_EmployeeDataCheck_Photograph = function (rpEmployeeId) {
            $mdlCamera.find("[name='rpEmployeeId']").val(rpEmployeeId);
            initCamera();
            loadPhoto(rpEmployeeId);
            $mdlCamera.modal("show");
        }
        window.RP_EmployeeDataCheck_dataCheck = function (rpEmployeeId) {

            ajaxRequest({
                url: "/" + controllerName + "/GetCertificateDelayData",
                data: { rpEmployeeId: rpEmployeeId },
                type: "post",
                dataType: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === false) {
                        alert(jdata.ErrorMessage);
                        return false;
                    }
                    $divCheckInfo.find("tr[name='baseInfo']").removeClass("hidden");
                    resetForm($divCheckInfo);
                    jdata.rpEmployeeId = rpEmployeeId;
                    setJson($divCheckInfo, jdata);
                    $mdlCheckInfo.modal("show");
                }
            });

        }
        initCheckButton();

    }

    var initCheckModal_bak = function () {

        var defaultCheckedMark = "资料齐全,同意";

        var check = function (passStatus) {
            var formData = getJson($divCheckInfo);
            var postData = {};
            postData.PassStatus = passStatus;
            postData.inValidityDate = postData.inValidityDate;
            postData.annualSafetyTraining = postData.annualSafetyTraining;
            postData.notBadBehavior = postData.notBadBehavior;
            postData.trainingWith24Hours = postData.trainingWith24Hours;
            postData.delayConditions = postData.delayConditions;


            var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
            var employeeIdList = [];
            for (var i = 0; i < arrRowid.length; i++) {

                var employeeId = $gridMain.jqGrid("getRowData", arrRowid[i]).Id;
                employeeIdList.push(employeeId);
            }
            postData.rpEmployeeIdList = employeeIdList;
            ajaxRequest({
                url: "/" + controllerName + "/CheckEmployeeList",
                data: { strData: JSON.stringify(postData) },
                type: "post",
                datatype: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === true) {
                        alert("审核成功！")
                        $gridMain.jqGrid().trigger("reloadGrid");
                        $mdlCheckInfo.modal("hide");
                    } else {
                        alert(jdata.ErrorMessage);
                    }
                }
            });
        }

        var initCheckedPassButton = function () {
            $mdlCheckInfo.find("[name='btnCheckPass']").on("click", function () {
                check(true);
            });
        }

        var initCheckedNoPassButton = function () {
            $mdlCheckInfo.find("[name='btnCheckNoPass']").on("click", function () {
                var checedMark = $mdlCheckInfo.find("[name='CheckedMark']").val();
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

            $mdlCheckInfo.find("[name='CheckedMark']").val(defaultCheckedMark);
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
            postData.rpEmployeeId = $mdlCamera.find("[name='rpEmployeeId']").val();
            $.ajax({
                url: "/" + controllerName + "/SaveEmployeePhoto",
                //data: { "userData": JSON.stringify(postData) },
                data: postData,
                type: "post",
                dataType: "json",
                async: true,
                success: function (jdata) {
                    if (jdata.IsSuccess == false) {
                        alert("保存继续教育登记照出错：" + jdata.ErrorMessage);
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
            postData.delayConditions = formData.delayConditions;

            var rpEmployeeIdList = [];

            if (isNull(formData.rpEmployeeId)) {//如果form 上没有人员Id 则认为是多选
                var arrRowid = $gridMain.jqGrid("getGridParam", "selarrrow");
                for (var i = 0; i < arrRowid.length; i++) {
                    var employeeId = $gridMain.jqGrid("getRowData", arrRowid[i]).Id;
                    rpEmployeeIdList.push(employeeId);
                }
            }
            else {
                rpEmployeeIdList.push(formData.rpEmployeeId);
            }
            postData.rpEmployeeIdList = rpEmployeeIdList;
            ajaxRequest({
                url: "/" + controllerName + "/CheckEmployeeList",
                data: { strData: JSON.stringify(postData) },
                type: "post",
                datatype: "json",
                async: true,
                cache: false,
                success: function (jdata) {
                    if (jdata.IsSuccess === true) {
                        alert("审核成功！")
                        $gridMain.jqGrid().trigger("reloadGrid");
                        $mdlCheckInfo.modal("hide");
                    } else {
                        alert(jdata.ErrorMessage);
                    }
                }
            });
        }

        var initCheckedPassButton = function () {
            $mdlCheckInfo.find("[name='btnCheckPass']").on("click", function () {
                var delayConditions = $divCheckInfo.find("[name='delayConditions'][value='True']").prop("checked");
                if (delayConditions === false) {
                    alert("不符合延期条件不能审核通过");
                    return false;
                }
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
            $mdlCheckInfo.find("[name='checkedMark']").val(defaultCheckedMark);
        });
        initCheckDelayConditions();
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
