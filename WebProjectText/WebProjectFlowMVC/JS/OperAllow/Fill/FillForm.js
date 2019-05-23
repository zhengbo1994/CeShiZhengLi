/*----- VFillForm.aspx -----*/
function reloadData(id)
{
    window.frames("Left").location = "VFillFormLeft.aspx?ModuleID=" + getParamValue("ModuleID");
    execFrameFuns("Left", function () { window.frames("Left").refreshTree(id); }, window);
}

function addFillForm()
{
    var typeid = window.frames("Left").$(".selNode").attr("id");
    if (typeid == "")
    {
        return alertMsg("请选择一个类别。");
    }
    var url = "VFillFormAdd.aspx?TypeID=" + typeid;
    url = addUrlParam(url, "ModuleID", getParamValue("ModuleID"));
    openWindow(url, 700, 500);
}

function editFillForm()
{
    var formid = window.frames("Main").getJQGridSelectedRowsID("jqGrid1", false);
    if (!formid)
    {
        return alertMsg("请选择要修改的记录。");
    }
    url = "VFillFormEdit.aspx?FormID=" + formid;
    url = addUrlParam(url, "ModuleID", getParamValue("ModuleID"));
    openWindow(url, 700, 650);
}

function deleteFillForm()
{
    openDeleteWindow("FillForm", 0, "jqGrid1", "Main");
}
/*----- VFillFormLeft.aspx -----*/
function showFillForm(span, id)
{
    changeBackgroundColor(span);

    url = "VFillFormMain.aspx?TypeID=" + id;
    url = addUrlParam(url, "ModuleID", getParamValue("ModuleID"));
    window.parent.frames("Main").location = url;
}

function changeBackgroundColor(span)
{
    $(".selNode").removeClass("selNode").addClass("normalNode");
    $(span).removeClass("normalNode").addClass("selNode");
}

function refreshTree(id)
{
    if (id)
    {
        $("span[id=" + id + "]").click();
    }
    else
    {
        $("span:first").click();
    }
}

/*----- VFillFormMain.aspx -----*/
function renderBrowseLink(cellvalue, options, rowobject)
{
    var url = "'VFillFormBrowse.aspx?FormID=" + rowobject[0] + "&ModuleID" + getParamValue("ModuleID") + "'";
    return '<a  href="#Form" onclick="javascript:openWindow(' + url + ',650, 650)">' + cellvalue + '</a>';
}

/*----- VFillFormAdd.aspx -----*/
function selectTemplate()
{
    var bValue = openModalWindow("VFillFormExcelTemplateSelect.aspx", 600, 600);
    if (bValue)
    {
        $("#hidRelationID").val(bValue.TempID);
        $("#txtTemplateName").val(bValue.TempName);
        ajax("Fill.ashx", { "Action": "GetTemplate", "TemplateID": bValue.TempID }, "json", setTemplateMainField);
    }
}

function setTemplateMainField(data)
{
    var templateHtml = $("#trFieldTemplate").get(0).outerHTML;
    var tb = $("#tbFields").get(0);
    clearTable(tb, 1);

    var fields = data.Fields;
    for (var i = 0; i < fields.length; i++)
    {
        var template = templateHtml;
        template = template.replace("{$Class}", i % 2 == 0 ? "dg_altrow" : "dg_row");
        var row = $(template).removeAttr("id");
        row.find("#txtFieldID").val(fields[i].FieldID);
        row.find("#txtFieldName").val(fields[i].FieldName);
        row.find("#txtFieldType").val(fields[i].FieldType);
        row.find("#txtFieldNo").val(fields[i].OrderIndex);
        if (i == 0)
        {
            //默认第一个为主键
            row.find("#rdlPrimaryKey :input:first").attr("checked", true);
        }
        row.find("#rdlPrimaryKey :input").attr("name", "a" + i);
        row.find("#rdlShowPortal :input").attr("name", "b" + i);
        $(tb).append(row);
    }
}

