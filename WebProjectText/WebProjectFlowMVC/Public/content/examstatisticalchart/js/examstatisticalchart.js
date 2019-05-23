
'use strict'
$(function () {

    var controllerName = "ExamStatisticalChart";
    var $gridEnterprisePassRate = $("#gridExamStatisticalChart_PassRateForEnterpriseGrid");
    var $pagerEnterprisePassRate = $("#pagerExamStatisticalChart_PassRateForEnterpriseGrid");

    var $gridInstitutionPassRate = $("#gridExamStatisticalChart_PassRateForInstitutionGrid");
    var $pagerInstitutionPassRate = $("#pagerExamStatisticalChart_PassRateForInstitutionGrid");

    var initPassRateByCityChart = function () {

        var $divQueryArea = $("#formExamStatisticalChart_PassRateForCityQueryArea");

        var $divChartContainer = $("#divExamStatisticalChart_PassRateForCityChartContainer");

        var getPassRateDataByCity = function () {
            var dataResult = {};
            var queryData = getJson($divQueryArea)
            ajaxRequest({
                url: "/" + controllerName + "/GetPassRateDataForCity",
                type: "post",
                datatype: "json",
                data: queryData,
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

        var passRateData = getPassRateDataByCity();

        var cityList = getCityList();

        $divChartContainer.empty();

        var $divChart = $("<div id='divExamStatisticalChart_PassRateForCityChart'>");

        $divChartContainer.append($divChart);

        var $chart = new Highcharts.Chart('divExamStatisticalChart_PassRateForCityChart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            xAxis: [{
                categories: cityList,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}人',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '人数',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '通过率',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}%',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },

            series: passRateData
        });

        $chart.reflow();

    }

    var initQueryArea = function () {

        var $passRateForCityExamDateTimeBegin = $("#formExamStatisticalChart_PassRateForCityQueryArea").find("[name='ExamDateTimeBegin']");
        var $passRateForCityExamDateTimeEnd = $("#formExamStatisticalChart_PassRateForCityQueryArea").find("[name='ExamDateTimeEnd']");

        var $passRateForEnterpriseExamDateTimeBegin = $("#divExamStatisticalChart_PassRateForEnterpriseQueryArea").find("[name='ExamDateTimeBegin']");
        var $passRateForEnterpriseExamDateTimeEnd = $("#divExamStatisticalChart_PassRateForEnterpriseQueryArea").find("[name='ExamDateTimeEnd']");

        var $passRateForInstitutionExamDateTimeBegin = $("#divExamStatisticalChart_PassRateForInstitutionQueryArea").find("[name='ExamDateTimeBegin']");
        var $passRateForInstitutionExamDateTimeEnd = $("#divExamStatisticalChart_PassRateForInstitutionQueryArea").find("[name='ExamDateTimeEnd']");

        setInputAsDatePlug($passRateForCityExamDateTimeBegin);
        setInputAsDatePlug($passRateForCityExamDateTimeEnd);

        setInputAsDatePlug($passRateForEnterpriseExamDateTimeBegin);
        setInputAsDatePlug($passRateForEnterpriseExamDateTimeEnd);

        setInputAsDatePlug($passRateForInstitutionExamDateTimeBegin);
        setInputAsDatePlug($passRateForInstitutionExamDateTimeEnd);

        var dateBegin = (new Date()).addDays(-30).toFormatString("yyyy-MM-dd");
        $passRateForCityExamDateTimeBegin.val(dateBegin);
        $passRateForEnterpriseExamDateTimeBegin.val(dateBegin);
        $passRateForInstitutionExamDateTimeBegin.val(dateBegin);

        var dateEnd = (new Date()).toFormatString("yyyy-MM-dd");
        $passRateForCityExamDateTimeEnd.val(dateEnd);
        $passRateForEnterpriseExamDateTimeEnd.val(dateEnd);
        $passRateForInstitutionExamDateTimeEnd.val(dateEnd);

        $("#btnExamStatisticalChart_PassRateForCityQuery").on("click", function () {

            initPassRateByCityChart();

        })

        $("#btnExamStatisticalChart_PassRateForEnterpriseQuery").on("click", function () {

            var queryData = {};
            var divQueryArea = $("#divExamStatisticalChart_PassRateForEnterpriseQueryArea")
            queryData = getJson(divQueryArea)
            $gridEnterprisePassRate.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");


        })

        $("#btnExamStatisticalChart_PassRateForInstitutionQuery").on("click", function () {

            var queryData = {};
            var divQueryArea = $("#divExamStatisticalChart_PassRateForInstitutionQueryArea")
            queryData = getJson(divQueryArea)
            $gridInstitutionPassRate.jqGrid("setGridParam", { page: 1, postData: queryData }).trigger("reloadGrid");


        })

    }

    var initNavTab = function () {


    }

    var initEnterprisePassRateGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divExamStatisticalChart_PassRateForEnterpriseQueryArea")
        queryData = getJson(divQueryArea)
        debugger;
        $gridEnterprisePassRate.jqGrid({
            url: "/" + controllerName + "/GetPassRateDataForEnterprise",
            datatype: "json",
            postData: queryData,
            colNames: ["企业名称", "报名人数", "参考人数", "合格人数", "通过率"],
            colModel: [
                    { name: "EnterpriseName", index: "EnterpriseName", align: "center", width: 200 },
                    { name: "TotalCount", index: "LegalRepresentative", align: "center", width: 50 },
                    { name: "TakeCount", index: "LegalRepresentativeNumber", align: "center", width: 80 },
                    { name: "PassCount", index: "ContactPerson", align: "center", width: 50 },
                    { name: "PassRate", index: "ContactNumber", align: "center", width: 80 }
            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerEnterprisePassRate,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridEnterprisePassRate.selector);

            }
        });
    }

    var initInstitutionPassRateGrid = function () {
        var queryData = {};
        var divQueryArea = $("#divExamStatisticalChart_PassRateForInstitutionQueryArea")
        queryData = getJson(divQueryArea)
        debugger;
        $gridInstitutionPassRate.jqGrid({
            url: "/" + controllerName + "/GetPassRateDataForInstitution",
            datatype: "json",
            postData: queryData,
            colNames: ["企业名称", "报名人数", "参考人数", "合格人数", "通过率"],
            colModel: [
                    { name: "InstitutionName", index: "InstitutionName", align: "center", width: 200 },
                    { name: "TotalCount", index: "LegalRepresentative", align: "center", width: 50 },
                    { name: "TakeCount", index: "LegalRepresentativeNumber", align: "center", width: 80 },
                    { name: "PassCount", index: "ContactPerson", align: "center", width: 50 },
                    { name: "PassRate", index: "ContactNumber", align: "center", width: 80 }
            ],
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerInstitutionPassRate,
            loadComplete: function () {
                var table = this;
                updatePagerIcons(table);
                jqGridAutoWidth();
                setGridHeight($gridInstitutionPassRate.selector);

            }
        });
    }

    var initPassRateForYearChart = function () {

        var $divChartContainer = $("#divExamStatisticalChart_PassRateForYearChartContainer");

        var getPassRateDataForYear = function () {
            var dataResult = {};
            ajaxRequest({
                url: "/" + controllerName + "/GetPassRateDataForYear",
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

        var getMonthList = function () {
            var dataResult = {};
            ajaxRequest({
                url: "/" + controllerName + "/GetMonthList",
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

        var passRateData = getPassRateDataForYear();

        var monthList = getMonthList();



        $divChartContainer.empty();

        var $divChart = $("<div id='divExamStatisticalChart_PassRateForYearChart'>");

        $divChartContainer.append($divChart);

        var $chart = new Highcharts.Chart('divExamStatisticalChart_PassRateForYearChart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            xAxis: [{
                categories: monthList,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}人',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '人数',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '通过率',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}%',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },

            series: passRateData
        });

        $("#btnExamStatisticalChart_PassRateForYear").on("click", function () {
            setTimeout(function () { $chart.reflow(); }, 100);

        })


    }


    //页面加载时运行
    $(document).ready(function () {
        initQueryArea();
        initPassRateByCityChart();
        initEnterprisePassRateGrid();
        initInstitutionPassRateGrid();
        initPassRateForYearChart();
    })

})