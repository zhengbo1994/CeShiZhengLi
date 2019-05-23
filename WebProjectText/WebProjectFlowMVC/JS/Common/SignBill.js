// SignBill.aspxSignBillContent.aspx、SignBillContent.aspx的js

// 打印会签单，并记录打印次数
function printBill()
{
    execFrameFuns("Main", function ()
    {
        frames("Main").focus();
        //处理6月13日，微软发布的几个IE11的累计安全更新补丁，会造成EAP打印会签单为空白页的问题。 add by linshuling 20170619
        frames("Main").document.execCommand('print', false, null)
        //frames("Main").printPage();
        var spCnt = getObjF("Main", "spPrintCnt");
        if (spCnt)
        {
            ajax(frames("Main").location.href, { "Action": "SavePrintCnt", "CCTitle": $("#lblCCTitle", frames("Main").document).text() }, "json", function (data)
            {
                if (data.Success == "Y")
                {
                    var spCnt = getObjF("Main", "spPrintCnt");
                    spCnt.innerText = parseInt(spCnt.innerText, 10) + 1;
                    frames("Main").showhlPrintRecord();
                }
                else
                {
                    alert(data.Data);
                }
            });
        }
    }, window);
}

// 查看打印记录
function showPrintRecord()
{
    ajax(document.URL, { "Action": "GetPrintRecord" }, "json", function (data)
    {
        if (data.Success == "Y")
        {
            window["DialogID"] = showDialog(
                {
                    "title": "会签单打印记录",
                    "html": data.Data,
                    "width": 500,
                    "height": 350,
                    "id": window["DialogID"]
                });
            $("#" + window["DialogID"] + "_f").html(data.Data);
        }
        else
        {
            alert(data.Data);
        }
    });
}

//生成二维码
function codeGenerator()
{
    var content = $("#hidQRCode").val();
    if(content)
    {
        var qrcode = new QRCode(document.getElementById("tdQRCode"), {
            width: 64,//设置宽高
            height: 64
        });
        qrcode.makeCode(content);
    }
}

// 设置表单格式
function formatForm()
{
    codeGenerator();
    // 第一级表格强制宽度100%
    $("#trForm table:not(#trForm table table),#trDocFormat table:not(#trDocFormat table table)").css({ "width": "100%", "margin": "0" });

    // 所有单元格宽度设为百分比
    $("#trForm table:not([field]),#trDocFormat table:not([field])").each(function ()
    {
        var table = $(this);
        var tbWidth = table.width();

        table.find(">tbody>tr>td,>tr>td").width(function ()
        {
            return getPercentNum($(this).width() / tbWidth, 2);
        });
    });

    // 宽度过大的非第一级表格强制宽度auto
    $("#trForm table table,#trDocFormat table table").each(function ()
    {
        $(this).width() > $("#tbForm").css("pixelWidth") && $(this).width("auto");
    });

    // 大图片缩小为合适的尺寸
    $("#trDocFormat img").hide().each(function ()
    {
        var img = $(this), pimg = img.parent(), w = img.width(), h = img.height(), pw = pimg.width();
        if (pw === 0)
        {
            var pdisp = pimg.css("display");
            pimg.css("display", "block");
            pw = pimg.width();
            pimg.css("display", pdisp);
        }

        w > pw && img.width(pw) && img.height(h * pw / w);
    }).show();

    // 去除表单控件的父容器的不合理宽度
    $(":text.fm_text,textarea.fm_textarea,textarea.fm_textarea2,div.form_time_div,table.fm_dt_table,table.fm_sub_table,select.font").filter("[field]").each(function ()
    {
        var p = $(this).parent();
        while (p.length && !p.is("td") && p.attr("id") !== "tbForm")
        {
            var pxWidth = p.css("pixelWidth"), clWidth = p.width();
            pxWidth && pxWidth < clWidth && p.css("width", "auto");
            p = p.parent();
        }
    });

    // 显示打印记录超链
    showhlPrintRecord();
}

// 显示打印记录超链
function showhlPrintRecord()
{
    var cnt = $("#spPrintCnt").text();
    if (cnt && $("#spName").length && parseInt(cnt, 10) > 1)
    {
        $("#hlPrintRecord").show();
    }
}