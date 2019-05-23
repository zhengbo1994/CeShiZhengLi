// JScript 文件

//条件搜索

function SltreloadData()
{
    // 切换选项卡后，清空搜索条件， 2013-03-11 wenghq
    $('#txtKey').val('');

    var index = $("#hidServiceType").val();
    reloadData(index);
}

function reloadData(index)
{
    var sProjectGUID = $('#ddlProjectGUID').val(),
        url = getCurrentUrl();
    
    /* 加载销售服务设置 */
    ajax(
        url,
        { Action: "GetSalesServiceSet",
            ProjectGUID: sProjectGUID,
            ServiceType: index
        },
        "json",
        SetSalesServiceSet
        );
}

//新建销售服务进程（明细）
function addSalesServiceDetail()
{

    if (getObj("hidSalesServiceSetGUID").value == "")
    {
        return alertMsg('请先保存销售服务设置。', getObj("txtAfterDays"));
    }
    openAddWindow("VSalesServiceDetailAdd.aspx?SalesServiceSetGUID=" + getObj("hidSalesServiceSetGUID").value, 500, 300, "jqGrid");
}


//删除销售服务进程（明细）
function delSalesServiceDetail()
{
    // openDeleteWindow("SalesServiceDetail", 13, "jqGrid"); 旧的
    //changcx 2013-05-06 16:50 add
    var msg = "";
    var keys = getJQGridSelectedRowsData("jqGrid", true, "ServiceProcessType");
    if (null != keys) {
        for (var i = 0; i < keys.length; i++) {

            if (keys[i]=="<DIV class=nowrap>系统</DIV>"){
                msg = "系统级服务进程不可删除！";
               // return;
            }
        }
    }
    if (!!msg) {
        alert('系统级服务进程不可删除！'); return;
    }
    else {
        openDeleteWindow("SalesServiceDetail", 13, "jqGrid");
    }
   
}

//主表信息保存合法性校验
function saveSalesServiceSetValidate()
{
    var isValid = true;
    handleBtn(false);

    if (!$.ideaValidate())
    {
        var afterDays = $("#txtAfterDays").val();
        var completeDays = $("#txtCompleteDays").val();

        if (isValid && afterDays < 0)
        {
            isValid = alertMsg("请输入非负整数", getObj("txtAfterDays"));
        }

        if (isValid && completeDays < 0)
        {
            isValid = alertMsg("请输入非负整数", getObj("txtCompleteDays"));
        }

        handleBtn(true);
    }
    else
    {
        handleBtn(true);
        isValid = false;
    }
    return $.ideaValidate();
}

function saveSalesServiceSet()
{
    if (!saveSalesServiceSetValidate())
    {
        return false;
    }

    var url = getCurrentUrl(),
        salesServiceSetGUID = $('#hidSalesServiceSetGUID').val(),
        projectGUID = $('#ddlProjectGUID').val(),
        index = $('#hidServiceType').val(),
        afterDays = $('#txtAfterDays').val(),
        completeDays = $('#txtCompleteDays').val(),
        accountID = $('#hidAccountID').val();

    ajax(
        url,
        { Action: "SaveSalesServiceSet",
            SalesServiceSetGUID: salesServiceSetGUID,
            ProjectGUID: projectGUID,
            ServiceType: index,
            AfterDays: afterDays,
            CompleteDays: completeDays,
            AccountID: accountID
        },
        "text",
        function (data, textStatus)
        {
            alert(data);
        });
}

function validateSize()
{   
    handleBtn(false);
    if (getObj("txtServiceProcessName").value == "")
    {
        handleBtn(true);
        return alertMsg('服务进程名称不能为空。', getObj("txtServiceProcessName"));
    }
    if (!isPositiveInt(getObj("txtProcessStepNO").value))
    {
        handleBtn(true);
        return alertMsg('步骤号必须为正整数。', getObj('txtProcessStepNO'));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


// 加载销售服务设置信息
function SetSalesServiceSet(data, textStatus)
{
    var txtAfterDays = getObj("txtAfterDays"),
        txtCompleteDays = getObj("txtCompleteDays"),
        hidSalesServiceSetGUID = getObj("hidSalesServiceSetGUID");

    if (!!data)
    {
        txtAfterDays.value = !!data.AfterDays ? data.AfterDays : 0;
        txtCompleteDays.value = !!data.CompleteDays ? data.CompleteDays : 0;
        hidSalesServiceSetGUID.value = !!data.SalesServiceSetGUID ? data.SalesServiceSetGUID : "";
    }
    else
    {
        txtAfterDays.value = "";
        txtCompleteDays.value = "";
        hidSalesServiceSetGUID.value = "";
    }

    //加载列表信息
    var sKey = getObj("txtKey").value;
    var query = { "Key": sKey, "SalesServiceSetID": hidSalesServiceSetGUID.value };
    
    if (loadJQGrid("jqGrid", query))
    {
        refreshJQGrid("jqGrid");
    }
}