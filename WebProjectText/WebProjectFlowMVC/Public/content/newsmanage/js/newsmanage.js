$(function () {
    'use strict'

    var controllerName = "NewsManage";
    var $divNewsEditor = $('#divNewsManage_Editor');
    var $mdlNewsDetailInfo = $("#mdlNewsManage_DetailInfo");
    var $queryArea = $("#divNewsManage_QueryArea");
    var $gridNews = $("#gridNewsManage_main");
    var $pagerNews = $("#pagerNewsManage_main");
    var $btnQuery = $("#btnNewsManage_Query");

    var initDTPicker = function () {
        setInputAsDatePlug($(".dtpicker"));
    };

    var initEditor = function () {
        $divNewsEditor.ace_wysiwyg({
            toolbar:
            [
                'font',
                null,
                'fontSize',
                null,
                { name: 'bold', className: 'btn-info' },
                { name: 'italic', className: 'btn-info' },
                { name: 'strikethrough', className: 'btn-info' },
                { name: 'underline', className: 'btn-info' },
                null,
                { name: 'insertunorderedlist', className: 'btn-success' },
                { name: 'insertorderedlist', className: 'btn-success' },
                { name: 'outdent', className: 'btn-purple' },
                { name: 'indent', className: 'btn-purple' },
                null,
                { name: 'justifyleft', className: 'btn-primary' },
                { name: 'justifycenter', className: 'btn-primary' },
                { name: 'justifyright', className: 'btn-primary' },
                { name: 'justifyfull', className: 'btn-inverse' },
                null,
                { name: 'createLink', className: 'btn-pink' },
                { name: 'unlink', className: 'btn-pink' },
                null,
                { name: 'insertImage', className: 'btn-success' },
                null,
                'foreColor',
                null,
                { name: 'undo', className: 'btn-grey' },
                { name: 'redo', className: 'btn-grey' }
            ],
            'wysiwyg': {
                fileUploadError: function () { }
            }
        }).prev().addClass('wysiwyg-style2');
    };

    var initGrid = function () {
        var queryData = {};
        queryData = getJson($queryArea)
        var strData = JSON.stringify(queryData);
        $gridNews.jqGrid({
            url: "/" + controllerName + "/GetAllNews",
            mtype: "post",
            datatype: "json",
            postData: { "strData": strData },
            colNames: ["Id", "标题", "发布日期"],
            colModel: [
                    { name: "Id", index: "Id", width: 30, hidden: true },
                    { name: "NewsTitle", index: "NewsTitle", align: "center", width: 200 },
                    { name: "PublishDate", index: "PublishDate", align: "center", width: 50 }
            ],
            multiselect: true,
            multiboxonly: true,
            autowidth: true,
            rowNum: 20,
            altRows: true,
            pgbuttons: true,
            viewrecords: true,
            shrinkToFit: true,
            pginput: true,
            rowList: [10, 20, 30, 50, 70, 100],
            pager: $pagerNews,
            loadComplete: function () {
                jqGridAutoWidth();
                setGridHeight($gridNews.selector);
            }
        });
    };

    var refreshNewsGrid = function () {
        var queryData = {};
        queryData = getJson($queryArea);
        var strData = JSON.stringify(queryData);
        $gridNews.jqGrid("setGridParam", { page: 1, postData: { "strData": strData } }).trigger("reloadGrid");
    };

    var getNewsDetail = function (newsId) {
        var result;
        ajaxRequest({
            url: "/" + controllerName + "/GetNewsDetail",
            data: { "newsId": newsId },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                result = jresult;
            }
        });
        return result;
    };

    var getGridSelectedRowData = function ($grid, noSelectionCallback) {
        var rowId = $grid.jqGrid("getGridParam", "selrow");
        if (!rowId) {
            if ("function" == typeof (noSelectionCallback)) {
                noSelectionCallback();
            }
            return undefined;
        }
        var rowData = $grid.jqGrid("getRowData", rowId);
        return rowData;
    };

    var getSelectedNewsIdArray = function ($grid, noSelectionCallback) {
        var result = [];
        var rowIds = $grid.jqGrid("getGridParam", "selarrrow");
        if (!rowIds) {
            if ("function" == typeof (noSelectionCallback)) {
                noSelectionCallback();
            }
            return result;
        }

        for (var i = 0; i < rowIds.length; i++) {
            var rowData = $grid.jqGrid("getRowData", rowIds[i]);
            result.push(rowData.Id);
        }
        return result;
    };

    var saveNews = function () {
        var news = getJson($mdlNewsDetailInfo.find("[name='content']"));
        news.NewsContent = $divNewsEditor.html();
        news.NewsContent = encodeURIComponent(news.NewsContent);

        var ajaxurl = "";
        if (!news.Id || $.trim(news.Id).length == 0) {
            ajaxurl = "/" + controllerName + "/InsertNews";
        } else {
            ajaxurl = "/" + controllerName + "/UpdateNews";
        }

        var strData = JSON.stringify(news);
        ajaxRequest({
            url: ajaxurl,
            data: { "strData": strData },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                if (jresult.IsSuccess == true) {
                    alert("保存成功");
                    $mdlNewsDetailInfo.modal("hide");
                    refreshNewsGrid();
                } else {
                    alert(jresult.ErrorMessage);
                }
            }
        });
    };

    var deleteNews = function () {
        var jdata = {};
        jdata.IdList = getSelectedNewsIdArray($gridNews, function () { alert("请选择至少一个新闻");});
        var strData = JSON.stringify(jdata);

        ajaxRequest({
            url: "/" + controllerName + "/DeleteNews",
            data: { "strData": strData },
            type: "post",
            datatype: "json",
            async: false,
            success: function (jresult) {
                if (jresult.IsSuccess == true) {
                    refreshNewsGrid();
                    alert("删除成功");
                } else {
                    alert(jresult.ErrorMessage);
                }
            }
        });
    };

    var bindEvents = function () {
        $btnQuery.on("click", function () {
            refreshNewsGrid();
        });
        $queryArea.find("input[type='text']").on("keypress", function () {
            if (event.keyCode == 13) {
                $btnQuery.click();
                return false;
            }
        });
        var clearContent = function () {
            var $divContent = $mdlNewsDetailInfo.find("[name='content']");
            $divContent.find("[name='Id']").val("");
            $divContent.find("[name='NewsTitle']").val("");
            $divContent.find("[name='PublishDate']").val((new Date().toFormatString("yyyy-MM-dd")));
            $divNewsEditor.html("");
        };
        var setContent = function (data) {
            var $divContent = $mdlNewsDetailInfo.find("[name='content']");
            setJson($divContent, data);
            data.NewsContent = decodeURIComponent(data.NewsContent);
            $divNewsEditor.html(data.NewsContent);
        };
        $("#btnNewsManage_Insert").on("click", function () {
            clearContent();
            $mdlNewsDetailInfo.modal("toggle");
        });
        $("#btnNewsManage_Update").on("click", function () {
            var rowData = getGridSelectedRowData($gridNews, function () { alert("请选择要编辑的新闻"); });
            var newsDetail = getNewsDetail(rowData.Id);
            setContent(newsDetail);
            $mdlNewsDetailInfo.modal("toggle");
        });
        $("#btnNewsManage_Delete").on("click", function () {
            deleteNews();
        });
        $mdlNewsDetailInfo.find("[name='save']").on("click", function () {
            saveNews();
        });
    };


    initDTPicker();
    initGrid();
    initEditor();
    bindEvents();
});