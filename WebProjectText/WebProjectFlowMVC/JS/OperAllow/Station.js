// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：设置中心-流程中心-紧急程度设置
 * 文件类型：Urgency.js
 * 作    者：马吉龙
 * 时    间：2010-5-6
 */
//添加岗位 
function addStation()
{ 
    var struID = window["StruID"];
    if (!struID)
    {
        return alertMsg('请选择一个公司或部门！');
    }
    
    openAddWindow("VStationAdd.aspx?StruID=" + struID, 800, 650, "jqGrid1"); 
}
 
// 编辑岗位 
function editStation()
{
    openModifyWindow("VStationEdit.aspx", 800, 650, "jqGrid1","Main");
}

// 删除岗位
function delStation()
{    
    openDeleteWindow("Station", 1, "jqGrid1","Main");
}

// 权限设置
function setPermission()
{
     openModifyWindow("../APModel/VPermission.aspx?aim=Station", 800, 650, "jqGrid1","Main")
}

// 所属工作组
function setGroup()
{
    openModifyWindow("VStationGroup.aspx", 800, 650, "jqGrid1","Main")
}

// 包含项目
function setProject()
{
     openModifyWindow("VStationProject.aspx", 0, 0, "jqGrid1","Main")
}

//回调函数
function loadDept(data, textStatus) {
    $("#divSelectDeptHtml").html(data);

    //给部门表格行设置事件
    $("#divSelectDeptHtml tr").mouseover(function () {
        $(this).addClass("dg_rowmouseover");
    }).mouseout(function () {
        $(this).removeClass("dg_rowmouseover");
    }).click(function () {
        $(this).find(":radio").attr("checked","checked");
    }).dblclick(function () {
        $("#txtDept").val($(this).find("span").text());
        $("#hidDeptID").val($(this).find(":radio").val());
        $("#hidDivSelectDept").hide();
    });
}
// 选择部门
function selectDept()
{
    var corpID = $('#hidCorpID').val();
    if ($("#hidType").val() == "AccountStation") {
        var btnPos = $("#btnSelectDept").offset();
        $("#hidDivSelectDept").show();
        $("#hidDivSelectDept").offset({ left: btnPos.left - 400, top: btnPos.top });
        $("#ddlCorp").change(function () {
            ajaxRequest("/" + rootUrl + "/Common/Select/VSingleDept.aspx", { Aim: "Dept", CorpID: $("#ddlCorp").val(), AjaxRequest: true }, "html", loadDept);
        });
    }
    else 
    {
        var sUrl;
        sUrl = '/' + rootUrl + '/Common/Select/VSingleDept.aspx?Aim=Dept&CorpID=' + corpID;
        openModalWindow(sUrl, 400, 600);
    }
}

//新增工作组 add by 张敏强 2012-4-12 
var groupInfo = null;
function addGroup()
{
    //初始化对象，在打开的模式窗口调用
    groupInfo = {
        groupArr:[],
        groupIDs:[],
        groupNames:[],
        groupNos:[],
        groupCorpNames:[]
    };
    
    if($("#tbGroup tr").length > 1)
    {
        $("#tbGroup tr:gt(0)").each(function(){
            groupInfo.groupArr.push(this.id);
        });
    }

    if ($("#hidType").val() == "AccountStation") {
        //账号新增时新增岗位
        var posBtnAdd = $("#btnAdd").offset();
        var corpID = $("#ddlCorpForGroup").val();
        $("#hidDivSelectGroup").show();
        $("#hidDivSelectGroup").offset({ top: posBtnAdd.top + 20, left: posBtnAdd.left });

        var query = { Aim: "AddGroup", CorpIDForGroup: $("#ddlCorpForGroup").val(), Action: "GetData" };
        if (loadJQGrid("jqGroup", query)) {
            refreshJQGrid("jqGroup");
        }

        $("#ddlCorpForGroup").bind("change",function () {
            $("#jqGroup").getGridParam('postData').Aim = "AddGroup";
            $("#jqGroup").getGridParam('postData').CorpIDForGroup = $("#ddlCorpForGroup").val();
            $("#jqGroup").getGridParam('postData').Action = "GetData";
            $('#jqGroup').trigger('reloadGrid');
        });
    }
    else {
        var sUrl = '/' + rootUrl + '/Common/Select/OperAllow/VSelectAvailableGroup.aspx?Aim=AddGroup';
        openModalWindow(sUrl, 700, 600);

        //返回数据处理
        if (groupInfo.groupIDs.length > 0) {
            for (var i = 0; groupInfo.groupIDs.length > i; i++) {
                $("#tbGroup").append("<tr id='" + groupInfo.groupIDs[i] + "'><td style='text-align:center'><input type='checkbox' /></td><td>"
                                            + groupInfo.groupNos[i] + "</td><td>"
                                            + groupInfo.groupNames[i] + "</td><td>"
                                            + groupInfo.groupCorpNames[i] + "</td></tr>");
            }
        }

        if ($("#tbGroup tr").length > 1) {
            $("#tbGroup").show();
        }

        IntiGroupTable();
    }
}

