
$(function () {


    //浏览
    function btn_browse() {
        var path = "/File/双评价技术指南（建议修订稿）.pdf"
        learun.dialogOpen({
            id: "Form",
            title: '双评价技术指南（建议修订稿）.pdf',
            url: '/Content/PDFJS/web/viewer.html?path=' + path,
            width: "1500px",
            height: "1000px",
            btn: null
        });
    }


    $.ajax({
        url: "@Url.Action('Browse')",
        type: "get",
        dataType: "json",
        success: function (resp) {
            debugger
            var path = "/File/地质勘查规范.pdf"
            learun.dialogOpen({
                id: "Form",
                title: '双评价技术指南（建议修订稿）.pdf',
                url: '/Content/PDFJS/web/viewer.html?path=' + path,
                btn: null
            });
        },
        error: function (xhr, status, type) {
            debugger
        }
    });
})