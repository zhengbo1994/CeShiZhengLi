$(function () {
    $(".choise_all").bind("click", function (event) {
        var e = event.currentTarget;
        if ($(e).attr("checked") == undefined || $(e).attr("checked") == "" || $(e).attr("checked") == "false") {
            $("input[type=checkbox]").removeAttr("checked");
        }
        else {
            $("input[type=checkbox]").attr("checked", "checked");
        }
    });
    $(".choise_building").bind("click", function (event) {
        var e = event.currentTarget;
        var checkTarget = $(e).parent().parent().parent().parent().next();
        if ($(e).attr("checked") == undefined || $(e).attr("checked") == "" || $(e).attr("checked") == "false") {
            $(checkTarget).find("input[type=checkbox]").removeAttr("checked");
        }
        else {
            $(checkTarget).find("input[type=checkbox]").attr("checked", "checked");
        }
    });
    $(".choise_single").bind("click", function (event) {
        var e = event.currentTarget;
        var checkTarget = $(e).parent().parent().parent().parent().prev();
        if ($(e).attr("checked") == undefined || $(e).attr("checked") == "" || $(e).attr("checked") == "false") {
            $(checkTarget).find("input[type=checkbox]").removeAttr("checked");
            $("input[type=checkbox]:first").removeAttr("checked");
        }
        else {
            var isAllChecked = true;
            $(e).parent().parent().parent().parent().find("input[type=checkbox]").each(function () {
                if ($(this).attr("checked") == undefined || $(this).attr("checked") == "" || $(this).attr("checked") == "false") {
                    isAllChecked = false;
                    return false;
                }
            });
            if (isAllChecked) {
                $(checkTarget).find("input[type=checkbox]").attr("checked", "checked");
            }
        }
    });
});

function saveAndClose() {
    var strRoomIds = '';
    $("input[type=checkbox]").each(function () {
        if (this.checked == true) {
            var rel = $(this).attr("rel");
            if (rel != undefined && rel.length > 0) {
                strRoomIds += $(this).attr("rel") + ",";
            }
        }
    });
    if (strRoomIds == undefined || strRoomIds.length == 0) {
        alert("没有选择房间");
        return false;
    }
    else {
        strRoomIds += $("#hidRoomStatus").val();//最后一个值为房间状态,此处一并返回
    }    
    window.returnValue = strRoomIds;
    window.close();
}