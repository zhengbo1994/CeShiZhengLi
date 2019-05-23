// JScript 文件


//搜索
function btnSearch_Click()
{
    reloadData();
}

function reloadData()
{
    var jqObj = $('#jqBuChaScheme', document);
    jqObj.getGridParam('postData').CompanyGuid = $("#ddlCompany").val();
    jqObj.getGridParam('postData').ProgramName = $("#txtKey").val();
    refreshJQGrid("jqBuChaScheme");
}

// 添加
function addScheme()
{
    var companyID = $("#ddlCompany").val();
    openAddWindow("VBuChaSchemeAdd.aspx?companyID=" + companyID, 800, 600);
}

// 修改
function editScheme()
{
    openModifyWindow("VBuChaSchemeAdd.aspx", 800, 600, "jqBuChaScheme");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("MakeUpMoneySet", 7, "jqBuChaScheme");
}

// SearchKeyDown
function SearchKeyDown()
{
    if (window.event.keyCode == 13)
    {
        reloadData();
    }
}

// 启用与否
function Enable_OnClick()
{
    var enableValue = "";
    $(":checked").each(function ()
    {
        enableValue += $(this).attr("id").replace("jqg_", "") + ",";
    });
    enableValue = enableValue.replace("cb_jqBuChaScheme,", "");
    if (enableValue != "")
    {
        enableValue = enableValue.substring(0, enableValue.lastIndexOf(','));
        $.post('FillData.ashx', { action: 'CRM_EnableMakeUpMoneySet', ids: enableValue }, function (data)
        {
            if (data)
            {
                alert('操作成功！');
            } else
            {
                alert('操作失败！');
            }
            reloadData();
        });
    }
}

function Unable_OnClick()
{
    var unableValue = "";
    $(":checked").each(function ()
    {
        unableValue += $(this).attr("id").replace("jqg_", "") + ",";
    });
    unableValue = unableValue.replace("cb_jqBuChaScheme,", "");
    if (unableValue != "")
    {
        unableValue = unableValue.substring(0, unableValue.lastIndexOf(','));
        $.post('FillData.ashx', { action: 'CRM_UnableMakeUpMoneySet', ids: unableValue }, function (data)
        {
            if (data)
            {
                alert('操作成功！');
            } else
            {
                alert('操作失败！');
            }
            reloadData();
        });
    }

}

function renderLink(cellvalue, options, rowobject)
{
    var url = '<a target="_blank" href=VBuChaSchemeAdd.aspx?ID=' + rowobject[0] + '>' + cellvalue + '</a>';
    return url;
}

// 新增补差明细验证
// 添加/修改折扣明细验证
function validateSize()
{
    handleBtn(false);

    var lOpt = $("#ddlLowerOperator").val();
    var uOpt = $("#ddlUpperOperator").val();
    var lNumber = $("#txtLowerPercentage").val();
    var uNumber = $("#txtUpperPercentage").val();

    if (lOpt == "" && uOpt == "")
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误，请设置区间。", getObj("ddlLowerOperator"));
    }

    if (lOpt == "" && lNumber != "")
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误，请正确设置运算符。", getObj("ddlLowerOperator"));
    }

    if (uOpt == "" && uNumber != "")
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误，请正确设置运算符。", getObj("ddlUpperOperator"));
    }

    if (lOpt != "" && (lNumber == "" || isNaN(lNumber) || getRound(lNumber) <= -100 || getRound(lNumber) >= 100))
    {
        handleBtn(true);
        return alertMsg("请输入-100到100之间的数字。", getObj("txtLowerPercentage"));
    }

    if (uOpt != "" && (uNumber == "" || isNaN(uNumber) || getRound(uNumber) <= -100 || getRound(uNumber) >= 100))
    {
        handleBtn(true);
        return alertMsg("请输入-100到100之间的数字。", getObj("txtUpperPercentage"));
    }

    if (lOpt == "3" && getRound(lNumber) == "0")
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误,差异率不能等于0。", getObj("txtLowerPercentage"));
    }

    if (uOpt == "3" && getRound(uNumber) == "0")
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误,差异率不能等于0。", getObj("txtUpperPercentage"));
    }

    if ((lOpt == "3" && uOpt != "") || (uOpt == "3" && lOpt != ""))
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误,“=”号不能与其它符号同时使用。", getObj("ddlLowerOperator"));
    }


    if ((lOpt == "1" || lOpt == "2") && (uOpt == "1" || uOpt == "2") && getRound(lNumber) <= getRound(uNumber))
    {
        handleBtn(true);
        return alertMsg("计算条件定义有误。", getObj("txtUpperPercentage"));
    }

    return true;
}


function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSave"), enabled);
}