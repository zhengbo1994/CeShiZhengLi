// JScript 文件
/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
var _PageMaster = {};
_PageMaster.isSearching = false;

//引入
function btnImport_Click()
{
    var sCorpID = $("#ddlCorp").val();

    var rValue = openModalWindow("../../../Common/Select/CRM/VSelectProjectInfo.aspx?IsNOEnabledSale=Y&IsMulti=Y&CorpID=" + sCorpID, 800, 600);

    if (rValue != null)
    {
        // AJAX post请求
        $.post('FillData.ashx', { action: 'CRM_ImportProjectEnableSale', ProjectIDList: rValue.ProjectID }, function (data, textStatus) { if (data.toUpperCase() == "TRUE") { alert("引入成功。"); reloadData() } else { alert("引入失败，请重新操作。") } }, 'string');
    }
}

//新建
function btnAdd_Click()
{
    var sCorpID = $("#ddlCorp").val();

    openAddWindow("VProjectAdd.aspx?CorpID=" + sCorpID, 800, 600, "jqProjectInfo");
}

//修改
function btnEdit_Click()
{
    var url = "VProjectEdit.aspx";
    openModifyWindow(url, 800, 600, "jqProjectInfo");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("ProjectInfo", 7, "jqProjectInfo");
}


// 弹出居中窗口
function openMiddlewindow(url, name, iWidth, iHeight) 
{
    var url;                                 //转向网页的地址;
    var name;                           //网页名称，可为空;
    var iWidth;                          //弹出窗口的宽度;
    var iHeight;                        //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;       //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;           //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}

////查看
//function renderLink(cellvalue, options, rowobject) {
//    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
//    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
//}

//搜索
function btnSearch_Click()
{
    reloadData();
}


function reloadData()
{
    var jqObj = $('#jqProjectInfo', document);

    if (_PageMaster.isSearching)
    {
        return false;
    }
    else
    {
        _PageMaster.isSearching = true;
    }

    var sProjectName = $("#txtKey").val();
    var sCorpID = $("#ddlCorp").val();

    //alert(sCorpID);

    jqObj.getGridParam('postData').ProjectName = sProjectName;
    jqObj.getGridParam('postData').CorpID = sCorpID;

    refreshJQGrid('jqProjectInfo');
}

function customGridComplete()
{
    _PageMaster.isSearching = false;
}

//function validateSize() {
//    var rowNo = getObj("txtRowNo").value;
//    if (getObj("ddlICID").value == "") {
//        return alertMsg("类别名称不能为空。", getObj("ddlICID"));
//    }
//    if (getObj("txtIndexNo").value == "") {
//        return alertMsg("指标编号不能为空。", getObj("txtIndexNo"));
//    }
//    if (getObj("txtIndexName").value == "") {
//        return alertMsg("指标名称不能为空。", getObj("txtIndexName"));
//    }
//    if (getObj("ddlIndexType").value == "") {
//        return alertMsg("指标类型不能为空。", getObj("ddlIndexType"));
//    }
//    if (getObj("ddlIndexCycle").value == "") {
//        return alertMsg("指标周期不能为空。", getObj("ddlIndexCycle"));
//    }
//    //    if (getObj("ddlBSID").value == "")
//    //    {
//    //        return alertMsg("基础部门不能为空。", getObj("ddlBSID"));
//    //    }

//    if (rowNo == "") {
//        return alertMsg("行号不能为空。", getObj("txtRowNo"));
//    }

//    if (!isPositiveInt(rowNo)) {
//        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
//    }
//    return true;
//}