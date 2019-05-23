// JScript 文件


function reloadData()
{
    var sProjectGUID = getObj("ddlProject").value;
    if (sProjectGUID != "C")
    {
        ajax(location.href, { "ProjectGUID": sProjectGUID }, "json", loadBuilding);
    }
}

function loadBuilding(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}

// 添加团队
function addTeam()
{
    var projID = $("#ddlProject").val();
    if (projID.length < 36)
    {
        alert('请选择公司下的项目！')
    }
    else
    {
        openAddWindow("ProjectTeamAdd.aspx?projID=" + projID, 800, 600);
    }
}

// 新增团队成员
function addAccount()
{
    var teamID = "";
    $(":checked").each(function ()
    {
        if ($(this).val() != "on")
        {
            teamID = $(this).val();
        }
    });
    var projID = $("#ddlProject").val();
    if (projID.length < 36)
    {
        alert('请选择公司下的项目！')
    }
    else if (teamID.length == 36)
    {
        openAddWindow("ProjectAccountAdd.aspx?projID=" + projID + "&teamID=" + teamID, 800, 600);
    } else
    {
        openAddWindow("ProjectAccountAdd.aspx?projID=" + projID, 800, 600);
    }
}

// 修改团队
function editTeam()
{
    var ID = "";
    $("input:checked").each(function ()
    {
        var val = $(this).val();
        if (ID.length > 36)
        {
            return;
        }
        if (val != null && val.length == 36)
        {
            ID += val;
        }
    });
    if (ID != null && ID.length == 36)
    {
        var projID = $("#ddlProject").val();
        openAddWindow("ProjectTeamAdd.aspx?projID=" + projID + "&ID=" + ID, 800, 600);

    }
    if (ID == "")
    {
        alert("请勾选要修改的一项");
    }
    else if (ID.length > 36)
    {
        alert("修改时只能选择一项！");
        return;
    }

}

// 修改团队成员
function btnEditDetail_Click()
{
    var projID = $("#hidProjectID").val();
    openModifyWindow("ProjectAccountAdd.aspx?projID=" + projID, 800, 600, "jqProjectAccount");
}

//删除团队
function btnDeleteTeam_Click()
{
    // DataGrid的删除
    var ids = "";
    $("input:checked").each(function ()
    {
        var val = $(this).val();
        if (val != null && val.length == 36)
        {
            ids += val + ",";
        }
    })
    if (ids == "")
    {
        alert('请先选择要删除的行！');
    }
    else
    {
        $("#hiddIDList").val(ids);
    }
}

//删除团队成员
function btnDelete_Click()
{
    openDeleteWindow("ProjectAccount", 7, "jqProjectAccount");
}

//选择岗位
function btnSelecAccountChild_Click()
{
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + getObj("hidCorpID").value + '', 0, 0);

    if (!rValue)
        return;
    if (rValue.indexOf('(') + 1 == rValue.indexOf(')'))
    {
        alert('请选择姓名不为空的岗位！');
        $("#hidChildAccount").val("");
        $("#hidChildAccountID").val("");
    }
    else
    {
        getObj("hidChildAccountID").value = rValue.split('|')[5];
        getObj("hidChildAccount").value = rValue.split('|')[1];
    }
}

//选择上级成员
function btnSelecAccount_Click()
{
    var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + getObj("hidCorpID").value + '', 0, 0);
    if (!rValue)
        return;

    if (rValue.indexOf('(') + 1 == rValue.indexOf(')'))
    {
        alert('请选择姓名不为空的岗位！');
        $("#txtAdjustScoreAccount").val("");
        $("#hidAdjustScoreAccountID").val("");
    }
    else
    {
        getObj("hidAdjustScoreAccountID").value = rValue.split('|')[5];
        getObj("txtAdjustScoreAccount").value = rValue.split('|')[1];
    }
}

// 链接到成员列表
function renderOperateLink(cellvalue, options, rowobject)
{
    var url = "'ProjectAccountList.aspx?projTeamID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)"> 团队成员列表 </a>';
}

// 项目索引改变时触发的事件
function OnSelectedIndexChanged()
{
    //    var projName = ltrim($("#ddlProject").find("option:selected").text());
    var projID = $("#ddlProject").val();

    var query = { ProjectID: projID };
    if (loadJQGrid("jqProjectTeam", query))
    {
        refreshJQGrid("jqProjectTeam");
    }
}

// 新增团队成员2
function btnAddDetail_Click()
{
    var projID = $("#hidProjectID").val();
    var teamID = $("#hidTeamID").val();
    openAddWindow("ProjectAccountAdd.aspx?projID=" + projID + "&teamID=" + teamID, 800, 600);
    
    // F5
}