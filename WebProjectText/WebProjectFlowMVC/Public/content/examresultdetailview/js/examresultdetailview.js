$(function () {
    'use strict';

    var controllerName = "ExamResultDetailView";
    var getExamPlanId = function () {
        return $.trim($("#ExamPlanId").val());
    };

    var initExamResultDetail = function () {
        var getDateFromDateStamp = function (strDate) {
            var ticks = strDate.replace("/Date(", "").replace(")/", "");
            ticks = parseInt(ticks, 10);
            return new Date(ticks);
        };
        var $listContainer = $("#Content");
        var initPageList = function (data) {
            debugger;
            if (!data) {
                return false;
            }

            $listContainer.find("[name='ExamPlanNumber']").text(data.ExamPlanNumber);
            $listContainer.find("[name='ExamDateTimeBegin']").text(getDateFromDateStamp(data.ExamDateTimeBegin).toFormatString("yyyy-MM-dd HH:mm"));
            $listContainer.find("[name='ExamDateTimeEnd']").text(getDateFromDateStamp(data.ExamDateTimeEnd).toFormatString("yyyy-MM-dd HH:mm"));

            var totalEmployeeCount = 0;
            for (var i = 0; i < data.TrainingInstitutions.length; i++) {
                var inst = data.TrainingInstitutions[i];
                var $divTrainingInstitutions = $listContainer.find("[name='TrainingInstitutions']");
                $divTrainingInstitutions.append('<h5>' + inst.InstitutionName + '-' + inst.Address + '</h5>');

                var $divEmployees = $listContainer.find("[name='Employees']");
                $divEmployees.append('<h5><b>' + inst.InstitutionName + '参加考试人员名单：</b></h5>');
                var $p = $('<p></p>');
                for (var k = 0; k < inst.Employees.length; k++) {
                    totalEmployeeCount++;
                    var emp = inst.Employees[k];
                    var FinalExamResult = emp.ExamResult[0] ? emp.ExamResult[0].FinalExamResult : "缺考";
                    var color = "green";
                    if (FinalExamResult != "缺考" && emp.ExamResult[0].CheckedResult == "审核不通过") {
                        color = "blue";
                        FinalExamResult = FinalExamResult + ",考试结果审核不通过";
                    }
                    else if (FinalExamResult == "合格") {
                        color = "green";
                    }
                    else {
                        color = "red";
                    }
                    var $emp = $('<span style="color:' + color + ';">' + emp.EmployeeName
                        + '（' + emp.IDNumber + '）'
                        + FinalExamResult + '</span>');
                    $p.append($emp);
                    if (k < inst.Employees.length - 1) {
                        $p.append('，');
                    }
                }

                $divEmployees.append($p);

                if (i < data.TrainingInstitutions.length - 1) {
                    $divTrainingInstitutions.append('<br />');
                    $divEmployees.append('<br />');
                }
            }
            $listContainer.find("[name='TotalEmployeeCount']").text(totalEmployeeCount);
        };

        var queryData = {
            examPlanId: getExamPlanId()
        };

        ajaxRequest({
            url: "/" + controllerName + "/GetExamResultDetail",
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

    initExamResultDetail();
});