
'use strict'
$(function () {

    var controllerName = "EnterpriseDetails";
    var $enterprise_DetailsInfo = $('#divEnterprise_DetailsInfo');

    var initEnterpriseDetais = function () {
        //初始化验证提示
        var initFormVerify = function () {

            var $arrInput = $enterprise_DetailsInfo.find("input,textarea");
            for (var i = 0; i < $arrInput.length; i++) {
                var $input = $($arrInput[i]);


                var verifyTypes = $input.data("verify");

                if (verifyTypes && $.trim(verifyTypes) != "") {



                    $input.on("focus", function () {
                        var $focusInput = $(this);
                        $focusInput.tooltip('destroy');
                    })

                    $input.on("blur", function () {
                        var $blurInput = $(this);
                        verifyInput($blurInput, function ($errInput) {
                            var errorMessage = $errInput.data("verify-errormessage");
                            $errInput.tooltip({ html: true, title: errorMessage }).tooltip('show')

                        })

                    })
                }
            }

        }
        //初始化图片上传控件 未启用
        var initEnterpriseImageUploader = function () {
            // var jsonData = getEmployeeFile(employeeId);
            //$("#imageUpload").html("");
            $("#divEnterprieAttachFile").ImageUpload({
                "title": "附件上传<small><i class='ace-icon fa fa-angle-double-right'></i>请上传 身份证正反扫描件、登记照片</small>",
                "displayrows": 1,
                "icon": "ace-icon fa fa-reorder",
                "edit": true,
                "getImgUrl": "/UpLoadImg/GetImg",
                "menu": [
                    { "fileKey": "IDCard", "txt": "身份证正反面", "multi": false },
                    { "fileKey": "RegistrationPhoto", "txt": "登记照片", "multi": false }
                ],
                //"imgList": imgList,
                "removeImg_CallBack": function (fileId) {
                    var result = false;
                    if (operate == "add") {
                        if (confirm("删除后不可恢复，确定要删除吗？")) {
                            //DeleteFile(fileId);
                            result = true;;
                        }
                    }
                    return result
                }
            });
        }
        //初始化考核点城市和区域 联动效果 未启用
        var initCityAndArea = function () {
            var $txtCity = $enterprise_DetailsInfo.find("select[name='City']");
            var $txtArea = $enterprise_DetailsInfo.find("select[name='Area']");

            var getCityList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetCityList",
                    type: "POST",
                    datatype: "Json",
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
            $txtCity.empty();
            var $optionAreaAll = $("<option>");
            $optionAreaAll.val("");
            $txtCity.text("请选择");
            for (var i = 0; i < listCity.length; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtCity.append($option);
            }
            var initArea = function () {
                var jdata = { 'cityName': $txtCity.val() };
                var getAreaList = function () {
                    var dataResult = {};
                    ajaxRequest({
                        url: "/" + controllerName + "/GetAreaListByCityName",
                        type: "post",
                        data: jdata,
                        datatype: "Json",
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
                $optionAreaAll.text("请选择");
                $txtArea.append($optionAreaAll);

                for (var i = 0; i < listArea.length; i++) {
                    var area = listArea[i];
                    var $option = $("<option>");
                    $option.val(area);
                    $option.text(area);
                    $txtArea.append($option);
                }
            }
            initArea();
            $txtCity.on("change", function () {
                initArea();
            })
        }

        var initLocaltionCity = function () {
            var $txtCity = $("#divEnterprise_DetailsInfoLocaltionCity");
            var getCityList = function () {
                var dataResult = {};
                ajaxRequest({
                    url: "/" + controllerName + "/GetCityList",
                    type: "POST",
                    datatype: "Json",
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
            $txtCity.empty();
            var $optionAreaAll = $("<option>");
            $optionAreaAll.val("");
            $txtCity.text("请选择");
            $txtCity.append($optionAreaAll);
            for (var i = 0; i < listCity.length; i++) {
                var city = listCity[i];
                var $option = $("<option>");
                $option.val(city);
                $option.text(city);
                $txtCity.append($option);
            }
        }
        //初始化保存按钮
        var initSaveButton = function () {
            $("#divEnterprise_DetailsInfoSave").on("click", function () {
                debugger;
                var enterpriseInfo = getJson($enterprise_DetailsInfo);
                var ajaxOpt = {
                    url: "/" + controllerName + "/UpdateEnterprise",
                    data: enterpriseInfo,
                    type: "post",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (jdata) {
                        if (jdata) {
                            if (jdata.IsSuccess === true) {
                                alert("保存成功！")
                                //保存成功 后重新加载数据 避免重复保存数据
                                //initData();
                            } else {
                                alert(jdata.ErrorMessage);
                            }
                        }
                    }
                };
                ajaxRequest(ajaxOpt);
            });
        }
        var getEnterprise = function () {
            var queryData = {};
            queryData.DateTimeStr = new Date().getTime().toString();
            var dataResult = {};
            ajaxRequest({
                url: "/" + controllerName + "/GetEnterpriseDetails",
                type: "post",
                data: queryData,
                datatype: "json",
                async: false,
                cache: false,
                success: function (jdata) {
                    dataResult = jdata;
                },
                error: function () {
                    dataResult = null;
                }
            });
            return dataResult;
        }

        var initData = function () {

            var enterpriseData = getEnterprise();
            setJson($enterprise_DetailsInfo, enterpriseData);
            for (var p in enterpriseData) {
                var disableField = ["", "", "", ""];
                if (p == "SocialCreditCode") {
                    $enterprise_DetailsInfo.find("[name='" + p + "']").prop("disabled", true);
                }
                else {
                    $enterprise_DetailsInfo.find("[name='" + p + "']").prop("disabled", false);
                }
            }
            $enterprise_DetailsInfo.find("select[name='City']").change();
            $enterprise_DetailsInfo.find("select[name='Area']").val(enterpriseData.Area);

        };
        initCityAndArea();
        //initEnterpriseImageUploader();
        //initLocaltionCity();
        initSaveButton()
        initData();
        initFormVerify();
    }
    //页面加载时运行
    $(document).ready(function () {
        initEnterpriseDetais();

    })

})
