//**********************************************按钮事件************************************//
//Button重写客户端定义：
//var RebindBtnArray=["Add","Edit"]; 已重写的btn绑定事件集合
//function RebindBtnAction(btnObj,btnType)  //具体实现重写函数，不重定义函数则使用默认
// {
//
// }

//function ddlProjectChangeAction()     //项目下拉控件切换事件方法，默认调用查询方法。
//{ 
//}


$(document).ready(function ()
{
    $("#btnAreaDiv").find("[ButtonType]").each(function ()
    {
        var $btn = $(this);
        if (typeof RebindBtnArray != "undefined" && RebindBtnArray)
        {
            //如果客户端已重写，调用后return；
            if ($.inArray($btn.attr("ButtonType"), RebindBtnArray) > -1)
            {
                if (typeof RebindBtnAction == "function")
                {
                    RebindBtnAction(this, $btn.attr("ButtonType"));
                }
                return;
            }
        }
        if ($btn.attr("ButtonType") == "Add")
        {
            $btn.bind("click", add);
        }
        if ($btn.attr("ButtonType") == "Edit")
        {
            $btn.bind("click", edit);
        }
        if ($btn.attr("ButtonType") == "Revision")
        {
            $btn.bind("click", revision);
        }
        if ($btn.attr("ButtonType") == "Delete")
        {
            if ($btn.attr("id").indexOf("CompleteDelete") != -1)
            {
                $btn.bind("click", delComplete);
            }
            else
            {
                $btn.bind("click", del);
            }
        }
        if ($btn.attr("ButtonType") == "Relation")
        {
            $btn.bind("click", relate);
        }
        //撤销
        if ($btn.attr("ButtonType") == "Revoke")
        {
            $btn.bind("click", revoke);
        }
        //还原
        if ($btn.attr("ButtonType") == "Revert")
        {
            $btn.bind("click", revert);
        }
        if ($btn.attr("ButtonType") == "Export")
        {
            $btn.bind("click", exportDatas);
        }
    });

    //当登记类型的字段为“IsNeedCheck”时，要交换一下ddlAddClass的项的值。
    var ddlAddClassOptions = $("#ddlAddClass_IsNeedCheck").children();
    ddlAddClassOptions.each(
        function ()
        {
            this.value = this.value != "" ? (this.value == "Y" ? "N" : "Y") : "";
        }
    );
    //按钮显示控制
    setBtnShow();
    //请求数据加载
    queryDatas();
    //处理多表头信息
    setGroupHeaders();
});

function add()
{
    //    var url = "VMyContractAdd.aspx";
    var $sender = $(event.srcElement);
    var url=$sender.attr("LinkUrl");
    var projectID = $("#ddlProject_ProjectID").val();

    openAddWindow(addUrlParam("/" + rootUrl + url, "ProjectID", projectID), 1000, 800, "jqGrid");
}
function edit()
{
    //        var url="VManageContractEdit.aspx";
    var $sender = $(event.srcElement);
    var url = $sender.attr("LinkUrl");
    openModifyWindow("/" + rootUrl + url, 700, 500, "jqGrid");
}

function del()
{
    var modelStr = $("#hidDocType").val();
    if (!checkSelect("jqGrid"))
        return;
    //验证是否可删除
    if (typeof (deleteIsEnabled) == "function" && deleteIsEnabled)
    {
        if (!deleteIsEnabled("jqGrid"))
        {
            return alertMsg("部分数据不能删除。");
         }
     }
    openDeleteWindow(modelStr, 4, "jqGrid", null, { Msg: 'Y', From: 'Manage' });
}

function delComplete()
{
    var modelStr = $("#hidDocType").val();
    openDeleteWindow(modelStr+"Complete", 4, "jqGrid", null, { From: 'Manage' });
}
//环节调整
function revision()
{
    var modelStr = $("#hidDocType").val();
    openRevisionWindow("jqGrid");
}
//还原
function revert()
{
    var modelStr = $("#hidDocType").val();
    openResumeWindow(modelStr, "jqGrid");
}
//撤销
function revoke()
{
    var modelStr = $("#hidDocType").val();
    openRevokeWindow(modelStr, "jqGrid");
}

function relate()
{
    var modelStr = $("#hidDocType").val();
    openRelateWindow("jqGrid", modelStr);
}

function exportDatas()
{
    ajaxRequest(
        "ListCommonPage.aspx",
        { ExportData: "Y", PageID: $("#hidPageID").val(), DocType: $("#hidDocType").val(), QueryDatas: getQueryParameter() },
        "json",
        downloadExportFile
    );
}

function clickMenu(key)
{
    switch (key)
    {
        case "FilterColumn":
            filterColumn();
            break;
        case "SetVisibleColumn":
            setVisibleColumn();
            break;
    }
}

function setBtnShow()
{
    var obj = $("#ddlIsDelete_IsDelete");
    //目前RealDelete与Delete用的是同一个ButtonType，需要加一个RealDelete的ButtonType才能两者通用
    if (obj.val() == 'Y')
    {
        $("#hidIsDelete").val('Y');

        $("#btnCompleteDelete_tb").show();
        $("#btnRevert_tb").show();
        $("#btnEdit_tb").hide();
        $("#btnDelete_tb").hide();
        $("#btnRevision_tb").hide();

        $("#jqGrid").showCol("DeleteEmployeeName");
        $("#jqGrid").showCol("DeleteDate");
        $("#jqGrid").showCol("DeleteRemark");
    }
    else
    {
        $("#hidIsDelete").val('N');

        $("#btnCompleteDelete_tb").hide();
        $("#btnRevert_tb").hide();
        $("#btnEdit_tb").show();
        $("#btnDelete_tb").show();
        $("#btnRevision_tb").show();

        $("#jqGrid").hideCol("DeleteEmployeeName");
        $("#jqGrid").hideCol("DeleteDate");
        $("#jqGrid").hideCol("DeleteRemark");
    }
}

