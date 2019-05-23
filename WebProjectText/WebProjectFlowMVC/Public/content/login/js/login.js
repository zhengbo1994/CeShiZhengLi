$(function () {

    var controllerName = "Login";
    var readUSBKeyTimer;

    var initLogin = function () {
        var initLoginButton = function () {
            var $loginInfo = $('#divLogin_AccountInfo');

            var USBKEYLogin = function (ukeySn) {
                ajaxRequest({
                    url: "/" + controllerName + "/USBKEYLogin",
                    data: { "usbKeySn": ukeySn },
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata.IsSuccess === true) {
                            //跳转到home
                            window.location.href = "/home";

                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                });
            };

            $("#btnLogin").on("click", function () {

                var loginData = getJson($loginInfo);

                //if (loginData.loginname == "" && loginData.password == "") {
                //    var ukeySn = readUSBKEY();
                //    if (ukeySn == "") {
                //        alert("没有检测到加密锁");
                //    }
                //    else {
                //        USBKEYLogin(ukeySn);
                //    }
                //    return false;
                //}
                if (loginData.password) {
                    loginData.password = hex_md5(loginData.password);
                }
                else {
                    alert("请输入密码");
                    return false;
                }

                ajaxRequest({
                    url: "/" + controllerName + "/UserLogin",
                    data: loginData,
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                if (jdata.ErrorMessage == "Employee") {
                                    window.location.href = "/startExam";
                                }
                                    //else if (jdata.ErrorMessage == "Enterprise") {
                                    //    alert("企业用户,请插入【加密锁】使用【IE浏览器】【清空用户名和密码】点击【登录】");
                                    //}
                                else {
                                    //跳转到home
                                    window.location.href = "/home";
                                }

                            } else {
                                alert(jdata.ErrorMessage);
                            }

                        }
                    }
                });
            });
            //登陆框获取焦点
            $loginInfo.find("[name='loginname']").focus();
        };
        document.onkeydown = function (event) {

            var e = event || window.event || arguments.callee.caller.arguments[0];

            if (e && e.keyCode == 27) { // 按 Esc 
                //要做的事情
            }
            if (e && e.keyCode == 113) { // 按 F2 
                //要做的事情
            }
            if (e && e.keyCode == 13) { // enter 键
                //要做的事情
                $("#btnLogin").click();
                return false;
            }
        };
        initLoginButton();
    }

    var readUSBKEY = function () {
        //读取老的加密锁
        var readPasswordOLD = function () {
            var passwordKey = "";
            try {
                ePass1.OpenDevice(1, "");
                passwordKey = ePass1.GetStrProperty(7, 0, 0);
                ePass1.CloseDevice();
            }
            catch (ex) {
                passwordKey = "";
            }
            return passwordKey;
        };
        var readPasswordNEW = function () {
            var passwordKey = "";
            try {
                ePass2.OpenDevice(1, ""); //打开设备
                passwordKey = ePass2.GetStrProperty(7, 0, 0); //获取用户密码的重试次数
            }
            catch (ex) {
                passwordKey = "";
            }
            return passwordKey;
        };

        var ukeySn = "";
        ukeySn = readPasswordNEW();
        if (ukeySn == "") {
            ukeySn = readPasswordOLD();
        }
        return ukeySn;
    };



    var getDateFromDateStamp = function (strDate) {
        var ticks = strDate.replace("/Date(", "").replace(")/", "");
        ticks = parseInt(ticks, 10);
        return new Date(ticks);
    };

    var initNews = function () {
        var $newsList = $("#NewsList");
        var initPageList = function (data) {
            $newsList.empty();
            if (!data) {
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                var news = data[i];
                var $liNews = $('<li><a href="/NewsViewDetail.php?newsid=' + news.Id + '" target="_blank">'
                    + news.NewsTitle + '</a><span class="data">'
                    + news.PublishDate + '</span></li>');
                $newsList.append($liNews);
            }
        };

        var queryData = {
            current_page: 1,
            page_size: 5
        };

        ajaxRequest({
            url: "/" + controllerName + "/GetPublishedNews",
            data: queryData,
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                initPageList(jresult.data);
            }
        });
    };

    var initCertificateSearch = function () {
        var $divform = $("#divCertificateSearch");
        $("#btnCertificateSearch").on("click", function () {
            var checkResult = verifyForm($divform);
            if (!checkResult) {
                return;
            }
            var postData = {};
            postData = getJson($divform);
            var ajaxOpt = {
                url: "/" + controllerName + "/CertificateSearch",
                data: postData,
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.IsSuccess === false) {
                            alert(jdata.ErrorMessage);
                            return false;
                        }
                        var certificateMsg = ""
                        certificateMsg += "姓名：" + jdata.employeeName + "\r\n";
                        certificateMsg += "性别：" + jdata.sex + "\r\n";
                        certificateMsg += "出生年月：" + jdata.birthday + "\r\n";
                        certificateMsg += "身份证号码：" + jdata.iDNumber + "\r\n";
                        certificateMsg += "企业名称：" + jdata.enterpriseName + "\r\n";
                        certificateMsg += "职务：" + jdata.job + "\r\n";
                        certificateMsg += "职称：" + jdata.title4Technical + "\r\n";
                        certificateMsg += "证书编号：" + jdata.certificateNo + "\r\n";
                        certificateMsg += "证书类型：" + jdata.examType + "\r\n";
                        certificateMsg += "行业：" + jdata.industry + "\r\n";
                        certificateMsg += "有效期开始：" + jdata.startCertificateDate + "\r\n";
                        certificateMsg += "有效期结束：" + jdata.endCertificateDate + "\r\n";
                        alert(certificateMsg);
                    }
                }
            }
            ajaxRequest(ajaxOpt);
        });
    };
    var initExamResultSearch = function () {
        var $divform = $("#divExamResultSearch");
        $("#btnExamResultSearch").on("click", function () {
            var checkResult = verifyForm($divform);
            if (!checkResult) {
                return;
            }
            var postData = {};
            postData = getJson($divform);
            var ajaxOpt = {
                url: "/" + controllerName + "/ExamResultSearch",
                data: postData,
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.IsSuccess === true) {
                            alert(jdata.ErrorMessage);
                        } else {
                            alert(jdata.ErrorMessage);
                        }
                    }
                }
            }
            ajaxRequest(ajaxOpt);
        });
    };

    var initExamPlan = function () {
        var $listContainer = $("#demo1,#demo2");
        var initPageList = function (data) {
            $listContainer.empty();
            if (!data) {
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var $item = $('<a href="/ExamPlanDetailView.php?examplanid=' + item.id
                    + '" target="_blank">湖北省发布考试计划：' + item.examPlanNumber
                    + '；开考时间：' + item.examDateTimeBegin + '</a><br />');
                $listContainer.append($item);
            }
        };

        var queryData = {
            current_page: 1,
            page_size: 20
        };

        ajaxRequest({
            url: "/" + controllerName + "/GetPublishedExamPlanList",
            data: queryData,
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                if (jresult) {
                    if (jresult.IsSuccess === false) {
                        $listContainer.html(jresult.ErrorMessage);
                    } else {
                        initPageList(jresult);
                    }
                }
            }
        });
    };

    var initExamResult = function () {
        var $listContainer = $("#dome1,#dome2");
        var initPageList = function (data) {
            $listContainer.empty();
            if (!data) {
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                var $item = $('<a href="/ExamResultDetailView.php?examplanid=' + item.id
                    + '" target="_blank">湖北省发布考核结果：' + item.examPlanNumber
                    + '；考核时间：' + item.examDateTimeBegin + '</a><br />');
                $listContainer.append($item);
            }
        };

        var queryData = {
            current_page: 1,
            page_size: 20
        };

        ajaxRequest({
            url: "/" + controllerName + "/GetPublishedExamResultList",
            data: queryData,
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                if (jresult) {
                    if (jresult.IsSuccess === false) {
                        $listContainer.html(jresult.ErrorMessage);
                    } else {
                        initPageList(jresult);
                    }
                }
            }
        });
    };

    var initEnterpriseRegister = function () {
        var $formEnterpriseRegister = $("#formEnterpriseRegister");
        var initCityAndArea = function () {
            var initCity = function () {
                var $txtQueryCity = $formEnterpriseRegister.find("[name='city']");
                var getCityList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetCityList",
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
                var listCity = getCityList();


                $txtQueryCity.empty();
                var $optionCityAll = $("<option>");
                $optionCityAll.val("");
                $optionCityAll.text("请选择城市");
                $txtQueryCity.append($optionCityAll);
                for (var i = 0; i < listCity.length ; i++) {
                    var city = listCity[i];
                    var $option = $("<option>");
                    $option.val(city);
                    $option.text(city);
                    $txtQueryCity.append($option);
                }
            }
            var initArea = function (cityName) {

                var jdata = { 'cityName': cityName };
                var $txtArea = $formEnterpriseRegister.find("[name='area']");
                var getAreaList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetAreaListByCityName",
                        type: "post",
                        datatype: "json",
                        data: jdata,
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


                var listArea = getAreaList();
                $txtArea.empty();
                var $optionAreaAll = $("<option>");

                $optionAreaAll.val("");

                $optionAreaAll.text("请选择区域");
                $txtArea.append($optionAreaAll);

                for (var i = 0; i < listArea.length ; i++) {
                    var area = listArea[i];
                    var $option = $("<option>");
                    $option.val(area);
                    $option.text(area);
                    $txtArea.append($option);
                }

            }
            initCity();
            $formEnterpriseRegister.find("[name='city']").on("change", function () {
                var cityName = $formEnterpriseRegister.find("[name='city']").val();
                initArea(cityName);
            });
        }

        var initRegisterButton = function () {
            $("#btnRegister").on("click", function () {
                var registerData = getJson($formEnterpriseRegister);
                if (!registerData.socialCreditCode || !registerData.enterpriseName) {
                    alert("请插入加密锁,以获取一体化企业信息");
                    return false;
                }

                if (!registerData.city || !registerData.area) {
                    alert("请选择城市和区域");
                    return false;
                }
                var ajaxOpt = {
                    url: "/" + controllerName + "/RegisterEnterprise",
                    data: registerData,
                    datatype: "string",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("注册成功!\r\n请插入【加密锁】使用【IE浏览器】登录本系统");
                                window.location.href = "/login";
                                return false;
                                //$("#signup-modal").modal("toggle");
                            } else {
                                alert("注册失败\r\n" + jdata.ErrorMessage);
                            }
                        }
                    }
                }
                ajaxRequest(ajaxOpt);
            });
        };
        var getEnterpriseInfo = function (passwordkey) {
            var ajaxOpt = {
                url: "/" + controllerName + "/GetAGRYEnterprise",
                data: { passwordkey: passwordkey },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata) {
                        if (jdata.resultMessage.IsSuccess === true) {
                            //获取信息成功 填充获取到的信息
                            $formEnterpriseRegister.find("[name='socialCreditCode']").val(jdata.socialCreditCode);
                            $formEnterpriseRegister.find("[name='enterpriseName']").val(jdata.enterpriseName);

                        } else {
                            alert("获取建委企业数据失败\r\n" + jdata.resultMessage.ErrorMessage);
                        }
                    }
                }
            }
            ajaxRequest(ajaxOpt);
        }



        $("#signup-modal").on("show.bs.modal", function (e) {
            var $formEnterpriseRegister = $("#formEnterpriseRegister");
            var enterpriseRegisterData = getJson($formEnterpriseRegister);
            for (var p in enterpriseRegisterData) {
                enterpriseRegisterData[p] = "";
            }
            setJson($formEnterpriseRegister, enterpriseRegisterData);

            var showMsg = true;
            readUSBKeyTimer = setInterval(function () {
                var ukeySn = readUSBKEY();
                if (ukeySn == "" && showMsg) {
                    showMsg = false;
                    alert("请插入加密锁！\r\n老锁用户请先安装驱动\r\n只能使用IE浏览器读取加密锁");
                }

                if (ukeySn != "") {
                    clearInterval(readUSBKeyTimer);
                    //获取用户数据
                    getEnterpriseInfo(ukeySn);
                }
                console.log("读取USBKEY");
            }, 2000);
        });


        $("#signup-modal").on("hide.bs.modal", function (e) {
            clearInterval(readUSBKeyTimer);
        });

        initCityAndArea();
        initRegisterButton();
    };
    //页面加载时运行
    $(document).ready(function () {
        initLogin();
        //initNews();
        //initCertificateSearch();
        //initExamResultSearch();
        //initExamPlan();
        //initExamResult();
        //initEnterpriseRegister();
        //setTimeout(function () {
        //    $("[name ='codeimg']").click();
        //}, 1000);

    })

})
