// VSelectCP.aspx的js

// 初始化页面
function initPage()
{
    window["idPager_CallBack"] = setSelectStatus;

    if (!window["CP_Designer"])
    {
        loadCP();
    }
}

// 加载要点
function loadCP()
{
    var span = getObj("span_0");
    if (span)
    {
        span.click();
        window["Loaded"] = true;
    }
}

// 显示要点列表
function showCPList(span, cptID)
{
    clickTreeNode(span);

    window["CPTID"] = cptID;
    window["CPTName"] = span.innerText;
    reloadCP();
}

// 加载要点
function reloadCP()
{
    var query = { "CPTID": window["CPTID"], "KW": $("#txtKW").val() };

   reloadGridData("idPager", query);
}

// 设置选中状态
function setSelectStatus()
{
    var cps = window["CP_Designer"];
    var cpsIsNull = $.isEmptyObject(cps);

    $("#idPager_Box span.promptmsg[value]").each(function ()
    {
        var sp = $(this);
        var cpid = sp.val();
        if (cpsIsNull || !cps[cpid])
        {
            sp.closest("td").html('<input onclick="selectRow(this)" id="chkIDV3" class="idbox" type="checkbox" value="' + cpid + '" />');
        }
    });
    if (!cpsIsNull)
    {
        $("#idPager_Box :checkbox[value]").each(function ()
        {
            var chk = $(this);
            var cpid = chk.val();
            if (cps[cpid])
            {
                chk.closest("td").html('<span class="promptmsg" value="' + cpid + '">已选</span>');
            }
        });
    }
}

// 新增要点
function addCP()
{
    var cptid = window["CPTID"];
    if (!cptid)
    {
        return alertMsg("请点击选择窗口左侧的一个要点类别。");
    }

    showDialog(
        {
            "title": "审批要点新增",
            "html": $("#scAddCP").html(),
            "width": 400,
            "height": 220,
            "id": "dlgCP"
        }, function ()
        {
            $("#dlgCP #txtCPTName").val(window["CPTName"]);
            $("#dlgCP #txtCPDesc")[0].focus();
        });
}

// 提交新增
function submitAddCP(isClose)
{
    var txtCPDesc = $("#dlgCP #txtCPDesc");
    var txtRowNo = $("#dlgCP #txtRowNo")
    if (trim(txtCPDesc.val()) == "")
    {
        return alertMsg("要点描述不能为空。", txtCPDesc);
    }
    if (txtRowNo.val() == "")
    {
        return alertMsg("行号不能为空。", txtRowNo);
    }

    ajax(document.URL, { "CPTID": window["CPTID"], "CheckPointDesc": trim(txtCPDesc.val()), "RowNo": txtRowNo.val() }, "json", function (data)
    {
        if (data.Success === "Y")
        {
            reloadCP();

            $("#dlgCP #txtCPDesc").val("");
            $("#dlgCP #txtRowNo").val("");

            if (isClose)
            {
                closeDialog("dlgCP");
            }
        }
        else
        {
            alert(data.Data)
        }
    });
}

// 接收并暂存要点集合
function acceptCP(cps)
{
    var i = 0;
    window["CP_Designer"] = cps;
    if (!window["Loaded"])
    {
        loadCP();
    }
    else
    {
        setSelectStatus();
    }
}

// 选择要点
function selectCP(saveopen)
{
    var cps = window["CP_Designer"];
    if (!cps)
    {
        return alertMsg("上下文丢失，请关闭本窗口重试。");
    }

    var hasSelect = false;
    $("#idPager_Box :checkbox:gt(0):checked").each(function ()
    {
        var chk = $(this);
        var cpid = chk.val();
        var checkpointdesc = chk.closest("td").next().next().text();

        cps[cpid] = { "checkpointdesc": checkpointdesc, "ismustcheck": "N", "ischeck": "N" }
        chk.closest("tr").attr("class", function () { return $(this).index() % 2 === 1 ? 'dg_row' : 'dg_altrow'; });
        hasSelect = true;
    });

    if (!hasSelect)
    {
        return alertMsg("未选择任何审批要点。");
    }
    else
    {
        $("#chkAll").removeAttr("checked");
    }

    if (saveopen)
    {
        setSelectStatus();
    }

    return true;
}