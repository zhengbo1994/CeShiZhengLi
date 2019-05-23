// JScript 文件
//***************************************************//
/// <reference path="../../jquery-1.4.2-vsdoc.js" />
//
//文件名:PortalPage.js .js
//作者:翁化青
//时间:2012-05-14
//功能描述:门户页JS操作
//
//*************************************************//
/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/

var _PageMaster = {};
_PageMaster.isSearching = false;

//刷新数据
function reloadData() {
    if (_PageMaster.isSearching) {
        return false;
    }
    else {
        _PageMaster.isSearching = true;
    }

    var PortalType = getObj("ddlPortalType").value;
    var PPTID = getObj("ddlPortalPageType").value;
    var vKey = $("#txtKey").val();
    $('#jqPortalPage', document).getGridParam('postData').PortalType = PortalType;
    $('#jqPortalPage', document).getGridParam('postData').PPTID = PPTID;
    $('#jqPortalPage', document).getGridParam('postData').Key = vKey;
    $('#jqPortalPage').trigger('reloadGrid');
}
function rdClick()
{
    if ($('[type=radio]:checked', $("#rblIsPage")).val() == "0")
    {
        trHTML.style.display = "none";
    } else
    {
        trHTML.style.display = "";
    }
}
function customGridComplete() {
    _PageMaster.isSearching = false;
}

function changePortalType(ddlPortalType) {
    var PortalType = getObj("ddlPortalType").value;
    var ddlPortalPageType = getObj("ddlPortalPageType");

    ddlPortalPageType.options.length = 0;

    if (PortalType != "") {
        $.post('FillData.ashx', {
            action: 'GetPortalPageTypeByPortalType',
            PortalType: PortalType
        },
         function (data, textStatus) {
             bindPortalPageType(data);
             reloadData();
         },
          'json');
    }
    else {
        $("<option value=''>全部</option>").appendTo('#ddlPortalPageType');
        reloadData();
    }
}


// 绑定门户类别
var bindPortalPageType = function (data)
{
    var ddlPortalPageType = getObj("ddlPortalPageType");
    $(data).each(function (i)
    {
        $("<option value='" + data[i].value + "'>" + data[i].text + "</option>").appendTo($(ddlPortalPageType));
    });

    if (ddlPortalPageType.options.length > 0)
    {
        // 只有一个默认选中
        if (ddlPortalPageType.options.length == 2)
        {
            ddlPortalPageType.selectedIndex = 1;
        }
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo($(ddlPortalPageType));
    }
    //getObj("ddlPortalPageType").style.width = "100%";
  
}

function changeType(ddlPortalType)
{
    var PortalType = getObj("ddlPortalType").value;
    var ddlPortalPageType = getObj("ddlPortalPageType");

    ddlPortalPageType.options.length = 0;

    if (PortalType != "")
    {
        ajax('FillData.ashx', {
            action: 'GetPortalPageTypeByPortalType',
            PortalType: PortalType
        }, 'json',
         function (data, textStatus)
         {
             bindType(data);
         },
          false);
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo('#ddlPortalPageType');
    }
    $("#ddlPortalPageType").css("width", "0");
    $("#ddlPortalPageType").css("width", "100%");
}


// 绑定门户类别
var bindType = function (data)
{
    var ddlPortalPageType = getObj("ddlPortalPageType");
    $(data).each(function (i)
    {
        if (data[i].value != "default")
        {
            $("<option value='" + data[i].value + "'>" +(data[i].text == "全部" ? "请选择" : data[i].text) + "</option>").appendTo($(ddlPortalPageType));
        }
    });

    if (ddlPortalPageType.options.length > 0)
    {
        // 只有一个默认选中
        if (ddlPortalPageType.options.length == 2)
        {
            ddlPortalPageType.selectedIndex = 1;
        }
    }
    else
    {
        $("<option value=''>请选择</option>").appendTo($(ddlPortalPageType));
    }
}


