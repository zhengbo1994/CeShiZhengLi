//转发意见
$(function ()
{
    //转发意见
    var $tbCheckRemind = $("#chkCheckRemind");
    var $btnClose = $("#btnClose_tb");

    if ($btnClose.size() == 1)
    {
        var strBtnTransportDescription
        if ($tbCheckRemind.size() > 0)
        {
            strBtnTransportDescription = "<td>&nbsp;<label><input class='idbox' id='chkTransportDescription' type='checkbox' value='on'/>转发意见</label></td>";
            $tbCheckRemind.find("tr:first").find("td:first").after(strBtnTransportDescription);
        }
        else
        {
            strBtnTransportDescription = "<table class='check_sms_mail' id='chkCheckRemind'><tr><td><span>[提醒处理人:</span></td><td>&nbsp;<label><input class='idbox' id='chkTransportDescription' type='checkbox' value='on'/>" +
                                            "转发意见</label><td/> <td><span>]</span></td></tr></table>";
            $btnClose.after(strBtnTransportDescription);
        }
        var $chkTranDesc = $("#chkTransportDescription");
        //审批明细表格
        var $detailTable = $("table[id$=_ucDetail_dgData]:last");
        var $tbTransport = $("#tbTransport");
        var $divTran = $("#divTran");

        if ($tbTransport.size() == 0)
        {
            var headColor = "";
            switch (pageArgus.pageTheme)
            {
                case "Gray":
                    headColor = "#3f4749";
                    break;
                default:
                    headColor = "#5a8cc5";
            }

            var strTranDiv = "<div id='divTran' style='zoom:1;display:none;position:absolute;width:240px;background-color:#eee;padding:3px;border:1px solid #aaa; height:300px;overflow-y:scroll;'>" +
                            "<div style='width:100%;height:18px;padding-top:1px;margin-bottom:3px;padding-left:3px;border-left:8px solid " + headColor + ";border-bottom:1px solid " + headColor + ";color:" + headColor + "'>确定转发人员" +
                            "<span id='spanTran' style='background:url(" + pageArgus.rootDir + "/App_Themes/" + pageArgus.pageTheme + "/img/control/area_collapse.gif) no-repeat center center;display:block;width:20px;height:20px;position:absolute;right:0;top:0;cursor:hand'></span></div></div>";
            var strTranTable = "<table class='table' id='tbTransport'><tr class='table_headrow'><td><input type='checkbox' onclick='selectTableAll(tbTransport,this)'/></td>" +
                            "<td>序号</td><td>处理人</td></tr></table>";
            var btnSelectStation = "<div id='divBtn'><input class='btnsmallon' type='button' value='选择/查看岗位' onclick='SelectStaion()' /></div>"
            $("body").append(strTranDiv);
            $divTran = $("#divTran");
            $divTran.append(strTranTable);
            $divTran.append(btnSelectStation);
            $tbTransport = $("#tbTransport");

            $("#spanTran").click(function ()
            {
                $divTran.hide();
            });

            var arrStationIDs = [];
            $detailTable.children("tbody").children("tr:gt(0)").each(function (i)
            {
                var $td = $(this).children("td:eq(2)");
                var $hidInput = $td.find("input");
                if ($hidInput[0].value == "Y" && arrStationIDs.toString().indexOf($hidInput[1].value) == -1)
                {
                    //type='checkbox'的value为CheckAccountID|StationID 
                    var strTr = "<tr><td style='text-align:center'><input type='checkbox' ids='" + $hidInput[1].value + "' /></td><td style='text-align:center'>" + (i + 1) + "</td><td>" + $td.text() + "</td></tr>";
                    $tbTransport.append(strTr);
                    arrStationIDs.push($hidInput[1].value);
                }
            });
            setTableRowAttributes($tbTransport[0]);
        }

        $chkTranDesc.change(function ()
        {
            if (this.checked)
            {
                var pos = $(this).offset();
                $divTran.css({ bottom: 35, left: pos.left });
                $divTran.show();
            }
            else
            {
                $divTran.hide();
            }
        });

        $chkTranDesc.closest("td").mouseover(function ()
        {
            if ($chkTranDesc[0].checked)
            {
                if ($divTran.is(":hidden"))
                {
                    var pos = $chkTranDesc.offset();
                    $divTran.css({ bottom: 35, left: pos.left });
                    $divTran.show();
                }
            }
        });
    }

    //验证转发意见
    function validateTranDesc()
    {
        var $tbTransport = $("#tbTransport,#tbOtherStations");

        if ($tbTransport.size() >= 1 && $("#chkTransportDescription")[0].checked == true)
        {
            var $chks = $tbTransport.find("tr:gt(0)").find(":checkbox:checked");
            if ($chks.size() == 0)
            {
                return alertMsg("请选择要转发意见的岗位！");
            }
            if ($("#txtCheckDescription").size() == 1 && $("#txtCheckDescription").val() == "")
            {
                $("#divTran").show();
                return alertMsg("请填写意见！");
            }
            else
            {
                var arrTranDescInfo = [];
                $chks.each(function ()
                {
                    arrTranDescInfo.push(this.ids);
                });
                $("#hidTranDescDetial").val(arrTranDescInfo.join("^"));
            }
        }
        return true;
    }

    pageArgus.validateTranDesc = validateTranDesc;
});

//转发意见选择流程外人员
function SelectStaion()
{
    var vValue = openModalWindow('/' + rootUrl + '/Common/Select/VSelectMultiStation.aspx?Aim=TransportDescription&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        var htm = "<table class='table' id='tbOtherStations'><tr class='table_headrow'><td style='width:20%'></td><td style='width:33%'>序号</td><td style='width:47%'>处理人</td></tr></table>";

        var arrStationIDs = vValue.split('|')[0].split(',');
        var arrStations = vValue.split('|')[1].split('，');


        var vItem = "";
        for (var i = 1; i < arrStations.length + 1; i++)
        {
            vItem += "<tr><td style='text-align:center;width:10%'><input type='checkbox' checked='true' ids='" + arrStationIDs[i - 1] + "' disabled='true' /></td><td style='width:25%;text-align:center;'>" + i + "</td><td style='width:65%'>" + arrStations[i - 1] + "</td></tr>";
        }
        $("#divTran").find("#tbOtherStations").remove();

        $("#divTran").append(htm);

        var $tbOtherStations = $("#tbOtherStations");
        $tbOtherStations.append(vItem);
        $("#hidStationIDs").val(vValue.split('|')[0]);
        $("#hidEmployee_StationNames").val(vValue.split('|')[1]);

        for (var i = 1; i < $tbOtherStations[0].rows.length; i++)
        {
            var row = $tbOtherStations[0].rows[i]
            row.className = row.rowIndex % 2 == 1 ? "dg_row" : "dg_altrow";
        }
    }
}