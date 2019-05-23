
'use strict'
$(function () {
    var controllerName = "Camerview";
    // 获取通道
    var getChannelInfo = function (szIP) {
        if ("" == szIP) {
            return;
        }
        var cameraChannelList = [];
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("VideoInputChannel");

                $.each(oChannels, function (i) {
                    var id = $(this).find("id").eq(0).text(),
                        name = $(this).find("name").eq(0).text();
                    if ("" == name) {
                        name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                    }
                    var channel = { id: id, name: name };
                    cameraChannelList.push(channel);
                    // oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
                });
                console.log(szIP + " 获取模拟通道成功！");
            },
            error: function () {
                console.log(szIP + " 获取模拟通道失败！");
            }
        });
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

                $.each(oChannels, function (i) {
                    var id = $(this).find("id").eq(0).text(),
                        name = $(this).find("name").eq(0).text(),
                        online = $(this).find("online").eq(0).text();
                    if ("false" == online) {// 过滤禁用的数字通道
                        return true;
                    }
                    if ("" == name) {
                        name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                    }
                    var channel = { id: id, name: name };
                    cameraChannelList.push(channel);
                    //oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
                });
                console.log(szIP + " 获取数字通道成功！");
            },
            error: function () {
                console.log(szIP + " 获取数字通道失败！");
            }
        });
        // 零通道
        WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("ZeroVideoChannel");

                $.each(oChannels, function (i) {
                    var id = $(this).find("id").eq(0).text(),
                        name = $(this).find("name").eq(0).text();
                    if ("" == name) {
                        name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
                    }
                    if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
                        //oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
                        var channel = { id: id, name: name };
                        cameraChannelList.push(channel);
                    }
                });
                console.log(szIP + " 获取零通道成功！");
            },
            error: function () {
                console.log(szIP + " 获取零通道失败！");
            }
        });

        return cameraChannelList;
    }
    // 开始预览
    function clickStartRealPlay(szIP, g_iWndIndex, iChannelID) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            iStreamType = 2,
            bZeroChannel = false,
            szInfo = "";

        if ("" == szIP) {
            return;
        }

        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop();
        }

        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iWndIndex: g_iWndIndex,
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        });

        if (0 == iRet) {
            szInfo = "开始预览成功！";
        } else {
            szInfo = "开始预览失败！";
        }

        console.log(szIP + "_" + iChannelID + "_" + szInfo);
    }

    var login = function (nvrInfo) {

        //var loginOption = {
        //    iProtocol: 1,			// protocol 1：http, 2:https
        //    szIP: "192.168.1.91",	// protocol ip
        //    szPort: "80",			// protocol port
        //    szUsername: "admin",	// device username
        //    szPassword: "whfstKF*#!",	// device password
        //};
        var loginOption = {
            iProtocol: nvrInfo.Protocol,			// protocol 1：http, 2:https
            szIP: nvrInfo.IPAddress,	// protocol ip
            szPort: nvrInfo.Port,			// protocol port
            szUsername: nvrInfo.Username,	// device username
            szPassword: nvrInfo.Password,	// device password
        };
        var iRet = WebVideoCtrl.I_Login(loginOption.szIP, loginOption.iProtocol, loginOption.szPort, loginOption.szUsername, loginOption.szPassword, {
            success: function (xmlDoc) {
                console.log(loginOption.szIP + " 登录成功！");
                setTimeout(function () {
                    var channelList = getChannelInfo(loginOption.szIP);
                    debugger;
                    if (channelList.length < 2) {
                        WebVideoCtrl.I_ChangeWndNum(1);
                    }
                    else if (channelList.length > 1 && channelList.length < 5) {
                        WebVideoCtrl.I_ChangeWndNum(2);
                    }
                    else if (channelList.length > 4 && channelList.length < 10) {
                        WebVideoCtrl.I_ChangeWndNum(3);
                    }
                    else if (channelList.length > 9) {
                        WebVideoCtrl.I_ChangeWndNum(4);
                    }
                    for (var i = 0; i < channelList.length; i++) {
                        clickStartRealPlay(loginOption.szIP, i, channelList[i].id);
                    }

                }, 10);
            },
            error: function () {
                console.log(loginOption.szIP + " 登录失败！");
            }
        });

        if (-1 == iRet) {
            console.log(loginOption.szIP + " 已登录过！");
        }
    }

    var checkPlug = function () {
        var plugCompleteFlag = false;
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (-2 == iRet) {
            alert("您的Chrome浏览器版本过高，可能不支持NPAPI插件！");
            plugCompleteFlag = true;
        }
        else if (-1 == iRet) {
            alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        }
        else {
            plugCompleteFlag = true;
        }

        // 初始化插件参数及插入插件
        if (plugCompleteFlag) {
            var $container = $("#videoParentContainer");
            var videoWidth = $container.width();
            var videoHeight = videoWidth / 16 * 10;
            WebVideoCtrl.I_InitPlugin(videoWidth, videoHeight, {
                bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iWndowType: 1,
                cbSelWnd: function (xmlDoc) {
                    var g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
                    var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                    console.log(szInfo);
                }
            });
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
        }
        return plugCompleteFlag;
        // 检查插件是否最新
        //if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
        //    alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
        //    return;
        //}
    }

    var getExamRoomNVRInfo = function () {

        var examRoomId = getQueryString("examRoomId");
        var examRoomNVRInfo = {};
        var ajaxOpt = {
            url: "/" + controllerName + "/GetExamRoomNVRInfo",
            data: { "examRoomId": examRoomId },
            type: "post",
            dataType: "json",
            async: false,
            cache: false,
            success: function (jdata) {
                if (jdata.resultMessage.IsSuccess) {
                    examRoomNVRInfo = jdata;
                }
                else {
                    alert(jdata.resultMessage.ErrorMessage);
                    examRoomNVRInfo = null;
                }

            }

        };
        ajaxRequest(ajaxOpt);
        return examRoomNVRInfo;
    }
    var initTitle = function (nvrInfo) {
        var title = nvrInfo.TrainingInstitutionName + nvrInfo.ExamRoomName + "   视频监控";
        $("#title").text(title);
    }
    //页面加载时运行
    $(document).ready(function () {
        debugger;
        var examRoomNVRInfo = getExamRoomNVRInfo();
        if (!examRoomNVRInfo) {
            //alert("此考场没有监控！");
            return false;
        }
        initTitle(examRoomNVRInfo);
        if (!checkPlug()) {
            return;
        }
        login(examRoomNVRInfo);


    })

});
