//新建
function btnAdd_Click()
{
    var corpid = getObj("ddlCorp").value;
    openAddWindow("VExamOrganizationAdd.aspx?CorpID=" + corpid, 400, 300, "jqGrid1");
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VExamOrganizationEdit.aspx", 400, 300, "jqGrid1");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("ExamOrganizationConfig", 1, "jqGrid1");
}

function btnSetting_Click()
{
    openAddWindow("VExamGradeSet.aspx", 800, 600, "jqGrid1");
}

function btnImport_Click()
{
    openModifyWindow("VExamOrganizationImport.aspx?CorpID=" + getObj("ddlCorp").value, 450, 200, "jqGrid1");
}

function btnSearch_Click()
{
    reloadListData();
}

function ddlCorp_Change()
{
    reloadListData();
}

function reloadListData()
{
    var query = { CorpID: getObj("ddlCorp").value, SearchText: getObj("txtKey").value };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VExamOrganizationBrowse.aspx?EOCID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function renderOperateLink(cellvalue, options, rowobject)
{
    var url = "'VExamOrganizationSet.aspx?EOCID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)"> 设置 </a>';
}

function validateSize()
{
    if (getObj("txtEOCName").value == "")
    {
        return alertMsg("组织配置不能为空。", getObj("txtEOCName"));
    }

    if (getObj("ddlCorp"))
    {
        if (getObj("ddlCorp").value == "")
        {
            return alertMsg("公司不能为空。", getObj("ddlCorp"));
        }
    }

    return true;
}

function validateOrgSize()
{

    if (getObj("txtEOName").value == "")
    {
        return alertMsg("组织名称不能为空。", getObj("txtEOName"));
    }

    if (getObj("ddlParentEO"))
    {
        if (getObj("ddlParentEO").value.indexOf(getObj("hidEOID").value) != -1)
        {
            return alertMsg("上级组织不能为自己。", getObj("ddlParentEO"));
        }
    }

    return true;
}

//添加组织 
// 0-同级 1-下级
function addOrganization(action)
{
    var eoID = window["EOID"];
    if (!eoID)
    {
        return alertMsg('请选择一个组织。');
    }
    if (eoID == "TotalExamOrg" && action == 0)
    {
        return alertMsg('根组织只能新增下级。');
    }

    var eocID = getObj("hidEOCID").value;

    action = (action == 0 ? "AddFriend" : "AddSon");

    openWindow("VExamOrgAdd.aspx?Action=" + action + "&EOID=" + eoID + "&EOCID=" + eocID, 400, 400);
}

function editOrganization()
{
    var eoID = window["EOID"];
    if (!eoID)
    {
        return alertMsg('请选择一个组织。');
    }

    var eocID = getObj("hidEOCID").value;

    openWindow("VExamOrgEdit.aspx?EOID=" + eoID + "&EOCID=" + eocID, 400, 400);
}

function deleteOrganization()
{
    var eoID = window["EOID"];
    if (!eoID)
    {
        return alertMsg('请选择一个组织。');
    }
    openDeleteWindow("ExamOrganization", 1, eoID);
}

function btnDeleteStation_Click()
{
    try
    {
        openDeleteWindow("ExamOrganizationStation", 1, "jqGrid1", "Main");
    } catch (e)
    {
        alertMsg('请选择一个组织。');
    }
}

function btnSet_Click()
{
    var eoID = window["EOID"];
    if (!eoID)
    {
        return alertMsg('请选择一个组织。');
    }
    openWindow("VExamOrganizationStation.aspx?EOID=" + eoID + "&JQID=jqGrid1", 400, 400);
}

///改变被选中的节点样式 
function changeBackColor(span)
{
    var obj = document.getElementsByName("EOName");
    for (i = 0; i < obj.length; i++)
    {
        obj(i).className = 'normalNode';
    }
    span.className = "selNode";
}

//点击节点后(左边树调用)
function refreshOrganiztionInfo(indexID)
{
    parent["EOID"] = indexID;
    window.parent.frames('Main').reloadData();
}

function reloadData()
{
    var query = { EOID: parent["EOID"] };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}

// 岗位查看
function showStation(cellvalue, options, rowobject)
{
    var struID = parent["EOID"];
    var url = "'../../../OperAllow/Station/VStationInfoBrowse.aspx?StationID=" + rowobject[1] + "&StruID=" + struID + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}