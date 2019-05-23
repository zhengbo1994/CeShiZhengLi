/*
客户自定义配置--代收费设置使用到的JS
作者：程镇彪
日期：2012-08-16
*/
//条件搜索
function reloadData()
{
    var sProjectGUID = $('#ddlProjectGUID').val();
//    var sKey = getObj("txtKey").value;
//    alert(sProjectGUID)
    $('#jqData').getGridParam('postData').ProjectGUID = sProjectGUID;
//    $('#jqData').getGridParam('postData').Key = sKey;
    refreshJQGrid('jqData');
}
//添加
function addVCallsReturnTimeSet() 
{   
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openAddWindow("VCallsReturnTimeSetAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqData");
}

//编辑
function editVCallsReturnTimeSet()
{
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow("VCallsReturnTimeSetEdit.aspx?ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqData");
   
}

//删除
function deleteVCallsReturnTimeSet() 
{
    openDeleteWindow("CallsReturnTimeSet", 13, "jqData");
}


function validateSize() 
{
    handleBtn(false);
    if (!isPositiveInt(getObj("txtRankNo").value))
    {
        handleBtn(true);
        return alertMsg('跟进步骤必须为正整数。', getObj('txtRankNo'));
    }

    if ($("#ddlTimeType").val() == "")
    {
        handleBtn(true);
        return alertMsg('请选择时间点类型。', getObj('ddlTimeType'));
    }
    if ($("#ddlClientStatus").val() == "")
    {
        handleBtn(true);
        return alertMsg('请选择时间点。', getObj('ddlClientStatus'));
    }
    if (!isPositiveInt(getObj("txtAfterDays").value))
    {
        handleBtn(true);
        return alertMsg('时间点之后天数必须为正整数。', getObj('txtAfterDays'));
    }
    return true;
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function CalculationMethodChange()
{   
    if (getObj("ddlCalculationMethod").selectedIndex != 3)
    {
        getObj("txtChargeMoney").value = "0.00";
        getObj("txtChargeMoney").style.borderColor = "#c0c4cf";
        getObj("txtChargeMoney").readOnly = true;
    }
    else
    {
        getObj("txtChargeMoney").style.borderColor = "";
        getObj("txtChargeMoney").readOnly = false;
    }
}

/* 切换时间点类型加载时间点 新增 */
function TimeTypeChange()
{
  
    var TimeType = $("#ddlTimeType").val(); //时间点类型
 
    switch (TimeType)
    {
        case "1":
            SetClientStatus();
            break;
        case "2":
            GetIntentionConfigItem();
            break;
        default:
            DelIntentionConfigItem();
            break;
    }
}
function GetIntentionConfigItem()
{
   
    $.ajax(
        {
            url: "VCallsReturnTimeSetAdd.aspx",
            data: { action: "GetIntentionConfigItem" },
            dataType: "json",
            success: SetIntentionConfigItem,
            error: ajaxError
        });
}
//清空时间点选项
function DelIntentionConfigItem()
{
    var ddlClientStatus = getObj("ddlClientStatus");
    for (var i = ddlClientStatus.length - 1; i > 0; i--)//保留表头“请选择”
    {
        ddlClientStatus.remove(i);
    }

}

// 加载
function SetIntentionConfigItem(data, textStatus)
{
    var ddlClientStatus = getObj("ddlClientStatus");
    DelIntentionConfigItem();
   
    if (data.Count > 0)
    {
      
        for (var i = 0; i < data.Count; i++)
        {
            
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = data.Nodes[i].Name;
            ddlClientStatus.add(opt, ddlClientStatus.length);
        }
        getObj("hdClientStatus").value = data.Nodes[0].ID;
    }
}
function SetClientStatus()
{
    DelIntentionConfigItem();

    var ddlClientStatus = getObj("ddlClientStatus");
    ddlClientStatus.options.add(new Option("咨询", "1"));
    ddlClientStatus.options.add(new Option("看房", "2"));
    ddlClientStatus.options.add(new Option("预约", "3"));
    ddlClientStatus.options.add(new Option("认购", "4"));
    ddlClientStatus.options.add(new Option("签约", "5"));
    ddlClientStatus.options.add(new Option("入伙", "6"));
    ddlClientStatus.options.add(new Option("丢失", "7"));
    getObj("hdClientStatus").value = "1";
}


function ClientStatusChange()
{

    //getObj("hdClientStatus").value = $("#ddlTimeType").val();
    getObj("hdClientStatus").value = $("#ddlClientStatus").val();
}