// 送阅相关的js方法

// 将送阅标记为已阅
// wenghq 20140905
function setLookDataRead(itemID, accountID, docTypeName, modCode, ccNo, ccTitle, dbName, tableName, createEmployeeName, pageTitle, callback)
{
    ajaxRequest('FillData.ashx', {
        action: "SetLookDataRead",
        ItemID: itemID,
        AccountID: accountID,
        DocTypeName: docTypeName,
        ModCode: modCode,
        CCNo: ccNo,
        CCTitle: ccTitle,
        DBName: dbName,
        TableName: tableName,
        CreateEmployeeName: createEmployeeName,
        PageTitle: pageTitle
    },
    "text",
    function (data)
    {
        try
        {
            var jqGridID = getParamValue("JQID");
            window.opener.refreshJQGrid(jqGridID);
            if (typeof callback == 'function')
            {
                callback(data);
            }
        } catch (e) { }
    });
}

function addtionalWaitLookPageCloseButtonClickEvent(
    buttonID, itemID, readAccountID, readDescriptionCtrlID,
    docTypeName, ccNo, ccTitle, createAccountID, callback)
{
    var closeBtn = $('#' + buttonID);

    if (!closeBtn.length)
    {
        return false;
    }

    var originCloseEvent = closeBtn[0].onclick;

    closeBtn[0].onclick = function ()
    {
        var readDescription = $('#' + readDescriptionCtrlID).val();
        if (!readDescription && !confirm("你没有填写阅读意见,确定要关闭页面吗？"))
        {
            return false;
        }

        SaveLookStateReadDescription(itemID, readAccountID, readDescription, docTypeName, ccNo, ccTitle, createAccountID, callback);
        isPostBackOperation = true;
        originCloseEvent();
    }
}

// 保存送阅信息的审阅意见
// wenghq 20140905
function saveReadDescription(itemID, readAccountID, readDescriptionCtrlID, docTypeName, ccNo, ccTitle, createAccountID, callback)
{
    /* 部分页面有回发操作，为了避免回发操作时出发保存送阅信息的操作，
     * 在回发按钮的onclick时，设置isPostBackOperation为true，
     * 则该方法会跳过，否则会正常执行
     */

    if (typeof isPostBackOperation === 'boolean' && isPostBackOperation)
    {
        return;
    }
    var readDescription = $('#' + readDescriptionCtrlID).val();

    if (!readDescription)
    {
        return "\n你没有填写阅读意见,确定要关闭页面吗？\n";
    }

    SaveLookStateReadDescription(itemID, readAccountID, readDescription, docTypeName, ccNo, ccTitle, createAccountID, callback);
}

function SaveLookStateReadDescription(itemID, readAccountID, readDescription, docTypeName, ccNo, ccTitle, createAccountID, callback)
{
    ajaxRequest('FillData.ashx', {
        action: "SaveLookStateReadDescription",
        ItemID: itemID,
        ReadAccountID: readAccountID,
        ReadDescription: readDescription,
        DocTypeName: docTypeName,
        CCNo: ccNo,
        CCTitle: ccTitle,
        CreateAcocuntID: createAccountID
    },
    "text",
    function (data)
    {
        if (typeof callback == 'function')
        {
            callback(data);
        }
    });
}

// 加载选择送阅岗位和部门按钮的可见性
// wenghq 20140922
function loadAddLookButtonsDisplay(currentState)
{
    if (currentState.indexOf("正式") >= 0 || currentState == "Finish")
    {
        $('#txtLookDept').parent().css('width', '99%');
        $('#txtLookStation').parent().css('width', '99%');

        $('#btnSelectLookDept').parent().show();
        $('#btnSelectLookStation').parent().show();
    }
    else
    {
        $('#txtLookDept').parent().css('width', '100%');
        $('#txtLookStation').parent().css('width', '100%');

        $('#btnSelectLookDept').parent().hide();
        $('#btnSelectLookStation').parent().hide();
    }
}

// 保存用户的个人标为已阅模式
// wenghq 20140922
function saveUserSetReadMode(accountID, autoSetCbkID, callback)
{
    var cbk = $('#' + autoSetCbkID),
        setReadMode = cbk.length && cbk[0].checked ? 1 : 0,
        originChecked = cbk.parent().attr('originChecked') == "true";

    if (!cbk.length)
    {
        return false;
    }

    var needSave = originChecked != cbk[0].checked;
    if (!needSave)
    {
        return;
    }

    ajaxRequest('FillData.ashx', {
        action: "SaveUserSetReadMode",
        AccountID: accountID,
        SetReadMode: setReadMode
    },
    "text",
    function (data)
    {
        if (typeof callback == 'function')
        {
            callback(data);
        }
    });
}

function btnSelectForwardStation_Click()
{
    var vValue = openModalWindow("/" + rootUrl + '/Common/Select/VSelectMultiStation.aspx?Aim=SelectStation&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookStationID").value = vValue.split('|')[0];
        getObj("txtLookStation").value = vValue.split('|')[1];
    }
}

function btnSelectForwardDept_Click()
{
    var vValue = openModalWindow("/" + rootUrl + '/Common/Select/VSelectMultiDept.aspx?Aim=SelectDept&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidLookDeptID").value = vValue.split('|')[0];
        getObj("txtLookDept").value = vValue.split('|')[1];
    }
}