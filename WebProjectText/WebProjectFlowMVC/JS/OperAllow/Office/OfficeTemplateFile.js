/*
Office套文类别使用到的JS
作者：程镇彪
日期：2012-07-03
*/
//条件搜索
function reloadData()
{
    if (getObj("ddlCorp"))
    {
        var corpID = getObj("ddlCorp").value;
        $('#dgData').getGridParam('postData').CorpID = corpID;
    }
 
    var sKey = getObj("txtKey").value;
    var type = getObj("ddlOTFTName").value;   
    $('#dgData').getGridParam('postData').OTFTID = type;
    $('#dgData').getGridParam('postData').Key = sKey;
    refreshJQGrid('dgData');
}

//添加
function addVOfficeTemplateFile()
{
    

    if (getObj("ddlCorp") && getObj("ddlCorp").value == "")
    {
        return alertMsg("请选择公司。", getObj("ddlCorp"));
    }
    if (getObj("ddlOTFTName").value == "")
    {
        return alertMsg("请选择套文类别。", getObj("ddlOTFTName"));
    }

    openAddWindow("VOfficeTemplateFileAdd.aspx?CorpID=" + $("#ddlCorp").val() + "&OTFTID=" + $("#ddlOTFTName").val(), 800, 600, "dgData");
}

//编辑
function editVOfficeTemplateFile()
{
    var CorpID = getJQGridSelectedRowsData('dgData', false, 'CorpID');
    openModifyWindow("VOfficeTemplateFileEdit.aspx?CorpID=" + CorpID, 800, 600, "dgData");
}

//删除

function deleteVOfficeTemplateFile()
{
    openDeleteWindow("OfficeTemplateFile", 0, "dgData");
}

//浏览
var renderName = function (value, pt, record)
{
    var vUrl = "'VOfficeTemplateFileBrowse.aspx?ID=" + pt.rowId + "'";
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</div>';
}


function validateSize() {
    handleBtn(false);
    if (getObj("txtOTFName").value == "") {
        handleBtn(true);
        return alertMsg('名称不能为空。', getObj("txtOTFName"));
    }   
    if (getObj("ddlOTFTName").value == "")
    {
        handleBtn(true);
        return alertMsg("请选择套文类别。", getObj("ddlOTFTName"));        
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg('行号必须为正整数。', getObj('txtRowNo'));
    }
    var OTFTName = getObj("ddlOTFTName").options[getObj("ddlOTFTName").selectedIndex].text;
//    alert(getObj("hidPath").value + OTFTName + "\\" + getObj("txtOTFName").value + ".doc");
    if (saveDoc(getObj("hidPath").value))
    {
       
        return true;
    }
    else
    {
        handleBtn(true);
        return false;
    }
   
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}



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
        if (typeof (retVal) == "boolean" && retVal == false)
        {
            return false;
        }
    }
    return true;
}


// 保存文档
function saveDoc(fileName)
{
//    alert(fileName);
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
            return false;
        }
        var docSize = office_OCX_obj.DocSize;
        if (docSize > 50 * 1048576)
        {
            alert("文档大小为" + getRound(docSize / 1048576, 2) + "M，不能超过50M。");
            return ;
        }
       
        var retValue = office_OCX_obj.SaveToURL("../../Common/Doc/DocSave.aspx", "EDITFILE", "", fileName);
       
        if (retValue == "Success")
        {
//            alert("保存成功。");
            return true;
        }
        else
        {
           
            showDocExMsg(retValue);
            return false;
        }
    }
    catch (err)
    {
        alert("发生错误：" + err.number + ":" + err.description);
        return false;
    }
}

function docOpened()
{
    bDocOpen = true;
    office_OCX_obj = getObj("office_OCX");
//    office_OCX_obj.ActiveDocument.Application.UserName = getObj("txtMarkStation").value;
}

function docClosed()
{
    bDocOpen = false;
}

// 打开文档
function openDoc(url)
{
    
    office_OCX_obj = getObj("office_OCX");
    if (typeof (url) != "undefined" && url != "")
    {
        try
        {
            setTimeout(function () { office_OCX_obj.BeginOpenFromURL(url); }, 1);
        }
        catch (err)
        {
            if (confirm("加载失败，是否重新加载?"))
            {
                office_OCX_obj.BeginOpenFromURL(url);
            }

        }
    }
    else
    {

        try
        {
            office_OCX_obj.BeginOpenFromURL("default.doc");
        }
        catch (err)
        {
        }
    }
}


/* 切换公司加载套文类别 */
function resetOfficeTemplateFileType()
{
   
    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetOfficeTemplateFileTypeByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadOfficeTemplateFile,
            error: ajaxError
        });
}

// 套文类别
function loadOfficeTemplateFile(data, textStatus)
{

    var ddlOTFTName = getObj("ddlOTFTName");
    for (var i = ddlOTFTName.length - 1; i > 0; i--)
    {
        ddlOTFTName.remove(i);
    }

    if (data.Count > 0)
    {
//        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = data.Nodes[i].Name;
            ddlOTFTName.add(opt, ddlOTFTName.length);
        }
    }

    reloadData();
}

/***********
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function setDesc(areaName)
{
    $('#' + areaName + '_desc').val('');
    if (areaName == 'areaRight')
    {
        if ($('#rblAllowType input[checked]').val() == "2" && $('#' + areaName).val() == "0")
        {
            var Content = '';
            if ($('#txtRightStation').val() != '')
            {
                Content += '授权岗位：' + $('#txtRightStation').val() + "   ";
            }
            if ($('#txtRightDept').val() != '')
            {
                Content += "授权部门：" + $('#txtRightDept').val() + "    ";
            }          
        }
    }
}


function btnSelectLookStation_Click(action, StationID, Station)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=' + action + '&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj(StationID).value = vValue.split('|')[0];
        getObj(Station).value = vValue.split('|')[1];
    }
}

function btnSelectLookDept_Click(action, DeptID, Dept)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=' + action + '&CorpID=' + getObj("hidCorpID").value, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj(DeptID).value = vValue.split('|')[0];
        getObj(Dept).value = vValue.split('|')[1];
    }
}
***************/

function openSelectAllowDept()
{
    var corpID = $('#hidCorpID').val();
    var vValue;

    vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=AllowDept&CorpID=' + corpID, 0, 0);
  
    if (vValue != "undefined" && vValue != null)
    {

        getObj("hidAllowDeptID").value = vValue.split('|')[0];
        getObj("txtAllowDept").value = vValue.split('|')[1];
    }
}

function openSelectAllowStation()
{
    var corpID = $('#hidCorpID').val();
    var vValue;
    vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=AllowStation&CorpID=' + corpID, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {

        getObj("hidAllowStationID").value = vValue.split('|')[0];
        getObj("txtAllowStation").value = vValue.split('|')[1];
    }       
}
