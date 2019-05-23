$(function ()
{
    $("#ddlControlType").change(function ()
    {
        reloadData();
    });

    $("#btnSearch").click(function ()
    {
        reloadData();
    });

    $("#jqgControlCheck").click(function (event)
    {
        if (event.target.className && event.target.className == "setting")
        {
            var $tr = $(event.target).closest("tr");
            var keyID = $tr.find("td[aria-describedby='jqgControlCheck_KeyID']")[0].title;
            var flowID = $tr.find("td[aria-describedby='jqgControlCheck_FlowID']")[0].title;

            openModalWindow("VControlReaderBrowse.aspx?KeyID=" + keyID, 600, 400);
        }
    });
});

function windowLoad()
{
    reloadData();
}

function reloadData()
{
    var strCTID = $("#ddlControlType").val();
    var strKeyWord = $("#txtKey").val();

    var $jq = $('#jqgControlCheck');
    $jq.getGridParam('postData').CTID = strCTID;
    $jq.getGridParam('postData').KeyValue = strKeyWord;

    $jq.trigger('reloadGrid');
}