//初始化工作组表格
function IntiGroupTable() {
    $("#tbGroup tr:gt(0)").mouseover(function () {
        $(this).addClass("dg_rowmouseover");
    }).mouseout(function () {
        $(this).removeClass("dg_rowmouseover");
    }).click(function () {
        if (arguments[0].target.type == "checkbox") {
            $(this).toggleClass("ui-state-highlight");
            arguments[0].stopPropagation();
        }
        else {
            var $checkbox = $(this).find("input:checkbox");
            $(this).toggleClass("ui-state-highlight");
            if ($checkbox.attr("checked")) {
                $checkbox.attr("checked", false);
            }
            else {
                $checkbox.attr("checked", true);
            }
        }
    });
}

//将已选项设为不可用
function customGridComplete() {
    //设置已选项为不可用
    if ($("#hidDivSelectGroup").is(":visible")) {
        var idArray = groupInfo.groupArr.slice(0);
        var $trs = $("#jqGroup tr");
        if ($trs.length > 0 && idArray.length > 0) {
            $trs.each(function () {
                for (var j = 0; j < idArray.length; j++) {
                    if (this.id === idArray[j].toString()) {
                        $(this).find("td:first input:checkbox").attr("disabled", "disabled");
                        idArray = idArray.slice(0, j).concat(idArray.slice(j + 1, idArray.length));
                        return;
                    }
                }
            });
        }
    }
}

//删除选择的工作组
function deleGroup()
{
    $("#tbGroup tr:gt(0)").each(function(){
        if($(this).find("input:checkbox").attr("checked"))
        {
            $(this).remove();
        }
    });
    
    if($("#tbGroup tr").length < 2)
    {
        $("#tbGroup").hide();
    }
}

//选择基础岗位
function btnSelectBasicStation_Click()
{
    var corpID=$('#hidCorpID').val();
    if(corpID == "" || $('#hidDeptID').val() == "")
    {
        return alertMsg("请选择部门", $('#btnSelectDept'));
    }
    if ($("#hidType").val() == "AccountStation") {
        var btnPos = $("#btnSelectBasicStation").offset();
        $("#hidDivSelectBStation").show();
        $("#hidDivSelectBStation").offset({ left: btnPos.left - 400, top: btnPos.top });
        if (loadJQGrid('jqBasicStation', { StationID: $('#hidStationID').val(),CorpID:corpID,BSID:$('#hidBasicStationID').val(), Action: 'GetData' })) {
            refreshJQGrid('jqBasicStation');
        } 
    }
    else {
        var sUrl = '/' + rootUrl + '/Common/Select/OperAllow/VSelectBasicStation.aspx?SelectType=MutliSelect&StationID=' + $('#hidStationID').val() + '&CorpID=' + corpID + '&BSID=' + $('#hidBasicStationID').val();
        var vValue = openModalWindow(sUrl, 600, 600);
        if (vValue != null && vValue != "undefine") {
            if (vValue == "") {
                $('#txtBasicStation').val("");
                $('#hidBasicStationID').val("");
            }
            else {
                if ($('#txtBasicStation').val().length > 0) {
                    $('#txtBasicStation').val($('#txtBasicStation').val() + '，' + vValue.split('|')[1]);
                    $('#hidBasicStationID').val($('#hidBasicStationID').val() + ',' + vValue.split('|')[0]);
                }
                else {
                    $('#txtBasicStation').val(vValue.split('|')[1]);
                    $('#hidBasicStationID').val(vValue.split('|')[0]);
                }
            }
        }
    }
}

