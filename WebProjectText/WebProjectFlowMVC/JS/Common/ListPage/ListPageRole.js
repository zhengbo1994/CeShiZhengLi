//JScript文件 用于VListPageRole.aspx 页面角色设置 页面 create by dinghuan @2012-09-26


//*********************************列表页*********************************//
//新增
function add()
{
    var modID = $("#ddlModel").val();
    var pageID = $("#ddlPage").val();
    openAddWindow("VListPageRoleAdd.aspx?ModID=" + modID + "&PageID=" + pageID, 550, 450, "jqGrid");
}

//删除
function del()
{
    openDeleteWindow("ListPageRole", 0, "jqGrid", null, "Y");
}

//设置角色成员
function settingMember(id,pageID)
{
    openWindow("VListPageRoleEdit.aspx?JQID=jqGrid&RoleID=" + id + "&PageID=" + pageID, 550, 450);
}

//配置角色显示方案
function settingColumns(id)
{
    openWindow("VListPageRoleColumnsSetting.aspx?RoleID=" + id, 700, 500);
}

//重新加载数据
function reloadData()
{
    $("#jqGrid").getGridParam("postData").PageID = getObj("ddlPage").value;
    $('#jqGrid').trigger('reloadGrid');
}

//切换模块
function changeModel(isreload,isAll)
{
    var modID = $("#ddlModel").val();
    $("#ddlPage option").remove();
    $('#ddlPage').get(0).options.add(new Option(isAll ? "全部" : "请选择", ''));
    ajaxRequest(
        'VListPageRole.aspx',
        { IDAjax: true, ModID: modID },
        'json',
        function (data)
        {
            if (data && data.Data)
            {
                var objs = stringToJson(data.Data);
                for (var i = 0; i < objs.Count; i++)
                {
                    $('#ddlPage').get(0).options.add(new Option(objs.Nodes[i].Name, objs.Nodes[i].ID));
                }

                if ($('#ddlPage option[value=\'' + $('#hidPageID').val() + '\']').length == 1)
                {
                    $('#ddlPage option[value=\'' + $('#hidPageID').val() + '\']').attr('selected', 'selected');
                }
                if (isreload)
                {
                    reloadData();
                }
            }
        }
    );
}
//*********************************END列表页END*********************************//


//*********************************新增修改页*********************************//
//选择岗位
function selectStation()
{
    var returnValue = openModalWindow("../Select/VSelectMultiStation.aspx?Aim=ListPageRole&Form=ListPageRole", 800, 600);
    tbMemberObj.AddMoreItem(eval(returnValue), true);
}

//选择工作组
function selectGroup()
{
    var returnValue = openModalWindow("../Select/OperAllow/VSelectAvailableGroup.aspx?Aim=ListPageRole&Form=ListPageRole", 800, 600);
    tbMemberObj.AddMoreItem(eval(returnValue), true);
}

function validata()
{
    if ($("#ddlPage") && $("#ddlPage").val() == "")
    {
        return alertMsg("请选择所属页面！", $("#ddlPage"));
    }

    if ($("input[id*=txtRoleName]").val() == "")
    {
        return alertMsg("角色名称不能为空", $("input[id*=txtRoleName]"));
    }

    var rows = $("#tbMember").children().children();
    if (rows.length < 3)
    {
        return alertMsg("角色必须拥有至少一个成员", $("input[id*=addStation]"));
    }

    var rltMemberStr = ConvertTable.GetSerializeJson("tbMember"); //获取成员明细
    if (typeof (rltMemberStr) == 'boolean' && !rltUnitStr)
    {
        return false;
    }

    return true;
}
//*********************************END新增修改页END*********************************//