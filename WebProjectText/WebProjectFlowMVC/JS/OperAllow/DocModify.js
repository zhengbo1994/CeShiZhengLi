// JScript 文件
var bDocOpen = false;
var office_OCX_obj;

function strtrim(value)
{
    return value.replace(/^\s+/, '').replace(/\s+document.getElementById/, '');
}

function doFormOnSubmit()
{
    var form = document.forms[0];
    if (form.onsubmit)
    {
        var retVal = form.onsubmit();
        if (typeof(retVal) == "boolean" && retVal == false)
        {
            return false;
        }
    }
    return true;
}

// 打开文档
function openDoc(url)
{
    office_OCX_obj = getObj("office_OCX");
    if (typeof (url) != "undefined" && url != "")
    {	
        try
        {
            alert(url);
            office_OCX_obj.BeginOpenFromURL(url);
        }
        catch(err)
        {   
        }
    }
    else {
        
        try
        {
            office_OCX_obj.BeginOpenFromURL("default.doc");
        }
        catch(err)
        {
        }
    }
}

//打开
function openDocument()
{
    if (getObj("txtFileName").value == "")
    {
        return alertMsg(" 请设置文档Url。", getObj("txtFileName"));
    }
    if (getObj("txtMarkStation").value == "")
    {
         return alertMsg(" 请设置留痕人员。", getObj("txtMarkStation"));
    }
    
    openDoc(getObj("txtFileName").value);
}


//保存
function saveDocument()
{
    saveDoc(getObj("txtFileName").value);
}

// 手工控制是否显示或隐藏修订
function showDocTrack(btn)
{
    if (!bDocOpen)
    {
        alert("没有打开任何文档。");
        return;
    }
    
    // 显示修订，可写
    if (btn.name == "0")
    {
        btn.name = "1";
        btn.value = "隐藏修订";
        setReadOnly(false);
        setTrack(true);
        showTrack(true);
    }
    // 隐藏修订，只读
    else if (btn.name == "1")
    {
        btn.name = "0";
        btn.value = "显示修订";
        setTrack(false);
        showTrack(false);
        setReadOnly(true);
    }
}

// 手工控制浏览页是否显示或隐藏修订
function showBrowserDocTrack(btn) {
    if (!bDocOpen) {
        alert("没有打开任何文档。");
        window.opener = null;
        window.close();
        return;
    }
    // 显示修订，可写           
    if (btn.name == "0") {
        btn.name = "1";
        btn.value = "隐藏修订";
        setReadOnly(false); //可读
        setTrack(false); //不显示修订       
        showTrack(true);
        setReadOnly(true); //只读
    }
    // 隐藏修订，只读
    else if (btn.name == "1") {
        btn.name = "0";
        btn.value = "显示修订";
        setReadOnly(false); //可读
        setTrack(false);  //不显示修订
        showTrack(false);
        setReadOnly(true); //只读
    }
}

// 设置是否显示修订
function setTrack(bValue)
{
    if (!bDocOpen)
    {
        alert("没有打开任何文档。");
        return;
    }	
    office_OCX_obj.ActiveDocument.TrackRevisions = bValue;
    office_OCX_obj.ActiveDocument.CommandBars("Reviewing").Enabled = bValue;
    office_OCX_obj.ActiveDocument.CommandBars("Track Changes").Enabled = bValue;
    office_OCX_obj.IsShowToolMenu = bValue;
    office_OCX_obj.focus();
}

// 显示或隐藏修订
function showTrack(bValue)
{
    if (!bDocOpen)
    {
        alert("没有打开任何文档。");
        return;
    }
    
    try {
        office_OCX_obj.ActiveDocument.ShowRevisions = bValue;
    }
    catch (err)
    {
    }

}

//选择留痕人员
function btnSelectStation(aim)
{
    var corpID = '';    
    var url="../../Select/OperAllow/VSelectSingleStation.aspx?CorpID="+corpID+"&Aim="+aim;
    var value = openModalWindow(url, 800, 600);

    if (value != "undefined" && value != null)
    {
        getObj("hid"+aim+"ID").value = value.split('|')[0];
        getObj("txt"+aim).value = value.split('|')[1];
    }
}

function docOpened()
{
    bDocOpen = true;
    office_OCX_obj = getObj("office_OCX");
    office_OCX_obj.ActiveDocument.Application.UserName = getObj("txtMarkStation").value;
}

function docClosed()
{
   bDocOpen = false;
}

// 文档保护
function setReadOnly(bValue) 
{   
    try
    {
    if (bValue)
    {
        office_OCX_obj.IsShowToolMenu = false;
    }
    with(office_OCX_obj.ActiveDocument)
    {
        if (office_OCX_obj.DocType == 1)        //word
        {
            if ((ProtectionType != -1) && !bValue)
            {
	            Unprotect();
            }
            if ((ProtectionType == -1) && bValue)
            {
	            Protect(2, true, "");
            }
        }
        else if (office_OCX_obj.DocType == 2)    //excel
        {
            for(var i = 1; i <= Application.Sheets.Count; i++)
            {
	            if (bValue)
	            {
		            Application.Sheets(i).Protect("", true, true, true);
	            }
	            else
	            {
		            Application.Sheets(i).Unprotect("");
	            }
            }
            if (bValue)
            {
	            Application.ActiveWorkbook.Protect("", true);					
            }
            else
            {
	            Application.ActiveWorkbook.Unprotect("");
            }
        }
    }
}
catch(err)
{
    alert("发生错误：" + err.number + ":" + err.description);
}
}

// 保存文档
function saveDoc(fileName)
{
    if (!bDocOpen)
    {
        alert("没有打开任何文档。");
        return false;
    }	
    if ((strtrim(fileName) == ""))
    {
        alert("文件路径错误。");
        return false;
    }
    
    try
    {
        if (!doFormOnSubmit())
        {
            return;
        }
        var docSize = office_OCX_obj.DocSize;
        if (docSize > 50 * 1048576)
        {
            alert("文档大小为" + getRound(docSize / 1048576, 2) + "M，不能超过50M。");
            return false;
        }
        var retValue = office_OCX_obj.SaveToURL("../../Doc/DocSave.aspx", "EDITFILE", "", fileName);
        if (retValue == "Success")
        {
            alert("保存成功。");
            return false;
        }
        else
        {
            showDocExMsg(retValue);
            return false;
        }
    }
    catch(err)
    {
        alert("发生错误：" + err.number + ":" + err.description);
        return false;
    }
}

