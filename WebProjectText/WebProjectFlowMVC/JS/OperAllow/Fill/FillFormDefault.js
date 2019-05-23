$(function ()
{
    var iPageSize = ($("#hidPageSize").val() ? 3 : parseInt($("#hidPageSize").val())),
        ddHtmlTemplate = "<dd class='{0}' {1}>{2}{3}</dd>",
        $topDiv = $(".top>div"),
        $tableInfo = $(".table-info"),
        arrAsynRefreshObject = [],
        refreshTime = 60000;

    $topDiv.on("click", function ()
    {
        var index = $(this).index();
        $topDiv.siblings().removeClass("on").eq(index).addClass("on");

        clearAsynRefreshObject();
        getFillFormInfo(this.typeid);
    });

    $topDiv.filter(":first").trigger("click");

    function getFillFormInfo(typeid)
    {
        ajax(document.URL,
             { TypeID: typeid },
             "json",
             function (data)
             {
                 if (data && data.Success == "Y")
                 {
                     $tableInfo.children().remove().end()
                         .append(data.Data);

                     getTemplate();
                 }
                 else
                 {
                     alert("获取数据失败。");
                 }
             }
            );
    };

    function getTemplate()
    {
        $tableInfo.find(".template").each(function ()
        {
            arrAsynRefreshObject.push(this);
        });

        getFillMainRecords();
        buildFillAttachment();
    }

    // 获取填报数据
    function getFillMainRecords()
    {
        for (var i = 0; i < arrAsynRefreshObject.length; i++)
        {
            getFillMainData(arrAsynRefreshObject[i], buildFillTemplate);
        }
    }

    // 获取数据
    function getFillMainData(templateElement, callBack)
    {
        if (!templateElement)
        {
            return;
        }

        $.when($.ajax({
                url: "../../OperAllow/Fill/Fill.ashx",
                data: { Action: "GetFillMainRecords", TemplateID: templateElement.relationid }, //"GetFillMainRecords" GetTemplate
                dataType: "json"
        })).done(function (data)
        {
            callBack(templateElement, data);

            if (!templateElement.timer)
            {
                window.clearTimeout(templateElement.timer);
            }

            templateElement.timer = window.setTimeout(function () { getFillMainData(templateElement, callBack); }, refreshTime);
        }).fail(function (result)
        {
            if (!templateElement.timer)
            {
                window.clearTimeout(templateElement.timer);
            }

            templateElement.timer = window.setTimeout(function () { getFillMainData(templateElement, callBack); }, refreshTime);
        });
    }

    // 构建表单数据html
    function buildFillTemplate(templateElement, data)
    {
        var $dl = $(templateElement).find("dl");
        $dl.find("dd").remove();
        // 有配置主键及字段才显示
        if (data && Object.prototype.toString.call(data) === "[object Array]" && templateElement.pkids && templateElement.spfs)
        {
            for (var i = 0; i < data.length && i < iPageSize; i++)
            {
                var html = "",
                    arrPrimaryKeyIDs = (templateElement.pkids ? templateElement.pkids.substr(0, templateElement.pkids.length - 1).split(',') : []),
                    arrShowProtalFileds = (templateElement.spfs ? templateElement.spfs.substr(0, templateElement.spfs.length - 1).split(',') : []),
                    arrPrimaryKeyIDValues = [],
                    arrShowProtalFiledValues = [];

                for (var j = 0; j < arrPrimaryKeyIDs.length; j++)
                {
                    arrPrimaryKeyIDValues.push(data[i][arrPrimaryKeyIDs[j]]);
                }

                for (var z = 0; z < 1; z++) //arrShowProtalFileds.length 暂时取一列
                {
                    if (data[i][arrShowProtalFileds[z]])
                    {
                        arrShowProtalFiledValues.push("<span class='nowrap templateField' title='" + data[i][arrShowProtalFileds[z]] + "'>" + data[i][arrShowProtalFileds[z]] + "</span>");
                    }
                }

                html = stringFormat(ddHtmlTemplate, (i % 2 == 0 ? "" : "odd"), "primarykeyid='" + arrPrimaryKeyIDValues.toString(',') + "'",
                    arrShowProtalFiledValues.toString(""), "<i><a href='javascript:void(0)' class='editFormRecord'>编辑</a><a href='javascript:void(0)' class='browseFormRecord'>查看</a></i>");
                
                $dl.append(html)
            }

            if (data.length < iPageSize)
            {
                var arrDDHtml = [];
                for (var x = 0; x < iPageSize - data.length; x++)
                {
                    arrDDHtml.push(stringFormat(ddHtmlTemplate, ((data.length + x) % 2 == 0 ? "" : "odd"), "", "", ""));
                }

                $dl.append(arrDDHtml.toString(""))
            }
        }
        else
        {
            var arrDDHtml = [];
            for (var i = 0; i < iPageSize; i++)
            {
                arrDDHtml.push(stringFormat(ddHtmlTemplate, (i % 2 == 0 ? "" : "odd"), "", "", ""));
            }

            $dl.append(arrDDHtml.toString(""));
        }

        resizeContentHeight();
    }

    // 清除异步获取
    function clearAsynRefreshObject()
    {
        for (var i = 0; i < arrAsynRefreshObject.length; i++)
        {
            var templateObject = arrAsynRefreshObject[i];

            if (templateObject.timer)
            {
                window.clearTimeout(templateObject.timer);
            }
        }

        arrAsynRefreshObject = [];
    }

    // 构建表单附件html
    function buildFillAttachment()
    {
        $(".reference").each(function ()
        {
            var len = $(this).find("dd").length;

            if (len < iPageSize)
            {
                var arrDDHtml = [];
                for (var i = 0; i < iPageSize - len; i++)
                {
                    arrDDHtml.push(stringFormat(ddHtmlTemplate, ((len + i) % 2 == 0 ? "" : "odd"), "", "", ""));
                }

                $(this).find("dl").append(arrDDHtml.toString(""));
            }
        });
    };

    // 表单更多
    $tableInfo.on("click", ".moreFormRecord", function ()
    {
        var templateID = $(this).closest("li").attr("templateid");

        openWindow("VFillFormRecords.aspx?TemplateID=" + templateID, 800, 600);
    });

    // 附件更多
    $tableInfo.on("click", ".moreAttachment", function ()
    {
        var formID = $(this).closest("li").attr("FormID");

        openWindow("VFillFormBrowse.aspx?FormID=" + formID, 650, 650);
    });

    // 查看附件
    $tableInfo.on("click", ".browseAttachment", function ()
    {
        var path = $(this).closest("dd").attr("path");
        openWindow("../../Common/Doc/VFileBrowser.aspx?FileName=" + encodeURIComponent(path), 800, 600);
    });

    // 新增表单
    $tableInfo.on("click", ".addFormRecord", function ()
    {
        if (controller)
        {
            var $templateName = $(this).parent("i").find("input.templateName");
            if ($templateName.length === 1 && $templateName.val() !== "")
            {
                controller.OpenNewExcel($templateName.val());
            }
        }
    });

    // 编辑
    $tableInfo.on("click", ".editFormRecord", function ()
    {
        if (controller)
        {
            var $li = $(this).closest("li"),
                $dd = $(this).closest("dd"),
                templateName = $li.find("input.templateName").val(),
                pkids = ($li[0].pkids ? $li[0].pkids.substr(0, $li[0].pkids.length - 1) : ""),
                pkidValue = $dd[0].primarykeyid;

            controller.OpenEditExcel(templateName, pkids + "='" + pkidValue + "'");
        }
    });

    // 查看
    $tableInfo.on("click", ".browseFormRecord", function ()
    {
        if (controller)
        {
            var $li = $(this).closest("li"),
                $dd = $(this).closest("dd"),
                templateName = $li.find("input.templateName").val(),
                pkids = ($li[0].pkids ? $li[0].pkids.substr(0, $li[0].pkids.length - 1) : ""),
                pkidValue = $dd[0].primarykeyid;

            controller.OpenBrowseExcel(templateName, pkids + "='" + pkidValue + "'");
        }
    });

    // 适应高度,解决放门户时纵向滚动条未显示问题
    function resizeContentHeight()
    {
        if (window.top.location != self.location && window.parent)
        {
            var contentHeight = $(".canvas-view", window.parent.document).height();

            if ($("body").outerHeight(true) >= contentHeight)
            {
                $("body").css("overflow-y", "auto").height(contentHeight);
            }
            else
            {
                $("body").css("height", "100%");
            }
        }
    }

    // 视窗调整方法
    $(window).resize(function ()
    {
        resizeContentHeight();
    });
});