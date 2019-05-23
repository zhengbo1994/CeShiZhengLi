//初始化数据
function ajaxDataGrid()
{
    ajax("VSelectSingleMaterialServiceClass.aspx", { BaseID: $("#hidBaseID").val() }, "json", function (data)
    {
        if (data)
        {
            $('#divData').html(data.Data);

            //初始化
            initMaterialServiceClass();
        }
    }, false);
}

//初始化
function initMaterialServiceClass()
{
    var chks = getObjs("chkIDV3");
    var MSCID = $("#hidMSCID").val();    
    if (MSCID != "")
    {
        for (var i = 0; i < chks.length; i++)
        {
            if (MSCID == chks[i].value)
            {
                chks[i].click();
                setScrollTop(chks[i]);
            }
        }
    }
    $(chks).bind('propertychange', function () { SingleRule(); });
}

//规则：只可选择一个
function SingleRule()
{
    var chk = window.event.srcElement;
    if (chk.checked)
    {
        var chks = getObjs("chkIDV3");
        for (var i = 0; i < chks.length; i++)
        {
            if (chks[i].value!=chk.value && chks[i].checked == true)
            {
                chks[i].click();
            }
        }
    }
}

//关键字定位
function btnSearch_Click()
{
    var chks = getObjs("chkIDV3");
    var isFirst = "0";
    if (txtKey.value != hidOriKey.value)
    {
        hidOriKey.value = txtKey.value;
        hidIndex.value = "-1";
        $(chks).parent("td").parent("tr").css("background-color", "#FFFFFF").css("color", "#414141"); ;
    }
    for (var i = 0; i < chks.length; i++)
    {
        if (chks[i].name.indexOf(hidOriKey.value) != -1)
        {
            hidLastIndex.value = i + 1;
            if (parseInt(hidIndex.value) <= i && isFirst == "0")
            {
                hidIndex.value = i + 1;
                isFirst = "1";
                $(chks[i]).parent("td").parent("tr").css("background-color", "#AAEEAA").css("color", "#AB0000");
                setScrollTop(chks[i]);
            }
            else
            {
                $(chks[i]).parent("td").parent("tr").css("background-color", "#FFFFFF").css("color", "#414141");
            }
        }
        else
        {
            $(chks[i]).parent("tr").css("background-color", "#FFFFFF").css("color", "#414141");
        }
    }
    if (hidIndex.value == hidLastIndex.value)
    {
        hidIndex.value = "-1";
    }
}
function setScrollTop(chk)
{
    getObj("divMPList").scrollTop = chk.parentNode.offsetTop - 26;
}

//保存
function saveSelected()
{
    var MSCIDs = "";
    var $checked = $("input:checked");
    if ($checked && $checked.length > 0)
    {
        window.returnValue = $checked[0].value + "|" + $checked[0].name;
    }
    else
    {
        window.returnValue = "|";
    }
    window.close();
}