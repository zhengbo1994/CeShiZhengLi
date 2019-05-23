
$.fn.ImageUpload = function (config) {
    var $base = $(this);//控件宿主
    var title = config.title;   //左上角标题名称
    var icon = config.icon;     //右上角下拉菜单图标
    var menu = config.menu;     //右上角下拉菜单选项
    var imgList = config.imgList;     //初始加载的图片
    var removeImg_CallBack = config.removeImg_CallBack;       //删除图片回调方法
    var displayrows = config.displayrows;//显示行数
    var height = displayrows == null ? 160 : displayrows * 160;
    var modal_width = config.modal_width;//弹出model显示框 显示图片 宽
    var modal_height = config.modal_height;//弹出model显示框 显示图片 高
    var getImgUrl = config.getImgUrl;//获取单个文件的Url
    var edit = config.edit;//是否可以编辑
    var box = $("<div>");
    var head = $("<div>");
    var body = $("<div>");
    var footer = $("<div>");
    var fluid = $("<div>");
    var thumbnails = $("<ul>");
    var fileType;
    //创建GUID
    var newGuid = function () {
        var i, n;
        return ((function () {
            var j, results;
            results = [];
            for (i = j = 1; j <= 32; i = ++j) {
                n = Math.floor(Math.random() * 16.0).toString(16);
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                    results.push(n += "-");
                } else {
                    results.push(n);
                }
            }
            return results;
        })()).join("");
    };
    var imgBox_Modal = "imgBox_Modal_" + newGuid();
    var imgDialog_Modal = "imgDialog_Modal_" + newGuid();
    var imgBody_Modal = "imgBody_Modal_" + newGuid();
    var div_prev = "div_prev_" + newGuid();
    var div_next = "div_next_" + newGuid();

    box.addClass("widget-box");


    $(this).html("");
    //初始化控件标题部分
    initHead();
    //初始化控件主体部分
    initBody();
    //初始化底部
    //initFoot();
    //初始化控件弹出框部分
    initModal();
    //将控件添加到页面上 $(this)宿主div
    $(this).append(box);
    //加载已有的图片
    initLoadImgList();

    //base.callMethod = function (option, key, value) {

    //};

    function initHead() {
        var h4 = $("<h4>");
        var toolbar = $("<div>").addClass("widget-toolbar");
        var dropdown = $("<span>").addClass("dropdown");
        var a = $("<a>");
        var i = $("<i>");
        var ul = $("<ul>");


        head.addClass("widget-header");
        h4.html(title ? title : "标题");
        h4.addClass("widget-title");
        head.append(h4);
        if (!menu) {
            dropdown.attr("style", "display:none;")
        };

        a.addClass("dropdown-toggle");
        a.attr("data-toggle", "dropdown");
        a.attr("href", "#");
        a.attr("title", "添加图片");
        i.addClass((icon ? icon : "plus blue"));
        a.append(i);
        a.append("添加图片<span class='caret'></span>");
        dropdown.append(a);
        ul.addClass("dropdown-menu dropdown-menu-right dropdown-caret dropdown-close");
        ul.attr("role", "menu");
        for (var j = 0; j < menu.length; j++) {
            var li = $("<li>");
            var a1 = $("<a>");
            li.attr("role", "presentation");
            a1.attr("style", "cursor:pointer;");
            a1.attr("role", "menuitem");
            a1.attr("fileKey", menu[j].fileKey);
            a1.attr("multi", menu[j].multi);
            a1.html(menu[j].txt);
            a1.on("click", function () {
                //选择图片文件
                SelectFile($(this));
            });
            li.append(a1);
            ul.append(li);

        }
        var SelectFile = function ($Menu_a) {
            //在触发文件选择器之前 将相关属性 赋值到控件上
            //filekey txt mulit
            var filekey = $Menu_a.attr("fileKey");
            var txt = $Menu_a.html();
            var mulit = $Menu_a.attr("multi");
            if (eval(mulit) == false) {
                if ($base.find("img[name='" + filekey + "']").length > 0) {
                    alert("附件【" + txt + "】不允许重复上传！");
                    return false;
                }
            }
            //因为文件input 不能赋值 只能将文件控件放在 外边
            var $fileInput = AddFileInput();
            $fileInput.attr("name", filekey);

            $fileInput.attr("txt", txt);
            fluid.append($fileInput);
            //触发文件选择器选择文件事件
            $fileInput.click();
        }
        //新增文件input选择器
        var AddFileInput = function () {
            var fileSelector = $("<input>")
            fileSelector.attr("type", "file");
            fileSelector.attr("id", newGuid());
            fileSelector.addClass("hide");
            fileSelector.on("change", function () {
                addImage($(this));
            });
            return fileSelector;
        }

        dropdown.append(ul);
        toolbar.append(dropdown);
        if (edit) {
            head.append(toolbar);
        }
        box.append(head);
    }
    function initBody() {
        body.addClass("widget-body");
        body.attr("style", "overflow:auto;height:" + height + "px;");
        fluid.addClass("row-fluid");
        thumbnails.addClass("ace-thumbnails");
        fluid.append(thumbnails);
        body.append(fluid);
        box.append(body);
    }

    function initFoot(foot) {
        //foot.addClass("");
        var div10 = $("<div>");
        var div2 = $("<div>");
        var btn = $("<div>");
        //var i = $("<i>");
        div10.addClass("col-sm-10");
        div2.addClass("col-sm-2");
        btn.addClass("btn btn-primary btn-sm pull-right");
        btn.on("click", function () {
            $("#" + imgBox_Modal).modal('toggle')
        });
        btn.attr("title", "关闭");
        //i.addClass("icon-remove");

        btn.append("<i class='icon-remove'>关闭</i>");
        div2.append(btn);
        foot.append(div10);
        foot.append(div2);
        box.append(foot);
    }
    //添加显示图片控件
    function addImage($fileSelector) {
        var filekey = $fileSelector.attr("name");
        var txt = $fileSelector.attr("txt");
        //文件选择器的value值为空时
        if (!$fileSelector || $fileSelector.val() == "") {
            return false;
        }
        //验证文件是否为图片格式
        var fileName = $fileSelector.val();
        var point = fileName.lastIndexOf(".");
        var type = fileName.substr(point + 1).toUpperCase();
        if ("BMP" != type && "GIF" != type && "JPEG" != type && "TIFF" != type && "PSD" != type && "PNG" != type && "SVG" != type && "JPG" != type) {
            // $(file).remove();
            alert("请选择正确的图片格式文件！");
            return false;
        }
        //验证文件大小是否合法
        var fileSize = $fileSelector[0].files[0].size / 1024;
        if (fileSize > 2000) {
            //$(file).remove();
            alert("图片不能大于2M");
            return false;
        }

        var li = $("<li>");
        var a = $("<a>");
        var img = $("<img>");
        var remove = $("<div>");
        var a_remove = $("<a>");
        var i_remove = $("<i>");


        //var fileMessage = $("<input>");
        //point = fileName.lastIndexOf("\\");
        //var lastName = fileName.substring(point + 1);

        //var fileArr = thumbnails.find("input[lastname='" + lastName + "']");
        //if (fileArr.length > 0) {
        //   // $(file).remove();
        //    alert("附件" + lastName + "已存在，请不要重复添加！");
        //    return;
        //}

        var filepath = getPath($fileSelector[0]);

        a.attr("href", "#");
        a.attr("title", fileName);
        a.attr("data-toggle", "modal")
        a.attr("data-target", "#" + imgBox_Modal)
        a.on("click", function () { showImg($(this)) });
        img.attr("name", filekey);
        img.attr("src", filepath);
        img.attr("style", "width:150px;height:150px");

        //fileMessage.attr("type", "hidden");
        //fileMessage.val(fileName);
        // fileMessage.attr("name", enname);
        //fileMessage.attr("enname", enname);

        remove.addClass("tools tools-bottom");
        remove.attr("style", "bottom:0px");
        a_remove.attr("href", "#");
        a_remove.attr("fileName", fileName)
        //if (btn_disable) {
        //    a_remove.addClass("hide")
        //};
        a_remove.on("click", function () {
            //$(file).remove();
            $(this).parent().parent().remove();
            //对应的inputFile控件
            $base.find("input[type='file'][id='" + $fileSelector.attr("id") + "']").remove();
        });
        //i_remove.addClass("icon-remove red");
        i_remove.addClass("ace-icon fa fa-remove red small");
        a.append(img);
        //a.append(fileMessage)

        a_remove.append(i_remove);
        remove.append(a_remove);

        remove.append("<span class='white'>" + txt + "</span>");

        li.append(a);
        li.append(remove);
        // li.append('<input type="hidden" lastname="' + lastName + '">');
        thumbnails.append(li);
    }
    //取图片的本地路径
    function getPath(fileSelector_obj) {
        if (fileSelector_obj) {
            //ie
            if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
                fileSelector_obj.select();
                // IE下取得图片的本地路径
                return document.selection.createRange().text;
            }
                //firefox
            else {
                //else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
                if (fileSelector_obj.files) {
                    // Firefox下取得的是图片的数据
                    //return obj.files.item(0).getAsDataURL();

                    return window.URL.createObjectURL(fileSelector_obj.files[0])
                }
                return fileSelector_obj.value;
            }
            return fileSelector_obj.value;
        }
    }
    //初始化 图片查看 model
    function initModal() {
        var widowHeight = $(window).height();
        var widowWidth = $(window).width();
        var modal_modal = $("<div>");//看图片的model
        var modal_dialog = $("<div>");
        var modal_content = $("<div>");
        var modal_header = $("<div>");
        var modal_body = $("<div>");
        var modal_footer = $("<div>");


        modal_modal.addClass("modal fade");
        modal_modal.attr("id", imgBox_Modal);
        modal_modal.attr("role", "dialog");
        modal_modal.attr("aria-labelledby", "myModalLabel");
        modal_modal.attr("aria-hidden", "true");

        modal_dialog.addClass("modal-dialog");
        modal_dialog.attr("id", imgDialog_Modal);
        modal_content.addClass("modal-content");
        modal_header.addClass("modal-header");
        //<div class="modal-header">
        //        <button class="close" type="button" data-dismiss="modal">
        //            <span>×</span>
        //        </button>
        //        <h3 class="modal-title">考核结果录入</h3>
        //    </div>
        var closeButton = $("<button>").addClass("close");
        closeButton.attr("type", "button");
        closeButton.attr("data-dismiss", "modal");
        var closeSpan = $("<span>").text("×")
        closeButton.append(closeSpan);
        //modal_header.append(closeButton);
        var titile_h3 = $("<h2>");
        titile_h3.text("图片查看");
        modal_header.append(titile_h3);
        modal_body.addClass("modal-body");
        modal_body.height(height + 500);
        modal_body.attr("id", imgBody_Modal);



        modal_footer.addClass("modal-footer no-margin-top right");

        footer.attr("style", "height:50px;");
        initFoot(modal_footer);
        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);



        modal_dialog.append(modal_content);

        modal_modal.append(modal_dialog);
        $("body").append(modal_modal);
        //看图片的model 加入到 控件层内部
        // box.append(modal_modal);
        //box.append(modal);
    }
    //显示查看图片的model
    function showImg(a) {
        var modal_div_prev = $("<div>");
        var modal_div_next = $("<div>");
        var modal_prev = $("<li>");
        var modal_next = $("<li>");

        modal_prev.addClass("ace-icon fa fa-chevron-left fa-3x");
        modal_prev.attr("style", "cursor:pointer;");
        modal_prev.on("click", function () { imgPrev(a) });
        //modal_prev.append("<li class='icon-chevron-left icon-3x'>");        
        modal_div_prev.attr("style", "position:absolute;");
        modal_div_prev.attr("id", div_prev);
        modal_div_prev.append(modal_prev);

        modal_next.addClass("ace-icon fa fa-chevron-right fa-3x");
        modal_next.attr("style", "cursor:pointer;");
        modal_next.on("click", function () { imgNext(a) });
        //modal_next.append("<li class='icon-chevron-right icon-3x'>");
        modal_div_next.attr("style", "position:absolute;");
        modal_div_next.attr("id", div_next);
        modal_div_next.append(modal_next);

        var img = $("<img>");
        img.attr("src", a.find("img").attr("src"));

        img.attr("title", a.attr("title"));
        img.on("click", function () { imgNext(a) });


        $("#" + imgBody_Modal).html("");
        $("#" + imgBody_Modal).append(img);
        $("#" + imgBody_Modal).append(modal_div_prev);
        $("#" + imgBody_Modal).append(modal_div_next);

        resetImgHeightAndWidth();
    }

    //重新调整图片大小
    function resetImgHeightAndWidth() {

        var img = $("#" + imgBody_Modal).find("img");
        if (img.is(":visible")) {
            var imgheight = img.height();
            var imgwidth = img.width();

            var modalheight = $(window).height() - 265;
            var modalwidth = 1000;
            var maxWidth = 800;

            imgwidth = imgwidth > maxWidth ? maxWidth : imgwidth;
            imgheight = imgheight > modalheight ? modalheight : imgheight;

            $("#" + imgDialog_Modal).attr("style", "width:" + modalwidth + "px;height:" + modalheight + "px;margin-top:100px;");
            $("#" + imgBody_Modal).attr("style", "width:" + modalwidth + "px;height:" + modalheight + "px;padding:0px;");

            var marginTop = modalheight / 2 - imgheight / 2;
            var marginLeft = modalwidth / 2 - imgwidth / 2;
            //$("#modal_close_id").attr("style", "position:absolute;margin-top:0px;margin-left:" + (modalwidth + $("#imgBody_Modal").offset().left - 2) + "px;");
            img.attr("style", "margin-top:" + marginTop + "px;margin-left:" + marginLeft + "px;width:" + imgwidth + "px;height:" + imgheight + "px;");
            $("#" + div_prev).attr("style", "position:absolute;margin-top:" + (-imgheight / 2 - 30) + "px;margin-left:50px;");
            $("#" + div_next).attr("style", "position:absolute;margin-top:" + (-imgheight / 2 - 30) + "px;margin-left:" + (modalwidth - 80) + "px;");
        } else {
            setTimeout(function () { resetImgHeightAndWidth() }, 200);
        }

    }

    function imgPrev(a) {
        var a_Prev = a.parent().prev().find("a");
        if (a_Prev.length > 0) {
            showImg(a_Prev);
        } else {
            showImg(a.parent().parent().find("li:last").find("a"));
        }
    }

    function imgNext(a) {
        var a_Next = a.parent().next().find("a");
        if (a_Next.length > 0) {
            showImg(a_Next);
        } else {
            showImg(a.parent().parent().find("li:first").find("a"));
        }
    }
    //通过filekey得到menu的txt
    function GetTXTByFileKey(fileKey) {
        for (var i = 0; i < menu.length; i++) {
            var menuItem = menu[i];
            if (menuItem.fileKey == fileKey) {
                return menuItem.txt;
            }
        }
        return fileKey;
    }
    //加载图片List
    function initLoadImgList() {
        if (!imgList) {
            return false;
        }
        for (var j = 0; j < imgList.length; j++) {
            var filekey = imgList[j].fileKey;
            var txt = GetTXTByFileKey(filekey);
            var fileId = imgList[j].Id;

            var li = $("<li>");
            var a = $("<a>");
            var img = $("<img>");
            var remove = $("<div>");
            var a_remove = $("<a>");
            var i_remove = $("<i>");

            a.attr("href", "#");
            a.attr("title", txt);
            a.attr("data-toggle", "modal")
            a.attr("data-target", "#" + imgBox_Modal)
            a.on("click", function () { showImg($(this)) });
            var imgpath = getImgUrl + "?imgId=" + fileId;
            img.attr("src", imgpath);
            img.attr("name", filekey);
            img.attr("style", "width:150px;height:150px");

            remove.addClass("tools tools-bottom");
            remove.attr("style", "bottom:0px");
            a_remove.attr("href", "#");
            a_remove.attr("fileName", txt)
            a_remove.attr("fileId", fileId)
            a_remove.on("click", function () {
                var result = removeImg_CallBack($(this).attr("fileId"));
                if (result) {
                    $(this).parent().parent().remove()
                }
            });
            i_remove.addClass("ace-icon glyphicon glyphicon-remove red small");


            a.append(img);
            a_remove.append(i_remove);

            if (edit) {
                remove.append(a_remove);
            }
            remove.append("<span class='white'>" + txt + "</span>");

            li.append(a);
            li.append(remove);
            // li.append('<input type="hidden" lastname="' + data[j].fileName + '">');
            thumbnails.append(li)
        }

    }
    //生成Guid
    var newGuid = function () {
        var i, n;
        return ((function () {
            var j, results;
            results = [];
            for (i = j = 1; j <= 32; i = ++j) {
                n = Math.floor(Math.random() * 16.0).toString(16);
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                    results.push(n += "-");
                } else {
                    results.push(n);
                }
            }
            return results;
        })()).join("");
    };
}