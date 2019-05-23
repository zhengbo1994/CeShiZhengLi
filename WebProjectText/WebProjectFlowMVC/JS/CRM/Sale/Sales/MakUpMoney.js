var _PageMaster = {};
_PageMaster.isSearching = false;
var extraPrice = '';

// 重新加载数据
function refresh()
{
    var sProjectID = $('#ddlProject').val();
    var sMoneyStatus = $('#ddlSalePriceType').val();
    var search = $('#txtKey').val();
    var query = { ProjectID: sProjectID, MoneyStatus: sMoneyStatus, search: search };
    reloadGridData('idPager', query);
}

function refreshdgData()
{
    refresh();

    // 补差方案
    var sProjectID = $('#ddlProject').val();
    if (sProjectID.length == 36)
    {
        $.post('FillData.ashx', { action: 'CRM_GetMakeUpPriceType', projectID: sProjectID }, function (data)
        {
//            if (!!data)
//            {
//                var first = "'<OPTION value=''>请选择</OPTION>'";
//                $('#ddlPriceScheme').append(first + data.toString());
//            }
            data = !!data ? data : [];
            // 绑定下拉框
            bindDdl(data, "ddlPriceScheme", '', 'SELECT');
        });
    }
}

function reloadData()
{
    refreshdgData();

    // 绑定事件
    $('#ExtraPrice').live('blur', function ()
    {
        var id = $(this).parent().parent().find('.idbox').val();
        var value = $(this).val();
        if (parseFloat(value) || value == '0')
        {
            var indexStart = extraPrice.indexOf(id);
            if (indexStart == -1)
            {
                extraPrice += id + ',' + value + '|';
            } else
            {
                var indexEnd = extraPrice.indexOf('|', indexStart + 36);
                var source = extraPrice.substring(indexStart + 37, indexEnd);
                extraPrice = extraPrice.replace(source, value);
            }
        }
        else
        {
            alert('请输入实数！');
        }
    });

    $('#txtKey').live('keydown', function ()
    {
        var isEnter = window.event.keyCode;
        if (isEnter == 13)
        {
            refreshdgData();
        }
    });

}

function customGridComplete()
{
    _PageMaster.isSearching = false;
}

function Save()
{
    if (extraPrice != '')
    {
        extraPrice = extraPrice.substring(0, extraPrice.lastIndexOf('|'));
        $.post('FillData.ashx', { action: 'CRM_EditMakeUpMoneyActual', extraPrice: extraPrice }, function (data)
        {
            if (data)
            {
                alert('保存成功！');
            }
            else
            {
                alert('保存失败！');
            }
        })
        extraPrice = '';
    }
}

// 计算补差款：所有的
function CalculatorExtraPrice()
{
    $('.dg_table tr:gt(0)').each(function ()
    {
        var current = $(this);
        var makeUpMoneyID = current.find('#ddlPriceScheme').val();
        var contractID = current.find('.idbox').val();
        var isEnable = makeUpMoneyID != '' && makeUpMoneyID.length == 36;
        if (isEnable)
        {
            $.post('FillData.ashx', { action: 'CRM_CalculatorExtraPrice', contractID: contractID, makeUpMoneyID: makeUpMoneyID }, function (data)
            {
                // 修改界面补差款
                current.find('#referencePrice').text(data);
                if (current.find('#ExtraPrice').val() == '0')
                {
                    current.find('#ExtraPrice').val(data);
                }
            });
        }


    });

}

// 批量设置补差方案
function SettingScheme()
{
    // 要修改的ID
    var id = "";
    var values = "";
    $(":checked").each(function ()
    {
        if ($(this).val() != "on")
        {
            $(this).parent().parent().find("select option").each(function ()
            {
                values += $(this).val() + "," + $(this).text() + "|";
            });
            return;
        }
    }
    );
    var count = $(":checked").length;
    if (values == "" || (count == 1 && $(":checked").val() == "on"))
    {
        alert('请先勾选要设置的方案！');
        return;
    } else
    {
        values = values.substring(0, values.lastIndexOf('|'));
    }

    // 要设置的值
    //$.post('SettingScheme.aspx', {values: values });

    var value = openModalWindow("SettingScheme.aspx?isPrice=Y", 250, 180);
    if (value == undefined)
    {
        return;
    } 
    else
    {
        $(":checked").each(function ()
        {
            if ($(this).val() != "on")
            {
                $(this).parent().parent().find("select option[value='" + value + "']").attr("selected", true);
            }
        }
    );
    }


}