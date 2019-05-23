// 切换用户页面的js

function windowLoad()
{
    reloadData();
}

// 加载数据
function reloadData()
{
    var query = {KW: $("#txtKW").val()}; 
    
    // 无条件时，省略第二个参数
    reloadGridData("idPager", query);
}

// 点击选择账号
function selectAccount(accountID, accountName)
{
    $("#hidAccountID").val(accountID);
    $("#txtAccountName").val(accountName);
}

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
    
    ajaxRequest("FillData.ashx", {action: "ExchangeUser", AccountID:accountID}, "text", afterExchange);
}

// 切换用户
function afterExchange(data, textStatus)
{
    if (data == "Y")
    {
        window.top.frames("Top").location.reload();
        
        window.setTimeout("setBackBtn()", 1000);
    }
    else
    {
        alert(data);
    }
}

// 显示反切换按钮
function setBackBtn()
{
    if (!getObjT("btnBackTrack"))
    {
        var doc = window.top.document;
        var btn = doc.createElement('<input id="btnBackTrack" type="button" class="btn_back btnsmall btnpad" value="返回" onclick="exchangeUser(\''
            + $("#hidMyAccountID").val() + '\')" />');
        doc.body.appendChild(btn);
    }
}