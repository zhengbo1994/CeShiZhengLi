//刷新数据
function reloadData()
{
    var type = getObj("ddlProtalType").value;
    var vKey = $("#txtKey").val();
    $('#jqGrid1', document).getGridParam('postData').PPTID = type;
    $('#jqGrid1', document).getGridParam('postData').Key = vKey;
    $('#jqGrid1').trigger('reloadGrid');
}

//----------------------------------选择---------------------start

var btnChoose_Click = function ()
{
    // edit by zhangmq 20150316 个人门户添加多选
    if (getParamValue("ProtalType") === "0")
    {
        var lstPortals = getObj("lstPortals"),
            ppids = [],
            ppNames = [];

        btnAdd_Click();

        for (var i = 0; i < lstPortals.length; i++)
        {
            ppids.push(lstPortals.options[i].value);
            ppNames.push(lstPortals.options[i].text);
        }

        window.returnValue = {
            PPID: ppids.toString(","),
            PPName: ppNames.toString("，")
        };

        window.close();
    }
    else
    {
        var ppid = getJQGridSelectedRowsID('jqGrid1', false);

        if (ppid == null || ppid == "")
        {
            return alertMsg("请选择门户页。", getObj("btnChoose"));
        }
        var obj = new Object();
        obj.PPID = ppid;
        obj.PPName = stripHtml(getJQGridSelectedRowsData('jqGrid1', false, 'PPName'));
        window.returnValue = obj;
        window.close();
    }
}

//清除
function btnClear_Click()
{
    if (getObjD("hidPPID"))
    {
        getObjD("txtPPName").value = "";
        getObjD("hidPPID").value = "";
    }

    // 清空选择项 edit by zhangmq 20150324
    var eventSrc = window.dialogArguments.eventSrc;

    if (eventSrc)
    {
        var $input = $(eventSrc).closest("tr").find(":input");

        if ($input.length > 1 && $input.eq(1).val())
        {
            $input.eq(1).val("");
            $input.eq(0).val("");
        }
    }

    window.returnValue = null;
    window.close();
}


//--------------------------------------------------------------------end

function btnAdd_Click()
{
    var ppids = getJQGridSelectedRowsID('jqGrid1', true),
        lstPortals = getObj("lstPortals"),
        ppNames = getJQGridSelectedRowsData('jqGrid1', true, 'PPName'),
        repeat = false;

    if (ppids === null || ppids === "")
    {
        return alertMsg("请选择门户页。", $("#btnAdd"))
    }

    for (var i = 0; i < ppids.length; i++)
    {
        for (j = 0; j < lstPortals.length; j++)
        {
            if (lstPortals.options[j].value === ppids[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && ppids != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = ppids[i];
            opt.text = $.jgrid.stripHtml(ppNames[i]);
            lstPortals.add(opt, lstPortals.length);
        }
    }
}


function btnDel_Click()
{
    var lstPortals = getObj("lstPortals");
    for (i = lstPortals.options.length - 1; i >= 0; i--)
    {
        if (lstPortals.options[i].selected)
        {
            lstPortals.remove(i);
        }
    }
}

function btnDelAll_Click()
{
    var lstPortals = getObj("lstPortals");
    for (var i = lstPortals.options.length - 1; i >= 0; i--)
    {
        lstPortals.remove(i);
    }
}

function btnAddAll_Click()
{
    var lstPortals = getObj("lstPortals");

    var ppids = getJQGridAllRowsID('jqGrid1');
    var ppNames = getJQGridAllRowsData('jqGrid1', 'PPName');

    if (ppids.length == 0)
    {
        return;
    }

    for (var i = 0; i < ppids.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstPortals.length; j++)
        {
            if (lstPortals.options[j].value == ppids[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && ppids[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = ppids[i];
            opt.text = $.jgrid.stripHtml(ppNames[i]);

            lstPortals.add(opt, lstPortals.length);
        }
    }
}

function move(to)
{
    var list = getObj("lstPortals");
    var total = list.options.length - 1;
    var index = getObj("lstPortals").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;

    //临时保存选项的值
    var text = list.options[index].text;
    var value = list.options[index].value;

    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;

    //选中索引也跟着变
    list.selectedIndex = index + to;
    list.focus();
}

// 双击
function jqGridDblClick(rowid, iRow, iCol, e)
{
    var lstPortals = getObj("lstPortals"),
        $jqGrid1 = $("#jqGrid1"),
        ppid = rowid,
        ppName = $jqGrid1.getRowData(rowid)['PPName'];

    if (lstPortals && $(lstPortals).find("option[value='" + ppid + "']").length <= 0)
    {
        var opt = document.createElement("option");
        opt.value = ppid;
        opt.text = $.jgrid.stripHtml(ppName);

        lstPortals.add(opt, lstPortals.length);
    }
}

$(function ()
{
    // edit by zhangmq 个人门户选择
    if (getParamValue("ProtalType") === "0")
    {
        $(".PersonPortal").show();

        var eventSrc = window.dialogArguments.eventSrc;

        if (eventSrc)
        {
            var $input = $(eventSrc).closest("tr").find(":input");

            if ($input.length > 1 && $input.eq(1).val())
            {
                var ppids = $input.eq(1).val().split(","),
                    ppNames = $input.eq(0).val().split(","),
                    lstPortals = getObj("lstPortals");

                for (var i = 0; i < ppids.length; i++)
                {
                    var opt = document.createElement("OPTION");
                    opt.value = ppids[i];
                    opt.text = ppNames[i];

                    lstPortals.add(opt, lstPortals.length);
                }
            }
        }
    }
    else
    {
        $(".PersonPortal").hide();
        $("#tdJQGrid").css("width", "100%");
    }

    $("#lstPortals").dblclick(function (event)
    {
        $(this).find("option:selected").remove();
    });
});