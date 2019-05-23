$(function ()
{
    var btnSetting = {
        "btnSave": function ()
        {
            window.frames("Main").pageArg.saveSettingData();
        },
        "btnSearch": function ()
        {
            window.frames("Main").pageArg.reloadData();
        }
    };

    $("body").click(function (event)
    {
        if (typeof btnSetting[event.target.id] == "function")
        {
            btnSetting[event.target.id]();
        }
    });
});

// 切换用户
function exchangeUser(accountID)
{
    if (!accountID)
    {
        accountID = $("#hidAccountID").val();
        if (accountID == "")
        {
            return alertMsg("请先点击选择要切换的用户。");
        }
    }
    ajaxRequest("FillData.ashx", { action: "SwicthUser", AccountID: accountID }, "text", afterExchange);
}

// 切换用户
function afterExchange(data, textStatus)
{
    if (data == "Y")
    {
        window.top.location.href = window.top.location.href;
    }
    else
    {
        alert(data);
    }
}