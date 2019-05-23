// JScript 文件

// DataGrid加载

function reloadData()
{
    var hiddSchemeID = $("#hiddSchemeID").val();
    ajax(location.href, { "SchemeID": hiddSchemeID }, "json", loadBuilding);
}

function loadBuilding(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

// 添加补差方案明细
function addSchemeDeatil()
{
    // 先删除方案明细
    var DetailID = $("#hiddDetailID").val();
    $.post('FillData.ashx', { action: "CRM_DelMakeUpMoneyDetail", DetailID: DetailID });
    $("#hiddDetailID").val("");

    // 打开添加明细
    var schemeID = $("#hiddSchemeID").val();
    openAddWindow("VBuChaSchemeDetail.aspx?schemeID=" + schemeID, 800, 600);
}

// 修改
function editScheme()
{
    openModifyWindow("VBuChaSchemeAdd.aspx", 800, 600, "jqBuChaScheme");
}

//删除
function btnDelete_Click()
{
    //openDeleteWindow("MakeUpMoneySet", 7, "jqBuChaScheme");
}

// 删除补差明细
var ids;
function btnDelDetail_Click()
{
    ids = $("#hiddDetailID").val();
    $("input:checked").each(function ()
    {
        var val = $(this).val();
        if (val != null && val.length == 36)
        {
            ids += val + ",";
            //$(this).parent().parent().remove();
        }
    })
    if (ids == "")
    {
        alert("请先勾选中要删除的行再操作！");
        return;
    }
    if (confirm("是否删除补差明细？"))
    {
        $("input:checked").each(function ()
        {
            var val = $(this).val();
            if (val != null && val.length == 36)
            {
                $(this).parent().parent().remove();
            }
        })
        $("#hiddDetailID").val(ids);
    }
}

//选择制定人
function seleSubscriptionAddStationName()
{
    var corpID = ''; //暂时不理 '<% = strCorpID %>';
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 800, 600);

    if (rValue != "undefined" && rValue != null)
    {
        var name = rValue.split('|')[1];
        if (name.indexOf('(') + 1 == name.indexOf(')'))
        {
            alert('请选择有姓名的制定人！');
            return;
        }
        getObj("hidSubscriptionAddStationName").value = rValue.split('|')[5];
        getObj("txtSubscriptionAddStationName").value = rValue.split('|')[1];
    }

}


function TestSelect()
{
    var rValue = openModalWindow('../../../Common/Select/CRM/VSelectConfig.aspx?configCode=4001', 800, 600);
    alert(rValue);

}


