//监控人设置页面
//作者：张敏强
//日期：2013-04-15
var pageArg = {};
$(function ()
{
    //点击当前按钮的表单字段
    var $curInputs = null;
    //设置过的监控人信息
    var controlOper = { ControlOperator: [] };
    //事件监听
    $("#div-Container").click(function (event)
    {
        if (event.target.type && event.target.type.toUpperCase() == "BUTTON")
        {
            showModal(event.target);
        }
    });

    $("#btnSubmit").click(function ()
    {
        if (controlOper.ControlOperator.length > 0)
        {
            var that = this;
            setBtnEnabled(that, false);

            ajax(
                        "FillData.ashx",
                        {
                            "Action": "SaveControlOperator",
                            "SettedInfo": $.jsonToString(controlOper)
                        },
                        "html",
                        function (value)
                        {
                            setBtnEnabled(that, true);
                            controlOper.ControlOperator = [];
                            if (value == "Y")
                            {
                                return alertMsg("保存成功！");
                            }
                            else
                            {
                                return alertMsg(value);
                                reloadGridData("idPager");
                            }
                        },
                        true,
                        "POST"
                    );
        }
    });

    var showModal = function (jObj)
    {
        var $tr = $(jObj).closest("tr");
        var strCorpID = $(jObj).closest("table").closest("tr").attr("corpid");
        $curInputs = $tr.find(":input");
        pageArg.$curInputs = $curInputs; //关联全局变量，以备打开的模式窗口调用

        var value = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=ContOper&CorpID=' + strCorpID, 1000, 700);

        if (value)
        {
            var isRepeat = false;
            $.each(controlOper.ControlOperator, function (value, i)
            {
                if ((value.CorpID + "|" + value.OperatorType).indexOf(strCorpID + "|" + $tr.attr("role")) != -1)
                {
                    controlOper.ControlOperator[i] = {
                        CorpID: strCorpID,
                        OperatorType: $tr.attr("role"),
                        StationIDs: pageArg.$curInputs.eq(0).val()
                    };
                    isRepeat = true;
                    return false;
                }
                return true;
            });

            if (!isRepeat)
            {
                controlOper.ControlOperator.push({
                    CorpID: strCorpID,
                    OperatorType: $tr.attr("role"),
                    StationIDs: pageArg.$curInputs.eq(0).val()
                });
            }
        }
    }
});