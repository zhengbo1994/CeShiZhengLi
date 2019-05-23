
'use strict'
$(function () {
    var controllerName = "ExamInvigilate";
    var initPage = function () {
        var removeBindingUrl = "";
        //获取本地考生数据
        var getLocaltionEmployeeInfo = function (examPlanId, examRoomId) {
            var employeeList = {};
            var ajaxOpt = {
                url: "/" + controllerName + "/GetEmployeeInfo",
                data: { "examPlanId": examPlanId, "examRoomId": examRoomId, "dateTimeStr": new Date().toDateString() },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    if (jdata.ResultMsg.IsSuccess) {
                        employeeList = jdata;
                    }
                    else {
                        employeeList = null;
                        throw new Error("获取本地考生信息失败\r\n" + jdata.ResultMsg.ErrorMessage)
                    }
                }
            };
            ajaxRequest(ajaxOpt);
            return employeeList;
        };
        //获取考试核心考生数据
        var getExamCoreEmployeeInfo = function (examCoreExamId, idNumberList, url) {
            var employeeList = [];
            var ajaxOpt = {
                url: url,
                data: { "examId": examCoreExamId, "idNumberList": idNumberList, "dateTimeStr": new Date().toDateString() },
                type: "post",
                dataType: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    employeeList = jdata;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    throw new Error("获取考试核心考生信息失败\r\n" + textStatus);
                }
            };
            ajaxRequest(ajaxOpt);
            return employeeList;
        };
        //将本地考生数据和考试核心考试数据组合一起
        var prepareData = function (localtionEmployeeInfoList, examCoreEmployeeInfoList) {
            var employeeList = [];
            for (var i = 0; i < localtionEmployeeInfoList.length; i++) {

                var localtionEmployeeInfo = localtionEmployeeInfoList[i];
                //找到考试核心对应的人员信息
                var examCoreEmployeeInfoResult = {};
                for (var j = 0; j < examCoreEmployeeInfoList.length; j++) {
                    var examCoreEmployeeInfo = examCoreEmployeeInfoList[j];
                    if (examCoreEmployeeInfoList[j].IDCard == localtionEmployeeInfo.IDNumber) {
                        if (isNull(examCoreEmployeeInfoResult.BeginExamDate) || examCoreEmployeeInfo.BeginExamDate > examCoreEmployeeInfoResult.BeginExamDate) {
                            examCoreEmployeeInfoResult = examCoreEmployeeInfo;
                        }
                    }
                }

                //生成人员信息
                var employeeInfo = {};
                employeeInfo.IDNumber = localtionEmployeeInfo.IDNumber;
                employeeInfo.EmployeeName = localtionEmployeeInfo.EmployeeName;

                if (examCoreEmployeeInfoResult) {
                    //var examSatus = examCoreEmployeeInfoResult.ExamStatus;
                    var beginExamDateTime = examCoreEmployeeInfoResult.BeginExamDate;
                    employeeInfo.BeginExamDateTime = beginExamDateTime ? beginExamDateTime : "";

                    var endExamDateTime = examCoreEmployeeInfoResult.EndExamDate;
                    employeeInfo.EndExamDateTime = endExamDateTime ? endExamDateTime : "";

                    var score = examCoreEmployeeInfoResult.Score;
                    employeeInfo.Score = score ? score : 0;

                    var questionCount = examCoreEmployeeInfoResult.QuestionCount;
                    employeeInfo.QuestionCount = questionCount ? questionCount : 0;

                    var examSatus = "未开始";
                    if (!isNull(endExamDateTime)) {
                        examSatus = "已交卷";
                    }
                    else if (endExamDateTime == "") {
                        examSatus = "正在考试";
                    }
                    employeeInfo.ExamStatus = examSatus;
                    var paperId = examCoreEmployeeInfoResult.PaperId;
                    if (paperId) {
                        var paperTypeList = localtionEmployeeInfo.PaperTypeList;

                        var paperTypeIndex = arrContext(paperTypeList, "PaperId", paperId);
                        if (paperTypeIndex > -1) {
                            employeeInfo.PaperName = paperTypeList[paperTypeIndex].PaperTypeName
                        }

                    }
                    else {
                        employeeInfo.PaperName = "";
                    }

                }
                else {
                    employeeInfo.ExamStatus = "未开始";
                    employeeInfo.BeginExamDateTime = "";
                    employeeInfo.EndExamDateTime = "";
                    employeeInfo.Score = 0;
                    employeeInfo.QuestionCount = 0;
                    employeeInfo.PaperName = "";
                }


                //加入到结果List
                employeeList.push(employeeInfo);
            }

            return employeeList;
        };
        //向页面增加一个考生信息
        var addEmployee = function (employeeInfo, examCoreExamId) {
            var divContainer = $('<div>');
            divContainer.addClass('col-xs-12 col-sm-6 col-md-4 col-lg-3 margin-top-5');
            var widgetbox = $('<div>').addClass("widget-box");
            var widgetboxColor = "";
            if (employeeInfo.ExamStatus == '未开始') {
                widgetboxColor = "widget-color-blue";
            }
            else if (employeeInfo.ExamStatus == "正在考试") {
                widgetboxColor = "widget-color-orange";
            }
            else if (employeeInfo.ExamStatus == "已交卷") {
                widgetboxColor = " widget-color-green";
            }
            else {
                widgetboxColor = "widget-color-blue";
            }
            widgetbox.addClass(widgetboxColor);
            var widgetheader = $('<div>').addClass("widget-header");
            var widgettitle = $('<h4>').addClass("widget-title");
            widgettitle.text(employeeInfo.EmployeeName);//姓名
            widgetheader.append(widgettitle);

            var widgettoolbar = $("<div>").addClass("widget-toolbar");
            var a = $('<a onclick="btnExamInvigilate_RemoveBinding(\'' + examCoreExamId + '\',\'' + employeeInfo.IDNumber + '\')" href="#">');
            var icon = $("<i>").addClass("ace-icon fa fa-key white").text("解除绑定");
            a.append(icon);
            widgettoolbar.append(a);
            widgetheader.append(widgettoolbar);

            widgetbox.append(widgetheader);

            var widgetbody = $("<div>").addClass("widget-body");
            var widgetmain = $("<div>").addClass("widget-main");
            var ul = $("<ul>").addClass("list-unstyled spaced2");


            ul.append("<li><b>正在进行的考试：</b>" + employeeInfo.PaperName + "</li>");
            ul.append("<li><b>状态：</b>" + employeeInfo.ExamStatus + "</li>");
            ul.append("<li><b>身份证号：</b>" + employeeInfo.IDNumber + "</li>");
            ul.append("<li><b>考试开始时间：</b>" + employeeInfo.BeginExamDateTime + "</li>");
            ul.append("<li><b>考试结束时间：</b>" + employeeInfo.EndExamDateTime + "</li>");
            //ul.append("<li><b>已答题目：</b>" + employeeInfo.QuestionCount + "</li>");
            ul.append("<li><b>考试得分：</b>" + employeeInfo.Score + "</li>");

            widgetmain.append(ul);

            widgetbody.append(widgetmain);

            widgetbox.append(widgetbody);

            divContainer.append(widgetbox);

            $("#divExamInvigilate_container").append(divContainer);
        }
        //载入考生数据
        var loadEmployee = function () {

            try {
                //接收页面参数
                var examCoreExamId = getQueryString("examCoreExamId");
                var examRoomId = getQueryString("examRoomId");
                var examPlanId = getQueryString("examPlanId");
                var localtionEmployeeData = getLocaltionEmployeeInfo(examPlanId, examRoomId);
                //设置取消绑定的 Url
                removeBindingUrl = localtionEmployeeData.RemoveBindingUrl;
                var idNumberList = [];
                for (var i = 0; i < localtionEmployeeData.EmployeeInfoList.length; i++) {
                    var idNumber = localtionEmployeeData.EmployeeInfoList[i].IDNumber;
                    idNumberList.push(idNumber);
                }
                var examCoreEmployeeList = getExamCoreEmployeeInfo(examCoreExamId, idNumberList, localtionEmployeeData.GetExamInvigilateInfoUrl);

                var localtionEmployeeList = localtionEmployeeData.EmployeeInfoList;
                var employeeList = prepareData(localtionEmployeeList, examCoreEmployeeList);
                $("#divExamInvigilate_container").html("");
                for (var i = 0; i < employeeList.length; i++) {
                    addEmployee(employeeList[i], examCoreExamId);
                }
            }
            catch (ex) {
                alert(ex.message);
            }
        };

        loadEmployee();

        window.btnExamInvigilate_RemoveBinding = function (examCoreExamId, idNumber) {
            var ajaxOpt = {
                url: removeBindingUrl,
                data: { "examId": examCoreExamId, "idNumber": idNumber },
                type: "post",
                dataType: "json",
                async: false,
                success: function (jdata) {
                    if (jdata.IsSuccess) {
                        alert("解除绑定 成功！");
                    }
                    else {
                        alert(jdata.ErrorMessage);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    throw new Error("请求取消绑定失败\r\n" + textStatus);
                }
            };
            ajaxRequest(ajaxOpt);

        };

        var intervalId = setInterval(function () {
            loadEmployee();
        }, 60 * 1000);
    };
    //页面加载时运行
    $(document).ready(function () {
        initPage();

    })

})
