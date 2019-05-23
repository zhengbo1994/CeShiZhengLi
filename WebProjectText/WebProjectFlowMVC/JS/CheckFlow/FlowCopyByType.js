// VFlowCopyByCorp.aspx的js

var currentCursor;

// 切换公司（opt：1:切换源公司/2:切换目标公司/3:切换替换岗位公司）
function changeSourceCorp()
{
    var eventObj = getEventObj();
    var corpID = eventObj.value;
    var ddlType = $('#ddlSourceType')[0];
    getCorpType(corpID, function (data)
    {
        loadDDLType(ddlType, data, function () { changeSourceType() });
    });
}

// 切换目标公司
function changeTargetCorp()
{
    var eventObj = getEventObj();
    var corpID = eventObj.value;
    var ddlType = $('#ddlTargetType')[0];
    getCorpType(corpID, function (data)
    {
        loadDDLType(ddlType, data);
        $('#ddlCorp').val(corpID);
        changeStationCorp();
    });
}

// 加载流程类别下拉框
function loadDDLType(ddlType, responseData, onchange)
{
    if (ddlType && responseData)
    {
        if (responseData.Success == "Y")
        {
            var ddl = $(responseData.Data);
            ddlType = $(ddlType);
            ddlType.empty().append(ddl.children());
            
            if (typeof onchange == 'function')
            {
                ddlType.bind('change', onchange);
            }
        }
        else
        {
            ddlType.innerHTML = "";
            addOptionAt(ddlType, '', "请选择", 0);
        }
    }
}

// 切换替换岗位公司
function changeStationCorp()
{
    var corpID = $('#ddlCorp').val();
    if (corpID == "-1")
    {
        $("#div3").html("");
        return;
    }
    setAjaxContainer("div3");
    ajax(document.URL, { "Action": "GetCorpStation", "CorpID": corpID }, "json", function (data)
    {
        if (data.Success == "Y")
        {
            $("#div3").html(data.Data);
            if ($("#div3 a").length)
            {
                $("#div3 span").each(function ()
                {
                    $(this).on("click", clickTGImg);
                });
                $("#div3 a").each(function ()
                {
                    $(this).attr("href", "javascript:void(0)").on("mouseover", function ()
                    {
                        $(this).css("background-color", "#a7cdf0");
                    }).on("mouseout", function ()
                    {
                        $(this).css("background-color", "");
                    }).on("click", function ()
                    {
                        if (currentCursor)
                        {
                            if (!currentCursor.previousSibling && !currentCursor.nextSibling)
                            {
                                var cursor = getCursor();
                                $(cursor).insertAfter($(stringFormat('<span sid="{0}">{1}</span>', $(this).attr("sid"), $(this).text())).insertAfter(currentCursor));
                                cursor.focus();
                            }
                        }
                        else
                        {
                            alert("请选择要替换的源公司流程岗位。");
                        }
                    });
                });
            }
            else
            {
                $("#div3").html('<div class="promptmsg">该公司无任何岗位。</div>');
            }
        }
        else
        {
            alert(data.Data);
        }
    });
}

// 获取公司下的流程类别
function getCorpType(corpID, callback)
{
    var url = getCurrentUrl();
    ajax(url, { "Action": "GetCorpFlowType", "CorpID": corpID }, "json", function (data)
    {
        if (typeof callback == 'function')
        {
            callback(data);
        }
    });
}

// 切换源类别
function changeSourceType()
{
    var flowTypeID = getEventObj().value;
    currentCursor = null;

    if (flowTypeID)
    {
        ajax(document.URL, { "Action": "GetTypeFlowStation", "FlowTypeID": flowTypeID }, "json", function (data)
        {
            if (data.Success == "Y")
            {
                $("#div1").html(data.Data);
                if ($("#div1 div").length)
                {
                    $("#div1 span").each(function ()
                    {
                        if ($(this).attr("isdelete") == "Y")
                        {
                            $(this).css("color", "#999999");
                        }
                        $(this).on("click", function ()
                        {
                            switch ($(this).attr("stype"))
                            {
                                case "S":
                                    $("div", $(this).parent().next()).trigger("click");
                                    break;
                                default:
                                    clickTGImg();
                                    break;
                            }
                        });
                    });
                    $("#div1 div").each(function (i)
                    {
                        $(this).addClass("text").on("click", function (event)
                        {
                            if ((event.srcElement || event.target).nodeName == "DIV")
                            {
                                var lastCursor = this.lastChild;
                                if (!lastCursor)
                                {
                                    lastCursor = getCursor();
                                    this.appendChild(lastCursor);
                                }
                                lastCursor.focus();
                            }
                        });
                        if (i == 0)
                        {
                            $(this).trigger("click");
                        }
                    });
                }
                else
                {
                    $("#div1").html('<div class="promptmsg">该类别下无任何流程或其流程上无岗位。</div>');
                }
            }
            else
            {
                alert(data.Data);
            }
        });
    }
    else
    {
        $("#div1").html("");
    }
}

