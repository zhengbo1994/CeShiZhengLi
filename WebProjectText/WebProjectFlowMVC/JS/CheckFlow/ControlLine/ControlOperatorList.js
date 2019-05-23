$(function ()
{
    $("#ddlControlType,#ddlIsReminded").change(function ()
    {
        $("#ctl00_FilterArea2_RemindedValue").val($("#ddlIsReminded").val());
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
            var strKeyID = $(event.target).closest("tr")[0].id;

            openModalWindow("VControlOperatorBrowse.aspx?KeyID=" + strKeyID, 800, 500);
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
    var strIsReminded = $("#ddlIsReminded").val();
    var selectedIsRemindedValue = $("#ctl00_FilterArea2_RemindedValue").val();
    var $jq = $('#jqgControlCheck');
    $jq.getGridParam('postData').CTID = strCTID;
    $jq.getGridParam('postData').KeyValue = strKeyWord;
    $jq.getGridParam('postData').IsReminded = strIsReminded;
    $jq.getGridParam('postData').selectedIsRemindedValue = selectedIsRemindedValue;
    $jq.trigger('reloadGrid');
}