// JScript 文件

var _PageMaster = {};
_PageMaster.isSearching = false;


// 加载数据
function reloadData()
{
    var jqID = "jqGrid" + $('#hdIndexTab').val();

    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }

    var sIndexTab = $('#hdIndexTab').val();
    var sProjectID = $("#ddlProject").val();
    var sRoomID = $("#hdRoomGUID").val();
    var sKeywords = $("#txtKey").val();
    var sDateBegin = $("#dDateBegin").val();
    var sDateEnd = $("#dDateEnd").val();
    var sOverDayFrom = $("#txtOverDaysFrom").val();
    var sOverDayTo = $("#txtOverDaysTo").val();
    var sMinArrearsMoney = $("#txtMinMoney").val();

    // 传入参数值并加载对应的JQGRID
    if (loadJQGrid(jqID, { IndexTab:sIndexTab,ProjectID: sProjectID, RoomID: sRoomID, Keywords: sKeywords, DateBegin: sDateBegin, DateEnd: sDateEnd, OverDayFrom: sOverDayFrom, OverDayTo: sOverDayTo, MinArrearsMoney: sMinArrearsMoney }))
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

    for (var i = 0; i < 5; i++)
    {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";

    // 显示隐藏条件
    if (index == "0" || index == "1")
    {
        getObj("trMinMoney").style.display = "none";
     }
    else
    {
        getObj("trMinMoney").style.display = "block";   
    }

    $('#hdIndexTab').val(index);

    reloadData();
}


//选择房间
function selectRoomName()
{
    // 清空已选择内容
    getObj("hdRoomGUID").value = "";
    getObj("txtRoomName").value = "";

    var data = openModalWindow('../../../Common/Select/CRM/VSelectRoomInfo.aspx', 800, 600);

    if (!data)
    {
        return;
    }
    else
    {
        //alert(data[0].ForSaleConstructionUnitPrice);
        getObj("hdRoomGUID").value = data[0].RoomGUID; //房间GUID
        getObj("txtRoomName").value = data[0].RoomName; //房间名称
    }

    reloadData();
}

//新建
function btnAdd_Click()
{
    openAddWindow("VProductAdd.aspx?projectID=" + $("#hiddProjectID").val(), 800, 450);
}

//修改
function btnEdit_Click()
{
    openModifyWindow("VProductAdd.aspx?projectID=" + $("#hiddProjectID").val(), 800, 600, "jqGrid1");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("Product", 7, "jqGrid1");
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}


// 上传(队列中单个文件)完成事件
// fileRow为放置文件所在的表格行，其有rowIndex、filetitle、filename、filesize、thumbnailname等属性
// uploadID为控件的id，也即放置文件所在表格的id
function fileUploaded(fileRow, uploadID)
{
    trSinPic.style.display = "";
    getObj("imgSinPic").src = "../../.." + fileRow.thumbnailname;
}

function fileDeleted(fileRow, uploadID)
{
    trSinPic.style.display = "none";
}


function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}