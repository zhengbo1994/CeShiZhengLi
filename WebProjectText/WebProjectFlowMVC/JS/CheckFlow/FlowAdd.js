
var $pointObj = {};
jQuery(function ($)
{
    ddlFlowModelChangeAndCheckType();

    if ($('#hidShowModelFile').val() != '')
    {
        $("input[name='ShowModelFile'][value='" + $('#hidShowModelFile').val() + "']").attr('checked', true);
    }

    allowRight();

    setVisible('areaRight', 'trRight');

    //审核要点设置
    $("#divDL img.img-humen").click(function ()
    {
        $pointObj = {};
        $pointObj.$pointImg = $(this); //头像
        $pointObj.$pointItem = $(this).siblings().eq(1); //该审批人的审批要点信息
        $pointObj.$pointHuman = $(this).siblings().eq(0); //审批人ID
        $pointObj.$pointInfo = $(this).closest("span").siblings().eq(0); //该环节信息
        $pointObj.$pointType = $(this).closest("span").siblings().eq(1); //该环节审批要点类别，只能是同一类别
        $pointObj.tachType = $(this).closest("span").find("table").size() > 1 ? "P" : "O"; //P:并环;O:串环

        openModalWindow("../../CheckFlow/CheckPoint/VCheckPointSelect.aspx", 800, 600);
        arguments[0].stopPropagation();
        return false;
    });

    //是否显示监控设置
    $("#rdlIsUseList").click(function ()
    {
        showControlSetting(this);
    });

    var showControlSetting = function (obj)
    {
        var $chk = $(obj).find(":radio:checked");
        if ($chk.val() == "Y")
        {
            $("#trControlSetting").show();
        }
        else
        {
            $("#trControlSetting").hide();
        }
    }
    showControlSetting($("#rdlIsUseList")[0])

    var strCorpID = $("#hidCorpID").val();
    //监控设置表的事件委托
    $("#tbControlSetting").click(function (event)
    {
        if (event.target.type && event.target.type.toUpperCase() == "BUTTON")
        {
            showModal(event.target);
            event.stopPropagation();
        }
    });

    var showModal = function (jObj)
    {
        var $tr = $(jObj).closest("tr");
        $pointObj.$curInputs = $tr.find(":input"); //关联全局变量，以备打开的模式窗口调用

        var value = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=ContSetting&CorpID=' + strCorpID, 1000, 700);
        if (value)
        {
            var $chk = $(jObj).closest("table").closest("tr").find(":checkbox");
            if (!$chk.is(":checked"))
            {
                $chk.attr("checked", true);
            }
        }
    }

    // 环节抄送人员设置
    if (tdTaches)
    {
        $("#" + tdTaches).click(function (event)
        {
            if (event.target.type && event.target.type.toUpperCase() == "BUTTON")
            {
                showModal(event.target);
                event.stopPropagation();
            }
        }).mouseover(function (event)
        {
            if (event.target.id && event.target.id.indexOf("txtCopyReadName") != -1)
            {
                if (!event.target.title)
                {
                    $(event.target).attr("title", event.target.value);
                }

                event.stopPropagation();
            }
        });
    }
});

function ShowModelFileChange()
{
    $('#hidShowModelFile').val($("input[name='ShowModelFile'][checked=true]").val());
}

function showCheckPersons(tachNo)
{
    document.all.hidInsertIndex.value = tachNo;
    document.all.btnBindCheckPersons.click();
}