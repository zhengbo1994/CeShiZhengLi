$(function () {
    'use strict'

    var initCamera = function () {

        var initJQWebCam = function () {
            var $canvas = $("#pic");
            var $canvasCut = $("#picCut");
            var $imgCut = $("#imgCut");
            var ctx = $canvas[0].getContext("2d");
            var ctxCut = $canvasCut[0].getContext("2d");
            var pos = 0, saveCB, image = [];
            var picWH = { width: 320, height: 240 }; var cutPicWH = { width: 220, height: 240 };
            image = ctx.getImageData(0, 0, picWH.width, picWH.height);

            var canvas = $canvas[0];
            canvas.setAttribute('width', picWH.width);
            canvas.setAttribute('height', picWH.height);
            $canvasCut[0].setAttribute('width', cutPicWH.width);
            $canvasCut[0].setAttribute('height', cutPicWH.height);

            var savePicToCanvas = function (data) {
                var col = data.split(";");
                for (var i = 0; i < picWH.width; i++) {
                    var tmp = parseInt(col[i]);
                    image.data[pos + 0] = (tmp >> 16) & 0xff;
                    image.data[pos + 1] = (tmp >> 8) & 0xff;
                    image.data[pos + 2] = tmp & 0xff;
                    image.data[pos + 3] = 0xff;
                    pos += 4;
                }
            };

            var getCutImgBase64 = function () {
                var top = (picWH.width - cutPicWH.width) / 2, left = (picWH.height - cutPicWH.height) / 2;
                var imgData = ctx.getImageData(top, left, cutPicWH.width, cutPicWH.height);

                ctxCut.putImageData(imgData, 0, 0);
                var result = $canvasCut[0].toDataURL("image/png");
                $imgCut.attr("src", result);
                return result;
            };

            var uploadImage = function () {
                //var dataUrl = $canvas[0].toDataURL("image/png");    //.replace("data:image/png;base64,", "")
                var dataUrl = getCutImgBase64();
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
                console.log(JSON.stringify(postData));
                //$.ajax({
                //    url: "/PersonalAttachments/SaveEmployeeExamPhoto",
                //    //data: { "imgBase64": dataUrl },
                //    data: { "userData": JSON.stringify(postData) },
                //    type: "post",
                //    datatype: "json",
                //    async: false,
                //    success: function () { }
                //});
            };

            if (canvas.toDataURL) {
                //每次拍照saveCB会重复执行很多次
                saveCB = function (data) {
                    savePicToCanvas(data);

                    if (pos >= 4 * picWH.width * picWH.height) {
                        ctx.putImageData(image, 0, 0);
                        pos = 0;
                        image = ctx.getImageData(0, 0, picWH.width, picWH.height);
                        uploadImage();
                    }
                };

            }
            else {

                saveCB = function (data) {
                    //image.push(data);

                    pos += 4 * 320;

                    if (pos >= 4 * 320 * 240) {
                        pos = 0; image = [];

                        //uploadImage();
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

        $("#btnTakePhoto").on("click", function () {
            window.webcam.capture();
        });
    };
    initCamera();
});