// 获取光标
function getCursor()
{
    return document.createElement('<input style="width:10px;height:17px;text-align:center;border:0" onfocus="focusCursor()" onkeydown="return triCursor()" />');
}

// 光标获取焦点
function focusCursor()
{
    if (currentCursor)
    {
        currentCursor.style.background = '';
    }
    currentCursor = getEventObj();
    currentCursor.style.background = 'url(../../Image/form/cursor.gif) no-repeat bottom';
}

// 光标操作事件
function triCursor()
{
    var cursor = getEventObj();
    var divStation = getParentObj(cursor, "div");
    switch (event.keyCode)
    {
        // Tab键（允许）
        case 9:
            break;
            // Hmoe/End键（35:End/36:Home） 
        case 35:
        case 36:
            (event.keyCode == 35 ? divStation.lastChild : divStation.firstChild).focus();
            break;
            // 左右方向键（37:←/39:→）
        case 37:
        case 39:
            var cursors = divStation.getElementsByTagName("input");
            for (var i = 0; i < cursors.length; i++)
            {
                if (cursors[i] == cursor && (event.keyCode == 37 && i > 0 || event.keyCode == 39 && i < cursors.length - 1))
                {
                    cursors[i + (event.keyCode == 37 ? -1 : 1)].focus();
                    break;
                }
            }
            break;
            // 删除键（退格:Backspace/删除:Delete） 
        case 8:
        case 46:
            var delCursor = (event.keyCode == 8 ? cursor.previousSibling : cursor.nextSibling);
            if (delCursor)
            {
                cursor.parentNode.removeChild(delCursor);
                delCursor = (event.keyCode == 8 ? cursor.previousSibling : cursor.nextSibling);
                if (delCursor)
                {
                    cursor.parentNode.removeChild(delCursor);
                }
            }
            break;
            // 屏蔽其他键
        default:
            return false;
            break;
    }
    return true;
}

// 提交校验/保存
function saveFlowCopy()
{
    var sourceTypeId = $('#ddlSourceType').val(), targetTypeId = $('#ddlTargetType').val(),
        sourceStationIds = [], targetStationIds = [];
    if (!sourceTypeId)
    {
        return alertMsg('请选择复制的源类别。');
    }
    if (!targetTypeId)
    {
        return alertMsg('请选择复制到的目标类别。');
    }
    if (sourceTypeId == targetTypeId)
    {
        return alertMsg('目标类别和源类别不能相同。');
    }
    $("#div1 div").each(function ()
    {
        var sId = $(this).attr("sid");
        var tId = $("span", this).attr("sid");
        if (sId && tId && $.inArray(sId, sourceStationIds) == -1)
        {
            sourceStationIds.push(sId);
            targetStationIds.push(tId);
        }
    });

    if (confirm("复制流程会清空目标类别下所有的流程和子级流程类别。\n\n确定要复制流程吗？"))
    {
        var data =
            {
                "Action": "SubmitFlowCopy",
                "SourceTypeID": sourceTypeId,
                "TargetTypeID": targetTypeId,
                "IsCopyAllow": ($("#rblIsCopyAllow :checked").val() == "Y"),
                "IsCopyLook": ($("#rblIsCopyLook :checked").val() == "Y"),
                "IsCopyForm": ($("#rblIsCopyForm :checked").val() == "Y"),
                "IsCopyFilter": ($("#rblIsCopyFilter :checked").val() == "Y"),
                "IsCopyPoint": ($("#rblIsCopyPoint :checked").val() == "Y"),
                "SourceStationID": sourceStationIds.join(','),
                "TargetStationID": targetStationIds.join(',')
            };
        ajax(document.URL, data, "json", function (data) { alert(data.Data); });
    }
}