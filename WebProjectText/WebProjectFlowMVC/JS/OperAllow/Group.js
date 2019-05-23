//工作组 (VGroup.aspx)
//  -添加工作组
function addGroup()
{
    openAddWindow("VGroupAdd.aspx?CorpID=" + ddlCorp.value, 500, 300, "jqGrid");
}

//  -更新工作组
function editGroup()
{
    openModifyWindow("VGroupEdit.aspx", 500, 300, "jqGrid")
}

//  -删除工作组
function delGroup()
{
    openDeleteWindow("Group", 0, "jqGrid");
}


// 工作组查看
function showGroup(cellvalue,options,rowobject)
{
    var url = "'VGroupInfoBrowse.aspx?GroupID=" + rowobject[0] + "'";
    return '<a href="javascript:window.openWindow(' + url + ',800,600)">' + cellvalue + '</a>' ;
}

// 设置
function warrant(cellvalue, options, rowobject)
{
    var url = "'../Permission/VWarrant.aspx?Aim=Group&ID=" + rowobject[0] + "'" ;
    return '<a href="javascript:window.openWindow(' + url + ',960,650)">设置</a>' ; 
}

//  -JqGrid中StationName链接
function RenderLinkStation(cellvalue,options,rowobject)
{
    var url = "'../Station/VStationBrowse.aspx?StationID="+rowobject[0]+"'";
    return '<a href="javascript:window.openWindow('+url+',600,450)">'+cellvalue+'</a>' ; 
}

//  -删除岗位
function btnDelete_Click()
{
    openDeleteWindow("GroupStation",1,"jqGrid");
}

//删除包含项目
function delAllowProject()
{
    openDeleteWindow("AllowProject", 1, "jqGrid1");
}

//添加、更新(VGroupAdd.aspx,VGroupEdit.aspx)
//  -检测输入文本
function validateSize()
{
    handleBtn(false);
    if (getObj("ddlCompany").value == "")
    {
        handleBtn(true);
        return alertMsg("请选择公司。", getObj("ddlCompany"));
    }    
    if (getObj("txtGroupName").value == "")
    {
        handleBtn(true);
        return alertMsg("工作组名称不能为空。", getObj("txtGroupName"));
    }
    if (getObj("txtGroupNo").value == "") {
        handleBtn(true);
        return alertMsg("工作组编号不能为空。", getObj("txtGroupNo"));
    }
    return true;
}

//  -1.1.1
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


//工作组岗位设置（VGroupStationData.aspx）
//  -添加工作组岗位(传参:GroupID)
function btnAddStation_Click()
{
    openAddWindow("./VGroupStation.aspx?GroupID="+getObj("HidID").value,1024,1024,"jqGrid");
}


//工作组项目设置（VGroupProjectData.aspx）
//  -添加工作组项目(传参:GroupID,aim,jqGridID)
function addGroupProject_Click()
{
    var ProjectIDs = getObj()
    openAddWindow("./VSelectAllProject.aspx?GroupID="+getObj("HidGroupID").value+"&aim=" + getObj("HidAim").value + "&jqGridID=jqGrid1",1024,1024,"jqGrid1");
}


//添加工作组岗位(VSelectAllProject.aspx)
//  -回发ddlCompany选中的数据(value返回的ID)
var selectChange=function()
{
    var varCompany=$("#ddlCompany").val();      
    $('#jqGrid1').getGridParam('postData').CorpID=varCompany;   
    refreshJQGrid('jqGrid1');
}

var reloadData=function()
{
    $('#jqGrid').getGridParam('postData').CorpID = $("#ddlCorp").val();   
    $('#jqGrid').getGridParam('postData').KW = getObj("txtKW").value;
    refreshJQGrid('jqGrid');
}

//搜索工作组岗位中的数据(VGroupStationData.aspx)
//  -回发txtFilter中的text数据
var selectStation=function()
{
    var varStation=$("#txtFilter").val();      
    $('#jqGrid').getGridParam('postData').Station=varStation;   
    refreshJQGrid('jqGrid');
}

//权限设置
function addGroupPermission()
{
    openAddWindow("../APModel/VPermission.aspx?Aim=Group&ID="+getObj("HidGroupID").value,800,800,"jqGrid");
}

function LinkProjectBrowse(cellvalue,options,rowobject)
{
    var url = "'../../CCMP/Project/VProjectBrowse.aspx?ProjectID="+rowobject[7]+"'";
    return '<div class="nowrap"><a href="javascript:window.openWindow('+url+',510,600)">'+cellvalue+'</a></div>' ;
}

//  -工作组项目添加选择判断
function addSelectAllProject()
{
    var projectID = getJQGridSelectedRowsData('jqGrid1',true,'ProjectID');
    if(projectID == "")
    {
         alert("没有任何数据可供操作。");
         return false;
    }
    return true;
}

//  -工作组岗位添加判断
function addGroupStation()
{
    var groupStationID = getJQGridSelectedRowsData('jqGridAddStation',true,'StationID');   
    var groupID=$("#HidGroupIDs").val()
    
    if(groupStationID == "" || groupID == "")
    {
         alert("没有任何数据可供操作。");
         return false;
    }    
        
    $.ajax(
        {   
            type:"POST",
            url: "FillData.ashx",
            data: { action: "AddGroupStation", GroupStationID:groupStationID,GroupID:groupID },
            dataType: "json",
            success: loadStations,
            error: Errors
        });   
}

function loadStations(data)
{
    var result = "";
    if (data.Count > 0)
    {
        for (var i = 0; i < data.Count; i++)
        {
           result = data.Nodes[i].ID;
           result = data.Nodes[i].Name;
        }
    }
    alert(result);
    refreshJQGrid('jqGridAddStation');
    window.opener.refreshJQGrid("jqGrid");
}

function Errors(data)
{
    var result = "";
    if (data.Count > 0)
    {
        for (var i = 0; i < data.Count; i++)
        {
           result = data.Nodes[i].ID;
           result = data.Nodes[i].Name;
        }
    }
    alert(result);
    refreshJQGrid('jqGridAddStation');
    window.opener.refreshJQGrid("jqGrid");
}