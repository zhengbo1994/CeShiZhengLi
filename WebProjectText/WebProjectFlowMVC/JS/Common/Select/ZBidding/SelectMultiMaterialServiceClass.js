//初始化数据
function ajaxDataGrid()
{
    ajax("VSelectMultiMaterialServiceClass.aspx", { BaseID: $("#hidBaseID").val() }, "json", function (data)
    {
        if (data)
        {
            $('#divData').html(data.Data);

            //初始化
            initMaterialServiceClass();
        }
    }, false);
}

//初始化标准库
function initMaterialServiceClass()
{
    var chks = getObjs("chkIDV3");
    //标准库规则
    $(chks).bind('propertychange', function () { LibraryRule(); });
    var MSCIDs = $("#hidMSCID").val();
    if (MSCIDs.length > 0)
    {
        for (var i = 0; i < chks.length; i++)
        {
            if (MSCIDs.indexOf(chks[i].value) > -1)
            {
                chks[i].click();
            }
        }
    }
}

//标准库规则：只可选择同一级别的类型（如选择了父类型，则子类型不能选；如选择了子类型，则父类型不能选）
function LibraryRule()
{
    var chk = window.event.srcElement;
    var chks = getObjs("chkIDV3");
    //被点击的类型OutLine
    var no = chk.no;
    $(chks).unbind('propertychange'); //停止事件
    for (var i = 0; i < chks.length; i++)
    {
        if (isParent(chks[i].no, no))//父类型
        {
            if (isHasSonChecked(chks[i].no))//子类型被选，则禁用父类型
            {
                if (chks[i].checked == true)
                {
                    chks[i].click();
                }
                $(chks[i]).parent("td").parent("tr").attr("disabled", "true");
            }
            else
            {
                $(chks[i]).parent("td").parent("tr").attr("disabled", "");
            }
        }
        else if (isSon(chks[i].no, no))//选中时，禁用子类型
        {
            if (chk.checked)
            {
                if (chks[i].checked == true)
                {
                    chks[i].click();
                }
                $(chks[i]).parent("td").parent("tr").attr("disabled", "true");
            }
            else
            {
                $(chks[i]).parent("td").parent("tr").attr("disabled", "");
            }
        }
    }
    $(chks).bind('propertychange', function () { LibraryRule(); }); //启动事件
}
//是否父类型
function isParent(ParentNo, SonNo)
{
    if (SonNo.indexOf(ParentNo + '.') == 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}
//是否子类型
function isSon(SonNo, ParentNo)
{
    if (SonNo.indexOf(ParentNo + '.') == 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}
//是否有子类型被选中
function isHasSonChecked(No)
{
    var chks = getObjs("chkIDV3");
    for (var i = 0; i < chks.length; i++)
    {
        if (isSon(chks[i].no, No) && chks[i].checked)
        {
            return true;
        }
    }
    return false;
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
    var MSCNames = "";
    
    var $checked = $("input:checked");
    if ($checked && $checked.length > 0)
    {
        for (var i = 0; i < $checked.length; i++)
        {
            MSCIDs = MSCIDs + $checked[i].value + ",";
            MSCNames = MSCNames + $checked[i].name + ",";
        }
    }

    var reg = new RegExp("[,]*$");
    window.returnValue = MSCIDs.replace(reg, "") + "|" + MSCNames.replace(reg, "");
    window.close();
}