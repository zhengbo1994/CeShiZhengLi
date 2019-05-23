//审核要点选择
//作者：张敏强
//日期：2012/08/06
var $pointObj = null;

//是否第一次
var ispost = false;
$(function ()
{
    if ($("#divSelectPoint").size() == 0)
    {
        //文档对象添加
        $("body").append("<div id='divSelectPoint'></div>");
        var strHtml = "<table id='tbPoint' class='table' width='100%' border='0' cellspacing='0'>"
                     + "<tr class='table_headrow'>"
                     + "<td style='width:5%;'>"
                     + "<input onclick='deleteAllRows()' class='idbox' checked type='checkbox' />"
                     + "</td><td style='width:80%'>要点描述</td>"
                     + "<td style='width:15%;'>是否强要点</td>"
                     + "</tr></table>";

        $("#divSelectPoint").append(strHtml);
    }

    //初始化已选审核要点对话框
    $("#divSelectPoint").dialog({
        autoOpen: false,
        width: 600,
        height: 400,
        stack: true,
        create: function (event, ui)
        {
            $(this).dialog("option", "title", "查看已选要点");
        },
        buttons: {
            "关闭": function ()
            {
                $("#divSelectPoint").dialog("close");
            }
        }
    });

    //初始化要点新增模式窗口
    $("#divAddPoint").dialog({
        autoOpen: false,
        width: 600,
        height: 430,
        stack: true,
        create: function (event, ui)
        {
            $(this).dialog("option", "title", "新增审核要点");
        },
        buttons: {
            "取消": function ()
            {
                $("#divAddPoint").dialog("close");
            },
            "提交": function ()
            {
                addPoint(true);
            },
            "提交并新建": function ()
            {
                addPoint(false);
            }
        }
    });

    var objClick = null; //树形类别点击项
    //初始化已选审核要点对话框
    $("#alertMsg").dialog({
        autoOpen: false,
        width: 300,
        height: 200,
        stack: true,
        create: function (event, ui)
        {
            $(this).dialog("option", "title", "请您确认");
        },
        buttons: {
            "取消": function ()
            {
                $("#alertMsg").dialog("close");
            },
            "确定": function ()
            {
                if (objClick != null)
                {
                    changePointType(objClick);
                    $pointObj.$pointType.val(objClick.cptid);
                    $pointObj.$pointImg.closest("span").find("table").each(function ()
                    {
                        var $input = $(this).find("input");
                        if ($input.size() > 1)
                        {
                            $input[1].value = "";
                        }
                    });
                    $("#alertMsg").dialog("close");
                }
            }
        }
    });

    //要点新增
    $("#btnAdd").click(function ()
    {
        if ($("#hidCPTID", window.frames("Main").document).val() == "all")
        {
            return alertMsg("请确定要添加的审核要点类别！");
        }
        $("#divMsg").hide();
        getAddPointInfo();
        $("#divSelectPoint").dialog("close");
        if ($("#divAddPoint").dialog("isOpen"))
        {
            $("#divAddPoint").dialog("close");
        }
        else
        {
            $("#divAddPoint").dialog("open");
            $("#txtDescription").attr("class", "text");
        }
    });
    //接收父页面的对象
    $pointObj = window.dialogArguments.$pointObj;

    //初始化已选
    if ($pointObj.$pointItem.val() != "")
    {
        var strArr = $pointObj.$pointItem.val().split("&");

        if ($("#tbPoint").size() > 0)
        {
            strHtml = "";
            $.each(strArr, function (i, value)
            {
                strHtml += "<tr id='" + value.split("*")[0] + "' title='" + value.split("*")[2]
                        + "'><td style='text-align:center'><input type='checkbox' onclick='selectTR(this)' checked  /></td><td><div class='nowrap' style='width:430px'>" + value.split("*")[2]
                        + "</div></td><td style='text-align:center'><input type='checkbox' onclick='changeMust(this)' " + (value.split("*")[1] == "Y" ? "checked" : "") + "/></td></tr>";
            });
            if (strHtml != "")
            {
                $("#tbPoint").append(strHtml);
                $("#divSelectPoint").dialog("open");
            }
        }
    }

    var $content = $("#div-content");
    var $contentSon = $content.find("span");
    var prevClickSpan = null;
    //初始化审核类别
    $contentSon.click(function ()
    {
        if ($pointObj.$pointType.val() != "" && $pointObj.tachType == "P" && $pointObj.$pointType.val() != this.cptid)
        {
            objClick = this;
            $("#alertMsg").dialog("open");
            return;
        }
        changePointType(this);
    });

    function changePointType(obj)
    {
        if (prevClickSpan == null || prevClickSpan != this)
        {
            $(obj).removeClass("normalNode").addClass("selNode")
            $(prevClickSpan).removeClass("selNode").addClass("normalNode");
            //        $("#div-content").data("ids", { cptid: this.cptid });
            prevClickSpan = obj;
        }
        if (!ispost)
        {
            $("iframe")[0].src = "VCheckPointSelectMain.aspx?CPTID=" + obj.cptid;
            ispost = true;
        }
        else
        {
            $("#hidCPTID", window.frames("Main").document).val(obj.cptid);
            window.frames("Main").window.reloadData(ispost);
        }

        //只能选同一类别的审核要点，改变类别删除之前选择的项
        if ($("#tbPoint").size() > 0 && obj.cptid != $pointObj.$pointType.val())
        {
            $("#tbPoint tr:gt(0)").remove();
        }
    }

    //新增刷新时选中之前所选项
    if ($pointObj.$pointType.val() != "")
    {
        if ($contentSon.filter("[cptid='" + $pointObj.$pointType.val() + "']").size() == 1)
        {
            $contentSon.filter("[cptid='" + $pointObj.$pointType.val() + "']")[0].click();
        }
        else
        {
            $contentSon[0].click();
        }
    }
    else if ($contentSon.size() != 0)
    {
        $contentSon[0].click();
    }

    //选择按钮初始化
    $("#btnChooseClose").click(function ()
    {
        var $div = $("#tbPoint tr:gt(0)");
        var str = "";
        $div.each(function ()
        {
            //&id*text*checked^
            str += "&" + this.id + "*" + ($(this).find("input").eq(1).is(":checked") == true ? "Y" : "N") + "*" + this.title;
        });
        if (str != "")
        {
            str = str.substring(1, str.length);
        }

        $pointObj.$pointType.val($("#hidCPTID", window.frames("Main").document).val());
        $pointObj.$pointItem[0].value = str;

        var strResult = "";
        $pointObj.$pointImg.closest("span").find("table").each(function ()
        {
            var $input = $(this).find("input");
            if ($input.size() > 0)
            {
                strResult += "^" + $input[0].value + "|" + $input[1].value;
            }
        });
        if (strResult != "")
        {
            strResult = strResult.substring(1, strResult.length);
        }
        $pointObj.$pointInfo[0].value = strResult;
        window.returnValue = true;
        window.close();
    });

    //查看
    $("#btnBrowseSelect").click(function ()
    {
        $("#divAddPoint").dialog("close");
        if ($("#divSelectPoint").dialog("isOpen"))
        {
            $("#divSelectPoint").dialog("close");
        }
        else
        {
            $("#divSelectPoint").dialog("open");
        }
        arguments[0].stopPropagation();
        return false;
    });

    //阻止冒泡
    $("#divSelectPoint").parent("div").click(function ()
    {
        arguments[0].stopPropagation();
    });

    //单击页面隐藏
    $(document).click(function ()
    {
        $("#divSelectPoint").dialog("close");
    });

    //修正新增页面字体
    $("#divAddPoint :input").css("font-family", "Tahoma,Arial,Helvetica,'Sans Serif',Sans,'微软雅黑','宋体'").css("font-size", "12px");
    //刷新列表页
    function reloadMainData()
    {
        window.frames("Main").reloadData(ispost);
    }

    //新增审核要点
    var isSend = false;
    function addPoint(isClose)
    {
        if ($("#txtDescription").val() == "")
        {
            $("#divMsg").text("请填写要点描述！").show();
            return;
        }

        if (!/^[^\|"'&<>]*$/.test($("#txtDescription").val()))
        {
            $("#divMsg").text("存在特殊字符！").show();
            return;
        }

        if ($("#txtRowNo").val() == "")
        {
            $("#divMsg").text("行号不能为空！").show();
        }

        if (isSend)
        {
            $("#divMsg").text("正在提交数据，请稍后！").show();
            return;
        }
        else
        {
            isSend = true;
        }

        var arrCheckPoint = [];
        var objCheckPoint = {};

        objCheckPoint.CPTID = $("#hidCPTID", window.frames("Main").document).val();
        //        objCheckPoint.CheckPointName = "";
        objCheckPoint.RowNo = $("#txtRowNo").val();
        objCheckPoint.CheckPointDesc = $("#txtDescription").val();
        arrCheckPoint.push(objCheckPoint);
        try
        {
            ajax(
                    "FillData.ashx",
                    {
                        "Action": "AddCheckPoint",
                        "PointInfo": $.jsonToString(arrCheckPoint)
                    },
                    "html",
                    function (value)
                    {
                        isSend = false;
                        if (value == "Y")
                        {
                            $("#divMsg").text("新增成功！").show();

                            $("#txtRowNo").val("");
                            $("#txtDescription").val("");
                            getAddPointInfo();
                            if (isClose)
                            {
                                $("#divAddPoint").dialog("close");
                            }
                            reloadMainData();
                        }
                        else if (value == "repeat")
                        {
                            $("#divMsg").text("名称重复！").show();
                            $("#txtDescription").trigger("fucos");
                        }
                        else
                        {
                            $("#divMsg").text("新增失败！").show();
                        }
                    },
                    true,
                    "POST"
                );
        }
        catch (e)
        {
            isSend = false;
        }
    }

    //新增要点上获取行号和类别
    function getAddPointInfo()
    {
        ajax(
            "FillData.ashx",
            {
                "Action": "GetAddPointInfo",
                "tableName": "CheckFlowDB.dbo.TCheckPoint",
                "strFilter": "WHERE IsDelete='N' AND CPTID='" + $("#hidCPTID", window.frames("Main").document).val() + "'",
                "CPTID": $("#hidCPTID", window.frames("Main").document).val()
            },
            "html",
            function (value)
            {
                if (value != "")
                {
                    $("#txtRowNo").val(value.split("|")[0]);
                    $("#txtCPTName").val(value.split("|")[1]);
                }
            },
            true,
            "POST"
        );
    }

    //搜索
    $("#btnSearch").click(function ()
    {
        window.frames("Main").reloadData();
    });
});

//取消已选项
function selectTR(obj)
{
    var $tr = $(obj).closest("tr");
    if ($("#" + $tr[0].id, window.frames("Main").document).size() > 0)
    {
        $("#" + $tr[0].id, window.frames("Main").document).trigger("click");
    }
    $tr.remove();
}

//是否强要点设置
function changeMust(obj)
{
    var $tr = $(obj).closest("tr");
    if ($("#" + $tr[0].id, window.frames("Main").document).size() > 0)
    {
        if ($(obj).attr("checked"))
        {
            $("#" + $tr[0].id, window.frames("Main").document).find("input").eq(1).attr("checked", true);
        }
        else
        {
            $("#" + $tr[0].id, window.frames("Main").document).find("input").eq(1).attr("checked", false);
        }
    }
}

//框架调用
function closeDialog()
{
    $("#divSelectPoint").dialog("close");
}

function deleteAllRows()
{
    $("#tbPoint tr:gt(0)").each(function ()
    {
        $(this).find(":checkbox").eq(0).trigger("click");
    });
}

