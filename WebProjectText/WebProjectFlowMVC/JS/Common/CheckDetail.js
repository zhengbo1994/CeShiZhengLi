// UC_CheckDetail.ascx的js

// 打印会签单
function btnPrint_onclick()
{
    printBill();
}

// 显示账号信息
function showAccount(accountID)
{
    openWindow("/" + rootUrl + "/OperAllow/Account/VAccountBrowse.aspx?AccountID=" + accountID, 800, 600);
}

// 显示接收意见、征询意见、审核要点
function showDesc(type)
{
    var clsID = getEventObj("td").previousSibling.id;
    openWindow("/" + rootUrl + ["/CheckFlow/Consultation/VCurruentTransport.aspx?ReceCLSID=",
        "/CheckFlow/Consultation/VCurruentConsultation.aspx?CLSID=",
        "/Common/Select/Confirm/VFlowListDetailCheckPoint.aspx?CLSID="][type] + clsID, 800, 600);
}

// 回复意见（打开回复意见框）
function replyDesc()
{
    var img = getEventObj();
    var tdReply = getParentObj(img, "tr").nextSibling.cells[0];
    var spReply = getObjC(tdReply, "span", 0);
    if (!spReply)
    {
        var clsID = getParentObj(img, "td").previousSibling.id;
        spReply = document.createElement("span");
        spReply.innerHTML = getTextAreaHtml(null, 1000, 50)
            + getButtonHtml(null, "提交", null, "submitReply('" + clsID + "')")
            + getButtonHtml(null, "取消", null, "closeReply()");
        tdReply.appendChild(spReply);
    }
    spReply.style.display = "block";
    getObjC(spReply, "textarea", 0).focus();
}

// 提交回复
function submitReply(clsID)
{
    var spReply = getEventObj("span");
    var txtReply = getObjC(spReply, "textarea", 0);
    var replyDesc = txtReply.value.Trim();
    if (!replyDesc)
    {
        return alertMsg("回复意见不能为空。", txtReply);
    }
    setAjaxContainer(txtReply);
    ajax("FillData.ashx", { "action": "ReplyCheckDesc", "CLSID": clsID, "ReplyDesc": replyDesc }, "json", function (data)
    {
        if (data.Success == "Y")
        {
            var reg = new RegExp("\r\n", "g");
            var replyDescReg = replyDesc.replace(reg, "<br/>");      //add by chenzy on 2013-10-30

            spReply.insertAdjacentHTML('beforeBegin', stringFormat('<div style="text-align:left">{0}({1})：{2}</div>',
                getObj("hidUserName").value, new Date().Format("yy-MM-dd hh:mm"), replyDescReg));
            txtReply.value = "";
            spReply.style.disply = "none";
        }
        else
        {
            alert(data.Data);
        }
    });
}

// 取消回复
function closeReply()
{
    var spReply = getEventObj("span");
    spReply.style.display = "none";
}