// JScript 文件

//显隐区块
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i <= 3; i++)
    {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";

    window["index"] = index;


    if (index > 0)
    {
        $("#btnSave,#btnSaveClose").hide();

        reloadData();
    }
    else
    {
        $("#btnSave,#btnSaveClose").show();    
    } 
}

//条件搜索

var _PageMaster = {};
_PageMaster.isSearching = false;


// 加载数据
function reloadData()
{
    var jqID = "jqGrid" + window["index"];

    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }

    var sIndexTab = window["index"];
    var sClientBaseGUID = $("#hdClientBaseGUID").val();

    // 传入参数值并加载对应的JQGRID
    if (loadJQGrid(jqID, { IndexTab: sIndexTab, ClientBaseGUID: sClientBaseGUID }))
    {
        $('#' + jqID).trigger('reloadGrid');
    }
}


function customGridComplete()
{
    _PageMaster.isSearching = false;
}


// 客户基础信息链接
function showCustomerInfo(cellvalue, options, rowobject)
{
    var url = "'VClientBaseDetailInfo.aspx?ClientBaseGUID=" + rowobject[0] + "&JQID=" + "jqData'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

// 保存客户信息
function validateSize()
{
    handleBtn(false);

    if (getObj("txtClientName").value == "") //
    {
        handleBtn(true);
        return alertMsg('客户名称不能为空。', getObj("txtClientName"));
    }

    if (trim(getObj("txtMobileNumber").value) == "" && trim(getObj("txtHomeNumber").value) == "" && trim(getObj("txtOfficeNumber").value) == "") //
    {
        handleBtn(true);
        return alertMsg('至少填写一种电话联系方式。', getObj("txtMobileNumber"));
    }

    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }

    return true;
}


function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSave"), enabled);
}