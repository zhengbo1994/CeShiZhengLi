// JScript 文件
//增加
function addCurrency()
{
    openAddWindow("VCurrencyAdd.aspx", 500, 300, "jqCurrency");
}

//修改
function editCurrency()
{  
    if(getJQGridSelectedRowsID("jqCurrency",true).length==1)
    {
//          if(stripHtml(getJQGridSelectedRowsData("jqCurrency",true,"IsAdminCreate")[0])=="Y")
//          {
//            alert("系统自动生成的货币不允许修改");
//          }
//          else
//          {
            openModifyWindow("VCurrencyEdit.aspx", 500, 300, "jqCurrency") ;   
//          }
    }         
       
}   
  
//提交验证       
function validateSize()
{
    handleBtn(false);
    if (getObj("txtCurrencyCode").value == "")
    {
        handleBtn(true);
        return alertMsg("货币代码不能为空。", getObj("txtCurrencyCode"));
    }
    if (getObj("txtCurrencyName").value == "")
    {
        handleBtn(true);
        return alertMsg("货币名称不能为空。", getObj("txtCurrencyName"));
    }
    if (getObj("txtCurrencySymbol").value == "")
    {
        handleBtn(true);
        return alertMsg("货币符号不能为空。", getObj("txtCurrencySymbol"));
    }
    if (getObj("txtExchangeRate").value == ""|| getObj("txtExchangeRate").value.indexOf('-')>-1)
    {
        handleBtn(true);
        return alertMsg("兑换汇率不能为空或者负数。", getObj("txtExchangeRate"));
    }
    if (getObj("txtCountryOrRegion").value == "")
    {
        handleBtn(true);
        return alertMsg("国家和地区不能为空。", getObj("txtCountryOrRegion"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function setDefault(strStateID,type,isEnabled)
{
    if(isEnabled=="N")
    {
        alert("无效货币代码，不能设置");
        return;
    }
    var appendParams={Type:type};
    $("#jqCurrency").resetSelection();
    $("#jqCurrency").setSelection(strStateID,false);
    var strConfirm="确定设置为默认货币？";
    openConfirmWindow("CurrenyState",strConfirm, "jqCurrency", appendParams);
}


