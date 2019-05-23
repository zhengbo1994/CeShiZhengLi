// JScript 文件


//显示
function btnShow()
{
    openAddWindow("VEstateManage.aspx", 800, 600);
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VProjectEdit.aspx", 800, 600, "jqProjectInfo");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("DeleteProject", 1, "jqProjectInfo");
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}

function showBrowseTab(tabIndex)
{
    var vIndex = tabIndex;
    fillHidType(vIndex);
    // 调用这个方法，显示所选中的项
    selectTab(vIndex, "TabInfo");

    for (var i = 0; i < 6; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + vIndex).style.display = "block";
    reloadData();
}

function fillHidType(tabIndex)
{
    var TabType = $("#hidTabType");
    switch (tabIndex) {
        case 1:
            TabType.val("YSK");
        case 2:
            TabType.val("YYJ");
        case 3:
            TabType.val("FK");
        case 4:
            TabType.val("YHPLFK");
        case 5:
            TabType.val("DJCX");
        case 6:
            TabType.val("KXMXCX");
        default:
            TabType.val("FK");
    }
}

function reloadData()
{
    var vTabType = $("#hidTabType").val();
    var query;
    switch (vTabType) {
        case "YSK":
            query = { TabType: vTabType };
        case "YYJ":
            query = { TabType: vTabType };
        case "FK":
            query = { TabType: vTabType };
        case "YHPLFK":
            query = { TabType: vTabType };
        case "DJCX":
            query = { TabType: vTabType };
        case "KXMXCX":
            query = { TabType: vTabType };
        default:
            query = { TabType: vTabType };
    }
//    reloadGridData(query);
}



