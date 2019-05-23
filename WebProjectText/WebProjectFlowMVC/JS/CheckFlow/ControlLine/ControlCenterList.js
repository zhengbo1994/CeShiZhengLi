$(function ()
{
    $("#ddlCorp, #ddlControlType").change(function ()
    {
        reloadData();
    });

    $("#btnSearch").click(function ()
    {
        reloadData();
    });

    $("#btnControlSetting").click(function ()
    {
        var $chk = $("#jqgControlCheck :checkbox:checked");
        if ($chk.length < 1)
        {
            return alertMsg("没有任何记录可供操作！");
        }

        if ($("#ddlCorp").val() == "")
        {
            return alertMsg("请选择公司！");
        }

        openModalWindow("VControlCenterSetting.aspx?Type=More&CorpID=" + $("#ddlCorp").val(), 600, 400);
    });

    $("#jqgControlCheck").click(function (event)
    {
        if (event.target.className && event.target.className == "setting")
        {
            var $tr = $(event.target).closest("tr");
            var keyID = $tr.find("td[aria-describedby='jqgControlCheck_KeyID']")[0].title;
            var flowID = $tr.find("td[aria-describedby='jqgControlCheck_FlowID']")[0].title;
            var corpID = $tr.find("td[aria-describedby='jqgControlCheck_CorpID']")[0].title;

            openModalWindow("VControlCenterSetting.aspx?Type=Single&CorpID=" + corpID + "&KeyID=" + keyID + "&FlowID=" + flowID, 600, 400);
        }
    });
});

function windowLoad()
{
    reloadData();
}

function reloadData()
{
    var strCorpID = $("#ddlCorp").val();
    var strCTID = $("#ddlControlType").val();
    var strKeyWord = $("#txtKey").val();
    var strSD = $("#txtStartDate").val();
    var strED = $("#txtEndDate").val();

    var $jq = $('#jqgControlCheck');
    $jq.getGridParam('postData').CorpID = strCorpID;
    $jq.getGridParam('postData').CTID = strCTID;
    $jq.getGridParam('postData').KeyValue = strKeyWord;
    $jq.getGridParam('postData').SD = strSD;
    $jq.getGridParam('postData').ED = strED;

    $jq.trigger('reloadGrid');
}