/**********************************控件库控件切换事件*****************************/
//切换是否删除
function isDeleteQueryChange()
{
    if (typeof isDeleteChangeAction == "function")
    {
        isDeleteChangeAction();
    }
    else
    {
        queryDatas();
        setBtnShow();
    }
}

//切换项目
function projectQueryChange()
{
    if (typeof ddlProjectChangeAction == "function")
    {
        ddlProjectChangeAction();
    }
    else
    {
        queryDatas();
    }
}

//切换审核状态
function ccStateQueryChange()
{
    if (typeof ddlCCStateChangeAction == "function")
    {
        ddlCCStateChangeAction();
    }
    else
    {
        queryDatas();
    }
}

//切换登记类型
function addClassQueryChange()
{
    if (typeof ddlAddClassChangeAction == "function")
    {
        ddlAddClassChangeAction();
    }
    else
    {
        queryDatas();
    }
}

//切换处理类型
function dealTypeQueryChange()
{
    if (typeof ddlDealTypeChangeAction == "function")
    {
        ddlDealTypeChangeAction();
    }
    else
    {
        queryDatas();
    }
}
//**********************************END控件库控件切换事件END*****************************//

//**********************************************按钮事件************************************//

//设置显示项
function setVisibleColumn()
{
    var jqWidth = getJQGridWidth("jqGrid");
    var pageID = $("#hidPageID").val();
    var columnStatus = $('#jqGrid').getGridParam('colModel');
    var rltValue = window.openModalWindow('SelectColumn.aspx?PageID=' + pageID, 150, 500, columnStatus);
    if (rltValue)
    {
        $(rltValue).each(function ()
        {
            if (this.Display)
            {
                jQuery("#jqGrid").jqGrid('showCol', this.DataField).setGridWidth(jqWidth,true);
            }
            else
            {
                jQuery("#jqGrid").jqGrid('hideCol', this.DataField).setGridWidth(jqWidth, true);
            }
        });
    }
}

//查询数据
function queryDatas()
{
    //获取其他筛选条件，并push到rltArray
    var query = { QueryDatas: this.getQueryParameter() };
    if (loadJQGrid("jqGrid", query))
    {
        $('#jqGrid').trigger('reloadGrid');
    }
//    $("#jqGrid").getGridParam("postData").QueryDatas = rltJson;
//    //$("#jqGrid").getGridParam("postData").AdvanceQueryDatas = {};其他筛选条件，待补充

//    refreshJQGrid("jqGrid");
    return false;
}

//获取查询条件的Json对象字符串
function getQueryParameter()
{
    var rltArray = [];
    var hasPcsArray = [];
    $("body").find("[IsQueryValue=true]").each(function ()
    {
        //检查是否已经处理过此控件
        var ctlObj = $(this);
        var thisid = ctlObj.attr("id");

        if ($.inArray(thisid, hasPcsArray) > -1)
        {
            return;
        }
        hasPcsArray.push(thisid);
        //组装控件返回格式
        var controlJson = {};
        controlJson.PropName = thisid.substring(thisid.lastIndexOf("_") + 1);
        controlJson.ControlType = ctlObj.attr("ControlType");
        //特殊控件：betweentime
        if (ctlObj.attr("IsBetweenTimeStart") == "true")
        {
            var endObj = ctlObj.closest("table").find("[IsBetweenTimeEnd=true]");
            hasPcsArray.push(endObj.attr("id"));
            var startValue = ctlObj.val();
            var endValue = endObj.val();
            controlJson.PropValue = startValue + "~" + endValue; //将;改为~ 否则后台会将;分隔掉  gaowh 2013-08-21
        }
        else
        {
            controlJson.PropValue = ctlObj.val();
        }
        rltArray.push(controlJson);
    });

    return $.jsonToString(rltArray);
}


//获取其他查询条件
function getAdvanceQuery()
{
    //待实现
    return [];
}

function reloadData()
{
    //调用其他自定义js函数
    if (typeof customReloadData == "function")
    {
        customReloadData();
    }
    else
    {
        refreshJQGrid("jqGrid");
    }
}

//将IsNeedCheck转换成中文
function transferIsNeedCheck(cellvalue, options, rowobject)
{
    if (cellvalue == "Y" || cellvalue.toLowerCase() == "true")
    {
        return "正常申请";
    }
    return "直接登记";
}
//将IsAddClass转换成中文
function transferIsAddClass(cellvalue, options, rowobject)
{
    if (cellvalue == "N" || cellvalue.toLowerCase() == "false")
    {
        return "正常申请";
    }
    return "直接登记";
}

//**********************************************处理多表头************************************//
function setGroupHeaders()
{
//    jQuery("#jqGrid").jqGrid('setGroupHeaders', {
//      useColSpanStyle: true, 
//      groupHeaders:[
//	    {startColumnName: 'StateName', numberOfColumns: 3, titleText: '<em>测试组合表头1</em>'},
//	    {startColumnName: 'CurrentState', numberOfColumns: 2, titleText: '测试组合表头2'}
//      ]
//    });

    var groupHeaders = $("#hidGroupHeaders").val();
    if (!groupHeaders || groupHeaders == [] || groupHeaders == {})
    {
        return;
    }
    //按上面格式拼接完成后触发

}
//**********************************************处理多表头************************************//

