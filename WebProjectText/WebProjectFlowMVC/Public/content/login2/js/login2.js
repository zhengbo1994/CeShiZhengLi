$(function () {

    var controllerName = "Login";

    var initLogin = function () {
        var initLoginButton = function () {
            var $loginInfo = $('#divLogin_AccountInfo');
            $("#btnLogin").on("click", function () {
                var loginData = getJson($loginInfo);
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
                    datatype: "string",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                //跳转到home2
                                window.location.href = "/home2";

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
            }
        };
        initLoginButton();
    }

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
                        if (jdata.IsSuccess === true) {
                            alert("证书存在");
                        } else {
                            alert(jdata.ErrorMessage);
                        }
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

                var $item = $('<a href="/ExamPlanDetailView.php?examplanid=' + item.Id
                    + '" target="_blank">湖北省发布考试计划：' + item.ExamPlanNumber
                    + '；开考时间：' + getDateFromDateStamp(item.ExamDateTimeBegin).toFormatString("yyyy-MM-dd HH:mm") + '</a><br />');
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

                var $item = $('<a href="/ExamResultDetailView.php?examplanid=' + item.Id
                    + '" target="_blank">湖北省发布考核结果：' + item.ExamPlanNumber
                    + '；考核时间：' + getDateFromDateStamp(item.ExamDateTimeBegin).toFormatString("yyyy-MM-dd HH:mm") + '</a><br />');
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
                                alert("注册成功!\r\n请使用 用户名【企业统一信用代码】密码【123】登录本系统");
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
        var readPassword = function (isalert) {
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
            if (ukeySn == "") {
                if (isalert) {
                    alert("请插入加密锁！\r\n老锁用户请先安装驱动\r\n只能使用IE浏览器读取加密锁");
                }
                console.log("请插入加密锁");
                setTimeout(function () { readPassword(false) }, 2000);
            }

            if (ukeySn) {
                //获取用户数据
                getEnterpriseInfo(ukeySn);
            }

        };

        $("#signup-modal").on("show.bs.modal", function (e) {
            var $formEnterpriseRegister = $("#formEnterpriseRegister");
            var enterpriseRegisterData = getJson($formEnterpriseRegister);
            for (var p in enterpriseRegisterData) {
                enterpriseRegisterData[p] = "";
            }
            setJson($formEnterpriseRegister, enterpriseRegisterData);
        });
        $("#signup-modal").on("shown.bs.modal", function (e) {
            setTimeout(function () { readPassword(true) }, 500);
        });
        initCityAndArea();
        initRegisterButton();
    };
    //页面加载时运行
    $(document).ready(function () {
        initLogin();
        initNews();
        initCertificateSearch();
        initExamResultSearch();
        initExamPlan();
        initExamResult();
        initEnterpriseRegister();
    })

})