function changeFillMode()
{
    if ($("#rdlFillMode input:checked").val() == "1")
    {
        $("#trTemplate").show();
        $("#trFieldSetting").show();
        $("#trMultiFill").show();
        $("#trFilter").show();
    }
    else
    {
        $("#trTemplate").hide();
        $("#trFieldSetting").hide();
        $("#trMultiFill").hide();
        $("#trFilter").hide();
    }
    $("#rdlFillMode input:checked").val() == "2" ? $("#trAttachment").show() : $("#trAttachment").hide();
}

function validateSize()
{
    if (trim($("#txtFormName").val()) == "")
    {
        return alertMsg("表单名称不能为空。", $("#txtFormName"));
    }
    if ($("#rdlFillMode input:checked").length == 0)
    {
        return alertMsg("必须选择一项文档类型。");
    }

    if ($("#rdlFillMode input:checked").val() == "1")
    {
        if ($("#hidRelationID").val() == "")
        {
            return alertMsg("Excel模板不能为空。", $("#txtTemplateName"));
        }
        var mainfields = getTemplateMainField();
        var primaryflag = false;
        var portalflag = false;
        for (var i = 0; i < mainfields.length; i++)
        {
            if (mainfields[i].IsPrimaryKey)
            {
                primaryflag = true;
            }
            if (mainfields[i].IsShowPortal)
            {
                portalflag = true;
            }
        }
        if (!primaryflag)
        {
            return alertMsg("至少选择一列做为主键。");
        }
        if (!portalflag)
        {
            return alertMsg("至少选择一列在首页显示。");
        }

        $("#hidMainField").val($.jsonToString(mainfields));
    }
    else if ($("#rdlFillMode input:checked").val() == "2")
    {
        if ($("#uploadAttachment").get(0).rows.length == 0)
        {
            return alertMsg("至少上传一份文档。");
        }
    }

    return true;
}

function getTemplateMainField()
{
    var fields = [];
    $("#tbFields>tbody>tr:gt(0)").each(function ()
    {
        var item = {};
        item.TemplateID = "";
        item.FieldID = $(this).find("#txtFieldID").val();
        item.FieldName = $(this).find("#txtFieldName").val();
        item.FieldType = $(this).find("#txtFieldType").val();
        item.IsPrimaryKey = $(this).find("#rdlPrimaryKey input:checked").val() == "Y";
        item.IsShowPortal = $(this).find("#rdlShowPortal input:checked").val() == "Y";
        item.RowNo = $(this).find("#txtFieldNo").val();
        item.Remark = "";
        fields.push(item);
    })
    return fields;
}

/* ----- VFillFormBrowse.aspx ----- */
function showFormImg(url, width, height)
{
    url = "/" + rootUrl + url;
    openWindow(url, width, height);
}

function initTemplateMainField(data)
{
    var templateHtml = $("#trFieldTemplate").get(0).outerHTML;
    var tb = $("#tbFields").get(0);
    clearTable(tb, 1);

    var fields = $.stringToJSON(data);
    for (var i = 0; i < fields.length; i++)
    {
        var template = templateHtml;
        template = template.replace("{$Class}", i % 2 == 0 ? "dg_altrow" : "dg_row");
        var row = $(template).removeAttr("id");
        row.find("#txtFieldID").val(fields[i].FieldID);
        row.find("#txtFieldName").val(fields[i].FieldName);
        row.find("#txtFieldType").val(fields[i].FieldType);
        row.find("#txtFieldNo").val(fields[i].RowNo);
        row.find("#rdlPrimaryKey :input:first").attr("checked", fields[i].IsPrimaryKey);
        row.find("#rdlShowPortal :input:first").attr("checked", fields[i].IsShowPortal);
        row.find("#rdlPrimaryKey :input").attr("name", "a" + i);
        row.find("#rdlShowPortal :input").attr("name", "b" + i);
        $(tb).append(row);
    }
}

//重写此方法，可以输入英文逗号
function checkSize(txt, size)
{
    // edit by chengam 20130929
    if (txt.readOnly)
    {
        return false;
    }

    if (txt.value.replace(/[^\x00-\xff]/g, '**').length <= size)
    {
        return false;
    }

    txt.value = getStringByLength(txt.value, size, false);
}