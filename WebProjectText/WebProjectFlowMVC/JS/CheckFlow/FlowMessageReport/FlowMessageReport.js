// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-报文质量分析表
 * 文件类型：FlowMessageReportReport.js
 * 作    者：张敏强
 * 时    间：2014-8-28
 */
// 明细浏览页面
function windowLoad()
{
    var $td = $("#tbData tr:eq(1)").find("td");
    var $fnTD = $("#tbData tr:eq(0)").find("td");
    var $hidSD = $("#hidSD");
    var $hidED = $("#hidED");

    $("#tbData").on("click", "a", function ()
    {
        var $cell = $(this).closest("td");
        var $tr = $(this).closest("tr");
        var strFMRFID = "";
        var strFieldName = "";

        var cellIndex = $cell[0].cellIndex;
        if (cellIndex > 5)
        {
            strFMRFID = $td.eq(cellIndex - 5).attr("fmrfid");
            strFieldName = $fnTD.eq(4 + Math.ceil((cellIndex - 5) / 3)).text();
        }
        else
        {
            strFMRFID = $("#hidFieldIDs").val().replace("All","")
        }

        var url = stringFormat("{0}?SD={1}&ED={2}&ItemID={3}&FMRFID={4}&Name={5}",
            browseUrl,
            $hidSD.val(),
            $hidED.val(),
            $tr.attr("itemid"),
            strFMRFID,
            encode($tr.find(":eq(1)").text() + (strFieldName ? ("【" + strFieldName + "】") : "")));

        openWindow(url, 0, 0);
    });
}

// 校验
function validateFilter()
{

    if ($("#txtSD").val() && $("#txtED").val() && compareDate($("#txtSD").val(), $("#txtED").val()) == -1)
    {
        return alertMsg("结束日期不能早于开始日期。", $("#txtED"));
    }

    return true;
}

function btnSelectAreaType_Click()
{
    var rValue = openModalWindow("../../POM/Common/Select/VSelectMultiCostSortArea.aspx?SelectedArea=" + $("#hidAreaTypeID").val(), 800, 600); //

    if(rValue)
    {
        $("#hidAreaTypeID").val(rValue.AreaTypeIDs);
        $("#hidAreaTypeName").val(rValue.AreaTypeNames ? rValue.AreaTypeNames : "全部");
    }
}

function btnSelectCorp_Click()
{
    var rValue = openModalWindow("../../Common/Select/VSelectMultiCorp.aspx?From=MessageCorpReport", 800, 600);

    if (rValue)
    {
        $("#hidCorpID").val(rValue.split("|")[0]);
        $("#hidCorpName").val(rValue.split("|")[1] ? rValue.split("|")[1] : "全部");
    }
}

function btnSelectProject_Click()
{
    openModalWindow("../../CCMP/BI/Briefing/VSelectMultiProject.aspx", 100, 600);
}

function btnSelectFieldID_Click()
{
    openModalWindow("VSelectMultiReportField.aspx", 800, 600);
}

// 查看申请记录
function showRequest(keyID, url)
{
    if (!url)
    {
        url = $("#hidBrowseUrl").val();
    }

    openWindow("../../" + url + keyID, 0, 0);
}

