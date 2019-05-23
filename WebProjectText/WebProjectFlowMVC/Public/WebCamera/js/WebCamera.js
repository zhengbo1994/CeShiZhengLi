/*
* 石博
* 20160826
* V1.0.20160826.1
* 调用摄像头并拍照，暂支持Chrome，Firefox
*/
var WebCamera = function (config) {
    var base = {};
    config = config || {};
    var defaultConfig = {
        onTakePhoto: function (imgBase64) { }
    };
    base.config = {};
    for (var p in defaultConfig) {
        if (undefined != config[p]) {
            base.config[p] = config[p];
        } else {
            base.config[p] = defaultConfig[p];
        }
    }
    base.$video = $('<video autoplay="" style="width:1280px;height:720px;background-color:black;display:none;"></video>');
    $('body').append(base.$video);
    base.video = base.$video[0];

    base.$canvas = $('<canvas width="640" height="480" style="display:none;"></canvas>');
    $('body').append(base.$canvas);
    base.canvas = base.$canvas[0];
    base.context = base.canvas.getContext("2d");

    var cameraStream;
    base.errorCallback = function () {
        console.log('sth wrong!');
    };
    base.successCallback = function (stream) {
        cameraStream = stream;
        base.video.src = stream;
        base.video.play();
    };

    //调用客户端摄像头设备
    base.openCamera = function () {
        if (navigator.getUserMedia) { // 标准的API
            navigator.getUserMedia({ "video": true }, base.successCallback, base.errorCallback);
        } else if (navigator.webkitGetUserMedia) { // WebKit 核心的API
            navigator.webkitGetUserMedia({ "video": true }, function (stream) {
                base.successCallback(window.URL.createObjectURL(stream));
            }, base.errorCallback);
        } else if (navigator.mozGetUserMedia) { // firefox 核心的API
            navigator.mozGetUserMedia({ "video": true }, function (stream) {
                base.successCallback(window.URL.createObjectURL(stream));
            }, base.errorCallback);
        } else if (navigator.msGetUserMedia) { // IE 核心的API
            navigator.msGetUserMedia({ "video": true }, function (stream) {
                base.successCallback(window.URL.createObjectURL(stream));
            }, base.errorCallback);
        }
    };

    //降低图片质量
    var lowerImageQuality = function (ctx) {
        var data = ctx.getImageData(0, 0, $(ctx.canvas).width(), $(ctx.canvas).height());
        var dataOfPixel = 4;//每像素有四个数据（R,G,B,A）
        var mixPixelCount = 3;
        for (var i = 0; i < data.data.length; i += mixPixelCount * dataOfPixel) {
            data.data[i + dataOfPixel - 1] = 255;
            for (var k = 1; k < mixPixelCount; k++) {
                for (var m = 0; m < dataOfPixel - 1; m++) {
                    data.data[i + k * dataOfPixel + m] = data.data[i + m];
                }
            }
        }
        ctx.putImageData(data, 0, 0);
    };

    base.takePhoto = function (afterTakePhotoFunc) {
        var picMaxWH = {
            width: base.$canvas.width(),
            height: base.$canvas.height()
        };

        var videoMediaWH = {
            width: base.video.videoWidth,
            height: base.video.videoHeight
        };

        var picWH = {
            width: 0,
            height: 0
        };

        //等比缩放
        picWH.width = picMaxWH.width;
        picWH.height = picWH.width * (videoMediaWH.height * 1.0 / videoMediaWH.width);
        if (picWH.height > picMaxWH.height) {
            picWH.height = picMaxWH.height;
            picWH.width = picWH.height * (videoMediaWH.width * 1.0 / videoMediaWH.height);
        }

        base.$canvas.attr("width", picWH.width).attr("height", picWH.height);

        base.context.clearRect(0, 0, picWH.width, picWH.height);
        base.context.drawImage(base.video, 0, 0, videoMediaWH.width, videoMediaWH.height, 0, 0, picWH.width, picWH.height);
        lowerImageQuality(base.context);

        var dataUrl = base.canvas.toDataURL("image/png");    //.replace("data:image/png;base64,", "")
        if (dataUrl && dataUrl.length > 1) {
            dataUrl = dataUrl.substr(dataUrl.indexOf(',') + 1);
        }

        if (afterTakePhotoFunc && "function" == typeof (afterTakePhotoFunc)) {
            afterTakePhotoFunc();
        } else {
            base.config.onTakePhoto(dataUrl);
        }

        return dataUrl;
    };

    base.closeCamera = function () {
        if (cameraStream && null != cameraStream) {
            cameraStream.close();
            cameraStream = null;
        }
    };

    base.dispose = function () {
        base.closeCamera();
        base.$canvas.remove();
        base.$video.remove();
    };

    return base;
};