//浏览
var showPortalPageBrowse = function (ID, text) {
    openWindow("VPortalPageBrowse.aspx?ID=" + ID, 0, 0);
}

//布局
var showPortalPageLayout = function (ID, name, portalType) {
    openWindow("VPortalPageLayout.aspx?ID=" + ID + "&name=" + encode(name) + "&PortalType=" + portalType, screen.availWidth, screen.availHeight);
}

//新增
var addPortalPage = function ()
{
    if ($("#ddlPortalPageType").val() == "default")
    {
        return alertMsg("系统默认门户页不能新增");
    }
    openAddWindow("VPortalPageAdd.aspx?PPTID=" + $("#ddlPortalPageType").val() + "&SType=" + $("#ddlPortalType").val(),600, 400, "jqPortalPage");
}

//修改
var editPortalPage = function () {
    openModifyWindow("VPortalPageEdit.aspx", 600, 400, "jqPortalPage");
}

//删除
var deletePortalPage = function () {
    var strPPIDs = getJQGridSelectedRowsID('jqPortalPage', true);

    ajaxRequest('FillData.ashx',
    { action: 'GetPortalPageUsedCount', PPIDs: strPPIDs.join(), temp: Math.random() },
    "text",
    function (data) {
        if (data == "0") {
            openDeleteWindow("PortalPage", 0, "jqPortalPage");
        }
        else {
            alert("部分被选中的门户页已经被使用，无法删除。");
        }
    },
    true,
    "POST");
}

//设置
var setPortalPage = function () {
    var PPIDs = getJQGridSelectedRowsID('jqPortalPage', true);
    var PPName = stripHtml(getJQGridSelectedRowsData('jqPortalPage', true, 'PPName'));

    PPIDs = typeof PPIDs == "string" ? PPIDs.split(",") : PPIDs;

    if (!PPIDs || PPIDs == "" || PPIDs.length == 0) {
        return alertMsg("没有任何记录可供操作。");
    }
    if (PPIDs.length > 1) {
        return alertMsg("您一次只能操作一条记录。");
    }
    showPortalPageLayout(PPIDs[0], PPName[0]);
}

//选择门户页
function selectPortalPage() {
    var portalType = getParamValue("ProtalType");
    var varReturn = openModalWindow('../../Common/Select/OperAllow/VSelectPortalPage.aspx?ProtalType=' + portalType, 600, 500);
    if (varReturn != null) {
        getObj("hidPPID").value = varReturn.PPID;
    }
}
       

//验证
var validateSize = function ()
{
    var rblIsPage = $("input[name$=rblIsPage][checked]");
    var isPage = rblIsPage.val() || ($("#hidIsPage").val());

    var rblIsDefault = $("input[name$=rblIsDefault][checked]");
    var isDefault = rblIsDefault.val();

    if (getObj("ddlPortalType").value == "")
    {
        return alertMsg("门户页类型不能为空。", getObj("ddlPortalType"));
    }
    if (getObj("ddlPortalPageType").value == "")
    {
        return alertMsg("门户页类别不能为空。", getObj("ddlPortalPageType"));
    }
    $("#hidPortalPageType").val($("#ddlPortalPageType").val());
    if (getObj("txtPPName").value == "")
    {
        return alertMsg("门户页名称不能为空。", getObj("txtPPName"));
    }
    if (isPage == "")
    {
        return alertMsg("请选择是否页面。", getObj("rblIsPage"));
    }
    else if (isPage == "1")
    {
        if ($("#txtHTML").val()=="")
        {
            return alertMsg("页面路径不能为空。", $("#txtHTML"));
        }
    }

    if (getObj("txtRowNo").value == "")
    {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }
    if (isPage == "")
    {
        return alertMsg("请选择是否默认。", getObj("rblIsDefault"));
    }
    $("#hidPortalPageType").val($("#ddlPortalPageType").val());
    return true;
}
