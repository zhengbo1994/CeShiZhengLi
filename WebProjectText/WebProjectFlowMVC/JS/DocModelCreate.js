// 用于申请起草页，操纵流程的正文模板文档

function setUseDocModel(chk)
{
    if (getObj("trDocModel") == null)
    {
        return false;
    }
    if (chk.checked)
    {
        getObj("hidDocIsShow").value = "Y";
        getObj("btnShowDocModel").disabled = false;
        getObj("btnShowDocModel").value = getObj("hidDocModelDisplay").value == "none" ? "显示正文" : "隐藏正文";
        getObj("btnInitDocModel").disabled = getObj("hidDocModelDisplay").value == "block" ? false : true;
        getObj("btnSaveKnowledge").disabled = getObj("hidDocModelDisplay").value == "block" ? false : true;
        getObj("btnAddIframeHeight").disabled = getObj("hidDocModelDisplay").value == "block" ? false : true;
        getObj("btnMinusIframeHeight").disabled = getObj("hidDocModelDisplay").value == "block" ? false : true;
        getObj("ifrDocModel").style.display = getObj("hidDocModelDisplay").value;
        if (getObj("hidDocModelDisplay").value == "block" && getObj("ifrDocModel").src == "" && getObj("hidDocModelUrl").value != "")
        {
            getObj("ifrDocModel").src = getObj("hidDocModelUrl").value;
        }       
    }
    else
    {
        getObj("ifrDocModel").src = ""; //取消正文留痕文档src设置为""，再次勾选重新加载已选择的合同范本
        getObj("ifrDocModel").style.display = "none";
        getObj("btnShowDocModel").disabled = true;
        getObj("btnInitDocModel").disabled = true;
        getObj("btnSaveKnowledge").disabled = true;
        getObj("btnAddIframeHeight").disabled = true;
        getObj("btnMinusIframeHeight").disabled = true;
        getObj("hidDocIsShow").value = "N";
    }
    //chengzb 20120822
    if (getObj("ddlOTFName") != null )
        getObj("ddlOTFName").disabled = !chk.checked;
    if (getObj("btnTemplateFile") != null )
        getObj("btnTemplateFile").disabled = !chk.checked;
    if (getObj("ddlOSName") != null )
        getObj("ddlOSName").disabled = !chk.checked;
    if (getObj("btnOfficeSeal") != null )
        getObj("btnOfficeSeal").disabled = !chk.checked;
    if (getObj("btnHandSecSign") != null )
        getObj("btnHandSecSign").disabled = !chk.checked;

}

function showDocModel(btn)
{
    getObj("hidDocModelDisplay").value = getObj("hidDocModelDisplay").value == "none" ? "block" : "none";
    btn.value = getObj("hidDocModelDisplay").value == "none" ? "显示正文" : "隐藏正文";
    getObj("btnInitDocModel").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("btnSaveKnowledge").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("btnAddIframeHeight").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("btnMinusIframeHeight").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("ifrDocModel").style.display = getObj("hidDocModelDisplay").value;
    if (getObj("hidDocModelDisplay").value == "block" && getObj("ifrDocModel").src == "" && getObj("hidDocModelUrl").value != "")
    {
        getObj("ifrDocModel").src = getObj("hidDocModelUrl").value;
    }
     //chengzb 20120822
    if (getObj("ddlOTFName"))
        getObj("ddlOTFName").disabled = getObj("hidDocModelDisplay").value == "none";
    if (getObj("btnTemplateFile"))
        getObj("btnTemplateFile").disabled = getObj("hidDocModelDisplay").value == "none";
    if (getObj("ddlOSName"))
        getObj("ddlOSName").disabled = getObj("hidDocModelDisplay").value == "none";
    if (getObj("btnOfficeSeal"))
        getObj("btnOfficeSeal").disabled = getObj("hidDocModelDisplay").value == "none";
    if (getObj("btnHandSecSign"))
        getObj("btnHandSecSign").disabled = getObj("hidDocModelDisplay").value == "none";
}

function changeIframeHeight(size)
{
    var ifrModel = getObj("ifrDocModel");
    var iframeWin = window.frames("DocModel");
    var height = parseInt(ifrModel.offsetHeight);
    if(height + size >= 300)
    {
        ifrModel.style.height = height + size;
        if (typeof iframeWin.changeDocContainerHeight == 'function')
        {
            iframeWin.changeDocContainerHeight(size);
        }
    }
}
    
function saveDocModel()
{
    if(getObj("trDocModel") == null || !getObj("chkUseDocModel").checked || getObj("ifrDocModel").src == "")
    {
        return true;
    }
    
    if (getObj("hidIsBunchOrParataxis") != null && getObj("hidIsBunchOrParataxis").value == "Parataxis")
    {
        return window.frames("DocModel").saveDocWhenParataxis();
    }
    else
    {
        return window.frames("DocModel").saveDoc();
    }
}

function useOriDocModel()
{
    getObj("hidDocName").value = getObj("hidOriDocName").value;
    getObj("hidDocModelUrl").value = getObj("hidOriDocModelUrl").value;
    getObj("chkUseDocModel").checked = true;
    getObj("ifrDocModel").src = "";
    setUseDocModel(getObj("chkUseDocModel"));

    
}