// 下载模板
function DownExcel()
{
    if (getObj("txtSelectBuildingName").value == "")
    {
        return alertMsg("请先选择需要调价的楼栋。", getObj("txtSelectBuildingName"));
    }

    return true;
}

// 计价方式选择
function priceSelect()
{
    var tbPrice = $("#rdlPriceStyle");
    var tbCalulation = $("#rdlCalculationStyle");
    if ($("#txtPriceAdjustName").val() == "")
    {
        tbCalulation.find("[value='2']").attr("disabled", "disabled");
    }

    tbPrice.find(":radio").live("click",
    function ()
    {
        var currValue = $(this).val();
        var targetValue = tbCalulation.find(":checked").val();
        if (currValue == "1")
        {
            tbCalulation.find(":radio").removeAttr("disabled");
            tbCalulation.find("[value='2']").attr("disabled", "disabled");
            if (targetValue == "2")
            {
                tbCalulation.find("[value='1']").attr("checked", true);
            }
        }
        else if (currValue == "2")
        {
            tbCalulation.find(":radio").removeAttr("disabled");
            tbCalulation.find("[value='1']").attr("disabled", "disabled");
            if (targetValue == "1")
            {
                tbCalulation.find("[value='2']").attr("checked", true);
            }

        } else
        {
            //tbCalulation.find(":radio").attr("disabled", "disabled");
            tbCalulation.find("[value='1'],[value='2']").attr("disabled", "disabled");
            tbCalulation.find("[value='3']").attr("checked", true);
        }
    });

}


//选择 人
function seleSubscriptionAddStationName(type)
{
    var corpID = ''; //暂时不理 '<% = strCorpID %>';
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?validFn=StationWithAccount&CorpID=' + corpID, 800, 600);

    if (rValue != "undefined" && rValue != null)
    {
        if (type == 2)
        {
            getObj("hidID2").value = rValue.split('|')[0];
            getObj("txtName2").value = rValue.split('|')[1];
        }
        else if (type == 3)
        {
            getObj("hidID3").value = rValue.split('|')[0];
            getObj("txtName3").value = rValue.split('|')[1];
        }
        else if (type == 1)
        {
            getObj("hidSubscriptionAddStationName").value = rValue.split('|')[0];
            getObj("txtSubscriptionAddStationName").value = rValue.split('|')[1];
            getObj("hidAccountID").value = rValue.split('|')[5];
            alert(rValue.split('|')[5]);
        }
    }

}

//是否空岗位(配合选人页面selectsinglestation.js)
function StationWithAccount(data) {
    var account = data.split('|')[5];
    if (account != "") return true;
    else return false;
}

// 选择楼栋范围
function selectBuilding()
{
    var ProjectGUID = $("#hidProjectID").val();
    var url = '../../../Common/Select/CRM/VSelectBuildingInfo.aspx?IsProjectFixed=Y&ProjectGUID=' + ProjectGUID + '&IsMulti=Y';
    var rValue = openModalWindow(url, 800, 600);

    if (rValue != null && rValue != "undefined" && rValue != "")
    {
        rValue = rValue.substring(0, rValue.lastIndexOf('|'));
        var dt = rValue.split('|');
        var names = "";
        var ids = "";
        for (var i = 0; i < dt.length; i++)
        {
            names += dt[i].split(',')[1] + ",";
            ids += dt[i].split(',')[0] + ",";
        }
        names = names.substring(0, names.lastIndexOf(','));
        ids = ids.substring(0, ids.lastIndexOf(','));

        getObj("hidSelectBuildingID").value = ids;
        getObj("txtSelectBuildingName").value = names;
    }

}

// 添加
function validateForm(stype) {
    var buildRange = getObj("hidSelectBuildingID").value;
    if (buildRange == "") {
        alertMsg("请选择楼栋范围！");
        return false;
    }
    //保存时方案名，制定人必填
    if (stype == 0)
    {
    var caseName = getObj("txtPriceAdjustName").value;
    if(caseName=="")
    {
         alertMsg("请填写方案名称！", getObj("txtPriceAdjustName"));
        return false;
    }

    var SubscriptionAddStationName = getObj("txtSubscriptionAddStationName").value;
    if (SubscriptionAddStationName == "") {
        alertMsg("请选择制定人！");
        return false;
    }

    }
    var tb = $("#uploadFile").find("tr");

    // 附件地址列表
    var url = "";
    tb.each(function ()
    {
        if ($(this).attr("filename") != undefined)
        {
            url += $(this).attr("filename") + ",";
        }
    });
    url = url.substring(0, url.lastIndexOf(','));
    $("#hidUrl").val(url);

    // post
    //    $.post('VPriceSchemeAdd.aspx', { action: "Add_OnServerClick", projectID: $("#hidProjectID").val() });

    // 提交审核需要导入Excel文件
    if (stype == 2 && getObj("accessaryExcel").rows.length < 1)
    {
        return alertMsg("请上传需要导入的Excel表格文件", getObj("accessaryExcel"));
    }

    return true;
}

// 执行
function btnExec()
{
    $("#hidStatu").val("4");
    $("#txtStatus").val("已执行");
}

// 审核
function btnCheck()
{
    $("#hidStatu").val("3");
    $("#txtStatus").val("已审核");
}

// 修改的选择框处理
function selectPrice(currValue)
{
    var tbCalulation = $("#rdlCalculationStyle");
    var targetValue = tbCalulation.find(":checked").val();

    if (currValue == "2")
    {
        tbCalulation.find("[value='1']").attr("disabled", "disabled");

    } else if (currValue == "3")
    {
        tbCalulation.find("[value='1'],[value='2']").attr("disabled", "disabled");
    }
    else
    {
        tbCalulation.find("[value='2']").attr("disabled", "disabled");
    }
}