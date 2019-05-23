// JScript 文件
//新增
function addCorpBankAccounts()
{
    var corpID = $("#ddlCorp").val();
    if (corpID == "")
    {
        return alertMsg("请选择公司。", getObj("ddlCorp"));
    }
    openAddWindow("VCorpBankAccountsAdd.aspx?CorpID=" + corpID, 500, 300, "jqCorpBankAccount");
}
//修改
function editCorpBankAccounts()
{
    openModifyWindow("VCorpBankAccountsEdit.aspx", 500, 300, "jqCorpBankAccount")
}

//导入
function importCorpBankAccounts()
{
    var corpID = $("#ddlCorp").val();
    if (corpID == "")
    {
        return alertMsg("请选择公司。", getObj("ddlCorp"));
    }
    openWindow("VCorpBankAccountsImports.aspx?CorpID=" + corpID, 450, 120);
}

//删除
function delCorpBankAccounts()
{
    //var url = "VCorpBankAccountDel.aspx";
    //var ids = getJQGridSelectedRowsID('jqCorpBankAccount', true);
    //var vIsAllowDelete = getJQGridSelectedRowsData('jqCorpBankAccount', true, 'IsAllowDelete');
    //if (ids == "" || ids.length == 0)
    //{
    //    return alertMsg("没有任何记录可供操作。");
    //}

    //if (stripHtml(vIsAllowDelete.join(",")).indexOf('N') != -1)
    //{
    //    return alertMsg("部分数据不能删除。");
    //}

    //if (ids.length > 50)
    //{
    //    return alertMsg("您一次最多只能删除50条记录。");
    //}

    //url += "?JQID=jqCorpBankAccount&ID=" + ids.join(",");
    //var winobj = getOpenWinObj(2);
    //window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
    //    + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
    openDeleteWindow("CorpBankAccount",4,"jqCorpBankAccount")
}


function validateSize()
{
    handleBtn(false);
    if (getObj("hidBankID").value == "")
    {
        handleBtn(true);
        return alertMsg("请选择银行。", getObj("btnBankName"));
    }
    if (getObj("txtSubBankName").value == "")
    {
        handleBtn(true);
        return alertMsg("分/支行名称不能为空。", getObj("txtSubBankName"));
    }
    if (getObj("txtBankAccountNo").value == "")
    {
        handleBtn(true);
        return alertMsg("账号不能为空。", getObj("txtBankAccountNo"));
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


function selectBankName()
{
    openModalWindow('../../Common/Select/CCMP/VSelectBank.aspx', 800, 600);
    getObj('txtBankName').value = getObj('hidBankName').value;
    return false;
}
//银行选择页
function selectBank()
{
    var hidBankID = getObjD('hidBankID');
    var hidBankName = getObjD('hidBankName');
    var ids = getJQGridSelectedRowsID('jqBanks', false);
    if (ids == null || ids == "")
    {
        return alertMsg("选择银行。", getObj("btnLookUp"));
    }

    hidBankID.value = getJQGridSelectedRowsData('jqBanks', false, 'BankID');
    if (hidBankName != null)
    {
        hidBankName.value = stripHtml(getJQGridSelectedRowsData('jqBanks', false, 'BankName'));
    }
    window.close();
}
function clearBankName()
{
    var hidBankID = getObjD('hidBankID');
    var hidBankName = getObjD('hidBankName');
    if (hidBankID != null)
    {
        hidBankID.value = "";
    }
    if (hidBankName != null)
    {
        hidBankName.value = "";
    }
    window.close();
}
function ddlCorp_Change()
{
    var corpID = $("#ddlCorp").val();
    $('#jqCorpBankAccount').getGridParam('postData').CorpID = corpID;
    refreshJQGrid('jqCorpBankAccount');
}