$(function () {
    'use strict';

    var controllerName = "ExamPlanDetailView";
    var getExamPlanId = function () {
        return $.trim($("#ExamPlanId").val());
    };

    var initExamPlanDetail = function () {
        var getDateFromDateStamp = function (strDate) {
            var ticks = strDate.replace("/Date(", "").replace(")/", "");
            ticks = parseInt(ticks, 10);
            return new Date(ticks);
        };
        var $listContainer = $("#Content");
        var initPageList = function (data) {

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
                var strEmployees = "";
                for (var k = 0; k < inst.Employees.length; k++) {
                    totalEmployeeCount++;
                    var emp = inst.Employees[k];
                    strEmployees += "" + emp.EmployeeName + "（" + emp.IDNumber + "），";
                }

                if (strEmployees.length > 0) {
                    strEmployees = strEmployees.substr(0, strEmployees.length - 1);
                }

                var $p = $('<p></p>');
                $p.append(strEmployees);
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
            url: "/" + controllerName + "/GetExamPlanDetail",
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

    initExamPlanDetail();
});