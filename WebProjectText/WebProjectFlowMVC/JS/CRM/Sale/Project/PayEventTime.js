// JScript 文件

function validateSize()
{
    handleBtn(false);
    //楼栋名称不能为空
    if ($("#rdlUseRange input:checked").val() == "1" && getObj("txtBuildingNameList").value == "")
    {
        handleBtn(true);
        return alertMsg('楼栋名称不能为空。', getObj("txtBuildingNameList"));
    }
    //付款事件
    if ($("#ddlPayTypeTimeConfigItemGUID").val() == "")
    {
        handleBtn(true);
        return alertMsg('请选择付款事件。', getObj("ddlPayTypeTimeConfigItemGUID"));
    }    
  
    if (getObj("txtPayEventTime").value == "")
    {
        handleBtn(true);
        return alertMsg('时间不能为空。', getObj("txtPayEventTime"));
    }
    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


//选择楼栋
function selectBuildingName()
{
    var ProjectGUID = getObj("hidProjectGUID").value
    var data = openModalWindow('../../../Common/Select/CRM/VSelectBuildingInfo.aspx?IsMulti=Y&ProjectGUID=' + ProjectGUID, 800, 600);
     
    if (data)
    {
        data = data.substr(0, data.length - 1);
        var names = "";
        var ids = "";
        var tmp = data.split('|');
       
        for (var i = 0; i < tmp.length; i++)
        {
            names += "," + tmp[i].split(',')[1]; //楼栋名称
            ids += "," + tmp[i].split(',')[0]; //楼栋ID  
        }
        if (names)
        {
            names = names.substr(1);
        }
        if (ids)
        {
            ids = ids.substr(1);
        }
      
        getObj("txtBuildingNameList").value = names;
        getObj("hidBuildingNameList").value = ids;

    }
    else
    {
        return;
       
    }
}