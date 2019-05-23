// VSelectMultiExamObject.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-10-12

function reloadData()
{
    var searchText = "";

    if (getObjP("txtKey"))
    {
        searchText = getObjP("txtKey").value;
    }
    var query = { ETID: parent["ETID"], SearchText: searchText };
    
    if (window.frames["Main"].loadJQGrid("jqgExamObject", query))
    {
        window.frames["Main"].refreshJQGrid("jqgExamObject");
    }
}

//查看考核范围链接
function renderObjectLink(cellvalue, options, rowobject)
{
    var url = "'../../../HR/PM/ExamWorkPlan/ExamTask/VExamObjectBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function btnSearch_Click()
{
    window.frames('Main').window.reloadData();
}

function btnChoose_Click()
{
    btnAdd_Click();
    var vObjectID = "";
    var vObjectName = "";
    var vRoleName = "";

    if ($('#hidSelectMode').val().toUpperCase() == 'SINGLE')
    {
        vObjectName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgExamObject', false, 'ObjectName'));
        vRoleName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgExamObject', false, 'RoleName'));
        vObjectID = window.frames('Main').getJQGridSelectedRowsID('jqgExamObject', false);

        if (!vObjectID)
        {
            return alertMsg("请选择考核对象。");
        }
    }
    else
    {
        var lstObjects = getObj("lstObjects");
        for (i = 0; i < lstObjects.length; i++)
        {
            vObjectID += ',' + lstObjects.options[i].value;
            vObjectName += ',' + lstObjects.options[i].text;
            vRoleName += ',' + lstObjects.options[i].RoleName;
        }
        if (vObjectID == "")
        {
            vObjectName = "";
            vObjectID = "";
            vRoleName = "";
        }
        else
        {
            vObjectID = vObjectID.substr(1);
            vObjectName = vObjectName.substr(1);
            vRoleName = vRoleName.substr(1);
        }
    }    

    var returnJson = {
        ObjectIDs: vObjectID,
        RoleNames: vRoleName,
        ObjectNames: vObjectName
    };    

    window.returnValue = returnJson;
    window.close();
}
//end--btnChoose_Click()

function btnAdd_Click(chk)
{

    var lstObjects = getObj("lstObjects");
    if (lstObjects == null)
    {
        
        lstObjects = getObjP("lstObjects");
    }
    try
    {
        var ObjectNames = window.frames('Main').getJQGridSelectedRowsData('jqgExamObject', true, 'ObjectName');
        var RoleNames = window.frames('Main').getJQGridSelectedRowsData('jqgExamObject', true, 'RoleName');
        var ObjectIDs = window.frames('Main').getJQGridSelectedRowsID('jqgExamObject', true);

        if (ObjectIDs.length == 0 & chk == 'chk')
        {
            return alertMsg("请选择考核对象。", getObj("btnAdd"));
        }        

        for (var i = 0; i < ObjectIDs.length; i++)
        {
            var repeat = false;
            for (j = 0; j < lstObjects.length; j++)
            {
                if (lstObjects.options[j].value == ObjectIDs[i])
                {
                    repeat = true;
                    break;
                }
            }

            if (!repeat && ObjectIDs[i] != "")
            {
                var opt = document.createElement("OPTION");
                opt.value = ObjectIDs[i];
                opt.text = $.jgrid.stripHtml(ObjectNames[i]);
                opt.RoleName = $.jgrid.stripHtml(RoleNames[i]);
                lstObjects.add(opt, lstObjects.length);
            }
        }
    }
    catch (ex)
    {
        return false;
    }
}

function btnDel_Click()
{
    var lstObjects = getObj("lstObjects");
    if (lstObjects == null)
    {
        lstObjects = getObjP("lstObjects");
    }
    for (i = lstObjects.options.length - 1; i >= 0; i--)
    {
        if (lstObjects.options[i].selected)
        {
            lstObjects.remove(i);
        }
    }
}

function btnAddAll_Click()
{
    var lstObjects = getObj("lstObjects");
    if (lstObjects == null)
    {
        lstObjects = getObjP("lstObjects");
    }

    var vObjectName = window.frames('Main').getJQGridAllRowsData('jqgExamObject', 'ObjectName');
    var vRoleName = window.frames('Main').getJQGridAllRowsData('jqgExamObject', 'RoleName');
    var vObjectID = window.frames('Main').getJQGridAllRowsID('jqgExamObject', true);

    if (vObjectID.length == 0)
    {
        return;
    }

    for (var i = 0; i < vObjectID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstObjects.length; j++)
        {
            if (lstObjects.options[j].value == vObjectID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vObjectID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vObjectID[i];
            opt.text = $.jgrid.stripHtml(vObjectName[i]);
            opt.RoleName = $.jgrid.stripHtml(vRoleName[i]);
            lstObjects.add(opt, lstObjects.length);
        }
    }
}

function btnDelAll_Click()
{
    var lstObjects = getObj("lstObjects");
    if (lstObjects == null)
    {
        lstObjects = getObjP("lstObjects");
    }
    for (i = lstObjects.options.length - 1; i >= 0; i--)
    {
        lstObjects.remove(i);
    }
}

function lstObjectsDB_Clisk()
{
    var addOption = document.createElement("option ")
    var index

    if (getObj("lstObjects").length == 0) return (false);
    index = getObj("lstObjects").selectedIndex
    if (index < 0) return (false);
    getObj("lstObjects").remove(index)
}

//双击添加人员
function jqGridDblClick(rowid, iRow, iCol, e)
{
    var lstObjects = getObjP("lstObjects");
    if (lstObjects == null)
    {
        lstObjects = window.parent.parent.document.getElementById("lstObjects");
    }
    var vObjectID = rowid;
    var vObjectName = $('#jqgExamObject').getRowData(rowid)['ObjectName'];
    var vRoleName = $('#jqgExamObject').getRowData(rowid)['RoleName'];

    if ($(window.parent.document).find('#lstObjects option[value=\'' + vObjectID + '\']').length <= 0)
    {
        var opt = document.createElement("OPTION");
        opt.value = vObjectID;
        opt.text = $.jgrid.stripHtml(vObjectName);
        opt.RoleName = $.jgrid.stripHtml(vRoleName);
        lstObjects.add(opt, lstObjects.length);
    }
}

//上下移动选项 陈晓明
function move(to)
{
    var list = getObj("lstObjects");
    var total = list.options.length - 1;
    var index = getObj("lstObjects").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;

    //临时保存选项的值
    var text = list.options[index].text;
    var value = list.options[index].value;
    var RoleName = list.options[index].RoleName;

    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value
    list.options[index].RoleName = list.options[index + to].RoleName

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;
    list.options[index + to].RoleName = RoleName;

    //选中索引也跟着变
    list.selectedIndex = index + to;

}