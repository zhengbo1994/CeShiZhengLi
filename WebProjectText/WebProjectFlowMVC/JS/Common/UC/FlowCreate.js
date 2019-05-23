var pop;
function showMenu(id, index)
{
    getObj('hidInsertIndex').value = index;
    popMenu(getObj(pageArgus.ID_divMenu), 130, id);
    event.returnValue = false;
    event.cancelBubble = true;
    return false;
}

function popMenu(menuDiv, width, rowControlString)
{
    if (!pop)
    {
        pop = window.createPopup();
    }
    pop.document.body.innerHTML = menuDiv.innerHTML;
    var rowObjs = pop.document.body.all[0].rows;
    var rowCount = rowObjs.length;
    for (var i = 0; i < rowObjs.length; i++)
    {
        var hide = rowControlString.charAt(i) != '1';
        if (hide)
        {
            rowCount--;
        }
        rowObjs[i].style.display = (hide) ? "none" : "";
        rowObjs[i].cells[0].onmouseover = function ()
        {
            this.style.background = "#7b68ee";
            this.style.color = "white";
        }
        rowObjs[i].cells[0].onmouseout = function ()
        {
            this.style.background = "#ccff00";
            this.style.color = "black";
        }
    }

    pop.document.oncontextmenu = function ()
    {
        return false;
    }

    pop.document.onclick = function ()
    {
        pop.hide();
    }

    pop.show(event.clientX - 1, event.clientY, width, rowCount * 20, document.body);

    return true;
}



function ShowTach()
{
    if (getObj("hidIsShowTach").value == "Y")
    {
        getObj("trTach").style.display = "";
        getObj("btnShowTach").innerHTML = "<span class='btntext'>隐藏环节信息</span>";
    }
    else
    {
        getObj("trTach").style.display = "none";
        getObj("btnShowTach").innerHTML = "<span class='btntext'>显示环节信息</span>";
    }
}

function btnShowTach_Click()
{
    if (getObj("hidIsShowTach").value == "Y")
    {
        getObj("trTach").style.display = "none";
        getObj("hidIsShowTach").value = "N";
        getObj("btnShowTach").innerHTML = "<span class='btntext'>显示环节信息</span>";
    }
    else
    {
        getObj("trTach").style.display = "";
        getObj("hidIsShowTach").value = "Y";
        getObj("btnShowTach").innerHTML = "<span class='btntext'>隐藏环节信息</span>";
    }

    //解决样式问题，未重新计算Top值  肖勇彬 20140729
    $("#tbControlSetting .dg_headrow").addClass("dg_headrow");
    return false;
}

function addCheckTach(tachType)
{
    if (pop)
    {
        pop.hide();
    }

    var rootDir = pageArgus.rootDir;
    var corpID = pageArgus.corpID;

    var hidInsertStationID = getObj('hidInsertStationID');
    var btnInsertTach = getObj(pageArgus.btnInsertTachID);

    hidInsertStationID.value = "";

    //起草人调整
    if (tachType == "Adjust")
    {
        hidInsertStationID.value = pageArgus.createStationID + "#All&Adjust&N&1&1&调整&N&&";
        btnInsertTach.click();
    }
    //成本拆分
    else if (tachType == "Allot")
    {
        hidInsertStationID.value = pageArgus.allotStationID + "#All&Allot&N&1&1&拆分&N&&";
        btnInsertTach.click();
    }
    //串环
    else if (tachType == "Bunch")
    {

        hidInsertStationID.value = openModalWindow(pageArgus.rootDir + '/Common/Select/VInsertTachSingleStation.aspx?From=Check&CorpID=' + corpID, 900, 600);
        if (hidInsertStationID.value != "" && hidInsertStationID.value != "undefined")
        {
            btnInsertTach.click();
        }
    }
        //并环
    else if (tachType == "Parataxis")
    {
        hidInsertStationID.value = openModalWindow(pageArgus.rootDir + '/Common/Select/VInsertTachMultiStation.aspx?From=Check&CorpID=' + corpID, 900, 600);
        if (hidInsertStationID.value != "" && hidInsertStationID.value != "undefined")
        {
            btnInsertTach.click();
        }
    }

}

