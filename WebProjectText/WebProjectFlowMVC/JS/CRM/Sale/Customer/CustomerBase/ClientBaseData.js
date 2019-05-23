// JScript 文件


// 上一步

function LastStep()
{
    var projectGUID = GetQueryString("ProjectGUID");
    var clientName = GetQueryString("ClientName");
    window.location.href('../../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ProjectGUID=' + projectGUID + '&ClientName=' + clientName);
 }


// 信息验证
function validateSize()
{

    handleBtn(false);
    if (getObj("txtClientName").value == "") //
    {
        handleBtn(true);
        return alertMsg('客户名称不能为空。', getObj("txtClientName"));
    }

    if (trim(getObj("txtMobileNumber").value) == "" && trim(getObj("txtHomeNumber").value) == "" && trim(getObj("txtOfficeNumber").value) == "") //
    {
        handleBtn(true);
        return alertMsg('至少填写一种电话联系方式。', getObj("txtMobileNumber"));
    }

//    if (!isPositiveInt(getObj("txtSortNo").value))
//    {
//        handleBtn(true);
//        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
//    }

    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


// 选择客户
function selectClient(clientDataStr)
{
    var data = {
        ClientGUID: getObj('hdClientGUID').value,
        ClientBaseGUID: getObj("hdClientBaseGUID").value
    };
    var clientInfoFn = getParamValue("clientInfoFn");

    if (typeof window.opener[clientInfoFn] != 'undefined')
    {
        window.opener[clientInfoFn](data);
    }

    window.close();
}

    
// 获取URL参数值
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//显隐区块
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}
