﻿// JScript 文件

//增加基础架构
function addBasicStructure()
{
    openAddWindow("VBasicStructureAdd.aspx", 500, 270, "jqGrid1");
}

//修改基础架构
function editBasicStructure()
{
    openModifyWindow("VBasicStructureEdit.aspx", 500, 270, "jqGrid1")
}

//删除基础架构
function delBasicStructure()
{
    openDeleteWindow("BasicStructure", 1, "jqGrid1");
}

//验证数值
function validateSize()
{
    if (getObj("txtBSName").value == "")
    {
        return alertMsg("基础部门名称不能为空。", getObj("txtBSName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}

//格式化名称增加超链接
 function renderLink(cellvalue,options,rowobject)
{
     alert(cellvalue);
    if(cellvalue!=null)
        {
           var url = "'VBasicStructureBrowse.aspx?ID="+rowobject[0]+"'";
           return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',500,320)">'+cellvalue+'</a></div>' ;
        }
        else
        {
            return "&nbsp;";
        }         
 }