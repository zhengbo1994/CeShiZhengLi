
//        模块名称 :供应商管理导航-材料设备-材料设备性质分类-表单设计
//        文件名称 :VCustomFormColumn.js
//        文件说明 :表单设计
//        作者: 马吉龙
//        日期: 2010-5-25 10:18:14

function addCustomFormColumn()
{

    openAddWindow("VCustomFormColumnAdd.aspx?FormID="+getObj("FormID").value, 600, 400, "jqGrid1");
}

function editCustomFormColumn()
{

    openModifyWindow("VCustomFormColumnEdit.aspx?FormID="+getObj("FormID").value, 600, 400, "jqGrid1")
}

function delCustomFormColumn()
{
    openDeleteWindow("CustomFormColumn", 0, "jqGrid1");
}


function validateSize(isPara)
{
   
    handleBtn(false);
    if (getObj("txtColName").value == "")
    {
        handleBtn(true);
        return alertMsg("列名不能为空。", getObj("txtColName"));
    }
    if (ddlColType.options[ddlColType.selectedIndex].value == "6")
    {
        if (tbColItem.rows.length < 2)
        {
            handleBtn(true);
             return alertMsg("选择型的列应设置列选项列表。", btnAddtbColItem);
        }
        else
        {
            for (var i = 1; i < tbColItem.rows.length; i++)
            {
                if (TR$(tbColItem, i, "input", 1).value == "")
                {
                    handleBtn(true);
                   return alertMsg("列选项的值不能为空。", TR$(tbColItem, i, "input", 1)); 
                }
            }
        }
    }
    if (getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    if(isPara=="Edit")
    {
        saveColItemInfoEdit();
        
    }else
    {
        saveColItemInfo();
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


//生成项目配置信息链接的方法
 function RenderLink(cellvalue,options,rowobject)
 {
      var url = "'VCustomFormColumnBrowse.aspx?ColID="+rowobject[0]+"'";
      return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',600,400)">'+cellvalue+'</a></div>' ;
 }
 

function setDisplay()
{
    var colType = ddlColType.options[ddlColType.selectedIndex].value;
    trSelectColItem.style.display = (colType == "6") ? "block" : "none";
    trLength1.style.display = (colType == "0") ? "block" : "none";
    trLength2.style.display = (colType == "3") ? "block" : "none";
    trUnit.style.display = (colType == "2" || colType == "3") ? "block" : "none";
    trColItem.style.display = (colType == "6" && tbColItem.rows.length > 1) ? "block" : "none";
    trSM.style.display = (colType == "6" ) ? "block" : "none";
}


function addDetail(table)
{
    var cnt = table.rows.length;    
    var row = table.insertRow();        
     cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml();
    
    cell = row.insertCell(1); 
    cell.innerHTML=getTextBoxHtml();    
        
    cell = row.insertCell(2);
 
   cell.innerHTML=getTextAreaHtml(); 
    setRowAttributes(row);
    setDisplay();
}


// 获取表格table中第rowIndex行的标记为tagName的HTML控件数组中的第tagIndex个控件
function TR$(table, rowIndex, tagName, tagIndex)
{
return table.rows(rowIndex).getElementsByTagName(tagName).item(tagIndex);
}
function deleteDetail(table)
{
    var cnt = table.rows.length - 1;
    for(var j = cnt; j > 0; j--)
    {
	    if(TR$(table, j, "input", 0).checked)
	    {
		    table.deleteRow(j);
	    }
    }
    TR$(table, 0, "input", 0).checked = false;
    
    for (var i = 1; i < table.rows.length; i++)
    {
        table.rows(i).className = table.rows(i).rowIndex % 2 == 1 ? "dg_row" : "dg_alternaterow";
    }
    
    setDisplay();
}

function saveColItemInfo()
{
  
    hidColItemList.value = "";
    if (ddlColType.options[ddlColType.selectedIndex].value == "6")
    {
        for (var i = 1; i < tbColItem.rows.length; i++)
        {
            var colName = TR$(tbColItem, i, "input", 1).value.replace(/\^/g, '').replace(/\|/g, '');
            var remark = TR$(tbColItem, i, "textarea", 0).value.replace(/\^/g, '').replace(/\|/g, '');
            hidColItemList.value += "^" + colName + "|" + remark;
        }
        if (hidColItemList.value != "")
        {
            hidColItemList.value = hidColItemList.value.substr(1);
        }
    }
}
function saveColItemInfoEdit()
{
    hidColItemList.value = "";
    if (ddlColType.options[ddlColType.selectedIndex].value == "6")
    {
        for (var i = 1; i < tbColItem.rows.length; i++)
        {
            var itemID = TR$(tbColItem, i, "input", 0).value;
            var colName = TR$(tbColItem, i, "input", 1).value.replace(/\^/g, '').replace(/\|/g, '');
            var remark = TR$(tbColItem, i, "textarea", 0).value.replace(/\^/g, '').replace(/\|/g, '');
            hidColItemList.value += "^" + itemID + "|" + colName + "|" + remark;
        }
        if (hidColItemList.value != "")
        {
            hidColItemList.value = hidColItemList.value.substr(1);
        }
    }
}

function savePageInfo()
{
    hidColItemHtml.value = tdColItem.innerHTML;
}
        
function bodyLoad()
{
    if (hidIsSaveOpen.value == "Y")
    {
        clearTable(tbColItem);
    }
    
    setDisplay();            
}   