var $pointObj = {};
$(function ()
{
    if (typeof (pageArgus) === "undefined")
    {
        pageArgus = {
            ID_divMenu: "",
            rootDir: "/" + rootUrl,
            corpID: "",
            btnInsertTachID: "",
            createStationID: "",
            allotStationID: "",
            divDLID: "",
            btnSavePointID: "",
            ID_dlCheckListID: "",
            ID_divDL: ""
        };
    }

    $("#" + pageArgus.divDLID + " img.img-human").click(function ()
    {
        //        $pointObj = {};
        $pointObj.$pointImg = $(this); //头像
        $pointObj.$pointItem = $(this).siblings().eq(1); //该审批人的审批要点信息
        $pointObj.$pointHuman = $(this).siblings().eq(0); //审批人ID
        $pointObj.$pointInfo = $(this).closest("span").siblings().eq(0); //该环节信息
        $pointObj.$pointType = $(this).closest("span").siblings().eq(1); //该环节审批要点类别，只能是同一类别
        $pointObj.tachType = $(this).closest("span").find("table").size() > 1 ? "P" : "O"; //P:并环;O:串环

        var bValue = openModalWindow(pageArgus.rootDir + "/CheckFlow/CheckPoint/VCheckPointSelect.aspx", 800, 600);
        if (bValue)
        {
            $("#" + pageArgus.btnSavePointID)[0].click();
        }
        arguments[0].stopPropagation();
        return false;
    }).css("cursor", "hand");

    //并环可插入审批人
    var $tb = $("table.tbParataxis").closest("table.dl_table");
    var prevTB = null;
    $tb.each(function ()
    {
        //存在TachType跳过
        if (this.TachType)
        {
            return true;
        }
        else
        {
            $(this).attr("TachType", "P").css("cursor", "hand");
            $(this).click(function ()
            {
                $("#hidInsertIndex").val(parseInt($(this).find("#hidTachIndex").val(), 10) + 1);
                var hidCLID = $(this).find("#hidCLID").val();
                if (prevTB == this)
                {
                    if (!$(this).attr("clickNum"))
                    {
                        $("#btnAddPerson").hide();
                        $("#hidPrevClickTB").val("");
                        $(this).css("border", "").attr("clickNum", !$(this).attr("clickNum"));
                    }
                    else
                    {
                        $("#btnAddPerson").show();
                        $("#hidPrevClickTB").val(hidCLID);
                        $(this).css("border", "2 solid #cc66ff").attr("clickNum", !$(this).attr("clickNum"));
                        if ($(this).find("img.img-human").length > 0)
                        {
                            $("#btnRefreshPerson").trigger("click");
                        }
                        else
                        {
                            $("tr[id$='ucFlowCreate_trData']").hide();
                        }
                    }
                }
                else
                {
                    if (prevTB != null)
                    {
                        $(prevTB).css("border", "");
                    }
                    $(this).css("border", "2 solid #cc66ff").attr("clickNum", false);
                    prevTB = this;
                    $("#btnAddPerson").show();
                    $("#hidPrevClickTB").val(hidCLID);
                    if ($(this).find("img.img-human").length > 0)
                    {
                        $("#btnRefreshPerson").trigger("click");
                    }
                    else
                    {
                        $("tr[id$='ucFlowCreate_trData']").hide();
                    }
                }
            });
        }

        if ($("#hidPrevClickTB").val() != "")
        {
            if ($(this).find("#hidCLID").val() == $("#hidPrevClickTB").val())
            {
                $("#hidInsertIndex").val(parseInt($(this).find("#hidTachIndex").val(), 10) + 1);
                $("#btnAddPerson").show();
                prevTB = this;
                $(this).attr("clickNum", false).css("border", "2 solid #cc66ff");
            }
        }
    });

    //是否显示监控设置
    $("#rdlIsUseList").click(function ()
    {
        showControlSetting(this);
    });

    var showControlSetting = function (obj)
    {
        var $chk = $(obj).find(":radio:checked");
        if ($chk.val() == "Y")
        {
            $("#trControlSetting").show();
        }
        else
        {
            $("#trControlSetting").hide();
        }
    }
    if ($("#rdlIsUseList").length > 0)
    {
        showControlSetting($("#rdlIsUseList")[0]);
    }

    var strCorpID = $("#hidCorpID").val();
    //监控设置表的事件委托
    $("#tbControlSetting").click(function (event)
    {
        if (event.target.type && event.target.type.toUpperCase() == "BUTTON")
        {
            showModal(event.target);
            event.stopPropagation();
        }
    });

    var showModal = function (jObj)
    {
        var $tr = $(jObj).closest("tr");
        $pointObj.$curInputs = $tr.find(":input"); //关联全局变量，以备打开的模式窗口调用

        var value = openModalWindow(pageArgus.rootDir + "/Common/Select/VSelectMultiStation.aspx?Aim=Multi&From=ContSetting&CorpID=" + pageArgus.corpID, 1000, 700);
        if (value)
        {
            var $chk = $(jObj).closest("table").closest("tr").find(":checkbox");
            if (!$chk.is(":checked"))
            {
                $chk.attr("checked", true);
            }
        }
    }

    //验证
    var checkControl = function ()
    {
        //设置了监控信息启用
        var $chk = $("#tbControlSetting").find(":checkbox:checked");

        var isValidate = true;
        var strSettingInfo = "";

        $chk.each(function ()
        {
            var $input = $(this).closest("tr").find("input");
            if ($input[1].value == "" || $input[2].value == "")
            {
                isValidate = false;
                return false;
            }

            strSettingInfo += "^" + this.value + "*" + $input[1].value + "|" + $input[2].value;
        });

        if ($("#rdlIsUseList").find(":radio:checked").val() == "Y")
        {
            if ($chk.length == 0)
            {
                return alertMsg("请选择启用监控方式！");
            }
            
            if (!isValidate)
            {
                return alertMsg("监控人和查阅人不能为空！")
            }
        }

        $("#hidContSettingInfo").val(strSettingInfo.substring(1));
        return true;
    }

    //设置了监控线才需验证监控设置信息
    if ($("#tbControlInfo").css("display") == "block")
    {
        $("button[text*='提交'][onclick*='__doPostBack']:visible").each(function ()
        {
            this.oldonclick = this.onclick;
            this.onclick = function ()
            {
                if (checkControl())
                {
                    this.oldonclick();
                }
            };
        });
    }

});

