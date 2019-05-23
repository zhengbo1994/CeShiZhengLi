'use strict'
$(function () {
    var controllerName = "StartExam";
    var $divStartExam_Info = $("#divStartExam_Info");
    var $divStartExam_NoInfo = $("#divStartExam_NoInfo");
    var $mdlStartExam_ExamResult = $("#mdlStartExam_ExamResult");
    var photoFileType = "考前照片";
    var AExamName = "安全知识考试";
    var BExamName = "管理能力考试";
    //当前时间
    var CurrentDateTime = new Date();

    var keepCurrentDateTime = function () {
        var setTimeOutResult;
        ajaxRequest({
            url: "/" + controllerName + "/GetCurrentDateTime",
            date: { "dateStr": new Date().toDateString() },
            type: "post",
            dataType: "json",
            async: false,
            success: function (jdata) {
                if (jdata.IsSuccess == false) {
                    //请求当前时间出错  说明已经登录超时 或者页面出错
                    alert(jdata.ErrorMessage);
                    var url = "/login";
                    locationHref(url);
                }
                else {
                    var datetimeStr = jdata.replace(/-/g, "/");
                    CurrentDateTime = new Date(datetimeStr);
                    setTimeOutResult = setTimeout(function () {
                        addSecond();
                    }, 1000);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                throw new Error(10, "获取考试信息失败\r\n" + textStatus);
            }
        });
        var addSecond = function () {
            CurrentDateTime.addSeconds(1);
            setTimeOutResult = setTimeout(function () {
                addSecond();
            }, 1000);
            var currentDateTimeStr = CurrentDateTime.toFormatString("yyyy-MM-dd HH:mm:ss");
            $divStartExam_Info.find("td[name='CurrentDateTime']").text(currentDateTimeStr);

        }
        //每5分钟同步一次服务器时间
        setTimeout(function () {
            //清楚每秒+1的 settimeout
            clearTimeout(setTimeOutResult);
            keepCurrentDateTime();
        }, 5 * 60 * 1000)
    }

    var getExamInfo = function () {
        var examData = {};
        var AjaxOpt = {
            url: "/" + controllerName + "/GetExamInfo",
            data: { "dateStr": new Date().toString() },
            type: "post",
            dataType: "json",
            async: false,
            success: function (jdata) {
                if (jdata.resultMessage.IsSuccess) {
                    examData = jdata;
                }
                else {
                    //alert(jdata.resultMessage.ErrorMessage);
                    examData = null;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                throw new Error(10, "获取考试信息失败\r\n" + textStatus)
            }
        };
        ajaxRequest(AjaxOpt);
        return examData;
    };

    var initExamInfo = function () {
        var examData = getExamInfo();
        if (!examData) {
            //暂无考试
            $divStartExam_Info.addClass("hidden");
            $divStartExam_NoInfo.removeClass("hidden");
            return false;
        }
        $divStartExam_Info.removeClass("hidden");
        $divStartExam_NoInfo.addClass("hidden");

        $divStartExam_Info.find("td[name='EmployeeName']").text(examData.EmployeeName);
        $divStartExam_Info.find("td[name='ExamRegistrationNumber']").text(examData.ExamRegistrationNumber);
        $divStartExam_Info.find("td[name='IDNumber']").text(examData.IDNumber);
        $divStartExam_Info.find("td[name='ExamType']").text(examData.ExamType);
        $divStartExam_Info.find("td[name='Sex']").text(examData.Sex);
        var examTimeMsg = examData.AExamDateTimeBegin + " - " + examData.AExamDateTimeEnd + " " + AExamName + "<br/>"
                          + examData.BExamDateTimeBegin + " - " + examData.BExamDateTimeEnd + " " + BExamName;
        $divStartExam_Info.find("td[name='ExamTime']").html(examTimeMsg);
        $divStartExam_Info.find("td[name='ExamRoomName']").text(examData.ExamRoomName);
        $divStartExam_Info.find("td[name='EnterpriseName']").text(examData.EnterpriseName);
        $divStartExam_Info.find("td[name='ExamAddress']").text(examData.TrainingInstitutionName + "(" + examData.TrainingInstitutionAddress + ")");
        //赋值到页面 隐藏控件
        $divStartExam_Info.find("[id='ExamDateTimeBegin']").val(examData.ExamDateTimeBegin);
        $divStartExam_Info.find("[id='AExamDateTimeBegin']").val(examData.AExamDateTimeBegin);
        $divStartExam_Info.find("[id='AExamDateTimeEnd']").val(examData.AExamDateTimeEnd);
        $divStartExam_Info.find("[id='BExamDateTimeBegin']").val(examData.BExamDateTimeBegin);
        $divStartExam_Info.find("[id='BExamDateTimeEnd']").val(examData.BExamDateTimeEnd);
        $divStartExam_Info.find("[id='examCoreExamId']").val(examData.ExamCoreExamId);
        return true;
    };

    var initTimer = function () {
        var getDateTimeSpanString = function (timespan) {
            //计算出相差天数
            var days = Math.floor(timespan / (24 * 3600 * 1000))
            //计算出小时数
            var leave1 = timespan % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000)
            var timeSpanString = (days == 0 ? "" : days + "天") + (hours == 0 ? "" : hours + "小时") + (minutes == 0 ? "" : minutes + "分") + (seconds == 0 ? "" : seconds + "秒")
            return timeSpanString;
        }
        var intervalId = setInterval(function () {
            var startSafetyKnowledgeExamButtonEnable = false;
            var startManagementAbilityExamEnable = false;
            var examDateTimeBegin = $("#ExamDateTimeBegin").val().replace(/-/g, "/");
            examDateTimeBegin = examDateTimeBegin;
            //安全知识考试开始时间
            var aExamDateTimeBegin = $("#AExamDateTimeBegin").val().replace(/-/g, "/");
            aExamDateTimeBegin = new Date(aExamDateTimeBegin);
            //安全知识考试结束时间
            var aExamDateTimeEnd = $("#AExamDateTimeEnd").val().replace(/-/g, "/");
            aExamDateTimeEnd = new Date(aExamDateTimeEnd);
            //管理能力考试开始时间
            var bExamDateTimeBegin = $("#BExamDateTimeBegin").val().replace(/-/g, "/");
            bExamDateTimeBegin = new Date(bExamDateTimeBegin);
            //管理能力考试结束时间
            var bExamDateTimeEnd = $("#BExamDateTimeEnd").val().replace(/-/g, "/");
            bExamDateTimeEnd = new Date(bExamDateTimeEnd);

            var timeSectionA = $divStartExam_Info.find("[name='ACountdown']");
            var timeSectionB = $divStartExam_Info.find("[name='BCountdown']");
            var currentDatetime = CurrentDateTime;

            var showMessageA = "";
            var showMessageB = "";
            //计算当前正在进行的考试
            if (currentDatetime < aExamDateTimeBegin) {
                //在安全知识考试开始之前
                var timeSpanString = getDateTimeSpanString(aExamDateTimeBegin - currentDatetime);
                showMessageA = "距离【安全知识考试】开始时间:" + timeSpanString;
            }
            else if (aExamDateTimeBegin < currentDatetime && currentDatetime <= aExamDateTimeEnd) {
                startSafetyKnowledgeExamButtonEnable = true;
                var timeSpanString = getDateTimeSpanString(aExamDateTimeEnd - currentDatetime);
                showMessageA = "当前正在进行【安全知识考试】,距离结束时间：" + timeSpanString;
            }


            if (aExamDateTimeBegin < currentDatetime && currentDatetime <= bExamDateTimeBegin) {
                var timeSpanString = getDateTimeSpanString(bExamDateTimeBegin - currentDatetime);
                showMessageB = "距离【管理能力考试】开始时间：" + timeSpanString;
            }
            else if (bExamDateTimeBegin < currentDatetime && currentDatetime <= bExamDateTimeEnd) {
                startManagementAbilityExamEnable = true;
                var timeSpanString = getDateTimeSpanString(bExamDateTimeEnd - currentDatetime);
                showMessageB = "当前正在进行【管理能力考试】,距离结束时间：" + timeSpanString;
            }
            timeSectionA.text(showMessageA);
            timeSectionB.text(showMessageB);
            if (startSafetyKnowledgeExamButtonEnable) {
                $("#btnStartSafetyKnowledgeExam").removeClass("disabled");
            }
            else {
                $("#btnStartSafetyKnowledgeExam").addClass("disabled");
            }
            if (startManagementAbilityExamEnable) {
                $("#btnStartManagementAbilityExam").removeClass("disabled");
            }
            else {
                $("#btnStartManagementAbilityExam").addClass("disabled");
            }
        }, 1000);
    };

    var initButton = function () {
        $("#btnPrintAdmissionticket").on("click", function () {
            var newWin = window.open("", "_blank");
            newWin.location.href = "/PrintAdmissionticket/ShowAdmissionticket";
        });
        $("#btnDownloadAdmissionticket").on("click", function () {
            $("#btnDownloadAdmissionticket").prop("disabled", true);
            //var newWin = window.open("", "_blank");
            setTimeout(function () {
                $("#btnDownloadAdmissionticket").prop("disabled", false);
            }, 2000);
            window.location.href = "/PrintAdmissionticket/DownloadAdmissionticket";
        });
        var getExamTakerInfo = function (paperType) {
            var examTakerInfo = {};
            var examCoreExamId = $("#examCoreExamId").val();
            var AjaxOpt = {
                url: "/" + controllerName + "/GetExamTakerInfo",
                data: { "examCoreExamId": examCoreExamId, "paperType": paperType, "dateStr": new Date().toDateString() },
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    examTakerInfo = jdata;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    throw new Error("获取考生信息失败\r\n" + textStatus);
                }
            };
            ajaxRequest(AjaxOpt);
            return examTakerInfo;
        };
        var RegisterExamTaker = function (examTakerInfo) {
            var resultSuccess = false;
            var postData = {};
            postData.examId = examTakerInfo.examCoreExamId;
            postData.examTakerName = examTakerInfo.examTakerName;
            postData.idNumber = examTakerInfo.idNumber;
            postData.paperId = examTakerInfo.paperId;

            var ajaxOpt = {
                url: examTakerInfo.registerExamTakerUrl,
                data: { "apipara": JSON.stringify(postData) },
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        resultSuccess = true;
                    }
                    else {
                        alert("考生信息注册不成功\r\n" + jdata.ErrorMessage);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    throw new Error("考生信息注册失败\r\n" + textStatus);
                }
            };
            ajaxRequest(ajaxOpt);
            return resultSuccess;
        };

        //开始考试
        var initStartExamBak = function () {
            //判断url后面有参数时 是考试过程中
            var lastCoreExamId = getQueryString("examid");
            var lastIdNumber = getQueryString("idnumber");
            var lastPaperId = getQueryString("paperid");
            if (lastCoreExamId && lastPaperId && lastIdNumber) {
                //考试过程中拍照
                try {
                    photoFileType = "考中照片";
                    window.webcam.capture();
                }
                catch (ex) {
                    console.log("调用" + photoFileType + "拍照出错");
                }
            }
            var gotoExam = function (examTakerInfo) {
                try {
                    //没有到下一场考试 不跳转
                    var examDateTimeBegin = examTakerInfo.examDateTimeBegin;
                    examDateTimeBegin = examDateTimeBegin.replace(/-/g, "/");
                    var startDate = new Date(examDateTimeBegin)
                    var dateNow = CurrentDateTime;
                    var dateSpan = startDate - dateNow;
                    if (dateSpan > 0) {
                        $("#btnStartExam").addClass("disabled");
                        return false;
                    }
                    if (examTakerInfo.paperId == 0) {
                        //if (confirm("已经完成考试,是否查看考试成绩?")) {
                        //    $("#btnViewExamResult").click();
                        //}
                        try {
                            photoFileType = "考后照片";
                            window.webcam.capture();
                        }
                        catch (ex) {
                            console.log("调用" + photoFileType + "出错");
                        }
                        alert("已经完成考试!");
                        return false;
                    }

                    var resultSuccess = RegisterExamTaker(examTakerInfo);
                    if (resultSuccess) {
                        var startExamUrl = examTakerInfo.startExamUrl;
                        startExamUrl = startExamUrl.replace("{0}", examTakerInfo.examCoreExamId).replace("{1}", encodeURIComponent(examTakerInfo.examTakerName)).replace("{2}", examTakerInfo.idNumber).replace("{3}", examTakerInfo.paperId);
                        locationHref(startExamUrl);
                    }
                }
                catch (ex) {
                    alert(ex.message);
                }
            }

            $("#btnStartExam").on("click", function () {
                var disabledClass = $(this).hasClass("disabled");
                if (disabledClass) {
                    return false;
                }
                $(this).addClass("disabled");
                console.log("开始考试");
                var examTakerInfo = getExamTakerInfo();
                if (examTakerInfo.resultMessage.IsSuccess == false) {
                    alert(examTakerInfo.resultMessage.ErrorMessage);
                    $(this).removeClass("disabled");
                    return false;
                }
                //隐藏控件的值 供上传拍照图面用
                $("#examId").val(examTakerInfo.examId);
                $("#paperId").val(examTakerInfo.paperId);
                $("#idNumber").val(examTakerInfo.idNumber);

                try {

                    photoFileType = "考前照片";
                    window.webcam.capture();
                }
                catch (ex) {
                    console.log("调用" + photoFileType + "出错");
                }

                setTimeout(function () {
                    gotoExam(examTakerInfo);
                    $(this).removeClass("disabled");
                }, 1000);

            });
        };

        var initStartExam = function () {
            //判断url后面有参数时 是考试过程中
            var lastCoreExamId = getQueryString("examid");
            var lastIdNumber = getQueryString("idnumber");
            var lastPaperId = getQueryString("paperid");
            if (lastCoreExamId && lastPaperId && lastIdNumber) {
                //考试过程中拍照
                try {
                    photoFileType = "考中照片";
                    window.webcam.capture();
                }
                catch (ex) {
                    console.log("调用" + photoFileType + "拍照出错");
                }
            }
            var gotoExam = function (examTakerInfo) {
                try {
                    //没有到下一场考试 不跳转
                    //var examDateTimeBegin = examTakerInfo.examDateTimeBegin;
                    //examDateTimeBegin = examDateTimeBegin.replace(/-/g, "/");
                    //var startDate = new Date(examDateTimeBegin)
                    //var dateNow = CurrentDateTime;
                    //var dateSpan = startDate - dateNow;
                    //if (dateSpan > 0) {
                    //    $("#btnStartExam").addClass("disabled");
                    //    return false;
                    //}
                    if (examTakerInfo.paperId == 0) {
                        //if (confirm("已经完成考试,是否查看考试成绩?")) {
                        //    $("#btnViewExamResult").click();
                        //}
                        try {
                            photoFileType = "考后照片";
                            window.webcam.capture();
                        }
                        catch (ex) {
                            console.log("调用" + photoFileType + "出错");
                        }
                        alert("已经完成考试!");
                        return false;
                    }

                    var resultSuccess = RegisterExamTaker(examTakerInfo);
                    if (resultSuccess) {
                        var startExamUrl = examTakerInfo.startExamUrl;
                        startExamUrl = startExamUrl.replace("{0}", examTakerInfo.examCoreExamId).replace("{1}", encodeURIComponent(examTakerInfo.examTakerName)).replace("{2}", examTakerInfo.idNumber).replace("{3}", examTakerInfo.paperId);
                        locationHref(startExamUrl);
                    }
                }
                catch (ex) {
                    alert(ex.message);
                }
            }

            var startExam = function (paperType) {
                var disabledClass = $(this).hasClass("disabled");
                if (disabledClass) {
                    return false;
                }
                $(this).addClass("disabled");
                console.log("开始考试");
                var examTakerInfo = getExamTakerInfo(paperType);
                if (examTakerInfo.resultMessage.IsSuccess == false) {
                    alert(examTakerInfo.resultMessage.ErrorMessage);
                    $(this).removeClass("disabled");
                    return false;
                }
                //隐藏控件的值 供上传拍照图面用
                $("#examId").val(examTakerInfo.examId);
                $("#paperId").val(examTakerInfo.paperId);
                $("#idNumber").val(examTakerInfo.idNumber);
                try {
                    photoFileType = "考前照片";
                    window.webcam.capture();
                }
                catch (ex) {
                    console.log("调用" + photoFileType + "出错");
                }
                setTimeout(function () {
                    gotoExam(examTakerInfo);
                    $(this).removeClass("disabled");
                }, 1000);
            };

            $("#btnStartSafetyKnowledgeExam").on("click", function () {
                var paperType = "SafetyKnowledgeExam";
                startExam(paperType);
            });

            $("#btnStartManagementAbilityExam").on("click", function () {
                var paperType = "ManagementAbilityExam";
                startExam(paperType);
            });
        };
        //查看考试成绩
        var initViewExamResult = function () {
            var getExamResult = function () {
                var examResult = {};
                var examCoreExamId = $("#examCoreExamId").val();
                var ajaxOpt = {
                    url: "/" + controllerName + "/GetExamResult",
                    data: { "examCoreExamId": examCoreExamId, "dateStr": new Date().toDateString() },
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (jdata) {
                        if (jdata.resultMessage.IsSuccess) {
                            examResult = jdata;
                        }
                        else {
                            examResult = null;
                            throw new Error("获取考试结果不成功\r\n" + jdata.resultMessage.ErrorMessage);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        examResult = null;
                        throw new Error("获取考试结果失败\r\n" + textStatus);
                    }
                };
                ajaxRequest(ajaxOpt);
                return examResult;
            }
            $("#btnViewExamResult").on("click", function () {
                $mdlStartExam_ExamResult.find("[name='divSafetyKnowledgeExamScore']").addClass("hidden");
                $mdlStartExam_ExamResult.find("[name='divManagementAbilityExamScore']").addClass("hidden");
                $mdlStartExam_ExamResult.find("[name='divFieldExamResult']").addClass("hidden");

                var examResult = getExamResult();
                if (!examResult) {
                    return false;
                }
                var safetyKnowledgeExamScore = examResult.SafetyKnowledgeExamScore;
                var managementAbilityExamScore = examResult.ManagementAbilityExamScore;
                var fieldExamResult = examResult.FieldExamResult;

                if (safetyKnowledgeExamScore) {
                    $mdlStartExam_ExamResult.find("[name='divSafetyKnowledgeExamScore']").removeClass("hidden");
                    $mdlStartExam_ExamResult.find("[name='spanSafetyKnowledgeExamScore']").text(safetyKnowledgeExamScore);
                }
                if (managementAbilityExamScore) {
                    $mdlStartExam_ExamResult.find("[name='divManagementAbilityExamScore']").removeClass("hidden");
                    $mdlStartExam_ExamResult.find("[name='spanManagementAbilityExamScore']").text(managementAbilityExamScore);
                }
                if (fieldExamResult) {
                    $mdlStartExam_ExamResult.find("[name='divFieldExamResult']").removeClass("hidden");
                    $mdlStartExam_ExamResult.find("[name='spanFieldExamResult']").text(fieldExamResult);
                }

                $mdlStartExam_ExamResult.modal("toggle");
            });
        };

        initStartExam();
        // initViewExamResult();
    };

    //根据url后面的参数  确定下一步执行的动作
    var initExam = function () {
        var examId = getQueryString("examid");
        var idNumber = getQueryString("idnumber");
        var paperId = getQueryString("paperid");
        if (examId && idNumber && paperId)//全部参数不为空时 直接执行开始考试按钮功能
        {
            $("#examCoreExamId").val(examId);
            $("#btnStartExam").removeClass("disabled");
            $("#btnStartExam").click();

        }
    }

    var initCamera = function () {
        var $canvas = $("#pic");
        var ctx = $canvas[0].getContext("2d");

        var initJQWebCam = function () {
            var pos = 0, ctx = null, saveCB, image = [];

            var canvas = $canvas[0];
            canvas.setAttribute('width', 320);
            canvas.setAttribute('height', 240);

            var uploadImage = function () {

                var dataUrl = $canvas[0].toDataURL("image/png");    //.replace("data:image/png;base64,", "")
                if (dataUrl && dataUrl.length > 1) {
                    dataUrl = dataUrl.substr(dataUrl.indexOf(',') + 1);
                }
                var lastExamId = $.trim($("#examId").val());
                var lastPaperId = $.trim($("#paperId").val());
                var lastIdNumber = $.trim($("#idNumber").val());
                var postData = {};
                postData.IdNumber = lastIdNumber;
                postData.ExamId = lastExamId;
                postData.PaperId = lastPaperId;
                postData.FileType = photoFileType;
                postData.FileInBase64 = dataUrl;

                $.ajax({
                    url: "/PersonalAttachments/SaveEmployeeExamPhoto",
                    //data: { "imgBase64": dataUrl },
                    data: { "userData": JSON.stringify(postData) },
                    type: "post",
                    datatype: "json",
                    async: false,
                    success: function () { }
                });
            };

            if (canvas.toDataURL) {

                ctx = canvas.getContext("2d");

                image = ctx.getImageData(0, 0, 320, 240);

                saveCB = function (data) {

                    var col = data.split(";");
                    var img = image;
                    for (var i = 0; i < 320; i++) {
                        var tmp = parseInt(col[i]);
                        img.data[pos + 0] = (tmp >> 16) & 0xff;
                        img.data[pos + 1] = (tmp >> 8) & 0xff;
                        img.data[pos + 2] = tmp & 0xff;
                        img.data[pos + 3] = 0xff;
                        pos += 4;
                    }

                    if (pos >= 4 * 320 * 240) {
                        ctx.putImageData(img, 0, 0);

                        pos = 0;

                        uploadImage();
                    }
                };

            } else {

                saveCB = function (data) {
                    image.push(data);

                    pos += 4 * 320;

                    if (pos >= 4 * 320 * 240) {
                        pos = 0;

                        uploadImage();
                    }
                };
            }
            $("#camera").webcam({
                width: 320,
                height: 240,
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
    //页面加载时运行
    $(document).ready(function () {
        if (initExamInfo() == false) {
            return;
        }
        keepCurrentDateTime();
        initButton();
        //initExam();
        initExamInfo();
        initTimer();
        initCamera();

    });

})
