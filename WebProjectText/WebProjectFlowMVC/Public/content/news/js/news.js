$(function () {
    'use strict'

    var $newsList = $("#NewsList");

    var initPageQuestionList = function (data) {
        $newsList.empty();
        if (!data) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            var news = data[i];
            var $liNews = $('<li><a href="/NewsViewDetail?newsid=' + news.Id + '">' + news.NewsTitle + '</a><span class="data">' + news.PublishDate + '</span></li>');
            $newsList.append($liNews);
        }
    };

    var initData = function () {
        $("#jqpQuestionBankDetail").jqPagination({
            url: "/News/GetPublishedNews",
            //data: { "QuestionBankId": currentQuestionBank.Id, "SearchWords": $.trim($("#txtSearch").val()) },
            page_string: '第 {current_page} 页/共 {max_page} 页',
            page_size: 20,
            paged: function (page) {
                initPageQuestionList(page.data);
            }
        });
    };

    initData();
});


