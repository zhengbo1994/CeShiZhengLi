
function Save()
{
    var t = "";
    if ($("#hidIsPrice").val() == "Y")
    {
        t = $("#ddlPrice").val();
    }
    else
    {
        t = $("#ddlArea").val();
    }
    window.returnValue = t;
    window.close();
}

function addRecord()
{
    $(":checked", window.dialogArguments.document).each(function ()
    {
        if ($(this).val() != "on")
        {
            var content = $(this).parent().parent().find("#ddlPriceScheme")[0].innerHTML;
            $("#ddlPrice").append(content);
        }
    });
}