//选择水平领导岗位
function SelectHLeaderStation()
{
    var rValue = openModalWindow('/' + rootUrl + '/Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + $("#hidDeptID").val(), 800, 600);
    if (rValue != "undefined" && rValue != null)
    {
        getObj("hidHLeaderStationID").value = rValue.split('|')[0];
        getObj("txtHLeaderStation").value = rValue.split('|')[1];
    }
}

//选择垂直领导岗位
function SelectVLeaderStation()
{
    var rValue = openModalWindow('/' + rootUrl + '/Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + $("#hidDeptID").val(), 800, 600);
    if (rValue != "undefined" && rValue != null)
    {
        getObj("hidVLeaderStationID").value = rValue.split('|')[0];
        getObj("txtVLeaderStation").value = rValue.split('|')[1];
    }
}

// 选择账号
function selectAccount()
{
     var corpID=$('#hidCorpID').val();
     var sUrl = '/' + rootUrl + '/Common/Select/VSelectSingleEmployee.aspx?type=StationAccount&Aim=AddAccount&CorpID=' + corpID;
     var rValue=openModalWindow(sUrl,850,600);
     if(rValue && rValue.length>0)
     {                
        rValue=rValue.split('|');
        $('#txtAccount').val(rValue[1]);
        $('#hidAccountID').val(rValue[0]);
        $('#hidDefaultStationID').val(rValue[2]);
        $("#hidByAdd").val(rValue[3]);
        return true;               
     }
     return false;     
}

// 检测表单数据是否合法
function validateSize()
{ 
   handleBtn(false);
   var objStationName=$('#txtStationName').val().Trim();
   var objDept=$('#hidDeptID').val().Trim();
   
    if($("#tbGroup tr:gt(0)").length > 0)
    {
        var ids = "";
        $("#tbGroup tr:gt(0)").each(function(){
            ids += "|" + this.id;
        });
        $("#hidGroupIDs").val(ids.substr(1));
    }
   
   if(objStationName.length<=0)
    {
        alert("岗位名称不能为空!");
        $('#txtStationName').get(0).focus();
        handleBtn(true);
        return false;
    }
    if(objStationName.indexOf("(")!=-1 || objStationName.indexOf(")")!=-1)
    {
        alert("岗位名称不能包含括号!");
        $('#txtStationName').get(0).focus();
        handleBtn(true);
        return false;
    }
    if( objDept.length<=0)
    {
        alert("部门不能为空!");
        handleBtn(true);
        return false;
    }

    return true;
}

// 设置按钮状态
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

// 重新加载Grid数据
function reloadData()
{
    var query = {StruID:parent["StruID"], StruType:parent["StruType"], Range:$("#ddlRange", parent.document).val(), KW:$("#txtKW", parent.document).val()};
    
    if (loadJQGrid("jqGrid1", query))
    {
//        addParamsForJQGridQuery("jqGrid1", [query]);
        refreshJQGrid("jqGrid1");
    }
}

// 岗位查看
function showStation(cellvalue, options, rowobject)
{
    var struID = parent["StruID"];
    var url = "'VStationInfoBrowse.aspx?StationID=" + rowobject[0]+"&StruID="+struID + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>' ;
}

// 设置
function warrant(cellvalue, options, rowobject)
{
    var struID = parent["StruID"];
    var url = "'../Permission/VWarrant.aspx?Aim=Station&ID=" + rowobject[0]+"&StruID="+struID + "'" ;
    return '<a href="javascript:window.openWindow(' + url + ',960,650)">设置</a>' ; 
}

//岗位变动记录
function stationChange(cellvalue, options, rowobject)
{
    var url = "'VSingleStationChange.aspx?StationID=" + options.rowId + "'";
    return '<a href="javascript:window.openWindow(' + url + ',600,450)">查看</a>';
}

// 帐号查看
function showAccount(accountID)
{
    openWindow("/" + rootUrl + "/OperAllow/Account/VAccountBrowse.aspx?AccountID=" + accountID, 650, 600);
}


// 加载所有架构
function loadStrudcture()
{
    $(".pagedesc", parent.document).html("");
    ajaxRequest("VStationLeft.aspx", { AjaxRequest: true }, "html", refreshStructure);
}

// 刷新架构
function refreshStructure(data, textStatus)
{
    $(document.body).html(data);

    //add by dingdj 20120822
    //通过URL传入参数isShowDefault=Y时，通过js控制加载默认部门
    var isShowDefault = getParamValue("isShowDefault");
    var StruID = $("#hidStruID").val();
    if (isShowDefault && isShowDefault == "Y" && StruID && StruID != "")
    {
        var StruSpans = $("span");
        //找到当前帐号StruID对应的span
        var reg = new RegExp(StruID);
        for (var i = 0; i < StruSpans.length; i++)
        {
            if (StruSpans[i].onclick && reg.test(StruSpans[i].onclick.toString()))
            {
                window.parent["Selected"] = StruSpans[i].id;
                break;
            }
        }
    }

    //是否传递了部门ID 宝能定制
    var strStruID = getParamValue("StruID");
    if (strStruID)
    {
        var sStruSpans = $("span");
        //找到当前帐号StruID对应的span
        var reg = new RegExp(strStruID);
        for (var i = 0; i < sStruSpans.length; i++)
        {
            if (sStruSpans[i].onclick && reg.test(sStruSpans[i].onclick.toString()))
            {
                window.parent["Selected"] = sStruSpans[i].id;
                break;
            }
        }
    }

    var spanID = window.parent["Selected"];
    if (!spanID)
    {
        spanID = "span_0";
    }
    var span = getObj(spanID);

    if (span)
    {

        $(span).trigger("click");
        //span.scrollIntoView(false);
    }
    else
    {
        window.parent["StruID"] = null;
        window.parent["StruType"] = null;
    }

    showLayerTool();
}

// 显示展开或折叠链接
function showLayerTool()
{
    var maxlevel = 0;
    $("#divMPList tr[id]").each(function ()
    {
        var level = this.id.split(".").length;
        if (level > maxlevel)
        {
            maxlevel = level;
        }
    });

    for (var i = 0; i < maxlevel; i++)
    {
        $(".pagedesc", parent.document).append('<a class="fontsize" href="javascript:void(0)" onclick="frames(\'Left\').expColStru(' + (i + 1) + ')">['
            + ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][i] + ']</a>&nbsp;');
    }
}

// 展开或折叠架构
function expColStru(i)
{
    showLayerTG($('#divMPList table')[0], i, 0, 0);
}

// 显示架构岗位
function showStructure(span, struID, struType)
{
    if (window.parent["Selected"])
    {
        var preSpan = getObj(window.parent["Selected"]);
        if (preSpan)
        {
            preSpan.className = "normalNode";
        }
    }
    span.className = "selNode";
    window.parent["Selected"] = span.id;
    
    window.parent["StruID"] = struID;
    window.parent["StruType"] = struType;
    var ddlRange = getObjP("ddlRange");
    if (ddlRange)
    {
        for (var i = 0; i < ddlRange.options.length; i++)
        {
            if (struType == "C")
            {
                ddlRange.options[i].text = ddlRange.options[i].text.replace(/部门/g, '公司');
            }
            else
            {
                ddlRange.options[i].text = ddlRange.options[i].text.replace(/公司/g, '部门');
            }
        }
    }
   execFrameFuns("Main", function () { window.parent.frames("Main").reloadData(); }, window.parent);   
}

// 下拉菜单
function clickMenu(key)
{
    switch (key)
    {
        case "Setting":
            openModifyWindow("/" + rootUrl + "/Knowledge/Archives/VStationSubscription.aspx", 800, 550, "jqGrid1","Main")
            break;
        case "Export":
            window.frames("Main").btnExport.click();
            break;
        case "Import":
            openWindow("VStationExcelImport.aspx", 500, 200);
            break;
    }
}