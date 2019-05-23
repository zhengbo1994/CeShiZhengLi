// JScript 文件

//增加基础岗位
function addBasicStation()
{
    openAddWindow("VBasicStationAdd.aspx", 500, 270, "jqGrid1");
}

//修改基础岗位
function editBasicStation()
{
    openModifyWindow("VBasicStationEdit.aspx", 500, 270, "jqGrid1")
}

//删除基础岗位
function delBasicStation()
{
    openDeleteWindow("BasicStation", 1, "jqGrid1");
}

//验证数据
function validateSize()
{
    if (getObj("txtBSName").value == "")
    {
        return alertMsg("基础岗位名称不能为空。", getObj("txtBSName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}

//格式化名称超链接
 function renderLink(cellvalue,options,rowobject)
 {
       if(cellvalue!=null)
        {
            var url = "'VBasicStationBrowse.aspx?ID="+rowobject[0]+"'";
            return '<div class="nowrap"><a  href="javascript:window.openWindow(' + url + ',500,320)">' + cellvalue + '</a></div>';
        }
        else
        {
            return "&nbsp;";
        }        
 }