function btnAddPerson_onclick()
{
    getObj('hidInsertStationID').value = "";
    var top = (window.screen.availheight - 600) / 2;
    var left = (window.screen.width - 800) / 2;
    getObj('hidInsertStationID').value = openModalWindow(pageArgus.rootDir + '/Common/Select/VInsertTachMultiStation.aspx?From=Check&Aim=AddCheckMan', 900, 600);
    if (getObj('hidInsertStationID').value == "" || getObj('hidInsertStationID').value == "undefined")
    {
        return false;
    }
    return true;
}

function selectFixedChecker(checkerCell) {
    var url = '/Common/Select/VSelectMultiStation.aspx?CorpID=' + getObj("hidCorpID").value,
        vValue = openModalWindow(pageArgus.rootDir + url, 0, 0),
        checkerInfo = [];
    
    if (typeof vValue == 'string') {
        var stationInfoArr = vValue.replace(/,/g, "，").split('|');
        var stationIDs = stationInfoArr[0].split('，');
        var stationNames = stationInfoArr[4].split('，');
        var corpNames = stationInfoArr[3].split('，');
        var deptNames = stationInfoArr[5].split('，');
        var employeeNames = stationInfoArr[8].split('，');
        var accountIDs = stationInfoArr[11].split('，');
        var stationCount = stationIDs.length;
        
        for (var i = 0; i < stationCount; i++)
        {
            if (stationIDs[i].length)
            {
                checkerInfo.push({
                    stationID: stationIDs[i],
                    stationName: stripHtml(stationNames[i]),
                    corpName: corpNames[i],
                    deptName: deptNames[i],
                    employeeName: employeeNames[i],
                    accountID: accountIDs[i]
                });
            }
        }
        
        if (!checkerInfo.length)
        {
            return false;
        }
        selectChecker(checkerCell, 'SelectFixedChecker', checkerInfo);
    }
}

/*
 * 选择公司角色审核人的岗位
 * 翁化青 2014-12-02
 */
function selectCorpRoleChecker(checkerCell, frID, ownerID, isMulti) {
    var url = '/Common/Select/CheckFlow/VSelectRoleStation.aspx?IsMulti=' + isMulti + '&FRID=' + frID + '&OwnerID=' + ownerID;
    var checkerInfo = openModalWindow(pageArgus.rootDir + url, 0, 0);
    if (typeof checkerInfo != 'undefined')
    {
        selectChecker(checkerCell, 'SelectCorpRoleChecker', checkerInfo);
    }
}

/*
 * 选择项目角色审核人的岗位
 * 翁化青 2014-12-02
 */
function selectProjectRoleChecker(checkerCell, frID, ownerID, isMulti) {
    var url = '/Common/Select/CheckFlow/VSelectRoleStation.aspx?IsMulti=' + isMulti + '&FRID=' + frID + '&OwnerID=' + ownerID;
    var checkerInfo = openModalWindow(pageArgus.rootDir + url, 0, 0);
    if (typeof checkerInfo != 'undefined')
    {
        selectChecker(checkerCell, 'SelectProjectRoleChecker', checkerInfo);
    }
}

/*
 * 选择审核人的岗位公用方法
 * 翁化青 2014-12-02
 * @param postBackEventName string 回调事件名称
 * @param checkerInfo json-array 选择的审核人信息集合
 */
function selectChecker(checkerCell, postBackEventName, checkerInfo) {
    if (!!checkerInfo) {
        var currentCell = $(checkerCell).closest('table');
        var flid = currentCell.attr('flid');
        var flsid = currentCell.attr('flsid');
        var eventArg = {
            flid: flid,
            flsid: flsid,
            checkerInfo: $.jsonToString(checkerInfo)
        };
        __doPostBack(postBackEventName, $.jsonToString(eventArg));
        return false;
    }
}