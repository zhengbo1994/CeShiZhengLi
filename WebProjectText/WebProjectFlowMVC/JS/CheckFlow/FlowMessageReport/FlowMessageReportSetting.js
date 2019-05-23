// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-报文质量分析表设置
 * 文件类型：FlowMessageReportSetting.js
 * 作    者：张敏强
 * 时    间：2014-8-18
 */
var pareArg = {};
$(function ()
{
    var url = "VFlowMessageReportSetting.aspx",
        $hidField = $("#hidFields"),
        $btnSaveClose = $("#btnSaveClose"),
        $btnSave = $("#btnSave"),
        $divFlowType = $("#divFlowType"),
        bSubmitting = false,
        $ddlFieldName = $("select.ddl-fieldname"),                   // 字段选择
        $tdFlowType = $("td.td-flowtype"),
        curCorpID = "",
        arrFieldSetting = [];

    // 所有列信息
    var objField = (new Function("return " + $hidField.val()))();

    if (objField)
    {
        var html = "";
        $.each(objField, function (i, value)
        {
            html += "<option value='" + value.FMRFID + "'>" + value.FieldName + "</option>";
        });

        $ddlFieldName.append(html);
    }

    var $curFieldName = null;

    // 获得焦点 
    $divFlowType.on("focus", ".txt-fieldname", function ()
    {
        var curFMRFID = $(this).prev().val();
        if ($curFieldName)
        {
            $curFieldName.val($ddlFieldName.find(":selected").text()).show();
            $curFieldName.prev().val($ddlFieldName.val());
        }
        var $td = $(this).hide()
                    .parent().append($ddlFieldName);

        if ($ddlFieldName.find("option[value='" + curFMRFID + "']").length == 0)
        {
            curFMRFID = "";
        }

        $ddlFieldName.val(curFMRFID).show().trigger("focus");
        $curFieldName = $(this);
    });

    $divFlowType.on("blur", ".ddl-fieldname", function ()
    {
        $(this).hide().prev().show();
        $tdFlowType.append(this);
    });

    $divFlowType.on("change", ".ddl-fieldname", function ()
    {
        var $tr = $(this).closest("tr"),
            that = this,
            selValue = $(this).val(),
            selText = $(this).find(":selected").text();

        // 保留当前值
        $(this).prev().val(selText)
            .prev().val(selValue);

        // 改变子类别的值
        $divFlowType.find("tr[id^='" + $tr.attr("id") + ".']").each(function ()
        {
            var $input = $(this).find(":input");

            $input.eq(0).val(selValue);
            $input.eq(1).val(selText);
        })
    });

    $("#btnSaveClose").click(function ()
    {
        saveSetting(true);
    });

    $("#btnSave").click(function ()
    {
        saveSetting(false);
    });

    var getMessageReportSetting = function (corpID)
    {
        curCorpID = corpID;
        if (!bSubmitting)
        {
            bSubmitting = true;
            ajax(url, { Action: "GetMessageReportSetting", CorpID: corpID }, "json", function (data)
            {
                bSubmitting = false;

                if (data.Success == "Y")
                {
                    $divFlowType.html(data.Data);
                }
                else
                {
                    alert(data.Data);
                }
            });
        }
    }

    var saveSetting = function (bClose)
    {
        var arrFieldSetting = [];
        setBtnEnabled($btnSaveClose, false);
        setBtnEnabled($btnSave, false);

        if (!$ddlFieldName.is(":hidden"))
        {
            $ddlFieldName.trigger("blur");
        }

        $divFlowType.find(":hidden").each(function (i)
        {
            var objFieldSetting = {};
            if (this.value)
            {
                objFieldSetting.FMRFID = this.value;
                objFieldSetting.FlowTypeID = $(this).closest("tr").attr("flowtypeid");
                objFieldSetting.RowNo = i + 1;

                arrFieldSetting.push(objFieldSetting);
            }
        });

        ajax(url, { Action: "SaveSetting", CorpID: curCorpID, FieldSetting: $.jsonToString(arrFieldSetting) }, "json", function (data)
        {
            setBtnEnabled($btnSaveClose, true);
            setBtnEnabled($btnSave, true);

            if (data.Success == "Y")
            {
                alert(data.Data);
                if (bClose)
                {
                    closeMe();
                }
            }
            else
            {
                alert(data.Data);
            }
        });
    }

    pareArg.getMessageReportSetting = getMessageReportSetting;
})