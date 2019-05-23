var _PageMaster = {};
_PageMaster.isSearching = false;


// 加载数据
function reloadData()
{
    var jqID = "jqData";

    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }

    var sIndexTab = $('#hdIndexTab').val();
    var sProjectID = $("#ddlProjectGUID").val();    
    var sKeywords = $("#txtKey").val();
    var sDataView = $('#ddlDataView').val();   

    // 传入参数值并加载对应的JQGRID
    if (loadJQGrid(jqID, { IndexTab: sIndexTab, ProjectID: sProjectID, Keywords: sKeywords, DataView: sDataView }))
    {
        $('#' + jqID).trigger('reloadGrid');
    }
}


function customGridComplete()
{
    _PageMaster.isSearching = false;
}

function showIndexTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    $('#hdIndexTab').val(index);

    reloadData();
}

// 新增
function editBackRoom()
{
    openModifyWindow("VBackRoomEdit.aspx", 800, 600, "jqData");
}


// 修改
function editBackRoom()
{
    openModifyWindow("VBackRoomEdit.aspx", 800, 600, "jqData");
}

//打开退房变更审核页面
function renderLink(cellvalue, options, rowobject) {

    // salesOrderID：认购单或签约单主键
    // SalesChangeID：变更表主键
    //changeType :变更类别
    //?OrderType=S&ProjectGUID=19949203-9CC5-42E3-83EC-165528BA91C3&salesOrderID=e12fcb71-c7b5-4010-8380-5241fbfa0998
    var ProjectGUID = rowobject[2], vSaleOrderID = rowobject[1], SalesChangeID = rowobject[0], ChangeType = rowobject[6];   
    var strhtml = '<a href="#" OnClick="openCheckWindow(\'' + ProjectGUID + '\',\'' + vSaleOrderID + '\',\'' + SalesChangeID + '\',\''+ChangeType+'\')" >' + cellvalue + '</a>';
    return strhtml;
}

function openCheckWindow(ProjectGUID, vSaleOrderID, SalesChangeID, ChangeType) {
    var page = getPage(ChangeType);
    if (page == "") return;
    var url = page + '.aspx?action=Check&ProjectGUID=' + ProjectGUID + '&vSaleOrderID=' + vSaleOrderID + '&SalesChangeID=' + SalesChangeID;
    var re = openModalWindow(url, 950, 600, "jqData");
    if (re != undefined) {
        reloadData();
    }
}

function getPage(ChangeType) {
    var page = "";
    switch (ChangeType) {
        case "1":
            page = "VRoomCancelAdd";
            break;
        case "2":
            page = "VRoomChangeAdd";
            break;
        case "3":
            page = "VPriceChangeAdd";
            break;
        case "4":
            page = "VSpecialDiscountAdd";
            break;
        case "5":
            page = "VPropertyChangeAdd";
            break;
        default: page = "";
            
    }
    return page;
}

//编辑所选
function Edit() {
    //判断是否可以编辑
    var statu = getJQGridSelectedRowsData("jqData", false, "status").join();
    if (statu != "0") {        
        alertMsg("只有未审核的变更才可以编辑！");
        return;
    }
    var SalesChangeGUID = getJQGridSelectedRowsData("jqData", false, "SalesChangeGUID").join();
    var SalesOrderID = getJQGridSelectedRowsData("jqData", false, "SalesOrderGUID").join();
    var ProjectGUID = getJQGridSelectedRowsData("jqData", false, "ProjectGUID").join();
    var ChangeType = getJQGridSelectedRowsData("jqData", false, "ChangeType").join();
    var page = getPage(ChangeType);
    if (page == "") return;
    var url = page+'.aspx?action=Edit&ProjectGUID=' + ProjectGUID + '&vSaleOrderID=' + SalesOrderID +
     '&SalesChangeID=' + SalesChangeGUID;
    var re = openModalWindow(url, 800, 600, "jqData");
    reloadData();

}


//编辑所选
function DoChange() {
    var statu = getJQGridSelectedRowsData("jqData", false, "status").join();
    if (statu != "2") {
        alertMsg("只有审核通过的变更才可以执行！");
        return;
    }
    //判断是否可以编辑
    if (!confirm("确定要执行吗？")) return;
    var strProjectName = $('#ddlProjectGUID').find('option[selected]').text();

    var SalesChangeGUID = getJQGridSelectedRowsData("jqData", false, "SalesChangeGUID").join();
    var SalesOrderID = getJQGridSelectedRowsData("jqData", false, "SalesOrderGUID").join();
    var ProjectGUID = getJQGridSelectedRowsData("jqData", false, "ProjectGUID").join();
    var ChangeType = getJQGridSelectedRowsData("jqData", false, "ChangeType").join();
    var SalesOrderType = getJQGridSelectedRowsData("jqData", false, "SalesOrderType").join();
    
    var jsondata = { action: "Do", ChangeType: ChangeType, ProjectGUID: ProjectGUID,
        vSalesOrderID: SalesOrderID, vSalesChangeGUID: SalesChangeGUID, vSalesOrderType: SalesOrderType
    };

    ajax("SalesChangeManagemnet.aspx", jsondata, "text",
    function (data, stu)
    {
        if (ChangeType != 2)//不是换房变更
        {
            alertMsg(data == "success" ? "操作成功！" : "操作失败！");
        }
        else {
            data = $.stringToJSON(data);
            if (data.status == "success") {
                alertMsg("操作成功,请在即将弹出的页面重新选择付款方式！");
                var jqID = SalesOrderType == "S" ? "jqSubscription" : "jqSalesOrder";
                var url = "../SalesOrder/VSalesOrderEdit.aspx?EditType=edit&OrderType=" + SalesOrderType + "&JQID=" + jqID + "&ID=" + data.newSalesOrderID +
					"&ProjectGUID=" + ProjectGUID + "&ProjectName=" + encodeURI(strProjectName) + "'";
                openWindow(url, 0, 0);
            }
            else {
                alertMsg("操作失败！");
            }
        }
        reloadData();
    }
    );

}



//按钮显示控制
function handleBtn(enabled) {
    setBtnEnabled(getObj("btnCheck"), enabled);
    setBtnEnabled(getObj("btnCheck"), enabled);
    setBtnEnabled(getObj("btnEdit"), enabled);
    setBtnEnabled(getObj("btnCancel"), enabled);
}