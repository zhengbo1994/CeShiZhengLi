function resetCorp()
{
    $("iframe")[1].src = "VSelectCorpFileByAddressTree.aspx?CorpID=" + $("#ddlCorp").val();
}
$(function ()
{
    $("#btnSearch").click(function ()
    {
        window.frames("Main").reloadData();
        return false;
    });

    $("#btnChooseClose").click(function ()
    {
        var $jqObj = $('#jqGrid1', window.frames('Main').document);
        if ($jqObj && $jqObj.length > 0)
        {
            var $cfid = $jqObj.find("tr[aria-selected='true']");
            if (!$cfid || $cfid.length <= 0)
            {
                return alertMsg('请选择需要借阅的档案!');
            }
            var cfno = $cfid.find("td[aria-describedby='jqGrid1_CCNO']")[0].title;
            var cfname = $cfid.find("td[aria-describedby='jqGrid1_CCTitle']")[0].title;
            var cftype = $cfid.find("td[aria-describedby='jqGrid1_TType']")[0].title; ;
            switch (cftype)
            {
                case "4":
                    cftype = "0";
                    break;
            }
            window.returnValue = { CFID: $cfid[0].id, CFNo: cfno, CFName: cfname, CFType: cftype };
            window.opener = null;
            window.close();
        }
    });
});