
'use strict'
$(function () {


    var controllerName = "ExamPlanRemind";

    var initCalendar = function () {

        var initExamPlanModal = function (examPlanId) {

            var getExamPlanInfo = function () {

                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetExamPlanInfoForRemind",
                    type: "get",
                    dataType: "json",
                    data: { "examPlanId": examPlanId },
                    async: false,
                    success: function (data) {
                        dataResult = data;
                    },
                    error: function () {
                        dataResult = null;
                    }
                });
                return dataResult;
            }

            var examPlanInfo = getExamPlanInfo();

            $("#spanExamPlanRemind_ExamPlanInfo_ExamPlanNumber").text(examPlanInfo.ExamPlanNumber);
            $("#spanExamPlanRemind_ExamPlanInfo_EmployeeCount").text(examPlanInfo.EmployeeCount);
            $("#spanExamPlanRemind_ExamPlanInfo_ExamPlanRoom").text(examPlanInfo.ExamPlanRoom);
            $("#spanExamPlanRemind_ExamPlanInfo_SubmitStatus").text(examPlanInfo.SubmitStatus);
            $("#spanExamPlanRemind_ExamPlanInfo_StartTime").text(examPlanInfo.StartTime);
            $("#spanExamPlanRemind_ExamPlanInfo_EndTime").text(examPlanInfo.EndTime);
        }

        var calendarOption = {
            firstDay: 1,
            buttonHtml: {
                prev: '<i class="ace-icon fa fa-chevron-left"></i>',
                next: '<i class="ace-icon fa fa-chevron-right"></i>'
            },
            buttonText: {
                today: '今天',
                month: '月',
                week: '周',
                day: '日'
            },
            timeFormat: 'H:mm',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            eventClick: function (calEvent, jsEvent, view) {

                initExamPlanModal(calEvent.id);
                $("#ExamPlanRemind_CalemdarEvent").modal("toggle");
            }

        };


        var getExamPlanList = function () {
            var dataResult = {};
            ajaxRequest({
                url: "/" + controllerName + "/GetExamPlanListForRemind",
                type: "post",
                datatype: "json",
                async: false,
                success: function (data) {
                    dataResult = data;
                },
                error: function () {
                    dataResult = null;
                }
            });
            return dataResult;
        }

        var examPlanList = getExamPlanList();

        var events = [];
        for (var i = 0; i < examPlanList.length; i++) {
            var event = {};
            var examPlan = examPlanList[i];
            event.id = examPlan.Id;
            event.title = examPlan.Title;
            event.start = examPlan.Start;
            event.end = examPlan.End;
            event.allDay = false;
            event.className = 'btn btn-info';
            events.push(event);
        }

        calendarOption.events = events;
        var calendar = $('#calendar').fullCalendar(calendarOption);
        $(window).resize()
    }



    //页面加载时运行
    $(document).ready(function () {
        initCalendar();
    })

})
